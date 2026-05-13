# Changelog

## v2.1.0 — 2026-05-13 (AB.W6 settle)

Settles the long-standing `w.w2.1-keyframes-prebuild` operator WIP branch
into master and ships the new scrubbing + zero-allocation API.

### New public API

- `AnimationGroup.render()` — re-composes the current frame using every
  child's current `t`. Single-target groups go through the composed
  transform; multi-target groups apply each child's interpolated vars
  directly to its own targets. Replaces the previously private
  `renderPauseFrame()` and is the entry point for scenarios that mutate
  child state outside the rAF loop (scrubbing, state restore, pause
  snapshots).
- `AnimationGroup.setChildTime(nameOrAnim, t)` — sets a single child's
  `t` + `pausedTime` without touching its siblings. Chainable; call
  `render()` afterwards to reflect the change visually.
- `Animation.interpFrames(t, transformFrames, out?)` — optional `out`
  buffer enables zero-allocation steady-state playback. When passed,
  the buffer's stale keys are cleared deterministically before new
  values are written, so callers can reuse a single long-lived object
  per child.

### Internal refactors

- `AnimationGroup.transformFramesGrouped()` now writes each child's
  interpolated vars directly into the entry's `values` buffer via the
  new `interpFrames(out)` path. Drops the per-entry `Object.assign` and
  the per-frame allocation. The previous `done || paused` early-return
  path is gone — `interpFrames` clears stale keys, so scrubbed children
  always reflect fresh state.
- `AnimationGroup.tick()` simplified — the comment around the
  `pausedTime === 0` snapshot tick is now self-evident from the code.
- `AnimationGroup` pause path calls public `render()` instead of the
  private `renderPauseFrame()`.

### Bug fixes (demo)

- `useAnimationGroupPlayback.sliderUpdate` no longer drags sibling
  animations along normalized progress when one child is scrubbed.
  The previous bespoke loop has been replaced with
  `getAnimationGroup().setChildTime(animation, t).render()`.
- `useAnimationGroupPlayback.notifyPlayStateChange` now derives
  `isStarted` from intent (`playing || group.started`) so callers that
  just asked the group to start get the correct state before the first
  rAF tick flips `group.started`.
- `useTransformState` matrix-editor watcher early-returns when the
  group has started, eliminating mid-play `matrix3dEnd` rebuilds that
  caused visible jitter on the orbiting cube.

### Tests

- `test/useAnimationGroupPlayback.test.ts` rewritten to assert the new
  contract: scrubbing one animation moves only its own `t`; siblings
  remain at their pre-scrub `t` and render at that position.
- Full suite: 218 tests passing.

### Operator-WIP settlement (AB.W6)

This release also clears the 16 dirty entries on the
`w.w2.1-keyframes-prebuild` WIP branch (9 untracked operator UI
captures deleted; 5 modified source files finished + committed; 2
modified dist files dropped + rebuilt from source). The WIP branch is
fast-forward-merged into master.

The underlying `b788205` commit ("adopt glass-ui v1.0 subpath surface")
is now locked into master, so downstream consumers see the demo's
subpath import canon.

## v2.0.0 — 2025-09-09

Drops `value.js` re-exports — consumers must now import primitives from
`@mkbabb/value.js` directly.
