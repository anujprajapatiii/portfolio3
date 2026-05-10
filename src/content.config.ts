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
            // Optional free-form tags (e.g. ['identity', 'editorial']) — no UI yet,
            // exists so future tag-filtering on the homepage doesn't require backfill.
            tags: z.array(z.string()).optional(),
            // Set draft: true to commit a project to git without showing it on the
            // live site. The homepage and footer queries filter by !data.draft.
            draft: z.boolean().default(false),
        }),
});

export const collections = { projects };
