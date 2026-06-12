# Tranche K · Audit Lane — K-SEED Reconciliation (frontier ⊕ product-truth)

**Lane:** `k-seed-reconciliation` (DOCS ONLY — no source/test/gate/CI edits). This doc proposes
the K **allocation/shape**; it implements nothing.
**Repo state:** `tranche-j-dev` == `master` @ `4f1fc4c` (verified: `git rev-parse --short HEAD`
→ `4f1fc4c`, `git branch --show-current` → `tranche-j-dev`). Tranche J closed 2026-06-11; kf
`4.2.0` published (`node -e "require('./package.json').version"` → `4.2.0`).
**The two inputs reconciled:**
1. **The FRONTIER seed** — `docs/tranches/J/audit/frontier/K-SEED.md` + `judge-ranking.md`
   (the 6-wave round-trip charter: W0 fidelity → W1 ingest → W2 scroll → W3 compile → W4
   physics → W5 externalize), the value.js half (§7), the 12 KILLs (§5), the BOOKs (§6).
2. **The PRODUCT-TRUTH band** — the user's live audit U-K1..K20 (2026-06-11 23:2x) + the
   orchestrator's cold-path P0 triage, each rooted by an owning sibling lane in THIS dir
   (`live-cold-play-path.md`, `live-session-gap-analysis.md`, `live-amiga-breakage.md`,
   `live-dock-tabs-selects.md`, `live-typography-truth.md`, `live-glassui-currency.md`,
   `live-fourier-grid.md`).

Every claim below cites a sibling-lane finding (already inv-ε-verified by its owning lane), a
frontier-doc line, or a direct source/registry probe I re-ran.

---

## §0 — THE RECONCILIATION THESIS (stated up front)

The K-SEED was divined on **2026-06-10**, BEFORE the user drove the J-closed product on
**2026-06-11**. The seed's own §0 charter is *"makes kf's CSS-@keyframes round-trip TOTAL."*
That is a LIBRARY-FRONTIER charter. The user's 20-finding live audit + the cold-path P0 is a
**PRODUCT-TRUTH / DESIGN-TOTALITY** charter — a different axis entirely. They do not compete on
content; they compete on **the tranche's identity and the first commit it authorizes.**

**The decisive new fact the seed could not have known:** the J close certified `proof:all`
GREEN and shipped 4.2.0 — and **hours later the user found the product's PRIMARY FIRST-RUN
GESTURE broken** (the hero rainbow-play → cube animating; the engine never starts —
`live-cold-play-path.md §P0-1`, confirmed independently by `live-session-gap-analysis.md §1`).
This is a born-RED **P0 that the entire J boundary battery is structurally blind to** (the
cold-entry axis is unexercised; B1 greens on `.idle-hover` CSS bob — 41 distinct transforms at
REST with the engine OFF). The seed's premise — *"K develops only after J closes, on its own
authorization"* (K-SEED:8) — is satisfied, but the authorization it inherits is **not a frontier
mandate; it is a repair mandate.** A tranche cannot anchor on CC-1 (the XL CSS compiler) while
its demo's front-door CTA does not animate.

**Recommendation (argued in §4):** **K becomes the PRODUCT-TRUTH + DESIGN-TOTALITY repair
tranche; the entire frontier (CC-1/K1/SO-1/WL2-B/PHYS-C/ED-1 + the value.js half) DEFERS to L,
re-seeded UNCHANGED.** Not a split, not an integrated charter. The argument is below; the two
rejected shapes are argued against on the merits, not dismissed.

---

## §1 — THE TWO CHARTERS, SIZED AND CONTRASTED

### 1.1 The frontier seed (what K-SEED actually charters)

| Wave | Owns | Effort | Gating dependency |
|---|---|---|---|
| K.W0 | WL2-B `animation-composition` honoring + K3 diagnostics channel | **M** | none (the RIPEST item; `adapter.ts:120-126` already captures it, `engine.ts` drops it) |
| K.W1 | K1 `fromStyleSheets()`/`fromLiveAnimations()` ingest + K2 `adopt()` | **M (+L)** | K.W0 diagnostics (CORS honesty) |
| K.W2 | SO-1 scroll-as-CSS parse+dispatch + SO-2 `ScrollScene` + SO-3 sticky-pin | **L** | **value.js VJ.W1** (the `CSSTimelineOptions` extractor — a HARD cross-repo gate) |
| K.W3 | CC-1 the CSS compiler + CC-2 oklab densify + CC-3 ineligibility report | **XL** | K.W0 (inverts the honoring) + K.W1 (composes with ingest) |
| K.W4 | PHYS-C spring-driven blend weight + PHYS-B2 reseatToSpring + PHYS-E | **M-L** | engine-internal (file-disjoint) |
| K.W5 | ED-1 llms.txt + ED-2 keyframes-vue + ED-3 dogfood + ED-4 color-fidelity | **M** | J.W5 publish landed (✅) + all prior waves' surfaces |

**Total:** ~XXL. Three of six waves (W2 scroll, W3 compile, parts of W1 ingest) gate on
**net-new value.js grammar that does not exist yet** (K-SEED §7: VJ.W1 SCROLL GRAMMAR "gates
K.W2"; VJ.W2 PERCEPTUAL RAMP "gates K.W3"). The frontier is **dependency-deep across a sibling
repo that has its own un-dispatched tranche backlog** (K-SEED §7 "Census correction": value.js's
Tranche M is planning-only, never dispatched; published 0.11.2 = the F handoff + two patches).

### 1.2 The product-truth band (what the user + orchestrator actually demand)

Rooted by the sibling lanes. Severities are THEIR verdicts (re-cited, not re-derived):

| Seed | Root (sibling lane, file:line) | Sev | Class |
|---|---|---|---|
| **cold-path P0** | `live-cold-play-path.md §P0-1`: machine `PLAY` effect `resume()`s an UNSTARTED group (no-op) — `useSceneMachine.ts:182-184` + `scenePlaybackAdapters.ts:76-79`; the engine never `play()`s. **NOT W7c U4** (H.W1 provenance, git-blame `256f6fe`). Slider parks at 0; rainbow never vivid; 2nd click works. | **P0** | engine/state-machine |
| U-K2/K3/K5 | downstream of the P0 (the cold gesture is structurally lost) — `live-session-gap-analysis.md §1` | P0/P1 | engine |
| U-K4 | `live-amiga-breakage.md`: THREE defects — K4-A flash (`useAmigaAnimations.ts:54-58` color×map multiply), K4-B float (69%w/37%h envelope, `AmigaScene.vue:62`), K4-C "constantly" (persisted `playing:true` resumes on cold reload, `sceneMachine.ts:67-68/123`) | P1×3 | appearance + playback-persistence |
| U-K1 | `live-cold-play-path.md §P1-2`: bottom TransportDock renders FULL layer at rest (only TOP collapses); W7c U2 "shrunken pill" claim does NOT hold live | P1 | dock-layout |
| U-K6/K8/K10 | `live-typography-truth.md §2-4`: dock split voice (`.dock-label` → SANS while `.dock-scene-title` → DISPLAY); ONE root rule `.dock-label{font-family:var(--font-display)}` flips all 6 sites (proven live); + the stale `style.css:41-44` comment (names Fraunces, gone) | P1 | typography-root |
| U-K9 | `live-typography-truth.md §5`: home subtitle wraps to 2 lines @390px (`EditorStartScreen.vue:54-57`) | P2 | layout |
| U-K11/K15/K16 | `live-dock-tabs-selects.md`, `live-glassui-currency.md §3.6`: spring UI inadequate; slider steps (`:step="0.01"` = 110 stops, `SpringSidebar.vue:48`); `SPRING_PRESETS` now exported from glass-ui 3.13.0 `./motion-curves` | P1/P2 | spring-UI |
| U-K12/K13 | `live-dock-tabs-selects.md §1`: "awful tabs" = serif display face @1.125rem on `tab-trigger.css:26-29` + SpringSidebar SegmentedTabs register; "two panes look awful" = spring-adjacent panels | P1/P2 | tabs/spring-UI |
| U-K16 (totality) | `live-dock-tabs-selects.md §2.1`: ChromeDock controls-tab `<Select>` renders a 1-item dropdown for easing/spring (`ChromeDock.vue:200` `hasControlPanel` gates `>0` not `>1`) — the U4 rule is NOT total | P1 | demo-seam |
| U-K14 | `live-glassui-currency.md`: kf pins `~3.11.2` (installed 3.11.2); registry latest **3.13.0** (I re-verified: `npm view @mkbabb/glass-ui version` → `3.13.0`); `~` blocks the bump; 3.13.0 ships fluid type, slider touch-hit, SegmentedTabs liquid indicator, `useDockClickIntegrity`, `SPRING_PRESETS`, `Constellation`, pinned dock padding | P1 | dependency-currency |
| U-K7/K17/K18/K19 | `live-session-gap-analysis.md §2`: layout WILD refinement (grid/subgrid, no hardcoded dock offsets, pathological screens); clipped+draggable pane; red-dashed final state (not green); two readout panes; drag-resizes-instead-of-drags demo | P1/P2 | layout/design-system |
| U-K20 | `live-fourier-grid.md`: FourierField mounts `EditorStartScreen.vue:65-86` (7 removal hunks); grid opacity `5%/12%` → `3%/8%` (`design-idioms.css:182-183`) | P1/P2 | hero composition |

**Total:** ~5-7 repair/design waves, ALL kf-side or glass-ui-consume-edge, **ZERO net-new
value.js grammar required**, the P0 born-RED on the live product TODAY.

### 1.3 The contrast that decides the shape

| Axis | Frontier (K-SEED) | Product-truth (U-K + P0) |
|---|---|---|
| **Charter type** | library frontier (round-trip totality) | product correctness + design totality |
| **Born-RED today?** | NO — every item is a NEW capability; the gates are NET-NEW oracles for features that don't exist | **YES — the P0 reds on the live built dist NOW; the gates exist and are GREEN-while-broken (the blindspot)** |
| **Cross-repo gate** | HARD on value.js VJ.W1/VJ.W2 (un-dispatched) | NONE (glass-ui 3.13.0 is PUBLISHED; consume-edge only) |
| **User mandate** | divined 06-10, no user request | **explicit binding live-audit 06-11 (20 findings) + the P0 the user was the born-RED witness for** |
| **The J lesson it answers** | — | **the EXACT §4 P0 lesson: "a battery is only as honest as its weakest-covered product property; the user driving the running product remains the arbiter of last resort" (`FINAL.md:147`)** |
| **Effort** | XXL (XL anchor + 2 value.js-gated waves) | XL (5-7 repair/design waves, all in-repo) |

The product-truth band is the **direct continuation of J's own §4 confession** (the subject-write
regression the green battery missed). J planted `proof:subject-animates` — but
`live-session-gap-analysis.md §0` proves that gate is SYNTHETIC (a `<div>` over
`dist/keyframes.js`, never the demo cube), so the cold-path P0 of the SAME class escaped again.
**The product-truth band is not new scope — it is the un-finished J lesson.** That is the
strongest single argument for what K must be.

---

## §2 — THE THREE CANDIDATE SHAPES (argued on the merits)

### Shape A — K = repair+design tranche, frontier DEFERS to L (RECOMMENDED; argued §3)

K is entirely U-K1..K20 + the P0 + the gate-blindspot cure. The frontier re-seeds as L-SEED,
UNCHANGED (the 6-wave DAG, the value.js half, the 12 KILLs all carry over verbatim — they were
not invalidated, only out-prioritized).

### Shape B — split tranche (K-product ∥ K-frontier, two parallel sub-charters)

K runs two disjoint lanes simultaneously: a repair lane (the U-K band) and a frontier lane
(W0/W4 — the engine-internal, value.js-independent frontier waves only).

**The case FOR:** K.W0 (WL2-B composition honoring) and K.W4 (PHYS-C) are **engine-internal,
file-disjoint from the demo** (`engine.ts`/`group.ts` vs `demo/`), and have **zero value.js
gate** (K-SEED §2: WL2-B is "M-effort, born-RED-witnessable"; PHYS-C is "one nullish swap
`group.ts:362-365`"). They could land in parallel with the demo repair without resource
contention on the same files. This would keep the frontier moving while repairing the product.

**The case AGAINST (decisive):**
1. **It dilutes the tranche's identity at the exact moment identity matters most.** The J FINAL's
   whole thesis is "a boundary certified by hand/paperwork/one-viewport is NOT certified"
   (`FINAL.md:17-19`). K's job is to prove the COLD-ENTRY boundary — the one axis J never drove.
   A split charter says "we half-believe the product is broken and half-want to chase the
   frontier." That is precisely the **divided attention that let the P0 ship** (the J close was
   chasing the deploy/publish/docs frontier while the cold path silently no-op'd).
2. **W0/W4 are NOT free of the repair band.** PHYS-C touches `group.ts` (K-SEED judge-ranking:197
   "coordinate with CC-1's group walker") — but more importantly, the **playback-persistence
   policy** the repair band must decide (`live-amiga-breakage.md` K4-C: should a group scene
   auto-resume `playing:true` on cold reload?) is the SAME `scenePlaybackAdapters.ts` /
   `sceneMachine.ts` restore machinery the cold-path P0 fix touches AND the same surface PHYS-C's
   spring-driven weight would ride. The "file-disjoint" claim is true for the engine kernel but
   FALSE for the playback-policy seam — the split would force two waves to negotiate the same
   restore/play wiring (`live-amiga-breakage.md §FOLD cross-lane`: "fix as ONE playback-policy
   wave-class where possible").
3. **A frontier wave with no born-RED demand is a deferral wearing a wave hat.** WL2-B is "the
   RIPEST item" but it is ripe in the FRONTIER sense (capability-ready), not the PRODUCT sense
   (no user asked for `animation-composition` honoring; no demo scene exercises it). Shipping it
   in K spends the tranche's born-RED credibility on a feature no human is waiting for, while the
   P0 the human IS waiting for shares the tranche.

**Verdict on B:** the split is SEDUCTIVE because W0/W4 are genuinely value.js-independent — but
it re-creates the divided-attention failure mode J's catastrophe diagnosed, and the
playback-policy seam is NOT actually disjoint. **Reject.**

### Shape C — integrated charter (one tranche, the U-K band as "the proof the round-trip serves humans")

K keeps the frontier charter sentence but RE-FRAMES the repair band as its first waves: "the
round-trip is worthless if the front door doesn't animate — so K.W0 is the cold-path fix, THEN
the round-trip." One charter, repair-first ordering, frontier-after.

**The case FOR:** it preserves the seed's narrative spine ("round-trip TOTAL") and lets the
orchestrator claim continuity. It is honest that the repair is prerequisite.

**The case AGAINST (decisive):**
1. **The charter sentence becomes a lie of scope.** K-SEED §0 is *"the engine reads the live
   web's CSS, drives it with physics… emits it back as zero-runtime CSS."* NONE of the U-K band
   is that. Forcing the repair under that sentence makes the FINAL's "what landed" table read
   like the J catastrophe it ended: a charter whose claims don't match the work. The J FINAL is
   explicit that the close voice may not overclaim scope (`FINAL.md:534`).
2. **It mortgages the repair to the frontier's effort.** An integrated K must, to honor its
   charter, ship SOME frontier (else why keep the sentence?). The moment K commits to "round-trip
   TOTAL + the repair," it inherits the value.js gate (VJ.W1/VJ.W2 un-dispatched) — and now the
   P0 fix waits behind a sibling-repo tranche. That is the deferral the user cannot accept.
3. **It blurs the L re-seed.** If K is "frontier + repair," then L's identity is undefined — does
   L inherit the un-shipped frontier waves, or is the frontier "done"? The clean re-seed (Shape
   A) keeps L's charter crisp: L = the round-trip frontier, on its own value.js-gated authorization.

**Verdict on C:** integration buys narrative continuity at the cost of scope honesty and the P0's
priority. It is the J catastrophe's shape (charter ≠ work) re-instantiated. **Reject.**

---

## §3 — THE RECOMMENDATION: Shape A, argued to its trade-offs

**K = the PRODUCT-TRUTH + DESIGN-TOTALITY repair tranche. The frontier (the full 6-wave
round-trip charter + the value.js half + the 12 KILLs + the BOOKs) DEFERS WHOLESALE to L,
re-seeded UNCHANGED as `L-SEED.md`.**

### 3.1 Why deferral is correct (not abandonment)

The frontier is not weakened by deferral — it is **un-blocked** by it:

- **The value.js gate resolves in the interval.** K.W2/K.W3 gate on VJ.W1 (scroll grammar) and
  VJ.W2 (perceptual ramp) — value.js grammar that does not exist (K-SEED §7). value.js must
  first reconcile its stale Tranche M (planning-only, never dispatched) and run VJ.W0→VJ.W2 in
  ITS own tranche process. Anchoring K on CC-1 today means K BLOCKS on a sibling repo's backlog.
  Deferring to L gives value.js the interval to ship the grammar — so L starts UN-blocked.
- **The frontier items are not time-sensitive.** The 12 KILLs are "non-re-litigable" (K-SEED §5);
  the BOOKs carry named tripwires (K-SEED §6). None decays by waiting one tranche. By contrast
  the P0 is decaying NOW — every day the live site serves a non-animating front door.
- **L inherits a STRONGER substrate.** After K, the demo is the dogfood surface ED-3 needs (the
  "demo consumes the published barrel" inversion) — and ED-3 is only honest if the demo WORKS.
  Shipping the frontier's ED-3 over a broken demo would re-commit the J sin. K repairs the demo;
  L can then dogfood it.

### 3.2 The K shape this recommendation implies (a seed, not a spec — for the orchestrator)

Ordered by dependency + severity, mirroring how the sibling lanes' §FOLD rows cluster. **The gate
lesson leads** (the P0 escaped because the cold-entry axis is unexercised — fix the axis FIRST so
every subsequent repair lands on a born-RED oracle):

| Wave (proposed) | Owns | The born-RED oracle | Source lanes |
|---|---|---|---|
| **K.W0 — THE COLD-ENTRY ORACLE (leads)** | the cold-entry gate (fresh context, no seed, `goto #/`, click hero rainbow play, assert dock-aria flips Play→Pause AND slider advances from 0 AND **isolated `.cube` engine-write** ≥3 distinct — NOT `.idle-hover`); de-noise B1; extend `proof:subject-animates` to the demo dist | the gate reds on the live P0 TODAY (`k-verify-gate-blindspot.mjs`: B1=101 PASS while engine OFF) | `live-session-gap-analysis.md §F2/F3/F4`, `live-cold-play-path.md §P1-1` |
| **K.W1 — THE COLD-PATH PLAY FIX (the P0)** | autoplay-intent + freshly-bound group ⇒ `group.play()` (adapter gains `play()`, or `markSceneReady` routes through toggle); the playback-persistence policy (amiga K4-C: decide cold-resume) — ONE playback-policy seam | K.W0's cold-entry gate flips RED→GREEN | `live-cold-play-path.md §P0-1`, `live-amiga-breakage.md K4-C` |
| **K.W2 — THE DEPENDENCY CURRENCY (parallel)** | glass-ui `~3.11.2 → ~3.13.0` + `proof:deps-current` floor `3.11.2 → 3.13.0` (`scripts/proof-deps-current.mjs:80`); consume the fluid type, slider touch-hit, `useDockClickIntegrity` (retire the kf `App.vue` workaround), `SPRING_PRESETS`, pinned dock padding | `proof:all` green on the new pin; the `App.vue` workaround removal verified against `proof:dock-popover-opens` | `live-glassui-currency.md §5-7` |
| **K.W3 — THE TYPOGRAPHY + APPEARANCE ROOT** | the ONE `.dock-label{font-family:var(--font-display)}` root rule (U-K6/K8/K10, flips all 6 sites); the Play/Reverse voice unification; delete the stale `style.css:41-44` comment; amiga K4-A flash + K4-B float; FourierField removal + grid opacity (U-K20) | positive dock display-voice assert; amiga "contained & calm + no colorT tint + no cold-resume" born-RED oracle; FourierField-absent assert | `live-typography-truth.md §FOLD`, `live-amiga-breakage.md K4-A/B`, `live-fourier-grid.md` |
| **K.W4 — THE SPRING/SEQUENCE UI + SINGLE-OPTION TOTALITY** | the spring keyframes editor (U-K11/K16); the slider-stepping cure (`:step` / continuous drag, U-K15); the ChromeDock 1-item `<Select>` guard `>0 → >1` (U-K16 totality); the tabs-vs-pills re-skin (U-K12); the two spring-adjacent panes (U-K13) | the no-single-option rule total (the count IS the gate); a "slider value continuous" assert | `live-dock-tabs-selects.md §FOLD`, `live-glassui-currency.md §3.6` |
| **K.W5 — THE LAYOUT TOTALITY (closes)** | the WILD dock/stage/controls grid/subgrid refinement, NO hardcoded dock offsets, pathological-screen clustering (U-K7); the clipped+draggable pane + red-dashed final state (U-K17); the two-readout hierarchy (U-K18); the drag-vs-resize demo (U-K19); re-baseline `visual-lock` AFTER the refinement (not before) | the layout gates re-baselined on the REFINED tree (the J `visual-lock` baseline is the user-DISLIKED state — `live-session-gap-analysis.md §F10`) | `live-session-gap-analysis.md §2`, `live-typography-truth.md §5` |

(This is a SEED for the orchestrator — the exact wave count/membership is the K dev-phase's to
author. The load-bearing claim is the ORDERING: the cold-entry oracle FIRST, then the P0 fix it
proves, then currency, then the design-totality band on the now-honest gate substrate.)

### 3.3 The trade-offs of Shape A (named honestly, per inv ε)

| Trade-off | The cost | Why it's acceptable |
|---|---|---|
| **The frontier waits a full tranche** | CC-1/K1/SO-1 — the genuine moat the seed correctly identified as "structurally impossible for competitors" — ships one tranche later | The moat is not contested (no competitor can enter it; K-SEED §0). It does not decay. value.js needs the interval to ship the gating grammar anyway. |
| **K is "less ambitious" than the seed envisioned** | the orchestrator wanted K to "push past the 2026 frontier"; repair reads as retreat | It is the OPPOSITE of retreat — it is the J lesson finished. A frontier shipped over a broken front door is the J catastrophe (charter ≠ truth). Repairing the product IS the on-brand move (`FINAL.md:537`: "green means a human anywhere meets the same true, whole, beautiful product"). |
| **Two-repo coordination still required for L** | L still gates on value.js VJ.W1/VJ.W2 | But now it's L's problem, on L's authorization, with value.js given a tranche-interval to ship — strictly better than K blocking on it today. |
| **The WL2-B "ripest item" idles one more tranche** | the engine drops a declared CSS operator for another tranche | Recorded, not lost. It rides L.W0 unchanged. No human is waiting for it; the P0 human is waiting now. |

### 3.4 The minimal frontier FOLD into K (conservative — the J-FOLD discipline applied to K)

Applying the seed's OWN fold test (judge-ranking:208 "≤~20 LoC or docs-only, lands inside a wave
K already charters, no new wave-level gate"), exactly ONE frontier item folds cleanly:

- **K3-internal (the 2 engine diagnostic rows `EMPTY_PARSE`/`UNKNOWN_TIMING_FN`)** — already
  tagged J.W1 in the seed (K-SEED §4), and J.W1 landed the total selector guard
  (`FINAL.md:357` SEAM-1). VERIFY these landed; if not, they ride K.W1 as a ~20-LoC companion to
  the cold-path engine work. **This is the ONLY frontier fold; everything else is L.** Do NOT
  fold WL2-B or PHYS-C into K — they are M+-effort frontier waves wearing fold hats (the seed's
  own warning, judge-ranking:210).

---

## §4 — THE L RE-SEED (what defers, verbatim)

`docs/tranches/J/audit/frontier/K-SEED.md` re-files as `docs/tranches/L/L-SEED.md` UNCHANGED in
content, with ONE reconciling preface: *"K consumed the product-truth/design repair band
(U-K1..K20 + the cold-path P0); this frontier deferred WHOLESALE to L, un-blocked by the
value.js VJ.W0→VJ.W2 grammar shipped in the K interval."* The carry-over is total:

- The 6-wave DAG (W0 fidelity → W5 externalize) — unchanged, still correct.
- The value.js half (§7) — value.js's own next tranche should still run VJ.W0→VJ.W4; the K
  interval is exactly when it ships, so L starts un-blocked.
- The 12 KILLs (§5) — non-re-litigable, carry verbatim.
- The BOOKs (§6) with their tripwires — carry verbatim.
- ED-3 (dogfood inversion) GAINS strength: L's "demo consumes the published barrel" is honest
  only because K repaired the demo first.

---

## §5 — CROSS-LANE CONSISTENCY CHECK (where the sibling lanes' wave-class tags converge)

The sibling lanes independently proposed wave-classes WITHOUT coordinating. They converge on the
SAME shape, which corroborates Shape A:

| Sibling lane | Its proposed wave-classes | Maps to my K.W |
|---|---|---|
| `live-cold-play-path.md` | "cold-play-engine fix", "gate fix (born-RED cold-hero leg)", "dock-layout" | K.W0 + K.W1 |
| `live-session-gap-analysis.md` | "COLD-ENTRY gate", "de-noise B1", "amiga engine-started oracle", "deps-current widen", "remove FourierField" | K.W0 + K.W1 + K.W2 + K.W3 |
| `live-amiga-breakage.md` | "amiga appearance", "amiga amplitude", "playback-persistence policy", "amiga oracle" | K.W1 (policy) + K.W3 (appearance) |
| `live-typography-truth.md` | "Typography-root", "Layout-refine", "Dependency-upgrade" | K.W3 + K.W5 + K.W2 |
| `live-dock-tabs-selects.md` | "K-fast/K.W1 (single-line guard)", "K.W_tabs", "K.W_spring-ui" | K.W4 |
| `live-glassui-currency.md` | "K.W-REPIN", "K.W-TYPOGRAPHY", "K.W-SPRING-UI", "K.W-LAYOUT", "K.W-HERO" | K.W2 + K.W3 + K.W4 + K.W5 |
| `live-fourier-grid.md` | "K.W1 (appearance/hero composition)", "K.W1 (grid token)" | K.W3 |

**NONE of the seven product-truth lanes proposed a frontier wave-class.** Every wave-class they
named is a repair or design wave. The fleet's own evidence is unanimous: K is the repair tranche.

---

## §FOLD

| # | Finding | Severity | The seam | Suggested wave-class |
|---|---|---|---|---|
| R1 | **The K-SEED's frontier charter (CC-1 anchor, round-trip TOTAL) is mis-prioritized against the post-J reality: a born-RED P0 (cold front-door does not animate) + 20 binding user findings exist that the frontier does not touch.** K must NOT anchor on CC-1. | **P0** (allocation) | `K-SEED.md §0` charter vs `live-cold-play-path.md §P0-1` | **K = repair+design tranche; frontier defers to L (Shape A)** |
| R2 | Shape B (split: repair ∥ frontier W0/W4) REJECTED — the playback-persistence seam (amiga K4-C) is NOT file-disjoint from PHYS-C/cold-path; the split re-creates J's divided-attention failure | P1 | `scenePlaybackAdapters.ts`/`sceneMachine.ts` shared by cold-path + amiga + PHYS-C | (rejected — argued §2) |
| R3 | Shape C (integrated charter) REJECTED — forcing the repair under "round-trip TOTAL" makes the FINAL's scope-claim a lie (the J catastrophe shape) AND mortgages the P0 behind the value.js gate | P1 | `K-SEED.md §0` charter sentence | (rejected — argued §2) |
| R4 | The frontier defers UNCHANGED to L (the 6-wave DAG + value.js §7 + 12 KILLs + BOOKs); deferral UN-BLOCKS it (value.js ships VJ.W1/W2 grammar in the K interval) | P2 | re-file `K-SEED.md` → `L-SEED.md` + 1 preface | **L re-seed (docs)** |
| R5 | The ONLY frontier item that folds into K is K3-internal (2 diagnostic rows, already J.W1-tagged) — VERIFY landed; everything else is L. Do NOT fold WL2-B/PHYS-C (M+-effort waves wearing fold hats) | P2 | `K-SEED.md §4`, `judge-ranking.md:210` | K.W1 companion (~20 LoC) OR confirm-already-landed |
| R6 | The proposed K ordering is load-bearing: **cold-entry ORACLE first** (K.W0), then the P0 fix it proves (K.W1), then currency (K.W2), then design-totality (K.W3-5) on the now-honest gate substrate — so every repair lands born-RED, never green-while-broken (the J §4 lesson) | P1 | the gate-blindspot (`live-session-gap-analysis.md §0`) | **K wave-ordering (the charter spine)** |
| R7 | All 7 product-truth sibling lanes independently proposed ONLY repair/design wave-classes (zero frontier) — the fleet's evidence is unanimous that K is the repair tranche (§5 convergence table) | P2 (corroboration) | the 7 sibling §FOLD tables | (corroborates Shape A) |

**Bottom line:** K-SEED divined the right FRONTIER but on a stale priority. The J close proved its
own §4 lesson un-finished (the cold-path P0 of the SAME subject-write class escaped the synthetic
`proof:subject-animates`). **K is the product-truth + design-totality repair tranche** — cold-entry
oracle → P0 fix → glass-ui 3.13.0 currency → typography/appearance root → spring/tabs/single-option
totality → layout totality. **The frontier defers WHOLESALE to L, re-seeded unchanged and
un-blocked** by the value.js grammar that ships in the interval. Not a split (the playback seam is
shared), not an integrated charter (it would lie the scope) — a clean repair tranche, the J lesson
finished, the moat preserved for L.
