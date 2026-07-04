/**
 * test/en-fix-oracle.test.ts — the S.B3 EN-a/EN-b BORN-RED oracle (the wave's
 * gate skeleton; en-fix-proto.md §3). Adapted from P2-2's `live.mjs`: it emits
 * `compileToCSS` output into a real Chromium page (playwright-core via glass-ui's
 * install — the charter's `createRequire` recipe) and asserts VIA THE BROWSER,
 * which the kf parser structurally CANNOT substitute for.
 *
 * WHY BROWSER-HARNESS (load-bearing): jsdom's `getComputedStyle` does NOT drop an
 * invalid `animation` shorthand, so the EN-a bug (a browser-invalid `ease-out-cubic`
 * token voiding the whole declaration → `animation-name: none`) is INVISIBLE in
 * jsdom — precisely why P2-2 F6 evaded every existing jsdom round-trip gate. The
 * fast jsdom STRING halves live in `test/compile-roundtrip.test.ts`; these are the
 * BROWSER halves.
 *
 * Skips (does not fail) when playwright-core is not resolvable, so the default
 * `vitest run` stays green in a browserless env; the CI-blocking browser-harness
 * member is `scripts/proof-compile-browser-parse.mjs` (wired into the
 * demo-correctness roster), which runs under KF_PLAYWRIGHT_DIR.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation/engine";
import { AnimationGroup } from "../src/animation/group";
import { compileToCSS } from "../src/animation/compile";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Resolve playwright-core's chromium via glass-ui's install (KF_PLAYWRIGHT_DIR). */
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

const mkAnim = (
    name: string,
    css: string,
    opts: Record<string, unknown> = {},
): CSSKeyframesAnimation<any> => {
    const el = document.createElement("div");
    const a = new CSSKeyframesAnimation({ duration: 250, ...opts }, el);
    a.name = name;
    a.fromString(css);
    return a;
};

/** Wrap a compiled artifact in a minimal page + a mounted target element. */
const pageHTML = (css: string, className: string): string =>
    `<!doctype html><html><head><meta charset="utf-8"><style>
        .stage { position: fixed; inset: 0; }
        .${className} { width: 40px; height: 40px; background: #888; }
        ${css}
    </style></head><body><div class="stage"><div class="${className}"></div></div></body></html>`;

describe.skipIf(!chromium)("S.B3 EN-a/EN-b — browser-parse oracle", () => {
    let browser: any;

    beforeAll(async () => {
        browser = await chromium.launch();
    });
    afterAll(async () => {
        await browser?.close();
    });

    it("EN-a: an emitted easeOutCubic artifact computes animation-name !== none (browser-VALID)", async () => {
        const a = mkAnim(
            "a0",
            `@keyframes a0 { 0% { opacity: 0 } 100% { opacity: 1 } }`,
            { duration: 250, timingFunction: "easeOutCubic" },
        );
        const out = await compileToCSS(new AnimationGroup({ animation: a }));
        expect(out.eligible).toBe(true);

        // String clause (the PRE-fix RED signature): no browser-dead registry token.
        expect(out.css).not.toMatch(/animation:[^;{]*\bease-out-cubic\b/);

        const page = await browser.newPage();
        try {
            await page.setContent(pageHTML(out.css, "a0"), {
                waitUntil: "load",
            });
            const computed = await page.$eval(".a0", (el: Element) => {
                const cs = getComputedStyle(el);
                return {
                    animationName: cs.animationName,
                    animationTimingFunction: cs.animationTimingFunction,
                };
            });
            // The whole point: a browser-INVALID easing voids the shorthand →
            // `animation-name: none`. The `linear()` twin keeps it VALID.
            expect(computed.animationName).not.toBe("none");
            expect(computed.animationName).toBe("a0");
            expect(computed.animationTimingFunction).toMatch(/linear\(/);
        } finally {
            await page.close();
        }
    });

    it("EN-b: a mixed opacity+transform+color track ANIMATES all three (browser scrub)", async () => {
        const b = mkAnim(
            "a1",
            `@keyframes a1 {
                0% { background-color: crimson; opacity: 0; transform: translateY(20px) }
                100% { background-color: gold; opacity: 1; transform: translateY(0px) }
            }`,
            { duration: 400, timingFunction: "linear" },
        );
        // densifyStops: 24 so the arc SHIPS under ΔE-ε (isolating the prop-drop
        // from a densify refusal); `linear` easing isolates EN-b from EN-a.
        const out = await compileToCSS(new AnimationGroup({ animation: b }), {
            densifyStops: 24,
        });
        expect(out.eligible).toBe(true);

        const page = await browser.newPage();
        try {
            await page.setContent(pageHTML(out.css, "a1"), {
                waitUntil: "load",
            });
            const sample = await page.$eval(".a1", (el: Element) => {
                const anim = (el as any).getAnimations()[0];
                anim.pause();
                const read = (t: number) => {
                    anim.currentTime = t;
                    const cs = getComputedStyle(el);
                    return {
                        opacity: cs.opacity,
                        transform: cs.transform,
                        backgroundColor: cs.backgroundColor,
                    };
                };
                return { start: read(0), end: read(400) };
            });
            // PRE-fix: opacity/transform were DROPPED (color-only artifact) — the
            // element would show opacity:1 / transform:none at t=0. Post-fix they
            // animate: opacity 0→1, transform present at the start.
            expect(sample.start.opacity).toBe("0");
            expect(sample.start.transform).not.toBe("none");
            expect(sample.end.opacity).toBe("1");
            // The color still densifies across the track (the CC-2 arc).
            expect(sample.start.backgroundColor).not.toBe(
                sample.end.backgroundColor,
            );
        } finally {
            await page.close();
        }
    });
});
