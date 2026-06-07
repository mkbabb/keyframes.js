# Harden lane `hd-live-hero-dots` — LIVE re-verify D6/D7 + born-RED anchor check (H.W4 / H.W6)

**Charge:** at `/` (home start screen) re-measure the hero font-size (the 86px) + φ
class (D7) and the typing-dots substrate (one span, the ghost window) (D6). Screenshot.
Confirm the born-RED anchors in H.W4 and H.W6 actually bite on the live tree.

**Method:** Playwright MCP against the running demo (kf 4.1.0 + Tranche G, the pre-H
state). The start screen is brutally transient — the app redirects to
`/#/easing?anim=Easing+Preview` (or `/#/cube?anim=Rotations`) within ~1 rAF of any
navigation (the D12 redirect), so a plain screenshot lands on the scene, not the hero. I
captured the hero by setting `location.hash='#/'` and rAF-polling for `h1.text-display-4`
inside ONE `browser_evaluate`, grabbing the structure at elapsedMs 7–10ms before the
redirect swaps it out. All numbers below are from that clean pre-redirect frame at the
stated viewport. Cross-checked source (`AnimatedText.vue`, `EditorStartScreen.vue`,
`AnimationMenuBar.vue:102`, `MotionPathTarget.vue:119`), the two audit lanes, the
authoritative `_SYNTHESIS-gap-scorecard.md`, and `node_modules/@mkbabb/glass-ui@3.4.0`.

---

## VERDICT

The D6 and D7 live anchors that H.W4/H.W6 are built on are **REAL and reproduce exactly**.
Every load-bearing number the two waves cite is confirmed within sampling variance, the
glass-ui APIs the fixes depend on exist, and the gates bite on the live tree. The born-RED
anchors are sound.

**One MED precision defect** in H.W4's stated MECHANISM for the orphaned `...` (it blames
flex-wrap; live the host is `display:grid` even at `lg`, so the cause is grid-row stacking
— the prescribed FIX is robust to this, only the diagnosis is imprecise). **One LOW** on
the `proof:phi-leaf-zero` "37 raw rungs" figure (the gate's grep as written is
under-scoped vs. the live tree — flagged for the W4-deep lane, not load-bearing for the
hero anchor). Everything else: AUTHORING SOUND.

---

## D7 — hero φ-typography (H.W4 S3 / `proof:hero-rung` / `proof:phi-leaf-zero` rung-half)

### CONFIRMED born-RED (live, `/#/`, 1440×900, pre-redirect frame)

| Anchor (wave claim) | Live measurement | Verdict |
|---|---|---|
| hero `<h1>` `font-size` = 86px on middle rung | **86.112px**, class `text-display-4 grid p-0 lg:flex` | ✓ exact |
| `--type-display-4` = `clamp(3.33rem, 2.5rem + 4vw, 5.382rem)` | resolves to that string | ✓ exact |
| `--type-display-mega` = φ^(9/2), 177px @1440 | **177.424px** (probe), token `clamp(5.382rem, 4rem + 9vw, 11.089rem)` | ✓ exact |
| `.text-display-mega` utility compiled | probe of `class="text-display-mega"` → 177.424px @1440 / 99.1px @390 | ✓ exact (wave's "~94px mobile" ≈ live 99px @390) |
| `text-wrap: balance` present | `textWrap: "balance"` | ✓ |
| `--type-display-5` fallback rung = 110px | 109.7px @1440 (probe `text-display-5` → 79.4px @390) | ✓ |

`proof:hero-rung` (H.W4:41) asserts `font-size ≥ --type-display-mega` AND a φ
`text-display-*` class. Live: 86.112px < 177.424px on `text-display-4` → **reds today,
greens only on the mega bump.** The gate bites.

### FEASIBILITY — confirmed against glass-ui 3.4.0 (installed)

- `@utility text-display-mega` exists: `node_modules/@mkbabb/glass-ui/dist/styles/typography.css:201`,
  `font-size: var(--type-display-mega)` at `:203`, token at `:121`. **S3's one-class swap
  is API-real.**
- The wave's "do NOT use `.text-hero`" guard is correctly grounded: `.text-hero` is
  `white-space: nowrap` at `typography.css:186` (for single-token numeric posters). A
  3-word English hero WOULD overflow. The named distinction holds.
- `depth-text` (the cartoon-shadow idiom the hero already dogfoods) exists at
  `utilities.css:231` — H.W4's ALREADY-SOTA note is correct.

### FINDING HD-1 (MED) — H.W4 mis-diagnoses the orphaned-`...` cause as flex-wrap; live it is grid-row stacking

- **Location:** `H.W4.md:20` (§state) and the §Goal/S3 prose; mirrored softer in
  `a-hero-typography.md:109,115-116` (F1 root-cause).
- **Wave text:** "with `lg:flex` on the `<h1>` it is meant to sit inline but live it
  **WRAPS to a second line below the headline**" (H.W4:20); F1 root-cause: "the
  two-`<div>` + `grid`/`lg:flex` host can't keep the ellipsis inline **once the headline
  balances to two lines**."
- **Live reality:** the `<h1>` computes **`display: grid`** even at innerWidth=1440 where
  `window.matchMedia('(min-width: 1024px)').matches === true`. The `lg:flex` utility does
  NOT win the cascade — the unprefixed `.grid` is emitted after the `lg:flex` media rule in
  the Tailwind-v4 output (equal specificity → source order → `.grid` wins). Measured
  `gridTemplateRows: "94.7188px 94.7188px"` (two equal grid rows). The title occupies row 1
  (rect top 96 → bottom 191, a single 95px line at lh 94.7) and the ellipsis occupies row 2
  (rect top 191 → bottom 285). So the `...` is on its own row because it is a **separate
  grid item / grid row**, NOT because flex ran out of inline space and wrapped, and NOT
  contingent on the title balancing to two lines (the title is one line here). At 390px
  (`lg` false → `grid` correctly applies) the same two-row stack appears
  (`gridTemplateRows: "122.312px 61.1562px"`).
- **Why it matters (adversarial):** a gate author reading "it wraps under flex" may try to
  fix it by tweaking flex (`flex-wrap`, `min-width`, gap) — which would do NOTHING, because
  flex never runs. The actual lever is: the host is a 2-row grid of two `AnimatedText`
  divs. The GOOD news: H.W4 S3's prescribed fix — "fold the second `<AnimatedText>` div
  into the SAME run … drop the second `<div>`, collapse the `grid p-0 lg:flex` host to a
  plain block" — removes BOTH the grid AND the second item, so it lands regardless of the
  mis-diagnosis. The defect is the WRITTEN MECHANISM, not the fix.
- **Concrete doc edit:** in `H.W4.md:20` replace "with `lg:flex` on the `<h1>` it is meant
  to sit inline but live it WRAPS to a second line below the headline" with: "the `<h1>`
  computes `display:grid` even at `lg` (the unprefixed `.grid` beats `lg:flex` in
  Tailwind-v4 source order — verified live: `gridTemplateRows: 94.72px 94.72px` at 1440),
  so the two `AnimatedText` `<div>`s stack as two grid ROWS — the title on row 1, the
  orphaned `...` on row 2 (it is a separate grid item, not a flex wrap)." In the §Goal/S3
  rationale, reframe "fold … so it balances to two lines" — the fold's job is to collapse
  the 2-row grid into one inline run, which is what S3 already prescribes. Mirror the same
  correction at `a-hero-typography.md:115-116`.

### FINDING HD-2 (LOW) — `proof:phi-leaf-zero` "37 surviving raw rungs" figure is under-scoped vs the live tree

- **Location:** `H.W4.md:42,45` (`proof:phi-leaf-zero` BITE + §Mandate bar) — "the 37
  surviving raw rungs that 'exited' the ledger"; the grep as written:
  `grep -rno "text-(xs|sm|base|lg|xl|2xl|4xl|6xl|8xl)"` over
  `demo/{@,app,easing,spring,sequence,motion-path}/**/*.{vue,css}` (excl. `/dist/`,
  vendored `ui/`, `.svg` viewBox).
- **Live count:** running the gate's own pattern over those roots (excluding `/ui/` and
  `.svg`) returns **153 `text-(xs|sm|…)` hits + 65 bare `font-size:N`**, not 37. The "37"
  is the deferred-ledger's residual count, but the grep as literally specified catches far
  more (it sweeps the whole `demo/@` shared tree, including `ui/`-adjacent custom
  components and many JUSTIFIED control-glyph rungs the ledger never counted as φ-hero
  defects).
- **Why it matters:** this is NOT the hero anchor (D7's hero-rung half is rock-solid), and
  it does not break the gate's BITE direction (it still reds today). But a gate that claims
  "37" while its grep returns 153 will be confusing at GREEN time — the implementer cannot
  drive 153→0 without sweeping legitimately-justified rungs, so either the COUNT or the
  EXCLUSION SET is wrong. Flag for the W4-deep / styling-idioms lane to reconcile
  (tighten the grep to the φ-hero-relevant surfaces, or restate the number). Not
  load-bearing for my charge; recording so it isn't lost.
- **Concrete doc edit:** in `H.W4.md:42` either (a) restate "37" as the ledger residual and
  add "(the literal gate grep over these roots returns ~150 today; the sweep target is the
  ledger-tracked φ-hero leaf-tail, which the gate's exclusion set must narrow to before
  GREEN)", or (b) tighten the grep scope so its live count equals the asserted number.

### L1/L2 leaf-tail anchors (H.W4 S4) — CONFIRMED exact
- L1 `AnimationMenuBar.vue:102` → `'scale-on-hover text-xl text-white rounded-full p-0'`
  — `text-xl` present at line 102 exactly. ✓
- L2 `MotionPathTarget.vue:119` → `font-size: 1.25rem;` at line 119 exactly. ✓

### icon-* anchor (H.W4 S4 / `proof:icon-idiom`) — CONFIRMED exact
- Callsite tally over `demo/**/*.vue`: `icon-sm`×34, `icon-md`×13, `icon-lg`×11,
  `icon-xs`×3 = **61** — matches `H.W4:21,34` and gap-scorecard `:65` exactly. ✓
- No `.icon-(xs|sm|md|lg)` rule and no `@utility icon-*` in `demo/**` or
  `node_modules/@mkbabb/glass-ui/dist/styles/**` → `anyIconRuleInStylesheets:false`
  confirmed; all 61 are silent no-ops resolving to Lucide's default 24px. `proof:icon-idiom`
  reds today. ✓

---

## D6 — typing-dots (H.W6 S1/S2/S3 / `proof:typing-dots` / `proof:dogfood-hero`)

### CONFIRMED born-RED (live, `/#/`, 1440×900 and 390×844, pre-redirect frame)

| `proof:typing-dots` clause | Live measurement | Verdict |
|---|---|---|
| (a) ≥3 distinct animated dot spans | **ellipsisVisualSpanCount = 1** (the `split(/\s+/)` substrate yields ONE span for `"..."`) | ✓ reds today |
| (b) monotone per-dot delay | one span → one `animationDelay: 0s` → no cadence | ✓ reds today |
| (c) min opacity over cycle ≥ 0.15 | **min 0.000, max 1.000**; 30.8% of cycle < 0.15; 39.7% < 0.3; 43.7% > 0.7 (n=325 rAF samples over 2.7s) | ✓ reds today |
| (d) total cycle ≤ 1.6s | `animationDuration: 2.6s` (the title-sized `text.length` formula mis-applied to the 3-glyph ellipsis) | ✓ reds today |
| cascade lint — one `animation` shorthand/node | the single span carries `class="lift-down dot-fade depth-text"` AND resolves `animationName: "dotFade-…"` (`.dot-fade` wins, `liftDown` silently dropped) | ✓ collision is LIVE |
| `proof:dogfood-hero` — dots import a kf symbol | `AnimatedText.vue` imports only `vue` `computed` — zero library imports | ✓ reds today (inv ζ violated) |

- The audit's "43% of cycle < 0.3" (gap-scorecard `:62`, `a-typing-dots.md`) measures
  **39.7%** live — within rAF sampling variance, same 325-sample harness, same shape (full
  0→1→0 vanish). The perceptual break is real: the dots are near-invisible ~40% of every
  cycle and fully vanish (min 0.000), exactly the "ghost window" `proof:typing-dots (c)`
  exists to kill. NOT a vacuous gate.
- **The dual-`animation`-shorthand collision is real and subtle.** In source,
  `AnimatedText.vue:24` hardcodes `class="lift-down"` on every word span, and the call site
  `EditorStartScreen.vue:17` passes `class="dot-fade depth-text"`, which `$attrs` (with
  `inheritAttrs:false`, `v-bind="$attrs"` at `:26`) binds onto those same per-word spans.
  So the ONE ellipsis span ends with BOTH `.lift-down` (`:74` `animation: liftDown …`) and
  `.dot-fade` (`:95` `animation: dotFade …`). `.dot-fade` is declared later → wins wholly →
  `liftDown` is silently dropped (confirmed live: `animationName: "dotFade-9e0a79d1"`). The
  H.W6:17 anchor is accurate.

### FEASIBILITY / DEPENDENCY — H-A2 leak (`"......"`) CONFIRMED LIVE

H.W6 S3 + the H.W0 H-A2 engine-guard dependency hinge on the live `"......"` parse error.
**It reproduces.** During the rapid scene-hopping the redirect forces after a
`localStorage.clear()`, the console throws repeatedly:

```
Error: Parse error at offset 0: "......"
    at Object.Wo [as _lerp] (…/@mkbabb_value__js.js:4678:25)
    at CSSKeyframesAnimation.processFrame (…/src/animation/engine.ts:576:4)
    at CSSKeyframesAnimation.interpFrames (…/src/animation/engine.ts:516:9)
```

The line numbers match `H.W6:3,20` and gap-scorecard `:71` EXACTLY (`engine.ts:516,576`).
The hero ellipsis `"..."` doubled into `"......"` (two keyframe endpoints) is reaching
value.js `_lerp` as if interpolable. This validates BOTH (a) H.W6 S3's "drive opacity,
never the glyph string" upstream fix AND (b) the H.W0 H-A2 belt-and-suspenders dependency
H.W6 declares. The dependency is real, not hypothetical.

### D6 — no defect in the H.W6 authoring
Every H.W6 §state anchor (one span, 2.6s title-sized duration, the dotFade vanish, the
dual-shorthand collision, zero library imports, the live `"......"` leak) reproduces on the
live tree. The gates (a)/(b)/(c)/(d) + cascade lint + `proof:dogfood-hero` all bite today
and green only on the per-dot dogfooded primitive. **H.W6 authoring: SOUND.**

---

## Screenshots
- `/Users/mkbabb/Programming/keyframes.js/hd-hero-home-1440.png` (390px) and
  `hd-hero-home-1440-desktop.png` (1440px) — BOTH captured AFTER the D12 redirect, so they
  show the scene (cube + Rotations + an open Share popover), with the large Instrument-Serif
  hero only partially visible top-left mid-fade. They are weak evidence by themselves —
  noting that the start screen is so transient it is hard to even photograph is itself a
  live corroboration of the D12 redirect race both waves cross-reference. The authoritative
  evidence is the rAF-pre-redirect DOM capture (elapsedMs 7–10), tabulated above.

## One-line summary
D6 + D7 live anchors all reproduce exactly (hero 86.112px on `text-display-4`; mega 177.424px
compiled; ellipsis = 1 span; opacity min 0.000 / ~40% ghost window; 2.6s; dual-shorthand
collision live; `"......"` leak live at engine.ts:516,576; 61 icon no-ops; L1/L2 exact;
text-display-mega API real). One MED (H.W4 mis-diagnoses the orphan as flex-wrap — it is
grid-row stacking; fix still lands) + one LOW (`proof:phi-leaf-zero` "37" under-scoped).
Both waves' fixes are CORRECT and FEASIBLE; the gates BITE.
