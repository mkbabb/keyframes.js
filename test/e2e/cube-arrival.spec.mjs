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
    });
}
