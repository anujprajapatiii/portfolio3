---
name: portfolio-colour-token
description: Add or modify color tokens in this portfolio's two-tier design token system. Use when the user asks to add a primitive color, add a semantic token, change a theme mapping, swap which primitive a semantic token references, or audit the color system. Maintains the discipline that semantic tokens reference primitives via var() (never raw hex), updates both light defaults in :root and dark theme overrides, and keeps the design-system page in sync.
---

# Portfolio Colour Token

A skill for managing the portfolio's color token system in a disciplined way.

## The two-tier system

This portfolio uses a **two-tier color token architecture** in `src/styles/global.css`:

**Tier 1 — Primitives** (theme-agnostic raw palette)
```css
--neutral-100, --neutral-200, ..., --neutral-900, --neutral-black, --neutral-white
--blue-100, ..., --blue-600
--yellow-100, ..., --yellow-600
--red-100, ..., --red-400
--green-100, ..., --green-400
--amber-100, ..., --amber-400
--terra
```

Primitives have **one value, period**. They do not change between themes. They live in `:root` only.

**Tier 2 — Semantic** (meaningful names that reference primitives)
```css
--color-text, --color-muted, --color-bg, --color-border, --color-surface, --color-code-bg
```

Semantic tokens **must reference a primitive via `var(--primitive-name)`**, never a raw hex value. They are defined in `:root` (light defaults) and re-mapped in `[data-theme="dark"]`.

## Files this skill touches

- **`src/styles/global.css`** — where all tokens live. The token block at the top has two sections: PRIMITIVES and SEMANTIC TOKENS.
- **`src/pages/design-system.astro`** — visual catalog of tokens. Has two arrays in the frontmatter:
  - `primitiveFamilies` — one entry per color family (Neutral, Blue, etc.) with all swatches inline
  - `colorTokens` — one entry per semantic token, mapping light/dark primitive references

When you add or change a token, **update both the CSS file and the design-system catalog** so the catalog stays accurate.

## Recipes

### Add a new primitive color

1. In `:root` of `global.css`, find the appropriate family section (or add a new one) and insert the new variable. Keep the scale consistent within the family (lower number = lighter for blue/yellow/neutrals; lower number = lightest for red/green/amber per the project's existing convention).
2. In `design-system.astro`, find `primitiveFamilies` and add the new swatch to the appropriate family's `swatches` array. Maintain the same order as the CSS.
3. Run `npm run build` to verify nothing breaks.

Example — adding `--purple-300`:

```css
/* In :root */
/* Purple (100 = lightest, 600 = darkest) */
--purple-100: #f4f0ff;
--purple-200: #e3d8ff;
--purple-300: #b89dff;
/* etc. */
```

```ts
// In design-system.astro primitiveFamilies array
{
    name: 'Purple',
    swatches: [
        { name: '100', value: '#f4f0ff' },
        { name: '200', value: '#e3d8ff' },
        { name: '300', value: '#b89dff' },
    ],
},
```

### Add a new semantic token

A semantic token names a *role* in the design (e.g., "link color," "success state," "page heading color") and maps that role to a primitive. Adding one means deciding which primitive to use in light mode AND which to use in dark mode.

Process:

1. Pick the role's intent (link, success, warning, error, accent, etc.).
2. Pick the family (blue for links, green for success, yellow for warning, red for error).
3. Pick a primitive in that family for **light mode** — usually a saturated mid-tone with enough contrast against `--neutral-100` (the page bg).
4. Pick a primitive for **dark mode** — usually a lighter tint of the same family with enough contrast against `--neutral-800`. Rule of thumb: if light mode uses 400/500 (saturated), dark mode often uses 200/300 (tinted).
5. Add to `:root` (referencing the light primitive) AND to `[data-theme="dark"]` (referencing the dark primitive).
6. Add an entry to `colorTokens` in `design-system.astro` so it appears in the catalog.
7. Use the new semantic token in CSS rules, never the primitive directly (unless the rule is intentionally theme-agnostic).

Example — adding `--color-link`:

```css
/* In :root */
--color-link: var(--blue-400);

/* In [data-theme="dark"] */
--color-link: var(--blue-300);
```

```ts
// In design-system.astro colorTokens array
{ name: '--color-link', light: 'blue-400', dark: 'blue-300', use: 'inline links in body text' },
```

Then update CSS rules that style links:
```css
.project-body a { color: var(--color-link); }
```

### Change which primitive a semantic token references

This is a *remapping*, not a hex value change. Always update both the CSS and the design-system catalog so they don't drift.

Example — making `--color-muted` darker in light mode (was `neutral-400`, becomes `neutral-500`):

```css
/* In :root */
--color-muted: var(--neutral-500);  /* was --neutral-400 */
```

```ts
// In design-system.astro colorTokens, update the matching row
{ name: '--color-muted', light: 'neutral-500', dark: 'neutral-300', use: 'secondary text' },
```

### Add a new theme

The theme mechanism is `[data-theme="<name>"]` blocks that re-map semantic tokens. To add, say, an `editorial` theme:

1. Add a new `[data-theme="editorial"]` block in `global.css` after the existing `[data-theme="dark"]` block. Override only the semantic tokens that should differ — primitives stay the same.
2. Add the theme name to whatever switching UI exists (currently `src/components/ThemeToggle.astro` cycles between light and dark).
3. Update `colorTokens` in `design-system.astro` to add an "editorial" column if you want the catalog to show all three theme mappings.

## Discipline / validation rules

When making token changes, enforce these:

- **Semantic tokens MUST use `var(--primitive-name)`**, never a raw hex string. If you find yourself writing `--color-foo: #abcdef`, stop and add a primitive first.
- **Primitives MUST NOT use `var()`**. They are the foundation; they have literal hex values.
- **Primitives appear only in `:root`**, never in `[data-theme="dark"]` (or other theme overrides). Themes only re-map semantic tokens.
- **CSS rules outside the `:root` block should reference semantic tokens**, not primitives. Direct primitive references in component CSS are a smell; they tie the component to a specific palette choice instead of a role.
- **The design-system page must stay in sync with `global.css`.** When you add or rename a token in CSS, update the corresponding array entry in `design-system.astro`.

## Verification

After any token change:

```bash
npm run build
```

A clean build means no broken `var()` references. Then visit `/design-system` in the browser to verify the catalog renders correctly in both light and dark mode.

## When NOT to invoke this skill

This skill is for color tokens specifically. Don't use it for:

- **Type, spacing, or width tokens** — those follow a different scale convention. Edit them directly in `global.css`.
- **One-off color choices** in a single component file — if a color is genuinely component-local and never reused, it's fine to inline. (Though usually the right move is still a token.)
- **Setting a literal background or border in a story/demo file** — those are presentational fixtures, not part of the system.
