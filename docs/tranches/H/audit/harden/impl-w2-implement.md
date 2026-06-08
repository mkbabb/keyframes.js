# impl-w2-implement — H.W2 RESTORE THE DESIGN LANGUAGE (the IMPLEMENT lane)

The single coherent owner of the H.W2 surface decisions. The gestalt move landed:
the radial catch-light died at SOURCE (the glass-ui surface map STOPPED EMITTING
`glass-specular-track` because every kf-owned `<Card>` flipped to
`surface="cartoon"`), NOT via any `!important` / `display:none` neutralizer. The
manual `.glass-card` double-plate, the `transition-shadow` G2 hover anti-pattern,
and the duplicate demo `.scale-on-hover` are DELETED. One deliberately-glassy
panel (the cubic-bézier editor) keeps the iOS catch-light AND gains cartoon depth
via the S2-COMPOSITE recipe + a wired, calmed pointer seam.

**tsc:** `npx tsc --noEmit` → 0 after every step. **build:** `npm run gh-pages` →
built clean. **live:** demo-wide route sweep (cube/easing/spring/motion-path/
sequence/starting-style/amiga/square) — 0 kf-owned Cards emit a specular track,
0 `.glass-card` survivors, console 0 errors / 0 warnings. **NO git commit.**

---

## §0 — the kept-glass / composite decision (MY call, justified)

The composite host = the **cubic-bézier curve editor `<Card>`** in
`TimingFunctionPanel.vue` (shown when `timingFunction === "cubic-bezier"`).

WHY this panel, of all the kf-owned surfaces, is the one the user would most want
glassy: it is the demo's ONE **direct-manipulation** surface — the user drags the
bézier control points ON the card, editing the curve by hand. A cursor-tracked
catch-light reads as a *designed* iOS-glass "illuminate-under-your-fingertip"
affordance precisely on a surface you touch and drag; on a static form panel it
would just be decoration. It is also the surface D14 ("the glassy panels the user
LIKES") most naturally points at — the interactive editor framing. So it earns the
composite (cartoon DEPTH + a refined TRACKED catch-light TOGETHER); every other
kf-owned Card is a form/control panel that takes plain cartoon depth.

The steps editor sibling (`TimingFunctionPanel.vue:87`) is NOT the composite — it
is a static form panel → plain cartoon. This is a deliberate per-Card decision,
NOT a blanket apply (S2's caution honored).

---

## §1 — S1: the panel `<Card>` flips to `surface="cartoon"` (the 5 named + the footprint)

Each flip simultaneously (a) drops `glass-specular-track` at source
(`CardFooter:37` gates it on `surface==="glass"`), (b) drops the auto `shadow-card`
THIRD plate (same gate), (c) applies `cartoon-surface` (offset stamp + spring
hover-lift), and (d) deletes the manual `.glass-card` + `transition-shadow
duration-normal` in the SAME edit. The Card's own `glass-${tier}` still paints the
background/blur/border (it is emitted regardless of surface), so `.glass-card`'s
manual plate was pure redundancy.

The 5 contract-named panel Cards (the `proof:cartoon-is-panel-depth` set):

| # | file:line | before | after |
|---|---|---|---|
| 1 | `AnimationControlsControls.vue:3` | `class="… transition-shadow duration-normal glass-card"` | `surface="cartoon" class="w-full overflow-visible"` |
| 2 | `RibbonBar.vue:3` | `class="overflow-visible glass-card"` | `surface="cartoon" class="overflow-visible"` |
| 3 | `KeyframesEditor.vue:3` | `class="glass-card p-0 m-0"` | `surface="cartoon" class="p-0 m-0"` |
| 4 | `KeyframeTimeline.vue:3` | `class="… glass-card transition-shadow duration-normal", expanded?…` | `surface="cartoon" :class="['w-full overflow-visible', expanded?…]"` (expanded branch KEPT) |
| 5 | `AssetViewport.vue:12` (the never-enumerated 5th, WV-W2-HIGH-1) | `class="pointer-events-auto glass-card max-w-sm mx-6"` | `surface="cartoon" class="pointer-events-auto max-w-sm mx-6"` |

`CSSCodeEditor.vue:6` LEFT alone (already `cartoon-surface` — the C close, the
proof the register works).

---

## §2 — S2: the scene `plain` Cards + every other kf-owned `<Card>` (the FULL footprint)

`<Card plain>` is a NO-OP (glass-ui has no `plain` prop — VERIFIED, WV-W2-HIGH-2):
a `plain` Card stayed `surface="glass"` and KEPT emitting the orphan track. Every
such Card got an EXPLICIT surface decision and the dead `plain` attr was deleted in
the same motion. I ALSO swept TWO kf-owned `<Card>` sites the contract did not
enumerate but the re-scoped `proof:no-orphan-specular` ("every kf-owned `<Card>`")
binds (these would otherwise keep blooming):

| file:line | before | after | decision |
|---|---|---|---|
| `EasingSidebar.vue:14` | `<Card plain class="p-0">` | `surface="cartoon"` | cartoon (value-bar sub-card) |
| `EasingSidebar.vue:35` | `<Card v-if=… plain class="p-0">` | `surface="cartoon"` | cartoon (step-options sub-card) |
| `SpringSidebar.vue:4` | `<Card plain class="p-0">` | `surface="cartoon"` | cartoon (live-params) |
| `SpringSidebar.vue:60` | `<Card plain class="p-0">` | `surface="cartoon"` | cartoon (comparison) |
| `SpringSidebar.vue:81` | `<Card plain class="p-0 overflow-hidden">` | `surface="cartoon"` | cartoon (CSS editor) |
| `TimingFunctionPanel.vue:87` | `<Card plain>` (steps) | `surface="cartoon"` | cartoon (static form) |
| `MatrixEditor.vue:2` | `<Card>` (default glass) | `surface="cartoon"` | cartoon (matrix grid control) |
| **`AssetLayerPanel.vue:2`** (NET-NEW sweep — not in any contract list) | `<Card class="w-full overflow-hidden">` (default glass) | `surface="cartoon"` | cartoon (asset/layers control) |

Final state: **14 `<Card surface="cartoon">` demo-wide, 0 `<Card>` defaulting to
glass, 0 `plain` survivors.** (`grep '<Card' demo --include=*.vue | grep -v
surface=` → empty.)

---

## §3 — S2-COMPOSITE: the bezier editor composite (WV-W2-HIGH-3, the D14 ask)

`TimingFunctionPanel.vue:30` — the cubic-bézier editor Card:
`surface="cartoon" class="cartoon-specular glass-specular-track …"` +
`ref="bezierCardRef"` + `useSpecularPointer(() => bezierCardRef.value?.$el ?? null)`.

The Card prop API emits cartoon XOR specular, so the composite is a class
composition (the ONE place a demo class-composition is correct):
- `surface="cartoon"` → `cartoon-surface` depth, NO `shadow-card`.
- `glass-specular-track` (glass-ui's `@layer components` class, applied DIRECTLY in
  the template — see §6 the `@apply` finding) → re-adds the `::before` catch-light.
- `.cartoon-specular` (demo recipe) → `@apply cartoon-surface` (self-standing) +
  owns the refined intensity tune projected onto `::before`.

The Card root is a reka-ui `Primitive` (a `<div>`); its instance `$el` is that DOM
node — the composable's getter resolves it reactively on mount.

---

## §4 — S3: `useSpecularPointer` (the ONE DRY composable) + the intensity tune

NEW: `demo/@/composables/useSpecularPointer.ts` (the documented shared composable
home; `@composables/` alias → `demo/@/composables/`).

- (a) writes `--mouse-x` / `--mouse-y` as % of the host rect on `pointermove`
  (glass-ui's consumer seam, `glass-specular-track.css:19`); no-ops under
  `prefers-reduced-motion: reduce`; `useEventListener`/`watchEffect` auto-clean on
  scope dispose (leak-free).
- (b) the intensity TUNE (D14 "refined", gated kf-side — NOT BOOK-able): writes
  `--specular-rest` (0.22) / `--specular-hover` (0.4) on the host. The
  `.cartoon-specular` recipe PROJECTS them onto the pseudo's `--specular-intensity`
  (the registered prop is `inherits:false`, so the pseudo must own its value — the
  one structural seam). Magnitude single-sourced in the composable; the recipe's
  `var()` fallbacks (0.22/0.4) are the floor if a surface carries the recipe
  unwired. **DRY: one composable; the only opt-in surface in this footprint is the
  composite, so the tune lives in `.cartoon-specular` alone.**

Modern-web guidance consulted (`interactive-content-reveal`): the registered-
`@property` + `--mouse-x/--mouse-y` % + PRM-override pattern is exactly glass-ui's
existing build — pure consumption, zero new backdrop CSS (inv-16).

---

## §5 — S4: delete the duplicate demo `.scale-on-hover` (PRM caveat RESOLVED)

DELETED the `.scale-on-hover` base + `:hover` + PRM block from `design-idioms.css`
(was 171-190). The 13 call-sites now resolve glass-ui's `@utility scale-on-hover`
(IDENTICAL recipe, zero churn — VERIFIED in built CSS: `.scale-on-hover{scale:1;
transition:scale …}` + `:hover{scale:var(--scale-hover)}`, reading the demo's kept
`--scale-hover: 1.08` token).

**WV-W2-LOW-2 PRM bracket CONFIRMED:** glass-ui DOES ship a GLOBAL PRM bracket
(`utilities.css:1025-1036`): under `prefers-reduced-motion: reduce` it restricts
`transition-property` to `opacity, color, background-color, border-color,
box-shadow` on `*:not([data-allow-motion])` — `scale` is dropped, so the lift
applies INSTANTLY with no transition, the EXACT behaviour the demo's deleted
`transition: none` guard produced. The demo PRM block was therefore redundant, not
load-bearing — deleted with the base rule (the global bracket is the single
source). The false "defined demo-nowhere" framing in the file header is corrected.

---

## §6 — S6: the bare `<div class="glass-card">` (one depth idiom demo-wide)

Adopted option (a) — `glass-resting cartoon-surface` — for ALL 7 bare-div sites,
so ZERO `.glass-card` survives (the grep gate resolves to the empty set, even
cleaner than a NAMED-exception list; `.glass-resting` is glass-ui's complete tier
= bg + blur + border + position:relative; `cartoon-surface` overrides its shadow
with the offset stamp, exactly as `surface="cartoon"` Cards do):

| file:line | site kind | before → after |
|---|---|---|
| `EasingTarget.vue:4` | scene STAGE | `glass-card easing-target …` → `glass-resting cartoon-surface easing-target …` |
| `MotionPathTarget.vue:3` | scene STAGE | `glass-card …` → `glass-resting cartoon-surface …` |
| `SequenceTarget.vue:3` | scene STAGE | `glass-card …` → `glass-resting cartoon-surface …` |
| `SpringTarget.vue:4` | scene STAGE | `glass-card …` → `glass-resting cartoon-surface …` |
| `StartingStyleTarget.vue:9` | scene STAGE (`.stage`) | `stage glass-card …` → `stage glass-resting cartoon-surface …` |
| `EasingSidebar.vue:2` | sidebar wrapper | `glass-card p-3 grid gap-3` → `glass-resting cartoon-surface p-3 grid gap-3` |
| `SpringSidebar.vue:2` | sidebar wrapper | `glass-card p-3 grid gap-3` → `glass-resting cartoon-surface p-3 grid gap-3` |

**StartingStyleTarget hazard CHECKED:** the `@starting-style`/`allow-discrete`
`translate` animation lives on the INNER `.discrete-card`, NOT the outer
`.stage glass-card` — so cartoon-surface's `translate`/transition on the outer
stage does NOT collide with the discrete-transition primitive. Verified the outer
`.stage` has no transform rules of its own. The EasingTarget `<style scoped>`
comment that referenced `.glass-card` as the shared primitive is updated.

---

## §7 — WV-W2-LOW-1 (the NAMED focus-elevation delta)

Deleting `.glass-card` drops its `.glass-card:has(:focus-visible)` focus-elevation
rung (`glass.css:197`) that `cartoon-surface` does NOT replicate (its lift is
`:hover`-only). RE-APPLIED on the cartoon surface via a demo rule (NOT lost
silently):

```css
.cartoon-surface:has(:focus-visible) { box-shadow: var(--shadow-cartoon-lg); }
```

Descendant keyboard `:focus-visible` lifts the offset stamp to the `lg` rung (the
same elevation the hover-lift gives). Shadow-only (no `translate`) so it does NOT
displace portaled child content on focus (WV-W2-LOW-3 portal note). `:has()`
Baseline Widely available.

---

## §8 — live + computed-style verification (the gate biting-proof, pre-Gates-lane)

All measured on the running dev demo (`:5173`), per WV-W2-LOW-3 (storm-robust
COMPUTED `::before` check as PRIMARY):

- `proof:cartoon-is-panel-depth` — panel Cards + stages resolve `box-shadow ===
  var(--shadow-cartoon-md)` at rest (computed-equality VERIFIED on `easing-target`
  + 3 cube cards). Grows to `--shadow-cartoon-lg` on `:hover` (cartoon-surface) and
  on `:has(:focus-visible)` (the §7 delta).
- `proof:no-orphan-specular` — across cube/easing/spring/motion-path/sequence/
  starting-style/amiga/square: `tracksThatAreCards: 0`, `.glass-card: 0`. The 3–11
  remaining `.glass-specular-track` per route are ALL `<BUTTON>` (glass-ui Button
  glass variant — S5 territory, inv-16). The orphan radial is dead on every
  kf-owned Card demo-wide.
- `proof:cartoon-specular-coexist` — synthetic composite probe
  (`cartoon-specular glass-specular-track`): resolves BOTH `box-shadow ===
  --shadow-cartoon-md` AND, after `--mouse-x:30%/--mouse-y:70%`, a `::before`
  `radial-gradient(circle at 30% 70%, …)` (`--specular-x: 30%`, `--specular-y:
  70%` on the pseudo) — the TRACKED light, not the centered floor.
- `proof:specular-calm` — composite `::before` rest opacity = **0.22** (≤0.25);
  hover floor 0.4 (≤0.4). Overrides glass-ui's hot 0.35/0.6 by source order AND by
  the cascade-layer axis (demo rules are UNLAYERED; glass-ui's are `@layer
  components` — unlayered wins).
- `proof:no-dup-utility` — `grep -nE '\.scale-on-hover\s*\{' design-idioms.css` →
  none; `grep 'glass-card' demo | grep '<Card'` → 0. Built CSS: `scale-on-hover`
  resolves once, from glass-ui's `@utility`.
- console: 0 errors / 0 warnings after the full route sweep.

---

## §9 — S5 the glass-ui HANDOFFs (RECORDED — NOT patched in kf, inv-16)

Two glass-ui-owned specular asks, each to be PAIRED with a born-RED kf gate
(`proof:specular-handoff`) per the chronic-closure discipline — authored in
glass-ui's tranche, NOT here:

1. **the Card specular SEAM** — glass-ui's `<Card surface="glass">` bolts
   `glass-specular-track` (`CardFooter:37`) with NO pointer wire; it should either
   wire `--mouse-*` itself (as `dock.js` does) OR omit the track until a consumer
   opts in. PLUS a calmer DEFAULT (rest ≤0.25, radius ≤40% — the live `0.55` white
   core + `screen` blend + `0.35` rest is too hot as a default). The kf demo proves
   the calm tune is consumer-achievable TODAY (the `.cartoon-specular` recipe), but
   the DEFAULT is glass-ui's to ship.
2. **the dock-icon specular** — `dock-icon-button` hard-codes
   `glass-specular-track` (`dock.js:568`); the dock DOES wire `--mouse-*`, so this
   is a tuning/intensity ask (ties to D5 dock lag). Rides the dock-spring HANDOFF
   gate `proof:dock-morph-settled` (BLK-3: NOT `proof:dock-live`).

LIVE evidence the handoff is real: the 3–11 per-route `.glass-specular-track` hosts
that remain are ALL glass-ui `<BUTTON glass>` — unwired (`--mouse-x` empty), so they
still bloom centered on hover. kf cannot fix these without re-authoring glass-ui
(inv-16); they are the glass-ui-owned residue the born-RED gate polices.

---

## §10 — G2 honesty (WV-W2-MED-3 — MEASURE-FIRST, claim DEMOTED)

The cartoon swap REDUCES the per-frame hover paint (it drops `transition-shadow
duration-normal` over the blurred card and adds a compositor `translate`), but
`cartoon-surface:hover` STILL transitions `box-shadow` over the same backdrop — so
this is **REDUCES, NOT eliminates**. NO perf win is claimed here; no dpr=2 paint
bench was run (a `proof:hover-composite` clause would be needed to assert a win).
The specular `::before` is GPU-cheap + SOTA-built (G3) — its defect was perceptual
(a centered unwired bloom), not perf. RECORDED, not over-claimed.

---

## §11 — BINDING flag for the GATES lane (a vacuous-pass found)

`proof:idioms` (D.W2, `scripts/proof-idioms.mjs:153`) requires a DEMO-LOCAL
`.scale-on-hover` rule whenever `scale-on-hover` is referenced (it is, in 13
templates). After S4 the demo OWNS NO such rule (S4's whole point — consume
glass-ui's `@utility`). The gate currently passes ONLY because its loose regex
`/\.scale-on-hover\b/` matches the DELETION COMMENT text in `design-idioms.css`
(lines 12/83/177/178) — a VACUOUS pass that would red if the comment were reworded.

**ASK (Gates lane / H.W8):** retire or invert the `proof:idioms` `.scale-on-hover`
clause — S4 SUPERSEDES it: the correct invariant is "`scale-on-hover` resolves from
glass-ui's `@utility`, the demo contributes ZERO `.scale-on-hover` RULE" (that is
already what `proof:no-dup-utility`'s strict `/\.scale-on-hover\s*\{/` anchor
asserts — the two gates are now in direct contradiction, and `no-dup-utility` is
the correct one). Do NOT keep the comment as the gate's load-bearing match.

(`--scale-hover` token clause in `proof:idioms` is fine — kept demo-owned.)

---

## §12 — DO-NOT-TOUCH honored (red herrings fenced off)

- `design-idioms.css` `.progress-dot` (the `--dot-p` conic playing-ring, CS-4/A10)
  — UNTOUCHED.
- `.progress-rail` / `.progress-ball` / `.status-badge` / `.code-token`
  consolidations + the z-contract (ALREADY-SOTA) — UNTOUCHED.
- the specular `::before` BUILD (GPU-cheap, SOTA, G3) — consumed as-is, only the
  consumer-writable intensity tuned + the consumer seam wired. No perf claim.

---

## §13 — files changed (16 M + 1 new; NO engine/lib/test/CI source)

Cards flipped to cartoon (13): RibbonBar, AnimationControlsControls,
KeyframesEditor, KeyframeTimeline, AssetViewport, AssetLayerPanel, MatrixEditor,
EasingSidebar(×2), SpringSidebar(×3), TimingFunctionPanel steps. Composite (1):
TimingFunctionPanel bezier. Bare-div → `glass-resting cartoon-surface` (7):
EasingTarget, MotionPathTarget, SequenceTarget, SpringTarget, StartingStyleTarget,
EasingSidebar wrapper, SpringSidebar wrapper. CSS recipes/deletions:
`design-idioms.css` (.scale-on-hover DELETED, .cartoon-specular + intensity tune +
.cartoon-surface:has(:focus-visible) ADDED, header corrected). NEW:
`demo/@/composables/useSpecularPointer.ts`.
