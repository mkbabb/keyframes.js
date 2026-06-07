---
"@mkbabb/keyframes.js": minor
---

Tranche G — the published F sibling-wins CONSUMED on the re-pin spine; two narrow
additive engine surfaces; the post-F idiom-drift swept; the gated decisions taken.

**The spine — the dep RE-PIN (the headline, 8 audit lanes converged).** kf 4.0.0
shipped consuming STALE siblings (`value.js ^0.10.0`, `parse-that ^0.8.2`, a
`glass-ui file:../glass-ui` LINK) while the published `0.11.x` / `0.9.0` / `3.3.0`
carried the F hand-off wins kf DROVE but never consumed — the −94% computed-endpoint
memo, the color-channel plan, the dispatch LUT, the C5 length-unit correctness, the
parse-that soundness. The whole F.W6 architecture was load-bearing on "kf consumes it
on re-pin"; the re-pin never happened. G lands it through the single
`lerpValue → iv._lerp` seam (`engine.ts:731`) with ZERO library source edit, gated by
a new `proof:deps-current` (installed ≥ floor; no `file:`/`link:`/`git:` protocol;
parse-that realm convergence surfaced fail-explicit) + a `proof:repin-witness` proving
the computed endpoint resolves O(frames)→O(1) on kf's path. The re-pin consumed
`value.js 0.11.1` — the fixed sibling that dropped a broken `development` export
condition `0.11.0` shipped (it broke every Vite consumer in dev/test; the upstream fix
keyframes drove).

**New public API (additive — the minor).**
- `fromDrawSVG(target, opts?)` + the `DrawSVG` factory — a CSS-native SVG
  line-drawing animation: one `getTotalLength()` read, `stroke-dasharray = L`,
  `stroke-dashoffset` swept `L → 0`, WAAPI-eligible, zero value.js dependency
  (mirrors `motion-path.ts`). `from`/`to` take a percent string or a 0..1 fraction
  (fail-explicit on a number outside `[0, 1]`).
- `get finished()` on `Animation` / `CSSKeyframesAnimation` / `AnimationGroup` /
  `Sequence` — the genre's idiomatic "await this animation" front door over the play
  promise the engine already holds (resolves once at end; pre-resolved when settled).
- `Animation.adoptCompiled(source)` — a first-class verb for adopting another
  animation's compiled state atomically (re-binds the live-options reference,
  recomputes the stable key-set); the `compiler` field tightens to read-only. The
  demo's three-field cross-boundary reach-in collapses to one call.

**Correctness.** The dead `add`/`weighted` blend leaf is fixed (the guard tested a
bare `ValueUnit` but the leaf is a `ValueUnit[]` — both modes silently collapsed to
`replace`; now an element-wise in-place blend, zero-alloc intact). `serializeEasing`
throws fail-explicit on a custom-closure easing with no CSS twin instead of silently
emitting `"linear"` and losing the curve.

**Demo + housekeeping (non-breaking).** D.W5 closed — the dock leverages the published
glass-ui 3.3.0 (`TopDock → ChromeDock`, the pass-through barrel deleted, the
`:always-expanded` occlusion mask removed, occlusion-free without the crutch); the
post-F scene idiom-drift swept (`.status-badge`/`.code-token`/`.progress-ball` promoted
to the one idiom layer); a HIGH rAF-leak fixed (scene preview loops wired to a dead
`<KeepAlive>`-only hook now stop on swap); the orbital container collapsed to a native
`rotate3d` output (two-way v-model preserved); the Discrete route, hero LCP word-spacing
and a duplicate Play aria-label fixed; the lone outlier store brought into the singleton
idiom; the library line-ceiling gated DECISION taken (not a reflexive split). The test
suite gained the interpolate-anything / color-fidelity / computed-resolution / round-trip
corpora; the CI a workflow-hygiene gate + 12 new `proof:*` gates.

Version owner: Mike Babb.
