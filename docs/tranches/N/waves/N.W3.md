# N.W3 — The two glassy intent-arrows

**Band: IMPL · kf-internal · impl on authorization.**
The two glassy intent-arrows: `.glass-refract` chevron buttons, idle specular shimmer +
directional drift loop, hover swell, press recoil + `decay()` lunge, >=44px hit-targets,
full keyboard operation, throws the ring. LIGHT-barrel-only; `proof:boundary` stays GREEN.
inv-16 holds throughout.

---

## Context — what this wave builds

The arrows are the *intent surface* — they telegraph prev/next, express physics, and
ground the user in the ring's direction of motion. Each arrow is a glass chevron button
flanking the scene name-plate below the ring, carrying the premium `.glass-refract`
convex-lens filter (sanctioned on CONTROL surfaces in contact with the glass plate —
locked decision 6) and a pointer-tracked specular catch-light. Their motion is entirely
engine-dogfooded on the LIGHT barrel: `SpringProgress` for swell/recoil, `decay()` for the
directional lunge, `NumericAnimation` for the idle drift loop — all on `RAFPlayback`.

**Component tree authored in this wave:**

```
demo/@/components/custom/scene-stage/
├── StageArrows.vue            # the two glassy chevron buttons + name-plate row
└── composables/
    └── useArrowMotion.ts      # SpringProgress swell/recoil + decay() lunge + NumericAnimation drift
```

**The four motion beats (from the research synthesis):**

1. **Idle shimmer + directional drift** (`NumericAnimation`, 2.4s ping-pong):
   - The specular `::before` catch-light sweeps once every ~3.2s (driven by the glass-ui
     specular track `--mouse-x/--mouse-y` set via a CSS animation on the host, or a
     `NumericAnimation` that writes `--specular-x` every rAF tick during idle).
   - A ±3px directional drift loop: `NumericAnimation` with keyframes `[0px, +3px, 0px]`
     (right arrow) / `[0px, -3px, 0px]` (left arrow), 2.4s, ping-pong easing, on
     `RAFPlayback`. The drift writes to a CSS custom property `--arrow-drift-x` read by
     `translateX(var(--arrow-drift-x))` on the arrow element (no direct DOM style write in
     the rAF tick — the custom property is the channel).
   - PRM: drift loop is NOT started under `prefers-reduced-motion: reduce`; specular is
     pinned static by glass-ui's `glass-specular-track.css` PRM bracket.

2. **Hover swell** (`SpringProgress`, response 0.4, dampingFraction 0.7, tiny bounce):
   - `pointerenter` → `spring.setTarget(1.12)` (scale target 1.12, glass brightness +18%).
   - `pointerleave` → `spring.setTarget(1.0)`.
   - The spring value drives `scale(var(--arrow-scale))` + a brightness CSS variable
     `--arrow-brightness` (0.88 at rest → 1.06 at hover peak). Drift doubles: drift
     amplitude written from `--arrow-drift-x` ±3px → ±6px at hover, period 1.4s.
   - PRM: `spring.setTarget` call is still made but `SpringProgress.respectReducedMotion`
     snaps the value instantly (no overshoot). Visual: opacity shift only.

3. **Press recoil** (`SpringProgress`, response 0.3, dampingFraction 0.55):
   - `pointerdown` → `spring.setTarget(0.92)` (scale dips to 0.92, the press-scale beat).
   - `pointerup` / `pointercancel` → `spring.setTarget(1.0)` → spring overshoots to ~1.06
     then settles to 1.0 (the recoil-to-overshoot read of "throwing" the ring).
   - PRM: instant scale-to-press / instant scale-back (no spring, no overshoot).

4. **Decay lunge** (`decay()` from the LIGHT barrel, `decay.ts`):
   - On `pointerdown` the arrow lunges 8px in its direction: `decay({ velocity: 8px,
     friction: 0.92 })` (or equivalent `decayRest` parameters) — the lunge decays to rest
     over ~300ms as the ring spring spins. This is written to `--arrow-lunge-x`
     (separate from `--arrow-drift-x`) and the two are summed in the transform:
     `translateX(calc(var(--arrow-drift-x) + var(--arrow-lunge-x)))`.
   - Simultaneously `useRingOrbit.spinTo(prev/next)` is called — the arrow "throws" the ring.
   - PRM: lunge is 0px (no motion); ring spins instantly (spring snaps to target).

**Glass material (locked decision 6):**
- Arrow outer shell: `.glass-floating` (the CONTROL-on-plate rung).
- Arrow inner: `.glass-refract` (`@supports (backdrop-filter: url(#glass-refract))`-gated;
  degrades to plain `backdrop-filter: blur(13px)` on WebKit/Firefox).
- Specular: pointer-tracked `--mouse-x/--mouse-y` written from the arrow's own
  `getBoundingClientRect()` post-transform coords (the 15deg plane tilt from N.W1 would
  break a naive viewport-relative mapping — use the element's own bounding rect).
- `--glass-specular-intensity-hover` raised on `pointerenter` to +18% brightness (the glass
  native specular knob, not a hand-coded gradient).

**a11y:**
- Each arrow is a `<button>` element (or `role="button"`) with `aria-label="Previous scene"`
  / `aria-label="Next scene"`.
- Hit-target: `min-width: 44px; min-height: 44px` (locked decision 7).
- Keyboard: the arrows respond to `ArrowLeft` / `ArrowRight` keyboard events when focus is
  inside the stage (managed by `useStageA11y.ts` in N.W7); press events also call
  `spinTo(prev/next)` and fire the decay lunge.

---

## Scope — the S-clauses

### S1 — StageArrows.vue: two glass chevron buttons rendered, >=44px hit-targets

**Deliverable:** `StageArrows.vue` renders two button elements (prev + next) flanking the
scene name-plate. Each carries `.glass-floating` + `.glass-refract`. Each has
`min-width: 44px; min-height: 44px` and an accessible `aria-label`.

**Falsifiable:** `document.querySelectorAll('.stage-arrow').length === 2`;
`document.querySelector('.stage-arrow.prev').getAttribute('aria-label')` is non-empty;
`getComputedStyle(document.querySelector('.stage-arrow')).minWidth` parses to a value >= 44px;
`.glass-refract` class is present on the arrow element.

### S2 — Idle directional drift loop: NumericAnimation on RAFPlayback

**Deliverable:** `useArrowMotion.ts` creates a `NumericAnimation` for the drift loop (ping-pong,
2.4s period) on `RAFPlayback`. The loop writes `--arrow-drift-x` to the arrow host's inline
style each tick. The loop is NOT started under `prefers-reduced-motion: reduce`.

**Falsifiable:** with PRM OFF, after 200ms with the stage open,
`document.querySelector('.stage-arrow.next').style.getPropertyValue('--arrow-drift-x')`
returns a non-zero string (the drift is active). With PRM ON
(`window.matchMedia('(prefers-reduced-motion: reduce)').matches === true`),
`--arrow-drift-x` remains `'0px'` (the loop was not started).

### S3 — Hover swell: scale 1.0→1.12 via SpringProgress on pointerenter

**Deliverable:** `pointerenter` on either arrow triggers `spring.setTarget(1.12)`;
`pointerleave` triggers `spring.setTarget(1.0)`. The spring value drives `--arrow-scale`
via the rAF tick. `getComputedStyle(arrow).transform` during hover-peak contains a scale
value between 1.0 and 1.13 (the spring overshoots slightly then settles to 1.12).

**Falsifiable:** trigger `pointerenter` on `.stage-arrow.next`; after 300ms,
`document.querySelector('.stage-arrow.next').style.getPropertyValue('--arrow-scale')`
is approximately `1.12` (within ±0.05). Trigger `pointerleave`; after 400ms the value
returns to approximately `1.0`.

### S4 — Press recoil: scale 0.92 dip then overshoot to 1.06 via SpringProgress

**Deliverable:** `pointerdown` on an arrow triggers `spring.setTarget(0.92)`;
`pointerup` triggers `spring.setTarget(1.0)`. With dampingFraction 0.55 the spring
overshoots to ~1.06 before settling. The scale dip + overshoot is the physical "throw"
read.

**Falsifiable:** trigger `pointerdown` on `.stage-arrow.next`; after 50ms
`--arrow-scale` is approximately in the range [0.88, 0.96] (the dip). Trigger `pointerup`;
after 150ms `--arrow-scale` is approximately in the range [1.03, 1.09] (the overshoot);
after 400ms it settles to approximately `1.0`. Under PRM: scale is approximately `1.0`
throughout (instant, no dip, no overshoot).

### S5 — Decay lunge: 8px directional lunge on press, decaying to rest

**Deliverable:** `pointerdown` on the next arrow triggers `decay()` with initial velocity
equivalent to 8px lunge in the +x direction; the result is written to `--arrow-lunge-x`
each tick over ~300ms. The lunge + drift are composed:
`transform: translateX(calc(var(--arrow-drift-x) + var(--arrow-lunge-x)))`.

**Falsifiable:** trigger `pointerdown` on `.stage-arrow.next`; after 20ms,
`document.querySelector('.stage-arrow.next').style.getPropertyValue('--arrow-lunge-x')`
is approximately in the range `[4px, 10px]` (the lunge peak); after 400ms it returns to
approximately `0px` (decayed to rest). Under PRM: lunge is 0px.

### S6 — Arrow press throws the ring: spinTo(prev/next) called on pointerdown

**Deliverable:** pressing the next arrow calls `useRingOrbit.spinTo(currentIndex + 1)`
(with wrapping); pressing the prev arrow calls `spinTo(currentIndex - 1)`. The ring
begins spinning while the lunge decays — the arrow "throws" the ring.

**Falsifiable:** with the stage open and scene index 0 at front, press `.stage-arrow.next`;
after 700ms the ring has settled with scene index 1 at front (the name-plate reflects the
next scene name). `spinTo` is called once per press event (debounced — rapid successive
presses advance the ring step by step, not by accumulating one-at-a-time).

### S7 — Glass-refract on arrows (not on ring cards): @supports-gated

**Deliverable:** `.glass-refract` is applied ONLY to `.stage-arrow` elements and the front
selection plate. It is NOT applied to the orbiting `.ring-item` cards. The `@supports`
guard is present.

**Falsifiable:** `document.querySelectorAll('.ring-item.glass-refract').length === 0`
(no ring card carries refract); `document.querySelectorAll('.stage-arrow.glass-refract').length === 2`
(both arrows carry refract). `getComputedStyle(document.querySelector('.stage-arrow'))
.backdropFilter` contains `url(#glass-refract)` on Chromium; on Safari it contains only
`blur(...)` (the @supports degradation is in effect).

### S8 — Specular coords from post-transform rect (not viewport-naive)

**Deliverable:** the pointer-tracked specular `--mouse-x/--mouse-y` is computed from
`arrow.getBoundingClientRect()` relative to the element's own bounding box, not from
the raw `clientX/clientY` relative to the viewport. This correctly handles the 15deg tilt
from N.W1.

**Falsifiable:** `useArrowMotion.ts` contains a `getBoundingClientRect()` call on the arrow
element to derive `--mouse-x` / `--mouse-y` percentages; it does NOT compute them as
`(event.clientX / window.innerWidth * 100)%` (the naive mapping that breaks under tilt).

---

## Born-RED gate — `proof:n-arrows`

**Gate name:** `proof:n-arrows` (NEW — does not exist today). Two arms:

**(a) Arrow browser arm (playwright-core).**
```
# open demo, trigger dock Select, wait for stage open
page.evaluate(() =>
  document.querySelectorAll('.stage-arrow').length
) → 2

# verify glass-refract on arrows (not on ring cards)
page.evaluate(() =>
  document.querySelectorAll('.ring-item.glass-refract').length
) → 0
page.evaluate(() =>
  document.querySelectorAll('.stage-arrow.glass-refract').length
) → 2

# verify >=44px hit-targets
page.evaluate(() => {
  const arrow = document.querySelector('.stage-arrow');
  const rect = arrow.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}) → true

# press next arrow, verify ring advances
const initialName = await page.evaluate(() =>
  document.querySelector('.stage-nameplate').textContent.trim()
);
await page.click('.stage-arrow.next');
await page.waitForTimeout(750);
const newName = await page.evaluate(() =>
  document.querySelector('.stage-nameplate').textContent.trim()
);
assert(initialName !== newName, 'arrow press did not advance the ring');
```
BITE: reds if arrows are absent, lack glass-refract, have sub-44px hit-targets, or do not
throw the ring on press.

**(b) PRM static arm (playwright-core with PRM emulated).**
```
# emulate prefers-reduced-motion: reduce
await page.emulateMedia({ reducedMotion: 'reduce' });
# open stage
await page.click('.dock-scene-select');
await page.waitForTimeout(200);

# drift should be static (--arrow-drift-x stays 0px)
await page.waitForTimeout(500);
const drift = await page.evaluate(() =>
  document.querySelector('.stage-arrow.next')
    ?.style.getPropertyValue('--arrow-drift-x')
);
assert(drift === '' || drift === '0px', 'drift loop running under PRM');

# press recoil should be instant (scale stays near 1.0)
await page.click('.stage-arrow.next');
await page.waitForTimeout(50);
const scale = await page.evaluate(() =>
  document.querySelector('.stage-arrow.next')
    ?.style.getPropertyValue('--arrow-scale')
);
assert(parseFloat(scale ?? '1') > 0.98, 'press dip active under PRM');
```
BITE: reds if the drift loop runs under PRM (motion on PRM violation), or if the press
dip is active under PRM (the recoil spring ignores `respectReducedMotion`).

**Witness input that REDs on today's tree (pre-cure):**

Today's tree: `StageArrows.vue` does not exist. Therefore:
- Arm (a): `document.querySelectorAll('.stage-arrow').length` → 0 → **RED**.
- Arm (b): vacuously passes (no arrows = no motion under PRM either), but becomes the
  regression guard once arrows are implemented.

**Greens on the cure:** implementing `StageArrows.vue` + `useArrowMotion.ts` with the four
motion beats + PRM branches + >=44px hit-targets closes both arms.

**Implementation locus:** `scripts/proof-n-arrows.mjs` — playwright-core script with both
arms. Added to `package.json` under `proof:n-arrows` and appended to `proof:all`.

---

## Deps

- **N.W2 closed** (`proof:n-carousel-ring` GREEN): `StageArrows.vue` calls
  `useRingOrbit.spinTo()` on press — the ring engine composable must exist.
- **N.W1 closed** (`proof:n-stage-shell` GREEN): arrows mount inside `SceneStage.vue`.
- **glass-ui `~4.0.0`** (consumed published): `.glass-floating` + `.glass-refract` +
  `glass-specular-track.css` PRM bracket. The `.glass-refract` `@supports` gate already
  ships in glass-ui's dist; no new glass-ui publish required.
- **LIGHT barrel** (`decay`, `SpringProgress`, `NumericAnimation`, `RAFPlayback`): all
  already in the published kf dist at current version. `proof:boundary` stays GREEN as
  long as `useArrowMotion.ts` imports only light exports.

---

## Bite

| S-clause | Regression it catches |
|---|---|
| S1 (glass buttons, >=44px) | Arrows absent or hit-targets below 44px — a11y failure; keyboard/touch users cannot reliably press the arrows. |
| S2 (drift on RAFPlayback) | Hand-rolled `setInterval` for drift (inv ζ violation) or drift running under PRM (motion on PRM violation). |
| S3 (hover swell via spring) | Scale jump on hover (spring not used) or swell absent (flat arrow with no affordance). |
| S4 (press recoil + overshoot) | No scale dip (press not registered) or no overshoot (dampingFraction too high — the "throwing" read is lost). |
| S5 (decay lunge) | Lunge absent (arrow presses feel disconnected from ring motion); or `decay()` import replaced with hand-rolled exponential (LIGHT barrel violated). |
| S6 (throws the ring) | Arrow press does not advance the ring — the entire arrow-as-ring-control contract is broken. |
| S7 (glass-refract only on arrows) | `.glass-refract` on ring cards — GPU-expensive displacement map applied to 7 orbiting elements; PLATE-on-PLATE muddiness. |
| S8 (specular from post-transform rect) | Naive viewport-relative specular mapping — specular hotspot moves incorrectly on the tilted stage, breaking the premium glass read. |

N.W3's born-RED gate (`proof:n-arrows`) bites on the four real failure modes: arrows absent
(arm a), glass-refract on the wrong elements (arm a), sub-44px hit-targets (arm a), and
drift motion under PRM (arm b). The PRM arm is explicit because the motion on PRM violation
is a gate-blindspot: it silently passes a source-shape gate (the code is there) but only
reveals itself in the running demo under `prefers-reduced-motion` — exactly the
interaction/state axis inv-M-observable-truth requires a runtime gate for.
