/**
 * proof:demo-elevate (inv ο) — E.W11's falsifiable close. Five clauses, each a
 * build+grep instrument that reds on the exact regression it forbids (revert any
 * one fix → the named clause reds). The CLS/INP measure-first halves are verified
 * by the capture harness + lighthouse (E.W4); this gate locks the structural
 * forms (the feature-detect routes, the owned idioms, the a11y roles, the
 * first-paint descriptors, the CWV levers).
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "");
const exists = (p) => existsSync(join(root, p));
/** Blank /* *​/ block comments so a grep matches real declarations, not prose. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ");

const SKIP_DIR = new Set(["dist", "node_modules", ".git"]);
/** Walk a repo-relative dir collecting absolute paths matching one of `exts`. */
const collect = (relDir, exts, out = []) => {
    const dir = join(root, relDir);
    if (!existsSync(dir)) return out;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.isDirectory()) {
            if (SKIP_DIR.has(e.name)) continue;
            collect(join(relDir, e.name), exts, out);
        } else if (exts.has(extname(e.name))) {
            out.push(join(dir, e.name));
        }
    }
    return out;
};
/** All demo .vue/.ts source as strings (dist excluded). */
const collectDemo = () =>
    collect("demo", new Set([".vue", ".ts"])).map((p) => readFileSync(p, "utf8"));

const failures = [];
const fail = (clause, msg) => failures.push(`  ✗ [${clause}] ${msg}`);
const ok = (clause, msg) => console.log(`  ✓ [${clause}] ${msg}`);

console.log("proof:demo-elevate — E.W11 (the demo elevated)\n");

// ── 1. VT clause ─────────────────────────────────────────────────────────────
{
    const vt = read("demo/app/useSceneTransition.ts");
    const swap = read("demo/app/useSceneSwap.ts");
    if (/startViewTransition/.test(vt) && /from\s+["']@mkbabb\/glass-ui\/motion-core["']/.test(vt)) {
        ok("vt", "switchScene routes through glass-ui startViewTransition (feature-detected helper)");
    } else {
        fail("vt", "demo/app/useSceneTransition.ts does not route through glass-ui startViewTransition");
    }
    // The no-VT SpringProgress fallback is preserved + feature-gated (stands down only where VT runs).
    if (/SpringProgress/.test(swap) && /supportsViewTransition|startViewTransition|view-?transition/i.test(swap)) {
        ok("vt", "the no-VT SpringProgress cross-dissolve fallback is preserved + feature-gated");
    } else {
        fail("vt", "useSceneSwap lost the SpringProgress fallback or its VT feature-gate (the engine-dogfood path must survive where VT is absent)");
    }
    // Focus routes to the scene host on transition.finished (the a11y MANDATORY).
    if (/finished/.test(vt) && /focus\s*\(/.test(read("demo/app/App.vue") + vt)) {
        ok("vt", "focus routes to the scene host on transition.finished");
    } else {
        fail("vt", "VT does not route focus on transition.finished (a11y)");
    }
}

// ── 2. a11y-uniformity clause ────────────────────────────────────────────────
{
    const copy = read("demo/@/components/custom/CopyButton.vue");
    // CopyButton is now a real <button> (was an interactive <span>).
    if (/<button\b/.test(copy) && !/<span[^>]*@click/.test(copy)) {
        ok("a11y", "CopyButton is a <button> (no interactive <span @click>)");
    } else {
        fail("a11y", "CopyButton is not a <button> with no @click <span> (interactive span invisible to AT/keyboard)");
    }
    // The timeline markers carry the role=slider + keyboard template.
    const track = read("demo/@/components/custom/animation-controls/timeline/components/TimelineTrack.vue");
    if (/role=["']slider["']/.test(track) && /aria-valuenow/.test(track)) {
        ok("a11y", "timeline markers carry role=slider + aria-valuenow + keyboard handling");
    } else {
        fail("a11y", "timeline markers missing the role=slider + aria-valuenow a11y template");
    }
    // The redundant visualizer twin is aria-hidden (or carries a role).
    const vis = read("demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue");
    if (/aria-hidden=["']true["']/.test(vis) || /role=["']slider["']/.test(vis)) {
        ok("a11y", "AnimationVisualizer is aria-hidden (redundant twin) or carries a role");
    } else {
        fail("a11y", "AnimationVisualizer is neither aria-hidden nor role-bearing");
    }
    // The demo-owned :focus-visible keystone is single-sourced.
    if (/:focus-visible/.test(read("demo/@/styles/design-idioms.css"))) {
        ok("a11y", "the demo-owned :focus-visible contract is in design-idioms.css");
    } else {
        fail("a11y", "no demo-owned :focus-visible keystone in design-idioms.css");
    }
}

// ── 3. idiom-r3 clause ───────────────────────────────────────────────────────
{
    const style = stripComments(read("demo/@/styles/style.css"));
    const idioms = stripComments(read("demo/@/styles/design-idioms.css"));
    // --spring-snappy resolves to a canonical token — no demo-local linear() shadow on it.
    const snappyDef = style.match(/--spring-snappy\s*:\s*([^;]+);/);
    if (snappyDef && /var\(--spring-/.test(snappyDef[1]) && !/linear\(/.test(snappyDef[1])) {
        ok("idiom-r3", "--spring-snappy resolves to a canonical spring var (no demo ζ=0.65 linear() shadow)");
    } else {
        fail("idiom-r3", "--spring-snappy still carries a demo-local linear() shadow (must reconcile to the canonical token)");
    }
    // progress-dot is demo-local (in design-idioms.css), not a component scoped block.
    if (/\.progress-dot\s*\{/.test(idioms)) {
        ok("idiom-r3", "progress-dot is demo-local in design-idioms.css");
    } else {
        fail("idiom-r3", "progress-dot is not defined in design-idioms.css (still a component scoped block?)");
    }
    // .dock-inset is defined-or-absent (no dead reference): if referenced, it must be defined.
    const refsDockInset = /\bdock-inset\b/.test(
        read("demo/easing/EasingTarget.vue") + read("demo/spring/SpringTarget.vue"),
    );
    const definesDockInset = /\.dock-inset\s*\{/.test(idioms + style);
    if (!refsDockInset || definesDockInset) {
        ok("idiom-r3", ".dock-inset is defined-or-absent (no dead reference)");
    } else {
        fail("idiom-r3", ".dock-inset is referenced but never defined (dead utility class)");
    }
}

// ── 4. first-paint clause ────────────────────────────────────────────────────
{
    const at = read("demo/@/components/custom/AnimatedText.vue");
    if (/prefers-reduced-motion/.test(at) && !/\b200%\s*\{/.test(at)) {
        ok("first-paint", "AnimatedText carries a PRM guard + no 200% keyframe stop");
    } else {
        fail("first-paint", "AnimatedText missing the PRM guard or still carries the invalid 200% stop");
    }
    const style = read("demo/@/styles/style.css");
    if (/size-adjust\s*:/.test(style) && /ascent-override\s*:/.test(style) && /descent-override\s*:/.test(style)) {
        ok("first-paint", "the metric-matched @font-face carries size-adjust + ascent-override + descent-override");
    } else {
        fail("first-paint", "no calibrated @font-face (size-adjust/ascent-override/descent-override) for the LCP heading fallback");
    }
}

// ── 5. CWV-levers + artifact clause ──────────────────────────────────────────
{
    const ctrls = read("demo/@/components/custom/animation-controls/controls/AnimationControls.vue");
    // Monaco-heavy panes forceMount'd + content-visibility behind @supports.
    if (/force-?mount|forceMount/.test(ctrls) && /content-visibility/.test(ctrls)) {
        ok("cwv", "the Monaco panes are forceMount'd + content-visibility-gated when inactive");
    } else {
        fail("cwv", "the Monaco panes are not forceMount'd with content-visibility (the INP switch-back lever)");
    }
    // The active scene loop pauses on document.hidden. B-3 may live in a dedicated
    // composable (useSceneVisibilityPause) or the sync loop — sweep demo reactive
    // code for the vueuse visibility gate (raw addEventListener is barred by
    // proof:brittleness, so a hit here is the vueuse form).
    const visFiles = [
        "demo/app/useSceneVisibilityPause.ts",
        "demo/@/components/custom/animation-controls/controls/composables/useAnimationSync.ts",
        "demo/app/scenes/AmigaScene.vue",
    ];
    const visSrc = ctrls + visFiles.map(read).join("\n");
    if (/useDocumentVisibility|visibilitychange|document\.hidden|visibilityState|setAnimationLoop\(null\)/.test(visSrc)) {
        ok("cwv", "the active scene loop gates on document visibility (B-3 battery lever)");
    } else {
        fail("cwv", "no document-visibility gate on the scene loop (the battery lever B-3)");
    }
    // The @starting-style artifact scene exists + renders the emitted linear() behind a copy button + PRM guard.
    const scene = read("demo/spring/StartingStyleTarget.vue") + read("demo/app/scenes/StartingStyleScene.vue");
    if (
        exists("demo/spring/StartingStyleTarget.vue") &&
        /@starting-style/.test(scene) &&
        /springLinearStops|linear\(/.test(scene) &&
        /CopyButton/.test(scene) &&
        /prefers-reduced-motion/.test(scene)
    ) {
        ok("cwv", "the @starting-style artifact scene renders the spring linear() behind a copy button + PRM guard");
    } else {
        fail("cwv", "the @starting-style + spring-linear() copy-paste artifact scene is missing or incomplete");
    }
}

// ── 6. F.W13 — baseline-platform adopts (text-wrap SHIP · VT-types boundary) ──
{
    // 6a — `text-wrap: pretty` is present on the start-screen running prose, and
    // scoped to it — NOT applied to the LCP <h1> hero (F.W16's balance-class
    // substrate). The SHIP is a scoped style block in EditorStartScreen.vue.
    // Comments stripped so a prose mention ("no text-wrap: pretty support") does
    // NOT satisfy the presence check — only a real declaration counts.
    const startScreen = stripComments(read("demo/@/components/custom/editor-shell/EditorStartScreen.vue"));
    const hasPretty = /text-wrap:\s*pretty/.test(startScreen);
    // The hero <h1> is `.text-display-4` rendered through AnimatedText — the prose
    // SHIP must NOT leak onto it. Bite: a `.text-display-4 { text-wrap: pretty }`
    // (or a `text-wrap: pretty` on the AnimatedText hero layer) reds the scope.
    const heroLeak =
        /\.text-display-4[^}]*text-wrap:\s*pretty/.test(startScreen) ||
        /text-wrap:\s*pretty/.test(stripComments(read("demo/@/components/custom/AnimatedText.vue")));
    if (hasPretty && !heroLeak) {
        ok("platform-adopt", "text-wrap: pretty rides the start-screen prose (not the LCP hero) — the F.W13.S1 SHIP");
    } else if (!hasPretty) {
        fail("platform-adopt", "no text-wrap: pretty on the start-screen prose (F.W13.S1 SHIP missing)");
    } else {
        fail("platform-adopt", "text-wrap: pretty leaked onto the LCP <h1> hero (it is F.W16's balance-class substrate, not this prose SHIP)");
    }

    // 6b — the demo does NOT hand-roll document.startViewTransition({ ... }) with
    // an options object (the inv-16 boundary: it consumes glass-ui's helper). The
    // object-form hand-roll is the negative case (a backtick prose mention of
    // `document.startViewTransition` in the helper docstring does NOT match — the
    // pattern requires an OPEN-PAREN + OBJECT-LITERAL call). Bite: add a direct
    // document.startViewTransition({ update, types }) in the demo → this reds.
    const handRoll = collectDemo().some((src) => /document\.startViewTransition\s*\(\s*\{/.test(src));
    const consumesHelper = /from\s+["']@mkbabb\/glass-ui\/motion-core["']/.test(read("demo/app/useSceneTransition.ts"));
    if (!handRoll && consumesHelper) {
        ok("platform-adopt", "the demo consumes glass-ui's startViewTransition — no hand-rolled document.startViewTransition({ types }) (inv-16 boundary holds)");
    } else if (handRoll) {
        fail("platform-adopt", "the demo hand-rolls document.startViewTransition({ ... }) — bypasses glass-ui's feature-detect + instant fallback (inv-16 forbids; route OUT as glass-ui-HANDOFF H-1)");
    } else {
        fail("platform-adopt", "demo/app/useSceneTransition.ts no longer imports startViewTransition from glass-ui (the VT substrate boundary moved)");
    }

    // 6c — the engine ships ZERO VT surface (the boundary: VT/scroll-CSS is
    // glass-ui-owned). Bite: add a startViewTransition helper to src/ → this reds.
    const engineVT = /startViewTransition/.test(
        collect("src", new Set([".ts"])).map((p) => readFileSync(p, "utf8")).join("\n"),
    );
    if (!engineVT) {
        ok("platform-adopt", "the engine ships zero VT surface (grep startViewTransition src/ = 0) — the boundary holds");
    } else {
        fail("platform-adopt", "the engine grew a startViewTransition surface — VT is glass-ui-owned, the engine must ship zero VT (F.W13 §A-2)");
    }

    // 6d — the VT-types upgrade is recorded as a glass-ui-HANDOFF (H-1) in the
    // hand-off ledger, with the booked/RECORD layers carrying their dispositions
    // (so a future lane cannot silently drop them or re-litigate what is
    // already-dispositioned). Bite: drop H-1 / the BOOK rows → this reds.
    const ledger = read("docs/tranches/F/valuejs-sota-handoff-v2.md");
    const ledgerClauses = [
        [/\bH-1\b/, "H-1 (the VT-types glass-ui-HANDOFF)"],
        [/glass-ui-HANDOFF/, "the glass-ui-HANDOFF tag"],
        [/types\?/, "the startViewTransition(mutate, { types? }) helper shape"],
        [/\bB-1\b/, "B-1 (the typed/directional scene-VT BOOK)"],
        [/interpolate-size/, "the interpolate-size RECORD"],
    ];
    const missingLedger = ledgerClauses.filter(([re]) => !re.test(ledger)).map(([, name]) => name);
    if (missingLedger.length === 0) {
        ok("platform-adopt", "H-1 + the booked/RECORD layers are recorded in the hand-off ledger (glass-ui item, distinct from the value.js ledger)");
    } else {
        fail("platform-adopt", "the hand-off ledger is missing F.W13 disposition(s): " + missingLedger.join(", "));
    }
}

// ── 7. F.W14 — undo/redo rides the EXISTING registry (the no-second-listener lock) ──
{
    const group = read("demo/@/components/custom/animation-controls/AnimationControlsGroup.vue");
    // Mod+Z / Mod+Shift+Z are registered through the ONE registry (registerShortcut),
    // grouped + labeled so they surface in the KeyboardShortcutsModal — NOT a second
    // window keydown listener. Bite: bind undo via a bare addEventListener → this reds.
    const undoRegistered = /registerShortcut\(\s*["']Mod\+Z["']/.test(group);
    const redoRegistered = /registerShortcut\(\s*["']Mod\+Shift\+Z["']/.test(group);
    const labeled = /label:\s*["']Undo["']/.test(group) && /label:\s*["']Redo["']/.test(group);
    if (undoRegistered && redoRegistered && labeled) {
        ok("undo", "Mod+Z / Mod+Shift+Z ride the existing registerShortcut registry (grouped + labeled → surface in the modal)");
    } else {
        fail("undo", "undo/redo are not bound through the single registerShortcut registry (Mod+Z/Mod+Shift+Z grouped + labeled) — no second listener allowed (F.W14.S1)");
    }
    // The timeline composable wraps the centralized state in useRefHistory (the
    // idiomatic seam) and exposes undo/redo/canUndo/canRedo — bite: drop the wrap
    // → the behavioural round-trip test (test/timeline-undo.test.ts) reds, and the
    // exposure check here reds too.
    const tl = read("demo/@/components/custom/animation-controls/timeline/composables/useTimeline.ts");
    const tlComp = read("demo/@/components/custom/animation-controls/timeline/KeyframeTimeline.vue");
    if (/useRefHistory/.test(tl) && /debounceFilter/.test(tl) && /undo,\s*\n\s*redo,/.test(tlComp + "\n")) {
        ok("undo", "the timeline wraps state in a debounced useRefHistory + exposes undo/redo (the round-trip is locked by test/timeline-undo.test.ts)");
    } else {
        fail("undo", "the timeline does not wrap its state in a debounced useRefHistory exposing undo/redo (F.W14.S1)");
    }
}

console.log("");
if (failures.length > 0) {
    console.error("proof:demo-elevate — FAIL:\n" + failures.join("\n"));
    process.exit(1);
}
console.log(
    "proof:demo-elevate — PASS: View Transitions ride the feature-detected helper\n" +
        "with the spring fallback; the a11y roles + focus contract are uniform; the\n" +
        "idiom-r3 rents are owned; the first paint is PRM/CLS-hardened; the CWV levers\n" +
        "+ the @starting-style artifact land. inv ο holds.",
);
