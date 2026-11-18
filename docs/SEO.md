# SEO.md — мета-теги, JSON-LD, sitemap

## Что есть на каждой странице

В `src/layouts/BaseLayout.astro`:

| Тег | Что |
|---|---|
| `<title>` | Дефолт: «Дмитрий Синявский — SRE-консалтинг: оптимизация логов, AI-Ready Observability, SLO | r3code.ru». Можно переопределить через props. |
| `<meta name="description">` | Дефолт про логи + AI + SRE. Можно переопределить. |
| `<meta name="author">` | «Дмитрий Синявский (r3code)» |
| `<meta name="keywords">` | SRE, SLO, observability, Vector, ClickHouse, OpenTelemetry, MCP, etc. |
| `<meta name="robots">` | `index, follow, max-image-preview:large` (или `noindex, nofollow` для placeholder-страниц) |
| `<link rel="canonical">` | Автоматически из `Astro.url` |
| OG-теги | `og:type=website`, `og:locale=ru_RU`, `og:title`, `og:description`, `og:url`, `og:image` (1200×630 JPEG, `/og.jpg`) |
| Twitter Card | `summary_large_image` |
| `<link rel="sitemap">` | `/sitemap-index.xml` |

## Favicon-стек

В `<head>` 5 ссылок (браузер сам выбирает):

```html
<link rel="icon" type="image/svg+xml" href=".../favicon.svg" />
<link rel="icon" type="image/png" sizes="128x128" href=".../images/r3code-128.png" />
<link rel="icon" type="image/x-icon" href=".../favicon.ico" />
<link rel="apple-touch-icon" sizes="180x180" href=".../images/apple-touch-icon.png" />
<link rel="mask-icon" href=".../favicon.svg" color="#0058e0" />
```

## JSON-LD structured data

В `<head>` 3 блока `<script type="application/ld+json">`:

### 1. WebSite
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://r3code.ru",
  "name": "r3code.ru — SRE-консалтинг",
  "inLanguage": "ru-RU",
  "author": { "@type": "Person", "name": "Дмитрий Синявский" }
}
```

### 2. Person (главный — это персональный сайт)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Дмитрий Синявский",
  "alternateName": "r3code",
  "jobTitle": "SRE Engineer, Speaker, Mentor",
  "url": "https://r3code.ru",
  "image": "https://r3code.ru/images/r3code-128.png",
  "sameAs": [github, habr, getmentor, telegram, linkedin],
  "knowsAbout": ["SRE", "SLO", "Observability", "Vector", "ClickHouse", ...]
}
```

### 3. ItemList of Artifacts (Schema.org/Service)
3 артефакта как `ListItem` с `position` 1/2/3, каждый item — `Service` с
`provider` (Person), `serviceType`, `url` (с якорем `#<id>`).

## Sitemap

Через `@astrojs/sitemap`. Конфиг в `astro.config.mjs`:

```js
integrations: [
  sitemap({
    filter: (page) => !page.includes('/404'),
  }),
]
```

Генерит `sitemap-index.xml` + `sitemap-0.xml` при `npm run build`.
URLы в sitemap используют `site` из `astro.config.mjs` (сейчас
`https://r3code.github.io`, позже сменится на `https://r3code.ru`).

## robots.txt

В `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://r3code.github.io/r3code-website/sitemap-index.xml
```

## OG image

`public/og.jpg` — 1200×630, JPEG q=85 progressive.

Генерация: HTML-шаблон в `scripts/og_source.html` рендерится через Playwright
headless browser, скриншот 1200×630 конвертируется в JPEG через Pillow.

Композиция:
- Левая половина (50%): фото Дмитрия, mask-gradient на правом крае
- Правая половина (50%): тёмный фон `#1a1a2e`, eyebrow `~/r3code $ SRE · ...`,
  headline «Сокращаю затраты на логи в 3–5 раз», subhead про Vector+ClickHouse,
  footer «Дмитрий Синявский · SRE-консалтинг»

Перегенерация (после смены фото / текста):

```bash
# 1. Отредактируй scripts/og_source.html (текст/фото)
# 2. Открой в headless браузере и сделай скриншот:
agent-browser set viewport 1200 630
agent-browser open "file:///path/to/scripts/og_source.html"
sleep 2  # ждём загрузки шрифтов
agent-browser screenshot /tmp/og_render.png
# 3. Конвертируй в JPEG:
python3 -c "from PIL import Image; Image.open('/tmp/og_render.png').convert('RGB').save('public/og.jpg', 'JPEG', quality=85, optimize=True, progressive=True)"
```

## Что НЕ делать

- ❌ Не дублировать `<title>` на разных страницах. Каждая страница — свой title.
- ❌ Не забывать `noindex` для placeholder-страниц (case detail pages без видео).
- ❌ Не использовать `og:image` меньшего размера, чем 1200×630. Соцсети
  обрезают, получится уродливо.

## Миграция на r3code.ru

Когда переедем на кастомный домен, в `astro.config.mjs`:
- `site` → `'https://r3code.ru'`
- `base` → `/` (убрать `/r3code-website`)
- `public/robots.txt` → обновить sitemap URL
- `public/CNAME` → создать с `r3code.ru`

Подробно — в [DEPLOY.md](DEPLOY.md).
