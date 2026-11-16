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
        expect(Math.max(...lags)).toBeLessThanOrEqual(0);
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
