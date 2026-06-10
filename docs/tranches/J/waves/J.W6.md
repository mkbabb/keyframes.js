# J.W6 — TERMINATIONS (P-invariant-28 · nothing rides a fifth tranche · probe-or-KILL, no perpetual punt)

- **Phase:** DEV — spec authored, awaits IMPL+auth · **Class:** DECIDE-in-J (the riders'
  terminal-disposition wave; mixed severity — every rider is either MEASURE-FIRST→LAND/ADOPT/KILL
  on a number, BOOK-with-date-or-KILL on a Baseline, BUILD-or-KILL on an owner, or VERIFY-ONLY for
  the one sibling-owned row. No new product surface is mandated; the BINDING output is a
  measurement artifact or a reasoned KILL record per rider.) · **Scope (measurements + probes +
  ONE potential perf transposition; file-disjoint from J.W1/J.W2):** the four ≥4-tranche riders
  (FB-2 sync-step · SoA `lerpArray` · FB-5 intrinsic-size · FB-6 `Mod+K`), the two perf-frontier
  candidates folded here (PF-1 Three.js named imports — the one rider that may LAND product code;
  PF-3 Monaco static-edge re-verify), the EF-3 `parseLinearStops` shim-retirement check (value.js
  E1 status + the `linear()` Baseline date), and GH-6/DEP-1 (OUT — deploy-owned, verify-only). ·
  **DAG-deps:** J.W1 ∥ J.W2 ∥ **J.W6** run parallel (file-disjoint: engine-correctness /
  demo-behavior / **measurements**) per `J.md §WAVE MAP`. The benches/probes authored here consume
  the J.W0 `navToScene` primitive only where they actuate a live scene (PF-1's amiga LCP re-measure,
  PF-3's bundle probe over the built dist); the pure micro-benches (FB-2, SoA) need no harness.

## §Provenance (the fold-mandate root + the four-tranche ride histories)

- `J.md §finding-cluster ledger` → **Terminations (P-invariant-28)** row routes to **J.W6**:
  *"DL-1 the four ≥4-tranche riders — FB-2 async sync-step (probe `proof:event-ordering` or KILL),
  SoA `lerpArray` (bench on the real-K corpus or KILL), FB-5 intrinsic-size (verify Baseline or
  KILL), FB-6 `Mod+K` palette (owner or KILL); PF-1 Three.js namespace→named imports (measured,
  est. 100-200 KB); PF-3 Monaco static-edge re-verify; EF-3 parseLinearStops shim retirement check
  (`linear()` Baseline 2026-06-11); GH-6 DEP-1 CNAME confirm (OUT, deploy-owned — verify only)."*
- `J.md §The MANDATE` — **MEASURE-FIRST**: *"every perf claim lands behind a biting bench or is
  recorded-withheld WITH the measurement; the four ≥4-tranche riders EXIT via probe-or-KILL (no
  fifth ride)."* And the **P-invariant-28** invariant carried verbatim: *no perpetual punts*.
- `audit/deferred-ledger.md §3` (the J fold-or-KILL roll-up) — the binding sentence:
  *"The four 'J MUST DECIDE' rows (FB-2, SoA lerpArray, FB-5, FB-6 palette) have ridden ≥4 tranches
  as MEASURE-FIRST/BOOK without a probe authored. Per P-invariant-28 these can no longer ride as
  bare BOOKs; J must EITHER author the named measure-first probe OR issue a KILL-with-reason.
  Continuing them as 'BOOK' a fifth time is the perpetual punt the invariant forbids."*
- `audit/perf-frontier.md §5` (the ranked transposition candidates) — PF-1 (FOLD), PF-3
  (VERIFY-ONLY), PF-8 = the SoA `lerpArray` BOOK/KILL-reaffirm row (`perf-frontier.md:228-237`).
- `audit/recap-GH.md §G-1` + `recap-deferred.md:101` + `G.WV.md:356` — the `parseLinearStops` shim
  and the value.js E1/E2 status (NOTE: "EF-3" is `J.md`'s charter label for THIS shim check;
  `recap-EF.md`'s own EF-3 numbering — `recap-EF.md:373` — is a DIFFERENT item, the `Animation`/group
  sync-step half routed by this wave to **S1/FB-2**, so the bare `recap-EF.md §10 EF-3` anchor does
  NOT support the shim claim and is dropped). `audit/recap-GH.md §H-4 / G-6 → DEP-1` — the CNAME
  drift (OUT).

## §The state, verified (file:line / probe-output — every rider's TREE-state re-checked first-hand)

All probes re-run on `tranche-j-dev` (HEAD `4072af9` base + the J doc tail), 2026-06-10, clean
working tree. Installed deps: value.js `0.11.2`, glass-ui `3.9.0`, parse-that `0.9.0` (lockfile).

| Rider | Born → ride | TREE state TODAY (probe) | Decision owed |
|---|---|---|---|
| **FB-2** async sync-step half | F→I (4 tranches) | `engine.ts:840 async advanceTo` + `group.ts:469 async advanceTo` — **still async** (`grep -n "async advanceTo"`); the `Animation`/group half HELD behind the event-ordering lock at `test/sync-step.test.ts:98` ("event-ordering lock (the held-half guard)"); the `drive`-stepper sync fast-path DID land (`playback.ts:111-140`, F.W5) | **LAND-or-KILL** on the measured sync-half win |
| **SoA `lerpArray`** | E(G-2)→I (5 tranches) | `grep -r lerpArray src/` = **0**; but `lerpArray` IS published+installed (`node -e` → `typeof v.lerpArray === "function"` in value.js 0.11.2); the existing K corpus `bench/interp-buffer.bench.ts` threads K=2/5/12 but has NO `Float64Array`+`lerpArray` SoA shape | **ADOPT-or-KILL** on the real-K bench delta |
| **FB-5** intrinsic-size `0→auto` | E/F→I (5 tranches) | `grep -r "interpolate-size\|calc-size" src/` = **0** — no path; `linear()`-class `interpolate-size` is a CSS-platform feature, kf has no consumer | **BOOK-with-date-or-KILL** on the cross-engine Baseline |
| **FB-6** `Mod+K` palette | F→I (4 tranches) | only a CSS z-index comment (`demo/@/styles/style.css:29` *"popovers (share, command palette)"*); **zero** `CommandPalette`/`cmdk` component (`grep` source-only, excl. `/dist/` = 0); `CommandPalette.vue` was DELETED at E.W11 (`recap-EF.md:126`) | **BUILD-or-KILL** on the owner decision |
| **PF-1** Three.js named imports | (perf-frontier, P1 FOLD) | 4 namespace consumers: `demo/app/scenes/AmigaScene.vue:18`, `demo/amiga/utils.ts:1`, `demo/amiga/useSphereSpin.ts:1`, `demo/amiga/useAmigaAnimations.ts:1` — all `import * as THREE from "three"`; `vendor-three` = 522 KB at b16; min named-import subset ≈356 KB (`node_modules/three/build/three.module.min.js`) | **measured before/after bundle delta** (the one rider that may LAND product code) |
| **PF-3** Monaco static-edge | (perf-frontier, P1 VERIFY-ONLY) | `proof:monaco-deferred` clause 2 source-grep passes; the BUNDLE half hard-FAILS without a fresh build — `proof-modern-web.mjs:182-186` calls `fail(id+" (bundle)", "dist/gh-pages not built — run `npm run gh-pages` …")` and `process.exit(1)` fires at `:663` (header `:40-42`: it *"exits non-zero (it must not silently skip the dominant lever's proof)"*) — so the re-verify must PRODUCE the build so the static-edge assertion RUNS, not merely avoid a skip; b16 recorded `vendor-monaco` = 8.2 MB (the dominant lever) | **re-verify on a fresh build** |
| **EF-3** `parseLinearStops` shim | C-4→G→I (value.js E1 lineage) | shim LIVE at `src/animation/utils.ts:106` (`parseLinearStops`, consumed `:192`); value.js E1 **unpublished** — `node -e` → `typeof v.parseLinearStops === "undefined"` AND `typeof v.getPointAtLength === "undefined"` in 0.11.2; `linear()` Baseline-WA **2026-06-11** (`recap-deferred.md:101`, `G.WV.md:356`) | **retire-or-keep** on the value.js E1 publish state |
| **GH-6 / DEP-1** CNAME drift | G→H→I (deploy-owned) | `dns-cf-sync.sh` CNAME P0 OPEN per I.FINAL §6 (`recap-GH.md:234`); deploy-owned (fourier), NOT kf | **VERIFY-ONLY** (confirm with the deploy owner; OUT) |

## §Goal

Every rider that has outlived ≥4 tranches as a MEASURE-FIRST/BOOK row **exits this wave with a
terminal disposition backed by a MEASUREMENT ARTIFACT or a reasoned KILL record** — the bench/probe
output checked into the wave note, or a KILL paragraph that cites the number that killed it. A FIFTH
defer is FORBIDDEN by charter (`J.md §MANDATE`, P-invariant-28): no rider may leave J tagged BOOK
without a measurement. The J close ledger (`PROGRESS.md` J ledger) carries **ZERO rows tagged
MEASURE-FIRST without a measurement**. PF-1 records its bundle delta before/after; PF-3 re-verifies
the static edge on a fresh build; EF-3 retires the shim IFF value.js E1 has published (no compat
alias beside the value.js parser — the no-legacy collapse) and otherwise RECORDS the unchanged
HANDOFF with the verified `undefined` probe; GH-6/DEP-1 is verify-only and stays OUT.

## §Scope — one section per rider

### S1 — FB-2: the async sync-step half — author `proof:event-ordering`, measure, LAND-or-KILL

**The full ride.** BORN **F** (F.W5 split the sync-step drive into two halves: the `drive`-stepper
sync fast-path LANDED at `playback.ts:111-140` — `SmoothProgress`/`SpringProgress`/`Draggable` tick
inline with no per-frame `Promise.resolve`; the `Animation`/group half was HELD "locked OUT by an
event-ordering parity test", `F/FINAL.md:37-38`). **F→G→H→I (4 tranches)** the held half rode as
`MEASURE-FIRST — build proof:event-ordering first` (`deferred-ledger.md:101`); the event-ordering
LOCK was authored (`test/sync-step.test.ts:98` "event-ordering lock (the held-half guard)" —
asserts `animationstart → animationiteration* → animationend` ordering through the deterministic
`advanceTo` clock) BUT the sync-half conversion never shipped — `engine.ts:840` and `group.ts:469`
are **still `async advanceTo`** today (`grep -n "async advanceTo"`, verified). The lock exists; the
measured justification for converting `Animation.advanceTo`/`AnimationGroup.advanceTo` from async to
sync (so a sync-driving caller pays no per-frame promise+microtask hop) was never produced.

**The EXACT probe/bench to author.**
- **Instrument:** `bench/sync-step.bench.ts` ALREADY isolates the `RAFPlayback._run` loop-core
  promise+microtask cost for the SYNC `drive` steppers (the b-half that landed). **Extend it** with
  the symmetric shape for the HELD half: a bench that drives an `Animation` (and a small
  `AnimationGroup`) through `advanceTo` over a bounded steady window with rAF stubbed synchronous
  (the same stub the file already builds), under TWO arms — (a) the current `async advanceTo` path,
  and (b) a `--expose-gc`-instrumented probe variant where `advanceTo` is converted to sync (a
  local stash-probe build, never committed) — comparing per-frame wall-time AND microtask-turn
  count. **Corpus:** the realistic playback shape — a single `Animation` over a K=8 transform
  animation (translate3d+scale+rotate+opacity, the demo's cube shape) + a 32-cell `AnimationGroup`
  (the `YIELD_BATCH=32` boundary, `group.ts:76`), 600-frame steady window — so the per-frame
  promise allocation is observable, not masked by a single-frame alloc.
- **Probe gate:** author `proof:event-ordering` (the gate the ledger names) — a vitest/node gate
  that ASSERTS the event-ordering lock holds (`animationstart → animationiteration* → animationend`)
  on BOTH the current async path AND any sync-converted path, so the conversion provably cannot
  reorder lifecycle events. This is the correctness ORACLE that gates the LAND: the sync conversion
  is permitted ONLY if `proof:event-ordering` stays GREEN (the lock is the no-regression boundary).
- **Threshold that decides:** the sync conversion LANDS iff (a) the bench shows a per-frame
  wall-time OR microtask-count reduction on the sync arm that is non-noise (≥20% microtask-turn
  reduction on the K=8/32-cell steady window, matching the perf-frontier bite-threshold convention
  for an engine refactor, `perf-frontier.md:236`), AND (b) `proof:event-ordering` stays GREEN.

**The BINARY exit — LAND-or-KILL.**
- **LAND** if both threshold legs hold: convert `Animation.advanceTo`/`AnimationGroup.advanceTo` to
  sync, the held half ships behind a GREEN `proof:event-ordering`, the bench delta is the artifact.
- **KILL** if the bench shows the sync conversion is noise-level OR cannot preserve event ordering:
  record the bench numbers + the KILL reason (the held half was correctly held; the win does not
  exist at the engine's real shape). EITHER WAY the rider exits with the bench artifact. No fifth
  BOOK. *(NO workaround: the KILL is reasoned-from-the-number, not a re-defer; the LAND ships behind
  the ordering lock, not a `settleMs`/escape-hatch.)*

### S2 — SoA `lerpArray`: bench on the real-K corpus, ADOPT-or-KILL

**The full ride.** BORN **E** as G-2 / VJ-D2 (`docs/tranches/G/audit` measured K=6-10 as the
real-world transform shape — translate3d+scale+rotate+opacity = ~10 channels — where `lerpArray`
bites 2.5-4× over per-channel `_lerp` closure dispatch). **E→F→G→H→I (5 tranches)** rode as
`MEASURE-FIRST` / `STILL BOOK` (`perf-frontier.md:228`, `recap-GH.md §G sibling table`). TREE today:
`lerpArray` IS published + installed (`typeof v.lerpArray === "function"` in value.js 0.11.2,
verified first-hand) but `grep -r lerpArray src/` = **0** — kf's `frame-compiler.ts` does not consume
it; `engine.ts:730-732` still dispatches per-channel `_lerp` closures.

**The EXACT probe/bench to author.**
- **Instrument:** extend `bench/interp-buffer.bench.ts` (the existing threaded-out-buffer K-corpus
  bench, K=2/5/12) with a `Float64Array`-backed SoA arm: pack the K interpolating channels into a
  `Float64Array` keyframe buffer and interpolate via a SINGLE `lerpArray(out, from, to, t)` call,
  benched against the current per-channel `_lerp`-closure path on the IDENTICAL corpus.
- **Corpus:** the **real-K** shape the G measurement named — K=8 (the demo's transform-heavy cube
  animation: translate3d+scale+rotate+opacity ≈ 8-10 numeric channels), threaded over a ~600-frame
  steady playback window (the `_frame`/`_interpOut` hoisted-buffer shape, `engine.ts:161,747`), so
  the per-channel closure-dispatch overhead is the measured quantity, not conflated with allocation.
- **Threshold that decides:** ADOPT iff the SoA arm shows **≥20% wall-time reduction** at K=8 on the
  steady window (`perf-frontier.md:236` — *"show ≥ 20% wall-time reduction to justify the
  FrameCompiler refactor"*). Below 20% the HIGH-risk `FrameCompiler` refactor (it emits
  `interpVars: Record<string, ValueUnit[]>` — moving to a numeric SoA requires a parallel codepath
  or a type-level refactor, `perf-frontier.md:237`) is not justified.

**The BINARY exit — ADOPT-or-KILL.**
- **ADOPT** if ≥20% at K=8: the `FrameCompiler`-side SoA transposition (emit a `Float64Array`
  buffer consumed by a `lerpArray` call in `interpFrames`) is elected — but the IMPL lands in J.W1
  (engine totality) or a dedicated motion under authorization; **J.W6's deliverable is the bench
  artifact + the ADOPT decision**, not the refactor itself (the refactor is HIGH-risk and is a
  separate authored motion). The bench numbers are the artifact.
- **KILL** if <20% at K=8: record the bench output + the KILL-reaffirm reason (the SoA win does not
  bite at kf's real channel count; the per-channel `_lerp` path stays). The deferred-ledger's
  `KILL-reaffirm unless a bench bites` (`deferred-ledger.md:102`) resolves to KILL with the number.
  EITHER WAY exits with the bench artifact — no sixth ride. *(NO workaround: KILL is from the bench,
  not a re-defer.)*

### S3 — FB-5 intrinsic-size `0→auto`: verify the cross-engine Baseline, BOOK-with-DATE-or-KILL

**The full ride.** BORN **E/F** as the guarded-enhancement BOOK (`interpolate-size: allow-keywords`
+ `calc-size()` — animating `height: 0 → auto`, a CSS-platform feature gated on cross-browser
Baseline). **E→F→G→H→I (5 tranches)** rode as `BOOK (guarded-enh) — VERIFY Baseline first`
(`deferred-ledger.md:104`). TREE today: `grep -r "interpolate-size\|calc-size" src/` = **0** — no
kf path; the feature is value.js/platform-side, not engine-core.

**The EXACT probe to author.**
- **Instrument:** a Baseline check — `npm view caniuse-lite` / the MDN Baseline data /
  `web-features` for `interpolate-size` + `calc-size()` as of the IMPL date, cross-referenced
  against the project's modern-web Baseline convention (`proof-modern-web.mjs` checklist).
- **Threshold that decides:** is `interpolate-size`/`calc-size()` **Baseline (Newly available or
  Widely available)** across Chromium + Firefox + WebKit as of the IMPL date? (As of the audit it
  is Chromium-only — Firefox/WebKit had not shipped; this is the exact MEASURE the rider owes.)
  Unlike `linear()` (Baseline-WA 2026-06-11, a fixed PAST date), `interpolate-size` has no recorded
  Baseline date — the probe MUST resolve the live cross-engine state, not cite a remembered date.

**The BINARY exit — BOOK-with-DATE-or-KILL.**
- **BOOK-with-date** if Baseline (cross-engine): record the Baseline date as the artifact and BOOK a
  named guarded-enhancement wave (`interpolate-size: allow-keywords` + feature-detected `calc-size`,
  JS fallback proven per inv ξ) — but the BOOK now carries a CONCRETE Baseline date, not a bare
  "VERIFY first" (the fifth-ride-forbidden form). A dated BOOK with the Baseline artifact is a
  terminal disposition, not a perpetual punt.
- **KILL** if NOT cross-engine Baseline as of the IMPL date: record the live caniuse/Baseline output
  (Chromium-only ⇒ KILL) + the KILL-reaffirm reason (no cross-engine platform support; a
  Chromium-only animation path is not a kf commitment). EITHER WAY exits with the Baseline-check
  artifact. *(NO workaround: the BOOK carries a date or the row dies; no undated "verify next time".)*

### S4 — FB-6 `Mod+K` palette: decide the owner, BUILD-or-KILL

**The full ride.** BORN **F** (F.W13 BOOK — a command-palette / `Mod+K` quick-switcher for the demo,
LOW priority, "decide owner"). **F→G→H→I (4 tranches)** rode as `BOOK (demo, LOW) — decide owner or
KILL` (`deferred-ledger.md:105`). TREE today: a `CommandPalette.vue` once EXISTED and was **DELETED
at E.W11** (`recap-EF.md:126` — `find demo -name CommandPalette.vue` → 0); the only residue is a CSS
z-index comment (`demo/@/styles/style.css:29` *"popovers (share, command palette)"*); **zero**
`cmdk`/`CommandPalette` component in source (grep, excl. `/dist/`).

**The EXACT decision to record (no bench — this is an owner/scope decision, not a perf measure).**
- **Instrument:** the owner decision itself, recorded as the artifact. Two questions: (1) is a
  command palette a kf-DEMO surface the design directive wants (cross-ref `J.W7a` — the
  APPEARANCE-GRAMMAR half owns the demo's interaction grammar, the half that would own a
  command-palette demo surface if BUILT; `J.md §J.W7a` does NOT name a command palette among
  the protagonist/display/colour/math/grammar folds)? (2) if YES, is the palette
  primitive a glass-ui HANDOFF (inv-16 — kf consumes glass-ui published, never hand-rolls a
  palette) or a kf-demo BUILD?
- **Threshold that decides:** the decision is BINARY on whether the design directive (J.W7a) and the
  user elect a command palette as a kf-demo affordance. The audit evidence is that the palette was
  already DELETED once (E.W11) and the J.W7a appearance-grammar fold (`J.md §J.W7a`) does NOT list
  it — the DEFAULT is KILL absent an explicit owner electing the BUILD.

**The BINARY exit — BUILD-or-KILL.**
- **BUILD** ONLY if an owner (the user / J.W7a's design directive) explicitly elects it: then it is a
  glass-ui-consumed palette (HANDOFF if glass-ui ships a `CommandPalette`/`cmdk` primitive — inv-16)
  or a recorded kf-demo BUILD wave with a born-RED interaction gate (the palette opens on `Mod+K`,
  navigates a scene, closes on Escape). The BUILD decision + owner is the artifact.
- **KILL** (the DEFAULT, on the evidence): the palette was deleted once, the design fold does not
  name it, no owner has elected it — KILL-reaffirm with the reason (deleted at E.W11, not in the
  J.W7a appearance-grammar suffusion, no owner pull across 4 tranches), and **delete the stale CSS z-index
  comment residue** (`style.css:29`'s "command palette" mention) in the same motion (no-legacy: a
  comment referencing a killed feature is stale doc-rot). EITHER WAY exits terminally — no fifth
  BOOK. *(NO workaround: the KILL removes the residue; the BUILD is owner-elected, not auto-revived.)*

### S5 — PF-1: Three.js namespace → named imports (the measured bundle-delta protocol)

**The provenance.** `perf-frontier.md §PF-1` (P1, FOLD) — the four amiga Three.js consumers all use
`import * as THREE from "three"` (`AmigaScene.vue:18`, `demo/amiga/utils.ts:1`, `useSphereSpin.ts:1`,
`useAmigaAnimations.ts:1`, all verified first-hand) — a namespace import that PREVENTS rolldown
tree-shaking. The actual used surface is ~15 classes (`WebGLRenderer`, `Scene`,
`PerspectiveCamera`, `HemisphereLight`, `SpotLight`, `BoxGeometry`, `MeshLambertMaterial`, `Mesh`,
`Color`, `BackSide`, …) + `OrbitControls` from `three/examples/jsm/` (already a named subpath).
`vendor-three` = 522 KB at b16; the min named subset ≈356 KB. This is the ONE rider that may LAND
product code (a pure refactor: namespace → named destructured imports).

**The EXACT measured before/after bundle-delta protocol.**
1. **BEFORE:** `KF_ANALYZE=1 npm run gh-pages` on the unchanged tree → record `vendor-three` chunk
   size from `dist/gh-pages/_chunks.json` (or the built `vendor-three-*.js` byte size, `ls -la`).
   This is the BORN baseline artifact.
2. **REFACTOR:** convert all four consumers from `import * as THREE` to named imports
   (`import { WebGLRenderer, Scene, … } from "three"`), `THREE.X` → `X`. `OrbitControls` is
   unchanged (already a named subpath import).
3. **AFTER:** `KF_ANALYZE=1 npm run gh-pages` → record the new `vendor-three` size. **Delta = BEFORE
   − AFTER**, recorded in the wave note (the est. is 100-200 KB, `perf-frontier.md:153` /
   `J.md §J.W6 row` — but the est. is NOT the artifact; the MEASURED delta is).
4. **CORROBORATE:** Lighthouse mobile on the amiga scene before/after (amiga has the lowest mobile
   Perf floor = 49, `perf-frontier.md:97`; a 299 ms Three.js mount spike on first load, b16 §2) —
   record the Perf-score delta. This is the live-actuation corroborator (via J.W0 `navToScene` to
   the amiga scene over the built dist).

**The BINARY exit — LAND-or-KILL.**
- **LAND** if the measured `vendor-three` delta is a real reduction (any non-noise byte reduction —
  named imports are a pure tree-shake refactor, LOW risk, `perf-frontier.md:156`): the refactor
  ships, the before/after chunk sizes are the artifact (`J.md §J.W6 gate`: *"The bundle delta for
  PF-1 recorded before/after."*).
- **KILL** if the measured delta is zero / noise (rolldown already tree-shakes the namespace, or
  `advancedChunks` re-bundles the full module regardless): record the before/after numbers + the
  KILL reason (no win; the refactor is churn without a measured reduction). EITHER WAY the bundle
  delta is recorded. *(NO workaround: the LAND is justified by the measured delta, not the estimate;
  the KILL is from the build numbers.)*

### S6 — PF-3: Monaco static-edge re-verify (the re-verify protocol)

**The provenance.** `perf-frontier.md §PF-3` (P1, VERIFY-ONLY) — Monaco is the dominant payload
(`vendor-monaco` = 8.2 MB + workers ≈11 MB total at b16). `proof:monaco-deferred` asserts ZERO
static edge from the app entry to `vendor-monaco`; the SOURCE half (no top-level
`import * as monaco`) always passes, but the BUNDLE half **hard-FAILS without a fresh build** —
`proof-modern-web.mjs:182-186`: the `!fs.existsSync(DIST/index.html)` guard at `:182` calls
`fail(`${id} (bundle)`, "dist/gh-pages not built — run `npm run gh-pages` before this gate so the
vendor-monaco static-edge probe can run (the dominant lever's proof).")` at `:185`, and
`process.exit(1)` fires at `:663` (the header at `:40-42` is explicit: the absent-build branch
*"exits non-zero (it must not silently skip the dominant lever's proof)"*). So a no-build run is
already a HARD FAIL, NOT a skip — the re-verify's job is to PRODUCE the build so the already-failing-
on-absent-build probe actually RUNS its `_chunks.json` static-edge assertion, not merely to avoid a
skip. The `advancedChunks`
`preload-helper` group was added in tranche I specifically to prevent rolldown re-parking the
`__vitePreload` helper inside `vendor-monaco` — a regression there would re-eagerize Monaco invisibly.

**The EXACT re-verify protocol.**
1. **BUILD:** `KF_ANALYZE=1 npm run gh-pages` (a fresh build — the bundle probe cannot run without
   `dist/gh-pages/`).
2. **PROBE:** run `proof:monaco-deferred` (the bundle half) over the fresh `dist/gh-pages/_chunks.json`
   — assert NO emitted chunk statically imports the `vendor-monaco` chunk (`from"./vendor-monaco-*.js"`);
   a dynamic `import("./vendor-monaco-*.js")` is the WANTED form and passes.
3. **ARTIFACT:** the `_chunks.json` edge-list (or the probe's pass/fail with the offending edge if
   any) is the re-verify artifact, recorded in the wave note.

**The BINARY exit — VERIFY-pass-or-RED (re-verify, not a new decision).** This rider is VERIFY-ONLY
(`perf-frontier.md` disposition) — it does not LAND/KILL, it re-CONFIRMS the I-era win held:
- **PASS** (the expected outcome): the static edge is absent on the fresh build; record the
  `_chunks.json` artifact confirming Monaco is off the critical path (the spring-mobile LCP win
  28.5 s → <15 s preserved).
- **RED** (a regression): if `vendor-monaco` is statically reachable from the entry, the probe REDS
  and the `advancedChunks` regression is the finding — escalated as a J defect (the re-verify caught
  it). EITHER WAY the build artifact is recorded — the rider does not exit as an un-measured BOOK.

### S7 — EF-3: `parseLinearStops` shim retirement check (value.js E1 status + the `linear()` Baseline)

**The provenance.** `recap-GH.md §G-1` + `recap-deferred.md:101` + `G.WV.md:356` — the
`parseLinearStops` shim (kf's local `linear()`/`steps()` reader) lives at `src/animation/utils.ts:106`
(consumed `:192`), pending value.js E1/E2 (the value.js-side `linear()`/`steps()` PARSER → `LinearStop[]`).
(The "EF-3" tag this section carries is `J.md`'s charter label for the shim check, NOT `recap-EF.md`'s
own EF-3 numbering — `recap-EF.md:373`'s EF-3 is the `Animation`/group sync-step item this wave routes
to **S1/FB-2** — so the shim's load-bearing anchors are the recap-GH/recap-deferred/G.WV lineage above.)
The no-legacy precept binds: **when value.js E1 lands, kf RETIRES the shim in the SAME motion — no
compat alias beside the value.js parser** (`G.WV.md:124`). `linear()` itself is Baseline-WA
**2026-06-11** (a fixed PAST date — `recap-deferred.md:101`, `G.WV.md:356`); the gating question is
purely the value.js E1 PUBLISH state, not the platform Baseline.

**The EXACT check protocol.**
1. **PROBE value.js E1 status:** `npm view @mkbabb/value.js version` (latest published) +
   `node -e "const v=require('@mkbabb/value.js'); console.log(typeof v.parseLinearStops, typeof v.getPointAtLength)"`
   on the installed/latest dep. **Verified at authoring (2026-06-10, value.js 0.11.2):** BOTH
   `parseLinearStops` and `getPointAtLength` are `undefined` — **value.js E1 is UNPUBLISHED**; the
   shim MUST stay.
2. **THRESHOLD:** has value.js published a `parseLinearStops` (E1) / `cssLinear` parser export in a
   version kf can pin, as of the IMPL date?

**The BINARY exit — RETIRE-or-KEEP-with-probe.**
- **RETIRE** (only if value.js E1 has published since): excise the kf shim (`utils.ts:106-130`) and
  consume the value.js parser in the SAME motion — NO compat alias beside it (the no-legacy collapse,
  `J.md §MANDATE` no-legacy). The retirement diff is the artifact; the paired gate `grep parseLinearStops src/ = 0`
  flips to GREEN-on-land.
- **KEEP (the verified state today):** value.js E1 is unpublished (`parseLinearStops === undefined`
  in 0.11.2, probe-verified) — the shim stays as a correctly-deferred value.js-HANDOFF, and the wave
  note RECORDS the `undefined` probe output as the artifact (not a bare "still pending" — the probe
  is the evidence). This is NOT a fifth-defer: the shim is sibling-gated CHRONIC-by-design (the
  re-pin process), and the J disposition is the recorded probe + the unchanged HANDOFF with its
  paired born-RED gate (`grep parseLinearStops src/ = 0` reds-on-retire). The value.js next-slice
  (E1) rides the next re-pin, ZERO kf edit (`deferred-ledger.md:88`, OUT). *(NO workaround: KEEP is
  evidenced by the probe, not asserted; RETIRE is the full no-legacy excision, not a dual path.)*

### S8 — GH-6 / DEP-1: the CNAME drift — confirm-with-owner protocol (OUT — verify only)

**The provenance.** `recap-GH.md §H-4 / G-1` — the `dns-cf-sync.sh` CNAME drift (DEP-1) is a P0
live-correctness fix **owned by deploy (fourier), NOT kf** (`recap-GH.md:234`; carried G→H DEP-1 →
I.FINAL §6, still OPEN). `J.md §chronic+deferred fold`: *"DEP-1/2/3 (deploy-repo-owned; J.W6 confirms
DEP-1 only)"* — and `J.md §J.W6 row`: *"GH-6/DEP-1: the CNAME drift confirmed with the deploy owner
(OUT — verify only)."*

**The EXACT confirm-with-owner protocol (no kf code, no kf gate — verification only).**
1. **CONFIRM with the deploy owner** whether `dns-cf-sync.sh` (the CNAME drift fix) has been applied
   since I-close. The live check is deploy-domain (`dig`/`nslookup` the production CNAME against the
   expected CF-Pages target, or the deploy owner's confirmation) — this is the **boundary oracle**
   per `J.md`'s boundary-ORACLE extension, but the boundary here is DEPLOY-OWNED, so kf's role is to
   VERIFY-AND-RECORD, not to author.
2. **ARTIFACT:** the owner's confirmation (applied / still-open) recorded in the wave note. If still
   open, it stays an OUT sibling-HANDOFF (deploy-owned P0) — J does NOT fold it into a kf wave; it
   cross-references the J.W0 deploy-boundary oracle (the observed green-CI→auto-deploy round-trip),
   which is where the kf-side deploy integrity actually lands.

**The exit — VERIFY-ONLY (OUT).** No LAND/KILL — this is not a kf rider; it is a deploy-owned P0
that J CONFIRMS the status of. The artifact is the recorded owner confirmation. It stays OUT
(sibling-HANDOFF) regardless of outcome; the kf deploy correctness is owned by J.W0, not here.

### S9 — CE-1.0: the Safari `linear()`-HW-accel hazard on the CURRENT spring-WAAPI path — verify on-device, GUARD-or-DOCUMENT

**The provenance.** `audit/frontier/compositor-eligibility.md` CE-1.0 / §3.0 (post-fleet J-fold,
K-SEED §4). kf's EXISTING spring-WAAPI delegation emits a CSS `linear()` timing twin — the spring's
`linear()` stops carried on the uniform timing function (`toWAAPIOptions`, `src/animation/waapi.ts:316-318`:
`const uniformTiming = animation.frames[0]?.timingFunction ?? animation.options.timingFunction; const
easing = uniformTiming.css ?? "linear";`, emitted into the `KeyframeEffectOptions.easing`). Safari
(desktop + mobile) REFUSES hardware acceleration for any animation carrying a custom `linear()`
easing — even for `transform`/`opacity` (a confirmed WebKit engine behaviour, NOT a `linear()`
syntax-support gap; `linear()` is itself Baseline-WA 2026-06-11). So TODAY, on Safari, a delegated
spring animation runs on UN-accelerated WAAPI — an extra effect object + the shadow tick loop
wrapping a main-thread animation that is no faster than, and structurally heavier than, the rAF path
it bypassed. This is a conservative-correctness LEAK: the delegation is supposed to only ever trade a
perf OPPORTUNITY, never make things WORSE (`waapi.ts:24-28` — the delegation contract). It rides
J.W6's measurement/verification charter precisely because it is a measure-first correctness-tightening
of the EXISTING delegation, not a K capability — and it sits beside S7 (the `linear()`-Baseline /
`parseLinearStops` re-verification), the same `linear()` band.

**The EXACT verify protocol (measure-first — the born-RED witness comes first).**
1. **PROBE on-device** (WebKit — Playwright `webkit` channel, or a real Safari): trace a delegated
   spring-WAAPI animation (a transform-animating spring whose timing carries the `linear()` twin) and
   observe whether it runs on the compositor or the MAIN thread. The born-RED witness is the trace
   showing the spring-`linear()` transform main-thread on WebKit (HW-accel REFUSED).
2. **THRESHOLD:** does this UA hardware-accelerate a `linear()`-eased transform? (A feature-probe of
   "linear()-easing + HW-accel" rather than a bare UA string match, where feasible.)

**The BINARY exit — GUARD-or-DOCUMENT (measurement-artifact-or-record, never a bare BOOK).**
- **GUARD** (if the on-device trace confirms the exclusion bites): the spring-`linear()` WAAPI
  delegation gains a WebKit guard — a `linear()`-HW-accel feature-probe (or a UA-gate) that HOLDS the
  spring-`linear()` delegation on rAF for WebKit, so the conservative-correctness contract is restored
  (the delegation never produces a heavier main-thread animation than the rAF path it replaced). The
  guard slots into the existing eligibility gate (`waapi.ts:98-208`), one ineligibility reason added,
  no second delegation path kept beside it (no-legacy).
- **DOCUMENT** (if the probe shows the UA does accelerate, or the cure is deferred behind a tripwire):
  RECORD the delegation decision with the trace as the artifact — "known no-HW-accel-on-Safari for
  spring-`linear()`; the rAF path is the correct fallback" — so the conservative-correctness call is
  EVIDENCED, not asserted. *(This is independent of the CE-1 per-property partition widening, which
  is K-scoped: CE-1.0 is ONLY the hazard verification on the path that ships TODAY; the §3.0 finding
  is explicitly "the current path," not the partition.)* **NO workaround:** GUARD is the real
  eligibility-gate addition; DOCUMENT is the recorded on-device trace, not a "still works on Chrome"
  hand-wave.

## §Hard gate (the proof:* / artifact rule that BITES — measurement-artifact-or-KILL-record · the close-ledger invariant)

**The wave-level gate is the MEASUREMENT-ARTIFACT-OR-KILL-RECORD rule** (`J.md §J.W6 gate`): *"Every
rider exits with a MEASUREMENT ARTIFACT (the bench/probe output checked into the wave note) or a
reasoned KILL record; the J close ledger carries ZERO rows tagged MEASURE-FIRST without a
measurement. The bundle delta for PF-1 recorded before/after."* This wave is GREEN iff EVERY clause
below produces its artifact and ZERO rider exits as a bare BOOK.

- **clause (a) — FB-2 sync-step exits LAND-or-KILL with the bench artifact (RUNTIME/engine oracle).**
  `proof:event-ordering` is authored AND GREEN on whichever path lands (the correctness oracle — it
  actuates the engine's lifecycle-event ordering through `advanceTo`, the property a caller checks);
  the extended `bench/sync-step.bench.ts` produces the per-frame wall-time / microtask-count delta on
  the K=8 + 32-cell corpus. **BITE:** the ≥20%-or-noise threshold decides LAND vs KILL; born-RED
  witness — `proof:event-ordering` reds on a deliberately-reordered lifecycle dispatch (proving the
  lock bites BEFORE any sync conversion is trusted). RED if the rider exits without a bench artifact.
  *(RUNTIME tier: the event-ordering lock is the correctness oracle; the bench wall-time is the
  measurement corroborator that decides LAND/KILL.)*
- **clause (b) — SoA `lerpArray` exits ADOPT-or-KILL with the bench artifact (bench oracle).** The
  extended `bench/interp-buffer.bench.ts` SoA arm produces the K=8 wall-time delta vs the per-channel
  `_lerp` path. **BITE:** ≥20% at K=8 ⇒ ADOPT decision recorded; <20% ⇒ KILL-reaffirm with the
  number. RED if the rider exits without the bench delta. *(The bench IS the oracle here — a perf
  measurement; the ADOPT decision is recorded, the IMPL refactor is a separate authorized motion.)*
- **clause (c) — FB-5 intrinsic-size exits BOOK-with-DATE-or-KILL with the Baseline artifact.** The
  cross-engine Baseline check output (caniuse/`web-features` for `interpolate-size`/`calc-size` as of
  the IMPL date) is recorded. **BITE:** cross-engine Baseline ⇒ a DATED BOOK (the date is the
  artifact); Chromium-only ⇒ KILL with the live caniuse output. RED if the row exits as an undated
  "verify-next-time" BOOK (the fifth-ride-forbidden form). *(HYGIENE/platform tier — a Baseline
  fact-check; no runtime oracle, but the dated artifact is mandatory.)*
- **clause (d) — FB-6 `Mod+K` exits BUILD-or-KILL with the owner-decision record + residue swept.**
  The owner decision is recorded; absent an explicit owner electing BUILD, the DEFAULT KILL fires and
  the stale `style.css:29` "command palette" comment residue is deleted (`grep "command palette"
  demo/@/styles/ = 0` after the KILL). **BITE:** RED if the row exits without an owner decision OR
  (on KILL) with the stale comment residue still present. *(The owner decision is the artifact; the
  residue-sweep grep is the no-legacy hygiene corroborator.)*
- **clause (e) — PF-1 bundle delta recorded before/after (build artifact).** `KF_ANALYZE=1 npm run
  gh-pages` BEFORE and AFTER → `vendor-three` chunk size delta recorded; LAND iff the measured delta
  is a real reduction, KILL iff noise. **BITE:** RED if PF-1 exits without the before/after numbers
  (`J.md §J.W6 gate` names this explicitly). Lighthouse-mobile-amiga before/after is the live
  corroborator. *(Build-measurement oracle; the chunk-size delta is the load-bearing artifact.)*
- **clause (f) — PF-3 Monaco static-edge re-verified on a fresh build (bundle-probe artifact).**
  `proof:monaco-deferred` bundle half runs over a fresh `KF_ANALYZE=1 npm run gh-pages` →
  `_chunks.json` edge-list recorded; PASS = no static `vendor-monaco` edge, RED = a regression (a J
  defect the re-verify caught). **BITE:** the fresh `KF_ANALYZE=1 npm run gh-pages` build is MANDATORY
  so the static-edge assertion EXECUTES — the no-build branch already hard-FAILS by design
  (`proof-modern-web.mjs:182-186`, `process.exit(1)` at `:663`; it does NOT skip), so a no-build fail
  is the gate working as designed, NOT the close artifact. The close artifact is the `_chunks.json`
  edge-list produced by the run that actually parsed the built dist; a wave that records no
  edge-list (because no build was produced) is a non-close. *(RUNTIME/bundle oracle — the static-edge
  probe over the real build.)*
- **clause (g) — EF-3 shim status recorded with the value.js E1 probe artifact.** The
  `npm view @mkbabb/value.js` + `node -e typeof v.parseLinearStops` output is recorded; RETIRE iff E1
  published (the shim excised, no compat alias, `grep parseLinearStops src/ = 0`), KEEP iff
  `undefined` (the probe output IS the artifact, the HANDOFF unchanged). **BITE:** RED if EF-3 exits
  without the probe output (a bare "still pending" with no probe is the forbidden form). *(The probe
  is the artifact; on RETIRE the `grep`-zero is the no-legacy oracle.)*
- **clause (h) — GH-6/DEP-1 owner-confirmation recorded (VERIFY-ONLY, OUT).** The deploy owner's
  applied/still-open confirmation is recorded; it stays OUT (deploy-owned). **BITE:** RED if no owner
  confirmation is recorded. *(Boundary oracle — DEPLOY-owned; kf VERIFIES-AND-RECORDS, the kf-side
  deploy correctness lands in J.W0, cross-referenced.)*

**The §spine bar — the close-ledger invariant.** The wave's binding oracle is NOT a single
`proof:*` — it is the **CLOSE-LEDGER INVARIANT**: at J close, `PROGRESS.md`'s J ledger carries
**ZERO rows tagged MEASURE-FIRST without a measurement**. Each rider above MUST exit with its named
artifact (a bench delta, a Baseline date, a bundle-size delta, a `_chunks.json` edge-list, a
value.js probe output, an owner confirmation) OR a reasoned KILL record that CITES the number/probe
that killed it. A FIFTH defer — any rider leaving J tagged BOOK without a measurement — is a
non-close (`J.md §MANDATE`, P-invariant-28; `deferred-ledger.md:181-185`). The correctness oracle
that ACTUATES the running product is `proof:event-ordering` (clause a — the engine lifecycle
ordering through `advanceTo`) and the PF-1/PF-3 bundle probes over the live built dist (clauses e/f
— the bytes a human downloads); the Baseline/owner-decision artifacts (clauses c/d/g/h) are
fact-check/decision corroborators, LABELED as such, and may NOT substitute for a missing
measurement on a measure-first rider.

- **The TWO-TIER TAXONOMY, applied to THIS wave's gates.** The **RUNTIME / load-bearing correctness
  oracle** is `proof:event-ordering` (clause a — actuates the engine through the human-driven
  `advanceTo`/play surface, error budget 0 on lifecycle ordering) + the PF-1/PF-3 bundle probes over
  the BUILT dist (clauses e/f — the artifact a human's browser fetches). The **MEASUREMENT / decision
  corroborators** are the bench wall-time deltas (clauses a-bench/b — they DECIDE LAND/ADOPT/KILL but
  are benches, not product oracles), the Baseline fact-check (c), the owner decisions (d/h), and the
  value.js probe (g) — each is the rider's terminal artifact, none substitutes for a red runtime
  clause, and each is LABELED its tier. **A rider that exits without its artifact REDS the wave** no
  matter what the others report; a fifth defer is a non-close. The headline axis is **every rider
  exits on a measurement or a reasoned KILL — nothing rides a fifth tranche.**
- **on-device posture (P6).** Clauses (a)/(b) benches are device-DEPENDENT (wall-time is
  host-sensitive); they hard-gate the LAND/ADOPT/KILL DECISION on-device (the IMPL host) and run
  OBSERVE-ONLY in CI (the threshold is a felt-throughput claim, not a device-independent invariant) —
  declared through the ONE shared `IN_CI`/on-device helper (J.W3), never a per-script `IN_CI`
  re-impl. The event-ordering LOCK (correctness, device-independent) hard-gates in CI. PF-1/PF-3
  bundle SIZES are device-independent (deterministic build output) and hard-gate in CI. This is the
  P6 third-tier annotation applied to J.W6's measure-first gates.

## §Folds (every J.md-assigned fold item, with its evidence citation — no silent narrowing)

- **FB-2** (`J.md §J.W6` / `deferred-ledger.md:101,174`) — S1: author `proof:event-ordering` +
  extend `bench/sync-step.bench.ts`; LAND-or-KILL on the ≥20%-microtask-or-noise threshold. The
  held half (`engine.ts:840`/`group.ts:469 async advanceTo`) exits terminally; F→I (4) ride ends.
- **SoA `lerpArray`** (`J.md §J.W6` / `deferred-ledger.md:102,175` / `perf-frontier.md §PF-8`) —
  S2: extend `bench/interp-buffer.bench.ts` with the `Float64Array`+`lerpArray` SoA arm; ADOPT-or-KILL
  on ≥20% at K=8. E→I (5) ride ends. `lerpArray` IS published (probe-verified); kf does not consume.
- **FB-5 intrinsic-size** (`J.md §J.W6` / `deferred-ledger.md:104,177`) — S3: cross-engine Baseline
  check for `interpolate-size`/`calc-size`; BOOK-with-DATE-or-KILL. E→I (5) ride ends.
- **FB-6 `Mod+K`** (`J.md §J.W6` / `deferred-ledger.md:105,176`) — S4: owner decision; BUILD-or-KILL
  (DEFAULT KILL on the evidence — deleted at E.W11, absent from the J.W7a appearance-grammar fold) + sweep the
  `style.css:29` residue. F→I (4) ride ends.
- **PF-1 Three.js named imports** (`J.md §J.W6` / `perf-frontier.md §PF-1`) — S5: measured
  before/after `vendor-three` bundle delta; LAND-or-KILL on the measured reduction. The ONE rider
  that may land product code.
- **PF-3 Monaco static-edge** (`J.md §J.W6` / `perf-frontier.md §PF-3`) — S6: re-verify the bundle
  half over a fresh build; the probe CANNOT exit SKIPPED. VERIFY-ONLY (re-confirm the I-era win held).
- **EF-3 `parseLinearStops` shim** (`J.md §J.W6` / `recap-GH.md §G-1` / `recap-deferred.md:101` /
  `G.WV.md:356`; "EF-3" is `J.md`'s charter label for the shim check — `recap-EF.md`'s own EF-3 at
  `recap-EF.md:373` is the sync-step item this wave routes to **S1/FB-2**, not the shim) — S7:
  value.js E1 publish-state probe + `linear()` Baseline (2026-06-11, PAST); RETIRE-or-KEEP-with-probe.
  Verified KEEP today (E1 unpublished, `parseLinearStops === undefined`).
- **GH-6 / DEP-1 CNAME** (`J.md §J.W6` / `recap-GH.md §H-4 / G-6`) — S8: confirm-with-deploy-owner;
  VERIFY-ONLY, OUT (deploy-owned P0; kf-side deploy correctness is J.W0's oracle).
- **CE-1.0 Safari `linear()`-HW-accel hazard** (`audit/frontier/compositor-eligibility.md` CE-1.0 / §3.0;
  post-fleet J-fold, K-SEED §4) — S9: verify on-device that Safari refuses HW-accel for the spring-`linear()`
  twin the CURRENT delegation emits (`waapi.ts:316-318`); GUARD-or-DOCUMENT with the on-device trace as the
  artifact. Measure-first, beside S7's `linear()`-band re-verify. (NOT the CE-1 per-property partition — that
  is K-scoped; this is the hazard verification on the path that ships TODAY.)

## §Design decisions (trade-offs RESOLVED)

- **Probe-or-KILL, never a fifth BOOK — RESOLVED.** The four ≥4-tranche riders (FB-2, SoA, FB-5,
  FB-6) have ridden as MEASURE-FIRST/BOOK without an authored probe (`deferred-ledger.md:181-185`).
  P-invariant-28 forbids the fifth ride: each MUST produce its measurement artifact or a
  reasoned-from-the-number KILL. The wave's deliverable is the artifact, not the IMPL — the SoA
  ADOPT and FB-2 LAND, if they fire, are separate authorized motions; J.W6 PRODUCES THE DECISION
  with its evidence. This is the difference between a terminal disposition and a perpetual punt.
- **The artifact is the MEASURED number, not the estimate — RESOLVED.** PF-1's est. is 100-200 KB
  (`perf-frontier.md:153`); the est. is NOT the artifact — the before/after `vendor-three` delta is
  (`J.md §J.W6 gate`). SoA's "2.5-4× at K=8-10" is the G-era measurement; J RE-measures on the
  current tree at K=8 against the 20% threshold. No rider lands or dies on a remembered number.
- **EF-3 / S7 KEEP is evidenced, not asserted — RESOLVED.** value.js E1 is unpublished today
  (`parseLinearStops === undefined` in 0.11.2, probe-verified) — the shim correctly stays. The
  difference from a forbidden fifth-defer is that S7 records the PROBE OUTPUT as the artifact and the
  HANDOFF is sibling-gated CHRONIC-by-design (the re-pin process, OUT), with a paired born-RED gate
  (`grep parseLinearStops src/ = 0` reds-on-retire). A recorded probe + a paired gate is a terminal
  disposition; a bare "still pending" is not.
- **FB-6 DEFAULT-KILL — RESOLVED.** The palette was DELETED once (E.W11), the J.W7a
  appearance-grammar fold (`J.md §J.W7a`) does not name it, no owner pulled it across 4 tranches. The DEFAULT is KILL (+ residue
  sweep); BUILD fires ONLY on an explicit owner election, and then as a glass-ui consume (inv-16) or
  a recorded born-RED demo BUILD — never an auto-revival.
- **GH-6/DEP-1 stays OUT — RESOLVED.** The CNAME is deploy-owned (fourier), not a kf rider; kf
  VERIFIES-AND-RECORDS the owner confirmation. The kf-side deploy correctness is the J.W0 observed
  green-CI→auto-deploy oracle (the boundary-ORACLE extension); DEP-1 cross-references it, not folds
  into a kf gate. (`J.md §chronic fold`: *"DEP-1/2/3 deploy-repo-owned; J.W6 confirms DEP-1 only."*)
- **No workaround on any exit — RESOLVED (the §MANDATE binding).** Every KILL is reasoned from the
  measured number/probe (not a re-defer in disguise); every LAND/ADOPT ships behind its correctness
  oracle (`proof:event-ordering` for FB-2; the no-legacy excision for EF-3 RETIRE) — not a longer
  `settleMs`, not a `continue-on-error`, not an `IN_CI` escape on the event-ordering correctness gate.
