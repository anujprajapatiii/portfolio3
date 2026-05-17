// Drift checker: fails if the literal token values in src/reference-tokens.ts
// (rendered on the /reference page) diverge from src/styles/global.css.
//
// Standalone on purpose — run via `npm run check:tokens`, NOT wired into
// `npm run build`, so a false positive can never break a deploy. Add it to
// CI next to `format:check` if you want it enforced on PRs.
//
// Scope (deliberately conservative to avoid false positives):
//   • direct value tokens — font / leading / tracking / space / width /
//     breakpoint: every `{ name: '--x', value: 'y' }` must equal the
//     matching `--x: y;` in global.css `:root`.
//   • primitive colours: the SET of hex values must match between the
//     reference module and global.css `:root`.
//   • semantic color tokens (var() indirection) are intentionally NOT
//     checked — too indirect to verify without brittle resolution logic.

import { readFileSync } from 'node:fs';

const CSS_PATH = 'src/styles/global.css';
const TOKENS_PATH = 'src/reference-tokens.ts';

const css = readFileSync(CSS_PATH, 'utf8');
const tokens = readFileSync(TOKENS_PATH, 'utf8');

// --- Extract the :root {...} block (the light-theme token source). --------
const rootStart = css.indexOf(':root {');
const rootEnd = css.indexOf('\n}', rootStart);
if (rootStart === -1 || rootEnd === -1) {
    console.error(`check-tokens: could not locate the :root block in ${CSS_PATH}`);
    process.exit(1);
}
const rootBlock = css.slice(rootStart, rootEnd);

// name -> value, e.g. "--font-base" -> "18px", "--color-text" -> "var(--neutral-600)"
const cssVars = new Map();
for (const m of rootBlock.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    cssVars.set(m[1], m[2].trim());
}

// Hex values defined on any --token in :root.
const cssHexes = new Set();
for (const [, value] of cssVars) {
    const hex = value.match(/^#[0-9a-fA-F]{3,8}$/);
    if (hex) cssHexes.add(value.toLowerCase());
}

// --- Extract from the reference token module. -----------------------------
// Direct value tokens: `{ name: '--x', value: 'y'` (use: ... may follow).
const refDirect = [];
for (const m of tokens.matchAll(/name:\s*'(--[\w-]+)',\s*value:\s*'([^']*)'/g)) {
    refDirect.push({ name: m[1], value: m[2].trim() });
}

// Every hex literal in the module (the primitive palette swatches).
const refHexes = new Set();
for (const m of tokens.matchAll(/'(#[0-9a-fA-F]{3,8})'/g)) {
    refHexes.add(m[1].toLowerCase());
}

// --- Compare. -------------------------------------------------------------
const problems = [];

for (const { name, value } of refDirect) {
    if (!cssVars.has(name)) {
        problems.push(`Missing in global.css :root — reference has ${name}: ${value}`);
    } else if (cssVars.get(name) !== value) {
        problems.push(
            `Value drift on ${name} — reference '${value}' vs global.css '${cssVars.get(name)}'`
        );
    }
}

for (const hex of refHexes) {
    if (!cssHexes.has(hex)) {
        problems.push(`Primitive ${hex} is in reference-tokens.ts but no :root token uses it`);
    }
}
for (const hex of cssHexes) {
    if (!refHexes.has(hex)) {
        problems.push(`:root defines ${hex} but it is missing from reference-tokens.ts`);
    }
}

if (problems.length > 0) {
    console.error(`check-tokens: ${problems.length} drift issue(s) between`);
    console.error(`  ${TOKENS_PATH}  and  ${CSS_PATH}\n`);
    for (const p of problems) console.error(`  • ${p}`);
    console.error('\nUpdate both so they agree, then re-run `npm run check:tokens`.');
    process.exit(1);
}

console.log(
    `check-tokens: OK — ${refDirect.length} value tokens and ${refHexes.size} primitive ` +
        `colours match between ${TOKENS_PATH} and ${CSS_PATH}.`
);
