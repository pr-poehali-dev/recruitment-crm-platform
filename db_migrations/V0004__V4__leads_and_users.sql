
CREATE TABLE IF NOT EXISTS project_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO project_users (name, role) VALUES
  ('Петрова О.В.', 'Руководитель проекта'),
  ('Иванова К.С.', 'Руководитель проекта'),
  ('Смирнов А.Д.', 'Руководитель проекта');

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    company VARCHAR(200) NOT NULL,
    contact_name VARCHAR(200),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(100),
    position VARCHAR(200),
    source VARCHAR(100) NOT NULL,
    source_custom VARCHAR(200),
    stage VARCHAR(50) NOT NULL DEFAULT 'Лид',
    manager_id INTEGER REFERENCES project_users(id),
    manager_name VARCHAR(100),
    comment TEXT,
    stage_changed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deal_id INTEGER
);

INSERT INTO leads (company, contact_name, contact_phone, source, stage, manager_id, manager_name, created_at, updated_at, stage_changed_at) VALUES
  ('ООО "Ромашка"', 'Козлов Игорь', '+7 900 111-22-33', 'Яндекс Директ', 'Переговоры', 1, 'Петрова О.В.', '2026-04-01', '2026-04-05', '2026-04-05'),
  ('ИП Сидоров', 'Сидоров Пётр', '+7 900 444-55-66', '2ГИС', 'Лид', 2, 'Иванова К.С.', '2026-04-10', '2026-04-10', '2026-04-10'),
  ('ЗАО "Вектор"', 'Нилова Анна', '+7 900 777-88-99', 'Рекомендация', 'Договор', 1, 'Петрова О.В.', '2026-03-20', '2026-04-12', '2026-04-12'),
  ('ООО "Прогресс"', 'Фёдоров Дмитрий', '+7 900 000-11-22', 'Входящий звонок', 'Ожидание оплаты', 3, 'Смирнов А.Д.', '2026-03-15', '2026-04-18', '2026-04-18'),
  ('АО "Горизонт"', 'Макарова Елена', '+7 900 333-44-55', 'Старая база', 'Лид', 2, 'Иванова К.С.', '2026-04-20', '2026-04-20', '2026-04-20'),
  ('ООО "Стрела"', 'Лебедев Сергей', '+7 900 222-33-44', 'Яндекс Директ', 'Переговоры', 3, 'Смирнов А.Д.', '2026-04-08', '2026-04-15', '2026-04-15');
