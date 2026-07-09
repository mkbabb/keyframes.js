# p12 — demo-gate red triage (DM-11b/13/14 + the master-CI red plane)

**Probe:** p12-demo-gate-triage · **Branch of record:** `tranche-s-dev` (main tree; read-only w.r.t. source) · **Date:** 2026-07-02
**Spec question:** SPEC-v1 §6 **Q12** — *Are DM-11b/13/14 calibration or genuine?* (+ the broader demo-gate red triage the task frames: for EACH red gate in the latest master CI runs, extract the signature, re-run LOCALLY on a fresh `gh-pages` build, and rule *runner-calibration | genuine defect | glass-ui-owned*).

---

## 1. The question + the spec's assumption

**Q12 (verbatim):** "Reproduce the three runner-reds in a Linux-shaped environment (container/act or instrumented CI artifacts). SUCCESS: per-gate verdict with evidence (harness importmap fix vs render-race calibration vs genuine regression). This verdict IS S.A1's triage input."

**The spec's load-bearing assumption** (SPEC-v1 §2.1 point 2, and the §4 fold table rows 10/12/13):

> "Two reds are *genuine source defects reproducible locally* (`proof:styling-idioms`, `proof:pin-ledger-current`). **The rest is the device-dependence plane** (LoAF exit-code flake with a GREEN metric; **14 blocking demo-smoke gates**; ~50 chromium launches under a 50-minute ceiling)."

And the per-gate S.A1 dispositions the spec pre-writes:
- Row 10 — **DM-11b** `subject-animates`: "OPEN; **fix or calibrate**, then terminal."
- Row 12 — **DM-13** `engine-no-throw-on-play`: "**importmap harness fix**; terminal."
- Row 13 — **DM-14** `fsm-suspend-resume-live`: "**timing calibrate**; terminal."

So the spec models the 14 blocking demo reds as *predominantly device-dependence* (render-race / absolute-threshold / binary-absent), with DM-13 as the one named harness fix and DM-14 as a *timing* calibrate.

**This probe tests that model against the running gates.** The r8 warning it operationalizes: *"R mislabeled runner-reds as ENV (r8 F1)"* — i.e. a red that LOOKS like calibration can be a deterministic defect. The discriminator I used: **a gate that reproduces on fast macOS is NOT device-dependence.** If it reds identically off the slow Linux runner, its cause is deterministic (source / demo / harness), full stop.

---

## 2. What I actually did (commands + exit codes)

Read-only w.r.t. source. No source edits (`git diff --stat` on tracked files = empty; only `dist/` — gitignored — and the scratchpad were written).

**CI signature extraction** (latest 3 master runs; all `failure`):
```
gh run list --workflow=ci.yml --branch=master --limit 3
  → 28192695182 (failure, 30m7s, 2026-06-25)   ← the run I triaged
  → 28144234717 (failure), 28143866199 (cancelled)
gh run view 28192695182                    → 2 jobs failed: "library gate", "demo gate"
gh run view --job 83511169831 --log        → library gate: proof:styling-idioms FAIL
gh run view --job 83511169841 --log        → demo gate: 14 BLOCKING proof:* + LoAF exit-code + check-failures
```

**Fresh build in the main tree** (`dist/` gitignored):
```
npm run build:lib     EXIT 0     (dist/keyframes.js — needed by the two lib-probe gates)
npm run gh-pages      EXIT 0     (dist/gh-pages/  — the demo the gates drive)
```
Order matters: `build:lib` (outDir `dist/`) empties `dist/gh-pages/`; `gh-pages` (outDir `dist/gh-pages/`) leaves `dist/keyframes.js`. Building lib **then** gh-pages leaves both artefacts present (both are required simultaneously by DM-11b/13).

**Local gate re-runs** — each with the ci.yml demo-gate env (`KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui`, `KF_REQUIRE_BROWSER=1`; playwright-core resolves from glass-ui — the repo has none). Every gate below **reproduced its CI red on macOS**:

| Gate | Local cmd exit | Reproduced? |
|---|---|---|
| `proof:styling-idioms` (static) | FAIL | ✓ identical |
| `proof:engine-no-throw-on-play` (DM-13) | FAIL | ✓ identical |
| `proof:subject-animates` (DM-11b) | FAIL (Timeout) | ✓ identical |
| `proof:fsm-suspend-resume-live` (DM-14) | FAIL clause (c) | ✓ identical |
| `proof:demo-usability` | FAIL | ✓ identical |
| `proof:icon-paint-live` | FAIL | ✓ identical |
| `proof:easing-sidebar-minimal` | FAIL | ✓ identical |
| `proof:cold-entry` | FAIL (4) | ✓ identical |
| `proof:drag-gesture` | FAIL (1) | ✓ identical |
| `proof:scene-perf-budget` | FAIL (A2) | ✓ identical |

Plus an **instrumented playwright probe** replaying DM-11b's exact importmap + module-load to capture the swallowed error (script in scratchpad):
```
node --input-type=module … (serve dist/keyframes.js under /__kf-lib__/, importmap {"@mkbabb/value.js":"/__kf-vendor__/value.js"})
  → READY= undefined | __kfErr= TypeError: Failed to resolve module specifier "@mkbabb/value.js/math"
```

**Root-cause confirmations:**
```
grep morph-ghost demo/scenes/morph/MorphTarget.vue   → :71 uses .morph-ghost--from; rules define .morph-ghost (:246) + .morph-ghost--to (:256); --from is ORPHAN
grep '"@mkbabb/value.js/[a-z]+"' dist/*.js            → "@mkbabb/value.js/math" (lazy engine chunk)
node -e exports @mkbabb/value.js                      → ./math → ./dist/subpaths/math.js (subpath split; value.js O)
grep -ln '"@mkbabb/value.js":"/__kf-vendor__' scripts/proof-*.mjs
                                                       → ONLY proof-engine-no-throw-on-play.mjs + proof-subject-animates.mjs
router.ts:27                                           → name: s.id  (COMPUTED, not a string literal)
scripts/proof-demo-usability.mjs:75                    → /\bname:\s*"([^"]+)"/g  (matches LITERALS only)
```

---

## 3. Findings with file:line evidence

### 3.1 The three named gates (Q12's direct charge)

**DM-13 `proof:engine-no-throw-on-play` → HARNESS (importmap subpath gap). NOT calibration, NOT an engine regression.**
Every real engine clause passes locally — `[a]` rainbow group-play (home+cube) zero pageerror, `[b]` zero `"......"` parse lines, `[c]` cube transform paints 122 distinct matrices, `[d]`/`[J.W1 a]` keyframes pane verbatim. Only `[J.W1 b]` "the live library probe" reds:
```
✗ [J.W1 b] page.evaluate: TypeError: Failed to resolve module specifier "@mkbabb/value.js/math".
```
The probe HTML (`scripts/proof-engine-no-throw-on-play.mjs:172`) ships an importmap that maps **only the bare** `"@mkbabb/value.js"` → `/__kf-vendor__/value.js`. Since value.js O did the **subpath split** (`./math`, `./color`, `./easing`, … → `dist/subpaths/*.js`), the built lib's lazy engine chunk imports `@mkbabb/value.js/math`, for which the importmap has **no** entry → hard resolve failure in the browser. **Device-independent** (reproduces on macOS). Matches the spec's predicted "importmap harness fix." ✅ spec-row-12 correct.

**DM-11b `proof:subject-animates` → HARNESS (the SAME importmap gap), masquerading as a runner render-race.**
CI signature: `page.waitForFunction: Timeout 30000ms exceeded at proof-subject-animates.mjs:168` — the textbook *device-dependence* look (a timeout on the slow runner). It reproduces **on macOS at full speed**. My instrumented probe proves the mechanism: the probe HTML (`scripts/proof-subject-animates.mjs:83`) carries the **identical** bare-only importmap; line 92 `await import("/__kf-lib__/keyframes.js")` throws `Failed to resolve module specifier "@mkbabb/value.js/math"`, so line 116 `window.__kfReady = true` **never runs**, and the line-168 `waitForFunction(() => window.__kfReady === true)` times out. The subject-write seam is never even exercised. **This is NOT "fix or calibrate" the subject-write path (spec row 10) — it is the same one harness importmap fix as DM-13.** DM-13 and DM-11b are the **only two** gates in the roster that use the vendor importmap lib-probe (`grep -ln … scripts/proof-*.mjs`), so the blast radius is exactly two. ⚠️ spec-row-10 mis-shaped.

**DM-14 `proof:fsm-suspend-resume-live` → GENUINE defect (spring resume-iff-was-playing). NOT timing calibration.**
Clauses (a) [synthetic visibility tick → zero `_gen` throw], (b) [live easing→amiga switch non-blank], (d) [no unbound-method callbacks] all **pass locally**. Only clause (c) reds, deterministically:
```
✗ clause (c) RED (resume-iff-was-playing): springPlaying(entry)=true,
  springPausedAfterClick=false, springResumedPaused(return)=false, springLiveAfterReturn=false.
```
The load-bearing sub-signal is `springPausedAfterClick=false`: the harness clicks pause on the spring scene and the scene **does not pause** — so the within-session suspend algebra can't hold. This is a real product/demo defect on the spring scene's pause→resume continuity, reproducing at full macOS speed. **The spec's "timing calibrate" disposition (row 13) would repeat exactly the r8-F1 "mislabel a runner-red as ENV" error.** ⚠️ spec-row-13 wrong.

### 3.2 The named "genuine" red (library gate) — confirms spec

**`proof:styling-idioms` → GENUINE source defect. Deterministic.** Reproduces byte-identically locally:
```
✗ morph-ghost--from (×1, first: demo/scenes/morph/MorphTarget.vue)
```
`MorphTarget.vue:71` applies `class="morph-ghost morph-ghost--from"`; the scoped `<style>` defines `.morph-ghost` (:246) and `.morph-ghost--to` (:256) but **no** `.morph-ghost--from`. R.W5 fallout. One-line fix. ✅ spec correct.

### 3.3 The broader demo-smoke plane — the spec's "device-dependence" is REFUTED

Every remaining blocking red I re-ran reproduces deterministically on macOS. **None** is a render-race. The true taxonomy of the sample:

| Gate | CI signature | LOCAL verdict | Class |
|---|---|---|---|
| `demo-usability` | "every scenes.ts id UNROUTED (falls to catch-all)" | reproduces | **GATE-STALENESS false-positive** |
| `cold-entry` | hero/cube/amiga/square cold-play never starts engine | reproduces | **GENUINE born-RED P0** (resume no-op) |
| `drag-gesture` | 1 drag surface leaves `userSelect:auto` mid-gesture | reproduces | **GENUINE demo** |
| `icon-paint-live` | 5 demo-side `::view-transition-*` residue rules | reproduces | **GENUINE demo · glass-ui-touching** |
| `easing-sidebar-minimal` | sidebar still renders a CSS-value text input | reproduces | **GENUINE born-RED demo** |
| `scene-perf-budget` | AmigaScene omits `setPixelRatio(min(dpr,2))` cap | reproduces | **GENUINE source** (static check) |

**`demo-usability` is a false positive.** `router.ts:23-31` GENERATES routes from `allScenes.map(s => ({ path, name: s.id, component: Stub }))` (R.W5's de-drift refactor). The gate (`scripts/proof-demo-usability.mjs:75`) scans router.ts with `/\bname:\s*"([^"]+)"/g` — **string literals only**. Since `name: s.id` is a computed expression, the regex finds **zero** route names and declares all 9 scenes UNROUTED. The demo routes every scene correctly; the gate's static parser was never updated for the generated-route form. This is a **third** non-genuine class the spec's model doesn't name: *gate-staleness*.

**`scene-perf-budget` is a genuine STATIC source assertion** (`A2: AmigaScene must cap setPixelRatio(Math.min(devicePixelRatio,2))` — `dpr*2` draws a 4× buffer), not a perf-threshold that the runner could tip. Even the most "calibration-shaped" gate in the set is deterministic source.

### 3.4 LoAF + check-failures (the exit-code items) — calibration/plumbing, confirmed

CI shows the vitest bench PASS its metric and the STEP still exit 1:
```
✓ bench/playwright.bench.ts > LoAF >50ms-trace gate … 30449ms
  no >50ms frame during the large AnimationGroup composite      ← metric GREEN
##[error]Process completed with exit code 1.                    ← step RED anyway
```
This is the documented "exit-code flake with a GREEN metric" (S.A0's decouple item; `KF_LOAF_COUNT: "48"` calibration already present at ci.yml:1699). `check-failures` is the correct aggregate: it re-reds the whole job because the 14 blocking steps above each exited 1 under `continue-on-error: true`. That aggregation is working as designed; the reds beneath it are the real content.

**Sample tally (11 gates verified locally):** genuine source 2 · genuine demo (incl. born-RED) 5 · harness importmap 2 (**DM-13 + DM-11b, one shared fix**) · gate-staleness false-positive 1 · exit-code/plumbing 1 · **true device-dependence render-race: 0.**

---

## 4. VERDICT: **adjusts-spec**

Q12's binary ("calibration or genuine") resolves to a **three-way** answer, and the broader "device-dependence plane" framing is refuted by the running gates:

- **DM-13** = harness (importmap subpath). ✅ as spec predicted.
- **DM-11b** = harness (the **SAME** importmap subpath), NOT a subject-write "fix or calibrate." It is **not** an independent defect — it is DM-13's fix, seen through a second gate. The 30s-timeout signature is a *swallowed* deterministic module-load throw, the exact r8-F1 trap.
- **DM-14** = **genuine** deterministic defect (spring pause/resume continuity), NOT timing calibration.

**The adjustment to spell out (for SPEC-v2 / S.A1 / S.A2):**

1. **Re-disposition the three rows.** DM-13 **and DM-11b** collapse to **ONE harness fix**: teach the vendor importmap the value.js subpath namespace. Concretely, in the two lib-probe gate scripts (or their shared helper): add importmap `"@mkbabb/value.js/": "/__kf-vendor__/value.js/dist/subpaths/"` (keep the bare `.` → `…/dist/value.js`) **and** serve the whole `node_modules/@mkbabb/value.js/dist/` tree under `/__kf-vendor__/value.js/` so the subpath files and their relative hashed chunks resolve. DM-14 is a **source fix on the spring scene**, not a calibrate. Change spec row 10 "fix or calibrate" → "harness fix, shared with row 12"; row 13 "timing calibrate" → "genuine spring resume-iff source fix."

2. **Correct the §2.1 causal model.** The 14 blocking demo reds are **not** "the device-dependence plane." In an 11-gate verified sample, device-dependence render-races were **zero**. The plane is: genuine source/demo defects (majority, several born-RED awaiting their own wave's cure) + one shared harness importmap bug (2 gates) + at least one **gate-staleness false-positive** (`demo-usability`) + the LoAF exit-code decouple. **S.A0's action items survive** (fix genuine reds, decouple LoAF, drive the full chain in one non-fail-fast pass) — the KEYSTONE is correctly aimed — but its **sizing and shape change**: most of the 14 need real code fixes, not an observe-only reclassification.

3. **S.A2 needs a fourth disposition bucket.** Its "genuine → FOLD; absolute-threshold → relative budget; binary-absent → install-or-observe" triad has **no bucket for gate-staleness** (a gate whose static parser drifted from a refactor it should tolerate — `demo-usability`'s literal-name regex vs the generated-route form). Add: *stale-gate → re-point the gate's parser/selector; a green demo must not red on a gate's own obsolescence.* Splitting demo-smoke into correctness/observe (S.A2's core move) will **not** green these — they are correctness reds and gate bugs, not device noise.

4. **The r8-F1 lesson is live, not historical.** DM-11b (timeout-shaped, actually deterministic) and DM-14 (spec pre-labeled "timing calibrate," actually genuine) are two fresh instances of "runner-red mislabeled as ENV." S.A1's VERIFY-ONLY-terminal-ization must **re-derive each disposition from a reproduced signature**, never inherit the spec's pre-written guess.

---

## 5. Implementation-cost estimate for the real wave (S.A0/S.A1/S.A2)

**Files touched (source/gate — small, high-certainty):**
- `demo/scenes/morph/MorphTarget.vue` — add `.morph-ghost--from` rule (or drop the modifier). **1 line.** Greens `styling-idioms`. (S.A0)
- `scripts/proof-engine-no-throw-on-play.mjs` + `scripts/proof-subject-animates.mjs` (or a shared serveProbe helper) — importmap subpath namespace + serve the value.js `dist/` subtree. **~10-20 lines, ONE change replicated twice.** Greens **both** DM-13 and DM-11b. (S.A1)
- `scripts/proof-demo-usability.mjs:75` — teach the route-name parser the generated `name: s.id` form (parse `allScenes.map`, or assert reachability at runtime instead of by regex). **~5-15 lines.** Greens `demo-usability`; removes a false-positive. (S.A2/S.A4)
- ci.yml LoAF step — decouple the vitest process exit from the metric (assert `window.__kfLoaf` in a node wrapper; don't let bench non-zero exit gate the job). **~5 lines.** (S.A0)
- **Spring scene source** (`scenes/spring/…` + `scenePlaybackAdapters.ts` pause/resume) — the DM-14 resume-iff defect. **Genuine behavioural fix; needs a live repro-and-verify, not a one-liner.** Est. ½-1 day.
- **`cold-entry`** — the `resume()` no-op on a never-started group (`scenePlaybackAdapters.ts:76-79`, per the gate's own citation) — make `resume()` total (→ `group.play()` on a fresh group). Greens `cold-entry` (4 clauses) and is likely upstream of several `live-session` charges. **Genuine fix; ~½ day incl. verify.** (this is the spec's own S1 "greens on S1" — confirmed live)
- The residual demo born-REDs (`drag-gesture`, `easing-sidebar-minimal`, `scene-perf-budget` A2, `icon-paint-live` DC-8) — each a bounded demo/source fix; `icon-paint-live`'s `::view-transition-*` residue is **glass-ui-touching** (confirm whether the KILL target lives in glass-ui's cards/VT or in demo CSS before sizing).

**Gates affected:** greening the above flips `styling-idioms`, DM-13, DM-11b, `demo-usability`, LoAF-step, and (with source work) DM-14, `cold-entry`, `drag-gesture`, `easing-sidebar-minimal`, `scene-perf-budget` → and cascades into `live-session` (the gate-of-gates) and `visual-lock`. Not verified locally this pass (slow/bench): `computed-real-dom`, `lighthouse-a11y`, `scene-parity`, `live-session`, `live-session-mobile` — size them by re-running post-fix, since several are downstream of `cold-entry`/`subject-animates`.

**Risk:**
- **LOW** for the harness + false-positive + one-liners (styling-idioms, importmap ×2, demo-usability, LoAF). These are the fast majority of the CI-red surface and unblock the KEYSTONE cheaply.
- **MEDIUM** for the genuine behavioural fixes (DM-14 spring resume, cold-entry resume-totality) — real product logic; each needs live drive-and-observe (do not trust the gate's green alone; the r8-F1 discipline cuts both ways).
- **PROCESS risk if unheeded:** treating DM-11b/DM-14 as "calibrate" (the spec's current rows) would ship a *masking* change (loosen a threshold / widen a timeout) over a deterministic bug — R's exact failure mode, re-committed. The one-pass keystone (S.A0) is only meaningful if each red is discharged by cause, verified against a reproduced signature.

**Bottom line for S.A's sizing:** the master-CI red is **cheaper in false-positives/harness than the spec assumes, and more expensive in genuine source/demo fixes** — but it is fully deterministic and fully reproducible off the runner. "CI green in one pass" is achievable, but the pass is a **fix-by-cause sweep** (source + demo + 2 harness + 1 gate-staleness + 1 exit-decouple), not a device-dependence reclassification.
