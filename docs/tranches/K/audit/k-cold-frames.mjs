// K audit — COLD-PATH frame-diff. Land cold on hero, click rainbow play ONCE,
// then capture N screenshots at 200ms intervals + read the cube transform AND
// the playback ribbon slider value at each. Diff consecutive frames to settle
// whether (a) the cube subject moves and (b) the slider/playhead advances.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage } from "../../../../scripts/lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const SHOTS = path.join(REPO, "docs/tranches/K/audit/screenshots-k");
const log = (...a) => console.log(...a);

const readState = (page) =>
    page.evaluate(() => {
        const cube = document.querySelector(".cube, .cube-target");
        const cubeT = cube ? getComputedStyle(cube).transform.slice(0, 60) : "(no cube)";
        // The playback ribbon range/slider + the AnimationVisualizer ball.
        const range = document.querySelector('.playback-ribbon input[type=range], input[type=range][aria-label*="crub" i], input[type=range]');
        const rangeV = range ? String(range.value) : "(no range)";
        const ball = document.querySelector(".progress-ball, [class*='visualizer'] [class*='ball'], .animation-visualizer *[style*='transform']");
        const ballT = ball ? (ball.style.transform || getComputedStyle(ball).transform).slice(0, 40) : "(no ball)";
        // The dock play button aria (Play vs Pause = is the engine "playing").
        const playBtn = document.querySelector('button[aria-label*="ause animation"], button[aria-label*="lay animation"]');
        const playAria = playBtn ? playBtn.getAttribute("aria-label") : "(no btn)";
        return { cubeT, rangeV, ballT, playAria };
    });

await withPage({ distDir: DIST, label: "K cold-frames" }, async (_p, { url: base, browser }) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${base}/#/`, { waitUntil: "load" });
    await page.waitForTimeout(1200);

    // Click the hero rainbow play (the very first gesture).
    await page.locator('button[aria-label*="Play animation"]').first().click({ force: true, timeout: 3000 }).catch((e) => log("click err", String(e).slice(0, 80)));
    await page.waitForTimeout(500);

    log("=== COLD: 10 frames @180ms after hero-play click ===");
    const cubeSet = new Set(), rangeSet = new Set(), ballSet = new Set();
    for (let i = 0; i < 10; i++) {
        const s = await readState(page);
        cubeSet.add(s.cubeT); rangeSet.add(s.rangeV); ballSet.add(s.ballT);
        log(`  f${i}: play=${s.playAria} | range=${s.rangeV} | ball=${s.ballT} | cube=${s.cubeT.slice(0, 34)}`);
        if (i < 5) await page.screenshot({ path: path.join(SHOTS, `kcf-cold-${i}.png`) });
        await page.waitForTimeout(180);
    }
    log(`COLD distinct: cube=${cubeSet.size} range=${rangeSet.size} ball=${ballSet.size}`);

    await ctx.close();
});
