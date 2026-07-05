# Lane 13 — demo/ first-principles restructure (VERDICT #26)

**Surface:** the WHOLE `demo/` tree — every dir, file, line-count, import edge.
**Method:** static import-graph (`grep`/`wc`/`find`, read-only), glass-ui 4.0.1 export census
(`node_modules/@mkbabb/glass-ui/package.json`), S.D wave-record read
(`docs/tranches/S/waves/S.D.md`, `docs/tranches/S/audit/pass1/research/r4-demo-structure.md`).
**Grounding:** VERDICT #26 (the demo-structure indictment), #7 (superfluous panes), #8 (gesture
legend), #17 (single-option dock elision), #18 (`KfPillTabs.vue?? KF? Pills?`), #24 (fonts/sizes),
#25 (the forgotten panel facility), #27 (glass-ui gaps).

> **The one-sentence finding:** the demo carries the RIGHT decomposition *primitives* (per-scene
> fusion, composables, colocation) but the WRONG *taxonomy* — a literal `@/` root the owner cannot
> read, a vestigial `components/custom/` shadcn-tombstone every import still spells, a 1,561-line
> `styles/` god-drawer, and a control facility shattered across four sibling peers — because S.D
> optimized each move against a born-RED *structural predicate gate* (does file X import ≤1 area?)
> and never once asked whether the resulting tree was *legible*. VERDICT #26 is the gate-blindspot
> lesson (MEMORY: "green source-shape gates miss appearance/interaction/state") recurring on the
> STRUCTURE axis: `proof:app-is-shell` / `proof:shared-has-n-consumers` / `proof:scene-colocated`
> are all GREEN on a tree the owner rejected on sight.

---

## Part 0 — The whole-tree map (mass distribution)

`demo/` = **~33,000 lines** across **~200 source files**, three top-level homes:

| Home | Files | Lines | Owner's word |
|---|---|---|---|
| `demo/@/` (shared library) | ~70 | ~13,900 | "totally half baked and inconsistent"; "@/styles — what the fuck is this?" |
| `demo/app/` (SPA shell) | ~18 | ~2,650 | "wtf is demo/app/chrome?"; "wtf is 90% of the junk in demo/app?" |
| `demo/scenes/` (9 fused scenes) | ~110 | ~16,000 | "why aren't these properly composed into sub-components?" |

`demo/@/` breakdown (the mass the owner smells):

| Subtree | Files | Lines | Note |
|---|---|---|---|
| `components/custom/animation-transport/` | 40 | 5,589 | the control-suite; EMPTY `index.ts` stub (barrel removed) |
| `components/custom/keyframes-editor/` | 15 | 1,960 | Monaco CSS editor |
| `components/custom/keyframe-timeline/` | 13 | 1,481 | draggable timeline |
| `components/custom/editor-shell/` | 10 | 1,346 | shell + hero + share |
| `components/custom/easing-editor/` | 4 | 1,082 | curve editor |
| `components/custom/` singles | 4 | ~380 | CopyButton, GestureLegend, KfPillTabs, useKfPillTabs |
| `state/` | 9 | 1,512 | stores + machine + DFA |
| `styles/` | 3 | **1,561** | `design-idioms.css` **887L**, `style.css` 636L, `brand.css` 38L |
| `composables/` | 3 | 269 | gestureSelectSuppression, useDoubleTap, useDragScrub |
| `utils/` | 4 | 113 | clipboard, iosTextEntry, kfEngine, toastGuard |

**Deepest path = 7 segments:**
`demo/@/components/custom/animation-transport/controls/composables/useTimingFunctionEditor.ts`.
Two of those seven segments (`components/`, `custom/`) carry ZERO information (see F2).

---

## Part 1 — The structural defects

### F1 — `demo/@/` is a literal directory named `@` — the S.D4 "keep it" ruling is the exact green-gate rationalization the owner rejected — **HIGH**

**Evidence.** `demo/@/` is an on-disk dir literally named `@`
(`demo/CLAUDE.md:50-58`). It is NOT a bundler alias — `@components`/`@state`/`@utils`/`@styles`
resolve INTO it (`tsconfig.json:39` `"@components/*": ["./demo/@/components/*"]`;
`vite.config.ts:335`). So a reader sees `@/components/custom/...` on disk but `@components/custom/...`
in imports — the sigil means two different things three inches apart. S.D4 S4 (`S.D.md:355-357`)
considered renaming to `shared/` and **RULED terminally to keep `@/`**: *"every consumer already
spells the short form … a rename would touch every import in the tree for a documentation-only
gain. Alias churn buys nothing — this decision is terminal, not deferred."*

**Root cause.** That ruling is a *documentation-cost* argument — the precise shape of the
gate-blindspot the owner keeps flagging: it optimizes for "no import churn" (a source-diff metric a
gate can see) over "a human can read the tree" (the metric no gate saw). The owner's live reaction
is the falsification: **"demo/@ is totally half baked and inconsistent"** (VERDICT #26). `@` as a
directory name is unreadable — it looks like a scoped-package sigil (`@mkbabb/…`), an alias
placeholder, or a typo, never "the shared library." The S.D4 record even calls the gain
"documentation-only" — and documentation-legibility is exactly what the owner audited.

**Recommendation.** REVERSE S.D4 S4. Rename `demo/@/` → `demo/shared/`, repoint the four aliases
(`@components`→`shared/components`, `@state`→`shared/state`, `@styles`→`shared/styles`,
`@utils`→`shared/utils`) in `tsconfig.json`/`tsconfig.test.json`/`vite.config.ts` — the alias
SPELLING is unchanged for consumers, so this is a **one-dir-rename + three-config-line** move, NOT
the "every import in the tree" churn S.D4 feared (imports already go through the aliases). The
"terminal, not deferred" ruling must be un-ruled: an owner-rejected structure is not terminal.

### F2 — `components/custom/` is a two-level wrapper whose `custom/` segment is a dead shadcn tombstone — **HIGH**

**Evidence.** `demo/@/components/` contains EXACTLY ONE child: `custom/` (`ls demo/@/components/`
→ only `custom`). The `custom/` name is the shadcn-vue `components/ui/` vs `components/custom/`
convention — but `components/ui/` was DELETED at S.C3b (the last menubar island;
`demo/CLAUDE.md:40`). So `custom/` is now the *sole surviving half of a binary distinction whose
other half is gone*. Every one of **28 importing files** spells `@components/custom/...`
(the segment is pure overhead), and it is the reason the deepest path is 7 segments (F0).

**Root cause.** S.C3b deleted `ui/` but never collapsed the now-single-child `custom/` wrapper —
a legacy scar the "no-legacy" charter (VERDICT #28) forbids. No gate measured "is this dir a
single-child pass-through?"

**Recommendation.** Dissolve `custom/`: move its contents up to `demo/shared/components/` (after
F1) and repoint `@components` → `demo/shared/components` (the alias already elides the segment for
consumers, so this is a physical move + one alias-target line). Net: `-1` dead segment on every
path, `@components/animation-transport/…` reads honestly.

### F3 — the control/editor facility is shattered into FOUR sibling peers — this is the "forgotten panel facility" (VERDICT #25) at the STRUCTURE level — **HIGH**

**Evidence.** The animation control panel is ONE facility split across four flat peers under
`components/custom/`: `animation-transport/` (40 files / 5,589L), `keyframes-editor/` (15 / 1,960L),
`keyframe-timeline/` (13 / 1,481L), `easing-editor/` (4 / 1,082L) — **72 files / ~10,100 lines**
with no umbrella. S.D2 S2 *created* this split by carving the old `animation-controls/` monolith
into peers (`S.D.md:171-178`). The peers cross-reference (AnimationControls lazy-loads the
keyframes-editor + timeline panes) but sit as unrelated siblings beside `editor-shell/` and the
loose singles. The owner reads the result as *"It's like we forgot about that facility entirely"*
(#25) and *"Square used to have a proper keyframes, controls … section but that was removed"* (#12).

**Root cause.** S.D2's carve was gated by `proof:shared-has-n-consumers` (each module ≥2 consuming
areas) — a predicate that rewards *breaking things into more independently-shared units* and is
BLIND to whether the units still read as one facility. The monolith was real debt; the fix
over-shot into fragmentation. There is no `index.ts` cohering them (animation-transport's
`index.ts` is an **empty stub**: *"Barrel removed to prevent eager loading … Import components
directly"* — a file that exists only to say "don't use me").

**Recommendation.** Group the four peers under one `components/instrument/` (or `editor/`) module
with a real (type-only + lazy) barrel:
`instrument/{transport, keyframes, timeline, easing, shell}/`. The eager-load hazard the empty
barrel documents is solved idiomatically by `export type` + `defineAsyncComponent` re-exports, not
by deleting the barrel. This makes the "panel facility" a nameable thing again (the substrate
VERDICT #25/#12 want restored to square/spring).

### F4 — `demo/@/styles/` is a 1,561-line global CSS drawer with an 887-line god module — **HIGH**

**Evidence.** `styles/` = `design-idioms.css` **887L** + `style.css` **636L** + `brand.css` 38L.
`design-idioms.css` alone nearly doubles the ≤500L module ceiling the owner re-issued (VERDICT #28,
"no god modules >500L"). r4 already flagged it carries DELETED-rule tombstones
(`design-idioms.css:412,459,545` — `.scale-on-hover — DELETED`, etc.) — era-archaeology the
no-legacy charter forbids. The owner's reaction is the two-word verdict: **"demo/@/styles — what
the fuck is this?"** (#26).

**Root cause.** A single global stylesheet accreted every cross-scene idiom (tab-triggers,
playback buttons, subject hues, gesture-legend styling, drag states) because there was no
colocation discipline for CSS — the inverse of the `.vue` scoped-style colocation the scenes DO
practice. S.D never touched `styles/` (out of its "move files between dirs" scope).

**Recommendation.** Split by lifetime + owner: (a) genuine **global tokens/theme** (Tailwind v4
`@theme`, dark variant, brand) stay in a lean `styles/theme.css` (~global, single home); (b)
**component idioms** (`tab-trigger-*`, `btn-playback-*`, per-widget rules) colocate into the
`<style>` of their owning SFC or a sibling `.css` (the demo already does this split for
`ControlsPaneWrapper.css`/`AnimationControlsGroup.css`); (c) DELETE the tombstone comment-blocks
outright (git is the record). Target: no CSS file >~300L, `styles/` holds only global theme.

### F5 — `demo/app/` mixes shell, cross-scene recipes, and jargon-named chrome — "90% junk" is the density complaint — **MEDIUM**

**Evidence.** `app/` (18 files / ~2,650L) holds: the honest shell (`App.vue` 345L, `main.ts`,
`index.html`, `scene/` 5 files, `transition/` 2 files) PLUS `runtime/` (7 files / 421L of
CROSS-SCENE recipes — `useRafScene`, `useContractAnimGroup`, `useSceneTransport`,
`useSceneVisibilityPause`, `rafConstants`, `loaf-observer`, `useMonacoCancellationGuard`) PLUS
`chrome/` (`ChromeDock` 352L + `MbabbMenu` 206L). r4 (`r4-demo-structure.md:32-39`) proved the
`runtime/` recipes have ZERO app-shell importers — every consumer is a scene. S.D1 S2
(`S.D.md:75-82`) nonetheless RULED they *stay* in `app/runtime/` because "≥2 scene importers = C-23
legitimately shared." The owner's reaction: **"wtf is 90% of the junk in demo/app? Most should be
pruned"** + **"wtf is demo/app/chrome?"** (#26).

**Root cause.** `proof:app-is-shell` clause (i) (`S.D.md:110-113`) explicitly *permits* a file with
≥2 scene consumers to live in `app/runtime/`. That predicate answers "is this misfiled to exactly
one area?" — it CANNOT answer "does `app/` still read as *only* the shell?" So the scene-shared
recipes are gate-legal in `app/` yet conceptually scene-tier. `chrome/` is browser-jargon
("browser chrome") for what is really the app dock + brand menu.

**Recommendation.** (a) Move the scene-shared recipes out of `app/runtime/` into
`shared/composables/` (uniform with `useDragScrub`/`gestureSelectSuppression`/`useDoubleTap`, which
ARE exactly this: cross-scene primitives) — leaving `app/` holding ONLY app-lifetime code
(App/main/scene-machine-binding/transition + the two genuine app diagnostics). (b) Rename
`chrome/` → `dock/` (it holds the dock + its @mbabb menu — coordinate with lane 08 which owns the
dock's glass-ui rebuild). `proof:app-is-shell` clause (i) must be TIGHTENED: a file with no `app/`
importer belongs in `shared/`, not `app/runtime/`.

### F6 — the loose `components/custom/` singles are a grab-bag, two of them owner-rejected or glass-ui-owned — **MEDIUM**

**Evidence.** Four files sit loose at `components/custom/` top level:
- `CopyButton.vue` — **genuinely shared** (5+ real consumers: EasingSidebar, MotionPathTarget,
  StartingStyleTarget, KeyframeCard, KeyframesEditor). Keep as a shared leaf.
- `GestureLegend.vue` (128L) — 4 scene consumers (Square/Cube/Amiga/Spring `Target`s), but the
  owner **REJECTED the gesture-legend layer wholesale** (VERDICT #8: *"remove all elements like
  this"*). It should be DELETED with its four call-sites (disposition owned by lane 07-prune; noted
  here because it EXITS the shared tree).
- `KfPillTabs.vue` + `useKfPillTabs.ts` — 2 consumers (SpringSidebar, AnimationControls). This is a
  DM-5 contingency REINVENTION of glass-ui tabs (`KfPillTabs.vue:2-12` header: replaces
  `SegmentedTabs` because glass-ui 4.0.1 emits `aria-orientation` unconditionally). The owner:
  **"KfPillTabs.vue?? KF? Pills? Why aren't these just glass-ui components?"** (#18). glass-ui 4.0.1
  DOES export `./tabs` and `./toggle-group` (census below).

**Root cause.** These leaves have no home because there is no "shared primitives" module — they
pile at the `custom/` root. And `KfPillTabs` embodies the anti-pattern the owner named: a
glass-ui gap (the aria bug) worked around by a permanent demo-owned reinvention with a `Kf`-prefixed
name, instead of being DELINEATED as a glass-ui gap (VERDICT #27: *"Delineate our gaps, and
glass-ui's gaps"*).

**Recommendation.** (a) After F2, put genuine shared leaves in `shared/components/` root
(CopyButton). (b) DELETE GestureLegend (lane 07). (c) `KfPillTabs` → **glass-ui gap handoff**: the
correct fix is glass-ui's `SegmentedTabs`/`Tabs` emitting a conditional `aria-orientation`; file it
as a BG/BH glass-ui ask and, until it lands, keep the shim but RENAME it off the `Kf`-vanity prefix
(`AriaSafeTabs` or fold into the instrument module) — it is not a permanent demo primitive.

### F7 — no `skeletons/` tier anywhere; one inline loading span for the whole SPA — **MEDIUM**

**Evidence.** The owner's model names *"sub-components/composables/skeletons/constants — recursively"*
(#26). `grep -rli skeleton demo` → **zero** files. The only loading surface is the `<Suspense>`
`#fallback` in `App.vue:84-88` — a bare `<span>Loading scene…</span>` with `animate-pulse`. Every
lazy scene (9 of them) and every lazy pane (Monaco keyframes/timeline) shows this one generic span.

**Root cause.** Skeletons were never a tier in the demo's vocabulary — the demo has
components + composables + constants (`<name>Keys.ts`) but no loading-placeholder discipline, so
the async boundaries all degrade to one text span. This is a real gap, not a misplacement.

**Recommendation.** Introduce a `skeletons/` convention: a shared `SceneSkeleton.vue` (a
glass-ui `glass-panel`/`Card` shimmer matching the stage plate) for the Suspense fallback, and
per-pane skeletons for the Monaco-bearing panes. Fits the "recursively into … skeletons" directive
and removes the jarring text-flash on every scene switch (relates to VERDICT #19 perceived-perf).

### F8 — inconsistent sub-dir taxonomy + scattered constants inside the biggest module — **LOW**

**Evidence.** `animation-transport/` sub-dirs are named inconsistently: `components/` (sub-SFCs),
`controls/` (also sub-SFCs, but with its OWN nested `composables/` → the 7-deep path),
`composables/` (module-level). Constants are scattered: `injectionKeys.ts` (25L),
`animationDescriptions.ts` (131L), plus per-file consts — no `constants/` tier. And
`components/DemoGlobalChrome.vue` is a *document-level app singleton* misfiled inside the transport
module (its only non-self consumer is `AnimationControlsGroup.vue`, but it manages global toasts /
chrome — app-shell concern, not transport).

**Root cause.** The P2-1 carve preserved the monolith's internal ad-hoc folders verbatim
(`S.D.md:202-206` explicitly reframed the ControlsPaneWrapper split as "import-neutral, NOT a logic
decomposition" — i.e. the internal taxonomy was deliberately left untouched). So the module's
inside was never held to the owner's recursive `{components, composables, skeletons, constants}`
shape.

**Recommendation.** Normalize each component-module to the owner's recursive shape:
`Component.vue` + `components/` + `composables/` + `skeletons/` + `constants.ts` (fold
injectionKeys + descriptions), flattening the double-nested `controls/composables/` back to one
`composables/` tier. Move `DemoGlobalChrome.vue` to `app/` (it is app chrome).

### F9 — scenes ARE decomposed, but heavy scoped-CSS inflates the entries; that is the honest read of "compose into sub-components" — **LOW/INFO**

**Evidence.** The owner asks *"demo/scenes — why aren't these properly composed into
sub-components?"* (#26). But the census shows they mostly ARE: each scene = `<Name>Scene.vue` +
`<Name>Target.vue` + `use<Name>Demo.ts` + `<name>Keys.ts`, with the fat ones delegating to
sub-units (`SquareScene.vue` → `SquareInstrument.vue` + `useSquareDemo` + `useSquareKeyboard`;
`cube/` has `matrix-editor/` + `orbital-drag/` sub-packages). The R.W5 fusion (r4 called it
"genuinely clean") holds. What inflates the entries is **scoped CSS**: `SquareScene.vue` is 469L but
**200+ of those are a `<style scoped>` block** (`SquareScene.vue:309-469`); the split is
16,479 `.vue` lines vs 16,521 `.ts+.css` lines. So the "not composed" smell on the biggest scenes
is really "the SFC carries a novel-length stylesheet."

**Root cause.** No discipline pushing large scoped-CSS blocks into sibling `.css` (the demo does
this only twice — `ControlsPaneWrapper.css`, `AnimationControlsGroup.css`). The scenes with heavy
motion CSS (square, cube, sequence-target) inline it all.

**Recommendation.** For any SFC whose `<style>` exceeds ~120L, split to a sibling
`<Name>.css` (the existing import-neutral pattern). This is polish, NOT the headline — the scenes'
COMPONENT decomposition is sound; do not "fix" it into contrivance (the owner explicitly warned
"without contrivance"). The real scene-level defects are FUNCTIONAL (VERDICT #1/#9/#12/#20/#21/#23)
and owned by lanes 02-07.

---

## Part 2 — glass-ui 4.0.1 census (delineating our gaps vs theirs — VERDICT #27)

glass-ui 4.0.1 (`node_modules/@mkbabb/glass-ui/package.json`) exports **~90 subpaths**. Directly
relevant to demo structure (things the demo currently hand-rolls or scatters):

| Owned by glass-ui TODAY | Demo currently does | Disposition |
|---|---|---|
| `./tabs`, `./toggle-group` | `KfPillTabs.vue` reinvention (F6) | glass-ui gap = conditional `aria-orientation`; hand back |
| `./dock` (GlassDock, DockIconButton, DockSelectTrigger) | `ChromeDock.vue` composes it (352L wrapper) | KEEP wrapper thin; dock render bugs = lane 08 / glass-ui |
| `./instrument-chassis` (InstrumentChassis) | the control panes hand-roll their chassis | evaluate as the panel-facility shell (VERDICT #7 "remove superfluous pane") |
| `./glass-panel`, `./card`, `./sheet`, `./drawer` | mixed (some `Card`, some ad-hoc) | standardize stage/panel plates on these |
| `./slider`, `./number-field`, `./select`, `./labeled-field` | `AnimationControlsControls.vue` mixes | standardize control widgets |
| `./sortable-list` | `keyframe-timeline` + asset-layer hand-roll drag | evaluate for timeline/asset rows |
| `./motion`, `./motion-core`, `./motion-curves`, `./easing` | demo hand-rolls easing preview | evaluate for easing scene (lane 05) |
| `./timeline` | `keyframe-timeline/` (13 files) | evaluate overlap |

**Our genuine gaps (keep demo-owned):** the KEYFRAMES engine-specific editors (Monaco CSS editor,
the AnimationGroup transport, the DFA control-surface machine) — these dogfood keyframes.js itself
and have no glass-ui equivalent. **glass-ui's gaps to file (BG/BH):** conditional
`aria-orientation` on tabs (F6); anything lane 08 finds in the dock render.

---

## Part 3 — What D1/D2/D3/D4 got RIGHT vs where they stopped short

| Wave | Got RIGHT | Stopped short (the owner's rejection) |
|---|---|---|
| **S.D1** (app/ partition) | Evicted `cubeTransformStore` to `scenes/cube/` (real mis-home); sub-zoned `app/` into `scene`/`transition`/`runtime`; renamed the `useSceneMachineApp` collision → `…ShellBinding`. The app-shell now HAS sub-structure. | Ruled the 7 scene-shared recipes STAY in `app/runtime/` on a "≥2 scene consumers" predicate (F5) — leaving `app/` reading as a mixed drawer the owner called "90% junk." Never renamed `chrome/` (jargon). The gate (`proof:app-is-shell`) certifies "not misfiled to one area" but not "reads as only the shell." |
| **S.D2** (the @/ carve) | De-monolithed the 74-file `animation-controls/` fiat (real debt); hoisted state to `@/state/` (a first-class peer — correct); colocated single-consumer modules (CSSPasteDialog, easing cluster, cube cluster). The state hoist is genuinely good. | OVER-fragmented the control facility into 4 unrelated sibling peers (F3) — the "forgotten panel facility" (#25) at the file level; left `components/custom/` vestigial (F2); left `KfPillTabs` as a permanent `Kf`-vanity reinvention (F6); never touched `styles/` (F4) or the internal `{components vs controls}` taxonomy (F8). The `proof:shared-has-n-consumers` predicate REWARDS fragmentation and is blind to cohesion. |
| **S.D3** (playground → compose) | FOLDED the dead standalone playground as `scenes/compose/` — killed its blank-build footgun, un-pinned `outDir` landmine, 9.6MB dist debris. Structurally correct: compose is now a real fused scene, `useComposeDemo.ts` from birth (C-17). | The owner then rejected compose *itself* wholesale (VERDICT #23: *"just straight up remove this crap … motion-path, morph, and compose likely need to just be pruned"*). So the fold was structurally clean but preserved a scene the owner wants GONE — the disposition (prune) is lane 07's; the fold's structure work isn't wasted (it's a clean delete now). |
| **S.D4** (taxonomy + docs truth) | Landed the `use<Name>Demo` convention fleet-wide; regenerated `demo/CLAUDE.md` against the real tree; `proof:claude-paths-live` keeps the doc honest. Naming convergence is real. | **RULED `@/`→`shared/` "terminal, keep @/"** (F1) — the single most-visible structural decision, made on a "documentation-only gain / alias churn" cost argument, and the owner rejected the tree's legibility on sight. This is the clearest case of a green-gate rationalization overriding taste. D4's own "docs truth" mission is undercut by a root dir no human reads as truth. |

**The through-line:** every S.D wave shipped a born-RED *structural predicate* gate
(`proof:app-is-shell`, `proof:shared-has-n-consumers`, `proof:scene-colocated`,
`proof:claude-paths-live`). Each predicate answers a LOCAL question ("is file X in the right dir by
import-count?") and every one is GREEN. NONE answers the GLOBAL question the owner asked: "can I read
this tree?" VERDICT #26 is the gate-blindspot lesson on the structure axis — the S.D taxonomy is
correct-by-predicate and rejected-by-owner.

---

## The TARGET tree (proposed `demo/` layout)

```
demo/
├── app/                              # ONLY app-lifetime code (F5)
│   ├── App.vue · main.ts · index.html
│   ├── DemoGlobalChrome.vue          # ← moved from transport (F8): document singletons/toasts
│   ├── dock/                         # ← renamed from chrome/ (F5); thin glass-ui/dock wrappers
│   │   ├── AppDock.vue  (was ChromeDock)
│   │   └── MbabbMenu.vue
│   ├── scene/                        # machine↔shell↔route bridge (unchanged — D1 got this right)
│   │   ├── scenes.ts · sceneExposedApi.ts · router.ts
│   │   ├── useSceneMachineShellBinding.ts · useSceneMachineRouterBinding.ts
│   ├── transition/                   # useSceneSwap · useSceneTransition (unchanged)
│   ├── diagnostics/                  # loaf-observer · useMonacoCancellationGuard (app-lifetime only)
│   └── public/
│
├── shared/                           # ← renamed from @/ (F1); alias spellings unchanged
│   ├── components/                   # ← custom/ dissolved (F2)
│   │   ├── instrument/               # ← the ONE panel facility (F3), was 4 sibling peers
│   │   │   ├── index.ts              # real lazy/type barrel (not an empty stub)
│   │   │   ├── transport/            # AnimationControlsGroup, TransportDock, controls/…
│   │   │   │   ├── components/ · composables/ · skeletons/ · constants.ts   (F8: flattened, +skeletons)
│   │   │   ├── keyframes/            # was keyframes-editor/
│   │   │   ├── timeline/             # was keyframe-timeline/
│   │   │   ├── easing/               # was easing-editor/
│   │   │   └── shell/                # was editor-shell/ (EditorShell, hero, share)
│   │   ├── skeletons/                # ← NEW tier (F7): SceneSkeleton.vue, PaneSkeleton.vue
│   │   ├── CopyButton.vue            # genuine shared leaf (F6)
│   │   └── AriaSafeTabs.vue          # was KfPillTabs — renamed, pending glass-ui gap (F6)
│   ├── composables/                  # ALL cross-scene primitives in ONE home (F5)
│   │   ├── gestureSelectSuppression.ts · useDoubleTap.ts · useDragScrub.ts
│   │   └── useRafScene.ts · useContractAnimGroup.ts · useSceneTransport.ts
│   │       · useSceneVisibilityPause.ts · rafConstants.ts   # ← moved from app/runtime (F5)
│   ├── state/                        # unchanged (D2 got this right)
│   ├── styles/                       # ONLY global theme (F4)
│   │   ├── theme.css                 # tokens + Tailwind @theme + dark variant (was style.css)
│   │   └── brand.css                 # brand-mark (kept)
│   │   # design-idioms.css (887L) → component idioms colocated into their SFCs; tombstones deleted
│   └── utils/                        # unchanged
│
└── scenes/                           # 9 fused scenes — decomposition KEPT (F9); heavy <style> → sibling .css
    ├── amiga/ · cube/ · easing/ · morph/ · motion-path/ · sequence/ · spring/ · square/ · compose/
        # (compose disposition = lane 07 prune; motion-path/morph = lanes; NOT a structure call)
```

## Migration map (moves + gate anchors)

| # | Move | Gate anchor to follow/repoint |
|---|---|---|
| M1 | `demo/@/` → `demo/shared/` (dir rename); repoint 4 alias targets in tsconfig×2 + vite | `proof:claude-paths-live` (demo/CLAUDE.md tree regen); un-rule S.D4 S4 |
| M2 | dissolve `components/custom/` → `shared/components/`; `@components` target -1 segment | `proof:scene-colocated`, `proof:shared-has-n-consumers` (walkers re-root) |
| M3 | 4 editor peers → `shared/components/instrument/{transport,keyframes,timeline,easing,shell}/` + real barrel | NEW `proof:one-facility` (assert the 4 live under one module + a resolving barrel) |
| M4 | `styles/design-idioms.css` split: global→`theme.css`, idioms→owning SFCs; delete tombstones | NEW `proof:no-god-css` (no CSS >~300L; no `— DELETED` tombstones) |
| M5 | `app/runtime/{useRafScene,useContractAnimGroup,useSceneTransport,useSceneVisibilityPause,rafConstants}` → `shared/composables/` | TIGHTEN `proof:app-is-shell` clause (i): no-`app/`-importer ⇒ not in `app/` |
| M6 | `app/chrome/` → `app/dock/`; `ChromeDock`→`AppDock`; `DemoGlobalChrome`→`app/` | `proof:app-is-shell` (path-swap), demo-driver `SCENE_GATE_META` |
| M7 | `KfPillTabs`→`AriaSafeTabs` (rename) + file glass-ui aria gap; DELETE `GestureLegend` (lane 07) | NEW `proof:no-vanity-prefix` (no `Kf`-prefixed demo primitive); lane-07 prune gate |
| M8 | add `shared/components/skeletons/`; wire `SceneSkeleton` into App.vue Suspense fallback | NEW `proof:has-skeletons` (Suspense fallback ≠ bare text span) |
| M9 | per-module recursive normalize `{components,composables,skeletons,constants}`; flatten `controls/composables/` | `proof:one-facility` clause; ≤500L module ceiling |

Ordering: M1→M2 first (root/alias, everything rides them), then M3/M5/M6 (moves), then
M4/M8/M9 (splits/additions), M7 rides lane 07. Every move is import-alias-mediated, so source
churn is config-line-dominated (the S.D2/P2-1 same-commit-atomicity discipline applies).

---

## T recommendations

1. **Rename `demo/@/` → `demo/shared/` (reverse S.D4 S4).** · Scope: dir rename + 4 alias targets
   (tsconfig×2, vite), regen `demo/CLAUDE.md`. · Gate: `proof:claude-paths-live` green on the
   `shared/` tree AND a new clause forbidding a literal `@` directory. · Size **S**.

2. **Dissolve the vestigial `components/custom/` wrapper.** · Scope: hoist `custom/` contents to
   `shared/components/`, repoint `@components` -1 segment. · Gate: `proof:scene-colocated` +
   `proof:shared-has-n-consumers` re-root green; grep asserts no `components/custom` path survives.
   · Size **S**.

3. **Cohere the 4 editor peers into one `components/instrument/` facility with a real lazy barrel.**
   · Scope: move transport/keyframes/timeline/easing/shell under `instrument/`, author a
   `export type`+`defineAsyncComponent` barrel (kills the empty-stub `index.ts`). · Gate: new
   `proof:one-facility` — the 4 sub-modules resolve through one barrel with no eager heavy import
   (Monaco/highlight.js still lazy). · Size **L**.

4. **Break up `styles/` — global theme only; colocate component idioms; delete tombstones.** ·
   Scope: split `design-idioms.css`(887L)/`style.css`(636L) into `theme.css` + per-SFC idioms;
   remove DELETED-block comments. · Gate: new `proof:no-god-css` (no demo CSS file >~300L; zero
   `— DELETED`/`REMOVED` tombstone blocks). · Size **M**.

5. **Empty `app/` of scene-shared recipes; tighten the shell predicate.** · Scope: move the 5
   `app/runtime/` cross-scene recipes → `shared/composables/`; leave only app-lifetime diagnostics.
   · Gate: `proof:app-is-shell` clause (i) tightened — a file with NO `app/` importer reds. · Size
   **S**.

6. **Rename `app/chrome/` → `app/dock/`; relocate `DemoGlobalChrome` to `app/`.** · Scope: dir +
   component rename (`ChromeDock`→`AppDock`), one file move. · Gate: `proof:app-is-shell` path-swap;
   grep asserts no `chrome/` dir. · Size **S**. (Coordinate with lane 08 dock rebuild.)

7. **De-vanity `KfPillTabs` → `AriaSafeTabs` and file the glass-ui aria gap.** · Scope: rename the
   shim, write the BG/BH glass-ui ask (conditional `aria-orientation` on Tabs/SegmentedTabs), plan
   its retirement. · Gate: new `proof:no-vanity-prefix` (no `Kf`-prefixed demo component); glass-ui
   gap logged in the delineation doc (VERDICT #27). · Size **S**.

8. **Introduce a `skeletons/` tier; replace the bare Suspense text-flash.** · Scope: `SceneSkeleton`
   (glass-panel shimmer) + pane skeletons; wire into `App.vue:84` fallback + lazy-pane boundaries.
   · Gate: new `proof:has-skeletons` — the Suspense fallback renders a skeleton component, not a raw
   text span. · Size **M**.

9. **Normalize every component-module to the recursive `{components,composables,skeletons,constants}`
   shape; flatten `controls/composables/`.** · Scope: fold `injectionKeys`+`animationDescriptions`
   into `constants.ts`; collapse the double-nested composables tier (kills the 7-deep path). · Gate:
   `proof:one-facility` depth clause (≤6 path segments under `shared/`; each module carries a
   `constants.ts`). · Size **M**.

10. **Split heavy scoped `<style>` blocks (>~120L) into sibling `.css` — polish, no contrivance.** ·
    Scope: `SquareScene`/`CubeTarget`/`SequenceTarget` and peers → `<Name>.css` (the existing
    import-neutral pattern); do NOT over-decompose the (already-sound) scene COMPONENT graph. · Gate:
    advisory tripwire (no `.vue` `<style>` >~120L) — observe-only, not blocking. · Size **S**.
