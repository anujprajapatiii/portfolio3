# Portfolio

Personal portfolio for a designer based in Mumbai. Astro 6, deployed on Vercel.

**The operating manual is [`CLAUDE.md`](./CLAUDE.md) — start there.** It opens with
a "You're back after a break — do exactly this" section: followable checklists for
the recurring actions (add a project, add a page, change colours, change layout),
the verification gate, and pointers to the design-token and layout-primitive rules
in [`.claude/skills/`](./.claude/skills/).

Do **not** follow generic Astro tutorials for this repo — it uses the Content
Layer API (`src/content.config.ts`) and a custom two-tier design-token + layout-
primitive system. Tutorial patterns (e.g. `src/content/config.ts`, inline layout
CSS, raw hex) will fail the CI gates.

```bash
npm run dev    # local dev at localhost:4321
npm run build  # production build
# Full gate (also enforced in CI on every PR):
npm run format:check && npm run check && npm run check:tokens && npm run check:discipline && npm run build
```
