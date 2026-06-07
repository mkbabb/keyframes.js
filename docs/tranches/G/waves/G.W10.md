# G.W10 — The W10/W12-scene idiom finishing sweep (the post-F idiom re-fork)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the demo styling surface — a finishing idiom
sweep, NOT a rebuild; pixel-isomorphic by default, named-delta only where a larger
ball earns a brighter glow) · **Scope:** `demo/**` only — the design-idiom layer
`demo/@/styles/design-idioms.css` (the promotions land here), the two post-F scenes
that re-fork (`demo/sequence/SequenceTarget.vue`, `demo/motion-path/MotionPathTarget.vue`,
`demo/spring/SpringTarget.vue`), the two coupled-magic-number sites
(`demo/@/components/custom/animation-controls/AnimationControlsGroup.vue`,
`demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue`),
the two mask-fade token sites (`demo/@/components/custom/animation-controls/controls/AnimationControls.vue`,
`demo/@/components/custom/animation-controls/components/ControlsPaneWrapper.vue`),
the one arbitrary-value nit (`demo/@/components/custom/animation-controls/.../MatrixEditor.vue`)
+ the gate script (`scripts/proof-idioms.mjs` — extend its OWNED-IDIOMS clause family
with the status-badge / `.code-token` / `.progress-ball`-geometry / fade-token
clauses) — ZERO library (`src/**`), test (beyond the gate), or CI edit · **DAG:
independent of Bands 0/1** (the re-pin `G.W2` touches no `demo/**` SFC styling; runs
in parallel) — Band-5 sibling of `G.W11` (demo usability) + `G.W12` (dock), and
file-disjoint from the Band-4 waves (`G.W7`/`G.W8`/`G.W9`) save the shared
`AnimationControls.vue` mask-fade token (a `<style>`-block edit, disjoint from W7's
template-ref edits in the same file) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *The post-F `sequence/` + `motion-path/` scenes were authored AFTER the
D.W2 idiom-ownership sweep and the F §1 rail/ball consolidation, so they re-fork
idioms those passes already retired — `.settled-badge`/`.tracking-badge` byte-dup
across two scenes (the AA-contrast comment silently forked), `.code-token` byte-dup,
`.mp-traveller` hand-rolling the `.progress-ball` primitive with drifted glow/blur,
plus a `400px` controls-pane width coupled across two files, a two-named one-value
mask-fade token, and one `h-[fit-content]` arbitrary where `h-fit` exists two lines
away. Promote each to the layer that already owns the rest; gate it with the SAME
`proof:idioms` clause-shape D.W2 used — each idiom defined ONCE, zero scene re-fork.*

This is the §Mandate's **DRY / one-localized-idiom-layer discipline, extended to the
two scenes it predated** (`a-styling §1–§6`). It is the ONLY styling residual that
rises to a SHIP — the rest of the styling surface is ~90% ALREADY-SOTA (`a-styling
§8`: ONE localized `design-idioms.css` layer, ZERO `!important`, ZERO SFC `@apply`,
tokenized arbitraries, `dvh` + genuine `vh` fallback, a semantic z-contract, SOTA
`-webkit-mask-image` paired `@supports`, no raw hex). The entire residual is ONE
shape repeated — the exact same drift class as F §1's rail/ball, in the exact same
two newest surfaces. A finishing sweep, NOT a rebuild.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: each idiom is promoted to the ONE owned layer
(`design-idioms.css`) and the scoped re-forks are REMOVED — no scene keeps a "local
copy" beside the promoted idiom (the byte-dup scoped block IS the legacy-shape the
Mandate excises). NO legacy: the forked AA-contrast comment is single-sourced at the
idiom (so a contrast tune lands once, never drifts a silent fork); the drifted
`.mp-traveller` glow/blur literals collapse to the idiom default OR a NAMED per-site
delta (the same seam EasingTarget/Spring already use — `design-idioms.css:279-281`),
never a silent second value. KISS · DRY: ONE status-badge family, ONE inline-code
token, ONE ball primitive, ONE controls-pane-width token, ONE fade-magnitude token.
Styling ISOMORPHIC: pixel-identical by default (each promotion picks the existing
value as the idiom default — §1/§2/§4/§5/§6 are byte-stable; §3 is near-isomorphic
with one named motion-cohesion delta if the larger traveller keeps its brighter
glow). Measure-first does NOT bind (an idiom-correctness / DRY convergence, not a
perf claim) — the gate is a falsifiable presence-grep, not a bench. inv ε: every
site below cites `file:line`, source-verified on `tranche-g-dev`, not asserted. The
§7 `--filter-brand-color` SVG recolor is RECORD-only (latent, brand-hue-gated —
`a-styling §7`); do NOT manufacture it into work. Cross-repo hand-offs: NONE — every
finding is a demo-CSS concern inside the demo's own idiom layer (`a-styling`
cross-repo: NONE).

**Provenance.** `a-styling §1` (`.settled-badge`/`.tracking-badge` byte-dup + forked
AA comment; MED SHIP), `§2` (`.code-token` byte-dup; MED SHIP), `§3` (`.mp-traveller`
hand-rolls `.progress-ball`; LOW–MED SHIP), `§4` (`400px` controls-pane coupled
magic number; LOW–MED SHIP), `§5` (`--tabs-mask-fade`/`--mask-fade-width` two-name
shadow; LOW SHIP-or-BOOK), `§6` (`h-[fit-content]` arbitrary; LOW nit SHIP).
Synthesised at `_SYNTHESIS-frontend §2 TIER 4` (F-C1…F-C6 — "the post-F W10/W12-scene
drift … all gated by the same `proof:idioms` clause-shape D.W2 uses") +
`_SYNTHESIS-gap-scorecard §1` (styling row: "~90% ALREADY-SOTA · 4 LOW–MED SHIPs,
all ONE shape: post-F W10/W12 scenes re-fork retired idioms") + `§2 Band 5 G.W10`.

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`:

1. **`.settled-badge`/`.tracking-badge` are byte-identical across TWO scenes; the
   AA-contrast comment is forked `[§1]`.** Verified live: `SpringTarget.vue:181-194`
   declares `.settled-badge` (`background: color-mix(... --color-progress 14% ...)`,
   `color: color-mix(... --color-progress 50% var(--foreground))`) + `.tracking-badge`
   (`background: color-mix(... --muted 60% ...)`, `color: var(--muted-foreground)`),
   carrying the load-bearing comment that documents the `14%`/`50%` AA-contrast
   lineage (the C.W2 lighthouse leaf — the bare green was 1.97:1). `SequenceTarget.vue:232`
   (`.settled-badge`) + `:237` (`.tracking-badge`) are the byte-identical recipe with
   **no** comment — a silent fork of an a11y-load-bearing value. `SequenceTarget.vue`
   also authors a THIRD `.reverse-badge` (`:220-223`, the violet reverse-direction
   tint — a genuine per-scene addition, applied via the ternary at
   `SequenceTarget.vue:14` `:class="demo.isReversed.value ? 'reverse-badge' : (… ? 'tracking-badge' : 'settled-badge')"`).
   The day someone tunes the contrast on one copy, the other drifts and silently
   re-fails contrast with no gate — the precise failure mode `design-idioms.css` was
   built to prevent (`a-styling §1`).

2. **`.code-token` is byte-identical across TWO scenes `[§2]`.** Verified live:
   `SpringTarget.vue:132-135` `.code-token { font-family: var(--font-mono);
   font-size: var(--type-caption); }` (with a comment documenting the case-preserving
   register rationale); `MotionPathTarget.vue:73-76` is the byte-identical `.code-token`
   with no comment (applied at `MotionPathTarget.vue:36` `<span class="code-token">offset-path</span>`).
   Both consume correct tokens (`--font-mono` demo-owned `style.css:54`;
   `--type-caption` glass-ui-owned `typography.css:104` `0.75rem`). This two-property
   inline-code idiom will recur in every new prose-bearing scene (the W10/W12 pattern
   of explaining the API in-scene) — exactly the "demo REFERENCES an idiom everywhere
   but DEFINES it nowhere centralized" rent `design-idioms.css` exists to retire
   (`a-styling §2`).

3. **`.mp-traveller` hand-rolls the `.progress-ball` primitive with two drifted
   literals `[§3]`.** Verified live: the canonical `.progress-ball` idiom is the single
   source (`design-idioms.css:294-304` — `border-radius: var(--radius-pill)`,
   `background: var(--color-progress)`, `box-shadow: 0 2px 10px color-mix(...
   --ball-glow 35% ...)`, parameterized `--ball-size` defaulting `36px`).
   EasingTarget/SpringTarget/SequenceTarget all correctly consume it with per-site
   `--ball-size`/`--ball-glow` only (`a-styling §8` verified). But
   `MotionPathTarget.vue:102-114` `.mp-traveller` re-authors the recipe by hand:
   `border-radius: var(--radius-pill)`, `background: var(--color-progress)`,
   `box-shadow: 0 2px 12px color-mix(in srgb, var(--color-progress) 40%, transparent)`,
   `width/height: 2.75rem` — the `.progress-ball` recipe with two drifted literals
   (`12px` blur vs the idiom's `10px`; `40%` glow vs the idiom's `35%` default), i.e.
   the precise glow/blur drift F §1 consolidated everywhere else, re-introduced in the
   newest scene. The traveller carries a `&#x1F642;` glyph child
   (`MotionPathTarget.vue:27`), so it legitimately keeps `display: grid; place-items:
   center` as its only non-idiom rule. (The dashed `.mp-guide-path` is correctly a
   distinct rail-tint primitive — NOT a ball — and rightly stays scoped, `a-styling
   §3`.)

4. **`400px` is a coupled magic number across TWO files `[§4]`.** Verified live: the
   controls grid declares its left track as `lg:grid-cols-[400px_1fr_1fr]`
   (`AnimationControlsGroup.vue:5`) and the controls pane that fills that track
   declares `min-width: 400px` (`ControlsPaneWrapper.vue:204`). These MUST match —
   the comment at `AnimationControlsGroup.vue:51` narrates "the 400px backdrop sits
   above the centered stage." Two files, two raw `400px` literals, one invariant:
   change the track and the pane overflows/under-fills with no gate. This is the
   recurring-structural-literal class the D/E layout-token pass named homes for
   (`--dock-panel-width` etc. at `design-idioms.css:91-105`) — the controls-pane width
   simply was not on that list (it lives in the `lg` grid the layout-token sweep
   under-covered) (`a-styling §4`).

5. **`--tabs-mask-fade` / `--mask-fade-width` — two names, one `2.5rem` value `[§5]`.**
   Verified live: the tab-overflow fade declares `--tabs-mask-fade: 2.5rem`
   (`AnimationControls.vue:301`, driving the `@supports`-gated paired
   `-webkit-mask-image`/`mask-image` recipe at `:311-320`) and the controls-pane
   vertical scroll fade declares `--mask-fade-width: 2.5rem`
   (`ControlsPaneWrapper.vue:225`) — the identical edge-fade magnitude under divergent
   local names. The mask recipe itself is ALREADY-SOTA (the paired `@supports`,
   `a-styling §8`); only the magnitude token is a naming shadow — two homes for one
   design decision ("how wide is an edge fade") (`a-styling §5`).

6. **`h-[fit-content]` arbitrary where `h-fit` exists `[§6]`.** Verified live:
   `MatrixEditor.vue:5` writes `h-[fit-content]` (a bracket-arbitrary) for what
   Tailwind expresses as the first-class `h-fit` — and the SAME codebase uses `w-fit`
   idiomatically (`AnimationControls.vue:12,16`). It is the lone surviving
   "arbitrary value that wants a built-in utility" after the D/E/F migration routed
   the rest to tokens (`a-styling §6`).

7. **The `proof:idioms` gate already owns the clause-shape this wave extends.**
   Verified live: `scripts/proof-idioms.mjs` is the D.W2 design-language-localization
   gate; its CLAUSE 1 (OWNED IDIOMS) asserts every demo-referenced idiom resolves to
   a DEMO-LOCAL definition in `design-idioms.css` (BITE: empty the file → the
   referenced idioms have no demo-local home → reds), CLAUSE 2 (LEAF-TAIL SWEPT)
   greps raw `text-sm`/`text-xs`/`text-base` over `demo/` excluding vendored UI +
   `dist/`, CLAUSE 3 (MONOLITH UNCAGED) forbids component-specific selectors trapped
   in a global stylesheet. The wave EXTENDS clause 1 with the new owned-idiom presence
   + zero-scene-re-fork sub-clauses (status-badge, `.code-token`, the
   `.progress-ball`-geometry guard, the controls-pane-width token, the fade-magnitude
   token) — the same instrument, the same BITE shape, no bespoke new gate.

The wave's job: promote each re-forked idiom to `design-idioms.css`, REMOVE the
scoped re-forks (no copy beside the promotion), single-source the AA-contrast comment,
collapse the two coupled `400px` literals + the two-named fade token to ONE token
each, fix the one `h-fit` nit, and extend `proof:idioms` clause 1 with the
zero-re-fork sub-clauses that BITE today on the dup'd scenes.

---

## § Goal

**What lands:**

- **`.status-badge` family promoted; the two-scene dup + the silent AA fork retired
  (§1).** A parameterized `.status-badge` lands in `design-idioms.css` beside
  `.progress-rail`/`.progress-ball`, taking a `--badge-tone` (default `--color-progress`)
  with `--badge-tint`/`--badge-text-mix` defaulting to the AA-lineage `14%`/`50%` —
  the AA-contrast comment lives ONCE at the idiom. `.settled-badge` = tone
  `--color-progress`; `.tracking-badge` = tone `--muted` (its own neutral recipe);
  `.reverse-badge` = tone `--rainbow-violet`. The four scoped blocks across
  `SpringTarget`/`SequenceTarget` collapse to per-site `--badge-tone` assignments;
  the scoped copies are REMOVED.
- **`.code-token` promoted; the two-scene dup retired (§2).** Two lines + the
  case-preservation comment land ONCE in `design-idioms.css`; both scenes apply the
  class through the owned layer; the two scoped copies (`SpringTarget.vue:132-135`,
  `MotionPathTarget.vue:73-76`) are REMOVED. The cheapest promotion in the lane.
- **`.mp-traveller` consumes `.progress-ball`; the drifted glow/blur reconciled (§3).**
  `.mp-traveller` sets `--ball-size: 2.75rem` (and, if the larger traveller keeps its
  brighter glow, `--ball-glow: 40%` as a NAMED per-site delta — the same seam
  EasingTarget/Spring use) and keeps only `display: grid; place-items: center` for the
  glyph child. The `12px`-blur literal drops to the idiom's `10px` (or is named as a
  delta if kept). Folds into the F §1 rail/ball idiom this scene missed.
- **`--controls-pane-width: 400px` token; the coupled magic number single-sourced
  (§4).** The token lands in the layout-token block (`design-idioms.css:91-105`); the
  grid track becomes `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]` and the pane
  `min-width: var(--controls-pane-width)`; the coupling comment becomes a token
  reference.
- **`--mask-fade: 2.5rem` token; the two-name shadow collapsed (§5).** One
  fade-magnitude token in `design-idioms.css`; both consumers
  (`AnimationControls.vue:301`, `ControlsPaneWrapper.vue:225`) reference it. (The
  deeper `.edge-fade-{x,y}` recipe-promotion is RECORDED as a larger move, NOT folded
  here — the token unification is the minimal correct fix; §Design-decision 5.)
- **`h-[fit-content]` → `h-fit` (§6).** One trivial substitution
  (`MatrixEditor.vue:5`), pixel-identical (`h-fit` compiles to `height: fit-content`).
- **`proof:idioms` clause-1 extension (new sub-clauses)** — grep `design-idioms.css`
  for the promoted definitions (`.status-badge`, `.code-token`, the
  `--controls-pane-width`/`--mask-fade` tokens) AND grep `demo/**` scoped `<style>`
  blocks (comment-blanked, `dist/`-excluded) asserting ZERO scene re-authors
  `.settled-badge`/`.tracking-badge`/`.code-token`, ZERO scene re-declares a
  `box-shadow: 0 2px … color-mix(… --color-progress …)` on a ball-shaped element, and
  ZERO raw `400px`/divergent fade-magnitude literal survives at the two coupled sites.
  BITES today on the dup'd scenes; green after the sweep.

**Why:** the two newest scenes re-fork idioms the rest of the demo already owns —
the byte-dup status-badge silently forks an a11y-load-bearing contrast value, the
byte-dup `.code-token` will recur in every new prose scene, the hand-rolled
`.mp-traveller` re-introduces the glow/blur drift F §1 consolidated, and the two
coupled `400px` literals + the two-named fade token are un-gated coupling. Promoting
each to the layer that already owns the rest single-sources every value, makes the
next NEW scene consume rather than re-fork, and gates the convergence so a re-fork
reds. This is the disciplined system extended to the two scenes it predated, NOT a
rebuild.

**What does NOT land (recorded so no future lane re-raises):**
- **The `--filter-brand-color` 6-fn SVG recolor** (`style.css:175`) — RECORD only
  (`a-styling §7`): the brittleness is latent (bites only on a brand-hue change) and
  the fix is a real re-plumb (`mask-image` + `background-color`). Migrate THEN, in one
  motion, not now.
- **Promoting the whole `@supports` mask recipe to a `.edge-fade-{x,y}` utility** —
  RECORDED as the deeper DRY win but a LARGER move (`a-styling §5`); §5 ships only the
  token unification (the minimal correct fix). Do NOT reflexively carve the recipe.
- **The ALREADY-SOTA styling bulk** (`a-styling §8`) — the ONE localized idiom layer,
  zero `!important`, zero SFC `@apply`, tokenized arbitraries, `dvh`+`vh` fallback,
  the semantic z-contract, SOTA masking, no raw hex. Manufacture NO work here.

---

## § Scope

### S1 — promote the `.status-badge` family; retire the two-scene dup + the silent AA fork (`a-styling §1`) — SHIP-in-G (MED, the lane spine)

**WHAT:** add a parameterized `.status-badge` to `design-idioms.css` (beside
`.progress-rail`/`.progress-ball`), taking `--badge-tone` (default `--color-progress`)
with `--badge-tint`/`--badge-text-mix` defaulting to the AA-lineage `14%`/`50%`, and
carry the AA-contrast comment ONCE at the idiom. Convert `.settled-badge`
(tone `--color-progress`), `.tracking-badge` (tone `--muted`, its neutral recipe),
and `.reverse-badge` (tone `--rainbow-violet`) to per-site `--badge-tone` assignments
in `SpringTarget.vue` + `SequenceTarget.vue`; REMOVE the scoped
`.settled-badge`/`.tracking-badge` blocks (`SpringTarget.vue:181-194`,
`SequenceTarget.vue:232-240`) and re-home `.reverse-badge`'s tone onto the idiom.

**WHY:** §State 1 — the recipe is byte-dup'd across two scenes and the
`SequenceTarget` copy silently forks an a11y-load-bearing contrast value (the
`14%`/`50%` AA lineage). Single-sourcing the idiom + the AA comment means a contrast
tune lands once and can never drift a silent fork. Pixel-isomorphic (the `14%`/`50%`
lineage is the idiom default; every badge paints identically); named-isomorphic.

### S2 — promote `.code-token`; retire the two-scene dup (`a-styling §2`) — SHIP-in-G (MED, the cheapest promotion)

**WHAT:** add `.code-token { font-family: var(--font-mono); font-size:
var(--type-caption); }` + the case-preservation comment ONCE to `design-idioms.css`;
both scenes apply the class through the owned layer; REMOVE the scoped copies
(`SpringTarget.vue:132-135`, `MotionPathTarget.vue:73-76`).

**WHY:** §State 2 — a two-property inline-code idiom re-typed in two scenes that will
recur in every prose-bearing scene. Promoting it is the smallest correct fix and
retires the rent before the next W-scene copies it. Pixel-identical (same two computed
values).

### S3 — `.mp-traveller` consumes `.progress-ball`; reconcile the drifted glow/blur (`a-styling §3`) — SHIP-in-G (LOW–MED)

**WHAT:** have `.mp-traveller` consume `.progress-ball`
(`design-idioms.css:294-304`) with per-site `--ball-size: 2.75rem` (and `--ball-glow:
40%` as a NAMED per-site delta IF the larger traveller keeps its brighter glow — the
same seam EasingTarget/Spring use, `design-idioms.css:279-281`); keep only `display:
grid; place-items: center` for the glyph child (`MotionPathTarget.vue:27`); drop the
`12px`-blur literal to the idiom's `10px` (or name it a delta if kept). REMOVE the
hand-rolled recipe block (`MotionPathTarget.vue:102-114`); leave `.mp-guide-path`
(the distinct rail-tint, NOT a ball) scoped.

**WHY:** §State 3 — the newest scene re-authors the `.progress-ball` primitive with
two drifted literals, re-introducing the glow/blur drift F §1 consolidated everywhere
else. Consuming the idiom folds this scene into the F §1 rail/ball consolidation it
missed (it landed after the sweep). Near-isomorphic with one NAMED motion-cohesion
delta (the `35%`→`40%` glow + `10px`→`12px` blur — the same class as F §1's three-site
reconcile); default to the idiom, name the delta if kept.

### S4 — `--controls-pane-width` token; single-source the coupled `400px` (`a-styling §4`) — SHIP-in-G (LOW–MED)

**WHAT:** add `--controls-pane-width: 400px` to the layout-token block
(`design-idioms.css:91-105`, beside its `--dock-panel-width` siblings); the grid track
becomes `lg:grid-cols-[var(--controls-pane-width)_1fr_1fr]`
(`AnimationControlsGroup.vue:5`) and the pane `min-width:
var(--controls-pane-width)` (`ControlsPaneWrapper.vue:204`); the coupling comment
(`AnimationControlsGroup.vue:51`) becomes a token reference.

**WHY:** §State 4 — one layout invariant, two un-linked raw `400px` literals across
two files; change one and the other silently de-syncs. The token single-sources the
invariant (the layout-token pass under-covered the `lg` grid). Pixel-identical.

### S5 — `--mask-fade` token; collapse the two-name shadow (`a-styling §5`) — SHIP-in-G (LOW, cheap)

**WHAT:** promote one `--mask-fade: 2.5rem` to `design-idioms.css`; both consumers
(`AnimationControls.vue:301` `--tabs-mask-fade`, `ControlsPaneWrapper.vue:225`
`--mask-fade-width`) reference it. The two divergent local names retire.

**WHY:** §State 5 — the same `2.5rem` edge-fade magnitude under two names is a naming
shadow (two homes for "how wide is an edge fade"). One token, both sites reference it.
Pixel-identical. (The whole-recipe `.edge-fade-{x,y}` promotion is RECORDED as a
larger move, §Design-decision 5 — not folded here.)

### S6 — `h-[fit-content]` → `h-fit` (`a-styling §6`) — SHIP-in-G (LOW, trivial)

**WHAT:** `MatrixEditor.vue:5` `h-[fit-content]` → `h-fit`.

**WHY:** §State 6 — the lone non-idiomatic arbitrary value where the first-class
utility exists (and is used `w-fit` two lines away, `AnimationControls.vue:12`).
Pixel-identical (`h-fit` compiles to `height: fit-content`).

> **RECORDED / REJECTED in this band — so no future lane re-litigates:**
> - **`--filter-brand-color`** (`style.css:175`) — RECORD (`a-styling §7`): latent,
>   brand-hue-gated; migrate to `mask-image` + `background-color` THEN, in one motion.
> - **The `.edge-fade-{x,y}` whole-recipe promotion** — RECORDED as the deeper DRY
>   win but a LARGER move (`a-styling §5`); ship only the token unification (S5).
> - **The styling ALREADY-SOTA bulk** (`a-styling §8`) — ONE idiom layer, zero
>   `!important`, zero SFC `@apply`, tokenized arbitraries, `dvh`+`vh` fallback, the
>   z-contract, SOTA masking, no raw hex. UNTOUCHED. Manufacture NO work.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable
instrument, not an assertion). **The extension is to `proof:idioms` clause 1 (the
D.W2 OWNED-IDIOMS gate) — the same shape that already proves the demo OWNS its idiom
contract, now proving the post-F scenes consume it rather than re-fork:**

1. **OWNED — each promoted idiom is defined EXACTLY ONCE in `design-idioms.css`.**
   The clause greps `design-idioms.css` for `.status-badge`, `.code-token`, the
   `--controls-pane-width` token, and the `--mask-fade` token. **BITE:** empty the
   file (the existing clause-1 BITE) → the promoted idioms have no demo-local home →
   reds. Proves the demo OWNS the promotions, not the rent.

2. **ZERO SCENE RE-FORK — no scene `<style scoped>` re-authors a promoted idiom.**
   The clause greps `demo/**` `.vue` scoped `<style>` blocks (comment-blanked,
   `dist/`-excluded) asserting ZERO `.settled-badge`/`.tracking-badge`/`.code-token`
   definitions outside `design-idioms.css`, AND ZERO scene re-declares a `box-shadow:
   0 2px … color-mix(… --color-progress …)` on a ball-shaped element. **BITE:** reds
   TODAY on `SpringTarget.vue:181-194,132-135`, `SequenceTarget.vue:232-240`,
   `MotionPathTarget.vue:73-76,102-114`; green after S1+S2+S3. A scene re-forking a
   badge/`.code-token`/ball recipe reds.

3. **TOKENIZED — the coupled magic numbers reference the token, not the literal.**
   The clause greps that the controls grid track (`AnimationControlsGroup.vue`) + the
   pane `min-width` (`ControlsPaneWrapper.vue`) reference `var(--controls-pane-width)`
   (no raw `400px`), and that both fade-mask sites reference `var(--mask-fade)` (no
   divergent `--tabs-mask-fade`/`--mask-fade-width` magnitude literal), and that no
   `h-[fit-content]` bracket-arbitrary survives where `h-fit` exists. **BITE:** reds
   TODAY on `AnimationControlsGroup.vue:5`, `ControlsPaneWrapper.vue:204`,
   `AnimationControls.vue:301`, `ControlsPaneWrapper.vue:225`, `MatrixEditor.vue:5`;
   green after S4+S5+S6. (This rides the brittleness lane's anti-arbitrary clause
   family — the same one that gates raw `z-[N]` — per `a-styling §4/§6`.)

4. **No regression — the sweep is pixel-inert (named deltas aside) + the rest of the
   gate holds.** `npm test` stays green; `proof:idioms` clauses 1–3 (the pre-existing
   OWNED / LEAF-TAIL / MONOLITH clauses) are UNTOUCHED and stay green; every promoted
   idiom paints byte-stable against the existing default value (the `14%`/`50%` AA
   lineage, `--font-mono`/`--type-caption`, `36px`/`2.5rem`/`400px`), the ONE named
   delta (`.mp-traveller` glow/blur, IF kept) is recorded; the demo builds. **BITE:**
   any clause-1/2/3 regression, any un-named pixel diff, or any `src/**`/CI edit
   attributed to this wave reds (the wave is `demo/**`-only).

---

## § Folds

Retires (by finding id):
- **`a-styling §1`** (`.settled-badge`/`.tracking-badge` byte-dup + forked AA comment;
  MED) — S1 + gate clauses 1/2.
- **`a-styling §2`** (`.code-token` byte-dup; MED) — S2 + gate clauses 1/2.
- **`a-styling §3`** (`.mp-traveller` hand-rolls `.progress-ball`; LOW–MED) — S3 +
  gate clause 2.
- **`a-styling §4`** (`400px` controls-pane coupled magic number; LOW–MED) — S4 +
  gate clauses 1/3.
- **`a-styling §5`** (`--tabs-mask-fade`/`--mask-fade-width` two-name shadow; LOW) —
  S5 + gate clauses 1/3.
- **`a-styling §6`** (`h-[fit-content]` arbitrary; LOW nit) — S6 + gate clause 3.

**RECORDED / REJECTED in this band (see §Scope callout):**
- **`a-styling §7`** (`--filter-brand-color` SVG recolor) — RECORD (latent,
  brand-hue-gated); migrate to `mask-image`+`background-color` THEN, in one motion.
- **The `.edge-fade-{x,y}` whole-recipe promotion** — RECORDED as the deeper DRY win,
  not folded (S5 ships the token unification only).
- **`a-styling §8`** (the ALREADY-SOTA styling bulk) — UNTOUCHED, verified exemplary;
  manufacture NO work.

---

## § Design decisions (the trade-offs RESOLVED)

1. **Parameterize ONE `.status-badge` family, NOT three sibling idioms.** RESOLVED:
   `.settled-badge`/`.tracking-badge`/`.reverse-badge` are one design concept ("a
   status tint at the caption rung") with three tones. A `.status-badge` taking a
   `--badge-tone` (with the AA-lineage tint/text-mix as the default) is the DRY shape —
   one recipe, one AA comment, three per-site tone assignments — rather than three
   near-identical idioms that would re-introduce the same drift surface inside the
   layer. The seam mirrors `.progress-ball`'s `--ball-size`/`--ball-glow`
   parameterization (`design-idioms.css:279-281`) — the demo's established
   parameterized-idiom convention (`a-styling §1`).

2. **Default to the existing AA-lineage value; the comment lives at the idiom.**
   RESOLVED: the `14%`/`50%` contrast lineage is the C.W2 lighthouse leaf (the bare
   green was 1.97:1, `a-styling §1`). Promoting it as the idiom DEFAULT keeps every
   badge pixel-stable AND single-sources the a11y-load-bearing value + its comment —
   so the next contrast tune lands once and the gate (clause 2) forbids a scene from
   re-forking it silently. The §State-1 forked-comment failure mode is structurally
   foreclosed.

3. **`.mp-traveller` glow/blur: default to the idiom; NAME the delta only if kept.**
   RESOLVED: the `12px`/`40%` literals are drift, not a deliberate design choice — the
   idiom's `10px`/`35%` is the F §1 reconciled value. The clean default is to consume
   the idiom unchanged (pixel-isomorphic to `.progress-ball`, a tiny visual shift from
   the current traveller). IF the larger `2.75rem` traveller genuinely earns a brighter
   glow (a motion-cohesion judgement, like EasingTarget's per-site `--ball-glow`), it
   is a NAMED per-site `--ball-glow: 40%` delta — never a silent re-authored recipe.
   The §Mandate's isomorphic-unless-named rule applied exactly (`a-styling §3`).

4. **Tokenize the coupled `400px` + the two-named fade — they are coupling, not
   one-offs.** RESOLVED: `a-styling §8` confirms most demo arbitraries are befitting
   non-recurring one-offs (`min-h-[20vh]`, `scale-x-[-1]`, the visualizer
   `translate-x-[calc(100cqw_-_100%)]`) and are left alone. `400px` (×2, a coupled
   layout invariant) and the `2.5rem` fade (×2, one design decision under two names)
   are NOT one-offs — they are recurring/coupled, the exact class the layout-token
   pass named homes for. Tokenizing them (and NOT the befitting one-offs) is the
   principled line: token the recurring/coupled, leave the local one-offs.

5. **S5 ships the token unification, NOT the whole-recipe `.edge-fade` promotion.**
   RESOLVED: the two `@supports`-gated mask recipes ARE conceptually one idiom
   ("edge-fade an overflow"), so a `.edge-fade-{x,y}` utility in the layer would be
   the deeper DRY win (the recipe is ~8 lines duplicated twice). But that is a larger
   move with more surface to verify; the §Mandate's KISS favours the minimal correct
   fix here — the token unification single-sources the one drifting value (the
   magnitude) while the (already-SOTA) recipe stays scoped. The whole-recipe
   promotion is RECORDED for a future styling pass, not manufactured now
   (`a-styling §5`).

6. **Extend the EXISTING `proof:idioms` gate — the re-fork IS a clause-1-shaped
   offence.** RESOLVED: `proof:idioms` clause 1 already proves the demo OWNS its idiom
   contract (every referenced idiom resolves to a `design-idioms.css` definition). A
   scene re-forking a promoted idiom is the EXACT inverse offence — referencing the
   contract while re-defining it locally. Folding the zero-re-fork sub-clauses into
   clause 1 (not a bespoke new gate) is the principled extension: the gate that proves
   the demo owns the idioms should forbid a scene from re-forking them. Same
   instrument, same BITE shape (`_SYNTHESIS-frontend §2 TIER 4`: "all gated by the
   same `proof:idioms` clause-shape D.W2 uses").

7. **This wave is `demo/**`-only — ZERO library surface; ZERO cross-repo hand-off.**
   RESOLVED: every finding is a demo-CSS concern inside the demo's own idiom layer
   (`a-styling` cross-repo: NONE). No `src/**`, no value.js/parse-that/glass-ui
   surface is implicated — the mask recipe, `--type-caption`, and `btn-interactive`
   consume glass-ui idiomatically (correct usage, not gaps, `a-styling §8`). The gate
   edits `scripts/proof-idioms.mjs` (the lock) — the only non-`demo/**` file touched,
   and it is the instrument, not behaviour.
