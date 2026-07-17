# Keyframes / constellation execution handoff — 2026-07-16

> **Snapshot authority.** This is the restart document for the agentic system
> that follows the current Keyframes/Value/Glass/Atlas/SCI execution rail. It
> reconciles the ratified Tranche-U wave corpus with observed release, checkout,
> and sibling-task state on 2026-07-16. Registry artifacts and directly observed
> Git objects outrank rehearsal archives, package-version intent, old status
> prose, and local `node_modules`.
>
> For live Glass execution state, the later authoritative sibling record at
> `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/HANDOFF-ACTIVE-EXECUTION.md`
> supersedes this document's Glass synthesis wherever they differ.

## 0. Executive disposition

The ordered producer DAG is:

```text
Value 4.0.0 — IMMUTABLE
    ↓
Keyframes 6.0.0 — IMMUTABLE
    ↓
Glass 7.0.0 — ACTIVE, UNPUBLISHED, BLOCKED ON PRODUCT/NATIVE CLOSE
    ├─→ Keyframes demo consume + gh-pages/native close + Cloudflare deploy
    └─→ Atlas successor → atomic SCI consume + preview/native close
```

Tranche U itself is finished. There is no remaining U-development wave to
replay. The only Keyframes work left on this rail is to reconstruct the already
prepared demo-consumer slice on the immutable Keyframes 6 commit, wait for a
real Glass 7 registry artifact, consume it as an exact demo-only development
edge, close the native product matrix, commit, push, and deploy.

Do **not** continue from the current Keyframes checkout as though it were a
clean branch. Its Git metadata is still at Keyframes 5.3.5 while its worktree
contains both the already-published Keyframes 6 producer transaction and the
unpublished Glass 7 demo-consumer transaction. The isolated successor clone and
all `/private/tmp` rehearsals disappeared after the process environment reset.

## 1. Governing method and evidence law

The ratified implementation order remains the historical explanation of how U
was executed:

```text
owner rides → U.H characterization → keystone move → U.B/U.C recuts and carves
→ meta-legacy and dogfood → U.D performance → U.F constellation → U.G design
→ U.E terminal adjudication → U.Z close
```

Primary records:

- `docs/tranches/U/U.md`
- `docs/tranches/U/loop/PASS-5.md`, especially **The wave-set development order**
- `docs/tranches/U/OWNER-DECISIONS.md`, especially OD-U18, OD-U22, and OD-U23
- `docs/tranches/U/FINAL-U.md`
- `docs/tranches/U/PROGRESS.md`, especially the impl-drive entry anchor

U.A–U.H, U.R, and U.Z are all closed. Their formation-era version and sibling
coordinates are historical, not current dependency truth.

Carry these operational laws forward:

1. A sweep is a measurement. Re-measure its complete carrier set and dispose
   every hit by name.
2. A measured refutation amends the charter. Do not preserve a planned fix
   after its premise fails.
3. Verify every number and artifact identity; never inherit a count from a
   status paragraph or rehearsal packet.
4. Honest residue becomes a named, bounded clause. It is never scored away.
5. Work in bounded batches of three. Preserve per-stage salvage commits and use
   run-resume facilities when an execution context fails.
6. Prototype worktrees and rehearsal tarballs are evidence, not release bytes.
7. Prefer direct product code, ordinary tests/builds, strict package closure,
   and native Browser paint. Do not recreate a receipt, gate, proof, posture,
   or meta-script farm. The surviving `proof:publish` remains useful because it
   checks a real package boundary; `proof:owner-golden` remains a human visual
   boundary. No new standalone proof genre is authorized.
8. Clean breaks are binding: no legacy root, alias, migration shim, dual path,
   dual major, masking fallback, forced resolution, patched `node_modules`, or
   `file:`/worktree/tarball publication lock.

## 2. Immutable producer truth

### Value 4

| Field | Observed immutable value |
|---|---|
| Package | `@mkbabb/value.js@4.0.0` |
| Tag | `v4.0.0` |
| Peeled commit / `gitHead` | `44ddaff7a22283a4f7a42608893eeae7bc234424` |
| Tarball | `https://registry.npmjs.org/@mkbabb/value.js/-/value.js-4.0.0.tgz` |
| Bytes | `37,290` |
| SHA-256 | `7f80658ca4e16e99ccbb41ad6c9d8c08b2e5f86a7c951d2a833c97f89fb303ae` |
| Integrity | `sha512-Z8ywb4htSxJlRFvoU1DNtvzr9Bsuaw9ahT/hvNlKbnRj6fTnLuXjn0itKq1Q5s6rwg24ct0zcLZ04BuR3/SzGw==` |
| Shasum | `ccb962e592fb42e6602fc2bb6afbfb1763788b9d` |
| Provenance | GitHub Actions run `29497728532` |

Its public package has exactly seven entries and no root export:

```text
./color  ./value  ./css  ./easing  ./math  ./transform  ./quantize
```

Value owns the CSS grammar, keyframe-selector parsing, animation-shorthand
expansion/cascade, easing primitives, and emerging-CSS AST. Keyframes must not
restore its deleted root, `/parsing`, or `/units` surfaces and must not retain a
local parser, classifier, normalizer, or fallback for those contracts.

### Keyframes 6

| Field | Observed immutable value |
|---|---|
| Package | `@mkbabb/keyframes.js@6.0.0` |
| Annotated tag object | `26190755ce1e57c54cb14ef0a454ae02ed2b3da0` |
| Peeled commit / `gitHead` | `5a9183a7afe24702081a7b87c8adc7286ddce9a0` |
| Source tree | `da7107600d237a49f6daa2064366c2b8ffe91cc0` |
| Tarball | `https://registry.npmjs.org/@mkbabb/keyframes.js/-/keyframes.js-6.0.0.tgz` |
| Bytes | `184,430` |
| SHA-256 | `77d8860054f00700de9bc9aeca62dfec91f1422cbf839df62f40135972df0eb8` |
| Integrity | `sha512-mpb3gSxU8UgO4HBBG2he6CFNCq7tW+k9id82DgAjeeDdeAmtEzmZ2/kuK3j5AbUZRULcN1QNkNJychNk49bT4Q==` |
| Shasum | `5cc5fdecb886f4df33371d3358239594a8965b6b` |
| Provenance | GitHub Actions run `29499708034` |

The major is justified by measured public breaks: Value-3 carrier
declarations, `getTimingFunction`, `BlendMode`/`weighted`, and public
`printWidth` were removed without compatibility aliases. The package exports
only `.` and `./engine`, depends on exact Value `4.0.0`, and has no Glass
dependency, peer, or optional edge. The earlier nested-Glass failure mode is
therefore gone from the published library graph.

Producer validation already completed against registry Value 4:

- clean registry-only `npm ci`;
- exactly one physical, nonsymlinked Value 4 and zero Glass;
- library types, build, tests, and strict packed-consumer closure;
- no packed Prettier, PostCSS, `formatCSS`, or `printWidth` runtime/declaration
  reach;
- exact `.` and `./engine` importability.

The release-service lock had 374 packages, exact registry Value 4, and zero
Glass, parse-that, `file:`, link, Git, or non-registry resolution. Its SHA-256
is `525ffcdf6d2729f22d8f9b09944d0d47d76335df8407f8336fef8ae6bde52356`.

Do not republish or overwrite Keyframes `6.0.0`.

## 3. Current Keyframes disk truth

### Git and worktree split

Before this handoff file was added, `/Users/mkbabb/Programming/keyframes.js`
observed:

- local `master` and local `origin/master` at `a59d3a22da080a8ed224e8d675112bb3bb0135b0`
  (`v5.3.5`);
- the local object database did not contain `5a9183a7…`;
- 219 modified, 7 deleted, and 24 untracked paths against that stale base;
- `package.json` already describing Keyframes 6 with exact Value 4;
- `package-lock.json` already carrying the correct registry-only K6/V4 lock.

The networked release service separately observed and pushed remote `master`
to `5a9183a7…` before tagging/publishing. This checkout simply has not fetched
that object. Its stale refs do not refute the immutable GitHub/npm release, but
they make the checkout unsafe as a commit, merge, or release base.

Current producer-file identities:

- `package.json` SHA-256
  `57b33882c5154352c3c6d44355c90d10f29edfbca08043360b5ff07039ecaba6`;
- `package-lock.json` SHA-256
  `525ffcdf6d2729f22d8f9b09944d0d47d76335df8407f8336fef8ae6bde52356`.

### The prepared consumer slice

The now-lost clean post-Glass clone contained exactly 65 pending paths relative
to immutable K6:

- 55 `demo/**` paths;
- 6 `test/demo/**` paths;
- `docs/tranches/U/FINAL-U.md`;
- `docs/tranches/U/KF-TO-GLASSUI-U.md`;
- `.github/workflows/deploy-pages.yml`;
- `scripts/observe/demo/subject-animates.mjs`.

`test/demo/scene-entries.test.ts` belongs to the K6 producer base. It appears
untracked only because the live checkout compares against K5; never copy or
count it as a 66th consumer path.

The current 65-path content/status manifest, measured as sorted
`status + file SHA + path`, has SHA-256:

```text
a26e6a06bf89a07841d9f099ea205f29f6f5d11257a27a31999eab87c320c8a9
```

This handoff file was written afterward and is not part of that 65-path
manifest. Preserve or commit it as a separate documentation slice rather than
silently counting it as consumer implementation.

Four consumer files are untracked relative to K5 and must be copied explicitly
when reconstructing the clean K6 successor:

```text
demo/utils/formatEditorCSS.ts
demo/utils/keyframeSelector.ts
test/demo/instrument/value4-editor-boundary.test.ts
test/demo/reference-data/easing-catalog.test.ts
```

The product slice contains:

- the clean Value 4 demo transposition, including structural selectors and CSS
  AST, Value-owned shorthand collection through
  `collectAnimationOptions(...).at(0)`, and no local grammar fallback;
- demo-owned `formatEditorCSS`, keeping Prettier development/demo-only;
- deletion of `controlSurfaceDFA.ts` and duplicated control-state machinery;
- the Glass 7 API migration in these 18 direct component consumers:

```text
demo/app/dock/ChromeDock.vue
demo/app/dock/MbabbMenu.vue
demo/components/instrument/keyframes/KeyframesEditor.vue
demo/components/instrument/shell/EditorShell.vue
demo/components/instrument/shell/SharePopover.vue
demo/components/instrument/timeline/KeyframeTimeline.vue
demo/components/instrument/transport/TransportDock.vue
demo/components/instrument/transport/channel-controls/ChannelControls.vue
demo/components/instrument/transport/channel-controls/ChannelOptions.vue
demo/components/instrument/transport/channel-controls/TimingFunctionPanel.vue
demo/components/instrument/transport/controls-pane/RibbonBar.vue
demo/components/playback/PlaybackRibbon.vue
demo/scenes/cube/matrix-editor/MatrixEditor.vue
demo/scenes/easing/EasingSidebar.vue
demo/scenes/easing/EasingTarget.vue
demo/scenes/sequence/SequenceTarget.vue
demo/scenes/spring/SpringPhysicsFacet.vue
demo/scenes/spring/StartingStyleTarget.vue
```

The key migration decisions are already made:

- `HeaderRibbon mode="persistent" placement="right"`; no anchor-slot guessing,
  mount-time DOM inspection, width patch, z-index patch, overflow patch, timing
  delay, or slot-omission workaround;
- `DockTrigger` owns pointer actuation; `MbabbMenu.vue` removes roughly 100 lines
  of synthetic click/pointer/capture/hover state;
- `DarkModeToggle` is the sole theme command;
- decorative Avatar, `emphasis`/`icon-only` buttons, boolean `cartoon`,
  selectable Chip, standard Slider, semantic StatusDot states, canonical
  `jump-*` terms, and the `Metric` surface;
- no Keyframes-side Glass behavior guess or fallback.

Before close, correct current prose/API residue directly:

- `README.md:322,428,433,764` and `docs/published-surface.md:151` still describe
  removed weighted blending;
- `demo/DESIGN.md:67` still shows the removed `Card surface="cartoon"` shape;
- audit old Glass 4/5 comments in touched consumers for present-tense accuracy,
  but do not create a policing script for them.

### Ephemeral state that must not be trusted

- `/private/tmp/keyframes-postglass-consumer-20260716.uZ1ycp/repo` is gone.
- All previously named rehearsal and frozen `/private/tmp` directories are
  currently gone.
- Installed `node_modules/@mkbabb/glass-ui` reports `7.0.0`, but it has no
  package/lock or immutable registry identity. Its manifest SHA-256 is
  `6e8a939fbc85b316b64bd30c5df3c9d5d19d8425ef5451d0442218c7f1a7ceae`.
- `node_modules` also carries stale parse-that residue despite the lock having
  no such package. Delete the whole install before validation.
- Current `dist/gh-pages` is unfrozen and untrusted: 53 files, 6,760,872 bytes;
  entry SHA-256
  `d4f3e0e2831c89a77ebad62fd7a6fe5bcce7c2b7947d08f93cd6c1664bcb3da2`.
  Never serve or deploy it.

## 4. Glass 7 producer boundary

Active Glass task: `019f6610-6022-7df1-95b3-472b17a64656`.

Its authoritative live handoff is
`/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/HANDOFF-ACTIVE-EXECUTION.md`.
That file is intentionally uncommitted until Glass's next bounded
documentation commit; preserve it with the shared worktree.

Observed checkout:

- `/Users/mkbabb/Programming/glass-ui`;
- local branch `codex/bi-p-q-execution`;
- HEAD `c181f0a78dae598c9c28c7d5760a8756d7c00a28`;
- four local commits ahead of `origin/master`; no remote branch contains HEAD;
- a large shared dirty transaction. Preserve it wholesale; never reset, clean,
  or replay it blindly.

Durable local commit chain:

1. `9f0e67dd03dee649904e22c1a02ee81fcbd53908` — Q063 source-media preservation.
2. `490cc46e321bebb1e7ce56b507592f42b609fc94` — broad Glass 7 product and public-surface cut.
3. `d17153ec1814915651687f4b5db63d5e3b101f2e` — receipt/gate-farm deletion and ordinary CI restoration.
4. `c181f0a78dae598c9c28c7d5760a8756d7c00a28` — P000–P133 reconciliation and the 20-wave Q close rail.

At the broad-cut boundary, Glass reported 176 files / 1,131 tests, both type
graphs, a 771-module library build, a 3,572-module demo build, and 69 strict
consumer imports. These are commit evidence, not current release credit.

Current Glass authorities:

- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/HANDOFF-ACTIVE-EXECUTION.md`
- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/PLAN.md`
- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/FORMATION/waves/`
- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/addenda/PLAN.md`
- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/addenda/DISPOSITIONS.md`
- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/addenda/JUDGMENT-ROSTER.md`
- `/Users/mkbabb/Programming/glass-ui/docs/tranches/BI/addenda/REGISTRY.md`

The authoritative 134-row P ledger is **61 literal DONE + 2 achieved by
abrogation + 22 terminal declined/superseded/abrogated + 49 landed or
source-implemented but nonterminal**. The arithmetic is 61 + 2 + 22 + 49 =
134. Earlier `63/22/49` and interim `61/25/48` prose are stale. The tranche
also retains 93 original BI waves and 20 Q correction/close waves. Neither a
status word nor a formation receipt earns native or two-challenge credit.

Glass `package.json` currently says `7.0.0`, carries 74 exports, and peers on
Value `^4`, Keyframes `^6`, and Pencil `^0.9.2`. This is working-tree intent.
There is no `v7.0.0` tag and no immutable Glass 7 registry artifact.

### Active Glass blockers

1. **Q003 / V-A95 is the principal RED and release blocker.** Repeated Aurora
   drag can produce transient black compositor slabs. The current honest
   sampler topology is 4 active / 0 nested on desktop and 3 / 0 narrow; do not
   restore stale 5 / 0 or single-plate prose. Equal-size adjacency arms A and B
   were refuted and removed. No margin, z-index, opacity mask, engine reset,
   raster fallback, second sampler, or Keyframes workaround is allowed. The
   next evidence lane is resize-wake, `content-visibility`, and backing-size
   lifecycle tracing.
2. **P026 Springs and clipboard** remains challenged: responsive endpoint
   breathing room, duplicated geometry authority, idle compositor hints,
   stale/out-of-order copy feedback, focus loss, duplicate clocks, and disposal
   races must converge on the shared clipboard owner.
3. **HeaderRibbon and strict declarations** retain sound explicit
   persistent-default/collapsible-opt-in semantics, but the latest challenge
   found stale focus state and a `/// <reference types>` closure hole.
4. **Q031** is materially green on desktop far-jump/terminal-scroll behavior;
   the narrow counter-arm remains.
5. **Q020, Q023, Q024, Q032, Q041, and Q042** have substantive source work but
   outstanding native/two-pass obligations. V-A122 is Glass-only: the Sheet
   graded edge must not animate Drawer blur or radius; Drawer stays fixed-radius
   and material-constant.

### Exact Glass continuation order

1. Finish Springs/clipboard and HeaderRibbon/declaration corrections with two
   real challenges.
2. Close Q003 natively, including the P046/P047/P122 matrices.
3. Present Q051 once with evidence. Sixteen live owner decisions remain; only
   row 17 is user-closed. Row 6 is again a blank decision with a
   moot/superseded recommendation.
4. Send Q060's exact consumer/export handoffs.
5. Run Q002 final pre-tag paint.
6. Build and inspect one clean registry-only Glass artifact from immutable
   Value 4 and Keyframes 6.
7. Commit and push the remaining Glass transaction, then tag and publish Glass
   7 with provenance only if product, strict-package, and native evidence are
   green.

The old 966,350-byte Glass rehearsal at
`/private/tmp/glass-v7-rehearsal-20260716-kf-indent-final/` with SHA-256
`478d9166dc8b9f3bb866fc253afb0bde829f1c04654fc961c3953080e485331a`
is held and defective. It predates strict declaration isolation and subsequent
HeaderRibbon/Q003 findings. Never consume or credit it.

## 5. Exact Keyframes restart after immutable Glass 7

Use a network-capable shell and a new uniquely named isolated directory.

1. Clone or fetch Keyframes and check out exact commit
   `5a9183a7afe24702081a7b87c8adc7286ddce9a0`. Verify `HEAD`, tree, clean status,
   package version, export map, and registry-only Value 4 lock before copying
   anything.
2. Export the tracked consumer patch from the live owner tree for only:
   `.github/workflows/deploy-pages.yml`, all changed `demo/**`, the two U docs,
   `scripts/observe/demo/subject-animates.mjs`, and changed `test/demo/**`.
3. Copy the four untracked consumer files listed in §3. Do not copy
   `test/demo/scene-entries.test.ts`; confirm it already exists in the K6 base.
4. Recompute the complete 65-path manifest and compare it with
   `a26e6a06…`. Inspect every difference. Do not copy the 226/250-path mixed
   owner-tree transaction wholesale.
5. Wait for a fresh immutable Glass 7 packet: version, annotated tag object,
   peeled commit/`gitHead`, tarball, integrity, shasum, provenance run, export
   and declaration maps, peer map, strict packed-consumer evidence, and native
   close. A local package version or rehearsal hash is insufficient.
6. Add exact `"@mkbabb/glass-ui": "7.0.0"` to `devDependencies` only. Keyframes
   6's library graph remains Glass-independent; no runtime, peer, or optional
   Glass edge may return.
7. Regenerate the lock from the registry. Reject any `file:`, link, Git,
   tarball, forced, aliased, nested-major, or non-integrity resolution.
8. Delete `node_modules` and `dist`; run clean `npm ci`; prove one physical,
   nonsymlinked Glass 7, root Keyframes 6, and one deduped Value 4.
9. Run substantive checks, not process theater:

   ```text
   npm run check
   npm test -- --run
   npm run lint
   npm run build:lib
   npm run proof:publish
   npm run gh-pages
   ```

   Also run a strict `skipLibCheck:false` packed consumer and inspect packed
   imports/declarations. Build the library before gh-pages because the library
   build cleans `dist`.
10. Freeze the final gh-pages tree outside `dist` in a uniquely named directory
    and record path, file count, total bytes, entry hash, and whole-tree
    identity before any later build.
11. Use the native in-app Browser as visual authority at 1280px and 390px:

    - `#/` paints one main and “Select an animation…” with no Vite overlay;
    - HeaderRibbon is actionable on first frame and its center hit-tests to its
      own controls;
    - native DarkModeToggle click changes its label/theme/color scheme;
    - easing tooltip opens and owns `aria-describedby`;
    - `#/cube` Play changes to Pause and the cube visibly moves;
    - Dock collapsed/expanded states have one active, non-inert face and no
      narrow overlap;
    - no black compositor slab, focus trap, or occluded hit target appears.

    Stop at the first material defect. Do not cover it with CSS or timing.
12. Correct the stale documentation shapes named in §3, run commit discipline,
    and stage a bounded set: the reconstructed 65-path consumer slice, the
    necessary exact Glass/package-lock update, and only those directly named
    documentation corrections. Keep this handoff as a separate documentation
    slice. Commit, push, and deploy through the existing Pages workflow.
13. Record exact CI run, `last-demo-green` ancestry, Cloudflare run, rollback
    deployment ID, preview/custom-domain URL, served entry, and round-trip hash.

This remaining act is a Keyframes demo-consumer commit and Cloudflare deploy,
not permission to mutate or republish immutable Keyframes 6. If any packed
library/public bytes change, stop and determine the smallest honest successor
version from the measured break shape; never overwrite `6.0.0`.

## 6. Downstream Atlas and SCI boundary

Atlas `4.0.0` is immutable at tag object
`9d959675b0e5659d9e795090334c8a1f475488f6`, peeled commit
`f41fb125f5be8d372b8a4370934b56e5e067b0df`, tarball
`https://registry.npmjs.org/@mkbabb/atlas/-/atlas-4.0.0.tgz`, integrity
`sha512-BoERZib0NWPdu/e2vKraWkyqNeP5ligFld8E6i5joJJopyOYDP6sjZML6jYFS2Y7MYx7VHIvgEJgnFI1Dl23aA==`.
Atlas master is clean at `1e2b911bef561102fa499f8c0f7c1256daf40b5d`
with unpublished filter/reveal/progress and PAH-01/02 corrections.

SCI's active dirty tranche intentionally remains on the old hold tuple:
Atlas 4, Glass 6, Keyframes 5.3.5, and Value 3.1. That is observed hold-state,
not final release truth. GCF-01 and GCF-02 were already delivered once to
Glass; do not repeat or widen them. GCF-03 remains unsent pending integrated
native reproduction.

After immutable Glass 7:

1. Atlas consumes registry Glass 7 + Keyframes 6 + Value 4 from clean master,
   determines the smallest honest successor, proves one physical core, and
   publishes.
2. SCI updates both manifests and its sole root lock atomically to that Atlas
   successor and the coherent Glass 7 / Keyframes 6 / Value 4 tuple.
3. SCI runs consolidated type/test/build plus native desktop/phone,
   light/dark, motion/reduced-motion acceptance before preview.
4. SCI production remains legally held; only preview may proceed after
   technical close.

Active coordination tasks:

- Glass BI/P/Q: `019f6610-6022-7df1-95b3-472b17a64656`
- Value V: `019f6619-f1b0-7cf0-94af-27f579ff4fba`
- SCI/Atlas: `019f6615-6899-7dd1-b004-901c3b752a4a`

Coordinate at their roots with bounded, non-interrupting messages. Do not edit
their active worktrees from Keyframes.

## 7. Explicit do-not-consume ledger

All of the following are historical, rehearsal-only, defective, superseded,
missing after the `/private/tmp` reset, or some combination thereof:

- every local Value 4 bootstrap: 35,544-byte original, 36,378-byte selector,
  36,447-byte comments/timeline, and 38,126-byte A85 archives;
- Keyframes rehearsals at 231,628 bytes (undeclared Prettier/PostCSS runtime),
  184,655, 184,684, 184,708, 184,710, 184,254, and the 184,382-byte EOF-clean
  pack;
- the 966,350-byte Glass 7 rehearsal with SHA-256 `478d9166…`;
- `/private/tmp/keyframes-gh-pages-w17-final-20260716`;
- `/private/tmp/keyframes-gh-pages-w17-placement-final-20260716`;
- current live `node_modules/@mkbabb/glass-ui`;
- current live `dist/gh-pages`.

Registry Value 4 and registry Keyframes 6 supersede every local producer
archive. Only a future immutable Glass 7 packet may advance the DAG.

## 8. Definition of done

The Keyframes side of this rail is complete only when all of these are true:

- Glass 7 is immutable with tag, peeled commit, npm coordinates, provenance,
  strict package closure, one-core evidence, and native close;
- the 65-path Keyframes consumer slice is reconstructed on clean immutable K6,
  with exact registry Glass 7 as a demo-only development dependency;
- the lock is registry-only and resolves one Glass 7 / Keyframes 6 / Value 4
  chain;
- source, types, meaningful tests, library build, package boundary, real
  gh-pages build, and strict packed consumer are green;
- the frozen gh-pages artifact passes the full native 1280/390 matrix without
  a material defect;
- the bounded consumer commit is pushed and Cloudflare deploy/round-trip facts
  are recorded;
- Atlas and SCI receive the immutable Glass packet and continue their ordered
  successor/atomic-consume rail;
- no held rehearsal, hidden second core, local parser, compatibility shim,
  fallback, proof farm, or stale version claim survives.
