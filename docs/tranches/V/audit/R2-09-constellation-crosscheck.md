# R2-09 — value.js-V + Glass-BI cross-check (the consume wave's acceptance inputs)

*Lane R2-09, round 2, 2026-07-17. ID prefix `CC-`. Read-only over all siblings
(value.js, glass-ui, sci-report/atlas). Every claim carries file:line or
command+output. Feeds: the W17b consume wave, the IN-ATLAS-2 exact-pin decision,
and the consolidated outbound batch letters at formation close.*

## Verdict

The constellation's acceptance inputs are **coherent and, for keyframes, almost
entirely producer-gated by Glass** — value.js V imposes **zero live obligation on
the keyframes package**: Keyframes 6.0.0 is immutable and shipped, value.js 4.0.0
is immutable and shipped, and the only keyframes-side action on the whole
`W17a→W33a→W17b` rail is a **demo Glass-7 re-pin at W17b**, which cannot begin
until an immutable, registry-equal Glass 7 exists — and Glass 7 today is
**unpublished and untagged** (`glass-ui/docs/tranches/BI/HANDOFF-ACTIVE-EXECUTION.md:7,173-174`).

Three concrete cross-checks resolve Round-1 coverage gaps:

1. **D-GAP delivery (R1-15's open gap):** verified against the *installed*
   `@mkbabb/value.js@4.0.0` d.ts, not prose. **D-GAP-1 (quart/quint presets) is
   DELIVERED**; **D-GAP-5 (shallow/leaf flatten) is correctly SUPERSEDED** (value
   ships no public `flatten` at all now that `./units` is gone); **D-GAP-6 (bezier
   data sampler with flip) is NOT delivered and NOT formally declined** to
   keyframes — a genuine dangling ask (CC-01).
2. **FAM-02 root-cause cross-check:** a root `<TooltipProvider>` **is the documented
   Glass-7 / reka-ui pattern**, not a missing Glass default. Glass's `Tooltip.vue`
   wraps `RekaTooltipRoot` bare; reka requires a provider ancestor. The FAM-02 fix
   is therefore **demo-owned** and the audit-copy's App.vue patch is the correct
   shape (CC-03).
3. **Dock double-click chronic:** the geometry/clip facet has a Glass owner
   (`dis:dock-chronic` → BI.W-DOCK-SPINE), but the **activation facet keyframes
   actually reported** (pointer-events-during-transition + touch-gate) has **no
   explicit Glass BI owner row** — mark MISSING for the batch letter (CC-04).

The V INBOUND-LEDGER is **complete** against all 5 atlas coordination files — no
keyframes-directed ask is un-captured (CC-07, negative).

---

## CC-01 — value.js 4.0.0 ships D-GAP-1, supersedes D-GAP-5, but leaves D-GAP-6 neither delivered nor declined

**Severity:** P2 · **Family:** FAM-11 COORDINATION (dangling-outbound-ask) · new evidence beyond R1-15's coverage gap.

R1-15 explicitly deferred the D-GAP delivery check to this lane (`R1-15-cross-repo.md:225`
"NOT VERIFIED against value 4.0.0 exports"; `:286-288`). The three gaps are defined
at `docs/tranches/U/KF-TO-VALUEJS-U.md:184-186`. Verified against the **installed**
package, read-only:

**D-GAP-1 — quart/quint easing presets — DELIVERED.**
```
node_modules/@mkbabb/value.js/dist/subpaths/easing.d.ts:60-65
  "ease-in-quart": [0.895,0.03,0.685,0.22]   "ease-out-quart": [0.165,0.84,0.44,1]
  "ease-in-out-quart": [0.77,0,0.175,1]       "ease-in-quint": [0.755,0.05,0.855,0.06]
  "ease-out-quint": [0.23,1,0.32,1]           "ease-in-out-quint": [0.86,0,0.07,1]
```
These sit inside the exported `bezierPresets` (`easing.d.ts:3`, `BezierPresetName`).
The U ask ("add the presets to the canonical easing catalog, preserving existing
names") is met exactly. The demo can drop its hand-authored quart/quint data.

**D-GAP-5 — shallow/leaf-predicate flatten — SUPERSEDED (correctly moot).**
The U plan conditioned this: *"supersede D-GAP-5 if `./units` is removed"*
(`KF-TO-VALUEJS-U.md:26-27,204`). `./units` **is** removed — installed exports are
exactly `./color ./value ./css ./easing ./math ./transform ./quantize`
(`node_modules/@mkbabb/value.js/package.json`), and a package-wide search finds
**no `flattenObject`/`flatten` export at all**:
```
grep -rniE 'flattenobject|flatten\b' node_modules/@mkbabb/value.js/  →  (only "pre-flattened path" prose in transform.d.ts:89)
```
value.js no longer owns the flatten primitive publicly, so a "shallow mode" is
not owed; keyframes owns its own flatten. **No defect** — record the supersession
in the outbound packet so the ask isn't re-raised.

**D-GAP-6 — bare bezier data sampler with flip control — NOT delivered, NOT declined.**
The U plan allowed either outcome: *"either ship the smallest useful D-GAP-6
sampler or [decline it]"* (`KF-TO-VALUEJS-U.md:27,204`). Neither happened:
- No `sampleBezierPath`, `cubicBezierToSVG`, or `*toSVG` symbol exists in any
  installed d.ts (`grep -rniE 'samplebezier|cubicbeziertosvg|tosvg' dist/ → 0`).
- `math` exports pointwise `cubicBezier(t,x1,y1,x2,y2): [number,number]`,
  `interpBezier`, `deCasteljau`, `cubicBezierToString` (`math.d.ts:1-11`) — a
  caller *can* sample the curve one t at a time, but there is no bare-data batch
  sampler with the explicit y-flip the demo's easing-curve preview needs.
- The `transform` subpath's `sampleAtLength`/`PathSample` (`transform.d.ts:111,115`)
  is the VJ-F1 SVG *path-geometry* sampler (shipped in tranche N), a different
  capability from the D-GAP-6 easing-curve data sampler.
- **No decline is recorded** in any keyframes-inbound doc, and value.js's own V
  docs never mention D-GAP-6 (`grep -rniE 'D-GAP|sampleBezier' value.js/docs → 0`).

**Consequence.** The demo still hand-authors easing-preview curve data with no
disposition on the ask. Low blast radius (a working pointwise `cubicBezier`
primitive exists), hence P2 not P1.

**Disposition (FOLD → the value.js outbound batch letter).** One line in the
consolidated value.js packet: *D-GAP-1 accepted as shipped; D-GAP-5 retired as
superseded by the `./units` removal; **D-GAP-6 requires an explicit value.js
ruling** — ship the smallest `sampleBezierPath(x1,y1,x2,y2,{flipY})` data sampler
or decline it on the record.* Until then keyframes keeps its local curve-data
authoring; do not build a fork silently.

---

## CC-02 — value.js-V imposes zero live obligation on the keyframes package; the only keyframes rail step is the W17b demo re-pin

**Severity:** P2 · **Family:** FAM-11 COORDINATION · rail-obligation extraction (the lane's charge #1).

Extracted from `value.js/docs/tranches/V/V.md`, `waves/W17.md`, `waves/W33.md`,
and `HANDOFF-2026-07-16.md`. The `W17a→W33a→W17b→W18–W32→W33b` rail is
**Glass-owned end to end**; keyframes appears only as an immutable boundary and a
downstream consumer.

| Rail step | Owner | Keyframes-side obligation | Trigger / order |
|---|---|---|---|
| — (producer) | keyframes | **NONE.** Keyframes 6.0.0 is immutable and shipped; do not reopen, downgrade, add compat paths, or make it compensate for Glass Q003 | `HANDOFF-2026-07-16.md:69` "Do not downgrade it…or make Keyframes compensate for Glass Q003"; `:262` "Do not touch Value4/Keyframes6 release history" |
| W17a | Glass | none (Glass strict-declarations/HeaderRibbon/Q003 close from registry Value4+Keyframes6) | `W17.md:5`; `HANDOFF:88-95` |
| W33a | Glass | none (publish exactly one fresh Glass7 tarball, prove registry equality) | `W33.md:13,17` |
| **W17b** | value.js (routed mount) + **keyframes demo (as external consumer)** | **Re-pin the demo's Glass consumer graph to registry Glass7 + Keyframes6 + Value4, regenerate the lock without file/link tricks, remove stale Value3 demo canon, reload the canonical Browser witness** | Begins **only after** immutable Glass7 exists; `HANDOFF:133-137,264` "After immutable Glass7 exists, execute W17b" |
| W33b | value.js | none for keyframes | `W33.md:13` |

**What value.js expects keyframes to verify/return:** per `W33.md:58` and
`HANDOFF:263,266` — *"After Glass7, all external consumers install registry
artifacts and rerun their W17 smoke"* and *"When fresh product-green Glass7
rehearsal facts arrive, independently verify them before W33a."* Keyframes is one
of those external consumers: on the next keyframes cut it owes atlas the evidence
tuple (IN-ATLAS-4), and at W17b it owes a re-pinned demo lock + one nonempty
`#app` mount witness. **No producer republish is implied.**

**Patch cadence (feeds IN-ATLAS-2):** value.js V has **no scheduled patch
cadence**. Value 4.0.0 is immutable (`W33.md:36`); the semver discipline is
`ADDENDA.md:145` (V-A78): *"A public-compatible Value cut takes the next patch/
minor…only an enumerated incompatible public removal/signature/behavior change
selects a major."* i.e. **smallest-honest-successor, cut on demand, not on a
clock.** This directly **confirms** keyframes' working recommendation on IN-ATLAS-2:
the exact `value.js@4.0.0` pin is deliberate; there is no rolling 4.x patch
stream a caret would track, so a caret would only reintroduce unmeasured
resolution drift between immutable cuts.

**Disposition (RECORD).** IN-ATLAS-2 confirmation-obligation (a) — *"confirm
against value.js V's planned patch cadence before finalizing"*
(`INBOUND-LEDGER.md` IN-ATLAS-2 disposition) — is **DISCHARGEABLE**: value.js V
declares no patch cadence; the exact pin is consistent with both repos' semver
law. Formation still owes obligation (b): write the one ledger line into the
outbound packet + `docs/published-surface.md`.

---

## CC-03 — a root TooltipProvider is the documented Glass-7 pattern, not a missing Glass default; FAM-02 fix is demo-owned

**Severity:** P2 · **Family:** FAM-02 RENDER (root-cause adjudication) · new evidence answering the lane's explicit question.

FAM-02 (the P0 blank-app crash) is `EditorShell.vue:30` `<Tooltip>` mounted with
no ancestor `<TooltipProvider>`. The lane's charge asks: *is a root provider the
documented Glass-7 pattern or a missing Glass default?* **It is the documented
pattern.** Glass's `Tooltip.vue` wraps reka's `TooltipRoot` directly with no
self-provided context:
```
glass-ui/src/components/tooltip/Tooltip.vue:2   import { TooltipRoot as RekaTooltipRoot } from "reka-ui";
                                          :29   <RekaTooltipRoot data-slot="tooltip" …>
```
reka-ui's `TooltipRoot` injects a provider context that only `TooltipProvider`
supplies (the delay-grouping / `skipDelay` mechanism); this is the radix/reka
contract, confirmed in Glass's own design research
(`glass-ui/docs/tranches/BI/design/factor/RESEARCH-PASS-1.md:9,26,78` "shared
`TooltipProvider` delay-grouping (skipDelay)…baked into Roots"). Glass ships
`TooltipProvider.vue` as a distinct component (`src/components/tooltip/TooltipProvider.vue`)
precisely because the consumer is expected to mount it once at app root — it is
**not** a defaulted-in wrapper Glass forgot.

**Consequence for V:** the FAM-02 fix belongs in the **demo**, not Glass — wrap
the app root (App.vue) in `<TooltipProvider>`. The audit copy already carries
exactly this ("AUDIT-PROBE TooltipProvider patch in demo/app/App.vue", per the
lane brief), which is the correct shape and should be productionized in the
demo transaction, not raised as a Glass BI defect.

**Disposition (FOLD into the FAM-02 demo wave, RECORD as Glass-non-defect).** Add
the root `<TooltipProvider>` to the demo shell as the permanent fix. Do **not**
file a Glass BI ask — a self-providing Tooltip would contradict reka's shared-
delay-grouping contract. Note in the Glass-7 consume WATCHLIST (CC-05) that any
demo route using `<Tooltip>` must sit under the root provider.

---

## CC-04 — the dock double-click activation chronic has no explicit Glass BI owner row (MISSING for the batch letter)

**Severity:** P2 · **Family:** FAM-11 COORDINATION (chronic ownership) · resolves R1-15's "re-verify + re-raise" hook.

Memory `project_dock_doubleclick` records two facets of "dock buttons require
double-click", both fixed-in-glass-root historically:
(1) pointer-events-during-transition falls through to the wrapper →
`onPointerDownOutside` collapses; (2) the touch-gate `preventDefault`/
`stopPropagation` on `GlassDock.vue` swallows the first tap on a collapsed dock.
R1-15's CC row (`R1-15-cross-repo.md:234`) marked it *"re-verify against Glass 7
dock and re-raise if it persists."*

Searching the Glass BI ledger, the **geometry/clip** facet has an owner but the
**activation** facet does not:
- `glass-ui/docs/tranches/BI/ledgers/CHRONIC-DISPOSITIONS.md:88` — `dis:dock-chronic`
  → BUILD → **BI.W-DOCK-SPINE**, but its scope is explicitly *"dock clip/morph/
  rail/Safari fundamentals"* with a *"live `elementFromPoint` reachability assert
  on dock hover plates"*. That reachability assert partially touches facet (1)
  (hit-testing during transition) but the row's subject is geometry, not
  single-click activation.
- The touch-gate facet (2) — `preventDefault` swallowing the first tap — appears
  in **no** BI wave or ledger row (`grep -rniE 'double.click|dblclick|first.click|touch.gate|preventDefault.*tap' docs/tranches/BI → only census-tooling enum entries, no owner row`).
- BI.W-DOCK-CONTROLS / -FOLD / -SPRING-UNIFY / -OVERFLOW all address dock
  structure/motion, none the activation double-fire.

**Disposition (RAISE in the Glass outbound batch letter — MISSING owner).** The
consolidated keyframes→Glass packet must (a) confirm BI.W-DOCK-SPINE's
`elementFromPoint` assert covers facet (1) with a *single-click activation*
acceptance, and (b) name facet (2) (touch-gate first-tap swallow) as an
**unowned** chronic needing its own BI row or an explicit fold into
BI.W-DOCK-SPINE. Keyframes re-verifies the live behavior against the Glass-7 dock
at the W17b consume wave (see WATCHLIST) and re-raises if it reproduces.

---

## CC-05 — the Glass-7 consume WATCHLIST the W17b wave re-verifies at the immutable packet

**Severity:** P1 · **Family:** FAM-01 RAIL / FAM-11 COORDINATION · the lane's charge #3 deliverable.

Glass 7 is **unpublished and untagged** — `HANDOFF-ACTIVE-EXECUTION.md:7`
("local Glass `7.0.0` is **unpublished and untagged**"), `:173-174` ("There is no
`v7.0.0` tag, immutable Glass 7 tarball, integrity, gitHead, provenance, or
registry [row]"). The keyframes demo consumes Glass across 43 files (FAM-01) and
imports the 19 Glass subpaths. Every item below is **QUEUED before the v7 tag**
and touches a surface the demo consumes; the consume wave re-verifies each at the
immutable packet:

| # | Glass-7 change (queued before tag) | Glass source of truth | Demo surface it touches | Re-verify at W17b |
|---|---|---|---|---|
| W-1 | **HeaderRibbon → persistent-only** (V-A92 collapsible-opt-in SUPERSEDED; no `mode=`, no VNode/DOM first-frame correction) | `HANDOFF-ACTIVE-EXECUTION.md:268,333-334`; keyframes `INBOUND-LEDGER.md` IN-GLASS-1 | demo HeaderRibbon consumer(s); FAM-01 flags the drop-`mode=`/delete-`defineExpose` edits as **unapplied** | assert demo HeaderRibbon usage carries no `mode=`/`collapsible` prop; migrated 18-consumer set conforms |
| W-2 | **Strict declaration closure** across every packed `.d.ts` (`skipLibCheck:false`, no hoisting) | `HANDOFF:91`; `W33.md:58`; lane B `:493,508` | all 19 Glass subpaths the demo imports; demo typecheck | isolated demo typecheck with `skipLibCheck:false` green against registry Glass7 |
| W-3 | **Exports = exactly the enumerated public subpaths** (eleven clean-break removals selected 7.0.0; no root/prefix fallback) | `V.md:112`; `W33.md:58,59`; `HANDOFF:69` | the 19 demo import paths; any removed subpath breaks a demo import | walk demo Glass imports vs Glass7 packed `exports`; no removed-subpath import survives |
| W-4 | **DockTrigger / DockControl fold** + GCF-01 prepaint init + GCF-02 reversible Drawer; dock affordance economy | `HANDOFF:261-274,328-341`; `BI.W-DOCK-FOLD`, `BI.W-DOCK-CONTROLS` | demo dock (ChromeDock/MbabbMenu consumers) | dock renders + single-click activation (ties to CC-04) |
| W-5 | **Tooltip/TooltipProvider contract** — root provider required | `Tooltip.vue:2`; CC-03 | `EditorShell.vue:30` `<Tooltip>` (FAM-02) | demo root mounts `<TooltipProvider>`; every `<Tooltip>` route sits under it |
| W-6 | **Value peer = exactly `/color /css /easing`** from registry Value4 (Glass imports no Value root/parser) | `HANDOFF:90`; `W33.md:58` | transitive — Glass7's Value graph must dedupe to the one Value4 core the demo also pins | lock resolves one physical Value4 core; no Value3/file/link edge (kills the pinned Glass5 island, `HANDOFF:124-129`) |
| W-7 | **Q003 compositor product-green** (gates the tag itself) | `W33.md:9,13`; `HANDOFF:106` | none directly, but **no Glass7 tarball exists until this closes** → the whole consume wave is blocked | confirm immutable tarball + provenance exist before any re-pin |
| W-8 | **DarkModeToggle** presence/signature on the Glass7 barrel | not enumerated in BI handoff (needs verify) | demo dark-mode toggle consumer | verify symbol survives Glass7 packed exports (NOT confirmed queued — re-check at packet) |

**Disposition (STANDING WATCHLIST → the W17b consume wave).** This table is the
acceptance checklist the keyframes demo re-runs the instant an immutable Glass7
registry artifact lands. Until then W17b cannot start (Glass7 is the hard
predecessor). Items W-1, W-2, W-3 are the highest-risk (they can break demo
imports/typecheck outright); W-8 is unconfirmed-queued and must be verified
against the actual Glass7 barrel rather than assumed.

---

## CC-06 — INBOUND-LEDGER is complete against all 5 atlas coordination files (negative)

**Severity:** — · **Family:** FAM-11 COORDINATION (negative deliverable) · the lane's charge #5.

The active atlas inbox is `sci-report/atlas/docs/tranches/P/coordination/`
(the two-atlas disambiguation in `INBOUND-LEDGER.md` is correct — the standalone
`/Users/mkbabb/Programming/atlas` checkout has no `docs/`). It holds exactly **5**
files:
```
2026-07-15-glass-data-table-virtual-shell.md      (glass-directed; 0 keyframes asks)
2026-07-15-glass-pencil-peer-widening.md          (:9 observes kf 5.3.3 optional-glass pin — stale pre-6.0.0 status, glass-directed; no kf ask)
2026-07-16-codex-p-totality-handoff.md            (the substantive one; source of IN-ATLAS-1..4)
2026-07-16-p-addenda-advance-note.md              (0 keyframes content)
2026-07-16-p-addenda-handoff.md                   (0 keyframes content)
```
The codex handoff's keyframes-directed content (`:66,136,256-274`) is fully
captured by IN-ATLAS-1..4 in the keyframes INBOUND-LEDGER: 6.0.0 recorded
immutable; next atlas artifact = glass7+kf6+value4+pencil0.9.2 from registry;
*"No Keyframes demo/stage design belongs in this chain"* (`:272`); the exact-pin
question (IN-ATLAS-2), the `TimingFunction` dual-origin census (IN-ATLAS-3), and
the consume posture / evidence-tuple ask (IN-ATLAS-4). **No keyframes-directed ask
is un-captured.** The distilled `ATLAS-INBOUND-…-consumer-crossing-report.md` in
the keyframes ledger is a faithful projection.

**Disposition (RECORD, no action).** INBOUND-LEDGER is non-vacuous and complete
w.r.t. atlas. (The pre-existing XR-3 path correction and IN-ATLAS-4 target fix are
R1-15's rows, unchanged here.)

---

## Negatives (verified, no defect)

- **D-GAP-1 delivered, D-GAP-5 correctly superseded** — verified against installed
  d.ts, not prose (CC-01).
- **Keyframes package owes nothing to value.js V** — 6.0.0 immutable; only the demo
  re-pin at W17b (CC-02).
- **Exact `value.js@4.0.0` pin is consistent with value.js's own semver law** — no
  patch cadence exists to widen toward; IN-ATLAS-2(a) confirmation dischargeable (CC-02).
- **Root TooltipProvider is the documented reka/Glass-7 pattern** — FAM-02 is a demo
  omission, not a Glass defect (CC-03).
- **INBOUND-LEDGER complete against 5 atlas files** — no dangling inbound ask (CC-06).
- **value.js exports are exactly the 7 capability subpaths** — no root/`/parsing`/
  `/units`/`/browser` residue in the installed package
  (`node_modules/@mkbabb/value.js/package.json` exports keys).

## Coverage gaps (not exercised this lane)

- **D-GAP-6 live-consume:** did not open the demo to confirm it still hand-authors
  easing-curve data vs. quietly consuming `math.cubicBezier` pointwise. The d.ts
  proves no `sampleBezierPath`; the *demo's actual current source path* for curve
  preview was not traced.
- **Glass-7 barrel truth:** the WATCHLIST (CC-05) is built from Glass's BI handoff
  prose and Glass source; the **packed Glass7 exports do not yet exist** (unpublished),
  so W-3/W-8 (removed-subpath set, DarkModeToggle survival) are predictions to
  re-verify against the real tarball, not confirmed facts.
- **Dock activation live-repro:** CC-04 is a ledger-ownership finding; I did not
  drive the live Glass-7 dock to confirm the double-click still reproduces (blocked
  the same way — no immutable Glass7, and the demo's pinned island is Glass5).
- **`TimingFunction` freeze (IN-ATLAS-3):** confirmed as a FENCE row in the ledger;
  did not cross-check that every V colocation-wave blueprint (R2-05) actually carries
  the atlas-notification obligation — that belongs to the R2-05/R2-06 adjudications.
