# Lane 15 — app-prune: census of `demo/app/` (VERDICT #26 — "wtf is 90% of the junk in demo/app?
Most should be pruned"; "wtf is app/chrome?")

**Charter.** Census every file under `demo/app/` (incl. `scene/`, `transition/`, `runtime/`,
`chrome/` — the S.D1 partition): what each does, who consumes it, whether it earns existence.
Deliver a PRUNE list with dead/redundant evidence, a KEEP list with justification, and the target
`app/` shell shape.

**Method.** Read all 18 source files under `demo/app/` in full (2,290 lines). Cross-checked every
file against its real consumers with `grep`/import-graph tracing across `demo/scenes/` and
`demo/@/`, then against the automated structural gate `proof:app-is-shell` (a static import-graph
walk purpose-built to catch exactly this class of claim — mis-homed single-consumer files, stale
relative imports, stray root files). Ran it live on this tree. Cross-referenced lane 07
(prune-triage: compose/motion-path/morph) and lane 08 (dock-system) for consequences that land
inside `app/` files without duplicating their analysis.

---

## F1 — The literal reading of #26 does not survive a file-by-file audit: zero files in `demo/app/` are dead, orphaned, or single-purpose-less

Ran the gate that exists precisely to test this claim:

```
$ node scripts/proof-app-is-shell.mjs
  ✓ [no-mis-home] no demo/app/ file is imported by exactly one non-app area
  ✓ [no-stale-depth] every relative import under demo/app/ resolves on disk
  ✓ [shell-structural] demo/app/ root holds only the shell files + scene/·transition/·runtime/·public/·chrome/
  · [observed tripwire] App.vue is 346 lines
proof:app-is-shell — PASS
```

Independently verified every one of the 18 source files by tracing its actual import edges (not
the gate's summary — the raw grep census):

| File | Lines | Real consumers (grep-verified) | Purpose |
|---|--:|---|---|
| `App.vue` | 345 | root (mounted by `main.ts`) | shell: dock + editor-shell + scene host `<Suspense>` |
| `main.ts` | 48 | Vite entry (`index.html` `<script src>`) | module-graph root; engine warm-up; router mount |
| `chrome/ChromeDock.vue` | 352 | `App.vue` | top scene-switcher + controls-tab dock |
| `chrome/MbabbMenu.vue` | 206 | `App.vue` (via ChromeDock `#items` slot) | `@mbabb` dropdown (share/dark-mode/brand/attribution) |
| `scene/scenes.ts` | 287 | `App.vue`, `router.ts`, both machine bindings | scene registry + icons + `warmScene`/`sceneIndex` |
| `scene/sceneExposedApi.ts` | 34 | `App.vue`, `useSceneMachineShellBinding.ts` (type); structurally satisfied by all 9 `<Name>Scene.vue` `defineExpose()` calls | the scene↔shell contract type |
| `scene/router.ts` | 60 | `main.ts` | hash router, **routes generated from `scenes.ts`** (no second list) |
| `scene/useSceneMachineRouterBinding.ts` | 136 | `App.vue` | route⇆machine reconcile (1 reader, 1 writer, echo guard) |
| `scene/useSceneMachineShellBinding.ts` | 252 | `App.vue` | machine⇆shell reconcile (adapter bind, SCENE_READY, play routing) |
| `transition/useSceneSwap.ts` | 54 | `App.vue`; unit-tested (`test/demo/e-w1-encapsulation.test.ts`) | no-VT SpringProgress cross-dissolve fallback |
| `transition/useSceneTransition.ts` | 95 | `App.vue` | native View Transition dispatch + directional type |
| `runtime/useRafScene.ts` | 122 | `scenes/easing/useEasingDemo.ts`, `scenes/spring/useSpringDemo.ts` | consolidated raw-rAF loop recipe (kills a 2-site bug-duplication class) |
| `runtime/useSceneVisibilityPause.ts` | 52 | 6 scene composables (cube/amiga/square/easing/spring/sequence) directly + `useRafScene.ts`; unit-tested | tab-hidden pause/resume, "only resume what IT paused" |
| `runtime/rafConstants.ts` | 15 | `scenes/easing/useEasingDemo.ts`, `scenes/spring/useSpringHotPath.ts` | one shared readout-cadence constant |
| `runtime/useContractAnimGroup.ts` | 77 | easing/spring/sequence demos | shared bottom-bar transport-host placeholder group |
| `runtime/useSceneTransport.ts` | 39 | easing/spring/sequence demos | machine-derived play/pause/toggle projection |
| `runtime/loaf-observer.ts` | 83 | `main.ts` (dev-only dynamic import) | Long-Animation-Frame perf attribution |
| `runtime/useMonacoCancellationGuard.ts` | 33 | `App.vue` | swallow Monaco's benign `"Canceled"` rejection |

**Every file has ≥1 live, traced consumer.** None is orphaned; none duplicates a sibling; the
five `runtime/` "recipes" are cross-scene shared-by-design (2–6 consumers each — exactly the
`proof:app-is-shell` clause (i) carve-out), not speculative abstraction. The "90%" reading of #26
does not locate to `demo/app/` as literal dead weight — it locates elsewhere (see F2–F4).

## F2 — The real defect behind "wtf is this": provenance-comment bleed drowns the signal

Measured comment-vs-code density per file (`grep -c '^\s*(//|/\*|\*|<!--)'` vs total, excluding
blanks):

```
demo/app/runtime/rafConstants.ts            total=15  comment=13  code≈1    (87% comment)
demo/app/main.ts                            total=48  comment=30  code≈15   (62% comment)
demo/app/transition/useSceneSwap.ts         total=54  comment=30  code≈20   (56% comment)
demo/app/transition/useSceneTransition.ts   total=95  comment=55  code≈35   (58% comment)
demo/app/runtime/useRafScene.ts             total=122 comment=67  code≈44   (55% comment)
demo/app/scene/useSceneMachineShellBinding.ts total=252 comment=107 code≈119 (42% comment)
```
Aggregate across all 18 files: **825 comment lines / 2,290 total (36%)**, leaving ≈1,218 real code
lines — the shell's true payload is roughly half the byte count the reader has to wade through.

`runtime/rafConstants.ts` is the reductio: **one exported line** (`export const
PROGRESS_READOUT_HZ = 6;`) wrapped in 13 lines of provenance prose ("R.W5 B.3 — kills the
`PROGRESS_READOUT_HZ` duplication…", "root-level constant module (not a Vue composable)…"). The
constant and its rationale are both legitimate — the ratio is the tell.

The deeper pattern: comments across `app/` cite **40+ distinct internal wave/tranche codes** as
load-bearing identifiers a reader is expected to resolve — `D9`, `R.W5`, `a11`, `J.W2`, `J.W0.S3`,
`Q.WC3`, `K.W4`, `C.5`, `BLK-8`, `B.W4`, `S.G2`, `S.D3`, `S.D1`, `D8`, `C-4`, `a23`, `S.F1`,
`H.W7.S1c`, `H.W11.S4`, `B.W3`, `WV-W1-MED-5`, `WV-W1-LOW-1`, `WV-W1-HIGH-2`, … (full tally in the
probe). None of these resolve to anything inside the shipped repo — they are pointers into a
private tranche-history the reader (the owner, a contributor, an AI agent auditing cold) does not
have open. A 352-line `ChromeDock.vue` is 22% comment-by-line-count but reads as much heavier
because a large fraction of that prose is archaeology ("the D9 race re-surfaced under the J.W7c U1
golden-proportion dock…") rather than a plain statement of current behavior. **This — not dead
code — is the mechanism that produces "wtf is 90% of the junk in demo/app."** The code underneath
is tight, tested, and gate-verified; the presentation is not.

## F3 — `chrome/` is the one item #26 names by exact path, and the name is genuinely ambiguous

`chrome/` holds exactly two files: `ChromeDock.vue` (the top scene-switcher dock) and
`MbabbMenu.vue` (the `@mbabb` brand dropdown). "Chrome" here means UI chrome (à la browser-chrome
terminology) — but paired with a file literally named `ChromeDock.vue` inside a project whose demo
runs *in* the Chrome browser, the term reads as a stray reference to the browser, not a design
vocabulary word. This is a plausible, freestanding explanation for the owner's specific "wtf is
app/chrome?" (independent of, and compounding, lane 08's dock-defect findings — a confusingly
named directory holding a dock that also visibly misbehaves is a compounding, not additive, "wtf").
`ALLOWED_ROOT_DIRS` in `scripts/proof-app-is-shell.mjs:65` hard-codes `"chrome"` as a legal
sub-zone name, so a rename is a two-file-move-plus-one-gate-constant change, not a structural one.

Lane 08 is independently recutting `ChromeDock.vue`/`TransportDock.vue` onto a "compass / transport"
vocabulary (`DockSection`/`rail-core`/`nav`). If that recut lands, the directory and file names
should follow the same vocabulary (e.g. `app/dock/` holding a `DockCompass.vue` + `MbabbMenu.vue`)
rather than leaving the new component vocabulary sitting inside an old, ambiguous folder name.

## F4 — Known, precise future-dead-code inbound from lane 07's PRUNE ruling (evidence, not speculation)

Lane 07 rules `scenes/compose/` PRUNE-OUTRIGHT and `scenes/motion-path/` + `scenes/morph/`
FUSE-INTO-ONE `scenes/svg/`. Both rulings reach into `demo/app/` files census'd here; traced the
exact lines that go dead the moment those rulings land (none are dead **today** — they are real,
live, wired-through — this is a forward manifest, not a current-state finding):

- **`scene/scenes.ts`** — the `compose` descriptor (`:242-251`, 20L) + its `ComposeIcon` import
  (`:25`) + `COMPOSE_SUPER_KEY` import (`:42`) die outright with compose. The `motion-path`
  descriptor (`:200-214`) + `morph` descriptor (`:215-231`) + their icon/superKey imports
  (`:21-22`, `:30-31`) collapse into one `svg` descriptor. Net: 287L → roughly 230-250L, 9 scene
  entries → 7.
- **`chrome/ChromeDock.vue:4,46`** — the `Layers` icon import and its `TAB_ICONS.Layers` registry
  entry exist for exactly one reason: `controlSurfaceDFA.ts:197`'s `assets: { …, icon: "Layers" }`
  tab, which is compose's Assets-panel tab and nothing else (traced: `assets` is not a control
  surface any other scene projects). The moment compose is pruned, this import + registry line are
  dead code inside a file this lane already read in full — flagged here so the T implementer does
  not have to re-derive it.
- **`scene/router.ts` needs ZERO manual edit either way** — routes are generated from
  `allScenes` (`router.ts:24`, "a new scene in scenes.ts gets its route for free — no second list
  to drift"). This is the S.D1/R.W5 design paying off exactly at the moment T needs it: worth
  citing as a KEEP-as-is exemplar, not just silence.
- `scene/sceneExposedApi.ts`, both machine bindings, and every `runtime/` file are **structurally
  indifferent** to which scenes exist (they operate over the registry/contract, not scene
  identities) — zero edits required there under either lane-07 ruling.

## F5 — One scope-creep flag worth an explicit owner call (not a firm PRUNE — lower confidence)

`MbabbMenu.vue` mixes two registers in one dropdown: product chrome (Share, Dark mode) and a
personal-brand toggle (the "ppmycota" row, `:55-66`) that flips `ppMode`
(`getStoredAnimationGroupControlOptions(...).ppMode`) — a flag consumed across
`scenes/cube/CubeScene.vue`, `scenes/cube/CubeTarget.vue`, `scenes/easing/EasingHeroStage.vue`,
`@/components/custom/easing-editor/{EasingCurveCanvas,EasingSelect}.vue`, and three demo
stylesheets. It is not dead (5+ live consumers), and the owner (this repo's author) may well want
their own brand mark in their own demo — but it is exactly the class of decorative,
library-orthogonal element the VERDICT repeatedly rules out elsewhere (#2 kf-source-egg, #8 gesture
legends, #13 curve telemetry, #15 Gallery button: "remove all elements like this"). Flagged for an
explicit keep/cut call rather than assumed either way — I found no VERDICT line naming it directly,
so this is NOT folded into the PRUNE list below.

---

## Target `app/` shell shape

The current shape is structurally correct and gate-enforced (`proof:app-is-shell`) — the target is
the SAME shape, not a rewrite, with three concrete moves:

```
demo/app/
├── App.vue · main.ts · index.html         # unchanged shell root
├── dock/                                   # RENAMED from chrome/ (F3) — follows lane 08's
│   ├── DockCompass.vue                     #   compass/transport vocabulary if/when that recut
│   └── MbabbMenu.vue                       #   lands; else chrome/ stays but the gate constant
│                                           #   and this doc both admit the ambiguity either way
├── scene/                                  # unchanged concern (scenes.ts shrinks per F4; the
│   ├── scenes.ts                           #   compose descriptor removed, motion-path+morph
│   ├── sceneExposedApi.ts                  #   fused to one `svg` descriptor — a data edit, not
│   ├── router.ts                           #   a structural one; router.ts needs NO edit)
│   ├── useSceneMachineRouterBinding.ts
│   └── useSceneMachineShellBinding.ts
├── transition/                             # unchanged
│   ├── useSceneSwap.ts
│   └── useSceneTransition.ts
└── runtime/                                 # unchanged
    ├── useRafScene.ts · useSceneVisibilityPause.ts · rafConstants.ts
    ├── useContractAnimGroup.ts · useSceneTransport.ts
    └── loaf-observer.ts · useMonacoCancellationGuard.ts
```

No file moves out of `app/` into `scenes/*` or `@/` (that would fail `proof:app-is-shell` clause
(i) — every file here is either shell-private or genuinely ≥2-consumer shared, verified above). No
new subdirectory is warranted — `transition/`'s 2 files and `runtime/`'s 7 are each a cohesive,
independently-testable concern; collapsing them into `scene/` would just make one bigger junk
drawer, trading a legible partition for a shorter tree.

## KEEP list (all 18 files) — justification

Every file in F1's table is KEEP. Justification is the table itself: a traced, non-speculative
consumer (or, for `App.vue`/`main.ts`, root status) plus a single, undiluted responsibility. Three
files carry a note beyond "keep as-is":

- `scene/scenes.ts` — KEEP, but its compose/motion-path/morph entries are DATA that changes shape
  under lane 07's ruling (F4). The file itself, its registry pattern, and its `warmScene`/
  `sceneIndex` exports are sound and untouched.
- `chrome/ChromeDock.vue` — KEEP the file; drop the `Layers`/`assets` wiring the moment compose is
  pruned (F4); the deeper dock recut is lane 08's, not re-litigated here.
- `runtime/rafConstants.ts` — KEEP the constant and its file (a shared cross-scene value earns a
  home); its comment-to-payload ratio is the target of T-rec 2 below, not the file's existence.

## PRUNE list

**Nothing in `demo/app/` qualifies for outright deletion on today's tree.** The only items that
become removable are two *consequences* of lane 07's separately-ruled scene prunes, both already
itemized with exact locations in F4:

1. `scene/scenes.ts:200-251` (motion-path/morph/compose descriptors + their `:21-22,25,30-31,42`
   imports) — removed/fused when lane 07's T-PRUNE-COMPOSE / T-SVG-FUSION land.
2. `chrome/ChromeDock.vue:4,46` (`Layers` import + `TAB_ICONS.Layers`) — removed in the same pass,
   once `controlSurfaceDFA.ts`'s `assets` tab (compose-only) is gone.

Both are captured here so the T implementer of lane 07's recommendations does not have to
re-discover them inside `app/`; neither should be actioned independently of lane 07's rulings
landing first (removing them today would orphan the still-live compose/motion-path/morph scenes).

---

## T recommendations

1. **T-APP-PROVENANCE-SWEEP — strip tranche-ID citations from `demo/app/` comments; keep the
   rationale, drop the archaeology.** Every comment in `app/` that cites a wave/tranche code
   (`S.D1`, `D9`, `R.W5`, `BLK-8`, `WV-W1-*`, `a11`, …) is rewritten to state the CURRENT behavior
   and its WHY in plain prose, with zero internal identifiers — provenance lives in `git blame` and
   `docs/tranches/`, not in shipped source read by a future contributor or the owner. Applies to all
   18 files; the heaviest (`ChromeDock.vue`, `useSceneMachineShellBinding.ts`,
   `useSceneMachineRouterBinding.ts`, `scenes.ts`) carry the most citations and the most payoff. ·
   *Gate:* `proof:no-tranche-provenance` — a curated regex bank (`\b[SHJKQRBD]\.[A-Za-z0-9]+`,
   `BLK-\d+`, `WV-W\d+-[A-Z]+-\d+`, `\ba\d{1,2}\b` word-boundary, `C-\d+`) matched against comment
   text ONLY (not code/CSS) in `demo/app/**` → zero hits; run once as a one-shot cleanup, then keep
   the gate in the roster to prevent recurrence. · **Size: M**

2. **T-APP-CONST-TRIM — cut `runtime/rafConstants.ts`'s comment from 13 lines to ≤3.** The file and
   constant stay (two real cross-scene consumers); state "shared rAF-readout cadence — 6 Hz, not
   60, because the numeral write is reactive and the position write is not" in one sentence and
   delete the rest. A concrete, minimal instance of T-rec 1, called out separately because it is the
   single most quotable evidence of the comment-bleed pattern (87% comment for 1 line of payload). ·
   *Gate:* line count of `rafConstants.ts` ≤ 6. · **Size: S**

3. **T-APP-CHROME-RENAME — rename `app/chrome/` to a name that isn't a browser homonym**, timed
   with lane 08's compass/transport recut if it lands (`app/dock/` holding `DockCompass.vue` +
   `MbabbMenu.vue`); if lane 08 does not land in the same wave, rename to `app/dock/` regardless
   (`ChromeDock.vue`/`MbabbMenu.vue` filenames unchanged) — the ambiguity is in the directory word,
   not the component names. Update `ALLOWED_ROOT_DIRS` in `scripts/proof-app-is-shell.mjs:65` in the
   same commit (mechanical, one constant). · *Gate:* `proof:app-is-shell` continues to PASS with
   `chrome` removed from and the new name added to `ALLOWED_ROOT_DIRS`; `grep -r "app/chrome"
   demo/ scripts/` → 0 hits. · **Size: S**

4. **T-APP-SCENES-SHRINK — land the `scenes.ts`/`ChromeDock.vue` edits F4 already itemizes**, gated
   on lane 07's compose-prune / svg-fusion landing first (this is a consequence, not an independent
   T-wave — sequenced explicitly so nobody actions it standalone and orphans a live scene). ·
   *Gate:* `proof:manifest-sourced` green with exactly 7 non-home scene ids; `grep -n "Layers"
   demo/app/chrome/ChromeDock.vue` → 0 hits; `scene/scenes.ts` line count ≤ 250. · **Size: S**

5. **T-APP-PPMODE-CALL — get an explicit owner ruling on the `ppMode`/ppmycota toggle** (F5): keep
   as an intentional brand mark, or fold it into the same "remove decorative, library-orthogonal
   chrome" sweep the VERDICT applies everywhere else. Not actioned here — flagged so it isn't
   silently assumed either way by a downstream implementer. · *Gate:* N/A (a decision record, not a
   code gate) — the outcome is recorded in this doc or a successor and, if CUT, a follow-up gate
   (`grep -ri ppmode demo/` → 0) is added at that time. · **Size: S**
