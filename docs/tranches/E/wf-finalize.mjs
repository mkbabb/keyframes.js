export const meta = {
  name: 'tranche-e-finalize',
  description: 'Finalize the Tranche E development docs — fold the SOTA augmentation (E.W7-W11 + inv ν/ξ/ο) into E.md, extract the new wave specs, promote the value.js hand-off, harden the baseline. DOCS ONLY.',
  phases: [
    { title: 'Fold', detail: 'extract E.W7-W11 wave specs · augment E.md/PROGRESS (waves + inv ν/ξ/ο + DAG) · promote the value.js hand-off · harden the baseline E.W0-W6' },
    { title: 'Verify', detail: 'whole-tranche consistency: every wave gated, the augmentation coheres with the baseline, the cites hold, the ledger/recap correct' },
  ],
}

const E = '/Users/mkbabb/Programming/keyframes.js/docs/tranches/E'
const SOTA = `${E}/audit/sota`
const KF = '/Users/mkbabb/Programming/keyframes.js'

const COMMON = `Finalizing the keyframes.js Tranche E DEVELOPMENT docs — DOCS ONLY (no engine/demo/library source; this is the dev/impl boundary). Repo: ${KF}.
THE SOURCE OF TRUTH for the fold is the deep-SOTA synthesis under ${SOTA}/:
- ${SOTA}/_SYNTHESIS-E-augmentation.md — the keyframes FOLD-E findings distilled into E.W7-W11 + inv ν/ξ/ο (full per-wave scope + hard gates + isomorphism already written).
- ${SOTA}/_SYNTHESIS-valuejs-handoff.md — the value.js hand-off charter (FOLD-VALUEJS-HANDOFF items).
- ${SOTA}/_SYNTHESIS-scorecard.md — the per-axis SOTA map.
- the 24 lane findings (r-*/a-*/d-*.md) — the file:line evidence behind each.
STRUCTURAL TEMPLATE: ${KF}/docs/tranches/D/waves/D.W*.md + ${E}/waves/E.W1-W6.md (same voice, §state/§goal/§scope/§hard-gate/§folds/§design-decisions, every gate a FALSIFIABLE re-runnable proof:* instrument with a stated BITE — inv ε).
PRECEPTS: NO legacy/workarounds; idiomatic+gestalt; architectural transpositions for elegance/simplicity/PERFORMANCE; isomorphic (pixels/behaviour stable unless a befitting delta is NAMED); KISS — fold ONLY genuinely-warranted SOTA work, record what is ALREADY-SOTA, keep the DECLINE/KILL records (WASM parser; native-ScrollTimeline-replace). Every perf fold is MEASURE-FIRST; every platform adoption is FEATURE-DETECTED with the JS path as fallback. inv-16: keyframes findings → E; value.js findings → the HAND-OFF (never write value.js).
Ground each wave's cites against live source (grep the file:line). Report what you wrote.`

const SCHEMA = { type: 'object', additionalProperties: false, required: ['files', 'summary'], properties: { files: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' }, notes: { type: 'string' } } }

const wave = (id, title, focus) => () => agent(`${COMMON}

AUTHOR the wave spec ${E}/waves/${id}.md — ${title}. Extract + formalize its section from ${SOTA}/_SYNTHESIS-E-augmentation.md (the "§ ${id} — …" section has the full scope, provenance, hard gate, isomorphism). ${focus} Render it as a proper wave spec in the D/E style: §Provenance, §State (verified — re-ground the cited file:line against live ${KF}/src or demo), §Goal, §Scope (the sub-moves with WHAT/WHY/file:line), §Hard gate (the named falsifiable proof:* with its BITE + measure-first/feature-detect clause), §Folds, §Isomorphism, §Design decisions. Keep the ALREADY-SOTA + DECLINE records where the section names them. inv-16: write ONLY ${E}/waves/${id}.md.`,
  { label: id, phase: 'Fold', agentType: 'general-purpose', schema: SCHEMA })

// ── Phase 1 — Fold (parallel, file-disjoint) ─────────────────────────────────
phase('Fold')
const fold = await parallel([
  wave('E.W7', 'Engine compile + runtime correctness and hot-path (measure-first)', 'The correctness BUGS (setColorSpace/setHueMethod compile-stale no-ops · createFrame index-space conflation · the WAAPI computed-unit guard that rejects nothing) come FIRST (test-locked, befitting breaks); then the hot-path strand (standalone interpFrames not zero-alloc · the delete-loop dictionary-mode deopt · unconditional DOM write · promise/microtask churn · preset lazy-memo), each behind a SHAPED bench (add the threaded-out-buffer bench variant). inv ν.'),
  wave('E.W8', 'The FrameCompiler transposition (NumericAnimation SoA + incremental)', 'Port NumericAnimation\\u2019s SoA time-index + incremental updateSegments + deterministic content-derived frameId up to FrameCompiler — the demo editor double-compiles per keystroke (the load-bearing workload). Depends on E.W7. Sub-moves each isomorphic + byte-equality-gated; sub-move 3 (incremental) measure-first on the editor workload. inv ν extended (proof:compile-deterministic + proof:compile-incremental).'),
  wave('E.W9', 'Modern-platform adoption (library, baseline-safe + feature-detected)', 'Register the parsed @property registry (CSS.registerProperty, Baseline 2024-07) · live reduced-motion observation (one shared MediaQueryList change listener) · dense WAAPI sub-segment sampling · native CSS Color L4 WAAPI color interp (un-reject color where it maps to an L4 keyword) · the additive native ScrollTimeline/ViewTimeline WAAPI bridge (the JS sampler STAYS — the ARCH-kill of REPLACING it holds; additive only; no scroll-timeline-polyfill). Each feature-detected, JS-path fallback. inv ξ (proof:platform-adopt). Needs value.js hand-off enablers (note them).'),
  wave('E.W10', 'The orchestration tier (stagger · sequence · FLIP · drag/inertia)', 'Net-new light-side, value.js-free helpers leveraging the already-SOTA physics: stagger(n|items,{each,from,ease}) · a sequence/timeline orchestrator (BOOK the API + the Timeline name-collision resolution FIRST) · flip()/flipShared() over ElementMorph · drag/useDrag + decay feeding SpringProgress\\u2019s velocity core · spring-eased presets · the animate() single-call front door. Purely additive (no pixel/behaviour/boundary moves). proof:orchestration + proof:boundary re-check.'),
  wave('E.W11', 'Demo elevation (View Transitions · a11y uniformity · idiom r3 · first-paint)', 'Consume d-demo-elevate.md verbatim: Theme 0 delete dead CommandPalette · Theme 1 View Transitions for scene nav via glass-ui\\u2019s shipped useViewTransition (SpringProgress fade = no-VT fallback, still dogfoods; Baseline 2025-10) · Theme 2 apply the demo\\u2019s own gold-standard a11y (role=slider, :focus-visible contract, aria-live) uniformly · Theme 3 finish the idiom-ownership (kill the --spring-snappy shadow, promote progress-rail, fix dead .dock-inset) · Theme 4 harden first paint (PRM-guard the hero, calibrated font fallback for CLS). Demo-only. inv ο (proof:demo-elevate).'),

  // E.md + PROGRESS augmentation
  () => agent(`${COMMON}

AUGMENT the charter ${E}/E.md and the board ${E}/PROGRESS.md to incorporate the SOTA augmentation (do NOT rewrite the baseline — EXTEND it):
- E.md §Wave table: ADD rows E.W7–E.W11 (titles from ${SOTA}/_SYNTHESIS-E-augmentation.md §"How this maps") + note the release escalates to **minor** (W10\\u2019s stagger/sequence/animate() are additive new public API).
- E.md §E-specific invariants: ADD inv ν / inv ξ / inv ο (continuing the Greek series from μ) — copy their definitions + gates from the augmentation\\u2019s §"New E-invariants". Keep κ/λ/μ.
- E.md §DAG: ADD the second band (E.W7→W8 engine · W9 · W10 · W11 demo · then W4 lighthouses the FINAL surface · W6 absorbs the new gates) per the augmentation\\u2019s ASCII DAG.
- E.md: ADD a §SOTA-augmentation section near the top stating the HONEST provenance (E.W0–W6 = the Baseline-checklist assay; E.W7–W11 = the deep-SOTA assay vs the libraries + the V8 cost model + the spec frontier; the augmentation is NET-NEW findings, not folded debt; the engine\\u2019s KERNEL is ALREADY-SOTA — the large §ALREADY-SOTA record stands; WASM + native-ScrollTimeline-replace are DECLINED/KILLed) — point to ${SOTA}/_SYNTHESIS-E-augmentation.md + _SYNTHESIS-scorecard.md as the evidence, and to ${E}/valuejs-sota-handoff.md for the value.js arm.
- PROGRESS.md: add E.W7–E.W11 to the wave-status table (Phase IMPL, status "authored — awaits auth", each with its falsifiable hard gate); note the value.js hand-off as a cross-repo deliverable.
inv-16: write ONLY ${E}/E.md + ${E}/PROGRESS.md.`, { label: 'augment:charter', phase: 'Fold', agentType: 'general-purpose', schema: SCHEMA }),

  // value.js hand-off promotion
  () => agent(`${COMMON}

PROMOTE the value.js hand-off into a clean top-level deliverable ${E}/valuejs-sota-handoff.md. Take ${SOTA}/_SYNTHESIS-valuejs-handoff.md (the charter) + the E-HANDOFF index in _SYNTHESIS-E-augmentation.md and produce ONE coherent value.js tranche-augmentation charter the value.js owner can formalize: the headline (value.js is at/ahead-of-SOTA on color science + spec breadth; the gaps are parse-architecture [any()→dispatch(), spans, the 90%-built Rust/WASM parser], the color hot-path serializer + output-space targeting, the computed-unit endpoint cache [the real D-3 win lives HERE], bounded memo caches, the linear() parser, ~24 no-op length units, the @property syntax round-trip, the AnimationOptions→CSSAnimationOptions rename seam), each as a proposed value.js wave with a falsifiable gate + perf rationale + isomorphism note + the cross-repo edge to keyframes. State inv-16 (hand-off, not a write; value.js dirty+active, tranche M open). inv-16: write ONLY ${E}/valuejs-sota-handoff.md.`, { label: 'promote:valuejs-handoff', phase: 'Fold', agentType: 'general-purpose', schema: SCHEMA }),

  // baseline harden (the stalled workflow's leftover)
  () => agent(`${COMMON}

HARDEN the BASELINE E tranche docs (the prior E dev workflow authored them but its harden phase stalled). Review + fix ${E}/waves/E.W0.md, E.W1.md..E.W6.md and ${E}/audit/{encapsulation,brittleness,styling,lighthouse,modern-web,deferred-ledger,prompt-recap}-findings.md (NOT E.md/PROGRESS — another agent owns those; NOT the audit/sota/ files — those are the SOTA lanes). Check + fix: every E.W1-W6 wave has a FALSIFIABLE hard gate (proof:* with a BITE); the cited file:line claims hold against live source (re-ground the component sizes, the ~10 listener sites, the .gold-shimmer rent, the arbitrary values); no narration-gate; isomorphism named; the deferred-ledger zero-KFE claim correct; the prompt-recap no-drops; W5/W6 correctly marked D-pending-on-glass-ui-3.3.0 (NOT E). Apply fixes directly. Report defects fixed. inv-16: write only under ${E}/waves/E.W0-W6.md + ${E}/audit/*-findings.md (not sota/, not E.md/PROGRESS).`, { label: 'harden:baseline', phase: 'Fold', agentType: 'general-purpose', schema: SCHEMA }),
])
log(`Fold: ${fold.filter(Boolean).length}/8 done`)

// ── Phase 2 — Verify ─────────────────────────────────────────────────────────
phase('Verify')
const verify = await agent(`${COMMON}

VERIFY the WHOLE Tranche E tranche (baseline E.W0-W6 + the augmentation E.W7-W11 + E.md + PROGRESS + valuejs-sota-handoff.md). Read them all. Check, with file:line:
1. E.md's wave table + DAG + invariants (κ/λ/μ/ν/ξ/ο) match the actual wave files (E.W1-W11 each exist + carry the gate E.md names).
2. Every wave (W0-W11) has a FALSIFIABLE hard gate; the perf waves (W7/W8) are measure-first; the platform wave (W9) is feature-detected with the ARCH-kill (native-ScrollTimeline-replace) preserved as additive-bridge-only; W10 is purely additive.
3. The ALREADY-SOTA record + the DECLINE/KILL records are present + honest (no manufactured work; WASM declined; ScrollTimeline kill held).
4. The provenance is honest (E.W0-W6 = Baseline assay; E.W7-W11 = deep-SOTA assay; net-new not folded-debt; D's ledger clean).
5. The value.js hand-off is inv-16-correct (hand-off, not a directive) + coheres with the E.W9 enabler dependencies.
6. No drops in the recap; the release tier (minor) is correct.
Return a structured list of any remaining defect (file + fix). If a defect is found, FIX it directly in the named file (within ${E}/, not sota/). Report the final state.`, { label: 'verify:tranche', phase: 'Verify', agentType: 'general-purpose', schema: { type: 'object', additionalProperties: false, required: ['verdict', 'defectsFixed'], properties: { verdict: { type: 'string' }, defectsFixed: { type: 'array', items: { type: 'string' } }, residual: { type: 'array', items: { type: 'string' } } } } })

return { fold, verify }
