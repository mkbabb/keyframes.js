# S.B — Library sub-zoning + boundary hardening

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the
> wave-spec for band **S.B** of Tranche S, transcribed with zero load-bearing loss from the
> converged **SPEC-v3** (`docs/tranches/S/audit/pass1/SPEC-v3.md`, 1,833 lines — the standalone
> source of truth). Every gate definition, co-edit set, DAG edge, cost estimate, born-RED clause,
> ruling reference, and fold-row this band carries is reproduced here; an implementer must NOT need
> to read SPEC-v3. Nothing runs until the owner authorizes an impl drive. A wave is CLOSED only
> when its born-RED gate is GREEN **re-run on the merged tree** (T4, inv-16), and S.Z2 re-executes
> that oracle at close. **Branch:** `tranche-s-dev` · **Track:** lib.

---

## 0. Band charter — the deep structural carve R only top-partitioned

S.B performs the **deep structural work R only top-partitioned** (SPEC §1): R landed the 12-directory
zone partition and the two god-class carves, but the *stopping rule* was the 500L gate, not module
boundaries — seven files landed at 488–499L, one carve (compile/easing-option) shipped as pure
re-export ceremony, and the zone interiors (`engine/`, `compile/`) were never sub-zoned (SPEC §2.1-5,
§2.1-11). S.B finishes the job at **cohesion altitude**, hardens the static/dynamic boundary, and
lands the two **library-correctness bugs on the shipped `@keyframes` surface** that the Pass-2 entry
probe surfaced (EN-a, EN-b — homed in S.B3 per C-25).

**The B-band is the best-probed in the plan (SPEC §2.1-11: p01, p02, p03, p07 — three confirms, one
adjusts).** The library's remaining debt is **boundary + layout, not correctness**: zero laziness
casts, one dead export in 268, LIGHT invariant intact, hot paths byte-preserved. What remains, named
and bounded:

- the `constants.ts` seam (p03: the split is clean; the win is realized only by repointing the **10
  LIGHT importers** to `constants/types` — "~55 consumers" was ceremony overcount) — **S.B1**;
- `PlaybackState` owning plumbing but not the FSM (p02: the FSM is a **public, externally-written
  surface** — 4 zones + 107 test sites + the demo's `contractAnim.t =` writes — so the honest goal is
  **single-STORAGE with accessor delegates**, and the class *grows* 442→455L) — **S.B2**;
- a service locator (`getGroupFactory`) mislabelled DI serving ONE demo caller — **S.B4**;
- the `./engine` mirror with no drift gate (p07: the loader collapse makes a runtime-vs-runtime key
  diff **vacuous** — the honest oracle is runtime keys ⊆ the `AnimationEngine` d.ts TYPE keys) —
  **S.B6**;
- the un-sub-zoned `engine/`/`compile/` interiors (p01: `engine/css/` is real cohesion; the hidden
  cost is a **10-site / 9-script gate co-edit**, and only `proof:all` catches a partial edit) —
  **S.B2/S.B3**.

**The carve-to-cohesion rule (SPEC §2.1-5, the binding stopping rule).** R's decomposition is real
but stopped at the ceiling; commit subjects literally named the arithmetic ("628→500"). **S's rule:
cohesion-first; 500L is a tripwire, not a target.** The decomposition gate gains a
**no-re-export-bridge clause**, and — binding across every S.B gate — **no born-RED gate may carry a
numeric line-count as its GREEN criterion** (line counts are observed tripwires, per S.B5's
de-numericized headroom clause; SPEC §7 T2 corollary).

**The two shipped-artifact correctness bugs (SPEC §2.1-15, homed in S.B3 per C-25).** The Pass-2 entry
probe (P2-2, live Chromium 149) discovered TWO pre-existing library-correctness bugs on the SHIPPED
`@keyframes` surface, **independent of the S.F3 feature**: **(EN-a)** `serializeEasing`
(`format.ts:43-58`) emits registry names (`ease-out-cubic`) that are not CSS `<easing-function>`s —
the browser drops the whole declaration (`animation-name: none`), so the shipped `@keyframes` artifact
is **browser-dead for most registry easings TODAY**; kf's own parser happily re-reads its registry
name, which is why the round-trip gates structurally cannot catch it — the gate needs a
**browser-parse clause**. **(EN-b)** `compileChild` swaps the WHOLE block for the densified one
(`backward.ts:289-293`) while `densifyColorBlock` builds from color declarations only — a mixed
`opacity + transform + color` track compiles (eligible, zero refusals) to a `@keyframes` that animates
ONLY the color; the `bodyByStop` override (`format.ts:212-222`) was designed for exactly this and
`compileChild` doesn't use it. These are homed in S.B3 (not parked as S.F pre-reqs) for **same-file
cohesion + honesty-first sequencing + T7 fixture co-edits already in B3's blast radius** (C-25).

**Rulings this band executes (SPEC §2.2).**

- **C-1 — `engine/css/` YES.** Create `engine/css/` (with the `css-metadata.ts → metadata.ts`
  rename). Probe-confirmed (p01: real cohesion — one importer, zero bridges, source churn 1 site).
  The measured cost is binding: the move is a **10-site / 9-script gate co-edit** (7 scripts anchor on
  `css-animation.ts`, 2 on `css-metadata.ts`), and the wave gates on **`proof:all`**, not the Q1
  subset (a wave running only `check:lib + build + proof:engine + proof:decomposition` goes green
  while 8 gates are red). Compile-side CSS-twin/serialization concerns stay in `compile/`. **S.B2
  owns C-1.**
- **C-2 — REJECT `compile/easing/`; KILL the re-export ceremony.** The real seam is FORWARD vs
  BACKWARD (zero forward↔backward edges — a18). `compile/backward/` IS created (4 files, 1,300+L);
  the two easing files stay flat; the bridge through `frame-compiler` dies. **S.B3 owns C-2.**
- **C-5 — `internal/` is the leaf tier, not a zone.** Delete the ceremony barrel (0 consumers),
  exclude `internal/` from `ZONE_DIRS` *by documented design*, add `waapi/` to `ZONE_DIRS`, derive
  the flat-sibling FAMILY set from the directory listing. The `leaf/` rename is REJECTED. **S.B4 owns
  C-5.**
- **C-9 — `adapter.ts` home → `compile/adapter.ts`.** Its output feeds `FrameCompiler.parse`.
  `validate.ts` STAYS at root as a HEAVY cross-zone facade verb. **S.B3 owns C-9.**
- **C-11 — `proof:engine-seam-split` formally KILLED.** Superseded by `proof:engine`'s body-span
  clause + the S.B2 recursive-scan fix + the no-re-export-bridge clause. Recorded in the S ledger
  (ratified at S.Z). **S.B2 executes the KILL.**
- **C-15 — the PlaybackState goal is single-STORAGE, not single-writer (p02).** The 8 FSM fields are a
  public, externally-written surface (`group/`×4, `sequence/`×2, `ingest/`, `waapi/`, 107 test sites,
  the demo's `contractAnim.t =`). The non-breaking fold is accessor delegates over a `_playback`
  backing store; the honest born-RED clause is *"no FSM field is DECLARED on the class body (accessors
  only)"*. The literal single-writer hard fold is **booked as a FUTURE BREAKING wave** (34 files;
  requires a public `seek(ms)` verb + MIGRATION; collides with S.Z3's additive-minor default) —
  explicitly out of S scope (§8; Appendix D). **S.B2 executes C-15.**
- **C-25 — EN-a and EN-b are homed in S.B3, not in S.F.** The two P2-2-discovered defects are
  library-correctness bugs on the shipped `@keyframes` surface, independent of F3. **RULING: hoist
  both into S.B3.** Consequence: S.B3's former "delete dead `declaredKeyframeBodyFor`" item is
  **REVERSED** — a18 F3's "likely-dead" call is overturned by P2-2 (F1/F5): the export is the
  load-bearing substrate EN-b threads and EN-c projects from (fold row 58 updated). **DAG edge,
  stated: S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d.**

**Mode declarations (C-14, one per wave):** S.B1 REWRITE · S.B2 REWRITE · S.B3 REWRITE · S.B4 REWRITE
· S.B5 REWRITE · S.B6 REWRITE · S.B7 REWRITE · S.B8 REWRITE (docs).

**Intra-band + cross-band DAG (SPEC §3 "The DAG").**

```
S.A0 ──► S.B1                                     (the CI surface must be green-modulo-backlog first)
S.B1 ──► S.B2 ──► S.B4, S.B6 ;  S.B1 ──► S.B3 ──► S.B4 ──► S.B5 ──► S.B7 ──► S.B8
        (B2 owns the animation.ts/playback.ts ceiling carves — B2 precedes B5 by construction)
S.B2/B3 ──► S.F1 ;  S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d ;
S.B4 ──► S.F4 ;  S.B2/B4 ──► S.F5a/b/c ;  S.B1 ──► S.F2
```

**Cross-band constraint (a19, binding through B2):** the engine↔group cycle-break requires
`KeyframesAnimation` to stay at `engine/animation.ts` through B2 — group's cycle-break import must
survive the carve (SPEC §3 DAG note; §3 S.B2).

**T-mandates this band is bound by (SPEC §7).** **T2** (no self-certifying gates — B5 targets an EMPTY
override map; no numeric line count is a GREEN criterion). **T4** (DEVELOPED ≠ SHIPPED — every wave
ships born-RED; CLOSED only when GREEN re-run on the merged tree; S.Z2 re-executes). **T5** (no
transcript trust — parallel drives re-run every touched gate from a clean checkout; "pre-existing"
claims verified by triage; node_modules symlinks never git-added). **T6** (no cosmetic excision — an
excision deletes body + tests + gates + doc mentions; governs the `.group()` ownership inversion and
the `declaredKeyframeBodyFor` REVERSAL — the export is NOT dead, so it is NOT excised). **T7** (gate
follows code, including its own coverage set — the p01 lesson: **10 sites, not 1**; a structural wave
co-edits every gate whose scan geometry it changes; the architecture MAP is a gated deliverable — B8).

---

## S.B1 — The constants seam, structural (p03 confirms)

**Mode: REWRITE.** **Deps: A0.** **Blocks:** S.B2, S.B3, S.F2.

### Charter

Split the heavy-runtime/light-type mix in `constants.ts` (fold row 34) into a **LIGHT-pure type
module** and a **value.js-bearing defaults module** behind a back-compat barrel, so a consumer
importing only types never pulls value.js into its graph. Probe-confirmed (p03 confirms-spec, SPEC
§2.1-11, §6.1 Q3): the split is clean; the win is realized only by repointing the **10 LIGHT
importers** — v1's "~55 consumers repointed" was ceremony overcount, corrected (SB-8).

### Scope items

- **S1 — The three-way split (SPEC §3 S.B1).**
  - `constants/types.ts` — **LIGHT-pure**: zero non-`import type` imports; the
    `keyof typeof timingFunctions` query **survives on a type-only binding**.
  - `constants/defaults.ts` — the **two value.js-bearing consts**.
  - a **back-compat barrel** (`constants.ts` / `constants/index.ts`).
- **S2 — The 10 mandatory LIGHT repoints (acceptance, p03 F2; SB-8).** Every LIGHT importer targets
  `constants/types`:
  1. `easing.ts`
  2. `physics/morph`
  3. `physics/numeric`
  4. `spring/timing-function`
  5. `orchestration/flip`
  6. `orchestration/stagger`
  7. `sequence/events`
  8. `sequence/sequence`
  9. `sequence/transport`
  10. `timeline/index`
  — plus the **LIGHT barrel type block**.
- **S3 — The 38 heavy importers keep the barrel** (barrel-kill optional, recorded — not gated).

### The HARD GATE

**Gate name:** `proof:boundary` + a **FILE-level clause**.

**Gate criterion (SPEC §3 S.B1; SB-8):**
1. `proof:boundary` green (the LIGHT/HEAVY static-import boundary intact).
2. **FILE-level clause:** any non-`import type` import line in `constants/types.ts` REDs (this is
   **strictly stronger** than the whole-surface boundary scan).
3. Zero light-zone module imports the bare barrel (all 10 target `constants/types`).

**Born-RED witness plan.** Today `constants.ts` mixes the value.js-bearing consts with the type
surface, so a LIGHT importer that targets the barrel drags value.js into its graph — the file-level
clause has no `constants/types.ts` to assert against yet (born-RED by absence). After the split, plant
a `import { defaults }` (a non-`import type` value import) line into `constants/types.ts` → the
file-level clause REDs; remove it → GREEN. **Falsifiability:** any non-`import type` line in
`constants/types.ts` REDs (a single value import re-poisons the LIGHT purity); any of the 10 LIGHT
modules still importing the bare barrel REDs.

### Cost + DAG

Three-file split + 10 LIGHT repoints + the LIGHT barrel type block + the file-level gate clause.
**Deps: A0** (the CI surface must be green-modulo-backlog before the boundary churn). **Blocks:**
S.B2, S.B3 (the sub-zone waves depend on the settled constants seam), S.F2.

### Verification

`proof:boundary` + the file-level `constants/types.ts` clause + the 10-repoint check. Development-only;
the gate ships born-RED (no `constants/types.ts` exists today); CLOSED only when GREEN re-run on the
merged tree (T4); S.Z2 re-executes.

---

## S.B2 — engine/ sub-zone + PlaybackState single-STORAGE + the ceiling carves (p01+p02)

**Mode: REWRITE.** **Deps: B1.** **Blocks:** S.B4, S.B6, S.F1, S.F5a/b/c.

### Charter

Create `engine/css/` (C-1, p01), fold the PlaybackState FSM to **single-STORAGE with accessor
delegates** (C-15, p02), and **pull the `animation.ts`/`playback.ts` ceiling carves FORWARD from B5
into B2** — because the delegate fold *grows* the class and B2's own gate demands
decomposition-green-with-headroom (SB-2/SB-3). The wave is gated on **`proof:all`**, not the Q1 subset
(SB-4/C-1). This wave is the p01+p02 convergence realized (SPEC §2.1-11, §6.1 Q1/Q2).

### Scope items

- **S1 — Create `engine/css/` per C-1 (p01).** `css-animation` + `metadata.ts` (the
  `css-metadata.ts → metadata.ts` rename), a **1-export barrel**, `engine/index` re-point. Real
  cohesion (p01: one importer, zero bridges, source churn 1 site).
- **S2 — The 10-site / 9-script gate co-edit, enumerated (p01 F-d; SB-4; T7).** The move perturbs
  **9 scripts** across **10 anchor sites** (7 anchor on `css-animation.ts`, 2 on `css-metadata.ts`):

  | # | Script | What it anchors |
  |---|---|---|
  | 1 | `proof-engine.mjs` | the **recursive walk** + path re-points |
  | 2 | `proof-nan-frame.mjs` | dynamic-import probe path |
  | 3 | `proof-processframe-soa.mjs` | dynamic-import probe path |
  | 4 | `proof-soa-composite.mjs` | dynamic-import probe path |
  | 5 | `proof-replay-equality.mjs` | the `CSS_ANIMATION` const |
  | 6 | `proof-diagnostics-channel.mjs` | the `CSS_ANIMATION` const |
  | 7 | `proof-composition-honored.mjs` | the `CSS_ANIMATION` const |
  | 8 | `proof-platform-adopt.mjs` | **both** css files (2 sites) |
  | 9 | `proof-no-silent-fallback.mjs` | the `css-metadata` excise-set |

  **Only `proof:all` catches a partial edit** — a wave running just `check:lib + build +
  proof:engine + proof:decomposition` goes green while 8 gates are red (C-1). **B2 is gated on
  `proof:all`.**
- **S3 — The PlaybackState fold per C-15 (p02, single-STORAGE).** The **8 run-state fields** move into
  `PlaybackState` as the **sole backing store**; the class exposes **8 accessor delegates**; the hot
  path repoints to `anim._playback.*`. **Zero-alloc preserved** (22/22 hot-path tests green in p02;
  one extra monomorphic load — a **shape cost, not an allocation**). `managed` is **correctly
  excluded**. `composition.ts` is **NOT at risk** — the `CompositionRuntime` interface insulates it
  (one line at `interpolate.ts:301`).
- **S4 — The class GROWS (SB-2, struck-and-stated).** v1's "animation.ts shrinks" is **STRUCK** — the
  delegate fold **grows** the class **442→455L**.
- **S5 — The pulled-forward ceiling carves (SB-3; fold row 33; DAG).** Because the fold pushes both
  files past 500 and B2's own gate demands decomposition-green-with-headroom, the
  **`engine/animation.ts` (499L) and `engine/playback.ts` (498L) ceiling carves are pulled FORWARD
  from B5 into B2**; **B2 precedes B5 in the DAG by construction**.
- **S6 — The remaining engine-zone hygiene (a03/a17).**
  - the narrow **`InterpContext` struct** for the hot path (a03);
  - **`element-resolve.ts` RULED → `resolve/`** (its own header votes it — a17 F5; **no in-wave open
    decision** — SB-5);
  - hoist **`public.ts` beside `load-engine.ts`** so `engine/` is zone-pure (a17 F7);
  - `group/*` imports **repointed to the engine barrel**;
  - **delete vestigial `CSSKeyframesAnimation.transform()`** (a17 F8).
- **S7 — `proof:engine-seam-split` formally KILLED (C-11).** Superseded by `proof:engine`'s body-span
  clause + the recursive-scan fix + the no-re-export-bridge clause; ratified in the S ledger at S.Z.

### The constraint (a19, binding)

`KeyframesAnimation` **stays in `engine/animation.ts`** so group's cycle-break import survives the
carve (SPEC §3 S.B2; §3 DAG). Do not relocate the base class.

### The HARD GATE

**Gate name:** `proof:engine` (recursive) + the honest FSM clause + `proof:decomposition` +
**`proof:all`**.

**Gate criterion (SPEC §3 S.B2; SB-1/SB-4):**
1. `proof:engine` (recursive walk) green over the new `engine/css/` geometry.
2. **The honest FSM clause: "no FSM transition field is DECLARED on the class body (accessor delegates
   only)"** (plant a class-body field declaration → RED).
3. `proof:decomposition` green **with headroom** (the pulled-forward carves clear the tripwire).
4. **`proof:all` green** — the 10-site/9-script co-edit is complete (a partial edit reds ≥8 gates).

**Born-RED witness plan.** Before the co-edit, `proof:engine`'s recursive walk does not know the
`engine/css/` paths and the FSM fields are DECLARED on the class body — the FSM clause REDs on the
current declaration. Plant the class-body field declaration (or leave the current declared fields) →
the FSM clause REDs; move all 8 to `PlaybackState` backing + accessor delegates → GREEN. Land the
`engine/css/` move without all 9 script re-points → `proof:all` REDs (≥8 gates fail) while the Q1
subset stays green — the exact partial-edit trap C-1 names. **Falsifiability:** a single FSM field
re-declared on the class body REDs; an incomplete gate co-edit REDs `proof:all`; a carve that leaves
`animation.ts` over the ceiling REDs `proof:decomposition` (do NOT raise the override map — those reds
ARE the backlog, T2).

### Cost + DAG

`engine/css/` create + 10-site/9-script co-edit + the PlaybackState single-STORAGE fold (8 fields → 8
delegates) + hot-path repoints + the two pulled-forward ceiling carves + the a03/a17 hygiene set + the
C-11 KILL. **Deps: B1.** **Blocks: B4, B6, S.F1, S.F5a/b/c.** **B2 precedes B5 by construction** (it
owns the animation.ts/playback.ts carves). The literal single-writer hard fold is **out of scope** —
booked as a FUTURE BREAKING wave (§8-3; Appendix D).

### Verification

`proof:engine` (recursive) + the "no FSM field DECLARED on the class body" plant + `proof:decomposition`
with headroom + **`proof:all` green**. Development-only; born-RED; re-run at S.Z2. **Zero-alloc:** the
22/22 hot-path tests stay green (p02 — one extra monomorphic load is a shape cost, not an allocation).

---

## S.B3 — compile/ sub-zone: the backward leg + ceremony kill + the two P2-2 correctness fixes (EN-a, EN-b)

**Mode: REWRITE.** **Deps: B1.** **BLOCKS S.F3/EN-c (the C-25 DAG edge — EN-c is unshippable on
today's `serializeEasing`).**

### Charter

Create `compile/backward/` on the FORWARD-vs-BACKWARD seam (C-2), kill the re-export ceremony, re-home
`adapter.ts` (C-9), and land the **two P2-2-discovered library-correctness bugs on the shipped
`@keyframes` surface — EN-a and EN-b — homed HERE per C-25** (same-file cohesion, honesty-first
sequencing, T7 fixture co-edits already in B3's blast radius). The a18-F3 "delete dead
`declaredKeyframeBodyFor`" item is **REVERSED** — the export is the EN-b/EN-c load-bearing substrate
(fold row 58).

### Scope items — the backward leg + ceremony kill

- **S1 — Create `compile/backward/`** (`backward`, `backward-walk`, `backward-color`, `format` +
  barrel — 4 files, 1,300+L; C-2, a18). The real seam is FORWARD vs BACKWARD (zero forward↔backward
  edges).
- **S2 — Delete the easing-option/selector re-export bridges** in `frame-compiler` — consumers import
  the real modules (C-2, a18).
- **S3 — Re-home `adapter.ts` → `compile/adapter.ts`** (C-9). Its output feeds `FrameCompiler.parse`.
  (`validate.ts` STAYS at root — a HEAVY cross-zone facade verb; NOT moved here.)
- **S4 — Hoist the loop-invariant 1024-sample color ramp** out of the densify midpoint loop (**~15×
  fewer samples, replay-equality-verified**; a18 F4). This is the same densify region EN-b threads.
- **S5 — Repoint deep imports:** `backward-walk → internal/animation-id` and `backward.ts → the
  ../scroll barrel` (a06 F7, a19 F2) — closing the cross-zone deep-imports.
- **S6 — Construct-or-excise the likely-dead `findComputedDrift` refusal** (a18 F7).
- **S7 — REVERSED (C-25; fold row 58): `declaredKeyframeBodyFor` is NOT deleted.** a18 F3's
  "likely-dead" call is overturned by P2-2 (F1/F5) — the export is the **EN-b/EN-c load-bearing
  substrate** (EN-b threads it via `bodyByStop`; EN-c projects the entry endpoints from it). It is
  **constructed, not excised** (T6: only genuinely dead surface is excised).
- **FrameCompiler is NOT split** — it is a sealed stateful unit (a18 F12).

### Scope item — EN-a (XS: the `serializeEasing` CSS-twin fix; P2-2 F6; fold row 73)

`format.ts:43-58` returns **hyphenated registry names** (`ease-out-cubic`) that are **not CSS
`<easing-function>`s** — the browser **drops the whole declaration**, so the SHIPPED `@keyframes`
artifact is **browser-dead for most registry easings today** (only the accidental `{linear, ease,
easeIn/Out/InOut, stepStart/End}` subset survives). **Fix:** registry name → **its CSS twin** — the
Penner set has closed-form `cubic-bezier()`s; the **universal fallback is a `linear()` densify of the
callable**; the **throw is preserved for twinless closures**. **~3 files.**

> **Born-RED gate clause (EN-a — browser-parse, verbatim):** *a browser-actuated parse of an emitted
> `easeOutCubic` artifact (computed `animation-name !== none`).* The kf-parser round-trip
> **structurally cannot catch this** — the artifact round-trips through KF but **not through the
> BROWSER** — so the clause is **browser-harness by necessity**.

**PROVEN (pass3: en-fix-proto.md §1): born-RED discharged.** A browser-parse oracle (adapted from
P2-2's `live.mjs`; playwright-core via glass-ui's install, Chrome 148 headless) REDs on the pre-fix
tree — the emitted artifact was `.a0 { animation: 250ms ease-out-cubic 1 normal forwards a0; }` (which
computes `animation-name: none` in a real browser) — and GREENs post-fix (the browser-valid 33-stop
`linear()` twin: `linear(0 0%, 0.09085 3.125%, … 0.875 50%, … 1 100%)` tracing easeOutCubic's
decelerating shape). **Patch pointer:** `src/animation/compile/format.ts` — a `NATIVE_CSS_EASING`
regex (`/^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/`) fast-path emits the
registry name verbatim ONLY when its hyphenation is a native CSS keyword; **every other registry
easing emits a `linear()` densify of the callable** (`linearDensifyEasing(fn, n = 32)`), and the
twinless-closure THROW is preserved. **Mechanism REFINED (pass3 §5.1): the `linear()` densify is the
SOLE twin mechanism — NOT a closed-form `cubic-bezier()` table** as the scope-item prose above allows.
Most Penner curves (cubic/quart/quint/expo/circ) are not a single `cubic-bezier()`, and
elastic/bounce are multi-oscillation with no bezier at all — a partial bezier table would be a
faithfulness trap; `linear(n=32)` is faithful for ALL of them and re-parses to a `.css`-carrying
**fixpoint** (`css-animation.ts:241` `cssTwinFor` matches the `linear(` prefix, so serialize → parse
→ serialize is stable). Keep the `NATIVE_CSS_EASING` keyword fast-path (byte-minimal for the common
`linear`/`ease*`/`step*` case). **~2 files** (`format.ts` + the gate; no separate test file beyond the
oracle).

### Scope item — EN-b (S: the mixed-track densify body-drop fix; P2-2 F5; fold row 74)

`compileChild` **swaps the WHOLE block for the densified one** (`backward.ts:289-293`) while
`densifyColorBlock` builds **from color declarations only** — so mixed tracks compile
**eligible-with-zero-refusals to a color-only `@keyframes`** (every non-color property silently
dropped). **Fix:** thread the densify through `keyframesBlock`'s **`bodyByStop`** — merge the color
stops **WITH** the declared non-color declarations — per **`format.ts:212-222`'s own design**.
**~3–4 files.**

> **Born-RED gate clause (EN-b — mixed-artifact, verbatim):** *a mixed `opacity+color` compile
> artifact contains BOTH properties.*

**PROVEN (pass3: en-fix-proto.md §2): born-RED discharged.** The oracle REDs on the pre-fix tree —
a mixed `opacity+transform+background-color` track compiled to a `@keyframes a1` whose block matched
`/background-color/` but **NOT** `/opacity/` (24 color-only stops; `opacity`/`transform` absent) — and
GREENs post-fix (the endpoints carry ALL declared props: `0% { background-color: …; opacity: 0;
transform: translateY(20px); }` … `100% { …; opacity: 1; transform: translateY(0px); }`, the
intermediate color-only stops unchanged). **Patch pointers (3 files):**
`src/animation/compile/backward-color.ts` — `densifyColorBlock` **changes its return contract**
`{ block: string }` → `{ byPct: Map<number, string[]>; keys: string[] }` (returns the raw
per-percentage color declarations + the changing color keys, not a finished color-only block);
`src/animation/compile/backward.ts` — `compileChild` (`:289-293`) **merges instead of whole-block
swap** (`densifiedKeyframesBlock(animation, name, densify)` where it read `densify.block`);
`src/animation/compile/format.ts` — a new **percentage-keyed** `densifiedKeyframesBlock` +
`declaredDeclsExcluding` helper. **Refinement REVISED from the scope-item wording (pass3 §5.2): the
merge is PERCENTAGE-keyed, NOT `keyframesBlock`'s index-keyed `bodyByStop`.** The densify's
intermediate stops have no template index (16–24 `oklab()` stops between each declared pair), so
`bodyByStop` (keyed by stop INDEX, iterating `templateFrames`) structurally cannot hold them — the
spec's "thread through `keyframesBlock`'s `bodyByStop`" is realized as the sibling percentage-keyed
merge, the correct realization of the same intent (color stops merged WITH the declared non-color
decls; a property interpolates only across the stops that DECLARE it, so the intermediate color-only
stops leave `opacity`/`transform` to interpolate linearly between declared endpoints exactly as
before). The `keys` return also lets EN-b **preserve STATIC (unchanging) colors** (not in `keys` →
ride the verbatim declared projection), which the whole-block swap did not distinguish.
`densifyColorBlock` is a **single caller** (`compileChild`; verified by grep). **Cleanup item (pass3
§5.2, optional wave tidy):** the merge now owns block assembly, so **drop the now-unused `name` param
from `densifyColorBlock`** — the prototype keeps it + a `void name;` to minimize the diff; the real
wave should excise the dead parameter.

### T7 fixture co-edit (binding, same commit)

EN-a and EN-b **change existing emit** — the `proof:compile-replay` / `proof:compile-deterministic`
fixtures are **co-edited in the same commit** (SPEC §3 S.B3; C-25; SPEC §7 T7). The fixtures encode
the current (buggy) emit; they must be regenerated from the corrected emit atomically with the fix.

**T7 confirmed BENIGN for the existing fixtures (pass3: en-fix-proto.md §4) — an eyeball note, not a
weakening.** In the prototype, EN-a broadened the emit (default `easeInOutCubic` and every Penner name
now serialize to `linear()` in the `.class` block instead of a broken `ease-*-cubic` token), yet
**every** compile/roundtrip/replay gate stayed green **WITHOUT** fixture co-edits — the existing
fixtures parse the artifact (they do not byte-compare the broken easing token) and the `linear()`
fixpoint keeps the round-trip stable. So the T7 co-edit is a **precaution that did not bite here**; it
remains binding in principle, but the real wave's obligation is narrowed to **eyeballing any fixture
that asserts a specific `.class` easing string** (regenerate only those), not a blanket fixture
regen.

### The HARD GATE

**Gate criterion (SPEC §3 S.B3):** the born-RED clauses —
1. **`compile/` root holds ONLY the forward set** (the backward leg is under `compile/backward/`).
2. **No re-export-only bridge module anywhere in `src/animation`** (the ceremony is dead; C-2, C-11's
   no-re-export-bridge clause).
3. **No cross-zone deep-import** (S5's repoints).
4. **The EN-a browser-parse clause** (emitted `easeOutCubic` → computed `animation-name !== none`) —
   **a BROWSER-HARNESS gate, enrolled in the browser-harness (`demo-correctness`) chain, NOT a
   `hygiene-chain`/jsdom slot** (tier-wiring PROVEN below).
5. **The EN-b mixed-artifact clause** (mixed `opacity+color` artifact contains BOTH properties) — its
   **jsdom-viable string half** (artifact contains `opacity`/`transform`) folds into
   `proof:compile-replay`/`test/compile-roundtrip.test.ts` for fast local bite; its **browser half**
   (props actually animate) rides the same browser-harness gate as clause 4.

**Gate tier-wiring (PROVEN — pass3: en-fix-proto.md §5.3; matches SPEC-v3.md:945-949).** The EN-a
browser-parse clause is a **BROWSER-HARNESS gate, not a jsdom `proof:library-correctness` /
`proof:hygiene-chain` gate** — this is load-bearing. jsdom's `getComputedStyle` does **NOT** drop an
invalid `animation` shorthand, so the bug is **INVISIBLE in jsdom** (precisely why P2-2 F6 evaded
every existing jsdom round-trip gate); a jsdom slot would be a **FALSE green** AND would **correctly
RED under S.A4's symmetric mis-tier clause**. Concretely: wire a new **`proof:compile-browser-parse`**
(this oracle's EN-a clause, playwright) into the **`proof:correctness` chain beside
`proof:entry-roundtrip`** (the browser-actuating library-value roster — `proof:vt-roundtrip`,
`proof:entry-roundtrip`, and this EN-a clause enroll there, with their library-value severity recorded
in their taxonomy rows). Keep EN-b's string half in `hygiene-chain` for fast bite; its browser half
rides `proof:correctness`. **This reconciles the S.B3 gate criterion:** clauses 4 (and EN-b's browser
half) are browser-harness members, not jsdom members.

**Born-RED witness plan.** Today: `compile/`'s root holds the backward files (clause 1 REDs after the
move is specified but before it lands); a re-export bridge exists in `frame-compiler` (clause 2 REDs);
an emitted `easeOutCubic` artifact computes `animation-name: none` in the browser (**EN-a clause REDs
— live-proven by P2-2 against the UNMODIFIED dist**); a mixed `opacity+color` artifact contains ONLY
the color property (**EN-b clause REDs — live-proven by P2-2**). Each fix flips its clause: the CSS-twin
table + `linear()` fallback greens EN-a; threading `bodyByStop` greens EN-b; the `compile/backward/`
move + bridge deletion greens clauses 1–3. **Falsifiability:** re-adding a re-export bridge REDs;
leaving a backward file in `compile/` root REDs; an emitted registry-name easing that the browser drops
REDs EN-a; a mixed track that drops its non-color property REDs EN-b. **The kf-parser round-trip cannot
substitute for the browser-parse clause** — that is the whole point of EN-a's browser-harness gate.
**PROVEN (pass3: en-fix-proto.md §3–4): both clauses discharged red-pre → green-post.** The oracle
(`test/en-fix-oracle.test.ts`, the wave's gate skeleton) is **1 failed (PRE) → 1 passed / 2 tests
(POST)**; pre-fix RED signatures verbatim — EN-a `expected '@keyframes a0 {…}' not to match
/animation:[^;{]*\bease-out-cubic\b/`, EN-b `opacity dropped by the densify swap: expected
'@keyframes a1 {…background…' to match /opacity/`. **Regression (POST-fix, worktree):** `npm run
check:lib` 0 errors; **all six compile proof gates** green (`proof:compile-replay` 17,
`proof:compile-deterministic` 1, `proof:replay-equality` 5, `proof:roundtrip-easing` 7 (1 skip),
`proof:roundtrip-fidelity` 29, `proof:grammar-fuzz` 5) + `test/format.test.ts`; **71 targeted vitest
tests green**; the full library `vitest run` is **90 files pass · 914 pass / 2 expected-fail / 1
skip** (the 8 demo-scene resolve failures are pre-existing `@mkbabb/keyframes.js` self-import misses,
identical on unmodified HEAD — out of the compile zone). Three source files touched
(`compile/{format,backward,backward-color}.ts`) + the one new oracle test.

### Cost + DAG

`compile/backward/` create (4 files) + bridge deletion + `adapter.ts` re-home + the color-ramp hoist +
2 deep-import repoints + the `findComputedDrift` construct-or-excise + EN-a (~3 files) + EN-b (~3–4
files) + the `compile-replay`/`compile-deterministic` fixture co-edit (same commit). **Deps: B1.**
**BLOCKS S.F3/EN-c** (C-25 DAG edge: `S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d`; EN-c is
unshippable on today's `serializeEasing`).

### Verification

The five born-RED clauses (compile-root-forward-only; no-re-export-bridge; no-deep-import; EN-a
browser-parse; EN-b mixed-artifact) + the co-edited replay/deterministic fixtures green.
Development-only; born-RED (EN-a/EN-b live-proven RED against the unmodified dist by P2-2); re-run at
S.Z2. **The EN-a + EN-b halves are PROVEN wave-ready (pass3: en-fix-proto.md): both clauses discharged
red-pre → green-post in an isolated worktree via the browser-parse oracle, with `check:lib` + the six
compile gates + 71 vitest green (§§1–4).** The C-25 DAG edge is confirmed by the prototype: **EN-c is
unshippable on today's `serializeEasing`** — the entry emitter's easing channel would emit
browser-dead `ease-*-cubic` tokens, so EN-a is the hard prerequisite and EN-b the substrate EN-c's
endpoint projection reads (`S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d`, unchanged).

---

## S.B4 — Barrel purity, ownership inversion, zone normalization

**Mode: REWRITE.** **Deps: B2, B3.** **Blocks:** S.B5, S.F4.

### Charter

Normalize every zone barrel to one stated policy, invert the `getGroupFactory` service locator to
genuine ownership (`AnimationGroup.of()`), and close the remaining barrel/cycle debt — with the v1
type-ring stretch **de-scoped to §8** (B4 is NOT gated on it; sb prune).

### Scope items

- **S1 — resolve/ barrel split.** `resolve/index.ts → thin barrel + resolve/core.ts +
  resolve/spring-css.ts` (the **`resolveNode` injection seam untouched** — a19 F9).
- **S2 — Timeline family out of `orchestration/timeline/index.ts`** (r3 F4).
- **S3 — Delete the 3 dead resolve barrel re-exports + the scroll scene→range relay** (a19 F3/F4).
- **S4 — `internal/` leaf-tier ruling (C-5).** Delete the **zero-consumer `internal/index.ts`**;
  exclude `internal/` from `ZONE_DIRS` by documented design; **add `waapi/` to `ZONE_DIRS`**; derive
  the flat-sibling FAMILY set from the directory listing. The `leaf/` rename is REJECTED.
- **S5 — One stated barrel policy, gated (a02 F4):** explicit-named exports = public; `export-*` =
  internal-only.
- **S6 — Rename the 3 colliding basenames** (`options` / `playback` / `scheduler`) (r3 F7).
- **S7 — Ownership inversion (a06 F1/F2; fold row 36).** Excise `KeyframesAnimation.group()`; delete
  `internal/group-factory.ts` + the **register side-effect**; add **`AnimationGroup.of()`**; migrate
  the **one caller (`KeyframesEditor.vue`)**. The service locator served exactly ONE demo caller.
- **S8 — `group/types.ts` leaf** (a04).
- **S9 — `svg/handle.ts` abstract base** closing the **`MotionPath.finished` asymmetry by
  construction** (a20 F6; fold row 59).
- **S10 — DRY the `transport.ts` prefersReducedMotion copy** through `internal/reduced-motion` (a16
  F3; fold row 60).
- **S11 — The v1 stretch is MOVED to §8 (sb prune; Appendix D).** Collapsing the 26 type-only rings +
  deleting the `viaOnly` exemption is **optional cleanup**; **B4 is not gated on it**.

### The HARD GATE

**Gate criterion (SPEC §3 S.B4):**
1. **`no-flat-siblings`** with the **derived FAMILY** set + the **`waapi/`/`internal/` ruling** (C-5).
2. **Barrel-policy clause** (explicit-named public / `export-*` internal-only; a02 F4).
3. **depcruise green with `group → engine` one-directional** — **plant a re-added `.group()` → RED**
   (the ownership inversion is enforced by the cycle direction).

**Born-RED witness plan.** Today `KeyframesAnimation.group()` + `internal/group-factory.ts` create the
group→engine→group service-locator loop; `internal/index.ts` has zero consumers; `waapi/` is absent
from `ZONE_DIRS`. Plant a re-added `.group()` method (or leave the current one) → the depcruise
one-directional clause REDs. After the inversion (`AnimationGroup.of()` + caller migration + factory
deletion), depcruise is one-directional and the plant REDs on re-addition. **Falsifiability:** a
re-added `.group()` REDs; a flat sibling not in the derived FAMILY REDs `no-flat-siblings`; a public
symbol exported via `export-*` (or an internal via explicit name against policy) REDs the barrel-policy
clause.

### Cost + DAG

resolve/ split + Timeline extraction + 4 dead-relay deletions + the `internal/` C-5 ruling +
`ZONE_DIRS` waapi add + the barrel policy + 3 basename renames + the ownership inversion (excise
`.group()` / delete factory / add `.of()` / migrate `KeyframesEditor.vue`) + `group/types.ts` leaf +
`svg/handle.ts` base + the transport DRY. **Deps: B2, B3** (paths must be settled). **Blocks: B5, S.F4**
(S.F4 needs the frozen `scroll/scene.ts` takeover surface B4 provides — the named wave that replaces
v1's vague "B-zone stable"). The type-ring stretch is §8 (Appendix D).

### Verification

`no-flat-siblings` (derived FAMILY + waapi/internal ruling) + the barrel-policy clause + depcruise
`group→engine` one-directional with the re-added-`.group()` plant. Development-only; born-RED; re-run
at S.Z2.

---

## S.B5 — Near-ceiling pre-carve (remainder) + the last override, terminally

**Mode: REWRITE.** **Deps: B2, B3, B4.** **Blocks:** S.B7.

### Charter

Carve the **remaining four near-ceiling files** at their **cohesion seams** (the animation.ts/playback.ts
carves already landed in B2), split the presets data volume, and **DELETE the last
`LIBRARY_CEILING_OVERRIDE` entry and the emptied Map itself — completing R.W0's keystone** (a20 F5, r2
finding 12; fold rows 32/33).

### Scope items

- **S1 — The remaining four cohesion carves (fold row 33 remainder):**
  - **`group/group` (496L)** → carve `group/lifecycle.ts` for the transport verbs (a19 F1);
  - **`compile/frame-compiler` (499L)** — carve at its cohesion seam;
  - **`physics/spring/progress` (499L)** — carve at its cohesion seam;
  - **`orchestration/sequence/sequence` (499L)** — carve at its cohesion seam.
- **S2 — Split `presets/classic.ts` (728L)** → **`classic-data.ts` (the 34 CSS-string constants)** +
  factory logic (fold row 32; the data-volume split).
- **S3 — DELETE the last `LIBRARY_CEILING_OVERRIDE` entry** and, emptied, **the Map itself** —
  completing R.W0's keystone (a20 F5, r2 finding 12; T2). This is the terminal removal the keystone
  override-deletion was supposed to reach.

### The HARD GATE

**Gate name:** `proof:decomposition` (EMPTY override map + headroom clause) + no-re-export-bridge.

**Gate criterion (SPEC §3 S.B5; T2):**
1. `proof:decomposition` runs with an **EMPTY override map** (the Map is deleted, not merely emptied
   of one entry — the data structure is gone).
2. **Max file ≤ ~460L** — a **headroom clause: a tripwire the carves must clear, NOT a target to park
   under** (SPEC §2.1-5; **no numeric line count is the GREEN criterion** — the ≤460L is an observed
   tripwire, per T2 corollary).
3. **The no-re-export-bridge clause holds** (no carve ships as re-export ceremony — the a18 lesson).

**Born-RED witness plan.** Today the four files sit at 496–499L and `LIBRARY_CEILING_OVERRIDE` still
carries its last entry (the R.W0 keystone incomplete). Deleting the override entry BEFORE the carves
land → `proof:decomposition` REDs (the four files exceed the tripwire with no override to mask them) —
those reds ARE the backlog (T2: do NOT re-add the override). After the carves clear ≤~460L with the
Map deleted, GREEN. **Falsifiability:** re-adding any `LIBRARY_CEILING_OVERRIDE` entry REDs (T2: a cap
raised vs the prior tranche is a hard RED); a carve shipped as a pure re-export bridge REDs the
no-re-export-bridge clause; a file left over the tripwire REDs (continue carving — do NOT raise the
ceiling).

### Cost + DAG

Four cohesion carves + the presets data split + the terminal override-Map deletion. **Deps: B2, B3,
B4** (B2 already owns the animation.ts/playback.ts carves; B5 handles the remaining four). **Blocks:
B7** (paths must be final before the test/bench regroup).

### Verification

`proof:decomposition` with the EMPTY override Map + the ≤~460L headroom tripwire + no-re-export-bridge.
Development-only; born-RED (deleting the last override entry reds the four near-ceiling files until
carved); re-run at S.Z2.

---

## S.B6 — Type surface + the `./engine` drift gate (p07 confirms, gate redefined)

**Mode: REWRITE.** **Deps: B2.**

### Charter

Flip the generic defaults from `= any` to `= Vars`, strip the leaked privates from the roll-up, and —
the **mandatory item** — land the **redefined `./engine` drift gate**: **runtime keys ⊆ the
`AnimationEngine` d.ts TYPE key list** (p07/sb-#6; a runtime-vs-runtime `Object.keys()` diff is
**vacuous** once the loader sources from the same import). Two items are **surfaced as version-ruling
inputs** to the owner (not silently defaulted); the loader collapse is **decoupled and demoted to an
owner-recordable option** (fold rows 37/38; SPEC §6.3).

### Scope items

- **S1 — Flip the 11 `= any` generic defaults to `= Vars`; unify SVG generics to `extends Vars`**
  (a29 F1/F2). **Flagged as a version-ruling input (SPEC §6.3-(i)):** the d.ts narrowing is
  **source-breaking** for consumers who passed arbitrary property bags — minor or major? Default
  remains additive-minor; the ruling lands at S.Z3.
- **S2 — `@internal` tagging + API-Extractor trimmed roll-up** (strip the **126 leaked privates**).
  **The second version-ruling input (SPEC §6.3-(ii)):** does the 126-leaked-private strip count as
  "published-surface removal" for the C-18 changelog gate? Default additive-minor; ruling at S.Z3.
- **S3 — `proof:dts-rollups-agree` frozen NOW**, before zoning churns options (a29 F5).
- **S4 — The mandatory drift GATE, redefined (p07/sb-#6; fold row 37).** `proof:engine-subpath-mirror`
  asserts **runtime keys ⊆ the `AnimationEngine` d.ts TYPE key list** (derived from the built roll-up
  or the interface AST). A **runtime-vs-runtime `Object.keys()` diff is vacuous** once the loader
  sources from the same import (both sides read **39/39 from one module**; the born-RED plant "delete a
  public.ts re-export" **stays GREEN** under the runtime-vs-runtime form — which is why it is redefined
  to the TYPE-diff form). SB-6/X2-9.
- **S5 — The loader-collapse DECOUPLED (sb-#7; §8-5; owner option, SPEC §6.3).** The
  `loadAnimationEngine → import("./engine/public")` collapse is **demoted to an owner-recordable
  option** — the TYPE-diff gate ships **whether or not** the collapse ships. p07 measured the collapse
  **behaviorally neutral** (the loader already `Promise.all`-awaited everything — there was never
  per-symbol lazy splitting): **−100 LOC, −6% JS bytes, 23→5 dist files, ONE 97.32 kB engine chunk,
  dynamic engine chunks 2→1, drift-proof by construction** — at the cost of **foreclosed
  partial-engine splitting for a consumer that does not exist today**. Recorded for the owner (SPEC
  §6.3; Appendix D-3).
- **S6 — dts-plugin soft-fails → hard build failures** (a08 F2).
- **S7 — `FrameUnderConstruction<V>`** for the `undefined as unknown as V` holes (a29 F7).
- **S8 — value.js dispatch: PropertyDescriptor rename** (a29 F3).

### The HARD GATE

**Gate name:** `proof:engine-subpath-mirror` (TYPE-diff form) + `proof:no-any-default`.

**Gate criterion (SPEC §3 S.B6):**
1. **`proof:engine-subpath-mirror` in the TYPE-diff form** — runtime keys ⊆ the `AnimationEngine` d.ts
   TYPE key list. **Born-RED plant: add a runtime key to `engine/public` without the interface field
   → RED.**
2. **`proof:no-any-default` over the built d.ts** — no `= any` generic default survives.

**Born-RED witness plan.** Today the runtime-vs-runtime `Object.keys()` mirror is **vacuous** (both
sides read 39/39 from one module — the "delete a public.ts re-export" plant stays GREEN, proving the
old gate is a rubber stamp). Redefine to the TYPE-diff form; plant a runtime key added to
`engine/public` **without** the matching `AnimationEngine` interface field → the TYPE-diff gate REDs
(the old form would not). The 11 `= any` defaults red `proof:no-any-default` on the current d.ts until
flipped to `= Vars`. **Falsifiability:** a runtime export with no TYPE-key counterpart REDs; a
surviving `= any` default REDs; the gate holds **whether or not the loader collapse ships** (decoupled
by construction).

### Cost + DAG

11 `= any` flips + SVG generic unify + `@internal` tag pass + trimmed roll-up (126 privates) +
`dts-rollups-agree` freeze + the TYPE-diff gate redefinition + dts-plugin hard-fail + the
`FrameUnderConstruction<V>` holes + the PropertyDescriptor dispatch. **Deps: B2.** The **loader
collapse is an owner option** (§6.3; §8-5), not a B6 deliverable. The **two version-ruling inputs**
(S1 narrowing; S2 private-strip) surface to the owner at **S.Z3/§6.3** — not silently defaulted.

### Verification

`proof:engine-subpath-mirror` (TYPE-diff form, with the runtime-key-without-interface-field plant) +
`proof:no-any-default` over the built d.ts. Development-only; born-RED; re-run at S.Z2. The two version
questions are owner rulings at S.Z3 (Appendix D; SPEC §6.3).

---

## S.B7 — Test + bench perimeter

**Mode: REWRITE.** **Deps: B2–B5 (paths final).** **Blocks:** S.B8.

### Charter

Land the `test/<zone>/` regroup as ONE diff with the sub-zoning, pull `bench/` and `tsconfig.test.json`
under type-check, cover the 5 uncovered scene composables, remove the private-spy footguns, and land
the **`KfPillTabs.test.ts` interaction-axis fixes** for the a12 F1/F2 HIGH keyboard defect + the
TransportDock auto-repeat (fold row 71 — the B7 half; the D2 half is the panel-primitive promotion).

### Scope items

- **S1 — `test/<zone>/` regroup + vitest glob widen**, landed as **ONE diff with the sub-zoning**
  (a25).
- **S2 — `tsconfig.test.json` into the `check` roster** (a04 F4).
- **S3 — `bench/` under type-check + fix the 9 stale `Animation<...>` sites** in
  `waapi-densify.bench.ts` (a15 F1; fold row 39).
- **S4 — Composable tests for the 5 uncovered scenes** (a25 F1; fold row 40).
- **S5 — Remove the `vi.spyOn(private)` footguns** via a **documented composite seam** (a04 F5).
- **S6 — `KfPillTabs.test.ts` + the interaction-axis fixes (fold row 71; a12 F1/F2 HIGH; T8):**
  **arrow-moves-focus**, **keyup actuation**, **press-origin guard** — the roving-tabindex
  keyboard-broken defect (keyboard traversal collapses after one hop; a 3rd tab unreachable) + the
  **TransportDock auto-repeat**. **The KfPillTabs test is B7's gate** (se-B6: KfPillTabs is a **panel primitive**, not scene-nav —
  the old NOT-the-stage-band attribution is moot since the 2026-07-03 S.E shelf; its D2 promotion to
  the standard panel primitive is a separate concern).

### The HARD GATE

**Gate criterion (SPEC §3 S.B7):**
1. **`npm run check` covers `test/` + `bench/`** — **plant a private-access in a test → RED** (the
   private-spy footgun is now type-checked out).
2. **The 5 scenes each referenced from `test/`** (composable coverage lands).
3. **`KfPillTabs.test.ts` green** (arrow-moves-focus, keyup actuation, press-origin guard — the
   interaction-axis assertions pass).

**Born-RED witness plan.** Today `bench/` and `tsconfig.test.json` are outside the typecheck (the 9
stale `Animation<...>` sites in `waapi-densify.bench.ts` are invisible to `check`); the 5 scenes have
zero composable coverage; `KfPillTabs` fails keyboard traversal after one hop (a12 F1/F2, HIGH). Plant
a `vi.spyOn(private)` or a private-access in a test → `check` REDs once the test tsconfig is in the
roster. The `KfPillTabs.test.ts` interaction-axis assertions RED against the current
keyboard-broken/auto-repeat behavior and GREEN after the arrow-moves-focus / keyup-actuation /
press-origin fixes. **Falsifiability:** a private-access surviving in a test REDs; an uncovered scene
composable REDs the reference check; a keyboard traversal that collapses after one hop REDs
`KfPillTabs.test.ts`.

### Cost + DAG

`test/<zone>/` regroup (one diff) + `tsconfig.test.json` + `bench/` typecheck + 9 stale bench-type
fixes + 5 scene composable tests + the composite-seam private-spy removal + `KfPillTabs.test.ts` + the
3 interaction-axis fixes + the TransportDock auto-repeat fix. **Deps: B2–B5** (paths must be final).
**Blocks: B8.** **This is the T8 gate-blindspot cure** (an interaction-axis test for a hand-rolled
primitive, not only a source-shape gate; SPEC §7 T8).

### Verification

`npm run check` over `test/` + `bench/` (with the private-access plant) + the 5-scene reference check +
`KfPillTabs.test.ts` green. Development-only; born-RED; re-run at S.Z2.

---

## S.B8 — The library map, regenerated once

**Mode: REWRITE (docs).** **Deps: B1–B7 complete.**

### Charter

Full rewrite of `src/animation/CLAUDE.md` against the **post-B tree** (gate-first, regen-last — C-8:
the born-RED `proof:claude-paths-live` gate landed at S.A5; the full regen lands HERE against the final
tree). Root `CLAUDE.md` zone roster + HEAVY list **regenerated mechanically** from AnimationEngine keys
(fold row 41 — the S.B8 half; the S.A5 half is the gate).

### Scope items

- **S1 — Full rewrite of `src/animation/CLAUDE.md`** against the post-B tree (the file R.W7 delegated
  "authoritative per-file inventory" status to, describing the deleted flat tree, the renamed
  `Animation` class, the excised `animate()`, a dead `ScrollTimeline` export, and a `parse-that`
  dependency that no longer exists — SPEC §2.1-4).
- **S2 — Root `CLAUDE.md` zone roster + HEAVY list regenerated mechanically from AnimationEngine
  keys** (not hand-authored — derived so it cannot drift).
- **S3 — The two-'in' policy stated once** (the honest API "in" — R's DEVELOPED lesson).
- **S4 — Era-comment policy applied opportunistically** (r3 F5/F8, a30).

### The HARD GATE

**Gate name:** `proof:claude-paths-live` (was born-RED at S.A5).

**Gate criterion (SPEC §3 S.B8; C-8):** `proof:claude-paths-live` **green** — every backtick
path/symbol in root + `src/animation` + `demo` CLAUDE.md resolves on disk / in the built surface; the
HEAVY export list ⊆ AnimationEngine keys.

**Born-RED witness plan.** The gate is born-RED at S.A5 (the current CLAUDE.md references a deleted flat
tree, etc.); S.A5's hot-fix clears the actively-dangerous lines but full path-resolution GREEN is
reached only **after S.B8 regenerates `src/animation/CLAUDE.md` against the final post-B tree** (C-8).
Every path/symbol in the regenerated map must resolve; the mechanically-derived HEAVY list must equal
the AnimationEngine key set. **Falsifiability:** any backtick path/symbol that does not resolve on disk
/ in the built surface REDs; any HEAVY export not in the AnimationEngine key set REDs; a hand-edited
zone roster that drifts from the derived keys REDs.

### Cost + DAG

Full `src/animation/CLAUDE.md` rewrite + the mechanical root-doc regen + the two-'in' policy statement
+ the era-comment pass. **Deps: B1–B7 complete** (the tree must be final). This wave **GREENs the gate
that S.A5 planted born-RED** (fold row 41; C-8).

### Verification

`proof:claude-paths-live` green (was born-RED at S.A5; GREEN reached across A5 hot-fix → B8 regen).
Development-only; re-run at S.Z2.

---

## Appendix A — Fold rows this band owns (SPEC §4, verbatim dispositions)

Every §4 chronic/deferral fold row whose S-disposition names an S.B wave, restated so an implementer
need not consult SPEC-v3. **"Terminal" uses C-20's structural definition** (a deterministic re-shaped
gate or an owner-ratified KILL with a re-run witness — never observe-in-CI / WATCH / a re-verify verb);
every disposition is re-derived from a locally-reproduced signature at impl, never inherited from the
table (SPEC §4 header).

| # | Item | Born | Chronicity | S-disposition |
|---|------|------|-----------|---------------|
| 32 | presets/classic.ts last ceiling override | Q→R | 2 | **WAVE S.B5** (data split; override map emptied — R.W0's keystone completed) |
| 33 | Six files at 488–499L (pre-red) | R.W2b | new | **WAVES S.B2 (animation.ts 499 + playback.ts 498 — pulled forward, p02) + S.B5 (the remaining four)** |
| 34 | constants.ts heavy-runtime/light-type mix | pre-R | old | **WAVE S.B1** (p03-confirmed; 10 light repoints + the file-level gate clause) |
| 35 | PlaybackState half-carve (FSM on class) | R.W2 | new | **WAVE S.B2** (C-15: single-STORAGE accessor fold; declared-only gate; hard fold booked as future BREAKING — §8) |
| 36 | getGroupFactory service locator (1 caller) | R.W2c | new | **WAVE S.B4** (ownership inversion) |
| 37 | ./engine mirror drift-ungated; triple surface | R.W4b | new | **WAVE S.B6** (TYPE-diff drift gate — p07; loader collapse = owner option, §6) |
| 38 | d.ts: 11 `=any` defaults; 126 privates; dual roll-ups | Q–R | old | **WAVE S.B6** (+ the two version-ruling inputs surfaced at S.Z3/§6) |
| 39 | bench/ + test/ outside typecheck; waapi-densify 9 stale types | R-fallout | new | **WAVE S.B7** |
| 40 | 5 scenes zero composable test coverage | R.W5 | new | **WAVE S.B7** |
| 41 | src/animation/CLAUDE.md pre-R (9 lanes); root doc drift | Q | 2 | **WAVES S.A5 (gate) + S.B8 (regen)** — S.B owns the **S.B8 regen half** |
| 58 | declaredKeyframeBodyFor "dead export" | Q | 1 | **WAVE S.B3 — REVERSED at Pass-2** (a18 F3 overturned by P2-2 F1/F5: the export is the EN-b/EN-c load-bearing substrate; constructed, not deleted) |
| 59 | MotionPath.finished asymmetry | O | 2 | **WAVE S.B4** (svg/handle.ts abstract base — closed by construction) |
| 60 | transport.ts hand-rolled prefersReducedMotion | R.W2b | new | **WAVE S.B4** (DRY through internal/reduced-motion) |
| 71 | **KfPillTabs roving-tabindex keyboard-broken + TransportDock auto-repeat (a12 F1/F2, HIGH)** — keyboard traversal collapses after one hop; a 3rd tab unreachable | R (DM-1/DM-5 replacements) | new | **WAVES S.B7 (KfPillTabs.test.ts + arrow-moves-focus / keyup-actuation / press-origin fixes) + S.D2 (promotion to the standard panel primitive)** — the **S.B7 half is this band's** (se-B6: a panel primitive, not scene-nav; the old NOT-the-stage-band attribution is moot since the S.E shelf) |
| 73 | **serializeEasing emits browser-invalid easing names — the shipped `@keyframes` artifact is browser-dead for most registry easings** (computed `animation-name: none`; kf-parser round-trip structurally cannot see it) — P2-2 F6 | pre-Q (found P2-2) | new | **WAVE S.B3/EN-a** (CSS-twin table + `linear()` fallback; born-RED **browser-parse** gate clause — C-25) |
| 74 | **compileChild whole-block densify swap drops every non-color property on mixed tracks** (`backward.ts:289-293`; eligible-with-zero-refusals color-only artifact) — P2-2 F5 | O–Q (found P2-2) | new | **WAVE S.B3/EN-b** (thread `bodyByStop` per format.ts's own design; born-RED mixed `opacity+color` artifact-content gate — C-25) |

---

## Appendix B — Critique disposition rows (SPEC §9 sb-library, 9 edits)

The band's traceability to the critique fleet — every sb-library blocking edit and its absorption site
(SPEC §9). All ABSORBED; none DISPUTED.

| # | Edit | Absorbed at |
|---|------|-------------|
| SB-1 | Reword the B2 FSM gate to "no FSM field DECLARED on the class body — accessors only"; goal = single-STORAGE | **ABSORBED** C-15, §3 S.B2 (this doc S.B2 gate) |
| SB-2 | Strike "animation.ts shrinks" — the delegate fold GROWS the class 442→455L | **ABSORBED** §3 S.B2 (struck + stated — this doc S.B2/S4) |
| SB-3 | Pull the animation.ts(499)/playback.ts(498) ceiling carves forward from B5 into B2; state it in the DAG | **ABSORBED** §3 S.B2, §3 S.B5, §3 DAG, fold row 33 (this doc S.B2/S5 + S.B5/S1) |
| SB-4 | Enumerate B2's 9-script/10-site gate co-edit; gate B2 on proof:all, not the Q1 subset | **ABSORBED** §3 S.B2 (enumerated table + proof:all), C-1 (this doc S.B2/S2) |
| SB-5 | RULE element-resolve.ts's home in B2 (→ resolve/) instead of "decide" | **ABSORBED** §3 S.B2 (this doc S.B2/S6 — RULED → `resolve/`, no in-wave decision) |
| SB-6 | Redefine proof:engine-subpath-mirror: runtime keys ⊆ AnimationEngine d.ts TYPE keys (runtime-vs-runtime is vacuous post-collapse) | **ABSORBED** §3 S.B6 (this doc S.B6/S4) |
| SB-7 | Decouple the mandatory drift GATE from the optional loader collapse; record the 23→5-chunk/97kB/foreclosed-split cost for the owner | **ABSORBED** §3 S.B6, §6.3 (this doc S.B6/S5 + Appendix D-3) |
| SB-8 | Sharpen B1's gate to a FILE-level assertion; acceptance = 10 LIGHT repoints (heavy keeps the barrel); correct "~55 consumers" | **ABSORBED** §3 S.B1 (this doc S.B1 gate + the 10-repoint list) |
| SB-9 | Book the literal single-writer hard fold as a FUTURE BREAKING wave, explicitly out of S scope | **ABSORBED** C-15, §8-3 (this doc Appendix D-1) |

**Cross-cutting absorptions touching S.B (SPEC §9 x1/x2):** X1-1 (fold row 71 — the KfPillTabs HIGH
defect; the S.B7 half owns the test + the three interaction-axis fixes); X2-3 (reframe S.B2's clause to
"no FSM field DECLARED on the class body"; sequence B2 before B5 — C-15, §3 S.B2, §3 DAG); X2-9
(`proof:engine-subpath-mirror` diffs the `AnimationEngine` TYPE key list, not two runtime
`Object.keys()` sets — same absorption as SB-6, §3 S.B6). **Probe absorption (SPEC §9 probe index):**
p01 → C-1, S.B2 (10-site co-edit; proof:all) · p02 → C-15, S.B2, §8-3 (single-STORAGE; growth; carves
forward) · p03 → S.B1 (10 repoints; file-level gate) · p07 → S.B6, §6.3 (type-diff gate; collapse =
owner option; the chunk-graph question recorded). **Pass-2 addendum:** P2-2.2 → C-25 (EN-a/EN-b HOMED
IN S.B3 — same-file cohesion, honesty-first sequencing, T7 fixture co-edits in B3's blast radius; DAG
edge S.B3 → EN-c stated), §3 S.B3, fold rows 73/74; the a18-F3 `declaredKeyframeBodyFor` deletion
REVERSED (fold row 58).

---

## Appendix C — DEV→IMPL boundary (binding for every S.B wave)

Every wave above is **DEVELOPMENT ONLY** (SPEC §1 "What S is NOT"). Each ships a falsifiable **born-RED
gate**; nothing runs until the owner authorizes an impl drive (inv-16). A wave is **CLOSED only when
its born-RED gate is GREEN re-run on the merged tree** (T4, r2 F4), exit code recorded in PROGRESS.md;
**S.Z2 re-executes that oracle at close** (a re-run, not a re-read). Parallel drives re-run every
touched gate from a clean independent checkout — "pre-existing" claims are verified by triage, never
accepted (T5, a15); node_modules symlinks are never git-added. **No cosmetic excision** (T6): the
`.group()` ownership inversion (B4) and the `declaredKeyframeBodyFor` REVERSAL (B3) are its two
poles — one deletes a genuinely-dead service-locator surface with its factory + register side-effect +
caller migration; the other REFUSES to delete a surface P2-2 proved load-bearing. **Gate follows code,
including its own coverage set** (T7): the p01 lesson is **10 sites, not 1** — B2's 9-script/10-site
co-edit is the standing proof, and the architecture MAP is itself a gated deliverable (B8). **No
self-certifying gates** (T2): B5 targets an EMPTY override Map, and **no born-RED gate in this band
carries a numeric line count as its GREEN criterion** — the ≤~460L headroom is an observed tripwire,
not the oracle.

---

## Appendix D — Recorded-future items this band surfaces (SPEC §8 + §6.3)

Items pruned from S scope but carried forward with their shape (nothing silently vanishes — SPEC §8);
plus the two owner rulings B6 surfaces.

1. **The literal single-writer hard fold (§8-3; sb-#9; SB-9).** A **FUTURE BREAKING wave**, explicitly
   out of S.B2 scope: 107 test sites + the demo `contractAnim.t =` writes + a public **`seek(ms)`**
   verb + a MIGRATION doc; done ONLY behind the `seek()` surface; **collides with additive-minor —
   never smuggled as engine-internal**. S.B2 lands the non-breaking single-STORAGE fold; this is its
   breaking successor.
2. **S.B4's stretch (§8-4; sb prune).** Collapsing the **26 type-only rings + deleting the `viaOnly`
   exemption** — optional cleanup; **B4 is NOT gated on it**.
3. **The B6 loader collapse (§8-5; §6.3; sb-#7).** The `loadAnimationEngine → import("./engine/public")`
   collapse is an **owner-recordable option**: behaviorally neutral (−100 LOC, −6% JS bytes, 23→5 dist
   files, ONE 97.32 kB engine chunk, dynamic engine chunks 2→1, drift-proof by construction) at the
   cost of foreclosed partial-engine splitting for a consumer that does not exist today. **The TYPE-diff
   drift gate ships regardless; the collapse ships only on owner approval.**

**The two version-ruling inputs B6 surfaces to the owner (SPEC §6.3), not glossed:**

- **(i)** S.B6's `= any → = Vars` d.ts narrowing is **source-breaking** for consumers who passed
  arbitrary property bags — **minor or major?**
- **(ii)** does the **126-leaked-private API-Extractor strip** count as "published-surface removal" for
  the **C-18 changelog gate**?

Default remains **additive-minor**; both rulings land at **S.Z3**.
