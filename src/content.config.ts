import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
    loader: glob({
        pattern: '**/*.md',
        base: './src/content/projects',
        // Strip "/index" so a folder like aoe2-art-direction/index.md
        // produces the slug "aoe2-art-direction" (URL: /projects/aoe2-art-direction).
        generateId: ({ entry }) => entry.replace(/(\/index)?\.md$/, ''),
    }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string(),
            cover: image(),
            date: z.coerce.date(),
            order: z.number().optional(),
        }),
});

export const collections = { projects };
