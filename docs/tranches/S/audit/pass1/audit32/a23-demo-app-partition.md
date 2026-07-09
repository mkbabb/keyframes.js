# a23 — demo/app partition (design lane)

**Lane:** a23-demo-app-partition · **Tranche:** R deep audit (pass 1) · **Date:** 2026-07-02
**Scope judged:** every file under `demo/app/` (21 files, 2021 LOC), the R.W5 spec
(`docs/tranches/R/waves/R.W5.md`), and the R impl range `a15cd48..18e8617`.
**Method:** full read of all app files; git-range diff; consumer/reference greps;
`proof:scene-colocated` re-run (GREEN); CI-roster + gate-body cross-check.

---

## Executive summary

R.W5 ("demo scene fusion + dead-code excision") did **honest structural work** on
`demo/app/`: the eight `app/scenes/*Scene.vue` shell entries were physically moved
out into `demo/scenes/<name>/` (−1894 LOC of scene code left app/), four shared
helpers were extracted to kill three real triplications, `sceneExposedApi.ts` typed
the former `shallowRef<any>` duck-typing chain, and both the router list and the
`stageMode` field were single-sourced off the registry. `proof:scene-colocated`
is genuinely GREEN and bites. This is **not cosmetic** — it is a real subtraction.

But `demo/app/` was never itself *partitioned* — it is the residue drawer. What
remains is a **flat pile of ~15 mixed-concern files** (shell, routing, scene-machine
bridge, transition, rAF lifecycle, cross-scene transport, perf instrumentation, and
two strays) with no internal grouping except an inconsistently-applied `composables/`
subdir that holds 2 of the 9 composables. R did not claim to fix this — but it left
three concrete debts that S inherits:

1. **A zombie CORRECTNESS gate.** R.W5 Band A (commit `9c1d9bd`) deleted
   `SceneSwitcherCarousel.vue`, but `proof:scene-switcher-mobile` — still in the
   `proof:correctness` roster and wired into CI at `ci.yml:684` — queries the now-
   deleted `.scene-carousel`/`.scene-carousel-card` DOM. The gate now hard-reds at
   390px; only `continue-on-error: true` (the blanket treatment for all live browser
   gates) hides it. **There is no mobile scene switcher at all** — the very thing
   Q.WC3 built this gate to guarantee. This is the "resurrect the shelved
   scene-switcher" chronic, entered as silent gate-rot.
2. **A phantom gate reference.** `proof:app-shell-thinness` is cited in two source
   comments as the thing keeping App.vue "thin" — the gate does not exist, and
   App.vue is 488L (12 lines under the demo ceiling), ~130 of them a brand dropdown.
3. **A colocation-contract violation R itself introduced-and-left:**
   `cubeTransformStore.ts` sits in app root but is consumed only by `scenes/cube/`.

None of these are large; all are the kind of residue a "surgical refactor" is
supposed to sweep, and each has a stale comment or doc line advertising the old
world. The partition proper (grouping app/ by concern, evicting strays) is a clean
S wave; the mobile-switcher resurrection is a *separate* S wave (a new component,
not a file move).

---

## Findings

### F1 — `proof:scene-switcher-mobile` is a zombie: R deleted the DOM it asserts, CI masks the red — HIGH

**Evidence:**
- R.W5 Band A deleted `SceneSwitcherCarousel.vue` + `useScrollSnapScene.ts`
  (commit `9c1d9bd`, "impl(R.W5 Band A): dead-code excision"). `proof:scene-colocated`
  ASSERTION 3 now enforces they never return.
- `scripts/proof-scene-switcher-mobile.mjs:75` does
  `document.querySelector(".scene-carousel")`, `:80` iterates
  `.scene-carousel-card`, `:107` fails with *"NO `.scene-carousel` scroller renders
  at 390px"*, and `:187` taps `.scene-carousel-card[data-scene-id=…]` to drive the
  directional-VT clause. Grep confirms **zero** surviving demo sources render
  `.scene-carousel` (only the gate + its own comments mention it).
- The gate is live: `package.json:225` defines it, `package.json:234` includes it in
  `proof:correctness`, and `.github/workflows/ci.yml:684-687` runs it as
  `[CORRECTNESS] proof:scene-switcher-mobile` — self-labelled *"a 390px scroll-snap
  carousel renders non-clipping cards"*, clause (1) marked **KEYSTONE**.
- It stays green only because every `KF_REQUIRE_BROWSER` live gate carries
  `continue-on-error: true` (`ci.yml:686`) — the standard flaky-runner treatment,
  not a deliberate quarantine of *this* gate. So the red is invisible, not waived.
- R.W5 never touched the gate: `git log a15cd48..18e8617 --
  scripts/proof-scene-switcher-mobile.mjs` is empty; last touch is `090c7b0` (Q).
- R.W5 §4 justified the deletion ("the removal stands on A.1 alone") but **did not
  reconcile the dedicated gate Q.WC3 shipped to enforce the carousel** — the wave
  excised a UI surface and orphaned its born-RED oracle in the same motion it
  claimed dead-code purity.

**Why it matters:** the demo now has **no phone-native scene navigation** — only the
ChromeDock Select, which Q.WC3's own rationale (`proof-scene-switcher-mobile.mjs:8-11`)
rejected as insufficient ("the phone-correct gesture — the platform owns swipe/snap").
A KEYSTONE correctness gate reds on master and nobody sees it. This is the exact
"green source-shape gates miss appearance/interaction; chronics exit only via a
system gate or born-RED handoff" blind-spot in MEMORY.md.

**Proposal (S):** a dedicated wave. Either (a) resurrect a real mobile switcher as a
proper `scenes`-nav component (a `<nav>` scroll-snap rail or a segmented control that
reuses `sceneIndex` + the directional VT — the dock Select stays for desktop), and
rewrite the gate's selectors to match; or (b) if the product decision is "dock Select
only", **retire** `proof:scene-switcher-mobile` from the roster + CI + `ci-coverage`
in one motion and delete its `.scene-carousel` clause. A live CORRECTNESS gate must
never describe deleted DOM. Given the mission brief ("resurrect the shelved
scene-switcher properly"), (a) is the intended path.

---

### F2 — `proof:app-shell-thinness` is a phantom gate; App.vue is not thin — MEDIUM

**Evidence:**
- `demo/app/App.vue:361` and `demo/app/useSceneMachineApp.ts:8` both cite
  `(proof:app-shell-thinness)` as the enforcement keeping the shell "a thin template
  + a wiring list." `grep` over `scripts/` and `package.json` returns **zero** hits —
  the gate does not exist.
- App.vue is 488L — the largest file in `demo/app/`, 12L under the 500L
  `proof:demo-no-oversize` ceiling (`proof-demo-no-oversize.mjs:39`). Of that,
  `App.vue:43-100` (the `@mbabb` `<DropdownMenu>` template) + `App.vue:388-459` (the
  D9 pointerdown-synthesis workaround) are **~130 lines of a glass-ui brand dropdown**
  — not shell/routing/machine concern at all.

**Why it matters:** an aspirational gate cited as if real is documentation dishonesty
(the same "cosmetic close" pattern the R audit is chartered to prune). The thinness
claim is materially false while a third of App.vue is a brand menu + a reka
workaround.

**Proposal (S):** extract the `@mbabb` dropdown (template + the `mbabb*` handlers +
the D9 rationale block) into a `MbabbMenu.vue` under `@/components/custom/dock/` (it
is dock chrome, and its workaround is a glass-ui dock affordance seam). App.vue drops
to ~360L of genuine wiring. Then EITHER author a real `proof:app-shell-thinness`
(e.g. App.vue ≤ N lines, no business logic beyond provides/computed/handler-dispatch)
OR delete the two phantom citations. Do not ship a comment that names a gate that
isn't there.

---

### F3 — `cubeTransformStore.ts` is a stray: cube-only state in app root — MEDIUM

**Evidence:**
- `demo/app/cubeTransformStore.ts` (20L) exports `useCubeTransform`. Its **only**
  consumers are `demo/scenes/cube/CubeScene.vue:57,77,219`. No other scene, no shell
  file reads it.
- Its own header comment ("persists across home ↔ cube transitions; the home screen
  CubeTarget and CubeScene both read/write") describes a split that no longer exists:
  `App.vue:319-332` renders `CubeScene` for *both* home and cube (shared `"cube"`
  Suspense key), so "home CubeTarget" **is** CubeScene in home mode. The state is
  wholly within `scenes/cube/`.
- R.W6 (C.1) *touched* this file (bare `ref` → `createGlobalState`) but did not
  relocate it — so R had it open and left it misplaced, directly against R.W5's own
  colocation contract ("scene state lives WITH the scene").

**Why it matters:** it is the single clearest violation of the tranche's own
headline principle, sitting one directory away from where the principle says it goes.

**Proposal (S):** move to `demo/scenes/cube/cubeTransformStore.ts`; update the three
CubeScene imports from `@app/cubeTransformStore` to `./cubeTransformStore`; refresh
`demo/CLAUDE.md:20` (which still lists it under `app/`). Zero risk — one consumer.

---

### F4 — `composables/` subdir is applied to 2 of 9 composables; the split rule doesn't hold — MEDIUM

**Evidence:**
- app root holds 7 composables: `useSceneMachineApp`, `useSceneMachineRouter`,
  `useSceneSwap`, `useSceneTransition`, `useSceneVisibilityPause`, `useRafScene`,
  `useMonacoCancellationGuard`.
- `app/composables/` holds only 2: `useContractAnimGroup`, `useSceneTransport`.
- R.W5's stated rule (B.1/B.2 vs B.4): "app-level cross-scene composables" →
  `app/composables/`; "shared demo primitive" → `@/composables/` (where
  `useTypedTrigger` went). But the rule mis-sorts its own siblings:
  `useRafScene.ts` is consumed cross-scene by BOTH easing and spring
  (`demo/scenes/easing/useEasingDemo.ts:20`, `demo/scenes/spring/useSpringDemo.ts:7`)
  — identical cross-scene status to `useContractAnimGroup` — yet sits at app root,
  not in `composables/`. `useSceneVisibilityPause` is a cross-scene recipe consumed
  by `useRafScene`, also at root. The "cross-scene → composables/" criterion is not
  what actually decided placement; the two files in `composables/` are simply the two
  R.W5 happened to create there.

**Why it matters:** an arbitrary two-file subdir reads as structure but encodes none
— the next author cannot predict where a new composable goes. This is exactly the
"cosmetic decomposition" the audit hunts (recall the Q "8 flat siblings" finding).

**Proposal (S):** pick ONE coherent rule and apply it wholesale (see the layout
recommendation below). Either dissolve `app/composables/` back to flat, or move ALL
scene-runtime composables into a concern subdir. Do not leave a 2/9 split.

---

### F5 — stale comment: `scenes.ts` still cites the deleted mobile carousel — LOW

**Evidence:** `demo/app/scenes.ts:239` — the `sceneIndex` doc says *"…and the mobile
scroll-snap carousel reads the SAME order — no second hard-coded order list."* The
carousel was deleted in R.W5 Band A. `sceneIndex` today has exactly one consumer,
`useSceneTransition.ts:55-56` (the directional VT). The comment advertises a
consumer that no longer exists.

**Proposal (S):** trim the clause to name only the live consumer. Part of the F1
mobile-switcher wave (the comment becomes true again if a switcher returns and reads
`sceneIndex`, false if not).

---

### F6 — `demo/CLAUDE.md` is stale: lists two deleted components — LOW

**Evidence:** `demo/CLAUDE.md:40,42` list `Animated` and `ResponsiveSelect` under
`@/components/custom/` "singles". Both were deleted in R.W5 A.2 (verified gone on
disk; `proof:scene-colocated` ASSERTION 3 enforces their absence). The doc was not
updated in the same motion.

**Proposal (S):** drop `Animated` and `ResponsiveSelect` from the `demo/CLAUDE.md`
singles list. (Folds into any S doc-refresh wave.)

---

### F7 — `@app` alias is undocumented — LOW / INFO

**Evidence:** `@app` → `demo/app` is defined in `vite.config.ts:315` and
`tsconfig.json:35`, and is used across `scenes/{easing,spring,sequence,cube}`
(e.g. `demo/scenes/easing/useEasingDemo.ts:20-23`). `demo/CLAUDE.md:100` lists the
path aliases (`@src @components @composables @styles @utils @assets`) but **omits
`@app`**. R added the alias (it's how fused scenes reach the extracted helpers) and
did not document it.

**Proposal (S):** add `@app/` to the `demo/CLAUDE.md` alias list. Note that any
concern-subdir move under F4/partition changes `@app/*` specifiers at the four scene
consumers — cost to weigh in the layout choice below.

---

## demo/app clustered by concern (the partition map)

| Concern | Files | Note |
|---|---|---|
| **Shell** | `App.vue`, `main.ts`, `index.html`, `public/` | App.vue bloated by the @mbabb menu (F2) |
| **Routing** | `router.ts`, `useSceneMachineRouter.ts` | reader/writer/echo-guard reconcile |
| **Scene-machine ↔ shell bridge** | `useSceneMachineApp.ts`, `sceneExposedApi.ts`, `scenes.ts` | the *reducer* itself lives in `@/…/stores/sceneMachine.ts`; app holds the bridge only |
| **Transition** | `useSceneSwap.ts`, `useSceneTransition.ts`, `scene-transition.css` | VT + SpringProgress fallback |
| **Scene rAF runtime** | `useRafScene.ts`, `useSceneVisibilityPause.ts`, `rafConstants.ts` | cross-scene recipe (easing+spring) |
| **Cross-scene transport** | `composables/useContractAnimGroup.ts`, `composables/useSceneTransport.ts` | the only two in `composables/` (F4) |
| **Perf / diagnostics** | `loaf-observer.ts`, `useMonacoCancellationGuard.ts` | dev-only LoAF; global Monaco guard |
| **STRAY** | `cubeTransformStore.ts` | → `scenes/cube/` (F3) |

Two files also belong elsewhere: `cubeTransformStore.ts` → `scenes/cube/` (F3, firm);
`useMonacoCancellationGuard.ts` is a *soft* stray — it is app-lifetime (mounted from
App root, guards a global handler) so app/ is defensible, but its subject (Monaco)
lives in `@/…/animation-controls/keyframes/`. Leave it in app/ but under a
diagnostics group.

---

## Candidate layouts

### Layout A — status quo + evict strays (minimal)
Keep app/ flat; move `cubeTransformStore.ts` → `scenes/cube/`; dissolve
`app/composables/` back to flat (all `use*` at app root); fix F5/F6/F7 docs.
- **Pro:** near-zero churn; no `@app/*` specifier changes except the cube move.
- **Con:** app/ stays a ~14-file flat drawer mixing seven concerns; the partition
  question is answered "don't". Fine if S judges app/ too small to zone.

### Layout B — full concern subdirs (deep sub-zoning)
`app/{routing,machine,transition,raf,transport,diagnostics}/` mirroring the src/
7-zone idiom at the demo grain.
- **Pro:** every concern is a named dir; maximally legible.
- **Con:** 6 dirs for ~14 files is over-nesting — and it directly contradicts R.W5's
  own KISS rule ("no intra-scene sub-dirs at 4-13 files"). At this grain the ceremony
  outweighs the payoff; several dirs would hold a single file (`transport/`,
  `diagnostics/`).

### Layout C — three shallow clusters + evict strays (RECOMMENDED)
```
demo/app/
├── App.vue · main.ts · index.html · public/        # shell (root)
├── scene/        scenes.ts · sceneExposedApi.ts · useSceneMachineApp.ts
│                 · useSceneMachineRouter.ts · router.ts        # machine↔shell↔route bridge
├── transition/   useSceneSwap.ts · useSceneTransition.ts · scene-transition.css
└── runtime/      useRafScene.ts · useSceneVisibilityPause.ts · rafConstants.ts
                  · useContractAnimGroup.ts · useSceneTransport.ts
                  · loaf-observer.ts · useMonacoCancellationGuard.ts
# cubeTransformStore.ts  → demo/scenes/cube/     (F3)
# @mbabb dropdown        → @/components/custom/dock/MbabbMenu.vue   (F2)
```
Each subdir holds 3–7 files (above R's "over-nesting" line); the arbitrary 2-file
`composables/` (F4) dissolves into `runtime/`; the strays leave. Routing folds into
`scene/` because `router.ts` + `useSceneMachineRouter.ts` are one reconcile (they
already form the reader/writer pair) — a standalone `routing/` would be a 2-file dir.

- **Pro:** honest concern grouping without ceremony; kills F4; consistent with the
  R subtraction ethos; only three new dirs.
- **Con:** `@app/*` specifiers at the four scene consumers change (e.g.
  `@app/composables/useContractAnimGroup` → `@app/runtime/useContractAnimGroup`,
  `@app/rafConstants` → `@app/runtime/rafConstants`, `@app/useRafScene` →
  `@app/runtime/useRafScene`). Contained (4 files, ~6 import lines) and mechanical.

**Recommendation: Layout C.** It is the smallest move that makes the pile legible and
dissolves the F4 incoherence, without tripping the KISS constraint R itself set for
scenes. If S judges the churn not worth it, fall back to **Layout A** (flat + evict) —
but *not* the current half-state (a 2/9 `composables/` split is the worst of both).

---

## Tranche-S implications

1. **Wave S-mobile-switcher (HIGH — chronic close, born-RED handoff).** Resurrect a
   phone-native scene switcher as a real `scenes`-nav component reusing `sceneIndex`
   + the directional VT (dock Select stays for desktop), and **rewrite
   `proof:scene-switcher-mobile`'s selectors** to the new DOM — OR, if product says
   dock-only, retire the gate from the roster + `ci.yml` + `proof:ci-coverage` in one
   motion. Either way, no live CORRECTNESS gate may describe deleted DOM (F1). This is
   the "resurrect the shelved scene-switcher" mission item; treat it as its own wave,
   separate from the partition.

2. **Wave S-app-partition (Layout C).** Group `demo/app/` into `scene/`,
   `transition/`, `runtime/`; evict `cubeTransformStore.ts` → `scenes/cube/` (F3);
   dissolve the 2-file `composables/` (F4); update the 4 `@app/*` scene consumers.
   Gate it with the same `proof:scene-colocated`-style static instrument (concern-dir
   membership + no stray). (Fold Layout A as the fallback if churn is rejected.)

3. **Wave S-shell-thin.** Extract the `@mbabb` dropdown → `@/components/custom/dock/
   MbabbMenu.vue` (F2); then author a REAL `proof:app-shell-thinness` (App.vue line
   ceiling + "no logic beyond provide/computed/dispatch") or delete the two phantom
   citations. Do not keep a comment naming a nonexistent gate.

4. **Doc-refresh (fold into any S doc wave).** Fix the stale `scenes.ts:239` carousel
   comment (F5), drop `Animated`/`ResponsiveSelect` from `demo/CLAUDE.md:40,42` (F6),
   and add `@app/` to the alias list `demo/CLAUDE.md:100` (F7).

5. **Method note for the tranche process.** R.W5 shipped its file-moves honestly and
   its gate (`proof:scene-colocated`) bites — but it deleted a UI surface (F1) and
   left the *dedicated* gate for that surface orphaned, and cited a gate that never
   existed (F2). The general lesson for S wave-authoring: **when a wave deletes a
   surface, its spec's dead-code section must enumerate and reconcile every gate that
   named that surface** (not just the source references). A `continue-on-error` live
   gate is a silent liability precisely because deletion won't turn it red-in-CI —
   the reconcile has to be manual, in the spec.
