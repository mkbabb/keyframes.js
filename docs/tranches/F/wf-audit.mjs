export const meta = {
  name: 'tranche-f-audit',
  description: 'Tranche F — the 32-agent deep-SOTA audit (research + audit + value.js) → synthesis. DEV only, docs.',
  phases: [
    { title: 'Audit', detail: '27 parallel research/audit/perf/value.js lanes — each writes docs/tranches/F/audit/<id>.md' },
    { title: 'Synthesize', detail: '5 synthesis lanes — ledger · recap A→F · gap map · valuejs-handoff-v2 · the F charter draft' },
  ],
}

const MANDATE = [
  'You are ONE research/audit lane in the Tranche F deep-SOTA audit of keyframes.js (and',
  'its @mkbabb/value.js dependency), on git branch tranche-e-impl. This is TRANCHE',
  'DEVELOPMENT — research + audit ONLY. You write a SINGLE findings doc at',
  'docs/tranches/F/audit/<your-id>.md (the id is named in your brief). You make ZERO',
  'source-code changes — no engine/demo/library/parser/test edits, no implementation.',
  '',
  'THE MANDATE (binding): NO quick solutions / NO workarounds; idiomatic + gestalt;',
  'architectural transpositions for elegance · simplicity · performance are NECESSARY',
  'and DESIRABLE; NO legacy. inv-16: you may PROPOSE value.js changes (a hand-off — you',
  'NEVER write value.js source), but you write only keyframes.js docs. inv ε: verify, do',
  'not assert — cite file:line for every keyframes claim; ground every SOTA claim.',
  '',
  'GROUNDING (READ what is relevant FIRST — do NOT re-derive what is already found):',
  'Tranches D + E are IMPLEMENTED and CLOSED. Read as relevant:',
  '- docs/tranches/E/FINAL.md — the gate-backed E close (what landed + what was',
  '  measure-first WITHHELD: W7 Strand-B micro-perf, W8 SoA/incremental S1/S2/S3,',
  '  tryParseCache, lighthouse-off-CI; and the value.js needs-handoff W9 S4/S6).',
  '- docs/tranches/E/audit/sota/ — the 30-doc E deep-SOTA evidence (r-*/a-*/d-* +',
  '  _SYNTHESIS-*). Your job is to find what is STILL not-SOTA AFTER D+E landed, and to',
  '  RE-MEASURE E’s withholds — NOT to repeat the E findings (cite + diff them).',
  '- docs/tranches/E/audit/deferred-ledger.md + docs/tranches/E/valuejs-sota-handoff.md',
  '  (the 405-line value.js proposal F augments).',
  '- The live library: src/animation/** (the engine post-D+E), src/parsing/** (the',
  '  @keyframes grammar + format), src/units/** (the value.js re-exports + normalize),',
  '  demo/** (the demo post-W11). value.js source is at /Users/mkbabb/Programming/value.js.',
  '',
  'USE the modern-web-guidance skill: `npx -y modern-web-guidance@latest search "<query>"`',
  'then `retrieve "<id>"` for the baseline-dated guides; and WebSearch/WebFetch for the',
  'current SOTA (animation libs, the CSS/W3C spec frontier, the V8 cost model). Note',
  'Baseline dates + whether a feature needs feature-detection.',
  '',
  'YOUR DOC must be: file:line-grounded (code claims), disposition-tagged per finding',
  '(SHIP-in-F / MEASURE-FIRST / BOOK / KILL / RECORD / value.js-HANDOFF), and HONEST',
  'about what is ALREADY-SOTA (manufacture no work — say so plainly where the post-E',
  'state is exemplary). Prefer a few deep, grounded findings over a broad shallow list.',
  'Return a CONCISE plain-text summary: your top findings + each one’s disposition.',
].join('\n')

// ── 27 phase-1 lanes: { id, focus } ───────────────────────────────────────────
const PHASE1 = [
  // —— SOTA research (the frontier) ——
  ['r-anim-libs-2026', 'Animation-library SOTA frontier vs the POST-E engine (E shipped the orchestration tier: stagger/flip/drag/decay/Sequence/animate/SpringProgress.fromDuration). Compare Motion (motion.dev), GSAP 3.13, anime.js v4, Theatre.js, Rive, WAAPI. What do they LEAD with that keyframes still lacks — timeline scrubbing/devtools, SVG/path morphing, MotionPath, keyframe easing-per-property, draggable/inertia ergonomics, the declarative-vs-imperative surface? Diff against docs/tranches/E/audit/sota/r-anim-libs.md (the pre-E baseline).'],
  ['r-modern-web-2026', 'Re-digest the LATEST modern-web-guidance (run `npx -y modern-web-guidance@latest list` then search/retrieve the catalog) + developer.chrome.com/docs/modern-web-guidance. What is NEW or changed since docs/tranches/E/audit/modern-web-findings.md — Invoker Commands, Interest Invokers, the View-Transition types API, scroll-driven animation-timeline, @starting-style, interpolate-size/calc-size, the CSS frontier? Per item: the Baseline date + the kf-engine vs demo fit + a feature-detect note.'],
  ['r-css-parsers-wasm', 'CSS-parsing SOTA — lightningcss (Rust/SWC), csstree, @csstools/css-parser-algorithms + css-tokenizer, the CSS Parser API. value.js parses via @mkbabb/parse-that combinators (the heavy surface keyframes consumes). What is the SOTA parse ARCHITECTURE (single-pass, span-preserving, zero-copy tokenization, error recovery)? Assess the compile-to-WASM/Rust angle for value.js’s parser (the E synthesis declined a full WASM rewrite — re-examine with current evidence). The any()-combinator dispatch cost (E handoff Wave A).'],
  ['r-interpolation-carrier', 'Interpolation-representation SOTA — the value.js ValueUnit carrier is megamorphic (6-field, the E handoff Wave D named it the largest structural perf win). SoA vs AoS for interpolation; typed-array segment layouts (the NumericAnimation SoA core is already SOTA in-tree); CSS Typed OM (CSSNumericValue/CSSUnitValue) as a carrier; what Motion/GSAP use internally. The monomorphic-carrier transposition — feasibility + the value.js-handoff shape.'],
  ['r-waapi-platform-2026', 'WAAPI + platform-animation frontier (2026). Composited properties; ScrollTimeline/ViewTimeline Baseline status; @property Baseline; transition-behavior + @starting-style discrete animation; interpolate-size/calc-size (animating to auto); the CSS Animations L2 / Web Animations 2 surface. Post-E the engine does dense WAAPI sampling + an additive native-scroll bridge — what MORE can it delegate or adopt, feature-detected? Diff docs/tranches/E/audit/sota/r-waapi.md.'],
  ['r-frame-compile-sota', 'Frame-COMPILATION architecture SOTA — how Motion/GSAP/anime compile keyframes into a runtime-sampled form; SoA/typed-array segment layouts; incremental recompile on edit; precomputed sample splines. Re-examine the W8-WITHHELD FrameCompiler SoA (typed time index, slot map) + incremental updateSegments against this frontier + the demo editor workload. Is the withhold still correct, or does F land it? Cite frame-compiler.ts.'],
  ['r-color-l4-l5', 'CSS Color 4/5 SOTA — relative color syntax `rgb(from ...)`, color-mix(), the color() spaces, contrast-color(), the L5 frontier; oklab/oklch interpolation + hue methods; HDR/wide-gamut. value.js owns the color machinery (Color/OKLAB/normalize). Where is value.js vs the spec? currentColor/light-dark() sentinels (W9 S6 needs-handoff). The non-legacy L4 serializer (W9 S4 needs-handoff). The value.js-handoff color shape.'],
  ['r-cwv-inp-2026', 'CWV/INP/perf SOTA (2026) — the latest INP/LoAF guidance, scheduler.yield/postTask priority, content-visibility + content-visibility:auto, speculation rules vs SPA prefetch, the loading critical path, bf-cache. What is NEWER than docs/tranches/E/audit/sota/r-cwv-perf.md? The demo lighthouse: E deferred S3 content-visibility:auto (precondition absent) + the lighthouse honest-withhold — re-assess for F.'],
  ['r-scroll-vt-2026', 'Scroll-driven animations + View Transitions SOTA (2026). Same-document + cross-document VT, the types API, the @view-transition rule, scroll-driven animation-timeline (scroll()/view()), the Navigation API. E landed VT scene-nav (feature-detected, spring fallback) + an additive native ScrollTimeline bridge. What is the next SOTA layer for the demo + the engine? Diff r-scroll-view-transitions.md.'],
  ['r-demo-design-2026', 'Modern web-app DESIGN SOTA — the design-system / motion-design / editor-UX frontier (the demo consumes @mkbabb/glass-ui). Usability, elegance, design cogency: layout, typography, color, motion choreography, the editing experience, onboarding, responsive/mobile. What concrete moves elevate the demo’s design cogency (the user’s explicit ask) WITHOUT re-litigating E.W11 (which landed VT/a11y/idiom-r3/first-paint)? Cite demo/** + glass-ui idioms.'],
  ['r-v8-cost-model', 'V8 / JS-runtime cost model — hidden classes, megamorphic ICs, the dictionary-mode deopt (E found the delete-loop forces it, W7 D-RT-7, withheld), inline caches, allocation/GC. Apply to (a) the interpolation hot path (interpFrames/lerpValue/the ValueUnit carrier) and (b) the parse path. What transpositions does the cost model justify in F (kf-side) vs value.js-handoff? Be quantitative where the bench can show it.'],
  ['r-spec-frontier-2026', 'The W3C/CSS/WHATWG spec frontier — newly-Baseline + in-flight features the ENGINE / PARSER / DEMO should adopt: CSS Values 4 (calc-size, the math fns), Easing 2 (linear() landed; what else), Web Animations 2, Houdini (the Animation Worklet, Typed OM, Properties&Values API/@property), the Anchor Positioning + Popover surface. The honest "what is coming + what is Baseline-now" adoption map, each with a feature-detect note.'],

  // —— audit of the implemented state ——
  ['a-engine-post-e', 'Audit the IMPLEMENTED engine (src/animation/** after D+E) for residual gaps + quality + SOTA-conformance. The Animation class is 914L (ceiling raised to 950 in W4 — is a further split warranted?); the W7 Strand-B WITHHOLDS (per-frame DOM write-skip, the async fast path in playback.ts, the delete-loop→stable-key, the preset memo) — re-assess each for F with a bench plan. The WAAPI commit-on-finish, the native-scroll bridge — production-readiness. file:line. What does F’s engine band fold?'],
  ['a-parsing-post-e', 'Audit keyframes parsing (src/parsing/keyframes.ts + format.ts + the value.js consumption seam) for gaps. Grammar coverage (the @keyframes/@property/multi-keyframes grammar), the round-trip fidelity (the linear() round-trip W7 closed the kf-consume half — the value.js linear()-PARSER half is still a handoff), the serializer (format.ts via Prettier), error recovery. What is the parsing F-scope (kf-side vs value.js-handoff)? file:line.'],
  ['a-framecompiler-remeasure', 'RE-MEASURE the FrameCompiler W8 WITHHOLDS honestly (the measure-first re-visit). S1 typed time index (Float64Array startTimes/stopTimes — the E note said the shared binarySearchRange has no index-aware accessor, a negligible gain), S2 slot map (the per-frame Object.assign over a small dict), S3 incremental updateSegments (the editor workload). With a SHAPED bench plan, does F NOW land any of them, or stay withheld? Re-ground against frame-compiler.ts + numeric.ts (the SoA target). Honest disposition.'],
  ['a-runtime-remeasure', 'RE-MEASURE the W7 Strand-B runtime WITHHOLDS with a concrete bench plan: the per-frame transformTargetsStyle DOM write-skip (utils.ts), the async fast path (playback.ts wraps every frame in Promise.resolve().then — an INP/GC cost), the delete-loop→stable-key dict-mode deopt (engine.ts interpFrames + group.ts), the preset lazy memo (animations.ts). For each: the shaped interpolation.bench.ts variant + the F disposition (land-on-measured-win vs stay-withheld). Honest.'],
  ['a-demo-post-e', 'Audit the IMPLEMENTED demo (demo/** after W11) for usability/elegance/design-cogency residuals (the user’s explicit ask) — the component architecture (any new >350L units post-E?), the design-system usage, the editing UX, mobile/responsive, the scene set, onboarding. What is the demo F-scope that does NOT re-litigate W11? Cite demo/** file:line. Pair with r-demo-design-2026.'],
  ['a-boundary-arch-F', 'Audit the ARCHITECTURE for F-scope transpositions toward elegance/simplicity (gestalt). The light/heavy boundary (the barrel + loadAnimationEngine + the new orchestration tier on the light surface), the value.js seam, the src/units re-export barrels (mostly thin re-exports — is the structure right?), the module graph, the internal/ leaves. Where would an architectural transposition simplify or clarify? file:line. NO legacy.'],
  ['a-vj-consumption-F', 'Audit the value.js CONSUMPTION seam — exactly what keyframes consumes from @mkbabb/value.js (the heavy engine + the units re-exports), the version pin (^0.10.0 vs value.js HEAD), the needs-handoff items (W9 S4 cssColorInterpKeyword + L4 serializer, S6 currentColor/light-dark sentinels), the E handoff Waves A-F. What is the COMPLETE cross-repo edge F proposes to value.js? Ground against /Users/mkbabb/Programming/value.js + the existing handoff.'],
  ['a-tranche-retro-F', 'Retro on the D+E tranche process + outcomes — what landed cleanly, what was withheld (and whether the withholds were honest measure-first vs avoidance), the gate quality (13 proof gates + 460 tests), the orchestration (workflows), the cross-repo discipline (inv-16). Diff against docs/tranches/E/audit/sota/a-tranche-retro.md. What should F do better? The honest retro.'],
  ['a-test-quality', 'Audit the test + gate suite (460 tests across 40 files, 13 proof:* gates) for coverage gaps + gate QUALITY (do they BITE? are any gates narration?). The new E surfaces (orchestration tier, platform adoption, VT) — are they gate-locked? The bench coverage (bench/*). What verification discipline does F add? file:line.'],

  // —— perf deep (the user’s explicit ask: parse / runtime / compile) ——
  ['p-parse-perf-F', 'PARSE-time perf deep — the value.js parser hot path keyframes drives (parseAndFlattenObject, tryParse, the any() combinator dispatch — E handoff Wave A: any()→dispatch() O(1) first-char over 65 sites, single-pass, spans). The keyframes grammar parse. With a shaped bench, the F disposition: which parse wins are kf-side (the consumption + the tryParseCache, W5 withheld) vs value.js-handoff. Quantify where possible.'],
  ['p-runtime-perf-F', 'RUNTIME/interpolation perf deep — the lerp hot path (lerpValue → lerpComputedValue → getComputedValue, the computed-unit DOM round-trip = the real D-3 win, value.js-owned), the ValueUnit carrier megamorphism, the zero-alloc discipline (group + standalone both zero-alloc post-E; the delete-loop deopt remains). The shaped bench + the F disposition (kf-side vs the value.js endpoint-cache + carrier handoff). Quantify.'],
  ['p-compile-perf-F', 'COMPILE-time perf deep — the FrameCompiler (parse() whole-program; E.W8 landed deterministic frameId + the editor single-compile S0; the incremental updateSegments S3 withheld). The editor double-compile workload (now single per E.W8 S0). With a shaped compile bench (the editing-session profile), does F land the incremental path + the SoA layout, or stay withheld? The honest measure-first disposition + the bench design.'],

  // —— value.js augmentation components (propose, inv-16) ——
  ['vj-parser-aug', 'value.js PARSER augmentation proposal (hand-off — propose, never write value.js). Build on the E handoff Wave A (any()→dispatch O(1) first-char, the 65 any() sites, single-pass, span-preserving) + the WASM/Rust angle (re-examine the declined full-rewrite with current lightningcss/SWC evidence). The linear()-PARSER half (completes the W7 round-trip). The value.js-F parser proposal, file:line against /Users/mkbabb/Programming/value.js.'],
  ['vj-color-interp-aug', 'value.js COLOR + INTERPOLATION augmentation proposal (hand-off). Build on the E handoff Waves B/C/D (the Color.toString per-frame serializer cost ~190ns/frame, the computed-unit endpoint cache, the monomorphic interpolation carrier) + Color L4/L5 (relative color, color-mix, the non-legacy L4 serializer for W9 S4, the currentColor/light-dark sentinels for W9 S6). The value.js-F color/interp proposal, file:line.'],
  ['vj-units-compute-aug', 'value.js UNITS + COMPUTED augmentation proposal (hand-off). The computed-unit endpoint cache + batched getComputedValue (the real D-3 win, no kf edit), the ~24 no-op declared length units (dvh/vi/lh/cap — HIGH correctness), bounded parse/normalize caches (LRU — the tryParseCache + the memo caches), container-query units. The value.js-F units proposal, file:line against value.js.'],
]

// ── 5 phase-2 synthesis lanes ─────────────────────────────────────────────────
const SYNTH = [
  MANDATE,
  '',
  'YOU ARE A SYNTHESIS LANE (phase 2). FIRST read EVERY findings doc the audit phase',
  'wrote — `ls docs/tranches/F/audit/` then read all the *.md there (the 27 phase-1',
  'lanes). Consolidate them into YOUR deliverable (named in your brief). Do NOT repeat',
  'the raw findings — DEDUPLICATE, PRIORITIZE, and DISPOSITION. inv ε: every claim traces',
  'to a phase-1 finding (cite the lane) or a file:line. This is TRANCHE DEVELOPMENT —',
  'docs only, no source. Return a concise summary of your synthesis.',
].join('\n')

const PHASE2 = [
  ['_SYNTHESIS-deferred-ledger', 'The COMPLETE F deferred ledger: consolidate every deferred / measure-first-withheld / chronic item across A→E (the E withholds: W7 Strand-B, W8 SoA/incremental, tryParseCache, lighthouse-off-CI; the W9 S4/S6 value.js needs-handoff; the ARCH kills: WASM-parser-replace, native-ScrollTimeline-REPLACE, Worker/OffscreenCanvas, dev.sh) + any NEW deferrals the F audit surfaces. Each row: tag (FOLD-INTO-F / value.js-HANDOFF / KILL-recorded / RECORD) + the disposition. DELINEATE the CHRONIC (anything deferred across 2+ tranches). The honest, complete ledger — write docs/tranches/F/audit/_SYNTHESIS-deferred-ledger.md.'],
  ['_SYNTHESIS-prompt-recap', 'The COMPLETE prompt-recap A→F: recap EVERY user request across the whole engagement (read docs/tranches/E/audit/prompt-recap.md for the A→E consolidation, then ADD the F ask — the 32-agent SOTA audit, parse/runtime/compile perf, the frame compiler, demo design cogency, fold-the-deferred, recap-all, no-legacy, tranche-dev-only). Each ask: ADDRESSED (landed, cite the tranche/wave) / PENDING (cite the gate) / F-SCOPE (folded into an F wave) / HONORED (a recurring precept). No drops. Write docs/tranches/F/audit/_SYNTHESIS-prompt-recap.md.'],
  ['_SYNTHESIS-gap-scorecard', 'The GAP scorecard: post-D+E, the honest map of what is ALREADY-SOTA (manufacture no work — the engine kernel, the interpolation core, the WAAPI harness, the spring, the boundary, the orchestration tier) vs what is STILL a GAP (the net-new F content), across engine / parsing / runtime / compile / demo / value.js. Each gap: SOTA-target + the F disposition + the wave it routes to. The scorecard that proves F is net-new, not busywork. Write docs/tranches/F/audit/_SYNTHESIS-gap-scorecard.md.'],
  ['_SYNTHESIS-valuejs-handoff-v2', 'valuejs-sota-handoff-v2: consolidate the value.js augmentation (the vj-parser-aug + vj-color-interp-aug + vj-units-compute-aug phase-1 lanes + the a-vj-consumption-F audit + the existing 405-line docs/tranches/E/valuejs-sota-handoff.md) into ONE prioritized cross-repo charter the value.js OWNER formalizes (inv-16 — propose, never write value.js). De-duplicate vs the E v1; mark what E v1 already covered vs what F ADDS. The full value.js-F tranche proposal with the mandate traveling with it. Write docs/tranches/F/valuejs-sota-handoff-v2.md.'],
  ['_F-CHARTER-DRAFT', 'The Tranche F CHARTER DRAFT (the path forward): synthesize the wave structure from the audit + the gap scorecard. Propose F’s bands + waves (e.g. an engine perf/compile band [the re-measured FrameCompiler SoA/incremental + the runtime hot-path folds], a parsing band, a modern-platform band [the new Baseline features], a demo design-cogency band, a value.js-handoff hand-off, the close) — each wave with its falsifiable hard gate, its dispositions, and the DAG. State the binding §Mandate, the inv set, and the honest provenance (net-new vs folded). This is a DRAFT charter for the team lead to refine — write docs/tranches/F/F-CHARTER-DRAFT.md. NOT the final F.md (the lead authors that).'],
]

// ── orchestration ─────────────────────────────────────────────────────────────
// Run in CHUNKS (sequential batches of a few agents) rather than one big burst —
// the per-batch await spaces the agent spawns out so the fan-out does not trip a
// transient server-side rate limit. Each batch still runs its members in parallel.
const runChunked = async (items, chunkSize, makeThunk) => {
  const out = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const batch = items.slice(i, i + chunkSize)
    log('  batch ' + (Math.floor(i / chunkSize) + 1) + ': ' + batch.map((x) => x[0]).join(', '))
    const r = await parallel(batch.map(makeThunk))
    out.push(...r)
  }
  return out
}

phase('Audit')
log('Tranche F: 27 deep-SOTA research/audit/perf/value.js lanes — in batches of 5')
const audit = await runChunked(PHASE1, 5, ([id, focus]) => () =>
  agent([MANDATE, '', 'YOUR LANE id = ' + id + '. Write docs/tranches/F/audit/' + id + '.md.', '', 'FOCUS: ' + focus].join('\n'),
    { label: id, phase: 'Audit', agentType: 'general-purpose' })
)

phase('Synthesize')
log('Tranche F: synthesizing — ledger · recap A→F · gap scorecard · valuejs-handoff-v2 · the F charter draft')
const synthesis = await runChunked(PHASE2, 3, ([id, focus]) => () =>
  agent([SYNTH, '', 'YOUR SYNTHESIS id = ' + id + '.', '', 'DELIVERABLE: ' + focus].join('\n'),
    { label: id, phase: 'Synthesize', agentType: 'general-purpose' })
)

return { audit, synthesis }
