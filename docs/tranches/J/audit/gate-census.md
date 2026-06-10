# Gate Census — the proof estate as an architecture (Tranche J audit)

Lane: `gate-census`. Date: 2026-06-09. Tree: branch `master`-lineage (audited on
working tree), clean. Read-only. Every claim carries a command + observed output
or `file:line`.

## 0 — Headline verdicts

| # | Finding | Sev | Disp |
|---|---------|-----|------|
| GC-1 | **43 gates redefine `serveDist()`, 51 redefine `MIME`, 54 of 57 browser gates resolve chromium INLINE** — the lib (`scripts/lib/demo-driver.mjs`) already exports `serveDist`/`resolveChromium` but only **7** files import it. ~1 kLoC of byte-identical boilerplate. PRIME J transposition. | P1 | FOLD |
| GC-2 | **`proof:all` ≠ CI gate set.** 3 gates (`dock-zorder`, `scene-control-dfa`, `scene-transition-perf`) run in CI but are in NO package.json aggregator. A dev running `proof:all` gets a WEAKER verdict than CI. | P1 | FOLD |
| GC-3 | **Meta-gate `proof:gate-is-runtime` audits a HARDCODED list of 9 — it omits `proof:demo-fonts`**, which IS in the correctness tier. The list is not derived from `proof:correctness`, so a correctness gate can be added without the meta-gate noticing. | P1 | FOLD |
| GC-4 | **`proof:demo-fonts` is a LOAD-REST gate sitting in the CORRECTNESS tier** — `goto`+`waitForTimeout`+read computed font, NO actuation primitive. The oracle-precept says correctness gates actuate (PLAY+SWITCH+DRAG, budget 0). | P1 | FOLD |
| GC-5 | **`proof:repin-safe` is stale-by-construction** — a one-shot G.W1 pre-stage gate targeting value.js `0.11.1`/parse-that `0.9.0`; tree is now `^0.11.2`. The re-pin it gated is long done. NO-legacy applies to gates. | P1 | KILL |
| GC-6 | **Dangling COMMENT references to the 5 deleted H proxy gates in ci.yml** (lines 204, 230-234, 293, 345, 485, 543). The gate FILES are correctly gone; the comments name them as if live. Stale-doc debt. | P2 | FOLD |
| GC-7 | The error-budget NAMED_BENIGN allowlist is genuinely **single-source** (only in `proof-live-session.mjs:120-140`) — but it lives INSIDE live-session, not in a shared lib, so any future console-budget gate re-derives it. | P2 | BOOK |
| GC-8 | `proof:all` is **fully serial** (`&&`, 91 hygiene stages + 10 correctness); ≈57 browser-launch gates → estimated 8-15 min local wall-clock. Estate = **35,227 LoC across 93 proof scripts**. Sustainable today; the dup (GC-1) is the lever. | P2 | BOOK |
| GC-9 | The 5 H proxy gates claimed RETIRED in I are **verified DELETED** from the tree (`proof-demo-console-clean`, `-dock-morph-settled`, `-no-orphan-specular`, `-scene-icons`, `-dragscrub-single`, `-no-route-storm`). Claim HOLDS. | — | VERIFY-ONLY |

---

## 1 — Census (counts, commands)

```
$ ls scripts/*.mjs | wc -l            → 97 (.mjs files)
  - proof-*.mjs                       → 93
  - non-proof gates                   → 4  (capture, demo-smoke, lighthouse-gate, occlusion-gate)
$ ls scripts/lib/                     → demo-driver.mjs (455 LoC), typing-dots-harness/
$ wc -l scripts/proof-*.mjs | tail -1 → 35227 total
```

**Aggregator membership** (`package.json` scripts, parsed):
- `proof:correctness` = 10 members (the actuating-runtime tier).
- `proof:hygiene` = 90 members (source-shape / jsdom / config / static-browser).
- `proof:all` = `proof:correctness && proof:hygiene` = 100 distinct gates.
- DEFINED `proof:*` keys = 106 (excl. all/correctness/hygiene).

**Reachability buckets** (cross-tabulated package.json aggregators × ci.yml):

| Bucket | Count | Gates |
|--------|-------|-------|
| In `proof:all` AND CI | 100 | (the bulk) |
| **In CI, NOT in `proof:all`** | 3 | `proof:dock-zorder`, `proof:scene-control-dfa`, `proof:scene-transition-perf` (GC-2) |
| In `proof:all`, NOT in CI | 0 | — |
| **TRUE ORPHANS** (no aggregator, no CI) | 3 | `proof:repin-safe`, `proof:lighthouse-mobile`, `proof:browser` |

The 3 true orphans are FORMALLY RECORDED as deliberate exclusions in
`scripts/proof-ci-coverage.mjs:100-114` (`EXCLUDED` set) with reasons:
- `proof:browser` — local dev meta-target that re-invokes CI-wired gates (`proof-browser.mjs:1-18`). Legit.
- `proof:lighthouse-mobile` — RECORDED browser-gated/runner-calibrated (ci-coverage:29).
- `proof:repin-safe` — G.W1 PRE-STAGE re-pin lock (ci-coverage:32-40). **STALE — see GC-5.**

`proof:ci-coverage` enforces every non-excluded `proof:*` IS invoked in CI
(`proof-ci-coverage.mjs:118-130`). That is why GC-2's 3 gates are in CI: they pass
ci-coverage. But ci-coverage does NOT enforce the converse (CI ⊆ proof:all), so
the local/CI asymmetry is invisible to it.

**Oracle-class split** (browser vs static; `\.launch\(|KF_PLAYWRIGHT_DIR` grep):
- BROWSER (actuating-runtime / static-browser): **57** proof gates.
- STATIC (source-shape / config / jsdom): **36** proof gates.

---

## 2 — Architecture audit

### 2(a) — Duplication (the prime J transposition)  [GC-1]

The shared harness `scripts/lib/demo-driver.mjs` already exports:
```
261:export function resolveChromium()
293:export function serveDist(distDir)
335:export async function openControlsPanel(page)
419:export async function subjectRect(page, selector)
```
Yet adoption is near-zero. Importers of `lib/demo-driver` (`grep -rln`):
```
capture.mjs, lighthouse-gate.mjs, occlusion-gate.mjs,
proof-lighthouse-mobile.mjs, proof-manifest-sourced.mjs,
proof-typing-dots.mjs, proof-visual-lock.mjs           → 7 files
```

Boilerplate redefined inline (each its OWN copy):

| Boilerplate | Inline-defined count | Command |
|-------------|----------------------|---------|
| `function serveDist()` | **43** | `grep -rnE 'function serveDist\(\)' scripts/*.mjs \| wc -l` |
| `const MIME` map | **51** | `grep -rln 'const MIME' scripts/*.mjs \| wc -l` |
| chromium resolve via `KF_PLAYWRIGHT_DIR` inline (not lib) | **54 of 57** | node count below |

The 43 `serveDist` bodies are **byte-identical** (verified by reading
`proof-bezier-grown.mjs:134`, `proof-drag-gesture.mjs:76`, `proof-live-session.mjs:237` —
same `http.createServer` + path-traversal guard + `fs.createReadStream().pipe`).
The lib's `serveDist(distDir)` even DIVERGED (takes a param) — so the 43 copies
are stale relative to the canonical one (NO-legacy violation against the lib).

**Consolidation win estimate:** serveDist ≈15 LoC + MIME ≈2 LoC + inline
chromium-resolve ≈10 LoC + the launch→newContext→try/finally→close lifecycle
(re-handrolled everywhere) ≈20 LoC ⇒ **~45 LoC × ~50 gates ≈ 2 kLoC removable**.
The lib lacks a `withPage()`/`withBrowser()` lifecycle export — adding one (open
server, resolve chromium, newContext, run fn, finally close) would let every
browser gate shrink to its ACTUAL oracle. This is the highest-leverage J
transposition in the estate.

```
$ node -e '... files with KF_PLAYWRIGHT_DIR && !demo-driver ...' → 54
```

### 2(b) — The hygiene tier: retire / keep / stale

I.W7's EXPLICIT posture (`PATH-FORWARD.md` §104 line 7): *"Keep the ~54
source-shape/jsdom gates — they are cheap and police real invariants."* So the
RETIREMENT axis was deliberately decided (keep) in I. J should NOT relitigate
wholesale retirement; the open axes are:

- **STALE-BY-CONSTRUCTION (retire/KILL):** `proof:repin-safe` — GC-5. Targets
  `VALUEJS_TARGET = "0.11.1"` (`proof-repin-safe.mjs:40`) and the
  `0.10.0→0.11.0`/`0.8.2→0.9.0` re-pin (`:3-5`); tree is `@mkbabb/value.js
  ^0.11.2`, `@mkbabb/parse-that ^0.9.0` (the re-pin happened in G). The gate
  certifies a transition that is HISTORY. A one-shot pre-stage gate has a
  terminal home: KILL it (P-invariant-28: no perpetual punt) or RECORD it as a
  template, but it must not masquerade as a live exclusion.
- **REDUNDANT-vs-correctness:** none found beyond the 5 already deleted in I. The
  surviving hygiene gates police DISTINCT source/config invariants; spot-checks
  (`proof-no-deprecated-guard`, `proof-single-writer`, `proof-decomposition`)
  assert shapes the live-session/correctness gates cannot see. Keep stands.
- **CI-comment staleness:** GC-6 — ci.yml still NAMES the 5 deleted gates in
  comments as if they gate (e.g. `:204` "Gated by proof:dock-morph-settled").
  The retired-gate FILES are gone (GC-9), but the prose lies. NO-legacy applies
  to comments.

### 2(c) — Total `proof:all` wall-clock  [GC-8]

```
$ node -e 'count && in proof:hygiene'  → 90 (=> 91 serial stages, no parallelism)
proof:correctness = 10 serial stages
```
Both aggregators are pure `&&` chains — fully serial, no `concurrently`/`-p`.
57 browser-launch gates dominate (each: spawn chromium + serve dist + drive +
close ≈ 3-8 s). Estimate: 57 × ~5 s ≈ 5 min browser + 36 static gates + the
trailing `vitest run` (261 tests) ⇒ **~8-15 min local `proof:all`**. CI splits
into 2 jobs (`runs-on: ubuntu-latest`, `timeout-minutes: 10` and `20` —
ci.yml:50-51, 190-191). Sustainable TODAY, but the GC-1 dup is the only thing
between the estate and a `withPage` harness that would also enable trivial
parallelism (`vitest`-style pooling). Recommend: BOOK a wall-clock MEASUREMENT
(measure-first) before any parallelization wave.

### 2(d) — Error-budget allowlist: one source or drift?  [GC-7]

**ONE structured definition, verified.** The named-benign allowlist
(`NAMED_BENIGN` array + `isNamedBenign`) exists in exactly ONE file:
```
$ grep -rln 'NAMED_BENIGN' scripts/*.mjs → scripts/proof-live-session.mjs only
```
`proof-live-session.mjs:79-140` documents it as "THE ERROR BUDGET, DEFINED ONCE
(the structured allowlist; H-2)" — the COMPLEMENT-of-named-EXCLUDED design (not a
positive match list, the explicit anti-pattern that let B1's flood through H's
`proof-demo-console-clean`). No drifting copies. BUT it is NOT in `scripts/lib/`
— it is a private const inside the gate-of-gates. A future console-budget gate
would have to re-derive the React/Vue-DevTools + vite-dep-optimizer + Monaco
content-visibility exclusions. J should promote it to `scripts/lib/` alongside
the `withPage` harness so the budget is the SINGLE authority any gate consumes.

---

## 3 — Cross-check: `proof:gate-is-runtime` vs reality  [GC-3, GC-4]

The meta-gate (`proof-gate-is-runtime.mjs`) hardcodes its audit set
(`:84-93` `WAVE_HARD_GATES`):
```
I.W0 engine-no-throw-on-play, I.W1 fsm-suspend-resume-live, I.W2 easing-editor-live,
I.W3 amiga-subject-is-pivot, I.W4 drag-gesture + perf-frame-budget,
I.W5 icon-paint-live, I.W6 specular-absent-at-rest, I.W7 live-session   → 9 gates
```
The ACTUAL `proof:correctness` tier has **10** members. The diff:
```
$ node -e 'correctness − meta-audited' → *** proof:demo-fonts
```
**`proof:demo-fonts` is in the correctness tier but the meta-gate does NOT audit
it.** The meta-gate's view does NOT match reality. Two compounding defects:

1. **GC-3 (structural):** `WAVE_HARD_GATES` is a hardcoded literal, not derived
   from `proof:correctness`. Any correctness gate added later escapes the
   precept-enforcer silently. The meta-gate's own thesis ("mechanically prior,
   not authorially prior" — `:30-36`) is undermined by an authored list.
2. **GC-4 (oracle-precept):** `proof-demo-fonts.mjs` has NO actuation primitive —
   `grep page.click|mouse|dispatchEvent|press|hover` → empty; it is
   `goto`+`waitForTimeout(1200)`+read computed font (`:68-72`). It is a
   LOAD-REST gate. The precept (`gate-is-runtime.mjs:7-13`) demands correctness
   gates actuate the running product across PLAY+SWITCH+DRAG with budget 0. A
   computed-font-at-rest oracle is appearance-axis (defensible as "a rendered
   property a human checks") but does NOT run the interaction battery — so it is
   either (i) mis-tiered (belongs in a NEW "appearance-at-rest" sub-tier the
   taxonomy lacks), or (ii) must be upgraded to actuate (switch scenes, re-check
   font survives). Today it hides in correctness WITHOUT meta-gate coverage —
   exactly the class of blind spot Tranche I existed to kill.

**Recommended J fix (GC-3+GC-4 together):** derive `WAVE_HARD_GATES` from
`proof:correctness` membership so the meta-gate audits ALL correctness gates;
then `demo-fonts` reds the meta-gate (no actuation) and forces the tier decision.

The meta-gate's SELF-classification is honest: it is in `proof:hygiene`, NOT
`proof:correctness` (`node -e` confirms), matching its own `:48-52` claim that it
reads gate SOURCE SHAPE and therefore carries no product-correctness authority.

---

## 4 — Fold list for J (terminal homes; P-invariant-28)

| Item | Origin | Status TODAY | Must-fold |
|------|--------|--------------|-----------|
| Harness consolidation: `withPage`/`withBrowser` + shared `serveDist`/`resolveChromium`/`MIME` in `scripts/lib/`; migrate ~50 gates | accreted A→I | 43× serveDist, 51× MIME, 54× inline chromium; lib at 7 importers | YES (GC-1) |
| `proof:all` ⊇ CI: wire `dock-zorder`/`scene-control-dfa`/`scene-transition-perf` into `proof:hygiene` (or document CI-only) | H.W7/H.W11 gates, I.W7 taxonomy missed them | CI-only, weaker local verdict | YES (GC-2) |
| Meta-gate derives its set from `proof:correctness`; audit `demo-fonts` | I.W7 hardcoded `WAVE_HARD_GATES` | 9-of-10 audited | YES (GC-3) |
| Tier-decide `proof:demo-fonts` (upgrade to actuate OR new at-rest sub-tier) | I.W6-font | load-rest in correctness tier | YES (GC-4) |
| KILL `proof:repin-safe` (stale one-shot) | G.W1 | targets 0.11.1; tree on 0.11.2 | YES (GC-5) |
| Strip 5 dead-gate names from ci.yml comments | I.W7 retirement | files gone, comments stale | YES (GC-6) |
| Promote NAMED_BENIGN budget to `scripts/lib/` | I.W7 H-2 | private const in live-session | measure-first (GC-7) |
| MEASURE `proof:all` wall-clock before any parallelization | A→I accretion | est. 8-15 min, unmeasured | BOOK (GC-8) |

Doc: `/Users/mkbabb/Programming/keyframes.js/docs/tranches/J/audit/gate-census.md`
