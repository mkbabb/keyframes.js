export const meta = {
  name: 'tranche-f-parsing',
  description: 'Tranche F — the 6-agent parsing-SOTA deep-dive (parse-that · value.js CSS parser · kf @keyframes grammar). DEV only, docs.',
  phases: [
    { title: 'Parse-audit', detail: '5 parsing lanes — parse-that arch · kf grammar · value.js CSS parser · parse perf · the SOTA-libs landscape' },
    { title: 'Parse-synth', detail: '1 synthesis lane — the parsing-SOTA charter (parse-that + value.js hand-offs + the kf F-scope)' },
  ],
}

const MANDATE = [
  'You are ONE lane in the Tranche F PARSING-SOTA deep-dive — the parsing modality',
  'across THREE layers: @mkbabb/parse-that (the parser-combinator library, source at',
  '/Users/mkbabb/Programming/parse-that), @mkbabb/value.js (the CSS parser built ON',
  'parse-that, source at /Users/mkbabb/Programming/value.js), and keyframes.js (the',
  '@keyframes grammar built on value.js, src/parsing/**). On branch tranche-e-impl.',
  '',
  'This is TRANCHE DEVELOPMENT — research + audit ONLY. You write a SINGLE findings doc',
  'at docs/tranches/F/audit/parsing/<your-id>.md (id in your brief). ZERO source changes.',
  '',
  'THE MANDATE (binding): NO quick solutions / NO workarounds; idiomatic + gestalt;',
  'architectural transpositions for elegance · simplicity · performance are NECESSARY',
  'and DESIRABLE; NO legacy. inv-16: parse-that AND value.js are SEPARATE @mkbabb repos —',
  'you PROPOSE changes to them (a hand-off), you NEVER write their source. You write only',
  'keyframes.js docs. inv ε: verify, do not assert — cite file:line (parse-that, value.js,',
  'or kf) for every claim; ground every SOTA claim with a source.',
  '',
  'GROUNDING (read what is relevant first): the existing F + E audit evidence —',
  'docs/tranches/E/valuejs-sota-handoff.md (the value.js proposal incl. the parser Wave A:',
  'any()→dispatch() O(1) first-char over 65 sites, single-pass, spans), and any',
  'docs/tranches/F/audit/*.md the broader F audit has written (r-css-parsers-wasm,',
  'a-parsing-post-e, p-parse-perf-F, vj-parser-aug — your dive is DEEPER + parse-that-first,',
  'so cite + extend them, do not repeat). The live source: parse-that dist + src, value.js',
  'src (the CSS parser, parseCSSValueUnit/parseCSSStylesheet/the units+color parsers), and',
  'keyframes src/parsing/keyframes.ts + format.ts.',
  '',
  'USE WebSearch/WebFetch for the parser SOTA frontier (lightningcss, csstree,',
  '@csstools/css-parser-algorithms, nom/winnow [Rust], chevrotain, peggy, tree-sitter,',
  'the PEG/packrat literature, the compile-to-WASM angle). The E synthesis DECLINED a full',
  'WASM rewrite — re-examine with current evidence and an HONEST cost/benefit.',
  '',
  'YOUR DOC: file:line-grounded, disposition-tagged per finding (SHIP-in-F /',
  'MEASURE-FIRST / BOOK / KILL / RECORD / parse-that-HANDOFF / value.js-HANDOFF), HONEST',
  'about what is ALREADY-SOTA. Return a CONCISE plain-text summary of your top findings.',
].join('\n')

const PHASE1 = [
  ['px-parse-that-arch', 'parse-that ITSELF (the parser-combinator library, /Users/mkbabb/Programming/parse-that + node_modules/@mkbabb/parse-that/dist — note the parser/leaf/lazy/state/SPAN/split/debug modules). Audit the architecture: the Parser<T> design, the combinator set (any/seq/many/etc.), the State/span model (it HAS a span module — how complete is span/source-location preservation?), the cost model (closure allocation per combinator, backtracking, the any() linear first-match scan, memoization/packrat presence). Compare to SOTA combinator/PEG design — parsimmon, chevrotain, peggy/PEG.js, nom/winnow (Rust), the packrat-memo + left-recursion frontier. What transpositions would make parse-that SOTA (a hand-off proposal, inv-16)? file:line.'],
  ['px-kf-grammar', 'keyframes.js PARSING (src/parsing/keyframes.ts — the @keyframes grammar via parse-that combinators; format.ts — the Animation→CSS serializer via Prettier; units.ts/utils.ts re-exports). Audit grammar coverage (@keyframes / @property / .class / multi-keyframes / mixed at-rules — the "single grammar, no regex pre-detection" claim), the round-trip fidelity (parse→format→parse; the linear() round-trip E.W7 half-closed), error recovery + diagnostics. What is the kf-SIDE parsing F-scope (the part keyframes OWNS vs the value.js-handoff)? file:line.'],
  ['px-vj-css-parser', 'value.js CSS PARSER (the part keyframes consumes on the heavy surface). Audit parseCSSValueUnit / parseCSSStylesheet / parseCSSValue / the value+unit+color+function parsers, the flattenObject/normalize pipeline, the any()-combinator dispatch (the 65 sites the E handoff named). The hot path keyframes drives (parseAndFlattenObject → tryParse → CSSValues.Value). Span/source-location preservation, single-pass vs multi-pass, the tokenizer. file:line against /Users/mkbabb/Programming/value.js. The value.js-parser F-handoff shape.'],
  ['px-parser-perf', 'PARSE-TIME perf across all three layers (parse-that combinators + value.js CSS parser + the kf grammar). The cost model: per-combinator closure alloc, backtracking re-scan, the any() O(n) first-match (→ dispatch() O(1) first-char, E handoff Wave A), string-slice vs index-span (zero-copy), single-pass vs the flatten re-walk, memoization (the unbounded tryParseCache, W5-withheld; packrat). Design the SHAPED parser bench (the realistic keyframes/value workload) + the honest disposition per win (kf-side vs parse-that-handoff vs value.js-handoff). Quantify where you can.'],
  ['px-parser-sota-libs', 'The parser SOTA LANDSCAPE + the rewrite-vs-transpose decision. Survey lightningcss (Rust/SWC, the CSS-specific frontier), csstree, @csstools/css-parser-algorithms + css-tokenizer (the CSS-WG-spec-aligned tokenizer), nom/winnow (Rust combinators), chevrotain (the fastest JS parser toolkit), peggy/tree-sitter, the compile-combinators-to-a-table / partial-eval frontier. The E synthesis DECLINED a full Rust/WASM rewrite of the value.js parser — RE-EXAMINE that decision with current evidence: what is the honest cost/benefit of (a) WASM-rewrite vs (b) transposing parse-that toward a SOTA combinator architecture (compiled combinators, a real tokenizer, packrat, spans) in-place? A grounded recommendation, not a reflex.'],
]

const SYNTH = [
  MANDATE,
  '',
  'YOU ARE THE PARSING SYNTHESIS LANE. FIRST read every doc in',
  'docs/tranches/F/audit/parsing/ (the 5 phase-1 parsing lanes) AND the parser-adjacent',
  'F-audit docs (docs/tranches/F/audit/r-css-parsers-wasm.md, a-parsing-post-e.md,',
  'p-parse-perf-F.md, vj-parser-aug.md if present). Consolidate them — DEDUPLICATE,',
  'PRIORITIZE, DISPOSITION. Do NOT repeat raw findings; produce the parsing-SOTA charter.',
].join('\n')

const PHASE2 = [
  ['_SYNTHESIS-parsing-sota', 'The parsing-SOTA CHARTER: consolidate the 6-lane dive (+ the parser-adjacent F-audit lanes) into ONE prioritized path forward across the three layers — (1) the parse-that augmentation (a HAND-OFF to the parse-that repo, inv-16: combinator architecture, span-preservation, packrat/memo, the any()→dispatch frontier, the WASM/transpose decision recommended with evidence); (2) the value.js CSS-parser augmentation (folds into valuejs-sota-handoff-v2 — the any()→dispatch, single-pass, the parser hot path); (3) the keyframes-SIDE parsing F-scope (what keyframes owns + gates). Each item: disposition + the wave/hand-off it routes to + the falsifiable instrument. State the rewrite-vs-transpose recommendation plainly. Write docs/tranches/F/audit/parsing/_SYNTHESIS-parsing-sota.md.'],
]

const runChunked = async (items, chunkSize, makeThunk) => {
  const out = []
  for (let i = 0; i < items.length; i += chunkSize) {
    const batch = items.slice(i, i + chunkSize)
    log('  batch: ' + batch.map((x) => x[0]).join(', '))
    const r = await parallel(batch.map(makeThunk))
    out.push(...r)
  }
  return out
}

phase('Parse-audit')
log('Tranche F parsing: 5 parsing-SOTA lanes (parse-that · kf grammar · value.js parser · perf · sota-libs) — batches of 3')
const audit = await runChunked(PHASE1, 3, ([id, focus]) => () =>
  agent([MANDATE, '', 'YOUR LANE id = ' + id + '. Write docs/tranches/F/audit/parsing/' + id + '.md.', '', 'FOCUS: ' + focus].join('\n'),
    { label: id, phase: 'Parse-audit', agentType: 'general-purpose' })
)

phase('Parse-synth')
log('Tranche F parsing: synthesizing the parsing-SOTA charter')
const synthesis = await runChunked(PHASE2, 1, ([id, focus]) => () =>
  agent([SYNTH, '', 'YOUR SYNTHESIS id = ' + id + '.', '', 'DELIVERABLE: ' + focus].join('\n'),
    { label: id, phase: 'Parse-synth', agentType: 'general-purpose' })
)

return { audit, synthesis }
