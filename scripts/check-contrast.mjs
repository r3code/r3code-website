#!/usr/bin/env node
/**
 * check-contrast.mjs — WCAG 2.1 AA contrast checker for r3code.ru.
 *
 * Reads color pairs from ./contrast-pairs.json and verifies each pair
 * meets WCAG AA ratio (4.5:1 for normal text, 3.0:1 for large text).
 *
 * Exit codes:
 *   0 — all pairs pass
 *   1 — at least one pair fails (CI should fail)
 *
 * Usage:
 *   node scripts/check-contrast.mjs
 *
 * Add new pair to scripts/contrast-pairs.json when introducing new
 * color combinations in CSS.
 *
 * No external dependencies — pure Node.js, ES modules.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pairsPath = join(__dirname, 'contrast-pairs.json');

/** Convert "#RRGGBB" or "#RGB" hex to [r, g, b] (0-255). */
function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(h, 16);
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

/** Relative luminance of a color per WCAG 2.1 §1.4.3. */
function relativeLuminance([r, g, b]) {
  const toLinear = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/** Contrast ratio between two colors (per WCAG 2.1 §1.4.3). */
function contrastRatio(fg, bg) {
  const L1 = relativeLuminance(hexToRgb(fg));
  const L2 = relativeLuminance(hexToRgb(bg));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Find nearest valid color by darkening/lightening until ratio passes. */
function suggestFix(fg, bg, threshold) {
  // Try darkening fg in 5% steps until ratio passes.
  let [r, g, b] = hexToRgb(fg);
  for (let i = 0; i < 20; i++) {
    r = Math.max(0, Math.round(r * 0.95));
    g = Math.max(0, Math.round(g * 0.95));
    b = Math.max(0, Math.round(b * 0.95));
    const candidate = `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`;
    if (contrastRatio(candidate, bg) >= threshold) {
      return candidate;
    }
  }
  return null;
}

function main() {
  const data = JSON.parse(readFileSync(pairsPath, 'utf-8'));
  const pairs = data.pairs;
  let failures = 0;
  let passes = 0;

  console.log(`\nWCAG AA contrast check — ${pairs.length} pairs\n`);
  console.log(
    'ID'.padEnd(38) +
      'fg'.padEnd(10) +
      'bg'.padEnd(10) +
      'ratio'.padStart(8) +
      '  ' +
      'threshold'.padStart(10) +
      '  status',
  );
  console.log('-'.repeat(90));

  for (const p of pairs) {
    const ratio = contrastRatio(p.fg, p.bg);
    const threshold = p.largeText ? 3.0 : 4.5;
    const passed = ratio >= threshold;
    const status = passed ? 'PASS' : 'FAIL';
    console.log(
      p.id.padEnd(38) +
        p.fg.padEnd(10) +
        p.bg.padEnd(10) +
        ratio.toFixed(2).padStart(8) +
        '  ' +
        threshold.toFixed(1).padStart(10) +
        '  ' +
        status,
    );

    if (passed) {
      passes++;
    } else {
      failures++;
      const fix = suggestFix(p.fg, p.bg, threshold);
      console.log(
        '  → '.padEnd(38) +
          (fix
            ? `suggested fg: ${fix} (ratio would be ${contrastRatio(fix, p.bg).toFixed(2)})`
            : 'could not auto-suggest a fix — pair needs manual review'),
      );
      console.log('  context: ' + p.context);
    }
  }

  console.log('-'.repeat(90));
  console.log(`\nResult: ${passes} passed, ${failures} failed\n`);

  if (failures > 0) {
    console.error(
      `❌ ${failures} color pair(s) fail WCAG AA. Fix them before deploying.`,
    );
    process.exit(1);
  } else {
    console.log('✅ All color pairs meet WCAG AA requirements.');
    process.exit(0);
  }
}

main();
