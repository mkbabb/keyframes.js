# J.W4 — IMPL record (THE AXES BATTERY · PHASE 1 the INPUT-MODALITY band LANDED on W0+W3 · PHASE 2 the APPEARANCE-CERTIFICATION band LANDED on the suffused W7a tree — the §PENDING-W7a register DISCHARGED)

> **PHASE-2 close (2026-06-11).** The APPEARANCE-CERTIFICATION band has LANDED on the
> suffused tree (W7a merged here): the three former §PENDING-W7a mobile legs (A1 overlap==0
> · A2 dark `--ball-tone` contrast · A3 ghost-rail-absent) are wired into
> `proof:live-session-mobile` and GREEN, AND the W7a §Hard gate's `proof:appearance-suffusion`
> (clauses (a)–(g)) — flagged by the W7a close as **NOT YET AUTHORED** — is AUTHORED, tiered,
> and GREEN (the W7a gate-residue CURED; the W7a hard gate now BITES in CI). Every phase-2
> clause is **born-RED witnessed on a PLANTED dist defect** (mutate built dist → leg reds →
> byte-restore shasum-verified → green). The phase-2 record is **§Phase-2** below; the §PENDING-W7a
> register at the foot of phase 1 is DISCHARGED. (Phase 1's record is unchanged — preserved verbatim.)

**Status:** PHASE-1 LANDED (the appearance-INDEPENDENT input-modality band — exactly the
band the spec gates on **J.W0 + J.W3**, both DONE on this tree) · `proof:live-session`
GREEN with the three new legs (S5 every-scene sweep · S2 reduced-motion snap · S4
keyboard/focus) at ERROR BUDGET = 0 · `proof:live-session-mobile` (NEW sibling battery,
S1/S7) GREEN — 11/11 clauses, budget 0, CH-3 occlusion geometry holding at BOTH detents ·
every phase-1 leg **born-RED witnessed on a PLANTED dist defect** (mutate built dist →
leg reds → byte-restore shasum-verified → green; the verbatim ledger below) ·
`proof:ci-coverage` GREEN (112 gates; `proof:lighthouse-mobile` LEFT the EXCLUDED set) ·
`proof:chronic-closure` GREEN (CH-3 cites `proof:live-session-mobile`) ·
`proof:published-surface` GREEN incl. the NEW clause (g) EP-3 BOOK · branch `j-impl-w4`
(worktree off `d3378a4`) · impl dates 2026-06-11.

**Scope honored:** ONLY the input-modality band (S1-touch + the device-INDEPENDENT CH-3
occlusion geometry, S2, S4, S5) + the band-independent S6/S7 hygiene corroborators. The
APPEARANCE-CERTIFICATION legs are **NOT implemented** — recorded in the §PENDING-W7a
register below per the binding band partition (running them pre-W7a would certify the
defect, not the cure).

---

## §Per-leg dispositions

- **S1 — THE MOBILE LEG (390×844 + `hasTouch` + `isMobile`, every gesture TOUCH): LANDED**
  as the sibling battery `scripts/proof-live-session-mobile.mjs` (782 lines) +
  `package.json` `"proof:live-session-mobile"` + `proof:correctness` roster + ci.yml
  demo-smoke step (after the gh-pages build, `KF_REQUIRE_BROWSER=1`). The IMPL chose the
  spec-permitted sibling-file shape (a real touch context is a separate `newContext`
  shape); SAME harness (`withPage`/`navToScene` from `scripts/lib/demo-driver.mjs`), SAME
  budget allowlist (`scripts/lib/console-budget.mjs`, inherited BY REFERENCE — zero
  per-leg re-statement). The enumerated battery, all green:
  - **M1 sheet** (on `/amiga`, the A-01 scene): touch-tap OPEN to the expanded detent
    (`--sheet-t=1`, spring-settled — never a fixed wait) → CDP
    `Input.dispatchTouchEvent` touch-SWIPE scrolls to below-fold content (scrollTop=165px
    of 552px overflow) → touch-tap CLOSE (`--sheet-t=0`) → touch-tap RE-OPEN reaches the
    detent AND scrolls again (the M2 re-open latch, certified on touch).
  - **M2 dock switch**: touch-tap expands the morphing dock; the touch combobox commit
    lands cube→easing per J.W0's expected-destination-state predicate (machine=easing,
    trigger="Easing") — the REAL touch path, not a hash assignment.
  - **M3 drag surface**: `/square` CDP touch-drag COMPLETES — transform persists
    (`matrix(1.09384, …)`) and `getSelection()` is empty (the touch-only
    `touch-action`/selection regression class INVE-2 names).
  - **M4 play**: touch-tap the rainbow group-play (`.tap()` asserts hit-testability) →
    71 distinct subject/visualizer transforms (the B1 liveness oracle, on touch).
  - **ERROR BUDGET = 0** across the whole battery.
- **S7-geometry — the CH-3 MOBILE OCCLUSION ORACLE (inside S1's context): LANDED + it BIT
  ON A LIVE DEFECT.** `sheet.bottom ≤ menubar.top` (1px AA tolerance) measured at BOTH
  detents on the real 390×844 touch context. **Born-RED of record (a LIVE pre-cure
  defect, not only a plant):** on the pre-cure tree the always-expanded TransportDock
  (~90px rendered host) overran the token-derived `--dock-band-reserve` (≈52px) and the
  menubar painted over the open sheet's bottom control row — `sheet.bottom 762 >
  menubar.top 730` (~32px), the M1 occlusion class live at 390×844. **The cure (the one
  source deviation — see §Source-scope note):** `TransportDock.vue` publishes the
  menubar host's measured border-box height as `--menubar-measured-h` (`:root`,
  ResizeObserver); `style.css` folds it into `--dock-band-reserve` via
  `max(token-floor, measured)` — exactly the I deferred-ledger CH-3 prescription
  ("derive sheet anchor from MEASURED menubar height"); cycle-free (height is
  content-driven, never a function of the reserve it feeds). Post-cure: `sheet.bottom
  702 ≤ menubar.top 702` at both detents. RED→GREEN witnessed live, PLUS the planted
  dist re-witness (ledger P1).
- **S2 — THE REDUCED-MOTION LEG: LANDED** as a leg of `proof:live-session`.
  `emulateMedia({ reducedMotion: "reduce" })` set BEFORE load; scoped to the NAMED
  `respectReducedMotion: true` consumers: (control) a non-PRM context first proves the
  home TypingDots BLINK (multi-frame churn 4,4,4 — so "static" is never vacuous); (a)
  under PRM the SAME dots are SNAPPED (churn 1,1,1 — the inverse-of-B1 oracle); (b) the
  mobile sheet spring snaps `--sheet-t` 0→1 in ONE emit (`sheetTrail ["0","1"]`, no
  spring arc); zero budget. Green: `{"prmMatches":true,"controlChurn":[4,4,4],
  "prmChurn":[1,1,1],"sheetTrail":["0","1"],"pass":true}`. Born-RED: ledger P3.
- **S3 — THE DARK LEG: NOT IMPLEMENTED — PENDING-W7a (by binding band partition).** The
  spec admits the leg GREEN only with the appearance band ("the leg as a whole is
  admitted GREEN with the appearance band so its contrast oracle runs against the
  suffused accents"). Registered below.
- **S4 — THE KEYBOARD/FOCUS LEG: LANDED** as a leg of `proof:live-session` (keyboard-only
  — zero mouse/tap in the leg). (1) Tab reaches the rainbow play `<button>` (reachedAt=24,
  the transport dock seen en route — no trap, no skipped primary control); (2) the
  `:focus-visible` ring is RENDERED (matchesFV + ringPainted — computed style present,
  device-INDEPENDENT); (3) BOTH actuation facts asserted separately: focused **Enter**
  synthesizes the native click and starts playback (enterLive=58 distinct transforms — the
  B1 oracle by keyboard), and the GLOBAL **Space** shortcut toggles playback from anywhere
  (`registerShortcut("Space", …)`, `AnimationControlsGroup.vue:284`); (4) zero budget.
  Born-RED: ledger P2.
- **S5 — THE EVERY-SCENE SWEEP: LANDED** as a leg of `proof:live-session`. The roster is
  the AUTO-TRACKING lib `SCENES` export (demo-driver parses `scenes.ts` with a
  bidirectional stale-key guard) + a bidirectional `SWEEP_META` guard that THROWS at
  module load on any unenrolled/stale scene — the anti-`:711` clause (a scene added to
  `scenes.ts` cannot be silently omitted; a removed scene cannot leave a stale row).
  For EVERY routed scene (home, cube, amiga, square, easing, spring, sequence,
  motion-path — 8): ENTRY via `navToScene`'s per-expected-destination predicate (`home`
  is SWEPT, trigger-ABSENT); PLAY+INTERACT per scene class — spring rail-scrub (ball
  churn), sequence transport (row-state changes), motion-path traveller + a real handle
  drag that RE-SHAPES the editable path `d` — never glyph-paint-only; the covering
  dock-combobox switch WALK lands every adjacency once, wrapping to home
  (`visited:9` = 8 + wrap). Green: `{"roster":8,"visited":9,"sceneFails":[],"pass":true}`.
  Born-RED: ledger P4 (with two ABSORBED plant attempts recorded honestly).
- **S6 — `proof:lighthouse-mobile` ENTERS A TIER UNDER ITS DECLARED P6 POSTURE: LANDED.**
  `declarePosture("observe-only", { reason: "mobile Lighthouse CPU/network throttle
  assumes a calibrated or real-device host — absolute scores are environment artifacts on
  shared runners; hard on-device via KF_REQUIRE_LH=1" })` through the ONE
  `scripts/lib/ci-env.mjs` helper (J.W3's single CI-env authority — the posture-authority
  clause of `proof:ci-coverage` confirms ci-env is still the only `process.env.CI` reader
  across 106 scripts). `KF_REQUIRE_LH=1` hard-asserts BEFORE the posture routing (a
  calibrated runner is never softened by `IN_CI`); ONLY ceiling misses route observe-only
  — harness/run errors keep the pre-existing RECORDS-WITHHELD regime (no infra failure is
  silently greened). Tiered: `proof:hygiene` roster + ci.yml demo-smoke step (placed WITH
  the gh-pages-consuming gates ABOVE the dist-wiping `build:lib` tail — the W4-F1
  placement rationale recorded in ci.yml; a post-wipe run would RECORDS-WITHHELD on every
  CI run, a de-facto CI-exclusion in disguise). It LEFT the `proof:ci-coverage` EXCLUDED
  set; the taxonomy posture-manifest row added (`gate-taxonomy.md`) and the stale
  "named non-instance" row deleted; the over-read prohibition recorded in the script, the
  taxonomy, and the ci.yml step name ("never over-read as mobile perf holding in CI" —
  the correctness owner of "mobile works" is `proof:live-session-mobile`). **Posture
  exercised end-to-end:** a `CI=true` run on this host produced 6 ceiling misses, ALL
  routed `[CI observe-only — …]`, exit 0 with the RECORDED verdict — the absolute scores
  (Perf 33–61 vs ceilings 49–64) being exactly the shared-sandbox environment artifact
  the declared reason names. `demo-smoke` timeout re-sized 20→35m, measure-first (the
  pre-W4 roster measured 19m13s, run 27310054675; + mobile battery + axes legs +
  observe-only Lighthouse matrix).
- **S7 — EP-3 DISPOSITIONED (PATH B — the recorded BOOK) + CH-3 RE-CERTIFICATION WIRED:
  LANDED.**
  - **EP-3:** `docs/published-surface.md` gains the §EP-3 table — all six exports
    (`flip`, `flipShared`, `drag`, `Draggable`, `DrawSVG`, `fromDrawSVG`) PATH B with the
    explicit "no live-session scene" disclosure and cited unit coverage
    (`test/flip.test.ts`, `test/drag.test.ts`, `test/draw-svg.test.ts` +
    `proof:drawsvg`). Machine-checked by the NEW clause (g) in
    `scripts/proof-published-surface.mjs`: (i) every EP-3 export must carry a row;
    (ii) every cited test file must EXIST on disk (a stale citation reds); (iii) every
    PATH B row must carry the disclosure. No export rides un-dispositioned
    (P-invariant-28). The PATH A flip stays open: a future befitting scene auto-joins the
    S5 sweep via the scenes.ts roster. (Collateral fix in the same script: the must-pack
    walk now applies the J.W5 `files: ["dist", "!dist/gh-pages"]` negation, so a
    demo-built tree no longer false-reds 50+ "did NOT pack" findings.)
  - **CH-3:** `docs/tranches/I/PROGRESS.md` CH-3 row (the ledger `proof:chronic-closure`
    parses) REPLACES the desktop `perf-frame-budget`+`drag-gesture` closure citation with
    `proof:live-session-mobile` + the born-RED prose (the live pre-cure 32px
    menubar-over-sheet defect + the planted-detent dist re-witness).
    `proof:chronic-closure` GREEN: CH-3 → "runtime gate(s) that BIT:
    proof:live-session-mobile, proof:perf-frame-budget". The felt-perf half stays
    observe-only-in-CI per P6; the human-visible occlusion half hard-gates ON the mobile
    viewport.
- **Harness/lib (no new boilerplate — the W3 lib is the authority):** the new battery
  imports `withPage`/`navToScene` + `chargeBudget`/`isNamedBenign`; grep for
  `serveDist|resolveChromium|launch(|createServer` copies in the new gate = 0.
  `scripts/lib/gate-shape.mjs` `ACTUATION_PRIMITIVES` extended with the TOUCH modality
  (`.tap(`/`touchscreen.tap`, CDP `Input.dispatchTouchEvent`) so `proof:gate-is-runtime`
  recognizes touch actuation as first-class — `proof:live-session-mobile` classifies
  RUNTIME/INTERACTION in the correctness tier (13 gates).
- **NO escapes:** zero `continue-on-error`, zero settleMs (`--sheet-t` spring-settle +
  `navToScene` predicates are the only waits), zero bare-`IN_CI` on any
  device-INDEPENDENT clause (the occlusion geometry, the focus ring, the keyboard
  actuation, the PRM snap all HARD-gate everywhere).

---

## §The born-RED plant ledger (VERBATIM — mutate built dist → leg reds → byte-restore shasum-verified → green)

Witness baselines captured pre-plant at `/tmp/kf-w4-witness/baseline.sha256`:

```
a816a7a9d795c825d763b8f7134176c292664799e86b300573a16ab7ec0cf41f  dist/gh-pages/assets/index-Dn1nDR4t.css
eb785ba0df849051f67be0560c24b30f15359f330ed521ae6ef08b2ca048a0a1  dist/gh-pages/assets/engine-DZcTI7Qc.js
cf378edafba55c617f11c8ae4af5113af06f24d6c7a4a8154cfa22d3b9d89184  dist/gh-pages/assets/index-B0-AnUWN.js
6afdd79fa7adabb12bef1c80bb7aaaf671ad70189af1971082f17b5364ff3231  dist/gh-pages/assets/SpringScene-Bn7Kc_gR.js
```

### P1 — S1/S7 (the mobile leg's CH-3 occlusion geometry) · the SELF-CONTAINED detent/band plant

**Plant** (built CSS, length-preserving): `--dock-band-reserve:max(calc(var(--dock-icon-height)
+ var(--dock-margin) + env(safe-area-inset-bottom,0px)), var(--menubar-measured-h,0px))` →
the token-only `calc(...)` (the measured-menubar max() arm STRIPPED — the pre-cure form;
"PLANTED: band reserve reverted to the token-only calc (the pre-cure occlusion)").
Planted sha `99fa28783e1d275bda3d6dfb60393e8e7ddf9d9946d6b589ee521f48cabc1154` vs pristine
`a816a7a9…`. This is the spec's DIRECT local mutation — no dependence on any J.W2/J.W7a
seam (the BINDING re-pin clause stays armed for phase 2).

**RED** (`/tmp/w4-mobile-planted.log` — EXACTLY the two named geometry clauses; every
other clause green):

```
  ✗ CH-3 geometry (sheet OPEN): sheet.bottom 762 > menubar.top 724 on 390×844 — the menubar paints OVER the open sheet's bottom 38px (the M1 occlusion class, LIVE — the CH-3 mobile chronic re-opened; the sheet anchor must clear the MEASURED menubar)
  ✗ CH-3 geometry (sheet CLOSED (peek)): sheet.bottom 762 > menubar.top 724 on 390×844 — the menubar paints OVER the open sheet's bottom 38px (the M1 occlusion class, LIVE — the CH-3 mobile chronic re-opened; the sheet anchor must clear the MEASURED menubar)

proof:live-session-mobile — FAIL (2): the 390×844 + hasTouch battery red — a touch human's sheet/dock/drag/play surface (or the CH-3 occlusion geometry) is broken.
```

**Byte-restore** from `/tmp/w4-css-backup`, `shasum -a 256 -c /tmp/w4-css-sha` → OK
(`a816a7a9…`), `BYTE-RESTORED`. **GREEN** (`/tmp/w4-mobile-restored.log`):

```
  ✓ CH-3 geometry (sheet OPEN): sheet.bottom 702 ≤ menubar.top 702 on 390×844 — the bottom menubar never paints over the sheet (the M1 occlusion class is ABSENT; the chronic's re-certified mobile oracle)
  ✓ CH-3 geometry (sheet CLOSED (peek)): sheet.bottom 702 ≤ menubar.top 702 on 390×844 — the bottom menubar never paints over the sheet (the M1 occlusion class is ABSENT; the chronic's re-certified mobile oracle)

proof:live-session-mobile — PASS: a REAL touch context drove the sheet (open → scroll → close → RE-OPEN, all taps/swipes), the dock combobox switch landed per the expected-destination predicate, the /square touch drag completed (persisted, no selection), the play tap started a live draw loop, the CH-3 occlusion geometry held (sheet.bottom ≤ menubar.top at both detents), and the error budget is ZERO. The mobile half of the AXES boundary is certified on its own axis.
```

(The plant re-creates the documented LIVE pre-cure defect shape — `762 > 730` of record,
`762 > 724` under the plant — so the oracle is proven to bite on the real defect class
and ONLY on it. Adversarially re-verified in the round-1 verification pass.)

### P2 — S4 (keyboard/focus) · the global-Space shortcut plant

**Plant** (built app chunk `index-B0-AnUWN.js`, length-preserving):
`` `Space`,()=>_(),{preventDefault:!0,label:`Play / Pause` `` →
`` `KeyQQ`,()=>_(),{preventDefault:!0,label:`Play / Pause` `` — "PLANTED: the global
Space shortcut re-keyed to KeyQQ (Space no longer toggles play)" (the spec's
"remove/rename the `registerShortcut("Space", …)`" mutation, on the BUILT dist).

**RED** (`/tmp/w4-s4-planted.log` — exactly the S4 clause; S5/S2 and the whole I.W7
battery stay green, budget 0):

```
  ✗ S4 keyboard operability — Tab reaches play · focus-visible ring · Enter + global Space actuate — FAIL [J.W4 S4 (the keyboard/focus leg)] · {"reachedAt":24,"sawTransport":true,"focusRing":{"matchesFV":true,"ringPainted":true},"enterToggled":true,"enterLive":58,"spaceToggled":false,"pass":false}

proof:live-session — FAIL (2): the human battery (PLAY + SWITCH + DRAG) blew the ERROR BUDGET (S2a) and/or a product-facing DOM leg reds. Each clause cites its per-wave §Hard gate. Revert any of I.W0–I.W6 and the matching clause reds — this is the gate-of-gates.
```

(Note the discrimination: `enterToggled:true` + `enterLive:58` stay green under the plant
— the native focused-Enter path and the global-Space path are SEPARATE asserted facts,
exactly the spec's two-actuation partition.)

**Byte-restore** from `/tmp/w4-js-backup`, `shasum -a 256 -c /tmp/w4-js-sha` → OK
(`cf378eda…`), `BYTE-RESTORED`. **GREEN** (`/tmp/w4-s4-restored.log`):

```
  ✓ S4 keyboard operability — Tab reaches play · focus-visible ring · Enter + global Space actuate — PASS [J.W4 S4 (the keyboard/focus leg)] · {"reachedAt":24,"sawTransport":true,"focusRing":{"matchesFV":true,"ringPainted":true},"enterToggled":true,"enterLive":58,"spaceToggled":true,"pass":true}
```

### P3 — S2 (reduced-motion) · the always-rAF engine plant

**Plant** (built engine chunk `engine-DZcTI7Qc.js` — the spec's "revert the
`withReducedMotion` call to always take the rAF branch", on the BUILT dist):
`function re(e,t,n){return e&&ne()?t():n()}` → `function re(e,t,n){return n()}`
(the minified `withReducedMotion` — every `respectReducedMotion` consumer now animates
under PRM instead of snapping). Planted sha
`2d957754ca0011ca6d2b59aa0b2f6c6b35bdcb6565e76cf235dd511e9bc203e0` vs pristine `eb785ba0…`.

**RED** (`/tmp/w4-s2-planted.log` — exactly the S2 clause; budget 0, all other clauses
incl. S5/S4 green):

```
  ✗ S2 the engine's respectReducedMotion path SNAPS live under PRM (dots rest · sheet one-emit) — FAIL [J.W4 S2 (the reduced-motion leg)] · {"prmMatches":true,"controlChurn":[4,4,4],"prmChurn":[27,23,24],"sheetTrail":["0.9494905670215585","0.7634008864681903","0.4681480353248401","0.34429116242470154","0.2421360423355187","0.12921289466056987","0.05552032444

proof:live-session — FAIL (2): the human battery (PLAY + SWITCH + DRAG) blew the ERROR BUDGET (S2a) and/or a product-facing DOM leg reds. Each clause cites its per-wave §Hard gate. Revert any of I.W0–I.W6 and the matching clause reds — this is the gate-of-gates.
```

(The signature is the defect itself: under PRM the dots churn 27/23/24 multi-frame states
instead of resting at 1, and the sheet spring emits a full arc trail instead of the
one-emit `["0","1"]` snap — the engine taking the rAF branch under PRM, live.)

**Byte-restore** from `/tmp/kf-w4-witness/engine-DZcTI7Qc.js.orig`,
`shasum -a 256 -c /tmp/kf-w4-witness/baseline.sha256` → all 4 OK. **GREEN** on the
pristine bytes (`/tmp/w4-final-green.log`):

```
  ✓ S2 the engine's respectReducedMotion path SNAPS live under PRM (dots rest · sheet one-emit) — PASS [J.W4 S2 (the reduced-motion leg)] · {"prmMatches":true,"controlChurn":[4,4,4],"prmChurn":[1,1,1],"sheetTrail":["0","1"],"pass":true}
```

### P4 — S5 (the every-scene sweep) · the spec-NAMED spring play-time throw

**Two ABSORBED plant attempts first (recorded honestly — witness-strength findings):**
(i) `onScrub:e=>a.reseat(e)` → `onScrub:e=>e` in `SpringScene-Bn7Kc_gR.js` (sha
`1eda1efa…`) — the sweep STAYED GREEN: the churn oracle samples every `.spring-rail`
inline-`left` painter, and the rail's reactive target-marker plus the sidebar
preset-ball painter still churn ≥3 under the scrub. (ii) the rail's
`registerSpringPainter` body emptied (sha `d7bf6f87…`) — STAYED GREEN for the same
reason (the sidebar painter + reactive marker). The leg's churn oracle is BROAD across
painters, so a single-seam kill is absorbed; recorded as residual R2 below. Per the
spec's BINDING re-pin discipline the witness was re-pinned to the spec's own NAMED
alternate, which targets what the widened sweep uniquely exercises:

**Plant** (built `SpringScene-Bn7Kc_gR.js` — the spec's "plant a play-time throw in
`spring` — the widened sweep's PLAY+INTERACT pass catches the throw the old
glyph-paint-only sweep would miss"):
`` frame:e=>{if(E.status.value!==`playing`)return y(),!1; `` →
`` frame:e=>{if(E.status.value!==`playing`)return y(),!1;throw new Error("W4-S5-PLANTED: spring play-time throw"); ``
(fires ONLY when the spring scene is PLAYING — play-time, exactly the spec's wording).
Planted sha `0651a0100a985e77eac3929056954b4bbeab240a8d638df99afb7b2d20419468` vs
pristine `6afdd79f…`.

**RED** (`/tmp/w4-s5-planted.log` — the budget clause reds with the throw charged under
the S5 sweep attach, the named-defect fingerprint verbatim):

```
  ✗ ERROR BUDGET BLOWN — 4 HARD + 0 PROMOTED charge(s) across the battery (S2a, the complement of the named-benign set):
      [HARD|B7/B9:spring] weberror: [object Object]
      [HARD|B7/B9:spring] pageerror: W4-S5-PLANTED: spring play-time throw
      [HARD|S5:every-scene-sweep] weberror: [object Object]
      [HARD|S5:every-scene-sweep] pageerror: W4-S5-PLANTED: spring play-time throw

proof:live-session — FAIL (1): the human battery (PLAY + SWITCH + DRAG) blew the ERROR BUDGET (S2a) and/or a product-facing DOM leg reds. Each clause cites its per-wave §Hard gate. Revert any of I.W0–I.W6 and the matching clause reds — this is the gate-of-gates.
```

(The `[HARD|S5:every-scene-sweep]` attribution is the S5 leg catching the play-time
throw in its own attach window — the play+interact pass mounting AND playing spring. The
S5 ROSTER half of the leg was separately witnessed born-RED during the build: a
mid-build run with the dock-combobox path broken redded
`S5 … FAIL · {"roster":8,"visited":2,"sceneFails":["amiga: SWITCH red — the Scene
combobox never opened (the real dock path)","amiga: ENTRY red — machine=cube (want
amiga) …"]}` — a scene failing to ENTER reds the sweep at entry, the INVE-3 clause. The
anti-brittleness clause needs no plant at all: the bidirectional SWEEP_META ⇄ SCENES
guard THROWS at module load on any unenrolled scene — a `scenes.ts` add reaches the
sweep or the gate cannot even start.)

**Byte-restore** from `/tmp/kf-w4-witness/SpringScene-Bn7Kc_gR.js.orig`,
`shasum -a 256 -c /tmp/kf-w4-witness/baseline.sha256` → all 4 OK. **GREEN** on the
pristine bytes (`/tmp/w4-final-green.log`):

```
  ✓ ERROR BUDGET = 0 across the WHOLE battery (PLAY + SWITCH + DRAG, both modes): ZERO HARD charges (pageerror / unhandledrejection / console.error / "......" parse fingerprint / _gen) AND ZERO PROMOTED charges (amiga WebGL ReadPixels/GPU-stall · non-Monaco content-visibility). The budget is the COMPLEMENT of the named-benign EXCLUDED set (no narrowed-regex escape hatch) — S2a.
  ✓ S5 EVERY routed scene enters clean + plays/interacts + the covering dock-switch walk lands — PASS [J.W4 S5 (the AXES breadth leg)] · {"roster":8,"visited":9,"sceneFails":[],"pass":true}
```

### The closing green (pristine bytes, shasum-verified)

After the last restore, `shasum -a 256 -c /tmp/kf-w4-witness/baseline.sha256` → all four
files OK, then BOTH batteries green on the identical bytes: `proof:live-session`
(`KF_DEV_SERVER=1`, the full battery incl. the B2 dev-server leg) exit 0;
`proof:live-session-mobile` exit 0, 11/11 ✓, budget 0.

---

## §S6 record (the posture run, verbatim excerpt)

`CI=true npm run proof:lighthouse-mobile` on this (uncalibrated, contended) host —
the observe-only routing exercised end-to-end, exit 0:

```
  ✗ home     Perf  61 (≥ 63)   LCP 7.7s
  ✗ cube     Perf  50 (≥ 64)   LCP 12.6s
  ✗ amiga    Perf  33 (≥ 49)   LCP 8.1s
  ✗ square   Perf  50 (≥ 62)   LCP 10.5s
  ✗ easing   Perf  58 (≥ 61)   LCP 8.0s
  ✗ spring   Perf  48 (≥ 52)   LCP 9.1s (< 15s)

proof:lighthouse-mobile — 6 ceiling miss(es), routed per the declared P6 posture (observe-only in CI · hard locally/on-device):
  · [CI observe-only — mobile Lighthouse CPU/network throttle assumes a calibrated or real-device host — absolute scores are environment artifacts on shared runners; hard on-device via KF_REQUIRE_LH=1] home/mobile: Perf 61 < ceiling 63 (below the B mobile baseline).
  …(×6, one per scene)…

proof:lighthouse-mobile — RECORDED (CI observe-only): the misses above are OBSERVATIONAL — the felt mobile perf claim is NOT certified by this CI run (the P6 over-read prohibition); re-measure on a calibrated runner with KF_REQUIRE_LH=1.
EXIT=0
```

The misses themselves are the declared environment artifact (a shared sandbox under
parallel browser batteries); the local/on-device hard half re-measures with
`KF_REQUIRE_LH=1` on a calibrated runner per the posture row.

---

## §EP-3 register (S7 — the terminal dispositions)

| Export | Disposition | Coverage (cited, exists on disk) |
|---|---|---|
| `flip` | PATH B — no live-session scene | `test/flip.test.ts` |
| `flipShared` | PATH B — no live-session scene | `test/flip.test.ts` |
| `drag` | PATH B — no live-session scene | `test/drag.test.ts` |
| `Draggable` | PATH B — no live-session scene | `test/drag.test.ts` |
| `DrawSVG` | PATH B — no live-session scene | `test/draw-svg.test.ts` + `proof:drawsvg` (JSDOM hygiene) |
| `fromDrawSVG` | PATH B — no live-session scene | `test/draw-svg.test.ts` + `proof:drawsvg` (JSDOM hygiene) |

Recorded in `docs/published-surface.md` §EP-3; machine-checked both ways by
`proof:published-surface` clause (g) (missing row / stale citation / missing disclosure
each red). The binding PATH A escape stays live: J.W7a (or any wave) landing a befitting
scene flips that row to PATH A and the scene auto-joins the S5 sweep via the roster.

---

## §PENDING-W7a register — DISCHARGED (the APPEARANCE-CERTIFICATION band LANDED in phase 2; see §Phase-2)

Phase 2 of this wave landed on the suffused tree (J.W7a HAS merged here — see §Phase-2
below). The four register items are all DISCHARGED; the runtime `PENDING-W7a` note formerly
emitted on every `proof:live-session-mobile` run is REPLACED by the band-GREEN note (the
register is no longer a pending claim at the gate):

1. **S1-appearance — mobile hero/subject overlap == 0** on 390×844 (the H3/A-01 cure
   certification; `pane-home.md` H3, `pane-amiga.md` A-01). → **DISCHARGED:** leg **A1**
   (`proof:live-session-mobile`) + clause **(c)** (`proof:appearance-suffusion`); overlap == 0
   measured (hero y 130–232, cube y 430–721, no intersection). Born-RED: ledger **PA-c/A1**.
2. **S1-appearance — the subject keeps protagonist visibility above the open sheet**
   (the A-01 half — the device-INDEPENDENT `sheet.bottom ≤ menubar.top` geometry half landed
   in phase 1). → **DISCHARGED:** the overlap==0 fact (A1/(c)) is the protagonist-visibility
   half on the suffused tree; the geometry half (CH-3, S7) was already hard-gating from phase 1.
3. **S3 — the DARK leg, whole** (`colorScheme: dark` token-resolution + the
   `--ball-tone`/accent computed-contrast ≥ floor clause). → **DISCHARGED:** leg **A2**
   (`proof:live-session-mobile`, a `390×844 + colorScheme:dark` context): `html.dark` LIVE,
   `--ball-tone` resolves the suffused violet `#e64de6`, ball + `.readout-accent` both contrast
   **5.98 ≥ 3.0** floor. Born-RED: ledger **PA-A2**.
4. **S5-appearance — ghost-rail-absent on the home sweep** (J.W7a XH-1). → **DISCHARGED:**
   leg **A3** (`proof:live-session-mobile`) + clause **(e)** (`proof:appearance-suffusion`):
   `.controls-layout--railless` present + `[rail]` track 0px + no hollow side column.
   Born-RED: ledger **PA-e/A3**.

**BINDING re-pin clause (DISCHARGED — re-pinned where it bit).** Two seams moved off the
spec-named locus and were RE-PINNED + RE-WITNESSED at IMPL: (i) the A-01 cure landed via the
phase-1 `--menubar-measured-h` measured-anchor seam (the geometry half), and the
sphere-visibility half on the suffused tree is the overlap==0 fact A1/(c) certifies; (ii) the
storyboard reel play affordance was RENAMED by W7a's XH-2 register convergence
(`aria-label "Play the reel — a cascading wave replay"`, `SequenceTarget.vue:50`) — the S5
sweep's sequence-transport click was RE-PINNED to the new label and the click failure is now
SURFACED as a `sceneFail` (not a silent `.catch`), so a future rename reds at the click locus.
(Phase 1's own witnesses stay SELF-CONTAINED — P1–P4 red on the tree regardless of any
sibling-cure seam.)

---

## §Source-scope note (the one deviation, justified + gated)

The spec scopes W4 "gates + CI; NO source" — but the new CH-3 mobile oracle BIT ON A
LIVE DEFECT (the menubar painting 32–38px over the open sheet's bottom control row at
390×844: the always-expanded TransportDock host ~90px vs the token-derived ~52px
reserve). A leg cannot be admitted GREEN at budget 0 over a live defect, and the cure is
the I deferred-ledger CH-3 row's OWN prescription ("derive sheet anchor from MEASURED
menubar height"). So: `TransportDock.vue` (+45: the `--menubar-measured-h`
ResizeObserver publisher) + `style.css` (the `max(token-floor, measured)` fold into
`--dock-band-reserve`; cycle-free — the measured height is content-driven, never a
function of the reserve it feeds). Non-regression verified: `proof:occlusion` (desktop
{375,1280,1440}) PASS, `proof:mobile-single-page` PASS (detents ≤70dvh hold under the
max()), `proof:sheet-reopen-scroll` PASS, `proof:scene-control-dfa` PASS.

---

## §Verification matrix (the landed tree, 2026-06-11)

| Gate / check | Result |
|---|---|
| `proof:live-session` (full battery + S5/S2/S4, `KF_DEV_SERVER=1`) | PASS · budget 0 |
| `proof:live-session-mobile` (NEW — S1/S7) | PASS · 11/11 · budget 0 |
| `proof:ci-coverage` | PASS · 112 gates · `lighthouse-mobile` left the EXCLUDED set · posture-manifest 4 observe-only rows two-way |
| `proof:gate-is-runtime` | PASS · `live-session-mobile` classified RUNTIME/INTERACTION (touch actuation primitives) |
| `proof:chronic-closure` | PASS · CH-3 cites `proof:live-session-mobile` |
| `proof:published-surface` (incl. NEW clause (g)) | PASS |
| `proof:lighthouse-mobile` under `CI=true` | exit 0 · 6 misses RECORDED observe-only (the declared posture, end-to-end) |
| `proof:occlusion` / `proof:mobile-single-page` / `proof:sheet-reopen-scroll` / `proof:scene-control-dfa` | PASS (cure non-regression) |
| `vitest run` | 77 files · 751 passed + 3 expected-fail · 0 failures |
| Born-RED plants P1–P4 | each REDS its leg on the planted dist · byte-restore shasum-verified · green on pristine bytes |

---

## §Residuals (labeled, non-blocking)

- **R1 — phase 2 (the appearance band) LANDED** (J.W7a merged on this tree); the
  §PENDING-W7a register above is DISCHARGED. See §Phase-2 for the record + the PA-* plant
  ledger. (No residual — the band is GREEN.)
- **R2 — the S5 spring-churn oracle is broad across painters** (the two absorbed P4
  attempts): a single-painter kill (rail painter only / scrub-seam only) is masked by the
  sibling painters + the reactive target-marker. The leg still bites every throwing or
  scene-dead regression (the budget + entry predicates) and the play-time-throw class
  (P4); a per-painter liveness clause is a measure-first follow-up ONLY if a real
  frozen-solver-with-live-marker regression ever surfaces (KISS — no speculative
  oracle).
- **R3 — the local lighthouse-mobile ceilings** were not hard-asserted on this
  uncalibrated sandbox (the exact quantity P6 forbids over-reading); the calibrated
  `KF_REQUIRE_LH=1` run remains the on-device authority.
- **R4 — the N×N switch matrix** stays the spec's recorded measure-first follow-up; the
  covering walk (every scene a switch source AND destination once, wrap-to-home) is the
  landed KISS form.

---

# §Phase-2 — THE APPEARANCE-CERTIFICATION band (LANDED on the suffused W7a tree, 2026-06-11)

**Status:** PHASE-2 LANDED · the three former §PENDING-W7a mobile legs (A1/A2/A3) wired into
`proof:live-session-mobile` and GREEN · the W7a §Hard gate's `proof:appearance-suffusion`
(clauses (a)–(g)) — the W7a close flagged it **NOT YET AUTHORED**; phase-2 AUTHORS it — GREEN,
tiered into `proof:correctness` + ci.yml demo-smoke, classified RUNTIME/INTERACTION ·
`proof:ci-coverage` GREEN · `proof:gate-is-runtime` GREEN (the new gate recognized) · every
phase-2 clause **born-RED witnessed on a PLANTED dist defect** (mutate built dist → leg reds →
byte-restore shasum-verified → green; the PA-* ledger below) · branch `j-impl-w4` on the
suffused tree (W7a D1–D23 + glass-ui 3.11.2 merged) · impl date 2026-06-11.

## §Phase-2 per-leg dispositions

- **`proof:appearance-suffusion` (the W7a §Hard gate, AUTHORED): LANDED + GREEN.**
  `scripts/proof-appearance-suffusion.mjs` (580 lines) over J.W3's `withPage()` + J.W0's
  `navToScene` against the BUILT `dist/gh-pages/`. Clauses (a)–(g) each read a COMPUTED
  product-facing appearance property on the LIVE page (never a source-shape grep):
  - **(a) `--ball-tone` == icon hue per scene** — easing → `--rainbow-violet` (`#e64de6`,
    bg `rgb(230,77,230)`, NOT the default green); motion-path traveller → `--rainbow-cyan`
    (`#1ae6e6`, bg `rgb(26,230,230)`); spring `.spring-ball` → `--color-progress` (`#21c45d`,
    the declared green bind); square box bg == `--subject-teal` (`#52e898`) AND the raw
    `aquamarine` literal (`rgb(127,255,212)`) DEAD (SQ-5). The hue map BITES per scene
    (tone == icon hue AND != default green). Born-RED: ledger **PA-a**.
  - **(b) the display register resolves Instrument Serif at the named moments** — the four
    `*Target.vue` titles (ease / SpringProgress / Sequence / MotionPath) compute
    `font-family: "Instrument Serif"…` AND `document.fonts.check`; the **amiga stage carries
    NO display title** (the binding headerless exception ENFORCED — a planted title reds it).
    Born-RED: ledger **PA-b**.
  - **(c) the 390×844 hero/subject overlap == 0** (a SEPARATE `390×844 + hasTouch` context) —
    hero `h1` rect ∩ cube-subject rect AREA == 0 (the H3/TYP-1/A-01 cure). Born-RED: ledger **PA-c**.
  - **(d) the easing projected curve PRESENT + MUTATING on a real handle drag** —
    `.easing-stage-curve-path` has a non-empty `d` (461 chars), distinct from the sidebar
    `.bezier-path`; a REAL mouse drag of `circle[data-index=0]` MUTATES the stage `d` in
    lockstep (the ball traverses its OWN live curve, not a flat rail — a static stub still REDs).
    Born-RED: ledger **PA-d**.
  - **(e) the ghost rail ABSENT** — on sequence + motion-path (empty-DFA) the `[rail]` track
    computes 0px AND `.controls-layout--railless` is present AND the wrapper measures 0 (no
    hollow 400px card over the void, XH-1). Born-RED: ledger **PA-e**.
  - **(f) the amiga rounded-glass computed style** — `.amiga-canvas` computes
    `border-radius 16px == --radius-card`, != 0 (XH-3, the slab joined the rounded-glass
    register). Born-RED: ledger **PA-f**.
  - **(g) the substrate-depth legibility (W6-3 DISCHARGED)** — the `.grid-background`
    two-tier engineering graph paper is PRESENT (FOUR gradient layers, bgSize
    `"80px 80px, 80px 80px, 16px 16px, 16px 16px"`) AND `--graph-major-opacity 12% >` the
    former 0.10α/10% floor (the glass has structure to refract — the I.W6 S3 item finally
    gated, never deferred again). Born-RED: ledger **PA-g**.
  - **(h) — by reference, NOT re-stated.** A green `proof:live-session` on the post-W7a tree
    IS clause (h) (the budget-0 regression gate, the structured allowlist inherited BY
    REFERENCE); this gate carries (a)–(g), the per-finding computed oracles. Emitted as a
    `·` note in the gate, not a re-implemented budget walk.
- **A1 / A2 / A3 — the three former §PENDING-W7a mobile legs: LANDED + GREEN** in
  `proof:live-session-mobile` (the `runAppearanceBand()` block, +253 lines), each on its OWN
  mobile context over the SAME J.W3 harness, each a DEVICE-INDEPENDENT computed fact that
  HARD-gates per P6, each run AFTER the input-modality battery (so phase-1's budget-0 battery
  is untouched):
  - **A1 — 390×844 hero/subject overlap == 0** (the H3/A-01 cure certification): hero h1
    (y 130–232) ∩ cube subject (y 430–721) == 0. Born-RED: ledger **PA-A1** (shared plant
    with PA-c). DISCHARGES §PENDING-W7a items 1+2.
  - **A2 — DARK `--ball-tone`/accent computed-contrast ≥ floor** (a `390×844 + colorScheme:dark`
    context): `html.dark` LIVE (backdrop `rgb(17,15,14)`), `--ball-tone` resolves the suffused
    violet `#e64de6`; the violet ball AND `.readout-accent` both contrast **5.98 ≥ the 3.0
    legibility floor** (the WCAG luminance ratio, device-INDEPENDENT — the floor bites only a
    real regression; the violet computes well clear). DISCHARGES §PENDING-W7a item 3. Born-RED:
    ledger **PA-A2**.
  - **A3 — ghost-rail-absent on the home sweep** (XH-1): home + sequence carry
    `.controls-layout--railless` AND no hollow rail-WIDTH side column (on mobile the wrapper is
    the full-width bottom sheet `390×64`, never a wide-tall empty 400px side column).
    DISCHARGES §PENDING-W7a item 4. Born-RED: ledger **PA-A3** (shared root with PA-e).
- **Tiering + wiring.** `package.json` gains `"proof:appearance-suffusion"` and appends it to
  the `proof:correctness` roster (after `proof:live-session-mobile`); `.github/workflows/ci.yml`
  gains the `[CORRECTNESS] proof:appearance-suffusion` demo-smoke step (`KF_REQUIRE_BROWSER=1`,
  with the gh-pages-consuming gates, ABOVE the dist-wiping `build:lib` tail) and the
  `proof:live-session-mobile` step name extends with the appearance band (A1/A2/A3). `proof:ci-coverage`
  PASS (the new gate SEEN, no orphan), `proof:gate-is-runtime` PASS (the gate classifies
  RUNTIME/INTERACTION — the clause (d) handle drag is the strong actuation).

## §Phase-2 born-RED plant ledger (VERBATIM — mutate built dist → leg reds → byte-restore shasum-verified → green)

Witness baselines captured pre-plant (`/tmp/kf-j-w4-ph2-witness/baseline.sha256`, the five
touched dist files):

```
7c955ed1b62c0f6710c832d9da28aab94f30a8c11f4ede5ece0993b2a667117b  dist/gh-pages/assets/index-VvHFy6nd.css
2cd8583011fb38f1a95c237eb7b700b7d29c455405b2644cd130307981221985  dist/gh-pages/assets/index-D8HUhZks.js
3d85227bb017c273e751eef69fb03bf95b10c069ed6a000f0fd355cdce7dffab  dist/gh-pages/assets/EasingScene-CT4Z6D8m.css
b79c432d7bd365b8264d73fe24a3b83752194ba55ad458872542421b8bada564  dist/gh-pages/assets/AmigaScene-UMpqW2si.css
f7c425808d78143dbff9467262081aa684d4a0b7734b9f834e50e5b609d6b722  dist/gh-pages/assets/EasingScene-xAon08xA.js
```

After EVERY plant: byte-restore from backup → `shasum -a 256 -c …/baseline.sha256` → all five
**OK** → re-run GREEN on the verified-pristine bytes. Each plant reds EXACTLY its named clause;
every other clause stays green (the discrimination is recorded per row).

| Plant | Clause(s) | Mutation (built dist, length-preserving where noted) | RED signature (the named-defect fingerprint) |
|---|---|---|---|
| **PA-a** | (a) easing hue | `EasingScene-CT4Z6D8m.css`: `--ball-tone:var(--rainbow-violet)` → `--ball-tone:var(--color-progress)` (the WRONG/default-green token; length-preserving, both 14 chars — the spec's per-scene wrong-token witness) | `✗ (a) easing --ball-tone is NOT the icon's violet (tone=#21c45d, expected #e64de6; bg=rgb(33,196,93))` — ONLY (a)-easing reds; the cyan/green/teal rows green (the hue map BITES per scene) |
| **PA-b** | (b) display register | `index-VvHFy6nd.css`: `.text-display{font-family:var(--font-display);…}` → `…system-ui,sans-serif;…}` (the display register reverts to native sans — the pre-suffusion `text-heading` voice) | `✗ (b) easing/spring/sequence/motion-path title … did NOT resolve Instrument Serif (font=system-ui, sans-serif)` ×4; **the amiga-headerless clause stays GREEN** (it carries no title — discriminating) |
| **PA-c / PA-A1** | (c) + A1 mobile overlap | `index-VvHFy6nd.css` (append): `.hero-display{transform:translateY(360px)!important}` (the mobile hero word forced down into the cube region — the H3/A-01 overlap restored) | `✗ (c) 390×844 hero/subject overlap is NOT 0 … overlapArea=21686px² (hero y490–592, cube y430–721)` AND the mobile `✗ A1 … overlap=21686px²`; A2/A3 stay green |
| **PA-d** | (d) projected curve | `EasingScene-xAon08xA.js`: `d:u(t).svgPath.value` → `d:\`M0,100 L300,0\`` (the projected stage `d` STUBBED to a static literal, non-`svgPath`-bound) | `✗ (d) the handle drag did NOT mutate the projected curve in lockstep (stageMoved=false, sidebarMoved=true)` — the no-op static projection REDs (presence alone is not enough) |
| **PA-e / PA-A3** | (e) + A3 ghost rail | `index-D8HUhZks.js`: the railless DOM-class application `e.hasControlSurfaces?\`\`:\`controls-layout--railless\`` → `…\`controls-layout--XXXXXXXX\`` (the empty-DFA railless arm renamed at its apply site; length-preserving) | `✗ (e) sequence/motion-path: the ghost rail did NOT collapse (railless=false)` ×2 AND the mobile `✗ A3 … railless=false`; A1/A2 stay green |
| **PA-f** | (f) amiga rounded | `AmigaScene-UMpqW2si.css`: `.amiga-canvas[…]{` → `…{border-radius:0!important;…}` (the rounded-card register reverted — the slab is an unrounded gray rectangle) | `✗ (f) the amiga .amiga-canvas border-radius is NOT --radius-card (radius=0px, expected ≈16px)` — ONLY (f) reds |
| **PA-g** | (g) substrate depth | `index-VvHFy6nd.css`: `--graph-major-opacity:12%` → `--graph-major-opacity:08%` (below the former 0.10α/10% floor; length-preserving) | `✗ (g) the substrate is NOT legible two-tier graph paper (gradLayers=4, majorOpacity=8%, floor=10%)` — the major layer drops below legibility (W6-3 not discharged); ONLY (g) reds |
| **PA-A2** | A2 dark contrast | `index-VvHFy6nd.css`: `.readout-accent{color:var(--ball-tone,var(--color-progress))}` → `.readout-accent{color:#22201e}` (a hardcoded near-dark literal opaque to `.dark` — the S3 H5/H11 raw-literal class) | mobile `✗ A2 … contrast below floor (accentContrast=1.18, floor=3; backdrop=rgb(17,15,14))` — the dark-only contrast break the desktop-light tier cannot see; A1/A3 stay green |

**One ABSORBED plant attempt (recorded honestly — witness-strength finding).** A3's first plant
RENAMED the CSS rule `.controls-layout--railless{--rail-track:0px}` → `…--XXXXXXXX{…}` — the
sweep STAYED GREEN: the A3 `railless` check is a DOM-class query (the class is still on the
element, set by the template), and on mobile the wrapper is the full-width bottom sheet so no
wide-tall ghost column appears even without the CSS collapse. The witness was RE-PINNED to the
spec's actual locus — the railless DOM-class APPLICATION in `index-D8HUhZks.js` (`hasControlSurfaces`
branch, PA-e/PA-A3) — which reds both the mobile A3 and the desktop clause (e). KISS: the plant
targets where the class is BORN, not where it is merely styled.

**The closing green (verified-pristine bytes).** After the last restore,
`shasum -a 256 -c /tmp/kf-j-w4-ph2-witness/baseline.sha256` → all five OK, then on the IDENTICAL
bytes: `proof:appearance-suffusion` exit 0 (clauses (a)–(g) + (c) all ✓); `proof:live-session-mobile`
exit 0 (11/11 input-modality + A1/A2/A3 ✓, budget 0); `proof:ci-coverage` exit 0;
`proof:gate-is-runtime` exit 0.

## §Phase-2 source-scope note (the one deviation, justified + gated)

The wave is scoped "gates + CI; NO source" — but phase 2 carries ONE source deviation in
`EditorStartScreen.vue` (+22 lines): the `FourierField` decorative generative canvas is gated
`v-if="!prefersReducedMotion"` (via `usePreferredReducedMotion` from `@vueuse/core`). TWO reasons
converge: (1) **PRODUCT** — a reduced-motion user should not get a generative epicycle animation
in the calm field (the field already inherits the reduced-motion freeze, so gating its mount
loses nothing for those users while honoring their stated preference); (2) **HANDOFF** — the
upstream `FourierField`/`useCanvas2D` substrate (glass-ui 3.11.2) crashes with a TDZ
`ReferenceError` when it paints its first static frame synchronously under reduced motion (the
render closure reads the not-yet-bound `useCanvas2D` handle) — a recorded glass-ui HANDOFF defect;
not mounting under PRM sidesteps it AND is the correct reduced-motion behavior regardless of the
upstream bug. The `aria-hidden` field is purely decorative, so its absence under PRM is a no-op
for assistive tech. (Phase 1 carried its own one source deviation — the CH-3 `--menubar-measured-h`
measured-anchor cure; both are the cure of a live defect a budget-0 leg could not be admitted GREEN
over, not a scope-creep feature.)

## §Phase-2 harness note (the launch-flake closed-guard — no escape)

`scripts/lib/demo-driver.mjs` `withBrowser()` gains a BOUNDED retry (≤3 attempts, short backoff)
around the chromium LAUNCH + browser-CRASH class ONLY (`Target closed` / `browser disconnected`
/ `GPU process` / `Network service` / `Protocol error`). A failure thrown from inside `fn` (a
real assertion / a red) is NEVER retried — it rethrows immediately, so the gate's BITE is fully
preserved (every PA-* plant above redded on the FIRST attempt; the retry only catches a chromium
process the shared host killed under the gate). This is NOT a `continue-on-error` and NOT a
settleMs bump — it is the W3 single-source launch seam made robust to a contended-host transient,
the secondary M4-play flake the report named.

## §Phase-2 verification matrix (the suffused tree, 2026-06-11)

| Gate / check | Result |
|---|---|
| `proof:appearance-suffusion` (NEW — W7a §Hard gate (a)–(g)) | PASS · every per-finding computed oracle green |
| `proof:live-session-mobile` (+ A1/A2/A3 appearance band) | PASS · 11/11 input-modality + A1/A2/A3 · budget 0 |
| `proof:ci-coverage` | PASS · `proof:appearance-suffusion` SEEN (no orphan) |
| `proof:gate-is-runtime` | PASS · `proof:appearance-suffusion` classified RUNTIME/INTERACTION (correctness tier) |
| Born-RED plants PA-a … PA-g + PA-A1/A2/A3 | each REDS its named clause on the planted dist · byte-restore shasum-verified (5/5 OK) · green on pristine bytes |
| One ABSORBED A3 plant | recorded honestly; witness re-pinned to the DOM-class apply site (PA-e/A3) |

## §Phase-2 residuals (labeled, non-blocking)

- **R5 — the A2 contrast floor is 3.0** (the WCAG large-graphic/UI-accent component floor); the
  suffused violet computes 5.98, well clear, so the floor bites only a real dark-token regression
  (not a hair-trigger). A stricter text-grade 4.5 floor is NOT used because `--ball-tone` paints a
  graphic accent (the ball / the accent readout), not body text — the device-INDEPENDENT floor
  matches the surface class (KISS — no over-tight threshold).
- **R6 — the FourierField TDZ-under-PRM crash is a glass-ui HANDOFF** (recorded in the
  EditorStartScreen source note); the kf-side PRM mount-gate is the correct product behavior AND
  sidesteps the upstream bug. The durable fix is a glass-ui edge (the render closure binding the
  `useCanvas2D` handle before the first synchronous static-frame paint), booked to the glass-ui
  repo, not patched in the demo.
