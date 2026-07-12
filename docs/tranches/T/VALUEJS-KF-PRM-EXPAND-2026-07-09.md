# VALUEJS-KF-PRM-EXPAND — 2026-07-09 (the single keyframes-routed item of the value.js Tranche T packet series)

**From**: the value.js Tranche T orchestrator (W0-1 packet dispatch) · **To**: @mkbabb/keyframes.js.
**Provenance**: value.js `docs/tranches/T/audit/SYNTHESIS.md §4 §KF` + `letters/GLASSUI-T-ASKS.md §KF`.
**Status**: **an ASK** (a one-line PRM correctness cure) — re-cited at current line numbers and
**re-verified STILL LIVE** at the keyframes HEAD below. Dispatched SEPARATELY to this inbox per
value.js's consolidation law (PRM-expand is NEVER folded into the glass-ui packet — it roots in
keyframes, so it comes to keyframes).

**Written to STAND ALONE** — assume zero shared session memory. Sibling to
`../S/VALUEJS-KF-COURTESY-2026-07-05.md` + `../S/VALUEJS-R-COORDINATION-2026-07-03.md` (the prior
value.js→kf coordination notes). Placement: landed in `docs/tranches/T/` to match the value.js
tranche + the existing `KF-TO-VALUEJS-T.md` sibling; re-home if your U inbox prefers.

**Verified keyframes HEAD**: `e3d0ae5` (branch `tranche-u-dev`, npm **5.2.0**; stamped at dispatch
**2026-07-10**). value.js is at **3.1.0** (registry `latest`), tranche T executing.

---

## The ask — PRM-expand: the `springPlay` reduced-motion arm never emits to the `.play(onFrame)` callback

**The defect (STILL LIVE at 5.2.0 / `e3d0ae5`).** In
`src/animation/physics/spring/managed-play.ts`, `springPlay(spring, onFrame)` (`:42-60`) binds the
callback to the single-slot channel `spring._onFrame = onFrame` (`:47`; the field is declared
`progress.ts:125`, driven only by `springStartLoop`'s `_playback.drive`, `:29-31`). It then routes
on the reduced-motion policy:

```
withReducedMotion(
    spring.respectReducedMotion,
    () => spring.snap(),                 // :48/:51  — the PRM (reduced) arm
    () => {                              // :52-58   — the normal arm
        if (spring.settled) {
            onFrame?.(spring.value, spring.velocity);   // :54 — emits onFrame DIRECTLY
            return;
        }
        springStartLoop(spring);
    },
);
```

Under an active reduced-motion query the PRM arm is `() => spring.snap()`. That path is
`snap()` (`progress.ts:356`) → `_snapSettled()` (`progress.ts:230-239`) → `this.emit()`
(`:237`), and `emit()` (`progress.ts:461-466`) iterates the **`.subscribe()` `subscribers` SET
ONLY** — it never touches `spring._onFrame`. So a consumer that called `.play(onFrame)` (the
single-callback channel) receives **NO settled frame** under PRM: `_onFrame` is set but never
invoked, the loop never arms, and `emit()` has no subscriber for it.

Contrast the NORMAL settled branch (`managed-play.ts:53-55`), which calls `onFrame?.(spring.value,
spring.velocity)` **directly**. The two arms are asymmetric: the normal arm emits the settled
value to `.play()`'s callback, the PRM arm does not. That asymmetric omission is the whole defect
— the `.play()` API silently no-ops its callback under `prefers-reduced-motion: reduce`.

**Why it matters upstream.** This is the root of the glass-ui **dock PRM-expand** defect (an
armed-under-PRM spring whose consumer waits on the `.play()` frame that never comes). value.js
booked this S-era; the S-cut keyframes never carried the fix, and the T re-verification (value.js
`t-a11y-contrast §6`, 2026-07-07) found it unchanged. It is line-refreshed and re-confirmed here
at `e3d0ae5`.

**The one-line cure (yours to shape — the idiomatic form is the producer's call).** Make the PRM
arm emit `onFrame` once, the same way the normal settled branch does. E.g. the reduced arm
becomes `() => { spring.snap(); onFrame?.(spring.value, spring.velocity); }`, OR route the
`.play()` callback through a subscriber so `_snapSettled().emit()` reaches it, OR have
`_snapSettled` fan out to `_onFrame` alongside `subscribers`. Any of these closes the gap; the
constellation only needs `.play(onFrame)` to deliver its one settled frame under PRM.

**Cite summary** (all at `e3d0ae5`):
- `managed-play.ts:42-60` — `springPlay`; `:47` sets `_onFrame`; `:48/:51` the PRM arm
  `() => spring.snap()`; `:53-55` the normal arm's direct `onFrame?.(…)`.
- `progress.ts:125` — `_onFrame` field; `:230-239` — `_snapSettled()` (`:237` `this.emit()`);
  `:356-357` — `snap()` → `_snapSettled()`; `:454-457` — `subscribe()`; `:461-466` — `emit()`
  iterates `subscribers` only.

---

**No gate.** Nothing in value.js waits on this — it is a courtesy-class correctness ask with no
value.js wave blocked on it (value.js records it as a book, not a gate). value.js re-verifies at
its T close. If you fix it, a note back (or a `dist-tags` bump value.js can watch) closes the loop;
if you judge it working-as-intended, say so and value.js retires the book. This is the ONLY
keyframes-routed item in the T packet series — the glass-ui asks (P1–P10) went to the glass-ui BG
inbox as `VALUEJS-T-ASKS-2026-07-09.md`.
