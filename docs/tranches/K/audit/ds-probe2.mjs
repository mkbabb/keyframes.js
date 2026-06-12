import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage, navToScene, openControlsPanel } from "../../../../scripts/lib/demo-driver.mjs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOT = path.join(__dirname, "screenshots-k");
const DIST = path.join(__dirname, "../../../../dist/gh-pages");
const DESKTOP = { width: 1440, height: 900 };
const WIDE = { width: 2560, height: 1440 };
async function shot(page, name) { await page.screenshot({ path: path.join(SHOT, `ds-${name}.png`) }); console.log("shot:", name); }
await withPage({ distDir: DIST, context: { viewport: DESKTOP } }, async (page, { url }) => {
    for (const [scene, name] of [["easing","easing-desktop"],["square","square-desktop"],["sequence","sequence-desktop"],["motion-path","motionpath-desktop"]]) {
        await navToScene(page, scene, "Play animation").catch(() => navToScene(page, scene, "Pause animation").catch(()=>{}));
        await page.waitForTimeout(700); await shot(page, name);
    }
    await navToScene(page, "amiga", "Play animation").catch(()=>{});
    await page.waitForTimeout(900); await shot(page, "amiga-desktop");
    // pathological wide cube with controls open
    await navToScene(page, "cube", "Play animation").catch(()=>{});
    await openControlsPanel(page).catch(()=>{});
    await page.setViewportSize(WIDE); await page.waitForTimeout(700);
    await shot(page, "cube-wide-2560");
});
console.log("DONE");
