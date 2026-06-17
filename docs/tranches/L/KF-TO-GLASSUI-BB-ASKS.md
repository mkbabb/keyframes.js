# KF → glass-ui BB — the L-tranche cross-repo dispatch

**Authored 2026-06-16 (L.W0 — the dev phase).** The glass-ui BB tranche is IN EXECUTION
(in-flight) — these asks land into a live tranche. This is the kf-side outbound dispatch:
five asks, each with the defect evidence, the specific ask, the kf-side consume gate
(born-RED on today's tree), and the named tripwire. The foreign-tree fence HOLDS throughout
— kf writes NO glass-ui source. Evidence cites `audit-32-skeleton.txt` (`⚠#`/`W#`/`★`),
`completion-lanes-32-36.txt §Lane #`, and file:line anchors in the kf tree.

Predecessor: `K/KF-TO-GLASSUI-BB-ASKS.md` (the K.W1′ §0 4.0.0 adopt + §2 outbound asks
dock-morph-family / peer-spine). This L dispatch folds the OPEN residue from that doc
(`W-DOCK-MORPH-FAMILY` still open at BB-in-flight; the peer-cycle ⚠8 un-resolved) plus
three net-new L-born asks (the a11y fix W24/W50, the GlassControlPoint W34/DL-K7, the
KF-OSCILLATOR co-schedule W128).

---

## §1 — SegmentedTabs pill-variant: omit `aria-orientation` on `role=group`
### (the a11y fix — `W24`/`W50`/`⚠1-3`/`viol1-3`)

**Defect.** `SegmentedTabs variant="pill"` renders as `role="group"` but glass-ui emits
`aria-orientation` on it unconditionally. The ARIA spec forbids `aria-orientation` on
`role=group` — the attribute is valid only on `role=scrollbar`, `role=separator`,
`role=slider`, `role=tablist`, `role=toolbar`, `role=treeitem` — not `group`. Every kf
consumer of the pill variant ships an invalid attribute on every scene.

**Audit evidence.** `audit-32-skeleton.txt §CROSS-REPO-ASK`: *"SegmentedTabs emits
`aria-orientation` unconditionally even on `role=group` (pill) — a genuine glass-ui
defect, NOT a kf concern"* (`/Users/mkbabb/Programming/glass-ui/src/c`). The consume-side
band-aid is `demo/spring/SpringSidebar.vue:43` (`:aria-orientation="undefined"`) — which, AS
THE AUDIT FOUND IT, suppressed the defect on ONE of TWO affected pill strips while
`AnimationControls.vue` carried the same invalid attribute UN-SUPPRESSED across every scene
(`⚠1`/`⚠2`/`⚠3` — the incomplete-fix). At L.W9 finalize that second strip was suppressed too
(the interim COMPLETED — see the Interim posture decision below); the un-suppressed-leak state
the audit named is the AS-FOUND record, now closed for the interim's duration.
`⚠2` names the inv-16 violation explicitly: the correct path is *"consume a FIXED published
glass-ui, not to locally correct an attribute glass-ui erroneously adds"* — the suppression is
the INTERIM, not the cure; the cure is the glass-ui BB root fix this §1 dispatches.

**The ask.** In the pill (`role=group`) branch of `SegmentedTabs`, add a one-line
conditional: emit `aria-orientation` ONLY when the rendered ARIA role is a role that
permits it (`tablist`, `toolbar`, `separator`, `slider`, `scrollbar`) — never on
`role=group`. This is a one-line guard in glass-ui's component source; every constellation
consumer is made correct at once.

**Fleet-wide blast radius (VERIFIED — L.W9 dispatch finalize, 2026-06-17).** A disk grep of
`variant="pill"` across `demo/` returns EXACTLY TWO render-site strips (the verification the
consume-edge owes per the wave spec's "the fleet-wide blast radius … must be VERIFIED before
claiming 'incomplete fix'"):

1. `demo/spring/SpringSidebar.vue:41` — the spring view-switcher (`variant="pill"`).
2. `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:67` — the
   control-surface strip (`variant="pill"`), rendered on every scene that mounts the controls.

The other `variant="pill"` grep hits are doc-comments / composable comments, not render sites.
So the invalid-`aria-orientation` blast radius is precisely these two strips — no third leak.

**Interim posture — DECISION (L.W9 dispatch finalize): COMPLETE the interim (suppress BOTH).**
The wave spec (`L.W9.md §S1`) named the honest choice: either suppress on BOTH pill strips so
the interim is COMPLETE (not half-applied), OR hold AS-IS and record the un-suppressed strip as
a KNOWN leak with the named tripwire. The decision taken is the FIRST: both strips now carry
`:aria-orientation="undefined"` so the demo emits NO invalid `aria-orientation` attribute
fleet-wide until glass-ui BB ships the root fix.

- `demo/spring/SpringSidebar.vue:43` — `:aria-orientation="undefined"` (pre-existing).
- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` —
  `:aria-orientation="undefined"` (ADDED at L.W9 finalize — the strip was previously the
  un-suppressed leak ⚠3 named).

The suppression is ITSELF the workaround whose deletion is gated on glass-ui BB. Completing it
does NOT close the workaround — it makes the interim WHOLE while it lasts. `proof:workaround-deletion`
S1 stays **PENDING** (PRESENT + glass-ui@4.1.0 UNPUBLISHED = exit 0 PENDING) — confirmed: the
gate scans `demo/**/*.vue` for the `:aria-orientation="undefined"` shape and reports PENDING
(not RED) because the sibling fix is unpublished; adding the second suppress kept the arm
PENDING→PENDING (no gate-state change, no green gate redded).

**kf-side consume gate.** Born-RED-staged today via `proof:workaround-deletion` S1: on the
glass-ui publish that guards the attribute, kf re-pins and DELETES BOTH suppress-lines in one
commit. The gate asserts ZERO `:aria-orientation="undefined"` occurrences in the demo tree —
PENDING today (both band-aids present, sibling unpublished), GREEN only on the glass-ui publish
that guards the attribute + the kf re-pin + the simultaneous deletion of both lines.

**Named tripwire.** glass-ui 4.x (any `4.0.x` patch or `4.1.0`) ships the pill-branch
`aria-orientation` guard. kf re-pins and deletes BOTH suppress-lines in one commit. The
kf-side `proof:no-aria-orientation-suppress` gate must RED (it finds `:aria-orientation`)
until that commit lands, then GREEN permanently.

**L wave.** `L.W9` (Band B) — DL-L10 row, workaround #4, the `:aria-orientation`
suppress-deletion arm.

---

## §2 — `W-DOCK-MORPH-FAMILY` / `RF-17` dock-flicker: the hover-expand edge case +
         the collapse-crossfade strand
### (`W18`/`W43`/`DL-K9`/`⚠5`)

**Defect.** glass-ui 4.0.0 (the BA cut, consumed at K.W1′) cured the BLK-8/3.13.0
collapse-flicker and oval-clip. But the kf demo still carries `onPlayPointerDown`/
`pointerHandled` — an interim click-strand workaround REVERTED-and-BOOKED at K.W1 because
the durable glass-ui dock-layer fix was deferred to BB's `W-DOCK-MORPH-FAMILY`. Two
strands remain open:

1. **Hover-expand edge case.** The dock expand/collapse transition triggers on HOVER, not
   just on intentional clicks — the morph fires on pointer-enter then progresses the rest
   of the animation from the intermediate state, causing a flash. `K/KF-TO-GLASSUI-BB-ASKS.md §2
   W-DOCK-MORPH-FAMILY` item (a): *"the morph animates a COMPOSITOR TRANSFORM not
   `inline-size` (no per-frame relayout)"* — the fix is the compositor-isolated expand path.

2. **Collapse-crossfade strand.** The collapsed→expanded transition retains a brief
   intermediate where the icon and label both appear at reduced opacity before the final
   state snaps — the kf demo `pointerHandled` guard is patching this ghost state at the
   consume seam rather than fixing the crossfade at source. `audit-32-skeleton.txt §CHRONIC-FOLD
   ♾ DL-K9`: *"kf interim retained, glass-ui handoff pending"*.

**Audit evidence.** `⚠5`: *"the kf `onPlayPointerDown`/`pointerHandled` interim (retained
at K.W1 after the REVERT of the 3.13.0 `useDockClickIntegrity` attempt) is a workaround of
a glass-ui primitive defect. Inv-16 and the no-workaround precept both indict it. L must
retire it on the 4.1.0 consume-edge, not carry a 3rd interim."* `DL-K9` has chronicity
3 (I, J, K → L) — it may not BOOK again under P-invariant-28.

**The ask.** `W-DOCK-MORPH-FAMILY` at BB closes both strands:
- The expand/collapse morph runs over a compositor `transform` track (not `inline-size`)
  so hover-triggered expand produces no relayout flash.
- The crossfade completes at the SETTLED geometry before icon visibility changes —
  no intermediate state where icon + label coexist at partial opacity.
- The PRM (prefers-reduced-motion) snap completes synchronously at target geometry
  (no blank-sliver P0 for reduced-motion kf users).

**kf-side consume gate.** Born-RED now: the `onPlayPointerDown`/`pointerHandled` interim
exists in the kf demo tree (`proof:rf17-net-deletion` gate — asserts ZERO occurrences of
`pointerHandled` in the demo tree). The gate is RED today; GREEN only when glass-ui 4.1.0
ships `W-DOCK-MORPH-FAMILY` + the RF-17 dock-layer collapse-crossfade strand fix + kf
re-pins `~4.1.0` + the interim is DELETED in the same commit.

**Named tripwire.** glass-ui 4.1.0 is the cut. kf re-pins `~4.1.0` and deletes both
`onPlayPointerDown` and `pointerHandled` in one commit. `proof:rf17-net-deletion` turns
GREEN. No interim carries to a 4th tranche under inv-16 / no-workaround.

**L wave.** `L.W9` (Band B) — `DL-L6` / `W43` / `W18`, the RF-17 net-deletion arm.

---

## §3 — The LIVE F-2 peer-cycle: glass-ui must widen `@mkbabb/value.js` peer range
### (`viol8`/`⚠8`/`Lane 36`)

**Defect.** glass-ui 4.0.0 (the current published cut) declares:

```json
"peerDependencies": {
  "@mkbabb/value.js": "^0.10.0 || ^0.11.0"
}
```

value.js 0.12.0 and 0.13.0 are both outside this range. kf 4.3.0 pins `^0.13.0`.
Any consumer installing `@mkbabb/keyframes` + `@mkbabb/glass-ui` together today gets
`ELSPROBLEMS` (peer-conflict error) from npm. This is not a theoretical risk — it is
live for every kf consumer on today's published surface.

**Audit evidence.** `audit-32-skeleton.txt §PRECEPT-VIOLATIONS ⚠8`: *"glass-ui's published
peer dependency `^0.10.0||^0.11.0` does not admit the published value.js 0.12.0 or 0.13.0,
producing a live peer-warning blast radius on any kf consumer that installs glass-ui +
value.js today."* `completion-lanes-32-36.txt §Lane 36 HIGH-severity`: *"F-2 glass-ui
peer-cycle is LIVE: value.js 0.13.0 fails glass-ui's `^0.10.0||^0.11.0` peer —
ELSPROBLEMS on every [consumer]."* `⚠8` also notes: *"The no-silent-drop law requires
BB's W-CLOSE to explicitly disposition every addendum row (land / point-release / BOOK
with named tripwire)."*

The no-workaround precept forbids kf papering over this with `npm overrides` or
`peerDependenciesMeta.optional`:

> *"the F-2 peer-cycle must NOT be papered over with an npm `overrides` block or a
> `peerDependenciesMeta` optional flag in kf's package.json — the correct fix is at the
> source (glass-ui's peer range)."* (`completion-lanes-32-36.txt §Lane 36 ⚠`)

**The ask.** In glass-ui's `package.json` (or a BB point-release), widen the
`@mkbabb/value.js` peer range to admit the published 0.13.0 (and ideally the Tranche O
`^0.14.0` that follows):

```json
"peerDependencies": {
  "@mkbabb/value.js": "^0.10.0 || ^0.11.0 || ^0.12.0 || ^0.13.0"
}
```

or a semver range that captures the whole `>=0.10.0 <0.15.0` band once the O-tranche
cadence is confirmed. The ask is range-widen only — no glass-ui source behavior changes.

**kf-side consume gate.** Born-RED today: `proof:peer-satisfied` (the NEW gate authored in
`L.W4`) runs `npm install --dry-run` over the full installed graph and asserts zero
`ELSPROBLEMS` lines. It is RED today because glass-ui `^0.10.0||^0.11.0` rejects
value.js 0.13.0. The gate stays RED until the glass-ui publish widens the peer range +
kf re-pins to the fixed cut; then GREEN permanently.

**Named tripwire.** glass-ui publishes a cut (point-release or 4.1.0) with the widened
`@mkbabb/value.js` peer range. kf's `proof:peer-satisfied` gate turns GREEN on re-pin.

**L wave.** `L.W4` (gate) + `L.W9` (Band B consume) — `DL-L3` / `⚠8` / Lane 36.

---

## §4 — GlassControlPoint: the keyframes-editor enabler decision
### (`W34`/`DL-K7`/`W45`)

**Context.** `GlassControlPoint` is the glass-ui curve-control primitive that would enable
kf's in-demo keyframes-editor (the `AX-1` / `DL-K7` 6-tranche chronic). kf has BOOKED this
since Tranche E (chronicity 6: E, F, G, H, I, J, K → L). The P-invariant-28 exit-only
mandate means this is the last tranche the BOOK is valid — a BOOK without a named tripwire
and a gate-first proof would breach the mandate (`K/audit/deferred-ledger-k.md DL-K7`:
*"EXITED K as HANDOFF with gate-first BOOK"*).

**Audit evidence.** `audit-32-skeleton.txt §CROSS-REPO-ASK`: *"GlassControlPoint AX-1
(5-tranche; keyframes-editor enabler) — HANDOFF to glass-ui; gate-first BOOK"*. `W34`:
*"GlassControlPoint build-in-kf decision (the keyframes editor enabler)"*. `W45`:
*"gate-first BOOK: `proof:control-point-live` authored BEFORE impl; then glass-ui 4.x ships
GlassControlPoint"*.

**The ask.** Is `GlassControlPoint` in BB scope, or deferred to a post-BB glass-ui minor?
kf needs a named disposition from BB:

- **Option A (BB-in-scope).** `GlassControlPoint` ships in BB (4.1.0 or a named BB
  sub-wave). kf authors `proof:control-point-live` gate-first (born-RED: the primitive
  absent in today's tree); then consumes the published primitive and builds the
  keyframes-editor view over it in `L.W9`.
- **Option B (post-BB, named-version commitment).** BB records `GlassControlPoint` as a
  NAMED future minor (e.g. `4.2.0`) with a named tripwire. kf carries `DL-L7` one more
  tranche as a HANDOFF-with-named-tripwire (exit-shaped for P-invariant-28); the
  `proof:control-point-live` gate is authored gate-first in the impl phase of that L wave.
- **Option C (KILL — scope-out permanently).** If `GlassControlPoint` is not glass-ui's
  charter, BB records it as OUT-OF-SCOPE; kf closes `DL-L7` as KILL and does not build
  the keyframes-editor over it. The 6-tranche chronic exits permanently.

**kf-side consume gate.** Gate-first: `proof:control-point-live` is authored BEFORE any
kf keyframes-editor impl — the gate must RED (the primitive absent) before the first
keyframes-editor source line. The gate goes GREEN when glass-ui ships the primitive + kf
consumes the published cut.

**Named tripwire.** BB disposition (Option A/B/C) recorded in BB's cross-repo-asks
response. If A: the glass-ui cut that ships `GlassControlPoint`. If B: the named
post-BB version. If C: the BB-close record marks it OUT.

**L wave.** `L.W9` (Band B) — `DL-L7` / `W45`, the GlassControlPoint consume or close.

---

## §5 — KF-OSCILLATOR co-schedule
### (`W128`/`W16`/`W60`)

**Context.** kf has BOOKED a LIGHT `Oscillator` primitive (a periodic phase clock: frequency
+ waveform → phase ∈ [0,1)) since the K.W1′ dispatch (`K/KF-TO-GLASSUI-BB-ASKS.md §1
KF-OSCILLATOR`: *"kf will add a LIGHT `Oscillator`/phase-clock primitive … BOOKED — kf
delivers a LIGHT `Oscillator` when speedtest/BB consumes it"*). The boundary law from that
doc is clear: curve MATH = value.js; playback/spring = kf; editor COMPONENT = glass-ui.

**Audit evidence.** `audit-32-skeleton.txt W128`: *"ship the BOOKED KF-OSCILLATOR LIGHT
primitive (periodic phase-clock: frequency + waveform → phase ∈ [0,1)) — dep: glass-ui
W-EASING-PRIMITIVE co-schedule (consume signal)"*. `W16` — the net-new LIGHT primitive.
`W60` — the BB cadence consume wave.

**The ask.** Confirm the BB wave (and specific sub-wave) that CONSUMES the `Oscillator`
primitive — the speedtest idle-breath consumer or `W-EASING-PRIMITIVE`. kf needs:

1. The named BB wave that uses `Oscillator` (e.g. `W-EASING-PRIMITIVE` or
   `W-SPEEDTEST-IDLE`).
2. The expected API shape from the consumer side — specifically whether the caller needs:
   - A raw `phase(t: number): number` fn (the simplest form), or
   - A full `Oscillator` class with `.tick(dt)`/`.reset()`/`.waveform` mutability (the
     richer form that `RAFPlayback` can drive).

**kf-side delivery.** The `Oscillator` primitive is value.js-FREE (LIGHT boundary — no
import of `@mkbabb/value.js`), exported beside `SmoothProgress`/`SpringProgress`/
`RAFPlayback` in the LIGHT static named exports of `src/animation/index.ts`. Its size is
~`SmoothProgress`-sized (~40 LOC). kf ships it in `L.W9` once the BB consume signal
confirms the wave + API shape.

**kf-side consume gate.** `proof:boundary` must stay GREEN after the `Oscillator` export
lands (the LIGHT boundary invariant — no value.js import in the `Oscillator` module). The
existing `proof:boundary` gate asserts this for all LIGHT exports; the `Oscillator` module
is a natural addition to the guarded set.

**Named tripwire.** BB confirms the consuming wave + API shape (a one-line record in BB's
cross-repo-asks response). kf authors and ships `Oscillator` to match. The consume signal
IS the tripwire — kf does not ship the primitive before the consumer confirms the shape.

**L wave.** `L.W9` (Band B) — `DL-L10` workaround #(n/a) / `W128` / `W60`, the
KF-OSCILLATOR deliver-and-consume wave.

---

## Constellation cadence (the single picture)

```
kf 4.3.0 (published; glass-ui ~4.0.0 consumed)
│
├─ §1 SegmentedTabs aria fix ───────► glass-ui 4.0.x patch or 4.1.0
│    kf-side: proof:workaround-deletion S1 (PENDING: 2 suppress lines present,
│             glass-ui@4.1.0 unpublished — interim COMPLETE on both pill strips)
│    → consume + delete both lines in one commit → GREEN
│
├─ §2 W-DOCK-MORPH-FAMILY / RF-17 ──► glass-ui 4.1.0 (the BB cut)
│    kf-side: proof:rf17-net-deletion (born-RED: pointerHandled interim)
│    → consume ~4.1.0 + delete interim → GREEN
│    (no 4th-tranche carry: DL-K9 chronicity 3; P-invariant-28 terminal)
│
├─ §3 F-2 peer-cycle ───────────────► glass-ui 4.0.x patch or 4.1.0
│    kf-side: proof:peer-satisfied (born-RED: ELSPROBLEMS on npm install)
│    → consume fixed-peer cut → GREEN
│    (live defect TODAY — the highest-urgency ask in this doc)
│
├─ §4 GlassControlPoint ────────────► BB disposition (A / B / C)
│    kf-side: proof:control-point-live authored gate-first BEFORE any impl
│    → consume on named-version publish → GREEN (or KILL on C)
│    (DL-L7 chronicity 6; P-invariant-28 exit-only; last BOOK)
│
└─ §5 KF-OSCILLATOR ────────────────► BB W-EASING-PRIMITIVE / W-SPEEDTEST-IDLE
     kf-side: proof:boundary stays GREEN (LIGHT, value.js-free)
     → ship once BB confirms wave + API shape → CONSUME
```

Everyone consumes the PUBLISHED predecessor; no cycle. kf is on `~4.0.0` today;
re-pins `~4.1.0` at the BB close in ONE commit that simultaneously: deletes both
`:aria-orientation` suppress-lines (§1), deletes the RF-17 interim (§2), and lets
`proof:peer-satisfied` turn GREEN (§3, if the peer range is in 4.1.0). §4 and §5 are
cadence-decoupled: §4 on BB's GlassControlPoint decision; §5 on BB's wave-confirmation.
