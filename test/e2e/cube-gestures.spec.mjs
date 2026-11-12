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
