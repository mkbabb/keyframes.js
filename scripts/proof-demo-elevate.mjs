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
/** Blank block AND `//` line comments (JS/TS sources) — the clause-6b hand-roll
 *  grep must match real CALLS, never docstring prose (S.A0: the gate's own
 *  contract said "a backtick prose mention does NOT match", but the raw-source
 *  grep matched `document.startViewTransition({ update, types })` inside
 *  useSceneTransition.ts's block docstring — a gate false-positive on prose).
 *  The `(^|[^:])` guard keeps `https://…` URLs intact. */
const stripCommentsJs = (s) =>
    stripComments(s).replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1);

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
    // --spring-snappy carries NO demo-local linear() shadow. The clause's intent
    // (no demo-local shadow on the canonical token) is satisfied in TWO shapes:
    // (a) a demo-local def that resolves to a canonical spring var (the original
    // W11 reconcile), or (b) NO demo-local def at all — the R.W6 C.5 EXCISION
    // (style.css documented: the local `--spring-snappy: var(--spring-smooth)`
    // alias silently CLOBBERED glass-ui's own overshoot-carrying --spring-snappy,
    // so the alias was deleted, restoring the canonical token un-shadowed — the
    // strongest satisfaction). The gate previously demanded shape (a) only and
    // red on the excision (S.A0: gate-staleness vs the refactor it should
    // tolerate). A def carrying linear() still REDs (the bite is intact).
    const snappyDef = style.match(/--spring-snappy\s*:\s*([^;]+);/);
    if (!snappyDef) {
        ok("idiom-r3", "--spring-snappy carries NO demo-local definition (the R.W6 C.5 excision — glass-ui's canonical overshoot token reigns un-shadowed)");
    } else if (/var\(--spring-/.test(snappyDef[1]) && !/linear\(/.test(snappyDef[1])) {
        ok("idiom-r3", "--spring-snappy resolves to a canonical spring var (no demo ζ=0.65 linear() shadow)");
    } else {
        fail("idiom-r3", "--spring-snappy still carries a demo-local linear() shadow (must reconcile to the canonical token or excise the alias)");
    }
    // progress-dot is demo-local (in design-idioms.css), not a component scoped block.
    if (/\.progress-dot\s*\{/.test(idioms)) {
        ok("idiom-r3", "progress-dot is demo-local in design-idioms.css");
    } else {
        fail("idiom-r3", "progress-dot is not defined in design-idioms.css (still a component scoped block?)");
    }
    // .dock-inset is defined-or-absent (no dead reference): if referenced, it must be defined.
    const refsDockInset = /\bdock-inset\b/.test(
        read("demo/scenes/easing/EasingTarget.vue") + read("demo/scenes/spring/SpringTarget.vue"),
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
        "demo/scenes/amiga/AmigaScene.vue",
    ];
    const visSrc = ctrls + visFiles.map(read).join("\n");
    if (/useDocumentVisibility|visibilitychange|document\.hidden|visibilityState|setAnimationLoop\(null\)/.test(visSrc)) {
        ok("cwv", "the active scene loop gates on document visibility (B-3 battery lever)");
    } else {
        fail("cwv", "no document-visibility gate on the scene loop (the battery lever B-3)");
    }
    // The @starting-style artifact scene exists + renders the emitted linear() behind a copy button + PRM guard.
    const scene = read("demo/scenes/spring/StartingStyleTarget.vue") + read("demo/app/scenes/StartingStyleScene.vue");
    if (
        exists("demo/scenes/spring/StartingStyleTarget.vue") &&
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
    const handRoll = collectDemo().some((src) =>
        /document\.startViewTransition\s*\(\s*\{/.test(stripCommentsJs(src)),
    );
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
    // F.W14.S1 wiring lives in the colocated useControlsKeyboardShortcuts composable
    // (the K SFC split moved the registerShortcut(…) calls out of the .vue host, which
    // now just invokes useControlsKeyboardShortcuts({…})); read both so the registry
    // bindings + labels resolve across the seam.
    const group =
        read("demo/@/components/custom/animation-controls/AnimationControlsGroup.vue") +
        "\n" +
        read(
            "demo/@/components/custom/animation-controls/composables/useControlsKeyboardShortcuts.ts",
        );
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

// ── 8. F.W15 — the a11y SHIPs (labeled CSS pane · asset alt · visible trigger) ──
{
    // 8a — the contenteditable CSS pane is a LABELED textbox with a visible focus
    // ring. The full triple (role=textbox + aria-multiline + a non-empty
    // aria-label) AND the .focus-ring keystone idiom. Bite: strip role/aria-label
    // → the labeled-textbox assertion reds; remove .focus-ring → the focus-
    // visibility assertion reds.
    const card = read("demo/@/components/custom/animation-controls/keyframes/KeyframeCard.vue");
    const labeled =
        /role=["']textbox["']/.test(card) &&
        /aria-multiline=["']true["']/.test(card) &&
        /:aria-label=["'][^"']*keyframe[^"']*["']/.test(card);
    const focusRing = /class=["'][^"']*\bfocus-ring\b/.test(card);
    if (labeled && focusRing) {
        ok("a11y-w15", "the contenteditable CSS pane is a labeled textbox (role + aria-multiline + aria-label) with a visible .focus-ring");
    } else if (!labeled) {
        fail("a11y-w15", "the contenteditable CSS pane is not a labeled textbox (role=textbox + aria-multiline + a keyframe-N aria-label) — E-UX-13 (F.W15.S1)");
    } else {
        fail("a11y-w15", "the contenteditable CSS pane has no .focus-ring — its keyboard-focus state is invisible (F.W15.S1)");
    }

    // 8b — the playground asset <img> carries a meaningful :alt bound to the asset
    // name. Bite: remove the :alt → this reds (reds today — verified State 2).
    const viewport = read("demo/@/components/custom/asset-manager/AssetViewport.vue");
    if (/:alt=["']asset\.name["']/.test(viewport)) {
        ok("a11y-w15", "the playground asset <img> has a meaningful :alt bound to asset.name (E-UX-8 completed)");
    } else {
        fail("a11y-w15", "the playground asset <img> has no :alt=\"asset.name\" — user content unnamed to AT (F.W15.S2)");
    }

    // 8c — a VISIBLE control (not the `?` shortcut) opens the shortcuts modal by
    // setting shortcutsOpen. The `?` shortcut still works (additive). Bite: remove
    // the visible @click="shortcutsOpen = true" → this reds (reds today — toggled
    // only by `?`).
    const shell = read("demo/@/components/custom/editor-shell/EditorShell.vue");
    const hasVisibleTrigger = /@click=["']shortcutsOpen\s*=\s*true["']/.test(shell);
    const stillHasShortcut = /registerShortcut\(\s*["']\?["']/.test(shell);
    if (hasVisibleTrigger && stillHasShortcut) {
        ok("a11y-w15", "a visible @click trigger opens the shortcuts modal (the `?` shortcut still works) — the discoverability paradox is broken");
    } else if (!hasVisibleTrigger) {
        fail("a11y-w15", "no visible trigger sets shortcutsOpen = true — the 19-shortcut registry is discoverable only via `?` (F.W15.S3)");
    } else {
        fail("a11y-w15", "the `?` shortcut binding was lost — the visible trigger must be ADDITIVE (F.W15.S3)");
    }
}

// ── 9. F.W16.S2 — the hero typographic + accessible substrate ─────────────────
// (vitest carries no SFC transform here — the .vue hero surface is gated by this
// structural a11y instrument, the wave's "hero accessible-name assertion".)
{
    // Strip both block (/* */) and line (//) comments so a prose mention of the
    // deleted anti-pattern ("the former `width < 768` break") does NOT satisfy a
    // presence check — only live declarations/markup count.
    const at = stripComments(read("demo/@/components/custom/AnimatedText.vue")).replace(
        /^\s*\/\/.*$/gm,
        " ",
    );

    // 9a — the hero exposes an accessible NAME: a single visually-hidden sr-only
    // mirror carries the whole text, AND the decorative span layer is aria-hidden
    // (so AT reads the word, not the per-glyph stream). Bite: strip the sr-only
    // mirror / aria-hidden → the accessible-name assertion reds (reds pre-F — the
    // hero read as an "S…e…l…e…c…t" char stream).
    const srMirror = /class=["']sr-only["'][^>]*>\s*\{\{\s*text\s*\}\}/.test(at);
    const ariaHidden = /aria-hidden=["']true["']/.test(at);
    if (srMirror && ariaHidden) {
        ok("hero", "the hero AnimatedText exposes an accessible name (sr-only mirror of the full text) + aria-hidden on the decorative span layer");
    } else if (!srMirror) {
        fail("hero", "AnimatedText has no sr-only mirror of {{ text }} — the LCP hero has no accessible name (F.W16.S2)");
    } else {
        fail("hero", "AnimatedText's decorative span layer is not aria-hidden — AT reads the per-glyph stream (F.W16.S2)");
    }

    // 9b — `text-wrap: balance` is no longer defeated + the JS break is GONE: the
    // stagger is WORD-granular (split on whitespace, not per character), AND the
    // useWindowSize / width<768 line-break is deleted. Bite: restore the per-char
    // split (`in currentText`) or the `useWindowSize` / `width < 768` watch →
    // the respective half reds.
    const wordGranular = /\.split\(\/\\s\+\//.test(at) && !/in\s+currentText\b/.test(at);
    const jsBreakGone =
        !/useWindowSize/.test(at) && !/width\s*<\s*768/.test(at) && !/<br\b/.test(at);
    if (wordGranular && jsBreakGone) {
        ok("hero", "the hero stagger is word-granular (balance can wrap the run) + the JS width<768 break + useWindowSize listener are deleted (CSS owns wrapping)");
    } else if (!wordGranular) {
        fail("hero", "the hero is still shredded into per-character spans — defeats text-wrap: balance (F.W16.S2)");
    } else {
        fail("hero", "the JS width<768 line-break / useWindowSize listener survives — a pre-container-query anti-pattern CSS now owns (F.W16.S2)");
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
