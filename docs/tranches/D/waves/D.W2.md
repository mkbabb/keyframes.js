# D.W2 — The design language localized + uncaged (styling gestalt)

The styling-lane wave. C.W2 made the demo speak ONE design language at the
HEADLINE tier (the φ-ladder display/heading rungs, `--font-display`, the
cartoon-surface / halo / `.glass-card`-leak token migrations) and BOOKED its
leaf-tail (typography-ladder F6, ~100 body sites) to a mechanical follow-on
with a real owner. D is that owner. D.W2 finishes the styling gestalt on three
fronts the C-close named but did not land: (1) **localize the demo's own design
idioms** — the `--rainbow-*` / `--color-gold` / `.scale-on-hover` /
`@keyframes enter` vocabulary the demo USES everywhere but OWNS nowhere — into
ONE colocated layer, closing an undocumented cross-repo rent; (2) **uncage the
`utils.css` monolith** — the component-specific rules trapped in the global
sheet move to their components' `<style scoped>`; (3) **terminate the φ-ladder
leaf-tail** and the Tailwind arbitrary-value / `!`-override drift. Grounds:
the styling lane (`audit/styling-findings.md`); C.md §deferred-ledger
(F6 KFD); `design-findings.txt` color-token F4 / component-idiom F1 (the C
RECORDED-not-this-wave items D now homes).

## § The state, verified (not asserted)

Before scope: the exact live facts, each grep-confirmed against demo source +
the pinned glass-ui dist, so the wave's framing is honest.

1. **The "undefined idioms" RESOLVE today — through a sibling, by accident of
   the pin.** The demo imports `@mkbabb/glass-ui/styles`
   (`demo/@/styles/style.css:3`), whose `index.css` `@import`s `tokens.css`
   (`--rainbow-red…violet`, `--rainbow-pastel-*`, `--color-gold`) and
   `utilities.css` (`@utility scale-on-hover`, `@utility rainbow-vivid`,
   `@utility rainbow-pastel`). So the 13 `.scale-on-hover` sites, the two SVG
   `var(--rainbow-*)` gradients, the `text-[var(--color-gold)]` Format button,
   and the `.rainbow-vivid`/`.rainbow-pastel` play buttons paint correctly RIGHT
   NOW — *as long as glass-ui keeps shipping them*. The C-era audit read these
   as "referenced but never defined" because they have **zero definition in the
   demo's own tree**; the truth is subtler and worse: the demo rents its core
   visual identity from a sibling's incidental surface with no local contract,
   no fallback, and no gate. The day glass-ui's AT/AU arm renames `scale-on-hover`
   or drops a `--rainbow-*` token (it owns that vocabulary; it is free to), the
   demo's 13 hover affordances and two rainbow gradients silently flatten —
   a latent bug armed by a transitive dependency. `@keyframes enter`
   (`utils.css:129`) likewise resolves only via `tw-animate-css`
   (`style.css:2`) — same rent, different landlord.

2. **`--rainbow-cyan` is already gone.** The C audit named a "rainbow-cyan
   palette gap" (`KeyframesEditor.vue` gradient). The current source uses an
   inline `hsl(180 80% 50%)` cyan stop in the `.progress-bar` gradient
   (`KeyframesEditor.vue:481`) — no `--rainbow-cyan` reference survives. The
   gap is closed; D does not re-litigate it. (The inline `hsl()` is itself a
   leaf the localized layer absorbs — see S1.)

3. **The leaf-tail is 89 word-boundary sites, not 128.** `grep -rnoE
   "\btext-sm\b|\btext-xs\b|\btext-base\b" demo/ --include="*.vue"` (excluding
   `dist/`) = 89 (`text-sm`×21, `text-xs`×57, `text-base`×11) — the SAME
   instrument the S5.2 gate uses (the word-boundary form; a bare
   `text-sm\|text-xs\|text-base` grep overcounts inside `text-small` and the
   like). C's ~128 was a pre-C upper-bound estimate; D works the measured set and
   the sweep proves zero against this exact figure.

4. **The `utils.css` monolith carries six component-specific rule families**
   (`utils.css`, 152 lines): `.tab-trigger-*` (8-45), `.btn-playback*` (47-81),
   `.demo-container`/`.demo-box` (83-108), the `[data-state=active][role=tabpanel]`
   tab-panel slide (127-132), `.ppmycota-*` branding (134-152), and the
   `--ppmycota-primary` root token (3-5). Only `.container-inline-size`/`.icon`/
   `.is-disabled` (110-125) are genuinely cross-cutting utilities.

This wave's first move is to make the demo OWN what it depends on — converting
an accidental, ungated cross-repo rent into a deliberate, gated, colocated
contract. The bug "closes" not because the idioms start resolving (they
already do) but because their resolution becomes the demo's own falsifiable
responsibility.

## § Goal

**What lands:**
- ONE localized idiom layer — `demo/@/styles/design-idioms.css` — DEFINES the
  demo-owned design vocabulary the demo references everywhere: the
  `--rainbow-*` six-colour family (the two SVG/CSS gradients' stops) +
  `--color-gold`, `.scale-on-hover`, `@keyframes enter` and its consuming
  rule. Imported by `style.css` AFTER the glass-ui cascade so it is the demo's
  single source of truth for these idioms; the latent rent becomes an owned,
  gated contract. The two `.rainbow-vivid`/`.rainbow-pastel` play-button
  utilities stay glass-ui-owned (they are full multi-stop recipes, not demo
  idioms) — the layer pins only what the DEMO authored against.
- The `utils.css` monolith uncaged: every component-specific rule family
  (`.tab-trigger-*`, `.btn-playback*`, `.demo-*`, `.ppmycota-*`, the
  `[data-state=active][role=tabpanel]` slide) moves to its component's
  `<style scoped>`; `utils.css` retires to ONLY genuinely-global utilities
  (`.container-inline-size`, `.icon`, `.is-disabled`) or dissolves entirely
  into `style.css` if that residue is small enough to not warrant a file.
- Tailwind idiom restored: the arbitrary-value sites (`text-[0.65rem]`,
  `h-[30vh]`, `text-[var(--color-gold)]`, …) route to tokens / `@apply` /
  scoped CSS; the `!`-overrides (EasingSelect `!flex` + `![-webkit-line-clamp]`,
  AnimationControlsGroup `!border-transparent`) move to scoped CSS where the
  cascade does not need fighting.
- The φ-ladder leaf-tail terminated — the 89 `text-sm`/`text-xs`/`text-base`
  body/label sites migrate to the semantic ladder (`.text-body`/`.text-small`/
  `.text-admin-label`/`.text-caption`), closing the chronic A→B→C deferral.
- A `proof:idioms` instrument: a grep over the BUILT demo CSS proves zero
  referenced-but-undefined custom-prop / class / `@keyframes`; a sweep proves
  zero raw body rung survives; a sweep proves no component rule remains in
  `utils.css`. Each BITES.

**Why:** the design language is the product's face, and three styling debts
remain after C's headline close. The idiom rent (S1) is the only one that is a
genuine *defect* — a live coupling with no contract that fails silently on a
sibling's unrelated change; localizing it is both elegance (one owned source)
and correctness (the gate now bites). The monolith (S2) and the
arbitrary-value/`!` drift (S3) are anti-idioms the no-legacy mandate forbids —
global rules a component should own, and ad-hoc literals a token already
encodes. The leaf-tail (S4) is the chronic deferral P-invariant-28 forbids
punting a fourth time. All four are net-deletion or net-neutral: localizing
deletes the rent, uncaging deletes the global sprawl, tokenizing deletes the
literals, the ladder deletes the raw rungs. Isomorphic throughout — pixels
unchanged unless a change is highly befitting (and each such case is named).

## § Scope

### S1 — Localize the demo's design idioms into ONE owned layer — styling-findings §1 (the latent rent)

**WHAT:** create `demo/@/styles/design-idioms.css`, imported from `style.css`
immediately AFTER `@import "@mkbabb/glass-ui/styles"` (so the demo's
definitions are the authoritative copy, not the glass-ui incidental one), and
DEFINE the demo-owned idiom vocabulary:

- **The `--rainbow-*` six-colour family** the demo's two gradients reference —
  `--rainbow-red`, `--rainbow-orange`, `--rainbow-yellow`, `--rainbow-green`,
  `--rainbow-blue`, `--rainbow-violet` (the exact six stops used by the
  `#rainbow-gradient` SVG `<linearGradient>` at `AnimationControlsGroup.vue:185-190`
  and the `.progress-bar` CSS gradient at `KeyframesEditor.vue:478-484`). Define
  them in `design-idioms.css` `:root` as the demo's canonical playful spectrum.
  Fold the lone inline `hsl(180 80% 50%)` cyan stop (`KeyframesEditor.vue:481`)
  to a named `--rainbow-cyan` in the same family so the gradient reads off ONE
  palette, not five tokens + one literal.
- **`--color-gold`** — the Format-button sparkle accent
  (`AnimationControlsGroup.vue:82` `text-[var(--color-gold)]`,
  `AnimationControlsControls.vue:348` `color: var(--color-gold)`). Define it in
  `design-idioms.css` as the demo's gold accent (theme-aware via `light-dark()`
  or a `--gold` derivation if the demo wants dark-mode parity — a befitting
  pixel change, named).
- **`.scale-on-hover`** — the 13-site hover-lift affordance. Define it as the
  demo's interaction idiom (`transition: transform … ; &:hover { transform:
  scale(…) }`), binding to the demo's own duration/easing tokens. This is the
  single most-used demo idiom with zero local definition — the headline of the
  rent.
- **`@keyframes enter`** + the `[data-state=active][role=tabpanel]` consuming
  rule (currently `utils.css:127-132`) — the tab-panel slide-in. The `enter`
  keyframe resolves only through `tw-animate-css` today; define the demo's own
  `enter` keyframe (opacity + 0.5rem x-translate, the existing `--tw-enter-*`
  values) so the slide does not depend on the animate-css internal name. (The
  consuming rule itself moves to scope in S2 — AnimationControls owns the tab
  panel — but the keyframe is global and belongs in the idiom layer.)

**WHY:** the demo references these idioms everywhere and defines them NOWHERE
in its own tree — it rents them from `@mkbabb/glass-ui/styles` + `tw-animate-css`
by accident of the current pin (verified §State 1). That is the live latent
bug: a sibling tranche (glass-ui AT/AU) owns the `--rainbow-*` / `scale-on-hover`
vocabulary and is free to rename or drop it; the day it does, the demo's hover
affordances and rainbow gradients silently flatten with no error and no gate.
Localizing the demo-authored idioms into ONE colocated layer (`design-idioms.css`,
sitting beside `style.css`/`utils.css`) converts the accidental rent into a
deliberate, owned, single-sourced contract — elegance (one home) and
correctness (the `proof:idioms` gate now bites if any demo-referenced idiom is
undefined in the demo's OWN built CSS). The two `.rainbow-vivid`/`.rainbow-pastel`
play-button utilities stay glass-ui-owned by design — they are full 7-stop
gradient recipes glass-ui authored and the demo merely applies, not demo idioms
(inv-16: the demo consumes glass-ui's classes, does not re-author them).

### S2 — Uncage the `utils.css` monolith — styling-findings §2 (component rules trapped global)

**WHAT:** move every component-specific rule family out of the global
`utils.css` into its owning component's `<style scoped>` (or, for the
`.demo-*` standalone-layout rules shared by `simple`/`square`, the smallest
shared scope):

- **`.tab-trigger-*`** (`utils.css:7-45`, three variants + `data-state`
  selectors) → the tab-trigger component(s) that consume them
  (`AnimationControls.vue` / the scene tab triggers). They are styling a single
  component family; they belong scoped to it.
- **`.btn-playback*`** (`utils.css:47-81`) → the playback-button component
  (`PlaybackRibbon.vue` / `AnimationMenuBar.vue`) `<style scoped>`. Component-
  private button skin; not a global utility.
- **`.demo-container` / `.demo-box`** (`utils.css:83-108`) → the standalone
  demo layout. `.demo-box` is consumed cross-scene (square + simple + the C.W2
  SquareScene migration) — keep it in the smallest SHARED scope (a
  `demo/@/styles/` partial the standalone apps import, OR `style.css` if it is
  genuinely the canonical demo surface). Document the decision; do not leave it
  in the catch-all `utils.css`.
- **The `[data-state=active][role=tabpanel]` tab-panel slide** (`utils.css:127-132`)
  → `AnimationControls.vue` `<style scoped>` (the tab panel's owner). The
  `@keyframes enter` it references is global (lands in `design-idioms.css`, S1);
  the consuming selector is component-local.
- **`.ppmycota-*` branding** (`utils.css:134-152`) + `--ppmycota-primary`
  (`utils.css:3-5`) → the brand-mark components (`EditorHeader.vue` /
  `EditorShell.vue` / `CubeScene.vue` logo) `<style scoped>`, or a single
  `brand.css` partial if the mark recurs across standalone apps. The
  `--ppmycota-primary` token + the `text-[var(--ppmycota-primary)]` arbitrary
  value (App.vue:46) co-locate with the brand mark.

After the move, `utils.css` carries ONLY `.container-inline-size`, `.icon`,
`.is-disabled` (the genuine global utilities, `:110-125`). If that residue is
three rules, fold them into `style.css` `@layer` and DELETE `utils.css`
entirely (no file earning its keep for three utilities — KISS). Decide + record.

**WHY:** `utils.css` is a global monolith holding six component-specific rule
families that have no business in a cross-cutting sheet (verified §State 4) —
the anti-idiom of styling a component from a global file, the same class of
coupling C.W2 fixed for the EasingTarget `.glass-card` leak. Scoping each rule
to its component is encapsulation (the rule lives with the markup it styles),
KISS (no global namespace to reason about), and net-deletion of the global
surface. The Vue SFC `<style scoped>` is the idiomatic home; the only rules
that stay global are the genuinely cross-cutting three.

### S3 — Tailwind idiom: arbitrary values → tokens; `!`-overrides → scoped CSS — styling-findings §3

**WHAT:** two related cleanups of off-idiom Tailwind:

- **Arbitrary values → tokens / `@apply` / scoped CSS.** Route each ad-hoc
  bracket literal to its canonical home:
  - `text-[var(--color-gold)]` (`AnimationControlsGroup.vue:82`) → a
    `.text-gold` utility or scoped rule consuming the `--color-gold` token (S1).
  - `text-[0.65rem]` (`SpringTarget.vue:15`), `text-[0.6rem]`/`text-[0.65rem]`
    (`SpringSidebar.vue:55,68`) → the semantic ladder's smallest rung
    (`.text-caption` / `.text-admin-label`) — these ARE leaf-tail siblings
    (S4), folded together.
  - `h-[30vh]`/`w-[30vw]` (`CubeTarget.vue:31`), `h-[25vh]`
    (`KeyframesEditor.vue:105`), `h-[20vh]` (`CSSPasteDialog.vue:54`),
    `max-h-[60vh]`/`max-h-[60dvh]` (several) → named layout tokens
    (`--target-viewport-h`, `--panel-max-h`) or scoped rules where the viewport
    fraction is structural. The `dvh` variants stay `dvh` (mobile-correct).
  - `w-[17rem]`/`w-[12rem]` dock/header widths → `--dock-panel-width` tokens
    (they recur: App.vue, CubeScene, AnimationMenuBar, TopDock).
  - `text-[var(--ppmycota-primary)]` (App.vue:46) → co-locates with the brand
    token (S2).
  Keep arbitrary values ONLY where the value is genuinely one-off and
  structural (no token would be reused) — the goal is to delete the *recurring*
  literals, not to over-tokenize singletons.
- **`!`-overrides → scoped CSS.** The `!important` Tailwind escapes fight the
  cascade from the wrong layer:
  - EasingSelect `!flex` + `![-webkit-line-clamp:unset]`
    (`EasingSelect.vue:8`) → a scoped rule on the select trigger (override the
    glass-ui base in `<style scoped>` where specificity is honest, not `!`).
  - AnimationControlsGroup `!border-transparent`
    (`AnimationControlsGroup.vue:87`, the rainbow-vivid Format button) → scoped
    `border-color: transparent` on that button state.
  - The `![-webkit-line-clamp]` at `KeyframesEditor.vue:40` and the
    `line-clamp` dock-label sites (`TopDock.vue:146,172`) → scoped rules.

**WHY:** arbitrary values and `!`-overrides are Tailwind's escape hatches, and
the recurring ones (verified: `w-[17rem]`×2, `w-[12rem]`×3, `text-[var(--color-gold)]`,
the sub-rem `text-[…]` cluster) are an undocumented parallel scale fighting the
token system — exactly the φ-ladder fork problem at the utility tier. Routing
each to a token (recurring) or a scoped rule (cascade override) restores the
idiom: Tailwind utilities for the common case, scoped CSS for the genuine
override, tokens for the shared constants. Net-deletion of the bracket-literal
sprawl; the `!`-escapes vanish because scoped specificity does the job honestly.

### S4 — Terminate the φ-ladder leaf-tail — styling-findings §4 (the chronic A→B→C)

**WHAT:** migrate the 89 `text-sm`/`text-xs`/`text-base` body/label sites onto
the semantic glass-ui ladder, per the C.W2 BOOKED mapping:
- `text-base` → `.text-body`
- `text-sm` → `.text-small`
- `text-xs` muted control labels → `.text-admin-label` (or `.text-mono-caption`
  for monospace control readouts)
- italic captions → `.text-caption`

Across the BOOKED sites (`EasingSidebar.vue`, `SpringSidebar.vue`,
`EasingSelect.vue`, `KeyframeTimeline.vue`, the dialog/drawer titles) and the
sub-rem `text-[…]` arbitrary values folded from S3. The display/heading tier
already migrated in C.W2 — this is the LEAF tier only, completing the ladder.

**WHY:** this is the chronic deferral — A booked it, B re-deferred it while
marking its wave done, C shipped the headline and BOOKED the leaf-tail to its
mechanical follow-on with D as the named owner (C.md §deferred-ledger F6 KFD).
P-invariant-28 forbids a fourth punt. The leaf tier sitting on raw Tailwind
rungs while the headline rides the √φ ladder is the same incommensurate-scale
fork C.W2 closed at the top — finishing it at the bottom makes the demo speak
ONE type language end to end. Pure adoption of already-imported glass-ui
utilities; net-deletion of the raw rungs.

### S5 — The `proof:idioms` instrument — styling-findings §5 (the falsifiable close)

**WHAT:** a checked-in, re-runnable instrument (`scripts/proof-idioms.mjs`,
wired `npm run proof:idioms`) that BITES on three clauses, run against the BUILT
demo CSS (so it tests resolution, not source intent):

1. **Zero referenced-but-undefined idiom in the built demo CSS.** Build the
   demo; extract every `var(--rainbow-*)` / `var(--color-gold)` /
   `.scale-on-hover` / `animation: enter` reference and assert each resolves to
   a definition PRESENT IN THE DEMO'S OWN BUILT OUTPUT (`design-idioms.css`'s
   contribution), not only via the glass-ui dependency. Falsifiable: stub out
   `design-idioms.css` and the assertion reds — proving the demo owns the
   contract, not the rent. This is the latent-bug closure, made bite.
2. **Zero raw body rung in the swept set.** `grep -rno
   "\\btext-sm\\b|\\btext-xs\\b|\\btext-base\\b" demo/ --include="*.vue"`
   (excluding `dist/`) = 0. The leaf-tail sweep, complete.
3. **No component rule remains in `utils.css`.** `grep -E
   "\\.tab-trigger|\\.btn-playback|\\.demo-|\\.ppmycota|tabpanel" demo/@/styles/utils.css`
   = 0 (or `utils.css` is deleted). The monolith, uncaged.

The instrument runs in CI's demo job alongside the existing `proof:dogfood` /
occlusion / lighthouse gates.

**WHY:** the close-honesty discipline (inv ε) demands every MET gate be a
re-runnable instrument shown to PASS, not a narration — and the headline of
this wave (the latent idiom rent) is exactly the kind of claim that looks done
and is not unless a gate proves resolution. Building the demo CSS and asserting
the demo's OWN output defines its idioms (clause 1) is the only falsifiable
form of "the latent bug closes" — it bites if `design-idioms.css` is absent OR
if a demo-referenced idiom has no demo-local definition. Clauses 2-3 make the
leaf-tail termination and the monolith uncaging falsifiable the same way C.W2's
consumption sweep made the display-tier migration falsifiable.

## § Hard gate

The wave closes when every clause VERIFIES (each BITES — a real build+grep or
render check, not an assertion):

1. **`design-idioms.css` exists and is the demo's authoritative idiom source.**
   `npm run proof:idioms` clause 1 PASSES: every demo-referenced
   `--rainbow-*` / `--color-gold` / `.scale-on-hover` / `@keyframes enter`
   resolves to a definition in the demo's OWN built CSS. BITES: stubbing
   `design-idioms.css` reds it (the rent is closed, falsifiably) — today these
   resolve only through the glass-ui/`tw-animate-css` transitive import with
   zero demo-local definition.
2. **The leaf-tail sweep = 0.** `proof:idioms` clause 2: zero
   `text-sm`/`text-xs`/`text-base` body rung survives the swept set. BITES:
   89 word-boundary sites live today; the chronic A→B→C deferral closes.
3. **No component rule remains in `utils.css`.** `proof:idioms` clause 3: zero
   `.tab-trigger-*` / `.btn-playback*` / `.demo-*` / `.ppmycota-*` /
   `[data-state=active][role=tabpanel]` rule in `utils.css` (or the file is
   deleted). BITES: six families live there today.
4. **No arbitrary-value / `!`-override regression in the swept components.**
   `EasingSelect.vue` carries no `!flex` / `![-webkit-line-clamp]`;
   `AnimationControlsGroup.vue` carries no `text-[var(--color-gold)]` /
   `!border-transparent`; the recurring `w-[17rem]`/`w-[12rem]`/sub-rem
   `text-[…]` literals route to tokens or scoped CSS. BITES: each is a verified
   live off-idiom literal today.
5. **Isomorphic — pixels unchanged unless named.** The AFTER capture (the C
   harness, `scripts/capture.mjs`) shows the migrated surfaces visually
   equivalent to before, EXCEPT the named befitting deltas (the `--color-gold`
   dark-mode parity, the leaf-tail line-height inheriting the ladder's correct
   register — each enumerated in `audit/styling-findings.md` §Isomorphism). The
   occlusion + lighthouse + dogfood gates stay green (no layout/a11y/motion
   regression from the scoping moves).
6. **No new alias / workaround / legacy introduced.** The migration is
   localization (idioms the demo already uses, now owned), uncaging (rules moved
   to their components), tokenization (literals → tokens), and adoption
   (already-imported glass-ui ladder utilities) — net-deletion or net-neutral
   throughout. The `.rainbow-vivid`/`.rainbow-pastel` play-button utilities stay
   glass-ui-owned (inv-16); no glass-ui token is patched in the demo.

## § Folds

Retires (by finding id / ledger item):
- **styling-findings §1** (the latent idiom rent — `--rainbow-*` / `--color-gold` /
  `.scale-on-hover` / `@keyframes enter` referenced demo-wide, defined demo-nowhere)
  — S1 + S5.1.
- **styling-findings §2** (the `utils.css` component-rule monolith) — S2 + S5.3.
- **styling-findings §3** (Tailwind arbitrary-value + `!`-override drift) — S3.
- **styling-findings §4** + **typography-ladder F6** (the φ-ladder leaf-tail,
  the chronic A→B→C; C.md §deferred-ledger KFD) — S4 + S5.2. This is the SHIP
  that forbids the fourth punt (P-invariant-28).
- **color-token F4** (the C-era `--rainbow-cyan` gap, RECORDED-not-this-wave by
  C) — RESOLVED at source (the gap is already closed, §State 2); the inline
  cyan stop folds into the localized `--rainbow-*` family (S1). No outward ask.
- **component-idiom F1** (`KeyboardShortcutsModal.vue` redundant
  `backdrop-blur-sm`, C recorded-beside) — folded into S3's scoped-CSS sweep
  (delete the class; `DialogContent`'s `glass-floating` owns the blur).

**Routed OUTWARD / RECORDED (not this wave):**
- **The `.rainbow-vivid`/`.rainbow-pastel` 7-stop play-button utilities** — stay
  glass-ui-owned (inv-16). The demo APPLIES them; D does not re-author them in
  `design-idioms.css`. If glass-ui ever drops them, that is a glass-ui ASK, not
  a demo patch.
- **color-token F5** (cube/square ANIMATED palettes) — permanent RECORD (C):
  the subject matter, not chrome; no tokenization. D does not re-open.

## § Design decisions

1. **Localize the demo's idioms — do NOT re-author glass-ui's.** RESOLVED: the
   `--rainbow-*` six-colour family + `--color-gold` + `.scale-on-hover` +
   `@keyframes enter` are demo-AUTHORED idioms (the demo's own gradients, hover
   lifts, tab slide) — they belong in the demo's own tree (`design-idioms.css`),
   single-sourced and gated. The `.rainbow-vivid`/`.rainbow-pastel` utilities are
   glass-ui RECIPES the demo applies — they stay glass-ui-owned (inv-16: never
   re-author a vendor utility in the consumer). Trade-off: defining
   `--rainbow-*` locally means the demo's palette and glass-ui's `--rainbow-*`
   token are two definitions of the same name — acceptable and CORRECT, because
   the demo's copy (imported AFTER the glass-ui cascade) is the authoritative
   one for the demo and the gate proves it resolves from the demo's output, so
   the demo no longer depends on glass-ui keeping the token. This is the whole
   point: own the contract.

2. **The latent bug "closes" by ownership, not by making it resolve — it
   already resolves.** RESOLVED + HONEST (inv ε): the idioms paint correctly
   today through the transitive glass-ui/`tw-animate-css` import (verified
   §State 1). The defect is not a blank render — it is an UNGATED, undocumented
   cross-repo coupling that fails silently on a sibling's unrelated change. The
   wave closes it by making the demo OWN + GATE the contract (S1 + S5.1), and
   the gate is falsifiable precisely because it tests the demo's own built
   output, not the merged cascade. The FINAL must state this plainly — not claim
   "the demo was broken and is now fixed" (it was not visibly broken), but "the
   demo rented its identity ungated and now owns it gated."

3. **Uncage to `<style scoped>`, delete `utils.css` if the residue is trivial.**
   RESOLVED: the SFC `<style scoped>` is the idiomatic home for a
   component-specific rule (encapsulation + KISS). After the six families move,
   `utils.css` holds three genuine utilities — fold them into `style.css`
   `@layer` and DELETE the file rather than keep a 3-rule sheet (the no-legacy
   mandate disfavors a file that no longer earns its name). `.demo-box` (shared
   cross-scene) is the one judgment call — the smallest SHARED scope, documented.

4. **Tokenize the RECURRING literals; keep genuine singletons.** RESOLVED:
   `w-[17rem]`/`w-[12rem]` (5 sites), `text-[var(--color-gold)]`, the sub-rem
   `text-[…]` cluster RECUR and become tokens / ladder rungs; a one-off
   structural `h-[20vh]` with no reuse stays arbitrary (over-tokenizing a
   singleton is its own anti-idiom). The `!`-overrides ALWAYS move to scoped CSS
   — an `!important` in a utility is fighting the cascade from the wrong place;
   scoped specificity is the honest fix. Trade-off: a handful of scoped rules
   replace a handful of `!` escapes — net-neutral line count, net-positive
   idiom.

5. **The leaf-tail ships as ONE sweep, gated by `proof:idioms`.** RESOLVED: the
   89 sites migrate together (the BOOKED follow-on, D the named owner) and the
   sweep (S5.2) bites on the complete leaf surface — no half-migrated state
   ships. Trade-off: per-element semantic mapping (no codemod — `text-sm` on a
   body paragraph is `.text-body`'s sibling `.text-small`, but `text-sm` on a
   muted control label is `.text-admin-label`; the correct register is semantic,
   not size-mechanical), the same cost C.W2 accepted for the display tier. The
   sub-rem `text-[…]` arbitrary values fold in here (they are leaf rungs wearing
   a bracket).
