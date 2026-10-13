/**
 * X.KF.W8 R-10 / G11 — the shortcut GROUPING rule, extracted from
 * `KeyboardShortcutsModal.vue` and colocated beside it.
 *
 * WHY IT LEFT THE SFC. The rule is pure data shaping — a list of registered
 * shortcuts in, an insertion-ordered map of group name to its members out — and
 * it was locked inside a `computed` in a dialog that cannot be mounted cheaply
 * (its own component tree pulls the producer's dialog, fading-scroll and
 * keyboard entries). A rule that nothing can call is a rule nothing can cover,
 * and this one carries a real decision: the `"General"` default for a shortcut
 * registered with no `group`, and the fact that group ORDER is first-appearance
 * order in the registry, not alphabetical. Both are now testable at the module.
 *
 * THE SEAM IS THE TREE'S OWN, not a new idiom: `useControlsKeyboardShortcuts.ts`
 * beside `AnimationControlsGroup` is the documented precedent for lifting a
 * keyboard concern out of its SFC into a colocated sibling module.
 *
 * NOT A DUPLICATION. `KeyboardShortcutsModal.vue` imports this and keeps NO
 * inline copy — G11's falsifier fails an extraction that leaves the original
 * computed in place, and fails a cover that tests the module while the SFC never
 * imports it. The template's `v-for="[group, items] in groupedShortcuts"`
 * binding stays exactly where it was and is re-sourced from here.
 *
 * GENERIC OVER THE ITEM, deliberately: the rule reads `options.group` and
 * nothing else, so it neither imports nor re-states the producer's shortcut
 * type. That keeps the module honest about what it actually depends on, and
 * keeps its cover free of the producer's mount realm.
 */

/** The minimum a shortcut must carry for this rule to place it. */
export interface GroupableShortcut {
    options: { group?: string | undefined };
}

/** The group a shortcut registered with no `group` of its own falls into. */
export const DEFAULT_SHORTCUT_GROUP = "General";

/**
 * Partition shortcuts by their declared group, preserving registry order.
 *
 * Group order is FIRST-APPEARANCE order in `shortcuts` (a `Map` iterates in
 * insertion order), and within a group members keep their registry order — the
 * modal renders the register as the register was built, which is what makes the
 * panel's reading order match the order shortcuts were declared in.
 */
export function groupShortcuts<T extends GroupableShortcut>(
    shortcuts: readonly T[],
): Map<string, T[]> {
    const groups = new Map<string, T[]>();

    for (const s of shortcuts) {
        const group = s.options.group ?? DEFAULT_SHORTCUT_GROUP;
        let bucket = groups.get(group);
        if (!bucket) {
            bucket = [];
            groups.set(group, bucket);
        }
        bucket.push(s);
    }

    return groups;
}
