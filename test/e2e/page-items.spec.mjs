/**
 * The page items of FIFTY-FOURTH and FIFTY-FIFTH (owner, 23 Nov 2026), held in
 * a real browser:
 *
 * - The code editor draws no light rules over and under the code while it is
 *   being edited ("remove the top and bottom white bars ehre"): the well wears
 *   no outline when its text has focus, at 1440x900 and 390x844.
 * - The easing picker is wider and searchable ("this should be wider and
 *   searchable, too. On desktop and mobile."): at the desk it holds four tiles
 *   a row at 640 px or more; a phone's spans the screen less its gutters; its
 *   search field filters the tiles; on a touch screen the opening focus is not
 *   in the field.
 * - A hover on an easing card moves its ball when the scene is not playing
 *   ("hovering, even when not playing, should move the ball").
 * - The Easing editor is larger ("larger editor"): at 1440x900 its plot is
 *   265 px or more and the pane does not scroll; at 1280x800 it does not
 *   scroll either.
 *
 * Chromium. Local: serves dist/gh-pages (build it first: npm run gh-pages).
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
const DESK = { viewport: { width: 1440, height: 900 } };
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

const load = async (page, hash, selector = ".scene-host") => {
    await page.goto(at(hash));
    await page.waitForSelector(selector, { timeout: 30_000 });
    await page.waitForTimeout(2000);
};

test.describe("the code editor: no rules over and under the code while editing", () => {
    for (const [name, opts, hash] of [
        ["1440x900", DESK, "/cube?pane=keyframes"],
        ["390x844", PHONE, "/cube?pane=keyframes&sheet=1"],
    ]) {
        test(`${name}: the well wears no outline while its text has focus`, async ({ browser }) => {
            const ctx = await browser.newContext(opts);
            try {
                const page = await ctx.newPage();
                await load(page, hash, ".code-well .view-line");
                await page.waitForTimeout(1500);
                const line = page.locator(".code-well .view-line").nth(2);
                if (opts.hasTouch) await line.tap();
                else await line.click();
                await page.waitForTimeout(400);
                const state = await page.evaluate(() => {
                    const well = document.querySelector(".code-well");
                    const cs = getComputedStyle(well);
                    return {
                        focusedInside: well.contains(document.activeElement),
                        outline: cs.outlineStyle,
                        width: parseFloat(cs.outlineWidth) || 0,
                    };
                });
                expect(state.focusedInside, "the code has focus").toBe(true);
                expect(state.outline === "none" || state.width === 0, `outline ${state.outline} ${state.width}px`).toBe(true);
            } finally {
                await ctx.close();
            }
        });
    }
});

/** Open the easing picker from the cube's Rotations card. */
const openPicker = async (page, touch) => {
    await load(page, touch ? "/cube?sheet=1" : "/cube");
    const trigger = page.getByRole("button", { name: /^easing\b/i }).first();
    await trigger.scrollIntoViewIfNeeded();
    if (touch) await trigger.tap();
    else await trigger.click();
    await page.waitForSelector('[role="dialog"][aria-label="Easing curves"] .specimen-tile', { timeout: 10_000 });
    await page.waitForTimeout(600);
    return page.locator('[role="dialog"][aria-label="Easing curves"]');
};

/** The tiles of the first row: how many share the first tile's top. */
const firstRowCount = (dialog) =>
    dialog.evaluate((el) => {
        const tops = [...el.querySelectorAll(".specimen-tile")].map((t) => Math.round(t.getBoundingClientRect().top));
        return tops.filter((t) => t === tops[0]).length;
    });

test.describe("the easing picker: wider and searchable", () => {
    test("1440x900: 640 px or wider, four tiles a row, and a search that filters", async ({ browser }) => {
        const ctx = await browser.newContext(DESK);
        try {
            const page = await ctx.newPage();
            const dialog = await openPicker(page, false);
            const box = await dialog.boundingBox();
            expect(box.width).toBeGreaterThanOrEqual(640);
            expect(box.x + box.width).toBeLessThanOrEqual(1440);
            expect(await firstRowCount(dialog)).toBeGreaterThanOrEqual(4);
            const search = dialog.getByRole("searchbox", { name: "Search curves" });
            await expect(search).toBeVisible();
            await search.fill("expo");
            await page.waitForTimeout(600);
            const names = await dialog.locator(".specimen-tile .tile-name").allTextContents();
            expect(names.map((n) => n.trim())).toEqual(["ease-in-expo", "ease-out-expo", "ease-in-out-expo"]);
            await search.press("Enter");
            await page.waitForTimeout(400);
            await expect(page.getByRole("button", { name: /^easing\b/i }).first()).toContainText("ease-in-expo");
        } finally {
            await ctx.close();
        }
    });

    test("390x844: the screen less its gutters; the field is there and the opening focus is not in it", async ({ browser }) => {
        const ctx = await browser.newContext(PHONE);
        try {
            const page = await ctx.newPage();
            const dialog = await openPicker(page, true);
            const box = await dialog.boundingBox();
            expect(box.width).toBeGreaterThanOrEqual(350);
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(390);
            expect(await firstRowCount(dialog)).toBe(2);
            const search = dialog.getByRole("searchbox", { name: "Search curves" });
            await expect(search).toBeVisible();
            const focusInField = await page.evaluate(() => document.activeElement?.matches?.("input[type=search]") ?? false);
            expect(focusInField, "the keyboard does not rise on opening").toBe(false);
            const fontSize = await search.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
            expect(fontSize).toBeGreaterThanOrEqual(16);
        } finally {
            await ctx.close();
        }
    });
});

test.describe("the easing cards: a hover moves the ball when the scene is not playing", () => {
    test("1440x900, paused at its start: hovering a card carries its ball along the curve", async ({ browser }) => {
        const ctx = await browser.newContext(DESK);
        try {
            const page = await ctx.newPage();
            await load(page, "/easing", ".specimen-tile .tile-carriage");
            const tile = page.locator('.specimen-tile:not([data-state="on"])').nth(1);
            const carriage = tile.locator(".tile-carriage");
            const x = () =>
                carriage.evaluate((el) => {
                    const m = /translate\(([-\d.]+)%/.exec(el.style.transform);
                    return m ? Number(m[1]) : 0;
                });
            const before = await x();
            await tile.hover();
            await page.waitForTimeout(350);
            const during = await x();
            await page.waitForTimeout(1200);
            const end = await x();
            expect(during, "the ball has left where it stood").toBeGreaterThan(before + 5);
            expect(end).toBeGreaterThan(95);
        } finally {
            await ctx.close();
        }
    });
});

test.describe("the Easing editor: larger, and the pane does not scroll", () => {
    for (const [w, h, floor] of [
        [1440, 900, 265],
        [1280, 800, 0],
    ]) {
        test(`${w}x${h}`, async ({ browser }) => {
            const ctx = await browser.newContext({ viewport: { width: w, height: h } });
            try {
                const page = await ctx.newPage();
                await load(page, "/easing", '[data-slot="easing-curve"]');
                const m = await page.evaluate(() => {
                    const plot = document.querySelector('[data-slot="easing-curve"]').getBoundingClientRect();
                    const port = document.querySelector(".controls-surface");
                    return { plot: plot.width, scroll: port.scrollHeight - port.clientHeight };
                });
                expect(m.plot).toBeGreaterThanOrEqual(floor);
                expect(m.scroll, "the pane holds its rows without scrolling").toBeLessThanOrEqual(1);
            } finally {
                await ctx.close();
            }
        });
    }
});
