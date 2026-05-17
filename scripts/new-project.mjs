// Project scaffolder — `npm run new:project <slug>`.
// Emits src/content/projects/<slug>/index.md with EVERY frontmatter field
// from the content.config.ts schema present and commented, a unique
// `order` (max existing + 1, so check-discipline R5 can't trip), and
// `layout: default # default | full-bleed` so the option is discovered
// by being in the file. Zero dependencies — same house style as the
// other scripts. The right shape becomes the path of least resistance.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PROJECTS_DIR = 'src/content/projects';
const slug = process.argv[2];

if (!slug) {
    console.error('Usage: npm run new:project <slug>');
    console.error('  <slug> must be lowercase-hyphenated, e.g. studio-rebrand');
    process.exit(1);
}

// Enforce the Vercel-case rule at creation time (macOS is case-insensitive
// but the Linux build is not — a wrong-case slug breaks production).
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    console.error(`Invalid slug "${slug}".`);
    console.error('  Must be lowercase letters/digits, hyphen-separated: ^[a-z0-9]+(-[a-z0-9]+)*$');
    process.exit(1);
}

const dir = join(PROJECTS_DIR, slug);
if (existsSync(dir)) {
    console.error(`Refusing to overwrite — ${dir} already exists.`);
    process.exit(1);
}

// Unique order = (max existing explicit order) + 1.
let maxOrder = 0;
try {
    for (const entry of readdirSync(PROJECTS_DIR)) {
        const md = join(PROJECTS_DIR, entry, 'index.md');
        if (!existsSync(md)) continue;
        const m = readFileSync(md, 'utf8').match(/^order:\s*(\d+)\s*$/m);
        if (m) maxOrder = Math.max(maxOrder, Number(m[1]));
    }
} catch {
    /* no projects yet — order starts at 1 */
}
const order = maxOrder + 1;

const today = new Date().toISOString().slice(0, 10);
const title = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const indexMd = `---
title: ${title}
description: One-line summary shown on project cards and the project page
cover: ./cover.png
date: ${today}
order: ${order}
layout: default # default | full-bleed
tags: [] # optional, e.g. ['identity', 'editorial'] — drives the homepage filter
draft: false # true = committed to git but hidden from the live site
---

## Overview

Write the case study here.

Inline images: prefer the Markdown form \`![alt text](./image.png)\` — Astro
optimizes it (WebP, dimensions, lazy). The raw \`<figure><img>\` form is NOT
optimized; only reach for it when you genuinely need a \`<figcaption>\`.
`;

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'index.md'), indexMd);

console.log(`Created ${join(dir, 'index.md')} (order: ${order}, layout: default)\n`);
console.log('Next:');
console.log(`  1. Add the cover image as ${join(dir, 'cover.png')} (lowercase).`);
console.log('  2. Write the case study in index.md.');
console.log('  3. npm run dev — preview at /projects/' + slug);
console.log(
    '  4. Gate: npm run format:check && npm run check && npm run check:tokens && npm run check:discipline && npm run build'
);
