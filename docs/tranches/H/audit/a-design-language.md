# Tranche H Deep Audit — Lane A: Design Language

**Scope:** `demo/@/styles/{design-idioms.css, brand.css, style.css}` (`utils.css` is GONE — folded into style.css `@layer utilities`, D.W2.S2; the `demo/CLAUDE.md` tree still lists it — stale doc, see F-A12). The cartoon-shadow vs radial-specular axis, φ-typography, glassmorphism, color/gold tokens, the z-scale. Cohesion + the D2/D7 regressions. Gestalt consolidation.

**Method:** read the three style files + the glass-ui published tokens/utilities (`node_modules/@mkbabb/glass-ui/dist/styles/{tokens,utilities,components}.css`), drove the live demo at `localhost:5174` (`/`, `/easing`) with playwright, inspected the live CSSOM + computed styles for every claim.

**The spine (binding):** no quick fixes / no legacy beside its replacement / idiomatic gestalt / MEASURE-FIRST / cite a `file:line` or live observation per claim / honest ALREADY-SOTA.

---

## 0. The intended design language (what the demo is reaching for)

Triangulating from the tokens, the live render, and the prose comments, the demo's deliberate identity is a **"paper-and-glass"** system, inherited wholesale from `@mkbabb/glass-ui` and given a demo-specific accent layer:

1. **Glass surfaces** — frosted Cards/docks (`glass-resting`, `glass-card`, `backdrop-filter`) with a **specular catch-light** on the top edge and a mouse-tracked highlight. tokens.css:680-686 (`--glass-specular`).
2. **Cartoon depth** — glass-ui's *signature* is the **cartoon offset shadow** (tokens.css:474-476: "cartoon offset is the signature"), plus `.depth-text` (a 5-step layered text-shadow) for headings. This is the "paper" half of paper-and-glass.
3. **φ-ladder typography** — a golden-ratio type scale (`--type-display-{1..4}`, `--type-title/heading/...`), rendered in Instrument Serif (`--font-display`, style.css:53). Live tokens are genuinely φ-derived: display-1 `1.618rem`, title `2.058rem`, display-3 `2.618rem`, display-4 `3.33rem`→`5.382rem` (live CSSOM read), each rung ≈ ×√φ (1.272).
4. **A playful accent layer the demo OWNS** — the `--rainbow-*` six-colour family + `--color-gold` ramp + the gold shimmer, localized into design-idioms.css (D.W2.S1) so the demo doesn't rent them from glass-ui by accident.
5. **A documented z-contract** — semantic `z-*` utilities, no raw `z-[N]` (style.css:11-37).

**Where it has drifted:** the demo currently leans almost entirely on the **glass + radial-specular** half and has *dropped the cartoon-depth half on its panels*. The cartoon idiom survives only on the hero text (`depth-text`) and one editor (`cartoon-surface` on CSSCodeEditor.vue:6). The result is the D2/D14 complaint: a mouse-tracked radial blur everywhere, no honest depth. The two halves of "paper-and-glass" have come unbalanced.

---

## 1. D2 / D14 — the radial-specular hover artifact (ROOT-CAUSED) · glass-ui-HANDOFF + demo opt-in

**This is the headline finding for the lane.** The "strange circular/radial blur on hover everywhere" is glass-ui's **`.glass-specular-track::before`**, a *mouse-following radial-gradient* default that the glass `Card` and `dock-icon-button` components apply automatically.

**Live evidence (CSSOM read on the running demo, `/easing`):**
```
.glass-specular-track::before {
  background: radial-gradient(circle at var(--specular-x,50%) var(--specular-y,50%),
              hsl(40 30% 100% / .55) 0%, hsl(40 30% 100% / .22) 22%, transparent 55%);
  mask-image: radial-gradient(circle at …, black 0%, black 55%, transparent 75%);
  opacity: var(--specular-intensity, .35);   mix-blend-mode: screen;
}
.glass-specular-track:hover::before  { --specular-intensity: .6; }
.glass-specular-track:active::before { --specular-intensity: .85; }
.dark .glass-specular-track::before  { --specular-intensity: .22; }
```
`--specular-x/y` are driven per-pointer by glass-ui's `useGlassRenderer` (`node_modules/@mkbabb/glass-ui/dist/useGlassRenderer-Dn3WpfG-.js` — found via grep for `mouse-x`). The soft mask (`black 55% → transparent 75%`) is the feathered edge that *reads as a blur*.

**Who applies it (live):** 7 elements carry `glass-specular-track` on `/easing` — the 4 panel Cards (`glass-resting glass-specular-track`) + 3 dock buttons. **The demo source applies it NOWHERE** (`grep -rn 'glass-specular' demo/` = 0 hits outside dist); it is a **glass-ui component default**.

**The user's clarification (D14):** "the glass is good; reconcile with the cartoon-shadow depth — a refined specular hover, not a broken radial blur." So the fix is NOT "remove glass." The defect is specifically that the radial is (a) **too intense** (0.55 white core at `screen` blend = a visible white smear), (b) **too large/soft** (55% radius, 75% mask feather = covers a big fraction of small controls), and (c) **carries the whole hover read alone** — there is no companion cartoon-shadow lift, so hover = "a blur appears" instead of "the surface rises."

**Gestalt fix (two motions, both idiomatic):**
- **glass-ui-HANDOFF:** the radial specular at `opacity .35` resting / `.6` hover with a 55%-radius `screen`-blend white core is too aggressive as a *default*. Suggest glass-ui (a) make the *resting* specular a thin top-edge catch-light only (it already ships `--glass-specular` = `inset 0 1.5px 0 0 hsl(0 0% 100%/.45)`, tokens.css:685 — a crisp edge, not a radial smear) and reserve the *mouse-tracked radial* for an explicit `glass-specular-track` opt-in at a **lower** core α (≈0.25) and tighter radius (≈35%). Tag glass-ui-HANDOFF. **Do NOT patch glass-ui inside kf.**
- **SHIP-in-H (demo side):** **restore the cartoon-shadow as the panel depth/hover treatment** (it was CLOSED in Tranche C — this is the regression D2 names). glass-ui ships the whole family: `--shadow-cartoon-{sm,md,lg}` (tokens.css:543-551) + `.shadow-cartoon-{sm,md,lg}` utilities (utilities.css:617-646) — a token-driven offset box-shadow + 2px bezel border + static lift, dark-mode-aware via `--shadow-color`. Apply `shadow-cartoon-md` (or a hover-lift composition) to the demo's `glass-card` panels so the resting state has honest paper depth and hover *rises the card*, with the specular reduced to a quiet edge catch-light. **One motion: the panels become paper-and-glass, not glass-and-blur.**

**Instrument (proof gate H can hold):**
- `proof:specular` — a visual lock: screenshot a `glass-card` panel at rest + hover; assert the hover delta is dominated by a *shadow/translate* change (cartoon lift), and the specular `::before` computed `opacity` at hover is ≤ 0.4 (not 0.6) and core radius ≤ 40%. Falsifiable: if glass-ui ships `--specular-intensity:.6` hover, the gate fails until the demo opts down or glass-ui ships the calmer default.
- `proof:cartoon` — assert every `.glass-card` in the demo resolves a non-`none` `--shadow-cartoon-*` (or `.shadow-cartoon-*` class present), so a glass-ui rename of the cartoon family is caught.

**Disposition: SHIP-in-H (demo: restore cartoon depth + dial specular down) + glass-ui-HANDOFF (calmer specular default).**

---

## 2. D7 — the hero + φ-typography audit (LARGELY ALREADY-SOTA; one sizing nuance)

**The φ-ladder is genuine and correctly wired.** Live token read confirms golden-ratio derivation (§0.3 above). The hero `<h1 class="text-display-4">` (`EditorStartScreen.vue:6`) computes to **86.1px / line-height 94.7px** in Instrument Serif on a 1440px viewport (live `getBoundingClientRect`), with `.depth-text` cartoon layered shadow — the home screenshot shows it rendering large and bold. **This is close to SOTA already**; the φ-ladder + Instrument Serif + metric-matched fallback (style.css:80-87) + `text-wrap: balance/pretty` split (AnimatedText/EditorStartScreen) is exemplary work. Honest ALREADY-SOTA on the *mechanism*.

**Where D7 still bites — the hero is sized fine but mis-COMPOSED:**
- The hero container is `class="… mt-28 h-0 …"` (EditorStartScreen.vue:4) → live `height: 0px, margin-top: 96px`. It's a zero-height overlay grid. On the home screen this floats the title top-left over the cube (fine), but the **subtitle/ellipsis stack collapses onto the zero-height track** and the "..." (D6) sits orphaned on its own line. The user's "properly sized + LARGER" is partly a *layout/rhythm* ask, not a font-size ask: give the hero a real vertical rhythm (a φ-spaced stack: display-4 title → ellipsis → title subtitle → subheading hint) rather than an `h-0` grid that leans on margins.
- **The cubic-bézier header IS undersized (this is the D3 + D7 overlap).** `TimingFunctionPanel.vue:19` uses `<CardTitle class="text-heading">cubic-bézier</CardTitle>` = `text-heading` = `1.618rem` (live: 25.9px). For a panel that is "too MASSIVE" with a header that "should be LARGER," promote the header to `text-title` (2.058rem) or `text-subheading`→`text-heading` consistently, and size the *canvas* down (§3). The header/body proportion is inverted: tiny header, giant canvas.

**Drift to fix (φ usage cohesion):** φ-classes are used unevenly — `text-heading` for both the hero-adjacent cubic-bézier title AND inline `ease` labels (live: both 1.618rem); `text-mono-small` / `text-small` / `text-mono-caption` appear ad-hoc in TimingFunctionPanel. There is no *single* mapping of "panel title rung / panel body rung / caption rung." Gestalt: define the demo's panel type-rhythm as a 2–3 rung contract (title `text-title`, body `text-body`, caption `text-mono-caption`) and apply it uniformly, so a new panel knows its rungs.

**Instrument:** `proof:phi` — assert each `--type-*` rung equals its φ-derived value (lock the ladder against drift); a DOM lint asserting panel `CardTitle`s use a rung ≥ `text-heading` and never a raw `text-[…]`. **Disposition: BOOK the hero-rhythm recompose (D7 layout) + SHIP-in-H the cubic-bézier header rung bump; ALREADY-SOTA on the ladder mechanism.**

---

## 3. D3 — the cubic-bézier / easing editor sizing + inner border (root in the panel, not the tokens)

Not a token defect; a *composition* defect in `TimingFunctionPanel.vue`. The `<Card plain class="grid gap-0 w-full p-0">` (line 17) sets `gap-0` between the `CardHeader` (`pb-1`) and the `EasingCurveCanvas`, so **the canvas's own grid border butts flush against the header** (the "inner border touches the top of the cubic-bézier header"). And the canvas has no height cap → "too MASSIVE."

**Gestalt fix:** give the Card a real internal rhythm — header rung up to `text-title` (§2), a φ-spaced gap (`gap-2`/`gap-3`, not `gap-0`) between header and canvas, and cap `EasingCurveCanvas` to a `clamp()`/`aspect-ratio` so it doesn't dominate. This is a styling-cohesion fix that belongs to the controls lane, but the *type-rung + spacing-token* decisions are design-language. **Disposition: SHIP-in-H (coordinate with controls lane).** Instrument: `proof:bezier-panel` visual lock — header font-size ≥ `--type-title` and a non-zero gap between header bottom and canvas top.

---

## 4. D1 — controls grid two-column → one-column (design-language adjacent)

Live `getComputedStyle` + source: `AnimationControlsControls.vue:4` `CardContent class="… grid grid-cols-[auto_1fr] …"` and the panel rows use `grid-cols-[subgrid]` (line 6, 9) + `grid-template-columns: subgrid` (line 294). The `auto_1fr` two-track grid pairs duration|delay, iterations|direction, fill|easing two-per-row. **Fix is one motion:** make the CardContent grid a single column (`grid-cols-1`), and the subgrid rows inherit one track. This is a layout-token decision (the grid contract) so it touches the design language's structural side. **Disposition: SHIP-in-H (controls lane owns the edit; design-language records the single-column grid as the contract).** Instrument: `proof:controls-grid` — assert the controls `panel-content` computed `grid-template-columns` resolves to a single track.

---

## 5. D4 — PlaybackRibbon full-width → match the controls sidebar (a layout-token gap)

**Live measurement:** the ribbon Card renders **1298px wide** while `--controls-pane-width` = **400px** (live CSSOM read on `/easing`). `RibbonBar.vue:2-3` wraps the teleport target in `<div class="… pl-4 pr-7 pb-2"><Card class="overflow-visible glass-card">` with **no width constraint**, and `PlaybackRibbon.vue:2` is `w-full` — so it fills the entire work area. The design-language gap: there is a `--controls-pane-width: 400px` token (design-idioms.css:106, a "COUPLED layout invariant") that the controls column already honors, but the ribbon doesn't reference it. **Gestalt fix:** constrain the ribbon to `max-width: var(--controls-pane-width)` (or place it inside the same column track), so the scrubber and the sidebar are isomorphically wide — DRY through the existing token, no new literal. **Disposition: SHIP-in-H.** Instrument: `proof:ribbon-width` — assert `ribbonCard.width ≤ controls-pane-width` at lg.

---

## 6. D6 — the typing dots (`dot-fade`) are broken (ROOT-CAUSED) · SHIP-in-H

**Root cause (source + live):** `AnimatedText.vue` was refactored (F.W16.S2) to split text by **whitespace** into WORD spans: `props.text.split(/\s+/)` (AnimatedText.vue ~line 60). The hero passes `:ellipsis="..."` and `class="dot-fade depth-text"` (EditorStartScreen.vue:17). `"..."` contains **no whitespace**, so it collapses into **one single word-span** carrying all three dots. Live confirm: exactly ONE `.dot-fade` element, `textContent === "..."`, `animation: dotFade`, sampled `opacity 0.73` — the **whole "..." blob fades 0→1→0 as one unit** (`@keyframes dotFade { 0%,100%{opacity:0} 50%{opacity:1} }`, AnimatedText.vue:99-107). It was *designed* to stagger per-dot (the `animationDelay: index*offset` per span) but the word-split defeated the stagger — three dots are now index 0 only. **This is exactly the kind of regression the spine warns about: a refactor (word-granular) silently broke a sibling affordance (per-dot fade).**

**Gestalt fix (idiomatic, no workaround):** the ellipsis is a *special case* of AnimatedText where the unit is the *glyph*, not the word. Either (a) give AnimatedText a `granularity: 'word' | 'char'` prop and pass `char` for the ellipsis (the dots split to 3 spans, the existing `animationDelay: index*offset` staggers them — the original intent restored cleanly), or (b) — cleaner — make the ellipsis its OWN tiny component / three explicit `<span class="dot-fade">` with staggered `animation-delay`, since "..." is not running prose and doesn't need the word-balance/sr-only substrate AnimatedText carries for the title. (b) is the gestalt move: the ellipsis was never a "word run," forcing it through the word-splitter is the design smell. **Disposition: SHIP-in-H.** Instrument: `proof:dot-fade` — assert ≥3 `.dot-fade` spans with monotonically increasing `animation-delay`, so a future word-split refactor can't silently re-collapse them.

---

## 7. The design-language self-audit — cohesion findings on the three files

### 7.1 `.scale-on-hover` is a NO-LEGACY VIOLATION (duplicate of a glass-ui `@utility`) · SHIP-in-H

design-idioms.css:169-188 defines `.scale-on-hover` with the comment *"the demo's most-used interaction idiom … defined demo-NOWHERE until now."* **This claim is false.** glass-ui ships it as a first-class **`@utility scale-on-hover`** (utilities.css:680-690), with the *identical* recipe (scale longhand, `--scale-hover`, `--duration-fast`/`--ease-standard`) — promoted, per its own comment, *specifically from the 13 keyframes.js demo sites* ("Promoted from consumer-side `hover:scale-105` recipe — 13 sites in keyframes.js demo"). So the demo re-authored the very utility glass-ui already extracted FROM it. Live CSSOM confirms **both** `.scale-on-hover` definitions are present (the demo's inline copy + glass-ui's). This is a replaced-surface-living-beside-its-replacement violation. **Gestalt fix:** DELETE the demo's `.scale-on-hover` block (and its PRM block) from design-idioms.css; consume glass-ui's `@utility` directly (the class name is identical, so callsites don't change). Keep ONLY the `--scale-hover` token if the demo wants to own the magnitude (design-idioms.css:80) — but glass-ui already defaults it (tokens.css §11), so even that is optional. **The file's framing ("the idiom defined demo-nowhere") needs correction — glass-ui now owns it.** Disposition: **SHIP-in-H.** Instrument: `proof:no-dup-utility` — assert the demo CSS contributes ZERO `.scale-on-hover` rules (only glass-ui's @utility resolves).

### 7.2 The `--rainbow-*` / `--color-gold` localization is GENUINE and well-reasoned · ALREADY-SOTA
design-idioms.css:30-137. The demo *does* author two gradient sites (the SVG `#rainbow-gradient` and the `.progress-bar` brush sweep) and the gold shimmer — these are demo-owned recipes, not glass-ui rentals, so localizing the tokens is correct (unlike `.scale-on-hover` which glass-ui owns). The dark-mode gold parity (`.dark { --color-gold… }`, lines 133-137) and the metallic ramp are coherent. Honest ALREADY-SOTA. **No change.** (One nit: re-verify each `--rainbow-*` HSL still matches the glass-ui value it claims isomorphism with — `proof:idioms` clause; cheap to keep honest.)

### 7.3 The `--glow-spread`/`--glow-blur` on `.progress-dot` is NOT the D2 defect · RECORD
D2's *candidate* pointer was design-idioms.css:263-269 (`--glow-spread`/`--glow-blur`/`box-shadow color-mix(--color-progress 40%)`). **That is a different, benign primitive** — the active-playing conic-gradient progress RING with a green glow, driven by `--dot-p` (0–1). It is small, green, and bound to a playing-state, not a hover. The actual "radial blur on hover everywhere" is glass-ui's `glass-specular-track` (§1). Recording so H doesn't chase the wrong rule. **Disposition: RECORD (not the defect; leave as-is).**

### 7.4 `.progress-rail`/`.progress-ball`/`.status-badge`/`.code-token` consolidations are EXEMPLARY · ALREADY-SOTA
design-idioms.css:272-377. These promote genuinely-forked cross-scene primitives (4-way rail/ball drift; byte-identical settled/tracking badges with a silently-forked AA-contrast value) into single parameterized recipes with the AA lineage single-sourced and documented. This is precisely the gestalt-consolidation the spine asks for. Honest ALREADY-SOTA. **No change.**

### 7.5 The z-contract + layout-token corpus is COHESIVE · ALREADY-SOTA
style.css:11-37 (z-contract), the work-area optical-balance offset pair (style.css:98-131), the cycle-free `--dock-band-reserve` derivation, the `--spring-snappy: var(--spring-smooth)` reconcile (style.css:147 — killed the local `linear()` shadow, aliases the canonical spring). This is careful, well-commented, no raw `z-[N]`. Honest ALREADY-SOTA. (The spring alias is relevant to D5/D13 — §8.)

### 7.6 `brand.css` is correctly minimal · ALREADY-SOTA
brand.css is 3 plain-class rules for the recurring `.ppmycota-*` mark, token (`--ppmycota-primary`) kept global in style.css. Correct scope. No change.

### 7.7 The cartoon-depth idiom is UNDER-USED — the core drift · SHIP-in-H
This is the through-line of §0 and §1. glass-ui ships the full cartoon family (`--shadow-cartoon-*`, `.shadow-cartoon-*`, `.cartoon-surface`, `.depth-text`) — the "signature" per its own tokens.css:474. The demo uses `depth-text` (hero) + `cartoon-surface` (one editor) and **nothing else** (`grep` confirms: only CSSCodeEditor.vue:6). The panels are all glass+specular. **Restoring cartoon depth on panels (§1) is the single move that re-balances the language back to "paper-and-glass."** This is the gestalt consolidation the lane recommends as its headline. Disposition: SHIP-in-H.

---

## 8. D5 / D13 — dock/drawer motion (design-language angle only) · glass-ui-HANDOFF

The lag (D5) and the non-springy slow drawer (D13) are owned by other lanes (dock = glass-ui-HANDOFF; drawer = the mobile lane dogfooding `SpringProgress`). **Design-language angle:** the dock press uses `--dock-press-spring: var(--duration-fast) var(--spring-smooth)` (live CSSOM, glass-ui rule on `.dock-icon-button`). `--duration-fast` is `0.2s` and `--spring-smooth` is a generated `linear(…)` spring (live read). If the dock feels laggy, two design-language suspects worth handing off with the dock: (a) the `glass-specular-track` `::before` repaint on every pointer-move (a per-frame `background`/`mask` radial recompute = expensive on a compositor; MEASURE-FIRST), and (b) `backdrop-filter` on the dock combined with the specular `mix-blend-mode: screen` — two expensive paint features stacked. **MEASURE-FIRST** before claiming either is the lag. For D13's "springy + fast" the demo *should* dogfood its own `SpringProgress` rather than a CSS `linear()` token — that's the mobile lane's call, but the design-language note is: the spring vocabulary already exists (`--spring-smooth/--spring-snappy`), so a snappier rung (`--spring-snappy` was aliased to the *calmer* `--spring-smooth` at style.css:147 — for a *fast springy drawer* you want the snappier curve, not the calmer one — flag this alias as possibly over-calmed for the drawer use). **Disposition: glass-ui-HANDOFF (dock lag) + MEASURE-FIRST (specular/backdrop paint cost) + note to mobile lane (drawer spring rung).**

---

## 9. Cross-references to sibling lanes
- **D1 (controls grid), D3 (bézier panel), D4 (ribbon width):** the *edits* live in the controls/components lane; this lane records the **design-language contracts** they should honor (single-column grid; `text-title` panel headers + φ-spaced gaps; `max-width: var(--controls-pane-width)` on the ribbon).
- **D6 (dot-fade):** edit in AnimatedText/EditorStartScreen; design-language note = the per-dot stagger is the intent.
- **D7 hero rhythm:** layout/component lane; this lane = the φ-rung contract.
- **D2/D14 specular + D5 dock:** glass-ui-HANDOFF; this lane = restore cartoon depth on panels (demo-side, SHIP-in-H).
- **F-A12 (doc rot):** `demo/CLAUDE.md` still lists `styles/utils.css` and "rainbow effects, 3D" in utils.css — that file was DELETED (folded into style.css `@layer utilities`, D.W2.S2). Update the tree. **Disposition: RECORD (doc fix).**

---

## 10. Disposition summary

| # | Finding | Anchor | Disposition |
|---|---------|--------|-------------|
| A1 | Radial-specular hover artifact = glass-ui `glass-specular-track::before` (mouse-tracked radial, .55 white core, screen blend) | live CSSOM; glass-ui utilities/components.css; applied by Card+dock defaults | **glass-ui-HANDOFF** (calmer default) + **SHIP-in-H** (restore cartoon depth, dial specular down) |
| A2 | Cartoon-depth idiom under-used — only on hero text + 1 editor; panels are glass+specular only (the core drift) | grep: cartoon only at CSSCodeEditor.vue:6; glass-ui ships full family | **SHIP-in-H** |
| A3 | `.scale-on-hover` duplicates glass-ui `@utility scale-on-hover` (no-legacy violation; the "defined nowhere" claim is false) | design-idioms.css:169-188 vs glass-ui utilities.css:680-690 | **SHIP-in-H** (delete demo copy) |
| A4 | dot-fade typing dots collapsed to one span by word-split refactor | AnimatedText.vue split(/\s+/); live: 1 `.dot-fade` = "..." | **SHIP-in-H** |
| A5 | cubic-bézier header undersized (`text-heading`); canvas oversized; inner border flush (`gap-0`) | TimingFunctionPanel.vue:17-19 | **SHIP-in-H** |
| A6 | Controls grid is `grid-cols-[auto_1fr]` (2-col) → should be 1-col | AnimationControlsControls.vue:4 | **SHIP-in-H** |
| A7 | PlaybackRibbon 1298px vs `--controls-pane-width` 400px | live measure; RibbonBar.vue:2-3 / PlaybackRibbon.vue:2 | **SHIP-in-H** |
| A8 | Hero `h-0` overlay + φ-rung cohesion (no panel type-rhythm contract) | EditorStartScreen.vue:4; live token read | **BOOK** (rhythm) + **SHIP** (rung map) |
| A9 | Dock/drawer motion: specular per-frame repaint + backdrop cost; `--spring-snappy` over-calmed for drawer | live `--dock-press-spring`; style.css:147 | **glass-ui-HANDOFF** + **MEASURE-FIRST** |
| A10 | `--glow-spread`/`--glow-blur` (D2 candidate) is the benign playing-ring, NOT the defect | design-idioms.css:258-269 | **RECORD** (leave as-is) |
| A11 | rainbow/gold/rail/ball/badge/code-token consolidations + z-contract + layout tokens | design-idioms.css:272-377; style.css:11-37 | **ALREADY-SOTA** (no change) |
| A12 | `demo/CLAUDE.md` still lists deleted `styles/utils.css` | demo/CLAUDE.md tree | **RECORD** (doc fix) |

**Lane verdict:** the design-language *foundation* (φ-ladder, z-contract, token consolidations, brand) is strong and in several places exemplary. The drift is **one structural imbalance** — the "paper" (cartoon-depth) half of paper-and-glass was dropped on the panels while the "glass" half over-extended into a mouse-tracked radial-specular default. The headline gestalt move is **§1+§2.7: restore cartoon-shadow as the panel depth/hover treatment and dial the specular back to a quiet edge catch-light** — one motion that fixes D2/D14, re-balances the language, and lets the remaining D-items (D1/D3/D4/D6/D7) land as clean rung/layout-token corrections.
