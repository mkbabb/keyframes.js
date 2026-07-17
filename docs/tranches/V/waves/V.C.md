# V.C — DEMO SETTLEMENT (W7–W8)

Executes the Fable-adjudicated demo blueprint `../audit/R2-06-demo-target-tree.md`
(DT-01..11: complete move/merge/split table with total demo/ coverage), as
amended by `../audit/R3-04-blueprint-consistency.md` (XB-01: this band owns
the entire DD-4 sweep; XB-02: every demotion re-greps `test/` + `bench/`;
XB-03: DM-18 comment rewords run before or inside these waves, re-grepped by
token; XB-06: W9's MR4 test:demo CI job is a hard precondition).

Standing decisions (owner may veto): kebab-case dirs + PascalCase `.vue`
demo-wide; `app/dock/` extirpates to `demo/components/chrome/` with `app/`
reduced to shell wiring; kind-dirs dissolve FLAT into their modules (no
per-component sub-carve except channel-options); `instrument/utils/` →
`instrument/_shared/`; CopyButton stays a loose global atom; `scenes/`
untouched (exemplar fence — the two 480–499L scene composables take NO
action).

**Band preconditions:** W2 landed (the demo tree these waves move is the
committed slice, never the uncommitted transaction) and W9's MR4 (test:demo
in CI) live, so every move is caught by a running gate.

---

# V.W7 - Demo Grammar & Chrome Extirpation

**Name**: W7 - Demo Grammar & Chrome Extirpation
**Opens after**: W2 + MR4
**Agents**: 2 parallel (chrome unit; transport unit)
**Hard gate**: `git ls-files 'demo/app/**/*.vue'` = 0; the casing grammar
holds (no Pascal dirs outside `.vue` filenames); check + test:demo green
**Status**: blocked (band preconditions)

### Goal criterion

One casing grammar demo-wide and the OD-U19 false close made true: no
components live under `demo/app/`.

### Scope

1. DT-02: `demo/app/dock/{ChromeDock.vue,MbabbMenu.vue,index.ts}` →
   `demo/components/chrome/`; repoint `App.vue:141` (`@app/dock` →
   `@components/chrome`); `app/` retains shell wiring only.
2. DT-03: the 18-file transport move table — each root `.vue`/`.css` into its
   kebab component dir (`animation-controls-group/`, `controls-pane-wrapper/`,
   `kf-pill-tabs/`, `transport-dock/`); `controls-pane/` merges into
   `controls-pane-wrapper/`; `transport/components/` dissolves
   (DemoGlobalChrome → `animation-controls-group/`).
3. DT-09: `demo/composables/scene-facility/index.ts` → `scene-facility.ts`
   (alias-transparent); DT-10 recorded as KEEP (no move).
4. Casing normalization for the four Pascal dirs per DT-01.

### Triumvirate Dispatch

Triggers: any repoint set larger than the blueprint's grep-derived list by
more than two paths (scope reveal); test:demo red not explained by a path
move; the transaction shape differing from the blueprint's assumption
(R3-04 gap: if W2's slice moved dirs, halt and re-derive anchors); a third
diagnostic loop on one unit of work halts into triumvirate.

### File Bounds

| File | Access |
|---|---|
| the DT-02/03/09 path sets (R2-06 table) | move/modify |
| their `test/demo/**` mirrors | move/modify |
| `App.vue:141` (the `@app/dock` → `@components/chrome` repoint) | modify |

Do NOT touch: `src/**`, `scenes/**`, vite/vitest aliases (verified stable —
DT negative), glass-ui.

### Disjointness

Chrome unit: DT-02 + App.vue. Transport unit: DT-03 + DT-09. Disjoint paths.

### Worktree Plan

Parallel units either commit-before-parallelize on the shared line or take
sibling worktrees `/Users/mkbabb/Programming/keyframes-v-w7<unit>` per
WAVE_SPEC §4b; the orchestrator runs `git worktree list` before dispatch.

### Agent Units

#### V.W7.a Chrome extirpation
- Goal: no component lives under `demo/app/` — the OD-U19 false close made true.
- Sub-gate: zero `.vue` under `demo/app`; app boots (dev probe).

#### V.W7.b Transport grammar
- Goal: the transport tree reads as one kebab colocation grammar, no split-brain.
- Sub-gate: no stranded root `.vue` beside a same-named dir; the up-and-over import (`ControlsPaneWrapper.vue:172-173`) gone; check green.

### Hard Gate

1. `git ls-files 'demo/app/**/*.vue' | wc -l` = 0.
2. Pascal-dir scan = 0 (`find demo -type d -name '[A-Z]*'`).
3. `npm run check` + `npx vitest run --project demo` green; smoke probe
   (pageerror==0, one route) green.

### Format And Lint Cadence

check + test:demo after each unit and at close; `git diff --check`.

### Verification Artefacts

Move-commit list; the two scan outputs; probe log.

### Commit Plan

Two commits (`refactor(demo/chrome): extirpate app/dock`,
`refactor(demo/transport): colocation grammar`).

### Dependencies

- **Depends on**: W2, W9(MR4). **Blocks**: W8.

---

# V.W8 - Kind-Dir Dissolution & Channel Module

**Name**: W8 - Kind-Dir Dissolution & Channel Module
**Opens after**: W7
**Agents**: 2 serial (dissolution unit; sweep unit)
**Hard gate**: zero `{components,composables,utils}` kind-dirs under
`demo/components/instrument/**`; ChannelOptions ≤ the adopted ceiling;
test:demo green; the DD-4 sweep table complete
**Status**: blocked (W7)

### Goal criterion

Colocation is total under instrument/: every composable lives with its owner,
the channel-options module encapsulates its panel family, and no demo symbol
is exported beyond its consumers.

### Scope

1. DT-04/04b: transport composable re-homes (useScrollFade →
   `transport/_shared/`; useRafLoop + useDemoTicker → `demo/composables/`;
   useDragCapture → `playback/`); retire the two re-export shims — repointing
   `ChannelControls.vue:230` AND
   `test/demo/state/no-shadow-playback-authority.test.ts:21` (the live test
   consumer R1-05 missed) in lockstep.
2. DT-05: keyframes/ + timeline/ kind-dirs dissolve FLAT into their modules;
   repoint intra-module + the 2 test imports.
3. DT-06/07: `channel-options/` sub-module (ChannelOptions.vue + LayerConfigPanel
   + TimingFunctionPanel + their 3 composables); extract `EasingField.vue`
   (~140L) — and `ChannelLabelRows.vue` if the owner adopts the 400 ceiling
   (OWNER DECISION: 500 → one extraction; 400 → two).
4. DT-08: `instrument/utils/` → `instrument/_shared/` (+ repoint 4 consumers
   + `ios-text-entry.test.ts:5`).
5. The DD-4 demo demotion sweep, RE-DERIVED on the moved tree with `test/` +
   `bench/` in the grep corpus (XB-02: `isIOSLikePlatform` stays exported —
   five live test calls).
6. CT-04 (R1-09): the 11 deep `@src/animation` internals imports across 8 demo
   files reach zero. Default mechanism: re-home the four reused helpers
   demo-side or import through the public barrel where already exported;
   PUBLIC-SURFACE ADDITIONS ARE OWNER-GATED (the frozen-surface invariant) — if
   promotion is the right call, present it as an owner decision, do not land it.
7. Extend `proof:structure` scope to `demo/`; red-witness the ceiling +
   kind-dir rules against the pre-move demo tree (`ChannelOptions.vue` 609L +
   the instrument kind-dirs are the live reds), green post-move.

### Triumvirate Dispatch

Triggers: a dissolution that reveals a hidden cross-module consumer web
(>2 unexpected repoints); ChannelOptions carve exceeding its section
boundaries; test:demo red beyond path moves; a third diagnostic loop on one
unit of work halts into triumvirate.

### File Bounds

| File | Access |
|---|---|
| the DT-04..08 path sets (R2-06 table) + named test files | move/modify |
| the 8 demo files carrying deep `@src/animation` imports (CT-04) | modify |
| `scripts/gates/structure/index.mjs` (demo-scope extension, Scope 7) | modify |

Do NOT touch: `scenes/**`, `src/**`, `demo/state/**` membership (honest global
surface — DT negative).

### Disjointness

Dissolution unit (Scope 1–4) precedes sweep unit (Scope 5); serial.

### Agent Units

#### V.W8.a Dissolution + channel module
- Goal: colocation is total under instrument/ and the channel-options module encapsulates its panel family.
- Sub-gate: kind-dir scan = 0 under instrument/; check + test:demo green; EasingField extraction leaves ChannelOptions under the adopted ceiling.

#### V.W8.b DD-4 sweep
- Goal: no demo symbol is exported beyond its consumers and no demo file reaches library internals.
- Sub-gate: the demotion table (symbol → consumers incl. test/bench → verdict) complete; no red in either vitest project.

### Hard Gate

1. `find demo/components/instrument -type d \( -name components -o -name composables -o -name utils \)` = 0.
2. `wc -l` ChannelOptions.vue ≤ ceiling; extraction files exist with real
   template content (no stub).
3. check + test:demo + smoke probe green; DD-4 table archived.
4. `proof:structure` scope extended to `demo/`: the ceiling + kind-dir rules
   red-witnessed against the pre-move demo tree, green post-move (their W4-staged
   witnesses discharged here).
5. `grep -r 'from "@src/animation' demo/` = 0 (CT-04 closed).

### Format And Lint Cadence

check + test:demo per scope batch; `git diff --check` at close.

### Verification Artefacts

Kind-dir scan output; DD-4 table; carve line counts; probe log.

### Commit Plan

Per-scope commits (`refactor(demo/<module>): dissolve kind-dirs`,
`refactor(demo/channel-options): module + EasingField carve`,
`refactor(demo): encapsulation sweep`).

### Dependencies

- **Depends on**: W7. **Blocks**: W11 (stable anchors), W13.
