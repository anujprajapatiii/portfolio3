import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/projects',
        // Strip "/index" so a folder like aoe2-art/index.md
        // produces the slug "aoe2-art" (URL: /projects/aoe2-art).
        generateId: ({ entry }) => entry.replace(/(\/index)?\.md$/, ''),
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            cover: image(),
            date: z.coerce.date(),
            order: z.number().optional(),
            // Which project page template to render. 'default' = cover
            // constrained to the page container; 'full-bleed' = cover spans
            // the full viewport. To add a template: add a value here AND a
            // matching entry in the layouts map in pages/projects/[slug].astro.
            layout: z.enum(['default', 'full-bleed']).default('default'),
            // Optional free-form tags (e.g. ['identity', 'editorial']) — no UI yet,
            // exists so future tag-filtering on the homepage doesn't require backfill.
            tags: z.array(z.string()).optional(),
            // Set draft: true to commit a project to git without showing it on the
            // live site. The homepage and footer queries filter by !data.draft.
            draft: z.boolean().default(false),
        }),
});

// Lightweight counterpart to `projects` — these are experiments, sketches,
// micro-tools. Schema intentionally optional-heavy: an experiment may be a
// title + one paragraph, or it may be a full writeup with a cover. Don't
// require what isn't always there. Chronological by `date`; no `order` field
// because experiments are read by recency, not curated ranking.
//
// Adding one: drop `src/content/experiments/<slug>.md` with frontmatter.
// For an interactive page instead of a writeup, create
// `src/pages/play/<slug>.astro` with an `export const meta = {...}` block —
// the /play index lists both kinds together.
const experiments = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/experiments',
        generateId: ({ entry }) => entry.replace(/(\/index)?\.md$/, ''),
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            date: z.coerce.date(),
            // Optional — most experiments won't have a cover.
            cover: image().optional(),
            // External demo (CodePen, deployed app, video) — opens in a new tab.
            demo: z.string().url().optional(),
            // Source/repo URL.
            repo: z.string().url().optional(),
            tags: z.array(z.string()).optional(),
            draft: z.boolean().default(false),
        }),
});

export const collections = { projects, experiments };
