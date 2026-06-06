export const meta = {
  name: 'tranche-f-harden',
  description: 'Tranche F — adversarial hardening of the authored tranche docs (gates · precepts · consistency · completeness). DEV only.',
  phases: [
    { title: 'Harden', detail: '4 adversarial lanes — falsifiable-gates · precept-sweep · cross-consistency · completeness. Review AND fix in place.' },
  ],
}

const MANDATE = [
  'You are an ADVERSARIAL HARDENING lane for the authored Tranche F development docs of',
  'keyframes.js (branch tranche-e-impl). The tranche is AUTHORED: docs/tranches/F/F.md',
  '(the canonical charter), PROGRESS.md, waves/F.W0.md..F.W17.md (18 specs),',
  'valuejs-sota-handoff-v2.md, parse-that-sota-handoff.md, and the audit evidence under',
  'docs/tranches/F/audit/ (+ audit/parsing/). Your job: ATTACK your assigned axis, then',
  'FIX what you find IN PLACE (edit the F docs directly — this is the hardening pass).',
  'Docs ONLY — zero source edits. inv ε: verify every fix against the audit evidence or',
  'the live tree (file:line). inv-16: the hand-offs PROPOSE (never write value.js /',
  'parse-that / glass-ui). Be genuinely adversarial — assume the authors made mistakes;',
  'find them. But do NOT manufacture churn: a doc that survives your attack is left',
  'alone. Return a concise list of the defects found + fixed (or "clean" per axis).',
].join('\n')

const LANES = [
  ['h-gates', [
    'AXIS: FALSIFIABLE GATES. For EVERY wave spec (F.W0..F.W17): does the § Hard gate name',
    'a real, re-runnable instrument (a proof:* script / test / bench) whose every clause',
    'REDS on its negative case (the BITE)? Attack: find narration-gates ("the docs say so"),',
    'clauses with no falsifiable instrument, gates that pass a weaker alternative beside the',
    'real fix (the E.W7-S1 escape-hatch defect class), MEASURE-FIRST items whose bench is',
    'unnamed or unshaped, and BITE claims that cannot actually red. Cross-check each gate',
    'against the charter (F.md) gate column — they must agree. FIX in place: sharpen the',
    'clause, name the instrument, write the bite. Verify the F.W4 %HasFastProperties gate is',
    'implementable (it needs --allow-natives-syntax — if fragile, the gate must name the',
    'honest fallback instrument, e.g. the threaded-buffer bench delta).',
  ].join('\n')],
  ['h-precepts', [
    'AXIS: THE PRECEPT SWEEP (the binding §Mandate). Attack every F doc for: quick-solution',
    'or workaround language (a "documented limitation" beside a real fix; an "OR (minimum)"',
    'escape hatch — the exact E.W7-S1 defect the E hardening excised); legacy allowances (a',
    'compat alias, a kept-deprecated path, a polyfill where feature-detect+fallback is the',
    'rule); un-named pixel/behaviour deltas (every delta must be NAMED + befitting);',
    'perf claims without measure-first discipline; KISS violations (manufactured work where',
    'the §ALREADY-SOTA record says exemplary — the record is BINDING). Verify the §Mandate',
    'appears as the spine in F.md AND travels verbatim-in-substance with BOTH hand-offs',
    '(valuejs-sota-handoff-v2.md + parse-that-sota-handoff.md). FIX in place: excise hatches,',
    'name deltas, tighten language. Record what you excised.',
  ].join('\n')],
  ['h-consistency', [
    'AXIS: CROSS-CONSISTENCY. Attack the F doc set for internal contradictions: the wave-id',
    'map (charter F1..F16 ↔ F.W1..F.W16 ↔ the wave files ↔ PROGRESS rows — every id,',
    'every gate instrument name, every disposition must MATCH across all four); the DAG',
    '(F.md) vs each wave spec’s stated dependencies; the release-tier statement (PROGRESS',
    'says minor — F.md and F.W17 must agree, and the B+C+D+E+F stack description must match',
    'the actual .changeset/ contents); duplicate or conflicting dispositions for the same',
    'finding across waves (e.g. the W8 S1/S2/S3 RECORD/BOOK ledger must be stated identically',
    'everywhere it appears); stale references (a wave citing an audit lane id or file:line',
    'that does not exist — spot-check against docs/tranches/F/audit/). FIX in place:',
    'reconcile to ONE truth (the charter F.md is authoritative; fix the others to it, or fix',
    'F.md if the wave is the more-correct one — then say so).',
  ].join('\n')],
  ['h-completeness', [
    'AXIS: COMPLETENESS (no drops). Attack: (1) every phase-1 audit finding (the 27 broad',
    'lanes + the 6 parsing lanes — sweep docs/tranches/F/audit/*.md + audit/parsing/*.md for',
    'their disposition-tagged findings) must have a terminal home in a wave §Scope/§Folds, a',
    'hand-off, or the deferred ledger — NO finding may be silently dropped; (2) the',
    '_SYNTHESIS-prompt-recap covers EVERY user ask A→F including the LATEST two (the 32-agent',
    'F ask AND the 6-agent parsing ask — parse-that/value.js-parsing/kf-parsing must appear',
    'as F-SCOPE rows); (3) the _SYNTHESIS-deferred-ledger has a disposition for every E',
    'withhold + W9 S4/S6 + the ARCH kills + any NEW F deferrals, and the CHRONIC items are',
    'delineated; (4) the parse-that hand-off carries ALL four parse-that findings (the',
    'non-reentrant error state, the unsound packrat, the span dist-drift, the closure-alloc',
    'RECORD) + the WASM decline. FIX in place: add the missing rows/folds (cite the lane),',
    'and update the recap/ledger where the F+parsing asks are under-represented.',
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

phase('Harden')
log('Tranche F: adversarial hardening — gates · precepts · consistency · completeness')
const hardened = await runChunked(LANES, 2, ([id, brief]) => () =>
  agent([MANDATE, '', 'YOUR HARDENING LANE id = ' + id + '.', '', brief].join('\n'),
    { label: id, phase: 'Harden', agentType: 'general-purpose' })
)

return { hardened }
