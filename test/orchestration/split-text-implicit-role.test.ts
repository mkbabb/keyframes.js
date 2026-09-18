// SERVED MODEL: claude-opus-5[1m]
/**
 * test/orchestration/split-text-implicit-role.test.ts — X.KF.W5 arm B (`.c`),
 * gate **G-ROLE** (row B-1 ≡ KF-AT-8).
 *
 * THE HOLE THIS PINS: `applyA11y` guarded on `hasAttribute("role")` alone and
 * stamped `role="img"` over every IMPLICIT role in the corpus — an `<h1>` left
 * the document's heading hierarchy the moment it was split. The existing
 * coverage (`split-text.test.ts`, "does not clobber an author-supplied role")
 * pins the EXPLICIT case with `setAttribute("role","heading")`, which is the
 * case the implementation already handled; this spec deliberately never writes
 * a `role` attribute on the subject, because writing one IS the hole's blind
 * spot (the gate's own falsifier: "fails if the new spec re-uses the
 * explicit-role fixture").
 *
 * Layout-INDEPENDENT throughout (`by: "word"`), so jsdom's absent layout engine
 * is not in play here — the a11y wiring is the whole subject.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { splitText } from "../../src/animation/orchestration/split-text";

function mount<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    text: string,
): HTMLElementTagNameMap[K] {
    const el = document.createElement(tag);
    el.textContent = text;
    document.body.appendChild(el);
    return el;
}

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("splitText — never overrides an IMPLICIT role (G-ROLE)", () => {
    it("an <h1> with NO explicit role keeps its heading role", () => {
        const el = mount("h1", "Select an animation");
        const s = splitText(el, { by: "word" });

        // The heading survives: no `role` attribute was written, so the
        // implicit `heading` role still computes.
        expect(el.hasAttribute("role")).toBe(false);
        // The accessible name is still consolidated onto the container.
        expect(el.getAttribute("aria-label")).toBe("Select an animation");
        expect(s.fragments.length).toBe(3);
        expect(
            s.fragments.every((f) => f.getAttribute("aria-hidden") === "true"),
        ).toBe(true);
    });

    it("every heading level keeps its role", () => {
        for (const tag of ["h2", "h3", "h4", "h5", "h6"] as const) {
            const el = mount(tag, "heading text");
            splitText(el, { by: "word" });
            expect(el.hasAttribute("role")).toBe(false);
        }
    });

    it("a <button> and an <a href> keep their implicit roles", () => {
        const button = mount("button", "Copy CSS");
        splitText(button, { by: "word" });
        expect(button.hasAttribute("role")).toBe(false);

        const link = mount("a", "Read the docs");
        link.setAttribute("href", "#docs");
        splitText(link, { by: "word" });
        expect(link.hasAttribute("role")).toBe(false);
    });

    it("an <a> WITHOUT href is roleless — the naming role is still applied", () => {
        // `<a>` maps to `generic` without `href`, so a bare `aria-label` would
        // not compute: this is exactly the case the fallback role exists for.
        const el = mount("a", "not a link");
        splitText(el, { by: "word" });
        expect(el.getAttribute("role")).toBe("img");
    });

    it("a plain <div> still gets the naming role (the fallback is not lost)", () => {
        const el = mount("div", "Select an animation");
        splitText(el, { by: "word" });
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Select an animation");
    });

    it("a <p> still gets the naming role (paragraph prohibits a name)", () => {
        const el = mount("p", "Select an animation");
        splitText(el, { by: "word" });
        expect(el.getAttribute("role")).toBe("img");
    });

    it("`role: null` opts out of the role write entirely", () => {
        const el = mount("div", "Select an animation");
        const s = splitText(el, { by: "word", role: null });
        expect(el.hasAttribute("role")).toBe(false);
        // The name is still consolidated — the caller owns the role, not the name.
        expect(el.getAttribute("aria-label")).toBe("Select an animation");

        s.revert();
        expect(el.hasAttribute("role")).toBe(false);
    });

    it("revert() removes the role only when the split wrote it", () => {
        const heading = mount("h1", "Heading text");
        const hs = splitText(heading, { by: "word" });
        hs.revert();
        expect(heading.hasAttribute("role")).toBe(false);
        expect(heading.textContent).toBe("Heading text");

        const div = mount("div", "Div text");
        const ds = splitText(div, { by: "word" });
        expect(div.getAttribute("role")).toBe("img");
        ds.revert();
        expect(div.hasAttribute("role")).toBe(false);
    });
});
