// SERVED MODEL: claude-opus-5[1m]
/**
 * test/orchestration/split-text-refuse.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-REFUSE** (row B-2 ≡ KF-AT-9).
 *
 * THE DEFECT THIS PINS: `buildLines` called `el.replaceChildren(...)` BEFORE the
 * measurability check threw, and the throw propagated before the result object
 * holding `revert` existed — so a refused `by:"line"` split left the container
 * permanently rewritten with no way back. The contract is measure-OR-refuse; a
 * refusal must therefore be decided while the caller's DOM is still untouched.
 *
 * THE ORACLE IS DOM EQUALITY AGAINST A PRE-CALL SNAPSHOT, not the throw: the
 * throw was never in doubt. And the cure may not be "restore in a catch" — a
 * revert-on-throw still desynchronizes a framework-rendered container, so these
 * assertions are written over markup a framework would own (nested elements,
 * comment nodes, attributes) and over the LIVE NODE IDENTITIES, which a
 * re-parse of `innerHTML` would silently replace.
 *
 * jsdom has no layout engine — `getBoundingClientRect` is all zeros — so every
 * line-split here refuses, which is exactly the unmeasurable-container case.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
    SplitTextRefusalError,
    splitText,
} from "../../src/animation/orchestration/split-text";

function mount(html: string): HTMLElement {
    const el = document.createElement("div");
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("splitText — a refused line-split leaves the DOM untouched (G-REFUSE)", () => {
    it("innerHTML equals the pre-call snapshot after the refusal", () => {
        const el = mount("a line <b>that cannot</b> be measured in jsdom");
        const before = el.innerHTML;

        expect(() => splitText(el, { by: "line" })).toThrow(
            SplitTextRefusalError,
        );

        expect(el.innerHTML).toBe(before);
    });

    it("the ORIGINAL child nodes are still the container's children", () => {
        // Node identity, not markup equality: a restore-by-catch that re-parsed
        // `innerHTML` would produce equal bytes and DIFFERENT nodes, which is
        // precisely the desynchronization a framework-rendered container suffers.
        const el = mount("word <b>bold</b> tail");
        const nodesBefore = [...el.childNodes];

        expect(() => splitText(el, { by: "line" })).toThrow(
            SplitTextRefusalError,
        );

        const nodesAfter = [...el.childNodes];
        expect(nodesAfter.length).toBe(nodesBefore.length);
        nodesAfter.forEach((node, i) => expect(node).toBe(nodesBefore[i]));
    });

    it("no fragment class and no a11y attribute is written on the way out", () => {
        const el = mount("a line that cannot be measured");
        expect(() => splitText(el, { by: "line" })).toThrow(
            SplitTextRefusalError,
        );
        expect(el.querySelector(".kf-split")).toBeNull();
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.hasAttribute("role")).toBe(false);
    });

    it("the refusal is the typed error with the `unmeasurable` reason", () => {
        const el = mount("a line that cannot be measured");
        try {
            splitText(el, { by: "line" });
            throw new Error("expected a refusal");
        } catch (err) {
            expect(err).toBeInstanceOf(SplitTextRefusalError);
            expect((err as SplitTextRefusalError).reason).toBe("unmeasurable");
        }
    });

    it("an EMPTY-text line-split also refuses without touching the DOM", () => {
        const el = mount("   ");
        const before = el.innerHTML;
        try {
            splitText(el, { by: "line" });
            throw new Error("expected a refusal");
        } catch (err) {
            expect((err as SplitTextRefusalError).reason).toBe("empty");
        }
        expect(el.innerHTML).toBe(before);
    });

    it("a DETACHED container refuses without touching the DOM", () => {
        const el = document.createElement("div");
        el.textContent = "never connected";
        const before = el.innerHTML;
        expect(() => splitText(el, { by: "line" })).toThrow(
            SplitTextRefusalError,
        );
        expect(el.innerHTML).toBe(before);
    });

    it("the layout-INDEPENDENT splits still mutate (the refusal is scoped)", () => {
        const el = mount("word split still works");
        const s = splitText(el, { by: "word" });
        expect(s.fragments.length).toBe(4);
        expect(el.querySelectorAll(".kf-split").length).toBe(4);
    });
});
