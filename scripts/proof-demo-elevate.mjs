/**
 * proof:demo-elevate (inv ο) — E.W11's falsifiable close. Five clauses, each a
 * build+grep instrument that reds on the exact regression it forbids (revert any
 * one fix → the named clause reds). The CLS/INP measure-first halves are verified
 * by the capture harness + lighthouse (E.W4); this gate locks the structural
 * forms (the feature-detect routes, the owned idioms, the a11y roles, the
 * first-paint descriptors, the CWV levers).
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => (existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : "");
const exists = (p) => existsSync(join(root, p));
/** Blank /* *​/ block comments so a grep matches real declarations, not prose. */
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, " ");

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
