# K-audit — U-K4: the amiga scene "floats around and flashes constantly"

**Lane:** live-amiga-breakage (DOCS ONLY — no source/test/gate/CI edits)
**Date:** 2026-06-11
**Tree:** `tranche-j-dev` == master @ `4f1fc4c` (Tranche J closed; 4.2.0 published)
**Probe substrate:** the BUILT dist `dist/gh-pages` (assets stamped Jun 11 23:34; `AmigaScene-BbqBQp2b.js`), served via `scripts/lib/demo-driver.mjs withPage`, chromium from `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`. Throwaway probes lived under `docs/tranches/K/audit/_probe-amiga*.mjs` and were removed after capture (not gates). Screenshots under `screenshots-k/`.

---

## TL;DR

U-K4 is **three compounding defects**, not one:

| # | Symptom | Root | Severity |
|---|---------|------|----------|
| K4-A | "**flashes** constantly" | `material.color = setHSL(colorT,…)` multiplied INTO the checkerboard `map` texture — the sphere desaturates/resaturates as `colorT` cycles | P1 |
| K4-B | "**floats around**" | the bounce envelope traverses **69% of the canvas width / 37% of the height** (measured) — the D3 `refreshBounceFraming` fit only makes the sphere *kiss* the frame edge, so by design it swings nearly the whole stage and momentarily leaves it | P1 |
| K4-C | "**constantly**" (no gesture) | the scene-machine **persists `perScene.amiga.playing:true` to localStorage**; a COLD RELOAD with NO gesture resumes the float+flash on its own | P1 (the "constantly" multiplier) |

The orchestrator's two suspects are **FALSIFIED**:
- **J.W6 PF-1 named imports** — KILLED/REVERTED at W6 (`docs/tranches/J/waves/J.W6-impl.md:444` "**KILL** (clause e … delta = 0 … REVERTED)"). Confirmed in tree: `AmigaScene.vue:24` still reads `import * as THREE from "three"`. Not the cause.
- **J.W7a D2/D3 stage changes** — D2 added a rounded-card frame + 1px hairline (cosmetic); D3 added the camera reframe + `refreshBounceFraming`. The float **predates and survives** these; D3's fit actually *reduces* the swing (it just doesn't reduce it nearly enough — K4-B). Not the originating cause, though D3 is the seam where the envelope clamp lives.
- **`useSphereSpin` / requestAnimationFrame contention** — NOT the cause. The two-rAF-loop design (the scene present loop `AmigaScene.vue:267` + the group's own `RAFPlayback` `src/animation/group.ts:74`) is the SAME coupling the Boing egg rides and works; `tickGlide()` only moves the mesh after a flick-release (seeded only `if (Math.abs(v) > REST_SPEED)`, `useSphereSpin.ts:142-145`). At rest both probes show the sphere dead-still.

---

## Reproduction (observed)

### COLD at-rest = stable (rules out an idle leak)
Direct nav `#/amiga`, NO gesture, 30 frames center-pixel readPixels:
```
COLD /#/amiga (NO gesture): 30 frames, 2 distinct center pixels
  first 6 center px: [[0,0,0,0],[189,87,87,255],[189,87,87,255], …]   (frame-0 = clear, then steady red sphere)
scene-machine: {"amiga":{"playing":false,"started":false,"animations":{}}}
```
`screenshots-k/amiga-burst-0.png` ≡ `amiga-burst-3.png` (pixel-identical, sphere centred & static). So at rest there is NO float — the float is play-driven, and "constantly" comes from K4-C below.

### ON PLAY = the float
After `openControlsPanel` + rainbow group-play, sampling the sphere-colored centroid over 240 frames (~4s):
```
ENVELOPE+FLASH: floatXpct:69  floatYpct:37  offFrameFrames:1
                hueRange:0.001  satRange:0.216  lightRange:0.062
scene-machine after play: {"amiga":{"playing":true,"started":true,…}}
```
- **floatXpct 69 / floatYpct 37** — the sphere centroid sweeps 69% of the canvas width and 37% of the height. `screenshots-k/amiga-play-0.png` (sphere high-right, frame centre) vs `amiga-play-3.png` (sphere dropped LOW-LEFT, into the floor plane) shows the swing visually.
- **offFrameFrames:1** — the sphere left the sampled grid entirely for ≥1 frame ("floats away").

### COLD RELOAD after one play = the "constantly" (no gesture)
Play once → reload cold → sample 60 frames with NO interaction:
```
after play:                {"amiga":{"playing":true,"started":true,…}}
COLD RELOAD (no gesture) sphere travel: {"travelXpct":60,"travelYpct":36,"frames":59}
scene-machine after reload: {"amiga":{"playing":true,"started":true,…}}
```
The persisted `playing:true` resumes the bounce on load — the sphere floats across 60%/36% of the frame with **zero user input**. This is the user's "constantly."

---

## Roots (file:line)

### K4-A — the flash: color multiplied into the texture
`demo/amiga/utils.ts:35-37` builds the sphere material with a checkerboard **map**:
```ts
const material = new THREE.MeshLambertMaterial({
    map: texture,                       // utils.ts:36
});
```
`demo/amiga/useAmigaAnimations.ts:54-58` then OVERWRITES `material.color` every frame the `rotations` animation ticks:
```ts
if (vars.colorT) {
    const colorT = Array.isArray(raw) ? raw[0].value : raw;
    const color = new THREE.Color().setHSL(colorT, 1, 0.95);   // L57
    sphereMesh.material.color = color;                         // L58
}
```
In three.js a `MeshLambertMaterial` with a `.map` renders **map × color**. With `setHSL(colorT, 1, 0.95)` the multiplier is a near-white-but-saturated tint that swings as `colorT` ∈ [0,1] cycles (the `rotations` 20 s loop, `useAmigaAnimations.ts:62-86`) — so the checkerboard visibly **desaturates / resaturates** (measured satRange 0.216 over 4 s). `colorT` appears ONLY in `rotations` (`grep colorT` → L54/74/82), so the flash is bound to that one animation. Intent was almost certainly a *standalone* hue cycle, not a texture multiply; the fix lives in this material/transform seam (e.g. drop `.color` multiply, or use `emissive`/a dedicated tint, or remove the hue cycle from the default group).

### K4-B — the float: the bounce envelope is ~the whole stage
`demo/amiga/useAmigaAnimations.ts:24` `BOUNCE = BOX_SIZE/2 - 1 = 5`. The four bounce animations swing the sphere `SPHERE_HOME ± BOUNCE` on X (10 s, L88-102), Y (0.7 s, L104-124), Z (20 s, L126-140). `AmigaScene.vue:67-95 refreshBounceFraming()` scales that amplitude into the frustum, but with `BOUNCE_FIT_MARGIN = 0.95` (`AmigaScene.vue:62`) the fit deliberately makes "**the sphere edge kiss, never cross, the frame**" (comment L62) — i.e. the *design target* is a sphere that swings to the very frame edges. Measured result: 69%-width / 37%-height travel, with momentary frame-exit. For a "stage protagonist" (the D3 intent: "the sphere stays the centred home/look-at/orbit pivot") a near-full-frame swing reads as chaotic floating. The seam: shrink the authored `BOUNCE` and/or lower `BOUNCE_FIT_MARGIN` so the rest pose dominates and the bounce is a tasteful excursion — this is a design-amplitude call, not a math bug (the fit math is correct for its stated, over-ambitious target).

### K4-C — "constantly": playing-state persistence resumes the bounce on cold load
`demo/@/components/custom/animation-controls/stores/useSceneMachine.ts:45` `SCENE_MACHINE_PERSIST_KEY = "keyframes-js-scene-machine"`, persisted via `useStorage` (L58) including `perScene` (L51, L70). `sceneMachine.ts:67-68` keeps `perScene[scene]` (the `PlaybackSnapshot` with `playing:boolean`, L52) in the persisted context. On re-entry, "**Targets attached — restore; the snapshot's `playing` decides (S4)**" (`sceneMachine.ts:123`) → `createGroupAdapter().restore()` (`scenePlaybackAdapters.ts`) re-seats the group clock and the group's `RAFPlayback` loop resumes. So **one** play persists `playing:true` and **every** subsequent cold visit floats+flashes on its own. (Verified: probe4 reload with no gesture → travel 60/36, machine still `playing:true`.) Whether a non-home group scene SHOULD auto-resume its bounce on a cold load with no gesture is the design question; the easing scene's `autoPlays` path is separate (`useSceneMachineApp.ts:121-131`).

---

## Why the GATES never caught it (the blind-spot)
`proof:amiga-subject-is-pivot` (J.W6, `scripts/proof-amiga-subject-is-pivot.mjs`) asserts a **centre-drag moves the SUBJECT** (the spin gesture) — it exercises `useSphereSpin`, NOT the bounce-group play, and never reads the swing envelope as a fraction of frame, never reads the colorT material tint, and never reloads to re-trigger the persisted `playing:true`. `proof:live-session` B1 measures the CUBE draw loop after rainbow-play; the amiga equivalent of "is the protagonist *contained and calm*" is unexercised. The appearance/amplitude/persisted-state axes are all gate blind-spots (the MEMORY "Gate blind-spots — green source-shape gates miss appearance/interaction/state" note, witnessed again here).

---

## §FOLD

| Finding | Severity | The seam | Suggested wave-class |
|---------|----------|----------|----------------------|
| K4-A — `material.color = setHSL(colorT)` multiplied into the checkerboard `map` → the sphere desaturates/resaturates = "flashes" (satRange 0.216/4s) | **P1** | `demo/amiga/useAmigaAnimations.ts:54-58` (transform) × `demo/amiga/utils.ts:35-37` (map material) | impl — amiga appearance: drop the `.color` multiply (use `emissive`/dedicated tint, or remove the hue cycle from the default group) |
| K4-B — bounce envelope sweeps **69%w / 37%h** of the frame (momentary frame-exit); `BOUNCE_FIT_MARGIN 0.95` targets edge-kiss by design → "floats around" | **P1** | `demo/amiga/useAmigaAnimations.ts:24` (`BOUNCE`), `AmigaScene.vue:62` (`BOUNCE_FIT_MARGIN`), `AmigaScene.vue:67-95` (`refreshBounceFraming`) | impl — amiga amplitude: shrink authored BOUNCE / lower fit margin so the rest pose dominates and the bounce is a tasteful excursion |
| K4-C — scene-machine persists `perScene.amiga.playing:true`; cold reload resumes the float+flash with NO gesture (travel 60/36) → "constantly" | **P1** | `useSceneMachine.ts:45/51/58/70`, `sceneMachine.ts:67-68/123`, `scenePlaybackAdapters.ts createGroupAdapter().restore` | impl/design — playback-persistence policy: decide whether a group scene auto-resumes on a cold load; if so, K4-A/B make even the resumed state unacceptable |
| K4-D (gate gap) — no gate exercises the amiga bounce-group play envelope/appearance/persisted-resume; `proof:amiga-subject-is-pivot` only tests the spin-drag | **P1** | `scripts/proof-amiga-subject-is-pivot.mjs` (scope), the missing "protagonist contained & calm + colorT tint + cold-resume" oracle | gate — born-RED amiga appearance/amplitude/persistence oracle (must FAIL on the current tree) |
| Suspect falsified — PF-1 named imports reverted; the two-rAF-loop coupling + `tickGlide` are NOT the cause | (note) | `AmigaScene.vue:24` (still `import * as THREE`), `J.W6-impl.md:444`; `useSphereSpin.ts:142-145` | — (redirect the impl lane away from these) |

**Cross-lane:** K4-C touches the SAME playback-persistence machinery any group scene (cube/square) restores through — coordinate the policy fix with the cold-path lane (the orchestrator's ground-truth (a): hero rainbow-play → subjects freeze while the playhead advances). The float/flash here and the freeze there are two faces of the restore/playback wiring; fix as ONE playback-policy wave-class where possible.
