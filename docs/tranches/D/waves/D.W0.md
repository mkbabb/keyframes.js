# D.W0 — Audit-fold + the path forward

**Phase**: DEVELOPMENT (RUN now). **Ships**: no engine or demo source — the
5-lane audit evidence on disk, the complete deferred ledger, the full
A→B→C→constellation→D prompt-recap, and this plan rendered into the tranche
docs (`D.md`, `PROGRESS.md`, `waves/D.W0–W6.md`). W0 is the dev/impl boundary:
it closes D's development half; D.W1–W6 are authored-now-run-later and open
only on explicit user authorization, gated on keyframes' own green CI (inv-27).

W0 is the forcing function that turns D from "more polish on C" into the
**refinement + transposition + termination** tranche. C closed honestly (inv ε
— B's seven overclaims each corrected by a re-runnable instrument) and unforked
the φ-ladder display tier (inv ζ — the demo dogfoods its own engine, π at full).
C left a *small, well-named* residual set; a deep 5-lane audit finds three
bodies of genuinely-warranted work no prior tranche owned, plus one item that
*just became partly unblockable* (the local dock-rename — glass-ui's dock
correctness base + touch-gate B′ fix landed, ships 3.3.0; a role-typed base
component remains gated on glass-ui AU.W8). W0 measures all of it with file:line
evidence so every D close-condition is concrete + falsifiable, not assumed.

## Items

### W0.1 — The frontend (decomposition · KISS) audit lane

**WHAT**: a frontend-design inventory of the demo's structure, written to
`audit/frontend-findings.md`, file:line-grounded with a SHIP/BOOK disposition
and a re-runnable `wc`/`grep` instrument per finding. The spine:

- **Five oversized units** (verified by `wc -l` over the demo tree):
  `animation-controls/AnimationControlsGroup.vue` 552L,
  `animation-controls/keyframes/KeyframesEditor.vue` 487L,
  `animation-controls/timeline/KeyframeTimeline.vue` 441L,
  `animation-controls/keyframes/composables/useKeyframesEditor.ts` 383L,
  `animation-controls/timeline/composables/useTimeline.ts` 251L.
- **The duplicated parse adapter** — `parseCSSAnimationKeyframes`
  (`KeyframesStringControls.vue:55`) and `parseAnimationCSS`
  (`useKeyframesEditor.ts:27`) are two bodies of the SAME
  `parseCSSStylesheet → resolveKeyframes → extractAnimationOptions → {keyframes,
  options, values}` adapter (the second carries an extra anonymous-wrapper
  branch, but the AST-to-shape core is identical). One real duplication, not a
  grep artifact.
- **The mis-filed pure utils** — `timeline/composables/{timelineEngine,
  snapshotCapture,flattenVars}.ts` are plain functions (zero `ref(`/`reactive`/
  `watch`/`onMounted` — verified), mis-located under `composables/` when they
  belong under `timeline/utils/`.
- **The in-component rAF/timeout blobs** — `useTimeline.ts:206`
  (`requestAnimationFrame`), `KeyframesStringControls.vue:120` (`setTimeout`),
  `usePaneHover.ts:36` (`setTimeout`) — hand-rolled async primitives a vueuse
  composable (`useRafFn`/`useTimeoutFn`) already is.

**WHY**: the demo is well-built (100% `<script setup>`, idiomatic stores, good
colocation) but *un-refined* — five units oversized at the wrong seam, a parse
adapter duplicated, pure utils mis-filed, async primitives hand-rolled. The
inventory is the artefact; the fixes route to D.W1. Without the file:line
grounding the decomposition would be assertion — the audit is what lets D.W1's
`proof:decomposition` name a concrete, falsifiable ceiling + a single-definition
grep.

### W0.2 — The styling (design-language) audit lane

**WHAT**: a frontend-design inventory of the demo against the glass-ui design
language, written to `audit/styling-findings.md`. The headline is a **real
defect**: design idioms *referenced demo-wide but owned demo-nowhere* — they
resolve TODAY only through the transitive `@mkbabb/glass-ui/styles` +
`tw-animate-css` import (an ungated, undocumented cross-repo RENT), with zero
demo-local definition; NOT undefined, NOT a blank render —

- `--rainbow-*` (6 colours, used in two SVG gradients), resolves via glass-ui;
- `--color-gold` (a token reference inside an arbitrary value), resolves via glass-ui;
- `.scale-on-hover` (used **13×**), defined only via glass-ui (no demo-local definition);
- `@keyframes enter` (referenced at `utils.css:129`), IS shipped by
  `tw-animate-css` via the private `--tw-enter-*` contract — the defect is
  provenance/private-variable coupling (an ungated rent), not a missing animation.

Plus: component-specific rules trapped in the global `utils.css` monolith
(`.tab-trigger-*`, `.btn-playback*`, `.demo-*`, `.ppmycota-*`, the
`[data-state=active][role=tabpanel]` rule); arbitrary-value tailwind
(`text-[0.65rem]`, `h-[30vh]`, `text-[var(--color-gold)]`) + `!`-overrides
(EasingSelect `!flex`/`![-webkit-line-clamp]`, AnimationControlsGroup
`!border-transparent`); and the φ-ladder **leaf-tail F6** (89
`text-sm`/`text-xs`/`text-base` body sites — the chronic A→B→C, the display
tier already closed in C).

**WHY**: the styling layer has a genuine defect (the ungated idiom rent — the
idioms paint correctly today but flatten silently if a sibling renames/drops a
token), a caged monolith (component rules in the global sheet), and the chronic
leaf-tail. The inventory is the artefact; the fixes route to D.W2. The
idiom-rent finding is what makes D.W2's `proof:idioms` gate a rent-closer (assert
each idiom resolves from the demo's OWN built output, not merely the merged
cascade), not a cosmetic sweep.

### W0.3 — The brittleness audit lane

**WHAT**: a robustness inventory written to `audit/brittleness-findings.md`:
the fragile DOM selectors (a global `document.querySelectorAll("pre")`,
`.closest(".easing-target")`, `.querySelector(".track-container")`, the
`[data-sonner-toaster]` coupling); the undocumented z-index scale (raw
`z-popover/dock/controls/content/modal/bar` magnitudes with no ordered token
set); the reactivity gaps (the `useAnimationSync` rAF bridge ungated, the
`useKeyframesEditor` array-watch flush, the `useScrollFade` listener
re-attach); the work-area `calc()` chain + the missing `@supports` guards for
`env()`/`-webkit-mask-image`/`dvh`; the viewport-trap audit; and the two
W0-booked engine residuals C's W4 slipped (`_snapSettled` asymmetry,
`leaves.ts | any`).

**WHY**: brittle DOM coupling + ungated reactivity are the demo's silent
fragility — they pass today but break under refactor or unsupported-feature
contexts. The inventory routes to D.W3, whose `proof:brittleness` gate greps
for the owned-ref forms (zero DOM-walks in reactive code) + probes the
`@supports` fallbacks.

### W0.4 — The engine (gestalt-tail) audit lane

**WHAT**: an architecture inventory written to `audit/engine-transposition.md` — the
engine's transposition has a gestalt tail C's W4 did not reach:

- **D-1 [PERF]** the AnimationGroup compositor still allocates per-frame
  (`groupedValues` re-allocated each tick) — the lone hot loop violating the
  class's own zero-alloc discipline;
- **D-2 [SIMPLICITY]** `tick` still means three things at the *driver* layer
  (the dt-advance, the absolute-clock advance, the loop-step);
- **D-3 [PERF]** the computed-unit DOM round-trip re-serializes every frame
  (no cached key-set, every key re-written);
- **D-4 [ELEGANCE]** `Animation` is a ~1019-line god-object
  (`src/animation/engine.ts:126-1145`, in a 1277-line file) at the wrong seam
  (the `FrameCompiler` + `AnimationOptions` carrier tangled with the playback
  state-machine);
- **D-5** the deprecated path-compat re-exports linger
  (`src/animation/utils.ts:34-42`, block reiterated at `:159-161`;
  `src/animation/format.ts:12-16`); `AnimationGroup.pause` is a toggle, not honest
  `pause`/`resume`/`toggle`;
- the two W0-booked residuals C's W4 slipped: `_snapSettled` asymmetry,
  `leaves.ts | any`.

**WHY**: C's W4 unified the steppers + the loop core, but inv ε applied to C's
own close finds real architectural transpositions left. The inventory routes to
D.W4 (engine `src/`), whose `proof:zero-alloc` gate measures the alloc-free loop
(the NEW `bench/zero-alloc.bench.ts` heap-delta/allocation-count bench,
bite-proven by `KF_ALLOC_INJECT=group`), accompanied by the single `tick` meaning
(grep `advanceTo`), the changed-keys-only round-trip (write-count probe), the
`Animation` split (`npm test` green at the new seam), and the no-legacy grep over
the deprecated re-exports. The mandate: architectural transpositions are
necessary + desirable, NO legacy, net-deletion.

### W0.5 — The deferred ledger + the prompt-recap (zero perpetual punts)

**WHAT**: every keyframes-owned deferral classified with a D wave, trigger, and
owner (`audit/deferred-ledger.md`), and the full prompt recap
(`audit/prompt-recap.md`). The ledger uses four tags — **KFD** (fold into D) ·
**OUT** (sibling-booked) · **ARCH** (permanent KILL) · **CLOSED** (done in C,
verify only) — and carries a real disposition per item (the table in this
spec's § Deferred ledger). The recap maps every A→B→C→constellation→D request
to ADDRESSED or a named D-SCOPE fold, with zero drops; the two historical
drifts (B's falsely-closed LoAF; B's advisory inv δ) are recorded as
*corrected-in-C*, not dropped.

**WHY**: the user's directive was P-invariant-28 — no perpetual punts; D is the
terminal home or the KILL. The ledger is that fold: every item has a real owner
and a falsifiable trigger, and the three chronics (the φ-ladder leaf-tail
A→B→C; the square-scene occlusion; the dock-rename, *now unblocked*) close in D
rather than slip a fourth cycle. The recap is the provable-coverage artefact
the user's "recap all our prompts" mandate requires.

## Deferred ledger (every item — tagged, terminated)

**KFD = fold into D · OUT = sibling-booked · ARCH = permanent KILL · CLOSED =
done in C (verify only)**

| Item | Tag | D-disposition |
|---|---|---|
| Square-scene mobile-composition occlusion | **KFD** | D.W5 — the terminal fix (the C allowance's stale-check fires when closed; inv δ HARD on square/mobile). |
| φ-ladder **leaf-tail F6** (89 body sites) — CHRONIC A→B→C | **KFD** | D.W2 — the terminal migration (the display tier closed in C; sweep returns 0 raw body rungs). |
| Consumer **dock-rename** + `dock/index.ts` deletion — was gated, NOW PARTLY UNBLOCKED | **KFD** | D.W5 — the dock correctness base + touch-gate B′ landed (ships 3.3.0), unblocking the LOCAL renames + mask removal; the `<Role>Dock` base-component leverage gates on glass-ui AU.W8 (named cross-session edge). |
| `always-expanded="isMobile"` double-tap mask | **KFD** | D.W5 — removed on the glass-ui 3.3.0 pin (B′ fix published). |
| Engine `_snapSettled` asymmetry | **KFD** | D.W3 — the snap-symmetry test (D-6). |
| `leaves.ts \| any` + deprecated re-exports (`src/animation/utils.ts:34-42`, `src/animation/format.ts:12-16`) — W0-slipped | **KFD** | D.W4 — re-export retirement + `\| any` tightened. |
| bucket-glassui (ASK-3 `LabeledField` a11y) | **OUT** | glass-ui owns; D keeps the named lighthouse allowance (no vendor band-aid). |
| VAL-9 `--spring-*` codegen (ASK-2) | **OUT** | glass-ui owns; D keeps `springLinearStops()` export stable (the enabler). |
| Dock double-tap (ASK-1) | **OUT — RESOLVED** | Fixed by instrument in glass-ui (B′ `f0b0ffb`); D removes the mask (W5). |
| glass-ui foundational slices (reka-Tabs rail, strict-templates, the `<Role>Dock` role-vocabulary + base-rename machinery) | **OUT** | AU's own un-landed AU.W8 arm; D depends only on the *landed correctness base* + the published primitives, not the rail or a role-typed base component (BOOK until a 2nd consumer). |
| ScrollTimeline-native · Worker/OffscreenCanvas · dev.sh/deploy.sh | **ARCH** | Permanent KILL (recorded; do not re-litigate). |
| LoAF/>50ms-trace · EasingTarget leak · dead scene CSS · cartoon-shadow | **CLOSED** | Done in C; D verifies no regression. |

## The prompt recap (all addressed)

Every request across A → B → C → the constellation drive → this D ask resolves
**ADDRESSED** or has a named **D-SCOPE** fold (the full table is authored into
`audit/prompt-recap.md`). No drops. The two historical drifts (B's
falsely-closed LoAF; B's advisory inv δ) were *corrected* in C, not dropped.
The publish leg (the stacked B/C/D changesets) is user-domain by design — D
names the version owner at W6 (the only un-orphaned-by-design loose end).

## Hard gate

W0 closes when the development half of D is complete on disk **and re-runnable**:

1. the **5-lane audit** is on disk (`audit/frontend-findings.md`,
   `audit/styling-findings.md`, `audit/brittleness-findings.md`,
   `audit/engine-transposition.md`, `audit/deferred-ledger.md` +
   `audit/prompt-recap.md`), each finding carrying a file:line citation and a
   `wc`/`grep` instrument that re-executes from the repo;
2. the **deferred ledger** is complete (every item tagged `KFD`/`OUT`/`ARCH`/
   `CLOSED` with a real disposition; **zero un-dispositioned punts** —
   **P-invariant-28**);
3. the **prompt-recap** confirms every A→B→C→constellation→D request ADDRESSED
   or D-SCOPE-folded;
4. every **W1–W6 spec** carries its own falsifiable hard gate (a re-runnable
   `proof:*` instrument, not a narration).

**The falsifiable instrument** — the audit evidence is on disk + re-runnable:
each lane's headline figure is a re-executable command, not a claim.
Re-running them reproduces the audit (or reddens it if the tree drifts):

```sh
# decomposition (W0.1): the five oversized units exceed their ceiling
wc -l demo/@/components/custom/animation-controls/AnimationControlsGroup.vue \
      demo/@/components/custom/animation-controls/keyframes/KeyframesEditor.vue \
      demo/@/components/custom/animation-controls/timeline/KeyframeTimeline.vue \
      demo/@/components/custom/animation-controls/keyframes/composables/useKeyframesEditor.ts \
      demo/@/components/custom/animation-controls/timeline/composables/useTimeline.ts
#   552 / 487 / 441 / 383 / 251 — each over the D.W1 ceiling

# parse duplication (W0.1): TWO bodies of the same adapter
grep -rn 'parseCSSStylesheet' demo/@/components/custom/animation-controls/keyframes/
#   KeyframesStringControls.vue:56 + composables/useKeyframesEditor.ts:28 — two definitions

# the demo-local-undefined styling idiom (W0.2): @keyframes enter referenced in demo, defined only in tw-animate-css
grep -rn '@keyframes enter\|animation:.*enter\|enter ' demo/@/styles/utils.css   # a USE at :129
grep -rn '@keyframes enter' demo/@/styles/                                       # zero DEMO-LOCAL definitions (the idiom still resolves via node_modules/tw-animate-css)

# the deferred ledger (W0.5): zero un-dispositioned punts
grep -c '| \*\*KFD\*\* \|| \*\*OUT\*\* \|| \*\*ARCH\*\* \|| \*\*CLOSED\*\*' \
      docs/tranches/D/audit/deferred-ledger.md   # == the ledger's row count
```

Every deferral carries a disposition — **P-invariant-28** holds: no perpetual
punts. **Status: MET** when the five audit files + the two ledgers are on disk
and the four instruments above re-execute from the repo. W0 is the dev/impl
boundary — D.W1 through D.W6 are authored and gated, and open only on explicit
user authorization, on keyframes' own green CI.

## Folds

W0 retires (by id, into the items above): the frontend decomposition inventory
(W0.1 → D.W1); the styling design-language inventory incl. the ungated idiom
rent (W0.2 → D.W2); the brittleness inventory (W0.3 → D.W3); the engine
gestalt-tail inventory (W0.4 → D.W4); the deferred-ledger's `KFD`/`OUT`/`ARCH`/
`CLOSED` calls + the prompt-recap (W0.5 → the per-wave folds).

## Design decisions

1. **W0 is RUN, not authored-now-run-later.** Like C.W0, D.W0's work happens
   NOW — the 5-lane audit, the ledger, the recap, this plan → the tranche docs.
   It produces no engine or demo source, so it honors "tranche development
   only"; it IS the development half.
2. **The audit is file:line-grounded + re-runnable, not narrated.** Each
   lane's headline figure is a re-executable `wc`/`grep`, so the audit is an
   instrument (the W0 hard gate above), not an assertion — matching C's
   verified-not-asserted discipline.
3. **P-invariant-28 is the spine.** No item is named-forward to a fifth
   tranche: every keyframes-owned deferral is `KFD` (a D wave), `OUT` (a sibling
   owner), or `ARCH` (a permanent KILL). The three chronics close in D.
4. **inv-16 holds.** D writes only keyframes.js. The glass-ui dock base +
   touch-gate + `LabeledField` a11y are OUTWARD; D consumes the *published*
   glass-ui 3.3.0, never AT's branch.
