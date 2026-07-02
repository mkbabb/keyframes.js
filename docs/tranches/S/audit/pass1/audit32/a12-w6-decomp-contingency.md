# a12 — R.W6-decomp + the DM-1/DM-5 CONTINGENCY KILLs

**Lane:** a12-w6-decomp-contingency (Tranche R deep audit, pass 1, audit32)
**Scope:** `R.W6` demo band (`docs/tranches/R/waves/R.W6.md`) with focus on the two chronic-ledger
exits landed as CONTINGENCY KILLs — **DM-5** (`e4d8d03`, the `KfPillTabs.vue` SegmentedTabs
replacement) and **DM-1** (`25b3a13`, the `TransportDock.vue` pointerup+keydown play handler).
**Question posed:** are these kf-internal replacements GESTALT quality, or hurried stand-ins that S
must redo — especially with glass-ui 5.0.0 (BG/BH) landing dock changes? ARIA compliance of
KfPillTabs (roving tabindex, aria-selected, orientation)?
**Ground rule:** analysis only. No source touched. Branch left on `tranche-s-dev`.

---

## Executive summary

The two KILLs are **not cosmetic** — both pick a genuinely better primitive than the glass-ui
band-aid they replace. `KfPillTabs` is a `role=tablist`/`role=tab` panel switcher, which is the
*correct* WAI-ARIA pattern where glass-ui's `SegmentedTabs` pill was a `role=group` emitting
`aria-orientation` unconditionally (a real WCAG breach). The CSS is token-sourced and clean. So the
strategic call ("replace, don't suppress") was sound.

**But the execution of both KILLs is a hurried stand-in in exactly the place that mattered — the
keyboard interaction — and one of the two is a demonstrable functional defect, not a nicety:**

1. **`KfPillTabs` roving-tabindex is broken beyond a single hop.** The arrow handler moves
   *selection* (`emit update:modelValue`) but **never moves DOM focus** to the newly-selected tab.
   Because focus stays pinned to the originally-focused button, every subsequent arrow press
   recomputes from that button's *stale* closure value — so keyboard traversal collapses to one
   step and cannot reach a third tab. The `stripOptions` control-surface strip (3+ tabs) is the live
   victim. The wave's "ARIA-correct BY CONSTRUCTION" claim (`KfPillTabs.vue:9`) is **false for the
   keyboard contract** — the entire reason roving-tabindex exists is to coordinate focus with
   selection, and that coordination is the missing line. **HIGH.**

2. **`TransportDock`'s `keydown` handler re-fires on Space/Enter auto-repeat.** By excising the
   native `click` and actuating on raw `keydown`, holding Space or Enter now rapid-toggles play/pause
   at the key-repeat rate. Native buttons activate Space on *keyup* precisely to avoid this; the KILL
   traded the crossfade-strand race for a new input-semantics regression. **MEDIUM.**

3. The **gate that was supposed to keep these honest is now dead for these two arms.**
   `proof:workaround-deletion` S1/S2 go GREEN by the *absence* of the old band-aid string
   (`aria-orientation=undefined`, `pointerHandled|onPlayPointerDown`). The KILL deleted those
   strings, so the arm short-circuits to GREEN before ever probing the sibling publish. When
   glass-ui 5.0.0 (BG/BH) ships the dock-layer keepalive + the SegmentedTabs aria-guard, **no gate
   re-opens** to tell S to reconcile. The kf-internal stand-ins become permanent-by-default with
   their tracking severed. **MEDIUM (process residue).**

Neither replacement carries a test. The keyboard defect (#1) and the repeat defect (#2) would both
have been caught by a 15-line vitest of the very component the wave authored.

**Verdict:** GESTALT *choice*, hurried *implementation*. S inherits a keyboard-broken tablist that
looks finished, a play button with two new input-semantics bugs, and a gate that no longer points at
either. S should (a) fix `KfPillTabs` focus management + add Home/End + `aria-controls` linkage and
promote it to a real tested `@/` primitive, (b) reconcile the TransportDock handler against glass-ui
5.0.0's keepalive (revert to `@click` if the keepalive lands, else fix Space-on-keyup), and (c)
re-arm the workaround-deletion ledger so a shipped upstream cure is not silently ignored.

---

## Findings

### F1 — `KfPillTabs` roving-tabindex moves selection but not focus → keyboard traversal collapses after one hop — **HIGH**

**Evidence:** `demo/@/components/custom/KfPillTabs.vue:66-79` (the `onKeydown` handler),
`:tabindex="opt.value === modelValue ? 0 : -1"` at line 25. No `.focus()` call exists anywhere in
the component, in `SpringSidebar.vue`, or in `AnimationControls.vue`
(`grep '\.focus()'` over all three returns nothing).

**The mechanism (by construction from the code):**

- `onKeydown` is bound per-button, closing over that button's own `value` (`@keydown="onKeydown($event, opt.value)"`, line 30).
- On ArrowRight it computes the neighbor of *its own* `value` and does `emit("update:modelValue", next.value)` (line 78). That flips the reactive `tabindex` — the new tab becomes `0`, the old becomes `-1` — but **DOM focus is never moved off the originally-focused button.**
- The now-`tabindex=-1` old button still holds focus, so the *next* ArrowRight fires the **same** button's `onKeydown` with the **same stale `value`**, recomputing the same neighbor. Traversal is stuck one step from the entry tab; a third tab is unreachable by keyboard within a focus session.

**Live impact:** `AnimationControls.vue:314-324` `stripOptions` = `builtInTabs` (up to Controls /
Keyframes / Timeline) unioned with scene `extraControlTabs` — routinely 3+ tabs. That strip cannot
be keyboard-traversed past the neighbor of the entry tab. The spring `VIEW_OPTIONS`
(`SpringSidebar.vue:177`) has 2 options, so it *accidentally* works (the two-element wrap masks the
bug) — which is exactly why a source-shape gate + a 2-tab manual check would call this "fine."

**Why the wave's claim is wrong:** `KfPillTabs.vue:9` — "ARIA-correct BY CONSTRUCTION." The `role`,
`aria-selected`, `aria-orientation`, and initial single-tab-stop are correct; the **automatic-
activation focus contract is not**. APG requires that in a tablist where selection follows arrow
keys, the arrow key move *focus* (`element.focus()`) and let selection follow focus. This component
inverts that: selection follows the key, focus never follows selection.

**Proposal:** capture per-`value` button refs (or `event.currentTarget.parentElement.children`
lookup) and, after emitting the new `modelValue`, `nextTick(() => nextBtn.focus())`. Add Home/End
(first/last enabled). This is the load-bearing fix; without it the strip is not keyboard-operable.

---

### F2 — `TransportDock` `onPlayKeydown` actuates on raw `keydown` → Space/Enter auto-repeat rapid-toggles play — **MEDIUM**

**Evidence:** `demo/@/components/custom/animation-controls/TransportDock.vue:348-356` (`onPlayKeydown`
calls `actuatePlay()` on every `keydown` where `key` is Enter/Space/Spacebar), wired at lines 149 &
194. The KILL deliberately removed the native `click` path (`25b3a13` diff: `@click` → `@keydown`).

**The mechanism:** the target is a native `<button>` (glass-ui `Button`). Holding a key emits
repeated `keydown` events at the OS key-repeat rate. Because `actuatePlay()` runs on every one of
them (and `e.preventDefault()` suppresses the native click that would otherwise dedupe), **holding
Space or Enter toggles play/pause repeatedly.** Native button semantics fire Space on *keyup* (once
per press) specifically to avoid this; by excising `click`, the KILL reintroduced the exact repeat
hazard the platform designed around.

**Contrast with what was removed:** the prior band-aid (`pointerHandled` + `onPlayClick`) still
routed keyboard through the native synthesized `click` — which is single-fire per press. The KILL's
"keydown directly" is *more* strand-proof but *less* correct as a button.

**Proposal:** either (a) if glass-ui 5.0.0 lands the dock-layer keepalive (GU-Q2 / BG-BH), revert to
plain `@click="actuatePlay"` — the whole handler exists only because the keepalive was missing; or
(b) if kept, actuate Space on `keyup` (guard a matching `keydown` to prevent scroll) and Enter on
`keydown`, mirroring native semantics — not both on `keydown`.

---

### F3 — `onPlayPointerUp` activates on any pointerup over the button, including drag-release — **MEDIUM (edge)**

**Evidence:** `TransportDock.vue:342-346`. The guard is only
`if (e.button !== 0 && e.pointerType === "mouse") return;` — there is **no check that the pointerdown
originated on this button.** `pointerup` fires whenever a pointer is released *over* the element,
even if the press began elsewhere and the pointer was dragged onto it (e.g. a drag started on the
timeline diamond or a stray body drag released over the play pill). That is not `click` semantics —
`click` requires down+up on the same target. There is also no `e.isPrimary` guard, so a secondary
touch's pointerup in a multi-touch gesture can toggle.

**Proposal:** this evaporates if F2's revert-to-`@click` path is taken. If `pointerup` is retained,
gate on a `pointerdown`-on-same-button flag (which is what the *removed* `pointerHandled` boolean
essentially was — the KILL threw out the de-dupe *and* the press-origin guard together) and add
`if (!e.isPrimary) return;`.

---

### F4 — `proof:workaround-deletion` S1/S2 go GREEN by witness-absence → the sibling probe is now dead; a shipped glass-ui 5.0.0 cure re-opens nothing — **MEDIUM (process residue)**

**Evidence:** `scripts/proof-workaround-deletion.mjs:436-450` — the arm loop: `if (hits.length === 0)
{ … states.push({state:"GREEN", detail:"ABSENT"}); continue; }`. The S1 witness is
`/aria-orientation\s*=\s*["']?\s*undefined/` (line 333); the S2 witness is
`/pointerHandled|onPlayPointerDown/` (line 351). The CONTINGENCY KILLs deleted both strings, so both
arms hit the `continue` and **never reach `probePublish` / `apiPresent`** (lines 458-461, only run on
`hits.length > 0`).

**Consequence:** the ledger was designed as a three-state consume-edge tracker — PRESENT+published →
RED "delete now"; PRESENT+unpublished → PENDING "held." The KILL converted S1/S2 to permanent GREEN
by *deleting the thing being tracked* rather than by *consuming the upstream fix*. The paired
siblings (`@mkbabb/glass-ui@4.1.0` BB aria-guard at line 340; the GU-Q2 keepalive at line 359) are
now inert for these arms. When glass-ui 5.0.0 (BG/BH) actually ships the keepalive and the
SegmentedTabs `role=group` aria-guard, **there is no gate, note, or PENDING row that surfaces "you
can now drop KfPillTabs / revert to `@click`."** The reconcile obligation is invisible.

This is the structural face of the "chronic exit via KILL" method: it discharges the *carry* (good —
P-invariant-28 satisfied) but it also discharges the *tracking* (bad — the durable-cure reconcile is
lost). Tranche R's own KILL comments (`TransportDock.vue:316`, `KfPillTabs.vue:2-12`) acknowledge the
durable cure is still glass-ui-side, but nothing in CI holds that thread.

**Proposal (S):** add an inverse arm — a "reconcile-on-upstream" note that goes PENDING/RED when
`glassCaps.dockStrandKeepalive` **becomes true** (or `ariaGuard` becomes true) *while the
kf-internal replacement is still present*, prompting a deliberate keep-or-revert decision rather than
silent drift. At minimum, record the reconcile as an explicit S deferral with the glass-ui 5.0.0
capability probe as its trigger.

---

### F5 — `KfPillTabs` tabs have no `aria-controls`; panels have no `aria-labelledby`/`id` — tab↔panel association incomplete — **LOW/MEDIUM**

**Evidence:** `KfPillTabs.vue:19-33` — the `<button role="tab">` carries no `aria-controls`. The
panels it drives live in `AnimationControls.vue:97,128,148` as `role="tabpanel"` divs with **no
`id`** and no `aria-labelledby` back to the tab. The tablist and the tabpanels are in *different*
components with no shared id namespace, so the WAI-ARIA tabs association (tab `aria-controls`→panel,
panel `aria-labelledby`→tab) is absent. Screen readers announce the tab and the panel as unrelated
regions.

**Note:** `aria-controls` is "recommended" in APG rather than strictly required, and the spring case
(`SpringSidebar.vue`) doesn't even render `role=tabpanel` bodies — so severity is LOW there, MEDIUM
for the AnimationControls control-surface strip where real tabpanels exist unlinked.

**Proposal:** thread a shared `idBase` prop; emit `:id`/`:aria-controls` on tabs and
`:aria-labelledby` on the corresponding panels. Do this when F1's focus fix is done — same component.

---

### F6 — `KfPillTabs` empty/unmatched `modelValue` → every tab `tabindex=-1` → tablist unreachable by Tab; no Home/End — **LOW (edge)**

**Evidence:** `KfPillTabs.vue:25` — `:tabindex="opt.value === modelValue ? 0 : -1"`. If `modelValue`
matches no option (initial/empty/none state, or a value not in `options`), **no button gets
`tabindex=0`**, so the whole strip has no tab stop and cannot be entered by keyboard. APG requires
exactly one tab stop; when nothing is selected the first (enabled) tab should be it. Also: a
`disabled` selected option would receive `tabindex=0` on an unfocusable button. And there is no
Home/End key support (APG-recommended for tablists).

**Proposal:** fall back to "first enabled tab is the tab stop when `modelValue` matches nothing";
skip `tabindex=0` on disabled; add Home/End in the F1 handler rewrite.

---

### F7 — Stale vendor-DOM prose: `useTabStripScroll` + `AnimationControls` still narrate `<SegmentedTabs>` though `KfPillTabs` now renders the strip — **LOW (doc-rot)**

**Evidence:** `demo/@/components/custom/animation-controls/controls/composables/useTabStripScroll.ts:5,23-29,47-51,66-72`
still describes "the header element wrapping the `<SegmentedTabs>` strip" and "`<SegmentedTabs>`' own
`[role=tab][aria-selected=true]` button" and "the `<SegmentedTabs variant="pill">` strip renders the
`role=tablist` element." After `e4d8d03`, `KfPillTabs` renders that DOM. The `[role=tablist]` /
`[role=tab][aria-selected=true]` **queries still resolve correctly** (KfPillTabs preserves the exact
contract — Vue renders `:aria-selected="false"` as `aria-selected="false"`, so `[aria-selected=true]`
matches only the selected tab), so this is prose-only, no functional break. `AnimationControls.vue:84`
and `demo/playground/App.vue:9,16,94` carry the same stale narration.

**Proposal:** S sweep — rename the "vendor-DOM contract" language to "KfPillTabs contract" (it is no
longer a vendor DOM; it is a first-party component whose DOM the composable reads by role selector).
Consider exposing a `tablistEl` ref from KfPillTabs so `useTabStripScroll` reads a real ref instead
of a documented `querySelector`, eliminating the "vendor-DOM disposition" framing entirely.

---

### F8 — No test covers either KILL replacement — **INFO**

**Evidence:** `grep -rln "KfPillTabs\|kf-pill"` over `test/` returns nothing; no test references
`onPlayKeydown`/`onPlayPointerUp`/`actuatePlay`. Both hand-authored replacements — a new ARIA
component and a rewritten activation handler — shipped untested. F1 (one-hop keyboard collapse) and
F2 (Space-repeat) are precisely the failure classes a small component test would have caught.

**Proposal:** S adds a `KfPillTabs.test.ts` (jsdom): arrow across ≥3 options asserts focus AND
selection both advance; Home/End; empty-modelValue tab stop. Add a TransportDock actuation test for
single-fire on keyup vs keydown-repeat.

---

## GESTALT verdict (spec vs shipped)

| Item | Spec (R.W6 §DM-1/DM-5) | Shipped | Honest? |
|---|---|---|---|
| Replace `role=group` SegmentedTabs with correct tablist | KfPillTabs `role=tablist`/`tab` | Done, correct pattern, token-sourced CSS | **Pattern: yes. Keyboard: no (F1).** |
| "ARIA-correct by construction, no suppress" | `KfPillTabs.vue:9` | `aria-orientation` valid; suppress gone | **Overclaim** — focus contract broken (F1), links missing (F5) |
| DM-1: modality-pure disjoint event sources | pointerup + keydown | Done | **Strand-proof but two new input bugs (F2, F3)** |
| P-invariant-28 (no 9th/6th carry) | KILL fires | Both KILLs landed, gate GREEN | **Yes — carry discharged** |
| Durable cure tracked for eventual reconcile | (implied by ledger) | Gate GREEN-by-absence; probe dead | **No — tracking severed (F4)** |

The KILLs are the *right strategic move* (replace a broken vendor primitive rather than suppress its
symptom) executed with a *hurried keyboard/input layer*. This is not cosmetic — KfPillTabs is a real
upgrade in pattern — but it is **not GESTALT-complete**: the component looks finished and passes every
source-shape gate while being keyboard-inoperable past one hop, and the process gate that should have
flagged the missing durable reconcile is short-circuited.

---

## Tranche-S implications

Wave-shaped recommendations, ordered by load-bearing-ness:

1. **S-wave: promote `KfPillTabs` to a tested, focus-correct `@/` primitive.** Fix F1 (move focus on
   arrow, the load-bearing line), F6 (empty-modelValue tab stop, disabled-skip, Home/End), F5
   (`aria-controls`/`aria-labelledby` id-threading), and add `KfPillTabs.test.ts` (F8). Since S's
   charter includes "resurrect the scene-switcher properly" and "NO legacy/deprecated code," this
   tablist is the reusable panel-switch primitive the demo should standardize on — make it good once.

2. **S-wave: reconcile the TransportDock play handler against glass-ui 5.0.0 (BG/BH).** Two branches:
   if the dock-layer keepalive (GU-Q2) lands in the consumed dist, **revert to `@click="actuatePlay"`**
   and delete the whole pointerup/keydown apparatus (F2/F3 vanish, the handler was only ever a
   dist-gap workaround). If it does not land, fix Space-on-keyup + press-origin guard (F2/F3). Verify
   against the live dock, not just tsc — this is an appearance/interaction-axis item that green
   source gates miss (per the gate-blindspot memory).

3. **S-wave: re-arm `proof:workaround-deletion` for KILL-discharged arms (F4).** Add inverse
   "reconcile-on-upstream" arms so that when `glassCaps.dockStrandKeepalive` / `glassCaps.ariaGuard`
   flip **true** while the kf-internal replacement is still present, the gate goes PENDING (prompt a
   keep-or-revert decision). The KILL method must discharge the *carry* without discharging the
   *tracking*; codify this as a rule of the tranche method (a CONTINGENCY KILL that severs a ledger
   thread must plant its reconcile trigger in the same wave).

4. **S-sweep: kill the stale `<SegmentedTabs>` narration (F7)** in `useTabStripScroll.ts`,
   `AnimationControls.vue`, `playground/App.vue`. Better: expose a `tablistEl` ref from KfPillTabs and
   have `useTabStripScroll` consume the ref, retiring the "documented vendor-DOM querySelector"
   framing (it is first-party DOM now, not a vendor contract).

5. **Method note for S wave-design:** the CONTINGENCY-KILL pattern proved it can turn a chronic into
   green *and* into a hidden permanent stand-in with broken interaction beneath a passing gate. Any S
   wave that lands a hand-rolled replacement for a vendor primitive MUST pair it with an
   interaction-axis test (keyboard/focus/repeat), not only a source-shape gate — this lane is a
   concrete instance of the gate-blindspot the memory already warns about.
