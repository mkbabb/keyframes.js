# Lane 09 — Sitewide Theme + Typography (VERDICT #16, #24; touches #3 sub-header, #17/#18 dock+pill fonts)

> Owner rulings carried: "Most of the fonts on the site are not right at all" (#24); "the
> sub-header hero and dropdowns are mostly wrong" (#3/#16); "I don't like this latent red
> theme" (#16); "re-designed with glass-ui in mind"; "Ensure ALL fonts, sizes, etc are
> consistent and properly leveraging glass-ui components" (#24).
>
> Method: live computed-style census over the dev tree (localhost:5180, 1440×900 @2x,
> light + dark) — every visible text leaf bucketed by `getComputedStyle` font signature;
> token snapshot at `:root`; screenshots under `docs/tranches/T/audit/lanes/09-shots/`
> (home/easing/spring/cube × light/dark). Owner shots read: 01, 03, 11, 12, 15, 18.

## The committed aesthetic direction

**"Editorial glass instrument."** One serif display identity (Instrument Serif at its
TRUE weight), glass-ui's own body register underneath it, mono confined to actual
code/data, and ONE accent family — the violet/periwinkle the brand already owns —
riding glass-ui's warm-stone glass. Red exits the chrome entirely and returns to its
documented destructive-only semantic. The crayon palette (cube faces, boing red,
rainbow CTA) stays, but bounded to SUBJECTS, never chrome. Everything sits on glass-ui's
φ type ladder and token vocabulary; the demo's override surface SHRINKS to: one display
face swap + one accent ramp + the crayon signal tokens.

---

## Current-state census (measured, not vibes)

### Loaded faces (all four pages identical)

```
Instrument Serif 400 normal          ← ONE weight. No 500/600 exists.
Fira Code 300–700 (variable)
Instrument Serif Fallback (metric-matched Georgia — fine, keep)
```

Plus Jakarta Sans' woff2 payload IS shipped (base64 in `@mkbabb/glass-ui/styles/fonts`,
imported at `demo/@/styles/style.css:10`) — then **banned from rendering** by the
I.W6-font reclaim (`style.css:114-141`) and gated against by `proof:demo-fonts` clause
(a). The demo pays for a body face it forbids itself from using.

### Type buckets (dominant signatures, live)

| Surface | Signature | What it is |
|---|---|---|
| home hero | **Instrument Serif 177.4px / weight 600 / ls −2.66px** | "Select an animation" — synthesized faux-bold + glow (shots 03/18) |
| home sub-header | **ui-sans-serif 25.9px / 700 / italic** | "from the list ☰ below…" — bold-italic SYSTEM sans (shot 18) |
| home sub-sub | ui-sans-serif 20.4px / 600 / italic | "or drag M. cubert" |
| cube page | **Fira Code 14px ×76 leaves + 16.4px ×12** | matrix cells AND all control labels — mono is the de-facto UI face |
| easing page | Fira Code 16.4px ×10 (labels, telemetry) + 14.4px italic | mono chrome; plus a degenerate `Fira Code 0.055px` SVG-text bucket |
| controls buttons | Instrument Serif 16.4px / **500** | "Play"/"Reverse" — display serif at body size, synthesized weight |
| menu/config items | Instrument Serif 18.6px / 400 | "blend", "z-index", "enabled" — display serif at control size |
| spring readout | ui-sans-serif 52px / 650 | "1.000" — a third voice for the hero numeral |
| dock band | Instrument Serif (forced) | `@layer demo-typography .dock-label` (`style.css:632-636`) |

### Palette snapshot

```
--accent-red:          hsl(0 72% 63%)  light / hsl(5 55% 50%) dark
--color-progress:      = var(--accent-red)          (K.W4 S3 collapse)
--color-slider-track:  hsl(0 60% 78%) / hsl(5 35% 42%)   (red twins)
--ppmycota-primary:    hsl(248 88% 71%)              (brand periwinkle)
--primary:             light-dark(hsl(24 10% 10%), oklch(0.739 0.134 318.1))
                       ← near-BLACK in light, ORCHID in dark: the accent changes identity
--background/--border: warm stone, hue 24–40 throughout
```

168 references to `accent-red|color-progress|slider-track` across 27 demo files.
`demo/DESIGN.md:7` declares the actual contract: **"`--accent-red` for destructive
actions"** — the token's documented semantic, corrupted by K.W4 S3 into the sitewide
motion/progress/selection authority.

One easing surface (09-shots/easing-dark.png; owner shots 11–13) simultaneously carries:
violet curve (248°), orchid slider fill (318°), magenta preview ball, red telemetry
values/red Pause/red rails/red dots (0–5°), gold, a rainbow chip, and warm-tan gridlines
— **six accent identities with no hierarchy**, on red-leaning warm neutrals. That IS the
"latent red theme": red as the only *systematic* accent, amplified by warm-stone
neutrals and red rails, while the actual brand violet appears only incidentally.

---

## Findings

### F1 — Every display rung renders SYNTHESIZED faux-bold serif (the "fonts not right" smoking gun)

- **Defect.** The hero and all display-rung text render Instrument Serif at computed
  weight 600/500 — but only weight 400 is loaded. The browser smears synthetic bold onto
  a delicate condensed serif, then the demo adds a glow shadow: the mushy, "not right at
  all" hero of shots 03/18. Census: `177.4px/600`, `53.28px/600` (cube numerals),
  `41.9px/600` (SpringProgress title), `16.4px/500` (Play/Reverse).
- **Root cause.** glass-ui's display rungs hardcode `font-weight: 600`
  (`node_modules/@mkbabb/glass-ui/dist/styles/typography/semantic.css:29` et seq.) —
  tuned for Plus Jakarta Sans, which HAS a 600. The demo swaps `--font-display` to
  single-weight Instrument Serif (`style.css:70`) without neutralizing the weight or
  declaring `font-synthesis: none` (zero occurrences repo-wide). The `style.css:63-64`
  comment claims "`--font-display-weight: 400` (glass-ui default) is correct" — **that
  token does not exist in glass-ui 4.0.1** (grep: no hits in dist/styles/tokens/): a
  masked consume-edge drift. The rungs' `--type-tracking-display` negative tracking
  (−2.66px at 177px) further crushes an already-condensed serif.
- **Recommendation.** See T-TY1.

### F2 — The body register is unowned: system-ui roulette, worn bold-italic

- **Defect.** The sub-header hero ("from the list ☰ below, then press Play.") is
  bold-ITALIC system sans directly under a serif display — the owner's #3 "sub-header
  fonts wrong". The demo's entire body tier renders whatever the OS ships (SF/Segoe/
  Roboto) — typography that cannot be designed because it is not owned.
- **Root cause.** The I.W6-font reclaim (`style.css:114-141`) replaced glass-ui's body
  face with `ui-sans-serif, system-ui, …`; `EditorStartScreen.vue:70,76` then authors
  `italic` on `text-heading`/`text-subheading`. The italic posture + 700 weight is a
  hand-rolled attempt to give a characterless face character.
- **Recommendation.** See T-TY2. The italic sub-header dies with it.

### F3 — Mono swallowed the UI

- **Defect.** Fira Code is the dominant face by leaf count on every scene page (cube:
  88 leaves; easing: the whole sidebar). Labels, buttons, selects, sliders, legends,
  section headers — all uppercase, letter-spaced mono. Combined with red accents this
  produces exactly the rejected instrument-panel/terminal aesthetic (shots 11, 15).
- **Root cause.** No register discipline: mono was the "telemetry voice" and every new
  control adopted it. glass-ui's own controls typeset labels in the body face; the demo
  overrode them piecemeal (e.g. `KfPillTabs.vue:93` forces `var(--font-display)`;
  sidebar labels hand-set mono).
- **Recommendation.** See T-TY3.

### F4 — Display serif forced onto control-size text (the "dropdowns are wrong" half)

- **Defect.** Instrument Serif — a display-optical face, legible ≥ ~28px — is forced
  onto 16–20px controls: dock labels (`style.css:632-636` `@layer demo-typography`),
  pill tabs (`KfPillTabs.vue:93`), transport buttons (`playback-button.css` /
  `tab-trigger.css` per `style.css:50-52`), menu/config items (census: 18.6px serif).
  At those sizes it reads spindly; with synthesized 500 it reads smudged.
- **Root cause.** K.W2's "single display voice on the dock" decision pushed the display
  face DOWN the ramp instead of keeping it at display rungs. The owner's live verdict
  overrides that K-era call.
- **Recommendation.** See T-TY2 (dock/controls return to the body register); the display
  face retreats to display rungs only (T-TY1's size floor).

### F5 — The latent red theme is a token-level semantic corruption

- **Defect.** Red is the only systematic accent: progress fills, slider rails, preset
  selection (dashed red outline + red dots, shot 15), telemetry values (shot 11), Pause
  button, status badges, scrub tracks (easing-dark capture). The owner rejects it.
- **Root cause.** K.W4 S3 (`style.css:368-390, 402-411`) collapsed `--color-progress`
  → `var(--accent-red)` and minted red rail twins — promoting a token DESIGN.md defines
  as **destructive-only** (`demo/DESIGN.md:7`) into the sitewide motion authority; 168
  consumer references across 27 files inherited it. Warm-stone neutrals (hue 24–40)
  push the whole field further red. Meanwhile the brand's actual accent (periwinkle
  `--ppmycota-primary`, and glass-ui's dark orchid `--primary`) exists but is
  unsystematized.
- **Recommendation.** See T-TH1 — the same token-level lever K.W4 used, pointed at the
  right hue this time.

### F6 — The accent changes identity between themes; six accents collide on one surface

- **Defect.** `--primary` is near-black in light, orchid in dark — interactive accents
  literally change hue family with the theme toggle. One easing surface carries six
  accent identities (census above; easing-dark capture).
- **Root cause.** No demo-owned accent ramp: glass-ui's default `--primary` arms were
  consumed as-is, `--ppmycota-primary` lives as a one-off brand literal, and per-scene
  accents (magenta ball, gold, red) were minted locally.
- **Recommendation.** T-TH1 unifies periwinkle/orchid into ONE oklch accent ramp with
  deliberate light/dark arms.

### F7 — Functional graphics below perceivable contrast

- **Defect.** The easing stage curve renders as a barely-perceptible violet hairline on
  the near-black stage (owner shot 12; 09-shots/easing-dark.png) — the page's SUBJECT is
  its least visible element. Warm-tan gridlines sit close behind it in luminance.
- **Root cause.** Stroke colors chosen as low-alpha brand tints with no non-text
  contrast floor; no gate measures stroke-vs-substrate (the gate-blindspot lesson's
  appearance axis).
- **Recommendation.** See T-TH2 — WCAG 1.4.11 ≥3:1 for functional strokes, gated.

### F8 — Ramp escapes

- **Defect.** Off-ladder sizes leak (12.48, 12.8, 14, 18.6px …), one degenerate
  `0.055px` SVG-text bucket on easing, and a `52px/650` hand-rolled readout numeral —
  beside a φ ladder that already provides every needed rung.
- **Root cause.** Per-component px/rem leaves and transform-scaled SVG `<text>` bypass
  the `--type-*` ladder.
- **Recommendation.** See T-TY4.

---

## The target system (precise enough to implement)

### Families — three voices, hard-bounded

| Voice | Face | Where (and ONLY where) |
|---|---|---|
| Display | **Instrument Serif 400** (+ its true italic for accent words) | `text-display-*` rungs ≥ display-5; the hero (per-char uplift, lane 03's item rides this); scene-title identity. Never below 28px computed. Never a weight other than 400. |
| Body | **Plus Jakarta Sans** — glass-ui's native register, already bundled, zero new payload | ALL chrome: sub-header, controls, buttons, dropdowns/selects, dock labels, pane headings, legends, toasts. Weights 400/500/600 as glass-ui's utilities already declare. |
| Data | **Fira Code** (tnum) | Actual code + data ONLY: keyframe CSS, cubic-bezier strings, numeric readouts, matrix cells. Marked `data-register="code"` (or an equivalent selector contract) so the census can enforce the boundary. |

Implementation shape: DELETE the I.W6 `--font-stack-text` reclaim (`style.css:114-141`)
so glass-ui's Jakarta register flows natively; keep `--font-display: "Instrument Serif"`;
delete `@layer demo-typography .dock-label` (`style.css:632-636`), the `KfPillTabs`
display-face force, and the playback/tab-trigger display binds — those surfaces revert
to glass-ui's own typography. Flip `proof:demo-fonts` clause (a) polarity (Jakarta
becomes the POSITIVE body assertion, `ui-sans-serif`-first becomes the violation).
`font-synthesis: none` at `:root`. Display rungs get `font-weight: 400` where
`--font-display` applies — preferably via a glass-ui BG/BH ask: parameterize the rungs'
weight as `var(--font-display-weight, 600)` (the token `style.css` already believed in);
until then one demo-side `@layer` override on the `text-display-*` utilities.

### Ramp — glass-ui's φ ladder, no new sizes

- Hero: `text-display-mega`, serif 400, `letter-spacing: 0` (kill the Jakarta-tuned
  negative tracking under the serif), NO glow shadow — depth comes from the per-char
  uplift motion, not blur.
- Sub-header: `text-prose`, Jakarta 500, normal posture (the `italic` classes at
  `EditorStartScreen.vue:70,76` die), `text-muted-foreground`.
- Pane/section headings: `text-heading` Jakarta 600.
- Controls/labels/dropdowns/dock: `text-body` / `text-caption` Jakarta 500; caps +
  `--type-tracking-caps` only at caption/micro rungs (glass-ui's existing idiom).
- Values/readouts: Fira Code at `text-body`/`text-caption`, weight 450–500, `tnum`; the
  spring hero numeral becomes `text-display-5` Fira Code 300 (glass-ui's own numeric
  display idiom) instead of hand-rolled 52px/650 sans.

### Accent — one violet authority, red demoted, crayons bounded

- **The accent ramp** (new, demo-owned, expressed as glass-ui token overrides at `:root`
  with `light-dark()` arms): unify `--ppmycota-primary` (hsl 248° periwinkle) and
  glass-ui's dark orchid (oklch hue 318) into ONE oklch family — proposal:
  `--accent-kf: light-dark(oklch(0.56 0.17 295), oklch(0.74 0.13 305))` with hover/
  subtle/foreground companions derived by L±. Same hue family both themes; only
  lightness/chroma arm-swap. `--primary` repoints to it in BOTH arms (the light theme's
  near-black primary dies), `--ppmycota-primary` becomes an alias of it.
- **Motion/progress**: `--color-progress: var(--accent-kf)`; `--color-slider-track`: a
  neutral border-tone (`color-mix` of `--border`), not a red twin. All 168 downstream
  consumers inherit by construction — the same one-token lever K.W4 S3 proved, reversed.
- **Red**: `--accent-red` survives ONLY for destructive/error surfaces (Clear-all,
  delete, error toasts) per DESIGN.md's original contract. Zero red-hue computed accents
  elsewhere (gated).
- **Crayons** (`--rainbow-*`, `--face-*`, `--amiga-red`, `--axis-*`, gold): KEPT, but as
  SUBJECT signal only — the die, the boing ball, derby lanes, the axis triad, the one
  sanctioned rainbow play-CTA. Never on chrome (rails, badges, labels, selection).
- **Substrate**: glass-ui warm stone stays (it is the glass identity); gridlines/graph
  rules move off warm-tan onto neutral `--border` at low alpha so the field stops
  reading red; functional strokes (easing curve, spring traces) ≥3:1 against their
  substrate (curve at ~oklch 0.65+ L on the dark stage).

### What dies (rulings honored)

- The faux-bold display everything; the glow-blurred hero treatment.
- The bold-italic system-sans sub-header voice.
- The dock/pills/buttons/menus in display serif (K.W2's dock-display-voice decision —
  overridden by the owner's live verdict).
- The red motion authority (K.W4 S3 — overridden), red rails, red selection dashes,
  red telemetry values.
- The system-ui body register (I.W6-font — overridden: "properly leveraging glass-ui").

---

## T recommendations

1. **T-TY1 — Honest display weight + the serif size floor** · Kill faux-bold:
   `font-synthesis: none` at root; display rungs resolve weight 400 under
   `--font-display` (glass-ui BG ask: `var(--font-display-weight, 600)` on the rungs;
   demo `@layer` override until then); zero tracking under the serif; hero de-glowed;
   Instrument Serif retreats to ≥ display-5 rungs. · **Gate**: font-census v3 clause —
   zero visible leaves with `fontFamily⊇"Instrument Serif"` AND (computed weight ≠ 400
   OR computed size < 28px); zero `text-shadow` blur on the hero node. · **S**
2. **T-TY2 — Re-adopt the glass-ui body register** · Delete the I.W6 `--font-stack-text`
   reclaim; Jakarta (already bundled) becomes the body/controls/dropdown/dock face;
   delete the `.dock-label` serif force, `KfPillTabs.vue:93`, playback/tab-trigger
   display binds; sub-header → `text-prose` Jakarta 500 non-italic; flip
   `proof:demo-fonts` polarity (Jakarta = positive body assertion). · **Gate**:
   font-census — every non-display, non-code leaf resolves "Plus Jakarta Sans"; zero
   `ui-sans-serif`-first leaves; zero italic computed outside serif display accents. · **M**
3. **T-TY3 — Demote mono to the data register** · Fira Code only on code/value surfaces
   under an explicit selector contract (`data-register="code"` or equivalent); all
   labels/buttons/legends/section headers re-typeset on Jakarta rungs. · **Gate**:
   font-census — `fontFamily⊇"Fira Code"` ⇒ the leaf matches the code-register contract;
   mono leaf-share per page ≤ 25% (cube matrix exempt as data). · **M**
4. **T-TH1 — The violet accent authority (the latent-red kill)** · One oklch accent ramp
   (periwinkle/orchid unified, `light-dark()` arms, same hue family both themes);
   `--primary` + `--color-progress` + selection/active states repoint to it;
   `--color-slider-track` neutralized; `--accent-red` returns to destructive-only per
   DESIGN.md. · **Gate**: accent-census probe — computed colors of progress fills,
   rails, selection outlines, active states, value highlights across all 9 scenes
   resolve oklch hue ∈ [280°, 330°]; red-family computed accents (oklch hue ∈ [15°, 45°],
   chroma > 0.08) appear ONLY on destructive-marked surfaces; both themes. · **M**
5. **T-TH2 — Signal proportion + functional contrast** · Crayons bounded to subjects
   (zero `--rainbow-*`/`--face-*`/gold consumers on chrome selectors); gridlines to
   neutral `--border` alpha; easing curve/spring trace strokes ≥3:1 vs substrate. ·
   **Gate**: stroke-contrast probe (canvas/SVG sampled) ≥3:1 for the easing curve +
   spring traces on both themes; grep-gate zero crayon tokens in chrome partials. · **S**
6. **T-TY4 — Ramp totality** · Every text leaf on a `--type-*` rung (SVG
   transform-scaled text exempted via explicit annotation); the 52px/650 readout and
   other px leaves fold to rungs; the 0.055px SVG bucket fixed or annotated. · **Gate**:
   font-census — computed sizes ∈ the resolved rung set ±0.5px, per page, both
   viewports; zero un-annotated off-ladder buckets. · **S**
