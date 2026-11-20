/**
 * The slider handle is glass's (owner 2026-11-12, 3.png: "the glass-ui slider
 * thumb should be more filled to the slider, taking up the full height"). The
 * site paints nothing inside it: no smaller disc drawn on the thumb's
 * background, and the thumb stands the track's full height.
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

/** Every visible slider's thumb against its own track. */
const thumbs = (page) =>
    page.$$eval(".glass-slider", (els) =>
        els
            .map((s) => {
                const thumb = s.querySelector(".slider-thumb");
                const track = s.querySelector(".slider-track");
                if (!thumb || !track) return null;
                const t = thumb.getBoundingClientRect();
                const k = track.getBoundingClientRect();
                if (t.width === 0 || k.height === 0) return null;
                const cs = getComputedStyle(thumb);
                const range = s.querySelector(".slider-range");
                return {
                    image: cs.backgroundImage,
                    thumb: t.height,
                    track: k.height,
                    thumbBg: cs.backgroundColor,
                    rangeBg: range ? getComputedStyle(range).backgroundColor : null,
                };
            })
            .filter(Boolean),
    );

for (const cell of [
    { name: "desk 1440", use: { viewport: { width: 1440, height: 900 } } },
    { name: "phone 390", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true } },
]) {
    test.describe(cell.name, () => {
        test.use(cell.use);
        for (const scene of ["/easing", "/spring"]) {
            test(`${scene}: each slider's thumb is glass's, the track's full height, nothing painted inside`, async ({ page }) => {
                await page.goto(at(scene));
                await page.waitForSelector(".glass-slider .slider-thumb", { timeout: 20_000 });
                await page.waitForTimeout(800);
                const all = await thumbs(page);
                expect(all.length).toBeGreaterThan(0);
                for (const t of all) {
                    expect(t.image).toBe("none");
                    expect(Math.abs(t.thumb - t.track)).toBeLessThan(0.75);
                    // The thumb wears the fill's colour: the fill's end is the handle.
                    if (t.rangeBg) expect(t.thumbBg).toBe(t.rangeBg);
                }
            });
        }
    });
}

test.describe("phone 390: the scrub's touch band", () => {
    test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    test("the time scrub answers a finger over a 44 px band", async ({ page }) => {
        await page.goto(at("/cube?sheet=1"));
        await page.waitForSelector('[aria-label="Scrub animation timeline"]', { state: "attached", timeout: 20_000 });
        await page.waitForTimeout(800);
        const band = await page.$eval('[aria-label="Scrub animation timeline"]', (el) =>
            el.closest(".glass-slider")?.getBoundingClientRect().height ?? 0,
        );
        expect(band).toBeGreaterThanOrEqual(44);
    });
});
