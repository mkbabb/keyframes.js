# Tranche F — PROGRESS

Status board for keyframes.js' sixth tranche. The plan is `F.md` (the canonical
charter); the close report is `FINAL.md` (authored at F.W17). Audit evidence is under
`audit/`; the value.js charter v2 is `valuejs-sota-handoff-v2.md`. The wave specs are
under `waves/` (authored at implementation-open).

F's single duty, inherited from E's honest close: **land the narrow, net-new finishing
work the post-E deep-SOTA assay surfaced — and prove F net-new by what it leaves
untouched.** The post-E stack is **~90% SOTA** (`F.md` § ALREADY-SOTA, binding): the
kernel, the spring/decay analytics, the WAAPI harness, the FrameCompiler, the value.js
boundary, the modern-web demo, the color science, and the parse-that fast tier are
exemplary and re-touched by NO wave. F's content is **concentrated**: the single largest
*measured* per-frame win (E correctly WITHHELD it; F re-measured at 3.8–6.2×), the parsing
consumption-seam correctness cluster, the un-gated orchestration tier finished + dogfooded,
the verification-discipline fix (3 inv-tagged gates never run in CI; the benches
`TypeError`), and the augmented value.js charter (inv-16 hand-off).

**F's content is NET-NEW, stated honestly.** D was the terminal home for every
keyframes-owned deferral (P-invariant-28). The deferred ledger F inherits is CLEAN —
**zero KFE** (no chronic debt folds into an F wave). The bands' provenance: Band 0
(verification — gate-coverage residuals, NOT debt), Band 1 (engine perf — E withholds
RE-MEASURED + graduated), Band 2 (parsing seam — silent data-loss holes value.js already
parses), Band 3 (orchestration + arch cohesion — un-gated E.W10 tier finish + isomorphic
folds), Band 4 (modern platform / SVG — the one real competitor-feature gap), Band 5 (demo
design — surfaces W11 reached partway), Band V (the value.js charter v2, chronic-by-design,
the only true chronic). All keyframes-local bands are **net-new, NOT folded debt**. See
`F.md` § Honest provenance for the full record. **F folds no chronic debt because none
remains.**

## Phase

**TRANCHE DEVELOPMENT** (the audit + these docs), on branch `tranche-e-impl` (off
`tranche-e-impl` HEAD; D+E IMPLEMENTED + CLOSED). The deep-SOTA assay (F.W0) is RUN — the
evidence is on disk under `audit/` (27 phase-1 lanes + 5 synthesis lanes, each
`file:line`-grounded with a SHIP/MEASURE-FIRST/BOOK/KILL/RECORD/HANDOFF disposition and a
re-runnable instrument). The DEVELOPMENT artifacts are authored: `F.md` (the canonical
charter), this board, the deferred-ledger / gap-scorecard / prompt-recap (audit synthesis),
and `valuejs-sota-handoff-v2.md` (the inv-16 hand-off).

**F.W1..F.W17 IMPLEMENTATION awaits explicit authorization** — the implementation phase
opens only on explicit user authorization, gated on keyframes' own green CI (inv-27),
exactly D.W0's and E.W0's dev/impl boundary. No engine, demo, library, parser, test, or
bench source is written in development. Each F.W1..F.W16 spec lands under `waves/` at
implementation-open carrying its own falsifiable hard gate; F.W17 closes.

**The mandate is BINDING + sweep-enforced** (`F.md` § Mandate): NO quick solutions / NO
workarounds (the delete-loop fold is the V8-correct stable-key null-fill, NOT the fresh-`{}`
revert; the held `Animation`/group sync-step half is locked OUT by an event-ordering parity
test, no half-measure), architectural transpositions for elegance·simplicity·performance,
NO legacy (the `parseLinearStops` shim retires when value.js E1 lands — not patched in
place), measure-first (every perf claim behind a shaped biting bench or recorded-withheld
with the number — the `d3-changed-keys.measure.test.ts` bar), isomorphic-unless-named, KISS
(the § ALREADY-SOTA record binding — manufacture NO work where the kernel leads), inv-16
(value.js + parse-that items are HAND-OFFs — propose, never write).

**Planned DAG (run-later):** **Band 0** F.W0 (now) → F.W1 ∥ F.W2 ∥ F.W3 (verification —
leads; F.W1 unblocks the benches every perf disposition needs); → **Band 1** F.W4 ∥ F.W5 ∥
F.W6 (engine perf — depends on F.W1); ∥ **Band 2** F.W7 ∥ F.W8 (parsing seam — independent,
parallel); ∥ **Band 3** F.W9 → F.W10 (transport then dogfood) ∥ F.W11 (arch folds, indep);
∥ **Band 4** F.W12 (MotionPath, indep) ∥ F.W13 (baseline adopts — VT gated on glass-ui
H-1); ∥ **Band 5** F.W14 ∥ F.W15 ∥ F.W16 (demo, independent of the engine bands — F.W10's
dogfood scene respects F.W16's promoted rail/ball idiom). **Band V** is orthogonal (kf
consumes through the unchanged `lerpValue` seam; the vj owner sequences it). **Band Z**
F.W17 closes. **Critical path:** `F.W1 → F.W4/F.W5/F.W6`. F is **independent of D.W5/W6**
(which close on glass-ui 3.3.0 via D's heartbeat `b5gt704vz`) — NOT F's scope. The library
legs are gate-free (`proof:boundary`); only the demo legs gate.

## Wave status

| Wave | Title | Phase | Status | Hard gate (falsifiable instrument) |
|---|---|---|---|---|
| **F.W0** | Assay confirmation (this charter + the recap) | DEV | **RUN now** | The 27+5-lane assay is on disk under `audit/` + re-runnable (each lane cites a grep/wc/bench instrument that re-executes from the repo); this charter, the board, the deferred-ledger / gap-scorecard / prompt-recap, and `valuejs-sota-handoff-v2.md` are present; the consolidated deferred ledger confirms **zero KFE** (P-invariant-28 — D terminated every keyframes-owned deferral; F folds no chronic debt); every F.W1..F.W16 finding carries its own falsifiable hard gate. |
| **F.W1** | Fix the broken benches + author the missing ones | IMPL | **authored — awaits auth** | `proof:bench-runs` — `npm run bench` exits 0 and produces non-empty results for the compile + interp suites (bites TODAY: `bench/{interpolation,parser}.bench.ts:2` import `CSSKeyframesAnimation` from the type-only barrel `src/animation/index.ts:108` → `TypeError: not a constructor`). The fix is the `../src/animation/engine` import; new benches authored (`interp-buffer`, `sync-step`, `compile` editing-profile, `SpringProgress.tick`). Harness-only, isomorphic. |
| **F.W2** | Wire `proof:all` into CI | IMPL | **authored — awaits auth** | `proof:ci-coverage` — a CI step invokes `npm run proof:all`; a bite control flips one grep gate red and the CI job fails. Bites TODAY: `.github/workflows/ci.yml` runs `proof:boundary/engine/zero-alloc/decomposition/idioms/brittleness` but `proof:dogfood` (inv ζ), `proof:demo-elevate` (inv ο — the SOLE View-Transitions lock), `proof:modern-web`, and `proof:platform-adopt` have **0** matches in the workflow (verified `grep -c`). |
| **F.W3** | `proof:orchestration` + the two public-API tests | IMPL | **authored — awaits auth** | `proof:orchestration` (new) — bites if any orchestration behaviour clause regresses (stagger-distribution / FLIP-rect / decay-rest / Sequence-ordering); the E.W10 tier shipped as the highest-profile new public API with the WEAKEST gate (bare `vitest run`). Plus the two missing public-API behavioural tests (`createNativeTimeline` guard-absent, `toEasing` normalizer). |
| **F.W4** | The dict-mode buffer fold + the single-frame alias | IMPL (Band 1) | **authored — awaits auth (DEPENDS on F.W1)** | `proof:interp-fastprops` (new) — a `%HasFastProperties` assertion on the reused buffer + a threaded-buffer bench that bites if the buffer falls into dictionary mode; pixel-identical output lock. Bites TODAY: the `delete`-loop (`engine.ts:573`, `group.ts:212`) holds every reused buffer in V8 dictionary mode → threaded-buffer playback 3.8–6.2× slower (three independent re-measures); the `Object.assign(result, frame.flatVars)` re-copy (`engine.ts:636`) — single-frame can alias `frame.flatVars` directly (41.7×). |
| **F.W5** | The sync-step fast path, `drive` half | IMPL (Band 1) | **authored — awaits auth (DEPENDS on F.W1)** | `proof:sync-step` (new) — a promise-count assertion (synchronous `drive` steppers schedule zero microtasks); the held `Animation`/group half is locked OUT by an event-ordering parity test. Bites TODAY: `RAFPlayback._run` (`playback.ts:99-108`) wraps every frame in `Promise.resolve(step(now)).then` even for synchronous `drive` steppers. MEASURE-FIRST → LAND `drive` half · HOLD `Animation`/group (the boundary awaits carry event-ordering semantics). |
| **F.W6** | The computed-unit endpoint cache | IMPL (Band 1) | **authored — awaits auth (DEPENDS on F.W1)** | `proof:computed-frame` (new) — a call-counter on the per-frame resolve path; asserts steady-state resolves are served from the endpoint cache, not re-derived. Bites TODAY: `lerpComputedValue` re-resolves both endpoints every frame; the value.js memo re-serializes its key (`value.toString()`) per hit (~190 ns/leaf/frame). The kf endpoint cache never landed in E. kf SHIP-in-F seam (~190 → ~1.2 ns, −99.3%) + value.js-HANDOFF (Band V Wave C). |
| **F.W7** | The serializer round-trip symmetry | IMPL (Band 2) | **authored — awaits auth (∥ engine bands)** | `proof:roundtrip-easing` (new) + `proof:spring-roundtrip` — a per-keyframe-easing round-trip test that bites TODAY (emit → re-parse → assert per-stop curve preserved). `fromString` READS per-keyframe `animation-timing-function` and stores it (`engine.ts:1089-1096`, `constants.ts:80`) but `CSSKeyframesToString` (`format.ts:65-76`+) emits only the top-level curve → asymmetric round-trip (per-stop curves silently lost). Factor `serializeEasing()`; emit per-keyframe easing when it differs from the default. Byte-stable for uniform-easing. |
| **F.W8** | Capture the dropped adapter metadata | IMPL (Band 2) | **authored — awaits auth (∥ engine bands)** | `proof:adapter-capture` (new) — a `fromString` test asserting the style-rule shorthand takes effect + ctor overrides; a `composition`-captured assertion. Bites TODAY: `animation-composition` is parsed by value.js (`stylesheet.ts:327-333`) but the adapter drops it (`ResolvedKeyframes` carries no `composition` — `adapter.ts:18-30`); `resolveKeyframes.options` (`adapter.ts:122`) is computed then never consumed (0 reads). SHIP capture + options-apply; BOOK the deeper composition-honoring (no half-wire). |
| **F.W9** | Complete the `Sequence` transport | IMPL (Band 3) | **authored — awaits auth** | A seek↔play parity test (the boundary-frame event ordering + the C⁰-continuity at `reverse`/`timeScale` flips). The just-shipped `Sequence` is transport-incomplete vs the GSAP Timeline it names as gold-standard — no `pause`/`resume`/`reverse`/`timeScale`/`progress`/`repeat`/`yoyo`; the substrate (`seek` + `RAFPlayback` managed-pause) is already there. SHIP via scalar-field arithmetic over the existing `seek` + re-anchor (MEASURE-FIRST on reverse/timeScale C⁰-continuity). |
| **F.W10** | Dogfood the orchestration tier | IMPL (Band 3) | **authored — awaits auth (DEPENDS on F.W9 + demo band)** | An inertia-parity test (the `decay()` swap is behaviour-equivalent to the hand-rolled `Math.pow` within epsilon); the new `Sequence`+`stagger` scene is exercised by `proof:dogfood`. Bites TODAY: `decay`/`Draggable`/`Sequence`/`stagger`/`flip` have ZERO demo callsites; `useOrbitalInertia.ts:62` hand-rolls `Math.pow(inertiaFactor, dt/TARGET_DT)` — the discrete Euler of the shipped `decay()` closed form (an inv-ζ analogue). The proof IS the demo. |
| **F.W11** | The boundary cohesion folds | IMPL (Band 3) | **authored — awaits auth (indep)** | `proof:boundary` holds (presets route through the heavy surface); a preset-import smoke (`import { fadeIn }` resolves); the clamp-convergence grep (`proof:idioms`). Bites TODAY: `animations.ts` (870L) is on no barrel — `import { fadeIn } from "@mkbabb/keyframes.js"` resolves nothing; `clamp` is open-coded 4× (`smooth.ts:78,131`, `timeline.ts:34`, `waapi.ts:225`) while `internal/leaves.clamp` (`internal/leaves.ts:23`) exists; `group.ts` borrows `leaves.lerp` for one call (inverted-tier import). Isomorphic; byte-identical. |
| **F.W12** | CSS-native MotionPath | IMPL (Band 4) | **authored — awaits auth (indep)** | `proof:motion-path` (new) — a MotionPath eligibility + compositor-thread assertion (reuses the WAAPI eligibility gate); a demo scene. keyframes ships zero path/SVG primitives; `offset-distance: 0%→100%` over an author `offset-path` is pure WAAPI-eligible CSS, zero value.js dep. The highest-ROI competitor close; engine-side, additive new public API. |
| **F.W13** | Baseline-platform adopts | IMPL (Band 4) | **authored — awaits auth (VT gated on glass-ui H-1)** | The `text-wrap: pretty` presence; the demo BOOKs consume the glass-ui `types` helper once it lands. Directional View-Transition types are Baseline (2026-01-13) but the enabler `startViewTransition({types})` is glass-ui-owned; Invoker Commands Baseline 2025-12-12. SHIP `text-wrap: pretty` (≤1-line) + glass-ui-HANDOFF (H-1) + BOOK (typed/directional scene-VT, `Mod+K` palette, intrinsic-size, splitText). |
| **F.W14** | Undo/redo for the destructive editor | IMPL (Band 5) | **authored — awaits auth (indep)** | An undo/redo round-trip behavioural test (a destructive op + `Mod+Z` restores prior state). The demo is a destructive editor with NO undo/redo — clear-all/delete-frame/free-form CSS edits all irreversible; gates the core try→undo→try loop (NEW; E lanes did not raise). `useRefHistory` is already a dep; scoped + debounced over timeline+CSS state; `Mod+Z`/`Mod+Shift+Z` via the existing 19-shortcut registry. Additive. |
| **F.W15** | The a11y SHIPs + shortcut discovery | IMPL (Band 5) | **authored — awaits auth (indep)** | `proof:demo-elevate` a11y clauses (the labeled textbox; the asset alt); the visible shortcuts-trigger present. The `contenteditable` CSS pane is unlabeled + no focus ring (E-UX-13, never landed); the playground asset `<img>` has no alt (E-UX-8 half-open); the 19-shortcut registry has no visible discovery affordance (`?`-only). SHIP `role="textbox"`+`aria-label`+`.focus-ring`, `:alt`, a visible trigger + BOOK (`Mod+K` palette). |
| **F.W16** | The rail/ball idiom + hero typography/a11y | IMPL (Band 5) | **authored — awaits auth (F.W10's scene respects this)** | `proof:idioms` (the rail/ball pair de-duplicated); a hero accessible-name assertion. The rail/ball idiom is still 4× with drift — W11's commit claimed "progress-dot promoted" but promoted the WRONG primitive; the per-character hero defeats `text-wrap: balance`, has no accessible name (AT reads "S…e…l…e…c…t"), drives a JS `width<768` line-break. SHIP a real `progress-rail`/`progress-ball` pair + `sr-only` mirror + `aria-hidden` spans (the LCP element's substrate; the named design-cohesion delta). |
| **F.W17** | The F FINAL + the changeset + provenance | IMPL (LAST) | **authored — awaits auth** | `FINAL.md` reconciles the consolidated ledger (zero KFE re-verified; every SHIP regression-checked, every BOOK/RECORD/HANDOFF stable); the prompt-recap confirms every A→F ask ADDRESSED / PENDING (D-owned) / F-SCOPE; the F changeset (**likely minor** — F.W12/F.W9 ship observable additive new public API) is cut + the version owner named; the untracked `wf-*.mjs` provenance committed (BOOK); **absorbs the F.W1–F.W16 gates**; the full proof suite green; no unintended regression. |

## W0 audit evidence (on disk)

The deep-SOTA assay lands under `audit/` — 27 phase-1 lanes + 5 synthesis lanes, each
`file:line`-grounded with a SHIP/MEASURE-FIRST/BOOK/KILL/RECORD/HANDOFF disposition and a
re-runnable instrument. The five synthesis lanes are the load-bearing reconciliation:

- **`_SYNTHESIS-gap-scorecard.md`** — the honest post-D+E map: ALREADY-SOTA (manufacture
  no work) vs GAP (the net-new F content), across engine / parsing / runtime / compile /
  demo / value.js. Every row traces to a phase-1 lane or `file:line`. §0 names the thesis:
  F is net-new, NARROW, ~90% already-SOTA.
- **`_SYNTHESIS-deferred-ledger.md`** — the whole-history A→F ledger. CLEAN — **zero KFE**
  (D was the terminal home for every keyframes-owned deferral; F folds no chronic debt). The
  6 chronic items: C-2 (the rename) EXITS at F (discharged by the 0.10.0 pin), C-1 (the
  value.js charter) is chronic-by-design, the rest are value.js-gated / half-landed / a
  gated decision (the library line-ceiling).
- **`_SYNTHESIS-prompt-recap.md`** — the full A→B→C→constellation→D→E→F recap; §Precepts
  confirms the recurring precepts (no-legacy, no-workaround, idiomatic+gestalt, isomorphic,
  measure-first, KISS, inv-16) HONORED across A→F with no drops.
- **`a-tranche-retro-F.md`** — the honest D+E process retro: §0 D+E discharged its own
  predecessor-retro's #1 projection (the orchestration tier landed in E.W10); §1 the
  deferred ledger is genuinely CLEAN; §3.1 the one caution is gate-coverage (F.W2/F.W3), not
  delivery; §4 the untracked `wf-*.mjs` provenance (F.W17).
- **`audit/parsing/_SYNTHESIS-parsing-sota.md`** — the parsing-band synthesis: the five
  `px-*` grammar/parser lanes reconciled into the consumption-seam disposition set (F.W7/F.W8).

The 27 phase-1 lanes under `audit/` (`r-*` research, `a-*` audit, `p-*` perf, `vj-*`
value.js) each carry their own file:line evidence; the `audit/parsing/` sub-fan adds the 5
`px-*` grammar lanes; `F.md` cites them per-wave. The inv-16 value.js charter v2
(`valuejs-sota-handoff-v2.md`) is a DEVELOPMENT artifact (Band V), not an assay lane.

## Verified facts at F-open

Every figure below is a re-runnable `wc -l` / `grep` / `sed` measurement against the live
tree on `tranche-e-impl` (2026-06-06), not the plan's prose — **verified, not asserted.**

- **The benches are broken** — `bench/interpolation.bench.ts:2` and `bench/parser.bench.ts:2`
  both `import { CSSKeyframesAnimation } from "../src/animation"`, which E made a **type-only
  export** (`src/animation/index.ts:108` — `export type { Animation, CSSKeyframesAnimation,
  AnimationGroup } from "./engine"`) → `TypeError: not a constructor` on bench construction.
  Every measure-first disposition in Band 1 is un-measurable until F.W1 fixes this. (verified)
- **The dict-mode buffer deopt** — the `delete`-loop is live at `engine.ts:573` (`for (const
  k in result) delete result[k]` over the `out` buffer) and `group.ts:212` (`for (const k in
  groupedValues) delete groupedValues[k]` over `_grouped`). The `Object.assign(result,
  frame.flatVars)` re-copy is at `engine.ts:636`. (verified `sed`)
- **The serializer asymmetry** — `fromString` reads per-keyframe easing at
  `engine.ts:1089-1096` (`resolved.timingFunctions.get(percent)` → `getTimingFunction` →
  `addFrame(... { fn })`) but `CSSKeyframesToString` (`src/animation/format.ts`, `CSSKeyframesToStrings:16`)
  emits only the top-level `animation-timing-function` from `options.timingFunction`
  (`format.ts:65-76`). Per-stop curves are silently lost on re-parse. (verified `grep`)
- **The dropped adapter metadata** — `src/animation/adapter.ts:18-30` declares
  `ResolvedKeyframes` with `options` but **no** `composition`; `adapter.ts:122`
  (`options: extractAnimationOptions(ast)`) computes the style-rule shorthand that has 0
  reads in `engine.ts`. (verified `grep`)
- **The clamp 4× + the missing barrel** — `clamp` is open-coded at `smooth.ts:78,131`,
  `timeline.ts:34` (`clamp01`), `waapi.ts:225` (`Math.max(0, Math.min(1, …))`) while
  `internal/leaves.ts:23` exports `clamp`; `animations.ts` is **870L** (`wc -l`) and is on
  **no** barrel (zero `animations` re-export in `src/animation/index.ts`). (verified)
- **The CI-coverage gap** — `.github/workflows/ci.yml` runs `proof:boundary`/`proof:engine`/
  `proof:zero-alloc`/`proof:decomposition`/`proof:idioms`/`proof:brittleness`; `proof:dogfood`,
  `proof:demo-elevate`, `proof:modern-web`, and `proof:platform-adopt` have **0** matches in
  the workflow. `npm run proof:all` (`package.json:55`) chains 13 gates + `vitest run` — but
  CI does not invoke it. (verified `grep -c`)
- **The dogfood hand-roll** — `demo/@/components/custom/orbital-drag/composables/useOrbitalInertia.ts:62`
  is `const decay = Math.pow(inertiaFactor, dt / TARGET_DT)` — the discrete Euler form of the
  shipped `decay()` closed form. (verified `grep`)
- **The proof suite + benches are checked in** — 10 `scripts/proof-*.mjs` source-gates, 40
  `test/*.test.ts` files, 3 `bench/*.bench.ts` files; `engine.ts` is ~1179L (`wc -l`), the
  `Animation` class itself ~913L (`engine.ts:80-993`) — exempt from the demo's 350L ceiling,
  at its cohesive gestalt (the library line-ceiling is a gated DECISION for Band 0, not a
  reflexive split). (verified)

## Cross-repo / outward perimeter (USER-DOMAIN — confirm before each)

F is keyframes-internal (inv-16: writes only keyframes.js), cognizant of the in-flight
siblings — it consumes their *published* surface, proposes their motion, writes none of
them. **F's keyframes-local waves are gate-free of glass-ui** (the F DAG is independent of
the D.W5/W6 dock close).

1. **The value.js charter v2 (FOLD-VALUEJS-HANDOFF — inv-16, the only true chronic).**
   `valuejs-sota-handoff-v2.md` augments the 405-line `E/valuejs-sota-handoff.md`: Waves
   A–F carried, Wave D RE-POINTED by measurement (D1 monomorphization is a measured non-win
   → promote D2 SoA `Float64Array`), the §2 rename DISCHARGED (C-2 EXITS the chronic band
   at F — kf imports neither `CSSAnimationOptions` nor `Color.L`), F4 CLOSED-by-verification
   (value.js stores the raw `@property` syntax string; kf registration is NOT lossy), and
   three NET-NEW color findings (`formatColor` always-`/alpha`, the B3 per-frame alloc
   inventory, the `Color.clone()` depth-counter constraint). kf consumes everything through
   the single `lerpValue → iv._lerp` seam (`engine.ts:629`) with ZERO kf edits. **The
   value.js owner sequences the waves; kf proposes, never writes.** F6/F4-KILL/I2/I3 each
   pair a value.js wave but require ZERO kf edits to land the kf half independently — F does
   NOT block on it.
2. **The parse-that hand-off (inv-16).** The parse-that items (the `dispatch` LUT
   extension; the `stripCSSComments` pre-pass feeding F.W8's `wrapBareKeyframes`
   decide-on-the-AST, Band V Wave A4) are proposals to the parse-that owner — recorded in
   the value.js charter v2 alongside the value.js waves. kf proposes, never writes them.
3. **glass-ui-HANDOFF** — the `startViewTransition({types})` directional-VT helper (H-1,
   F.W13) is glass-ui-owned; F BOOKs the demo's typed/directional scene-VT until it lands.
   The `LabeledField` a11y (ASK-3), the `--spring-*` codegen (ASK-2), the reka-ui
   dialog/popover seam, and the `<Role>Dock` base are ALL glass-ui-owned (carried from E).
   F keeps the named lighthouse allowance stable, applies NO vendor band-aid in the demo
   (inv-16). These are OUT, not F findings.
4. **D.W5/W6 are D's close — NOT F's scope.** D.W5 (dock-rename + square/mobile occlusion
   close) and D.W6 (D FINAL + B/C/D version owner) gate on glass-ui PUBLISHING 3.3.0; D's
   heartbeat (`b5gt704vz`) auto-resumes them when 3.3.0 lands on npm. F does not touch the
   dock; F's waves do not depend on the dock close. F keeps inv δ (zero dock-over-content
   overlap) green in its demo waves.
5. **The publish leg (USER-DOMAIN).** The stacked changesets are CUT, unpublished:
   `.changeset/` holds `tranche-b-3-1-0.md` + `tranche-c.md` + `tranche-d.md` +
   `tranche-e.md` (verified); `package.json` version `3.0.0`. F.W17 cuts F's own changeset
   (**likely minor** — F.W12 MotionPath + F.W9 `Sequence` transport ship observable additive
   new public API; the perf folds are isomorphic, the parsing fixes a WRONG value to right,
   the demo SHIPs are additive — the version owner decides) and names its version owner
   (**Mike Babb**, `mike@babb.dev`). Everything up to "ready-to-publish, CI green" is
   autonomous; the npm-publish legs the user drives in dependency order, confirm-first.

## Release tier (reconciled)

The F changeset stacks atop **B `3.1.0` + C `major` + D `major` + E `minor`** (all cut,
never published). F's own tier is **likely minor**: F.W12 (CSS-native MotionPath) and F.W9
(the `Sequence` transport completion) ship observable additive new public API; the Band 1
perf folds are isomorphic (pixel-identical), the Band 2 parsing fixes correct a WRONG value
to right (round-trip symmetry, captured metadata — strictly-more-correct, byte-stable for
the uniform case), and the Band 5 demo SHIPs are additive. The combined B+C+D+E+F publish
tier remains **major**, driven by C/D. The version owner names F's tier definitively at
F.W17.

## Open deferrals

Zero perpetual punts. **Zero KFE.** D was the terminal home for every keyframes-owned
deferral (P-invariant-28); the ledger F inherits is CLEAN. F folds no chronic debt because
none remains — F's content is NET-NEW findings from the post-E deep-SOTA assay, not folded
debt. The full whole-history A→F ledger is in `audit/_SYNTHESIS-deferred-ledger.md`; the
terminal summary:

| Item | Tag | Terminal status / F duty |
|---|---|---|
| `proof:boundary` · inv γ · inv δ · inv ζ · inv ε (the standing gates) | **CLOSED** | landed A/B/C, D+E-verified; F keeps green (no-regress) + F.W2 wires the 3 un-run inv-tagged gates into CI |
| every keyframes-owned chronic deferral | **KFD-TERMINATED (D)** | D was the terminal home — zero KFE rows; F manufactures no fold |
| the value.js charter (C-1) | **CHRONIC-by-design** | inv-16 binds kf from writing value.js; F AUGMENTS (`valuejs-sota-handoff-v2.md`), does NOT close — the vj owner sequences it |
| the `AnimationOptions`→`CSSAnimationOptions` / `Color.L` rename (C-2) | **DISCHARGED at F** | the 0.10.0 pin discharged it; kf imports neither name — EXITS the chronic band |
| `@property` lossless syntax (vj F4) | **CLOSED by verification** | value.js stores the raw syntax string; kf registration is NOT lossy — strike the "add if not" branch |
| ASK-3 `LabeledField` a11y · ASK-2 `--spring-*` codegen · the `types` VT helper (H-1) · `<Role>Dock` base | **OUT / glass-ui-HANDOFF** | F keeps the enablers + the named allowance stable; no vendor band-aid; F.W13 BOOKs the demo's VT-types consumer until H-1 lands |
| MorphSVG / DrawSVG / numeric MotionPath (S2) · path-geometry sampler (VJ-F1) | **BOOK + value.js-HANDOFF** | value-domain geometry MISSING from the E handoff; the CSS-native MotionPath sliver (F.W12) ships kf-side independently |
| ScrollTimeline-native-REPLACE · Worker / OffscreenCanvas · dev.sh/deploy.sh | **ARCH** | permanent KILL (recorded; the F perf assay re-affirmed) — the native scroll bridge is additive only, the JS-sampler kill HOLDS |
| D.W5 (dock + occlusion close) · D.W6 (D FINAL + B/C/D version owner) | **D-PENDING-ON-GLASS-UI-3.3.0** | D's close, gated on glass-ui 3.3.0; D's heartbeat resumes it — NOT F's scope |
| the stacked publish leg (B `3.1.0` + C `major` + D `major` + E `minor` + F) | **USER-DOMAIN** | confirm-first; F.W17 names F's own version owner |

**There is no KFE row.** No item folds chronic debt into an F wave. The F waves are
findings, not folds. No item is named-forward to a seventh tranche. The one
chronic-by-design item (the value.js charter, C-1) is chronic *correctly* — inv-16 binds kf
from writing value.js; F augments and hands off.

## § ALREADY-SOTA pointer (binding)

The bulk of the post-E stack is exemplary and re-touched by NO F wave — the engine kernel,
the interpolation core, the spring/decay/drag analytics, the WAAPI harness, the
orchestration tier (modulo F.W9/F.W10/F.W3 finish), the FrameCompiler, the value.js
boundary, the modern-web demo surface, the value.js color science, the parse-that fast
tier, the test bite-discipline (modulo the F.W2 CI seam), and the process. The full binding
record is `F.md` § ALREADY-SOTA, cross-confirmed by `_SYNTHESIS-gap-scorecard §3`,
`a-engine-post-e §ALREADY-SOTA`, `a-boundary-arch-F §ALREADY-SOTA`, and the `r-cwv-inp-2026`
headline. **Per the §Mandate (KISS), no wave may manufacture a deficit where the post-E
state leads.**
