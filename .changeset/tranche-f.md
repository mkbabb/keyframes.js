---
"@mkbabb/keyframes.js": minor
---

Tranche F — the single largest measured per-frame win landed, the parsing
consumption-seam made whole, the orchestration tier finished + dogfooded, and the
verification seam closed. F is net-new and NARROW: ~90% of the post-E stack is
ALREADY-SOTA and left untouched.

This release ships atop the stacked **Tranche B (`tranche-b-3-1-0`) + Tranche C
(`tranche-c`) + Tranche D (`tranche-d`) + Tranche E (`tranche-e`)** changesets —
all cut, never published — so one provenance-signed publish ships the whole
B+C+D+E+F provenance (the combined SemVer tier is **major**, driven by C/D; F's own
contribution is a non-breaking **minor**).

**F's published-library surface:**

- **New public API (additive):** `MotionPath` / `fromMotionPath` (F.W12 — CSS-native
  motion along an author `offset-path`, animating `offset-distance` on the
  compositor thread, zero value.js dependency; rides `loadAnimationEngine`); the
  completed `Sequence` transport (F.W9 — `pause`/`resume`/`reverse`/`timeScale`/
  `progress`/`repeat`/`yoyo` via scalar-field arithmetic over the existing `seek`,
  C⁰-continuous and seek↔play pixel-identical); the preset library reachable on the
  heavy surface (F.W11 — `(await loadAnimationEngine()).presets.fadeIn(…)`);
  `animate({ path })` front-door dispatch (F.W12 S2).
- **Engine perf (F.W4, isomorphic / pixel-identical):** the per-frame interpolation
  buffers are cleared with a stable-key null-fill instead of a `delete`-loop, so the
  reused `out`/`_grouped`/`entry.values` buffers stay in V8 fast-properties mode
  (`%HasFastProperties === true`) — threaded-buffer playback ~3.0× (K=2) / 2.8× (K=12)
  faster; a single-active-frame alias returns `flatVars` directly on the no-buffer
  path. The `drive` loop-core reschedules synchronously (F.W5 — no per-frame
  microtask hop for `SmoothProgress`/`SpringProgress`/`Draggable`).
- **Parsing correctness (F.W7/F.W8, strictly-more-correct, byte-stable for the common
  case):** per-keyframe `animation-timing-function` now round-trips on
  re-serialize (it was read but silently dropped — a CSS-Animations-L1 violation),
  including the engine's own spring `linear()`; `animation-composition` is captured;
  a sibling style rule's `animation` shorthand is applied as the option base
  (constructor-explicit overriding); the bare-keyframes detection decides on the
  parsed AST (a leading `/* @keyframes */` comment no longer defeats it).
- **Cohesion (F.W11, byte-identical):** the 4× open-coded clamp converged onto
  `internal/leaves.clamp`; `group.ts`'s `lerp` retargeted to value.js (the light leaf's
  consumer set is purely light again).

The **demo** (F.W10 dogfood · F.W13 `text-wrap: pretty` · F.W14 undo/redo · F.W15
a11y + shortcut discovery · F.W16 the rail/ball idiom + hero a11y) and the
**verification seam** (F.W1 the benches fixed + the missing ones authored, F.W2 every
`proof:*` gate wired into CI, F.W3 `proof:orchestration` + the public-API tests) land
in the demo + CI gates and do not change the published API.

The computed-unit endpoint cache (F.W6) and the parser hardenings ship in the
companion **value.js** and **parse-that** hand-offs (kf consumes them unchanged
through the `lerpValue → iv._lerp` seam on re-pin).

**The version owner** for the combined B+C+D+E+F publish is **Mike Babb**
(`mike@babb.dev`), who finalizes the SemVer tier and drives `changeset version` → tag
→ `release.yml`. The publish leg stays user-domain, confirm-first.
