# Tranche H DEEP harden — lane `hd-gate-redteam`

**Charge.** Adversarial red-team of the gate-regime upgrade (H.W8) + every wave gate.
Is the visual-lock pixel-baseline robust across CI runners? Is each `proof:*` gate
born-RED TODAY (cross-checked against live anchors)? Is any gate satisfiable by a
workaround the chronic-closure discipline forbids? Are the born-RED HANDOFF gates
authorable kf-side without the sibling fix landing? Is the gate set COMPLETE for D1–D14?

**Method.** Read H.md + H.W0..H.W8 + a-gate-blindspots + a-deferred-chronic +
a-changes-vs-plan + PROGRESS.md chronic table + _SYNTHESIS-gap-scorecard §6/§deferred-ledger
§1. Verified the actual gate scripts (`proof-idioms.mjs` clause-8c, `occlusion-gate.mjs`
PENDING + stale-guard, `proof-demo-usability.mjs` clause-2, `proof-brittleness.mjs`
LISTENER_ALLOWLIST). Verified node_modules APIs (glass-ui 3.4.0 cartoon tokens,
`--spring-dock`, Card `surface` prop, DockDropdownTrigger/useDockState/dockContext).
Drove the live demo at `http://localhost:5173` (kf 4.1.0 + Tranche G) via Playwright to
confirm born-RED anchors.

**Verdict.** The architecture is SOUND and the two ROOT diagnoses (no appearance axis,
drifted manifest) are TRUE and well-instrumented. The visual-lock, manifest, hero-rung,
spring-dock-token, cartoon-token, and mobile-crush anchors are all genuinely born-RED and
all the cited templates (clause-8c, stale-guard, KF_REQUIRE_BROWSER, capture.mjs) exist.
BUT the wave carries **2 BLOCKERS, 4 HIGH, 5 MED, 3 LOW/NIT** — chiefly a phantom
parseable substrate (`H/FINAL.md` does not exist), a dangling gate-name in the meta-gate's
own table (`proof:dock-live` vs `proof:dock-morph-settled`), a missing pixel-diff
dependency, and a clause-8c token-rename collision with the H.W3 fix that this very wave
is supposed to police.

---

## BLOCKERS (the wave cannot be implemented as written)

### B-1 (BLOCKER) — the chronic meta-gate parses a substrate that DOES NOT EXIST (`H/FINAL.md`)
**Location.** H.W8 §S3 (`H.W8.md:33`), §Hard-gate (`H.W8.md:45`).
**Defect.** S3 names the parseable substrate as "the COMMITTED chronic→gate table in
`H/PROGRESS.md` … **mirrored in `H/FINAL.md` at H.WZ**" and the §Hard-gate restates
"Parsing the COMMITTED chronic→gate table (`H/PROGRESS.md` / `H/FINAL.md`…)". **There is
no `H/FINAL.md` on disk** — `ls docs/tranches/H/` returns only `H.md`, `PROGRESS.md`,
`audit/`, `waves/`, `valuejs-parsethat-glassui-handoff.md`. `H/FINAL.md` is the H.WZ
artifact that does not yet exist (PROGRESS.md:118 lists H.WZ as "authored — awaits auth").
A gate that parses two files where one is absent will either throw on the missing file or
silently police only PROGRESS.md while the spec claims it polices both — a vacuous half.
The meta-gate's entire BITE depends on the table being parseable; pointing it at a
phantom file is an implementation-blocking ambiguity.
**Fix.** Edit H.W8 §S3 + §Hard-gate so the meta-gate's CANONICAL parse target is exactly
ONE committed file that exists at gate-author time: `H/PROGRESS.md §"Deferred ledger"`
table (lines 267–273, verified present). State that `H/FINAL.md` is the H.WZ *mirror*
that the gate ADDITIONALLY checks **only if present** (a `fs.existsSync` guard), or drop
the FINAL.md reference entirely and make PROGRESS.md the sole substrate. The
`_SYNTHESIS-deferred-ledger.md §1` reference (`:219-223,247-249`) is fine as the
"canonical source of truth" the table derives from, but it is NOT under `H/` and must not
be the runtime parse target if the gate is meant to police the H-tranche ledger.

### B-2 (BLOCKER) — the meta-gate table contains a DANGLING gate name; the gate's own example would red on its substrate
**Location.** H.W8 §S3 clause (ii) (`H.W8.md:33`), §Hard-gate dock clause (`H.W8.md:46`)
vs the COMMITTED table (`PROGRESS.md:272`, authoritative `_SYNTHESIS-gap-scorecard.md`
§6/§4, `_SYNTHESIS-deferred-ledger.md:223,309`).
**Defect.** The meta-gate asserts "every named … `proof:*` gate … RESOLVES to an authored
gate (no dangling name)". The dock row in the COMMITTED chronic→gate table that the gate
parses names **`proof:dock-morph-settled`** (PROGRESS.md:272: "release `53c1b07`;
`proof:dock-morph-settled` born-RED"; gap-scorecard §4 row 1; handoff doc GH-1
`:109,142,153,569`). But H.W8.S3 itself says the table "names
`proof:dock-live`/`proof:dock-morph-settled`" and §Hard-gate authors the gate AS
`proof:dock-live` (11 occurrences in H.W8.md vs 1 of `proof:dock-morph-settled`). The
`_SYNTHESIS-deferred-ledger.md` (cited as the canonical source) uses
`proof:dock-live` (`:182,219,223`), while the gap-scorecard (cited authoritative on
disagreement) and PROGRESS.md use `proof:dock-morph-settled`. So the gate authored under
one name (`proof:dock-live`) will not RESOLVE the name in its own committed substrate
(`proof:dock-morph-settled`) → the meta-gate reds on a DANGLING reference at first run,
against a HANDOFF that is correctly paired. This is a self-inflicted false-red the spec
demands ("name a SYSTEM gate that no wave authors → reds on the dangling reference").
Worse: the handoff doc (`:48-49,68`) treats `proof:dock-live` / `proof:dock-morph-settled`
/ `proof:dock-dropdown-opens` as interchangeable, but they are **two distinct concerns**
(see B-3).
**Fix.** Pick ONE canonical name for the dock-LAG HANDOFF gate across H.W8.md, PROGRESS.md,
gap-scorecard, deferred-ledger, and handoff doc. The authoritative source (gap-scorecard
§6, which the prompt binds as the tie-breaker) + PROGRESS.md both say
`proof:dock-morph-settled` — adopt that as canonical and replace every
`proof:dock-live` in H.W8.md with `proof:dock-morph-settled`. Separately resolve the
popover concern under its own name (B-3).

---

## HIGH (must fix before authorization)

### H-1 (HIGH) — `proof:dock-live` conflates the LAG (glass-ui-HANDOFF) with the POPOVER-OPENS (FSM-coupled, H.W1) — splitting a single born-RED claim across two owners
**Location.** H.W8 §S3 (`H.W8.md:33,46`) defines `proof:dock-live` as "the `@mbabb`
DockDropdownTrigger popover OPENS on click; **dock expand/collapse settles ≤1 frame of its
spring**." H.W1 §Hard-gate (`H.md:327`) separately authors `proof:dock-popover-opens`
(`finalOpen:true` — RED `false` today) for the SAME popover, owned by H.W1's `App.vue`
trigger restructure.
**Defect.** The two clauses have DIFFERENT owners and DIFFERENT born-RED→green triggers:
- The **morph-settle** half (≤1 frame / ≤6% overshoot / ≤200ms) greens ONLY when glass-ui
  ships `53c1b07` and kf bumps — a HANDOFF, NOT authorable/closeable kf-side (live token
  confirmed `--spring-dock: linear(0, 0.10932 2.041%…)` = the +18.5% pre-AW.W2 register).
- The **popover-opens** half is the D9 FSM-coupled fix that H.W1 lands kf-side (drop the
  double-wrapped `App.vue:18-21` trigger). It greens when H.W1 ships, NOT when glass-ui
  publishes.
Binding one gate to two independent green-triggers means the gate can never cleanly state
"born-RED because of the HANDOFF" — H.W1 could green the popover half while the lag half
stays red, leaving the gate red for a reason the chronic ledger attributes to the wrong
owner. The chronic-closure discipline requires the HANDOFF gate police the HANDOFF defect
*only*.
**Fix.** Split in H.W8.md: (a) `proof:dock-morph-settled` (HANDOFF, born-RED on the spring
token, greens on the glass-ui bump) is the CH-4 ledger pairing; (b) the popover-opens
assertion belongs to H.W1's `proof:dock-popover-opens` (already authored there) and the
meta-gate should cite THAT as the D9 SYSTEM gate, not fold it into the HANDOFF gate.
Remove the "popover OPENS on click" sentence from `proof:dock-live`/`-morph-settled`.

### H-2 (HIGH) — `proof:visual-lock` declares `pixelmatch` but the dependency is NOT installed and nowhere in `package.json`
**Location.** H.W8 §S2 (`H.W8.md:31`), §Scope (`H.W8.md:3` "a NEW
`scripts/proof-visual-lock.mjs`").
**Defect.** S2 says "diff via `pixelmatch`". Verified: `pixelmatch` and `pngjs` (its
companion for reading PNG buffers) are NOT in `node_modules` and NOT in `package.json`
(`grep pixelmatch|pngjs package.json` = 0). The existing `capture.mjs` only screenshots —
it never diffs, so there is no in-repo pixel-diff facility to reuse. A wave that authors a
gate around an absent dependency is a feasibility gap (the wave is "docs only" but the
IMPL it specs cannot run). Adding a runtime dep is also a §Mandate consideration (the repo
keeps a lean dep set; this is a new dev-dep that the spec does not call out as such).
**Fix.** Add to H.W8 §Scope an explicit "**add `pixelmatch` + `pngjs` as devDependencies**"
line (Playwright already ships its own PNG screenshots, so `pngjs` is needed to decode them
for `pixelmatch`). State the dep addition is part of the I-2 motion, not assumed-present.
Alternatively name Playwright's built-in `expect(page).toHaveScreenshot()` /
`toMatchSnapshot` (the `@playwright/test` runner's native visual-diff with built-in
anti-aliasing `maxDiffPixelRatio`/`threshold`) — but verify `@playwright/test` (not bare
`playwright`) is the installed flavor first; `capture.mjs` uses bare `playwright` chromium,
which has NO built-in pixel-diff, so the dep add is the honest path.

### H-3 (HIGH) — clause-8c ribbon-width lock (I-3-static/D4) is pinned to `--controls-pane-width`, the EXACT token H.W3 deletes — the lock and the fix collide
**Location.** H.W8 §S4 I-3-static (`H.W8.md:35`: "extend `:560-564` to require
`PlaybackRibbon.vue` reads `var(--controls-pane-width)`/`--rail-width`"); §Hard-gate
(`H.W8.md:50`: "ribbon-width lock (D4: `PlaybackRibbon.vue` reads `var(--rail-width)`)").
**Defect.** The existing clause-8c (`proof-idioms.mjs:561-564`, verified) hard-codes
`var(--controls-pane-width)` and REDS if the raw 400px or a divergent name survives. H.W3
§S2 (`H.md:352`) explicitly DELETES `--controls-pane-width` and replaces it with
`--rail-width` ("replacing `--controls-pane-width` + the 768px cap"). So the moment H.W3
lands, the UNMODIFIED clause-8c reds (it requires `var(--controls-pane-width)` which no
longer exists). H.W8's own §S4 text is internally ambivalent — it writes both
"`var(--controls-pane-width)`/`--rail-width`" (S4) and "`var(--rail-width)`" (§Hard-gate),
i.e. it half-knows the token is being renamed but does not state that the clause-8c
extension must ALSO RE-POINT the existing GROUP/PANE assertions from
`--controls-pane-width` → `--rail-width`. As written, the wave authors a NEW ribbon clause
against `--rail-width` while leaving the OLD pane/grid clauses asserting the deleted
`--controls-pane-width`, which makes `proof:idioms` red against the H.W3 fix it is supposed
to lock GREEN.
**Fix.** In H.W8 §S4, state explicitly: the clause-8c extension is a **re-point + extend**
in one motion — migrate the existing `proof-idioms.mjs:561-564` GROUP-grid-track and
PANE-min-width assertions from `var(--controls-pane-width)` to `var(--rail-width)` (tracking
H.W3's token rename), AND add the new `PlaybackRibbon.vue` reads-`var(--rail-width)` clause.
Resolve the S4-vs-§Hard-gate token ambivalence to `--rail-width` only.

### H-4 (HIGH) — `proof:hero-rung` compares computed font-size to a viewport-dependent `clamp()` token — the threshold is not a scalar
**Location.** H.W8 §Hard-gate `proof:hero-rung` (`H.W8.md:47`); H.W4 §Hard-gate
(`H.md:366`: "hero `font-size ≥ --type-display-mega`").
**Defect.** Live-verified: `--type-display-mega` resolves to
`clamp(5.382rem, 4rem + 9vw, 11.089rem)` — a viewport-dependent value (86px at the small
end, 177px at the large end). The hero today is `86.112px` (`text-display-4`, confirmed
live). A naive gate that reads the token string and compares cannot — `clamp()` is not a
number. A gate that resolves the token's *computed* value at the test viewport works, BUT
the floor then SLIDES with viewport: at a 1440 desktop the computed mega may be ~127px
while a `text-display-4` hero at the same viewport is ~86px (RED, good), but the spec must
specify the viewport at which the comparison is made or the gate is under-defined (and at a
narrow viewport, mega's lower clamp bound 86px could equal a mid-rung, flapping the gate).
The born-RED claim is TRUE (86 < mega at every viewport because the hero uses display-4's
own smaller clamp), but the gate's COMPARISON mechanism is unspecified.
**Fix.** In H.W8 §Hard-gate, specify the gate resolves BOTH the hero computed font-size AND
`--type-display-mega`'s computed value at a FIXED named viewport (e.g. desktop 1440, the
visual-lock desktop width) and asserts hero ≥ mega-computed THERE; OR (cleaner, tracks the
ladder) assert the hero element carries the literal class `text-display-mega`/`-hero` (a
static-resolvable rung-name check) rather than a numeric floor. The latter is the
`proof:phi-leaf-zero` positive-clause shape already and is flake-free.

---

## MED

### M-1 (MED) — `proof:visual-lock` baseline robustness across CI runners is asserted but the masking strategy is under-specified for the live-content scenes
**Location.** H.W8 §S2 (`H.W8.md:31`), §Design-decisions (`H.W8.md:68`).
**Defect.** The spec correctly scopes to NAMED REGIONS (not full-page) and measure-first
tolerance from 3 identical runs — good anti-AA discipline. But the named regions it lists
(controls pane, hero, ribbon, easing editor) include scenes whose CONTENT is a perpetual
animation or a live WebGL canvas (amiga `<canvas>`, cube `AnimationGroup`, the hero
`.typing-dots`, the easing curve). A pixel baseline over a region that contains a running
rAF animation will NEVER be stable across runs — the 3-identical-runs anti-flake measure
will fail to converge for exactly the regions H most wants to lock, OR the tolerance will
be set so loose it stops biting. The spec does not say to freeze animations (PRM, or a
deterministic clock/seek to t=0) before capture, nor to MASK the live-canvas/animated
sub-regions.
**Fix.** Add to §S2: before each capture, force `prefers-reduced-motion` (the demo honors
it post-C.W3) AND seek the scene FSM to a deterministic frame (the H.W1 `serialize/hydrate`
seam makes this possible), OR mask the animated sub-rects (canvas, typing-dots, the moving
curve traveller) from the diff. State that the visual-lock locks LAYOUT/COLOR/TYPE regions,
not in-flight animation frames (those are `proof:motion-liveness`'s job).

### M-2 (MED) — `proof:manifest-sourced` "every scenes.ts id appears in SCENES" is ill-defined for `home` (which has no `id` in the `scenes[]` array)
**Location.** H.W8 §S1 (`H.W8.md:29`); a-gate-blindspots I-1 (`:106-109`).
**Defect.** Live-verified: `demo/app/scenes.ts` exports `homeScene` SEPARATELY
(`HOME_SCENE_ID = "home"`, `homeScene` object) and the `scenes[]` array contains only the
8 non-home ids (cube, amiga, square, easing, spring, sequence, motion-path,
starting-style). The runtime `SCENES` manifest (`demo-driver.mjs:40`) includes `home` as a
key. So the count is "8 array ids + 1 home = 9 scenes; manifest has 6 (incl. home)" — the
3 drifted are the 3 new array ids. A gate that naively iterates `scenes[]` will MISS home
(and could falsely flag the manifest's `home` key as stale, since `home` is not in the
`scenes[]` array). The spec's "9 vs 6" framing is right only if the gate unions
`homeScene.id` with `scenes[].map(s=>s.id)`.
**Fix.** In §S1, state the gate's source set is `[homeScene.id, ...scenes.map(s=>s.id)]`
(the union), so `home` is neither missing nor stale-flagged. Note the count is 8 array ids
+ home; the drift is exactly the 3 new array ids (sequence/motion-path/starting-style).

### M-3 (MED) — `proof:scene-parity` interactivity clause has a latent contradiction with the `square` KILL-candidate verdict it depends on
**Location.** H.W8 §S4 I-7 (`H.W8.md:35,49`); depends on `a-modes-pertinence` verdict +
H.W5 §S4 (`H.md:380` square = "KILL-candidate else drag").
**Defect.** I-7 correctly gates AFTER the pertinence verdict, but H.W5 leaves `square` as a
conditional ("KILL-candidate else drag + SpringProgress"). If the pertinence verdict is not
RESOLVED before H.W8 authors the gate, `proof:scene-parity` cannot know whether to require
`square` interactivity or assert `square` is absent. The gate is correctly sequenced but
the verdict it gates on is itself still conditional in the sibling wave — a circular
"decide later" that the prompt's chronic discipline (no perpetual punt) frowns on.
**Fix.** H.W8 §S4 should cite the RESOLVED survivor list (not "after the verdict" as an
open variable). Pin the square decision in H.W5's §Design-decisions to a hard KEEP-or-KILL
before H.W8's gate is authored, so `proof:scene-parity`'s survivor set is a constant.

### M-4 (MED) — the visual-lock is wired into `demo-smoke` but `proof:all` runs `demo-smoke` only under `KF_REQUIRE_BROWSER=1` — the "LIT in the dev loop" claim is not delivered by the wiring described
**Location.** H.W8 §Goal + §Design-decisions (`H.W8.md:25,71`: "the browser gates become
LIT in the dev loop (not env-dark) — `proof:visual-lock` wired into the browser CI job");
verified `proof-demo-usability.mjs:94` `REQUIRE_BROWSER`, `proof:all` (package.json:79)
does NOT include `demo-smoke`/`occlusion`/`demo-usability` at all.
**Defect.** The spec says the visual-lock will be LIT "in the dev loop, not env-dark," but
the mechanism it names — "wired into the browser CI job (`demo-smoke`)" — is precisely the
env-dark path: `demo-smoke`/`occlusion`/`demo-usability` are NOT in the `proof:all` chain
(verified) and SKIP without `KF_REQUIRE_BROWSER=1` + a built `dist/gh-pages`. Wiring
visual-lock into the same CI-only browser job reproduces the exact "the loop agents iterate
against never renders the demo" failure mode a-changes-vs-plan §3.3 diagnoses. The wave
diagnoses the dark-by-default disease and then prescribes the same dark job.
**Fix.** H.W8 §S2 must state HOW the visual-lock becomes loop-visible: either add the
browser gates (visual-lock + demo-smoke) to a NEW `proof:browser` script that `proof:all`
invokes when a built demo is present (auto-build + run, not skip-silent), or commit to the
honest position that it is CI-gated and drop the "LIT in the dev loop" claim. The current
text claims a property the named wiring does not provide.

### M-5 (MED) — the gate set is INCOMPLETE for D14 (refined-specular-where-glass-kept) and partially for D5-popover (D9) — not every D1–D14 defect has a regression gate
**Location.** charge = "is the gate set COMPLETE for D1-D14". H.W8 §S5 claims "audited
complete."
**Defect.** Walking D1–D14: D1 (visual-lock + one-column lock ✓), D2 (cartoon-is-panel-depth
✓), D3 (visual-lock + easing-canvas-bounded ✓), D4 (ribbon-width lock — but see H-3), D5
(dock-morph-settled HANDOFF ✓), D6 (motion-liveness ✓), D7 (hero-rung/phi-leaf-zero ✓), D8
(scene-parity icon ✓), D9 (popover-opens — owned by H.W1 `proof:dock-popover-opens`, but
H.W8's "audited complete" §S5 does NOT list it; it folds it confusingly into dock-live —
see H-1), D10 (mobile-single-page ✓), D11 (scene-parity interactivity ✓), D12 (FSM
`proof:scene-machine-irrefragable` — H.W1, not re-locked by H.W8's visual axis, acceptable),
**D13 (springy drawer — `proof:drawer-spring` H.W7, ✓), D14 (refined-specular-where-glass-
kept — the `useSpecularPointer` `--mouse-x` writer): `proof:no-orphan-specular` (H.W2)
covers "no orphan track OR a `--mouse-x` writer present" but there is NO gate that asserts
the writer ACTUALLY MOVES the specular on pointermove** (the dual of motion-liveness for
the deliberately-retained glass). So D14's "wired catch-light" can regress to a present-
but-dead writer and no gate bites.
**Fix.** H.W8 §S5 should add D14 to the audited-complete table with an explicit
interaction probe (the visual-lock hover-state screenshot at two cursor positions differs
in the specular region for any retained-glass panel), and explicitly list D9 under H.W1's
`proof:dock-popover-opens` rather than folding it into the dock HANDOFF gate.

---

## LOW / NIT

### L-1 (LOW) — `proof:motion-liveness` ≥5-rAF-frame opacity-delta is defeatable by a slow-but-static near-zero animation; the min-opacity floor is the real bite, not "changes"
**Location.** H.W8 §Hard-gate `proof:motion-liveness` (`H.W8.md:48`); H.W6 `proof:typing-dots`
min-opacity≥0.15 (`H.md:392`).
**Defect.** "sampled opacity/transform CHANGES across ≥5 rAF frames" — a workaround that
satisfies "changes" while still looking broken is a dot oscillating 0.0→0.02 (technically
changes, visually dead). The chronic-closure discipline forbids workaround-satisfiable
gates. The H.W6 min-opacity≥0.15 floor is the clause that actually prevents the
vanishing-dots D6 regression; H.W8's "changes" framing is the weaker of the two.
**Fix.** H.W8 §Hard-gate should state `proof:motion-liveness` asserts a MEASURED amplitude
(peak-to-trough opacity/transform delta ≥ a measure-first floor) AND a min-floor, not bare
"changes." Reference H.W6's ≥0.15 as the dots' instance of the floor.

### L-2 (LOW) — `proof:precept-sweep` bundles `proof:scene-parity` which "binds AFTER the pertinence verdict" — a spine-bundle composing a not-yet-bindable gate
**Location.** H.W8 §S5 (`H.W8.md:37`).
**Defect.** S5 composes `proof:scene-parity` into the always-on spine bundle, but I-7 says
scene-parity binds only after the modes-pertinence verdict (M-3). If precept-sweep is meant
to be green throughout H, bundling a conditionally-bindable gate into it creates an ordering
hazard (precept-sweep can't be green until pertinence resolves).
**Fix.** State precept-sweep's scene-parity member is the ICON half (always bindable post-I-1)
and the interactivity half joins only after the pertinence verdict, OR sequence
precept-sweep to land after H.W5.

### L-3 (NIT) — `proof:no-route-storm` born-RED anchor is real but the live home route redirect should be cited as the evidence
**Location.** H.W1 §Hard-gate `proof:no-route-storm` (`H.md:327`); cross-ref for H.W8's
visual-lock home capture.
**Observation (supporting, not a defect).** Live-confirmed the route storm: navigating to
`#/` redirected autonomously to `#/easing?anim=Easing+Preview` then to `#/?anim=Rotations`
within the session — the home hero could not be measured at a stable `#/`. This is good
evidence H.W1's gate born-RED is real, AND a feasibility note for H.W8: `proof:visual-lock`
cannot capture a stable "home" baseline until H.W1's FSM lands (the DAG already orders
H.W8 last, so this is satisfied — worth a one-line cross-ref in H.W8 §S2 that the home
capture depends on the FSM resting, mirroring the H.W3 settle-gate note at `H.md:348`).

---

## What is SOUND (do not manufacture findings here)

- **The two ROOT diagnoses are TRUE and live-confirmed.** ROOT-A (zero pixel baseline):
  `grep pixelmatch|toMatchSnapshot scripts/ test/ package.json` = 0. ROOT-B (manifest
  drift): `demo-driver.mjs` 6 keys vs 8 `scenes[]` ids + home = the 3 new scenes unseen.
- **Every cited TEMPLATE exists as described.** clause-8c (`proof-idioms.mjs:545-580`),
  the occlusion stale-guard (`occlusion-gate.mjs:347-353` exits 1 if a PENDING allowance
  passes), the `square/mobile` allowance (`occlusion-gate.mjs:91-94`), the LISTENER_ALLOWLIST
  stale-guard (`proof-brittleness.mjs:75-77,422-430`), the clause-2 hero `getComputedStyle`
  probe (`proof-demo-usability.mjs:200-237`), `KF_REQUIRE_BROWSER`/`skipOrFail`
  (`proof-demo-usability.mjs:94-104`), `serveDist` (`demo-driver.mjs:106`), `capture.mjs`
  screenshot matrix. The "one-line extension, no new god-script" claim is FEASIBLE.
- **Every glass-ui API the gates assert EXISTS in the installed 3.4.0.**
  `--shadow-cartoon-md` resolves (`tokens.css:476`, live `-4px 3px 1px color-mix…`);
  `surface="cartoon"` is a real Card prop (`Card.vue.d.ts:22` `CardSurface="glass"|"cartoon"`);
  `--spring-dock` = `linear(0, 0.10932…)` (live, the +18.5% pre-AW.W2 register, exactly the
  born-RED anchor); `cartoon-surface` `@utility` (`cards.css:33`); `keepOpen`/`release` exist
  on `useDockState`/`DockContext`/`GlassDock` (NOT on `DockDropdownTrigger`, which is
  `DropdownMenuTriggerProps & {type,class}` — a note for H.W1, see caveat below). No gate
  assumes a non-existent API.
- **The born-RED anchors are genuine.** Live: hero `text-display-4` = 86.112px < mega tier;
  7 `.glass-specular-track` on cube + 1 `.cartoon-surface` (the panels are un-swapped);
  mobile 390×844 crushes the cube to 14×446px (D10 confirmed); `--spring-dock` is the bouncy
  register. `proof:manifest-sourced` and the spring-token half of the dock HANDOFF gate are
  honestly born-RED today, independent of the fix waves — as the §Mandate-bar claims.
- **The chronic-closure meta-gate ARCHITECTURE is sound** (resolve-or-red over a committed
  table, same shape as clause-1 token-resolution + the stale-guards). It is blocked only by
  B-1 (phantom file) and B-2 (dangling name) — both are doc-edit fixes, not design flaws.

**Caveat for H.W1 (out of my lane, flagged for completeness).** `DockDropdownTrigger`'s
declared props are `DropdownMenuTriggerProps & {type,class}` — it does NOT expose
`keepOpen`/`release`/`v-model:open`. The dockContext doc (`dockContext.d.ts`) records that
`registerPopover`/`closeOtherPopovers` were RETIRED (J.W3.B) and "hover-driven dock popovers
compose `<HoverPopover keep-dock-open>`." H.W1 §S5's plan to "bind `v-model:open` → dock
`keepOpen`/`release`" on the DropdownMenu trigger may not match the installed 3.4.0 API
shape (the held-state is on the context/composable, and popovers are HoverCard-driven).
This is H.W1's feasibility risk, not H.W8's, but it bears on whether `proof:dock-popover-opens`
(H.W1) is closeable kf-side as the D9 SYSTEM gate — verify the trigger API before authorizing.

---

## inv ε ledger

Every claim anchored to a `file:line` (gate scripts, node_modules `.d.ts`/`.css`,
H-tranche docs) or a live observation against `localhost:5173` (hero 86.112px;
`--spring-dock: linear(0, 0.10932…)`; cube 14×446px @ 390×844; 7 specular tracks + 1
cartoon-surface; `#/`→`#/easing` route redirect; manifest 6 vs scenes[] 8 + home).
node_modules verified: `pixelmatch`/`pngjs` ABSENT; `--shadow-cartoon-md`/`surface="cartoon"`/
`--spring-dock`/`cartoon-surface`/`keepOpen` PRESENT; `H/FINAL.md` ABSENT.
