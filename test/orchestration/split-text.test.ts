/**
 * test/split-text.test.ts — the jsdom half of the S.F2 SplitText coverage: the
 * layout-INDEPENDENT contract (word/grapheme cohort, the ready stagger, the a11y
 * attribute wiring, revert) + the `by:"line"` MEASURE-OR-REFUSE posture. jsdom
 * has no layout engine — `getClientRects` returns no box — so a line-split MUST
 * refuse (`SplitTextRefusalError`), which is exactly the "never emit a stale line
 * map on an unmeasurable container" contract, testable without a browser. The
 * COMPUTED accessible-name equality (a browser artifact) is the separate
 * `test/split-a11y-oracle.test.ts` browser gate.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
    SplitTextRefusalError,
    splitText,
} from "../../src/animation/orchestration/split-text";

function mount(text: string): HTMLElement {
    const el = document.createElement("div");
    el.textContent = text;
    document.body.appendChild(el);
    return el;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("splitText — word/grapheme cohort", () => {
    it("splits into a per-word fragment cohort, preserving inter-word spaces", () => {
        const el = mount("Select an animation");
        const s = splitText(el, { by: "word" });
        expect(s.fragments.length).toBe(3);
        expect(s.fragments.map((f) => f.textContent)).toEqual([
            "Select",
            "an",
            "animation",
        ]);
        // The whitespace survives as live text nodes (wrappable run).
        expect(el.textContent).toBe("Select an animation");
        // Fragments are inline-block so a transform applies.
        expect(s.fragments[0]!.style.display).toBe("inline-block");
    });

    it("splits graphemes correctly (emoji ZWJ stays whole, not shredded)", () => {
        const el = mount("a👍b");
        const s = splitText(el, { by: "grapheme" });
        // 3 graphemes: 'a', '👍', 'b' — NOT 4 UTF-16 code units.
        expect(s.fragments.map((f) => f.textContent)).toEqual(["a", "👍", "b"]);
    });

    it("hands back a READY stagger over the cohort", () => {
        const el = mount("one two three four");
        const s = splitText(el, { by: "word", stagger: { each: 50 } });
        expect(typeof s.stagger).toBe("function");
        expect(s.delays).toEqual([0, 50, 100, 150]);
        expect(s.stagger(2)).toBe(100);
    });
});

describe("splitText — a11y-first wiring (attribute half)", () => {
    it("consolidates the accessible name onto the container + hides fragments", () => {
        const el = mount("Select an animation");
        const s = splitText(el, { by: "word" });
        expect(el.getAttribute("aria-label")).toBe("Select an animation");
        // A plain <div> is role=generic (name-prohibited) — default to a naming role.
        expect(el.getAttribute("role")).toBe("img");
        expect(
            s.fragments.every((f) => f.getAttribute("aria-hidden") === "true"),
        ).toBe(true);
    });

    it("does not clobber an author-supplied role", () => {
        const el = mount("Heading text");
        el.setAttribute("role", "heading");
        splitText(el, { by: "word" });
        expect(el.getAttribute("role")).toBe("heading");
    });

    it("a11y:false leaves the fragments in the tree (no aria wiring)", () => {
        const el = mount("Select an animation");
        const s = splitText(el, { by: "word", a11y: false });
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(s.fragments.some((f) => f.hasAttribute("aria-hidden"))).toBe(false);
    });

    it("revert() restores the original markup + strips the authored a11y attrs", () => {
        const el = mount("Select an animation");
        const role = el.getAttribute("role");
        const s = splitText(el, { by: "word" });
        s.revert();
        expect(el.textContent).toBe("Select an animation");
        expect(el.querySelector(".kf-split")).toBeNull();
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.getAttribute("role")).toBe(role); // authored none → removed
    });
});

describe("splitText — by:'line' measure-or-refuse (SF-10)", () => {
    it("REFUSES a typed error on an unmeasurable container (no layout)", () => {
        const el = mount("a line that cannot be measured in jsdom");
        // jsdom has no layout → getClientRects is empty → the line-split must
        // refuse rather than emit a stale/collapsed line map.
        expect(() => splitText(el, { by: "line" })).toThrow(SplitTextRefusalError);
        try {
            splitText(el, { by: "line" });
        } catch (err) {
            expect(err).toBeInstanceOf(SplitTextRefusalError);
            expect((err as SplitTextRefusalError).reason).toBe("unmeasurable");
        }
    });

    it("REFUSES an empty-text line-split", () => {
        const el = mount("   ");
        try {
            splitText(el, { by: "line" });
            throw new Error("expected a refusal");
        } catch (err) {
            expect(err).toBeInstanceOf(SplitTextRefusalError);
            expect((err as SplitTextRefusalError).reason).toBe("empty");
        }
    });

    it("word/grapheme splits NEVER refuse (layout-independent)", () => {
        const el = mount("no layout needed here");
        expect(() => splitText(el, { by: "word" })).not.toThrow();
        const el2 = mount("abc");
        expect(() => splitText(el2, { by: "grapheme" })).not.toThrow();
    });
});
