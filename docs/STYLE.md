# STYLE.md — стиль кода, UI и копирайтинга

## Дизайн-токены (CSS custom properties)

Все цвета и размеры — в `src/styles/global.css` в `:root`. Не хардкодь hex
в компонентах.

| Токен | Hex | Назначение |
|---|---|---|
| `--color-bg` | `#ffffff` | Основной фон |
| `--color-bg-subtle` | `#f8fafc` | Subtle-секции (SocialProof, Mentorship, About) |
| `--color-bg-muted` | `#f1f5f9` | Muted-карточки, плашки |
| `--color-text` | `#1a1a1a` | Основной текст |
| `--color-text-secondary` | `#475569` | Подзаголовки, body в карточках |
| `--color-text-muted` | `#636b78` | Мелкие подписи, даты |
| `--color-accent` | `#0058e0` | Ссылки, CTA, акценты (WCAG AA: 6.05:1 на белом) |
| `--color-accent-hover` | `#004ab8` | Hover-состояние accent |
| `--color-accent-soft` | `#eff6ff` | LeadMagnet bg, PC memberships bg |
| `--color-border` | `#e2e8f0` | Стандартная граница |
| `--color-feature-badge` | `#ff6b00` | Бейдж «🔥 Горячая боль» |

Контраст проверяется скриптом `scripts/check-contrast.mjs`, см.
[ACCESSIBILITY.md](ACCESSIBILITY.md).

## Типографика

- **UI font:** Inter (через Google Fonts, `display=swap`)
- **Mono font:** JetBrains Mono (eyebrow, terminal, dates, code)
- **Базовый размер body:** 17px, line-height 1.6
- **H1:** clamp(2.2rem, 4.5vw + 0.5rem, 3.5rem)
- **H2:** clamp(1.9rem, 2vw + 1rem, 2.5rem)
- **H3:** 1.35rem
- **Hero subtitle:** 1.3rem (20.8px) — не мельче, чтобы CTO 35-50 читали
  без напряжения
- Inline code: моноширинный, `font-size: 0.92em`, на `--color-bg-muted`

## Layout

- Контейнер: `max-width: 1200px`, padding 24px (mobile) / 48px (desktop)
- Секции: padding-block 64px (mobile) / 96px (desktop)
- Border-radius: 8px (стандарт), 12px (карточки)
- Hover transitions: `var(--t-fast)` (120ms), `var(--t-med)` (200ms)

## Именование классов

БЭМ-подобное: `block__element--modifier`.

Примеры:
- `.hero__title` — элемент `title` блока `hero`
- `.case-study__row--before` — модификатор `before` элемента `row` блока `case-study`
- `.badge__link`, `.case-card__head`, `.feed-item__video-badge`

## Стиль копирайтинга

### Тон
- **Прямой, без хайпа.** «Сокращаю затраты на логи в 3–5 раз» — без «уникальный»,
  «профессиональный», «ведущий».
- **Человеческий.** Цитата про Elastic («Знаю, как больно смотреть на счёт…»)
  — нормальный тон, не корпоративный.
- **Цифры — из реальности.** «18 нод, 5 часов, 60 байт на лог» — это из
  реального кейса ВсеИнструменты.ру, не выдуманные.
- **Без lorem ipsum.** Если данных нет — пишем «материалы появятся после
  публикации» или убираем секцию.

### Длина
- Параграфы: 3–5 предложений.
- Карточки услуг: 2–3 предложения описание + 3–4 пункта деталей.
- Hero subtitle: 2–3 предложения, конкретные факты (рейтинги, числа).

### Что нельзя
- ❌ Выдуманные цифры, даты, цитаты, имена конференций
- ❌ «Lorem ipsum», placeholder'ы вроде `【имя】`, `TODO`
- ❌ Английский в eyebrow (кроме `~/r3code $` bash-prompt — это фишка)
- ❌ Сторонние фото с unsplash/pexels
- ❌ Стоковый «корпоративный» язык

### Что можно
- ✅ Реальные имена, должности, компании (из `consts.ts`)
- ✅ Конкретные цифры из практики (с пометкой «кейс ВсеИнструменты.ру»)
- ✅ Терминологию SRE/Prometheus на английском, если это стандарт
  (SLO, SLI, OTel, Vector, ClickHouse, MCP)
- ✅ Прямые ссылки на Telegram / Habr / GetMentor

## Стиль кода

- **TypeScript strict.** Никаких `any` без явного комментария-обоснования.
- **Astro-компоненты** — scoped styles внутри `<style>`. Не выноси стили в
  `global.css`, если они используются только в одном компоненте.
- **Имена файлов компонентов** — PascalCase: `Hero.astro`, `ServiceCard.astro`.
- **Имена контент-файлов** (`talks/`) — kebab-case: `slo-tricks.md`.
- **Коммиты** — на русском, с префиксом: `Fix: …`, `Add: …`, `Update: …`,
  `Refactor: …`, `Docs: …`.
