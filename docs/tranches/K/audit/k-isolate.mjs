// K audit — isolate engine-write (.cube) from independent idle/orbital motion
// (.idle-hover / .graph). Compare COLD (hero play) vs CHOREOGRAPHED (direct cube
// + seed controls + click play). Per element: distinct transforms over 2s + does
// the dock play aria flip to "Pause animation".
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const log = (...a) => console.log(...a);

const probe = (page, ms = 2000) =>
    page.evaluate(async (dur) => {
        const sleep = (m) => new Promise((r) => setTimeout(r, m));
        const sets = { cube: new Set(), idle: new Set(), graph: new Set() };
        const map = { cube: ".cube", idle: ".idle-hover", graph: ".graph" };
        const t0 = performance.now();
        while (performance.now() - t0 < dur) {
            for (const [k, sel] of Object.entries(map)) {
                const el = document.querySelector(sel);
                if (el) {
                    const t = getComputedStyle(el).transform;
                    if (t && t !== "none") sets[k].add(t);
                }
            }
            await sleep(25);
        }
        const playBtn = document.querySelector('button[aria-label*="ause animation"], button[aria-label*="lay animation"]');
        return {
            cube: sets.cube.size, idle: sets.idle.size, graph: sets.graph.size,
            playAria: playBtn ? playBtn.getAttribute("aria-label") : "(no btn)",
        };
    }, ms);

const clickPlay = async (page) => {
    for (const sel of ['button[aria-label*="Play animation"]', 'button[aria-label*="play" i]']) {
        const el = page.locator(sel).first();
        if ((await el.count()) > 0 && (await el.isVisible().catch(() => false))) {
            await el.click({ force: true, timeout: 2500 }).catch(() => {});
            return sel;
        }
    }
    return null;
};

await withPage({ distDir: DIST, label: "K isolate" }, async (_p, { url: base, browser }) => {
    // COLD
    {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await page.goto(`${base}/#/`, { waitUntil: "load" });
        await page.waitForTimeout(1200);
        const before = await probe(page, 800);
        log("COLD pre-click:", JSON.stringify(before));
        const c = await clickPlay(page);
        log("COLD clicked:", c);
        await page.waitForTimeout(500);
        const after = await probe(page, 2200);
        log("COLD post-click (2.2s):", JSON.stringify(after));
        await ctx.close();
    }
    // CHOREOGRAPHED
    {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await page.addInitScript(() => {
            try { localStorage.setItem("animation-groups-control-options-store", JSON.stringify({ isControlsPanelOpen: true })); } catch {}
        });
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(1500);
        const before = await probe(page, 800);
        log("CHOREO pre-click:", JSON.stringify(before));
        const c = await clickPlay(page);
        log("CHOREO clicked:", c);
        await page.waitForTimeout(500);
        const after = await probe(page, 2200);
        log("CHOREO post-click (2.2s):", JSON.stringify(after));
        await ctx.close();
    }
});
