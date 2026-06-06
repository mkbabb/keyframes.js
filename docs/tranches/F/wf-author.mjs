export const meta = {
  name: 'tranche-f-author',
  description: 'Tranche F — author the tranche docs (F.md · PROGRESS · the 18 wave specs · finalize valuejs-handoff-v2) from the charter draft + audit. DEV only.',
  phases: [
    { title: 'Author', detail: '5 file-disjoint lanes — charter+progress · waves bands 0-1 · waves bands 2-3 · waves bands 4-5+close · finalize the value.js hand-off' },
  ],
}

const MANDATE = [
  'You author Tranche F development docs for keyframes.js, on branch tranche-e-impl. This',
  'is TRANCHE DEVELOPMENT — docs ONLY, ZERO source edits (no engine/demo/library/parser/',
  'test/bench changes). The F audit is DONE; you AUTHOR the tranche from it.',
  '',
  'YOUR AUTHORITATIVE SOURCE: docs/tranches/F/F-CHARTER-DRAFT.md (the synthesized path',
  'forward — the §Mandate, the band→wave map, every wave’s finding + disposition + gate +',
  'lanes, the DAG, the §ALREADY-SOTA record). Read it IN FULL first. Ground every wave spec',
  'in it + the cited phase-1 audit docs under docs/tranches/F/audit/ (read the lanes your',
  'waves cite — e.g. r-v8-cost-model, a-runtime-remeasure, p-runtime-perf-F for F4) + the',
  'live tree (cite file:line). The deferred-ledger / prompt-recap / gap-scorecard /',
  'valuejs-handoff-v2 are ALREADY authored (audit synthesis) — do NOT re-author them.',
  '',
  'THE MANDATE (binding — state it as the spine of every wave): NO quick solutions / NO',
  'workarounds; idiomatic + gestalt; architectural transpositions for elegance · simplicity',
  '· performance NECESSARY+DESIRABLE; NO legacy; measure-first (every perf claim behind a',
  'shaped biting bench or recorded-withheld with the number); isomorphic-unless-named; KISS',
  '(the §ALREADY-SOTA record is BINDING — manufacture NO work where post-E is exemplary);',
  'inv-16 (value.js + parse-that items are HAND-OFFs — propose, never write them).',
  '',
  'WAVE-SPEC STANDARD (match the E waves, docs/tranches/E/waves/E.W*.md): each wave spec',
  'carries — a title + 1-para framing (phase · class · scope · DAG-deps) · § State (verified,',
  'file:line, "verified not asserted") · § Goal (what lands + why) · § Scope (S1..Sn, each',
  'WHAT+WHY, file:line) · § Hard gate (FALSIFIABLE + re-runnable + MUST BITE — each clause',
  'reds on its negative; name the proof:* instrument) · § Folds (the finding ids it retires)',
  '· § Design decisions (RESOLVED, honest, the trade-off named). Disposition-tag every item',
  '(SHIP-in-F / MEASURE-FIRST / BOOK / KILL / RECORD / value.js-HANDOFF / parse-that-HANDOFF /',
  'glass-ui-HANDOFF). inv ε: cite for every claim. Do NOT run the full suite / commit — the',
  'lead verifies + commits. Return a concise summary of the docs you wrote.',
].join('\n')

const LANES = [
  ['f-charter', [
    'Promote docs/tranches/F/F-CHARTER-DRAFT.md into the AUTHORITATIVE docs/tranches/F/F.md',
    '(the canonical charter — remove the "DRAFT for the lead" framing; it IS the charter now).',
    'Tighten it: the §Mandate (binding, spine), the invariant set, the thesis (F is net-new,',
    'narrow, ~90% already-SOTA), the band→wave map TABLE (Band 0-5 + Band V + Band Z, with the',
    'F.W0..F.W17 wave ids), the DAG, the honest provenance (net-new vs folded vs already-SOTA),',
    'and the §ALREADY-SOTA record (binding). Add a §Phase note: TRANCHE DEVELOPMENT (the audit',
    '+ these docs); F.W1..F.W17 IMPLEMENTATION awaits explicit authorization (exactly D.W0/E.W0’s',
    'dev/impl boundary). Map the charter’s F1..F16 to wave ids F.W1..F.W16 + F.W0 (audit) +',
    'F.W17 (close). THEN author docs/tranches/F/PROGRESS.md (the board): the phase, the wave-status',
    'table (each F.W* with its hard-gate instrument + status "authored — awaits auth"), the',
    'deferred-ledger pointer (CLEAN, zero KFE), the cross-repo/user-domain perimeter (the value.js',
    '+ parse-that hand-offs; the publish leg; D.W5/W6 still glass-ui-3.3.0-gated — NOT F’s scope),',
    'and the §ALREADY-SOTA pointer. Reconcile the release tier note (likely minor). Files:',
    'docs/tranches/F/F.md + docs/tranches/F/PROGRESS.md.',
  ].join('\n')],

  ['waves-band01', [
    'Author the Band 0 (Verification) + Band 1 (Engine perf) wave specs under',
    'docs/tranches/F/waves/: F.W0.md (the audit-fold + the path forward — the assay is on disk,',
    'this charter is the deliverable, the dev/impl boundary), F.W1.md (= charter F1: fix the broken',
    'benches — the type-only CSSKeyframesAnimation barrel export breaks bench/{interpolation,parser}',
    '.bench.ts:2 + author the missing benches; gate proof:bench-runs), F.W2.md (= F2: wire proof:all',
    'into CI; gate proof:ci-coverage), F.W3.md (= F3: author proof:orchestration + the 2 public-API',
    'tests), F.W4.md (= F4 THE HEADLINE: the dict-mode buffer fold [stable-key null-fill, 3.8-6.2×',
    'measured] + the single-frame alias [41.7× standalone]; gate proof:interp-fastprops with a',
    '%HasFastProperties assertion + a pixel-identical lock), F.W5.md (= F5: the sync-step fast path,',
    'drive half SHIP / Animation+group half HELD behind an event-ordering lock; gate proof:sync-step),',
    'F.W6.md (= F6: the computed-unit endpoint cache, kf seam SHIP + value.js-HANDOFF; gate',
    'proof:computed-frame). Carry the Band-1 KILL/RECORD ledger (DOM-write-skip KILL, D1 frozen-shape',
    'KILL, Typed-OM KILL, W8 S1/S2/S3 RECORD/BOOK, tryParseCache RECORD, preset-memo RECORD) into the',
    'relevant wave §Folds so no future lane re-raises them. Ground in the cited lanes.',
  ].join('\n')],

  ['waves-band23', [
    'Author the Band 2 (Parsing seam) + Band 3 (Orchestration + arch cohesion) wave specs:',
    'F.W7.md (= charter F7: the serializer round-trip symmetry — fromString reads per-keyframe',
    'animation-timing-function but CSSKeyframesToString never emits it [format.ts:105-151 vs',
    'engine.ts:1089-1096] → silent per-stop-easing data loss every keystroke, a CSS-Animations-L1',
    'violation; factor serializeEasing(); SHIP HIGH; round-trip bite test), F.W8.md (= F8: capture the',
    'dropped adapter metadata — animation-composition parsed-then-dropped + resolved.options',
    'computed-then-never-consumed; SHIP capture+options-apply, BOOK composition-honoring), F.W9.md',
    '(= F9: complete the Sequence transport — pause/resume/reverse/timeScale/progress/repeat/yoyo over',
    'the existing seek+RAFPlayback; MEASURE-FIRST on reverse/timeScale C⁰-continuity), F.W10.md (= F10:',
    'dogfood the orchestration tier — swap useOrbitalInertia.ts:62 Math.pow decay → the shipped decay()',
    'closed form [an inv-ζ analogue], add a Sequence+stagger scene; parity-gated), F.W11.md (= F11: the',
    'boundary cohesion folds — animations.ts onto the heavy barrel [the README import resolves nothing],',
    'the 4× clamp → leaves.clamp convergence, group.ts’s inverted-tier lerp; isomorphic/byte-identical).',
    'Carry the band BOOK items. Ground in a-parsing-post-e, px-kf-grammar, r-anim-libs-2026, a-boundary-arch-F.',
  ].join('\n')],

  ['waves-band45', [
    'Author the Band 4 (Modern platform / SVG) + Band 5 (Demo design cogency) wave specs + the close:',
    'F.W12.md (= charter F12: CSS-native MotionPath — animate offset-distance over an author offset-path,',
    'WAAPI-eligible, zero value.js dep, reuses the eligibility gate; SHIP highest-ROI competitor close),',
    'F.W13.md (= F13: the Baseline-platform adopts — text-wrap:pretty SHIP sliver + the VT types helper',
    'glass-ui-HANDOFF + BOOK [typed/directional scene-VT, Invoker Mod+K palette, intrinsic-size, splitText];',
    'name the GAP-NAMED engine waves gated on value.js [intrinsic-size calc-size, MorphSVG/DrawSVG/numeric',
    'MotionPath → value.js-HANDOFF VJ-F1, SplitText BOOK]), F.W14.md (= F14: undo/redo for the destructive',
    'editor via useRefHistory + Mod+Z/Mod+Shift+Z; SHIP), F.W15.md (= F15: the a11y SHIPs — the unlabeled',
    'contenteditable CSS pane gets role=textbox+aria-multiline+aria-label+focus-ring, the playground img',
    'gets alt, a visible shortcut-discovery trigger; SHIP + BOOK the palette), F.W16.md (= F16: the rail/ball',
    'idiom honest-correction [W11 promoted the WRONG primitive] + the hero typography/a11y [the per-char',
    'hero defeats text-wrap:balance + has no accessible name]; SHIP, the named design-cohesion delta),',
    'F.W17.md (= the close: F FINAL.md template [authored AT close], the changeset [minor likely] + version',
    'owner Mike Babb, commit the wf-*.mjs provenance, the publish leg user-domain). Carry the band BOOKs.',
    'Ground in r-anim-libs-2026, r-modern-web-2026, r-scroll-vt-2026, a-demo-post-e, r-demo-design-2026.',
  ].join('\n')],

  ['handoffs', [
    'FINALIZE the value.js hand-off: docs/tranches/F/valuejs-sota-handoff-v2.md is already drafted by the',
    'audit synthesis — read it + the charter Band V table + the vj-* audit lanes (vj-parser-aug,',
    'vj-color-interp-aug, vj-units-compute-aug, a-vj-consumption-F) + the existing E',
    'docs/tranches/E/valuejs-sota-handoff.md. REFINE v2 into the authoritative cross-repo charter the',
    'value.js owner formalizes (inv-16 — propose, NEVER write value.js): the Waves A-F carried + adjusted',
    '(A2 re-ranked ahead of A1 + the istring latent-correctness bug, B’s 3 net-new color findings + the',
    'emit-space correction, C5 no-op-units LEADS, D re-pointed to SoA Float64Array, E1/E2 re-scoped,',
    'F4 CLOSED-by-verification, the §2 rename DISCHARGED) + the NET-NEW VJ-F1 (path geometry), VJ-F2',
    '(structured parse-error sink), VJ-F3 (formatColor/clone defects), VJ-F4 (buffer-reusing',
    'unflattenObjectToString), I2/I3 (the WAAPI-color un-reject + currentColor/light-dark sentinels, the',
    '4-clause HARD-equality eligibility). The MANDATE travels verbatim with the charter. Mark clearly',
    'what E-v1 covered vs what F ADDS. Keep the WASM DECLINE (re-confirmed + strengthened).',
    '',
    'ALSO author the PARSE-THAT hand-off: docs/tranches/F/parse-that-sota-handoff.md — the cross-repo',
    'charter for the @mkbabb/parse-that owner (inv-16 — propose, NEVER write parse-that). Source it from',
    'docs/tranches/F/audit/parsing/_SYNTHESIS-parsing-sota.md (the verdict: TRANSPOSE not rewrite; WASM',
    'DECLINED — the Rust port is a design ORACLE, not a deploy target) + the px-parse-that-arch /',
    'px-vj-css-parser / px-parser-sota-libs lanes. The proposed parse-that waves: thread the module-global',
    'error/diagnostic state onto ParserState (non-reentrancy fix, HIGH soundness); KILL/isolate the dead +',
    'id-only-keyed (latently-unsound) packrat memo + strip its per-parse MEMO.clear() reset tax from the',
    'LL(1) hot path; rebuild+version-bump the half-published span dist (8-of-15 source↔dist drift) + BOOK',
    'the span-first unification; RECORD the build-time closure-alloc (the Rust port answered it, JS cannot).',
    'The MANDATE travels with it. Note where each value.js-consumption finding (dispatch adoption, the',
    'istring non-anchor, the linear() parser) roots in a parse-that-side cause.',
  ].join('\n')],
]

const runChunked = async (items, chunkSize, makeThunk) => {
  const out = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const batch = items.slice(i, i + chunkSize)
    log('  batch: ' + batch.map((x) => x[0]).join(', '))
    out.push(...(await parallel(batch.map(makeThunk))))
  }
  return out
}

phase('Author')
log('Tranche F: authoring F.md + PROGRESS + the 18 wave specs + the value.js hand-off — 5 lanes, batches of 3')
const authored = await runChunked(LANES, 3, ([id, brief]) => () =>
  agent([MANDATE, '', 'YOUR AUTHORING LANE id = ' + id + '.', '', brief].join('\n'),
    { label: id, phase: 'Author', agentType: 'general-purpose' })
)

return { authored }
