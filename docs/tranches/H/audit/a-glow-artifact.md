# Tranche H Deep Audit — Lane `a-glow-artifact` (D2 / D14)

**Charge:** root-cause the radial/circular BLUR ("specular radial") hover artifact that
appears EVERYWHERE (panels, header, timeline). Delineate demo-owned vs glass-ui-HANDOFF.
Reconcile D2 (kill the broken radial blur, restore cartoon-shadow depth) with D14 (the
specular-radial hover needs TOTAL REFINEMENT — the glass is good, don't necessarily
delete it). Propose precisely what the hover should be, with tokens.

**Method:** live demo at http://localhost:5174/#/easing driven via Playwright MCP
(computed-style probes on `::before`, a synthesized `pointermove`, token resolution);
glass-ui 3.4.0 source + dist read under `node_modules/@mkbabb/glass-ui/`; git/C-tranche
history for the cartoon-shadow lineage.

---

## ROOT CAUSE (definitive, live-anchored)

The artifact is glass-ui 3.4.0's **`.glass-specular-track`** — the iOS-26 "Liquid Glass"
moving catch-light. It is a `::before` pseudo painting a masked
`radial-gradient(circle at var(--specular-x) var(--specular-y), …)` with
`mix-blend-mode: screen`, designed to ride the pointer position.
(`node_modules/@mkbabb/glass-ui/src/styles/glass-specular-track.css:31-89`.)

It is applied automatically by glass-ui's own components — NOT by the demo:

- **7 live elements** carry `.glass-specular-track` on `/#/easing` (live probe).
  - Every `<Card data-surface="glass">` panel (`div.glass-card.glass-resting
    .glass-specular-track`) — the controls panels, the spring panels, the playback
    ribbon card.
  - Every dock icon button (`button.dock-icon-button.glass-specular-track`).
- glass-ui bakes the class into its components: `dock.js`, `button-Ckn3eDfB.js`,
  and `CardFooter-C390imy7.js` all emit `glass-specular-track` (dist grep).

**Why it reads as a "circular/radial BLUR pinned center, blooming on hover" rather than a
travelling catch-light** — the two-part defect, both proven live:

1. **The pointer seam is unwired on Cards.** The specular's position is driven by the
   consumer writing `--mouse-x` / `--mouse-y` onto the host
   (`glass-specular-track.css:19-22, 48-49` — "the pointer write is the consumer's
   seam"). The dock button DOES wire it (`dock.js` writes `--mouse-x`/`--mouse-y`, dist
   grep: 1 each). **The Card component does NOT** (`CardFooter-C390imy7.js` emits
   `glass-specular-track` but has ZERO `--mouse-*` / `pointermove` writes — dist grep).
   Live: synthesizing a `pointermove` on a Card leaves `--mouse-x`/`--mouse-y` empty,
   so the `::before` falls to its `var(--mouse-x, 50%)` floor and the computed
   background is `radial-gradient(circle, …)` with **no `at <x> <y>`** — a **static,
   dead-centered** radial blob, never the intended travelling light.

2. **Hover BLOOMS the static blob.** `.glass-specular-track:hover::before` lifts
   `--specular-intensity` 0.35 → 0.6 (`glass-specular-track.css:100-102`), and intensity
   drives the whole layer `opacity` (live rest `::before` opacity = `0.35`). So on every
   panel and the header/timeline cards, hovering brightens a fixed center-screen glow by
   ~1.7× over a 240ms `opacity` transition — read by the user as "a strange
   circular/radial blur appears on hover everywhere." Over the deep dark canvas the
   `screen` blend lifts even harder (`--specular-intensity: 0.22` dark floor,
   `:91-94` — the screen blend "lifts harder on dark").

**Net:** the feature is structurally sound for surfaces that wire the pointer (the dock),
but glass-ui ships it ON the Card with the pointer seam UNWIRED, degrading it everywhere
to a static, hover-blooming center-radial — the D2 artifact. This is a **glass-ui
component defect** (Card opts a surface into a pointer-tracked effect it never feeds),
not a demo authoring mistake.

### Cross-check: the demo's OWN `--glow-*` is NOT the artifact

The D2 candidate `design-idioms.css:263-269` (`--glow-spread`/`--glow-blur` +
`box-shadow … color-mix(--color-progress 40%)`) is `.progress-dot` — the **active-playing
conic-ring** progress affordance, driven by `--dot-p`, present only while an animation
plays; likewise `.progress-ball` `box-shadow` (`:316`). These are legitimate, scoped
progress glows, not hover treatments, and they read green (`--color-progress`
`hsl(142 71% 45%)`, `style.css:160`), not the warm-white screen blob. **Not the
defect** — leave them. The demo authors NO `:hover` radial/blur anywhere
(`grep ':hover' demo/@/styles` → only `.scale-on-hover`). The artifact is 100% the
transitive glass-ui `.glass-specular-track`.

### The cartoon-shadow lineage (D2 "regression?")

Cartoon-shadow was adopted in **Tranche C.W2**: CSSCodeEditor migrated to glass-ui's
`@utility cartoon-surface` (`cards.css:33-48`; closure logged
`docs/tranches/C/audit/design-findings.txt:18,112`). It is NOT regressed — it still
resolves live (`cartoonCount: 1`, `--shadow-cartoon-md` →
`-4px 3px 1px color-mix(…light-dark…12%)…`, `--cartoon-shadow` → `3px 3px 0px 0px …`).
The accurate framing: cartoon-shadow was only ever wired to ONE element (the code
editor), while the specular radial spread onto EVERY Card/dock surface and visually
dominates. So D2's instinct is right — **promote cartoon-shadow to the demo's
gestalt depth/hover idiom** and demote/refine the radial — but it's a coverage +
glass-ui-defect story, not a deleted token.

---

## RECONCILING D2 + D14 — what the hover SHOULD be (precise)

D14 clarifies: the glass is good; refine the specular hover; reconcile with cartoon-shadow
depth. The gestalt resolution is a **two-layer hover identity**, each layer doing the one
thing it is good at — NO radial-blur bloom:

- **DEPTH = cartoon offset-stamp** (the demo's brand register): a hard, offset, hard-edge
  shadow that grows on hover — `box-shadow: var(--shadow-cartoon-md)` at rest →
  `var(--shadow-cartoon-lg)` on hover, paired with the existing `translate: var(--lift-sm)
  var(--lift-sm)` lift. This IS `cartoon-surface` (`cards.css:33-48`) — already shipped,
  theme-aware via `--shadow-color`, with a built-in spring-bouncy translate + apple-eased
  box-shadow transition. It reads as a tactile Memphis sticker rising, not a blur.

- **SPECULAR = a TRACKING catch-light, only where the pointer is fed** (D14 "the glass is
  good"): the specular is RIGHT when it actually rides the cursor (the dock proves it).
  The refinement is to make the catch-light TRACK on the surfaces that show it, and to
  tame its rest/hover intensity so it never blooms as a centered blob.

### The disposition for the demo (precise rules)

1. **Cards/panels/header/timeline (the "everywhere" surfaces): drop the unwired
   specular, adopt cartoon depth.** The demo should stop rendering the broken
   center-blob on its panels. Two clean routes, both idiomatic and gate-able:

   - **(preferred, gestalt) Reskin the demo's panel surface to the cartoon register.**
     Where the demo mounts `<Card surface="glass">`, prefer `<Card surface="cartoon">`
     (composes `.cartoon-surface` over the glass tier — `cards.css:32`) so the panel's
     hover identity becomes the offset-stamp lift, NOT the specular. The specular
     `::before` only paints when `.glass-specular-track` is present; `surface="cartoon"`
     does not add it (only `surface="glass"`/the glass tiers do, per the dist), so this
     ALSO removes the artifact at its source for the demo's panels. ONE motion, no
     suppression hack.
   - **(fallback, if the Card API forces glass+specular together) demo-owned neutralizer
     in `design-idioms.css`** — a named demo idiom (NOT an ad-hoc patch) that pins the
     unwired specular static-quiet on the demo's panels: `.glass-specular-track:not(
     [data-mouse-tracked])::before { --specular-intensity: 0; }` so the center-blob and
     its hover-bloom vanish, leaving the genuine glass blur + the cartoon depth. This is
     a stopgap pending the glass-ui fix (below) and must be tagged as such.

2. **The dock (where the specular DOES track): keep it, refine intensity.** D5/D14 — the
   dock catch-light is the one correctly-wired specular; keep it as the "illuminate under
   your fingertip" affordance. The only refinement: it currently shares the same
   0.35/0.6/0.85 rest/hover/active intensities as the broken Cards; consider a slightly
   lower rest floor so it whispers at rest and brightens on engagement. This is a
   glass-ui token tune (`--specular-intensity` floors), not a demo edit.

3. **The interactive scene targets that ALSO want a tracking catch-light** (D11 — make
   modes more interactive): for those that legitimately want the iOS-glass illuminate,
   the demo should wire the seam — a thin `pointermove` listener writing
   `--mouse-x`/`--mouse-y` as percentages onto the host — so the specular becomes the
   travelling light it was designed to be, not a static blob. (This is the consumer seam
   glass-ui documents at `glass-specular-track.css:19`.) Reuse a single demo composable
   (`useSpecularPointer`) so it is DRY across the surfaces that opt in.

### Tokens (the precise hover vocabulary)

| Layer | Rest | Hover | Source token | Owner |
|---|---|---|---|---|
| Depth (cartoon) | `--shadow-cartoon-md` | `--shadow-cartoon-lg` + `translate: var(--lift-sm) var(--lift-sm)` | `cards.css:33-48`, `tokens.css:552-554`, `--lift-sm` (live `-1px`) | glass-ui (consumed) |
| Specular (only when tracked) | `--specular-intensity: 0.35` (0.22 dark) | `0.6` | `glass-specular-track.css:53,93,101` | glass-ui |
| Demo neutralizer (fallback) | `--specular-intensity: 0` on untracked panels | — | NEW demo idiom in `design-idioms.css` | demo |

No new color tokens needed — cartoon shadows are theme-aware via `--shadow-color`;
specular tint is the warm-cream `hsl(40 30% 100%)` glass identity (keep, it's the "good
glass").

---

## FINDINGS & DISPOSITIONS

### F1 — `.glass-specular-track` on Cards is an unwired, hover-blooming center-radial (THE D2 artifact)
- **Anchor:** live — 7 `.glass-specular-track` elements on `/#/easing`; Card `::before`
  computes `radial-gradient(circle, …)` (no `at`), rest opacity `0.35`, blooms to `0.6`
  on `:hover` (`glass-specular-track.css:63-69, 100-102`). `pointermove` on a Card leaves
  `--mouse-x`/`--mouse-y` empty (live). `CardFooter-C390imy7.js` emits the class with NO
  pointer write (dist grep); `dock.js` DOES write `--mouse-*`.
- **Gestalt fix:** demo panels move to the cartoon-depth hover identity
  (`surface="cartoon"` preferred; `--specular-intensity: 0` neutralizer as fallback).
  The root defect — Card shipping a pointer-tracked effect with the seam unwired — is a
  **glass-ui-HANDOFF**: either Card should NOT add `.glass-specular-track` unless the
  pointer is fed, OR Card should wire the seam itself (like the dock does).
- **Disposition:** **SHIP-in-H** (demo panels → cartoon depth) **+ glass-ui-HANDOFF**
  (Card specular seam: wire-or-omit).
- **Instrument (proof:specular):** a visual lock + a computed-style gate — after the fix,
  NO demo panel/`.glass-card` has a `::before` whose computed `opacity` changes between
  rest and `:hover` on a non-pointer-tracked surface (assert rest==hover for untracked
  specular), AND every visible specular `::before` either is `display:none`/`opacity:0`
  OR has a host that writes `--mouse-x`. A Playwright hover-bloom screenshot diff on a
  controls panel locks the "no center radial bloom" pixel state.

### F2 — Cartoon-shadow depth is under-deployed (covers 1 element; should be the demo's gestalt hover/depth idiom)
- **Anchor:** live `cartoonCount: 1` (only CSSCodeEditor, the C.W2 adoption,
  `docs/tranches/C/audit/design-findings.txt:18`); meanwhile 7 surfaces carry the
  specular. Tokens resolve correctly (`--shadow-cartoon-md`/`-lg` live).
- **Gestalt fix:** make cartoon offset-stamp the demo's canonical surface DEPTH +
  hover-lift across panels (route through `surface="cartoon"` / `.cartoon-surface`, not
  re-authored). This is the D2 "restore cartoon-shadow as the idiomatic depth/hover
  treatment," correctly scoped: it was never lost, just under-applied.
- **Disposition:** **SHIP-in-H** (demo styling — coverage, via the existing glass-ui
  utility; no new tokens).
- **Instrument (proof:cartoon):** assert each demo panel's resting `box-shadow` resolves
  from `--shadow-cartoon-md` (or the `cartoon-surface` utility) and grows to
  `--shadow-cartoon-lg` on `:hover`; visual lock on the lift.

### F3 — The specular pointer seam is missing on every demo surface that shows it (refinement path for D14/D11)
- **Anchor:** `glass-specular-track.css:19` (consumer seam); demo has zero `--mouse-x`
  writers (grep). The effect is "good glass" ONLY when fed.
- **Gestalt fix:** a single demo composable `useSpecularPointer(elRef)` (writes
  `--mouse-x`/`--mouse-y` % on `pointermove`, respects `prefers-reduced-motion` by
  no-op) applied to the surfaces that legitimately want the travelling catch-light
  (interactive scene targets, D11). DRY, one source.
- **Disposition:** **SHIP-in-H** (only on surfaces kept as specular; everything else goes
  cartoon per F1). If H descopes interactivity, **BOOK** the composable.
- **Instrument:** after a synthesized `pointermove`, the tracked host's `--mouse-x`
  reflects the pointer % and the `::before` background computes `circle at <x> <y>` (not
  the centered floor).

### F4 — Specular rest intensity & screen-blend on dark could be softened (whisper-at-rest)
- **Anchor:** `--specular-intensity` 0.35 light / 0.22 dark
  (`glass-specular-track.css:53,93`); screen blend "lifts harder on dark" (`:91-94`).
- **Gestalt fix:** lower the rest floor so even the tracked (dock) specular whispers at
  rest and reads only on engagement — a token tune in glass-ui.
- **Disposition:** **glass-ui-HANDOFF** (token tune; not a demo edit).
- **Instrument:** none in kf; glass-ui's own visual gate.

---

## DEMO-OWNED vs glass-ui-HANDOFF (the delineation)

- **Demo-owned (SHIP-in-H):** which surfaces wear which hover identity. Panels →
  cartoon-depth (`surface="cartoon"` / `.cartoon-surface`, F2); the optional
  `useSpecularPointer` composable + `--specular-intensity: 0` neutralizer idiom in
  `design-idioms.css` (F1 fallback, F3). The demo's own `--glow-*` progress affordances
  are correct — leave them.
- **glass-ui-HANDOFF:** the structural defect — `<Card surface="glass">` adds
  `.glass-specular-track` but never wires the `--mouse-*` seam, so the effect degrades to
  a static hover-blooming center-radial on every Card (F1). Fix at the source: Card must
  either wire the pointer (as `dock.js` does) or omit the class until a consumer opts in.
  Plus the rest-intensity / dark screen-blend tune (F4). **Do NOT patch glass-ui inside
  kf** — these are ASKs to the glass-ui repo.

---

## BINDING-MANDATE CHECK
- NO workaround: the gestalt path replaces the broken hover in ONE motion
  (`surface="cartoon"`) rather than masking it; the neutralizer is named as an explicit,
  tagged stopgap only if the Card API forces glass+specular coupling.
- NO legacy: cartoon-shadow is the EXISTING, adopted utility (C.W2) — re-deployed, not
  re-authored; no alias, no fork.
- Cross-repo discipline honored: the Card/dock specular defects are glass-ui-HANDOFFs,
  not kf patches.
- MEASURE-FIRST: every claim is anchored to a live computed-style probe or a
  glass-ui source file:line; the "static center blob + hover bloom" is observed, not
  asserted.
