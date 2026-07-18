# DRAFT — analysis + recommendation set for the V-next (value.js-owned) tranche prompt

> Prepared by the keyframes.js V orchestrator (Fable), 2026-07-18, for
> thrice-hardening. §1 grounds the prompt's factual presumptions against the
> recorded archaeology; §2 is the recommendation set (prompt improvements);
> §3 is the handoff-content skeleton. Skeptic panels: assume EVERY claim
> below is wrong; refute with file:line evidence from the repos.

## §1 — Grounding the prompt's presumptions (VERIFY ALL)

- G1. **The custom parser was a MEASURED decision, not drift.** Constellation
  Campaign (2026-06-19): parse-that "D7 SpanParser FALSIFIED (slower on V8)
  → retired; perf via dispatch()+byte-scanners"; the parse-that dependency
  was REMOVED from value.js at the constellation impl drive ("S9 parse-that
  dep removed", parse-that 0.12.0 era). The prompt's "why was this done, in
  what tranche" has a recorded answer; the prompt's presumption that
  parse-that adoption is an uplift was previously TESTED AND REFUTED on V8.
  What is genuinely new: parse-that's later bbnf-lang work ("tape adoption").
  So the honest framing is RE-ADJUDICATION UNDER NEW EVIDENCE, bench-gated —
  not presumed adoption.
- G2. **value.js /css already owns keyframes-adjacent grammar.** Their
  ParseIssue union (8 codes) includes `keyframe_selector_invalid`,
  `animation_option_invalid`, `timeline_option_invalid`; kf's demo consumes
  `collectAnimationOptions(...)` and `parseTimingFunction` lives on /css
  (WL §B verdict). The prompt's "should value own all parsing?" is largely
  ALREADY the architecture; the real residual adjudication sites kf-side:
  `src/animation/scroll/grammar.ts` (kf's own product grammar — R1-07 ruled
  KEEP, "not Value-4 residue"), the demo's `parseAnimationCSS.ts`, and
  compile/emit (which is SERIALIZATION, not parsing — should stay kf).
- G3. **Majors re-open the wedge.** glass-ui@7.0.0 peers `value.js@^4.0.0`
  AND `keyframes.js@^6.0.0`; kf pins value EXACTLY 4.0.0; atlas 7.0.0
  consumes the glass7+kf6+value4 tuple. ANY value 5.0.0 or kf 7.0.0 breaks
  peers → a P127-class wedge. The prompt authorizes "breaking library
  changes" without pricing this.
- G4. **kf frozen fences (must be transmitted to the value-owned tranche):**
  `TimingFunction` home/name/signature at `src/animation/constants/types.ts:45`
  (atlas IN-ATLAS-3; THREE chase sites: useCountUp.ts:47,
  useScrollLettering.ts:57, useScrollTimeline.ts:44); package exports exactly
  `.` + `./engine` with the 44-key runtime mirror; kf 6.0.0 immutable (never
  republish); `scenes/` exemplar fence; `docs/precepts/` read-only; the
  depcruise value.js-free-leaf law keyed on `^src/animation/internal/`
  (LT-10 kept `internal/` for exactly this reason — the owner's new edict
  supersedes the taste ruling but the CONFIG KEY must move with the rename).
- G5. **kf's structure was JUST settled** (V.B, 2026-07-17): proof:structure
  R1–R6 standing, six module carves, adjudicated LT blueprint. The new edict
  re-opens parts of it (src/animation flatten — the "superfluous top-level";
  internal/ rename; deeper isomorphism with value.js). This is owner
  prerogative, but the mechanism should be AMEND-THE-BLUEPRINT +
  EXTEND-THE-GATE, not a parallel second structure authority.
- G6. **mixColors/parseCSSValue ad-hoc history**: value WL letter names SCI-1
  (restore a `mixColorsInto` zero-alloc into-variant vs bless a hot-path
  idiom) as a PENDING execution-gated ruling. kf-side memory records the
  calc()/computed pipeline and convert2/color2 seams as historically fragile.
- G7. **subpaths/ in value.js**: 7 public export keys (`/color /value /css
  /easing /math /transform /quantize`), no `.` root, 62 public types, frozen
  THROUGH their V′ (their own W43 law). The `src/subpaths/*.ts` files are
  (presumably) the physical homes of the export keys — an export-map
  implementation, not necessarily "shims". The KEYS are consumed surface
  (kf, atlas); the FILES can restructure freely.
- G8. **kf V state**: CLOSED-BY-FOLD 2026-07-18; glass 7 consumed + live;
  FOLD-FORWARD.md carries W7/W8 (demo settlement), W9-landing, W10-remainder,
  W11 (UI corpus), W13 (close = successor's opening) + a 15-row marks
  register. The kf demo/UI corpus is kf-successor-owned; the new prompt says
  value owns kf LIBRARY items only ("frontend work should focus on value.js").

## §2 — The recommendation set (improvements to the prompt)

- R1. **Resolve the formation/implementation contradiction.** The body says
  "majority [of time] on direct code implementation"; the appended block says
  "This is NOT an implementation phase... no source edits". Split explicitly:
  PHASE A (this prompt) = 32-agent audit + formation, no edits; PHASE B =
  the formed tranche's implementation, where the "direct code implementation,
  visual verification" posture applies. State which phase each edict binds.
- R2. **Bench-gate the parser re-adjudication** (from G1): a born-RED
  performance baseline of the extant byte-scanner parser (ops/s, allocations
  via V8 heap-sampling, on the real grammar corpus) BEFORE any parse-that
  prototype; the adoption wave opens only if parse-that-on-tape meets an
  owner-ratified threshold (e.g. within N% of byte-scanners); readability is
  adjudicated as a SEPARATE axis with the archaeology (D7 falsification, S9
  removal) cited in the wave spec so the fleet doesn't re-litigate blind.
- R3. **Add a major-boundary co-land protocol wave** (from G3): all breaking
  changes accumulate behind ONE coordinated constellation cut (value 5 / kf 7
  / glass peer-bump / atlas successor), with chase-site ledgers named in
  advance; until that boundary, restructures stay internal-only behind frozen
  surfaces. Without this, "breaking changes are allowed" detonates the
  published-latest graph the constellation just healed.
- R4. **Inherit, don't fork, kf's structure authority** (from G4/G5): the kf
  waves this tranche directs must amend the ratified LT blueprint and EXTEND
  `proof:structure` (R1–R6 + new rules incl. the src/animation flatten and
  the internal/ rename with its depcruise key repoint + engine-mirror
  re-verify per batch). Name the superseded rulings (LT-10, LT-16 rows)
  explicitly — refutation amends the charter, silence re-litigates it.
- R5. **Define the parsing boundary as a census, not a vibe** (from G2):
  value = CSS text → values/AST (all grammar); kf = animation semantics,
  compile, EMIT (serialization); gate = a grammar-duplication census (zero
  productions implemented on both sides), with `scroll/grammar.ts` and
  `parseAnimationCSS.ts` as the named adjudication rows.
- R6. **Name the color spec anchors**: CSS Color 4 gamut mapping (OKLCh
  chroma reduction, deltaEOK ≤ JND binary search) + the 2026-stabilized
  Color 5/HDR features; conformance vectors (WPT color suites) as the gate;
  zero-alloc via into-variants (fold the pending SCI-1 ruling in here rather
  than leaving it orphaned in WL).
- R7. **Make the ad-hoc-fix archaeology a deliverable** (from G6): a
  defect-family register for mixColors/parseCSSValue — which tranche patched
  what, which missing invariant let it recur — BEFORE the uplift wave, so the
  uplift closes families, not instances.
- R8. **Ingest the standing letters as registry rows**: WL verdicts (D-GAP-6
  sampleBezier re-open path; §D name-a-code re-open), SCI-1, RF-18 — the new
  registry starts from them, not from re-derivation.
- R9. **Bound the thrice loop**: dynamic cluster batches; convergence = two
  consecutive clean passes per cluster; ≤3 iterations per cluster before
  owner escalation; both skeptics FRESH-context Fable (no inherited
  narrative), adjudicator Fable with repo access and the duty to PROVE, not
  vote.
- R10. **Fence the cross-repo ownership**: this tranche DIRECTS kf library
  items as SPECS + bounded dispatches into kf's coordination inbox; the kf
  successor implements ("the next proper keyframes.js-owned tranche will
  adapt accordingly"). If the owner intends direct cross-repo EDITS at
  implementation, that needs an explicit grant amending the sibling
  read-only law — say so in the prompt.
- R11. **Confirm the batch size change** (3 → 5-6) is deliberate; recommend
  Fable-seat panels stay ≤3 concurrent (the thrice panel is exactly 3) with
  Opus sweeps at 5-6.
- R12. **Add missing lenses**: malformed-input robustness/fuzzing for the
  parser; an allocation-measurement methodology standard (so "zero-alloc"
  claims are measured one way fleet-wide); a DAG-tooling decision (the graph
  is depcruise-derivable — don't hand-draw what a tool emits).
- R13. **Shim vs export-home distinction** (from G7): kill redundant internal
  indirection; the physical files behind frozen public subpath KEYS are not
  shims — restructure them freely, never the keys (outside the R3 boundary).
- R14. **Tests-isomorphism as a gate rule**, not a sweep: extend the structure
  gate with a test-tree isomorphism check (kf already conforms; value
  verifies).
- R15. **Name the ingestion set** for the executing session: this handoff,
  kf's `FOLD-FORWARD.md`, value's V′ corpus, the WL/formation-exchange
  letters, the Q060 glass packet, and read-only archaeology grants across
  kf/parse-that/bbnf-lang docs.

## §3 — Handoff skeleton (what the value session must receive from kf)

kf state (V closed-by-fold; glass 7 live; full battery green), the G4 fence
pack verbatim, the G1 archaeology pointers, the G2 parsing census seeds, the
consume-edge truth (kf pins value EXACTLY 4.0.0; registry-only; one core;
smallest-honest-successor cadence bilaterally ratified), kf asks (none
beyond standing: sampleBezier only if a hard shared need; no easing gap —
FAM-14), and the R10 ownership protocol.
