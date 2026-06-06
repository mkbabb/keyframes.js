export const meta = {
  name: 'tranche-d-demo-review',
  description: 'Adversarial read-only review of the W1+W2+W3 demo refactor (behavior-preservation · completeness · isomorphism)',
  phases: [
    { title: 'Review', detail: '5 parallel read-only reviewers audit the committed demo diff' },
  ],
}

const REPO = '/Users/mkbabb/Programming/keyframes.js'
const RANGE = 'a0303fe 905a8c3' // W4-base → W1+W2+W3 commit
const COMMON = `You are an ADVERSARIAL reviewer. The W1+W2+W3 demo refactor was authored by parallel agents and is committed (range \`${RANGE}\`). Your job: find where it DRIFTED from behavior-preservation, left a decomposition incomplete, or broke an isomorphism — NOT to praise it.
READ-ONLY: do NOT edit, write, or revert any file. Inspect with \`cd ${REPO} && git diff ${RANGE} -- <path>\`, \`git show 905a8c3:<path>\`, Read, and grep. Run read-only checks (tsc is already green; you may re-run \`npx tsc --noEmit\` to confirm, but change nothing).
Authoritative specs: ${REPO}/docs/tranches/D/waves/D.W1.md, D.W2.md, D.W3.md + audit/{frontend,styling,brittleness}-findings.md.
For EACH issue: severity (high = behavior/correctness regression or broken gate; med = isomorphism/completeness gap; low = polish), the file:line, what the OLD code did vs the NEW, the EVIDENCE (diff excerpt), and a concrete suggested fix. Default to skepticism: if you cannot prove a change is behavior-identical, flag it med. Report a clean verdict ONLY if you genuinely found nothing.`

const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['scope', 'issues', 'cleanVerdict'],
  properties: {
    scope: { type: 'string' },
    issues: { type: 'array', items: {
      type: 'object', additionalProperties: false,
      required: ['severity', 'file', 'description', 'evidence'],
      properties: {
        severity: { type: 'string', enum: ['high', 'med', 'low'] },
        file: { type: 'string' },
        line: { type: 'string' },
        description: { type: 'string' },
        evidence: { type: 'string' },
        suggestedFix: { type: 'string' },
      },
    } },
    cleanVerdict: { type: 'boolean' },
    notes: { type: 'string' },
  },
}

phase('Review')
const AC = 'demo/@/components/custom/animation-controls'
const reviews = await parallel([
  () => agent(`${COMMON}
SCOPE — LANE A (controls decomposition + reactivity). Audit:
- ${AC}/AnimationControlsGroup.vue (552→335) + new components/ControlsPaneWrapper.vue, components/RibbonBar.vue, composables/useControlsLayout.ts: is EVERY prop/emit/slot the old monolith exposed still wired through the new children? Did any reactive binding (controls-open state, sizing, the AnimationGroup scrub-pause-resume) get dropped or change timing? Is the rainbow SVG <defs> still present where the Format brush strokes it (var(--rainbow-*))?
- ${AC}/controls/composables/useAnimationSync.ts: the rAF-bridge gating (D.W3.S4). VERIFY it does NOT re-introduce the chicken-and-egg deadlock its own docstring warns about (gating on isStarted deadlocks). Does the happy path (animating) stay byte-identical? Does it actually idle when static, and resume on play? Could the new gate ever leave isStarted stuck false?
- ${AC}/controls/AnimationControlsControls.vue + new controls/composables/usePlaybackToggle.ts: the play/pause/reverse state machine extraction — is the solo-vs-grouped pausedTime bookkeeping (prevT, userReversed) preserved EXACTLY? Does toggle() behave as before?`,
    { label: 'review:controls', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}
SCOPE — LANE B (keyframes + parse dedup + brittleness). Audit:
- ${AC}/keyframes/KeyframesEditor.vue (487→263) + new keyframes/components/* (KeyframeCardList, KeyframesAddDialog) + the highlight consolidation onto useHighlightCSS.ts: is the frame-card list behavior + highlight.js driving preserved? Wired props/emits?
- ${AC}/keyframes/composables/useKeyframesEditor.ts (383→56) split into useKeyframesParsing/State/Ops: did the split preserve the reactive graph? Is the array-watch flush fix (D.W3.S4 — deterministic flush so a stale frame array can't paint) actually correct, or could it now MISS an update or double-fire?
- The parse adapter dedup: ${AC}/keyframes/utils/parseAnimationCSS.ts is the ONE definition; the two inline copies (KeyframesStringControls.vue, useKeyframesEditor.ts) are deleted and import it. CRITICAL: the StringControls call site historically LACKED the anonymous-@keyframes wrap guard — confirm the superset adoption is correct and does not change StringControls' behavior for a FULL-stylesheet input (the common case). Both call sites import the canonical name?
- The brittleness: KeyframesEditor's global document.querySelectorAll("pre") → scoped ref (does it still highlight the editor's own <pre>s, and NOT silently stop highlighting?); the [data-sonner-toaster] guards at BOTH sites (CSSPasteDialog.vue, KeyframesEditor.vue) → isInsideToaster() — same guard behavior?`,
    { label: 'review:keyframes', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}
SCOPE — LANE C (timeline). Audit:
- ${AC}/timeline/KeyframeTimeline.vue (441→254) + new timeline/components/* (TimelineTrack, TimelineHoverPreview): preserved diamond-drag, hover-canvas preview, inline edit, import/export? Wired?
- ${AC}/timeline/composables/useTimeline.ts (251→74) split (ops vs build): reactive graph preserved? the scrub/CRUD/rebuild paths intact?
- The 3 pure utils MOVED composables/→utils/ (timelineEngine.ts, snapshotCapture.ts, flattenVars.ts): confirm ALL importers updated (grep for old composables/ paths = 0), INCLUDING timelineEngine's own relative import of flattenVars, and that the moved files are byte-identical to their old bodies (a move, not a rewrite — \`git diff ${RANGE} -- <old> <new>\`).
- The rAF one-shot (useTimeline.ts:206 await-one-paint) → nextFrame/useRafFn: still awaits exactly one paint before the snapshot? No behavior change?`,
    { label: 'review:timeline', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}
SCOPE — W2 STYLING ISOMORPHISM (the highest isomorphism risk). Audit pixel-equivalence:
- demo/@/styles/design-idioms.css: do the --rainbow-{red..violet}+cyan VALUES match glass-ui's tokens.css (so the gradients are pixel-identical)? Is .scale-on-hover's --scale-hover (1.08) the SAME as glass-ui's @utility scale-on-hover (else hover-lift magnitude changed)? Does @keyframes enter use the SAME opacity/translate as tw-animate-css's (else the tab slide changed)? Is --color-gold's dark-mode lift a DECLARED befitting delta (not an accidental light-mode change)?
- The leaf-tail migration (text-sm/xs/base → semantic ladder across the demo): for EACH migrated site, is the new register the SAME visual SIZE, or did text-sm→text-mono-caption SHRINK it (text-sm=0.875rem vs caption=0.75rem)? Flag any unintended size change as med-isomorphism. Confirm vendored demo/@/components/ui/ was NOT touched.
- utils.css DELETION: every one of its 6 component-rule families (.tab-trigger-*, .btn-playback*, .demo-*, .ppmycota-*, [data-state=active][role=tabpanel]) RELOCATED (to scoped partials tab-trigger.css/playback-button.css/brand.css or style.css) with IDENTICAL selectors/specificity — none lost, none with changed specificity. The .demo-* shared-scope decision sound?
- The !-overrides → scoped CSS (EasingSelect, AnimationControlsGroup): does the scoped rule produce the SAME cascade outcome the !important did?`,
    { label: 'review:styling-isomorphism', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}
SCOPE — LANE D (easing/scenes/shell) + GATE SOUNDNESS (audit only — do NOT plant). Audit:
- demo/easing/EasingTarget.vue: the .closest(".easing-target") + .querySelector(".track-container") → useTemplateRef owned refs. CRITICAL: do the refs resolve to the SAME elements the string selectors did, so the vars are read off the right element? Any case where the ref is null when the old closest() found a parent?
- demo/@/components/editor-shell/EditorShell.vue: the dvh @supports guard — is the fallback (vh/%) correct, and the feature-present path byte-identical?
- z-index (CubeTarget.vue z-index:-10→--z-behind; the raw z-10/z-20/z-0 rungs): every reconciliation preserves the SAME stacking order?
- The @supports guards (env/dvh/-webkit-mask-image) across the demo: each wraps a FALLBACK, leaving the modern-browser path unchanged?
- GATE SOUNDNESS (read the scripts, reason — do NOT plant a regression): for scripts/proof-decomposition.mjs, proof-idioms.mjs, proof-brittleness.mjs — does each clause contain a REAL assertion that would exit 1 on its regression (a re-added 400L file, a re-inlined parse copy, a raw text-sm rung, a global document.querySelector, a removed @supports)? Or is any clause tautological / born-green (e.g. greps a path that can't exist, asserts something always true)? Flag any born-green clause HIGH.`,
    { label: 'review:laneD-gates', phase: 'Review', agentType: 'general-purpose', schema: SCHEMA }),
])

const all = reviews.filter(Boolean)
const issues = all.flatMap((r) => (r.issues || []).map((i) => ({ ...i, scope: r.scope })))
return {
  reviewers: all.length,
  clean: all.filter((r) => r.cleanVerdict).map((r) => r.scope),
  high: issues.filter((i) => i.severity === 'high'),
  med: issues.filter((i) => i.severity === 'med'),
  low: issues.filter((i) => i.severity === 'low'),
}
