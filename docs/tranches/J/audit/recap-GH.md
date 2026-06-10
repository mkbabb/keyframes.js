# Tranche J Audit — Lineage Recap: Tranches G + H

**Lane:** recap-GH  
**Date:** 2026-06-09  
**Branch audited:** `tranche-i-dev` (current HEAD post-I-close, pre-J)  
**Sources read:** `docs/tranches/G/{G.md,FINAL.md,PROGRESS.md,valuejs-parsethat-glassui-handoff.md}` + `docs/tranches/H/{H.md,FINAL.md,PROGRESS.md,valuejs-parsethat-glassui-handoff.md,glass-ui-AX-handoff.md}` + `docs/tranches/I/FINAL.md` + `docs/tranches/I/PATH-FORWARD.md` + live tree inspection.

---

## Executive Summary

**Tranche G (the re-pin spine) genuinely closed every claim it made.** G.W1–G.WZ all landed behind biting gates on `tranche-g-impl`; kf was cut at `4.1.0`; the dep re-pin (value.js `^0.11.1`, parse-that `^0.9.0`, glass-ui `^3.3.0`) + DrawSVG/`.finished`/`adoptCompiled` + the blend-leaf fix + the rAF-leak fix + the Playwright demo SHIPs are live in the tree. G's claims hold. Its residual: the sibling HAND-OFFs (value.js E1/E2 shim, VJ-F1 sampler, etc.) are correctly carried forward as value.js-owned, riding the next re-pin with zero kf edit.

**Tranche H (demo-quality / design-language / FSM) is the catastrophe Tranche I corrected.** H shipped at `b934a08` with 97 `proof:*` gates GREEN and its FINAL declaring every request resolved and four chronics CLOSED. That certification was false. I's investigation confirmed nine user-visible breakages B1–B9+K against the live `dist/`, including breakages in the exact four chronics H claimed closed-via-system-gate. The root cause was H's gate regime: ~54 of ~98 nominal correctness gates were source-shape / jsdom / proxy-store / load-rest, structurally blind to runtime defects; not one drove PLAY→SWITCH→DRAG. H's headline durability mechanism `proof:chronic-closure` was itself a source-shape gate parsing a markdown table. Furthermore, `proof:no-route-storm` — cited in H's FINAL as the FSM correctness gate for D12 — **was never authored** (absent from `package.json`, no script file).

**What H genuinely delivered and I kept:** the FSM keystone (W1 `useSceneMachine()`), the `rail·stage·rail` layout (W3), the cartoon-shadow restoration (W2), the mobile overlay + `SpringProgress` drawer (W7), the typing-dots dogfood (W6), the scene-icon SVG family + Discrete→Spring merge (W5), the easing/hero rung (W4), the component encapsulation sweep (W12), plus the gate infrastructure itself (`proof:visual-lock`, `proof:manifest-sourced`, `proof:chronic-closure` — all DEMOTED to hygiene tier by I.W7 but structurally preserved). The `proof:scene-machine-irrefragable` + `proof:scene-raf-leak` + `proof:dock-popover-opens` + related H hygiene gates are still in the tree, in the hygiene tier.

**What H claimed-closed that I re-opened/re-closed:** all four chronics. CH-1 (cartoon/specular) re-opened because H's `proof:no-orphan-specular` was a source-shape gate and glass-ui `~3.5.1` still produced a visible bloom — closed by I.W6 + the `~3.9.0` pin + `proof:specular-absent-at-rest` (pixel oracle). CH-4 (dock) re-opened because `proof:dock-morph-settled` was a design-token-number proxy — closed by I.W4's `proof:perf-frame-budget` (interaction oracle). CH-3 (mobile) re-opened because the layout-box proxy could not see felt-interaction quality — closed by `proof:drag-gesture` + `proof:perf-frame-budget`. CH-2 (φ-hero) was genuinely closed by H; I re-affirmed it via `proof:live-session`.

**What H built that I RETIRED:** five H proxy gates (`proof:demo-console-clean`, `proof:dock-morph-settled`, `proof:no-orphan-specular`, `proof:scene-icons`, `proof:dragscrub-single`) stripped of correctness authority and moved to hygiene or retired. The vaporware IOU `proof:specular-handoff` (parked against glass-ui 3.8.0 which did not exist on npm at H-close) was DELETED.

**G sibling HAND-OFFs — status today:** value.js `parseLinearStops` shim still lives at `src/animation/utils.ts:106-130` (verified — value.js E1/E2 unpublished); VJ-F1 path sampler OPEN; VJ-F2 diagnostics sink OPEN; VJ-F4 buffer serializer OPEN; VJ-F6 LRU OPEN; MCI-5 arity-pad OPEN (the `it.fails` witness is still live at `test/interpolate-anything.test.ts`). PT-2 packrat re-key still OPEN (parse-that internal). GH glass-ui: `LabeledField orientation` OPEN; `{types}` VT helper OPEN; these are correctly carried as CHRONIC-by-design HANDOFFs. Deploy P0 CNAME drift (DEP-1 `dns-cf-sync.sh`) remains OPEN per I.FINAL.

---

## Tranche G — What Was Chartered and What Actually Landed

### G Charter

G was a narrow re-pin-spined finisher with ONE headline SHIP: consume the published F hand-off siblings (value.js `^0.11.0`, parse-that `^0.9.0`, glass-ui `^3.3.0`) with ZERO kf source edit. Around the spine: post-F idiom-drift sweep; two gated decisions (line-ceiling C-6, back-compat framing); two net-new engine SHIPs (DrawSVG, `.finished`); the Playwright demo SHIPs (route reachability, hero word-spacing, aria-label); the CI hygiene drift; band G (dead blend leaf); band O (orbital rotate3d); band M (adoptCompiled); band T (testing corpora); band V (sibling HAND-OFFs). 19 waves G.W1–G.WZ.

### G What Landed (tree-verified)

| Wave | Claim | Tree Status |
|---|---|---|
| G.W1+W2 | Re-pin to `value.js ^0.11.1`, `parse-that ^0.9.0`, `glass-ui ^3.3.0`, ZERO kf source edit | **VERIFIED** — `package.json` shows `^0.11.2` (I re-pinned to `^0.11.2`; the G.W2 re-pin to `^0.11.1` landed then was bumped by I) |
| G.W3 | `bumpLayoutEpoch()` on `AnimationVisualizer` ResizeObserver | **VERIFIED** — `demo/@/components/custom/animation-controls/controls/AnimationVisualizer.vue:78` |
| G.W4 | `serializeEasing` throws typed error on custom closure | **VERIFIED** — `src/animation/format.ts:30` (+ I.W0 extended this) |
| G.W5 | `proof:decomposition` extended to `src/animation/**`; gated ceiling exception recorded | **VERIFIED** — ceiling in hygiene tier |
| G.W13 | `fromDrawSVG` + `get finished()` exported | **VERIFIED** — `src/animation/index.ts:163-165` |
| G.W17 | Dead `add`/`weighted` blend leaf fixed | **VERIFIED** — `group.ts:142-143` (+ I.W0 extended with NOOP_TRANSFORM) |
| G.W18 | Orbital rotate3d collapse; `quaternionEuler.ts` extracted | **VERIFIED** — `proof:orbital-rotate3d` in hygiene |
| G.W19 | `adoptCompiled()` engine seam | **VERIFIED** — `proof:adopt-compiled` in hygiene |
| G.WV sibling HANDOFFs | value.js `0.11.1` published; parse-that realm non-gating; glass-ui AW peers OPEN | **VERIFIED** — `package.json` shows correct pins |

### G Sibling HAND-OFF Status Today

| Item | Disposition in G.FINAL | Status TODAY (tree) |
|---|---|---|
| value.js E1/E2 `linear()`/`steps()` parser (retires `parseLinearStops` shim) | value.js-HANDOFF OPEN; shim rides until publish | **STILL OPEN** — `src/animation/utils.ts:106-130` shim present |
| VJ-F1 path-geometry sampler (MorphSVG/numeric-MotionPath) | value.js-HANDOFF OPEN; kf BOOK | **STILL OPEN** — no `getPointAtLength`/`samplePath` in value.js `0.11.2` |
| VJ-F2 diagnostics sink + `tryParse furthest` swap | value.js-HANDOFF OPEN HIGH; kf BOOK | **STILL OPEN** — no `ResolvedKeyframes.diagnostics` field |
| VJ-F4 buffer `unflattenObjectToString(flat, out?)` | value.js-HANDOFF OPEN | **STILL OPEN** — no out-buffer overload |
| VJ-F6 LRU on `getComputedValue.cache` | value.js-HANDOFF OPEN (once in value.js) | **STILL OPEN** |
| VJ-D2 `lerpArray` SoA consumption | value.js-HANDOFF (published) + kf MEASURE-FIRST | **STILL BOOK** — `proof:interp-soa` not authored |
| MCI-5 identity-aware fn-arity pad | value.js-HANDOFF OPEN; `it.fails` witness live | **STILL OPEN** — `test/interpolate-anything.test.ts` the witness still fails (GREEN=expected-fail) |
| PT-2 packrat `(id,offset)` re-key | parse-that-HANDOFF internal; `proof:packrat-position` FIRST | **STILL OPEN** (parse-that internal; no production consumer) |
| GG-3 `{types}` VT helper | glass-ui-HANDOFF AW | **STILL OPEN** — `useSceneTransition.ts` waits |
| GG-6 reka `SelectIcon` reach | RECORD / ALREADY-RETIRED (G.FINAL confirmed 0 `from "reka-ui"` in demo/) | **CONFIRMED RESOLVED** by G.W12 |
| deploy DEP-1 `dns-cf-sync.sh` CNAME P0 | deploy-HANDOFF P0 | **STILL OPEN** per I.FINAL §6 |
| deploy DEP-2 CF-Pages template | deploy-HANDOFF | **STILL OPEN** |

---

## Tranche H — What Was Claimed vs What Was True

### H's Core Charter Claims

H declared itself the demo-quality / design-language-restoration / mobile / scene-state tranche. Four chronics closed. The gate regime upgraded with `proof:chronic-closure` as durability keystone. 102 `proof:*` scripts. `proof:all` GREEN. `proof:browser` 35/35. `proof:visual-lock` GREEN.

### What H Genuinely Delivered (I kept and preserved)

| Item | H Wave | Verified in tree |
|---|---|---|
| ONE `useSceneMachine()` FSM collapsing 5 scene authorities + 3 playback authorities | H.W1 | `proof:scene-machine-irrefragable` still in hygiene tier |
| `rail·stage·rail` grid + `--rail-width` token | H.W3 | `proof:demo-shell-grid` + `proof:timeline-rail-width` in hygiene |
| Cartoon depth as panel hover idiom (`surface="cartoon"`) | H.W2 | `proof:cartoon-is-panel-depth` in hygiene |
| Mobile `SpringProgress` overlay sheet | H.W7 | `proof:drawer-spring` + `proof:mobile-single-page` in hygiene |
| Typing-dots dogfood (`steppedEase`/`NumericAnimation`) | H.W6 | `proof:typing-dots` + `proof:dogfood-hero` in hygiene |
| Inline-SVG icon family via `<component :is>` | H.W5 | `proof:scene-parity` in hygiene |
| Discrete→Spring merge (4 nav → 3) | H.W5 | hygiene |
| Easing canvas bounded; hero `text-display-mega` | H.W4 | `proof:easing-canvas-bounded` + `proof:hero-rung` + `proof:phi-leaf-zero` in hygiene |
| `useDragScrub` extraction | H.W12 | `proof:dragscrub-single` **RETIRED** — the source-shape oracle; the structural outcome preserved |
| `proof:visual-lock` pixel baseline | H.W8 | DEMOTED to hygiene tier; golden baseline updated by I |
| `proof:manifest-sourced` | H.W8 | in hygiene tier |
| The `[stage]`-track dock-safe containment primitive | H.W10 | `proof:stage-within-docks` in hygiene |
| Stage glass `<Card>` (I5 decision) | H.W11 | `proof:stage-glass-card` in hygiene |
| Control-surface DFA (3rd orthogonal FSM axis) | H.W11 | `proof:scene-control-dfa` / `proof:scene-machine-irrefragable` in hygiene |
| D9 @mbabb popover un-double-wrap | H.W1 S8 | `proof:dock-popover-opens` in hygiene |
| Easter eggs per scene | H.W12 | `proof:easter-egg` in hygiene |
| Sequence draggable rows + editable motion-path | H.W12 | `proof:sequence-rows-draggable` + `proof:motion-path-editable` in hygiene |

### What H Claimed-Closed That I Re-Opened

| Chronic | H claimed closed by | I's verdict | I's runtime gate |
|---|---|---|---|
| **CH-1 cartoon-shadow/specular (D2/D14)** | `proof:no-orphan-specular` (source-shape; `anyPointerWrite:false` invariant) + `proof:cartoon-is-panel-depth` | **FALSE** — glass-ui `~3.5.1` still rendered visible bloom on every glass stage; H's self-captured baseline masked the subject out | `proof:specular-absent-at-rest` (rendered `::before` alpha ≤0.05 by pixels) |
| **CH-2 φ-hero typography (D7)** | `proof:phi-leaf-zero` + `proof:hero-rung` | **RE-AFFIRMED GENUINE** — actually closed; I corroborated via `proof:live-session` body-typography leg | `proof:live-session` |
| **CH-3 mobile architecture (D10)** | `proof:mobile-single-page` + `proof:drawer-spring` | **PARTIALLY FALSE** — the layout-box proxy passed but felt-interaction quality (drag seam, frame budget) was unverified | `proof:perf-frame-budget` + `proof:drag-gesture` |
| **CH-4 dock lag (D5) + @mbabb popover (D9)** | D5: `proof:dock-morph-settled` (token-peak parse, NOT a felt interaction); D9: `proof:dock-popover-opens` | **D5 PARTIALLY FALSE** — token-peak said +4.5% but the dock was visually broken (B8 composite: `transition:width` under `backdrop-filter`, B1 console bleed, easing ref-storm); D9 GENUINE | `proof:perf-frame-budget` (dock expand) |

### What H Built That I RETIRED

| Retired item | Reason | Disposition |
|---|---|---|
| `proof:demo-console-clean` | load-rest browser gate; never drove PLAY→SWITCH; B1/B2 sailed through it | **RETIRED** — absent from `package.json` |
| `proof:dock-morph-settled` | design-token-number proxy; parsed `--spring-dock` linear() stops but never measured felt interaction | **RETIRED** — absent from `package.json` |
| `proof:no-orphan-specular` | source-shape gate (`anyPointerWrite:false` grep); self-captured baseline masked the subject; could not see the visible bloom | **RETIRED** — absent from `package.json` |
| `proof:scene-icons` | source-shape `grep` for file presence; never painted a pixel; B9 ENOENT sailed through it | **RETIRED** — absent from `package.json` |
| `proof:dragscrub-single` | source-shape `grep` for single `useDragScrub` call; B6 text-selection + no-persist sailed through it | **RETIRED** — absent from `package.json` |
| `proof:specular-handoff` | vaporware IOU parked against glass-ui 3.8.0 (did not exist on npm at H-close; npm-latest was 3.7.0) | **DELETED** — absent from `package.json` + no script file |
| `proof:no-route-storm` | **NEVER AUTHORED** — cited in H's FINAL:34 + six gate docstrings as the FSM correctness gate; not in `package.json`, no script file | **PHANTOM** — I.PATH-FORWARD §2 confirmed first-hand |

### H's Gate Regime Failure — The Structural Account

H's ~98 nominal `proof:*` gates by oracle class (from I.PATH-FORWARD §2, first-hand census):

| Class | Count | Can see runtime defect? |
|---|---|---|
| SOURCE-SHAPE (grep/regex/re-derived table) | ~40 | NO — structurally blind |
| JSDOM UNIT (engine API, no layout/GPU) | ~14 | Mostly NO |
| PROXY STORE (localStorage JSON round-trip) | ~3 | NO (B2) |
| SELF-BASELINE (pixel diff vs same-build baseline, subject masked out) | 1 | NO — locks brokenness |
| LOAD-REST BROWSER (`goto` → wait → read console at rest) | ~20 | Rarely (B1) |
| WRONG-PROJECTION BROWSER (interaction but wrong DOM asserted) | ~10 | NO — subtle killer (B4) |
| GENUINELY BEHAVIORAL (drives interaction AND asserts product property) | ~0 | — |

The meta-gate `proof:chronic-closure` itself: `fs.readFileSync`'d `H/PROGRESS.md`, parsed the `## Open deferrals` markdown table, asserted each cited gate NAME resolves to a `package.json` key. Opened no browser. Proved the paperwork was tidy; certified it green while B1–B9 ran live. The deepest expression of the blindspot it was built to close.

### H Items That Were Re-Verified Under I and Found Genuinely DONE

| Item | Verification mode under I |
|---|---|
| `useSceneMachine()` FSM structural kill of D12 route storm | `proof:live-session` SWITCH battery (no route storm under actuation) |
| @mbabb popover D9 (double-wrap removed) | `proof:dock-popover-opens` interaction gate |
| φ-hero typography D7 | `proof:live-session` body-typography leg |
| `rail·stage·rail` layout | visual regression preserved in golden baseline (I.W7 updated) |
| Mobile overlay (D10 overlay model) | `proof:mobile-single-page` + `proof:drag-gesture` + `proof:perf-frame-budget` |
| Typing-dots dogfood (inv ζ) | `proof:typing-dots` interaction gate |

### H Items That Were NOT Re-Verified Under I Regime (J Verification Battery Candidates)

The following H-delivered surfaces have hygiene-tier gates (source-shape or jsdom) but no I-regime runtime actuating gate. These are not confirmed broken — they may be fine — but J should add actuating coverage or explicitly record them as hygiene-acceptable with a reason.

| Surface | H gate | Oracle class | J action candidate |
|---|---|---|---|
| `proof:easing-canvas-bounded` | CSS `clamp(160px,38cqi,280px)` assertion | Source-shape (CSS value check) | VERIFY-ONLY: paint the canvas and measure it in `proof:live-session` |
| `proof:sequence-rows-draggable` | DOM-presence of drag handles | Source-shape (DOM presence) | VERIFY-ONLY: actually drag a row in `proof:live-session` |
| `proof:motion-path-editable` | DOM-presence of editable control points | Source-shape (DOM presence) | VERIFY-ONLY: drag a control point |
| `proof:easter-egg` | DOM-presence of easter-egg triggers | Source-shape | VERIFY-ONLY or accept as hygiene (low-stakes) |
| `proof:stage-glass-card` | CSS class assertion | Source-shape | VERIFY-ONLY: screenshot the card at rest |
| `proof:scene-transition-perf` | `bench:scene-transition` (jsdom/synthetic) | Not an actuated interaction | VERIFY-ONLY: drive a scene switch under CPU throttle |
| `proof:label-subgrid` | CSS `grid` property check | Source-shape | VERIFY-ONLY: render a labeled row and measure alignment |
| `proof:bezier-grown` + `proof:bezier-no-scroll` + `proof:bezier-single-card` | CSS dimension / DOM structure | Source-shape | VERIFY-ONLY: interact with the bezier panel |

---

## User Prompts Coverage

The following recurring user prompts (from G/H audit `_SYNTHESIS-prompt-recap.md` and `a-prompt-recap.md`) and their coverage status today:

| Prompt / Request (recurring) | Tranche origin | Status |
|---|---|---|
| NO quick solutions / NO workarounds — idiomatic gestalt | A→G standing precept | **ADDRESSED** — binding precept carried into I and beyond |
| NO legacy code beside its replacement | A→G standing | **ADDRESSED** — G collapsed `dock/index.ts` barrel; H collapsed PNG icons + `.glass-card` plate; `parseLinearStops` shim still pending value.js E1 (correctly deferred) |
| Isomorphic styling unless named befitting delta | A→G standing | **ADDRESSED** — G/H named their three named deltas |
| MEASURE-FIRST for perf claims | A→G standing | **ADDRESSED** — SoA book gate still authored but MEASURE-FIRST, not shipped |
| dep RE-PIN (the G spine) — consume published siblings | G charter | **ADDRESSED** — fully landed G.W2; I re-pinned to `^0.11.2` |
| The four chronics (cartoon, φ-hero, mobile, dock) | H charter (re-opening A→G false-closes) | **ADDRESSED** — I closed all four with runtime gates |
| Gate-regime blindspot — appearance axis, interaction axis | H.W8 charter | **PARTIALLY ADDRESSED** — H built the taxonomy machinery (`proof:visual-lock`, `proof:manifest-sourced`, `proof:chronic-closure`) but with proxy oracles; I completed the regime with `proof:live-session` + `proof:gate-is-runtime` |
| Scene+playback state machine (D12 route storm) | H.W1 | **ADDRESSED** — FSM landed; `proof:no-route-storm` phantom KILLED; `proof:live-session` SWITCH battery is the real verification |
| inv ζ — chrome dogfoods the engine | H.W6/W7 | **ADDRESSED** — typing-dots + mobile drawer |
| `proof:chronic-closure` policing the PRODUCT, not the column | H.W8 | **ADDRESSED** — I rewired it to require a RUNTIME gate witnessed born-RED |
| value.js next-slice (E1/E2, F1, F2, MCI-5, F4, F6) | G.WV → H.WV | **PARTIAL** — all correctly deferred as CHRONIC-by-design; shim `parseLinearStops` still live; MCI-5 `it.fails` witness still in tree |
| `{types}` directional VT helper | G.WV → H GH-4 | **DEFERRED** — correctly paired with born-RED kf gate in demo-smoke; awaits glass-ui AX |
| `LabeledField orientation` | H glass-ui-AX-handoff G-3 | **DEFERRED** — HIGH priority; glass-ui AX-owned; paired born-RED gate `proof:single-column-pack` |
| Deploy P0 CNAME drift `dns-cf-sync.sh` | G.WV → H DEP-1 | **OPEN P0** — deploy-owned; I confirmed still open |
| glass-ui Card specular wire-or-omit + calmer default | H GH-2 → I.W6 | **ADDRESSED** — I.W6 consumed `~3.9.0` (`specular="off"` default); I.FINAL records 3.8.0 ask as cosmetic W34 |
| kf `parse-that` direct import realm convergence | G.W2 → H VJ-9 | **DEFERRED** — non-gating per `proof:deps-current`; value.js must re-pin its own parse-that first |

---

## Key Findings for J

### P0 / P1 Defects to Carry Forward

1. **`parseLinearStops` shim at `src/animation/utils.ts:106-130`** — correctly deferred pending value.js E1/E2; NOT a defect but a pending no-legacy collapse. J must verify value.js E1/E2 publish status and fold if landed.

2. **deploy P0 CNAME drift (`dns-cf-sync.sh`)** — G-HANDOFF-3, carried into H DEP-1, I.FINAL §6 records still open. P0 live-correctness fix. NOT kf-owned but J should confirm deploy has it.

3. **`proof:no-route-storm` was a phantom gate** — cited in H.FINAL:34 + six gate docstrings as the FSM correctness gate; I replaced it with `proof:live-session`'s SWITCH battery. Verify no documentation still relies on it.

4. **H's gate-regime: `proof:scene-machine-irrefragable` is in the hygiene tier** (source-shape + jsdom) — it tests the pure reducer via synthetic state transitions, NOT a driven interaction. This is CORRECT per I's taxonomy (hygiene corroborates, correctness actuates). J must not mistake this for the FSM runtime gate — that is `proof:live-session`'s SWITCH leg.

5. **`proof:scene-control-dfa`** — the H.W11 control-surface DFA gate. Verify it is in the hygiene tier (source-shape), that `proof:live-session` covers the interaction path.

6. **value.js E1/E2 shim `parseLinearStops`** — if value.js has published its `linear()`/`steps()` parser since `0.11.2`, the shim at `src/animation/utils.ts:106-130` must retire in the SAME motion. J should check `npm view @mkbabb/value.js` on open.

### Residual Open HAND-OFFs (correctly carried — not defects)

Each of these has a paired born-RED kf gate per H's chronic-closure discipline:

| HANDOFF | Paired kf gate | Status |
|---|---|---|
| glass-ui `LabeledField orientation` (G-3 HIGH) | amended `proof:single-column-pack` label-left clause | GREEN via demo-side wrapper (path B); durably on glass-ui |
| glass-ui `{types}` VT helper (G-4 MED) | demo-smoke VT-types assertion born-RED | **BORN-RED** — awaits glass-ui AX |
| glass-ui Card specular cosmetic W34 (3.8.0 `specular="off"` full tidy) | `proof:specular-absent-at-rest` (already GREEN on `~3.9.0`) | GREEN — cosmetic only |
| value.js E1/E2 `linear()`/`steps()` | `grep parseLinearStops src/ = 0` | shim still present; gate not yet biting |
| value.js VJ-F1 path sampler | `proof:morphsvg` (BOOK gate, not yet authored) | BOOK — value.js OPEN |
| value.js VJ-F2 diagnostics + furthest | `fromString` malformed test | BOOK — value.js OPEN |
| value.js MCI-5 arity-pad | `it.fails` witness `test/interpolate-anything.test.ts:256-262` | `it.fails` GREEN = expected-fail (correct posture) |
| parse-that PT-2 packrat re-key | `proof:packrat-position` (not authored; internal) | parse-that internal; zero production consumers |
| deploy DEP-1 CNAME P0 | post-deploy live-CNAME assertion (deploy-owned) | **P0 OPEN** |

---

## Structured Findings Summary

### G-1 (BOOK): G's `parseLinearStops` shim is still live — check value.js E1/E2 at J-open
`src/animation/utils.ts:106-130` — the shim that retires when value.js ships E1/E2. Not a regression; correctly deferred. J must check `npm view @mkbabb/value.js` at open to see if E1/E2 landed in `^0.11.2+`.

### G-2 (P1): MCI-5 `it.fails` witness is a born-RED consume signal — check on J-open
`test/interpolate-anything.test.ts:256-262` — if value.js `0.11.3+` ships the identity-aware pad, this `it.fails` flips RED (and the wrapper must be deleted). J must verify.

### H-1 (P0): `proof:no-route-storm` was PHANTOM — cited six places in docstrings
H.FINAL:34 + six gate docstrings cite `proof:no-route-storm` as the FSM correctness gate. It was never authored. I replaced it with `proof:live-session`. J should audit docstrings for residual stale references to this ghost gate and kill them (hygiene + no-legacy).

### H-2 (P1): H's `proof:chronic-closure` REWIRED by I — verify it still parses correct substrate
I.W7 rewired `proof:chronic-closure` so it requires each cited gate to be a runtime gate witnessed born-RED. The substrate it parses is `PROGRESS.md §4`. J must confirm this passes on the current tree (run `npm run proof:chronic-closure`).

### H-3 (BOOK): Several H hygiene gates guard surfaces without actuating coverage — J verification battery candidates
Eight surfaces listed in the table above (easing canvas, sequence drag, motion-path drag, easter eggs, etc.) have source-shape/DOM-presence hygiene gates but no I-regime runtime actuating coverage. J can either fold these into `proof:live-session` or explicitly accept them as hygiene (both are valid per I's taxonomy). Doing neither leaves them in the same class of gap H exhibited — hygiene gates counting as correctness.

### H-4 (VERIFY-ONLY): deploy DEP-1 P0 CNAME (`dns-cf-sync.sh`) still OPEN
G-HANDOFF-3 → H DEP-1 → I.FINAL §6. The `dns-cf-sync.sh` CNAME drift is a P0 live-correctness fix owned by deploy (fourier). J should verify whether it has been applied since I-close.

### H-5 (RECORD): H's glass-ui version pinning history — tilde semantics matter
G pinned `^3.3.0`. H bumped to `~3.5.1`. I.W6 bumped to `~3.9.0` (tilde to skip 3.6/3.7 which WORSEN the bloom). Current pin is `~3.9.0`. J should confirm `~` is intentional and documented — a naive `^3.9.0` bump could pull 3.10+ which may re-regress specular.

### H-6 (RECORD): H's `proof:visual-lock` golden baseline was updated by I
I.W7 recaptured the golden baseline reflecting the I-wave appearance. Any J appearance change that is intentional must recapture it. The baseline was BORN against the broken H state (I.PATH-FORWARD: "subject masked out = locks brokenness"). I.W7 fixed this by updating the golden state after all waves landed.
