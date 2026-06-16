/**
 * taste-packet — the TASTE-boundary review-packet GENERATOR (Tranche K.W5 S5).
 *
 * ── WHY THIS EXISTS (the TASTE-boundary invariant) ───────────────────────────
 * Gates carry CORRECTNESS; they do NOT carry the design VERDICT. Every K
 * appearance wave (K.W2 fonts, K.W3 layout, K.W4 panes, K.W1′ dock) closes its
 * design band ONLY on the USER's verdict on a review packet — a named
 * USER-DOMAIN step, scheduled BEFORE the close. The J.W7c failure mode this
 * generator exists to prevent: agents reported a "designer-eye PASS" while the
 * user's same-day verdict was "awful" (PATH-FORWARD.md §1). The packet is the
 * ARTIFACT that makes that boundary gate-able: it must EXIST and be presented
 * before WZ claims a design band; an agent verdict NEVER substitutes for it.
 *
 * This module PACKAGES; it does NOT verdict. Its output is a directory of PNGs
 * (per-pane BEFORE/AFTER, desktop+mobile) + a manifest.json the user reviews.
 *
 * ── HOW IT RIDES THE EXISTING SEAMS (no second pipeline — the net-deletion) ──
 * The generator reuses the `proof:visual-lock` region-screenshot machinery (the
 * named-region clip + the live-motion MASK) and the `scripts/lib/demo-driver.mjs`
 * `withPage` lifecycle (serveDist + resolveChromium + teardown — the single
 * driver every browser gate rides, W3's layout-cluster gate included). It is a
 * net-ADD over those seams, NOT a new screenshot authority:
 *   - the REGION clip + MASK_SUBJECTS list are re-used from visual-lock so the
 *     packet shows the SAME named regions the appearance lock guards (and masks
 *     the SAME perpetual-motion sub-rects so a moving frame never enters a shot);
 *   - PRM emulation (`reducedMotion: "reduce"`) stills the CSS-driven motion, the
 *     same freeze visual-lock uses, so a BEFORE↔AFTER comparison is meaningful.
 *
 * ── THE PACKET SHAPE (design-synthesis-k.md §5 is the exemplar) ──────────────
 * For each named PANE (a {scene, region} pair) × {desktop 1440, mobile 375}:
 *   <out>/<pane>-<viewport>-before.png   (the BEFORE tree — committed baseline
 *                                          PNG, or a fresh capture of a before-dist)
 *   <out>/<pane>-<viewport>-after.png    (a fresh capture of the AFTER dist)
 * plus <out>/manifest.json — the named deltas per pane + the taste-anchor
 * checklist (the rainbow play / hero serif / icon family / red-dashed final state
 * PRESERVED — design-synthesis-k.md §5) + the verdict slot (USER-DOMAIN, left
 * unset; the generator NEVER fills it).
 *
 * ── THE BEFORE SOURCE (two modes) ────────────────────────────────────────────
 *   before: "baseline"  — copy the committed visual-lock baseline PNG for the
 *                         pane (scripts/baselines/visual-lock/<scene>-<vp>...-
 *                         <region>.png) as the BEFORE shot. ZERO extra capture;
 *                         the pre-wave golden IS the before. (The default.)
 *   before: { distDir } — capture the BEFORE shot fresh from a built before-tree
 *                         (a pre-wave dist/gh-pages checkout). The honest A/B when
 *                         no committed baseline exists for the pane yet.
 *
 * The capture is fully deterministic-seek (re-screenshot until two reads agree)
 * so a mid-settle transient never enters a shot — the same captureStable
 * discipline visual-lock uses.
 *
 * ── USAGE (lib) ──────────────────────────────────────────────────────────────
 *   import { generateTastePacket, TASTE_ANCHORS } from "./lib/taste-packet.mjs";
 *   const result = await generateTastePacket({
 *       wave: "K.W4",
 *       outDir: "docs/tranches/K/audit/taste-packets/k-w4",
 *       panes: [
 *           { scene: "spring", region: "controls", deltas: ["editor two-way", "60Hz scrubber"] },
 *           { scene: "home",   region: "hero",     deltas: ["serif display rung"] },
 *       ],
 *       before: "baseline",            // or { distDir: "/path/to/before/dist/gh-pages" }
 *       distDir: "dist/gh-pages",      // the AFTER tree
 *   });
 *   // result.skipped (W7-1) | result.manifestPath | result.shots[]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { withBrowser, serveDist, SCENES } from "./demo-driver.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "../..");
const DEFAULT_DIST = path.join(REPO, "dist/gh-pages");
const VISUAL_LOCK_BASELINE = path.join(REPO, "scripts/baselines/visual-lock");

// ── The viewport axis (matches visual-lock's contract: mobile 375 + desktop 1440) ─
export const VIEWPORTS = [
    { name: "mobile", width: 375, height: 667 },
    { name: "desktop", width: 1440, height: 900 },
];

// ── The named-region host selectors (1:1 with proof:visual-lock REGIONS) ──────
// The packet shows the SAME named regions the appearance lock guards, so a
// reviewer sees the protagonist plate, the editing pane, the hero poster, and
// the transport — the panes a taste verdict is made over.
export const REGION_HOSTS = {
    hero: { host: ".hero-display, #start-screen, .start-screen-prose", state: "closed" },
    stage: { host: ".stage-cell", state: "closed" },
    controls: { host: ".controls-pane-wrapper, .controls-pane", state: "open" },
    ribbon: { host: "#controls-ribbon-target, .playback-ribbon", state: "open" },
};

// ── The live-motion sub-rects to MASK (re-used verbatim from proof:visual-lock) ─
// A region clips its host and masks any of these inside it — so an in-flight
// frame (the cube bob, the engine balls, the typing dots, the CodeMirror raster)
// never enters a BEFORE/AFTER comparison shot.
export const MASK_SUBJECTS = [
    "canvas",
    ".amiga-canvas",
    ".cube",
    ".graph",
    ".container-inline-size",
    ".glass-slider",
    ".easing-curve-canvas",
    ".hero-track",
    ".hero-ball",
    ".progress-rail",
    ".progress-ball",
    ".preset-track",
    ".demo-box",
    ".mp-traveller",
    ".mp-guide-path",
    ".seq-playhead",
    ".spring-rail",
    ".tabular-nums",
    "[class*=TypingDots]",
    ".typing-dots",
    ".dot",
    ".gold-shimmer",
    ".cm-editor",
];

// ── The taste anchors (design-synthesis-k.md §5 — PRESERVE; never flatten) ────
// The packet's AFTER shots must show these intact. The generator emits the
// checklist into the manifest (unchecked — the USER ticks them); it is the
// reviewer's named "did the refinement keep the soul" list, not a gate assertion.
export const TASTE_ANCHORS = Object.freeze([
    "rainbow play — the one sanctioned multi-color pop, present + correct",
    "hero serif — the Instrument Serif display voice",
    "icon family — the consistent icon idiom",
    "red-dashed final state — the unified motion-color terminal",
]);

const SCENE_KEYS = new Set(SCENES.map((s) => s.key));

/** The committed visual-lock baseline PNG path for a {scene, vp, region}. */
function visualLockBaselinePath(scene, vp, region) {
    const state = REGION_HOSTS[region]?.state ?? "closed";
    const suffix = state === "open" ? "-open" : "";
    return path.join(VISUAL_LOCK_BASELINE, `${scene}-${vp}${suffix}-${region}.png`);
}

// ── In-page region geometry (the host clip + the mask rects — mirrors visual-lock) ─
async function regionGeometry(page, hostSel, maskSels) {
    return page.evaluate(
        ({ hostSel, maskSels }) => {
            const visible = (el) => {
                const cs = getComputedStyle(el);
                if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0)
                    return false;
                const r = el.getBoundingClientRect();
                return r.width > 8 && r.height > 8;
            };
            const inViewport = (r) =>
                r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
            let best = null;
            for (const el of document.querySelectorAll(hostSel)) {
                if (!visible(el)) continue;
                const r = el.getBoundingClientRect();
                if (!inViewport(r)) continue;
                const area = r.width * r.height;
                if (!best || area > best.area) best = { area, r };
            }
            if (!best) return null;
            const vw = innerWidth, vh = innerHeight;
            const clip = {
                x: Math.max(0, Math.floor(best.r.left)),
                y: Math.max(0, Math.floor(best.r.top)),
            };
            clip.width = Math.max(1, Math.min(vw, Math.ceil(best.r.right)) - clip.x);
            clip.height = Math.max(1, Math.min(vh, Math.ceil(best.r.bottom)) - clip.y);
            const masks = [];
            for (const sel of maskSels) {
                for (const el of document.querySelectorAll(sel)) {
                    if (!visible(el)) continue;
                    const r = el.getBoundingClientRect();
                    const x0 = Math.max(clip.x, r.left), y0 = Math.max(clip.y, r.top);
                    const x1 = Math.min(clip.x + clip.width, r.right);
                    const y1 = Math.min(clip.y + clip.height, r.bottom);
                    if (x1 - x0 > 1 && y1 - y0 > 1)
                        masks.push({
                            x: Math.floor(x0), y: Math.floor(y0),
                            width: Math.ceil(x1 - x0), height: Math.ceil(y1 - y0),
                        });
                }
            }
            return { clip, masks };
        },
        { hostSel, maskSels },
    );
}

async function applyMasks(page, masks) {
    await page.evaluate((masks) => {
        const layer = document.createElement("div");
        layer.id = "__kf_taste_packet_masks";
        layer.style.cssText =
            "position:fixed;left:0;top:0;width:0;height:0;z-index:2147483647;pointer-events:none;";
        for (const m of masks) {
            const d = document.createElement("div");
            d.style.cssText =
                `position:fixed;left:${m.x}px;top:${m.y}px;width:${m.width}px;` +
                `height:${m.height}px;background:#ff00ff;pointer-events:none;`;
            layer.appendChild(d);
        }
        document.body.appendChild(layer);
    }, masks);
}
async function removeMasks(page) {
    await page.evaluate(() => document.getElementById("__kf_taste_packet_masks")?.remove());
}

/** captureStable — re-screenshot until two reads agree (the visual-lock seek). */
async function captureStable(page, geom) {
    const SETTLE_PX = 8, MAX_TRIES = 6;
    let prev = null, last = null;
    for (let i = 0; i < MAX_TRIES; i++) {
        await applyMasks(page, geom.masks);
        last = await page.screenshot({ clip: geom.clip });
        await removeMasks(page);
        if (prev) {
            try {
                const a = PNG.sync.read(prev), b = PNG.sync.read(last);
                if (a.width === b.width && a.height === b.height) {
                    const tmp = new PNG({ width: a.width, height: a.height });
                    const mm = pixelmatch(a.data, b.data, tmp.data, a.width, a.height, { threshold: 0.1 });
                    if (mm <= SETTLE_PX) return last;
                }
            } catch {
                /* try again */
            }
        }
        prev = last;
        await page.waitForTimeout(350);
    }
    return last;
}

const MACHINE_KEY = "keyframes-js-scene-machine";

async function settle(page, url, scene, region) {
    const route = scene === "home" ? "" : scene;
    await page.goto(`${url}/#/${route || ""}`, { waitUntil: "load" });
    await page.evaluate((r) => { location.hash = r ? "#/" + r : "#/"; }, route);
    if (scene !== "home") {
        await page
            .waitForFunction(
                ([mk, s]) => {
                    try {
                        return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === s;
                    } catch { return false; }
                },
                [MACHINE_KEY, scene],
                { timeout: 8000 },
            )
            .catch(() => {});
    }
    await page.waitForTimeout(1800);
    if (REGION_HOSTS[region]?.state === "open" && scene !== "home") {
        const { openControlsPanel } = await import("./demo-driver.mjs");
        await openControlsPanel(page);
        await page.waitForTimeout(800);
    }
}

/** Capture ONE pane shot (a {scene, region, vp}) from a served dist into a buffer. */
async function captureShot(browser, url, scene, region, vp) {
    const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
    });
    try {
        const page = await context.newPage();
        await page.emulateMedia({ reducedMotion: "reduce" });
        await settle(page, url, scene, region);
        await page.setViewportSize({ width: vp.width, height: vp.height });
        const geom = await regionGeometry(page, REGION_HOSTS[region].host, MASK_SUBJECTS);
        if (!geom) return null;
        return await captureStable(page, geom);
    } finally {
        await context.close();
    }
}

/**
 * generateTastePacket — produce the review packet for a wave's named deltas.
 *
 * @param opts.wave     the wave name (e.g. "K.W4") — recorded in the manifest.
 * @param opts.outDir   the packet directory (created; PNGs + manifest.json land here).
 * @param opts.panes    [{ scene, region, deltas: string[] }] — the panes to shoot.
 *                      `region` ∈ {hero, stage, controls, ribbon}. `deltas` are
 *                      the design changes the wave declares for that pane.
 * @param opts.before   "baseline" (copy the committed visual-lock golden as BEFORE)
 *                      | { distDir } (capture a fresh BEFORE from a before-tree).
 * @param opts.distDir  the AFTER tree (default dist/gh-pages).
 * @param opts.viewports default both (mobile + desktop).
 * @returns { skipped } (the W7-1 harness skip) OR
 *          { manifestPath, outDir, shots: [...], missingBefore: [...] }
 */
export async function generateTastePacket(opts) {
    const {
        wave,
        outDir,
        panes,
        before = "baseline",
        distDir = DEFAULT_DIST,
        viewports = VIEWPORTS,
        anchors = TASTE_ANCHORS,
    } = opts ?? {};

    if (!wave) throw new Error("taste-packet: `wave` is required (the wave name)");
    if (!outDir) throw new Error("taste-packet: `outDir` is required");
    if (!Array.isArray(panes) || panes.length === 0)
        throw new Error("taste-packet: `panes` must be a non-empty array of { scene, region, deltas }");
    for (const p of panes) {
        if (!SCENE_KEYS.has(p.scene))
            throw new Error(
                `taste-packet: unknown scene "${p.scene}" — must be a scenes.ts id ` +
                    `(one of: ${[...SCENE_KEYS].join(", ")})`,
            );
        if (!REGION_HOSTS[p.region])
            throw new Error(
                `taste-packet: unknown region "${p.region}" — one of ${Object.keys(REGION_HOSTS).join(", ")}`,
            );
    }
    if (!fs.existsSync(path.join(distDir, "index.html")))
        throw new Error(
            `taste-packet: the AFTER tree has no index.html at ${distDir} — run \`npm run gh-pages\` first`,
        );

    const absOut = path.isAbsolute(outDir) ? outDir : path.join(REPO, outDir);
    fs.mkdirSync(absOut, { recursive: true });

    const beforeFresh = before && typeof before === "object" && before.distDir ? before.distDir : null;
    const beforeBaseline = before === "baseline";

    const shots = [];
    const missingBefore = [];

    // ONE browser over the AFTER tree (+ optionally the BEFORE tree) — the lib
    // lifecycle owns chromium resolve + teardown + the W7-1 required-but-unavailable
    // rule at the seam.
    const result = await withBrowser(
        async (browser) => {
            const afterServer = await serveDist(distDir);
            const beforeServer = beforeFresh ? await serveDist(beforeFresh) : null;
            try {
                for (const pane of panes) {
                    const paneKey = `${pane.scene}-${pane.region}`;
                    for (const vp of viewports) {
                        const base = `${paneKey}-${vp.name}`;
                        // AFTER — fresh from the after dist.
                        const afterBuf = await captureShot(
                            browser, afterServer.url, pane.scene, pane.region, vp,
                        );
                        const afterPath = path.join(absOut, `${base}-after.png`);
                        if (afterBuf) fs.writeFileSync(afterPath, afterBuf);

                        // BEFORE — committed baseline copy OR a fresh before-dist capture.
                        const beforePath = path.join(absOut, `${base}-before.png`);
                        let beforeWritten = false;
                        if (beforeBaseline) {
                            const blp = visualLockBaselinePath(pane.scene, vp.name, pane.region);
                            if (fs.existsSync(blp)) {
                                fs.copyFileSync(blp, beforePath);
                                beforeWritten = true;
                            }
                        } else if (beforeServer) {
                            const beforeBuf = await captureShot(
                                browser, beforeServer.url, pane.scene, pane.region, vp,
                            );
                            if (beforeBuf) {
                                fs.writeFileSync(beforePath, beforeBuf);
                                beforeWritten = true;
                            }
                        }
                        if (!beforeWritten) missingBefore.push(base);

                        shots.push({
                            pane: paneKey,
                            scene: pane.scene,
                            region: pane.region,
                            viewport: vp.name,
                            deltas: pane.deltas ?? [],
                            after: afterBuf ? path.basename(afterPath) : null,
                            before: beforeWritten ? path.basename(beforePath) : null,
                        });
                    }
                }
            } finally {
                await afterServer.close();
                if (beforeServer) await beforeServer.close();
            }
        },
        { label: "the taste-packet generator" },
    );

    if (result.skipped) return { skipped: result.reason };

    // The manifest — the named deltas per pane + the taste-anchor checklist + the
    // (intentionally unset) USER-DOMAIN verdict slot. The generator PACKAGES; the
    // user VERDICTS (the TASTE-boundary invariant — an agent PASS is never the verdict).
    const manifest = {
        wave,
        generatedAt: new Date().toISOString(),
        before: beforeBaseline ? "visual-lock-baseline" : { distDir: beforeFresh },
        afterDist: distDir,
        viewports: viewports.map((v) => v.name),
        panes: panes.map((p) => ({
            pane: `${p.scene}-${p.region}`,
            scene: p.scene,
            region: p.region,
            deltas: p.deltas ?? [],
            shots: viewports.map((v) => ({
                viewport: v.name,
                before: `${p.scene}-${p.region}-${v.name}-before.png`,
                after: `${p.scene}-${p.region}-${v.name}-after.png`,
            })),
        })),
        tasteAnchorChecklist: anchors.map((a) => ({ anchor: a, preserved: null })),
        verdict: null, // USER-DOMAIN — the generator NEVER fills this.
        verdictBy: null,
        verdictAt: null,
        missingBefore,
    };
    const manifestPath = path.join(absOut, "manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4) + "\n");

    return { manifestPath, outDir: absOut, shots, missingBefore };
}
