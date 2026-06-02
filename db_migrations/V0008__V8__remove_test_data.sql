UPDATE auth_sessions SET expires_at = NOW() WHERE user_id IN (SELECT id FROM auth_users WHERE email = 'test@test.ru');
UPDATE auth_users SET is_active = FALSE WHERE email = 'test@test.ru';
UPDATE companies SET ceo_registered = FALSE, is_active = FALSE WHERE id = 1;