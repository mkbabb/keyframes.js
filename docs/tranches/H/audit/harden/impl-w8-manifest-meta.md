# H.W8 IMPL — Lane A: the manifest re-source (S1) + the chronic-closure meta-gate (S3)

**Branch:** `tranche-h-impl` · **Wave:** H.W8 (the gate-regime close — the durability
keystone) · **Lane:** A (MANIFEST RE-SOURCE + CHRONIC-CLOSURE META-GATE) · **tsc:** CLEAN.

This lane makes the gate regime DURABLE on two axes the lattice was structurally blind to:
ROOT-B (the drifted SCENES manifest) and the chronic-closure discipline (the P-invariant
policed the COLUMN, not the PRODUCT). Both deliverables are static SOURCE gates — a parse of
two committed substrates, mirroring `proof:idioms` clause-1 resolve-or-red + the
`proof:brittleness` LISTENER_ALLOWLIST stale-guard. NO engine/demo source touched. NO
workaround. The glass-ui line in `package.json` + its ci.yml prose are Lane C's (untouched).

---

## S1 (I-1) — re-source the SCENES manifest from `scenes.ts`

### The defect (ROOT-B)
`scripts/lib/demo-driver.mjs` held a HAND-MAINTAINED 6-entry `SCENES` array (`home, cube,
amiga, square, easing, spring`) — the single truth for `occlusion-gate`, `lighthouse-gate`,
`capture.mjs`, `proof:typing-dots`, `proof:mobile-single-page`, and ~10 other gates. The
demo ships **8** scenes (the 6 + `sequence` + `motion-path`; `starting-style` was merged
INTO spring at H.W5). So `sequence`/`motion-path` were **NEVER occlusion-checked,
lighthouse-scored, or captured** — "the gate that lists them never looks at them; the gates
that look never list them."

### The fix
`demo-driver.mjs` now DERIVES the scene set from `demo/app/scenes.ts` — the single source the
router (`demo/app/router.ts`) already trusts (route ≡ id, verified 1:1). A new
`parseScenesManifest()` reads `scenes.ts` (comment-blank + brace-match over the descriptor
literals — the SAME shape `proof:scene-icons` uses) and returns the id UNION
`[homeScene.id, ...scenes.map(s => s.id)]` plus each descriptor's `superKey`. The exported
`SCENES` shape is UNCHANGED (`{ key, route, subjectSelector, dockFloatAllowed }`), so NO
consumer needed editing.

The only HAND-DATA left is `SCENE_GATE_META` — the per-id `{ subjectSelector,
dockFloatAllowed }` gate metadata (keyed by the scenes.ts id). The new scenes' selectors
target the H.W11 stage register: `.stage-cell [data-surface], [class*=Target],
[class*=glass-card]`. `SUPER_KEY_BY_ROUTE` is now also DERIVED from scenes.ts (the superKey
lives on each descriptor), so it can never drift either.

### The STALE-KEY guard (born at module load)
A bidirectional key-equality guard binds `SCENE_GATE_META` keys EXACTLY to the parsed scene
id set (mirrors `proof:brittleness` LISTENER_ALLOWLIST stale guard): a scenes.ts id with no
metadata entry THROWS; a metadata key with no scenes.ts id THROWS. So adding a scene to
`scenes.ts` AUTO-enrolls it in every runtime gate (and fails loud until its gate metadata is
authored). The standing invariant is key-EQUALITY, not a hard count — it AUTO-TRACKS any
future scene add/remove (WV-W8-MED-1 / harden M1: the brittle "9 vs 6" became set-equality).

### `proof:manifest-sourced` (NEW — `scripts/proof-manifest-sourced.mjs`)
The standing invariant as a re-runnable gate. Three clauses, each BITES:
1. **UNMANIFESTED** — every scenes.ts id ∈ `SCENES` keys.
2. **STALE-KEY** — every `SCENES` key ∈ scenes.ts ids.
3. **DERIVED-NOT-HAND-LISTED** — `demo-driver` must parse scenes.ts (not re-declare a hand
   array of `key:` literals that drifts again). Source-shape guard against regression.

The gate imports SCENES via a try/catch dynamic import so the driver's own stale-throw
becomes a clean gate report (no stack trace) and the scenes.ts parse stands alone.

**Bite-verified (isolated harnesses, restored after):**
- GREEN today: `SCENES keys ≡ scenes.ts ids (8 scenes)`.
- Inject a `{ id: "ghost" }` descriptor into the `scenes[]` array → (a) the demo-driver
  stale-guard throws at import (every runtime SCENES consumer reds loud); (b)
  `proof:manifest-sourced` reds with `[unmanifested] … "ghost"`.

---

## S3 (I-3) — the chronic-closure META-GATE

### The discipline (the H-born meta-invariant)
A chronic exits ONLY with **(a) a passing SYSTEM-property gate, OR (b) a HANDOFF tag PAIRED
with a born-RED kf gate. A bare HANDOFF reds.** The four chronics (cartoon-shadow D2, φ-hero
D7, mobile D10, dock D5) "exited" A→G by RE-CLASSIFICATION (M1 issue-level close, M2
scope-narrowing, M3 column-migration), not by being SOLVED — the P-invariant policed the
COLUMN, not the PRODUCT.

### `proof:chronic-closure` (NEW — `scripts/proof-chronic-closure.mjs`)
Parses the COMMITTED chronic table at `docs/tranches/H/PROGRESS.md §"Open deferrals"` — the
SINGLE canonical substrate (BLK-2: `H/FINAL.md` does NOT exist until H.WZ; it is parsed
ADDITIONALLY only behind an `fs.existsSync` guard; `_SYNTHESIS-deferred-ledger` is
descriptive history, NOT the runtime target). For each row's "H closure" cell it asserts:

- **(i)** every LOAD-BEARING `proof:*` gate name RESOLVES to an authored `package.json`
  script key AND is a member of `proof:all` (no dangling name → catches the **M1**
  paper-close where the cited gate does not exist).
- **(ii)** every HANDOFF/consume-leg closure carries a born-RED `proof:*` gate that resolves
  (a bare HANDOFF with no born-RED gate reds → catches **M3** column-migration-and-forget).
- **(iii)** a row with NEITHER reds.

**RETIRED-tag exclusion (the harden RETIRED-exclusion rule):** a name tagged RETIRED in the
row prose (the H.W9 register-collapse names `proof:cartoon-specular-coexist` +
`proof:specular-calm`) is EXCLUDED from resolve-or-red and required to be ABSENT — the DUAL:
a RETIRED name that STILL resolves reds (catching a half-done retire). Detection uses a tight
list-adjacency match (a run of backtick `proof:*` names directly bracketing a retire-verb,
≤16 glue chars) — verified to catch EXACTLY the two retired names and NOT the load-bearing
`proof:specular-handoff` one clause away. `proof:all` (the suite name) is excluded as
never-a-gate.

### The four chronics, verified resolving (GREEN)
| Chronic | Load-bearing closure (all RESOLVE + run in proof:all) | RETIRED (required ABSENT) |
|---|---|---|
| **cartoon-shadow D2 / D14** | `proof:cartoon-is-panel-depth` + `proof:no-orphan-specular` + `proof:glass-and-cartoon` + PAIRED `proof:specular-handoff` (HANDOFF) | `proof:cartoon-specular-coexist`, `proof:specular-calm` |
| **φ-hero D7** | `proof:phi-leaf-zero` + `proof:hero-rung` | — |
| **mobile D10** | `proof:mobile-single-page` + `proof:drawer-spring` | — |
| **dock D5 + popover D9** | `proof:dock-morph-settled` (HANDOFF born-RED) + `proof:dock-popover-opens` + `proof:single-toggle` | — |

**Bite-verified (isolated PROGRESS.md / package.json copies, restored after):**
- **M1** — rename the D7 closure gate to a non-existent `proof:phi-ghost-gate` → reds on the
  DANGLING reference.
- **M3** — strip the D5 born-RED gate name leaving HANDOFF prose → reds `[D5] … a bare
  HANDOFF tag is no longer a terminal`.
- **half-retire** — add `proof:specular-calm` back to `package.json` → reds `RETIRED gate …
  STILL RESOLVES`.
- coverage — drop a chronic row (D2/D7/D10/D5) from the table → reds `[coverage] … MISSING`.

---

## Cross-lane coupling (RESOLVED at write time)
`proof:dock-morph-settled` (the D5 dock consume-leg born-RED HANDOFF gate, the canonical
BLK-3 name — NOT `proof:dock-live`) is **Lane C's S4 deliverable**. The meta-gate REQUIRES it
to resolve + run in `proof:all` (that requirement IS the M3 bite). At Lane A author-time the
gate was born-RED on the dangling `proof:dock-morph-settled`; Lane C has since landed the
script key + `proof:all` member + the glass-ui `^3.4.0 → ^3.5.1` bump, so the meta-gate is
now **GREEN**. (Note: `proof:dock-morph-settled` is itself born-RED until the bumped
`--spring-dock` token is installed — the kf-side WATCH; the meta-gate only asserts it
RESOLVES + is paired, per the discipline.)

## Wiring
- `package.json` — added `proof:manifest-sourced` + `proof:chronic-closure` script keys +
  both into the `proof:all` chain (before `proof:ci-coverage`). **Did NOT touch** the
  glass-ui optionalDependencies line (Lane C — now `^3.5.1`).
- `.github/workflows/ci.yml` — both gates added to the library `gates` job (static,
  glass-ui-free), before `proof:ci-coverage`. `proof:ci-coverage` clause-0 confirms all 96
  proof:* gates (incl. these 2) are invoked in CI. My additions introduce ZERO version
  literals.

## Known residual (NOT Lane A's)
`proof:ci-coverage` reds on a `version-literal` clause: ci.yml prose hardcodes `^3.4.0`
glass-ui literals (lines 192, 266) that disagree with the now-`^3.5.1` `package.json` range.
Those literals are **glass-ui consume-leg prose — Lane C's S4 blast-radius**, not Lane A's
(the instruction is explicit: do NOT touch the glass-ui line). Lane A's two gates pass; the
ci-coverage coverage clause-0 (the one that matters for these gates) passes.

## Files
- `scripts/lib/demo-driver.mjs` — SCENES re-sourced from scenes.ts + stale-key guard +
  derived `SUPER_KEY_BY_ROUTE` (M).
- `scripts/proof-manifest-sourced.mjs` — NEW (S1 gate).
- `scripts/proof-chronic-closure.mjs` — NEW (S3 meta-gate).
- `package.json` — 2 script keys + 2 `proof:all` members (M).
- `.github/workflows/ci.yml` — 2 CI steps in the `gates` job (M).
