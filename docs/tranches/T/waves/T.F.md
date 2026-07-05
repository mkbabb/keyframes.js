# Tranche T — Band T.F — THE GRAND COLOCATION EDICT (structure — demo AND library)

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **THE GRAND COLOCATION EDICT (owner ask, 2026-07-05 — `OWNER-ASKS.md` row 1, verbatim).** Mid-
> development the owner issued a GRAND EDICT *"for ALL file directories"*: components COLOCATE their
> sub-components, composables, skeletons, constants, and styles — **recursively** for nested
> components; a shared `composables/`/`styles/`-style dir may hold ONLY the *truly module-/global-
> level* members; *"long running dirs must and always be broken into common modules and encapsulated
> thereof"*; the SAME treatment abstracted *"befitting"* the LIBRARY (TS-idiom, and backend-of-that-
> nature); and *"the demo … AGGRESSIVELY analyzed for deprecated, legacy, superfluous code, sub-
> optimal encapsulation, glass-ui usage, etc."* This ELEVATES T.F from "demo re-taxonomy" to **THE
> GRAND COLOCATION EDICT band — demo AND library.** The consequence for the wave set: the pre-edict
> waves **T.F1–T.F20 below are now INSTANCES of ONE standing rule** — T.F21's `proof:colocation`
> enforcement gate (each pre-edict move greens one of its clauses); and the edict adds a **GROUP G**
> of three new waves — **T.F21** (the recursive-colocation enforcement GATE — the keystone),
> **T.F22** (the LIBRARY half — per-zone internal cohesion + long-file encapsulation, ring-fenced by
> §4), **T.F23** (the AGGRESSIVE demo purge — dead-export/`any`-ceiling/throttle-DRY/glass-ui census).
> Charter §1 (the amended T.F row) and §4 (the ring-fence reconciliation) were amended same-day; this
> edict-fold cites `OWNER-ASKS.md` row 1 as its authority, and `PROMPT-RECAP.md` carries the ledger row.
>
> **What this band owns (charter §1 T.F row).** `demo/@/` → `demo/shared/`; dissolve
> `components/custom/`; the 4 editor peers → ONE `instrument/` facility with a real lazy
> barrel; `app/chrome/` → `app/dock/`; the `skeletons/` tier (no bare text-flash/spinner);
> the recursive `{components,composables,skeletons,constants}` module skeleton + the
> composed-not-just-placed gate; the provenance sweep (tranche-code archaeology OUT of
> shipped comments); the scene orchestrator splits (sequence/motion-path/spring) + a shared
> `createPainterRegistry`; state: ONE global-store registry (reset/hash/persist derive),
> naming, the `markRaw` invariant, machine reset; brittle-selector hardening + the `:deep()`
> census; the 500L-ceiling gate-dodge closed (`.vue`+`.css` counted as one); the ONE
> breakpoint source (×23 sites).
>
> **Lanes owned:** 13-demo-structure (ALL), 14-at-structure (ALL), 15-app-prune (recs 1–4;
> rec 5 = OD-3, cross-ref), 16-scenes-composition (ALL), 22-state-stores (ALL),
> 18-brittle-selectors (recs 1, 2, 4, 5, 6 — rec 3 is T.E11's lockstep exemplar),
> 19-fragile-css (rec 1 — the breakpoint; recs 2–7 are T.D's).
>
> **The meta-fact this band is the subject of (the through-line of lanes 13/14/22/18).**
> Every S.D structural gate is GREEN on a tree the owner rejected on sight (VERDICT #26).
> `proof:app-is-shell`, `proof:shared-has-n-consumers`, `proof:scene-colocated`,
> `proof:claude-paths-live` each answer a LOCAL predicate ("is file X in the right dir by
> import-count?") and every one passes; NONE answers the GLOBAL question the owner asked —
> *"can I read this tree?"* — because a literal `@` directory, a vestigial `custom/`
> shadcn-tombstone every import still spells, a 1,561-line `styles/` god-drawer, and a
> control facility shattered across four sibling peers are all predicate-legal. This is the
> CLAUDE.md gate-blindspot lesson recurring on the **structure** axis. **The binding
> consequence for THIS band: a structural gate is necessary, never sufficient.** T.F
> authors better predicates AND rewires the ones that reward the wrong shape (F7 closes the
> 500L `.css`-laundering; F5's facility gate + F7's `proof:module-composed` measure
> *composition depth*, not placement) — but the tree's LEGIBILITY remains an owner call
> routed through **T.M**'s owner-review mechanism, not a green checkmark. Every wave here is
> **BORN-RED** (structure is falsifiable on the source shape); **none is a taste
> disposition**, so none is born-OWNER — the one appearance seam (F8's skeleton visual)
> defers its *look* to T.M2/T.D and keeps only its *structural* clause blocking.

## §0 The DAG — this band lands AFTER T.E settles the survivor set

```
(T.E FIRST — the subtractive band shrinks what T.F re-homes:
   T.E1 deletes scenes/compose/  → no useAssetManager store, no asset-manager sub-package
   OD-1 rules morph+motion-path  → FUSE into scenes/svg/ (T.E2) OR PRUNE (T.E3)
   T.E6/T.E8 redesign easing      → the 1,082L easing-editor/ cluster is DELETED (→ EasingPicker))
        │
T.F1 (demo/@/ → demo/shared/) ── the root rename; every move below rides its alias repoint
   ├── T.F2 (dissolve components/custom/)                         [rides F1]
   ├── T.F3 (app/chrome/ → app/dock/ + relocate DemoGlobalChrome) [∥ app-side; edge T.C dock recut]
   └── T.F4 (empty app/ of scene-shared recipes)                  [∥ app-side; edge T.B decoy-delete]
        │
T.F5 (instrument facility + real lazy barrel) ── after F2; consumes T.E8 (easing-editor gone)
   ├── T.F6 (recursive module normalize + flatten controls/composables/)   [enforced by F7]
   └── T.F7 (500L gate-dodge close + proof:module-composed)                 [the gate substrate]
T.F8 (skeletons tier)                                             [∥; look → T.M2/T.D]
T.F9 (shared createPainterRegistry) → T.F10 (scene orchestrator splits)    [F10 edges T.E6/OD-1]
T.F11 (ONE global-store registry + machine reset) → T.F12 (naming + markRaw + superkey)  [edge T.B machine]
T.F13 (shared-tier leaf re-homing)                               [∥]
T.F14 (brittle-selector gate hardening) ∥ T.F15 (:deep census) ∥ T.F16 (roving-tabindex + de-vanity)
T.F17 (refcount #highlightjs-theme)                              [∥]
T.F18 (single-source the breakpoint)                             [edge T.D19 dvh — same @media blocks]
T.F19 (provenance sweep) ∥ T.F20 (heavy-<style> advisory)        [F20 rides F7's dodge-close]

══ THE GRAND COLOCATION EDICT (2026-07-05, OWNER-ASKS row 1) — GROUP G ══
T.F21 (proof:colocation — the STANDING keystone) ── F2/F4/F5/F6/F8/F13 are its INSTANCES; EXTENDS C-23
T.F22 (library half — per-zone cohesion + long-file encapsulation)  [§4 ring-fence BINDING; edge T.G hot paths]
T.F23 (aggressive purge — dead-export ∥ any-ceiling ∥ throttle-DRY ∥ glass-ui census)  [edge T.H · T.S · T.B]
```

Every move is **alias-mediated** — source churn is config-line-dominated, and each rename
lands in ONE commit with its gate/anchor rewire (the S.D2/P2-1 same-commit-atomicity
discipline; the drive lesson: gates anchor literal paths — grep `scripts/` for every moved
basename in the same motion).

## §1 Wave index

| id | title | size | born | lanes |
|---|---|---|---|---|
| T.F1 | `demo/@/` → `demo/shared/` (reverse the S.D4 S4 "keep @/" ruling) | S | RED | 13 rec 1 |
| T.F2 | Dissolve the vestigial `components/custom/` wrapper | S | RED | 13 rec 2 · 14 rec 1 |
| T.F3 | `app/chrome/` → `app/dock/`; relocate `DemoGlobalChrome` to `app/` root | S | RED | 13 rec 6 · 15 rec 3 · 14 rec 3 |
| T.F4 | Empty `app/` of scene-shared recipes; tighten the shell predicate | S | RED | 13 rec 5 · 14 F5 |
| T.F5 | The instrument facility: 4 editor peers → `instrument/` + a real lazy barrel | L | RED | 13 rec 3 · 14 rec 4 |
| T.F6 | Recursive module-skeleton normalize + flatten `controls/composables/` | M | RED | 13 rec 9 · 14 F8 |
| T.F7 | The 500L gate-dodge close (`.vue`+`.css` as one) + `proof:module-composed` | M | RED | 14 rec 2 · 25 rec 1 (cross-cite) |
| T.F8 | The `skeletons/` tier + per-scene shaped skeletons (no bare text-flash/spinner) | M | RED | 13 rec 8 · 16 rec 6 |
| T.F9 | The shared `createPainterRegistry` primitive; retire the 2 hand-dup copies | S | RED | 16 rec 5 |
| T.F10 | Scene orchestrator splits (sequence · motion-path · spring · easing) | L | RED | 16 recs 1,2,3,4 |
| T.F11 | ONE global-store registry (reset/hash/persist derive) + machine reset | M | RED | 22 recs 1,5,6 |
| T.F12 | Store naming + the `markRaw` construction-invariant + the amiga superKey dedup | M | RED | 22 recs 2,3,4 |
| T.F13 | Shared-tier leaf re-homing: `gestureSelectSuppression`→`utils/`, `kfEngine`→`state/` | S | RED | 14 recs 6,7 |
| T.F14 | Brittle-selector gate hardening: root-scope tab-panel selectors + widen the gates | M | RED | 18 recs 1,5 |
| T.F15 | The `:deep()` census: vendor public prop over `:deep()`; centralize per-vendor | M | RED | 18 rec 2 |
| T.F16 | Roving-tabindex convergence + de-vanity `KfPillTabs` (→ upstream aria ask) | M | RED | 18 rec 4 · 13 rec 7 · 14 rec 5 |
| T.F17 | Refcount the `#highlightjs-theme` singleton | S | RED | 18 rec 6 |
| T.F18 | Single-source the `1023/1024px` breakpoint via `theme(--breakpoint-lg)` | S | RED | 19 rec 1 |
| T.F19 | Provenance sweep: strip tranche-ID citations from shipped comments | M | RED | 15 recs 1,2 |
| T.F20 | Heavy scoped `<style>` → sibling `.css` (advisory, observe-only) | S | RED (advisory) | 13 rec 10 |
| **T.F21** | **THE RECURSIVE-COLOCATION ENFORCEMENT GATE (`proof:colocation`) — the edict keystone** | M | RED | 13 (F3/F4/F7/F8) · 14 (F4/F6/F7) · 25 rec 1 · 21 |
| **T.F22** | **THE LIBRARY HALF: per-zone internal cohesion + long-file encapsulation (`proof:zone-cohesion`)** | L | RED | 24 · 25 · 21 · 16 |
| **T.F23** | **THE AGGRESSIVE DEMO PURGE: `proof:no-dead-export` + `any`-ceiling + throttle-DRY + glass-ui census** | L | RED | 21 (recs 4,5,6) · 25 rec 2 |

All 23 waves red on today's `tranche-s-impl` tree (T.F1–T.F20 pre-edict + T.F21–T.F23 the
2026-07-05 GRAND COLOCATION EDICT additions) — the plants are verified below (§Group G for the
three edict waves).

**Verified on the tree (the born-RED plants).** `demo/@/` is a literal on-disk directory;
`demo/@/components/` has exactly ONE child (`custom/`); the four editor peers
(`animation-transport`, `easing-editor`, `editor-shell`, `keyframe-timeline`,
`keyframes-editor` — 5 dirs) sit as flat siblings; `styles/` = `design-idioms.css` **887L** +
`style.css` **636L** + `brand.css` 38L (1,561 total); `app/chrome/{ChromeDock,MbabbMenu}.vue`
present; `app/runtime/` holds the 7 recipes; `AnimationControlsGroup.vue`285+`.css`223 =
**508** combined, `ControlsPaneWrapper.vue`199+`.css`302 = **501** combined;
`proof-demo-no-oversize.mjs:38` `SOURCE_EXT = new Set([".ts", ".vue"])` (`.css` invisible);
`proof-shared-has-n-consumers.mjs:174` carries the `if (parts[1] === "custom")` special-case;
`proof-app-is-shell.mjs:65` `ALLOWED_ROOT_DIRS` contains `"chrome"`;
`proof-no-brittle-selector.mjs:56-59` `SCENE_TARGET_DIRS` = 3 scene dirs only; five
`createGlobalState(` sites (`cubeTransformStore.ts:13`, `useAssetManager.ts:48`,
`useSceneMachine.ts:72`, `animationOptionsStore.ts:54`, `controlOptionsStore.ts:38`);
`useAmigaDemo.ts:32` `export const SUPER_KEY = "Amiga";` (a raw second literal beside
`amigaKeys.ts:5`); `controlOptionsStore.ts:33` `selectedKeyframesControl: "string"`;
`tab-trigger.css:76` `[data-state="active"][role="tabpanel"]` unscoped;
`useHighlightCSS.ts:49` `THEME_STYLE_ID` removed in `onUnmounted`; `KfPillTabs.vue` +
`useKfPillTabs.ts` + `useToolbarKeyboard.ts` (≥3 parallel roving-tabindex impls);
`AnimationControlsGroup.css:197` `@container controls-layout (min-width: 64rem)` beside 22
raw `(m*-width:102[34]px)` `@media` sites + the `useMediaQuery` JS literal, no `BREAKPOINT`
constant anywhere.

---

## GROUP A — The taxonomy moves (root → sub)

### T.F1 — `demo/@/` → `demo/shared/` (reverse the S.D4 S4 "keep @/" ruling)

- **scope.** Rename the on-disk directory `demo/@/` → `demo/shared/` and repoint the four
  alias TARGETS — `@components`→`shared/components`, `@state`→`shared/state`,
  `@styles`→`shared/styles`, `@utils`→`shared/utils` — in `tsconfig.json:39`,
  `tsconfig.test.json`, and `vite.config.ts:335`. The alias SPELLINGS consumers import
  (`@components/…`) are **unchanged**, so this is a one-dir-rename + three-config-line move,
  NOT the "every import in the tree" churn S.D4 feared (imports already route through the
  aliases). Un-rule S.D4 S4's *"terminal, not deferred: keep @/"* (`S.D.md:355-357`) — it was
  a documentation-cost argument (optimize for "no import churn," a diff metric a gate sees)
  over "a human can read the tree" (the metric no gate saw), and the owner's "demo/@ is
  totally half baked and inconsistent" (#26) is its falsification. Regenerate `demo/CLAUDE.md`
  against the `shared/` tree.
- **gate (BORN-RED).** `proof:claude-paths-live` green on the regenerated `shared/` tree AND a
  new clause forbidding a literal `@` directory anywhere under `demo/` (grep: no on-disk path
  segment equal to `@`). **Reds today:** `demo/@/` exists on disk (verified); `proof:claude-
  paths-live` describes the `@/` tree.
- **size.** S. **lanes.** 13 rec 1 (the single most-visible structural decision; lane 13 F1).
- **edges.** The ROOT every other T.F wave rides — F2…F20 all address `shared/…` targets.
  Lands AFTER **T.E1** (compose deleted) so the renamed tree is already the smaller survivor
  set. The four alias-mediated targets mean F2/F5/F13's sub-moves are config-line edits on
  top of this.
- **lockstep.** The dir rename + the 4 alias-target repoints + the `demo/CLAUDE.md` regen land
  in ONE commit; `proof:claude-paths-live` re-roots in the same motion (never leave the doc
  describing `@/` after the dir is `shared/`). Grep `scripts/` for any literal `demo/@/` path
  before committing (drive lesson: gates anchor literal paths).

### T.F2 — Dissolve the vestigial `components/custom/` wrapper

- **scope.** `demo/@/components/` has EXACTLY one child, `custom/` — the shadcn-vue
  `components/ui/` vs `components/custom/` convention whose OTHER half (`ui/`) was deleted at
  S.C3b. `custom/` now qualifies nothing; it is the sole surviving half of a dead binary
  distinction, and it is why the deepest path is 7 segments and why
  `@/components/custom/animation-transport/components/DemoGlobalChrome.vue` spells "components"
  twice (lane 14 F1). Hoist `custom/`'s contents up to `shared/components/` (after F1) and
  repoint `@components` → `shared/components` (the alias already elides the segment for
  consumers, so this is a physical move + one alias-target line + ~40 relative-import
  repoints). **Delete the gate's `custom` special-case in the same commit:**
  `proof-shared-has-n-consumers.mjs:174` (`if (parts[1] === "custom") return
  components/custom/${parts[2]}`) — the script's `sharedModuleId()` already treats
  `components/<dir>` as the unit, so the module IDs simply drop the `custom/` segment; counts
  are unchanged.
- **gate (BORN-RED).** `grep -r "components/custom" demo/ scripts/` → **0 hits**;
  `proof:shared-has-n-consumers` + `proof:scene-colocated` re-root green with the `:174`
  special-case removed. **Reds today:** `components/` has one child `custom/` (verified); the
  `:174` special-case resolves.
- **size.** S. **lanes.** 13 rec 2 + 14 rec 1 (merged — the SAME dissolve from both structure
  lanes).
- **edges.** Rides **T.F1**; precedes **T.F5** (the instrument facility groups the now-flat
  peers). The `EXEMPT_MODULES` set (`proof-shared-has-n-consumers.mjs:105`, `components/ui` +
  `styles`) is audited in the same pass — `components/ui` is already dead (its removal at
  S.C3b), so it exits the exempt list too.
- **lockstep.** The physical move + the alias-target line + the `:174` special-case delete land
  in ONE commit; never leave a gate's module-ID map pointing at a `custom/` segment that no
  longer exists on disk.

### T.F3 — `app/chrome/` → `app/dock/`; relocate `DemoGlobalChrome` to `app/` root

- **scope.** Two moves that reconcile lanes 13/14/15. **(a)** Rename `app/chrome/` →
  `app/dock/` — "chrome" is browser-jargon (`ChromeDock.vue` inside a project whose demo runs
  *in* Chrome reads as a stray browser reference, lane 15 F3), and it holds the app dock + the
  `@mbabb` menu, i.e. the *dock*. Swap `"chrome"` → `"dock"` in `ALLOWED_ROOT_DIRS`
  (`proof-app-is-shell.mjs:65`) in the same commit. **(b)** Relocate `DemoGlobalChrome.vue` —
  a document-level singleton (a hidden `#rainbow-gradient` `<defs>` paint-server + a
  `<Teleport to="html"><Toaster/>`, "neither is a layout concern," lane 14 F3) misfiled three
  dirs deep inside the transport feature peer — to `app/` root (or mount its two children
  directly in `App.vue`, the more honest shape for a true singleton). **Reconciliation:** lane
  14 F3 says "→ `app/chrome/`" and lane 13 F8 says "→ `app/` root"; since THIS wave renames
  `chrome/`→`dock/`, and `DemoGlobalChrome` is not dock chrome, it lands at **`app/` root**
  (lane 13 F8 wins), NOT inside `dock/`.
- **gate (BORN-RED).** `proof:app-is-shell` PASSES with `chrome` REMOVED from and `dock` ADDED
  to `ALLOWED_ROOT_DIRS`; `grep -r "app/chrome" demo/ scripts/` → 0; `DemoGlobalChrome.vue` has
  no `animation-transport/` ancestor. **Reds today:** `ALLOWED_ROOT_DIRS` contains `"chrome"`
  (`:65` verified); `app/chrome/` exists; `DemoGlobalChrome.vue` sits at
  `…/animation-transport/components/`.
- **size.** S. **lanes.** 13 rec 6 + 15 rec 3 (chrome→dock, merged) + 14 rec 3
  (DemoGlobalChrome relocation).
- **edges.** **T.C owns the dock COMPONENT identity** (the `DockSection` grammar recut,
  `ChromeDock.vue` → the compass/transport vocabulary; T.C1). This wave owns the **directory**
  move + the gate constant; the final component FILE name (`ChromeDock` → `AppDock`/`DockCompass`)
  follows T.C's recut — **sequence T.C1 first if it lands in the same batch**, else rename the
  directory regardless (the ambiguity is the folder word, not the filenames; lane 15 rec 3).
  `DemoGlobalChrome`'s toast root relates to nothing T.C touches. See §Charter-conflict note 3.
- **lockstep.** The dir rename + the `ALLOWED_ROOT_DIRS` swap + any `SCENE_GATE_META`/demo-driver
  path referencing `app/chrome` land together; never leave the gate constant naming a directory
  that no longer exists.

### T.F4 — Empty `app/` of scene-shared recipes; tighten the shell predicate

- **scope.** `app/runtime/` holds 7 files; five are CROSS-SCENE recipes with ZERO app-shell
  importers — every consumer is a scene (`useRafScene.ts`, `useSceneVisibilityPause.ts`,
  `rafConstants.ts`, `useContractAnimGroup.ts`, `useSceneTransport.ts` — lane 15 F1 table,
  lane 13 F5). They are gate-legal in `app/` only because `proof:app-is-shell` clause (i)
  (`:209`) *permits* a ≥2-scene-consumer file to live in `app/runtime/` — a predicate that
  answers "misfiled to exactly one area?" but CANNOT answer "does `app/` still read as *only*
  the shell?" Move the surviving cross-scene recipes to `shared/composables/` (uniform with
  `useDragScrub`/`useDoubleTap`/`gestureSelectSuppression`, which ARE exactly this class),
  leaving `app/` holding only app-lifetime code (App/main/scene-machine-binding/transition +
  the two genuine diagnostics `loaf-observer.ts` + `useMonacoCancellationGuard.ts`, which move
  to a small `app/diagnostics/`). **Tighten `proof:app-is-shell` clause (i):** a file with NO
  `app/` importer belongs in `shared/`, not `app/runtime/`.
- **gate (BORN-RED).** `proof:app-is-shell` clause (i), tightened: any `app/` file whose import
  graph has zero `app/`-rooted consumers REDs. **Reds today:** the five recipes live under
  `app/runtime/` with only scene consumers; clause (i) as-written passes them (verified — the
  gate is GREEN, the owner said "wtf is 90% of the junk in demo/app").
- **size.** S. **lanes.** 13 rec 5 (empty app/) + 14 F5 (the same clause tension).
- **edges (BIG — T.B).** **`useContractAnimGroup` + `useSceneTransport` are T.B DELETE targets**
  — root cause #2: the SceneFacility replaces the "dishonest decoy" `useContractAnimGroup` (a
  self-confessed "escape hatch") and its transport projection. **Sequence T.B's SceneFacility
  work first**; this wave then moves only the SURVIVORS (`useRafScene`,
  `useSceneVisibilityPause`, `rafConstants`) to `shared/composables/`. Do NOT relocate a file
  T.B is about to delete. **F9**'s `createPainterRegistry` also lands in `shared/composables/` —
  coordinate the destination.
- **lockstep.** Each recipe's move + its import-site repoints + the clause-(i) tightening land
  together; the tightened clause is authored WITH the moves (never green by loosening); grep
  `scripts/` for `app/runtime/<basename>` before committing.

---

## GROUP B — The facility + module shape + the composition gates

### T.F5 — The instrument facility: the 4 editor peers → `instrument/` + a real lazy barrel

- **scope.** The animation control panel is ONE facility shattered across FOUR flat sibling
  peers under `components/custom/`: `animation-transport/` (40 files/5,589L),
  `keyframes-editor/` (15/1,960L), `keyframe-timeline/` (13/1,481L), `easing-editor/`
  (4/1,082L) — ~72 files/~10,100L with no umbrella and no cohering barrel
  (animation-transport's `index.ts` is an EMPTY stub: *"Barrel removed to prevent eager
  loading … Import components directly"* — a file that exists to say "don't use me"). This is
  the "forgotten panel facility" (#25) at the FILE level, and S.D2's carve was rewarded by
  `proof:shared-has-n-consumers` (which rewards *more independently-shared units* and is blind
  to cohesion). Group the surviving peers under one `components/instrument/`:
  `instrument/{transport, keyframes, timeline, shell}/`, each with a real barrel — `export
  type` + `defineAsyncComponent` re-exports (kills the eager-load hazard the empty stub
  documents, idiomatically). Apply the uniform peer shape to ALL (lane 14 rec 4): every
  multi-file `instrument/<peer>/` gets an `index.ts` (named exports only) and folds any flat
  `use*.ts` into a `composables/` subfolder (`editor-shell`'s `useHeroSourceEgg.ts` +
  `useShareState.ts` move into `shell/composables/`).
- **gate (BORN-RED).** `proof:one-facility` — the surviving peers resolve through ONE
  `instrument/index.ts` barrel with NO eager heavy import (Monaco/highlight.js still lazy —
  assert the built chunk graph keeps them split); every multi-file `instrument/<peer>/` has an
  `index.ts` AND no `use*.ts` sits flat beside a `composables/` sibling. **Reds today:** four
  flat sibling peers, animation-transport `index.ts` is the empty stub, three peers
  (`easing-editor` pre-deletion, `keyframe-timeline`, `keyframes-editor`) carry no barrel,
  `editor-shell`'s two composables are flat.
- **size.** L. **lanes.** 13 rec 3 + 14 rec 4.
- **edges (BIG — T.E8, T.B).** **T.E8 DELETES the `easing-editor/` cluster** (1,082L → glass-ui
  `EasingPicker`) — so `easing/` is NOT a member of the `instrument/` facility; this wave
  coheres only `{transport, keyframes, timeline, shell}`. **Sequence T.E8 first**, or the
  facility groups a peer about to be deleted. **T.B's `SceneFacility`** is a RUNTIME descriptor
  (channels[]+facets[]); this `components/instrument/` is a FILE module. **Different layers —
  do not conflate the names.** glass-ui ships `InstrumentChassis` (lane 13 census) as a
  panel-shell primitive — evaluate it as the facility's chassis via **T.H** (consumption).
- **lockstep.** The physical move + the barrel authorship + every deep-import repoint
  (`@components/custom/easing-editor/EasingEditor.vue` etc., lane 14 F4) land together; the
  empty-stub `index.ts` is REPLACED by a real barrel in the same commit (never leave a barrel
  that says "don't use me").

### T.F6 — Recursive module-skeleton normalize + flatten `controls/composables/`

- **scope.** Normalize each facility sub-module to the owner's recursive
  `{components, composables, skeletons, constants}` shape (#26 "sub-components, composables,
  skeletons, constants — recursively"). Inside `transport/`: the sub-dir taxonomy is
  inconsistent — `components/` (sub-SFCs), `controls/` (ALSO sub-SFCs but with its OWN nested
  `composables/` → the 7-deep path
  `…/animation-transport/controls/composables/useTimingFunctionEditor.ts`), `composables/`
  (module-level). Flatten the double-nested `controls/composables/` back to one `composables/`
  tier (kills the 7-deep path). Fold the scattered constants (`injectionKeys.ts` 25L +
  `animationDescriptions.ts` 131L + per-file consts) into a `constants.ts` tier (lane 13 F8,
  lane 14 F8). Every module carries a `constants.ts`; the `skeletons/` slot is populated by F8.
- **gate (BORN-RED).** `proof:one-facility` depth clause — ≤6 path segments under `shared/`;
  every multi-file module carries a `constants.ts`; no `composables/composables/` double-nest.
  **Reds today:** the 7-deep `controls/composables/` path resolves; constants are scattered
  across `injectionKeys.ts`/`animationDescriptions.ts`/per-file.
- **size.** M. **lanes.** 13 rec 9 + 14 F8.
- **edges.** Rides **T.F5** (the facility is the parent). The gate is a clause of F5's
  `proof:one-facility` + enforced by **F7**'s `proof:module-composed`. `DemoGlobalChrome`'s
  relocation is **T.F3** (removes one misfiled member of `transport/`).
- **lockstep.** The `constants.ts` fold + the `controls/composables/` flatten + every consuming
  import repoint land together; the injection-KEY symbols keep identity (a rename would silently
  break `provide/inject` — move the file, not the symbol).

### T.F7 — The 500L gate-dodge close (`.vue`+`.css` as one) + `proof:module-composed`

- **scope.** Two coupled gate cures the S drive papered over. **(a) Close the `.css`-extension
  dodge (lane 14 F2).** `proof-demo-no-oversize.mjs:38` scans `SOURCE_EXT = new Set([".ts",
  ".vue"])` — a sibling `.css` is INVISIBLE, so extracting a `<style>` block to a same-basename
  `.css` drops the *measured* file under 500L while the real complexity is unchanged:
  `AnimationControlsGroup.vue`285 + `.css`223 = **508** and `ControlsPaneWrapper.vue`199 +
  `.css`302 = **501** BOTH still over the ceiling by the gate's own bar, laundered across an
  uncounted extension (three self-admitted carves, incl. `DemoGlobalChrome.vue`'s J.W7a seam).
  Extend the gate to SUM a `.vue` + its same-basename sibling `.css` as ONE unit before the 500L
  compare; then genuinely re-decompose the two over-ceiling components by markup concern (the
  desktop-grid vs. mobile-sheet halves are the natural cut, lane 14 rec 2) — NOT re-park the
  same lines behind another extension. **(b) Land `proof:module-composed` (lane 25 rec 1,
  cross-cite — the "composed-not-just-placed gate" the charter T.F row names).** A gate that
  REDs a large FLAT module whose peers are decomposed — measuring *internal composition depth*,
  not placement (lane 25 F1: `easing-editor/`/`editor-shell/` cannot stay flat while peers are
  composed). The two gates RIDE TOGETHER (band guidance): the 500L close plus the composition
  measure are the substrate F5/F6 satisfy.
- **gate (BORN-RED).** The widened `proof:demo-no-oversize` REDs on the two combined-over-ceiling
  files pre-decomposition and greens post-, with no `.css` sibling exceeding the ceiling either;
  `proof:module-composed` REDs a flat module (>threshold files/lines) whose sibling peers are
  decomposed. **Reds today:** `SOURCE_EXT` excludes `.css` (`:38` verified); 508/501 combined
  both over 500; nothing in the fleet measures composition depth (verified — lane 25 F1).
- **size.** M. **lanes.** 14 rec 2 (the dodge close) + 25 rec 1 (cross-cite — the composed gate).
- **edges.** The gate substrate for **T.F5** (facility composition) + **T.F6** (recursive
  normalize). Feeds **T.M8**'s roster-ceiling count — see §Charter-conflict note 1 (net-new gate
  vs the 203→~120 shrink). **T.F20**'s heavy-`<style>` sibling-`.css` splits are now genuine
  polish, not a dodge, BECAUSE this wave closes the laundering (the `.css` counts toward the
  ceiling too).
- **lockstep.** The `SOURCE_EXT` widening is authored WITH the genuine re-decomposition (never
  green the widened gate by a fresh sub-split that re-launders); `proof:module-composed` greens
  only after F5/F6 actually compose the modules (born-RED until then, by design).

---

## GROUP C — Skeletons + scene composables

### T.F8 — The `skeletons/` tier + per-scene shaped skeletons

- **scope.** The owner's model names *"skeletons — recursively"* (#26); `grep -rli skeleton
  demo` → **zero** (lane 13 F7). The only loading surface is `App.vue:84-88`'s `<Suspense>`
  `#fallback` — a bare `<span>Loading scene…</span>` with `animate-pulse`, shown for every lazy
  scene (9) and every lazy Monaco pane; and scenes gate their own stage with a borrowed spinner
  (`CubeTarget.vue:43-48` `<Loader2 class="animate-spin">` while `loadAnimationEngine()`
  resolves, lane 16 F6). Introduce a `shared/components/skeletons/` tier: a `SceneSkeleton.vue`
  (a glass-ui `glass-panel`/`Card` shimmer matching the stage plate) for the Suspense fallback,
  per-pane skeletons for the Monaco-bearing panes, and per-scene SHAPED skeletons matching each
  stage's geometry (cube: 6 face outlines; easing/spring/svg: a dimmed rail/stage silhouette)
  replacing the bare spinner. Removes the jarring text-flash on every scene switch (VERDICT #19
  perceived-perf sibling).
- **gate (BORN-RED, structural clause blocking; VISUAL defers).** `proof:has-skeletons` — the
  Suspense fallback renders a skeleton COMPONENT (not a raw text span); no bare icon-spinner
  gates a stage's own content (only the shared Suspense-level fallback may use one generic
  shape). **Reds today:** `App.vue:84` is a bare `<span>` (verified via lane 13 F7);
  `CubeTarget.vue:43-48` uses `<Loader2>`.
- **size.** M. **lanes.** 13 rec 8 (the tier) + 16 rec 6 (per-scene shaped, riding the tier).
- **edges.** The skeleton's VISUAL treatment (the shimmer, the shape fidelity) is an appearance
  disposition → its LOOK rides **T.M2** owner sign-off / **T.D**'s glass language; only the
  STRUCTURAL clause (fallback ≠ bare text; no stage-gating spinner) is born-RED here.
  Perceived-perf is a **T.G** concern (the text-flash is #19's sibling).
- **lockstep.** The `skeletons/` tier + the `App.vue` fallback rewire + the per-scene spinner
  replacements land together; do not leave `App.vue` pointing at a deleted `<span>` fallback.

### T.F9 — The shared `createPainterRegistry` primitive; retire the 2 hand-dup copies

- **scope.** The imperative "register a per-frame painter closure, repaint the set each frame"
  idiom is reinvented VERBATIM in two scenes: `useEasingDemo.ts:179-196`
  (`DotPainter`/`dotPainters`/`registerDotPainter`/`repaintDots`) and
  `useSpringHotPath.ts:96-111`
  (`SpringPainter`/`springPainters`/`registerSpringPainter`/`repaintSprings`) — same `Set` of
  void-callbacks, same register-and-paint-once / unregister-via-closure / repaint-all trio,
  a self-acknowledged copy (`useSpringHotPath.ts:52` "the I.W4 D4 DotPainter idiom, transposed
  from easing," lane 16 F5). Extract a generic `createPainterRegistry<Args extends
  unknown[]>()` into `shared/composables/` (beside `useRafScene` after **T.F4**) returning
  `{ register(paint): unregister, repaintAll(...args) }`. Both call sites collapse to ≤3 lines;
  the painter CLOSURES (what to paint, which refs) stay scene-private — exactly the
  shared-mechanism / private-meaning split `useDragScrub`/`useDoubleTap` already draw for
  pointer input.
- **gate (BORN-RED).** `proof:no-duplicate-registry` — no second hand-rolled `Set<…Painter>` +
  register/repaint trio exists outside the shared primitive (a grep census); both scenes'
  existing behavior tests stay green (pure refactor, zero behavior delta). **Reds today:** the
  two verbatim copies at `useEasingDemo.ts:179` + `useSpringHotPath.ts:96`.
- **size.** S. **lanes.** 16 rec 5.
- **edges.** Lands in `shared/composables/` (coordinate the destination with **T.F4**). If
  **T.E6** redesigns the easing scene (the specimen-drawer gallery), the easing consumer moves
  with it — the gallery's tile painter is the SAME direct-write class (T.E6 keeps
  `registerDotPainter`), so this primitive is exactly what it should consume. The render budget
  is a **T.G** concern.
- **lockstep.** The primitive + both repoints land together; the `no-duplicate-registry` census
  is authored WITH the extraction (never green by allowlisting a survivor).

### T.F10 — Scene orchestrator splits (sequence · motion-path · spring · easing)

- **scope.** Four scenes concentrate 7–11 nameable concerns into ONE 400–470L orchestrator
  composable while the demo's OWN ceiling-split convention (`SequenceScrubber.vue:1-5`;
  `useSequenceInstrument.ts:1-4`) says otherwise (lane 16 F0). Apply the convention uniformly,
  targeting ONLY the over-concentrated files (amiga/morph/square/cube/compose are already
  proportionate — do NOT touch them, per lane 16 Part 3 "without contrivance"):
  - **sequence (16 rec 1):** carve `useSequenceReel.ts` (the 42-line reel egg,
    `useSequenceDemo.ts:350-391`, mirroring `useSpringDerby.ts`) + `useSequenceRows.ts` (the
    storyboard-rows + `reseatRow`, `:306-348`) out of the 467L orchestrator.
  - **spring (16 rec 3):** extract `useSpringPresets.ts` (canonical preset trackers,
    `useSpringDemo.ts:87-107`) and fold the keyframes-editor animation build (`:139-163`) into
    the existing `useSpringKeyframesEditor.ts` — completing the split `useSpringDerby.ts`/
    `useSpringHotPath.ts` already started for this same 462L file.
  - **motion-path (16 rec 2, CONDITIONAL on OD-1):** split `useMotionPathGesture.ts` (409L) into
    `useMotionPathProjection.ts` (pure tangent/ratio math, `:132-255`) +
    `useMotionPathTravellerDrag.ts` (`:276-348`) + `useMotionPathControlDrag.ts` (`:168-275,
    349-409`) — the three-way split `cube/orbital-drag/composables/` already proves.
  - **easing (16 rec 4, CONDITIONAL on T.E6):** give `EasingTarget.vue`'s comparison-track
    view-mode the same sub-component split its `singular` sibling already got
    (`EasingComparisonTracks.vue` + `useEasingComparisonTracks.ts`, covering
    `EasingTarget.vue:98-137,182-362`).
- **gate (BORN-RED, advisory ceiling).** `proof:scene-orchestrator-ceiling` — an orchestrator
  composable >350L must cite ≥2 already-extracted siblings (mirroring cube/spring's actual
  practice); pure-move waves keep the scene's behavior tests green. **Reds today:**
  `useSequenceDemo.ts` 467L, `useSpringDemo.ts` 462L, `useMotionPathGesture.ts` 409L with 1
  sibling, `EasingTarget.vue` mixes two view-modes (verified via lane 16 census).
- **size.** L (aggregate). **lanes.** 16 recs 1, 2, 3, 4.
- **edges (CONDITIONAL — T.E, OD-1).** **motion-path (16 rec 2):** MOOT if **OD-1 = PRUNE**
  (T.E3 deletes the scene); if **OD-1 = FUSE** (T.E2 → `scenes/svg/`), the gesture composable
  moves INTO the svg scene and the 3-way split applies there. **easing (16 rec 4):** likely
  SUPERSEDED by **T.E6** — the specimen-drawer gallery replaces `EasingTarget.vue` wholesale
  (deletes `EasingHeroStage` AND the comparison-track branch), so the comparison-track split
  may evaporate; **defer 16 rec 4 until T.E6's redesign settles the easing view surface.**
  sequence + spring (16 recs 1, 3) are unconditional. See §Charter-conflict note 4.
- **lockstep.** Each split is a pure move verified by the scene's existing tests; the
  orchestrator-ceiling advisory is authored WITH the splits; if a scene is pruned/fused by T.E,
  its split is dropped, not stranded.

---

## GROUP D — State (lane 22)

### T.F11 — ONE global-store registry (reset/hash/persist derive) + machine reset

- **scope.** The app has ≥5 `createGlobalState` singletons but THREE independent hand-rolled
  "list of every store," none complete (lane 22 F1): `storeUtils.ts:5-9` `STORE_KEYS`
  (3 keys), `index.ts:86-99` `resetAllStores()` (2 stores + `externalResetHooks` + a key wipe),
  `hashSharing.ts:20-27` `getAllState()` (hardcodes 2 option stores) — so a "share this
  session" link silently drops the cube transform and (pre-prune) the compose layout, and
  `useCubeTransform` is in NO registry at all. Reify ONE `GLOBAL_STORES` registry (an array of
  `{ key?, reset }` entries, each store module calling `registerGlobalStore(...)` at its own
  definition site — the inversion `registerStoreReset` already models, generalized).
  `resetAllStores()`, `getAllState()`, and `STORE_KEYS` all DERIVE from this one collection
  (22 rec 1). Give `useSceneMachine` the missing symmetric live-ref `reset()` (22 rec 5) — today
  `resetAllStores()` wipes only its PERSISTED key and relies on the caller's
  `window.location.reload()` (the `index.ts:100-104` escape hatch), the exact
  persisted-vs-live split that was a fixed bug class for the asset store pre-G.W8
  (`test/demo/asset-store-singleton.test.ts`). Correct the stale
  `selectedKeyframesControl: "string"` default (22 rec 6, same-file touch) to `"keyframes"`.
- **gate (BORN-RED).** `proof:global-store-registry` — every `createGlobalState(` site in
  `demo/` (grep-discoverable) has a matching `registerGlobalStore` in the SAME file, and
  `resetAllStores`/`getAllState` contain no store-specific literal beyond the registry
  iteration; NEW `test/demo/scene-machine-reset.test.ts` (mirror `asset-store-singleton.test.ts`
  clause 3) dirties the live machine, calls `resetAllStores()` with NO reload, asserts
  `activeScene === HOME_SCENE_ID` + `perScene` empty — RED before the fix, GREEN after. **Reds
  today:** 5 `createGlobalState` sites (verified), 3 hand-enumerations, `useCubeTransform` in
  none, no `_resetSceneMachine`, `selectedKeyframesControl: "string"` (`:33` verified).
- **size.** M. **lanes.** 22 recs 1 (registry) + 5 (machine reset) + 6 (default fix).
- **edges (T.B).** **T.B owns the machine single-writer** (finish D12 onto
  `useAnimationGroupPlayback`) + machine reset + `superKey`→`SceneId`. The scene-machine
  `reset()` (22 rec 5) couples to T.B's machine-mutation-boundary discipline — coordinate so
  the reset matches the machine's own single-writer shape (likely a dedicated internal write,
  since `RESET` is scoped to one scene). **T.E1/T.E3**'s persisted-state migration (a stored
  dead `activeScene` lands on home) rides this reset. **useAssetManager registration is MOOT
  post-T.E1** (compose deleted) — the registry enrolls only the surviving stores.
- **lockstep.** The registry + the three derivations + the machine reset + the new test land
  together; the test is authored to RED first (proving the "reload always saves us" assumption
  false), then GREEN.

### T.F12 — Store naming + the `markRaw` construction-invariant + the amiga superKey dedup

- **scope.** Three state-consistency cures (lane 22 F2/F3/F4). **(a) Naming (22 rec 2):** of the
  5 `createGlobalState` singletons, 2 carry `Store` in name (`useAnimationGroupsOptionsStore`,
  `…ControlOptionsStore`), one in filename only (`cubeTransformStore.ts` → `useCubeTransform`),
  two nowhere (`useAssetManager`, `useSceneMachine`). Adopt the 3-bucket naming (Store /
  Machine / plain): rename `useCubeTransform` → `useCubeTransformStore`; leave `useSceneMachine`
  (correctly bucket `*Machine`, an FSM not a settings bag). **`useAssetManager` is MOOT
  post-T.E1** (deleted with compose). **(b) `markRaw` invariant (22 rec 3):** `demo/CLAUDE.md`
  states "Animation objects are `markRaw`" unconditionally, yet ~15 engine-constructor sites
  skip it (`useAmigaDemo.ts:73-160`, `useSquareDemo.ts:51-52,119,181,332`, and others, lane 22
  F3) — harmless today only by accident of how each var is used, but `markRaw` is a permanent
  flag ON the object so a LATER `ref()` refactor cannot silently deep-Proxy a per-frame hot-path
  object (a plausible #19 perf contributor). Enforce it as a construction-time invariant via a
  grep gate. **(c) amiga superKey (22 rec 4):** delete `useAmigaDemo.ts:32`'s independent
  `export const SUPER_KEY = "Amiga"` literal (a drift-capable duplicate of `amigaKeys.ts:5`'s
  `AMIGA_SUPER_KEY`, breaking the "8/8 scene-key parity" claim); import `AMIGA_SUPER_KEY` from
  `./amigaKeys` (cube's re-export-by-reference shape).
- **gate (BORN-RED).** `proof:store-naming` — every `createGlobalState(` binding name matches
  `/Store$|Machine$/`; `proof:markraw-engine-objects` — every `new (CSSKeyframesAnimation|
  AnimationGroup|SpringProgress|RAFPlayback|NumericAnimation|SmoothProgress|Sequence|
  ElementMorph|Timeline)\(` is immediately wrapped in `markRaw(`; `proof:scene-superkey-single-
  source` — every `use*Demo.ts` with a `SUPER_KEY =` assignment is a `= <NAME>_SUPER_KEY`
  re-export, never a raw literal. **Reds today:** `useCubeTransform` unnamed; ~15 markRaw-skipped
  sites; `useAmigaDemo.ts:32` raw literal (verified).
- **size.** M. **lanes.** 22 recs 2 (naming) + 3 (markRaw) + 4 (superKey).
- **edges.** The naming bucket + machine relate to **T.B**. The `markRaw` invariant is a #19
  perf hardening (**T.G** touches the same hot paths). Rides **T.F11** (same `state/` touch).
- **lockstep.** The `useCubeTransform`→`…Store` rename + its import repoints + the gate land
  together; the `markraw` gate is authored WITH the ~15 site fixes (never green by allowlisting a
  bare `new`); the amiga import replaces the literal in the same commit.

### T.F13 — Shared-tier leaf re-homing: `gestureSelectSuppression`→`utils/`, `kfEngine`→`state/`

- **scope.** Two mis-homed leaves in `shared/` (lane 14 F6/F7). **(a)**
  `composables/gestureSelectSuppression.ts` is NOT a Vue composable — a plain module-scope
  counter toggling a `document.body` class, zero Vue imports, no `use*` name; byte-for-byte the
  same shape as `utils/toastGuard.ts`. Move it to `utils/`, leaving `composables/` a true "Vue
  composable" tier (2 files, both genuinely reactive). **(b)** `utils/kfEngine.ts` is the tree's
  WIDEST fan-out (13 consuming areas) — the demo's synchronous accessor over the package's
  `loadAnimationEngine()` boundary (`warmKfEngine`/`kfEngine`/`kfEngineReady`), boot
  infrastructure, not a DOM/text util. Promote it beside `state/` as `state/kfEngine.ts`
  (re-exported from `state/index.ts`) — its runtime-infrastructure sibling.
- **gate (BORN-RED).** `proof:composables-are-reactive` — every file in `shared/composables/`
  imports ≥1 Vue reactive primitive (`ref(`/`reactive(`/`onMounted`/`watch(`); the
  `--dump` census's widest-fanout module no longer appears under the `utils/` prefix. **Reds
  today:** `gestureSelectSuppression.ts` in `composables/` with zero Vue imports;
  `kfEngine.ts` (13 areas) under `utils/`.
- **size.** S. **lanes.** 14 recs 6 (gestureSelectSuppression) + 7 (kfEngine).
- **edges.** Rides **T.F1**/**T.F2** (the `shared/` root). No consumer shape changes (both stay
  named-function/const imports). **T.F4**'s recipe move populates `composables/` with the true
  composables that make the reactive-tier gate meaningful.
- **lockstep.** Each file move + its import repoints + the `state/index.ts` re-export land
  together; the reactive-tier gate is authored WITH the move (never green with a non-reactive
  file still in `composables/`).

---

## GROUP E — Brittle selectors + fragile CSS (lanes 18, 19)

### T.F14 — Brittle-selector gate hardening: root-scope tab-panel selectors + widen the gates

- **scope.** Two coupled cures the two existing gates leave blind (lane 18 F1/F5, recs 1+5).
  **(a) Root-scope the tab-panel selector (rec 1).** `tab-trigger.css:76`
  `[data-state="active"][role="tabpanel"]` is NON-scoped and keyed to the STANDARD reka-ui/Radix
  convention — it paints ANY `role=tabpanel][data-state=active]` anywhere on the page, including
  one an unrelated glass-ui component renders via reka's `Tabs` internally, with zero
  compile/lint signal. Namespace it to the panel HOST (e.g. `.animation-controls-tabs
  [data-state=active][role=tabpanel]`) — scope the ROOT, not the descendant selector. **(b)
  Widen the gates (rec 5).** `proof-brittleness.mjs` clause 1 only matches bare
  `document.querySelector*`; add a second pattern for `<ref>.value?.querySelector(…)` targeting a
  THIRD-PARTY role/data convention, with an explicit allowlist of documented vendor-DOM contracts
  (mirroring the existing `LISTENER_ALLOWLIST` shape, so `useTabStripScroll.ts:52,72` stays green
  by ENTRY, not by clause blindness). Widen `proof-no-brittle-selector.mjs`'s `SCENE_TARGET_DIRS`
  (`:56-59`, 3 scene dirs) to the whole `demo/` tree.
- **gate (BORN-RED).** `proof:brittleness` clause 2 gains a named-root requirement (every
  non-scoped selector rooted on `[role=tabpanel]`/`[role=tablist]`/a bare vendor class is
  prefixed by ≥1 demo-owned ancestor class); the widened clause 1 + all-of-`demo/` class-walk
  clause both still PASS (documented sites allowlisted) and a fresh undocumented owned-ref
  vendor-subtree reach REDs. **Reds today:** `tab-trigger.css:76` is unscoped;
  `SCENE_TARGET_DIRS` = 3 dirs (`:56-59` verified); clause 1 misses the owned-ref reaches at
  `useTabStripScroll.ts:52,72` / `useToolbarKeyboard.ts:43` / `useKfPillTabs.ts:49-59`.
- **size.** M. **lanes.** 18 recs 1 (root-scope) + 5 (widen gates).
- **edges.** **T.E4** extends the SAME `proof:brittleness` with the utility-keyed-layout
  class-kill clause (`.z-dock:has(> .pointer-events-auto)`) — coordinate so both clause
  extensions land coherently (T.E4 owns the `:has()`-reposition class-kill; this wave owns the
  vendor-reach + scope widening). The allowlisted vendor contracts feed **T.H** (the glass-ui
  gap ledger — a documented reach is a delineated glass-ui-vs-demo boundary).
- **lockstep.** The selector root-scoping + the gate-clause additions land together; the
  allowlist entries are added in the SAME commit as the widened pattern (never green by leaving
  the pattern loose).

### T.F15 — The `:deep()` census: vendor public prop over `:deep()`; centralize per-vendor

- **scope.** 18 `:deep()` sites reach vendor-private DOM instead of a public prop, several
  duplicated by hand (lane 18 F2, rec 2). Cure the demo-owned cases: **(a)** swap
  `PlaybackRibbon.vue:170-193`'s `:deep(.glass-slider[data-variant=timeline]){--slider-track-
  height:1.5rem}` for the component's OWN public `<Slider size="lg" .../>` (the prop
  `PlaybackRibbon.vue:10-18` never passes — the idiomatic fix fights the same component's public
  contract). **(b)** collapse `EasingSidebar.vue:215-238` + `TimingFunctionPanel.vue:244-258`'s
  two independently-derived `:deep(.easing-curve-canvas)` pixel-arithmetic clamps into ONE sizing
  contract owned by the child (`size` prop or an exported `--easing-canvas-block-size` var the
  hosts merely SET). Gate the class: no `:deep()` targets the SAME child selector string from
  more than one file; a `size`/`variant`-prop-exists check before a `:deep()` override of a
  glass-ui sizing var.
- **gate (BORN-RED).** `proof:no-brittle-selector` (or a sibling) extended: zero `:deep()`
  targeting the same child selector string from >1 file (a duplicate-target census); a
  vendor-sizing-var `:deep()` override is permitted only where no public `size`/`variant` prop
  exists. **Reds today:** `PlaybackRibbon.vue:191` overrides a var `<Slider size>` would set;
  `.easing-curve-canvas` clamped from two files (verified via lane 18 F2).
- **size.** M. **lanes.** 18 rec 2.
- **edges (BIG — T.E8, T.D).** **T.E8's deletion of the easing-editor cluster removes the
  `EasingCurveCanvas` `:deep()` clamps as a SIDE EFFECT** — T.E8's lockstep explicitly says "do
  not re-home them onto `EasingPicker` via `:deep()` — consume its public sizing (the
  lane-18-rec-2 idiom, owned by T.F)." So this wave owns the PlaybackRibbon half + the GENERAL
  gate; the easing half is executed BY T.E8's deletion consuming this wave's idiom. The SYSTEMIC
  `.labeled-field-grid` `:deep()` case (lane 18 F2's third, in `design-idioms.css:753-820`) sits
  in a file **T.D15 restructures** — coordinate (T.D owns the idioms.css split; this wave owns
  the vendor-prop-first idiom the systemic rule should adopt or hand to glass-ui via **T.H**).
- **lockstep.** The `<Slider size>` swap + the canvas-sizing contract + the duplicate-target gate
  land together; never leave a `:deep()` override of a var a public prop now sets.

### T.F16 — Roving-tabindex convergence + de-vanity `KfPillTabs` (→ upstream aria ask)

- **scope.** The WAI-ARIA roving-tabindex + active-state pattern is carried ≥3× in parallel
  (lane 18 F4/rec 4, lane 13 F6/rec 7, lane 14 F5/rec 5): `KfPillTabs.vue`+`useKfPillTabs.ts`
  (a DM-5 contingency around glass-ui 4.0.1's UNCONDITIONAL `aria-orientation` on its
  `role=group` pill variant — verified STILL present at `glass-ui/dist/tabs.js:305-306`, so the
  fork is a LEGITIMATE a11y necessity, not a delete candidate), `useToolbarKeyboard.ts` (a third
  hand-rolled roving core), `AnimationControls.vue`'s inline `data-state` gating. The owner's
  complaint is the NAME + the reinvention (#18 "KfPillTabs?? KF? Pills? Why aren't these just
  glass-ui components?"). Two moves: **(a)** extract the shared modulo-wraparound + Home/End +
  focus-follows-selection core out of `useKfPillTabs.ts` + `useToolbarKeyboard.ts` into ONE
  `useRovingTabindex` composable both consume (kills the 3× arithmetic). **(b)** rename
  `KfPillTabs.vue`/`useKfPillTabs.ts` off the `Kf`-vanity prefix (the only `Kf`-prefixed name in
  the 37-file `.vue` corpus) to a plain-noun pair (`PillTabStrip.vue`/`usePillTabRoving.ts`), and
  record the glass-ui gap (conditional `aria-orientation` on `role`) as a BG/BH ask with the
  retire-when-upstream-ships exit condition.
- **gate (BORN-RED).** `proof:no-vanity-prefix` — no component name under `demo/` matches
  `/^Kf[A-Z]/` (a one-line grep gate); a roving-tabindex census counts keydown-roving handlers in
  `demo/` — must be 1 (the shared composable), not N re-derivations. **Reds today:**
  `KfPillTabs.vue` + `useKfPillTabs.ts` present; ≥3 parallel roving impls (verified).
- **size.** M. **lanes.** 18 rec 4 + 13 rec 7 + 14 rec 5.
- **edges (T.H, T.B/T.C).** **T.H owns the glass-ui `aria-orientation` ASK** (the BG/BH letter)
  + the version-tripwire that retires the fork once glass-ui ships the fix (the "gated-on-publish
  excision"). **T.B/T.C consume `SegmentedTabs`** where the aria bug is moot. This wave owns the
  DEMO-SIDE rename + the roving primitive NOW; it does NOT delete the fork (a11y necessity until
  upstream). See §Charter-conflict note 5 (T.E note-3 dispositions KfPillTabs to T.B/T.C/T.H —
  reconciled: T.F does the rename+convergence, T.H owns the upstream ask + eventual deletion).
- **lockstep.** The rename + the `useRovingTabindex` extraction + both consumer repoints land
  together; the glass-ui gap is filed to T.H's ledger in the same motion (never a permanent
  undocumented fork). Do NOT delete the fork to green a gate (would reintroduce the a11y defect —
  the lane-18 anti-pattern applied to a11y).

### T.F17 — Refcount the `#highlightjs-theme` singleton

- **scope.** `useHighlightCSS.ts`'s `useCodeHighlight()` lazily creates ONE shared
  `document.head` `<style id="highlightjs-theme">` (module-level `THEME_STYLE_ID:49`) and
  REMOVES it in its OWN `onUnmounted` — while being called from TWO concurrently-mounting sites
  (`KeyframesEditor.vue:175` + its always-rendered child `KeyframesAddDialog.vue:92`, lane 18
  F6). Harmless today (co-lifecycle double-`remove()`), but the resource is a document-global
  singleton lifecycle-managed as if locally owned. Move the style-element lifecycle to a
  module-level refcount (`acquire()`/`release()` — the `createGlobalState` shape `shared/state/`
  already uses): created on the FIRST consumer's mount, removed only when the LAST unmounts.
- **gate (BORN-RED, unit test).** A test mounting two `useCodeHighlight()` consumers, unmounting
  one, asserts the shared `<style>` is still present AND still updates on a subsequent `isDark`
  toggle. **Reds today:** `onUnmounted` unconditionally `themeStyle.value?.remove()`
  (`useHighlightCSS.ts:49,75,80` region verified) — the test reds on the first future
  independent-lifetime consumer.
- **size.** S. **lanes.** 18 rec 6.
- **edges.** The file lives under `keyframes-editor/`, which **T.F5** moves into
  `instrument/keyframes/` — coordinate the path. The refcount shape matches the state-tier
  discipline **T.F11/T.F12** normalize.
- **lockstep.** The refcount + the unit test land together; the test is authored to RED against
  a simulated independent-lifetime second consumer, then GREEN after the refcount.

### T.F18 — Single-source the `1023/1024px` breakpoint via `theme(--breakpoint-lg)`

- **scope.** The one mobile/desktop boundary (Tailwind's unmodified `lg`) is hand-re-derived in
  FOUR unlinked spellings across 15 files (lane 19 F1, rec 1): 17 raw `@media
  (max-width:1023px)`/`(min-width:1024px)` at-rules; 5 JS `useMediaQuery("(…-width:102[34]px)")`
  strings (no `BREAKPOINT` constant anywhere); the `@container controls-layout (min-width: 64rem)`
  rem literal (`AnimationControlsGroup.css:197`) — which is UNIT-INCOMPATIBLE with the px forms
  (64rem = 1024px only while root font-size is exactly 16px, so an a11y root-size bump trips the
  grid-placement fork at a DIFFERENT viewport than the mobile-detection forks); and the 16
  idiomatic `lg:`/`max-lg:` template utilities that already do it right. Single-source via
  Tailwind v4's `theme()` (already the build's PostCSS pipeline — no new dep): `@media (width >=
  theme(--breakpoint-lg))` / `@container … (width >= theme(--breakpoint-lg))` for the at-rules
  (removing the rem/px incompatibility), and ONE exported `export const DESKTOP_QUERY =
  "(min-width: 1024px)"` (or a runtime read of `--breakpoint-lg`) for the `useMediaQuery` sites;
  prefer `lg:`/`max-lg:` where a template can.
- **gate (BORN-RED).** `grep -rnE '\(m(in|ax)-width:\s*102[34]px\)' demo` == 0 outside a single
  constant/theme definition (and the `64rem` container literal gone). **Reds today:** 22 raw
  `@media` sites + the `useMediaQuery` literal + `@container … 64rem` (`:197` verified); no
  `BREAKPOINT`/`DESKTOP_QUERY` constant exists.
- **size.** S. **lanes.** 19 rec 1.
- **edges (T.D19 — CRITICAL COORDINATION).** **T.D19 (finish the `vh`→`dvh` migration) touches
  overlapping `@media` blocks in the SAME files** (`CubeScene.vue`, `CubeTarget.css`,
  `SequenceAxis.vue`, `style.css`, …). Sequence/coordinate so the `@media` query rewrite (this
  wave) and the `vh`→`dvh` unit migration (T.D19) do not each half-edit the same at-rule — batch
  the two so a given `@media` block is rewritten ONCE. **T.D charter-conflict note 1 already
  flags the breakpoint's double home** (charter T.D headline names it; the partition assigns rec
  1 to T.F) — this wave IS the T.F home; see §Charter-conflict note 2.
- **lockstep.** The `theme()` rewrite + the exported constant + every consumer repoint land
  together; coordinate the batch with T.D19 so overlapping files are touched once.

---

## GROUP F — Provenance + advisory

### T.F19 — Provenance sweep: strip tranche-ID citations from shipped comments

- **scope.** `demo/app/` comments cite **40+** distinct internal wave/tranche codes as
  load-bearing identifiers a reader is expected to resolve (`D9`, `R.W5`, `BLK-8`, `WV-W1-*`,
  `J.W0.S3`, `Q.WC3`, `C-4`, `a11`, …) — none resolves inside the shipped repo; they point into a
  private tranche-history the owner/contributor/cold-auditing-agent does not have open, and THIS
  (not dead code) is the mechanism behind "wtf is 90% of the junk in demo/app" (lane 15 F2). The
  reductio: `rafConstants.ts` is 87% comment for ONE exported line. Rewrite every `app/` comment
  citing a wave/tranche code to state the CURRENT behavior + its WHY in plain prose, zero internal
  identifiers (provenance lives in `git blame` + `docs/tranches/`); trim `rafConstants.ts`'s
  13-line preamble to ≤3 (lane 15 rec 2, the exemplar instance).
- **gate (BORN-RED).** `proof:no-tranche-provenance` — a curated regex bank
  (`\b[SHJKQRBD]\.[A-Za-z0-9]+`, `BLK-\d+`, `WV-W\d+-[A-Z]+-\d+`, `\bC-\d+`, `\ba\d{1,2}\b`
  word-boundary) matched against COMMENT text only (not code/CSS) in `demo/app/**` → 0 hits;
  `rafConstants.ts` ≤ 6 lines. Run once as a cleanup, keep the gate to prevent recurrence.
  **Reds today:** 40+ codes across `app/` comments; `rafConstants.ts` 15 lines (13 comment).
- **size.** M. **lanes.** 15 recs 1 (sweep) + 2 (const-trim).
- **edges.** The CSS-comment analogue (the `— DELETED`/`— REMOVED` tombstone blocks in
  `styles/`, lane 14 F8) is handled by **T.D15** (the styles de-archaeology; a `demo/@/styles/`
  provenance census, T.D15's gate: "zero eulogy blocks"). This wave scopes to CODE comments under
  `app/`; the charter T.F row's "shipped comments" ambition extends the same regex bank to
  `demo/scenes/` + `demo/shared/` as a follow-on clause (noted, not the born-RED core — the lane
  evidence is `app/`-scoped).
- **lockstep.** The comment rewrites + the gate land together; the gate matches comment text
  only (never code identifiers legitimately named `C-4` in a data string) — the regex is
  comment-scoped by construction.

### T.F20 — Heavy scoped `<style>` → sibling `.css` (advisory, observe-only)

- **scope.** For any SFC whose `<style>` block exceeds ~120L, split it to a sibling `<Name>.css`
  (the existing import-neutral pattern the demo already uses twice) — `SquareScene.vue` (200+L
  `<style>` of its 469L, `:309-469`), `SequenceTarget` peers, and equals. **Polish, NOT the
  headline** — the scenes' COMPONENT decomposition is sound (lane 13 F9; lane 16 Part 3); do NOT
  over-decompose the (already-clean) scene component graph. This is now GENUINE tidiness, not a
  size dodge, because **T.F7 closed the `.css`-laundering** (the sibling `.css` counts toward the
  500L ceiling too).
- **gate (BORN-RED, advisory — OBSERVE-ONLY, non-blocking).** An advisory tripwire: no `.vue`
  `<style>` block >~120L. Declared observe-only (lane 13 rec 10's own framing) — it surfaces the
  count, does not block CI (the split is taste-adjacent tidiness, not a correctness bar). **Reds
  today:** `SquareScene.vue`'s `<style>` exceeds 120L (verified via lane 13 F9).
- **size.** S. **lanes.** 13 rec 10.
- **edges.** Rides **T.F7** (the dodge-close makes the split honest). Coordinate scene-file
  targets with **T.E** (a pruned/fused scene's `<style>` need not be split).
- **lockstep.** The `<style>`→sibling-`.css` moves are import-neutral (`<style scoped
  src="./X.css">`); because F7 now counts the `.css`, a split cannot re-launder a >500L
  component — verify the combined `.vue`+`.css` stays under 500 after each split.

---

## GROUP G — THE GRAND COLOCATION EDICT (2026-07-05 owner amendment; `OWNER-ASKS.md` row 1)

> These three waves are the direct fold of the owner's 2026-07-05 edict. **T.F21 is the keystone**:
> it lifts the pre-edict waves' one-off predicates (`proof:one-facility`, `proof:composables-are-
> reactive`, F4's shell-tightening, F7's `proof:module-composed`) into ONE **standing** enforcement
> gate, so the recursive-colocation rule survives every FUTURE component/composable added to the
> tree — not just today's move-set. The moves in T.F2/F4/F5/F6/F8/F13 become **instances** of
> T.F21's rule (each greens one clause). T.F22 abstracts the edict to the LIBRARY (ring-fenced by
> T.md §4). T.F23 is the AGGRESSIVE demo purge, folding lane 21's now-OWNED recs 4/5/6 + the glass-ui
> census. Every wave here is BORN-RED on the source shape; none is a taste disposition.

### T.F21 — The recursive-colocation enforcement GATE (`proof:colocation`) — the edict keystone

- **scope.** Encode the edict (`OWNER-ASKS.md` row 1) as a **standing** structural gate
  `proof:colocation` — *not a one-time move*. Two clauses, both grep/AST-shaped:
  **(a) COLOCATION clause.** A satellite file whose ONLY consumer is one component/module — a
  sub-SFC, a `use*.ts` composable, a `*Skeleton.vue`, a `constants.ts` fold, a scoped-idiom `.css` —
  must live **under that component/module's own directory, recursively**, never in a shared tier and
  never misfiled into a sibling feature peer.
  **(b) SHARED-TIER PURITY clause.** Every file in a shared `composables/`/`styles/`/`utils/` dir is
  (i) consumed by **≥2 areas** — *the C-23 shared-consumer gate is the precedent*
  (`proof:shared-has-n-consumers`, S.md C-23: per-scene counting, "a module consumed by exactly one
  non-@ area is misfiled and REDs") — **extended** here from a pure consumer-count bar to a
  consumer-count **AND kind-appropriateness** bar: (ii) a `composables/` member imports ≥1 Vue
  reactive primitive; a `styles/` member is global theme/token vocabulary, not a component-local
  idiom; a `utils/` member is a generic DOM/text helper, not boot infrastructure. The pre-edict waves
  that MOVE files — **T.F2** (dissolve `custom/`), **T.F4** (empty `app/`), **T.F5** (the instrument
  facility), **T.F6** (recursive normalize), **T.F8** (skeletons tier), **T.F13** (leaf re-homing) —
  are hereby **INSTANCES of this rule**; their one-off gate keys (`proof:one-facility`,
  `proof:composables-are-reactive`, the tightened `proof:app-is-shell` clause (i)) FOLD into
  `proof:colocation` as named clauses so the rule is enforced ONCE and survives future additions.
- **gate (BORN-RED).** `proof:colocation` REDs on today's tree. **Reds today (≥3 concrete
  violations from the lane evidence):**
  1. **Colocation RED** — `editor-shell/`'s two composables `useHeroSourceEgg.ts` + `useShareState.ts`
     sit **FLAT** beside its `.vue` files while its 3 sibling peers (`animation-transport`,
     `keyframe-timeline`, `keyframes-editor`) all sub-folder theirs into `composables/`
     (lane 14 F4) — a single-owner satellite not colocated to the module's `composables/` tier.
  2. **Shared-tier-purity RED (kind)** — `demo/@/composables/gestureSelectSuppression.ts` is **not a
     Vue composable**: zero Vue imports, a plain module-scope counter toggling a `document.body`
     class, byte-for-byte the shape of `utils/toastGuard.ts` (lane 14 F6) — clause (b)(ii) RED.
  3. **Shared-tier-purity RED (kind)** — `demo/@/styles/design-idioms.css` (887L) holds
     component-scoped idioms (`.tab-trigger-*`, `.btn-playback-*`, gesture-legend, subject-hue rules)
     that belong colocated into their owning SFC's `<style>` (lane 13 F4; lane 14 F8) — a global tier
     holding component-local idiom.
  4. **Colocation RED (misfile)** — `DemoGlobalChrome.vue`, a document-global singleton (a hidden
     `#rainbow-gradient` `<defs>` paint-server + a `<Teleport to="html"><Toaster/>`), is misfiled
     **three directories deep** inside `animation-transport/components/` with one consumer that has
     nothing to do with transport (lane 14 F3; lane 13 F8) — a shell singleton colocated under the
     wrong owner. (Its relocation is executed by T.F3.)
  Corroborating: scattered constants (`injectionKeys.ts` 25L + `animationDescriptions.ts` 131L +
  per-file consts, **no** `constants.ts` tier — lane 13 F8) and the 4-flat-peer shatter of the
  control facility (lane 13 F3, ~72 files / ~10,100L with no umbrella). `proof:colocation` is ABSENT
  today (verified: no `scripts/proof-colocation.mjs`).
- **size.** M (the gate SUBSTRATE; the physical MOVES that green it are the pre-edict waves — this
  wave owns the standing rule + the clause-fold, not a second move of the same files).
- **lanes.** 13 (F3/F4/F7/F8), 14 (F4/F6/F7), 25 rec 1 (the composition-depth precedent), 21 (the
  strictness/colocation discipline `src` received and `demo` never did).
- **edges.** **EXTENDS C-23** (`proof:shared-has-n-consumers`) — the consumer-count bar gains a
  kind-appropriateness clause; do NOT author a competing consumer-count check. **Absorbs** T.F5's
  `proof:one-facility`, T.F13's `proof:composables-are-reactive`, T.F4's tightened
  `proof:app-is-shell` clause (i), T.F7's `proof:module-composed` as CLAUSES (feeds §Charter-conflict
  note 1 — the net-new-gate/roster-shrink tension; the composite IS the resolution). **T.F22** is the
  LIBRARY mirror of this rule. **T.M8** coordinates the final key count.
- **lockstep.** `proof:colocation` is authored to RED on today's tree and stays born-RED until the
  full pre-edict move-set (F2/F4/F5/F6/F8/F13) lands; each move greens ONE clause in the SAME commit
  as the move (never a move that leaves a clause dark, never a clause greened without its move). Grep
  `scripts/` for the folded predicate basenames (`one-facility`, `composables-are-reactive`,
  `module-composed`, `app-is-shell`) so their logic MERGES into the composite rather than duplicating
  it — the drive lesson: gates anchor literal paths, and two gates asserting one shape drift.

### T.F22 — The LIBRARY half: per-zone internal cohesion + long-file encapsulation (`proof:zone-cohesion`)

- **scope.** Abstract the edict *"befitting"* TS-library idiom over `src/animation/` (+ `scripts/`
  and `test/` where befitting). **T.md §4 is BINDING: the zone BOUNDARIES are ring-fenced** — the
  11-zone partition, EN-a/EN-b, the ownership inversion, the drift gates all STAND; only zone
  **internals** are in scope; **"no test files in src" stands** (lane 21 confirms zero test files in
  `src` today — the gate must PRESERVE that, not weaken it). Three moves:
  **(a) per-zone internal-cohesion audit** — each zone's `index.ts` barrel + internal file-set
  audited for cohesion; a long, multi-concern file inside a zone is broken into **encapsulated common
  modules within that zone** (the edict's *"long running dirs … broken into common modules and
  encapsulated thereof"*, abstracted from dirs to intra-zone files).
  **(b) long-file encapsulation** — 14 library files exceed 400L today (§gate). Break the genuinely
  multi-concern ones into encapsulated sub-modules WITHIN their zone; **do NOT contrive splits** —
  `presets/classic-data.ts` (458L) is a flat data table (leave it), and the per-frame hot paths
  (`physics/spring/progress.ts`, `group/group.ts`, `compile/frame-compiler.ts`) stay one file where a
  split would add per-frame indirection cost (coordinate with **T.G**).
  **(c) colocated per-zone structure** — sub-zones already exist (`compile/backward/`,
  `physics/spring/`, `engine/css/`); apply the same colocation uniformly where a zone has a natural
  sub-cluster that today sits flat.
- **gate (BORN-RED).** `proof:zone-cohesion` — a library-side companion to `proof:decomposition`
  (`scripts/proof-decomposition.mjs`, which measures the cross-file cycle/ownership RING, not
  intra-file concern density): every `src/animation/<zone>/` file over a size/concern threshold either
  decomposes into encapsulated sub-modules OR carries a justified single-concern declaration; the gate
  asserts it touches **only intra-zone file structure**, never `ZONE_DIRS`/barrel boundaries (the §4
  ring-fence, machine-checked). **Reds today:** 14 files >400L (verified via `wc -l`) —
  `physics/spring/progress.ts` 492, `engine/play-lifecycle.ts` 489, `engine/animation.ts` 483,
  `orchestration/drag/draggable.ts` 471, `compile/backward/backward.ts` 471, `ingest/cssom.ts` 466,
  `compile/backward/format.ts` 465, `presets/classic-data.ts` 458, `svg/morph-svg.ts` 453,
  `compile/frame-compiler.ts` 448, `scroll/scene.ts` 436, `compile/entry.ts` 434, `group/group.ts`
  419, `orchestration/sequence/sequence.ts` 402; **no gate measures per-zone internal cohesion**
  (`proof:decomposition` measures the ring, not the file interior).
- **size.** L. **lanes.** 24 (the library-carve ring-fence — the DECISIONS stand), 25, 21 (the `src`
  strictness sweep), 16 (the demo-side long-orchestrator analogue).
- **edges.** **T.md §4 (BINDING)** — no zone-boundary re-carving; the gate proves it stays inside
  zone interiors. **T.A**'s library touches (the plain-vars `frame.transform` projection, the MorphSVG
  attribute contract) are new-defect-driven and SEPARATE — do not conflate. **T.G** — a hot-path split
  must not add per-frame indirection; coordinate the spring/group/frame-compiler touches. **T.M8** —
  net-new gate; fold into a composite or accept as a genuine library-tier key.
- **lockstep.** Each file decomposition is a pure refactor verified by the zone's existing `test/`
  suite (regrouped to `test/<zone>/`); the cohesion gate is authored WITH the splits; the ring-fence
  is asserted by the gate NOT importing/touching `ZONE_DIRS` or any barrel — only the file interiors.
  Grep `scripts/` for any zone-file basename moved during a split (the S drive lesson — gates anchor
  literal paths).

### T.F23 — The AGGRESSIVE demo purge: `proof:no-dead-export` + `any`-ceiling + throttle-DRY + glass-ui census

- **scope.** The edict's *"demo … AGGRESSIVELY analyzed for deprecated, legacy, superfluous code,
  sub-optimal encapsulation, glass-ui usage, etc."* Four coupled cures — all from **lane 21, now
  OWNED here** (T.F's disposition table §3 gains the lane-21 rows; recs 4/5/6 flip from
  cross-ref/unowned to `→ T.F23`):
  **(a) DEAD-EXPORT sweep to zero (lane 21 rec 6 / F8).** ~37 exports have zero external consumer.
  EXCISE the confirmed-dead: `demo/@/utils/kfEngine.ts:59 kfEngineReady` (defined, exported,
  referenced nowhere) + 6 dead types (`easingGroups.ts CurveGroup`, `scenes.ts StageMode`,
  `loaf-observer.ts LoAFRecord`, `useSequenceDemo.ts SequenceRow`, `useSpringDerby.ts DerbyLane`,
  `useSpringHotPath.ts SpringPainter`); un-export `STORE_TTL_MS` (internal-only at
  `storeUtils.ts:16`); decide the ~30 reflexive composable `*Params`/`*Return`/`*Deps`/`*Options`
  interfaces (consume, inline, or un-export). Gate: `proof:no-dead-export` — a knip-shaped (or the
  ~40-line node) scan reporting zero exported symbols with no consumer across `demo`+`src`+`test`+
  `scripts`, sitting beside `proof:no-orphan-module`/`proof:no-dead-dependency` at the **export**
  granularity they miss.
  **(b) `any`-CEILING ratchet (lane 21 rec 5).** **114** `any` in `demo/` today (verified,
  `grep -rnE ':\s*any\b|as any\b|<any>|any\[\]|Record<string,\s*any>' demo` == 114) vs **7** in `src/`
  — the demo shares `src`'s `strict`/`noUncheckedIndexedAccess` tsconfig posture but never had the
  sweep. Type the store/composable/keyframes-editor boundaries (the ~100 bare `: any` cluster); keep
  genuinely-dynamic seams behind an explicit allowlist. Gate: extend the demo hygiene gate with an
  `any`-count CEILING starting at the swept number and ratcheting DOWN (the `known-violations` ratchet
  shape the engine cycle-count used) — a fresh un-allowlisted `any` REDs.
  **(c) THROTTLE DRY (lane 21 rec 4).** The identical "few-Hz cold-path readout" throttle is
  hand-rolled across ≥4 scenes: `useEasingDemo.ts:218`, `useSpringDemo.ts:229` /
  `useSpringHotPath.ts:114`, `AmigaScene.vue:151`, `useSequenceDemo.ts:194` — same
  `PROGRESS_READOUT_HZ` accumulator + reconcile-on-settle. Extract ONE `useThrottledReadout(source,
  hz)` (the hot/cold split is the CORRECT perf idiom — VERDICT #19 indicts perf); the scenes consume
  it. Gate: a census — the throttle exists in exactly 1 file; each scene's readout ref is written only
  through it.
  **(d) GLASS-UI USAGE CENSUS (edict + lane 25 rec 2).** Every hand-rolled UI primitive maps to
  **exactly one** disposition: **glass-ui-replace** (cross-ref **T.H** — the consumption gate) |
  **keep-with-reason** (a delineated glass-ui GAP with a `GLASSUI-GAP:` / BG-BH ledger row) |
  **delete**. Gate clause: for each hand-rolled/deleted-primitive site, the replacement resolves to a
  `@mkbabb/glass-ui` import OR a ledger entry OR a delete; a bespoke re-implementation with NO ledger
  entry REDs (the lane-25-rec-2 glass-ui-consumption gate — the menubar `useToolbarKeyboard` toolbar +
  the `KfPillTabs` fork are its born-RED instances, both routed to T.H).
- **gate (BORN-RED).** A composite `proof:demo-purge` (or the four keys folded per §Charter-conflict
  note 1): **Reds today** — `proof:no-dead-export` ABSENT (verified: no `scripts/proof-no-dead-
  export.mjs`) so `kfEngineReady` + 6 dead types + ~30 reflexive interfaces are un-patrolled; 114
  `demo/` `any` (verified) vs a swept target; the 5 hand-rolled throttle sites (verified via lane 21
  rec 4); the hand-rolled primitives (`KfPillTabs`, the menubar toolbar) with no gap-ledger entry.
- **size.** L. **lanes.** 21 (recs 4, 5, 6 — OWNED; findings 1–8 the surrounding census), 25 rec 2
  (the glass-ui-consumption gate).
- **edges (T.H, T.S, T.B).** **T.H** owns the glass-ui GAP LEDGER + the 3 band-aid version-tripwire
  (lane 21 recs 1/2 → the `KfPillTabs`/`usePlayActuation`/`MbabbMenu` band-aids); the glass-ui-replace
  disposition routes there. **T.B** owns rec 3 (the `TransportSource` abstraction that deletes
  `useContractAnimGroup`). **T.S** owns lane 21's src-side residue (finding 5 → **T.S4** DM-22
  de-defer; the drag-gesture carry → **T.S2**). **T.F12** already cures the `any` at the *state*-tier
  boundaries — coordinate so the ceiling counts the state-store fixes T.F12 lands. **T.M8** — the
  net-new `proof:no-dead-export` key sits beside the existing orphan/dependency gates (a genuine new
  export-granularity gate, not a fold candidate).
- **lockstep.** The dead-export excision + `proof:no-dead-export` land together (never allowlist a
  survivor); the `any`-ceiling is authored AT the swept number (never green by loosening the pattern);
  the throttle extraction is a pure refactor verified by the four scenes' existing behavior tests; the
  glass-ui census dispositions each primitive in the SAME commit as its ledger row (never a
  hand-rolled primitive left un-dispositioned).

---

## §2 Cross-band edges (summary)

| From | To | What crosses |
|---|---|---|
| **T.E1** (compose delete) | T.F5, T.F11, T.F12 | Removes `scenes/compose/` → no `useAssetManager` store/registration, no asset-manager sub-package, fewer scenes in the facility |
| **T.E8** (easing-editor delete) | T.F5, T.F10, T.F15 | The 1,082L `easing-editor/` cluster is gone → not an `instrument/` member; the easing comparison-track split (F10) superseded by the gallery; the `:deep(.easing-curve-canvas)` clamps die (F15's easing half) |
| **T.E6** (specimen-drawer gallery) | T.F9, T.F10 | The gallery keeps the `registerDotPainter` direct-write seam (F9's primitive); replaces `EasingTarget.vue` wholesale (F10 rec-4 deferred) |
| **OD-1 / T.E2·T.E3** (morph+motion-path fate) | T.F10 | motion-path split (F10 rec-2) MOOT if PRUNE; moves into `scenes/svg/` if FUSE |
| **T.E** (scene descriptor removals) | T.F3 (app/) | 15 rec-4's `scenes.ts`/`ChromeDock` `Layers`/`assets` edits are executed BY T.E1/T.E2/T.E3/T.E11's manifest rewire, not a standalone T.F wave |
| **T.E4** (utility-keyed-layout kill) | T.F14 | Both extend `proof:brittleness` — coordinate the clause additions (T.E4: `:has()`-reposition class; T.F14: vendor-reach + scope) |
| **T.E11** (gesture-manifest tell decouple) | T.F | Lane 18 rec 3 is T.E11's lockstep exemplar (the removals are T.E's ruled UI); T.F owns the OTHER lane-18 recs (1,2,4,5,6) |
| **T.B** (SceneFacility, machine single-writer) | T.F4, T.F11, T.F5 | Deletes the `useContractAnimGroup`/`useSceneTransport` decoy (F4 moves only survivors); owns the machine single-writer the scene-machine reset (F11) couples to; its runtime `SceneFacility` is DISTINCT from F5's `components/instrument/` file module (name coordination) |
| **T.C** (dock grammar recut) | T.F3 | T.C owns the dock COMPONENT identity (`ChromeDock`→compass grammar); T.F3 owns the DIRECTORY rename (`chrome/`→`dock/`) + the gate constant |
| **T.D15** (styles de-archaeology) | T.F | OWNS the styles split (lane 17 recs 1-3 + tombstones + ≤300L + tokens.css/idioms.css) — subsumes lane 13 rec 4 + lane 14 rec 8; T.F CROSS-REFS it (§Charter-conflict note 6) |
| **T.D19** (dvh completion) | T.F18 | Touches overlapping `@media` blocks in the same files — batch the breakpoint `theme()` rewrite + the vh→dvh migration so each at-rule is touched once |
| **T.H** (glass-ui gap letter) | T.F16, T.F5, T.F14 | Owns the `aria-orientation` ask (retire the KfPillTabs fork on publish); `InstrumentChassis` consumption eval; the allowlisted vendor-DOM contracts = delineated glass-ui boundary |
| **T.M2/T.D** (appearance) | T.F8 | The skeleton VISUAL treatment is an appearance disposition (owner-token / glass language); only F8's structural clause is born-RED |
| **T.M8** (roster-ceiling 203→~120) | ALL T.F gates | T.F's ~13 net-new structural gates push AGAINST the shrink — §Charter-conflict note 1 (prefer clause-additions; fold net-new into composites; final count coordinated with T.M8) |
| **T.G** (perf, true-rest) | T.F8, T.F9, T.F12 | The text-flash (F8) is #19's sibling; the painter budget (F9) + the `markRaw` hot-path invariant (F12) are perf-adjacent |
| **C-23** (`proof:shared-has-n-consumers`) | **T.F21** | The keystone EXTENDS C-23's consumer-count bar with a kind-appropriateness clause — the shared-consumer gate is the named precedent for the SHARED-TIER PURITY clause; no competing consumer-count check |
| **T.G** (perf hot paths) | **T.F22** | A library long-file split must not add per-frame indirection — coordinate the `physics/spring/`, `group/`, `compile/frame-compiler.ts` touches so a decomposition never costs the hot path |
| **T.H** (glass-ui gap letter + consumption) | **T.F23** | The glass-ui-usage census's `glass-ui-replace` disposition routes to T.H; lane 21 recs 1/2 (the 3 band-aids + KfPillTabs) → T.H's gap ledger + version-tripwire |
| **T.S** (S-residue) | **T.F23** | Lane 21's src-side residue is T.S's, not T.F's: finding 5 (DM-22 named-selector) → T.S4; the drag-gesture carry → T.S2 — T.F23 owns only the DEMO recs 4/5/6 |
| **T.B** (SceneFacility) | **T.F23** | Lane 21 rec 3 (`TransportSource` deletes `useContractAnimGroup`) is T.B's; the glass-ui census notes it, does not own it |
| **T.M8** (roster-ceiling 203→~120) | **T.F21, T.F22, T.F23** | The 3 edict waves add `proof:{colocation, zone-cohesion, no-dead-export}` — T.F21/F22 are COMPOSITES that ABSORB pre-edict one-off keys (net-neutral-to-negative); `proof:no-dead-export` is a genuine new export-granularity key (§Charter-conflict note 1 extended) |

---

## §3 Disposition of lane recommendations (zero silent drops)

Legend: **→ T.F#** = owned by a wave above · **↳ cross-ref** = owned by another band per the
charter (one line, no duplication).

### Lane 13 — demo-structure (ALL 10 recs assigned)

| rec | disposition |
|---|---|
| 1 · rename `demo/@/` → `demo/shared/` | **→ T.F1** |
| 2 · dissolve `components/custom/` | **→ T.F2** (merged with 14 rec 1) |
| 3 · cohere the 4 editor peers into `instrument/` + real lazy barrel | **→ T.F5** (merged with 14 rec 4) |
| 4 · break up `styles/` — global theme only; colocate idioms; delete tombstones | ↳ cross-ref **T.D15** (styles de-archaeology; T.D subsumes it — §Charter-conflict note 6) |
| 5 · empty `app/` of scene-shared recipes; tighten the shell predicate | **→ T.F4** |
| 6 · rename `app/chrome/` → `app/dock/`; relocate `DemoGlobalChrome` | **→ T.F3** (merged with 15 rec 3, 14 rec 3) |
| 7 · de-vanity `KfPillTabs` → `AriaSafeTabs`; file the glass-ui aria gap | **→ T.F16** (merged with 18 rec 4, 14 rec 5) |
| 8 · introduce a `skeletons/` tier; replace the Suspense text-flash | **→ T.F8** (merged with 16 rec 6) |
| 9 · normalize every module to the recursive shape; flatten `controls/composables/` | **→ T.F6** (merged with 14 F8) |
| 10 · split heavy scoped `<style>` (>~120L) into sibling `.css` (advisory) | **→ T.F20** |

### Lane 14 — `@`-structure (ALL 8 recs assigned)

| rec | disposition |
|---|---|
| 1 · collapse `components/custom/` → `components/` | **→ T.F2** |
| 2 · close the `.css`-extension 500L gate-dodge; re-decompose the 2 over-ceiling files | **→ T.F7** (rides with 25 rec 1, the module-composed gate) |
| 3 · relocate `DemoGlobalChrome.vue` (→ `app/` root, reconciled from 14's `app/chrome/`) | **→ T.F3** |
| 4 · uniform peer shape: barrel + `composables/` subfolder for every multi-file peer | **→ T.F5** |
| 5 · rename `KfPillTabs`; file the upstream aria fix | **→ T.F16** |
| 6 · move `gestureSelectSuppression.ts` → `utils/` | **→ T.F13** |
| 7 · promote `kfEngine.ts` out of `utils/` → `state/` | **→ T.F13** |
| 8 · split `styles/` by concern; delete tombstones; flag dock-band as glass-ui-gap placeholder | ↳ cross-ref **T.D15** (styles; the dock-band anchor chain → **T.D18** anchor positioning — §Charter-conflict note 6) |

### Lane 15 — app-prune (recs 1–4 assigned; rec 5 = OD-3, cross-ref)

| rec | disposition |
|---|---|
| 1 · T-APP-PROVENANCE-SWEEP (strip tranche-ID citations from `app/` comments) | **→ T.F19** |
| 2 · T-APP-CONST-TRIM (`rafConstants.ts` ≤6 lines) | **→ T.F19** (the exemplar instance) |
| 3 · T-APP-CHROME-RENAME (`app/chrome/` → a non-homonym) | **→ T.F3** |
| 4 · T-APP-SCENES-SHRINK (`scenes.ts`/`ChromeDock` `Layers`/`assets` edits) | ↳ cross-ref **T.E1/T.E2/T.E3/T.E11** — a CONSEQUENCE of the scene prunes; executed by T.E's manifest rewire, never standalone (lane 15 F4/rec 4 sequences it explicitly). The dead `Layers` import + `TAB_ICONS.Layers` (`ChromeDock.vue:4,46`) die with compose's `assets` tab |
| 5 · T-APP-PPMODE-CALL (`ppMode`/ppmycota keep vs cut) | ↳ cross-ref **OD-3** (`OWNER-DECISIONS.md` — per my brief, rec 5 is the OD-3 register row, not a T.F code wave) |

### Lane 16 — scenes-composition (ALL 6 recs assigned)

| rec | disposition |
|---|---|
| 1 · extract `useSequenceReel.ts` + `useSequenceRows.ts` | **→ T.F10** |
| 2 · split `useMotionPathGesture.ts` (projection + traveller + control-point) | **→ T.F10** (CONDITIONAL on OD-1 = FUSE; MOOT if PRUNE — §Charter-conflict note 4) |
| 3 · extract `useSpringPresets.ts`; fold the keyframes-editor build | **→ T.F10** |
| 4 · give `EasingTarget.vue`'s comparison-track view-mode the same split | **→ T.F10** (CONDITIONAL — likely SUPERSEDED by T.E6's gallery redesign; deferred until T.E6 settles the easing view surface) |
| 5 · introduce a shared `createPainterRegistry`; retire the 2 dup copies | **→ T.F9** |
| 6 · per-scene shaped skeletons (rides lane 13's `skeletons/` tier) | **→ T.F8** |

### Lane 22 — state-stores (ALL 6 recs assigned)

| rec | disposition |
|---|---|
| 1 · reify ONE global-store registry; derive `resetAllStores`/`getAllState`/`STORE_KEYS` | **→ T.F11** |
| 2 · normalize the `use*Store`/`use*Machine`/plain naming | **→ T.F12** (`useAssetManager` rename MOOT post-T.E1) |
| 3 · make `markRaw` a construction-time invariant | **→ T.F12** |
| 4 · fix the amiga `SUPER_KEY` duplicate-literal | **→ T.F12** |
| 5 · give `useSceneMachine` a live-ref reset symmetric with siblings | **→ T.F11** (couples to T.B's machine single-writer) |
| 6 · correct the stale `selectedKeyframesControl: "string"` default | **→ T.F11** (same-file touch) |

### Lane 18 — brittle-selectors (recs 1, 2, 4, 5, 6 assigned; rec 3 → T.E11)

| rec | disposition |
|---|---|
| 1 · scope cross-component tab-panel selectors to their own root | **→ T.F14** |
| 2 · prefer vendor public prop over `:deep()`; centralize per-vendor | **→ T.F15** (easing half executed by T.E8's cluster deletion; systemic `.labeled-field-grid` coordinates with T.D15) |
| 3 · decouple the gesture-manifest `tell` from the removed element | ↳ cross-ref **T.E11** (the lockstep exemplar; T.E owns the ruled-removal gate-rewire) |
| 4 · converge tab/roving-tabindex onto one primitive; de-vanity KfPillTabs | **→ T.F16** (upstream aria ask + eventual deletion ↳ **T.H**) |
| 5 · widen the brittle-selector gates (owned-ref vendor reaches + all of `demo/`) | **→ T.F14** |
| 6 · refcount the `#highlightjs-theme` singleton | **→ T.F17** |

### Lane 19 — fragile-css (rec 1 assigned; recs 2–7 → T.D)

| rec | disposition |
|---|---|
| 1 · single-source the `1023/1024px` breakpoint via `theme(--breakpoint-lg)` | **→ T.F18** (coordinate the `@media` batch with T.D19 dvh) |
| *(2 · finish `vh`→`dvh`)* | ↳ cross-ref **T.D19** |
| *(3 · delete the `--z-behind` duplicate)* | ↳ cross-ref **T.D15/T.D** (glass-ui token consume) |
| *(4 · tokenize `EasingCurveCanvas` glow/stroke registry)* | ↳ cross-ref **T.D** (dies with T.E8's cluster) |
| *(5 · consolidate the `calc(50%±0.5px)` crosshair idiom)* | ↳ cross-ref **T.D21** |
| *(6 · publish one JS geometry value to break the dock-anchor diamond)* | ↳ cross-ref **T.D18** (the chain-depth cap) |
| *(7 · do not blanket-strip `-webkit-`/`@supports`)* | ↳ cross-ref **T.D** (the F7 process note) |

### Lane 25 — plan-vs-landed C/D (rec 1 cross-cited into T.F7; rec 2 co-cited into T.F23)

| rec | disposition |
|---|---|
| 1 · uniform module-skeleton + composition-depth gate (`proof:module-composed`) | **→ T.F7** (cross-cite — the "composed-not-just-placed gate" the charter T.F row names; authored here riding with the 500L dodge close) |
| 2 · glass-ui-consumption gate on primitive replacement | **→ T.F23** (the glass-ui-usage census clause — every hand-rolled primitive maps to glass-ui-replace ↳ **T.H** / keep-with-ledger / delete) + ↳ **T.H** (the gap ledger owner) |
| *(3–5 · ControlsPaneWrapper split, global-sheet split, …)* | ↳ cross-ref lane 25's owning band (the sheet/global-CSS split → **T.D15**) — not assigned to T.F |

### Lane 21 — legacy-sweep (VERDICT #28; recs 4, 5, 6 OWNED here post-edict; the rest cross-ref)

> The 2026-07-05 GRAND COLOCATION EDICT (`OWNER-ASKS.md` row 1) explicitly folds *"deprecated,
> legacy, superfluous code, sub-optimal encapsulation, glass-ui usage"* into T.F. Lane 21's DEMO
> recs — **4** (throttle DRY), **5** (`any`-ceiling), **6** (`proof:no-dead-export`) — previously
> homed under T.S / unowned-by-T.F, are now **OWNED here → T.F23**. The `src`-side and glass-ui-gap
> recs stay with their charter bands.

| rec | disposition |
|---|---|
| 1 · consolidate the 3 glass-ui-4.0.1 band-aids into ONE gap ledger + version tripwire | ↳ cross-ref **T.H** (the ask letter + tripwire) |
| 2 · retire `KfPillTabs` onto glass-ui `Tabs`/`SegmentedTabs` | ↳ cross-ref **T.F16** (demo-side rename + roving convergence) + **T.H** (upstream ask + gated deletion) |
| 3 · replace the placeholder `AnimationGroup` with a `TransportSource` interface | ↳ cross-ref **T.B** (deletes `useContractAnimGroup`) |
| 4 · DRY the hot/cold readout throttle into one composable | **→ T.F23(c)** (OWNED — the `useThrottledReadout` extraction; 5 hand-rolled sites) |
| 5 · sweep `demo` `any` to a bounded ceiling under a gate | **→ T.F23(b)** (OWNED — the `any`-ceiling ratchet; 114 today) |
| 6 · add `proof:no-dead-export` + excise the confirmed-dead symbols | **→ T.F23(a)** (OWNED — `kfEngineReady` + 6 dead types + ~30 reflexive interfaces) |
| 7 · de-defer or build the DM-22 named-selector resolution | ↳ cross-ref **T.S4** (the src-side deferral carry) |

---

## §4 Charter conflicts / coordination notes spotted

1. **My band ADDS ~13 net-new structural gates while T.M8 shrinks the roster 203 → ~120.** T.F
   proposes `proof:{module-composed, one-facility, no-god-css(→T.D), has-skeletons,
   no-duplicate-registry, scene-orchestrator-ceiling, global-store-registry, store-naming,
   markraw-engine-objects, scene-superkey-single-source, composables-are-reactive,
   no-tranche-provenance, no-vanity-prefix}` — a net INCREASE against the tranche's shrink goal.
   **Resolution proposed:** prefer CLAUSE-additions to EXISTING gates over net-new keys
   (`proof:app-is-shell` tightened for F4; `proof:demo-no-oversize` widened for F7;
   `proof:brittleness`/`proof:no-brittle-selector` extended for F14/F15;
   `proof:shared-has-n-consumers` re-rooted for F2 — these are rewires, not new keys); where a
   new key is genuine, FOLD related structural checks into a small number of COMPOSITE gates
   (e.g. ONE `proof:demo-structure` with clauses for facility/module-composed/reactive-tier/
   vanity-prefix; ONE `proof:demo-state-hygiene` for registry/naming/markraw/superkey). **The
   final gate count is coordinated with T.M8** so the structure hardening does not defeat the
   roster ceiling. Flagged prominently because it is the exact tension T.M8 owns.
   **EDICT ADDENDUM (2026-07-05).** GROUP G's `proof:{colocation, zone-cohesion, no-dead-export}`
   are the resolution *applied*, not three fresh keys: **T.F21's `proof:colocation` is the
   COMPOSITE** that ABSORBS `proof:one-facility` + `proof:composables-are-reactive` +
   `proof:module-composed` + the tightened `proof:app-is-shell` clause into ONE standing rule
   (net-negative on the key count — it retires the one-offs the pre-edict waves would otherwise
   each own); **T.F22's `proof:zone-cohesion`** is the library-tier companion to the existing
   `proof:decomposition` (a clause-extension in spirit, ring-fenced to zone interiors by §4);
   only **`proof:no-dead-export`** is a genuinely-new key, and it sits deliberately BESIDE the
   existing `proof:no-orphan-module`/`proof:no-dead-dependency` at the export granularity they
   miss (T.M8 accepts it as a completeness peer, not a fold candidate). Net effect on the
   203→~120 shrink: the edict is roster-neutral-to-negative once the composites absorb the
   one-offs — coordinated with T.M8.

2. **The `1023/1024px` breakpoint has a double home (charter §1 T.D headline vs the lane
   partition).** The charter T.D headline row lists *"fragile-CSS (ONE breakpoint source ×23
   sites, …)"* — naming the breakpoint under T.D — while my brief scopes lane 19 to "rec 1" and
   lane 19 is ALSO under **T.F**'s lane set (charter §1 T.F: "…, 18, 19"). **T.D's own doc
   already resolves this to T.F** (T.D disposition: "1 · single-source the breakpoint — NOT
   assigned ↳ cross-ref **T.F**"). This wave (T.F18) IS the T.F home; the likely rationale (per
   T.D's note) is that the breakpoint has a CSS half (T.D-shaped `@media`/`@container` at-rules)
   AND a JS half (5 `useMediaQuery` string literals — a structure/DRY concern), and the
   single-source (one exported constant + one `theme()` reference) is fundamentally a
   no-duplication structure move. **Coordinate the `@media` rewrite batch with T.D19** (dvh) so
   overlapping at-rules are touched once. Reconciled — no double-authoring.

3. **`app/chrome/` directory rename (T.F3) vs the dock COMPONENT recut (T.C1).** T.C1 recuts
   `ChromeDock.vue` onto glass-ui's `DockSection` grammar (the compass/transport vocabulary) but
   works at the `demo/app/chrome/ChromeDock.vue` PATH — it does NOT own the directory rename.
   T.F3 owns `chrome/`→`dock/` + the `ALLOWED_ROOT_DIRS` constant; the final component FILENAME
   (`ChromeDock`→`AppDock`/`DockCompass`) follows T.C's grammar recut. **Sequence T.C1 first if
   co-batched** (so the file is renamed once, under its new grammar), else rename the directory
   regardless (the ambiguity is the folder word — lane 15 rec 3). Flagged so neither band leaves
   a gate constant naming a directory the other renamed.

4. **Two lane-16 scene splits are CONDITIONAL on T.E rulings (T.F10).** motion-path's 3-way
   split (16 rec 2) is MOOT if **OD-1 = PRUNE** (T.E3 deletes the scene) and RE-HOMED into
   `scenes/svg/` if **OD-1 = FUSE** (T.E2). easing's comparison-track split (16 rec 4) is likely
   SUPERSEDED by **T.E6**'s specimen-drawer gallery (which replaces `EasingTarget.vue`
   wholesale). **Resolution:** T.F10 authors sequence + spring (16 recs 1, 3) unconditionally;
   the motion-path + easing splits are held until the OD-1 ruling / T.E6 redesign settle their
   surfaces — the impl drive does NOT author a split for a scene T.E is deleting/redesigning.
   Flagged so the split work is not stranded on a pruned scene.

5. **`KfPillTabs` disposition splits across T.F / T.B / T.C / T.H (T.E note-3 flagged the
   reciprocal).** T.E's charter-conflict note 3 dispositions the KfPillTabs→`SegmentedTabs`
   migration to **T.B/T.C/T.H** (glass-ui consumption). My brief assigns lane 18 rec 4 + lane 13
   rec 7 + lane 14 rec 5 (the de-vanity rename + roving-tabindex convergence) to **T.F**.
   **Resolution:** T.F16 owns the DEMO-SIDE rename off `Kf`-vanity + the `useRovingTabindex`
   primitive convergence NOW (the structure/brittleness cure); **T.B/T.C consume `SegmentedTabs`**
   where the aria bug is moot; **T.H owns the upstream glass-ui `aria-orientation` ask + the
   gated-on-publish final DELETION** of the fork (the version-tripwire). The fork is NOT deleted
   here (a11y necessity until upstream ships — deleting to green a gate would reintroduce the
   WCAG defect). Flagged so KfPillTabs is not double-claimed and the fork is not prematurely
   deleted.

6. **The styles split has a double home — RESOLVED to T.D15 (not double-authored).** The band
   guidance told me to merge "13 rec 4 + 14 rec 8 + 17-cross-ref styles split" into a T.F wave.
   But **T.D15 already fully authors it** (lane 17 recs 1-3 + tombstone deletion +
   tokens.css/idioms.css split + `≤300L per file` + "zero — DELETED/— REMOVED eulogy blocks" —
   verified in `T.D.md`), and the styles split is inseparable from the token-tier authority +
   cascade-layer order, which are genuinely T.D/LOOK concerns. **Resolution:** T.F does NOT
   author a competing styles wave; lane 13 rec 4 + lane 14 rec 8 → **cross-ref T.D15** (the
   layout-bands extraction → **T.D18**). The band guidance's "single wave citing both lanes" is
   superseded by T.D having already authored the owning wave. Flagged as the one place I departed
   from the literal band guidance to honor the "no double-authoring / cross-ref the owning band"
   contract.

7. **`components/instrument/` (T.F5, a FILE module) vs `SceneFacility` (T.B, a RUNTIME
   descriptor).** Both are called "facility." They are DIFFERENT layers: T.F5 groups the editor
   peer DIRECTORIES under one module + barrel; T.B's `SceneFacility` is the runtime
   channels[]+facets[] descriptor that replaces the `useContractAnimGroup` decoy. glass-ui also
   ships `InstrumentChassis` (a panel-shell primitive). **Coordinate the NAMING** so the three do
   not collide in prose or in the tree (`components/instrument/` = files; `SceneFacility` =
   runtime; `InstrumentChassis` = glass-ui shell, consumed via T.H). Flagged so the impl drive
   does not conflate the file-module cohesion (T.F) with the runtime-descriptor build (T.B).
