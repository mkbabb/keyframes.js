# I.W3 — IMPL record (the amiga subject=pivot=framing geometry transposition)

**Status:** LANDED · gate `proof:amiga-subject-is-pivot` GREEN (live, against the BUILT
`dist/gh-pages/`) · `tsc` 0 · branch `tranche-i-dev`.

## What landed (file:line)

- **S1 — unify SUBJECT = ORBIT PIVOT = FRAMING.** `demo/amiga/useAmigaAnimations.ts` —
  `SPHERE_HOME = 0` (the centred home: room origin = box centre = camera look-at), exported
  as the ONE home; the three boing-bounce animations swing symmetrically about it
  (`SPHERE_HOME ± BOUNCE`, BOUNCE = BOX_SIZE/2 − 1), retiring the corner extents. `demo/app/
  scenes/AmigaScene.vue` — the sphere is seated at `(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME)` =
  (0,0,0) (was the far corner `(-5,-5,-5)`); `controls.target.copy(sphereMesh.position);
  controls.update()` makes the orbit pivot TRACK the subject (was the default disjoint
  origin). The cursor now lands on the sphere → the W5-intended drag-to-spin→`decay()`-glide
  (`useSphereSpin.ts`, untouched — it was only aimed at an unreachable target) is reachable.
- **S2 — drop `content-visibility:auto` from the live WebGL root.** `AmigaScene.vue` — the
  `.scene-root { content-visibility: auto }` scoped style is REMOVED; occlusion-pausing is
  driven entirely off an `IntersectionObserver` (`useIntersectionObserver(sceneRootEl, …,
  { rootMargin: "200px" })`) composed with the unchanged `useSceneVisibilityPause` — ONE owner
  of "is this surface visible," not a CSS token racing the GPU present loop. The per-frame
  ReadPixels GPU stall + the hidden-subtree spam are gone.

## The gate (proof:amiga-subject-is-pivot) — live GREEN

Born-RED verified against the pre-fix build (centre drag re-projected the whole room —
`peripheryMAD 101.9 >> centreMAD 30.4` — + 152 content-visibility verbose warns). GREEN on fix:
- **(a)** a centre-canvas drag is a LOCAL subject change — `centreMAD 8.7 >> peripheryMAD 0.0`
  (the centred sphere spins; the checker room does NOT tumble — the inverse of the HEAD
  whole-room re-projection). ✓
- **(b)** an empty-space (corner) drag orbits ABOUT the subject — the sphere stays framed. ✓
- **(c)** ZERO WebGL ReadPixels/GPU-stall console lines over a ≥2s present loop + the DOM
  invariant that the amiga WebGL canvas sheds content-visibility (no hidden/auto ancestor). ✓

## Gate-precision note (the named-benign exclusion)

The amiga RC-2 oracle is the WebGL ReadPixels/GPU-stall signature (which the Monaco editor
NEVER emits) + the WebGL-canvas-not-in-content-visibility-hidden DOM invariant. The bare
"Rendering was performed in a subtree hidden by content-visibility" console line is SHARED with
the intentional Monaco keyframes-pane `content-visibility:hidden` B-2 cache (a different,
non-WebGL subtree) — so it is a NAMED-BENIGN exclusion, not the oracle. This keeps the gate
biting the real amiga defect (if content-visibility:auto returns to the WebGL root, both the
ReadPixels stalls AND the DOM invariant red) without false-failing on an unrelated optimization.
**Carried to I.W7 S2a:** the structured error-budget allowlist scopes the PROMOTED-zero
content-visibility/ReadPixels promotion to the WebGL context; the Monaco content-visibility:hidden
cache is a named-benign exclusion.
