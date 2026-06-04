# Tranche B — PROGRESS

Status board for keyframes.js' second tranche. The plan is `B.md`; the close
report is `FINAL.md` (authored at W7). Audit evidence is under `audit/`.

## Phase

**IMPLEMENTATION COMPLETE** (W0-W7 landed on branch `tranche-b`, PR #2).
The development half (W0) closed the audits; the implementation half
(W1-W7) is executed and gated. FINAL.md records the close; the publish leg
(changeset → tag → release.yml provenance) is user-domain, confirm-first.

## Wave status

| Wave | Title | Phase | Status | Hard gate |
|---|---|---|---|---|
| **B.W0** | Audit + precept edict + before/after harness | DEV | **in progress** | B.md + W1-W7 specs + this board; precept before/after edict committed (`8ccf9f4`, push pending); BEFORE harness + 18 screenshots + occlusion + lighthouse + dep matrix on disk; deferred ledger complete; full prompt recap. |
| **B.W1** | Dependency upgrade (matrix → gated bump) | IMPL | **done** | Demo/tooling deps to latest behind a regression gate; majors breaking-read; library deps confirmed latest. |
| **B.W2** | Engine debt transposed (gestalt) | IMPL | **done** | One `ReducedMotionSnap` contract; group reset/fill contract retires the TODO(HIGH); fail-explicit honored; eager-resolve catch; 16 TODOs classified; `proof:boundary` all-light-entries. |
| **B.W3** | Demo correctness + occlusion-free (inv δ) | IMPL | **done** | 4 blank scenes render at idle; cube never clips; hero never overlays; top dock clears mobile safe-area; Playwright occlusion gate green on every page × {375,1280,1440}. |
| **B.W4** | Loading perf (prod build + splash + lazy) | IMPL | **done** | gh-pages emits real entry+CSS (bootstrap → main.ts); splash removed + instant paint; monaco/three lazy; real prod-perf measured; demo smoke gate (inv γ). |
| **B.W5** | Design system (φ-ladder + serif + a11y/SEO) | IMPL | **done** | glass-ui `text-display-*`/`--type-*` adopted; one display serif; ad-hoc CSS → tokens; a11y (`landmark-one-main`,`image-alt`) + SEO closed; dock double-click → glass-ui ask. |
| **B.W6** | Perfected CI (inv γ+δ + boundary + lockfile) | IMPL | **done** | Demo smoke gate; occlusion gate; `proof:boundary` all-entries; lockfile reconciled glass-ui-absent + /tmp verify; before/after π gate; node-20 actions → v5. |
| **B.W7** | Close ceremony (π full + DELTA + release) | IMPL (LAST) | **done** | AFTER capture + per-page DELTA.md (full visual binding); π not floor; ι + overfitting + FINAL (reconciles A's stale W4.md / lockfile prose / off-by-one) + changeset. |

## W0 audit evidence (on disk)

- **Dep matrix** (`audit/dep-upgrade-matrix.txt`) — library deps already latest; demo/tooling minors + 6 majors (zod 3→4, vue-sonner 1→2, @iconify/vue 4→5, jsdom 26→29, vite-plugin-dts 4→5, @types/node 24→25).
- **BEFORE screenshots** (`audit/screenshots/before/` — 18: 6 pages × {mobile 375, laptop 1280, desktop 1440}), 0 console errors, dev server.
- **Occlusion report** (`audit/occlusion-report.json`) — home+cube clip 18-20 elements (cube off right edge); amiga/square/easing/spring "clean" because empty.
- **Lighthouse** (`audit/lighthouse/`) — A11y 92-98 (`landmark-one-main`,`image-alt`), BP 100, SEO 75-82, CLS 0.006-0.01; perf unmeasurable (prod build broken).
- **Plan audit** (`audit/plan-findings.txt`) — 46 findings (11 high). Boundary hole (only SpringProgress proven), eager-resolve unhandled rejection, 16 uncounted TODOs, fail-explicit gap, glass-ui-present lockfile.
- **Design audit** (`audit/design-findings.txt`) — 43 findings (4 blocker): blank prod build, 4 blank scenes, hero-over-cube, cube right-edge clip; mobile dock clipping; φ-ladder fork.

## Verified facts at B-open

- **3.0.0 is live** (`npm view @mkbabb/keyframes.js version` → 3.0.0; `v3.0.0` tag; SLSA provenance attestation present).
- **Prod gh-pages build is broken** — emits a 698-byte preload shim, no app entry/CSS (rolldown tree-shook the inline `<script type=module>` bootstrap in `index.html:38-46`). Root cause + fix (extract → `main.ts`) identified.
- **4 of 6 scenes render blank at idle** (amiga/square/easing/spring) in every viewport.
- **inv α gate is narrow** — `proof:boundary` builds only the `SpringProgress` entry; 5 of 7 light modules unproven.
- **Committed lockfile is glass-ui-present** (optional) — contradicts FINAL.md's "regenerated glass-ui-absent"; inv β survives via `optional:true` skip.
- **Precepts synced** — `main` at canonical `63240e6`; B authors the before/after edict at `8ccf9f4` (push pending). In-flight `N/O-W10-precepts-hardening` branches noted (additive edict on main).

## Cross-repo / outward perimeter (USER-DOMAIN — confirm before each)

1. **Push the precept edict** — precepts `main` `63240e6`→`8ccf9f4` + keyframes gitlink bump. Authored + committed locally; awaiting confirm.
2. **Dock double-click + VAL-9 token regen** — glass-ui-owned (B.W5 outward asks).
3. **The B release** (W7 changeset → tag → publish) — user-domain, as in A.

## Open deferrals

None beyond the named-forward `Worker`/`OffscreenCanvas` substrate (no consumer). B runs zero-deferral: every audit finding + in-code TODO + A named-forward lands in a wave with a real owner (no phantom destinations).
