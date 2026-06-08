# impl-w8r-verify — H.W8R VERIFY LANE (the gate-regime close)

**Lane:** VERIFY (run builds/tests; resolve only obvious lane seams; diagnose honestly).
**Branch:** `tranche-h-impl`. **glass-ui:** pinned `~3.5.1`, installed **3.5.1**
(`package.json:166`, `node_modules/@mkbabb/glass-ui/package.json` → 3.5.1). KEPT (not reverted).
**Read first:** the 3 sibling lane notes — impl-w8r-specular-reconcile (A), impl-w8r-drift (B),
impl-w8r-disposition (C).

## VERDICT: NOT GREEN. proof:all (non-browser) is GREEN; the browser half of
**`proof:no-orphan-specular` is RED** — and the RED is a TRUE, live-reproduced defect, NOT a
gate artifact. The acceptance bar ("proof:all GREEN + the two specular gates CONSISTENT + NO
papered-over red") is **NOT MET**: stage-glass-card requires the stages to BE glass, and at
glass-ui 3.5.1 a glass Card's `::before` paints a VISIBLE specular bloom on hover — so
no-orphan-specular's pixel-truth half correctly bites. The two gates are NOT consistent; they
are CO-RED on the same surface. I did not paper it. Diagnosis + the precise hand-off below.

---

## 1. Result table (verbatim, this session)

| # | Check | Command | Result |
|---|-------|---------|--------|
| 1 | `npx tsc --noEmit` | (as-is) | **0 errors** (`TSC_EXIT=0`) |
| 2 | `npm test` | vitest | **GREEN** — 68 files, **682 passed \| 2 expected-fail** (684) |
| 3 | `npm run gh-pages` | vite build | **built in 1.43s** — warnings only (chunk-size, vendor `#__PURE__`, ineffective-dynamic-import); 0 errors |
| 4 | `proof:all` (non-browser) | `npm run proof:all` | **PASS** (`PROOF_ALL_EXIT=0`) — every static gate green incl. the named ones (below) |
| 5a | `proof:browser` (full sweep) | `KF_PLAYWRIGHT_DIR=…/value.js npm run proof:browser` | **FAIL (1/34)** — 33 ✓, **`proof:no-orphan-specular` ✗** |
| 5b | `proof:stage-glass-card` (browser) | (within 5a) | **✓** — the 4 stages each resolve ONE glass `<Card>` |
| 5c | `proof:visual-lock` (browser) | (within 5a) | **✓** — 49 regions ≤ tolerance vs the committed 3.5.1 baseline (11 absent/skipped) |
| 5d | `proof:demo-usability` (browser) | (within 5a) | **✓** |
| 5e | `proof:no-orphan-specular` (browser, standalone) | `KF_REQUIRE_BROWSER=1 …` | **FAIL** — 4 stage Cards paint the hover bloom (detail §3) |
| 6 | `proof:ci-coverage` (version-literal) | (within proof:all) | **PASS** — FLOOR glass-ui≥3.5.1; version-literal synced (no ci.yml literal disagrees); registry-glass-ui clean |
| 7 | `proof:chronic-closure` + `proof:manifest-sourced` | (within proof:all) | **PASS** — 4 chronics exit to discipline; SCENES≡scenes.ts (8 scenes) |

Playwright resolved via the sibling `KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/value.js`
(`PLAYWRIGHT_BROWSERS_PATH=~/Library/Caches/ms-playwright`); chromium launch smoke-tested OK before
the sweep. Both value.js AND glass-ui siblings carry resolvable playwright; kf has none locally
(CI installs `@playwright/test`).

### proof:all named-gate verdicts (verbatim slices)
- `proof:no-orphan-specular` — PASS **(static half only — browser half SKIPPED: "playwright not
  resolvable")**. This is the key caveat: proof:all's PASS does NOT exercise the pixel-truth half.
- `proof:decomposition` — PASS (library ceiling + 9 demo structural clauses; demo file-size → demo-no-oversize)
- `proof:timeline-rail-width` — PASS (rail·timeline·pane·root bind one --rail-width; no desktop cap leak)
- `proof:easing-canvas-bounded` — PASS (≤0.70 panel · ≤360px block · aspect 1/1 · J6-reconciled)
- `proof:brittleness` — PASS (rafplayback self-clean · listener→useEventListener · z-scale named tokens)
- `proof:dock-morph-settled` — PASS — **--spring-dock peak = 1.04501 → +4.5% ≤ +6% @ glass-ui 3.5.1**
- `proof:stage-glass-card` — PASS (4 stages each ONE glass Card)
- `proof:chronic-closure` — PASS (D2/D14 · D7 · D10 · **D5+D9**)
- `proof:manifest-sourced` — PASS; `proof:ci-coverage` — PASS

---

## 2. The drift resolutions (Lane B) — VERIFIED GREEN

All four of Lane B's non-specular drift-REDs verified green this session inside proof:all (static)
AND the live browser sweep:
- **(a) decomposition** — the 350-vs-500 DRY contradiction reconciled; demo file-size lives solely
  in `proof:demo-no-oversize`; library ceiling kept. PASS.
- **(b) timeline-rail-width** — the 3 stale measurements (W9 symmetric pad → `rail−24`; W7 full-bleed
  cap-leak; `.rounded-card` selector) reconciled; 4/4 GREEN live.
- **(c) easing-canvas-bounded** — the J6 grown-bezier vs W4 ceiling reconciled (ratio 0.55→0.70,
  block 280→360); the partner `proof:easing-sidebar-minimal` AGREES (zero `<h2>`). 5/5 GREEN live.
- **(d) brittleness + demo-usability** — rafplayback `onScopeDispose`, listeners→`useEventListener`,
  z-scale named tokens; the hero-gap aria-hidden selector fix. Both GREEN.

These are SOUND. Lane B's reconciliations are the same SHAPE as the intended specular reconcile
(retire a stale/contradicted half, keep the falsifiable structural half) and they each re-prove BITE.

---

## 3. THE RESIDUAL — diagnosed honestly, NOT papered

### What the browser half reports (verbatim)
```
✗ hover ::before — 4 hovered Card(s) STILL paint the specular catch-light radial on hover
  easing#2     (data-surface=glass): radial-gradient(circle, rgba(255, 255, 255, 0.55) 0%, …)
  spring#2     (data-surface=glass): radial-gradient(circle, rgba(255, 255, 255, 0.55) 0%, …)
  sequence#1   (data-surface=glass): radial-gradient(circle, rgba(255, 255, 255, 0.55) 0%, …)
  motion-path#1(data-surface=glass): radial-gradient(circle, rgba(255, 255, 255, 0.55) 0%, …)
proof:no-orphan-specular — FAIL (1)
```

### Live ground-truth probe (easing stage Card, 1440×900, the built dist)
```
.easing-target [data-surface=glass] .glass-specular-track (in .stage-cell)
  ::before background = radial-gradient(circle, rgba(255,255,255,0.55) 0%, …)
  ::before opacity AT REST  = 0.35
  ::before opacity ON HOVER = 0.59  (0.6 target; --specular-intensity:0.6 on :hover)
  ::before display = block, content = ""   → it PAINTS.
```
Evidence screenshot: `evidence/w8r-easing-stage-hover-bloom.png` (::before opacity 0.6 captured).
The bloom is FAINT on the light canvas (`mix-blend-mode: screen` adds warm-white minimally over a
near-white plate) but is unmistakably PAINTING; on the dark canvas glass-ui itself drops rest to
0.22 *because* screen-blend lifts harder on dark — i.e. glass-ui treats it as a visible layer.

### Root cause — the binding-truth premise is EMPIRICALLY FALSE at the installed 3.5.1
The brief asserts "glass-ui 3.5.0 KILLED that visible bloom (the hover-radial is dead) — so at
3.5.1 the glass stages are VISUALLY CLEAN (no bloom)." The installed package contradicts this:

`node_modules/@mkbabb/glass-ui/dist/styles/glass-specular-track.css` (shipped in 3.5.1) STILL paints
the `::before` radial — `hsl(40 30% 100% / 0.55)` (serializes to `rgba(255,255,255,0.55)`), rest
`--specular-intensity: 0.35`, and **`.glass-specular-track:hover::before { --specular-intensity: 0.6 }`**.
The radial is NOT dead. The glass-ui `<Card surface="glass">` auto-mints `glass-specular-track`
(verified: kf source carries NO `glass-specular-track` — kf DELETED its own `.cartoon-specular`
recipe; the class is 100% glass-ui-component-emitted). So every W11-I5 sanctioned glass STAGE Card
inherits the bloom by construction.

### The repo ALREADY KNOWS this — two gates contradict each other on the SAME 3.5.1 surface
`proof:specular-handoff` (which DID run in proof:all) records, verbatim:
```
· glass-ui 3.5.1 specular default — rest=0.35, hover=0.6, radius=55% (ask: rest≤0.25, hover≤0.4, radius≤40%)
◐ HANDOFF PENDING (born-RED witness — EXPECTED):
    the Card still emits glass-specular-track UNWIRED on the glass default
    rest intensity 0.35 > 0.25 · hover 0.6 > 0.4 · radial 55% > 40%
  kf cannot fix this (inv-16 — glass-ui owns the Card surface map).
```
So `proof:specular-handoff` HONESTLY says the 3.5.1 Card specular is UNRESOLVED (intensities exceed
the design ask) and green-reports only because it is a *consume-leg born-RED HANDOFF*. Meanwhile
`proof:no-orphan-specular`'s static docstring + browser half assert the OPPOSITE — "at glass-ui
~3.5.1 the radial is dead … NO Card paints a VISIBLE specular bloom." Both gates read the SAME
installed 3.5.1; one says alive-but-handed-off, the other says dead. The dead claim is the false one.

### The two specular gates are CO-RED, not CONSISTENT
- `proof:stage-glass-card` REQUIRES the 4 stages to be `surface="glass"` (W11 I5, the user's explicit ask). ✓
- A `surface="glass"` glass-ui 3.5.1 Card paints the bloom by construction (no `specular` prop exists
  on the installed Card to opt out — verified: zero `specular:` prop in the 3.5.1 dist; the
  `specular="off"` opt-out is a glass-ui **3.8.0** forward consume-edge, inv-16 forbids a fork).
- `proof:no-orphan-specular` (browser) asserts the stages paint NO visible bloom — which is FALSE.

Therefore the acceptance-bar consistency requirement ("stage-glass-card requires glass ⟺
no-orphan-specular sanctions those exact stages with NO bloom") is structurally UNSATISFIABLE at
3.5.1: glass ⟹ bloom. The reconcile (Lane A) made the two gates DRY-share the stage set, but it
could not make the pixel true — the static half passes (class-presence + `--mouse-x` write checks),
the browser half fails (actual `::before` paint).

### BITE-CONFIRM (the gate is NOT vacuous — it still bites real regressions)
Flipped `demo/easing/EasingSidebar.vue` `<Card surface="cartoon">` → `surface="glass"`, rebuilt,
ran the gate: **RED** — "demo/easing/EasingSidebar.vue — PANEL `<Card>` resolves surface=glass, NOT
cartoon … If this is meant to be a glass STAGE, it must live in a stage Target file derived from
scenes.ts STAGE_MODES." Reverted; `git status` clean (only lane-authored files; no verify-lane
source edits). The gate's falsifiability is intact; the current RED is a TRUE positive, not a
brittle/stale measurement.

---

## 4. Disposition — what is sound, what the lead must decide

**Sound and shippable (no action needed):**
- tsc 0 · npm test green · gh-pages builds · proof:all (static) green.
- D5 closes for REAL via a passing SYSTEM gate: `proof:dock-morph-settled` +4.5% ≤ +6% @ 3.5.1
  (consumed, not forked — inv-16). chronic-closure + manifest-sourced + ci-coverage green.
- Lane B's 4 drift resolutions are correct and falsifiable (verified live).
- `proof:stage-glass-card` + `proof:visual-lock` + the other 32 browser gates GREEN.
- glass-ui pin `~3.5.1` is correct vs 3.4.0 (visible centered bloom) and 3.6/3.7 (re-regress).

**The blocking residual (lead decision — outside the VERIFY mandate, and outside any single lane
seam I may resolve):** `proof:no-orphan-specular` browser-half RED is a TRUE defect — the W11-I5
sanctioned glass stages DO paint a hover specular bloom at the installed glass-ui 3.5.1
(rest 0.35 / hover 0.6 / radius 55%, exceeding the design ask 0.25/0.4/40%). The "radial is dead at
3.5.1" premise the reconcile rests on is empirically false. inv-16 forbids a kf fork, and the 3.5.1
Card exposes NO `specular` opt-out prop. The mutually-exclusive resolutions are all design calls:
  1. **Consume the glass-ui fix** — re-pin to the version that ships the calmer Card default +
     the `specular="off"` opt-out (the notes name 3.8.0), then pass `:specular="off"` on the 4
     stage Cards. Re-validate the dock retune + the no-regression band did not move (3.7.0
     re-regressed `no-orphan-specular` FAIL 2→3 per the repin lane — so a jump past 3.7 must be
     re-measured, not assumed). This is the clean close; it is gated on a glass-ui publish.
  2. **Reconcile no-orphan-specular's browser half to the born-RED HANDOFF reality** — i.e. align
     it WITH `proof:specular-handoff`: the bloom on the SANCTIONED glass stages is glass-ui-owned
     residue PENDING the consume-leg (exactly how the `<Button>`/dock tracks are RECORDED, not
     failed). The gate would still BITE a bloom on a PANEL Card or an UNSANCTIONED glass Card. This
     keeps the gate falsifiable and stops asserting a false "radial is dead" — but it is a gate
     edit on Lane A's central file, NOT a VERIFY-lane seam, and it must NOT be done as a
     paper-over: it is only legitimate if the bloom is genuinely a born-RED consume-leg HANDOFF
     (which `proof:specular-handoff` already establishes it is). I flag it; I do not make it.
  3. **Revert W11 I5** (stages back to cartoon) — contradicts the user's explicit ask; rejected
     unless the user reverses.

I did NOT edit any gate or source to force green (that would be the forbidden paper-over). The
honest state: **proof:all green, ONE browser gate RED on a real consume-leg specular defect, the
two specular gates CO-RED-by-construction at 3.5.1, fix gated on a glass-ui publish + opt-out or on
re-classifying the stage bloom as the same born-RED HANDOFF `proof:specular-handoff` already holds.**

## Files touched (VERIFY lane)
- `docs/tranches/H/audit/harden/impl-w8r-verify.md` — this record.
- `docs/tranches/H/audit/harden/evidence/w8r-easing-stage-hover-bloom.png` — the live bloom evidence.
No source/gate/config edits (the bite-test mutation was reverted; tree clean). DID NOT git commit
(the lead commits).
