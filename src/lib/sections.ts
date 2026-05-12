// Section library — auto-discovery for the gallery at /design-system/sections.
//
// One file under src/components/sections/<category>/<slug>.astro is one
// copy-paste section. Each file exports a `meta` object describing it.
//
// Vite's import.meta.glob discovers every section file at build time.
// Two passes — one for the rendered component (default export) + meta,
// one for the raw source string via the `?raw` query — guarantees the
// preview and the visible snippet are produced from the same on-disk file.

import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

export type SectionMeta = {
    name: string; // display name, e.g. "Centered hero"
    category: string; // folder name, e.g. "hero". Must match the file's parent folder.
    use: string; // one-line description of when to reach for this section
    order?: number; // sort within a category. Lower first. Default 99.
    /**
     * Optional override of the snippet shown in the gallery.
     *
     * Most sections should omit this: the file body itself is the snippet,
     * which guarantees preview and code can't drift.
     *
     * Use when the preview needs placeholder markup (e.g. a grey
     * `<div class="ds-fake-image" />` standing in for a `<Image />`) that
     * differs from the real paste-ready code. Keep the snippet short and
     * close to what a designer would actually paste into a real page.
     */
    snippet?: string;
};

export type SectionEntry = SectionMeta & {
    slug: string; // `${category}-${filename}`, e.g. "hero-centered"
    order: number;
    Component: AstroComponentFactory;
    source: string; // cleaned snippet shown in the gallery
};

// `eager: true` so the registry is fully populated at module load — the
// gallery is server-rendered, no need for lazy import boundaries.
const modules = import.meta.glob('../components/sections/*/*.astro', {
    eager: true,
}) as Record<string, { default: AstroComponentFactory; meta?: SectionMeta }>;

const sources = import.meta.glob('../components/sections/*/*.astro', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>;

// Strip the frontmatter block. The snippet is what a designer pastes into a
// page that already has its own imports — showing the `export const meta` and
// import lines just adds noise to copy around.
function cleanSource(source: string): string {
    return source.replace(/^---\n[\s\S]*?\n---\n*/, '').trimStart();
}

export const sections: SectionEntry[] = Object.entries(modules)
    .map(([path, mod]) => {
        const match = path.match(/sections\/([^/]+)\/([^/]+)\.astro$/);
        if (!match) {
            throw new Error(`Section path does not match expected shape: ${path}`);
        }
        if (!mod.meta) {
            throw new Error(
                `Section ${path} is missing an \`export const meta = { name, category, use }\` block in its frontmatter.`
            );
        }
        const [, category, file] = match;
        if (mod.meta.category !== category) {
            throw new Error(
                `Section ${path} declares category "${mod.meta.category}" but lives in folder "${category}". Keep them in sync.`
            );
        }
        return {
            slug: `${category}-${file}`,
            category,
            name: mod.meta.name,
            use: mod.meta.use,
            order: mod.meta.order ?? 99,
            Component: mod.default,
            source: mod.meta.snippet ?? cleanSource(sources[path]),
        };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));

// Category list preserves the order categories are first encountered in the
// sorted sections list, then we re-sort by a stable canonical order below so
// the rail isn't reshuffled when adding a section.
const CATEGORY_ORDER = [
    'hero',
    'navbar',
    'footer',
    'cta',
    'pricing',
    'faq',
    'testimonial',
    'logo',
    'gallery',
    'contact',
    'content',
    'card-grid',
    'blog',
];

export const categories: string[] = [...new Set(sections.map((s) => s.category))].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a);
    const bi = CATEGORY_ORDER.indexOf(b);
    // Unknown categories sort to the end alphabetically.
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
});

// Human-readable label for a category. Folder names are kebab-case; the rail
// shows "Card grid" not "card-grid". Common acronyms get their canonical
// uppercase form so we don't show "Cta" or "Faq".
const ACRONYMS = new Set(['cta', 'faq', 'seo', 'ui', 'ux', 'api']);

export function categoryLabel(category: string): string {
    return category
        .split('-')
        .map((part, i) => {
            if (ACRONYMS.has(part)) return part.toUpperCase();
            // Only the first word is capitalised — "Card grid", not "Card Grid".
            if (i === 0) return part.charAt(0).toUpperCase() + part.slice(1);
            return part;
        })
        .join(' ');
}

export function sectionsByCategory(category: string): SectionEntry[] {
    return sections.filter((s) => s.category === category);
}
