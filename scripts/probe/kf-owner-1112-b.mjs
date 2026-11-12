// SERVED MODEL: claude-opus-5-5 · a browser run through the guard (never --light), timing-sensitive:
//   ~/.claude/guard/guarded --cpu-cores 0 --timeout 10 -- node scripts/probe/kf-owner-1112-b.mjs <base> <out.json> [--gpu] [--shots DIR]
// owner-1112 PR B witness (items 6 + 7): scene swaps cube -> amiga -> spring -> cube.
// usage: node probe-scenes.mjs <baseUrl> <out.json> [--gpu] [--shots DIR]
// --gpu: the headless shell with ANGLE Metal (kf-load's real-GPU witness): the
// default software compositor times the compositor, not the page, on a VT.
// One browser, one context, closed in finally.
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(process.env.HOME + "/Programming/value.js/package.json");
const { chromium } = require("playwright");
const [base, outFile] = process.argv.slice(2);
const GPU = process.argv.includes("--gpu");
const shotsAt = process.argv.indexOf("--shots");
const SHOTS = shotsAt > 0 ? process.argv[shotsAt + 1] : null;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const KEY = "keyframes-js-scene-machine";
const browser = await chromium.launch({
    headless: true,
    args: GPU ? ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] : [],
});
const report = { base, gpu: GPU, swaps: [], checks: [] };
const check = (name, ok, detail) => {
    report.checks.push({ name, ok: !!ok, detail });
    console.log(`${ok ? "PASS" : "FAIL"} ${name} ${JSON.stringify(detail)}`);
};
try {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
    await ctx.addInitScript(() => {
        const raf = window.requestAnimationFrame.bind(window);
        let calls = 0;
        window.requestAnimationFrame = (cb) => {
            calls++;
            return raf(cb);
        };
        window.__kfRafCalls = () => calls;
        const frames = (window.__kfFrames = []);
        const tick = (ts) => {
            frames.push(ts);
            if (frames.length > 20000) frames.splice(0, 10000);
            raf(tick);
        };
        raf(tick);
        window.__kfLoaf = window.__kfLoaf ?? [];
        try {
            new PerformanceObserver((l) => {
                for (const e of l.getEntries()) window.__kfLoafP = [...(window.__kfLoafP ?? []), { s: e.startTime, d: e.duration, b: e.blockingDuration }];
            }).observe({ type: "long-animation-frame", buffered: true });
        } catch {}
    });
    const page = await ctx.newPage();
    const snap = (scene) =>
        page.evaluate(([k, s]) => {
            try {
                return JSON.parse(localStorage.getItem(k) || "{}").perScene?.[s] ?? null;
            } catch {
                return null;
            }
        }, [KEY, scene]);
    const rafRate = async (ms = 1500) => {
        const a = await page.evaluate(() => [window.__kfRafCalls(), window.__kfFrames.length]);
        await page.waitForTimeout(ms);
        const b = await page.evaluate(() => [window.__kfRafCalls(), window.__kfFrames.length]);
        // our own frame loop uses the unwrapped rAF, so every counted call is the app's
        const frames = b[1] - a[1];
        return frames > 0 ? +((b[0] - a[0]) / frames).toFixed(2) : null;
    };
    const go = async (scene, settle = 2500) => {
        const t0 = await page.evaluate((s) => {
            const now = performance.now();
            location.hash = `#/${s}`;
            return now;
        }, scene);
        if (SHOTS) {
            for (const [i, at] of [[0, 60], [1, 160], [2, 300], [3, 520]]) {
                await page.waitForTimeout(i === 0 ? at : at - [60, 160, 300, 520][i - 1]);
                await page.screenshot({ path: `${SHOTS}/to-${scene}-${i}-${at}ms.png` });
            }
        }
        await page.waitForTimeout(settle);
        const w = await page.evaluate((t0) => {
            const f = window.__kfFrames.filter((t) => t >= t0 && t <= t0 + 1500);
            const iv = f.slice(1).map((t, i) => t - f[i]).sort((a, b) => a - b);
            const loaf = (window.__kfLoafP ?? []).filter((e) => e.s >= t0 && e.s <= t0 + 1500);
            const pick = (q) => (iv.length ? +iv[Math.min(iv.length - 1, Math.floor(q * iv.length))].toFixed(1) : null);
            return {
                frames: f.length,
                p50: pick(0.5),
                p95: pick(0.95),
                max: iv.length ? +iv.at(-1).toFixed(1) : null,
                over33: iv.filter((x) => x > 33.4).length,
                loafCount: loaf.length,
                loafMs: +loaf.reduce((a, e) => a + e.d, 0).toFixed(0),
                loafMax: loaf.length ? +Math.max(...loaf.map((e) => e.d)).toFixed(0) : 0,
            };
        }, t0);
        return w;
    };
    const pauseBtn = () => page.locator('[aria-label="Pause animation"]').first();
    const playLabel = () => page.locator('[aria-label="Pause animation"], [aria-label="Play animation"]').first().getAttribute("aria-label");
    const playhead = () =>
        page.evaluate(() => {
            const s = [...document.querySelectorAll('[role="slider"]')].find((e) => /time|playhead|scrub/i.test(e.getAttribute("aria-label") ?? "") || e.closest("[data-time-slider]"));
            return s ? s.getAttribute("aria-valuenow") ?? s.getAttribute("aria-valuetext") : null;
        });

    // baseline: spring at rest, rAF callbacks per frame
    await page.goto(`${base}#/spring`, { waitUntil: "load" });
    await page.waitForTimeout(3500);
    const rafBefore = await rafRate();

    // cube: let it play, then pause, note its clock
    report.swaps.push({ to: "cube", ...(await go("cube", 3000)) });
    if (await pauseBtn().count()) await pauseBtn().click();
    await page.waitForTimeout(600);
    const cubeHead1 = await playhead();
    const cubeLabel1 = await playLabel();

    report.swaps.push({ to: "amiga", ...(await go("amiga", 1500)) });
    const cube1 = await snap("cube");
    // amiga rests on entry: press Play so its clock runs, then leave it running
    const play = page.locator('[aria-label="Play animation"]').first();
    if (await play.count()) await play.click();
    await page.waitForTimeout(2000);
    report.swaps.push({ to: "spring", ...(await go("spring", 2500)) });
    const amiga1 = await snap("amiga");
    const amigaLeftAt = Date.now();
    const rafAfter = await rafRate();
    report.swaps.push({ to: "cube", ...(await go("cube", 2500)) });
    const cubeHead2 = await playhead();
    const cubeLabel2 = await playLabel();
    report.swaps.push({ to: "amiga", ...(await go("amiga", 1200)) });
    const cube2 = await snap("cube");
    const amigaBackAt = Date.now();
    report.swaps.push({ to: "spring", ...(await go("spring", 1500)) });
    const amiga2 = await snap("amiga");
    const amigaOnFor = (Date.now() - amigaBackAt) / 1000;

    const tOf = (s) => (s ? Object.fromEntries(Object.entries(s.animations ?? {}).map(([k, v]) => [k, +(+v.t).toFixed(4)])) : null);
    check("cube's clock is identical after leaving and returning (paused)", JSON.stringify(tOf(cube1)) === JSON.stringify(tOf(cube2)) && cube1 && !cube1.playing, { cube1: tOf(cube1), cube2: tOf(cube2), playing: cube1?.playing });
    check("cube's playhead is identical on return", cubeHead1 !== null && cubeHead1 === cubeHead2, { cubeHead1, cubeHead2 });
    check("cube's play state is kept (paused stays paused)", cubeLabel1 === cubeLabel2 && cubeLabel1 === "Play animation", { cubeLabel1, cubeLabel2 });
    // amiga kept playing: the time it advanced across its second visit is the time it was ON
    const a1 = tOf(amiga1), a2 = tOf(amiga2);
    const adv = a1 && a2 ? Object.keys(a1).map((k) => +(a2[k] - a1[k]).toFixed(3)) : null;
    check("amiga resumes where it left (advance ~ time shown, not time away)", adv && adv.every((d) => d >= 0 && d < (amigaOnFor + 1.2) * 1000 && d > 300), { a1, a2, advMs: adv, amigaOnForS: amigaOnFor, awayS: (amigaBackAt - amigaLeftAt) / 1000 });
    check("no rAF work left behind by the scenes visited (spring before = after)", rafBefore !== null && rafAfter !== null && rafAfter <= rafBefore + 0.05, { rafBefore, rafAfter });
    const worst = report.swaps.reduce((m, s) => Math.max(m, s.p95 ?? 0), 0);
    report.summary = { worstP95: worst, swaps: report.swaps.map((s) => `${s.to}: p95 ${s.p95} max ${s.max} >33ms ${s.over33} loaf ${s.loafCount}/${s.loafMs}ms`) };
    console.log(JSON.stringify(report.summary, null, 1));
    await ctx.close();
} finally {
    await browser.close();
}
fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
process.exit(report.checks.every((c) => c.ok) ? 0 : 1);
