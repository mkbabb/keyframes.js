# Tranche J Audit — LANE: wave-I.W2 plan-vs-delivery

**Commit audited:** `e2085c8` · WZ amendment: `2e3669e`
**Spec:** `docs/tranches/I/waves/I.W2.md` · **Impl note:** `docs/tranches/I/impl/I.W2.md`
**Verified against:** `master` tip `4072af9`, clean working tree.

---

## Verdict

**Core delivery is HONEST and REAL.** S1 (single-authority mount), S2 (force-mount), S3
(re-parseable readout/persist), and S4 (one EasingEditor) all landed as specified. The B4 easing
editor blank-on-switch is genuinely fixed. The gate (`proof:easing-editor-live`) is a RUNTIME
interaction gate — it switches scenes, drags handles, samples the traveling dot — not a proxy.

**Two material issues survive:**

1. **M2 mobile-scroll overclaim (P1):** The M2 "sheet body clips controls" fold into I.W2 is
   partially false. I.W2 fixed B4 (the panel `data-state="inactive"` on switch — the desktop AND
   mobile panel hidden bug). But the *separate* M2 sub-issue — `overflow-hidden` never clearing
   on mobile after a close+re-open because `isPanelTransitionDone` waits for a CSS `max-height`
   `transitionend` that never fires on the spring-driven mobile sheet — is NOT fixed. The gate
   never tests mobile (fixed 1440×900 viewport). The claim `"the mobile sheet body can SCROLL to
   its content (M2)"` in `PROGRESS.md` is overclaimed.

2. **S4-stretch untracked (P2):** The spec explicitly deferred "RECORD for IMPL, ship if room" —
   mount EasingEditor flat for single-surface scenes, bypassing the Tabs/v-show double-gate. It
   landed in no impl note and has no J doc. Per P-invariant-28 it needs a terminal disposition.

---

## §1 — Spec scope vs delivery

| Scope item | Spec | Tree state | Verdict |
|---|---|---|---|
| **S1** — single-source SELECTED surface from DFA | `controlSurfaceDFA.ts:168` `selectedControlSurfaceFor`; `AnimationControls.vue:221` `selectedControlSurface` computed bound to `<Tabs :model-value>` | PRESENT; function at `controlSurfaceDFA.ts:168`; watch sync at `AnimationControls.vue:237-249` | LANDED |
| **S2** — force-mount single-surface `TabsContent` | EasingScene/SpringScene `forceMount: true` | `EasingScene.vue:70` `{ value: "easing", class: "h-full", forceMount: true }`; `SpringScene.vue:94` same | LANDED |
| **S3** — re-parseable readout+copy; persist the literal | `timingFunctionLiteralFor` in `useTimingFunctionEditor.ts:149`; `timingFunctionKind` in `animationDescriptions.ts:99` | Both present; `updateTimingFunctionFromName:195` persists `timingFunctionLiteralFor(key)` | LANDED |
| **S4** — ONE `EasingEditor` (both hosts) | `EasingEditor.vue` new; `EasingSidebar.vue` + `TimingFunctionPanel.vue` both mount it | `demo/@/components/custom/EasingEditor.vue` exists; `EasingSidebar.vue:106` `import EasingEditor`; `TimingFunctionPanel.vue:133` same | LANDED |
| **S4-stretch** — flat-mount EasingEditor for single-surface scenes, bypass Tabs double-gate | "RECORD for IMPL, ship if room" | NOT implemented; NOT in impl note; NOT in any J doc | DEFERRED — NO TERMINAL DISPOSITION |
| Per-scene `selectedControl` pokes DELETED | `EasingScene.vue:32`, `SpringScene.vue:67` pokes gone | `EasingScene.vue:30` comment confirms deletion; no `storedControls.selectedControl = "easing"` line present | LANDED |
| M2 mobile scroll reachability | "mobile sheet body can SCROLL to its content (M2)" claimed LANDED | `useControlsLayout.ts:30-35` still gates `overflow-y-auto` on CSS `max-height` transitionend; mobile uses spring-driven height (`ControlsPaneWrapper.vue:254`), no CSS height transition; gate never tests mobile (viewport `1440×900`) | OVERCLAIMED |

---

## §2 — Single-authority: is it truly the ONLY authority?

**No — `storedControls.selectedControl` is NOT deleted.** The field lives at
`controlOptionsStore.ts:6` (type `string`) with default `"controls"` (line 28). The Tabs
`:model-value` binding is the computed projection
(`AnimationControls.vue:221-225` `selectedControlSurface`), but the FIELD is still read for:

| Read site | File:line | Risk |
|---|---|---|
| `isTimelineVisible` | `AnimationControls.vue:288` | Reads store directly |
| `keyframesActive` | `AnimationControls.vue:296` | Reads store directly |
| `activeBtn` indicator | `AnimationControls.vue:330` | Reads store directly |
| Ribbon bar (3 v-show clauses) | `RibbonBar.vue:8,13,57` | Reads store directly |
| ChromeDock `:selected-control` | `App.vue:9` | Store passed to dock |

The watch at `AnimationControls.vue:237-249` (`{ immediate: true }`) syncs the store BACK when
the projection diverges. This is acknowledged in the code as a "derivation-sync, NOT a latch
re-assert" and is idempotent. The risk is a one-tick window between the projected Tabs mount and
the watch flush where downstream reads see a stale `"controls"` for a single-surface scene.
Since `{ immediate: true }` fires synchronously before next render, this is minimal in practice.

**The WZ amendment `2e3669e` is correctly motivated.** The `proof:scene-machine-irrefragable`
gate had been reading `storedControls.selectedControl` as the oracle — the DEPRECATED axis that
stays `"controls"` (default) on a fresh easing nav. The fix reads the **rendered surface** (the
EasingEditor curve canvas presence). This is the correct gate-oracle per the precept.

---

## §3 — Gate oracle quality

**`scripts/proof-easing-editor-live.mjs` — 558 lines, RUNTIME/INTERACTION tier.** Runs against
built `dist/gh-pages/`, Chromium via Playwright, `1440×900` viewport.

| Clause | Oracle | Verdict |
|---|---|---|
| (a) editor un-hides on switch-in | `.easing-curve-canvas` present + `display !== none` + `[role="tabpanel"]` `data-state="active"` after `#/cube` → `#/easing` hash switch | ACTUATES — switches the running product, checks DOM presence |
| (b) handle-drag mutates `d` AND re-animates | ≥2 `.control-point.handle`; drag; then compare `bezier-path` `d` before/after; sample `.traveling-dot` cy-spread before+after drag and assert `Math.abs(sAfter - sBefore) > 0.01` or positional diff `> 0.02` | ACTUATES — behavioral assertion, would catch SVG-only no-op; spread comparison weaker than position-at-fixed-t but sufficient |
| (c) selector + re-parseable readout | dropdown present; `REPARSEABLE_LITERAL` regex tests copied value; `Easing→Amiga→Easing` re-mount asserts ZERO `AnimationOptionError` | ACTUATES — drives the full round-trip |
| (d) return path + spring panel | cube→easing→amiga→easing→spring sweep; ZERO `pageerror`/`_gen`/`"......"` | ACTUATES |

**Hygiene issues in the gate script:**

- `switchScene` uses `waitForFunction(...).catch(() => {})` at lines 140-141 and 415-416: the
  localStorage machine-flip timeout is silently swallowed. If the machine never flips, the test
  continues on the wrong scene — a false-pass risk.
- `waitForTimeout(700)` at lines 142 and 417 is a settle sleep. Acceptable in a gate script
  context (not in the product), but fragile on slow machines. There is no `waitForSelector` to
  confirm the controls pane mounted before the 700ms.

---

## §4 — M2 mobile scroll: the overclaim in detail

**The B4 / M2 scope split:**

- **B4** (easing editor blank on switch): caused by the reka `useVModel` passive-latch taken
  `undefined`. Fixed by S1+S2. Affects BOTH desktop and mobile. **FIXED.**
- **M2** (sheet body clips controls, no scroll): caused by `isPanelTransitionDone` staying
  `false` after a close+re-open because `useControlsLayout.ts:30-35` gates it on a CSS
  `max-height` transitionend (`onPanelTransitionEnd` checks `e.propertyName === "max-height"`).
  On mobile the sheet height is `calc(peek + (expanded - peek) * var(--sheet-t, 0))`
  (`ControlsPaneWrapper.vue:254-259`) — spring-driven, no CSS transition. The `.controls-pane`
  inner div stays `overflow-hidden` indefinitely after a mobile panel close+re-open.

**Initial open works** because `isPanelTransitionDone = ref(storedControls.isControlsPanelOpen)`
(`useControlsLayout.ts:21`) starts `true` when the panel opens. The breakage requires:
mobile + user closes the panel + user re-opens = overflow-hidden never clears.

**No gate covers this.** `proof:easing-editor-live` runs at `1440×900` only
(`proof-easing-editor-live.mjs:363`). No mobile-viewport gate exists in `scripts/` that
exercises close+re-open scroll reachability. The `proof:drawer-spring` gate tests the spring
settle but not scroll reachability.

**The fix spec said:** "drive `isPanelTransitionDone` off the spring settle" — i.e., wire
`useSheetSpring`'s `sheetT` into `useControlsLayout` so when `sheetT ≈ 1` (open-settle) on
mobile, `isPanelTransitionDone` is set. This was never implemented. `useSheetSpring.ts` returns
only `{ sheetT }` — no settled callback.

---

## §5 — Legacy check

- **EasingCurveCanvas direct usage** outside `EasingEditor`: NONE. Only
  `demo/@/components/custom/EasingEditor.vue:72` imports it. CLEAN.
- **EasingSelect direct usage** in `AnimationControlsControls.vue:213`: PRESENT — this is the
  controls-row trigger label (the user's quick picker in the main controls pane, NOT the detail
  editor). This is correct architecture: EasingSelect is the trigger; EasingEditor owns the
  detail-edit surface. NOT a duplicate host.
- **Old preset `Select` in TimingFunctionPanel**: DELETED — `bezierPresets` import and
  `selectedPreset` ref are gone; replaced by EasingEditor's EasingSelect.
- **`ref` import** in `EasingSidebar.vue` before I.W2: `ref` was used for `jumpOpen` state
  (still needed). `computed` added for `readoutLiteral`. No orphan state.
- **try/catch floors**: NONE in I.W2-added code (`EasingEditor.vue`, `controlSurfaceDFA.ts`,
  `useSceneMachine.ts` additions).
- **TODO/FIXME**: `controlSurfaceDFA.ts:12` has a `HACK` comment describing OLD code that was
  replaced — historical reference, not a live hack.

---

## §6 — Gestalt: right seam?

S1 fixes the latch AT ITS SOURCE (the Tabs `:model-value` binding), not with a `nextTick`
re-assert. The comment at `AnimationControls.vue:234` explicitly names the forbidden workaround
and states why the projection avoids it. This is the correct seam.

S4's unification of the two bezier hosts removes the drift root. The rail had lost the readout
because it had its own chrome; now both mount the same component.

**The remaining architectural tension:** `storedControls.selectedControl` serves two roles:
(1) the user's preference (read by downstream: ribbon, dock, timeline/keyframes visibility)
and (2) the Tabs model-value (now superseded by the computed projection). The watch sync keeps
them coherent but they are no longer the same authority. This is a half-migration that J should
complete. The S4-stretch (flat-mount single-surface scenes, removing the Tabs machinery
entirely for easing/spring) would eliminate this tension for the single-surface case.

---

## §7 — Fold candidates for J

| Item | Disposition | Notes |
|---|---|---|
| **S4-stretch** — bypass Tabs double-gate for single-surface scenes | FOLD into J | Spec said "RECORD for IMPL, ship if room"; not in any J doc; P-invariant-28 |
| **M2 re-open scroll** — drive `isPanelTransitionDone` off spring settle on mobile | FOLD into J | Genuine unaddressed sub-issue; `useSheetSpring` needs to expose a settled signal; `useControlsLayout` needs to consume it |
| **Gate script settle sleeps** — `waitForTimeout(700)` in `switchScene` + `waitForFunction().catch(() => {})` | FOLD into J (P2 hygiene) | Replace with deterministic `waitForSelector`/`waitForFunction` without swallowing timeout |
| **Half-migration of `storedControls.selectedControl`** — still the authority for ribbon/dock/timeline while Tabs uses the projection | BOOK or FOLD | Low risk today; S4-stretch would clean it up naturally |
