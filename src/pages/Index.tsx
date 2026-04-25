import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Section = "dashboard" | "clients" | "tasks" | "deals" | "digitizing" | "database";

const NAV = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "clients", label: "Клиенты", icon: "Users" },
  { id: "tasks", label: "Задачи", icon: "CheckSquare" },
  { id: "deals", label: "Сделки", icon: "Briefcase" },
  { id: "digitizing", label: "Оцифровка", icon: "BarChart2" },
  { id: "database", label: "База данных", icon: "Database" },
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
        {active === "database" && <Database />}
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
const DIGITIZING_URL = "https://functions.poehali.dev/c22922f0-c63c-44c6-b6c9-22c5823209a2";

const STAGE_COLOR: Record<string, string> = {
  "Поиск": "bg-blue-50 text-blue-600",
  "Стажировка": "bg-orange-50 text-orange-600",
  "Стоп": "bg-red-50 text-red-600",
  "Гарантийный период": "bg-purple-50 text-purple-600",
  "Закрыта": "bg-green-50 text-green-600",
};

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  "Начислено": "bg-blue-50 text-blue-600",
  "Выплачено": "bg-green-50 text-green-600",
};

function fmt(n: number | string | null) {
  const num = typeof n === "string" ? parseFloat(n) : (n ?? 0);
  return num.toLocaleString("ru-RU") + " ₽";
}

function fmtPct(base: number | string, pct: number | string) {
  const b = typeof base === "string" ? parseFloat(base) : base;
  const p = typeof pct === "string" ? parseFloat(pct) : pct;
  return fmt((b * p) / 100);
}

type DigOrder = {
  id: number;
  number: string;
  client_legal: string;
  brand: string;
  position: string;
  city: string;
  stage: string;
  recruiter: string;
  date_advance: string;
  amount: string;
  resource_plan: string;
  resource_fact: string;
  pct_sales: string;
  pct_profile: string;
  pct_recruiting: string;
  pct_management: string;
  pct_group_head: string;
  payment_sales_status: string;
  payment_sales_date: string | null;
  payment_profile_status: string;
  payment_profile_date: string | null;
  payment_recruiting_status: string;
  payment_recruiting_date: string | null;
  payment_management_status: string;
  payment_management_date: string | null;
  payment_group_head_status: string;
  payment_group_head_date: string | null;
  date_extra_payment_1: string | null;
  date_extra_payment_2: string | null;
  date_extra_payment_3: string | null;
  date_closed: string | null;
  resumes_viewed: number;
  calls_hh_free: number;
  calls_hh_paid: number;
  calls_avito: number;
  interviews: number;
  assessments: number;
  shows: number;
  internships: number;
  act_number: string | null;
  act_date: string | null;
  act_amount: string | null;
  act_candidate: string | null;
  guarantee_period: string | null;
};

type DigDetail = DigOrder & {
  activities: {
    resumes_viewed: number;
    calls_hh_free: number;
    calls_hh_paid: number;
    calls_avito: number;
    interviews: number;
    assessments: number;
    shows: number;
    internships: number;
  };
  candidates: Array<{ id: number; candidate_name: string; sent_date: string; is_replacement: boolean; replacing_candidate: string | null; replacement_date: string | null }>;
  replacements: Array<{ id: number; exited_candidate: string; replacement_date: string; provided_candidates: number; resumes_viewed: number; calls: number; interviews: number; internships: number; count: number }>;
  act: { act_number: string; act_date: string; act_amount: string; candidate_name: string; guarantee_period: string } | null;
};

function DigitizingCard({ order, onClose }: { order: DigDetail; onClose: () => void }) {
  const base = parseFloat(order.amount) - parseFloat(order.resource_plan);
  const totalCalls = order.resumes_viewed > 0
    ? order.calls_hh_free + order.calls_hh_paid + order.calls_avito
    : (order.activities?.calls_hh_free ?? 0) + (order.activities?.calls_hh_paid ?? 0) + (order.activities?.calls_avito ?? 0);

  const act = order.act && Object.keys(order.act).length > 0 ? order.act : null;

  const paymentRows = [
    { label: "Продажи (5%)", pct: order.pct_sales, statusKey: "payment_sales_status", dateKey: "payment_sales_date" },
    { label: "Профиль / аванс (7.5%)", pct: order.pct_profile, statusKey: "payment_profile_status", dateKey: "payment_profile_date" },
    { label: "Ответств. за рекрутинг (30%)", pct: order.pct_recruiting, statusKey: "payment_recruiting_status", dateKey: "payment_recruiting_date" },
    { label: "Управление и закрытие (7.5%)", pct: order.pct_management, statusKey: "payment_management_status", dateKey: "payment_management_date" },
    { label: "Рук. группы подбора (10%)", pct: order.pct_group_head, statusKey: "payment_group_head_status", dateKey: "payment_group_head_date" },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-3xl bg-background shadow-xl overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-xs text-muted-foreground font-mono-nums">{order.number}</div>
            <div className="font-semibold text-foreground">{order.position} · {order.city}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{order.client_legal}{order.brand ? ` / ${order.brand}` : ""}</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge-status ${STAGE_COLOR[order.stage] ?? "bg-muted text-muted-foreground"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />{order.stage}
            </span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <Icon name="X" size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">

          {/* Основные данные */}
          <section>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Основные данные</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Рекрутер", value: order.recruiter },
                { label: "Дата аванса", value: order.date_advance },
                { label: "Стоимость заявки", value: fmt(order.amount) },
                { label: "Доплата 1", value: order.date_extra_payment_1 ?? "—" },
                { label: "Доплата 2", value: order.date_extra_payment_2 ?? "—" },
                { label: "Доплата 3", value: order.date_extra_payment_3 ?? "—" },
              ].map(f => (
                <div key={f.label} className="bg-muted/30 rounded-lg px-4 py-3">
                  <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
                  <div className="text-sm font-medium text-foreground">{f.value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Бюджет */}
          <section>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Бюджет на поисковые ресурсы</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/30 rounded-lg px-4 py-3">
                <div className="text-xs text-muted-foreground mb-1">План</div>
                <div className="text-sm font-medium">{fmt(order.resource_plan)}</div>
              </div>
              <div className="bg-muted/30 rounded-lg px-4 py-3">
                <div className="text-xs text-muted-foreground mb-1">Факт</div>
                <div className="text-sm font-medium">{fmt(order.resource_fact)}</div>
              </div>
              <div className="bg-muted/30 rounded-lg px-4 py-3">
                <div className="text-xs text-muted-foreground mb-1">Остаток / долг</div>
                <div className={`text-sm font-semibold ${parseFloat(order.resource_plan) - parseFloat(order.resource_fact) >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {fmt(parseFloat(order.resource_plan) - parseFloat(order.resource_fact))}
                </div>
              </div>
            </div>
          </section>

          {/* Оплата за исполнение */}
          <section>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
              Оплата за исполнение заказа <span className="text-foreground font-semibold">({fmt(base)} — база)</span>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Функция / Роль</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5">%</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5">Сумма</th>
                    <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Статус</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2.5">Дата выплаты</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row) => {
                    const status = order[row.statusKey as keyof DigDetail] as string;
                    const date = order[row.dateKey as keyof DigDetail] as string | null;
                    return (
                      <tr key={row.label} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">{row.label}</td>
                        <td className="px-4 py-3 text-sm text-right font-mono-nums text-muted-foreground">{row.pct}%</td>
                        <td className="px-4 py-3 text-sm text-right font-mono-nums font-medium">{fmtPct(base, row.pct)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`badge-status ${PAYMENT_STATUS_COLOR[status] ?? "bg-muted text-muted-foreground"}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />{status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground font-mono-nums">{date ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Акт */}
          {act && (
            <section>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Акт об оказании услуг</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Номер акта", value: act.act_number },
                  { label: "Дата акта", value: act.act_date },
                  { label: "Сумма по акту", value: fmt(act.act_amount) },
                  { label: "Гарантийный срок", value: act.guarantee_period },
                  { label: "ФИО вышедшего кандидата", value: act.candidate_name },
                  { label: "Дата закрытия", value: order.date_closed ?? "—" },
                ].map(f => (
                  <div key={f.label} className="bg-muted/30 rounded-lg px-4 py-3">
                    <div className="text-xs text-muted-foreground mb-1">{f.label}</div>
                    <div className="text-sm font-medium text-foreground">{f.value}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Активности из оцифровки */}
          <section>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Активности по оцифровке</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Просмотрено резюме", value: order.resumes_viewed },
                { label: "Звонки всего", value: order.calls_hh_free + order.calls_hh_paid + order.calls_avito },
                { label: "Направлено кандидатов", value: order.assessments },
                { label: "Дошедших кандидатов", value: order.shows },
                { label: "Стажёров", value: order.internships },
                { label: "Собеседований", value: order.interviews },
                { label: "HH.ru бесплатно", value: order.calls_hh_free },
                { label: "HH.ru платно", value: order.calls_hh_paid },
                { label: "Авито платно", value: order.calls_avito },
              ].map(item => (
                <div key={item.label} className="bg-muted/30 rounded-lg px-3 py-3 text-center">
                  <div className="text-lg font-semibold font-mono-nums text-foreground">{item.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Направленные кандидаты */}
          {order.candidates?.length > 0 && (
            <section>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Направленные кандидаты</div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">ФИО</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Дата</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Тип</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.candidates.map(c => (
                      <tr key={c.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">{c.candidate_name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono-nums">{c.sent_date}</td>
                        <td className="px-4 py-3">
                          {c.is_replacement
                            ? <span className="badge-status bg-orange-50 text-orange-600"><span className="w-1.5 h-1.5 rounded-full bg-current" />Замена</span>
                            : <span className="badge-status bg-blue-50 text-blue-600"><span className="w-1.5 h-1.5 rounded-full bg-current" />Основной</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Замена кандидата */}
          {order.replacements?.length > 0 && (
            <section>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">Замена кандидата</div>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Вышедший (замена)</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Дата</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Кандидаты</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Резюме</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Звонки</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Собес.</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Стажир.</th>
                      <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2.5">Кол-во</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.replacements.map(rep => (
                      <tr key={rep.id} className="border-t border-border">
                        <td className="px-4 py-3 text-sm text-foreground">{rep.exited_candidate}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground font-mono-nums">{rep.replacement_date}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono-nums">{rep.provided_candidates}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono-nums">{rep.resumes_viewed}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono-nums">{rep.calls}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono-nums">{rep.interviews}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono-nums">{rep.internships}</td>
                        <td className="px-4 py-3 text-sm text-center font-mono-nums">{rep.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

function Digitizing() {
  const [orders, setOrders] = useState<DigOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<DigDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch(DIGITIZING_URL)
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function openCard(id: number) {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`${DIGITIZING_URL}?id=${id}`);
      const data = await res.json();
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }

  const totals = {
    resumesViewed: orders.reduce((s, r) => s + (r.resumes_viewed ?? 0), 0),
    callsHHFree: orders.reduce((s, r) => s + (r.calls_hh_free ?? 0), 0),
    callsHHPaid: orders.reduce((s, r) => s + (r.calls_hh_paid ?? 0), 0),
    callsAvito: orders.reduce((s, r) => s + (r.calls_avito ?? 0), 0),
    interviews: orders.reduce((s, r) => s + (r.interviews ?? 0), 0),
    assessments: orders.reduce((s, r) => s + (r.assessments ?? 0), 0),
    shows: orders.reduce((s, r) => s + (r.shows ?? 0), 0),
    internships: orders.reduce((s, r) => s + (r.internships ?? 0), 0),
    resourcePlan: orders.reduce((s, r) => s + parseFloat(r.resource_plan ?? "0"), 0),
    resourceFact: orders.reduce((s, r) => s + parseFloat(r.resource_fact ?? "0"), 0),
  };

  const thC = "text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3 text-center whitespace-nowrap border-r border-border last:border-0";
  const thL = "text-xs font-medium text-muted-foreground uppercase tracking-wide px-3 py-3 text-left whitespace-nowrap border-r border-border";
  const tdC = "px-3 py-3 text-sm font-mono-nums text-center text-foreground border-r border-border last:border-0";
  const tdL = "px-3 py-3 text-sm text-foreground border-r border-border";

  return (
    <div>
      <PageHeader
        title="Оцифровка"
        subtitle={loading ? "Загрузка…" : `Отчёт по заявкам с авансом · ${orders.length} заявок`}
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Download" size={14} />
            Экспорт
          </button>
        }
      />
      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Icon name="Loader" size={20} className="animate-spin mr-2" />Загрузка данных…
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th colSpan={7} className="text-xs font-semibold text-muted-foreground px-3 py-2 text-left border-r border-border">Заявка</th>
                    <th colSpan={8} className="text-xs font-semibold text-muted-foreground px-3 py-2 text-center border-r border-border">Активности</th>
                    <th colSpan={3} className="text-xs font-semibold text-muted-foreground px-3 py-2 text-center">Бюджет на ресурсы</th>
                  </tr>
                  <tr className="bg-muted/20 border-b border-border">
                    <th className={thL}>№ Заявки</th>
                    <th className={thL}>Должность</th>
                    <th className={thL}>Город</th>
                    <th className={thL}>Заказчик</th>
                    <th className={thL}>Рекрутер</th>
                    <th className={thL}>Стадия</th>
                    <th className={`${thC} border-r-2 border-border`}>Стоимость</th>
                    <th className={thC}>Резюме</th>
                    <th className={thC}>HH бесп.</th>
                    <th className={thC}>HH платн.</th>
                    <th className={thC}>Авито</th>
                    <th className={thC}>Собес.</th>
                    <th className={thC}>Оценки</th>
                    <th className={thC}>Показы</th>
                    <th className={`${thC} border-r-2 border-border`}>Стажир.</th>
                    <th className={thC}>План</th>
                    <th className={thC}>Факт</th>
                    <th className={thC}>Остаток</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => openCard(r.id)}
                    >
                      <td className={tdL}>
                        <span className="font-mono-nums text-xs font-medium">{r.number}</span>
                      </td>
                      <td className={`${tdL} font-medium`}>{r.position}</td>
                      <td className={`${tdL} text-muted-foreground`}>{r.city}</td>
                      <td className={`${tdL} text-muted-foreground text-xs`}>{r.client_legal}</td>
                      <td className={`${tdL} text-muted-foreground`}>{r.recruiter}</td>
                      <td className={tdL}>
                        <span className={`badge-status ${STAGE_COLOR[r.stage] ?? "bg-muted text-muted-foreground"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />{r.stage}
                        </span>
                      </td>
                      <td className={`${tdC} border-r-2 border-border font-semibold`}>{fmt(r.amount)}</td>
                      <td className={tdC}>{r.resumes_viewed}</td>
                      <td className={tdC}>{r.calls_hh_free}</td>
                      <td className={tdC}>{r.calls_hh_paid}</td>
                      <td className={tdC}>{r.calls_avito}</td>
                      <td className={tdC}>{r.interviews}</td>
                      <td className={tdC}>{r.assessments}</td>
                      <td className={tdC}>{r.shows}</td>
                      <td className={`${tdC} border-r-2 border-border`}>{r.internships}</td>
                      <td className={tdC}>{fmt(r.resource_plan)}</td>
                      <td className={tdC}>{fmt(r.resource_fact)}</td>
                      <td className={`${tdC} ${parseFloat(r.resource_plan) - parseFloat(r.resource_fact) >= 0 ? "text-green-600" : "text-red-500"} font-semibold`}>
                        {fmt(parseFloat(r.resource_plan) - parseFloat(r.resource_fact))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50 border-t-2 border-border">
                    <td colSpan={6} className="px-3 py-3 text-xs font-semibold text-foreground uppercase tracking-wide">Итого</td>
                    <td className={`${tdC} border-r-2 border-border font-bold`}>{fmt(orders.reduce((s, r) => s + parseFloat(r.amount ?? "0"), 0))}</td>
                    <td className={`${tdC} font-bold`}>{totals.resumesViewed}</td>
                    <td className={`${tdC} font-bold`}>{totals.callsHHFree}</td>
                    <td className={`${tdC} font-bold`}>{totals.callsHHPaid}</td>
                    <td className={`${tdC} font-bold`}>{totals.callsAvito}</td>
                    <td className={`${tdC} font-bold`}>{totals.interviews}</td>
                    <td className={`${tdC} font-bold`}>{totals.assessments}</td>
                    <td className={`${tdC} font-bold`}>{totals.shows}</td>
                    <td className={`${tdC} border-r-2 border-border font-bold`}>{totals.internships}</td>
                    <td className={`${tdC} font-bold`}>{fmt(totals.resourcePlan)}</td>
                    <td className={`${tdC} font-bold`}>{fmt(totals.resourceFact)}</td>
                    <td className={`${tdC} font-bold ${totals.resourcePlan - totals.resourceFact >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {fmt(totals.resourcePlan - totals.resourceFact)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Карточка заявки (drawer) */}
      {selectedId && (
        detailLoading
          ? (
            <div className="fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedId(null)} />
              <div className="relative ml-auto w-full max-w-3xl bg-background flex items-center justify-center">
                <Icon name="Loader" size={24} className="animate-spin text-muted-foreground" />
              </div>
            </div>
          )
          : detail && <DigitizingCard order={detail} onClose={() => { setSelectedId(null); setDetail(null); }} />
      )}
    </div>
  );
}

// ── DATABASE ──────────────────────────────────────────────────────────────────
const PAYMENT_ROWS = [
  { label: "Продажи", sublabel: "Рук. проекта / продажи", pct: "pct_sales" as const, status: "payment_sales_status" as const, date: "payment_sales_date" as const },
  { label: "Профиль / аванс", sublabel: "Рук. проекта / профиль", pct: "pct_profile" as const, status: "payment_profile_status" as const, date: "payment_profile_date" as const },
  { label: "Рекрутинг", sublabel: "Ответств. за рекрутинг", pct: "pct_recruiting" as const, status: "payment_recruiting_status" as const, date: "payment_recruiting_date" as const },
  { label: "Управление", sublabel: "Рук. проекта / закрытие", pct: "pct_management" as const, status: "payment_management_status" as const, date: "payment_management_date" as const },
  { label: "Рук. группы", sublabel: "Рук. группы подбора", pct: "pct_group_head" as const, status: "payment_group_head_status" as const, date: "payment_group_head_date" as const },
];

function DbRow({ order, onOpen }: { order: DigOrder; onOpen: () => void }) {
  const base = parseFloat(order.amount) - parseFloat(order.resource_plan);
  const resourceLeft = parseFloat(order.resource_plan) - parseFloat(order.resource_fact);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-fade-in">
      {/* Шапка карточки */}
      <div
        className="px-5 py-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={onOpen}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono-nums text-xs text-muted-foreground">{order.number}</span>
            <span className={`badge-status ${STAGE_COLOR[order.stage] ?? "bg-muted text-muted-foreground"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />{order.stage}
            </span>
          </div>
          <div className="font-semibold text-foreground">{order.position}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{order.client_legal}{order.brand ? ` · ${order.brand}` : ""} · {order.city}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold font-mono-nums text-foreground">{fmt(order.amount)}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Рекрутер: {order.recruiter}</div>
        </div>
      </div>

      {/* Даты оплат */}
      <div className="px-5 pb-4 flex flex-wrap gap-3">
        <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
          <span className="text-muted-foreground">Аванс: </span>
          <span className="font-mono-nums font-medium">{order.date_advance ?? "—"}</span>
        </div>
        {order.date_extra_payment_1 && (
          <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
            <span className="text-muted-foreground">Доплата 1: </span>
            <span className="font-mono-nums font-medium">{order.date_extra_payment_1}</span>
          </div>
        )}
        {order.date_extra_payment_2 && (
          <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
            <span className="text-muted-foreground">Доплата 2: </span>
            <span className="font-mono-nums font-medium">{order.date_extra_payment_2}</span>
          </div>
        )}
        {order.date_extra_payment_3 && (
          <div className="bg-muted/40 rounded-lg px-3 py-2 text-xs">
            <span className="text-muted-foreground">Доплата 3: </span>
            <span className="font-mono-nums font-medium">{order.date_extra_payment_3}</span>
          </div>
        )}
      </div>

      {/* Бюджет + активности */}
      <div className="border-t border-border grid grid-cols-5 divide-x divide-border">
        <div className="px-4 py-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Бюджет план</div>
          <div className="font-mono-nums text-sm font-medium">{fmt(order.resource_plan)}</div>
        </div>
        <div className="px-4 py-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Бюджет факт</div>
          <div className="font-mono-nums text-sm font-medium">{fmt(order.resource_fact)}</div>
        </div>
        <div className="px-4 py-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Остаток / долг</div>
          <div className={`font-mono-nums text-sm font-semibold ${resourceLeft >= 0 ? "text-green-600" : "text-red-500"}`}>{fmt(resourceLeft)}</div>
        </div>
        <div className="px-4 py-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Просмотрено</div>
          <div className="font-mono-nums text-sm font-medium">{order.resumes_viewed}</div>
        </div>
        <div className="px-4 py-3 text-center">
          <div className="text-xs text-muted-foreground mb-1">Срок закрытия</div>
          <div className="font-mono-nums text-sm font-medium">{order.date_closed ?? "—"}</div>
        </div>
      </div>

      {/* Акт */}
      {order.act_number && (
        <div className="border-t border-border px-5 py-3 flex flex-wrap gap-4 bg-muted/10">
          <div className="text-xs"><span className="text-muted-foreground">Акт: </span><span className="font-medium">{order.act_number}</span></div>
          <div className="text-xs"><span className="text-muted-foreground">Дата: </span><span className="font-mono-nums">{order.act_date}</span></div>
          <div className="text-xs"><span className="text-muted-foreground">Сумма: </span><span className="font-mono-nums font-medium">{fmt(order.act_amount)}</span></div>
          <div className="text-xs"><span className="text-muted-foreground">Кандидат: </span><span className="font-medium">{order.act_candidate}</span></div>
          <div className="text-xs"><span className="text-muted-foreground">Гарантия: </span><span>{order.guarantee_period}</span></div>
        </div>
      )}

      {/* ЗП за исполнение */}
      <div className="border-t border-border">
        <div className="px-5 py-2 bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center justify-between">
          <span>Оплата за исполнение <span className="text-foreground normal-case font-normal">(база: {fmt(base)})</span></span>
        </div>
        <div className="divide-y divide-border">
          {PAYMENT_ROWS.map((row) => {
            const pct = parseFloat(order[row.pct] as string);
            const sum = (base * pct) / 100;
            const status = order[row.status] as string;
            const date = order[row.date] as string | null;
            return (
              <div key={row.label} className="px-5 py-2.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">{row.label} <span className="text-muted-foreground text-xs">({pct}%)</span></div>
                  <div className="text-xs text-muted-foreground">{row.sublabel}</div>
                </div>
                <div className="font-mono-nums text-sm font-semibold w-28 text-right">{fmt(sum)}</div>
                <div className="w-28 flex justify-center">
                  <span className={`badge-status ${PAYMENT_STATUS_COLOR[status] ?? "bg-muted text-muted-foreground"}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />{status}
                  </span>
                </div>
                <div className="font-mono-nums text-xs text-muted-foreground w-24 text-right">{date ?? "—"}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Итог активностей */}
      <div className="border-t border-border grid grid-cols-6 divide-x divide-border bg-muted/10">
        {[
          { label: "Звонков", value: (order.calls_hh_free ?? 0) + (order.calls_hh_paid ?? 0) + (order.calls_avito ?? 0) },
          { label: "Направлено", value: order.assessments },
          { label: "Дошло", value: order.shows },
          { label: "Собес.", value: order.interviews },
          { label: "Стажёров", value: order.internships },
          { label: "HH / Авито", value: `${(order.calls_hh_free ?? 0) + (order.calls_hh_paid ?? 0)} / ${order.calls_avito ?? 0}` },
        ].map(item => (
          <div key={item.label} className="px-3 py-2.5 text-center">
            <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
            <div className="font-mono-nums text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Database() {
  const [orders, setOrders] = useState<DigOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<DigDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch(DIGITIZING_URL)
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function openCard(id: number) {
    setSelectedId(id);
    setDetailLoading(true);
    try {
      const res = await fetch(`${DIGITIZING_URL}?id=${id}`);
      const data = await res.json();
      setDetail(data);
    } finally {
      setDetailLoading(false);
    }
  }

  const totalPayroll = orders.reduce((sum, o) => {
    const base = parseFloat(o.amount) - parseFloat(o.resource_plan);
    return sum + PAYMENT_ROWS.reduce((s, row) => s + (base * parseFloat(o[row.pct] as string)) / 100, 0);
  }, 0);

  return (
    <div>
      <PageHeader
        title="База данных"
        subtitle={loading ? "Загрузка…" : `${orders.length} заявок · ФОТ: ${fmt(totalPayroll)}`}
        action={
          <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm px-4 py-2 rounded hover:bg-primary/90 transition-colors">
            <Icon name="Download" size={14} />
            Экспорт
          </button>
        }
      />
      <div className="p-8 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Icon name="Loader" size={20} className="animate-spin mr-2" />Загрузка данных…
          </div>
        ) : (
          orders.map(order => (
            <DbRow key={order.id} order={order} onOpen={() => openCard(order.id)} />
          ))
        )}
      </div>

      {selectedId && (
        detailLoading
          ? (
            <div className="fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/30" onClick={() => setSelectedId(null)} />
              <div className="relative ml-auto w-full max-w-3xl bg-background flex items-center justify-center">
                <Icon name="Loader" size={24} className="animate-spin text-muted-foreground" />
              </div>
            </div>
          )
          : detail && <DigitizingCard order={detail} onClose={() => { setSelectedId(null); setDetail(null); }} />
      )}
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