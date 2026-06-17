# Lane 12 — L Close-reconciliation: the cross-wave debt pattern

**Lane:** 12 · **Tranche:** M (seed audit) · **Date:** 2026-06-17
**Branch audited:** `tranche-l-dev` (tip `4b3d2eb`) · **Commits under review:** `d7c7f3d` + `e4a1cc3`
**Subject:** the two-commit L.WZ close-reconciliation band — three hygiene reds surfaced by the
full-roster re-run, a real W11 a11y contrast regression, and the easing-sidebar class-reuse conflict;
the structural root (per-wave piped-exit masking) and its M cure.

---

## §0 — Verdict summary

The close-reconciliation (`d7c7f3d` + `e4a1cc3`) is **honest and correctly executed**. Every fix is
idiomatic — no gate weakened, no ceiling raised, no token recolored. The cures themselves are
straightforward. The finding this lane brings to M is the **structural mechanism** that made all five
defects invisible to per-wave checks: the serial `&&` chain + piped-exit invocation pattern masks any
wave-accreted roster red until the full `CI=true proof:all` roster is re-run with CLEAN exit capture
at the close. That mechanism is the cross-wave debt PATTERN, and it recurs every tranche. M's
architectural answer is the test-consolidation the gate-apparatus verdict already chartered
(`docs/tranches/L/audit/gate-apparatus-VERDICT.md`): replace the serial chain with a parallel
report-all runner so every red surfaces on every run, not just the full-roster close sweep.

| Finding | Commit | Kind |
|---|---|---|
| `proof:gate-is-runtime` red — `proof:transport-events` mis-tiered in `proof:correctness` | `d7c7f3d` | hygiene / tier mismatch |
| `proof:agent-surface` red — W9 `Oscillator` export missing from regenerated `llms-full.txt` | `d7c7f3d` | hygiene / stale artifact |
| `proof:decomposition` red — 4 files grew past ceilings (`drag` 555>550, `index` 731>550, `sequence` 817>700, `spring` 806>700) | `d7c7f3d` | hygiene / oversize |
| `proof:lighthouse-a11y` red — W11 cube-attitude readout and axis labels under WCAG AA contrast | `e4a1cc3` | real behavioral regression |
| `proof:easing-sidebar-normalized` red — W11 `.text-admin-label` class on `EasingCurveCanvas` conflicts with 0-admin-label invariant | `e4a1cc3` | hygiene / class-reuse |

---

## §1 — The three hygiene reds (`d7c7f3d`) — ground-truth verification

### 1.1 — `proof:gate-is-runtime`: tier mismatch

**Finding.** `proof:transport-events` (authored at L.W5, `29bf376`) is a pure node script over the
compiled LIGHT barrel (`dist/keyframes.js`). The gate script confirms this at
`scripts/proof-transport-events.mjs:40`: *"The gate runs over the COMPILED / LIGHT barrel … the
`proof:orchestration` pattern: a node script, no browser, no demo build needed."* No
`demo-driver.mjs` import; no `chromium.launch`; no `serveDist`.

The `proof:gate-is-runtime` meta-gate (`scripts/proof-gate-is-runtime.mjs`) derives the correctness
tier's membership dynamically from `package.json`'s `proof:correctness` chain and asserts each
member opens a real browser and actuates the product (clauses a/b/c, `proof-gate-is-runtime.mjs:17–24`).
A node-only gate in `proof:correctness` violates this precept.

**How it got mis-tiered.** The L.W5 wave spec (`docs/tranches/L/waves/L.W5.md:327`) explicitly
said: *"Add to `proof:correctness` and to `ci.yml` `gates` job (LIGHT, no browser, no demo build
needed — vitest-jsdom is sufficient; the gate is a node script over the compiled barrel, matching
the `proof:orchestration` pattern)."* The spec author conflated "I want CI to run this gate" with
"add to `proof:correctness`" while simultaneously naming the `proof:orchestration` sibling pattern
that sits in `proof:hygiene`. The implementation followed the spec literally (`29bf376` — see diff
against `proof:correctness` before/after in `d7c7f3d`).

**Cure.** `d7c7f3d` moved `proof:transport-events` from `proof:correctness` to `proof:hygiene`
beside its node-gate sibling `proof:orchestration`. `proof:ci-coverage` stays green: it rides the
`gates` CI job either way.

**Verified.** Before: `proof:gate-is-runtime` exit 1 (transport-events in correctness, no browser
harness). After: exit 0. Observed in `d7c7f3d` commit message; confirmed by the package.json diff
showing removal from `proof:correctness` and insertion into `proof:hygiene`.

### 1.2 — `proof:agent-surface`: stale llms index

**Finding.** L.W9 (`791b3bd`) shipped the `Oscillator` LIGHT primitive on the published barrel
(`src/animation/oscillator.ts`) but did not re-run `node scripts/gen-agent-surface.mjs`. The
`llms-full.txt` index (the agent-authoring surface the LLM index exposes) omitted `Oscillator` and
`waveformValue`. `proof:agent-surface` checks this index.

**Verified.** `d7c7f3d`'s diff against `llms-full.txt` shows exactly two lines added:

```
+- `Oscillator`
```

(plus the `waveformValue` entry). The artifact was stale from `791b3bd` forward.

**Cure.** `node scripts/gen-agent-surface.mjs` regenerates the index from the live barrel. This is
an O(1) mechanical step that per-wave checks did not execute because W9's commit message only
verified `proof:boundary` and `proof:published-surface`, not `proof:agent-surface`.

### 1.3 — `proof:decomposition`: four files overgrew their ceilings

**Finding.** The `proof:decomposition` gate enforces `LIBRARY_CEILING = { ".ts": 550 }` for
`src/animation/**` with per-file overrides for four god-modules (`proof-decomposition.mjs:119,128`).
The Band-A waves accreted code across files that were not in the override map:

| File | Pre-close size | Ceiling | Wave that grew it |
|---|---|---|---|
| `drag.ts` | 555L | 550L | L.W5 (bounds/snap/rubber-band) |
| `index.ts` | 731L | 550L | L.W7/W8 (load accessors + dogfood wiring) |
| `sequence.ts` | 817L | 700L | L.W5 (transport-event bus) |
| `spring.ts` | 806L | 700L | L.W7 (spring-vector sugar) |

**Cure.** Four COHESIVE extractions (the `engine-composition.ts` precedent — never a ceiling
override):
- `drag.ts` → `drag-2d.ts` (the W5 2-D sugar, 115L): `drag.ts` stays at 462L.
- `spring.ts` → `spring-reseat.ts` (PHYS-B2 reseat logic, 98L) + `spring-duration.ts` (from-duration, 83L): `spring.ts` stays at 685L.
- `sequence.ts` → `sequence-events.ts` (the W5 event bus, 216L): `sequence.ts` stays at 698L.
- `index.ts` → `load-engine.ts` (the dynamic-boundary loading machinery, 538L): `index.ts` stays at 246L.

Barrel exports are re-exported through the original files; `proof:published-surface` and
`proof:boundary` stay green throughout. `proof:spring-blend-weight`'s PHYS-B2 anchor retargets to
`spring-reseat.ts` (the bodies' new home — the same anchor-follow `proof:composition-honored` did
for `engine-composition.ts`).

**Verified.** Current file sizes: `drag.ts` 462, `drag-2d.ts` 115, `spring.ts` 685,
`spring-reseat.ts` 98, `spring-duration.ts` 83, `sequence.ts` 698, `sequence-events.ts` 216,
`index.ts` 246, `load-engine.ts` 538 — all within ceilings.

---

## §2 — The two behavioral findings (`e4a1cc3`) — ground-truth verification

### 2.1 — `proof:lighthouse-a11y`: W11 contrast regression (the real behavioral fix)

**Finding.** The W11 cube-attitude readout (the live `rx/ry/rz` Euler chip at `CubeTarget.vue`)
rendered with two contrast failures on the light stage:

- The `.readout-accent` value chip used `--accent-red` directly — a hue-constrained token with a
  computed contrast ratio of ~3.32:1 against the light background, below the WCAG AA floor of 4.5:1.
- The axis labels inside the cube (the `rx`/`ry`/`rz` headings) carried an `opacity: 0.86` / `opacity: 0.7`
  modifier that diluted foreground color to ~2.41:1.

**Why the keeper-crayon constraint created the tension.** `--accent-red` is a protected keeper
token (`proof:crayon-preserved` enforces hue-exact preservation). It cannot be recolored. The cure
therefore used a `color-mix` to blend the live ball tone toward `--foreground`:

```css
/* demo/cube/CubeTarget.vue:459 (post-cure) */
color: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 70%, var(--foreground));
```

This achieves 5.39:1 theme-adaptively without touching the `--accent-red` token. The opacity
modifiers on axis labels were dropped, raising them to 5.20:1.

**Why the gate missed it per-wave.** W11's per-wave commit (`4686aa4`) verified
`proof:crayon-preserved`, `proof:design-refinement`, `proof:visual-lock`, and "the full demo
roster" — but NOT `proof:lighthouse-a11y` individually. The `proof:lighthouse-a11y` gate
(`scripts/lighthouse-gate.mjs`) was IN the `proof:hygiene` chain at W11 (confirmed: it appears in
the `4686aa4` package.json hygiene chain). The masking route: per-wave checks at W11 ran a subset
of the hygiene chain (the commit message enumerates them explicitly), not `CI=true proof:all`.
`proof:lighthouse-a11y` is a browser gate that drives the built dist through Lighthouse — a ~2min
runtime cost per scene. Per-wave developers skip it in favor of faster targeted gates.

**This is the only behavioral fix in `e4a1cc3`** — the commit message says explicitly:
*"A REAL W11 design regression (the only behavioural fix)"*.

### 2.2 — `proof:easing-sidebar-normalized`: class-reuse conflict

**Finding.** L.W11 added an instrument masthead label to `EasingCurveCanvas.vue`:

```html
<!-- demo/@/components/custom/EasingCurveCanvas.vue (W11 state) -->
<span class="easing-instrument-label text-admin-label" aria-hidden="true">EASE · f(t)</span>
```

The `proof:easing-sidebar-normalized` gate (`scripts/proof-easing-sidebar-normalized.mjs:224`)
queries `panel.querySelectorAll(".text-admin-label")` inside the easing scene's active controls
tabpanel and asserts `adminLabels.length === 0` (clause (a), the standard-rung check). Since
`EasingCurveCanvas` is mounted directly inside `EasingSidebar.vue` (confirmed:
`demo/easing/EasingSidebar.vue:33` imports it), the `.text-admin-label` class propagates into the
sidebar subtree and the gate finds `adminLabelCount > 0`.

**Root cause.** The W11 label's typographic style was borrowed from the `.text-admin-label` class
(matching its size/weight profile) but the class ITSELF is a normalized-sidebar structural marker
that the H.W10 normalization explicitly eliminated from the easing scene. Reusing the class on an
instrument label inside the canvas re-introduced the structural marker into the sidebar scope
without touching the sidebar layout.

**Cure.** `e4a1cc3` split the label onto its own class `.easing-instrument-label` with verbatim
`font-size`/`letter-spacing`/`font-weight` values (not the class):

```css
/* demo/@/components/custom/EasingCurveCanvas.vue:302–310 */
.easing-instrument-label {
    /* W11 engraving — own type (verbatim text-admin-label), not that
       sidebar-normalized-away semantic class (proof:easing-sidebar-normalized). */
    font-size: var(--type-admin-label);
    …
}
```

The `EasingCurveCanvas.vue` split also extracted drag interaction into
`composables/useEasingCurveDrag.ts` (134L), reducing the canvas file from 499L to 464L — well
within the 500L demo ceiling.

**Why the gate missed it per-wave.** Same masking route as §2.1: W11's commit message enumerates
specific gates it verified but NOT `proof:easing-sidebar-normalized`, which is a browser gate at
position ~55 in the ~130-gate `proof:hygiene` serial chain. Per-wave, developers ran targeted gates
for their wave scope; the normalized-sidebar gate is not "in scope" for a design-refinement wave.

---

## §3 — The structural root: piped-exit masking + per-wave scope selection

The five defects above share ONE root cause: **they were all reachable by the `proof:hygiene` chain
at the wave's commit point, but the per-wave checks did not run the full chain.**

**The masking mechanism has two components:**

1. **Scope selection** — per-wave developers verify their OWN new gates plus a targeted subset.
   The W5 commit (`29bf376`) says "proof:transport-events + three proof:drag-gesture arms + proof:boundary + proof:ci-coverage + vitest" — not `proof:hygiene`. The W9 commit (`791b3bd`) says "proof:workaround-deletion + proof:boundary + proof:published-surface" — not `proof:agent-surface`. The W11 commit (`4686aa4`) says "proof:crayon-preserved + proof:design-refinement + … + the full demo roster" — which is `proof:demo-smoke`, not the full `proof:hygiene` chain (which includes `proof:easing-sidebar-normalized`, `proof:lighthouse-a11y`, etc.).

2. **Piped-exit opacity** — when developers DO run `npm run proof:hygiene`, they commonly redirect
   output to a log file (`npm run proof:hygiene | tee /tmp/out.txt`) or pipe through `grep`. Without
   `set -o pipefail` (not set in any wave's documented check procedure), the pipe's exit code is
   the last command's (`tee` → always 0), silently masking the npm exit 1. The FINAL.md
   (`FINAL.md:33`) explicitly names this: *"the per-wave incremental checks had masked these via
   piped exit codes."*

**The consequence: the full-roster close-reconciliation is structural debt.** Each tranche that
uses the serial `&&` chain + per-wave subset checking will accumulate wave-accreted reds that only
appear on the full-roster close re-run. L required a two-commit close band (`d7c7f3d` + `e4a1cc3`)
to clear reds that individually took minutes to fix but took a ~15–30min full-roster pass to
discover. The serial `&&` chain compounds this: once the chain finds a red, it aborts — discovering
further reds requires additional passes, each re-paying the full prefix.

**The spec-error subcase.** The `proof:transport-events` tier mismatch is a stronger variant: the
WAVE SPEC itself (`L.W5.md:327`) explicitly instructed "Add to `proof:correctness`" while
simultaneously naming the node-only `proof:orchestration` pattern that belongs in `proof:hygiene`.
The spec author knew the gate was node-only but wrote the wrong tier. The `proof:gate-is-runtime`
meta-gate would have caught this immediately IF the full roster had been run at W5. Instead, the
mis-tier propagated silently from W5 (`29bf376`) through W11 (`4686aa4`) — five commits — before
the close re-run surfaced it.

---

## §4 — What per-wave green-masking means for M

The close-reconciliation is not a failure of individual discipline — each wave's per-wave checks
were appropriate for that wave's scope. The failure is a **structural property of the serial `&&`
chain** as the sole integration harness: it cannot surface cross-wave reds during development, only
at the close when the full roster is re-run.

**The existing answer** (`gate-apparatus-VERDICT.md §2–3`) is the correct one: collapse the two
test infrastructures into a single vitest architecture with four tiers, parallel workers, and
report-all by default. The decisive win is not raw pass-time but killing the O(N²) iterate loop: a
parallel run that surfaces every red on every run replaces the current model where reds are
discovered serially at the close.

**Beyond the runner.** Two additional structural changes prevent the masking independent of the
runner migration:

1. **Wave-close discipline: run `CI=true proof:all` (not a subset) before committing a wave.**
   This is already the STATED requirement (`L.WZ.md §S6`: *"the full `CI=true proof:all` re-run is
   the deploy signal"*) but in practice each wave ran only a subset. A wave spec template that
   explicitly calls out `CI=true proof:all` as the pre-commit gate (not just "your new gate +
   related gates") closes the scope-selection loophole. Cost: adds ~15–30min per wave on the
   current runner; becomes minutes after the test-consolidation lands.

2. **Gate-anchor discipline: when code moves, FOLLOW the anchor before committing.** Three of the
   five `e4a1cc3` fixes were gate-anchor retargets where the code moved (index.ts → load-engine.ts,
   engine.ts → engine-css-metadata.ts, @src/animation/* → barrel) but the gate script still read the
   old location. A wave that extracts code must update every gate that anchors into the extracted
   files in the SAME commit. The `engine-composition.ts` / `spring-reseat.ts` precedent captures this
   (the `proof:composition-honored` / `proof:spring-blend-weight` anchor-follow pattern) but it is
   currently applied ad-hoc, not as a systematic pre-commit check.

---

## §5 — Precept findings in the L-as-built

The close-reconciliation is **precept-clean** — every fix is a honest cure. The precept observations
below are structural patterns the close exposed, not individual violations in the commits.

**No quick solutions / workarounds.** All five fixes are idiomatic:
- The tier move is a one-line `package.json` change restoring the correct classification.
- The llms regeneration is the designed artifact-regeneration step.
- The decomposition extractions follow the established `engine-composition.ts` precedent.
- The contrast fix uses `color-mix` (the CSS-idiomatic color deepening) rather than exempting the gate.
- The class-reuse fix introduces a properly-scoped own class rather than widening the gate's exclusion list.

**The wave-spec error** (`L.W5.md:327` "Add to `proof:correctness`" for a node gate) is a
hygiene gap in the spec discipline — the spec author knew it was a node gate but wrote the wrong
tier. In M, the wave-spec template should include the tier assignment check as a mandatory field
(`GATE TIER: correctness | hygiene | report-all`), forcing the author to name which tier and why.

---

## §6 — M-wave proposals

### M-ARCH-1 (primary): test-architecture consolidation (already chartered)

The gate-apparatus verdict (`docs/tranches/L/audit/gate-apparatus-VERDICT.md`) is the complete
specification: four-tier vitest architecture (LINT / UNIT / INTEGRATION-BROWSER / E2E-deploy),
parallel workers, report-all by default, one shared browser, `globalSetup` dist server. This is the
direct structural answer to the masking root. It is already a named candidate Tranche-M charter seed
by the `gate-apparatus-VERDICT.md`'s own title.

**Why it directly addresses the masking.** Once browser gates are `*.browser.test.ts` files running
in parallel via vitest, `npm test` surfaces every red on every run — whether the developer runs the
full suite or not. The per-wave scope-selection loophole closes because "run the suite" becomes a
fast, non-selective operation.

### M-ARCH-2 (supplementary): wave-close pre-commit gate check

As a companion to M-ARCH-1 (and effective before M-ARCH-1 lands), M should establish a **written
wave-close pre-commit requirement**: `CI=true npm run proof:all` (or, post-consolidation, `npm test`)
must exit 0 before a wave commit lands. This can be enforced via a git pre-push hook or a
wave-spec field (`CLOSE-GATE: CI=true proof:all exit 0 confirmed`). It closes the scope-selection
loophole independently of the runner architecture.

### M-ARCH-3 (supplementary): gate-anchor follow-up as a per-extraction rule

When code moves between files (extractions, renames, module splits), every gate that anchors into
the moved code must be updated in the SAME commit. This is already practiced ad-hoc (the
`engine-composition.ts` / `spring-reseat.ts` precedent). M should make it a written rule in the
wave-spec template: *"For each extracted module, run `grep -r 'old-filename' scripts/` and update
every matching anchor."*

### M-ARCH-4 (supplementary): wave-spec tier field

The `proof:transport-events` tier mismatch originated in the wave spec. M wave specs should include
a mandatory `GATE TIER: correctness | hygiene | report-all` field for every new gate, with the
tier-selection criterion documented inline (correctness = browser + actuated product; hygiene = any
non-browser or source-shape gate; report-all = born-RED-by-design tripwires).

---

## §7 — Deferred folds

**DL-M (from the close-reconciliation band, already discharged in L):**
All five close-reconciliation items were cured in `d7c7f3d` + `e4a1cc3`. They are NOT open
deferrals entering M. They are EVIDENCE of the structural pattern M-ARCH-1 must close.

**DL-L-load-engine gate-anchor retargets** (`e4a1cc3`) are CLOSED — the five gate scripts that
anchored into `index.ts`'s dynamic import edges now read from `load-engine.ts`. Cited in the
`e4a1cc3` commit message; verified by reading the updated scripts (`proof-drawsvg.mjs`,
`proof-ingest-replay.mjs`, `proof-compile-replay.mjs`, `proof-agent-validate.mjs`,
`proof-scroll-roundtrip.mjs`).

The CHRONIC-CLOSURE substrate re-point (`K/PROGRESS.md → L/PROGRESS.md`) remains the
orchestrator's final atomic motion — NOT executed in the close-reconciliation band, and the
`529fcfd` FINAL.md records it as the named finale.

---

## §8 — Cross-repo asks

None. The close-reconciliation findings are entirely kf-internal: tier wiring, artifact generation,
file size, contrast tokens, class scoping. No sibling (value.js / parse-that / glass-ui) is
implicated.

---

## §9 — Performance numbers

The gate-apparatus verdict measured the structural cost quantitatively (`gate-apparatus-VERDICT.md
§1 evidence index`):
- 142 leaf gates in `proof:all`; 72 (51%) spawn a browser consuming 92–96% of wall-clock.
- Single clean `proof:all` pass: ~15–31 min (median vs mean).
- Non-browser 70 gates + full vitest suite: ~70 seconds.
- O(N²) re-run tax: 5–6 reds × ~30-min full-prefix re-run = ~2.5–3 hours.

The close-reconciliation's five individual fixes took minutes. The discovery cost was the ~15–31min
full-roster pass (times 2 passes: `d7c7f3d` first, `e4a1cc3` second). Under M-ARCH-1's target
architecture (single-digit minutes, all reds in one parallel pass), both passes would have been
eliminated — the reds would have surfaced at the per-wave `npm test` before any commit landed.

---

## Evidence index (verified read-only, 2026-06-17, tranche-l-dev `4b3d2eb`)

- `d7c7f3d` diff, `package.json`: `proof:transport-events` removed from `proof:correctness`,
  inserted into `proof:hygiene` (verified by shell diff above).
- `d7c7f3d` diff, `llms-full.txt`: `+ Oscillator` (+ waveformValue) added (verified).
- `d7c7f3d` commit message: 4 file over-ceiling values (`drag 555>550`, `index 731>550`,
  `sequence 817>700`, `spring 806>700`) + extraction sizes (all within ceilings — verified by
  `wc -l` above).
- `scripts/proof-transport-events.mjs:40`: "node script, no browser, no demo build needed".
- `docs/tranches/L/waves/L.W5.md:327`: "Add to `proof:correctness`" instruction (the spec error).
- `scripts/proof-gate-is-runtime.mjs:17–24`: correctness-tier browser requirement (clauses a/b/c).
- `scripts/proof-gate-is-runtime.mjs:82`: PROOF_CORRECTNESS derived dynamically from package.json.
- `e4a1cc3` diff, `demo/cube/CubeTarget.vue`: opacity modifiers removed; `color-mix` deepening added
  (`CubeTarget.vue:459`).
- `e4a1cc3` diff, `demo/@/components/custom/EasingCurveCanvas.vue:11`: `.text-admin-label` class
  removed from span; `.easing-instrument-label` standalone (`:302–310`).
- `scripts/proof-easing-sidebar-normalized.mjs:224`: `querySelectorAll(".text-admin-label")` in the
  sidebar's active tabpanel.
- `demo/easing/EasingSidebar.vue:33`: EasingCurveCanvas imported and rendered inside the sidebar.
- `docs/tranches/L/FINAL.md:33`: "per-wave incremental checks had masked these via piped exit codes".
- `docs/tranches/L/audit/gate-apparatus-VERDICT.md`: the M-ARCH-1 charter seed; timing evidence;
  migration phases 0–4.
