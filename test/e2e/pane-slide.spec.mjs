/**
 * LAST-TEN KF-18 — on the desktop, closing and reopening the controls pane
 * moves the stage on a transform: the stage does not re-lay out frame by frame
 * (no layout shift through the motion), and the subject travels to its new
 * place over several frames with no single-frame jump. The pane itself fades
 * where it stood: its box keeps its width and place while it shows, and it
 * leaves over several frames, not in one.
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

test.use({ viewport: { width: 1440, height: 900 } });

/** Every layout shift (input-adjacent or not) and the subject's centre on every frame. */
const record = (page) =>
    page.evaluate(() => {
        const R = (window.__slide = { shifts: 0, xs: [], on: true });
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) R.shifts += e.value;
        }).observe({ type: "layout-shift" });
        const tick = () => {
            if (!R.on) return;
            const g = document.querySelector(".graph")?.getBoundingClientRect();
            if (g) R.xs.push(g.left + g.width / 2);
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
const stop = (page) =>
    page.evaluate(() => {
        window.__slide.on = false;
        return window.__slide;
    });

/** Open the folded dock under a pointer, then press the surfaces menu's row. */
async function pickSurfaceRow(page, which) {
    const dock = await page.locator(".glass-dock").first().boundingBox();
    await page.mouse.move(dock.x + dock.width / 2, dock.y + dock.height / 2);
    await page
        .waitForFunction(() => !document.querySelector(".glass-dock")?.classList.contains("collapsed"), null, { timeout: 4000 })
        .catch(() => {});
    await page.waitForTimeout(400);
    await page.locator("[data-dock-surface-trigger]").first().click();
    const row = page.locator(`[data-dock-surface-item][data-surface="${which}"]`).first();
    await row.waitFor({ state: "visible" });
    await row.click();
    // Leave the dock so nothing over the stage is hovered while it moves.
    await page.mouse.move(dock.x + dock.width / 2, 860);
}

/** The largest single-frame step against its neighbours' (RUBRIC: a jump is > 3x). */
function jumps(xs) {
    const d = xs.slice(1).map((x, i) => Math.abs(x - xs[i]));
    const out = [];
    for (let i = 0; i < d.length; i++) {
        const near = Math.max(d[i - 1] ?? 0, d[i + 1] ?? 0);
        if (d[i] > 4 && d[i] > 3 * near) out.push({ i, step: d[i], near });
    }
    return out;
}

test("closing and reopening the pane slides the stage: no layout shift, no jump", async ({ page }) => {
    // Paused, so the die's own turn does not move the box being read.
    await page.goto(at("/cube?play=0"));
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
    await page.waitForTimeout(1500);
    const surface = await page.locator("[data-dock-surface-trigger]").first().getAttribute("data-surface");
    const x0 = await page.evaluate(() => {
        const g = document.querySelector(".graph").getBoundingClientRect();
        return g.left + g.width / 2;
    });

    for (const phase of ["close", "reopen"]) {
        await record(page);
        await pickSurfaceRow(page, surface);
        await page.waitForTimeout(900);
        const r = await stop(page);
        const moved = Math.abs(r.xs.at(-1) - r.xs[0]);
        expect(moved, `${phase}: the stage moves to its new centre`).toBeGreaterThan(100);
        expect(r.shifts, `${phase}: layout shift through the motion`).toBeLessThan(0.01);
        expect(jumps(r.xs), `${phase}: single-frame jumps`).toEqual([]);
        // Several frames carry the travel (a slide, not a cut).
        const steps = r.xs.slice(1).filter((x, i) => Math.abs(x - r.xs[i]) > 0.5).length;
        expect(steps, `${phase}: frames in motion`).toBeGreaterThan(4);
    }
    const x1 = await page.evaluate(() => {
        const g = document.querySelector(".graph").getBoundingClientRect();
        return g.left + g.width / 2;
    });
    expect(Math.abs(x1 - x0)).toBeLessThan(1);
});

test("putting the pane away fades it where it stood, over several frames", async ({ page }) => {
    await page.goto(at("/cube?play=0"));
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
    await page.waitForTimeout(1500);
    const surface = await page.locator("[data-dock-surface-trigger]").first().getAttribute("data-surface");
    // Each frame: the pane frame's box and effective opacity, and the box
    // that clips it (the pane's own port), so a clip that cuts it shows.
    await page.evaluate(() => {
        const R = (window.__pane = { f: [], on: true });
        const tick = () => {
            if (!R.on) return;
            const frame = document.querySelector(".pane-frame");
            const port = document.querySelector(".controls-pane");
            if (frame && port) {
                let o = 1;
                for (let n = frame; n && n.nodeType === 1; n = n.parentElement) {
                    const cs = getComputedStyle(n);
                    o *= Number(cs.opacity);
                    if (cs.visibility === "hidden") o = 0;
                }
                const b = frame.getBoundingClientRect();
                const c = port.getBoundingClientRect();
                const shown = Math.max(0, Math.min(b.right, c.right) - Math.max(b.left, c.left));
                R.f.push({ o, left: b.left, w: b.width, shown });
            } else R.f.push(null);
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
    await pickSurfaceRow(page, surface);
    await page.waitForTimeout(900);
    const f = await page.evaluate(() => {
        window.__pane.on = false;
        return window.__pane.f;
    });
    const start = f.findIndex((t) => t !== null && t.o < 0.98);
    expect(start, "the pane starts to fade").toBeGreaterThan(0);
    const before = f[start - 1];
    for (let i = start; i < f.length; i++) {
        const cur = f[i];
        if (!cur || cur.o <= 0.05) continue;
        // While it shows, it is whole where it stood: not clipped, not moved.
        expect(cur.shown, `frame ${i}: the pane is cut by its own clip`).toBeGreaterThanOrEqual(before.w - 1);
        expect(Math.abs(cur.left - before.left), `frame ${i}: the pane moves`).toBeLessThanOrEqual(1);
    }
    // It leaves over several frames, and is gone at the end.
    const mid = f.slice(start).filter((t) => t !== null && t.o > 0.05 && t.o < 0.95);
    expect(mid.length, "frames in the pane's fade").toBeGreaterThanOrEqual(4);
    expect(f.at(-1)?.o ?? 0).toBeLessThanOrEqual(0.05);
});
