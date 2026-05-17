import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>;

// Single source of truth for project ordering. Was duplicated verbatim in
// index.astro and Footer.astro — change the rule here and both follow.
// Projects without an explicit `order` sort last (stable among themselves).
export function byOrder(a: Project, b: Project): number {
    return (a.data.order ?? 99) - (b.data.order ?? 99);
}

// Surfaces the silent-collision hazard: two projects with the SAME explicit
// `order` sort in an undefined sequence. Prints a build-time warning so the
// misconfiguration is visible instead of mystifying. Unset orders are not
// flagged — sorting last is their intended, documented behavior.
export function warnOnDuplicateOrder(projects: Project[]): void {
    const seen = new Map<number, string[]>();
    for (const p of projects) {
        if (p.data.order === undefined) continue;
        const titles = seen.get(p.data.order) ?? [];
        titles.push(p.data.title);
        seen.set(p.data.order, titles);
    }
    for (const [order, titles] of seen) {
        if (titles.length > 1) {
            console.warn(
                `[projects] Duplicate order ${order} on: ${titles.join(', ')}. ` +
                    `Their relative order is undefined — give each a unique \`order\`.`
            );
        }
    }
}
