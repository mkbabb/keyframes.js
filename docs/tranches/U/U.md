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

## §0 — Summary

The repo's biggest remaining problem is its own enforcement-and-deferral machinery —
73.5k lines of scripts guarding a 22k-line library. U dissolves that machinery into
three honest checks (`npm test`, `proof:publish`, owner review), then does the
restructuring the machinery was shaped to let us skip. It also re-aims performance
work at the per-frame apply/render path that actually costs frames, and turns every
external-dependency tripwire into a deadlined covenant. No deferral survives into the
next tranche (V).

## Terms (plain definitions, stated once — used freely below)

- **owner-golden** — a blessed screenshot the owner signs off as correct; the gate
  passes if the current render matches it.
- **born-RED** — a test written to FAIL now (it pins a known bug) and go green when
  the bug is fixed.
- **vacuous-green** — a gate that passes without actually checking anything (e.g. an
  empty selector match, or a sample window that never reaches the defect).
- **fold-map** — a table proving each deleted gate's real check now lives in a
  surviving test.
- **re-arm / re-anchor** — re-point a gate at the moved files so it checks the new tree.
- **co-scheduled** — done in the same commit/pass as a paired move.
- **seam** — the boundary or code path where one part hands off to another (named
  concretely per use: the per-frame apply/render path, a lazy-load boundary, a store's
  single write entry).
- **FSM** — a finite state machine; here, the play/pause/stop transport machine.
- **DFA** — a deterministic finite automaton; here, the demo's control-surface state
  machine.
- **SoA** — structure-of-arrays; the group compositor's typed-array blend layout.
- **LoAF** — Long Animation Frames, the browser's long-frame performance API.
- **T_BORNRED_BACKLOG / FROZEN_SET** — two machine ledgers of deferred defects and
  locked appearance screenshots (both dissolve in U).
- **DISCHARGE** — the ledger act of retiring a locked/deferred row with a witness.

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
`components/custom/`) never executed (the owner's 2026-07-10 ruling OD-U2 now
replaces the `@→shared` RENAME half with a component-CORE redesign to the glass-ui
post-BH idiom + a `demo/@/` DISSOLUTION reco), and `proof:colocation` was shaped to
pass without them via a tolerant DEFERRED map (lane 03 — the keystone gate certified a
tree the owner rejected on sight). Downstream: 15 of 18 transport composables are
single-component-private yet flat-binned to satisfy a line-count gate (lane 17); the
editors carry three divergent keyframe parse/serialize cores (lane 18); the scenes
never converged on the extracted rAF recipe (lane 19); the library is ~80% compliant
with two long-flat zones and a five-times-hand-spelled HEAVY surface
(lanes 15/16). The deepest demo path is 8 levels through a dead shadcn vestige
(lane 32).

**RC-2b — THE LAYERING SYSTEM WAS BUILT TWICE AND NEVER MERGED (the owner's named
primary animation bug — OD-U14, NOW NAMED AND CONFIRMED).** When you stack animations
on one element, the code has two different, incompatible ways to describe "combine
these layers" — the group's `BlendMode = replace|add|weighted` (inventing a
non-normalizing `weighted`, omitting `accumulate`) vs the engine's
`CompositeOperator = replace|add|accumulate` — and never reconciled them. Worse, the
combined result stores POINTERS into each layer's frame data instead of its own copy;
the interpolator swaps that data out at every keyframe boundary, so the combined layer
silently freezes or vanishes. This is a stale-leaf class of THREE instances (the amiga
freeze OD-U13 root-caused is ONE; the SoA add/weighted collapse, demo-reachable via
`LayerConfigPanel` and green under every gate, is the un-found sibling; the
layer-removal leak the third). Blending is also unit-blind AND colour-blind across
layers, and there is NO group WAAPI path at all (any animation drops to main-thread
rAF the instant it joins a group). It is not *wrong* so much as **unreconciled** — it
grew a second composition tier beside the first and never merged them. Chartered as
the U.C compositor re-charter (U.C14 widened + U.C3 re-chartered + U.C15/U.C16 new;
the 3-lane assay evidence at `audit/assay-compositor-*.md`).

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
| **U.A** | THE APPARATUS DISSOLUTION | The three-mechanism target: `npm test` (all correctness) + `proof:publish` (boundary/surface/deps) + the owner-golden review loop. Genre deletions: the 27-gate self-policing layer, the 77 line-anchored appearance gates (→ owner-golden + ONE behavioral smoke), the 25 node-&&-vitest doublings (→ vitest alone), the ~16 legacy greps (→ lint rules), gate-bands.mjs IN FULL. CI collapse: 131 hand-listed steps → tier-manifest run-all; the demo browser roster → nightly + on-device pre-push; demo-device-observe DELETED; deploy-of-record redesigned (library-green + last-nightly-green ancestor). The anti-sprawl covenant: additions expensive, deletions free. **RULED exit criteria (OD-U1): (a) ZERO functionality loss — every real invariant a deleted gate asserted folds into vitest/`proof:publish`, witnessed by a fold-map deliverable; (b) ≥10× merge-gating wall-clock — the CI path drops from ~35-40 min to ≤4 min.** (07/08/09/10/23) | XL |
| **U.B** | THE DEMO TRANSPOSITION | Keystone first move (OD-U2): the component CORE redesigned to the glass-ui post-BH idiom (`audit/glassui-idioms-post-bh.md` — kebab-case dirs, PascalCase SFCs, `index.ts` barrels, `constants.ts` types-through-the-barrel, per-component `composables/`, >500L renderer carves) + dissolve `components/custom/` (STANDS); the `demo/@/` DISSOLUTION is the REVISED RECO (hoist its five children to `demo/{components,composables,state,styles,utils}/`, alias SPELLINGS unchanged, 3-plane declaration — executes on the owner's one-word confirm; the ~34 gate path re-anchor pass is identical either way). The keystone wave order IS **P7's `N1-MOVE-SCRIPT.md` §①–⑤ verbatim** (the loop's converged evidence, worktree `d7f-11`; steps ①/④ owner-gated per the ride queue). Then per-area recursive colocation to the ratified component-module skeleton (lane 24 §9): transport's 15 private composables into their owners; per-parent module dirs; editors unified on ONE keyframe-authoring core; the scene-facet loading model (OD-U12 — every scene composes the multi-facet instrument, heavy editors load only when their facet is shown); shell purged of home-hero pieces + dead EditorHeader; scenes converged on useManagedLoop/usePainterRegistry/useSweepScene; the SceneFacility subsumption (dual-path SceneExposedApi deleted); @/state singleton hygiene; skeleton tier completed (T.F8) per module; **the amiga animation + scene suspend/resume cure (OD-U13, U.B13 — first-principles fix from `audit/defect-amiga-suspend-resume.md`, investigation in flight)**; **U.B14** the small-module INLINE wave (OD-U16 inline direction, U.B+U.C paired — cut target-by-target from the P2 fold-map, `287-11`, never a bulk sweep). (03/17/18/19/20/24/26/32) | XL |
| **U.C** | THE LIBRARY TRANSPOSITION | The unified value.js-free Transport core (dissolving the three copied play FSMs — engine/group/sequence); group.ts carved to engine symmetry; the spring closed-form unified into ONE modal kernel (the vector.ts verbatim copy deleted); SmoothProgress's managed-play carve completed; physics/spring/{solver,css}/ + compile/{emit,easing}/ carves (LIGHT/HEAVY preserved); the surface collapse — `loadAnimationEngine = () => import("./public")`, AnimationEngine type derived not hand-spelled, index.ts's 150-line type re-list deleted; presets 34×4 hand-lists → data; ingest's seekAndPlay primitive; env.d.ts → demo. **The OD-U14 compositor re-charter (the 3-lane assay verdict — the owner's named "primary issue"): the stale-leaf class (three instances — the amiga freeze, the demo-reachable SoA add/weighted collapse, the layer-removal leak) cured by an owned `CompositeState` value store; ONE op axis (`replace\|add\|accumulate` + orthogonal normalized weight) replacing the two half-built vocabularies; group WAAPI lowering — U.C3 re-chartered, U.C14 widened, U.C15/U.C16 new; provenance `audit/assay-compositor-{semantics,behavior,architecture}.md`.** (11/12/13/14/15/16) | L |
| **U.D** | THE PERFORMANCE FRONTIER | The render-seam transposition: kill per-frame Object.entries alloc, coalesce transform-family into one write, land the Typed-OM numeric-apply path; the allocation-count + throughput regression harness (headless, vitest-runnable — survives the CI trim); restore the WAAPI sync fast-path; drag2D onto one 2-lane vector spring. Demo: Monaco kept FULLY-FEATURED but ON-DEMAND (OD-U5 — zero editor bytes on first paint; language workers/themes/prettier loaded when the editor facet opens; 8MB dead → 0); the scene-facet loading model (OD-U12 — every scene composes the multi-facet instrument, heavy editors load ONLY when their facet is shown; the spring inline-editor import is the named violation); the eager shell value.js-free; LCP decoupled from engine warm; highlight.js retired; the reachability + weight-budget assertion as ONE post-build clause inside `proof:publish` (OD-U11 — no standalone `proof:chunk-graph`); THREE named imports. (21/22/26) | L |
| **U.E** | NO-DEFERRAL DISCHARGE + LEGACY ZERO | Every machine ledger row terminally adjudicated: T_BORNRED_BACKLOG dissolved (each row cured in-U or converted to a deadlined external covenant — NONE carries to V); FROZEN_SET 36 discharged wholesale (the restructure IS their declared trigger); the 26 demo dead-export rows excised + the un-patrolled 26-symbol src blind spot swept; the chronic ledger adjudicated then `proof:chronic-closure` deleted; orphaned assets rm'd (~110KB); the tranche-tag comment archaeology purged (NO-LEGACY: provenance lives in docs/); the constants back-compat barrel re-chartered or dissolved; registerStoreReset + speculative seams deleted; MIGRATION docs consolidated. **Amended (OWNER-ASKS row 6): U.E7 — ALL CLAUDE.md files deleted, content re-homed inline/README (OD-U15); U.E8 — suppression files removed by fixing the violations (OD-U17); both wave sets specced by the convergence loop (U.L).** (02/04/05/06/31) | L |
| **U.F** | CONSTELLATION COVENANTS | value.js: the megabarrel → subpath transposition (all 42 HEAVY files, `internal/leaves.ts` as the reference idiom); `KF-TO-VALUEJS-U.md` (subpath+boxing+@function contract, unified parseTimingFunction ask, KF-7 rename renewal, plain-vars binary decision) — consume-edge ONLY, the sibling tranche is active. glass-ui: re-target the consume edge to glass-ui **5.0.0** (OD-U4 — the pin moves on its publish, the planned joint BG+BH cut); re-probe the five caps against the 5.0.0 dist; the tripwire re-architected to probe dist-tags.latest (the vacuous-green cure); ONE consolidated BG/BH letter reconciled against what 5.0.0 actually ships, with hard kf-side postures (absorb-or-expire deadlines). parse-that: certified-clean, one line, dead REALM-CONVERGENCE machinery excised. (27/28) | M |
| **U.G** | THE DESIGN CODEX | DESIGN.md promoted from 28-line stub to THE authoritative design-language spec (spec-first, gates-derive); the component-module skeleton + API grammar ratified (props/emits/slots/context — ONE grammar each); the two scene genres reconciled under owner review (telemetry-whisper for cube/amiga OR blessed designed-silence); the golden authority completed (sequence-{light,dark} born-OWNER; idle-state pinned in the capture protocol); the Vue idiom rulings R1–R7 ratified as standing law. All design work Fable + frontend-design. (24/25/26) | M |
| **U.H** | THE TEST SUBSTRATE (FIRST) | The restructure-safe characterization tier BEFORE any transposition: imports only through the two package "in"s + demo scene entries, goldening observable behavior at the seams; vitest split into library/demo projects (glass-ui stub deleted, demo tests out of the library gate); the test/<zone> mirror ratified + gate-checked; measure tests re-homed; the value.js-testing file deleted or re-chartered as a named consume-edge contract. (10/26) | M |
| **U.R** | PROMPT-RECAP-U (STANDING) | Lane 01's total ask ledger (~10 verbatim re-issues of the same 7-clause mandate) persisted as a MAINTAINED artifact under `proof:prompt-recap-u`: born at entry, updated per wave, verdicts owner-observable — the mandate clears against the tree, never self-certifies at close. The T-verdict residue (#26 overstatement) is row 1. (01/03) | S |
| **U.L** | THE CONVERGENCE LOOP (Track A + Track B) | OD-U18 RULED: the 5-step convergence loop IS U's development methodology from 2026-07-10 — research (≤8 parallel) → synthesis (1) → prototype fleet (worktree-isolated) → critique fleet (each item scored % convergence) → agglomerator, looped; at 100% convergence the exact wave sets develop. Track A = the spec coherence/cogency workflow; Track B = the library+demo module-restructure pass. The loop OWNS the wave sets for **OD-U15** (delete ALL CLAUDE.md files — placeholder home U.E7), **OD-U16** (module granularity BOTH directions — the carve direction lands via U.C7/U.C8; the small-module INLINING direction + the per-module assay arrive from the loop), and **OD-U17** (suppression files removed — placeholder home U.E8). Prototypes are EVIDENCE (kept worktree branches), never merged; the owner review sits inside the loop (critic consensus ≠ owner verdict). | M |
| **U.Z** | THE CLOSE | The certifying sweep on the terminal tree; version cut **5.3.0 (OD-U8** — U binds to a compatible published surface; U.C's exports rationalization + dead-export excisions land additively/internally, anything truly breaking is out of U's scope); the deploy-of-record on the REDESIGNED gating; the S/T-pattern close ledger; zero open deferrals as the hard exit criterion. | M |

> **Net NEW standalone gates in U = ZERO** (OD-U10/U11). Both gates the drafts
> proposed are DROPPED to a clause on an existing gate: `proof:scripts-colocated`
> (U.A9 → one clause on the EXISTING colocation gate + lint) and `proof:chunk-graph`
> (U.D6 → ONE post-build clause inside `proof:publish`). Every U band's net gate
> delta stays ≤ 0.

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
                       carved tree; the chunk-graph reachability/weight CLAUSE inside
                       proof:publish lands with B's module cuts — OD-U11, no standalone gate)
U.E (discharge + legacy zero) ── rides throughout; terminal adjudication at U.Z
U.F (constellation) ── parallel from day 1 (letters early — upstream latency)
U.G (design codex) ── codex early (B's moves cite it); scene-genre + goldens mid
U.L (convergence loop) ── standing from 2026-07-10 (OD-U18); the OD-U15/U16/U17 wave
                          sets are specced BY the loop and develop at 100% convergence
                          (placeholder homes: U.E7 CLAUDE.md · U.E8 suppression · U.C granularity)
U.Z ── last; zero-deferral exit criterion
```

Sequencing keystones (lane 32): (1) `custom/` dissolution + the `demo/@/` dissolution
(OD-U2 — hoist to `demo/{components,composables,state,styles,utils}/`) move FIRST so
every subsequent import/gate re-points ONCE; (2) library-first within C (anchors
before dependents); (3) the CI trim and the restructure touch the same path-pinned
gate scripts — ONE coordinated pass, never two.

**Impl sequencing in one line (RATIFIED — the convergence loop's terminal wave order,
`loop/PASS-5.md` §7, OD-U18 TERMINATED):** owner-ride queue → U.H → keystone (① owner-
gated) → B/C recuts + carves with co-scheduled re-anchors (A's deletions first where a
gate would re-anchor twice) → meta-legacy + dogfood waves ride the same passes → D after
C settles the hot paths → F letters from day 1 → G codex early → E terminal adjudication
→ U.Z.

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
  proof-*.mjs requires owner sign-off (the anti-sprawl covenant, lane 09). Both
  standalone gates the drafts once proposed are now DROPPED (OD-U10 `proof:scripts-
  colocated` → a clause on the existing colocation gate + lint; OD-U11
  `proof:chunk-graph` → one post-build clause inside `proof:publish`): **net NEW
  standalone gates in U = ZERO.**

## §7 — The convergence loop's yield (OD-U18 TERMINATED 2026-07-10)

The Track B convergence loop that OWNS the OD-U15/U16/U17 wave sets ran **five passes**
(overall convergence 73 → 97 → 96 → 98.4 → **98.8**) and **TERMINATED** at pass 5
(`loop/PASS-5.md` — the RATIFIED "## The wave-set development order"). **Nine of the ten
scored items stand at 100** (P1–P6, N1, N3, SPEC-B5); the one non-100 is **N2 at 88** —
its pass-5 order executed EXACTLY and its cures are green and independently verified, but
its remaining defect is a fully-measured, line-located, disposition-named comment/prose
class **chartered into the meta-legacy wave (U.E) under ruling 23, witnessed by U.Z's
certifying sweep**. The un-earned 12 points convert to chartered impl work, never a
terminal-pass self-certification (the exact failure mode — an agglomerator scoring its own
closure at 100 — the loop existed to prevent).

**The yield, folded into the wave order (§2/§3 above, per PASS-5 §7):**

- **Nine frozen evidence worktrees** — `wf_ca7d0632-287-{10,11,12,16,17,18}` = P1–P6 in
  that order and `wf_645e7d37-d7f-{11,12,13}` = P7/N1 · P8/N2 · P9/N3. Prototypes are
  EVIDENCE (kept worktree branches), never merged (OD-U18, R15 read-only). Each wave that
  "absorbs" a prototype executes its work order FROM the frozen record, not re-derived.
- **Four work-order artifacts** — `N1-MOVE-SCRIPT.md` (the keystone wave order, `d7f-11`),
  `N2-DELETION-LEDGER.md` (the meta-legacy wave, `d7f-12`), `N3-EXCISION-LEDGER.md` (the
  dogfood wave, `d7f-13`), and `loop/P3-FOLD-MAP.md` (the CLAUDE.md-removal zero-loss
  fold-map, U.E7).
- **25 binding rulings** (`loop/PASS-1..5.md` + `SPEC-B1..B5` §R) — the terminal three:
  **ruling 23** (a terminal pass closes measured residue by CHARTER, never re-score),
  **24** (in-sweep-space ≠ disposed — every sweep hit disposed BY NAME), **25** (the
  arrival-check before every step-5 convene + direct verification as the default).
- **SPEC-B5 as the governing spec** (`loop/SPEC-B5.md` over the B1→B4 canonical chain; 16
  errata all measured) — its §E errata fold into the corpus: **E14** (D8/D9
  KEEP-with-disposition + D-GAP-5/D-GAP-6 booked to U.F), **E15** (value.js ships SEVEN
  subpaths, no `/root`), **E16** (`components.json` `git rm` at keystone step ① +
  sweep-as-measurement standing law).
- **Two constellation gap rows booked** — D-GAP-5 + D-GAP-6, joining D-GAP-1 as U.F's
  value.js letter rows (E14).

**The owner-ride queue — the ONLY thing between the corpus and impl authorization**
(discharges FIRST, before any owner-visible wave lands; carried verbatim per R17/E8):
1. `demo/DESIGN.md` **KEEP** — feeds U.G's codex promotion;
2. the **`@`-dissolution ONE-WORD CONFIRM** — gates keystone step ① (U.B1);
3. **D1 easing-curve canonicality** (`NAMED_EASING_BEZIER` — owner-taste, N3 ledger §3 D1);
4. **D5 oklab palette-sweep eyeball** (the D5 hue-sweep excision's visual sign-off, N3
   ledger §2 D5).

Impl remains **NOT authorized** until the owner discharges this queue (ring-fence 4).
