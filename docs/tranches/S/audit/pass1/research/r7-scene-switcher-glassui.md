# r7 — Scene-switcher archaeology + glass-ui 5.0.0 runway

**Lane:** r7 (Tranche S, pass-1 research) · **Date:** 2026-07-02 · **Branch (read-only):** `tranche-s-dev`
**Scope:** (A) mine the shelved `n-stage-impl` scene switcher, design-brief a correct resurrection; (B) map the glass-ui BG/BH → 5.0.0 runway against kf's demo consume-edge.

---

## Executive summary

**(A) The shelf is a treasure, not a corpse.** The `n-stage-impl` branch (6 commits, HEAD `e2375b8`, +4188 LOC / 23 files) built a genuinely SOTA carousel scene-switcher that two design-authorities independently converged toward but never shipped. Its *engine* is excellent and directly reusable: `useCarouselOrbit.ts` (ONE `SpringProgress` over a ring-angle scalar, shortest-signed-delta re-seat, interruptible, per-card falloff as a pure function of the live spring value, PRM-snap, LIGHT-barrel/value.js-free) and `useLivePreviewLOD.ts` (ONE shared `RAFPlayback` clock, per-card full/flank/paused cadence, `content-visibility` gating, concurrent-full-loop cap with the WebGL preview counting double) together SOLVE the two named failures — "SLOW" (LOD architecture) and "WRONG" (verified `rotateX(-15deg)` back-higher geometry). Critically the shelf got the one thing BOTH later attempts got wrong RIGHT: `SceneStage.vue` is a `Teleport`-to-body sibling to the keyed `<Suspense>`, i.e. **outside** the `view-transition-name: scene-subject` subject (SceneStage.vue:20,217) — it does not repeat the R-audit's "chrome-inside-VT-subject" defect.

**What killed it was scope + timing, not design.** It was shelved (DM-24) as "redundant" at R because Q had shipped a *different*, broken-by-design in-tree carousel (`SceneSwitcherCarousel.vue`, no-op `onScroll`, commit-never-wired — R excised it). The shelf's real obsolescence risks are (1) it predates R's demo scene-fusion (targets moved `demo/cube/CubeTarget.vue` → `demo/scenes/cube/CubeTarget.vue`) so every `sceneStageRegistry` path is stale; (2) it re-rolls a bespoke `TransportDock`→arrows swap that a *second dock authority* concern, which now collides with glass-ui BG's shipped in-place dock morph primitive. Both are mechanical re-homes, not redesigns. The correct 2026 resurrection is: the shelf's orbit + LOD engine, re-pathed onto the fused `demo/scenes/<name>/…Target.vue` components, invoked from and committing through the single `ChromeDock` authority via the existing `runSceneSwitch`/typed-View-Transition seam, dogfooding glass-ui's new dock morph rather than re-rolling one.

**(B) glass-ui 5.0.0 does not exist yet — it is a ~140-wave runway.** kf's demo pins `@mkbabb/glass-ui: ~4.0.0` (package.json:260) and has **4.0.1 installed** against a **4.2.0 HEAD** — the tilde pin freezes the demo at the 4.0.x line and cannot even pick up 4.2.0. BG (integration/verification, ≈110 waves) + BH (de-indirection + BREAKING export reshape, ≈30 waves) are both *tranche-development complete but unbuilt* (no `src/` landed on either branch); they cut **jointly as 5.0.0** only after BG's WS12 capstone. So there is no adoption to schedule yet — kf-S must plan a *deliberate* consume-edge, not an auto-bump. The good news: kf's demo is remarkably insulated from the BH grammar break (0 `density=`, 0 `size="default"`, 0 `glass-ui/api`, 0 `goo-blob`, `GlassPanel` used without `variant`). The real kf-S obligations are (1) unfreeze the tilde pin and adopt 5.0.0 deliberately when it lands; (2) verify the `/dock` surface survives SHELL-DOCK-DRY + DOCK-INPLACE-MORPH (kf consumes `GlassDock`/`DockIconButton`/`DockSelectTrigger`); (3) re-baseline demo visual-lock gates against BG's new specular material floor (the "specular=off handoff" expectation in kf memory is STALE — BG ships a full iOS-27 bevel + `useSpecularPointer` + dual-stack refraction shader); (4) reconcile the scene-switcher resurrection to dogfood BG's in-place dock morph.

---

## Part A — Scene-switcher archaeology

### A-1 — The shelf inventory (`n-stage-impl`, HEAD `e2375b8`)

**Severity: info | Evidence:** `git diff master...n-stage-impl --stat` (+4188 / 23 files); `git log n-stage-impl --oneline` (6 commits `787cebb…e2375b8`).

The branch built a complete feature under `demo/@/components/custom/scene-stage/`:

| File | LOC | What it is |
|------|----:|-----------|
| `SceneStage.vue` | 498 | Teleport-to-body overlay: zoom-out container + downlight + disk + name-plate; owns `useSceneStage` |
| `CarouselDisk.vue` | 404 | Ring geometry (`rotateX(-15deg)` back-higher) + orbit spring + per-card falloff |
| `ScenePreviewHost.vue` | 404 | Mounts a real scene target scaled into a card; interactive; LOD-throttled |
| `StageArrows.vue` | 245 | Two glass dock-arrows the `TransportDock` hosts in stage mode |
| `useSceneStage.ts` | 306 | open/close + zoom choreography orchestration; commit via `runSceneSwitch` |
| `sceneStageRegistry.ts` | 291 | id → { target component, minimal idle-state adapter, LOD tier } |
| `useLivePreviewLOD.ts` | 299 | shared throttled clock + content-visibility gating + concurrent-loop cap |
| `useCarouselOrbit.ts` | 232 | ring-angle `SpringProgress` + shortest-delta spin + per-card transform |
| `useStageLight.ts` | 143 | `--stage-light` hover-brighten / focus-shift |
| `previews/` (8 files) | ~460 | 7 thin per-scene idle-state adapters (cube/square/easing/spring/sequence/motionPath + types/index) |
| `stageDockKey.ts` | 50 | dock injection key for the arrow swap |
| `TransportDock.vue` | +86 | stage-mode arrow swap of transport cells |
| `App.vue` | +117 | Teleport `<SceneStage>` sibling; zoom-out transform; commit wiring |
| `test/scene-stage-previews.test.ts` | 99 | preview-registry unit test |
| `docs/tranches/N/STAGE-SPEC.md`, `IMPL-BLUEPRINT.md` | 120+93 | the first-principles atomic-stage spec + impl blueprint |

Plus scratch files that must NOT be resurrected: `probe.mjs`, `probe2.mjs`, `snap-one.mjs`, `debug-candidate-c.mjs`, `verify-candidate-c.mjs` (root-level throwaway capture scripts).

### A-2 — GOOD idea #1: `useCarouselOrbit` — a single-spring interruptible ring

**Severity: info (high-value salvage) | Evidence:** `git show n-stage-impl:demo/@/components/custom/scene-stage/composables/useCarouselOrbit.ts:76-118`.

One `SpringProgress` runs in the *angular* space the cards are placed in (`initial`, `response:0.55`, `dampingFraction:0.9`, `respectReducedMotion:true`). Card *i* sits at `i×step − ringAngle`; spinning a card to front re-seats the spring target along the **shortest signed arc** (`setTargetIndex`). The per-card visual falloff (opacity/scale/brightness/blur/z-index) is a pure function of `|angle|` sampled off the LIVE spring value, so the whole ring eases as one interruptible motion — a mid-spin re-target is velocity-continuous because it re-seats the same spring. `spring.play` auto-stops on settle and auto-resumes on `setTarget` (one `play` covers the lifetime). Imports only `SpringProgress` from `@mkbabb/keyframes.js` — value.js-free, `proof:boundary`-clean.

**This is the canonical dogfood of kf's own physics tier and should be lifted almost verbatim.** Post-R the LIGHT static barrel still exports `SpringProgress` (CLAUDE.md "LIGHT" surface), so the import survives unchanged. The `iOS-smooth` no-overshoot register is deliberately chosen so the ring does not overshoot and re-trigger LOD churn on flank cards — a real insight, not a guess.

### A-3 — GOOD idea #2: `useLivePreviewLOD` — the SLOW fix, structurally

**Severity: info (high-value salvage) | Evidence:** `git show n-stage-impl:demo/@/components/custom/scene-stage/composables/useLivePreviewLOD.ts:11-88`.

The carousel mounts up to 7 LIVE previews. The composable is the single LOD authority: ONE shared `RAFPlayback` loop (the ENGINE owns it — inv ζ, no raw `requestAnimationFrame`) publishes a monotonic frame epoch + `nowMs`; each preview reads a per-card `tick` token that advances only on frames that card is *due*. Cadence bands: FRONT → full fps; FLANK → ~15–20 fps frame-skip; REAR/off-screen → paused via `content-visibility:auto` + `contentvisibilityautostatechange` (IntersectionObserver `@supports-not` fallback). A concurrent-full-loop cap (`maxConcurrentFull`, default 2) demotes excess full-eligible cards, and the single WebGL preview (amiga) **counts double** against the cap. Imports only `RAFPlayback` — value.js-free.

This is the answer to the STAGE-SPEC S6 "the SLOW fix" and the exact pattern MEMORY.md's "managed animations / shared rAF" note describes. It is directly reusable and, notably, **glass-ui BG independently converges on the same idea** (BG.W-VIZ-PREVIEW-LIVE: 11 distinct live previews, ≤1 live GL context, per-card pixel-hash differs — BG FINAL.md WS5). kf's demo should own its own copy (it drives kf-scene targets, not glass-ui viz cards) but the two validate each other's architecture.

### A-4 — GOOD idea #3: the atomic-stage method + verified geometry

**Severity: info | Evidence:** `git show n-stage-impl:docs/tranches/N/STAGE-SPEC.md` (S0–S10); `IMPL-BLUEPRINT.md` "Verified facts".

STAGE-SPEC decomposes the choreography into 11 atomic stages, each with (a) a precise correct-behaviour definition, (b) the dogfood mechanism (which kf primitive drives it), and (c) a *measurable* acceptance criterion verified LIVE in Chrome via chrome-devtools-mcp (perf trace where FPS matters S2/S5/S6/S7; computed-style/rect read where geometry matters S4/S8; screenshot for aesthetic S10). The geometry is empirically pinned: `rotateX(-15deg)` → back higher (measured back.top 155 < front.top 293; `+deg` was the inverted bug), `perspective:1100px`, `perspective-origin:50% 42%`, cards `rotateY(a) translateZ(R) rotateY(-a)` counter-rotated to face the user. **Do not re-derive this** — the numbers are live-verified and the "measure every stage" method is exactly the gate-blindspot cure MEMORY.md records (green source-shape gates miss appearance/interaction; audit the running demo).

### A-5 — GOOD idea #4: theatrical downlight via registered `@property`, grid-paper never black

**Severity: info | Evidence:** `git show n-stage-impl:…/SceneStage.vue:265-405`.

`@property --stage-light` (∈ ~[0.78,1]) and `@property --stage-pool-x` are registered custom properties so the downlight *interpolates* (the whole point of registration). A dim plate scrim sits over the existing `.grid-background` paper — modulated by `--stage-light`, **never black** (`calc(84% + (1−--stage-light)*10%)`), with a clip-path cone (narrow apex, wide floor) and a floor pool that slides toward a hovered flank. This is the "theatrical, not murky, reads in light AND dark" aesthetic S10 required, and it dogfoods kf's own registered-property interpolation story.

### A-6 — GOOD idea #5: DOM position is CORRECT (Teleport sibling, outside the VT subject)

**Severity: info (the load-bearing correctness the two dead attempts lack) | Evidence:** `SceneStage.vue:20,217`; contrast R-audit `docs/tranches/R/audit/demo-scene-switcher.md` Finding 5.

`SceneStage.vue` is a `Teleport to="body"` top-layer container, a SIBLING to the keyed `<Suspense>` (never a `KeepAlive` wrapper — respecting the B.W3 async-loader blocker). This means the stage is **outside** `.scene-host`'s `view-transition-name: scene-subject` (App.vue:470-471) — chrome is not captured into the scene VT snapshot. The Q.WC3 `SceneSwitcherCarousel` got this exactly wrong (mounted inside the VT subject, R-audit Finding 5). The shelf's DOM architecture is the reference to preserve.

### A-7 — OBSOLETE #1: every target path predates R's demo scene-fusion

**Severity: high (blocks verbatim resurrection) | Evidence:** shelf `IMPL-BLUEPRINT.md` cites `CubeTarget.vue` / `SquareInstrument.vue` / `EasingTarget.vue` at pre-fusion paths; current tree has `demo/scenes/cube/CubeTarget.vue` (verified `ls demo/scenes/cube/`).

R.W5 fused scenes into `demo/scenes/<name>/` (each dir now holds `<Name>Scene.vue` + `<Name>Target.vue` + composables + keys, colocated — verified for all 8: amiga/cube/easing/morph/motion-path/sequence/spring/square). The shelf's `sceneStageRegistry.ts` id→target map, and every `previews/*.ts` adapter, references the OLD flat `demo/<scene>/` or `demo/@/components/custom/` locations. **This is a mechanical re-path, not a redesign** — and R's fusion actually makes the shelf's ScenePreviewHost architecture *stronger*, because the live-subject `…Target.vue` is now already separated from the heavy `…Scene.vue` controls, colocated per scene, which is precisely the separation the shelf's "mount the target, not the scene" plan needed. There is also a 9th scene now (`morph`) absent from the shelf's 7-preview registry — the resurrected registry must enumerate the fused set from `demo/app/scenes.ts`, not a frozen list.

### A-8 — OBSOLETE #2: the bespoke `TransportDock`→arrows swap is a second-authority dock surface

**Severity: high (design collision with glass-ui BG) | Evidence:** shelf `TransportDock.vue` +86 / `StageArrows.vue` 245 / `stageDockKey.ts` 50; glass-ui BG.W-DOCK-INPLACE-MORPH + BG.W-SHELL-DOCK-DRY (BG FINAL.md WS2).

The shelf morphs the bottom `TransportDock`'s transport cells into two L/R arrows during stage mode via a dock injection key — a hand-rolled dock-content swap. glass-ui BG now ships (a) `BG.W-DOCK-INPLACE-MORPH`: an in-dock BUTTON flips the REAL dock V↔H in place via a liquid teardrop (delete the modal + synthetic + VT-crossfade), and (b) `BG.W-SHELL-DOCK-DRY`: collapse the two shell docks → ONE morphable nav-dock instance. Re-rolling a bespoke arrow-swap on top of a library that now provides a first-class dock-morph primitive re-creates the single-authority violation the R-audit named as the carousel's cardinal sin (`docs/tranches/R/audit/demo-scene-switcher.md` Finding 2). **The resurrection should dogfood glass-ui's dock morph** (or express the arrows as ordinary `DockIconButton`s inside the *existing* `ChromeDock` authority) rather than mint a parallel `stageDockKey` context.

### A-9 — The two dead attempts encode three transferable pitfalls

**Severity: medium (charter guardrails) | Evidence:** R-audit Findings 1,2,5; shelf inventory.

1. **Commit-never-wired** (Q.WC3 `SceneSwitcherCarousel`): the swipe-settle mechanic's `onScroll` was a documented no-op (`void nearestCenterId`), so a swipe never committed a scene — only an explicit tap did (R-audit Finding 1). *Guard:* the resurrection MUST wire commit-on-settle (`scrollend`/spring-settle → `runSceneSwitch`), gated by an observable the perf gate can read (the shelf's `frontIndex`/`spinning` reactive mirror already gives this).
2. **Second-authority surface** (both attempts): a phone-only carousel at `max-width:720px` (Q) and a bespoke dock-key arrow swap (N) each created a scene-nav authority parallel to `ChromeDock`'s `Select`. *Guard:* one authority. `ChromeDock` opens the stage; the stage commits back through `runSceneSwitch` (App.vue:382); no `max-width` visibility fork.
3. **Chrome-inside-VT-subject** (Q): the carousel lived inside `scene-subject`, so it was snapshotted and morphed as scene content (R-audit Finding 5). *Guard:* the shelf already cures this (A-6) — keep the Teleport-sibling DOM position.

### A-10 — Resurrection design brief (seed for a dedicated S band)

**Severity: info (deliverable) | Evidence:** synthesis of A-1…A-9 + current architecture (`demo/app/useSceneTransition.ts`, `scene-transition.css`, `ChromeDock.vue`).

A CORRECT, single-authority, gestalt 2026 scene-switcher:

- **Invocation (single authority).** `ChromeDock`'s scene affordance opens the stage (the same `@switch-scene`/Select surface — no new authority). On open, the live scene *zooms out* (dogfood: a `SpringProgress` on the scene-host `scale`/`translate`, response ~0.6 / damping ~0.85), controls + dock chrome fade.
- **The disk.** Lift `useCarouselOrbit` verbatim (A-2); the verified `rotateX(-15deg)` geometry (A-4); the registered-`@property` downlight over the never-black grid-paper (A-5).
- **Live previews, fast.** Lift `useLivePreviewLOD` (A-3); re-path `sceneStageRegistry` onto the fused `demo/scenes/<name>/…Target.vue` set enumerated from `demo/app/scenes.ts` (A-7), now including `morph` and the WebGL amiga outlier (double-cap).
- **Commit-on-settle.** Spin-to-front (shortest signed delta) → on spring settle *or* `scrollend`, `runSceneSwitch(pickedId)` (A-9 pitfall 1) — which already routes through glass-ui's typed View Transition (`useSceneTransition.ts`: `forward`/`backward` over the single `scene-subject` name, focus route on `finished`, PRM/no-VT degrade free). The reverse-zoom mirrors the open.
- **Dock integration by dogfooding, not re-rolling.** Express the L/R controls as ordinary entries in the existing dock, or drive them through glass-ui BG's in-place dock morph once 5.0.0 lands (A-8) — never a parallel `stageDockKey` context.
- **DOM position.** Teleport-to-body sibling to the keyed `<Suspense>`, outside `scene-subject` (A-6).
- **Method.** Build + verify one atomic stage at a time against the running demo via chrome-devtools-mcp, per STAGE-SPEC's measurable acceptance (A-4) — this is the gate-blindspot cure, not decoration.
- **PRM.** Every beat snaps under `prefers-reduced-motion` (the springs' `respectReducedMotion:true` already gives this; the View-Transition PRM degrade is free in glass-ui's `view-transition.css`).

Wave-shape: **S-band "scene-stage"** = (1) re-path + enumerate registry off fused scenes; (2) lift orbit + LOD engines with `proof:boundary` re-verify; (3) stage overlay + downlight + zoom choreography; (4) commit-on-settle wiring + a perf/geometry gate (the shelf's `frontIndex`/`spinning` mirror is the observable); (5) dock-morph dogfood — GATED on the glass-ui 5.0.0 consume-edge (Part B). Do NOT resurrect the scratch `*.mjs` probes; author real gates.

---

## Part B — glass-ui 5.0.0 runway

### B-1 — kf pins `~4.0.0`, runs 4.0.1, against a 4.2.0 HEAD; 5.0.0 is unbuilt

**Severity: high | Evidence:** `package.json:260` `"@mkbabb/glass-ui": "~4.0.0"` (optionalDependencies); `node_modules/@mkbabb/glass-ui/package.json` version `4.0.1`; glass-ui repo `package.json` version `4.2.0`; BG FINAL.md + BH PLAN.md status lines.

The **tilde** pin `~4.0.0` admits only `4.0.x` — the demo is frozen at 4.0.1 and cannot even resolve the published 4.2.0 line (4.3.0 is parked unmerged on `release/4.3.0`). Meanwhile **glass-ui 5.0.0 does not exist**: BG (integration/verification, ≈110 waves across 12 workstreams) and BH (de-indirection + BREAKING export reshape, ≈30 waves / 14 family rows) are both *tranche-development complete but with nothing landed on `src/`* (BG FINAL.md: "NO `src/` lands until the user greenlights the build phase"; BH PLAN.md: "awaiting execution greenlight"). They cut **jointly as one 5.0.0** only after BG's WS12 capstone (BH §2 decision 4, §3). So kf-S cannot schedule an adoption date — it schedules a *deliberate consume-edge* that fires when the joint 5.0.0 publishes. The immediate honest note: the current tilde pin is *stale* and will silently miss the entire 4.2.0→5.0.0 arc unless deliberately unfrozen.

### B-2 — What BG changes (integration/verification; the visual + dock surface kf consumes)

**Severity: info | Evidence:** BG FINAL.md §1–§2 wave roster; `git -C glass-ui log tranche/BG --oneline`.

BG is explicitly *"assembly- and verification-bound, not primitive-bound"* — WIRING + over-correction fixes + a paint-that-gates release, not new primitives. The changes touching kf's demo consume-edge:

- **Dock (WS2, 11 waves).** `BG.W-SHELL-DOCK-DRY` collapses two shell docks → ONE morphable nav-dock (preserves the mobile Sheet trigger); `BG.W-DOCK-INPLACE-MORPH` deletes the modal/synthetic/VT-crossfade for a real in-place V↔H liquid-teardrop flip; `BG.W-DOCK-PERSISTENT-CUT` removes the persistent ℱ brand + Fourier egg atop both docks (Foundations rejoins nav); `BG.W-DOCK-FISSION-WIRE` DRYs the goo bridge onto ONE `GooFilter`; `BG.W-DOCK-DECOMPOSE` carves `GlassDock.vue` 711L → leaves; `BG.W-DOCK-MORPH-UNIFY` → ONE `useDockSpring` factory. Recent commits confirm these landing on `tranche/BG` (e.g. `9b156fe8`, `95276ad6`, `8bf41d0b`).
- **Glass standardization (WS3, 11 waves).** `BG.W-GLASS-DEFAULT-DEFINITION` (GA-1) splits glass into a transmissive DEFAULT + a `.glass-defined` control tier (`--glass-floor-fill`) — this can restyle kf's consumed `GlassPanel`/dock surfaces; `BG.W-GLASS-BLUR-PEER` unifies to ONE 8px resting blur radius across dock/button/card/menu; `BG.W-CARTOON-INK-GAMUT` kills the maroon.
- **Specular/sheen (WS8 + WS3).** The saga is **being resolved, not turned off**: `BG.W-GLASS-SUFFUSE-UNIVERSAL` (iOS-27 bevel material floor + atomic `useSpecularPointer` fold), `BG.W-GLASS-DYNAMICS` (neutral specular hairline as read-carrier at the calmer blur), `BG.W-GLASS-REFRACT-WEBGL` (dual-stack `glass-refract.glsl.ts` Tier-1 + `glassShader.wgsl` Tier-2), `BG.W-GLASS-LIQUID-TRANSITION` (press-swell as a second reader of the existing press spring). **This contradicts kf MEMORY.md's stale note** ("glass-stage sheen is a born-RED HANDOFF until glass-ui 3.8.0 specular=off").
- **SegmentedTabs/aria (WS4).** `BG.W-TABS-KEYBOARD-LEAF` carves `SegmentedTabs` (512L) → `useTabRovingFocus` + `useTabResponsive`, **44px tap-target floor preserved** — the aria/keyboard ask from prior tranches is being carried, not dropped.
- **Siri capabilities (WS6, NEW, 4 waves).** A glass island + WebGL waveform + a "Search or Ask" pill; new published subpath `/siri-island`. Additive — no kf consume unless kf opts in.
- **Route transition (WS1).** `BG.W-ROUTE-TRANSITION` collapses the shell route pile to a bare keyed atomic swap (deletes 2 no-op `startViewTransition`) — kf's demo owns its OWN scene View-Transition (`useSceneTransition.ts` consumes glass-ui's `startViewTransition` from `/motion-core`); verify that helper's signature survives WS1 (the two-arg `(mutate, {types})` shape kf depends on).

### B-3 — What BH changes (the BREAKING 5.0.0 reshape) and its (small) blast radius on kf

**Severity: medium | Evidence:** BH PLAN.md §2, §4; blast-radius greps over `demo/`.

BH is the actual major-version break. The consumer-visible changes and their kf-demo impact:

| BH change | kf-demo hits | Severity for kf |
|-----------|:------------:|----------------|
| Drop `./api` subpath key | `grep glass-ui/api demo/` = **0** | none |
| `src/subpaths/` (79 barrels) die → regen'd entry-set; kf's named subpath imports (`/forms`, `/dock`, `/tabs`, `/styles`, `/dark`, …) are the *surviving* colocated barrels | 56 files consume glass-ui; all via named subpaths that BH's regen preserves | low — verify each survives the regen |
| `goo-blob → blob` rename | `grep goo-blob demo/` = **0** | none |
| `size` middle rung `default`→`md` | `grep 'size="default"' demo/` = **0** | none |
| `density`→`size` (dock compact/comfortable/spacious/audacious → sm/md/lg/xl); DELETE `DockDensity`/`ConfiguratorDensity` | `grep 'density=' demo/` = **0** | none |
| motion booleans (`draggable`/`pressable`/`spring`/`liquidDrag`) → single `motion` axis | 1 hit | trivial — audit the one site |
| `GlassPanel variant`→`tier`; `Surface` 3→4-rung | `GlassPanel` used WITHOUT `variant` (EasingCurveCanvas.vue:2, default only) | none — verify at consume |
| CLAUDE.md hard-delete (glass-ui's own) | n/a (glass-ui-internal) | none |
| NEW `/axes` (types-only) + `/siri-island` published subpaths | opt-in | none |

**kf's demo is well-insulated from the BH grammar break** — the migration is a handful of import-path re-verifications, not a prop-rename sweep. The one real obligation is confirming kf's consumed subpaths (`/forms` ×8, `/dock` ×6, `/icon-tooltip` ×5, `/tabs` ×4, `/labeled-field` ×4, `/dark` ×4, `/metric-badge` ×3, `/keyboard` ×3, `/controls` ×3, `/motion-core` ×2, `/status-dot` ×2, `/glass-panel`, `/header-ribbon`, `/toggle-chip`, `/animated-digit`, `/styles`) all survive BH's `regen-exports.mjs` entry-set (BH §4 B2.1-swap re-derives against the landed post-WS12 surface).

### B-4 — Dock double-click: the KS-DOCK `@dblclick` reference is the Fourier egg, NOT (necessarily) the reported scene-Select double-click

**Severity: medium (honest uncertainty) | Evidence:** glass-ui `docs/tranches/BG/keystones/KS-DOCK.md:426-429`; kf MEMORY.md `project_dock_doubleclick.md` ("glass-ui dock buttons require double-click; NOT transition-related; fix in glass-ui root").

The only `@dblclick` KS-DOCK names is the vestigial ℱ-wordmark / `fireRedraw` Fourier-egg cluster (`useLongPress:38`, `@dblclick:177-283`), which `BG.W-DOCK-PERSISTENT-CUT` DELETES. That is a *removal of an easter-egg double-click*, not obviously a fix for the reported "dock buttons require double-click to activate" defect kf logged. `BG.W-DOCK-DECOMPOSE` + `BG.W-DOCK-MORPH-UNIFY` + `BG.W-DOCK-BUSY-SINGLE` (4 busy-signals → 1 `morphing` ref, retire dead `@transitionend`) are the plausible root-cause cures (a stale busy/morph latch swallowing the first click), but **no BG wave explicitly names the single-vs-double-click activation bug**. kf-S must treat this as UNVERIFIED: re-test the double-click against the built 5.0.0 dock and, if it survives, file a fresh born-RED handoff to glass-ui rather than assume BG cured it incidentally.

### B-5 — Adoption is gated + should be deliberate, not a version-range auto-flip

**Severity: high | Evidence:** BH §2 (joint 5.0.0, clean-break, no compat aliases); B-1 (unbuilt); MEMORY.md re-pin history (`project_glassui_specular_consume_edge.md`: "kf pins ~3.5.1 (tilde, not caret)" — the tilde discipline is intentional).

Because 5.0.0 is a BREAKING clean break with **no backwards-compat aliases** (BH §2 decision 2), and because kf's demo visual-lock/demo-smoke gates will re-baseline against BG's new specular material + unified 8px blur + restyled glass default, kf must NOT widen the pin to a caret that would auto-consume 5.0.0. The re-pin history (tilde `~`, not caret `^`) is the correct discipline. kf-S schedules a *consume-edge band* that fires only after glass-ui publishes the joint 5.0.0: bump `~4.0.0 → ~5.0.0`, re-verify every consumed subpath, re-baseline visual gates, adopt the dock morph for the scene-stage, and re-test the double-click.

---

## Tranche-S implications

Concrete, wave-shaped recommendations. Two independent tracks (scene-stage can proceed on the shelf salvage now; the dock-morph dogfood is GATED on the glass-ui consume-edge).

1. **S-band `scene-stage` (resurrection) — proceed now on shelf salvage.**
   - **W-registry-repath.** Enumerate the preview registry from `demo/app/scenes.ts` (all 9 fused scenes incl. `morph`); re-path `sceneStageRegistry` + `previews/*` onto `demo/scenes/<name>/…Target.vue`. Gate: registry resolves a non-null target per scene row (runtime, not grep).
   - **W-orbit-lod-lift.** Lift `useCarouselOrbit` + `useLivePreviewLOD` verbatim; re-run `proof:boundary` to confirm LIGHT-barrel/value.js-free imports still hold post-R. Gate: `proof:boundary` GREEN; a perf trace ≥55 fps with all previews mounted (the STAGE-SPEC S6 number).
   - **W-stage-overlay.** Teleport-sibling overlay (A-6) + registered-`@property` downlight (A-5) + verified `rotateX(-15deg)` geometry (A-4) + zoom-out `SpringProgress`.
   - **W-commit-on-settle.** Wire spin-settle/`scrollend` → `runSceneSwitch` (the existing typed-VT seam); expose `frontIndex`/`spinning` as the gate observable. Gate: a swipe/arrow COMMITS a scene (the cure for the two dead attempts' cardinal defect). Do NOT resurrect the scratch `*.mjs` probes — author real gates.

2. **S-band `glassui-consume-edge` — GATED on glass-ui 5.0.0 publish; specify now, fire later.**
   - **W-pin-unfreeze.** Replace the stale `~4.0.0` (frozen at 4.0.1) — as an interim, decide whether to catch up to the published 4.2.0 line first, or hold at 4.0.x until 5.0.0. Author the pin as `~5.0.0` in the consume-edge, never a caret (preserve the tilde discipline).
   - **W-subpath-survival.** Verify each of kf's ~17 consumed glass-ui subpaths survives BH's regen'd entry-set; re-point any that BH renamed (none expected — grep-clean on `/api`/`goo-blob`/`density`/`size="default"`).
   - **W-visual-rebaseline.** Re-baseline demo-smoke visual-lock gates against BG's new specular floor + unified 8px blur + `.glass-defined` split; retire the STALE MEMORY.md "specular=off handoff" expectation (B-2).
   - **W-dock-morph-dogfood.** Replace the shelf's bespoke `TransportDock`→arrows swap (A-8) with glass-ui BG's in-place dock morph (or ordinary `DockIconButton`s in the single `ChromeDock`). This is the join between the two S-bands.
   - **W-doubleclick-verify.** Re-test the dock double-click against built 5.0.0 (B-4); if it survives, born-RED handoff to glass-ui — do NOT assume BG cured it.

3. **Chronic/deferral folds this lane surfaces for S.**
   - DM-24 (shelved n-stage) is REVIVED, not KILL — reclassify from "redundant" to "salvage source for S-band scene-stage."
   - The kf MEMORY.md `project_glassui_specular_consume_edge.md` note ("sheen born-RED handoff until specular=off") is STALE — BG resolves specular affirmatively; update the memory at S close.
   - The `project_dock_doubleclick.md` chronic stays OPEN with a sharpened disposition (B-4): not cured by any *named* BG wave; verify-or-handoff at the consume-edge.

4. **Guardrails (charter, absolute).** One scene-nav authority (`ChromeDock` opens, `runSceneSwitch` commits); chrome outside the `scene-subject` VT; commit-on-settle wired (never a `void`-discarded read); every load-bearing motion dogfoods a kf LIGHT-barrel primitive on `RAFPlayback` (inv ζ); every atomic stage verified LIVE against the running demo (the gate-blindspot cure), not by source-shape.

---

### Evidence index (primary citations)

- Shelf: `git show n-stage-impl:demo/@/components/custom/scene-stage/composables/{useCarouselOrbit.ts,useLivePreviewLOD.ts}`, `…/SceneStage.vue`, `docs/tranches/N/{STAGE-SPEC.md,IMPL-BLUEPRINT.md}`; `git diff master...n-stage-impl --stat`; HEAD `e2375b8`.
- Dead attempts: `docs/tranches/R/audit/demo-scene-switcher.md` (Findings 1,2,5).
- Current architecture: `demo/app/useSceneTransition.ts`, `demo/app/scene-transition.css`, `demo/app/App.vue:382,470-471`, `demo/@/components/custom/dock/ChromeDock.vue`, `demo/scenes/<name>/`, `demo/app/scenes.ts`.
- Pins: `package.json:257,260`; `node_modules/@mkbabb/glass-ui/package.json` (4.0.1); glass-ui `package.json` (4.2.0).
- glass-ui runway: `/Users/mkbabb/Programming/glass-ui/docs/tranches/BG/FINAL.md`, `.../BH/PLAN.md`, `.../BG/keystones/KS-DOCK.md:426-429`; `git -C glass-ui log tranche/BG --oneline`.
- Blast radius greps (all over `demo/`): `glass-ui/api`=0, `goo-blob`=0, `density=`=0, `size="default"`=0, `GlassPanel variant`=0 (used default), motion-booleans=1.
