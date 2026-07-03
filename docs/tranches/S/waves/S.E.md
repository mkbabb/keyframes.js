# S.E — The Scene Stage (DK-64 barrel select · the pass-3 converged design, prototype-proven)

> **This is a TRANCHE-DEVELOPMENT phase, NOT implementation.** This document is the wave-spec
> for band **S.E** of Tranche S, **rewritten in full** from the pass-3 first-principles design
> loop that converged **100/100 under both critics across 3 rounds** (pass3: stage-final-design.md,
> stage-final-tech.md). The binding design of record is the pair
> `docs/tranches/S/audit/pass3/stage-design-v1.md` + `stage-design-v2.md` — **v2 is the delta
> that rules** wherever the two conflict; v1 stands verbatim where v2 is silent (v2 header).
> The **frozen v3 prototype build** in the worktree
> `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_2fbb9dbc-c40-1` is "the binding
> spec for the S.E wave" by the design critic's closing ruling (pass3: stage-final-design.md §5)
> and is this band's **salvage source**; its `demo/stage-proto/gates/` drivers are the **gate
> skeletons**. This document supersedes the prior SPEC-v3-derived S.E.md; the SPEC-v3 §S.E
> guardrails it carried remain absorbed below (§0.2). Nothing runs until the owner authorizes an
> impl drive (inv-16). A wave is CLOSED only when its born-RED gate is GREEN **re-run on the
> merged tree** (T4), exit code recorded in PROGRESS.md, and S.Z2 re-executes that oracle at
> close. **Branch:** `tranche-s-dev` · **Track:** demo/design + gates (+ one external
> consume-edge at S.E8).

---

## 0. Band charter — the theatrical scene-switcher, converged and provable

### 0.1 What changed since the old band doc

The old S.E band was authored against SPEC-v3 §S.E with the `n-stage-impl` shelf as its salvage
source and p05 as its feasibility probe. Pass 3 went further: a first-principles design
(pass3: stage-design-v1.md), a **working prototype built and cured through three adversarial
critique rounds** (pass3: stage-proto-v{1,2,3}.md · stage-critique-{design,tech}.md ·
stage-recritique-{design,tech}.md), and a **dual 100/100 convergence** (pass3:
stage-final-design.md "FROZEN — this build is the binding S.E wave spec"; stage-final-tech.md
"100/100 … the pair is wave-spec-ready"). Consequences for this band:

- **The salvage source moved.** It is no longer the raw `n-stage-impl` shelf — it is the
  **v3 prototype worktree** (`wf_2fbb9dbc-c40-1`), which itself lifted the shelf's proven engine
  (p05's mechanical move), then **cured the two structural HIGHs the shelf never saw** (H1
  stale-arm, H2 VT double-capture) and the six design blockers (S1–S6). What the impl drive
  lifts is the *cured* code, not the shelf.
- **The commit story hardened.** "Commit-on-settle" (the old cardinal-defect cure) is upgraded
  to the **D1-locked commit funnel** — browse verbs LOCKED during `committing`, the arm latches
  the spring's **destination slot**, a 280ms dwell + 2000ms re-armable failsafe — proven by the
  **A–G adversarial gate roster** (§1.1), which is now the verbatim `proof:scene-stage-commits`
  spec.
- **The authority ruling strengthened.** The old band's "ChromeDock opens the stage; interim
  `DockIconButton` spin controls" is superseded: **the dock scene pill keeps its pixel identity
  but its actuation becomes `stage.open(currentSceneId)`; the Select's scene listbox is
  RETIRED** (pass3: stage-design-v1.md §3). One trigger → one browse surface → one commit edge —
  the strong form of single-authority. The L/R arrows are **stage-internal chrome**, so the
  shelf's second-authority dock surface (`StageArrows`/`TransportDock`/`stageDockKey`) is deleted
  rather than re-homed, and there are **no interim dock spin controls for S.E8 to retire**.
- **glass-ui 5.0.0's dock morph is demoted from dependency to OPTIONAL refinement** of the
  pill's open *animation* (pass3: stage-design-v1.md §3). The stage ships against the held
  ~4.0.x pin. S.E8 keeps the external consume-edge obligations (pin bump, re-baseline, fold rows
  51/52/53/55) but nothing in the stage waits on it.
- **The previews are miniatures, by mandate.** The real-target path was withdrawn as mis-costed
  (the scenes are `createGlobalState` module-singletons — mounting a real target in a card
  aliases the live scene's store); purpose-built per-scene miniatures are the LOD tier-2
  contract, `square` stays real, `amiga` is poster+GL-at-front-settled (pass3:
  stage-design-v2.md D3; stage-critique-tech.md §3 H3).

### 0.2 Charter guardrails (absolute — the old band's roster, reconciled)

1. **ONE nav authority — the strong form.** The scene machine + `runSceneSwitch` is the only
   commit edge; **the dock scene pill (pixel-identical) opens the stage; the scene Select
   listbox is retired**; no `max-width` visibility fork; no second switcher surface anywhere
   (pass3: stage-design-v1.md §2.1/§3). Programmatic nav (router hash, SharePopover restore,
   gates' `navToScene`-by-hash) is untouched — the authority is the machine.
2. **Commit-on-settle, LOCKED and observable.** The D1 funnel (§1.1): never a `void`-discarded
   read (the Q.WC3 cardinal defect), never a stale arm (the H1 successor defect). Cancel and
   commit are structurally distinct.
3. **Stage chrome OUTSIDE the `scene-subject` VT.** Teleport-to-body sibling of the keyed bare
   `<Suspense>`; **no `view-transition-name` anywhere in the stage tree**; and — the D2
   strengthening — the overlay is **absent from the live DOM by the end of the VT update
   callback** (pass3: stage-design-v2.md D2; stage-proto-v2.md §2).
4. **Dogfood inv ζ.** Every load-bearing motion is a kf LIGHT-barrel primitive on `RAFPlayback`
   (`SpringProgress`, `stagger`, `decayRest`, `NumericAnimation`); zero raw rAF;
   `proof:boundary` stays GREEN (p05 F1/F3; re-proven in every prototype round).
5. **PRM snaps every beat** — proven in pixels (open 61ms, commit 75ms, dwell 0; pass3:
   stage-proto-v2.md §5).
6. **No scratch `*.mjs` probes.** Satisfied structurally: the named gate skeletons are the
   preserved runnable drivers in `demo/stage-proto/gates/` (adversarial · geometry · gl-proof ·
   fps · prm · vt-proof · warm-suspense · shots-v3), promoted to repo `proof:*` entries at S.E7.
7. **Live verification every atomic stage** (T8; chrome-devtools-mcp), never source-shape.
8. **Compose-row-D3 gate kept.** The registry enumerates from `demo/app/scenes.ts` (never a
   frozen list — p05 F5); the ninth (compose) row + its miniature are gated on **S.D3** landing
   `scenes/compose/`.
9. **The geometry numbers are PINNED, not re-derived** (§1.0) — re-deriving reopens the `+deg`
   inversion bug (r7 A-4/A-5/A-6; pass3: stage-design-v1.md §6 header).

### 0.3 CI-budget accounting (unchanged in shape from the old band; SPEC §9 SE-9, C-10)

The band adds **exactly TWO CI browser gates** — `proof:scene-stage-commits` (with the A–G
adversarial roster, S.E4→wired S.E7) and the **mobile commit gate @375** (S.E5→wired S.E7) —
both riding the **ONE shared chromium + one served dist from S.A2's net-deletion** (amortized,
not +2 launches). `proof:stage-geometry` (S.E2, + the during-commit clause) rides that **same
shared harness**. The fps/scripting budget is a **LOCAL GPU acceptance recorded in the wave doc
— NEVER a raw CI fps threshold** (C-10); the measured numbers are in §1.10. S.E does not re-red
the plane S.A0 greens.

### 0.4 Mode declarations (C-14 — one per wave)

- **S.E1 — REFINE (lift-from-prototype)** — the scene-stage tree + registry + miniatures land
  in the repo; author-fresh: the E1c compose row (D3-gated).
- **S.E2 — REFINE (lift) + token authoring** — the v3 lighting/occlusion stack; the
  `--stage-key-apex`/`--stage-key` tokens move from `proto.css` into `design-idioms.css`.
- **S.E3 — REFINE (lift) + polish-fresh** — choreography/gestures/payoff/affordances; the three
  final-round polish carries (hint re-seat, P4 marquee, hover/flick captures) are author-fresh.
- **S.E4 — REFINE (lift)** — the D1/D2-cured commit funnel + the `stage` VT type.
- **S.E5 — REFINE (lift)** — mobile v2 parameter deltas.
- **S.E6 — REFINE (lift) + REAL-GL author-fresh** — LOD/GL machinery lifts; the real Three
  renderer behind the proven lifecycle is authored fresh (the proto's GL body was a stand-in).
- **S.E7 — REWRITE (integration; author-fresh)** — App.vue mount, dock-pill rewire + Select
  retirement, real `useSceneTransition`, warm-then-gate, origin pause, gate roster wiring,
  the miniature maintenance artifact. **This is the band's honest remaining work.**
- **S.E8 — REFINE (external consume-edge)** — glass-ui joint-5.0.0; GATED on the publish.

### 0.5 Band DAG

```
S.D2 ──► S.E1 (8-scene core)   ;   S.D3 ──► S.E1c (compose row + miniature)
S.E1 ──► S.E2 ──► S.E3 ──► S.E4 ──► S.E5 ──► S.E6 ──► S.E7
S.E7 + [glass-ui 5.0.0 published] ──► S.E8   (else: structured HANDOFF + rows 51/52/53 RESIDUAL CARRY)
```

S.E1–S.E6 re-derive the design's six atomic build waves (pass3: stage-design-v1.md §18), each
now **mostly a lift** because the prototype already proved its substance; S.E7 is the
integration wave both critics named as the born-RED debt; S.E8 is the old band's external
consume-edge, kept, with the dock-morph edge **demoted to optional**. Each wave's gate must
pass before the next opens (the design's own atomic-build prescription, N/STAGE-SPEC working
method).

**Fold rows this band terminalizes (SPEC §4):** row **17** (DM-24 scene-switcher → BUILT, this
band), row **18** (`proof:scene-switcher-mobile` zombie → reborn as `proof:scene-stage-commits`
at S.E4 + the mobile commit gate at S.E5; the *retire* half is S.A4's), rows **51/52/53** (the
glass-ui HANDOFFs → re-entry at S.E8 on the joint publish; RESIDUAL-CARRY clause), row **55**
(glass-ui pin ~4.0.x → deliberate ~5.0.0 at publish → S.E8). **Explicitly NOT this band:** fold
row **71** (KfPillTabs/TransportDock) — panel primitive, not scene-nav; test → S.B7, promotion
→ S.D2 (unchanged from the old band; SPEC §9 X1-1).

**Rulings executed:** C-6 (zombie gate reborn — now with the A–G roster), C-7 (scene-switcher
substrate — the pill-opens-stage strong form supersedes the interim-DockIconButton reading),
C-10 (fps LOCAL, never CI), C-12 (pin held ~4.0.x; consume-edge only on the joint publish;
never caret), C-14, C-20/C-21 (S.E8 HANDOFF honesty). **Tenets:** T1 (runtime-tier closure),
T4 (DEVELOPED ≠ SHIPPED), T8 (interaction-axis + live verification), T12 (S.E8 is one of the
plan's exactly two external consume-edges). **Probes:** p05 (the shelf salvage — subsumed into
the prototype), p10 (arming-audit class).

---

## 1. THE PROVEN-CONTRACT INVENTORY (binding; the impl drive lifts these, it does not re-solve them)

Everything below is **proven live in the v3 prototype** — code + runnable driver + recorded
witness. An impl drive that re-derives any of it is off-charter; a drive that regresses any of
it REDs the corresponding gate.

### 1.0 Pinned geometry (do NOT re-derive — pass3: stage-design-v1.md §6; §P.3)

- Viewport: `perspective: 1100px; perspective-origin: 50% 42%` desktop · `900px` / `50% 52%`
  ≤640px (D8.3). Ring: `rotateX(-15deg)`, `transform-style: preserve-3d`.
- Card i (N from `scenes.ts`, step = 360/N): `rotateY(a) translateZ(R) rotateY(−a) scale(s)` —
  counter-rotated billboards, real Z depth.
- `R = clamp(240, 0.38·min(vw,1200), 440)` desktop · `clamp(150, 0.52·vw, 220)` mobile. Card
  width `clamp(220px, 24vw, 320px)` desktop · **80vw** mobile (D8.2), `aspect-ratio: 3/2`.
- Falloff (pure fn of `d = |a|/180`): scale `1−0.38d²`, opacity `1−0.5d²` (floor 0.5),
  brightness `1−0.22d²`, blur ramp past `d>0.55` cap 1px, `z-index = round((1−d)·1000)`.
- Zoom spring `response .6 / damping .85`; orbit `response .55 / damping .9`; light
  `response .3 / damping .9`; all `respectReducedMotion: true`. Floor reflections stay CUT.
- **Measured witnesses (stable across all three rounds):** back-card top 281 < front 468;
  width recede 508→430→290→192 monotone; min card opacity 0.50; `matrix3d` = rotateX(-15°);
  perspective 1100px (pass3: stage-proto-v2.md TL;DR; stage-recritique-tech.md §5).

### 1.1 The commit funnel — the H1 stale-arm cure + the A–G roster (pass3: stage-design-v2.md D1; stage-proto-v2.md §1; stage-proto-v3.md §5)

**The cure (structural, not patch):**

- **D1 LOCK:** browse verbs (`step`/`centerIndex`/drag/wheel/type-ahead) are **silent no-ops
  during `committing`** (dev-logged). `setTargetIndex` is the sole orbit mutator and every path
  to it is gated (independently re-derived + five novel interleavings tried and defeated —
  pass3: stage-recritique-tech.md §1.1). `armed === orbit.target === rested front` is an
  invariant.
- **D1.1 destination-slot arm:** a coasting Enter/Space arms `sceneAt(orbit.targetIndex)` — the
  decay-projected **destination**, never a passing slot. Pointerdown halts a coast; a ≤slop
  front-tap commits the halted front. No arm-in-transit path exists.
- **D1.2 event×state matrix** is binding (fan-in `requestCommit` = **BUFFER** via
  `pendingCommit`, drained on `carousel`; `committing × Esc` = **cancel, documented**;
  `fanTimer` cleared on cancel).
- **D1.3 belt:** failsafe **2000ms, reset on each (re-)arm** — a true belt, never the commit
  path; **280ms minimum dwell** before `fire()` (the payoff breath; makes
  `data-stage-phase="committing"` honestly paint — H6 cured; dwell = 0 under PRM).
- **D1.4 observables:** `window.__stageLastCommit = {id,t}` + `window.__stageArmedLog`
  (append-only `{id,t,cause: "tap"|"key"|"buffered"|"failsafe"}`) — the gate's interleaving
  witness. Cancel writes neither.
- **A latent salvage bug the cure surfaced is FIXED and must not regress:** `useCarouselOrbit`'s
  no-move re-seat parked without emitting a settled frame (`spinning` stuck true); same
  park-without-emit class fixed for the PRM open beat (pass3: stage-proto-v2.md §1, §5).

**THE `proof:scene-stage-commits` SPEC — the A–G adversarial clause roster, verbatim
(pass3: stage-design-v2.md D11 + stage-proto-v3.md §5 clause G). Happy paths kept (arrow-commit
AND drag-flick-commit land `machine.activeScene` + `__stageLastCommit.id` + hash + focus on
`.scene-host`), PLUS:**

- **A — gesture-during-committing (the H1 killer):** settle on A → tap front (arm A) → within
  100ms dispatch a `step`/drag toward B → assert the ring **rested on A**,
  `__stageLastCommit.id === A`, and `machine.activeScene === A === rested front`.
- **B — Enter-during-flick (the H1b killer; the faithful pre-cure falsifier):** start a
  multi-slot decay flick → Enter mid-coast → assert `__stageArmedLog.at(-1).id` equals the
  orbit's **target slot at press-time** AND the rested front AND the committed id. The arm may
  never be a passing slot.
- **C — observable honesty (H6):** primary witnesses are `__stageLastCommit` +
  `__stageArmedLog`; `data-stage-phase="committing"` MAY additionally be asserted (the dwell
  makes it paint) but NEVER as the sole witness, and never under PRM.
- **D — cancel distinctness:** arm → Esc before dwell elapses → NO `__stageLastCommit` write,
  no machine mutation, no hash move, no VT; stage closes on the cancel spring.
- **E — buffered fan-in commit:** Enter during fan-in → the buffered commit fires after
  `carousel` and lands normally.
- **F — single-write:** one commit → exactly ONE machine transition and ONE VT (instrumented
  `startViewTransition` + machine-transition counters) — the D2.4 router re-entrancy clause.
- **G — pointer-drag-during-committing:** arm A → a REAL disk drag/flick (past the 8px slop,
  `is-dragging` latched mid-drag) during committing → the ring rested on A and committed
  `A === rested front`. (The vivid H1 scenario the keyboard-only A/B omitted; added round 3.)

All seven reproduced GREEN live, including on the tech critic's **independent re-run** (pass3:
stage-recritique-tech.md §5; stage-proto-v3.md §5). **Prose correction to carry when wiring:**
clause A guards the lock-given-dwell; **clause B is the faithful H1b falsifier** against
pre-cure code (pass3: stage-recritique-tech.md §1.1 residual nit).

### 1.2 The VT-frame exit (pass3: stage-design-v2.md D2; stage-proto-v2.md §2)

- The overlay tears down **INSIDE the `startViewTransition` update callback**: ONE synchronous
  batch — `switchScene(armedId)` + `stage.phase = "closed"` + dock/controls inert release —
  then the callback awaits scene-readiness before returning. Witness:
  `__stageVT.overlayInDomAtUpdate === false`; VT-name set in the stage tree `[]`.
- **The commit path never enters `zooming-in`** — that phase is cancel-close ONLY.
- **VT types MERGE:** `["stage", forward|backward]` — never replace the direction (D2.3).
- `::view-transition-old(scene-subject)` under `stage`: **300ms ease-out opacity fade**, not
  `animation: none` (VT-3).
- **Mid-VT screenshot ruling (documented, accepted):** CDP capture pauses the compositor and
  aborts the VT — `overlayInDomAtUpdate` is the canonical witness ("state-witness >
  aborted-pixel"; pass3: stage-proto-v2.md §2, ratified stage-final-tech.md).

### 1.3 The warm-gate Suspense ordering (pass3: stage-design-v2.md D2.2; stage-proto-v3.md §4)

- `fire()` **pre-warms before the VT** (`await warmScene(armedId)` — the 280ms dwell absorbs
  it); inside the update callback, after the mutation batch, the callback **awaits the scene
  host's Suspense `onResolve`** (a per-commit gate promise), **bounded** — on timeout, resolve
  anyway (degraded crossfade, never hung).
- **Proven against a real ~300ms slow chunk:** warmed commit → update callback returns in
  **2.8ms**, no fallback ever mounts; cold commit → callback **blocks 308ms** on onResolve and
  still enters clean; the no-VT path captures the spinner frame the warm+VT path provably keeps
  out (pass3: stage-proto-v3.md §4, verbatim transcript).
- Bound: the design pins **350ms** (D2.2); the proto harness used a 2s ceiling to prove the
  block is on onResolve, not the bound. S.E7 pins the shipped bound at D2.2's 350ms with the
  stated timeout-resolve degrade.

### 1.4 The LOD contract — light = life (pass3: stage-design-v2.md D3/D9; stage-proto-v2.md §4; stage-proto-v3.md §2–3)

- **Miniatures are the tier-2 preview surface — MANDATE**, engine-clock driven (shared LOD
  `tick`, zero owned rAF, zero global-store reads). **`square` stays REAL** (genuinely
  instance-local). The honest claim: *"living dioramas that evoke each scene"* — only `square`
  (and front-settled `amiga`) are literal (D3.5).
- **amiga WebGL lifecycle:** poster at flank/rear (the ONLY poster in the system); the Three
  renderer + context created **only at front AND settled** (never mid-transit); on leaving
  front → poster immediately, `renderer.dispose()` on a **2s debounce** (re-front cancels it);
  `webglcontextlost` (once) → poster-permanent for the session; **≤1 GL context ever** —
  machinery proven via `__stageGLLog` (`creates:1 disposes:1 maxContexts:1`; pass3:
  stage-proto-v2.md §4).
- **Hysteresis band (D9.1):** mount lit at `|a| ≤ 1.5·step`, unmount at `> 2.5·step` — a
  multi-slot flick sweeps the band with zero mount/unmount churn.
- **Concurrency (D9.2):** `maxConcurrentFull = 1` desktop AND mobile; flanks idle at 18fps;
  amiga-at-front `cost = 2` policy kept.
- **`content-visibility` is DROPPED (D9.4):** the CV/IO pause path is deleted — including the
  dead `useContentVisibility` export (~60L, deleted round 3 with the header reconciled; pass3:
  stage-proto-v3.md §3). **`v-if` (the lit band) is the pause authority**; tab-hidden parking
  is `RAFPlayback`'s own rAF-clock park.
- **Visual/mount decouple (v3 B3):** `lit` = MOUNT authority (hysteresis, anti-churn);
  `showPreview = lit && a < OCC_END` = PAINT authority. A hysteresis-residual card is
  mounted-but-poster-faced; `willChange` rides `showPreview`. No bright miniature UI ever
  paints in the payoff penumbra (pass3: stage-proto-v3.md §2).

### 1.5 The lighting token registry + occlusion (pass3: stage-design-v2.md D4; stage-proto-v3.md §1)

- **Tokens (land in `design-idioms.css`):** the two-stop tungsten ramp beside the gold family —
  `--stage-key-apex: hsl(38 85% 72%)` / `--stage-key: hsl(46 60% 86%)` (`.dark`:
  `hsl(38 85% 68%)` / `hsl(45 65% 84%)`); registered `@property --stage-light`
  (`[0.78, 1.12]` — 1.12 is the D5 flare) + `--stage-pool-x` (stage-scoped registrations stay
  in `SceneStage.vue`). NOT the shelf's accidental progress-green.
- **Per-theme blend split:** dark beam = two-stop mix (apex 44% / mid 22%) under
  `mix-blend-mode: screen`; light = half mix under **`plus-lighter`**, beam above the dusk
  scrim. Pool re-keyed to the apex stop. Beam feather + blur ramp toward the base (P1).
- **Front card catches the light (D4.4):** the key-wash gradient on the front card's content
  layer (never the shell — glass-resting intact).
- **Penumbra ramp (D4.5):** flank preview content `saturate(lerp(1,.65,k))
  brightness(lerp(1,.72,k))`, `k` ramping continuously over `|a| ∈ [step/2, 1.5·step]`.
- **The paper (D4.6):** the stage-owned `.stage-grid` ghost built from the SAME
  `--graph-pitch`/`--graph-major` tokens, warm-graphite 6% dark / 8% light, pool-brightened —
  **proven over the real `.grid-background`** (condition 2 discharged for the proto substrate;
  S.E7 re-shoots over the real app page as a formality). Dusk floor **never pure black** (the
  96% mix cap).
- **Occlusion face-fade (v3 B1/B2):** per-card `occlusion ∈ [0,1]` off the ring angle —
  `OCC_START = 1.30·step` desktop / `0.55·step` mobile; `OCC_END = 1.90·step` / `1.00·step` —
  drives the opacity of the **whole card face** (preview wrapper + poster + nameplate +
  breadcrumb). Machine witness: every occluded card's face at **0.00/0.00** in all six states
  (pass3: stage-proto-v3.md §1). "What the light says wins over what the DOM keeps."
- **Unlit-tier legibility (D6):** the unlit face IS the poster-card face (glyph + serif name +
  mono breadcrumb + tone-tinted shell); labels ≥4.5:1 both themes, min 12px; glyph
  `opacity .5 saturate(.4)`, **no brightness crush**; flank shells carry the 12–16px
  anti-double-exposure backdrop-blur; arrows in the × close button's glass register (≥3:1).
- **§P protected list is binding:** dark-carousel composition · footlight system (per-scene
  crayon halo; D5 bloom only during committing) · real 3-D (§1.0 numbers) · light-is-life
  legibility · marquee typography + mobile marquee-below-ring · poster/unlit face · the commit
  spine. Regression = round failure (pass3: stage-design-v2.md §P; re-audited pixel-stable in
  both re-critiques).

### 1.6 The commit payoff choreography (pass3: stage-design-v2.md D5; stage-proto-v2.md §7)

On `committing` (~300ms, all on existing springs): beam flare (`--stage-light → 1.12`) +
footlight bloom (tint alpha ×1.5, scale 1.15) + the press (`translateZ(+40px)` on the armed
card via the orbit derive) + immediate marquee swap. The 280ms dwell guarantees the beat paints
before `fire()`; the flared frame IS the VT's old snapshot. Cancel exhales the same springs, no
VT. **The gold wedge is KILLED:** the glyph ghost renders only in the unlit `v-else` branch —
a lit card never renders its silhouette layer. Under PRM the payoff renders at rest values in
the single snap.

### 1.7 The affordance layer (pass3: stage-design-v2.md D7; stage-proto-v2.md §3 ledger)

`cursor: grab`/`grabbing` on the disk, `pointer` + hover press-scale on the front card only;
the one-time diegetic hint line (`drag to spin · tap to enter`, Fira Code mono-caption, at the
pool line under the front card) shown until the first user-committed spin, dismissed via
`kf-stage-hint-dismissed` (vueuse `useStorage`). Lifecycle proven in pixels (hint present on
first open, gone after spin). **Carry:** the proto seated the hint INSIDE the front card —
S.E3 re-seats it to the pool line (pass3: stage-recritique-design.md §1-S5).

### 1.8 Mobile v2 (pass3: stage-design-v2.md D8; stage-proto-v2.md §3)

Same component, same authority, same funnel — **no fork**. Deltas only: cull beyond ±2 slots
(hysteresis-disciplined), front card **80vw**, `perspective-origin 50% 52%`, front-only live,
narrowed beam, safe-area close, marquee below the ring at display scale. The two flanks peek as
lit slivers; **the sliver-label fade is a ratified tradeoff** (the occlusion cure fades the
edge labels with the face; the marquee names the front card — owner may restore clipped sliver
labels at S.E7 if wanted; pass3: stage-final-design.md §2).

### 1.9 PRM (pass3: stage-proto-v2.md §5)

Every spring `respectReducedMotion: true` → orbit/zoom/light SNAP; fan-in collapses; the
`stage` VT keyframe sits in the existing PRM `animation: none` bracket; dwell = 0. Proven under
emulated PRM: open→carousel 61ms, arm→commit 75ms, the LOOK survives in the shot pair. The
degrade matrix (no-VT → `useSceneSwap` spring dissolve; no `view-transition-type` → untyped
crossfade; JS-gesture failure → arrows/keys on the same funnel) stands (stage-design-v1.md §14,
as amended by D9.4).

### 1.10 The fps budget — MEASURED (LOCAL acceptance per C-10; never a CI threshold)

Recorded numbers (driver `gates/fps.mjs`, ANGLE-Metal GPU, 7-slot spin storm, dark @1440):

| Run | avgFps | minFps | median frame | max frame | frames >50ms | LoAF scripting | long tasks |
|---|---|---|---|---|---|---|---|
| round 2 (proto) | ~120 | 56–60 | 8.3ms | 16.7–17.8ms | 0 | ≈0ms | 0 |
| round 2 (critic's independent re-run) | 120 | 96.2 | 8.3ms | 10.4ms | 0 | 0ms | 0 |
| round 3 (post-occlusion re-run) | 120 | **97.1** | 8.3ms | 10.3ms | 0 | 0ms | 0 |

Budget (≥55fps · <8ms scripting/frame · no LOD-churn long task) **MET with headroom** (pass3:
stage-proto-v3.md §6; stage-recritique-tech.md §1.5). The D9.3 cuts are landed and load-bearing:
`.stage-dim` is a plain gradient scrim (no full-viewport backdrop-filter); card backdrop-filter
only on the lit ≤3; `will-change` only on lit cards. Caveats recorded: SwiftShader software
raster floors at ~24fps (compositing, not JS — LoAF 0ms throughout), which is why C-10 keeps
this LOCAL-GPU; consider a p95-frame metric over single-worst-frame when re-recording at S.E7.

---

## 2. The justified-deviation register (pre-authorized; an impl drive honors these, it does not "fix" them)

| # | Deviation | Status + authority |
|---|---|---|
| 1 | **Mobile cull uses `v-show`, not `v-if`** — culled cards are unlit (no preview host mounted); `v-show` removes the clutter without flick-time mount churn | ACCEPTED (pass3: stage-recritique-tech.md §3.2 — "equivalent observable"; aligned with D9.1 anti-churn) |
| 2 | **Transient >3-lit after a multi-slot spin** — a swept card stays lit through `[1.5,2.5]·step` | D9.1 working as specified; render cost capped by `maxConcurrentFull=1`; the v3 visual/mount decouple removes the *look* consequence (pass3: stage-recritique-tech.md §3.4; stage-proto-v3.md §2) |
| 3 | **The rAF direct-write ring (D9.3.4) is NOT built** — the ring binds through reactive `computed cards` | Pre-authorized-by-measurement: LoAF scripting 0ms, 0 long tasks — the reactive round-trip is not the bottleneck. Remains pre-authorized to build ONLY if the S.E7 integration trace regresses the budget (pass3: stage-proto-v2.md §10.3; stage-recritique-tech.md §3.3) |
| 4 | **Mobile sliver-label fade** (edge labels go with the occluded face) | Ratified tradeoff; restorable at owner's option (pass3: stage-final-design.md §2) |
| 5 | **No mid-VT screenshot** — CDP capture aborts the VT | `overlayInDomAtUpdate` is the canonical witness; ratified (pass3: stage-proto-v2.md §2; stage-final-tech.md) |
| 6 | **`__stageDebug`** dev-only introspection seam (`import.meta.env.DEV`) for deterministic gate coasts | ACCEPTED; never ships (pass3: stage-recritique-tech.md §3.6) |

Side-file hygiene to discharge when wiring (S.E7): `gates/adversarial-final.txt` predates
clause G and `gates/fps-trace-gpu.txt` is the round-2 run — refresh or drop both (pass3:
stage-final-tech.md non-blocking hygiene).

---

## S.E1 — Salvage lift + registry (the prototype tree lands in the repo)

**Mode: REFINE (lift-from-prototype).** **Deps: D1, D2** (the 8-scene core rides the carved
tree); **E1c deps D3** (compose row). *(Design §18 W1; p05 subsumed; D3.)*

### Charter

Lift the **cured v3 `scene-stage/` tree** from the prototype worktree into the repo:
`demo/@/components/custom/scene-stage/` (5 `.vue` + composables + `sceneStageRegistry.ts` +
miniatures) plus the `demo/stage-proto/` harness **as the interim gate substrate** (retired or
re-pointed at S.E7). The registry **enumerates from `demo/app/scenes.ts`** (home excluded) —
never a frozen list. The old E1's "author `previews/morph.ts`" is already discharged: the
prototype ships all 8 miniatures (morph included). **Lift vs fresh:** everything lifts; the
only author-fresh item is **E1c** — the compose registry row + compose miniature, gated on
S.D3 landing `scenes/compose/`.

### Scope items

- **S1 — Lift the scene-stage tree verbatim from `wf_2fbb9dbc-c40-1`** (the v3 state: D1/D2
  funnel, occlusion, decouple, CV-deleted LOD). Re-path onto the repo tree (p05-class
  mechanical move). Co-edit set: the whole `scene-stage/` dir + `demo/stage-proto/` move
  together; **never git-add the worktree `node_modules` symlink** (the R-drive lesson).
- **S2 — Registry re-derivation intact** (order/membership/tone/tier/glyph from `scenes.ts`).
- **S3 — E1c (D3-gated):** the compose row + a compose miniature honoring the D3 contract
  (engine-clock, no global-store reads) + the D3.4 pairing entry (S.E7 owns the artifact).

### The HARD GATE — `proof:scene-registry-mounts` (born-RED, runtime)

**What it asserts:** each registry row **mounts and renders a non-error idle miniature** (live,
`data-tick` advancing off the shared clock — the proto's live-render assertion, not mere
presence), against the running harness; `check` 0-error; `proof:boundary` stays GREEN
(LIGHT-barrel holds — proven every round). **Born-RED witness:** the repo tree
(`tranche-s-dev`) contains **no `scene-stage/` directory at all** — the gate hard-REDs today;
greens only when all 8 rows render. E1c extends it over the compose row post-D3.
**Falsifiability:** a row whose miniature mounts but never ticks fails the advancing-tick
clause; breaking a LIGHT import REDs `proof:boundary`.

### Cost + DAG

Mechanical lift + re-path; LOW risk (three rounds of proof behind it). E1c is the only
authoring. **Deps: D1/D2; E1c deps D3. E1 ──► S.E2.**

### Verification

(1) author the gate FIRST (born-RED — no scene-stage in-tree); (2) lift + re-path; run `check`
+ `proof:boundary`; (3) run the gate — 8 rows GREEN with advancing ticks; (4) post-D3, land
E1c and extend the gate over compose.

---

## S.E2 — Overlay + lighting + geometry at rest

**Mode: REFINE (lift) + token authoring.** **Deps: E1.** *(Design §18 W2; D4; v3 B1/B2/B3;
§1.0/§1.5.)*

### Charter

Land the v3 lighting/occlusion stack (§1.5) and the pinned geometry (§1.0). Author-fresh: the
`--stage-key-apex`/`--stage-key` tokens move into `demo/@/styles/design-idioms.css` (the proto
carried them in `proto.css`); everything else lifts. The geometry numbers are live-pinned —
re-deriving them is forbidden (the `+deg` inversion bug).

### The HARD GATE — `proof:stage-geometry` (born-RED; skeleton: `gates/geometry.mjs`)

**What it asserts (playwright-core, shared harness, 375 AND desktop):** overlay is a body-level
sibling with **NO `view-transition-name`** anywhere in the stage tree; ring computed transform
matches `rotateX(-15deg)`/perspective within tolerance; back-card top < front-card top; width
recede monotone; no card opacity < 0.4; **plus the during-commit clause** —
`__stageVT.overlayInDomAtUpdate === false` (the D2 exit encoded as a gate; the at-rest gate
alone could not see H2). **Born-RED witness:** no overlay exists in the repo tree → the first
clause hard-REDs. **Falsifiability:** overlay inside the VT subject REDs the sibling clause;
re-derived geometry REDs the matrix clause; a stage that survives into the VT update callback
REDs the during-commit clause. **Acceptance (non-CI):** the lighting screenshot set — dark AND
light, desktop AND 375, **over the real `.grid-background`** (D4.6 condition 2) — plus the §P
pixel-stability spot-check.

### Cost + DAG

Lift + the token move (co-edit set: `design-idioms.css` tokens ↔ `SceneStage.vue` `@property`
registrations ↔ the beam/pool recipes). LOW-MEDIUM. **Deps: E1. E2 ──► S.E3.**

### Verification

(1) author/lift `scripts`-side geometry driver from the skeleton (born-RED); (2) land the
overlay + tokens; (3) gate GREEN at both viewports incl. during-commit clause; (4) screenshot
acceptance recorded.

---

## S.E3 — Choreography: open · fan-in · gestures · payoff · affordances

**Mode: REFINE (lift) + polish-fresh.** **Deps: E2.** *(Design §18 W3; D5/D7/D10; §1.6/§1.7.)*

### Charter

Lift the choreography whole: the zoom-out/fan-in phase machine, `useStageGestures` (drag +
slop + capture, `decayRest` flick projection, wheel accumulation, tap semantics, arrow
auto-repeat, keyboard + type-ahead), the D5 payoff, the D7 affordance layer, the P2 host
front-load. **Author-fresh (the final-round carries, pass3: stage-final-design.md §5):**
(a) hint re-seated to the pool line; (b) **P4 marquee drop applied or owner-waived in
writing** (the proto ledger claimed it, the pixels contradicted it — pass3:
stage-recritique-design.md §2); (c) the hover/cursor-bearing capture + the **flick-decay GIF**
(the D10 drag-feel ruling: slot-follow + decay is ACCEPTED pending this capture; if it reads
notchy, the pre-authorized fix is the small orbit `setAngle` continuous-follow addition — not
required).

### The HARD GATE — motion-evidence acceptance (LOCAL; no new CI gate)

This wave adds **no CI launch**. Its closure is the recorded acceptance set: fan-in strip +
payoff burst + the flick-decay GIF + a hover/cursor frame (P5 method), plus the hint lifecycle
pair (present on first open / gone after the first spin). **Born-RED substance:** on the
pre-wave tree the stage cannot open (no pill wire in the harness) — the E4 commits gate (next
wave) is the CI teeth for this chain; E3's acceptance set is a T8 live-verification obligation
recorded in PROGRESS.md. **Falsifiability:** the hint-dismiss localStorage flag is asserted by
re-open (present→spun→absent); the payoff frame must be visibly distinct from browsing (the S3
cure — flare + press + bloom, no gold wedge).

### Cost + DAG

Lift + three polish items + captures. LOW-MEDIUM. **Deps: E2. E3 ──► S.E4.**

### Verification

(1) lift choreography; (2) apply hint re-seat + P4 (or record the owner waiver); (3) ship the
captures; (4) live-verify each beat via chrome-devtools-mcp (T8).

---

## S.E4 — The commit funnel + the `stage` VT type

**Mode: REFINE (lift).** **Deps: E3.** *(Design D1/D2; §1.1/§1.2/§1.3; C-6; fold row 18.)*

### Charter

Land the D1/D2-cured `useSceneStage` funnel (§1.1) + the `stage` VT type keyframes in
`demo/app/scene-transition.css` (type MERGE, old-frame 300ms fade — §1.2) + the observables.
This is the band's headline correctness surface; every clause of it is already proven in the
prototype and independently re-verified (pass3: stage-recritique-tech.md §1.1, §5).

### The HARD GATE — `proof:scene-stage-commits` (born-RED; skeleton: `gates/adversarial.mjs`)

**The spec is §1.1's A–G roster verbatim** — happy paths + the seven adversarial clauses,
browser-actuating on the shared chromium. **Born-RED witness:** no stage exists in the repo
tree → every clause hard-REDs; after the lift, all clauses green (the prototype transcript is
the expected shape). **Falsifiability (both ways, proven):** clauses B and G FAIL against the
pre-D1 code (the stale-arm semantics) — the falsification is not hypothetical, it is the
recorded round-1→round-2 delta; clause D fails on any code path that writes the observable on
cancel; clause F fails on router double-write. Carry the clause-A prose correction (§1.1).
**Co-edit set:** `useSceneStage.ts` ↔ `useCarouselOrbit.ts` (`targetIndex` exposure + the
no-move-reseat fix) ↔ `useStageGestures.ts` (`grab` halt-coast) ↔ `scene-transition.css`
(`stage` type) — these four move together or the invariant breaks.

### CI budget

ONE of the band's two CI browser gates; rides the shared chromium + served dist (amortized).
(Runnable at E4 against the harness; **wired as a repo `proof:*` roster entry at S.E7** — the
explicitly-owned born-RED integration debt, pass3: stage-final-tech.md.)

### Cost + DAG

Lift; LOW risk (three-round-proven). **Deps: E3. E4 ──► S.E5.**

### Verification

(1) driver first (born-RED); (2) lift the funnel + VT type; (3) A–G GREEN on the harness;
(4) live-verify commit + cancel via chrome-devtools-mcp (T8).

---

## S.E5 — Mobile v2 @375

**Mode: REFINE (lift).** **Deps: E4.** *(D8; §1.8; fold row 18's second half.)*

### Charter

Land the D8 parameter deltas (§1.8) — same component, same authority, same funnel, **no
`max-width` fork**. KfPillTabs remains explicitly out of scope (panel primitive → S.B7/S.D2;
fold row 71).

### The HARD GATE — the mobile commit gate @375 (born-RED, browser-actuating)

**What it asserts:** at 375px, **open → drag-flick (decay projection) → tap front →
committed** on touch events, with the §1.1 observables; `lit: 1` (front-only live); no corner
clutter (the cull holds); marquee below the ring. **Born-RED witness:** REDs on the pre-wave
tree (no mobile parameters); the prototype's mobile transcripts are the expected GREEN shape
(pass3: stage-proto-v1.md W5; stage-proto-v2.md §3-S6). **Falsifiability:** a max-width fork or
second authority breaks the single-stage clause; a non-committing touch path reds the commit
clause. The sliver-label fade is the ratified tradeoff (§2.4), not a defect.

### CI budget

The band's SECOND CI browser gate; shared harness, amortized; wired at S.E7.

### Cost + DAG

Lift; LOW. **Deps: E4. E5 ──► S.E6.**

### Verification

(1) driver first (born-RED @375); (2) lift D8 params; (3) gate GREEN; (4) live-verify at 375
via chrome-devtools-mcp.

---

## S.E6 — LOD hardening + the REAL WebGL lifecycle + the fps acceptance

**Mode: REFINE (lift) + REAL-GL author-fresh.** **Deps: E5.** *(D3.3/D9; §1.4/§1.10.)*

### Charter

Lift the LOD machinery whole (hysteresis band, `maxConcurrentFull=1`, CV-deleted pause
authority, visual/mount decouple, `__stageGLLog`). **Author-fresh:** the **real Three renderer
behind the proven lifecycle** — the proto proved the machinery over a fake-GL body (pass3:
stage-proto-v2.md §4); the impl mounts the real renderer at front-settled with the same
create/dispose/contextlost seams — plus the amiga **poster asset** (checkerboard-derived, the
only poster in the system).

### The HARD GATE — the GL-lifecycle clauses (skeleton: `gates/gl-proof.mjs`) + the fps LOCAL acceptance (skeleton: `gates/fps.mjs`)

**GL clauses (runtime):** no create mid-transit · create only at front-settled · dispose on the
2s debounce · re-front within 2s cancels the dispose (no second create) · `webglcontextlost` →
poster-permanent · **≤1 GL context ever** (`__stageGLLog` witness). **Born-RED:** REDs against
a naive mount-on-lit implementation (the exact shape round 1 had — creation on every band
crossing). **The fps half is a LOCAL GPU acceptance (C-10 — never CI):** ≥55fps carousel-open
· <8ms scripting/frame · no LOD-churn long task, re-recorded on this wave's tree and compared
against §1.10's baselines (round-3: min 97.1 / LoAF 0ms). **Falsifiability:** a second live
context or a mid-transit create reds the log clauses; regressing a D9.3 cut shows up in the
re-recorded trace, where deviation-register row 3 (the rAF direct-write ring) is the
pre-authorized remedy.

### Cost + DAG

Lift + real-Three authoring; MEDIUM (the GL body is the one genuinely new runtime surface).
**Deps: E5. E6 ──► S.E7.**

### Verification

(1) GL driver against the lifted machinery (GREEN with the fake body); (2) author the real
renderer behind the same seams; (3) GL clauses GREEN with real Three; (4) record the fps trace
in this wave doc.

---

## S.E7 — INTEGRATION (the honest remaining work — App.vue, the pill, the gates go real)

**Mode: REWRITE (author-fresh).** **Deps: E6.** *(pass3: stage-design-v1.md §4 App.vue/ChromeDock
deltas + §3; stage-design-v2.md D2.2/D2.4/D10 + §12; stage-recritique-tech.md §4; both finals'
carry lists. This is the debt every prototype round explicitly re-stated and both critics
ruled the wave must own.)*

### Charter

Everything the standalone harness could not host. The prototype proved the engine, the
lighting, and the commit spine; **this wave puts them in the real app and makes the gates real
CI teeth.** Scope, exhaustively:

- **S1 — App.vue mount (~40L):** `<SceneStage>` as the LAST template sibling (Teleport body);
  phase → `.scene-host` zoom-out bindings + dock fade/`inert`; hand `runSceneSwitch` in. The
  keyed `<Suspense>` stays BARE (the B.W3 blocker); the stage only styles the sibling host.
- **S2 — Dock-pill rewire + Select retirement (the authority ruling made real):** the scene
  pill keeps pixel identity, actuation → `stage.open(currentSceneId)`; the Select's scene
  listbox is RETIRED; pill re-click while open = cancel-close (D10). **glass-ui affordance
  scoping happens BEFORE this wave's build starts** (D10): "a Select trigger that opens the
  stage instead of its popover" may need a glass-ui change — per MEMORY
  (`glass_ui_root_changes`) that lands in glass-ui, never a demo patch; if needed it becomes a
  named handoff item and **the interim wire is a plain button styled as the pill** (identity +
  single authority, not primitive choice, is what §3 rules).
- **S3 — Gate re-points (the v1 design's named open issue):** the hover-warm `@warm-scene`
  prefetch re-targets to warm ALL scene chunks on stage-open; **any repo gate or driver that
  actuates the scene Select listbox is re-pointed** to the machine/hash path (`navToScene`-by-
  hash keeps working untouched — the authority is the machine; pass3: stage-design-v1.md §3
  "Consequences, handled").
- **S4 — Real `useSceneTransition`:** the optional `{ stage: true }` arg
  (backward-compatible); **types MERGE** `["stage", forward|backward]`; the D2.4 single-write
  clause — router reconcile observes `machine.activeScene` already equal and no-ops (clause F
  guards it).
- **S5 — Warm-then-gate, real:** `warmScene` over the real lazy chunks + the Suspense
  `onResolve` await inside the update callback, bounded 350ms with timeout-resolve degrade
  (§1.3 — the proven pattern from `gates/warm-suspense.mjs`).
- **S6 — Origin-scene pause behind the dim** (`useSceneVisibilityPause` or the machine's
  pause) — no rAF competing behind the scrim.
- **S7 — WIRE THE GATE ROSTER FOR REAL:** `proof:scene-stage-commits` (A–G), the mobile commit
  gate @375, and `proof:stage-geometry` (+during-commit clause) become
  `scripts/proof-stage-*.mjs` + `package.json` roster entries on **S.A2's shared chromium
  against served dist** — the born-RED integration debt named verbatim by both finals. Refresh
  or drop the stale side-transcripts (§2 hygiene note). Keep the fps acceptance LOCAL (C-10).
- **S8 — The miniature screenshot-diff-vs-hero maintenance artifact (D3.4):** each miniature
  captured in-card, paired against its scene's design-fleet hero shot, judged "evokes the
  scene" (taste acceptance, not pixel threshold), recorded in this wave doc; plus the binding
  maintenance rule — **a change to `demo/scenes/<name>/` visual identity updates
  `scene-stage/previews/<name>` in the same change, or states why not**.
- **S9 — Re-shoot the lighting acceptance over the real app page** (D4.6 condition 2's
  formality) + the §P pixel-stability audit on the integrated tree.
- **S10 — The dock double-click kf-internal contingency is AUTHORED here** (the DM-1 R.W6
  press-handler precedent) so fold row 53's terminal never depends on the external publish;
  wired-or-retired at S.E8 per the publish outcome.
- **S11 — Retire/re-point the `demo/stage-proto/` harness** (it was the interim gate
  substrate; the gates now run against the real served dist).

### The HARD GATE — the wired roster GREEN on the merged tree

**What it asserts:** all three named gates exist as repo `proof:*` entries and run GREEN
against the served dist of the REAL app — commits A–G (+happy paths, +hash, +focus), mobile
@375, geometry (+during-commit). **Born-RED witness:** the roster entries do not exist in
`package.json` today, and against the real app the pill does not open a stage — hard RED until
S1–S7 land. **Falsifiability:** clause F reds a router double-write (the re-entrancy risk the
harness hid); the warm-gate clause reds a VT that captures a fallback (drive a cold commit with
a throttled chunk); a Select listbox left alive is a second browse surface — the
single-authority clause (no scene listbox in the dock's DOM) reds it.

### Cost + DAG

The band's largest wave: App surgery + pill rewire + transition/warm/pause wiring + roster
wiring + two acceptance artifacts. HIGH-MEDIUM. **Deps: E6. E7 ──► S.E8 (with the external
publish).**

### Verification

(1) scope the glass-ui pill affordance FIRST (handoff or interim button decided before build);
(2) wire S1–S6; (3) promote the gates (S7) and run the full roster on the served dist; (4) ship
S8/S9 artifacts; (5) live-verify the whole arc (open → browse → commit → entered; cancel; PRM;
375) via chrome-devtools-mcp on the running demo (T8); (6) re-run every touched gate on the
merged tree (T4).

---

## S.E8 — glass-ui consume-edge (GATED: fires ONLY on the joint 5.0.0 publish)

**Mode: REFINE.** **Deps: E7 + EXTERNAL (glass-ui 5.0.0 published).** *(C-12, C-20, C-21, T12;
fold rows 51/52/53/55. One of the plan's exactly two external consume-edges — the other is
S.H4.)*

### Charter

The old band's E6, carried with ONE structural change: **the BG dock morph is an OPTIONAL
refinement of the pill's open animation, NOT a dependency, and nothing gets retired onto it**
(the new design has no interim dock spin controls — arrows are stage-internal; pass3:
stage-design-v1.md §3). The wave: pin `~4.0.x` → `~5.0.0` (tilde, **never caret** — C-12);
verify the consumed subpaths against BH's regenerated entry-set; re-baseline the visual-lock
gates against BG's specular floor + unified 8px blur (**the wave's largest line item — a
multi-gate effort, not an atomic flip**); optionally adopt the dock morph for the pill-open
beat; re-test the dock double-click against the built 5.0.0 (fold row 53) — else wire the
kf-internal contingency authored at E7-S10.

### The HARD GATE — `proof:peer-satisfied` flips green (+ subpath-survival + double-click verdict)

Born-SPECIFIED, not born-RED (the external-edge honesty — T12): the gate is coupled to a
publish that does not exist yet. Post-publish: `proof:peer-satisfied` flips GREEN on the pin;
every consumed subpath resolves against BH's entry-set (a dropped subpath REDs); the
double-click verdict is recorded. **Non-terminal honesty (C-20/C-21):** if 5.0.0 has not
published at S close, S.E8 closes as a **structured HANDOFF** and fold rows 51/52/53 render as
`HANDOFF — external — row N` (never counted green, never presented as terminals); the
kf-internal double-click handler is wired so the chronic terminalizes internally. The stage
itself is COMPLETE without this wave — that is the point of the dock-morph demotion.

### Cost + DAG

Externally gated; pin bump trivial, subpath verify LOW, visual re-baseline the largest item,
dock-morph adoption optional. **Deps: E7 + external.**

### Verification

**If published:** pin → `proof:peer-satisfied` GREEN → subpath clause → visual re-baseline
(each gate its own verdict) → optional dock-morph adoption → double-click verdict recorded.
**If not:** structured HANDOFF + RESIDUAL CARRY rows + wire the E7-S10 contingency.

---

## Appendix A — Fold rows this band owns (SPEC §4 dispositions, restated)

| # | Item | S-disposition |
|---|------|---------------|
| 17 | DM-24 N-Stage scene-switcher (died 3×; owner reopened) | **BAND S.E** — pass-3 converged design + frozen v3 prototype; S.E1–S.E7 land it |
| 18 | `proof:scene-switcher-mobile` zombie gate | **reborn**: `proof:scene-stage-commits` (A–G) at S.E4 + the mobile commit gate at S.E5, both wired at S.E7; the *retire* half is S.A4's |
| 51/52/53 | glass-ui HANDOFF rows | **re-entry at S.E8** on the joint 5.0.0 publish; RESIDUAL-CARRY clause; row 53's kf-internal contingency authored at S.E7-S10 |
| 55 | glass-ui pin frozen ~4.0.x | deliberate ~5.0.0 at publish → **S.E8**; hold till then (C-12) |
| 71 | KfPillTabs keyboard + TransportDock auto-repeat | **NOT this band** — panel primitive; test → S.B7, promotion → S.D2 (SPEC §9 X1-1) |

## Appendix B — The pass-3 convergence ledger (what makes this band's contracts binding)

| Round | Design critic | Tech critic | Outcome |
|---|---|---|---|
| 1 (pass3: stage-critique-{design,tech}.md) | ~70% — S1–S6 blocking (lighting hierarchy, paper, payoff, unlit legibility, discoverability, mobile) | H1/H1b stale-arm + H2 VT double-capture HIGH; miniatures RULING; adversarial-gate mandate | stage-design-v2.md D1–D11 + §P (the binding delta) |
| 2 (pass3: stage-recritique-{design,tech}.md) | ~88% — B1/B2/B3 residue (occlusion bleed, visual/mount) | 90/100 — H1/H2 cured structurally, **independently re-run**; tech-1/2/3 residue (gate wiring + clause G, real warmScene/onResolve, dead CV export) | stage-proto-v3.md (the residue pass) |
| 3 (pass3: stage-final-{design,tech}.md) | **100 — FROZEN**: "this build is the binding S.E wave spec" | **100/100** — "wave-spec-ready; the wave carries the served-dist `proof:*` wiring as born-RED integration debt" | THIS BAND |

Every §1 inventory row traces to a driver transcript in `demo/stage-proto/gates/` and a shot
set in `proto-shots{,-v2,-v3}/`. The tech critic's independent re-runs (round 2: all gates
reproduced GREEN from a fresh server; fps min 96.2 on his machine) are the T5-class evidence
that the transcripts are not stale.

## Appendix C — DEV→IMPL boundary (binding for every S.E wave)

Every wave above is **DEVELOPMENT ONLY**. Each ships (or names) a falsifiable born-RED gate;
nothing runs until the owner authorizes an impl drive (inv-16). A wave is **CLOSED only when
its born-RED gate is GREEN re-run on the merged tree** (T4), exit code recorded in PROGRESS.md;
**S.Z2 re-executes that oracle at close** (a re-run, not a re-read). Parallel drives re-run
every touched gate from a clean independent checkout — "pre-existing" claims verified by
triage, never accepted (T5); **the prototype worktree's node_modules symlink is never
git-added** (the R-drive merge lesson). The **prototype worktree `wf_2fbb9dbc-c40-1` must be
preserved intact until S.E1's lift lands and S.E7 retires the harness** — it is the band's
salvage source and gate-skeleton home. The strict wave order E1→…→E7 is the design's own
atomic-build prescription: no wave starts until the prior wave's gate/acceptance passes. The
§1 proven-contract inventory is **binding**: an impl drive lifts it; deviations beyond the §2
register require a new owner ruling. The fps criterion is LOCAL forever (C-10); the two CI
browser gates + geometry ride the ONE shared chromium + served dist (S.A2) — the band adds no
launches beyond that budget.
