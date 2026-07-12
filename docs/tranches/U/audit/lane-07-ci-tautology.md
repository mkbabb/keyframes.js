# Lane 07 — CI / Gate-Tautology Audit (Tranche U)

**Charter:** cluster the ~227 `proof:*` gates by the INVARIANT they assert; find
(a) double-asserted invariants, (b) source-shape greps the compiler/tests already
guarantee, (c) gates locking now-permanent owner-era decisions, (d) vacuous-bite
gates. Propose the trimmed ≤60 roster. Owner: *"most of it's likely tautological."*

**Verdict headline:** the owner is right, and the number is worse than "most." Of
the 227 `proof:*` keys, **~40 carry genuine product-regression value**; the other
~187 are one of five tautology classes. The apparatus has become a *self-hosting
bureaucracy* — 27 of the gates exist only to police the other 200, and 58 gates are
hard-anchored to demo file paths that the U grand-restructure (edict #3) will
delete out from under them. The cure is not trimming — it is a **gestalt collapse**
to a property-organized invariant suite, deleting the born-RED / discharge / ledger
/ roster-ceiling scaffolding *wholesale*.

---

## The measured landscape (all read from the tree, `package.json` @ 5.2.0)

| Fact | Value | Source |
|---|---|---|
| distinct `proof:*` keys | **227** | `package.json` (node count) |
| `proof-*.mjs` scripts on disk | 209 | `ls scripts/proof-*.mjs` |
| declared roster **ceiling** | **120** | `gate-bands.mjs:595` `ROSTER_CEILING = 120` |
| ceiling status | **born-RED backlog** (227 > 120) | `proof-roster-ceiling.mjs:47`; `gate-bands.mjs:665` |
| `hygiene-chain` members | **133** (alone exceeds the whole ceiling) | `package.json:272` |
| `library-correctness` members | 37 | `package.json:269` |
| `demo-correctness` members | 26 | `package.json:270` |
| gates that run `node .mjs && vitest` (doubled) | **25** | `package.json` grep |
| appearance/geometry-ish demo gates | **77** | `package.json` grep |
| scripts hard-coding `demo/{scenes,@,app}/` paths | **58** | `grep -l scripts/proof-*.mjs` |
| scripts line-anchored to a `*Target.vue` | 15 | `grep -l` |
| self-policing meta-gates (gates about gates) | **27** | enumerated below |
| `FROZEN_SET` (demo-appearance ossified set) | 51 | `gate-bands.mjs:27-97` |
| parse-that as a direct dep | **absent** (verified) | `package.json` deps = `@mkbabb/value.js` only |

parse-that is confirmed NOT a direct dependency (charter verify item discharged —
kf's only runtime dep is `@mkbabb/value.js`, reached by the HEAVY surface).

---

## The five tautology classes

### CLASS 1 — the self-policing meta-apparatus (27 gates; pure tautology)

A quarter of the roster asserts nothing about the *product*. It asserts that the
*gate roster obeys the gate process*. This is scaffolding for a tranche workflow,
not a regression net — every one of these greens says "the paperwork is filed," and
every one reds when you try to *simplify the paperwork* (which is exactly U's job).

- `proof:roster-ceiling` — reds because there are >120 gates (`proof-roster-ceiling.mjs:47`). A gate that reds *because too many gates exist*. It polices its own class.
- `proof:ci-coverage` — every `proof:*` must appear in `ci.yml` AND be reachable from `proof:all` (`proof-ci-coverage.mjs` CLAUSE 0/0b). It forces the bureaucracy to stay wired; deleting a gate must satisfy it.
- `proof:gate-is-runtime` — polices that demo-correctness gates open a browser (`proof-gate-is-runtime.mjs:1-30`). A gate about gate *implementation shape*.
- `proof:gate-authority` — polices that each appearance gate carries an `INSTRUMENT`/`OWNER` label in `gate-authority.mjs` (298 lines of hand-maintained label table). A gate about gate *metadata*.
- `proof:retirement-ledger` / `proof:chronic-closure` / `proof:peer-satisfied` / `proof:manifest-sourced` — police the FROZEN/DISCHARGE/born-RED-backlog registers in `gate-bands.mjs`. They exist to make *deleting a gate* a gated, witnessed, ledgered act.
- `proof:owner-verdict-recorded`, `proof:owner-review-gate`, `proof:board-live`, `proof:prompt-recap-t`, `proof:wave-charter`, `proof:record-truth`, `proof:report-all` — police that tranche paperwork (verdicts, board, prompt recaps, wave charters) exists and is current. Product regression value: zero.
- `proof:pin-ledger-current`, `proof:repin-witness`, `proof:published-on-master`, `proof:deploy-roundtrip`, `proof:changelog`, `proof:readme-runs`, `proof:readme-paths-live`, `proof:claude-paths-live` — police docs/pins/deploy provenance.

**Evidence of the self-reference loop:** `proof-roster-ceiling.mjs:40-43` imports
`FROZEN_SET, DISCHARGE, ROSTER_CEILING` from `gate-bands.mjs`; `gate-bands.mjs:99-392`
is a 293-line hand-maintained DISCHARGE ledger whose *only consumer* is
`proof:ci-coverage` clause 9 + `proof:retirement-ledger`. The ledger exists to
witness gate deletions; the gates exist to be ledgered. It is a closed loop with no
product edge.

**Gestalt cure:** delete the entire meta-apparatus. The born-RED / FROZEN /
DISCHARGE / RETIREMENT_LEDGER / ROSTER_CEILING / T_BORNRED_BACKLOG machinery
(`gate-bands.mjs` in its entirety, plus the 27 policing scripts) is a *tranche
process artifact*. A trimmed roster of ~40 gates needs no ceiling, no discharge
ledger, and no coverage-of-coverage gate — CI simply runs the 40. Provenance
concerns (changelog, published surface, deploy) collapse to `release.yml` steps,
not standing `proof:*` gates.

### CLASS 2 — demo-appearance/geometry locks anchored to soon-deleted paths (77 gates)

Edict #3 is a *grand recursive colocation restructure of the entire demo*. 58 gate
scripts hard-code `demo/{scenes,@,app}/…` paths and 15 are anchored to specific
`*Target.vue` line numbers. Every one of these breaks — or worse, *silently passes
against a moved file* — the instant the restructure lands.

- `proof-scene-card-rounded.mjs:6-9` anchors `EasingTarget.vue:4`, `SpringTarget.vue:4`, `StartingStyleTarget.vue:9`, `SpringScene.vue:8`, `EasingSidebar.vue:2`.
- `proof-card-rounded-primitive.mjs:6-9` anchors `SequenceTarget.vue:3`, `MotionPathTarget.vue:3` (the latter file is *already pruned* per OD-1 — the gate's own witness in `gate-bands.mjs:541` says so, yet the anchor lingers in the header).

These gates encode the *pixel geometry of a specific demo layout*: rounded corners,
subgrid labels, timeline-rail width, single-column pack, dock z-order, hero focal
placement, cartoon shadow clipping, drawer spring, panel naked rail. They are a
photograph of one composition. The composition is about to be rewritten from
scratch. A geometry grep cannot survive its subject's rewrite, and re-authoring 77
of them against the new layout is exactly the "no quick fixes, gestalt approach"
anti-pattern the owner forbade.

**Gestalt cure:** retire the entire line-anchored demo-geometry family concurrent
with the restructure. Replace *all 77* with the ONE oracle that already exists and
is authority-correct — `proof:owner-golden` (the owner-blessed perceptual reference,
`gate-authority.mjs:208-214`) — plus a *single* behavioral `demo-smoke` that asserts
each scene mounts, plays, and switches without throwing. Taste is an owner-golden
question; "does the demo work" is a smoke question. Neither is 77 greps.

### CLASS 3 — the `node .mjs && vitest` source-grep doublings (25 gates)

25 gates run a `.mjs` *source-grep* AND a `vitest` *value test*. The value test is
the real oracle; the source-grep is a historical "born-RED witness" that asserts a
cure *already landed* by grepping for the fixed code shape.

- `proof:composition-honored` (`package.json:100`) = `proof-composition-honored.mjs` (greps `engine.ts` for a `resolved.composition` read, `:9-27`) **&&** `test/engine/composition-honored.test.ts` (proves the SUM math, the accumulate, rAF↔WAAPI parity). The test is dispositive; the grep asserts *the implementation is written a particular way*, which `tsc` + the passing test already guarantee. The grep reds on a *refactor that preserves behavior* — a false positive by construction.
- Same shape: `proof:blend`, `proof:spring-blend-weight`, `proof:drawsvg`, `proof:finished`, `proof:adopt-compiled`, `proof:interpolate-anything`, `proof:roundtrip-fidelity`, `proof:ingest-replay`, `proof:scroll-roundtrip`, `proof:diagnostics-channel`, `proof:nan-frame`, `proof:grammar-fuzz`, `proof:agent-validate`, `proof:color-fidelity`, `proof:platform-adopt`, `proof:orbital-rotate3d`, `proof:compile-replay`, `proof:replay-equality`, `proof:interp-fastprops`, `proof:scene-control-dfa`, `proof:no-shadow-playback-authority`, `proof:emerging-css-resolve` (×3 mjs + ×3 test), `proof:morph` (×3 mjs + test).

**Gestalt cure:** drop the source-grep halves; keep the vitest tests as the oracle.
The invariant is the *behavior*, not the *code shape that produced it* — the whole
point of the value test is that it survives refactors the grep cannot. This alone
removes ~25 scripts and folds their keys into the plain vitest run.

### CLASS 4 — one-time owner-era excisions now permanent (the REGRESSION_GUARDS band + kin, ~16 gates)

`gate-bands.mjs:404-419` bands 10 "keep-a-deleted-thing-deleted" greps; another ~6
sit outside the band. Each locks a *single historical excision* that is now a
settled, permanent fact — the textbook (c) case: verify once, then retire.

- `proof:no-deprecated-guard` (`proof-no-deprecated-guard.mjs:3-11`) — polices that `router.ts` no longer calls vue-router 4's `next(value)`. vue-router 5 is the floor; the callback signature *cannot* return. A `tsc` error, not a standing gate.
- `proof:alias-dropped` (`proof-alias-dropped.mjs:3-11`) — polices that the 5.0.0 rename dropped `Animation`/`ScrollTimeline` aliases. A breaking major shipped >2 tranches ago. Re-introducing the alias is a *new deliberate export*, caught by `proof:published-surface` anyway.
- `proof:no-cross-realm-cast`, `proof:no-foreign-symbol-stamp`, `proof:no-dup-utility`, `proof:no-brittle-selector`, `proof:no-single-option-select`, `proof:no-silent-fallback`, `proof:no-hand-rolled-cursor-tracker`, `proof:workaround-deletion`, `proof:no-dead-export`, `proof:no-dead-dependency`, `proof:any-ceiling`, `proof:no-collision-rename`, `proof:no-flat-siblings`.

These are 16 bespoke Node scripts implementing what is, structurally, *lint rules*.
Each re-implements comment-blanking + regex sweeps by hand (e.g.
`proof-no-deprecated-guard.mjs` "comment-BLANKS the file then matches `next(`").

**Gestalt cure:** fold the whole band into the existing lint pass (`proof:lint-clean`
already runs — `package.json:235`) as a handful of `no-restricted-syntax` /
custom-rule entries. One lint config replaces 16 hand-rolled AST-by-regex scripts.
The no-legacy edict is enforced by the linter, which is where "no legacy code"
belongs — not by 16 standing `proof:*` keys.

### CLASS 5 — vacuous / self-contradicting bite (the (d) bucket)

Gates whose bite is empty on the real tree, or that the authors themselves document
as vacuous:

- **Self-documented vacuity:** `proof-styling-idioms.mjs:24-31` states plainly: *"clause (a) does NOT bite born-RED today — it REDUCES to a born-GREEN REGRESSION GUARD."* A gate that admits it never fires.
- **Documented contradiction:** `proof-no-dup-utility.mjs:19-24` states `proof:idioms`' `.scale-on-hover\b` grep is *"loose … which a DELETION COMMENT satisfies — the vacuous pass §11 flagged: the two gates are in direct contradiction."* One gate exists to correct another gate's vacuous bite — both should be one rule.
- **FROZEN-by-declaration:** `gate-bands.mjs:27-97` freezes 51 demo-appearance gates as a *"RED-authorized ossifying set … discharged LATER (S.G1/S.D3, the demo rewrite)."* U **is** that demo rewrite. Their declared discharge trigger has arrived; they should all discharge now, not persist as frozen reds.

---

## Cluster map → trimmed roster

Clustering the 227 keys by asserted invariant yields ~10 families. The trimmed
target keeps the *value oracle* of each and deletes the witnesses/greps/meta around it.

| Invariant family | Now | Keep | Cure |
|---|---|---|---|
| Library value (interp/compile/blend/roundtrip/spring/color/soa) | ~37 | **~16** | keep vitest oracles; drop the 25 `.mjs` grep halves (CLASS 3); fold the roundtrip family (`compile-replay`/`replay-equality`/`roundtrip-fidelity`/`roundtrip-easing`/`entry`/`vt`/`trigger`/`scroll`/`ingest`) into 2 property tests |
| Boundary / published surface | ~10 | **2** | `proof:boundary` + `proof:published-surface`; fold `engine-subpath-mirror`, `dts-rollups-agree`, `no-any-default`, `alias-dropped`, `in-is-importable`, `demo-on-published-surface`, `agent-surface` into them (all re-read the built d.ts / exports — one invariant asserted 8×) |
| Zone / decomposition / colocation | ~8 | **2** | `proof:no-orphan-module` (real import-graph walk) + ONE colocation gate re-authored for the U structure; drop `no-flat-siblings`/`zone-cohesion`/`decomposition`/`no-nested-self-dependency` (tsc + graph already cover) |
| No-legacy / regression greps | ~16 | **0 standing** | fold into `proof:lint-clean` (CLASS 4) |
| Demo appearance / geometry | ~77 | **2** | `proof:owner-golden` + one behavioral `demo-smoke` (CLASS 2) |
| Demo behavioral (subject renders/plays) | ~26 | **~5** | `subject-animates`, `easing-gallery`, `drag-gesture`, `spring-slider-continuous`, one scene-switch smoke |
| Performance (grand edict) | ~12 | **~5** | `perf-counters`, `scene-perf-budget`, `portable-perf`, `bench-taxonomy`, `interp-fastprops`; drop `epf1-measure`/`perf-frame-budget` OBSERVE duplicates |
| Constellation / consume-edge | ~11 | **2** | `proof:deps-current` + `proof:consume-bundle`; the rest are pin/repin/ledger provenance → `release.yml` |
| Self-policing meta | 27 | **0** | delete (CLASS 1) |
| Lint / hygiene | ~3 | **2** | `proof:lint-clean` + `proof:no-silent-fallback`-as-lint |

**Trimmed roster ≈ 36 gates** (comfortably ≤60), each a *product-property invariant*
asserted once at the surface a consumer/owner actually uses.

---

## The gestalt transposition (not a trim — a re-architecture)

The roster grew to 227 because the tranche process *made every wave author a
born-RED gate as its deliverable*, then built a second layer (the 27 meta-gates + the
`gate-bands.mjs` ledger) to manage the first layer, then a third (`roster-ceiling`,
`T_BORNRED_BACKLOG`) to declare the resulting overflow "backlog, not mask." That is
three layers of scaffolding around ~40 real invariants.

The transposition U should charter:

1. **Gates are organized by PRODUCT PROPERTY, not by tranche wave.** A gate answers
   "does the library interpolate correctly / does the surface stay honest / does the
   demo work / is it fast" — not "did wave T.C7 land." Wave-coupled gates are process
   telemetry and belong in `docs/`, not `package.json`.
2. **One invariant, one gate.** The boundary invariant is asserted by 8 gates; the
   "demo looks right" invariant by 77. Collapse each to one.
3. **The value test is the oracle; delete the source-grep witness.** A grep that reds
   on a behavior-preserving refactor is anti-gestalt.
4. **No-legacy is a linter's job.** 16 hand-rolled excision-greps → lint rules.
5. **Delete the born-RED / FROZEN / DISCHARGE / ROSTER_CEILING machinery entirely.**
   With ~40 gates there is nothing to ration, witness, or ceiling. CI runs the 40.

---

## What U must charter

- **Delete the 27-gate self-policing meta-apparatus** (`roster-ceiling`, `ci-coverage`, `gate-is-runtime`, `gate-authority`, `retirement-ledger`, `chronic-closure`, `peer-satisfied`, `manifest-sourced`, `board-live`, `prompt-recap-t`, `wave-charter`, `record-truth`, `report-all`, `owner-verdict-recorded`, `owner-review-gate`, `repin-witness`, `pin-ledger-current`, `published-on-master`, `deploy-roundtrip`, `changelog`, `readme-*`, `claude-paths-live`) plus `scripts/gate-bands.mjs` in full — they are process scaffolding, not regression nets.
- **Retire all 77 line-anchored demo-appearance/geometry gates concurrent with the grand restructure**; replace with `proof:owner-golden` + one behavioral `demo-smoke`. Geometry greps cannot survive the composition rewrite that edict #3 mandates.
- **Discharge the entire 51-member FROZEN_SET now** — its own declared discharge trigger ("the demo rewrite, S.G1/S.D3") is U.
- **Collapse the 25 `node .mjs && vitest` doublings to the vitest oracle alone** — the grep halves red on behavior-preserving refactors.
- **Fold the ~16 no-legacy/regression-guard greps into `proof:lint-clean`** as lint rules; the no-legacy edict belongs to the linter.
- **Collapse the ~10-gate boundary/surface cluster to `proof:boundary` + `proof:published-surface`** (one invariant currently asserted 8×).
- **Delete the `ROSTER_CEILING` / `T_BORNRED_BACKLOG` / born-RED-backlog mechanism** once the roster is trimmed — a ~40-gate roster needs no ceiling.
- **Author the ≤60 (target ~36) product-property invariant roster, banded by PRODUCT PROPERTY not tranche-wave**, each asserted once at the consumer/owner surface.
