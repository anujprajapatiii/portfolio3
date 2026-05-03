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

| Path | Purpose |
|---|---|
| `src/pages/index.astro` | Homepage — lists all projects from the collection |
| `src/pages/about.astro` | About page |
| `src/pages/projects/[slug].astro` | Dynamic route — generates one page per Markdown project |
| `src/pages/404.astro` | Custom 404 |
| `src/layouts/Layout.astro` | Site frame: `<head>` (favicon, meta, OG, Twitter), header, footer, skip-link, nav with `aria-current` |
| `src/layouts/ProjectLayout.astro` | Wraps `Layout` with the project cover + title + description block |
| `src/content.config.ts` | Defines the `projects` collection schema (Zod) |
| `src/content/projects/<slug>/index.md` | One folder = one case study |
| `src/content/projects/<slug>/cover.png` | Cover image, sits next to its `index.md` |
| `src/content/projects/<slug>/*.png` | Inline images for that case study |
| `src/styles/global.css` | All styling. Design tokens at the top, semantic classes below |
| `astro.config.mjs` | Site URL + sitemap integration |
| `public/` | Static files served as-is — favicons only, no source images |

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

Create `src/pages/<name>.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="<Name> — Your Name" description="...">
    <section class="<name>">
        <!-- content -->
    </section>
</Layout>
```

Add a corresponding rule block in `global.css` referencing tokens.

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

### Change the global look

Open `src/styles/global.css`, edit the tokens in `:root` at the top. Don't change values inside the rules — change the token they reference.

---

## Conventions

- **Image rule:** if it gets rendered into a page, it lives in `src/` and goes through `<Image />`. If it's a favicon or robots.txt, it lives in `public/`.
- **One `<h1>` per page.** The header brand is `<a class="brand">`, not an `<h1>`.
- **Class names are semantic** (`.brand`, `.project-card`, `.about`), never visual (`.red`, `.big`).
- **Spacing/font sizes/colors come from tokens.** No raw px values in the rules. If a needed value isn't in the token scale, extend the scale — don't hard-code.
- **OG images** are auto-generated for project pages via `getImage()` in `ProjectLayout.astro` (1200×630 webp).
- **Above-the-fold images** use `loading="eager"`. The first homepage card and project covers are eager; everything else lazy.

---

## Deploy

`git push` to `main` (use GitHub Desktop). Vercel auto-builds and ships. Live URL: `https://portfolio3-mocha-ten.vercel.app`. The `site` field in `astro.config.mjs` must match the production URL — if a custom domain gets added later, update it there or canonical/OG URLs will be wrong.

---

## Things not to do

- Don't put rendered images in `public/`. They won't be optimized.
- Don't use `src/content/config.ts` syntax (that's the old config). The schema lives in `src/content.config.ts` and uses the `glob()` loader from `astro/loaders`.
- Don't add raw px values inside CSS rules. Extend the token scale instead.
- Don't add a media-query breakpoint unless something genuinely breaks at that width. One breakpoint at `640px` is intentional.
- Don't restart the dev server on every change — only after editing `astro.config.mjs` or `src/content.config.ts`. Everything else hot-reloads.
- Don't commit `.claude/` (already gitignored).

---

## Verification

After making changes:

```bash
npm run dev      # iterate locally at localhost:4321
npm run check    # type-check the project (catches schema/prop mismatches)
npm run build    # full production build, surfaces any image or content error
```

A clean build means it'll deploy cleanly on Vercel.
