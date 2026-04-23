import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "dashboard" | "clients" | "tasks" | "recruiting" | "digitizing";

const NAV = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "clients", label: "Клиенты", icon: "Users" },
  { id: "tasks", label: "Задачи", icon: "CheckSquare" },
  { id: "recruiting", label: "Рекрутинг", icon: "UserSearch" },
  { id: "digitizing", label: "Оцифровка", icon: "Database" },
] as const;

export default function Index() {
  const [active, setActive] = useState<Section>("dashboard");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar active={active} onSelect={setActive} />
      <main className="flex-1 overflow-y-auto">
        {active === "dashboard" && <Dashboard />}
        {active === "clients" && <Clients />}
        {active === "tasks" && <Tasks />}
        {active === "recruiting" && <Recruiting />}
        {active === "digitizing" && <Digitizing />}
      </main>
    </div>
  );
}

function Sidebar({ active, onSelect }: { active: Section; onSelect: (s: Section) => void }) {
  return (
    <aside className="w-56 border-r border-border flex flex-col bg-card shrink-0">
      <div className="px-5 py-5 border-b border-border">
        <div className="text-sm font-semibold text-foreground tracking-tight">CRM</div>
        <div className="text-xs text-muted-foreground mt-0.5">Платформа управления</div>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id as Section)}
            className={`nav-item w-full ${active === item.id ? "active" : ""}`}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">А</div>
          <div>
            <div className="text-xs font-medium text-foreground">Администратор</div>
            <div className="text-xs text-muted-foreground">admin@company.ru</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-border">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, delta, icon, color }: { label: string; value: string; delta?: string; icon: string; color: string }) {
  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded flex items-center justify-center ${color}`}>
          <Icon name={icon} size={14} />
        </div>
      </div>
      <div className="text-2xl font-semibold font-mono-nums text-foreground">{value}</div>
      {delta && <div className="text-xs text-success mt-1.5">{delta}</div>}
    </div>
  );
}

function Dashboard() {
  const stats = [
    { label: "Клиентов", value: "248", delta: "+12 за месяц", icon: "Users", color: "bg-blue-500/10 text-blue-400" },
    { label: "Открытых задач", value: "34", delta: "8 просрочено", icon: "CheckSquare", color: "bg-orange-500/10 text-orange-400" },
    { label: "Вакансий", value: "7", delta: "3 активных", icon: "UserSearch", color: "bg-purple-500/10 text-purple-400" },
    { label: "Оцифровано", value: "1 240", delta: "за текущий месяц", icon: "Database", color: "bg-green-500/10 text-green-400" },
  ];

  const recentClients = [
    { name: "ООО «Альфа Групп»", contact: "Иванов А.П.", status: "Активный", date: "22 апр" },
    { name: "ИП Петрова М.С.", contact: "Петрова М.С.", status: "Новый", date: "21 апр" },
    { name: "АО «Техносфера»", contact: "Сидоров В.К.", status: "В работе", date: "20 апр" },
    { name: "ООО «Магнит Трейд»", contact: "Козлов Р.Н.", status: "Активный", date: "19 апр" },
  ];

  return (
    <div>
      <PageHeader title="Дашборд" subtitle="Сводка за апрель 2026" />
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-card border border-border rounded-lg">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Последние клиенты</span>
              <span className="text-xs text-muted-foreground">Апрель 2026</span>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="pl-5">Компания</th>
                  <th>Контакт</th>
                  <th>Статус</th>
                  <th className="pr-5 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.map((c) => (
                  <tr key={c.name} className="hover:bg-muted/40 transition-colors">
                    <td className="pl-5 text-foreground font-medium">{c.name}</td>
                    <td className="text-muted-foreground">{c.contact}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td className="pr-5 text-right text-muted-foreground font-mono-nums">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-4">Задачи сегодня</div>
              <div className="space-y-3">
                {[
                  { text: "Позвонить Иванову", done: true },
                  { text: "Отправить КП «Альфа»", done: false },
                  { text: "Проверить оцифровку", done: false },
                  { text: "Собес — Ковалёв Д.", done: false },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${t.done ? "bg-primary border-primary" : "border-border"}`}>
                      {t.done && <Icon name="Check" size={10} className="text-primary-foreground" />}
                    </div>
                    <span className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-5">
              <div className="text-sm font-medium text-foreground mb-4">Воронка рекрутинга</div>
              {[
                { stage: "Отклики", count: 47, pct: 100 },
                { stage: "Скрининг", count: 28, pct: 60 },
                { stage: "Интервью", count: 11, pct: 23 },
                { stage: "Оффер", count: 3, pct: 6 },
              ].map((s) => (
                <div key={s.stage} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{s.stage}</span>
                    <span className="font-mono-nums text-foreground">{s.count}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Clients() {
  const clients = [
    { name: "ООО «Альфа Групп»", inn: "7701234567", contact: "Иванов А.П.", phone: "+7 495 123-45-67", status: "Активный", revenue: "1 240 000 ₽", since: "янв 2024" },
    { name: "ИП Петрова М.С.", inn: "7702345678", contact: "Петрова М.С.", phone: "+7 916 234-56-78", status: "Новый", revenue: "—", since: "апр 2026" },
    { name: "АО «Техносфера»", inn: "7703456789", contact: "Сидоров В.К.", phone: "+7 499 345-67-89", status: "В работе", revenue: "560 000 ₽", since: "мар 2025" },
    { name: "ООО «Магнит Трейд»", inn: "7704567890", contact: "Козлов Р.Н.", phone: "+7 926 456-78-90", status: "Активный", revenue: "3 100 000 ₽", since: "авг 2023" },
    { name: "ЗАО «СтройКом»", inn: "7705678901", contact: "Лебедев С.И.", phone: "+7 495 567-89-01", status: "Пауза", revenue: "780 000 ₽", since: "май 2024" },
    { name: "ООО «Прогресс»", inn: "7706789012", contact: "Новикова Е.А.", phone: "+7 903 678-90-12", status: "Активный", revenue: "2 450 000 ₽", since: "фев 2024" },
  ];

  return (
    <div>
      <PageHeader
        title="Клиенты"
        subtitle={`${clients.length} компаний`}
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Plus" size={14} />
            Добавить клиента
          </button>
        }
      />
      <div className="p-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 bg-muted rounded px-3 py-1.5">
              <Icon name="Search" size={13} className="text-muted-foreground" />
              <input placeholder="Поиск по клиентам..." className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-full" />
            </div>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded transition-colors">
              <Icon name="Filter" size={13} />
              Фильтр
            </button>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="pl-5">Компания</th>
                <th>ИНН</th>
                <th>Контакт</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Выручка</th>
                <th className="pr-5 text-right">С нами с</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.inn} className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <td className="pl-5 text-foreground font-medium">{c.name}</td>
                  <td className="text-muted-foreground font-mono-nums text-xs">{c.inn}</td>
                  <td className="text-muted-foreground">{c.contact}</td>
                  <td className="text-muted-foreground font-mono-nums text-xs">{c.phone}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="font-mono-nums text-foreground">{c.revenue}</td>
                  <td className="pr-5 text-right text-muted-foreground">{c.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Tasks() {
  const columns = [
    {
      title: "К выполнению",
      color: "text-muted-foreground",
      dot: "bg-muted-foreground",
      tasks: [
        { title: "Подготовить КП для «Техносфера»", client: "АО «Техносфера»", due: "25 апр", priority: "Высокий" },
        { title: "Запросить документы у ИП Петровой", client: "ИП Петрова М.С.", due: "26 апр", priority: "Средний" },
        { title: "Оплата налогов Q1", client: "—", due: "30 апр", priority: "Высокий" },
      ],
    },
    {
      title: "В работе",
      color: "text-info",
      dot: "bg-info",
      tasks: [
        { title: "Аудит договора «Альфа Групп»", client: "ООО «Альфа Групп»", due: "24 апр", priority: "Высокий" },
        { title: "Сверка данных оцифровки", client: "Внутренняя", due: "24 апр", priority: "Средний" },
      ],
    },
    {
      title: "Выполнено",
      color: "text-success",
      dot: "bg-success",
      tasks: [
        { title: "Звонок Иванову А.П.", client: "ООО «Альфа Групп»", due: "22 апр", priority: "Низкий" },
        { title: "Отправить отчёт за март", client: "Внутренняя", due: "21 апр", priority: "Высокий" },
        { title: "Обновить базу клиентов", client: "—", due: "20 апр", priority: "Средний" },
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title="Задачи"
        subtitle="34 открытых · 8 просрочено"
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Plus" size={14} />
            Новая задача
          </button>
        }
      />
      <div className="p-8">
        <div className="grid grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.title}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <span className={`text-xs font-medium uppercase tracking-wider ${col.color}`}>{col.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">{col.tasks.length}</span>
              </div>
              <div className="space-y-3">
                {col.tasks.map((t) => (
                  <div key={t.title} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer animate-fade-in">
                    <div className="text-sm font-medium text-foreground mb-2 leading-snug">{t.title}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground truncate">{t.client}</span>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <PriorityBadge priority={t.priority} />
                        <span className="text-xs text-muted-foreground font-mono-nums">{t.due}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Recruiting() {
  const vacancies = [
    {
      title: "Бухгалтер", dept: "Финансы", opened: "10 апр",
      candidates: [
        { name: "Ковалёв Д.А.", stage: "Интервью", applied: "15 апр", score: 82 },
        { name: "Смирнова Т.В.", stage: "Скрининг", applied: "18 апр", score: 67 },
        { name: "Фёдоров И.С.", stage: "Отклик", applied: "20 апр", score: null },
      ],
    },
    {
      title: "Менеджер по продажам", dept: "Коммерция", opened: "5 апр",
      candidates: [
        { name: "Лазарева О.К.", stage: "Оффер", applied: "8 апр", score: 91 },
        { name: "Морозов П.А.", stage: "Интервью", applied: "12 апр", score: 74 },
      ],
    },
    {
      title: "Юрист", dept: "Правовой", opened: "18 апр",
      candidates: [
        { name: "Степанова А.И.", stage: "Скрининг", applied: "21 апр", score: 58 },
      ],
    },
  ];

  const stageColor: Record<string, string> = {
    "Отклик": "bg-muted text-muted-foreground",
    "Скрининг": "bg-blue-500/10 text-blue-400",
    "Интервью": "bg-orange-500/10 text-orange-400",
    "Оффер": "bg-green-500/10 text-green-400",
  };

  return (
    <div>
      <PageHeader
        title="Рекрутинг"
        subtitle="7 вакансий · 47 кандидатов"
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Plus" size={14} />
            Открыть вакансию
          </button>
        }
      />
      <div className="p-8 space-y-6">
        {vacancies.map((v) => (
          <div key={v.title} className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                  <Icon name="Briefcase" size={14} className="text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{v.title}</div>
                  <div className="text-xs text-muted-foreground">{v.dept} · открыта {v.opened}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{v.candidates.length} кандидата(ов)</span>
                <button className="text-xs text-primary hover:underline">Добавить кандидата</button>
              </div>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="pl-5">Кандидат</th>
                  <th>Этап</th>
                  <th>Дата отклика</th>
                  <th className="pr-5 text-right">Оценка</th>
                </tr>
              </thead>
              <tbody>
                {v.candidates.map((c) => (
                  <tr key={c.name} className="hover:bg-muted/40 transition-colors cursor-pointer">
                    <td className="pl-5 text-foreground font-medium">{c.name}</td>
                    <td>
                      <span className={`badge-status ${stageColor[c.stage]}`}>{c.stage}</span>
                    </td>
                    <td className="text-muted-foreground font-mono-nums text-xs">{c.applied}</td>
                    <td className="pr-5 text-right">
                      {c.score !== null
                        ? <span className={`font-mono-nums text-sm font-medium ${c.score >= 80 ? "text-success" : c.score >= 60 ? "text-warning" : "text-muted-foreground"}`}>{c.score}</span>
                        : <span className="text-muted-foreground">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

function Digitizing() {
  const records = [
    { doc: "Акт №2024-1234", type: "Акт выполненных работ", client: "ООО «Альфа Групп»", amount: "320 000 ₽", date: "22 апр 2026", status: "Обработан" },
    { doc: "Сч-ф №2024-0891", type: "Счёт-фактура", client: "АО «Техносфера»", amount: "128 500 ₽", date: "21 апр 2026", status: "На проверке" },
    { doc: "Д №2024-0445", type: "Договор поставки", client: "ООО «Магнит Трейд»", amount: "—", date: "20 апр 2026", status: "Обработан" },
    { doc: "Акт №2024-1201", type: "Акт сверки", client: "ЗАО «СтройКом»", amount: "780 000 ₽", date: "19 апр 2026", status: "Ошибка" },
    { doc: "Сч №2024-0788", type: "Счёт на оплату", client: "ООО «Прогресс»", amount: "95 000 ₽", date: "18 апр 2026", status: "Обработан" },
    { doc: "Сч-ф №2024-0756", type: "Счёт-фактура", client: "ИП Петрова М.С.", amount: "43 200 ₽", date: "17 апр 2026", status: "На проверке" },
  ];

  const summary = [
    { label: "Обработано", value: "1 228", icon: "FileCheck", color: "bg-green-500/10 text-green-400" },
    { label: "На проверке", value: "8", icon: "Clock", color: "bg-orange-500/10 text-orange-400" },
    { label: "Ошибок", value: "4", icon: "AlertCircle", color: "bg-red-500/10 text-red-400" },
  ];

  return (
    <div>
      <PageHeader
        title="Оцифровка"
        subtitle="Документооборот и обработка данных"
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Upload" size={14} />
            Загрузить документы
          </button>
        }
      />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {summary.map((s) => (
            <div key={s.label} className="stat-card flex items-center gap-4 animate-fade-in">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon name={s.icon} size={18} />
              </div>
              <div>
                <div className="text-2xl font-semibold font-mono-nums text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1 bg-muted rounded px-3 py-1.5">
              <Icon name="Search" size={13} className="text-muted-foreground" />
              <input placeholder="Поиск по документам..." className="bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground w-full" />
            </div>
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 border border-border rounded transition-colors">
              <Icon name="Filter" size={13} />
              Фильтр
            </button>
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="pl-5">Документ</th>
                <th>Тип</th>
                <th>Клиент</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th className="pr-5 text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.doc} className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <td className="pl-5 text-foreground font-mono-nums text-xs font-medium">{r.doc}</td>
                  <td className="text-muted-foreground text-sm">{r.type}</td>
                  <td className="text-muted-foreground">{r.client}</td>
                  <td className="font-mono-nums text-foreground">{r.amount}</td>
                  <td className="text-muted-foreground font-mono-nums text-xs">{r.date}</td>
                  <td className="pr-5 text-right"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Активный": "bg-green-500/10 text-green-400",
    "Обработан": "bg-green-500/10 text-green-400",
    "Новый": "bg-blue-500/10 text-blue-400",
    "В работе": "bg-blue-500/10 text-blue-400",
    "На проверке": "bg-orange-500/10 text-orange-400",
    "Пауза": "bg-muted text-muted-foreground",
    "Ошибка": "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`badge-status ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    "Высокий": "text-red-400",
    "Средний": "text-orange-400",
    "Низкий": "text-muted-foreground",
  };
  return <span className={`text-xs ${map[priority] ?? ""}`}>{priority}</span>;
}
