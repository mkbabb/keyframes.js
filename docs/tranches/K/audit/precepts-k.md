# Tranche K · audit/precepts-k.md — THE PRECEPT REGISTER J→K

**Lane:** precepts-k. **Method (inv ε):** every row cites a `file:line`, a re-runnable command +
observed output, or a run id. Verified against the tree at `4f1fc4c` (branch `tranche-j-dev` == master,
clean). Read-only — this lane writes ONE audit doc and touches no source, tests, gates, or CI.
**Purpose:** (1) record which J-inherited precepts HELD through J impl; (2) name where they STRAINED
and why; (3) carry the J-born invariants forward with their correct form; (4) surface new tensions K
must resolve before any wave.

---

## §0 — THE STRUCTURAL SPINE (carried A→J, verified in the tree)

These five precepts form the project's foundational identity. Each is policed by a gate or by the
audit discipline itself. All five HELD through every J wave.

| # | Precept | Origin | Gate | J status |
|---|---|---|---|---|
| P1 | **no-legacy** | A/FINAL, recurring | `proof:no-deprecated-guard` (hygiene) | HELD: `grep -rniE "deprecat\|legacy\|workaround\|hack\|FIXME\|TODO\(" src/ | grep -v mandate` → **0**. The T5 memory-rule narrowing was REPLACED in one motion (no stale rule beside its replacement, `J.W7c S7`). |
| P6 | **inv α — boundary gated, not asserted** | A/FINAL:94 | `proof:boundary` (hygiene) + `proof:published-surface` | HELD: light modules carry 0 static `value.js` edge; `proof:published-surface` born-RED on the pre-fix tree — 15 findings, GREEN on the fixed tree (`J.W5-impl.md §Born-RED excerpt`). |
| P7 | **inv β — library is glass-ui-free** | A/FINAL:107 | `package.json` dep layout | HELD: `package.json` library deps = `{parse-that, value.js}` only; glass-ui `~3.11.2` in `optionalDependencies` demo block (`:182`). |
| P11 | **inv ζ — dogfood** | C/FINAL:77 | `proof:dogfood` (hygiene; allowlist) | HELD: 3 raw `requestAnimationFrame` sites, all allowlist-gated. |
| P13 | **inv-16 — consume published siblings, don't fork** | H/FINAL:89; un-fenced for engine I/PATH-FORWARD:124 | `proof:deps-current` / lockfile | HELD: glass-ui `~3.11.2` lock resolves `3.11.2` from `registry.npmjs.org`; value.js `^0.11.2` from registry; zero `file:` siblings. The W7c glass-ui gaps booked RF-16/RF-17 in `glassui-AX-handoff.md`, NOT patched in kf. |

---

## §1 — THE J-BORN INVARIANTS (the tranche's headline install, carried forward with their correct form)

### P14 — The gate-ORACLE precept (I-born, J-verified, mechanically enforced for the correctness tier)

**Origin:** `I/recap-precepts.md:301-305`; `I/FINAL.md:15`; `J/audit/gate-census.md GC-3/GC-4`.
**Exact statement:** *"A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised
through the SAME surface the human uses, error budget 0 across PLAY+SWITCH+DRAG; source/jsdom/snapshot/
self-baseline/token/ledger = HYGIENE, may never count toward correctness."*

**J status — HELD with one structural narrowing exposed.** `proof:gate-is-runtime` (hygiene) polices
that every correctness gate is a browser-actuating runtime gate (`scripts/proof-gate-is-runtime.mjs:84-93`).
**The narrowing:** the meta-gate audits a hardcoded `WAVE_HARD_GATES` list (9 gates), NOT a derived
`proof:correctness` membership; `proof:demo-fonts` is in the correctness tier but the meta-gate omits
it (`J/audit/gate-census.md GC-3`). Furthermore, `proof:demo-fonts` is a load-rest gate (no actuation;
`grep page.click|mouse|dispatchEvent|press|hover` → empty, `proof-demo-fonts.mjs:68-72`), sitting in
the correctness tier without actuation coverage (`gate-census.md GC-4`). **These are carry-forwards,
explicitly named, not re-opened as J findings — they appear in the J fold list and are K.W0 starters.**

**K form:** the meta-gate derives its set from `proof:correctness` membership (not authored literal);
`proof:demo-fonts` is tier-decided before K.W0 closes (upgrade to actuate, or re-tier to
"appearance-at-rest" alongside `proof:visual-lock`, or absorb into `proof:live-session`'s scene-sweep
leg S5). Neither outcome leaves a load-rest gate in the correctness tier without the meta-gate
auditing it.

---

### P14b — The AXES completeness corollary (J-born, J.W4 ground truth)

**Origin:** `J/FINAL.md §6`; `J/audit/final-vs-tree-inv-epsilon.md §B P0-2`.
**Exact statement:** *"A breadth claim is only as true as its un-exercised axes; the un-exercised axis
is where the next lie lives."* The I FINAL's "live-session GREEN means a human sees it work" was
desktop-1440-mouse-light-only; J.W4 planted born-RED defects on mobile/touch/reduced-motion/dark/
keyboard and built `proof:live-session-mobile` + `proof:appearance-suffusion`.

**J status — HELD for the axes J.W4 exercised.** The un-exercised axis it names — **the hero COLD
PATH** — is NOT covered by any correctness gate. The proof:live-session B1 leg (`:388-412`) opens on
the HOME route, clicks the rainbow play on an empty group (the E1 repro), waits 1.2 s, then switches
the route DIRECTLY via `location.hash = "#/cube"` — bypassing the `onPlayStateChange → autoPlayNext →
getRunSceneSwitch()("cube")` navigation chain that the real user's click fires
(`demo/app/useSceneMachineApp.ts:155-165`). The gate exercises the home empty-group play and the cube
draw loop, but NOT the smooth transition from home to cube-animating via the hero CTA — the orchestrator
triage confirms this: U-K2/U-K3 report the rainbow play does NOT smoothly transition to the cube
animating (subjects freeze while the playhead/slider advances). This is the J.W4-precept's own
blindspot recurrence, one surface inward: an un-exercised-axis gate that looks green.

**K form:** a correctness gate leg that opens the demo at the HOME route with a cold store, clicks the
hero rainbow play through the `onPlayStateChange` chain, and asserts (a) the route has reached `#/cube`,
(b) the cube subject is emitting distinct transforms within 2 s, (c) no visible "freeze while slider
advances" state. Born-RED on the J.W7c U4 conditional-select deletion (which removed the prior
`onSelectAnimation` side-effect that auto-bound the selection).

---

### P15 — Two-tier taxonomy (correctness / hygiene)

**Origin:** `I/FINAL.md:77-89`; enforced at `proof:correctness` + `proof:hygiene`.
**J status — STRUCTURALLY SOUND, CI seam still bypasses it.** CI runs all ~109 gates flat
(`grep -cE "npm run proof:" .github/workflows/ci.yml` → 103+ individual invocations); the two-tier
aggregators are NOT invoked as the CI contract (`J/audit/precepts.md §F4`). The correctness-tier
purity is honest (10 actuating runtime gates; `proof:gate-is-runtime` machines this); the hygiene
tier's honesty is not machine-enforced from the CI side. **K carry:** either run
`proof:correctness && proof:hygiene` as the CI contract (so the tier boundary IS the deploy signal)
or formally record the flat run as deliberate with the structural guarantee explicitly waived.

---

### P16 — P-invariant-28: no perpetual punts

**Origin:** `D/FINAL.md:177`; `I/FINAL.md:183-208`; mechanized at `proof:chronic-closure`.
**J status — HELD.** Every ≥4-tranche rider exited J via a measurement artifact or a reasoned KILL
(`J/FINAL.md §7`). The `proof:chronic-closure` substrate was re-pointed to the J ledger in the close
motion; the gate bites on the new substrate (non-vacuous swap). The clean-ledger GREEN is the named
carry (`J/FINAL.md §9`, the in-flight ledger-grooming step) — the I substrate's GREEN remains the
standing oracle until the grooming lands (`scripts/proof-chronic-closure.mjs:109 CHRONIC_LEDGER`).
**K carry:** the substrate grooming must land as K.W0's first motion so the K ledger is the
authoritative parse target before any chronic is opened or closed in K.

---

### P17 — Born-RED discipline

**Origin:** `A/FINAL.md:129`; `I/PATH-FORWARD.md:4-6`.
**J status — HELD across all 10 waves.** Every J gate cited its born-RED witness:
`J.W3-impl.md §1` bite-preservation 9/9 sampled gates RED-on-plant → GREEN-on-restore;
`J.W4-impl.md` each leg born-RED on a PLANTED dist defect (byte-restore shasum-verified);
`J.W5-impl.md §Born-RED excerpt` 15 findings on the pre-fix tree.
**The episode:** the P0 subject-write regression proved born-RED discipline applies to the
SUBJECT ORACLE as much as the structural gates. The cure `a2c3a5b` planted `proof:subject-animates`
born-RED on the regression — the precept's own thesis turned inward (`J/FINAL.md §4`).
**K form:** every new K gate MUST carry a born-RED witness for the exact defect its oracle is written
to catch. A gate whose oracle was never red in the tree it was born into is suspect until the born-RED
witness is on the record.

---

### P18 — Dev/impl boundary

**Origin:** `I/PATH-FORWARD.md:4-6`.
**J status — HELD.** This lane (precepts-k) writes one doc, no source, tests, gates, or CI touched.
**K form unchanged:** the dev phase ends when the tranche's charter (K.md) is authorized; until then,
every audit lane is read-only. This is NOT a gateable precept — it is the PROCESS boundary, and it
is the lane's own contract.

---

### P20 — Version-owner / user-domain publish

**Origin:** `I/FINAL.md:235`; MEMORY deploy notes.
**J status — RESOLVED.** The honest minor `4.1.0 → 4.2.0` was cut + published via the tag-triggered
`release.yml` first-ever run (run `27378331075`; `npm view @mkbabb/keyframes.js version` → `4.2.0`,
verified 2026-06-11). The `release.yml`-gates-on-correctness decision (re-runs `proof:boundary` only,
not the full `proof:correctness` suite) is a RECORDED USER-DOMAIN call (`J/FINAL.md §5`).
**K carry:** the open question is whether `release.yml` SHOULD also gate on `proof:correctness`.
This is a USER-DOMAIN decision, not a silent gap; K.W0 should resolve it (add or formally record the
decision to keep it `proof:boundary`-only).

---

### P21 — glass-ui-fixes-in-glass-ui

**Origin:** MEMORY `feedback_glass_ui_root_changes.md`; `I/FINAL.md:223`.
**J status — HELD.** The W7c pointerdown actuation cure (`TransportDock.vue:277-318`) and the
`:freeze="prefersReducedMotion"` guard (`EditorStartScreen.vue:84`) are CONSUMER-SIDE uses of
published APIs — not glass-ui patches. RF-16 (PRM RO→render TDZ) and RF-17 (dock collapse-crossfade
strand) are BOOKED in `glassui-AX-handoff.md`, never patched in kf.
**K carry:** glass-ui latest is `3.13.0` (`npm view @mkbabb/glass-ui version` verified 2026-06-11);
kf pins `~3.11.2` (`package.json:182`). The 2-minor-version gap must be closed in K — the
`~3.11.2` tilde permits `3.11.x` only; `3.12.x` and `3.13.0` are EXCLUDED. A re-pin to `~3.13.0`
is the named K motion; each consumed item in `glassui-AX-handoff.md` set (ii) must be re-verified
against the changelog before the re-pin lands.

---

## §2 — WHERE THE J PRECEPTS STRAINED

### S1 — The felt-timing P6 episode (the on-device / CI asymmetry)

**What happened:** `proof:perf-frame-budget` is a correctness-class oracle (it gates real user-visible
frame drops) but its throttled-frame-budget clauses are OBSERVE-ONLY in CI
(`scripts/proof-perf-frame-budget.mjs:63-64`; `scripts/lib/ci-env.mjs` `declarePosture("observe-only")`).
This is the correct posture for a device-dependent measurement — the precept P6 is "made mechanical"
at `scripts/lib/ci-env.mjs:1-36`. The strain is that two chronics (CH-3, CH-4) CLOSE via
`proof:perf-frame-budget` (`J/audit/final-vs-tree-inv-epsilon.md §P1-4`), meaning CI can be green on
the closed chronic while the felt timing is untested in CI. The gate hard-gates only on-device.

**The lesson:** the P6 taxonomy (hard / observe-only / runner-calibrated) is the correct
engineering response to device-dependent gates — the posture is DECLARED, not silently ignored.
The strain is that "correctness" and "CI-green" are not synonymous for observe-only posture gates.
A P14 reader must know that "green in CI" means "structurally gated AND observe-only measurements
recorded" — not "the felt budget held." The chronic-closure gate should enforce that a chronic may
not cite an observe-only gate as its SOLE closure evidence without also citing a hard on-device
witness (e.g. a specific known-good run id or a born-RED probe on the observe-only path).

**K precept (new):** P6-WITNESS — *a chronic closure that cites an observe-only gate MUST also carry
a named on-device born-RED witness (a concrete run environment + measurement + defect-as-planted
probe). A CI-green observe-only gate without an on-device witness is NOT a complete chronic closure.*

---

### S2 — The verify-pass vs user-verdict gap (the appearance-axis blindspot)

**What happened:** the P0 subject-write regression (`J/FINAL.md §4`) occurred AFTER the full W7a
gate battery was green. The gates exercised PLAY + SWITCH + DRAG and measured error budgets, computed
`--ball-tone` hues, and DOM geometry — none carried an oracle asserting that the subject's transform
actually MUTATES across the play loop on every scene. The user drove the running product and found the
break. This is the exact failure shape `J/audit/feedback/gate-blindspot-appearance-axis.md` names:
"green source-shape gates miss appearance/interaction/state; audit the running demo; chronics exit
only via a system gate or born-RED handoff."

**The lesson:** gate-green is NOT taste-approval. A battery that measures structural properties (the
gate's oracle) may be entirely green while the product property a human would immediately check (the
subject is animating) is broken. The gap between "gate-green" and "human-readable working demo" is
the TASTE BOUNDARY — an axis no automated gate can close completely, only narrow.

**K precept (new):** P-TASTE — *"gate-green" certifies that the named oracles pass. It does NOT
certify that the running product looks or feels correct to a human. Every wave's close must include a
USER-DRIVE moment (the orchestrator or the owner driving the built dist end-to-end) before the wave
is declared closed. Gate coverage widens the P-TASTE surface; it does not replace it. A wave whose
gates are green but whose live demo has not been driven by a human is NOT closed.*

This precept names what the J FINAL called "the arbiter of last resort" (`J/FINAL.md §4`: "the user
driving the running product remains the arbiter of last resort"). K elevates this from an episode
lesson to a standing, named precept.

---

### S3 — The U4 conditional-select deletion and the cold-path auto-binding side-effect

**What happened:** J.W7c U4 deleted the lone-option dropdown and replaced it with a static label
(`TransportDock.vue:38-95`). The prior `<Select>` path called `emit('selectAnimation', String(key))`
on model-value-update, which would route to `onSelectAnimation` in `useAnimationGroupPlayback.ts:47-53`
— a function that both sets `storedControls.selectedAnimation` AND calls `animationGroup.play()` if
not started. The `v-else` static label has no trigger; the auto-select + auto-play side-effect of the
select model-update is no longer triggered on single-animation scenes. The cold path from hero →
rainbow-play → cube-animating relies on `useSceneMachineApp.ts:155-165` (`onPlayStateChange` → when
home and `isHomeEmptyGroup` → `autoPlayNext.value = true` → `getRunSceneSwitch()("cube")`), which
appears structurally intact. But the orchestrator's live audit confirms the subjects freeze: either
the `autoPlayNext` path is not completing cleanly, or the cold-store entry is missing the
`selectedAnimation` auto-bind (`useSceneMachineApp.ts:70-73` sets `controls.selectedAnimation` to
`names[0]` but only when `bindSceneAdapter` is called, which requires `isHome.value === false`).

**The lesson:** the U4 deletion was a correctness net-improvement for the multi-scene path (dead
chrome removed) but introduced a regression on the cold single-scene path by removing an implicit
side-effect that was never named in the gate oracle. This is the P-TASTE gap in precise form: the
gate `proof:live-session` was green (the B1 leg drives the home rainbow-play), but the COLD PATH
(fresh store, first visit, hero CTA → cube animating) was NOT gated. No born-RED test existed for
"hero rainbow-play causes cube to animate on a cold store."

**K precept enforcement:** the cold-path leg is the first CONCRETE application of P14b (the AXES
completeness corollary). K.W0 must add a correctness gate leg that opens the demo with an
empty/cleared store, clicks the hero CTA through the real event chain (not a direct hash push), and
asserts the cube is animating within 2 s.

---

## §3 — THE J-BORN TENSIONS K'S CHARTER MUST RESOLVE (not inherit)

### T1 — KISS vs the gate corpus

**I position:** `proof:live-session` + a thin hygiene set (collapse the lattice). **Tree reality:**
`proof:` keys in `package.json` = 109 (GC-2 resolved three CI-only gates into `proof:hygiene`;
`J.W3-impl.md §1`); 93 proof scripts on disk (`ls scripts/proof-*.mjs | wc -l`). The collapse was
authority-only (10 correctness gates honest); the inventory grew.

**K must decide:** (a) actually delete the relabeled proxy lattice (honor the collapse — reduce the
hygiene corpus by retiring stale gates and merging overlapping ones, net-deletion on the script
estate), OR (b) formally own the 109-gate corpus as deliberate and KILL the "collapse the lattice"
language from all planning docs. Inheriting both is the I/H overclaim shape.

### T2 — The engine un-fencing (permanent or I-scoped)

**I position:** `src/animation` is the kf PRODUCT — runtime correctness MAY require engine
transposition (`I/PATH-FORWARD.md:124`). **J status:** T2 RESOLVED in the J FINAL (`J/FINAL.md §2`
— the T2 resolution is recorded as permanent). *"The engine carries forward the I un-fencing (the
PERMANENT engine rule): `src/animation` is the kf PRODUCT, in scope whenever runtime correctness or
measured elegance requires; the fence is against SIBLING forks only."*

**K carry:** T2 is RESOLVED — no re-litigation. The K charter states the engine is in scope; the
fence remains "consume published siblings, don't fork" for `glass-ui` / `value.js` / `parse-that`.

### T3 — The meta-gate one-directionality (P14 symmetry incomplete)

`proof:gate-is-runtime` enforces "correctness gates are runtime." Nothing enforces "runtime-shaped
gates are IN correctness." A behavioral gate authored into hygiene by mistake is silently demoted
with no machine catch. `proof:demo-fonts` demonstrates this exact failure live: it is correctness-tier
but load-rest, and the meta-gate doesn't audit it (`gate-census.md GC-3+GC-4`).

**K must:** derive `WAVE_HARD_GATES` from `proof:correctness` membership (`scripts/proof-gate-is-runtime.mjs:84-93`);
then `proof:demo-fonts` will red the meta-gate (no actuation) and force the tier decision. This is
a S-effort K.W0 item with a clear born-RED witness.

### T4 — The glass-ui currency gap (kf pins ~3.11.2, registry is 3.13.0)

`npm view @mkbabb/glass-ui version` → `3.13.0` (verified 2026-06-11). The kf `~3.11.2` tilde
restricts to `3.11.x`. The U-K14 user mandate requires upgrading to LATEST glass-ui (sliders etc.).
The glassui-AX-handoff.md set (ii) BOOK edges (RF-16/RF-17, `MetricHeader`, `GraphFrame`, et al.)
target future glass-ui versions; some may have landed in 3.12.x or 3.13.0. **K must re-pin to
`~3.13.0` as its first infrastructure motion (before any scene design work)** and verify every
BOOK edge against the changelog. The re-pin must land in K.W0 so that all subsequent K waves
consume from the current surface.

### T5 — Props-destructuring (NARROWED in J, rule now consistent with the tree)

**J resolution:** `J/FINAL.md §9 T5` — the blanket rule is REPLACED with its true kernel: "a
destructured prop passed INTO a composable loses reactivity; THAT is gated." Template/watchEffect
destructure is platform-idiomatic post-Vue-3.5 and is no longer policed. The 6 live Vue-3.5 sites
the J audit found (`AnimationMenuBar.vue:200` et al.) are idiomatic and correct; the narrowed rule is
on disk in `feedback_props_destructuring.md`. **T5 is RESOLVED.** K inherits the narrowed rule only.

### T6 — The "two live narratives" risk at the tranche transition (NEW for K)

**The J observation:** the chronic-closure substrate was re-pointed to the J ledger in the close
motion, but the clean-ledger GREEN is the named carry — not yet accomplished at the J close
(`J/FINAL.md §9`). The I substrate's GREEN remains the standing oracle until the grooming lands.
**K risk:** if K.W0 opens the K ledger as a new chronic parse target before the J substrate grooming
is complete, `proof:chronic-closure` would be parsing neither the I substrate (stale) nor the K
substrate (authoritative) correctly — two live narratives, neither green. **K precept (new):**
P-SUBSTRATE — *before K.W0 opens any new chronic or closes any inherited one, the
`proof:chronic-closure` parse target MUST be the K ledger AND green on a groomed K substrate. The
substrate grooming and the K chronic registration happen in ONE motion, never in sequence.*

---

## §4 — THE U-K USER AUDIT REGISTER (verified roots, inv ε)

The orchestrator's triage lists U-K1 through U-K20 from the user's live audit (2026-06-11, binding).
Each finding is a seam-level root, not an implementation prescription. **This lane records the root
— the implementation waves are for K.W{0..n}.**

| # | Finding | Root (file:line or observed fact) | Severity |
|---|---|---|---|
| U-K1 | Dock not shrunken by default | `TransportDock.vue:23` `:always-expanded="false"` IS set; the dock's shrunken state depends on `GlassDock` CSS/JS in glass-ui `3.11.2`. Likely glass-ui `3.11.2 → 3.13.0` layout change. Re-verify after the glass-ui re-pin (T4). | P1 |
| U-K2 | Hero rainbow-play → no smooth transition to cube animating | Cold-path: the `onPlayStateChange → autoPlayNext → getRunSceneSwitch("cube")` chain (`useSceneMachineApp.ts:155-165`) navigates but the cube does NOT start animating. The `bindSceneAdapter` path (`useSceneMachineApp.ts:70-73`) auto-selects `names[0]` only when the scene is not home and the group is present; the cold-store path may not be reaching `markSceneReady → machine.dispatch({ type: "PLAY" })` (`useSceneMachineApp.ts:128-131`) correctly. The U4 conditional-select deletion removed an implicit auto-play side-effect (§S3). | P0 |
| U-K3 | Rainbow play broken while slider progresses | Slider advances (rAF loop running) but subject frozen → the subject-write path is failing. `proof:subject-animates` should catch this (`a2c3a5b`); if it doesn't on the cold path, the oracle lacks the cold-path scenario. Root same as U-K2. | P0 |
| U-K4 | Amiga floats and flashes constantly | `demo/amiga/` — the amiga scene subject has a persistent visual artifact independent of play state. Likely a `useAmigaAnimations` or `useSphereSpin` composable issue, possibly exacerbated by a glass-ui 3.11.2 backdrop-filter/compositing change. Requires a browser probe. | P1 |
| U-K5 | None of the animations work properly (/square) | `SquareScene.vue` / `demo/square/useSquareAnimations.ts` — the square's custom transform fn may be breaking after the J.W7c refactor or a glass-ui/Vue reactivity change. Requires a browser probe. | P1 |
| U-K6 | Fonts wrong globally — bottom dock should carry display voice (Instrument Serif) | `demo/@/styles/style.css` — the global `--font-stack-text` token (`style.css:113`) drives the demo body font; the bottom dock (`TransportDock.vue`) does not carry `Instrument Serif`. The display voice (`text-display-*` family) is Instrument Serif via glass-ui tokens. The dock should use a display-rung token for its primary label. The FIX IS AT THE ROOT (not per-scene). | P2 |
| U-K7 | Dock/stage/controls layout needs wild refinement — modern grid/subgrid, no hardcoded dock offsets, pathologically large screens handled (max-width clamp for docks + controls cluster) | `demo/@/styles/style.css` + `TransportDock.vue` + `ChromeDock.vue` + `AnimationControlsGroup.vue`. The `--phi` system is established; large-screen handling requires a `max-width` clamp on both docks and the controls cluster (e.g. `max(50vw, 40rem)` for the cluster; `clamp(…)` for dock position). **modern-web-guidance must be consulted before any layout work.** | P2 |
| U-K8 | Top dock expanded fonts wrong | `ChromeDock.vue` — the expanded top dock label typography is not on the display ladder. Same root class as U-K6. | P2 |
| U-K9 | A wrapped line that should be one line | Unidentified — requires a browser probe with screenshots. Likely a subtitle/hint element in `EditorStartScreen.vue` or a dock label overflowing. | P2 |
| U-K10 | Fonts inconsistent globally | Global token inconsistency — see U-K6. The same fix (root `--font-stack-*` + display-rung consumption) closes U-K6/U-K8/U-K10 as a single pass. | P2 |
| U-K11 | Spring UI still inadequate — no proper keyframes editor | `demo/spring/SpringSidebar.vue` — the U5 redesign added the `@keyframes` variant artifact section (`SpringSidebar.vue:110-126`), but the editor is a read-only `CSSCodeEditor` display. A PROPER keyframes editor (editable, applying back to the animation) requires the HEAVY `KeyframesEditor` surface. The seam is `AnimationControls.vue` (lazy-loads the Monaco-bearing panes). | P1 |
| U-K12 | Top tabs look awful — pills if tabs at all, likely dock-dropdown items instead | `ChromeDock.vue` + `demo/app/App.vue` — the control-surface tab triggers in the top dock should be styled as pills (`SegmentedControl` / `ToggleChip variant="cell"`) or collapsed into a dropdown. **modern-web-guidance consult required.** | P2 |
| U-K13 | Two panes "look awful" (spring-adjacent panels) | Based on context and the tree: the two identified panes are (a) the `TimingFunctionPanel.vue` and (b) the `LayerConfigPanel.vue`. Both are in the `controls/` subtree (`AnimationControls.vue`). The U5 spring redesign improved the main spring sidebar but the timing-function and layer-config panels share the spring scene's visible controls surface and have not been redesigned. | P2 |
| U-K14 | Upgrade to LATEST glass-ui (sliders etc.) | Root = T4 (§3). Re-pin `~3.11.2 → ~3.13.0` in `package.json:182`. Verify every BOOK edge in `glassui-AX-handoff.md` set (ii). | P1 |
| U-K15 | Spring animation slider literally steps (not smooth) | `demo/spring/SpringTarget.vue` or `SpringSidebar.vue` — the spring parameter sliders use glass-ui's `Slider` primitive; if the glass-ui slider in 3.11.2 emits discrete step events rather than continuous `input` events, the re-pin (U-K14) may cure this. If not, the step is a debounce/throttle in the composable (`useSpringDemo` or `useSpringLinearStops`). | P1 |
| U-K16 | Spring/other vizs need real OPTIONS — single-option dropdowns STILL render somewhere | The U4 rule (`animationNames.length > 1` guard at `TransportDock.vue:39`) covers the TRANSPORT dock. The single-option rule must be TOTAL — check `EasingSelect.vue`, `AnimationControlsControls.vue` direction/fill selects, `TimingFunctionPanel.vue`. A `proof:no-single-option-select` gate is the enforcement surface. | P2 |
| U-K17 | A pane clipped on the left + should be draggable; the green disliked — prefer the main-controls red with dashed outline for the final state | The "clipped on the left" pane is `ControlsPaneWrapper.vue` (the rail-side sheet on mobile/desktop). The dashed red outline is the `--subject-teal` cursor color; the user prefers the main-controls red (`--primary` / brand red). The draggable pane implies `useDragScrub` or a resize handle. | P2 |
| U-K18 | Better hierarchy with less useless information (two readout panes) | `AnimationControls.vue` — the controls tab has both `AnimationControlsControls.vue` (duration/delay/iterations etc.) and `AnimationVisualizer.vue` (progress ball) as sibling panes. The user sees two panes as redundant. The readout panes should be collapsed into a single coherent hierarchy. | P2 |
| U-K19 | A demo where dragging resizes the container instead of dragging | A new scene (or a mode on the square/cube scene): dragging the stage boundary resizes the cq-unit container. The `AnimationVisualizer` already uses `calc(100cqw - 100%)` (`AnimationVisualizer.vue`, MEMORY). The feature would extend this to make the container itself draggable — a new composable consuming `useDragScrub` and writing `--container-width`. | P2 |
| U-K20 | REMOVE the FourierField from the hero background; grid lines slightly less opaque | `EditorStartScreen.vue:78-86` — the `<FourierField variant="hero">` in the `.fourier-vacancy` block is the J.W7a S4 (D18) install. Remove it. The grid lines are in `demo/@/styles/design-idioms.css` (`--grid-paper-alpha` or `--graph-paper-opacity`). | P2 |

---

## §5 — DISPOSITIONS ROLL-UP

| Finding / Tension | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| U-K2/U-K3: hero cold-path broken (subjects freeze) | P0 | `useSceneMachineApp.ts:155-165`, `TransportDock.vue:38-95`, U4 deletion side-effect | **K.W0** — born-RED gate before any other wave |
| U-K4: amiga floats+flashes | P1 | `demo/amiga/useAmigaAnimations.ts` | **K.W0** probe, gate if reproduced |
| U-K5: square animations broken | P1 | `demo/square/useSquareAnimations.ts` | **K.W0** probe |
| U-K14/T4: glass-ui re-pin ~3.11.2→~3.13.0 | P1 | `package.json:182`, `glassui-AX-handoff.md` | **K.W0** FIRST motion |
| U-K1: dock not shrunken (re-verify after re-pin) | P1 | `TransportDock.vue:23`, glass-ui GlassDock | **K.W0** re-verify |
| T3: meta-gate derives set from proof:correctness | P1 | `scripts/proof-gate-is-runtime.mjs:84-93` | **K.W0** S-effort |
| proof:demo-fonts tier-decision (GC-4 carry) | P1 | `scripts/proof-demo-fonts.mjs:68-72` | **K.W0** tier-decide before W1 |
| U-K11: proper spring keyframes editor | P1 | `SpringSidebar.vue:110-126`, `AnimationControls.vue` | **K.W1** (design wave) |
| U-K15: spring slider steps | P1 | glass-ui Slider / `useSpringDemo` | **K.W0** re-verify after re-pin, else K.W1 |
| P-SUBSTRATE: chronic-closure J→K substrate grooming | P1 | `scripts/proof-chronic-closure.mjs:109` | **K.W0** first motion alongside re-pin |
| U-K6/U-K8/U-K10: fonts wrong globally | P2 | `style.css:113`, dock components | **K.W1** (design wave) |
| U-K7: layout modernization (grid/subgrid, large screens) | P2 | `style.css`, dock layout | **K.W1** (design wave) — consult modern-web-guidance FIRST |
| U-K12: top tabs → pills/dropdown | P2 | `ChromeDock.vue`, `App.vue` | **K.W1** (design wave) |
| U-K13: two panes (timing fn + layer config) | P2 | `TimingFunctionPanel.vue`, `LayerConfigPanel.vue` | **K.W1** (design wave) |
| U-K16: no-single-option rule totality | P2 | `EasingSelect.vue`, `AnimationControlsControls.vue`, gate | **K.W1** |
| U-K17: clipped pane + draggable + color preference | P2 | `ControlsPaneWrapper.vue` | **K.W1** (design wave) |
| U-K18: two readout panes hierarchy | P2 | `AnimationControls.vue` | **K.W1** (design wave) |
| U-K19: container-resize drag demo | P2 | new composable / scene mode | **K.W2** (new feature) |
| U-K20: remove FourierField from hero | P2 | `EditorStartScreen.vue:78-86` | **K.W0** (S-effort, one-line delete) |
| U-K9: wrapped line that should be one line | P2 | unknown — requires browser probe | **K.W0** probe |
| T1: KISS vs gate corpus (collapse or own the 109) | P1 | `package.json`, `scripts/` | **K.W0** (charter decision before impl) |
| T5: props-destructuring (RESOLVED in J) | — | `feedback_props_destructuring.md` | CLOSED |
| T2: engine un-fencing (RESOLVED in J) | — | `I/PATH-FORWARD.md:124`; `J/FINAL.md §2` | CLOSED |
| P6-WITNESS: observe-only chronic closure must carry on-device born-RED witness | P1 | `proof:chronic-closure`, CH-3/CH-4 | **K.W0** closure grammar evolution |
| P-TASTE: user-drive at wave close (named precept) | — | process precept | RECORD (non-gateable) |
| P14b cold-path correctness leg | P1 | `proof:live-session.mjs` B1 leg | **K.W0** born-RED gate |
| glass-ui 3.11.2→3.13.0 AX handoff verification | P1 | `glassui-AX-handoff.md` set (ii) | **K.W0** alongside re-pin |
| release.yml gates-on-correctness USER-DOMAIN decision | P2 | `.github/workflows/release.yml` | **K.W0** (record or resolve) |
| CI two-tier aggregators as deploy contract | P2 | `.github/workflows/ci.yml` | **K.W0** (book or act) |

---

## §6 — TERMINAL READING

**The J source-hygiene spine (P1/P6/P7/P11/P13) is the model.** Every wave added to it, none
violated it. The no-legacy contract applies to docs, memory, and gates as much as to source; J
demonstrated this with the T5 memory narrowing and the W7a/W7c doc rewrites.

**The J-born invariants (P14, P14b, P17) are the gate discipline's core.** They hold for the 10
correctness gates. Their open extensions — the meta-gate one-directionality (T3) and the cold-path
blindspot (P14b/§S3) — are K.W0 starters with known born-RED witnesses.

**The two new K precepts** — P6-WITNESS (observe-only chronics require an on-device born-RED witness)
and P-TASTE (gate-green certifies the oracle, not human approval; user-drive is mandatory at wave
close) — are not gateable in the mechanical sense but must be named in the K charter so they can be
cited when a wave is challenged.

**The P0 cold-path regression (U-K2/U-K3) is K's first correctness boundary.** It is the J.W4
precept's own blindspot recurrence: an un-exercised axis (the hero cold-path → cube-animating) that
looked green but was broken in the user's hand. K.W0 installs the correctness gate for this axis
before any design wave proceeds. Until that gate is born-RED-witnessed and green, the product is
broken for the user's most common first gesture.

Doc: `/Users/mkbabb/Programming/keyframes.js/docs/tranches/K/audit/precepts-k.md`
