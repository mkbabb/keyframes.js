# Lane 31 — Font Census (technical; feeds Lane 9's design)

> Owner rulings this lane grounds: #3 ("sub-header fonts wrong … italic
> system-ish"), #16 ("the sub-header hero and dropdowns are mostly wrong"),
> #24 ("Most of the fonts on the site are not right at all … Ensure ALL
> fonts, sizes, etc are consistent"). This lane does not design the fix
> (Lane 9 owns that) — it is the raw, live, `getComputedStyle` truth table
> plus the exact cascade entry point for every rendering signature, so Lane
> 9's design and any T-wave gate rest on measurement, not vibes.

## Method

Live probe against the **built** `dist/gh-pages` (current — no source file is
newer than `dist/gh-pages/index.html`), through the shared
`scripts/lib/demo-driver.mjs` harness (`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`,
`KF_REQUIRE_BROWSER=1`), the same harness `proof:font-census`/`proof:demo-fonts`
use:

- **Desktop pass** — 1440×900, all 10 scene routes (`home, cube, amiga, square,
  easing, spring, sequence, motion-path, morph, compose`), each in three
  states — `base` (landing), `panel-open` (`openControlsPanel()` — the first
  animation selected + a controls tab open), `dropdown-open` (every
  `[role=combobox]`/`[aria-haspopup=listbox]`/`.dock-select-trigger` clicked
  in turn, contents censused, `Escape`d). **1070 visible text leaves** censused
  (every element with a non-empty direct text node, visible per bounding-rect +
  `opacity`/`display`/`visibility`), each recorded with its resolved
  `fontFamily`/`fontSize`/`fontWeight`/`fontStyle`/`letterSpacing`/`textTransform`
  and a best-effort selector signature (`aria-label` → `id` → first class →
  tag). Grouped by exact `(family-voice, size, weight, style, letter-spacing)`
  tuple → **50 distinct rendering signatures**.
- **Mobile spot-pass** — 390×844, `hasTouch`/`isMobile`, on `home`/`cube`/`easing`
  (hero-floor + dock-band + gesture-legend confirmation).
- **Gate re-run for ground-truth** — `KF_REQUIRE_BROWSER=1 npm run
  proof:font-census` and `proof:demo-fonts`, live, both **PASS** (histogram
  quoted in Finding F-ROOT below) — the census in this lane is a
  **superset** of what those gates assert (they assert family-voice
  membership only; this lane also asserts size/weight/style/role).
- Script: `/private/tmp/.../scratchpad/font-census-31.mjs` (ad hoc, not
  committed — ephemeral probe, mirrors `scripts/proof-font-census.mjs`'s
  `CENSUS_FN` shape but keeps full style detail instead of collapsing to a
  pass/fail voice bucket).

No file outside `docs/tranches/T/audit/lanes/` was modified to produce this
census — read-only probes against the already-built `dist/gh-pages`.

---

## The intended ramp (as declared, not as rendered)

Three tokens are the demo's *stated* font-family authority
(`demo/@/styles/style.css:70-141`):

| Token | Value | Declared role |
|---|---|---|
| `--font-display` | `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif` | display voice — only weight **400** is ever fetched (`demo/app/index.html:70`: `family=Instrument+Serif:ital@0;1` — no `wght@` axis at all) |
| `--font-mono` | `"Fira Code", monospace` | data/code/telemetry voice |
| `--font-stack-text` (→ `--font-text`/`--font-sans`) | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | body voice — the reclaimed native UI sans (glass-ui's own `"Plus Jakarta Sans"` default is banned here) |

glass-ui's φ-ladder (`node_modules/@mkbabb/glass-ui/dist/styles/typography/{scale,semantic}.css`)
is the size/weight source every demo class ultimately reads:

| glass-ui token | Value | Evaluated px (1440w) | Weight baked into the utility that reads it |
|---|---|---|---|
| `--type-admin-label` | `0.625rem` | 10px | `text-admin-label` → mono, 500, uppercase |
| `--type-micro` | `0.6875rem` | 11px | `text-micro` (no forced family) |
| `--type-caption` | `clamp(0.75rem, 0.71rem+0.21vw, 1rem)` | ~12.2px | `text-caption` → body, 400, **italic** |
| `--type-small` | `clamp(0.875rem, 0.8rem+0.25vw, 1.25rem)` | ~14.4px | `text-small` → body, 400 |
| `--type-body` | `clamp(1rem, 0.92rem+0.27vw, 1.375rem)` | ~16.4px | body cascade default |
| `--type-prose` | `clamp(1.125rem, 1.04rem+0.28vw, 1.5rem)` | ~20.67px | `text-prose` → body, 400 |
| `--type-subheading` | `1.272rem` (√φ, **fixed**) | 20.352px | `text-subheading` → body, 600; `dock-label` → body, 400 |
| `--type-heading` | `1.618rem` (φ, fixed) | 25.888px | `text-heading` → body, 700 |
| `--type-title` | `2.058rem` (φ^1.5, fixed) | 32.928px | `text-title` → body, 700 |
| `--type-display-4` | `clamp(3.33rem, 2.5rem+4vw, 5.382rem)` | 53.28px (mobile floor)…86.1px | `text-display-4` → display, 600 |
| `--type-display-mega` | `clamp(5.382rem, 4rem+9vw, 11.089rem)` | up to 177.4px | `text-display-mega` → display, 600 |
| `--type-tracking-display` | `-0.015em` | (scales with size) | every `text-display-*` rung, uniformly |

**Load-bearing fact for everything below:** glass-ui's own display rungs are
tuned for **Plus Jakarta Sans** (which has real 500/600/700 static weights and
tolerates −1.5% tracking at any size). The demo repoints `--font-display` to a
**single-weight-400** serif without touching the `600` weight baked into every
`text-display-*` utility, without `font-synthesis: none` (zero repo-wide hits),
and without relaxing `--type-tracking-display`. Every finding below is a
downstream symptom of that one unaddressed substitution.

---

## The full rendering-signature table (desktop, 1440×900, 1070 leaves → 50 signatures)

`voice` = classified head of the resolved `font-family` (display=Instrument
Serif, mono=Fira Code, body=native sans; **zero** leaves classified
`forbidden` (Plus Jakarta/Fraunces) or `orphan` — the family-membership gate's
own claim is true, see F-ROOT). Sorted voice, then size descending.

| voice | size | weight | style | letter-spacing | count | example selectors |
|---|---|---|---|---|---|---|
| body | 52px | **650** | normal | −0.52px | 2 | `.spring-readout-primary` |
| body | 32.928px | 700 | normal | −0.8232px | 3 | `.text-title` |
| body | 25.888px | 700 | **italic** | normal | 2 | `.start-screen-prose` (sub-header) |
| body | 21.017px | 400 | normal | normal | 2 | `.mp-traveller-glyph` |
| body | 20.352px | 600 | **italic** | normal | 2 | `.start-screen-prose` (hint) |
| body | 16.4px | 400 | normal | normal | 44 | `span`, `#reka-select-item-text-*` (easing/spring/morph select items) |
| body | 16.4px | 500 | normal | normal | 4 | `span` (motion-path/morph action buttons) |
| body | 14.4px | 400 | normal | normal | 2 | `.morph-glyph-bank` |
| display | 177.424px | 600 | normal | −2.661px | 12 | `.lift-down`, `.typing-dot` (home hero) |
| display | 53.28px | 600 | normal | −0.799px | 30 | `.face-numeral` (cube die faces) |
| display | 41.888px | 600 | normal | −0.628px | 16 | `.text-display` (scene watermark titles) |
| display | 20.672px | 600 | normal | 0.413px | 2 | `.kf-pill-tab` (active) |
| display | 20.672px | 400 | normal | 0.413px | 2 | `.kf-pill-tab` (inactive) |
| display | 20.352px | 400 | normal | normal | 19 | `.text-ellipsis`, `.dock-label` |
| display | 20.352px | 600 | normal | normal | 4 | `.dock-label` (in a `dropdown-open` census pass) |
| display | 20.352px | 600 | normal | 1.438px | 10 | `.seq-row-name` |
| display | 18.608px | 400 | normal | normal | 18 | `#v-248` etc. — cube/amiga config-item labels (blend/z-index/enabled) |
| display | 16.4px | 500 | normal | 0.328px | 20 | `span` (Play/Reverse/Pause transport buttons) |
| display | 16.4px | 700 | normal | normal | 1 | `.font-bold` (compose dropdown, selected item) |
| display | 16.4px | 400 | normal | normal | 4 | `span` (compose dropdown, unselected items) |
| mono | 20.672px | 600 | normal | 0.413px | 4 | `.animated-digit` (easing) |
| mono | 20.672px | 600 | normal | −0.207px | 6 | `.metric-badge__amount` |
| mono | 20.672px | 400 | normal | normal | 4 | `.metric-badge__unit` |
| mono | 16.4px | 400 | normal | normal | 151 | field labels (`#v-223` "duration" etc.), general mono chrome |
| mono | 16.4px | 400 | normal | 0.164px | 4 | Gallery button label |
| mono | 16.4px | 700 | normal | 0.164px | 4 | Gallery button glyph |
| mono | 16.4px | 300 | normal | 2.952px | 6 | `.metric-badge__label` |
| mono | 16.4px | 600 | normal | −0.164px | 4 | `.metric-badge__amount` (motion-path/morph variant) |
| mono | 16.4px | 500 | normal | 1.64px | 6 | `.btn-pill` (compose) |
| mono | 14.384px | 400 | normal | 0.144px | 31 | `.gesture-legend__label` |
| mono | 14.384px | 400 | normal | 1.438px | 58 | `.square-live-caption`, `.text-mono-caption`, `.curve-physics-tell`, `.readout-accent` |
| mono | 14.384px | 400 | **italic** | 1.438px | 8 | `.easing-readout-value`, `.curve-physics-character` |
| mono | 14.384px | 400 | normal | normal | 23 | `.ml-auto` (EasingSelect descriptor), `.code-token` |
| mono | 14.384px | 500 | normal | 1.438px | 8 | `.text-mono-caption` (spring variant) |
| mono | 14.384px | 400 | normal | 2.589px | 2 | `.seq-eyebrow` |
| mono | 14.384px | 300 | normal | 1.438px | 4 | `.metric-badge__label` (motion-path/morph) |
| mono | 14.384px | 600 | normal | 1.438px | 3 | `.text-mono-caption` (compose) |
| mono | 14px | 400 | normal | normal | **435** | Monaco `.line-numbers`/`.mtk*` (the CSS keyframes editor) |
| mono | 14px | 700 | normal | normal | 6 | Monaco `.mtk6` (`@keyframes` keyword token) |
| mono | 12.8px | 400 | normal | normal | 2 | `code` (home hero-egg source block) |
| mono | 12.8px | 600 | normal | 0.512px | 21 | `.face-axis-tag` |
| mono | 12.48px | 400 | normal | 0.25px | 20 | `.cube-attitude`, `.cube-attitude__axis` |
| mono | 12.226px | 400 | normal | 1.438px | 27 | `.gesture-legend__glyph` |
| mono | 11px | 400 | normal | 0.66px | 2 | `.kf-source-egg__label` |
| mono | 11px | 400 | normal | normal | 10 | `.kf-source-egg__out-arrow`, `.ml-auto` (glass-ui `LabeledSelect` descriptor) |
| mono | 10px | 600 | normal | normal | 3 | `.amiga-telemetry-label` |
| mono | 10px | 400 | normal | normal | 6 | `.amiga-telemetry-value/-unit` |
| mono | 10px | 500 | normal | 1px | 6 | `.status-badge` |
| mono | 10px | 500 | normal | 0.8px | 4 | `.easing-instrument-label` |
| mono | 10px | 600 | normal | 1px | 3 | `#reka-select-group-*` (select group headers) |

**Voice totals (all 1070 leaves, 3 states × 10 scenes):** display 138 · body 61
· mono 871. Excluding the Monaco code editor's own inherent 441 mono leaves
(`.mtk*`/`.line-numbers` — textbook-correct, code IS mono), **430 non-editor
UI-chrome leaves across 63 distinct selectors still render mono** — labels,
dropdown items, badges, legends, telemetry — more than display+body combined
(199). Mono is the demo's *de facto* UI voice, not merely its code voice.

---

## Per-surface truth table (curated, role-grounded)

| Surface | Rendered | Intended/nearest token | Verdict | Cascade entry |
|---|---|---|---|---|
| Home hero ("Select an animation") | Instrument Serif **600**/177.4px, ls −2.66px | `text-display-mega` (glass-ui, 600 tuned for Plus Jakarta) | **Synthesized faux-bold** — only wght 400 loaded | `EditorStartScreen.vue:47` (`text-display-mega`) → `typography/semantic.css:66-74` (weight:600 hardcode) |
| Home sub-header ("from the list…") | native sans **700 italic**/25.9px | `text-heading` (glass-ui, 700, no italic) | **Bold-italic hand-authored on top of an already-bold utility** | `EditorStartScreen.vue:70` (`class="… text-heading … italic"`) |
| Home hint ("or drag M. cubert") | native sans **600 italic**/20.35px | `text-subheading` (glass-ui, 600, no italic) | Same pattern one rung down | `EditorStartScreen.vue:76` |
| Cube die-face numerals | Instrument Serif 600/53.28px | `text-display-2`/`-4`-family rung | Faux-bold again, on a 3-digit numeral where a tabular mono would suit better | `demo/scenes/cube/CubeTarget.vue` `.face-numeral` |
| Cube attitude readout ("rx 0° ry 0° rz 0°") | Fira Code 400/12.48px | n/a — VERDICT #5 wants this **removed**, not restyled | Present | `demo/scenes/cube/*` `.cube-attitude` |
| Dock band, base state | Instrument Serif 400/20.35px | `--font-display` via the demo's own override rule | **Matches intent** (K.W2 S2 cure holds) | `demo/@/styles/style.css:632-636` `@layer demo-typography .dock-label` |
| Dock band, selected-animation label | Instrument Serif **600**/20.35px (`font-semibold` added) | same `.dock-label` rule, no weight variant defined | **Ungoverned per-site bold** — one call site manually bolds; no `[data-state]`-driven rule the way tabs do it | `TransportDock.vue:175` (`class="dock-label … font-semibold"`) |
| Cube/amiga control field labels ("duration", "delay", "iterations") | Instrument Serif 400/18.6px | none — a **display-optical face at control size** | Spindly at 18.6px; no glass-ui utility puts display there | `AnimationControlsControls.vue` labels (`#v-*` generated ids) |
| Play/Reverse/Pause buttons | Instrument Serif **500**/16.4px | `--font-display` (K.W2 S1/S3, single-sourced) | Display voice at button size; weight 500 has no static face — synthesized | `playback-button.css:16-27` |
| Filing tabs (active) | Instrument Serif, weight steps 400→600 on activation | `--font-display` + `[data-state=active]{font-weight:600}` | **Systematic** activation-bold (the RIGHT pattern — contrast with the dock's ad hoc `font-semibold`) | `tab-trigger.css:28-52` |
| KfPillTabs ("Live solver" / "Discrete transition") | Instrument Serif 600(active)/400(inactive), **20.672px** — a *fluid* `--type-prose` value | Visually near-identical to the dock's **fixed** 20.352px `--type-subheading` | **Two different size tokens masquerading as one "big label" rung** — same voice bucket, sub-pixel drift a family-only gate cannot see | `KfPillTabs.vue:93-94` (`font-family: var(--font-display); font-size: var(--type-prose, 1rem)`) |
| Easing/spring/motion-path/morph select items | native sans 400/16.4px | `text-body`/reka-ui default | Matches intent | reka-ui `SelectItem` default, `EasingSelect.vue` |
| Select group headers ("Standard", "Sine", "Quad") | Fira Code 600/10px, uppercase-tracked | `text-admin-label`-shaped | Matches intent (admin-label register) | reka-ui `SelectLabel` + `text-admin-label` |
| Select item trailing descriptor — cube "direction" dropdown ("plays forward") | Fira Code 400/**11px** (`text-micro`) | glass-ui's own `LabeledSelect` component | glass-ui-owned, consistent with its own token | `node_modules/@mkbabb/glass-ui/dist/labeled-field.js:115` |
| Select item trailing descriptor — easing dropdown ("constant velocity") | Fira Code 400/**14.384px** (`text-dropdown-secondary` → `--control-text-sm`) | Same functional role, demo hand-rolled | **Same role, different token, different render size** than the glass-ui-native equivalent one line above — the demo reimplements a component glass-ui already ships, and picks a different secondary-text tier while doing it | `EasingSelect.vue:78` |
| Square live-caption block ("SPRING-CHASED · DRAG THE BOX…") | Fira Code 400/14.384px, ls 1.44px | n/a — VERDICT #11 wants this **removed** | Present | `SquareInstrument.vue:42-55` `.square-live-caption` |
| Easing curve-physics telemetry | Fira Code 400/14.384px (+ one italic variant) | n/a — VERDICT #13 wants this **removed** | Present | `EasingCurvePhysics.vue:33,61,215` |
| Gallery button ("⇢ Gallery") | Fira Code 400(label)/700(glyph)/16.4px | n/a — VERDICT #15 wants this **removed**; if it stayed, it's a 3rd voice beside the dock's display and the tabs' display | Present, and font-inconsistent with its dock siblings | `EasingSidebar.vue` gallery-door |
| Scene watermark title ("MotionPath", "Sequence", "ease", "Transform", "SpringProgress") | Instrument Serif 600/41.888px | `.text-display` | **Matches intent** across 7 of 9 target components | `MotionPathTarget.vue:27`, `SequenceTarget.vue:14`, `EasingTarget.vue:36`, `SquareInstrument.vue:22`, `SpringTarget.vue:42`, `MorphTarget.vue:22` |
| Scene watermark title — spring's starting-style variant ("Hello, spring.") | native sans **700**/32.928px | Same watermark role, but reads `.text-title` (body register) instead of `.text-display` | **Role drift** — the ONE scene target that breaks the 7/9 pattern, invisible to a family-only census (lands in the legitimate "body" bucket) | `StartingStyleTarget.vue:33` |
| Spring primary readout ("1.000") | native sans **650**/52px | none — 650 is not a CSS weight keyword nor any of glass-ui's `--font-weight-{normal,medium,semibold}` (400/500/600) | **A hand-picked magic weight number**, outside the type system, on a variable-font axis the loaded native-sans stack may not even expose | `SpringTarget.vue:293` (`font-weight: 650;`) |
| Motion-path/morph/sequence metric badges (label/amount/unit) | Fira Code, 3 different (size,weight) pairs across the 3 scenes for what reads as the SAME `.metric-badge__*` role | one shared partial, presumably | **Minor drift**: `.metric-badge__label` is 16.4/300 in sequence but 14.384/300 in motion-path/morph; `.metric-badge__amount` is 20.672/600 in sequence but 16.4/600 in motion-path/morph | `SequenceTarget.vue`/`MotionPathTarget.vue`/`MorphTarget.vue` metric-badge partials |
| Compose section prompt ("Pour something in.") | native sans 700/32.928px | `.text-title` | Own role (empty-state prose, not a watermark) — internally consistent | `ComposeTarget.vue` |
| kf-source-egg (the typing @keyframes card) | Fira Code 400, three sizes (11px/12.8px/`--type-micro`) | mono/telemetry register | Matches intent, own quarantined chrome; VERDICT #2 wants the whole card **removed** | `EditorStartScreen.vue:283-368` |

---

## Findings

### F-ROOT — Both live font gates are GREEN; the owner rejected the fonts anyway (the gate-blindspot lesson, 3rd recurrence, now numerically pinned)

- **Defect/opportunity.** Re-ran both gates live against the current tree:
  `npm run proof:font-census` → **PASS** — `histogram (desktop, 9 scenes):
  DISPLAY 50 / MONO 287 / BODY 19 / forbidden 0 / orphan 0 | DOCK DISPLAY 7 /
  SANS 0`; mobile equally clean. `npm run proof:demo-fonts` asserts (a) no
  Plus Jakarta anywhere, (b) display register is Instrument Serif, (c) no
  primary face errored, (d) the resolved face survives a scene switch — all
  green. Every leaf in this lane's own 1070-leaf census also lands in
  `{display, mono, body}` with zero `forbidden`/`orphan`. **The family-voice
  contract these gates encode is, in fact, true.** And the owner still wrote
  "Most of the fonts on the site are not right at all."
- **Root cause.** Both gates assert **family membership** exclusively —
  `classify(fontFamily)` in `scripts/proof-font-census.mjs:124-131` has no
  clause for `fontSize`, `fontWeight`, `fontStyle`, or letter-spacing, and no
  clause binding a *semantic role* (hero vs. watermark-title vs. dropdown
  descriptor) to *one* token. Every defect this lane found — faux-bold serif,
  bold-italic system sans, the two 20.35/20.67px "big label" tokens, the
  `StartingStyleTarget` role drift, the `font-weight: 650` magic number — is
  **orthogonal to family** and therefore invisible to both gates by
  construction. This is the CLAUDE.md-recorded lesson ("green source-shape
  gates miss appearance/interaction/state") recurring for a third time,
  specifically in typography this time.
- **Recommendation.** See T-TY-CENSUS1 — this is the single highest-leverage
  recommendation in this lane: whatever gate T builds to replace/extend
  `proof:font-census` must assert the **full style tuple** (`family × size ×
  weight × style`) **bound to a named role** (hero, watermark-title, dock
  label, dropdown-secondary, …), not family alone.

### F1 — Every display rung renders synthesized faux-bold (corroborates Lane 9 F1, root-cause pinned to the exact token)

- **Defect.** All 138 display-voice leaves in the census render at weight 500
  or 600 (`.lift-down`/hero 600, `.face-numeral` 600, `.text-display` 600,
  `.dock-label`-active 600, playback buttons 500, `.seq-row-name` 600,
  `.kf-pill-tab`-active 600) — **zero** display leaves render at 400, the only
  weight Google Fonts actually serves (`demo/app/index.html:70`:
  `family=Instrument+Serif:ital@0;1`, no `wght@` axis). Every one of those is
  browser-synthesized bold.
- **Root cause.** `typography/semantic.css` hardcodes `font-weight: 600` on
  every `text-display-*` utility (lines 29,65,75,85,95,105,115,125,153) and
  `-0.015em` tracking via `--type-tracking-display`
  (`tokens/scheme-motion.css`) — both tuned for Plus Jakarta Sans's real
  600-weight face. `demo/@/styles/style.css:70` repoints only the *family*,
  never the weight or the tracking, and `font-synthesis: none` appears **zero
  times** repo-wide (`grep -rn "font-synthesis" demo/` — no hits), so the
  browser is never told not to fake it.
- **Recommendation.** See T-TY1.

### F2 — The body register carries a hand-authored bold-italic voice directly under the display hero

- **Defect.** `.start-screen-prose` renders native-sans **700 italic**
  (25.9px) for the sub-header and **600 italic** (20.35px) for the hint — the
  ONLY two italic sites on the entire `display`/`body` surface (mono has two
  unrelated italic captions on the easing page). Both weights already exceed
  `text-heading`/`text-subheading`'s own 700/600 bake-in; italic is added on
  top by hand.
- **Root cause.** `EditorStartScreen.vue:70,76` — `class="… text-heading …
  italic"` / `class="… text-subheading … italic"`. The italic posture is
  layered onto an already-bold utility with no face designed for it (the
  native sans stack's italic is a browser oblique-slant synthesis on most of
  the fallback chain, same synthesis risk as F1).
- **Recommendation.** See T-TY2 — the italic dies with the sub-header
  redesign.

### F3 — Mono is the demo's de facto UI voice, not its code voice (measured, editor-excluded)

- **Defect.** Excluding the Monaco code editor's own 441 inherently-mono
  leaves (`.mtk*`/`.line-numbers` — correct, that IS code), **430 UI-chrome
  leaves across 63 distinct selectors** still render Fira Code: every control
  field label (`duration`/`delay`/`iterations`/`direction`), every dropdown
  item's secondary descriptor, every telemetry/status badge, every gesture
  legend, the Gallery button, the square/easing caption blocks. 430 > 138
  (display) + 61 (body) combined.
- **Root cause.** No register discipline was ever declared for "this is a
  *label*, use body/display" vs. "this is *data*, use mono" — new controls
  default to mono because the earliest telemetry surfaces (cube attitude,
  amiga telemetry) set the precedent and nothing pushed back.
- **Recommendation.** See T-TY3.

### F4 — Two visually-indistinguishable size tokens both claim the "big label" rung

- **Defect.** The dock band's `.dock-label` resolves **20.352px** (fixed
  `--type-subheading`, 1.272rem); `KfPillTabs.vue`'s `.kf-pill-tab` resolves
  **20.672px** at 1440w (fluid `--type-prose`, `clamp(1.125rem, 1.04rem +
  0.28vw, 1.5rem)`). Both are Instrument Serif, both sit at the same optical
  size to the eye, both occupy the same "big control-adjacent label" role —
  and are two different tokens that will diverge further at other viewport
  widths (`--type-prose` is fluid, `--type-subheading` is not).
- **Root cause.** `KfPillTabs.vue:93-94` hardcodes `font-family:
  var(--font-display); font-size: var(--type-prose, 1rem)` instead of reading
  the SAME `--type-subheading`/`dock-label` rung its sibling dock chrome uses
  — a second, independently-invented "big label" size with no shared name.
  Invisible to `proof:font-census` (both are `display` voice; the gate never
  compares sizes).
- **Recommendation.** See T-TY4.

### F5 — The "select-item secondary descriptor" role has two owners, two tokens, two sizes

- **Defect.** glass-ui's own `LabeledSelect` component (used by the cube/amiga
  "direction" field and siblings) renders its trailing description
  (`"plays forward"`) at **Fira Code 11px** (`text-micro`,
  `node_modules/@mkbabb/glass-ui/dist/labeled-field.js:115`,
  `class="ml-auto pl-2 text-micro text-muted-foreground whitespace-nowrap"`).
  The demo's own hand-rolled `EasingSelect.vue` renders the SAME functional
  role (`"constant velocity"`) at **Fira Code 14.384px**
  (`text-dropdown-secondary` → `--control-text-sm`, `EasingSelect.vue:78`).
- **Root cause.** The demo re-implements a select-with-description pattern
  glass-ui already ships as `LabeledSelect`, and in doing so independently
  picked a different secondary-text token — a literal instance of VERDICT
  #27's ask ("Delineate our gaps, and glass-ui's gaps") to act on: this is a
  demo gap, not a glass-ui one — glass-ui already has the component.
- **Recommendation.** See T-TY5.

### F6 — One scene target breaks the 7/9 watermark-title pattern (role drift, invisible to family census)

- **Defect.** Every scene's corner "subject title" (MotionPath, Sequence,
  ease, Transform, SpringProgress, plus morph/square) reads `.text-display`
  (Instrument Serif 600/41.9px) — **except** `StartingStyleTarget.vue:33`'s
  "Hello, spring." which reads `.text-title` (native sans 700/32.9px, the
  BODY register). Same role, one outlier, and because the outlier still lands
  in a legitimate voice bucket (`body`, not `forbidden`), no existing gate
  flags it.
- **Root cause.** `StartingStyleTarget.vue` was authored independently of its
  8 siblings with no shared "scene watermark title" primitive to inherit from
  — each `*Target.vue` hand-picks its own utility class for what is
  structurally the same slot.
- **Recommendation.** See T-TY6.

### F7 — A hand-picked non-standard font-weight (650) sits outside the type system

- **Defect.** `SpringTarget.vue:293` declares `font-weight: 650;` for
  `.spring-readout-primary` (the "1.000" hero numeral) — not 400/500/600/700,
  not any of glass-ui's `--font-weight-{normal,medium,semibold}` (400/500/600,
  `components.css:26-28`), a bespoke number chosen once, on the native-sans
  stack (which may not even expose a 650 static instance — most system UI
  sans fonts are non-variable, so 650 silently rounds to the nearest
  available weight, an untested fallback).
- **Root cause.** No documented weight scale for "an emphatic numeral in the
  body register" — the author reached for a number that felt right rather
  than reusing `--font-weight-semibold` (600, already used elsewhere for
  emphasis) or stepping up to the display voice like every other scene's
  primary numeral does (`.face-numeral`, `.animated-digit`).
- **Recommendation.** See T-TY7 (folds into T-TY1/T-TY3's weight-scale
  consolidation).

### F8 — The dock's own "selected" state re-invents `[data-state]`-driven weight, ad hoc

- **Defect.** `.dock-label` (`style.css:632-636`) declares no font-weight — it
  inherits ambient 400. `TransportDock.vue:175` overrides ONE call site with
  a raw `font-semibold` Tailwind class to bold the selected-animation label.
  Contrast `tab-trigger.css:49-52`, which declares the identical "this is the
  active one, bold it" fact **declaratively**: `.tab-trigger-base[data-state=
  "active"] { font-weight: 600; }` — reusable, discoverable, and the
  `[data-state]` attribute reka-ui already emits for exactly this purpose.
- **Root cause.** No shared "active/selected" weight convention for
  dock-scoped labels; the one call site that needed it improvised locally
  instead of extending the `.dock-label` rule with a state-driven clause.
- **Recommendation.** See T-TY8.

### F9 — A fetched font axis is entirely unused (small, free cleanup)

- **Defect.** `demo/app/index.html:70,75` requests
  `family=Instrument+Serif:ital@0;1` — both the roman AND *italic* axis of
  Instrument Serif. The census found **zero** `display`-voice leaves with
  `font-style: italic` anywhere in 1070 leaves across all states/scenes; every
  italic leaf in the whole site is on the body or mono voice
  (`.start-screen-prose`, `.easing-readout-value`,
  `.curve-physics-character`). The italic half of the Google Fonts payload is
  fetched and never painted.
- **Root cause.** The `:ital@0;1` request was presumably copy-pasted from a
  Google Fonts snippet without pruning to the axis actually used.
- **Recommendation.** See T-TY9 (S-sized, bundle it into whichever T-wave
  touches `index.html`'s font `<link>`).

---

## T recommendations

1. **T-TY-CENSUS1 — Replace the family-only font gate with a role-bound style-tuple gate.**
   Scope: extend/replace `scripts/proof-font-census.mjs`'s `classify()` so
   each asserted surface is a `(role, family, size, weight, style)` tuple —
   e.g. `{role: "hero", family: DISPLAY, weight: 400, style: "normal"}` —
   sourced from a single demo-owned role→token manifest (the thing Lane 9's
   design should emit). Falsifiable gate shape: a leaf whose role manifest
   entry expects `weight:400` but resolves `600` (or any tuple mismatch)
   fails the gate by name, not just by family. Born-RED immediately against
   today's tree (F1/F2/F4/F6/F7 all currently pass the family-only gate and
   would all fail the tuple gate). Size: **M**.
2. **T-TY1 — Kill synthesized-bold display rungs at the token root.**
   Scope: either (a) fetch Instrument Serif's real weight axis if one exists
   upstream, or (b) neutralize `text-display-*`'s baked `font-weight: 600` for
   the demo's single-weight face (a demo-scoped override, not a glass-ui
   patch) and relax `--type-tracking-display` for the swapped face; add
   `font-synthesis: none` at `:root` so any future weight mismatch fails
   silently-visible (thin, not faux-bold) instead of smearing. Gate: no
   display-voice leaf resolves a weight the loaded face doesn't ship natively
   (cross-referenced against `document.fonts` face list). Size: **S**.
3. **T-TY2 — Retire the hand-authored bold-italic sub-header; give the body
   register ONE owned voice.**
   Scope: `EditorStartScreen.vue:70,76` drop `italic`; decide (with Lane 9)
   whether the sub-header stays in glass-ui's body register at its baked
   weight or steps to a lighter demo-owned weight — either way, no manual
   weight/style stacking on top of a semantic utility. Gate: zero `italic`
   leaves on the `display`/`body` voices outside a named allow-list (0 today
   for display; body's two current italic sites are exactly what this wave
   removes). Size: **S**.
4. **T-TY3 — Draw the mono/display/body register line and re-home the 430
   non-editor mono leaves that cross it.**
   Scope: publish the role→voice manifest T-TY-CENSUS1 needs (label vs. data
   vs. identity) and re-home control field labels
   (duration/delay/iterations/…), status badges, and dropdown descriptors off
   mono onto body per the manifest; mono stays for genuinely tabular/numeric
   telemetry and code. Gate: non-editor mono leaf count has a declared
   ceiling the gate enforces (regression-proof against "just add another mono
   label"). Size: **L**.
5. **T-TY4 — Collapse the dock's `.dock-label` (20.352px fixed) and
   `KfPillTabs`'s `.kf-pill-tab` (20.672px fluid) onto ONE named "control
   identity" size token.**
   Scope: `KfPillTabs.vue:93-94` reads the same token `.dock-label` does (or
   both read a new, single `--type-control-identity` the manifest names).
   Gate: the two selectors resolve byte-identical `fontSize` at every tested
   viewport. Size: **S**.
6. **T-TY5 — Replace `EasingSelect.vue`'s hand-rolled descriptor styling with
   glass-ui's `LabeledSelect` (or its documented descriptor token).**
   Scope: either adopt `LabeledSelect` outright for the easing/family select
   (consuming glass-ui, per VERDICT #27) or, if the richer glyph+swatch markup
   genuinely can't fit that component, repoint `EasingSelect.vue:78` from
   `text-dropdown-secondary` to `text-micro` so the two "select-item
   descriptor" sites agree. Gate: every `[role=option]` secondary-descriptor
   leaf sitewide resolves the SAME `(family,size,weight)` regardless of which
   component authored it. Size: **S**.
7. **T-TY6 — Give the 9 scene targets ONE shared watermark-title primitive.**
   Scope: extract the `.text-display` corner-title markup (icon/svg + label)
   duplicated across `MotionPathTarget.vue`/`SequenceTarget.vue`/
   `EasingTarget.vue`/`SquareInstrument.vue`/`SpringTarget.vue`/
   `MorphTarget.vue`/`StartingStyleTarget.vue` into one component (ties into
   Lane 26's "demo/scenes … why aren't these composed into sub-components"
   ask); `StartingStyleTarget.vue` inherits the SAME class the other 6 use
   instead of independently choosing `.text-title`. Gate: all 9 scene-subject
   titles resolve the identical `(family,size,weight)` tuple. Size: **M**.
8. **T-TY7 — Delete the `font-weight: 650` magic number.**
   Scope: `SpringTarget.vue:293` → reuse `--font-weight-semibold` (600) or
   step the spring readout numeral to the display voice like every sibling
   scene's primary numeral (`.face-numeral`, `.animated-digit`) — a decision
   for Lane 9, but the number 650 itself is dead regardless of which way it's
   decided. Gate: zero non-100-multiple `font-weight` literals repo-wide
   (grep-shaped, trivially falsifiable). Size: **S**.
9. **T-TY8 — Make the dock's "selected" bold declarative, matching the tabs'
   `[data-state]` idiom.**
   Scope: replace `TransportDock.vue:175`'s hardcoded `font-semibold` with a
   `.dock-label[data-selected="true"]` (or reka-ui's own state attribute)
   CSS rule beside the existing `@layer demo-typography` block, so the "bold
   when active" fact lives in ONE place for the whole dock band, the same
   shape `tab-trigger.css:49-52` already proves out. Size: **S**.
10. **T-TY9 — Drop the unused Instrument Serif italic axis from the Google
    Fonts request.**
    Scope: `demo/app/index.html:70,75` → `family=Instrument+Serif` (drop
    `:ital@0;1`) once T-TY2 confirms no display-voice surface ever wants
    italic; re-add the axis only if a future design intentionally uses
    display-italic. Gate: the requested Google Fonts URL's `ital` axis is
    absent, OR at least one live leaf resolves `Instrument Serif` +
    `font-style: italic` (no fetch-without-use). Size: **S**.
