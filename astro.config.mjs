// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import astrobook from 'astrobook';

// https://astro.build/config
export default defineConfig({
    site: 'https://portfolio3-mocha-ten.vercel.app',
    integrations: [
        // Exclude Astrobook's component playground from the sitemap so
        // search engines don't index it.
        sitemap({
            filter: (page) => !page.includes('/dashboard'),
        }),
        // Astrobook mounts its component playground under /dashboard:
        //   /dashboard           — home page (entry point)
        //   /dashboard/<story>   — individual story with sidebar
        //   /dashboard/stories/  — isolated story previews (loaded in iframes)
        astrobook({
            subpath: '/dashboard',
            dashboardSubpath: '/',
        }),
    ],
});
