# DEEP harden — lane hd-w7 (H.W7 — mobile overlay + springy drawer)

**Charge:** red-team H.W7 substantively — is the fix CORRECT + FEASIBLE, does each gate
BITE, does it over-reach into ALREADY-SOTA, does it assume a non-existent API, is the
architecture SOUND. Live at 390×844 (port 5173), cross-read source, node_modules API checks.

**Verdict:** The wave is **substantively sound** — the core transposition (stack→overlay) and
the dogfood (CSS-ease→`SpringProgress`) are correct, feasible, and well-precedented; the
state evidence reproduces live; the gates mostly bite. **No BLOCKER.** But there are **2 HIGH**
defects that will trip implementation as written (a grep-gate that over-reaches into an
ALREADY-SOTA construct H.W3 explicitly preserves, and a preset/budget self-contradiction that
RED-fails the wave's own settle gate), plus a wrong scope path, a latent H.W3↔H.W7 grid
contradiction, and a fixed-positioning fragility the gate should lock. Details below, each with
file:line / live / node_modules evidence and a concrete doc edit.

---

## Live re-confirmation (390×844, port 5173, `#/cube`)

| Fact | Measured | Wave claim | Verdict |
|---|---|---|---|
| Pane OPEN displaces stage | scene-host `y 78→669`, `h 740→149` when pane opens | "evicts the stage" | **CONFIRMED** (a 591px shift; clause (b) bites hard) |
| Stage fraction, pane OPEN | `h=149 / 844 = 0.177` | "30px / starved to ~0" | **CONFIRMED** structurally (my content forced 149px not 30px — same defect, fraction < 0.45 so gate (a) reds) |
| Drawer transition | computed `transition: grid-template-rows 0.55s cubic-bezier(0.4,0,0.2,1)`, `--duration-panel: 0.55s` | "550ms CSS ease, not spring" | **CONFIRMED** |
| Drawer is bespoke (controls pane) | `ControlsPaneWrapper.vue:147-155` hand-rolled `0fr↔1fr`; NO vaul/Sheet on THIS element | "BESPOKE, not vaul/glass-ui Sheet" | **CONFIRMED — but see F-W7-2** |
| Docks affixed | top `z-dock=40` `position:fixed`; pane `z-controls=20`; scene `z=auto` | "ALREADY-SOTA, z below docks" | **CONFIRMED** |
| `--spring-snappy` resolves | live = a real `linear(...)` (glass-ui's `--spring-smooth`) | "FOREIGN glass-ui token" | **CONFIRMED** (`style.css:147`) |
| Fixed-containing-block ancestors | **none** between `.scene-host` and viewport (no transform/perspective/filter/contain) | (unaddressed) | feasible TODAY — see F-W7-5 |

The state §, the §Goal transposition, and the dogfood premise are all **honest**. The headline
("mobile stacks; must overlay; drawer must be sprung") is correct.

---

## FINDINGS

### F-W7-1 — `proof:drawer-spring (a)` grep-gate is UNSCOPED → over-reaches into an ALREADY-SOTA construct H.W3 protects — **HIGH**

**Location:** H.W7 §Hard gate, `proof:drawer-spring (a)` (`H.W7.md:43`): *"Grep-gate: no
`transition:.*grid-template-rows` … survives **in source**"*.

**Defect (evidence):** the live tree has a SECOND `transition: grid-template-rows` that is
NOT the drawer and MUST survive H: `AnimationControlsControls.vue:295`
(`.panel-row { transition: grid-template-rows var(--duration-normal) var(--ease-standard); }`)
— the collapsible-panel crossfade. **H.W3 §Design Decisions explicitly marks this ALREADY-SOTA
and orders it preserved** (`H.W3.md:22,58`: *"the `grid-template-rows: 0fr↔1fr` panel crossfade
(`AnimationControlsControls.vue:293-302`) is exemplary … MUST survive the transposition (keep
`display:grid; grid-template-rows`)"*). An unscoped `grep 'transition:.*grid-template-rows'` over
`demo/` therefore (a) **stays RED forever** after the W7 fix lands (the SOTA crossfade still
matches), making the gate non-passable, OR (b) pressures the implementer to wrongly delete the
SOTA crossfade — the inverse failure (re-touching exemplary scaffolding) the spine forbids.
The source-audit got this right (`a-mobile-architecture.md:149-150` scopes it: *"no
`transition:.*grid-template-rows` **on the sheet** in source"*) — the wave's §Hard gate restatement
**dropped the scope word**.

**Concrete doc edit:** in `H.W7.md:43` change the gate to scope the grep to the sheet file:
*"Grep-gate over `components/ControlsPaneWrapper.vue` ONLY: no `transition:.*grid-template-rows`
and no `transition` on the sheet's height/transform axis survives **in that file**; the
panel-crossfade `transition: grid-template-rows` at `AnimationControlsControls.vue:295` is the
ALREADY-SOTA construct H.W3 preserves and is OUT of this grep's path."* (Mirror the same scope
into §Folds `a-animations-quality F2` line `:53`.)

---

### F-W7-2 — The named preset (`response≈0.3, ζ≈0.8`) PASSES the 350ms gate, but the wave also points the implementer at `--spring-snappy` (= `response 0.5`) which FAILS it — **HIGH** (self-contradiction that reds the wave's own gate)

**Location:** H.W7 §Scope S2 (`:31`) + §Goal (`:25`) + audit F2 (`a-mobile-architecture.md:138-139`):
the preset is given as *"`response≈0.3, dampingFraction≈0.8`"* AND *"the `--spring-snappy`/
`--spring-smooth` vocabulary in `style.css:133-147`."* Gate `proof:drawer-spring (b)` (`:44`)
requires **settle `< 350ms`**.

**Defect (computed against the actual `spring.ts` analytic solver):** I solved the 0→1 step for
each candidate (overshoot as fraction; settle = first `|x−1|<1e-3`):

| preset | settle | overshoot (740px sheet) | gate (b) `<350ms`? |
|---|---|---|---|
| `response 0.3, ζ 0.8` (the NAMED preset) | **≈198ms** | ~11px | **PASS** |
| `response 0.3, ζ 0.86` | ≈241ms | ~3.7px | PASS (borderline overshoot) |
| `response 0.5, ζ 0.86` (= `--spring-snappy`→`--spring-smooth` TODAY, `style.css:147`) | **≈401ms** | ~3.7px | **FAIL** |

So the wave is internally inconsistent: its **named** preset is correct (198ms, clean
overshoot — gate (b) bites and greens), but it simultaneously gestures the implementer at the
desktop `--spring-snappy` token, which **today resolves to `response 0.5` and settles at ~401ms
— RED against the wave's own `<350ms` gate.** An implementer who reads "reuse the
`--spring-snappy` vocabulary" and binds the sheet to that token ships a gate-failing drawer.

**Concrete doc edit:** in S2 (`:31`) and §Goal (`:25`), state unambiguously: *"the sheet
constructs its OWN `SpringProgress({ response: 0.3, dampingFraction: 0.8, respectReducedMotion:
true })` (or `SpringProgress.fromDuration({ visualDuration: 0.3, bounce: 0.2, respectReducedMotion:
true })`) — it does NOT bind to the desktop `--spring-snappy` token, which aliases the calmer
`response 0.5` `--spring-smooth` (`style.css:147`) and settles ≈400ms (> the 350ms gate). The
`--spring-snappy` reference in the audit is VOCABULARY (the snappy/smooth family naming), not the
exact value to consume."* Optionally pin the budget headroom: note settle ≈198ms for the named
preset so the gate has margin.

---

### F-W7-3 — Wrong scope path: `editor-shell/ControlsPaneWrapper.vue` does not exist; the real file is `animation-controls/components/ControlsPaneWrapper.vue` — **MED**

**Location:** H.W7 header §Scope (`:3`) and the wave's recurring anchor
*"`demo/@/components/custom/editor-shell/ControlsPaneWrapper.vue`"*.

**Defect (evidence):** there is no `ControlsPaneWrapper.vue` under `editor-shell/`. The real,
edited file is `demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue`
(imported as `./components/ControlsPaneWrapper.vue` from `AnimationControlsGroup.vue:135`). The
cited line numbers (`:147-155` drawer, `:142-146` max-height, `:215-219` 440px cap) are CORRECT
against the real file — only the directory in the path is wrong. (`AnimationControlsGroup.vue`
itself IS under `animation-controls/`, so that anchor is right; only the wrapper's dir is wrong.)

**Concrete doc edit:** replace every `editor-shell/ControlsPaneWrapper.vue` with
`animation-controls/components/ControlsPaneWrapper.vue` (§Scope `:3`, the state-§ anchors, S1/S2,
§Folds). Also fix the implied claim that the file lives in editor-shell — the EditorShell only
hosts `AnimationControlsGroup`; the wrapper is in the controls subtree.

---

### F-W7-4 — Latent H.W3↔H.W7 contradiction: H.W3 builds a mobile `[stage] 1fr` track, H.W7 makes the stage `position:fixed` (removing it from that track) — **MED** (reconcile the "one grid re-parameterized" framing)

**Location:** H.W7 §DAG-deps + §Goal (`:3,25`) say H.W7 *"re-parameterizes the SAME single named
grid"* and the stage *"becomes the full-bleed `[stage]` background."* But S1 (`:29`) makes the
stage `position: fixed; inset: 0` — which **removes it from grid flow entirely** (a fixed element
is not a grid item). Meanwhile H.W3 S4 (`H.W3.md:33`) builds `grid-template-columns: [rail]
var(--rail-width) [stage] 1fr` × `grid-template-rows: [top] auto [stage] 1fr [bottom] auto` and
explicitly says *"D10 = the same grid re-parameterized in H.W7."*

**Defect:** the two framings collide. If the mobile stage is `position:fixed`, the H.W3 `[stage]`
track on mobile carries nothing — so it is NOT "the same grid re-parameterized," it is "the grid's
stage track abandoned on mobile and replaced by a fixed layer + a sheet that occupies the `[rail]`
track." That is a defensible (and probably correct) design — but the wave's own prose oversells
the continuity. Worse, it is ambiguous whether the SHEET stays a grid item in the `[rail]`/`[bottom]`
track (anchored by grid) or also goes fixed/absolute (anchored above the menubar). Live, the pane
is `z-controls` `position:relative` grid item today; S1 wants it "anchored above the bottom
menubar, sliding up over the stage" — that reads like `position:fixed`/`absolute`, not a grid track.

**Concrete doc edit:** add a §Design-decision resolving the grid relationship precisely, e.g.:
*"On mobile the stage layer LEAVES the grid (`position:fixed; inset:0`) and the H.W3 `[stage]`
mobile track collapses to `0` / is unused; the sheet is the only mobile grid consumer and rides
the `[rail]` track's width authority (`--rail-width`) for its content box while its open/close
TRANSFORM is the mobile-specific delta. 'Same grid re-parameterized' means the WIDTH TOKEN
(`--rail-width`) and the dock-band reserves are re-used — NOT that the stage stays a grid item.
The sheet's positioning context (fixed-above-menubar vs grid-`[bottom]`-track) is: [pick one]."*
This also de-risks the H.W3 author leaving a now-dead mobile `[stage]` track.

---

### F-W7-5 — `position: fixed` stage relies on an unguarded "no fixed-containing-block ancestor" invariant — **LOW** (add a lock to the gate)

**Location:** S1 (`:29`) + `proof:dock-zorder` (`:42`). S1 makes the stage `position: fixed;
inset: 0` and asserts it fills the dock-free band.

**Defect (live check):** `position:fixed` resolves against the nearest ancestor with a
`transform`/`perspective`/`filter`/`will-change`/`contain:paint|layout|strict|content` — if one
exists, `inset:0` fills THAT box, not the viewport, and the "always-visible full-bleed background"
silently breaks. I walked `.scene-host`→viewport live and found **zero such ancestors today** (so
S1 is feasible NOW), but this is a fragile, undocumented invariant: the cube/amiga scenes mount 3D
transforms INSIDE the stage, and any future wrapper that adds `transform`/`contain` to an ancestor
(a perf optimization, a glass surface) would regress it without tripping any gate.

**Concrete doc edit:** add a clause to `proof:mobile-single-page (a)` or `proof:dock-zorder`:
*"assert the fixed stage's `getBoundingClientRect()` equals the viewport rect (±2px) — proving no
ancestor established a fixed-containing-block; and grep-gate the stage's ancestor chain for
`transform`/`contain`/`perspective` introductions."* This locks the invariant S1 silently depends on.

---

### F-W7-6 — The "BESPOKE, so dogfood not HANDOFF" reasoning is correct, but the wave should acknowledge glass-ui 3.4.0 SHIPS a vaul-backed `Drawer` the demo ALREADY consumes — **LOW** (strengthen the in-scope justification against inv-16)

**Location:** §Provenance F2 (`:9`), §Design decisions (`:61`), §Folds glass-ui-HANDOFF (`:56`),
all asserting *"the drawer is BESPOKE — neither vaul-vue nor a glass-ui Sheet … so dogfooding
SpringProgress is in-scope (not a glass-ui-HANDOFF)."*

**Verification (node_modules, glass-ui 3.4.0):** the claim is TRUE **for the controls-pane drawer**
(`ControlsPaneWrapper.vue:147-155` is a hand-rolled CSS `0fr↔1fr` — no vaul). **But** glass-ui
3.4.0 DOES export a vaul-backed `Drawer`/`DrawerContent` (`node_modules/@mkbabb/glass-ui/dist/
components/ui/drawer/`, `vaul-vue ^0.4` is a glass-ui peerDep, `vaul-vue` is installed), and the
demo ALREADY consumes it in `ResponsiveSelect.vue:40-54,106-109` (`import { Drawer, DrawerContent
} from "@mkbabb/glass-ui"`). inv-16 says "consume glass-ui; HANDOFF the dock/specular." A skeptic
auth-reviewer will ask: *if glass-ui ships a Drawer with vaul physics, why is hand-rolling a
SpringProgress sheet in kf the idiomatic move rather than consuming `glass-ui Drawer` + a
HANDOFF for a spring prop?* The wave's answer (dogfood-as-mandate: the product IS a spring engine,
its own most-visible motion must be sprung by IT, and vaul's spring is foreign physics) is
DEFENSIBLE and correct — but the wave argues it from a FALSE-ADJACENT premise ("there is no glass-ui
Drawer to consume") rather than the TRUE one ("a glass-ui Drawer EXISTS and is consumed elsewhere,
but binding the demo's flagship structural motion to vaul's physics instead of the engine's own
SpringProgress would be the anti-dogfood — so this ONE surface is a deliberate kf-owned sheet, with
the glass-ui `DrawerContent spring` prop ask correctly BOOKed for ResponsiveSelect's drawer").

**Concrete doc edit:** in §Design decisions (`:61`) and the glass-ui-HANDOFF fold (`:56`), correct
the premise: *"glass-ui 3.4.0 DOES ship a vaul-backed `Drawer` (the demo consumes it in
`ResponsiveSelect.vue`). The controls-pane drawer is NOT that component — it is bespoke CSS — and we
keep it kf-owned ON PURPOSE: binding the demo's flagship structural motion to vaul's physics is the
anti-dogfood for a spring engine. The glass-ui `DrawerContent spring` prop ask (so the
ResponsiveSelect drawer could itself be sprung by the engine) is the correctly-BOOKed HANDOFF —
H.W7 has no dependency on it."* This makes the in-scope decision survive an inv-16 challenge.

---

### F-W7-7 — `useSheetSpring` colocation: the sheet is in the SHARED `@` tree, not the app-local `demo/app/` where `useSceneSwap` lives — **NIT** (placement precision)

**Location:** S2 (`:31`), §Goal (`:25`): *"a tiny `useSheetSpring(open)` composable colocated with
the sheet (mirrors `useSceneSwap.ts:45-50`)."*

**Defect:** `useSceneSwap.ts` lives in `demo/app/` (the cube app); the sheet
(`ControlsPaneWrapper.vue`) lives in the SHARED `demo/@/components/custom/animation-controls/
components/`. The controls pane is shared across ALL scenes, so `useSheetSpring` must live in the
shared `@` tree (e.g. alongside the wrapper or in `animation-controls/composables/`), NOT in
`demo/app/`. "Mirrors `useSceneSwap`" is right in PATTERN but the file must not land app-local.

**Concrete doc edit:** in S2, specify: *"colocate `useSheetSpring` in the shared controls subtree
(`animation-controls/components/` or `animation-controls/composables/`), NOT `demo/app/` — the
controls pane is scene-shared. It mirrors `useSceneSwap`'s SHAPE (a `SpringProgress` writing a
reactive scalar per frame), not its location."*

---

## Gate-bite scorecard (does each clause actually bite?)

| clause | bites? | evidence |
|---|---|---|
| `mobile-single-page (a)` stage `h ≥ 0.45·innerH` | **YES** | live `0.177` reds; harness `subjectRect('.scene-host')` + `openControlsPanel` exist (`demo-driver.mjs:148,232`) |
| `mobile-single-page (b)` open shifts stage ±0px | **YES (strongest)** | live shift = 591px (`y 78→669`) reds hard |
| `mobile-single-page (c)` both docks affixed | YES | locks SOTA; `position:fixed` live-confirmed |
| `dock-zorder` z + hit-test | YES | scene `z=auto` < dock `z=40` today (passes vacuously now — but the F1 `fixed` stage is the real test; add F-W7-5's containing-block lock) |
| `drawer-spring (a)` no CSS grid-rows transition | **bites BUT over-reaches** | see F-W7-1 — must scope to the sheet file |
| `drawer-spring (b)` settle `<350ms` + overshoot | **YES for the named preset** (198ms, ~11px) — **but reds if implementer uses `--spring-snappy`** | see F-W7-2 |
| `drawer-spring (c)` PRM single-frame snap | YES | `spring.ts` `respectReducedMotion`→`withReducedMotion` reads live `matchMedia` (`reduced-motion.ts:57`), Playwright `emulateMedia` drives it |

**Harness feasibility:** `serveDist`, `openControlsPanel`, `subjectRect`, `SCENES` all exist
(`scripts/lib/demo-driver.mjs`); `proof-lighthouse-mobile.mjs` already drives Playwright at a
mobile viewport. `proof:mobile-single-page`/`proof:drawer-spring` are buildable on real infra.
No non-existent API is assumed (SpringProgress, `springLinearStops`, `fromDuration`,
`respectReducedMotion` all verified in `src/animation/spring.ts` + `springLinearStops.ts`).

**Over-reach into ALREADY-SOTA:** only F-W7-1 (the unscoped grep). The docks (S3) are correctly
treated as untouched-consumed glass-ui. The desktop overlay model is correctly re-used, not rebuilt.

---

## Summary

- **No BLOCKER.** The architecture (fixed full-bleed stage + SpringProgress bottom sheet + deleted
  mobile stack) is SOUND and feasible on the current tree; the dogfood is well-precedented; the
  state evidence reproduces live; most gates bite.
- **HIGH ×2:** (1) `proof:drawer-spring (a)` grep is unscoped → false-reds/over-reaches into the
  ALREADY-SOTA `AnimationControlsControls.vue:295` crossfade H.W3 preserves — scope it to the sheet
  file. (2) the named preset (`r0.3/ζ0.8`, ≈198ms) passes the 350ms gate, but the wave also points
  at `--spring-snappy` (`r0.5`, ≈401ms) which RED-fails it — pin the exact construct, forbid the
  token bind.
- **MED ×2:** wrong scope path (`editor-shell/` → `animation-controls/components/`); the H.W3
  `[stage]` mobile track vs S1 `position:fixed` "one grid re-parameterized" contradiction needs a
  resolving design-decision.
- **LOW ×2 + NIT:** lock the fixed-containing-block invariant in the gate; correct the
  "no glass-ui Drawer exists" premise (3.4.0 ships one, consumed in ResponsiveSelect) to the true
  dogfood-not-vaul justification; place `useSheetSpring` in the shared `@` tree, not `demo/app/`.
