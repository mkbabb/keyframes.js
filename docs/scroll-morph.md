# Scroll-Driven Morph Animations

Animating a DOM element from one position to another as the user scrolls — e.g. a hero logo morphing into a navbar slot. This documents the architecture and pitfalls solved building the [BBNF playground](https://bbnf.babb.dev).

## Pipeline

```
ScrollTimeline ─── tick() ──→ progress p ∈ [0, 1]
                                  │
                    ┌─────────────┴─────────────┐
                    │   getBoundingClientRect()  │
                    │   marker  (source pos)     │
                    │   target  (destination)    │
                    └─────────────┬─────────────┘
                                  │
                    lerp(marker, target, p) → (x, y)
                    lerp(1, target/marker, p) → (sx, sy)
                                  │
                    element.style.transform =
                      translate(x, y) scale(sx, sy)
```

**marker** — invisible element at the source position. Stays in document flow, never transformed. Stable measurement reference.

**target** — destination element (e.g. navbar logo slot). Measured via `getBoundingClientRect()`.

**element** — the visible element being animated. Receives the interpolated CSS transform.

## Pitfalls

### 1. Scroll vs. transform fight

If the element is in document flow, the browser moves it each scroll frame, then rAF corrects it with a transform. The 1-frame latency causes visible up/down oscillation.

**Fix**: `position: fixed` once `p > 0`. Fixed elements don't scroll. Screen position is driven entirely by the interpolated `translate()`.

Lock the parent's `min-width`/`min-height` before going fixed to prevent layout shift.

### 2. Transformed ancestors break fixed positioning

Per CSS spec, any ancestor with a `transform` (even `translateY(0px)`) becomes the containing block for `position: fixed` descendants. `left: 0; top: 0` is relative to that ancestor, not the viewport.

**Fix**: Ensure no ancestor has a CSS `transform` while the morph is active. If needed earlier (entrance animation), remove it before the morph begins.

### 3. Sub-pixel measurement noise

`getBoundingClientRect()` returns values that vary by ±0.3px between frames. This noise propagates into the transform.

**Fix**: Round to nearest 0.5px:

```ts
const snap = (v: number) => Math.round(v * 2) / 2;
```

### 4. Boundary oscillation

Near scroll endpoints, micro-jitter alternates the eased value between 0.9997 and 1.0. The smoother flip-flops between `snap()` and `tick()`.

**Fix**: `boundaryEpsilon` in `TimelineOptions` snaps values within epsilon of 0/1 before the smoother sees them. `targetEpsilon` in `SmoothProgressOptions` ignores changes below a threshold.

## Example

```ts
import { ScrollTimeline, easeOutCubic } from "@mkbabb/keyframes.js";

const snap = (v: number) => Math.round(v * 2) / 2;

const timeline = new ScrollTimeline({
    threshold: 0.35,
    easing: easeOutCubic,
    boundaryEpsilon: 0.006,
    smoothing: { damping: 0.2, snapThreshold: 0.008, targetEpsilon: 0.002 },
});

let parentLocked = false;

function update() {
    const p = timeline.tick();
    const m = markerEl.getBoundingClientRect();
    const t = targetEl.getBoundingClientRect();

    if (p <= 0) {
        element.style.cssText = "";
        if (parentLocked) { unlockParent(); parentLocked = false; }
    } else {
        if (!parentLocked) { lockParent(); parentLocked = true; }

        const x = snap(m.x) * (1 - p) + snap(t.x) * p;
        const y = snap(m.y) * (1 - p) + snap(t.y) * p;
        const sx = 1 + (t.width / m.width - 1) * p;
        const sy = 1 + (t.height / m.height - 1) * p;

        element.style.position = "fixed";
        element.style.left = "0px";
        element.style.top = "0px";
        element.style.transform = `translate(${x}px,${y}px) scale(${sx},${sy})`;
        element.style.transformOrigin = "top left";
    }

    requestAnimationFrame(update);
}

function lockParent() {
    const r = element.parentElement!.getBoundingClientRect();
    element.parentElement!.style.minWidth = `${r.width}px`;
    element.parentElement!.style.minHeight = `${r.height}px`;
}

function unlockParent() {
    element.parentElement!.style.minWidth = "";
    element.parentElement!.style.minHeight = "";
}

requestAnimationFrame(update);
```
