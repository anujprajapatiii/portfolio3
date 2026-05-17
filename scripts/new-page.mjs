// Page scaffolder — `npm run new:page <name>`.
// Writes a top-level src/pages/<name>.astro that already composes the
// Layout > Section > Container > Stack primitive skeleton with exactly
// one <h1> (passes check-discipline R1 + R3 by construction) and pulls
// the site name from src/consts.ts (no hardcoded identity). Zero deps.

import { existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv[2];

if (!name) {
    console.error('Usage: npm run new:page <name>');
    console.error('  <name> = lowercase-hyphenated route segment, e.g. services');
    process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
    console.error(`Invalid page name "${name}".`);
    console.error('  Must be lowercase letters/digits, hyphen-separated: ^[a-z0-9]+(-[a-z0-9]+)*$');
    process.exit(1);
}

const file = join('src/pages', `${name}.astro`);
if (existsSync(file)) {
    console.error(`Refusing to overwrite — ${file} already exists.`);
    process.exit(1);
}

const title = name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const page = `---
import Layout from '../layouts/Layout.astro';
import Section from '../components/primitives/Section.astro';
import Container from '../components/primitives/Container.astro';
import Stack from '../components/primitives/Stack.astro';
import { SITE_NAME } from '../consts';
---

<Layout
    title={\`${title} — \${SITE_NAME}\`}
    description="TODO: one-line description for SEO and social cards"
>
    <Section size="lg">
        <Container size="page">
            <Stack gap="lg">
                <h1>${title}</h1>
                <Stack gap="md">
                    <p>TODO: page content. Compose with primitives only — never inline
                    max-width / padding / margin / display:grid|flex (check:discipline R1).
                    Copy a pattern from /reference/sections if useful.</p>
                </Stack>
            </Stack>
        </Container>
    </Section>
</Layout>
`;

writeFileSync(file, page);

console.log(`Created ${file} (route: /${name}, one <h1>, primitive skeleton)\n`);
console.log('Next:');
console.log('  1. Replace the TODOs; compose with primitives (see /reference/sections).');
console.log('  2. If user-facing, add a nav link in src/layouts/Layout.astro (navLinks).');
console.log('  3. Run the four-width screenshot loop (375/768/1024/1440), light + dark —');
console.log('     see the portfolio-layout-primitives skill.');
console.log(
    '  4. Gate: npm run format:check && npm run check && npm run check:tokens && npm run check:discipline && npm run build'
);
console.log('\nNote: generates top-level pages only. For a nested route, move the file');
console.log('and fix the ../ import depth accordingly.');
