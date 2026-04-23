import { useState } from "react";
import Icon from "@/components/ui/icon";

type Section = "dashboard" | "clients" | "tasks" | "deals" | "digitizing";

const NAV = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "clients", label: "Клиенты", icon: "Users" },
  { id: "tasks", label: "Задачи", icon: "CheckSquare" },
  { id: "deals", label: "Сделки", icon: "Briefcase" },
  { id: "digitizing", label: "Оцифровка", icon: "BarChart2" },
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
        {active === "deals" && <Deals />}
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

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
      <div className="text-sm text-foreground">{value || "—"}</div>
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

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard() {
  const kpis = [
    {
      label: "Лидов в работе",
      value: "14",
      icon: "TrendingUp",
      color: "bg-blue-500/10 text-blue-600",
      hint: "Потенциальные клиенты",
      rows: [
        { name: "ООО «Меридиан»", manager: "Карпов Д.А.", date: "22 апр" },
        { name: "ИП Захарова Т.С.", manager: "Белова О.П.", date: "21 апр" },
        { name: "АО «ТехноПром»", manager: "Карпов Д.А.", date: "20 апр" },
        { name: "ООО «Сити Трейд»", manager: "Новиков С.Р.", date: "19 апр" },
      ],
      cols: ["Компания", "Менеджер", "Дата"],
    },
    {
      label: "Сделок в работе",
      value: "9",
      icon: "Briefcase",
      color: "bg-purple-500/10 text-purple-600",
      hint: "Активные клиенты",
      rows: [
        { name: "ООО «Альфа Групп»", manager: "Белова О.П.", date: "15 апр" },
        { name: "АО «Техносфера»", manager: "Карпов Д.А.", date: "10 апр" },
        { name: "ООО «Магнит Трейд»", manager: "Новиков С.Р.", date: "05 апр" },
      ],
      cols: ["Клиент", "Менеджер", "Дата"],
    },
    {
      label: "Заявок на подбор",
      value: "7",
      icon: "ClipboardList",
      color: "bg-orange-500/10 text-orange-600",
      hint: "В работе у рекрутеров",
      rows: [
        { name: "Бухгалтер", manager: "Петрова О.В.", date: "10 апр" },
        { name: "Менеджер продаж", manager: "Иванова К.С.", date: "08 апр" },
        { name: "Юрист", manager: "Петрова О.В.", date: "18 апр" },
        { name: "Логист", manager: "Иванова К.С.", date: "20 апр" },
      ],
      cols: ["Должность", "Рекрутер", "Дата"],
    },
    {
      label: "На стажировке",
      value: "5",
      icon: "UserCheck",
      color: "bg-green-500/10 text-green-600",
      hint: "Кандидатов сейчас",
      rows: [
        { name: "Ковалёв Д.А.", manager: "Бухгалтер / Альфа Групп", date: "15 апр" },
        { name: "Лазарева О.К.", manager: "Менеджер / Техносфера", date: "18 апр" },
        { name: "Морозов П.А.", manager: "Логист / Магнит Трейд", date: "20 апр" },
      ],
      cols: ["Кандидат", "Должность / Клиент", "С"],
    },
  ];

  const [openKpi, setOpenKpi] = useState<number | null>(null);

  return (
    <div>
      <PageHeader title="Дашборд" subtitle="Руководитель проектов · апрель 2026" />
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <button
              key={k.label}
              onClick={() => setOpenKpi(openKpi === i ? null : i)}
              className="stat-card animate-fade-in text-left hover:border-primary/40 transition-colors w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</span>
                <div className={`w-8 h-8 rounded flex items-center justify-center ${k.color}`}>
                  <Icon name={k.icon} size={14} />
                </div>
              </div>
              <div className="text-3xl font-semibold font-mono-nums text-foreground">{k.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                {k.hint}
                <Icon name={openKpi === i ? "ChevronUp" : "ChevronDown"} size={12} className="ml-auto" />
              </div>
            </button>
          ))}
        </div>

        {openKpi !== null && (
          <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
            <div className="px-5 py-3 border-b border-border flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${kpis[openKpi].color}`}>
                <Icon name={kpis[openKpi].icon} size={12} />
              </div>
              <span className="text-sm font-medium text-foreground">{kpis[openKpi].label}</span>
              <span className="text-sm font-semibold font-mono-nums text-foreground ml-1">— {kpis[openKpi].value}</span>
            </div>
            <table className="w-full data-table">
              <thead>
                <tr>
                  {kpis[openKpi].cols.map((col, ci) => (
                    <th key={col} className={ci === 0 ? "pl-5" : ci === kpis[openKpi].cols.length - 1 ? "pr-5 text-right" : ""}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {kpis[openKpi].rows.map((r) => (
                  <tr key={r.name} className="hover:bg-muted/40 transition-colors">
                    <td className="pl-5 text-foreground font-medium">{r.name}</td>
                    <td className="text-muted-foreground">{r.manager}</td>
                    <td className="pr-5 text-right text-muted-foreground font-mono-nums text-xs">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="text-sm font-medium text-foreground mb-4">Воронка сделок</div>
            {[
              { stage: "Поиск", count: 12, pct: 100 },
              { stage: "Стажировка", count: 7, pct: 58 },
              { stage: "Гарантийный период", count: 4, pct: 33 },
              { stage: "Закрыта", count: 3, pct: 25 },
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
        </div>
      </div>
    </div>
  );
}

// ── CLIENTS ───────────────────────────────────────────────────────────────────
const CLIENTS_DATA = [
  {
    id: 1,
    brand: "Альфа",
    legalName: "ООО «Альфа Групп»",
    status: "Активный",
    lpr: { fio: "Иванов Александр Петрович", position: "Генеральный директор", phone: "+7 495 123-45-67", telegram: "@ivanov_ap", email: "ivanov@alpha.ru" },
    lprAssistant: { fio: "Смирнова Ольга Владимировна", position: "Помощник руководителя", phone: "+7 495 123-45-68", telegram: "@smirnova_ov", email: "smirnova@alpha.ru" },
    requisites: { inn: "7701234567", kpp: "770101001", ogrn: "1027700123456", legalAddress: "г. Москва, ул. Ленина, д. 1", bank: "ПАО «Сбербанк»", bik: "044525225", account: "40702810123456789012", corrAccount: "30101810400000000225" },
    contract: "Договор №А-2024-001 от 15.01.2024",
  },
  {
    id: 2,
    brand: "Техносфера",
    legalName: "АО «Техносфера»",
    status: "В работе",
    lpr: { fio: "Сидоров Виктор Константинович", position: "Директор по персоналу", phone: "+7 499 345-67-89", telegram: "@sidorov_vk", email: "sidorov@techno.ru" },
    lprAssistant: { fio: "Козлова Наталья Игоревна", position: "HR-менеджер", phone: "+7 499 345-67-90", telegram: "@kozlova_ni", email: "kozlova@techno.ru" },
    requisites: { inn: "7703456789", kpp: "770301001", ogrn: "1027700345678", legalAddress: "г. Москва, пр-т Мира, д. 25", bank: "АО «Альфа-Банк»", bik: "044525593", account: "40702810345678901234", corrAccount: "30101810200000000593" },
    contract: "Договор №Т-2025-014 от 03.03.2025",
  },
];

function Clients() {
  const [selected, setSelected] = useState<number | null>(null);
  const client = CLIENTS_DATA.find((c) => c.id === selected);

  if (client) {
    return <ClientCard client={client} onBack={() => setSelected(null)} />;
  }

  return (
    <div>
      <PageHeader
        title="Клиенты"
        subtitle={`${CLIENTS_DATA.length} компании`}
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
          </div>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="pl-5">Бренд</th>
                <th>Юр. лицо</th>
                <th>ЛПР</th>
                <th>Телефон</th>
                <th>Договор</th>
                <th className="pr-5 text-right">Статус</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS_DATA.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c.id)} className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <td className="pl-5 text-foreground font-semibold">{c.brand}</td>
                  <td className="text-muted-foreground">{c.legalName}</td>
                  <td className="text-foreground">{c.lpr.fio}</td>
                  <td className="text-muted-foreground font-mono-nums text-xs">{c.lpr.phone}</td>
                  <td className="text-muted-foreground text-xs">{c.contract}</td>
                  <td className="pr-5 text-right"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ClientCard({ client, onBack }: { client: typeof CLIENTS_DATA[0]; onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 px-8 py-6 border-b border-border">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ChevronLeft" size={16} />
          Клиенты
        </button>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-lg font-semibold text-foreground">{client.brand}</h1>
        <StatusBadge status={client.status} />
        <div className="ml-auto">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Edit2" size={13} />
            Редактировать
          </button>
        </div>
      </div>
      <div className="p-8 space-y-5 max-w-5xl">
        <div className="grid grid-cols-2 gap-5">
          <SectionBlock title="Основное">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Бренд" value={client.brand} />
              <Field label="Юридическое лицо" value={client.legalName} />
            </div>
          </SectionBlock>
          <SectionBlock title="Договор">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-foreground font-medium">{client.contract}</div>
                <button className="text-xs text-primary hover:underline mt-0.5">Прикрепить файл</button>
              </div>
            </div>
          </SectionBlock>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <SectionBlock title="ЛПР — Лицо принимающее решения">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="ФИО" value={client.lpr.fio} /></div>
              <Field label="Должность" value={client.lpr.position} />
              <Field label="Телефон" value={client.lpr.phone} />
              <Field label="Telegram" value={client.lpr.telegram} />
              <Field label="E-mail" value={client.lpr.email} />
            </div>
          </SectionBlock>
          <SectionBlock title="Помощник ЛПР">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="ФИО" value={client.lprAssistant.fio} /></div>
              <Field label="Должность" value={client.lprAssistant.position} />
              <Field label="Телефон" value={client.lprAssistant.phone} />
              <Field label="Telegram" value={client.lprAssistant.telegram} />
              <Field label="E-mail" value={client.lprAssistant.email} />
            </div>
          </SectionBlock>
        </div>

        <SectionBlock title="Реквизиты компании">
          <div className="grid grid-cols-4 gap-4">
            <Field label="ИНН" value={client.requisites.inn} />
            <Field label="КПП" value={client.requisites.kpp} />
            <Field label="ОГРН" value={client.requisites.ogrn} />
            <div className="col-span-1" />
            <div className="col-span-4"><Field label="Юридический адрес" value={client.requisites.legalAddress} /></div>
            <Field label="Банк" value={client.requisites.bank} />
            <Field label="БИК" value={client.requisites.bik} />
            <Field label="Расчётный счёт" value={client.requisites.account} />
            <Field label="Корр. счёт" value={client.requisites.corrAccount} />
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}

// ── TASKS ─────────────────────────────────────────────────────────────────────
function Tasks() {
  const columns = [
    {
      title: "К выполнению", color: "text-muted-foreground", dot: "bg-muted-foreground",
      tasks: [
        { title: "Подготовить КП для «Техносфера»", client: "АО «Техносфера»", due: "25 апр", priority: "Высокий" },
        { title: "Запросить документы у ИП Петровой", client: "ИП Петрова М.С.", due: "26 апр", priority: "Средний" },
        { title: "Оплата налогов Q1", client: "—", due: "30 апр", priority: "Высокий" },
      ],
    },
    {
      title: "В работе", color: "text-info", dot: "bg-info",
      tasks: [
        { title: "Аудит договора «Альфа Групп»", client: "ООО «Альфа Групп»", due: "24 апр", priority: "Высокий" },
        { title: "Сверка данных оцифровки", client: "Внутренняя", due: "24 апр", priority: "Средний" },
      ],
    },
    {
      title: "Выполнено", color: "text-success", dot: "bg-success",
      tasks: [
        { title: "Звонок Иванову А.П.", client: "ООО «Альфа Групп»", due: "22 апр", priority: "Низкий" },
        { title: "Отправить отчёт за март", client: "Внутренняя", due: "21 апр", priority: "Высокий" },
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
                  <div key={t.title} className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer">
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

// ── DEALS ─────────────────────────────────────────────────────────────────────
const DEALS_DATA = [
  {
    id: 1,
    number: "ЗАЯ-2026-001",
    client: "ООО «Альфа Групп»",
    brand: "Альфа",
    position: "Бухгалтер",
    city: "Москва",
    recruiter: "Петрова О.В.",
    stage: "Стажировка",
    openDate: "10.04.2026",
    amount: "120 000 ₽",
    advance: { amount: "60 000 ₽", date: "12.04.2026", paid: true },
    extra: [
      { label: "Доплата 1", amount: "30 000 ₽", date: "", paid: false },
      { label: "Доплата 2", amount: "30 000 ₽", date: "", paid: false },
    ],
    profile: {
      lpr: "Иванов Александр Петрович",
      targetPosition: "Бухгалтер",
      openDate: "10.04.2026",
      reason: "Расширение штата",
      structure: "Бухгалтерия подчиняется CFO, 3 сотрудника в отделе",
      duties: [
        { duty: "Ведение первичной документации", competence: "Знание 1С:Бухгалтерия, внимательность" },
        { duty: "Подготовка налоговой отчётности", competence: "Знание НК РФ, опыт сдачи отчётов" },
        { duty: "Работа с банком и платёжными поручениями", competence: "Опыт работы с банк-клиентом" },
      ],
      motivationProbation: "Оклад 60 000 ₽ на испытательный срок (3 мес.)",
      motivationMain: "Оклад 80 000 ₽ + квартальная премия до 20%",
      probationPeriod: "3 месяца",
      probationConditions: "Выполнение KPI: своевременная сдача отчётов, отсутствие ошибок",
      probationPay: "60 000 ₽",
      softSkills: "Внимательность, ответственность, стрессоустойчивость, умение работать в команде",
      additionalRequirements: "Опыт работы от 3 лет, знание МСФО будет плюсом",
      age: "25–45 лет",
      gender: "Не важно",
      maritalStatus: "Не важно",
      previousWork: [
        { company: "Крупные производственные предприятия", position: "Бухгалтер / Главный бухгалтер", field: "Производство, торговля" },
      ],
    },
    invoice: { service: "Подбор персонала", qty: 1, price: "120 000 ₽", total: "120 000 ₽" },
    act: { number: "АКТ-2026-001", date: "—", candidate: "—", guarantee: "3 месяца", file: null },
  },
];

function Deals() {
  const [selected, setSelected] = useState<number | null>(null);
  const deal = DEALS_DATA.find((d) => d.id === selected);

  if (deal) return <DealCard deal={deal} onBack={() => setSelected(null)} />;

  const stageColor: Record<string, string> = {
    "Поиск": "bg-blue-50 text-blue-600",
    "Стажировка": "bg-orange-50 text-orange-600",
    "Стоп": "bg-red-50 text-red-600",
    "Гарантийный период": "bg-purple-50 text-purple-600",
    "Закрыта": "bg-green-50 text-green-600",
  };

  return (
    <div>
      <PageHeader
        title="Сделки"
        subtitle="Заявки на подбор персонала"
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Plus" size={14} />
            Новая заявка
          </button>
        }
      />
      <div className="p-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th className="pl-5">№ Заявки</th>
                <th>Клиент</th>
                <th>Должность</th>
                <th>Город</th>
                <th>Рекрутер</th>
                <th>Стадия</th>
                <th>Сумма</th>
                <th className="pr-5 text-right">Дата открытия</th>
              </tr>
            </thead>
            <tbody>
              {DEALS_DATA.map((d) => (
                <tr key={d.id} onClick={() => setSelected(d.id)} className="hover:bg-muted/40 transition-colors cursor-pointer">
                  <td className="pl-5 font-mono-nums text-xs text-foreground font-medium">{d.number}</td>
                  <td className="text-foreground">{d.brand}</td>
                  <td className="text-foreground font-medium">{d.position}</td>
                  <td className="text-muted-foreground">{d.city}</td>
                  <td className="text-muted-foreground">{d.recruiter}</td>
                  <td><span className={`badge-status ${stageColor[d.stage] ?? "bg-muted text-muted-foreground"}`}><span className="w-1.5 h-1.5 rounded-full bg-current" />{d.stage}</span></td>
                  <td className="font-mono-nums text-foreground">{d.amount}</td>
                  <td className="pr-5 text-right text-muted-foreground font-mono-nums text-xs">{d.openDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DealCard({ deal, onBack }: { deal: typeof DEALS_DATA[0]; onBack: () => void }) {
  return (
    <div>
      <div className="flex items-center gap-3 px-8 py-6 border-b border-border">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="ChevronLeft" size={16} />
          Сделки
        </button>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-lg font-semibold text-foreground">{deal.number}</h1>
        <span className="text-muted-foreground">·</span>
        <span className="text-sm text-muted-foreground">{deal.position}</span>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Edit2" size={13} />
            Редактировать
          </button>
        </div>
      </div>

      <div className="p-8 space-y-5 max-w-5xl">

        {/* Основное */}
        <SectionBlock title="Заявка — основные данные">
          <div className="grid grid-cols-4 gap-4">
            <Field label="Клиент (юр. лицо)" value={deal.client} />
            <Field label="Бренд" value={deal.brand} />
            <Field label="Должность" value={deal.position} />
            <Field label="Город" value={deal.city} />
            <Field label="Ответственный рекрутер" value={deal.recruiter} />
            <Field label="Дата открытия" value={deal.openDate} />
            <Field label="Стадия" value={deal.stage} />
            <Field label="Сумма заявки" value={deal.amount} />
          </div>
        </SectionBlock>

        {/* Счёт */}
        <SectionBlock title="Счёт на оплату">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                <th className="text-left pb-3 font-medium">Услуга</th>
                <th className="text-center pb-3 font-medium">Кол-во</th>
                <th className="text-right pb-3 font-medium">Стоимость</th>
                <th className="text-right pb-3 font-medium">Сумма</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="py-3 text-sm text-foreground">{deal.invoice.service}</td>
                <td className="py-3 text-sm text-center font-mono-nums">{deal.invoice.qty}</td>
                <td className="py-3 text-sm text-right font-mono-nums">{deal.invoice.price}</td>
                <td className="py-3 text-sm text-right font-mono-nums font-semibold text-foreground">{deal.invoice.total}</td>
              </tr>
            </tbody>
          </table>
        </SectionBlock>

        {/* Оплата */}
        <SectionBlock title="Оплата от клиента">
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg">
              <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${deal.advance.paid ? "bg-primary border-primary" : "border-border"}`}>
                {deal.advance.paid && <Icon name="Check" size={11} className="text-primary-foreground" />}
              </div>
              <div className="flex-1 text-sm font-medium text-foreground">Аванс</div>
              <div className="font-mono-nums text-sm text-foreground">{deal.advance.amount}</div>
              <div className="text-xs text-success font-medium">{deal.advance.paid ? `Оплачен ${deal.advance.date}` : "Ожидается"}</div>
            </div>
            {deal.extra.map((e) => (
              <div key={e.label} className="flex items-center gap-4 p-3 bg-muted/40 rounded-lg">
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${e.paid ? "bg-primary border-primary" : "border-border"}`}>
                  {e.paid && <Icon name="Check" size={11} className="text-primary-foreground" />}
                </div>
                <div className="flex-1 text-sm font-medium text-foreground">{e.label}</div>
                <div className="font-mono-nums text-sm text-foreground">{e.amount}</div>
                <div className="text-xs text-muted-foreground">{e.paid ? `Оплачен ${e.date}` : "Ожидается"}</div>
              </div>
            ))}
          </div>
        </SectionBlock>

        {/* Профиль должности */}
        <SectionBlock title="Профиль должности">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              <Field label="ФИО ЛПР" value={deal.profile.lpr} />
              <Field label="Искомая должность" value={deal.profile.targetPosition} />
              <Field label="Дата открытия вакансии" value={deal.profile.openDate} />
              <div className="col-span-3"><Field label="Причина открытия вакансии" value={deal.profile.reason} /></div>
              <div className="col-span-3"><Field label="Описание структуры компании" value={deal.profile.structure} /></div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Обязанности и компетенции</div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 w-1/2">Обязанность</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5 w-1/2">Компетенция</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deal.profile.duties.map((d, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">{d.duty}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{d.competence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Мотивация на период испытательного срока" value={deal.profile.motivationProbation} />
              <Field label="Мотивация основная" value={deal.profile.motivationMain} />
              <Field label="Период стажировки" value={deal.profile.probationPeriod} />
              <Field label="Оплата на время стажировки" value={deal.profile.probationPay} />
              <div className="col-span-2"><Field label="Условия прохождения стажировки" value={deal.profile.probationConditions} /></div>
              <div className="col-span-2"><Field label="Soft skills" value={deal.profile.softSkills} /></div>
              <div className="col-span-2"><Field label="Дополнительные требования" value={deal.profile.additionalRequirements} /></div>
              <Field label="Возраст" value={deal.profile.age} />
              <Field label="Пол" value={deal.profile.gender} />
              <Field label="Семейное положение" value={deal.profile.maritalStatus} />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Где мог работать кандидат ранее</div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Компания</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Должность</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Сфера</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deal.profile.previousWork.map((w, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">{w.company}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{w.position}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{w.field}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SectionBlock>

        {/* Акт */}
        <SectionBlock title="Акт об оказании услуг">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <Field label="Номер акта" value={deal.act.number} />
            <Field label="Дата" value={deal.act.date} />
            <Field label="ФИО вышедшего кандидата" value={deal.act.candidate} />
            <Field label="Гарантийный период" value={deal.act.guarantee} />
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg">
            <Icon name="Paperclip" size={15} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground flex-1">Подписанный акт не прикреплён</span>
            <button className="text-xs text-primary hover:underline">Прикрепить файл</button>
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}

// ── DIGITIZING ────────────────────────────────────────────────────────────────
function Digitizing() {
  const records = [
    {
      id: 1,
      number: "ЗАЯ-2026-001",
      position: "Бухгалтер",
      city: "Москва",
      amount: "120 000 ₽",
      resourceCostPlan: "15 000 ₽",
      resourceCostFact: "12 400 ₽",
      recruiter: "Петрова О.В.",
      stage: "Стажировка",
      date: "10.04.2026",
      stats: {
        resumesViewed: 148,
        callsHHFree: 34,
        callsHHPaid: 12,
        callsAvito: 8,
        interviews: 9,
        assessments: 6,
        shows: 4,
        internships: 2,
      },
    },
  ];

  const stageColor: Record<string, string> = {
    "Поиск": "bg-blue-50 text-blue-600",
    "Стажировка": "bg-orange-50 text-orange-600",
    "Стоп": "bg-red-50 text-red-600",
    "Гарантийный период": "bg-purple-50 text-purple-600",
    "Закрыта": "bg-green-50 text-green-600",
  };

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div>
      <PageHeader
        title="Оцифровка"
        subtitle="Отчёт по активностям рекрутинга"
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Plus" size={14} />
            Новая запись
          </button>
        }
      />
      <div className="p-8 space-y-4">
        {records.map((r) => (
          <div key={r.id} className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
            <div
              className="px-5 py-4 flex items-center gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
            >
              <Icon name={expanded === r.id ? "ChevronDown" : "ChevronRight"} size={15} className="text-muted-foreground shrink-0" />
              <span className="font-mono-nums text-xs text-muted-foreground w-28 shrink-0">{r.number}</span>
              <span className="font-medium text-foreground flex-1">{r.position}</span>
              <span className="text-sm text-muted-foreground w-24">{r.city}</span>
              <span className="font-mono-nums text-sm text-foreground w-28">{r.amount}</span>
              <span className="text-sm text-muted-foreground w-32">{r.recruiter}</span>
              <span className={`badge-status ${stageColor[r.stage] ?? "bg-muted text-muted-foreground"} w-32 justify-center`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />{r.stage}
              </span>
              <span className="font-mono-nums text-xs text-muted-foreground w-24 text-right">{r.date}</span>
            </div>

            {expanded === r.id && (
              <div className="border-t border-border p-5 space-y-5">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-muted/40 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold font-mono-nums text-foreground">{r.stats.resumesViewed}</div>
                    <div className="text-xs text-muted-foreground mt-1">Просмотрено резюме</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold font-mono-nums text-foreground">{r.stats.callsHHFree + r.stats.callsHHPaid + r.stats.callsAvito}</div>
                    <div className="text-xs text-muted-foreground mt-1">Всего звонков</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold font-mono-nums text-foreground">{r.stats.interviews}</div>
                    <div className="text-xs text-muted-foreground mt-1">Собеседований</div>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-4 text-center">
                    <div className="text-2xl font-semibold font-mono-nums text-foreground">{r.stats.internships}</div>
                    <div className="text-xs text-muted-foreground mt-1">Стажировок</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Детализация активностей</div>
                    <div className="space-y-2">
                      {[
                        { label: "Звонки HH.ru (бесплатно)", value: r.stats.callsHHFree },
                        { label: "Звонки HH.ru (платно)", value: r.stats.callsHHPaid },
                        { label: "Звонки Авито (платно)", value: r.stats.callsAvito },
                        { label: "Направленных оценок", value: r.stats.assessments },
                        { label: "Показов кандидатов", value: r.stats.shows },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="font-mono-nums text-sm font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Бюджет на подбор</div>
                    <div className="space-y-2">
                      {[
                        { label: "Стоимость заявки", value: r.amount },
                        { label: "Бюджет на ресурсы (план)", value: r.resourceCostPlan },
                        { label: "Бюджет на ресурсы (факт)", value: r.resourceCostFact },
                        { label: "Остаток бюджета", value: `${(parseInt(r.resourceCostPlan) - parseInt(r.resourceCostFact)).toLocaleString()} ₽` },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="font-mono-nums text-sm font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Активный": "bg-green-50 text-green-700",
    "Обработан": "bg-green-50 text-green-700",
    "Новый": "bg-blue-50 text-blue-700",
    "В работе": "bg-blue-50 text-blue-700",
    "На проверке": "bg-orange-50 text-orange-700",
    "Пауза": "bg-muted text-muted-foreground",
    "Ошибка": "bg-red-50 text-red-700",
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
    "Высокий": "text-red-500",
    "Средний": "text-orange-500",
    "Низкий": "text-muted-foreground",
  };
  return <span className={`text-xs ${map[priority] ?? ""}`}>{priority}</span>;
}