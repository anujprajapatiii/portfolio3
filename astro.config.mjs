// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
    site: 'https://portfolio3-mocha-ten.vercel.app',
    integrations: [
        sitemap(),
        // astro-icon — pulls icons from @iconify-json/* packs (we install
        // @iconify-json/lucide for Lucide icons). Use as <Icon name="lucide:sun" />.
        // Build-time SVG inlining; only icons we reference end up in the build.
        icon(),
    ],
});
