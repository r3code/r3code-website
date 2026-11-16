/**
 * Content collections — r3code.ru
 *
 * Talks (доклады, круглые столы, подкасты) are managed as Markdown files
 * in `src/content/talks/`. Add a new `.md` file → page /talks/<slug>/
 * appears automatically.
 *
 * Articles (статьи) live in `src/content/articles/`. Two kinds:
 *   - external: `url` is set (e.g. Habr) → card on /articles/ opens the
 *     link in a new tab, no detail page is generated;
 *   - internal: `url` omitted → detail page /articles/<slug>/ renders the
 *     Markdown body (requires a non-empty body, enforced at build time).
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const talks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks' }),
  schema: z.object({
    /** Talk title as it appears in the program. */
    title: z.string(),
    /** Conference / venue short name, e.g. "DevOpsConf 2026". */
    venue: z.string(),
    /** Year of the talk (used for grouping & sorting). */
    year: z.number().int(),
    /**
     * Content type:
     *   talk        — speaker session / presentation
     *   roundtable  — panel discussion (participant, not keynote)
     *   podcast     — guest appearance or host role
     */
    type: z.enum(['talk', 'roundtable', 'podcast']),
    /** ISO date if known, optional. */
    date: z.string().optional(),
    /** Conference / venue URL (event page). */
    venueUrl: z.string().url().optional(),
    /** Audience ratings (out of 5). */
    rating: z
      .object({
        content: z.number().min(0).max(5),
        delivery: z.number().min(0).max(5),
      })
      .optional(),
    /** Speaker role on this particular item. */
    role: z
      .enum(['speaker', 'invited-expert', 'host', 'guest'])
      .default('speaker'),
    /** Video recordings (multiple platforms allowed). */
    videos: z
      .array(
        z.object({
          platform: z.string(), // e.g. "YouTube", "RuTube", "VK Видео"
          url: z.string().url(),
        }),
      )
      .default([]),
    /** Slides URL (Google Slides, PDF, etc.). */
    slides: z.string().url().optional(),
    /** Abstract / talk page on conference site. */
    abstract: z.string().url().optional(),
    /** Free-form note (extra context, related playlist, etc.). */
    note: z.string().optional(),
    /** Mark as one of the 3 featured talks on the homepage. */
    featured: z.boolean().default(false),
    /** Short teaser for cards (1 sentence). Auto-generated from body if absent. */
    teaser: z.string().optional(),
    /** Technology keywords for card subtitle (e.g. "Vector + ClickHouse"). */
    subtitle: z.string().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    /** Article title as shown on the card and detail page. */
    title: z.string(),
    /**
     * Publication date, ISO `YYYY-MM-DD`. Required — drives the
     * newest-first sorting on /articles/ and the DD.MM.YYYY display.
     */
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be ISO YYYY-MM-DD'),
    /**
     * External article URL (e.g. Habr). Omit for internal articles —
     * then a detail page /articles/<slug>/ is generated from the body.
     */
    url: z.string().url().optional(),
    /** Source platform label for cards, e.g. "Habr". Default: "r3code.ru". */
    source: z.string().optional(),
    /** Short teaser for the card (1–2 sentences). */
    teaser: z.string(),
    /**
     * Tags shown instead of ratings on cards and the article page.
     * Usually taken from Habr hubs. Corporate tags («Блог компании Ви.Tech»
     * and anything containing «Ви.Tech») are forbidden — the build fails.
     * Requirement is documented in docs/CONTENT.md.
     */
    tags: z
      .array(z.string().min(1))
      .min(1, 'статья должна иметь хотя бы один тег (см. docs/CONTENT.md)')
      .refine(
        (tags) => !tags.some((t) => /ви\.?tech/i.test(t)),
        'теги не должны содержать корпоративные теги («Ви.Tech») — исключай их при переносе с Habr (см. docs/CONTENT.md)',
      ),
  }),
});

export const collections = { talks, articles };
