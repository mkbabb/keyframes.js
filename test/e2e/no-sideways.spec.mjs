/**
 * Nothing scrolls sideways: the rows the sideways-scroll census (23 Nov) found
 * on this site, each held to its cure.
 *
 * - A box that scrolls on its block axis computes its inline axis to hidden or
 *   clip, never auto: the controls pane's port and the timing editor's body
 *   (a lone `overflow-y: auto` computes x to auto, and a hair of overflow then
 *   pans the box sideways under a thumb's diagonal).
 * - The expanded dock's run holds its seats inside its plate at every phone
 *   width, the theme's seat included; where the run cannot hold the theme
 *   (under 390 px) the @mbabb menu carries it, and it still flips the theme.
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

/** The expanded dock's run against its plate, and the theme's seat. */
const dockRun = (page) =>
    page.evaluate(() => {
        const run = document.querySelector(".dock-layer--full.dock-run");
        if (!run) return null;
        const r = run.getBoundingClientRect();
        const theme = document.querySelector("[data-dock-theme]");
        const t = theme?.getBoundingClientRect();
        return { over: run.scrollWidth - run.clientWidth, right: r.right, theme: t && t.width > 0 ? { right: t.right } : null };
    });

const expandDock = async (page) => {
    const summary = page.locator(".dock-layer--summary[aria-expanded=false]").first();
    if (await summary.count()) {
        await summary.tap();
        await page.waitForTimeout(900);
    }
};

for (const w of [360, 375, 390]) {
    test.describe(`phone ${w}x780: the dock's run`, () => {
        test.use({ viewport: { width: w, height: 780 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });

        for (const scene of ["/cube", "/easing", "/sequence", "/spring"]) {
            test(`${scene}: every seat inside the plate, none past the run's end`, async ({ page }) => {
                await load(page, scene);
                await expandDock(page);
                const run = await dockRun(page);
                expect(run).not.toBeNull();
                expect(run.over).toBeLessThanOrEqual(1);
                if (run.theme) expect(run.theme.right).toBeLessThanOrEqual(run.right + 0.5);
            });
        }

        test("the theme is in reach, in the dock or in the @mbabb menu, and flips it", async ({ page }) => {
            await load(page, "/cube");
            await expandDock(page);
            const run = await dockRun(page);
            const dark0 = await page.evaluate(() => document.documentElement.classList.contains("dark"));
            if (run?.theme) {
                await page.locator("[data-dock-theme]").tap();
            } else {
                await page.locator('button[aria-label="@mbabb menu"]').tap();
                await page.waitForTimeout(500);
                const row = page.getByRole("menuitemcheckbox", { name: "Dark mode" });
                await expect(row).toBeVisible();
                await expect(row).toHaveAttribute("aria-checked", String(dark0));
                await row.tap();
            }
            await page.waitForTimeout(400);
            expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(!dark0);
        });
    });
}
