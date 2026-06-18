# N.WZ — Close (production integration · FINAL · deferred ledger · version cut · deploy round-trip)

- **Band:** — (the close) · **Class:** BOOK (the close docs — `docs/tranches/N/FINAL.md`) +
  **RECORD** (the deferred ledger; `proof:chronic-closure` substrate re-pointed M→N; the
  prompt-recap confirmed) + **DEV→IMPL** (ONE gate authored — `proof:stage-supersedes-dropdown`
  — wired into `proof:correctness`; the dock Select integration) + **USER-DOMAIN** (the version
  cut — `@mkbabb/keyframes.js` publish; confirm-first). IMPL opens on explicit authorization.
  **Dep: LAST in N** — runs after N.W1–N.W7 GREEN; gated on `proof:all` GREEN + the production
  integration switch + the deploy round-trip observation.
- **Gate (born-RED, the close roster):**
  - `proof:stage-supersedes-dropdown` — **does NOT exist today** (no stage overlay has been
    wired into the dock scene-Select path; the dock Select is the only scene-switch affordance).
    Born-RED: `grep -rn "SceneStage\|useSceneStage" demo/app/` → 0 matches (verified 2026-06-17).
  - `proof:chronic-closure` — EXISTING; `CHRONIC_LEDGER` points at
    `docs/tranches/M/PROGRESS.md` today (the M.WZ substrate, if M has closed); this wave
    re-points M→N in the atomic non-vacuity motion (S4), proving the N ledger TERMINAL +
    non-vacuous.
  - `proof:all` — GREEN on the full close tree is the deploy signal.

---

## Context

N.WZ is the production-integration close. By the time N.WZ runs, the Band-B waves (N.W1–N.W7)
have built the full Stage overlay: the shell + downlight (N.W1), the carousel ring engine
(N.W2), the glassy arrows (N.W3), the living previews (N.W4), the per-scene idle states
(N.W5), the hover-brighten + commit handoff (N.W6), and the a11y + PRM + perf (N.W7).

N.WZ does three things:

**(A) The production integration switch.** The dock scene-Select dropdown is superseded by the
Stage as the primary scene-selection affordance. The Select is NOT deleted — it remains as the
keyboard/AT fallback (accessible from the keyboard without triggering the Stage, via the existing
reka-ui Select). The Stage is invoked from the dock's scene Select trigger (the `pointerdown`
path, following the BLK-8 fix discipline documented in the MEMORY). A new `proof:stage-supersedes-dropdown`
gate asserts this wiring is live.

**(B) The close documentation.** `docs/tranches/N/FINAL.md` is authored, held to inv-ε: every
boundary claim cites its observed oracle. The deferred ledger is terminated M→N non-vacuously.

**(C) The deploy round-trip.** `proof:all` GREEN → close-merge to master → CI green →
`deploy-pages.yml` fires → `keyframes.babb.dev` serves the new Stage. The oracle (exact-byte
equality) is observed or honestly named-blocked.

### The production integration — dock Select → Stage

The dock's scene Select trigger is `ChromeDock.vue:269-305` (the reka-ui Select component).
The integration plan:

1. In `App.vue`, mount the `<SceneStage>` component inside a `<Teleport to="body">` sibling
   to the existing scene host — NOT wrapping it (the B.W3 KeepAlive constraint).
2. `useSceneStage.ts` exposes `{ isOpen, open, close, commit }`. `App.vue` passes
   `v-model:open="stageIsOpen"` to `<SceneStage>`.
3. In `ChromeDock.vue`, the scene Select `@pointerdown` fires `emit('open-stage')` BEFORE
   the native Select opens (following the BLK-8 fix pattern: synthesise the action on
   `pointerdown`, kill the trailing native click via `event.preventDefault()` on the Select's
   `@click` handler). The dock emits `open-stage`; `App.vue` handles it with
   `stageIsOpen.value = true`.
4. The dock's `itemsPopupOpen` mutex (the dock-hold mechanism) is extended to include
   `stageIsOpen` — while the Stage is open, the dock stays expanded (the dock-collapse race
   that the existing mutex prevents for other popups applies here too).
5. The existing dock Select remains functionally intact as the keyboard/AT fallback: if a
   user focuses the Select via Tab and opens it via keyboard (space/enter on the trigger), it
   opens the standard reka-ui Select dropdown (the Stage is NOT opened by keyboard focus on
   the Select — only by `pointerdown`). This ensures the Stage does not degrade keyboard-only
   use.

> **BLK-8 / D9 discipline (press-scale swallow).** The dock trigger has a `:active scale(.96)`
> press animation that historically swallowed `pointerup` and broke actuation. The fix is
> already documented in MEMORY `feedback_glass_ui_root_changes.md`: the fix lives in glass-ui
> root. For the Stage invocation: fire `open-stage` on `pointerdown` (not `click`) so the
> trigger action completes before the `:active` press-scale begins. The trailing `click` event
> is killed via `event.preventDefault()` to prevent the Select's default open behaviour from
> racing the Stage open. This is the exact `@mbabb` pattern documented in the MEMORY.

### The deferred ledger (N's chronic terminal)

The M `PROGRESS.md` is the current `proof:chronic-closure` substrate (after M.WZ). N.WZ
re-points M→N by authoring `docs/tranches/N/PROGRESS.md §"Open deferrals"` and atomically
switching `CHRONIC_LEDGER` in `proof-chronic-closure.mjs`.

The N deferred rows inherit the M ledger (with chronicity incremented by one tranche). N
introduces new potential deferrals from N's own waves — if any N item is not FOLDED at close,
it is recorded with an explicit terminal disposition. Known N deferred candidates:

| Row | Expected disposition at N close |
|-----|--------------------------------|
| `stage-hover-brighten` mobile (touch has no hover) | RECORD — the stage is pointer-primary; touch collapse is OUT (the mobile layout is a flat swipeable sheet, not the 3D carousel — a future tranche) |
| Stage light-mode TASTE verdict | USER-DOMAIN — the design-synthesis §"light/dark theatrical read" notes an explicit TASTE call is needed; N.WZ captures the user's verdict or records it as USER-DOMAIN-PENDING |
| `--glass-stage-specular` on specular="off" guard | HANDOFF → glass-ui specular="off" guard (`~4.1.0` when published) OR KILL if the front-plate specular is unconditionally `@supports`-gated |
| N.W5 home scene idle | FOLD if implemented; RECORD if deferred (the home scene is the 8th, the ring carries 7; home idle is a bonus) |

### Version cut (USER-DOMAIN)

The Stage is a pure demo addition — no library API changes. The version increment is therefore
a MINOR bump from the current post-M published version. The USER-DOMAIN decision: Mike Babb
fires `changeset version`; the agent proposes `minor` (no library breaking changes in Tranche N).
N.WZ records the proposed criteria; the user fires the cut; the FINAL cites the OBSERVED
`package.json` version AFTER the cut.

---

## Scope

### S1 — Production integration: Stage mounted in `App.vue` + dock wired

**Breach.** The Stage overlay is built but not mounted in the SPA. The dock scene-Select trigger
still opens the reka-ui dropdown. Users cannot reach the Stage.

**Cure.** (a) In `App.vue`: add `<Teleport to="body"><SceneStage v-model:open="stageIsOpen"
@commit="onStageCommit" /></Teleport>` (a sibling to the existing `div.scene-host`, never
wrapping it). Add `const stageIsOpen = ref(false)`. Add `function onStageCommit(id: string) {
runSceneSwitch(id); stageIsOpen.value = false; }` (the commit routes through `runSceneSwitch`
per N.W6; N.WZ wires the App-level integration).

(b) In `ChromeDock.vue`: the scene Select trigger acquires a `@pointerdown.prevent` handler
that emits `'open-stage'` to `App.vue`. The `:active` press-scale swallow is avoided by
firing on `pointerdown` and `prevent`ing the native click. The existing reka-ui Select
`v-model` is NOT removed — it remains open-able by keyboard (the AT fallback path).

(c) Dock-hold mutex: `itemsPopupOpen` (or the equivalent dock-hold computed) includes
`stageIsOpen` — `computed(() => itemsOpen.value || stageIsOpen.value)` feeds the dock's
`keepExpanded` prop.

**Falsifiable check.** `proof:stage-supersedes-dropdown`:
- Load the SPA; click (via `pointerdown`) the scene Select trigger in the dock.
- Assert the Stage overlay (`[data-component="SceneStage"]` or `[popover]` on the stage root)
  is present and visible in the DOM.
- Assert the reka-ui Select dropdown is NOT open (the `pointerdown.prevent` blocked it).
- Assert the dock is in expanded state (dock-hold active while stage is open).
- Navigate the Stage to a different scene via Enter; assert the Stage closed and the new
  scene is mounted.

### S2 — `proof:stage-supersedes-dropdown` gate authored (born-RED)

**Breach.** No gate asserts the Stage is the active production path. The integration could
be accidentally reverted (the reka-ui Select re-takes over) with no CI signal.

**Cure.** Author `scripts/proof-stage-supersedes-dropdown.mjs` as an AXIS-1 browser gate
(opens the SPA, actuates the dock Select trigger via `pointerdown`, asserts the Stage opens,
commits to a new scene, and asserts state preservation). Structure:

```
C1 — Stage opens on dock trigger pointerdown (not click)
C2 — reka-ui Select dropdown NOT opened simultaneously
C3 — Dock stays expanded while Stage is open (dock-hold mutex)
C4 — commit(id) from Stage routes to runSceneSwitch (the VT fires OR useSceneSwap fallback)
C5 — new scene mounts; data-scene-state === 'idle' after settle
C6 — sceneMachine context unchanged (state preserved, no KeepAlive)
C7 — Keyboard path: Tab to Select, Space → reka-ui dropdown opens (AT fallback intact)
```

The gate is wired into `proof:correctness` (AXIS-1, not hygiene — this is a UI/interaction
correctness assertion, the primary production path).

**Falsifiable check.** Today `SceneStage` is absent in `App.vue` (`grep -rn "SceneStage"
demo/app/App.vue` → 0 matches) → C1 is RED. After cure: all 7 clauses exit 0. Planted
violation: remove the `@pointerdown.prevent` handler → C2 fails (dropdown opens alongside
Stage); add a KeepAlive wrapper → C6 fails (scene state blows up).

### S3 — `FINAL.md` held to inv-ε (every boundary cites its observed oracle)

**Deliverable:** `docs/tranches/N/FINAL.md` — the N close report, Band B + production
integration, held to inv-ε.

Each boundary claim cites its observed oracle:

- **Band B — the Stage.** Cites N.W1 (stage shell + downlight — `proof:n-stage-shell` GREEN);
  N.W2 (carousel ring — `proof:n-carousel-ring` GREEN + `proof:n-stage-boundary` GREEN
  confirming no heavy STATIC edge in the demo graph); N.W3 (arrows — `proof:n-arrows` GREEN);
  N.W4 (living previews —
  `proof:stage-previews-live` GREEN + `proof:stage-preview-boundary` GREEN); N.W5 (per-scene
  idles — `proof:stage-scene-idles` GREEN); N.W6 (hover-brighten + commit —
  `proof:stage-hover-brighten` GREEN + `proof:stage-commit-path` GREEN); N.W7 (a11y + PRM +
  perf — `proof:stage-a11y` GREEN + `proof:stage-prm` GREEN + `proof:stage-perf-budget` GREEN).
- **Production integration.** Cites `proof:stage-supersedes-dropdown` GREEN (the dock trigger
  opens the Stage; the AT fallback Select intact; state preserved on commit).
- **LIGHT-barrel discipline.** Cites `proof:boundary` GREEN with the stage present in the demo
  build — the Stage picker imports only LIGHT exports; the heavy engine chunks are NOT pulled
  into the interaction layer.
- **The KeepAlive invariant.** Cites the `proof:stage-commit-path` C5 clause (no KeepAlive
  ancestor on scene host) and `proof:stage-supersedes-dropdown` C6 (state preserved via
  sceneMachine, not vnode cache).
- **PRM contract.** Cites `proof:stage-prm` GREEN — all 5 PRM clauses (ring snap, light freeze,
  static previews, no-VT entry, arrow CSS).
- **a11y.** Cites `proof:stage-a11y` GREEN — keyboard carousel, ARIA listbox, aria-live, 44px
  targets, focus routing.
- **Perf budget.** Cites `proof:stage-perf-budget` GREEN — `will-change` lifecycle, no per-item
  backdrop-filter, blur ≤ 8px, concurrent loops ≤ 5.
- **The deploy round-trip oracle.** Cites the observed CI run ID → `deploy-pages.yml` run ID
  → live `index-*.js` hash equal to the freshly-built artifact for the merge SHA (S6 below —
  the J/K/M exact-byte form).
- **The light-mode TASTE oracle.** Cites the user's verdict on the theatrical-dark treatment
  in both themes (S7 — USER-DOMAIN RECORD, never an agent PASS).

**Anti-overclaim discipline (the inv-ε keystone).** The FINAL does NOT assert the Stage
"production-ready" without each named gate GREEN. The deploy is "observed" ONLY when the
live-served `index-*.js` hash is shown equal to the build artifact — a local `proof:all` GREEN
is not the deploy claim. Deferred items are named with tripwires, not asserted closed. The
version cut is NOT asserted until the OBSERVED `package.json` version after the user fires the
tag.

### S4 — Deferred ledger TERMINATED M→N (`N/PROGRESS.md §"Open deferrals"`)

**Deliverable:** `docs/tranches/N/PROGRESS.md §"Open deferrals"` (ABSENT today) with every row
at a terminal disposition; the non-vacuity protocol (the K.WZ/L.WZ/M.WZ planted-row RED
discipline).

**Procedure (ONE atomic commit, NOT split):**

(a) Plant three deliberately-malformed rows in `N/PROGRESS.md §"Open deferrals"`:
```
# Planted row 1 — FOLD citing a source-shape gate
| DN-PLANT-1 | N | 1 (N) | FOLD → N.W0 | N.W0 | `proof:boundary` (source-shape grep) |
→ must RED: FOLD cites a source-shape gate (not RUNTIME)

# Planted row 2 — HANDOFF targeting unpublished future version
| DN-PLANT-2 | N | 1 (N) | HANDOFF → glass-ui 5.0.0 | N.W1 | glass-ui 5.0.0 not on npm |
→ must RED: tripwire is not a published-consume-edge

# Planted row 3 — bare BOOK, chronicity ≥ 4
| DN-PLANT-3 | C | 6 (C..N) | BOOK (future decide) | — | — |
→ must RED: bare BOOK with chronicity ≥ 4 violates P-invariant-28
```

(b) Run `node scripts/proof-chronic-closure.mjs` — confirm RED on all three.

(c) Remove planted rows; confirm GREEN on the clean terminal N ledger.

(d) In the SAME commit: re-point `CHRONIC_LEDGER` M→N.

**Falsifiable check.** After the atomic commit: `proof:chronic-closure` exits 0 with output
`✓ proof:chronic-closure — the N ledger is TERMINAL`. The substrate
`scripts/proof-chronic-closure.mjs` constant reads `docs/tranches/N/PROGRESS.md`. The M ledger
is no longer authoritative (the re-point), but its content is preserved as a historical
record.

### S5 — Prompt-recap CONFIRMED (`prompt-recap-N.md` TOTAL)

**Deliverable:** `docs/tranches/N/audit/prompt-recap-N.md` (ABSENT today) extended through
the close; every distinct owner request across the N campaign at a terminal verdict.

N campaign requests: the Stage design synthesis (the 7-locked-decisions; the DK64 reference);
the prototype ask; the wave-spec authoring ask (this task); adversarial harden; the LIGHT-barrel
discipline; the TASTE call on light-mode theatrical dark; "production integration where the Stage
supersedes the dropdown".

Terminal-verdict vocabulary: ADDRESSED (gate GREEN), RECORD (documented, not an action), HANDOFF
(sibling-owned, named tripwire), USER-DOMAIN, OUT.

### S6 — `proof:all` GREEN + deploy round-trip RE-observed

**Gate.** `npm run proof:all` GREEN on the N close tree — the full consolidated roster.

**Deploy round-trip (the J/K/M exact-byte form):**

1. `proof:all` GREEN — observe the run.
2. Close-merge to master → CI run N+1 GREEN — observe run ID.
3. `deploy-pages.yml` fires as a `workflow_run` consequence — observe run ID.
4. The live `keyframes.babb.dev` `index-*.js` filename equals the freshly-built `dist/gh-pages`
   hash for the merge SHA — observe the hash equality.

All four observed with their run IDs / filenames in the FINAL. Never an assertion; always an
oracle. The deploy is "observed" ONLY when the live-byte hash equality is shown.

The `proof:all` roster includes ALL N-wave gates, named EXACTLY as the wave files author
them (the gate SOURCE-of-record — no third spelling): `proof:n-stage-shell` (N.W1),
`proof:n-carousel-ring` + `proof:n-stage-boundary` (N.W2), `proof:n-arrows` (N.W3),
`proof:stage-previews-live` + `proof:stage-preview-boundary` (N.W4), `proof:stage-scene-idles`
(N.W5), `proof:stage-hover-brighten` + `proof:stage-commit-path` (N.W6), `proof:stage-a11y` +
`proof:stage-prm` + `proof:stage-perf-budget` (N.W7), `proof:stage-supersedes-dropdown` (N.WZ),
plus the two cross-cutting invariant gates `proof:no-keepalive` and `proof:no-raw-raf` (see
the gate-name reconciliation note in PROGRESS.md §1). All must be in `package.json` under
`proof:correctness` (AXIS-1 browser gates) or `proof:hygiene` (`proof:stage-preview-boundary`
+ `proof:n-stage-boundary` — AXIS-2 import-graph scans) before the merge.

> **Gate-name reconciliation (adversarial audit, 2026-06-17).** Earlier drafts of this
> roster cited `proof:stage-shell` / `proof:stage-ring` / `proof:stage-arrows` — names NO
> wave file authors. The canonical names are the wave-file names above. PROGRESS.md §1's
> headline-gate column (`proof:no-keepalive`, `proof:ring-spin`, `proof:arrow-hittarget`,
> …) names the CLAUSE-level observables WITHIN those wave gates, not separate `package.json`
> keys; the binding `package.json` keys are the `proof:n-*` / `proof:stage-*` names here.

**Constraint (inv-M-observable-truth on the deploy).** A green local `proof:all` is NOT the
deploy claim — local may exclude `proof:peer-satisfied` and CI can red on a Linux-specific
race. The REAL observable is the bytes the site serves.

### S7 — Light-mode TASTE verdict CAPTURED (USER-DOMAIN, no gate)

**Deliverable:** a RECORD row in `N/FINAL.md` capturing the user's explicit TASTE verdict on
the theatrical-dark treatment in both light and dark themes (the open question from
`research-visual-motion.md §open-questions:` "is a near-black smoked-glass theatre acceptable
UX in light mode?").

The design-synthesis §"Our-idiom translation" proposes `--stage-void: hsl(0 0% 4%)` as a
theme-invariant dark scrim. Whether the light-mode experience "still reads" is a TASTE call
— USER-DOMAIN per the K TASTE-boundary invariant. N.WZ CAPTURES the verdict — the user's
"meets the bar" or explicit light-mode adjustment — as a RECORD row. An agent "designer-eye
PASS" is corroboration only, never the verdict.

If the user has not rendered the verdict at close, N.WZ records it as USER-DOMAIN-PENDING
with the design-synthesis §"theatrical-dark problem" cited — the honest state, not an agent
stand-in.

---

## Born-RED gate

**The wave's named born-RED gates:** `proof:stage-supersedes-dropdown` (NEW — ABSENT) AND
`proof:chronic-closure` (EXISTING — re-pointed M→N in the atomic non-vacuity motion) AND
`proof:all` (EXISTING — GREEN on the N close tree is the deploy signal).

### `proof:stage-supersedes-dropdown` (AXIS-1 browser integration)

**The REAL observable (inv-M-observable-truth).** The genuine defect: the Stage exists as
a component but is not wired into the dock trigger path — a user clicking the scene Select
still gets the reka-ui dropdown, not the Stage. The proxy to AVOID: asserting `SceneStage`
is imported in `App.vue` (greens if the import exists but the component is commented out
or the trigger wiring is absent). The gate fires a real `pointerdown` on the dock Select
trigger and asserts the Stage overlay is present in the DOM.

| Clause | Today's tree | After cure |
|---|---|---|
| C1 — Stage opens on pointerdown | `SceneStage` absent in `App.vue` | Stage overlay present in DOM after `pointerdown` |
| C2 — reka Select not opened | n/a | `[data-radix-select-content]` absent |
| C3 — dock-hold active | n/a | dock stays expanded while Stage is open |
| C4 — commit routes to `runSceneSwitch` | n/a | VT fires (or `useSceneSwap` fallback) on Stage commit |
| C5 — new scene mounts + idle | n/a | `data-scene-state === 'idle'` after settle |
| C6 — state preserved (no KeepAlive) | n/a | `sceneMachine.context` unchanged; no KeepAlive ancestor |
| C7 — AT fallback intact | n/a | Tab + Space on Select → reka dropdown opens (Stage NOT triggered) |

**Today's tree result:** RED by construction — `grep "SceneStage" demo/app/App.vue` → 0 matches.

### `proof:chronic-closure` (re-pointed M→N, non-vacuity protocol)

**The REAL observable.** The three planted malformed rows RED before the clean terminal N
ledger greens — the same planted-probe discipline as K.WZ/L.WZ/M.WZ. Today the substrate
points at M; the M ledger is correct; re-pointing to an absent N ledger would also RED (the
gate requires the substrate to EXIST and be TERMINAL). Today's tree: `CHRONIC_LEDGER` points
at M (if M.WZ has closed) or at L (if M.WZ has not yet landed) — in either case, pointing at
the N ledger (ABSENT today) would RED.

### `proof:all` + deploy

**The REAL observable.** The deploy is "observed" ONLY when the live-served `index-*.js` hash
equals the freshly-built artifact for the merge SHA. A green local `proof:all` is not the
deploy claim (local may exclude `proof:peer-satisfied`; CI can red on a Linux race). Today:
`proof:all` may pass locally if all N gates are present, but the deploy gate is open until
the round-trip is OBSERVED.

**GREEN condition.** `proof:stage-supersedes-dropdown` GREEN (the Stage IS the production path;
the AT fallback Select intact); `proof:chronic-closure` re-pointed M→N with the N ledger
TERMINAL + non-vacuous; `proof:all` GREEN on the full roster; the deploy round-trip observed
(the live-byte hash equality) OR honestly NAMED-blocked; the prompt-recap total (zero drops);
the light-mode TASTE verdict captured (or recorded USER-DOMAIN-PENDING); the version cut
proposed and USER-DOMAIN-recorded.

---

## Dependencies

| Dep | Required state |
|-----|----------------|
| **N.W1–N.W7** (all Band B waves GREEN) | the full Stage must be built, tested, and all Band-B gates GREEN before N.WZ |
| **`proof:boundary`** (existing) | must stay GREEN after the Stage is wired into `App.vue` — the production integration must not introduce a heavy import into the stage interaction layer |
| **`proof:peer-satisfied`** (existing) | the deploy is gated on CI GREEN; `proof:peer-satisfied` must be GREEN (glass-ui `~4.0.0` or later pins satisfied) |
| **`proof:chronic-closure`** (existing) | the M→N substrate re-point is this wave's atomic motion; the M ledger is the current substrate (if M.WZ has closed) |
| **glass-ui `~4.0.0`** | no new glass-ui dep introduced in N.WZ; the existing pin is sufficient |
| **USER-DOMAIN version cut** | Mike Babb fires; the criteria are proposed (S5 minor bump); the FINAL cites the OBSERVED version AFTER the cut |
| inv-16 | holds throughout — all N-wave changes are under `demo/` (the picker, the scene idles, the App.vue integration); no library source modified |

---

## Bite — what regression each S-clause prevents

| S-clause | Gate | Regression it prevents |
|----------|------|------------------------|
| S1 production integration | `proof:stage-supersedes-dropdown` | The Stage exists as a component but is unreachable from the production UI — a user clicking the scene Select still gets the legacy dropdown; the theatrical Stage was built but never shipped |
| S2 `proof:stage-supersedes-dropdown` gate | Gate in `proof:correctness` | A future change accidentally re-routes the dock Select to the reka dropdown (removes the `@pointerdown.prevent` handler or the `open-stage` emit) — the gate REDs immediately on the next CI run |
| S3 FINAL.md inv-ε | Every boundary claim cites its observed oracle | The FINAL asserts `proof:boundary` is GREEN without verifying the Stage's import graph has not pulled a heavy chunk into the picker layer; or asserts the deploy without the exact-byte oracle |
| S4 deferred ledger M→N | `proof:chronic-closure` | A N-introduced chronic (e.g. the mobile-layout deferral, the glass-stage-specular HANDOFF) drifts across the N→O boundary un-dispositioned — the P-invariant-28 mis-termination recurrence |
| S5 prompt-recap | Zero drops | The owner's "production integration where the Stage supersedes the dropdown" request — the primary N ask — has no terminal verdict at close |
| S6 `proof:all` + deploy | ALL N gates GREEN; the deploy round-trip observed | A Band-B gate is absent from the `proof:all` roster (the Stage gates exist locally but are never wired into `package.json`) → the CI run misses a Stage regression; the deploy is claimed without observing the live site |
| S7 TASTE verdict | USER-DOMAIN RECORD | An agent "designer-eye PASS" substitutes for the user's TASTE verdict on the light-mode theatrical dark — the K TASTE-boundary invariant violated |
