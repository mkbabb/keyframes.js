# keyframes.js → glass-ui BC — the cross-repo dispatch (INFORM + ASK)

> Authored 2026-06-19 at the keyframes M close. glass-ui is a DOWNSTREAM consumer
> on the constellation spine (parse-that → value.js → keyframes.js → glass-ui).
> This is the handoff to glass-ui's **BC** tranche (BB closed at 4.0.1). It is a
> coordination record — glass-ui's BC session formalizes the ASK items into its
> own waves. No glass-ui source is written from keyframes.js (the consume-edge
> discipline: publish-then-re-pin, never cross-write).

## INFORM (what glass-ui BC must know — the constellation moved)

1. **value.js 1.0.0 is published** (the campaign's library milestone). It is a
   superset of the 0.13.x glass-ui pins: comprehensive 2026+ CSS grammar (`@function`,
   `if()`, recursive at-rules, full nesting, `@scope`/`@starting-style`,
   scroll-timeline, system colors), the **subpath split** (`./color ./parsing
   ./math ./easing ./transform ./units ./quantize` — `./color` is grammar-free),
   semantic-idempotence (`parse(serialize(parse(s))) ≡ parse(s)`), and SOTA perf
   (+23–30% parse throughput). **BC should re-pin `@mkbabb/value.js ^1.0.0`** —
   glass-ui 4.0.1 already peer-widened to `^0.13.0 || ^1.0.0`, so the lockfile
   update is non-breaking. **Adopt the subpaths** where glass-ui imports only a
   slice (e.g. `@mkbabb/value.js/color` for color work) to shrink its bundle.

2. **parse-that 0.11.0 is published** — pure parsing primitives. Its CSS parser
   was REMOVED (zero consumers; value.js owns the one canonical grammar now). The
   packrat is `(id,offset)`-sound (full WDM). glass-ui does not consume parse-that
   directly; no action unless it transitively pins it.

3. **keyframes.js M consumes the constellation** and **keyframes.babb.dev is
   redeployed** on value.js 1.0.0 + parse-that 0.11.0 + glass-ui 4.0.1. The
   LIGHT/HEAVY boundary holds (inv α — the published kf LIGHT surface drags zero
   value.js; gated by `proof:boundary` + the new `proof:consume-bundle`). The
   headline consume win: `@keyframes` nested in `@layer`/`@media`/`@scope` now
   ingests (was silently lost).

4. **The N Stage scene-switcher (kf demo) is HANDOFF (DM-24)** — shelved per owner,
   impl preserved on the `n-stage-impl` branch. Its unshelf TRIPWIRE is glass-ui
   BC's dock redesign (see ASK-2). Until BC ships the dock, the production demo runs
   the L-close scene-switching (no Stage).

## ASK (what keyframes.js needs from glass-ui BC)

| # | ASK | Why | kf-side follow-up when BC ships |
|---|-----|-----|----------------------------------|
| **ASK-1** | **aria-orientation guard** — glass-ui's segmented/tabs control emits `aria-orientation` correctly so consumers don't need `:aria-orientation="undefined"` workarounds. | kf's `SpringSidebar.vue` carries a `:aria-orientation="undefined"` interim (M.W8 Phase-2 / S1). | kf deletes the workaround (`proof:workaround-deletion` flips GREEN). |
| **ASK-2** | **RF-17 dock pointer cure** — the glass-ui dock button pointer/double-tap handling (the `pointerHandled`/`onPlayPointerDown` interim in kf's `TransportDock.vue`). | kf carries a pointer-swallow workaround pending the glass-ui-root fix (memory: dock double-click is a glass-ui-root issue, never patch in the demo). | kf deletes `pointerHandled`/`onPlayPointerDown` (M.W8 Phase-2 / S2). |
| **ASK-3** | **the dock redesign (`W-DOCK-MORPH-FAMILY`)** — the dock base that hosts a scene-select affordance with a morph family. | The N Stage scene-switcher (kf demo) is shelved pending this; the Stage opens from the dock's scene-select. | N Stage unshelf → N.WZ integration (DM-24 tripwire). |
| **ASK-4** | **re-pin value.js `^1.0.0` + adopt the subpaths** (INFORM #1). | Keeps the constellation spine current; shrinks glass-ui's bundle via `./color` etc. | kf re-pins glass-ui to `~<BC>.x` (M.W8 Phase-2 pin bump) once BC publishes. |

## The pin/version state at this dispatch

| Package | Published | kf pins |
|---------|-----------|---------|
| `@mkbabb/parse-that` | **0.11.0** | `^0.11.0` |
| `@mkbabb/value.js` | **1.0.0** | `^1.0.0` |
| `@mkbabb/glass-ui` | 4.0.1 (BB close) | `~4.0.0` (resolves 4.0.1; → `~<BC>.x` at M.W8 Phase-2) |

## Deferred (BC-gated kf-M waves — NOT closed until glass-ui BC ships)

- **M.W8 Phase-2** — the aria/RF-17 workaround deletions (ASK-1/ASK-2).
- **M.W-DESIGN-PAINT** — the born-RED pixel-readback visual-truth gate over the
  BC-consumed demo.
- **M.W15** — demo-perf (lighthouse per scene, critical CSS, content-visibility) on
  the BC-consumed demo.
- **M.WZ** — the M close (gated on the BC-consumed demo's design/perf green).

These are the constellation's remaining downstream coordination; they do not block
the published libraries (parse-that 0.11.0, value.js 1.0.0) or the live deploy.
