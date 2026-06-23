# keyframes.js → glass-ui Tranche Q (the BC publish) — the cross-repo dispatch (ASK + INFORM)

> Authored 2026-06-23 at the keyframes **Tranche Q** development phase (the
> no-deferral terminal tranche — `docs/tranches/Q/Q.md`). glass-ui is the DOWNSTREAM
> consumer on the constellation spine (**parse-that → value.js → keyframes.js →
> glass-ui**). This **supersedes and consolidates** the M/O dispatches
> (`docs/tranches/M/KF-TO-GLASSUI-BC.md` + `docs/tranches/O/KF-TO-GLASSUI-BC-ADDENDUM.md`):
> both asks are AUTHORED in glass-ui's tree but UNPUBLISHED to a kf-consumable version.
> Tranche Q's role is to formalize the **PUBLISH-READINESS** ask — the two fixes exist;
> the cross-repo need is a published version kf can re-pin.
>
> **inv-16 holds: no glass-ui source is written from keyframes.js.** glass-ui's BC
> session publishes the already-authored fixes; kf re-pins and deletes its workarounds
> on the publish. Publish-then-re-pin, never cross-write. **The glass-ui CUT is
> USER-DOMAIN** (`BD.W-CUT` is confirm-first — no tag, no publish, no push until the
> owner greenlights).

This dispatch is the binding cross-repo contract behind kf wave **Q.WG3** (the glass-ui
publish ask) + the GATED kf deletes (the S1/S2 arms in **Q.WG-GATED-CONSUMES**, GATED on
the publish). glass-ui Q sequences in parallel with the libraries (it is a leaf — nothing
downstream of it); its publish gates only the kf S1/S2 deletes.

> **The DECISIVE ground truth (`B2-pw12-dock-aria`, sibling-tree VERIFIED 2026-06-23
> against `/Users/mkbabb/Programming/glass-ui/`).** The aria guard IS authored but NOT
> published: `src/components/custom/tabs/SegmentedTabs.vue:406` (branch `prototype/liquid-dock`
> — VERIFIED the repo is on that branch) ALREADY carries the EXACT conditional guard
> `:aria-orientation="isUnderline ? (isVertical ? 'vertical' : 'horizontal') : undefined"`
> (VERIFIED byte-for-byte; the role split `:role="isUnderline ? 'tablist' : 'group'"` is the
> adjacent `:405`), BUILT in the branch dist, but NOT in the published npm 4.1.0 (VERIFIED —
> glass-ui `package.json` version `4.1.0`; the published `dist/tabs.js` emits `aria-orientation`
> unconditionally on `role=group`). It is hard-gated behind the unexecuted USER-DOMAIN
> `BD.W-CUT` (VERIFIED — `glass-ui/docs/tranches/BD/waves/BD.W-CUT.md` exists; `:14` references
> kf's content-aware `proof:glassui-aria-ask` as the discharge condition). kf installs `~4.0.0`
> (`package.json:224` VERIFIED → 4.0.1), whose dist STILL emits the prohibited attribute.
> **The fix is DONE in source; the ask is to PUBLISH it.**

---

## The ASK roster (two already-authored fixes + the bilateral gate + the 5.0.0 peer-widen)

> **Sibling-anchor verification (2026-06-23).** Every `file:line` anchor in this dispatch
> was re-confirmed against the LIVE glass-ui tree (`/Users/mkbabb/Programming/glass-ui/`,
> branch `prototype/liquid-dock`) + the kf-side workaround sites (this repo's `demo/`). ALL
> anchors held exactly: `SegmentedTabs.vue:406` (the byte-exact guard), `:405` (the role
> split), the `.dock-layer` collapse-crossfade strand (`src/styles/dock.css:22`), and the kf
> deletes (`SpringSidebar.vue:43`, `AnimationControls.vue:72`, `TransportDock.vue` script
> `:348-375` + template handlers `:151`/`:196`).
> All tagged VERIFIED inline.

| # | ASK | glass-ui surface (file:line, grounded in AUDIT-31 + VERIFIED 2026-06-23) | glass-ui Q deliverable | kf-side follow-up on the publish | born-RED gate |
|---|-----|---------------------------------------------------|------------------------|----------------------------------|---------------|
| **GU-Q1** *(the AUTHORED aria guard — PUBLISH it)* | **publish the role-conditional `aria-orientation` guard** — emit `aria-orientation` ONLY on `role=tablist`; OMIT it on `role=group` (the default `pill` strip carries a PROHIBITED ARIA attribute, WAI-ARIA 1.2 §6.3) | `src/components/custom/tabs/SegmentedTabs.vue:406` (branch `prototype/liquid-dock`) ALREADY = `:aria-orientation="isUnderline ? (isVertical ? 'vertical' : 'horizontal') : undefined"` (VERIFIED byte-for-byte; role split `:405` `:role="isUnderline ? 'tablist' : 'group'"` VERIFIED) — the correct guard, BUILT in the branch dist, UNPUBLISHED; the published 4.0.1/4.1.0 `dist/tabs.js` emits it unconditionally | carve a BC-only patch that ships JUST the `SegmentedTabs.vue:406` guard (NOT the entangled `prototype/liquid-dock` BF work) + publish it (USER-DOMAIN cut) | kf deletes BOTH `:aria-orientation="undefined"` suppress lines (`SpringSidebar.vue:43` + `AnimationControls.vue:72`) + re-pins to the cut version; `proof:workaround-deletion` S1 flips PENDING→GREEN | kf `proof:glassui-aria-ask` (NEW, content-aware): MOUNTS the published `SegmentedTabs variant="pill"`, asserts `role=group` carries `aria-orientation === null` — a version bump WITHOUT the SFC fix does NOT green it |
| **GU-Q2** *(the dock collapse-crossfade strand — the RF-17 cure)* | **author + publish a dock-internal collapse-crossfade layer-keepalive cure** so the `.dock-layer` carrying the play control survives the collapse-crossfade transition without a swallowed pointerdown | the kf band-aid is the `TransportDock.vue:348-375` `pointerHandled`/`onPlayPointerDown` twin (VERIFIED — `let pointerHandled = false;` at `:348`, `function onPlayPointerDown(e: PointerEvent)` at `:358`, the `@pointerdown` handlers at `:151`/`:196`; the dock collapse-crossfade click-strand); the glass-ui dock-morph layer drops/recreates the `.dock-layer` mid-crossfade (VERIFIED — `src/styles/dock.css:22` documents "the `.dock-layer` crossfade + hit-test"), swallowing the pointerdown (`B2-pw12-dock-aria` S2) | a glass-ui dock-internal keepalive that holds the active `.dock-layer` interactive across the collapse-crossfade (the layer-morph family fix; the EXACT keepalive API name is glass-ui's to choose + name) | kf deletes the `pointerHandled`/`onPlayPointerDown` twin (`TransportDock.vue` script `:348-375` + the two template `@pointerdown` handlers `:151`/`:196`) + re-pins; `proof:workaround-deletion` S2 flips PENDING→GREEN (the `/pointerHandled|onPlayPointerDown/` witness greps ALL `.vue` lines, so a half-delete leaving the template handlers keeps it RED) | kf `proof:live-session` S5: a motion-path PLAY through the dock produces motion (the swallowed-pointerdown band-aid removed, the play actually fires) |
| **GU-Q3** *(the bilateral gate — glass-ui side)* | **a born-RED glass-ui gate clause** asserting the rendered `pill` strip (`role=group`) does NOT carry `aria-orientation` | no gate in glass-ui or kf currently asserts this (`proof:tabs-ios` T4 checks `aria-pressed`/`aria-selected`/roving-tabindex but NOT orientation-absence) | a computed-attr check on the mounted `SegmentedTabs variant="pill"` returning `null`/`undefined` for `aria-orientation` on `role=group` | kf's `proof:glassui-aria-ask` (GU-Q1) is the consumer-side mirror; a glass-ui-side gate makes the contract BILATERAL (a future refactor can't silently re-introduce the prohibited emit) | glass-ui `proof:no-prohibited-aria` (NEW): the mounted `pill` strip's `role=group` carries zero `aria-orientation` |
| **GU-Q4** *(the 5.0.0 peer-range widen — escalated from Band Z)* | **widen glass-ui's `@mkbabb/keyframes.js` peer range to admit the breaking kf 5.0.0** so the constellation does not peer-conflict the instant kf cuts 5.0.0 (Band E) | glass-ui declares a `keyframes.js` peer pinned to the current major (`^4.x`); kf's Q.WE1/Q.WZ 5.0.0 BREAKING cut would put glass-ui's peer range OUTSIDE the published kf — an install-time peer conflict for any consumer on both. (AUDIT-31:356-357 pre-records the symmetric `keyframes-vue peer floor` bump + `proof:peer-satisfied`.) | bump the peer range to `"^4.0.0 \|\| ^5.0.0"` (admit BOTH the current major and the breaking 5.0.0) in glass-ui's `package.json` `peerDependencies` — a non-breaking widen | kf side: nothing to delete; the GATED consume edge (Q.WZ 5.0.0 cut) requires this widen to have landed, else the published 5.0.0 strands glass-ui consumers | kf `proof:peer-satisfied` (NEW, Q.WZ-owned): the installed glass-ui's declared kf peer range SATISFIES the kf 5.0.0 it ships beside — RED while glass-ui peers `^4.x` only |

Both fixes are **non-breaking** to glass-ui's consumers: GU-Q1 OMITS a prohibited
attribute (a strict improvement — AT ignored it anyway, conformance checkers FLAGGED it);
GU-Q2 is a dock-internal interaction cure (no public-API change). A single BC patch
(over 4.1.0) ships both.

---

## GU-Q1 — the aria-orientation guard (PUBLISH the already-authored fix)

> **AUDIT verdict (`B2-pw12-dock-aria`): RED-GATE / FALSE-RED CHRONIC.** The guard is
> AUTHORED but NOT PUBLISHED — the kf S1 gate is a CONFIRMED FALSE-RED that FAILS CI
> today (`proof:workaround-deletion` exits 1 with S1=RED, printing "the deletion is now
> SAFE and OVERDUE" — WRONG: deleting the suppress now re-introduces the prohibited
> attribute, because the installed dist STILL emits it).

**The ARIA-spec ground truth (carried from the O addendum, unchanged).** The defect is
NOT "the emitted orientation value is wrong/missing" — the value is correctly axis-derived.
The defect is that **`aria-orientation` is emitted on a role that PROHIBITS it.** Per
WAI-ARIA 1.2 §6.3, `aria-orientation` is supported on a closed set of roles (`scrollbar`,
`select`, `separator`, `slider`, `tablist`, `toolbar`; inheriting into `listbox`, `menu`,
`menubar`, `radiogroup`, `tree`, `treegrid`) — and is NOT a supported property of
`role=group`. `SegmentedTabs.vue` renders TWO roles off the one `variant` axis:

| variant | role rendered | `aria-orientation` | ARIA 1.2 §6.3 |
|---------|---------------|--------------------|---------------|
| `underline` | `tablist` | emitted | **PERMITTED** ✓ |
| `pill` (**DEFAULT**) | `group` | emitted | **PROHIBITED** ✗ |

**The fix EXISTS — the ask is to PUBLISH it.** `src/components/custom/tabs/SegmentedTabs.vue:406`
(branch `prototype/liquid-dock`) ALREADY carries the minimal correct guard (VERIFIED
byte-for-byte 2026-06-23; the role split is the adjacent `:405`
`:role="isUnderline ? 'tablist' : 'group'"`):

```vue
:aria-orientation="isUnderline ? (isVertical ? 'vertical' : 'horizontal') : undefined"
```

Vue omits an attr bound to `undefined`, so the `pill` (`group`) strip renders NO
`aria-orientation` while the `underline` (`tablist`) strip keeps it. This transplants the
EXACT `PagerDots.vue:124` role-keyed-undefined-drop idiom — the library speaks ONE
aria-orientation discipline (emit-iff-on-an-allow-listed-role).

**The ENTANGLEMENT friction (the carve-off, pre-empted).** The guard lives on the
`prototype/liquid-dock` branch alongside in-flight BF tranche work (deep-glass 20px,
aurora WGSL, forms-card-fold). Asking glass-ui to publish "the branch" would pull
unstable liquid-dock work into the kf demo (an unbounded-scope visual-regression risk —
the FRICTION the lane named). PRE-EMPT: the ASK is to carve a **BC-ONLY patch** that
ships JUST the `SegmentedTabs.vue:406` guard (a one-line SFC change + the GU-Q3 gate),
NOT the entangled BF work. The cut version is a BC patch over 4.1.0, not the liquid-dock
major.

**The kf consume condition (stronger than a version number).** kf gates the S1 deletion
on the **SFC fix landing in a published version**, NOT merely on the cut version number.
The tripwire is OBSERVABLE: the published `SegmentedTabs` mounted with `variant="pill"`
renders `role=group` with `aria-orientation === null`. A cut WITHOUT this SFC fix does NOT
discharge the ask — kf's content-aware gate (`proof:glassui-aria-ask`) stays RED.

**Born-RED gate (kf-side, `proof:glassui-aria-ask` — the content-aware bilateral lock).**
RED today: the installed glass-ui dist (4.0.1) emits `aria-orientation` on `role=group`
(the gate mounts the published pill and reads `role=group`'s `aria-orientation` → it is
present, not `null`). GREEN when the cut publishes the guard AND kf re-pins. This is the
CONTENT-aware gate the O addendum named (`proof:glassui-aria-ask`, referenced by glass-ui's
`BD.W-CUT.md:14` but ABSENT from `scripts/`) — Q.WG-S1S2-HYGIENE AUTHORS it (the kf
runtime DOM-readback half of the bilateral lock). It is the FALSE-RED cure: it asserts on
the installed dist CONTENT, not the published version number.

---

## GU-Q2 — the dock collapse-crossfade strand (the RF-17 cure)

**The need, grounded (`B2-pw12-dock-aria` S2; anchors VERIFIED 2026-06-23).** kf carries the
`TransportDock.vue:348-375` `pointerHandled`/`onPlayPointerDown` twin (VERIFIED — `let
pointerHandled = false;` at `:348`, `onPlayPointerDown` at `:358`) — a band-aid for a
swallowed pointerdown when the glass-ui dock collapse-crossfade transition drops/recreates
the `.dock-layer` carrying the play control mid-crossfade (VERIFIED — the `.dock-layer`
crossfade is a real glass-ui dock layer, `src/styles/dock.css:22`). The S2 arm's CURE is
currently ORPHANED in both repos (the
gate's sibling probe keyed on the wrong glass-ui wave name + checked only that 4.1.0 is
published, NOT that the dock-strand cure is present).

**The cure (a glass-ui dock-internal keepalive).** Author a dock-internal collapse-crossfade
layer-keepalive that holds the active `.dock-layer` interactive across the transition — so
the layer carrying the play control survives the crossfade without dropping the pointerdown.
The EXACT keepalive API name is glass-ui's to choose (the layer-morph family fix); kf
consumes whatever glass-ui publishes.

**The forward-dependency friction (RESOLVED — a STRUCTURAL dist-signature probe + a
SEPARATE behavioral consume-gate, neither an unnamed-string grep).** A naive "GU-Q2 will
NAME the keepalive API and kf greps the dist for that string" is NOT pre-emptable: the API
name does not exist until glass-ui authors GU-Q2, so the kf content-probe pattern cannot be
written ahead of it (a true forward dependency, not pre-empted by a promise). The RESOLUTION
is TWO independent observables, neither needing a forward-named public API string:
1. **The cheap, device-INDEPENDENT gate-correctness probe** (`glassCaps.dockStrandKeepalive`
   in `proof:workaround-deletion`): a dist-content grep for the STRUCTURAL signature the cure
   necessarily leaves — the `.dock-layer` retaining `pointer-events`/hit-test across the
   collapse-crossfade (the keepalive holds the active layer interactive instead of the current
   drop/recreate). This reads the structural dist change, NOT a public API name.
2. **The device-bearing behavioral consume-gate** (`proof:live-session` S5, separate): mount/
   drive the installed dock through a collapse-crossfade and assert a `pointerdown` on the
   play-control `.dock-layer` LANDS (not swallowed). This is the runtime truth, run in the
   live session — NOT inline in `proof:workaround-deletion` (which stays portable).
GU-Q2's deliverable needs only to make the BEHAVIOR true + leave the structural dist signature
(the API name is glass-ui's free choice, never a kf grep-dependency). If glass-ui declines
GU-Q2, the kf S2 twin stays (recorded — a glass-ui-owned defect kf cannot self-cure) and S2
holds PENDING via both probes seeing the swallow persist — never a perpetual false-RED.

**Born-RED gate (kf-side, `proof:live-session` S5 — the dock-PLAY leg, VERIFIED present).**
`proof:live-session` S5 already exercises a PLAY through the global `TransportDock` (the
RF-17 collapse/morph handoff, `proof-live-session.mjs:427` polls "until the play tracks"; the
dock-play at `:1033`). Today S5 PASSES — but ONLY because the `pointerHandled`/`onPlayPointerDown`
band-aid twin (+ a fallback actuation at `:1041`) compensates for the swallowed pointerdown.
The discriminating born-RED is a PLANTED deletion: remove the twin on TODAY's installed dist
(4.0.1, no keepalive) → the collapse-crossfade swallows the pointerdown → S5's dock-PLAY
produces NO motion → RED. GREEN when the glass-ui keepalive publishes + kf deletes the twin +
re-pins: the PLAY fires through the kept-alive layer with the twin GONE. (This is the same
behavioral observable `glassCaps.dockStrandKeepalive` delegates to — no API-name string.)

---

## GU-Q3 — the bilateral gate (glass-ui side)

**The need (the contract is currently kf-only).** kf's `proof:glassui-aria-ask` (GU-Q1)
is the CONSUMER-side mirror, but no glass-ui-side gate asserts the constraint — so a future
glass-ui refactor can re-introduce the prohibited emit without reding any glass-ui gate
(only kf's consumer gate would catch it, and only on a kf re-pin).

**The cure.** A glass-ui-side `proof:no-prohibited-aria` clause: a computed-attr check on
the mounted `SegmentedTabs variant="pill"` returning `null`/`undefined` for
`aria-orientation` on `role=group`. This makes the contract BILATERAL — both repos speak
the same aria discipline, and a regression reds at the source (glass-ui) AND at the consume
(kf), per the `BD.W-CUT.md` runbook's "bilateral content-aware lock."

**Born-RED gate (glass-ui-side, `proof:no-prohibited-aria`).** RED on the 4.0.1/4.1.0
unconditional-emit dist; GREEN when the guard lands. This is glass-ui's gate to author; kf
names it for the coordination contract.

---

## INFORM (what glass-ui Q must know — the DAG, the carve-off, the kf delete edges)

1. **The DAG — glass-ui is a LEAF; its publish gates ONLY the kf S1/S2 deletes.**

   ```
   parse-that Q ─► value.js Q ─► keyframes Q
                                      │
   glass-ui BC publish (GU-Q1/Q2, USER-DOMAIN) ─► kf S1/S2 delete (GATED, Q.WG-GATED-CONSUMES) ─► Q.WZ
   ```

   Nothing downstream of glass-ui blocks on it; the kf S1/S2 deletes are GATED on the BC
   publish (a USER-DOMAIN cut). If the BC cut does not ship during Q, the deletes cannot
   fire — but they are SPECIFIED NOW (GATED, terminal-on-publish), never deferred.

2. **The carve-off (GU-Q1).** The ask is a BC-ONLY patch over 4.1.0 shipping JUST the
   `SegmentedTabs.vue:406` guard + the GU-Q3 gate — NOT the entangled `prototype/liquid-dock`
   BF work. This bounds the scope (no unstable liquid-dock pull into the kf demo) and keeps
   the cut a clean BC patch.

3. **The kf delete edges (GATED on the publish; kf-side anchors VERIFIED 2026-06-23).** On
   the BC cut shipping the guard + the keepalive:
   - kf re-pins `package.json` glass-ui from `~4.0.0` (`package.json:224`, VERIFIED) to the
     cut version (consume-and-delete in ONE atomic wave — the no-orphan-pin discipline).
   - kf deletes the S1 suppress lines (`SpringSidebar.vue:43` + `AnimationControls.vue:72` —
     both VERIFIED to carry `:aria-orientation="undefined"`) — `proof:workaround-deletion` S1
     RED→GREEN (witness ABSENT, `apiPresent` true on the content-probe).
   - kf deletes the S2 dock twin (`TransportDock.vue` script `:348-375` + the two template
     `@pointerdown` handlers `:151`/`:196` — VERIFIED; a half-delete leaving the template
     handlers keeps the witness RED) — S2 RED→GREEN.

4. **The USER-DOMAIN cut (the publish is the owner's hand).** `BD.W-CUT` is confirm-first
   — EXECUTES NOTHING (no tag, no publish, no push) until the owner greenlights. This
   dispatch is the publish-READINESS ask; the cut itself is USER-DOMAIN. The kf side stays
   GATED until the content-probe sees the fix in the installed dist.

---

## The pin/version state at this dispatch

| Package | Published | kf pins | kf re-pin on the BC publish |
|---------|-----------|---------|------------------------------|
| `@mkbabb/glass-ui` | 4.1.0 (VERIFIED — glass-ui `package.json` version `4.1.0`; the guard NOT in its dist — hard-gated behind the unexecuted `BD.W-CUT`); branch `prototype/liquid-dock` carries the authored guard (VERIFIED — `SegmentedTabs.vue:406`) | `~4.0.0` (`package.json:224` VERIFIED → installs 4.0.1, whose dist STILL emits the prohibited attribute) | re-pin to the BC cut version (the one carrying the published guard + keepalive) at Q.WG-GATED-CONSUMES |

---

## Net actions

**glass-ui Tranche Q / BC (the sibling — to author + publish in glass-ui's tree, never
from kf; the CUT is USER-DOMAIN):**
1. **GU-Q1** — carve a BC-only patch shipping the already-authored `SegmentedTabs.vue:406`
   aria guard (NOT the entangled liquid-dock BF work) + publish it (USER-DOMAIN cut).
2. **GU-Q2** — author + publish the dock-internal collapse-crossfade layer-keepalive cure
   (name the keepalive API / dist marker so kf can content-probe it).
3. **GU-Q3** — author the glass-ui-side `proof:no-prohibited-aria` gate (the bilateral lock).

**keyframes.js (the NOW gate-hygiene + the GATED deletes):**
1. **NOW (Q.WG-S1S2-HYGIENE):** retarget the `proof:workaround-deletion` S1/S2 arms to
   content-aware `glassCaps` probes (close the false-RED that fails `proof:hygiene` today);
   author `scripts/proof-glassui-aria-ask.mjs` (the runtime DOM-readback half of the
   bilateral lock).
2. **GATED on the BC publish (Q.WG-GATED-CONSUMES):** re-pin glass-ui to the cut version;
   delete the S1 suppress lines + the S2 dock twin; S1/S2 flip RED→GREEN.

**The contract.** glass-ui publishes the already-authored fixes (USER-DOMAIN cut); kf
re-pins + deletes on the content-observed publish. Neither writes the other's tree (inv-16).
The gate roster — kf `proof:glassui-aria-ask` (the content-aware consumer mirror) +
glass-ui `proof:no-prohibited-aria` (the bilateral source gate) + kf
`proof:workaround-deletion` S1/S2 (the delete oracle) + kf `proof:live-session` S5 (the
dock-PLAY observable) — is the binding cross-repo oracle. The consume fires when the
INSTALLED glass-ui dist CONTENT carries the fix (the content-probe), not on the version
number alone.

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT dispatch packet — **DOCS ONLY** (inv-16: kf writes
only keyframes.js; every cross-repo need is a *dispatch*, never a foreign-tree edit).
glass-ui's BC session publishes the already-authored fixes in glass-ui's own tree; kf
re-pins and deletes its workarounds on the publish. Every ASK carries a **falsifiable
born-RED gate** (GU-Q1: the kf content-aware `proof:glassui-aria-ask` mounts the published
pill and reads `role=group`'s `aria-orientation` — RED on the prohibited-emit dist, GREEN
only with the SFC fix; GU-Q2: the kf `proof:live-session` S5 dock-PLAY observable; GU-Q3:
the glass-ui-side mounted-attr check). The glass-ui CUT is **USER-DOMAIN** (confirm-first,
no auto-tag). The kf S1/S2 deletes open only on the content-observed publish, DAG-ordered.
The aria guard is the ONE item re-opened versus the O addendum's correction (it is
AUTHORED, the ask is to PUBLISH); the dock strand is its RF-17 partner. observable-truth
(the content-probe, not the version), no-legacy, no-deferral (the GATED deletes are
terminal-on-publish, the gate-hygiene is NOW), gestalt throughout.
