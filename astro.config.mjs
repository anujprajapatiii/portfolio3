// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astrobook from 'astrobook';

// https://astro.build/config
export default defineConfig({
    site: 'https://portfolio3-mocha-ten.vercel.app',
    integrations: [
        // Exclude Astrobook's internal routes from the sitemap so search
        // engines don't index the component playground.
        sitemap({
            filter: (page) =>
                !page.includes('/dashboard/') &&
                !page.includes('/stories/'),
        }),
        // Astrobook mounts a component playground at /dashboard.
        // Stories live next to components as `*.stories.{ts,js}`.
        astrobook(),
    ],
});
