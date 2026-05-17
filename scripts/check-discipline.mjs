// Discipline checker: turns the docs-only correctness rules into hard
// failures so a cold restart (no memory of the system) can't silently
// drift. Same zero-dependency house style as scripts/check-tokens.mjs —
// Node only, process.exit(1) on any violation, self-teaching messages.
// Wired into CI (.github/workflows/build.yml) AND runnable locally via
// `npm run check:discipline`.
//
// Deliberately conservative — a gate that false-positives on the clean
// tree trains you to ignore CI. The exclusions below are legitimate
// fixtures (the /reference catalog and the colour-mixer experiment),
// matching the same carve-outs the design-token/layout skills document.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Path fragments that are exempt: layout primitives ARE where layout CSS
// lives; /reference is a live demo catalog (it intentionally shows raw
// values, inline styles, multiple <h1> sample snippets); colour-mixer is
// a standalone interactive experiment, not a primitive-composed page.
const EXCLUDE = [
    'src/components/primitives/',
    'src/pages/reference/',
    'src/pages/play/colour-mixer.astro',
];
const isExcluded = (p) => EXCLUDE.some((e) => p.replace(/\\/g, '/').includes(e));

function walk(dir, exts) {
    const out = [];
    let entries;
    try {
        entries = readdirSync(dir, { recursive: true });
    } catch {
        return out;
    }
    for (const e of entries) {
        const p = join(dir, e);
        if (!exts.some((x) => p.endsWith(x))) continue;
        try {
            if (statSync(p).isFile()) out.push(p.replace(/\\/g, '/'));
        } catch {
            /* ignore */
        }
    }
    return out;
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const problems = [];
const add = (msg) => problems.push(msg);

// --- R1: no layout CSS in page/component files ---------------------------
// Only scan CSS regions (<style> blocks + style= attribute values) so the
// <Image sizes="(max-width: 640px) ..."> HTML attribute never trips it.
const LAYOUT_PROP =
    /(?:^|[{;])\s*(max-width|min-width|padding|padding-block|padding-inline|margin|margin-top|margin-bottom|margin-left|margin-right|margin-block|margin-inline|display)\s*:\s*([^;}]+)/gi;

function cssRegions(src) {
    const regions = [];
    for (const m of src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
        regions.push({ start: m.index + m[0].indexOf(m[1]), text: m[1] });
    }
    for (const m of src.matchAll(/\bstyle\s*=\s*("([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/gi)) {
        const val = m[2] ?? m[3] ?? m[4] ?? '';
        regions.push({ start: m.index + m[0].indexOf(val), text: val });
    }
    return regions;
}

for (const file of [...walk('src/pages', ['.astro']), ...walk('src/components', ['.astro'])]) {
    if (isExcluded(file)) continue;
    const src = readFileSync(file, 'utf8');
    for (const region of cssRegions(src)) {
        for (const m of region.text.matchAll(LAYOUT_PROP)) {
            const prop = m[1].toLowerCase();
            const value = m[2].trim();
            if (prop === 'display' && !/\b(grid|flex)\b/i.test(value)) continue;
            const ln = lineOf(src, region.start + m.index);
            add(
                `${file}:${ln} — R1 layout-in-component — \`${prop}: ${value}\` — ` +
                    `layout belongs in a primitive; compose with Section/Container/Stack/Grid/Cluster, not inline CSS`
            );
        }
    }
}

// --- R2: no raw hex outside the :root token block ------------------------
{
    const CSS_PATH = 'src/styles/global.css';
    const css = readFileSync(CSS_PATH, 'utf8');
    const rootStart = css.indexOf(':root {');
    const rootEnd = css.indexOf('\n}', rootStart);
    const before = rootStart === -1 ? css : css.slice(0, rootStart);
    const after = rootEnd === -1 ? '' : css.slice(rootEnd);
    for (const [label, chunk, base] of [
        ['before', before, 0],
        ['after', after, rootEnd === -1 ? 0 : rootEnd],
    ]) {
        for (const m of chunk.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
            const ln = lineOf(css, base + m.index);
            add(
                `${CSS_PATH}:${ln} — R2 raw-hex-outside-:root — \`${m[0]}\` (${label} the :root block) — ` +
                    `define it as a primitive in :root and reference it via a semantic var(--token)`
            );
        }
    }
}

// --- R3: at most one <h1> per page (reference/** is a demo catalog) ------
for (const file of walk('src/pages', ['.astro'])) {
    if (file.replace(/\\/g, '/').includes('src/pages/reference/')) continue;
    const src = readFileSync(file, 'utf8');
    const count = (src.match(/<h1[\s>]/g) || []).length;
    if (count > 1) {
        add(
            `${file} — R3 multiple-h1 — found ${count} <h1> — ` +
                `one <h1> per page; the header brand is <a class="brand">, not an <h1>`
        );
    }
}

// --- R4: lowercase content image filenames + references -----------------
const IMG_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.avif'];
for (const file of walk('src/content', IMG_EXT)) {
    const base = file.split('/').pop();
    if (/[A-Z]/.test(base)) {
        add(
            `${file} — R4 uppercase-filename — \`${base}\` — ` +
                `rename to lowercase-hyphenated; macOS is case-insensitive but Vercel's Linux build is not`
        );
    }
}
for (const md of walk('src/content', ['.md'])) {
    const src = readFileSync(md, 'utf8');
    const refRe = /(?:!\[[^\]]*\]\(\.\/([^)]+)\)|<img[^>]+src="\.\/([^"]+)")/g;
    for (const m of src.matchAll(refRe)) {
        const ref = (m[1] ?? m[2] ?? '').split(/[?#]/)[0];
        if (/[A-Z]/.test(ref)) {
            add(
                `${md}:${lineOf(src, m.index)} — R4 uppercase-image-ref — \`${ref}\` — ` +
                    `use the lowercase filename; a wrong-case ref breaks Vercel's Linux build`
            );
        }
    }
}

// --- R5: unique explicit `order` across projects ------------------------
{
    const seen = new Map();
    for (const md of walk('src/content/projects', ['.md'])) {
        if (!md.endsWith('/index.md')) continue;
        const slug = md.split('/').slice(-2, -1)[0];
        const m = readFileSync(md, 'utf8').match(/^order:\s*(\d+)\s*$/m);
        if (!m) continue;
        const ord = Number(m[1]);
        (seen.get(ord) ?? seen.set(ord, []).get(ord)).push(slug);
    }
    for (const [ord, slugs] of seen) {
        if (slugs.length > 1) {
            add(
                `src/content/projects — R5 duplicate-order — order ${ord} on: ${slugs.join(', ')} — ` +
                    `give each project a unique \`order\`; duplicates sort unpredictably`
            );
        }
    }
}

// --- Report -------------------------------------------------------------
if (problems.length > 0) {
    console.error(`check-discipline: ${problems.length} violation(s)\n`);
    for (const p of problems) console.error(`  • ${p}`);
    console.error('\nFix each, then re-run `npm run check:discipline`.');
    process.exit(1);
}

console.log(
    'check-discipline: OK — R1–R5 clean (no inline layout CSS, raw hex, extra <h1>, uppercase image, or duplicate order).'
);
