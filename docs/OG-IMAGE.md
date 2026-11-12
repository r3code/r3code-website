# OG-IMAGE.md — генерация Open Graph изображения

## Зачем

OG image (1200×630) показывается при шеринге ссылки в Twitter, Facebook,
Telegram, LinkedIn, VK. Это первое, что видят — должно выглядеть профессионально.

## Композиция

```
┌────────────────────┬────────────────────┐
│                    │  Дмитрий Синявский  │
│   ФОТО 600×630    │  ─────────────────  │
│   (предобработано  │  ~/R3CODE $ SRE...  │
│    в Python,       │                    │
│    лицо видно       │  ПРОЦЕССЫ НАДЁЖ-   │
│    полностью)       │  НОСТИ              │
│                    │  ИЗ РЕАЛЬНОГО ОПЫТА │
│   Градиент         │  От SLO и постморт. │
│   на правом краю   │  до AI-Ready...    │
│   фото (маска)     │                    │
│                    │  → Доклады · ...   │
│                    │                    │
│   600px            │  600px             │
└────────────────────┴────────────────────┘
          1200px × 630px total
```

## Источник фото

`assets/dima-portrait-photo.jpg` (2855×2855, квадрат, 2.1 MB)

Не использовать фото из `public/images/` — те уже оптимизированы для веб
(WebP, кропнутые). Только оригинал из `assets/`.

## Цветовая палитра

| Элемент | Hex |
|---|---|
| Фон текстового блока | `#1a1a2e` |
| Акцентный синий (заголовок, линия) | `#2563eb` |
| Технический текст (eyebrow) | `#38bdf8` (cyan) |
| Основной текст (заголовки) | `#ffffff` |
| Второстепенный текст | `#9ca3af` |
| Горизонтальный разделитель | `#334155` |

## Шрифты

| Текст | Семейство | Вес | Размер |
|---|---|---|---|
| «Дмитрий Синявский» | Inter | 600 | 28px |
| `~/R3CODE $ SRE · OBSERVABILITY` | JetBrains Mono | 400 | 24px |
| «ПРОЦЕССЫ НАДЁЖНОСТИ» | Inter | 800 | 48px |
| «ИЗ РЕАЛЬНОГО ОПЫТА» | Inter | 800 | 48px |
| «От SLO и постмортемов» | Inter | 600 | 48px |
| «до AI-Ready Observability» | Inter | 800 | 48px |
| «→ Доклады · Шаблоны · Open-source» | JetBrains Mono | 400 | 20px |

Все 4 заголовка — **одинаковый размер 48px**.

Шрифты подключаются через Google Fonts (`<link>` в `<head>` HTML-шаблона).

## Градиент-маска на фото

Только на правом краю фото (для плавного слияния с тёмным фоном):

```css
background: linear-gradient(
  to right,
  transparent 0%,
  transparent 70%,
  rgba(26, 26, 46, 0.4) 85%,
  #1a1a2e 100%
);
```

Лицо и левое ухо — **не перекрываются** градиентом.

## Декоративные элементы

1. **Вертикальная акцентная линия** — 4px, `#2563eb`, на левом краю текстового блока
2. **Горизонтальный разделитель** — 1px, `#334155`, width 200px, после имени автора

## Шаги регенерации

### Шаг 1: Предобработка фото (Python)

```bash
cd /path/to/r3code-website
python3 scripts/gen_og_photo.py
```

Создаёт `/tmp/og-photo.jpg` (600×630, face-focused smart crop + resize).

Скрипт: `scripts/gen_og_photo.py`
- Открывает `assets/dima-portrait-photo.jpg`
- Smart crop: верх 5%-80% по вертикали (лицо в центре)
- Resize в 600×630 через LANCZOS
- Сохраняет в `/tmp/og-photo.jpg`

### Шаг 2: Редактирование HTML (если нужны текстовые правки)

Файл: `scripts/og_source.html`

Если нужно поменять тексты, размеры шрифтов или цвета — отредактируй
этот файл. Фото в нём ссылается на `/tmp/og-photo.jpg` (результат шага 1).

### Шаг 3: Рендер через headless браузер

```bash
agent-browser set viewport 1200 630
agent-browser open "file:///absolute/path/to/r3code-website/scripts/og_source.html"
sleep 3  # ждём загрузки Google Fonts
agent-browser screenshot /tmp/og_render.png
```

### Шаг 4: Конвертация PNG → JPEG

```python
from PIL import Image
im = Image.open('/tmp/og_render.png').convert('RGB')
im.save('public/og.jpg', 'JPEG', quality=85, optimize=True, progressive=True)
```

Файл `public/og.jpg` будет заменён. Ориентировочный размер: 70-100 KB.

## Проверка

После генерации проверь пиксельный состав:

```python
from PIL import Image
im = Image.open('public/og.jpg')

# Левая часть — фото (должны быть skin-tone пиксели)
left = im.crop((0, 0, 300, 630))
skin = sum(1 for r,g,b in left.getdata() if r > g > b and r > 100 and g > 80)
print(f"Left (photo): {skin*100//len(list(left.getdata()))}% skin-tone")

# Правая часть — тёмный фон (должны быть dark пиксели)
right = im.crop((900, 0, 1200, 630))
dark = sum(1 for r,g,b in right.getdata() if r < 80 and g < 80 and b < 80)
print(f"Right (text bg): {dark*100//len(list(right.getdata()))}% dark")

# Верхний левый угол — голова не обрезана (bright pixels)
top = im.crop((0, 0, 300, 50))
bright = sum(1 for r,g,b in top.getdata() if r > 100 or g > 100 or b > 100)
print(f"Top-left (head): {bright*100//len(list(top.getdata()))}% bright (>10% = OK)")
```

Ожидаемые значения:
- Left: >70% skin-tone (фото видно)
- Right: >90% dark (текстовый фон)
- Top-left: >50% bright (голова не обрезана)

## Обновление preview в соцсетях

После изменения `og.jpg` или мета-тегов соцсети кэшируют старый preview.
Чтобы форсировать обновление:

### Telegram

1. Написать боту **@WebpageBot** (`https://t.me/WebpageBot`)
2. Отправить боту ссылку на сайт (например `https://r3code.github.io/r3code-website/`)
3. Нажать **«Update preview»**
4. Проверить: отправить ссылку себе в «Избранное» в Telegram
5. Убедиться, что картинка, заголовок и описание обновились

## Что НЕ делать

- ❌ **Не использовать `object-fit: cover`** — обрезает голову. Только `contain` с Python предобработкой.
- ❌ Не брать фото из `public/images/` — те уже кропнутые и оптимизированные. Только `assets/dima-portrait-photo.jpg`.
- ❌ Не менять размер (1200×630) — стандарт для соцсетей.
- ❌ Не использовать PNG (слишком тяжёлый, 200+ KB). Только JPEG quality 85.
- ❌ Не вставлять эмодзи в OG image.

## Файлы

| Файл | Назначение |
|---|---|
| `assets/dima-portrait-photo.jpg` | Оригинал фото (2855×2855) |
| `scripts/gen_og_photo.py` | Python: предобработка (crop + resize → 600×630) |
| `scripts/og_source.html` | HTML-шаблон (Google Fonts + CSS) |
| `public/og.jpg` | Финальный результат (1200×630, JPEG) |
