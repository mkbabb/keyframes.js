/**
 * The address is the page (owner, FORTY-SIXTH E, 23 Nov 2026: "we should store
 * page state in the URL, not just in browser session, such that if we go back
 * to a bare keyframes.babb.dev, it should be the homescreen").
 *
 *   1. A bare address opens Home, whatever the last visit was.
 *   2. A scene link with no keys opens the scene at its defaults (its skin, its
 *      channels' options, its clock from rest).
 *   3. Only the theme (a viewer's preference) reaches browser storage.
 *   5. The die's turn is spelled in whole degrees (FORTY-SIXTH F: "what is
 *      the q?"), and only after a turn.
 *
 * Each test is a fresh browser context (fresh storage); a "later visit" is a
 * second page of the same context, which shares the first one's storage.
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

test.use({ viewport: { width: 1440, height: 900 } });

const root = () => (REMOTE ? `${base}/` : `${base}/index.html`);
const at = (hash) => `${root()}#${hash}`;

/** The hash route's query as a plain object ("" and "/" are both the bare route). */
const query = (page) =>
    page.evaluate(() => {
        const h = location.hash.slice(1);
        const i = h.indexOf("?");
        const p = i < 0 ? h : h.slice(0, i);
        return { path: p === "" ? "/" : p, ...Object.fromEntries(new URLSearchParams(i < 0 ? "" : h.slice(i + 1))) };
    });

/** Let the scene bind and any resting replace land (the URL writer waits 160 ms after a value rests). */
const rest = (page, ms = 700) => page.waitForTimeout(ms);

/** The scene the dock names (its Scene trigger's value). */
const sceneShown = (page) =>
    page.evaluate(() => document.querySelector('[aria-label="Scene"][role=combobox]')?.textContent?.trim() ?? null);

/** Every key the page holds in browser storage. */
const storageKeys = (page) =>
    page.evaluate(() => ({ local: Object.keys(localStorage).sort(), session: Object.keys(sessionStorage).sort() }));

/** Open the dock as a hand does (it rests folded), then pick a scene in its list. */
async function pickScene(page, label) {
    const dock = await page.locator(".glass-dock").first().boundingBox();
    await page.mouse.move(dock.x + dock.width / 2, dock.y + dock.height / 2);
    await page
        .waitForFunction(() => !document.querySelector(".glass-dock")?.classList.contains("collapsed"), null, { timeout: 4000 })
        .catch(() => {});
    await page.waitForTimeout(400);
    await page.locator('[aria-label="Scene"][role=combobox]').first().click();
    await page.locator("[role=option]", { hasText: new RegExp(`^\\s*${label}\\s*$`) }).first().click();
}

/** Home's start screen is up and no other scene is mounted. */
async function expectHome(page) {
    expect(await query(page)).toEqual({ path: "/" });
    await expect(page.locator(".hero-band")).toBeVisible();
    expect(await sceneShown(page)).toBe("Home");
    // Easing's catalogue is not on the page.
    expect(await page.locator(".gallery-header").count()).toBe(0);
}

test("1. a bare address opens Home, whatever the last visit was", async ({ page, context }) => {
    await page.goto(at("/easing"));
    await page.waitForSelector(".gallery-header", { timeout: 20_000 });
    await rest(page, 1200);

    // A later visit to the bare address (a new tab of the same browser).
    const later = await context.newPage();
    await later.goto(root());
    await rest(later, 2000);
    await expectHome(later);

    // ...and `#/` the same.
    const again = await context.newPage();
    await again.goto(at("/"));
    await rest(again, 2000);
    await expectHome(again);
});

/** Set the selected channel's duration in the controls pane (open at rest on a desk). */
async function setDuration(page, value) {
    const field = page.getByLabel("duration", { exact: true }).first();
    await field.waitFor({ timeout: 20_000 });
    await field.fill(value);
    await field.press("Enter");
    await field.blur();
    await rest(page);
}

/** Record the spin element's first painted transform from document start. */
const firstSpin = () => {
    const loop = () => {
        const tf = document.querySelector(".cube-stage .cube")?.style.transform;
        if (tf) window.__firstSpin = tf;
        else requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

test("2. a scene link with no keys opens the scene at its defaults", async ({ page, context }) => {
    // A visit that sets the skin and the channel by link, changes Rotations'
    // duration in the pane, lets the die tumble, and leaves the cube.
    await page.goto(at("/cube?skin=daraksha&anim=Matrix"));
    await page.waitForSelector('[data-cube-skin="daraksha"]', { timeout: 20_000 });
    await rest(page, 1200);
    await page.goto(at("/cube"));
    await rest(page, 1200);
    await setDuration(page, "2s");
    await rest(page, 2500);
    await pickScene(page, "Easing");
    await page.waitForSelector(".gallery-header", { timeout: 20_000 });
    await rest(page, 1200);

    // A later visit to the bare cube link.
    await context.addInitScript(firstSpin);
    const later = await context.newPage();
    await later.goto(at("/cube"));
    await later.waitForSelector("[data-cube-skin]", { timeout: 20_000 });
    await rest(later, 2000);
    expect(await later.getAttribute("[data-cube-skin]", "data-cube-skin")).toBe("crayon");
    expect(await later.getByLabel("duration", { exact: true }).first().inputValue()).toBe("5s");
    // The die starts from rest at its start pose, not mid-tumble at the
    // last visit's clock.
    const first = await later.evaluate(() => window.__firstSpin ?? "");
    const y = Number(/rotateY\(([-\d.e]+)turn\)/.exec(first)?.[1] ?? NaN);
    expect(Math.abs(y)).toBeLessThan(0.02);
    // Nothing was written: the address stays the bare route.
    expect(await query(later)).toEqual({ path: "/cube" });
});

test("3. only the theme reaches storage", async ({ page }) => {
    await page.goto(at("/cube?skin=daraksha&anim=Matrix&pane=matrix-controls"));
    await page.waitForSelector('[data-cube-skin="daraksha"]', { timeout: 20_000 });
    await rest(page, 1500);
    // Every scene through the app (the dock's Scene list), each one bound.
    for (const label of ["Amiga", "Square", "Easing", "Spring", "Sequence", "Cube"]) {
        await pickScene(page, label);
        await page.waitForFunction((l) => location.hash.startsWith(`#/${l.toLowerCase()}`), label, { timeout: 20_000 });
        await rest(page, 1500);
    }
    // A channel's duration edited (the controls pane is open on a desk).
    const duration = page.getByLabel("duration", { exact: true }).first();
    if (await duration.count()) {
        await duration.fill("2s");
        await duration.press("Enter");
        await rest(page);
    }
    const keys = await storageKeys(page);
    expect(keys.local.filter((k) => k !== "vueuse-color-scheme")).toEqual([]);
    expect(keys.session).toEqual([]);
});

/** The orbit's attitude off its container (rotate3d axis, angle) as a quaternion. */
const orbitQuat = (page) =>
    page.evaluate(() => {
        const tf = document.querySelector(".graph > div")?.style.transform ?? "";
        const r = /rotate3d\(([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+),\s*([-\d.e]+)deg\)/.exec(tf)?.slice(1).map(Number) ?? [0, 0, 1, 0];
        const n = Math.hypot(r[0], r[1], r[2]) || 1;
        const h = (r[3] * Math.PI) / 360;
        return [(r[0] / n) * Math.sin(h), (r[1] / n) * Math.sin(h), (r[2] / n) * Math.sin(h), Math.cos(h)];
    });
const turnDeg = (a, b) =>
    (2 * Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]))) * 180) / Math.PI;

test("5. the die's turn is whole degrees, and only after a turn", async ({ page }) => {
    await page.goto(at("/cube?play=0"));
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
    await rest(page, 1200);
    expect(await query(page)).toEqual({ path: "/cube", play: "0" });

    // A hand turns the die.
    const box = await page.locator(".cube-stage .cube").first().boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    for (let i = 1; i <= 20; i++) {
        await page.mouse.move(x + i * 8, y + i * 3);
        await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await rest(page, 2500);
    const turned = await query(page);
    expect(turned.q).toBeUndefined();
    expect(turned.turn).toMatch(/^-?\d+,-?\d+,-?\d+$/);

    // Home (a double press on the die) removes it.
    await page.mouse.dblclick(x, y);
    await rest(page, 2500);
    expect((await query(page)).turn).toBeUndefined();

    // His link's attitude (q = -0.532, 0.433, -0.439, 0.58), spelled as a turn.
    const his = [-0.532, 0.433, -0.439, 0.58];
    const n = Math.hypot(...his);
    await page.goto("about:blank");
    await page.goto(at("/cube?turn=-14,87,-87&play=0"));
    await page.waitForFunction(() => /rotate3d/.test(document.querySelector(".graph > div")?.style.transform ?? ""), null, { timeout: 20_000 });
    await rest(page, 2500);
    expect(turnDeg(await orbitQuat(page), his.map((v) => v / n))).toBeLessThan(1);
    expect(await query(page)).toMatchObject({ path: "/cube", turn: "-14,87,-87" });
});

test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });

    test("1. a bare address opens Home, whatever the last visit was", async ({ page, context }) => {
        await page.goto(at("/easing"));
        await page.waitForSelector(".gallery-header", { timeout: 20_000 });
        await rest(page, 1200);
        const later = await context.newPage();
        await later.goto(root());
        await rest(later, 2000);
        await expectHome(later);
    });
});
