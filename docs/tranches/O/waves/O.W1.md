# O.W1 — The lint/dep-cruiser tier (the fast-iterate floor)

**Band:** A — Apparatus + ledger hygiene
**Phase:** NOW (kf-internal; no sibling publish gate)
**Sequence:** O.W0 (charter) → **O.W1** → O.W2 (parallel, no dependency between them) → B{O.W3, O.W4}
**Owning chronic/DM:** none (apparatus wave; the no-covered-loss precept applied to the LINT tier)

M-substrate: **M.W2** (the lint-tier developed wave, 2026-06-17). This wave IMPLEMENTS M.W2's
spec as written. Key delta from M.W2 to O.W1: (a) the O charter confirmed M.W2 was never
implemented (no `eslint.config.*` / no `.dependency-cruiser.*` — verified live 2026-06-19);
(b) the 33-gate roster has grown modestly since M.W2 was authored (several post-M gates were
added); (c) the W96 parse-that boundary scan named at M.W2 as a "forward seam" now has a
concrete O-tranche home (O.W16, G band) — the depcruise forward-seam stub is structurally
identical to M.W2's design. Nothing in M.W2's S1–S6 scope is superseded; O.W1 is the
implementation authorization wave, delta-noted here and referencing M.W2 for the full
developed spec.

---

## Context

M.W2 documented the evidence precisely (lane-13, lane-15, lane-16 from the M audit). The state
is unchanged on the O audit (2026-06-19):

- `node_modules/eslint` **ABSENT** — greenfield install, no config to migrate.
- `node_modules/dependency-cruiser` **ABSENT**.
- `eslint.config.mjs` / `.dependency-cruiser.mjs` — neither exists anywhere in the repo tree.
- `proof:lint-tier` — not a `package.json` key; `scripts/proof-lint-tier.mjs` does not exist.
- The 33+ pure source-shape gates (`grep -L "demo-driver\|chromium\|playwright\|vitest"
  scripts/proof-*.mjs`) continue to run as 33+ individual node forks, each re-reading the source
  tree from scratch.

The re-audit (O audit, 2026-06-19) adds no new material finding to lane-13/15/16 — the gate
roster grew but the diagnosis is unchanged: the LINT tier is entirely absent, every source-shape
invariant lives as a separate fork, and the fast-iterate floor M.W2 designed is unbuilt.

### Audit evidence (selected, confirming M.W2 findings hold on 2026-06-19 tree)

| Ref | Source location | Fact |
|-----|-----------------|------|
| O.md §1 table | M.W2 row | "no eslint/dep-cruiser config exists" — confirmed as the O.W1 entry point |
| M.W2 §Context lane-13 §1 | `ls node_modules/eslint` | **ABSENT** — greenfield, no migration needed |
| M.W2 §Context lane-15 §0 | `grep -L …` count | **33** source-shape gates at M.W2; count ≥33 on 2026-06-19 tree (new post-M gates added) |
| M.W2 S3 / lane-13 C2 | `scripts/proof-boundary.mjs:21,47,86–95` | the hand-rolled module-graph walk IS `import/no-restricted-paths` + depcruise forbidden-edge — the gold standard M.W2 designed the depcruise rule to match |
| O.md §3 Band-A | O.W1 | "lint/dep-cruiser tier, phase NOW: author proof:lint-tier — eslint flat-config + dependency-cruiser src→demo boundary rule; born-RED on the absent config" |
| O audit D17 | stale `proof:control-point-live` | M.W2's S6 note that `proof:lint-tier` runs the coverage-matrix including any retired gates is confirmed — the coverage-matrix must include the `proof:control-point-live` retirement (O.W2 companion) |

The forward seam note from M.W2 S3: the W96 parse-that forbidden-edge depcruise clause is
authored at **O.W16** (Band G, the S9 delete wave), not here. The depcruise boundary rule in
O.W1 S3 is structured so the parse-that sibling clause is a one-line add — named here, filled
at O.W16.

---

## Scope

O.W1 implements M.W2 S1–S6 verbatim. The full developed spec with detailed S-clause prose is
in M.W2.md — this wave carries the authorization, the born-RED gate, the delta notes, and the
implementation guide; it does NOT re-author M.W2's body in full.

### S1 — Greenfield install of eslint + dependency-cruiser

Install: `npm install -D eslint dependency-cruiser @typescript-eslint/parser @eslint/js
eslint-plugin-vue`. Author ONE flat `eslint.config.mjs` (ESLint 9+ flat-config form — NOT a
legacy `.eslintrc`) and ONE `.dependency-cruiser.mjs`. Add `npm run lint` = `eslint . &&
depcruise src` to `package.json`. Full spec: M.W2 S1.

### S2 — `max-lines` with the per-file override table

eslint `max-lines` per glob (demo 500L, library `.ts` 550L / `.vue` 350L), with per-file
override blocks for rationale-bearing exceptions (engine.ts 1400). The stale-override guard
(a file that has since shrunk back under base should not retain a raised cap) is preserved as
a custom rule or vitest meta-unit clause. Full spec: M.W2 S2.

### S3 — `import/no-restricted-paths` + depcruise boundary edge-scan

Two complementary rules: (1) a depcruise `no-light-to-valuejs` forbidden-edge rule over the
static-import graph from `src/animation/index.ts`; (2) an eslint `import/no-restricted-paths`
fast source-level guard. The W96 parse-that forbidden-edge clause (`no-light-to-parsethat`) is
the forward seam — structurally one-clause add in O.W16, not implemented here. Full spec: M.W2 S3.

### S4 — Custom eslint rules for the remaining grep gates

Custom `eslint-plugin-kf` (flat-config-local) encoding: `no-dup-utility`, `single-writer`,
`no-brittle-selector`, `idioms`, `styling-idioms`, `no-single-option-select`,
`no-deprecated-guard`. Each rule encodes the exact predicate the current node fork runs —
same forbidden patterns, same allowlists, same write-boundary file set. Full spec: M.W2 S4.

### S5 — The coverage-invariant witness (no-coverage-loss proof)

A per-gate planted-violation matrix (`test/lint-coverage/<gate>.violation.fixture` +
one vitest meta-test) proving each migrated rule reds on its specific planted violation —
not just that the tool ran. All 33+ gates must be classified (eslint / depcruise / vitest
data-model / exception routed elsewhere). Full spec: M.W2 S5.

### S6 — The package.json/scripts meta-unit

ONE vitest meta-unit (`test/lint/gate-shape.test.ts`) for the data-model shape checks
(`chronic-closure`, `ci-coverage`, the `gate-is-runtime` policy) — the AXIS-2 home per
inv-M-two-axis. Full spec: M.W2 S6.

---

## Born-RED gate

**Gate name:** `proof:lint-tier` — NEW. Does not exist in `package.json` or `scripts/`.
Verified absent 2026-06-19: `grep "lint-tier" package.json` → no match;
`ls scripts/proof-lint-tier.mjs` → no such file.

**The REAL observable (observable-truth).** The born-RED witness is the GENUINE absence:
`eslint` is not installed (`node_modules/eslint` absent), no `eslint.config.mjs` exists,
no `.dependency-cruiser.mjs` exists, `dependency-cruiser` is not installed, and `proof:lint-tier`
is not a `package.json` script key. Running the gate on today's tree fails at the FIRST clause
(S1: `eslint --version` does not resolve — command not found). This is the actual missing
apparatus, not a proxy for it.

**Plant-a-failure (born-RED today, GREEN after cure):**

The gate is born-RED by construction — the tool itself is absent. The plant does not require
injecting a violation; the absence IS the violation. The three observable states:

| Clause | Witness on today's tree | RED today | GREEN after cure |
|--------|------------------------|-----------|-----------------|
| S1 | `eslint --version` / `stat eslint.config.mjs` / `stat .dependency-cruiser.mjs` | command not found; both configs absent; `proof:lint-tier` not in `package.json` | tool resolves; configs present; `npm run lint` is a script |
| S2 | plant 600L `demo/app/Foo.vue` + 1500L `engine.ts` + a slack override → `npm run lint` | no `max-lines` → silently passes | eslint reds on each; slack-override guard reds |
| S3 | add `import "@mkbabb/value.js"` to `numeric.ts` → `npm run lint` | no depcruise → LIGHT→value.js edge unguarded | depcruise + import rule red on the forbidden edge |
| S4 | re-author a deleted `.scale-on-hover` rule; assign `.activeScene` from outside the machine | no custom rules → silently passes | matching `kf/*` rule reds on each |
| S5 | run coverage-matrix meta-test | 0 of 33 gates have a successor → RED | all gates mapped; each fixture reds successor rule |
| S6 | check for vitest meta-unit | `chronic-closure`/`ci-coverage` are node forks | meta-unit exists; asserts chain shape |

**Green condition:** `eslint .` exits 0 over the clean tree with every migrated rule active;
`depcruise` exits 0 on the boundary/published-surface graph; the coverage-matrix meta-test maps
all 33+ gates to successor rules that red on their planted violations; the gate-shape meta-unit
asserts chain shape on the vitest axis. ONE static pass subsumes ~33 node processes (M.W2 lane-13
§6: `~33 processes → 1 pass`, `~10–15s → <2s`).

---

## Dependencies

- **eslint + dependency-cruiser (npm registry)** — `npm install -D eslint dependency-cruiser
  @typescript-eslint/parser @eslint/js eslint-plugin-vue`. Greenfield (no config to migrate).
  NOT a sibling publish gate.
- **No sibling dep.** The gate-apparatus consolidation is entirely kf-internal.
- **M.W2 forward seam (NOT a blocker).** The W96 parse-that forbidden-edge clause is authored
  at O.W16 (Band G). O.W1's depcruise rule is forward-compatible; W16 fills the seam.
- **Independent of O.W2.** O.W1 and O.W2 are parallel Band-A waves with no dependency between
  them. O.W1 owns the tool tier; O.W2 owns the ledger re-point + stale-gate retarget.
- **Composes with O.W0 (charter).** O.W0 is the gate-first docs wave; O.W1 is the first
  implementation-eligible wave after authorization.

---

## dev→impl boundary

This is the implementation-authorization wave. The full developed spec is M.W2.md. O.W1
carries: the authorization, the born-RED gate (above), the delta notes (roster grew, W96
seam is O.W16), and the reference to M.W2 for the full S-clause prose. IMPLEMENTATION
(the actual `eslint.config.mjs` authoring, the depcruise config, the custom plugin, the
coverage-matrix fixtures, the vitest meta-unit, the `package.json` wiring) opens on the
owner's explicit authorization, exactly as O.md §8 specifies.
