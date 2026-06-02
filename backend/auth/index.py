import os
import json
import hmac
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
    return hmac.new(os.environ['JWT_SECRET'].encode(), password.encode(), hashlib.sha256).hexdigest()

def make_token() -> str:
    return secrets.token_hex(48)

def token_expires() -> str:
    return (datetime.now(timezone.utc) + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S+00')

def send_invite_email(to_email: str, full_name: str, company_name: str, password: str):
    smtp_from = os.environ.get('SMTP_FROM', '')
    smtp_pass = os.environ.get('SMTP_PASSWORD', '')
    if not smtp_from or not smtp_pass:
        return
    body = f"""Привет, {full_name}!

Вас пригласили в CRM компании «{company_name}».

Ваши данные для входа:
  Email: {to_email}
  Пароль: {password}

Войдите и смените пароль при первом входе.
"""
    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = f'Приглашение в CRM — {company_name}'
    msg['From'] = smtp_from
    msg['To'] = to_email
    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
            s.login(smtp_from, smtp_pass)
            s.sendmail(smtp_from, [to_email], msg.as_string())
    except Exception:
        pass  # не блокируем если почта не настроена

def handler(event: dict, context) -> dict:
    """Авторизация: регистрация CEO+компания, логин, инвайт сотрудника, список сотрудников, смена пароля"""
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
    auth_token = (event.get('headers') or {}).get('X-Auth-Token') or \
                 (event.get('headers') or {}).get('x-auth-token') or \
                 qs.get('token')

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

    # GET /me — проверка токена
    if method == 'GET' and action == 'me':
        user = get_current_user()
        if not user:
            return err('Не авторизован', 401)
        return ok(dict(user))

    # GET /company_exists — есть ли уже компания (для экрана регистрации)
    if method == 'GET' and action == 'company_exists':
        cur.execute("SELECT COUNT(*) as cnt FROM companies")
        row = cur.fetchone()
        return ok({'exists': int(row['cnt']) > 0})

    # GET /employees — список сотрудников (требует авторизации)
    if method == 'GET' and action == 'employees':
        user = get_current_user()
        if not user:
            return err('Не авторизован', 401)
        cur.execute("""
            SELECT id, full_name, email, role, is_active, created_at
            FROM auth_users
            WHERE company_id = %s
            ORDER BY created_at
        """ % int(user['company_id']))
        rows = cur.fetchall()
        return ok([dict(r) for r in rows])

    if method == 'POST':
        body = json.loads(event.get('body') or '{}')
        act = body.get('action', '')

        # Регистрация CEO + создание компании
        if act == 'register':
            cur.execute("SELECT COUNT(*) as cnt FROM companies")
            if int(cur.fetchone()['cnt']) > 0:
                return err('Компания уже зарегистрирована')

            company_name = body.get('company_name', '').strip().replace("'", "''")
            full_name = body.get('full_name', '').strip().replace("'", "''")
            email = body.get('email', '').strip().lower().replace("'", "''")
            password = body.get('password', '')

            if not company_name or not full_name or not email or not password:
                return err('Заполните все поля')
            if len(password) < 6:
                return err('Пароль минимум 6 символов')

            cur.execute("INSERT INTO companies (name) VALUES ('%s') RETURNING id" % company_name)
            company_id = cur.fetchone()['id']

            pw_hash = hash_password(password)
            cur.execute("""
                INSERT INTO auth_users (company_id, full_name, email, password_hash, role)
                VALUES (%s, '%s', '%s', '%s', 'ceo')
                RETURNING id, full_name, email, role, company_id
            """ % (company_id, full_name, email, pw_hash))
            user = dict(cur.fetchone())

            token = make_token()
            cur.execute("""
                INSERT INTO auth_sessions (user_id, token, expires_at)
                VALUES (%s, '%s', '%s')
            """ % (user['id'], token, token_expires()))

            conn.commit()
            return ok({'token': token, 'user': {**user, 'company_name': company_name}}, 201)

        # Вход
        if act == 'login':
            email = body.get('email', '').strip().lower().replace("'", "''")
            password = body.get('password', '')
            pw_hash = hash_password(password)

            cur.execute("""
                SELECT u.id, u.full_name, u.email, u.role, u.company_id, c.name as company_name
                FROM auth_users u
                JOIN companies c ON c.id = u.company_id
                WHERE u.email = '%s' AND u.password_hash = '%s' AND u.is_active = TRUE
            """ % (email, pw_hash))
            user = cur.fetchone()
            if not user:
                return err('Неверный email или пароль', 401)

            token = make_token()
            cur.execute("""
                INSERT INTO auth_sessions (user_id, token, expires_at)
                VALUES (%s, '%s', '%s')
            """ % (user['id'], token, token_expires()))

            conn.commit()
            return ok({'token': token, 'user': dict(user)})

        # Инвайт сотрудника (только CEO или team_lead)
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
                VALUES (%s, '%s', '%s', '%s', '%s', %s)
                RETURNING id, full_name, email, role
            """ % (int(user['company_id']), full_name, email, pw_hash, role, int(user['id'])))
            new_user = dict(cur.fetchone())
            conn.commit()

            send_invite_email(email, full_name, user['company_name'], temp_password)

            return ok({**new_user, 'temp_password': temp_password}, 201)

        # Смена пароля
        if act == 'change_password':
            user = get_current_user()
            if not user:
                return err('Не авторизован', 401)
            new_pw = body.get('new_password', '')
            if len(new_pw) < 6:
                return err('Пароль минимум 6 символов')
            pw_hash = hash_password(new_pw)
            cur.execute("UPDATE auth_users SET password_hash = '%s' WHERE id = %s" % (pw_hash, int(user['id'])))
            conn.commit()
            return ok({'ok': True})

        # Выход
        if act == 'logout':
            if auth_token:
                cur.execute("DELETE FROM auth_sessions WHERE token = '%s'" % auth_token.replace("'", "''"))
                conn.commit()
            return ok({'ok': True})

    cur.close(); conn.close()
    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}
