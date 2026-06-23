# Q.WA2 — the drag2D LIGHT public-primitive certification (the DemoControlPoint enabler)

**Band:** A — Apparatus.
**Phase:** NOW — kf-internal, zero sibling dependency, executable on authorization.
**Sequence (the DAG edge):** `Q.W0 (charter substrate) ─► Q.WA2` (this wave — CERTIFY drag2D as a
supported LIGHT public primitive + correct the stale `proof:control-point-live` "needs drag2D" premise)
`─► Q.WC1 (DemoControlPoint build-in over LIGHT drag2D) ─► Q.WC2 (easing curve-editor dogfood)`.
Q.WA2 is the demo-fleet enabler edge: the `Q.md §3` DAG draws `Q.WA2 drag2D LIGHT export ─► Q.WC1
DemoControlPoint ─► Q.WC2 easing-editor dogfood`. Without the *certified, documented, gate-locked*
LIGHT primitive, Q.WC1 either reaches into HEAVY (a boundary breach) or stalls.
**Owning-DM-or-idea:** the **B2-pw7-democontrolpoint** lane's INVERSION finding — "the enabling wave
the lane brief worried about (the drag2D LIGHT export) is ALREADY SHIPPED and gate-proven (index.ts:88,
proof:drag-gesture S4)" (`AUDIT-31.md` B2-pw7) — and the stale-gate cluster (`proof:control-point-live`
asserts a dead glass-ui `GlassControlPoint` premise).

This wave is the **apparatus certification**, not a new feature: `drag2D` already EXISTS on the LIGHT
barrel — Q.WA2 makes that fact *supported, documented, and gate-locked* so Q.WC1 can build the
DemoControlPoint on a published, boundary-clean contract, AND it retires the stale gate that mis-blocks
the chain. It ships ZERO engine code.

---

## §Context — the breach is NOT what the charter premise assumed (the inversion)

**The charter premise is STALE — verified live.** `Q.md §2`'s Band-A line asks Q.WA2 to "verify
drag-2d.ts exists + is NOT yet on index.ts LIGHT surface." The first half holds; the second is FALSE on
today's tree:
- `src/animation/drag-2d.ts` EXISTS (`drag2D` at :59, `Drag2DHandle` at :22 — confirmed this session).
- `drag2D` IS ALREADY a LIGHT barrel export: `src/animation/index.ts:88` reads
  `export { drag, Draggable, drag2D } from "./drag";` and `:93` exports the `Drag2DHandle` type
  (confirmed). The re-export chain is `drag-2d.ts → drag.ts:462 (export { drag2D, type Drag2DHandle }
  from "./drag-2d") → index.ts:88` — drag2D rides the barrel through `drag.ts` (drag-2d.ts:12–13
  documents exactly this). The LIGHT comment block (index.ts:78–83) covers it: "drag … carries zero
  static value.js edge … ride SpringProgress."
- It is GATE-COVERED: `scripts/proof-drag-gesture.mjs` S4 (`AUDIT-31.md` B2-pw7) imports `drag2D` off
  the LIGHT compiled barrel `dist/keyframes.js`, constructs a 2-D drag, and asserts `handle.value.y ≈ 120`
  (confirmed — proof-drag-gesture.mjs:47–67, :529 `const { Draggable, drag2D } = mod`). This gate was
  born-RED on the pre-L.W5 tree (`drag2D undefined` on the barrel) and is GREEN today.

So the **enabling wave the lane brief worried about is already done** (`AUDIT-31.md` B2-pw7 LANE-BRIEF
INVERSION). The honest Q.WA2 is NOT "add the export" — that would be a no-op or, worse, a second
re-export path (a no-legacy violation). The genuine gaps, per the lane:

1. **drag2D is an UNDOCUMENTED LIGHT public primitive.** It is exported and gate-tested, but it is not
   declared in `CLAUDE.md`'s LIGHT-surface list (the package barrel doc, `keyframes.js/CLAUDE.md`
   "LIGHT (static named exports)") nor named in `proof:published-surface`'s declared LIGHT set as a
   *supported* primitive. A consumer (Q.WC1's DemoControlPoint) building against it has no documented
   contract that it stays LIGHT/boundary-clean — only an incidental re-export. The certification makes
   it a *committed* public surface.
2. **`proof:control-point-live` is dead legacy with a FALSE "needs drag2D" premise.** The gate
   (`scripts/proof-control-point-live.mjs`) asserts a glass-ui `GlassControlPoint` component that
   `grep GlassControlPoint node_modules/@mkbabb/glass-ui/dist/` → ZERO (the premise was KILLED by glass-ui
   BC — `AUDIT-31.md` B2-pw7 NO-LEGACY VIOLATION; confirmed: the gate header is "DL-K7 GlassControlPoint
   tripwire … born-RED until glass-ui BB ships it" — a component BC decided never to ship). O.W5 was
   chartered to RETIRE it; the retire never landed. This stale gate is the thing that *appears* to block
   the DemoControlPoint chain on a drag2D-export-that-already-exists. Q.WA2 retires it.

**Why this is a wave, not a no-op.** The DemoControlPoint chain (DM-2, the NINTH carry — the worst
P-inv-28 violation in the constellation, `Q.md §"deceptive-ledger"`) is the highest-stakes Band-C
build-in. It must rest on a *certified, documented, gate-locked* LIGHT primitive with the stale
mis-blocking gate retired — not on an incidental re-export beside a dead gate that lies about the
blocker. Q.WA2 certifies the substrate so Q.WC1 cannot stall on a false premise.

---

## §Scope — the S-clauses

### S1 — CERTIFY drag2D as a supported LIGHT public primitive (the documentation contract)

**Breach.** `drag2D`/`Drag2DHandle` are exported (index.ts:88,93) and gate-tested (proof:drag-gesture
S4) but UNDOCUMENTED as a *supported* LIGHT primitive — they appear in no LIGHT-surface doc list.

**Cure.** Add `drag2D` + `Drag2DHandle` to the LIGHT static-export roster in `keyframes.js/CLAUDE.md`
(the "LIGHT (static named exports, value.js-free)" list) AND to `src/animation/CLAUDE.md`'s orchestration-tier
note (drag2D is "two one-axis Draggables composed behind a 2-D handle"). NO source re-export change —
the export already exists; the certification is the DOC + the gate lock (S3). drag2D is hereby a
COMMITTED public surface, not an incidental re-export.

**Falsifiable.** `grep -c "drag2D" keyframes.js/CLAUDE.md` ≥ 1 (in the LIGHT list);
`grep -c "drag2D" src/animation/CLAUDE.md` ≥ 1.

### S2 — RETIRE the stale `proof:control-point-live` gate (the dead glass-ui premise)

**Breach.** `proof:control-point-live` asserts a glass-ui `GlassControlPoint` (`grep … node_modules/
@mkbabb/glass-ui/dist/` → ZERO — KILLED by BC); O.W5 was chartered to retire it and did not. It is the
gate that *appears* to block the DemoControlPoint chain on a phantom premise.

**Cure.** DELETE `scripts/proof-control-point-live.mjs` + its `package.json` entry + its CI step. The
DemoControlPoint live-behavior assertion moves to Q.WC1's NEW `proof:demo-control-point` (an
appearance/interaction-axis gate over the kf-built DemoControlPoint.vue, NOT a glass-ui import probe) —
Q.WA2 retires the legacy gate; Q.WC1 authors the replacement. Update `scripts/proof-ci-coverage.mjs` so
the deleted gate is no longer enumerated (no orphan reference).

**Falsifiable.** `ls scripts/proof-control-point-live.mjs` → non-zero exit (deleted);
`grep -c "control-point-live" package.json` == 0; `proof:ci-coverage` does not reference it.

### S3 — LOCK the LIGHT/boundary contract on drag2D (the gate that makes the certification load-bearing)

**Breach.** Nothing asserts drag2D STAYS a LIGHT, value.js-free, boundary-clean export — a future
refactor could route `drag-2d.ts` through a HEAVY module (e.g. pull `SpringProgress`'s engine cousin)
and silently breach the boundary the DemoControlPoint relies on.

**Cure.** Extend `proof:published-surface` (the declared-surface gate) with a clause naming `drag2D` +
`Drag2DHandle` in the SUPPORTED LIGHT export set, and extend `proof:boundary` (or assert via its
existing per-entry isValueJs filter) that the `drag-2d.ts` static graph carries ZERO value.js edge
(it imports only `Draggable` + types — drag.ts:458 documents "LIGHT: drag-2d.ts imports only Draggable").
This is the gate that makes Q.WC1's build-against-drag2D safe: a boundary regression on the primitive
reds at the kf gate, not in the demo.

**Falsifiable.** `proof:published-surface` asserts `drag2D`/`Drag2DHandle` in the LIGHT set;
`proof:boundary` shows the drag-2d entry bundles with zero static value.js edge.

---

## §Born-RED gate — `proof:drag2d-light-certified` (over the REAL observable, inv-observable-truth)

**Gate name:** `proof:drag2d-light-certified` (NEW — `scripts/proof-drag2d-light-certified.mjs`, ~50
LOC, AXIS-3 STATIC + a barrel-import probe; wired into `proof:hygiene`). It SUBSUMES the certification
discipline; the live 2-D drag behavior stays asserted by the existing `proof:drag-gesture` S4 (GREEN —
not re-implemented here).

**The REAL observable it bites (NOT a proxy):** the genuine defect is *the DemoControlPoint chain
building against an UN-certified, UN-documented, UN-locked drag2D, beside a stale gate that lies about
the blocker* — so a boundary regression on the primitive, or a re-introduction of the dead glass-ui
premise, slips silently. The gate asserts (a) the LIGHT certification is documented + locked, (b) the
stale gate is gone, (c) drag2D is genuinely importable + value.js-free off the compiled barrel — each
the genuine observable, not a grep of intent.

**What it asserts (four clauses):**

**(a) drag2D is documented as a supported LIGHT primitive (S1).**
```
grep -c "drag2D"  keyframes.js/CLAUDE.md           >= 1   # in the LIGHT static-export list
grep -c "drag2D"  src/animation/CLAUDE.md          >= 1
```
BITE: reds if the certification doc is missing — the primitive is an incidental re-export with no
committed contract.

**(b) The stale `proof:control-point-live` gate is RETIRED (S2).**
```
assert ls scripts/proof-control-point-live.mjs     → non-zero exit   # deleted
grep -c "control-point-live"  package.json         == 0
grep -c "GlassControlPoint"   scripts/             == 0              # no orphan dead-premise reference
```
BITE: reds if the dead glass-ui gate survives — the false "needs drag2D" premise still mis-blocks the
chain, and the no-legacy precept is violated.

**(c) drag2D is genuinely importable + value.js-free off the compiled LIGHT barrel (S3).**
```
import { drag2D } from dist/keyframes.js     → drag2D is a function (NOT undefined)
proof:boundary: the drag-2d static graph has 0 value.js edges
proof:published-surface: drag2D + Drag2DHandle are in the declared LIGHT export set
```
BITE: reds if a refactor routes drag2D through a HEAVY/value.js path — the boundary regression the
DemoControlPoint relies on NOT happening.

**(d) The live 2-D drag still works (delegated, not re-implemented).**
```
proof:drag-gesture S4 (existing, GREEN): a 2-D drag yields handle.value.y ≈ 120
```
This clause is asserted by the EXISTING gate — Q.WA2 does not re-implement it; it confirms the behavior
oracle is still wired (no regression introduced by the certification edits).

**Witness input that REDs on today's tree (pre-cure):**
- Clause (a): `grep "drag2D" keyframes.js/CLAUDE.md` → 0 (drag2D is NOT in the LIGHT doc list today) →
  **RED**.
- Clause (b): `ls scripts/proof-control-point-live.mjs` → exits 0 (the dead gate STILL EXISTS,
  confirmed) → **RED**.
- Clause (c): drag2D IS importable today (GREEN already) — but `proof:published-surface` does NOT yet
  name it as a SUPPORTED LIGHT export (confirmed: `grep drag2D scripts/proof-published-surface.mjs` →
  0) → the *certification* clause reds.

This is a GENUINE born-RED on the real observable: the un-documented primitive + the surviving dead
gate + the un-locked surface — NOT a proxy. *Critically, the gate does NOT re-assert "add the export"
(it already exists); it asserts the certification + the retire + the lock — the actual Q.WA2 work.*

**Greens on the cure:** drag2D documented in both CLAUDE.md LIGHT lists (S1) + `proof:control-point-live`
deleted with no orphan reference (S2) + drag2D named in `proof:published-surface`'s LIGHT set + the
drag-2d boundary clause GREEN (S3) + `proof:drag-gesture` S4 still GREEN (d).

**Implementation locus:** `keyframes.js/CLAUDE.md` + `src/animation/CLAUDE.md` (the doc certification),
`scripts/proof-control-point-live.mjs` (DELETE) + `package.json` (remove its entry) + `ci.yml` (remove
its step), `scripts/proof-published-surface.mjs` (the LIGHT-set clause), `scripts/proof-drag2d-light-certified.mjs`
(NEW gate). NO `src/animation/index.ts` / `drag.ts` / `drag-2d.ts` change (the export already exists —
re-touching it would create a second re-export path, a no-legacy violation).

---

## §Dependencies

- **drag2D LIGHT export — ALREADY SHIPPED + gate-proven** (index.ts:88, `proof:drag-gesture` S4 GREEN,
  `AUDIT-31.md` B2-pw7). Q.WA2 CERTIFIES + LOCKS it; it does NOT add it. Pure-NOW.
- **glass-ui — NO dependency.** Q.WA2 RETIRES the glass-ui `GlassControlPoint` premise (a DELETE, not a
  consume); it does not wait on any glass-ui publish. (The DM-2 chain is kf-owned over the LIGHT drag2D
  primitive — `Q.md §"DM-2"` — explicitly NOT over a glass-ui component.)
- **Q.W0 (charter) — leads.** Q.WA2 reads the `AUDIT-31.md` B2-pw7 inversion verdict + the stale-gate
  finding. No dependency on the other Band-A waves.
- **Feeds Q.WC1 (DemoControlPoint) + Q.WC2 (easing-editor dogfood).** Q.WC1 builds DemoControlPoint.vue
  over the now-certified LIGHT drag2D + authors the NEW `proof:demo-control-point` (the appearance/
  interaction-axis gate that REPLACES the retired `proof:control-point-live`). Q.WA2 is the published
  contract Q.WC1 imports.

---

## §dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WA2 — DOCS ONLY. It writes zero engine/demo/library
source (inv-16). The IMPLEMENTATION (the CLAUDE.md certifications, the `proof:control-point-live`
deletion, the `proof:published-surface` LIGHT-set clause, the `proof-drag2d-light-certified.mjs` gate)
opens only on the owner's explicit authorization. When it opens it is gate-first (the certification
gate authored born-RED BEFORE the doc edits), observable-truth (the gate imports drag2D off the real
compiled barrel + asserts the dead gate is gone, never greps intent), no-legacy (the dead
`proof:control-point-live` gate is DELETED, not annotated; NO second re-export path is added — the
existing index.ts:88 export is the single seam), KISS (a doc + a delete + a lock-clause — no new export
machinery), gestalt (drag2D is one published LIGHT primitive with one re-export chain
drag-2d→drag→index), and P-invariant-28 (this UN-BLOCKS the DM-2 NINTH-carry chain by certifying the
substrate Q.WC1 terminates on — `proof:boundary` must stay GREEN throughout, the `Q.md §3` invariant).

---

## §Mid-tranche-friction pre-emption

**Friction this wave could spawn:** a Q author trusting the charter's "is NOT yet on index.ts LIGHT
surface" premise verbatim would author an ADD-THE-EXPORT change — a no-op at best, a SECOND re-export
path at worst (a no-legacy violation that `proof:published-surface` would then have to disambiguate
mid-tranche). **PRE-EMPT:** this wave's §Context records the inversion (drag2D is ALREADY exported +
gate-proven) up front, and the born-RED gate asserts the CERTIFICATION + RETIRE + LOCK (the actual
work), NOT "add the export" — so the implementer cannot mistakenly re-add it; clause (c) confirms
drag2D is already importable, redirecting the work to documentation + the dead-gate retire.

**Second friction:** retiring `proof:control-point-live` could orphan its CI step or its
`proof:ci-coverage` enumeration, leaving a dangling reference that reds the coverage gate mid-tranche.
**PRE-EMPT:** S2 deletes the gate, its `package.json` entry, its CI step, AND updates
`scripts/proof-ci-coverage.mjs` atomically in ONE wave — the retire is complete, no orphan survives
(the same atomic-delete discipline the deletion-gate API-awareness precept mandates).

**Third friction:** Q.WC1 (DemoControlPoint) DAG-blocks on this certification; if Q.WA2 slips, the
NINTH-carry build-in stalls. **PRE-EMPT:** Q.WA2 is a pure-NOW doc+delete+gate wave with zero sibling
dependency — it cannot be blocked by any external publish; the `Q.md §3` DAG places it directly
upstream of Q.WC1 with no intervening gate.
