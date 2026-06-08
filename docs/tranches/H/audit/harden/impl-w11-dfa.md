# impl-w11-dfa — H.W11 LANE B: the control-surface DFA + the transition-perf budget (I2)

**Wave:** H.W11 · **Lane:** B (the control-surface DFA + perf) · **Branch:** `tranche-h-impl`
· **Scope (S4 / I2):** the per-scene control-surface VISIBILITY DFA — a third orthogonal axis on the
W1 keystone — plus a NAMED, MEASURE-FIRST transition-performance budget. File-disjoint from lanes A
(stage glass-card I5/I4), I1 (label-subgrid), C (bezier de-nest/grow I6/I7).

This note is the binding record the gate lane consumes: §1 the (scene × valid-control-surfaces) DFA
map, §2 the surface-host gating (the two tab hosts + the reka-hack supersession), §3 the
MEASURE-FIRST perf number + the budget, §4 the W1-reconcile proof, §5 the gate set, §6 the file
footprint.

---

## §1 — THE DFA MAP (scene → valid control-surface set)

The control-surface alphabet: `ControlSurface ∈ {controls, keyframes, timeline, easing, spring,
matrix-controls}`. The triad `{controls, keyframes, timeline}` is the BUILT-IN editor set;
`easing`/`spring`/`matrix-controls` are scene-specific surfaces.

| Scene (id) | superKey | Valid control-surface set | Conditional extra | Rendered outcome |
|------------|----------|----------------------------|-------------------|------------------|
| `home` | `__home__` | `[]` | — | no editor (the landing) |
| `cube` | `Cube` | `[controls, keyframes, timeline]` | `matrix-controls` (when Matrix anim selected) | full triad + matrix-controls |
| `amiga` | `Amiga` | `[controls, keyframes, timeline]` | — | full triad |
| `square` | `Square` | `[controls, keyframes, timeline]` | — | full triad |
| `easing` | `Easing` | `[easing]` | — | **ONLY the Easing tab** — NO keyframes/timeline node |
| `spring` | `Spring` | `[spring]` | — | **ONLY the Spring tab** |
| `sequence` | `Sequence` | `[]` | — | **NO control panel** (self-contained stage) |
| `motion-path` | `MotionPath` | `[]` | — | **NO control panel** |

- **HOME / DEFAULT (the TOTALITY guarantee).** `controlSurfacesFor(sceneId)` is TOTAL: a declared
  scene resolves its table entry; an **unknown** id falls back to the BUILT-IN triad (never
  `undefined`). So every `(scene → scene)` navigation cell resolves a DEFINED set — no undefined
  behavior. The (scene → scene) navigation matrix is total by construction (the destination set
  depends only on the destination id).
- **The CONDITIONAL surface (cube's matrix-controls).** `matrix-controls` is valid only while the
  Matrix animation is selected, so it is NOT a static table member; it stays the cube scene's
  `extraControlTabs` injection (the existing tab-metadata carrier). The DFA records it in
  `CONDITIONAL_SURFACES.cube` so the navigation-matrix gate knows the cube cell's FULL possible
  surface set is DEFINED. `isSurfaceValidForScene("cube", "matrix-controls") === true` (may-ever-
  render); `controlSurfacesFor("cube")` does NOT include it (not-right-now-without-selection).

**Home for the DFA (data, EXTENDING W1).** The pure table + selectors live in a NEW co-located file
`demo/@/components/custom/animation-controls/stores/controlSurfaceDFA.ts` (parallel to
`sceneMachine.ts` being the pure reducer core). The reactive PROJECTION
(`useSceneMachine().controlSurfaces` — a `computed` derived from `activeScene` ONLY) is on the W1
EFFECT layer (`useSceneMachine.ts`). **The W1 reducer (`sceneMachine.ts` `transition`) is UNTOUCHED**
— the DFA is a pure orthogonal projection, never a state mutation.

---

## §2 — THE SURFACE-HOST GATING (an invalid surface CANNOT render per scene)

There are TWO tab-render sites; BOTH now render the built-in triad FROM the DFA (one authority, the
reactive `controlSurfaces` projection — no drift):

1. **`ChromeDock.vue` (the EFFECTIVE host — the App's externally-managed dock path).** The former
   `CONTROL_TABS` (unconditional triad) → `BUILT_IN_CONTROL_TABS` descriptors. `allControlTabs`
   filters them against the new `:control-surfaces` prop (the DFA projection, passed from
   `App.vue`), then unions `extraControlTabs`. A new `hasControlPanel` computed gates the
   control-panel affordances (the collapse toggle + the tab selector) on the DFA set being
   non-empty — so sequence/motion-path (empty set) show NO control affordance. **This is the DFA-
   driven supersession of those scenes' former `isControlsPanelOpen = false` poke-sets** (one
   authority for "this scene has no panel").

2. **`AnimationControls.vue` (the in-panel host — non-externally-managed standalone hosts).** The
   hard-coded `controls|keyframes|timeline` `<TabsTrigger>` literals → a `v-for` over `builtInTabs`
   (the DFA-valid subset); each `<TabsContent>` pane is `v-if="hasSurface('…')"`-gated, so an
   invalid pane never mounts (the easing scene never spins up the Monaco keyframes pane). The DFA
   gating applies ONLY when `tabsExternallyManaged` (the scene-machine-driven shell); a STANDALONE
   host (the playground EditorShell — not scene-routed, `activeScene` stays the `home` default)
   shows the FULL triad. This keeps the standalone editor un-gated while the App's per-scene surface
   is DFA-gated.

**THE REKA-TAB-FALLBACK HACKS DIE (no legacy beside the replacement).** The DFA is the explicit
owner the hacks stood in for:
- `EasingScene.vue` / `SpringScene.vue` — the `onMounted(() => nextTick(() => selectedControl =
  "easing"/"spring"))` re-assert hacks are DELETED. Rationale: the dock no longer renders the
  built-in triad for those scenes, so reka CANNOT fall back to a non-existent `controls` tab — the
  whole reason the nextTick re-assert existed is GONE. Only the deterministic default
  (`selectedControl = "easing"/"spring"`) remains.
- `MotionPathScene.vue` / `SequenceScene.vue` — the `isControlsPanelOpen = false` pokes are reworded
  to a benign closed-default; the DFA (`[]`) is now the AUTHORITY on the panel-less stage (the dock
  shows no affordance for an empty set).

---

## §3 — THE MEASURE-FIRST TRANSITION-PERFORMANCE NUMBER (bench:scene-transition)

**The named bench is `proof:scene-transition-perf` (the gated Playwright `performance.measure`
harness — the contract's "vitest bench OR Playwright performance.measure harness gated in
proof:scene-transition-perf" option B).** MEASURE-FIRST against the live render (1280×900, the built
dist), the cross-scene navigate + control-surface re-render settle was measured over the
cube↔easing↔spring matrix (a group scene + an autoplay raw-rAF scene with a scene-specific surface +
a second), from the `location.hash` assignment to the control-surface re-render committed two rAFs
after the machine's `activeScene` rests on the target:

| Metric | Measured baseline (W11, this lane) |
|--------|-------------------------------------|
| **p50** | **≈ 36 ms** |
| **p95** | **≈ 46–50 ms** |
| **max** | **≈ 46 ms** |

**THE BUDGET: `BUDGET_MS = 120`.** Named from the baseline (NOT guessed): ~2.6× headroom over the
measured p95, comfortably under the ~200 ms "feels-instant" INP threshold, while still BITING a real
regression (a transition crossing 120 ms is a perceptible hitch). The gate asserts the p95 over ≥18
driven transitions is ≤ 120 ms; the live run landed **p95 = 49.5 ms ≤ 120 ms** (PASS, with the
round-trip identity preserved).

**The round-trip identity (T2 — EXTENDS the W1 field set).** The easing↔cube cross-pair round-trips
the control projection `{selectedControl, isControlsPanelOpen}` byte-identical
(`{selectedControl:"easing", isControlsPanelOpen:true}` resumes) — the DFA-gated surface state
suspends on leave + fully resumes on `SCENE_READY` (the W1 `proof:scene-machine-irrefragable` field
set EXTENDED with the control-surface projection; no stale surface bleeds across scenes).

---

## §4 — THE W1 RECONCILE (DFA EXTENDS the FSM — proof:scene-machine-irrefragable stays GREEN)

- The DFA is a PURE orthogonal PROJECTION (`controlSurfaces` derives from `activeScene` only). The
  W1 reducer `transition` is UNTOUCHED — verified by the gate's static anchor (`sceneMachine.ts`
  contains no `controlSurface` reference) AND by the live `proof:scene-machine-irrefragable` run:
  **GREEN, all clauses** (no-route-storm · scene-isolation `selectedControl === 'easing'` · 6/6
  irrefragable matrix · scene-contract-identity · suspend-no-orphan-raf · deep-link-wins ·
  no-timing-heuristic).
- The unit test `test/control-surface-dfa.test.ts` (11 cases) unit-locks the table + totality + the
  built-in projection + the conditional surface — the pure core is unit-testable in isolation
  (no Vue, no DOM), mirroring `scene-machine-reducer.test.ts`.
- Full unit suite: **671 passed | 2 expected-fail** (the pre-existing born-RED handoffs) — no
  regression.

---

## §5 — THE GATE SET (born-RED today → GREEN on this fix; gate-authoring home is H.W8)

| Gate | Disposition | State |
|------|-------------|-------|
| `proof:scene-control-dfa` | NEW (this lane) | **GREEN** — 7/7 scenes render EXACTLY their DFA set (easing→only easing, sequence/path→no panel); the table is the single authority (no hard-coded triad, the reka hacks dead); the (scene→scene) navigation matrix is TOTAL (7/7 ordered pairs). STATIC half (source anchors + table totality) + BROWSER half (per-scene + navigation-matrix) + unit (`test/control-surface-dfa.test.ts`). |
| `proof:scene-transition-perf` | NEW (this lane, MEASURE-FIRST budget) | **GREEN** — p95 = 49.5 ms ≤ 120 ms budget over 18 transitions; the easing↔cube control projection round-trips byte-identical. EXTENDS the W1 identity field set with the control-surface projection. |
| `proof:scene-machine-irrefragable` | W1 (REUSED, must stay GREEN) | **GREEN** — the DFA extension did not break the keystone (the RECONCILE requirement). |

npm scripts wired (H.W8 folds them into `proof:all`):
- `proof:scene-control-dfa` → `node scripts/proof-scene-control-dfa.mjs && vitest run test/control-surface-dfa.test.ts`
- `proof:scene-transition-perf` → `node scripts/proof-scene-transition-perf.mjs`

Both browser halves gate on `KF_REQUIRE_BROWSER` (skip-or-fail), serve the BUILT `dist/gh-pages/`,
and settle-gate on the W1 FSM resting (the `MACHINE_KEY` localStorage poll, mirroring the W1 +
scene-perf harnesses).

---

## §6 — FILE FOOTPRINT (lane B — file-disjoint)

NEW:
- `demo/@/components/custom/animation-controls/stores/controlSurfaceDFA.ts` — the DFA pure core
  (table + `controlSurfacesFor`/`isSurfaceValidForScene`/`builtInSurfacesFor`).
- `scripts/proof-scene-control-dfa.mjs` — the per-scene + navigation-matrix DFA gate.
- `scripts/proof-scene-transition-perf.mjs` — the MEASURE-FIRST transition-budget + round-trip gate.
- `test/control-surface-dfa.test.ts` — the DFA pure-core unit test (11 cases).

MODIFIED:
- `demo/@/components/custom/animation-controls/stores/useSceneMachine.ts` — the reactive
  `controlSurfaces` projection + the `controlSurfacesFor` pass-through (effect layer; reducer
  untouched).
- `demo/@/components/custom/animation-controls/stores/index.ts` — barrel exports for the DFA.
- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue` — the in-panel triad
  rendered from `builtInTabs`; panes `hasSurface`-gated; DFA applies only when externally managed.
- `demo/@/components/custom/dock/ChromeDock.vue` — `allControlTabs` DFA-filtered;
  `hasControlPanel` gate; the `controlSurfaces` prop.
- `demo/app/App.vue` — the `controlSurfaces` computed (machine projection) bound to ChromeDock.
- `demo/app/scenes/EasingScene.vue` / `SpringScene.vue` — the reka-fallback hacks DELETED.
- `demo/app/scenes/MotionPathScene.vue` / `SequenceScene.vue` — DFA-owns-panel rewording.
- `package.json` — the two new proof scripts.

tsc-clean (`tsc --noEmit` exit 0) after the lane. NOT touched: the engine (`src/animation` — FENCED,
inv ζ); the W1 reducer (`sceneMachine.ts`); the stage/bezier/subgrid files (lanes A/I1/C); glass-ui.
