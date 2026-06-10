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
 *                    RE-SOURCED from `demo/app/scenes.ts` at H.W8 S1 (was a
 *                    hand-maintained 6-entry array that drifted to the demo's 8
 *                    scenes). `key` === the scenes.ts id; `route` === the hash
 *                    route. `dockFloatAllowed: true` ONLY for the full-bleed
 *                    amiga canvas (an edge-floating dock is intended design
 *                    there); every other scene = false (a dock covering their
 *                    content rect is the real occlusion inv δ bites on). A
 *                    stale-key guard binds the manifest set EXACTLY to the
 *                    scenes.ts ids (see SCENE_GATE_META below).
 *   resolveChromium()              — KF_PLAYWRIGHT_DIR createRequire resolver.
 *   serveDist(distDir)             — static http server over the built demo
 *                                    (dist/gh-pages); returns { url, close }.
 *   REQUIRE_BROWSER                — the KF_REQUIRE_BROWSER=1 flag, read ONCE.
 *   withBrowser(fn, opts)          — resolveChromium → launch → fn(browser) →
 *                                    finally close (the J.W3 S1a lifecycle).
 *   withPage(opts, fn)             — withBrowser → serveDist(opts.distDir) on
 *                                    port 0 → newContext(opts.context) → newPage
 *                                    → fn(page, { url, server, browser, context })
 *                                    → finally close context + server. The ONE
 *                                    open-server/resolve-chromium/run/teardown
 *                                    lifecycle (signal-safe; W7-1 rule below).
 *   SCENE_MACHINE_KEY              — the scene machine's localStorage key (the
 *                                    persisted `activeScene` EARLY fact).
 *   navToScene(page, sceneId, expectedTrigger, {timeout})
 *                                  — hash-nav + per-EXPECTED-state settle (the
 *                                    J.W0 S2 primitive; no fixed settleMs).
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

// ─────────────────────────────────────────────────────────────────────────────
// H.W8 S1 (I-1) — RE-SOURCE THE SCENES MANIFEST FROM `demo/app/scenes.ts`.
//
// Before H.W8 this manifest was a HAND-MAINTAINED 6-entry array. It DRIFTED: the
// demo ships 8 scenes (the cube/amiga/square/easing/spring originals + the
// sequence/motion-path primitives; `starting-style` was merged INTO spring at
// H.W5), but the array still knew only 6 — so `sequence`/`motion-path` were
// NEVER occlusion-checked, lighthouse-scored, or captured by any runtime gate.
//
// The fix (the load-bearing prerequisite): the manifest's SCENE SET is now
// DERIVED from `scenes.ts` — the single source the router (`demo/app/router.ts`)
// already trusts. The id UNION is `[homeScene.id, ...scenes.map(s => s.id)]`
// (home is SEPARATE from the `scenes[]` array). `route` and `superKey` are read
// FROM each descriptor (route = `id` for non-home, `""` for home — verified 1:1
// against router.ts). The only HAND-DATA left is the per-scene gate metadata
// (`subjectSelector` + `dockFloatAllowed`), keyed by the `scenes.ts` id.
//
// A STALE-KEY GUARD (mirrors the proof:brittleness LISTENER_ALLOWLIST stale
// guard) binds the two sets EXACTLY: a metadata key with no `scenes.ts` id THROWS
// at module load, and a `scenes.ts` id with no metadata entry THROWS — so adding
// a scene to `scenes.ts` AUTO-enrolls it in every runtime gate (and fails loud
// until its gate metadata is added). The standing invariant is key-EQUALITY, not
// a hard-coded count (`proof:manifest-sourced` asserts it as a re-runnable gate;
// it AUTO-TRACKS any future scene add/remove). The exported SCENES shape is
// UNCHANGED — `{ key, route, subjectSelector, dockFloatAllowed }` — so the
// occlusion/capture/lighthouse/typing-dots/etc. consumers need no edit.
// ─────────────────────────────────────────────────────────────────────────────

const SCENES_TS = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../demo/app/scenes.ts",
);

// The per-id GATE metadata — the only hand-maintained scene data that remains.
// `subjectSelector` is the element the occlusion gate fits in-bounds and the π
// gate paints; `dockFloatAllowed` is the honest resolution of the genuine
// dock-over-content tension (C.W1 § Design decisions): a full-bleed canvas (amiga)
// legitimately permits an edge-floating dock; every other scene FAILS inv δ when
// a dock covers its content rect. KEYED BY the `scenes.ts` id (the stale-key
// guard below binds this map's keys EXACTLY to the parsed scene set).
const SCENE_GATE_META = {
    home: { subjectSelector: ".graph, .cube, h1", dockFloatAllowed: false },
    cube: { subjectSelector: ".graph, .cube", dockFloatAllowed: false },
    // amiga renders a full-bleed Three.js <canvas> — an edge-floating dock over
    // its bleed is the intended design, NOT occlusion (C.W1 § Design decisions).
    amiga: { subjectSelector: "canvas", dockFloatAllowed: true },
    square: { subjectSelector: ".demo-box", dockFloatAllowed: false },
    // The easing SINGULAR stage (H.W10 G4/S3) is ONE engine-driven hero ball
    // (`.progress-ball.hero-ball`, an AnimationVisualizer ball whose x = the timing
    // function applied to progress — the inv ζ dogfood), NOT a glass card. The old
    // `[class*=rail]` selector matched only the PlaybackRibbon scrubber rail, which is
    // INSIDE the controls pane — hidden when controls are closed (the occlusion gate's
    // default axis) → "subject ABSENT". Target the visible stage subject (the I.W2
    // EasingEditor unification + the G4 singular-stage redesign moved it off the
    // glass-card/rail shape; proof:easing-stage-is-ball asserts the ball is the stage).
    easing: {
        subjectSelector: ".progress-ball, .hero-ball",
        dockFloatAllowed: false,
        // The hero ball is a SWEEPING subject: its x = currentEasingFn(progress)
        // * maxX (proof:easing-stage-is-ball — the inv ζ dogfood). It TRAVERSES the
        // full stage width as the animation plays, so its center is animation-phase-
        // dependent and is SUPPOSED to reach the edges — the static "centered 15–85%"
        // check is both inappropriate AND flaky for it (it'd pass/fail by the capture
        // moment). The render + dock-occlusion checks still apply (the ball must exist
        // + not be dock-covered); only the centering check is skipped.
        sweepingSubject: true,
    },
    spring: {
        subjectSelector: "[class*=glass-card], [class*=Target], [class*=rail]",
        dockFloatAllowed: false,
    },
    // The H.W11 stage scenes — the subject is the glass `<Card>` inside the
    // `.stage-cell` PRIMITIVE (the storyboard/path plate); the broad selector
    // also catches the Target root and any glass-card.
    sequence: {
        subjectSelector: ".stage-cell [data-surface], [class*=Target], [class*=glass-card]",
        dockFloatAllowed: false,
    },
    "motion-path": {
        subjectSelector: ".stage-cell [data-surface], [class*=Target], [class*=glass-card]",
        dockFloatAllowed: false,
    },
};

/**
 * parseScenesManifest — read `scenes.ts` and return the ordered scene records
 * the gates consume: `{ id, superKey }` for `homeScene` then each `scenes[]`
 * descriptor, in declaration order. A pure SOURCE parse (no Vue/TS runtime):
 * comment-blanking + brace-matching over the descriptor object literals, the
 * SAME shape `proof:scene-icons` uses to read the descriptor set — so the
 * manifest and that gate can never drift onto different scene sets.
 *
 * Returns `{ home: {id,superKey}, scenes: [{id,superKey}, …] }`.
 */
function parseScenesManifest() {
    const src = fs.readFileSync(SCENES_TS, "utf8");
    // Blank /* … */ and // … so commented-out / doc-prose descriptors (e.g. the
    // merged starting-style note) never count as a real descriptor.
    const blanked = src
        .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
        .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length));

    // homeScene — its own `const homeScene: SceneDescriptor = { … }`.
    const homeM = blanked.match(/export const homeScene:\s*SceneDescriptor\s*=\s*\{/);
    if (!homeM) {
        throw new Error("demo-driver: could not locate `homeScene` in scenes.ts");
    }
    const home = readObjectAt(blanked, homeM.index + homeM[0].length - 1);

    // The `scenes: SceneDescriptor[] = [ … ]` array.
    const arrM = blanked.match(/export const scenes:\s*SceneDescriptor\[\]\s*=\s*\[/);
    if (!arrM) {
        throw new Error("demo-driver: could not locate the `scenes[]` array in scenes.ts");
    }
    const arrBody = sliceBracketed(blanked, arrM.index + arrM[0].length - 1, "[", "]");
    const scenes = [];
    let d = 0;
    let objStart = -1;
    for (let k = 0; k < arrBody.length; k++) {
        const ch = arrBody[k];
        if (ch === "{") {
            if (d === 0) objStart = k;
            d++;
        } else if (ch === "}") {
            d--;
            if (d === 0 && objStart >= 0) {
                scenes.push(parseDescriptor(arrBody.slice(objStart, k + 1)));
                objStart = -1;
            }
        }
    }
    return { home: parseDescriptor(home), scenes };
}

/** Slice the text BETWEEN the open bracket at `openIdx` and its match. */
function sliceBracketed(text, openIdx, open, close) {
    let depth = 0;
    const start = openIdx + 1;
    for (let i = openIdx; i < text.length; i++) {
        if (text[i] === open) depth++;
        else if (text[i] === close) {
            depth--;
            if (depth === 0) return text.slice(start, i);
        }
    }
    throw new Error("demo-driver: unbalanced bracket in scenes.ts");
}

/** The `{ … }` object literal starting at the `{` at `braceIdx`. */
function readObjectAt(text, braceIdx) {
    return "{" + sliceBracketed(text, braceIdx, "{", "}") + "}";
}

/** Extract `id` + `superKey` (string literals) from one descriptor literal. */
function parseDescriptor(objText) {
    const idM = objText.match(/\bid:\s*(?:HOME_SCENE_ID|["'`]([^"'`]+)["'`])/);
    const skM = objText.match(/\bsuperKey:\s*["'`]([^"'`]+)["'`]/);
    // `id: HOME_SCENE_ID` resolves to "home" (the only symbol-valued id).
    const id = idM ? (idM[1] ?? "home") : null;
    if (!id) throw new Error(`demo-driver: descriptor without an id in scenes.ts: ${objText.slice(0, 60)}`);
    if (!skM) throw new Error(`demo-driver: descriptor "${id}" without a superKey in scenes.ts`);
    return { id, superKey: skM[1] };
}

const manifest = parseScenesManifest();
const sceneRecords = [manifest.home, ...manifest.scenes];
const sceneIds = sceneRecords.map((r) => r.id);

// ── STALE-KEY GUARD (bidirectional key-equality) ──────────────────────────────
// Bind the gate-metadata key set EXACTLY to the parsed scene id set. A drift in
// EITHER direction throws at module load (so every consumer reds loud, not
// silently skips a scene). This is the load-bearing invariant `proof:manifest-
// sourced` re-asserts as a re-runnable gate.
{
    const idSet = new Set(sceneIds);
    const metaKeys = Object.keys(SCENE_GATE_META);
    const staleMeta = metaKeys.filter((k) => !idSet.has(k));
    const unmanifested = sceneIds.filter((id) => !(id in SCENE_GATE_META));
    if (staleMeta.length || unmanifested.length) {
        const parts = [];
        if (unmanifested.length) {
            parts.push(
                `scenes.ts id(s) with NO SCENE_GATE_META entry: ${unmanifested.join(", ")} ` +
                    `(add a { subjectSelector, dockFloatAllowed } entry so the scene is gate-visited)`,
            );
        }
        if (staleMeta.length) {
            parts.push(
                `SCENE_GATE_META key(s) with NO scenes.ts id: ${staleMeta.join(", ")} ` +
                    `(STALE — the scene was removed/renamed in scenes.ts; prune the metadata)`,
            );
        }
        throw new Error(
            "demo-driver: SCENES manifest ≠ scenes.ts ids — " + parts.join(" · "),
        );
    }
}

/**
 * SCENES — the re-sourced manifest the occlusion/capture/lighthouse gates consume.
 * Shape UNCHANGED from the pre-H.W8 hand-maintained array
 * (`{ key, route, subjectSelector, dockFloatAllowed }`); `key` === the scenes.ts
 * id, `route` === the hash route (`""` for home, `id` for the rest — 1:1 with
 * `demo/app/router.ts`). DERIVED from `scenes.ts` so a new scene auto-enrolls.
 */
export const SCENES = sceneRecords.map((r) => ({
    key: r.id,
    route: r.id === "home" ? "" : r.id,
    subjectSelector: SCENE_GATE_META[r.id].subjectSelector,
    dockFloatAllowed: SCENE_GATE_META[r.id].dockFloatAllowed,
    sweepingSubject: SCENE_GATE_META[r.id].sweepingSubject ?? false,
}));

// The route → superKey map the demo's control-options store is keyed by
// (demo/app/scenes.ts). openControlsPanel seeds the store under this key so
// App.vue reads the OPEN state on the next mount. DERIVED from scenes.ts (the
// superKey lives ON each descriptor) so it can never drift from the manifest.
const SUPER_KEY_BY_ROUTE = Object.fromEntries(
    sceneRecords.map((r) => [r.id === "home" ? "" : r.id, r.superKey]),
);
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
    ".map": "application/json",
    ".txt": "text/plain",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
};

/**
 * serveDist — a tiny static http server over the built demo, SPA-fallback to
 * index.html so hash routes resolve. Returns { url, close } where url has no
 * trailing slash (`http://127.0.0.1:<port>`).
 *
 * @param opts  { onMiss } — when provided, a missing path is answered with an
 *              HONEST 404 (never SPA-HTML — the built-product analogue of the
 *              I.W5 S2 dev honesty fix) and `onMiss(urlPath)` records it; the
 *              proof:icon-paint-live zero-asset-404 oracle consumes this. When
 *              absent (the default), misses fall back to index.html so hash
 *              routes resolve.
 */
export function serveDist(distDir, { onMiss } = {}) {
    return new Promise((resolve) => {
        const server = http.createServer((req, res) => {
            const u = decodeURIComponent(new URL(req.url, "http://x").pathname);
            let p = path.join(distDir, u === "/" ? "index.html" : u);
            if (
                !p.startsWith(distDir) ||
                !fs.existsSync(p) ||
                fs.statSync(p).isDirectory()
            ) {
                if (onMiss) {
                    onMiss(u);
                    res.writeHead(404).end();
                    return;
                }
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

// ─────────────────────────────────────────────────────────────────────────────
// J.W3 S1a — THE LIFECYCLE (the ONE open-server → resolve-chromium → newContext
// → run → finally-close shape the census found re-handrolled in ~50 gates;
// gate-census.md GC-1 / §2a).
//
// THE W7-1 REGIME RULE (S6d — un-bypassable at the lib seam): under
// KF_REQUIRE_BROWSER=1 a harness-start failure (chromium unresolvable, dist not
// built) is a FAIL — the lib THROWS (and poisons process.exitCode first, so even
// a swallowed throw cannot exit 0). It is NEVER a note()-skip. When the browser
// half is NOT required, the lifecycle returns `{ skipped: true, reason }` so the
// gate prints its honest skip note and its static half still verdicts.
//
// SIGNAL-SAFE TEARDOWN: every live browser/server is registered in a teardown
// set; SIGINT/SIGTERM/SIGHUP run the teardowns (newest first) before exiting
// with the conventional 128+signal code — no orphaned chromium or port.
// ─────────────────────────────────────────────────────────────────────────────

/** REQUIRE_BROWSER — the KF_REQUIRE_BROWSER=1 flag, read ONCE (the single
 *  authority; no per-gate re-read drift). */
export const REQUIRE_BROWSER = process.env.KF_REQUIRE_BROWSER === "1";

/** The error class the W7-1 rule throws — named so a wrapper can recognise a
 *  harness-start failure (it must NOT be caught-and-noted; exitCode is already
 *  poisoned by the time it is thrown). */
export class HarnessRequiredError extends Error {
    constructor(message) {
        super(message);
        this.name = "HarnessRequiredError";
    }
}

const SIGNAL_EXIT = { SIGINT: 130, SIGTERM: 143, SIGHUP: 129 };
const teardowns = new Set();
let signalsInstalled = false;

/** Register a teardown to run on SIGINT/SIGTERM/SIGHUP; returns an unregister
 *  fn the lifecycle calls on the normal close path. */
function registerTeardown(fn) {
    teardowns.add(fn);
    if (!signalsInstalled) {
        signalsInstalled = true;
        for (const sig of Object.keys(SIGNAL_EXIT)) {
            process.once(sig, async () => {
                for (const t of [...teardowns].reverse()) {
                    try {
                        await t();
                    } catch {
                        /* teardown is best-effort on the signal path */
                    }
                }
                process.exit(SIGNAL_EXIT[sig]);
            });
        }
    }
    return () => teardowns.delete(fn);
}

/** The W7-1 rule, applied at the seam: required ⇒ THROW (exitCode poisoned);
 *  not required ⇒ a structured skip the gate notes honestly. */
function harnessUnavailable(reason, label) {
    if (REQUIRE_BROWSER) {
        process.exitCode = 1;
        throw new HarnessRequiredError(
            `browser half REQUIRED (KF_REQUIRE_BROWSER=1) but ${reason} — ` +
                `${label ?? "the browser-half assertion"} cannot pass vacuously ` +
                `(a note()-skip under KF_REQUIRE_BROWSER=1 is a FAIL — J.W3 S6d / W7-1)`,
        );
    }
    return { skipped: true, reason };
}

/**
 * withBrowser — resolveChromium → launch → `fn(browser)` → finally close.
 * Returns `{ skipped: false, value }` (fn's return) or `{ skipped: true,
 * reason }` when chromium is unresolvable and the browser half is not required
 * (under KF_REQUIRE_BROWSER=1 it THROWS instead — the W7-1 rule).
 *
 * @param fn      async (browser) => value
 * @param opts    { launch = {}, label } — `launch` forwarded to chromium.launch;
 *                `label` names the gate's browser-half assertion in the
 *                required-but-unavailable failure message.
 */
export async function withBrowser(fn, { launch = {}, label } = {}) {
    const chromium = resolveChromium();
    if (!chromium) {
        return harnessUnavailable(
            "playwright not resolvable (set KF_PLAYWRIGHT_DIR or install @playwright/test)",
            label,
        );
    }
    const browser = await chromium.launch(launch);
    const unregister = registerTeardown(() => browser.close());
    try {
        return { skipped: false, value: await fn(browser) };
    } finally {
        unregister();
        await browser.close();
    }
}

/**
 * withPage — the single open-server → resolve-chromium → newContext → run →
 * finally-close lifecycle (spec J.W3 S1a). Serves `opts.distDir` on port 0,
 * launches chromium (via withBrowser), opens ONE context + page, runs
 * `fn(page, { url, server, browser, context })`, and tears everything down in
 * a finally — signal-safe. Returns `{ skipped: false, value }` or the W7-1
 * structured skip / throw (see withBrowser).
 *
 * @param opts  { distDir = <repo>/dist/gh-pages, context = {}, launch = {},
 *              serve = {}, label }
 *              `context` is forwarded to browser.newContext (viewport etc.);
 *              `serve` is forwarded to serveDist (e.g. { onMiss } for the
 *              honest-404 recording oracle).
 * @param fn    async (page, { url, server, browser, context }) => value
 */
export async function withPage(opts, fn) {
    const {
        distDir = path.resolve(
            path.dirname(fileURLToPath(import.meta.url)),
            "../../dist/gh-pages",
        ),
        context: contextOpts = {},
        launch = {},
        serve = {},
        label,
    } = opts ?? {};
    if (!fs.existsSync(path.join(distDir, "index.html"))) {
        return harnessUnavailable(
            "dist/gh-pages not built (run `npm run gh-pages` first)",
            label,
        );
    }
    return withBrowser(
        async (browser) => {
            const server = await serveDist(distDir, serve);
            const unregisterServer = registerTeardown(() => server.close());
            const context = await browser.newContext(contextOpts);
            const unregisterCtx = registerTeardown(() => context.close());
            try {
                const page = await context.newPage();
                return await fn(page, { url: server.url, server, browser, context });
            } finally {
                unregisterCtx();
                unregisterServer();
                await context.close();
                await server.close();
            }
        },
        { launch, label },
    );
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
 * SCENE_MACHINE_KEY — the localStorage key the demo's scene machine persists
 * under (`stores/useSceneMachine.ts`). Exported so every transition-driving
 * gate waits on the SAME machine fact instead of hand-rolling the literal
 * (J.W0 S2 — the per-gate `MACHINE_KEY` copies die with the consolidation).
 */
export const SCENE_MACHINE_KEY = "keyframes-js-scene-machine";

/**
 * navToScene — drive a hash-nav transition + WAIT for the DESTINATION's
 * control-surface to PROJECT (per-EXPECTED-state settle, NOT a fixed
 * `settleMs` / any-trigger-present). The control-tab trigger TEXT lags the
 * route via the mounted scene component's `extraControlTabs` (App.vue), so a
 * trigger-present wait is satisfied by the SOURCE scene's stale surface — the
 * `66855c2` structural no-op. Load-INDEPENDENT by construction: the timeout
 * is a CEILING, each `waitForFunction` returns the instant its predicate
 * holds (fast box), and spends the budget only on a slow runner. The
 * `.catch(() => {})` keeps the oracle HONEST — if the surface genuinely never
 * projects within the ceiling, the wait expires and the CALLER's assertion
 * reads the real (wrong) DOM and reds; only the timing race is removed
 * (J.W0 S2, `ci-linux-open-item.md §4.2`).
 *
 * @param expectedTrigger  the destination's control-tab label (e.g.
 *                         `"Controls"`, `"Easing"`, `"Spring"`), or `null`
 *                         when the scene has no control panel
 *                         (home/sequence/motion-path).
 */
export async function navToScene(
    page,
    sceneId,
    expectedTrigger,
    { timeout = 12000 } = {},
) {
    await page.evaluate((s) => {
        location.hash = "#/" + s;
    }, sceneId);
    // 1. machine activeScene rests on target (the EARLY fact — necessary,
    //    not sufficient).
    await page
        .waitForFunction(
            ([mk, id]) => {
                try {
                    return (
                        JSON.parse(localStorage.getItem(mk) || "{}")
                            .activeScene === id
                    );
                } catch {
                    return false;
                }
            },
            [SCENE_MACHINE_KEY, sceneId],
            { timeout },
        )
        .catch(() => {});
    // 2. the DESTINATION control surface has PROJECTED (the LATE fact — the
    //    cure for the stale-trigger race).
    await page
        .waitForFunction(
            (expected) => {
                const trig = document.querySelector(
                    "[aria-label='Controls tab']",
                );
                const text = trig?.textContent?.trim() || null;
                return expected === null ? !trig : text === expected;
            },
            expectedTrigger,
            { timeout },
        )
        .catch(() => {});
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
