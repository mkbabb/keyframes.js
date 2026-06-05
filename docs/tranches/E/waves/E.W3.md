# E.W3 — Styling localization round 2 (isomorphic)

The styling-lane wave, round 2. D.W2 localized the demo's design vocabulary into
ONE owned layer (`demo/@/styles/design-idioms.css` — the `--rainbow-*` family,
`--color-gold`, `.scale-on-hover`, `@keyframes enter`), uncaged the `utils.css`
monolith, and terminated the φ-ladder leaf-tail (gated by `proof:idioms`,
`audit/deferred-ledger.md` CL-8 — the chronic A→B→C→D item ENDED in D). The
post-D assay found the styling debt D.W2's headline close left as residue: ONE
ungated idiom rent D.W2 did not catch (`.gold-shimmer` — a hover-shimmer CLASS
utility used ×3 in demo source, defined ONLY in glass-ui, the inv-η analogue at
the UTILITY tier that D.W2's `var(--token)`-shaped clause 1 did not sweep), a
handful of recurring arbitrary-value literals that earn tokens, an
inconsistency between `--panel-max-h: 60vh` and the `60dvh` variants used
elsewhere, and a `.progress-bar { @apply h-2 rounded-md }` rule duplicated in
two components. E.W3 closes the `.gold-shimmer` rent demo-locally, tokenizes the
named recurring literals, reconciles `--panel-max-h` to `dvh`, and dedups the
`.progress-bar` rule. **Pixels unchanged.** Grounds: `audit/prompt-recap.md` E4
(the exact site list) + the live greps below + the existing `design-idioms.css`
(which E.W3 EXTENDS, not re-authors).

This is NET-NEW residual, not folded debt. The deferred ledger is CLEAN — D
terminated every keyframes-owned deferral (zero KFE; the φ-ladder leaf-tail
ENDED in D, `audit/deferred-ledger.md` CL-8). E.W3's items are post-D findings
the assay surfaced. The FINAL must state this honestly: D.W2 owned the rented
`var()`-idioms; E.W3 owns the one rented UTILITY-class idiom D.W2's clause shape
missed, plus the literal/reconcile/dedup residue.

## § The state, verified (not asserted)

The live facts — `grep` against demo source (excluding `dist/`) + the pinned
glass-ui dist, read-confirmed:

1. **`.gold-shimmer` is the inv-η rent at the UTILITY tier.** It is referenced
   at THREE demo sites — `AnimationControlsControls.vue:69`
   (`isDetailEasing ? 'gold-shimmer' : ''` on the "easing" label),
   `EasingSelect.vue:23` (`isDetailCurve ? 'gold-shimmer' : ''`) and
   `EasingSelect.vue:59` (`item.isDetail ? 'gold-shimmer' : ''`) — and DEFINED
   nowhere in the demo's own tree: `grep -rn "gold-shimmer" demo/@/styles/` =
   EMPTY. It resolves ONLY through the transitive `@mkbabb/glass-ui` import
   (defined in `node_modules/@mkbabb/glass-ui/dist/styles/{theme,animations,
   utilities}.css`). This is the EXACT rent D.W2 closed for `--rainbow-*` /
   `.scale-on-hover` (inv η — an idiom referenced demo-wide, owned demo-nowhere,
   silently flattening the day glass-ui renames or drops it) — but D.W2's
   `proof:idioms` clause 1 derives its referenced set from `var(--token)` /
   `.scale-on-hover` / `@keyframes enter` shapes (`proof-idioms.mjs:99-118`) and
   `.gold-shimmer` is a CLASS utility matching NONE of those patterns, so the
   D.W2 clause never swept it. It is the one rent that slipped — the headline of
   E.W3.

2. **The recurring arbitrary-value literals.** `grep` over demo `.vue`
   (excluding `dist/`):
   - **`min-w-[12rem]` ×3** — `AnimationMenuBar.vue:42`, `TopDock.vue:150`,
     `TopDock.vue:177` (the dropdown `SelectContent` min-widths). Three identical
     literals = a recurring constant earning a token (`--dropdown-min-width`).
   - **`w-[30vw]` ×1** — `CubeTarget.vue:31`
     (`h-[var(--target-viewport-h)] w-[30vw] animate-spin`). The HEIGHT already
     reads `--target-viewport-h` (D.W2.S3 tokenized it), but the WIDTH is still a
     literal `30vw`. The comment in `design-idioms.css:81` claims
     `--target-viewport-h` covers "h-[30vh] / w-[30vw]" — dimensionally wrong (a
     vh token cannot name a vw width). E.W3 adds the matching
     `--target-viewport-w: 30vw` and corrects the comment.
   - **`w-[calc(100%-3rem)]` ×1** — `AnimationVisualizer.vue:10`, paired with
     `left-6` (1.5rem) on the same element: the track is inset 1.5rem each side
     = a 3rem total horizontal gutter. The `3rem` is a MAGIC literal coupling the
     width-calc to the `left-6` inset — `--visualizer-track-gutter: 3rem` names
     the coupling so the two stay in sync.
   - **`max-h-[min(24rem,60dvh)]` ×1** — `EasingSelect.vue:29` (the easing
     dropdown's `SelectContent` cap). A compound literal (`min(24rem, 60dvh)`)
     earning `--easing-dropdown-max-h`.

3. **`--panel-max-h: 60vh` vs the `60dvh` variants — a unit inconsistency.**
   `--panel-max-h: 60vh` is defined in `design-idioms.css:79` and consumed by
   `KeyboardShortcutsModal.vue:10` (`max-h-[var(--panel-max-h)]`) +
   `AnimationControlsGroup.vue:68` (`max-h-[var(--panel-max-h)]`). But the SAME
   "panel cap" intent is expressed as `60dvh` elsewhere:
   `ResponsiveSelect.vue:58` (`max-h-[60dvh]`) and the `60dvh` inside
   `EasingSelect.vue:29`'s `min(24rem, 60dvh)`. So the demo caps panels at
   `60vh` in two places and `60dvh` in two others — the SAME visual intent, two
   units. On mobile (where the URL bar collapses), `dvh` is the correct,
   layout-stable choice; `vh` over-reserves. The reconcile: `--panel-max-h: 60dvh`
   (the mobile-correct unit), unifying all four sites onto one token + one unit.
   The `design-idioms.css:79` comment ("the dvh variants stay dvh") explicitly
   acknowledged the split — E.W3 closes it.

4. **`.progress-bar { @apply h-2 rounded-md }` is duplicated.** Defined in TWO
   `<style scoped>` blocks: `KeyframesEditor.vue:250-262` and
   `KeyframesAddDialog.vue:161-168` — both carry the IDENTICAL
   `.progress-bar { @apply h-2 rounded-md; background: linear-gradient(…
   var(--rainbow-*) …); }` rule (the rainbow brush-sweep gradient, already on the
   D.W2 `--rainbow-cyan` token at `:257`/`:168`). Two scoped copies of one rule:
   the `@apply h-2 rounded-md` sizing + the gradient are duplicated verbatim. The
   gradient is the demo's brush-sweep idiom (it reads off the owned `--rainbow-*`
   family) — a candidate for ONE shared definition.

5. **`design-idioms.css` already exists + is the extension point.** D.W2 landed
   it (146L); it already defines `--panel-max-h`, `--dock-panel-width`,
   `--target-viewport-h`, the `--rainbow-*` family, `--color-gold`,
   `.scale-on-hover`, `.text-gold`, `@keyframes enter`. E.W3 EXTENDS this file
   (adds `.gold-shimmer`, the new tokens, the reconciled `--panel-max-h`), it
   does NOT create a parallel layer. The file is imported AFTER the glass-ui
   cascade (`style.css`), so a demo-local `.gold-shimmer` is authoritative — the
   same ownership mechanism D.W2 used for `.scale-on-hover`.

The wave's job is to close the ONE idiom rent D.W2's clause shape missed, name
the recurring literals, unify the panel-cap unit, and dedup the one duplicated
rule — each isomorphic (pixels unchanged; the `dvh` reconcile is the one named
befitting delta, and it only AFFECTS the over-reserving `vh` case on mobile,
toward correctness).

## § Goal

**What lands:**
- **`.gold-shimmer` defined demo-locally** in `design-idioms.css` — the
  hover-shimmer utility the demo references ×3, owned in the demo's own tree
  (the values matching glass-ui's so the localization is isomorphic), closing
  the inv-η rent at the utility tier. `proof:idioms` clause 1 EXTENDED to include
  `.gold-shimmer` in its referenced-idiom sweep (it is a class utility; the
  clause's class-shape branch — already used for `.scale-on-hover` — covers it).
- **The recurring literals tokenized** in `design-idioms.css`:
  `--dropdown-min-width` (for `min-w-[12rem]` ×3), `--target-viewport-w: 30vw`
  (for `w-[30vw]`, correcting the `--target-viewport-h` comment),
  `--visualizer-track-gutter: 3rem` (for the `w-[calc(100%-3rem)]` + `left-6`
  coupling), `--easing-dropdown-max-h: min(24rem, 60dvh)` (for the EasingSelect
  cap). Each call site routes to the token; the literals vanish.
- **`--panel-max-h` reconciled to `60dvh`** — one token, one mobile-correct
  unit, consumed by all four panel-cap sites (KeyboardShortcutsModal,
  AnimationControlsGroup, ResponsiveSelect, EasingSelect's `dvh` half), closing
  the `vh`/`dvh` inconsistency the `design-idioms.css:79` comment named.
- **The `.progress-bar` rule deduped** — the `@apply h-2 rounded-md` + the
  rainbow brush-sweep gradient defined ONCE (a shared `.progress-bar` in
  `design-idioms.css` or a single shared partial both components consume), the
  two `<style scoped>` copies (`KeyframesEditor.vue:250`,
  `KeyframesAddDialog.vue:161`) collapsing to one.
- `proof:idioms` EXTENDED: clause 1 sweeps `.gold-shimmer`; a clause asserts the
  named recurring literals are tokenized (zero `min-w-[12rem]` / `w-[30vw]` /
  the magic-3rem / the easing cap in source); the `.progress-bar` rule has ONE
  definition. Each BITES. Pixels unchanged (the capture AFTER ≈ BEFORE, the one
  named `dvh` delta excepted).

**Why:** the design language is the product's face, and four styling residues
remain after D.W2's headline close. The `.gold-shimmer` rent (S1) is the only
genuine DEFECT — a live ungated coupling that flattens silently on a glass-ui
rename, the EXACT inv-η bug D.W2 fixed for `var()`-idioms but missed at the
class-utility tier (its clause derived references from `var()` shapes). Closing
it demo-locally is both elegance (one owned source) and correctness (the
extended gate now bites). The literals (S2) are an undocumented parallel scale —
recurring constants typed by hand, the same anti-idiom D.W2's S3 tokenized;
naming them deletes the sprawl. The `vh`/`dvh` split (S3) is a correctness
inconsistency the comment already flagged; unifying on `dvh` is mobile-correct
+ single-sourced. The dedup (S4) is net-deletion of a duplicated rule. All four
are net-deletion or net-neutral, isomorphic throughout — pixels unchanged except
the one named `dvh` delta (which only improves the over-reserving mobile case).
The no-legacy mandate forbids leaving an ungated rent or a duplicated rule; KISS
favors one token over three literals.

## § Scope

### S1 — Define `.gold-shimmer` demo-locally (close the inv-η rent) — prompt-recap E4

**WHAT:** add `.gold-shimmer` to `design-idioms.css` (the existing owned idiom
layer, beside `.scale-on-hover`), DEFINING the shimmer utility the demo
references ×3 (`AnimationControlsControls.vue:69`, `EasingSelect.vue:23,59`).
glass-ui's current `.gold-shimmer` (`dist/styles/utilities.css`) is a
`background: linear-gradient(90deg, var(--color-gold-dark),
var(--color-gold-light), var(--color-gold), var(--color-gold-light),
var(--color-gold-dark))` with `background-size: 250% 100%` +
`background-clip: text` + `-webkit-background-clip: text`, animated (motion-safe)
by `animation: gold-shimmer-slide var(--duration-shimmer) linear infinite`.
Author the demo's OWN copy with the SAME computed result (isomorphic): the
gradient binds to the demo's owned `--color-gold` token (D.W2 landed it,
`design-idioms.css:66`) plus demo-owned `--color-gold-dark`/`--color-gold-light`
derivations (named in the idiom layer so the demo owns the full gold ramp, not
just the mid-stop), and the `gold-shimmer-slide` keyframe is defined
demo-locally (the same `@keyframes enter` precedent D.W2 set) inside its
`prefers-reduced-motion`-respecting block. The three call sites are UNCHANGED
(`class="… gold-shimmer"`); only the resolution moves from the glass-ui rent to
the demo's owned layer.

**WHY:** `.gold-shimmer` is the inv-η rent D.W2's clause shape missed (verified
§State 1) — referenced demo-wide, owned demo-nowhere, resolving only by accident
of the glass-ui pin. The day glass-ui's AT/AU arm renames or drops it, the demo's
three detail-curve shimmer affordances silently flatten with no error and no
gate — the identical latent bug D.W2 closed for `.scale-on-hover`. Localizing it
into the EXISTING `design-idioms.css` converts the accidental rent into a
deliberate, owned, single-sourced, gate-able contract (the extended `proof:idioms`
clause 1 now bites if it is undefined demo-locally). Isomorphic: the demo's copy
matches glass-ui's computed values, so the shimmer paints identically — the bug
"closes" by OWNERSHIP, not by a visible repaint (the D.W2 §DD2 honesty: the demo
rented this ungated and now owns it gated, it was not visibly broken).

### S2 — Tokenize the recurring arbitrary-value literals — prompt-recap E4

**WHAT:** add four tokens to `design-idioms.css` and route each call site:
- **`--dropdown-min-width: 12rem`** ← the `min-w-[12rem]` ×3
  (`AnimationMenuBar.vue:42`, `TopDock.vue:150,177`). Each `SelectContent` reads
  `min-w-[var(--dropdown-min-width)]`. (Note: `--dock-panel-width: 17rem` already
  exists for the WIDER dock/header panel — `--dropdown-min-width` is the
  narrower dropdown min, a distinct constant.)
- **`--target-viewport-w: 30vw`** ← the `w-[30vw]` at `CubeTarget.vue:31`. The
  call site reads `w-[var(--target-viewport-w)]`; the existing
  `design-idioms.css:81` comment (which wrongly claimed `--target-viewport-h`
  covers the width) is corrected to name BOTH the `-h` and the new `-w`.
- **`--visualizer-track-gutter: 3rem`** ← the magic `3rem` in
  `AnimationVisualizer.vue:10`'s `w-[calc(100%-3rem)]`, coupled to `left-6`
  (1.5rem each side). The call site reads
  `w-[calc(100%-var(--visualizer-track-gutter))]`, and the comment names the
  `left-6`↔gutter coupling so a future inset change updates ONE token.
- **`--easing-dropdown-max-h: min(24rem, 60dvh)`** ← the `max-h-[min(24rem,60dvh)]`
  at `EasingSelect.vue:29`. The call site reads
  `max-h-[var(--easing-dropdown-max-h)]`. (Its `60dvh` half participates in the
  S3 `dvh` unification — the token's `dvh` is the reconciled unit.)

Keep arbitrary values ONLY where genuinely one-off + structural (D.W2 §DD4 — no
over-tokenizing a singleton). These four RECUR or encode a coupling (the gutter,
the ×3 min-width), so they earn tokens; a one-off structural literal with no
reuse stays bracket.

**WHY:** recurring bracket literals are an undocumented parallel scale fighting
the token system (verified §State 2) — the same anti-idiom D.W2's S3 tokenized
at the typography/width tier. `min-w-[12rem]` typed three times is one constant
spelled three times (drift risk); the `w-[calc(100%-3rem)]` magic `3rem`
silently couples to `left-6` (change one, break the centering). Naming each is
net-deletion of the literal sprawl + a coupling made explicit. The
`--target-viewport-w` addition also FIXES the dimensionally-wrong D.W2 comment
(a vh token cannot name a vw width) — honest tokenization.

### S3 — Reconcile `--panel-max-h` to `dvh` — prompt-recap E4

**WHAT:** change `--panel-max-h: 60vh` → `--panel-max-h: 60dvh` in
`design-idioms.css:79`, and route the two `60dvh` literal sites onto the token so
ALL four panel-cap sites read ONE token with ONE unit:
- `KeyboardShortcutsModal.vue:10` + `AnimationControlsGroup.vue:68` already read
  `max-h-[var(--panel-max-h)]` — they inherit the `dvh` unit automatically.
- `ResponsiveSelect.vue:58` (`max-h-[60dvh]`) → `max-h-[var(--panel-max-h)]`.
- `EasingSelect.vue:29`'s `60dvh` half is subsumed by `--easing-dropdown-max-h`
  (S2), whose `dvh` is the reconciled unit (`min(24rem, var(--panel-max-h))`
  if the cap should share the panel token, OR an independent
  `min(24rem, 60dvh)` — §Design-Decision 3 records whether the easing cap shares
  `--panel-max-h` or stays independent; both land on `dvh`).
Update the `design-idioms.css:79` comment (which currently says "the dvh
variants stay dvh") to record the reconcile: all panel caps are now `dvh`.

**WHY:** the demo caps panels at `60vh` in two places and `60dvh` in two others
for the SAME visual intent (verified §State 3) — a unit inconsistency the
`design-idioms.css:79` comment itself acknowledged. On mobile, `vh` includes the
collapsible URL-bar region, so a `60vh` cap over-reserves and can push content
under the dock band; `dvh` tracks the dynamic viewport and is layout-stable —
the mobile-correct unit (consistent with the `dvh` the work-area chain already
uses, D.W3 §State 6). Unifying on `dvh` is single-sourced (one token) +
correct (one unit). This is the wave's ONE named befitting pixel delta: on
desktop `60vh` ≈ `60dvh` (no URL bar to collapse, isomorphic); on mobile the
`dvh` cap is SLIGHTLY shorter when the URL bar is expanded — a correctness
improvement (less over-reservation), named in §Isomorphism.

### S4 — Dedup the `.progress-bar` rule — prompt-recap E4

**WHAT:** the `.progress-bar { @apply h-2 rounded-md; background: linear-gradient(…
var(--rainbow-*) …); }` rule is duplicated verbatim in `KeyframesEditor.vue:250-262`
and `KeyframesAddDialog.vue:161-168`. Define it ONCE — the brush-sweep gradient
is the demo's owned `--rainbow-*` idiom (it already reads the owned family +
`--rainbow-cyan`), so the canonical home is `design-idioms.css` (beside the
rainbow family it consumes): a single `.progress-bar` rule. Both components
DELETE their scoped copy (the class is applied in their templates already —
`KeyframesEditor.vue:76`, `KeyframesAddDialog.vue:46`); the shared definition
resolves through the demo's owned layer. (If a component needs a local override,
it keeps only the DELTA scoped, not the whole rule.)

**WHY:** two `<style scoped>` blocks carry one identical rule (verified §State 4)
— a duplication that drifts the day one copy's gradient stops change. The rule
is a demo idiom (the rainbow brush-sweep, reading the owned `--rainbow-*`
family), so it belongs in the owned idiom layer, single-sourced — net-deletion
of the duplicate + the drift class, the same dedup principle D.W1 applied to the
parse adapter. KISS: one definition, both consumers apply the class.

### S5 — The `proof:idioms` extension (the falsifiable close) — prompt-recap E4

**WHAT:** EXTEND `scripts/proof-idioms.mjs`:
- **Clause 1 sweeps `.gold-shimmer`.** Add `.gold-shimmer` to the referenced-
  idiom derivation (the class-shape branch the clause already uses for
  `.scale-on-hover`, `proof-idioms.mjs:105,116,145`): grep demo source for the
  `gold-shimmer` class reference, then assert `design-idioms.css` carries a
  `.gold-shimmer` definition. BITES: `.gold-shimmer` is referenced ×3 with zero
  demo-local definition today → reds until S1 lands. (Falsifiable: stub the
  `.gold-shimmer` rule from `design-idioms.css` → the gate reds, proving the
  demo OWNS the contract.)
- **A tokenization clause.** Assert zero `min-w-[12rem]` / `w-[30vw]` /
  `w-[calc(100%-3rem)]` (the magic-3rem form) / `max-h-[min(24rem,60dvh)]` in
  demo source (each routed to its token). BITES: each literal lives today.
- **A `.progress-bar` single-definition clause.** Assert exactly ONE
  `.progress-bar` rule DEFINITION across demo source (the shared layer), zero in
  the two former `<style scoped>` homes. BITES: two copies live today.
- **A `--panel-max-h` unit clause** (optional, recorded): assert
  `--panel-max-h` is defined as `dvh` (not `vh`) — the reconcile is gate-locked.

The instrument runs in CI's demo job alongside the existing `proof:idioms`
clauses.

**WHY:** the close is only honest if a gate BITES on the rent's/literal's return
(inv ε, `audit/deferred-ledger.md` CL-6). The D.W2 `proof:idioms` clause 1 is
exactly the right instrument — it derives the referenced idiom set live and
asserts demo-local resolution — but its derivation missed `.gold-shimmer` (a
class, not a `var()`); EXTENDING the class-shape branch to include it makes the
utility-tier rent falsifiable the same way the `var()`-tier rent already is. The
tokenization + dedup clauses make S2/S4 falsifiable the same way D.W2's leaf-tail
sweep made the typography migration falsifiable. Each reds on the exact residue
this wave removes.

## § Hard gate — `proof:idioms` (extended · inv λ)

The wave closes when every clause VERIFIES (each BITES — a real build+grep,
not an assertion):

1. **`.gold-shimmer` is demo-owned.** `npm run proof:idioms` clause 1 (extended)
   PASSES: the `.gold-shimmer` reference (×3) resolves to a definition in
   `design-idioms.css`. BITES: stubbing the rule reds it (the rent is closed,
   falsifiably) — today `.gold-shimmer` resolves only through the glass-ui
   transitive import with zero demo-local definition.
2. **The named literals are tokenized.** Zero `min-w-[12rem]` / `w-[30vw]` /
   `w-[calc(100%-3rem)]` / `max-h-[min(24rem,60dvh)]` in demo source; each call
   site reads `var(--dropdown-min-width)` / `var(--target-viewport-w)` /
   `calc(100% - var(--visualizer-track-gutter))` / `var(--easing-dropdown-max-h)`.
   BITES: each literal is a verified live site today.
3. **`--panel-max-h` is reconciled to `dvh`.** `--panel-max-h` is defined as
   `60dvh` in `design-idioms.css`; the four panel-cap sites read one token, one
   unit (no stray `max-h-[60vh]` / `max-h-[60dvh]` literal for the panel-cap
   intent). BITES: the `60vh` token + the two `60dvh` literals split today.
4. **`.progress-bar` has ONE definition.** Exactly one `.progress-bar` rule in
   demo source (the shared layer); zero in `KeyframesEditor.vue`/
   `KeyframesAddDialog.vue` `<style scoped>`. BITES: two copies today.
5. **Isomorphic — pixels unchanged unless named.** The AFTER capture
   (`scripts/capture.mjs`) shows the migrated surfaces visually equivalent to
   before, EXCEPT the ONE named befitting delta: the `--panel-max-h` `vh→dvh`
   reconcile (desktop isomorphic; mobile slightly-shorter cap when the URL bar
   is expanded — a correctness improvement, enumerated in
   `styling-findings §Isomorphism`). The `.gold-shimmer` localization is
   pixel-identical (same computed values, demo-local source); the tokenization +
   dedup are pixel-identical (same computed values). The occlusion + lighthouse
   gates stay green.
6. **No new rent, no new legacy.** The migration is localization (the one rented
   utility idiom, now owned), tokenization (literals → tokens), reconcile
   (one unit), and dedup (one definition) — net-deletion or net-neutral
   throughout. No glass-ui token is patched in the demo (inv-16 — the demo OWNS
   its `.gold-shimmer` copy, it does not re-author glass-ui's); the
   `.rainbow-vivid`/`.rainbow-pastel` play-button recipes stay glass-ui-owned
   (D.W2 §Folds).

Every clause is a build+grep/capture instrument that reds on its negative case.

## § Folds

Retires (by finding id):
- **prompt-recap E4** (styling r2: the `.gold-shimmer` ungated rent; the
  recurring arbitrary-value literals; the `--panel-max-h` `vh`/`dvh`
  inconsistency; the `.progress-bar` dup) — S1 (gold-shimmer) + S2 (tokens) +
  S3 (reconcile) + S4 (dedup) + S5 (the gate).
- The `.gold-shimmer` inv-η rent — the one idiom D.W2's `var()`-shaped
  `proof:idioms` clause 1 missed (it is a class utility) — closed here by
  EXTENDING the clause's class-shape branch (the `.scale-on-hover` precedent).

This wave folds NO chronic deferral — zero KFE (`audit/deferred-ledger.md`; the
φ-ladder leaf-tail ENDED in D.W2, CL-8). E.W3 is net-new post-D styling residue.

**Routed OUTWARD / RECORDED (not this wave):**
- **The `.rainbow-vivid`/`.rainbow-pastel` play-button recipes** — stay
  glass-ui-owned (inv-16, D.W2 §Folds). E.W3 owns `.gold-shimmer` (a demo idiom
  the demo applies as a class), NOT the full multi-stop play-button recipes the
  demo merely applies. If glass-ui ever drops them, that is a glass-ui ASK.
- **The cube/square ANIMATED palettes** — permanent RECORD (the subject matter,
  not chrome; D.W2 §Folds color-token F5). E.W3 does not re-open.

## § Design decisions

1. **Own `.gold-shimmer` demo-locally — the inv-η close at the utility tier.**
   RESOLVED + HONEST (inv ε): `.gold-shimmer` is a demo-APPLIED idiom (the
   detail-curve hover shimmer on the easing label/items) the demo references ×3
   and owns nowhere — the exact inv-η rent D.W2 closed for `.scale-on-hover`,
   missed only because the D.W2 `proof:idioms` clause derived references from
   `var()` shapes, not class utilities. E.W3 defines it in the EXISTING
   `design-idioms.css` (not a new file) with glass-ui-matching values
   (isomorphic), binding to the owned `--color-gold` where the shimmer's base is
   gold. The DISTINCTION from D.W2 §Folds' "stay glass-ui-owned" recipes: those
   are full multi-stop gradient RECIPES (`.rainbow-vivid`) the demo applies
   wholesale; `.gold-shimmer` is a demo INTERACTION idiom (like `.scale-on-hover`)
   — the demo authored the AFFORDANCE, so it owns the contract. The FINAL claims
   "E.W3 owned the one utility-idiom rent D.W2's clause shape missed," not "D.W2
   was incomplete" (D.W2 closed the `var()`-tier rent fully; `.gold-shimmer` is
   the net-new utility-tier finding).

2. **Tokenize the RECURRING + the COUPLED; keep genuine singletons.** RESOLVED:
   `min-w-[12rem]` (×3) and the `w-[calc(100%-3rem)]` magic-gutter (coupled to
   `left-6`) earn tokens — recurrence + coupling are the tokenization triggers
   (D.W2 §DD4). `w-[30vw]` earns `--target-viewport-w` because it PAIRS with the
   existing `--target-viewport-h` (a dimensional sibling the D.W2 comment wrongly
   conflated). The easing cap earns `--easing-dropdown-max-h` because it
   participates in the `dvh` reconcile (S3). A one-off structural bracket with no
   reuse + no coupling stays arbitrary — no over-tokenizing.

3. **Reconcile to `dvh` — the mobile-correct, single-sourced unit.** RESOLVED:
   the panel-cap intent is expressed in two units (`60vh` ×2, `60dvh` ×2) — one
   intent, two units (verified §State 3). `dvh` is mobile-correct (tracks the
   dynamic viewport, avoids URL-bar over-reservation) and consistent with the
   work-area chain's `dvh` (D.W3). Unifying `--panel-max-h` on `60dvh` is one
   token + one unit. The easing cap (`--easing-dropdown-max-h`) lands on `dvh`
   too — whether it SHARES `--panel-max-h` (if 24rem-or-panel-cap is the intent)
   or stays independent `min(24rem, 60dvh)` is recorded at implementation (both
   are `dvh`; the share-vs-independent call is cosmetic). Trade-off: the `vh→dvh`
   change is the ONE named pixel delta — but it only shortens the OVER-reserving
   mobile case (toward correctness), and is desktop-isomorphic.

4. **Dedup `.progress-bar` to the owned idiom layer.** RESOLVED: the rule is a
   demo idiom (the rainbow brush-sweep reading the owned `--rainbow-*` family),
   duplicated in two scoped blocks — its canonical home is `design-idioms.css`
   (beside the family it consumes), single-sourced. Both components apply the
   class (already in their templates) and delete their scoped copy; a genuine
   per-component delta (if any) stays scoped, but the shared rule is defined
   once. Net-deletion of the duplicate + the drift class. KISS — one definition.

5. **Isomorphic except the ONE named `dvh` delta.** RESOLVED: every E.W3 change
   preserves computed values — `.gold-shimmer` (glass-ui-matching), the
   tokenization (same `12rem`/`30vw`/`3rem`/`min(24rem,60dvh)` computed), the
   dedup (same gradient) — EXCEPT the `--panel-max-h` `vh→dvh` reconcile, which
   is the single highly-befitting, NAMED delta (mobile correctness;
   desktop-isomorphic). The capture AFTER ≈ BEFORE with that one delta
   enumerated in `styling-findings §Isomorphism`. Pixels unchanged unless highly
   befitting + named — the precept, held.
