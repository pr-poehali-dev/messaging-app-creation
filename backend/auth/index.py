"""
Авторизация по номеру телефона через OTP-код.
action в теле запроса: send_otp | verify_otp | me | update_profile | logout
"""
import json
import os
import random
import secrets
import string
from datetime import datetime, timedelta, timezone
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
}

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def get_schema():
    return os.environ.get('MAIN_DB_SCHEMA', 't_p40859566_messaging_app_creati')

def ok(data, status=200):
    return {'statusCode': status, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, default=str)}

def err(msg, status=400):
    return {'statusCode': status, 'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg})}

def get_token(event):
    headers = event.get('headers') or {}
    return headers.get('X-Auth-Token') or headers.get('x-auth-token') or ''

def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    body = {}
    if event.get('body'):
        try:
            body = json.loads(event['body'])
        except Exception:
            pass

    action = body.get('action') or event.get('queryStringParameters', {}).get('action', '')
    schema = get_schema()

    # send_otp
    if action == 'send_otp':
        phone = (body.get('phone') or '').strip()
        if not phone or len(phone) < 7:
            return err('Некорректный номер телефона')

        normalized = '+' + ''.join(c for c in phone if c.isdigit())
        if len(normalized) < 8:
            return err('Некорректный номер телефона')

        code = ''.join(random.choices(string.digits, k=6))
        expires = datetime.now(timezone.utc) + timedelta(minutes=10)

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {schema}.otp_codes (phone, code, expires_at) VALUES (%s, %s, %s)",
            (normalized, code, expires)
        )
        conn.commit()
        cur.close()
        conn.close()

        return ok({'success': True, 'phone': normalized, 'demo_code': code, 'message': 'Код отправлен'})

    # verify_otp
    if action == 'verify_otp':
        phone = (body.get('phone') or '').strip()
        code = (body.get('code') or '').strip()
        name = (body.get('name') or '').strip()

        if not phone or not code:
            return err('Укажите телефон и код')

        normalized = '+' + ''.join(c for c in phone if c.isdigit())

        conn = get_db()
        cur = conn.cursor()

        cur.execute(
            f"SELECT id FROM {schema}.otp_codes WHERE phone=%s AND code=%s AND expires_at > NOW() AND used=FALSE ORDER BY id DESC LIMIT 1",
            (normalized, code)
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return err('Неверный или истёкший код')

        otp_id = row[0]
        cur.execute(f"UPDATE {schema}.otp_codes SET used=TRUE WHERE id=%s", (otp_id,))

        cur.execute(f"SELECT id, name, username, avatar_color, bio FROM {schema}.users WHERE phone=%s", (normalized,))
        user_row = cur.fetchone()

        if user_row:
            user_id, user_name, username, avatar_color, bio = user_row
            cur.execute(f"UPDATE {schema}.users SET last_seen=NOW() WHERE id=%s", (user_id,))
            is_new = False
        else:
            colors = ['#8B5CF6', '#22D3EE', '#EC4899', '#10B981', '#F97316']
            color = random.choice(colors)
            display_name = name if name else f'Пользователь {normalized[-4:]}'
            cur.execute(
                f"INSERT INTO {schema}.users (phone, name, avatar_color) VALUES (%s, %s, %s) RETURNING id, name, username, avatar_color, bio",
                (normalized, display_name, color)
            )
            user_id, user_name, username, avatar_color, bio = cur.fetchone()
            is_new = True

        token = secrets.token_hex(32)
        cur.execute(f"INSERT INTO {schema}.sessions (token, user_id) VALUES (%s, %s)", (token, user_id))
        conn.commit()
        cur.close()
        conn.close()

        return ok({
            'success': True,
            'token': token,
            'is_new': is_new,
            'user': {'id': user_id, 'phone': normalized, 'name': user_name, 'username': username, 'avatar_color': avatar_color, 'bio': bio or ''}
        })

    # me
    if action == 'me':
        token = get_token(event)
        if not token:
            return err('Не авторизован', 401)

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"""SELECT u.id, u.phone, u.name, u.username, u.avatar_color, u.bio
                FROM {schema}.sessions s
                JOIN {schema}.users u ON u.id = s.user_id
                WHERE s.token=%s AND s.expires_at > NOW()""",
            (token,)
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return err('Сессия истекла', 401)

        return ok({'user': {'id': row[0], 'phone': row[1], 'name': row[2], 'username': row[3], 'avatar_color': row[4], 'bio': row[5] or ''}})

    # update_profile
    if action == 'update_profile':
        token = get_token(event)
        if not token:
            return err('Не авторизован', 401)

        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            f"SELECT u.id FROM {schema}.sessions s JOIN {schema}.users u ON u.id=s.user_id WHERE s.token=%s AND s.expires_at > NOW()",
            (token,)
        )
        row = cur.fetchone()
        if not row:
            cur.close()
            conn.close()
            return err('Сессия истекла', 401)

        user_id = row[0]
        name = (body.get('name') or '').strip()
        bio = (body.get('bio') or '').strip()
        username = (body.get('username') or '').strip() or None

        cur.execute(
            f"UPDATE {schema}.users SET name=%s, bio=%s, username=%s WHERE id=%s RETURNING id, phone, name, username, avatar_color, bio",
            (name, bio, username, user_id)
        )
        updated = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return ok({'user': {'id': updated[0], 'phone': updated[1], 'name': updated[2], 'username': updated[3], 'avatar_color': updated[4], 'bio': updated[5] or ''}})

    # logout
    if action == 'logout':
        token = get_token(event)
        if token:
            conn = get_db()
            cur = conn.cursor()
            cur.execute(f"UPDATE {schema}.sessions SET expires_at=NOW() WHERE token=%s", (token,))
            conn.commit()
            cur.close()
            conn.close()
        return ok({'success': True})

    return err('Неизвестное действие', 400)
