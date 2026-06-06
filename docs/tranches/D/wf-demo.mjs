export const meta = {
  name: 'tranche-d-demo',
  description: 'Drive keyframes.js demo waves D.W1+W2+W3 (decompose · styling · brittleness) in file-disjoint parallel lanes',
  phases: [
    { title: 'Scaffold', detail: 'shared new files + tokens (design-idioms, parse util, isInsideToaster, proof scripts)' },
    { title: 'Lanes', detail: '4 file-disjoint lanes — each applies W1+W2+W3 to its own components' },
    { title: 'Coordinate', detail: 'utils.css uncage (the one cross-file move) + style.css finalize' },
    { title: 'Verify', detail: 'tsc + tests + proof gates; fix any breakage' },
  ],
}

const REPO = '/Users/mkbabb/Programming/keyframes.js'
const SPECS = `Authoritative specs to READ FIRST (do exactly as written):
- ${REPO}/docs/tranches/D/waves/D.W1.md (decompose), D.W2.md (styling), D.W3.md (brittleness)
- ${REPO}/docs/tranches/D/audit/frontend-findings.md, styling-findings.md, brittleness-findings.md`

const INVARIANTS = `HARD INVARIANTS (every lane):
- inv-16: write ONLY files in YOUR scope below. Touch no other lane's files.
- PRESERVE each component's public interface (props/emits/slots/exported names) and BEHAVIOR (isomorphic — pixels unchanged unless the spec names a befitting delta) so cross-lane imports keep resolving.
- TypeScript strict: \`cd ${REPO} && npx tsc --noEmit\` MUST stay clean for your edits — fix every broken import path you introduce (decomposition moves code → update importers).
- NO legacy / alias / back-compat shim. Net-deletion of duplication. KISS — smallest legible seam, no over-fragmentation.
- Do NOT edit vendored shadcn components under demo/@/components/ui/ (leaf-tail there is OUT of scope).
- Do NOT edit demo/@/styles/utils.css (the Coordinate phase owns the uncaging). Where W2 says a component-specific rule leaves utils.css, ADD the scoped \`<style scoped>\` rule to YOUR component now; the Coordinate phase deletes the global copy.
- CONSUME the scaffold (already created this run): demo/@/styles/design-idioms.css defines --rainbow-* (incl --rainbow-cyan), --color-gold, .scale-on-hover, @keyframes enter, the .text-gold utility, and the --z-behind/--panel-max-h/--dock-panel-width/--target-viewport-h tokens. The pure parse adapter is demo/@/components/custom/animation-controls/keyframes/utils/parseAnimationCSS.ts. The toast guard is the isInsideToaster() helper (find it via grep).
- Leaf-tail (W2.S4) IN YOUR FILES ONLY: text-base→.text-body, text-sm→.text-small, muted/control text-xs→.text-admin-label (mono readouts→.text-mono-caption), italic captions→.text-caption — by semantic register, not mechanically. Sub-rem text-[…] arbitrary values fold in too.
- Report exactly what you changed.`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['lane', 'filesChanged', 'summary', 'tscClean'],
  properties: {
    lane: { type: 'string' },
    filesChanged: { type: 'array', items: { type: 'string' } },
    newFiles: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string', description: 'what W1/W2/W3 transformations were applied' },
    tscClean: { type: 'boolean', description: 'did `npx tsc --noEmit` pass after your edits' },
    notes: { type: 'string', description: 'anything the verify/coordinate phase must know (e.g. rules moved to scoped that utils.css must drop)' },
  },
}

// ── Phase 1 — Scaffold (shared new files; disjoint) ──────────────────────────
phase('Scaffold')
const scaffold = await parallel([
  () => agent(`Create the demo's localized design-idiom layer + style.css wiring (D.W2.S1, styling-findings §1-4).
${SPECS}
SCOPE — create/edit ONLY:
- NEW demo/@/styles/design-idioms.css: DEFINE the demo-owned idioms the demo references but rents from glass-ui today (verify with grep that they have zero demo-local def): the --rainbow-{red,orange,yellow,green,blue,violet} six-colour family + a named --rainbow-cyan (folding the inline hsl(180 80% 50%) cyan stop in KeyframesEditor's progress-bar gradient); --color-gold (theme-aware via light-dark() if befitting); .scale-on-hover (transform: scale(var(--scale-hover,1.05)) on :hover, honoring prefers-reduced-motion); @keyframes enter (opacity + 0.5rem x-translate, the existing --tw-enter-* values) so the tab slide no longer depends on tw-animate-css's internal name. Also DEFINE a .text-gold utility (consumes --color-gold) and the layout tokens --panel-max-h, --dock-panel-width, --target-viewport-h, and --z-behind:-10. Do NOT re-author glass-ui's .rainbow-vivid/.rainbow-pastel recipes (inv-16).
- EDIT demo/@/styles/style.css: @import "./design-idioms.css" immediately AFTER the @mkbabb/glass-ui/styles import so the demo's defs are authoritative; add a documented z-index ordered-layer contract comment recording the glass-ui --z-* scale (content<controls<bar<dock<overlay<popover<modal) + --z-behind. Keep it isomorphic.
Do NOT touch utils.css or any component. Run \`cd ${REPO} && npx tsc --noEmit\` is N/A for CSS; instead confirm the demo still builds conceptually (valid CSS).`, { label: 'scaffold:design-idioms', phase: 'Scaffold', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`Create the ONE pure CSS→AST parse adapter module, deduping the two inline copies (D.W1.S2, frontend-findings F6).
${SPECS}
SCOPE — create ONLY:
- NEW demo/@/components/custom/animation-controls/keyframes/utils/parseAnimationCSS.ts exporting a single pure function parseAnimationCSS(input: string) returning { keyframes, options, values } — the SUPERSET body: keep useKeyframesEditor.ts's anonymous-@keyframes wrap guard (/@keyframes\\b/i.test(input) ? input : \`@keyframes anonymous {\\n\${input}\\n}\`) so both call sites' inputs are covered. Mirror the existing bodies exactly (read useKeyframesEditor.ts:27 \`parseAnimationCSS\` and KeyframesStringControls.vue:55 \`parseCSSAnimationKeyframes\` — same parseCSSStylesheet→resolveKeyframes→extractAnimationOptions→non-animation values adapter). Pure: no Vue reactivity. The keyframes Lane B will delete the two inline copies and import this; you only CREATE the module.
Confirm it typechecks in isolation (\`cd ${REPO} && npx tsc --noEmit\` — your new file must not introduce errors).`, { label: 'scaffold:parse-util', phase: 'Scaffold', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`Create the documented toast-guard helper (D.W3.S1, brittleness-findings B3).
${SPECS}
SCOPE — create ONLY a single shared module exporting \`isInsideToaster(el: EventTarget | null): boolean\` whose one body holds \`(el as Element | null)?.closest('[data-sonner-toaster]') != null\` with an explicit comment naming it as the vue-sonner private DOM contract (the attribute + the version it depends on, per package.json). Put it at demo/@/composables/useToastGuard.ts (or demo/@/utils/) — pick the idiomatic home and report the exact path so Lane B and Lane D can import it. Two dialogs (CSSPasteDialog.vue:7 [Lane B], KeyframesEditor.vue:78 [Lane B]) will consume it; you only CREATE it. tsc must stay clean.`, { label: 'scaffold:toast-guard', phase: 'Scaffold', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`Create the three demo proof-gate scripts + wire them (D.W1/W2/W3 hard gates). Model them on the existing ${REPO}/scripts/proof-dogfood.mjs + proof-boundary.mjs (read one for style; node ESM; exit 1 on failure with clear per-clause messages; each clause BITES).
${SPECS}
SCOPE — create ONLY:
- scripts/proof-decomposition.mjs (D.W1): every demo component/composable under demo/@/components/custom/animation-controls/** ≤ ceiling (350 for .vue, 250 for .ts); the parse adapter has exactly ONE definition (grep finds one \`export\` of parseAnimationCSS in keyframes/utils/, the two inline copies GONE); timeline/composables/ holds no module lacking a vue import (the three pure utils moved to timeline/utils/); the four W0-flagged rAF/timeout sites are gone (no setTimeout/requestAnimationFrame in useTimeline.ts/KeyframesStringControls.vue/usePaneHover.ts — the engine-loop AmigaScene allowlist excepted).
- scripts/proof-idioms.mjs (D.W2): every demo-referenced --rainbow-*/--color-gold/.scale-on-hover/@keyframes enter resolves to a DEMO-LOCAL definition in design-idioms.css (grep design-idioms.css for each def; bite = stub the file → reds); the leaf-tail sweep \`grep -rnoE "\\\\btext-sm\\\\b|\\\\btext-xs\\\\b|\\\\btext-base\\\\b"\` over demo/ .vue EXCLUDING demo/@/components/ui/ (vendored shadcn) AND dist/ returns 0; utils.css carries zero component-specific selectors (.tab-trigger/.btn-playback/.demo-/.ppmycota/tabpanel) or is deleted.
- scripts/proof-brittleness.mjs (D.W3): zero global document.querySelector* in demo reactive code (allowlist document.head.querySelector("#id") style-element idiom); zero raw z-[N] bracket values + every z-index: raw value resolves to a --z-* token; built/​source CSS carries @supports guards covering dvh, env(safe-area-inset-*), -webkit-mask-image.
- Wire all three into package.json scripts (proof:decomposition, proof:idioms, proof:brittleness) and add steps to .github/workflows/ci.yml's demo-smoke job after the existing demo gates.
You OWN package.json + ci.yml + scripts/proof-{decomposition,idioms,brittleness}.mjs. The gates will RED now (work not yet done) — that is correct; the lanes + coordinate phase make them green. Confirm the scripts are syntactically valid node (\`node --check\`).`, { label: 'scaffold:proof-scripts', phase: 'Scaffold', agentType: 'general-purpose', schema: SCHEMA }),
])
log(`Scaffold: ${scaffold.filter(Boolean).length}/4 agents done`)

// ── Phase 2 — Lanes (4 file-disjoint; each does W1+W2+W3 for its files) ───────
phase('Lanes')
const AC = 'demo/@/components/custom/animation-controls'
const lanes = await parallel([
  () => agent(`LANE A — animation-controls root + controls + composables. Apply D.W1+W2+W3 to YOUR files ONLY.
${SPECS}
${INVARIANTS}
YOUR FILES (and the sub-files you create under their dirs):
- ${AC}/AnimationControlsGroup.vue (552L) — W1.S1: decompose at its seams into ${AC}/components/ControlsPaneWrapper.vue (shell) + ${AC}/components/RibbonBar.vue (transport ribbon) + ${AC}/composables/useControlsLayout.ts (sizing/open-state). The rainbow SVG <defs> stay where the brush uses them. W2.S3: text-[var(--color-gold)]→.text-gold (scaffold), !border-transparent→a scoped border-color rule, max-h-[60vh]/w-[90vw]→tokens/scoped. W2.S4 leaf-tail.
- ${AC}/controls/{AnimationControls.vue, AnimationControlsControls.vue, PlaybackRibbon.vue, AnimationVisualizer.vue} — W2: the [data-state=active][role=tabpanel] tab-panel slide rule moves to AnimationControls.vue <style scoped> consuming @keyframes enter (scaffold); .tab-trigger-* rules → AnimationControls.vue scoped; .btn-playback* → PlaybackRibbon.vue scoped; leaf-tail. W3.S4: gate ${AC}/controls/composables/useAnimationSync.ts rAF bridge so it idles when the animation is provably static (settle-detect + visibility — NOT the naive isStarted guard its docstring warns against; prefer useRafFn pause/resume), happy path byte-identical.
- ${AC}/AnimationMenuBar.vue — W3.S3: @supports guard + 0px fallback for env(safe-area-inset-*). (Do NOT rename it — that is W5/gated.)
- ${AC}/composables/usePaneHover.ts — W1.S4: setTimeout→useTimeoutFn. ${AC}/composables/useScrollFade.ts — W3.S4: harden listener re-attach (detach old boundScrollEl on mid-flight el swap; idempotent onUnmounted; vueuse useEventListener/useResizeObserver if cleaner).
NOTE: AnimationControlsControls.vue was already edited this tranche (it calls props.animation.toggle()) — preserve that. Run \`cd ${REPO} && npx tsc --noEmit\` and fix your import breakage.`, { label: 'laneA:controls', phase: 'Lanes', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`LANE B — keyframes subtree + CSSPasteDialog. Apply D.W1+W2+W3 to YOUR files ONLY.
${SPECS}
${INVARIANTS}
YOUR FILES:
- ${AC}/keyframes/KeyframesEditor.vue (487L) — W1.S2: decompose — lift the imperative highlight.js block onto the existing ${AC}/keyframes/composables/useHighlightCSS.ts (consolidate inline highlight/setHighlightingString onto it), split the frame-card editor UI into colocated sub-components under keyframes/components/ as befitting; keep KeyframesEditor.vue the entry under 350L. W3.S1: the global \`document.querySelectorAll("pre")\` (≈:439) → scope to the component's OWN <pre> via useTemplateRef (drive only the editor's known refs — the global sweep is the bug). W3.S1: the [data-sonner-toaster] guard (≈:78) → import isInsideToaster (scaffold). W3.S4: fix the useKeyframesEditor array-watch flush (deterministic flush:'post'/nextTick so a stale frame array can't paint).
- ${AC}/keyframes/composables/useKeyframesEditor.ts (383L) — W1.S2: split parsing-orchestration vs UI-state into colocated sub-composables; DELETE the inline \`parseAnimationCSS\` (≈:27) and import the scaffold's keyframes/utils/parseAnimationCSS.ts. Keep it ≤250L. (The formatCSS import already points at @mkbabb/value.js — leave it.)
- ${AC}/keyframes/KeyframesStringControls.vue — W1.S2: DELETE its inline \`parseCSSAnimationKeyframes\` (≈:55) and import the scaffold parse util. W1.S4: the 300ms format-flag setTimeout (≈:100/120)→useTimeoutFn.
- ${AC}/keyframes/KeyframeCard.vue, useHighlightCSS.ts — W2 leaf-tail / consume as needed.
- demo/@/components/custom/CSSPasteDialog.vue — W3.S1: the [data-sonner-toaster] guard (:7) → isInsideToaster (scaffold).
Run \`cd ${REPO} && npx tsc --noEmit\` and fix your import breakage.`, { label: 'laneB:keyframes', phase: 'Lanes', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`LANE C — timeline subtree. Apply D.W1+W2+W3 to YOUR files ONLY.
${SPECS}
${INVARIANTS}
YOUR FILES:
- ${AC}/timeline/KeyframeTimeline.vue (441L) — W1.S3: decompose — a ${AC}/timeline/components/TimelineTrack.vue (diamonds + playhead) + a ${AC}/timeline/components/TimelineHoverPreview.vue (html2canvas preview); keep KeyframeTimeline.vue the entry ≤350L. W2 leaf-tail.
- ${AC}/timeline/composables/useTimeline.ts (251L) — W1.S3: split ops (CRUD/scrub) vs build (rebuild/import-export over timelineEngine) into colocated sub-composables; ≤250L. W1.S4: the one-shot \`requestAnimationFrame\` await (≈:206)→nextFrame/useRafFn idiom.
- ${AC}/timeline/composables/{timelineEngine.ts, snapshotCapture.ts, flattenVars.ts} — W1.S3: these are PURE (zero vue reactivity) — MOVE all three to ${AC}/timeline/utils/ and fix every importer (useTimeline.ts, KeyframeTimeline.vue, and timelineEngine.ts's own relative import of flattenVars). timelineEngine imports CSSKeyframesToString from @src/animation/format — keep that.
- ${AC}/timeline/TimelineCaret.vue, composables/useZoomPan.ts — W2 leaf-tail as needed (useZoomPan is a real composable, stays).
Run \`cd ${REPO} && npx tsc --noEmit\` and fix your import breakage.`, { label: 'laneC:timeline', phase: 'Lanes', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`LANE D — easing + spring + editor-shell + scenes + matrix + custom selects. Apply D.W2+W3 to YOUR files ONLY (no W1 decomposition here — none of these are oversized).
${SPECS}
${INVARIANTS}
YOUR FILES:
- demo/easing/EasingTarget.vue — W3.S1: the .closest(".easing-target") (≈:142) + .querySelector(".track-container") (≈:217) string-class DOM walks → useTemplateRef owned refs (read the vars off the ref, not a class match). W2 leaf-tail.
- demo/easing/EasingSidebar.vue, demo/spring/{SpringTarget.vue, SpringSidebar.vue} — W2.S3: text-[0.6rem]/text-[0.65rem]→ the ladder's smallest rung (.text-caption/.text-admin-label); W2.S4 leaf-tail.
- demo/@/components/custom/EasingSelect.vue — W2.S3: !flex/![-webkit-line-clamp:unset]/!overflow-visible (:8) → a scoped rule on the select trigger; max-h-[min(24rem,60dvh)]→--panel-max-h token (scaffold). leaf-tail.
- demo/@/components/custom/{ResponsiveSelect.vue, CommandPalette.vue, KeyboardShortcutsModal.vue} — W2.S3/S4: max-h-[60vh/dvh]→--panel-max-h; drop redundant backdrop-blur-sm on KeyboardShortcutsModal (DialogContent's glass-floating owns the blur); leaf-tail.
- demo/@/components/editor-shell/{EditorShell.vue, EditorHeader.vue} — W3.S3: @supports not (height:100dvh) fallback for the h-dvh shell; EditorHeader W1.S4 hover-out setTimeout→useTimeoutFn.
- demo/app/App.vue (already edited this tranche — preserve group.resume()), demo/app/scenes/{CubeScene.vue, SquareScene.vue}, demo/cube/CubeTarget.vue, demo/@/components/custom/matrix-editor/MatrixEditor.vue — W3.S2: z-index:-10 (CubeTarget:199)→ the --z-behind token (scaffold); the raw tailwind rungs z-10/z-20/z-0 (CubeTarget:42, CubeScene:117, MatrixEditor:13, KeyframeCard is Lane B's) → the semantic z-* names where they map, else a documented local-stacking comment. text-[var(--ppmycota-primary)] (App.vue:46) co-locates with the brand token. -webkit-mask-image @supports where the scroll-fade lacks the prefix (AnimationControls is Lane A; do YOUR mask sites). leaf-tail in your files.
Run \`cd ${REPO} && npx tsc --noEmit\` and fix your import breakage.`, { label: 'laneD:scenes-easing', phase: 'Lanes', agentType: 'general-purpose', schema: SCHEMA }),
])
log(`Lanes: ${lanes.filter(Boolean).length}/4 done`)

// ── Phase 3 — Coordinate (utils.css uncage — the one cross-file move) ─────────
phase('Coordinate')
const coord = await agent(`COORDINATE — finalize the utils.css uncaging (D.W2.S2) now that the lanes added their scoped rules.
${SPECS}
The lane agents ADDED component-specific rules to their components' <style scoped> (tab-trigger→AnimationControls, btn-playback→PlaybackRibbon, tabpanel→AnimationControls, etc.). Now make demo/@/styles/utils.css carry ONLY genuinely-global utilities:
- Read demo/@/styles/utils.css. For each component-specific family still present (.tab-trigger-*, .btn-playback*, .demo-container/.demo-box, the [data-state=active][role=tabpanel] rule, .ppmycota-* + --ppmycota-primary): if a lane already moved it to scope, DELETE the global copy; if NOT yet scoped (verify by grep), MOVE it to its owning component's <style scoped> (.demo-* are shared by the standalone simple/square scenes — keep in the smallest shared scope: a demo/@/styles/ partial they import, or style.css; document the choice).
- After the moves, utils.css should hold only .container-inline-size/.icon/.is-disabled — if that residue is ≤3 rules, FOLD them into style.css @layer and DELETE utils.css entirely (no file for 3 utilities). Decide + record in your notes.
Then run \`cd ${REPO} && npx tsc --noEmit\` (clean) and \`cd ${REPO} && node scripts/proof-idioms.mjs\` — report its output. inv-16; isomorphic (scoped rules render identically — no specificity change for class selectors).`, { label: 'coordinate:uncage', phase: 'Coordinate', agentType: 'general-purpose', schema: SCHEMA })
log(`Coordinate: ${coord ? 'done' : 'skipped'}`)

// ── Phase 4 — Verify + fix ───────────────────────────────────────────────────
phase('Verify')
const verify = await agent(`VERIFY + FIX the demo waves D.W1/W2/W3. Run, from ${REPO}:
1. \`npx tsc --noEmit\` (full, incl demo) — MUST be clean. Fix any broken import / type error from the decomposition (move-and-rename fallout is the likely culprit — grep for the moved symbol, fix importers).
2. \`npx vitest run\` — the 335 engine/unit tests + editor-parsing tests MUST stay green (the demo refactor must not regress parsing). Fix regressions.
3. \`node scripts/proof-decomposition.mjs\`, \`node scripts/proof-idioms.mjs\`, \`node scripts/proof-brittleness.mjs\` — report each; fix the demo so each PASSES (size ceilings, single parse adapter, pure utils re-homed, idioms demo-local, leaf-tail=0 excl ui/, utils.css uncaged, no global document.querySelector*, z-scale single-sourced, @supports present).
4. \`npm run proof:boundary && npm run proof:engine && npm run proof:dogfood\` — these W4/library gates MUST stay green.
Do NOT run the full demo build (gh-pages) — tsc + tests + the proof greps are the correctness signal here. Report the FINAL state of each gate (pass/fail) and every fix you made. If a gate cannot pass without violating an invariant, report WHY rather than forcing it.`, { label: 'verify:gates', phase: 'Verify', agentType: 'general-purpose', schema: {
  type: 'object', additionalProperties: false,
  required: ['tscClean', 'testsPass', 'gates', 'fixes'],
  properties: {
    tscClean: { type: 'boolean' },
    testsPass: { type: 'boolean' },
    gates: { type: 'object', description: 'per-gate pass/fail: proof-decomposition, proof-idioms, proof-brittleness, proof-boundary, proof-engine, proof-dogfood', additionalProperties: { type: 'string' } },
    fixes: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' }, description: 'anything that could not be made green + why' },
  },
} })

return { scaffold, lanes: lanes.map((l) => l && { lane: l.lane, files: l.filesChanged?.length }), coordinate: coord, verify }
