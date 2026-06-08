# Tranche I — PATH-FORWARD (the executive summary)

**Branch:** `tranche-i-dev` (forked off the broken master `b934a08` = Tranche H's tip).
**Type:** TRANCHE DEVELOPMENT — this document, the PROGRESS board, and the audit corpus under
`docs/tranches/I/audit/**` are the deliverable. **No source is fixed here. No commit is made.**
**Date:** 2026-06-08.

This is the one-page reckoning a reader needs before touching the code: **what broke, why every gate
missed it, the order the waves must repair it in, and the immediate deploy-damage-control action** —
because the broken product is, by the deploy-of-record's own design, almost certainly LIVE.

---

## §1 — WHAT BROKE (the catastrophe, in one paragraph)

Tranche H shipped at `4.1.0`-base with **ALL ~97 `proof:*` gates GREEN** — `tsc` 0, `proof:all`,
`proof:browser` 35/35, `proof:visual-lock`, and the headline durability keystone
`proof:chronic-closure` — and its FINAL declared every request resolved and the four chronics
CLOSED. **That certification is false of the product.** The user drove the live demo on 2026-06-08
(dev `:5174` + the built `dist/gh-pages/` reproduces the engine/FSM faults) and found **nine
user-visible breakages**, four of which are the exact chronics H claimed closed-via-system-gate. The
single gesture a user performs first — press the rainbow group-play — **throws an uncaught error**.
The I-investigation harness (Playwright over the built `dist/`, modelled on
`scripts/proof-no-orphan-specular.mjs`) reproduced all nine first-hand, with verbatim stacks,
screenshots, and re-runnable probes under `docs/tranches/I/audit/investigate/`.

The nine breakages, each traced to a confirmed root cause (full evidence in the per-surface
`rootcause-*.md`):

| # | Breakage | Confirmed root cause (file:line) | Owning rootcause doc |
|---|---|---|---|
| **B1** | rainbow group-play throws `Parse error at offset 0: "......"` + `this.transform is not a function` | TWO engine defects: (a) `group.ts:373` calls unguarded `this.transform()` on an empty home group whose `transform!` field (`group.ts:38`) is never assigned — the constructor's promised lazy fallback (`group.ts:118-122`) does not exist; (b) value.js `normalize.ts:213-217` hands the empty read-back of an unset `var(--rotationX)` straight to `parseCSSValueUnit("")` → the bare-`"......"` throw | `rootcause-rc-parse-crash.md` |
| **B2** | DFA suspend/resume `TypeError: ... 'this._gen'`; easing→amiga blanks the controls | `useEasingDemo.ts:227` + `useSpringDemo.ts:365` pass the **UNBOUND** `playback.stop` to `useSceneVisibilityPause`; the visibility watcher invokes it free-standing → `this===undefined` → `playback.ts:216` `this._gen++` throws INSIDE Vue's flush → the swap's render aborts → blank controls | `rootcause-rc-dfa-gen.md` |
| **B3** | `/amiga` "totally broken, floats around" | the sphere is parked at corner `(-5,-5,-5)` while `OrbitControls.target` stays origin `(0,0,0)` — subject ≠ pivot, so a centre-canvas drag tumbles the whole room; PLUS `content-visibility:auto` over a live WebGL rAF loop → per-frame ReadPixels GPU stall | `rootcause-rc-amiga.md` |
| **B4** | `/easing` lost the curve/timing editor (the user wants it BACK) | NOT a J over-removal — the editor is still in source and works on fresh load. On an in-app SWITCH the reka `<Tabs>` `useVModel` latches `passive` from `modelValue===undefined` at mount → `TabsContent value="easing"` computes `isSelected:false` → `data-state="inactive"` → `display:none`. The panel is hidden, not removed | `rootcause-rc-easing-editor.md` |
| **B5** | keyframes editor shows `/* timing-function: custom — no CSS twin */` | the SAME empty-`var()` parse defect as B1, on the serialization path (`CSSKeyframesToString → at() → processFrame`), swallowed by a `try/catch` floor that mis-attributes EVERY throw to the one narrow `serializeEasing` custom-closure case | `rootcause-rc-parse-crash.md` |
| **B6** | `/square` drag highlights chrome text + does not persist | no GLOBAL `user-select:none` on drag-start (`SquareScene.vue:2` scopes it to `.square-stage` over a `window`-scope drag); `pointerup → reseat(0,0)` (`:104`) hard-codes spring-home, discarding the drag. Square HAND-ROLLS its drag, bypassing the shared `useDragScrub` seam | `rootcause-rc-drag-perf.md` |
| **B7** | specular sheen STILL present; "are we using the latest glass-ui?" | glass-ui `~3.5.1`'s `<Card surface="glass">` emits `.glass-specular-track` unconditionally with `--mouse-x` NEVER written → a static dead-centred warm-white bloom on every stage AND 9–11 dock tracks per scene. The `specular="off"` opt-out exists ONLY in glass-ui's unpublished local `v3.8.0`; npm-latest 3.7.0 makes the sheen MORE pervasive | `rootcause-rc-specular-glassui.md` |
| **B8** | ALL dock animations "supremely broken, slow, errored" | a COMPOSITE: (a) dock `transition: width` (`dock.css:512`) under `backdrop-filter` re-runs layout+reblur every frame → 12/114 dropped on expand; (b) `/easing` writes a reactive `ref` per rAF frame → a 243-node SVG render storm at 46fps; (c) 4–6 stacked rAF loops per scene; (d) the "errored" half is B1 console bleed | `rootcause-rc-drag-perf.md` + `b16-perf-profile.md` |
| **B9** | dev `ENOENT easing-icon-sm.svg` + 47 source-map errors | NOT a product defect — the built `dist/` is clean. A stale `demo/app/dist/` (Mar-25, default-outDir landmine) + a stale Vite module graph import the H.W5 name H.W10 renamed; the dev SPA-fallback masks it as 200-HTML. The x47 are dev-only DevTools dep-optimizer noise | `rootcause-rc-icons-build.md` |

Plus the demo-name nit (K, `feedback/k-demo-name.md`): the tab title should be exactly
`keyframes.js`, not the long subtitle.

---

## §2 — WHY THE GATES MISSED IT (the headline — the gate-blindspot, made mechanical)

This is the reason Tranche I exists, and the headline its overhaul must close for good. Full
analysis: `rootcause-rc-gate-blindspot.md`.

**One sentence:** every H gate's ORACLE is a PROXY one or more steps removed from the running
product — source text, a jsdom unit, a localStorage snapshot, a self-captured baseline (with the live
subject masked OUT), a design-token number, or a markdown table — and the born-RED→green discipline
laundered each proxy assertion into a correctness claim, so **the MORE gates H built, the MORE false
confidence it manufactured.**

The census, counted first-hand from the gate scripts:

| Oracle class | What it reads | ~Count | Can it see B1–B9? |
|---|---|---|---|
| SOURCE-SHAPE (static) | the source TEXT (grep/regex/a re-derived table) | ~40 | **NO — structurally blind** |
| JSDOM UNIT | the engine API under jsdom (no layout, no GPU) | ~14 | mostly NO |
| PROXY STORE | a localStorage JSON round-trip (live adapter stubbed) | ~3 | **NO** (B2) |
| SELF-BASELINE | a pixel diff vs a baseline from the SAME build, subject MASKED OUT | 1 | **NO — locks brokenness** (B3/B4/B6) |
| LOAD-REST BROWSER | `goto` → wait → read console AT REST — no click/switch/drag | ~20 | rarely (B1) |
| WRONG-PROJECTION BROWSER | drives an interaction but asserts the wrong DOM (a chrome LABEL) | ~10 | **NO — the subtle killer** (B4) |
| GENUINELY BEHAVIORAL | drives a real interaction AND asserts a product property, budget 0 | **≈0** | — |

**~54 of ~98 nominal correctness gates (102 `proof:*` proof keys − 4 meta/aggregators; see
`audit/rootcause-rc-gate-blindspot.md §1` for the first-hand census) cannot by construction observe a
runtime defect — they never open a browser. Of the ~34 that do, every one is load-rest, proxy-store,
self-baseline, or wrong-projection. Not one gate loads a scene, CLICKS PLAY, SWITCHES scenes, and
asserts a clean console.** The CI `demo-smoke`
job genuinely installed Playwright + chromium and ran the browser gates green — so this is strictly
worse than a gap: a false positive with a ceremony of rigor around it.

The keystone failure: **`proof:chronic-closure` — the durability mechanism built to end the
re-papers — is ITSELF a source-shape gate.** It `fs.readFileSync`s `H/PROGRESS.md`, parses the
`## Open deferrals` markdown table, and asserts each cited gate NAME resolves to a `package.json` key.
It opens no browser and runs no cited gate. It proves the paperwork is tidy; it certified exactly that
while B1–B9 ran live. H built a meta-gate to police the chronics and made it the deepest expression of
the very blindspot it was built to close.

Two compounding scandals the audit surfaced:
- **`proof:no-route-storm` DOES NOT EXIST.** It is cited as the broad-console owner in SIX gate
  docstrings and counted toward H's green tally in `FINAL.md:34` — yet it is not in `package.json` and
  has no script file. The broad-console oracle was deferred to a gate that was never authored.
- **`proof:specular-handoff` is parked born-RED against glass-ui `3.8.0` — a version that does not
  exist** (npm tops at 3.7.0). A born-RED gate against a vaporware target is an un-dischargeable IOU
  that goes green by *accepting the defect as residue*.

**The precept-level cure (the design input for the whole tranche — BOUND as a CHARTER INVARIANT at
I-open, t=0; enforced by the `proof:gate-is-runtime` meta-gate so it is mechanically prior, not
asserted by the last wave):**

> A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME surface
> the human uses, with an ERROR BUDGET OF ZERO across the human's interaction battery (PLAY + SWITCH
> + DRAG). A gate whose oracle is source text, a jsdom unit, a serialized snapshot, a self-captured
> baseline, a design-token number, or a paperwork ledger is a HYGIENE gate, not a CORRECTNESS gate,
> and MUST be LABELED as such — it may never count toward a correctness or chronic-closure tally.

The architectural transposition that implements it: **collapse the lattice of ~34 load-rest /
wrong-projection browser gates into ONE re-runnable interaction-driven session harness** (`proof:
live-session`) — the very harness the investigation used to reproduce B1–B9, extended from PASSIVE to
ACTUATING. Per scene: load → CLICK the rainbow play → hover-expand the morphing dock + SWITCH to every
scene → fire a `visibilitychange` while a raw-rAF scene plays → DRAG `/square` + the bezier handles →
switch back → replay. The oracle is a single accumulated **error budget = 0** (zero `pageerror`,
`unhandledrejection`, `console.error`, value.js `"......"`) PLUS product-facing DOM assertions read
from the surface the human sees. Keep the ~54 source-shape/jsdom gates — they are cheap and police
what their oracle CAN see — but STRIP them of correctness authority.

---

## §3 — THE REMEDIATION SEQUENCE (the order the waves must land)

The crashes "poison every other measurement" (H's own justification for sequencing the crash fix
first), so the engine/FSM correctness fixes LEAD the FIX waves; the gate-regime OVERHAUL (I.W7) CLOSES
— its `proof:live-session` battery is the union of every prior wave's interaction leg, fully green only
once they land. **The gate-ORACLE precept does NOT lead as a wave — it is BOUND at I-open (t=0) as a
charter invariant, mechanically prior, enforced by the `proof:gate-is-runtime` meta-gate** (so nothing
forces I.W0–I.W6's gates to be runtime gates by authorial fiat — the machine forces it; see `I.md
§ The precept is MECHANICALLY PRIOR`). The appearance/perf items follow the crashes; mobile M1/M2/M3
fold into existing waves (no separate mobile wave). **inv-16 for I un-fences the engine**
(`src/animation` is the kf PRODUCT, not a sibling) — runtime correctness MAY require engine
transposition.

**I.W0 — B1/B5 the empty-value parse crash (CRITICAL, engine transposition — LEADS the fix waves,
poison removal).** Three layered moves from the value seam outward: (a) value.js's `getComputedValue`
never hands `""` to the parser — an empty/whitespace read-back resolves to the declared fallback or a
typed empty unit (the H.W0 selector-guard's TWIN at the value seam); (b) serialize from the DECLARED
template, not from a DOM-resolving `at()` sample — a `var()`/`matrix3d()` is already valid CSS and
round-trips verbatim; (c) kill the mis-attributing placeholder. PLUS the co-resident B1 fault: default
`AnimationGroup.transform` to a real no-op at the FIELD (never `undefined`), and short-circuit
`play()` on an empty group so home's navigate-intercept owns the click. Gate: the session probe leg
reds at HEAD on the play click — driven on HOME (the empty-home-group repro) AND cube — greens only
when both seams are total + a `.cube` transform delta proves the loop is live. Until this dies, no
other wave's console oracle is readable.

**I.W1 — B2 the DFA suspend/resume crash (CRITICAL, engine + composable transposition).** Make
`RAFPlayback`'s control surface BIND-PROOF by construction (arrow class-fields / constructor bind) so
`const s = pb.stop; s()` can never lose `this` — this closes the entire unbound-method class, not just
B2's two sites. Consolidate the duplicated raw-rAF scene boilerplate (easing + spring both hand-wire
the same recipe and both made the same binding mistake) into ONE `useRafScene` composable with bound
callbacks. PRESERVE the pure reducer's suspend/save/resume-iff-was-playing algebra untouched (it is
correct). Make the control-panel mount a pure function of the DFA surface set + active group,
order-independent. Gate: in ONE persistent context, plays a raw-rAF scene and fires
`visibilitychange→hidden` (the SYNTHETIC born-RED-of-record — deterministic, de-coupled from the
B8-blocked dock gesture), asserts no throw + the leaving scene suspends + the incoming
resumes-iff-was-playing + the destination controls render non-blank. The real dock-Select switch leg
is the ADDITIONAL integration assertion, gated AFTER B8's dock is hit-testable (I.W4). The
`unbound-method` lint is a HYGIENE-tier corroborator.

**I.W2 — B4 the easing editor blank-on-switch + the editor restoration (folds mobile M2
controls-reachability).** Single-source the SELECTED control surface from the scene machine's DFA (not
a per-animation localStorage poke that lags the swap), so the `<Tabs>` is born-correct on every entry;
for single-surface scenes (easing/spring) `force-mount` the sole `TabsContent`. Reconcile
J-minimal-vs-"editor BACK": KEEP the `EasingSelect` dropdown + the editable `EasingCurveCanvas`; fold
back the read-only value+copy readout; unify the two bezier hosts onto one `EasingEditor`. The mobile
sheet body must SCROLL to its content (drive `isPanelTransitionDone` off the spring settle, M2). Gate:
switch INTO easing, assert the curve canvas is present + `display!==none` + a handle-drag mutates the
path.

**I.W3 — B3 the amiga geometry.** Unify subject = orbit pivot = framing (centre the sphere, make
`controls.target` track it) so the centre of the canvas HITS the sphere and the intended
drag-to-spin→decay-glide becomes reachable. Gate: drive a centre-canvas drag, assert the SPHERE moved
while the room did NOT tumble. (RC-2 `content-visibility:auto` removal folds into I.W4's perf work.)

**I.W4 — B6/B8 drag + perf (folds B3 RC-2; folds mobile M3 dock retune).** Lift global gesture-scoped
select-suppression into the shared `useDragScrub` seam; migrate square's hand-rolled drag onto it with
a `releasePolicy: persist`. Drive the `/easing` sweep dot via a non-reactive `style.transform` write
(not a per-frame reactive `ref`); collapse the 4–6 stacked rAF loops to ONE composed `RAFPlayback`
driver per scene; drop `content-visibility:auto` from the live WebGL root (B3 RC-2 — the occlusion-
pause intent is already served by the event listeners). The dock `transition: width`-under-backdrop
hitch + the M3 `transition:all` retune ride the glass-ui consume-edge (the I.W6 v3.8.0 pin). Gate:
`proof:drag-gesture` (no text-selection + transform persists, EVERY drag surface) +
`proof:perf-frame-budget` (under a CDP CPU throttle at the named factor, the dropped-frame threshold
BOUND from the `b16` baselines — born-RED requires HEAD's 12/114 + 36-dropped to FAIL — dropped-frames
≤ the bound budget on the playing scene + dock expand; fails on ReadPixels/content-visibility warns).

**I.W5 — B9/K hygiene + shell chrome (folds mobile M1 layout; DC-8).** Collapse the demo build to one
canonical `outDir` (the default-outDir landmine is the architectural root); one-time delete the Mar-25
`demo/app/dist/` orphan; make the dev SPA-fallback 404 asset-extension misses honestly. Set the tab
title to exactly `keyframes.js`. Author one runtime icon-paint + zero-asset-404-during-interaction
gate; retire the source-shape `proof:scene-icons`. Verify DC-8 scene-swap dead-CSS grep = 0 (default
KILL unless a live `startViewTransition` consumer exists; no fourth defer). Anchor the mobile sheet
from the MEASURED menubar height (`sheet.bottom ≤ menubar.top`, M1). Carry a HYGIENE-tier `engine.ts ≤
1400 OR named-measured cohesive split` ceiling clause (C-6) so the I.W0 serialize transposition's
line-cost is enforced, not hoped.

**I.W6 — B7 the specular consume-edge.** A two-sided edge, no kf fork: (1) drive glass-ui to PUBLISH
`v3.8.0` (the `specular="off"` default already exists at glass-ui HEAD, tagged locally, unpublished —
a coordination ask to the AX session, NOT a kf patch); (2) bump kf's pin straight to v3.8.0 (skip
3.6/3.7) and leave `specular` at its new default `"off"` — the stage cards + 9–11 dock tracks go clean
with ZERO kf CSS; the same cut carries the M3 dock-transition retune. PLUS give the page substrate
real depth so the flat glass plate has something to refract (legitimate kf demo-app styling, a
NON-BLOCKING hygiene corroborator). Gate: invert the old gate — assert the bloom is ABSENT at rest on
a RUNNING stage, the PRIMARY oracle a PERCEPTUAL luminance delta (the class-absence check is a
HYGIENE-tier corroborator, NOT an OR-escape); DELETE `proof:specular-handoff`. REJECT the
`.glass-specular-track::before { content: none }` consumer-suppression workaround.

**I.W7 — THE GATE-REGIME OVERHAUL (the headline; CLOSES the DAG).** Install `proof:gate-is-runtime`
(the machine enforcer of the t=0 gate-ORACLE precept charter invariant). ASSEMBLE `proof:live-session`
(the interaction-driven, zero-error-budget session probe) from the per-wave interaction legs. Define
the structured error-budget allowlist ONCE (inherited by every wave's console clause). Author the
two-tier taxonomy: relabel the ~54 source-shape/jsdom gates as HYGIENE, forbid them from
correctness/chronic tallies. Re-author `proof:chronic-closure` so it asserts each cited gate is a
runtime gate that was witnessed born-RED. DELETE `proof:specular-handoff` (vaporware IOU); author the
never-written `proof:no-route-storm`'s real intent INTO the session harness. This wave is born-RED on
`b934a08` (every breakage live) and is fully green only once I.W0–I.W6 land — the battery is the union
of their legs. The overhaul does not LEAD because its precept is asserted last; the precept leads at
t=0; the BATTERY assembles last.

**I.WZ — the close.** FINAL.md, prompt-recap, the IMMEDIATE `d469e69` deploy-revert tracked +
post-revert verified, the I changeset (version owner Mike Babb), and the deploy. The deploy is
user-domain, confirm-first.

---

## §4 — THE IMMEDIATE ITEM: deploy damage control (act on this FIRST)

**The broken demo is, by the deploy-of-record's own design, almost certainly LIVE at
keyframes.babb.dev right now.** This is the most urgent item in the tranche and is independent of all
the wave work above.

The mechanism (verified from `.github/workflows/deploy-pages.yml`): `keyframes.babb.dev` is a
Cloudflare Pages project that auto-deploys on **every GREEN-CI master push** — the former tip-commit
path filter was explicitly dropped (`d469e69`) so that "every green-CI master push re-ships the live
site." H's close `b934a08` was pushed to master with ALL ~97 gates GREEN, so CI passed, so the deploy
job's `if` was true, so **the build that crashes on the rainbow-play click shipped to the live site.**
The gate-blindspot that let H certify a broken product green is the SAME mechanism that auto-deployed
it — there is no human gate between "CI green" and "live."

**Recommendation (do this before, and independent of, the wave work):**

1. **Revert master to `d469e69`** — the last commit before the H wave set (20 commits back; a clean
   ancestor of master; the pre-H CI/deploy boundary commit). This is the last known-good tree: it
   pre-dates the H.W0 incomplete crash fix, the H.W1 unbound-`stop`, the H.W5 amiga rebuild, the
   H.W10/W12 easing strip, and the H.W7 mobile seams. A green-CI push of the revert re-ships the
   known-good demo to keyframes.babb.dev automatically (the same deploy path that shipped the breakage
   now ships the fix). Do this as a `git revert`-style restore on master, NOT a force-push that
   rewrites history — the H commits stay in the log, the live site goes back to good.
2. **Hold the npm publish.** The library entry (`src/animation/index.ts`) is engine source that B1/B2
   transpose; do not publish a version while the engine is mid-repair. The tree is at `4.1.0`; the I
   library bump waits for I.WZ.
3. **Do NOT re-deploy from `tranche-i-dev` or master until I lands.** I is development-only; nothing
   here is merge-ready. The next live deploy should be the I close, after the session harness is GREEN
   on a tree where a human using the product sees it work.

The revert is reversible and low-risk: it restores a tree that was live and good before H, and it buys
the tranche the room to fix the engine properly rather than under the pressure of a live-broken site.
**This is the deploy-damage-control headline: the gates that certified the breakage also shipped it —
revert to `d469e69` to take the broken product off the air while I does the real work.**

---

## §5 — THE TERMINAL READING (one paragraph for the charter)

H did not fail for lack of discipline; it failed by pointing a rigorous born-RED discipline at the
WRONG ORACLE — source shape, a jsdom unit, a localStorage snapshot, a subject-masked self-baseline, a
design-token number, a markdown table — and then enshrining that mis-aim as the durability mechanism
in `proof:chronic-closure`, a source-shape gate policing other gates' paperwork. ~54 of ~98 gates
cannot by construction see a runtime defect; the ~34 that open a browser rest on load, round-trip a
proxy store, diff a masked self-baseline, or assert the wrong DOM projection — and NOT ONE drives the
single gesture the user performs first. Tranche I's correction is singular and architectural: **bind
the gate ORACLE to the running product, exercised through the human's surface, with a zero error
budget across PLAY + SWITCH + DRAG** — collapse the proxy lattice into one interaction-driven session
probe, un-fence the engine for the B1/B2/B3 transpositions, re-open the four false-closed chronics
with their live receipts, and — first, before any of it — REVERT master to `d469e69` so the broken
product the gates auto-shipped comes off the air. The gate-regime overhaul is the headline; it is the
ONLY way "green" comes to mean "a human using the product would see it work," and the ONLY way the
gate-blindspot closes for good.
</content>
</invoke>
