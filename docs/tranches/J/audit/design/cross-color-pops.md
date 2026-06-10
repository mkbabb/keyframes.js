# Cross-cut audit — COLOR POPS + the ICON language (Tranche-J)

Lane: `color-pops-icons`. Read-only audit. Every finding cites a screenshot region and the owning source file.

---

## 0. The pop grammar today — what I found

**The two palettes that should rhyme but don't.**

There are, in fact, TWO distinct color systems in this app, and they have drifted apart:

1. **The ICON palette — a full 6-colour rainbow + gold.** Defined in `demo/@/styles/design-idioms.css:46-58` (`--rainbow-red/orange/yellow/green/blue/violet` + `--rainbow-cyan`) and `:72-80` (`--color-gold` ramp). The scene glyphs (`assets/icons/*.svg`) draw from this richly:
   - `cube.svg` / `amiga.svg` / `square.svg` — colorful 32×32 raster embeds (magenta/yellow/red cube; red·white checker ball; teal diamond).
   - `easing.svg` — violet `hsl(248 88% 71%)` curve.
   - `spring.svg` — `--color-progress` green curve + a `--rainbow-green` rest dot.
   - `sequence.svg` — FOUR stops: `--rainbow-violet / blue / cyan / green` ascending bars.
   - `motion-path.svg` — `--rainbow-cyan` dot + cyan dashed track.

2. **The SUBJECT palette — collapsed to ONE green.** The animation TARGETS (the thing the engine actually moves, the protagonist of each scene) almost all resolve to `--color-progress` green via the single shared `.progress-ball` idiom (`design-idioms.css:399-409`, hardcoded `background: var(--color-progress)`):
   - Easing hero ball → green (`easing-desktop.png`, centre stage).
   - Spring hero ball + the 4 spring dots + `SETTLED` badge → green (`spring-desktop.png`).
   - MotionPath traveller + guide path + handles → green (`motion-path-desktop.png`; `MotionPathTarget.vue:234,245,252,262,269` all `--color-progress`).
   - Sequence staggered cells → green at 55-70% opacity (`SequenceTarget.vue:374,391,402`).

   The exceptions are the **3D subjects** (cube faces = magenta/yellow/red; amiga ball = red/white) and the **square** (`aquamarine`).

**The headline incongruence:** the Sequence icon is a 4-colour ascending rainbow, but the Sequence STAGE renders five rows of identical faint-green ghosts (`sequence-desktop.png`). The MotionPath icon is cyan, but the MotionPath traveller is green (`motion-path-desktop.png`). **The icon promises a spectrum the subject does not keep.** A user picks "Sequence" because the glyph sang violet→green; the stage then delivers monochrome. This is the single largest pop defect in the app, and it is structural — it lives in the shared `.progress-ball` / `--color-progress` idiom, not in any one scene.

**Where the field is correctly calm:** the glass control cards, the dock, the menubar, the inputs — all `--muted-foreground` gray (`cube-desktop.png` left rail). This restraint is RIGHT and must be policed. The two-card left rail in cube/amiga/square/easing is entirely monochrome chrome, and that is the correct dominant calm field.

**Where the one orchestrated motion-colour moment lives (and works):** the group-play button. At rest it is a rainbow disc (`#rainbow-gradient`, `AnimationControlsGroup.vue:109`); on play it becomes a rainbow-bordered pause (`cube-desktop-open.png`, bottom dock). This is the demo's best pop — singular, saturated, motion-coupled. It is the model the rest of the app should rhyme against.

---

## 1. Is there a coherent palette across the 8 scenes' subjects + icons?

**Icons: yes — one family, well-disciplined.** All 32×32, all viewBox `0 0 32 32`, the vectors share `stroke-linecap="round" stroke-linejoin="round"`, stroke-width 2.5-3, and draw from the named token spectrum. The three raster embeds (cube/amiga/square) are a deliberate sub-register (pixel-faithful homages). Coherent.

**Subjects: no — accidental drift in two directions.**
- **Collapse:** 4 of the editor/storyboard scenes (easing, spring, motion-path, sequence) collapsed to the SAME green, erasing the per-scene identity the icons establish.
- **Off-palette literal:** the square subject is `background-color: aquamarine` — a raw CSS named colour (≈`#7FFFD4`), not on the rainbow or gold token ladder, and an ad-hoc literal that violates the design-tokens rule (`SquareScene.vue:162`). It happens to read as a desaturated cyan, but it is unowned and un-tunable.

So the icon palette is the brand's intended spectrum; the subject palette has quietly become green-plus-exceptions. **Reconciling them is the central recommendation of this lane** (see §5).

---

## 2. Where pops are MISSING (named, with screenshots)

| Where | Screenshot | What's timid |
|---|---|---|
| **Amiga boing ball is dwarfed** | `amiga-desktop.png` centre | The iconic red/white Amiga checker ball — the single most recognizable retro-graphics homage in the app — renders at ~80px inside a vast gray perspective room (~960px wide). The famous ball is a thumbnail; the gray field dominates ~95% of the stage. The brand's loudest pop is rendered nearly silent. |
| **Easing stage is a white void** | `easing-desktop.png` right; `easing-desktop-open.png` | The ~960×680 stage card — the most prominent surface in the scene — is empty white with one green ball on a 2px gray rail. The violet bezier curve (the actual math-brand hero) is exiled to a 230px card on the left. The big surface is the most timid. |
| **Sequence cells are ghosts** | `sequence-desktop.png` rows @0MS-@1040MS | Five staggered rows of faint-green cells at 55% opacity — barely legible against white. The stagger storyboard is the literal visualization of the engine's temporal orchestrator; it should be the app's most colorful readout and is its palest. |
| **MotionPath traveller is monochrome** | `motion-path-desktop.png` | Traveller + path + 4 handles all the same green; only the gold sparkle on the active traveller breaks it. The loop-path geometry is gorgeous but reads as one flat green. |
| **Hero headline carries no colour** | `home-desktop.png` / `-open.png` | "Select an animation..." is solid near-black Instrument Serif — large and audacious in SCALE, but monochrome. The only colour in the entire text block is the gold emoji. The trailing "..." (which already animates as gray dots, `home-desktop.png` after "animation") earns a pop. |
| **Mono readouts render gray** | `easing-desktop.png` `F(0.40)=0.686`; `spring-desktop.png` `X=1.000·V=0.00`; `motion-path-desktop.png` `OFFSET-DISTANCE=0%·TANGENT-89°` | The live engine readouts — the numbers that ARE the dogfooded product — are gray Fira Code. The computed live value (the `= 0.686`, the settling `X`) earns the scene's accent colour; it is the one number that proves the engine is running. |

---

## 3. Where pops would be WRONG (police proportion)

These must STAY calm; do not let color creep here:
- **The two-card left rail** (`cube-desktop.png`): duration/delay/iterations inputs, the select chrome — correctly gray. Keep.
- **The dock + menubar surfaces** (`*-desktop.png` bottom): the glass pill, the reset/trash icons — `--muted-foreground`. The ONE accent there (the rainbow play disc) is enough; do not tint the reset/trash.
- **The collapsed dock pill label** (`cube-desktop.png` top "Cube"): the colorful glyph + plain `text-foreground` label is the correct ratio — glyph sings, label stays calm. Do not color the label.
- **Glass card borders / backdrop** — keep neutral. The whole point of the calm field is that the accents read.

The app's restraint on chrome is genuinely good. The fix is NOT "more color everywhere" — it is "let the SUBJECT keep the promise its ICON made," and "let the one live number wear the accent."

---

## 4. The ICON language — one family? + 4-6 proportionate extensions

**Family verdict:** the 7 scene glyphs are a coherent family (§1). One real inconsistency worth noting: the favicon (`assets/icons/favicon.svg`) is a MONOCHROME line-art cube (`#4c3ee8` violet stroke, no fills), while the nav cube glyph (`cube.svg`) is the colorful magenta/yellow/red raster. **The brand's signature image — the colorful cube — is absent from browser chrome.** (`home-desktop.png` shows the colorful cube is THE hero; the tab favicon is a different, drabber cube.)

**Extensions (proportionate, befitting — name 4-6):**

1. **Colorful-cube favicon + `theme-color`.** Promote the colorful cube to the favicon (or a simplified 3-face flat-color version that survives 16px), and add a `<meta name="theme-color">` keyed to the cube's magenta/violet. `demo/app/index.html:24` currently points at the monochrome glyph; there is no `theme-color` and no `apple-touch-icon`. The most-seen surface of the brand (the browser tab) should carry the brand's most-seen colour.

2. **Dock active-state celebrates the scene hue.** Today the active pill is signalled only by a neutral `StatusDot` (`ChromeDock.vue:224`, `:active` variant). The active scene's glyph already carries its hue — let the active pill's `StatusDot` (or a hairline underglow) adopt the scene's accent token (cube→magenta, easing→violet, spring→green) so the dock telegraphs "you are in the violet scene." One token swap per scene, no new chrome.

3. **Section markers in the controls.** The controls pane has section headers ("easing", "advanced", the tab strip — `cube-desktop.png` left card) rendered in flat `--muted-foreground`. A 2px leading accent-rule or a tiny tinted glyph per section (drawing the scene's accent) would extend the icon language into the panel without adding a box.

4. **Empty/start-state glyph.** The home start-screen and the empty storyboard panels (`sequence-desktop.png` shows an empty rounded pill top-left where the collapsed panel sits) are blank. A faint, large, single scene glyph as a watermark behind the empty state would carry the icon language into negative space (the way the cube already backdrops home).

5. **The trailing "..." as an easing easter-egg.** The hero's "Select an animation **...**" trailing dots already animate (`home-desktop.png` shows three gray dots fading after "animation"). Let those three dots draw `--rainbow-cyan / blue / violet` and stagger on the engine's own `stagger` distribution — the demo dogfooding its sequence primitive in its own headline. Tiny, proportionate, on-brand.

6. **A favicon/loading micro-glyph that IS an animation.** Since motion is the product, the loading/`<Suspense>` fallback could be the easing-curve glyph stroke drawing itself (the violet bezier `easing.svg` path, `stroke-dasharray` reveal) — one extension that makes even the wait-state dogfood the engine.

---

## 5. ONE cohesive PALETTE recommendation (tokens, grounded in what exists)

Do NOT invent new hex. The palette already exists in `design-idioms.css` — the recommendation is to **make the subjects DRAW from it the way the icons already do**, plus formalize two seams.

**The pop palette (all already tokens):**
- **Spectrum:** `--rainbow-red / orange / yellow / green / blue / violet / cyan` (`design-idioms.css:46-58`).
- **Live/progress accent:** `--color-progress` green (`style.css:186`) — keep as the GENERIC "this is moving" tone, but stop making it the ONLY subject colour.
- **Sparkle/celebration:** `--color-gold` ramp (`design-idioms.css:72-80`) — already the Format-button + the motion-path active sparkle. The "achievement/settled" accent.

**The four moves to reconcile subjects with icons:**

1. **Parameterize `.progress-ball`.** Add a `--ball-tone` var (default `--color-progress`) to `.progress-ball` (`design-idioms.css:406-407`), exactly as `.status-badge` already does with `--badge-tone` (`:436`). Then each scene's ball sets ONE token to match its ICON:
   - easing ball → `--rainbow-violet` (matches `easing.svg`).
   - spring ball → `--rainbow-green` / keep `--color-progress` (the icon's rest dot IS green — already consistent).
   - motion-path traveller → `--rainbow-cyan` (matches `motion-path.svg`).
   This is the highest-leverage single change: one new var, four one-line consumers, and every subject finally keeps its icon's promise. No new colours, no ad-hoc CSS — it reuses the proven `--badge-tone` pattern that already lives one section above in the same file.

2. **Map the Sequence cells onto the spectrum.** The Sequence icon is violet→blue→cyan→green ascending. The five staggered ROWS should each draw the corresponding `--rainbow-*` stop (row 0 violet … row 4 green) instead of one green at 55% opacity (`SequenceTarget.vue:374,391,402`). The stagger storyboard becomes a literal rainbow — exactly what its glyph advertises — and it visualizes "these are DIFFERENT children on one clock," which the uniform green actively hides.

3. **Retire the `aquamarine` literal.** Replace `SquareScene.vue:162`'s raw `aquamarine` with a named token. If the teal is intentional (the square icon IS teal), promote it as `--subject-teal` in the idiom layer; otherwise route it to `--rainbow-cyan`. Either way, off the raw named-colour and onto the owned ladder.

4. **Give the live readout the accent.** The computed value in each mono readout (`= 0.686`, the settling `X`, `TANGENT`) should wear `--ball-tone` (the scene accent), so the number that proves the engine runs is the number that carries the colour. Labels stay `--muted-foreground`; only the LIVE value pops. This is the proportionate way to add color to readouts without tinting the whole panel.

**Net effect:** the icons and subjects sing the SAME spectrum; the chrome stays calm; the gold stays reserved for celebration; one orchestrated rainbow moment (group-play) stays the loudest note. Dominant calm field, sharp saturated accents, per-scene identity restored — within proportion.

---

## 6. Owner split

- **kf-demo:** the `.progress-ball` `--ball-tone` parameterization, the per-scene ball/traveller/cell token consumers, the Sequence-rows spectrum map, the `aquamarine` retirement, the readout-accent, the colorful favicon + `theme-color`, the hero "..." easter-egg, the amiga-ball scale, the easing-stage activation. All live in `design-idioms.css` + the scene `.vue` files + `index.html`.
- **glass-ui-handoff:** IF the dock active-state hue-celebration (§4.2) needs a new `StatusDot` tone slot, or the `.rainbow-vivid/.rainbow-pastel` play recipes need a per-scene-tinted variant — those are glass-ui ASKs (the recipes are glass-ui-owned per `design-idioms.css:26-30`), never patched in the demo.
