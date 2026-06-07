# a-precept-sweep — the spine across D · E · F · G (+ this G-session)

**Lane:** the PRECEPT sweep. For each binding precept: HONORED or DRIFTED, with a
`file:line` / live-observation anchor, the gestalt fix, a falsifiable instrument, and a
disposition. The closing matrix maps the observed defects D1–D11 onto the precept(s) they
expose.

**Method:** read the D/E/F/G changed surfaces (`git log master..tranche-h-dev`, the
tranche FINAL/DELTA docs, the demo + src tree). Sibling H lanes own the *per-defect*
remedies (`a-scene-icons`, `a-glow-artifact`, `a-cartoon-shadow`, `a-controls-sidebar`,
`a-historical-dock`, `a-hero-typography`, `a-mobile-architecture`, …). THIS lane is
orthogonal: does each defect reveal a *precept* the prior tranches drifted on, and is the
spine otherwise intact? I do not re-litigate the sibling remedies; I cite the same anchors
through the precept lens.

---

## Scoreboard

| Precept | Verdict | Anchor |
|---|---|---|
| no-legacy | **HONORED** | `sequence.ts:11`, `adapter.ts:83`, `engine.ts:9-13`, glass-ui re-pin `e31d75a` |
| no-workaround | **DRIFTED (1 site)** | scene-state double-fire codec `useSceneGroupSync.ts:50-54` |
| idiomatic + gestalt | **DRIFTED (2 sites)** | scenePlayback `Map` store `scenePlayback.ts:16`; D8 split-identity `ChromeDock.vue:25` |
| isomorphic styling | **HONORED** | 7 named `isomorphic` deltas in `design-idioms.css` (6) + `brand.css` (1) |
| KISS | **HONORED (1 watch)** | App scene-shell legible after the W-folds; `App.vue` 342L but cohesive |
| DRY | **DRIFTED (2 sites)** | scene icon identity split `ChromeDock.vue:25-30` vs `scenes.ts`; rail/ball was 4× (now fixed `design-idioms.css:272-318`) |
| measure-first | **HONORED** | rail/ball drift enumerated before unifying `design-idioms.css:276-291` |
| fail-explicit | **DRIFTED (1 site)** | scene-state has NO invariant guard → D12 "impossible routed state" |
| no-god-modules | **HONORED** | `engine.ts` 1375L is cohesive + MEASURE-FIRST (header `engine.ts:1-15`); nothing else >500L |
| no-nested-imports | **HONORED** | the one `await import("./engine")` is the documented lazy-barrel boundary, `easing.ts:78` |
| no-test-in-src | **HONORED** | zero `*.test.ts` under `src/`; the grep hits are JSDoc prose, not tests |

Net: the spine is **largely intact**. The drift clusters on ONE seam — the **scene +
playback state machine** (D12) — and it is precisely the seam the user flagged as CRITICAL.
The other defects (D1/D3/D4/D6/D7/D8) are design/layout regressions, not precept breaches,
with the lone exception of D8 (a DRY split-identity) and D2 (a styling drift covered by
`a-glow-artifact`/`a-cartoon-shadow`).

---

## HONORED — the exemplary surfaces (honest ALREADY-SOTA)

### P-01 · no-legacy — clean replacement-in-one-motion
The published-sibling re-pin retired the `file:` glass-ui clone in a single commit
(`e31d75a fix(tranche-G): consume glass-ui from the registry only`). The engine renames are
replace-not-alias: `sequence.ts:11` ("`Sequence` is the distinct export — forbidden by the
no-legacy mandate"), `adapter.ts:83` ("replaces the legacy `parseCSSKeyframes`"). The grep
for `deprecat|legacy|compat|polyfill|workaround` over `src/` returns only JSDoc *naming the
mandate* — never a live alias path. The `await import("./engine")` boundary (`index.ts:20`,
`engine.ts:9-13`) is an architectural feature (light interpolators don't pull value.js), not
a compat shim.
**Instrument:** `proof:no-legacy` — grep gate `! grep -rnE 'fromString|parseCSSKeyframes\b' src/` plus an import-graph assert that the package barrel has no static edge to `engine.ts`.
**Disposition:** RECORD (already-SOTA).

### P-02 · isomorphic styling — every delta is named
`design-idioms.css` carries SIX explicit `isomorphic` annotations (`:39, :64, :78, :132,
:150, :196`) and `brand.css` one (`:11`); each localization documents pixel-equivalence or a
named, befitting delta (e.g. the dark-mode gold base at `:64`). This is the precept executed
to the letter — "ISOMORPHIC unless a named, befitting delta."
**Instrument:** a visual-lock (Playwright screenshot diff) on the localized utilities vs the glass-ui baseline at the annotated sites.
**Disposition:** RECORD.

### P-03 · measure-first — the rail/ball unification
`design-idioms.css:276-291` enumerates the drift *before* fixing it: "three rail tints
(12/8/10%), two glow strengths (40/35%), four ball sizes" across SpringTarget / EasingTarget
/ SpringSidebar — measured, then collapsed to ONE parameterized `.progress-rail` /
`.progress-ball` (`:297-318`) defaulting to the AA-contrast lineage. This is the canonical
measure-first + DRY motion.
**Instrument:** `proof:single-rail` — assert exactly one `.progress-rail`/`.progress-ball` definition in the CSS layer; assert no scoped `*-rail-line`/`*-ball` block survives.
**Disposition:** RECORD (and it is the *template* for fixing the D8 DRY drift below).

### P-04 · fail-explicit (engine) — throws everywhere it matters
The new F/G engine surfaces fail loudly: `motion-path.ts:119`, `draw-svg.ts:80/89/137`,
`sequence.ts:242/570/601`, `stagger.ts:136` (`AnimationOptionError`), `decay.ts:67/97`. The
engine half of fail-explicit is HONORED. (The DRIFT is on the *demo* state-machine half —
P-08.)
**Disposition:** RECORD.

### P-05 · no-god-modules — engine.ts is cohesive, MEASURE-FIRST
`engine.ts` is 1375L but its header (`engine.ts:1-15`) documents a single cohesion:
`Animation` + `CSSKeyframesAnimation` + the `AnimationGroup` they compose, behind one
dynamic boundary. Splitting it would sever the value.js static-edge contract that keeps the
light interpolators tree-shakeable — a split would be a workaround, not an improvement.
`animations.ts` (870L) is a flat preset *catalog* (data, not logic). No demo file exceeds
500L; the largest (`App.vue` 342L, `EasingCurveCanvas.vue` 349L) are cohesive.
**Instrument:** keep the line-ceiling decision as a BOOK note ("engine.ts intentionally >500 — do not split without severing-the-boundary proof").
**Disposition:** RECORD / BOOK the rationale so a future tranche doesn't reflexively decompose it.

---

## DRIFTED — the findings (each with anchor · gestalt fix · instrument · disposition)

### F-01 · no-workaround + fail-explicit — the scene-state double-fire codec (THE D12 ROOT CAUSE) — SHIP-in-H
**Anchor:** `demo/app/useSceneGroupSync.ts:50-54`:
```
// Detect the "stable" fire: when superKey hasn't changed, this is
// the second watcher fire after ACG's key-triggered remount cycle.
const isStableFire = currentSuperKey.value === superKey;
```
The scene↔group reconcile is an **implicit, heuristic state machine**: a `watch` on
`sceneRef.value?.animationGroup` that fires *twice* per switch, and the code distinguishes
"first fire" vs "stable fire" by a string-equality coincidence (`currentSuperKey === superKey`).
Playback restore is gated on that coincidence (`:81`). This is a textbook **workaround** — it
encodes a Vue remount-ordering accident as control flow, exactly the "quick solution" the
spine forbids. It is *also* the **fail-explicit** drift: there is NO invariant guard
asserting the restored state is consistent, so a mis-ordered fire silently lands the controls
in the "impossible ROUTED state" the user reports (easing→cube→back leaves invalid options).

**Live reproduction (to confirm in H):** navigate `/easing` → `/cube` → `/easing`; per D12
the controls/options are stuck routed. The codec has no assertion that `selectedAnimation`,
`isControlsPanelOpen`, and the restored `ScenePlaybackState` are mutually consistent for the
landed `superKey`.

**Gestalt fix:** replace the double-fire heuristic with an **explicit, formal scene+playback
state machine** (the user's exact ask in D12). Model `idle → switching → restoring → ready`
(and `suspended` for the leaving scene) as discriminated states; the transition fires the
save/suspend on leave and the restore/resume on the *single* `ready` entry — no "count the
watcher fires." Fail-explicit becomes free: every transition asserts its pre/post invariant
(`superKey` landed, group keys match the saved snapshot, controls reference an existing
animation), and an impossible edge throws instead of degrading to a routed-stuck UI.

**Store choice (D12 also asks for the facility):** the existing playback store is a *plain
non-reactive* `Map` (see F-02) and the controls live in lazy-localStorage singletons
(`stores/*Store.ts`). The idiomatic Vue path that unifies these without a heavy dep:
`@vueuse/core` `createGlobalState` for the singleton store (already in-tree — used by
`useKeyboardShortcuts`, per `demo/CLAUDE.md`) hosting the state-machine ref; xstate is
*available* but a 4-state machine is over-served by a typed `ref<SceneFSM>` + pure transition
functions. RECOMMEND: `createGlobalState` + a small pure FSM module (testable in isolation),
NOT Pinia (no SSR/devtools need here) and NOT a 3rd-party machine lib. This keeps KISS while
making the machine irrefragable.

**Instrument:** `proof:scene-fsm` — a Playwright gate that drives easing→cube→easing→spring→cube and asserts after each landing: (a) `selectedAnimation` ∈ the landed group's animation names, (b) play/pause is RESTORED (was-playing scenes resume, was-paused stay paused), (c) the leaving scene is SUSPENDED (its rAF is not still drawing — assert via `console_messages`/frame counter). Plus a unit test on the pure FSM that an out-of-order transition THROWS.
**Disposition:** **SHIP-in-H** (D12 is flagged CRITICAL; this is the spine breach that matters most).

### F-02 · idiomatic+gestalt — the playback store is a bare module-level Map (not a store) — SHIP-in-H (folds into F-01)
**Anchor:** `demo/@/components/custom/animation-controls/stores/scenePlayback.ts:16`:
`const _scenePlaybackStates = new Map<string, ScenePlaybackState>();` with hand-rolled
`save`/`get`/`clear` CRUD. It lives in the `stores/` directory and is *named* a store, but it
is **not reactive**, has no TTL/lifecycle (unlike its siblings `animationOptionsStore.ts` /
`controlOptionsStore.ts` which DO use the lazy-localStorage singleton + `storeUtils`), and is
mutated imperatively from two composables (`usePlaybackSnapshot.ts:37`,
`useSceneGroupSync.ts:82`). A bare `Map` masquerading as a store is the non-idiomatic shape
that makes the F-01 codec necessary — there is no reactive edge to drive a clean restore.
**Gestalt fix:** fold this into the F-01 `createGlobalState` machine — the per-scene snapshot
becomes a field of the FSM context, restored by the transition, not by an external `Map` poke.
The `stores/scenePlayback.ts` module and its three free functions are then **removed** (no-legacy:
replaced in one motion).
**Instrument:** same `proof:scene-fsm` gate; plus assert `stores/scenePlayback.ts` is deleted.
**Disposition:** **SHIP-in-H** (sub-part of F-01).

### F-03 · DRY — scene IDENTITY is split between the registry and the dock (THE D8 PRECEPT BREACH) — SHIP-in-H
**Anchor:** `demo/@/components/custom/dock/ChromeDock.vue:25-30` hardcodes
`const sceneIcons: Record<string, string> = { cube, amiga, square, easing }` — while the
authoritative scene registry `demo/app/scenes.ts` (`SceneDescriptor`) has **no `icon` field
at all**. A scene's visual identity is therefore authored in TWO places, and they have
**drifted**: cube/amiga/square/easing have icons in the dock map, but spring / sequence /
motion-path / starting-style exist in `scenes.ts` yet are *absent* from `sceneIcons`, so they
fall through to the generic lucide `<Home>` at `ChromeDock.vue:172` / `:194`. This is the
**root cause of D8** seen through DRY: the missing icons aren't a forgotten asset — they're a
*structural* consequence of identity living outside the registry. (The same shape DRY already
fixed for control-tab icons would be the template; cf. the rail/ball unification P-03.)
**Gestalt fix:** move `icon` onto `SceneDescriptor` in `scenes.ts` (one source of scene
identity: id · label · superKey · component · **icon**). `ChromeDock` reads `scene.icon` —
the `sceneIcons` map and its four static imports are deleted (no-legacy). A scene with no icon
is then *impossible to add silently*: the descriptor type makes it required (fail-explicit at
the type layer). Sibling lane `a-scene-icons` owns the *designed SVG* deliverables; this lane
owns the *structural* fix that makes them belong to the registry.
**Instrument:** `proof:scene-identity` — a type-level test that `SceneDescriptor.icon` is required, and a runtime assert that every entry in `scenes` resolves a real asset (no fall-through to the generic Home glyph for a *named* scene).
**Disposition:** **SHIP-in-H** (the DRY fix); the icon ART is gated by `a-scene-icons` (and pertinence by `a-modes-pertinence`).

### F-04 · doc-drift — demo/CLAUDE.md describes `animationStores/`, the tree is `stores/` — RECORD
**Anchor:** `demo/CLAUDE.md` (Animation Controls §) lists `animationStores/` with member files,
but the on-disk directory is `demo/@/components/custom/animation-controls/stores/`. The member
file `scenePlayback.ts` is documented as "per-scene ephemeral playback CRUD, **active scene
tracking**" — but the file has NO active-scene-tracking (that moved to App.vue's
`currentSceneId`). Stale docs are a soft no-legacy drift (a doc describing a replaced surface).
This echoes the F-A12 record (`a-design-language.md:3` notes `utils.css` is GONE but
`demo/CLAUDE.md` still lists it). The doc has drifted in at least TWO places.
**Gestalt fix:** one doc-reconcile pass over `demo/CLAUDE.md` (rename `animationStores/`→`stores/`,
drop the `utils.css` line, correct the `scenePlayback.ts` description). Cheap; do it WITH F-01/F-02
since those rewrite the same dir.
**Instrument:** a `proof:docs-tree` lint that every path mentioned in `demo/CLAUDE.md` exists on disk.
**Disposition:** RECORD (bundle into the F-01/F-02 commit).

---

## The defect→precept matrix (D1–D11 through the spine)

| Defect | Precept exposed | Verdict |
|---|---|---|
| **D1** controls 2-col→1-col | none (layout-design) — `AnimationControlsControls.vue:4` `grid-cols-[auto_1fr]` is label/control, correct shape; the two-up pairing is a design call | not a precept breach → `a-controls-sidebar` |
| **D2/D14** radial-blur vs cartoon-shadow | **idiomatic+gestalt DRIFT** — the demo dropped the cartoon-depth half of glass-ui's paper-and-glass (cartoon-shadow was CLOSED in Tranche C, now regressed); a radial-specular carrying hover alone is the workaround where cartoon-shadow is the idiom | precept-relevant → `a-glow-artifact` / `a-cartoon-shadow` own the fix; I CONCUR it is a spine drift |
| **D3** easing editor too massive / inner border | none (layout-design) — `panel-row--detail` `max-height: min(50vh,480px)` `:324` is a sizing call | not a precept breach → `a-easing-editor` |
| **D4** ribbon full-width | none (layout-design) — `PlaybackRibbon.vue:2` `w-full` is intended; the constraint is a parent-width design call | not a precept breach → `a-timeline-width` |
| **D5/D9** dock lag + logo popover | glass-ui domain (consumed PUBLISHED) — `App.vue:18-72` DockDropdownTrigger; **glass-ui-HANDOFF**, do NOT patch in kf | → `a-historical-dock` (audit+suggest, tag handoff) |
| **D6** typing-dots broken | none (a CSS-anim bug) — `AnimatedText.vue:93-107` `.dot-fade` keyframe; consumed by `EditorStartScreen.vue:17`. The hero now splits by WORD (`:62`) so the three dots are ONE token "..." not three staggered spans → the per-dot fade can't stagger | implementation bug, not precept → `a-typing-dots` |
| **D7** hero typography / φ-ladder | none (uses `text-display`/`depth-text` per `style.css:41,63`) — φ-ladder IS present; the size is a design call | not a precept breach → `a-hero-typography` |
| **D8** missing scene icons | **DRY DRIFT (F-03)** — scene identity split registry↔dock | precept breach → fix structurally (F-03), art via `a-scene-icons`, pertinence via `a-modes-pertinence` |
| **D10/D11** mobile + interactivity | architectural (new work, not a prior-tranche drift) | → `a-mobile-architecture` / `a-mode-interactivity` |
| **D12** scene-state corruption | **no-workaround + fail-explicit + idiomatic DRIFT (F-01/F-02)** — THE spine breach | precept breach → SHIP-in-H |

**Reading:** of the eleven observed defects, exactly THREE expose a prior-tranche precept
drift — D2/D14 (idiom: cartoon-depth dropped), D8 (DRY: split identity), D12 (workaround +
fail-explicit: heuristic state machine). The rest are layout/design calls or new-work
architecture. The spine carried A→G is honored everywhere EXCEPT the scene-state seam, which
is also the user's CRITICAL flag — the precept lens and the user's pain point coincide.

---

## Dispositions roll-up
- **SHIP-in-H:** F-01 (formal scene+playback FSM, fail-explicit guards), F-02 (fold the Map store into the FSM via `createGlobalState`), F-03 (move `icon` onto `SceneDescriptor`, delete the dock `sceneIcons` map).
- **RECORD:** P-01..P-05 (already-SOTA spine surfaces), F-04 (bundle the `demo/CLAUDE.md` reconcile into the F-01/F-02 commit).
- **BOOK:** the `engine.ts` >500L line-ceiling rationale (do-not-split-without-boundary-proof).
- **glass-ui-HANDOFF:** D5/D9 dock lag + popover (consumed published; suggest only).
- **CONCUR (owned by siblings):** D2/D14 idiom drift (`a-glow-artifact`/`a-cartoon-shadow`); D8 art (`a-scene-icons`); D12 design (`a-mobile-architecture` etc.).

## Falsifiable spine gate for H
`proof:precept-sweep` should bundle: (1) `proof:scene-fsm` (F-01/F-02 — restore+suspend+
no-routed-stuck across easing↔cube↔amiga↔spring); (2) `proof:scene-identity` (F-03 —
`SceneDescriptor.icon` required, no named scene falls through to the generic glyph); (3)
`proof:no-legacy` regrep (no resurrected alias); (4) `proof:docs-tree` (every `demo/CLAUDE.md`
path exists). If all four are green, the spine is irrefragable through H.
