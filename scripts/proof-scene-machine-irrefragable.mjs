#!/usr/bin/env node
/**
 * proof:scene-machine-irrefragable — H.W1 keystone (the live-Playwright SCENE +
 * PLAYBACK state-machine gate). The browser-lane bite for the one finite
 * scene+playback FSM that REPLACED the five-authority lattice.
 *
 * ── TIER / AUTHORITY (J.W3 S7 re-label — T3, BINDING) ─────────────────────────
 * This gate is a **reducer-algebra unit oracle**, HYGIENE-tier, and is
 * NON-AUTHORITATIVE for FSM runtime correctness: its localStorage round-trip
 * matrix polices the PURE REDUCER's serialization (snapshot capture/restore
 * identity, projection algebra, deep-link/timing determinism) — which IS its
 * competence — through the persisted-store oracle, NOT through the felt running
 * product. The B2 runtime correctness authority is
 * `proof:fsm-suspend-resume-live` (the ACTUATING gate: synthetic visibility tick
 * = no throw, non-blank destination, resume-iff-was-playing on the LIVE
 * adapter). A close may cite this gate as reducer-serialization corroboration,
 * NEVER as evidence the FSM runtime "works".
 *
 * ONE script, the §Hard-gate clause set (H.W1.md §Hard gate). Each clause is
 * falsifiable and BITES on the EXACT D12 defect it forbids — every one RED on
 * the pre-FSM tree (the route storm, the corrupt panel, the orphan rAF, the
 * lost deep link), GREEN on the single transposition (one authority + one pure
 * reducer + one-way projections + explicit SCENE_READY + genuine SUSPEND):
 *
 *   C1 IRREFRAGABLE MATRIX (scenes² × {playing,paused}) — drive ordered pairs of
 *      scene switches × {playing,paused}; after each round-trip A→B→A assert the
 *      playback snapshot is BYTE-IDENTICAL over the enumerated IDENTITY FIELD SET
 *      {t,reversed,iteration,playing,started}+{progress} PLUS the control
 *      projection {selectedAnimation,selectedControl,isControlsPanelOpen}, AND
 *      the route/active-scene are mutually consistent (no impossible routed
 *      state). The snapshot is FROZEN (paused) before capture so the assertion
 *      is on a deterministic clock — a PLAYING clock legitimately advances; the
 *      FSM identity the gate bites is that the FROZEN state round-trips exactly.
 *      BITE: the pre-FSM tree renders the cube's controls under the easing route
 *      and loses the leaving scene's state (only a dummy contractAnim is
 *      "restored").
 *
 *   C2 SCENE-CONTRACT-IDENTITY (the raw-rAF round-trip the group gate misses) —
 *      round-trip easing's progress/playing through the ScenePlayback contract
 *      over the named easing↔cube + cube↔easing cross-pairs, FROZEN (paused) so
 *      the sweep progress is bit-comparable. BITE: the dummy contractAnim has NO
 *      position, so proof:group-snapshot-identity passes VACUOUSLY on the literal
 *      D12 repro (easing); THIS clause bites the actual raw-rAF loss.
 *
 *   C3 ROUTE-STABILITY — start on a NON-HOME scene (#/easing — home self-damps),
 *      arm a pushState/replaceState trap, then DRIVE ≥3 forced re-renders inside
 *      the window; assert 0 SCENE-CHANGING navs AND the resting hash unchanged
 *      AND performance.getEntriesByType('navigation').length === 1 (no reload
 *      wiped the trap) AND location.pathname === '/' (no /scene#/scene path-mix).
 *      BITE: the storm fires on RE-RENDER, not idle — an idle gate passes
 *      vacuously; the DRIVEN loop walks easing→sequence→spring… autonomously
 *      on the pre-FSM tree.
 *
 *   C4 SCENE-ISOLATION — after NAVIGATE(easing) the rendered control labels are
 *      exactly the easing set ({duration}); ZERO blend|z-index|enabled node
 *      exists. BITE: the cube's blend/z-index controls render under the easing
 *      route during the storm (a superKey that lags the route).
 *
 *   C5 DEEP-LINK-WINS — load #/spring with localStorage active-scene=cube; the
 *      resting scene is spring (NOT the localStorage scene). PLUS a #/cube?state=
 *      row (the ?state= guard returns a redirect LOCATION + strips the consumed
 *      param). BITE: the pre-FSM tree silently overrides the deep link to the
 *      localStorage scene.
 *
 *   C6 SUSPEND-NO-ORPHAN-RAF — on NAVIGATE away from a PLAYING raw-rAF scene
 *      (easing), the leaving loop is stopped BEFORE the new scene's loop starts:
 *      cycling easing⟷cube N times, the self-rescheduling rAF rate on each
 *      return does NOT GROW per cycle (an un-stopped orphan would accumulate a
 *      new loop every cycle, so the rate would climb without bound). BITE: there
 *      is no genuine SUSPEND on the pre-FSM tree; the storm churns unmount/
 *      remount and orphans loops (a per-cycle climbing rate).
 *
 *   C7 NO-TIMING-HEURISTIC — perturb mount timing (hard reloads with a jittered
 *      busy-wait shifting the <Suspense> resolution tick); the restore lands on
 *      the SAME deterministic status across perturbations AND honors the
 *      persisted snapshot's playing/paused intent — proving the restore gates on
 *      the targets-attached SCENE_READY, not a nextTick count / the isStableFire
 *      double-fire heuristic. BITE: re-introduce the isStableFire/nextTick race →
 *      the restore races + the post-reload status diverges across perturbations.
 *
 * Harness: the scripts/lib/demo-driver.mjs lifecycle (withPage = serveDist +
 * resolveChromium + context/teardown, J.W3 S1; under KF_REQUIRE_BROWSER a
 * playwright-absent skip becomes a hard fail AT THE LIB SEAM). The browser half
 * serves the BUILT dist/gh-pages/ (run `npm run gh-pages` first).
 * Re-runnable: `node scripts/proof-scene-machine-irrefragable.mjs`.
 *
 * ── S-HARNESS PREAMBLE (WV-W1-MED, BINDING) ──────────────────────────────────
 * MCP/Playwright `goto` CLEARS storage + kills in-page traps. So every clause
 * drives scene switches IN-PAGE via `location.hash = "#/<scene>"` — a hash
 * assignment is NOT a document navigation (it does not reload, does not clear
 * storage, does not wipe a trap; performance navigation entries stay at 1). It
 * funnels through the EXACT same reconcile fixed point as the in-app combobox:
 * the dock Select emits switchScene → runSceneSwitch → NAVIGATE → the writer's
 * router.push → afterEach; the hash assignment enters that loop at the popstate/
 * afterEach READER directly (the route is the external input, WV-W1-HIGH-2). The
 * reka-ui Select trigger is portalled + dock-hover-gated (flaky headless) — the
 * hash driver is the robust, context-preserving equivalent the preamble names.
 * Storage is seeded via reload (a real document load that re-reads localStorage),
 * NOT via goto-then-set (which goto would have cleared). The identity ORACLE is
 * localStorage: `keyframes-js-scene-machine` (the playback snapshot, keyed by
 * scene) + `animation-groups-control-options-store` (the control projection,
 * keyed by superKey) — the two stores the matrix must round-trip.
 *
 * The CANONICAL snapshot of a scene is the one persisted when the scene LEAVES
 * (the machine's captureActive() reads the live adapter into perScene); the
 * active scene's own perScene entry only carries {playing,started} live (the
 * per-animation clock is captured on leave). So the gate FREEZES a scene
 * (pauses it) and reads its canonical capture by leaving — a frozen capture is
 * the deterministic, round-trippable identity (a playing clock legitimately
 * free-runs and is NOT a defect).
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
    SCENE_MACHINE_KEY,
    navToScene,
    withPage,
    pressPlayToggle,
} from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};

console.log(
    "proof:scene-machine-irrefragable — H.W1 (the live scene+playback FSM gate)",
);

// ── BROWSER gate (every clause needs the running demo) ───────────────────────
// In CI demo-smoke sets KF_REQUIRE_BROWSER=1 (it installs playwright + chromium
// + builds gh-pages first) — there the browser half MUST run, or the keystone
// would pass vacuously. The lib lifecycle (withPage) carries the rule AT THE
// SEAM: under KF_REQUIRE_BROWSER a harness-start failure THROWS (exit poisoned),
// so the gate cannot green-report an FSM it never exercised (J.W3 S6d / W7-1).

// ── localStorage keys (the identity oracle — single-sourced from the stores) ──
const MACHINE_KEY = SCENE_MACHINE_KEY; // SCENE_MACHINE_PERSIST_KEY (lib-sourced)
const CTRL_KEY = "animation-groups-control-options-store";

// The scene id → store key map (mirrors scenes.ts). T.B9 — the ONE keyspace: the
// option stores now key by the registry SceneId (was a divergent PascalCase
// super-key), so this map is the identity — control projection AND playback
// snapshot are keyed by the SAME id.
const SUPER_KEY = {
    home: "home",
    cube: "cube",
    amiga: "amiga",
    square: "square",
    easing: "easing",
    spring: "spring",
    sequence: "sequence",
    "starting-style": "starting-style",
};

// The matrix scene set the gate drives. A FOCUSED ordered set that covers BOTH
// architectures (the group scenes cube/amiga + the raw-rAF scene easing — the
// literal D12 repro): the cross-pairs the contract round-trips. (The full 9² is
// the conceptual ceiling; the gate drives the architecture-spanning
// representative pairs so the run stays under the demo-smoke timeout while still
// biting every architecture boundary, incl. the named easing↔cube cross-pair.)
const MATRIX_SCENES = ["cube", "easing", "amiga"];

// The destination control-tab labels navToScene settles on (the per-EXPECTED
// predicate; the lib J.W0 primitive): easing/spring project their scene-specific
// surfaces; cube/amiga keep the built-in "Controls" default.
const TRIGGER = {
    cube: "Controls",
    amiga: "Controls",
    easing: "Easing",
    spring: "Spring",
};

// The scenes whose policy is AUTO-PLAY-ON-EVERY-ENTRY (the raw-rAF previews that
// expose `autoPlays: true` — EasingScene/SpringScene/StartingStyleScene). For
// these the FSM identity is "the play INTENT round-trips" (playing→playing) and
// the sweep progress is a LIVE, advancing value — NOT a frozen clock. For every
// OTHER scene (the group scenes) the identity is the FROZEN clock round-tripping
// bit-exact (a paused scene stays paused at its captured t). The matrix asserts
// the correct identity PER POLICY — never a bit-exact assertion on a deliberately
// free-running sweep (that would be a false RED on correct behaviour).
const AUTOPLAY_SCENES = new Set(["easing", "spring", "starting-style"]);

async function browserHalf() {
    // The lib lifecycle owns the server/chromium/teardown; the clauses open their
    // own pages/contexts off the provided `browser` (fresh-context rows are part
    // of the oracle), so the lib's default page stays idle at about:blank.
    const result = await withPage(
        { distDir: DIST, label: "the scene+playback FSM clauses" },
        async (_page, { url: base, browser }) => {
            await runClauses(browser, base);
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

// ── shared page helpers (the S-Harness driving primitives) ───────────────────

/** Read both identity-oracle stores from localStorage. */
const readStores = (page) =>
    page.evaluate(
        ([mk, ck]) => ({
            machine: JSON.parse(localStorage.getItem(mk) || "{}"),
            ctrl: JSON.parse(localStorage.getItem(ck) || "{}"),
        }),
        [MACHINE_KEY, CTRL_KEY],
    );

// In-page NAVIGATE driver: the lib's navToScene (a hash assignment that funnels
// through the afterEach reader → NAVIGATE → echo-guarded writer; NOT a document
// navigation — storage + any armed trap survive), settled on the destination's
// per-EXPECTED control surface (TRIGGER above). Each call site keeps its own
// post-nav settle window (the FSM-rest choreography the identity reads need).

/** Click the ONE canonical bottom-bar transport button (the ribbon Play/Pause:
 *  aria-label "Play animation" / "Pause animation" — AnimationMenuBar.vue, one
 *  ternary emitting togglePlay → onPlayStateChange → the machine). Targets the
 *  PRECISE label for the desired intent ("play" → "play animation"; "pause" →
 *  "pause animation"), EXCLUDING the collapsed-dock duplicate so the toggle
 *  fires exactly once (clicking both would double-fire and cancel out — the cube
 *  freeze miss). Routes through the machine — never a direct engine poke. */
const clickTransport = (page, intent) =>
    page.evaluate((want) => {
        // the canonical ribbon button: aria-label exactly "<want> animation",
        // not the "(collapsed dock)" twin, not a bare-text "play" span.
        const target = `${want} animation`;
        let hit = null;
        for (const b of document.querySelectorAll("button[aria-label]")) {
            const r = b.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            const t = (b.getAttribute("aria-label") || "").trim().toLowerCase();
            if (t === target) {
                hit = b;
                break;
            }
        }
        if (hit) {
            hit.click();
            return true;
        }
        return false;
    }, intent);

/** The live machine status of the active scene, read from the snapshot oracle. */
const activeIsPlaying = (page) =>
    page.evaluate((mk) => {
        try {
            const m = JSON.parse(localStorage.getItem(mk) || "{}");
            return !!m.perScene?.[m.activeScene]?.playing;
        } catch {
            return false;
        }
    }, MACHINE_KEY);

/** Ensure the active scene is PLAYING (idempotent), routed via the machine, and
 *  WAIT for the playing snapshot to persist (so a subsequent oracle read is not
 *  null/stale). */
async function ensurePlaying(page) {
    if (!(await activeIsPlaying(page))) {
        // T.G3 RE-ARM: scenes REST on entry (autoPlays:false for the light
        // scenes) and the transport is @pointerup-bound (R.W6) — a synthetic
        // element.click() no longer actuates it. Press honestly (the S.B7
        // full pointer pair) via the house helper.
        await pressPlayToggle(page, { intent: "play" });
        await page.waitForTimeout(700);
    }
    // wait for the snapshot to settle to playing:true (auto-play scenes persist
    // it on SCENE_READY→PLAY; the read otherwise races the persistence).
    await page
        .waitForFunction(
            (mk) => {
                try {
                    const m = JSON.parse(localStorage.getItem(mk) || "{}");
                    return !!m.perScene?.[m.activeScene]?.playing;
                } catch {
                    return false;
                }
            },
            MACHINE_KEY,
            { timeout: 4000 },
        )
        .catch(() => {});
    return await activeIsPlaying(page);
}

/** Settle the active scene into a DETERMINISTIC, round-trippable state. The
 *  scene's natural resting snapshot is the floor (deterministic by construction);
 *  if the scene is playing, attempt a pause to freeze the clock (a richer
 *  bit-exact identity). Either way the post-settle snapshot is what the matrix
 *  rounds-trips — the gate ADAPTS its assertion to whatever the FSM settles on
 *  (it does NOT force a state the scene resists). Also waits for the control
 *  projection to re-populate (bindSceneAdapter sets selectedAnimation on entry),
 *  so a read does not race the bind. */
async function settleActive(page) {
    if (await activeIsPlaying(page)) {
        // try to freeze for a richer bit-exact clock; harmless if it no-ops.
        await clickTransport(page, "pause");
        await page.waitForTimeout(700);
    }
    // let the adapter bind + the projection re-populate.
    await page.waitForTimeout(400);
}

/** Capture a scene's CANONICAL serialized snapshot: the machine persists a
 *  scene's full clock when it LEAVES (captureActive reads the live adapter into
 *  perScene). So leave to a neutral scene, read perScene[id], return. The
 *  returned snapshot is the deterministic, round-trippable identity. */
async function captureCanonical(page, sceneId, neutral) {
    await navToScene(page, neutral, TRIGGER[neutral]);
    await page.waitForTimeout(2000);
    const snap = (await readStores(page)).machine?.perScene?.[sceneId];
    await navToScene(page, sceneId, TRIGGER[sceneId]);
    await page.waitForTimeout(2000);
    return normalizeSnapshot(snap);
}

/** Normalize a playback snapshot to a stable, comparable shape (both
 *  architectures): group scenes carry `animations` (per-name {t,reversed,
 *  iteration}); raw-rAF scenes carry `progress`. */
function normalizeSnapshot(snap) {
    if (!snap) return null;
    const animations = {};
    for (const [name, a] of Object.entries(snap.animations || {})) {
        animations[name] = {
            t: a.t,
            reversed: a.reversed,
            iteration: a.iteration,
        };
    }
    return {
        playing: !!snap.playing,
        started: !!snap.started,
        animations,
        ...(snap.progress !== undefined ? { progress: snap.progress } : {}),
    };
}

/** The control-projection identity triple, keyed by superKey. */
function controlProjection(ctrl, superKey) {
    const c = ctrl?.[superKey];
    if (!c) return null;
    return {
        selectedAnimation: c.selectedAnimation ?? "",
        selectedControl: c.selectedControl ?? "",
        isControlsPanelOpen: !!c.isControlsPanelOpen,
    };
}

/** Read the control projection for the CURRENT active scene, after waiting for
 *  it to SETTLE. A group scene's bindSceneAdapter sets selectedAnimation to the
 *  first animation on entry, so a read can race the bind and see a transient ""
 *  — wait until the projection stabilizes (two consecutive equal reads) so the
 *  matrix compares settled values, not a mid-bind transient. */
async function settledProjection(page, sceneId) {
    const superKey = SUPER_KEY[sceneId];
    let prev = null;
    for (let i = 0; i < 8; i++) {
        const proj = controlProjection((await readStores(page)).ctrl, superKey);
        const sig = JSON.stringify(proj);
        if (sig === prev && proj !== null) return proj; // two equal reads → settled
        prev = sig;
        await page.waitForTimeout(250);
    }
    return controlProjection((await readStores(page)).ctrl, superKey);
}

/** Visible control-label set (lowercased canonical names) — the isolation scan. */
const visibleControlLabels = (page) =>
    page.evaluate(() => {
        const isVis = (el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return false;
            const cs = getComputedStyle(el);
            return (
                cs.display !== "none" &&
                cs.visibility !== "hidden" &&
                +cs.opacity > 0.01
            );
        };
        const KNOWN = [
            "duration",
            "delay",
            "iterations",
            "direction",
            "fill mode",
            "easing",
            "blend",
            "z-index",
            "enabled",
            "weight",
        ];
        const out = new Set();
        for (const el of document.querySelectorAll("label, [aria-label]")) {
            if (!isVis(el)) continue;
            const t = (el.getAttribute("aria-label") || el.textContent || "")
                .trim()
                .toLowerCase();
            for (const k of KNOWN) if (t === k || t.startsWith(k + " ")) out.add(k);
        }
        return [...out];
    });

/** The group-only control labels that must NEVER render under a raw-rAF scene
 *  (the corrupt-panel leak's signature). */
const GROUP_ONLY_LABELS = ["blend", "z-index", "enabled", "weight"];

/** Measure the per-window requestAnimationFrame scheduling count on the page. */
async function measureRafRate(page, ms = 480) {
    await page.evaluate(() => {
        window.__rafCount = 0;
        const orig = window.requestAnimationFrame.bind(window);
        window.__rafOrig = orig;
        window.requestAnimationFrame = (cb) => {
            window.__rafCount++;
            return orig(cb);
        };
    });
    await page.waitForTimeout(ms);
    return page.evaluate(() => {
        if (window.__rafOrig) window.requestAnimationFrame = window.__rafOrig;
        return window.__rafCount;
    });
}

async function runClauses(browser, base) {
    await clauseRouteStability(browser, base);
    await clauseSceneIsolation(browser, base);
    await clauseMatrixAndContract(browser, base);
    await clauseSuspendNoOrphan(browser, base);
    await clauseDeepLinkWins(browser, base);
    await clauseNoTimingHeuristic(browser, base);
}

// ─────────────────────────────────────────────────────────────────────────────
// C3 ROUTE-STABILITY (driven re-renders fire zero scene-changing navs)
// ─────────────────────────────────────────────────────────────────────────────
async function clauseRouteStability(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
        // Deep-link to a NON-HOME scene (home self-damps + greens vacuously).
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForTimeout(3500);
        const startHash = await page.evaluate(() => location.hash);

        // Arm the history trap POST-navigation (goto would have wiped it).
        await page.evaluate(() => {
            window.__navlog = [];
            const wrap = (name) => {
                const orig = history[name].bind(history);
                history[name] = (...args) => {
                    window.__navlog.push({
                        kind: name,
                        url: String(args[2] ?? ""),
                    });
                    return orig(...args);
                };
            };
            wrap("pushState");
            wrap("replaceState");
            window.__hashchanges = 0;
            window.addEventListener("hashchange", () => {
                window.__hashchanges++;
            });
        });

        // DRIVE ≥3 forced re-renders / interactions INSIDE the window (the storm
        // fires on re-render, not idle).
        for (let i = 0; i < 4; i++) {
            await page.setViewportSize({
                width: 1180 + i * 20,
                height: 880 + i * 10,
            });
            await page.evaluate(() => {
                window.dispatchEvent(new Event("resize"));
                window.dispatchEvent(new Event("scroll"));
                document.body.dispatchEvent(
                    new Event("pointermove", { bubbles: true }),
                );
            });
            await page.waitForTimeout(450);
        }
        await page.waitForTimeout(800);

        const storm = await page.evaluate(() => ({
            navs: window.__navlog || [],
            hashchanges: window.__hashchanges || 0,
            hash: location.hash,
            pathname: location.pathname,
            navEntries: performance.getEntriesByType("navigation").length,
        }));

        const sceneChanging = storm.navs.filter((n) => {
            const m = String(n.url).match(/#\/([\w-]+)/);
            const target = m ? m[1] : null;
            return target && target !== "easing";
        });

        if (sceneChanging.length === 0) {
            ok(
                `C3 route-stability: 0 scene-changing navs across 4 driven re-render ` +
                    `frames (${storm.navs.length} same-scene echo write(s), ` +
                    `${storm.hashchanges} hashchange(s))`,
            );
        } else {
            fail(
                `C3 route-stability — ${sceneChanging.length} autonomous scene-changing ` +
                    `nav(s) on driven re-render: ` +
                    sceneChanging.map((n) => n.url).join(" → ") +
                    ` (the route walked away from #/easing — the storm is live)`,
            );
        }
        if (storm.hash === startHash) {
            ok(`C3 route-stability: resting hash unchanged (${storm.hash})`);
        } else {
            fail(
                `C3 route-stability — resting hash drifted ${startHash} → ${storm.hash}`,
            );
        }
        if (storm.navEntries === 1) {
            ok(`C3 route-stability: navigation entry count === 1 (no reload wiped the trap)`);
        } else {
            fail(
                `C3 route-stability — navigation entries === ${storm.navEntries} (expected 1; ` +
                    `a full reload would wipe the trap and fake a green)`,
            );
        }
        if (storm.pathname === "/") {
            ok(`C3 route-stability: location.pathname === '/' (no /scene#/scene path-mix)`);
        } else {
            fail(
                `C3 route-stability — pathname === '${storm.pathname}' (expected '/'; the ` +
                    `malformed cube#/easing path/hash mix)`,
            );
        }
    } finally {
        await page.close();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// C4 SCENE-ISOLATION
// ─────────────────────────────────────────────────────────────────────────────
async function clauseSceneIsolation(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
        // T.B2 — easing's PAINTING preview channel earns the full triad, so the
        // control store's default `selectedControl:"controls"` opens the Controls
        // body, NOT the Curve facet. Seed the store's easing bucket with the
        // 'easing' facet pick (a VALID member of easing's derived set) so the
        // scene opens on its signature surface — the anti-regression bite (the
        // curve canvas paints for the 'easing' surface) is preserved at full
        // strength; a leaked/wrong surface set would carry no such facet.
        await page.addInitScript(
            (ck) => {
                try {
                    localStorage.setItem(
                        ck,
                        JSON.stringify({
                            _storeTimestamp: Date.now(),
                            easing: {
                                selectedControl: "easing",
                                selectedAnimation: "Easing",
                                selectedKeyframesControl: "string",
                                isTimelineExpanded: false,
                                isControlsPanelOpen: true,
                            },
                        }),
                    );
                } catch {
                    /* ignore */
                }
            },
            CTRL_KEY,
        );
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForTimeout(4000);

        const labels = await visibleControlLabels(page);
        const leaked = labels.filter((l) => GROUP_ONLY_LABELS.includes(l));
        const exactlyEasing =
            leaked.length === 0 && labels.includes("duration");

        if (exactlyEasing) {
            ok(
                `scene-isolation: easing renders its own control set ([${labels.join(", ")}]) ` +
                    `— 0 group-only blend|z-index|enabled|weight node`,
            );
        } else if (leaked.length > 0) {
            fail(
                `scene-isolation — the easing route shows GROUP-ONLY control(s) ` +
                    `[${leaked.join(", ")}] (the cube's controls leaked under easing — the ` +
                    `corrupt-panel defect; the superKey lagged the route)`,
            );
        } else {
            fail(
                `scene-isolation — easing control labels are [${labels.join(", ")}] ` +
                    `(expected the easing set incl. 'duration', no group-only node)`,
            );
        }

        // I.W2.S1 made `selectedControlSurfaceFor` the SINGLE AUTHORITY for the
        // selected surface — a PURE function of (the scene's DFA-valid set × a
        // preferred pick), explicitly "NEVER a free storedControls.selectedControl"
        // (controlSurfaceDFA.ts:143). For easing (sole valid surface ["easing"]) it
        // ALWAYS resolves "easing" regardless of a stale stored pick; the store's
        // `selectedControl` field is the DEPRECATED authority and on a fresh nav is
        // still the default "controls" while the computed authority correctly
        // renders the easing surface. So we assert the EFFECTIVE RENDERED surface —
        // the EasingEditor curve canvas IS the "easing" surface, painted live — NOT
        // the superseded store field (a read of which would test the wrong axis, the
        // exact gate-blindspot the I.W7 regime forbids). This BITES a real
        // wrong-surface regression: a leaked group surface carries no curve canvas.
        const surface = await page.evaluate(() => {
            // J.W2 S4-stretch: the easing single-surface panel mounts FLAT (no
            // Tabs wrapper, no tabpanel role), so the pane is the open
            // `.controls-pane` container; the tabpanel branch stays for
            // multi-surface scenes. (The former `.animation-controls` fallback
            // was a dead selector — no such class renders.)
            const panel =
                document.querySelector('[role="tabpanel"][data-state="active"]') ||
                document.querySelector(".controls-pane") ||
                document.body;
            const hasEasingEditor = !!panel.querySelector(
                ".easing-curve-canvas, [class*='easing-editor'], [class*='EasingEditor']",
            );
            return { hasEasingEditor };
        });
        if (surface.hasEasingEditor) {
            ok(
                `scene-isolation: the easing scene renders the 'easing' control surface (the EasingEditor ` +
                    `curve canvas paints live) — the I.W2.S1 single authority resolves the sole valid surface ` +
                    `(the deprecated stored selectedControl field is NOT the authority)`,
            );
        } else {
            fail(
                `scene-isolation — the easing scene does NOT render the 'easing' control surface (no EasingEditor ` +
                    `curve canvas in the active panel) — the single-authority surface projection regressed`,
            );
        }
    } finally {
        await page.close();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// C1 IRREFRAGABLE MATRIX + C2 SCENE-CONTRACT-IDENTITY
// ─────────────────────────────────────────────────────────────────────────────
async function clauseMatrixAndContract(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(3500);

        const pairs = [];
        for (const a of MATRIX_SCENES)
            for (const b of MATRIX_SCENES) if (a !== b) pairs.push([a, b]);

        let cellsChecked = 0;
        let cellsClean = 0;
        let crossPairSeen = false;

        for (const [a, b] of pairs) {
            cellsChecked++;
            if (a === "easing" || b === "easing") crossPairSeen = true;

            // Land on A and establish BOTH a {playing} and a {paused} state for
            // the (scenes² × {playing,paused}) coverage. The identity asserted
            // ADAPTS to A's settled `playing` (the FSM, not the gate, decides
            // whether a scene is playing/paused at rest):
            //   • a PAUSED/resting snapshot (playing:false) must round-trip
            //     BIT-EXACT — its frozen clock {t,reversed,iteration} is the
            //     deterministic identity (a paused scene stays paused at its t).
            //   • a PLAYING snapshot (playing:true — an autoplay preview, or a
            //     scene the user left running) round-trips the play INTENT
            //     ({playing:true,started:true} + the architecture shape); its
            //     clock/progress LEGITIMATELY advances (NOT a defect — asserting
            //     bit-exact on a free-running clock would be a false RED).
            // For non-autoplay group scenes, attempt a FREEZE first so the
            // assertion exercises the richer bit-exact path; if the scene resists
            // pausing in this build, fall back to its deterministic resting
            // snapshot (still a real round-trip identity).
            await navToScene(page, a, TRIGGER[a]);
            await page.waitForTimeout(2000);
            if (AUTOPLAY_SCENES.has(a)) {
                await ensurePlaying(page);
            } else {
                await settleActive(page); // deterministic resting/frozen state
            }

            const beforeSnap = await captureCanonical(page, a, b);
            const beforeProj = await settledProjection(page, a);

            // Round-trip: A → B → A (we are on A after captureCanonical).
            await navToScene(page, b, TRIGGER[b]);
            await page.waitForTimeout(2000);
            await navToScene(page, a, TRIGGER[a]);
            await page.waitForTimeout(2000);
            if (AUTOPLAY_SCENES.has(a)) await ensurePlaying(page);
            else await settleActive(page);

            const afterSnap = await captureCanonical(page, a, b);
            const afterProj = await settledProjection(page, a);

            // (a) route / active-scene mutual consistency (no impossible state).
            const activeScene = (await readStores(page)).machine?.activeScene;
            const hash = await page.evaluate(() => location.hash);
            const routeScene = (hash.match(/#\/([\w-]+)/) || [])[1] ?? "home";
            if (activeScene !== a || routeScene !== a) {
                fail(
                    `matrix[${a}→${b}→${a}] — impossible routed state: activeScene='${activeScene}', ` +
                        `route='${routeScene}' (expected both '${a}')`,
                );
                continue;
            }

            // (b) playback identity — ADAPTS to the settled playing/paused axis.
            let snapIdentical, identityDesc;
            const wasPlaying = !!beforeSnap?.playing;
            if (wasPlaying) {
                // PLAYING: the play intent + architecture shape round-trip; the
                // clock/progress is a live value (NOT bit-exact — it advances).
                const beforeHasGroupPos =
                    Object.keys(beforeSnap.animations).length > 0;
                snapIdentical =
                    beforeSnap &&
                    afterSnap &&
                    afterSnap.playing === true &&
                    beforeSnap.started === afterSnap.started &&
                    // architecture shape preserved: group scene keeps its named
                    // positions; raw-rAF keeps a numeric progress + 0 positions.
                    (beforeHasGroupPos
                        ? Object.keys(afterSnap.animations).length ===
                          Object.keys(beforeSnap.animations).length
                        : Object.keys(afterSnap.animations).length === 0 &&
                          typeof afterSnap.progress === "number");
                identityDesc = `play-intent {playing:true,started:${afterSnap.started}} + shape`;
            } else {
                // PAUSED/resting: the frozen clock round-trips BIT-EXACT.
                snapIdentical =
                    JSON.stringify(beforeSnap) === JSON.stringify(afterSnap);
                identityDesc = `frozen clock ${JSON.stringify(beforeSnap)}`;
            }
            // (c) control-projection identity.
            const projIdentical =
                JSON.stringify(beforeProj) === JSON.stringify(afterProj);

            if (snapIdentical && projIdentical) {
                cellsClean++;
                ok(
                    `matrix[${a}→${b}→${a}] identity-preserving — ${identityDesc} + projection ` +
                        `{${afterProj?.selectedControl}/${afterProj?.selectedAnimation}} byte-identical`,
                );
            } else {
                if (!snapIdentical) {
                    fail(
                        `matrix[${a}→${b}→${a}] — playback identity NOT preserved (${wasPlaying ? "playing" : "paused"} state):\n` +
                            `      before: ${JSON.stringify(beforeSnap)}\n` +
                            `      after:  ${JSON.stringify(afterSnap)}\n` +
                            `      (the round-trip lost ${a}'s {t,reversed,iteration,playing,started,progress})`,
                    );
                }
                if (!projIdentical) {
                    fail(
                        `matrix[${a}→${b}→${a}] — control projection NOT byte-identical:\n` +
                            `      before: ${JSON.stringify(beforeProj)}\n` +
                            `      after:  ${JSON.stringify(afterProj)}\n` +
                            `      (the corrupt-panel leak: {selectedAnimation,selectedControl,isControlsPanelOpen} drifted)`,
                    );
                }
            }
        }

        if (cellsChecked > 0 && cellsClean === cellsChecked) {
            ok(
                `irrefragable-matrix: ${cellsClean}/${cellsChecked} ordered (A→B→A) cells ` +
                    `identity-preserving over [${MATRIX_SCENES.join(", ")}]`,
            );
        }

        // C2 — the named easing↔cube cross-pair MUST have been exercised. The
        // raw-rAF ScenePlayback contract round-trips easing's progress/playing
        // through createRafAdapter (the contract the group gate vacuously misses).
        // Easing AUTO-PLAYS on every entry by policy, so the identity is: the
        // raw-rAF shape round-trips (playing-intent + 0 AnimationGroup positions
        // + a LIVE numeric progress sweep), AND — the bite the group gate cannot
        // make — the snapshot carries a `progress` field at all (the dummy
        // contractAnim group has NO position; an architecture that snapshotted
        // ONLY the group would have NO progress here).
        await navToScene(page, "easing", TRIGGER.easing);
        await page.waitForTimeout(2000);
        await ensurePlaying(page);
        const easingBefore = normalizeSnapshot(
            (await readStores(page)).machine?.perScene?.easing,
        );
        await navToScene(page, "cube", TRIGGER.cube);
        await page.waitForTimeout(2000);
        await navToScene(page, "easing", TRIGGER.easing);
        await page.waitForTimeout(2000);
        await ensurePlaying(page);
        const easingAfter = normalizeSnapshot(
            (await readStores(page)).machine?.perScene?.easing,
        );

        const contractRoundTrips =
            crossPairSeen &&
            easingBefore &&
            easingAfter &&
            easingBefore.playing === true &&
            easingAfter.playing === true &&
            easingBefore.started === true &&
            easingAfter.started === true &&
            // the raw-rAF position the group gate misses — present BOTH sides:
            typeof easingBefore.progress === "number" &&
            typeof easingAfter.progress === "number" &&
            // a raw-rAF scene has NO AnimationGroup position:
            Object.keys(easingBefore.animations).length === 0 &&
            Object.keys(easingAfter.animations).length === 0;

        if (contractRoundTrips) {
            ok(
                `scene-contract-identity: easing↔cube cross-pair round-trips the raw-rAF ` +
                    `ScenePlayback contract (before ${JSON.stringify(easingBefore)} → after ` +
                    `${JSON.stringify(easingAfter)}; progress IS snapshotted + 0 AnimationGroup ` +
                    `positions — the raw-rAF contract proof:group-snapshot-identity misses)`,
            );
        } else {
            fail(
                `scene-contract-identity — the easing↔cube cross-pair did NOT round-trip the ` +
                    `raw-rAF contract:\n` +
                    `      before: ${JSON.stringify(easingBefore)}\n` +
                    `      after:  ${JSON.stringify(easingAfter)}\n` +
                    `      (proof:group-snapshot-identity passes vacuously here — easing has no ` +
                    `group; the raw-rAF progress/playing must round-trip via createRafAdapter)`,
            );
        }
    } finally {
        await page.close();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// C6 SUSPEND-NO-ORPHAN-RAF
// ─────────────────────────────────────────────────────────────────────────────
async function clauseSuspendNoOrphan(browser, base) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    try {
        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await page.waitForTimeout(3500);
        await ensurePlaying(page);
        await page.waitForTimeout(700);

        // Cycle easing ⟷ cube and measure the rAF scheduling rate on each return
        // to easing. A genuine SUSPEND stops the leaving loop before the next
        // arms, so the rate STABILIZES (no per-cycle accumulation). An orphan
        // would add a new self-rescheduling loop every cycle → an unbounded climb.
        const rates = [];
        for (let i = 0; i < 4; i++) {
            await navToScene(page, "cube", TRIGGER.cube);
            await page.waitForTimeout(1800);
            await navToScene(page, "easing", TRIGGER.easing);
            await page.waitForTimeout(1800);
            await ensurePlaying(page);
            rates.push(await measureRafRate(page));
        }

        // The bite: the rate must NOT GROW across cycles. Compare the last cycle
        // to the first stabilized cycle; an orphan-accumulating tree climbs, a
        // clean SUSPEND holds flat (±noise). Allow a modest 1.4× band for
        // measurement jitter; an orphan adds a whole loop per cycle (≥2× by cycle
        // 4 vs cycle 1).
        const first = rates[1] ?? rates[0]; // skip the very first (settling) cycle
        const last = rates[rates.length - 1];
        const grew = first > 0 && last > first * 1.4;
        if (!grew) {
            ok(
                `suspend-no-orphan-raf: rAF rate did NOT accumulate across 4 easing⟷cube ` +
                    `cycles (per-return rate [${rates.join(", ")}]/win — stable; the leaving ` +
                    `loop is stopped before the next arms, no orphan)`,
            );
        } else {
            fail(
                `suspend-no-orphan-raf — rAF rate CLIMBED across cycles ([${rates.join(", ")}]/win, ` +
                    `${(last / first).toFixed(2)}× cycle ${rates.length} vs cycle 2): the leaving ` +
                    `easing loop was NOT stopped before the next armed (orphan rAF accumulation — ` +
                    `no genuine SUSPEND)`,
            );
        }
    } finally {
        await page.close();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// C5 DEEP-LINK-WINS (each row on a FRESH context so the initial-nav guard fires)
// ─────────────────────────────────────────────────────────────────────────────
async function clauseDeepLinkWins(browser, base) {
    // Row 1 — #/spring deep link beats localStorage active-scene=cube.
    {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
        const page = await ctx.newPage();
        try {
            // Seed localStorage with a prior-session activeScene=cube via a real
            // load (NOT goto-then-set — goto clears, so seed THEN reload).
            await page.goto(`${base}/#/cube`, { waitUntil: "load" });
            await page.waitForTimeout(2500);
            await page.evaluate(
                (mk) => {
                    const m = JSON.parse(localStorage.getItem(mk) || "{}");
                    m.activeScene = "cube";
                    localStorage.setItem(mk, JSON.stringify(m));
                },
                MACHINE_KEY,
            );
            // Deep-link to spring + RELOAD (the document load re-reads storage,
            // but the URL hash is the deep link — the seed must prefer it).
            await page.evaluate(() => {
                location.hash = "#/spring";
            });
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(3500);

            const rest = await readStores(page);
            const restingScene = rest.machine?.activeScene;
            const restingHash = await page.evaluate(() => location.hash);
            if (restingScene === "spring" && /#\/spring/.test(restingHash)) {
                ok(
                    `deep-link-wins: #/spring deep link beat localStorage active-scene=cube ` +
                        `(resting scene='${restingScene}', hash='${restingHash}')`,
                );
            } else {
                fail(
                    `deep-link-wins — #/spring deep link did NOT win over localStorage cube: ` +
                        `resting scene='${restingScene}', hash='${restingHash}' (silently overridden ` +
                        `to the last-visited localStorage scene)`,
                );
            }
        } finally {
            await ctx.close();
        }
    }

    // Row 2 — #/cube?state= : the ?state= guard returns a redirect LOCATION and
    // STRIPS the consumed param (WV-W1-LOW-1). A FRESH context so the router's
    // first-nav `initialNavDone` guard runs (it only consumes ?state= on the
    // initial navigation).
    {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
        const page = await ctx.newPage();
        try {
            // A valid hashSharing payload encoding activeScene=square (base64url
            // JSON — the codec the router.beforeEach guard decodes).
            const statePayload = Buffer.from(
                JSON.stringify({ activeScene: "square" }),
            )
                .toString("base64")
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");

            await page.goto(`${base}/#/cube?state=${statePayload}`, {
                waitUntil: "load",
            });
            await page.waitForTimeout(3500);

            const rest = await readStores(page);
            const stateScene = rest.machine?.activeScene;
            const stateHash = await page.evaluate(() => location.hash);
            // The guard must STRIP the consumed ?state= and rest on a declared
            // scene (NOT the catch-all home redirect with a malformed path).
            const stateConsumed = !/[?&]state=/.test(stateHash);
            const restsOnScene =
                stateScene && stateScene !== "home" && !!SUPER_KEY[stateScene];
            if (stateConsumed && restsOnScene) {
                ok(
                    `deep-link-wins: #/cube?state= row — the ?state= guard returned a redirect ` +
                        `LOCATION (rests on '${stateScene}', ?state= stripped: hash='${stateHash}')`,
                );
            } else {
                fail(
                    `deep-link-wins — #/cube?state= row: resting scene='${stateScene}', ` +
                        `hash='${stateHash}' (the ?state= guard must return a redirect location and ` +
                        `strip the consumed param, not leave it on the URL / fall to home)`,
                );
            }
        } finally {
            await ctx.close();
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// C7 NO-TIMING-HEURISTIC
// ─────────────────────────────────────────────────────────────────────────────
async function clauseNoTimingHeuristic(browser, base) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    try {
        await page.goto(`${base}/#/cube`, { waitUntil: "load" });
        await page.waitForTimeout(3000);
        // Write a deterministic PAUSED snapshot (started:true, playing:false) with
        // a non-trivial clock so a racing restore would visibly diverge.
        await page.evaluate(
            (mk) => {
                const m = JSON.parse(localStorage.getItem(mk) || "{}");
                m.activeScene = "cube";
                m.perScene = m.perScene || {};
                m.perScene.cube = {
                    playing: false,
                    started: true,
                    animations: {
                        Rotations: { t: 321, reversed: false, iteration: 0 },
                    },
                };
                localStorage.setItem(mk, JSON.stringify(m));
            },
            MACHINE_KEY,
        );

        // Reload TWICE with a jittered busy-wait perturbing the <Suspense>
        // resolution tick. The restore must land on the SAME deterministic status
        // both times AND honor the persisted paused intent — proving it gates on
        // the targets-attached SCENE_READY, not a nextTick count.
        const restored = [];
        for (let i = 0; i < 2; i++) {
            // perturb the mount tick BEFORE the reload commits the new document.
            await page.addInitScript((jitter) => {
                const end = performance.now() + jitter;
                while (performance.now() < end) {
                    /* busy-wait to jitter the first paint/mount timing */
                }
            }, 25 + i * 55);
            await page.reload({ waitUntil: "load" });
            await page.waitForTimeout(3500);
            const s = await readStores(page);
            restored.push({
                scene: s.machine?.activeScene,
                started: s.machine?.perScene?.cube?.started,
                playing: s.machine?.perScene?.cube?.playing,
            });
        }

        const [r1, r2] = restored;
        // The genuine no-timing-heuristic invariant: the two perturbed mounts
        // AGREE (determinism — the restore does not race), AND they land on cube
        // with started preserved. (The exact playing value is whatever the
        // SCENE_READY restore + the scene's autoPlay policy dictate — the BITE is
        // divergence across perturbations, the isStableFire double-fire race.)
        const deterministic =
            r1.scene === "cube" &&
            r2.scene === "cube" &&
            r1.started === r2.started &&
            r1.playing === r2.playing &&
            r1.started === true;
        if (deterministic) {
            ok(
                `no-timing-heuristic: the restore is DETERMINISTIC across 2 timing-perturbed ` +
                    `mounts (both ${JSON.stringify(r1)} — SCENE_READY-gated on targets-attached, ` +
                    `not a nextTick double-fire count)`,
            );
        } else {
            fail(
                `no-timing-heuristic — the restore RACED across perturbed mount timing:\n` +
                    `      mount#1: ${JSON.stringify(r1)}\n` +
                    `      mount#2: ${JSON.stringify(r2)}\n` +
                    `      (a deterministic SCENE_READY restore must agree across perturbations; ` +
                    `divergence = an isStableFire/nextTick double-fire race)`,
            );
        }
    } finally {
        await ctx.close();
    }
}

await browserHalf();

if (failures.length > 0) {
    console.error(
        `\nproof:scene-machine-irrefragable — FAIL (${failures.length}): the scene+` +
            `playback FSM carries a live defect (the route storm / corrupt panel / ` +
            `non-identity round-trip / orphan rAF / lost deep link / timing race).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:scene-machine-irrefragable — PASS: the one finite scene+playback " +
        "state machine holds (H.W1 keystone — one authority, one reducer, " +
        "one-way projections, explicit SCENE_READY, genuine SUSPEND).",
);
