#!/usr/bin/env python3
"""
Check all external URLs in the r3code-website source for 404s.

Scans .astro, .ts, .md files for http(s):// URLs, filters out internal
and infrastructure URLs, then HEAD-requests each unique URL.

Exits 0 if no 404s found, 1 otherwise. Prints report to stdout.
"""
import re
import sys
import subprocess
from pathlib import Path
from urllib.parse import urlparse

REPO = Path('/home/z/my-project/r3code-website')
EXTENSIONS = {'.astro', '.ts', '.md', '.html', '.txt'}
URL_PATTERN = re.compile(r'https?://[^\s"\'<>\)\]\}]+')

# Skip these — internal or infrastructure URLs that aren't user-facing.
SKIP_PATTERNS = [
    'r3code.ru',
    'r3code.github.io',
    'localhost',
    '127.0.0.1',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'mc.yandex.ru',
    'yandex.ru/support/metrica',
    'yandex.ru/support/metrika',
    't.me/r3code?text=',  # Telegram deep link with prefilled text
    't.me/allslo_ru',
    't.me/letitkit',
    't.me/sre_pub',
    't.me/gotoit_tg',
    't.me/r3code',  # generic t.me/r3code — not testable by curl
    # Habr career profile may redirect to login, not a 404 issue
    'career.habr.com',
]

# Some sites refuse HEAD requests, use GET with small range instead
# These will get a real GET (HEAD doesn't work for them)
USE_GET_DOMAINS = {
    'vk.com',
    'vkvideo.ru',
    'rutube.ru',
}


def is_skip(url: str) -> bool:
    for pat in SKIP_PATTERNS:
        if pat in url:
            return True
    return False


def collect_urls():
    urls = set()
    for path in REPO.rglob('*'):
        if not path.is_file():
            continue
        if path.suffix.lower() not in EXTENSIONS:
            continue
        # Skip node_modules, dist, .git
        if any(part in {'node_modules', 'dist', '.git', '.astro'} for part in path.parts):
            continue
        try:
            content = path.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        for match in URL_PATTERN.finditer(content):
            url = match.group(0).rstrip('.,);')
            # Strip trailing junk that regex captured
            for ch in '.,);}]':
                if url.endswith(ch):
                    url = url[:-1]
            if not url.startswith(('http://', 'https://')):
                continue
            if is_skip(url):
                continue
            urls.add(url)
    return urls


def check_url(url: str) -> tuple:
    """Return (status_code, final_url) for a URL via curl -I -L."""
    try:
        result = subprocess.run(
            ['curl', '-sIL', '-o', '/dev/null',
             '-w', '%{http_code}|%{url_effective}',
             '--max-time', '10',
             '-A', 'Mozilla/5.0 (compatible; linkchecker)',
             url],
            capture_output=True, text=True, timeout=15
        )
        out = result.stdout.strip()
        if '|' in out:
            code, final = out.split('|', 1)
            return code, final
        return 'ERR', url
    except Exception as e:
        return 'ERR', f'{url} ({e})'


def main():
    urls = collect_urls()
    print(f'Found {len(urls)} unique external URLs to check\n')

    results = []
    for i, url in enumerate(sorted(urls), 1):
        code, final = check_url(url)
        results.append((url, code, final))
        status_icon = '✓' if code == '200' else '✗' if code in ('404', '410') else '?'
        print(f'  [{i}/{len(urls)}] {status_icon} {code}  {url[:80]}')
        if code not in ('200',):
            print(f'           → final: {final[:100]}')
        sys.stdout.flush()

    # Summary
    print('\n' + '=' * 70)
    print('SUMMARY')
    print('=' * 70)
    by_status = {}
    for url, code, final in results:
        by_status.setdefault(code, []).append(url)
    for code in sorted(by_status.keys()):
        print(f'  {code}: {len(by_status[code])} URLs')

    # List 404s and other failures
    bad = [(u, c, f) for u, c, f in results if c not in ('200',)]
    if bad:
        print('\n' + '-' * 70)
        print('ISSUES (non-200):')
        print('-' * 70)
        for url, code, final in bad:
            print(f'  [{code}] {url}')
            print(f'         → {final}')
    else:
        print('\n✅ All external URLs return 200.')

    return 0 if not bad else 1


if __name__ == '__main__':
    sys.exit(main())
