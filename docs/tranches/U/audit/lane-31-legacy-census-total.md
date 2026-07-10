# Lane 31 — legacy-census-total

**Fleet:** Tranche U development (32 lanes) · **Lane:** 31/32 · **Slug:** `legacy-census-total`
**Charter:** NO LEGACY CODE — total census. Every back-compat surface, every dead
export (symbol grain), unused files, unreferenced assets, dead CSS, orphaned
types, the demo's oldest surviving code paths. For each: the excision map and the
idiomatic gestalt cure. The U "legacy zero" wave's ground truth.
**Discipline:** read-only; every finding carries `file:line` evidence read from
the live tree (git master, post-T, 5.2.0). Development only — no implementation.

---

## Headline

The NO-LEGACY residue is real and DISPOSITIONED-BUT-UNEXCISED: 26 demo dead
exports carried in an explicit ratchet backlog that says "to zero post-facility"
(a deferral U forbids), a **completely un-patrolled symbol-grain dead-export
blind spot in `src/` (26 more, zero gate coverage)**, two orphaned binary assets
shipping 110 KB of never-referenced texture, three chronic glass-ui dock
workarounds still PENDING, and a "back-compat barrel" whose entire justification
is the shape of a file that was deleted three tranches ago.

---

## Method

- Ran the three coarse legacy gates: `proof:no-dead-export` (PASS, **26** carried
  — not the charter's stale "28"; two were retired at T), `proof:no-orphan-module`
  (PASS, 0 file orphans), `proof:no-dead-dependency` (PASS), `proof:alias-dropped`
  (the 5.0.0 `Animation`/`ScrollTimeline` aliases are GONE from the built d.ts),
  `proof:no-deprecated-guard` (PASS), `proof:workaround-deletion` (4 GREEN / 3
  PENDING).
- Wrote a symbol-grain census over `src/animation` (the grain NO src gate covers)
  — scratch script `scratchpad/src-dead.mjs`, scanning `src`+`test`+`scripts`+`demo`
  as consumers.
- Hand-verified every asset reference, the constants barrel importer graph, and a
  sample of the demo backlog rows against the actual tree.

---

## Findings

### F1 — MAJOR — `src/` has a symbol-grain dead-export blind spot: 26 exported symbols with ZERO consumer, no gate catches them

`proof:no-dead-export` is scoped **only to `demo/`** (its docstring:
`EXPORT_ROOT = "demo"`, scripts/proof-no-dead-export.mjs:62, and the comment "src's
export surface is patrolled by proof:boundary/published-surface/no-orphan-module").
But those three are FILE-grain (`no-orphan-module`) and PACKAGE-grain
(`no-dead-dependency`) — none sees a single exported SYMBOL with no external
consumer. My census found **26 such dead exports in `src/animation`**, none on the
published surface:

```
compile/backward/backward-color.ts::DensifyResult
compile/backward/format.ts::PremultiplyResult
compile/plain-vars.ts::PlainLeafWriter
compile/selector.ts::SELECTOR_PERCENT_RE, SELECTOR_NAMED_RANGE_RE, SELECTOR_REASON
engine/composition.ts::CompositionRuntime, captureUnderlyingBase, endValueFor, emitCompositionFallback
engine/play-lifecycle.ts::renderFrame, playViaWAAPI, cancelWAAPI, snapToReducedMotion
internal/animation-id.ts::AnimationIdentity
internal/errors.ts::AnimationOptionErrorCode
internal/leaves.ts::FRAME_RATE
orchestration/sequence/transport.ts::restPhase, isForwardMonotone, seedOrigin
orchestration/timeline/native.ts::ScrollTimelineAxis
physics/spring/sample.ts::NormalizedSpringSampleOptions
physics/spring/solver.ts::SpringSolution
resolve/element-resolve.ts::resolveElementAwareValues
resolve/resolve-if.ts::splitCondition
svg/morph-geometry.ts::fmtNum
```

Verified genuine (not a re-export false positive): `renderFrame` is defined at
`play-lifecycle.ts:229` and used ONLY at `play-lifecycle.ts:224-225` — same file,
no external consumer, the `export` is pure surface leakage. `fmtNum`,
`endValueFor`, `emitCompositionFallback`, the three `SELECTOR_*_RE` regexes, and
the reflexive result types (`DensifyResult`, `PremultiplyResult`,
`SpringSolution`, `NormalizedSpringSampleOptions`) are the same class.

**Excision map:** drop the `export` keyword on each (keep the declaration — every
one is used in-file); this is byte-neutral to behavior and shrinks the d.ts /
API-Extractor surface. Zero migration — none is imported anywhere.

**Gestalt cure:** the coarse-gate trio is NOT a symbol oracle. Generalize
`proof:no-dead-export` to a SECOND export root — run the SAME censer over
`src/animation` with the consumer scan spanning all four roots. The demo backlog
mechanism (ratchet to zero) transposes directly. This closes the exact grain the
owner's GRAND COLOCATION EDICT names ("sub-optimal encapsulation") on the LIBRARY
side, which today is entirely unguarded.

### F2 — MAJOR — 26 demo dead exports sit in a ratchet backlog explicitly deferred "to zero POST-FACILITY" — a deferral U forbids

`proof:no-dead-export`'s `DEFERRED` array (scripts/proof-no-dead-export.mjs:70-113)
carries 26 confirmed-dead demo exports "carried, ratcheting to zero
post-facility." The gate's own prose: "an explicit, dispositioned backlog." Under
the owner's **NO MORE DEFERRALS** edict this backlog cannot survive into U as a
backlog — it must be discharged. The 26 decompose:

- **The animation-transport composable suite (16 rows)** — reflexive
  `Use…Options`/`Use…Return`/`…Deps`/`…Emit`/`…Handlers` interfaces exported out of
  `demo/@/components/custom/instrument/transport/composables/*` but consumed only
  inside their own file (`useAnimationGroupActions`, `usePaneRegister`,
  `useScrollFade`, `useSelectedControlSurface`, `useTabStripScroll`,
  `useKeyframesPaneReveal`, `usePlayActuation`, `useDragCapture`,
  `useControlsKeyboardShortcuts`, `useAnimationGroupPlayback`). See F3.
- **Two dead data tables** — `COLOR_SPACE_DESCRIPTIONS`, `HUE_METHOD_DESCRIPTIONS`
  in `…/transport/animationDescriptions.ts:112,120` — verified zero consumers
  (the sibling `DIRECTION_DESCRIPTIONS`/`FILL_MODE_DESCRIPTIONS`/`TIMING_DESCRIPTIONS`
  ARE live; these two describe controls the transport UI no longer renders).
- **`captureNonDefaultSnapshot`** (`…/timeline/utils/snapshotCapture.ts:32`) —
  fully orphaned (never referenced, even in-file); its file-sibling
  `captureSnapshot` is the only live export.
- **`ToolbarKeyboard`, `UseKfPillTabsParams`, `CurveGroup`** — reflexive types.
- **`registerStoreReset`** (see F6) and the three **glass-ui-gaps types** (see F7).

**Excision map:** drop the `export` on every reflexive interface; DELETE the two
description tables + `captureNonDefaultSnapshot` outright (no in-file use). Then
delete the `DEFERRED` array and the ratchet machinery — the gate collapses to a
pure "zero dead export" oracle.

**Gestalt cure:** the ratchet was the honest-defer device; U terminates it. The
sweep is a single wave, not "post-facility" — the facility lane the rows were
entangled with (the transport suite) shipped at T. Excise all 26, delete the
backlog, and let F1's generalized gate hold the line at zero for BOTH roots.

### F3 — MAJOR — the reflexive composable-interface idiom is a systemic legacy naming artifact

14+ demo composables export a `Use<Name>Options` / `Use<Name>Return` /
`<Name>Deps` interface that is referenced ONLY as the annotation of the
composable's own signature in the same file (grep: 14 `export (type|interface)
Use.*(Return|Options|Deps|Params|Emit|Handlers)` across `demo/`). This is the
dominant slice of both F1 and F2. It is not API — no external file names these
types — it is a house habit of "name the shape you return."

**Excision map:** un-export each; a function whose return type is inferred needs
no exported alias, and one that wants an explicit annotation can keep the
`interface` un-exported.

**Gestalt cure:** make it structural, not per-symbol. A composable's Options/Return
shape is an IMPLEMENTATION detail unless a consumer imports it; the idiom to
enforce is "export a composable's types ONLY when a second file consumes them."
This is precisely what the generalized dead-export gate (F1) enforces once it runs
over the whole tree — no separate rule needed, just stop hand-curating exemptions.

### F4 — MAJOR — two orphaned binary assets ship 110 KB of never-referenced texture

`demo/scenes/amiga/checkerboard.jpg` (103 890 bytes) and
`demo/scenes/cube/cube.png` (6 582 bytes) have **ZERO code references** — no
`import`, no `new URL(...)`, no `TextureLoader.load`, no CSS `url()`, no `<img>`.
Exhaustive grep across `**/*.{ts,vue,js,html,css}` returns nothing; the only hits
are in `demo/CLAUDE.md` (inventory prose) and unrelated code comments that use the
word "checkerboard" to describe the PROCEDURALLY-generated board
(`amiga/utils.ts:48` "this tile-loop is checkerboard-isomorphic"). Both scenes
render their imagery in code (the amiga sphere tessellates its own board; the cube
is CSS/matrix). The assets are pre-fusion relics — `git log` shows they last moved
at the R.W5 scene-fusion (`5483356`, `fdc61a4`) and were never re-wired.

**Excision map:** `git rm demo/scenes/amiga/checkerboard.jpg
demo/scenes/cube/cube.png`; remove the two trailing-clause mentions in
`demo/CLAUDE.md` (lines 22-23). Nothing imports them — zero migration, ~110 KB off
the repo and any build that copies scene dirs.

**Gestalt cure:** there is no asset-reachability gate. `proof:no-orphan-module`
walks `.ts`/`.vue` import graphs but never binary assets. Add an asset-reachability
clause — every non-code file under `demo/scenes/**` (and any future asset dir) must
be named by a live `import`/`new URL`/`url()`; an unreferenced asset REDs. This is
the binary-file analogue of the module-orphan gate.

### F5 — MAJOR — three chronic glass-ui dock workarounds are still PENDING band-aids in the live demo

`proof:workaround-deletion` reports S2/S3/S4 PENDING — three hand-rolled band-aids
persisting because their glass-ui root-cures have not shipped:

- **S2** — `pointerHandled`/`onPlayPointerDown` interim at
  `demo/@/components/custom/instrument/transport/TransportDock.vue:69,193,362`
  (awaits glass-ui BB collapse-crossfade dock-layer keepalive).
- **S3** — dock dismiss-hold re-expand watch + popup mutex at
  `demo/app/dock/ChromeDock.vue:28,174,202,206` (awaits GU-3 dismiss-pointerdown
  respects keepOpen()).
- **S4** — `DockDropdownTrigger` pointerdown click-synthesis at
  `demo/app/dock/MbabbMenu.vue:26,118,219,232` (awaits BG-4 pointerdown-open
  parity).

These are the demo's oldest surviving band-aid code paths — cross-realm patches
for a sibling that "belongs in glass-ui." The owner's NO-MORE-DEFERRALS edict
collides directly with the gate's staged "PENDING is not a failure" posture: three
deferred workarounds cannot ride into U as deferrals.

**Excision map:** each arm GREENs (band-aid deletes + re-pin) only when glass-ui
ships the named API. kf cannot self-excise.

**Gestalt cure:** glass-ui is user-domain, but U owns the CONSUME-EDGE and the
coordination letter. Charter a glass-ui coordination row that names BB/GU-3/BG-4 as
the three landings U's demo consume-edge requires, and make the band-aid excision a
BORN-RED handoff (the T "born-OWNER" mechanism) so the workaround dies the instant
the sibling publishes — not "post-facility."

### F6 — MINOR — `registerStoreReset` is a speculative seam with zero consumers

`demo/@/state/index.ts:118` exports `registerStoreReset` (a reset-composer
contract). Verified: **zero consumers** anywhere — the last one (compose's asset
store) was pruned under OD-1, and the seam is "kept for the next feature store"
(its DEFERRED row, proof-no-dead-export.mjs:106). A speculative seam retained for a
consumer that does not exist is exactly the "superfluous code" NO-LEGACY forbids —
YAGNI as a standing exemption.

**Excision map:** delete the export + the function body; the reset-composer contract
can be reconstituted from git the day a second store actually needs it.

**Gestalt cure:** NO speculative retention. A contract with no consumer is not a
contract, it is dead code with a comment. If the reset-composer pattern is worth
keeping, it belongs in a documented composable with at least one real caller;
otherwise it goes.

### F7 — MINOR — the `constants/` "back-compat barrel" is justified by a file deleted three tranches ago

`src/animation/constants/index.ts` (S.B1) is a three-way split — `types.ts` +
`defaults.ts` + `index.ts` — whose `index.ts` exists, per its own header
(constants/index.ts:1-13), to "preserve the EXACT import surface of the former
monolithic `constants.ts`." That monolith no longer exists. 47 heavy files import
`../constants` through this barrel; only 8 of them actually mix runtime values with
types (grep). The barrel is a live re-export hub — but its FRAMING is legacy: it is
retained to look like a deleted file, not for an architectural reason.

**Excision map:** either (a) rename it from "back-compat barrel" to a genuine
constants zone barrel and strip the historical justification, OR (b) under the
grand-colocation edict, have importers target the real module — `constants/types`
for type-only edges (already the LIGHT convention), `constants/defaults` for the 8
runtime consumers — and delete the barrel.

**Gestalt cure:** (b) is the colocation-true answer. A barrel earns its keep only if
it composes a zone; a barrel that exists to preserve a deleted specifier is legacy
by definition. Fold the two runtime consts to their point of use or a colocated
`defaults`, retire the back-compat narrative.

### F8 — MINOR — `proof:changelog` cites a `MIGRATION-5.2.0.md` that does not exist; 5.0.0/5.1.0 migration docs are historical

`proof:changelog` passes by asserting "every removed symbol is documented in
`docs/MIGRATION-5.2.0.md`" — but that file is **absent** (`ls`: No such file). The
gate GREENs only vacuously ("no public-surface row removed since v5.1.0"); the
instant any symbol is removed the gate would reference a nonexistent doc. Separately,
`docs/MIGRATION-5.0.0.md` and `docs/MIGRATION-5.1.0.md` are historical breaking-change
records for shipped versions — not legacy CODE, but legacy narrative the grand
restructure should consolidate.

**Excision map:** the changelog gate should resolve the migration doc path from the
CURRENT version and only require it when a removal exists (it half-does this — but
the PASS message hard-codes the missing filename). Consolidate the per-version
migration docs into one `docs/MIGRATION.md` with dated sections.

**Gestalt cure:** one living migration ledger, version-sectioned, resolved by the
gate from the version diff — not a proliferation of per-release files, one of which
is already a phantom.

---

## What U must charter

1. **Generalize `proof:no-dead-export` to `src/animation`** as a second export root
   (F1) — close the symbol-grain library blind spot the coarse trio misses; excise
   the 26 dead `src` exports (drop the `export`, byte-neutral).
2. **Discharge and DELETE the 26-row demo `DEFERRED` backlog** (F2) — un-export
   every reflexive composable interface, delete the two dead description tables +
   `captureNonDefaultSnapshot`, then delete the ratchet array. NO "post-facility."
3. **Retire the reflexive `Use*Options/Return/Deps` export idiom** structurally
   (F3) — a composable exports its shapes ONLY when a second file consumes them;
   let the generalized gate hold it.
4. **`git rm` the two orphaned assets** `checkerboard.jpg` + `cube.png` (F4) and
   add an asset-reachability clause so no unreferenced binary ships again.
5. **Charter the glass-ui coordination letter** for BB/GU-3/BG-4 (F5) and convert
   the three PENDING dock band-aids (S2/S3/S4) to born-RED handoffs that die on
   sibling publish — not deferrals.
6. **Delete `registerStoreReset`** and forbid speculative seams (F6) — no exported
   contract without a live consumer.
7. **Retire the `constants/` back-compat barrel framing** (F7) — colocate the two
   runtime consts to their consumers, target `constants/types` directly, drop the
   "preserve the deleted monolith's surface" justification.
8. **Consolidate the per-version MIGRATION docs into one living ledger** and fix
   `proof:changelog`'s phantom `MIGRATION-5.2.0.md` reference (F8).
