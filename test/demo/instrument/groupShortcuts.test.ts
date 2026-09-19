/**
 * X.KF.W8 G11 — the demo-lane cover for the extracted shortcut grouping rule.
 *
 * WHAT IT COVERS AND WHY IT IS WORTH COVERING. `groupShortcuts()` carries two
 * decisions the keyboard panel's whole reading order rests on, neither of which
 * was reachable while the rule sat inside a `computed` in a dialog nothing can
 * mount cheaply:
 *
 *   1. a shortcut registered with NO `group` falls into `"General"` — the
 *      default, not an "ungrouped" bucket and not a dropped row; and
 *   2. group order is FIRST-APPEARANCE order in the registry, never
 *      alphabetical, and within a group members keep registry order.
 *
 * Both are invisible to a type checker and both are the kind of thing a later
 * refactor "tidies" into sorted order without noticing the panel now disagrees
 * with the order shortcuts were declared in.
 *
 * BITE: swap the `Map` for a plain object and clause (3) reds (integer-like keys
 * would reorder, and insertion order stops being the contract). Change the
 * fallback from `"General"` to `""` and clause (1) reds. Sort the group keys on
 * the way out and clause (3) reds. Push into a shared array instead of a
 * per-group one and clause (4) reds.
 *
 * This spec drives the REAL module — no mock, no stub, no re-statement of the
 * rule inside the test (which would assert the test against itself).
 */
import { describe, expect, it } from "vitest";
import {
    DEFAULT_SHORTCUT_GROUP,
    groupShortcuts,
    type GroupableShortcut,
} from "@components/instrument/shell/groupShortcuts";

/** A registry entry, carrying an `id` so members are distinguishable. */
interface Entry extends GroupableShortcut {
    id: string;
}

const entry = (id: string, group?: string): Entry => ({
    id,
    options: group === undefined ? {} : { group },
});

describe("groupShortcuts — R-10's extracted rule", () => {
    it("(1) a shortcut with no group falls into the declared default", () => {
        const grouped = groupShortcuts([entry("a")]);

        expect([...grouped.keys()]).toEqual([DEFAULT_SHORTCUT_GROUP]);
        expect(DEFAULT_SHORTCUT_GROUP).toBe("General");
        expect(grouped.get(DEFAULT_SHORTCUT_GROUP)!.map((s) => s.id)).toEqual(["a"]);
    });

    it("(2) a declared group is honoured verbatim and never folded into the default", () => {
        const grouped = groupShortcuts([entry("a", "Playback"), entry("b")]);

        expect(grouped.get("Playback")!.map((s) => s.id)).toEqual(["a"]);
        expect(grouped.get(DEFAULT_SHORTCUT_GROUP)!.map((s) => s.id)).toEqual(["b"]);
    });

    it("(3) group order is FIRST APPEARANCE in the registry, not alphabetical", () => {
        // Deliberately reverse-alphabetical on first appearance: a sort anywhere
        // in the rule inverts this.
        const grouped = groupShortcuts([
            entry("a", "Zoom"),
            entry("b", "Playback"),
            entry("c", "Editing"),
            entry("d", "Zoom"),
        ]);

        expect([...grouped.keys()]).toEqual(["Zoom", "Playback", "Editing"]);
    });

    it("(4) members keep registry order inside their own group, and no member is lost", () => {
        const input = [
            entry("a", "Zoom"),
            entry("b", "Playback"),
            entry("c", "Zoom"),
            entry("d"),
            entry("e", "Playback"),
            entry("f", "Zoom"),
        ];

        const grouped = groupShortcuts(input);

        expect(grouped.get("Zoom")!.map((s) => s.id)).toEqual(["a", "c", "f"]);
        expect(grouped.get("Playback")!.map((s) => s.id)).toEqual(["b", "e"]);
        expect(grouped.get(DEFAULT_SHORTCUT_GROUP)!.map((s) => s.id)).toEqual(["d"]);

        // Total: every input lands in exactly one bucket.
        const placed = [...grouped.values()].flat();
        expect(placed).toHaveLength(input.length);
        expect(new Set(placed.map((s) => s.id)).size).toBe(input.length);
    });

    it("(5) an empty register yields an empty map, not a default group with nothing in it", () => {
        const grouped = groupShortcuts([]);

        expect(grouped.size).toBe(0);
        expect(grouped.has(DEFAULT_SHORTCUT_GROUP)).toBe(false);
    });
});
