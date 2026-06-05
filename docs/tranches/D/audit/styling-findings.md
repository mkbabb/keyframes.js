# D audit — styling lane (design-idioms · uncaging · the φ-ladder leaf-tail)

The styling layer carries one **real latent defect** (idioms referenced
demo-wide but defined demo-nowhere — `--rainbow-*`, `--color-gold`,
`.scale-on-hover`, all resolving today only through the transitive glass-ui
cascade, with zero demo-local definition), a **global monolith** (`utils.css`,
152L) trapping component-specific rules, a scatter of arbitrary-value tailwind +
`!`-overrides that bypass the token system, and the **chronic φ-ladder
leaf-tail** (the body-text tier B and C deferred). All figures below are
`grep`-verified against the live tree — **verified, not asserted** — and one
plan premise is **CORRECTED** here on the evidence (the `@keyframes enter`
claim; see S4).

All findings land in **D.W2** (the design language localized + uncaged).
Isomorphic: pixels unchanged unless highly befitting.

## Findings

| # | Finding | Evidence (file:line) | Severity | Wave |
|---|---|---|---|---|
| S1 | `--rainbow-{red,orange,yellow,green,blue,violet}` — **referenced demo-wide, defined demo-nowhere**; resolves via glass-ui `tokens.css:1042-1048` — an ungated cross-repo rent (paints correctly today; flattens silently if glass-ui renames/drops a token) | uses: `AnimationControlsGroup.vue:185–190` (SVG `<defs>`), `KeyframesEditor.vue:478–484` (brush gradient); demo-local defs: **0 found**; vendor defs: glass-ui `tokens.css:1042-1048` | High | D.W2 |
| S2 | `--color-gold` — **referenced demo-wide, defined demo-nowhere**; resolves via glass-ui `tokens.css:1035` (`--color-gold: var(--gold)`, `--gold` at `:1031`) — an ungated cross-repo rent | uses: `AnimationControlsGroup.vue:82` (`text-[var(--color-gold)]`), `AnimationControlsControls.vue:348` (`color: var(--color-gold)`); demo-local defs: **0 found**; vendor def: glass-ui `tokens.css:1035` | High | D.W2 |
| S3 | `.scale-on-hover` — **referenced 13× across 10 files, defined demo-nowhere**; resolves via glass-ui `utilities.css:677` (`@utility scale-on-hover`) — an ungated cross-repo rent (lifts on hover today; the most-exposed rent) | 13 uses (list below); demo-local defs: **0 found**; vendor def: glass-ui `utilities.css:677` | High | D.W2 |
| S4 | `@keyframes enter` — referenced `utils.css:129`; **IS defined** by `tw-animate-css` (style.css:2). The plan's "no definition" premise is FALSE — corrected here. The real issue is *provenance*: a vendor keyframe driven by a bare `--tw-enter-*` contract in our global CSS | ref: `utils.css:128–132`; def: `node_modules/tw-animate-css/dist/tw-animate.css` `@keyframes enter`; import: `style.css:2` | Low | D.W2 |
| S5 | Component-specific rules trapped in the global `utils.css` monolith | `utils.css:7–45` (`.tab-trigger-*`), `:47–81` (`.btn-playback*`), `:83–108` (`.demo-*`), `:127–132` (`[data-state=active][role=tabpanel]`), `:134–152` (`.ppmycota-*`) | Medium | D.W2 |
| S6 | Arbitrary-value tailwind bypassing tokens (`text-[…]`, `h-/w-/max-h-[…vh]`) | `AnimationControlsGroup.vue:82,161,202`; `EasingSelect.vue:8,29`; `KeyframesEditor.vue:105`; scenes (list below) | Medium | D.W2 |
| S7 | `!`-overrides fighting the cascade — should be scoped CSS | `EasingSelect.vue:8` (`!flex ![-webkit-line-clamp:unset] !overflow-visible`); `AnimationControlsGroup.vue:87` (`!border-transparent`) | Medium | D.W2 |
| S8 | The φ-ladder **leaf-tail** — body-text rungs still raw (`text-sm`/`text-xs`/`text-base`) | **89** word-boundary sites: `text-sm`×21, `text-xs`×57, `text-base`×11 (verified `grep -rnoE "\btext-sm\b|\btext-xs\b|\btext-base\b" demo/ --include="*.vue"`, excluding `dist/` — the SAME instrument the D.W2 S5.2 gate uses; below the plan's ~128 estimate) | Medium (chronic A→B→C) | D.W2 |

## S1–S3 — the ungated idiom rent (the latent coupling risk)

Grep-confirmed: **no definition exists in the demo's own tree** for any of these
three idioms (the demo ships exactly two CSS files, `@/styles/style.css` 188L and
`@/styles/utils.css` 152L, plus per-SFC `<style scoped>`; a search across all of
them for `--rainbow-red:`, `--color-gold:`, `.scale-on-hover {` returns
**NO DEMO-LOCAL DEFINITIONS FOUND**). They are NOT undefined and do NOT paint
empty: all three resolve TODAY through the imported `@mkbabb/glass-ui/styles`
cascade (`style.css:3`) — `tokens.css` + `utilities.css`. The defect is an
ungated, undocumented cross-repo RENT: the demo rents its visual identity from a
sibling's incidental surface with no local contract, no fallback, and no gate, so
it flattens silently if glass-ui renames or drops a token.

- **`--rainbow-*` (6 colours)** — consumed in two SVG/gradient sites, both
  resolving via glass-ui's `--rainbow-*` family (`tokens.css:1042-1048`):
  - `AnimationControlsGroup.vue:185–190` — six `<stop :style="{ stopColor: 'var(--rainbow-{red…violet})' }">` in the `#rainbow-gradient` SVG `<defs>` that the Format paintbrush strokes (`:style="{ stroke: 'url(#rainbow-gradient)' }"`, line 91). The rainbow brush paints correct today — but ungated against a sibling rename.
  - `KeyframesEditor.vue:478–484` — a `linear-gradient(var(--rainbow-red) 0% … var(--rainbow-red) 100%)` brush-sweep, same six-colour ramp.
  The two gradient sites encode the SAME 6-colour ramp twice with no shared LOCAL
  token — both resolving via glass-ui's `--rainbow-*` family, correct today but
  ungated. The fix defines the ramp once locally and both reference it.
- **`--color-gold`** — `AnimationControlsGroup.vue:82` (`text-[var(--color-gold)]`
  on the Format `<Sparkles>` icon) and `AnimationControlsControls.vue:348`
  (`color: var(--color-gold)` in scoped CSS). Both resolve via glass-ui
  (`tokens.css:1035`) and paint the gold accent today — ungated, defined
  demo-nowhere.
- **`.scale-on-hover`** — 13 uses, 10 files, the most-referenced demo idiom with
  zero demo-local definition (the headline of the rent):
  `app/App.vue:44`, `app/scenes/CubeScene.vue:111`, `AnimationMenuBar.vue:97,131`,
  `controls/TimingFunctionPanel.vue:28`, `keyframes/KeyframeCard.vue:17`,
  `keyframes/KeyframesEditor.vue:70,137,152`, `timeline/KeyframeTimeline.vue:96`,
  `editor-shell/EditorShell.vue:17`, `editor-shell/EditorHeader.vue:26`,
  `editor-shell/SharePopover.vue:7`. The hover-lift affordance the whole demo
  reaches for — it lifts on hover today via glass-ui's `@utility scale-on-hover`
  (`utilities.css:677`); the single most-exposed cross-repo rent.

These three are the wave's headline: **define the idioms in ONE localized layer**
(`demo/@/styles/design-idioms.css` per the plan) — the rainbow ramp as a token
set + a `.rainbow-*` utility, `--color-gold` as a theme token, `.scale-on-hover`
as a `transform: scale(var(--scale-hover)) on :hover` rule honoring
`prefers-reduced-motion`. Closing an ungated cross-repo rent by ownership, not
cosmetics — the idioms paint correctly today; D makes their resolution the demo's
own gated responsibility.

## S4 — `@keyframes enter`: the plan premise CORRECTED

The plan books `@keyframes enter` (referenced `utils.css:129`) as a fourth
undefined idiom. **This is false and is corrected here on the evidence** (the
inv-ε discipline — audit the claim, not just the code):

- `utils.css:128–132` applies `animation: enter var(--duration-fast)
  var(--ease-out)` to `[data-state="active"][role="tabpanel"]` with
  `--tw-enter-opacity: 0; --tw-enter-translate-x: 0.5rem`.
- `style.css:2` imports `tw-animate-css` (`package.json:99`,
  `"tw-animate-css": "^1.4.0"`), which **DOES** ship `@keyframes enter`
  (verified: `grep "@keyframes" node_modules/tw-animate-css/dist/tw-animate.css`
  lists `enter` + `exit` + accordion/collapsible/caret), driven by the
  `--tw-enter-*` custom-property contract (verified: the file declares
  `@property --tw-enter-opacity` etc.). The tab-panel slide-in **works**.
- So the real (Low) issue is provenance, not breakage: a hand-written global rule
  reaches into a vendor keyframe via its private `--tw-enter-*` variables instead
  of using the plugin's own `animate-in` utility. D.W2 should re-express this as
  the `tw-animate-css` idiom (`.animate-in.fade-in-0.slide-in-from-left-2` or the
  `@apply` equivalent) when it uncages the `[data-state]` rule from `utils.css`
  (S5) — losing the private-variable coupling, not adding a definition.

## S5 — uncage the global monolith

`utils.css` (152L) mixes genuine global utilities (`.container-inline-size`,
`.icon`, `.is-disabled`, lines 110–125) with **component-specific** rules that
belong in their owners' `<style scoped>`:

- `.tab-trigger-base/-pill/-underline` (lines 7–45) → `AnimationControls.vue`
  (the only consumer — the filing-tab panel).
- `.btn-playback*` (lines 47–81) → the playback ribbon
  (`PlaybackRibbon.vue`/`AnimationMenuBar.vue`).
- `.demo-container` / `.demo-box` (lines 83–108) → the standalone `simple`/`square`
  scenes that lay out on them.
- `[data-state="active"][role="tabpanel"]` (lines 127–132) → `AnimationControls.vue`
  (the tab host) — re-expressed per S4.
- `.ppmycota-*` branding (lines 134–152) → the scene/header that brands.

The `:root { --ppmycota-primary }` (lines 3–5) is a token and stays global (or
moves to `style.css`'s `:root` token block). The move is mechanical — scoped CSS
is strictly more local; no specificity changes if the selectors stay class-based.

## S6/S7 — arbitrary values + `!`-overrides

- **Arbitrary-value tailwind** (S6) bypasses the token scale. Verified sites
  (the viewport-relative ones are the smell — they should be `dvh`/clamp tokens
  or scoped CSS): `text-[var(--color-gold)]` (`AnimationControlsGroup.vue:82`,
  also S2), `max-h-[60vh]` (`:161`), `w-[90vw]` (`:202`), `min-h-[25vh]`
  (`KeyframesEditor.vue:105`), `max-h-[min(24rem,60dvh)]` (`EasingSelect.vue:29`),
  `max-h-[60dvh]` (`ResponsiveSelect.vue:58`), `max-h-[60vh]`
  (`KeyboardShortcutsModal.vue:10`), `min-h-[20vh]` (`CSSPasteDialog.vue:54`),
  plus `text-[var(--ppmycota-primary)]` (`app/App.vue:46`). The `data-[…]:` (×29)
  and `grid-cols-[…]` (×8) are reka-ui state variants / grid templates — **NOT**
  arbitrary values to tokenize (recorded so D.W2 does not over-reach). Target:
  the recurring `60vh`/`60dvh` panel-cap → one `--panel-max-h` token; the rest →
  `@apply` or scoped CSS.
- **`!`-overrides** (S7) — `EasingSelect.vue:8`
  (`!flex items-center … ![-webkit-line-clamp:unset] !overflow-visible` — fighting
  a clamp the trigger inherits) and `AnimationControlsGroup.vue:87`
  (`rainbow-vivid text-white !border-transparent` — fighting a border the active
  state inherits). Both are cascade-fights; the fix is one scoped rule on the
  component that owns the state, not an `!important` at the callsite.

## S8 — the φ-ladder leaf-tail (the chronic, terminated in D.W2)

C closed the **display tier** (58 instrument-serif sites → the semantic ladder,
sweep = 0) but booked the **body tier** forward — the A→B→C chronic. Verified
live word-boundary count across `demo/` (`*.vue`, excluding `dist/`) — the SAME
instrument the D.W2 S5.2 gate uses (`grep -rnoE "\btext-sm\b|\btext-xs\b|\btext-base\b"
demo/ --include="*.vue"`): **89 leaf-tail sites** — `text-sm`×21, `text-xs`×57,
`text-base`×11. (The plan's "~128 body sites" is the pre-C upper-bound estimate;
the live word-boundary figure is 89 — recorded as the actual, not the estimate,
and matching the gate's own grep form so the gate can prove zero against it.)
These are the
body/caption/label rungs that should resolve through the semantic ladder
(`text-body`/`text-small`/`text-caption`) the φ-ladder already establishes, not
the raw tailwind scale. D.W2 is the **terminal migration** — the leaf-tail's last
home; the wave's sweep gate asserts the residual raw-rung count goes to 0.

## Verification (re-runnable)

```sh
cd demo
# S1–S3 — demo-local-undefined idioms (zero DEMO definitions; they resolve via the glass-ui/tw-animate-css cascade — the ungated rent):
grep -rn "\-\-rainbow-red:\|\-\-color-gold:\|\.scale-on-hover *{" @/styles app cube square simple amiga playground easing --include="*.css" --include="*.vue" | grep -v "/dist/"
grep -rn "scale-on-hover" --include="*.vue" --include="*.ts" @/ app/ cube/ easing/ | grep -v "/dist/" | wc -l   # → 13
# S4 — @keyframes enter IS shipped by tw-animate-css (premise corrected):
grep -o "@keyframes [a-z-]*" node_modules/tw-animate-css/dist/tw-animate.css | sort -u   # lists "enter"
# S5 — the trapped component rules:
grep -n "tab-trigger\|btn-playback\|demo-container\|demo-box\|ppmycota\|tabpanel" @/styles/utils.css
# S6/S7 — arbitrary values + bangs (src only):
grep -rEn 'text-\[|max-h-\[|min-h-\[[0-9]|!flex|!border|!overflow' --include="*.vue" @/ app/ | grep -v "/dist/"
# S8 — the leaf-tail count (→ 89, the SAME word-boundary form the D.W2 S5.2 gate uses):
grep -rEo '\btext-sm\b|\btext-xs\b|\btext-base\b' --include="*.vue" @/ app/ cube/ square/ simple/ amiga/ playground/ | grep -v "/dist/" | wc -l
```

**Hard gate for D.W2** — `proof:idioms`: a checked-in instrument that
(a) asserts each demo-referenced idiom resolves from the DEMO'S OWN built output
(`design-idioms.css`'s contribution), not merely somewhere in the merged
cascade — falsifiable by stubbing `design-idioms.css` (then the computed values
fall back to glass-ui or empty and the assertion reds), matching D.W2 S5
clause 1; (b) greps `utils.css` and asserts ZERO component-specific selectors
remain (the monolith uncaged); (c) the leaf-tail sweep `grep -rnoE
"\btext-sm\b|\btext-xs\b|\btext-base\b"` returns 0 over the body surface (the
chronic terminated). The gate reddens if any idiom resolves only via the
sibling cascade (no demo-local definition) or a raw rung re-appears. The idioms
resolve TODAY via the glass-ui cascade — the gate bites on the absence of a
demo-LOCAL definition, not on a blank render.
