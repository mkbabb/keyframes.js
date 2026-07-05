# Tranche T — Band T.D — THE LOOK (type · theme · hero · design language)

> **Status: DEVELOPMENT + PROTOTYPING. Implementation NOT authorized.** Docs-only wave specs.
>
> **What this band owns (charter §1 T.D row).** Honest display weight; the Jakarta body
> re-adoption; mono demoted to data; ONE oklch violet accent authority (the latent-red kill,
> 168 refs); a role-bound style-TUPLE font gate; the hero (φ-band re-seat + per-CHAR uplift
> rebirth + ink correction + serif-italic deck); typing-card excision; the cursor-light
> disposition (OD-2); the styles de-archaeology (ONE tiered token authority, cascade layers,
> tombstone deletion, off-token literal purge, dock-anchor calc labyrinth → anchor
> positioning); fragile-CSS (dvh completion, crosshair idiom, glow-registry tokenization).
> **Lanes:** 09 (ALL), 31 (ALL), 01 (ALL), 12 (T-CL-1/T-CL-2 as the OD-2 pair + T-CL-3),
> 17 (ALL), 19 (recs 2–7; rec 1 is T.F's).
>
> **The meta-fact this band is the subject of.** The S demo passed both live font gates
> (`proof:font-census` PASS, `proof:demo-fonts` PASS — lane 31 F-ROOT, re-run green) and the
> owner still wrote *"Most of the fonts on the site are not right at all."* Both gates assert
> **family membership only** — `classify(fontFamily)` in `scripts/proof-font-census.mjs:124-131`
> has no clause for size, weight, style, or a semantic role. Every defect this band cures —
> faux-bold serif, bold-italic system sans, `font-weight: 650`, the two "big label" tokens, the
> `StartingStyleTarget` role drift — is orthogonal to family and invisible to those gates by
> construction. This is the CLAUDE.md-recorded gate-blindspot lesson recurring a **third** time,
> now numerically pinned in typography. **T.D1 (the tuple gate) is the keystone** — it makes the
> other typography cures falsifiable-on-the-defect.

## The committed aesthetic (the synthesis over lanes 09 + 01)

**"Editorial glass instrument, ink on graph paper."** ONE serif display identity (Instrument
Serif at its TRUE single weight 400, its true italic for accent), glass-ui's own Plus Jakarta
Sans as the body register underneath it, Fira Code confined to actual code/data, and ONE accent
family — the violet/periwinkle the brand already owns — riding glass-ui's warm-stone glass. Red
exits the chrome entirely and returns to its documented destructive-only semantic
(`demo/DESIGN.md:7`). The crayon palette (cube faces, boing red, rainbow CTA, axis triad) stays,
but bounded to SUBJECTS, never chrome. The home is a letterpress proof: one enormous serif line
seated at the golden section, the die tumbling above/behind it, a serif-italic deck, exactly two
pieces of glass chrome. "Re-designed with glass-ui in mind" here means **fewer** components,
correctly voiced — the demo's override surface SHRINKS to one display-face swap + one accent ramp
+ the crayon signal tokens.

## The OD rows this band serves (charter §3) — the BORN-OWNER discipline

Per T.M's mechanism (lane 26 rec 1, enforced by **T.M2** `proof:owner-review-gate`): **no design
wave's born-RED oracle is authored until its OD row carries an owner token.** For those waves this
doc specifies the **PROTOTYPE** the owner reviews (served on :5180, capture packet committed under
`audit/prototypes/`), not the oracle. The S.E lesson — *critic consensus ≠ owner verdict* — applied
UPSTREAM.

| OD row | Disposition this band carries | BORN-OWNER waves | Prototype |
|---|---|---|---|
| **OD-2** | Cursor light: REMOVE vs relocate to home hero on glass-ui `Aurora` | T.D13 | Aurora-on-hero at low `opacityCeiling` vs no-replacement |
| **OD-4** | Hero direction: φ-band seat + per-char two-tier ("ink on graph paper") | T.D9, T.D11 | the whole home composition, light + dark, 1440 + 375 |
| **OD-6** | Theme: Jakarta body + honest-weight serif + ONE violet accent ramp | T.D7 (+ the composite look of T.D2/T.D3/T.D8 rides its prototype) | the sitewide type + accent ramp |

The RULED parts inside those rows are ordinary born-RED and land now: per-char is RULED (OD-4 note)
→ T.D10; the red-kill (destructive-only) is RULED (OD-6 note) → the mechanical lever in T.D7;
honest weight + Jakarta re-adoption are RULED consequences of VERDICT #24 → T.D2/T.D3. Only the
composition placement, the deck voice, the accent HUE/ramp, and the cursor disposition need a token.

---

# GROUP 1 — TYPOGRAPHY (lanes 09 + 31)

## T.D1 — `proof:font-tuple` — the role-bound style-tuple font gate (the keystone)

- **scope.** Replace/extend `scripts/proof-font-census.mjs`'s family-only `classify()`
  (`:124-131`) with a gate that asserts, per visible leaf, a `(role, family, size, weight, style)`
  **tuple** sourced from ONE demo-owned `role → token` manifest (a new committed artifact, the
  thing lanes 09/31 designs emit — hero, deck, watermark-title, dock-label, dropdown-secondary,
  control-label, readout, code, …). A leaf whose role manifest entry expects `weight:400` but
  resolves `600` (or any tuple mismatch) fails **by role name**, not just by family. This is the
  single highest-leverage recommendation in the band's lanes (31 rec 1); every other typography
  wave (T.D2–T.D6) reds against it.
- **gate.** **BORN-RED.** Reds on today's tree: the family-only `proof:font-census` +
  `proof:demo-fonts` are GREEN while F1 (177.4px/**600** hero on a 400-only face), F2 (700 **italic**
  sub-header), F4 (dock-label 20.352 vs kf-pill 20.672), F6 (`StartingStyleTarget` `.text-title`
  drift), F7 (`font-weight: 650` — verified live at `SpringTarget.vue:293`) all pass the family gate
  and all fail the tuple gate. Plant the role manifest → every current mismatch REDs by name.
- **size.** M.
- **lanes.** 31 rec 1 (T-TY-CENSUS1); underwrites 09 F1–F8.
- **edges.** The gate substrate for **all** of Group 1. Declares OWNER-or-INSTRUMENT authority per
  **T.M6** (INSTRUMENT: it asserts a manifest-derived correctness fact, not taste — but the manifest
  itself is authored from the OD-6 prototype, so its *values* consume the OD-6 owner token). The
  manifest is co-read by **T.F** (scene decomposition binds each `*Target.vue` title to the
  watermark-title role).
- **lockstep** (lane 18 rule). `proof:font-census`'s family-only `classify()` is SUPERSEDED, not
  left standing beside the tuple gate — a family-only gate that greened the rejected state must not
  remain the de-facto bar. `proof:demo-fonts` is folded into or subordinated to the tuple manifest
  in the same motion (its clause (a) polarity flip is T.D3's). Grep `scripts/` + `run-all.mjs` +
  `demo-roster.mjs` + `proof:ci-coverage` for both basenames before the swap lands.

## T.D2 — Honest display weight + the serif size floor + no magic weights + de-glow

- **scope.** Kill the synthesized faux-bold that IS the "fonts not right" smoking gun (09 F1, 31 F1,
  01 F3). `font-synthesis: none` at `:root` (verified **zero** occurrences repo-wide today); display
  rungs resolve **weight 400** where `--font-display` applies — glass-ui's `text-display-*` hardcode
  `font-weight: 600` (`node_modules/@mkbabb/glass-ui/dist/styles/typography/semantic.css:29,65,75,…`,
  tuned for Plus Jakarta which HAS a 600) but Instrument Serif ships only 400
  (`demo/app/index.html:70` `family=Instrument+Serif:ital@0;1` — no `wght@` axis). Relax
  `--type-tracking-display` (−0.015em → 0) under the swapped face; retreat Instrument Serif to
  ≥ display-5 rungs (never < 28px computed). Delete the `font-weight: 650` magic number
  (`SpringTarget.vue:293`, verified) — step the spring readout to `--font-weight-semibold` (600) or
  the display voice (a T.D7/OD-6 call, but 650 dies regardless). Remove the hero glow/`depth-text`
  stamp (01 F3 — `.depth-text` from `base-misc.css:32-38` recolors to `--primary` + a 4-step offset).
- **gate.** **BORN-RED.** Font-tuple clause (T.D1): zero `fontFamily⊇"Instrument Serif"` leaves with
  (computed weight ≠ 400 OR computed size < 28px); cross-referenced against `document.fonts` — no
  display leaf resolves a weight the loaded face does not ship. Zero `text-shadow` blur on the hero
  node; zero non-100-multiple `font-weight` literals repo-wide (grep — `650` is the one live hit).
  Reds today on every one of the 138 display leaves (all 500/600) + `SpringTarget.vue:293`.
- **size.** S.
- **lanes.** 09 rec 1 (T-TY1), 31 rec 2 (T-TY1) + rec 8 (T-TY7), 01 F3 (hero-ink weight half).
- **edges.** glass-ui gap (VERDICT #27 delineation): `text-display-*` should consume
  `font-weight: var(--font-display-weight, 600)` so a single-weight display face is one token away.
  → the born-RED glass-ui **BG/BH ask lands NOW via T.H** with a kf-side acceptance gate; until it
  ships, the kf-side is a demo-scoped `@layer` override on `text-display-*`. The hero-ink half is
  shared with **T.D10** (per-char rebirth owns the actual `.hero-display` node).
- **lockstep.** The `style.css:63-64` comment claiming `"--font-display-weight: 400 (glass-ui
  default) is correct"` is FALSE — that token does not exist in glass-ui 4.0.1 (a masked
  consume-edge drift, 09 F1); it dies in the de-archaeology pass (**T.D15**) in the same motion the
  real token seam is filed as a T.H ask — never leave the false comment vouching for a phantom token.

## T.D3 — Re-adopt the glass-ui body register; retire the system-sans/italic voice; no bare `font-family`

- **scope.** DELETE the I.W6-font reclaim (`demo/@/styles/style.css:114-141`) that replaced
  glass-ui's body face with `ui-sans-serif, system-ui, …` so Plus Jakarta Sans — glass-ui's native
  register, already bundled (base64 in `@mkbabb/glass-ui/styles/fonts`, imported at `style.css:10`),
  zero new payload, currently PAID-FOR-BUT-BANNED — flows natively as the body/controls/dropdown/pane
  face. Delete the `@layer demo-typography .dock-label` serif force (`style.css:632-636`) and the
  playback/tab-trigger display binds (`playback-button.css`, `tab-trigger.css` per `style.css:50-52`)
  so those surfaces revert to glass-ui's typography (09 F4). Drop `italic` on the non-home sub-headers
  (the two `.start-screen-prose` sites `EditorStartScreen.vue:70,76` are the HOME deck — routed to
  OD-4/**T.D11**, not here). Route every text surface through a glass-ui `text-*` utility: **zero bare
  `font-family` in scoped CSS** (17 F9 — 17 scoped rules set it directly today).
- **gate.** **BORN-RED** (mechanical); the composite LOOK is signed off inside the **OD-6 prototype
  (T.D7)**. Font-tuple: every non-display, non-code leaf resolves "Plus Jakarta Sans"; zero
  `ui-sans-serif`-first leaves; `font-family:` in scoped CSS ≤ the code-mono allow-list. Flip
  `proof:demo-fonts` clause (a) polarity: **Jakarta becomes the POSITIVE body assertion**,
  `ui-sans-serif`-first becomes the violation (it asserts the exact inverse today). Reds on the whole
  current body surface.
- **size.** M.
- **lanes.** 09 rec 2 (T-TY2), 31 rec 3 (T-TY2), 17 rec 9 (font-family bypass half).
- **edges.** The HOME sub-header voice is **contested between two of my lanes** — 09/T-TY2 says
  Jakarta 500 non-italic; 01/T-HOME-4 says Instrument-Serif italic 400. Resolution: **T.D3 governs
  all NON-home sub-headers (Jakarta); the home deck voice is OD-4, owned by T.D11's prototype.** (See
  Charter-conflict note 2.) The dock-label register lands here (Jakarta); its selected-BOLD state rule
  is the dock recut's (**T.C** / T-TY8 — see disposition).
- **lockstep.** `proof:demo-fonts`'s clause (a) is INVERTED in the same commit that deletes the I.W6
  reclaim — never leave the gate asserting "no Jakarta anywhere" while the wave mandates Jakarta
  everywhere. The dark-block half of 17 F9 (two `.dark` blocks) is de-duplicated by **T.D15**.

## T.D4 — Demote mono to the data register (re-home the 430 non-editor mono leaves)

- **scope.** Fira Code is the demo's *de facto* UI voice, not its code voice: excluding Monaco's
  own 441 inherently-mono leaves, **430 UI-chrome leaves across 63 selectors** render mono — every
  control field label (`duration`/`delay`/`iterations`/`direction`), status/telemetry badge,
  dropdown descriptor, legend, section header (09 F3, 31 F3). Publish the `role → voice` manifest
  (the T.D1 manifest's voice column: label/identity = body/display, data = mono), and re-home the
  label/badge/descriptor leaves off mono onto Jakarta rungs. Mono stays for genuinely tabular/numeric
  telemetry (matrix cells, cubic-bezier strings, numeric readouts) and code — marked
  `data-register="code"` (or the manifest's equivalent selector contract) so the census enforces the
  boundary. Kill the `KfPillTabs.vue:93` display-face force in passing (the component itself dies via
  **T.H** — see disposition).
- **gate.** **BORN-RED.** Font-tuple: `fontFamily⊇"Fira Code"` ⇒ the leaf matches the code-register
  contract; the non-editor mono leaf count carries a **declared ceiling** the gate enforces
  (regression-proof against "just add another mono label"); mono leaf-share per page ≤ ~25% (cube
  matrix exempt as data). Reds today at 430 non-editor mono leaves.
- **size.** L.
- **lanes.** 09 rec 3 (T-TY3), 31 rec 4 (T-TY3).
- **edges.** Many mono surfaces are being REMOVED wholesale by sibling bands (square caption #11 →
  T.A; gesture legend #8 → T.E; curve-physics telemetry #13, gallery button #15 → T.E; cube readout
  #5 → T.A) — the mono ceiling is measured against the **post-prune survivor set**, so this wave
  SEQUENCES after T.A/T.E's furniture strip (edge). The ceiling literal is co-owned with **T.M4**
  (`stage-inventory`) — the two agree on which leaves legitimately survive.
- **lockstep.** The manifest's voice column is the SAME artifact T.D1 reads — authored once. Any
  `proof:*` gate that asserted a mono surface as intended chrome is re-pointed as its surface re-voices.

## T.D5 — Ramp totality: every text leaf on a `--type-*` rung

- **scope.** Fold the off-ladder sizes onto glass-ui's φ ladder (09 F8, 31 F… , 17 F9 font-size half):
  the `52px/650` spring readout numeral → `text-display-5` Fira Code 300 (glass-ui's numeric-display
  idiom); the degenerate `Fira Code 0.055px` SVG-text bucket (easing) fixed or annotated
  (`EasingCurveCanvas.vue:494`); the scattered `12.48/12.8/14/18.6px` per-component leaves fold to
  rungs; raw `font-size` literals (`MorphTarget.vue:311` `0.9rem`, `GestureLegend.vue:104` `0.85em`)
  onto `--type-*`. The two visually-indistinguishable "big label" tokens (`.dock-label` 20.352px fixed
  `--type-subheading` vs `.kf-pill-tab` 20.672px fluid `--type-prose`, `KfPillTabs.vue:93-94`, 31 F4)
  collapse — **subsumed by the KfPillTabs deletion (T.H)**; the surviving dock-label reads the single
  `--type-subheading` rung.
- **gate.** **BORN-RED.** Font-tuple: computed sizes ∈ the resolved rung set ±0.5px per page, both
  viewports; zero un-annotated off-ladder buckets; SVG transform-scaled `<text>` exempt only via an
  explicit annotation. Reds today on the `52px/650`, `0.055px`, and the `18.6/12.48/12.8` buckets.
- **size.** S.
- **lanes.** 09 rec 6 (T-TY4), 31 rec 5 (T-TY4, the two-token collapse — subsumed by T.H), 17 rec 9
  (font-size-literal half).
- **edges.** The `52px/650` numeral folds with T.D2's magic-weight kill (same node). The `0.055px`
  SVG bucket folds with **T.D20** (EasingCurveCanvas tokenization). GestureLegend dies via **T.E** —
  its `0.85em` literal leaves with it.
- **lockstep.** Any hard-coded `px`/`rem` leaf re-homed to a `--type-*` var must not re-introduce a
  new off-ladder token; the ramp is the ladder, not a fresh literal.

## T.D6 — Cross-surface tuple consistency: the watermark-title + the select-descriptor

- **scope.** Two roles today have two owners, two tokens (invisible to the family gate; both land in
  legitimate voice buckets). **(a) Watermark title (31 F6):** 8 of 9 scene targets read `.text-display`
  (Instrument Serif 600/41.9px) for the corner subject title — EXCEPT `StartingStyleTarget.vue:33`'s
  "Hello, spring." which reads `.text-title` (native sans 700/32.9px, the BODY register). All 9 must
  resolve the identical `(family,size,weight)` tuple. **(b) Select-item secondary descriptor (31 F5):**
  glass-ui's own `LabeledSelect` renders it at Fira Code 11px (`text-micro`,
  `labeled-field.js:115`); the demo's hand-rolled `EasingSelect.vue:78` renders the same role at Fira
  Code 14.384px (`text-dropdown-secondary`). Every `[role=option]` secondary descriptor resolves ONE
  tuple regardless of which component authored it — either adopt `LabeledSelect` (VERDICT #27
  consumption) or repoint `EasingSelect.vue:78` → `text-micro`.
- **gate.** **BORN-RED.** Font-tuple: all 9 scene-subject titles resolve one tuple (reds on
  `StartingStyleTarget`); every option secondary-descriptor resolves one tuple (reds on the
  11px-vs-14.4px split).
- **size.** M.
- **lanes.** 31 rec 6 (T-TY5), rec 7 (T-TY6).
- **edges.** The watermark-title **component extraction** (one shared `<SceneTitle>` primitive
  inherited by all 9 `*Target.vue`) is **T.F**'s scene-decomposition territory (lane 16/26 "why aren't
  these composed into sub-components") — T.D6 owns the TUPLE GATE + names the role; T.F extracts. The
  `LabeledSelect` adoption path is **T.H** consumption (pure-consumption `LabeledSelect` win). Cross-ref
  both; this wave lands the gate that forces convergence either way.
- **lockstep.** When T.F extracts `<SceneTitle>`, `StartingStyleTarget` inherits it (not a hand-picked
  `.text-title`); the tuple gate stays green through the extraction.

---

# GROUP 2 — THEME (lane 09)

## T.D7 — The violet accent authority (the latent-red kill) — OD-6

- **scope.** ONE demo-owned oklch accent ramp, expressed as glass-ui token overrides at `:root` with
  `light-dark()` arms, unifying `--ppmycota-primary` (hsl 248° periwinkle) and glass-ui's dark orchid
  `--primary` (oklch hue 318) into ONE hue family — same family BOTH themes, only lightness/chroma
  arm-swap. `--primary` + `--color-progress` + selection/active states repoint to it;
  `--color-slider-track` neutralized (a `color-mix` of `--border`, not a red twin); **`--accent-red`
  returns to destructive-only** per `DESIGN.md:7`. All 168 downstream consumers across 27 files inherit
  by construction — the SAME one-token lever K.W4 S3 used (`style.css:368-411`), pointed at the right
  hue this time (09 F5/F6). The light theme's near-black `--primary` dies; `--ppmycota-primary` becomes
  an alias. Lane 09's proposal: `--accent-kf: light-dark(oklch(0.56 0.17 295), oklch(0.74 0.13 305))`
  with hover/subtle/foreground companions by L±.
- **gate.** **BORN-OWNER (OD-6).** Per T.M2, the born-RED oracle is NOT authored until OD-6 carries an
  owner token. **Prototype:** the whole sitewide type + accent ramp on the running demo (light + dark),
  served on :5180, capture packet committed — the composite look of T.D2/T.D3/T.D5/T.D8 is validated
  HERE. **The oracle (authored post-token):** an accent-census probe — computed colors of progress
  fills, rails, selection outlines, active states, value highlights across all 9 scenes resolve oklch
  hue ∈ the blessed accent window (lane 09: [280°,330°]); red-family accents (oklch hue ∈ [15°,45°],
  chroma > 0.08) appear ONLY on destructive-marked surfaces; both themes. The mechanical LEVER (repoint
  the tokens) is ready today; the HUE/ramp is what the token buys.
- **size.** M.
- **lanes.** 09 rec 4 (T-TH1); the RED-KILL half is RULED (OD-6 note), the ramp CHOICE is owner-gated.
- **edges.** Consumes **T.M1** (owner-verdict-recorded) + **T.M2** (owner-review-gate) + **T.M3**
  (owner-golden — the blessed frames come from this approved ramp). The Fable/frontend-design pass
  authors the ramp (charter §5: all design routed Fable). The accent-census oracle declares OWNER
  authority per **T.M6**.
- **lockstep.** The two `.dark` blocks (`style.css:402`, `design-idioms.css:318`) that re-declare
  `--accent-red`/`--color-progress`/`--color-gold*` collapse into the single tokens.css `.dark`
  (**T.D15**) in the same motion the ramp lands — never leave a second `.dark` re-minting the red twins
  the ramp just retired. `proof:crayon-preserved` is audited against the redesign (T.M7 — the crayon
  idiom may narrow with the latent-red kill).

## T.D8 — Signal proportion + functional contrast

- **scope.** Crayons (`--rainbow-*`, `--face-*`, `--amiga-red`, `--axis-*`, gold) bounded to SUBJECTS —
  zero crayon-token consumers on chrome selectors (rails, badges, labels, selection); gridlines/graph
  rules move off warm-tan onto neutral `--border` at low alpha so the field stops reading red (09 F5).
  Functional strokes meet WCAG 1.4.11 ≥3:1 against their substrate: the easing stage curve (09 F7 —
  today a barely-perceptible violet hairline on near-black, the page's SUBJECT is its least-visible
  element) and the spring traces, both themes.
- **gate.** **BORN-RED** (mechanical) — the color VALUES ride the OD-6 prototype (T.D7). Grep-gate:
  zero crayon tokens in chrome partials. Stroke-contrast probe (canvas/SVG sampled) ≥3:1 for the easing
  curve + spring traces on both themes. Reds today on the crayon-in-chrome consumers and the
  sub-3:1 easing curve.
- **size.** S.
- **lanes.** 09 rec 5 (T-TH2).
- **edges.** The stroke-contrast oracle is a **T.M5** (`subject-legible`)-family quality gate — it
  asserts perceptibility, not existence (the exact axis no S gate had). The easing curve's final color
  is set by **T.E**'s easing-scene redesign / OD-6; T.D8 lands the FLOOR the redesign must clear.
- **lockstep.** As crayon consumers move off chrome, any gate asserting a crayon token as intended
  chrome (e.g. a red-rail assertion) is retired with it.

---

# GROUP 3 — THE HERO (lane 01) — OD-4

## T.D9 — Re-seat the hero on the φ band + the two-focal composition gate — OD-4

- **scope.** The hero is a header, not a hero (VERDICT #3): `h1.hero-display` parks at y=21 (rect
  h=163) in the TOP band — the same band the top dock, the @mbabb pill, and the cube gesture legend
  occupy (01 F1, measured). Move the start-screen overlay off `EditorStartScreen.vue:24`'s
  top-band pin (`lg:mt-[var(--work-area-top-offset)]`) to a **work-area-chain-derived golden-section
  seat**: the H1 baseline ≈ 61.8% of the work-area height, left at the page gutter
  `clamp(2rem,5vw,4.5rem)`, `pointer-events: none`, z between scene and docks. Overlap with the cube's
  lower quadrant is WELCOME (owner: "it's OK if it sits a bit on top of the cube"). Same order on
  mobile (die upper ~45%, hero band from ~52%). NO raw vh/px offset — a `--hero-band-anchor` derived
  from `--work-area-top-offset` + a φ share (the K.W3 M4/C5 ban on raw-vh magic numbers holds). The
  home is a **two-focal** composition (hero + die), exactly two pieces of glass chrome (top dock,
  bottom transport), nothing else.
- **gate.** **BORN-OWNER (OD-4).** The born-RED oracle is NOT authored until OD-4 carries an owner
  token. **Prototype:** the whole home composition on :5180 (light + dark, 1440 + 375). **The oracles
  (authored post-token):** (a) placement — at 1440×900 and 375×812 the `h1` rect intersects NEITHER
  dock rect AND `h1.top` ≥ 0.45 × work-area height; zero raw-vh/px offsets introduced (grep). (b) the
  standing two-focal capture gate (T-HOME-7) — DOM census on home shows zero legend/readout/egg/caption
  selectors; pixel-diff region around `h1` contains no dock/legend paint at rest.
- **size.** M.
- **lanes.** 01 rec 1 (T-HOME-1), rec 7 (T-HOME-7).
- **edges.** Consumes **T.M1/M2/M3/M4** (the composition capture gate is a **T.M4** `stage-inventory`
  instance for the home scene — the owner-sanctioned home manifest = {hero, die, top dock, transport}).
  The furniture it must be free of is removed by siblings: the gesture legend (#8) → **T.E**; the
  `rx/ry/rz` readout (#5) → **T.A**; the cursor light (#22) → **T.D13** (OD-2); the typing card (#2) →
  **T.D12**. The die placement is **T.A**'s cube.
- **lockstep.** `proof:appearance-suffusion` clause (c) (hero∩cube==0) is RE-SPEC'd to overlap-OK, and
  the hero-rung/hero-balance/hero-cls trio re-spec'd for the lower/centred seat — all via **T.M7**
  (retirement pass); T.D9 supplies the new placement contract they re-point to. Never leave a gate
  asserting hero∩cube==0 while the owner ruled overlap welcome.

## T.D10 — Per-char uplift rebirth + hero ink correction (RULED)

- **scope.** The word-granular F.W16 split is REJECTED (VERDICT #3: "should uplift each individual
  char"). Measured: 3 word spans, delays 0/0.2/0.4s over a 5.8s cycle whose keyframes finish at 10% —
  three lumps heave in 0.6s, then 5.2s dead (01 F2). Rebirth as a **two-tier** split in
  `AnimatedText.vue`: `h1 > [sr-only mirror] + [aria-hidden visual] > per-WORD wrappers
  (inline-block, margin-inline-end: 0.25em except last — the exact X-5 gap cure, KEPT) > per-CHAR
  spans (inline-block)`. Words own wrapping + the gap; chars own the motion. Delay = **global char
  index** (across words, so the wave crosses the whole line) × ~55ms; one shared ~3.6s cycle,
  `translateY(-0.09em)` peak at 6%, ease-out settle by ~14%, rest to 100% (em-relative lift — the old
  −10px was rung-blind at 177px). Transform-only; PRM → `animation: none`. Keep `<TypingDots/>` as the
  faster-cadence tail (the engine-dogfooded pulse). CSS keeps the LCP hero (engine-driving the LCP node
  would gate first motion on the HEAVY chunk). **Ink (RULED, 01 F3):** `color: var(--foreground)`,
  `font-weight: 400`, NO `depth-text` on the title or dots (`.depth-text` recolors to `--primary` lilac
  + a 4-step offset stamp).
- **gate.** **BORN-RED** (the per-char split + honest ink are RULED — OD-4 note: "per-char is RULED").
  Extend `scripts/proof-demo-usability.mjs`: char-span count == 17 for the default title, delays
  strictly monotone in global char order, the existing `sr-only` mirror clause (`:189-234`) + the X-5
  same-line-gap clause (`:15-25,165-226`) STAY green, computed `animation-name` present per char span.
  Computed `h1` char-span weight == 400 AND color == resolved `--foreground` in BOTH themes; zero
  `depth-text` in `editor-shell/` (grep). Reds today (3 word spans, 600 weight, depth-text present).
- **size.** M.
- **lanes.** 01 rec 2 (T-HOME-2), rec 3 (T-HOME-3).
- **edges.** The composition SEAT of this motion is **T.D9** (OD-4). The honest-weight half is shared
  with **T.D2** (the display-weight token). Hero∩cube overlap now WELCOME → the wave rides T.D9's re-seat.
- **lockstep.** `proof:demo-usability` clause 2 (per-word) + `proof:typing-dots` / `proof:dogfood-hero`
  are re-spec'd for the per-CHAR hero in the same motion (**T.M7**) — never leave the per-word clause
  asserting the rejected split. The a11y mirror invariant is non-negotiable: AT must never hear the
  "S…e…l…e…c…t" glyph stream.

## T.D11 — The serif-italic deck ramp (the home sub-header voice) — OD-4

- **scope.** The deck lines join the poster's own voice — the OD-4 direction (01 F4). Today: "from the
  list ☰ below, then press Play." renders `ui-sans-serif` **italic 700** 25.9px; the hint italic 600
  amber (`EditorStartScreen.vue:70,76` `text-heading`/`text-subheading` + template `italic` — bold
  system sans under a 177px serif, the "AI-slop subtitle" register). Lane 01's proposal: deck →
  `--font-display` **true italic 400** at `--type-title` (the `ital@1` face already loaded, zero new
  payload); hint → display italic 400 at `--type-heading` muted; the ☰ `List` icon sized ~0.8em
  cap-height inline. Home ramp becomes ONE family, two styles, three φ rungs: mega roman → title italic
  → heading italic muted.
- **gate.** **BORN-OWNER (OD-4).** This wave IS the resolution of the T.D3-vs-01 sub-header conflict —
  the home deck voice (serif-italic per 01 vs Jakarta-body per 09) is the design choice the owner
  signs off. **Prototype:** the home deck rendered both ways inside T.D9's composition prototype. **The
  oracle (authored post-token):** computed `font-family` of every `.start-screen-prose` node begins
  "Instrument Serif" (if serif-italic wins) OR resolves the Jakarta body tuple (if body wins); no
  computed weight > 400 on the start screen either way.
- **size.** S.
- **lanes.** 01 rec 4 (T-HOME-4). Reconciles 09 rec 2 (T-TY2) on the home surface specifically.
- **edges.** Governs the HOME sub-header ONLY; **T.D3** governs all other sub-headers. Gates
  **T-TY9** (31 rec 10, drop the unused `:ital@0;1` axis) — DEFERRED until this wave decides: if
  serif-italic wins, the italic axis STAYS (the deck uses it); if Jakarta wins, the axis drops (see
  disposition). Consumes **T.M2**.
- **lockstep.** Whatever wins, the `EditorStartScreen.vue:70,76` `italic` classes on `text-heading`/
  `text-subheading` die — no manual weight/style stacking on a semantic utility survives either branch.

## T.D12 — Typing-card excision (RULED removal)

- **scope.** The `@KEYFRAMES · LIVE` typing card is a RULED removal (VERDICT #2: "remove this crap";
  01 F5). Excision footprint (grep-complete): `EditorStartScreen.vue:95-115` (markup) + `:154-163`
  (script wiring) + `:233-376` (~140L scoped CSS); `demo/@/components/custom/editor-shell/
  useHeroSourceEgg.ts` (155L, whole file); the egg clauses of `scripts/proof-design-refinement.mjs`.
  Collateral wins: the card's red dot + red caret leave (latent-red vocabulary, #16); a perpetual JS
  type-in interval leaves (#19); the lower-left focal competitor leaves — the vacancy needs no
  replacement (the hero moves DOWN into that band, T.D9).
- **gate.** **BORN-RED.** `kf-source-egg|useHeroSourceEgg` grep-zero repo-wide; home console-clean;
  the `proof:` roster green post-delete. Reds today (the card + composable + gate clauses are present).
- **size.** S.
- **lanes.** 01 rec 5 (T-HOME-5).
- **edges.** A **T.M7** feature-coupled retirement — `proof:design-refinement`'s egg clauses (and its
  S1 typing-card clause) are retired as the feature is removed. The kf-source-egg's `-webkit-backdrop-
  filter` (`:254`, lane 19 F7) leaves with it (do not blanket-strip it elsewhere).
- **lockstep.** The gate must not red on the removal it should be gating — `proof:design-refinement`
  loses its egg clauses in the SAME commit the markup dies (grep `scripts/` + roster for the basename).

*(T-HOME-6 — transport play-first, edge-honest divider, one tooltip authority — is a DOCK/transport
concern; ↳ cross-ref **T.C** per charter §1 (dock grammar recut: play-FIRST, `n≤1 ⇒ zone absent`
elision, one tooltip authority). The home composition (T.D9) DEPENDS on the transport being
play-first + de-divided as its bottom-band focal — flagged as a T.D9→T.C edge, not re-specified here.)*

---

# GROUP 4 — CURSOR LIGHT (lane 12) — OD-2

## T.D13 — Cursor-light disposition (REMOVE vs Aurora-on-hero) — OD-2

- **scope.** The cursor light exists on exactly ONE surface of nine:
  `demo/scenes/compose/ComposeTarget.vue:74-141` (the "casting-floor key-light" — the whole sitewide
  grep resolves to this one implementation; 12 F1). It is partial on five axes: one surface only (F1);
  hard-clipped to the `[data-foundry]` rect not the viewport (F2); desktop-mouse-only, touch gets a
  frozen default (F3); authored at near-imperceptible 9%/3% intensity (F4); and — the load-bearing
  defect — a naive `read-after-write` in `onFoundryPointerMove` that forces a **whole-document
  synchronous layout on every pointer event** (F5: measured **1097–1671 µs/call**, ~1,100–2,000× the
  isolated cost; 66–100 ms of main-thread time per second of mouse movement — a live contributor to
  VERDICT #19 "god awful performance"). It is the **SECOND** independently-authored instance of a
  pattern this codebase already killed once (H.W9.F3/F6, recorded verbatim in
  `design-idioms.css:446-456`). **OD-2 (owner: "if you're going to implement this, it should be done
  right"):**
  - **T-CL-1 DO-IT-RIGHT** — retire the bespoke `.foundry-keylight` + `@property --mouse-x/--mouse-y`
    entirely; if product wants a signature light, home it on the home hero (the surface every visitor
    sees, already redesigning per OD-4) via glass-ui's **public** `@mkbabb/glass-ui/aurora` (`Aurora` +
    `useCursorInteraction` / `setCursor(x,y,strength)`) at a low `opacityCeiling` (~0.35–0.5) so the
    per-char hero stays dominant. Aurora ships the rAF-coalescing, the PRM-safe CSS-gradient fallback
    (`"auto"` renderMode), the DPR budget (`AV_AURORA_DPR_MAX=1.5`), lazy-arm-past-first-paint — a
    straight import, NOT a reimplementation of glass-ui's internal `createSpecularWriter`.
  - **T-CL-2 REMOVE** — excise the casting-floor key-light outright, no replacement (exact excision set
    in lane 12: `ComposeTarget.vue:13,15-16,70-82,94-141,171-182`; `ComposeScene.vue:118-129,83-89`).
- **gate.** **BORN-OWNER (OD-2).** The disposition needs an owner token (remove vs relocate). **What
  is UNCONDITIONAL either way:** the bespoke `.foundry-keylight`/`--mouse-x` wash on ComposeTarget dies
  — and compose is independently PRUNED OUTRIGHT (lane 07 / **T.E**, the `:has()` height-0 collapse),
  so T-CL-2's excision costs nothing beyond compose's removal. **Prototype (if T-CL-1):** Aurora on the
  home hero at low opacity, inside T.D9's composition. **The oracle (authored post-token):**
  `grep -rn "onFoundryPointerMove\|foundry-keylight\|--mouse-x" demo/` → empty (both branches); if
  T-CL-1, a CDP/Performance-trace assertion that the aurora surface amortizes to ≤1 style+layout pair
  per animation frame regardless of pointer rate (Aurora's coalescing contract).
- **size.** M (Aurora mount on the hero) / S (removal alone).
- **lanes.** 12 T-CL-1, T-CL-2 (the OD-2 pair).
- **edges.** The compose-side excision RIDES **T.E** (compose PRUNE). The Aurora-on-hero mount is on
  T.D9's redesigned hero (edge into OD-4). glass-ui gap (VERDICT #27): the SUBTLER "wash over ordinary
  DOM" register needs `createSpecularWriter`'s coalesced core made PUBLIC (internal-only today) — named
  as a **T.H** glass-ui ask, NOT hand-copied (that recreates the exact second-occurrence this finding
  is about). Consumes **T.M2/M4** (cursor light is #22 in the home stage-inventory manifest).
- **lockstep.** The redundant demo-side PRM branch (`ComposeTarget.vue:171-182`) leaves with the wash
  (Aurora's `"auto"` handles PRM for free) — never keep a PRM branch guarding a deleted layer.

## T.D14 — `proof:no-hand-rolled-cursor-tracker` — the standing recurrence gate

- **scope.** The recurrence itself is the real defect (H.W9's `.cartoon-specular` →
  ComposeTarget's `.foundry-keylight`, same shape, "present on one surface only," two independent
  authors). Nothing stops a THIRD hand-rolled `--mouse-x`/`--mouse-y` tracker on a future scene. A
  grep/AST gate (sibling to `proof:no-orphan-specular`, which already exists for glass-ui's own
  specular class) that fails CI if `demo/` defines a new `@property` pair matching `--*-x`/`--*-y`
  driven by a **bare (non-glass-ui-sourced)** `pointermove`/`mousemove` handler — forcing any future
  cursor-reactive effect through glass-ui's public surface (`aurora`/`goo-blob`/`constellation`) or an
  explicit reviewed exception.
- **gate.** **BORN-RED.** RED today (catches `ComposeTarget.vue`'s pattern), GREEN after either T-CL-1
  or T-CL-2 lands. One `scripts/proof-*.mjs` gate; no runtime code change.
- **size.** S.
- **lanes.** 12 T-CL-3.
- **edges.** Independent of the OD-2 disposition (lands either way). Declares INSTRUMENT authority per
  **T.M6**. Folds the H.W9 lesson into a standing precept (the recurring-correction-shape class,
  **T.M10** clause).
- **lockstep.** Wired into `proof:ci-coverage` in the same motion; if compose is pruned (T.E), the gate
  still guards the *future* — it is not compose-coupled.

---

# GROUP 5 — STYLES ARCHITECTURE (lane 17)

## T.D15 — The style-system restructure: de-archaeology + de-tombstone + tokens.css/idioms.css split + ONE tiered token authority

- **scope.** The two global sheets are tranche-archaeology LOGS, not a design system (17 F1/F2/F3): 
  `style.css` **65% comment prose**, `design-idioms.css` (887L, over the 500L ceiling) **72%** — 
  between them **76 tranche-code annotations** (verified: 27 in style.css, 46 in design-idioms.css) 
  plus half-dead TOMBSTONE eulogies for DELETED rules (`.scale-on-hover`, `.gold-shimmer`, `.dock-inset`, 
  the specular subsystem). Token authority is split-brain: **138 custom properties** across 3 `:root` + 
  2 `.dark` blocks in two files, no tiering, an arbitrary partition. Restructure to the lane-17 target:
  - `style.css` — entry: `@import` order + `@theme` + base only; ≤120L, <35% comment.
  - **`tokens.css`** — THE single token authority, tiered (literal `--face-*`/`--rainbow-*`/`--axis-*`/
    `--phi` → semantic `--color-progress`/`--accent-red`/`--color-gold` → layout dock/work-area/rail →
    component `--badge-*`/`--ball-*`/`--graph-*`), ONE `:root` + ONE `.dark` (the two `.dark` blocks at
    `style.css:402` + `design-idioms.css:318` collapse; reconciled against glass-ui's own
    `@custom-variant dark` class strategy — de-duplication is the win, not necessarily `light-dark()`);
    the mobile `@media :root` override folds in; delete the demo-local `--z-behind: -10`
    (`design-idioms.css:245`, verified) — glass-ui already ships the identical token, consume it (19 F3).
    ≤250L.
  - **`idioms.css`** — the genuine reusable recipes only (`.focus-ring`, `.tap-floor`, `.status-badge`,
    `.readout-accent`, `.code-token`, `.labeled-field-grid`, the `icon-*` family); the `body.is-dragging`
    select-suppression (`design-idioms.css:879`) moves to its composable's colocated CSS (it's a
    behavior, not an idiom). Each recurring recipe is census'd against a shipped glass-ui primitive
    FIRST (segmented-tabs, `glass-progress-rail`, `icon-chip`) — the `.progress-rail`/`.progress-ball`
    (`design-idioms.css:578-599`) and `.status-badge` families audited for consumption (17 F5); genuine
    gaps are born-RED glass-ui handoffs (**T.H**), not local re-authors. ≤200L.
- **gate.** **BORN-RED.** `grep -cE '\b[A-Z]\.W[0-9]' demo/@/styles/*.css` == 0 AND both entry sheets
  <35% comment; every file in `demo/@/styles/` ≤ 300L; zero `— DELETED`/`— REMOVED` eulogy blocks;
  exactly ONE `:root` in `tokens.css` and no `--` design-token declaration elsewhere in
  `demo/@/styles/` (bar SFC-local component vars); `grep -c -- '--z-behind:' demo/@/styles/*.css` == 0;
  ONE `.dark` block repo-wide. Reds today on all clauses (73 tranche codes, 887L monolith, split tokens,
  the `--z-behind` dup, two `.dark` blocks).
- **size.** L.
- **lanes.** 17 rec 1 (de-archaeology), rec 2 (split & de-tombstone), rec 3 (tiered token authority),
  17 F9 (dark-block consolidation half); 19 rec 3 (`--z-behind` delete).
- **edges.** The glass-ui primitive census names which recipes → **T.H** consumption (the KfPillTabs /
  SegmentedTabs swap, `glass-progress-rail`, `LabeledSelect`). The scene-telemetry idiom extraction
  (17 rec 8) folds here for SURVIVORS only — most telemetry chips (square caption, gesture legend,
  cube readout, curve-physics) are REMOVED by **T.A/T.E**, so the residual shared idiom (if any) lands
  in `idioms.css` after the prune settles (edge into T.A/T.E; scene-target file-size shrink is **T.F**).
  The T.D7 accent ramp's `.dark` arms land in THIS file. The `style.css:63-64` phantom-token comment
  (T.D2) and the `style.css:373` banished-green doc comment (T.D17) die in the de-archaeology pass.
- **lockstep.** Any `proof:*` gate anchored to a moved basename or a stripped tell is re-pointed in the
  same motion (drive lesson: gates anchor literal paths — grep `scripts/` for `style.css`/
  `design-idioms.css` references, `proof:demo-no-oversize` line counts, any gate grepping these files).
  Isomorphic where possible (token re-homing + comment stripping change zero pixels — separable from the
  T.D7 look change, which routes through Fable).

## T.D16 — Declare cascade-layer order; kill the global `*` reset

- **scope.** `style.css` uses `@layer base/utilities/demo-typography` but **never declares the layer
  order** (17 F4) — ordering is source-position accident, and `demo-typography` relies on "declared LAST
  so it wins" (`style.css:632` comment — the exact brittleness cascade layers exist to remove). And
  `style.css:563` (verified) is a global `* { @apply border-border }` reset — the modern-web CSS guide
  §2 "No global resets": styles on `*` cannot be overridden by web components or lower-priority layers
  without `!important`. Declare `@layer reset, base, tokens, glass, components, utilities, demo;` ONCE at
  the top; assign every block; `demo-typography` becomes the `demo` layer that PROVABLY outranks glass-ui
  `utilities` without the "declared last" trick. Replace the `*` border reset with scoped defaults on the
  element types that take borders (or a `:where()` low-specificity default).
- **gate.** **BORN-RED.** `grep -q '@layer reset,' style.css` AND `grep -cE '^\s*\*\s*\{' demo/@/styles`
  == 0. Reds today (no order declaration — verified 0 hits; the `*{}` reset present at `style.css:563`).
- **size.** S.
- **lanes.** 17 rec 4.
- **edges.** `proof:brittleness` / any gate asserting the z-scale or layer contract stays green on the
  declared-order path (the z-scale is already clean — lane 19 F3). The `demo` layer is where the
  Jakarta body register (T.D3) and the display-weight override (T.D2) provably win over glass-ui.
- **lockstep.** The "declared last wins" comment dies with the reset — never leave a comment vouching
  for the trick the explicit order replaces.

## T.D17 — Off-token color-literal purge

- **scope.** Off-token color literals live in scene CSS/JS (17 F6): `SpringHeatmap.vue:119` (verified)
  hard-codes `"hsl(142 71% 45%)"` — the **exact banished green** the K.W4 collapse deleted — as the JS
  fallback when `--color-progress` fails to resolve (if the token ever drops, the heatmap paints the
  color the whole redesign removed); `ComposeTarget.vue:126,127,162,166` inline the gold ramp values as
  `var(--color-gold, hsl(43 74% 49%))` fallbacks (duplicating token VALUES into leaves — a future gold
  tune silently drifts); `CubeTarget.css:116-124`, `AmigaScene.vue:310-311`, `SheetGrabHandle.vue:78`
  carry raw `rgba()`/`hsl()` lacquer literals (9 raw literals total). Fallbacks reference a TOKEN, never
  a literal (`var(--color-gold, var(--color-gold-fallback))`); the SpringHeatmap JS reads
  `--color-progress` with a RED token fallback, never the green; genuinely-local lacquer literals become
  named component vars in the SFC.
- **gate.** **BORN-RED.** `grep -rn '142 71% 45%' demo` == ∅ AND no raw `hsl()/rgba(` literal fallback
  inside `var(...)`. Reds today: `SpringHeatmap.vue:119` (JS literal) + `style.css:373` (a doc-comment
  reference — dies in T.D15's de-archaeology, a lockstep note).
- **size.** S.
- **lanes.** 17 rec 6.
- **edges.** The `--color-gold*` and `--color-progress` fallbacks resolve against **T.D7**'s ramp (the
  red token fallback must be the ramp's `--accent-red`/`--color-progress`, not a literal). The compose
  gold literals leave if compose is pruned (**T.E**). The `style.css:373` doc-comment hit clears in
  **T.D15**.
- **lockstep.** The banished-green literal appearing in BOTH the JS (`SpringHeatmap.vue:119`) and a doc
  comment (`style.css:373`) — both die in the same tranche (T.D17 JS, T.D15 comment); the grep gate
  greens only when both are gone.

## T.D18 — Dock-anchor calc labyrinth → anchor positioning + the chain-depth cap

- **scope.** **31** interdependent `--dock*`/`--work-area*`/`--stage*`/`--sheet*` tokens, **27
  `calc()`**, form a chain where one geometric fact (the mobile sheet must clear the menubar) threads
  through 6 levels (`--dock-band-reserve` → `--dock-bottom-anchor` → `--dock-menubar-reserve` →
  `--stage-reserve` → `--sheet-detent-expanded`), with the JS-measured `--menubar-measured-h`
  re-entering CSS (17 F7). The code carries its own fragility warnings: `style.css:206-224` documents a
  custom-property CYCLE that had to be hand-broken; a whole DUPLICATE `*-stable` twin subtree
  (`--dock-band-reserve-stable`, `--work-area-max-height-stable`, `style.css:233-249,539-558`) exists
  solely because the live chain oscillates ±8px. Lane 19 F6 quantifies it: a **6–7-level** dependency
  chain with a **diamond re-convergence** (`--dock-band-reserve` re-enters one level above its own
  consumer). Promote the `@supports (anchor-name)` tether (`style.css:440-462`) to the **PRIMARY**
  dock/stage geometry — the docks tether to the stage-cell rect directly, the reserve-band calc chain
  collapses to the anchor geometry. Additive (19 rec 6): the `ResizeObserver` that already publishes
  `--menubar-measured-h` publishes the FINAL consumer value (`--stage-safe-bottom`) directly, so no call
  site performs more than one `calc()` hop from a JS-published fact — removing the re-entrant diamond by
  construction and retiring the `*-stable` twin. De-duplicate the verbatim `--mask-fade` recipe
  (`ControlsPaneWrapper.css:286-300`, both `-webkit-mask-image` + `mask-image`).
- **gate.** **BORN-RED.** `--dock*`/`--work-area*` token count < 15 (from 31); zero `*-stable` twin
  tokens; a chain-depth lint — no `--dock*`/`--work-area*` property is defined in terms of another that
  is itself ≥3 `var()`-hops from a literal or a JS-published value; the mobile-sheet `proof:*` gates
  (`proof:live-session-mobile` et al.) stay green on the anchor path. Reds today (31 tokens, the
  `*-stable` subtree, the 6-level chain).
- **size.** L.
- **lanes.** 17 rec 7; 19 rec 6 (the chain-depth cap, additive).
- **edges.** The docks are the surface **T.C** recuts (dock grammar) and **T.G** de-layers for perf
  (the animating stage must never sit inside a `backdrop-filter` backdrop) — the anchor-geometry
  simplification is COORDINATED with both (the reserve-band math the perf de-layer removes is the same
  chain). Anchor positioning is NOT Baseline (lane 19 F7 — `@supports` gate REQUIRED); the always-correct
  floor STAYS as the progressive-enhancement fallback (never blanket-strip the `@supports` gate).
- **lockstep.** The `*-stable` twin and its consumers retire together; the JS `--stage-safe-bottom`
  publisher and the CSS consumer land in one motion; the mobile-sheet gates re-point to the anchor path
  before the old chain is deleted (never leave a gate reading a token the anchor path retired).

---

# GROUP 6 — FRAGILE CSS (lane 19, recs 2–7)

## T.D19 — Finish the `vh` → `dvh` migration

- **scope.** Raw `vh` survives at exactly the seam the codebase already engineered `dvh`-safe (19 F2):
  the cube's `--side-size`, at all three declaration sites — `CubeTarget.css:51`
  `min(25vh,25vw,15rem)`, `CubeTarget.css:72` `min(50vh,50vw,18rem)`, `CubeScene.vue:264`
  `min(40vh,40vw,16rem)` — one line from three already-correct `dvh` siblings (`--start-hero-band: 34dvh`)
  in the same disjoint-bands contract the cube-hero comment claims is "overlap-proof by construction"
  (yet the two bands are sized against DIFFERENT effective viewport heights whenever the mobile toolbar
  shows). Plus `EasingSidebar.vue:217` `min(56vh, 420px)`. Convert to the `dvh`/`dvi` paired form
  (`vw`'s dynamic sibling is `dvi`/`dvw`, per `EditorShell.vue:189-201`'s own `@supports not
  (height:100dvh)` fallback). Also route the raw viewport TEMPLATE literals (17 rec 10):
  `AssetViewport.vue:17` `pt-[18vh]`, `KeyframesAddDialog.vue:37` `min-h-[25vh]`,
  `CSSPasteDialog.vue:54` `min-h-[20vh]`, `DemoGlobalChrome.vue:32` `max-w-[90vw]` → `tokens.css`
  entries on `dvh`/`svh`.
- **gate.** **BORN-RED.** `grep -rnE '[0-9]vh\b' demo --include=*.css --include=*.vue | grep -v
  'dvh\|svh\|lvh'` returns only the ONE documented `@supports not (height:100dvh)` static-viewport
  fallback in `EditorShell.vue`; `grep -rnE '\-\[[0-9]+(vh|vw)\]' demo --include=*.vue` == ∅. Reds today
  (8 raw-vh live sites / 6 files + the 4 template literals).
- **size.** S.
- **lanes.** 19 rec 2; 17 rec 10.
- **edges.** The AssetViewport/compose literals leave if compose is pruned (**T.E**). The token
  entries land in **T.D15**'s `tokens.css`. `EasingSidebar` may be reshaped by **T.E**'s easing redesign.
- **lockstep.** The one intentional `@supports not (height:100dvh)` fallback in `EditorShell.vue` is
  ALLOW-LISTED, not converted (19 F7 — it is a correct static-viewport floor).

## T.D20 — Tokenize `EasingCurveCanvas.vue`'s glow/stroke/dash registry

- **scope.** The bezier-curve SVG (normalized 0–1 coordinate space, `viewBox="0 ${minY} 1 ${height}"`)
  carries ~20 raw sub-pixel magic numbers with zero tokens (19 F4): stroke widths (`:364` 0.015, `:370`
  0.008, `:388` 0.006, …), glow radii, dash patterns, and a `font-size: 0.055px` (`:494`) — several
  near-duplicates that have ALREADY drifted (the bezier-path glow `0.018/0.045` vs the handle glow
  `0.02` vs the traveling-dot `0.02/0.06`: three two-layer glow recipes for what the file's own L.W11
  comments call ONE signature; `0.018` vs `0.02` is a 10% delta with no stated reason). Name the recipe:
  `--curve-glow-inner`/`--curve-glow-outer` (or a two-stop shorthand), `--curve-stroke-width`/
  `--curve-stroke-width-ghost`/`--curve-dot-radius`; reconcile the three drifted glow variants into ONE
  designed value; add a one-line viewBox-user-unit convention comment so `0.055px` reads as intentional.
  The `0.055px` font-size folds with **T.D5** (ramp totality — annotate the SVG-text exemption).
- **gate.** **BORN-RED.** `grep -cE '0\.0[0-9]+px'
  demo/@/components/custom/easing-editor/EasingCurveCanvas.vue` drops to 0 outside token declarations.
  Reds today (~20 literals).
- **size.** S.
- **lanes.** 19 rec 4.
- **edges.** The RECONCILED glow VALUE is a Fable/frontend-design call inside **T.E**'s easing-scene
  redesign (VERDICT #16 "most of this page looks awful"; #14 "just the easing balls") + OD-6 — T.D20
  NAMES the recipe (the tokenization); the value the tokens hold is the redesign's. If the curve canvas
  survives the easing redesign (it is the page's SUBJECT, per 09 F7's contrast floor), the tokens do too.
- **lockstep.** If T.E guts the curve canvas, the tokens move with it (or die with it) — the gate is
  file-scoped, so it greens on either the tokenized-survivor or the removed path.

## T.D21 — Consolidate the blueprint-crosshair idiom (DPR-safe)

- **scope.** A specific `linear-gradient` hairline idiom — a 1px crosshair centered on the container
  midpoint via hard stops at `calc(50% - 0.5px)`/`calc(50% + 0.5px)` — is authored independently in
  THREE scenes (19 F5, verified 3 sites): `MorphTarget.vue:207-221`, `MotionPathTarget.vue:307-308`,
  `SquareInstrument.vue:110-123`. `MorphTarget.vue:192-193`'s own comment names the duplication as
  deliberate reuse-of-intent — but the CSS is RETYPED, not shared. Secondary fragility: the `0.5px`
  constant is device-pixel-ratio-fragile — the "half a pixel either side" trick yields a crisp 1-CSS-px
  line only at 1× DPR; on Retina/2× or 125%/150% OS zoom the hard stop anti-aliases into a soft band
  (invisible in local dev, shows only on hardware the reviewer isn't using). ONE `.blueprint-crosshair`
  idiom in `idioms.css` (T.D15's layer), color-parameterized (`--c`/`--border`), consumed by all three
  scenes; prefer a resolution-independent construction (`background-size: 100% 1px` band, or a `1px
  solid` pseudo-element pair) over the percentage-arithmetic hard-stop.
- **gate.** **BORN-RED.** `grep -rn 'calc(50% - 0.5px)' demo` resolves to ONE definition site, consumed
  ≥3 times — not 3 independent authorships. Reds today (3 def sites).
- **size.** S.
- **lanes.** 19 rec 5.
- **edges.** Two of the three sites (`MorphTarget`, `MotionPathTarget`) are being FUSED into
  `scenes/svg/` or pruned (**T.E**, OD-1) — the idiom lands in `idioms.css` REGARDLESS and is consumed
  by whatever survivor set exists (square survives; morph/motion-path per OD-1). Cross-ref T.E for the
  scene fate; the shared idiom is band-independent.
- **lockstep.** As morph/motion-path move/merge, the crosshair consumers repoint to the single idiom —
  a fourth scene adopting "the same blueprint-ground idiom" (a stated, reuse-inviting pattern name)
  finds the existing recipe, not a fourth retype.

---

## Cross-band coordination summary

| T.D wave | BORN | Owns | Key cross-band edges |
|---|---|---|---|
| T.D1 font-tuple gate | RED | the role-bound `(role,family,size,weight,style)` gate + manifest | substrate for T.D2–T.D6; T.F (title role); T.M6 (authority) |
| T.D2 honest weight | RED | `font-synthesis:none`, weight 400 display, ≥28px floor, kill 650, de-glow | T.H (`--font-display-weight` ask); T.D10 (hero ink) |
| T.D3 Jakarta body | RED (look→OD-6) | delete I.W6 reclaim, Jakarta register, no bare font-family, flip demo-fonts polarity | T.D7 (OD-6 look); T.D11 (home deck conflict); T.C (dock-label state) |
| T.D4 mono→data | RED | 430 leaves re-homed, mono ceiling gate | T.A/T.E (survivor set); T.M4 (ceiling) |
| T.D5 ramp totality | RED | every leaf on a `--type-*` rung | T.D2 (650), T.D20 (0.055px), T.H (kf-pill collapse) |
| T.D6 tuple consistency | RED | 9-title tuple + select-descriptor tuple | T.F (extract `<SceneTitle>`); T.H (LabeledSelect) |
| T.D7 violet accent | **OWNER OD-6** | the one oklch ramp; red→destructive-only (168 refs) | T.M1/M2/M3; T.D15 (`.dark`); T.D8/T.D17 (values) |
| T.D8 signal/contrast | RED (values→OD-6) | crayons-off-chrome; strokes ≥3:1 | T.M5 (quality oracle); T.E (easing curve color) |
| T.D9 hero φ-seat | **OWNER OD-4** | golden-section re-seat + two-focal capture gate | T.M1/M2/M3/M4; T.A (die); T.E/T.D12/T.D13 (furniture) |
| T.D10 per-char + ink | RED (RULED) | two-tier word→char split, honest ink | T.D9 (seat); T.D2 (weight); T.M7 (re-spec per-word gates) |
| T.D11 deck voice | **OWNER OD-4** | the home sub-header (serif-italic vs Jakarta) | resolves T.D3 conflict; gates T-TY9 (axis) |
| T.D12 typing-card excision | RED (RULED) | delete egg markup/CSS/`useHeroSourceEgg.ts` + gate clauses | T.M7 (retire design-refinement egg clauses) |
| T.D13 cursor OD-2 | **OWNER OD-2** | remove vs Aurora-on-hero; unconditional compose-wash kill | T.E (compose prune); T.H (public specular ask); T.D9 (hero mount) |
| T.D14 recurrence gate | RED | grep/AST no-hand-rolled-cursor-tracker | T.M6/M10; compose-independent |
| T.D15 style restructure | RED | de-arch + tokens.css/idioms.css + tiered authority + `--z-behind` | T.H (primitive census); T.A/T.E/T.F (telemetry idioms); T.D7 (`.dark`) |
| T.D16 cascade layers | RED | `@layer` order decl + kill `*` reset | T.D2/T.D3 (the `demo` layer); proof:brittleness |
| T.D17 literal purge | RED | banished-green + gold-value fallbacks → token fallbacks | T.D7 (token targets); T.D15 (doc comment); T.E (compose) |
| T.D18 anchor positioning | RED | dock/work-area token web → `anchor()`; chain-depth cap | T.C (dock recut); T.G (blur de-layer); lane19 F7 (@supports floor) |
| T.D19 dvh completion | RED | cube `--side-size` + template vh literals → dvh | T.D15 (tokens.css); T.E (compose/easing) |
| T.D20 glow tokenization | RED | EasingCurveCanvas magic-number registry → tokens | T.E (easing redesign values); T.D5 (0.055px) |
| T.D21 crosshair idiom | RED | one DPR-safe `.blueprint-crosshair`, ≥3 consumers | T.E (morph/motion-path fate); T.D15 (idioms.css) |

---

## Disposition of lane recommendations (zero silent drops)

Legend: **→ T.D#** = owned by a wave above · **↳ cross-ref** = owned by another band per the charter
(listed with its owning band) · **DEFERRED** = sequenced behind a dependency, reason given.

### Lane 09 — theme-typography (ALL assigned)

| Rec | Disposition |
|---|---|
| T-TY1 · honest display weight + serif floor | **→ T.D2** |
| T-TY2 · re-adopt the Jakarta body register | **→ T.D3** (home sub-header carve-out → T.D11/OD-4) |
| T-TY3 · demote mono to the data register | **→ T.D4** |
| T-TH1 · the violet accent authority (latent-red kill) | **→ T.D7** (BORN-OWNER OD-6; red-kill RULED, ramp owner-gated) |
| T-TH2 · signal proportion + functional contrast | **→ T.D8** |
| T-TY4 · ramp totality | **→ T.D5** |

### Lane 31 — font-census (ALL assigned)

| Rec | Disposition |
|---|---|
| T-TY-CENSUS1 · role-bound style-tuple gate | **→ T.D1** (the keystone) |
| T-TY1 · kill synthesized-bold at the token root | **→ T.D2** |
| T-TY2 · retire bold-italic sub-header; one body voice | **→ T.D3** (+ T.D11 for the home deck) |
| T-TY3 · draw the mono/display/body line; re-home 430 | **→ T.D4** |
| T-TY4 · collapse the two "big label" tokens | **→ T.D5** (mostly subsumed by KfPillTabs deletion → T.H) |
| T-TY5 · EasingSelect descriptor → LabeledSelect/`text-micro` | **→ T.D6** (tuple gate); LabeledSelect adoption ↳ **T.H** |
| T-TY6 · one shared watermark-title primitive (9 scenes) | **→ T.D6** (tuple gate); component extraction ↳ **T.F** |
| T-TY7 · delete the `font-weight: 650` magic number | **→ T.D2** |
| T-TY8 · dock "selected" bold declarative `[data-state]` | ↳ cross-ref **T.C** (dock recut owns dock-label state rules; the Jakarta register is T.D3's) |
| T-TY9 · drop the unused Instrument Serif italic axis | **DEFERRED → T.D11** — the hero deck (01/T-HOME-4) WANTS display-italic; drop the `:ital@0;1` axis ONLY if OD-4 rules the deck to Jakarta body, keep it if serif-italic wins. Conditional on OD-4. |

### Lane 01 — home-hero (ALL assigned)

| Rec | Disposition |
|---|---|
| T-HOME-1 · re-seat the hero on the φ band | **→ T.D9** (BORN-OWNER OD-4) |
| T-HOME-2 · per-char uplift rebirth | **→ T.D10** (RULED, born-RED) |
| T-HOME-3 · hero ink correction | **→ T.D10** (RULED; weight half shared with T.D2) |
| T-HOME-4 · serif-italic deck ramp | **→ T.D11** (BORN-OWNER OD-4; resolves the T.D3 sub-header conflict) |
| T-HOME-5 · typing-card excision | **→ T.D12** (RULED removal) |
| T-HOME-6 · transport play-first, divider, one tooltip | ↳ cross-ref **T.C** (dock/transport grammar; play-FIRST, elision, tooltip authority). T.D9 depends on it (edge). |
| T-HOME-7 · home two-focal composition gate | **→ T.D9** (the standing capture gate; a T.M4 stage-inventory instance) |

### Lane 12 — cursor-light (T-CL-1/T-CL-2 as the OD-2 pair + T-CL-3 assigned)

| Rec | Disposition |
|---|---|
| T-CL-1 · DO-IT-RIGHT (Aurora-on-hero) | **→ T.D13** (BORN-OWNER OD-2, option A) |
| T-CL-2 · REMOVE (excise the wash) | **→ T.D13** (BORN-OWNER OD-2, option B; compose-wash kill unconditional, rides T.E) |
| T-CL-3 · standing recurrence gate | **→ T.D14** (born-RED) |

### Lane 17 — styles-idioms (ALL assigned)

| Rec | Disposition |
|---|---|
| 1 · de-archaeologize the stylesheets | **→ T.D15** |
| 2 · split & de-tombstone `design-idioms.css` | **→ T.D15** |
| 3 · one tiered token authority | **→ T.D15** |
| 4 · declare cascade-layer order; kill the `*` reset | **→ T.D16** |
| 5 · consume glass-ui primitives; delete pills/rail | split: the CSS-recipe census + `progress-rail`/`status-badge` retirement **→ T.D15**; the KfPillTabs component deletion + SegmentedTabs adoption ↳ **T.H** (gated-on-publish excision) / **T.B** (spring-easing sidebars dissolve) |
| 6 · purge off-token color literals | **→ T.D17** |
| 7 · collapse the dock-anchor calc labyrinth → anchor positioning | **→ T.D18** (+ the chain-depth cap from lane 19 rec 6) |
| 8 · lift recurring scene-telemetry idioms to one recipe | **DEFERRED → T.D15** — most telemetry chips (square caption #11, gesture legend #8, cube readout #5, curve-physics #13) are REMOVED by **T.A/T.E**; the residual shared idiom folds into `idioms.css` after the prune settles; the scene-target file-size shrink is ↳ **T.F** (scene decomposition). |
| 9 · typography & dark-mode single-sourcing | split: no-bare-`font-family` **→ T.D3**; raw font-sizes → `--type-*` **→ T.D5**; the one-`.dark` consolidation **→ T.D15**; the palette *look* ↳ **T.D7** (OD-6, Fable pass) |
| 10 · token-route the raw viewport literals | **→ T.D19** |

### Lane 19 — fragile-css (recs 2–7 assigned; rec 1 is T.F's)

| Rec | Disposition |
|---|---|
| *(1 · single-source the 1023/1024px breakpoint — NOT assigned)* | ↳ cross-ref **T.F** (per my brief). See Charter-conflict note 1 (the charter T.D headline text also names it; the partition assigns it to T.F). |
| 2 · finish `vh`→`dvh` at cube `--side-size` + EasingSidebar | **→ T.D19** |
| 3 · delete the `--z-behind` duplicate; consume glass-ui's | **→ T.D15** (token authority) |
| 4 · tokenize `EasingCurveCanvas` glow/stroke/dash | **→ T.D20** |
| 5 · consolidate the `calc(50%±0.5px)` crosshair idiom | **→ T.D21** |
| 6 · publish one JS geometry value; break the chain diamond | **→ T.D18** (additive to lane 17 rec 7's anchor promotion) |
| 7 · do NOT blanket-strip `-webkit-`/`@supports` | **PROCESS CONSTRAINT** — folded as a guardrail into T.D16/T.D18/T.D19/T.D20 (each prefix/gate's Baseline date is checked before removal; only `-webkit-user-select`, inert since ~2022, is a safe delete). No standalone wave; no code change. Optional: a Baseline-date-citation requirement on any future prefix/`@supports` removal. |

---

## Charter conflicts / coordination notes spotted

1. **The `1023/1024px` breakpoint has a double home (charter §1 T.D headline vs the lane partition).**
   The charter T.D headline row lists *"fragile-CSS (ONE breakpoint source ×23 sites, dvh completion,
   crosshair idiom)"* — naming the breakpoint under T.D — but my explicit brief scopes lane 19 to
   "recs 2-7; **rec 1 is T.F's**," and lane 19 is ALSO listed under **T.F**'s lane set (charter §1 T.F:
   "13, 14, 15, 16, 22, 18, 19"). Resolution followed: **the breakpoint single-sourcing (lane 19 rec 1)
   is cross-ref'd to T.F**, per the partition. The likely rationale: the breakpoint has a CSS half
   (17 `@media`/`@container` at-rules — dvh/crosshair-adjacent, T.D-shaped) AND a JS half (5
   `useMediaQuery`/composable sites + the missing shared `DESKTOP_QUERY` constant — state/structure,
   T.F-shaped); the composable/constant side is T.F's re-architecture. **Flagged so the impl drive does
   not author the `theme(--breakpoint-lg)` CSS rewrite twice, and so T.F's breakpoint wave and T.D's
   dvh wave (T.D19) coordinate — they touch overlapping `@media` blocks in the same files
   (`CubeTarget.css`, `ControlsPaneWrapper.css`, `EditorStartScreen.vue`).**

2. **The home sub-header voice is contested BETWEEN two of my own lanes.** Lane 09 (T-TY2) says every
   sub-header → Jakarta body 500 non-italic; lane 01 (T-HOME-4) says the HOME deck → Instrument Serif
   true italic 400. These are two different designs for the same "from the list ☰ below…" line.
   Resolution: **T.D3 governs all NON-home sub-headers (Jakarta); the home deck voice is OD-4, decided
   in T.D11's owner-reviewed prototype** (serif-italic per 01 vs Jakarta per 09). This also gates
   **T-TY9** (drop the italic axis) — DEFERRED, because the axis stays iff the deck goes serif-italic.
   Not a charter conflict (both lanes are mine), but a real design fork surfaced UPSTREAM to the owner
   per the S.E lesson, rather than guessed in the doc.

3. **KfPillTabs / SegmentedTabs deletion is a three-band seam.** Lane 17 rec 5 (my lane) wants
   KfPillTabs deleted and glass-ui `SegmentedTabs` consumed; but the charter routes the KfPillTabs
   *component* excision to **T.H** ("gated-on-publish excisions (KfPillTabs, …)") and the spring/easing
   sidebar dissolution to **T.B**. Resolution: **T.D15 owns the CSS-recipe census + the `.progress-rail`/
   `.status-badge`/`tab-trigger-pill` retirement (styling); the KfPillTabs.vue + useKfPillTabs.ts
   deletion and the SegmentedTabs mount are T.H/T.B.** Flagged so the `tab-trigger-pill` CSS recipe (a
   byte-identical twin of KfPillTabs' recipe, `controls/tab-trigger.css:54-62`) is retired in lockstep
   with the component — never leave the demo's re-authored pill CSS standing after the component that
   used it dies.

4. **The scene-telemetry idiom extraction (lane 17 rec 8) is mooted by removals owned elsewhere.** Its
   subjects (square caption #11 → T.A; gesture legend #8, curve-physics #13, gallery #15 → T.E; cube
   readout #5 → T.A) are largely DELETED by T.A/T.E. DEFERRED into T.D15's `idioms.css` for the SURVIVOR
   set only, after the prune settles — flagged so T.D does not extract a shared idiom for chips that no
   longer exist, and so the scene-target file-size shrink (T.F's decomposition) is not double-owned.

5. **The EasingCurveCanvas glow VALUE vs the easing-scene redesign.** T.D20 tokenizes the glow/stroke
   registry (NAMES the recipe); but the reconciled glow VALUE and whether the curve canvas survives at
   all are **T.E**'s easing redesign (VERDICT #14/#16) + OD-6. Flagged so T.D20 lands the tokenization
   (a mechanical, isomorphic move) without pre-empting the redesign's value choice — and so if T.E guts
   the canvas, the file-scoped gate greens on the removed path too.
