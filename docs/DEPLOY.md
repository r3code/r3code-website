# DEPLOY.md — процесс деплоя и отката

## Как работает деплой

Push в `main` → GitHub Actions → build → WCAG check → upload artifact →
deploy на GitHub Pages.

### Workflow: `.github/workflows/deploy.yml`

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    steps:
      - checkout
      - setup-node (20, cache npm)
      - npm ci
      - npm run build              # astro check + build
      - node scripts/check-contrast.mjs   # WCAG AA
      - configure-pages
      - upload-pages-artifact (./dist)
  deploy:
    needs: build
    environment: github-pages
    steps:
      - deploy-pages (deploy artifact)
```

### Что проверяется

1. **TypeScript strict** — `astro check` падает на любых type errors.
2. **Build** — `astro build` рендерит все страницы в `dist/`.
3. **WCAG AA contrast** — `check-contrast.mjs` читает пары из
   `contrast-pairs.json` и падает, если хоть одна пара < 4.5:1 (или 3.0 для
   large text).
4. **Sitemap** — `@astrojs/sitemap` генерит `sitemap-index.xml`.

Если что-то падает — деплой НЕ происходит, сайт остаётся на предыдущей
версии.

## URL

- **Текущий (GitHub Pages project):** `https://r3code.github.io/r3code-website/`
- **Планируемый (custom domain):** `https://r3code.ru/`

### Миграция на r3code.ru

Когда будешь готов переключиться:

1. **В `astro.config.mjs`:**
   ```js
   const SITE_URL = 'https://r3code.ru';
   const BASE_PATH = '/';  // или просто убрать base: ...
   ```

2. **В `src/consts.ts`:**
   - `SITE.url` → `'https://r3code.ru'`
   - `SITE.futureUrl` оставить как есть (или убрать поле)

3. **В `public/robots.txt`:**
   ```
   Sitemap: https://r3code.ru/sitemap-index.xml
   ```

4. **Создать `public/CNAME`** с одной строкой: `r3code.ru`

5. **DNS у регистратора:**
   - Apex: A-записи на GitHub Pages IP (185.199.108/109/110/111.153)
   - Или поддомен `www`: CNAME на `r3code.github.io`

6. **GitHub repo → Settings → Pages → Custom domain:** ввести `r3code.ru`,
   включить **Enforce HTTPS**.

7. **JSON-LD** — все ссылки в Person/Service уже указывают на
   `https://r3code.ru`, отдельной правки не требуется.

8. **OG image** — там URL относительный (`/og.jpg`), автоматически
   разрешится через canonical URL.

## Откат

### Если сломался билд на main

1. Найди последний зелёный коммит: `git log --oneline` или на GitHub → Actions
2. `git revert <bad-commit>` + push — это создаст revert-коммит и запустит
   workflow заново
3. Или `git reset --hard <good-commit> && git push --force-with-lease` (если
   bad-коммит единственный и можно выкинуть)

### Если надо быстро отключить функцию

Закомментируй компонент в `src/pages/index.astro` (например, `<Tools />` →
`{/* <Tools /> */}`), сделай commit, push. Через ~40 секунд обновится.

### Если упал деплой (workflow красный)

1. Открой https://github.com/r3code/r3code-website/actions
2. Найди упавший run, открой логи
3. Если упал на `astro check` — TypeScript error, чини код
4. Если упал на `check-contrast.mjs` — контраст-пара ниже AA, чини цвет
5. Если упал на deploy-pages — проблема с правами/артефактом, проверь
   Settings → Pages → Source = "GitHub Actions"

## Локальная проверка перед push

```bash
npm run build               # без ошибок
node scripts/check-contrast.mjs   # exit 0
npm run preview             # открыть http://localhost:4321/r3code-website/
```

Если менял тексты/фото для OG — перегенерируй `public/og.jpg` по
инструкции в [OG-IMAGE.md](OG-IMAGE.md).

Если всё зелёное — push смело.

## Проверка внешних ссылок на 404 (раз в квартал)

Внешние ссылки (на сайты конференций, GitHub, YouTube, VK Видео и т.д.) могут
стать 404 без твоего участия: конференция закрылась, видео удалили,
репозиторий стал приватным. Чтобы это не появилось на проде незамеченным —

прогоняй **`python3 scripts/check_external_links.py`** раз в квартал.

### Что скрипт делает

1. Сканирует все `.astro`, `.ts`, `.md`, `.html`, `.txt` файлы в репозитории
2. Извлекает все URL, начинающиеся с `http://` или `https://`
3. Фильтрует внутренние (r3code.ru, r3code.github.io, localhost) и
   инфраструктурные (fonts.googleapis.com, mc.yandex.ru, Telegram deep links)
4. Для каждого оставшегося URL делает `curl -sIL` (HEAD с редиректами)
5. Печатает отчёт: какие 200, какие 404, какие non-200 с пояснениями
6. Exit 0 если всё 200, exit 1 если есть 404

### Почему не в CI

Я проверял — из ~43 внешних URL **9 возвращают non-200**, но только
**2 оказались реальными 404**. Остальные 7 — false positives:
anti-bot защита сайтов (Cloudflare на observability-conf.ru и 2026.hardfest.ru,
VK Видео возвращает 418 "I'm a teapot", LinkedIn блокирует curl).

Если встроить проверку в CI, она будет падать на каждый пуш из-за false
positives, и реальные 404 потеряются в шуме. Поэтому — только ручной прогон.

### Как интерпретировать отчёт

| Код | Что значит | Действие |
|---|---|---|
| 200 | OK | ничего не делать |
| 404 | реальная битая ссылка | **почини** (замени URL или удали элемент) |
| 403 | Cloudflare anti-bot | проверить в браузере; если открывается — false positive |
| 418 | VK/сокращалки anti-bot | проверить в браузере |
| 405 | LinkedIn authwall | норма для LinkedIn без сессии |
| 000 | timeout/DNS | проверить в браузере; возможно, сайт лёг |

### Что проверять в браузере при non-200

```bash
agent-browser open "https://example-url.com/"
# или вручную в обычном браузере
```

Если страница открывается и показывает ожидаемый контент — false positive,
ссылку не трогай. Если реально 404 — чини.

## Лимиты

- GitHub Pages: 100GB/месяц bandwidth, 10GB/репозиторий (для нас избыточно)
- GitHub Actions: 2000 минут/месяц free для публичных репо
- Текущий build занимает ~40 секунд

## Миграция на кастомный домен r3code.ru

Когда будешь готов переключиться с
`https://r3code.github.io/r3code-website/` на `https://r3code.ru/`:

1. **`astro.config.mjs`** — изменить:
   ```js
   site: 'https://r3code.ru',
   // base: убрать полностью
   ```

2. **`src/consts.ts`** — обновить `SITE.url` на `'https://r3code.ru'`.

3. **`public/robots.txt`** — обновить sitemap URL:
   ```
   Sitemap: https://r3code.ru/sitemap-index.xml
   ```

4. **`public/CNAME`** — создать файл с одной строкой:
   ```
   r3code.ru
   ```

5. **DNS у регистратора:**
   - Apex-домен: A-записи на GitHub Pages IP:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Или `www`: CNAME на `r3code.github.io`

6. **GitHub repo → Settings → Pages → Custom domain:**
   ввести `r3code.ru`, включить **Enforce HTTPS**.

7. **JSON-LD** — уже указывает на `https://r3code.ru` (Person.url,
   WebSite.url, Service provider url). Отдельной правки не требуется.

8. **og:url, og:image** — строятся динамически из canonical URL.
   После смены `site` в конфиге — автоматически обновятся на `https://r3code.ru/...`.

9. **GitHub Pages 301-редирект:** после настройки CNAME GitHub автоматически
   редиректит `r3code.github.io/r3code-website/` → `r3code.ru/`. Никаких
   дополнительных действий не нужно.

10. **Google Search Console** — добавить property `https://r3code.ru`.
    Файл верификации уже в `public/googlef778e919928e59c1.html`.
    Отправить sitemap: `https://r3code.ru/sitemap-index.xml`.

11. **Яндекс.Метрика** — в настройках счётчика 114133983 обновить домен
    на `r3code.ru`.
