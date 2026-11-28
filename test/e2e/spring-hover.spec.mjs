/**
 * Hover stability on the Spring page (owner 2026-11-15: "hovering over
 * cards/dashboard items should not shift the main cards or vizzes around").
 * Hovering the Peak overshoot chart cross-fades its caption from the live
 * reading to the 'ζ → peak %' readout (FIFTY-FOURTH: the chart replaced the
 * response × damping field). Nothing else may change: the chart, its
 * caption slot and the spring chart keep the same box, to the pixel, before,
 * during (sampled through the cross-fade) and after the hover, at a desktop
 * width and at a phone width.
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

const springUrl = () => (REMOTE ? `${base}/#/spring` : `${base}/index.html#/spring`);

/** The watched boxes, in viewport px. */
const boxes = (page) =>
    page.evaluate(() => {
        const r = (el) => {
            if (!el) return null;
            const b = el.getBoundingClientRect();
            return { x: b.x, y: b.y, w: b.width, h: b.height };
        };
        return {
            heatmap: r(document.querySelector(".spring-heatmap")),
            caption: r(document.querySelector(".spring-heatmap-caption")),
            chart: r(document.querySelector(".spring-target")),
        };
    });

const largestShift = (a, b) => {
    let max = 0;
    for (const key of Object.keys(a)) {
        for (const k of ["x", "y", "w", "h"]) max = Math.max(max, Math.abs(a[key][k] - b[key][k]));
    }
    return max;
};

/** Raise the phone sheet to its full detent with a pointer drag on its grip. */
async function raiseSheet(page) {
    const grip = await page.locator('[data-slot="sheet-detent-handle"]').first().boundingBox();
    if (!grip) return;
    const cx = grip.x + grip.width / 2;
    const cy = grip.y + grip.height / 2;
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) await page.mouse.move(cx, cy - i * 55, { steps: 2 });
    await page.mouse.up();
    await page.waitForTimeout(1500);
}

for (const vp of [
    { name: "1440x900", width: 1440, height: 900 },
    { name: "1280x720", width: 1280, height: 720 },
    { name: "390x844", width: 390, height: 844 },
]) {
    test(`spring heatmap hover moves no box at ${vp.name}`, async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: "dark" });
        try {
            const page = await context.newPage();
            // A phone opens with the controls closed: the link opens them.
            await page.goto(springUrl() + (vp.width < 600 ? "?sheet=1" : ""), { waitUntil: "load" });
            await page.locator(".spring-heatmap-section").first().waitFor({ timeout: 15_000 });
            await page.waitForTimeout(1500);
            if (vp.width < 600) await raiseSheet(page);
            // The fit rule may close the figure on a short rail; opening it is a
            // press, not a hover.
            if (!(await page.locator(".spring-heatmap").count())) {
                await page.locator("[data-figure-title]").first().click();
                await page.waitForTimeout(1200);
            }
            const field = page.locator(".spring-heatmap").first();
            await field.evaluate((el) => el.scrollIntoView({ block: "center" }));
            await page.mouse.move(1, vp.height - 1);
            await page.waitForTimeout(800);

            const before = await boxes(page);
            for (const [key, box] of Object.entries(before)) expect(box, `${key} is on the page`).not.toBeNull();
            const caption = page.locator(".spring-heatmap-caption");
            await expect(caption).not.toHaveAttribute("data-reading");

            const f = await field.boundingBox();
            await page.mouse.move(f.x + f.width * 0.3, f.y + f.height * 0.6, { steps: 4 });
            let worst = 0;
            for (let i = 0; i < 12; i++) {
                worst = Math.max(worst, largestShift(before, await boxes(page)));
                await page.waitForTimeout(25);
            }
            await expect(caption).toHaveAttribute("data-reading", "");
            await page.waitForTimeout(400);
            const during = await boxes(page);
            await expect(page.locator("[data-heatmap-hover]")).toHaveCSS("opacity", "1");
            await expect(page.locator("[data-figure-legend]")).toHaveCSS("opacity", "0");

            await page.mouse.move(1, vp.height - 1, { steps: 4 });
            for (let i = 0; i < 12; i++) {
                worst = Math.max(worst, largestShift(before, await boxes(page)));
                await page.waitForTimeout(25);
            }
            await expect(caption).not.toHaveAttribute("data-reading");
            await page.waitForTimeout(400);
            const after = await boxes(page);

            expect(during, "boxes while hovering").toEqual(before);
            expect(after, "boxes after the hover").toEqual(before);
            expect(worst, "largest shift through the cross-fade (px)").toBe(0);
        } finally {
            await context.close();
        }
    });
}

// Reduced motion is not asserted here: glass's global guard
// (`a11y-overrides.css`, a layered `transition-duration: 0s !important`) zeroes
// every transition under `prefers-reduced-motion: reduce`, and a layered
// important declaration outranks anything the site can write. The fade under
// reduced motion is glass's to carve out.
test("the caption cross-fades on an opacity ease (no cut)", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
    try {
        const page = await context.newPage();
        await page.goto(springUrl(), { waitUntil: "load" });
        await page.locator(".spring-heatmap-caption").first().waitFor({ timeout: 15_000 });
        for (const selector of ["[data-heatmap-hover]", "[data-figure-legend]"]) {
            const transition = await page.locator(selector).evaluate((el) => {
                const cs = getComputedStyle(el);
                return { property: cs.transitionProperty, duration: Number.parseFloat(cs.transitionDuration) };
            });
            expect(transition.property, selector).toContain("opacity");
            expect(transition.duration, selector).toBeGreaterThan(0);
        }
    } finally {
        await context.close();
    }
});

test("a mouse press on a spring term opens its explanation within 100 ms (the hover wait is for a passing hover)", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark" });
    try {
        const page = await context.newPage();
        await page.goto(springUrl(), { waitUntil: "load" });
        const term = page.locator(".param-term").first();
        await term.waitFor({ timeout: 15_000 });
        await page.waitForTimeout(1200);
        const b = await term.boundingBox();
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
        const t0 = await page.evaluate(() => performance.now());
        await page.mouse.down();
        const shown = await page.evaluate(
            () =>
                new Promise((resolve) => {
                    const start = performance.now();
                    const tick = () => {
                        const el = document.querySelector('[data-slot="popover-content"], [role="group"][data-state="open"], [data-state="open"][data-side]');
                        if (el && el.getBoundingClientRect().width > 0) resolve(performance.now());
                        else if (performance.now() - start > 1000) resolve(null);
                        else requestAnimationFrame(tick);
                    };
                    tick();
                }),
        );
        await page.mouse.up();
        expect(shown).not.toBeNull();
        expect(shown - t0).toBeLessThan(100);
    } finally {
        await context.close();
    }
});
