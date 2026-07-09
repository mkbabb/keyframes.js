# Lane 19 — Fragile CSS Mechanics (VERDICT #28 clause 4)

> SURFACE: fragile CSS **mechanics** — magic numbers, `calc()`/`min()`/`max()` chains,
> `dvh`/`vh` traps, z-index scales, `-webkit-` prefixes, `@supports` gaps — across
> `demo/@/styles/*.css`, the sourced component stylesheets, and scoped SFC `<style>`
> blocks. Sibling lanes own adjacent ground: **17-styles-idioms** owns the token-authority
> architecture (tiers, cascade layers, glass-ui-vs-hand-rolled census) and already treats
> the dock-anchor calc web (its F7) and raw viewport literals (its F10) at the
> *architectural* level; **18-brittle-selectors** owns selector/DOM/reactivity brittleness.
> This lane stays at the **mechanism** level: the specific numbers, chains, and
> feature-detection gaps, cited where they are NOT already lane 17/18 territory, and
> quantified (chain depth, occurrence counts, cross-file duplication) where they are.
> READ-ONLY audit against `tranche-s-impl`; every count below is grep/read-derived, not
> vibes — reproduce with the commands inlined per finding.

## Census

| Mechanic | Count | Method |
|---|---:|---|
| `calc()` | ~109 (50 in dedicated `.css` files + 59 inside SFC `<style>` blocks) | `grep -o 'calc(' demo/**/*.css \| wc -l` + a `<style>`-block extraction script |
| `min()`/`max()`/`clamp()` | ~74 (45 in `.css` files + 29 in SFC `<style>` blocks) | same method |
| raw `vh` (not `dvh`/`svh`/`lvh`) in **live** rules | 8 sites / 6 files | `grep -rnE '[0-9]vh\b' demo --include=*.css --include=*.vue \| grep -v 'dvh\|svh\|lvh'`, filtered for comment-only hits |
| `dvh`/`svh`/`svi`/`lvh` (the migrated, correct form) | 72 | same grep, positive set |
| demo-local `--z-*` custom-property declarations | 1 (`--z-behind`) | `grep -rn -- '--z-[a-z]*:' demo` |
| raw `z-index: N` / `z-[N]` bracket literals | 0 | `grep -rnE 'z-index:\s*[0-9-]+' demo \| grep -v 'var(--z'` + `grep -rohE 'z-\[[0-9]+\]' demo` |
| `-webkit-` declarations | 8 (excl. comments/JS `CSS.supports` probes) | `grep -rn -- '-webkit-' demo` |
| `@supports` blocks | 6 | `grep -rn '@supports' demo --include=*.css --include=*.vue` |
| the `1023px`/`1024px` breakpoint literal | 23 sites / 15 files, in 4 unrelated spellings | see F1 |

The z-index and `-webkit-`/`@supports` rows are, on their own, **clean** — this is stated
up front so T does not spend a wave re-litigating ground the S drive already got right
(see F3's second half and F7). The findings below are the mechanics that are NOT clean.

---

## F1 — The `1023px`/`1024px` breakpoint is spelled four independent, unlinked ways across 15 files — and one spelling is unit-incompatible with the other three

**The mechanism.** The demo's one mobile/desktop boundary (Tailwind's default `lg`
breakpoint, unmodified — no `--breakpoint-lg` override exists in `style.css`'s `@theme`
block) is hand-re-derived FOUR separate times, with zero shared source:

1. **Raw `@media` px literal — 17 live sites, 11 files**: `CubeScene.vue:245`,
   `CubeTarget.css:70,216`, `SequenceAxis.vue:43`, `SequenceTarget.css:249`,
   `style.css:441,496,577`, `AnimationControlsGroup.css:114`, `SheetGrabHandle.vue:54`,
   `ControlsPaneWrapper.css:32,94,176,262,269`, `EditorStartScreen.vue:186,222,263` — all
   either `(max-width: 1023px)` or `(min-width: 1024px)`.
2. **JS string literal via `useMediaQuery` — 5 sites, 4 files**: `ChromeDock.vue:124`
   (`"(max-width: 1023px)"`), `usePaneRegister.ts:38` (`"(min-width: 1024px)"`),
   `useControlsLayout.ts:52`, `useSheetState.ts:54` (both `"(max-width: 1023px)"`) — a
   *second syntax family* (JS string, not a CSS at-rule) carrying the identical boundary,
   with no constant anywhere in `demo/` named for it (`grep -rn 'BREAKPOINT\|breakpoint'
   demo/@/**/*.ts demo/app/**/*.ts` — zero hits).
3. **`@container` rem literal — 1 site**: `AnimationControlsGroup.css:197`,
   `@container controls-layout (min-width: 64rem)` — the container-query promotion of
   the SAME boundary (the file's own comment at :193 names the mapping: "`@media
   (min-width:1024px)` → `@container (min-width:64rem)`"), spelled in `rem` instead of
   `px`.
4. **The idiomatic Tailwind form, ALREADY in the same codebase** — 16 template sites use
   `lg:`/`max-lg:` utility classes (`grep -rc '\blg:' demo --include=*.vue`), which
   correctly derive from Tailwind v4's built-in `--breakpoint-lg` theme token with zero
   duplication risk.

Spelling (3) is not merely a second dialect of the same fact — it is **unit-incompatible**
with (1)/(2). `64rem` only equals `1024px` while the root font-size is the browser
default `16px`. If a future accessibility pass sets a larger root size (a real,
recommended practice — WCAG 1.4.4 reflow, or simply a user's own browser zoom/font-size
preference), the `@container` fork trips at a *different actual viewport width* than
every `@media`/`useMediaQuery` fork it is documented to mirror — a silent, device- and
preference-dependent desktop/mobile disagreement between the grid-placement layer and
everything else that decides "am I mobile."

**Blast radius.** A future breakpoint retune (a plausible T outcome, given VERDICT #19's
"rethought from the ground up" and #26's structural re-architecture) requires touching 23
sites by grep-and-replace with zero compiler check; missing one produces a page where the
CSS layout says "desktop" while a `useMediaQuery`-driven composable's `isMobileLayout`
still says "mobile" (or vice versa) — a state-desync class bug, not a cosmetic one, since
`useSheetState.ts`/`useControlsLayout.ts` gate which CONTROL SURFACE mounts. Separately,
today, on any root font-size other than exactly `16px`, the `@container` grid-placement
fork and the `@media`/JS mobile-detection forks can already disagree in the wild, for any
user with a font-size accessibility setting — the exact popuation CSS logical-unit
practice exists to serve.

**Robust form.** Tailwind v4 (already the build's PostCSS pipeline — no new dependency)
resolves this in one move: reference the theme token directly in hand-written CSS via
`theme()` — `@media (width >= theme(--breakpoint-lg))` / `@container controls-layout
(width >= theme(--breakpoint-lg))` — so the `@media`, `@container`, and (via a `<script>`
read of the same computed value, or simply a single exported
`export const DESKTOP_QUERY = "(min-width: 1024px)"` constant) `useMediaQuery` call sites
all resolve from ONE declaration. Where a template can use `lg:`/`max-lg:` directly
instead of a hand-rolled `@media`, prefer that (spelling 4) over re-deriving the raw query.

```sh
grep -rnE '\(m(in|ax)-width:\s*102[34]px\)' demo --include='*.css' --include='*.vue' | wc -l
grep -rn 'useMediaQuery\("(min|max)-width: 102[34]px"' demo --include='*.ts' --include='*.vue'
```

---

## F2 — Raw `vh` (not `dvh`) survives at exactly the seam the codebase already engineered to be `dvh`-safe: the cube's `--side-size` sizing token

**The mechanism.** `design-idioms.css:150-188` documents, IN THIS FILE, the mobile
viewport-unit trap by name — twice: `--panel-max-h: 60dvh` ("mobile-correct: tracks the
dynamic viewport, no URL-bar over-reservation, reconciled from the former 60vh"), and the
cube-loader-glyph tokens `--target-viewport-h/-w` ("the former 30vh/30vw sized the loader
glyph off the viewport... M2 makes `.controls-layout` a container... cqi/cqb resolve
against the clamped stage"). Both were MIGRATED off raw viewport units for the documented
reason. `AnimationControlsControls.vue:362-364` and `TimingFunctionPanel.vue:242-244`
independently re-state the same lesson for the bezier-editor cap: `50dvh`, "tracks the
real visible height on mobile (no URL-bar over-reservation)." The mobile
hero/cube-recede split — the SAME feature family, in the SAME file — gets it right too:
`--start-hero-band: 34dvh` (`design-idioms.css:260`).

But the cube's own `--side-size` — the token that sizes the die sharing that exact
disjoint-bands contract — was never migrated, at any of its three independent
declaration sites, all still raw `vh`:

- `CubeTarget.css:51` — `--side-size: min(25vh, 25vw, 15rem);` (desktop base)
- `CubeTarget.css:72` — `--side-size: min(50vh, 50vw, 18rem);` (mobile, `@media
  (max-width: 1023px)`, "the cube scene proper" per `CubeScene.vue:258-261`'s comment)
- `CubeScene.vue:264` — `--side-size: min(40vh, 40vw, 16rem);` (mobile AND
  hero-recede state — the home screen — via a `:deep(.cube)` override; a fourth `:deep()`
  instance for lane 18's census)

`EasingSidebar.vue:217` (`max-block-size: min(56vh, 420px);`) is a second, unrelated
instance of the identical raw-`vh` omission in a panel that otherwise (line 207's `64cqi`
term) is container-query-literate.

**Why this is not cosmetic.** Per the CSSWG viewport-unit spec (and confirmed current
behavior in Mobile Safari/Chrome Android), unprefixed `vh` resolves against the **large**
viewport (the size once the dynamic browser-chrome toolbar is fully retracted), while
`dvh` tracks the **current** viewport and shrinks while the toolbar is showing (the
default, at-rest state on most page loads). `--start-hero-band: 34dvh` correctly shrinks
to the REAL visible height while the toolbar is up; `--side-size`'s `40vh`/`50vh`
computes against the INFLATED large-viewport height regardless of toolbar state. The two
bands that `CubeScene.vue:239-244`'s own comment claims are "disjoint... by construction"
(so "the 390×844 hero/subject intersection is 0 by construction") are each sized against a
**different effective viewport height** whenever the toolbar is showing — which is most
of the time at rest. This does not prove VERDICT #3's hero/cube overlap on shot 03/18 (a
desktop capture) is caused by this mechanism, but it is a live, reproducible, currently
undetected fragility in the exact mobile feature the comment asserts is overlap-proof, and
it sits one line away from three already-correct `dvh` siblings in the same file family —
this is a partial migration, not a design choice.

**Robust form.** `min(25dvh, 25dvi, 15rem)` / `min(50dvh, 50dvi, 18rem)` /
`min(40dvh, 40dvi, 16rem)` at the three sites (matching the `dvh`+`dvi` pairing
`EditorShell.vue:189-201`'s own `@supports not (height: 100dvh)` fallback already
demonstrates is the correct paired form — `vw`'s dynamic sibling is `dvi`/`dvw`, not
`vw` left unconverted); `EasingSidebar.vue:217` → `min(56dvh, 420px)`.

```sh
grep -rnE '[0-9]vh\b' demo --include='*.css' --include='*.vue' | grep -v 'dvh\|svh\|lvh'
```
should return zero live (non-comment) hits outside the one documented, intentional
`@supports not (height: 100dvh)` static-viewport fallback in `EditorShell.vue`.

---

## F3 — `--z-behind: -10` duplicates glass-ui's OWN already-shipped z-index token, verbatim, instead of consuming it — the one crack in an otherwise clean z-scale

**The good news first (calibration).** The z-index scale is, structurally, exactly right:
zero raw `z-index: N` declarations, zero Tailwind `z-[N]` bracket literals, and every
semantic rung (`z-content`/`z-controls`/`z-bar`/`z-dock`/`z-overlay`/`z-popover`/
`z-modal`) resolves from glass-ui's shipped `--z-*` tokens
(`node_modules/@mkbabb/glass-ui/dist/styles/tokens/scheme-motion.css`), consumed via
Tailwind utility classes, per the ordered-layer contract documented at `style.css:18-44`.
`proof:brittleness` gates this. This is the z-scale finding the mandate asks for turning
up clean — worth stating so T does not re-audit settled ground.

**The one crack.** `design-idioms.css:245` declares `--z-behind: -10;` as a
DEMO-OWNED token (the comment at :239-244 frames it as "reconciling the one orphan raw
`z-index: -10`"). But glass-ui's own token file already ships
`--z-behind: -10` (`scheme-motion.css`, alongside `--z-content: 10`, `--z-controls: 20`,
etc. — the exact same scale the demo consumes for every OTHER rung). The demo redeclares
a value that already exists upstream, unaliased — a literal duplicate, not a gap-fill.

**Fragility mechanism.** This is the same class of drift risk lane 17 F6 names for the
banished-green/gold literals, applied to a structural (not cosmetic) token: if glass-ui
ever retunes its below-plane rung (e.g. widening the reserved headroom between `-10` and
`0` for its own internal layering — plausible, since glass-ui's own scale reserves an
80-point gap between `--z-overlay:50` and `--z-popover:130` for exactly this kind of
future insertion), the demo's copy silently stops matching the vendor's, and the ONE
element that uses it (`CubeAxisLines.vue:65`, `var(--z-behind)`) drifts out of the
stacking contract with no warning — the inverse of every other rung on the same page,
which would follow the vendor automatically.

**Robust form.** Delete `design-idioms.css:245`'s declaration; `CubeAxisLines.vue:65`
already reads `var(--z-behind)`, which resolves the identical value straight from
glass-ui's cascade with no demo declaration required. If a Tailwind `z-behind` utility
does not already exist for it (unlike the other six rungs), add the one-line utility
mapping rather than a second `:root` value.

```sh
grep -c -- '--z-behind:' demo/@/styles/*.css   # should drop to 0
```

---

## F4 — `EasingCurveCanvas.vue`'s glow/stroke/font-size registry: ~20 raw sub-pixel magic numbers, zero tokens, near-duplicate values that have already drifted

**The mechanism.** The bezier curve SVG (`viewBox="0 ${minY} 1 ${height}"` —
`EasingCurveCanvas.vue:17`, a **normalized 0–1 coordinate space**, not physical pixels)
carries every stroke width, glow radius, and dash pattern as a bare literal, in a unit
(SVG user-space `px`, which scales with the viewBox) that reads as a typo to anyone who
does not already know the viewBox convention:

```
:364  stroke-width: 0.015;              :406  stroke-width: 0.04;
:370  stroke-width: 0.008;              :410-411  drop-shadow(...0.018px...) drop-shadow(...0.045px...)
:371  stroke-dasharray: 0.02 0.015;     :421  stroke-width: 0.025;
:378  stroke-width: 0.008;              :425  stroke-dasharray: 0.03 0.025;
:388  stroke-width: 0.006;              :438  ...0.018px... 0.045px... blur(0.004px)
:393  stroke-width: 0.025;              :467  stroke-width: 0.02;
:394  stroke-dasharray: 0.03 0.02;      :469  drop-shadow(...0.02px...)
                                        :473  r: 0.055;
                                        :474  drop-shadow(...0.04px...)
                                        :485-486  drop-shadow(...0.02px white) drop-shadow(...0.06px...)
                                        :494  font-size: 0.055px;
```

None of these is a custom property. Several are near-duplicates that have already
independently drifted: the "handle" glow is `0.02px` (:469) while the "traveling dot"
glow uses `0.02px`+`0.06px` (:485-486) and the bezier-path glow uses `0.018px`+`0.045px`
(:410-411, repeated at :438 and :444) — three different two-layer glow recipes for what
reads, visually, as the same "emitted light" effect family the file's own L.W11 S5
comments describe as ONE signature. `0.018` vs `0.02` (a 10% delta with no stated reason)
is exactly the smell of three people (or three edits) tuning the same effect by eye
against three different call sites, independently, with no shared source to converge on.

**Blast radius.** A future re-tune of "how strong is the glow" (a design-taste change
Fable/frontend-design is very likely to make, given VERDICT #16's "most of this page
looks awful" verdict on this exact scene) touches ≥10 literal-pairs by hand across a
499-line file with no single point of truth, and the drift already present (0.018 vs 0.02)
demonstrates this has already gone unnoticed once.

**Robust form.** Name the recipe: `--curve-glow-inner`/`--curve-glow-outer` (or a
two-stop `--curve-glow: 0.018px 0.045px` shorthand consumed by
`filter: drop-shadow(0 0 var(--curve-glow-inner) var(--trace-glow)) drop-shadow(0 0
var(--curve-glow-outer) var(--trace-glow))`), plus `--curve-stroke-width`/
`--curve-stroke-width-ghost`/`--curve-dot-radius` for the geometry family. A one-line
comment at the top of the `<style>` block stating the viewBox-user-unit convention (so
`0.055px` reads as intentional, not broken) removes the readability trap independent of
the tokenization.

```sh
grep -cE '0\.0[0-9]+px' demo/@/components/custom/easing-editor/EasingCurveCanvas.vue
```

---

## F5 — The "crisp hairline" `calc(50% ± 0.5px)` gradient recipe is hand-duplicated, verbatim, across three unrelated scene files

**The mechanism.** A specific four-stop `linear-gradient` idiom — a 1px-wide crosshair
line centered exactly on the container midpoint, built from a hard color-stop pair at
`calc(50% - 0.5px)`/`calc(50% + 0.5px)` — is authored independently in:

- `demo/scenes/morph/MorphTarget.vue:207-221` (two axes: "to right"/"to bottom")
- `demo/scenes/motion-path/MotionPathTarget.vue:307-308` (same two axes, single-line form)
- `demo/scenes/square/SquareInstrument.vue:110-123` (same two-axis pattern, different
  color source — `var(--border)` vs `var(--c)`)

`MorphTarget.vue:192-193`'s own comment names the duplication as deliberate reuse of
intent ("the same blueprint-ground idiom as the motion-path stage") — but the CSS itself
is retyped, not shared: three independent copies of the same seven-token pattern
(`transparent`, two hard stops at `± 0.5px`, `transparent`, repeated per axis), each
liable to diverge under a future edit the way F4's glow pair already has.

**Secondary fragility: the `0.5px` constant is device-pixel-ratio-fragile.** The
"exactly half a pixel either side of 50%" trick produces a crisp 1-CSS-pixel line only
when 1 CSS pixel maps to 1 device pixel (a plain 1×, non-scaled display). On any other
device-pixel ratio — a Retina/2× display (2 physical pixels per CSS pixel), or a
non-integer OS/browser zoom (Windows' common 125%/150% scaling, 1.25×/1.5×) — the
gradient's hard stop no longer lands on a device-pixel boundary, and the "hairline"
anti-aliases into a soft ~1-2 physical-pixel band instead of a crisp line. This is
invisible in local dev (a 1x or exact-2x laptop panel) and is the kind of defect that
only shows up on the exact hardware/zoom combination a reviewer happens not to be using.

**Blast radius.** Three independent call sites to edit in lockstep for any future tune of
the blueprint-ground look (thickness, color mix ratio, or a move to a resolution-safe
technique); zero shared source to converge them, so a fourth scene adopting "the same
blueprint-ground idiom" (a stated pattern name, inviting reuse) will most likely retype it
a fourth time rather than finding an existing recipe to reference.

**Robust form.** One idiom, e.g. `.blueprint-crosshair` (or a `--crosshair-color`-scoped
mixin-equivalent) in the idioms layer (lane 17's `idioms.css`), parameterized by the one
thing that actually varies (`--c`/`--border`), consumed by all three scenes. For the DPR
fragility specifically, prefer a resolution-independent construction — a `1px solid`
absolutely-positioned pseudo-element pair (which always resolves to exactly 1 device
pixel via the UA's own hairline handling) or `background-image:
linear-gradient(...) 0 50% / 100% 1px no-repeat` (sizing the line by an explicit `1px`
background-size band, not a percentage arithmetic hard-stop) over the `calc(50%±0.5px)`
percentage-arithmetic form.

```sh
grep -rn 'calc(50% - 0.5px)' demo --include='*.vue' --include='*.css'
```
should return ONE definition site, not three.

---

## F6 — The dock-anchor token web's `calc()` chain reaches 6-7 dependency levels deep with a diamond re-convergence (quantifying lane 17 F7)

Lane 17 F7 already names the dock/work-area token web as a fragile calc/min/max
labyrinth and owns the T recommendation (promote `anchor-name`/`anchor()` to primary,
retire the `*-stable` twin subtree) — this finding does not re-litigate that, it adds the
one metric that makes the fragility concrete for whoever executes T: the actual
**dependency depth**, traced from `style.css`:

```
Level 0  100dvh (browser) · --menubar-measured-h (JS/ResizeObserver) · env(safe-area-inset-*)
Level 1  --work-area-max-height  = clamp(44rem, 88dvh, 120rem)                          [:161]
Level 2  --work-area-height      = min(100dvh, var(--work-area-max-height))             [:162]
Level 3  --work-area-vertical-slack = max(calc(100dvh - var(--work-area-height)), 0px)  [:199]
Level 4  --work-area-bottom-offset  = calc(slack * 0.618)                               [:201]
Level 5  --dock-bottom-anchor    = calc(min(max(offset, safe-area), ceiling) + margin/φ) [:317-325]
Level 6  --dock-menubar-reserve  = calc(var(--dock-bottom-anchor) + var(--dock-band-reserve)) [:267-269]
```

— a 6-level chain for ONE consumer value, before the mobile override at `:519`
(`--work-area-max-height: min(64rem, calc(100dvh - var(--dock-band-reserve)))`) is
applied, at which point `--dock-band-reserve` re-enters the chain **one level above**
where `--dock-menubar-reserve` (level 6) already consumes it directly at level 0 — the
"diamond" the file's own comment at `:205-210` admits was a real custom-property CYCLE
(`max-height → bottom-offset → slack → height → max-height`) requiring hand-breaking, and
the reason the `*-stable` twin subtree (`--dock-band-reserve-stable`,
`--work-area-max-height-stable`, `style.css:233-249,539-558`) exists at all — a second,
parallel 6-level chain maintained ONLY to avoid re-triggering the cycle the first chain
already had to be surgically cut to avoid.

**Why this belongs on the fragile-CSS ledger specifically.** A 6-level custom-property
chain is not itself illegal or even unusual — but a chain this deep, with a value
re-entering one level above its own consumer, is unauditable by inspection: no single
`grep` or file section shows "what is `--dock-menubar-reserve` in terms of the four
literals that actually govern it" without manually substituting six times. This is
exactly the failure mode CSS custom properties invite when used as a spreadsheet rather
than a token layer (unlike a build-time SCSS variable, a browser resolves each `var()`
per paint, so a stray typo three levels deep produces a wrong PIXEL VALUE with no error,
only a live-session `proof:*` gate catching it after the fact — which is exactly how the
CH-3 mobile chronic this file's own comments narrate was found).

**Robust form (narrower than lane 17's anchor-positioning promotion, and additive to
it).** Whether or not `anchor-name`/`anchor()` becomes primary, cap the chain depth as an
explicit, falsifiable property independent of token *count*: publish the FINAL number —
whatever geometry fact the sheet anchor actually needs — as ONE JS-computed custom
property (`--stage-safe-bottom`, published by the same `ResizeObserver` that already
publishes `--menubar-measured-h`), consumed with zero further `calc()` derivation at the
call site. This is a strictly stronger simplification than reducing token *count* alone —
it also removes the re-entrant diamond by construction, because there is no longer a
second chain for the JS value to accidentally feed back into.

```sh
# a chain-depth census: for a named custom property, count var()-hops to a literal.
grep -c 'calc(' demo/@/styles/style.css   # today: 20 — the raw material of the census
```

---

## F7 — Calibration note: the `-webkit-` prefixes and `@supports` gates already in this codebase are load-bearing, not legacy cruft — do not blanket-strip them in T

VERDICT #28 clause 4 asks for a `-webkit-`/`@supports` audit; the honest finding is that
this codebase's usage is, site-by-site, **correct against current Baseline data**, and a
literal reading of "no legacy code" that strips these would introduce regressions:

- `-webkit-mask-image` paired with `mask-image` (`AnimationControls.vue:436-448`,
  `ControlsPaneWrapper.css:283-300`) — `mask-image` is Baseline **Newly available**
  (2023-12-07 per the modern-web-guidance `complex-shapes` reference); the guide's own
  canonical example marks the `-webkit-` form "MANDATORY... for wider support." Correct
  as-is; the actual defect here (the recipe is duplicated between the two files, not that
  it's prefixed) is F5's DRY class, already owned by lane 17 F7's mask-fade note.
- `-webkit-line-clamp` (`EasingSelect.vue:133`) — the **unprefixed** `line-clamp` is,
  per the same guidance corpus, not natively supported by ANY major browser as of this
  writing; the prefixed form is not a legacy fallback, it is currently the ONLY working
  mechanism.
- `-webkit-backdrop-filter` (`EditorStartScreen.vue:254`) paired with `backdrop-filter` —
  correct pairing, though its only consumer (`.kf-source-egg`) is VERDICT #2's condemned
  card and dies with it regardless.
- `-webkit-user-select` (`design-idioms.css:883`, `SheetGrabHandle.vue:69`) — genuinely
  inert today (`user-select` unprefixed has shipped everywhere since Safari 15.4, ~2022)
  but harmless dead weight, not a correctness risk; low-priority cleanup only.
- `@supports (anchor-name: --stage)` (`style.css:440`) — anchor positioning is confirmed
  "not natively supported by any major browser yet" per the modern-web-guidance
  `css-layout` reference; the feature-gate is required, present, and correctly framed as
  progressive enhancement over an always-correct floor (lane 17 F7's territory).
- `@supports not (height: 100dvh)` (`EditorShell.vue:189`), `@supports not (content-
  visibility: hidden)` (`AnimationControls.vue:424`), `@supports not (padding:
  env(safe-area-inset-bottom))` (`TransportDock.vue:454`) — all three correctly-shaped
  "supports-not" static fallbacks for Baseline-recent (`dvh`: 2022-12; `content-
  visibility` pane-cache: 2025-09 per that file's own comment) features.
- `grid-template-columns: subgrid` (`design-idioms.css:804`) is used with **no**
  `@supports` guard, and the file's own comment (:773) is correct to say so — subgrid is
  Baseline **Widely available** since 2023-09-15 (Chrome 117/Firefox 71/Safari 16); this
  is the ONE CSS-layout feature in the demo that correctly identifies it does NOT need a
  feature gate, in contrast to anchor-positioning one section below it that correctly
  says it DOES. The demo's own `@supports` discipline is internally consistent.

**Why this is still a T-relevant finding.** VERDICT #28's clause 4 mandate, read
literally by an executing agent without checking Baseline status per-feature, would
delete correct, load-bearing code. This note exists so T's fragile-CSS wave spends its
budget on F1-F6 (the real defects) rather than re-breaking F7's already-correct
patterns. No gate is proposed for F7 beyond: any future prefix/`@supports` removal in
this codebase must cite the specific feature's Baseline date, not a blanket "no vendor
prefixes" rule.

---

## T recommendations

1. **Single-source the `1023px`/`1024px` breakpoint via Tailwind v4's `theme()`.**
   Replace all 17 raw `@media (max-width:1023px)`/`(min-width:1024px)` at-rules with
   `@media (width < theme(--breakpoint-lg))`/`(width >= theme(--breakpoint-lg))`; replace
   the `@container controls-layout (min-width: 64rem)` rem literal with the same
   `theme()` call (removing the rem/px unit-incompatibility); export ONE
   `export const DESKTOP_QUERY = "(min-width: 1024px)"` (or read the resolved
   `--breakpoint-lg` value at runtime) for the 5 `useMediaQuery` JS call sites. ·
   Gate: `grep -rnE '\(m(in|ax)-width:\s*102[34]px\)' demo` == 0 outside a single
   constant/theme definition. · **S**

2. **Finish the `vh`→`dvh` migration at the cube's `--side-size` (3 sites) and
   `EasingSidebar.vue`'s `56vh`.** Convert `min(25vh,25vw,15rem)` /
   `min(50vh,50vw,18rem)` / `min(40vh,40vw,16rem)` to their `dvh`/`dvi` twins,
   matching the `--start-hero-band: 34dvh` sibling in the same disjoint-bands
   contract; `min(56vh,420px)` → `min(56dvh,420px)`. · Gate:
   `grep -rnE '[0-9]vh\b' demo --include=*.css --include=*.vue | grep -v 'dvh\|svh\|lvh'`
   returns only the one documented `@supports not (height: 100dvh)` static fallback in
   `EditorShell.vue`. · **S**

3. **Delete the demo-local `--z-behind` duplicate; consume glass-ui's token directly.**
   Remove `design-idioms.css:245`'s `--z-behind: -10` declaration (glass-ui already
   ships the identical token); add the missing `z-behind` Tailwind utility mapping if
   one does not already exist, so the rung is reached the same way as its six siblings. ·
   Gate: `grep -c -- '--z-behind:' demo/@/styles/*.css` == 0. · **S**

4. **Tokenize `EasingCurveCanvas.vue`'s glow/stroke/dash registry.** Extract
   `--curve-glow-inner`/`--curve-glow-outer`/`--curve-stroke-width`/
   `--curve-stroke-width-ghost`/`--curve-dot-radius` from the ~20 raw literals;
   reconcile the three already-drifted glow-pair variants (`0.018/0.045` vs `0.02` vs
   `0.02/0.06`) into one designed value during the same pass (a Fable/frontend-design
   call, not a guess here); add a one-line viewBox-user-unit convention comment. · Gate:
   `grep -cE '0\.0[0-9]+px' demo/@/components/custom/easing-editor/EasingCurveCanvas.vue`
   drops to 0 outside token declarations. · **S**

5. **Consolidate the `calc(50% ± 0.5px)` blueprint-crosshair recipe into one idiom.**
   One `.blueprint-crosshair` (or equivalent) definition in the idioms layer, color
   parameterized, consumed by `MorphTarget.vue`, `MotionPathTarget.vue`, and
   `SquareInstrument.vue`; evaluate the resolution-independent `background-size: 100% 1px`
   form over the percentage-arithmetic hard-stop to remove the DPR fragility in the same
   pass. · Gate: `grep -rn 'calc(50% - 0.5px)' demo` resolves to ONE definition site,
   consumed ≥3 times, not 3 independent authorships. · **S**

6. **Publish one JS-computed geometry value to break the dock-anchor chain's diamond
   (additive to lane 17 rec #7).** Whatever T decides for the anchor-positioning
   promotion, also collapse the 6-level `--work-area-*`/`--dock-*` calc chain's
   re-entrant point: the `ResizeObserver` that already publishes `--menubar-measured-h`
   publishes the FINAL consumer-facing value (`--stage-safe-bottom`) directly, so no
   call site performs more than one `calc()` hop from a JS-published fact. · Gate: no
   custom property in the `--dock*`/`--work-area*` family is defined in terms of another
   property that is itself ≥3 `var()`-hops from a literal or a JS-published value
   (a chain-depth lint, distinct from lane 17's token-*count* gate). · **M**

7. **Do not blanket-strip `-webkit-`/`@supports` under a literal reading of VERDICT #28
   clause 4.** Whoever executes the fragile-CSS wave checks each prefix/gate's Baseline
   date (per F7) before removing it; only `-webkit-user-select` (inert since ~2022) is a
   safe, low-priority delete. · Gate: none proposed — this is a process note for the T
   wave, not a code change; if a gate is wanted, a comment-linked Baseline-date citation
   requirement on any future prefix/`@supports` removal PR. · **S**
