# SKEPTIC-E r2 (TRUE-FABLE) — the value.js e2e oracle-fleet challenge

**Seat**: Lane E, r2 re-deployment, union-with-demarcation protocol.
**Charter**: challenge the presumption of TOTAL ABROGATION of the value.js e2e fleet (owner addendum 3 §1).

## G0-prime tree pins

| Tree | Path | Branch | HEAD |
|---|---|---|---|
| value.js (the fleet's home — ALL fleet evidence from here) | /Users/mkbabb/Programming/value.js | tranche-u | `db77dbd8` |
| keyframes-v-exec (canonical kf; not load-bearing for this lane) | /Users/mkbabb/Programming/keyframes-v-exec | master | `0dac636b` |
| parse-that (pinned, unread beyond HEAD) | /Users/mkbabb/Programming/parse-that | master | `ef10d5b` |

Owner corpus read (Phase 1): `OWNER-PROMPT-verbatim.md`, `OWNER-ADDENDUM-3-e2e-challenge-kf-pre4.md`.
NOT read in Phase 1: any skeptic-*/adjudication-*/FINAL-* file; the value.js V coordination inbox handoff/ingestion files (they mirror panel verdicts — contamination-adjacent, skipped).

---

# PHASE 1 — ANEW

## §1 Fleet catalog (my counts, reproduce with the greps given)

`find e2e -name "*.spec.ts" | wc -l` → **71 specs**; `find e2e -type f | wc -l` → **84 files**;
spec LOC `find e2e -name "*.spec.ts" -exec wc -l {} +` → **11,708**; non-spec support
(fixtures/helpers) → **1,697 LOC** (incl. `e2e/smoke/fixtures/` 7 files / 822 LOC,
`admin/fixtures/` 270 LOC). Total ≈ **13.4k LOC** — matches the owner's "~13k".
Test blocks: `grep -rE "^\s*(test|it)\(" e2e --include="*.spec.ts" | wc -l` → **157** (+26 `test.describe`).

Per-directory:

| Dir | Specs | LOC | Character |
|---|---|---|---|
| `e2e/smoke/` (root) | 13 | 1,962 | boot gate, censuses, a11y battery, WebGL substrate, reactivity |
| `e2e/smoke/oracles/` | 24 | 6,435 | the T/U design-epoch oracle slate (o1..o27, t31, readout-seam) |
| `e2e/smoke/admin/` (+flows) | 11 | 738 | admin census + a11y-authed + 6 API-verb flows |
| `e2e/smoke/flows/` | 8 | 422 | user flows: real POST/PATCH/DELETE/localStorage round-trips |
| `e2e/smoke/views/` | 4 | 520 | gradient (rich behavioral, 329), mix convergence, browse ×2 |
| `e2e/smoke/safari/` | 3 | 632 | the WebKit engine gate (S-22) |
| `e2e/smoke/mobile/` | 3 | 399 | Pixel-7 **Chromium emulation** boot/walk |
| `e2e/smoke/perf/` | 5 | 600 | frame budgets + o5-boot-pacing + o24-lcp-identity |

Largest single spec: `oracles/o18-contrast-census.spec.ts` — **1,214 LOC** (10.4% of the fleet).

## §2 Library-import census — the decisive structural fact

Grep over every import in `e2e/**`:
`grep -rhE "from ['\"]" e2e --include="*.ts" | grep -oE "from ['\"][^'\"]+['\"]" | sort | uniq -c`
→ **ZERO imports of the value.js library** (no `src/`, no `@mkbabb/value.js`, no dist). The only
non-fixture, non-playwright imports are **2 demo type imports** (`demo/@/lib/palette/types`).

**The fleet is not a value.js-library test asset at all.** All 71 specs drive the DEMO app
(vite dev server :8090 / built bundle :8091 — `playwright.config.ts:110-140`). Any question of
"e2e duplication vs the library unit suites" is structurally empty: they share no layer.

## §3 CI wiring — the fleet is ALREADY dead in CI

- **Current** (`db77dbd8`): `.github/workflows/ci.yml` (71 lines) has **two jobs: producer + api.
  ZERO playwright/e2e references** (`grep -n "playwright\|e2e" .github/workflows/*.yml` → empty).
  `package.json:68` keeps a manual `"test:e2e": "playwright test"`.
- **The orphaning commit**: `164343c1` (`feat(v4)!: value 4.0 producer surface … retire pre-v4
  src trees`, **2026-07-17**) collapsed ci.yml ~800→71 lines, dropping the e2e-smoke / e2e-safari /
  gh-pages+Lighthouse / boot-smoke jobs wholesale.
- **Terminal pre-v4 posture** (`git show 6bed451d:.github/workflows/ci.yml`): the ONLY hard e2e
  gate ever was `page-load.spec.ts` (42 LOC, "HARD gate", line 337). The full smoke project
  (hosting all 24 oracles), smoke-safari, and the perf/reactivity/mobile/admin slate all ran
  **`continue-on-error: true` (SOFT)** — lines 344-354, 454-456, 540-556. The oracle slate
  **never once hard-gated CI** from mint to orphaning (soft posture OWNED at
  `docs/tranches/U/audit/oracle/ci-teeth/SOFT-POSTURE.md:63` — it hosts 3 producer/GPU-gated reds).
- **value.js's own reformation already adjudicated this**: `docs/tranches/V/audit/REFORMATION-2026-07-16.md:62`
  (RF-3) brands the silent drop "**pruning theater ≠ dropping product coverage**";
  `docs/tranches/V/reformation/V-PRIME.md:110` (bracket B3) ratifies "**the journey subset + the
  11.7k-line e2e corpus pruning at W55** (owns the .github edit)"; `reformation/CARRY-LEDGER.md:29`
  carries W55 with "**CH-7: the real-GPU oracle RUNS**" and CH-4 (p75 LCP ≤2.5s).
  RF-29 (fresh adversary) records the fleet is "**e2e NOT source-broken by the v4 cut**" — it
  resolves, but no green run exists post-v4 (last e2e commit `42608ebe` 2026-07-13; demo churned
  through W42-45 since). Green-state: **UNKNOWN**.

## §4 Named-catch register (the KEEP-EARNED currency)

Real, named, on-disk-cited catches by the fleet:

| # | Catch | Oracle | Evidence |
|---|---|---|---|
| C1 | **The WebKit veil-forever** — dock reveal awaited ScrollTimeline `finished` promises that never resolve on WebKit; blob never mounted on WebKit-mobile; cured `d5b3e4d` | `safari/` (smoke-safari) | `docs/tranches/T/PROGRESS.md:212` ("the smoke-safari engine oracle caught it"); `T/audit/w2-close-artefacts.md:214`; `T/audit/pi/w2/w2-close-artefacts.md:26,69` |
| C2 | **The color-space dead-control bug** — reproduced deterministically, root-fixed (not hidden) | `color-space-switching.spec.ts` | `T/audit/w0-ci-diet-ledger.md` §3 ("root-fixed a real dead-control bug"); `playwright.config.ts:99-101` |
| C3 | **The one-shot release law** — the `both`-filled dock-land transform left every dock control forever "not stable"; 20 view-nav specs timed out; live-bisected; cured `eb6d9a6` | the fleet as instrument (view-nav specs) | `T/PROGRESS.md:212` |
| C4 | **2 born-RED a11y defects found by driving**: admin user-row expander bare `<div>` (WCAG 2.1.1) + un-announced thrown-error boundary → `ErrorBoundary.vue` `role=alert` | a11y-authed battery (U-F56) | `U/PROGRESS.md:121` ("2 born-RED defects cured"), commit `42608ebe` |
| C5 | smoke-safari's raison d'être class: iOS-Safari engine bugs Chromium emulation cannot reach (recursion-guard frame-294 stack-overflow; WebKit shader-compile divergence) | `safari/` | `playwright.config.ts` header; `E/FINAL.md:115` (D7 honored at engine layer) |

NOT catches (checked, rejected): the O-16 "dist clobber" and O-26 aurora and O-5 boot reds are
**armed `test.fail()` born-RED mints against defects already known at mint** (`U/FINAL.md:133`,
`U/DISPOSITION-LEDGER.md:71,123`) — they measured, never caught. O-26 **can never flip on the
headless runner** (SwiftShader forces the static placeholder — U-F15, `U/audit/registry.md:71`:
"an oracle whose cure-path is unmeasurable on its runner is mis-hosted"). Headless rAF/frame
numbers were confound-flagged as uninterpretable **three times** (U-F54 — `U/audit/w-visual/census.md:51`).
`reactivity-instant` has a flake-mitigation history (CHANGELOG.md:511 — two 200ms double-duty
timeouts widened; E-AUDIT-6 worker-contention median inflation 31→54ms) and no product catch.

## §5 Duplication vs the unit suites

- **vs library units**: structurally ZERO overlap — §2 (0 imports; post-v4 unit suite =
  `test/` 22 files / **3,823 LOC** / 246 blocks + api/test; the fleet cannot duplicate what it never
  touches). *(Corrected in Phase 2: my first pass double-counted root files via a glob overlap —
  `find test -name "*.test.ts" -exec cat {} + | wc -l` → 3,823.)*
- **vs demo units**: demo/test = 3 files / 682 LOC (aurora bracket/motion, export byte-exact) — no
  material overlap with the fleet.
- **Internal duplication**: already excised ONCE — the T.W0 ci-diet (`75cbd3ae`,
  `T/audit/w0-ci-diet-ledger.md` §3): −11 tautological tests / 10 files folded into the census
  walks, with the closing verdict "the remainder earns its existence." **But**: that audit predates
  roughly half the current fleet — the 24-spec / 6,435-LOC `oracles/` slate was minted at/after
  T.W0-5 and through U, and has never faced an earned-existence audit. There is ALSO precedent for
  wholesale abrogation: `afe102a6` (tranche B) abrogated a 16-spec suite to 3, and
  `docs/tranches/B/research/B-e2e-investigation.md:21` states the categorical critique that applies
  to the oracle slate today: geometry/appearance-as-oracle "encode[s] the *current* geometry as an
  oracle … they catch *all* layout change, not *unintended* change."

## §6 Run cost

From the named baseline run `28842102862` (`T/audit/w0-ci-diet-ledger.md` §1): page-load **17s**
(HARD) · full smoke **251s** · smoke-safari **733s** (the single biggest CI step) · post-diet
sharded wall-clock **~16-17 min** with e2e-safari the long pole. Local: `workers: 1` is forced for
the whole suite (`playwright.config.ts:86-106` — software-GL contention), so a full local run is
serial and long; smoke-perf additionally requires the built-bundle server (`serve-built.mjs`,
cold gh-pages build ≤180s). **Current CI run cost: $0 — it does not run at all** (§3).

## §7 Per-oracle verdict candidates

Legend: **KEEP-EARNED** requires a named catch (§4). **FOLD** = the truth survives, the file does
not (target named). **ABROGATE** = delete; any residual truth is noted. *(plan-KEEP)* marks specs
with no named catch whose survival is already ratified by value's own reformation (V-PRIME B3
journey subset) — adjudication may demote them; I mark my own leaning.

### Root smoke (13 specs, 1,962 LOC)
| Spec | LOC | Verdict |
|---|---|---|
| `page-load.spec.ts` | 42 | **KEEP-EARNED** — the sole-ever HARD gate; the inv-K-5/inv-N-1 cold-boot white-screen defeat class (the N.W2 renderer-death "white-screen-shaped failures everywhere" epoch) |
| `walk.spec.ts` | 113 | **KEEP-EARNED** (structural) — it IS the T.W0 anti-tautology fold product (10 files folded in); deleting it resurrects the census class |
| `color-space-switching.spec.ts` | 30 | **KEEP-EARNED** — catch C2 |
| a11y trio (`a11y-modality-support` 305 / `a11y-slider-operation` 94 / `a11y-web-modality` 154) | 553 | **KEEP-EARNED** — the U.W-A11Y battery, BR-1..BR-11 born-RED→GREEN; sibling of catch C4 |
| `url-color-precedence.spec.ts` | 120 | **FOLD** → one assertion inside `walk`/boot (hash-over-localStorage precedence) |
| `reactivity-instant.spec.ts` | 256 | **ABROGATE** as gate — host-CPU-coupled wall-clock, 2 flake mitigations, workers:1 quarantine, no product catch; demote to a local instrument if wanted |
| `dual-pane-1440.spec.ts` | 349 | **FOLD-INTO-UNIT/build-check** — CSS `@import`-order is a build-shape assertion, not a driven journey |
| WebGL quartet (`webgl-blob` 108 / `webgl-blob-idle` 88 / `webgl-atmosphere` 88 / `atmosphere-cold-load` 215) | 499 | **FOLD** → the CH-7 real-GPU annex + ONE minimal context-loss probe in the journey subset; headless SwiftShader is the confounded substrate (U-F54 ×3) |

### `oracles/` (24 specs, 6,435 LOC) — the contrived-mess epicenter
- **ABROGATE the design-census mass (~5.9k LOC)**: o7-card-census (466), o9-shadow-palette (263),
  o10-type-locks (345), o10d-display-voice (471), o11-header-gates (391), o12-blob-seat (242),
  o14-preview-truth (560), o15-dock-register (167), o17-easing-composition (212), o18-contrast-census
  (1,214), o19-netting-luma, o20-generate-plate, o21-gradient-rail (175), o22-status-lamp,
  o27-focus-affordance (228), t31-dock-band (316), readout-seam (167), o4-order-invariance, o1b.
  Rationale: design-EPOCH instruments of the T "owner-eye" and U visual campaigns — they encode the
  settled design as oracle (the B-e2e categorical critique, `B-e2e-investigation.md:21`); their
  guard role (o10/o11/o21 "16/16" mount-box holds through U) expired with the campaigns; they
  never hard-gated CI (soft from mint — §3); zero named catches (§4). The owner's own edict:
  "Spend little time on contrived gates" (OWNER-PROMPT).
- `o1-color-truth-boot` + `o2-real-hydration-coldload` (~290) — **FOLD** → 2 assertions in the boot
  gate (the hydration-before-derivation truth, T.W2 W2-1, is a boot property; keep the truth, not the files).
- `o16-computed-cascade` (285) — **FOLD** → the glass-ui PRODUCER's surface: the class it guards
  ("the ONLY oracle class that catches a dist clobber", `T/audit/SYNTHESIS.md:589`) is a producer
  defect (O-16-R1 is a glass-ui clobber); an armed `test.fail()` in a consumer demo is mis-hosted.
- `o26-aurora-perceptibility` + `o3-headed-gpu-probe` — **ABROGATE from the headless fleet** →
  CH-7 real-GPU annex; O-26 can NEVER flip on this runner (U-F15) — a permanently red gate is not a gate.

### `perf/` (5, 600) — **ABROGATE** headless frame budgets (drag/idle/view-switch) + o24-lcp-identity
+ o5-boot-pacing (armed `test.fail()`): U-F54 thrice-demonstrated uninterpretability; the perf
truth already has owners — the HARD Lighthouse CWV gates (Q14 prohibition: LCP/TBT/CLS at `error`)
+ CH-4's p75-LCP close gate + the CH-7 annex. Restoring Lighthouse-HARD at W55 is the perf re-gate,
not these specs.

### `mobile/` (3, 399) — **FOLD** → a viewport parameterization of `page-load`/`walk` (Pixel-7 is
Chromium emulation; engine truth lives in `safari/`; three files for one boot class is the census
tautology the T.W0 diet already outlawed).

### `admin/` + `flows/` + `views/`
| Spec(s) | LOC | Verdict |
|---|---|---|
| `admin/a11y-authed-user` + `admin/a11y-authed-admin` | 231 | **KEEP-EARNED** — catch C4 |
| `admin/admin-walk` | 90 | **KEEP-EARNED** (structural, the admin census fold product) |
| `admin/admin-populated` | 108 | *(plan-KEEP)* journey subset — seeded moderation UI, no named catch |
| `admin/flows/*` (6) | 266 | *(plan-KEEP)* journey subset — real admin-API verb assertions |
| `flows/*` (8) | 422 | *(plan-KEEP)* journey subset — real network/storage round-trips; the only layer that drives UI→API (api/test is server-side only) |
| `views/gradient` + `views/mix` | 396 | *(plan-KEEP)* journey subset — T.W0-audited "rich behavioral", incl. the loud-fail + convergence choreography |
| `views/browse-loading` + `views/browse-pagination` | 124 | **FOLD** → walk census (skeleton + keyset-past-50 as census assertions) |

### `safari/` (3, 632) — **KEEP-EARNED** (catches C1 + C5). Cost note: the 12-min sustained probe
should run pre-deploy/nightly, not per-push.

## §8 Survivor set + where it lives

**Survivors** (≈ 2.9-3.1k of 11.7k spec LOC ≈ 25%; abrogated/folded mass ≈ 75%):

- KEEP-EARNED core (~1,691 LOC): page-load 42 · walk 113 · admin-walk 90 · color-space-switching 30
  · a11y battery 784 · safari trio 632.
- Plan-KEEP journey subset (~1,192 LOC): flows 422 · admin flows 266 · admin-populated 108 ·
  gradient+mix 396 (+ folded assertions from url-precedence, browse-×2, o1/o2, one context-loss probe).
- Fixtures surviving with them: dock / env-noise / user-auth / admin-auth / admin-populated
  (~700 LOC); frame-diff / webgl-appearance / blob-timing / frame-budget go with their abrogated specs.

**WHERE — none of it on value's library gate surface.** The fleet proves nothing about the packed
library (§2); the library gate surface is complete as-is (producer job: lint/typecheck/build/vitest/
packed-surface + api job). Survivors are DEMO product-truth and belong to the demo's deploy chain:
the ratified **W55 journey-subset re-gate** (V-PRIME B3, "owns the .github edit") — page-load HARD,
journey subset + a11y battery blocking the demo deploy, safari + real-GPU annex (CH-7) pre-deploy/
nightly. If the demo is restructured by the tranche (owner addendum 3 §2), the survivors ride the
demo tranche and must be re-aimed with it — they are design-coupled instruments, not library property.

## Phase-1 headline

**TOTAL ABROGATION: REFUTED as a totality — but ~75% of the fleet's mass is earned abrogation/fold,
and the epicenter of the owner's "contrived mess" is real and named: the 6,435-LOC `oracles/`
design-epoch slate (ABROGATE, 0 named catches, never hard-gated) plus headless perf (U-F54).**
Three sharpening facts: (1) the fleet is ALREADY CI-dead — the v4 cut (`164343c1`, 2026-07-17)
orphaned it wholesale, so the live question is not "abrogate?" but "what deserves resurrection at
W55"; (2) as a LIBRARY asset the fleet is vacuous by construction (0 library imports) — total
abrogation would cost value.js-the-library nothing; (3) as DEMO truth, a named-catch core
(~1.7k LOC: the engine gate, the a11y battery, the boot/census/dead-control specs) + a
plan-ratified journey subset (~1.2k LOC) survive on catches C1-C5 and value's own reformation
ruling (RF-3: "pruning theater ≠ dropping product coverage"), not on inertia.

---

# PHASE 2 — UNION (prior Opus report tested)

Prior report read AFTER Phase 1 was written: `skeptic-E-e2e-challenge.md`. Every material finding
presumed INCORRECT and tested against my own greps/commits. Demarcation below; the union product =
FABLE-NEW + UNION-CONFIRMED only.

## UNION-CONFIRMED (independently re-derived — survives on MY evidence)

| # | Opus claim | My re-derivation |
|---|---|---|
| UC-1 | **0 library imports** (their 0/191) | my §2 import enumeration → zero `src/`/`@mkbabb/value.js`; their 191 block count also verifies: `grep -rEoh "\btest(\.(fail\|skip\|fixme\|only\|describe))?\("` → 183 `test(` + 7 `test.fail(` + 1 `test.skip(` = 191 |
| UC-2 | **Fleet CI-dead at HEAD; v4 cut stripped it** | my §3 (`164343c1` ci.yml ~800→71); their extra detail verified verbatim: `6d6d3521` deleted `scripts/ci/oracle-slate-teeth.mjs` 187 L marked "(fully dead)" + `test/oracle-feasibility-leg.test.ts` 197 L, commit body "test:e2e is now the terminal scripts key" |
| UC-3 | The teeth gate ran HARD pre-v4 | `git show 755a089b:.github/workflows/ci.yml` — "G-ORACLE-1 — oracle-slate CI-teeth assertion" step confirmed (~line 166) |
| UC-4 | **T.W0 tautology-abrogation precedent** | my §5 (same ledger) — with a count correction, see R-4 |
| UC-5 | **Run cost**: safari 733 s + smoke 251 s, ~16 min of a 32.4-min pipeline | my §6, same named run `28842102862` |
| UC-6 | **Catch: color-space dead-control** | `b4d179fa` "remove the dead-control document-pointerdown handler" (R.W2) exists; my C2 |
| UC-7 | **Catch: the o16 glass-ui 150ms transition clobber — real, uncured, producer-root, ~46 sites** | spec header `o16-computed-cascade.spec.ts:9-34` (armed `test.fail()`); my §4 note + §7 FOLD-to-producer verdict |
| UC-8 | **Contrivance battery**: 7 `test.fail()` (o26/o16/o5) · 8 `isSoftwareGL` specs · O-26 can-never-flip · G-ORACLE gates born-GREEN "core PROVEN SOUND" | all four re-derived: my greps (7/8 exact), U-F15 (`U/audit/registry.md:71`), `U/waves/U.W-ORACLE.md:276` |
| UC-9 | **o18 (1,214 LOC) is a misfiled design-system gate** | my §1 + §7 (ABROGATE; wrong-repo judgment shared) |
| UC-10 | **Unit twins already exist for o22/preview-chips/view-accents** | `test/status-lamp.test.ts:1-12` self-describes as "O-22's closed-form half"; `preview-chips.test.ts`, `view-accents.test.ts` exist — someone already folded that oracle logic to units |
| UC-11 | **Apparatus ≫ subject**: 13.4k e2e LOC vs 4,654 src LOC (~2.9×), guarding none of it | `find src -name "*.ts" … wc -l` → 4,654; my §1/§2. Their `test/` = 3,823 LOC is CORRECT and corrected my Phase-1 figure |
| UC-12 | **No e2e harness belongs on value's LIBRARY gate surface; page-load survives as demo smoke** | my §8, independently derived |

## OPUS-REFUTED (tested and wrong — disproof stated)

| # | Opus claim | Disproof |
|---|---|---|
| **R-1** | **o12-blob-seat listed as a named CATCH** of the R2 backing-store race (`af18e072`) | Timeline: the race was found+cured under the T owner-eye campaign ("the T-30 boot blur", commit `af18e072`, 2026-07-10, T.W4.5); the o12 backing-ratio leg that detects this class did NOT exist through U's disposition ledger (`U/DISPOSITION-LEDGER.md:273` boot-G: "ZERO hits for backing-ratio / o12 … NOT the o12 slate-bounds leg") and was minted **born-GREEN post-cure** at `15e306e0` ("boot-G o12 mint"). The oracle never caught anything; their own annotation ("leg minted born-GREEN post-cure") contradicts the catch credit. o12 stays in the ABROGATE mass. |
| **R-2** | **safari/ verdict "ABROGATE — no library subject; no unique catch"** (and "Everything else: no recorded catch") | FALSE — the fleet's best-documented wild catch belongs to smoke-safari: the **WebKit veil-forever** (`d5b3e4d`), cited as "the smoke-safari engine oracle caught it" at `T/PROGRESS.md:212`, `T/audit/w2-close-artefacts.md:214`, `T/audit/pi/w2/w2-close-artefacts.md:26,69`; plus the S-22 engine-gate designation and the D7 engine-layer honor (`E/FINAL.md:115`). Their catch archaeology missed it entirely. safari/ = **KEEP-EARNED** (pre-deploy/nightly cadence). |
| **R-3** | **"a single axe-core pass over the demo would subsume most" of a11y-*** | The battery's earned content is OPERATION + MODALITY driving, which a static axe pass cannot do: slider keyboard OPERATION (BR-8), forced-colors/prefers-contrast/reduced-transparency EMULATION (BR-5..7), and the authed+populated DRIVEN battery (U-F56) that **found 2 born-RED WCAG defects** (admin expander bare `<div>` WCAG 2.1.1 + un-announced ErrorBoundary — `U/PROGRESS.md:121`, commit `42608ebe`) — which their archaeology also missed. Consolidating 5-6 files into one battery is fine; "axe subsumes" is wrong. a11y battery = **KEEP-EARNED**. |
| **R-4** | "T.W0 abrogated **13** tautological specs" | The ledger's own net line: "**−11 tautological tests across 10 deleted files + 1 in-place excision**" (`w0-ci-diet-ledger.md:150`). Immaterial to the verdict, corrected for the record. |

## OPUS-UNVERIFIABLE (excluded from the union product, listed for the record)

| # | Claim | Why excluded |
|---|---|---|
| UV-1 | "admin/ + flows/ are a **DUPLICATE** of the CI-gated api vitest suite" | The api suite is server-side; the specs drive UI→API browser transport — a different layer, which the report itself concedes ("the e2e leg adds only browser-transport"). "Duplicate" as a fact is over-strong; as a verdict it is a judgment call that my FABLE-NEW N-1 (the ratified W55 journey subset) weighs against. Not provable, not refutable — excluded. |
| UV-2 | "o1/o18/o19 **duplicate** the color goldens" | Mechanism mismatch: the oracles assert the DEMO RENDERS the derived field (a boot/pixel property); the goldens prove math. The duplication rationale is wrong-shaped, but the ABROGATE/FOLD verdicts coincide with mine on independent grounds (design-epoch + fold-to-boot), so nothing rides on it. |

## FABLE-NEW (mine, absent from the Opus report)

| # | Finding |
|---|---|
| N-1 | **The abrogation question is ALREADY adjudicated value-side — as PRUNE-TO-JOURNEY-SUBSET, not total abrogation**: `V-PRIME.md:110` (bracket B3: "the journey subset + the 11.7k-line e2e corpus pruning at **W55** (owns the .github edit)"), `CARRY-LEDGER.md:29` (W55 carries **CH-7: the real-GPU oracle RUNS** + CH-4 p75-LCP), `REFORMATION-2026-07-16.md:62` (RF-3: "**pruning theater ≠ dropping product coverage**"), RF-29 ("e2e NOT source-broken by the v4 cut"). The Opus report's "finish the demolition" framing never engages this ratified plan; any panel verdict must honor or explicitly countermand it. |
| N-2 | **Catch C1** — smoke-safari WebKit veil-forever (`d5b3e4d`), thrice-cited → safari/ KEEP-EARNED (grounds of R-2). |
| N-3 | **Catch C4** — the U-F56 driven authed battery found 2 born-RED WCAG defects (`42608ebe`) → a11y battery KEEP-EARNED (grounds of R-3). |
| N-4 | **Catch C3** — the fill-mode "one-shot release law" (`eb6d9a6`): 20 view-nav spec timeouts live-bisected to a real product animation bug (`T/PROGRESS.md:212`) — the fleet-as-instrument catch class. |
| N-5 | **The soft-posture history sharpens the contrived-mess case**: only `page-load.spec.ts` (42 LOC) ever ran HARD; the full oracle slate, safari, and the perf/reactivity/mobile/admin slate were `continue-on-error: true` from mint to death (`git show 6bed451d:.github/workflows/ci.yml` lines 337-354, 454-456, 540-556; `SOFT-POSTURE.md:63`). A 6.4k-LOC slate that never once blocked anything. |
| N-6 | **Deeper abrogation precedent + the categorical critique**: tranche B already abrogated a 16-spec suite to 3 (`afe102a6`), and `B/research/B-e2e-investigation.md:21` states the design-as-oracle critique ("they catch *all* layout change, not *unintended* change") that condemns the oracles/ slate as a class. |
| N-7 | **Finer-grain verdicts the Opus table lacks**: walk/admin-walk are KEEP (they ARE the T.W0 anti-tautology fold products — deleting them resurrects the 10-file census class); mobile/ = FOLD to a viewport parameterization (Pixel-7 is Chromium — engine truth lives in safari/); dual-pane-1440 = FOLD-INTO-build-check; reactivity-instant = ABROGATE (flake history, host-CPU-coupled); o1/o2 = FOLD as boot-gate assertions; o16 = FOLD to the glass-ui producer surface (mis-hosted armed tripwire). |
| N-8 | Run-cost datum: `workers: 1` is forced suite-wide (`playwright.config.ts:86-106`, R.W2 determinism) — a full local run is serial; plus the built-bundle perf server (≤180 s cold build) for smoke-perf. |

## §9 FINAL union verdicts (the union product)

**Headline: TOTAL ABROGATION — REFUTED as a totality; ~75% ABROGATE/FOLD is earned; the survivor
core survives on named catches + the ratified W55 plan, not inertia.** And the decision is
partially moot: the fleet is already CI-dead (UC-2) — the live question is what W55 resurrects.

| Family | Union verdict | LOC |
|---|---|---|
| `oracles/` design-census mass (o4/o7/o9/o10/o10d/o11/o12/o14/o15/o17/o18/o19/o20/o21/o22/o27/t31/readout/o1b) | **ABROGATE** (design-epoch, 0 catches — R-1 kills the o12 credit; never hard-gated — N-5; categorical critique — N-6; unit twins exist for o22-class — UC-10) | ~5.9k |
| `perf/` + `reactivity-instant` | **ABROGATE** (U-F54 headless uninterpretability ×3; 7 armed `test.fail()`; perf truth = Lighthouse-HARD + CH-4 + CH-7 annex) | ~856 |
| o26 + o3 (+ frame-truth) | **ABROGATE from headless → CH-7 real-GPU annex** (U-F15 mis-hosting) | in above |
| o1 + o2 · browse-×2 · url-precedence · mobile/ · dual-pane · webgl quartet | **FOLD** (boot-gate assertions · walk census · viewport param · build-check · annex + 1 context-loss probe) | ~1.7k folded |
| o16-computed-cascade | **FOLD → glass-ui producer surface** (real uncured clobber, UC-7; wrong host) | 285 |
| `page-load` · `walk` · `admin-walk` · `color-space-switching` · **a11y battery** (consolidation into fewer files permitted, content kept) · **safari/ trio** | **KEEP-EARNED** (catches C1/C2/C4 + hard-gate/fold-product structural earnings) | ~1.7k |
| `flows/` (8) · `admin/flows/` (6) · `admin-populated` · `views/gradient`+`mix` | **KEEP (plan-earned journey subset — V-PRIME B3/W55)**; strict named-catch law would demote these, and the demarcation is flagged for adjudication | ~1.2k |

**WHERE**: nothing on value's library gate surface (UC-1/UC-12 — the producer+api ci.yml is the
complete library gate). Survivors live with the DEMO: the W55 journey-subset re-gate (page-load
HARD; journey+a11y blocking the demo deploy; safari + real-GPU annex pre-deploy/nightly). If the
demo is restructured by the tranche (owner addendum 3 §2), the survivors ride the demo tranche and
are re-aimed with it.

**Tag counts**: FABLE-NEW **8** · UNION-CONFIRMED **12** · OPUS-REFUTED **4** · OPUS-UNVERIFIABLE **2**.

**Most consequential refutation**: R-2 — the Opus seat abrogated `safari/` on "no unique catch"
while the fleet's single best-documented wild catch (the WebKit veil-forever, `d5b3e4d`) belongs to
exactly that project; its ~500-LOC minimal-survivor shape (§7 there) would delete the engine gate
and shrink the a11y battery below its earned content. The union survivor set is ~2.9k LOC (~25%),
not ~500.
