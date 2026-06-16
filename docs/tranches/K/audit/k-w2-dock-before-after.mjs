#!/usr/bin/env node
/**
 * K.W2 TASTE-packet capture — the dock voice split→unified, before/after.
 *
 * Captures the cube@desktop dock band at the COLLAPSED scene pill + the EXPANDED
 * controls strip, in two states from the SAME post-fix dist:
 *   • AFTER  — the real built dist (the K.W2 root fix in place): the whole dock
 *              band resolves the Instrument-Serif DISPLAY voice.
 *   • BEFORE — the same page with ONE injected override flipping `.dock-label`
 *              back to `var(--font-text)` (the glass-ui 3.13.0 default the demo
 *              overrode), reproducing the split-voice dock (the scene pill serif,
 *              the dock-label triggers native sans) the wave cured.
 *
 * Writes PNGs under docs/tranches/K/audit/screenshots-k/.
 *   KF_REQUIRE_BROWSER=1 [KF_PLAYWRIGHT_DIR=…] node docs/tranches/K/audit/k-w2-dock-before-after.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { navToScene, withPage } from "../../../../scripts/lib/demo-driver.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../../../..");
const DIST = path.join(REPO, "dist/gh-pages");
const OUT = path.join(HERE, "screenshots-k");
fs.mkdirSync(OUT, { recursive: true });

// The pre-fix split-voice CSS: flip .dock-label back to glass-ui's --font-text
// default (the body register), at a specificity that wins the demo's @layer rule.
const SPLIT_VOICE_CSS = `html body .dock-label{font-family:var(--font-text)!important}`;

async function shoot(page, base, label, splitVoice) {
    await page.goto(`${base}/#/cube`, { waitUntil: "load" });
    await navToScene(page, "cube", "Controls", { timeout: 12000 });
    await page.waitForTimeout(900);
    if (splitVoice) {
        await page.addStyleTag({ content: SPLIT_VOICE_CSS });
        await page.waitForTimeout(300);
    }
    await page.evaluate(async () => {
        await document.fonts.ready;
    });
    // The bottom transport dock (the always-expanded TransportDock pill) carries the
    // `.dock-label` animation-name ("Rotations") beside the play transport — the
    // site where the split was most visible. Clip the bottom pill specifically (the
    // `.glass-dock.shape-pill` host near the viewport bottom), padded.
    const bottom = await page.evaluate(() => {
        const candidates = [...document.querySelectorAll(".glass-dock.shape-pill, .glass-dock")]
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter((c) => c.r.height > 24 && c.r.y > 600);
        const host = candidates.sort((a, b) => b.r.y - a.r.y)[0]?.r;
        if (!host) return null;
        return {
            x: Math.max(0, host.x - 24),
            y: Math.max(0, host.y - 20),
            width: Math.min(1440, host.width + 48),
            height: Math.min(900 - Math.max(0, host.y - 20), host.height + 40),
        };
    });
    const file = path.join(OUT, `cube-dock-${label}.png`);
    if (bottom && bottom.width > 8 && bottom.height > 8) {
        await page.screenshot({ path: file, clip: bottom });
    } else {
        await page.screenshot({ path: file });
    }
    return file;
}

const r = await withPage(
    { distDir: DIST, context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }, label: "K.W2 dock before/after capture" },
    async (page, { url: base }) => {
        const after = await shoot(page, base, "AFTER-display-unified", false);
        const before = await shoot(page, base, "BEFORE-split-voice", true);
        return { before, after };
    },
);
if (r.skipped) {
    console.error("capture skipped —", r.reason);
    process.exit(1);
}
console.log("wrote:\n  BEFORE:", r.value.before, "\n  AFTER: ", r.value.after);
