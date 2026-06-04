# Tranche C — keyframes.js: the close made honest · the design system made true · the engine dogfooded

C is keyframes.js' third tranche. B turned the lens on the demo and the
engine's debt and shipped real, gated work — the prod build repaired, the
four blank scenes fixed, the engine transposed, inv γ/δ wired into CI. But a
deep 6-lane re-audit of B's plan and changes (the `audit/` evidence) finds
that **B's close OVERCLAIMED**: several gates B's FINAL.md asserted MET were
not actually met, the every-page capture harness B itself authored was never
checked in, and the headline design-system migration was deferred while its
wave was marked done. C's first duty is integrity — make every B-asserted
gate TRUE. Its second is the deferred headline: the demo adopts the glass-ui
φ-ladder and stops forking the design language. Its third is the gestalt the
shop-window has been missing — the demo **dogfoods its own engine** (the
reduced-motion path it ships is honored nowhere in the demo; seven scenes
hand-roll the rAF loops `NumericAnimation`/`SpringProgress`/`Timeline`
already are).

C is in DEVELOPMENT now. The audits (W0) are RUN — the evidence is on disk
under `audit/` (the 6-lane B-implementation audit `plan-findings.txt`, the
6-lens demo-design inventory `design-findings.txt`, and the lead's
`grounding.txt` cross-check). W1-W5 are authored-now-run-later wave specs;
the implementation phase opens only on explicit user authorization. No
engine or demo source is written in development.

## § Thesis

B's headline — "the demo made true, the engine's debt transposed, CI that
cannot ship a blank app" — is REAL where it counts: `proof:boundary` is
widened and green, the engine transposition is a genuine net-deletion (−3
modules, −16 TODOs, the WAAPI css-twin gate is *correct* not a regression),
the prod build paints, the four blank scenes render, inv γ holds. The
re-audit confirms all of that as the model.

But the re-audit also catalogues, with file:line evidence, a set of
**asserted-not-met gates** — the exact "a green check that means less than it
says" class B was created to kill, now turned on B's own close:

1. **The a11y landmark gate is broken by its own fix.** B.W5 wrapped the
   shell in `<main class="contents">` (`EditorShell.vue:36`) to close
   lighthouse `landmark-one-main`, and FINAL.md marks it MET. But
   `display:contents` removes the element's box AND its implicit landmark
   role from the accessibility tree — so `landmark-one-main` **still fails on
   every page** (`design-findings.txt` a11y-responsive [CRITICAL];
   `plan-findings.txt` deferred-ledger [HIGH]). The gate was asserted, not
   met.
2. **inv δ was silently downgraded from the spec.** B.W3's spec demands "zero
   dock-over-content overlap"; the shipped `occlusion-gate.mjs` made the
   dock-overlap check an ADVISORY (logged, non-failing) and never exercises
   the controls-OPEN state — the one state where docks genuinely occlude
   content (`plan-findings.txt` plan-fidelity [HIGH] ×2). inv δ green is
   narrower than inv δ claimed.
3. **π ran at the screenshot floor, not full.** W7's spec swore π bound at
   FULL (≥5-frame animation-timing reduced-motion probe + contrast-vs-
   background); the close shipped 18 screenshots and an occlusion sweep — the
   two FULL-only clauses were never run (`plan-findings.txt` precept-adherence
   [HIGH], plan-fidelity [HIGH]).
4. **The capture harness the edict requires was never checked in.** B
   authored the before/after-every-page edict into precepts and ran it — but
   the harness lives in `/tmp/kf-audit`, NOT the repo, so "re-runs
   identically at open and close" is unsatisfiable (`plan-findings.txt`
   precept-adherence [CRITICAL]).
5. **The LoAF observer is a 1-consumer speculative surface.** B shipped it
   claiming its second consumer is the >50ms-trace gate — but that gate is
   STILL a stub (`bench/playwright.bench.ts`, `expect(true).toBe(true)`), so
   the observer violates the overfitting precept (≥2 consumers) and the
   chronic was re-narrated, not closed (`plan-findings.txt` deferred-ledger
   [HIGH], precept-adherence [HIGH]).
6. **inv β is green-but-papered.** A clean `npm ci` creates a DANGLING
   `../glass-ui` symlink, not the "clean skip" FINAL.md states; W6.md and
   FINAL.md contradict on which disposition shipped (`plan-findings.txt`
   boundary-ci [HIGH] ×2).
7. **W5's own § Hard gate was deferred while the wave was marked done.** W5
   demanded "zero raw display rungs, A11y=100, SEO≥90"; the φ-ladder
   migration was deferred and a11y was not closed, yet W5 is `**done**` in
   PROGRESS (`plan-findings.txt` plan-fidelity [HIGH]).

These are not failures of the work that shipped — they are failures of the
CLAIMS the close made about it. The constellation's standard is
green-means-green; C makes the close mean what it says.

On top of integrity, C lands the two genuinely-deferred bodies of work the
re-audit confirms are real and owned (not phantom):

- **The design system made true** — the demo forks glass-ui's φ type-ladder
  wholesale (267 raw Tailwind rungs across 8 sizes; 44 `.instrument-serif`
  alias sites; `--font-display` is *never defined* so every display rung
  silently falls to Georgia — `design-findings.txt` typography-ladder [HIGH]
  ×3). It hand-rolls a cartoon shadow, a verbatim `.demo-box` fork, and an
  unscoped global `.glass-card` override that leaks track-vars app-wide. And
  three load-bearing CSS custom properties the demo's own animations depend on
  (`--dock-menubar-reserve`, `--spring-snappy`) are *undefined*, so the
  controls-pane slide is broken (`design-findings.txt` layout-rhythm [HIGH]).
- **The engine dogfooded** — the demo is keyframes.js' shop-window, yet the
  reduced-motion path the engine ships is honored NOWHERE in the demo
  (`design-findings.txt` motion-dogfood [CRITICAL]); `AnimationVisualizer`
  re-implements `SmoothProgress` by hand, the spring demo hand-rolls the loop
  `RAFPlayback.drive` is, the easing demo hand-rolls a ping-pong that is
  `NumericAnimation(alternate)` verbatim, and seven demo files carry raw
  `requestAnimationFrame` against one light-engine use. Dogfooding the engine
  is both a better showcase AND the ≥2nd consumer several light surfaces lack.

## § Goal criterion

C succeeds when the close is honest, the design language is unforked, and the
shop-window runs on its own engine:

- **Every B-asserted gate is TRUE, gated, and biting.** `landmark-one-main`
  passes on every page with a REAL `<main>` (not `display:contents`); the
  occlusion gate's dock-over-content check is HARD (not advisory) and runs the
  controls-OPEN state; π binds at FULL (the animation-timing reduced-motion
  probe renders the final frame, contrast measured) and the capture harness is
  CHECKED IN so it re-runs identically; the LoAF observer earns its second
  consumer (the >50ms-trace gate lands for real) or is cut; inv β is genuinely
  reconciled (or stated honestly with the dangling-symlink reality fixed); the
  lighthouse A11y score gate (=100) and SEO floor are wired into CI as W5
  promised.
- **The demo speaks ONE design language.** glass-ui's `.text-display-*` /
  `.text-heading` / `.text-body` / `.text-admin-label` φ-ladder is adopted;
  the 267 raw rungs and the `.instrument-serif` alias are retired; ONE display
  serif is formalized in `--font-display`; the cartoon-shadow, the
  `.demo-box` fork, and the EasingTarget global leak consume canonical tokens;
  the undefined `--dock-menubar-reserve` / `--spring-snappy` / vertical-bias
  custom properties are defined or derived. No raw rung, no off-token literal,
  no dead CSS survives a consumption sweep.
- **The demo dogfoods the engine.** The seven hand-rolled rAF loops are
  transposed onto `NumericAnimation` / `SpringProgress` / `Timeline` /
  `RAFPlayback`; reduced-motion is honored in the demo (the same gate the
  engine ships); the cross-scene swap is restored — driven by the engine's own
  reduced-motion-aware primitive, not a bare `<Transition>` that re-breaks
  async loading — and the 18 lines of dead `.scene-*` CSS are removed.
- **The engine's residual contract-edges are transposed.** `RAFPlayback.drive`
  gains the generation guard `loop` has (or the two fold into one guarded
  core); `tick`/`tickDt` collapse to ONE canonical `tickDt(ms)` step across
  every stepper; `setColorSpace`/`setHueMethod` join the fail-explicit
  `parseOption` seam; the default easing carries a `cubic-bezier()` css-twin so
  the *default* animation surface regains a faithful compositor path. Net
  deletion, no alias.
- **The gates are hardened.** `proof:boundary`'s residual false-negative
  classes close (bare side-effect import, subpath specifier, direct
  `export const`); `rolldown` is declared (it is an undeclared load-bearing
  dep of the gate); the CI demo gate pins glass-ui instead of cloning a moving
  default branch; the dts byte-check asserts the 15 symbols FINAL implied.

## § Completion criterion

The development half (W0) completes when the audit evidence is on disk (it
is: `audit/plan-findings.txt`, `audit/design-findings.txt`,
`audit/grounding.txt`, and the per-lane reports under `audit/lanes/`), the
before/after capture harness is checked in (the precept-adherence CRITICAL),
the deferred ledger is complete with real owners, and the full P1+P2+P3
prompt recap confirms coverage.

The implementation half (W1-W5) completes when every wave's hard gate
verifies: the seven asserted-not-met gates are made true and biting; the
φ-ladder is adopted with a clean consumption sweep; the demo dogfoods the
engine with reduced-motion honored; the engine residuals are transposed; the
AFTER capture + DELTA show no unintended regression; FINAL.md + the changeset
cut.

## § Inherited invariants

C inherits A's + B's invariants and the constellation precepts:

- **inv α — the boundary is gated.** C *hardens* it: the residual
  false-negative classes the boundary-ci lane found (bare side-effect import,
  `@mkbabb/value.js/subpath` specifier, direct `export const`/`function`, the
  rename-fragile HEAVY allowlist) close, and `rolldown` is declared so the
  gate cannot vanish.
- **inv β — the library build is glass-ui-free.** C *makes it honest*: a
  clean `npm ci` must not leave a dangling `../glass-ui` symlink; either the
  manifest drops the `file:` spec for a published-version optional, or the
  reality is stated exactly. W6.md and FINAL.md are reconciled to the shipped
  artefact.
- **inv γ — the demo cannot ship blank.** Unchanged, holds.
- **inv δ — no page occludes on any viewport.** C *makes it match its spec*:
  the dock-over-content check becomes HARD (not advisory) and runs the
  controls-OPEN state.

C introduces:

- **inv ε — the close cannot overclaim.** Every gate FINAL.md asserts MET is
  re-verified to actually pass by a checked-in, re-runnable instrument before
  the wave is marked done; a gate that is deferred is marked deferred, not
  met. (The integrity invariant the re-audit's existence proves is needed.)
- **inv ζ — the shop-window runs on its own engine.** The demo carries no
  hand-rolled rAF loop that a shipped light engine
  (`NumericAnimation`/`SpringProgress`/`Timeline`/`RAFPlayback`) already is;
  reduced-motion is honored in the demo. A grep gate counts demo
  `requestAnimationFrame` against the justified exceptions (the Three.js
  renderer).

## § Resolved design decisions

1. **Integrity first.** C.W1 makes B's asserted-not-met gates true BEFORE the
   design/dogfood waves, because a tranche that adds polish on top of an
   overclaimed close compounds the debt. The a11y landmark, inv δ, π-full,
   the harness check-in, the LoAF 2nd consumer, and inv β are W1.
2. **One display serif, formalized in the token.** RESOLVED: Instrument Serif
   is the demo's deliberate identity face — formalize it as
   `--font-display: "Instrument Serif"` (currently UNDEFINED, so display rungs
   fall to Georgia) and retire the `.instrument-serif` alias for the semantic
   `.text-display-*` ladder. A token decision, not a per-surface override.
3. **The scene-swap is restored by dogfooding, not by re-adding a bare
   `<Transition>`.** RESOLVED: B removed the `<Transition mode=out-in>`
   because it broke async scene loading. C restores the cross-scene swap by
   driving the transition with the engine's own reduced-motion-aware
   `Timeline`/`SpringProgress` (a CSS class toggle on a real element, animated
   by the engine) — which both fixes the UX regression AND dogfoods the engine
   AND honors reduced-motion, three findings closed by one transposition.
4. **The default easing gets a css-twin.** RESOLVED: ship
   `defaultOptions.timingFunction = { fn: easeInOutCubic, css: "cubic-bezier(0.645,0.045,0.355,1)" }`
   so the default-eased animation surface regains a faithful WAAPI compositor
   path — the single-constant perf lever the engine-fidelity lane named. (The
   bezier is the standard easeInOutCubic approximation; C verifies the
   sampled-curve fidelity before shipping it.)
5. **Glass-ui-owned defects route outward (unchanged).** The glass-ui
   `LabeledField` label-association failure (the root cause of the lighthouse
   `label` fails) is glass-ui-owned — a third adoption ask, never patched in
   the demo (inv-16).

## § Wave table

| Wave | Title | Phase | Closes-on (evidence) |
|---|---|---|---|
| **C.W0** | Audit-fold + harness check-in + B-reconciliation | DEV (now) | This C.md + W1-W5 specs + PROGRESS; the 6-lane plan-audit + 6-lens design-audit on disk; the before/after capture harness CHECKED IN to `audit/`; the deferred ledger complete (real owners); the full P1+P2+P3 recap. |
| **C.W1** | The close made honest (inv ε) | IMPL | The 7 asserted-not-met gates made TRUE + biting: real `<main>` (landmark-one-main passes); occlusion dock-over-content HARD + controls-open state; π at FULL (animation-timing probe + contrast); harness re-runs from the repo; the >50ms-trace gate lands as the LoAF observer's 2nd consumer (or the observer is cut); inv β reconciled honestly; A11y=100 + SEO CI gate wired. |
| **C.W2** | The design system made true (φ-ladder + serif + tokens) | IMPL | glass-ui `.text-display-*`/`.text-heading`/`.text-body`/`.text-admin-label` adopted; 267 raw rungs + 44 `.instrument-serif` retired; `--font-display` formalized; cartoon-shadow → `.cartoon-surface`, SquareScene → `.demo-box`/token, EasingTarget global leak scoped; `--dock-menubar-reserve`/`--spring-snappy`/vertical-bias defined; consumption sweep clean. |
| **C.W3** | The demo dogfoods the engine (inv ζ) | IMPL | The 7 hand-rolled rAF loops transposed onto the light engines; reduced-motion honored in the demo; the cross-scene swap restored via the engine (dead `.scene-*` CSS removed); `AnimationVisualizer`/spring/easing demos run on `SmoothProgress`/`SpringProgress`/`NumericAnimation`. |
| **C.W4** | Engine residuals transposed (gestalt) | IMPL | `drive` gains the generation guard (or `drive`+`loop` fold to one guarded core); ONE canonical `tickDt(ms)` step across every stepper; `setColorSpace`/`setHueMethod` fail-explicit; default-easing css-twin (faithful default compositor path); `Timeline._advance` dedup; the boundary-ci hardening (bare-import/subpath/`export const` classes, rolldown declared, glass-ui pin). Net deletion, no alias. |
| **C.W5** | Close (π full + DELTA + release) | IMPL (LAST) | AFTER capture (the checked-in harness) + per-page DELTA against the W1-fixed surface; π at full RECORDED (not floor); ι + overfitting (the LoAF observer now ≥2-consumer or cut); FINAL.md reconciles B's overclaims as inv-ε's first application; changeset (the B 3.1.0 + C's surface). |

**Wave count: 6 (C.W0–C.W5)** — 1 DEVELOPMENT (W0, run now) + 5 IMPLEMENTATION.

DAG — W0 first (done). W1 (integrity) is the foundation: the gates must be
true before the design/dogfood waves build on them, and W1's
real-`<main>` + occlusion-controls-open touch the same shell W2/W3 do, so W1
precedes them. W2 (demo CSS/tokens) and W4 (engine `src/`) are file-disjoint
and parallelize. W3 (demo scene/composable logic) overlaps W2 in the demo but
is logic-vs-style separable. W5 closes.

## § Deferred + chronically-deferred fold (zero perpetual punts)

Every B deferral + every re-audit finding gets a C wave, owner, trigger.
(Full per-item: `audit/plan-findings.txt` + `audit/design-findings.txt`.)

| Item | Source | C disposition |
|---|---|---|
| **CHRONIC: the >50ms Playwright trace gate** (stub since before A) | deferred-ledger [HIGH] | SHIP C.W1 — lands as the LoAF observer's real second consumer (closes BOTH chronics as one perf-evidence subsystem, the gestalt B claimed but did not do). |
| **CHRONIC: φ-ladder migration + dual-serif + cartoon-shadow** | A demo-polish BOOK → B.W5 deferred | SHIP C.W2 — the demo-polish home, executed not deferred. |
| **a11y landmark broken by display:contents** | a11y-responsive [CRITICAL] | SHIP C.W1 — real `<main>`. |
| **a11y controls-OPEN never audited (craters to 75-79)** | a11y-responsive [CRITICAL] | SHIP C.W1 — the open-panel state is audited + gated. |
| **glass-ui `LabeledField` no label-association** | a11y-responsive [CRITICAL] | BOOK OUTWARD (inv-16) — ASK-3 to glass-ui; the root cause of the `label`/`aria-input-field-name` fails. |
| **inv δ advisory + controls-open untested** | plan-fidelity [HIGH] | SHIP C.W1 — HARD + controls-open. |
| **π at floor not full; harness not checked in** | precept-adherence [CRITICAL]+[HIGH] | SHIP C.W0 (harness check-in) + C.W1/W5 (π full). |
| **LoAF observer 1-consumer (overfitting)** | precept-adherence [HIGH] | SHIP C.W1 — earns its 2nd consumer, or is cut. |
| **inv β dangling symlink; W6/FINAL contradict** | boundary-ci [HIGH] | SHIP C.W1 — reconciled to the artefact. |
| **dead scene-swap CSS (App.vue:407-421)** | layout-rhythm [HIGH] | SHIP C.W3 — removed + swap restored by dogfooding. |
| **reduced-motion honored nowhere in demo** | motion-dogfood [CRITICAL] | SHIP C.W3 — inv ζ. |
| **7 hand-rolled rAF vs 1 light-engine use** | motion-dogfood [HIGH] ×3 | SHIP C.W3 — transposed (showcase + ≥2 consumers). |
| **undefined `--dock-menubar-reserve`/`--spring-snappy`/vertical-bias** | layout-rhythm [HIGH]+[MED] | SHIP C.W2 — defined/derived (broken animations fixed). |
| **EasingTarget unscoped global `.glass-card` leak** | color-token [MED] | SHIP C.W2 — scoped. |
| **`drive` no gen guard; tick/tickDt incoherence; setColorSpace/HueMethod bypass; default css-twin; Timeline._advance dup** | engine-fidelity [MED]×3/[LOW]×2 | SHIP C.W4 — transposed. |
| **boundary false-negatives; rolldown undeclared; glass-ui unpinned CI clone; dts byte-check** | boundary-ci [LOW]×5/[MED]×2 | SHIP C.W4 — hardened. |
| **dev.sh/deploy.sh library-shape adoption** (twice-booked A→B) | deferred-ledger [MED] | BOOK C.W4 — land or KILL-with-rationale (no third punt). |
| **ScrollTimeline-native** | B KILL | RECORD permanent (KILL correct, well-reasoned). |
| **Worker/OffscreenCanvas/Atomics** | A/B archive | RECORD permanent-archive (no consumer). |
| **B 3.1.0 release (changeset cut, unpublished)** | B.W7 | C.W5 — folded into C's release (the publish leg stays user-domain). |

## § Prompt recap — every request addressed (P1 + P2 + P3)

**P1 (tranche A)** — ADDRESSED, verified (3.0.0 published, provenance,
RAFPlayback PRM gate, green CI). RECORD as DONE.

**P2 (tranche B engagement)** — the development request + its implementation.
Re-verified against the re-audit:
- update all deps → B.W1 ✓. 6-agent deep audit → B.W0 ✓ (and this re-audit is
  P3's). gestalt path / no-workaround / no-legacy → B.W2 ✓ (the engine
  transposition is the model; the re-audit confirms net-deletion, no alias).
  fold chronically-deferred + deferred → B did partially; **C completes it**
  (the LoAF/trace chronic + the φ-ladder were re-narrated/deferred, now
  SHIP'd). recap all prompts → this section. NOT-implementation → B honored
  for B's dev half. full lighthouse + best-practices of every page + every
  library facet → B.W0 ✓ + B.W4 prod re-measure ✓; **C closes the a11y/SEO
  score the lighthouse run flagged** (the gate B deferred). pull precepts +
  sync + before/after edict → B.W0 ✓ (edict committed `8ccf9f4`) — **but the
  harness was not checked in; C.W0 closes that**. remove loading screen +
  improve loading → B.W4 ✓ (real prod perf, FCP ~1s desktop). 6
  frontend-design agents → B.W0 ✓ + **P3's 6-lens re-inventory (this) folds
  into C.W2/W3**. perfected CI → B.W6 ✓ + **C.W1/W4 harden the residual gate
  classes**. audit every page desktop+mobile NO occlusion dock-perfected →
  B.W3 ✓ for the overflow/blank classes; **C.W1 makes the dock-over-content +
  controls-open the spec demanded HARD** (B made it advisory).
- The single highest-value P2 thread the re-audit re-opens: **"no occlusion,
  dock perfected, fully Playwright"** was claimed met but inv δ was advisory
  and never tested the controls-open state. C.W1 honors it for real.

**P3 (this engagement)** — a DEVELOPMENT engagement; deliverables are C's
waves: re-audit with 6 agents → DONE (the 6-lane B-audit). path forward /
recap / gestalt / no-workaround / no-legacy / architectural transpositions →
this C.md + C.W4. fold chronically-deferred + deferred → § fold above. recap
ALL prompts → this section. NOT-an-implementation-phase → honored (W0 is
audit + planning + the harness check-in; no engine/demo source). 6 frontend-
design agents inventory the demo → DONE (the 6-lens design audit
`design-findings.txt`); fixes route to C.W2 (design system) + C.W3 (dogfood)
+ C.W1 (a11y).

No request is dropped. C's defining move is that it audits its OWN
predecessor's CLAIMS, not just its code — and folds the overclaim corrections
into the plan as inv ε.

## § Critical files

```
DEVELOPMENT artefacts (W0 — written now):
  docs/tranches/C/C.md                          (this plan)
  docs/tranches/C/PROGRESS.md                   (status board)
  docs/tranches/C/waves/W{0..5}.md              (wave specs)
  docs/tranches/C/audit/
    plan-findings.txt   design-findings.txt      (6-lane + 6-lens, file:line)
    grounding.txt                                (lead cross-check)
    lanes/*.md                                   (per-lane full reports)
    harness/                                     (the checked-in capture harness — C.W0)

IMPLEMENTATION targets (W1-W5 — authored-now-run-later):
  demo/@/components/custom/editor-shell/EditorShell.vue   (C.W1 real <main>)
  scripts/occlusion-gate.mjs                              (C.W1 hard + controls-open)
  bench/playwright.bench.ts                               (C.W1 >50ms trace — LoAF 2nd consumer)
  .github/workflows/ci.yml                                (C.W1 a11y/SEO gate; C.W4 glass-ui pin)
  demo/@/styles/{style,utils}.css + EditorStartScreen.vue (C.W2 φ-ladder + --font-display)
  demo/**/*.vue (267 raw rungs)                            (C.W2 ladder migration)
  demo/app/App.vue + scenes/*                              (C.W3 dogfood + scene-swap)
  demo/.../AnimationVisualizer.vue, easing/, spring/       (C.W3 rAF → light engines)
  src/animation/{playback,smooth,spring,timeline,engine,constants}.ts (C.W4 residuals)
  scripts/proof-boundary.mjs + package.json                (C.W4 boundary hardening + rolldown)
```

## § Style discipline

Greenfield voice — keyframes.js is the product. C's distinguishing
discipline is the close-honesty checklist applied to its OWN predecessor: it
names B's overclaims with file:line and FOLDS the corrections, rather than
inheriting them silently. Em dashes unspaced. Every wave item carries
WHAT + WHY; goal + completion paired. C transposes (no workaround, no
legacy, no alias), folds every deferral with a real owner, and makes the
green check mean what it says (inv ε). C is keyframes making its close honest,
its design language whole, and its shop-window run on its own engine.
