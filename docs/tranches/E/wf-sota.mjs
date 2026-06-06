export const meta = {
  name: 'tranche-e-sota',
  description: 'Deep 32-agent SOTA audit — value.js + keyframes.js parsing/runtime/compile-time + demo, vs modern-web-guidance + animation SOTA. DOCS ONLY (augments E + begets a value.js hand-off).',
  phases: [
    { title: 'Research', detail: 'SOTA platform + libs: WAAPI · scroll/view-transitions · CSS Color/Values L4+ · springs/motion · CWV · anim-libs · css-parsers · WASM/compile-perf · modern-web-guidance digest' },
    { title: 'Audit', detail: 'extant library: kf runtime/FrameCompiler/WAAPI/computed-units · vj parser/color/units/quantize · demo UX/design · API/DX · tranche-set retro' },
    { title: 'Deepen', detail: 'adversarial deep-dive on the perf core (FrameCompiler · runtime hot-path · vj parser · color-interp · compile-time)' },
    { title: 'Synthesize', detail: 'the E augmentation proposal + the value.js SOTA hand-off spec (both new docs — applied after the E dev workflow settles)' },
  ],
}

const KF = '/Users/mkbabb/Programming/keyframes.js'
const VJ = '/Users/mkbabb/Programming/value.js'
const SOTA = `${KF}/docs/tranches/E/audit/sota`

const COMMON = `DEEP SOTA AUDIT for the keyframes.js + value.js animation/CSS stack — this is TRANCHE DEVELOPMENT (research + findings DOCS ONLY; NO implementation). Goal: are we FULLY modern, SOTA, up-to-spec — and where are the gaps / modern features to leverage / parse·runtime·compile-time perf wins / demo improvements.
REPOS (read-only): keyframes.js at ${KF} (the engine src/animation/ + the Vue demo demo/); value.js at ${VJ} (the CSS parser src/parsing, color/units/normalize, easing, math, quantize, transform — keyframes consumes its published surface). Both are post-deep-tranche (kf A→E, vj A→M).
TOOLS — USE ALL:
- The modern-web-guidance SKILL: \`npx -y modern-web-guidance@latest search "<query>"\` then \`retrieve "<id>,..."\` — the authoritative, BASELINE-DATED platform guidance. Cite the guide id + baseline status.
- WebSearch / WebFetch for animation + CSS-parsing SOTA (the W3C specs — CSS Color L4/L5, Values L4, Easing L2, Scroll-Driven Animations, View Transitions, @property, container/anchor; and SOTA libs — Motion/Framer, GSAP, anime.js, lightningcss, csstree, @csstools, Servo/Stylo).
- Read the LIVE code (file:line) to ground every claim.
PRECEPTS: NO legacy/workarounds; idiomatic + gestalt; architectural transpositions for elegance/simplicity/PERFORMANCE; isomorphic (behaviour/pixels stable unless highly befitting); KISS. inv-16: keyframes.js findings → FOLD-E; value.js findings → a HAND-OFF (value.js is dirty+active, do NOT propose writing it directly — propose a value.js tranche the value.js owner formalizes).
Return a STRUCTURED findings doc and WRITE it to the path named in your lane. Every finding: title · file:line or spec/guide cite · the SOTA gap or opportunity · perf/elegance rationale · disposition (FOLD-E / FOLD-VALUEJS-HANDOFF / BOOK / GAP-NAMED / ALREADY-SOTA) · isomorphism note. Be exhaustive but honest — flag where we are ALREADY SOTA (don't manufacture work).`

const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['file', 'headline', 'topFindings'],
  properties: {
    file: { type: 'string', description: 'the doc you wrote' },
    headline: { type: 'string', description: 'one-line verdict: SOTA-aligned / gaps-found / major-opportunity' },
    topFindings: { type: 'array', items: { type: 'string' }, description: 'the 3-6 highest-value findings, each terse with disposition' },
    forValueJs: { type: 'array', items: { type: 'string' }, description: 'findings tagged FOLD-VALUEJS-HANDOFF (for the value.js tranche)' },
  },
}

const lane = (id, title, focus, phaseName) => () => agent(`${COMMON}

LANE — ${title}. ${focus}
WRITE your findings to ${SOTA}/${id}.md (create it; markdown, file:line + spec/guide cites, dispositions). inv-16: write ONLY that file.`,
  { label: id, phase: phaseName, agentType: 'general-purpose', schema: SCHEMA })

// ── Phase 1 — Research (SOTA platform + libraries) ───────────────────────────
phase('Research')
const research = await parallel([
  lane('r-waapi', 'Web Animations API / WAAPI SOTA', 'The current WAAPI surface (KeyframeEffect, Animation.timeline, composite modes, ScrollTimeline binding, Animation.commitStyles, Animation.persist, replaceState). Where could keyframes.js delegate MORE to the compositor? Audit waapi.ts eligibility vs the modern WAAPI capabilities. What WAAPI features are now Baseline that the engine does not yet use?', 'Research'),
  lane('r-scroll-view-transitions', 'Scroll-Driven Animations + View Transitions SOTA', 'CSS scroll-driven animations (scroll()/view() timelines, animation-timeline, @property-driven), the View Transitions API (same-document + cross-document, view-transition-name, the JS startViewTransition). Baseline status. Where keyframes.js Timeline/ScrollTimeline + the demo scene-swap could adopt native timelines/VT (and where JS control is genuinely superior — the engine ARCH-killed native ScrollTimeline; re-examine with current baseline).', 'Research'),
  lane('r-css-color', 'CSS Color L4/L5 SOTA', 'oklch/oklab/color() spaces, color-mix(), relative color syntax (rgb(from …)), color-contrast(), wide-gamut (display-p3), currentColor/system colors. value.js does perceptual oklab interpolation — is its color parsing + interpolation up to Color L4/L5? Gaps in keyframes color interp (waapi rejects color → rAF; could CSS color-mix offload?).', 'Research'),
  lane('r-css-values', 'CSS Values L4 + Easing L2 + @property + container/anchor SOTA', 'CSS Values L4 (calc() incl. round/mod/rem/sin/cos, calc-size(), attr() typed), Easing Functions L2 (linear() with stops — keyframes uses it for springs! — and the spec status), @property (registered custom props), container queries (cqw — the engine resolves them), anchor positioning. value.js parser coverage vs these specs; keyframes calc()/computed-unit handling.', 'Research'),
  lane('r-interpolation', 'Animation interpolation / springs / motion SOTA', 'SOTA interpolation: physical springs (the iOS/SwiftUI model — keyframes SpringProgress uses closed-form), motion-path/offset-path, discrete vs smooth interpolation, the CSS interpolate-size + @starting-style, easing composition. Is keyframes’ spring/smooth/numeric SOTA? Motion-path support gap?', 'Research'),
  lane('r-cwv-perf', 'CWV / INP / LCP / Long-Tasks / content-visibility SOTA', 'Use the modern-web-guidance skill heavily: INP & break-up-long-tasks (scheduler.yield/postTask), LCP (fetchpriority, preload), content-visibility:auto + the SPA-view-caching pattern, bf-cache, CLS. Map to the demo (the heavy editing UI, the 5 scenes, the fonts, the lazy chunks). The engine’s scheduler.yield is already SOTA — confirm + find the DEMO gaps.', 'Research'),
  lane('r-anim-libs', 'SOTA animation libraries — feature-gap analysis', 'Motion (motion.dev / Framer Motion), GSAP, anime.js v4, AnimeJS, Theatre.js, Popmotion. Their feature sets (timelines, stagger, scroll, springs, WAAPI hybrid, FLIP, layout animations, gesture). Where does keyframes.js LEAD, MATCH, or GAP? What modern primitives (FLIP/layout, stagger, sequence) might keyframes leverage? Honest competitive map.', 'Research'),
  lane('r-css-parsers', 'SOTA CSS parsers — value.js gap analysis', 'lightningcss (Rust), csstree, @csstools/css-parser-algorithms, PostCSS, Servo/Stylo. Their architecture (tokenizer→parser, error recovery, spec-completeness, perf, WASM). value.js uses parse-that combinators — how does its CSS value parser compare on spec-coverage + PARSE PERFORMANCE? Where is value.js SOTA vs gapped? WASM/codegen opportunities for parse-time perf.', 'Research'),
  lane('r-wasm-compile-perf', 'WASM / compile-time / build-time perf SOTA', 'SOTA for parser + compiler performance: WASM (lightningcss model), memoization/caching, lazy/incremental compilation, zero-copy tokenizing, monomorphic hot paths, JIT-friendly shapes. Applicable to value.js parse-time AND keyframes FrameCompiler compile-time? Realistic wins vs over-engineering (KISS).', 'Research'),
  lane('r-modern-web-digest', 'modern-web-guidance comprehensive digest', 'Run the modern-web-guidance skill: `npx -y modern-web-guidance@latest list` then search+retrieve EVERY guide relevant to an animation/CSS/perf demo (dialogs/popovers, scroll/motion, CWV, container queries, anchor, :has, view-transitions, preload/fetchpriority, content-visibility, forms/inputs, custom scrollbars). Produce the authoritative checklist with baseline dates + the keyframes-demo applicability of each.', 'Research'),
])
log(`Research: ${research.filter(Boolean).length}/10 lanes done`)

// ── Phase 2 — Audit (the extant library) ─────────────────────────────────────
phase('Audit')
const audit = await parallel([
  lane('a-kf-runtime', 'keyframes.js runtime hot-path perf', 'src/animation/engine.ts interpFrames (binary-search + processFrame + Object.assign), utils.ts lerpValue dispatch + transformTargetsStyle, group.ts compositor. Steady-state allocations (D made the group zero-alloc — others?), monomorphism, the per-frame DOM write. Realistic runtime wins. Re-examine D-3 (computed-unit DOM round-trip, withheld) with fresh eyes.', 'Audit'),
  lane('a-kf-framecompiler', 'keyframes.js FrameCompiler — compile-time', 'src/animation/frame-compiler.ts (the D.W4 split): addFrame→parse→reconcileVars→createFrame→interpVars/allInterpVars pre-flatten. Compile-time perf: the O(frames²)-ish reconciliation, buildVarIndex, the sort/filter passes, parseAndFlattenObject + the tryParseCache. Could compilation be incremental/lazy/memoized? Is the data layout (AnimationFrame) SOTA for the hot path? The user specifically asks about the FrameCompiler — be thorough.', 'Audit'),
  lane('a-kf-waapi', 'keyframes.js WAAPI delegation completeness', 'src/animation/waapi.ts eligibility (DOM targets, default renderer, uniform timing, no css-twin-across-segments, no computed units, no color). Cross-reference r-waapi: which rejections are now liftable (e.g. color via color-mix, computed units, composite modes)? How much more could ride the compositor thread?', 'Audit'),
  lane('a-kf-computed', 'keyframes.js computed-unit DOM round-trip (the value.js boundary)', 'The vh/calc/cqw/var resolution path: utils.ts → value.js getComputedValue/normalize (DOM write+read+restore). D-3 measured the keyframes-local changed-keys write ~0 (real cost in value.js re-serialization). Re-audit ACROSS the boundary: is the value.js side (normalize.ts memo key = toString+elementId) the real win? A FOLD-VALUEJS-HANDOFF candidate. Quantify.', 'Audit'),
  lane('a-vj-parser', 'value.js parser — parse-that + CSS grammar', `${VJ}/src/parsing: the parse-that combinator parser, CSS value/keyframes grammar, error handling. Spec-coverage (Values L4, Color L4, Easing L2) + PARSE-TIME perf (combinator overhead, backtracking, memoization, the tryParse cache). How does it compare to lightningcss/csstree? FOLD-VALUEJS-HANDOFF dispositions.`, 'Audit'),
  lane('a-vj-color-units', 'value.js color / units / normalize', `${VJ}/src/units (color spaces, normalize, convertToPixels, the computed-value DOM resolution) + the interpolation primitives keyframes consumes (lerpValue/lerpColorValue/lerpComputedValue/normalizeValueUnits/prepareInterpVar). SOTA color science (oklab/oklch/color-mix), perf of the per-frame interp, the getComputedValue memo. FOLD-VALUEJS-HANDOFF.`, 'Audit'),
  lane('a-vj-other', 'value.js quantize / transform / math / easing', `${VJ}/src/{quantize,transform,math,easing}.ts + utils.ts — the remaining surfaces keyframes touches (matrix3d transform, easing registry/cubic-bezier/steppedEase, math leaves). SOTA + perf + any spec gaps. FOLD-VALUEJS-HANDOFF.`, 'Audit'),
  lane('a-demo-ux', 'demo — usability / UX', `${KF}/demo: the editor shell, the controls/keyframes/timeline editors, the 5 scenes (cube/square/easing/spring/amiga), the playground. Usability gaps, interaction friction, discoverability, mobile/touch, a11y, the editing flow. Concrete UX improvements (isomorphic-where-possible, befitting where not). Disposition FOLD-E.`, 'Audit'),
  lane('a-demo-design', 'demo — design cogency / elegance', `${KF}/demo: design coherence within the aesthetic (Instrument-Serif/Fraunces + Fira + glass-ui), visual hierarchy, the design-idioms layer (D.W2/3), motion design, the rainbow/gold idioms, dark mode, spacing/type rhythm. Where is the design INCOHERENT or unrefined? Elegant, cohesive improvements. FOLD-E.`, 'Audit'),
  lane('a-kf-api-dx', 'keyframes.js public API / DX vs SOTA', `${KF}/src/animation/index.ts the published surface (Animation, CSSKeyframesAnimation, AnimationGroup, NumericAnimation, SmoothProgress, SpringProgress, ElementMorph, Timeline, the light/heavy boundary). DX vs Motion/GSAP (ergonomics, types, tree-shaking, the dynamic boundary). Gaps (stagger? sequence? FLIP/layout? gesture? presets). FOLD-E or GAP-NAMED.`, 'Audit'),
  lane('a-tranche-retro', 'tranche-set retrospective — A→E (kf) + A→M (vj)', `Read ${KF}/docs/tranches/*/FINAL.md + ${VJ}/docs/tranches/*/FINAL.md (skim). What did the tranche sets ACHIEVE vs what SOTA gaps REMAIN across both? Is anything chronically unaddressed? Cross-repo coherence (the boundary, the shared idioms). A short retrospective + the gaps each repo still carries. Disposition map.`, 'Audit'),
])
log(`Audit: ${audit.filter(Boolean).length}/11 lanes done`)

// ── Phase 3 — Deepen (adversarial deep-dive on the perf core) ────────────────
phase('Deepen')
const DEEPEN = [
  ['d-framecompiler', 'FrameCompiler compile-time — DEEP', 'Go DEEPER than a-kf-framecompiler: profile the compile pipeline mentally, propose a concrete SOTA compile architecture (incremental? memoized var-index? a flatter AnimationFrame? typed-array interp buffers?) with the perf rationale + the isomorphism guarantee. Name the transposition.'],
  ['d-runtime', 'Runtime hot-path — DEEP', 'Go DEEPER than a-kf-runtime: the per-frame cost model (binary search, processFrame, lerp dispatch, DOM write), realistic micro-opts (typed arrays, avoiding Object.assign, monomorphic shapes, batching writes), and which are real wins vs noise. Name the measure-first gates.'],
  ['d-vj-parse', 'value.js parse-time — DEEP', 'Go DEEPER than a-vj-parser: a concrete SOTA parse architecture for value.js (zero-copy tokenizer? memoized grammar? a codegen/WASM path? a fast-path for common values?) with perf + spec-coverage + the FOLD-VALUEJS-HANDOFF shape.'],
  ['d-color-interp', 'Color interpolation perf + science — DEEP', 'Go DEEPER than a-vj-color-units: the per-frame oklab interp cost, the getComputedValue memo, color-mix offload, wide-gamut. The SOTA color-interp path + its FOLD-VALUEJS-HANDOFF shape.'],
  ['d-modern-platform', 'Modern-platform adoption — DEEP', 'Synthesize r-waapi + r-scroll-view-transitions + r-cwv-perf + r-modern-web-digest into the concrete platform features the LIBRARY (engine) and the DEMO should adopt NOW (baseline-safe) — each with a baseline date, an @supports/feature-detect fallback, and a FOLD-E disposition. Distinguish library vs demo.'],
  ['d-demo-elevate', 'Demo elevation — DEEP', 'Synthesize a-demo-ux + a-demo-design into a concrete, cohesive demo-elevation proposal (usability + elegance + design cogency) — the highest-leverage isomorphic-or-befitting changes, organized as a coherent design direction, not a scatter of tweaks.'],
]
const deepen = await parallel(DEEPEN.map(([id, title, focus]) => lane(id, title, focus, 'Deepen')))
log(`Deepen: ${deepen.filter(Boolean).length}/6 done`)

// ── Phase 4 — Synthesize (E augmentation + value.js hand-off) ─────────────────
phase('Synthesize')
const synth = await parallel([
  () => agent(`${COMMON}

SYNTHESIZE — THE KEYFRAMES TRANCHE-E AUGMENTATION. Read EVERY findings doc under ${SOTA}/ (the 10 research + 11 audit + 6 deepen lanes). Distill the keyframes.js FOLD-E findings into a coherent augmentation of Tranche E — NEW waves (E.W7+) and/or charter additions covering: the FrameCompiler compile-time transposition, the runtime hot-path wins, the WAAPI/modern-platform adoption (baseline-safe, the library + the demo), the demo UX + design-cogency elevation, and any API/DX gaps worth closing. Each proposed wave: title · scope · a FALSIFIABLE hard gate (proof:* / bench) · isomorphism note · measure-first where perf. Keep KISS — fold only genuinely-warranted SOTA work; explicitly list what is ALREADY-SOTA (no work). WRITE ${SOTA}/_SYNTHESIS-E-augmentation.md. inv-16: write only that file. (I apply it to E.md/PROGRESS/waves after the running E dev workflow settles — do NOT edit those.)`,
    { label: 'synth:e-augment', phase: 'Synthesize', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}

SYNTHESIZE — THE value.js SOTA HAND-OFF SPEC. Read every findings doc under ${SOTA}/ + tag the FOLD-VALUEJS-HANDOFF items (parser parse-time, color/units/normalize interp + the getComputedValue memo, the computed-value DOM round-trip, easing/quantize/transform, spec-coverage L4/L5). value.js is dirty + active (branch docs/constellation-grand-audit-2026-06-03, tranche M open) — so this is a HAND-OFF the value.js owner formalizes, NOT a direct write. Author a value.js tranche-augmentation CHARTER: the SOTA gaps + the proposed waves (parse-time perf, color-interp perf, the computed-unit boundary win that keyframes D-3 traced into value.js, spec-coverage), each with a falsifiable gate + perf rationale + isomorphism. Note the cross-repo edge: the keyframes computed-unit perf depends on the value.js normalize memo (the real D-3 win lives here). WRITE ${SOTA}/_SYNTHESIS-valuejs-handoff.md. inv-16: write only that file.`,
    { label: 'synth:valuejs-handoff', phase: 'Synthesize', agentType: 'general-purpose', schema: SCHEMA }),

  () => agent(`${COMMON}

SYNTHESIZE — THE GAP/SOTA SCORECARD. Read every findings doc under ${SOTA}/. Produce ONE scorecard: for each axis (WAAPI/compositor, scroll/view-transitions, CSS Color L4/5, CSS Values/Easing L4/2, springs/motion, CWV/INP/LCP, parse-time perf, runtime perf, compile-time/FrameCompiler, demo UX, demo design, API/DX) — rate keyframes.js + value.js as ALREADY-SOTA / MINOR-GAP / MAJOR-GAP / MODERN-FEATURE-OPPORTUNITY, with the single highest-leverage move per axis and its repo (kf-E / valuejs-handoff). The honest map: where we lead, where we lag, what to leverage. WRITE ${SOTA}/_SYNTHESIS-scorecard.md. inv-16: write only that file.`,
    { label: 'synth:scorecard', phase: 'Synthesize', agentType: 'general-purpose', schema: SCHEMA }),
])
log(`Synthesize: ${synth.filter(Boolean).length}/3 done`)

return { research, audit, deepen, synth }
