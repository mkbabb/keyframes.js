# impl-w8r-drift — Lane B: the 4 non-specular drift-REDs (H.W8 gate-regime close)

Lane B owned the 4 drift-REDs `proof:all` surfaced that were NOT the
no-orphan-specular contradiction (Lane A's). Each is FIXED GREEN or HONESTLY
dispositioned (gate reconciled to the SANCTIONED post-W11/W12 reality). NO
papering: every fix keeps its gate FALSIFIABLE (each was re-proven to BITE the
real regression after the reconcile).

`tsc --noEmit`: **0 errors**. All 4 gates GREEN (3 browser gates exercised live
via `KF_PLAYWRIGHT_DIR=…/value.js KF_REQUIRE_BROWSER=1` against the built
`dist/gh-pages`).

---

## (a) proof:decomposition — the 350-vs-500 DRY contradiction → RECONCILED

**Root cause (MEASURED).** Clause 1 swept the DEMO at a D-era 350L `.vue` ceiling
AND the LIBRARY (`src/animation/**`) at 550L. Meanwhile H.W12 authored
`proof:demo-no-oversize` as the demo file-size gate at ≤500L — the H.W12-MEASURED
reality. Both gates are in `proof:all` and sweep the SAME demo files at TWO
different ceilings (350 vs 500). That is the DRY contradiction. The 5 files clause
1 flagged are NOT bloat — they are cohesive SFCs the H tranche legitimately grew
(each a single template/script/style triple; the two largest are scoped-CSS-
dominated, which cannot be externalized without breaking the `scoped` contract):

| file | D-era (905a8c3) | now | H-tranche growth driver |
|---|---|---|---|
| `ControlsPaneWrapper.vue` | 249 | 491 | H.W7 mobile bottom-sheet drawer + F9 idle-fade |
| `AnimationControlsGroup.vue` | 335 | 488 | H.W7 mobile overlay + H.W9/W10 scene-normalize + icons |
| `EasingCurveCanvas.vue` | 351 | 373 | H.W4 canvas-ceiling clamp + container context |
| `AnimationControls.vue` | 254 | 367 | H.W11 control-surface DFA + stage glass-card |
| `AnimationControlsControls.vue` | 330 | 364 | H.W11 + uniform labels + de-nested grown bezier |

**Fix (RECONCILE, not dodge).** Retired ONLY the DEMO file-size half of clause 1;
demo file-size now lives SOLELY in `proof:demo-no-oversize` (the single authority,
≤500L MEASURED). KEPT the LIBRARY ceiling (the unique G.W5 value
`proof:demo-no-oversize` does NOT cover — its sweep root is `demo/`, never
`src/`) + all 9 demo STRUCTURAL clauses (parse-adapter dedup, pure-utils re-home,
async-blob, template-refs, pure-use*, composables-kind, no-dead-export,
dock-barrel-absent, no-reka-reach) which still sweep `demo/` and BITE. Removed the
now-dead `APP`/`ORBITAL`/`EASING_CURVE_CANVAS`/`CEILING`/`CEILING_OVERRIDE`
constants + the per-file demo-tree resolution.

**Falsifiable?** YES — the library ceiling still bites (32 files scanned, 4 named
god-module overrides engine/animations/group/sequence; a new un-exempted 600L
library file reds; the stale-override guard reds a dead exception). All demo
structural clauses unchanged in logic.

---

## (b) proof:timeline-rail-width — 3 stale measurements (a regime shift) → 4/4 GREEN

The rail-width binding itself is PRISTINE (live probe @1440×900: rail 400 ===
#timeline-expanded-target 400 === .controls-content 400, content-box 376,
AnimationControls root 376). The D4 three-regime spread is dead. All 3 REDs were
STALE gate measurements:

1. **root binding floor** — gate floor `rail − 14` (one-side 12px pad). But
   **H.W9.S2/F7** made the shadow-clearance pad SYMMETRIC (`padding-left:12px` +
   `padding-right:12px` = 24px; the cartoon stamp throws bottom-LEFT so the pad
   had to land on BOTH inline edges). border-box keeps both pads inside →
   content-box = rail − 24 = 376. Fixed: floor → `rail − 24`. **A real W9 regime
   shift the H.W3-era gate predated.**
2. **mobile no-cap-leak** — gate required `content < rail − 20` (= <380), assuming
   a margin-inset. But the H.W7 bottom-sheet is TRUE full-bleed: content === the
   390 viewport (edge-to-edge), the design intent. The cap-leak witness is
   `content ≤ viewport AND content < rail` (a 400 leak at a 390 viewport breaks
   both). Fixed.
3. **mobile ribbon card** — gate selected `.glass-card`; glass-ui ~3.5.x's `<Card>`
   renders `.rounded-card` (the H.W2 `glass-card` name is gone) → null. AND the
   slack (48px) omitted the W9 24px content pad → false 68px divergence. Fixed:
   select `.rounded-card, .glass-card`; measure vs the pane CONTENT-box (366),
   slack = the documented RibbonBar pl-4/pr-7 inset (44px). 366 − 322 = 44. ✓

**Falsifiable?** YES — a 768 cap re-introduction breaks the root content-box
equality + upper bound; a 400px mobile leak breaks no-cap-leak; a ribbon detach
breaks the inset.

---

## (c) proof:easing-canvas-bounded — the J grown-bezier vs the W4 ceiling → RECONCILED

The same SHAPE as Lane A's specular contradiction: two gates contradicting after a
SANCTIONED W12 change. **H.W12 J easing-minimalism (S7, the user's explicit round-4
request)** deliberately (J5) DELETED the `<h2>` scene title — and
`proof:easing-sidebar-minimal` (B1) ACTIVELY ASSERTS the `<h2>` is GONE — and (J6)
GREW the canvas (clamp floor 160→260px; the user: "make the bezier bigger"),
overriding the canvas's own 280px default with `clamp(260px,64cqi,360px)`.

Live probe @1440×900 / #/easing sidebar: panel 397.6px, canvas 260×260, ratio
0.654, aspect 1/1, NO `<h2>`, wrapper present, block-size 260px.

Two REDs, both SANCTIONED-J contradictions:

1. **header clearance** required `.easing-editor > h2` → but J5 deleted it AND
   `proof:easing-sidebar-minimal` forbids it. **Direct gate-vs-gate
   contradiction.** RETIRED the touching-header half (no header → no touching
   defect; the no-`<h2>` rule is owned by `proof:easing-sidebar-minimal`); KEPT
   the structural wrapper-presence half (still bites: remove the wrapper → red).
2. **panel ratio ≤ 0.55** — the 0.55 anchor was calibrated on the pre-W4 883px
   panel. J minimalism shrank the panel to ~398px AND J6 grew the canvas to 260px,
   so the ratio rose MECHANICALLY to 0.654 WITHOUT the canvas ballooning (it is
   hard-capped at the J6 ceiling). MEASURE-FIRST reconcile → ≤0.70 (measured 0.654
   + headroom to the J6 360px cap in a 398px panel ≈ 0.69). Also reconciled the
   block-size ceiling 280→360px (the J6 sidebar clamp upper that overrides the
   canvas's own 280 default).

**Falsifiable?** YES — a canvas regrown to the pre-W4 680px in this 398px panel is
ratio 1.7 ≫ 0.70 AND block-size 680 > 360 (both red); container-type back to
'normal' reds; dropping aspect-ratio reds; removing the wrapper reds.

**Verified the partner gate is consistent**: `proof:easing-sidebar-minimal` PASS
(zero `<h2>`); the two easing gates now AGREE (no header) — the contradiction
resolved.

---

## (d) proof:brittleness + proof:demo-usability — mixed (2 real kf defects + 1 gate defect)

### proof:brittleness — 3 REDs, all REAL kf-owned regressions → FIXED GREEN

1. **rafplayback** — `demo/square/useSquareAnimations.ts` owned a raw
   `new RAFPlayback()` but exposed cleanup as a `dispose()` for the HOST
   (`SquareScene`) to wire — the ODD ONE OUT vs its 3 sibling scene composables
   (`useSpringDemo`/`useEasingDemo`/`useSequenceDemo` each self-clean via
   `onScopeDispose(() => playback.stop())`). The cleanup depended on the host
   remembering to call `dispose()` (a real brittleness — a future host that
   forgets leaks the rAF). FIX: added `onScopeDispose(dispose)` in the composable
   (the sibling idiom + the G.W9 §S3 discipline). Idempotent against the host's
   own `onBeforeUnmount(dispose)` — `playback.stop()` + `SpringProgress.dispose()`
   are both double-call safe (verified in `playback.ts`/`spring.ts`).
2. **listener** — H.W5 (db90cbb) ADDED 5 raw `.addEventListener` sites that
   regressed the E.W2 inv-ζ dogfood discipline: `useSphereSpin.ts` (4 canvas-
   pointer listeners) + `AmigaScene.vue` (the `contentvisibilityautostatechange`
   listener). FIX: transposed onto `@vueuse/core`'s `useEventListener` (the
   repo's existing idiom — `useDragCapture`/`useOrbitalPointer`): capture-option
   + stop()-handle set in `useSphereSpin`; the non-bubbling content-visibility
   event bound directly on the `useTemplateRef` target in `AmigaScene` (manual
   `removeEventListener` deleted — vueuse auto-releases on scope dispose).
3. **z-scale** — H.W12 (Lane A sequence enrichment) added `z-index: 1`/`2` on
   `SequenceTarget.vue`'s storyboard siblings — a LOCAL micro-stack inside the
   card's own `position: relative` context, NOT the global `--z-*` app-layer
   scale. Naming them `var(--z-seq-playhead)`/`var(--z-seq-handle)` (scoped tokens
   on `.seq-storyboard`) single-sources even the local stack WITHOUT misusing the
   global rungs (10/20 would mislead). The gate's `var(--z-…)` regex matches.

### proof:demo-usability (X-5 hero gap) — a GATE defect, the demo is CORRECT → FIXED GATE

Live probe: the demo renders "Select an animation" CORRECTLY — "Select" (mie
44.356px) → "an" = +44.3px on the SAME line; "animation" wraps to line 2
(text-wrap:balance). The X-5 margin-inline-end fix (G.W11/F.W16) WORKS. The gate
was BROKEN two ways:

1. **stale selector** — probed `h1 > div:first-child .lift-down`, but the real
   DOM is `h1 > span.sr-only` + `h1 > span[aria-hidden] (.lift-down words)` +
   `h1 > span.depth-text (TypingDots)` — NO `div`. Found 0 spans → minGap
   defaulted to 0 → false RED. Fixed: select the `span[aria-hidden="true"]`
   visual layer.
2. **across-line-break min** — took the raw min `b.left − a.right` across ALL
   adjacent pairs, including the WRAP pair (different lines → −705.8px). Fixed:
   measure SAME-LINE adjacent pairs only (the inter-word collapse X-5 actually
   was about).

**Falsifiable?** YES — re-proven by collapsing the margin-inline-end → same-line
gap 0 → RED → reverted → GREEN (the gate still bites the real X-5 regression).

---

## Verification ledger

```
tsc --noEmit                              0 errors
proof:decomposition          (static)     PASS  (library ceiling + demo structure)
proof:demo-no-oversize       (static)     PASS  (the single demo file-size authority)
proof:brittleness            (static)     PASS  (rafplayback + listener + z-scale all green)
proof:timeline-rail-width    (browser)    PASS  4/4
proof:easing-canvas-bounded  (browser)    PASS  5/5  (reconciled to J6)
proof:easing-sidebar-minimal (browser)    PASS  (partner — no-<h2> consistent)
proof:demo-usability         (browser)    PASS  (hero gap selector fixed)
proof:no-brittle-selector / dragscrub-single / composable-encapsulation /
  dogfood / styling-idioms                PASS  (neighbor gates near my source changes)
test/scene-raf-leak.test.ts               2 passed  (square scene rAF lifecycle)
```

Browser gates exercised with `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`
`KF_REQUIRE_BROWSER=1` `PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright`
against the built `dist/gh-pages` (`npm run gh-pages`).

## Files touched (Lane B only)

- `scripts/proof-decomposition.mjs` — retired demo ceiling sweep (→ demo-no-oversize); kept library + structure
- `scripts/proof-timeline-rail-width.mjs` — symmetric-pad floor; full-bleed cap-leak; rounded-card selector
- `scripts/proof-easing-canvas-bounded.mjs` — ratio 0.55→0.70; block 280→360 (J6); retired touching-header → wrapper-present
- `scripts/proof-demo-usability.mjs` — aria-hidden selector + same-line gap measure
- `demo/square/useSquareAnimations.ts` — `onScopeDispose(dispose)` self-clean
- `demo/amiga/useSphereSpin.ts` — canvas pointer listeners → `useEventListener`
- `demo/app/scenes/AmigaScene.vue` — content-visibility listener → `useEventListener`
- `demo/sequence/SequenceTarget.vue` — local z-index → named `--z-seq-*` tokens

The ENGINE (src/animation) was NOT touched (ALREADY-SOTA + FENCED). inv-16 held
(no glass-ui patch/fork). No git commit (the lead commits).
