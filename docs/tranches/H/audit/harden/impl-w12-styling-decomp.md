# impl-w12-styling-decomp — LANE B (S5 + S3): styling-idioms membership (I12) · global/shared style audit · decomposition + colocation VERIFY (I10)

**Lane:** H.W12 LANE B — S5/I12 (the OWNED-IDIOMS contract-MEMBERSHIP extension + the
magic-number / brittle-calc / viewport-trap cleanup in the GLOBAL + shared styles) + S3/I10
(VERIFY the demo decomposition holds + the colocation is coherent + the seam's `useDragScrub`
is colocated). Owns `demo/@/styles/` + `design-idioms.css` + the GLOBAL style audit + the
colocation verify. Does NOT edit scene-target `.vue` files (Lane A/C own those — scene-local
flags are recorded in §5 for them).

**Status:** LANDED — **ZERO source edits** (the MEASURE-FIRST verdict is the reduction branch:
the global + shared styles are already isomorphic + clean; the referenced-idiom set is fully
resolved; the decomposition + colocation hold). `npm run check` (tsc --noEmit) PASS at lane
close (baseline clean → clean after, since no edits). No engine touched (`src/animation`
FENCED, inv ζ). No git commit (per directive). The seam lane (impl-w12-seam.md) landed first;
Lane B binds to it.

---

## 1. S5 / I12 — the FORK-I12 MEASURE-FIRST verdict: **REDUCTION branch (zero undefined idioms)**

The contract (H.W12.md `proof:styling-idioms`, FORK-I12) requires the impl lane to MEASURE-FIRST
whether **≥1 referenced-but-undefined idiom-shaped class exists beyond the W4-owned `icon-*`**.
If ≥1 → own it in `design-idioms.css` (the contract extends). If NONE → record honestly that
clause (a) REDUCES to a born-GREEN regression guard, NOT a papered born-RED.

**VERDICT: NONE. The gate REDUCES to the regression-guard clause (b). Recorded honestly.**

### The measurement (re-runnable, source-grounded)

I enumerated the FULL referenced-idiom set vs every definition home, in three passes:

1. **Extracted every class** referenced in `class="…"` / `:class="…"` across `demo/**/*.vue`
   (320 distinct hyphenated tokens), removed standard Tailwind-prefixed utilities (→ 113
   candidates), then subtracted the demo-local-defined set + the glass-ui-defined set (611
   classes/`@utility` in `node_modules/@mkbabb/glass-ui/dist/styles/`) → **82 residual candidates**.

2. **Classified the 82** by definition home (scoped `<style>` block / `:deep()` rule /
   `@keyframes` / token-var false-positive / glass-ui / tw-animate-css). After removing
   CSS-custom-property false positives (`--panel-max-h`, `--dock-panel-width`, `--target-viewport-*`,
   etc. — these matched the grep as `var(--name)` references, NOT classes) and the scene-private
   scoped classes (`seq-row`, `mp-stage`, `spring-ball`, `hero-ball`, … all defined in their own
   `.vue` `<style scoped>` blocks), **8 candidates** survived for individual inspection.

3. **Inspected the 8 by hand** (reference + definition site):

| Candidate | Verdict | Resolves via |
|---|---|---|
| `fade-in` | RESOLVED | `tw-animate-css` `@utility fade-in` (`animate-in fade-in …` API; style.css:2 import) |
| `slide-in-from-right-2` | RESOLVED | `tw-animate-css` `@utility slide-in-from-right-*` (the `-N` arbitrary variant) |
| `css-value-input` | RESOLVED | `EasingSidebar.vue:174` `.panel-content :deep(.css-value-input)` (scoped, load-bearing `text-transform:none`) |
| `value-field` | NOT-IDIOM | pure semantic markup anchor (`EasingSidebar.vue:42`); its styling is the inline Tailwind `min-w-0`; no own-rule, no descendant dependency — removing the class name changes 0px |
| `matrix-grid` | NOT-IDIOM | semantic anchor (`MatrixEditor.vue:5`); styling is the adjacent inline Tailwind `grid grid-cols-4 …`; no own-rule, no descendant dependency |
| `panel-stack` | NOT-IDIOM | semantic anchor (`AnimationControlsControls.vue:6`); styling is the adjacent inline `relative`; no own-rule |
| `seq-row` | NOT-IDIOM (Lane A territory) | semantic anchor (`SequenceTarget.vue:30`); styling is inline `flex items-center gap-3`; sequence-scoped |
| `dot-fade` | DEAD-REF (comment-only) | appears ONLY inside an `EditorStartScreen.vue:22` comment narrating the W4 deletion of the old `<AnimatedText class="dot-fade">` — NOT a live class reference |

**The decisive distinction for the contract.** An "idiom-shaped class" in the FORK-I12 sense is
one that LOOKS like it carries a reusable visual recipe (`icon-sm`, `depth-text`, `gold-shimmer`)
but resolves to NO rule — silently FLATTENING an affordance (the exact `icon-*` 61-no-op failure
W4 closed). NONE of the residual 8 do that:
- `value-field` / `matrix-grid` / `panel-stack` / `seq-row` are **semantic markup anchors** whose
  visual styling is co-located inline as Tailwind utilities on the SAME element. They paint
  correctly; the class name is a JS/readability label, not an unresolved recipe. (KISS — this is
  idiomatic Vue/Tailwind, not a defect.)
- `css-value-input` IS defined (a load-bearing scoped `:deep()` rule).
- `fade-in` / `slide-in-from-right-2` ARE defined (tw-animate-css `@utility` family).
- `dot-fade` is a comment, not a reference.

### The named suspects (`depth-text` / `text-mono-caption`) are glass-ui-grace rents that RESOLVE — KEEP

The lead named `depth-text` / `text-mono-caption` as suspects ("kf-owned or glass-ui-grace rents?").
**MEASURED: both are first-class glass-ui definitions** —
- `text-mono-caption` → `@utility text-mono-caption` (`glass-ui/dist/styles/typography.css:378`),
  one of the `text-mono-{micro,small,prose,caption}` family.
- `depth-text` → `.depth-text` (`glass-ui/dist/styles/utilities.css:231`, the layered-shadow recipe).
- (`btn-interactive`, `cartoon-surface`, `glass-resting`, `rounded-card` — same: all glass-ui-owned.)

These are the **exact same disposition as `.scale-on-hover`** (design-idioms.css:234-253, H.W2.S4):
glass-ui OWNS the recipe; the demo CONSUMES the `@utility`/`.class` by name with zero churn. Per
**inv-16** ("the demo CONSUMES glass-ui recipes, it does not re-author them"), re-authoring
`depth-text`/`text-mono-caption` into `design-idioms.css` would be a NO-LEGACY violation (a
re-author beside its replacement), NOT a contract win. The right disposition is KEEP — they resolve
transitively, like the `--rainbow-*` family the `proof:idioms` gate already polices via its
own resolve-or-red clause.

**The honest nuance the contract anticipated:** these glass-ui-grace idioms are NOT in the
demo-LOCAL contract (`design-idioms.css`) — they resolve only through the transitive glass-ui pin,
the same latent cross-repo rent `design-idioms.css` exists to retire for the DEMO-AUTHORED idioms.
BUT they are glass-ui's to own (inv-16), so the demo's correct move is to consume, not localize.
The membership probe is about **demo-authored idiom-shaped classes that resolve to NOTHING**, and
there are NONE.

### Disposition of `proof:styling-idioms` (gate-authoring is H.W8's home)

- **Clause (a) [contract-membership extension] → REDUCES to a born-GREEN regression guard.** The
  probe found zero referenced-but-undefined demo-authored idiom-shaped class beyond `icon-*`. The
  gate does NOT bite born-RED today; its bite is a FUTURE un-owned idiom (a new
  `class="something-fancy"` with no demo-local definition and no glass-ui/tw-animate-css home).
  This is the FORK-I12 reduction branch, recorded honestly per the §Mandate bar ("NOT papered as
  a born-RED that does not bite").
- **Clause (b) [no magic-number / brittle-calc regressions in scene styles] → born-GREEN guard.**
  See §2 — the GLOBAL + shared styles carry zero unowned magic numbers / brittle chains today.
- **Recommended gate shape for H.W8** (the gate-regime wave owns authoring; I do NOT author it):
  EXTEND the `proof:icon-idiom.mjs` / `proof:idioms.mjs` resolve-or-red plumbing to a SET that is
  `{demo-local design-idioms.css defs} ∪ {glass-ui dist defs} ∪ {tw-animate-css defs}`, and red
  if a demo `class="…"` token that is idiom-shaped (hyphenated, non-Tailwind-prefix, not a
  scene-private scoped class) resolves to none of the three. Today that set fully covers every
  reference, so the gate is born-GREEN — a regression guard, exactly clause (a)-reduced.

---

## 2. S5 / I12 — magic-number / brittle-calc / viewport-trap cleanup in the GLOBAL + shared styles

**Surface audited (Lane B's owned surface):** `demo/@/styles/{design-idioms.css, style.css,
brand.css}` + the two shared non-scoped colocated partials
(`animation-controls/controls/{playback-button.css, tab-trigger.css}`).

**Verdict: already isomorphic + clean. ZERO edits owed.** The D.W2 / E.W3 / H.W3 token-localization
passes (verified by `proof:idioms` PASS, see §4) already retired the magic numbers here:

- **Every layout `calc()`/`clamp()`/`min()` chain in `style.css` is NAMED + documented + reconciled.**
  The work-area optical-balance pair (`--work-area-vertical-bias-{top,bottom}` = 0.42/0.58, summing
  to 1 — NOT a magic divisor), the cycle-free `--dock-band-reserve` vs `--dock-menubar-reserve`
  split (the documented custom-property-cycle break), the mobile `min(64rem, 100dvh − dock-band)`
  cap — each carries a multi-line rationale comment explaining WHY the value is what it is. No
  bare literal.
- **Viewport units are bounded + tokenized, not traps.** `94vw` lives inside a
  `clamp(72rem, 94vw, 120rem)` (floor + ceiling bound it). `--target-viewport-{h,w}` (30vh/30vw)
  are the E.W3.S2 dimensional-sibling tokens (a vh token cannot name a vw width — the conflation
  was already corrected). `--panel-max-h` was reconciled to ONE mobile-correct `60dvh` unit
  (E.W3.S3). No raw unbounded `vh` on a height that should track `dvh`.
- **The z-scale is single-sourced** from glass-ui's `--z-*` (style.css ordered-layer contract;
  `--z-behind: -10` the one demo-owned rung). `proof:brittleness` clause 2 (z-scale single-sourced)
  is GREEN.
- **The shared skin partials use physical literals correctly.** `playback-button.css`
  (`height: 2rem`, `padding`) + `tab-trigger.css` (`padding: 0.375rem 0.75rem`) carry raw rem
  values for the BUTTON-SKIN physical dimensions — the correct place for component physical sizes —
  while everything SEMANTIC routes through a token (`--radius-pill`, `--font-serif`, `--accent-red`,
  `--focus-ring-shadow`, `--scale-press`, `--type-body`). These are not "magic numbers" in the
  brittle sense; they are a skin's intrinsic geometry.

There is no `design-idioms.css` magic-number / brittle-calc to fix. The hoist-truly-shared-idioms
work is already DONE (the file holds the full demo-authored vocabulary: `--rainbow-*`, the gold
ramp, `icon-*`, `progress-{rail,ball,dot,bar}`, `status-badge` family, `code-token`,
`labeled-field-grid`, the focus-ring contract, `@keyframes enter`, the idle-fade token). ISOMORPHIC
holds — no new NAMED delta is owed.

---

## 3. S3 / I10 — the decomposition + colocation VERIFY

### 3.1 — The W12 500L gate (`proof:demo-no-oversize`): **born-GREEN** ✓

`find demo -type f \( -name '*.vue' -o -name '*.ts' \) -not -path '*/dist/*'` → **NO demo file
exceeds 500L.** Max demo files:

```
418  demo/spring/useSpringDemo.ts
417  demo/@/components/custom/animation-controls/AnimationControlsGroup.vue
389  demo/easing/useEasingDemo.ts
373  demo/@/components/custom/EasingCurveCanvas.vue
372  demo/sequence/useSequenceDemo.ts
367  demo/@/components/custom/animation-controls/controls/AnimationControls.vue
365  demo/@/components/custom/animation-controls/controls/AnimationControlsControls.vue
358  demo/easing/EasingTarget.vue
```

The 500L clause is the born-GREEN regression guard the contract names — it bites a FUTURE over-split
(an I3 enrichment pushing a Target over 500L without a colocated split). The engine
(`src/animation/*` — engine.ts 1375, animations.ts 870, group.ts 772, sequence.ts 628, spring.ts
491) is FENCED + excluded (inv ζ). I10 is VERIFY, not a split campaign — CONFIRMED: no manufactured
splits owed, no demo file over 500L.

### 3.2 — Colocation coherent ✓

Each scene dir holds its Target + composable + keys (+ geometry/presets where the scene EARNS them):
- `demo/sequence/` → SequenceTarget.vue + useSequenceDemo.ts + sequenceKeys.ts
- `demo/motion-path/` → MotionPathTarget.vue + useMotionPathDemo.ts + **useMotionPathGesture.ts** (the seam-lifted gesture engine, colocated) + motionPathGeometry.ts + motionPathKeys.ts
- `demo/spring/` → SpringTarget.vue + StartingStyleTarget.vue + SpringSidebar.vue + useSpringDemo.ts + useSpringLinearStops.ts + springKeys.ts + springPresets.ts
- `demo/easing/` → EasingTarget.vue + EasingSidebar.vue + useEasingDemo.ts + easingGroups.ts + easingKeys.ts

**The seam's `useDragScrub.ts` is colocated** at the shared `demo/@/composables/` home (the
`@composables` alias target — correct for a cross-scene shared composable). **No orphan composable
in a wrong dir** (every `use*Demo.ts` lives in its scene dir). The seam lane's
`useMotionPathGesture.ts` lift is colocated beside its motion-path Target (per I10 colocation) — NOT
folded into the provide-side `useMotionPathDemo.ts` (which has no access to the Target's live refs;
the seam note §3 documents this faithful "second composable the Target calls WITH its refs" shape).

### 3.3 — Honest delta: the OLDER 350L `proof:decomposition` gate (NOT W12's, pre-existing)

A SEPARATE D-tranche gate `proof:decomposition` enforces a **350L** `.vue` ceiling (with a
`CEILING_OVERRIDE` mechanism, currently EMPTY) and reports THREE `.vue` over 350L:
`AnimationControlsGroup.vue` (417L), `AnimationControls.vue` (367L), `AnimationControlsControls.vue`
(365L). **These are byte-identical at HEAD and worktree — pre-existing, NOT W12-introduced** (the
W12 spec-commit HEAD had them at the same sizes). They are NOT in any scene Lane A/B/C touches.

This is recorded HONESTLY, not papered: the W12 I10 gate is the **500L** `proof:demo-no-oversize`
(which these pass); the 350L `proof:decomposition` red on these three is a pre-existing D-tranche
condition. The spec mandates "NO manufactured splits" — Lane B does NOT split them (they pre-date
W12 and are out of every W12 scene's lane). Disposition for the IMPL lead: either (a) accept the
350L delta as pre-existing-and-out-of-W12-scope, or (b) add `CEILING_OVERRIDE` entries with
cohesion rationales — a decision for H.W8 (the gate-regime wave) or a future decomposition pass,
NOT this corrective wave.

### 3.4 — Headroom budget for Lane A (forward-looking flag)

Lane A's enrichments GROW `SequenceTarget.vue` + `MotionPathTarget.vue` (draggable rows / editable
path) and may grow `useSequenceDemo.ts` (the `at:` re-sort). Current headroom to the 500L W12 gate:

```
SequenceTarget.vue      245L  → 255L headroom   (ample)
MotionPathTarget.vue    157L  → 343L headroom   (ample)
SpringTarget.vue        169L  → 331L headroom   (ample)
EasingTarget.vue        358L  → 142L headroom   (watch — Lane C's egg + frontend pass)
useSequenceDemo.ts      372L  → 128L headroom   (WATCH — the sequence row-drag re-sort grows it)
useSpringDemo.ts        418L  →  82L headroom   (WATCH — least headroom; Lane C's spring egg)
```

**Flag for Lane A/C:** `useSequenceDemo.ts` (128L) and `useSpringDemo.ts` (82L) have the least
headroom to the 500L W12 ceiling. If an enrichment threatens to cross it, the spec's answer is a
COLOCATED split (a sub-composable in the scene dir), NOT trimming the affordance — but neither is
near the line yet at the row-drag / egg scope.

---

## 4. Gate status at lane close (the existing gates Lane B verified GREEN — no regression)

- `npm run check` (tsc --noEmit) — **PASS** (no edits; baseline clean → clean).
- `proof:idioms` — **PASS** (the demo owns its demo-authored idioms; tokenized literals; the
  leaf-tail swept; the utils.css monolith uncaged). This is the substrate `proof:styling-idioms`
  extends.
- `proof:icon-idiom` — **PASS** (all 4 `icon-*` resolve; xs<sm<md<lg differentiate; SVG cascade).
  The W4-owned idiom; NOT re-litigated (per directive).
- `proof:no-dup-utility` — **PASS** (zero demo `.scale-on-hover` re-author; the inv-16 no-legacy
  discipline the `depth-text`/`text-mono-caption` KEEP verdict (§1) is consistent with).
- `proof:decomposition` — 3 pre-existing `.vue` over the 350L D-gate ceiling (§3.3); the W12 500L
  gate is GREEN. Pre-existing, out of W12 scope.

---

## 5. Scene-local flags for Lane A / Lane C (Lane B does NOT edit these `.vue` files)

These are scene-LOCAL style/brittleness observations surfaced during the audit. They live in the
scene-target `.vue` files Lane A/C own; recorded here for them (Lane B's mandate forbids editing them).

### For Lane A (sequence / motion-path / spring scenes)

- **`SpringSidebar.vue:134` residual `:deep(.labeled-field){…}`** — a per-row `:deep(.labeled-field)`
  rule survives (`SpringSidebar.vue:134,141`). The W11 subgrid migration (design-idioms.css
  §LABEL-subgrid) replaced the easing-sidebar's per-row `:deep` with the `.labeled-field-grid`
  subgrid idiom; the spring sidebar still carries a scoped `:deep(.labeled-field)`. NOT brittle
  (single-hop, glass-ui's stable rendered DOM via reka's render-less wrapper) — but a consistency
  tail: if Lane A touches SpringSidebar, consider folding it onto the shared `.labeled-field-grid`
  idiom for the same uniform-label-column the easing sidebar gets. Low priority; consistency, not
  a defect.
- **I11 / S4 is ALREADY DONE by the seam lane (VERIFY GREEN).** `SAMPLE_STEP` is a NAMED const
  (`useMotionPathGesture.ts:68`); the square-viewBox invariant is documented (`:92-96` +
  `motionPathGeometry.ts:113-118`); zero live `.closest(".class")`/`querySelector(".class")`
  walks remain in the scene targets (the EasingTarget comment at `:227-228` confirms the W3.S1
  owned-ref replacement). Lane A's S4 task is VERIFY-then-complete, and the seam already landed it.
- **The pre-existing `useSquareAnimations.ts` RAFPlayback leak** (`proof:brittleness` lone `✗`) —
  a raw `new RAFPlayback()` with no dispose-time `stop()` (the loop leaks past unmount). This is
  the §6 out-of-lane handoff the seam note flagged; it pre-dates W12 and is unmodified by any seam
  work. Lane A/S4 folds it (`onScopeDispose(() => playback.stop())` or ride `useRafLoop`'s
  auto-cleanup). NOT a styling issue; flagged here because it surfaces in the same audit sweep.

### For Lane C (easing scene / J-minimalism)

- **`EasingSidebar.vue:174` `:deep(.css-value-input)` + the `css-value-input`/`value-field` anchors
  DIE with J1/J2.** The J-strip DELETES the `<LabeledInput label="value">` text input
  (`EasingSidebar.vue:41-48`). When Lane C removes it, the `.panel-content :deep(.css-value-input)`
  scoped rule (`:174`) AND the `value-field` markup anchor (`:42`) AND the `input-class="css-value-input"`
  prop (`:47`) all become dead — DELETE them together (no legacy beside the replacement). This is
  the ONLY currently-defined idiom-shaped class that J removes; after J it ceases to be a reference.
- **`.copy-affordance` (EasingSidebar.vue:159-173) re-evaluate under J1.** The scoped
  `.copy-affordance` rule re-seats the value-row CopyButton onto the input's row via a `-1.9rem`
  margin offset (a NAMED delta tied to the value `<Input>`'s h-9 height). J1's note says "relocate
  or drop the trailing `<CopyButton>` … keep a copy affordance only if it earns its place beside
  the dropdown, else drop — the input it served is gone." If Lane C DROPS the copy button, this
  scoped rule + its magic `-1.9rem` offset DELETE with it (the offset was coupled to the now-gone
  input geometry — a brittleness that resolves by deletion, not retuning). If Lane C KEEPS a copy
  affordance beside the dropdown, the `-1.9rem` input-coupled offset must be re-derived against the
  dropdown's geometry (do not carry the stale magic offset forward). Flagged so the J-strip does
  not leave a dangling input-coupled magic number.
- **`EasingTarget.vue` at 358L (142L headroom)** — Lane C's frontend-design pass + the easing egg
  grow it; ample headroom to 500L, but the least of the scene Targets. Watch if the egg is large.

---

## 6. Summary verdict (Lane B)

1. **I12 idiom-membership: REDUCTION branch (FORK-I12).** Zero referenced-but-undefined
   demo-authored idiom-shaped classes beyond the W4-owned `icon-*`. `depth-text` /
   `text-mono-caption` / `btn-interactive` are glass-ui-grace rents that RESOLVE (KEEP per inv-16,
   the `.scale-on-hover` precedent). `proof:styling-idioms` clause (a) → born-GREEN regression
   guard; recorded honestly, not papered. Gate authoring is H.W8's; the recommended shape is the
   `proof:icon-idiom`/`proof:idioms` resolve-or-red plumbing extended to the
   {demo-local ∪ glass-ui ∪ tw-animate-css} set.
2. **Magic-number / brittle-calc cleanup: nothing owed.** The GLOBAL + shared styles are already
   isomorphic + clean (D.W2/E.W3/H.W3 tokenization; `proof:idioms` PASS). ISOMORPHIC holds; no
   NAMED delta owed. **Zero source edits.**
3. **I10 decomposition + colocation: HOLDS.** No demo file > 500L (max 418L); colocation coherent;
   `useDragScrub` at the shared `@composables/` home; `useMotionPathGesture` colocated beside its
   Target; no orphans, no manufactured splits. Honest pre-existing delta: 3 `.vue` over the older
   350L `proof:decomposition` ceiling (out of W12 scope, byte-identical at HEAD).
4. **tsc-clean** (`npm run check` PASS). No engine touched (FENCED). No git commit.

The W1 FSM + W11 DFA + W10 normalization + W9 register all hold (no regression from Lane B — Lane B
made no edits). The scene-local flags (§5) hand off to Lane A/C.
