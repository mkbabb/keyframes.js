# Tranche U — THE DISSOLUTION TRANCHE

> **The charter.** Owner edict 2026-07-09 (verbatim: `ORIGINAL-PROMPT.md`), synthesized
> from the 32-lane audit fleet (`audit/lane-*.md`, `wf_3e2440f9-452`, 31 structured + 2
> report-only completions, 3.8M tokens). **DEVELOPMENT ONLY** — this corpus is the
> deliverable; implementation awaits explicit owner authorization.
>
> Cross-links: the verbatim edict is `ORIGINAL-PROMPT.md`; the ask ledger is
> `OWNER-ASKS.md`; the decision register is `OWNER-DECISIONS.md`; the total prompt
> ledger is `PROMPT-RECAP-U.md`; the band docs are `waves/U.<band>.md`; the board is
> `PROGRESS.md`.

---

## §0 — The one-sentence thesis

The repository's largest remaining defect is its own enforcement-and-deferral
apparatus; U dissolves it into three honest mechanisms, executes the structure edict
the apparatus was shaped to tolerate skipping, re-aims performance work at the seam
that actually costs frames, and converts every external dependency from a
vacuously-green tripwire into a deadlined covenant — with **zero deferrals surviving
into V**.

## §1 — The four root causes (the audit's convergent verdict)

**RC-1 — THE APPARATUS IS THE LEGACY.** 73.5k LOC of `scripts/` guards a 22k-LOC
library (3.3:1). 227 `proof:*` gates, of which ~40 carry real product-regression
value (lane 07); 27 gates police only the other gates (lane 07); the meta-gate
`proof:ci-coverage` (1216L) mandates the 131-step hand-enumerated CI that makes
trimming itself red (lane 08). The born-RED/FROZEN/DISCHARGE/backlog machinery is an
institutionalized deferral device: 36 FROZEN appearance locks with 0 discharged, a
chronic ledger whose own substrate is one tranche stale yet green
(lane 06 — "closure by transfer" = re-badging), and a T_BORNRED_BACKLOG that lets
defects ride under green CI (lanes 04/05). The library-gate job's fail-fast ordering
meant late gates NEVER ran on CI — one had a catastrophic-backtracking regex that
had never once completed there (the close's discovery, `72d1873`). The owner's
"most of it's likely tautological" is confirmed, and then some.

**RC-2 — THE STRUCTURE EDICT WAS EXECUTED TOLERANTLY.** T verdict #26 is overstated
LANDED: the two root waves (T.F1 `demo/@/`→`demo/shared/`, T.F2 dissolve
`components/custom/`) never executed, and `proof:colocation` was shaped to pass
without them via a tolerant DEFERRED map (lane 03 — the keystone gate certified a
tree the owner rejected on sight). Downstream: 15 of 18 transport composables are
single-component-private yet flat-binned to satisfy a line-count gate (lane 17); the
editors carry three divergent keyframe parse/serialize cores (lane 18); the scenes
never converged on the extracted rAF recipe (lane 19); the library is ~80% compliant
with two long-flat zones and a five-times-hand-spelled HEAVY surface
(lanes 15/16). The deepest demo path is 8 levels through a dead shadcn vestige
(lane 32).

**RC-3 — THE PERFORMANCE FRONTIER IS MISALLOCATED.** The SoA campaign optimized
interpolation (~5% of tick cost) while the apply/render seam (~95%, measured ~49×
the interp cost) still allocates per frame, re-serializes strings, and issues one
`setProperty` per property (lane 21). The shipped demo carries 8.0MB (~48%) of
Monaco ts/html/json workers the browser never fetches; value.js rides the eager
shell path; the LCP hero waits on an engine warm it never uses (lane 22). The lazy
barrels T.F5 built have ZERO consumers while one eager deep import drags a 906KB
chunk into the spring scene — and no gate watches the chunk graph (lane 26).

**RC-4 — THE CONSTELLATION EDGES DRIFT VACUOUSLY.** glass-ui shipped 4.1.0 + 4.2.0
while kf's tilde freezes the tree at 4.0.1 — and every gap tripwire content-probes
only the INSTALLED dist, so an upstream cure stays invisible forever (lane 28).
value.js is consumed as one bare megabarrel although 3.1.0 ships a granular subpath
taxonomy mapping one-to-one onto kf's zones (lane 27). parse-that is CLEAN:
transitive-only, zero specifiers in tree, 1.0.0 latest — certified, no band
(lanes 01/28).

## §2 — The bands

| Band | Title | Substance (lane provenance) | Size |
|---|---|---|---|
| **U.A** | THE APPARATUS DISSOLUTION | The three-mechanism target: `npm test` (all correctness) + `proof:publish` (boundary/surface/deps) + the owner-golden review loop. Genre deletions: the 27-gate self-policing layer, the 77 line-anchored appearance gates (→ owner-golden + ONE behavioral smoke), the 25 node-&&-vitest doublings (→ vitest alone), the ~16 legacy greps (→ lint rules), gate-bands.mjs IN FULL. CI collapse: 131 hand-listed steps → tier-manifest run-all; the demo browser roster → nightly + on-device pre-push; demo-device-observe DELETED; deploy-of-record redesigned (library-green + last-nightly-green ancestor). The anti-sprawl covenant: additions expensive, deletions free. (07/08/09/10/23) | XL |
| **U.B** | THE DEMO TRANSPOSITION | Keystone first move: dissolve `components/custom/` + rename `demo/@/`→`demo/shared/` (T.F1/F2 executed as deletions, gates re-anchored in the same motion, S.D4 struck on its false premise). Then per-area recursive colocation to the ratified component-module skeleton (lane 24 §9): transport's 15 private composables into their owners; per-parent module dirs; editors unified on ONE keyframe-authoring core; shell purged of home-hero pieces + dead EditorHeader; scenes converged on useManagedLoop/usePainterRegistry/useSweepScene; the SceneFacility subsumption (dual-path SceneExposedApi deleted); @/state singleton hygiene; skeleton tier completed (T.F8) per module. (03/17/18/19/20/24/26/32) | XL |
| **U.C** | THE LIBRARY TRANSPOSITION | The unified value.js-free Transport core (dissolving the three copied play FSMs — engine/group/sequence); group.ts carved to engine symmetry; the spring closed-form unified into ONE modal kernel (the vector.ts verbatim copy deleted); SmoothProgress's managed-play carve completed; physics/spring/{solver,css}/ + compile/{emit,easing}/ carves (LIGHT/HEAVY preserved); the surface collapse — `loadAnimationEngine = () => import("./public")`, AnimationEngine type derived not hand-spelled, index.ts's 150-line type re-list deleted; presets 34×4 hand-lists → data; ingest's seekAndPlay primitive; env.d.ts → demo. (11/12/13/14/15/16) | L |
| **U.D** | THE PERFORMANCE FRONTIER | The render-seam transposition: kill per-frame Object.entries alloc, coalesce transform-family into one write, land the Typed-OM numeric-apply path; the allocation-count + throughput regression harness (headless, vitest-runnable — survives the CI trim); restore the WAAPI sync fast-path; drag2D onto one 2-lane vector spring. Demo: Monaco slimmed to editor.api+css (8MB dead → 0, gated); the eager shell value.js-free; LCP decoupled from engine warm; highlight.js retired; `proof:chunk-graph` (born-RED on the 906KB spring leak); the weight budget as a standing gate; THREE named imports. (21/22/26) | L |
| **U.E** | NO-DEFERRAL DISCHARGE + LEGACY ZERO | Every machine ledger row terminally adjudicated: T_BORNRED_BACKLOG dissolved (each row cured in-U or converted to a deadlined external covenant — NONE carries to V); FROZEN_SET 36 discharged wholesale (the restructure IS their declared trigger); the 26 demo dead-export rows excised + the un-patrolled 26-symbol src blind spot swept; the chronic ledger adjudicated then `proof:chronic-closure` deleted; orphaned assets rm'd (~110KB); the tranche-tag comment archaeology purged (NO-LEGACY: provenance lives in docs/); the constants back-compat barrel re-chartered or dissolved; registerStoreReset + speculative seams deleted; MIGRATION docs consolidated. (02/04/05/06/31) | L |
| **U.F** | CONSTELLATION COVENANTS | value.js: the megabarrel → subpath transposition (all 42 HEAVY files, `internal/leaves.ts` as the reference idiom); `KF-TO-VALUEJS-U.md` (subpath+boxing+@function contract, unified parseTimingFunction ask, KF-7 rename renewal, plain-vars binary decision) — consume-edge ONLY, the sibling tranche is active. glass-ui: re-probe the five caps against FETCHED 4.1/4.2 dist; tilde→caret within the major (OD-U4); the tripwire re-architected to probe dist-tags.latest (the vacuous-green cure); ONE consolidated BG/BH letter with hard kf-side postures (absorb-or-expire deadlines). parse-that: certified-clean, one line, dead REALM-CONVERGENCE machinery excised. (27/28) | M |
| **U.G** | THE DESIGN CODEX | DESIGN.md promoted from 28-line stub to THE authoritative design-language spec (spec-first, gates-derive); the component-module skeleton + API grammar ratified (props/emits/slots/context — ONE grammar each); the two scene genres reconciled under owner review (telemetry-whisper for cube/amiga OR blessed designed-silence); the golden authority completed (sequence-{light,dark} born-OWNER; idle-state pinned in the capture protocol); the Vue idiom rulings R1–R7 ratified as standing law. All design work Fable + frontend-design. (24/25/26) | M |
| **U.H** | THE TEST SUBSTRATE (FIRST) | The restructure-safe characterization tier BEFORE any transposition: imports only through the two package "in"s + demo scene entries, goldening observable behavior at the seams; vitest split into library/demo projects (glass-ui stub deleted, demo tests out of the library gate); the test/<zone> mirror ratified + gate-checked; measure tests re-homed; the value.js-testing file deleted or re-chartered as a named consume-edge contract. (10/26) | M |
| **U.R** | PROMPT-RECAP-U (STANDING) | Lane 01's total ask ledger (~10 verbatim re-issues of the same 7-clause mandate) persisted as a MAINTAINED artifact under `proof:prompt-recap-u`: born at entry, updated per wave, verdicts owner-observable — the mandate clears against the tree, never self-certifies at close. The T-verdict residue (#26 overstatement) is row 1. (01/03) | S |
| **U.Z** | THE CLOSE | The certifying sweep on the terminal tree; version cut (5.3.0 or 6.0.0 per the surface deltas — the exports rationalization and dead-export excisions are potentially breaking, version-owner decides at close); the deploy-of-record on the REDESIGNED gating; the S/T-pattern close ledger; zero open deferrals as the hard exit criterion. | M |

## §3 — The DAG

```
U.R (ledger, born at entry) ─────────────────────────────┐ (standing, updated per wave)
U.H (characterization net) ── BEFORE any move ───────────┤
                                                          │
U.A (apparatus dissolution) ──┬── the gate re-anchoring is CO-SCHEDULED with every
U.B (demo transposition)     ─┤   B/C move (lane 32: structural gates re-anchor WITH
U.C (library transposition) ──┘   the moves, never lag) — A's deletions FIRST where a
                                  gate would otherwise have to be re-anchored twice
U.D (perf frontier) ── after C settles the hot-path homes (render seam rides the
                       carved tree; chunk-graph gate lands with B's module cuts)
U.E (discharge + legacy zero) ── rides throughout; terminal adjudication at U.Z
U.F (constellation) ── parallel from day 1 (letters early — upstream latency)
U.G (design codex) ── codex early (B's moves cite it); scene-genre + goldens mid
U.Z ── last; zero-deferral exit criterion
```

Sequencing keystones (lane 32): (1) `custom/` dissolution + `@→shared` move FIRST so
every subsequent import/gate re-points ONCE; (2) library-first within C (anchors
before dependents); (3) the CI trim and the restructure touch the same path-pinned
gate scripts — ONE coordinated pass, never two.

## §4 — Ring-fences (BINDING)

1. **value.js internals** — its tranche is active in its own session. U touches ONLY
   the kf consume edge + the coordination letter. No value.js-internal work, no
   parallel arms of upstream fixes.
2. **The LIGHT/HEAVY boundary** — every carve preserves it: physics/orchestration
   stay value.js-free; HEAVY stays behind `loadAnimationEngine()`/`./engine`. No
   carve crosses the static/dynamic boundary.
3. **The owner-golden mechanism SURVIVES the apparatus dissolution** — it is one of
   the three target mechanisms, not a casualty. The appearance-gate genre dissolves
   INTO it.
4. **DEVELOPMENT ONLY** — no implementation in U-dev. The corpus is the deliverable.
5. **The two package "in"s** (`.` + `./engine`) remain the only entries; the
   characterization tier (U.H) locks their observable behavior before any move.

## §5 — Orchestration (the impl-drive spec, pre-authored)

Fable: orchestration, synthesis, ALL design (with frontend-design). Opus/Sonnet:
fan-out. Batches of 3 worktree lanes; per-stage compile-green commits (the T wall
lesson); merge-U-first in every prompt; the orchestrator independently re-runs every
claimed gate on the merged tree (T4/T5); the board amended at the event (T.M9). The
stale-era re-arm class is EXPECTED: every U deletion invalidates some gate's
expectation — re-arm or delete WITH the wave, citing the ruling.

## §6 — What U explicitly does NOT do

- No new features (the demo's product surface is T-blessed; U transposes, never
  redesigns behavior except where a lane found a defect).
- No value.js/parse-that internal work (ring-fence 1; parse-that is certified clean).
- No new enforcement genres: net gate count only goes DOWN; a new standalone
  proof-*.mjs requires owner sign-off (the anti-sprawl covenant, lane 09).
