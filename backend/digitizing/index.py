import os
import json
import psycopg2  # noqa
from psycopg2.extras import RealDictCursor

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def fmt_date(d):
    return d.strftime('%d.%m.%Y') if d else None

def handler(event: dict, context) -> dict:
    """Получение и сохранение данных раздела Оцифровка"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters') or {}
    path_params = event.get('pathParameters') or {}
    order_id = query_params.get('id') or path_params.get('id')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if order_id:
            # Полная карточка одной заявки
            cur.execute("SELECT * FROM digitizing_orders WHERE id = %s" % int(order_id))
            order = cur.fetchone()

            if not order:
                cur.close(); conn.close()
                return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Not found'})}

            cur.execute("SELECT * FROM digitizing_activities WHERE order_id = %s LIMIT 1" % int(order_id))
            activities = cur.fetchone()

            cur.execute("SELECT * FROM digitizing_candidates WHERE order_id = %s ORDER BY sent_date DESC" % int(order_id))
            candidates = cur.fetchall()

            cur.execute("SELECT * FROM digitizing_replacements WHERE order_id = %s ORDER BY replacement_date DESC" % int(order_id))
            replacements = cur.fetchall()

            cur.execute("SELECT * FROM digitizing_acts WHERE order_id = %s LIMIT 1" % int(order_id))
            act = cur.fetchone()

            cur.close(); conn.close()

            result = dict(order)
            result['activities'] = dict(activities) if activities else {}
            result['candidates'] = [dict(c) for c in candidates]
            result['replacements'] = [dict(r) for r in replacements]
            result['act'] = dict(act) if act else {}
            # сериализуем даты
            for key, val in result.items():
                if hasattr(val, 'strftime'):
                    result[key] = fmt_date(val)
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, default=str)}

        else:
            # Список всех заявок с агрегатами активностей
            cur.execute("""
                SELECT
                    o.id, o.number, o.client_legal, o.brand, o.position, o.city,
                    o.stage, o.recruiter, o.date_advance, o.amount,
                    o.resource_plan, o.resource_fact,
                    o.date_closed, o.updated_at,
                    COALESCE(a.resumes_viewed,0) as resumes_viewed,
                    COALESCE(a.calls_hh_free,0) as calls_hh_free,
                    COALESCE(a.calls_hh_paid,0) as calls_hh_paid,
                    COALESCE(a.calls_avito,0) as calls_avito,
                    COALESCE(a.interviews,0) as interviews,
                    COALESCE(a.assessments,0) as assessments,
                    COALESCE(a.shows,0) as shows,
                    COALESCE(a.internships,0) as internships,
                    act.act_number, act.act_date, act.act_amount, act.candidate_name as act_candidate,
                    act.guarantee_period
                FROM digitizing_orders o
                LEFT JOIN digitizing_activities a ON a.order_id = o.id
                LEFT JOIN digitizing_acts act ON act.order_id = o.id
                ORDER BY o.date_advance DESC
            """)
            rows = cur.fetchall()
            cur.close(); conn.close()
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(r) for r in rows], default=str)
            }

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        action = body.get('action', 'create_order')
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if action == 'update_activities':
            oid = body['order_id']
            cur.execute("""
                INSERT INTO digitizing_activities (order_id, resumes_viewed, calls_hh_free, calls_hh_paid, calls_avito, interviews, assessments, shows, internships)
                VALUES (%(order_id)s, %(resumes_viewed)s, %(calls_hh_free)s, %(calls_hh_paid)s, %(calls_avito)s, %(interviews)s, %(assessments)s, %(shows)s, %(internships)s)
                ON CONFLICT (order_id) DO UPDATE SET
                    resumes_viewed = EXCLUDED.resumes_viewed,
                    calls_hh_free = EXCLUDED.calls_hh_free,
                    calls_hh_paid = EXCLUDED.calls_hh_paid,
                    calls_avito = EXCLUDED.calls_avito,
                    interviews = EXCLUDED.interviews,
                    assessments = EXCLUDED.assessments,
                    shows = EXCLUDED.shows,
                    internships = EXCLUDED.internships,
                    updated_at = NOW()
            """, body)
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        if action == 'update_payment_status':
            oid = body['order_id']
            field = body['field']
            status = body['status']
            date_val = body.get('date')
            allowed = ['payment_sales', 'payment_profile', 'payment_recruiting', 'payment_management', 'payment_group_head']
            if field not in allowed:
                cur.close(); conn.close()
                return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'invalid field'})}
            if date_val:
                cur.execute("UPDATE digitizing_orders SET %s_status = '%s', %s_date = '%s', updated_at = NOW() WHERE id = %s" % (field, status, field, date_val, int(oid)))
            else:
                cur.execute("UPDATE digitizing_orders SET %s_status = '%s', updated_at = NOW() WHERE id = %s" % (field, status, int(oid)))
            conn.commit(); cur.close(); conn.close()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

        cur.close(); conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'unknown action'})}

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}