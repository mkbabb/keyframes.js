# O.W0 — Audit-fold + ledger hygiene + path forward

**Phase:** NOW (DEV; the ONLY phase this wave touches — O.W0 authors artifacts + applies the
ledger-hygiene edit-spec, writes no engine/demo/library source) · **Class:** INFRASTRUCTURE
(the charter substrate + the 32-lane re-audit digest every Band-A/B/C/D/E/F/G wave rides) ·
**Leads the tranche** — the born-RED gate (`proof:audit-artifacts-O`) and the dev→impl boundary
witness must both close before O.W1 / O.W2 (Band A) open. inv-16 holds throughout: NO kf source
is authored here. This is exactly the M.W0 dev→impl boundary, carried forward unchanged.

---

## §Context — why this wave, what audit evidence it folds

M **partially CLOSED** (M.W1 parallel runner, M.W8-Phase-1 lockfile, M.W9/S7 linear-stops delete,
M.W10 packrat-sound FOLD-FIX, M.W11 css-parity gate) — GREEN on `master` (`aef3ef3`), the library
gate passes, the manual deploy round-trip observed. That slice is genuine shipped work. But the
**bulk of M's developed waves were never implemented** (Band-A apparatus M.W2/W3/W4, Band-B
correctness M.W5/W6, Band-D transposition M.W12/W13, Band-E terminal-belt M.W14, M.W-DESIGN-PAINT,
M.W15, M.WZ close) — verified live 2026-06-19. Tranche O is therefore the **close-out tranche**:
it implements what M developed, **terminates the absolute chronics M.W14 named but never built**,
executes the architectural transpositions the owner mandates, dispatches the two genuinely-new
sibling asks the re-audit surfaced, consumes the glass-ui BC cut, and cuts 5.0.0.

O is chartered by the owner (2026-06-19): **re-audit (32 agents) the M plan as-built + all
changes; consider the value.js / parse-that / glass-ui-BC tranches; converge the constellation;
terminate the chronics; transpose to gestalt; cut 5.0.0 — holding NO quick solutions /
NO workarounds / idiomatic-gestalt / NO legacy / architectural-transpositions-for-elegance-
simplicity-performance / KISS / isomorphic.**

The audit ran as a **32-lane deep re-audit** (`docs/tranches/O/audit/AUDIT-DIGEST.md`, the
successor to M's 32-lane audit, ~4M tokens) that re-verified M's as-built tree against ground
truth and caught what M's PROGRESS.md ledger **structurally could not see** — the inv-ε payoff.
The five open frontiers it surfaced are the O premise (`O.md §1` — the M-as-built delta):

1. **The chronic terminals M.W14 named but never built.** `DM-2` GlassControlPoint (born E) and
   `DM-3` MorphSVG (born C) were both declared **"ABSOLUTE terminal at M — no 8th carry"** in the
   M ledger — yet **neither was built** (`fromMorphSVG` ABSENT; `DemoControlPoint` ABSENT, verified
   live). This is the forbidden 8th carry. O Band C builds both in (kf-owned, over a published
   substrate — value.js 1.0.2 `PathGeometry` + the LIGHT `Draggable`/`drag2D`). DM-2 (born E) /
   DM-3 (born C) · 7 carries through M · O closes the forbidden 8th carry via BUILD-IN.

2. **The transpositions + no-legacy purge are owed.** `engine.ts` is still **1397 lines** (target
   ~900 — the god-object un-split); the deprecated `Animation` / `ScrollTimeline` aliases ride the
   published surface; `internal/leaves.ts` duplicates `clamp`/`scale`/`lerp`/`lerpArray` that
   value.js 1.0.2's `./math` subpath now exports. The 5.0.0 major cut is the honest home.

3. **The consume-edge workaround family + the stale-gate dishonesty.** S1 aria-suppress, S2
   dock-pointer-interim, S8 `FN_NAME` Symbol sidechannel, S9 direct parse-that import — each
   retires on a root fix, but two of those root fixes (VJ-L1 flatLeaf, VJ-L3 parseCSSSubValue) are
   not yet shipped and one was misidentified (glass-ui still emits `aria-orientation` on `role=group`
   where ARIA forbids it). `proof:workaround-deletion` S1/S2 probe a phantom `glass-ui@4.1.0` never
   published (BB closed at 4.0.1; the cure is BC); `proof:control-point-live` asserts a
   `GlassControlPoint` BC decided never to ship.

4. **The ledger hygiene the M-RECONCILIATION §11 edit-spec named but never applied (DO-4).** The
   M-RECONCILIATION authored the targeted edits (DM-24 / DM-25 / DM-W1-bridge rows; DM-4 KILL→FIX;
   DM-17 RESOLVED-BY-KILL→RESOLVED-BY-FIX; DM-5 count) but the §11 edit-spec was DOCS-ONLY and was
   **never applied** to `deferred-ledger-M.md` or `PROGRESS.md §D`. O.W0 lands those edits in the
   O ledger (the DO-4 obligation, §S4 below).

5. **The 5.0.0 cut is owed.** The npm registry is frozen at **4.3.0** (Tranche K close); every
   feature since — the Oscillator, the constellation consume, the new gates, keyframes-vue — is
   local-only. O.WZ cuts 5.0.0 (the no-legacy renames are breaking).

**The M substrate O.W0 rides** (the floor O inherits — O.W0 does not re-certify it, it records the
deploy oracle live): master `aef3ef3` green → `deploy-pages.yml` auto-fires → CF Pages
(`keyframes.babb.dev`) serves the live bundle (re-observed live at this wave open). The M.W1
report-all runner + the three consume gates (`proof:css-parity`/`packrat-sound`/`consume-bundle`)
are GREEN. These stand; O.W0 records the deploy origin as the O tranche's opening oracle and
re-states the boundary.

**Why this is a wave, not a preamble.** O is an eight-band constellation-converge + close-out
tranche with a DAG whose Band-A leads (O.W1 lint, O.W2 ledger) unblock the correctness + chronic
bands. Before any cure is authored, the charter substrate (`O.md`), the 32-lane AUDIT-DIGEST, the
O chronic-ledger substrate (the `proof:chronic-closure` next parse-target), the prompt-recap
(zero-drops), and the deferred-fold ledger with a real terminal per item must ALL be on disk and
re-runnable — AND the dev→impl boundary must be checkable at the tranche level. That checkability
is the O.W0 deliverable, gated born-RED.

---

## §Scope — the S-clauses (each a concrete falsifiable deliverable)

### S1 — The 32-lane re-audit digest on disk (the charter ground truth, re-runnable)

**Deliverable:** `docs/tranches/O/audit/AUDIT-DIGEST.md` holds the complete 32-agent
constellation re-audit corpus (the successor to M's 32-lane audit), anchored to the verified
tree (`master` @ `aef3ef3` + the M consume tip) with `file:line` ground truth and re-run gate
exit codes. Every `O.md §1`/§2 born-RED witness and §2 cluster anchor cites this digest by lane
section + re-runnable `file:line`. The companion `audit/deferred-ledger-O.md` + `audit/prompt-recap-O.md`
stand beside it.

**Falsifiable:** `ls docs/tranches/O/audit/AUDIT-DIGEST.md` exits 0; the digest names the eight
bands + the two P-inv-28 ABSOLUTE chronics (DM-2 born-E, DM-3 born-C); every ⚠O finding
(`O.md §2 precept reckoning`) traces to a digest section anchor. `proof:audit-artifacts-O` (§S7)
asserts this.

**Regression it catches:** a future wave that strips or overwrites the audit digest loses the
`file:line` traceability the no-workaround precept's enforcement relies on. Every O cure cites a
digest anchor; the gate asserts the digest set is stable.

### S2 — The O charter: eight bands, the phase axis, the DAG, the precept reckoning

**Deliverable:** `docs/tranches/O/O.md` committed. The charter names the eight bands (`O.md §3`,
the phase-tagged wave map — O.W1/O.W2 lead Band A), the phase-ordered DAG, the precept reckoning
(`O.md §2` — the chronic carries / legacy / workarounds / stale-gate clusters, each digest-anchored
to its named O cure), the chronic-terminal mandate (`O.md §4` — no 8th carry), the sibling
dispatches (`O.md §5`), the 5.0.0 cut rationale (`O.md §6`), and the dev→impl boundary (`O.md §8`).

**Falsifiable:** `ls docs/tranches/O/O.md` exits 0; the charter names O.W0 through O.WZ in the
`§3` wave-map table; `O.md §4` names DM-2 (born E) / DM-3 (born C) with the "O closes the forbidden
8th carry via BUILD-IN" canonical phrasing; the DAG draws O.W8 feeding O.WZ and the
G.W16 → D.W7 → O.WZ value.js-P spine.

### S3 — The O chronic-ledger substrate (`proof:chronic-closure` O parse-target) authored

**Deliverable:** `docs/tranches/O/PROGRESS.md §"Open deferrals"` authored — the complete
item-by-item O deferred ledger (DM-1..DM-25), the direct successor to `M/PROGRESS.md §"Open
deferrals"`, built from the M `proof:chronic-closure` substrate. It names the **P-invariant-28
terminal register** — the items hitting their belt at O: DM-2 (born E) / DM-3 (born C) · 7 carries
through M · O.W5/O.W6 BUILD-IN closes the forbidden 8th carry; DM-1 RF-17 (5-tranche entering O —
I,J,K,L,M carried in-tree; O.W12 consumes on the BC cut); DM-5 S8/S9 (chronicity 3 entering O —
K,L,M; the P-inv-28 ≥4 belt fires at **kf-P** if value.js P slips).

**Falsifiable:** `ls docs/tranches/O/PROGRESS.md` exits 0; the file contains an `Open deferrals`
heading; `grep -c "DM-2\|DM-3" PROGRESS.md` ≥ 2 (the two ABSOLUTE-terminal chronics named, not
silently dropped); `grep -c "P-invariant-28\|P-inv-28" PROGRESS.md` ≥ 1. The ledger is the
`proof:chronic-closure` parse target O.WZ re-points M→O (the re-point itself is O.WZ's clause +
the `proof:chronic-closure` LEDGER re-point — M never performed the L→M→O re-point; O.W0 authors
the substrate it will parse).

### S4 — The DO-4 ledger-hygiene obligation: apply the M-RECONCILIATION §11 edit-spec

**Deliverable:** the M-RECONCILIATION §11 edit-spec (DOCS-ONLY, never applied to the M live
ledger) is LANDED in the O deferred ledger (`audit/deferred-ledger-O.md` + `PROGRESS.md §D`) as a
one-commit ledger-hygiene pass. The concrete edits (the DO-4 obligation, traced to
`O/PROGRESS.md` DO-4 row + `audit/AUDIT-DIGEST.md F26`):

- **DM-24 N-Stage HANDOFF row INSERTED** (NET-NEW — never inserted into `deferred-ledger-M.md`;
  added per M-RECONCILIATION §7). Born N (2026-06-18); chronicity 1 (N→O); HANDOFF (BC-gated).
  The N Stage impl exists on `n-stage-impl` (`SceneStage.vue` + `CarouselDisk.vue` + `StageArrows.vue`
  + composables/ + previews/), shelved by owner directive (`e2375b8`). CORRECTED TRIPWIRE: the
  glass-ui BC cut (not the BB `W-DOCK-MORPH-FAMILY` name). Owning wave **O.W15** (the N Stage
  unshelf, DM-24).
- **DM-25 consume-bundle row INSERTED** as **FOLD-LANDED** (NET-NEW — never inserted; added per
  M-RECONCILIATION §9). `proof:consume-bundle` GREEN on the live tree.
- **DM-W1-bridge row INSERTED** (verify-record: M.W1 runner IMPLEMENTED on `master`; the born-RED
  gate `proof:report-all` is ADDRESSED — `scripts/proof-report-all.mjs` EXISTS on master @ `5d047ac`
  with C1–C6 clauses, wired into `ci.yml`).
- **DM-4 KILL → FOLD-LANDED (FIX).** parse-that 0.11.0 A.W2 shipped the WDM `(id,offset)` composite
  key FIX; `proof:packrat-sound` GREEN; owner D4 verdict FIX, not KILL. The DM-4 KILL record is VOID.
- **DM-17 RESOLVED-BY-KILL → RESOLVED-BY-FIX.** DM-4 exited via FIX (D4 + parse-that A.W2); DM-17
  inherits the correction; gate GREEN.
- **DM-5 count corrected** from the M "0 GREEN / 5 PENDING" to **1 GREEN / 4 PENDING** (S7 FIRED —
  `linearStopsToCSS` regex retired on value.js 1.0.0 consume; S1, S2, S8, S9 remain PENDING).

**Falsifiable:** `grep -c "DM-24\|DM-25\|DM-W1-bridge" deferred-ledger-O.md` ≥ 3 (the three rows
the M §11 spec named are present); `grep -c "FOLD-LANDED.*FIX\|RESOLVED-BY-FIX" deferred-ledger-O.md`
≥ 2 (the DM-4/DM-17 corrections landed); `grep -c "1 GREEN / 4 PENDING" deferred-ledger-O.md` ≥ 1
(the DM-5 count corrected). This is a non-gate mechanism (one-commit ledger-hygiene) — the edits
ARE the deliverable; the gate (§S7 clause c) asserts they are on disk.

**Regression it catches:** if the M-RECONCILIATION §11 edit-spec is never applied (as it was not
on the M live ledger — the DO-4 finding), the O chronic ledger silently inherits the stale DM-4
KILL / DM-17 RESOLVED-BY-KILL / DM-5 "5 PENDING" framing, and the DM-24 N-Stage HANDOFF + DM-25
consume-bundle rows the campaign authored are lost. O.W0 lands them — the no-silent-drop oracle.

### S5 — The prompt-recap ledger (A→M zero-drops confirmed, O session opens)

**Deliverable:** `docs/tranches/O/audit/prompt-recap-O.md` committed — confirming the A→M
prompt-ledger zero-drops finding (chain-trusting `prompt-recap-M.md`) and opening the O session
row. Every distinct owner request across the campaign is dispositioned ADDRESSED (cite wave/commit)
/ HANDOFF (sibling-gated) / USER-DOMAIN (the 5.0.0 cut) / FOLD-INTO-O — **zero drops**. The
`proof:report-all` row is ADDRESSED (M.W1 runner + the gate both implemented — NOT "unauthored"
— `scripts/proof-report-all.mjs` EXISTS on master @ `5d047ac` with C1–C6 clauses + wired into
`ci.yml`). The recap's first O row is this W0 (date 2026-06-19; subject audit-fold + ledger
hygiene + path forward; outcome charter + 32-lane digest + ledger substrate + DO-4 §11 edits +
recap on disk + deploy re-observation).

**Falsifiable:** `ls docs/tranches/O/audit/prompt-recap-O.md` exits 0; its first O-session row
references `O.W0`; `grep -c "proof:report-all" prompt-recap-O.md` ≥ 1 and its disposition is
ADDRESSED (not PARTIALLY-ADDRESSED / unauthored).

### S6 — The deploy round-trip re-observation (the O opening oracle)

**Deliverable:** the M close deploy round-trip is re-observed live at the O.W0 open and recorded
here: master `aef3ef3` green → `deploy-pages.yml` (`workflow_run`-on-`push`) → CF Pages
(`keyframes.babb.dev`) serves the live bundle. The live origin was probed at this wave authoring.
This observation is the O tranche's opening oracle — the floor O converges above. The O deploy
re-observation on the 5.0.0 cut + the auto round-trip restoration is O.WZ's clause (gated on the
BC consume + the USER-DOMAIN publish).

**Falsifiable:** the deploy observation cites the served live origin (`keyframes.babb.dev`) + the
master commit (`aef3ef3`); both reproducible — `curl -s https://keyframes.babb.dev/` returns the
served bundle. The gate (§S7 clause e) asserts these are recorded in this file.

### S7 — born-RED gate: `proof:audit-artifacts-O` (the O.W0 hard gate)

See §Born-RED gate below (standalone per the tranche discipline). It tests the REAL observable per
inv-observable-truth: the actual on-disk artifact set + the dev→impl boundary witness + the deploy
oracle — not a proxy.

---

## §Born-RED gate — `proof:audit-artifacts-O` (over the REAL observable, inv-observable-truth)

**Gate name:** `proof:audit-artifacts-O` (NEW — does not exist today; wired to
`npm run proof:audit-artifacts-O` + prepended to the `proof:hygiene` roster in `package.json`).
A pure node repo-structure gate (`scripts/proof-audit-artifacts-O.mjs`, ~50 LOC) — no playwright,
no DOM. **AXIS-3 STATIC** (a source-shape/repo-structure invariant belongs in a sub-second static
rule, not a browser).

**The REAL observable it bites (NOT a proxy):** the genuine defect this gate catches is *the O
tranche opening on an absent/truncated charter substrate, or with the DO-4 §11 ledger-hygiene
edits un-applied, or with a kf source file authored in the DEV-phase wave* — i.e. the dev→impl
boundary breached. The M.W0 / L.W1 S4 lesson is the keystone warning: a gate that asserts a proxy
(no-throw + string round-trip) misses the real breach (NaN frame-times). Here the gate asserts the
ACTUAL artifact bytes on disk, the ACTUAL `git diff --stat` over `src/`/`demo/`, the ACTUAL §11
edits landed, and the ACTUAL served live origin — each the genuine observable, each independently
falsifiable.

**What it asserts (five clauses):**

**(a) The 32-lane digest + charter on disk (S1, S2).**
```
assert ls docs/tranches/O/audit/AUDIT-DIGEST.md  → exits 0
assert ls docs/tranches/O/O.md                   → exits 0
assert ls docs/tranches/O/waves/O.W0.md          → exits 0          # this file
grep -c "DM-2\|DM-3" docs/tranches/O/O.md        >= 1               # the two ABSOLUTE chronics named
```
BITE: reds if the digest or the charter/this wave spec is absent — the evidence base for the ⚠O
cluster cannot be stripped without breaking CI.

**(b) The eight bands + the chronic-terminal mandate named in the charter (S2).**
```
grep -c "born E"               docs/tranches/O/O.md  >= 1           # DM-2 chronicity (canonical)
grep -c "born C"               docs/tranches/O/O.md  >= 1           # DM-3 chronicity (canonical)
grep -c "forbidden 8th"        docs/tranches/O/O.md  >= 1           # the no-8th-carry phrasing
grep -c "BUILD-IN"             docs/tranches/O/O.md  >= 1
```
BITE: reds if the charter drops the canonical chronic-terminal phrasing — the no-8th-carry mandate
is non-re-litigable; its removal is a gate failure.

**(c) The ledger substrate + the DO-4 §11 edits + the recap present (S3, S4, S5).**
```
assert ls docs/tranches/O/PROGRESS.md                       → exits 0
grep -c "DM-2\|DM-3"                       PROGRESS.md        >= 1   # the ABSOLUTE-terminal items
grep -c "P-invariant-28\|P-inv-28"         PROGRESS.md        >= 1
assert ls docs/tranches/O/audit/deferred-ledger-O.md        → exits 0
grep -c "DM-24\|DM-25\|DM-W1-bridge"       deferred-ledger-O.md >= 3 # the §11 rows landed
grep -c "RESOLVED-BY-FIX"                  deferred-ledger-O.md >= 1 # DM-17 corrected
grep -c "1 GREEN / 4 PENDING"              deferred-ledger-O.md >= 1 # DM-5 count corrected
assert ls docs/tranches/O/audit/prompt-recap-O.md           → exits 0
grep -c "O.W0"                             prompt-recap-O.md  >= 1   # the O session opens
```
BITE: reds if the chronic-ledger substrate, the DO-4 §11 edit-spec landing, or the recap is missing
— the `proof:chronic-closure` O parse-target has no terminal substrate and the recap loses its
zero-drops anchor.

**(d) The dev→impl boundary witness — NO O source authored (inv-16, the boundary's REAL observable).**
```
assert (git diff --stat <O.W0-base>..HEAD -- src/ demo/) == EMPTY
# the DEV-phase wave touches docs/ + scripts/<the gate> ONLY; zero engine/demo/library source
```
BITE: reds if ANY file under `src/` or `demo/` is modified by this DEV-phase wave — this is the
dev→impl boundary made checkable at the tranche level. O.W1…O.WZ implementation opens ONLY on
explicit authorization (the M.W0 boundary, carried forward). This clause is the REAL observable of
inv-16 — not a comment claiming "docs only" but the actual diff.

**(e) The deploy oracle recorded (S6).**
```
grep -c "aef3ef3"            docs/tranches/O/waves/O.W0.md >= 1
grep -c "keyframes.babb.dev" docs/tranches/O/waves/O.W0.md >= 1
```
BITE: reds if the deploy oracle is not recorded in this wave spec — O would open on an un-verified
deployed build, overclaiming the inv-ε guarantee for the tranche opening.

**Witness input that REDs on today's tree (pre-cure):**

Today's tree (`master` consume tip): `docs/tranches/O/waves/O.W0.md` did not exist before this wave
(it is the BLOCKER — promised in the DAG + PROGRESS but had no file). Therefore on the pre-cure tree —
- Clause (a): `ls docs/tranches/O/waves/O.W0.md` → non-zero exit → **RED** (this wave spec did not
  exist — the missing-file blocker).
- Clause (c): `grep -c "DM-24\|DM-25\|DM-W1-bridge" deferred-ledger-O.md` / `RESOLVED-BY-FIX` /
  `1 GREEN / 4 PENDING` → the §11 edits un-landed → **RED** if the DO-4 hygiene pass has not run.
- Clauses (b), (d), (e) piggyback: (b) passes once `O.md` carries the canonical phrasing; (d)
  passes only while no source is touched; (e) reds because `O.W0.md` was absent.

This is a GENUINE born-RED on the real observable: the wave spec is the thing that does not exist
(the BLOCKER), not a proxy for it.

**Greens on the cure:** committing `O.W0.md` (this file) + the DO-4 §11 ledger-hygiene edits to
`deferred-ledger-O.md` + `PROGRESS.md §D` — with zero `src/`/`demo/` diff — closes all five clauses
→ the gate exits 0.

**Implementation locus:** `scripts/proof-audit-artifacts-O.mjs` (NEW node script). Add under
`proof:audit-artifacts-O` in `package.json` and prepend to the `proof:hygiene` chain — so every
subsequent O wave's CI run exercises clauses (a)/(d)/(e) and confirms this wave's record + the
dev→impl boundary are undisturbed.

---

## §Deps

**No sibling publish gate.** O.W0 is entirely kf-repo-internal (charter + ledger + recap + the
DO-4 §11 hygiene edits + one node gate script). The audit digest DESCRIBES asks to siblings — it
does not CONSUME anything; no sibling is required to have published. Band-F waves (O.W12…O.W15)
open only after glass-ui BC publishes; Band-G (O.W16) + D.W7 open on value.js P; O.W0 only leads
the spine.

**Prerequisite (already met):** master `aef3ef3` green → CF Pages deployed → live serves the
bundle (re-observed live at this wave open at `keyframes.babb.dev`). This is the M close oracle;
O.W0 records it, does not re-derive it.

**The standing M substrate O.W0 rides (verified, not re-certified):** the M.W1 report-all runner +
`proof:report-all` (`scripts/proof-report-all.mjs` on master @ `5d047ac`, C1–C6 clauses, wired into
`ci.yml`); the three consume gates GREEN (`proof:css-parity`/`packrat-sound`/`consume-bundle`); the
value.js 1.0.2 / parse-that 0.11.0 re-pin.

**Consumed by O.W1+:** `proof:audit-artifacts-O` enters the `proof:hygiene` chain (which `proof:all`
runs) — every later wave's CI run exercises clause (d) and re-confirms the dev→impl boundary held.
O.W1 (lint) + O.W2 (ledger re-point + stale-gate retarget) read this wave's charter + the digest
anchors. Band-B waves (O.W3/W4) read the digest's named-selector / densify breach anchors for their
born-RED `proof:replay-equality` / `proof:compile-replay` extensions. Band-C (O.W5/W6) read the
chronic-terminal mandate (§S3) for the BUILD-IN homes.

---

## §Bite — what each clause gate catches

| Clause | The REAL observable it bites (inv-observable-truth) |
|---|---|
| (a) digest + charter | A future wave strips/truncates the 32-lane digest; the `file:line` anchors for the ⚠O cluster are lost; the O cures lose their ground truth. |
| (b) bands + chronic-terminal mandate | A wave edits `O.md` to drop the DM-2 (born E) / DM-3 (born C) canonical phrasing or the "forbidden 8th carry / BUILD-IN" mandate without the non-re-litigable discipline. |
| (c) ledger + §11 edits + recap | The `proof:chronic-closure` O parse-target, the DO-4 §11 ledger-hygiene landing (DM-24/25/W1-bridge + DM-4/17/5 corrections), or the zero-drops recap anchor is absent. |
| (d) dev→impl boundary (inv-16) | ANY `src/`/`demo/` file is touched in the DEV-phase wave — the genuine boundary breach, caught on the actual `git diff`, not a "docs only" comment. O.W1+ implementation opens only on explicit authorization. |
| (e) deploy oracle | The M close deploy round-trip is never recorded; O opens on an un-verified deployed build; the inv-ε guarantee for the tranche opening is overclaimed. |

The five clauses jointly enforce the gate-first / born-RED discipline at the **TRANCHE OPEN** level:
no O Band-A wave (O.W1 / O.W2 included) can open until the charter substrate + the chronic-ledger
parse-target + the DO-4 §11 ledger-hygiene + the deploy oracle are on disk AND the dev→impl boundary
is provably held by the diff. This is the O equivalent of M.W0's `proof:audit-artifacts-M` lead-gate
— sharpened by clause (c)'s assertion that the M-RECONCILIATION §11 edit-spec is actually LANDED
(it was never applied to the M live ledger — the DO-4 finding) — and it is what makes the dev→impl
boundary checkable at the tranche level, not merely asserted in prose.

---

## §Sequence

```
O.W0 (this) ─► A{O.W1 lint || O.W2 ledger}
```

O.W0 leads the tranche. O.W1 (the lint/dep-cruiser tier) and O.W2 (the ledger re-point +
stale-gate retarget) are parallel Band-A waves with no dependency between them — both open once
`proof:audit-artifacts-O` and the dev→impl boundary witness close. The full phase-ordered DAG is
`O.md §3`.
