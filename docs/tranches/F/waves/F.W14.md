# F.W14 — Undo/redo for the destructive editor (scoped, debounced `useRefHistory` + `Mod+Z`/`Mod+Shift+Z`)

**Phase:** IMPL · **Class:** PATCH+demo (the demo — an additive state-history composable + two
new shortcuts; the library is UNTOUCHED; no existing render or behaviour path changes) ·
**Scope:** `demo/@/components/custom/animation-controls/timeline/composables/useTimeline.ts` (the
centralized `state` ref) + `demo/@/components/custom/animation-controls/keyframes/composables/
useKeyframesEditor.ts` (the CSS-string state) + `AnimationControlsGroup.vue:262-285` (the
19-shortcut registry, the free `Mod+Z`/`Mod+Shift+Z` slots) — Band 5, the demo-design finishing
pass · **DAG: F.W14 is INDEPENDENT of the engine bands** (`F.md §The DAG` — Band 5 shares no
surface with Bands 0–3) · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *The demo is a destructive keyframe + CSS editor with NO undo/redo — clear-all,
delete-frame, free-form CSS edits, all irreversible. It gates the core try→undo→try loop. The
seam is idiomatic and cheap: a scoped, debounced `useRefHistory` (already a dep) over the
centralized state, surfaced via `Mod+Z`/`Mod+Shift+Z` through the existing registry.*

The post-E demo is **~90% SOTA** on the structural/usability axis (`a-demo-post-e` headline — 8
of 13 E demo-ux items landed, nothing >350L, no legacy orphans). But the deep assay surfaced ONE
genuinely-new structural gap the E lanes did not raise: the demo is a full keyframe + CSS editor
whose primary surfaces perform **irreversible destructive mutations** with NO recovery
(`a-demo-post-e §1`). For an editor whose explicit purpose is iterative experimentation, the
absence of undo is the single largest usability-flow gap remaining — larger than any individual
a11y straggler, because it gates the editor's core loop (try → undo → try again). This is NOT a
re-litigation of W11; it is the one NEW finding, and it is additive, not a rebuild — the state is
already centralized and reactive, and `useRefHistory` (vueuse) is already a dependency.

**The Mandate spine (binding — `F.md §Mandate`).** NO quick solution / NO workaround: undo wraps
the EXISTING centralized state ref via the idiomatic Vue-reactivity primitive (`useRefHistory`),
NOT a hand-rolled snapshot stack or a per-op imperative undo registry; it captures on COMMIT (the
existing debounce), NOT per-keystroke (which would make a single CSS edit 40 undo steps). NO
legacy: the two free shortcuts bind through the ONE existing `registerShortcut` registry
(`AnimationControlsGroup.vue:262-285`), not a second key-listener. Measure-first does NOT bind a
perf *claim* (additive feature, not a hot path); the gate is a falsifiable undo/redo round-trip
behavioural test. Isomorphic/additive: a new state-history ref + two new shortcuts; ZERO change to
any existing render or behaviour path (the reactivity is already centralized — a composable bind,
not a refactor, `a-demo-post-e §1` isomorphism). inv δ: the wave must not reintroduce a dock
occlusion (`F.md §invariant set` — the demo waves' hard-gate discipline). inv ε: every claim cites
`file:line` against live `tranche-e-impl`.

**Provenance.** `a-demo-post-e §1` (the demo is a destructive editor with NO undo/redo — the
`useRefHistory` seam open; SHIP-in-F; the one NEW structural finding, MED severity, E lanes did
not raise).

---

## § State, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **The demo's primary surfaces perform IRREVERSIBLE destructive mutations.** `a-demo-post-e §1`
   (re-grounded):
   - **"Clear all keyframes"** — `KeyframeTimeline.vue:7-16` (the `IconTooltip "Clear all
     keyframes"` button at `:11-13`, `@click="clear()"` → `useTimeline.ts`'s `clear`, a one-click
     wipe of the entire keyframe set).
   - **Remove a keyframe** — `KeyframeCard.vue` (the `X`), `KeyframeTimeline.vue` (the remove
     control), AND the `Delete`-key shortcut `AnimationControlsGroup.vue:285`
     (`registerShortcut("Delete", () => activeTimelineRef.value?.removeSelectedKeyframe?.())`).
   - **Free-form CSS edits** — the `contenteditable` `<pre>` (`KeyframeCard.vue:35-41`) and the
     Monaco editor (`CSSCodeEditor.vue`) both mutate the live animation on every keystroke (the W8
     single-compile path).

2. **There is NO undo anywhere.** `a-demo-post-e §1` (verified): a grep over `demo/@` + `demo/app`
   (source-only) for `undo` / `redo` / `useRefHistory` / `useManualRefHistory` / `Mod+Z` returns
   **zero** hits (the only matches are a CSS comment + `dist/` build artifacts). A user who clears
   all keyframes, deletes the wrong frame, or mangles the CSS has no recovery but to rebuild by hand.

3. **The state is already centralized + reactive — the idiomatic undo seam.** `a-demo-post-e §1`
   (verified): the timeline keyframes live in a SINGLE `state = ref<TimelineState>({ keyframes,
   captureProperties, animationName })` (`useTimeline.ts:21-25`), driving a single `rebuild` /
   recompile through `useTimelineBuild` (`useTimeline.ts:36-45`); the CSS strings live in
   `useKeyframesEditor.ts` behind a debounce (`useKeyframesEditor.ts:46`
   `debouncedUpdateAllStrings`). `useRefHistory`/`useManualRefHistory` (vueuse) is ALREADY a
   dependency (the demo uses `@vueuse/core` throughout) — the idiomatic Vue-reactivity undo
   primitive: wrap the keyframe-state ref, capture on commit (debounced, mirroring the existing
   debounce), bind two shortcuts.

4. **The shortcut registry has 19 shortcuts and a FREE `Mod+Z`/`Mod+Shift+Z` slot.** Verified:
   `grep -c registerShortcut` → 17 in `AnimationControlsGroup.vue:262-285` + 2 in `EditorShell.vue`
   (the `?` help binding `:117` + one more) = **19** (the singleton glass-ui `registerShortcut` from
   `@mkbabb/glass-ui/keyboard`, `AnimationControlsGroup.vue:142`); the registry already owns
   `Space`/`Escape`/`R`/arrows/`[`/`]`/`1`/`2`/`3`/`Mod+S`/`Delete` (grouped Playback/Navigation/
   Actions). `grep "Mod+Z"` → 0 — the slot is free. The registry is SOTA (a singleton
   `createGlobalState`, single window listener, `Mod`-alias, editable-target skip, grouped + labeled,
   `a-demo-post-e §7`) — undo binds into it, not beside it.

The wave's job: a scoped, debounced `useRefHistory` over the timeline-keyframe + CSS-string state,
surfaced via `Mod+Z`/`Mod+Shift+Z` through the existing registry (+ optionally a visible undo/redo
toolbar pair) — closed by an undo/redo round-trip behavioural test that BITES.

---

## § Goal

**What lands** (additive undo/redo — `proof:demo-elevate`'s undo clause green):

- **A scoped, debounced `useRefHistory` over the editor state** — wrapping the centralized
  `useTimeline.ts` `state` ref (keyframes) + the `useKeyframesEditor.ts` CSS-string state, capturing
  on COMMIT (debounced — mirroring the existing `useKeyframesEditor` debounce, `useKeyframesEditor.
  ts:46`), so an undo step is a meaningful edit, not a keystroke. `clear`/`removeKeyframe`/CSS edits
  all become reversible.
- **`Mod+Z` (undo) + `Mod+Shift+Z` (redo)** bound through the existing `registerShortcut` registry
  (`AnimationControlsGroup.vue:262-285`, the free slot), grouped under "Actions" / "Editing", labeled
  so they surface in the `KeyboardShortcutsModal`.
- **(Optional) a visible undo/redo toolbar pair** in the timeline toolbar (`KeyframeTimeline.vue:7-27`,
  next to clear/expand) — the discoverable affordance for the keyboard binding; bounded by the same
  `canUndo`/`canRedo` history state.
- **`proof:demo-elevate`'s undo clause** wired into CI: the undo/redo round-trip behavioural test.

**Why:** the demo is a destructive editor and undo gates its core loop (`a-demo-post-e §1`). The seam
is the idiomatic Vue-reactivity undo primitive over already-centralized state — additive, cheap, and
the single largest usability-flow win remaining. Debounced commit-capture (not per-keystroke) is the
non-negotiable: a CSS edit is ONE undo step, not 40.

---

## § Scope

One additive composable + two shortcuts land (S1) + the optional visible affordance (S2); both are
`file:line`-grounded.

### S1 — Scoped, debounced `useRefHistory` over the editor state + `Mod+Z`/`Mod+Shift+Z` (`a-demo-post-e §1`) — SHIP-in-F

**WHAT:** wrap the centralized `useTimeline.ts` `state` ref (`useTimeline.ts:21-25`, the keyframe
state) and the `useKeyframesEditor.ts` CSS-string state in `useRefHistory` (or `useManualRefHistory`
for explicit commit control), configured to capture on COMMIT — debounced to mirror the existing
`useKeyframesEditor` debounce (`useKeyframesEditor.ts:46`) so a multi-keystroke CSS edit collapses to
ONE undo step, NOT 40. Bind `Mod+Z` → `history.undo()` and `Mod+Shift+Z` → `history.redo()` through
the existing `registerShortcut` registry (`AnimationControlsGroup.vue:262-285`), grouped + labeled.
Undo of `clear()`/`removeKeyframe()`/a CSS edit restores the prior `state` (and the recompile flows
through the existing `rebuild` automatically — the state is the single source).

**WHY:** the state is already centralized + reactive (State 3), so `useRefHistory` is a composable
BIND, not a refactor — the idiomatic Vue undo primitive over already-reactive state (`a-demo-post-e
§1`). Capturing on commit (debounced) is what makes undo MEANINGFUL — a per-keystroke history would
make a single CSS edit an unusable 40-step undo trail. The two shortcuts ride the ONE existing
registry (the SOTA singleton, State 4), not a second listener.

### S2 — A visible undo/redo toolbar pair (`a-demo-post-e §1`, optional) — SHIP-in-F (discoverability)

**WHAT:** add a visible undo/redo button pair to the timeline toolbar (`KeyframeTimeline.vue:7-27`,
beside the "Clear all keyframes" + collapse/expand `IconTooltip` buttons), bound to `history.undo`/
`history.redo` and disabled via `canUndo`/`canRedo`. Sized to match the existing `h-7 w-7` toolbar
icon buttons; labeled with `aria-label` per the existing `IconTooltip` pattern (`KeyframeTimeline.vue
:7,:12`).

**WHY:** the keyboard binding (S1) is the primary affordance, but a visible pair makes undo
DISCOVERABLE (the same discoverability concern F.W15 §S3 addresses for the shortcut system) — and it
mirrors the existing toolbar idiom (the clear/expand buttons), so it adds no new visual language. The
visible pair must not reintroduce a dock occlusion (inv δ — the toolbar is in the timeline card, not
over the dock band, so it does not occlude; verify against `--dock-band-reserve`).

> **Note (the debounce contract — not a separate scope item).** The capture-on-commit debounce is the
> wave's correctness keystone, not an optimization: it ties the undo granularity to the existing edit
> commit boundary (`useKeyframesEditor.ts:46`'s debounce), so undo steps are edits the user perceives
> as edits. If the history captures per-keystroke, the gate (clause 2) bites.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real behavioural test, not an assertion):

1. **Undo/redo round-trip restores prior state (S1).** An undo/redo round-trip behavioural test: a
   destructive op (e.g. `clear()`, or `removeKeyframe`) mutates the keyframe state; `Mod+Z` (or
   `history.undo()`) restores the EXACT prior `state.keyframes`; `Mod+Shift+Z` re-applies it. **BITE:**
   remove the `useRefHistory` wrap → the post-`clear` state has no prior to restore and the round-trip
   reds (reds today — no undo exists, verified State 2). A CSS edit + `Mod+Z` restores the prior CSS
   string.

2. **Undo captures on COMMIT, not per-keystroke (S1).** A test that types N characters into the CSS
   editor within the debounce window asserts the history grows by ONE entry (a single commit), not N.
   **BITE:** configure the history to capture per-keystroke (drop the debounce) → the N-vs-1 assertion
   reds. This is the wave's correctness keystone (the debounce contract).

3. **The shortcuts ride the EXISTING registry + surface in the modal (S1).** A grep/test asserts
   `Mod+Z`/`Mod+Shift+Z` are registered through `registerShortcut` (`AnimationControlsGroup.vue:262-285`,
   the same registry, grouped + labeled) — NOT a second `addEventListener`; and they appear in the
   `KeyboardShortcutsModal`'s registered-shortcuts list. **BITE:** bind undo via a bare
   `window.addEventListener("keydown")` → the single-registry grep reds.

4. **The visible affordance (if shipped) does not occlude the dock (S2, inv δ).** `proof:demo-elevate`'s
   occlusion clause stays green — the undo/redo toolbar pair sits in the timeline card, respecting
   `--dock-band-reserve`; no dock-over-content overlap. **BITE:** place the pair where it overlaps the
   dock band → the inv-δ occlusion clause reds.

5. **No regression / additive-only.** `npm test` stays green; the undo composable + shortcuts add no
   change to any existing render or behaviour path (the reactivity is centralized — a bind, not a
   refactor). **BITE:** any timeline/keyframe-editor/recompile test regression reds (the feature is not
   additive if a test moves).

---

## § Folds

Retires (by finding id):
- **`a-demo-post-e §1`** (the demo is a destructive editor with NO undo/redo — the `useRefHistory`
  seam open) — S1 + S2 + gate clauses 1/2/3.

**No value.js hand-off (this wave consumes vueuse, already a demo dep — `a-demo-post-e §1` inv ε note;
the engine + value.js are untouched).**

---

## § Design decisions

1. **`useRefHistory` over the centralized state — the idiomatic Vue undo, NOT a hand-rolled stack.**
   RESOLVED: the timeline keyframes + CSS strings are already a single centralized reactive `state`
   (`useTimeline.ts:21-25`) driving one recompile — so the idiomatic primitive is vueuse's
   `useRefHistory`/`useManualRefHistory` (already a dep), wrapping that ref. A hand-rolled snapshot
   stack or a per-op imperative undo registry would duplicate the reactivity vueuse already provides
   and miss the recompile-flows-from-state property the §1 seam rests on. Trade-off: none — this is the
   cheap, idiomatic, additive bind; the state-centralization makes it a composable wrap, not a refactor.

2. **Capture on COMMIT (debounced), NOT per-keystroke — the correctness keystone.** RESOLVED: undo must
   be MEANINGFUL — an undo step should be an edit the user perceives as an edit (a CSS change, a frame
   delete), not a single character. So the history captures on the existing edit-commit boundary
   (debounced, mirroring `useKeyframesEditor.ts:46`'s debounce), collapsing a multi-keystroke CSS edit
   to one undo step. Trade-off: a very-fast multi-edit within one debounce window collapses to a single
   undo — but that matches the user's mental model of "one edit," and it is the only granularity that
   makes the undo trail usable (gate clause 2 bites a per-keystroke regression).

3. **Bind through the ONE existing registry — no second listener.** RESOLVED (no-legacy): the demo's
   shortcut registry is a SOTA singleton (a single window listener, `Mod`-alias, editable-target skip,
   grouped + labeled, `a-demo-post-e §7`), with a free `Mod+Z`/`Mod+Shift+Z` slot (State 4). Undo binds
   into it via `registerShortcut`, so the bindings surface in the help modal and inherit the
   editable-target-skip discipline — NOT a parallel `keydown` listener that would race the registry and
   miss the editable-skip. Trade-off: none — the registry is the canonical home.

4. **The visible pair is discoverability, not the primary mechanism — and it honors inv δ.** RESOLVED:
   the keyboard binding (S1) is the primary undo mechanism; the visible toolbar pair (S2) makes it
   DISCOVERABLE (the same discoverability concern F.W15 §S3 addresses for the shortcut system) and
   mirrors the existing toolbar idiom (the clear/expand buttons), adding no new visual language. It must
   respect `--dock-band-reserve` (inv δ — no dock-over-content occlusion; gate clause 4). Trade-off: the
   pair is optional — S1's keyboard binding is the SHIP floor; the visible pair is the discoverable
   ceiling, both bounded by the same `canUndo`/`canRedo` history state.

5. **Additive — measure-first does not bind a perf claim.** RESOLVED: undo is an additive editor
   capability, not a hot path — the history captures on a debounced commit (infrequent), and the
   recompile already runs on every edit. So no bench gates it; the gate is the undo/redo round-trip
   behavioural test (clause 1) + the commit-granularity test (clause 2) + the no-regression lock (clause
   5). The feature proves itself by restoring prior state on a destructive op (the core loop it gates),
   not by a number.
