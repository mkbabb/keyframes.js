# Tranche H DEEP harden — lane `hd-w4`

**Charge:** the SUBSTANTIVE adversarial attack on **H.W4** (easing-canvas container-query
ceiling + hero φ-mega bump + icon-sizing `@utility` idiom + the `proof:phi-leaf-zero`
chronic gate). Is each fix CORRECT + FEASIBLE? does each gate genuinely BITE? does any
wave over-reach into ALREADY-SOTA or assume a non-existent API?

**Method:** read `waves/H.W4.md`, `H.md §H.W4`, `a-easing-editor`, `a-hero-typography`,
`a-styling-idioms §1`, `a-deferred-chronic`, `_SYNTHESIS-deferred-ledger`. Verified
glass-ui 3.4.0 in `node_modules` (typography.css ladder + `.text-hero`), ran
`modern-web-guidance` (`fluid-scaling` + `size-aware-styling`, both cited by the wave),
drove the live demo at `:5173` with Playwright (1440×900), and empirically tested the
`@apply size-N`-over-SVG-attr override and the `line-height:0.92` clip risk in the page.

**VERDICT: the architecture is SOUND and FEASIBLE.** All four named APIs/features exist
and are correctly characterised: `.text-display-mega` ships (peak 177px, `text-wrap:
balance`), `.text-hero` is `white-space:nowrap` (the wave's "do NOT use" guard is
correct), container queries are Baseline Widely-available 2023-02-14, Tailwind v4.3.0
`@utility` is the right form, and CSS author rules DO override the SVG `width="24"`
presentation attr (proven live). The `38cqi` clamp math is sound and bounds the canvas in
every layout state. **But there are real defects: one HIGH (the `proof:phi-leaf-zero`
"37 raw rungs" count contradicts the gate's own `ui/`-exclusion — the BITE narrative
cites a number the gate cannot produce), two MED (the icon `@utility` does not visually
size wrapper-component callsites like `CopyButton`; the `proof:easing-canvas-bounded`
`blockSize<=280` clause can pass vacuously in narrow-rail layout states), plus an
under-specified S3↔H.W6 ellipsis-fold sequencing coupling and an `@utility`-vs-`.class`
authoring imprecision.** No BLOCKER.

---

## Findings

### HD-W4-1 — `proof:phi-leaf-zero`: the "37 raw rungs" BITE narrative contradicts the gate's own `ui/` exclusion `[HIGH]`

**Location:** `H.W4.md:42,45,366` (the `proof:phi-leaf-zero` gate + the §Mandate-bar +
the H.md gate row); provenance `a-deferred-chronic.md:62,113`, `_SYNTHESIS-deferred-
ledger.md:107`.

**Defect.** The gate text (`H.W4.md:42`) defines the sweep half as: zero raw rungs
`grep -rno "text-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)"` + zero bare `font-size:\s*\d` in
`demo/{@,app,easing,spring,sequence,motion-path}/**/*.{vue,css}` **"(excl. `/dist/`,
vendored `ui/`, `.svg` viewBox) = 0"**. But its BITE clause asserts: *"the 37 surviving
raw rungs that 'exited' the ledger at issue-close red it"* — and the §Mandate-bar
(`:45`) + the H.md row (`:366`) repeat "37 raw rungs today." **These two are mutually
inconsistent.** Live grep on `tranche-h-dev` (`:5173` tree), with the `ui/` exclusion the
gate itself stipulates:

```
$ grep -rEoh "\btext-(xs|sm|...|9xl)\b" demo/{@,app,easing,spring,sequence,motion-path}
    --include=*.{vue,css} | grep -vE "/ui/|/dist/"     →  1   (AnimationMenuBar.vue:102 text-xl = L1)
$ grep -rEn "font-size:\s*[0-9]" ... (same exclusions, excl .svg sub-px) →  1  (MotionPathTarget.vue:119 font-size:1.25rem = L2)
```

The hand-authored leaf-tail with `ui/` excluded is **exactly L1 + L2 (= 2)**, NOT 37 —
which is precisely what `a-hero-typography.md:147-166` found ("the only open leaf-tail is
L1+L2"). The **"37"** materialises ONLY if the vendored `demo/@/components/ui/` shadcn
primitives are counted (they carry dozens of `text-sm` in `MenubarItem`, `MenubarLabel`,
etc.). So the gate is in a contradiction:
- **If `ui/` is excluded** (as the gate's own clause says) → the sweep half reds today on
  only 2 rungs, not 37; the "37 survivors red it" BITE is a phantom (the number is wrong,
  the gate over-claims its own teeth).
- **If `ui/` is counted** (to reach 37) → the gate can NEVER go green: this wave sweeps
  L1+L2 only and does not touch the vendored shadcn `text-sm`; `proof:phi-leaf-zero` would
  stay RED forever and block the φ-hero chronic closure (CH-2/M1) the H.W8 meta-gate cites
  by name — a self-inflicted unsatisfiable chronic gate.

The root: the wave inherited "37" verbatim from `_SYNTHESIS-deferred-ledger.md:107` /
`a-deferred-chronic.md:62` (which grepped WITHOUT the `ui/` exclusion) but then pasted the
corrected `(excl. … ui/ …)` scope from `a-hero-typography`. The two halves were never
reconciled.

**Concrete doc edit.** In `H.W4.md:42`, `:45`, and `H.md:366`, replace every "37 raw
rungs" with **"2 raw rungs (L1 `text-xl` @ `AnimationMenuBar.vue:102` + L2 `font-size:
1.25rem` @ `MotionPathTarget.vue:119`)"** and the BITE line to *"L1+L2 red the sweep half
today; greens once S4 sweeps both."* Then propagate the correction upstream:
`_SYNTHESIS-deferred-ledger.md:107` and `a-deferred-chronic.md:62,113,164 (DC-3)` must
either add the same `ui/` exclusion (→ "2", not "37") OR explicitly state the 37 is the
*ui/-inclusive* figure and is NOT the gate's target (the gate target is the 2 hand-authored
rungs). The authoritative reconciliation is `_SYNTHESIS-gap-scorecard` (per the harden
mandate) — confirm its φ-row matches the corrected "2/L1+L2", not "37".

---

### HD-W4-2 — `@utility icon-* { @apply size-N }` does NOT visually size wrapper-component callsites (CopyButton) `[MED]`

**Location:** `H.W4.md:34` (S4) + `H.md:365` (S4); the design decision at `H.W4.md:58`
("the icons finally differentiate `xs<sm<md<lg`").

**Defect — feasibility gap, verified live.** The empirical test I ran (`:5173`, injected
`.icon-sm{width:20px}` with NO `!important`) PROVES a CSS author rule overrides Lucide's
`<svg width="24">` presentation attribute (rectW 24→20) — so for the **direct-SVG**
callsites (`<ArrowLeft class="icon-sm"/>`, `<Pause class="icon-lg"/>`, `<Share2
class="icon-lg"/>`, `<ChevronUp class="icon-lg"/>` …) the `@utility … @apply size-N`
family DOES differentiate. **But not for wrapper-component callsites.** At
`TimingFunctionPanel.vue:28` the class is on a *component*, not an SVG:
`<CopyButton class="scale-on-hover icon-md" .../>`. `CopyButton.vue:2` is a `<button>`
wrapping `<Clipboard class="clipboard">` (a Lucide SVG with its own `width="24"`). `@apply
size-5` would set `width/height` on the `<button>` box — it does **not** cascade to the
inner SVG (the SVG keeps its `width="24"` attr), so that icon stays 24px while sibling
direct-SVG icons resize. `proof:icon-idiom`'s "computed assert that the four sizes
differentiate" can therefore PASS on direct SVGs while a CopyButton/wrapper instance
silently stays 24px — a partial-bite, and the design-decision claim "the icons finally
differentiate" is not uniformly true as written.

**Concrete doc edit.** In S4 (`H.W4.md:34`), make the `@utility` shape cascade into nested
SVGs and state the wrapper caveat: `@utility icon-md { @apply size-5; } @utility icon-md
{ & svg, &:is(svg) { @apply size-5; } }` — or simpler, `@utility icon-md { @apply size-5;
[&_svg]:size-5 }` so a class on a `<button>`/component wrapper sizes BOTH the box and the
descendant glyph. Add a clause to `proof:icon-idiom`: the four-size differentiation assert
must sample at least one WRAPPER callsite (CopyButton) AND one direct-SVG callsite, so the
gate bites the wrapper case (otherwise it greens on direct SVGs while CopyButton stays
24px). (Alternatively: re-rung the CopyButton callsites to size their inner SVG directly —
but the cascade form is DRY-er and survives future wrapper additions.)

---

### HD-W4-3 — `proof:easing-canvas-bounded` `blockSize<=280` can pass vacuously in narrow-rail layout states `[MED]`

**Location:** `H.W4.md:40` (the `proof:easing-canvas-bounded` clause); the born-RED claim
"`blockSize` is 680 … reds TODAY."

**Defect — the bite is layout-state-dependent, not invariant.** The audit measured the
EasingSidebar canvas at **680×680** (sidebar 724px wide → `aspect-ratio:1` square). I
confirmed the large state live (screenshot `hd-w4-hero-1440.png`: the curve canvas eats
~615-640px of the EasingSidebar panel). BUT in a transient/narrow-rail render I also
measured the SAME `.easing-curve-canvas` at **278×278** (`blockSize:278px`) — already
≤ 280 **before any fix**. The canvas width is driven by whatever column the sidebar is
granted, which is exactly the lopsided/variable layout H.W3 is fixing. So the
`blockSize <= 280` clause is NOT a stable born-RED: in a narrow layout state it can read
≤280 today and pass vacuously, defeating the §Mandate-bar's "none passes vacuously"
promise. The clause that genuinely bites independent of layout state is the **container-
context** clause (`containerType === 'inline-size'`, today `normal` everywhere — I
confirmed this on the live DOM walk) and the **panel-height ratio** clause (`canvas <=
0.55 of panel height`, today 77%).

**Concrete doc edit.** In `H.W4.md:40`, demote `blockSize <= 280` from the lead/sole RED
to a *post-fix ceiling* clause, and promote the two layout-invariant clauses to the
born-RED anchors: (1) `getComputedStyle(editorRoot).containerType === 'inline-size'` (RED:
`normal` today — invariant, no layout dependence), and (2) the panel-height ratio `<= 0.55`
(RED: 0.77 today). Add a measurement-protocol note: the 680px born-RED MUST be captured on
the *dedicated `#/easing` EasingSidebar full-rail render at 1440×900* (where the audit got
724px), NOT the narrow TimingFunctionPanel detail-panel context — and the route must be
settle-gated on the FSM (H.W1) first, because the D12 route storm (verified live below)
makes the EasingSidebar measurement non-deterministic.

---

### HD-W4-4 — S3 folds the orphaned `...` into the title run, but the `dot-fade` mechanism is H.W6's — the fold-vs-mechanism sequencing is under-specified `[MED]`

**Location:** `H.W4.md:33` (S3) + `:60` (the H.W6 coordination design decision) +
`a-hero-typography.md:107-124` (F1).

**Defect — a coupling the DAG names but the WHAT does not resolve.** Live source
(`EditorStartScreen.vue:8-20`): the title is one `<AnimatedText :text="title">` in a
`<div>`, and the ellipsis is a SECOND `<AnimatedText class="dot-fade depth-text"
:text="ellipsis">` in its own `<div>`; the `<h1>` is `text-display-4 grid p-0 lg:flex`.
S3 says to "append the ellipsis as a trailing inline `<span>`/word of the single
AnimatedText run, drop the second `<div>`, collapse `grid p-0 lg:flex` to a plain block."
But the ellipsis carries `dot-fade` — the per-dot fade *mechanism H.W6 owns and reworks*
(`H.md:274-282`: H.W6 makes `.typing-dots` a 3-span staggered primitive dogfooding
`steppedEase`, decoupled from `lift-down`). If H.W4 folds the ellipsis INTO the title's
single `AnimatedText` run, then either (a) `dot-fade` now applies to the whole merged
title+ellipsis run (fading "Select an animation…" as a unit — a regression), or (b) the
fold must already know H.W6's new `.typing-dots` markup shape to keep the dots as a
distinct staggered sub-run. The wave asserts "this wave owns the hero LAYOUT coupling,
H.W6 owns the dot-fade MECHANISM" — but a *layout fold that merges the runs* is not
mechanism-orthogonal; it determines whether H.W6's per-dot primitive even has a host
element to attach to.

**Concrete doc edit.** In S3 (`H.W4.md:33`), specify the fold target precisely: the
ellipsis stays a SEPARATE trailing element inside the now-plain-block `<h1>` (NOT merged
into the title's `AnimatedText` run) — i.e. drop the outer flex/grid so the two runs sit
on ONE optical block, but keep the ellipsis as its own inline `<AnimatedText>`/`<span>`
host so H.W6's `.typing-dots` 3-span primitive has its mount point. Add an explicit
ordering note: if H.W4 lands before H.W6, the ellipsis keeps `dot-fade` (still RED-on-
mechanism, that's H.W6's gate); H.W4's `proof:hero-balance` asserts only the *layout*
(one optical block, no orphan row), not the dot cadence. State that S3 must NOT collapse
the ellipsis into the title `AnimatedText` `:text` string (that would make `split(/\s+/)`
at `AnimatedText.vue:62` treat "animation…" or "…" per H.W6's own root-cause find).

---

### HD-W4-5 — S4 says define the icon `@utility` "beside the other owned utilities," but design-idioms.css uses plain `.class` selectors, never `@utility` `[MED → authoring]`

**Location:** `H.W4.md:34` (S4: "define ONE icon-sizing idiom in `design-idioms.css`
beside the other owned utilities — `@utility icon-xs { @apply size-3.5 } …`").

**Defect — misdescribes the file.** Live: `grep "@utility" demo/@/styles/design-idioms.css`
→ **NONE.** The file's "other owned utilities" are all plain class selectors:
`.scale-on-hover` (:177), `.progress-dot` (:258), `.text-gold` (:165), `.gold-shimmer`
(:201), `.focus-ring` (:155), etc. `@utility` is glass-ui's idiom (`utilities.css:680
@utility scale-on-hover`), NOT the demo file's. So "beside the other owned utilities" with
an `@utility` body is internally inconsistent — the icon family would be the FIRST
`@utility` in design-idioms.css, sitting *unlike* its neighbours. (`@utility` IS valid in
Tailwind v4.3.0 — confirmed `"tailwindcss": "^4.3.0"` — and is arguably the better form for
a utility that should respond to variants; this is not a feasibility blocker, only an
authoring-accuracy defect.)

**Concrete doc edit.** In S4, either (a) keep `@utility` but drop "beside the other owned
utilities" → say "introduce the FIRST `@utility` family in design-idioms.css (Tailwind v4
form; the existing `.class` idioms predate the demo's v4 `@utility` adoption — this is the
idiomatic upgrade)," OR (b) match the file's existing idiom and use a plain selector
`.icon-sm { width: 1rem; height: 1rem } …` consistent with `.scale-on-hover` et al. Prefer
(a): `@utility` is the modern v4 idiom and composes with state variants, and per HD-W4-2
the body should cascade into nested SVGs. Whichever is chosen, the `proof:icon-idiom`
"resolves to a `design-idioms.css` definition" assert must match the chosen selector shape.

---

### HD-W4-6 — D12 route storm poisons H.W4's hero + easing measurement; the DAG note is right but should be hardened to a settle-gate dependency `[LOW]`

**Location:** `H.W4.md:3` (DAG-deps), `:45` (the gates assert "exact live measurements").

**Observation (live, verified — not a doc-internal defect, a measurement-feasibility
note).** Driving `:5173` with Playwright, EVERY attempt to measure `#/easing` or `/`
stormed away mid-evaluate: `#/easing → #/cube?anim=Rotations → #/amiga → #/cube → cube#/
easing?anim=Easing+Preview` (a malformed double-path), with intermittent console errors
(0→1→3). This is D12 (H.W1's keystone) live and severe. Consequence for H.W4: the
gates `proof:hero-rung`, `proof:hero-balance`, `proof:hero-cls`, and `proof:easing-canvas-
bounded` ALL require a STABLE resting route (`/` for the hero, `#/easing` for the canvas).
Until H.W1 lands, these gates cannot be measured deterministically — a hero screenshot
diff taken mid-storm captured the EasingSidebar, not the home hero (`hd-w4-hero-1440.png`).

**Concrete doc edit.** `H.W4.md:3` already says "BEST SEQUENCED AFTER H.W3"; add an
explicit **measurement** dependency: "the φ-hero + easing-canvas gates settle-gate on the
H.W1 FSM resting (the D12 route storm — verified live, `#/easing→#/cube→#/amiga` within
one rAF — makes the home-hero and EasingSidebar measurements non-deterministic; the gates
poll until `proof:no-route-storm` holds before asserting)." This mirrors how H.W3's gates
already "settle-gate on the FSM resting" (`H.md:348`).

---

## Items checked and found SOUND (no defect — honest empty slots)

- **`.text-display-mega` exists and is correctly characterised.** glass-ui 3.4.0
  `typography.css:121,201-210`: `--type-display-mega: clamp(5.382rem, 4rem+9vw, 11.089rem)`
  (peak 177px), `@utility text-display-mega` carries `text-wrap: balance`, inherits
  `--font-display`/`--font-display-weight`/`--type-tracking-tight`/`--type-leading-display`
  (1.1) — ZERO new declarations needed, exactly as S3 claims. Probed live: the token
  resolves (177.4px @1440). **NOT a non-existent API.**
- **`.text-hero` IS `white-space:nowrap`** (`typography.css:171-187`, +`text-wrap:nowrap`)
  — the wave's "Do NOT use `.text-hero`" guard (`H.W4.md:33`) is CORRECT; a 3-word English
  hero would overflow. Sound.
- **Container queries / `cqi` / `block-size:clamp(160px,38cqi,280px)` is the idiomatic,
  Baseline-correct fix.** `modern-web-guidance` `fluid-scaling` + `size-aware-styling`
  (the two the wave cites): container queries Baseline Widely-available since 2023-02-14;
  `cqi` resolves off the nearest `container-type` ancestor and needs NO `@container` rule;
  `clamp()` is the prescribed constraint. The canvas (`EasingSidebar.vue:4` direct child of
  `.glass-card`; `TimingFunctionPanel.vue:38` inside the `Card plain` wrapper) WILL have
  the declared container as an ancestor → `cqi` resolves. `container-type:inline-size`
  contains only the inline axis, so the canvas's `aspect-ratio` + clamped `block-size` does
  NOT create a self-reference loop, and the SVG (normalized `viewBox`, no %-height from the
  ancestor) is unaffected. **No fallback owed** (Baseline 2023) — the wave's claim holds.
- **`38cqi` math is sound and bounds the canvas in EVERY layout state.** `clamp(160,38cqi,
  280)`: pins 160 below ~421px container, scales 160→280 across 421→737px, pins 280 above
  737px. At the audit's 724px sidebar → 275px (≈ the ≤280 target); at a narrow 322px rail →
  160px. Bounded either way. The `38cqi` is a single justified magic number (named delta).
- **CSS author rules override the SVG `width="24"` presentation attr — S4 is feasible for
  direct SVGs.** Proven live: `.icon-sm{width:20px}` (NO `!important`) took the icon 24→20.
  (The wrapper-component caveat is HD-W4-2, not a refutation of the mechanism.)
- **`line-height:0.92` will NOT clip Instrument Serif.** The optional scoped delta (S3) is
  safe: "Select an animation" has NO descenders; glass-ui's own SOTA `.text-hero` runs an
  even tighter 0.84 (`typography.css:174`); the hero has `mt-28` (112px) clearance above;
  and the Capsize fallback (`style.css:80-87`, ascent-override 96.67%) keeps ascenders
  within the box. Live test at mega+0.92: h1 = 326px (2 lines × 163px line box), no
  viewport overflow (right edge 1416 < 1440). The wave's "optional" framing is correct.
- **`proof:hero-rung` regex is safe.** "text-display-mega" does NOT false-match the
  forbidden `text-\d?xl` / `text-[Npx]` patterns (verified: `echo text-display-mega |
  grep -E "text-[0-9]?xl"` → no match). The gate's positive class assert is well-formed.
- **The icon-no-op find is exactly 61 (34/13/11/3) and `anyIconRuleInStylesheets:false`.**
  Live grep + live stylesheet scan both confirm `a-styling-idioms §1` precisely. The
  `proof:icon-idiom` resolve-or-red shape is correct (subject to HD-W4-2's wrapper caveat).
- **The double-chrome + `text-heading` header + EasingSidebar-no-header claims are exact.**
  `TimingFunctionPanel.vue:17` `<Card plain class="grid gap-0 ... p-0">` → `:18 CardHeader
  ...pb-1` → `:19 CardTitle class="text-heading">cubic-bézier` → `:37 CardContent p-0 ...
  gap-2` → `:38 EasingCurveCanvas` (a bordered wash GlassPanel). EasingSidebar
  (`EasingSidebar.vue:2`) has no title element (only the `ease` value `<Input>` at :16-22).
  S2/Fix-2/Fix-3/Fix-4 are accurately targeted.
- **The wave does NOT over-reach into ALREADY-SOTA.** It explicitly RECORDs (not touches)
  the φ-ladder mechanism + Capsize fallback + `depth-text` + bezier-drag interaction
  (`H.W4.md:23,52`); RC-5 `viewBox` recompute is correctly held MEASURE-FIRST behind
  `proof:bezier-drag-frame-budget` (not asserted). inv ε is honoured.

## Cross-wave coordination note (not a W4 defect, flag for the synth)
`TimingFunctionPanel.vue:3` root carries `class="col-span-2 ..."` — one of the classes
H.W3's `proof:demo-shell-grid` grep-gate forbids ("zero `col-span-2` survive"). H.W4 §S2
notes the `:78 grid-cols-[auto_1fr]` is folded into H.W3 but does NOT mention this `:3
col-span-2`. Confirm H.W3 owns its removal so the two waves do not collide on this file.

---

## Severity roll-up
| ID | Severity | One-line |
|----|----------|----------|
| HD-W4-1 | **HIGH** | `proof:phi-leaf-zero` "37 raw rungs" contradicts its own `ui/` exclusion (live = 2 = L1+L2); gate is either over-claiming or unsatisfiable |
| HD-W4-2 | MED | `@apply size-N` sizes wrapper boxes (CopyButton), not inner SVGs → icon family does not differentiate wrapper callsites; cascade into nested svg + gate a wrapper sample |
| HD-W4-3 | MED | `proof:easing-canvas-bounded` `blockSize<=280` passes vacuously in narrow-rail states (live 278px today); anchor born-RED on containerType + panel-height ratio |
| HD-W4-4 | MED | S3 ellipsis fold vs H.W6 `dot-fade` mechanism under-specified; keep ellipsis a separate inline host, do not merge into the title AnimatedText run |
| HD-W4-5 | MED | S4 "@utility … beside the other owned utilities" — design-idioms.css has NO `@utility`, only `.class`; reconcile the wording/form |
| HD-W4-6 | LOW | D12 route storm (verified live) poisons hero/easing measurement; harden the DAG note to a settle-gate dependency on H.W1 |

No BLOCKER. The wave's three-rung architecture, every named glass-ui/modern-web API, the
`38cqi` math, the `@apply`-over-SVG-attr mechanism, and the `line-height:0.92` safety all
hold. The defects are gate-bite precision (HD-W4-1/2/3), one sequencing under-spec
(HD-W4-4), and authoring accuracy (HD-W4-5/6).
