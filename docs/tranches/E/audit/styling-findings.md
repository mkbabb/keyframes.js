# E audit — styling lane (round 2: the utility-tier rent · literals · reconcile · dedup)

D.W2 localized the demo's design vocabulary into ONE owned layer
(`demo/@/styles/design-idioms.css` — the `--rainbow-*` family, `--color-gold`,
`.scale-on-hover`, `@keyframes enter`), uncaged the `utils.css` monolith (it is
GONE — `.ppmycota-*` → `brand.css`, `.tab-trigger-*`/`.btn-playback*` → component
partials, the `--ppmycota-primary` token stays global in `style.css :root`),
terminated the φ-ladder leaf-tail, retired the `!`-overrides (EasingSelect's
`!flex`/`![-webkit-line-clamp]`/`!overflow`; AnimationControlsGroup's
`!border-transparent`), and landed `@supports` guards for the `dvh`/`env()`/
`mask-image` chain — all gated by `proof:idioms` + `proof:brittleness`. D.W2/W3
closed the headline styling debt.

The post-D assay finds the styling residue those waves left: **ONE ungated idiom
rent D.W2's clause shape missed** (`.gold-shimmer` — the inv-η analogue at the
UTILITY tier, not the `var(--token)` tier D.W2 swept), a handful of recurring
arbitrary-value literals that earn tokens, a `--panel-max-h: 60vh` vs `60dvh`
unit inconsistency the layer's own comment acknowledged, and a `.progress-bar`
rule duplicated verbatim in two components. Every figure below is `grep`-verified
against the live tree on `tranche-d-impl` (2026-06-05), `file:line` cited —
**verified, not asserted.**

All FOLD findings land in **E.W3** (styling localization round 2, isomorphic);
the CLEAN confirmations are recorded so the verdict is on disk, not assumed.
**Isomorphic: pixels unchanged unless highly befitting + named** (the one named
delta — the `vh→dvh` reconcile — is enumerated in §Isomorphism below).

This is **net-NEW** residual, NOT folded debt. D's deferred ledger is CLEAN
(P-invariant-28: zero KFE; the φ-ladder leaf-tail ENDED in D.W2). D.W2 owned the
rented `var()`-idioms fully; E.W3 owns the one rented UTILITY-class idiom D.W2's
`var()`-shaped clause never derived, plus the literal/reconcile/dedup residue —
the FINAL states this honestly ("E.W3 owned the one utility-idiom rent D.W2's
clause shape missed," NOT "D.W2 was incomplete").

## Findings

| # | Finding | Evidence (file:line) | Severity | E-disposition |
|---|---|---|---|---|
| S1 | `.gold-shimmer` — **the inv-η rent at the UTILITY tier**: referenced ×3 in demo source, DEFINED demo-nowhere (`grep "gold-shimmer" demo/@/styles/` = EMPTY); resolves ONLY through the transitive glass-ui import. The exact rent D.W2 closed for `.scale-on-hover` — but D.W2's `proof:idioms` clause 1 derives its referenced set from `var()` / `@keyframes` / `.scale-on-hover` shapes, and `.gold-shimmer` is a CLASS utility matching none, so the clause never swept it | uses: `AnimationControlsControls.vue:69`, `EasingSelect.vue:23`, `EasingSelect.vue:59`; demo-local def: **0**; vendor def: glass-ui `dist/styles/utilities.css:330` + `animations.css:139` (the `gold-shimmer-slide` keyframe) | **High** | **FOLD-E.W3** (S1 — define demo-locally) |
| S2a | `min-w-[12rem]` ×3 — three identical dropdown `SelectContent` min-widths = a recurring constant earning `--dropdown-min-width` | `AnimationMenuBar.vue:42`, `TopDock.vue:150`, `TopDock.vue:177` | Medium | **FOLD-E.W3** (S2) |
| S2b | `w-[30vw]` ×1 — the cube-target spinner WIDTH is a literal while its HEIGHT already reads `--target-viewport-h`; the `design-idioms.css:81` comment claims `--target-viewport-h` covers "h-[30vh] / w-[30vw]" — **dimensionally wrong** (a vh token cannot name a vw width) | use: `CubeTarget.vue:31`; the wrong comment: `design-idioms.css:81` | Medium | **FOLD-E.W3** (S2 — add `--target-viewport-w: 30vw`, correct the comment) |
| S2c | `w-[calc(100%-3rem)]` ×1 — the visualizer track magic gutter: the `3rem` couples to the `left-6` (1.5rem each side) inset on the SAME element; change one, break the centering | use: `AnimationVisualizer.vue:10` (`left-6 w-[calc(100%-3rem)]`) | Medium | **FOLD-E.W3** (S2 — `--visualizer-track-gutter: 3rem` names the coupling) |
| S2d | `max-h-[min(24rem,60dvh)]` ×1 — the easing dropdown's compound `SelectContent` cap, a recurring panel-cap shape earning `--easing-dropdown-max-h` | use: `EasingSelect.vue:29` | Medium | **FOLD-E.W3** (S2; its `60dvh` half joins the S3 unification) |
| S3 | `--panel-max-h: 60vh` vs the `60dvh` variants — **a unit inconsistency the layer's own comment named.** The SAME "panel cap" intent is `60vh` in two places + `60dvh` in two others. On mobile `vh` over-reserves (includes the collapsible URL-bar region); `dvh` is layout-stable | token: `design-idioms.css:79` (`60vh`, comment "the dvh variants stay dvh"); `vh` consumers: `KeyboardShortcutsModal.vue:10`, `AnimationControlsGroup.vue:68`; `dvh` variants: `ResponsiveSelect.vue:58` (`max-h-[60dvh]`), `EasingSelect.vue:29` (`min(24rem,60dvh)`) | Medium | **FOLD-E.W3** (S3 — reconcile `--panel-max-h: 60dvh`, the ONE named pixel delta) |
| S4 | `.progress-bar { @apply h-2 rounded-md; background: linear-gradient(… var(--rainbow-*) …) }` — **duplicated VERBATIM** in two `<style scoped>` blocks (the rainbow brush-sweep, already on the D.W2 owned `--rainbow-*` family incl. `--rainbow-cyan`) | `KeyframesEditor.vue:250-262`, `KeyframesAddDialog.vue:161-172` | Medium | **FOLD-E.W3** (S4 — one shared definition in `design-idioms.css`) |
| S5 | `design-idioms.css` already exists (the D.W2 idiom layer, imported AFTER the glass-ui cascade) and is the EXTENSION point — E.W3 extends it, does NOT author a parallel layer | `@/styles/design-idioms.css` (defines `--panel-max-h`, `--dock-panel-width`, `--target-viewport-h`, `--rainbow-*`, `--color-gold`, `.scale-on-hover`, `.text-gold`, `@keyframes enter`, `--z-behind`) | — | **LEAVE** (the owned home; E.W3's anvil) |
| C1 | `utils.css` monolith — **GONE** (D.W2 uncaged it): no `tab-trigger`/`btn-playback`/`demo-*`/`ppmycota` component rules leaked into `style.css`; `.ppmycota-*` lives in `brand.css`, the token stays in `style.css :root` | `utils.css` does not exist; `brand.css:21-33` (`.ppmycota-*`); `style.css:160` (`--ppmycota-primary` token) | — | **LEAVE-clean** (no leaked component rules) |
| C2 | The `!`-overrides — **GONE** (D.W2.S7): EasingSelect's trigger-label is now clean (`items-center gap-1.5 min-w-0 cursor-pointer`, no `!flex`/`![-webkit-line-clamp]`/`!overflow-visible`); AnimationControlsGroup's `!border-transparent` retired (the RibbonBar:133 match is a COMMENT noting the former escape was removed) | `EasingSelect.vue:7-8`; `RibbonBar.vue:133` (comment only) | — | **LEAVE-clean** (no cascade-fight bangs) |
| C3 | Deprecated CSS — **NONE**: no `clip: rect()`, `-ms-filter`, `zoom:`, `expression()`, or float-layout hacks anywhere in demo styles | grep over `@/ app/` `.css`/`.vue` = 0 | — | **LEAVE-clean** |
| C4 | The work-area `calc()` chain — **cycle-free + documented**: the `--work-area-*` chain is annotated as deliberately cycle-free (the dock reserve is derived from dock primitives ALONE, no work-area term, to avoid a custom-property cycle); `@supports` guards landed (D.W3) for `dvh`/`env()`/`mask-image` | `style.css:61-96` (the documented chain), `:78-90` (the cycle-free note); guards: `AnimationMenuBar.vue:275`, `AnimationControls.vue:238`, `ControlsPaneWrapper.vue:229`, `EditorShell.vue:135` | — | **LEAVE-clean** (D.W3 hardened) |
| C5 | The z-scale — **clean** (D.W3.S2): the glass-ui `--z-*` contract is documented as an ordered demo ladder, the one orphan `z-index: -10` reconciled to `--z-behind` (`design-idioms.css:89`), zero raw `z-[N]` bracket drift | `design-idioms.css:83-89` (`--z-behind`); the ordered-layer doc in `style.css` | — | **LEAVE-clean** (D.W3 did it) |

## S1 — `.gold-shimmer`: the inv-η rent at the utility tier (the headline)

Grep-confirmed: `.gold-shimmer` is referenced at THREE demo sites and DEFINED
demo-nowhere.

- **`AnimationControlsControls.vue:69`** —
  `:class="['… cursor-help', isDetailEasing ? 'gold-shimmer' : '']"` on the
  "easing" label (the detail-easing affordance).
- **`EasingSelect.vue:23`** — `isDetailCurve ? 'gold-shimmer' : ''` on the
  selected-curve trigger label.
- **`EasingSelect.vue:59`** — `item.isDetail ? 'gold-shimmer' : ''` on the
  per-item detail-curve label.

`grep -rn "gold-shimmer" demo/@/styles/` returns **EMPTY** — there is NO
definition in the demo's own tree. The class resolves TODAY only through the
transitive `@mkbabb/glass-ui/dist/styles` import (`utilities.css:330` — a
`background: linear-gradient(90deg, var(--color-gold-dark),
var(--color-gold-light), var(--color-gold), var(--color-gold-light),
var(--color-gold-dark))` with `background-size: 250% 100%` + `background-clip:
text` + `-webkit-background-clip: text` + `color: transparent`, animated
motion-safe by `animation: gold-shimmer-slide var(--duration-shimmer) linear
infinite` — the `gold-shimmer-slide` keyframe at `animations.css:139`).

This is the EXACT inv-η rent D.W2 closed for `--rainbow-*` / `.scale-on-hover`:
an idiom referenced demo-wide, owned demo-nowhere, painting correctly today but
**flattening silently the day glass-ui's AT/AU arm renames or drops it**, with no
local contract, no fallback, and no gate. It is the ONE rent that slipped — and
it slipped for a precise reason: D.W2's `proof:idioms` clause 1 derives its
referenced-idiom set from `var(--token)` / `@keyframes` / `.scale-on-hover`
shapes, and `.gold-shimmer` is a CLASS utility matching NONE of those patterns,
so the clause never swept it. The headline of E.W3.

**Fix (E.W3 S1):** define `.gold-shimmer` in the EXISTING `design-idioms.css`
(beside `.scale-on-hover`), with the SAME computed result (isomorphic) — the
gradient binds to the demo's owned `--color-gold` (D.W2 landed it,
`design-idioms.css:66`) plus demo-owned `--color-gold-dark`/`--color-gold-light`
derivations (so the demo owns the full gold ramp, not just the mid-stop), and the
`gold-shimmer-slide` keyframe is defined demo-locally inside a
`prefers-reduced-motion: no-preference` block (the `@keyframes enter` precedent
D.W2 set). All three call sites are UNCHANGED — only the resolution moves from the
glass-ui rent to the demo's owned, gated layer. **The bug "closes" by OWNERSHIP,
not by a visible repaint** (the demo rented this ungated; E owns it gated — it was
not visibly broken). The glass-ui ramp tokens it mirrors (`--color-gold-dark`/
`-light` at `theme.css:177-178`, `--duration-shimmer: 5s` at `tokens.css:79`)
exist, so the localization is feasible + isomorphic.

**Distinction from D.W2 §Folds' "stay glass-ui-owned" recipes:** those are full
multi-stop gradient RECIPES (`.rainbow-vivid`/`.rainbow-pastel` play-button
backgrounds) the demo applies wholesale — they stay glass-ui-owned (inv-16).
`.gold-shimmer` is a demo INTERACTION idiom (like `.scale-on-hover`): the demo
authored the AFFORDANCE (the detail-curve hover shimmer), so it owns the contract.

## S2 — the recurring arbitrary-value literals (E.W3 S2)

Recurring bracket literals are an undocumented parallel scale fighting the token
system — the same anti-idiom D.W2's S3 tokenized at the typography/width tier.
Four recur or encode a coupling, so they earn tokens (D.W2 §DD4 — tokenize the
recurring + the coupled, keep genuine singletons bracket).

- **S2a — `min-w-[12rem]` ×3** (`AnimationMenuBar.vue:42`, `TopDock.vue:150`,
  `TopDock.vue:177`) — three identical dropdown `SelectContent` min-widths. One
  constant spelled three times (drift risk) → `--dropdown-min-width: 12rem`. (NOTE:
  `--dock-panel-width: 17rem` already exists for the WIDER dock/header panel —
  `--dropdown-min-width` is the narrower dropdown min, a distinct constant.)
- **S2b — `w-[30vw]` ×1** (`CubeTarget.vue:31`:
  `h-[var(--target-viewport-h)] w-[30vw] animate-spin`) — the HEIGHT already reads
  `--target-viewport-h` (D.W2.S3), but the WIDTH is still a literal. Worse, the
  `design-idioms.css:81` comment claims `--target-viewport-h` covers "h-[30vh] /
  w-[30vw]" — **dimensionally wrong** (a `vh` token cannot name a `vw` width). →
  add `--target-viewport-w: 30vw`, route the call site, and correct the comment to
  name BOTH the `-h` and the `-w`. Honest tokenization.
- **S2c — `w-[calc(100%-3rem)]` ×1** (`AnimationVisualizer.vue:10`) — paired with
  `left-6` (1.5rem) on the SAME element: `class="absolute top-1/2 left-6
  w-[calc(100%-3rem)] …"`. The track is inset 1.5rem each side = a 3rem total
  horizontal gutter, so the `3rem` is a MAGIC literal coupling the width-calc to
  the `left-6` inset — change the inset, the centering silently breaks. →
  `--visualizer-track-gutter: 3rem`; the call site reads `w-[calc(100% -
  var(--visualizer-track-gutter))]` and the comment names the `left-6`↔gutter
  coupling so a future inset change updates ONE token.
- **S2d — `max-h-[min(24rem,60dvh)]` ×1** (`EasingSelect.vue:29`) — the easing
  dropdown's compound `SelectContent` cap → `--easing-dropdown-max-h: min(24rem,
  60dvh)`. Its `60dvh` half participates in the S3 `dvh` unification (the token's
  `dvh` is the reconciled unit).

Keep arbitrary values ONLY where genuinely one-off + structural (D.W2 §DD4 — no
over-tokenizing a singleton): the `data-[…]:` reka-ui state variants and
`grid-cols-[…]` grid templates are NOT arbitrary values to tokenize (recorded so
E.W3 does not over-reach).

## S3 — `--panel-max-h: 60vh` vs the `60dvh` variants (E.W3 S3)

The demo caps panels at `60vh` in two places and `60dvh` in two others — the SAME
visual intent ("a panel may grow to ~60% of the viewport, then scrolls"), two
units. Verified:

- **`60vh` (the token):** `--panel-max-h: 60vh` at `design-idioms.css:79`,
  consumed via `max-h-[var(--panel-max-h)]` by `KeyboardShortcutsModal.vue:10` +
  `AnimationControlsGroup.vue:68`.
- **`60dvh` (the literals):** `ResponsiveSelect.vue:58` (`max-h-[60dvh]`) and the
  `60dvh` inside `EasingSelect.vue:29`'s `min(24rem, 60dvh)`.

The `design-idioms.css:79` comment — "max-h-[60vh] panel caps (the dvh variants
stay dvh)" — explicitly ACKNOWLEDGED the split. On mobile, where the URL bar
collapses, `vh` includes the collapsible region so a `60vh` cap OVER-reserves and
can push content under the dock band; `dvh` tracks the dynamic viewport and is
layout-stable — the mobile-correct unit (consistent with the `dvh` the work-area
chain already uses, `style.css:62-63,73`, D.W3 §State 6). The reconcile (E.W3 S3):
`--panel-max-h: 60dvh`, routing `ResponsiveSelect.vue:58` onto the token and
subsuming `EasingSelect`'s `60dvh` half into `--easing-dropdown-max-h` (S2d) —
all four panel-cap sites land on ONE token + ONE unit. Update the
`design-idioms.css:79` comment to record the reconcile. **This is E.W3's ONE
named befitting pixel delta** (see §Isomorphism).

## S4 — the duplicated `.progress-bar` rule (E.W3 S4)

`KeyframesEditor.vue:250-262` and `KeyframesAddDialog.vue:161-172` carry the
IDENTICAL rule in their `<style scoped>` blocks:

```css
.progress-bar {
    @apply h-2 rounded-md;
    background: linear-gradient(
        to right,
        var(--rainbow-red) 0%, var(--rainbow-yellow) 17%, var(--rainbow-green) 33%,
        var(--rainbow-cyan) 50%, var(--rainbow-blue) 67%, var(--rainbow-violet) 83%,
        var(--rainbow-red) 100%
    );
}
```

Two scoped copies of ONE rule — the `@apply h-2 rounded-md` sizing AND the
seven-stop rainbow brush-sweep gradient duplicated verbatim (the gradient already
reads the D.W2 owned `--rainbow-*` family, including `--rainbow-cyan`). It drifts
the day one copy's stops change. The rule IS a demo idiom (the rainbow brush-sweep
reading the owned family), so its canonical home is `design-idioms.css` (beside
the family it consumes): a single `.progress-bar` definition. Both components
already APPLY the class in their templates (`KeyframesEditor.vue:76`,
`KeyframesAddDialog.vue:46`) and delete their scoped copy (a genuine per-component
delta, if any, stays scoped — but the shared rule is defined once). Net-deletion
of the duplicate + the drift class.

## C1–C5 — the CLEAN confirmations (LEAVE, recorded)

The E mandate asked the assay to confirm `style.css`/`design-idioms`/`brand` carry
no leaked component rules, no deprecated CSS, cycle-free + documented calc chains,
and a clean z-scale. Each comes back **clean** — D.W2/W3 did the work; recorded
here so the verdict is on disk.

- **C1 — no leaked component rules.** `utils.css` is GONE (D.W2 uncaged it). A
  scan of `style.css`/`design-idioms.css`/`brand.css` for `tab-trigger` /
  `btn-playback` / `demo-container` / `demo-box` / `ppmycota` finds only:
  `brand.css:21-33` (the `.ppmycota-*` brand-mark rules, correctly CO-LOCATED in
  their own file), and `style.css:160` (`--ppmycota-primary`, a TOKEN that stays
  global — it is a token, not a component rule, and is read by both `brand.css`
  and the `var(--ppmycota-primary, …)` fallback consumers). The `tab-trigger.css`
  / `playback-button.css` became component partials. No component-specific
  selector leaked into the global layer. CLEAN.
- **C2 — no `!`-override cascade-fights.** D.W2.S7 retired both: EasingSelect's
  trigger-label is now `items-center gap-1.5 min-w-0 cursor-pointer`
  (`EasingSelect.vue:8`) — no `!flex`/`![-webkit-line-clamp:unset]`/
  `!overflow-visible`; the AnimationControlsGroup `!border-transparent` is gone
  (the only `!border` match, `RibbonBar.vue:133`, is a COMMENT documenting that
  the former escape was removed). No bang fighting the cascade. CLEAN.
- **C3 — no deprecated CSS.** A grep for `clip: rect()` / `-ms-filter` / `zoom:` /
  `expression()` across demo `.css`/`.vue` returns 0. No legacy hacks. CLEAN.
- **C4 — the calc chain is cycle-free + documented.** The `--work-area-*` chain
  (`style.css:61-96`) is annotated as deliberately cycle-free: the dock reserve is
  derived from dock primitives ALONE (no work-area term) precisely to avoid a
  custom-property cycle (`:78-90` documents this). D.W3 added the `@supports`
  guards (`100vh` fallback before the `dvh` chain at `EditorShell.vue:135`; the
  `env()`-not path at `AnimationMenuBar.vue:275`; the `-webkit-mask-image` guards
  at `AnimationControls.vue:238` + `ControlsPaneWrapper.vue:229`). CLEAN.
- **C5 — the z-scale is clean.** D.W3.S2 documented the glass-ui `--z-*` contract
  as an ordered demo ladder and reconciled the one orphan `z-index: -10` to
  `--z-behind` (`design-idioms.css:89`, sitting below glass-ui's `--z-content:10`).
  Zero raw `z-[N]` bracket drift. CLEAN.

## Isomorphism — pixels unchanged unless highly befitting + named

Every E.W3 change PRESERVES computed values — verified intent per finding:

- **S1 (`.gold-shimmer`)** — pixel-IDENTICAL: the demo's copy mirrors glass-ui's
  computed values (same gradient, same `background-size: 250% 100%`, same
  `gold-shimmer-slide` keyframe, same `prefers-reduced-motion` gating). The
  localization moves the SOURCE (glass-ui rent → demo-owned), not the render.
- **S2 (tokenization)** — pixel-IDENTICAL: `--dropdown-min-width: 12rem` /
  `--target-viewport-w: 30vw` / `--visualizer-track-gutter: 3rem` /
  `--easing-dropdown-max-h: min(24rem, 60dvh)` each compute to the SAME value the
  literal did. A token is a rename, not a repaint.
- **S4 (dedup)** — pixel-IDENTICAL: the shared `.progress-bar` is the SAME rule
  both scoped copies carried; one definition, same gradient.
- **S3 (`--panel-max-h: vh → dvh`)** — **THE ONE NAMED BEFITTING DELTA.** On
  desktop `60vh ≈ 60dvh` (no URL bar to collapse → isomorphic). On mobile, when
  the URL bar is EXPANDED, the `dvh` cap is SLIGHTLY shorter than the `vh` cap —
  a CORRECTNESS improvement (less over-reservation; content no longer risks
  pushing under the dock band), consistent with the `dvh` the work-area chain
  already uses. This is the single highly-befitting, named pixel delta; the AFTER
  capture (`scripts/capture.mjs`) shows it explicitly, every other surface ≈
  BEFORE.

The precept holds: pixels unchanged unless highly befitting + named — the one
`dvh` reconcile is both.

## Verification (re-runnable)

```sh
cd demo
# S1 — .gold-shimmer: ×3 references, ZERO demo-local definition (the rent):
grep -rn "gold-shimmer" --include="*.vue" . | grep -v "/dist/"            # → 3 uses
grep -rn "gold-shimmer" @/styles/                                         # → EMPTY (the rent)
grep -rn "gold-shimmer" ../node_modules/@mkbabb/glass-ui/dist/styles/     # → vendor-only def
# S2 — the recurring literals:
grep -rn "min-w-\[12rem\]" --include="*.vue" . | grep -v "/dist/"         # → 3 (S2a)
grep -rn "w-\[30vw\]" --include="*.vue" . | grep -v "/dist/"              # → 1 (S2b)
grep -rn "left-6 w-\[calc(100%-3rem)\]" --include="*.vue" . | grep -v "/dist/"  # → 1 (S2c)
grep -rn "max-h-\[min(24rem,60dvh)\]" --include="*.vue" . | grep -v "/dist/"    # → 1 (S2d)
# S3 — the vh/dvh split:
grep -n "panel-max-h" @/styles/design-idioms.css                         # → 60vh + the comment
grep -rn "max-h-\[60dvh\]\|max-h-\[var(--panel-max-h)\]" --include="*.vue" . | grep -v "/dist/"
# S4 — the .progress-bar dup (two scoped copies):
grep -rn "^\.progress-bar" --include="*.vue" . | grep -v "/dist/"        # → KeyframesEditor + KeyframesAddDialog
# C1 — no leaked component rules; utils.css gone:
test -f @/styles/utils.css && echo "LEAKED" || echo "utils.css GONE (clean)"
grep -n "tab-trigger\|btn-playback\|demo-container\|demo-box" @/styles/*.css   # → 0 component rules
# C2 — no ! overrides:
grep -rEn '!flex|!border-transparent|!\[' --include="*.vue" @/ | grep -v "/dist/" | grep -v "//"
# C3 — no deprecated CSS:
grep -rn "clip: rect\|-ms-filter\|zoom:\|expression(" --include="*.css" --include="*.vue" @/ app/ | grep -v "/dist/"
```

**Hard gate for E.W3** — `proof:idioms` (EXTENDED): the existing instrument
(`scripts/proof-idioms.mjs`) gains clauses, each a build+grep that reds on its
negative case:
(1) **`.gold-shimmer` demo-owned** — clause 1's class-shape branch (the one
already used for `.scale-on-hover`, `proof-idioms.mjs:105,116,145`) EXTENDED to
include `.gold-shimmer`: grep the ×3 references, assert `design-idioms.css`
carries a `.gold-shimmer` definition. BITES today (×3 refs, zero demo-local def);
falsifiable by stubbing the rule (then the assertion reds — proving the demo OWNS
the contract, not the merged cascade).
(2) **the named literals tokenized** — zero `min-w-[12rem]` / `w-[30vw]` /
`w-[calc(100%-3rem)]` (the magic-3rem form) / `max-h-[min(24rem,60dvh)]` in demo
source; each call site reads its `var(--…)`. BITES: each literal lives today.
(3) **`--panel-max-h` reconciled** — defined as `60dvh` (not `vh`); the four
panel-cap sites read one token, one unit. BITES: the `60vh` token + the two
`60dvh` literals split today.
(4) **`.progress-bar` single-definition** — exactly ONE `.progress-bar` rule
across demo source (the shared layer), zero in the two former `<style scoped>`
homes. BITES: two copies today.
(5) **isomorphic** — the AFTER capture ≈ BEFORE except the ONE named `dvh` delta
(§Isomorphism). The gate reddens on a re-introduced rent, a re-typed literal, a
`vh` panel-cap, or a second `.progress-bar` definition — the exact residue E.W3
removes (inv ε). No glass-ui token is patched in the demo (inv-16 — the demo OWNS
its `.gold-shimmer` copy); the `.rainbow-vivid`/`.rainbow-pastel` recipes stay
glass-ui-owned (D.W2 §Folds).
