/**
 * A phone at rest shows the subject, not a form: on an upright phone the
 * controls sheet is closed (absent, not parked), the stage holds two thirds
 * of the height or more, and the one bottom dock carries Play and the
 * Controls seat that opens the sheet.
 *
 * - The Controls press raises the sheet by motion (no frame steps more than
 *   40 px), adds `sheet=1` and one history entry; Back closes it.
 * - Play adds no entry and leaves the sheet open.
 * - A press on the top dock moves neither the sheet nor the die.
 * - A tap on the stage lowers the sheet.
 * - The die is 250 px wide or more at 390x844 at rest; the folded top dock is
 *   a circle (square within 1 px).
 *
 * Chromium, touch, 4x CPU throttle. Local: serves dist/gh-pages (build it
 * first: npm run gh-pages). KF_GESTURE_BASE=https://keyframes.babb.dev runs it
 * against a deploy.
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serveDist } from "../../scripts/lib/demo-driver.mjs";
import { freeStage } from "./stage-measure.mjs";

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

const at = (hash) => (REMOTE ? `${base}/#${hash}` : `${base}/index.html#${hash}`);

const query = (page) =>
    page.evaluate(() => {
        const h = location.hash.slice(1);
        const i = h.indexOf("?");
        return Object.fromEntries(new URLSearchParams(i < 0 ? "" : h.slice(i + 1)));
    });

const throttle = async (page) => {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
};

/** The controls sheet's top edge (null when no sheet is shown). */
const sheetTop = (page) =>
    page.evaluate(() => {
        const s = document.querySelector(".controls-drawer-content");
        if (!s) return null;
        const b = s.getBoundingClientRect();
        return b.height > 0 ? b.top : null;
    });

/** The die as it shows: the union of its faces' boxes. */
const dieBox = (page) =>
    page.evaluate(() => {
        const faces = [...document.querySelectorAll(".cube .cube-side")].map((f) => f.getBoundingClientRect()).filter((b) => b.width > 0);
        if (!faces.length) return null;
        const x = Math.min(...faces.map((b) => b.left));
        const y = Math.min(...faces.map((b) => b.top));
        const r = Math.max(...faces.map((b) => b.right));
        const btm = Math.max(...faces.map((b) => b.bottom));
        return { x, y, w: r - x, h: btm - y };
    });

for (const vp of [
    { w: 390, h: 844 },
    { w: 375, h: 667 },
]) {
    test.describe(`upright phone ${vp.w}x${vp.h}`, () => {
        test.use({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: "dark" });

        for (const scene of ["/cube", "/easing", "/sequence"]) {
            test(`${scene} at rest: no sheet, the stage two thirds of the height or more`, async ({ page }) => {
                await throttle(page);
                await page.goto(at(scene));
                await page.waitForSelector(".scene-host", { timeout: 30_000 });
                await page.waitForTimeout(2500);
                expect(await sheetTop(page)).toBeNull();
                const free = await freeStage(page);
                expect(free.heightShare).toBeGreaterThanOrEqual(2 / 3);
                await expect(page.locator('button[aria-label="Controls"]')).toBeVisible();
                // The one bottom dock sits 12 px above the foot (no band under it).
                const gap = await page.evaluate(() => {
                    const host = document.querySelector('[data-dock-tether="bottom"]');
                    const plate = host?.querySelector(".pointer-events-auto")?.firstElementChild;
                    const b = plate?.getBoundingClientRect();
                    return b ? innerHeight - b.bottom : null;
                });
                expect(gap).not.toBeNull();
                expect(gap).toBeGreaterThanOrEqual(10);
                expect(gap).toBeLessThanOrEqual(16);
            });
        }

        test("the Controls seat opens the sheet by motion, as one entry; Back closes; Play keeps it", async ({ page }) => {
            await throttle(page);
            await page.goto(at("/"));
            await page.waitForTimeout(1200);
            await page.evaluate(() => (location.hash = "#/cube"));
            await page.waitForSelector(".cube", { timeout: 30_000 });
            await page.waitForTimeout(2500);
            const len0 = await page.evaluate(() => history.length);
            const seat = page.locator('button[aria-label="Controls"]');
            await expect(seat).toHaveAttribute("aria-expanded", "false");

            // Sample the sheet's top edge every frame from the press on.
            await page.evaluate(() => {
                window.__tops = [];
                const tick = () => {
                    const s = document.querySelector(".controls-drawer-content");
                    const b = s?.getBoundingClientRect();
                    window.__tops.push(b && b.height > 0 ? b.top : null);
                    if (window.__tops.length < 90) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
            await seat.tap();
            await page.waitForTimeout(1800);
            const tops = (await page.evaluate(() => window.__tops)).filter((t) => t !== null);
            expect(tops.length).toBeGreaterThanOrEqual(6);
            const moved = new Set(tops.map((t) => Math.round(t))).size;
            const steps = tops.slice(1).map((t, i) => Math.abs(t - tops[i]));
            // Shown by motion or by glass's fade: either way no frame jumps more than 40 px.
            expect(Math.max(0, ...steps)).toBeLessThanOrEqual(40);
            expect(moved).toBeGreaterThanOrEqual(1);
            await expect(seat).toHaveAttribute("aria-expanded", "true");
            expect((await query(page)).sheet).toBe("1");
            expect(await page.evaluate(() => history.length)).toBe(len0 + 1);

            // Play: no entry, the sheet stays.
            const play = page.locator('button[aria-label="Play animation"], button[aria-label="Pause animation"]').first();
            await play.tap();
            await page.waitForTimeout(800);
            expect(await page.evaluate(() => history.length)).toBe(len0 + 1);
            expect(await sheetTop(page)).not.toBeNull();

            // A press on the top dock moves neither the sheet nor the die.
            const top0 = await sheetTop(page);
            const die0 = await dieBox(page);
            const dock = page.locator('[data-dock-tether="top"] button').first();
            await dock.tap();
            await page.waitForTimeout(900);
            expect(Math.abs((await sheetTop(page)) - top0)).toBeLessThanOrEqual(1);
            const die1 = await dieBox(page);
            expect(Math.abs(die1.y - die0.y)).toBeLessThanOrEqual(1);
            expect(await sheetTop(page)).not.toBeNull();

            // Back closes it and leaves the cube showing.
            await page.goBack();
            await page.waitForTimeout(1200);
            expect(await sheetTop(page)).toBeNull();
            expect(await page.evaluate(() => location.hash)).toMatch(/^#\/cube/);
        });

        test("a tap on the stage lowers the sheet", async ({ page }) => {
            await page.goto(at("/cube?sheet=1"));
            await page.waitForSelector(".cube", { timeout: 30_000 });
            await page.waitForTimeout(2500);
            expect(await sheetTop(page)).not.toBeNull();
            const g = await page.evaluate(() => {
                const r = document.querySelector(".graph").getBoundingClientRect();
                return { x: r.x + r.width / 2, y: r.y + 20 };
            });
            await page.touchscreen.tap(g.x + 60, g.y);
            await page.waitForTimeout(1200);
            expect(await sheetTop(page)).toBeNull();
        });
    });
}

test.describe("upright phone 390x844: the die and the folded dock", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: "dark" });

    test("the die is 250 px wide or more at rest", async ({ page }) => {
        await page.goto(at("/cube"));
        await page.waitForSelector(".cube", { timeout: 30_000 });
        await page.waitForTimeout(2500);
        const d = await dieBox(page);
        expect(d.w).toBeGreaterThanOrEqual(250);
    });

    test("the folded top dock is a circle", async ({ page }) => {
        await page.goto(at("/cube"));
        await page.waitForSelector(".cube", { timeout: 30_000 });
        await page.waitForTimeout(2500);
        const plate = await page.evaluate(() => {
            const host = document.querySelector('[data-dock-tether="top"]');
            const dock = host?.querySelector(".glass-dock, [data-slot=dock]") ?? host?.firstElementChild?.firstElementChild;
            const b = dock?.getBoundingClientRect();
            return b ? { w: b.width, h: b.height } : null;
        });
        expect(plate).not.toBeNull();
        expect(Math.abs(plate.w - plate.h)).toBeLessThanOrEqual(1);
    });
});

test.describe("desk 1440: the site's own motions read as done within the band", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("Sequence's lanes land by about 300 ms (the stagger is short), none removed", async ({ page }) => {
        await page.goto(at("/"));
        await page.waitForTimeout(1200);
        // Collect the lane entries as they start.
        await page.evaluate(() => {
            window.__lanes = [];
            const seen = new Set();
            const tick = () => {
                for (const a of document.getAnimations()) {
                    const t = a.effect?.target;
                    if (!(t instanceof Element) || !t.classList.contains("seq-row") || seen.has(a)) continue;
                    seen.add(a);
                    const k = a.effect.getTiming();
                    window.__lanes.push({ delay: Number(k.delay), duration: Number(k.duration) });
                }
                if (performance.now() < 20_000) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        });
        await page.evaluate(() => (location.hash = "#/sequence"));
        await page.waitForSelector(".seq-row", { timeout: 30_000 });
        await page.waitForTimeout(1500);
        const lanes = await page.evaluate(() => window.__lanes);
        expect(lanes.length).toBeGreaterThan(0);
        for (const l of lanes) expect(l.duration).toBeLessThanOrEqual(300);
        const lastEnd = Math.max(...lanes.map((l) => l.delay + l.duration));
        expect(lastEnd).toBeLessThanOrEqual(400);
    });
});
