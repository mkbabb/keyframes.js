/**
 * The site's share of the dock study (owner, FORTY-SIXTH A: "the dock needs a
 * bit of refinement in animations at the begin and end ... hovering the
 * darkmode toggle or toggling it should not shift it around").
 *
 *   K-1. A page change (Home to the cube, dock open) paints ONE dock: neither
 *        dock is a View-Transition group, so no stretched image of the old dock
 *        cross-fades with the new one. Logged every frame of the swap.
 *   K-4. On a phone a tap on the theme seat opens no tooltip under the dock.
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

/** Per frame from document start: whether a View Transition runs, and the
 *  View-Transition pseudo-elements that animate a dock. */
const LOG = () => {
    const L = (window.__dock = { frames: [] });
    const loop = (t) => {
        L.frames.push({
            t,
            vt: document.documentElement.matches(":active-view-transition") ? 1 : 0,
            dockPseudo: [
                ...new Set(
                    document
                        .getAnimations()
                        .map((a) => a.effect?.pseudoElement ?? "")
                        .filter((p) => /dock/.test(p)),
                ),
            ],
            plates: document.querySelectorAll(".dock-plate").length,
        });
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

const CELLS = {
    "1440": { viewport: { width: 1440, height: 900 } },
    "390": { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
};

/** Open the main dock as a hand does: a hover on a desk, a tap on a phone. */
async function openDock(page, touch) {
    const box = await page.locator(".glass-dock").first().boundingBox();
    if (touch) await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    else await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page
        .waitForFunction(() => !document.querySelector(".glass-dock")?.classList.contains("collapsed"), null, { timeout: 4000 })
        .catch(() => {});
    await page.waitForTimeout(700);
}

for (const [cell, use] of Object.entries(CELLS)) {
    test.describe(`at ${cell}`, () => {
        test.use(use);

        test("K-1. a page change paints one dock: no dock is a View-Transition group", async ({ page, context }) => {
            await context.addInitScript(LOG);
            await page.goto(at("/"));
            await page.waitForSelector(".hero-band", { timeout: 20_000 });
            await page.waitForTimeout(1500);
            await openDock(page, cell === "390");
            const from = await page.evaluate(() => performance.now());
            // Home to the cube, the dock open: Home's Play on a phone, the
            // address on a desk (the pointer stays on the dock).
            if (cell === "390") await page.locator('[aria-label="Play animation"]').first().tap();
            else await page.evaluate(() => (location.hash = "#/cube"));
            await page.waitForFunction(() => location.hash.startsWith("#/cube"), null, { timeout: 20_000 });
            await page.waitForTimeout(2000);
            const frames = await page.evaluate((t0) => window.__dock.frames.filter((f) => f.t >= t0), from);
            // The swap ran as a View Transition...
            expect(frames.some((f) => f.vt), "a View Transition ran").toBe(true);
            // ...and on no frame of it did a dock ride it as its own group.
            const grouped = frames.filter((f) => f.dockPseudo.length).map((f) => `${Math.round(f.t)} ms: ${f.dockPseudo.join(", ")}`);
            expect(grouped).toEqual([]);
        });
    });
}

test.describe("on a phone", () => {
    test.use(CELLS["390"]);

    test("K-4. a tap on the theme seat opens no tooltip", async ({ page }) => {
        await page.goto(at("/cube"));
        await page.waitForSelector("[data-dock-theme]", { state: "attached", timeout: 20_000 });
        await page.waitForTimeout(1500);
        await openDock(page, true);
        const theme = page.locator("[data-dock-theme]").first();
        const b = await theme.boundingBox();
        await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
        // A tooltip opens 100 ms after its trigger is reached (the root
        // provider's delay); watch the next second.
        const seen = await page.evaluate(
            () =>
                new Promise((done) => {
                    const t0 = performance.now();
                    let max = 0;
                    const f = () => {
                        max = Math.max(max, document.querySelectorAll('[role="tooltip"]').length);
                        if (performance.now() - t0 < 1000) requestAnimationFrame(f);
                        else done(max);
                    };
                    requestAnimationFrame(f);
                }),
        );
        expect(seen, "tooltips shown after the tap").toBe(0);
    });
});
