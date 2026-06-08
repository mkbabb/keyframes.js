#!/usr/bin/env node
/**
 * proof:dragscrub-single — H.W12 S1 / I8 (the ONE pointer-drag scrub seam).
 *
 * Before W12, spring/sequence/motion-path each HAND-ROLLED the SAME pointer-drag
 * scrub dance: a `getBoundingClientRect()`-ratio read + `setPointerCapture` on
 * pointer-down + window `pointermove`/`pointerup` listeners. THREE copies of one
 * gesture that can drift apart. W12 collapses them to ONE `useDragScrub`
 * composable (`demo/@/composables/useDragScrub.ts`); each scene now supplies only
 * its `project` (the rect-ratio for the rails, the nearest-point-on-path for
 * motion-path), and the I3 affordances (the sequence row-drag, the motion-path
 * control handles) are BORN on that seam — no churn-then-delete.
 *
 * This gate locks the collapse: the hand-rolled drag DANCE exists in EXACTLY ONE
 * file. It is a re-runnable STATIC grep (no browser, no build), mirroring the
 * collectSources + comment-blanker idioms of proof:single-writer /
 * proof:brittleness.
 *
 *   CLAUSE 1 — ONE SCRUB-DANCE HOME. Exactly ONE demo source file carries the
 *     full drag-DANCE signature (a `setPointerCapture(` call AND a window
 *     `pointermove`/`pointerup` registration — raw `window.addEventListener(` OR
 *     the vueuse `useEventListener(window, "pointermove"|"pointerup")` idiom),
 *     MODULO the recorded `DANCE_ALLOWLIST`. That file is `useDragScrub.ts` — the
 *     shared seam the three scrub scenes consume. A SECOND un-allowlisted file
 *     carrying the dance reds it (a re-introduced hand-rolled copy).
 *
 *   CLAUSE 2 — ZERO DANCE IN THE THREE SCENE TARGETS. None of the named scrub
 *     surfaces (spring / sequence / motion-path — the three the BITE cites)
 *     carries `setPointerCapture(` OR a window pointermove/pointerup
 *     registration. Their drag rides `useDragScrub`; the `getBoundingClientRect`
 *     reads that remain are PURE `project` geometry closures (the rect-ratio the
 *     projector computes), NOT the capture+window-listener DANCE this gate
 *     counts — so a bare rect read does NOT red the gate, only the dance does.
 *
 * Scope: the drag-dance signature is `setPointerCapture` + a window
 * pointermove/pointerup listener TOGETHER — the irreducible hand-roll. The demo
 * carries other legitimate drag seams that are NOT the 1-D scrub this gate
 * unifies: most live in their OWN composable (OrbitalDrag's quaternion drag,
 * EasingCurveCanvas's bezier-handle drag, `useDragCapture`, PlaybackRibbon's
 * visualizer) and so carry only HALF the signature in any one file, or already
 * ride a shared seam — they do not trip clause 1 by construction. The ONE
 * genuinely-different scene that DOES inline the full dance is the square scene's
 * 2-D positional box drag — a recorded `DANCE_ALLOWLIST` carve-out (it EARNS its
 * difference: a 2-D `{x,y}` spring chase that subtracts live deflection on
 * re-grab, NOT the 1-D progress scrub `useDragScrub` serves; the precept "keep
 * the scene-specific structure that earns its difference"). The allowlist carries
 * a stale-entry guard so it cannot rot.
 *
 * Re-runnable: `node scripts/proof-dragscrub-single.mjs`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

const SKIP_DIR = new Set(["dist", "node_modules", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

const toPosix = (p) => p.split(path.sep).join("/");
const relPosix = (abs) => toPosix(path.relative(REPO, abs));
const read = (p) => fs.readFileSync(p, "utf8");

// The single drag-scrub home (clause 1's expected sole owner) + the three named
// scene-target dirs clause 2 sweeps (the BITE cites spring/sequence/motion-path).
const DRAGSCRUB_HOME = "demo/@/composables/useDragScrub.ts";
const SCENE_TARGET_DIRS = ["demo/spring", "demo/sequence", "demo/motion-path"];

// The recorded dance carve-out (clause 1): a file whose full drag dance is a
// genuinely-DIFFERENT gesture, NOT the 1-D progress scrub `useDragScrub` unifies.
// Mirrors the proof:decomposition ASYNC_ALLOWLIST / proof:brittleness
// LISTENER_ALLOWLIST: an explicit Set, each entry carrying its rationale, with a
// stale-entry guard (an allowlisted path that no longer carries the dance reds
// the gate) so it cannot rot. A future justified exception is a deliberate diff
// to THIS Set.
const DANCE_ALLOWLIST = new Map([
    [
        "demo/app/scenes/SquareScene.vue",
        "the square scene's 2-D positional box drag — a {x,y} per-axis spring " +
            "chase that subtracts the live deflection on re-grab, NOT the 1-D " +
            "progress scrub useDragScrub serves. It EARNS its difference (the " +
            "precept: keep the scene-specific structure that earns it); forcing " +
            "the 1-axis ratio seam onto a 2-axis gesture would be a contrivance.",
    ],
]);

const failures = [];

/** Walk a dir, collecting every source file (skipping dist/ + deps). */
function collectSources(dir, out = []) {
    if (!fs.existsSync(dir)) return out;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collectSources(path.join(dir, e.name), out);
        } else if (SOURCE_EXT.has(path.extname(e.name))) {
            out.push(path.join(dir, e.name));
        }
    }
    return out;
}

/**
 * Comment-blanker (block + line + HTML), newline-preserving — so a docstring that
 * NAMES `setPointerCapture` / `window.addEventListener("pointermove")` as the
 * forbidden shape (this very lane's design prose) can never red the gate; only
 * real code does. Mirrors proof:single-writer / proof:brittleness.
 */
function blankComments(s) {
    let out = "";
    let i = 0;
    const n = s.length;
    while (i < n) {
        if (s[i] === "/" && s[i + 1] === "*") {
            const end = s.indexOf("*/", i + 2);
            const stop = end === -1 ? n : end + 2;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        if (s[i] === "/" && s[i + 1] === "/") {
            while (i < n && s[i] !== "\n") {
                out += " ";
                i++;
            }
            continue;
        }
        if (s.startsWith("<!--", i)) {
            const end = s.indexOf("-->", i + 4);
            const stop = end === -1 ? n : end + 3;
            for (let j = i; j < stop; j++) out += s[j] === "\n" ? "\n" : " ";
            i = stop;
            continue;
        }
        out += s[i];
        i++;
    }
    return out;
}

// The two halves of the drag DANCE. A file carries the dance iff it has BOTH:
//   (a) a pointer-capture call, AND
//   (b) a window pointermove/pointerup registration (raw addEventListener OR the
//       vueuse useEventListener(window, "pointermove"|"pointerup") idiom).
const HAS_CAPTURE = /\.setPointerCapture\s*\(/;
const HAS_WINDOW_POINTER =
    /window\.addEventListener\s*\(\s*["'`]pointer(?:move|up)["'`]|useEventListener\s*\(\s*window\s*,\s*["'`]pointer(?:move|up)["'`]/;

function carriesDance(src) {
    return HAS_CAPTURE.test(src) && HAS_WINDOW_POINTER.test(src);
}

function main() {
    if (!fs.existsSync(DEMO)) {
        console.error("proof:dragscrub-single — ERROR: demo/ not found.");
        process.exit(3);
    }

    console.log(
        "proof:dragscrub-single — H.W12 S1/I8 (the ONE pointer-drag scrub seam)",
    );

    const sources = collectSources(DEMO).sort();

    // ── CLAUSE 1 — exactly ONE scrub-dance home (modulo the recorded carve-out) ──
    const danceFiles = [];
    const allowlistedHits = new Set();
    for (const abs of sources) {
        const rel = relPosix(abs);
        const src = blankComments(read(abs));
        if (!carriesDance(src)) continue;
        if (DANCE_ALLOWLIST.has(rel)) {
            allowlistedHits.add(rel);
            continue;
        }
        danceFiles.push(rel);
    }

    if (danceFiles.length === 0) {
        failures.push(
            "[one-home] ZERO un-allowlisted files carry the drag dance " +
                "(setPointerCapture + a window pointermove/pointerup listener) — " +
                "the shared seam vanished. useDragScrub.ts must own it.",
        );
    } else if (danceFiles.length === 1) {
        if (danceFiles[0] !== DRAGSCRUB_HOME) {
            failures.push(
                `[one-home] the lone scrub-dance home is ${danceFiles[0]}, not ` +
                    `the expected ${DRAGSCRUB_HOME}. The shared seam must live in ` +
                    `useDragScrub.ts (H.W12.S1).`,
            );
        } else {
            console.log(
                `  ✓ [one-home] the scrub drag dance (setPointerCapture + window ` +
                    `pointermove/pointerup) lives in EXACTLY ONE shared home: ` +
                    `${DRAGSCRUB_HOME}` +
                    (DANCE_ALLOWLIST.size > 0
                        ? ` (${DANCE_ALLOWLIST.size} recorded carve-out(s): ` +
                          `${[...DANCE_ALLOWLIST.keys()].join(", ")})`
                        : ""),
            );
        }
    } else {
        failures.push(
            `[one-home] ${danceFiles.length} un-allowlisted files carry the ` +
                `hand-rolled drag dance (setPointerCapture + a window ` +
                `pointermove/pointerup listener) — the scrub seam must collapse to ` +
                `ONE home (${DRAGSCRUB_HOME}); each scene supplies only its ` +
                `\`project\` (H.W12.S1/I8). Copies:\n      ` +
                danceFiles.join("\n      "),
        );
    }

    // Stale-allowlist guard: a carve-out entry pointing at a file that no longer
    // carries the dance is dead and must be pruned (mirrors the
    // proof:decomposition ASYNC_ALLOWLIST stale guard).
    for (const [rel, why] of DANCE_ALLOWLIST) {
        if (!allowlistedHits.has(rel)) {
            failures.push(
                `[one-home] DANCE_ALLOWLIST entry "${rel}" (${why}) matches no ` +
                    `file carrying the drag dance — it is STALE; remove it.`,
            );
        }
    }

    // ── CLAUSE 2 — ZERO dance in the three named scene targets ─────────────
    const sceneOffenders = [];
    for (const dir of SCENE_TARGET_DIRS) {
        const abs = path.join(REPO, dir);
        for (const f of collectSources(abs)) {
            const src = blankComments(read(f));
            const cap = HAS_CAPTURE.test(src);
            const win = HAS_WINDOW_POINTER.test(src);
            if (cap || win) {
                sceneOffenders.push({
                    rel: relPosix(f),
                    cap,
                    win,
                });
            }
        }
    }
    if (sceneOffenders.length > 0) {
        failures.push(
            `[scene-clean] ${sceneOffenders.length} scene-target file(s) in ` +
                `spring/sequence/motion-path still hand-roll part of the drag ` +
                `dance (setPointerCapture / a window pointermove-pointerup ` +
                `listener) — the scene drag must ride \`useDragScrub\`; the only ` +
                `rect read a scene keeps is its pure \`project\` geometry closure ` +
                `(H.W12.S1/I8). Sites:\n      ` +
                sceneOffenders
                    .map(
                        (o) =>
                            `${o.rel}  [${o.cap ? "setPointerCapture" : ""}${
                                o.cap && o.win ? " + " : ""
                            }${o.win ? "window pointer-listener" : ""}]`,
                    )
                    .join("\n      "),
        );
    } else {
        console.log(
            `  ✓ [scene-clean] spring/sequence/motion-path carry ZERO ` +
                `setPointerCapture / window pointermove-pointerup dance — their ` +
                `drag rides useDragScrub (the rect reads that remain are pure ` +
                `project closures, not the dance)`,
        );
    }

    if (failures.length > 0) {
        console.error(
            "\nproof:dragscrub-single — FAIL (the drag dance is not single-homed):",
        );
        for (const f of failures) console.error("  ✗ " + f);
        console.error(
            "\n  Spring/sequence/motion-path each hand-rolled the SAME pointer-drag\n" +
                "  scrub dance (rect-ratio + setPointerCapture + window listeners). W12\n" +
                "  collapses them to ONE useDragScrub seam; the I3 affordances are born\n" +
                "  on it. The dance lives in exactly one file; no scene target re-rolls it.",
        );
        process.exit(1);
    }

    console.log(
        "\nproof:dragscrub-single — PASS: the pointer-drag scrub dance has ONE\n" +
            "home (useDragScrub.ts); spring/sequence/motion-path consume it. H.W12 S1/I8 holds.",
    );
}

main();
