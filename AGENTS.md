# AGENTS.md — r3code.ru

Лендинг Дмитрия Синявского (r3code) — SRE-консалтинг: оптимизация затрат на логи,
AI-Ready Observability, SLO-аудит. Astro 5 + TypeScript + vanilla CSS, деплой на
GitHub Pages.

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:4321/r3code-website/
npm run build    # валидация TS + сборка в dist/
npm run preview  # локальный preview собранной версии
```

Node 20+ требуется.

## Перед коммитом — ОБЯЗАТЕЛЬНО

1. **`npm run build`** — без ошибок и warning'ов TypeScript.
2. **`node scripts/check-contrast.mjs`** — все цветовые пары проходят WCAG AA.
   Скрипт читает `scripts/contrast-pairs.json` и падает (exit 1), если хоть одна
   пара не дотягивает. Если ввёл новый цвет — добавь пару в конфиг, см.
   [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md).
3. **Проверка энтропии** — если правил факты (даты докладов, рейтинги, имена
   конференций, ссылки), обнови соответствующие разделы в `docs/`. Если факты в
   `docs/` устарели — обнови их одновременно с кодом, не откладывай.
4. **Если правил контент** — проверь, что не осталось плейсхолдеров `【…】`,
   `TODO`, `XXX`, `undefined`.
5. **Если добавил внешние ссылки** — прогони `python3 scripts/check_external_links.py`
   и убедись, что нет 404. Скрипт пишет отчёт: какие URL реально битые, какие
   false positives (Cloudflare/VK/LinkedIn anti-bot). Не встраивай проверку
   в CI — слишком много false positives, лучше запускать руками. Подробности
   в [docs/DEPLOY.md](docs/DEPLOY.md). Раз в квартал прогоняй аудит всех ссылок,
   даже если ничего не менял — внешние сайты могут умереть без твоего участия.

## Структура проекта

```
assets/                   — исходные медиа (фото для OG, не раздаются через сайт)
public/                  — статические ассеты (favicon, og-картинки, логотипы)
src/
├── components/          — Astro-компоненты (scoped styles внутри каждого)
├── content/talks/       — Markdown-файлы докладов (по одному на доклад)
├── layouts/BaseLayout.astro — корневой <head>, SEO, JSON-LD
├── pages/               — маршруты Astro (index, 404, talks/)
├── styles/global.css    — design tokens + базовые стили
└── consts.ts            — единственный источник правды: контакты, услуги, кейсы
scripts/                  — утилиты (contrast checker, external link checker,
                           OG image generation: gen_og_photo.py + og_source.html)
.github/workflows/deploy.yml — CI: build → WCAG → deploy
docs/                     — детальные документы (progressive disclosure)
```

## Где что искать

| Что нужно | Куда смотреть |
|---|---|
| Стиль кода, UI, копирайтинга | [docs/STYLE.md](docs/STYLE.md) |
| Как добавить доклад / услугу / кейс | [docs/CONTENT.md](docs/CONTENT.md) |
| SEO, мета-теги, JSON-LD, sitemap | [docs/SEO.md](docs/SEO.md) |
| WCAG AA, как пользоваться contrast-checker'ом | [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) |
| Деплой, GitHub Actions, откат | [docs/DEPLOY.md](docs/DEPLOY.md) |
| OG image (генерация) | [docs/OG-IMAGE.md](docs/OG-IMAGE.md) |

## Ключевые принципы

- **Контент — в `src/consts.ts` и `src/content/talks/*.md`**. Не размазывай
  тексты по компонентам. Все контакты, услуги, кейсы, конференции — в `consts.ts`.
- **Цвета — через CSS custom properties** из `:root` в `global.css`. Не
  хардкодь hex в компонентах. Если меняешь токен — обнови
  `scripts/contrast-pairs.json` и прогони контраст-чекер.
- **Accessibility — не опция**. Все интерактивные элементы должны иметь
  `aria-label` или видимый текст. Картинки — `alt`. Контраст ≥ 4.5:1.
- **Zero JS по умолчанию**. Astro рендерит статику. JS добавляем только когда
  без него нельзя (фильтр на `/talks/`, retina `srcset`).
- **Никаких внешних форм**. CTA ведут на Telegram / GetMentor / Habr Career.
- **Markdown в `talks/`** рендерится через `astro:content` + `render(talk)`.
  Не используй `set:html={body}` — это рендерит сырой Markdown как текст.

## Стиль кода

- TypeScript strict, никаких `any` без явного комментария.
- Astro-компоненты — scoped styles внутри `<style>` тега.
- Именование классов — БЭМ-подобное: `block__element--modifier`.
- Имена файлов компонентов — PascalCase (Hero.astro, ArtifactCard.astro).
- Имена контент-файлов в `talks/` — kebab-case (slo-tricks.md).
- Коммиты — conventional-commits на русском: `Fix: …`, `Add: …`, `Update: …`.

## Деплой

Push в `main` → GitHub Actions:
1. `npm ci`
2. `npm run build` (включая `astro check`)
3. `node scripts/check-contrast.mjs` — если падает, деплой не происходит
4. `actions/deploy-pages` публикует `dist/` на GitHub Pages

URL: https://r3code.github.io/r3code-website/

## Контакты владельца

Дмитрий Синявский (r3code):
- Telegram: @r3code
- Email: contact@r3code.ru
- GitHub: github.com/r3code
