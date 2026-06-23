# Q.WA1 — the SLIM lint-tier: the source-graph boundary floor (the 3-tranche O-Band-A carry, terminated)

**Band:** A — Apparatus.
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization.
**Sequence (the DAG edge):** `Q.W0 (record-hygiene + charter substrate) ─► Q.WA1` (this wave — land
the lint-tier the O-Band-A carry M.W2→O.W1→P.W1 named but NEVER built across four tranches) `─► [feeds
every Band-B/E/F wave that touches src/animation/ — the static source-graph floor they edit above]`.
Q.WA1 is parallel to Q.WA2/Q.WA3/Q.WA4 within Band A (no inter-dependency); it lands FIRST among the
apparatus waves only in the sense that the source-graph floor should exist before the engine-split
(Q.WF1) lifts a module across the LIGHT/HEAVY seam.
**Owning-DM-or-idea:** the **B2-pw1-lint-pw10-leaves** lane's primary survivor — P.W1 S1 the lint-tier,
"UNBUILT across four tranches" (`AUDIT-31.md` B2-pw1: "eslint/dependency-cruiser not even installed"),
KILLED-DOWN to its load-bearing half per the lane's measure-first verdict.

This wave is the **apparatus floor**, not a strategy change: it builds the static source-graph boundary
guard and ships ZERO engine code. It TERMINATES the 3-tranche O-Band-A lint carry (M.W2 developed →
O.W1 scoped → P.W1 re-scoped → all unbuilt) as a BUILD-IN — not a 4th ride.

---

## §Context — the breach, the carry, the KILL-DOWN

**The carry.** The eslint/dep-cruiser lint-tier has been named in three consecutive charters and built
in none. Verified live (`AUDIT-31.md` B2-pw1, P.W1 S1):
- `ls .eslintrc* eslint.config.* .dependency-cruiser*` → NO matches (confirmed this session — `ls`
  errors with "no matches found").
- `package.json` has no eslint/dependency-cruiser devDep, no `lint` script; `check` is `tsc --noEmit`
  ONLY (`package.json:35`, confirmed).
- The LIGHT/HEAVY boundary IS gated — by `proof:boundary` (a bespoke bundle-graph script, GREEN today,
  `AUDIT-31.md` B1-deploy-ci STRENGTH). But that is the **bundle** stage — late. The SOURCE-graph
  invariants (no circular import; no `internal/` leaf importing the engine or `@mkbabb/value.js`; no
  LIGHT module statically reaching `./engine`) have NO static lint floor — a circular import or a
  value.js-pulling leaf passes `tsc --noEmit` silently and is caught only at the bundle stage, or not
  at all.

**The KILL-DOWN (the measure-first verdict — the lane's load-bearing finding).** The B2-pw1 lane ran
the smell-test over the P.W1 spec and found eslint **redundant** for kf's invariant set
(`AUDIT-31.md` B2-pw1 CONTRIVANCE-RISK): "P.W1 S1 as specced wants BOTH eslint (`import/no-cycle` +
`no-restricted-imports`) AND dep-cruiser (3 boundary rules) — TWO new toolchains … for invariants that
`proof:boundary` (the per-entry isValueJs graph filter) + `tsc --strict` + `prettier-organize-imports`
largely already own." The verdict: **install dependency-cruiser ONLY** — it is the single tool that
expresses ALL THREE source-graph invariants the carry actually needs (no-cycle + no-restricted-paths +
the LIGHT-boundary), in ONE config, with ONE invocation. eslint would add a second toolchain, a second
config, a second CI step, for rules `tsc --strict` (correctness) + `prettier-organize-imports` (import
hygiene) already cover. KISS + no-contrivance: the SLIM tier is dep-cruiser alone.

> **Spec-vs-audit reconciliation (the lane's friction #4, addressed up front).** `Q.md §2`'s Band-A
> line and `P.W1 S1` name `eslint.config.mjs` with `import/no-cycle` + `no-restricted-imports`. The
> **audit's measure-first verdict overrides the charter's verbatim toolchain**: the THREE NAMED
> INVARIANTS (no-cycle, no-restricted-imports-as-boundary, the LIGHT-graph guard) are PRESERVED EXACTLY
> — they are simply expressed in dependency-cruiser's `forbidden` rules instead of eslint's, because
> dep-cruiser is the gestalt single-seam for source-GRAPH rules (eslint's `import/no-cycle` is a
> graph-walk dep-cruiser does natively; `no-restricted-imports` IS dep-cruiser's `pathNot`). This is
> NOT a deferral of any invariant; it is the elegant transposition the no-contrivance precept mandates.
> Q.WA4's `proof:wave-charter` smell-test (the 7-question gate) blesses this KILL-DOWN as grounded
> (a measured redundancy, not a manufactured scope cut).

---

## §Scope — the S-clauses

### S1 — install dependency-cruiser + author `.dependency-cruiser.cjs` with the three source-graph rules

**Breach.** No source-graph lint floor exists (S1 of B2-pw1). The three architectural-boundary
invariants are caught only at the bundle stage or not at all.

**Cure.** Add `dependency-cruiser` (the ONLY new devDep) to `package.json`. Author
`.dependency-cruiser.cjs` with exactly three `forbidden` rules over `src/`:
- **`no-cycle`** — no circular dependency anywhere in `src/animation/` (dep-cruiser's native
  `circular: true` — replaces eslint `import/no-cycle`).
- **`leaf-no-engine-no-valuejs`** — modules under `src/animation/internal/` may NOT import `../engine`
  nor `@mkbabb/value.js` (the value.js-free-leaf law; the S8 WeakMap + the leaves.ts duplicates both
  live here, so the rule guards the realm seam). `from: {path: 'src/animation/internal'}` ×
  `to: {pathNot: ...}` forbidding the engine + the value.js specifier.
- **`light-barrel-no-engine`** — the LIGHT named-export modules (`numeric`, `smooth`, `spring`,
  `stagger`, `flip`, `drag`, `drag-2d`, `decay`, `sequence`, `timeline`, `playback`, `morph`, `easing`,
  `springLinearStops`, `springTimingFunction`, and `index.ts`'s static-export set) may NOT statically
  reach `./engine` (a STATIC pre-flight of what `proof:boundary` bundle-verifies — the SAME invariant,
  one tier earlier). This is `no-restricted-imports` expressed as a `pathNot` boundary.

### S2 — wire `lint` into the gate roster + `proof:hygiene`

**Breach.** A config + tool are inert until wired; `check` stays `tsc --noEmit` only.
**Cure.** Add `"lint": "depcruise src"` to `package.json` scripts; author `proof:lint-clean` (NEW —
`scripts/proof-lint-clean.mjs`: asserts `.dependency-cruiser.cjs` exists + `npm run lint` exits 0 on
the clean tree) and wire it into `proof:hygiene` (it is a static source-graph gate, HARD on any runner
— a circular import is a circular import everywhere). Update `scripts/proof-ci-coverage.mjs` so
`proof:lint-clean` is aggregator-reachable (no silent EXCLUDED — the ci-coverage discipline). Add the
`lint` step to ci.yml's fast library `gates` job (device-independent, sub-second — belongs in the
10m library job, not the 50m demo-smoke job; Q.WA3 owns the F-7 static-gate placement discipline).

### S3 — no eslint, no duplicate-of-`proof:boundary` semantic (the SLIM constraint)

**Breach (avoided).** A naive re-read of the P.W1 spec would re-add eslint (a second toolchain) or
write a dep-cruiser rule that DUPLICATES a `proof:*` gate semantic (re-implementing the boundary check).
**Cure.** The lint-tier is a STATIC pre-flight that AGREES with `proof:boundary` (the bundle-graph
runtime authority) — it does NOT replace it. No rule duplicates a `proof:*` gate's semantic; the lint
floor catches the violation at edit time, the bundle gate confirms it at build time. eslint is NOT
installed (the KILL-DOWN). `tsc --strict` keeps owning correctness; `prettier-organize-imports` keeps
owning import ordering — the SLIM tier adds ONLY the source-graph invariants neither covers.

---

## §Born-RED gate — `proof:lint-clean` (over the REAL observable, inv-observable-truth)

**Gate name:** `proof:lint-clean` (NEW — `scripts/proof-lint-clean.mjs`, ~40 LOC, AXIS-3 STATIC). Wired
to `npm run proof:lint-clean` + into `proof:hygiene`.

**The REAL observable it bites (NOT a proxy):** the genuine defect is *a circular import or a
boundary-violating source edge that passes `tsc --noEmit` silently and reaches the bundle stage (or
ships) unguarded*. The gate does not grep for the string "no-cycle" in a config (a stub could fake
that) — it RUNS `depcruise src` and asserts exit 0 on the clean tree, AND it plants a real violation
and asserts the rule BITES.

**What it asserts (three clauses):**

**(a) The config exists + the clean tree lints clean.**
```
assert ls .dependency-cruiser.cjs            → exits 0
assert (npm run lint)                        → exits 0   # depcruise src over the clean src/ tree
```
BITE: reds if the config is absent (the gate cannot run) — the 3-tranche carry is unbuilt.

**(b) PLANT-A-FAILURE — a circular import reds the no-cycle rule.**
```
# the gate's self-test fixture: a temp module pair src/__lint_fixture__/{a,b}.ts importing each other
# (or a no-op grep-proof in-script) → depcruise MUST exit non-zero on the cycle, proving the rule lives
plant: internal/leaves.ts imports ../engine   → depcruise reds (leaf-no-engine-no-valuejs)
plant: a LIGHT module imports ./engine        → depcruise reds (light-barrel-no-engine)
```
BITE: reds (i.e. the gate FAILS its self-test, which is the born-RED proof) if a planted circular
import or a planted leaf→engine edge passes silently — the rule is genuinely missing, not redundant
with `tsc`. *Today, on the pre-cure tree, `tsc --noEmit` GREENS a planted circular import (no
source-graph floor), which is the live demonstration the floor is absent.*

**(c) The gate is aggregator-reachable (no dead gate).**
```
proof:ci-coverage clause: proof:lint-clean reachable from proof:hygiene  → must hold
```
BITE: reds if the gate is authored-but-unwired (a dead gate) — `proof:ci-coverage` reds.

**Witness input that REDs on today's tree (pre-cure):**
- Clause (a): `ls .dependency-cruiser.cjs` → non-zero exit (NO matches, confirmed) → **RED**.
- Clause (b): `npm run lint` does not exist; planting `internal/leaves.ts → ../engine` and running
  `tsc --noEmit` GREENS it (no source-graph lint floor) → the floor is provably absent → **RED**.
- Clause (c): the gate does not exist → cannot be wired → reds the moment it is authored-but-unwired.

This is a GENUINE born-RED on the real observable: the absent config + the silently-passing planted
violation — never a source grep a stub could green.

**Greens on the cure:** `dependency-cruiser` installed + `.dependency-cruiser.cjs` authored with the
three rules + `npm run lint` exits 0 on the clean tree + the planted circular/boundary violations RED
the relevant rule + `proof:lint-clean` wired into `proof:hygiene` + `proof:ci-coverage` green.

**Implementation locus:** `.dependency-cruiser.cjs` (NEW config), `scripts/proof-lint-clean.mjs` (NEW
gate), `package.json` (`dependency-cruiser` devDep + `lint` script + `proof:lint-clean` in
`proof:hygiene`), `.github/workflows/ci.yml` (the `lint` step in the fast library `gates` job).

---

## §Dependencies

- **`proof:boundary` — already shipped + GREEN** (`AUDIT-31.md` B1-deploy-ci STRENGTH). Q.WA1's lint
  floor AGREES with it (a static pre-flight of the same LIGHT/HEAVY invariant); it does NOT re-implement
  the bundle-graph oracle. Independent of every sibling publish — pure NOW.
- **Q.W0 (record-hygiene + charter) — leads.** Q.WA1 reads the charter's Band-A scope + the
  `AUDIT-31.md` B2-pw1 KILL-DOWN verdict. No dependency between Q.WA1 and the other Band-A waves.
- **Feeds Q.WF1 (engine.ts split) + every Band-B/E/F src/animation/ edit.** The engine-split lifts a
  module across the LIGHT/HEAVY seam; the source-graph floor should exist first so a mis-placed edge in
  the split reds at edit time, not at bundle. The leaves.ts externalization (Band E) edits `internal/`
  — the `leaf-no-engine-no-valuejs` rule guards it.
- **NO eslint dependency** (the KILL-DOWN — eslint is NOT installed). **NO glass-ui / value.js /
  parse-that publish dep.** Pure-NOW apparatus.

---

## §dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WA1 — DOCS ONLY. It writes zero engine/demo/library
source (inv-16). The IMPLEMENTATION (the `dependency-cruiser` install, the `.dependency-cruiser.cjs`
config, the `proof-lint-clean.mjs` gate, the CI wiring) opens only on the owner's explicit
authorization. When it opens it is gate-first (`proof:lint-clean` authored born-RED BEFORE the config
lands), observable-truth (the gate runs `depcruise` + bites a planted circular/boundary violation,
never greps a config string), no-legacy (eslint is NOT added — the SLIM tier is the single source-graph
seam; the rules AGREE with `proof:boundary`, never duplicate it), KISS (ONE new toolchain, ONE config,
ONE invocation, three rules), gestalt (dep-cruiser owns ALL source-GRAPH rules; `tsc --strict` owns
correctness; `prettier-organize-imports` owns ordering — one tool per concern), and P-invariant-28
(the M.W2→O.W1→P.W1 lint carry TERMINATES here as a BUILD-IN — not a 4th ride).

---

## §Mid-tranche-friction pre-emption

**Friction this wave could spawn:** killing eslint (keeping only dep-cruiser) departs from the P.W1
spec text (which mandates `eslint.config.mjs`). If the Q board treats the spec as authoritative, a
reviewer could re-add eslint mid-tranche, re-opening the redundant second-toolchain the KILL-DOWN
closed (`AUDIT-31.md` B2-pw1 friction #4). **PRE-EMPT:** the spec-vs-audit reconciliation is recorded
IN THIS WAVE (the §Context note) AND blessed by Q.WA4's `proof:wave-charter` 7-question smell-test as a
grounded measure-first redundancy — the KILL-DOWN is on the record as deliberate, not an oversight, so
no reviewer re-litigates it mid-tranche.

**Second friction:** the `light-barrel-no-engine` rule enumerates the LIGHT named-export modules; if a
future wave adds a NEW LIGHT export, the rule's `from` set goes stale and a new LIGHT module could
silently reach the engine. **PRE-EMPT:** the rule is authored to match the LIGHT set BY PATH-PATTERN
(every `src/animation/*.ts` that is NOT in the HEAVY set `engine|animate|motion-path|draw-svg|group|
adapter|animations|frame-compiler|format|waapi|constants|utils`), so a new LIGHT leaf is covered by
construction; the HEAVY exclusion list is the single point of update, and `proof:boundary` (the bundle
oracle) is the backstop that catches any path-pattern drift.
