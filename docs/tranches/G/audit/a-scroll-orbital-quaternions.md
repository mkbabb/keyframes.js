# a-scroll-orbital-quaternions — the scroll-driven facilities + the orbital-drag quaternion path, vs the 2026 SOTA

> Supplemental Tranche-G lane (branch `tranche-g-dev`). A NEW dimension on top of the
> authored 16-lane assay + `G.md` + the gap-scorecard. TRANCHE DEVELOPMENT — research +
> audit ONLY. ZERO source/test/CI/demo edits. Two subjects: **(A) SCROLLING**
> (`timeline.ts` / `waapi.ts` scroll bridge) and **(B) ORBITAL DRAG + QUATERNIONS** (the
> `demo/.../orbital-drag` rotation core + the cube matrix path). Every claim cites
> `file:line`. Dispositions tagged per finding; a falsifiable instrument named per SHIP.

## TL;DR

- **The scroll architecture is ALREADY-SOTA and the ARCH-kill is *correct*.** The JS
  `Timeline`/`ScrollTimeline`/`ManualTimeline` sampler (`timeline.ts:35-196`) + the
  additive native-bridge (`timeline.ts:227-259`, `waapi.ts:440-473`) is the right two-tier
  posture and G should touch NONE of the mechanism. Two **honest-doc / completeness** gaps
  only: **(S-1)** the "Chromium-only / not-Baseline" rationale in three doc blocks is
  **stale** — Safari 18 shipped scroll-driven animations (Sept 2024); the *kill still holds*
  (Firefox is still flagged, so it is not Baseline) but the *stated reason* is now wrong and
  G's re-pin moment is the place to correct it. **(S-2)** the native bridge models scroll
  `axis`/`source`/`inset` but **not `view()` named ranges** (`entry`/`exit`/`contain`/`cover`
  via `animation-range`) — the single biggest 2026 scroll-SOTA feature the bridge cannot
  express. Disposition: **RECORD** (S-1 doc-truth, byte-cheap) + **BOOK** (S-2, real
  additive surface, needs a shaped decision — it is NOT a defect, it is an un-modelled axis).

- **The orbital rotation IS quaternion-native and gimbal-free *internally* — but the
  OUTPUT round-trips quaternion → Euler → re-apply, the one documented quaternion foot-gun.**
  The source of truth is a persistent `quat` accumulated by delta-quaternion multiply
  (`OrbitalDrag.vue:65,122-131`) — correct, gimbal-lock-free, SOTA. But `containerStyle`
  emits `rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)` (`OrbitalDrag.vue:58`) built
  from a hand-rolled `quaternionToEulerDegrees` (`:74-106`), and the v-model emits the same
  Euler triple (`:111-119`). This is **lossy and gimbal-prone on the *consumption* leg** even
  though the *accumulation* leg is clean — and it is gratuitous, because the engine's own
  interpolation already consumes axis-angle `rotate3d` (`useCubeAnimations.ts:95-96`).
  Disposition: **SHIP-in-G** (the `rotate3d` output collapse — a correctness + simplicity
  transposition with zero new dependency), with the **v-model contract** the one design call
  to take. Inertia decay (the F.W10 `decay()` swap) is **ALREADY-SOTA — LEAVE**.

---

## SUBJECT A — SCROLLING

### The architecture, verified (`file:line`-grounded)

The scroll story is genuinely two-tier and the seam is clean:

1. **The JS sampler** — `Timeline` (abstract, `timeline.ts:35-151`) runs the canonical
   pipeline `sample() → clamp → easing → boundary-snap → smoothing → progress`
   (`applyPipeline` `:79-91`, `_advance` `:99-110`). `ScrollTimeline` (`:162-179`) samples
   `getScrollY()/maxScroll` with injectable `getScrollY`/`getViewportHeight` callbacks
   (`:170-172`) — testable without a DOM, and the **only** driver that works over a non-DOM
   target. `ManualTimeline` (`:181-196`) defaults smoothing off (`:185`). Caller owns the
   rAF loop (no rAF ownership in the class — confirmed: `tick()`/`tickDt()` are pull-driven,
   `:117-124`).

2. **The native bridge (additive)** — `createNativeTimeline` (`timeline.ts:227-259`)
   feature-detects `globalThis.ScrollTimeline` / `globalThis.ViewTimeline` and constructs
   the platform timeline (returns `null` where absent). `attachNativeScrollTimeline`
   (`waapi.ts:440-473`) reuses the ONE WAAPI eligibility gate (`:444`), maps the eligible
   curve's keyframes onto the native `timeline:` (`:463-466`), and exposes the handles on
   `animation._waAnimations` for `stop()`/`reset()` cancel (`:471`).

The `globalThis.`-qualification foot-gun note (`timeline.ts:233-239`) — the bare identifier
`ScrollTimeline` would resolve to *this module's own JS class*, not the platform global — is
a genuinely sharp, correct piece of engineering. **ALREADY-SOTA.**

### The ARCH-kill, re-litigated against the 2026 SOTA

The doc-blocks at `timeline.ts:210-226`, `timeline.ts:419-438`, and `waapi.ts` assert the
JS sampler is retained because native scroll-driven is **"Chromium-only / not-Baseline
(Firefox today, SSR, jsdom)"** (`timeline.ts:215-218`, `:430-431`). The KILL — *the native
bridge never replaces the JS sampler* — is **CORRECT and HOLDS**. But the *stated rationale*
has drifted from the platform:

- **Safari 18 shipped scroll-driven animations (Sept 2024)** — `ScrollTimeline`,
  `ViewTimeline`, `animation-timeline`, `scroll()`, `view()`. The "Chromium-only" phrasing
  (`timeline.ts:217 "Chromium-only"`, `:430 "Chromium-only"`) is **factually stale** as of
  June 2026 [MDN scroll-driven-animations; the published `r-animation-sota A-G4`
  independently re-confirms "Safari/Firefox absent" — that half is ALSO now partly stale:
  Safari is present].
- **The kill still holds for the right reason:** Firefox supports it only behind
  `layout.css.scroll-driven-animations.enabled`, so it is **not Baseline**. The honest
  rationale in 2026 is "*not Baseline (Firefox flagged)*" + "*the JS sampler is the only
  general driver over non-DOM targets AND the only path that applies `SmoothProgress`
  smoothing + boundary-snap*" (`waapi.ts:432-438` states the smoothing half correctly).
  The *generality* + *smoothing* arguments are timeless and sufficient; the *"Chromium-only"*
  browser-share argument is the one that rotted.

**Finding S-1 — the "Chromium-only" rationale is stale (Safari 18 ships it).**
`timeline.ts:217`, `:430`; cross-ref the published `r-animation-sota.md:176` "Safari/Firefox
absent" line which is *also* now half-stale. The kill is RIGHT; the *reason string* lies.
- **Disposition: RECORD** (byte-cheap doc-truth correction, ride the G.W2 re-pin moment —
  the same "the comment lies post-re-pin" class as `a-ci-streamline §1` / `G.W6.S1`). Do NOT
  change the mechanism. Re-word to lead with *generality + smoothing + not-Baseline-Firefox*,
  not browser-vendor count.
- **Instrument (if SHIPped as a doc-gate row):** a `proof:modern-web`-style CHECKLIST row
  carrying the *live* Baseline string for `animation-timeline` (the `G.W14`/`MW-CHK-1` idiom —
  "enumerate the lever with its live Baseline string"). BITE: the row asserting
  "Chromium-only" reds against the live Baseline lookup.

### The 2026 scroll-SOTA feature the bridge does NOT model: `view()` named ranges

The native bridge's `NativeTimelineSpec` (`timeline.ts:206-208`) models:
- `kind: "scroll"` → `source?`, `axis?` (`:207`)
- `kind: "view"` → `subject`, `axis?`, `inset?` (`:208`)

The 2026 scroll-driven SOTA's headline expressivity is **named animation ranges** on a view
timeline: `entry` / `exit` / `contain` / `cover`, consumed via the CSS `animation-range`
property (e.g. `animation-range: entry 0% cover 50%`) [MDN "Scroll-driven animation
timelines"; "View progress timelines"]. The bridge has **no `range` / `rangeStart` /
`rangeEnd` field** — `toWAAPIOptions` (`waapi.ts:291-329`) emits `duration`/`delay`/
`iterations`/`direction`/`fill`/`easing` only, and `attachNativeScrollTimeline` spreads
exactly those (`waapi.ts:463-466`). WAAPI *does* expose `rangeStart`/`rangeEnd` on
`KeyframeAnimationOptions` for scroll/view timelines — so the platform seam exists; the
bridge simply does not thread it.

This is **not a defect** — the bridge is a faithful additive fast-lane for the *full-range*
case, and the JS sampler covers the general case. But "*animate only during the element's
`entry` phase*" — the single most-reached-for scroll-driven idiom in 2026 — is currently
expressible neither on the native bridge (no `range`) nor on the JS `ScrollTimeline` (its
`sample()` is a single linear `scrollY/maxScroll` ramp `:175-178`, with no notion of a
subject's entry/exit through the scrollport).

**Finding S-2 — neither tier models `view()` named ranges (`entry`/`exit`/`contain`/`cover`
+ `animation-range`).** `timeline.ts:206-208` (no `range` field), `waapi.ts:463-466` (no
`rangeStart`/`rangeEnd` thread), `timeline.ts:175-178` (JS `sample()` is a single linear
ramp, no subject-through-scrollport notion).
- **Disposition: BOOK** (a real additive surface, NOT a regression). It needs a shaped
  decision, not a reflex: (a) the *native half* is cheap — add an optional
  `range?: { start: string; end: string }` to the `"view"` spec and thread it as
  `rangeStart`/`rangeEnd` in `attachNativeScrollTimeline`; this is a few lines and
  WAAPI-eligible. (b) the *JS half* is the harder, more valuable piece — a
  `ViewTimeline`-equivalent JS sampler that computes a subject's `entry`/`exit`/`contain`/
  `cover` progress from a `getBoundingClientRect()` + scrollport rect (injectable, like the
  existing `getScrollY`), so the named-range idiom works over the general (non-Baseline,
  non-DOM-target-adjacent) path too. This is the genuine net-new scroll feature for a future
  tranche.
- **Instrument (when SHIPped):** `proof:view-ranges` — a `ManualTimeline`-style harness
  feeding synthetic subject + scrollport rects, asserting the JS view-sampler returns 0 at
  `entry 0%`, 1 at `entry 100%`, and the documented plateau across `contain`; for the native
  half, a browser-driven `demo-smoke` asserting `animation.rangeStart`/`rangeEnd` are set.
  BITE: a sampler that ignores the subject rect and returns the bare `scrollY` ramp reds the
  `entry`-phase assertion.
- **Why BOOK not SHIP-in-G:** G is the *narrow finishing* tranche (`G.md:3, :108`); S-2 is
  net-new engine surface beyond G's two booked SHIPs (DrawSVG + `.finished`, `G.W13`). It
  belongs with the animation-SOTA frontier set (`r-animation-sota`), sequenced after the
  re-pin spine, not folded into a finishing wave.

### Scroll pipeline micro-notes (ALREADY-SOTA, recorded for completeness)

- The boundary-snap (`timeline.ts:86-88`) + the dual smoother branch (`_advance:101-108`:
  `snap()` at boundary, `tickDt(dt)` in the interior) correctly kills the endpoint-jitter
  oscillation the doc-comment describes (`:84-85`). The `SmoothProgress` exponential step
  (`smooth.ts:121`, `factor = 1 - exp(-damping·dt/16.667)`) is frame-rate-independent — SOTA
  for a scroll smoother. **LEAVE.**
- `targetEpsilon` (`smooth.ts:10-15`) is the right knob for sub-pixel scroll-jitter
  filtering and is wired into `setTarget` (`:81-82`). **ALREADY-SOTA.**
- The progress-reconciliation caveat (`waapi.ts:432-438`) — the native lane has no
  `SmoothProgress`, so behaviour-equivalence requires the JS lane run `{ smoothing: false }`
  — is honestly documented and is the correct posture (do NOT smuggle the JS smoother onto
  the compositor; there is no seam). **LEAVE.**

---

## SUBJECT B — ORBITAL DRAG + QUATERNIONS

### Does the orbital rotation use quaternions/SLERP or Euler/matrix? (the verified answer)

**Internally: quaternions, gimbal-lock-free. On the boundary: it round-trips to Euler.**

- The **source of truth is a persistent quaternion** — `currentQuaternion = quat.create()`
  (`OrbitalDrag.vue:65`), "*Never reconstructed from Euler angles; only multiplied by delta
  quaternions*" (`:63-64`). `applyRotation` builds a delta quat via `quat.setAxisAngle` and
  left-multiplies + normalizes (`:122-131`). This is the **correct, SOTA, gimbal-free**
  rotation-accumulation idiom — exactly what trackball / orbit controls should do, and what
  the 2026 quaternion literature prescribes [Unity QuaternionAndEulerRotations; Wikipedia
  Gimbal lock — "quaternions prevent gimbal lock *if rotational values aren't converted to
  Euler angles*"].
- Angular **velocity for inertia is axis + speed** (`angularVelocityAxis`/`angularVelocitySpeed`,
  `:67-69`), EMA-smoothed in `updateRotation` (`:144-148`) — also correct (no per-Euler-
  component velocity). **SOTA.**
- **The defect is on the consumption legs**, both fed by `quaternionToEulerDegrees`
  (`OrbitalDrag.vue:74-106`):
  1. **CSS output** — `containerStyle` emits
     `... rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) rotateZ(${rotate.z}deg) ...`
     (`:58`), i.e. it **decomposes the gimbal-free quaternion back into three sequential
     Euler rotations and re-applies them** as `Rx·Ry·Rz`. This is the precise quaternion
     anti-pattern the SOTA warns against: "*if you retrieve, modify and re-apply, problems
     will arise*" [Unity manual]. The decomposition itself uses an `asin`-based extraction
     with a `±0.9999` clamp branch (`:89-99`) — a hand-rolled Euler-from-matrix that *has a
     singularity* at `sy → ±1` (the `ez = 0` fallback `:97-98` is the gimbal-lock branch made
     explicit). So the demo *implements gimbal-lock handling for a problem it created by
     decomposing*.
  2. **v-model emit** — `syncRotationToModel` writes the same Euler triple into
     `model.value.rotate.{x,y,z}` (`:111-119`) and emits it (`:118`, `:326`). Downstream
     consumers (the matrix-editor sliders, the share-state hash, the `rotate` event) see the
     **lossy Euler**, never the quaternion. Re-seeding on mount reconstructs the quaternion
     *from* those Euler angles (`:273-285`, the `qx·qy·qz` compose), so a save→restore round
     trip is Euler-lossy by construction.
- **No SLERP anywhere** (`grep slerp` over `demo/` + `src/` → zero hits). That is
  **correct** for the *interactive* path — interactive orbit accumulates deltas, it does not
  interpolate between two orientations, so SLERP has no role there. SLERP would only matter
  for an *animated* orientation tween (a "fly-to-this-view" preset), which the demo does not
  do. **No SLERP gap on the interactive path — honest ALREADY-SOTA.**

### The transposition: emit `rotate3d` (axis-angle), not `rotateX/Y/Z` (Euler)

The quaternion is *already* an axis-angle in disguise (`quat.getAxisAngle` is the inverse of
the `setAxisAngle` already used at `:126`). CSS `rotate3d(x, y, z, angle)` consumes an
axis-angle **directly**, with **no Euler decomposition, no singularity branch, no loss**.
And critically — **the engine already interpolates `rotate3d`**: the cube's own preset
animates `rotate3d: "0,0,0,0deg" → "-1,1,0,30deg"` (`useCubeAnimations.ts:95-96`), proving
the parse/interp/serialize path round-trips axis-angle today with zero new code.

So the orbital `containerStyle` (`OrbitalDrag.vue:58`) can emit a single
`rotate3d(ax, ay, az, ${angleDeg}deg)` read straight off `currentQuaternion` via
`quat.getAxisAngle` — deleting `quaternionToEulerDegrees` (`:74-106`, 33 lines incl. the
gimbal branch) entirely. This is the gestalt move: the quaternion is the source of truth, so
the *output should be the quaternion's native form*, not a lossy three-angle re-application.

**Finding O-1 — the rotation output gratuitously round-trips quaternion → Euler → re-apply;
collapse it to `rotate3d` (axis-angle).** `OrbitalDrag.vue:58` (the Euler CSS), `:74-106`
(the hand-rolled `quaternionToEulerDegrees` + its `±0.9999` gimbal branch), `:111-119` (the
Euler v-model write). The engine already interpolates axis-angle `rotate3d`
(`useCubeAnimations.ts:95-96`).
- **Disposition: SHIP-in-G** (a correctness + simplicity + no-legacy transposition: it
  *removes* the lossy round-trip and the singularity-handling code, it does not add a
  workaround). Net **negative** lines. Zero new dependency (`quat.getAxisAngle` is already in
  the imported `gl-matrix` `quat`).
- **The ONE design call (the v-model contract):** the public `TransformState.rotate` is an
  Euler `{x,y,z}` (`index.ts:9-13`) and the demo's matrix-editor + share-state consume it.
  Two honest options, neither a workaround:
  - **(O-1a, minimal):** change only the *CSS render* (`containerStyle:58`) to `rotate3d`
    off the quaternion; keep the Euler v-model for backward-compat of the slider/share
    surface. The render becomes loss-free + gimbal-free; the v-model stays Euler (consumed by
    sliders that are *inherently* per-axis Euler controls, so Euler is the right type *there*).
    This is the smallest correct SHIP and is likely the G-befitting one.
  - **(O-1b, fuller):** add `TransformState.quaternion: quat` as the source-of-truth field,
    derive `rotate` Euler *only* for the slider UI, and seed/restore from the quaternion. This
    fixes the save→restore Euler-loss too — but it widens the public model type and the share
    hash, which is net-new surface, not a finishing-tranche fold.
- **Instrument (per SHIP):** `proof:orbital-rotate3d` — (1) a unit test asserting
  `containerStyle.transform` contains `rotate3d(` and NOT `rotateX(`/`rotateY(`/`rotateZ(`;
  (2) a *gimbal-pole* parity test: drive the quaternion to a near-pole orientation
  (the old `sy → ±1` branch `:93-99`) and assert the rendered `rotate3d` matches the
  quaternion's `getAxisAngle` within epsilon — the OLD Euler path drops a DOF at the pole, so
  this test reds against the Euler implementation and greens against `rotate3d`. BITE: revert
  to the `rotateX/Y/Z` emit → the no-`rotateX` clause AND the pole-parity test both red.
- **Cross-repo note:** `gl-matrix` is the orbital math vendor (a transitive demo dep per
  `demo/CLAUDE.md`). This is purely demo-side; **NOT** a value.js hand-off. See O-3 for the
  value.js-domain question.

### The inertia decay (the F.W10 `decay()` swap) — ALREADY-SOTA, LEAVE

`useOrbitalInertia` consumes the engine's shipped analytic `decay()` closed form
(`useOrbitalInertia.ts:11,69`), seeded once with unit velocity so `unitDecay(t_s).velocity`
IS the per-frame multiplicative factor `e^(−k·t)` (`:62-77`). The friction `k` is derived
from the legacy `inertiaFactor` via the measure-first mapping `k = −ln(inertiaFactor)·60`
(`inertiaDecay.ts:33-34`), and the decay is **frame-rate-exact** (the analytic factor over
the *actual* frame delta `:86-92`), where the old `Math.pow(inertiaFactor, dt/TARGET_DT)`
form had Euler drift. This is genuine dogfooding of the LIGHT engine surface and is exactly
the inv-ζ posture `G.md:99` describes (the orchestration analogue, F.W10.S1).
- **Disposition: ALREADY-SOTA — LEAVE.** The published `r-animation-sota A-G5` (`:179-182`)
  independently rules this clean. No finding.
- **Honest note:** rotational inertia bleeds a *scalar* angular speed
  (`angularVelocitySpeed *= factor`, `useOrbitalInertia.ts:97`) about a fixed axis — correct
  for a flick, and the `decay()` closed form is the right model. No quaternion concern here:
  the axis is held, only the magnitude decays.

### The orbital-drag value.js-domain question (the quaternion-math hand-off)

The orbital core uses `gl-matrix` `quat`/`vec3`/`mat4` directly (`OrbitalDrag.vue:10`,
`index.ts:1`). The lane prompt asks whether quaternion math is value.js-domain. **Honest
answer: NOT for G, and arguably not at all.**
- `gl-matrix` is a battle-hardened, zero-GC, SIMD-friendly quaternion library. value.js'
  domain is *CSS value parsing/normalization/color/interp*, not 3D linear algebra. Re-homing
  `quat` math into value.js would be **scope-creep**, not consolidation — it fails the
  cohesion test the `a-backend-godmodules` lane applies to splits.
- The ONE place a value.js touch *could* be befitting: if a future `rotate3d`/quaternion
  *interpolation* primitive (a SLERP-based orientation tween for an animated "fly-to-view"
  preset) were wanted in the ENGINE, that interp lerp would route through the
  `lerpValue → iv._lerp` seam (`engine.ts:731`) and a quaternion-SLERP lerp strategy *would*
  be value.js-domain (it owns the interp strategies). But that is **speculative net-new
  engine surface**, not an orbital-drag fold.
- **Finding O-3 — quaternion math is NOT a value.js hand-off for G.** `gl-matrix` is the
  correct vendor for the orbital 3D algebra; value.js owns CSS-value interp, not 3D linear
  algebra.
  - **Disposition: RECORD** (an explicit *refusal* of a hand-off, so a later lane does not
    manufacture one). IF a SLERP orientation-tween engine primitive is ever wanted, THAT
    interp strategy is `value.js-HANDOFF` (the interp-strategy registry), gated behind a
    `proof:slerp-tween` shaped bench — but it is **BOOK**, not owed by G.

---

## Disposition summary

| ID  | Subject | Finding | Disposition | Instrument |
|-----|---------|---------|-------------|------------|
| S-1 | scroll  | "Chromium-only / not-Baseline" rationale is stale — Safari 18 ships scroll-driven; the KILL holds for the right reason (Firefox flagged = not Baseline) but the *reason string* lies (`timeline.ts:217,:430`) | **RECORD** (doc-truth, ride G.W2 re-pin) | `proof:modern-web` CHECKLIST row carrying the live `animation-timeline` Baseline string |
| S-2 | scroll  | Neither tier models `view()` named ranges (`entry/exit/contain/cover` + `animation-range`) — native bridge has no `range` field (`timeline.ts:206-208`), JS `sample()` is a single linear ramp (`:175-178`) | **BOOK** (net-new additive surface; native half cheap, JS view-sampler the valuable piece) | `proof:view-ranges` — synthetic subject+scrollport rects, assert `entry 0%`→0 / `entry 100%`→1; native half asserts `rangeStart`/`rangeEnd` set |
| O-1 | orbital | Rotation OUTPUT round-trips quaternion → Euler → re-apply (`OrbitalDrag.vue:58,74-106,111-119`); the engine already interpolates axis-angle `rotate3d` (`useCubeAnimations.ts:95-96`) — collapse the output to `rotate3d` | **SHIP-in-G** (correctness + simplicity, net-negative lines, zero new dep) | `proof:orbital-rotate3d` — assert `rotate3d(` not `rotateX/Y/Z`; pole-parity test reds against Euler, greens against `rotate3d` |
| O-2 | orbital | Inertia decay (F.W10 `decay()` swap) is frame-rate-exact, dogfoods the LIGHT engine (`useOrbitalInertia.ts:11,62-92`) | **ALREADY-SOTA — LEAVE** | — (re-confirms `r-animation-sota A-G5`) |
| O-3 | orbital | Quaternion 3D-algebra is NOT a value.js hand-off (gl-matrix is the right vendor; value.js owns CSS-value interp, not 3D linear algebra) | **RECORD** (explicit refusal); a future SLERP *interp-strategy* would be value.js-HANDOFF, but **BOOK** | (if ever) `proof:slerp-tween` shaped bench |

## Honest ALREADY-SOTA record (binding — G manufactures nothing here)

- The scroll two-tier architecture (JS sampler + additive native bridge), the
  `globalThis.`-qualification foot-gun guard, the eligibility-gate reuse, the
  `_waAnimations` cancel seam, the boundary-snap + dual-smoother branch, the frame-rate-
  independent `SmoothProgress` step, and the progress-reconciliation caveat are **all
  ALREADY-SOTA** (`timeline.ts:35-259`, `waapi.ts:440-473`, `smooth.ts:121`). The ARCH-kill
  is CORRECT; only its *stated reason* drifted (S-1).
- The orbital rotation **accumulation** (persistent quaternion, delta-multiply, axis-angle
  velocity, EMA smoothing) is **gimbal-free SOTA** (`OrbitalDrag.vue:63-148`); no SLERP gap
  on the interactive path (SLERP has no role in delta-accumulation). The inertia `decay()`
  dogfood is **ALREADY-SOTA** (O-2). The ONLY defect is the lossy *output* round-trip (O-1).
