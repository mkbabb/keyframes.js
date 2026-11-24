/**
 * Nothing scrolls sideways: the rows the sideways-scroll census (23 Nov) found
 * on this site, each held to its cure.
 *
 * - A box that scrolls on its block axis computes its inline axis to hidden or
 *   clip, never auto: the controls pane's port and the timing editor's body
 *   (a lone `overflow-y: auto` computes x to auto, and a hair of overflow then
 *   pans the box sideways under a thumb's diagonal).
 *
 * Chromium, touch. Local: serves dist/gh-pages (build it first: npm run
 * gh-pages). KF_GESTURE_BASE=https://keyframes.babb.dev runs it against a
 * deploy.
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

const load = async (page, hash) => {
    await page.goto(at(hash));
    await page.waitForSelector(".scene-host", { timeout: 30_000 });
    await page.waitForTimeout(2000);
};

/** The inline overflow of every box matching `sel` that scrolls on its block axis. */
const xOfBlockScrollers = (page, sel) =>
    page.evaluate((s) => {
        return [...document.querySelectorAll(s)]
            .map((e) => getComputedStyle(e))
            .filter((cs) => cs.overflowY === "auto" || cs.overflowY === "scroll")
            .map((cs) => cs.overflowX);
    }, sel);

test.describe("a box that scrolls on its block axis never pans sideways", () => {
    test.describe("desk 1440", () => {
        test.use({ viewport: { width: 1440, height: 900 } });

        test("the controls pane's port and the timing editor's body (cube)", async ({ page }) => {
            await load(page, "/cube");
            const xs = await xOfBlockScrollers(page, ".controls-pane, .subpane-body");
            expect(xs.length).toBeGreaterThan(0);
            for (const x of xs) expect(["hidden", "clip"]).toContain(x);
        });
    });

    test.describe("upright phone 390x844, the sheet open", () => {
        test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });

        for (const scene of ["/cube", "/easing", "/spring"]) {
            test(`${scene}: the sheet's pane port`, async ({ page }) => {
                await load(page, scene);
                await page.locator('button[aria-label="Controls"]').tap();
                await page.waitForTimeout(1500);
                const xs = await xOfBlockScrollers(page, ".controls-drawer-content .controls-pane, .controls-drawer-content .subpane-body");
                expect(xs.length).toBeGreaterThan(0);
                for (const x of xs) expect(["hidden", "clip"]).toContain(x);
            });
        }
    });
});
