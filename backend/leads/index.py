import os
import json
import psycopg2
from psycopg2.extras import RealDictCursor

SOURCES = ['Яндекс Директ', '2ГИС', 'Входящий звонок', 'Рекомендация', 'Старая база', 'Другое']
STAGES = ['Лид', 'Переговоры', 'Договор', 'Ожидание оплаты']

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """Управление лидами: список, создание, смена стадии, отчёты по воронке и источникам"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', 'list')

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    # GET /  — список лидов или справочники или отчёты
    if method == 'GET':

        if action == 'users':
            cur.execute("SELECT id, name, role FROM project_users ORDER BY name")
            rows = cur.fetchall()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps([dict(r) for r in rows])}

        if action == 'funnel':
            date_from = qs.get('date_from', '2000-01-01')
            date_to = qs.get('date_to', '2100-01-01')
            manager_id = qs.get('manager_id')

            manager_filter = ''
            if manager_id:
                manager_filter = "AND manager_id = %s" % int(manager_id)

            cur.execute("""
                SELECT
                    stage,
                    COUNT(*) as count
                FROM leads
                WHERE created_at::date BETWEEN '%s' AND '%s' %s
                GROUP BY stage
                ORDER BY CASE stage
                    WHEN 'Лид' THEN 1
                    WHEN 'Переговоры' THEN 2
                    WHEN 'Договор' THEN 3
                    WHEN 'Ожидание оплаты' THEN 4
                    ELSE 5
                END
            """ % (date_from, date_to, manager_filter))
            funnel = cur.fetchall()

            # Конвертировано в сделки
            cur.execute("""
                SELECT COUNT(*) as converted
                FROM leads
                WHERE deal_id IS NOT NULL
                AND created_at::date BETWEEN '%s' AND '%s' %s
            """ % (date_from, date_to, manager_filter))
            converted = cur.fetchone()

            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
                'funnel': [dict(r) for r in funnel],
                'converted': int(converted['converted'])
            }, default=str)}

        if action == 'sources':
            date_from = qs.get('date_from', '2000-01-01')
            date_to = qs.get('date_to', '2100-01-01')
            manager_id = qs.get('manager_id')

            manager_filter = ''
            if manager_id:
                manager_filter = "AND manager_id = %s" % int(manager_id)

            cur.execute("""
                SELECT
                    source,
                    COUNT(*) as leads_count,
                    COUNT(deal_id) as deals_count
                FROM leads
                WHERE created_at::date BETWEEN '%s' AND '%s' %s
                GROUP BY source
                ORDER BY leads_count DESC
            """ % (date_from, date_to, manager_filter))
            rows = cur.fetchall()
            cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps([dict(r) for r in rows], default=str)}

        # Список лидов
        date_from = qs.get('date_from', '2000-01-01')
        date_to = qs.get('date_to', '2100-01-01')
        manager_id = qs.get('manager_id')
        stage = qs.get('stage')

        filters = ["l.created_at::date BETWEEN '%s' AND '%s'" % (date_from, date_to)]
        if manager_id:
            filters.append("l.manager_id = %s" % int(manager_id))
        if stage:
            filters.append("l.stage = '%s'" % stage.replace("'", "''"))

        where = 'WHERE ' + ' AND '.join(filters) if filters else ''

        cur.execute("""
            SELECT l.id, l.company, l.contact_name, l.contact_phone, l.contact_email,
                   l.position, l.source, l.source_custom, l.stage, l.manager_id,
                   l.manager_name, l.comment, l.deal_id,
                   l.created_at, l.updated_at, l.stage_changed_at,
                   u.name as manager_display
            FROM leads l
            LEFT JOIN project_users u ON u.id = l.manager_id
            %s
            ORDER BY l.created_at DESC
        """ % where)
        rows = cur.fetchall()
        cur.close(); conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps([dict(r) for r in rows], default=str)}

    # POST — создать или обновить лид
    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        act = body.get('action', 'create')

        if act == 'create':
            source = body.get('source', '')
            source_val = body.get('source_custom', '') if source == 'Другое' else source
            cur.execute("""
                INSERT INTO leads (company, contact_name, contact_phone, contact_email, position, source, source_custom, stage, manager_id, manager_name, comment)
                VALUES ('%s','%s','%s','%s','%s','%s','%s','%s',%s,'%s','%s')
                RETURNING id
            """ % (
                body.get('company','').replace("'","''"),
                body.get('contact_name','').replace("'","''"),
                body.get('contact_phone','').replace("'","''"),
                body.get('contact_email','').replace("'","''"),
                body.get('position','').replace("'","''"),
                source_val.replace("'","''"),
                body.get('source_custom','').replace("'","''"),
                body.get('stage','Лид').replace("'","''"),
                int(body['manager_id']) if body.get('manager_id') else 'NULL',
                body.get('manager_name','').replace("'","''"),
                body.get('comment','').replace("'","''"),
            ))
            new_id = cur.fetchone()['id']
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id})}

        if act == 'update_stage':
            lid = int(body['id'])
            stage = body['stage'].replace("'","''")
            cur.execute("""
                UPDATE leads SET stage='%s', stage_changed_at=NOW(), updated_at=NOW() WHERE id=%s
            """ % (stage, lid))
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        if act == 'convert':
            lid = int(body['id'])
            deal_id = int(body.get('deal_id', 0)) or None
            cur.execute("""
                UPDATE leads SET deal_id=%s, updated_at=NOW() WHERE id=%s
            """ % (deal_id if deal_id else 'NULL', lid))
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'unknown action'})}

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}