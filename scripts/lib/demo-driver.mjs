/**
 * demo-driver — the SINGLE-SOURCED Playwright driver the two C.W1
 * instrumentation lanes share (occlusion-gate.mjs [S2] + capture.mjs [S3]).
 *
 * Before C.W1, the SCENES manifest, the chromium resolver, the static DIST
 * server, and the subject-rect probe were copy-pasted across both gate
 * scripts; the controls-OPEN editing-state drive (the state inv δ / the a11y
 * audit must exercise) lived nowhere. This module is the convergence point:
 * both lanes import the SAME manifest + the SAME open-panel driver, so a
 * change to a scene route, a subject selector, or the open-panel transition
 * reaches both gates at once — net-better, no duplication.
 *
 * Exports (the lane contract — keep stable; both gates depend on it):
 *   SCENES         — Array<{ key, route, subjectSelector, dockFloatAllowed }>
 *                    `dockFloatAllowed: true` ONLY for the full-bleed amiga
 *                    canvas (an edge-floating dock is intended design there);
 *                    cube/home/square/easing/spring = false (a dock covering
 *                    their content rect is the real occlusion inv δ bites on).
 *   resolveChromium()              — KF_PLAYWRIGHT_DIR createRequire resolver.
 *   serveDist(distDir)             — static http server over the built demo
 *                                    (dist/gh-pages); returns { url, close }.
 *   openControlsPanel(page)        — drive a scene into its OPEN-panel editing
 *                                    state (select the first animation + open
 *                                    a controls tab) before probing.
 *   subjectRect(page, selector)    — the largest visible, in-viewport rect for
 *                                    the scene subject (or null if absent).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// The per-scene manifest. `key` is the stable scene id, `route` the hash
// route, `subjectSelector` the element the occlusion gate fits in-bounds and
// the π gate paints, `dockFloatAllowed` the honest resolution of the genuine
// dock-over-content tension (C.W1 § Design decisions): a full-bleed canvas
// legitimately permits an edge-floating dock; every other scene FAILS inv δ
// when a dock covers its content rect.
export const SCENES = [
    { key: "home", route: "", subjectSelector: ".graph, .cube, h1", dockFloatAllowed: false },
    { key: "cube", route: "cube", subjectSelector: ".graph, .cube", dockFloatAllowed: false },
    // amiga renders a full-bleed Three.js <canvas> — an edge-floating dock over
    // its bleed is the intended design, NOT occlusion (C.W1 § Design decisions).
    { key: "amiga", route: "amiga", subjectSelector: "canvas", dockFloatAllowed: true },
    { key: "square", route: "square", subjectSelector: ".square-box", dockFloatAllowed: false },
    {
        key: "easing",
        route: "easing",
        subjectSelector: "[class*=glass-card], [class*=Target], [class*=rail]",
        dockFloatAllowed: false,
    },
    {
        key: "spring",
        route: "spring",
        subjectSelector: "[class*=glass-card], [class*=Target], [class*=rail]",
        dockFloatAllowed: false,
    },
];

// The route → superKey map the demo's control-options store is keyed by
// (demo/app/scenes.ts). openControlsPanel seeds the store under this key so
// App.vue reads the OPEN state on the next mount.
const SUPER_KEY_BY_ROUTE = {
    "": "__home__",
    cube: "Cube",
    amiga: "Amiga",
    square: "Square",
    easing: "Easing",
    spring: "Spring",
};
const CONTROL_OPTIONS_STORE_KEY = "animation-groups-control-options-store";

export function resolveChromium() {
    const root = process.env.KF_PLAYWRIGHT_DIR ?? path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../..",
    );
    const requireFrom = createRequire(path.join(root, "package.json"));
    for (const pkg of ["playwright-core", "@playwright/test", "playwright"]) {
        try {
            return requireFrom(pkg).chromium;
        } catch {
            /* try next */
        }
    }
    return null;
}

const MIME = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
};

/**
 * serveDist — a tiny static http server over the built demo, SPA-fallback to
 * index.html so hash routes resolve. Returns { url, close } where url has no
 * trailing slash (`http://127.0.0.1:<port>`).
 */
export function serveDist(distDir) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
            let p = path.join(distDir, u === "/" ? "index.html" : u);
            if (
                !p.startsWith(distDir) ||
                !fs.existsSync(p) ||
                fs.statSync(p).isDirectory()
            ) {
                p = path.join(distDir, "index.html");
            }
            res.writeHead(200, {
                "content-type": MIME[path.extname(p)] ?? "application/octet-stream",
            });
            fs.createReadStream(p).pipe(res);
        });
        server.listen(0, () => {
            const port = server.address().port;
            resolve({
                url: `http://127.0.0.1:${port}`,
                close: () => new Promise((r) => server.close(r)),
            });
        });
    });
}

/**
 * openControlsPanel — drive the CURRENT scene into its open-panel editing
 * state via the REAL UI transitions, the same ones a user (and App.vue on
 * mount) performs: select the first animation in the dock's Select, then open
 * the controls pane. The pane's `v-show` is gated on `selectedAnimation`
 * (AnimationControlsGroup.vue) so a selection is the necessary first step; the
 * pane then auto-opens at width ≥ 1024, and on mobile we click the
 * controls-open toggle. We drive the UI (not just a store seed) because the
 * pane only materialises once Vue reacts to a genuine selection event.
 *
 * The page MUST already be on the target route (caller goto's first). No-op
 * for the home scene (no controls panel). Best-effort: if the Select/toggle is
 * not reachable, the caller probes the layout as-is (the gate then reads a
 * closed pane, which is honest, not a false green).
 */
export async function openControlsPanel(page) {
    const route = await page.evaluate(() =>
        location.hash.replace(/^#\/?/, ""),
    );
    const superKey = SUPER_KEY_BY_ROUTE[route];
    if (!superKey || superKey === "__home__") return; // home has no panel

    // 1. Select the first animation via the dock's "Select animation" trigger.
    //    This is what unhides the controls pane (its v-show keys on it).
    try {
        await page.click('[aria-label="Select animation"]', { timeout: 4000 });
        await page.waitForTimeout(500);
        const firstOption = page.locator("[role=option]").first();
        await firstOption.click({ timeout: 4000 });
        await page.waitForTimeout(800);
    } catch {
        // The Select did not open (already-selected, or teleport miss) — seed
        // the store as a fallback so a selection still holds across the wait.
        await page.evaluate(
            ({ storeKey, superKey }) => {
                const firstName =
                    [...document.querySelectorAll("[role=option]")]
                        .map((el) => el.textContent?.trim())
                        .find((t) => t && t.length > 0) ?? "";
                let store;
                try {
                    store = JSON.parse(localStorage.getItem(storeKey) ?? "{}");
                } catch {
                    store = {};
                }
                const prev =
                    store[superKey] && typeof store[superKey] === "object"
                        ? store[superKey]
                        : {};
                if (!prev.selectedAnimation && firstName) {
                    store[superKey] = {
                        ...prev,
                        selectedControl: prev.selectedControl ?? "controls",
                        selectedAnimation: firstName,
                        isControlsPanelOpen: true,
                    };
                    localStorage.setItem(storeKey, JSON.stringify(store));
                }
            },
            { storeKey: CONTROL_OPTIONS_STORE_KEY, superKey },
        );
    }

    // 2. Open the controls pane if it is not already open. At width ≥ 1024
    //    App.vue auto-opens it on selection; on mobile click the toggle
    //    ("Open controls" / "Close controls" title on the collapse button).
    const isOpen = await page.evaluate(
        () => !!document.querySelector(".controls-pane--open"),
    );
    if (!isOpen) {
        try {
            await page.click('[title="Open controls"]', { timeout: 3000 });
            await page.waitForTimeout(600);
        } catch {
            /* toggle not present (already open, or no panel) */
        }
    }

    // 3. Settle, then confirm the pane materialised. If neither the open class
    //    nor the ribbon target appears the drive failed and the caller probes
    //    the closed layout as-is (honest, not a false green).
    await page.waitForTimeout(800);
    try {
        await page.waitForFunction(
            () =>
                !!document.querySelector(".controls-pane--open") ||
                !!document.querySelector("#controls-ribbon-target"),
            { timeout: 6000 },
        );
    } catch {
        /* the pane did not open (e.g. an empty group); caller probes as-is */
    }
}

/**
 * subjectRect — the largest visible, in-viewport rect matching `selector`, in
 * the same shape the gates consume ({ x, y, width, height } + right/bottom).
 * Returns null when no subject renders (blank ≠ occlusion-free).
 */
export async function subjectRect(page, selector) {
    return page.evaluate((sel) => {
        const vh = window.innerHeight;
        const visible = (el) => {
            const cs = getComputedStyle(el);
            if (
                cs.visibility === "hidden" ||
                cs.display === "none" ||
                +cs.opacity === 0
            )
                return false;
            const r = el.getBoundingClientRect();
            return r.width > 8 && r.height > 8;
        };
        let best = null;
        for (const el of document.querySelectorAll(sel)) {
            if (!visible(el)) continue;
            const r = el.getBoundingClientRect();
            if (r.bottom < 0 || r.top > vh) continue; // off-screen vertically
            const area = r.width * r.height;
            if (!best || area > best.area) {
                best = {
                    area,
                    rect: {
                        x: Math.round(r.x),
                        y: Math.round(r.y),
                        width: Math.round(r.width),
                        height: Math.round(r.height),
                        right: Math.round(r.right),
                        bottom: Math.round(r.bottom),
                    },
                };
            }
        }
        return best ? best.rect : null;
    }, selector);
}
