# Lane 30 — T quality re-review: batches ⑦–⑪ + the close

**Fleet:** Tranche U development audit (32-lane), lane 30/32
**Charter:** re-review T batches ⑦–⑪ + the close for half-measures, workarounds,
regressions, and specifically whether the ⑪ terminal's SPEED left quality gaps —
the Drawer adoption seams, the gallery's clock, the retired-gate holes. All
evidence is `file:line` read from the live master tree (post-5.2.0, the close
commits `8ed0e63`/`cf9b268`/`9d03124`/`4be6120`/`fe11e0c`/`72d1873`).

**Headline:** the batches' *code* is largely sound (B9 keyspace, the B2 DFA
inversion, the B8 single-writer, the gallery's shared clock are all clean gestalt
work) — but the CLOSE exposed that the CI apparatus the owner ruled "entirely
superfluous / substantially tautological" is exactly that: a 131-step **fail-fast
hand-listed** library-gate job in which multiple gates had **never actually run to
completion on CI** (proven by the five sequential close-fixes), a whole
**observe-only runner** that gates nothing, and a performance edict violated by an
idle-warm that pulls 4 MB Monaco onto scenes the user never edits.

---

## The verification method

I read the batch board (`PROGRESS.md:336–514`), then the actual artifacts each
batch left in the tree: `controlSurfaceDFA.ts`, `sceneMachine.ts`,
`useSceneMachine.ts`, `useKeyframesPaneReveal.ts`, `ControlsPaneWrapper.vue`,
`EasingTarget.vue`, `EasingSidebar.vue`, `useEasingDemo.ts`, and the three CI
jobs in `ci.yml` + `gate-bands.mjs`/`demo-roster.mjs`/`proof-ci-coverage.mjs`. I
diffed the six close commits. I did NOT run browser gates (contended per charter).

---

## FINDINGS (severity-ranked)

### F1 [CRITICAL · ci-tautology] The library gate is 131 hand-listed fail-fast steps that mirror a roster the driver already runs — gates never completed on CI

`ci.yml`'s `gates` job (`ci.yml:48–444`) enumerates **~131 individual
`- name: proof:X / run: npm run proof:X` steps**, sequentially, no
`continue-on-error`. GitHub Actions aborts the job at the first red step, so
**every gate after the first failing one never executes.** The close proves this
was not hypothetical:

- `9d03124` (close II): `proof:demo-elevate` had been armed to a *superseded*
  boundary (glass-ui/motion-core VT routing) — it was RED, but "the library
  gate's fail-fast ordering had been masking" it (`PROGRESS.md:503–504`). It only
  surfaced once earlier reds cleared.
- `fe11e0c` (close IV): the job "outgrew its own ceiling the moment demo-elevate
  stopped failing it early" — the 10-min timeout killed it at "step ~122 once
  demo-elevate went green and the run finally reached the tail" (`ci.yml:51–56`).
- `72d1873` (close V): `proof:no-cross-realm-cast` had a catastrophic-backtracking
  regex, ">14min on the runner … the step had never actually completed on CI
  (always hidden behind earlier fail-fast reds)."

So for the whole tranche, the tail of the library roster was **effectively dead
on CI** — green meant "we never got there," not "it passed." This is the precise
failure mode the owner's edict #1 names. And the driver to do it right **already
exists**: `demo-correctness` (`ci.yml:660–666`) runs the roster through
`run-all.mjs` as ONE non-fail-fast step that "collects every gate's exit code …
and exits 1 iff any red." The library job simply doesn't use it.

**Proposal (gestalt):** delete the 131 hand-listed steps; run the library tiers
through the existing parallel non-fail-fast driver —
`node scripts/run-all.mjs --tier=proof:library-correctness` +
`--tier=proof:hygiene` (two steps, workers, reports EVERY red in one pass). This
kills the fail-fast masking, the timeout pressure, the O(131) maintenance
surface, AND retires F2's coverage tautology in the same move.

---

### F2 [MAJOR · ci-tautology] `proof:ci-coverage` is a bidirectional tautology-maintenance gate that exists only because CI hand-duplicates the roster

`proof-ci-coverage.mjs:7–22`: CLAUSE 0 (FORWARD) asserts *every* `proof:*` in
`package.json` is invoked in `ci.yml`; CLAUSE 0b (CONVERSE) asserts every
`ci.yml` step is reachable from `proof:all`. This entire two-directional
apparatus — plus clause 0c ("no raw-node gate steps"), the version-literal
scanners, etc. — exists to keep the **hand-maintained 131-step ci.yml list** in
sync with the roster tiers. If CI ran the tiers directly (F1), `proof:all == the
CI roster` becomes true *by construction* and the coverage gate has nothing to
police. A gate whose whole job is to verify a duplication that should not exist is
the definition of tautological.

**Proposal:** once F1 lands, retire CLAUSE 0/0b/0c; keep only the genuinely
non-tautological workflow-hygiene clauses (version-literal consistency across the
three workflows) under a slimmer `proof:workflow-hygiene`.

---

### F3 [MAJOR · ci-superfluous-runner] The `demo-device-observe` job gates nothing yet spends ~30 min per push — the owner's "entirely superfluous" runner

`ci.yml:677–756`: `demo-device-observe` is `continue-on-error: true` **at the job
level** (`ci.yml:683`) — "never gates deploy … the deploy-of-record gates on
demo-correctness ALONE." It nonetheless does `npm ci`, installs
`@playwright/test lighthouse`, installs chromium, `npm run gh-pages` (a full demo
build — the SECOND in the workflow), `build:lib`, then runs LoAF traces,
lighthouse-mobile, lighthouse-a11y, perf-frame-budget, dock-zorder,
peer-satisfied — every one `continue-on-error`, producing only annotations no one
blocks on. This is a 30-min runner whose entire output is advisory. The owner's
verbatim opening — "that runner is entirely superfluous" (`ORIGINAL-PROMPT.md`) —
maps directly here.

**Proposal:** delete the job from `ci.yml`. Device-dependent perf/appearance
metrics belong in a periodic (nightly/dispatch) bench on a calibrated runner or a
local `npm run bench` gate, NOT on the per-push deploy path. Nothing gates on it,
so nothing regresses by removing it.

---

### F4 [MAJOR · perf-regression] The Monaco idle-warm pulls ~4 MB onto every painting scene after 4 s idle — a workaround on the force-mount pattern, against the performance edict

Batch ⑧'s B2 triad-derivation surfaced the keyframes tab on every painting scene,
which force-mounted Monaco onto first paint → mobile LCP 10–16 s (a real
regression, `405553c`). Batch ⑨'s cure (`useKeyframesPaneReveal.ts:90–102`)
gates the mount behind `keyframesWarmed`, flipped by `requestIdleCallback(…,
{timeout:4000})` **or** interaction. But `scheduleIdleWarm()` runs in **every**
`AnimationControls` instance (`:102`), so visiting cube/amiga/square and idling
4 s **instantiates Monaco's editor + worker + model** on a scene where the user
never touched keyframes. It conflates "fetch the bytes" with "spin up the editor,"
and pre-pays the heaviest cost speculatively. Under "performance is the grand
edict" this is an anti-pattern layered on the force-mount B-2 pattern rather than
a gestalt cure. (`proof:monaco-deferred` can't see it — it checks the *static*
graph, `405553c` commit body.)

**Proposal:** drop the idle pre-warm; warm **only on interaction** (first
hover/focus/select of the keyframes tab — already wired at `:107–113`). If a
faster-first-open is wanted, prefetch the *chunk* with `<link rel="prefetch">`
(cheap bytes) and instantiate the editor only on activation. Also fold the two
`watch(keyframesActive, …)` blocks (`:107` and `:123`) into one.

---

### F5 [MAJOR · adoption-half-measure] The T.H3 Drawer adoption ships a structural occlusion regression parked as a permanent "born-RED" — a deferral under the no-deferrals edict

`ControlsPaneWrapper.vue:15–26`: the adopted glass-ui `<Drawer>` is pinned
`bottom:0` with "no bottom-inset lever, so the sheet rides OVER the bottom menubar
at any detent." At the close this was moved from the correctness roster into
`BORNRED_TRIPWIRES` (`4be6120`; `demo-roster.mjs:209–214`, `340`) and recorded
`continue-on-error` in the observe job (`ci.yml:705–711`) — i.e. the deploy no
longer sees it. It is real UI breakage (z-modal 140 covers the dock) shelved as
"external-blocked / forwarded to glass-ui." The owner's edict #2 is **NO MORE
DEFERRALS**; a forwarded-and-tripwired occlusion bug is a deferral in a new coat.
Separately, the adapter collapses glass-ui's snap state to a single boolean
`isControlsPanelOpen` (`:285–294`) — lossy the moment the Drawer grows a third
detent.

**Proposal:** U must charter this as an OWNED consume-edge item with a real
discharge, not a permanent tripwire: either (a) drive the glass-ui
`--drawer-inset-block-end` publish to completion this tranche and re-pin, or (b)
if glass-ui can't land it, own the fix demo-side by portaling the Drawer above a
`padding-block-end` stage frame so the menubar is never occluded. "Forwarded"
must resolve to "discharged," not "backlogged."

---

### F6 [MAJOR · workaround] The EasingPicker Curve facet re-seats by full `:key` REMOUNT on every catalogued tile click — a per-selection teardown workaround

`EasingSidebar.vue:16–36`: because "glass-ui 4.0.1's modelValue is EMIT-ONLY (no
external write-through / points-in prop), a remount is the only blessed re-seat
seam." So selecting a tile whose curve is in the picker's catalogue **destroys and
rebuilds the entire EasingPicker** (its canvas + private rAF) via `:key`
(`:28`). This is a workaround for a vendor gap (BG-9-adjacent) — flatly the
"NO workarounds, idiomatic gestalt" the owner forbids — and a real per-click perf
cost (component teardown/mount on a hot selection path). `:playback="false"`
(`:33`) further leaves the authoring surface with no live curve feedback.

**Proposal:** charter the glass-ui consume-edge letter to add a `modelValue`
write-through / `points`-in prop to EasingPicker so the demo controls it (v-model)
without remounting; discharge THIS tranche and re-pin. The remount is an interim
hack, not a resting state.

---

### F7 [MINOR · legacy-comment] Rushed-close comment drift in the Drawer contract — three different subject-cap numbers in one file

`ControlsPaneWrapper.vue`: the header contract says "subject scenes cap at **0.48**
(sheet.top ≈ 52dvh)" (`:19`); a second comment says "subject **0.40** keeps
≈49dvh" (`:273`); the actual constant is `EXPANDED_SUBJECT = 0.4` (`:276`). The
0.48 line is stale from before commit `256883a` (`0.48→0.40`) and was never
updated. Exactly the "NO legacy code" residue the edict targets — a reader can't
trust the contract prose. Same class: `useControlsLayout.ts:42`,
`useRafLoop.ts:59`, `EasingScene.vue:38`, `SpringScene.vue:49` still narrate
deleted composables (`useSheetSpring`/`useSheetState`) by name.

**Proposal:** U's restructure pass should treat contract comments as code — one
value, cited once, derived where possible; strip references to deleted symbols.

---

### F8 [MINOR · gate-appeasement / dfa-fragility] Bare-catch "KEEP:" relabels + a two-writer default-surface seam

Two related smells: (a) the close re-labeled silent `catch {}` blocks with
"KEEP:" prose to satisfy `proof:styling-idioms` rather than surfacing the swallow
(`useEasingDemo.ts:344–349`, `useSquareDemo.ts:376–380`) — a gate-appeasement
comment, not a handled error. (b) `controlSurfaceDFA.ts` carries **two** default
mechanisms that must be kept in lockstep: `defaultControlSurfaceFor` /
`SCENE_DEFAULT_CONTROL` (`:172–180`, seeded at bucket creation) vs
`selectedSurfaceFrom` returning `surfaces[0]` (`:204–212`) — for easing/spring
these disagree (`surfaces[0]="controls"` but the signature default is the facet),
so any consumer that reaches `selectedSurfaceFrom` without the seeded preference
silently gets the wrong facet. Also `SURFACE_META` gives easing and spring the
SAME `"Activity"` icon (`:153–154`) — indistinguishable signature facets in the
dock.

**Proposal:** make bare catches log-or-narrow (no silent swallow); collapse the
default-surface to ONE authority (`selectedSurfaceFrom` should consult
`defaultControlSurfaceFor(sceneId)` internally, so `surfaces[0]` is never the
easing/spring answer); give the two facets distinct icons.

---

## What survived scrutiny (recorded so U doesn't re-litigate)

- **B9 keyspace (⑦):** `useSceneMachine.ts:261–290` + `index.ts:98–103` — the
  one-keyspace gc/migrate over all three per-scene tables is clean, boot-called
  correctly (`useSceneMachineRouterBinding.ts:57,64`). No finding.
- **B2 DFA inversion (⑧):** `surfacesFor` (`controlSurfaceDFA.ts:95–120`) is a
  pure structural derivation off the live facility — the exclusion table is
  genuinely dead. Idiomatic. (Only the two-default seam in F8.)
- **B8 single-writer (⑨):** the machine-derived `isPlaying` / group-verb deletion
  landed as claimed; the loop gates on `machine.status` (`useEasingDemo.ts:208–
  218`). No finding.
- **Gallery clock (⑪):** `EasingTarget.vue:200–306` — ONE shared
  `registerDotPainter` Set, IntersectionObserver-gated transform-only writes off
  the Vue render graph, PRM rest-state, keyed-by-`data-curve` snapshot. This is
  the *good* gestalt work; the "IO-gated" board claim is honest.
- **owner-golden (⑪ retired visual-lock):** `proof-owner-golden.mjs:44–77` — 6
  scenes × 2 themes = 12 PRM-frozen dHash goldens, owner-BLESSED. Narrower than
  visual-lock (one frozen frame per scene; dHash Hamming is coarse; blind to
  motion/interaction/state per the standing MEMORY blind-spot lesson) but the
  owner personally ratified the trade — recorded, not charged.

---

## What U must charter

1. **Collapse the library-gate job to the roster driver** — replace the ~131
   hand-listed fail-fast steps with `run-all.mjs --tier=…` (non-fail-fast,
   parallel, reports every red once); this is the concrete CI-trim the owner
   demanded, and it ends the fail-fast masking that hid dead gates all tranche.
2. **Retire `proof:ci-coverage`'s FORWARD/CONVERSE clauses** once (1) makes
   `proof:all == CI roster` structural; keep only workflow version-literal
   hygiene.
3. **Delete the `demo-device-observe` job** — the owner's "entirely superfluous
   runner"; move any wanted device metric to a periodic/local bench off the
   per-push path.
4. **Drive the roster back toward the 120 ceiling** (today ~228, `gate-bands.mjs:
   595,669`) — this is a named born-RED backlog row; U's restructure must retire,
   not accrete.
5. **Re-gestalt the Monaco warm** — interaction-only mount; if faster-first-open
   is wanted, prefetch the chunk (`link rel=prefetch`) without instantiating the
   editor; never idle-instantiate Monaco on scenes the user isn't editing.
6. **Discharge the Drawer occlusion (BG-11), not tripwire it** — own the
   `--drawer-inset-block-end` publish + re-pin this tranche, or fix the occlusion
   demo-side; "forwarded" is not "done" under NO-MORE-DEFERRALS.
7. **Discharge the EasingPicker write-through gap (BG-9)** — a controlled
   `modelValue`/`points` prop so the demo stops remounting the picker per tile
   click; re-pin.
8. **Purge close-era legacy comments** — the 0.48/0.40/0.4 Drawer-cap
   contradiction and the deleted-composable narrations; make contract prose
   single-sourced and derive numbers where possible.
9. **Collapse the two-writer control-surface default** to ONE authority and give
   the easing/spring facets distinct dock icons; convert silent bare-catches to
   log-or-narrow rather than "KEEP:"-labeled swallows.
