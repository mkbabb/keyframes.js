# Tranche K · Audit Lane — Live-Session Gap Analysis

**Lane:** `live-session-gap-analysis` (DOCS ONLY — no source/test/gate/CI edits).
**Repo state:** `tranche-j-dev` == `master` @ `4f1fc4c` (Tranche J closed 2026-06-11; 4.2.0 published).
**Built dist probed:** `dist/gh-pages/` (present; `dist/keyframes.js` present). Browser harness: `scripts/lib/demo-driver.mjs withPage`, `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`, Chromium headless.
**Probe scripts (re-runnable, in this dir):** `k-cold-path-probe.mjs`, `k-cold-frames.mjs`, `k-isolate.mjs`, `k-verify-gate-blindspot.mjs`.
**Screenshots:** `screenshots-k/k-cold-01-hero.png`, `k-cold-02-after-play.png`; sibling-lane `cold-cube-2s.png`, `warm-cube-2s.png`, `amiga-cold-1.png`.

---

## §0 — THE META-FINDING (stated up front)

The WZ verify rounds certified `proof:all` GREEN on the close tree; the user found the product broken hours later. The diff is not flakiness — it is a **structural axis the gate battery never drives**. Three independent failure modes, all confirmed by live probe:

1. **The COLD-ENTRY path is unexercised.** Every play-driving leg in `proof:live-session` either `seedControlsOpen(page)` (line 387/422/495/677/747/1148/1273) and/or hash-navigates **directly to `#/cube`** before driving play. **No gate lands cold on the hero (`#/`), clicks the rainbow play CTA as the FIRST gesture, and asserts the cube smoothly animates.** Verified: `for f in scripts/proof-*.mjs; grep goto#/ AND clickPlay AND NOT seedControlsOpen → 0 matches`.

2. **The hero-CTA actuation gap.** The hero gates (`proof:hero-balance`, `proof:hero-cls`, `proof:hero-rung`, `proof:dogfood-hero`) are pure static/visual: `grep -cE "click.*[Pp]lay|togglePlay|distinct.*transform|Pause animation"` → **0** in every one. The hero's rainbow play is never clicked by any gate.

3. **The B1 liveness oracle is satisfied by INDEPENDENT idle motion, not the engine write.** This is `proof:subject-animates`' OWN documented false-positive (its docstring lines 8–13) — but that gate only guards a SYNTHETIC `<div>` probe over `dist/keyframes.js`, never the demo cube. The demo's live B1 oracle in `proof:live-session` still samples `.cube/.graph/.idle-hover` and greens on the always-on CSS `idle-bob`.

---

## §1 — THE COLD-PATH P0 (root of U-K2 / U-K3 / U-K5, extends the orchestrator triage)

### Observed (live, built dist)

`k-isolate.mjs` — distinct computed transforms over 2.2s, per element, after a SINGLE click:

| Path | `.cube` (engine-write) | `.idle-hover` (CSS bob) | `.graph` (orbital) | dock play aria |
|---|---|---|---|---|
| **COLD** (hero `#/` → click rainbow play) | **0** | 85 | 13 | **"Play animation"** (never flips) |
| **CHOREO** (direct `#/cube` + seed + click) | 0* | 0 | 1 | **"Pause animation"** (flips) |

`k-cold-frames.mjs` — 10 frames @180ms after the hero-play click: the dock play button reads `"Play animation"` on **every** frame; the playback range/ball never render (panel not open). `cold-cube-2s.png` confirms the **slider thumb parked at 0 (left), pastel/Play dock button**; `warm-cube-2s.png` shows the **slider at ~50%, vivid/Pause dock button**.

**Verdict:** From the HERO start screen, clicking the rainbow play transitions `home → cube` (the machine flips — `SCENE AFTER PLAY CLICK: cube`) **but the engine never starts** (play state never leaves "Play"; the playback ribbon stays at 0). The cube *appears* to move only because `.idle-hover { animation: idle-bob 3s ... infinite alternate }` (`demo/cube/CubeTarget.vue:207-214`) runs unconditionally. This is precisely the orchestrator's "subjects freeze while the playhead advances" — and worse: cold, even the playhead does not advance.

This is **P0** — the product's primary first-run gesture (the rainbow CTA on the landing hero) does not produce the animation it advertises.

### Root cause (suspect confirmed, exact mechanism)

The cold path runs: hero play → `onPlayStateChange(true)` (`demo/app/useSceneMachineApp.ts:155-165`) sees `isHome && playing && isHomeEmptyGroup` → sets `autoPlayNext=true` + `runSceneSwitch("cube")` → `NAVIGATE`. Because home↔cube **share the Suspense key `"cube"`** (`demo/app/App.vue:309-312`), there is NO remount, so the `<Suspense>@resolve` and the `watch(sceneRef.animationGroup)` paths do NOT fire. The home↔cube transition is driven only by the `watch(currentSceneId)` "shared" branch (`useSceneMachineApp.ts:143-147`), which calls `markSceneReady()` synchronously. `markSceneReady` is supposed to `bindSceneAdapter()` (swapping `currentAnimationGroup` from the empty placeholder to the real cube group) and then `dispatch PLAY` when `autoPlayNext` is true (`:128-130`).

The PLAY dispatch is reached, but the engine does not start. The seam is the **adapter↔group binding timing**: `createGroupAdapter(() => currentAnimationGroup.value)` (`scenePlaybackAdapters.ts:37`) is registered against `currentAnimationGroup`, and the machine's PLAY routes through the adapter's restore/play — but the snapshot codec (`snapshot().playing` is `false` for a never-started group, `:57`) restores a **paused/non-playing** state rather than issuing a fresh `group.play()`. The synchronous shared-key path means the PLAY fires against a group whose adapter/snapshot says "not playing," so nothing starts. The J.W7c U4 conditional-select deletion is **not** the direct cause here (it governs the `<Select>` render only); the cold-path break is the home↔cube shared-key autoplay-restore seam. (The U4 change is a separate U-K16 concern — see §3.)

**Why every gate missed it:** the B1 leg (`proof-live-session.mjs:383-411`) clicks home play (`:390`) but then **immediately overrides the nav with `location.hash = "#/cube"` (`:395`)** — a DIFFERENT nav mechanism that remounts/re-resolves — and samples DURING that, then clicks play AGAIN on cube (`:409`). It never asserts the home-play's own `runSceneSwitch` autoplay worked. And it samples `.idle-hover`, so 101 distinct values green it regardless.

### The gate-blindspot, demonstrated

`k-verify-gate-blindspot.mjs` runs the **verbatim B1 oracle** (`.cube/.graph/.idle-hover` ≥3 distinct over 100 ticks) on the cold-BROKEN state:

```
B1 distinct transforms: 101  → B1 verdict: PASS (GREEN)
ACTUAL engine state: play button = "Play animation"  → engine is NOT playing
```

**B1 greens while the engine never started.** The `idle-bob` alone saturates the count.

---

## §2 — THE AXIS-COVERAGE MAP (for the K gate work)

Classification per the lane mandate: **(a) covered-but-passed** (gate exists, oracle too weak), **(b) uncovered axis** (no gate drives it), **(c) post-certification drift**.

| User finding | Class | The gate that should have caught it | The oracle weakness / gap |
|---|---|---|---|
| **U-K2** hero rainbow-play → no smooth transition to cube animating | **(b) uncovered axis** + **(a)** | `proof:live-session` B1; `proof:subject-animates` | No leg drives the hero CTA cold; B1 force-navigates past the home-play and samples `.idle-hover`; `subject-animates` is synthetic (never the demo). |
| **U-K3** rainbow play broken while slider progresses | **(a) covered-but-passed** | `proof:live-session` B1 | B1's distinct-count is satisfied by idle motion; it never asserts `dock play aria flips Play→Pause` nor `playback slider value advances`. |
| **U-K5** none of the animations work properly (/square + cube) | **(a)** + **(b)** | `proof:subject-animates`, B1 | The cube-write itself is near-static even in CHOREO (`k-choreo-verify`: every cube element 1 distinct transform while play=Pause); the synthetic gate's `<div>left` never exercises the demo's matrix/CSS-var transform path. |
| **U-K4** amiga floats + flashes constantly | **(b) uncovered axis** | `proof:live-session` S5 `present-loop` | The amiga oracle asserts only "rAF ticks arrive" (loop liveness), NOT "the click started the engine" nor "no idle float at rest". `amiga-cold-1.png`: slider parked at 0, Play state — the sphere floats on idle motion, engine off. |
| **U-K6 / U-K8 / U-K10** fonts wrong; dock should carry display voice (Instrument Serif) | **(a) covered-but-passed** | `proof:demo-fonts` | The gate asserts NO Plus Jakarta (a negative) + display IS Instrument Serif — but never asserts the **dock-label/chrome resolves the display serif**. A dock in the wrong (text/mono) voice passes. |
| **U-K1** dock not shrunken by default | **(b) uncovered axis** (design-intent) | none | `proof:live-session` never reads the dock's DEFAULT collapse state on cold mount; `k-cold-02` shows it collapsed-by-default, which the user rejects. |
| **U-K7 / U-K13 / U-K17 / U-K18 / U-K19** layout, panes "look awful", clipped pane, hierarchy, resize-vs-drag | **(b) uncovered axis** | `proof:demo-shell-grid`, `proof:stage-not-clipped`, `proof:visual-lock` | These gates assert structural facts (grid present, not clipped, pixel-lock to a baseline) — they cannot assert "looks good / refined" or "draggable not resizable". `visual-lock` re-baselined in W7c, so the disliked state IS the locked baseline (drift the user dislikes is now green). |
| **U-K11 / U-K15 / U-K16** spring UI inadequate; slider steps; needs real options; single-option dropdowns persist | **(a)** + **(b)** | `proof:single-toggle`/U4 conditional-select; `proof:drawer-spring` | U4 made the dock animation-select conditional (`TransportDock.vue:39`) but the no-single-option rule is NOT total — other selects (per-scene) still render lone options; no gate asserts "stepped slider is smooth". |
| **U-K12** top tabs look awful (pills/dock-dropdown) | **(b) uncovered axis** | `proof:scene-control-dfa` | Asserts the DFA tab SET is correct, never the tab CHROME (pills vs tabs). |
| **U-K14** upgrade to latest glass-ui | **(c) post-certification drift** | `proof:deps-current` / `proof:repin-witness` | kf pins `~3.11.2` (installed 3.11.2); registry latest **3.13.0**. `~` blocks the minor bump; the gate greened the stale pin. |
| **U-K20** remove FourierField from hero; grid less opaque | **(b) uncovered axis** | none | `EditorStartScreen.vue:79` mounts `<FourierField>`; no gate asserts its absence or the grid-line opacity. |

### What the K gate roster needs (the coverage the map demands)

1. **A COLD-ENTRY gate** (born-RED on this bug): fresh context, NO seed, `goto #/`, find + click the hero rainbow play, then assert **`dock play aria` flips `Play → Pause`** AND **the playback slider/`--ball-p` advances** AND **`.cube` (engine-write element ONLY, NOT `.idle-hover`/`.graph`) traverses ≥3 distinct transforms** within the play window. The element-isolation is the load-bearing fix.
2. **De-noise the B1 oracle:** drop `.idle-hover`/`.graph` from the distinct-count sample (they move independent of the engine); add a `play-aria-flips` precondition. The current sample is structurally unable to discriminate engine-on from engine-off.
3. **An amiga ENGINE-STARTED oracle** beside the present-loop liveness: assert the click flips play AND the sphere's engine-driven rotation (not idle float) advances; assert no float at rest.
4. **Positive font-voice assertion** for the dock (display serif resolves on `.dock-label`), not just the Jakarta negative.
5. **A `deps-current` widen** (or a born-RED repin-witness) for glass-ui `~3.11.2 → 3.13.0`.

---

## §3 — SECONDARY OBSERVATIONS (rooting the binding seeds)

- **CHOREO cube near-static (extends U-K5):** even when play flips to Pause, `k-choreo-verify` shows every cube element with **1 distinct transform** over 2s. The slider/balls advance (`warm-cube-2s.png`) but the cube face orientation is visually identical to the cold frame. Either the 5s `alternate` duration makes motion sub-threshold in the window, OR the cube transform-write is genuinely broken. **Needs an impl-lane runtime trace** — I flag it as suspected-real, not proven-broken, because the 50-char transform truncation could mask slow motion. The K gate's cold oracle (isolated `.cube` over a full cycle) would settle it.
- **U4 / `TransportDock.vue:39`:** the conditional `<Select v-if="animationNames.length > 1">` is sound for the DOCK select, but U-K16 ("single-option dropdowns STILL render somewhere") means the no-single-option rule is **not total** — sweep the per-scene selects (`AnimationControls.vue`, `EasingSelect.vue`, spring/sequence panels) for lone-option renders.
- **glass-ui worktree contamination:** `/Users/mkbabb/Programming/glass-ui/.claude/worktrees/*` contains many stale `GlassDock.vue` copies — the active source is `glass-ui/src/components/custom/dock/GlassDock.vue`. All dock/font ROOT fixes (U-K1/U-K6/U-K14) belong in the glass-ui repo (per MEMORY: glass-ui root changes never patched in demo).
- **No console errors on the cold path** (`pageerror`/`console.error` both 0 across all probes) — the break is SILENT, which is exactly why the error-budget oracle (`proof:live-session` S2a) stayed green. The defect is a no-op, not a throw; budget gates are blind to it.

---

## §FOLD

| # | Finding | Severity | The seam | Suggested wave-class |
|---|---|---|---|---|
| F1 | Cold hero rainbow-play transitions home→cube but **the engine never starts** (play aria never flips, slider parked at 0); cube only "moves" via idle-bob | **P0** | `useSceneMachineApp.ts:128-147` shared-key autoplay-restore + `scenePlaybackAdapters.ts:57` snapshot-says-not-playing | **impl: cold-path play fix** (fresh `group.play()` on `autoPlayNext`, not snapshot-restore) |
| F2 | B1 liveness oracle greens on idle motion (`.idle-hover`/`.graph`); 101 distinct on engine-OFF state | **P1** | `proof-live-session.mjs:398` sample set + `:395` force-nav past home-play | **gate: de-noise B1 + add play-aria-flip precondition** |
| F3 | **No gate drives the hero CTA cold** (0 gates: goto#/ + clickPlay + no-seed); hero gates are static-only | **P1** | the whole battery seeds controls / direct-cube-navs first | **gate: born-RED COLD-ENTRY gate** (isolated `.cube` write + slider advance) |
| F4 | `proof:subject-animates` guards a SYNTHETIC `<div>` over `dist/keyframes.js`; never the demo cube/idle-hover it warns about | **P1** | `proof-subject-animates.mjs:81-117` synthetic probe page | **gate: extend subject-animates to the demo dist** (or fold into F3) |
| F5 | amiga "floats + flashes": cold engine-off, idle float only; oracle asserts loop-liveness not engine-started | **P1** | `proof-live-session.mjs:864-894` present-loop = rAF-ticks-only | **gate: amiga engine-started + no-rest-float** |
| F6 | CHOREO cube near-static (1 distinct transform while play=Pause) — suspected cube-write defect (U-K5) | **P1** (suspected) | cube matrix/CSS-var transform pipeline | **impl-lane runtime trace** (the F3 gate would settle it) |
| F7 | `proof:demo-fonts` asserts dock has no Jakarta but not that it carries the display serif (U-K6) | **P1** | `proof-demo-fonts.mjs` (negative-only on chrome) | **gate: positive dock display-voice** + **glass-ui ROOT font fix** |
| F8 | glass-ui pinned `~3.11.2` (installed 3.11.2); registry latest **3.13.0**; `~` blocks the bump (U-K14) | **P1** | `package.json`/`demo/package.json` `~3.11.2` | **chore: widen pin + repin-witness** (glass-ui upgrade tranche) |
| F9 | No-single-option rule not total — lone-option selects still render outside the dock (U-K16) | **P2** | per-scene selects (`AnimationControls`, `EasingSelect`, spring/sequence) | **impl: generalize the U4 count-gate** |
| F10 | `visual-lock` re-baselined in W7c → the user-disliked layout/green-state IS the locked baseline (U-K13/K17) | **P2** | `proof-visual-lock.mjs` baselines (re-shot 377eb3e) | **gate: re-baseline after the K refinement, not before** |
| F11 | Error-budget gates blind to silent no-op defects (cold path threw nothing) | **P2** | `proof-live-session.mjs:142-178` budget = throws-only | **gate: pair every budget leg with a positive product assertion** |
| F12 | FourierField mounted on hero (U-K20); no gate asserts its presence/absence or grid opacity | **P2** | `EditorStartScreen.vue:79` | **impl: remove FourierField + grid-opacity tune** |

**Bottom line for K gate work:** the entire J battery proves the CHOREOGRAPHED path (open controls → select → play) and the ERROR-BUDGET (no throws). It is structurally blind to (1) the COLD first-run gesture, (2) engine-on vs idle-motion discrimination, and (3) silent no-op defects. F1–F5 are the load-bearing K-tranche cuts; the single highest-leverage new gate is **F3 (the cold-entry gate with `.cube`-isolated write assertion + slider-advance)** — it is born-RED on the live P0 and closes the meta-finding's whole axis at once.
