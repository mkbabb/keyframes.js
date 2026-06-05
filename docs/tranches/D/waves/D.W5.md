# D.W5 — The dock leveraged + the mobile composition closed (NEWLY UNBLOCKED)

**Phase:** IMPL · **Scope:** `demo/@/components/custom/dock/` +
`demo/@/components/custom/animation-controls/` + the square-scene mobile
composition + `package.json` (the glass-ui pin) · **Gated on:** glass-ui
PUBLISHING **3.3.0** (the dock CORRECTNESS surface + B′ — the RUN-BOARD
dependency edge) · **Convergence:** the AU.W8 `<Role>Dock` docs role-vocabulary,
adopted as local rename names — shared with slides, not forked.

The dependency is **bifurcated** — split into its two real edges, not collapsed
to a single "3.3.0 published":

- **Edge 1 (LANDED · ships in 3.3.0):** the dock CORRECTNESS fold + the
  touch-gate B′ fix (`f0b0ffb`, already at glass-ui HEAD — `useTouchGate` wired
  into `GlassDock.vue:143`, B′ comment at `GlassDock.vue:300`). This unblocks the
  mask removal AND the **local role-name renames** (keyframes adopts the AU.W8
  docs role-vocabulary as its local component names) — all of which depend only
  on the published 3.3.0 correctness surface.
- **Edge 2 (GATED on glass-ui AU.W8 · NOT yet landed):** any leverage of a
  glass-ui-side `<Role>Dock` **base component** / reka-Tabs rail / base-rename
  machinery. At glass-ui HEAD there is NO `ChromeDock`/`TransportDock`/
  `CanvasDock`/`ToolDock` component; a role-typed dock base is **BOOK** until a
  2nd consumer appears. This is a named cross-session edge — circle back if AU.W8
  lands a role-typed base and keyframes is its 2nd consumer.

Three long-named residuals close here on Edge 1, all finally actionable:

1. **The consumer dock-rename** — gated since C on glass-ui's dock correctness.
   The correctness base + B′ **landed** (glass-ui `at-dock-convergence`,
   `f0b0ffb`), and 3.3.0 *publishes* them. The renames are LOCAL component
   renames adopting the AU.W8 docs role-vocabulary; this is the keyframes-side
   home (KFD, per the deferred ledger).
2. **The double-tap mask removal** — at BOTH live sites (`TopDock.vue:117`,
   `AnimationMenuBar.vue:17`), unblocked by the published B′ fix.
3. **The square-scene mobile-composition occlusion** — the one real occlusion
   C.W1's HARD inv-δ gate surfaced (`square/mobile`), carried as a named,
   self-cleaning allowance through C. D.W5 is its terminal fix.

This wave **pins the published package, not the sibling branch** — D consumes
glass-ui's *published* surface (`^3.3.0`), never `file:../glass-ui` against a
dirty in-flight tree (inv-16′). Until 3.3.0 is on npm, this wave **circles back
to gate-free waves or heartbeat-polls the RUN-BOARD**; it does not start against
an unpublished base.

---

## The RUN-BOARD dependency edge (why this wave waits)

The constellation publish order (from the plan): glass-ui 3.3.0 ⇒ {keyframes-demo
D.W5, slides-F dock items} ⇒ {slides-F deploy} ⇒ {feedback-coder slides}. D.W5
sits on the *first* edge. The current pin is `file:../glass-ui`
(`package.json:66`) — a sibling-branch link, correct for development but **not**
what D ships against. The wave's first act, once 3.3.0 is published:

```
- "@mkbabb/glass-ui": "file:../glass-ui"
+ "@mkbabb/glass-ui": "^3.3.0"
```

The pin move is the unblock signal; everything below depends on the published
3.3.0 surface carrying (a) the dock-correctness fold (opacity-lockstep AU.W2,
strict-templates AU.W3) + the touch-gate B′ fix (already landed `f0b0ffb`, so
the double-tap mask can be removed), (b) the published
`GlassDock` + `DockLayerGroup`/`DockLayer`/`DockIconButton`/`DockSelectTrigger`
primitives the keyframes docks compose **today** (these DO ship in 3.3.0), and
(c) the docs role-vocabulary (AU.W8) keyframes adopts as local rename names — NOT
a `<Role>Dock` base component (a role-typed base is BOOK in glass-ui until a 2nd
consumer; that leverage gates on AU.W8, Edge 2). Until then:
**wait-or-circle-back** (the protocol), not a branch-pin shortcut.

---

## The dock-rename (Edge 1 unblocked — correctness base + B′ landed)

### The `<Role>Dock` vocabulary — CONVERGED with slides (adopted as local names)

The constellation dock-convergence plan
(`fourier-analysis/.../DOCK-ANIMATION-CONVERGENCE.md`, refined in C's
`glass-ui-dock-convergence.md`, scheduled in glass-ui AU.W8) sets ONE canonical
role vocabulary across every consumer: `ChromeDock` / `TransportDock` /
`CanvasDock` / `ToolDock`, replacing the per-app names. This is a **docs
role-vocabulary**, not a shipped base component — keyframes adopts the names as
**local component renames**, **converged, not forked**:

- **`TopDock`** (`demo/@/components/custom/dock/TopDock.vue`, the fixed top
  chrome at `TopDock.vue:112`) **→ `ChromeDock`**. It is the editor chrome dock
  (controls-collapse, controls-tab selector, the chrome rail) — `ChromeDock` is
  its role name.
- **`AnimationMenuBar`** (the bottom-fixed transport: animation selector,
  play/pause, reset — `demo/CLAUDE.md`'s `AnimationMenuBar.vue`) **→
  `TransportDock`**. It is the transport role.

slides uses the same two names for the same two roles (its tranche-F dock
items); the vocabulary is shared, so neither repo forks it.

### DELETE the local `dock/index.ts` re-export

`demo/@/components/custom/dock/index.ts` is a thin local barrel:

```ts
export { GlassDock, DockLayerGroup } from "@mkbabb/glass-ui/dock";
export { default as TopDock } from "./TopDock.vue";
```

Line 1 re-exports glass-ui primitives that callers should import **directly**
from `@mkbabb/glass-ui/dock` (the published subpath) — a redundant local hop.
Line 2 re-exports the local component under its old name. With the rename and
the direct-import convention, **the whole file is deleted** (KFD, per the
deferred ledger: "DELETE the local `dock/index.ts` re-export"). Consumers
import `ChromeDock`/`TransportDock` from their component paths and the glass-ui
primitives from `@mkbabb/glass-ui/dock` directly. No local barrel survives.

### The renames compose the SAME published primitives (no `<Role>Dock` base to slot-fill over)

Today's `TopDock.vue` composes a `GlassDock` + `DockLayerGroup` + a stack of
`DockIconButton`/`DockSelectTrigger` children (`TopDock.vue:117-154`). The rename
is a **local component rename** — `ChromeDock.vue` and `TransportDock.vue` each
still compose the **same published glass-ui dock primitives** they compose today
(`GlassDock` + `DockLayerGroup`/`DockLayer`/`DockIconButton`/`DockSelectTrigger`,
which DO ship in 3.3.0). There is **no `<Role>Dock` base component to slot-fill
over**: at glass-ui HEAD there is no `ChromeDock`/`TransportDock`/`CanvasDock`/
`ToolDock` component (grep `glass-ui/src` = 0) — the `<Role>Dock` vocabulary is a
glass-ui AU.W8 **docs-convention + base-rename deliverable**, and a role-typed
base COMPONENT is **BOOK** until a 2nd consumer appears (Edge 2, gated on AU.W8).
keyframes adopts the AU.W8 role NAMES locally now; if AU.W8 later ships a
role-typed base AND keyframes is its 2nd consumer, keyframes circles back to
collapse onto it. Until then the renames are name changes over the published
primitives, not a shell-logic extraction.

### Remove the double-tap mask — at BOTH live sites

The deferred ledger (KFD-4) names **two** live `always-expanded` sites:

1. **`TopDock.vue:117`** passes `:always-expanded="isMobile"` (with `isMobile =
   useMediaQuery("(max-width: 1023px)")`, `TopDock.vue:65`). This was a **mask**:
   it force-expanded the dock on mobile to paper over the glass-ui dock's
   double-tap-to-expand defect (the collapsed dock needed two taps on touch — one
   to expand, one to act). The fix landed in glass-ui as shape **B′**
   (`f0b0ffb`, the touch-gate), published in 3.3.0. With the real fix in the
   base, the conditional mask is **removed** (`:always-expanded="isMobile"`
   deleted) — the dock collapses/expands honestly on touch, single-tap.
2. **`AnimationMenuBar.vue:17`** passes `:always-expanded="true"` —
   **unconditional**. This is dispositioned as a **legitimate always-expanded
   transport affordance that STAYS** (analogous to the mobile icon-swaps below):
   the bottom transport bar is meant to be always-expanded, not collapsed-then-
   masked. It is NOT the conditional touch mask B′ retires; it carries no
   `isMobile` gate and no double-tap dependency. The gate (below) covers BOTH
   sites so neither is silently skipped — the conditional mask at `TopDock` goes,
   the deliberate `AnimationMenuBar` affordance is recorded as kept.

(Deferred ledger KFD-4: the `TopDock.vue:117` conditional mask is removed on the
glass-ui 3.3.0 pin (B′ fix published); `AnimationMenuBar.vue:17` is the
deliberate transport affordance, kept.) The mobile-specific
`<template v-if="isMobile">` icon swaps (`TopDock.vue:126`) are likewise a
separate, legitimate affordance and stay.

---

## The square-scene mobile-composition occlusion terminal

C.W1's occlusion gate (`scripts/occlusion-gate.mjs`) is HARD on every scene ×
viewport × controls-axis; ONE real occlusion survived as a named allowance
(`occlusion-gate.mjs:91-94`):

```js
const PENDING_OCCLUSION = new Set([
    "square/mobile/closed",
    "square/mobile/open",
]);
```

The gate's own analysis (`occlusion-gate.mjs:78-94`) names **two** distinct
root causes on the smallest (192×192) subject + narrowest viewport:

1. **(closed)** the `0.42:0.58` optical split gives the bottom only `0.58×`
   slack, which **under-reserves the full dock band** when the slack ≈ the band
   — a work-area sizing concern.
2. **(open)** the controls-pane-wrapper **starves the row-2 stage `1fr`**, so
   the subject reaches the dock band — a controls-grid **composition** concern,
   not work-area sizing.

**The terminal fix** addresses both, in the square scene's mobile composition:
- (closed) reserve the full dock band on the narrowest viewport — correct the
  optical-split under-reserve so the bottom slack covers the dock band rather
  than `0.58×` of it.
- (open) un-starve the controls-grid row-2 stage so the small subject keeps its
  `1fr` and never reaches the dock band.

This is the smallest scene; the fix is local to its mobile composition (no other
scene × viewport regresses — the gate proves it).

---

## Hard gate (falsifiable · re-runnable · MUST bite)

### 1. The occlusion allowance is EMPTIED — the self-cleaning stale-check fires

`occlusion-gate.mjs` already carries a **stale-allowance** assertion
(`occlusion-gate.mjs:347-353`): a `PENDING_OCCLUSION` entry that no longer
occludes is FAILED LOUDLY and `process.exit(1)` — "an allowance that no longer
bites cannot linger and mask a future regression" (inv ε). The D.W5 terminal fix
makes `square/mobile/closed` and `square/mobile/open` **pass** the occlusion
check; the stale-check then **forces** their removal from `PENDING_OCCLUSION`.
The wave is done only when:

- the `PENDING_OCCLUSION` set is **emptied** (both entries deleted), AND
- `node scripts/occlusion-gate.mjs` PASSES with **zero** named allowances —
  "every page × viewport × controls-state is occlusion-free (inv δ holds)"
  (`occlusion-gate.mjs:358-362`) with no "modulo N named allowance" suffix.

Falsifiable: leaving the entries in while the occlusion is fixed reds the gate
(stale); removing them while the occlusion persists reds the gate (inv-δ
violation). The bite is structural — the gate cannot pass with a lingering
allowance.

### 2. Dock-rename complete — `grep TopDock|AnimationMenuBar = 0`

A checked-in grep over `demo/` source (excluding `dist/` build artifacts)
asserts **zero** matches for `TopDock` and `AnimationMenuBar` — every site moved
to `ChromeDock`/`TransportDock`. (Current source sites, verified at wave open:
`demo/app/App.vue`, `AnimationControlsGroup.vue`,
`controls/AnimationControls.vue`, `demo/CLAUDE.md`, and the to-be-deleted
`dock/index.ts`.) The grep returns `0` or the gate fails.

### 3. `dock/index.ts` deleted

A checked-in assertion that
`demo/@/components/custom/dock/index.ts` **does not exist** (and no module
imports from `@components/custom/dock` as a barrel). The file is gone, not
emptied.

### Gate prerequisites (the dependency edge)

- `package.json` pins `@mkbabb/glass-ui` at `^3.3.0` (published), **not**
  `file:../glass-ui` — a checked grep on the pin. (Until 3.3.0 is on npm the pin
  stays `file:../glass-ui`; glass-ui is at 3.2.0 with an unpublished delta on
  `at-dock-convergence`, and 3.3.0 is the AU publish target — D pins `^3.3.0`
  only once it is on npm.)
- The double-tap mask is removed at BOTH ledger sites. A checked grep for
  `always-expanded` across **both** `demo/@/components/custom/dock/` AND
  `demo/@/components/custom/animation-controls/` asserts the **conditional
  touch-mask form** (`:always-expanded="isMobile"`) is gone (= 0). The
  `AnimationMenuBar.vue:17` `:always-expanded="true"` is the dispositioned-as-kept
  deliberate transport affordance (see the mask section) — the gate records it as
  the one surviving `always-expanded`, so the grep does not silently pass over an
  un-dispositioned site: any `always-expanded` match other than the recorded
  `AnimationMenuBar.vue:17` reds the gate.

---

## Convergence + no-legacy ledger

| Change | Converged with | Legacy removed |
|---|---|---|
| `TopDock`→`ChromeDock`, `AnimationMenuBar`→`TransportDock` (local renames) | AU.W8 `<Role>Dock` docs role-vocabulary (shared with slides) | per-app dock names |
| renames compose the published glass-ui primitives | glass-ui 3.3.0 primitives (`GlassDock`/`DockLayer*`/`DockIconButton`/`DockSelectTrigger`) | — (no shell extraction; `<Role>Dock` base-component leverage gated on AU.W8) |
| `dock/index.ts` deleted | direct `@mkbabb/glass-ui/dock` imports | the redundant local barrel |
| `:always-expanded="isMobile"` removed at `TopDock` | glass-ui B′ touch-gate (`f0b0ffb`) | the double-tap mask (`AnimationMenuBar.vue:17` `="true"` kept — deliberate affordance) |
| `^3.3.0` published pin | the RUN-BOARD publish edge | the `file:../glass-ui` dev pin |
| square/mobile occlusion fixed | — | the named `PENDING_OCCLUSION` allowance |

Isomorphic where it must be (the rename is a name change; the dock renders the
same chrome/transport), corrective where the user mandate demands (the mask and
the occlusion are real defects, removed not papered). Verified not asserted: the
occlusion by the self-cleaning gate (bite-proven by inv ε's stale-check), the
rename + deletion by grep, the unblock by the published-pin check.
