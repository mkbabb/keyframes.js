# S.E — Scene-stage resurrection (DM-24 REVIVED · the theatrical scene-switcher, built to not repeat N's failure loop)

**Band:** S.E — Scene-stage resurrection. **Track:** demo/design (SPEC §3, §2.1-9; +design at E3/E5).
**Phase:** DEVELOPMENT ONLY. This document + the SPEC-v3 evidence + PROGRESS.md's board ARE the S.E
deliverable. **No demo/library source is rewritten here.** The six waves (S.E1–S.E6) open only on
explicit owner authorization of the impl drive; a wave is CLOSED only when its born-RED gate is GREEN
*re-run on the merged tree*, exit code recorded in PROGRESS.md (T4; SPEC §7), and S.Z2 re-executes
that oracle at close. inv-16 holds (write only keyframes.js).

**Charter.** S.E resurrects the one first-class owner ask that has died three times — the theatrical
scene-switcher (DM-24; fold row 17). R KILLED it; the owner reopened it (SPEC §2.1-9, fold row 17).
The salvage is **probe-EXECUTED (p05)**: the shelved `n-stage-impl` branch (+4188 LOC) solved the
two named failures of the dead attempts **structurally** — one `SpringProgress` over ring angle and
one shared-`RAFPlayback` LOD clock — and got the DOM position right (Teleport-to-body sibling,
**OUTSIDE** the `scene-subject` VT). p05 lifted the 18-file shelf, re-pathed it onto R's fused tree
(**5 files / 23 import lines — pure path substitution**), and drove `tsc` 16×TS2307 → 0 and
`proof:boundary` → PASS. **Zero API-signature drift; Q5's FAILURE branch (fusion severed standalone
Targets) does NOT fire** — the shelf already carries the PROP/INJECT adapter layer and its
dependencies survived fusion (SPEC §2.1-9). S.E rebases the shelf mechanically, wires
**commit-on-settle** (the cardinal defect of both dead attempts), replaces every scratch `*.mjs`
probe with a named real gate, and does every atomic stage LIVE against the running demo — built
explicitly to not repeat N's failure loop (SPEC §5, "the oldest unfulfilled first-class ask → band
S.E").

**Charter guardrails (absolute, from r7 A-9/A-10 — SPEC §3 S.E preamble):**
- **One nav authority.** No second switcher surface; the interim spin controls dogfood the single
  ChromeDock (C-7), never the shelf's bespoke `StageArrows`/`TransportDock`/`stageDockKey`.
- **Chrome outside the `scene-subject` VT** — the overlay is a **Teleport-to-body sibling**, never
  inside the view-transition subject (the position p05 proved correct).
- **Commit-on-settle wired** — spin-settle/scrollend COMMITS a scene (the cure for both dead
  attempts' cardinal defect).
- **Every load-bearing motion dogfoods a LIGHT-barrel primitive on `RAFPlayback`** (`SpringProgress`
  over ring angle; the shared LOD clock).
- **Every atomic stage verified LIVE against the running demo, never source-shape** — live
  verification via chrome-devtools-mcp for every stage of S.E (T8; SPEC §7 T8).
- **PRM snaps every beat** (reduced-motion honored at each transition).
- **The shelf's scratch `*.mjs` probes are NOT resurrected** — the named real gates below
  (`proof:stage-geometry`, `proof:scene-stage-commits`, the mobile commit gate) replace them.

**CI-budget accounting (se-B9; SPEC §3 S.E preamble, §9 SE-9).** The band adds **exactly TWO CI
browser gates** — `proof:scene-stage-commits` (E4) and the mobile commit gate (E5) — both riding the
**ONE shared chromium + one served dist from S.A2's net-deletion** (amortized, **not +2 launches**).
`proof:stage-geometry` (E3) rides that **same shared harness**. The fps checks are **LOCAL
chrome-devtools-mcp acceptances costing zero CI launches**. **S.E does not re-red the plane S.A0
greens** — this is the load-bearing budget guarantee, honored per-wave below.

**Mode declarations (C-14 — every wave states REWRITE or REFINE):**
- **S.E1 — REFINE (salvage) + additive** (lift the shelf verbatim; re-path; author 2 new adapters).
- **S.E2 — REFINE (salvage)** (lift orbit + LOD near-verbatim).
- **S.E3 — REWRITE** (the stage overlay + its named structural oracle).
- **S.E4 — REWRITE** (commit-on-settle + single authority + interim dock controls).
- **S.E5 — REWRITE** (the phone path; same stage, no fork).
- **S.E6 — REFINE** (the glass-ui consume-edge; pin bump + visual re-baseline).

**Band DAG (from SPEC §3 "The DAG"):**

```
S.D2 ──► S.E1 (8-scene core)   ;   S.D3 ──► S.E1c (compose row + adapter)
S.E1 ──► S.E2 ──► S.E3 ──► S.E4 ──► S.E5
S.E4 + [glass-ui 5.0.0 published] ──► S.E6   (else: structured HANDOFF + rows 51/52/53 RESIDUAL CARRY)
```

- **S.E1** deps **D1, D2** (the 8-scene core rides the carved tree); **E1c** (compose row + adapter)
  deps **D3** (SPEC §3 DAG line "S.D3 ──► S.E1c, S.G2(compose items)"). E1 core no longer enumerates
  a scene that does not exist (se-B1).
- **S.E2 → E3 → E4 → E5** is a strict linear chain (each stage builds on the prior atomic surface).
- **S.E6** deps **E4 + EXTERNAL (glass-ui 5.0.0 published)** — one of the plan's **exactly two**
  external consume-edges (T12; the other is S.H4). If 5.0.0 does not publish before S close, E6
  closes as a **structured HANDOFF** and fold rows 51/52/53 become an **explicit non-terminal
  RESIDUAL CARRY** (C-20/C-21; never presented as terminals).

**Fold rows this band terminalizes (SPEC §4):** row **17** (DM-24 N-Stage scene-switcher, R KILL
disputed → **REVIVED as BAND S.E**; salvage probe-executed, p05), row **18** (`proof:scene-switcher-mobile`
zombie gate → **reborn** as `proof:scene-stage-commits` at E4 + the mobile commit gate at E5; the
*retire* half is S.A4's), rows **51/52/53** (the glass-ui HANDOFFs → **re-entry at E6** on the joint
5.0.0 publish; RESIDUAL-CARRY clause + the dock double-click kf-internal contingency), row **55**
(glass-ui pin frozen ~4.0.0 → deliberate ~5.0.0 at publish → **E6**; hold till then per C-12).
**Explicitly NOT this band:** fold row **71** (KfPillTabs keyboard-broken + TransportDock
auto-repeat) — it is a **panel primitive, not scene-nav**, so its test lives in **S.B7** and its
promotion in **S.D2**, NOT S.E5 (se-B6; SPEC §9 X1-1).

**Rulings this band executes (SPEC §2.2):** **C-6** (the scene-switcher gate contradiction — the
zombie `proof:scene-switcher-mobile` reborn as `proof:scene-stage-commits`; the ASSERTION-3
carousel-absence deletion is S.A4's), **C-7** (scene-switcher substrate — DM-24 REVIVED, salvage
probe-executed; interim spin controls are `DockIconButton`s in the single ChromeDock, NOT the
bespoke second authority), **C-10** (no raw absolute fps threshold is a CI closure anywhere — the
≥55fps criterion is a declared LOCAL chrome-devtools-mcp acceptance or a budgeted
device-independent ratio), **C-12** (glass-ui pin held ~4.0.x through S; consume-edge fires ONLY on
the joint 5.0.0 publish; never caret), **C-20** (terminal is structural — the RESIDUAL-CARRY honesty
for rows 51/52/53), **C-21** (the closeable roster — E6's HANDOFF gates render as
`HANDOFF — external — row N`). **Tenets referenced:** **T1** (runtime-tier closure — E1/E3/E4/E5),
**T4** (DEVELOPED ≠ SHIPPED; no born-GREEN-then-red), **T8** (interaction-axis tests for hand-rolled
primitives; live chrome-devtools-mcp verification every stage), **T12** (external gates named, not
assumed — E6 is one of exactly two). **Probes:** **p05** (the salvage — executed; 5 files/23 lines,
tsc 16×TS2307→0, proof:boundary PASS, zero API drift), **p10** (the arming-audit class; the
stage-visible substrate S.G1 lands).

---

## S.E1 — Registry re-path + the two authored-new adapters (p05 confirms)

**Mode: REFINE (salvage) + additive.** p05 confirms — the 18-file shelf re-paths mechanically
(**5 files / 23 import lines, sed-scriptable**); the salvage engine drove `tsc` 16×TS2307 → 0 and
`proof:boundary` → PASS with zero API-signature drift (SPEC §3 S.E1, §2.1-9).

### Charter

The `n-stage-impl` shelf (+4188 LOC) is a **treasure** (SPEC §2.1-9): it solved the two named
failures of the dead scene-switcher attempts structurally (one `SpringProgress` over ring angle; one
shared-`RAFPlayback` LOD clock) and put the DOM position right (Teleport-to-body sibling, OUTSIDE the
`scene-subject` VT). p05 lifted it, re-pathed it onto R's fused tree, and proved the fusion FAILURE
branch (Q5: fusion severed standalone Targets) does **not** fire — the shelf already carries the
PROP/INJECT adapter layer and its dependencies survived fusion. **Two honest caveats survive the
probe** (SPEC §2.1-9): the registry **froze at 7 scenes** (`morph` absent — the shelf predates
morph), and the project's `check` is **bare `tsc`** (no `vue-tsc`), so `.vue` render paths are
exercised only by the browser-actuating gate. S.E1 lifts the shelf verbatim, re-paths it, and
authors the two adapters the shelf never had.

### Scope items

- **S1 — Lift the 18-file shelf `scene-stage/` verbatim.** No API reshape; the salvage engine is
  the shipped surface.
- **S2 — Re-path per p05: 5 files / 23 import lines (sed-scriptable).** Pure path substitution onto
  the fused tree (the mechanical `tsc` 16×TS2307 → 0 that p05 executed).
- **S3 — 7 shelf adapters RE-PATHED + 2 authored NEW (scope stated honestly, se-B2).** The two new:
  - **`previews/morph.ts`** — the morph preview adapter the shelf never had (the registry froze
    pre-morph, p05 F5).
  - **the `morph` registry row** — one new registry entry for the eighth shipped scene.
  - **the compose adapter** — authored at **E1c**, gated on D3 (below).
- **S4 — E1 CORE enumerates the 8 shipped scenes; deps D1, D2** (se-B1 — E1 no longer enumerates a
  scene that does not exist). **E1c — the compose row + adapter — is a sub-item gated on D3** (the
  playground fold lands the ninth scene; the compose adapter cannot be authored before `scenes/compose/`
  exists).

### The bare-tsc caveat (p05 — recorded, load-bearing)

`check` is **bare `tsc` (no `vue-tsc`)** — it verifies the salvage engine fully but resolves `.vue`
script blocks **only at import resolution**, not at the render path. The render path is exercised by
the **browser gate** (S1 below). This is why E1's gate is a *runtime* gate, not a `tsc`/grep gate:
`tsc` green does not prove the inject-adapter runtime provisioning works (p05 could clear that only at
the type layer).

### The HARD GATE — `proof:scene-registry-mounts` (born-RED, runtime — strengthened per se-B3)

**Gate name:** `proof:scene-registry-mounts` (NEW; the SE-3-strengthened successor to a
resolve-only registry check).

**What it asserts (runtime, not grep, not resolve-only — SPEC §3 S.E1, §9 SE-3).** **Each scene row
mounts and renders a non-error idle preview** — driven against the running demo (the shared harness
+ served dist). This covers the **inject-adapter runtime provisioning** that p05 could only clear at
the type layer: a scene whose adapter type-checks but fails to provide its INJECT contract at runtime
REDs here.

**Born-RED witness plan.** Authored at E1, the gate is **born-RED** on the pre-lift tree: the
`scene-stage/` registry does not yet exist under the fused paths, so no scene row mounts → hard RED.
After the lift + re-path lands, the 8-scene core mounts; the gate greens only when **every** row
renders a non-error idle preview. The `morph` row is born-RED until S3's authored-new
`previews/morph.ts` + registry row land (the registry froze at 7 — the 8th row is genuinely absent
today). **E1c** extends the same gate over the compose row after D3.

**Falsifiability.** The gate reads the running SPA (runtime-tier — T1); a resolve-only stub or a
`tsc`-green-but-render-broken adapter cannot satisfy the "renders a non-error idle preview" clause
(the exact blindspot the bare-`tsc` caveat names). Plant: break one adapter's INJECT provisioning
(remove a provided key) → that row fails to render → REDs, while `tsc` stays green.

### Cost (carried from p05)

**5 files / 23 import lines** re-pathed (sed-scriptable; p05-measured) + **2 authored-new adapters**
(`previews/morph.ts` + the compose adapter) + **1 new registry row** (`morph`). Mechanical; LOW risk
(p05 executed the mechanical core: `tsc` 16×TS2307 → 0, `proof:boundary` PASS, zero API drift). The
only NEW authoring is the morph + compose adapters.

### DAG

**Deps: D1, D2** (the 8-scene core rides the carved tree — `S.D2 ──► S.E1`). **E1c deps D3**
(`S.D3 ──► S.E1c` — the compose row + adapter). **E1 ──► S.E2.**

### Verification

Impl sequence: (1) author `proof:scene-registry-mounts` FIRST (born-RED — the registry does not yet
exist under the fused paths); (2) lift `scene-stage/` verbatim + re-path (5 files / 23 lines,
sed-script) — run `check` (expect `tsc` 16×TS2307 → 0, per p05) + `proof:boundary` (expect PASS,
LIGHT-barrel imports hold); (3) author `previews/morph.ts` + the `morph` registry row; (4) run
`proof:scene-registry-mounts` against the running demo — all 8 rows must render a non-error idle
preview (GREEN); (5) after D3, author the compose adapter + E1c registry row and extend the gate over
compose (E1c GREEN).

---

## S.E2 — Orbit + LOD lift

**Mode: REFINE (salvage).** `useCarouselOrbit` + `useLivePreviewLOD` lifted near-verbatim (SPEC §3
S.E2, r7 A-2/A-3).

### Charter

The two motion cores that make the stage feel alive lift near-verbatim from the shelf: **ONE
`SpringProgress` over the ring angle** and **ONE shared `RAFPlayback` LOD clock** (amiga's WebGL
preview counts double against the LOD budget). Both dogfood LIGHT-barrel primitives on `RAFPlayback`
(the charter guardrail); p05 proved the LIGHT-barrel imports hold for the lift.

### Scope items

- **S1 — Lift `useCarouselOrbit` near-verbatim** — ONE `SpringProgress` over ring angle (the
  structural cure for the dead attempts' hand-rolled angle math).
- **S2 — Lift `useLivePreviewLOD` near-verbatim** — ONE shared `RAFPlayback` LOD clock; **amiga's
  WebGL preview counts double** against the LOD budget.
- **S3 — The fps criterion is SPLIT** (per C-10/se-B4 — see the gate below).

### The HARD GATE — `proof:boundary` (green — device-independent structural half) + the split fps criterion

**Gate name:** `proof:boundary` (EXISTING; the E2 lift must keep it green) **+ a device-independent
structural clause** (mount-count + LOD-state assertions).

**What it asserts.**
- **The CI half (device-independent).** `proof:boundary` stays GREEN (the LIGHT-barrel imports hold
  — p05-proven for the lift: `SpringProgress`/`RAFPlayback` are LIGHT surface). Plus a
  **mount-count + LOD-state structural assertion** — how many previews are mounted, which LOD tier
  each holds — **NOT** a frame rate.
- **The fps half (NOT a CI closure — C-10/se-B4).** "**≥55fps with all previews mounted**" is a
  **declared LOCAL chrome-devtools-mcp acceptance** recorded in this wave doc — **not a T4 closure**.
  If the impl drive wants it in CI, it **converts to a budgeted device-independent ratio** per the
  taxonomy recipe (C-10: no raw absolute fps threshold may be a CI closure anywhere in the plan). The
  ≥55fps number is an acceptance *target* for the local live check, never a gate that reds on a slow
  runner.

**Born-RED witness plan.** `proof:boundary` is GREEN today and must STAY green — the born-RED
substance is the **structural mount-count/LOD-state clause**, which reds on the pre-lift tree (the
orbit/LOD cores are not yet wired, so no LOD state is observable). After the lift, the structural
assertion reads the mounted preview set and its LOD tiers → GREEN. Plant: break a LIGHT-barrel import
(pull `SpringProgress` through a HEAVY path) → `proof:boundary` REDs.

**Falsifiability.** The boundary half is falsifiable by construction (any HEAVY leak reds it); the
structural clause is falsifiable against the running preview set (a mis-wired LOD clock yields the
wrong tier-state). The fps half is explicitly **NOT** a gate — it is a recorded local acceptance, so
it cannot mask a real regression by being loosened (C-10's whole point).

### Cost

Near-verbatim lift of two composables; LOW risk (p05-proven LIGHT-barrel hold). The only new authoring
is the device-independent structural mount/LOD clause and the recorded local fps acceptance.

### DAG

**Deps: E1.** **E2 ──► S.E3** (E3's fps half is E2's local acceptance).

### Verification

(1) Lift `useCarouselOrbit` + `useLivePreviewLOD`; (2) run `proof:boundary` (must stay GREEN —
LIGHT-barrel imports hold); (3) run the structural mount-count/LOD-state clause (GREEN post-lift);
(4) run the LOCAL chrome-devtools-mcp fps acceptance with all previews mounted (target ≥55fps,
amiga's WebGL double-counted) and RECORD the reading in this wave doc — it is not a CI gate.

---

## S.E3 — Stage overlay, with a named oracle

**Mode: REWRITE.** The Teleport-sibling overlay + its named structural oracle (SPEC §3 S.E3, r7
A-4/A-5/A-6, §9 SE-5).

### Charter

The stage overlay is the theatrical surface: a **Teleport-sibling overlay OUTSIDE the VT subject**, a
**registered-`@property` downlight over never-black grid paper**, the **empirically verified
`rotateX(-15deg)`/perspective geometry**, and a **zoom-out choreography on a `SpringProgress`**. The
geometry numbers are **live-pinned, NOT re-derived** — re-deriving them reopens the `+deg` inversion
bug (r7 A-4/A-5/A-6). This wave REWRITEs the overlay and replaces the shelf's scratch probe scripts
with a **named real gate** (the charter's no-scratch-`*.mjs`-probes line is satisfied by a real gate,
not by deletion alone).

### Scope items

- **S1 — Teleport-sibling overlay OUTSIDE the `scene-subject` VT** (a body-level sibling with **no
  `view-transition-name`** — the p05-proven correct position).
- **S2 — Registered-`@property` downlight over never-black grid paper** (the stage's lighting; the
  grid never goes black).
- **S3 — The empirically verified `rotateX(-15deg)`/perspective geometry — LIVE-PINNED, not
  re-derived** (re-deriving reopens the `+deg` inversion bug — explicitly forbidden).
- **S4 — Zoom-out choreography on a `SpringProgress`** (LIGHT-barrel primitive; the charter dogfood
  guardrail).

### The HARD GATE — `proof:stage-geometry` (born-RED, structural — the named oracle, se-B5)

**Gate name:** `proof:stage-geometry` (NEW; `scripts/proof-stage-geometry.mjs`). **This gate REPLACES
the shelf's scratch `probe.mjs` / `verify-candidate-c.mjs` scripts** — the charter's
no-scratch-probes line is now satisfied by a real, named gate (SPEC §3 S.E3, §9 SE-5).

**What it asserts (playwright-core over the served dist; demo-correctness tier; the SHARED harness — SPEC §3 S.E3).**
- **The overlay element is a body-level sibling with NO `view-transition-name`** (the Teleport-out
  position — structural DOM assertion).
- **`getComputedStyle` transform matrix matches the pinned `rotateX(-15deg)`/perspective values
  within tolerance** (the live-pinned geometry — the `+deg` inversion bug reds here if re-derivation
  slips it).
- **Disk / preview rects at fixed 375 / desktop viewports** (the stage measurables hold at both the
  phone and desktop widths).

**Born-RED witness plan.** Authored at E3, the gate is born-RED on the pre-overlay tree: no body-level
overlay sibling exists (the Teleport target is absent) → the first clause hard-REDs. After the overlay
lands with the pinned geometry, all three clauses green. Plant: put the overlay INSIDE the
`scene-subject` VT (give it a `view-transition-name`) → the sibling clause REDs; or re-derive the
geometry and let the `+deg` inversion slip in → the transform-matrix clause REDs (this is the exact
regression S3 forbids by pinning).

**Falsifiability.** The gate reads the running SPA via playwright-core (runtime/structural — T1); it
is not satisfiable by a source-shape stub (the transform matrix is read from `getComputedStyle` on the
live element). Falsifiable both ways: it reds on a wrong-position or wrong-geometry overlay, and greens
only on the live-pinned correct one.

### CI budget

`proof:stage-geometry` rides the **same shared chromium + served dist** as the E4/E5 gates (SPEC §3
S.E preamble) — it does **not** add a launch. **The fps half is E2's LOCAL acceptance**, not a clause
here (C-10; SPEC §3 S.E3 — "the fps half is E2's local acceptance").

### Cost

One new playwright-core gate script + the overlay REWRITE (Teleport-sibling, downlight, pinned
geometry, spring zoom-out). MEDIUM (geometry must be pinned exactly — the `+deg` inversion bug is a
live footgun the pinning guards against).

### DAG

**Deps: E2.** **E3 ──► S.E4.**

### Verification

(1) Author `scripts/proof-stage-geometry.mjs` FIRST (born-RED — no body-level overlay sibling exists
yet); (2) REWRITE the overlay: Teleport-to-body sibling with no `view-transition-name`,
registered-`@property` downlight, the LIVE-PINNED `rotateX(-15deg)`/perspective numbers (do NOT
re-derive), spring zoom-out; (3) run `proof:stage-geometry` on the served dist (all three clauses
GREEN); (4) confirm it rides the shared harness (no new launch).

---

## S.E4 — Commit-on-settle + single authority + the interim dock controls

**Mode: REWRITE.** The cardinal-defect cure — a swipe/arrow COMMITS a scene (SPEC §3 S.E4, C-6, C-7,
§9 SE-8).

### Charter

Both dead scene-switcher attempts failed the same way: they never COMMITTED. S.E4 wires
**commit-on-settle** through the existing typed-VT seam, establishes **one nav authority**, and scopes
the **interim spin controls as ordinary `DockIconButton`s inside the single ChromeDock** — dogfooding
the existing dock (r7 A-10), **NOT** resurrecting the shelf's bespoke
`StageArrows`/`TransportDock`/`stageDockKey` second-authority surface (which stays unlifted). This is
the surface the E4/E5 gates actuate and the surface **S.E6 later retires** for BG's dock morph (C-7).

### Scope items

- **S1 — ChromeDock opens the stage** (the single nav authority; no second switcher surface).
- **S2 — The interim spin controls: ordinary `DockIconButton`s inside the single ChromeDock**
  (se-B8; C-7). **NOT** the shelf's bespoke `StageArrows`/`TransportDock`/`stageDockKey` — that
  second-authority surface **stays unlifted**. The interim controls are the surface S.E6 later
  retires for BG's in-place dock morph.
- **S3 — Commit-on-settle wired: spin-settle / scrollend → `runSceneSwitch` through the existing
  typed-VT seam.** `frontIndex` / `spinning` are exposed as the **gate observable** (the commit
  state the gate reads).

### The HARD GATE — `proof:scene-stage-commits` (born-RED, browser-actuating — C-6's successor)

**Gate name:** `proof:scene-stage-commits` (NEW; **C-6's successor** — the reborn
`proof:scene-switcher-mobile` zombie, retired at S.A4 and reborn HERE targeting `frontIndex`/`spinning`
+ commit-on-settle; SPEC §2.2 C-6, fold row 18). **Browser-actuating; demo-correctness tier.**

**What it asserts.** **A swipe / arrow COMMITS a scene** — the cure for both dead attempts' cardinal
defect. The gate drives a swipe or arrow actuation against the running stage and asserts the commit
lands (the scene actually switches and settles), reading `frontIndex`/`spinning` as the observable.

**Born-RED witness plan.** Authored at E4, the gate is born-RED on the pre-commit tree: the stage
spins but never commits (the exact defect of both prior attempts) — a swipe/arrow leaves `frontIndex`
unchanged after settle → RED. After S3 wires spin-settle/scrollend → `runSceneSwitch`, a swipe/arrow
advances `frontIndex` and settles → GREEN. Plant: sever the `runSceneSwitch` call on settle → the
commit never lands → REDs (reproducing the cardinal defect on demand).

**Falsifiability.** The gate is browser-actuating (runtime — T1/T8): it drives a real gesture and
reads the committed state, so a source-shape stub that "wires" a handler but never advances
`frontIndex` fails. Falsifiable both ways — it reds on a spin-without-commit and greens only on a real
commit.

### CI budget

`proof:scene-stage-commits` is **ONE of the band's two CI browser gates** (SPEC §3 S.E preamble); it
rides the **ONE shared chromium + served dist from S.A2's net-deletion** (amortized, not +1 launch).

### Cost

The commit-on-settle wiring (spin-settle/scrollend → `runSceneSwitch` through the existing typed-VT
seam) + the interim `DockIconButton` spin controls + one new browser-actuating gate. MEDIUM.

### DAG

**Deps: E3.** **E4 ──► S.E5** and **E4 ──► S.E6** (E6 also needs the external glass-ui 5.0.0 publish).

### Verification

(1) Author `proof:scene-stage-commits` FIRST (born-RED — the stage spins but never commits); (2)
REWRITE: ChromeDock opens the stage; add the interim `DockIconButton` spin controls (NOT the bespoke
second authority); wire spin-settle/scrollend → `runSceneSwitch` through the typed-VT seam; expose
`frontIndex`/`spinning`; (3) run `proof:scene-stage-commits` against the running stage (a swipe/arrow
must COMMIT — GREEN); (4) live-verify via chrome-devtools-mcp (T8 — every stage verified live).

---

## S.E5 — Phone path

**Mode: REWRITE.** The mobile switcher is the SAME stage — no fork, no second authority (SPEC §3
S.E5, se-B6, §9 SE-6).

### Charter

The phone path is the **SAME stage** — **no max-width fork, no second authority**. The dead attempts
each grew a separate mobile switcher; S.E5 refuses that. **KfPillTabs is REMOVED from this wave's
scope** (se-B6): it is the **control-strip panel primitive inside `animation-controls` (a12), NOT a
scene-nav surface** — its test lives in **S.B7**, its promotion in **S.D2** (fold row 71). E5
introduces **no second nav authority and consumes no panel primitive for navigation**.

### Scope items

- **S1 — The mobile switcher IS the same stage** — one stage, one nav authority, actuated on touch
  (open → spin → commit). No max-width fork.
- **S2 — KfPillTabs is NOT in scope** (se-B6): panel primitive, not scene-nav. Its **test → S.B7**;
  its **promotion → S.D2** (fold row 71; NOT S.E5). E5 consumes no panel primitive for navigation.
- **S3 — The dock double-click kf-internal contingency fallback is AUTHORED at E5-time** (the DM-1
  R.W6 precedent — a kf-internal press handler), so the ≥4-tranche chronic's terminal does **not**
  depend on an external publish (fold row 53; wired/retired at E6 per the publish outcome — see
  S.E6). *(This is authored here; whether it is wired is decided at E6.)*

### The HARD GATE — the reborn mobile commit gate (born-RED, browser-actuating at 375px)

**Gate name:** the reborn mobile commit gate (NEW; the second half of C-6's zombie-retirement —
fold row 18; the mobile counterpart to `proof:scene-stage-commits`). **Browser-actuating;
demo-correctness tier; driven at 375px.**

**What it asserts.** At **375px**, **open → spin → commit on touch — full stop** (SPEC §3 S.E5). The
gate drives the touch sequence against the mobile stage and asserts the commit lands (the SAME stage,
no fork).

**Born-RED witness plan.** Authored at E5, the gate is born-RED on the pre-mobile-wire tree: at 375px
the touch sequence does not commit (or a second-authority fork intercepts it) → RED. After S1 lands
the same-stage touch path, open→spin→commit lands at 375px → GREEN. Plant: introduce a max-width fork
or a second nav authority → the single-authority guarantee breaks and the touch commit reds (or the
`live-session-mobile` touch battery reds on the split, per the p10 one-writable-axis lesson).

**Falsifiability.** Browser-actuating at a fixed 375px viewport (runtime — T1/T8); a source stub
cannot satisfy the "commit on touch" clause. Falsifiable both ways — it reds on a non-committing or
forked mobile path and greens only on the single-stage touch commit.

### CI budget

The mobile commit gate is **the band's SECOND CI browser gate** (SPEC §3 S.E preamble); it rides the
**ONE shared chromium + served dist** (amortized, not +1 launch).

### Cost

The same-stage mobile touch wiring + one new browser-actuating gate at 375px + the authored (not
necessarily wired) dock double-click contingency handler. MEDIUM. **No KfPillTabs work here** (that
cost is B7's + D2's).

### DAG

**Deps: E4.** **E5 ──► S.E6** is not a hard edge (E6 deps E4 + external); but the dock double-click
contingency authored here is the fallback E6 either retires or leaves unwired.

### Verification

(1) Author the reborn mobile commit gate FIRST (born-RED at 375px — the touch sequence does not
commit); (2) REWRITE: the mobile switcher IS the same stage (no fork, no second authority); (3) author
the kf-internal dock double-click press-handler contingency (DM-1 R.W6 precedent — authored, wiring
deferred to E6); (4) run the mobile commit gate at 375px (open→spin→commit on touch — GREEN); (5)
live-verify on a 375px viewport via chrome-devtools-mcp (T8); (6) confirm KfPillTabs is untouched here
(its test is B7's, its promotion D2's).

---

## S.E6 — glass-ui consume-edge (GATED: fires ONLY on the joint 5.0.0 publish)

**Mode: REFINE.** The third-party external consume-edge — one of the plan's exactly two (SPEC §3
S.E6, C-12, C-20, C-21, T12; fold rows 51/52/53/55).

### Charter

S.E6 is the **glass-ui consume-edge**: pin `~4.0.x` → `~5.0.0`, verify the consumed subpaths against
BH's regenerated entry-set, re-baseline the visual-lock gates against BG's specular floor + unified
8px blur, and swap the stage's interim dock controls onto BG's in-place dock morph (retiring E4's
`DockIconButton`s). **This wave FIRES only when the joint glass-ui 5.0.0 publishes** — BG (≈110 waves)
+ BH (≈30 waves) are dev-complete but **unbuilt** (r7 B-1; SPEC §1). The tilde-pin discipline is
absolute: **`~5.0.0`, never caret** (C-12). If 5.0.0 has not published at S close, this wave closes
as a **structured HANDOFF** and fold rows 51/52/53 are recorded as an **explicit non-terminal
RESIDUAL CARRY** (C-20/C-21; owner-acknowledged; never presented as terminals).

### Scope items

- **S1 — Pin `~4.0.x` → `~5.0.0`** (tilde, **never caret** — C-12).
- **S2 — Verify the ~17 consumed subpaths against BH's regenerated entry-set** (the subpath-survival
  clause — a consumed subpath that BH renamed/dropped must be caught).
- **S3 — Re-baseline the visual-lock gates against BG's specular floor + unified 8px blur.**
  **FLAGGED (se prune):** the visual re-baseline is **its own multi-gate effort, NOT an atomic flip
  with the pin bump** — booked as **the wave's largest line item**.
- **S4 — Swap the stage's dock controls onto BG's in-place dock morph**, retiring E4's interim
  `DockIconButton`s (the surface C-7 named for later retirement).
- **S5 — Re-test the dock double-click** against the built 5.0.0 (fold row 53).

### The dock double-click contingency (independent of the publish — fold row 53)

**Independent of the publish**, S carries a **kf-internal fallback** — the **DM-1 R.W6 precedent, a
kf-internal press handler** — **authored at E5-time** (S.E5 S3) so the **≥4-tranche chronic's
terminal does NOT depend on an external publish** (C-20: a terminal must not be gated on an external
event). **If 5.0.0's dock morph lands first, the fallback is never wired**; if 5.0.0 does not land,
the kf-internal handler is wired and the chronic terminalizes internally. Either way the double-click
verdict is recorded (fold row 53).

### The HARD GATE — `proof:peer-satisfied` flips green (+ subpath-survival + double-click verdict)

**Gate name:** `proof:peer-satisfied` (EXISTING; the born-RED peer-cycle gate — fold row 52; flips
green on the 5.0.0 pin) **+ the subpath-survival clause + the recorded double-click verdict.**

**What it asserts.**
- **`proof:peer-satisfied` flips GREEN** post-pin (the glass-ui peer-cycle resolves against the joint
  5.0.0 — fold row 52).
- **The subpath-survival clause** — every one of the ~17 consumed subpaths still resolves against
  BH's regenerated entry-set (a dropped/renamed subpath REDs).
- **The double-click verdict is recorded** — the dock double-click is re-tested against the built
  5.0.0 (or the kf-internal fallback is wired), and the verdict is captured (fold row 53).

**Born-SPECIFIED, not born-RED (the external-edge honesty — T12).** This wave's gate is **coupled to
an external publish** that does not exist yet (glass-ui 5.0.0 is unbuilt — r7 B-1). Its gate is
therefore **SPECIFIED now and FIRES at the impl drive's consume step** — it is one of the plan's
**exactly two** external consume-edges (the other is S.H4; T12). **The visual re-baseline (S3) is NOT
a single flip** — it is a multi-gate effort, the wave's largest line item, and each re-baselined gate
is its own verdict.

**Non-terminal honesty (C-20/C-21; SPEC §9 X2-6).** **If glass-ui 5.0.0 has not published at S
close**, S.E6 closes as a **structured HANDOFF** and fold rows **51/52/53** are recorded as an
**explicit non-terminal RESIDUAL CARRY** (owner-acknowledged) — **never presented as terminals**. In
the FINAL gate-state table these render as the explicit third state **`HANDOFF — external — row N`**
(C-21: never omitted, never counted green). The stale MEMORY "specular=off" expectation is retired at
S close (C-12; fold row 54 is S.Z3's, observe-tier).

**Falsifiability.** Post-publish, `proof:peer-satisfied` reds until the pin resolves and greens on the
correct `~5.0.0` pin; the subpath-survival clause reds on any dropped subpath. Pre-publish, the wave
is honestly a HANDOFF — the RESIDUAL-CARRY state is a *named, non-terminal* disposition, not a
green-masked terminal (the exact honesty C-20 mandates).

### Cost

Pin bump (S1, trivial) + subpath verification (S2, LOW) + **the visual re-baseline (S3 — the wave's
LARGEST line item, a multi-gate effort, NOT an atomic flip)** + the dock-morph swap (S4) + the
double-click re-test (S5). Cost is **externally gated** — the wave does not run until 5.0.0 publishes;
if it does not, the cost is a structured HANDOFF authoring only.

### DAG

**Deps: E4 + EXTERNAL (glass-ui 5.0.0 published).** `S.E4 + [glass-ui 5.0.0 published] ──► S.E6`
(else: **structured HANDOFF + rows 51/52/53 RESIDUAL CARRY**). This is **one of exactly two** external
consume-edges in the plan (T12; the other is S.H4, owner-controlled and born-SPECIFIED).

### Verification

**If 5.0.0 has published by the impl drive's consume step:** (1) pin `~4.0.x` → `~5.0.0` (tilde, never
caret); (2) run `proof:peer-satisfied` (must flip GREEN) + the subpath-survival clause over the ~17
consumed subpaths against BH's entry-set; (3) re-baseline the visual-lock gates against BG's specular
floor + 8px blur — **a multi-gate effort, each gate its own verdict** (the largest line item); (4)
swap the interim `DockIconButton`s onto BG's dock morph; (5) re-test the dock double-click against the
built 5.0.0 and record the verdict; (6) retire the stale specular=off MEMORY expectation.
**If 5.0.0 has NOT published:** close E6 as a **structured HANDOFF**; record fold rows 51/52/53 as an
explicit **non-terminal RESIDUAL CARRY** (rendered `HANDOFF — external — row N` in the FINAL table);
WIRE the kf-internal dock double-click contingency authored at E5 (so the chronic terminalizes
internally, independent of the publish).

---

## Cross-wave provenance (SPEC §9 absorption — se-scene-stage + Pass-2 addendum)

Every §9 blocking edit and Pass-2 addendum this band absorbs, for traceability:

| §9 edit | Substance | Home in this doc |
|---|---|---|
| SE-1 | Add DAG edge D3→E1 (or enumerate 8 + append compose when D3 lands) | S.E1 S4 (8-scene core deps D1/D2; E1c deps D3) + band DAG |
| SE-2 | Rewrite E1 scope to "7 re-pathed + 2 authored-new (`previews/morph.ts` + compose)"; bare-tsc caveat clause | S.E1 S3 + the bare-tsc caveat section |
| SE-3 | Strengthen E1's gate to "each scene row mounts and renders a non-error idle preview" | S.E1 gate (`proof:scene-registry-mounts`) |
| SE-4 | Split the E2/E3 perf criterion; delete raw ≥55fps as a T4 closure (local acceptance or C-10 budgeted ratio) | S.E2 gate (split fps) + S.E3 CI-budget note; C-10 |
| SE-5 | Name E3's oracle concretely; reconcile with the no-scratch-`*.mjs` charter line | S.E3 gate (`proof:stage-geometry` — playwright-core, structural, replaces the shelf probes) |
| SE-6 | Specify where the mobile stage consumes KfPillTabs or remove it from E5; move its test to B7 | S.E5 S2 (REMOVED from E5; test → S.B7, promotion → S.D2); fold row 71 |
| SE-7 | Pin the Oscillator decision to ONE wave; align fold row 56 | **Absorbed via C-13 → S.G2 (decision) + S.F5a (bench); NOT an S.E wave** (noted here for the se-scene-stage table's completeness; fold row 56) |
| SE-8 | Scope the interim in-dock spin controls (`DockIconButton`s in the single ChromeDock) in E4 | S.E4 S2; C-7 |
| SE-9 | CI-budget accounting for the new browser-actuating gates vs the ~50-launch ceiling | Band preamble (two CI gates on the shared harness; `proof:stage-geometry` rides same; fps = zero-launch local acceptances) |
| X2-6 | Rows 51/52/53 = explicit non-terminal RESIDUAL CARRY if 5.0.0 doesn't publish; kf-internal contingency for dock double-click | S.E6 non-terminal honesty + the dock double-click contingency (authored at E5); C-12 (amended), C-20/C-21 |
| X1-1 | The KfPillTabs keyboard-broken + TransportDock auto-repeat fold row (a12 F1/F2, HIGH) — wave pointer corrected S.E5→S.D2 | S.E5 S2 (explicitly NOT this band — test → B7, promotion → D2); fold row 71 |

**Rulings referenced:** **C-6** (scene-switcher gate contradiction — the zombie reborn as
`proof:scene-stage-commits`; ASSERTION-3 deletion is S.A4's), **C-7** (scene-switcher substrate —
DM-24 revived, salvage p05; interim `DockIconButton` spin controls, not the bespoke second authority),
**C-10** (no raw absolute fps as a CI closure — local acceptance or budgeted ratio), **C-12**
(glass-ui pin held ~4.0.x; consume-edge fires only on the joint 5.0.0 publish; never caret),
**C-13/SE-7** (Oscillator decision pinned to S.G2 + the S.F5a bench — not an S.E wave), **C-14**
(per-wave mode declaration), **C-20** (terminal is structural — the RESIDUAL-CARRY honesty for rows
51/52/53), **C-21** (the closeable roster — E6's HANDOFF gates render `HANDOFF — external — row N`).
**Tenets referenced:** **T1** (runtime-tier closure — E1/E3/E4/E5 gates read the running SPA), **T4**
(DEVELOPED ≠ SHIPPED; no born-GREEN-then-red — every wave closes only on GREEN re-run on the merged
tree), **T8** (interaction-axis tests + live chrome-devtools-mcp verification every stage), **T12**
(external gates named, not assumed — E6 is one of exactly two). **Probes:** **p05** (the salvage —
executed: 18-file shelf, 5 files/23 import lines re-pathed, `tsc` 16×TS2307 → 0, `proof:boundary`
PASS, zero API drift, Q5 FAILURE branch does not fire; two honest caveats — registry froze at 7
scenes, bare `tsc`), **p10** (the arming-audit class + the one-writable-axis mobile lesson — the
stage-visible substrate S.G1 lands).
