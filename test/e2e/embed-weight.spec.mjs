/**
 * The embedded die (daraksha's Motion page frames `embed/#/cube`) carries what
 * it draws. It shows a die and glyph buttons, no running text, so its
 * stylesheet carries no inlined font corpus: glass's faces come as files, fetched
 * only if a glyph of theirs is drawn.
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

const embedUrl = () => (REMOTE ? `${base}/embed/#/cube?skin=daraksha` : `${base}/embed/index.html#/cube?skin=daraksha`);

test.use({ viewport: { width: 390, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });

test("the slice's stylesheet carries no inlined font corpus", async ({ page }) => {
    await page.goto(embedUrl());
    await page.waitForSelector(".cube", { timeout: 20_000 });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
        let inlined = 0;
        for (const sheet of document.styleSheets) {
            let rules;
            try {
                rules = sheet.cssRules;
            } catch {
                continue;
            }
            const walk = (list) => {
                for (const rule of list) {
                    if (rule instanceof CSSFontFaceRule && /data:/.test(rule.style.getPropertyValue("src"))) inlined++;
                    if (rule.cssRules) walk(rule.cssRules);
                }
            };
            walk(rules);
        }
        const css = performance
            .getEntriesByType("resource")
            .filter((e) => /\.css(\?|$)/.test(e.name))
            .reduce((n, e) => n + e.decodedBodySize, 0);
        return { inlined, css };
    });
    expect(r.inlined).toBe(0);
    // The slice's CSS was 517 KB with the corpus (133 KB of it base64 fonts).
    expect(r.css).toBeGreaterThan(0);
    expect(r.css).toBeLessThan(400_000);
});
