/**
 * Centralized site configuration.
 *
 * All external links, contacts and content constants live here so that
 * any CTA / footer / JSON-LD uses the same source of truth.
 */

export const SITE = {
  /** Canonical production URL (no trailing slash). */
  url: 'https://r3code.ru',
  /** Future canonical URL after custom-domain migration. */
  futureUrl: 'https://r3code.ru',
  /** Path prefix used by GitHub Pages project deployment. */
  basePath: '/',
  /** Locale code for <html lang>. */
  lang: 'ru',
  /** Site owner name. */
  ownerName: 'Дмитрий Синявский',
  /** Site owner public nickname. */
  ownerNick: 'r3code',
  /** Default OG image (relative to site root). */
  ogImage: '/og.jpg',
  /** Twitter handle (without @). */
  twitterHandle: '',
  /** Default <title> for the homepage. Also used as JSON-LD WebSite.name (single source of truth). */
  defaultTitle:
    'Дмитрий Синявский — SRE-практик: от оптимизации логов и SLO до AI-Ready Observability | r3code.ru',
  /** Default meta description for the homepage. */
  defaultDescription:
    'От оптимизации логов и SLO до AI-Ready Observability. Реальный опыт выстраивания SRE-процессов, миграции на Vector+ClickHouse и открытые инструменты для инженеров',
  /** Site name shown in og:site_name (short brand label). */
  siteName: 'Дмитрий Синявский — SRE-практик',
} as const;

/**
 * Build an asset/page URL relative to the configured `base` (basePath).
 *
 * Astro's `import.meta.env.BASE_URL` may or may not end with `/` depending
 * on the version, so we normalize here. `path` may start with `/` or not.
 *
 * Usage:
 *   withBase('/favicon.svg')   →  '/r3code-website/favicon.svg'
 *   withBase('cases/foo/')     →  '/r3code-website/cases/foo/'
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}

export const CONTACTS = {
  /** Telegram personal handle (without @). */
  telegram: 'r3code',
  /** Telegram URL (deep link). */
  telegramUrl: 'https://t.me/r3code',
  /** Email address. */
  email: 'contact@r3code.ru',
  /** GetMentor profile URL. */
  getmentorUrl: 'https://getmentor.dev/mentor/dmitriy-siniavskiy-1881',
  /** GitHub profile URL. */
  githubUrl: 'https://github.com/r3code',
  /** Habr articles URL (list of articles). */
  habrUrl: 'https://habr.com/ru/users/r3code/articles/',
  /** Habr Career resume URL. */
  habrCareerUrl: 'https://career.habr.com/dmitriy-sinyavskiy',
  /** LinkedIn profile URL. */
  linkedinUrl: 'https://www.linkedin.com/in/dimasin',
} as const;

export const CHANNELS = {
  /** ALLSLO — SRE community channel (handle without @). */
  allslo: {
    handle: 'allslo_ru',
    title: 'ALLSLO',
    url: 'https://t.me/allslo_ru',
    description: 'канал для SRE-инженеров',
    members: '250+ инженеров',
    /** Companies where community members work — social proof. */
    companies: [
      'VK',
      'Купер',
      'Авито',
      'Яндекс',
      'Ozon',
      'Ecom.tech',
      'Т-Банк',
      'Райффайзенбанк',
      'Всеинструменты.ру',
    ],
  },
  /** Летит Кит — author's personal channel (handle without @). */
  letitkit: {
    handle: 'letitkit',
    title: 'Летит Кит',
    url: 'https://t.me/letitkit',
    description: 'авторский канал',
  },
  /** SRE Pub — community Dmitry is a member of. */
  srePub: {
    handle: 'sre_pub',
    title: 'SRE Pub',
    url: 'https://t.me/sre_pub',
    description: 'сообщество SRE-инженеров',
  },
} as const;

/** Conference list for social proof section. Each links to the latest talk. */
export const CONFERENCES = [
  {
    name: 'DevOpsConf 2026',
    note: 'Топ-4, оценка 4.86/5',
    latestTalkSlug: 'slo-tricks',
  },
  {
    name: 'DevOpsConf 2025',
    note: 'оценка 4.80/4.82',
    latestTalkSlug: 'log-chaos-taming',
  },
  {
    name: 'Saint HighLoad 2025',
    note: 'оценка 4.68/4.74',
    latestTalkSlug: 'slo-dwarves',
  },
] as const;

/** Program committee memberships — strong social proof. */
export const PC_MEMBERSHIPS = [
  {
    conference: 'Observability Conf',
    since: '2025',
    url: 'https://observability-conf.ru/',
    invitedBy: 'Александр Крылов, CPO «Штурвал», Лаборатория Числитель',
  },
  {
    conference: 'DevOpsConf',
    since: '2026',
    url: 'https://devopsconf.io/',
    invitedBy: 'Дмитрий Зайцев, глава программного комитета',
  },
] as const;

/**
 * Talks announced but without a full detail page yet (no video / no abstract
 * of their own). Shown on /talks/ in a separate "Анонсы" section.
 */
export interface TalkAnnouncement {
  title: string;
  venue: string;
  year: number;
  date?: string;
  note?: string;
  url?: string;
}

export const TALKS_ANNOUNCED: TalkAnnouncement[] = [
  {
    title: 'Как мы сократили стоимость хранения логов в 3 раза с ClickHouse и Vector',
    venue: 'Moscow Tech Week 2026',
    year: 2026,
    date: '2026-11-18',
    url: 'https://techweek.moscow',
    note: '18 ноября 2026, 14:20–14:55, Москва. Запланированный доклад.',
  },
];

/** Ambassador activities (not talks, but public community presence). */
export const AMBASSADOR_ACTIVITIES = [
  {
    title: 'Амбассадор скетчинга',
    venue: 'Summer Merge 2026',
    year: 2026,
    note: 'Наброски как способ разгрузки для work-life balance. Скетчинг — это удивительная активность, где не нужно уметь рисовать: она про высвобождение себя.',
  },
] as const;

/** Top 3 articles on Habr (curated for /experience/). */
export const HABR_ARTICLES = [
  {
    title: 'Практики SRE: стандартизация логов',
    url: 'https://habr.com/ru/companies/vitech/articles/854424/',
    company: 'Ви.Tech',
    publishedYear: 2025,
  },
  {
    title: 'Vector.dev: как упростить подсчет метрик по логам',
    url: 'https://habr.com/ru/companies/vitech/articles/809801/',
    company: 'Ви.Tech',
    publishedYear: 2024,
  },
  {
    title: 'Как ELK довел нас… до Vector.dev и Clickhouse',
    url: 'https://habr.com/ru/companies/vitech/articles/808313/',
    company: 'Ви.Tech',
    publishedYear: 2024,
  },
] as const;

/**
 * Service offerings. Order matters: log cost optimization first
 * (hot pain), AI-Ready Observability second (growing trend),
 * SLO audit last (additional product).
 *
 * The first item is flagged with `featured: true` to be rendered as
 * the visually emphasized card.
 */
export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  cta: { label: string; href: string };
  /** Yandex.Metrika goal identifier for the CTA click. */
  ctaGoal?: string;
  featured?: boolean;
  /** Schema.org serviceType for JSON-LD. */
  serviceType: string;
  /** Real-world case study with before/after metrics. */
  caseStudy?: {
    title: string;
    /** Bullet list of "before" metrics. */
    beforePoints: string[];
    /** Bullet list of "after" metrics. */
    afterPoints: string[];
  };
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'log-cost-optimization',
    icon: '',
    title: 'Оптимизация затрат на логи',
    subtitle: 'Vector + ClickHouse вместо Elastic-стека',
    description:
      'Кейс ВсеИнструменты.ру: перевод прод-сервисов на Vector+ClickHouse вместо Elastic. Результат: железо в 2 раза меньше, место под лог в 10 раз меньше, хранение 4 дня вместо 5 часов, доставка 99.98–100%.',
    details: [],
    cta: { label: 'Смотреть доклад по теме', href: 'talks/efk-to-vector-clickhouse/' },
    ctaGoal: 'cta_view_talk_log_optimization',
    featured: true,
    serviceType: 'Log cost optimization consulting',
  },
  {
    id: 'ai-ready-observability',
    icon: '',
    title: 'AI-Ready Observability',
    subtitle: 'OpenTelemetry + MCP',
    description:
      'Проблема: без стандартизации телеметрии AI-агенты галлюцинируют при разборе инцидентов. Подход: каталог сервисов, OTel semconv, предсказуемость имён, структура трейсов, MCP-доступность.',
    details: [
      'Бонус: чек-лист «7 шагов к AI-Ready Observability» (PDF)',
    ],
    cta: { label: 'Смотреть доклад по теме', href: 'talks/logs-standardization-obsconf-2026/' },
    ctaGoal: 'cta_view_talk_ai_observability',
    serviceType: 'AI-Ready Observability consulting',
  },
  {
    id: 'slo-audit',
    icon: '',
    title: 'Внедрение SLO',
    subtitle: 'Шаблоны и фреймворки для внедрения SLO',
    description:
      'Подход: внедрение 1–2 честных SLO, за которые не стыдно перед бизнесом. Без рисования красивых, но бесполезных дашбордов. Автопроверка метрик в CI. Артефакт: open-source набор slojka.',
    details: [],
    cta: { label: 'Посмотреть open-source (slojka)', href: 'https://github.com/vseinstrumentiru/slojka' },
    ctaGoal: 'cta_view_github_slojka',
    serviceType: 'SLO audit and implementation',
  },
];

/** Expert support & consulting block (was 'Mentoring 1-на-1'). */
export const EXPERT_SUPPORT = {
  title: 'Экспертная поддержка и менторство',
  lead: 'Делюсь опытом внедрения SRE через аудит и менторство.',
  directions: [
    {
      audience: 'Для компаний',
      body: 'Аудит и внедрение практик SRE, настройка процессов работы с инцидентами и постмортемами, построение наблюдаемости с нуля или миграция со старых стеков (Elastic-стек → Vector+ClickHouse).',
    },
    {
      audience: 'Для тимлидов и инженеров',
      body: 'Индивидуальные разборы сложных кейсов, подготовка архитектуры и разбор собеседований.',
    },
  ],
  ctaCompany: {
    label: 'Написать в Telegram',
    href: 'https://t.me/r3code',
  },
  ctaMentor: {
    label: 'Записаться на GetMentor',
    href: CONTACTS.getmentorUrl,
    note: 'первый созвон для CTO/техлидов — бесплатно',
  },
} as const;

/** Tools & resources section — useful links for the SRE community. */
export interface ToolItem {
  icon: string;
  title: string;
  href: string;
  /** Optional author/source annotation. */
  note?: string;
}

export interface ToolGroup {
  title: string;
  items: ToolItem[];
}

export const TOOLS_RESOURCES: ToolGroup[] = [
  {
    title: 'Тренировка траблшутинга',
    items: [
      {
        icon: '',
        title: 'Wheel of Misfortune',
        href: 'https://game.sresh.ru/',
        note: 'от Макса — тренажёр для отработки инцидентов',
      },
      {
        icon: '',
        title: 'ProdIsDown',
        href: 'https://prodisdown.ru/',
        note: 'полигон для тренировок DevOps/SRE',
      },
      {
        icon: '',
        title: 'Keep-Alive',
        href: 'https://keep-alive.ru/',
        note: 'полигон для тренировок DevOps/SRE',
      },
      {
        icon: '',
        title: 'SadServers',
        href: 'https://sadservers.com/',
        note: 'полигон для тренировок DevOps/SRE',
      },
    ],
  },
  {
    title: 'Для тимлидов и AI-инженеров',
    items: [
      {
        icon: '',
        title: 'Инструмент для эффективных 1-на-1',
        href: 'https://t.me/letitkit/237',
        note: 'для тимлидов',
      },
      {
        icon: '',
        title: 'Экономия токенов в LLM: RTK и Memory',
        href: 'https://t.me/letitkit/237',
        note: 'мой подход к оптимизации AI-ассистентов',
      },
    ],
  },
  {
    title: 'Open-source проекты',
    items: [
      {
        icon: '',
        title: 'slojka',
        href: 'https://github.com/vseinstrumentiru/slojka',
        note: 'Готовые шаблоны для быстрого старта, которые я использую в аудитах',
      },
      {
        icon: '',
        title: 'Unified Log Pipeline',
        href: 'https://github.com/vseinstrumentiru/unified-log-pipeline',
        note: 'Готовые шаблоны для быстрого старта, которые я использую в аудитах',
      },
      {
        icon: '',
        title: 'srekit',
        href: 'https://github.com/jtprogru/srekit',
        note: 'Генератор текстовых артефактов SRE',
      },
    ],
  },
];

/** Lead magnet (checklist) deep-link trigger. */
export const LEAD_MAGNET = {
  title: 'Чек-лист: 7 шагов к AI-Ready Observability',
  body:
    'Готовите ли вы телеметрию для AI-агентов? Скачайте чек-лист из 7 пунктов: каталог сервисов, OTel semconv, предсказуемость имён, структура трейсов, MCP-доступность, бизнес-контекст, документация для AI.',
  ctaLabel: 'Читать в Telegram-канале',
  ctaHref: 'https://t.me/letitkit/297',
  footnote: '',
} as const;

/**
 * Top-3 featured talks shown on the homepage "Кейсы и доклады" section.
 * `slug` matches the Markdown file in src/content/talks/<slug>.md.
 *
 * The homepage card pulls the talk's title/venue/rating/teaser from the
 * content collection — these are just ordering hints.
 */
export const FEATURED_TALK_SLUGS = [
  'slo-tricks',                        // 2026-04-08
  'logs-standardization-obsconf-2026', // 2026-03-19
  'slo-dwarves',                        // 2025-06-23
  'log-chaos-taming',                  // 2025-04-08
  'efk-to-vector-clickhouse',          // 2024 (no exact date)
] as const;
