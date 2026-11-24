/**
 * The site's share of the dock study (owner, FORTY-SIXTH A: "the dock needs a
 * bit of refinement in animations at the begin and end ... it should not shift
 * around in flow of the page horizontally in animation ... hovering the
 * darkmode toggle or toggling it should not shift it around").
 *
 *   K-1. A page change (Home to the cube, dock open) shows ONE dock whose width
 *        glides: on every frame of the swap each dock's painted width is read
 *        (its View-Transition group's box while it has one, else the live
 *        dock, which the root's new image paints as it stands), and a dock
 *        that changes width passes through widths between its old and its new
 *        one, never from one to the other between two frames. While a dock's
 *        width moves, one plate is painted, never the old dock over the new.
 *        So too a dock glass is opening or folding as the page changes (a
 *        tap on the folded transport's Play held sideways; Play with the
 *        dock open on a phone, glass morphing its seats): it is cut to a
 *        capsule that glides from the width it was painted at.
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

/** Each dock's painted width: its View-Transition group's animated box while
 *  it is a group (with the opacities of its two plate images), less the cut
 *  of a dock that opens as the page changes (the image-pair's `clip-path`
 *  inset, its sides), else the live dock, which the root's new image paints
 *  as it stands. */
const PAINTED = () => {
    // Read when asked: the init script runs before the document has its root.
    const html = () => document.documentElement;
    // A length of the inset (`12px`, `25%`, `calc(25% - 15px)`) against `box`.
    const length = (text, box) => {
        let sum = 0;
        for (const [, sign, n, unit] of text.replace(/calc\(|\)/g, "").matchAll(/([+-]?)\s*(-?[\d.]+)(%|px)/g)) {
            sum += (sign === "-" ? -1 : 1) * (unit === "%" ? (Number(n) * box) / 100 : Number(n));
        }
        return sum;
    };
    // The sides the image-pair's inset cuts from each edge, across.
    const cut = (clip, box) => {
        const inner = /^inset\((.*?)(?:\sround\s.*)?\)$/.exec(clip)?.[1];
        if (!inner) return 0;
        const parts = [];
        let depth = 0;
        let word = "";
        for (const ch of inner) {
            depth += ch === "(" ? 1 : ch === ")" ? -1 : 0;
            if (ch === " " && depth === 0) {
                if (word) parts.push(word);
                word = "";
            } else word += ch;
        }
        if (word) parts.push(word);
        return length(parts[1] ?? parts[0], box);
    };
    const read = (name, sel) => {
        const root = html();
        const group = getComputedStyle(root, `::view-transition-group(${name})`);
        const w = parseFloat(group.width);
        if (root.matches(":active-view-transition") && Number.isFinite(w) && w > 0) {
            const o = (k) => Number(getComputedStyle(root, `::view-transition-${k}(${name})`).opacity);
            const pair = getComputedStyle(root, `::view-transition-image-pair(${name})`);
            const sides = pair.clipPath && pair.clipPath !== "none" ? cut(pair.clipPath, w) : 0;
            // An opening or folding dock's glide starts at the width the swap
            // read it at.
            const at = parseFloat(getComputedStyle(root).getPropertyValue(`--kf-dock-from-${name}`));
            return { w: w - 2 * sides, group: 1, old: o("old"), new: o("new"), ...(Number.isFinite(at) ? { at } : {}) };
        }
        const live = document.querySelector(sel);
        return live ? { w: live.getBoundingClientRect().width, group: 0 } : null;
    };
    window.__painted = () => ({
        top: read("chrome-dock", '[data-dock-tether="top"] .glass-dock'),
        bottom: read("transport-dock", '[data-dock-swap="transport-dock"] .glass-dock'),
    });
    // The swap, read at fixed points of its clock: once its animations run,
    // they are held, set to 0, 1/4, 1/2, 3/4 and the end of their run, the
    // docks read at each, and let go where they were. A headless machine
    // paints a swap's frames 50 to 130 ms apart, so reading frames as they
    // come can miss the glide; reading its clock cannot.
    window.__swap = new Promise((done) => {
        const look = () => {
            const anims = document.getAnimations().filter((a) => a.effect?.pseudoElement?.startsWith("::view-transition"));
            if (!html().matches(":active-view-transition") || !anims.length) return requestAnimationFrame(look);
            const at = anims.map((a) => a.currentTime);
            const end = Math.max(...anims.map((a) => a.effect.getComputedTiming().endTime));
            anims.forEach((a) => a.pause());
            const points = [0, 0.25, 0.5, 0.75, 1].map((f) => {
                anims.forEach((a) => (a.currentTime = f * end));
                return { f, ...window.__painted() };
            });
            anims.forEach((a, i) => {
                a.currentTime = at[i];
                a.play();
            });
            done(points);
        };
        window.__armSwap = () => requestAnimationFrame(look);
    });
};

const CELLS = {
    "1440": { viewport: { width: 1440, height: 900 } },
    "390": { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
    "844x390": { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true },
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

/** The page changes K-1 films: the dock open at a desk (Home to the cube, the
 *  pointer on the dock), the dock open on a phone (the cube to Home by its Home
 *  seat), Home's Play on a phone with the dock folded (the transport grows
 *  from Play's circle to the bar), the same with the dock open (glass morphs
 *  it from Home's seats to the cube's as the page changes), and Home's Play
 *  on a phone held sideways, where the tap has glass opening the folded
 *  transport as the page changes. */
const SWAPS = [
    {
        name: "1440: Home to the cube, the dock open",
        cell: "1440",
        start: "/",
        open: true,
        go: (page) => page.evaluate(() => (location.hash = "#/cube")),
        landed: () => location.hash.startsWith("#/cube"),
    },
    {
        name: "390: the cube to Home by the dock's Home seat",
        cell: "390",
        start: "/cube",
        open: true,
        go: (page) => page.locator("[data-dock-home]").first().tap(),
        landed: () => !location.hash.startsWith("#/cube"),
    },
    {
        name: "390: Home's Play, the dock folded",
        cell: "390",
        start: "/",
        open: false,
        go: (page) => page.locator('[aria-label="Play animation"]').first().tap(),
        landed: () => location.hash.startsWith("#/cube"),
    },
    {
        name: "390: Home's Play with the dock open, glass morphing it",
        cell: "390",
        start: "/",
        open: true,
        go: (page) => page.locator('[aria-label="Play animation"]').first().tap(),
        landed: () => location.hash.startsWith("#/cube"),
    },
    {
        name: "844x390: Home's Play, the tap opening the folded transport",
        cell: "844x390",
        start: "/",
        open: false,
        go: (page) => page.locator('[aria-label="Play animation"]').first().tap(),
        landed: () => location.hash.startsWith("#/cube"),
    },
];

for (const swap of SWAPS) {
    test.describe(swap.name, () => {
        test.use(CELLS[swap.cell]);

        test("K-1. a page change shows one dock per band, whose width glides", async ({ page, context }) => {
            await context.addInitScript(PAINTED);
            await page.goto(at(swap.start));
            await page.waitForSelector("[data-dock-theme]", { state: "attached", timeout: 20_000 });
            await page.waitForTimeout(2500);
            if (swap.open) await openDock(page, swap.cell === "390");
            const before = await page.evaluate(() => window.__painted());
            await page.evaluate(() => window.__armSwap());
            await swap.go(page);
            const points = await page.evaluate(() => window.__swap);
            await page.waitForFunction(swap.landed, null, { timeout: 20_000 });
            let moved = 0;
            for (const key of ["top", "bottom"]) {
                // From where it stood to where the swap leaves it (an open
                // dock may fold after that, by glass's own motion).
                if (!before[key] || !points[4][key]) continue;
                const from = before[key].w;
                const to = points[4][key].w;
                if (Math.abs(to - from) < 8) continue;
                moved++;
                const trace = `${key} dock ${from.toFixed(0)} to ${to.toFixed(0)}: ${points.map((p) => `${p.f}:${p[key].w.toFixed(0)}${p[key].group ? "g" : ""}`).join(" ")}`;
                // It starts where it stood: for a dock glass is opening or
                // folding, where it stood when the swap read it, glass's morph
                // no more than a quarter on from the press (the hold then
                // shows that width)...
                const start = points[0][key].at ?? from;
                if (points[0][key].at !== undefined) expect(Math.abs(start - from), `${trace}; read at ${start.toFixed(0)}`).toBeLessThan(0.25 * Math.abs(to - from));
                expect(Math.abs(points[0][key].w - start), trace).toBeLessThan(2);
                // ...and at a quarter, half and three quarters of the swap's
                // clock it is painted at widths between, in order: a glide,
                // never the old width and then the new one between two frames.
                const mid = points.slice(1, 4).map((p) => p[key].w);
                const lo = Math.min(start, to) + 2;
                const hi = Math.max(start, to) - 2;
                expect(mid.every((w) => w > lo && w < hi), trace).toBe(true);
                expect(mid.every((w, i) => i === 0 || Math.sign(w - mid[i - 1]) === Math.sign(to - from)), trace).toBe(true);
                // While it moves, one plate is painted (one of its two plate
                // images at 0), never the old dock over the new.
                const two = points.slice(1, 4).filter((p) => p[key].group && Math.min(p[key].old, p[key].new) > 0.02);
                expect(two.map((p) => `${p.f}: old ${p[key].old} new ${p[key].new}`), `${key} dock: two plates`).toEqual([]);
            }
            // These pages differ in their docks' seats.
            expect(moved, "docks whose width changed").toBeGreaterThanOrEqual(1);
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
