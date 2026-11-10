# ACCESSIBILITY.md — WCAG AA, contrast checker

## Требования

Все текстовые пары цветов на сайте должны соответствовать **WCAG 2.1 AA**:

- **Normal text** (< 18px regular, < 14px bold): контраст ≥ **4.5:1**
- **Large text** (≥ 18px regular, ≥ 14px bold): контраст ≥ **3.0:1**
- **UI components** (button text, link text, inputs): ≥ 3.0:1

Проверка идёт **на каждом CI-билде** через `node scripts/check-contrast.mjs`.
Если хоть одна пара падает — workflow падает, деплой не происходит.

## Скрипт check-contrast.mjs

**Локация:** `scripts/check-contrast.mjs`
**Конфиг:** `scripts/contrast-pairs.json`
**Зависимости:** только встроенный Node.js (ES modules, без npm-пакетов)

### Как пользоваться

```bash
# Локально перед коммитом:
node scripts/check-contrast.mjs

# Вывод:
# WCAG AA contrast check — 13 pairs
# ID                          fg        bg        ratio  threshold  status
# body-text-on-white          #1a1a1a   #ffffff   17.40  4.5        PASS
# ...
# ✅ All color pairs meet WCAG AA requirements.
```

Если есть FAIL:
- Скрипт печатает контекст (где используется пара)
- Предлагает ближайший валидный цвет (затемнение fg на 5% шагами)
- Exit code 1

### Как добавить новую пару

Когда вводишь новую цветовую комбинацию в CSS:

1. Открой `scripts/contrast-pairs.json`
2. Добавь объект в массив `pairs`:

```json
{
  "id": "my-new-pair-name",
  "fg": "#0058e0",
  "bg": "#ffffff",
  "context": "Где используется (например, 'new CTA badge in Hero')",
  "largeText": false
}
```

3. Прогони `node scripts/check-contrast.mjs`
4. Если FAIL — затемни fg или высветли bg до прохождения. Варианты:
   - Использовать готовый токен (например, `--color-text-secondary` вместо
     своего)
   - Подобрать вручную через формулу WCAG
   - Воспользоваться авто-предложением скрипта

## Текущие пары (13 шт.)

См. `scripts/contrast-pairs.json`. Ключевые:

| ID | fg | bg | ratio | Где |
|---|---|---|---|---|
| body-text-on-white | #1a1a1a | #ffffff | 17.40 | Body текст |
| text-secondary-on-white | #475569 | #ffffff | 7.58 | Hero subtitle |
| text-muted-on-white | #636b78 | #ffffff | 5.38 | Даты, мелкие подписи |
| text-muted-on-bg-muted | #636b78 | #f1f5f9 | 4.91 | Muted на muted-карточках |
| accent-on-white | #0058e0 | #ffffff | 6.05 | Ссылки |
| accent-on-accent-soft | #0058e0 | #eff6ff | 5.56 | Бейджи, PC memberships |
| white-on-accent | #ffffff | #0058e0 | 6.05 | Primary button |

## История правок цветов

### Commit v19 — переход с #0066ff на #0058e0

Старый accent `#0066ff` давал 4.44:1 на `--color-accent-soft` (#eff6ff) —
ниже 4.5:1. Затемнение до `#0058e0` подняло контраст до 5.56:1 — PASS.

Старый `--color-text-muted` `#6b7280` давал 4.41:1 на `--color-bg-muted` —
ниже 4.5:1. Затемнение до `#636b78` подняло до 4.91:1 — PASS.

## Принципы выбора цветов

1. **Использовать design tokens** из `:root` в `global.css`. Не вводить
   новые hex-цвета без необходимости.
2. **Проверять контраст до коммита.** Локально через скрипт — 50ms.
3. **Не доверять «глазомеру».** То, что выглядит контрастно, может
   оказаться 4.3:1. Только скрипт.
4. **Subtle-фоны — риск.** `#f8fafc`, `#f1f5f9`, `#eff6ff` — светлые.
   Любой текст на них теряет контраст. Если кладёшь muted-текст на
   subtle-фон — обязательно добавь пару в конфиг.

## Что скрипт НЕ проверяет

- **Картинки с текстом** (OG image, favicon) — это графика, не HTML.
- **Hover-состояния** — отдельная задача, сейчас не покрыта.
- **Dynamic content** (JS-генерируемый) — скрипт статичный.
- **Цвета вне основной палитры** (например, terminal-блок в старом Hero
  — удалён).

Если появится потребность — расширять скрипт через Playwright для
runtime-проверки DOM.

## Полезные ссылки

- [WCAG 2.1 §1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) —
  онлайн для ручной проверки
- [Contrast Ratio tool](https://contrast-ratio.com/) — Lea Verou
