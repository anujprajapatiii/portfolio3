# Anuj Prajapati Portfolio

Astro portfolio site with content-driven project pages, image optimization, sitemap generation, and a small design-system reference page.

## Project Structure

```text
/
├── public/
│   ├── favicon.svg
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── ThemeToggle.astro
│   │   └── primitives/
│   │       ├── PageHeader.astro
│   │       ├── Section.astro
│   │       └── Stack.astro
│   ├── content/
│   │   └── projects/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── package.json
```

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Installs dependencies |
| `npm run dev` | Starts local dev server |
| `npm run build` | Builds the production site to `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run check` | Runs Astro type/content checks |
