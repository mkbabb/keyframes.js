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
 *   7. Every start of the spin is eased, and starts as the swap lands (Home
 *      then Play; Easing then back to the cube): the speed gathers over the
 *      250 ms ramp from the swap's end (never a jump from still to full
 *      speed, never a start held past the landing), and once at speed it
 *      neither holds nor jumps back.
 *   8. The spin turns one way (his answer pending; the design's recommendation):
 *      over 12 s the Y speed never changes sign.
 *   9. No other scene's chunk is evaluated while the cube spins: the idle warm
 *      fetches the chunks (they arrive) and evaluates none of them.
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

        /** The spin's start after the last swap: its Y angle (turns, unwrapped)
         *  against the frame clock, from 200 ms before the swap's end. */
        const startAfterSwap = async (page) => {
            await page.waitForFunction(() => window.__kf.marks.some((m) => m.n === "scene-swap:total"), null, { timeout: 30_000 });
            const t0 = await page.evaluate(() => performance.now());
            await page.waitForFunction((from) => performance.now() - from > 2800, t0, { timeout: 30_000, polling: 250 });
            const { frames, end } = await page.evaluate(() => {
                const total = window.__kf.marks.filter((m) => m.n === "scene-swap:total").at(-1);
                return { end: total.s + total.d, frames: window.__kf.frames.filter((f) => f.spin) };
            });
            const rows = frames.filter((f) => f.t >= end - 200);
            const steps = ySteps(rows);
            let y = 0;
            const track = [{ t: rows[0].t, y: 0 }, ...steps.map((st) => ({ t: st.t, y: (y += st.d) }))];
            return { end, track };
        };

        /** y at time t (linear between rows; held past either end). */
        const yAt = (track, t) => {
            const i = track.findIndex((p) => p.t >= t);
            if (i < 0) return track.at(-1).y;
            if (i === 0) return track[0].y;
            const a = track[i - 1];
            const b = track[i];
            return a.y + ((b.y - a.y) * (t - a.t)) / (b.t - a.t);
        };

        /**
         * The start's shape, read as the die's travel against the swap's end
         * (travel over a span is robust to which frame a value lands in; a
         * per-frame speed is not, the painted value trailing its tick by a
         * frame or not):
         *   - full speed v: the mean over 2 s, once well past the ramp;
         *   - eased: over the first 125 ms it covers well under what full
         *     speed covers (a 250 ms smoothstep: 0.19; a cut to full speed: 1);
         *   - prompt: by 300 ms it has covered a fifth of full speed's travel
         *     (the ramp: 0.58; a start held 200 ms past the landing: 0.04);
         *   - steady after the ramp: every 200 ms covers between half and one
         *     and a half of full speed's (a hold, or a jump back, is not).
         */
        const expectEasedStart = ({ end, track }) => {
            const travel = (from, to) => yAt(track, to) - yAt(track, from);
            const v = travel(end + 500, end + 2500) / 2000;
            expect(v, "full speed (turns per ms)").toBeGreaterThan(0);
            const eased = travel(end, end + 125) / (v * 125);
            const prompt = travel(end, end + 300) / (v * 300);
            expect.soft(eased, "share of full speed's travel in the first 125 ms").toBeLessThan(0.5);
            expect.soft(prompt, "share of full speed's travel in the first 300 ms").toBeGreaterThan(0.2);
            const off = [];
            for (let t = end + 300; t + 200 <= end + 2300; t += 100) {
                const k = travel(t, t + 200) / (v * 200);
                if (k < 0.5 || k > 1.5) off.push(`${Math.round(t - end)} ms after the landing: ${k.toFixed(2)} of full speed`);
            }
            expect.soft(off, "200 ms spans off full speed after the ramp").toEqual([]);
        };

        test("7. every start of the spin is eased, and starts as the swap lands", async ({ page }) => {
            test.setTimeout(120_000);
            // Home, then Play.
            await page.goto(at("/"));
            await page.waitForFunction(() => window.__kf.frames.filter((f) => f.graph !== null).length > 60, null, { timeout: 30_000 });
            await page.waitForTimeout(1500);
            const play = page.locator('[aria-label="Play animation"]').first();
            if (cell === "phone") await play.tap();
            else await play.click();
            await page.waitForFunction(() => location.hash.startsWith("#/cube"), null, { timeout: 20_000 });
            expectEasedStart(await startAfterSwap(page));

            // Away to Easing, and back to the cube (a return restores it playing).
            await page.evaluate(() => (location.hash = "#/easing"));
            await page.waitForSelector(".gallery-header", { timeout: 30_000 });
            await page.waitForTimeout(1500);
            await page.evaluate(() => {
                window.__kf.marks = [];
                location.hash = "#/cube";
            });
            expectEasedStart(await startAfterSwap(page));
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

        test("9. no other scene's chunk is evaluated while the cube spins", async ({ page }) => {
            await page.goto(at("/cube"));
            await page.waitForFunction(() => window.__kf.frames.filter((f) => f.spin).length > 30, null, { timeout: 30_000 });
            await page.waitForTimeout(5000);
            const SCENE = /(Square|Easing|Spring|Sequence)Scene-[^/]*\.(js|css)/;
            const got = await page.evaluate((src) => {
                const re = new RegExp(src);
                return {
                    // Long frames whose scripts name another scene's module.
                    loaf: window.__kf.loaf.flatMap((l) => l.scripts.map((x) => ({ ...x, s: Math.round(l.s) }))).filter((x) => re.test(x.src ?? "")),
                    // A scene module's import applies its stylesheet.
                    applied: [...document.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.href).filter((h) => re.test(h)),
                    // ...and the warm still fetched them, so a first switch waits on no network.
                    fetched: performance.getEntriesByType("resource").map((e) => e.name).filter((n) => re.test(n)),
                };
            }, SCENE.source);
            expect(got.loaf, "long frames running another scene's module").toEqual([]);
            expect(got.applied, "another scene's stylesheet applied").toEqual([]);
            expect(got.fetched.length, "scene chunks fetched at idle").toBeGreaterThan(3);
        });
    });
}
