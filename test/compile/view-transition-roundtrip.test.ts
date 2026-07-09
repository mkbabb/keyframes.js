/**
 * test/compile/view-transition-roundtrip.test.ts — the S.F1 VT-c BORN-RED oracle
 * (the `proof:vt-roundtrip` skeleton; p09's Playwright script made a gate). It
 * emits `compileToViewTransition` output into a real Chromium page, drives a
 * native `document.startViewTransition`, and asserts VIA THE BROWSER's
 * `getAnimations()` — STRUCTURAL, device-INDEPENDENT (names/durations/`linear()`
 * on the pseudos via `effect.pseudoElement`; the group pseudo carries the emitted
 * duration), plus ONE settled-state rect-tolerance clause. NO per-frame pixel/ms
 * threshold (the Linux-runner lesson; C-10 governs the plan).
 *
 * WHY BROWSER-HARNESS, NOT jsdom (load-bearing): jsdom has no View Transitions —
 * no `::view-transition-*` pseudo tree, no `getAnimations()` over it — so "the
 * group pseudo carries the emitted 350ms" is INVISIBLE there. A jsdom slot would
 * be a FALSE green (and would correctly RED under S.A4's symmetric mis-tier
 * clause). This actuates a real Chromium (playwright-core via glass-ui's install,
 * KF_PLAYWRIGHT_DIR).
 *
 * Skips (does not fail) when playwright-core is not resolvable, so a browserless
 * `vitest run` stays green; the CI-blocking member is
 * `scripts/proof-vt-roundtrip.mjs` (wired into the demo-correctness roster), which
 * runs under KF_PLAYWRIGHT_DIR.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../../src/animation/engine";
import { springTimingFunction } from "../../src/animation/physics/spring";
import { compileToViewTransition } from "../../src/animation/compile/view-transition";

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

const EMIT_DURATION = 350;

const spring = springTimingFunction({ response: 0.4, dampingFraction: 0.7 });
const mk = (css: string): CSSKeyframesAnimation<any> => {
    const a = new CSSKeyframesAnimation({
        duration: EMIT_DURATION,
        timingFunction: spring,
    });
    a.fromString(css);
    return a;
};

/** Wrap the emitted VT CSS in a page with a named, movable transition subject. */
const pageHTML = (vtCss: string): string =>
    `<!doctype html><html><head><meta charset="utf-8"><style>
        html, body { margin: 0; }
        #box {
            view-transition-name: scene;
            position: absolute; left: 20px; top: 20px;
            width: 60px; height: 60px; background: teal;
        }
        #box.moved { left: 220px; }
        ${vtCss}
    </style></head><body><div id="box"></div></body></html>`;

describe.skipIf(!chromium)("S.F1 VT-c — proof:vt-roundtrip browser oracle", () => {
    let browser: any;
    beforeAll(async () => {
        browser = await chromium.launch();
    });
    afterAll(async () => {
        await browser?.close();
    });

    it("the emitted names/durations/linear() drive the old/new pseudos AND the group carries the emitted duration", async () => {
        const oldA = mk(
            `@keyframes ex { 0% { opacity: 1; transform: scale(1) } 100% { opacity: 0; transform: scale(0.9) } }`,
        );
        const newA = mk(
            `@keyframes en { 0% { opacity: 0; transform: scale(1.05) } 100% { opacity: 1; transform: scale(1) } }`,
        );
        const out = await compileToViewTransition(
            { scene: { old: oldA, new: newA } },
            { types: ["forward"] },
        );
        expect(out.eligible).toBe(true);
        expect(out.names).toEqual(["scene"]);
        // The group rule is TIMING-ONLY — never `animation-name` on the group.
        expect(out.css).toMatch(
            /::view-transition-group\(scene\)\s*\{[^}]*animation-duration/,
        );
        expect(out.css).not.toMatch(
            /::view-transition-group\(scene\)\s*\{[^}]*animation-name/,
        );

        const page = await browser.newPage();
        try {
            await page.setContent(pageHTML(out.css), { waitUntil: "load" });
            const result = await page.evaluate(async (dur: number) => {
                const box = document.getElementById("box")!;
                const before = box.getBoundingClientRect();
                const doc = document as unknown as {
                    startViewTransition: (arg: {
                        update: () => void;
                        types: string[];
                    }) => {
                        ready: Promise<void>;
                        finished: Promise<void>;
                    };
                };
                const vt = doc.startViewTransition({
                    update: () => box.classList.add("moved"),
                    types: ["forward"],
                });
                await vt.ready;
                const byPseudo: Record<
                    string,
                    { duration: number; easing: string; name: string }
                > = {};
                for (const a of document.getAnimations() as any[]) {
                    const effect = a.effect;
                    const pe = effect?.pseudoElement;
                    if (!pe) continue;
                    // The `linear()` spring rides the per-keyframe easing (the
                    // effect-level `getTiming().easing` is the default "linear");
                    // the computed animation-timing-function surfaces on the
                    // keyframes for both a `@keyframes` animation (old/new) and the
                    // UA rect-morph the group timing-only override retimes.
                    const kfEasing = (effect.getKeyframes() as any[])
                        .map((k) => String(k.easing ?? ""))
                        .join(" | ");
                    byPseudo[pe] = {
                        duration: Number(effect.getComputedTiming().duration),
                        easing: kfEasing,
                        name: String(a.animationName ?? ""),
                    };
                }
                await vt.finished;
                const after = box.getBoundingClientRect();
                return { before, after, byPseudo, dur };
            }, EMIT_DURATION);

            const oldP = result.byPseudo["::view-transition-old(scene)"];
            const newP = result.byPseudo["::view-transition-new(scene)"];
            const groupP = result.byPseudo["::view-transition-group(scene)"];

            // STRUCTURAL — the emitted old/new pseudos run the emitted @keyframes
            // (names), duration, and spring linear() (device-independent identity).
            expect(oldP, "no ::view-transition-old(scene) animation").toBeTruthy();
            expect(newP, "no ::view-transition-new(scene) animation").toBeTruthy();
            expect(oldP!.name).toBe("scene-old");
            expect(newP!.name).toBe("scene-new");
            expect(oldP!.duration).toBe(EMIT_DURATION);
            expect(newP!.duration).toBe(EMIT_DURATION);
            expect(oldP!.easing).toMatch(/linear\(/);
            expect(newP!.easing).toMatch(/linear\(/);

            // THE KEYSTONE — the MANDATORY group pseudo carries the EMITTED duration
            // (falsifiability: omitting the group emission ships the UA 250ms/ease
            // temporal-incoherence signature p09 observed).
            expect(groupP, "no ::view-transition-group(scene) animation").toBeTruthy();
            expect(groupP!.duration).toBe(EMIT_DURATION);
            expect(groupP!.easing).toMatch(/linear\(/);

            // ONE settled-state rect-tolerance clause (the flipShared visual-
            // equivalence letter — the endpoint the compiled group morph AND a
            // flipShared fallback both reach). The subject committed its +200px move.
            const dx = result.after.left - result.before.left;
            expect(Math.abs(dx - 200)).toBeLessThanOrEqual(2);
        } finally {
            await page.close();
        }
    });
});
