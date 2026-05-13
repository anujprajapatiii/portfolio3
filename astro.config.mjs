// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Lucide icons come from @lucide/astro — each icon is a named import that
// renders as an inline SVG. No integration needed. See CLAUDE.md → Icons.

// https://astro.build/config
export default defineConfig({
    site: 'https://portfolio3-mocha-ten.vercel.app',
    integrations: [sitemap()],
    // /design-system was renamed to /reference. Permanent redirects so any
    // shared URL still lands at the right page.
    redirects: {
        '/design-system': '/reference',
        '/design-system/sections': '/reference/sections',
    },
});
