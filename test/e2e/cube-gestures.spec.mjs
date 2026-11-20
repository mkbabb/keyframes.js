/**
 * The cube's gesture map, end to end (owner 2026-11-12: "scrolling with
 * multitouch should rotate, not pan. Ensure ALL of our multitouch gestures map
 * to their befitting actions"). Real Chromium input over the built embed slice
 * (the page daraksha.babb.dev/motion frames): a two-finger scroll (a pixel
 * wheel) turns the die and leaves it where it stands; Shift + scroll moves it
 * and turns nothing; a pinch (Ctrl + wheel) zooms it; one finger turns it; two
 * fingers move it and pinch it.
 *
 * Local: serves dist/gh-pages (build it first: npm run gh-pages).
 * KF_GESTURE_BASE=https://keyframes.babb.dev runs it against a deploy.
 */
import { test, expect, chromium } from "@playwright/test";
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
    if (!fs.existsSync(path.join(DIST, "embed", "index.html"))) {
        throw new Error("dist/gh-pages/embed is absent: run `npm run gh-pages` first");
    }
    server = await serveDist(DIST);
    base = server.url;
});

test.afterAll(async () => {
    await server?.close();
});

const embedUrl = () =>
    REMOTE ? `${base}/embed/#/cube?skin=daraksha&scheme=light` : `${base}/embed/index.html#/cube?skin=daraksha&scheme=light`;

/** The orbit's pose off its container's transform: the pan (px), the
 *  attitude as a unit quaternion, the scale. */
const readPose = (page) =>
    page.evaluate(() => {
        const el = document.querySelector(".graph > div");
        const tf = el?.style.transform ?? "";
        const num = (re) => (re.exec(tf)?.slice(1) ?? []).map(Number);
        const [tx = 0, ty = 0, tz = 0] = num(/translate3d\(([-\d.e]+)px,\s*([-\d.e]+)px,\s*([-\d.e]+)px\)/);
        const [ax = 0, ay = 0, az = 1, deg = 0] = num(/rotate3d\(([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+)deg\)/);
        const [s = 1] = num(/scale3d\(([-\d.e]+),/);
        const n = Math.hypot(ax, ay, az) || 1;
        const h = (deg * Math.PI) / 360;
        const die = document.querySelector(".cube")?.getBoundingClientRect();
        return {
            t: [tx, ty, tz],
            q: [(ax / n) * Math.sin(h), (ay / n) * Math.sin(h), (az / n) * Math.sin(h), Math.cos(h)],
            s,
            scrollY: window.scrollY,
            centre: die ? { x: die.left + die.width / 2, y: die.top + die.height / 2 } : null,
        };
    });

const turnDeg = (a, b) => {
    const d = Math.abs(a.q[0] * b.q[0] + a.q[1] * b.q[1] + a.q[2] * b.q[2] + a.q[3] * b.q[3]);
    return (2 * Math.acos(Math.min(1, d)) * 180) / Math.PI;
};
const moved = (a, b) => Math.hypot(b.t[0] - a.t[0], b.t[1] - a.t[1], b.t[2] - a.t[2]);

const frames = (page, n = 6) =>
    page.evaluate(
        (n) =>
            new Promise((done) => {
                let i = 0;
                const step = () => (++i >= n ? done() : requestAnimationFrame(step));
                requestAnimationFrame(step);
            }),
        n,
    );

/** Let the wheel stream end and any settle finish. */
const settle = async (page) => {
    await page.waitForTimeout(450);
    await frames(page, 30);
};

const open = async (page) => {
    await page.goto(embedUrl());
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, {
        timeout: 20_000,
    });
    await frames(page, 10);
    const p = await readPose(page);
    return p.centre;
};

test.describe("desktop: wheel", () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test("a two-finger scroll turns the die and does not move it; the page does not scroll", async ({ page }) => {
        const c = await open(page);
        await page.mouse.move(c.x, c.y);
        const a = await readPose(page);
        for (let i = 0; i < 6; i++) {
            await page.mouse.wheel(4, 10);
            await frames(page, 1);
        }
        await settle(page);
        const b = await readPose(page);
        expect(turnDeg(a, b)).toBeGreaterThan(5);
        expect(moved(a, b)).toBeLessThan(0.5);
        expect(Math.abs(b.s - a.s)).toBeLessThan(1e-6);
        expect(b.scrollY).toBe(a.scrollY);
    });

    test("Shift + scroll moves the die and does not turn it", async ({ page }) => {
        const c = await open(page);
        await page.mouse.move(c.x, c.y);
        const a = await readPose(page);
        await page.keyboard.down("Shift");
        for (let i = 0; i < 4; i++) {
            await page.mouse.wheel(0, 10);
            await frames(page, 1);
        }
        await page.keyboard.up("Shift");
        await settle(page);
        const b = await readPose(page);
        expect(moved(a, b)).toBeGreaterThan(10);
        expect(turnDeg(a, b)).toBeLessThan(0.01);
    });

    test("a pinch (Ctrl + wheel) zooms the die and does not turn it", async ({ page }) => {
        const c = await open(page);
        await page.mouse.move(c.x, c.y);
        const a = await readPose(page);
        await page.keyboard.down("Control");
        await page.mouse.wheel(0, -20);
        await page.keyboard.up("Control");
        await settle(page);
        const b = await readPose(page);
        expect(b.s).toBeGreaterThan(a.s * 1.1);
        expect(turnDeg(a, b)).toBeLessThan(0.01);
    });
});

test.describe("touch", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    const touch = async (page, steps) => {
        const cdp = await page.context().newCDPSession(page);
        try {
            const [first, ...rest] = steps;
            await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: first });
            for (const pts of rest) {
                await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: pts });
                await frames(page, 1);
            }
            // Held still, so the release carries no throw.
            await page.waitForTimeout(150);
            await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        } finally {
            await cdp.detach();
        }
    };

    test("one finger turns the die and does not move it", async ({ page }) => {
        const c = await open(page);
        const a = await readPose(page);
        const steps = [];
        for (let i = 0; i <= 10; i++) steps.push([{ x: c.x + 4 * i, y: c.y + i, id: 1 }]);
        await touch(page, steps);
        await settle(page);
        const b = await readPose(page);
        expect(turnDeg(a, b)).toBeGreaterThan(5);
        expect(moved(a, b)).toBeLessThan(0.5);
    });

    test("two fingers moved together move the die; spread apart they zoom it", async ({ page }) => {
        const c = await open(page);
        const a = await readPose(page);
        const drag = [];
        for (let i = 0; i <= 12; i++)
            drag.push([
                { x: c.x - 30, y: c.y + 3 * i, id: 1 },
                { x: c.x + 30, y: c.y + 3 * i, id: 2 },
            ]);
        await touch(page, drag);
        await settle(page);
        const b = await readPose(page);
        expect(moved(a, b)).toBeGreaterThan(10);
        expect(turnDeg(a, b)).toBeLessThan(1);

        const d = await readPose(page);
        const at = d.centre;
        const pinch = [];
        for (let i = 0; i <= 12; i++)
            pinch.push([
                { x: at.x - 30 - 2 * i, y: at.y, id: 1 },
                { x: at.x + 30 + 2 * i, y: at.y, id: 2 },
            ]);
        await touch(page, pinch);
        await settle(page);
        const e = await readPose(page);
        expect(e.s).toBeGreaterThan(d.s * 1.2);
    });
});

// ── Apple-like direct manipulation (owner 2026-11-15) ──────────────────
// Real Chromium multi-touch (CDP Input.dispatchTouchEvent), read per frame
// by a recorder in the die's document (cube-hand.mjs).
import { SEQUENCE, geometry, installRecorder, owed, parsePose, readHand, replay, sleep, stroke, turn } from "./cube-hand.mjs";

const demoUrl = () => (REMOTE ? `${base}/#/cube` : `${base}/index.html#/cube`);

/** Open a page at `url` with its die ready; returns the cell. */
const cell = async (page, url = embedUrl()) => {
    await page.goto(url);
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
    await page.waitForTimeout(url.includes("/embed") ? 600 : 1800);
    // The demo plays its die on arrival; the slice holds it until Play. Hold
    // the demo's too, so both are asked the same thing (a playing scene's
    // chrome delays a phone's touch by two frames: MARKS CB-13).
    if (!url.includes("/embed")) {
        await page.keyboard.press("Space");
        await page.waitForTimeout(300);
    }
    await installRecorder(page.mainFrame());
    const geom = await geometry(page.mainFrame());
    const cdp = await page.context().newCDPSession(page);
    return { page, geom, cdp, offset: { x: 0, y: 0 } };
};
const record = async (c, steps, settleMs = 1200) => {
    await c.page.evaluate(() => window.__hand.start());
    await sleep(40);
    await replay(c.cdp, c.offset, c.geom, steps);
    await sleep(settleMs);
    return c.page.evaluate(() => window.__hand.stop());
};

test.describe("touch: Apple-like", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    test("one finger tracks 1:1: after each move the die shows the arcball's turn for that point within 2 px", async ({ page }) => {
        const c = await cell(page);
        await page.evaluate(() => window.__hand.start());
        const p0 = { x: c.geom.c.x - 0.45 * c.geom.R, y: c.geom.c.y + 0.1 * c.geom.R };
        const q0 = parsePose(await page.evaluate(() => window.__hand.pose())).q;
        await replay(c.cdp, c.offset, c.geom, [{ type: "touchStart", pts: [{ u: { x: -0.45, y: 0.1 }, id: 1 }], wait: 30 }]);
        let worst = 0;
        for (let i = 1; i <= 16; i++) {
            const u = { x: -0.45 + 0.05 * i, y: 0.1 - 0.012 * i };
            await replay(c.cdp, c.offset, c.geom, [{ type: "touchMove", pts: [{ u, id: 1 }] }]);
            await frames(page, 3);
            const shown = parsePose(await page.evaluate(() => window.__hand.pose())).q;
            const p = { x: c.geom.c.x + u.x * c.geom.R, y: c.geom.c.y + u.y * c.geom.R };
            worst = Math.max(worst, (Math.abs(turn(q0, shown) - owed(c.geom, p0, p)) * c.geom.R) / 2);
        }
        await replay(c.cdp, c.offset, c.geom, [{ type: "touchEnd", pts: [], wait: 0 }]);
        const raw = await page.evaluate(() => window.__hand.stop());
        expect(worst).toBeLessThanOrEqual(2);
        // A move is on screen in the frame it is handled in.
        const moves = raw.ev.filter((e) => e.type === "pointermove");
        const frameOf = (t) => raw.f.filter((f) => f.t <= t).length - 1;
        const lags = moves.map((m) => {
            const w = raw.m.find((x) => x.t >= m.d);
            return w ? frameOf(w.t) - frameOf(m.d) : 99;
        });
        // The median move lands in its own frame and none later than the next
        // (a synthetic touch is acked by a renderer the shared machine can
        // stall for a frame: 1 run in 6 shows one or two such moves, on the
        // build before this change as after).
        const sorted = [...lags].sort((a, b) => a - b);
        expect(sorted[sorted.length >> 1]).toBe(0);
        expect(Math.max(...lags)).toBeLessThanOrEqual(1);
    });

    test("a flick's speed carries at release and decays monotonically to rest", async ({ page }) => {
        const c = await cell(page);
        const raw = await record(c, SEQUENCE.flick, 2600);
        const h = readHand(raw, c.geom);
        expect(h.handRate).toBeGreaterThan(5);
        // The die leaves the finger at the finger's speed (frame noise aside).
        expect(h.carry).toBeGreaterThan(0.8);
        expect(h.carry).toBeLessThan(1.25);
        // Exponential friction: every frame slower than the last (5 % frame-time noise).
        const live = h.rates.slice(1).filter((r) => r > 0.05);
        let rises = 0;
        for (let i = 1; i < live.length; i++) if (live[i] > live[i - 1] * 1.05) rises++;
        expect(rises).toBe(0);
        // It coasts more than its own gesture, and it rests.
        expect(h.coastRad).toBeGreaterThan(turn(h.start.q, h.atUp.q));
        expect(h.restMs).toBeLessThan(2600);
        expect(h.end.sy).toBe(h.start.sy);
    });

    test("a new touch mid-coast stops the die where it stands: no jump, no further travel", async ({ page }) => {
        const c = await cell(page);
        const raw = await record(c, [...SEQUENCE.flick.slice(0, -1), { type: "touchEnd", pts: [], wait: 160 }, { type: "touchStart", pts: [{ u: { x: 0.1, y: 0.2 }, id: 9 }], wait: 300 }, { type: "touchEnd", pts: [] }], 300);
        const downs = raw.ev.filter((e) => e.type === "pointerdown");
        const P = raw.f.map((x) => parsePose(x.tf));
        const iCatch = raw.f.findIndex((x) => x.t >= downs[1].d);
        const inc = [];
        for (let i = 1; i < P.length; i++) inc.push(turn(P[i - 1].q, P[i].q));
        // Coasting before the catch …
        expect(inc[iCatch - 2]).toBeGreaterThan(0.002);
        // … and still after it, to the bit: the frame of the catch at most finishes its own step.
        const after = inc.slice(iCatch + 1).reduce((a, b) => a + b, 0);
        expect(after).toBeLessThan(1e-4);
        expect(inc[iCatch]).toBeLessThanOrEqual(inc[iCatch - 1] * 1.05);
    });

    test("pinch and twist track the two fingers, all at once", async ({ page }) => {
        const c = await cell(page);
        const n = 30;
        const pinch = [{ type: "touchStart", pts: [{ u: { x: -0.3, y: 0 }, id: 1 }, { u: { x: 0.3, y: 0 }, id: 2 }], wait: 8 }];
        for (let i = 1; i <= n; i++) {
            const r = 0.3 + (0.45 * i) / n;
            const a = ((Math.PI / 2) * i) / n;
            pinch.push({
                type: "touchMove",
                pts: [
                    { u: { x: -r * Math.cos(a), y: -r * Math.sin(a) }, id: 1 },
                    { u: { x: r * Math.cos(a), y: r * Math.sin(a) }, id: 2 },
                ],
                wait: 8,
            });
        }
        pinch.push({ type: "touchMove", pts: pinch[pinch.length - 1].pts, wait: 160 });
        const raw = await record(c, [...pinch, { type: "touchEnd", pts: [] }], 900);
        const P = raw.f.map((x) => ({ ...parsePose(x.tf), sy: x.sy, vs: x.vs }));
        const up = raw.ev.find((e) => e.type === "pointerup");
        const held = P[raw.f.findIndex((x) => x.t >= up.d) - 1];
        // Spread 0.6R → 1.5R: 2.5× (2 px of the die's half side).
        expect((Math.abs(held.s - 2.5) * c.geom.side) / 2).toBeLessThanOrEqual(2);
        // Twisted 90°: rolled 90° less the 4° soft dead zone's residue (< 0.2°).
        expect(Math.abs((turn(P[0].q, held.q) * 180) / Math.PI - 90)).toBeLessThan(0.5);
        // The page neither scrolled nor zoomed.
        expect(P.every((p) => p.sy === P[0].sy && p.vs === 1)).toBe(true);
    });

    test("a second finger joining, the first lifting, and a third finger never jump the die", async ({ page }) => {
        const c = await cell(page);
        const A = (x, y) => ({ u: { x, y }, id: 1 });
        const B = (x, y) => ({ u: { x, y }, id: 2 });
        const C3 = (x, y) => ({ u: { x, y }, id: 3 });
        const steps = [{ type: "touchStart", pts: [A(-0.4, 0)], wait: 8 }];
        for (let i = 1; i <= 10; i++) steps.push({ type: "touchMove", pts: [A(-0.4 + 0.03 * i, 0)], wait: 8 });
        steps.push({ type: "touchStart", pts: [A(-0.1, 0), B(0.3, 0.2)], wait: 8 });
        for (let i = 1; i <= 10; i++) steps.push({ type: "touchMove", pts: [A(-0.1, 0.02 * i), B(0.3, 0.2 + 0.02 * i)], wait: 8 });
        steps.push({ type: "touchStart", pts: [A(-0.1, 0.2), B(0.3, 0.4), C3(0, 0.6)], wait: 8 });
        for (let i = 1; i <= 8; i++) steps.push({ type: "touchMove", pts: [A(-0.1 - 0.01 * i, 0.2), B(0.3 + 0.01 * i, 0.4), C3(0, 0.6 + 0.01 * i)], wait: 8 });
        steps.push({ type: "touchEnd", pts: [A(-0.18, 0.2), B(0.38, 0.4)], wait: 8 });
        steps.push({ type: "touchEnd", pts: [B(0.38, 0.4)], wait: 8 });
        for (let i = 1; i <= 10; i++) steps.push({ type: "touchMove", pts: [B(0.38 - 0.03 * i, 0.4)], wait: 8 });
        steps.push({ type: "touchMove", pts: [B(0.08, 0.4)], wait: 160 });
        steps.push({ type: "touchEnd", pts: [] });
        const raw = await record(c, steps, 500);
        expect(raw.ev.some((e) => e.type === "pointercancel")).toBe(false);
        const P = raw.f.map((x) => parsePose(x.tf));
        const d = [];
        for (let i = 1; i < P.length; i++)
            d.push((turn(P[i - 1].q, P[i].q) * c.geom.R) / 2 + Math.hypot(P[i].t[0] - P[i - 1].t[0], P[i].t[1] - P[i - 1].t[1]) + Math.abs(Math.log(P[i].s / P[i - 1].s)) * c.geom.side);
        // A JUMP (RUBRIC): a change more than 3× its neighbours'. The CDP
        // hand moves every 8 ms or more against 8.3 ms frames, so some frames
        // carry no move (a cadence hole, not a stop): a frame's neighbours are
        // the moving frames within ±6, and a jump towers over their median.
        const jumps = d.filter((v, i) => {
            const near = d.slice(Math.max(0, i - 6), i + 7).filter((x, j) => x > 0.05 && j !== Math.min(6, i));
            const med = near.sort((a, b) => a - b)[near.length >> 1] ?? 0;
            return v > 4 && v > 3 * Math.max(med, 1);
        });
        expect(jumps).toEqual([]);
    });

    test("the stage alone takes the touch: touch-action none on it, the page's own touch-action untouched", async ({ page }) => {
        await cell(page);
        const ta = await page.evaluate(() => ({
            stage: getComputedStyle(document.querySelector(".cube-stage")).touchAction,
            body: getComputedStyle(document.body).touchAction,
        }));
        expect(ta.stage).toBe("none");
        expect(ta.body).not.toBe("none");
    });

    test("isomorphism: the demo's cube scene and the slice answer one hand the same", async ({ page }) => {
        const read = async (url) => {
            const c = await cell(page, url);
            const dragRaw = await record(c, SEQUENCE.drag, 500);
            const drag = readHand(dragRaw, c.geom);
            await page.goto("about:blank");
            const c2 = await cell(page, url);
            const flick = readHand(await record(c2, SEQUENCE.flick, 2600), c2.geom);
            // The coast per unit of the hand's own speed (s): gain/k, whatever
            // speed the browser let this hand reach on this page.
            return { drag: turn(drag.start.q, drag.atUp.q), carry: flick.carry, perHand: flick.coastRad / flick.handRate };
        };
        const demo = await read(demoUrl());
        const slice = await read(embedUrl());
        // The same turn under the finger (1°), the same carry and the same coast per unit of throw (10 %).
        expect(Math.abs(demo.drag - slice.drag)).toBeLessThan((1 * Math.PI) / 180);
        expect(Math.abs(demo.carry - slice.carry)).toBeLessThan(0.1);
        expect(Math.abs(demo.perHand - slice.perHand) / slice.perHand).toBeLessThan(0.1);
    });
});

// ── The dock's scrub in view while the die plays (a phone at 4x) ───────
// On an upright phone the transport dock holds the scrub, so its read-back
// runs on every playing frame. It is its own render boundary: a spin and a
// pinch on the playing die drop no frame past 33 ms.
test.describe("touch: the dock scrub playing, 4x", () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    test("a one-finger spin and a pinch on the playing die show no frame over 33 ms", async ({ page }) => {
        await page.goto(demoUrl());
        await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
        await page.waitForTimeout(1800);
        // The dock's scrub is in view and the scene is playing.
        await expect(page.locator('[data-dock-tether="bottom"] [role="slider"][aria-label="Time"]')).toBeVisible();
        await expect(page.locator('button[aria-label="Pause animation"]')).toHaveCount(1);
        const cdp = await page.context().newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await installRecorder(page.mainFrame());
        const geom = await geometry(page.mainFrame());
        const c = { page, geom, cdp, offset: { x: 0, y: 0 } };
        const n = 24;
        const pinch = [{ type: "touchStart", pts: [{ u: { x: -0.3, y: 0 }, id: 1 }, { u: { x: 0.3, y: 0 }, id: 2 }], wait: 16 }];
        for (let i = 1; i <= n; i++) {
            const r = 0.3 + (0.3 * i) / n;
            pinch.push({ type: "touchMove", pts: [{ u: { x: -r, y: 0 }, id: 1 }, { u: { x: r, y: 0 }, id: 2 }], wait: 16 });
        }
        pinch.push({ type: "touchEnd", pts: [] });
        const spin = stroke({ x: -0.45, y: 0.1 }, { x: 0.35, y: -0.15 }, 24, 16, 120);
        const raw = await record(c, [...spin.slice(0, -1), { type: "touchEnd", pts: [], wait: 200 }, ...pinch], 300);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
        const down = raw.ev.find((e) => e.type === "pointerdown");
        const up = [...raw.ev].reverse().find((e) => e.type === "pointerup");
        const inHand = raw.f.filter((f) => f.t >= down.d && f.t <= up.d + 34);
        const gaps = inHand.slice(1).map((f, i) => f.t - inHand[i].t);
        expect(gaps.length).toBeGreaterThan(20);
        const long = gaps.filter((g) => g > 33.4);
        expect(long, `frames over 33 ms: ${long.map((g) => g.toFixed(1)).join(", ")}`).toEqual([]);
    });
});

test.describe("desktop: Apple-like", () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test("a trackpad scroll flows: no stalled frame while the stream runs, and the sum lands", async ({ page }) => {
        const c = await cell(page);
        await page.mouse.move(c.geom.c.x, c.geom.c.y);
        await page.evaluate(() => window.__hand.start());
        const ds = [];
        for (let i = 0; i < 20; i++) ds.push(Math.min(12, 2 + i));
        for (let d = 12; d > 0.5; d *= 0.9) ds.push(d);
        for (const dy of ds) {
            await c.cdp.send("Input.dispatchMouseEvent", { type: "mouseWheel", x: c.geom.c.x, y: c.geom.c.y, deltaX: 0, deltaY: dy, button: "none" });
            await sleep(11);
        }
        await sleep(500);
        const raw = await page.evaluate(() => window.__hand.stop());
        const P = raw.f.map((x) => parsePose(x.tf));
        const inc = [];
        for (let i = 1; i < P.length; i++) inc.push(turn(P[i - 1].q, P[i].q));
        const first = inc.findIndex((x) => x > 0);
        const live = inc.slice(first, first + 30);
        expect(live.filter((x) => x === 0).length).toBe(0);
        const want = (2 * ds.reduce((a, b) => a + b, 0)) / c.geom.R;
        expect(Math.abs(turn(P[0].q, P[P.length - 1].q) - want)).toBeLessThan(0.01);
    });

    test("arrow keys turn the die on a glide; a double-click brings it home on the spring", async ({ page }) => {
        const c = await cell(page);
        await page.mouse.click(c.geom.c.x + c.geom.R * 0.6, c.geom.c.y);
        await frames(page, 4);
        const a = parsePose(await page.evaluate(() => window.__hand.pose()));
        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(800);
        const b = parsePose(await page.evaluate(() => window.__hand.pose()));
        expect((turn(a.q, b.q) * 180) / Math.PI).toBeCloseTo(15, 1);
        await page.evaluate(() => window.__hand.start());
        await page.mouse.dblclick(c.geom.c.x, c.geom.c.y);
        await page.waitForTimeout(1200);
        const raw = await page.evaluate(() => window.__hand.stop());
        const P = raw.f.map((x) => parsePose(x.tf));
        const end = P[P.length - 1];
        expect(turn(end.q, [0, 0, 0, 1])).toBeLessThan(1e-6);
        // It travelled home over frames (a spring), never in one.
        const steps = [];
        for (let i = 1; i < P.length; i++) steps.push(turn(P[i - 1].q, P[i].q));
        expect(steps.filter((s) => s > 0).length).toBeGreaterThan(6);
        expect(Math.max(...steps)).toBeLessThan(turn(b.q, [0, 0, 0, 1]) * 0.25);
    });
});

// ── No ring on the stage (owner 2026-11-16) ─────────────────────────────
// "this area doesn't need a focus ring/clickable ring" (shots/125.png: the
// stage's keyboard ring drawn round Daraksha's Motion card). The stage keeps
// focus for the arrow keys and paints nothing for it, on a press, a tap or a
// key; the key still turns the die.
test.describe("the stage paints no ring", () => {
    const ring = (page) =>
        page.evaluate(() => {
            const el = document.querySelector(".cube-stage");
            const s = getComputedStyle(el);
            return {
                focused: document.activeElement === el,
                focusVisible: el.matches(":focus-visible"),
                outline: s.outlineStyle === "none" || parseFloat(s.outlineWidth) === 0 ? "none" : `${s.outlineStyle} ${s.outlineWidth}`,
                shadow: s.boxShadow,
            };
        });
    for (const where of ["slice", "demo"]) {
        test(`${where}: a press, a key or a tap paints no ring, and the arrows still turn the die`, async ({ browser }) => {
            const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
            try {
                const page = await ctx.newPage();
                const c = await cell(page, where === "slice" ? embedUrl() : demoUrl());
                await page.mouse.click(c.geom.c.x + c.geom.R * 0.6, c.geom.c.y);
                await frames(page, 4);
                const pressed = await ring(page);
                expect(pressed.focused).toBe(true);
                expect(pressed.outline).toBe("none");
                expect(pressed.shadow).toBe("none");
                const a = parsePose(await page.evaluate(() => window.__hand.pose()));
                await page.keyboard.press("ArrowRight");
                await page.waitForTimeout(800);
                const b = parsePose(await page.evaluate(() => window.__hand.pose()));
                expect((turn(a.q, b.q) * 180) / Math.PI).toBeCloseTo(15, 1);
                const keyed = await ring(page);
                // The key put the stage in the keyboard's focus state: the ring's own trigger.
                expect(keyed.focusVisible).toBe(true);
                expect(keyed.outline).toBe("none");
                expect(keyed.shadow).toBe("none");
                await page.touchscreen.tap(c.geom.c.x - c.geom.R * 0.6, c.geom.c.y);
                await frames(page, 4);
                const tapped = await ring(page);
                expect(tapped.outline).toBe("none");
                expect(tapped.shadow).toBe("none");
            } finally {
                await ctx.close();
            }
        });
    }
});

// ── No stray face (coordinator 2026-11-15) ──────────────────────────────
// A coast once drew face 1 wrong for a frame: a turned-away face as a sliver
// beside the die, or a pale quad across the stage (after-dk-390-flick-coast
// .jpg at 984 ms), at fixed orientations on the GPU lane, never in a still.
// Cause: a resident `will-change: transform` on the orbit container (a layer
// boundary inside `.graph`'s 3D context). Here the die is spun live (the
// recorded hard flick, then a full turn about x, y and z at speed and one
// about the flick's own axis) while every compositor frame is kept; each frame
// must match the bare ground everywhere outside the die's projected box at
// the pose it shows, and no face's box may leave the stage.
import { PNG } from "pngjs";

const GPU = ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"];

/** In the die's document: write a pose, read the faces' boxes, hide the die, sweep a turn. */
const installStage = (page) =>
    page.evaluate(() => {
        const el = () => document.querySelector(".graph > div");
        const frames2 = () =>
            new Promise((r) =>
                requestAnimationFrame(() => requestAnimationFrame(r)),
            );
        // THE FRAME'S OWN POSE (KF-URL, 2026-11-16): each pose write stamps its
        // index into a 6 px marker in the stage's corner, in the same task (the
        // observer's microtask runs before that frame renders), so the two
        // reach the screen in one commit and every captured frame names the
        // write it shows. The frame's capture time does not: this page's frames
        // reach the screen 2-3 frames after they are made (16-28 ms), so the
        // write before the capture time was often a later pose than the one
        // shown, and the die's own edge, 10-15° on in the x turn, was counted
        // as a stray face.
        const MARK = 6;
        const markColour = (i) => `rgb(${((i >> 8) & 15) * 16 + 8}, ${((i >> 4) & 15) * 16 + 8}, ${(i & 15) * 16 + 8})`;
        window.__stage = {
            writes: [],
            mo: null,
            mark: null,
            watch() {
                this.writes = [
                    {
                        e: performance.timeOrigin + performance.now(),
                        tf: el().style.transform,
                    },
                ];
                this.mark = document.createElement("div");
                this.mark.style.cssText = `position:fixed;left:0;top:0;width:${MARK}px;height:${MARK}px;z-index:2147483647;pointer-events:none;background:${markColour(0)}`;
                document.body.append(this.mark);
                this.mo = new MutationObserver(() => {
                    this.writes.push({
                        e: performance.timeOrigin + performance.now(),
                        tf: el().style.transform,
                    });
                    this.mark.style.background = markColour(this.writes.length - 1);
                });
                this.mo.observe(el(), {
                    attributes: true,
                    attributeFilter: ["style"],
                });
            },
            unwatch() {
                this.mo?.disconnect();
                this.mark?.remove();
                return this.writes;
            },
            put(tf) {
                el().style.transform = tf;
                return frames2();
            },
            faces() {
                return [...document.querySelectorAll(".cube-side")].map((f) => {
                    const r = f.getBoundingClientRect();
                    return { x0: r.left, y0: r.top, x1: r.right, y1: r.bottom };
                });
            },
            hide(on) {
                document.querySelector(".cube").style.visibility = on
                    ? "hidden"
                    : "";
                return frames2();
            },
            turn(axis, ms) {
                return new Promise((done) => {
                    let t0 = 0;
                    const step = (t) => {
                        t0 ||= t;
                        const k = Math.min(1, (t - t0) / ms);
                        el().style.transform = `translate3d(0px, 0px, 0px) rotate3d(${axis.join(", ")}, ${(k * 360).toFixed(3)}deg) scale3d(1, 1, 1)`;
                        if (k < 1) requestAnimationFrame(step);
                        else done();
                    };
                    requestAnimationFrame(step);
                });
            },
        };
    });

/** Spin the die by `drive` while keeping every compositor frame; return the frames with the pose each shows. */
const spinFilmed = async (page, cdp, drive) => {
    const casts = [];
    const onFrame = (fr) => {
        casts.push({ e: fr.metadata.timestamp * 1000, data: fr.data });
        cdp.send("Page.screencastFrameAck", { sessionId: fr.sessionId }).catch(
            () => {},
        );
    };
    cdp.on("Page.screencastFrame", onFrame);
    await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
    try {
        await sleep(250);
        await page.evaluate(() => window.__stage.hide(true));
        await sleep(250);
        const ground = casts[casts.length - 1];
        await page.evaluate(() => window.__stage.hide(false));
        await sleep(150);
        casts.length = 0;
        await page.evaluate(() => window.__stage.watch());
        await drive();
        await sleep(150);
        const writes = await page.evaluate(() => window.__stage.unwatch());
        return { ground, casts: casts.slice(), writes };
    } finally {
        await cdp.send("Page.stopScreencast").catch(() => {});
        cdp.off("Page.screencastFrame", onFrame);
    }
};

/** Judge every frame: pixels outside the die's box (+3 px) that differ from the ground, and faces outside the stage. */
const judge = async (page, film, label) => {
    const vw = page.viewportSize().width;
    const vh = page.viewportSize().height;
    const g = PNG.sync.read(Buffer.from(film.ground.data, "base64"));
    const k = g.width / vw;
    const boxes = new Map();
    const bad = [];
    const facesAt = async (tf) => {
        if (!boxes.has(tf)) {
            await page.evaluate((x) => window.__stage.put(x), tf);
            boxes.set(tf, await page.evaluate(() => window.__stage.faces()));
        }
        return boxes.get(tf);
    };
    const boxOf = (faces) => ({
        x0: (Math.min(...faces.map((f) => f.x0)) - 3) * k,
        y0: (Math.min(...faces.map((f) => f.y0)) - 3) * k,
        x1: (Math.max(...faces.map((f) => f.x1)) + 3) * k,
        y1: (Math.max(...faces.map((f) => f.y1)) + 3) * k,
    });
    // The marker (installStage): read at its centre, each channel a 4-bit digit.
    const MARK = 6;
    const markOf = (img) => {
        const at = Math.round((MARK / 2) * k);
        const i = (at * img.width + at) * 4;
        const digit = (v) => {
            const d = (v - 8) / 16;
            return Math.abs(d - Math.round(d)) < 0.2 && d > -0.5 && d < 15.5 ? Math.round(d) : null;
        };
        const [r, gg, b] = [digit(img.data[i]), digit(img.data[i + 1]), digit(img.data[i + 2])];
        return r === null || gg === null || b === null ? null : (r << 8) | (gg << 4) | b;
    };
    let marked = 0;
    for (const c of film.casts) {
        const img = PNG.sync.read(Buffer.from(c.data, "base64"));
        // The frame is judged at exactly the pose it shows (its marker); no
        // union with a neighbouring write, no window.
        const m = markOf(img);
        const i = m !== null && film.writes[m] ? m : -1;
        if (i < 0) continue;
        marked++;
        const w = film.writes[i];
        const faces = await facesAt(w.tf);
        const out = faces.filter((f) => f.x0 < -0.5 || f.y0 < -0.5 || f.x1 > vw + 0.5 || f.y1 > vh + 0.5).length;
        const b = boxOf(faces);
        let n = 0;
        const markPx = Math.ceil(MARK * k) + 1;
        for (let y = 0; y < Math.min(img.height, g.height); y++)
            for (let x = 0; x < Math.min(img.width, g.width); x++) {
                if (x < markPx && y < markPx) continue;
                if (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) continue;
                const i = (y * img.width + x) * 4;
                const j = (y * g.width + x) * 4;
                if (Math.max(Math.abs(img.data[i] - g.data[j]), Math.abs(img.data[i + 1] - g.data[j + 1]), Math.abs(img.data[i + 2] - g.data[j + 2])) > 40) n++;
            }
        if (n > 40 || out)
            bad.push({ label, stray: n, facesOutOfStage: out, tf: w.tf, png: bad.length < 4 ? c.data : undefined, ground: bad.length ? undefined : film.ground.data });
    }
    return { frames: film.casts.length, marked, bad };
};

test.describe("touch: no stray face", () => {
    test.setTimeout(240_000);

    for (const where of ["slice", "demo"]) {
        test(`${where}: a hard flick and a full turn on each axis draw nothing outside the die, and no face leaves the stage`, async () => {
            // The GPU lane (the fault is the compositor's): one browser for the test, closed in finally.
            const browser = await chromium.launch({ args: GPU });
            try {
                const ctx = await browser.newContext({
                    viewport: { width: 390, height: 844 },
                    deviceScaleFactor: 2,
                    hasTouch: true,
                    isMobile: true,
                });
                const page = await ctx.newPage();
                const c = await cell(
                    page,
                    where === "slice" ? embedUrl() : demoUrl(),
                );
                await installStage(page);
                const results = [];
                // The recorded hard flick (1.6 R in 90 ms, more than a turn of coast) along the hand's own path.
                const flick = await spinFilmed(page, c.cdp, async () => {
                    await replay(
                        c.cdp,
                        c.offset,
                        c.geom,
                        stroke(
                            { x: -0.8, y: 0.05 },
                            { x: 0.8, y: -0.05 },
                            11,
                            8,
                            0,
                        ),
                    );
                    await sleep(2600);
                });
                results.push(await judge(page, flick, "hard flick"));
                // Until the coast's tail rests (a hard flick coasts ~2.2 s at
                // k = 3, longer on a slow run): the turns below must be the only
                // writer of the pose, or a frame shows the coast's pose and is
                // judged at the turn's.
                await page.waitForFunction(
                    () =>
                        new Promise((done) => {
                            const el = document.querySelector(".graph > div");
                            const tf = el.style.transform;
                            let n = 0;
                            const step = () => (el.style.transform !== tf ? done(false) : ++n >= 20 ? done(true) : requestAnimationFrame(step));
                            requestAnimationFrame(step);
                        }),
                    null,
                    { timeout: 8000, polling: 50 },
                );
                // A full turn about x, y and z at speed, and one about the coast's
                // axis (where the stray face was found) at the coast's own pace.
                for (const [axis, ms] of [
                    [[1, 0, 0], 600],
                    [[0, 1, 0], 600],
                    [[0, 0, 1], 600],
                    [[-0.0365, -0.9199, -0.3904], 2000],
                ]) {
                    const film = await spinFilmed(page, c.cdp, () =>
                        page.evaluate(
                            ([a, t]) => window.__stage.turn(a, t),
                            [axis, ms],
                        ),
                    );
                    results.push(
                        await judge(page, film, `turn ${axis.join(",")}`),
                    );
                }
                const frameCount = results.reduce((a, r) => a + r.frames, 0);
                const markedCount = results.reduce((a, r) => a + r.marked, 0);
                const bad = results.flatMap((r) => r.bad);
                test.info().annotations.push({
                    type: "stray-face",
                    description: `${frameCount} frames, ${markedCount} judged at their own pose; ${bad.length} stray`,
                });
                expect(frameCount).toBeGreaterThan(150);
                // Every frame names its pose (a frame whose marker cannot be read is not judged).
                expect(markedCount).toBeGreaterThan(frameCount * 0.95);
                // The stray frames and the ground beside the failure, to look at.
            for (const [i, b] of bad.entries()) {
                if (b.png) fs.writeFileSync(test.info().outputPath(`stray-${i}.png`), Buffer.from(b.png, "base64"));
                if (b.ground) fs.writeFileSync(test.info().outputPath("ground.png"), Buffer.from(b.ground, "base64"));
            }
            const brief = bad.map(({ png, ground, ...b }) => b);
            expect(brief, JSON.stringify(brief.slice(0, 5))).toEqual([]);
            } finally {
                await browser.close();
            }
        });
    }
});
