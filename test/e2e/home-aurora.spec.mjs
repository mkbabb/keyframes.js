/**
 * Home's aurora comes and goes by a fade (owner, FORTY-SIXTH: "Animation init
 * ... is janky"; motion law: nothing changes instantly, in or out).
 *
 *   1. On a cold Home the wash fades in: it is never at full strength in the
 *      first frame it is painted, and it reaches its rest.
 *   2. Leaving Home (Play), the wash fades out, still drawn while it fades
 *      (its renderer is torn down only after), over 200 ms or more; it is
 *      never gone in one frame.
 *
 * The wash's painted strength is read every frame from document start (the
 * element's computed opacity, which an animation drives).
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

const LOG = () => {
    const L = (window.__aur = { frames: [] });
    const loop = (t) => {
        const el = document.querySelector(".hero-aurora");
        // Whether the wash's renderer still draws: its canvas's context is
        // alive (glass's Aurora loses it when it is torn down). Read only once
        // the test asks (by then the wash has made its context; a read before
        // would make one for it).
        const gl = L.readDrawn ? el?.querySelector("canvas")?.getContext("webgl2") : null;
        L.frames.push({ t, o: el ? Number(getComputedStyle(el).opacity) : null, drawn: gl ? !gl.isContextLost() : null });
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

test.use({ viewport: { width: 1440, height: 900 } });

test("1. a cold Home's wash fades in", async ({ page, context }) => {
    await context.addInitScript(LOG);
    await page.goto(at("/"));
    await page.waitForFunction(() => window.__aur.frames.filter((f) => f.o !== null).length > 40, null, { timeout: 30_000 });
    const shown = await page.evaluate(() => window.__aur.frames.filter((f) => f.o !== null));
    // Its rest is faint by design (glass's ceiling, about 0.1).
    const rest = shown.at(-1).o;
    expect(rest).toBeGreaterThan(0.02);
    // The first frame it is painted in is not its rest...
    expect(shown[0].o, `first painted opacity ${shown[0].o} of rest ${rest}`).toBeLessThan(0.5 * rest);
    // ...and it climbs through the frames between.
    const between = shown.filter((f) => f.o > 0.1 * rest && f.o < 0.9 * rest);
    expect(between.length).toBeGreaterThanOrEqual(2);
});

test("2. leaving Home, the wash fades out while it still draws, never in one frame", async ({ page, context }) => {
    await context.addInitScript(LOG);
    await page.goto(at("/"));
    await page.waitForFunction(() => window.__aur.frames.filter((f) => f.o !== null).length > 60, null, { timeout: 30_000 });
    await page.waitForTimeout(800);
    const from = await page.evaluate(() => performance.now());
    const rest = await page.evaluate(() => {
        window.__aur.readDrawn = true;
        return window.__aur.frames.at(-1).o;
    });
    await page.locator('[aria-label="Play animation"]').first().click();
    await page.waitForFunction(() => location.hash.startsWith("#/cube"), null, { timeout: 20_000 });
    await page.waitForTimeout(1500);
    const frames = await page.evaluate((t0) => window.__aur.frames.filter((f) => f.t >= t0), from);
    // The wash is gone at the end...
    expect(frames.at(-1).o).toBeNull();
    // ...and on its way out it was painted part-way, its renderer still
    // drawing, and it took its time: from the last frame at full strength to
    // the first without it, 200 ms or more (its fade is 240 ms). Read as time,
    // not as a count of frames: a loaded machine paints the swap's frames
    // 50 to 80 ms apart.
    const between = frames.filter((f) => f.o !== null && f.o > 0.05 * rest && f.o < 0.9 * rest);
    expect(between.length, `frames part-way out (rest ${rest})`).toBeGreaterThanOrEqual(1);
    expect(between.filter((f) => f.drawn === false), "frames fading a torn-down wash").toEqual([]);
    const gone = frames.findIndex((f) => f.o === null);
    const lastFull = frames.slice(0, gone).findLastIndex((f) => f.o >= 0.9 * rest);
    expect(lastFull, "a frame at full strength before the leave").toBeGreaterThanOrEqual(0);
    expect(frames[gone].t - frames[lastFull].t, "ms from full strength to gone").toBeGreaterThanOrEqual(200);
});
