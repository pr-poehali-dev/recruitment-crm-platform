import os
import json
import urllib.request
import urllib.error

def handler(event: dict, context) -> dict:
    """Распознавание скриншота лида через Google Gemini Vision: извлекает компанию, контакт, телефон, email, должность"""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'method not allowed'})}

    body = json.loads(event.get('body') or '{}')
    image_b64 = body.get('image')
    image_type = body.get('type', 'image/png')

    if not image_b64:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'image required'})}

    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        return {'statusCode': 500, 'headers': headers, 'body': json.dumps({'error': 'GEMINI_API_KEY not configured — добавь ключ в Ядро → Секреты'})}

    prompt = """Ты помогаешь заполнять CRM. На скриншоте может быть: письмо, страница сайта, визитка, профиль соцсети, переписка или любой другой источник с контактными данными потенциального клиента.

Извлеки следующие данные (если не найдено — верни пустую строку):
- company: название компании / организации
- contact_name: ФИО контактного лица (ЛПР или менеджера)
- position: должность контактного лица
- contact_phone: номер телефона (первый если несколько)
- contact_email: email адрес
- comment: любая полезная дополнительная информация (направление деятельности, запрос, примечания)

Верни ТОЛЬКО валидный JSON без markdown, без пояснений:
{"company":"...","contact_name":"...","position":"...","contact_phone":"...","contact_email":"...","comment":"..."}"""

    payload = json.dumps({
        "contents": [
            {
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": image_type, "data": image_b64}}
                ]
            }
        ],
        "generationConfig": {"maxOutputTokens": 500, "temperature": 0.1}
    }).encode('utf-8')

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

    req = urllib.request.Request(
        url,
        data=payload,
        headers={'Content-Type': 'application/json'}
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8')
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': f'Gemini error: {err_body}'})}
    except Exception as e:
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': str(e)})}

    try:
        raw = result['candidates'][0]['content']['parts'][0]['text'].strip()
    except (KeyError, IndexError):
        return {'statusCode': 502, 'headers': headers, 'body': json.dumps({'error': 'Не удалось получить ответ от Gemini'})}

    if raw.startswith('```'):
        lines = raw.split('\n')
        raw = '\n'.join(lines[1:-1]) if len(lines) > 2 else raw

    try:
        parsed = json.loads(raw)
    except Exception:
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({
            'company': '', 'contact_name': '', 'position': '',
            'contact_phone': '', 'contact_email': '', 'comment': raw
        })}

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps(parsed)}
