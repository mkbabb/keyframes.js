# D — the prompt recap (A → B → C → constellation-drive → D-ask)

Every user request across the four prior phases plus this D ask, with a
per-request status (**ADDRESSED** = landed and verified in a prior tranche, no D
obligation · **D-SCOPE** = a named fold into a D wave) and evidence. The chain
extends C's recap (`docs/tranches/C/audit/lanes/prompt-recap.md`, which itself
chained B's, which chained A's). **No drops.**

The two historical drifts — **B's falsely-closed LoAF** and **B's advisory inv
δ** — were *corrected in C, not dropped*; they are tracked at the bottom (§
drift) so the correction is preserved across the chain rather than silently
absorbed.

Verified not asserted: each ADDRESSED row cites the tranche + artifact that
landed it; each D-SCOPE row names the D wave + the audit file carrying its
evidence.

---

## P1 (tranche A) — all ADDRESSED, B/C-verified, no D obligation

| # | Request | Status | Evidence |
|---|---|---|---|
| A1 | Execute tranche A in full | ADDRESSED | A's W0–W5 landed (`d84faf5`); `docs/tranches/A/PROGRESS.md` all-waves-landed. |
| A2 | Publish 3.0.0 first | ADDRESSED | `v3.0.0` tag + SLSA provenance; `npm view` → 3.0.0. |
| A3 | Export `RAFPlayback` PRM gate | ADDRESSED | `index.ts:48` exports `RAFPlayback`; B.W2 generalized it to the shared `Tickable` driver (`playback.ts`). |
| A4 | Changesets + `--provenance` | ADDRESSED | `release.yml` `npm publish --provenance --access public` + `id-token:write`. |
| A5 | Gate on green CI | ADDRESSED | `ci.yml` library gate chain; B + C extended it (demo-smoke/occlusion/lighthouse) rather than rebuilding. |
| A6 | `proof:boundary` (the value.js static/dynamic boundary gated) | ADDRESSED | `scripts/proof-boundary.mjs` (hardened in C.W4: bare-import / subpath / `export const` false-negatives closed); the boundary holds (`index.ts` light barrel + `loadAnimationEngine()`). |
| A7 | `EasingResolvable` lazy-easing path | ADDRESSED-then-SUPERSEDED | A's `easing-resolvable.ts` shared resolver landed; B/C superseded it with the fail-explicit `resolveEasing`/`toEasing` factory (`easing.ts`) — string names resolve once up front, no silent-linear window. The A-era resolver class is **gone** (no alias) — C verified `internal/` collapsed to 5 modules. |

---

## P2 (tranche B) — every discrete request, ADDRESSED

| # | Request | Status | Evidence |
|---|---|---|---|
| B1 | Update all deps to latest | ADDRESSED | B.W1 (`6487c7f`); `B/audit/dep-upgrade-matrix.txt`. Library deps already-latest; demo/tooling majors behind the regression gate. |
| B2 | 6-agent deep audit of plan + changes | ADDRESSED | `B/audit/plan-findings.txt` (46 findings, 11 high) — all folded into B's waves. |
| B3 | Path forward / gestalt / no-workaround / no-legacy / architectural transpositions | ADDRESSED | `B.md` + `B/audit/architecture-gestalt.md`. Net-deletion: −3 modules, −16 TODOs, 7 reduced-motion bodies → 1 `withReducedMotion`, 3 rAF loops → 1 `RAFPlayback`. **D extends this** — see D-SCOPE. |
| B4 | Fold chronically-deferred + deferred | ADDRESSED | `B.md` §fold; LoAF observer SHIPPED, ScrollTimeline-native KILLed, Worker/Offscreen ARCHIVE, VAL-9 + dock filed outward. (LoAF later corrected in C — § drift.) |
| B5 | Recap ALL prompts | ADDRESSED | `B.md` §Prompt recap (P1+P2); C extended to P3; D extends here. |
| B6 | NOT an implementation phase (B was dev-only authoring) | ADDRESSED | B.W0 authored dev-only; the user subsequently authorized W1–W7 (real impl `6487c7f..c66e6f3`). The dev-only constraint applied to the *authoring* turn and was honored. |
| B7 | Full lighthouse + best-practices, every page + every library facet | ADDRESSED | B.W4/W7; `B/audit/lighthouse/after-prod/` (14 reports, 7 pages × {desktop,mobile}) vs the repaired prod build. |
| B8 | Pull precepts + sync + before/after edict | ADDRESSED | Edict at precepts `8ccf9f4`, pushed to origin/main (B's "push pending" closed in C). Gitlink synced (latest canonical per the constellation fold). |
| B9 | Remove loading screen + improve loading | ADDRESSED | B.W4: `index.html` splash removed (criticalCSSPlugin inlines themed bg); monaco/three lazy; smoke gate inv γ. |
| B10 | 6 frontend-design agents audit design + glass-ui | ADDRESSED | B.W0/W5; `B/audit/design-findings.txt` (43 findings, 4 blocker). Blockers fixed; off-token residue → C/D. |
| B11 | Create next tranche with perfected CI | ADDRESSED | This is the tranche cadence; library gate (node v5, glass-ui-free, clean-runner) + demo-smoke job in `ci.yml`. |
| B12 | Audit every page desktop+mobile, NO occlusion, dock perfected, fully Playwright | ADDRESSED (then HARDENED in C) | B.W3 `occlusion-gate.mjs` per page × {375,1280,1440}. **Advisory in B, made HARD in C** — § drift. |

---

## P3 (tranche C) — all ADDRESSED

| # | Request | Status | Evidence |
|---|---|---|---|
| C1 | Re-audit with 6 agents | ADDRESSED | `C/audit/plan-findings.txt` + `design-findings.txt` (6 lanes + 6 lenses); the animation audit (`C/audit/animation/SUMMARY.md`, 6 lanes). |
| C2 | Devise the path forward | ADDRESSED | `C.md` wave shape (W0–W5); executed on `tranche-c-impl` (PR #3, CI-green). |
| C3 | Recap all prompts | ADDRESSED | `C/audit/lanes/prompt-recap.md` (P1+P2+P3); D extends here. |
| C4 | NOT an implementation phase (then authorized) | ADDRESSED | C.W0 audit dev-only; the user authorized W1–W5 in totality (C PROGRESS). |
| C5 | Fold deferred (owner + trigger) | ADDRESSED | C carried every B deferral forward with owner+trigger; D's `deferred-ledger.md` terminates the keyframes-owned set. |
| C6 | 6-agent demo design inventory | ADDRESSED | `C/audit/design-findings.txt` (6 lenses). |
| C7 | Make B's close honest (inv ε) | ADDRESSED | C.W1 + C FINAL § B-overclaim reconciliation — all 7 B overclaims corrected by re-runnable instruments (§ drift covers the two this recap tracks). |
| C8 | Make the design language whole (φ-ladder) | ADDRESSED (display tier) | C.W2: 58 instrument-serif sites → semantic ladder; `--font-display` formalized; sweep = 0. **Leaf-tail → D.W2** (D-SCOPE). |
| C9 | Make the shop-window run on its own engine (inv ζ) | ADDRESSED | C.W3: 7 hand-rolled rAF → `SmoothProgress`/`SpringProgress`/`NumericAnimation`/`RAFPlayback`; `proof:dogfood` standing gate. |
| C10 | Before/after capture (re-runnable from repo) | ADDRESSED | `scripts/capture.mjs` checked in C.W0; AFTER capture C.W5 (18 shots, 0 console errors); `C/audit/DELTA.md`. |
| C11 | π at full | ADDRESSED | `C/audit/pi.md` — π binds at FULL (the reduced-motion ≥5-frame rest-frame probe `KF_RM_HONORED=1` + the measured contrast table). |

---

## P4 (the constellation drive) — keyframes-relevant requests

| # | Request | Status | Evidence |
|---|---|---|---|
| D-C1 | The dock+animation convergence (keyframes' arm) | ADDRESSED | C is one arm; the VT-parity spring (`--dock-resize-spring: var(--spring-snappy)`) shipped in glass-ui (PR #1, its own CI). The slides spring-dogfood landed clean (`29a781a`). |
| D-C2 | The dock convergence + naming plan (keyframes' obligations) | D-SCOPE (split) | The local role-name renames (`TopDock`→`ChromeDock`, `AnimationMenuBar`→`TransportDock`) + `dock/index.ts` deletion are D-SCOPE → **D.W5** (KFD-3), unblocked by the published 3.3.0 correctness surface + the touch-gate B′ fix. The `<Role>Dock`-base-component slot-fill leverage is **GATED on glass-ui AU.W8** (a role-typed base is BOOK in glass-ui until a 2nd consumer) — a named cross-session edge, circle-back if AU.W8 lands a role-typed base and keyframes is its 2nd consumer. |
| D-C3 | Consume published-not-branches; gate on keyframes' own green CI (inv-27) | ADDRESSED-as-posture | D pins published value.js / glass-ui (`^3.3.0` on AT ship), never sibling branches; each D wave gates on keyframes' own green CI. |
| D-C4 | Keep `springLinearStops()` stable (the slides/glass-ui enabler) | ADDRESSED | The export stays light + value.js-free (`proof:boundary`); OUT-2 keeps it stable for glass-ui's VAL-9 codegen. |

---

## P5 (this D ask) — the four constraints + the dev-only authoring boundary

| # | Request | Status | Evidence |
|---|---|---|---|
| D1 | The demo refined (decompose the oversized units, KISS) | D-SCOPE | D.W1 — the 5 oversized units (AnimationControlsGroup 552L, KeyframesEditor 487L, KeyframeTimeline 441L, useKeyframesEditor 383L, useTimeline 251L) decomposed; mis-filed pure utils re-homed; rAF/timeout blobs → vueuse. |
| D2 | The design language localized + uncaged (styling gestalt) | D-SCOPE | D.W2 — own the demo-rented idioms (`--rainbow-*`, `--color-gold`, `.scale-on-hover` ×13, `@keyframes enter`) in one `design-idioms.css`: they resolve today only through the transitive glass-ui + tw-animate-css cascade (an ungated cross-repo rent, no demo-local definition), so D.W2 closes the rent by ownership; uncage the `utils.css` monolith; terminate the φ-ladder leaf-tail (KFD-1). |
| D3 | Brittleness hardened (selectors · reactivity · fragile rules) | D-SCOPE | D.W3 — brittle DOM selectors → `useTemplateRef`/provide-inject; documented z-index scale; `@supports` guards; reactivity fixes; the engine `_snapSettled` symmetry (D-6a). |
| D4 | The engine transposed to its gestalt (elegance · perf) | D-SCOPE | D.W4 — D-1 (group zero-alloc), D-2 (`tick`→`advanceTo`), D-3 (computed round-trip), D-4 (`Animation` god-object split), D-5 (`pause` honest), D-6b/c (`\|any` + re-exports). Full evidence: `audit/engine-transposition.md`. |
| D5 | The dock leveraged + the mobile composition closed (newly unblocked) | D-SCOPE | D.W5 — the dock-rename (KFD-3), mask removal (KFD-4), square/mobile occlusion (KFD-2); pinned to published glass-ui 3.3.0. |
| D6 | Every keyframes-owned deferral terminated (P-invariant-28) | D-SCOPE | `audit/deferred-ledger.md` — zero un-dispositioned punts; every KFD has a wave, every OUT an owner, every ARCH a rationale. |
| D7 | Recap ALL prompts | ADDRESSED (this file) | This recap chains A→B→C→constellation→D; no drops; the two drifts tracked below. |
| D8 | NOT an implementation phase (D.W0 dev-only authoring) | HONORED | D.W0 = these tranche docs + the audit evidence on disk. No engine/demo/library source written this turn. The IMPL half (D.W1–W6) opens only on explicit authorization, gated on keyframes' own green CI — exactly C's dev→impl boundary. |
| D9 | elegance / simplicity / performance above all; transpositions necessary; NO legacy; KISS; isomorphic styling | HONORED (constraint, threaded through every wave) | D-1..D-6 each carry the perf/elegance rationale; D-5 + D-6c delete legacy outright (no deprecation); D.W2 is isomorphic (pixels unchanged unless highly befitting). |
| D10 | The version owner named for the stacked changesets (B 3.1.0 + C major + D major) | D-SCOPE | D.W6 names the version owner so the stacked publish leg is not orphaned (the only un-orphaned-by-design loose end). Publish leg stays user-domain, confirm-first. |

---

## § The two historical drifts — corrected in C, NOT dropped

The chain preserves two corrections so they are not silently re-absorbed:

### Drift 1 — B's falsely-closed LoAF

- **The drift:** B's FINAL marked the LoAF observer's >50ms-trace subsystem
  closed with a claimed 2nd consumer that was, in fact, a **stub** (B reused the
  observer as its own consumer; the "second" consumer never bit).
- **The correction (C.W1):** `bench/playwright.bench.ts` became the REAL 2nd
  consumer — a 200-cell AnimationGroup composite reading `window.__kfLoaf`,
  failing HARD on >50ms main-thread blocking (CI-green; reddens on a >50ms
  inject). The overfitting was closed by a biting instrument, not re-narrated.
- **D's posture:** CLOSED-1 — verify no regression. D-1's group zero-alloc
  transposition is *aligned* with this gate (gives it headroom).
- **Why tracked:** the correction is part of inv ε's first application (C
  audited B's *claims*); dropping the drift would lose the lineage that makes
  inv ε's discipline legible.

### Drift 2 — B's advisory inv δ

- **The drift:** B's spec demanded "zero dock-over-content overlap" but the
  shipped `occlusion-gate.mjs` **downgraded it to a console NOTE** and never ran
  the controls-open state — an advisory gate marked as a hard one.
- **The correction (C.W1):** the gate was promoted to a HARD failing assertion
  (content-rect intersection, per-scene `dockFloatAllowed`), runs BOTH
  `controls:{closed,open}` axes, and is bite-proven (`KF_OCCLUSION_INJECT=cube`
  reddens it). One real occlusion surfaced (square/mobile) → a NAMED
  self-cleaning allowance, not a silent advisory.
- **D's posture:** the named square/mobile allowance is KFD-2 (D.W5 terminal
  fix); the HARD gate stays HARD across D.
- **Why tracked:** the advisory→hard promotion is the template for D's own
  "falsifiable HARD gate per wave" discipline — an advisory gate is a drift, a
  biting instrument is the bar.

---

## Verdict

No P1/P2/P3/P4/P5 request is DROPPED. Every prior-tranche request resolves
ADDRESSED; every D ask resolves D-SCOPE with a named wave + audit-file evidence.
The two historical drifts are corrected-and-preserved, not absorbed. The only
un-orphaned-by-design loose end is the stacked publish leg (user-domain, version
owner named in D.W6). The dev-only authoring boundary is honored: D.W0 writes
docs, not source.
