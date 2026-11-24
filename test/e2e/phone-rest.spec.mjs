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
 * - The sheet leaves by a fade where it stands (Close, and a tap on the
 *   stage): its opacity never rises once it falls, its top edge holds while
 *   it shows, and no shown plate is removed in one frame. Under reduced
 *   motion it arrives and leaves by a short fade, never a cut.
 * - The die's side reaches the screen's width over 2.2 at 390x844 at rest;
 *   the folded top dock is a circle (square within 1 px).
 * - Opened, the controls (the sheet and the dock band under it) take less
 *   than half the height at 390x844, 375x667 and 390x664, on every scene.
 * - A shut sheet on the Keyframes surface fetches no editor chunk; the
 *   Controls press does.
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
                // The page's one scrub is the dock's, 150 px long or more.
                await expect(page.locator('[role="slider"][aria-label="Time"]')).toHaveCount(1);
                const scrub = await page.evaluate(
                    () => document.querySelector('[data-dock-tether="bottom"] .transport-scrub')?.getBoundingClientRect().width ?? 0,
                );
                expect(scrub).toBeGreaterThanOrEqual(150);
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

            // Sample the sheet's top edge and its opacity every frame from the press on.
            await page.evaluate(() => {
                window.__tops = [];
                const tick = () => {
                    const s = document.querySelector(".controls-drawer-content");
                    const b = s?.getBoundingClientRect();
                    window.__tops.push(b && b.height > 0 ? { top: b.top, o: Number(getComputedStyle(s).opacity) } : null);
                    if (window.__tops.length < 90) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
            await seat.tap();
            await page.waitForTimeout(1800);
            // What is seen: a frame the sheet shows in (glass lays a detented
            // sheet out at its floor for its first, unpainted frames).
            const seen = (await page.evaluate(() => window.__tops)).filter((t) => t !== null && t.o > 0.02);
            expect(seen.length).toBeGreaterThanOrEqual(6);
            // It arrives by motion or by glass's fade, never whole in one frame ...
            expect(seen[0].o).toBeLessThan(0.5);
            // ... and no seen frame moves its top edge more than 40 px.
            const tops = seen.map((t) => t.top);
            const steps = tops.slice(1).map((t, i) => Math.abs(t - tops[i]));
            expect(Math.max(0, ...steps)).toBeLessThanOrEqual(40);
            await expect(seat).toHaveAttribute("aria-expanded", "true");
            // One scrub on the page with the sheet open: the pane draws no time row.
            await expect(page.locator('[role="slider"][aria-label="Time"]')).toHaveCount(1);
            await expect(page.locator('[role="slider"][aria-label="Scrub animation timeline"]')).toHaveCount(0);
            expect((await query(page)).sheet).toBe("1");
            expect(await page.evaluate(() => history.length)).toBe(len0 + 1);

            // Play: no entry, the sheet stays.
            const play = page.locator('button[aria-label="Play animation"], button[aria-label="Pause animation"]').first();
            await play.tap();
            await page.waitForTimeout(800);
            expect(await page.evaluate(() => history.length)).toBe(len0 + 1);
            expect(await sheetTop(page)).not.toBeNull();

            // A press on the top dock moves neither the sheet nor the die. On a
            // phone the top dock rests folded: its one seen seat is the face.
            const top0 = await sheetTop(page);
            const die0 = await dieBox(page);
            const dock = page.locator('[data-dock-tether="top"] button:visible').first();
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

        for (const reduced of [false, true]) {
            test(`the sheet leaves by a fade where it stands${reduced ? " (reduced motion)" : ""}`, async ({ page }) => {
                await throttle(page);
                if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
                await page.goto(at("/cube"));
                await page.waitForSelector(".cube", { timeout: 30_000 });
                await page.waitForTimeout(2500);
                const sample = () =>
                    page.evaluate(() => {
                        window.__plate = [];
                        const tick = () => {
                            const s = document.querySelector(".controls-drawer-content");
                            const b = s?.getBoundingClientRect();
                            window.__plate.push(b && b.height > 0 ? { top: b.top, o: Number(getComputedStyle(s).opacity) } : null);
                            if (window.__plate.length < 150) requestAnimationFrame(tick);
                        };
                        requestAnimationFrame(tick);
                    });
                const seat = page.locator('button[aria-label="Controls"]');

                // Arriving: never whole in its first shown frame.
                await sample();
                await seat.tap();
                await page.waitForTimeout(1800);
                const arrive = (await page.evaluate(() => window.__plate)).filter((t) => t !== null && t.o > 0.02);
                expect(arrive.length).toBeGreaterThanOrEqual(3);
                expect(arrive[0].o).toBeLessThan(0.5);

                const closes = [
                    ["Close", () => page.locator('.controls-drawer-content [data-slot="dialog-close"]').tap()],
                    ["a stage tap", () => page.touchscreen.tap(40, 200)],
                ];
                for (const [how, act] of closes) {
                    if (how !== "Close") {
                        await seat.tap();
                        await page.waitForTimeout(1800);
                    }
                    await sample();
                    await page.waitForTimeout(50);
                    await act();
                    await page.waitForTimeout(1600);
                    const f = await page.evaluate(() => window.__plate);
                    const start = f.findIndex((t) => t !== null && t.o < 0.98);
                    expect(start, `${how}: the plate starts to fade`).toBeGreaterThan(0);
                    const top0 = f[start - 1].top;
                    for (let i = start; i < f.length; i++) {
                        const prev = f[i - 1];
                        const cur = f[i];
                        if (prev && prev.o > 0.05) {
                            // A shown plate is never removed in one frame ...
                            expect(cur, `${how}: frame ${i} removes a shown plate`).not.toBeNull();
                            // ... nor shows again once it has started to fall ...
                            expect(cur.o, `${how}: frame ${i} rises`).toBeLessThanOrEqual(prev.o + 0.02);
                        }
                        // ... and while it shows it stands where it stood.
                        if (cur && cur.o > 0.05) expect(Math.abs(cur.top - top0), `${how}: frame ${i} moves`).toBeLessThanOrEqual(2);
                    }
                    // A fade, not a cut: frames between whole and gone.
                    const mid = f.slice(start).filter((t) => t !== null && t.o > 0.05 && t.o < 0.95);
                    expect(mid.length, `${how}: frames in the fade`).toBeGreaterThanOrEqual(2);
                    expect(await sheetTop(page)).toBeNull();
                    await expect(seat).toHaveAttribute("aria-expanded", "false");
                }
            });
        }

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

    // The die's side is bounded by the screen's width, not the padded column
    // (it gives back the page gutter): 390 / 2.2, about 177 px (152 before).
    // Its projected box follows the pose: about 1.2 to 1.3 times the side at
    // rest, so the side is what is held here.
    test("the die's side reaches the screen's width over 2.2 at rest", async ({ page }) => {
        await page.goto(at("/cube"));
        await page.waitForSelector(".cube", { timeout: 30_000 });
        await page.waitForTimeout(2500);
        const side = await page.evaluate(() => document.querySelector(".cube").offsetWidth);
        expect(side).toBeGreaterThanOrEqual(Math.floor(390 / 2.2));
        const d = await dieBox(page);
        expect(d.w).toBeGreaterThanOrEqual(side);
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

test.describe("upright phone 390x844: the opened sheet", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: "dark" });

    const openSheet = async (page, scene) => {
        await page.goto(at(scene));
        await page.waitForSelector(".scene-host", { timeout: 30_000 });
        await page.waitForTimeout(2000);
        await page.locator('button[aria-label="Controls"]').tap();
        await page.waitForTimeout(1500);
    };

    // On a one-channel scene (easing, sequence) Reset (to the start) is a
    // labelled row of its own at the foot of the section the sheet holds
    // (owner, 23 Nov), so the section's header keeps one back glyph: on
    // sequence, the stagger's own reset.
    for (const scene of ["/easing", "/sequence"]) {
        test(`${scene}: Reset is a labelled row of its own at the section's foot`, async ({ page }) => {
            await openSheet(page, scene);
            const seat = await page.evaluate(() => {
                const sheet = document.querySelector(".controls-drawer-content");
                const reset = sheet?.querySelector('button[aria-label="Reset animation"]');
                if (!reset) return null;
                const r = reset.getBoundingClientRect();
                const mid = (r.top + r.bottom) / 2;
                // The section it closes: easing's facet, or the Stagger layer.
                const section = reset.closest('.easing-sidebar, [data-slot="configurator-layer"]') ?? sheet;
                const controls = [...section.querySelectorAll('button, [role="slider"], [role="combobox"], input, .labeled-field')]
                    .filter((e) => e !== reset && !reset.contains(e) && !e.closest('[data-slot="dialog-close"]') && e.getAttribute("data-slot") !== "dialog-close")
                    .map((e) => ({ e, b: e.getBoundingClientRect() }))
                    .filter(({ b }) => b.width > 0 && b.height > 0);
                const name = ({ e, b }) => `${e.tagName.toLowerCase()} ${e.getAttribute("aria-label") ?? e.className} ${Math.round(b.top)}-${Math.round(b.bottom)}`;
                const actions = sheet.querySelector('[data-slot="configurator-layer-actions"]');
                return {
                    section: section === sheet ? null : section.className || section.getAttribute("data-slot"),
                    word: reset.textContent.trim(),
                    resets: sheet.querySelectorAll('button[aria-label="Reset animation"]').length,
                    beside: controls.filter(({ b }) => b.top <= mid && b.bottom >= mid).map(name),
                    below: controls.filter(({ b }) => b.top > r.top + 1).map(name),
                    inHeader: actions ? actions.contains(reset) : false,
                    headerResets: actions ? actions.querySelectorAll('button[aria-label^="Reset"]').length : 0,
                };
            });
            expect(seat).not.toBeNull();
            expect(seat.section).not.toBeNull();
            expect(seat.resets).toBe(1);
            expect(seat.word).toBe("Reset");
            expect(seat.beside).toEqual([]);
            expect(seat.below).toEqual([]);
            expect(seat.inHeader).toBe(false);
            expect(seat.headerResets).toBeLessThanOrEqual(1);
        });
    }

    // On a scene with two or more channels (cube) Reset shares the sheet's
    // head row with the channel select, glyph only.
    for (const scene of ["/cube"]) {
        test(`${scene}: Reset shares its row with another control`, async ({ page }) => {
            await openSheet(page, scene);
            const row = await page.evaluate(() => {
                const sheet = document.querySelector(".controls-drawer-content");
                const reset = sheet?.querySelector('button[aria-label="Reset animation"]');
                if (!reset) return null;
                const r = reset.getBoundingClientRect();
                const mid = (r.top + r.bottom) / 2;
                // A control is a button, a slider, a select or a field; a
                // labelled field (glass's LabeledSlider: its label over its bar,
                // as easing's duration stands) counts whole, since its bar lies
                // below the row's middle.
                const others = [...sheet.querySelectorAll('button, [role="slider"], [role="combobox"], input, .labeled-field')]
                    .filter((e) => e !== reset && !e.closest('[data-slot="dialog-close"]') && e.getAttribute("data-slot") !== "dialog-close")
                    .map((e) => e.getBoundingClientRect())
                    .filter((b) => b.width > 0 && b.top <= mid && b.bottom >= mid);
                return { others: others.length };
            });
            expect(row).not.toBeNull();
            expect(row.others).toBeGreaterThan(0);
        });

        // Reset's glyph takes half its seat, as the site's other glyphs do,
        // wherever the sheet seats it (glass's own Button glyph is smaller).
        test(`${scene}: Reset's glyph takes half its seat`, async ({ page }) => {
            await openSheet(page, scene);
            const size = await page.evaluate(() => {
                const reset = document.querySelector('.controls-drawer-content button[aria-label="Reset animation"]');
                const glyph = reset?.querySelector("svg");
                if (!reset || !glyph) return null;
                return { seat: reset.getBoundingClientRect().height, glyph: glyph.getBoundingClientRect().width };
            });
            expect(size).not.toBeNull();
            expect(Math.abs(size.glyph - size.seat / 2)).toBeLessThanOrEqual(1);
        });
    }
});

// The controls never take half of an upright phone, open or shut: the opened
// sheet and the dock band under it end at the screen's foot, so the sheet's top
// edge stands at half the height or lower. 390x664 is a 390-wide phone in
// Safari with its bars shown; 375x667 the smallest phone in use.
for (const vp of [
    { w: 390, h: 844 },
    { w: 375, h: 667 },
    { w: 390, h: 664 },
]) {
    test.describe(`upright phone ${vp.w}x${vp.h}: the opened sheet leaves the stage the larger part`, () => {
        test.use({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: "dark" });

        for (const scene of ["/cube", "/easing", "/sequence", "/spring"]) {
            test(`${scene}: the controls take less than half the height`, async ({ page }) => {
                await page.goto(at(scene));
                await page.waitForSelector(".scene-host", { timeout: 30_000 });
                await page.waitForTimeout(2000);
                await page.locator('button[aria-label="Controls"]').tap();
                await page.waitForTimeout(1500);
                const top = await sheetTop(page);
                expect(top).not.toBeNull();
                expect(vp.h - top).toBeLessThanOrEqual(vp.h / 2);
            });
        }
    });
}

// A shut sheet loads nothing of the editor: with the Keyframes surface named
// (a link, or the remembered pick), the code editor's chunk is fetched only
// once the Controls press shows the pane, never at rest.
test.describe("upright phone 390x844: a shut sheet loads no editor", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, colorScheme: "dark" });

    test("/cube on the Keyframes surface: no editor chunk at rest; the press fetches it", async ({ page }) => {
        const editor = [];
        page.on("request", (r) => {
            if (/vendor-monaco/.test(r.url())) editor.push(r.url());
        });
        await page.goto(at("/cube?pane=keyframes"));
        await page.waitForSelector(".cube", { timeout: 30_000 });
        await page.waitForTimeout(4000);
        expect(await sheetTop(page)).toBeNull();
        expect(editor).toHaveLength(0);
        await page.locator('button[aria-label="Controls"]').tap();
        await page.waitForTimeout(3000);
        expect(editor.length).toBeGreaterThan(0);
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
