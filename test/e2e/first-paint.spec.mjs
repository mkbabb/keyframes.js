/**
 * LAST-TEN KF-31 — a slow first load. While the app's script is still on the
 * wire the page shows the ground the app stands on (the mount does not re-tint
 * it), and the app then arrives by a short fade over that ground, never whole
 * in one frame.
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

const at = (hash) => (REMOTE ? `${base}/#${hash}` : `${base}/index.html#${hash}`);

for (const cell of [
    { name: "phone 390 dark", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: "dark" } },
    { name: "desk 1440 light", use: { viewport: { width: 1440, height: 900 }, colorScheme: "light" } },
]) {
    test.describe(cell.name, () => {
        test.use(cell.use);

        test("the first paint is the app's ground, and the app arrives by a fade", async ({ page }) => {
            // The stylesheet and then the entry script arrive late, as on a slow network.
            await page.route(/\/assets\/index-[^/]*\.(css|js)$/, async (route) => {
                await new Promise((r) => setTimeout(r, route.request().url().endsWith(".css") ? 1000 : 1500));
                await route.continue();
            });
            await page.addInitScript(() => {
                const R = (window.__arrive = { opacity: [], ground: null });
                const watch = () => {
                    const host = document.getElementById("app");
                    if (!host) return requestAnimationFrame(watch);
                    new MutationObserver((_, mo) => {
                        if (!host.firstElementChild) return;
                        mo.disconnect();
                        const sample = () => {
                            R.opacity.push(Number(getComputedStyle(host).opacity));
                            if (R.opacity.length < 40) requestAnimationFrame(sample);
                        };
                        sample();
                    }).observe(host, { childList: true });
                };
                watch();
            });
            await page.goto(at("/cube"), { waitUntil: "commit" });
            await page.waitForSelector("body");
            await page.waitForTimeout(600);
            const before = await page.evaluate(() => ({
                ground: getComputedStyle(document.body).backgroundColor,
                mounted: !!document.getElementById("app")?.firstElementChild,
            }));
            expect(before.mounted).toBe(false);
            await page.waitForFunction(() => window.__arrive.opacity.length >= 40, null, { timeout: 20_000 });
            const after = await page.evaluate(() => ({
                ground: getComputedStyle(document.body).backgroundColor,
                opacity: window.__arrive.opacity,
            }));
            expect(after.ground).toBe(before.ground);
            // A fade: it starts well below full, climbs over several frames, lands at 1.
            expect(after.opacity[0]).toBeLessThan(0.5);
            expect(after.opacity.at(-1)).toBe(1);
            expect(after.opacity.filter((o) => o > 0.05 && o < 0.95).length).toBeGreaterThan(3);
        });
    });
}
