# Constellation Edges — Tranche J Audit

**Lane:** constellation  
**Branch audited:** `tranche-i-dev` (post-close HEAD, pre-J)  
**Date:** 2026-06-09  
**Auditor:** read-only; no source was modified.

Every claim below is grounded against the live tree, lockfile, installed
`node_modules`, and sibling-repo source. File:line or command+output cited for
each. inv ε: no claim made without a re-runnable probe.

---

## 1. glass-ui edge

### 1a. Pin

| Item | Value | Evidence |
|---|---|---|
| Declared | `~3.9.0` (tilde, optional) | `package.json:optionalDependencies` |
| Lockfile resolved | `3.9.0` via `registry.npmjs.org` | `package-lock.json` `node_modules/@mkbabb/glass-ui` |
| No `file:` / `link:` | CLEAN | `proof:deps-current` clause 2 PASS; `proof:ci-coverage` registry-glass-ui PASS |
| Tilde rationale | Holds ≥3.9.0 < 3.10.0; the I.W6 deliberate skip of 3.6/3.7 (which worsened specular) | `I.W6.md` + `FINAL.md §7` |

Pin is correct and protocol-clean. The tilde cap is load-bearing
(`~` not `^`): 3.6/3.7 regressed specular; a `^` would float into them on a
fresh install if a 3.10.x is not yet published.

### 1b. Specular consume-edge — CLOSED

The B7 sheen chronic was resolved two-sided at I.W6:

- glass-ui AX published `3.9.0` (`c9b1633`): `--specular-intensity` defaults to
  `var(--glass-specular-intensity-rest, 0)` at rest (`glass.css:110–114` in the
  glass-ui source; folded into `.glass-material::before` + dock tracks).
- kf bumped pin `~3.5.1 → ~3.9.0`; lockfile resolves `3.9.0`.
- `proof:specular-absent-at-rest` GREEN (rendered `::before` alpha ≤ 0.05 at
  rest on stages + dock tracks; born-RED on 3.5.1 alpha 0.22–0.35).
- `proof:specular-handoff` DELETED from `package.json` (grep = 0).
- Zero kf-side CSS suppression; the `::before{content:none}` workaround
  was REJECTED per I-charter.

**J disposition: VERIFY-ONLY.** Re-run `proof:specular-absent-at-rest` on the
J branch after any glass-ui re-pin.

### 1c. Plus Jakarta typography — kf workaround LIVE; AX opt-in ASK open

glass-ui 3.9.0 force-applies "Plus Jakarta Sans" to the bare `body` register
via `typography.css` → `body { font-family: var(--font-text) }` → `--font-text
→ --font-stack-text → "Plus Jakarta Sans"` (installed tokens.css confirmed). The
kf demo does NOT use Plus Jakarta; its identity is Instrument Serif + Fira Code
over native UI sans.

kf's workaround is LIVE and GATED:
- `demo/@/styles/style.css:113` overrides `--font-stack-text` at `:root` to a
  native sans stack; `--font-stack-sans` aliased to same (`:115–116`).
- `proof:demo-fonts` asserts NO Plus Jakarta on body/dock/chrome + display
  resolves Instrument Serif + no primary face in error (PASS, runtime gate).

Coordination ASK filed to glass-ui AX session:
`glass-ui/docs/tranches/AX/coordination/from-keyframes-I-totality.md §3`
asks for a scoped opt-in surface (e.g. `.glass-typography` class or documented
`--font-text` override contract decoupling `--font-stack-sans` from
`--font-stack-text`). The 3.9.0 CHANGELOG has NO typography opt-in mechanism;
the ASK is UNADDRESSED in the published release.

**J disposition: OUT (glass-ui-owned).** kf's `--font-stack-text` `:root`
override is the correct consumer-lever and is held by `proof:demo-fonts`. J
does NOT need to revisit unless glass-ui bumps. If glass-ui ships an opt-in
mechanism in the next minor, J's consume-leg removes the `:root` override and
updates `proof:demo-fonts`. No J wave required absent a pin bump.

### 1d. Dock double-click / touch-gate — RESOLVED in 3.9.0

The dock double-click item (memory: `project_dock_doubleclick.md`) has two
historically-distinct facets:

**Facet 1 — pointer-events-during-transition (2026-04-04, pre-B history):** the
`onPointerDownOutside` collapse during the dock expand transition. Fix was a
bounding-box check in `useDockState.ts`.

**Facet 2 — touch-gate B′ (AT.W6-dock-b, commit `f0b0ffb`):** `GlassDock.vue`
was calling `preventDefault()`/`stopPropagation()` on the activating
`touchstart`/`touchend`, swallowing the native compatibility `click`. Shape B′
fix drops both calls; the native click flows to the control AND the dock
expands. Verified: `git merge-base --is-ancestor f0b0ffb v3.9.0` → TRUE. The
fix IS in the published 3.9.0.

In-dist confirmation: `dock.js` in installed 3.9.0 imports
`useTouchGate-WFyJYsth.js` and calls `A.handleTouchStart`/`A.handleTouchEnd`
via local functions `Se`/`we` — NO `preventDefault()`/`stopPropagation()` in
either handler body (`dock.js` text search verified).

Demo-side: `AnimationMenuBar.vue:17` uses `:always-expanded="true"` — the menu
dock never collapses, so the touch-gate path is irrelevant there. `ChromeDock.vue`
uses `:start-collapsed="true"` and relies on glass-ui's own expand behavior
(no kf-side intercept workaround). No `@pointerdown` transition-intercept
workaround found in either file.

**J disposition: VERIFY-ONLY.** Probe the collapsed ChromeDock on a touch
device / Playwright mobile viewport. The glass-ui fix is in 3.9.0; no J wave
is owed.

### 1e. `proof:deps-current` floor staleness — TWO stale floors

The gate at `scripts/proof-deps-current.mjs` declares:
```js
const FLOORS = {
    "@mkbabb/value.js": "0.11.1",  // comment: G.W2 target
    "@mkbabb/parse-that": "0.9.0",
    "@mkbabb/glass-ui": "3.5.1",   // comment: H.W8 BLK-5 consume-leg
};
```

Both the value.js and glass-ui floors are stale:

| Dep | Floor in gate | Actual pin | Gap |
|---|---|---|---|
| `@mkbabb/value.js` | `0.11.1` | `^0.11.2` | `0.11.1` lacks the B1 empty-input fix; a repin to `^0.11.1` would pass the floor gate but reds `proof:engine-no-throw-on-play` |
| `@mkbabb/glass-ui` | `3.5.1` | `~3.9.0` | `3.5.1` has the specular bloom; a manually-edited pin to `~3.5.1` passes the floor gate but reds `proof:specular-absent-at-rest` |

The floor gate still PASSES today because installed versions satisfy the
stale floors, but the gate allows a regressive re-pin that bypasses B1/B7.
The `package.json` ranges themselves would reject the regression (npm would
refuse `0.11.1` when `^0.11.2` is declared; `~3.5.1` when `~3.9.0` is declared),
so there is no silent-regression path without also editing `package.json` — which
proof:deps-current clause 2 (protocol) doesn't check. Clause 1 catches the
installed version after a relock but doesn't prevent the first dirty install.

**J disposition: FOLD (P2 hygiene).** J should advance the floors to match the
I-close pins: `value.js ≥ 0.11.2`, `glass-ui ≥ 3.9.0`. One-liner edit to
`scripts/proof-deps-current.mjs` + update the comments. No new gate needed.

### 1f. glass-ui future (`{types}` directional VT, `LabeledField orientation`)

Both items are OUT (glass-ui-owned) per the I FINAL / deferred-ledger:

- **GH-4 / FB-4 `{types}` directional VT** — glass-ui-BOOK; folds only if J
  elects D11 scene interactivity. `useSceneTransition.ts:2` imports from
  `@mkbabb/glass-ui/motion-core` and is live, but no `{types}` directional
  pass exists. No J action absent that election.
- **G-3 `LabeledField orientation`** — glass-ui-owned; kf demo-side
  `grid-cols-[auto_1fr]` path exists as workaround.

---

## 2. value.js edge

### 2a. Pin

| Item | Value | Evidence |
|---|---|---|
| Declared | `^0.11.2` | `package.json:dependencies` |
| Lockfile resolved | `0.11.2` via `registry.npmjs.org` | `package-lock.json` `node_modules/@mkbabb/value.js` |
| No `file:` / `link:` | CLEAN | `proof:deps-current` clause 2 PASS |

### 2b. `0.11.2` published and consumed — B1 fix is load-bearing

I.W0 required value.js `0.11.2` for the `parseCSSValueUnit("") → {value:0}`
(typed-empty, no throw) contract. Verified:
- `node_modules/@mkbabb/value.js/package.json` version: `0.11.2`.
- Exports: `{types, import, default}` — NO `development` condition (the 0.11.0
  landmine that broke Vite consumers is absent).
- `proof:engine-no-throw-on-play` GREEN (runtime gate over built dist).

### 2c. `development` exports condition — CLEAN

The memory (`project_valuejs_dev_export_gotcha.md`) flagged that value.js
`0.11.0` shipped `"development": "./src/index.ts"` while `files: ["dist"]`
omitted `src/`. `0.11.1` fixed it; `0.11.2` retains the fix.
Verification: `node_modules/@mkbabb/value.js/package.json exports["."] keys:
["types","import","default"]` — no `development` key. kf's `vite.config.ts`
`devConditions = ["module","browser","default"]` — no `development` arm.
Cross-repo dev-resolution contract-v2 complied.

**J disposition: VERIFY-ONLY.** Any future value.js re-pin must verify `npm
view @mkbabb/value.js@<v> exports` has NO `development` arm before landing.

### 2d. parse-that realm split — KNOWN, NON-BITING, surfaced explicitly

`proof:deps-current` clause 3 reports the realm split every run (non-gating):

```
⚠ (3) REALM: parse-that realm SPLIT — kf declares "^0.9.0" (0.9.x) but
installed value.js@0.11.2 declares "^0.8.2" (0.8.x). The npm tree carries
TWO parse-that realms; the cross-realm cast is utils.ts:248 (parseAny as any).
```

Physical proof: `node_modules/@mkbabb/value.js/node_modules/@mkbabb/parse-that`
exists at version `0.8.2` (nested). kf's top-level `parse-that` is `0.9.0`.
The cross-realm cast is at `src/animation/utils.ts:258`: `(parseAny as any)(...)`.

This is the `G-HANDOFF-1` item, chronic-by-design per I FINAL §5: value.js
must re-pin its own `parse-that` to `^0.9.x` (NOT a kf-side shim). Currently
NON-biting per production round-trip verification. The gate escalates to a hard
red only under `KF_REALM_STRICT=1`.

**J disposition: OUT (value.js-owned HANDOFF, BOOK-reaffirm).** NOT a J wave.
No kf edit. The escalation path is: if `proof:engine-correctness` or
`proof:roundtrip-fidelity` reddens, set `KF_REALM_STRICT=1` and escalate.

### 2e. value.js next-slice items — OPEN sibling HANDOFFs (C-1 chronic-by-design)

Per I FINAL deferred-ledger and J deferred-ledger the following remain open in
value.js `0.11.2` (node probe verified):

| Item | Status | Signal |
|---|---|---|
| VJ-F1 `getPointAtLength` / `fromMorphSVG` arc-length sampler | OPEN | `parseLinearStops` undefined; `getPointAtLength` undefined in 0.11.2 |
| MCI-5 identity-pad | OPEN | `test/interpolate-anything.test.ts:256` `it.fails(` GREEN (not consumed) |
| VJ-F2 / LD-DIAG diagnostics sink | OPEN | `ResolvedKeyframes` exists in `adapter.ts` but no `diagnostics` field |
| VJ-7 / F3 `tryParseCache` LRU bound | OPEN | `utils.ts:203` unbounded `Map`, `.set` `:267`, no eviction |

All are correctly OUT (value.js-owned), riding the re-pin process per the
C-1 chronic-by-design discipline. The `it.fails` MCI-5 test IS the consume
signal: when value.js ships MCI-5, the test flips RED and the wrapper is
removed. No J gate owed.

**J disposition: BOOK-reaffirm / OUT** for all four items. Not J waves.

---

## 3. parse-that edge

### 3a. Pin

| Item | Value | Evidence |
|---|---|---|
| Declared | `^0.9.0` | `package.json:dependencies` |
| Lockfile resolved | `0.9.0` via `registry.npmjs.org` | lockfile `node_modules/@mkbabb/parse-that` |
| Exports | `{types, import, require}` — clean, no `development` | installed `package.json` |

### 3b. Packrat PT-1 HANDOFF

The `(id,offset)` packrat re-key is withheld (zero production consumers per I
FINAL). It is a parse-that-owned HANDOFF: author `proof:packrat-position`
first, then re-key. There is no kf-side action.

**J disposition: OUT (parse-that-owned).** BOOK the gate-first note. Not a J
wave.

---

## 4. Registry-consumption rule

The `proof:deps-current` + `proof:ci-coverage` gate pair enforces the NO
`file:` / `link:` / `git:` protocol rule for all `@mkbabb/*` siblings.

Live verification:
- `proof:deps-current` PASS — clause 2 (PROTOCOL) green; every `@mkbabb/*`
  declaration and lockfile-resolved node uses a registry range.
- `proof:ci-coverage` PASS — "ZERO workflow clones the glass-ui sibling or
  carries a file: glass-ui reference."
- `vite.config.ts:151–156` — the ONE legitimate alias kept: `@mkbabb/keyframes.js
  → src/animation/index.ts` (the self-dedup for glass-ui's `SpringProgress`
  import; NOT a file: link). Documented at `vite.config.ts:139–162`.

The `proof:resolution-contract.mjs` gate referenced by
`docs/precepts/cross-repo-dev-resolution.md §8` does NOT exist in kf:
```
scripts/proof-resolution-contract.mjs: NOT FOUND
```
The precept references a gate that was never authored for kf (the gate lives
in glass-ui). There is no `proof:resolution` entry in `package.json`.

**J disposition:** The missing `proof:resolution-contract.mjs` is a P2 gap —
the precept cites it, it doesn't exist. J may elect to author it (would assert:
no `development` key in any kf exports map; `build:watch` present in kf
`package.json`; no sibling `dist/` resolve alias other than the documented
self-dedup). Currently covered indirectly by `proof:deps-current` clauses 1+2
+ `proof:ci-coverage`. Low priority but closes the precept→gate gap.

---

## 5. Fourier-hub constellation obligations

The `docs/precepts/infra/` docs (deploy.md, tls.md, domains.md,
blob-backend-dr.md) were promoted from `fourier-analysis` at D.W2 close
(`5b84e31`). They are constellation-shared precepts, not kf-specific
obligations. Verified:

- `deploy.md` — describes the `adnanh/webhook` → `deploy-hook.sh` chain for
  host-based repos. kf is on **Cloudflare Pages** (CF auto-deploy on master
  push), NOT this webhook chain. The precept is informational for kf; the CF
  pages deploy is covered by `deploy-pages.yml` + `proof:ci-coverage` (YAML
  validity, concurrency, coverage). No kf action.
- `tls.md` / `blob-backend-dr.md` — MongoDB / blob-backend concerns for
  fourier-analysis and palette. kf has no backend; these are fully OUT.
- `domains.md` — naming convention `<app>.babb.dev` / `api.<app>.babb.dev`.
  `keyframes.babb.dev` is the frontend (CF Pages); there is no `api.keyframes`
  backend. Compliant.
- No "RUN-BOARD" era obligations found in kf docs against the fourier
  constellation. The G/H/I handoff docs reference fourier-analysis tranches
  only for provenance (C.W2 TLS pilot) — no standing cross-session work kf
  owes.

**J disposition: OUT / RECORD.** No kf wave owed for any fourier-hub precept.

---

## 6. Cross-repo dev-resolution contract

Contract-v2 (`docs/precepts/cross-repo-dev-resolution.md`) abrogates the
`development` condition. Compliance verified:

| Repo | `development` in exports | `build:watch` in package.json | kf `vite.config.ts` conditions |
|---|---|---|---|
| `@mkbabb/value.js` 0.11.2 | ABSENT (verified) | present (`"build:watch"` in scripts) | N/A — kf consumes via `import`/`default` |
| `@mkbabb/glass-ui` 3.9.0 | ABSENT (verified; all 75 subpath exports checked) | present | N/A |
| `@mkbabb/parse-that` 0.9.0 | ABSENT | present | N/A |
| kf `vite.config.ts` | `devConditions = ["module","browser","default"]` — no `development` | ✓ | COMPLIANT |

No contract-v2 violations found.

---

## 7. Findings summary table

| ID | Severity | Title | Disposition |
|---|---|---|---|
| CONST-1 | P2 | `proof:deps-current` floors stale after I re-pins (glass-ui: 3.5.1→3.9.0; value.js: 0.11.1→0.11.2) | FOLD — one-liner floor update in `scripts/proof-deps-current.mjs` |
| CONST-2 | P2 | `proof:resolution-contract.mjs` referenced by precept doc but does not exist in kf | FOLD (low priority) — author or note NOT APPLICABLE for kf |
| CONST-3 | BOOK | parse-that realm split 0.9.0 vs 0.8.2 (nested) — non-biting, surfaced explicitly by gate | BOOK-reaffirm / OUT — rides value.js G-HANDOFF-1 |
| CONST-4 | BOOK | Plus Jakarta typography ASK (filed to glass-ui AX) — unaddressed in 3.9.0 | OUT (glass-ui-owned); kf workaround held by `proof:demo-fonts` |
| CONST-5 | BOOK | AT.W6 touch-gate dock fix (`f0b0ffb`) IS in 3.9.0 (merge-base verified) | VERIFY-ONLY — no kf action; probe on mobile viewport in J |
| CONST-6 | BOOK | value.js next-slice items (VJ-F1/MCI-5/VJ-F2/VJ-7) open in 0.11.2 | BOOK-reaffirm / OUT — C-1 chronic-by-design, ride re-pin |

---

## 8. What J consumes vs ASKs vs leaves alone

| Edge | J action |
|---|---|
| glass-ui `~3.9.0` pin | HOLD — tilde is load-bearing; verify on any new bump |
| glass-ui specular | VERIFY-ONLY — re-run `proof:specular-absent-at-rest` on J branch |
| glass-ui typography opt-in | OUT — glass-ui-owned ASK; kf workaround is sufficient and gated |
| glass-ui dock touch-gate | VERIFY-ONLY — fix is in 3.9.0; probe mobile |
| `proof:deps-current` floors | FOLD (P2) — advance glass-ui floor to 3.9.0, value.js floor to 0.11.2 |
| value.js `^0.11.2` pin | HOLD — `development` condition absent; B1 fix present |
| value.js next-slice | OUT — rides re-pin process; `it.fails` IS the consume signal |
| parse-that `^0.9.0` pin | HOLD |
| parse-that packrat PT-1 | OUT — parse-that-owned; gate-first |
| parse-that realm split | OUT — non-biting advisory; escalate only under `KF_REALM_STRICT=1` |
| `proof:resolution-contract.mjs` | FOLD (P2, low priority) — precept gap |
| Registry-consumption rule | HOLD — both gates GREEN; self-dedup alias is the one legitimate exception |
| Fourier-hub precepts | OUT / RECORD — informational only for kf |
