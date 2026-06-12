// K audit (layout-grid-k) — pathological-screen probe.
// Serves the BUILT dist via withPage; for each viewport, navigates to the cube
// scene (a desktop rail·stage·rail scene with controls), opens the panel, and
// reads the resolved layout tokens + the actual box rects. Screenshots each.
import { withPage, openControlsPanel } from "../../../../scripts/lib/demo-driver.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const shotDir = path.join(here, "screenshots-k");

const VIEWPORTS = [
    { name: "3440x1440-ultrawide", width: 3440, height: 1440 },
    { name: "1280x2000-tall-portrait", width: 1280, height: 2000 },
    { name: "5120x2880-5k", width: 5120, height: 2880 },
    { name: "1920x1080-baseline", width: 1920, height: 1080 },
];

const TOKENS = [
    "--work-area-max-width",
    "--work-area-max-height",
    "--work-area-height",
    "--work-area-vertical-slack",
    "--work-area-top-offset",
    "--work-area-bottom-offset",
    "--dock-band-reserve",
    "--dock-top-anchor",
    "--dock-bottom-anchor",
    "--dock-menubar-reserve",
    "--rail-width",
    "--dock-margin",
    "--dock-icon-height",
];

async function readState(page) {
    return page.evaluate((tokens) => {
        const cs = getComputedStyle(document.documentElement);
        const resolved = {};
        // Resolve each token to PIXELS by setting it as a width on a probe el.
        const probe = document.createElement("div");
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        document.body.appendChild(probe);
        for (const t of tokens) {
            probe.style.width = `var(${t})`;
            const px = getComputedStyle(probe).width;
            resolved[t] = px && px !== "auto" ? px : cs.getPropertyValue(t).trim();
        }
        probe.remove();
        const rect = (sel) => {
            const el = document.querySelector(sel);
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
        };
        return {
            viewport: { w: window.innerWidth, h: window.innerHeight },
            tokens: resolved,
            controlsLayout: rect(".controls-layout"),
            stageCell: rect(".stage-cell"),
            controlsPane: rect(".controls-pane-wrapper"),
            topDock: rect("[class*='dock'][style*='top']") || rect(".chrome-dock") || null,
            bottomDock: rect(".transport-dock") || null,
        };
    }, TOKENS);
}

const results = [];
for (const vp of VIEWPORTS) {
    const r = await withPage(
        { context: { viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 }, label: vp.name },
        async (page, { url }) => {
            await page.goto(url + "#/cube", { waitUntil: "networkidle" });
            await page.waitForTimeout(600);
            const before = await readState(page);
            try { await openControlsPanel(page); } catch {}
            await page.waitForTimeout(900);
            const after = await readState(page);
            await page.screenshot({ path: path.join(shotDir, `cube-${vp.name}.png`), fullPage: false });
            // Also a portrait/tall: capture the square scene which the user flagged
            return { before, after };
        },
    );
    results.push({ vp: vp.name, skipped: r.skipped, ...(r.value ?? {}) });
}

console.log(JSON.stringify(results, null, 2));
