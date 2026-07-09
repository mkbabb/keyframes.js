#!/usr/bin/env node
/**
 * proof:no-shadow-playback-authority — T.B8 (lane 30 rec 1 / D12 sweep, the 5th
 * carrier).
 *
 * THE DEFECT FAMILY (the "shadow playback authority" smell). The scene+playback
 * FSM (H.W1) made the machine the SINGLE playback authority: a gesture emits →
 * App.onPlayStateChange → `machine.dispatch(PLAY|PAUSE)` → the registered
 * `ScenePlayback` adapter re-arms/stops the loop. The D12 sweep deleted four
 * private `isPlaying` shadows that drove their loop DIRECTLY (useSpringDemo /
 * useSequenceDemo / useMotionPathDemo / useEasingDemo). The FIFTH carrier —
 * `useAnimationGroupPlayback.ts` — went untouched: `const isPlaying =
 * ref(getAnimationGroup().playing())`, with `toggleAnimationGroup`/`onScrubStart`/
 * `onScrubEnd` calling `AnimationGroup.play()/.pause()/.toggle()/.resume()`
 * DIRECTLY then only emitting. Correctness was "an accident of two independent
 * idempotency guards happening to agree" (the direct call AND the emit→machine→
 * adapter path BOTH drove the group).
 *
 * THE INVARIANT (T.B8). `createGroupAdapter` (scenePlaybackAdapters.ts) is the
 * ONLY code path that touches an `AnimationGroup`'s play/pause axis on behalf of
 * the machine. NO transport/scene file may call `AnimationGroup.prototype.{play,
 * pause,resume,toggle}` on a whole-group reference — the whole-group play/pause
 * axis routes through the machine. The scene-owned loops that legitimately own a
 * group's loop for a NON-transport concern (the tab-visibility autoPaused
 * contract the machine explicitly delegates, sceneMachine.ts §TAB_HIDDEN; the
 * square drag-takeover gesture) are the named allowlist.
 *
 * THIS GATE (born-RED on the pre-T.B8 tree — `useAnimationGroupPlayback.ts` hits;
 * GREEN on the cure):
 *
 *   CLAUSE (grep) — no whole-group `.{play,pause,resume,toggle}()` call on a
 *     group-idiom receiver (`animationGroup`, `group`, `getGroup()`,
 *     `getAnimationGroup()`, `currentAnimationGroup`, `.value` variants) in any
 *     demo file OUTSIDE the allowlist. Comment-blanked first, so the design prose
 *     that NAMES `group.play()` as the forbidden shape can never red it.
 *
 * PLUS the scrub-persistence vitest (test/demo/no-shadow-playback-authority.test.ts,
 * run by the npm script) — a cube scrub with NO play/pause bracket updates the
 * machine snapshot WITHOUT a NAVIGATE/SUSPEND between (the direct-mutation path
 * never dispatched SCRUB; the group scenes persisted the scrub coarsely, only at
 * captureActive()).
 *
 * Static grep gate (no browser, no build). Mirrors the comment-blanking +
 * collectSources idioms in scripts/proof-single-writer.mjs. Re-runnable:
 *   node scripts/proof-no-shadow-playback-authority.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEMO = path.join(REPO, "demo");

// The allowlist — the ONE machine-side adapter + the scene-owned loops that own a
// group's loop for a NON-transport concern (the tab-visibility autoPaused
// delegation + the square drag-takeover gesture). Relative-POSIX for
// platform-stable matching.
const ALLOWED = new Set([
    // THE authority: createGroupAdapter's suspend/resume/restore drive the group.
    "demo/@/state/scenePlaybackAdapters.ts",
    // Scene-owned tab-visibility loop (useSceneVisibilityPause callbacks — the
    // machine explicitly delegates tab-visibility, sceneMachine.ts §TAB_HIDDEN).
    "demo/scenes/cube/useCubeDemo.ts",
    // Scene-owned drag-takeover gesture (T.A13 — a pointerdown mid-tour pauses the
    // group and seats the springs; a scene-internal FSM edge, not the transport).
    "demo/scenes/square/SquareScene.vue",
]);

const SKIP_DIR = new Set(["node_modules", "dist", ".git", "coverage"]);
const SOURCE_EXT = new Set([".ts", ".vue"]);

const failures = [];
const ok = (label) => console.log(`  ✓ ${label}`);
const fail = (label) => {
    failures.push(label);
    console.error(`  ✗ ${label}`);
};
const relPosix = (abs) => path.relative(REPO, abs).split(path.sep).join("/");

console.log(
    "proof:no-shadow-playback-authority — T.B8 (createGroupAdapter is the ONLY group play/pause path)",
);

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

/** Comment-blanker (block + line + HTML), newline-preserving — so a docstring
 *  that NAMES `group.play()` as the forbidden shape (this wave's prose) never
 *  reds the gate; only real code does. */
const blankComments = (s) => {
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
};

if (!fs.existsSync(DEMO)) {
    console.error(`proof:no-shadow-playback-authority — ERROR: demo/ not found at ${relPosix(DEMO)}`);
    process.exit(3);
}

// A whole-group play/pause-axis call: a group-idiom receiver
// (animationGroup / currentAnimationGroup / group / getGroup() /
// getAnimationGroup(), optionally `.value`) followed by `.play(`/`.pause(`/
// `.resume(`/`.toggle(`. The receiver anchors on a WORD BOUNDARY so `sequence`,
// `child`, `smear`, `brushAnimation`, etc. (standalone KeyframesAnimation /
// Sequence instances — legit one-shot decorative plays) never match.
const GROUP_PLAY =
    /\b(?:animationGroup|currentAnimationGroup|group|getGroup\(\)|getAnimationGroup\(\))(?:\.value)?\.(?:play|pause|resume|toggle)\(/g;

const sources = collectSources(DEMO).sort();
let scanned = 0;
const offenders = [];

for (const abs of sources) {
    const rel = relPosix(abs);
    scanned++;
    if (ALLOWED.has(rel)) continue;
    const src = blankComments(fs.readFileSync(abs, "utf8"));
    for (const m of src.matchAll(GROUP_PLAY)) {
        const line = src.slice(0, m.index).split("\n").length;
        offenders.push({ rel, line, text: m[0].replace(/\($/, "()").trim() });
    }
}

if (offenders.length === 0) {
    ok(
        `no whole-group play/pause-axis call in any of ${scanned} demo source files ` +
            `outside the allowlist (${[...ALLOWED].map((p) => p.split("/").pop()).join(" + ")}) — ` +
            `createGroupAdapter is the ONLY path that drives an AnimationGroup's loop`,
    );
} else {
    for (const o of offenders) {
        fail(
            `${o.rel}:${o.line} calls \`${o.text}\` on a whole-group receiver — a SHADOW ` +
                `playback authority (the D12 smell). The whole-group play/pause axis routes ` +
                `through the machine (emit → onPlayStateChange → dispatch → the ScenePlayback ` +
                `adapter). Only createGroupAdapter (scenePlaybackAdapters.ts) may drive it (T.B8).`,
        );
    }
}

if (failures.length > 0) {
    console.error(
        `\nproof:no-shadow-playback-authority — FAIL (${failures.length}): a file outside the ` +
            `adapter/scene-owned-loop allowlist drives an AnimationGroup's play/pause axis directly.`,
    );
    process.exit(1);
}
console.log(
    "\nproof:no-shadow-playback-authority — PASS: the whole-group play/pause axis has exactly " +
        "one driver (createGroupAdapter); the transport's 5th D12 shadow is retired (T.B8).",
);
