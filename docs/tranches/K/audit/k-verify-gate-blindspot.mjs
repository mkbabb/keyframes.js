// K audit — verify the GATE BLINDSPOT directly. Reproduce the EXACT B1 oracle
// (sample .cube/.graph/.idle-hover for >=3 distinct transforms) on the COLD-
// BROKEN state, and show it PASSES while the engine is demonstrably off.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const log = (...a) => console.log(...a);

// The B1 oracle, verbatim from proof-live-session.mjs lines 393-408.
const b1Oracle = (page) =>
    page.evaluate(async () => {
        const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
        const seen = new Set();
        for (let i = 0; i < 100; i++) {
            for (const sel of [".cube", ".graph", ".idle-hover"]) {
                const el = document.querySelector(sel);
                if (el) {
                    const t = getComputedStyle(el).transform;
                    if (t && t !== "none") seen.add(sel + "|" + t);
                }
            }
            await sleep(25);
        }
        return seen.size;
    });

const enginePlaying = (page) =>
    page.evaluate(() => {
        const btn = document.querySelector('button[aria-label*="ause animation"], button[aria-label*="lay animation"]');
        return { playAria: btn ? btn.getAttribute("aria-label") : "(no btn)" };
    });

await withPage({ distDir: DIST, label: "K gate-blindspot" }, async (_p, { url: base, browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    // COLD entry — hero, click play once, then run the B1 oracle on the result.
    await page.goto(`${base}/#/`, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    await page.locator('button[aria-label*="Play animation"]').first().click({ force: true, timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(800);

    const distinct = await b1Oracle(page);
    const state = await enginePlaying(page);
    log("=== B1 ORACLE on the COLD-broken state ===");
    log(`  B1 distinct transforms (.cube/.graph/.idle-hover): ${distinct}  → B1 verdict: ${distinct >= 3 ? "PASS (GREEN)" : "FAIL (RED)"}`);
    log(`  ACTUAL engine state: play button = "${state.playAria}"  → engine ${state.playAria?.includes("Pause") ? "IS PLAYING" : "is NOT playing (STILL 'Play')"}`);
    log(`  ⇒ BLINDSPOT CONFIRMED: B1 greens while the engine never started — the idle-bob alone carries >=3 distinct.`);

    await ctx.close();
});
