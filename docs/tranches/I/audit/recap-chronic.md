# Tranche I — RECAP-CHRONIC · the honest A→H chronically-deferred ledger

**Agent:** `recap-chronic`. **Branch:** `tranche-i-dev` (forked off the broken master
`b934a08`). **Type:** TRANCHE DEVELOPMENT — DOCS ONLY. This file is authored from the
actual A→H tranche docs (`docs/tranches/{A..H}/**`) cross-checked against the **live
investigation evidence** the sibling I probes captured this pass
(`docs/tranches/I/audit/investigate/**`, Playwright over the BUILT `dist/gh-pages/` + the
`:5174` dev server). Every row cites a prior ledger `file:line` for the *history* and a
live probe/shot for the *current TRUE state*. Nothing is invented; where a prior FINAL
claimed CLOSED and the running demo contradicts it, both are recorded side-by-side.

**Charge.** Delineate EVERY chronically-deferred item across A→H — the φ-ladder, the
dock-lag, the specular, the cartoon-shadow, mobile, the glass-ui handoffs, the
value.js/parse-that slices, the engine BOOKs, the dead-CSS punts — with its full history
and its current TRUE state (closed-for-real vs papered vs still-broken). **The H
chronic-closure meta-gate claimed 4 chronics CLOSED with all 97 `proof:*` gates GREEN —
RE-EXAMINE each against the live demo.** Fold the genuinely-open ones into Tranche I.

---

## §0 · THE HEADLINE — H's "4 closed chronics" re-examined against the running demo

H FINAL declares (`H/FINAL.md:7-11,49-72,180`): *"every chronic CLOSED via a
SYSTEM-property gate … This is the LAST tranche these four chronics can be re-papered"* —
with `proof:chronic-closure` (the meta-gate) GREEN, `proof:browser` 35/35,
`tsc` 0, `proof:all` green. The four chronics: **D2/D14 cartoon-shadow/specular**,
**D7 φ-hero typography**, **D10 mobile**, **D5/D9 dock**.

**The I live audit verdict: 2 of the 4 are papered-or-regressed; 1 is partially real but
its sibling-defect is wide open; 1 is genuinely closed at the asserted scope but the
user's lived experience of it remains broken via an adjacent un-gated path.** The
gate-blindspot the user has warned about repeatedly
(`MEMORY.md` "Gate blind-spots") struck *exactly* as predicted: H's gates certified
SOURCE-SHAPE + LOAD-TIME truths that are real, while the RUNTIME / INTERACTION / APPEARANCE
the user actually sees stayed broken. The catastrophe is not that H lied — H's gates are
honestly green — it is that **a green source-shape gate certified a broken product**, the
third time (`A→B→C` named it, `H` claimed to fix the *regime*, and the regime still missed
it).

| H chronic | H claimed | I live TRUE state | Verdict |
|---|---|---|---|
| **CH-1 cartoon-shadow / specular (D2/D14)** | CLOSED via `proof:no-orphan-specular` (inverted to exception=∅ on panels) + `proof:cartoon-is-panel-depth`; the stage-glass sheen a born-RED HANDOFF "resolves at glass-ui 3.8.0 `specular='off'`" (`H/FINAL.md:69,93`) | **PAPERED + the HANDOFF TARGET IS VAPORWARE.** The specular reproduces live on EVERY glass surface — stage cards AND the 9–11 dock glass `<Button>` tracks per scene — as a static dead-centred warm-white bloom (rest 0.35 → hover 0.6, `--mouse-x` NEVER written). `specular="off"` exists in NO published glass-ui (3.5.1…3.7.0); 3.7.0 makes it MORE pervasive via `.glass-material`. `proof:no-orphan-specular` went green by *recording the bloom as accepted residue* (`b7-specular-glassui.md`, `b15-glassui-cards-surfaces.md §B7`). | **STILL-BROKEN → FOLD into I** |
| **CH-2 φ-hero typography (D7)** | CLOSED via `proof:phi-leaf-zero` (hero on `text-display-mega`, ≥140px floor, 0 raw rungs ex-`ui/`) + `proof:hero-rung` (`H/FINAL.md:70`) | **GENUINELY CLOSED at the asserted scope** — this is the one chronic the SYSTEM gate actually discharged (the hero IS re-rung; the leaf-tail IS swept ex-vendored). The user's B-report does NOT re-flag the hero size. *But the easing-EDITOR loss (B4) is a different D-defect that ate the curve component the user now wants back* — adjacent, not this chronic. | **CLOSED-for-real (re-affirm); B4 is a separate I item** |
| **CH-3 mobile (D10)** | CLOSED via `proof:mobile-single-page` (scene host ≈ viewport, controls overlay) + `proof:drawer-spring` (`H/FINAL.md:71`) | **HALF-REAL.** The bones are genuine: full-bleed `position:fixed` stage, affixed docks, a real underdamped `SpringProgress` drawer (settle 169–175ms, overshoot 0.015) — `proof:drawer-spring`'s claims are TRUE. But three runtime seams the gates never measured are broken: the menubar (z40) occludes the sheet (z20) bottom 12px (M1); the sheet body clips its own controls so the easing editor is unreachable (M2, folds B4); `transition: all` on every dock (M3, the B8 jank). (`b13-mobile.md`) | **PARTIALLY-PAPERED → FOLD the seams into I** |
| **CH-4 dock (D5 lag + D9 popover)** | D5 CLOSED via `proof:dock-morph-settled` GREEN (+4.5% ≤ +6% on consumed ~3.5.1); D9 CLOSED via `proof:dock-popover-opens` (App.vue un-double-wrap) (`H/FINAL.md:72`) | **D5 spring GENUINELY settled** — the dock-morph stress probe measures a CLEAN dock (mean 8.3ms, p95 9.1ms, 120fps, `widthWrites:0`, 0 dropped frames; `b8-dock-stress-dump.json springPath`). H's `proof:dock-morph-settled` is honest. **BUT** the user's B8 "ALL dock animations supremely broken, slow, errored" is REAL via THREE un-gated adjacent paths: (a) the B1 "......" crash floods the console on every load/switch (poisons the felt experience); (b) `transition: all` on the glass-ui ~3.5.1 dock primitive (mobile-acute layout-animation jank, M3); (c) the content-visibility ReadPixels stalls (33+ verbose warns per session). D9 popover: H un-double-wrapped App.vue, but live `square` still shows `aria`-driven dock triggers and the user reports controls "blank on switch" via the B2 FSM crash. | **D5 closed-for-real; the "slow dock" the user means is B1+M3+RC-2 → FOLD those into I** |

> **The meta-finding (the spine of this recap).** H built the *right architecture* — a
> chronic exits only via a SYSTEM gate or a HANDOFF-paired-born-RED-gate
> (`H/FINAL.md:9-11`). The architecture is sound. **It failed in PRACTICE for two reasons
> the I audit proves:** (1) **a born-RED HANDOFF gate parked against a VAPORWARE version
> never bites** — `proof:specular-handoff` "resolves at glass-ui 3.8.0" which does not
> exist (npm tops 3.7.0), so the specular IOU is un-dischargeable and the gate is green by
> *accepting* the defect (`b15 §B7`, `b7 TL;DR`); and (2) **a SYSTEM gate that measures
> the wrong axis passes vacuously** — `proof:mobile-single-page` measures `sheet.top` vs
> stage but never `sheet.bottom` vs `menubar.top`, so M1's 12px occlusion sails through
> (`b13 §headline`). The repair Tranche I must make is not a new architecture — it is to
> make the gates measure the PIXEL THE USER SEES and forbid born-RED gates against
> unpublished/vaporware targets.

---

## §1 · THE FOUR DESIGN CHRONICS — full history + current TRUE state

### CH-1 · cartoon-shadow + specular (D2/D14) — papered 5 tranches, HANDOFF now vaporware

**History (the escape mechanism: M1 issue-close + M3 column-migrate-to-vaporware).**

| Tranche | What happened | Cite |
|---|---|---|
| A | grand-audit named the CSSCodeEditor cartoon-shadow + booked it to "demo-polish" | `A/audit/constellation-grand-audit` |
| B | B.W5 PROMISED to be "the demo-polish home" then FINAL re-deferred the cartoon-shadow token | `C/audit/lanes/deferred-ledger.md:47-59` (C named B's contradiction) |
| C | C.W2 closed it on **EXACTLY ONE site** (`179019f`, `CSSCodeEditor.vue:6`) — a textbook one-motion token adoption — but the LEDGER read "cartoon-shadow CLOSED" and every later tranche treated the SYSTEM as done | `a-deferred-chronic.md:61`, `D/audit/deferred-ledger.md:241` (CLOSED-4) |
| D→E→F | E + F both declared the ledger "CLEAN / zero KFE — D was the terminal home for all chronic debt" — believing C closed it (`E/audit/deferred-ledger.md:9-26`, `F/audit/_SYNTHESIS-deferred-ledger.md:0`). **This is the false-clean.** | — |
| G | a glass-ui `surface="glass"` default silently re-took every panel with the un-wired `.glass-specular-track` radial; no ledger row contradicted it | `H/_SYNTHESIS-deferred-ledger.md:66-96` (CH-1) |
| H | H.W2/W9 flipped panels to `surface="cartoon"`, deleted the manual `.glass-card`, INVERTED `proof:no-orphan-specular` to exception=∅; the *stage* glass-card sheen (W11 I5) re-tagged a born-RED HANDOFF "resolves at glass-ui 3.8.0 `specular='off'`" | `H/FINAL.md:69,93,166`, `H/waves/H.W2.md`, `H.W9.md` |

**Current TRUE state (I live, `b7-specular-glassui.md` + `b15-glassui-cards-surfaces.md`).**
- **The cartoon PANELS read correctly** — `surface="cartoon"` left-rail Cards land the W2
  intent (2px border, offset-stamp `--shadow-cartoon-md`, hover-lift on `--spring-bouncy`).
  H's panel-side fix is REAL. (`b15 §design-fidelity`.)
- **The specular SHEEN is STILL present on every glass surface** — measured live: stage
  glass `::before` blooms `rgba(255,255,255,0.55)` at rest 0.35 → hover 0.6 on
  easing/spring/sequence/motion-path; the cube/amiga docks carry 9–11 blooming glass
  `<Button>` tracks each; `--mouse-x`/`--mouse-y` are NEVER written, so the "travelling
  catch-light" degrades to a dead centred wash that reads as a rendering defect.
  (`b7 §behavior`, `b15 §per-scene-census`.)
- **The HANDOFF target is VAPORWARE.** `proof:specular-handoff` is parked born-RED against
  glass-ui **3.8.0 `specular='off'`** — *that version does not exist*; npm tops at 3.7.0,
  and 3.7.0 folds the specular into a `.glass-material` mixin applied to MORE surfaces. The
  `specular="off"` opt-out IS authored + merged in the glass-ui **working tree** (`6fac61a`,
  `git describe`=`v3.6.0-116`) and even *defaults to off* — but it is in NO published tag,
  so a passive `npm update` cannot land it. (`b7 §source-trace`, `b15 §B7-secondary`.)
- **kf is pinned `~3.5.1`** (resolves exactly 3.5.1); the user's "are we using the latest
  glass-ui?" is answered NO. (`b7 TL;DR`.)

**TRUE verdict: STILL-BROKEN.** `proof:no-orphan-specular` went green by *recording the
bloom as "sanctioned residue"* — it asserts the bloom is PRESENT on the stages and calls
that a pass. **A gate that certifies the exact pixels the user calls a defect is the
blindspot incarnate.** glass-ui has independently concluded the flat panel is the correct
default, so the user reading the bloom as a defect is *aligned with glass-ui's own design
decision*, not a taste disagreement to be handed off.

**FOLD into I.** The escape is to stop treating the specular as a deferred HANDOFF to a
non-existent version. Options the I authoring must choose between (decision, not made here):
(A) drive glass-ui to CUT a release containing `6fac61a`, bump the pin, set stages
`specular="off"` (default flips them flat, zero kf CSS); or (C) wire a real pointer listener.
(A scoped `.glass-specular-track::before { content: none }` suppression is **REJECTED by I.W6**
as the CSS-suppression WORKAROUND the tranche forbids — the user's F6 was "die at SOURCE, no CSS
suppression", so the cosmetic must be removed at its origin, not neutralised at the consume-edge.)
**The I gate must assert `paintsRadial === false` at rest on stages + docks — a runtime
probe reproducing the user's eye — NOT a source-shape check, NOT a born-RED deferral to
vaporware.**

---

### CH-2 · φ-hero typography (D7) — the ONE genuinely-discharged design chronic

**History (M1 issue-close, 5 tranches of "addressed").** A grand-audit BOOKed the hero
φ-ladder → "demo-polish"; B.W5 promised + re-deferred; C.W2 closed the DISPLAY tier
(`179019f`); the leaf-tail (89→128 body rungs) BOOKed to D.W2 "0 raw body rungs"
(`D/audit/deferred-ledger.md:23-41` KFD-1, `D/PROGRESS.md:43`); G.W10 "swept"; each close
was a SLIVER and the SYSTEM property ("0 body rungs" + hero on the TOP rung) was asserted,
never enforced (`a-deferred-chronic.md:62`). H corrected the count honestly: the earlier
"37 survivors" counted vendored `ui/` shadcn + `dist/`; the in-scope survivor count was
**2** (`AnimationMenuBar.vue:102` + `MotionPathTarget.vue:119`), and the hero was on
`text-display-4` (86px, a MID rung). (`H/_SYNTHESIS-deferred-ledger.md:107-128`.)

**H closure.** H.W4 promoted the hero `text-display-4` → `text-display-mega` and authored
`proof:phi-leaf-zero` asserting BOTH halves (hero resolves the `text-display-mega` CLASS +
a px floor ≥140px at 1440×900 AND 0 raw `text-*` rungs ex-`ui/`/`dist/`). (`H/FINAL.md:70`,
`H/waves/H.W4.md`.)

**Current TRUE state (I live).** The user's 2026-06-08 B-report does NOT re-flag the hero
size or body rungs — the one design chronic the user did not re-surface. The probes confirm
correct icon/text rendering across scenes (`b9-icons-assets.md §6`, no rung complaints).
**This SYSTEM gate genuinely discharged the chronic at the asserted scope.**

**TRUE verdict: CLOSED-FOR-REAL (re-affirm).** This is the model of a chronic the gate
regime actually closed — it polices the leaves (enforced 0, not asserted 0) AND the hero
rung. **DO NOT re-litigate the φ-ladder in I.**

> **Caveat the I author must NOT confuse with CH-2:** B4 — "/easing LOST the easing-curve /
> timing editor; the user wants the bezier component BACK; the J1-J6 minimalism over-removed
> it" — is a SEPARATE D-defect (the easing-editor surface), not the φ-typography chronic.
> H.W12's J1-J6 easing-sidebar-minimalism strip (`proof:easing-sidebar-minimal`,
> `H/FINAL.md:44`) over-removed the curve/timing editor. On mobile the editor isn't removed,
> it's *clipped unreachable* (M2). B4 folds into I as its own item — see §3.

---

### CH-3 · mobile composition (D10/D13) — bones real, three seams papered

**History (M2 scope-narrow into a terminable sub-problem).** "Perfect mobile" was always
scoped DOWN to the *occlusion* sub-problem (dock-over-content): named at A→B→C, fixed as
the `square/mobile` occlusion at **D.W5** (`D/audit/deferred-ledger.md:42-58` KFD-2,
"KFD-TERMINATED-2"), residual re-tagged glass-ui-HANDOFF at G.W12. The user's D10 intent —
single page, affixed top+bottom docks, the page re-shaping by mode, the BACKGROUND being
the live animation — was **net-new product intent the ledger never had a row for**
(`a-deferred-chronic.md:63`, `H/_SYNTHESIS-deferred-ledger.md:130-158`). H.W7 RE-FRAMED it
as net-new architecture: full-bleed stage background, controls a bottom-SHEET overlay, the
sheet motion a `SpringProgress` subscription. Gates: `proof:mobile-single-page` +
`proof:drawer-spring` + `proof:dock-zorder`. (`H/FINAL.md:40,71`, `H/waves/H.W7.md`.)

**Current TRUE state (I live, `b13-mobile.md` at 390×844 + 375×667).**
- **The bones SURVIVED and are genuine** — full-bleed `.stage-cell position:fixed inset:0`
  across all 7 scenes; affixed docks; a real underdamped `SpringProgress` drawer (settle
  169–175ms < 350ms budget, overshoot 0.015, 105–109 frames — NOT a CSS ease). subject
  visible-fraction ≈ 0.48 ≥ 0.45 floor. **`proof:drawer-spring`'s claims are TRUE.**
- **Three runtime seams are broken — none of which the gates measured:**
  - **M1** the bottom menubar (z40, top 750) occludes the sheet (z20, bottom 762) by 12px —
    `--dock-menubar-reserve` under-reserves the `env(safe-area-inset-bottom)` pad
    (`ControlsPaneWrapper.vue:251`). `proof:mobile-single-page` measures `sheet.top` vs
    stage, never `sheet.bottom` vs `menubar.top`. (`b13 DEFECT-1`.)
  - **M2** the sheet body CLIPS its controls — only 7 of 36 cube controls are in-viewport;
    the easing editor row is sliced at the fold. The inner pane is `overflow-y:auto` only
    when `isPanelTransitionDone`, gated on a `@transitionend` the **SpringProgress drawer
    never emits** (the height transition was replaced by `--sheet-t`). The scroll-affordance
    is dead; folds B4 (`ControlsPaneWrapper.vue:50-55`). (`b13 DEFECT-2`.)
  - **M3** `transition: all` on every `.z-dock` — glass-ui ~3.5.1 dock primitive; animates
    layout (width/height/top) on every reactive flip — the B8 "supremely broken/slow" smell,
    mobile-acute. (`b13 DEFECT-3`.)
- Plus the SHARED engine/FSM rot rides mobile too: B1 "......" crash fires on every cube
  load + switch; B2 `_gen` suspend crash on easing/spring load; B3 amiga void + stale
  controls on switch. (`b13 §shared-rot`.)

**TRUE verdict: PARTIALLY-PAPERED.** The spring + full-bleed are closed-for-real; the
overlay COMPOSITION has three un-gated occlusion/reachability seams.

**FOLD into I.** Derive the sheet bottom anchor from the *measured* menubar height (not a
hand-tuned token); drive `isPanelTransitionDone` off the spring's settle (not a dead CSS
`transitionend`); scope dock transitions to `transform`/`opacity` (glass-ui handoff, ties
M3↔B7 pin). The I gates must measure **sheet.bottom ≤ menubar.top**, **controls-body
reachability** (can it scroll to its content), and **dock transition cost** — interaction
geometry, not source shape.

---

### CH-4 · the dock (D5 lag + D9 popover) — D5 spring closed-for-real; the "slow dock" is elsewhere

**History (M3 column-migrate to HANDOFF without a paired gate).** The dock split into (a) a
kf-demo rename/barrel chore — landed D.W5/G.W12 (`D/audit/deferred-ledger.md:59-103` KFD-3/4)
— and (b) the BEHAVIOURAL defects (double-click `f0b0ffb`, lag, popover) perpetually routed
glass-ui-HANDOFF per the standing memory rule ("all dock changes in glass-ui, never patched
in demo"). The rename CLOSED in the kf column; the lag/popover never had a kf-side terminal
because the rule forbade a kf fix, so the HANDOFF was never *gated* — a HANDOFF is by
construction never a P-invariant violation no matter how long it stays broken
(`a-deferred-chronic.md:64`). **G INTRODUCED the D5/D9 regression vector** by removing
`:always-expanded="isMobile"` + the `DockLayerGroup` wrappers on an unverified assumption
(`H/_SYNTHESIS-deferred-ledger.md:171-178`). H.W1 un-double-wrapped App.vue (D9
`proof:dock-popover-opens`); H pinned `@mkbabb/glass-ui ~3.5.1` to consume the published
`53c1b07` spring retune (D5 `proof:dock-morph-settled` +4.5% ≤ +6%, down from 3.4.0's
+16.3% born-RED witness). (`H/FINAL.md:72,101`.)

**Current TRUE state (I live, `b8-dock-stress-dump.json` + `b13-mobile.md`).**
- **The D5 dock SPRING is genuinely settled.** The dock-morph stress probe measures a CLEAN
  dock: mean 8.3ms / p95 9.1ms / 120fps / `widthWrites:0` / 0 frames dropped >33ms / 2
  morph toggles complete. `proof:dock-morph-settled` GREEN is HONEST — kf consumed a real
  glass-ui spring fix and it works on this hardware. (`springPath` block.)
- **D9 popover** — H's App.vue un-double-wrap is in the build; but the user reports controls
  "blank on switch", which is the **B2 FSM crash** leaking onto the dock surface, not the
  popover wiring per se (`b3-amiga.md §switch`, `b13 §B2`).
- **The user's B8 "ALL dock animations supremely broken, slow, errored" is REAL — but it is
  NOT the dock spring H closed.** It is three adjacent un-gated paths:
  1. **B1 "......" crash** floods the console on every load + switch (`error Err x 0 / 1 | /
     ^^^` + `[KeyframesString] could not serialize … Parse error at offset 0: "......"`) —
     present in the SAME dock-stress probe console (`b8-dock-stress-dump.json:33-34,101-102`).
     This poisons the felt experience ("errored").
  2. **M3 `transition: all`** on the glass-ui ~3.5.1 dock primitive — layout-animation jank,
     mobile-acute ("slow"). (`b13 DEFECT-3`.)
  3. **content-visibility ReadPixels stalls** — 33+ `[verbose] Rendering was performed in a
     subtree hidden by content-visibility` per session + the amiga `GL_CLOSE_PATH_NV … GPU
     stall due to ReadPixels` (`b8-dock-stress-dump.json:31-65`, `b3-amiga.md §console`).

**TRUE verdict: D5 spring CLOSED-FOR-REAL; the "broken dock" the user MEANS is B1 + M3 +
RC-2.** H closed the chronic it gated and the gate is honest — but the user's lived "dock is
broken" is a *different bundle of defects* the chronic-closure table never enumerated. This
is the M3 escape's residue: closing the named sub-problem (spring overshoot) does not
discharge the user's felt "the dock is broken."

**FOLD into I.** Kill B1 at source (the real headline — see §2). Scope the glass-ui dock
`transition: all` → `transform`/`opacity` (handoff, re-evaluate the ~3.5.1 pin). Drop
`content-visibility:auto` from live-rAF/WebGL roots (RC-2). Re-verify the no-occlusion
contract G transferred. The dock-spring memory rule ("dock fixes in glass-ui, consumed via
bump") is CORRECT — do NOT relax it.

---

## §2 · THE CRASH CHRONICS — B1 + B2 are H.W0/H.W1 regressions, BACK via un-gated paths

These are NOT in the historical A→G chronic ledger — they are **H-era regressions that H
declared fixed and the live demo proves un-fixed.** They are the most load-bearing I items
because they "poison every other measurement" (the exact phrase H used to justify W0 going
FIRST, `H/FINAL.md:33`).

### B1 · the "......" serialize crash — H.W0's fix was INCOMPLETE

**History.** H.W0 (`25a6434`) claimed to KILL the two live console crashes: H-A2 "the
`"......"` lerp parse-error on route-storm-restored blank state" became a typed
`AnimationOptionError` guarding `frame-compiler.ts:155-167`; `proof:demo-console-clean`
(0 console errors on a fresh route) + `proof:interpolate-anything` (the `"......"`
reproduction) went GREEN. (`H/FINAL.md:33,69`, task #83.)

**Current TRUE state (I live, `b1-*` probes + `b8`/`b13` consoles).** The crash is BACK via
a path W0's FrameCompiler guard never covered. Live stack (user report + `b13 §B1`):
`KeyframesStringControls.vue:47/149 → CSSKeyframesToString (format.ts:86) → engine.ts:460 →
interpFrames (engine.ts:516) → processFrame (engine.ts:576) → value.js parseState (empty
input)`. ALSO via `toggleAnimationGroup (useAnimationGroupPlayback.ts:43) → group.ts
pause/render/_frame`. The user's RAINBOW group-play button errors with `Error: Parse error
at offset 0: "......"`. **W0 guarded the FrameCompiler blank-selector; it did NOT guard the
`CSSKeyframesToString → processFrame` serialize path or the `getAnimationId` keyFn over a
blank selector** (`b13 §B1` mobile stack: `bo (parseState) → cn.keyFn (getAnimationId)`).
`proof:demo-console-clean` went green by checking the HOME LOAD, not the group-play / switch
INTERACTIONS. (`b8-dock-stress-dump.json:33-34`, fires inside an unrelated dock probe.)

**TRUE verdict: STILL-BROKEN (H.W0 incomplete).** **FOLD into I as the headline crash fix.**
The gestalt fix is at the engine seam (`inv-16`: src/animation is the product, NOT fenced
this tranche) — guard the empty-input path at `CSSKeyframesToString`/`getAnimationId` keyFn,
or eliminate the blank-keyframe state that feeds it.

### B2 · the DFA `_gen` suspend/resume crash — H.W1's keystone FSM is BROKEN

**History.** H.W1 (`256f6fe`), "the keystone," collapsed 5 scene authorities + 3 playback
authorities into one `useSceneMachine()` (pure reducer) and claimed *"makes suspend→restore
a byte-identical identity"*; gates `proof:scene-machine-irrefragable` + `proof:no-route-storm`
+ `proof:scene-isolation` all GREEN. D12 declared DEAD. (`H/FINAL.md:34,102`, task #84.)

**Current TRUE state (I live, `b2-*` + `b3-amiga.md` + `b13 §B2`; root cause ADJUDICATED in
`rootcause-rc-dfa-gen.md`).** `TypeError: undefined is not an object (evaluating 'this._gen')`.
The user's source-mapped stack (`suspend (scenePlaybackAdapters.ts:36)` → `captureActive
(useSceneMachine.ts:104)` → `dispatch (:77)` → `switchScene (useSceneMachineApp.ts:139)`) and
the deterministic tab-hide stack (`stop (playback.ts:216)` → `useSceneVisibilityPause.ts:45` →
`flushJobs`) are TWO views of ONE defect. **The adjudicated root cause is an UNBOUND
instance-method, NOT an unarmed scene:** `useEasingDemo.ts:227` and `useSpringDemo.ts:365` pass
the bare value `playback.stop` (the `RAFPlayback.prototype.stop` function with its receiver
dropped) as the `pause` callback to `useSceneVisibilityPause(...)`. When the visibility watcher
fires it invokes that ref free-standing — `this === undefined` — so `stop()`'s first statement
`this._gen++` (`src/animation/playback.ts:216`) throws. **The object is ALIVE; only the binding
is lost** — the BOUND sibling on the SAME instance, `stopLoop = () => playback.stop()`
(`useEasingDemo.ts:171`), and `onScopeDispose`'s `playback.stop()` (`:219`) both work fine
(`rc-dfa-gen §1a`). The throw lands inside a Vue reactive flush (the co-fired `visibilitychange`
during the View-Transition switch), aborting the in-flight component-update of the swap → the
incoming scene's control panel half-mounts → BLANK controls (`b3-amiga.md §switch`,
`shots/b3-amiga-06-switch-from-easing.png` — empty controls pill + a stale pause glyph). One
defect, two faces. The user's spec — first scene SUSPEND+SAVE, next RESUMES iff it was playing —
is honored by the pure reducer ALREADY (`rc-dfa-gen §1c/§5c`); only the EFFECT layer throws.
(`b13 §B2`, fires on easing/spring on plain load both viewports.)

> **b12's unarmed-scene / stale-group hypothesis was RULED OUT** by `rc-dfa-gen §1b`: the
> message names `this._gen`, which can ONLY be reached if `stop` was ENTERED with
> `this === undefined`. The stale-group path (`group.playback.stop()`,
> `scenePlaybackAdapters.ts:72-73`) is a MEMBER call — it cannot enter `stop` unbound; an
> undefined group would throw a DIFFERENT message at the `.stop` property access. So neither an
> unarmed scene nor a stale group produces this crash. The cure is NOT a null-guard.

**TRUE verdict: STILL-BROKEN (H.W1 keystone un-sound — the EFFECT layer, not the reducer).**
`proof:scene-machine-irrefragable` tested the scene²×{playing,paused} round-trip over the
hash/programmatic path while playback WAS armed — it never put a PLAYING raw-rAF scene through a
visibility/dock-switch tick, the only path that fires the unbound callback. **FOLD into I.W1
(CRITICAL).** The cure is the bind-proof transposition, NOT a workaround: make `RAFPlayback`'s
control surface (`stop`/`play`/`drive`) **bound-by-construction** (arrow class-fields or
constructor-bound) so `const s = pb.stop; s()` can never lose `this` — closing the WHOLE
unbound-method crash class at the engine seam (inv-16; `src/animation` is the product) — AND
consolidate the duplicated raw-rAF boilerplate (easing + spring hand-wire the identical recipe
and BOTH made the same binding mistake) into ONE `useRafScene` composable with bound callbacks,
so no scene can re-introduce the unbound reference. PRESERVE the correct pure reducer untouched.
**NO null-guard in suspend** — that defends the call site against an undefined receiver instead
of making the binding correct by construction, and is a WORKAROUND by this tranche's own
definition. (`rootcause-rc-dfa-gen.md §5a/§5b`, `I.W1` S1.)

---

## §3 · THE OTHER LIVE-OBSERVED DEFECTS (B3–B6, B9) — chronic-or-new, with disposition

| ID | Defect | Chronic? | History / cite | TRUE state | I disposition |
|---|---|---|---|---|---|
| **B3** amiga "totally broken, floats around" | **NEW (H.W5 rebuild defect)** | H.W5 (`db90cbb`) promoted the sphere to the interactive subject but never re-centred it or re-targeted OrbitControls onto it (`b3-amiga.md RC-1`) | The sphere is parked at corner `(-5,-5,-5)` while OrbitControls orbits origin `(0,0,0)` — center-drags tumble the whole room; the spin gesture is unreachable. Plus RC-2: `content-visibility:auto` over a live WebGL loop → ReadPixels GPU stall + "rendering in a hidden subtree" warns. NO crash, NO pageerror — pure visual/interaction. | **FOLD.** Centre the sphere (or `controls.target` onto it); reconcile `SPHERE_HOME`; drop `content-visibility:auto` from the WebGL root (RC-2 ties to B8 perf). A gestalt geometry transposition, not a patch. |
| **B4** /easing LOST the easing-curve/timing editor | **NEW (H.W12 J1-J6 over-removal)** | H.W12 J1-J6 easing-sidebar-minimalism (`proof:easing-sidebar-minimal`, `1988dcb`/`6abafcd`) over-removed the bezier/curve component; B5 "/* timing-function: custom — no CSS twin */" is the same surface | The user wants the easing selector/bezier editor BACK. On mobile the editor is clipped-unreachable (M2), not removed. Adjacent to CH-2 φ-typography but a DISTINCT surface. | **FOLD.** Restore the easing-curve/timing editor idiomatically; reconcile with the minimalism strip's intent. NOT the φ chronic. |
| **B5** CSS keyframes editor shows "/* timing-function: custom — no CSS twin (see console) */" | **= B1 surface** | the serialize path can't round-trip a custom timing-function → emits the placeholder + the "......" console throw | same root as B1 (the `CSSKeyframesToString` serialize seam) | **FOLD with B1.** Fixing the serialize empty-input/custom-easing path resolves both. |
| **B6** /square drag highlights chrome text + does not persist | **NEW + LATENT-CLASS** | H.W12 extracted `useDragScrub` (`proof:dragscrub-single`) but SquareScene hand-rolls its own drag and uses neither shared composable (`b6-square-drag.md §source`) | No global `user-select:none` on drag-start (only `.square-stage` scoped) → native drag highlights dock + control labels; `pointerup` calls `reseat(0,0)` hard-coding spring-home → the drag is discarded. BOTH shared composables ALSO lack global select-suppression → latent across every drag surface. | **FOLD.** Lift global select-suppression + a persist-vs-recenter policy INTO the shared drag composable (gestalt single-seam); fold SquareScene's hand-roll into it. |
| **B7** specular STILL present / "latest glass-ui?" | **= CH-1** (see §1) | — | STILL-BROKEN; HANDOFF target vaporware | **FOLD (CH-1).** |
| **B8** ALL dock animations "supremely broken, slow, errored" | **= B1 + M3 + RC-2** (see §1 CH-4) | the dock SPRING is clean; the felt "broken" is B1 console flood + `transition:all` + ReadPixels | dock-morph stress = 120fps clean; the breakage is the three adjacent paths | **FOLD (B1 + M3 + RC-2).** |
| **B9** dev `ENOENT easing-icon-sm.svg` + 47 source-map errors | **HYGIENE (not a product defect)** | `easing-icon-sm.svg` added H.W5 (`db90cbb`), renamed → `easing.svg` H.W10 (`8df1e6a`); zero live source references the old name | Dev-only stale-state artifact: a stale Vite module graph / browser cache / un-tracked `demo/app/dist/` (March 25) imports the deleted path; the SPA history-fallback returns index.html (200) masking it. Built `dist/gh-pages/` is CLEAN (0 missing assets, 0 broken imgs, 0 map fetches across 7 scenes). The "x47" are DevTools-only Monaco/html2canvas dep-optimizer map warnings, build is `sourcemap:false`. | **FOLD (low).** Delete + gitignore `demo/app/dist/`; add a runtime icon-PAINT gate (every `SceneDescriptor` glyph resolves to a painting `<svg>` with non-zero box; server 404 set empty while clicking scenes) — `proof:scene-icons` checked source-shape + load-time and missed the orphaned-rename class because the SPA fallback hides it. |

---

## §4 · THE GLASS-UI HANDOFFS — chronic, and their TRUE pin/version state

The standing memory rule (`MEMORY.md`: "all glass-ui/dock changes go in glass-ui, never
patched in demo") is CORRECT and these are correctly OUT/HANDOFF. But the I audit reveals the
HANDOFFs have been parked against **versions that do not exist** and a pin two minors stale.

| Item | History | TRUE state (I live) | I disposition |
|---|---|---|---|
| **specular `specular="off"` opt-out** (CH-1 / GH-2 / `proof:specular-handoff`) | H "resolves at glass-ui 3.8.0" (`H/FINAL.md:93`) | **VAPORWARE** — 3.8.0 does not exist (npm tops 3.7.0); the fix is in glass-ui's working tree `6fac61a` (`v3.6.0-116`) in NO published tag; 3.7.0 makes the sheen MORE pervasive (`b7 §source`, `b15 §B7-secondary`) | **RE-OWN the disposition.** Either drive a glass-ui release containing `6fac61a` then bump + `specular="off"`, OR neutralise at the kf consume-edge. Do NOT re-park born-RED against a non-existent version. |
| **dock `transition: all` → transform/opacity** (M3 / B8) | not previously named as a chronic; surfaced live this pass | glass-ui ~3.5.1 dock primitive ships `transition: all` — animates layout, mobile-acute jank (`b13 DEFECT-3`) | **HANDOFF (glass-ui) + born-RED kf gate.** Scope dock transitions to compositable props in glass-ui; pair a kf perf gate that reds while the consumed dock animates layout. |
| **dock spring retune** (D5 / `53c1b07`) | consumed at ~3.5.1 (`H/FINAL.md:168`) | GENUINELY landed — dock-morph stress 120fps clean (`b8-dock-stress-dump.json`) | **CLOSED-for-real (re-affirm).** The model HANDOFF: published fix consumed via bump, gated, GREEN. |
| **dock pin currency** (B7 "latest glass-ui?") | kf pinned `~3.5.1` | npm latest 3.7.0 (published 2026-06-08); kf two minors behind; 3.6/3.7 re-regress the specular per H's `~`-cap rationale (`H/FINAL.md:72`) | **DECIDE in I (measure-first).** A naive bump worsens the sheen; the pin currency is coupled to the specular disposition above — resolve them together. |
| **`{types}` VT helper / Drawer `spring` / LabeledField orientation** (FB-4, GH-3, OUT-1) | A→H glass-ui-HANDOFF, born-RED paired (`H/FINAL.md:94-95`) | unchanged; the demo VT consumer (`useSceneTransition.ts`) waits on the helper | **CARRY (correct OUT).** Keep the born-RED pairing; verify against the AX tranche. |

---

## §5 · THE ENGINE / PARSE / value.js / parse-that CHRONICS — genuinely-clean process (re-affirm)

These are NOT papered design chronics — they are net-new scope with carried gates, owned by
the source/sibling lanes (`a-deferred-chronic.md:124-141` DC-7). The I audit does NOT
re-litigate them; recorded for completeness. **The one inversion this tranche:** `inv-16`
for I states *"the engine src/animation is the product (NOT fenced this tranche) — runtime
correctness may require engine transposition"* — so B1/B2 (the crash chronics, §2) MAY touch
`src/animation`, unlike H which fenced the engine.

| Band | History | TRUE state | I disposition |
|---|---|---|---|
| **C-1 value.js cross-repo charter** | CHRONIC-by-design; a slice ships every tranche; G consumed 0.11.1 via the re-pin (`G/_SYNTHESIS-deferred-ledger.md §1`, `H/_SYNTHESIS-deferred-ledger.md:363-370`) | CORRECTLY perpetual — the inv-16 process WORKING. value.js installed 0.11.1; parse-that 0.9.0 | **CHRONIC-by-design (re-affirm), untouched.** The "did the product move?" test: YES for C-1 (the re-pin lit the F wins). |
| **value.js next-slice** (E1/E2 linear parser, VJ-F1 path sampler, F2 color sentinels, MCI-5 identity pad, VJ-F2 error sink, VJ-F4 buffer overload, F3 LRU) | born-RED HANDOFF, ride the next re-pin ZERO kf edit (`H/FINAL.md:96`, `G §3.4`) | OPEN next slice; the `it.fails` MCI-5 witness is the consume signal (`test/interpolate-anything.test.ts:226`) | **CARRY (correct value.js-HANDOFF).** |
| **parse-that `(id,offset)` packrat re-key** (PT-4) | WITHHELD; named, gated (`proof:packrat-position`), completable (`G §2`, `H §3.4`) | OPEN; isolated opt-in path, zero production consumers | **CARRY (parse-that-HANDOFF).** |
| **engine BOOKs** (FB-1 composition HONORING, FB-2 sync-step half, FB-3 MorphSVG/VJ-F1, FB-5 intrinsic-size `0→auto`, SoA `lerpArray`) | F→G→H BOOKs with carried gates; FB-1's blend leaf FIXED G.W17 (`group.ts:309-341`); the dead `add`/`weighted` arm corrected (`G §0.5 SUP-1`) | genuinely-open net-new scope, NOT papered | **CARRY (OUT-of-design-lane).** Engine-owned; gates live in source lanes. |
| **line-ceiling watch** (C-6) | G.W5 DECISION; `engine.ts` = 1375L under the 1400 ceiling (`H/_SYNTHESIS-deferred-ledger.md:358`) | 25L headroom — do NOT grow without a measured split | **RECORD (watch).** |

---

## §6 · THE DEAD-CSS / "DECIDE" PUNTS — twice-deferred, status

| Item | History | TRUE state | I disposition |
|---|---|---|---|
| **DC-8 scene-swap VT dead-CSS** | TWICE-deferred A→B→C (`C/audit/lanes/deferred-ledger.md:124`); C.W3 claimed DELETED + restored via `SpringProgress` (`D/audit/deferred-ledger.md:234-239` CLOSED-3); H routed → H.W5 `grep=0` gate (`H/FINAL.md:103`) | the H harden lane flagged DC-8 as a "DECIDE with no owning wave" risk (`hd-chronic-recap.md:201-225` H-6) — likely closed in H.W5 but worth a `grep` re-verify in I | **VERIFY in I** (`grep` dead scene-swap CSS = 0). If present, KILL or restore via `startViewTransition`. No third defer. |
| **FB-6 `Mod+K` palette** | F→G→H BOOK, low; owner-decision (demo-local vs glass-ui shell) deferred (`H/FINAL.md:103`, `G §4 FB-6`) | NOT a user D-defect; genuinely low | **CARRY (BOOK, low).** Decide owner if touched; do not re-defer without the decision. |
| **dev.sh/deploy.sh** | twice-booked A→B, KILLed-with-rationale C.W4 (`D/audit/deferred-ledger.md:203-209` ARCH-3) | npm scripts are the contract | **KILL (re-affirm), do NOT re-litigate.** |
| **ARCH kills** (ScrollTimeline-native, Worker/OffscreenCanvas, WASM-parser, Typed-OM carrier, per-property easing, bit-packing) | A→H permanent KILLs with rationale (`D §ARCH`, `G §7`, `H §3` ARCH) | terminal; no consumer pull A→H | **RECORD permanent, do NOT re-litigate.** |

---

## §7 · WHY THE CHRONICS RE-ESCAPED — the gate-blindspot, named for the I overhaul

The H chronic-closure ARCHITECTURE is sound (a chronic exits only via a SYSTEM gate or a
HANDOFF-paired-born-RED-gate). The I audit proves it FAILED in practice via two concrete,
fixable mechanisms — these ARE the headline the gate-regime overhaul must close:

1. **Born-RED gates parked against VAPORWARE never bite (the specular).**
   `proof:specular-handoff` "resolves at glass-ui 3.8.0" — a version that does not exist.
   A born-RED gate against a non-existent/unpublished target is an *un-dischargeable IOU*
   that goes green by *accepting the defect as residue*. **I rule: a HANDOFF gate may only
   target a PUBLISHED version, or a kf-owned consume-edge fix — never an unreleased
   working-tree commit or a future version number.**

2. **SYSTEM gates that measure the wrong axis pass vacuously (mobile M1, icons B9, dock B8).**
   `proof:mobile-single-page` measured `sheet.top` vs stage, never `sheet.bottom` vs
   `menubar.top` → M1's 12px occlusion sailed through. `proof:scene-icons` checked
   source-shape + load-time → the orphaned-rename 404 hid behind the SPA fallback.
   `proof:dock-morph-settled` measured the spring → missed the B1 console flood + `transition:
   all` + ReadPixels that ARE the user's "broken dock." **I rule: every gate must measure the
   PIXEL/INTERACTION the user reports — click play, switch scenes, drag, measure occlusion +
   reachability seams + console-during-interaction — NOT a source-shape or load-only check.**

3. **The "ledger CLEAN" false-positive cascaded (E/F).** E + F both declared the ledger
   "CLEAN / zero KFE — D was the terminal home for all chronic debt"
   (`E/audit/deferred-ledger.md:9-26`, `F/audit/_SYNTHESIS-deferred-ledger.md:0`) — inheriting
   C's one-site cartoon close + D's occlusion-narrow as system-closes. Two tranches re-asserted
   a clean ledger over papered chronics. **I rule: a "clean ledger" claim must be backed by a
   live-runtime re-verification of each prior CLOSED row, not a chain-of-trust over prior
   FINALs.** (This recap IS that re-verification.)

---

## §8 · THE FOLD — what Tranche I inherits (the genuinely-open chronics)

**Born-RED / still-broken → FOLD into I (each needs a RUNTIME/INTERACTION gate):**
- **B1** the "......" serialize crash (H.W0 incomplete — the headline; `CSSKeyframesToString`/
  `getAnimationId` keyFn empty-input path; engine src NOT fenced this tranche). Folds B5.
- **B2** the `_gen` DFA suspend/resume crash (H.W1 keystone un-sound — the UNBOUND
  `playback.stop` passed at `useEasingDemo.ts:227`/`useSpringDemo.ts:365`, NOT an unarmed
  scene; b12's stale-group hypothesis RULED OUT by `rc-dfa-gen §1b`). Cure: bind-proof
  `RAFPlayback` + `useRafScene` consolidation (I.W1 S1) — NO null-guard. Folds B3's
  stale-controls-on-switch.
- **CH-1 / B7** the specular sheen on stages + docks (papered; HANDOFF target vaporware) —
  RE-OWN the disposition (consume-edge suppress OR drive a real glass-ui release).
- **CH-3 / B13** the mobile composition seams (M1 menubar-occludes-sheet, M2
  body-clips-controls-unreachable, M3 dock `transition:all`).
- **B3** amiga geometry (corner-parked subject vs origin-orbit) + RC-2 (`content-visibility`
  over a live WebGL loop).
- **B4** the easing-curve/timing editor (J1-J6 over-removal) — restore.
- **B6** /square drag (no global select-suppression; non-persistence) — fold into the shared
  drag composable as a single seam.
- **B8** the "broken dock" bundle = B1 + M3 + RC-2 (the dock SPRING itself is closed-for-real).
- **B9** (low/hygiene) delete stale `demo/app/dist/`; add a runtime icon-paint gate.
- **DC-8** (verify) `grep` scene-swap dead-CSS = 0.

**Closed-for-real → re-affirm, do NOT re-litigate:**
- **CH-2** φ-hero typography (the ONE design chronic the SYSTEM gate genuinely discharged).
- **CH-4 / D5** the dock SPRING retune (120fps clean, gated, honest).
- **C-1** value.js charter (CHRONIC-by-design, the process working).

**Carry (correct OUT/HANDOFF/BOOK):** the value.js next-slice, the parse-that packrat re-key,
the engine BOOKs (FB-1/2/3/5, SoA), the `{types}` VT / Drawer-spring / LabeledField glass-ui
asks, FB-6 `Mod+K`. **Permanent KILL (RECORD):** ScrollTimeline-native, Worker/OffscreenCanvas,
WASM-parser, Typed-OM carrier, per-property easing, bit-packing, dev.sh/deploy.sh.

---

## §9 · HONEST ALREADY-DONE (manufacture NO I work here)

- **The φ-hero chronic (CH-2) IS genuinely closed** — `proof:phi-leaf-zero` polices the
  leaves (enforced 0) AND the hero rung; the user did not re-flag it. The model close.
- **The dock SPRING (D5) IS genuinely settled** — the consume-leg bump worked; the dock-morph
  stress is 120fps clean. The model glass-ui HANDOFF (published fix, consumed via bump, gated).
- **The mobile spring + full-bleed bones ARE real** — `SpringProgress` drawer overshoot 0.015,
  settle 169–175ms; full-bleed `position:fixed` stage. H.W7's architecture is sound; only the
  edge seams leaked.
- **The cartoon PANELS read correctly** — H.W2's `surface="cartoon"` adoption is exemplary;
  the defect is the glass STAGE sheen, not the panels.
- **The chronic-closure ARCHITECTURE is the right repair** — the M1/M2/M3 escape taxonomy and
  "SYSTEM gate OR born-RED HANDOFF" invariant are sound. The I overhaul does NOT replace it; it
  fixes its two failure modes (vaporware HANDOFF targets; wrong-axis SYSTEM gates) and makes
  every gate a real RUNTIME/INTERACTION probe.
- **The engine/parse/color/re-pin kernels stay ALREADY-SOTA** — H did not touch them (save W0);
  the I crash-fixes (B1/B2) are surgical corrections at the serialize/playback seams, not a
  re-litigation of the engine.

---

## inv-16 / inv ε compliance

This lane wrote ONLY `docs/tranches/I/audit/recap-chronic.md`. ZERO source/test/CI/demo edits.
Every HISTORY claim cites a prior ledger `file:line` (`C/audit/lanes/deferred-ledger.md`,
`D/audit/deferred-ledger.md`, `E/audit/deferred-ledger.md`, `F/G/H/_SYNTHESIS-deferred-ledger.md`,
`H/audit/a-deferred-chronic.md`, `H/audit/harden/hd-chronic-recap.md`, `H/FINAL.md`); every
CURRENT-STATE claim cites a live I probe / shot under `docs/tranches/I/audit/investigate/`
(`b1-*`, `b3-amiga.md`, `b6-square-drag.md`, `b7-specular-glassui.md`,
`b8-dock-stress-dump.json`, `b9-icons-assets.md`, `b13-mobile.md`,
`b15-glassui-cards-surfaces.md`). The H chronic-closure meta-gate's 4 "closed" claims were
RE-EXAMINED against the running demo, one by one, and the genuinely-open ones folded into
Tranche I. **No invention; no chain-of-trust over prior FINALs — the live demo is the arbiter.**
