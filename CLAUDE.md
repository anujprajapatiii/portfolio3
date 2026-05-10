# Portfolio — project brief

A personal portfolio site for a designer based in Mumbai. Built with Astro 6, deployed on Vercel, content authored in Markdown.

This file exists so a future AI thread (or a future me) can get up to speed in 30 seconds. Read this before reading any other file.

---

## Tech stack

- **Astro 6.1+** — static site generator. Pages live in `src/pages/` and the file path becomes the URL.
- **Content Layer API** — modern content collection system (Astro 5+). Schema lives in `src/content.config.ts`. **Not** the older `src/content/config.ts` shape — ignore tutorials that show that.
- **`astro:assets` + `<Image />`** — automatic image optimization. Source images live inside `src/`, never in `public/` (anything in `public/` is served raw, unoptimized).
- **Plain CSS with design tokens** — see `src/styles/global.css`. No Tailwind, no preprocessor. All sizing, spacing, color goes through CSS custom properties at the top of the file.
- **`@astrojs/sitemap`** — generates `sitemap-index.xml` at build time.
- **TypeScript via `@astrojs/check`** — used for `npm run check`, not for writing typed components.
- **GitHub Desktop → GitHub → Vercel** — push to `main` and Vercel auto-deploys in ~30s.

---

## File map

| Path                                     | Purpose                                                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/index.astro`                  | Homepage — lists all projects from the collection                                                                           |
| `src/pages/about.astro`                  | About page                                                                                                                  |
| `src/pages/projects/[slug].astro`        | Dynamic route — generates one page per Markdown project                                                                     |
| `src/pages/404.astro`                    | Custom 404                                                                                                                  |
| `src/pages/design-system/index.astro`    | Internal reference page — visual catalog of every token. Not in nav; visit at `/design-system`                              |
| `src/pages/design-system/sections.astro` | Copy-and-paste catalog of section patterns. Visit at `/design-system/sections`                                              |
| `src/layouts/Layout.astro`               | Site frame: `<head>` (favicon, meta, OG, Twitter), header, footer, skip-link, nav with `aria-current`                       |
| `src/layouts/ProjectLayout.astro`        | Wraps `Layout` with the project cover + title + description block                                                           |
| `src/content.config.ts`                  | Defines the `projects` collection schema (Zod)                                                                              |
| `src/content/projects/<slug>/index.md`   | One folder = one case study                                                                                                 |
| `src/content/projects/<slug>/cover.png`  | Cover image, sits next to its `index.md`                                                                                    |
| `src/content/projects/<slug>/*.png`      | Inline images for that case study                                                                                           |
| `src/components/Footer.astro`            | Site footer — three columns of links, projects column auto-pulled from collection                                           |
| `src/components/ThemeToggle.astro`       | Sun/moon button in the header that flips light/dark                                                                         |
| `src/components/primitives/`             | Layout primitives — `PageWrapper`, `Section`, `Container`, `Stack`, `Cluster`, `Grid`                                       |
| `src/styles/global.css`                  | All styling. Design tokens at the top, semantic classes below                                                               |
| `astro.config.mjs`                       | Site URL + sitemap integration                                                                                              |
| `public/`                                | Static files served as-is — favicons (`favicon.svg`, `favicon.ico`) and the TASA Orbiter font (`fonts/`). No source images. |

---

## How-to recipes

### Add a new project

Each project lives in its own folder. The folder name becomes the URL slug.

1. Create `src/content/projects/<slug>/`.
2. Drop a cover image inside as `cover.png` (or `.jpg`).
3. Create `src/content/projects/<slug>/index.md`:

    ```md
    ---
    title: Project Name
    description: One-line summary shown on cards and project page
    cover: ./cover.png
    date: 2026-05-03
    order: 4
    ---

    ## Section heading

    Body content as plain Markdown.
    ```

4. Save. Dev server hot-reloads. The project appears on the homepage at `order` position and at the URL `/projects/<slug>`.

The slug-stripping logic (`generateId` in `content.config.ts`) is what turns `<slug>/index.md` into the URL `/projects/<slug>` rather than `/projects/<slug>/index`.

### Add a new page

Create `src/pages/<name>.astro`. Compose with the layout primitives — every page follows the same `Section > Container > Stack | Grid | Cluster` shape (PageWrapper sits in `Layout.astro` already, around `<main>`).

```astro
---
import Layout from '../layouts/Layout.astro';
import Section from '../components/primitives/Section.astro';
import Container from '../components/primitives/Container.astro';
import Stack from '../components/primitives/Stack.astro';
---

<Layout title="<Name> — Anuj Prajapati" description="...">
    <Section size="lg">
        <Container size="page">
            <Stack gap="lg">
                <h1>Page heading</h1>
                <Stack gap="md">
                    <p>Body paragraph.</p>
                </Stack>
            </Stack>
        </Container>
    </Section>
</Layout>
```

If the page needs typography or color rules beyond tokens, add a class to the outer wrapper (e.g. `<article class="<name>">`) and put scoped typography rules in `global.css`. **Don't** put `max-width`, `padding-block`, or `margin` in component CSS — layout always comes from primitives. See `/design-system/sections` for ready-to-paste section patterns and the `portfolio-layout-primitives` skill for the full discipline.

### Swap a cover image

Replace `src/content/projects/<slug>/cover.png` with the new file at the same name. No other changes needed.

### Add inline images inside a case study

Drop the image into the project's folder next to `index.md`. Reference it with standard Markdown syntax and a relative path:

```md
![Alt text describing the image](./architecture.png)
```

The leading `./` is required — it tells Astro to optimize the image. Filenames can be short (e.g. `architecture.png`, `team-colors.png`) since they're already scoped to the project's folder.

For a caption, drop in a raw HTML `<figure>` (Markdown supports inline HTML, separate it with blank lines above and below):

```md
<figure>
  <img src="./team-colors.png" alt="...">
  <figcaption>Caption text.</figcaption>
</figure>
```

Styling for both forms lives under `.project-body img` and `.project-body figure` in `global.css`.

### Add a nav link

Edit the `navLinks` array in `src/layouts/Layout.astro`. Active-link styling comes for free via `aria-current="page"`.

### Compose a page with primitives

Six layout components live in `src/components/primitives/`. Every page composes them in this exact order:

```
PageWrapper (in Layout.astro — wraps <main>, <header>, <footer>)
└─ Section size="sm|md|lg|xl"     ← vertical chunk, owns padding-block
   └─ Container size="page|reading|narrow"    ← max-width + center
      └─ Stack | Grid | Cluster   ← gap-based layout
         └─ content
```

Quick reference:

- **`<Section size>`** — `sm` (32px), `md` (48px, default), `lg` (80px), `xl` (120px). Owns vertical padding.
- **`<Container size>`** — `page` (880px, default), `reading` (680px), `narrow` (600px). Owns horizontal max-width.
- **`<Stack gap>`** — vertical flex. `sm` (8px), `md` (16px, default), `lg` (32px).
- **`<Cluster gap align justify as>`** — horizontal flex with wrap. For nav, tag rows.
- **`<Grid min gap>`** — responsive auto-fit grid. `min` is `220px | 280px | 360px`. No media query needed.
- **`<PageWrapper>`** — horizontal page padding. Already in `Layout.astro`; pages don't add it.

Pattern:

```astro
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

<Section size="lg">
    <Container size="page">
        <Grid min="280px" gap="lg">
            {items.map((item) => <Card {...item} />)}
        </Grid>
    </Container>
</Section>
```

**Discipline:** never inline `max-width`, `padding-block`, `padding-inline`, `margin`, or `margin-top` in page or component CSS. All layout comes from primitives. See the `portfolio-layout-primitives` skill for the full rules and the four-width screenshot verification workflow.

### Change the global look

Open `src/styles/global.css`, edit the tokens in `:root` at the top. Don't change values inside the rules — change the token they reference.

### Use an icon

Icons come from **Lucide** via the official `@lucide/astro` package. Each icon is a named import that renders as an inline SVG at build time.

```astro
---
import { ArrowRight, ExternalLink } from '@lucide/astro';
---

<ArrowRight aria-hidden="true" />
<ExternalLink class="some-class" size={20} />
```

- Browse icons at <https://lucide.dev>. Convert the kebab-case slug (`arrow-right`) to PascalCase (`ArrowRight`) for the import name.
- No client JS, no icon font, no extra request — each icon is just an inline `<svg>` in the HTML.
- Default props: `size={24}`, `color="currentColor"`, `stroke-width={2}`. Override per icon via props (`size={20}`, `stroke-width={1.5}`) or via CSS through the `class` prop.
- Use `currentColor` (the default) so icons inherit text color and respect theme switches automatically.
- For decorative icons, set `aria-hidden="true"`. For meaningful icons standing on their own (e.g. icon-only button), put `aria-label` on the parent element instead.

---

## Conventions

- **Theming** uses a `data-theme` attribute on `<html>`. Default is light (defined in `:root` in `global.css`). Dark overrides only the color tokens via `[data-theme="dark"]`. To add a new theme (e.g. editorial, high-contrast), add another `[data-theme="<name>"]` block alongside the dark one and override whichever tokens differ. Theme is set by an inline script in `Layout.astro` <head> that runs before paint to prevent a flash; it reads `localStorage.theme`, falls back to `prefers-color-scheme`, defaults to light. The `<ThemeToggle />` component in the header writes to `localStorage` on click.
- **Fonts** live in `public/fonts/`. Active font: TASA Orbiter (variable, 100–900 weight axis). Loaded via `@font-face` in `global.css` and preloaded via a `<link rel="preload">` in `Layout.astro`. To swap fonts, replace the file in `public/fonts/`, update both the `@font-face` `src` and the preload `href`, and update `--font-family` in tokens.
- **Image rule:** if it gets rendered into a page, it lives in `src/` and goes through `<Image />`. If it's a favicon or robots.txt, it lives in `public/`.
- **One `<h1>` per page.** The header brand is `<a class="brand">`, not an `<h1>`.
- **Class names are semantic** (`.brand`, `.project-card`, `.about`), never visual (`.red`, `.big`).
- **Spacing/font sizes/colors come from tokens.** No raw px values in the rules. If a needed value isn't in the token scale, extend the scale — don't hard-code.
- **OG images** are auto-generated for project pages via `getImage()` in `ProjectLayout.astro` (1200×630 webp).
- **Above-the-fold images** use `loading="eager"`. The first homepage card and project covers are eager; everything else lazy.
- **Code style is owned by Prettier.** Run `npm run format` before committing. Config lives in `.prettierrc.json`; CI runs `format:check` so PRs with style drift fail. Don't argue with the formatter — change the config if needed.

---

## Deploy

`git push` to `main` (use GitHub Desktop). Vercel auto-builds and ships. Live URL: `https://portfolio3-mocha-ten.vercel.app`. The `site` field in `astro.config.mjs` must match the production URL — if a custom domain gets added later, update it there or canonical/OG URLs will be wrong.

---

## Things not to do

- Don't use uppercase or mixed-case in filenames. Always lowercase, hyphen-separated (`hawaii.png`, not `Hawaii.png` or `Hawaii_island.png`). macOS is case-insensitive so a wrong-case rename works locally but breaks on Vercel's Linux build with "file not found." Same rule for image references in markdown.
- Don't put rendered images in `public/`. They won't be optimized.
- Don't use `src/content/config.ts` syntax (that's the old config). The schema lives in `src/content.config.ts` and uses the `glob()` loader from `astro/loaders`.
- Don't add raw px values inside CSS rules. Extend the token scale instead.
- Don't add a media-query breakpoint unless something genuinely breaks at that width. The defined scale is `--bp-sm` 480px, `--bp-md` 768px (the primary mobile/desktop split), `--bp-lg` 1024px, `--bp-xl` 1280px — pick from this scale, don't invent new numbers.
- Don't put `display: grid` or `display: flex` for layout in component CSS. Use `<Grid>`, `<Stack>`, or `<Cluster>` primitives.
- Don't inline `max-width` / `padding-block` / `padding-inline` / `margin-top` in page or component CSS. Layout comes from primitives.
- Don't restart the dev server on every change — only after editing `astro.config.mjs` or `src/content.config.ts`. Everything else hot-reloads.
- Don't commit `.claude/worktrees/` or `.claude/settings.local.json` (gitignored). `.claude/skills/` and `.claude/launch.json` ARE tracked on purpose so the layout/colour skills and the Claude Preview MCP launch config travel with the repo.

---

## Verification

After making changes:

```bash
npm run dev      # iterate locally at localhost:4321
npm run check    # type-check the project (catches schema/prop mismatches)
npm run build    # full production build, surfaces any image or content error
```

A clean build means it'll deploy cleanly on Vercel.
