/**
 * Type floors: nothing in the interface is set under 13 px at any width, and
 * text that is read (labels, names, values, body) is 14 px or more. A true
 * caption (an axis tick, a subscript, a key cap) may sit at 13.
 *
 * The census walks every visible text node of each scene, at a phone width
 * with the controls open and at a desk width, and reports the element, its
 * size and its words. Sizes that are glass's own are listed by the census
 * under `glass` and are not the site's to change; the site's own must clear
 * the floor.
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
const OUT = process.env.KF_TYPE_CENSUS_OUT;

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

/**
 * Every visible text run: its font size, its words, and whether glass drew
 * it (the nearest element carrying a glass slot or class) or the site did.
 */
const census = (page) =>
    page.evaluate(() => {
        const rows = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const vw = innerWidth;
        const vh = innerHeight;
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const words = n.textContent.trim();
            if (!words) continue;
            const el = n.parentElement;
            if (!el || el.closest("[aria-hidden=true], .sr-only, [inert], script, style, .monaco-editor")) continue;
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || Number(cs.opacity) === 0) continue;
            const r = document.createRange();
            r.selectNodeContents(n);
            const b = r.getBoundingClientRect();
            if (b.width < 1 || b.height < 1 || b.right < 0 || b.bottom < 0 || b.left > vw || b.top > vh) continue;
            // Glass drew it when the text's own element or its parent is a glass
            // part (a slot, or a glass / dock / slider / configurator class).
            const glass = [el, el.parentElement].some(
                (e) =>
                    !!e &&
                    (e.hasAttribute("data-slot") ||
                        /(^|\s)(glass-|dock-|slider-|configurator|labeled-field|control-)/.test(e.getAttribute("class") ?? "")),
            );
            const role = el.closest("[data-type-role]")?.getAttribute("data-type-role") ?? null;
            rows.push({
                size: Math.round(parseFloat(cs.fontSize) * 10) / 10,
                words: words.slice(0, 40),
                tag: el.tagName.toLowerCase(),
                cls: (el.getAttribute("class") ?? "").split(/\s+/).slice(0, 3).join(" "),
                glass,
                role,
            });
        }
        return rows;
    });

const SCENES = ["/cube", "/easing", "/spring", "/sequence", "/square", "/amiga"];

for (const cell of [
    { name: "phone 390, the controls open", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, q: "?sheet=1" },
    { name: "desk 1440", use: { viewport: { width: 1440, height: 900 } }, q: "" },
]) {
    test.describe(cell.name, () => {
        test.use(cell.use);
        for (const scene of SCENES) {
            test(`${scene}: no site text under 13 px; nothing read under 14 px`, async ({ page }) => {
                await page.goto(at(scene + cell.q));
                await page.waitForSelector(".scene-host", { timeout: 20_000 });
                await page.waitForTimeout(2000);
                const rows = await census(page);
                if (OUT) {
                    fs.mkdirSync(OUT, { recursive: true });
                    fs.writeFileSync(
                        path.join(OUT, `type-${cell.use.viewport.width}${scene.replace(/\//g, "-")}.json`),
                        JSON.stringify(rows, null, 1),
                    );
                }
                const site = rows.filter((r) => !r.glass);
                const under13 = site.filter((r) => r.size < 13);
                const readUnder14 = site.filter((r) => r.size < 14 && r.role !== "caption");
                expect(under13, JSON.stringify(under13.slice(0, 8))).toEqual([]);
                expect(readUnder14, JSON.stringify(readUnder14.slice(0, 8))).toEqual([]);
            });
        }
    });
}

// P2d: on an upright phone the sheet's section titles stand one rung down the
// type scale (glass's subheading, about 20 px), not at the page heading's 26 px.
test.describe("phone 390, the controls open: section titles a rung down", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    for (const scene of ["/sequence", "/spring"]) {
        test(`${scene}: the sheet's section title is 20 px or so, under the 26 px heading`, async ({ page }) => {
            await page.goto(at(scene + "?sheet=1"));
            await page.waitForSelector(".controls-drawer-content .configurator-section-label", { timeout: 20_000 });
            await page.waitForTimeout(1200);
            const sizes = await page.evaluate(() =>
                [...document.querySelectorAll(".controls-drawer-content .configurator-section-label")]
                    .filter((e) => e.getBoundingClientRect().height > 0)
                    .map((e) => parseFloat(getComputedStyle(e).fontSize)),
            );
            expect(sizes.length).toBeGreaterThan(0);
            for (const s of sizes) {
                expect(s).toBeGreaterThanOrEqual(16);
                expect(s).toBeLessThanOrEqual(21);
            }
        });
    }
});
