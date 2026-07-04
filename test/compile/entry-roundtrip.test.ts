/**
 * test/compile/entry-roundtrip.test.ts — the S.F3 EN-c BORN-RED oracle (the
 * `proof:entry-roundtrip` skeleton; P2-2's `live.mjs` made a gate). It emits
 * `compileToEntry` output into a real Chromium page and asserts VIA THE BROWSER,
 * SCRUB-BASED + structural — ZERO frame/ms races (C-10; the Linux-runner lesson).
 * The S1–S7 clause map (P2-2):
 *   S1  entry transitions exist with the emitted duration/linear(); scrub-0 ==
 *       the @starting-style endpoint (entry `display` produces NO CSSTransition —
 *       the gate asserts the EXIT hold only).
 *   S2  control: WITHOUT @starting-style → ZERO transitions.
 *   S4  control: WITHOUT allow-discrete → instant vanish (display none immediately).
 *   S3  mid-exit computed `display` HELD `block`; post-finish `none`.
 *   S7  top-layer `overlay` hold (a popover).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): `@starting-style` /
 * `transition-behavior: allow-discrete` / `overlay` / the CSSTransition tree are
 * platform artifacts jsdom does not run — invisible there, a FALSE green (and a
 * correct RED under S.A4's symmetric mis-tier clause). This actuates a real
 * Chromium (playwright-core via glass-ui's install, KF_PLAYWRIGHT_DIR).
 *
 * Skips (does not fail) when playwright-core is not resolvable; the CI-blocking
 * member is `scripts/proof-entry-roundtrip.mjs` (demo-correctness roster).
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { springTimingFunction } from "../../src/animation/physics/spring";
import { compileToEntry } from "../../src/animation/compile/entry";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function resolveChromium(): any {
    for (const pkg of ["playwright-core", "@playwright/test"]) {
        try {
            const requireFrom = createRequire(
                path.join(process.env.KF_PLAYWRIGHT_DIR ?? REPO, "package.json"),
            );
            return requireFrom(pkg).chromium;
        } catch {
            /* try next */
        }
    }
    return null;
}

const chromium = resolveChromium();
const DUR = 350;
const spring = springTimingFunction({ response: 0.4, dampingFraction: 0.7 });

const mkEnter = (): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({ duration: DUR, timingFunction: spring });
    a.fromString(
        `@keyframes en { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0px) } }`,
    );
    return a;
};

const page = (css: string, tag = "div", attrs = ""): string =>
    `<!doctype html><html><head><meta charset="utf-8"><style>
        .toast { width: 40px; height: 40px; background: teal; }
        ${css}
    </style></head><body><${tag} class="toast" ${attrs}></${tag}></body></html>`;

describe.skipIf(!chromium)("S.F3 EN-c — proof:entry-roundtrip browser oracle", () => {
    let browser: any;
    beforeAll(async () => {
        browser = await chromium.launch();
    });
    afterAll(async () => {
        await browser?.close();
    });

    it("S1 — entry transitions run with the emitted duration/linear(); scrub-0 == the @starting-style endpoint (entry display has NO CSSTransition)", async () => {
        const out = await compileToEntry({ ".toast": { enter: mkEnter() } });
        expect(out.eligible).toBe(true);
        expect(out.css).toMatch(/@starting-style/);
        expect(out.css).toMatch(/display 350ms allow-discrete/);

        const p = await browser.newPage();
        try {
            await p.setContent(page(out.css), { waitUntil: "load" });
            const res = await p.evaluate(async () => {
                const el = document.querySelector(".toast")!;
                el.classList.add("open");
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                const anims = document.getAnimations() as any[];
                const byProp: Record<string, { dur: number; easing: string }> = {};
                for (const a of anims) {
                    byProp[a.transitionProperty] = {
                        dur: Number(a.effect.getComputedTiming().duration),
                        easing: String(a.effect.getTiming().easing),
                    };
                }
                anims.forEach((a) => a.pause());
                anims.forEach((a) => {
                    try {
                        a.currentTime = 0;
                    } catch {
                        /* discrete */
                    }
                });
                const cs = getComputedStyle(el);
                return { props: Object.keys(byProp), byProp, opacityAt0: cs.opacity };
            });

            // The entry transitions the visual props with the emitted duration + linear().
            expect(res.props).toContain("opacity");
            expect(res.props).toContain("transform");
            expect(res.byProp["opacity"]!.dur).toBe(DUR);
            expect(res.byProp["transform"]!.dur).toBe(DUR);
            expect(res.byProp["opacity"]!.easing).toMatch(/linear\(/);
            // entry `display` (none→block) flips at start — NO CSSTransition.
            expect(res.props).not.toContain("display");
            // scrub-0 == the @starting-style endpoint (opacity 0).
            expect(res.opacityAt0).toBe("0");
        } finally {
            await p.close();
        }
    });

    it("S2 — control: WITHOUT @starting-style, opening produces ZERO transitions (it is load-bearing)", async () => {
        const out = await compileToEntry({ ".toast": { enter: mkEnter() } });
        const noStartingStyle = out.css.split("@starting-style")[0]!; // strip the block
        const p = await browser.newPage();
        try {
            await p.setContent(page(noStartingStyle), { waitUntil: "load" });
            const res = await p.evaluate(async () => {
                const el = document.querySelector(".toast")!;
                el.classList.add("open");
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                return {
                    count: document.getAnimations().length,
                    opacity: getComputedStyle(el).opacity,
                };
            });
            expect(res.count).toBe(0); // no @starting-style → no entry transition
            expect(res.opacity).toBe("1"); // snaps to the open value
        } finally {
            await p.close();
        }
    });

    it("S4 — control: WITHOUT allow-discrete, closing vanishes instantly (display none immediately)", async () => {
        const out = await compileToEntry({ ".toast": { enter: mkEnter() } });
        // Strip the display/overlay allow-discrete entries from both lists.
        const noDiscrete = out.css.replace(
            /,?\s*(?:display|overlay) \d+ms allow-discrete/g,
            "",
        );
        const p = await browser.newPage();
        try {
            await p.setContent(page(noDiscrete), { waitUntil: "load" });
            const res = await p.evaluate(async () => {
                const el = document.querySelector(".toast")!;
                el.classList.add("open");
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                document.getAnimations().forEach((a) => a.finish()); // settle the entry
                el.classList.remove("open"); // exit
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                return { display: getComputedStyle(el).display };
            });
            // Without `display … allow-discrete` the element is display:none at once.
            expect(res.display).toBe("none");
        } finally {
            await p.close();
        }
    });

    it("S3 — mid-exit computed display HELD 'block'; post-finish 'none' (the allow-discrete exit hold)", async () => {
        const out = await compileToEntry({ ".toast": { enter: mkEnter() } });
        const p = await browser.newPage();
        try {
            await p.setContent(page(out.css), { waitUntil: "load" });
            const res = await p.evaluate(async (dur: number) => {
                const el = document.querySelector(".toast")!;
                el.classList.add("open");
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                document.getAnimations().forEach((a) => a.finish()); // settle the entry
                el.classList.remove("open"); // start the EXIT
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                const exit = document.getAnimations() as any[];
                const props = exit.map((a) => a.transitionProperty);
                exit.forEach((a) => a.pause());
                // Scrub to mid-exit — the display allow-discrete transition HOLDS block.
                exit.forEach((a) => {
                    try {
                        a.currentTime = dur / 2;
                    } catch {
                        /* discrete */
                    }
                });
                const mid = getComputedStyle(el).display;
                exit.forEach((a) => a.finish());
                const end = getComputedStyle(el).display;
                return { props, mid, end };
            }, DUR);
            // The EXIT carries a display transition (unlike entry).
            expect(res.props).toContain("display");
            expect(res.mid).toBe("block"); // HELD through the transition
            expect(res.end).toBe("none"); // flips at transition end
        } finally {
            await p.close();
        }
    });

    it("S7 — a top-layer popover holds `overlay` (and display) through the exit, both none post-finish", async () => {
        const out = await compileToEntry(
            { ".toast": { enter: mkEnter() } },
            { openSelector: ":popover-open" },
        );
        const p = await browser.newPage();
        try {
            await p.setContent(page(out.css, "div", 'popover="auto"'), {
                waitUntil: "load",
            });
            const res = await p.evaluate(async (dur: number) => {
                const el = document.querySelector(".toast") as any;
                el.showPopover(); // entry from @starting-style
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                document.getAnimations().forEach((a) => a.finish());
                el.hidePopover(); // start the EXIT
                await new Promise((r) =>
                    requestAnimationFrame(() => requestAnimationFrame(r)),
                );
                const exit = document.getAnimations() as any[];
                const props = exit.map((a) => a.transitionProperty);
                exit.forEach((a) => a.pause());
                exit.forEach((a) => {
                    try {
                        a.currentTime = dur / 2;
                    } catch {
                        /* discrete */
                    }
                });
                // `overlay` is a newer computed property absent from lib.dom's
                // CSSStyleDeclaration — read it through an index cast.
                const read = (e: Element) => {
                    const cs = getComputedStyle(e) as CSSStyleDeclaration &
                        Record<string, string>;
                    return { display: cs.display, overlay: cs.overlay ?? "" };
                };
                const mid = read(el);
                exit.forEach((a) => a.finish());
                const end = read(el);
                return { props, mid, end };
            }, DUR);
            // The top-layer exit carries BOTH display and overlay transitions.
            expect(res.props).toContain("overlay");
            expect(res.mid.display).toBe("block"); // HELD
            expect(res.mid.overlay).toBe("auto"); // HELD in the top layer
            expect(res.end.display).toBe("none");
            expect(res.end.overlay).toBe("none");
        } finally {
            await p.close();
        }
    });
});
