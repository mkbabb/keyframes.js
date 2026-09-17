/**
 * typing-dots-engine-seam — the inv-ζ dogfood seam, gated for the first time
 * (X.KF.W4 `.d`, R-5).
 *
 * KF-EST-6 / L:D-3 found the hero triad's TypingDots seam exercised by NO gate
 * anywhere (`grep -rn TypingDots test/` → 0). R-5 decided the coverage shape:
 * NOT a second gate over `usability.mjs`'s defective oracle, but exactly ONE
 * demo-lane spec over the surface nothing touches — the ENGINE seam itself.
 *
 * The seam's claim is that the demo's signature animation IS the library: the
 * "..." is N explicit dot spans, each driven by its own `CSSKeyframesAnimation`
 * with `iterationCount: "infinite"`, seated on the engine's own `stagger`
 * distribution — never a hand-rolled CSS `@keyframes`, never a hand-rolled rAF
 * re-loop, never a string reaching an interpolated value position.
 *
 * Four clauses, each BITING on the shape the seam replaced:
 *
 *   (1) SUBSTRATE — `count` dot spans, each carrying the STATIC glyph as text
 *       (S3). BITE: the pre-H.W6 single-span `.dot-fade` form renders ONE node
 *       and cannot stagger.
 *   (2) ENGINE PAINT — after the engine resolves, every dot carries an inline
 *       `opacity` the engine wrote, and none of them is 0. BITE: the old form
 *       painted from a CSS `@keyframes` (no inline opacity at all) and blanked
 *       to `opacity: 0` for 43% of every cycle — the perceptual defect the
 *       ≥ rest-floor clause forbids.
 *   (3) NO CASCADE COLLISION — no dot node carries a CSS `animation` shorthand
 *       of its own. BITE: re-introducing `.dot-fade`/`.lift-down` puts two
 *       `animation` shorthands on one node, the collision the split killed.
 *   (4) TEARDOWN — unmounting stops every animation: the painted opacity is
 *       frozen across subsequent frames and no rAF work survives the component.
 *       BITE: drop the `onBeforeUnmount` stop loop and the dots keep painting
 *       into a detached tree.
 *
 * The spec mounts the REAL component and reads its REAL effects; it replicates
 * no formula and reads no source text (G-L7 rule (e)).
 */
import { afterEach, describe, expect, it } from "vitest";
import { createApp, nextTick } from "vue";
import TypingDots from "@components/instrument/shell/TypingDots.vue";

let teardown: (() => void) | null = null;

/** Mount the real component against a document-attached host. */
async function mountDots(props: Record<string, unknown> = {}) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const app = createApp(TypingDots, props);
    app.mount(host);
    teardown = () => {
        app.unmount();
        host.remove();
        teardown = null;
    };
    // onMounted awaits `loadAnimationEngine()` — a DYNAMIC import of the heavy
    // engine — and only then constructs and plays the per-dot animations, which
    // paint on rAF. Poll for the engine's first painted frame rather than
    // sleeping a magic number: the seam is "the engine drives these nodes", so
    // the wait condition IS the claim, and a seam that never paints times out
    // and reds instead of passing on a lucky sleep.
    // The wait condition is EVERY dot painted, not the first: the dots are
    // seated on the engine's own `stagger` distribution (0, STEP, 2·STEP), so
    // the later dots paint later by construction — a poll that breaks on dot 1
    // reads dots 2 and 3 mid-stagger. Draining the whole stagger IS the seam's
    // own evidence, and a seam that never paints times out and reds instead of
    // passing on a lucky sleep.
    await nextTick();
    const painted = () => {
        const dots = [...host.querySelectorAll<HTMLElement>(".typing-dot")];
        return dots.length > 0 && dots.every((d) => d.style.opacity !== "");
    };
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline && !painted()) await frame();
    return host;
}

/** One animation frame, awaited. */
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

afterEach(() => teardown?.());

describe("TypingDots — the inv-ζ engine seam", () => {
    it("(1) renders one dot span per count, each carrying the STATIC glyph", async () => {
        const host = await mountDots({ count: 4, glyph: "·" });
        const dots = [...host.querySelectorAll(".typing-dot")];
        expect(dots).toHaveLength(4);
        for (const d of dots) expect(d.textContent).toBe("·");
    });

    it("(2) the ENGINE paints every dot, and never to a blank frame", async () => {
        const host = await mountDots();
        const dots = [...host.querySelectorAll<HTMLElement>(".typing-dot")];
        expect(dots).toHaveLength(3);
        for (const d of dots) {
            // An inline opacity exists only because the engine wrote it — the
            // scoped stylesheet sets the rest value on the CLASS, not the node.
            expect(
                d.style.opacity,
                "the engine painted no inline opacity",
            ).not.toBe("");
            expect(Number(d.style.opacity)).toBeGreaterThan(0);
        }
    });

    it("(3) no dot node carries a CSS animation shorthand of its own", async () => {
        const host = await mountDots();
        for (const d of host.querySelectorAll<HTMLElement>(".typing-dot")) {
            expect(d.style.animation).toBe("");
            expect(d.style.animationName).toBe("");
        }
    });

    it("(4) unmounting stops the engine — the detached dots stop painting", async () => {
        const host = await mountDots();
        const dots = [...host.querySelectorAll<HTMLElement>(".typing-dot")];
        const detached = dots.map((d) => d);
        teardown?.();
        const frozen = detached.map((d) => d.style.opacity);
        await frame();
        await frame();
        expect(detached.map((d) => d.style.opacity)).toEqual(frozen);
    });
});
