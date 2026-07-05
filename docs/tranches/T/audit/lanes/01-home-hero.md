# Lane 01 — home/hero (VERDICT #2, #3, #6 · shots 02, 03, 06, 18)

> DESIGN LANE. Captures re-run live against the current built tree
> (`dist/gh-pages`, playwright 1440×900 + 375×812, light + dark —
> `shots-01/home-1440.png`, `shots-01/home-1440-dark.png`, `shots-01/home-375.png`;
> the dark capture reproduces the owner's shots 03/18 state pixel-for-pixel in
> kind). All measurements below are from the live DOM probe, not vibes.

## Current state — the measured census (1440×900)

| Element | Measured | Source |
|---|---|---|
| `h1.hero-display` | rect y=21, h=163 (jammed at the very top); Instrument Serif **177.4px weight 600** | probe; `EditorStartScreen.vue:24,47` |
| Top dock (collapsed circle) | rect x=693–747, y=43–105 — paints **inside** the hero's line box (over the "ni" of "animation") | probe; owner shot 18 shows the expanded pill `Home ⌄ | @mbabb` atop the same glyphs |
| Cube gesture legend | dashed `DRAG: ORBIT… DOUBLE-TAP: ROLL THE DIE` box renders **through** the hero glyphs at top-right | shots 03/18 + `home-1440-dark.png` |
| Hero word spans | **3** (word-granular F.W16), delays 0 / 0.2 / 0.4s, cycle **5.8s**, lift only in the first 10% → ~0.6s of motion then **~5.2s dead** | probe (`liftDown … 5.8s infinite`); `AnimatedText.vue:62-92` |
| Hero glyph color (dark) | `.depth-text` recolors to `--primary` = `oklch(73.9% .134 318.1)` (lilac) + 4-step hard offset stamp + ambient tail | probe; glass-ui `dist/styles/utilities/base-misc.css:32-38` |
| Subtitle "from the list ☰ below…" | **ui-sans-serif italic 700 25.9px** | probe; glass-ui `semantic.css:141-147` (`text-heading` → `--font-text`) + the template's `italic` |
| Hint "or drag M. cubert" | ui-sans-serif italic 600 20.4px, amber | probe |
| `@KEYFRAMES · LIVE` card | present, 384×155 at (56, 637), red dot + red caret, perpetual JS type-in loop | probe; `EditorStartScreen.vue:95-115` |
| Bottom transport (home) | `[│ ↺ 🗑 ▶]` — **dangling divider at the left edge**, play **last**; separator measured at x=648 with nothing before it | probe; shot 06; `TransportDock.vue:111-157` |
| `rx 0° ry 0° rz 0°` readout | present above the transport | VERDICT #5 (cube lane owns removal; noted for composition) |

## Findings

### F1 — The hero is a header, not a hero (VERDICT #3, shots 03/18)

**Defect.** The hero block parks in the TOP BAND (`h1` top y=21 at 1440×900) —
the same band the top dock, the @mbabb pill, and the cube gesture legend
occupy. Three chrome layers and the LCP poster line all collide in the top 180px
while the middle-left of the canvas (y≈200–620) is empty grid.

**Root cause.** `EditorStartScreen.vue:24` pins the overlay at
`lg:mt-[var(--work-area-top-offset)]` — the hero rides the *top* of the
work-area chain, a placement inherited from the editor-shell header era (the
J/K tranches tuned WHICH top offset, never questioned TOP itself). The dock
band and the hero band are the same band by construction.

**Ruling + recommendation.** Owner: "should be lower on the page, more towards
the centre — it's OK if it sits a bit on top of the cube." Re-seat the hero
block on the **φ band**: block anchored so the H1 baseline lands ≈61.8% of the
work-area height, left at the page gutter, `pointer-events: none`, z between
scene and docks. Express it through the existing work-area chain (a
`--hero-band-anchor` derived from `--work-area-top-offset` + a φ share of the
work-area height — NOT a raw vh magic number; the K.W3 M4/C5 lesson already
bans those). Overlap with the cube's lower quadrant is *welcome* (the ruling
says so); overlap with any dock is impossible by construction once the hero
leaves the top band. Same order on mobile: cube in the upper ~45%, hero band
from ~52% (the existing `--type-display-4` mobile rung stays).

### F2 — The hero animation: per-word blip ≠ the original per-char wave (VERDICT #3)

**Defect.** The owner: "the original hero animation is totally broken and
should uplift each individual char" — the word-granular F.W16 split is
**REJECTED**. Measured: 3 word spans, delays 0/0.2/0.4s over a 5.8s cycle whose
keyframes finish moving at 10% — three lumps heave in the first 0.6s, then the
poster is dead for 5.2s. The original (git `cd6dae6~1`,
`src/components/custom/AnimatedText.vue`) split into **per-char** spans at
`index × 0.2s` — a ripple that swept all 19 glyphs continuously across the
cycle. The word rebirth kept the keyframes but destroyed the wave: with 3
delays instead of 19 there is no sweep left to read.

**Constraints the rebirth MUST carry** (the recorded lessons — both are live
gates in `scripts/proof-demo-usability.mjs`):
- **a11y mirror** (F.W16 (a), `proof-demo-usability.mjs:189-234`): one
  `sr-only` span carries "Select an animation" whole; the visual layer is
  `aria-hidden` — AT must never hear the "S…e…l…e…c…t" glyph stream again.
- **X-5 gap** (`proof-demo-usability.mjs:15-25,165-226`): Vue's
  `whitespace: 'condense'` strips whitespace-only text nodes between sibling
  spans — the naive per-char split re-renders "Selectananimation". The
  same-line inter-word gap must stay > 0 by construction, not by a rendered
  space character.

**Recommendation — the two-tier split.** `h1 > [sr-only mirror] +
[aria-hidden visual] > per-WORD wrappers (inline-block,
margin-inline-end: 0.25em except last — the exact X-5 cure, kept) > per-CHAR
spans (inline-block)`. Words own wrapping and the gap; chars own the motion.
Delay = **global char index** (counted across words, so the wave crosses the
whole line, not restarting per word) × ~55ms. One shared cycle ~3.6s:
`translateY(-0.09em)` peak at 6% with an ease-out settle by ~14%, rest to 100%
— the sweep crosses the 17 glyphs in ~0.9s, rests ~2.7s, repeats. Em-relative
lift (the old −10px was rung-blind — invisible at 177px). Transform-only,
PRM → `animation: none` (both existing patterns). Keep `<TypingDots/>` as the
tail — it is already the engine-dogfooded pulse and its faster 1.2s cadence
against the slow wave is the right polyrhythm. **CSS keeps the LCP hero**
(engine-driving the LCP node would gate first motion on the HEAVY chunk);
the dogfood story lives in the dots, one span away.

### F3 — The hero ink is smeared: faux-bold × depth stamp × primary recolor

**Defect.** The glyphs in shots 03/18 (and `home-1440-dark.png`) read blobby,
haloed, lilac. Three stacked causes, none of them the face itself:

1. **Synthesized bold.** glass-ui `typography/semantic.css:69-77` hardcodes
   `font-weight: 600` inside `text-display-mega` (and every `text-display-*`
   rung). Instrument Serif ships **weight 400 only** (`style.css:63` records
   exactly this; `--font-display-weight: 400` exists and nothing consumes it).
   The browser synthesizes the missing 600 → smeared stems at 177px. Measured
   computed weight: **600**.
2. **`.depth-text`** (glass-ui `base-misc.css:32-38`) recolors the run to
   `--primary` — in dark that is `oklch(73.9% .134 318.1)`, the lilac in the
   owner's shots (part of the "latent theme color where none belongs" family)
   — and stamps a 4-step `rgb(13,13,13)` hard offset + soft ambient tail under
   every glyph.
3. The stamp + the perpetual per-word transform means the biggest text on the
   site carries the most paint.

**Recommendation.** The hero is **ink**: `color: var(--foreground)`,
`font-weight: 400` (the face's one true weight), **no `depth-text`** on the
title or the dots. Motion is the hero's ornament; the shadow costume dies.
glass-ui gap (BG/BH ask, VERDICT #27 delineation): `text-display-*` should
consume `font-weight: var(--font-display-weight, 600)` so a single-weight
display face is a token away; until that lands, the kf-side is one scoped
`font-weight: 400` on `.hero-display` — a consume-side face-truth correction,
not a workaround (it dies into the token when glass-ui ships it).

### F4 — The sub-header is bold italic system sans (VERDICT #3 "fonts wrong")

**Defect.** Measured: "from the list ☰ below, then press Play." renders
**ui-sans-serif italic 700** at 25.9px; the hint italic 600 amber. The owner:
"from the list ☰ below… italic system-ish" — confirmed literally: `text-heading`
binds `var(--font-text)` (the demo's native-UI-sans repoint, `style.css:120-125`)
at weight 700, and the template adds `italic` (`EditorStartScreen.vue:70-79`).
Bold-italic system sans under a 177px serif poster is the exact "AI-slop
subtitle" register.

**Recommendation.** The deck lines join the poster's own voice — Instrument
Serif **true italic** (the `ital@1` face is already loaded,
`app/index.html:70`; zero new payload):
- Deck: `--font-display` italic 400 at the `--type-title` rung (32.9px),
  `var(--foreground)`.
- Hint: `--font-display` italic 400 at `--type-heading`,
  `var(--muted-foreground)`.
No `font-weight` above 400 anywhere in the start screen; the ☰ `List` icon
sized to ~0.8em cap-height inline. This makes the whole home ramp ONE family,
two styles, three φ rungs: mega roman → title italic → heading italic muted.

### F5 — The `@KEYFRAMES · LIVE` typing card — REMOVED (ruling, VERDICT #2, shot 02)

The owner: "remove this crap." This is a ruling, not a suggestion — the home is
designed WITHOUT it. Excision footprint (grep-complete):
- `EditorStartScreen.vue:95-115` (markup) + `:154-163` (script wiring) +
  `:233-376` (~140 lines of scoped CSS);
- `demo/@/components/custom/editor-shell/useHeroSourceEgg.ts` (155L, whole file);
- `scripts/proof-design-refinement.mjs` (its egg clauses — the gate must not
  red on the removal it should be gating).

Collateral wins: the card's red dot + red caret leave (the latent-red
vocabulary, VERDICT #16); a perpetual JS type-in interval leaves (VERDICT #19);
the lower-left focal competitor leaves — and the vacancy needs no replacement
because the hero itself moves DOWN into that band (F1). The round-trip moat
story (parse → animate → serialize) belongs in a scene, not floating on home.

### F6 — Transport dock: dangling divider, play last, doubled tooltip (VERDICT #6, shot 06)

Three concrete defects in `TransportDock.vue`:

1. **The superfluous divider on home.** The expanded row is
   `[select/static-name] · divider · Reset · Trash · Play`. On home
   `animationNames = []` and `selectedAnimation` is empty → the `v-else` static
   span (`:111-114`) renders **zero-width**, but the divider (`:119`) renders
   unconditionally — measured dangling at x=648 with nothing to its left
   (shot 06's line). A separator must only exist between two real neighbors:
   the label region AND its divider share one `v-if` (has a name or >1 names).
2. **Play must be FIRST** (ruling). Reorder the expanded row to
   `Play · [divider · name/select when present] · Reset · Trash · [timeline]`,
   and mirror play-first in the `#collapsed` pill (`:174-205`). The rainbow
   play is the primary CTA the hero's deck line points at ("then press Play")
   — it belongs at the reading edge, not behind the trash.
3. **One tooltip authority.** Every button double-labels:
   `IconTooltip text="Clear all & reload"` wraps
   `DockIconButton title="Clear all & reload"` (`:130-131`, same at `:121-122`)
   — the glass tooltip AND the native `title` box render together, the
   "ghost-duplicated" pair in shot 06. Drop the native `title` attrs;
   `IconTooltip` supplies the accessible name. glass-ui note (VERDICT #27): if
   `DockIconButton` requires `title` for a11y, its API should accept
   `aria-label` and document that `IconTooltip` + `title` is a forbidden pair.

### F7 — Composition-level perf note (VERDICT #19 context)

Home currently runs, perpetually: 3 word-lift transforms, 3 engine dot pulses,
the egg's JS typing interval + caret blink + rise animation, the cube's
render loop, and the cursor-light tracker (lane 22). Post-T the count is: 17
char transforms (compositor-only, tiny layers) + 3 dot pulses + the cube. The
egg's interval and the depth-stamp repaints leave entirely. The per-char
rebirth is a perf *improvement* over the egg-era home despite more nodes.

## The target design — "INK ON GRAPH PAPER"

**Direction.** The home is a letterpress proof pulled on the engineer's graph
paper: one enormous Instrument Serif line in true single-weight ink seated at
the golden section, the die tumbling above and behind it, a serif-italic deck
whispering the instruction, and exactly two pieces of glass chrome. Nothing
else. No cards, no legends, no readouts, no shadows-as-costume. The page's
only ornaments are motion (the char wave, the dot pulse, the die) and the
paper itself. This is the register glass-ui's paper/dock system was built for
— "re-designed with glass-ui in mind" here means *fewer* components, correctly
voiced, not more.

**Layout (1440×900 reference).**
```
┌────────────────────────────────────────────────────────┐
│                    [⌂ Home ⌄ │ @mbabb]   ← top dock, alone in its band
│                                                        │
│                      ╭──────╮                          │
│                      │ die  │   ← cube stage, upper-centre (cube lane)
│                      ╰──────╯                          │
│  Select an animation…              ← H1 baseline ≈ φ (61.8%) of work area,
│  from the list ☰ below, then press Play.    left gutter, may kiss the die
│  or drag M. cubert                                     │
│                                                        │
│                 [▶ │ ↺ 🗑]         ← transport, play first
└────────────────────────────────────────────────────────┘
```
- Hero overlay: `pointer-events: none`; gutter `clamp(2rem, 5vw, 4.5rem)`;
  vertical seat via the work-area chain (F1), never a raw offset.
- Z: scene < hero < docks. The top band belongs to the dock alone; the bottom
  band to the transport alone.
- Mobile 375×812: identical order — die upper 45%, hero band from ~52%,
  `--type-display-4` rung, deck lines wrap `balance` (existing K.W3 U-K9 rule
  stays), transport bottom.

**Type ramp** (glass-ui rungs only, one family):

| Slot | Face | Rung | Weight/style | Color |
|---|---|---|---|---|
| H1 | Instrument Serif | `text-display-mega` (mobile: `--type-display-4`) | 400 roman | `--foreground` |
| Deck | Instrument Serif | `--type-title` | 400 italic | `--foreground` @ ~0.85 |
| Hint | Instrument Serif | `--type-heading` | 400 italic | `--muted-foreground` |

**Motion.** The per-char wave (F2 spec) + TypingDots + the die. Load
choreography: chars are ALREADY in place at first paint (no entrance
translate on the LCP), the wave's first sweep IS the entrance; the transport
dock fades up 240ms later. PRM: everything rests.

**What dies:** the typing card (+`useHeroSourceEgg.ts`), `depth-text` on the
hero and dots, the word-granular split, bold/italic system sans, the dangling
divider, the doubled tooltips, the top-band hero seat. (Adjacent rulings that
complete the composition, owned by sibling lanes: the gesture legend layer
(#8), the `rx/ry/rz` readout (#5), the cursor light (#22).)

**glass-ui gap delineation (VERDICT #27):**
- `text-display-*` hardcoded `font-weight: 600` → needs
  `var(--font-display-weight, 600)` (BG/BH ask; kf interim: one scoped 400).
- `DockIconButton` + `IconTooltip` double-label seam → one label authority.
- No gaps otherwise: the whole target home is `GlassDock`, `DockIconButton`,
  `Select`, `IconTooltip`, `StatusDot`, the typography utilities, and the
  paper substrate — all shipped in 4.0.1.

## T recommendations

1. **T-HOME-1 — Re-seat the hero on the φ band** · move the start-screen
   overlay from the top band to a work-area-chain-derived golden-section seat;
   left gutter; pointer-events none; overlap-with-cube allowed
   (`EditorStartScreen.vue:24`) · GATE: at 1440×900 and 375×812 the h1 rect
   intersects NEITHER dock rect AND h1.top ≥ 0.45 × work-area height; zero
   raw-vh/px offsets introduced (grep) · **S**
2. **T-HOME-2 — Per-char uplift rebirth** · two-tier word→char split in
   `AnimatedText.vue`; global-char-index stagger ≈55ms, em-relative lift,
   ~3.6s cycle; sr-only mirror + per-word `margin-inline-end` gap kept; PRM
   rest · GATE: extend `proof-demo-usability.mjs` — char-span count == 17 for
   the default title, delays strictly monotone in global char order, existing
   mirror + same-line-gap clauses stay green, computed `animation-name` present
   per char span · **M**
3. **T-HOME-3 — Hero ink correction** · `font-weight: 400` (scoped, until the
   glass-ui `--font-display-weight` token seam lands — file the BG/BH ask),
   `--foreground` color, `depth-text` removed from title + dots · GATE:
   computed h1 char-span weight == 400 AND color == resolved `--foreground` in
   BOTH themes; zero `depth-text` in `editor-shell/` (grep) · **S**
4. **T-HOME-4 — Serif-italic deck ramp** · subtitle → display-face italic 400
   @ `--type-title`; hint → italic 400 @ `--type-heading` muted; kill the sans
   bold-italic register (`EditorStartScreen.vue:70-79`) · GATE: computed
   `font-family` of every `.start-screen-prose` node begins "Instrument Serif";
   no computed weight > 400 on the start screen · **S**
5. **T-HOME-5 — Typing-card excision** · delete the egg markup/styles/composable
   (`EditorStartScreen.vue:95-115,233-376`, `useHeroSourceEgg.ts`) + its
   proof-design-refinement clauses · GATE: `kf-source-egg|useHeroSourceEgg`
   grep-zero repo-wide; home console-clean; proof roster green post-delete · **S**
6. **T-HOME-6 — Transport: play-first, edge-honest divider, one tooltip
   authority** · reorder expanded row + collapsed pill play-first; label
   region + its divider share one `v-if`; strip native `title` beside
   `IconTooltip` (`TransportDock.vue:111-157,174-205`) · GATE: on home the
   transport's first rendered control is the Play button AND separator count
   == 0; on cube, exactly one separator between name and Play cluster; probe
   shows ≤1 tooltip node per button on hover · **S**
7. **T-HOME-7 — Home two-focal composition gate** · a standing capture gate for
   the whole surface: hero + die are the only focal elements; no legend,
   readout, card, or chrome inside the hero's line boxes · GATE: DOM census on
   home — zero elements matching legend/readout/egg selectors; pixel-diff
   region around h1 contains no dock/legend paint at rest (extend
   `capture.mjs` matrix assertions) · **S**
