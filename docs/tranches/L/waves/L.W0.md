# L.W0 — Audit-fold + path forward

**Phase:** DEV (now; the ONLY phase — L.W0 authors artifacts, writes no engine/demo source) ·
**Class:** INFRASTRUCTURE (the charter substrate + evidence base every Band-A wave rides) ·
**Leads the tranche** — the born-RED gate (`proof:audit-artifacts`) and the deploy
re-observation must both close before L.W1 opens. inv-16 holds throughout: no kf source is
authored here.

---

## §Context — why this wave, what audit evidence it folds

K closed **DEPLOYED 2026-06-16** — `4.3.0` live, master `9bbc227` green, CF Pages serving
`index-43okVJtx.js` (release.yml run `27640592021`; CI run `27655766822`; `L.md:10-11`). K's
close was honest: inv ε held, `proof:chronic-closure` GREEN on 44 rows, all ten ≥4-tranche
P-invariant-28 riders exited (`K/FINAL.md §4`). L is not K's residue — it is K's
**TOTALITY**: the round-trip the subset-K answered was the core animation grammar; L answers
whether it holds for the FULL parsed surface, whether the SOTA frontier is claimed honestly,
and whether the constellation dogfood loop can close.

The **36-lane deep audit** (`audit/audit-32-skeleton.txt` is the 31-lane skeleton file; the
5 completion lanes 32-36 are in `audit/completion-lanes-32-36.txt`) produced the evidence base:

- **129 wave candidates** (W1–W129), distilled to the 12-wave L charter
- **34 precept violations** (⚠1–⚠34), of which **five are structural replay-equality
  breaches** in the shipped 4.3.0 surface that silently pass every current gate:
  - ⚠31 `!important` silently dropped: `adapter.ts` `declsToVarMap` reads only
    `decl.name`/`decl.value`, drops `Declaration.important`; `format.ts` never emits it.
  - ⚠15 `@property` never backward-serialized: `engine.ts:1225/1349` builds
    `propertyRegistry` but neither `CSSKeyframesToString` nor `compileToCSS` calls
    value.js's existing `serializeStylesheetItem`.
  - ⚠16 per-stop `animation-composition` channel asymmetric: `format.ts:81-103`
    `declaredKeyframeBody` emits per-stop easing but NOT per-stop composition —
    `fromString(per-stop add)→CSSKeyframesToString→reparse` loses the operator.
  - ⚠17 named keyframe selectors throw on ingest: `frame-compiler.ts:179-188` guards
    `SELECTOR_KEYWORD_RE`/`SELECTOR_PERCENT_RE` and throws `AnimationOptionError` on
    `entry`/`exit`/`cover`/`contain` — exactly what value.js's `namedKeyframeSelector`
    parser produces.
  - ⚠28/⚠29 multi-color silent-lossy ship: `compile-color.ts:190` returns `null` (no
    densify, no refusal) for `colorKeys.length > 1` — the verbatim sRGB block ships with
    `eligible:true`, measured ΔE=0.82 vs kf's oklab playback, while a single-color drift at
    the same ΔE HARD-REFUSES (`compile.ts:329-340`). The honest-refusal invariant is
    violated at `compile-color.ts:188-190`.
- **CROSS-REPO-ASK findings** — three workarounds living at the kf consume seam that the
  no-workaround precept indicts:
  - ⚠18/⚠20 `FN_NAME` Symbol side-channel (`utils.ts:45-57`) + linear() regex normalize
    (`utils.ts:193-196`): kf stamps private state onto a published class and carries the
    fix for a value.js serialize/parse asymmetry (VJ-L2 pending).
  - ⚠24 direct `@mkbabb/parse-that` production dep (`utils.ts:1` `import { any as
    parseAny }`) solely for the `any` combinator over value.js's parsers — a consume-seam
    intrusion (W94/W88).
  - ⚠1/⚠7 `:aria-orientation="undefined"` suppress at `SpringSidebar.vue:43` patches one
    of two affected pill strips, leaving `AnimationControls.vue:66` emitting the same
    invalid attribute fleet-wide — an incomplete consume-side band-aid.
- **5 completion lanes** (`audit/completion-lanes-32-36.txt`) confirming the systematic
  under-coverage of the gate corpus against the L work (Lane 33: ALL FIVE replay-equality
  breaches silently pass — `proof:replay-equality` does not exist; `proof:compile-replay`
  and `proof:color-fidelity` miss the multi-color and scroll-driven cases; the round-trip
  gates are source-shape, not input-enumerating).
- **KILL anti-charter re-confirmed** (12, non-re-litigable — `audit-32-skeleton.txt` ✗
  entries; `L.md §KILL`). No KILL item is revisited here.
- **CHRONIC-FOLD findings** — five surviving riders (`audit-32-skeleton.txt` ♾ entries):
  DL-K9 RF-17 (glass-ui handoff), DL-K7 GlassControlPoint (gate-first BOOK), oklab float
  drift (~1e-13, gated value.js handoff), EPF-1 read/write phase separation (BOOK,
  tripwire un-fired). None re-BOOKED here (P-invariant-28).

The **K substrate** L.W0 rides: `proof:cold-entry` GREEN (the engine starts on first
gesture), `proof:compile-replay` GREEN (the structural/easing/computed-unit axes hold),
`proof:ingest-replay` GREEN (12/12 K.W8 arms), `proof:scroll-roundtrip` GREEN (K.W9
ScrollScene), `proof:composition-honored` GREEN (K.W7 composition), `proof:color-fidelity`
GREEN (single-color midpoint ΔE). These are the floor L inherits — L.W0 does not re-certify
them, it verifies the DEPLOYED build shows the live-audit findings (F1–F6 from
`K/waves/K.W0.md §Folds F1–F6`) are closed on the live origin.

---

## §Scope — the S-clauses (each a concrete falsifiable deliverable)

### S1 — 36-lane audit on disk (the charter evidence base, re-runnable)

**Deliverable:** the `docs/tranches/L/audit/` directory holds the complete 36-lane evidence
base — the 32-skeleton (`audit-32-skeleton.txt`, already on disk), the 5 completion lanes
(`completion-lanes-32-36.txt`, already on disk), and the L charter (`L.md`, already on disk).
All three are committed and diff-stable.

**Falsifiable:** `ls docs/tranches/L/audit/audit-32-skeleton.txt docs/tranches/L/audit/completion-lanes-32-36.txt docs/tranches/L/L.md` exits 0; a
`wc -l` over each file matches the authored totals (no silent truncation). The `proof:audit-artifacts` gate (S7 below) asserts this.

**Regression it catches:** a future wave that strips or overwrites the audit evidence base
loses the traceability the no-workaround precept's enforcement relies on. Every ⚠ finding
has a file:line anchor; the gate asserts those anchors are stable.

### S2 — L charter: two bands, 12-wave map, invariant set, KILL anti-charter

**Deliverable:** `docs/tranches/L/L.md` committed at `tranche-j-dev` tip (this branch,
`4f1fc4c` parent). The charter names `inv-L-totality` (replay-equality TOTAL or
`CompileRefusal`, never silent-drop), `inv-L-acyclic-purity` (no consume-side
sibling-patch), `inv-L-device-honesty` (the gate-suite law). The 12-wave DAG is anchored in
`L.md §wave map`. The 12-KILL anti-charter is non-re-litigable.

**Falsifiable:** `grep -c "inv-L-totality\|inv-L-acyclic-purity\|inv-L-device-honesty" docs/tranches/L/L.md` ≥ 3; `grep -c "KILL" docs/tranches/L/L.md` ≥ 12.

### S3 — Deferred ledger (the K OUT/HANDOFF items as Band-B gated consume-edges)

**Deliverable:** the K HANDOFF items carried into L are named in `L.md §deferred fold`:
DL-K9 RF-17 (glass-ui BB handoff → L.W9), DL-K7 GlassControlPoint (gate-first BOOK →
L.W9), FB-3 MorphSVG (value.js VJ.W4 remainder → L.W9), PT-2 packrat (id,offset re-key →
L.W9/PT-WAVE-6). Each carries a named tripwire in `L.md`. None is re-BOOKed here
(P-invariant-28 — these are Band-B gated edges, not L.W0 obligations).

**Falsifiable:** `grep -c "DL-K9\|DL-K7\|FB-3\|PT-2" docs/tranches/L/L.md` ≥ 4 (the
ledger entries are present and named, not silently dropped from the charter).

### S4 — Prompt-recap ledger (A→K zero-drops confirmed, L session opens)

**Deliverable:** `docs/tranches/L/audit/prompt-recap-L.md` committed — confirming the A→K
prompt-ledger finding from `audit-32-skeleton.txt` Lane 14 ("The consolidated A→K prompt
ledger has zero drops") and opening the L session row. The recap's first L row is this W0
(date: 2026-06-16; subject: audit-fold + path forward; outcome: charter + evidence base on
disk + deploy re-observation).

**Falsifiable:** `ls docs/tranches/L/audit/prompt-recap-L.md` exits 0; the file's first
session row references `L.W0`.

### S5 — Three cross-repo dispatch docs (Band-B gated consume-edges dispatched)

**Deliverable:** three dispatch documents authored under `docs/tranches/L/`:

- `KF-TO-GLASSUI-BB-ASKS.md` — the glass-ui BB tranche asks for L: (1) SegmentedTabs
  pill-variant aria-orientation fix (⚠1/⚠7 — `SpringSidebar.vue:43` + the fleet-wide
  `AnimationControls.vue:66` second instance; W24/W50); (2) RF-17 click-strand retirement
  / W-DOCK-MORPH-FAMILY (W18/W43; DL-K9 handoff → the ⚠5 consume-side `pointerHandled`
  interim); (3) glass-ui peer-cycle fix (⚠8 — `^0.10.0||^0.11.0` does not admit value.js
  0.13.0, live ELSPROBLEMS today; W-PEER-SPINE). Each ask states the exact born-RED kf-side
  gate that fires on consume (workaround-deletion gate — see S7/born-RED below).

- `KF-TO-VALUEJS-O-ASKS.md` — the value.js Tranche O asks: (1) `parseCSSSubValue` to drop
  kf's direct parse-that dep (W94/⚠24); (2) `linear()` fix + `linearStopsToCSS` (W87/⚠19/⚠20
  — the `utils.ts:193-196` normalize regex); (3) `FN_NAME` → first-class `FlatLeaf` /
  `flattenDeclaration` (W86/⚠18); (4) comma-list declaration grammar (W74/⚠13); (5)
  `color()` replay-equal (W71/⚠ implied); (6) transform axis fix (W72/⚠12); (7) `@property`
  syntax (W73/W103). Each ask names the kf-side born-RED workaround-deletion gate it unblocks.

- `KF-TO-PARSE-THAT-ASKS.md` — the parse-that asks: (1) packrat soundness (id,offset re-key,
  W93/PT-WAVE-6/PT-2 ledger tripwire); (2) typesVersions surgery (W91/⚠21); (3)
  `permutation` combinator (W105). The packrat ask carries its gate-first BOOK reference
  (PT-2; the born-RED kf-side gate fires when parse-that 0.9.x publishes the fix).

**Falsifiable:** `ls docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md` exits 0; each file contains at least one `born-RED` reference (the consume-edge gate name is named, not omitted).

**Regression it catches:** if the dispatch docs are missing, Band-B waves (L.W9) have no
single-document ground-truth for the cross-repo asks — the workaround-deletion gates have no
named cure-surface, and the consume-edge discipline (inv-L-acyclic-purity) is unchartable.

### S6 — Deploy round-trip re-observation (K close clause (c), now GREEN)

**Deliverable:** the K-pending deploy round-trip (named-and-pending in `K/FINAL.md:107` as
the "user-domain cut leg") is re-observed at the L.W0 open and recorded here:

- CI run `27655766822` (master `9bbc227`) GREEN → `deploy-pages.yml` auto-fires
  (`workflow_run`-on-`push`) → CF Pages (`keyframes.babb.dev`) serves `index-43okVJtx.js`
  (confirmed — `L.md:11`).
- **Live-audit F1–F6 verified on the deployed build** (`K/waves/K.W0.md §Folds F1–F6`):
  - F1 (cold engine-never-starts) → CLOSED by K.W0 `239da4a`; live: hero rainbow-play
    starts the engine on first click, `proof:cold-entry` GREEN.
  - F2 (B1 greens on idle CSS bob) → CLOSED by K.W0 S6 clause (c); live: B1
    de-vacuoused, `.idle-hover` excluded, engine-write channel asserted.
  - F3 (no gate drives cold hero CTA) → CLOSED by K.W0 S6 clause (a); live:
    `proof:cold-entry` drives `localStorage.clear()` → hero CTA.
  - F4 (`proof:subject-animates` synthetic-only) → CLOSED by K.W0 S6 clause (d); live:
    gate extended to real scenes.
  - F5 (amiga engine-started oracle absent) → CLOSED by K.W0 S6 clause (b)/(e) +
    `proof:amiga-subject-is-pivot`; live: amiga group-adapter engine-write confirmed.
  - F6 (CHOREO cube near-static, SUSPECTED) → CLOSED by K.W0 S6 design decision (the
    `--ball-p`/slider advance is the load-bearing assert, not the bare transform count);
    live: the slider/aria pair is the oracle, not the element count — F6 is settled as a
    sub-threshold window, not a write defect.

**All six live-audit findings from K.W0 are GREEN on the deployed build.** This observation
closes K's K.WZ clause (c) (`K/FINAL.md:107` "Until the user fires the cut, this leg is
named-and-pending") and is recorded here as the L tranche's opening oracle.

**Falsifiable:** the deploy observation cites the CI run id (`27655766822`), the served
chunk hash (`index-43okVJtx.js`), and the live-origin cold-front-door verification
(engine animates on first gesture at keyframes.babb.dev on master `9bbc227`). All three
are reproducible: re-run CI on `9bbc227`, re-observe the deploy, re-verify the cold front
door.

### S7 — born-RED gate: `proof:audit-artifacts` (the L.W0 hard gate)

See §Born-RED gate below (standalone section per the tranche discipline).

---

## §Born-RED gate — `proof:audit-artifacts`

**Gate name:** `proof:audit-artifacts` (NEW — does not exist today; wired to
`npm run proof:audit-artifacts` + added to `proof:hygiene` roster in `package.json`).

**What it asserts (four clauses, each independently falsifiable):**

**(a) Audit evidence base on disk.**
```
assert ls docs/tranches/L/audit/audit-32-skeleton.txt → exits 0
assert wc -l < 300 (lower-bound 200 lines — the skeleton has 297)
assert ls docs/tranches/L/audit/completion-lanes-32-36.txt → exits 0
assert wc -l < 90 (lower-bound 80 lines)
assert ls docs/tranches/L/L.md → exits 0
```
BITE: reds if any of the three audit artifacts is deleted or silently truncated below the
line-count floor (a future wave cannot strip the evidence base without breaking CI).

**(b) Charter invariants named.**
```
grep -c "inv-L-totality" docs/tranches/L/L.md ≥ 1
grep -c "inv-L-acyclic-purity" docs/tranches/L/L.md ≥ 1
grep -c "inv-L-device-honesty" docs/tranches/L/L.md ≥ 1
grep -c "KILL" docs/tranches/L/L.md ≥ 12
```
BITE: reds if the charter is edited to drop the three L-specific invariants or any of the 12
KILLs — the anti-charter is non-re-litigable, so its removal from the charter doc is a gate
failure.

**(c) Cross-repo dispatch docs present and contain born-RED references.**
```
assert ls docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md → exits 0
assert ls docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md → exits 0
assert ls docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md → exits 0
grep -c "born-RED\|workaround-deletion" docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md ≥ 1
grep -c "born-RED\|workaround-deletion" docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md ≥ 1
grep -c "born-RED\|workaround-deletion" docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md ≥ 1
```
BITE: reds if any dispatch doc is missing, or if the born-RED consume-gate discipline is
absent — inv-L-acyclic-purity requires every Band-B ask to carry a named consume-edge gate.

**(d) Deploy observation recorded (the K close clause (c) oracle).**
```
grep -c "27655766822" docs/tranches/L/waves/L.W0.md ≥ 1
grep -c "index-43okVJtx" docs/tranches/L/waves/L.W0.md ≥ 1
grep -c "9bbc227" docs/tranches/L/waves/L.W0.md ≥ 1
```
BITE: reds if the deploy observation is not recorded in this wave spec — the deploy re-observation is a non-omittable oracle for the tranche opening.

**Witness input that REDs on today's tree (pre-cure):**

Today's tree (`tranche-j-dev`, `4f1fc4c`): `docs/tranches/L/waves/` is an empty directory
(confirmed: `ls docs/tranches/L/waves/` produces no output). Therefore:
- Clause (a): `ls docs/tranches/L/waves/L.W0.md` → non-zero exit → **RED** (the wave spec
  itself does not exist yet).
- Clause (c): `ls docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md` → non-zero exit → **RED**
  (the dispatch docs do not exist yet).
- Clauses (b) and (d) piggyback on clause (a)'s RED (L.md exists, audit exists — clauses
  (b) pass already; but clause (d) reds because L.W0.md is absent).

**Greens on the cure:** committing L.W0.md (this file) + the three dispatch docs + the
prompt-recap-L.md closes all four clauses → the gate exits 0.

**Implementation locus:** `scripts/proof-audit-artifacts.mjs` (NEW script, ~40 LOC) — a
pure node shell-script that runs the `ls`/`grep`/`wc -l` assertions above and exits
non-zero on any failure. No playwright, no browser, no DOM — this is a repo-structure gate.
Add to `package.json` under `proof:audit-artifacts` and prepend to the `proof:hygiene`
chain.

---

## §Deps

**No sibling publish gate.** L.W0 is entirely kf-repo-internal (charter docs + a node
script). The three dispatch docs are DISPATCH (they describe asks to siblings) — they do not
consume anything; the siblings are not required to have published. Band-B waves (L.W9) open
only after the relevant sibling publishes.

**Prerequisite (already met):** master `9bbc227` green → CF Pages deployed → live serves
`index-43okVJtx.js`. This is the K close oracle; L.W0 records it, not re-derives it.

**Consumed by L.W1+:** the `proof:audit-artifacts` gate is in the `proof:hygiene` chain,
which `proof:all` runs — every subsequent wave's CI run exercises clause (d) and confirms
this wave's record is undisturbed. L.W1 also reads the five breach file:line anchors
(`adapter.ts` `declsToVarMap`, `engine.ts:1225`, `format.ts:81-103`, `frame-compiler.ts:179-188`,
`compile-color.ts:188-190`) to construct its born-RED `proof:replay-equality` fixture set.

---

## §Bite — what each clause gate catches

| Clause | Regression it catches |
|---|---|
| (a) audit evidence base | A future wave strips the audit files; the evidence base for ⚠1–⚠34 is lost; workaround-deletion gates lose their file:line anchors. |
| (b) charter invariants | A future wave edits L.md to drop `inv-L-totality` or a KILL entry without going through the established non-re-litigable discipline. |
| (c) dispatch docs + born-RED | Band-B consume-edges are authored without a named born-RED gate, violating inv-L-acyclic-purity (the dispatch becomes a BOOK with no tripwire — P-invariant-28 risk). |
| (d) deploy observation | The K close clause (c) ("the deploy round-trip to be observed at the K cut") is never discharged; L opens on an un-verified deployed build — the inv ε guarantee for the K close would be overclaimed. |

The four clauses jointly enforce the gate-first / born-RED discipline at the TRANCHE OPEN
level: no L Band-A wave can open until the charter substrate + deploy oracle are both on
disk and the gate passes. This is the L equivalent of K.W0's `proof:cold-entry` lead-gate
function — it is what makes the born-RED discipline checkable at the tranche level, not just
the wave level.
