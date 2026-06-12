// design-synthesis-probe.mjs — per-pane screenshots (desktop + mobile) +
// computed-style hierarchy facts over the BUILT dist (dist/gh-pages).
// Run: KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui KF_REQUIRE_BROWSER=1 \
//   node docs/tranches/K/audit/design-synthesis-probe.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import { withPage, navToScene, openControlsPanel } from "../../../../scripts/lib/demo-driver.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SHOT = path.join(__dirname, "screenshots-k");
const DIST = path.join(__dirname, "../../../../dist/gh-pages");

const DESKTOP = { width: 1440, height: 900 };
const WIDE = { width: 2560, height: 1440 };
const MOBILE = { width: 390, height: 844 };

async function shot(page, name) {
    await page.screenshot({ path: path.join(SHOT, `ds-${name}.png`) });
    console.log("  shot:", name);
}

async function facts(page, label, sel) {
    return await page.evaluate(({ sel }) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, present: false };
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
            sel, present: true,
            font: cs.fontFamily.slice(0, 40),
            fontSize: cs.fontSize,
            color: cs.color,
            bg: cs.backgroundColor,
            backdrop: cs.backdropFilter,
            radius: cs.borderRadius,
            border: cs.borderWidth + " " + cs.borderColor,
            rect: { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) },
        };
    }, { sel });
}

await withPage({ distDir: DIST, context: { viewport: DESKTOP } }, async (page, { url }) => {
    // HERO (cold)
    await page.goto(url + "#/", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await shot(page, "hero-desktop");
    console.log("HERO facts:");
    for (const [lbl, s] of [["h1", "h1"], ["play-cta", "[aria-label*='lay' i] , .rainbow, [class*=rainbow]"], ["scene-card", "[class*=card], [class*=Card]"], ["topdock", ".glass-dock"], ["fourier", "canvas, [class*=ourier], [class*=Fourier]"]]) {
        console.log(" ", lbl, JSON.stringify(await facts(page, lbl, s)));
    }

    // WIDE (pathological)
    await page.setViewportSize(WIDE);
    await page.waitForTimeout(500);
    await shot(page, "hero-wide-2560");

    // MOBILE hero
    await page.setViewportSize(MOBILE);
    await page.waitForTimeout(500);
    await shot(page, "hero-mobile");

    // CUBE warm (controls open)
    await page.setViewportSize(DESKTOP);
    await navToScene(page, "cube", "Pause animation").catch(() => navToScene(page, "cube", "Play animation").catch(() => {}));
    await page.waitForTimeout(400);
    await openControlsPanel(page).catch((e) => console.log("  openControls err", e.message));
    await page.waitForTimeout(600);
    await shot(page, "cube-controls-desktop");
    console.log("CUBE controls facts:");
    for (const [lbl, s] of [["controls-panel", "[class*=glass-panel], [class*=controls], [role=tabpanel]"], ["tab-trigger", ".tab-trigger-base, [class*=tab-trigger]"], ["transport-dock", ".glass-dock"], ["slider", "[class*=slider], input[type=range]"], ["readout", "[class*=metric], [class*=readout], [class*=Metric]"]]) {
        console.log(" ", lbl, JSON.stringify(await facts(page, lbl, s)));
    }
    await page.setViewportSize(MOBILE);
    await page.waitForTimeout(500);
    await shot(page, "cube-controls-mobile");

    // SPRING
    await page.setViewportSize(DESKTOP);
    await navToScene(page, "spring", "Play animation").catch(() => {});
    await page.waitForTimeout(500);
    await openControlsPanel(page).catch(() => {});
    await page.waitForTimeout(600);
    await shot(page, "spring-desktop");
    console.log("SPRING facts:");
    for (const [lbl, s] of [["segmented-tabs", "[class*=segmented], [role=tablist]"], ["spring-slider", "[class*=slider], input[type=range]"], ["spring-readout", "[class*=metric], [class*=Metric], [class*=readout]"], ["sidebar", "[class*=Sidebar], [class*=sidebar], aside"]]) {
        console.log(" ", lbl, JSON.stringify(await facts(page, lbl, s)));
    }
    await page.setViewportSize(MOBILE);
    await page.waitForTimeout(500);
    await shot(page, "spring-mobile");

    // EASING
    await page.setViewportSize(DESKTOP);
    await navToScene(page, "easing", "Play animation").catch(() => {});
    await page.waitForTimeout(500);
    await shot(page, "easing-desktop");

    // SQUARE
    await navToScene(page, "square", "Play animation").catch(() => {});
    await page.waitForTimeout(500);
    await shot(page, "square-desktop");

    // SEQUENCE + MOTION-PATH
    await navToScene(page, "sequence", "Play animation").catch(() => {});
    await page.waitForTimeout(500);
    await shot(page, "sequence-desktop");
    await navToScene(page, "motion-path", "Play animation").catch(() => {});
    await page.waitForTimeout(500);
    await shot(page, "motionpath-desktop");

    // AMIGA
    await navToScene(page, "amiga", "Play animation").catch(() => {});
    await page.waitForTimeout(700);
    await shot(page, "amiga-desktop");
});
console.log("DONE");
