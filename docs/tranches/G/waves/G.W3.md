# G.W3 — The C1 container-resize staleness fold (the ONE kf-side fold the bare re-pin misses)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-G (the one
genuine kf-side fold of the value.js lane — the demo wires the signal; the library
documents the contract) · **Scope:** `demo/@/components/custom/animation-controls/controls/
AnimationVisualizer.vue` (the container `ResizeObserver` → `bumpLayoutEpoch()` wire) + the
library's container-unit contract doc (`src/animation/CLAUDE.md` / the boundary doc — NO
library-generic auto-observer) + a resize-without-window-resize integration/Playwright test.
**ZERO library-engine `src/` interp-path edit** — the fold is a demo wire + a doc, not a
library-generic observer. · **DAG-deps:** **depends on G.W2** (the re-pin must land first —
this staleness CANNOT exist on `0.10.0`; the re-pin INTRODUCES it). Band 1, after the spine.

The §Mandate (`G.md §Mandate` / the gap-scorecard §THESIS) is the spine; this wave most
tests **NO workaround + the boundary** — the right fix is to feed the genuine signal
value.js exposes (`bumpLayoutEpoch()`), NOT to disable the cache or re-introduce per-frame
re-resolution. The re-pin's C1 endpoint cache (G.W2) is the win; this wave is the
correctness clause that makes it safe under the one resize the value.js auto-`window.resize`
listener cannot see.

The re-pin INTRODUCES this defect: before G.W2, `0.10.0` re-resolves every computed
endpoint every frame (no cache, so no staleness possible); after G.W2, the C1 cache serves
the resolved `(startN, stopN, unit)` keyed by a monotonic `layoutEpoch` that value.js bumps
on `window.resize` — but **a CONTAINER resize that does not coincide with a window resize
never bumps the epoch**, so the cache serves STALE pre-resize pixels for any
container-query-unit animation whose container box changes independently of the viewport.
Verified, not asserted (inv ε), against the live `tranche-g-dev` tree + the published
`value.js@0.11.0`.

**Provenance.** `a-valuejs-leverage F-VJ-2` (the fold — the re-pin introduces C1 staleness
for `cqw` animations under non-window resize; bites `AnimationVisualizer`; wire the genuine
signal, demo-wires + library-documents), `a-valuejs-leverage §0` (the value.js epoch
mechanics: `bumpLayoutEpoch`/`getLayoutEpoch` exported `normalize.ts:157,166`; auto-install
on `window.resize` `:182-189`; the C7 staleness docstring `:166-174`).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-g-dev` + the published `0.11.0`:

1. **The C1 cache is epoch-keyed; value.js bumps the epoch ONLY on `window.resize`.**
   `lerpComputedValue` caches the resolved `(startN, stopN, unit)` on `iv._computedCache`,
   keyed `(target, epoch)` (`value.js interpolate.ts:26-72`); `bumpLayoutEpoch()` /
   `getLayoutEpoch()` are exported (`normalize.ts:157,166`) and value.js **auto-installs a
   `window.resize` listener** that bumps the epoch (`normalize.ts:182-189`;
   `a-valuejs-leverage §0`). The docstring explicitly names the gap (`normalize.ts:166-174`):
   "Call on any event that changes a computed-unit resolution — a viewport `resize`, a
   container `ResizeObserver` callback…". **The container-resize signal is value.js's
   responsibility to receive, not to detect.**

2. **The staleness BITES kf's flagship computed-unit demo TODAY (post-re-pin).** kf's
   `AnimationVisualizer.vue` animates the ball via
   `translate-x-[calc(100cqw_-_100%)]` (`demo/@/components/custom/animation-controls/
   controls/AnimationVisualizer.vue:35`, verified live) inside a `container-type:
   inline-size` parent (`demo/@/styles/style.css:256`, verified live). A panel/split-pane
   resize that changes the container width **without** a window resize — a dock toggle, a
   sidebar collapse, a flex re-layout — leaves the C1 cache stamped at the stale epoch → the
   ball animates to the OLD `100cqw` pixel target until the next window resize busts it
   (`a-valuejs-leverage F-VJ-2`).

3. **Before the re-pin this bug CANNOT exist; the re-pin INTRODUCES it.** `0.10.0`
   re-resolves every frame (no cache), so there is no stale entry to serve
   (`a-valuejs-leverage F-VJ-2`). The fold is therefore strictly downstream of G.W2 — it
   is the correctness clause the re-pin's cache requires, not a pre-existing defect.

4. **The genuine signal is already available to the demo.** value.js EXPORTS
   `bumpLayoutEpoch()` for exactly this (`normalize.ts:166`); the demo already uses
   `useResizeObserver` from `@vueuse/core` on the heavy surface (e.g.
   `demo/easing/EasingTarget.vue:102`, `AmigaScene.vue:12`; `a-valuejs-leverage F-VJ-2`).
   The wire is one `useResizeObserver(container, () => bumpLayoutEpoch())`, on the
   container the demo already owns. **The eviction/invalidation policy lives ONCE in
   value.js — kf feeds only the signal value.js's auto-`window.resize` cannot see (DRY).**

The wave's job: wire `bumpLayoutEpoch()` to the `AnimationVisualizer` container
`ResizeObserver`, document the library's container-unit contract (the consumer of a
`cq*`/computed unit whose container resizes independently of the viewport must bump the
epoch), and close it with a resize-without-window-resize test that the ball tracks the new
`100cqw` — with NO library-generic auto-observer.

---

## § Goal

**What lands (the IMPL the spec gates):**
- **The demo wire (SHIP — the kf-side fold).** `AnimationVisualizer.vue` observes its
  resolution-container with `useResizeObserver` (already in the demo dep set) and calls
  `bumpLayoutEpoch()` on container resize. The C1 cache busts on the container edge the
  value.js auto-`window.resize` listener cannot see; the ball re-resolves the new `100cqw`
  on the next frame. (SHIP-in-G.)
- **The library container-unit CONTRACT, documented (SHIP — a doc, not an observer).** The
  library documents (mirroring the `AnimationGroup` managed-child contract doc) that a
  consumer animating a `cq*`/computed unit whose resolution-container resizes independently
  of the viewport MUST call `bumpLayoutEpoch()` on that container's `ResizeObserver` — the
  one signal value.js's auto-`window.resize` bump cannot see. **NO library-generic
  auto-observer** (a per-target `ResizeObserver` on `setTargets` for a niche unit class is
  the boundary-breach concern that kept F.W6's wrapper out of kf). (SHIP — doc.)
- **The resize-without-window-resize gate.** A demo/integration test (or a Playwright check
  on the live CF-Pages build) that resizes `AnimationVisualizer`'s container WITHOUT a
  window resize and asserts the ball's resolved x-target tracks the new `100cqw` (fails on
  a stale-epoch serve). (SHIP — the gate ships WITH the wire.)

**Why:** the re-pin's C1 cache is the −94% win, but a cache is only correct with its
invalidation. value.js owns the cache + the `window.resize` bump; the ONE event it
structurally cannot observe is a container resize decoupled from the viewport — and that is
exactly kf's flagship `cqw` demo's resize mode (a dock/sidebar/flex re-layout). The
§Mandate's no-workaround: the fix is to feed the genuine epoch signal value.js exposes for
precisely this, NOT to disable the cache, re-introduce per-frame resolution, or bolt a
container-poll onto the engine. Wiring the demo (which OWNS its container) + documenting the
contract is the gestalt, boundary-preserving fold; a library-generic observer is BOOK
pending a bench that a container-unit animation under panel-resize is a real library
workload (`a-valuejs-leverage F-VJ-2`).

---

## § Scope

### S1 — Wire `bumpLayoutEpoch()` to the `AnimationVisualizer` container ResizeObserver — `a-valuejs-leverage F-VJ-2`

**WHAT:** in `AnimationVisualizer.vue` (the `calc(100cqw - 100%)` consumer,
`AnimationVisualizer.vue:35`), observe the resolution-container (the `container-type:
inline-size` parent, `style.css:256`) with `useResizeObserver` from `@vueuse/core`
(already in the demo dep set, `EasingTarget.vue:102`/`AmigaScene.vue:12`) and call
`bumpLayoutEpoch()` (imported from value.js, `normalize.ts:166`) on each container-resize
callback. The cache busts on the container edge; the next frame re-resolves the new
`100cqw`.

**WHY:** the demo OWNS its container — it is the surface that knows when the container box
changes independently of the viewport. value.js exports `bumpLayoutEpoch()` for exactly
this signal; the wire feeds it the one edge the auto-`window.resize` listener cannot see.
The §Mandate's no-workaround + DRY: kf does NOT duplicate value.js's eviction policy or
disable the cache — it feeds the genuine signal value.js already accepts
(`a-valuejs-leverage F-VJ-2`).

### S2 — Document the library container-unit contract; NO library-generic auto-observer — `a-valuejs-leverage F-VJ-2`

**WHAT:** the library documents (in `src/animation/CLAUDE.md` / the boundary doc, mirroring
the `AnimationGroup` managed-child contract) the container-unit contract: a consumer
animating a `cq*`/computed unit whose resolution-container resizes independently of the
viewport must call `bumpLayoutEpoch()` on that container's `ResizeObserver`. Explicitly
RECORD that the library does NOT install a generic per-target observer — that is BOOK
pending a bench (S-question below). A doc + a recorded non-action, NO library code.

**WHY:** the library-generic path adds a per-target `ResizeObserver` on `setTargets` for a
niche unit class — the same boundary-breach concern that kept F.W6's value.js-resolver
wrapper out of kf (`a-valuejs-leverage F-VJ-2`). The §Mandate's KISS + the boundary: the
demo wires what it owns; the library documents the contract for consumers, rather than
manufacturing a library-global observer for a workload not yet measured. The doc is the
gestalt: the contract is explicit, the auto-observer is a recorded BOOK, not a silent
omission.

### S3 — `proof:resize-tracks`, the resize-without-window-resize gate (the falsifiable close) — `a-valuejs-leverage F-VJ-2`

**WHAT:** `proof:resize-tracks` — a demo/integration test (or a Playwright check on the live CF-Pages build) that
(a) starts a `calc(100cqw - 100%)` animation in `AnimationVisualizer`, (b) resizes the
container WITHOUT a window resize (e.g. via a parent flex/width change, not a viewport
resize), and (c) asserts the ball's resolved x-target tracks the NEW `100cqw`. Absent the
S1 wire, the test reproduces the staleness (the ball serves the stale-epoch pre-resize
target); with the wire, green.

**WHY:** inv ε — the close must BITE. The test is the falsifiable form of "the C1 cache
busts on the container edge." It is the negative control for the re-pin's named risk: it
fails on the bare re-pin (G.W2 alone) and greens only with the S1 wire — proving the fold
is necessary AND sufficient. BITES: remove the `bumpLayoutEpoch()` wire → the ball serves
the stale target → reds; a window-resize-only bust would NOT catch this (the test resizes
the container, not the viewport).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real check, not narration):

1. **The C1 cache busts on a container resize without a window resize.** The S3 gate
   `proof:resize-tracks`: a
   `calc(100cqw - 100%)` animation whose container is resized (no viewport resize) tracks
   the NEW `100cqw` target on the next frame. BITES: remove the `bumpLayoutEpoch()` wire →
   the ball serves the stale-epoch pre-resize target → reds. (`a-valuejs-leverage F-VJ-2`.)
2. **The window-resize path still works (no regression).** A viewport-resize bust still
   re-resolves the new `100cqw` (value.js's auto-`window.resize` listener, unperturbed).
   BITES: the demo wire double-bumping or suppressing the window path → reds.
3. **No library-generic auto-observer landed.** `grep` over `src/animation/**` shows no new
   per-target `ResizeObserver` / container-poll on `setTargets`; the only `ResizeObserver`
   wire is the demo's `AnimationVisualizer`. BITES: a library-engine `ResizeObserver` in
   `src/animation/**` → reds (the boundary-breach the doc records as BOOK, not SHIP).
4. **The container-unit contract is documented.** The library doc names the
   `bumpLayoutEpoch()` consumer contract + the recorded no-auto-observer BOOK. BITES: the
   contract absent → a consumer cannot know to bump the epoch → the fold is half-wired
   (the F.W8 no-half-wire discipline). (`a-valuejs-leverage F-VJ-2`.)
5. **The fold is demo-wired, not engine-edited (boundary intact).** The S1 wire touches
   only `AnimationVisualizer.vue` + the doc; `proof:boundary` stays green; ZERO library
   interp-path edit. BITES: a library-engine source edit in G.W3 → reds (the demo-owns-its-
   container charter).

---

## § Folds

Retires (by finding id):
- **`a-valuejs-leverage F-VJ-2`** — the re-pin introduces C1 staleness for `cqw`
  animations under a non-window resize (bites `AnimationVisualizer`); wire the genuine
  `bumpLayoutEpoch()` signal value.js exposes; demo-wires + library-documents the contract;
  NO library-generic auto-observer — S1 (wire) + S2 (doc + recorded BOOK) + S3 (gate) + all
  gate clauses.

**BOOK (carried with its gate):**
- **The library-generic container-unit auto-observer** — an opt-in per-target
  `ResizeObserver` on `setTargets` when any iv carries a `cq*`/computed unit — is BOOK
  pending a bench that a container-unit animation under panel-resize is a real LIBRARY
  workload (not just the demo's). The boundary-breach concern (a per-target observer for a
  niche unit class) is the same that kept F.W6's wrapper out of kf. Carried, not
  manufactured. (`a-valuejs-leverage F-VJ-2`.)

**RECORD (carried so no future lane re-raises):**
- **This fold is strictly DOWNSTREAM of G.W2** — the staleness CANNOT exist on `0.10.0`
  (no cache → no stale serve); the re-pin INTRODUCES it. So G.W3 depends on G.W2 and is
  meaningless before it. RECORDED so the fold is not mistaken for a pre-existing defect.
  (`a-valuejs-leverage F-VJ-2`.)
- **The invalidation policy lives ONCE in value.js** — kf feeds only the signal
  (`bumpLayoutEpoch()`); the eviction/epoch machinery is value.js's. A kf-side eviction
  policy would be the DRY violation the §Mandate forbids. RECORDED. (`a-valuejs-leverage
  F-VJ-2`.)

**RECORD (already-SOTA — `a-valuejs-leverage §4`):** the value.js C1 cache + the
`window.resize` auto-bump are exemplary and correct for the viewport-resize majority; the
fold ADDS the one signal value.js structurally cannot observe (a container resize decoupled
from the viewport), it does not re-touch the cache. The single-dispatch interp seam
(`engine.ts:731`) is untouched. LEAVE.

---

## § Design decisions

1. **The demo wires the signal; the library documents the contract — RESOLVED.** The demo
   OWNS `AnimationVisualizer`'s container — it is the surface that knows when the container
   box changes independently of the viewport, so it is the correct home for the
   `bumpLayoutEpoch()` wire. The library documents the contract for any consumer in the same
   position (mirroring the `AnimationGroup` managed-child contract doc). Trade-off: a
   library consumer must know to wire the epoch themselves for a non-window container resize
   — but that is the honest contract (the library cannot know every consumer's container
   topology), and a library-generic per-target observer is the boundary-breach BOOK, gated
   on a bench (`a-valuejs-leverage F-VJ-2`).

2. **Feed the genuine signal, do NOT disable the cache — RESOLVED + the no-workaround
   clause.** The §Mandate forbids the escape hatch: the fix is NOT to disable the C1 cache,
   re-introduce per-frame resolution, or bolt a container-poll onto the engine — all of
   which would discard the −94% win to dodge the staleness. The fix is to feed value.js the
   genuine epoch signal it EXPORTS for exactly this (`bumpLayoutEpoch()`,
   `normalize.ts:166`). Trade-off: the consumer must wire the observer — but that wire is one
   `useResizeObserver` call on a container the demo already has, and it preserves the cache's
   full win while closing its one blind spot.

3. **No library-generic auto-observer — it is BOOK, not SHIP — RESOLVED.** A library that
   auto-installs a per-target `ResizeObserver` on `setTargets` whenever an iv carries a
   `cq*`/computed unit would breach the boundary (a per-target observer + a layout-coupled
   side effect for a niche unit class) — the same concern that kept F.W6's value.js-resolver
   wrapper out of kf (`a-valuejs-leverage F-VJ-2`). Trade-off: the library does not
   transparently handle every container-resize consumer — but the §Mandate's measure-first +
   KISS demand the auto-observer wait on a bench proving a container-unit-under-panel-resize
   is a real LIBRARY workload (the demo's is wired directly); manufacturing the observer now
   is exactly the speculative library-global the boundary forbids.
