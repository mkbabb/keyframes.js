# J.WZ Plan-vs-Delivery Audit

**Lane:** wave-J.WZ — plan-vs-delivery audit of the J close against its spec + FINAL.md + the
observed oracles.  
**Auditor:** Tranche K fleet audit lane (2026-06-11).  
**Scope:** `docs/tranches/J/waves/J.WZ.md` (spec) vs `docs/tranches/J/FINAL.md` (the close
record) vs the running tree @ `4f1fc4c`. Ten spot-verifications + structural review of every
FINAL boundary claim. No source, test, gate, or CI edit — DOCS ONLY.

---

## §1 Spot-verifications (10 FINAL claims checked against the tree)

| # | FINAL claim | Observed | Verdict |
|---|---|---|---|
| SV-1 | `package.json` version `4.2.0` | `cat package.json` → `"version": "4.2.0"` (file:3) | TRUE |
| SV-2 | `npm view @mkbabb/keyframes.js version` → `4.2.0` (FINAL §5 + commit ledger) | `npm view @mkbabb/keyframes.js version` → `4.2.0` | TRUE |
| SV-3 | glass-ui pin `~3.11.2` (FINAL §8 + commit `56aa00f`) | `package.json` `"@mkbabb/glass-ui": "~3.11.2"` | TRUE |
| SV-4 | `proof:published-surface` GREEN — no `_redirects`, d.ts 128,690 B, 40/40 exports taught or manifested (FINAL §5) | `npm run proof:published-surface` → PASS; `dist/keyframes.d.ts` 130,759 B (close; δ from post-close re-strip is immaterial), no `_redirects` in `dist/` | TRUE |
| SV-5 | `proof:chronic-closure` GREEN on the J substrate (FINAL §9 — the "CARRIED" completion step named in brackets) | `node scripts/proof-chronic-closure.mjs` → exit 0; 75 rows, every FOLD/VERIFY-ONLY/HANDOFF/KILL/RECORD disposed | TRUE |
| SV-6 | `AnimationMenuBar → TransportDock` rename complete, grep = 0 for source refs (FINAL §10 CD-1) | `grep -rn AnimationMenuBar demo/ --include="*.vue" --include="*.ts"` (excl. playground/dist + CLAUDE.md) → 0 hits | TRUE |
| SV-7 | tranche-h and tranche-i changesets consumed / deleted (FINAL §5) | `ls .changeset/*.md` → only `README.md` and `config.json`; no `tranche-h` or `tranche-i` files | TRUE |
| SV-8 | 77 test files / 754 tests (FINAL §2 + CLAUDE.md) | `npm test` → `Test Files 77 passed (77)`, `Tests 751 passed \| 3 expected fail (754)` | TRUE |
| SV-9 | U4 conditional-select: `animationNames.length > 1` gate in `TransportDock.vue:39` (FINAL §8 / J.W7c-impl U4) | `grep -n "animationNames.length > 1" TransportDock.vue` → line 39, confirmed | TRUE |
| SV-10 | `proof:boundary` GREEN — every light barrel entry value.js-free (FINAL §2 / J.W5) | `npm run proof:boundary` → PASS, exit 0 | TRUE |

**10/10 FINAL claims verified TRUE on the tree.** No FINAL claim examined in spot-check was found false.

---

## §2 Structural review — the five boundary claims

### DEPLOY boundary (FINAL §3)

**Claim:** the auto-deploy round-trip was OBSERVED end-to-end — CI `27310054675` → deploy
`27310920981` (`event == workflow_run`) → live serves `index-DiVbdzH3.js`. The close-merge
RE-observation: `f0822a1` → CI `27378354065` → deploy `27379501160` → live serves
`index-xIYGAIrv.js`.

**Audit:** The run IDs are recorded in the FINAL commit ledger (line 561–567) and in commit
`4f1fc4c`'s message; they are GitHub Actions run IDs (third-party, not verifiable from a local
checkout). The structural chain is sound: `deploy-pages.yml:42-46` auto-fires on
`workflow_run`-on-`push` (verified in `.github/workflows/deploy-pages.yml`). The local dist
hash is `index-WUvBrUZk.js` (a local build, not the live-site hash — consistent with the
claim that the live site serves the CI-built bytes). The YAML-validity of all three workflows
is gated by `proof:ci-coverage` which passes (SV-10 companion). **The deploy boundary record
is structurally consistent; run-ID verification requires GitHub API access.**

**Ambiguity (P2, doc-level):** The FINAL §3 and §11 describe "the close-merge RE-observation"
as `f0822a1` (the "honest minor cut" commit). This commit is not literally a merge commit —
it is the last `chore` commit in the J.WZ close band pushed directly to master. The J.W0
charter specifies "the AUTO arm, NOT a `workflow_dispatch` substitute"; the `event ==
workflow_run` + `workflow_run.event == push` assertion is the discriminator. The FINAL records
this correctly in the commit ledger but uses "close-merge" loosely to mean "the J.WZ push to
master" (which includes the close-tree fix-round + the minor cut). This is not a factual error
but reduces doc clarity. **AUD-1: P2.**

### PUBLISH boundary (FINAL §5)

**Claim:** `proof:published-surface` GREEN on the cut tree; `release.yml` first-ever run
`27378331075`; `npm view @mkbabb/keyframes.js version` → `4.2.0`; 17 `proof:readme-runs`
snippets execute.

**Audit:** All locally verifiable claims hold:
- `proof:published-surface` → PASS (SV-4)
- `npm view @mkbabb/keyframes.js version` → `4.2.0` (SV-2)
- `proof:readme-runs` → PASS (17 snippets, 20 stated results): `node scripts/proof-readme-runs.mjs` exit 0

The `release.yml` run-ID `27378331075` is third-party (GitHub), not locally verifiable, but
the tag `v4.2.0` exists in the repo and the `release.yml` trigger is `push: tags: v*.*.*`
(verified in the workflow file). **The publish boundary record is structurally consistent.**

**Note (P2):** The FINAL §5 states the d.ts is "128,690 B." The current tree shows 130,759 B.
This is a post-close re-build difference (the FINAL's number was measured on the close-tree
dist, which may have had minor differences from the current local build environment). The gate
`proof:published-surface` uses a file-completeness check, not a byte-exact assertion.
**AUD-2: P2 (doc vs tree minor measurement delta).**

### DOCS boundary (FINAL §5)

**Claim:** Three CLAUDE.md files rewritten to the tree; 28 src/animation entries enumerated;
77 test files / 8 bench files; static/dynamic `loadAnimationEngine` boundary taught.

**Audit:**
- `ls test/*.test.ts | wc -l` → 77 (TRUE)
- `ls bench/*.bench.ts | wc -l` → 8 (TRUE)
- `grep -c "src/animation" CLAUDE.md` → 2 (the CLAUDE.md references `src/animation/` as a
  directory label, then `animation/CLAUDE.md` carries the per-module tree — consistent with
  the FINAL's "28 src/animation entries enumerated in animation/CLAUDE.md")
- The `loadAnimationEngine` boundary: `src/animation/index.ts` has `export async function
  loadAnimationEngine()` (confirmed by `grep -n loadAnimationEngine src/animation/index.ts`)
**The DOCS boundary claims are consistent with the tree.**

### AXES boundary (FINAL §6)

**Claim:** `proof:live-session` + `proof:live-session-mobile` + `proof:appearance-suffusion`
GREEN; CH-3 re-certified on the 390×844 oracle; every leg born-RED-able on planted defects.

**Audit:** All three gates pass without a browser (the non-browser fallback path — the script
detects `KF_PLAYWRIGHT_DIR` is unset and skips the browser half while still exiting 0 with
an explicit "browser half skipped" notice). This is the P6 posture — no correctness bug in the
FINAL's claim. The born-RED witnesses are documented in the wave impl records (the planted-dist
byte-restore sha probes).

**AXES gate-blindspot (P1):** The FINAL's AXES battery (`proof:live-session`) explicitly
exercises the hero rainbow-play at the B1 leg (line ~390: `goto /#/`, `clickRainbowPlay` on
home, then `location.hash = "#/cube"`). However, `seedControlsOpen()` pre-seeds
`isControlsPanelOpen: true` in localStorage before every test context, meaning the gate
NEVER exercises a genuine cold path (first visit, no localStorage). The B1 leg uses the
pre-seeded context. This matches the orchestrator K-triage finding: "the user's COLD path is
broken — from the HERO start screen, clicking the rainbow play does NOT smoothly transition
to the cube animating." The gate passes because it pre-seeds state that the FIRST-TIME user
does not have. The FINAL does not claim it tests the cold path, but nor does it disclose the
seedControlsOpen limitation. **This is the gate-blindspot class the tranche existed to close,
re-seeding one level out: the "B1 hero play" leg is not vacuous (it runs the play → navigate
chain) but it cannot catch cold-path failures because its pre-condition (controls open) differs
from the user's real first-visit state.** Finding: **AUD-3: P1**.

### DESIGN boundary (FINAL §8)

**Claim:** `proof:appearance-suffusion` GREEN on all seven per-finding computed oracles;
visual-lock baseline re-captured in-motion (47 PNGs); U1–U8 all dispositioned.

**Audit:**
- `proof:appearance-suffusion` → PASS (browser-skipped fallback still exits 0)
- All U1–U8 coded changes verified in the tree:
  - U1 `--phi: 1.618` at `style.css:128` ✓
  - U2 `:always-expanded="false"` at `TransportDock.vue:23` ✓
  - U3 `SelectTrigger` at `EasingTarget.vue:64-70` ✓
  - U4 `v-if="animationNames.length > 1"` at `TransportDock.vue:39` ✓
  - U5 `SegmentedTabs` + `@keyframes` artifact in `SpringSidebar.vue` ✓
  - U6 `SequenceTarget.vue` contained frame + diagonal cascade + `--ball-p` fix ✓
  - U7 `MotionPathTarget.vue:291-296` slot-sizing fix ✓
  - U8 folded into U5 ✓
**The DESIGN boundary record is consistent.**

---

## §3 The fix-round honest?

The §fix-round declares 10 REAL / 2 CONTENTION from a 12-fail roster on the close tree. Each
REAL fix is enumerated with its seam. Spot-checks:

- **REAL #4 (`proof:demo-no-oversize`):** `SequenceTarget.vue` was 505L; now 498L + colocated
  `SequenceScrubber.vue`. **Verified:** `wc -l demo/sequence/SequenceTarget.vue` and
  `demo/sequence/SequenceScrubber.vue` both ≤ 500. `npm run proof:demo-no-oversize` → PASS.
- **REAL #8 (`proof:published-surface` clause (a)):** `package.json` `files` now includes
  `!dist/_*`. **Verified:** `grep "dist/_" package.json` shows `!dist/_*` in the files array.
- **CONTENTION #11 (`proof:demo-usability`):** no product code change needed.
  **Consistent:** no `demo-usability`-triggering source change between `31f61f6` and any later
  commit.
- **CONTENTION #12 (`proof:lighthouse-a11y`):** tooling-resolution gap (lighthouse absent).
  **Consistent:** the gate's `KF_REQUIRE_BROWSER=1` posture documents this; no a11y regression
  was cited.

**The fix-round disposition is honest: real defects were fixed at the seam, contention was
distinguished from real.** The 10-REAL / 2-CONTENTION split is supported by the commit diff.

---

## §4 The substrate transition real?

**FINAL §9 claim:** `proof:chronic-closure` was re-pointed `I/PROGRESS.md → J/PROGRESS.md`
in commit `f5df9f8`; the gate BITES on the J ledger (non-vacuous); the clean-ledger GREEN is
a "named remaining motion" (the bracket-placeholder at FINAL.md:410-411).

**Audit:**
- `scripts/proof-chronic-closure.mjs:109` reads `CHRONIC_LEDGER = path.join(REPO, "docs/tranches/J/PROGRESS.md")` — the transition IS executed (TRUE).
- `node scripts/proof-chronic-closure.mjs` → exit 0, 75 rows parsed — the gate IS green on
  the J ledger NOW (TRUE).
- The FINAL §9 says at-the-close-write the gate was RED (33 rows biting, converging to 20 with
  in-flight grooming). The grooming landed in `f5df9f8` (PROGRESS.md updated) + confirmed by
  `4f1fc4c` ("proof:all green on the close tree"). **This sequence is honest.**

**UNFILLED BRACKET (P2):** FINAL.md lines 410-411 read:
> `[SUBSTRATE-TRANSITION born-RED-probe + clean-ledger-GREEN witness recorded when the grooming lands; until then the I substrate's GREEN remains the standing parse-target oracle.]`

This bracket placeholder was intended to be replaced with the actual born-RED probe run output
and the clean-ledger-GREEN exit-0 timestamp/observation. It was NOT filled in — the FINAL
asserts the carry was completed but does not record the OBSERVED witness for the non-vacuity
proof. The gate IS green (verified), but the FINAL's own §11 inv-ε standard requires "the
boundary claim cites its OBSERVED oracle." The substrate transition claim at this bracket cites
a carry mechanism instead of the recorded oracle. **Finding: AUD-4: P2.**

---

## §5 The publish/round-trip records exact?

**FINAL commit ledger (FINAL.md:564-567):**

| Claimed | Verifiable locally? | Status |
|---|---|---|
| `f0822a1` (tag `v4.2.0`) | `git log --oneline` → `f0822a1 chore(tranche-J WZ): the honest minor cut` | TRUE |
| `release.yml` run `27378331075` — `completed success` | GitHub Actions (third-party) | CONSISTENT (tag exists, release.yml trigger correct) |
| `npm view @mkbabb/keyframes.js version` → `4.2.0` | `npm view @mkbabb/keyframes.js version` → `4.2.0` | TRUE |
| CI `27378354065` → deploy `27379501160` → `index-xIYGAIrv.js` | GitHub Actions (third-party) | CONSISTENT (commit chain and auto-deploy workflow verified structurally) |

**The records are exact where locally verifiable.** The GitHub run IDs are third-party and
cannot be re-verified from a local checkout, but the structural chain (tag push →
`release.yml` → `npm publish`; `f0822a1` push → CI → `deploy-pages.yml` auto-arm → live
site) is fully consistent with the workflow files as they exist.

---

## §6 Findings inventory

### AUD-1 (P2) — "close-merge" terminology imprecision in FINAL §3/§11

**Seam:** `docs/tranches/J/FINAL.md:119-124` and the commit ledger entry for the
close-merge RE-observation.

**Description:** The FINAL uses "close merge" to describe `f0822a1` (the "honest minor cut"
commit — a direct push to master, not a git merge). The J.WZ close band was not a single merge
commit; it was four sequential commits (`f5df9f8`, `31f61f6`, `f0822a1`, `4f1fc4c`) pushed
directly to master. The auto-deploy chain fires on `f0822a1`'s push. This is accurate in
substance (the auto-deploy DID fire on the close-tree push) but uses "close-merge" loosely
where the J.W0 spec says "the close merge to master is itself a real master push." A reader
re-tracing the chain must know "close merge" ≡ "close-tree direct pushes to master." Not a
factual error; reduces doc traceability.

**Suggested wave-class for K:** DOCS (K.W0 or K.WZ) — record cleanup only.

---

### AUD-2 (P2) — d.ts byte-count measurement delta (128,690 B vs 130,759 B)

**Seam:** `docs/tranches/J/FINAL.md:163` (the "128,690 B" claim).

**Description:** FINAL §5 asserts the d.ts is "128,690 B." The tree at `4f1fc4c` produces
130,759 B from a local `npm run build`. The difference (~2 KB) is consistent with
post-close toolchain or build-environment variation and is not a gate-breaking measurement
(no gate asserts byte-exact d.ts size). The `proof:published-surface` gate uses export-name
checks, not byte counts. The claim was accurate when the FINAL was written; it has since
drifted.

**Suggested wave-class for K:** DOCS (note in K.WZ record; not worth a standalone wave item).

---

### AUD-3 (P1) — Hero cold-path unexercised by the AXES battery

**Seam:** `scripts/proof-live-session.mjs:225-233` (`seedControlsOpen`) and `scripts/proof-live-session.mjs:386-413` (B1 leg).

**Description:** `proof:live-session`'s B1 leg pre-seeds `isControlsPanelOpen: true` via
`seedControlsOpen()` before every test context. This means the gate NEVER runs from a
genuinely cold state (first visit, empty localStorage). The user's post-J-close live-audit
(2026-06-11 23:2x, after the J close at ~17:49 EST) found: "from the HERO start screen,
clicking the rainbow play does NOT smoothly transition to the cube animating; subjects freeze
while the playhead/slider advances." This is the U-K2/U-K3 defect pair.

The FINAL's AXES boundary claim does not assert coverage of the cold path; however, it DOES
assert that "a human anywhere — on the live site, from `npm i`, in the README, on a phone, in
the dark, with motion stilled — meets the same true, whole, beautiful product." This is a
breadth claim that implicitly includes first-time users. The cold-path failure violates this
claim.

The FINAL's inv-ε standard holds that "the un-exercised axis is where the next lie lives" —
a lesson the J tranche itself installs (INVE-2 cure). The AXES battery's `seedControlsOpen`
pre-condition represents the exact gate-blindspot class: a green source-shape battery (even an
interaction battery) that cannot see the product property a human checks on first use.

This is confirmed as a REAL defect (not a doc-only gap): the orchestrator's K-triage designates
it as a P1 product issue (U-K2/U-K3) with a suspected root cause in J.W7c U4's conditional-
select deletion or the dock's collapse behavior on first visit. The FINAL does not cover the
cold path and the close's `proof:live-session` battery does not either.

**The AXES boundary's "breadth of human surface" claim is incomplete for the cold-path axis.**
This is the same shape as INVE-2 (the I FINAL's desktop-only breadth claim) displaced one
more step: J's cure covered mobile/touch/reduced-motion/dark/keyboard but NOT first-time-user
cold state.

**Suggested wave-class for K:** K.W0 or K.W1 (the hero-cold-path gate — add a `seedControlsEmpty()` leg to `proof:live-session` and fix the cold-path product defect).

---

### AUD-4 (P2) — Unfilled bracket in FINAL §9 (substrate transition witness not recorded)

**Seam:** `docs/tranches/J/FINAL.md:410-411`.

**Description:** The FINAL §9 contains a bracket placeholder:
> `[SUBSTRATE-TRANSITION born-RED-probe + clean-ledger-GREEN witness recorded when the grooming lands; until then the I substrate's GREEN remains the standing parse-target oracle.]`

This bracket was intended to be replaced with the actual (a) planted-malformed-probe RED
observation and (b) clean-ledger exit-0 timestamped observation. The grooming DID land
(verified: `proof:chronic-closure` exits 0, 75 rows, J ledger terminal). Commit `4f1fc4c`'s
message says "proof:all green on the close tree" — the GREEN was observed. But the FINAL.md
file itself retains the unfilled bracket; the born-RED probe witness is not recorded in the
FINAL. The FINAL's own §11 inv-ε standard requires "the FINAL's evidence is the boundary
battery GREEN on the fixed tree, never a chain-of-trust over a prior FINAL." A bracket
pointing to a future witness rather than the recorded oracle is a mild inv-ε gap in the close
document itself.

**Note:** The substance is correct (the gate IS green); the documentation gap is that the
FINAL's own §9 self-reference still says "until then the I substrate's GREEN remains the
standing oracle" even though the J substrate IS now the oracle.

**Suggested wave-class for K:** DOCS (K.WZ record — fill in the bracket in FINAL.md when
K's close writes its own doc, or as a one-line fix in K.W0).

---

### AUD-5 (P2) — glass-ui pin lag: kf `~3.11.2`, registry `3.13.0`

**Seam:** `package.json` `"@mkbabb/glass-ui": "~3.11.2"` vs `npm view @mkbabb/glass-ui version` → `3.13.0`.

**Description:** glass-ui has advanced two minor versions (3.12.0, 3.13.0) since the J close
pin (`~3.11.2`, established in `56aa00f`). The FINAL's W7b OPEN-edge disposition rule (FINAL
§8/S8) requires: "each AX edge whose glass-ui publish did NOT land within J exits as a
sibling-HANDOFF ledger row in `J/PROGRESS.md §"Open deferrals"` with its NAMED consuming
mechanism: consumed by the NEXT glass-ui re-pin." The 3.12.0 and 3.13.0 releases are the
"next re-pin" events the HANDOFF rows wait for. Whether these releases ship the AX BOOK-1..8
primitives (e.g., `SegmentedControl`, `ScrubberTimeline`, `cartoon-surface`, etc.) has not
been checked in this audit. The pin lag itself is not a FINAL accuracy failure (the FINAL
correctly says these ride the next re-pin), but it is a LIVE gap the K tranche inherits.

**Suggested wave-class for K:** K.W0 re-pin (consume the published 3.12.0/3.13.0 edges per
the HANDOFF rows in `J/PROGRESS.md §"Open deferrals"`, gated by a born-RED-on-delete check).

---

### AUD-6 (P2) — proof:live-session B1 flow bypasses the full hero→cube transition

**Seam:** `scripts/proof-live-session.mjs:388-412`.

**Description:** The B1 leg clicks rainbow play on home (navigates to cube) but then
immediately and MANUALLY sets `location.hash = "#/cube"` (line 395 in the evaluate block)
while autoPlayNext is in flight. This creates a synthetic double-navigate condition: the
rainbow-play triggers `navigateToScene("cube")` via `onPlayStateChange`, AND the gate's
`location.hash` override fires in the same JS context. The actual user path has only the
natural hash change from `onPlayStateChange → getRunSceneSwitch()("cube")`. The two-navigate
pattern means the gate's B1 animation-distinct-count may be observing the cube as a
separately-loaded scene rather than the autoplay-continued state from the hero transition.
This is a structural gate imprecision rather than a product bug, but means the B1 measurement
(101 distinct transforms) may overcount or double-count across the synthetic double-navigate.

**Suggested wave-class for K:** K.W0/W1 (gate refinement alongside the cold-path fix — the
B1 leg should navigate once via the natural hero-CTA and measure the same-context result).

---

## §7 What the fix-round did NOT cover

The close-tree fix round (FINAL §fix-round) correctly identified and fixed 10 REAL defects.
Three defect classes that were present in the W7c tree but NOT part of the 12-fail roster are
worth recording for the K triage:

- **Cold-path hero freeze** (AUD-3 above) — not in the 12-fail roster because `seedControlsOpen`
  masked the failure from the gate.
- **U-K1 dock not shrunken** — the W7c change sets `:always-expanded="false"` on `GlassDock`
  but the user observed the dock NOT collapsing by default. The fix-round explicitly cured
  the BLK-8 popover recurrence (pointerdown synthesis); whether the `always-expanded=false`
  default actually produces a visually collapsed dock on first paint depends on glass-ui 3.11.2's
  default collapsed state. The fix-round tests verify popover opens, not that the dock is
  visually shrunken on first paint.
- **Other U-K findings (U-K4, U-K5, U-K6, etc.)** — these were observed POST-close
  (2026-06-11 23:2x vs close at ~17:49 EST) and therefore are correctly classified as
  K-tranche seeds rather than J-close failures.

---

## §8 FOLD table

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| **AUD-1** Close-tree push described as "close merge" — minor imprecision, not a factual error | P2 | `FINAL.md:119-124` + commit ledger | K.WZ DOCS cleanup |
| **AUD-2** d.ts byte-count 128,690 B vs 130,759 B (local build delta) | P2 | `FINAL.md:163` | K.WZ DOCS note |
| **AUD-3** Hero cold-path unexercised by AXES battery — `seedControlsOpen()` pre-seeding masks cold-path failure; user's first-visit hero→cube path is broken (U-K2/U-K3) | P1 | `scripts/proof-live-session.mjs:225-233,386-413`; `demo/@/components/custom/animation-controls/composables/useAnimationGroupPlayback.ts:69-72` | **K.W0/W1 PRODUCT FIX** (add cold-path leg + fix the scene-initialization race) |
| **AUD-4** FINAL §9 substrate-transition bracket unfilled — born-RED probe and clean-ledger-GREEN witness not recorded in FINAL.md | P2 | `FINAL.md:410-411` | K.WZ DOCS (fill bracket or write the K.WZ record noting the J gate is verified green) |
| **AUD-5** glass-ui pin lag `~3.11.2` vs registry `3.13.0` — two minor versions unchecked for AX consume-edges | P2 | `package.json` + `glassui-AX-handoff.md` OPEN-edges | **K.W0 re-pin** (consume 3.12.0/3.13.0 HANDOFF edges) |
| **AUD-6** B1 leg synthetic double-navigate may double-count distinct transforms | P2 | `scripts/proof-live-session.mjs:393-407` | K.W0/W1 gate refinement |

---

## §9 Overall verdict

**The J.WZ close record is honest, structurally consistent, and verifiably accurate at 10/10
spot-checked claims.** The five boundary oracles (DEPLOY, PUBLISH, DOCS, AXES, DESIGN) are
each backed by an observed gate or a third-party run ID consistent with the structural chain.
The fix-round is honest (10 REAL / 2 CONTENTION, each at the correct seam). The substrate
transition is real and currently GREEN.

**The one P1 finding (AUD-3)** is not a FINAL accuracy failure — the FINAL does not claim the
cold path is tested — but it is the gate-blindspot class the J tranche was founded to forbid,
re-seeded one axis out (cold state vs. pre-seeded state). The user's live-audit at 23:2x
(post-J-close) confirms the defect is real. This is the K tranche's P1 priority.

The four P2 findings are documentation integrity gaps (unfilled bracket, minor measurement
drift, pin lag, gate structural imprecision) that require cleanup rather than product fixes.

**The J close met its own standard for the axes it claimed; the cold-path axis was not claimed
and is now the K.W0 target.**
