// SERVED MODEL: claude-opus-5[1m]
/**
 * test/orchestration/split-text-revert.test.ts — X.KF.W5 arm B (`.c`), gate
 * **G-REVERT** (row B-3 ≡ KF-AT-23).
 *
 * THE DEFECT THIS PINS: `revert()` deleted the container's `aria-label`
 * UNCONDITIONALLY — while the role removal on the very next line WAS guarded —
 * so a split/revert round trip silently stripped an author's own accessible
 * name, contradicting the method's own documented contract ("restore the
 * container's original markup + a11y attributes"). The old revert spec covered
 * the authored-NONE case only, which is the one case the bug gets right.
 *
 * The snapshot `revert` restores from is `innerHTML`, which carries NO container
 * attributes, so each attribute this split overwrites must be captured
 * explicitly — and ONLY those: a blanket "restore every attribute" would be a
 * different (and wrong) cure, so the last case here fixes an attribute the
 * split never touches and asserts it is left alone.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { splitText } from "../../src/animation/orchestration/split-text";

function mount(text: string): HTMLElement {
    const el = document.createElement("div");
    el.textContent = text;
    document.body.appendChild(el);
    return el;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("splitText — revert() preserves an AUTHORED aria-label (G-REVERT)", () => {
    it("an authored aria-label survives the split/revert round trip", () => {
        const el = mount("Select an animation");
        el.setAttribute("aria-label", "Animation picker");

        const s = splitText(el, { by: "word" });
        // During the split the container carries the consolidated name.
        expect(el.getAttribute("aria-label")).toBe("Select an animation");

        s.revert();
        expect(el.getAttribute("aria-label")).toBe("Animation picker");
        expect(el.textContent).toBe("Select an animation");
        expect(el.querySelector(".kf-split")).toBeNull();
    });

    it("an authored EMPTY aria-label survives (the falsy-value case)", () => {
        const el = mount("Select an animation");
        el.setAttribute("aria-label", "");
        const s = splitText(el, { by: "word" });
        s.revert();
        expect(el.hasAttribute("aria-label")).toBe(true);
        expect(el.getAttribute("aria-label")).toBe("");
    });

    it("authored NONE is still removed (the case the old spec covered)", () => {
        const el = mount("Select an animation");
        const s = splitText(el, { by: "word" });
        s.revert();
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("an authored role survives beside an authored label", () => {
        const el = mount("Heading text");
        el.setAttribute("role", "heading");
        el.setAttribute("aria-label", "Section title");

        const s = splitText(el, { by: "word" });
        s.revert();

        expect(el.getAttribute("role")).toBe("heading");
        expect(el.getAttribute("aria-label")).toBe("Section title");
    });

    it("a11y:false never writes and never removes the author's label", () => {
        const el = mount("Select an animation");
        el.setAttribute("aria-label", "Animation picker");

        const s = splitText(el, { by: "word", a11y: false });
        expect(el.getAttribute("aria-label")).toBe("Animation picker");

        s.revert();
        expect(el.getAttribute("aria-label")).toBe("Animation picker");
    });

    it("attributes the split never touches are NOT restored (no blanket revert)", () => {
        const el = mount("Select an animation");
        el.setAttribute("data-state", "before");

        const s = splitText(el, { by: "word" });
        el.setAttribute("data-state", "after");
        s.revert();

        // A blanket attribute snapshot would have rolled this back to "before".
        expect(el.getAttribute("data-state")).toBe("after");
    });
});
