/**
 * Every page's state in the URL (owner 2026-11-15: "Each page should have state
 * defined in the URL, like with fourier for the currently selected picture,
 * background showing, etc."). A copied link reopens the same view; a
 * continuous change (a parameter, the die's turn) replaces the history entry
 * and a discrete pick pushes one; Back and Forward walk the views; a default
 * view's URL is the bare route; a scene's keys never leak into the next scene.
 *
 * Local: serves dist/gh-pages (build it first: npm run gh-pages).
 * KF_GESTURE_BASE=https://keyframes.babb.dev runs it against a deploy.
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

test.use({ viewport: { width: 1440, height: 900 } });

const at = (hash) => (REMOTE ? `${base}/#${hash}` : `${base}/index.html#${hash}`);

/** The hash route's query as a plain object. */
const query = (page) =>
    page.evaluate(() => {
        const h = location.hash.slice(1);
        const i = h.indexOf("?");
        return { path: i < 0 ? h : h.slice(0, i), ...Object.fromEntries(new URLSearchParams(i < 0 ? "" : h.slice(i + 1))) };
    });

/** Let the scene bind and any resting replace land (the URL writer waits 160 ms after a value rests). */
const rest = (page, ms = 700) => page.waitForTimeout(ms);

/** The spring facet's two parameters, read off their sliders by the word each is named by. */
const springSliders = (page) =>
    page.$$eval(".param-row [role=slider][aria-labelledby]", (els) =>
        els
            .map((e) => [document.getElementById(e.getAttribute("aria-labelledby"))?.textContent?.trim(), Number(e.getAttribute("aria-valuenow"))])
            .filter(([name]) => name === "response" || name === "damping")
            .map(([, v]) => v),
    );

/** The orbit's attitude off its container (rotate3d axis, angle) and scale. */
const orbit = (page) =>
    page.evaluate(() => {
        const tf = document.querySelector(".graph > div")?.style.transform ?? "";
        const r = /rotate3d\(([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+)deg\)/.exec(tf)?.slice(1).map(Number) ?? [0, 0, 1, 0];
        const s = Number(/scale3d\(([-\d.e]+),/.exec(tf)?.[1] ?? 1);
        const n = Math.hypot(r[0], r[1], r[2]) || 1;
        const h = (r[3] * Math.PI) / 360;
        return { q: [(r[0] / n) * Math.sin(h), (r[1] / n) * Math.sin(h), (r[2] / n) * Math.sin(h), Math.cos(h)], s };
    });
const turnDeg = (a, b) =>
    (2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180) / Math.PI;

test("a default view's URL is the bare route: nothing is written on load", async ({ page }) => {
    for (const scene of ["/cube", "/easing", "/spring", "/sequence", "/square"]) {
        await page.goto(at(scene));
        await rest(page, 1500);
        expect(await query(page)).toEqual({ path: scene });
    }
});

/** Open a link as a fresh load (a link pasted into a new tab), not a same-document hash change. */
const openLink = async (page, hash) => {
    await page.goto("about:blank");
    await page.goto(at(hash));
};

test("a copied link reopens the same view (spring, easing, sequence)", async ({ page }) => {
    await openLink(page, "/spring?r=0.3&df=0.5");
    await rest(page);
    expect(await springSliders(page)).toEqual([0.3, 0.5]);
    expect(await query(page)).toMatchObject({ path: "/spring", r: "0.3", df: "0.5" });

    await openLink(page, "/easing?e=cubic-bezier&bz=0.1,0.8,0.3,1&d=900");
    await rest(page);
    const easing = await query(page);
    expect(easing).toMatchObject({ e: "cubic-bezier", bz: "0.1,0.8,0.3,1", d: "900" });

    // A key the scene cannot take is never applied: the view stays the default
    // and the address is corrected to it.
    await openLink(page, "/easing?e=not-an-easing");
    await rest(page);
    expect(await query(page)).toEqual({ path: "/easing" });

    await openLink(page, "/sequence?at=0,100,900,300,1200");
    await rest(page);
    expect(await query(page)).toMatchObject({ at: "0,100,900,300,1200" });
});

test("the cube's link carries its turn and zoom, reached on the spring (never a cut)", async ({ page }) => {
    // 60° about y (the turn key, whole degrees), zoom 1.4.
    const h = (60 * Math.PI) / 360;
    const q = [0, Math.sin(h), 0, Math.cos(h)];
    await page.goto(at(`/cube?turn=0,60,0&z=1.4&play=0`));
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""));
    // Sample the travel: it moves over several frames, not in one.
    const poses = await page.evaluate(
        () =>
            new Promise((done) => {
                const out = [];
                const t0 = performance.now();
                const f = () => {
                    out.push(document.querySelector(".graph > div").style.transform);
                    if (performance.now() - t0 < 2500) requestAnimationFrame(f);
                    else done(out);
                };
                requestAnimationFrame(f);
            }),
    );
    expect(new Set(poses).size).toBeGreaterThan(3);
    await rest(page);
    const o = await orbit(page);
    expect(turnDeg(o.q, q)).toBeLessThan(0.5);
    expect(o.s).toBeCloseTo(1.4, 2);
    expect(await page.getByRole("button", { name: "Play animation" }).count()).toBe(1);
    expect(await query(page)).toMatchObject({ path: "/cube", turn: "0,60,0", z: "1.4", play: "0" });
});

test("a turn of the die replaces the entry; a pick pushes one; Back and Forward walk the views", async ({ page }) => {
    await page.goto(at("/spring"));
    await rest(page);
    const len0 = await page.evaluate(() => history.length);

    // A continuous change: the response slider, by keyboard.
    const slider = page.locator(".param-row [role=slider][aria-labelledby]").first();
    await slider.focus();
    for (let i = 0; i < 3; i++) await page.keyboard.press("ArrowRight");
    await rest(page);
    const after = await query(page);
    expect(after.r).toBeDefined();
    expect(await page.evaluate(() => history.length)).toBe(len0);

    // A discrete move (another scene) pushes; Back restores the spring's view.
    await page.goto(at("/easing?e=ease-in"));
    await rest(page);
    await page.goBack();
    await rest(page);
    expect(await query(page)).toMatchObject({ path: "/spring", r: after.r });
    expect((await springSliders(page))[0]).toBeCloseTo(Number(after.r), 3);
    await page.goForward();
    await rest(page);
    expect(await query(page)).toMatchObject({ path: "/easing", e: "ease-in" });
});

test("a scene's keys never travel into the next scene", async ({ page }) => {
    await page.goto(at("/cube?skin=daraksha&z=1.2&play=0"));
    await rest(page, 1500);
    // Switch scene through the app (the dock's Scene select), not by typing a
    // URL. The dock rests collapsed; a pointer over it opens it, as a hand does.
    const dock = await page.locator(".glass-dock").first().boundingBox();
    await page.mouse.move(dock.x + dock.width / 2, dock.y + dock.height / 2);
    await page
        .waitForFunction(() => !document.querySelector(".glass-dock")?.classList.contains("collapsed"), null, { timeout: 4000 })
        .catch(() => {});
    await page.waitForTimeout(400);
    await page.locator('[aria-label="Scene"][role=combobox]').first().click();
    await page.locator("[role=option]", { hasText: /^\s*Easing\s*$/ }).first().click();
    await page.waitForFunction(() => location.hash.startsWith("#/easing"));
    await rest(page, 1500);
    const q = await query(page);
    expect(q.path).toBe("/easing");
    expect(q.skin).toBeUndefined();
    expect(q.z).toBeUndefined();
    await page.goBack();
    await rest(page, 1500);
    expect(await query(page)).toMatchObject({ path: "/cube", skin: "daraksha", z: "1.2" });
});

test("a cold link to the Matrix surface opens it and keeps the link", async ({ page }) => {
    for (const hash of ["/cube?anim=Matrix&pane=matrix-controls", "/cube?anim=Matrix&pane=matrix-controls&play=0"]) {
        await openLink(page, hash);
        await rest(page, 1500);
        expect(await query(page)).toMatchObject({ path: "/cube", anim: "Matrix", pane: "matrix-controls" });
        await expect(page.getByRole("group", { name: "Matrix entries" })).toBeVisible();
    }
});

test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });

    test("a cold load leaves the controls closed: the stage has half the screen or more", async ({ page }) => {
        await openLink(page, "/cube");
        await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
        await rest(page, 1500);
        expect(await query(page)).toEqual({ path: "/cube" });
        const free = await freeStage(page);
        expect(free.w).toBeGreaterThanOrEqual(388);
        expect(free.heightShare).toBeGreaterThanOrEqual(0.49);
    });

    test("a link that opens the Keyframes surface lights no ring on its panel", async ({ page }) => {
        await openLink(page, "/cube?pane=keyframes&sheet=1");
        await page.waitForSelector('[data-surface-panel][aria-label="Keyframes"]', { timeout: 20_000 });
        await rest(page, 1500);
        const ring = await page.$eval('[data-surface-panel][aria-label="Keyframes"]', (el) => {
            const cs = getComputedStyle(el);
            return { style: cs.outlineStyle, width: cs.outlineWidth, shadow: cs.boxShadow };
        });
        expect(ring.style === "none" || ring.width === "0px").toBe(true);
        expect(ring.shadow).toBe("none");
    });

    test("a tap that lowers the sheet adds no entry: Back leaves the view", async ({ page }) => {
        await page.goto(at("/"));
        await rest(page, 1200);
        // Into the cube as a visitor goes, by a link that opens the controls:
        // one discrete move, one entry.
        await page.evaluate(() => (location.hash = "#/cube?sheet=1"));
        await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
        await rest(page, 1500);
        const len0 = await page.evaluate(() => history.length);

        // A tap on the die lowers the sheet: the view's state, written in place
        // (closed is a phone's rest, so the key leaves the link).
        const g = await page.evaluate(() => {
            const r = document.querySelector(".graph").getBoundingClientRect();
            return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
        await page.touchscreen.tap(g.x + 60, g.y);
        await rest(page);
        expect(await query(page)).toEqual({ path: "/cube" });
        expect(await page.evaluate(() => history.length)).toBe(len0);

        // Back leaves the cube; it does not raise the sheet again.
        await page.goBack();
        await rest(page);
        expect((await query(page)).path).toBe("/");
    });
});
