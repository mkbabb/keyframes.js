# hd-precepts — DEEP adversarial precept sweep across H.W0..H.W8

**Lane:** `hd-precepts` (the DEEPER second-pass precept attack). **Branch:** `tranche-h-dev`.
**Method:** read all 9 waves + the AUTHORITATIVE `_SYNTHESIS-gap-scorecard.md` (§6 spine) +
`a-precept-sweep`; cross-checked every load-bearing API/feasibility claim against the
INSTALLED packages (`node_modules/@mkbabb/glass-ui@3.4.0`, `value.js@0.11.1`,
`parse-that@0.9.0`, `@vueuse/core@14.3.0`, `vue@3.5.35`) and the LIVE demo
(http://localhost:5173). Each precept — no-workaround · no-legacy-beside-replacement ·
KISS · DRY · measure-first · fail-explicit · no-god-module — applied as an adversary who
wants H to FAIL at implementation time. I did NOT re-litigate the first harden's
consistency fixes; this is the substantive *is-each-fix-correct-feasible-and-complete*
attack.

**Verdict in one breath:** the spine is SOUND and the headline fixes are FEASIBLE — every
load-bearing API the waves assume EXISTS (verified below), the two live crashes reproduce
exactly as anchored, the cartoon swap / FSM facility / engine-HANDOFF are all real. But the
precept sweep surfaces **two genuine defects where the wave authoring drifts from the
spine** — a SHIP-dispositioned defect (D9) that NO wave actually ships (a dropped lane),
and a circular grep↔SHIP punt (`TimingFunctionPanel.vue:78`) that reds a gate with no
owner — plus several MED/LOW precision and completeness gaps. The empty-findings honesty
bar is NOT met (there are real defects), but neither is the manufacture-findings trap: the
architecture itself does not over-reach.

---

## §A. THE FEASIBILITY VERIFICATION (the load-bearing API/claim checks — all PASS)

Before the findings, the adversarial feasibility checks the precept attack must clear. A
wave assuming a non-existent API is a BLOCKER; NONE failed:

| Claim (wave) | Verified against | Result |
|---|---|---|
| `<Card surface="cartoon">` drops specular + applies `.cartoon-surface` (W2 §2.2 BINDING) | `glass-ui/dist/CardFooter-C390imy7.js:37` | **CONFIRMED** — `t.surface==="cartoon" && "cartoon-surface"` AND `t.surface==="glass" && "glass-specular-track"` are the literal map; the radial dies at source as claimed |
| `--shadow-cartoon-md/-lg`, `--lift-sm`, `--spring-bouncy`, `--ease-apple` exist (W2) | `glass-ui/dist/styles/cards.css`, `theme.css` | **CONFIRMED** — all present; `@utility cartoon-surface` at `cards.css:33` |
| glass-ui ships `scale-on-hover` `@utility` (W2 S4 dup claim) | `glass-ui/dist/styles/utilities.css` | **CONFIRMED**; LIVE demo shows `scaleOnHoverRules: 2` (demo dup IS present) |
| `--spring-dock` is the bouncy pre-AW.W2 register (W5/W8 dock-HANDOFF) | `glass-ui/dist/styles/tokens.css` | **CONFIRMED** — peaks at **1.16292** (16.3% overshoot @14.286%), first stop `0.10932`; the W8 dock-lag HANDOFF is grounded |
| dock exposes `keepOpen` + `data-glass-dock-portal` (D9 coupling) | `glass-ui/dist/dock.js` | **CONFIRMED** — both strings present |
| `dock-icon-button glass-specular-track` hard-coded (W2 S5) | `glass-ui/dist/dock.js:568` | **CONFIRMED** |
| `createGlobalState` + `useStorage` exported; `useStateMachine` NOT (W1 §2.1, design-decision) | `@vueuse/core@14.3.0/dist/index.js` | **CONFIRMED** — both export, `useStateMachine` absent; the demo ALREADY uses `createGlobalState`+`useStorage` in 4+ stores (`controlOptionsStore.ts:35` etc.) — the no-parallel-system spine holds |
| `AnimationGroup.serialize()/hydrate()` do NOT exist (W1 S6 born-RED HANDOFF) | `src/animation/engine.ts` (grep) | **CONFIRMED** — neither method exists; the born-RED `proof:group-snapshot-identity` is correctly unimplementable-today |
| public `SpringProgress`/`NumericAnimation`/`stagger`/`decay`/`ManualTimeline`/`fromMotionPath` exist (W5/W6/W7) | `src/animation/{spring,numeric,stagger,decay,timeline,motion-path}.ts` | **CONFIRMED** — all exported |
| the two live crashes reproduce as anchored (W0) | LIVE `#/cube` console | **CONFIRMED** — `serializeEasing` throw at `format.ts:24` + `"......"` parse error at `engine.ts:576←:516`, exactly the cited stack |

The one assumed-but-uninstalled dep is **not a blocker** but **is unstated** (Finding
P-04): `vite-svg-loader` (W5 S1) and `pixelmatch` (W8 S2) are NOT in `node_modules` —
both are NEW devDeps the waves name but do not flag as an `npm i -D` step.

---

## §B. THE FINDINGS

### P-01 · BLOCKER — D9 (mbabb-popover) is dispositioned **SHIP-in-H** but NO wave ships it (a DROPPED LANE)

**Precept breached:** no-workaround / fail-explicit / completeness (a SHIP that lands
nowhere). **Doc location:** `_SYNTHESIS-gap-scorecard.md §1.1` (the mbabb-popover row,
`:67`) vs `H.W2.md §Folds:61`, `H.W8.md S3`.

**Defect with evidence.** The AUTHORITATIVE gap-scorecard §1.1 dispositions D9 as
**SHIP-in-H** with a *kf-owned* root cause and a concrete fix:

> primary root = **double-wrapped trigger** (`App.vue:18-21` `<DropdownMenuTrigger as-child>`
> over `<DockDropdownTrigger>` which IS itself a reka trigger → 2 toggles cancel) …
> **SHIP-in-H** — drop the outer wrapper (use `DockDropdownTrigger` directly, mirror
> `DockSelectTrigger`) + bind `v-model:open` → dock `keepOpen`/`release`

This is a demo-side (`App.vue`) edit, NOT a glass-ui internal — and `keepOpen` +
`data-glass-dock-portal` are CONFIRMED present in `dock.js`, so the fix is feasible. But
grepping all 9 waves: the only mentions are `H.W2.md:61` ("D9 … are sibling-wave charges
(the popover/dock/mobile waves)") — a PUNT — and `H.W8.md S3` which authors only the
born-RED `proof:dock-live` HANDOFF *watch* for the D5 *lag* (a glass-ui-owned item), NOT
the kf-owned `App.vue:18-21` wrapper drop. No wave's §Scope names `App.vue` lines 18-21,
the `DropdownMenuTrigger` wrapper, or the popover. W1 rewrites App.vue's *scene/playback*
composables but explicitly preserves the trigger markup and never touches the dropdown
wrapper. The result: a **SHIP-dispositioned, root-caused, feasible, user-visible defect
(the @mbabb logo popover "no longer opens") that falls through every wave** — the exact
"dropped lane" failure mode the first harden caught for a scene, recurring here for D9.
This is worse than a HANDOFF-without-gate: it is a SHIP-without-wave.

**Concrete doc edit.** Add an explicit S-clause to **H.W1** (it already owns the App.vue
transposition and the dock Select model demotion — the popover trigger is adjacent): a new
`S8 — drop the D9 double-wrapped @mbabb trigger`: replace `App.vue:18-21`'s
`<DropdownMenuTrigger as-child><DockDropdownTrigger>` with a single `DockDropdownTrigger`
(mirroring `DockSelectTrigger`), bind `v-model:open` to the dock's `keepOpen`/`release`,
add a born-GREEN-on-fix `proof:mbabb-popover-opens` clause (`handlerCount===1`,
`finalOpen===true` after a click). ALTERNATIVELY home it in H.W2 (which already touches the
dock-icon specular S5) — but it MUST get a named §Scope owner + a biting gate, not a
"sibling-wave charge" punt. Update `H.W2.md:61` to cite the owning wave by name.

---

### P-02 · HIGH — `TimingFunctionPanel.vue:78` is a CIRCULAR grep↔SHIP punt (a gate reds with no owner)

**Precept breached:** fail-explicit / no-workaround (a gate that bites a surface no wave
edits). **Doc location:** `H.W3.md §Hard-gate:41` (`proof:demo-shell-grid`) vs `H.W4.md
S2:32`.

**Defect with evidence.** `proof:demo-shell-grid` (W3) is a grep gate asserting **ZERO**
`grid-cols-[auto_1fr]` "over the controls tree." VERIFIED LIVE:
`TimingFunctionPanel.vue:78` carries `grid grid-cols-[auto_1fr]` (the cubic-bézier detail
panel) and the file IS under
`demo/@/components/custom/animation-controls/controls/` — i.e. inside the controls tree the
grep scans. So the gate WILL red on `:78`. But the SHIP ownership is circular:
- **W4 S2** explicitly says: "`TimingFunctionPanel.vue:78` has its OWN `grid-cols-[auto_1fr]`
  … folded into the H.W3 single-column treatment via the `proof:demo-shell-grid` grep
  clause; **this wave only sizes/headers the panel**" — i.e. W4 disclaims the `:78` edit and
  points at W3.
- **W3 §Scope** (`H.W3.md:3`) never names `TimingFunctionPanel.vue` (0 occurrences in the
  whole wave); its S1/S2 edit only `AnimationControlsControls.vue` + `LayerConfigPanel.vue`.
  W3 owns the GREP but not the FILE.

Each wave points at the other; neither has `TimingFunctionPanel.vue:78` in its edit list.
At impl time the grep gate reds and there is no clause telling the implementer which wave
collapses that grid. This is a fail-explicit breach: a gate that cannot be satisfied by any
authored S-clause.

**Concrete doc edit.** Add `TimingFunctionPanel.vue` to **H.W3 §Scope** and an explicit
clause in W3 S2 (or a new S-clause): "collapse `TimingFunctionPanel.vue:78`'s
`grid-cols-[auto_1fr]` cubic-bézier detail grid to the single-column field flow (the same
S1 treatment), so `proof:demo-shell-grid` resolves." Then W4 S2's cross-ref is honest (it
points at a clause that exists). Alternatively, scope the W3 grep to EXCLUDE the bezier
detail panel and give W4 an explicit SHIP clause for `:78` — but the cleaner gestalt is W3
owns it (it owns the grep + the single-column idiom).

---

### P-03 · MED — W6 `proof:dogfood-hero` accepts a value.js import as a "kf engine symbol" (inv-ζ is under-specified)

**Precept breached:** inv-ζ (the chrome must dogfood **the engine**), precision. **Doc
location:** `H.W6.md §Hard-gate:43` (`proof:dogfood-hero`).

**Defect with evidence.** `proof:dogfood-hero` asserts the dots substrate imports a kf
engine symbol and lists the accepted grep set: `from "@src"` / `CSSKeyframesAnimation` /
`steppedEase` / `NumericAnimation`. But `steppedEase` is **NOT a kf engine symbol** — it is
exported by **value.js** (`@mkbabb/value.js/dist/easing.d.ts:56`; kf only re-imports it at
`animations.ts:1` `import { steppedEase } from "@mkbabb/value.js"`). A `TypingDots.vue`
that does `import { steppedEase } from "@mkbabb/value.js"` would PASS the gate while
dogfooding value.js's easing math, NOT the kf animation engine — exactly the inv-ζ
distinction the wave's own §Goal draws ("the demo … MUST NOT hand-author the one animation
named after the library's domain"). The dogfood that proves "this is what keyframes.js
does" is `NumericAnimation`/`CSSKeyframesAnimation`/`stagger` (kf-owned in
`src/animation/`), not the bare easing function.

**Concrete doc edit.** In `proof:dogfood-hero`, REMOVE `steppedEase` from the
accepted-symbol set (or require it be paired WITH a kf engine class), and tighten the grep
to a kf engine symbol: `CSSKeyframesAnimation` | `NumericAnimation` | `stagger` |
`SpringProgress` imported from `@src/animation` (not `@mkbabb/value.js`). The dots may still
USE `steppedEase` as the timing function, but the dogfood SUBSTRATE must be the engine.

---

### P-04 · MED — two NEW devDeps (W5 `vite-svg-loader`, W8 `pixelmatch`) are assumed but never declared as install steps

**Precept breached:** measure-first / fail-explicit (an unstated dependency is a silent
impl blocker), KISS-honesty. **Doc location:** `H.W5.md S1:32`, `H.W8.md S2:31`.

**Defect with evidence.** Neither dep is installed (`node_modules/vite-svg-loader` and
`node_modules/pixelmatch` both ABSENT). W5 S1 says "wire the inline-SVG reference seam
(`vite-svg-loader` `?component` query … one devDep)" — it names the devDep in prose but
the §Scope edit list (`vite.config.ts`) does not enumerate the `package.json`/`npm i -D`
step, and there is no gate that the dep resolves. W8 S2 says "diff via `pixelmatch`"
similarly. For a tranche whose spine is "MEASURE-FIRST … no quick solutions," an unstated
runtime dependency that the gate harness imports is a feasibility gap: `proof:visual-lock`
literally cannot run until `pixelmatch` is installed, and `proof:scene-icons`' theming
clause depends on the `?component` seam compiling. (Neither is a BLOCKER — both deps exist
on npm and are idiomatic — but the omission is a precept-honesty drift.)

**Concrete doc edit.** Add to each wave's §Scope the explicit `package.json` devDep
addition (`vite-svg-loader` for W5, `pixelmatch` + `pngjs` for W8) and a one-line preflight
clause that the dep resolves (mirror how W1 names `@vueuse/core` as in-tree). Optionally a
`proof:dep-present` shape so a missing dep reds loud, not at import-time.

---

### P-05 · MED — W0's "4× per Cube load" count drifts from the live 2× (a measure-first precision drift)

**Precept breached:** measure-first / inv-ε (cite the EXACT count). **Doc location:**
`H.W0.md §Goal/§Hard-gate:47` ("exactly **4** `AnimationOptionError` throws on every Cube
load").

**Defect with evidence.** LIVE `#/cube` console (this session) shows **2**
`AnimationOptionError` (serializeEasing) throws + 1 `"......"` parse error = 3 total
errors, NOT the "exactly 4" the wave repeats from `a-engine-regressions.md:33-45`. The
`proof:demo-console-clean (a)` gate asserts "zero" (correct, count-agnostic on the green
side), so the BITE is safe — but the RED-side claim "exactly 4" is a specific falsifiable
number the gate text leans on ("reds TODAY — exactly **4** … throws"). A reviewer running
the gate today sees 2, not 4, and the "exactly 4" anchor looks wrong. (The throw is
load-order/preset-count dependent — likely 2 visible per fresh load, 4 across the editor's
re-render cycles.)

**Concrete doc edit.** Soften the count to the verified-live figure: "≥2
`AnimationOptionError` throws per fresh Cube load (4 across the readout re-render cycle per
`a-engine-regressions`)" — or change the gate-text to "≥1" since the green side is the only
load-bearing assertion (zero). Keep the gate as zero-console-error (correct); just don't
pin a stale exact count the live tree contradicts.

---

### P-06 · LOW — W2/W3 panel-Card and specular COUNTS drift scene-to-scene (the gates hard-code counts that vary)

**Precept breached:** measure-first / inv-ε (a count asserted as fixed that is
scene-dependent). **Doc location:** `H.W2.md §Hard-gate:49` ("≥4 panel Cards"),
`a-cartoon-shadow` 13-track live anchor.

**Defect with evidence.** LIVE `#/cube`: `glassCardElems: 3` (W2 lists 4 sites:
`AnimationControlsControls`, `RibbonBar`, `KeyframesEditor`, `KeyframeTimeline` — the
keyframes-editor Card is not mounted on the cube default view, so only 3 plates render);
`specularTrackCount: 5` (W2/`a-cartoon-shadow` anchor 13 on the *easing* scene); and
`anyPointerWrite: true` on cube (the audit measured `false` on easing — cube has the
pointer-wired dock present). The `proof:cartoon-is-panel-depth` "≥4 panel Cards" gate is
WORDED as `≥4` (good — a floor, not an exact count), so it survives the scene variance, but
the wave's "the 4 panel Cards" prose and the `proof:no-orphan-specular` "13 live tracks"
RED-anchor are scene-specific and will mislead an implementer who measures on cube.

**Concrete doc edit.** Annotate the counts with the scene they were measured on ("13 tracks
on `#/easing`; 5 on `#/cube` — scene-dependent") and confirm the `≥4` floor is reachable on
the scene the gate runs (the gate should pin its measurement scene, e.g. open the controls
pane on `#/easing` where all 4 panels mount). LOW because the gates use floors not exact
counts, so the bite is intact.

---

### P-07 · LOW — W5 S6 is a measure-first/scene-quality BAND folded into a SHIP wave (god-wave watch, not a breach)

**Precept watched:** no-god-module (a wave doing too many orthogonal things) / KISS. **Doc
location:** `H.W5.md` (the whole wave).

**Observation, not yet a defect.** W5 carries: icon family (S1/S2) + pertinence merge (S3)
+ per-mode interactivity (S4) + **the amiga/cube scene-perf band (S6: tessellate bug + dpr
cap + sphere-drive-or-KILL + `contain:paint` + `content-visibility`)** + square KILL (S5).
S6 is a re-homed "dropped band" (the gap-scorecard §1.1 itself notes it was "absent from
this map's first draft"). It is genuinely orthogonal to the icon/pertinence theme — a
WebGL tessellation bug + dpr cap + glassmorphism-perf are a different competence than
"icon-the-survivors." This is not a no-god-module *breach* (the wave is a DOC, not a 500L
module, and the items are cohesively "the demo modes finished"), but it is the wave most at
risk of an unfocused impl session, and S6's MEASURE-FIRST perf items (A2/G1/G5) share a
wave with hard SHIPs (S1 icons) — a reviewer could green the icons and leave the perf
"measured later." The numbering is also non-contiguous (S1-S4, then **S6**, then **S5** — S5
appears AFTER S6 in the doc), a copy-edit artifact that reads as a dropped S5.

**Concrete doc edit.** (a) Fix the S-clause ordering (S5 square-KILL is printed after S6 —
renumber so the reading order is S1..S6 monotonic, or explicitly note "S5 follows S6
because the survivor verdict gates S6's amiga icon"). (b) Consider splitting S6 (the
amiga/glassmorphism-perf band) into its own short wave OR explicitly tagging it "this wave's
SHIP floor is S1-S5; S6's MEASURE-FIRST items may land in a follow-on session but the A3
tessellate bug is a hard SHIP" — so the perf band is not silently deferrable under the icon
wave's green.

---

### P-08 · NIT — the demo port is cited inconsistently (`:5174` in synthesis/several waves, live on `:5173`)

**Precept:** inv-ε (cite accurately). **Doc location:** `_SYNTHESIS-gap-scorecard.md:4`
(`:5174`), multiple wave live-anchors (`:5174`), vs LIVE `:5173`.

The synthesis header and several wave anchors say the demo is at `:5174`; it is live at
`:5173` this session. Vite picks the next free port, so this is environmental, not a
content defect — but the Playwright gate harnesses (`serveDist`/`browser_navigate`) hard-code
a port and the docs should cite the canonical one (or `serveDist`'s assigned port).
**Edit:** normalize to `:5173` or state "the dev server port is assigned by Vite; gates use
`serveDist`'s reported port."

---

## §C. THE PRECEPT SCOREBOARD (per-precept verdict across all 9 waves)

| Precept | Verdict | Anchor / note |
|---|---|---|
| **no-workaround** | **DRIFTED (2)** | P-01 (D9 SHIP lands nowhere — a punt), P-02 (`:78` circular punt). The FSM (W1), cartoon swap (W2), grid collapse (W3) are all genuine seam-fixes, not symptom patches — the headline no-workaround moves are SOUND. |
| **no-legacy-beside-replacement** | **HONORED** | Verified the replacements DELETE in one motion: `.glass-card` plate dies WITH `surface="cartoon"` (W2 S1, API-confirmed); `isStableFire` + `scenePlayback.ts` Map die WITH the FSM (W1 S1/S4/S7); the PNGs die WITH the SVG family (W5 S2); `dotFade`+collision die WITH `TypingDots` (W6 S2); the mobile stack branch DELETED not patched (W7 S1). No "compat alias kept beside" in any wave. |
| **KISS** | **HONORED (1 watch)** | FSM is a ~40-line pure reducer (not XState — `useStateMachine` confirmed absent, so the hand-roll is justified); one `--rail-width` token not a `<TimelineWidthProvider>` (W3); container-query clamp not a magic-px (W4). Watch: W5's breadth (P-07). |
| **DRY** | **HONORED** | `springLinearStops` triple-surface → one composable (W5 S3); `useSpecularPointer` one composable (W2 S3); the icon descriptor single-sources identity (W5 S1); `useSheetSpring` mirrors `useSceneSwap` (W7 S2). |
| **measure-first** | **DRIFTED (3, all MED/LOW)** | P-04 (unstated devDeps), P-05 (stale "4×" count), P-06 (scene-dependent counts). The genuine perf claims ARE gated (dpr cap behind `proof:amiga-pixel-cap`, blur win behind dpr=2 baseline, viewBox recompute behind `proof:bezier-drag-frame-budget`, drawer settle behind `proof:drawer-spring` runtime probe) — the MEASURE-FIRST discipline on the perf *wins* is exemplary; the drift is in dependency/count precision, not in claiming an unmeasured win. |
| **fail-explicit** | **DRIFTED (2)** | P-01 + P-02 (a SHIP/gate with no owning clause is the inverse of fail-explicit). The engine half is HONORED — the FSM replaces the silent `isStableFire` coincidence with an explicit `SCENE_READY` event + reducer invariants (W1 S4), and the W0 discrete-leaf classification is a spec-faithful explicit branch, not a swallow. |
| **no-god-module** | **HONORED (1 watch)** | `engine.ts` correctly fenced as ALREADY-SOTA, not split (the boundary rationale is BOOKed); no wave grows a module past a measured cohesion. Watch: W5 breadth (P-07) is a god-WAVE risk, not a god-module. |
| **inv-ζ (chrome dogfoods the engine)** | **DRIFTED (1)** | P-03 (the dogfood gate accepts a value.js symbol). The intent is right (W6 dogfoods `NumericAnimation`/`CSSKeyframesAnimation`); the gate text is just too permissive. |
| **inv-16 (consume glass-ui; HANDOFF, never kf-author)** | **HONORED** | The dock lag, Card specular seam, calmer-default, `--spring-snappy` member are all TAGGED glass-ui-HANDOFF and PAIRED with born-RED gates (`proof:dock-live`, `proof:specular-handoff`); NO wave patches glass-ui in kf. The D9 *coupling* half (keepOpen/portal) is consume-side (verified present), the *root* is kf-owned App.vue markup — correctly a SHIP, which is exactly why P-01 (it not being shipped) is the breach. |
| **chronic-closure discipline** | **HONORED** | Each of the 4 chronics exits via a SYSTEM-property gate (`proof:cartoon-is-panel-depth` W2, `proof:phi-leaf-zero` W4, `proof:mobile-single-page` W7) OR a HANDOFF paired with a born-RED gate (`proof:dock-live` W8); the W8 meta-gate parses the committed chronic→gate table and reds a bare tag. The discipline is woven correctly. |

---

## §D. ARCHITECTURE SOUNDNESS (the adversarial "does the design hold" call)

- **The FSM (W1):** SOUND + FEASIBLE. `createGlobalState`+`useStorage` are in-tree and
  already the demo standard; `useStateMachine` is correctly absent so the hand-rolled
  reducer is the KISS choice, not a workaround. The `serialize()/hydrate()` engine seam is
  correctly a born-RED HANDOFF (the methods genuinely do not exist) with the store landing
  first against the imperative restore — a defensible sequencing, not a blocked dependency.
  The five-authority → one-way-projection collapse attacks the real no-fixed-point seam.
- **The cartoon swap (W2):** SOUND + FEASIBLE — the `surface="cartoon"` map is verified
  literal; the radial dies at source (not via `!important`), the net-deletion is real.
- **The rail·stage·rail grid (W3):** SOUND — one named grid + one token is the genuine DRY
  core; the MEASURE-FIRST gating of S4 behind `proof:stage-not-clipped` is correct. (P-02
  is a scope-completeness gap, not an architecture flaw.)
- **The mobile overlay (W7):** SOUND — desktop already proves the overlay model in the same
  component, so mobile-does-what-desktop-does is a divergent-path DELETION, the spine's
  one-motion replace; the `SpringProgress` drawer dogfood is feasible (`useSceneSwap`
  precedent in-tree).
- **The gate regime (W8):** SOUND — re-sourcing the manifest, the visual-lock peer of
  `capture.mjs`, and the chronic meta-gate as a static parse of a committed table are all
  extensions of proven gate shapes, not new god-scripts. (P-04 pixelmatch dep is the only
  gap.)

No wave OVER-REACHES into ALREADY-SOTA: the engine kernel, φ-ladder mechanism, Capsize
fallback, design-idiom consolidations, specular `::before` build, and rAF orchestration are
all correctly fenced "do NOT touch."

---

## §E. DISPOSITIONS ROLL-UP

- **BLOCKER:** P-01 (D9 SHIP lands in no wave — give H.W1 or H.W2 a named S-clause + gate).
- **HIGH:** P-02 (`TimingFunctionPanel.vue:78` circular grep↔SHIP punt — add the file to W3 §Scope).
- **MED:** P-03 (dogfood gate accepts value.js `steppedEase` — tighten to a kf engine symbol);
  P-04 (declare `vite-svg-loader`/`pixelmatch` devDeps + a preflight); P-05 (stale "4×"
  console-count — soften to the live ≥2).
- **LOW:** P-06 (scene-dependent counts — annotate the measurement scene); P-07 (W5 S-clause
  ordering + the S6 perf-band defer-risk).
- **NIT:** P-08 (port `:5174`↔`:5173`).

**The honest bar:** the spine, the facility choices, and every load-bearing API are
VERIFIED feasible and the architecture is sound — H is implementable as designed. The two
real defects (P-01, P-02) are completeness/ownership gaps where a SHIP-dispositioned fix or
a biting gate has no owning clause; both are one-line doc edits that close a lane that would
otherwise silently fall through at impl time.
