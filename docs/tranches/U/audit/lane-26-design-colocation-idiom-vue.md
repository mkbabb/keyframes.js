# Lane 26 — design-colocation-idiom-vue

> Tranche U audit lane 26/32. DESIGN LANE (frontend-design loaded). The Vue-idiom
> half of THE GRAND COLOCATION EDICT: the research-grade recommendation for
> recursive component colocation in the Vue 3.5 + Tailwind v4 + Vite (rolldown)
> demo — SFC + sibling `.css` splits, `defineAsyncComponent` boundaries vs
> colocation, barrel discipline, scoped-style vs utility tension, test
> colocation. Deliverable: the idiom RULING set U enforces, each with rationale
> + enforcement gate shape. All evidence read from the live tree at `master`
> (post-T, 5.2.0); gates run read-only where cited.

---

## 0. Method

- Full file census of `demo/` (`.vue`/`.ts`/`.css` with line counts), the
  instrument barrels, the scene dirs, `test/` layout, and the gate roster.
- Import-graph census: exact barrel-importers vs deep-importers of the
  instrument facility; library cross-zone import style (deep vs barrel).
- **Built-artifact chunk-graph trace** over `dist/gh-pages/assets/` — the only
  ground truth for "does the lazy boundary hold" (source-shape gates missed
  this class before; see the gate-blind-spot memory).
- Live run of `node scripts/proof-colocation.mjs` (read-only) to observe the
  DEFERRED tolerance in action.

---

## 1. The current idiom inventory (what the tree actually does)

### 1.1 Colocation state — largely CONFORMANT

The R.W5/T.F5 shape is real and good: `demo/scenes/<name>/` fuses
`<Name>Scene.vue` + targets + `use*Demo.ts` + keys + assets; nested modules
recurse correctly (`scenes/cube/orbital-drag/` carries its own
`composables/` + `types.ts` + `index.ts`; `scenes/cube/matrix-editor/`
likewise). The instrument facility
(`demo/@/components/custom/instrument/{transport,keyframes,timeline,shell}/`)
colocates per-member `composables/`, `components/`, `utils/`. The shared tier
(`demo/@/`) is small: 8 files across `composables/` + `utils/`, 9 in `state/`,
4 sheets in `styles/`.

### 1.2 SFC + sibling `.css` splits — INCONSISTENT, half-ungated

Seven SFCs use the house split idiom `<style scoped src="./Name.css">`:

| SFC | .vue L | sibling .css L |
|---|---|---|
| `demo/scenes/sequence/SequenceTarget.vue:255` | 255 | 259 (`SequenceTarget.css`) |
| `demo/scenes/easing/EasingTarget.vue:309` | 309 | 193 |
| `demo/scenes/cube/CubeTarget.vue:239` | 239 | 154 |
| `demo/scenes/square/SquareScene.vue:331` | 331 | 159 |
| `demo/@/components/custom/instrument/transport/AnimationControlsGroup.vue:334` | 334 | 223 |
| `demo/@/components/custom/instrument/transport/components/ControlsPaneWrapper.vue:320` | 320 | 148 |

But the LARGEST SFC in the demo, `demo/scenes/spring/SpringTarget.vue` (471L),
keeps a **200-line inline `<style scoped>` block** (measured) — no split. And
`proof:style-file-ceiling` (scripts/proof-style-file-ceiling.mjs:31-38) sweeps
ONLY `demo/@/styles/` — the sibling component sheets (`SequenceTarget.css`
259L, `AnimationControlsGroup.css` 223L) have **no ceiling and no split
trigger**. The split idiom exists; the RULE for when it fires does not.

### 1.3 `defineAsyncComponent` boundaries — real seams vs decorative barrels

Real, working async seams (all confirmed in source + dist):
- Scene entries: `demo/app/scene/scenes.ts:143-189` (`lazyScene` +
  `import()` per scene) — every scene is its own chunk (`SpringScene-*.js`, …).
- Pane reveal: `demo/@/components/custom/instrument/transport/controls/AnimationControls.vue:252-253`
  (`defineAsyncComponent` for `KeyframesStringControls` / `KeyframeTimeline`)
  — Monaco (`vendor-monaco` 4,085 KB) and the timeline stay out of eager graphs.
- App shell Suspense seam: `demo/app/App.vue:75`.

Decorative seams: the T.F5 lazy barrels themselves — see §2, Finding 2.

### 1.4 Barrel discipline — the barrels exist; the graph routes around them

- The umbrella `demo/@/components/custom/instrument/index.ts` (`export * from`
  ×4, lines 25-28) has **ZERO importers** (exact-match grep over `demo/`).
- The `transport/`, `keyframes/`, `timeline/` lazy barrels have **zero
  importers outside the facility**; the only sub-barrel consumed is the EAGER
  `shell/index.ts` (2 sites: `demo/app/App.vue:135`,
  `demo/app/dock/MbabbMenu.vue:110`).
- Everyone else deep-imports: `demo/scenes/easing/useEasingDemo.ts:19-20`,
  `demo/scenes/easing/EasingScene.vue:10`,
  `demo/scenes/spring/SpringScene.vue:21`,
  `demo/scenes/spring/SpringPhysicsFacet.vue:133`, `demo/app/App.vue:133,139`,
  `demo/app/dock/ChromeDock.vue:3`.
- Library side: cross-zone imports are MIXED — 29 deep
  (`from "../engine/animation"`-style) vs 20 barrel (`from "../engine"`-style;
  e.g. `src/animation/svg/motion-path.ts:37`). No rule picks a side.
  `internal/` is barrel-free by documented design (C-5), and
  `proof:no-flat-siblings` clause 4 already mandates EXPLICIT-NAMED public
  zone barrels — but says nothing about who may bypass them.

### 1.5 Scoped-style vs utility — healthy in practice, codified nowhere

40 SFCs carry `<style scoped>`; utilities live in templates; `@apply` appears
**11 times, all inside `demo/@/styles/design-idioms.css:94-114`** (the shared
idiom sheet), never in an SFC; **zero `@reference`** anywhere (so no per-SFC
Tailwind theme re-compilation — scoped blocks are plain token-consuming CSS).
`proof:styling-idioms` already verifies every referenced class resolves to an
owned definition (design-idioms ∪ glass-ui ∪ tw-animate-css ∪ the file's own
scoped style — scripts/proof-styling-idioms.mjs:395). But `demo/DESIGN.md`
(27L total) states none of this — the healthiest idiom in the tree is
unwritten law.

### 1.6 Test layout — the library mirrors; the demo tier is flat

`test/` mirrors `src/animation/<zone>/` (S.B7): `compile/ easing/ engine/
group/ ingest/ internal/ orchestration/ physics/ presets/ resolve/ scroll/
svg/ waapi/` + `fixtures/ stubs/ support/`. `src/` contains **zero** test
files. But `test/demo/` is **FLAT — 24 files** (`cube-scene.test.ts`,
`useAnimationGroupPlayback.test.ts`, `timeline-undo.test.ts`, …) with no
sub-structure mirroring `demo/{scenes,@/components/custom/instrument,@/state,app}/`.
The mirror premise holds for the library and breaks at the demo boundary.
`vitest.config.ts:44-47` globs `test/**` recursively, jsdom, one environment.
`package.json:33-37` publishes `files: ["dist"]` — colocated tests would never
ship, so the tarball is NOT the argument; the gates and configs are (§3 R5).

---

## 2. Findings

### Finding 1 — CRITICAL (performance / async-boundary breach): the spring scene statically drags the 906 KB highlight.js vendor chunk

**Evidence.** `demo/scenes/spring/SpringPhysicsFacet.vue:133` eagerly
deep-imports `KeyframesEditor.vue`; `KeyframesEditor.vue:113` imports
`useCodeHighlight` from `./composables/useHighlightCSS`, and
`demo/@/components/custom/instrument/keyframes/composables/useHighlightCSS.ts:3-6`
STATICALLY imports `highlight.js` + two full theme sheets. Built-graph trace:
`dist/gh-pages/assets/SpringScene-J0HbSYti.js` → static
`from"./parseAnimationCSS-CdOrTIYk.js"` → static
`from"./vendor-highlight-BMUupdeS.js"` (**906 KB**, measured). The ONLY two
chunks that statically import `vendor-highlight` are `KeyframesStringControls`
(correctly behind the pane-reveal `defineAsyncComponent`,
`AnimationControls.vue:252`) and **SpringScene** — the leak. Every other
reach into the keyframes editor rides an async seam; this one deep import
bypasses them all, and no gate looks at the chunk graph, so it shipped green.

**Failure scenario.** User switches to the spring scene on a mid-tier phone:
906 KB of highlight.js (plus its theme CSS) is fetched + parsed on the
scene-entry critical path before the spring target can mount — against the
"performance is the grand edict" ruling, on a scene that shows no highlighted
code until the editor pane is revealed.

**Proposal (gestalt, not a patch).** Two-part cure chartered together:
(a) the SpringPhysicsFacet consumes `KeyframesEditor` through the SAME
pane-reveal seam class as `AnimationControls.vue` — the facet's editor card is
a reveal boundary, so the import becomes `defineAsyncComponent` at the facet's
seam (RULING 2's "laziness lives at the consumer's seam"); and (b) U charters
**`proof:chunk-graph`** — a static dist-graph gate (build `gh-pages` once,
parse each chunk's `from"./…"` edges exactly as this audit did) asserting: no
scene chunk statically reaches `vendor-monaco` / `vendor-highlight` /
`html2canvas`; `vendor-three` is reachable only from `AmigaScene`. This is the
gate class the source-shape roster is blind to (the recorded gate-blind-spot
lesson made structural).

### Finding 2 — MAJOR (barrel discipline / NO-legacy): the T.F5 lazy-barrel apparatus is decorative — zero consumers, and the graph it exists to protect routes around it

**Evidence.** Umbrella `demo/@/components/custom/instrument/index.ts:25-28`
(`export *` ×4): zero importers. Lazy sub-barrels
`transport/index.ts:8-13`, `keyframes/index.ts:7-11`, `timeline/index.ts:6`:
zero importers outside the facility. The 13 external consumers all deep-import
(§1.4 citations). So the `defineAsyncComponent` wrappers in the barrels wrap
components nobody obtains through them, the real laziness lives at
`AnimationControls.vue:252-253` / `scenes.ts:143-189`, and the one place a
deep import crossed a heavy boundary (Finding 1) had no guard. The barrel
comments claim "importing this umbrella never eager-loads Monaco" — a true
statement about an import that never happens. Under the owner's NO-legacy
edict, an unconsumed export surface IS legacy. Note also the umbrella's
`export *` sits in the same tree whose library gate
(`proof:no-flat-siblings` clause 4) mandates explicit-named barrels — the demo
contradicts the house's own barrel policy.

**Failure scenario.** A future consumer trusts the barrel comment, imports
`{ KeyframesEditor }` from the keyframes barrel in a NEW eager context, gets
an async wrapper where a concrete component was wanted (prop/ref type
mismatch with `ComponentPublicInstance` idioms) — or, inversely, deep-imports
as everyone else does and re-creates Finding 1; nothing red-flags either.

**Proposal.** Pick ONE sanctioned door and enforce it (RULING 1): barrels
become the demo's module CONTRACT — explicit-named, EAGER re-exports only
(async-ness is the consumer's seam decision, per RULING 2) — and a
dependency-cruiser demo ruleset (the library already runs depcruise) forbids
cross-module deep imports (`@components/custom/instrument/*/…` reachable from
outside only via the module's `index.ts`; intra-module imports stay
deep-relative). Delete the zero-consumer umbrella outright — the facility's
cohesion is the directory, not a re-export union. The `defineAsyncComponent`
wrappers leave the barrels entirely.

### Finding 3 — MAJOR (edict conflict, live): `proof:colocation`'s DEFERRED tolerance map is a standing deferral device that PASSES green over two known violations

**Evidence.** `scripts/proof-colocation.mjs:69-82` hard-codes a `DEFERRED`
map ("TOLERANT: satisfied whether present-and-deferred or already-cured").
Live run (this audit): `PASS` with `⋯ 2 DEFERRED residual(s)` —
`demo/@/composables/gestureSelectSuppression.ts` (a plain body-class counter,
not a composable — the gate's own kind-clause would red it) and
`demo/@/utils/kfEngine.ts` (engine-loader boot infra, not a util). The
promised curing wave ("T.F13 re-homes it") never landed — T closed, 5.2.0
shipped, the files sit in their pre-edict homes. A third entry
(`animation-transport/useKfPillTabs.ts`) is already-cured dead weight in the
map. This is exactly the "honest defer" device the owner terminated for U's
scope, fossilized inside the edict's own keystone gate.

**Failure scenario.** U's restructure waves treat green `proof:colocation` as
"the shared tier is clean," re-shuffle around two mis-kinded members, and the
tolerance map silently grows (the precedent exists) — the gate becomes a
whitelist, not a rule.

**Proposal.** Burn the map: U wave 1 executes the two re-homes
(`gestureSelectSuppression` → `@/utils/`; `kfEngine` → beside `@/state/` as
the runtime-infra tier the gate comment itself names), deletes the `DEFERRED`
machinery from the gate (lines 69-96), and the gate becomes tolerance-free —
any future exception must change the RULE, not enroll in a list. This is the
NO-MORE-DEFERRALS reading applied to gate internals, not just backlogs.

### Finding 4 — MAJOR (SFC/CSS split rule unstated + half-ungated): the largest SFC keeps a 200L inline style while smaller ones split, and sibling `.css` files have no ceiling

**Evidence.** `demo/scenes/spring/SpringTarget.vue` = 471L total with a 200L
`<style scoped>` block (measured), no sibling sheet — while
`EasingTarget.vue` (309L) splits to `EasingTarget.css` (193L) and five other
SFCs follow the `<style scoped src="./Name.css">` idiom (§1.2 table).
`scripts/proof-style-file-ceiling.mjs:31-38` ceilings ONLY `demo/@/styles/*`
at 300L; `SequenceTarget.css` (259L) and `AnimationControlsGroup.css` (223L)
are swept by nothing and can grow monotonic. `proof:demo-no-oversize`
(500L, `.vue`/`.ts` only — scripts/proof-demo-no-oversize.mjs:44) never sees
`.css` and never sees the style-block share of an SFC.

**Failure scenario.** SpringTarget grows to 495L (green under the 500L gate)
with a 240L style block; the next enrichment splits it under deadline pressure
into an arbitrary shape; meanwhile `SequenceTarget.css` crosses 300L unseen —
the exact re-accretion `proof:style-file-ceiling`'s own prose says it exists
to bite, happening one directory over.

**Proposal.** RULING 3 (below) makes the split MECHANICAL, and the two gates
merge into one style-geometry gate: every demo `.css` (shared OR sibling)
≤300L; every SFC whose `<style>` block exceeds 100L splits it to the sibling
`<Name>.css` via `<style scoped src>` (the established house idiom — scoping
is preserved, HMR is preserved, and the SFC stays a template+script document).
`SpringTarget.vue` is the first cure.

### Finding 5 — MAJOR (test-colocation ruling needed): `test/demo` is flat, breaking the mirror premise the library tier just ratified

**Evidence.** `test/` mirrors `src/animation/<zone>/` per S.B7
(vitest.config.ts:44-46 comment; 13 zone dirs present); `test/demo/` is one
flat bucket of 24 files spanning at least four demo areas (scenes:
`cube-scene.test.ts`, `sequence-scene.test.ts`; instrument:
`KfPillTabs.test.ts`, `timeline-undo.test.ts`,
`useAnimationGroupPlayback.test.ts`; state: `scene-machine-reducer.test.ts`,
`control-surface-dfa.test.ts`, `sharing.test.ts`; app/runtime:
`scene-visibility-pause.test.ts`, `scene-raf-leak.test.ts`). `src/` and
`demo/` contain zero colocated tests.

**Failure scenario.** U's restructure moves demo modules; nothing binds a flat
`test/demo/*.test.ts` to the module it exercises, so moved/renamed modules
strand stale tests (or tests silently exercising the OLD import path via
aliases), and reviewers cannot see per-module coverage at a glance — the
readability failure the mirror exists to prevent.

**Proposal.** RULING 5: the mirror SURVIVES — tests do NOT colocate into
`src/`/`demo/`. Rationale (why colocation loses here, despite the edict): a
test is a CONSUMER of a module's public surface, not a private satellite of
it — colocating it inside the module makes the module's directory lie about
its runtime contents; every structural gate keyed to `src/animation`/`demo`
sweeps (`proof:demo-no-oversize`, `proof:decomposition`, zone-cohesion,
boundary gates, the depcruise graph) would need test-exclusion carve-outs —
pure gate entropy; one jsdom environment + one recursive include stays a
2-line vitest config; and Vite dev-server module graphs (HMR) stay free of
test-only imports. The edict's own text supports this: tests are the truly
"module-level members" of ONE `test/` tier. The cure owed is symmetry:
`test/demo/` regroups to mirror the demo's areas
(`test/demo/{scenes,instrument,state,app}/…`), and the mirror gains a gate:
every test file's primary import resolves INTO the area it is filed under
(same shape as the zone-mirror premise, now enforced instead of assumed).

### Finding 6 — MINOR (vestigial path geometry): `@/components/custom/` is a two-entry shadcn-era layer; `transport/` splits siblings across semantically-empty `components/` vs `controls/`

**Evidence.** `demo/@/components/` = `{custom/, skeletons/}`;
`custom/` = `{instrument/, CopyButton.vue}` (ls, this audit). The `custom/`
layer existed to oppose `components/ui/` (shadcn), which was deleted at S.C3b
(demo/CLAUDE.md:40). Result: the facility's true path is 5 segments deep
before content (`@/components/custom/instrument/transport/…`). Inside
`transport/`, `components/` (ControlsPaneWrapper, RibbonBar, DemoGlobalChrome
— demo/CLAUDE.md:81) and `controls/` (AnimationControls, PlaybackRibbon, … —
demo/CLAUDE.md:83) are both "components dirs" whose names encode nothing.

**Failure scenario.** Every U restructure wave types and reasons over dead
path segments; new contributors file new leaves by coin-flip between
`components/` and `controls/`; the colocation edict's "can I read this tree?"
global predicate fails at the facility root.

**Proposal.** Collapse the vestige: `@/instrument/` (facility),
`@/skeletons/`, and `CopyButton.vue` re-homed into the shared leaf tier —
`custom/` and the now-single-child `components/` both die. Inside
`transport/`, rename by ROLE: the pane chrome (`components/`) and the tab
panels (`controls/`) become names that state their contract (e.g. `chrome/` +
`panes/`), or fold to one tier if U's transport redesign (lane 17's turf)
dissolves the distinction. Alias updates are mechanical
(`@components` alias narrows or is replaced by `@instrument`).

### Finding 7 — MINOR (library barrel-bypass ambiguity): cross-zone imports mix deep (29) and barrel (20) with no rule

**Evidence.** `src/animation/svg/motion-path.ts:37` imports
`{ CSSKeyframesAnimation } from "../engine"` (barrel) while 29 other
cross-zone sites deep-import zone internals (grep census, this audit).
`proof:no-flat-siblings` clause 2/4 mandates barrels EXIST and are
explicit-named, but nothing states who must use them; `internal/` is
correctly barrel-free by C-5.

**Failure scenario.** A deep import into a sibling zone couples to a file the
zone owner refactors away (the zone's "public surface" gate never fired
because the barrel was bypassed); conversely barrel-imports inside a zone's
own dependency ring re-create the cycle class R broke (the
engine↔group↔waapi ring).

**Proposal.** RULING 1's library half: the zone barrel IS the zone's contract
— cross-zone imports MUST go through the sibling's barrel; intra-zone imports
MUST be deep-relative (self-barrel import = cycle by construction);
`internal/` stays direct-path (C-5 unchanged). Tree-shaking is unaffected
(the lib is Rollup-bundled with `"sideEffects": false`, package.json:18 — a
barrel costs nothing in `dist/keyframes.js`); the win is that the barrel gate
finally guards a surface someone actually crosses. Enforcement: one
dependency-cruiser rule pair (`no-cross-zone-deep`, `no-self-barrel`) folded
into the existing depcruise run — no new script.

### Finding 8 — MINOR (healthy idiom, unwritten): the scoped-vs-utility settlement is exemplary and exists only as folklore

**Evidence.** `@apply` ×11, all in `demo/@/styles/design-idioms.css:94-114`;
zero `@apply`/`@reference` in any SFC; 40 SFCs use scoped blocks as plain
token-consuming CSS; `demo/DESIGN.md` (27L) documents tokens and two utility
families but never states the settlement. `proof:styling-idioms` enforces
class-reference RESOLUTION (scripts/proof-styling-idioms.mjs:395,467) but not
the @apply/@reference confinement.

**Failure scenario.** A contributor follows current Tailwind-v4 docs and adds
`@reference "../../@/styles/style.css"` to an SFC to use `@apply` in a scoped
block — importing the theme graph per-component (build-time cost multiplied
by SFC count) and forking the idiom; nothing reds.

**Proposal.** RULING 4 written into `demo/DESIGN.md` + one grep-clause added
to `proof:styling-idioms`: `@apply` legal only under `@/styles/`;
`@reference` legal nowhere; scoped blocks consume tokens (`var(--…)`) and
plain CSS only. One clause on an existing gate; no new script.

---

## 3. THE RULING SET (the deliverable U enforces)

**R1 — Module = directory; barrel = contract; one door.** Every colocated
module (instrument member, nested scene module like `orbital-drag/`, library
zone) exposes exactly its public members through an explicit-named `index.ts`.
Cross-module imports go through the barrel; intra-module imports are
deep-relative; `export *` is forbidden (already library law —
proof:no-flat-siblings clause 4 — now demo law too). `internal/` (C-5) and
scene dirs consumed only by `scenes.ts` lazy loaders need no barrel (a barrel
must have a crosser to be a contract).
*Gate shape:* dependency-cruiser rulesets (demo + library) — `no-cross-module-deep`,
`no-self-barrel`, `no-star-export`; rides the existing depcruise run.
*Cost audit:* tree-shaking unaffected (lib is bundled, `sideEffects:false`,
package.json:18; demo is app-bundled by rolldown with `advancedChunks`,
vite.config.ts:634); HMR cost of barrels is real but bounded — a barrel
invalidates only its importers, and under R1+R2 barrels are small,
explicit-named, and side-effect-free, so the invalidation frontier is the
module's true consumer set.

**R2 — Laziness lives at the consumer's seam, never in a re-export.** The
sanctioned async boundaries are exactly: (a) scene/router entries
(`app/scene/scenes.ts`), (b) pane/reveal seams inside a mounted view
(`AnimationControls.vue`-class `defineAsyncComponent`), (c) heavy-vendor
bearers (Monaco / highlight.js / three / html2canvas components). A barrel
never wraps `defineAsyncComponent` — re-exporting async-ness makes the
boundary invisible at the call site and unenforceable in the graph.
*Gate shape:* **`proof:chunk-graph`** — post-build static assertion over
`dist/gh-pages/assets/` `from"./…"` edges: entry chunk reaches no vendor-*
except sanctioned commons; no scene chunk statically reaches
vendor-monaco/vendor-highlight/html2canvas; vendor-three only from AmigaScene.
(Finding 1 is the born-RED witness.)

**R3 — The SFC/CSS split is mechanical: 100L style block OR 300L SFC → sibling
sheet; every demo `.css` ≤300L.** The house idiom is
`<style scoped src="./Name.css">` (scoping preserved, the SFC stays a
template+script document, the sheet gets reviewable diffs). The 500L
`.vue`/`.ts` ceiling stands above it (proof:demo-no-oversize).
*Gate shape:* extend `proof:style-file-ceiling` to sweep ALL `demo/**/*.css`
+ add an SFC style-block clause (measure `<style>`-to-EOF share); retire the
`@/styles`-only scope.

**R4 — Utilities in templates; scoped CSS is token-plain.** Tailwind
utilities live in `class=""`; scoped blocks are plain CSS over design tokens;
`@apply` only in the shared idiom sheets (`@/styles/`); `@reference` banned
(per-SFC theme import cost, idiom fork). This codifies the tree's existing,
healthy settlement (§1.5).
*Gate shape:* one grep-clause on `proof:styling-idioms`; ruling text into
`demo/DESIGN.md`.

**R5 — Tests mirror; they do not colocate.** `test/<zone>/` (library) and
`test/demo/<area>/` (demo — NEW) mirror their source trees. A test is a
consumer of a module's surface, not a member of the module; colocation into
`src/`/`demo/` would tax every structural gate with exclusions, split the
vitest environment story, and put test-only edges into the dev-server module
graph, for zero published benefit (`files: ["dist"]`).
*Gate shape:* a mirror clause (each test's primary import resolves into its
filed area) — foldable into `proof:zone-cohesion` or the ci-coverage gate.

**R6 — Shared-tier membership is kind-appropriate, ≥2-consumer, and
TOLERANCE-FREE.** `proof:colocation` (kind + satellite) and
`proof:shared-has-n-consumers` (count) remain the two axes; the `DEFERRED`
tolerance machinery is deleted — exceptions change the rule or move the file.
*Gate shape:* existing gates, minus scripts/proof-colocation.mjs:69-96.

**R7 — No vestigial path segments.** A directory layer must state a contract
(`custom/`, single-child `components/`, and semantically-empty sibling pairs
fail this). The facility collapses to `@/instrument/`.
*Gate shape:* the existing "can I read this tree" keystone absorbs it — plus a
one-time restructure wave; a standing `no-single-child-dir` clause on
`proof:colocation` prevents regrowth.

---

## What U must charter

| # | Imperative |
|---|---|
| 1 | Charter `proof:chunk-graph` (post-build dist-edge assertion) and cure the SpringPhysicsFacet→KeyframesEditor eager deep import via a facet-level `defineAsyncComponent` seam — the 906 KB vendor-highlight leak is the born-RED witness (Finding 1). |
| 2 | Adopt R1: barrels become explicit-named eager contracts; delete the zero-consumer umbrella + strip `defineAsyncComponent` from all barrels; enforce with dependency-cruiser `no-cross-module-deep`/`no-self-barrel`/`no-star-export` for demo AND library (Findings 2, 7). |
| 3 | Burn `proof:colocation`'s DEFERRED map: execute the `gestureSelectSuppression`→utils and `kfEngine`→state-side re-homes in U wave 1, then delete the tolerance machinery (Finding 3). |
| 4 | Extend `proof:style-file-ceiling` to every demo `.css` + add the 100L SFC style-block split clause; split `SpringTarget.vue`'s 200L block to `SpringTarget.css` (Finding 4, R3). |
| 5 | Regroup `test/demo/` into the mirrored area shape and ratify R5 (mirror survives; no source colocation) with the mirror-integrity clause (Finding 5). |
| 6 | Collapse `@/components/custom/` → `@/instrument/` (+ re-home `CopyButton`, `skeletons/`); rename `transport/{components,controls}` to role-stating homes; add the `no-single-child-dir` clause (Finding 6, R7). |
| 7 | Write R4 (utilities-in-template / token-plain scoped / @apply-only-in-idiom-sheets / no @reference) into `demo/DESIGN.md` and add its grep-clause to `proof:styling-idioms` (Finding 8). |
| 8 | Ratify the ruling set R1–R7 as the standing Vue-idiom law in `demo/CLAUDE.md` (one section, replacing folklore), so every future wave inherits the rules, not the archaeology. |
