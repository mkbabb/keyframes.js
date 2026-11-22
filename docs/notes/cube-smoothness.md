# The cube's smoothness: measured, causes, and the cure

Wheel- and drag-driven spin of the cube must be very fast and smooth: 1:1 under the finger, inertia on release, critically damped smoothing of wheel deltas, no stepped wheel jumps, interruptible. This note measures every way of moving the die on the live site, names the causes in `demo/scenes/cube/orbital-drag/`, and sets the cure and its gates. Code references are to master `c7bb653b`.

## Lane

- **Surfaces:**
  - the live demo scene, `https://keyframes.babb.dev/#/cube`, which plays at load;
  - the live embed slice, `/embed/#/cube?…&transport=host&stage=fill`, framed by its allow-listed host page and paused.

  The live bundle carries coalesced and predicted pointer input and the 24 ms wheel follower.
- **Browser:**
  - Playwright 1.61 headless shell, Chromium 149, `--use-angle=metal --enable-gpu --ignore-gpu-blocklist`.
  - The renderer read in the page was ANGLE Metal on Apple silicon (a GPU-composited lane).
  - One browser per run, a context per cell.
- **Cells:**
  - desk: 1440×900 at 2x, mouse and wheel; budget 16.7 ms;
  - phone: 390×844 at 3x, CDP multi-touch;
  - phone4x: the same with the CPU throttled 4x; budget 33 ms.
- **Input:**
  - CDP sends on an absolute schedule. Each event is stamped with a digitiser-like timestamp: an even cadence, ±15 % jitter, monotone.
  - Trackpad streams are shaped like macOS's: a ramp, a hold, then the OS's momentum tail. Deltas are integer and fractional, at 120, 90 and 60 Hz, plus a slow stream.
  - Mouse: five notches 70 ms apart, then one more.
  - Ctrl-wheel pinch and Shift-wheel pan.
  - Mouse drag held at the end, mouse flick, and Shift-drag pan.
  - Touch: drag held at the end, flick, vertical swipe, and a two-finger pinch with pan.
- **Recorded, in the die's document:**
  - each frame's start, and the end of its main-thread work (a message posted from rAF runs after the frame's style, layout and paint);
  - every orbit transform write;
  - every event's created and handled times, and Chromium's predicted points;
  - long tasks and long animation frames.

## Measured

### Frames: none dropped

- **Every cell, every gesture:** frame interval median 8.3 ms (120 Hz), p95 ≤ 9.4 ms, max ≤ 10.8 ms. No frames over 16.7 ms on the desk, none over 33 ms on the throttled phone.
- **Main-thread work per frame:** 0.6-2.4 ms median on the desk; 2.1-5.7 ms median and 9.0 ms max at 4x. No long tasks and no long animation frames.

**The roughness is not dropped frames. It is how the die's motion is computed from the hand.**

### Wheel and trackpad (desk)

- **Ripple** is the RMS of each frame's turn rate against its centred 7-frame mean, over the moving frames: 0.10 means ±10 %.
- **Stall** is a frame that does not move while its neighbours do.
- **Lag** is the time shift that best lays the rendered turn on the hand's own.

| gesture | slice: handled after | slice: lag | slice: ripple | slice: stalls | slice: settle after last event | demo: handled / lag / ripple / settle |
|---|---|---|---|---|---|---|
| trackpad 120 Hz | 13.3 ms | 27 ms | 0.082 | 0 | 52 ms | 20.2 / 35 / 0.093 / 66 |
| trackpad 90 Hz, diagonal | 13.5 | 29 | 0.147 | 0 | 47 | 20.7 / 37 / 0.156 / 59 |
| trackpad 60 Hz | 13.3 | 26 | **0.228** | 0 | 49 | 22.0 / 35 / 0.255 / 65 |
| trackpad slow | 13.5 | 27 | 0.122 | 0 | 66 | 21.1 / 35 / 0.116 / 78 |
| mouse: 5 notches + 1 | 13.7 | **117** | **0.314** | **4 (one per notch)** | **527** | 20.6 / 115 / 0.331 / 535 |
| Ctrl-wheel pinch | 12.2 | – | 0.123 | 0 | – | 21.8 / – / 0.129 / – |
| Shift-wheel pan | 12.9 | – | **0.40** | **9** | – | 20.0 / – / 0.33 / – |

### The hand (pointer)

| cell | gesture | die ahead of the delivered point (median / max) | at release | at a stop |
|---|---|---|---|---|
| slice, desk | drag | 12.9 px / 37 px | – | steps back 0.46° |
| slice, desk | flick | **66 px / 99 px (34°)** | **turns back 17.8° in one frame**, then coasts | – |
| slice, phone | flick | 24 px / 37 px | **turns back 19.0°** | – |
| slice, phone | vertical swipe | 10.6 px / 18 px | turns back 4.3° | – |
| slice, phone4x | flick | 24 px / 37 px | turns back 8.6°; one frame with no travel | – |
| demo, desk | flick | 55 px / 83 px | **turns back 27.0°** | – |
| demo, phone4x | drag | – | – | steps back 3.35° |

- **The coast itself is right:** it carries 0.98 of the hand's rate, decays monotonically, and rests. The faults are the frames on either side of the release.
- **Two-finger pinch and pan** track the fingers 1:1.
- **A swipe on the die** never scrolled the page.

### Chromium's predictions, as recorded

`getPredictedEvents()` returned points up to 17 ms ahead on touch and up to 25 ms ahead on a mouse. The die shows the last one.

### Every frame around a flick's release

On the desk, the die has turned back by +14 ms, holds, and the coast carries it on from +30 ms. On the phone, it hardly moves for about 30 ms after a release that came at about 10° a frame.

## Causes, ranked by how often a hand meets them

1. **A throw snaps back, holds, then coasts.**
   - `useOrbitalGesture.ts:580-590` shows each move at the *last* predicted point (17-25 ms ahead), so the die runs ahead of the hand.
   - At `pointerup`, `:624` lands the real point, and the whole lead comes back in one frame (−4° to −27°).
   - The coast is created with no clock. `OrbitalDrag.vue:240` → `useOrbitalInertia.ts:232,238` give `t0 = −1`, and `:130` stamps the channel on its first frame, which samples elapsed 0 and travels nothing.
   - Forward, back, hold, forward: this is Chromium, on the desk and on Android. Safari has no `getPredictedEvents`, so it gets only the hold.
2. **The drag leads the finger.** The cause is the same as cause 1: 4-13 px median and up to 99 px. At a stop the prediction overshoots the slowing hand, and `unwindPrediction` (`:600-611`) snaps back by 0.3-3.4°.
3. **A mouse notch starts at full speed, stalls a frame, and creeps.**
   - `:826-834` → `useOrbitalInertia.glide` (`:272-283`) runs an exponential glide at `GLIDE_FRICTION` 9/s (`inertiaDecay.ts:63`). The first frame is the fastest (an impulse), the glide drains for about 0.5 s, and the turn trails the wheel by 115 ms.
   - Each glide is a new channel with no clock, so every notch's first frame travels nothing. The arrow keys ride the same glide.
4. **Shift + scroll pan is not smoothed.** `:705-733` and `:810-816` sum the pan per frame and apply it whole: ripple 0.33-0.40 and 3-9 stalls per stream.
5. **The trackpad follower is first order.**
   - `WHEEL_SMOOTH_MS` 24 (`:120`) in `flushWheel` (`:723-757`) passes each event's step straight into the die's speed.
   - Ripple is 0.08-0.15 at 90-120 Hz and 0.23-0.26 for a 60 Hz stream. A stream's first frames kick (46-49 % of the largest frame's step).
6. **Safari's pinch and twist, and a host's relayed gesture, are applied raw.** `gestureApply` (`:859-868`) and `relayGesture` (`:898-909`) write each event straight into the pose, so every event is a step. This is read from the code; the lane is Chromium.
7. **The browser's delivery floor (not a fault).**
   - A wheel event reaches its handler 12-14 ms after its hardware time on the paused slice, and 20-22 ms on the demo. The demo's die plays at load and draws every frame, so rAF-aligned input waits for the next frame.
   - The cure must add no lag beyond this.
8. **Main-thread headroom (no drop measured).**
   - Each frame, `writeModel` (`OrbitalDrag.vue:129-147`) folds an Euler readout, replaces `model.quaternion` (so the component's own watch at `:437` runs every frame), emits three events, and has Vue re-render the container style (`:115`).
   - During pan and zoom, `EmbedCube.vue` sets `--paper-*` on the stage root (`:22`, `:126-131`), restyling the subtree and repainting the paper.
   - A pinch at 4x costs 5.7 ms a frame on the slice against 3.2 ms on the demo.

## The cure (the cube slice only)

**K1. One critically damped follower for every stepped input (causes 3-6).**

- **New pure module:** `orbital-drag/follower.ts`. Each channel holds a position `x` and a speed `v`, following a target `T` that the input moves. Each frame takes the exact step of x'' = −2ω·x' − ω²·(x − T):
  `e = x − T; E = e^(−ωΔt); x ← T + (e + (v + ωe)Δt)·E; v ← (v − (v + ωe)·ωΔt)·E`.
- **Its properties:**
  - no overshoot, from rest or when the target stops;
  - it lands exactly on the target;
  - it is frame-rate independent;
  - its speed is continuous, so there is no kick on an event or at a start.
- **Channels:** the turn (a screen-frame rotation vector, applied as the per-frame difference of `x`), the zoom (ln s) and the pan (px).
- **Stiffness:**
  - **ω = 90/s** for trackpad scroll, pinch, twist and Shift-scroll pan (lag 2/ω = 22 ms, under today's 24).
  - **ω = 30/s** for a mouse notch and an arrow key.
- **Replay on the recorded live input:** the same events and frames, with today's code replayed first; that replay reproduces the live series.

| input | ripple, today → K1 | first-frame kick | settle | lag |
|---|---|---|---|---|
| trackpad 120 Hz | 0.121 → 0.113 | 0.46 → 0.31 | 65 → 49 ms | −3 ms |
| trackpad 90 Hz | 0.211 → 0.174 | – | – | – |
| trackpad 60 Hz | 0.222 → **0.133** | – | – | −5 ms |
| mouse notches | – | – | **551 → 292 ms** | 111 → 83 ms |

  The notches also lose every stalled frame, and the first one starts soft.
- **Edits:**
  - `useOrbitalGesture.ts` replaces `owedTurn`, `zoomLn`, `panPx` and the first-order step with the follower.
  - A notch adds to the step channel instead of gliding.
  - `gestureApply` and `relayGesture` set the targets instead of writing the pose.
  - `dropOwed` sets each target to its `x` and its `v` to 0.
  - The clock restarts when the loop idles, so a stream's first frame is never stepped by the 100 ms clamp at `:726`.
- **Reduced motion:** the same follower, because smoothing the hand is not decoration; notches run at 3× ω.

**K2. The hand at the frame, never ahead of it, and a release that does not snap (causes 1, 2).**

- **Resample the hand** at the frame's own time, `t* = rAF now − 4 ms`.
  - Interpolate between the coalesced samples on either side of `t*`.
  - Past the newest sample, extend it by the predicted point nearest to `t*`, never more than one frame ahead and never against the motion.
  - The lead falls to at most one frame of travel, and every frame gets a sample at the same phase.
- **Release:**
  - No snap to the real point.
  - The coast starts from the pose shown, with its clock at the release's own `event.timeStamp`, so the first frame after release already moves.
  - The release rate stays the least-squares fit over 80 ms of real samples.
- **Stop:** once no move has come for 1.5 frames, the lead goes back through the turn follower.

**K3. Every channel starts at its input's own time (causes 1, 3).** `inertia.start(release, event.timeStamp)`, so no channel spends its first frame at elapsed 0.

**K4. One write per frame (cause 8).**

- `tick` writes the container's `style.transform` directly.
- The readout, the emits and the version tick happen at rest.
- The paper and its axes become one layer moved by `transform: translate() scale()`, drawn larger than the stage, instead of custom properties on the stage root.

## Gates

The gates are born red, in `test/e2e/cube-gestures.spec.mjs`, and each one reads every frame (today's 1:1 test waits three frames after each move). Each runs on the slice and the demo, by touch and by mouse.

- **G1, release:** between the last drag frame and the coast, no frame turns against the throw by more than 0.2°, and none travels 0.
- **G2, lead:** during a steady drag, every frame stays within one frame of the hand's travel of the delivered point.
- **G3, stop:** once the hand stops, no frame steps back by more than 0.1°.
- **G4, notch:** for five notches at 70 ms:
  - no zero-travel frame;
  - the first frame's turn at most 40 % of the largest frame's;
  - rest within 350 ms of the last notch.
- **G5, Shift-scroll pan:** no stalled frame while the stream runs, and ripple ≤ 0.15.
- **G6, trackpad streams:** ripple ≤ 0.15 at 60 Hz, the sum lands exactly, and the lag stays at most today's.
- **G7, frames:**
  - none over 16.7 ms on the desk;
  - none over 33 ms on the phone at 4x;
  - main-thread work no more than today's.
- **Kept:** the existing gates stay: 1:1 within 2 px once settled; carry 0.8-1.25; monotone decay; the interrupt; isomorphism; and no stray face.

## Not measured

- Real Safari, on macOS and iOS.
- Real trackpad momentum timing (synthesised here).
- A 60 Hz display. The follower is clocked by rAF Δt, so its curve is the same there; in the model, a 90 Hz stream into 60 Hz frames goes from ripple 0.221 to 0.160.
