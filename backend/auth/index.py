import os
import json
import hashlib
import secrets
import smtplib
import psycopg2
from psycopg2.extras import RealDictCursor
from email.mime.text import MIMEText
from datetime import datetime, timedelta, timezone

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password: str) -> str:
    salt = "crm_salt_v1"
    return hashlib.sha256((salt + password + salt).encode()).hexdigest()

def make_token() -> str:
    return secrets.token_hex(48)

def token_expires() -> str:
    return (datetime.now(timezone.utc) + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S+00')

def send_invite_email(to_email: str, full_name: str, company_name: str, password: str):
    smtp_from = os.environ.get('SMTP_FROM', '')
    smtp_pass = os.environ.get('SMTP_PASSWORD', '')
    if not smtp_from or not smtp_pass:
        return
    body = f"""Привет, {full_name}!\n\nВас пригласили в CRM компании «{company_name}».\n\nEmail: {to_email}\nПароль: {password}\n"""
    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = f'Приглашение в CRM — {company_name}'
    msg['From'] = smtp_from
    msg['To'] = to_email
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
            s.login(smtp_from, smtp_pass)
            s.sendmail(smtp_from, [to_email], msg.as_string())
    except Exception:
        pass

def handler(event: dict, context) -> dict:
    """Авторизация: регистрация CEO+компания, логин, инвайт сотрудника, список сотрудников"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    qs = event.get('queryStringParameters') or {}
    action = qs.get('action', '')
    req_headers = event.get('headers') or {}
    auth_token = req_headers.get('X-Auth-Token') or req_headers.get('x-auth-token') or qs.get('token')

    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)

    def err(msg, code=400):
        cur.close(); conn.close()
        return {'statusCode': code, 'headers': headers, 'body': json.dumps({'error': msg})}

    def ok(data, code=200):
        cur.close(); conn.close()
        return {'statusCode': code, 'headers': headers, 'body': json.dumps(data, default=str)}

    def get_current_user():
        if not auth_token:
            return None
        cur.execute("""
            SELECT u.id, u.full_name, u.email, u.role, u.company_id, c.name as company_name
            FROM auth_sessions s
            JOIN auth_users u ON u.id = s.user_id
            JOIN companies c ON c.id = u.company_id
            WHERE s.token = '%s' AND s.expires_at > NOW() AND u.is_active = TRUE
        """ % auth_token.replace("'", "''"))
        return cur.fetchone()

    if method == 'GET' and action == 'me':
        user = get_current_user()
        if not user:
            return err('Не авторизован', 401)
        return ok(dict(user))

    if method == 'GET' and action == 'company_exists':
        cur.execute("SELECT COUNT(*) as cnt FROM companies WHERE ceo_registered = TRUE")
        row = cur.fetchone()
        return ok({'exists': int(row['cnt']) > 0})

    if method == 'GET' and action == 'employees':
        user = get_current_user()
        if not user:
            return err('Не авторизован', 401)
        cur.execute("""
            SELECT id, full_name, email, role, is_active, created_at
            FROM auth_users WHERE company_id = %s ORDER BY created_at
        """ % int(user['company_id']))
        rows = cur.fetchall()
        return ok([dict(r) for r in rows])

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        act = body.get('action', '')

        if act == 'register':
            cur.execute("SELECT COUNT(*) as cnt FROM companies WHERE ceo_registered = TRUE")
            if int(cur.fetchone()['cnt']) > 0:
                return err('Компания уже зарегистрирована. Войдите или обратитесь к администратору.')

            company_name = body.get('company_name', '').strip()
            full_name = body.get('full_name', '').strip()
            email = body.get('email', '').strip().lower()
            password = body.get('password', '')

            if not company_name or not full_name or not email or not password:
                return err('Заполните все поля')
            if len(password) < 6:
                return err('Пароль минимум 6 символов')

            cn = company_name.replace("'", "''")
            fn = full_name.replace("'", "''")
            em = email.replace("'", "''")
            pw_hash = hash_password(password)

            # Переиспользуем незавершённую компанию если есть
            cur.execute("SELECT id FROM companies WHERE ceo_registered = FALSE LIMIT 1")
            existing = cur.fetchone()
            if existing:
                company_id = existing['id']
                cur.execute("UPDATE companies SET name='%s', is_active=TRUE WHERE id=%s" % (cn, company_id))
            else:
                cur.execute("INSERT INTO companies (name) VALUES ('%s') RETURNING id" % cn)
                company_id = cur.fetchone()['id']

            cur.execute("""
                INSERT INTO auth_users (company_id, full_name, email, password_hash, role)
                VALUES (%s, '%s', '%s', '%s', 'ceo') RETURNING id, full_name, email, role, company_id
            """ % (company_id, fn, em, pw_hash))
            user = dict(cur.fetchone())

            cur.execute("UPDATE companies SET ceo_registered=TRUE WHERE id=%s" % company_id)

            token = make_token()
            cur.execute("""
                INSERT INTO auth_sessions (user_id, token, expires_at) VALUES (%s, '%s', '%s')
            """ % (user['id'], token, token_expires()))

            conn.commit()
            return ok({'token': token, 'user': {**user, 'company_name': company_name}}, 201)

        if act == 'login':
            email = body.get('email', '').strip().lower().replace("'", "''")
            password = body.get('password', '')
            pw_hash = hash_password(password)

            cur.execute("""
                SELECT u.id, u.full_name, u.email, u.role, u.company_id, c.name as company_name
                FROM auth_users u JOIN companies c ON c.id = u.company_id
                WHERE u.email = '%s' AND u.password_hash = '%s' AND u.is_active = TRUE
            """ % (email, pw_hash))
            user = cur.fetchone()
            if not user:
                return err('Неверный email или пароль', 401)

            token = make_token()
            cur.execute("""
                INSERT INTO auth_sessions (user_id, token, expires_at) VALUES (%s, '%s', '%s')
            """ % (user['id'], token, token_expires()))

            conn.commit()
            return ok({'token': token, 'user': dict(user)})

        if act == 'invite':
            user = get_current_user()
            if not user:
                return err('Не авторизован', 401)
            if user['role'] not in ('ceo', 'team_lead'):
                return err('Недостаточно прав', 403)

            full_name = body.get('full_name', '').strip().replace("'", "''")
            email = body.get('email', '').strip().lower().replace("'", "''")
            role = body.get('role', 'employee').replace("'", "''")

            if not full_name or not email:
                return err('Укажите ФИО и email')

            cur.execute("SELECT id FROM auth_users WHERE email = '%s'" % email)
            if cur.fetchone():
                return err('Пользователь с таким email уже существует')

            temp_password = secrets.token_urlsafe(8)
            pw_hash = hash_password(temp_password)

            cur.execute("""
                INSERT INTO auth_users (company_id, full_name, email, password_hash, role, invited_by)
                VALUES (%s, '%s', '%s', '%s', '%s', %s) RETURNING id, full_name, email, role
            """ % (int(user['company_id']), full_name, email, pw_hash, role, int(user['id'])))
            new_user = dict(cur.fetchone())
            conn.commit()

            send_invite_email(email, full_name, user['company_name'], temp_password)
            return ok({**new_user, 'temp_password': temp_password}, 201)

        if act == 'change_password':
            user = get_current_user()
            if not user:
                return err('Не авторизован', 401)
            new_pw = body.get('new_password', '')
            if len(new_pw) < 6:
                return err('Пароль минимум 6 символов')
            cur.execute("UPDATE auth_users SET password_hash='%s' WHERE id=%s" % (hash_password(new_pw), int(user['id'])))
            conn.commit()
            return ok({'ok': True})

        if act == 'logout':
            if auth_token:
                cur.execute("UPDATE auth_sessions SET expires_at=NOW() WHERE token='%s'" % auth_token.replace("'", "''"))
                conn.commit()
            return ok({'ok': True})

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}
