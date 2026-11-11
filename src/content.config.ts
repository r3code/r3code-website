/**
 * Content collections — r3code.ru
 *
 * Talks (доклады, круглые столы, подкасты) are managed as Markdown files
 * in `src/content/talks/`. Add a new `.md` file → page /talks/<slug>/
 * appears automatically.
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

export const collections = { talks };
