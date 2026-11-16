# CONTENT.md — модель контента

## Где живёт контент

| Что | Где | Формат |
|---|---|---|
| Контакты (Telegram, email, GetMentor, GitHub, Habr) | `src/consts.ts` → `CONTACTS` | Object literal |
| Каналы (ALLSLO, Летит Кит, SRE Pub) | `src/consts.ts` → `CHANNELS` | Object literal |
| Конференции в Conferences | `src/consts.ts` → `CONFERENCES` | Array of objects |
| Программные комитеты | `src/consts.ts` → `PC_MEMBERSHIPS` | Array of objects |
| Анонсы будущих докладов | `src/consts.ts` → `TALKS_ANNOUNCED` | Array of objects |
| Артефакты (3 карточки) | `src/consts.ts` → `ARTIFACTS` | Array of `ArtifactItem` |
| Экспертная поддержка | `src/consts.ts` → `EXPERT_SUPPORT` | Object literal |
| Инструменты и open-source | `src/consts.ts` → `TOOLS_RESOURCES` | Array of `ToolGroup` |
| Чек-лист | `src/consts.ts` → `CHECKLIST` | Object literal |
| Featured talks на главной | `src/consts.ts` → `FEATURED_TALK_SLUGS` | Array of slugs |
| **Доклады (детальные страницы)** | `src/content/talks/<slug>.md` | Markdown + YAML frontmatter |
| **Статьи** | `src/content/articles/<slug>.md` | Markdown + YAML frontmatter |

## Добавить статью

Статьи живут в `src/content/articles/<slug>.md` (slug — kebab-case, уникальный).
Список — на `/articles/`, сортировка автоматическая: от новых к старым по `date`.

Два вида статей:

### Внешняя статья (например, на Habr)

Есть `url` → карточка на `/articles/` ссылается на внешний источник,
клик по заголовку или «Открыть статью ↗» открывает ссылку **в новом окне**
(`target="_blank" rel="noopener"`). Детальная страница не генерируется.

```yaml
---
title: 'SLI/SLO. Что такое Error Budget Burn Rate на самом деле'
date: '2026-04-27'      # ISO YYYY-MM-DD — сортировка и вывод DD.MM.YYYY
url: 'https://habr.com/ru/articles/1028008/'
source: 'Habr'          # метка площадки на карточке (опционально)
teaser: 'Одно-два предложения для карточки.'
tags: ['DevOps', 'Терминология IT']
---
```

Markdown-тело для внешней статьи не нужно (frontmatter достаточно).

### Внутренняя статья (публикация на сайте)

`url` НЕ указывается → генерируется детальная страница `/articles/<slug>/`,
клик по карточке открывает её **в том же окне**.

Оформление базируется на странице доклада (`/talks/<slug>/`) с отличиями:

- первая строка: `Статья · DD.MM.YYYY` (дата публикации вместо конференции);
- вместо строки с оценками — теги статьи (чипы);
- блоков «Материалы» (видео/слайды) нет; Markdown-тело — сам текст статьи.

```yaml
---
title: 'Заголовок статьи'
date: '2026-04-27'
teaser: 'Одно-два предложения для карточки.'
tags: ['DevOps', 'SRE']
---
```

```markdown
## Текст статьи

Markdown-тело **обязательно**: H2/H3, списки, **bold**, `code` работают.
Если у внутренней статьи нет тела — `npm run build` падает с понятной ошибкой.
```

### Требования к тегам (проверяется при сборке)

- `tags` обязательны для **каждой** статьи, минимум один тег.
- Теги можно брать с Habr (хабы статьи), **кроме корпоративных тегов,
  содержащих «Ви.Tech»** (например, «Блог компании Ви.Tech») — их исключаем.
- Требования зашиты в схему `src/content.config.ts`: пустой `tags` или тег
  с «Ви.Tech» роняет `npm run build` с сообщением. Агенту достаточно
  запустить сборку, чтобы проверить корректность тегов.
- Для внутренних статей теги задаются прямо в frontmatter (см. формат выше).

## Добавить новый доклад

1. Создай `src/content/talks/<slug>.md`. Slug — kebab-case, уникальный.
2. Frontmatter:

```yaml
---
title: 'Название доклада'
venue: 'Конференция 2026, Город'
year: 2026
type: talk           # talk | roundtable | podcast
date: '2026-04-08'   # ISO date — влияет на сортировку в /talks/
venueUrl: 'https://...' # опционально
rating:             # опционально
  content: 4.86
  delivery: 4.86
role: speaker        # speaker | invited-expert | host | guest
videos:              # опционально, массив
  - { platform: YouTube, url: 'https://...' }
  - { platform: RuTube, url: 'https://...' }
slides: 'https://...' # опционально
abstract: 'https://...' # опционально, страница доклада на сайте конференции
note: '...'           # опционально, доп. контекст
featured: false      # опционально, true для топ-3 на главной
teaser: 'Одно предложение для карточки.' # опционально
---

## О докладе

Markdown-тело. H2 заголовки рендерятся. Списки, **bold**, `code` работают.
```

3. Страница `/talks/<slug>/` сгенерится автоматически при `npm run build`.
4. Если хочешь, чтобы доклад попал в топ-3 на главной — добавь slug в
   `FEATURED_TALK_SLUGS` в `consts.ts`.

## Анонс будущего доклада (без детальной страницы)

Если доклад заявлен, но материалов ещё нет — добавь в `TALKS_ANNOUNCED`:

```ts
{
  title: 'Тема доклада',
  venue: 'Конференция 2026',
  year: 2026,
  date: '2026-11-18',
  url: 'https://...',
  note: '18 ноября 2026, 14:20–14:55, Москва. Запланированный доклад.',
}
```

Анонсы показываются в фиде `/talks/` в самом верху (если дата будущая) с
серым dashed-стилем.

## Обновить контакты

В `src/consts.ts` → `CONTACTS`. Поля:

| Поле | Назначение |
|---|---|
| `telegram` | Handle без @ (для отображения) |
| `telegramUrl` | Полный URL `https://t.me/r3code` |
| `email` | Email для `mailto:` |
| `getmentorUrl` | Профиль GetMentor |
| `githubUrl` | Профиль GitHub |
| `habrUrl` | Список статей на Habr |
| `linkedinUrl` | Профиль LinkedIn |

## Добавить артефакт

В `src/consts.ts` → `ARTIFACTS`. Порядок важен: featured-карточка первая.

```ts
{
  id: 'slug-артефакта',
  icon: '',                // поле есть, но emoji не используем — strict engineering
  title: 'Заголовок',
  subtitle: 'Подзаголовок',
  description: '2–3 предложения',
  details: ['Пункт 1', 'Пункт 2', 'Пункт 3'],
  cta: { label: 'Смотреть доклад по теме', href: 'talks/<slug>/' },
  featured: false,        // true только для первой карточки
  serviceType: 'Schema.org/Service type (для JSON-LD)',
  caseStudy: {           // опционально, только для featured
    title: 'Реальный кейс (Компания)',
    beforePoints: ['...'],
    afterPoints: ['...'],
  },
}
```

## Обновить топ-3 статьи Habr (для футера и блока компаний)

В `consts.ts` → `HABR_ARTICLES`. Сейчас не отображается на сайте (страница
`/experience/` удалена), но константа осталась — может использоваться, если
решишь вернуть блок статей. Заголовки получены через `WebFetch` с habr.com.

## Что НЕ делать с контентом

- ❌ Не вставлять Markdown-синтаксис (`##`, `**bold**`) в `consts.ts` — это
  data-файл. Markdown только в `src/content/talks/*.md`.
- ❌ Не хардкодить контакты в компонентах. Только через `CONTACTS` из `consts.ts`.
- ❌ Не дублировать данные. Если email изменился — правишь в одном месте
  (`CONTACTS.email`) и всё.
