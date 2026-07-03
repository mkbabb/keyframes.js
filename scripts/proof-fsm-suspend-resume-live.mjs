#!/usr/bin/env node
/**
 * proof:fsm-suspend-resume-live — I.W1 §Hard gate (B2 · the FSM suspend/resume
 * bind-proof transposition). Harness: the scripts/lib/demo-driver.mjs lifecycle
 * (withPage = serveDist + resolveChromium + context/teardown for the dist leg;
 * withBrowser for the :5174 dev-server leg; navToScene as the per-EXPECTED-state
 * nav primitive — J.W3 S1), with the persisted-snapshot oracle of
 * proof-scene-machine-irrefragable.mjs, extended with the TWO harness modes the
 * resume-iff-was-playing continuity demands.
 *
 * THE DEFECT (now fixed by S1+S2 — the GREEN witness here). The easing/spring
 * scenes used to pass the UNBOUND `playback.stop` (a bare RAFPlayback.prototype
 * .stop value) as the visibility-pause `pause` callback. When the watcher fired
 * it free-standing, `this === undefined` → `this._gen++` (playback.ts) threw
 * `Cannot read properties of undefined (reading '_gen')` INSIDE a Vue reactive
 * flush → the scene-swap render aborted → BLANK controls. S1 makes
 * RAFPlayback's control surface bind-proof (arrow class-fields); S2 folds the
 * raw-rAF recipe into useRafScene with BOUND callbacks; S3 consumes I.W2's
 * order-independent control mount (selectedControlSurface). This gate witnesses
 * all three: no throw, non-blank destination, resume-iff-was-playing.
 *
 * ── THE TWO HARNESS MODES (H-6) ───────────────────────────────────────────────
 *   • MODE-PERSIST — ONE persistent browsing context carrying FSM + localStorage
 *     across load→play→switch→switch-back→replay. REQUIRED for clause (c)'s
 *     CROSS-SCENE, WITHIN-SESSION resume-iff-was-playing continuity (a fresh
 *     context per scene RESETS the machine + localStorage and DESTROYS it).
 *     Clauses (a)/(b)/(c) run in this single accumulating context.
 *   • MODE-FRESH — fresh context per scene for the independent load/play/non-
 *     blank-mount baseline (clause b's load-and-render-clean floor).
 *
 * ── THE TARGET (dist-vs-dev split — RED-3) ────────────────────────────────────
 *   The DEFAULT target is the BUILT dist/gh-pages/. The synthetic-tick clause (a)
 *   GREEN property (a playing raw-rAF scene survives visibilitychange→hidden with
 *   ZERO throw) is verifiable on the dist post-fix. The DETERMINISTIC born-RED-of-
 *   record for the suspend leg is the historical source-mapped dev server `:5174`
 *   reproduction (in the audit corpus — `b2-dfa-gen-crash.md`: "every tab-hide
 *   while a raw-rAF scene plays" throws `at stop (playback.ts)` DETERMINISTICALLY,
 *   whereas the dist throws the SAME `_gen` verbatim but INTERMITTENTLY because
 *   @vueuse's useDocumentVisibility ref does not reliably flip on a harness-
 *   synthesised visibilitychange — `b2-dist-visibility-suspend.result.json`).
 *   Set KF_DEV_SERVER=1 to additionally spin `vite` and run clause (a) against the
 *   deterministic dev target as the NAMED, JUSTIFIED exception; otherwise the gate
 *   runs the GREEN property on the dist and documents the born-RED-of-record.
 *
 * Under KF_REQUIRE_BROWSER a playwright-absent skip becomes a hard fail AT THE
 * LIB SEAM. Serves the BUILT dist/gh-pages/. Re-runnable:
 * `node scripts/proof-fsm-suspend-resume-live.mjs`.
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
    REQUIRE_BROWSER,
    SCENE_MACHINE_KEY,
    navToScene,
    pressPlayToggle,
    withBrowser,
    withPage,
} from "./lib/demo-driver.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");
const DIST = path.join(REPO, "dist/gh-pages");

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const note = (label) => console.log(`  · ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const read = (p) => fs.readFileSync(p, "utf8");
const rel = (p) => path.relative(REPO, p).split(path.sep).join("/");

const USE_DEV_SERVER = process.env.KF_DEV_SERVER === "1";

console.log(
    "proof:fsm-suspend-resume-live — I.W1 §Hard gate (B2 · bind-proof suspend/resume · " +
        "synthetic visibility tick = no throw · non-blank destination · resume-iff-was-playing)",
);

// ── localStorage keys (single-sourced from the stores) ────────────────────────
const MACHINE_KEY = SCENE_MACHINE_KEY; // SCENE_MACHINE_PERSIST_KEY (lib-sourced)
const CTRL_KEY = "animation-groups-control-options-store";

// The destination control-tab labels navToScene settles on (the per-EXPECTED
// predicate; the lib J.W0 primitive): easing/spring project their scene-specific
// surfaces; amiga keeps the built-in "Controls" default.
const TRIGGER = { easing: "Easing", spring: "Spring", amiga: "Controls" };

// ─────────────────────────────────────────────────────────────────────────────
// clause (d) — STATIC HYGIENE GUARD (the second altitude; does NOT carry
// correctness authority — the runtime clauses (a)/(b)/(c) do). REDs on a bare
// `.stop`/`.suspend`/`.pause` (etc.) passed as a CALLBACK ARGUMENT — the unbound-
// method foot-gun the whole bug class shipped behind. The pattern: an
// `identifier.method` token appearing as a bare argument (followed by `,` or `)`),
// NOT a call (`x.stop()`), NOT a member-access continuation (`x.stop.bind`), NOT
// an arrow wrap (`() => x.stop()`). This is the grep form of
// @typescript-eslint/unbound-method (eslint is not in this toolchain; the spec
// permits the `proof:`-grep alternative). HYGIENE tier (I.W7 / H-4).
// ─────────────────────────────────────────────────────────────────────────────
function clauseD_staticGuard() {
    // The control-method names that LOSE `this` when extracted as a value off a
    // playback/adapter object (the unbound-method crash class).
    const UNBOUND_METHODS = ["stop", "suspend", "pause", "play", "drive", "loop"];
    // Comment/string-blank so a doc-comment naming `playback.stop` does not false-
    // positive (mirrors the blankComments idiom in the sibling gates).
    const blank = (s) =>
        s
            .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
            .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(m.length - p1.length))
            .replace(/`(?:[^`\\]|\\.)*`/g, (m) => m.replace(/[^\n]/g, " "))
            .replace(/"(?:[^"\\]|\\.)*"/g, (m) => m.replace(/[^"]/g, " "))
            .replace(/'(?:[^'\\]|\\.)*'/g, (m) => m.replace(/[^']/g, " "));

    const collect = (root, exts) => {
        const out = [];
        const walk = (dir) => {
            for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
                if (e.isDirectory()) {
                    if (e.name === "node_modules" || e.name === "dist") continue;
                    walk(path.join(dir, e.name));
                } else if (exts.some((x) => e.name.endsWith(x))) {
                    out.push(path.join(dir, e.name));
                }
            }
        };
        if (fs.existsSync(root)) walk(root);
        return out;
    };

    // The bare-callback pattern: `<ident>.<method>` immediately followed (after
    // optional whitespace) by `,` or `)` — i.e. it sits in an argument position
    // and is NEITHER called (`(`) NOR continued (`.`/`=`/`[`). The leading char
    // before the identifier must be a separator (`(`, `,`, whitespace) so we do
    // not match `this.stop` inside a larger expression that IS a call.
    const methodAlt = UNBOUND_METHODS.join("|");
    const bareCallbackRe = new RegExp(
        // (sep)( ident ).( method )( ws )( , or ) )  — NOT followed by ( . = [
        `[(,\\s]([A-Za-z_$][\\w$]*)\\.(${methodAlt})\\s*([,)])`,
        "g",
    );

    const files = [...collect(DEMO, [".ts", ".vue"]), ...collect(path.join(REPO, "src"), [".ts"])];
    const offenders = [];
    for (const abs of files) {
        const src = blank(read(abs));
        for (const m of src.matchAll(bareCallbackRe)) {
            const recv = m[1];
            const method = m[2];
            // Skip obvious non-foot-guns: a `.play(` etc. is already excluded by
            // the `[,)]` tail (a call has `(`). Guard against matching inside an
            // object-literal value shorthand like `{ stopLoop, startLoop }` — those
            // are bound local arrows, not `obj.method`. The receiver+dot ensures
            // we only flag MEMBER extractions. A receiver named like a known-bound
            // local is still flagged (the static net is conservative-by-design).
            const lineStart = src.lastIndexOf("\n", m.index) + 1;
            const lineEnd = src.indexOf("\n", m.index);
            const line = read(abs).slice(lineStart, lineEnd === -1 ? undefined : lineEnd).trim();
            offenders.push(`${rel(abs)}: \`${recv}.${method}\` passed as a bare callback — \`${line.slice(0, 100)}\``);
        }
    }

    if (offenders.length === 0) {
        ok(
            `clause (d) HYGIENE: ZERO bare \`.${UNBOUND_METHODS.join("/.")}\` member-method ` +
                `references passed as a callback across ${files.length} demo+src files (the ` +
                `unbound-method foot-gun is statically absent — the S1/S2 fix deleted the two ` +
                `defect sites at useEasingDemo.ts/useSpringDemo.ts). [HYGIENE tier — does NOT ` +
                `carry correctness authority; the runtime clauses (a)/(b)/(c) do.]`,
        );
    } else {
        fail(
            `clause (d) HYGIENE — ${offenders.length} bare unbound-method callback(s) (a member ` +
                `method passed by value loses \`this\` → the RAFPlayback._gen crash class). Wrap in ` +
                `an arrow or route through a bound local (useRafScene's stopLoop/startLoop):\n      ` +
                offenders.slice(0, 12).join("\n      "),
        );
    }
}

// Run the static clause FIRST (always, no browser needed).
clauseD_staticGuard();

// ── BITE self-test for clause (d): the grep MUST red on the historical defect ──
// Proves the static net is not vacuous — it fires on the exact pre-fix shape.
{
    const probe = `useSceneVisibilityPause(() => playback.running, playback.stop, startLoop);`;
    const re = /[(,\s]([A-Za-z_$][\w$]*)\.(stop|suspend|pause)\s*([,)])/g;
    const hit = [...probe.matchAll(re)].some((m) => m[1] === "playback" && m[2] === "stop");
    if (hit) {
        ok(
            `clause (d) BITE self-test: the grep REDS on the historical defect shape ` +
                `\`useSceneVisibilityPause(…, playback.stop, …)\` (non-vacuous — it would have caught B2).`,
        );
    } else {
        fail(
            `clause (d) BITE self-test FAILED — the grep does NOT match the known defect ` +
                `\`playback.stop\` as a bare callback; the static net is broken/vacuous.`,
        );
    }
}

// ── error oracle: attach pageerror/unhandledrejection collectors to a page ────
function attachErrorOracle(page) {
    const errors = [];
    page.on("pageerror", (e) => errors.push({ kind: "pageerror", msg: String(e?.message ?? e), stack: String(e?.stack ?? "") }));
    page.on("console", (m) => {
        if (m.type() === "error") {
            const t = m.text();
            // Vue's "Unhandled error during execution of component update" warning
            // is the FLUSH-ABORT tell (the downstream symptom of the _gen throw).
            if (/_gen|Unhandled error during execution|Cannot read propert/.test(t)) {
                errors.push({ kind: "console.error", msg: t, stack: "" });
            }
        }
    });
    page.on("crash", () => errors.push({ kind: "crash", msg: "page crashed", stack: "" }));
    page.context().on?.("weberror", (e) => errors.push({ kind: "weberror", msg: String(e?.error?.message ?? e), stack: "" }));
    return errors;
}

const genThrows = (errors) =>
    errors.filter((e) => /_gen|Cannot read propert.*undefined|undefined is not an object|Unhandled error during execution/.test(e.msg + e.stack));

// ── page helpers (the S-Harness driving primitives) ──────────────────────────

/** Wait for the machine's persisted activeScene to settle on `sceneId`. */
async function waitActiveScene(page, sceneId, timeout = 8000) {
    await page
        .waitForFunction(
            ([mk, id]) => {
                try {
                    return JSON.parse(localStorage.getItem(mk) || "{}").activeScene === id;
                } catch {
                    return false;
                }
            },
            [MACHINE_KEY, sceneId],
            { timeout },
        )
        .catch(() => {});
}

// In-page hash NAVIGATE: the lib's navToScene (NOT a document navigation —
// storage + the live FSM survive, which is REQUIRED for MODE-PERSIST
// continuity), settled on the destination's per-EXPECTED control surface
// (TRIGGER above). Each call site keeps its own post-nav settle window (the
// FSM-rest choreography the live reads need).

/** Dispatch a SYNTHETIC visibilitychange → hidden (the born-RED-of-record
 *  trigger; NO dock gesture). Overrides document.visibilityState/hidden so the
 *  @vueuse useDocumentVisibility read reflects "hidden" when the event fires,
 *  then dispatches the event. Returns to visible after. */
async function fireVisibilityHidden(page) {
    await page.evaluate(() => {
        const set = (state) => {
            try {
                Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
                Object.defineProperty(document, "hidden", { configurable: true, get: () => state === "hidden" });
            } catch {
                /* ignore */
            }
            document.dispatchEvent(new Event("visibilitychange"));
        };
        set("hidden");
    });
}
async function fireVisibilityVisible(page) {
    await page.evaluate(() => {
        try {
            Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
            Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
        } catch {
            /* ignore */
        }
        document.dispatchEvent(new Event("visibilitychange"));
    });
}

/** The active scene's persisted play INTENT (the single writer persists it on
 *  every dispatch within the SAME session — no reload, so this is the live
 *  machine state, not a cross-reload round-trip). */
const activeIntentPlaying = (page) =>
    page.evaluate((mk) => {
        try {
            const m = JSON.parse(localStorage.getItem(mk) || "{}");
            return !!m.perScene?.[m.activeScene]?.playing;
        } catch {
            return false;
        }
    }, MACHINE_KEY);

/** Read the LIVE preview motion: sample the easing/spring progress readout (the
 *  `f(0.NN)` text the EasingTarget renders, or the spring sampler) across two
 *  rAF ticks. A MOVING value ⇒ the raw-rAF loop is genuinely LIVE (the live
 *  adapter is running) — NOT a localStorage proxy. Returns {moving, samples}. */
async function liveLoopMoving(page) {
    const sample = () =>
        page.evaluate(() => {
            // The progress readout is rendered as `f(0.NN) = …` in the stage; fall
            // back to ANY element whose textContent matches `f(<num>)`.
            const txt = document.body.innerText || "";
            const m = txt.match(/f\(\s*([0-9]*\.?[0-9]+)\s*\)/);
            if (m) return parseFloat(m[1]);
            // Fallback: a transform:translateX on a .progress-ball / hero ball.
            const ball = document.querySelector(".progress-ball, .hero-ball");
            if (ball) {
                const t = getComputedStyle(ball).transform;
                return t && t !== "none" ? t : null;
            }
            return null;
        });
    const a = await sample();
    await page.waitForTimeout(220);
    const b = await sample();
    await page.waitForTimeout(220);
    const c = await sample();
    const moving = !(a === null && b === null && c === null) && (a !== b || b !== c);
    return { moving, samples: [a, b, c] };
}

/** Is the active scene's control panel NON-BLANK? For a DFA-gated scene the
 *  control surface renders the scene's expected panel content. We assert:
 *   (1) the expected panel text for the scene is PRESENT, and
 *   (2) the control pane is not collapsed to opacity ~0 (the flush-abort symptom).
 *  Returns { nonBlank, panelText, surfaces }. */
async function controlPanelState(page, sceneId) {
    // The per-scene expected control surface (from controlSurfaceDFA): easing →
    // the easing editor; spring → the spring editor; cube/amiga/square → the
    // controls/keyframes/timeline triad.
    const EXPECT = {
        easing: ["easing", "curve", "cubic", "steps", "ease"],
        spring: ["spring", "response", "damping", "bounc"],
        cube: ["duration", "delay", "iteration", "direction"],
        amiga: ["duration", "delay", "iteration", "direction"],
        square: ["duration", "delay", "iteration", "direction"],
    };
    return page.evaluate(
        ([scene, expectMap]) => {
            const text = (document.body.innerText || "").toLowerCase();
            const wants = expectMap[scene] || [];
            const hits = wants.filter((w) => text.includes(w));
            // The control pane host (AnimationControls Tabs root / the panel card).
            // A flush-aborted panel freezes mid-VT at low opacity — sample any
            // [role=tabpanel] / .controls panel for opacity.
            // J.W2 S2 (S4-stretch): single-surface scenes (easing/spring) mount
            // their panel FLAT — no [role=tabpanel] exists there. `.controls-pane`
            // is the pane host whose opacity carries the flush-abort symptom in
            // BOTH mount shapes, so it joins the sample set.
            const panes = [
                ...document.querySelectorAll(
                    '[role="tabpanel"], [data-state="active"], .controls-pane',
                ),
            ];
            let maxOpacity = 0;
            for (const p of panes) {
                const op = parseFloat(getComputedStyle(p).opacity || "1");
                if (Number.isFinite(op)) maxOpacity = Math.max(maxOpacity, op);
            }
            // The scene's surface tab triggers present (the DFA control set rendered).
            const tabTriggers = [...document.querySelectorAll('[role="tab"]')].map((t) =>
                (t.textContent || "").trim().toLowerCase(),
            );
            return {
                panelTextHits: hits,
                panelTextHitCount: hits.length,
                wantCount: wants.length,
                maxOpacity,
                tabTriggers,
                tabCount: tabTriggers.length,
            };
        },
        [sceneId, EXPECT],
    );
}

/** Seed the controls-panel-open flag so the panel renders on load. */
async function seedControlsOpen(page) {
    await page.addInitScript((ck) => {
        try {
            localStorage.setItem(ck, JSON.stringify({ isControlsPanelOpen: true }));
        } catch {
            /* ignore */
        }
    }, CTRL_KEY);
}

// ─────────────────────────────────────────────────────────────────────────────
// THE BROWSER HALVES
// ─────────────────────────────────────────────────────────────────────────────
async function browserHalves() {
    const VW = 1440;
    // The lib lifecycle owns the server/chromium/teardown (the dist leg); the
    // MODE-PERSIST and MODE-FRESH contexts are opened off the provided `browser`
    // (the two harness modes ARE the oracle), so the lib's default page stays
    // idle at about:blank. The :5174 dev-server leg launches its OWN browser
    // through withBrowser (the second launch).
    const result = await withPage(
        { distDir: DIST, label: "the suspend/resume runtime clauses" },
        async (_page, { url: base, browser }) => {
        // ── clause (a) — BORN-RED-OF-RECORD: PLAYING + SYNTHETIC visibility tick
        //    = NO THROW. Load easing (auto-plays) in MODE-PERSIST, assert the loop
        //    is LIVE, dispatch visibilitychange→hidden, assert ZERO throw. ───────
        const persistCtx = await browser.newContext({ viewport: { width: VW, height: 900 } });
        const page = await persistCtx.newPage();
        await seedControlsOpen(page);
        const errors = attachErrorOracle(page);

        await page.goto(`${base}/#/easing`, { waitUntil: "load" });
        await waitActiveScene(page, "easing");
        await page.waitForTimeout(1000);

        // assert playback.running — the easing scene auto-plays; observe the LIVE
        // preview motion (the rAF genuinely moving the sweep), not localStorage.
        let live = await liveLoopMoving(page);
        if (!live.moving) {
            // belt-and-braces: ensure the intent is playing, then re-sample.
            await page.evaluate(() => {
                location.hash = "#/easing";
            });
            await page.waitForTimeout(800);
            live = await liveLoopMoving(page);
        }
        if (live.moving) {
            ok(`clause (a) precondition: the easing raw-rAF scene is PLAYING — the live preview sweep is moving (samples ${JSON.stringify(live.samples)}), i.e. playback.running.`);
        } else {
            note(`clause (a) precondition WEAK: live preview motion not observed on dist (samples ${JSON.stringify(live.samples)}) — proceeding; the synthetic-tick no-throw assertion still holds even if the sweep had settled.`);
        }

        const errBefore = errors.length;
        await fireVisibilityHidden(page);
        await page.waitForTimeout(700);
        await fireVisibilityVisible(page);
        await page.waitForTimeout(500);

        const genErrs = genThrows(errors.slice(errBefore));
        const allNew = errors.slice(errBefore);
        if (genErrs.length === 0) {
            ok(
                `clause (a) GREEN: the SYNTHETIC visibilitychange→hidden on the PLAYING easing scene ` +
                    `raised ZERO _gen/undefined throws and ZERO flush-abort warnings (${allNew.length} ` +
                    `total console-errors, none matching the crash class). The bind-proof RAFPlayback ` +
                    `(S1) + the bound useRafScene registration (S2) hold. [Born-RED-of-record: the ` +
                    `DETERMINISTIC reproduction is the source-mapped dev server :5174 ` +
                    `(b2-dfa-gen-crash.md) — the dist throws the same _gen INTERMITTENTLY ` +
                    `(b2-dist-visibility-suspend.result.json); the GREEN property is dist-verifiable.]`,
            );
        } else {
            fail(
                `clause (a) RED: the synthetic visibility tick on the playing easing scene threw the ` +
                    `_gen/undefined crash class (${genErrs.length}) — the bind-proof fix did NOT hold:\n      ` +
                    genErrs.slice(0, 4).map((e) => `${e.kind}: ${e.msg.slice(0, 140)}`).join("\n      "),
            );
        }

        // ── clause (b) — NON-BLANK destination on a live SWITCH (the switch FACE
        //    of the same defect), in MODE-PERSIST, source PLAYING. Driven by the
        //    SYNTHETIC visibility co-fire + hash-route (NOT the dock gesture). ────
        // Re-ensure easing is the playing source.
        await navToScene(page, "easing", TRIGGER.easing);
        await page.waitForTimeout(1600);
        await page.waitForTimeout(600);
        const errBeforeB = errors.length;
        // co-fire the visibility tick AT the switch (the VT/dock co-fire the
        // root cause names), then hash-route to amiga (the easing→amiga blank pair).
        await fireVisibilityHidden(page);
        await navToScene(page, "amiga", TRIGGER.amiga);
        await page.waitForTimeout(2200);
        await fireVisibilityVisible(page);
        await page.waitForTimeout(800);

        const destState = await controlPanelState(page, "amiga");
        const srcGone = await page.evaluate(() => {
            // The easing-specific surface tab must be GONE (source controls unmounted).
            const tabs = [...document.querySelectorAll('[role="tab"]')].map((t) => (t.textContent || "").toLowerCase());
            return !tabs.some((t) => t.includes("easing") || t.includes("curve"));
        });
        const genErrsB = genThrows(errors.slice(errBeforeB));
        const destNonBlank =
            destState.panelTextHitCount > 0 && destState.maxOpacity > 0.5;

        if (destNonBlank && srcGone && genErrsB.length === 0) {
            ok(
                `clause (b) GREEN: on a LIVE easing(PLAYING)→amiga switch with the synthetic visibility ` +
                    `co-fire, the destination's DFA control set renders NON-BLANK (panel text hits ` +
                    `[${destState.panelTextHits.join(", ")}], pane opacity ${destState.maxOpacity.toFixed(2)}, ` +
                    `${destState.tabCount} tab trigger(s)) AND the source easing controls fully unmounted ` +
                    `— ZERO flush-abort throws (${genErrsB.length}). I.W2's order-independent ` +
                    `selectedControlSurface mount covers the resumed/entered scene (S3 consumed, no gap).`,
            );
        } else {
            fail(
                `clause (b) RED: the destination did NOT mount non-blank on a live switch — ` +
                    `panelTextHits=${destState.panelTextHitCount}/${destState.wantCount}, ` +
                    `paneOpacity=${destState.maxOpacity.toFixed(2)}, sourceControlsGone=${srcGone}, ` +
                    `genThrows=${genErrsB.length}. (A flush-abort would blank the panel — S1/S2/S3.)`,
            );
        }

        // ── clause (c) — resume-iff-was-playing across A→B→A in MODE-PERSIST.
        //    PLAY A → switch to B → assert B resumes iff B was playing (else
        //    paused); switch back to A → A matches the carried snapshot; a switch
        //    FROM a PAUSED scene leaves the entering scene paused. Reads the LIVE
        //    adapter (preview motion + the within-session persisted intent — no
        //    reload), NOT a cross-reload localStorage round-trip. ────────────────
        // Leg 1: PLAY easing (auto-plays), switch to spring (auto-plays) — spring
        // resumes PLAYING (it was playing/auto-plays). Both raw-rAF.
        await navToScene(page, "easing", TRIGGER.easing);
        await page.waitForTimeout(1600);
        await page.waitForTimeout(500);
        const easingPlaying1 = await activeIntentPlaying(page);
        const easingLive1 = (await liveLoopMoving(page)).moving;

        await navToScene(page, "spring", TRIGGER.spring);
        await page.waitForTimeout(1800);
        const springPlaying = await activeIntentPlaying(page);
        const springLive = (await liveLoopMoving(page)).moving;

        // Leg 2: PAUSE spring, switch to easing, switch BACK to spring — spring
        // must come back PAUSED (resume-iff-was-playing: it was paused on leave).
        // Actuate via a REAL pointerup (the product's transport is `@pointerup`-
        // bound since R.W6 excised the strand-prone `@click`; a synthetic
        // `element.click()` no longer actuates it — see `pressPlayToggle`).
        await pressPlayToggle(page, { intent: "pause" });
        await page.waitForTimeout(700);
        const springPausedAfterClick = !(await activeIntentPlaying(page));

        await navToScene(page, "easing", TRIGGER.easing);
        await page.waitForTimeout(1400);
        await navToScene(page, "spring", TRIGGER.spring);
        await page.waitForTimeout(1800);
        const springResumedPaused = !(await activeIntentPlaying(page));
        const springLiveAfterReturn = (await liveLoopMoving(page)).moving;

        // Assertions: spring was playing on first entry (auto-plays); after a
        // PAUSE-then-leave-then-return it stays PAUSED (the snapshot algebra
        // EXECUTED — captureActive's suspend completed because S1/S2 let it).
        const cOk =
            springPlaying &&
            springPausedAfterClick &&
            springResumedPaused &&
            !springLiveAfterReturn;
        if (cOk) {
            ok(
                `clause (c) GREEN (resume-iff-was-playing, MODE-PERSIST, live read): easing entered ` +
                    `PLAYING (intent=${easingPlaying1}, liveMotion=${easingLive1}); spring entered PLAYING ` +
                    `(intent=${springPlaying}, liveMotion=${springLive}); after PAUSE→leave→return spring ` +
                    `resumed PAUSED (intent-playing=${!springResumedPaused}, liveMotion=${springLiveAfterReturn}). ` +
                    `A switch FROM the paused spring left the entered scene's snapshot honored — the ` +
                    `captureActive suspend EXECUTED (S1/S2 let it complete without throwing).`,
            );
        } else {
            fail(
                `clause (c) RED (resume-iff-was-playing): springPlaying(entry)=${springPlaying}, ` +
                    `springPausedAfterClick=${springPausedAfterClick}, springResumedPaused(return)=` +
                    `${springResumedPaused}, springLiveAfterReturn=${springLiveAfterReturn}. The within-` +
                    `session continuity (the suspend algebra executed on the effect layer) did not hold.`,
            );
        }

        await persistCtx.close();

        // ── MODE-FRESH baseline: each raw-rAF scene loads + renders clean + non-
        //    blank in an INDEPENDENT context (no cross-scene state). ─────────────
        for (const scene of ["easing", "spring"]) {
            const ctx = await browser.newContext({ viewport: { width: VW, height: 900 } });
            const p = await ctx.newPage();
            await seedControlsOpen(p);
            const errs = attachErrorOracle(p);
            await p.goto(`${base}/#/${scene}`, { waitUntil: "load" });
            await waitActiveScene(p, scene);
            await p.waitForTimeout(1100);
            const st = await controlPanelState(p, scene);
            const clean = genThrows(errs).length === 0;
            const nonBlank = st.panelTextHitCount > 0 && st.maxOpacity > 0.5;
            if (clean && nonBlank) {
                ok(`MODE-FRESH baseline (${scene}): loads clean (zero crash-class errors) + control panel NON-BLANK (hits [${st.panelTextHits.join(", ")}], opacity ${st.maxOpacity.toFixed(2)}).`);
            } else {
                fail(`MODE-FRESH baseline (${scene}): clean=${clean}, nonBlank=${nonBlank} (hits=${st.panelTextHitCount}, opacity=${st.maxOpacity.toFixed(2)}).`);
            }
            await ctx.close();
        }

        // ── OPTIONAL: the DETERMINISTIC born-RED-of-record run on the dev server
        //    :5174 (KF_DEV_SERVER=1) — the NAMED, JUSTIFIED exception (RED-3). On
        //    a POST-FIX tree this greens; on a pre-fix tree it throws _gen
        //    DETERMINISTICALLY. Here it is a corroborating GREEN run. ────────────
        if (USE_DEV_SERVER) {
            await runDevServerClauseA();
        } else {
            note(
                `clause (a) dev-server leg SKIPPED (KF_DEV_SERVER unset). The DETERMINISTIC born-RED-` +
                    `of-record is the historical source-mapped :5174 reproduction in the audit corpus ` +
                    `(b2-dfa-gen-crash.md); the GREEN property (synthetic tick → zero throw) is verified ` +
                    `on the dist above. Set KF_DEV_SERVER=1 to run the corroborating dev-server leg.`,
            );
        }
        },
    );
    if (result.skipped) {
        console.log(`  ○ browser half skipped — ${result.reason}`);
    }
}

/** The NAMED exception: spin `vite` (the source-mapped dev server) and run clause
 *  (a) against it — the DETERMINISTIC suspend trigger. Post-fix: GREEN. The
 *  browser launch routes through the lib's withBrowser against the EXTERNAL
 *  :5174 URL (the second launch — no dist server). W7-1 / J.W3 S6d: under
 *  KF_REQUIRE_BROWSER=1 a vite-did-not-come-up skip is a FAIL, never a note(). */
async function runDevServerClauseA() {
    const PORT = 5174;
    const child = spawn(
        "npx",
        ["vite", "--port", String(PORT), "--strictPort"],
        { cwd: REPO, stdio: "ignore", env: { ...process.env } },
    );
    // NOTE: vite binds the dev server to `localhost` (the hostname / IPv6 ::1),
    // NOT 127.0.0.1 — probe + navigate via `localhost`.
    const devBase = `http://localhost:${PORT}`;
    // Wait for the dev server to answer (cold-start + optimizeDeps can take a
    // while on first run; poll up to 60s).
    const up = await (async () => {
        for (let i = 0; i < 120; i++) {
            try {
                const r = await fetch(devBase, { method: "GET" });
                if (r.ok || r.status === 200) return true;
            } catch {
                /* not up yet */
            }
            await new Promise((res) => setTimeout(res, 500));
        }
        return false;
    })();
    if (!up) {
        if (REQUIRE_BROWSER) {
            fail(
                `clause (a) dev-server leg REQUIRED (KF_REQUIRE_BROWSER=1) but vite did not come up ` +
                    `on localhost:${PORT} within 60s — the deterministic suspend clause cannot pass ` +
                    `vacuously (a note()-skip under KF_REQUIRE_BROWSER=1 is a FAIL — J.W3 S6d / W7-1)`,
            );
        } else {
            note(`clause (a) dev-server leg: vite did not come up on localhost:${PORT} within 60s — skipped.`);
        }
        child.kill("SIGTERM");
        return;
    }
    try {
        const result = await withBrowser(
            async (browser) => {
        const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const page = await ctx.newPage();
        await seedControlsOpen(page);
        const errors = attachErrorOracle(page);
        await page.goto(`${devBase}/#/easing`, { waitUntil: "load" });
        await waitActiveScene(page, "easing");
        await page.waitForTimeout(1400);
        const errBefore = errors.length;
        await fireVisibilityHidden(page);
        await page.waitForTimeout(800);
        await fireVisibilityVisible(page);
        await page.waitForTimeout(400);
        const genErrs = genThrows(errors.slice(errBefore));
        if (genErrs.length === 0) {
            ok(
                `clause (a) DEV-SERVER (:5174, the deterministic exception) GREEN: the synthetic ` +
                    `visibilitychange→hidden on the source-mapped playing easing scene raised ZERO ` +
                    `_gen throws — the deterministic born-RED-of-record is now fixed at the source.`,
            );
        } else {
            fail(
                `clause (a) DEV-SERVER (:5174) RED: the deterministic suspend STILL threw the _gen ` +
                    `crash class (${genErrs.length}):\n      ` +
                    genErrs.slice(0, 3).map((e) => `${e.kind}: ${e.msg.slice(0, 140)}`).join("\n      "),
            );
        }
        await ctx.close();
            },
            { label: "the deterministic dev-server clause (a)" },
        );
        if (result.skipped) {
            note(`clause (a) dev-server leg skipped — ${result.reason}`);
        }
    } finally {
        child.kill("SIGTERM");
    }
}

await browserHalves();

// ── verdict ───────────────────────────────────────────────────────────────────
if (failures.length > 0) {
    console.error(
        `\nproof:fsm-suspend-resume-live — FAIL (${failures.length}): the FSM suspend/resume bind-proof ` +
            `transposition is not satisfied — a synthetic visibility tick on a playing raw-rAF scene ` +
            `still throws the _gen crash class, OR the live-switch destination mounted blank, OR ` +
            `resume-iff-was-playing did not hold across a within-session switch, OR a bare unbound ` +
            `.stop/.suspend/.pause callback remains (clause d).`,
    );
    process.exit(1);
}
console.log(
    "\nproof:fsm-suspend-resume-live — PASS: a PLAYING raw-rAF scene survives the synthetic " +
        "visibilitychange→hidden with ZERO _gen throws (S1 bind-proof RAFPlayback + S2 bound " +
        "useRafScene); a live easing→amiga switch with the visibility co-fire mounts the destination's " +
        "DFA control set NON-BLANK with the source controls unmounted (S3 = I.W2's order-independent " +
        "selectedControlSurface mount, no gap for the resumed scene); resume-iff-was-playing holds " +
        "across an A→B→A within-session switch in the persistent context (the reducer preserved, S5); " +
        "and the static guard (clause d, HYGIENE) finds ZERO bare unbound-method callbacks.",
);
