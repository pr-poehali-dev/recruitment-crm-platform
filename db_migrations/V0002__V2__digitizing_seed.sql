
INSERT INTO digitizing_orders (number, client_legal, brand, position, city, stage, recruiter, date_advance, amount, resource_plan, resource_fact)
VALUES
  ('ЗАЯ-2026-001', 'ООО "Альфа Трейд"', 'AlphaTrade', 'Бухгалтер', 'Москва', 'Стажировка', 'Петрова О.В.', '2026-03-01', 120000, 15000, 12400),
  ('ЗАЯ-2026-002', 'ООО "БетаГрупп"', 'BetaGroup', 'Менеджер по продажам', 'Санкт-Петербург', 'Гарантийный период', 'Иванова К.С.', '2026-02-15', 95000, 12000, 9800),
  ('ЗАЯ-2026-003', 'АО "Гамма Холдинг"', 'Gamma', 'Юрист', 'Москва', 'Поиск', 'Петрова О.В.', '2026-04-01', 110000, 10000, 3200);

INSERT INTO digitizing_activities (order_id, resumes_viewed, calls_hh_free, calls_hh_paid, calls_avito, interviews, assessments, shows, internships)
VALUES
  (1, 148, 34, 12, 8, 9, 6, 4, 2),
  (2, 210, 52, 18, 14, 15, 10, 6, 3),
  (3, 67, 18, 4, 2, 3, 2, 1, 0);

INSERT INTO digitizing_acts (order_id, act_number, act_date, act_amount, candidate_name, guarantee_period)
VALUES
  (1, 'АКТ-2026-001', '2026-04-10', 120000, 'Смирнова Ирина Александровна', '3 месяца'),
  (2, 'АКТ-2026-002', '2026-04-05', 95000, 'Козлов Дмитрий Сергеевич', '2 месяца');

INSERT INTO digitizing_candidates (order_id, candidate_name, sent_date)
VALUES
  (1, 'Смирнова И.А.', '2026-03-25'),
  (1, 'Лебедева Т.В.', '2026-03-20'),
  (2, 'Козлов Д.С.', '2026-03-30'),
  (2, 'Орлов Н.П.', '2026-03-28'),
  (3, 'Фёдоров А.К.', '2026-04-15');
