# r3code.ru — SRE-практик: доклады, инструменты, артефакты

Сайт Дмитрия Синявского (r3code) — доклады, open-source инструменты и артефакты
SRE-практики. Astro 5, GitHub Pages.

## Стек

- **Astro 5** — static site generator, zero JS by default
- **TypeScript** — strict mode, данные в `src/consts.ts`
- **Vanilla CSS** — design tokens в `:root`, scoped styles в компонентах
- **@astrojs/sitemap** — автоматический sitemap
- **Yandex.Metrika** — счётчик (только в production)
- **WCAG AA contrast checker** — CI gate (`scripts/check-contrast.mjs`)
- **GitHub Actions** — build → WCAG check → deploy to Pages

## Структура

```
assets/                   — исходные медиа (фото для OG)
public/                   — статика (favicon, og.jpg, robots.txt)
src/
├── components/           — Astro-компоненты (scoped styles)
├── content/talks/        — Markdown-файлы докладов
├── layouts/BaseLayout.astro — <head>, SEO, JSON-LD, Metrika
├── pages/               — маршруты (index, 404, talks/, privacy/)
├── styles/global.css    — design tokens + базовые стили
└── consts.ts            — единый источник данных
scripts/                  — утилиты (contrast, links, OG generation)
.github/workflows/deploy.yml — CI: build → WCAG → deploy
docs/                     — детальная документация
```

## Локальная разработка

```bash
npm install
npm run dev      # http://localhost:4321/r3code-website/
npm run build    # → dist/
npm run preview  # локальный preview сборки
```

Node 20+.

## Скрипты

| Скрипт | Назначение |
|---|---|
| `node scripts/check-contrast.mjs` | Проверка контрастности WCAG AA (CI gate) |
| `python3 scripts/check_external_links.py` | Аудит внешних ссылок на 404 (раз в квартал) |
| `python3 scripts/gen_og_photo.py` | Предобработка фото для OG image (→ /tmp/og-photo.jpg) |
| `scripts/og_source.html` | HTML-шаблон для рендера OG через Playwright |

## Контент

Все контакты, чек-лист, конференции, инструменты — в `src/consts.ts`.
Доклады — в `src/content/talks/*.md` (Markdown + YAML frontmatter).

Подробности: [docs/CONTENT.md](docs/CONTENT.md), [docs/STYLE.md](docs/STYLE.md).

## Деплой

Push в `main` → GitHub Actions → build → WCAG check → Pages.

Settings → Pages → Source: «GitHub Actions».

Подробности: [docs/DEPLOY.md](docs/DEPLOY.md).

## Лицензия

Код — MIT. Контент — © Дмитрий Синявский.
