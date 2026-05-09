---
name: portfolio-layout-primitives
description: Build and audit pages in this portfolio using its Finsweet-inspired layout primitive system. Use when the user asks to add a new page, restructure a section, change page padding, fix responsive breakage, build a new layout component, audit the layout system, or verify how a page looks at different widths. Enforces the composition rule (PageWrapper > Section > Container > Stack/Grid/Cluster), keeps all layout CSS inside primitives (never in page or component files), and runs a four-width screenshot loop before claiming "done".
---

# Portfolio Layout Primitives

A skill for composing pages in this portfolio with predictable, Finsweet-style layout primitives, and verifying responsive behaviour visually before declaring work done.

## The composition rule

Every page in this site follows exactly this nesting order:

```
PageWrapper (in Layout.astro — wraps <main>, <header>, <footer>)
└─ Section size="sm|md|lg|xl"
   └─ Container size="page|reading|narrow"
      └─ Stack | Grid | Cluster
         └─ content
```

No skipping levels. No inlining `max-width`, `padding`, or `margin` in page or component CSS. Layout always comes from the primitives.

## The five primitives

All live in `src/components/primitives/`. The CSS is in `src/styles/global.css` under the "Layout primitives" section.

### `<PageWrapper>` — horizontal page padding
Wraps content to keep it off the screen edges. `padding-inline: var(--space-4)` mobile, `var(--space-5)` tablet+. Already lives inside `Layout.astro`'s `<main>`, `<header>`, and `<footer>` — pages don't need to add it themselves.

### `<Section size="sm|md|lg|xl">` — vertical chunk
Owns `padding-block`. Default `md`. Use:
- `sm` (32px) — tight related blocks
- `md` (48px) — default
- `lg` (80px) — distinct page chapters
- `xl` (120px) — hero / landing moments

### `<Container size="page|reading|narrow">` — max-width + center
Caps content width and centers it. Default `page`. Use:
- `page` (880px) — homepage, project covers, design system
- `reading` (680px) — long-form text (project body)
- `narrow` (600px) — about, intro

### `<Stack gap="sm|md|lg">` — vertical flex
Vertical layout with consistent gap. `sm` (8px), `md` (16px, default), `lg` (32px). Stacks can nest — outer for "heading vs body" rhythm, inner for "paragraph vs paragraph" rhythm.

### `<Cluster gap align justify as>` — horizontal flex
Horizontal layout with wrap. Use for nav, tag rows, link rows. Props:
- `gap`: `sm | md | lg` (default `md`)
- `align`: `start | center | baseline` (default `center`)
- `justify`: `start | between` (default `start`)
- `as`: `div | nav | ul` (default `div`) — switches the rendered tag

### `<Grid min gap>` — auto-fit responsive grid
Uses `repeat(auto-fit, minmax(<min>, 1fr))` so columns collapse based on available width — no media query needed. Props:
- `min`: `220px | 280px | 360px` (default `280px`)
- `gap`: `md | lg` (default `lg`)

## Recipes

### Build a new page

1. Create `src/pages/<name>.astro`.
2. Import `Layout`, `Section`, `Container`, plus whichever inner primitive(s) you need (`Stack`, `Grid`, `Cluster`).
3. Compose using the rule. Skeleton:

```astro
---
import Layout from '../layouts/Layout.astro';
import Section from '../components/primitives/Section.astro';
import Container from '../components/primitives/Container.astro';
import Stack from '../components/primitives/Stack.astro';
---

<Layout title="<Page name> — Anuj Prajapati" description="...">
    <Section size="lg">
        <Container size="narrow">
            <Stack gap="lg">
                <h1>Page heading</h1>
                <Stack gap="md">
                    <p>Body paragraph.</p>
                    <p>Body paragraph.</p>
                </Stack>
            </Stack>
        </Container>
    </Section>
</Layout>
```

4. Add a typography-only class block to `global.css` if needed (no layout values — only font-size, color, etc.).

### Add a section to an existing page

Drop a new `<Section size="...">` block at the appropriate point in the page. Pick a `Container` size and an inner primitive. No need to insert spacing — Section's `padding-block` handles separation from the previous Section.

### Make a horizontal row of items

Use `<Cluster>`. For a row that should distribute (brand left, nav right):

```astro
<Cluster justify="between" align="baseline">
    <a class="brand">...</a>
    <Cluster as="nav" gap="md">...</Cluster>
</Cluster>
```

### Responsive grid of cards

Use `<Grid>`. The auto-fit math collapses columns on narrow screens; no media query needed.

```astro
<Section size="lg">
    <Container size="page">
        <Grid min="280px" gap="lg">
            {items.map((item) => <Card {...item} />)}
        </Grid>
    </Container>
</Section>
```

### Make content full-bleed (rare)

Most content sits inside Container. For an exception (e.g. a full-width hero image), wrap only that content in a Section without a Container — but the page will lose the standard horizontal padding for that span. Use sparingly; document why if you do.

## Discipline rules

- **Never inline `max-width`, `padding`, `padding-block`, `padding-inline`, `margin`, or `margin-top` in page or component CSS.** All layout comes from primitives.
- **Never write `display: grid` or `display: flex` for layout in component CSS.** Use `<Grid>`, `<Stack>`, or `<Cluster>`.
- **Never add a new `@media` rule without first checking** whether `<Grid>`'s auto-fit or a Container size already solves the problem.
- **Never use raw px values in `@media` rules** if a breakpoint token covers it. The active breakpoint is `--bp-md: 768px`. If you need a different one, add a token first.
- **Component CSS is for typography, color, and component-internal details only** — not for layout.
- **Inside a `<Container>`, content uses an inner primitive** (Stack / Grid / Cluster). Don't nest raw `<div>`s with custom layout.

## Verification — the four-width screenshot loop

**This is mandatory before claiming any layout change is "done".** Use the Claude Preview MCP (`mcp__Claude_Preview__preview_*`).

### The four target widths

| width × height | label | represents |
|---|---|---|
| 375 × 812 | mobile | iPhone 13/14 portrait |
| 768 × 1024 | tablet | iPad portrait |
| 1024 × 768 | laptop | small laptop |
| 1440 × 900 | desktop | typical desktop |

### The loop

1. `preview_start` (idempotent).
2. For the page(s) you changed, at each of the four widths:
   - `preview_resize` to the target width × height.
   - `preview_screenshot`.
3. Inspect each screenshot. Call out anything wrong: horizontal scroll, content too tight to edge, broken grid, header overlap, image overflow, dark-mode regressions.
4. Only after all four widths look correct, claim "done".

### What to check

- **375px**: no horizontal scroll, content has breathing room from edges, grids collapse to 1 column, header fits.
- **768px**: layout transitions cleanly from mobile (page padding goes from 24px → 32px).
- **1024px**: page-width content (880px) is centered with comfortable side margins.
- **1440px**: narrow content (about, intro) doesn't stretch — Container caps it.

### Build + manual paths to test

```bash
npm run build
```

Pages to spot-check: `/`, `/about`, `/projects/<any>`, `/design-system`, and `/<bad-url>` for 404.

## When NOT to use this skill

- **Pure content edits** (changing copy, swapping an image, fixing a typo).
- **Typography-only tweaks** (font-size, color, weight) — those are global.css token changes.
- **Color token changes** — use the `portfolio-colour-token` skill instead.
- **Single-component internal styling** that doesn't affect page layout (e.g. styling a button's hover state).

## Reference files

- `src/components/primitives/PageWrapper.astro`, `Container.astro`, `Section.astro`, `Stack.astro`, `Cluster.astro`, `Grid.astro`
- `src/styles/global.css` — Layout primitives section near the top of the file
- `src/pages/design-system.astro` — visual demos of every primitive at `/design-system`
- `src/pages/index.astro`, `about.astro`, `404.astro`, `src/layouts/ProjectLayout.astro` — reference compositions
