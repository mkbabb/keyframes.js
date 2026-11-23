/**
 * The die's arrival and its spin, frame by frame (owner, FORTY-SIXTH E:
 * "Animation init and spinning is janky").
 *
 * An init script logs, from document start, one row per animation frame: the
 * rAF time and the inline transforms of the stage (`.graph`, the parked
 * attitude) and of the spin element (`.cube`). A row is read at the top of a
 * frame, so it holds what the previous frame painted.
 *
 *   6. The die is parked from its first frame: no identity frame, no sweep.
 *   8. The spin turns one way (his answer pending; the design's recommendation):
 *      over 12 s the Y speed never changes sign.
 *
 * Cells: a desk (1440x900, 1x CPU) and a phone (390x844, touch, 4x CPU).
 *
 * Local: serves dist/gh-pages (build it first: npm run gh-pages).
 * KF_GESTURE_BASE=https://keyframes.babb.dev runs it against a deploy.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDist } from "../../scripts/lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DIST = path.join(REPO, "dist", "gh-pages");
const REMOTE = process.env.KF_GESTURE_BASE?.replace(/\/$/, "");

let server = null;
let base = REMOTE ?? "";

test.beforeAll(async () => {
    if (REMOTE) return;
    if (!fs.existsSync(path.join(DIST, "index.html"))) {
        throw new Error("dist/gh-pages is absent: run `npm run gh-pages` first");
    }
    server = await serveDist(DIST);
    base = server.url;
});

test.afterAll(async () => {
    await server?.close();
});

const root = () => (REMOTE ? `${base}/` : `${base}/index.html`);
const at = (hash) => `${root()}#${hash}`;

/** The in-page per-frame log, from document start. */
const LOG = () => {
    const L = (window.__kf = { frames: [], loaf: [], marks: [] });
    const q = (s) => document.querySelector(s);
    const loop = (t) => {
        L.frames.push({
            t,
            graph: q(".cube-stage .graph")?.style.transform ?? null,
            spin: q(".cube-stage .cube")?.style.transform ?? null,
            vt: document.documentElement.matches(":active-view-transition") ? 1 : 0,
        });
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    try {
        new PerformanceObserver((list) => {
            for (const e of list.getEntries())
                L.loaf.push({ s: e.startTime, d: e.duration, scripts: e.scripts.map((x) => ({ type: x.invokerType, src: x.sourceURL, d: x.duration })) });
        }).observe({ type: "long-animation-frame", buffered: true });
    } catch {}
    try {
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) L.marks.push({ n: e.name, s: e.startTime, d: e.duration });
        }).observe({ entryTypes: ["mark", "measure"] });
    } catch {}
};

const CELLS = {
    desk: { use: { viewport: { width: 1440, height: 900 } }, cpu: 1 },
    phone: { use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, cpu: 4 },
};

const PARKED = "rotate3d(-1, 1, 0, 30deg)";

/** The spin's Y angle (turns) of a logged frame, or NaN. */
const yTurns = (spin) => Number(/rotateY\(([-\d.e]+)turn\)/.exec(spin ?? "")?.[1] ?? NaN);
/** The per-frame Y steps (turns), unwrapped across a loop's seam. */
const ySteps = (frames) => {
    const out = [];
    for (let i = 1; i < frames.length; i++) {
        const a = yTurns(frames[i - 1].spin);
        const b = yTurns(frames[i].spin);
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        const d = b - a;
        out.push({ t: frames[i].t, dt: frames[i].t - frames[i - 1].t, d: d - Math.round(d) });
    }
    return out;
};

for (const [cell, { use, cpu }] of Object.entries(CELLS)) {
    test.describe(`${cell} (${cpu}x CPU)`, () => {
        test.use(use);

        test.beforeEach(async ({ context, page }) => {
            await context.addInitScript(LOG);
            if (cpu > 1) {
                const cdp = await context.newCDPSession(page);
                await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
            }
        });

        test("6. the die is parked from its first frame on a cold load", async ({ page }) => {
            for (const route of ["/", "/cube"]) {
                await page.goto("about:blank");
                await page.goto(at(route));
                await page.waitForFunction(() => window.__kf.frames.filter((f) => f.graph !== null).length > 90, null, { timeout: 30_000 });
                const frames = await page.evaluate(() => window.__kf.frames.filter((f) => f.graph !== null));
                expect(frames.length).toBeGreaterThan(0);
                // Every frame the stage exists in, it is at its attitude: never
                // the identity, never part-way along a sweep.
                const off = frames.filter((f) => f.graph !== PARKED).map((f) => `${Math.round(f.t)} ms: "${f.graph}"`);
                expect(off, `${route}: frames off the parked attitude`).toEqual([]);
            }
        });

        test("8. the spin turns one way: over 12 s its Y speed never changes sign", async ({ page }) => {
            test.setTimeout(90_000);
            await page.goto(at("/cube"));
            await page.waitForFunction(() => window.__kf.frames.filter((f) => f.spin).length > 30, null, { timeout: 30_000 });
            const t0 = await page.evaluate(() => performance.now());
            await page.waitForFunction((from) => performance.now() - from > 12_000, t0, { timeout: 40_000, polling: 500 });
            const frames = await page.evaluate((from) => window.__kf.frames.filter((f) => f.t >= from && f.spin), t0);
            const steps = ySteps(frames);
            expect(steps.length).toBeGreaterThan(100);
            const forward = steps.filter((s) => s.d > 1e-6).length;
            const back = steps.filter((s) => s.d < -1e-6).length;
            expect(Math.min(forward, back), `forward ${forward}, back ${back}`).toBe(0);
        });
    });
}
