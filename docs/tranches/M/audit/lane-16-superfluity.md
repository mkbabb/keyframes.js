# Lane 16 — superfluity: the M prune design
## Tranche M candidate wave seed

**Status:** AUDIT ONLY. No gate changed, no code written. All counts and
file:line citations were verified by direct read and command against the live
tree (`tranche-j-dev`, tip `4f1fc4c`; gate scripts and `package.json` are
identical to the `tranche-l-dev` close tip `529fcfd` where `proof:all` ran
GREEN). The L audit's gate-apparatus-C-superfluity doc is the input; every
claim below is re-verified or corrected against ground truth. The L audit doc
itself shipped at least one **factual error** in its `border-radius` claim (see
§2.4); this lane finds and corrects it.

---

## 0. Ground-truth counts (re-derived, not inherited)

| Fact | Verified value | Source |
|---|---|---|
| Total `proof:*` keys | **150** | `python3 -c "import json; ..."` |
| Aggregators (`proof:all`, `proof:correctness`, `proof:hygiene`, `proof:all:demo`) | **4** | `package.json` values containing `npm run proof:` only |
| Leaf gates | **146** | 150 − 4 |
| `proof:hygiene` `&&` count | **124** | `scripts['proof:hygiene'].count('&&')` |
| `proof:hygiene` `;` count | **0** | verified |
| `proof:hygiene` `||` count | **0** | verified |
| Gates in `proof:all` (unique names) | **143** | correctness-18 + hygiene-125, dedup |
| `scripts/proof-*.mjs` count | **128** | `ls scripts/proof-*.mjs \| wc -l` |
| Scripts importing `demo-driver` | **67** | `grep -l demo-driver scripts/proof-*.mjs \| wc -l` |
| Self-launching chromium (NOT via demo-driver) | **2** | `proof-easing-sidebar-normalized.mjs`, `proof-easing-sidebar-minimal.mjs` |
| Pure source-shape gates (no browser, no vitest, no playwright) | **33** | `grep -L demo-driver\|chromium\|playwright\|vitest` |
| `waitForTimeout` calls across all scripts | **264** | `grep -c \| awk sum` |
| Scripts asserting `border-radius` AT RUNTIME (browser gates) | **4** | see §2.4 — NOT 5 |

---

## 1. The fairness contract (what "superfluous" means)

A gate is **not** superfluous when it catches a distinct regression even when
adjacent to another gate on the same surface. Two gates on the same `.vue` file
are both earned when they bite on ORTHOGONAL failure modes. A gate IS a
superfluity candidate only under one of:

- **(R1) CLAUSE-DUPLICATE** — re-asserts another gate's exact clause on the
  exact selector (the second assertion cannot red while the first is green).
- **(R2) STRICTLY-NESTED** — its property is a logical consequence of a broader
  gate's property (the narrow gate cannot red unless the broad one already does).
- **(R3) HISTORICAL ONE-OFF SUBSUMED** — born for a single past bug whose
  invariant is now structurally guaranteed by a primitive, so the dedicated gate
  is carry.
- **(R4) SELF-CHROMIUM DUPLICATE COLD-BOOT** — two gates cold-boot their own
  browser separately to assert facts that one boot could co-check.

---

## 2. The redundancy map — verified cluster by cluster

### 2.1 The bezier-* trio: `bezier-no-scroll` / `bezier-single-card` / `bezier-grown`

All three drive the **same surface** (the cubic-bézier detail panel opened via
`.easing-edit-btn`). All three call `withPage` through `demo-driver.mjs` and
cold-boot chromium per invocation. They appear **consecutively** in the
`proof:hygiene` chain at positions [58], [59], [60] (verified:
`…bezier-no-scroll && bezier-single-card && bezier-grown`).

Invariant comparison:

| Gate | Born | Distinct invariant | Verdict |
|---|---|---|---|
| `bezier-no-scroll` (H.W9 F2 S4) | `proof-bezier-no-scroll.mjs:1` | `scrollHeight ≤ clientHeight + TOL` + `overflow-y != scroll` (no panel scroll); back control baked header-RIGHT | **EARNED** |
| `bezier-single-card` (H.W11 I6 S5) | `proof-bezier-single-card.mjs:1` | exactly ONE Card depth between `.easing-curve-canvas` and `.controls-layout` (no card-in-card) | **EARNED** |
| `bezier-grown` (H.W11 I7 S6) | `proof-bezier-grown.mjs:1` | clause 1: canvas `block-size > 220px` (grew); clause 2: no `editing: {{ … }}` subtitle text; clause 3: STILL FITS (re-measures `scrollHeight ≤ clientHeight + TOL`) | **clauses 1+2 EARNED; clause 3 = R1 DUPLICATE** |

**The R1 duplicate:** `proof-bezier-grown.mjs:34,36–37` asserts
`scrollHeight ≤ clientHeight + TOL` and `overflow-y !== 'scroll'` on the SAME
panel host selector as `bezier-no-scroll`. The file's own header admits the
reuse at `:34` ("STILL FITS — composes with proof:bezier-no-scroll"), `:39`
("Reuses the W9 proof:bezier-no-scroll measurement plumbing"), `:52` ("Mirrors
scripts/proof-bezier-no-scroll.mjs"). The intent is sound — the grow must not
re-introduce scroll — but the clause is a property of `bezier-no-scroll` that
`bezier-grown` must not violate. It is an R1 duplicate measured on a second
browser-panel visit.

**Net redundancy:** 1 browser clause duplicated. Removing clause 3 from
`bezier-grown` (the `scrollHeight`/`overflow-y` assertion) saves one panel
re-visit per boot. The clause folds into `bezier-no-scroll` as "the grown canvas
still fits this bound" — an extension of the original fit oracle rather than a
new measurement.

### 2.2 The easing-sidebar pair: `normalized` / `minimal`

Both drive the **same surface** (the easing sidebar Card). Both self-launch
chromium independently (not via `withPage`; verified: `grep "chromium.launch"
proof-easing-sidebar-normalized.mjs` → `chromium.launch()` at line 278;
`proof-easing-sidebar-minimal.mjs` → `chromium.launch()` at line 381). Neither
imports `demo-driver.mjs`. This is an **R4 double cold-boot** for one surface.

| Gate | Born | Distinct invariant | Verdict |
|---|---|---|---|
| `easing-sidebar-normalized` (H.W10 S4 G5+G6) | `:1` | standard rung (no `text-admin-label`, ≥5px slider track); flatten onto ONE Card | **EARNED** |
| `easing-sidebar-minimal` (H.W12 J S7) | `:1` | STRIP `<LabeledInput label="value">`, `<h2>`, `CopyButton` (S1-S4 static + B1 browser); ONE container (B4); duration FULL-WIDTH (B3); canvas GREW (B5); still fits (B6) | **EARNED (strip, grow, full-width clauses)** |

**The R2 nested clause:** `easing-sidebar-normalized` (line 334–344) asserts
"exactly 1 glass-ui Card (`.rounded-card`)". `easing-sidebar-minimal` B4 (lines
436–443) asserts "exactly 1 glass-ui Card-root (no nested double wrapper)" on
the SAME sidebar. B4 cannot red while `normalized`'s flatten clause is green —
1 Card ⊇ 1 Card. B4 is R2-nested.

**The R4 double-boot:** the two gates each cold-launch chromium and each serve
`dist/gh-pages/` independently. The `minimal` static clauses (S1–S4: source
greps of `EasingSidebar.vue`) run without a browser and cost nothing; the browser
clauses B2–B6 all need exactly ONE panel visit. The B4 nested clause aside, the
browser clauses of `minimal` are genuinely distinct from `normalized`'s (strip vs
rung vs grow vs full-width vs fits). So the issue is not that `minimal` is
entirely redundant — its oracle is real — but that it and `normalized` pay two
independent chromium cold-boots for one sidebar.

**Net redundancy:** 1 R2-nested browser clause (B4) + 1 extra chromium cold-boot
(R4). Merging `minimal` into `normalized` as one compound sidebar gate saves one
self-chromium boot and removes the nested clause.

### 2.3 The card trio: `scene-card-rounded` / `stage-glass-card` / `card-rounded-primitive`

This is the **most concrete redundancy** in the apparatus.

Scope breakdown:

| Gate | Surface checked | Browser clause | Verdict |
|---|---|---|---|
| `scene-card-rounded` (H.W10 G2) | `.controls-layout` subtree, easing+spring scenes only — SIDEBAR `cartoon-surface` elements | every `.cartoon-surface` element in the subtree has non-zero computed border-radius | **EARNED — scope: sidebar cartoon surfaces** |
| `stage-glass-card` (H.W11 I5) | `.stage-cell > [data-surface="glass"]`, all 4 scenes — STAGE glass plate | clause 2: non-zero computed border-radius; clause 1: data-surface=glass, data-tier=resting; clause 3: backdrop-filter != none; clause 4: no SQUARE bare-cartoon div beside card | **EARNED — scope: stage glass register, 4 assertions** |
| `card-rounded-primitive` (H.W11 I4) | `.stage-cell > [data-surface="glass"]`, all 4 scenes — **SAME** stage glass plate | clause 2 (browser): non-zero computed border-radius on **IDENTICAL** selector | **clause 2 = R1 DUPLICATE of stage-glass-card** |

**The R1 duplicate is exact.** `proof-card-rounded-primitive.mjs:203–213`
queries `document.querySelector(".stage-cell")` → `.querySelector('[data-
surface="glass"]')` → `getComputedStyle(card)` → `Math.max(…radii) > 0`.
`proof-stage-glass-card.mjs:194–213` queries the **identical** `.stage-cell >
[data-surface="glass"]` element and asserts `card.maxRadius > 0` at line 244.
Both gates sweep the same 4 scenes (`easing/spring/sequence/motion-path`), both
cold-boot via `withPage` from `demo-driver.mjs`, both appear consecutively in
the hygiene chain at positions [53] (`scene-card-rounded`), [54]
(`stage-glass-card`), [55] (`card-rounded-primitive`).

**What `card-rounded-primitive` adds beyond the duplicate:**

- **Clause 1 (static, cheap):** scans `demo/easing/EasingTarget.vue`,
  `demo/spring/SpringTarget.vue`, `demo/spring/StartingStyleTarget.vue`,
  `demo/sequence/SequenceTarget.vue`, `demo/motion-path/MotionPathTarget.vue`
  for bare-class `cartoon-surface` in live markup (strips comments first). This
  is a SOURCE-SHAPE fact — no browser required — and it catches two more files
  (sequence + motion-path) than `scene-card-rounded`'s static clause 2 (which
  only checks the easing/spring 3). It is CHEAP. It is NOT a browser oracle.

- **Clause 3 (consume-leg witness, no browser):** greps
  `node_modules/@mkbabb/glass-ui/dist/styles/cards.css` to see whether the
  published `@utility cartoon-surface` block now declares a `border-radius`.
  When the handoff lands this clause FLIPS RED to signal the kf consume-edge is
  due. This is a sub-second file-read, not a browser assertion. It is
  **genuinely distinct** — no other gate owns this glass-ui primitive-publish
  signal.

**Net redundancy:** clause 2 of `card-rounded-primitive` is an exact R1 browser
duplicate of `stage-glass-card` clause 2. One 4-scene chromium sweep is wasted
per `proof:all` pass. Clauses 1 and 3 are NOT superfluous — they are cheap,
distinct, and easily preserved without a browser.

**Correct disposition (not the audit-C framing of "demote clause 1 to
source-shape"):** clause 1 IS already a source-shape check — it never spawns a
browser. The demote is a no-op. The actual action is:

1. Move clause 1 (static source grep, no browser) out of `card-rounded-primitive`
   into either (a) a standalone cheap grep gate or (b) a `source-shape/` test.
2. Move clause 3 (consume-leg grep) into the same cheap gate.
3. Delete `card-rounded-primitive`'s browser half (the `computedHalf` function
   with its 4-scene chromium sweep). The `stage-glass-card` sweep already covers
   this measurement exactly.
4. The resulting gate has ZERO browser cost.

OR: fold clauses 1+3 as additional static checks inside `stage-glass-card`
itself (the gate that now owns the full stage-card register); the browser sweep
happens once, the static checks ride along.

### 2.4 The border-radius theme: how many gates really assert it?

The L audit-C document claims "5 gates assert non-zero border-radius"
(`grep -l border-radius`). **This count is MISLEADING.** Verified:

- `proof-styling-idioms.mjs`: contains `"// border-radius"` as a COMMENT before
  the string `"rounded"` in an idiom-allowlist array. It performs ZERO
  `getComputedStyle` calls (verified: `grep -c "getComputedStyle\|chromium\|
  playwright" proof-styling-idioms.mjs` → **0**). This is a pure source-shape
  grep gate. It does NOT assert border-radius at runtime.

**The actual count of runtime border-radius asserters is 4, not 5:**
`appearance-suffusion` (amiga `.amiga-canvas` == `--radius-card`, line 413–439),
`card-rounded-primitive` (`.stage-cell [data-surface="glass"]`, clause 2),
`scene-card-rounded` (`.controls-layout` `.cartoon-surface` elements),
`stage-glass-card` (`.stage-cell [data-surface="glass"]`, clause 2 — `maxRadius > 0`).

**The "theme spread" finding from audit-C is still sound** — the non-zero-radius
invariant is asserted across 4 browser gates with no single named owner for the
full-surface sweep — but the count correction matters: it is 4 gates, not 5.

### 2.5 The hero trio: `hero-rung` / `hero-balance` / `hero-cls`

All three drive the same `<h1>` at `/#/` but on **orthogonal oracles**:

| Gate | Oracle | Can this red while the others are green? |
|---|---|---|
| `hero-rung` | computed `font-size ≥ 140px` + class `text-display-mega` + no raw rung | YES — a wrong font token that still doesn't cause grid stacking |
| `hero-balance` | no `display:grid` 2-row stacking; title ≤2 lines; dots inline-adjacent | YES — a layout fold that meets the font floor |
| `hero-cls` | hero-attributed steady-state CLS ≈ 0 (PerformanceObserver, two-window) | YES — a layout-shift over a font that is correct size and unstacked |

**Verdict: KEEP ALL THREE. No redundancy.** These are orthogonal failure modes on
one element. They share ONE cold-boot of `/#/` instead of three — an R4
amortization win, but no clause is carry.

### 2.6 The umbrella vs per-scene appearance gates: `appearance-suffusion` / `scene-parity` / `cohesion`

- `appearance-suffusion` (J.W7a): inherits `live-session` BY REFERENCE (its
  clause (h) explicitly defers to `proof:live-session` rather than re-running
  it). Its clause (f) asserts `.amiga-canvas` border-radius = `--radius-card`
  on a DIFFERENT element from the card trio's scope — this is PARTITION, not
  duplicate (different element, different scene).
- `scene-parity` (H.W5): asserts scene membership + `springLinearStops`
  single-fold + per-mode interactivity — ORTHOGONAL to appearance. EARNED.
- `cohesion`: `vitest run test/boundary-cohesion.test.ts` (pure vitest, sub-
  second) — import-graph, not appearance. EARNED.

**Verdict: KEEP ALL. These are partitioned.** No redundancy between them and
the card/bezier clusters.

---

## 3. The minimal covering set — the honest count

Starting from the verified leaf count of **146 gates** (150 total − 4 aggregators):

| Invariant family | Gates | Distinct invariants | Collapsible |
|---|---:|---:|---|
| Engine correctness (replay-equality, blend, motion-path, drawsvg, interpolate-anything, compile-replay, ingest-replay, …) | ~34 | ~34 | **No — each a distinct engine property** |
| Boundary / hygiene / single-writer / decomposition / idioms / no-dup-utility / no-brittle-selector | ~24 | ~24 | No (mostly sub-second source-shape) |
| Meta-gates (gate-is-runtime, chronic-closure, ci-coverage, settle-is-predicate, manifest-sourced) | ~5 | ~5 | **No — enforce the precept; keep** |
| Per-surface appearance/layout locks (the H band) | ~54 | **~40–41** | **~13–14 collapsible** (the §2 overlaps) |
| Interaction/error-budget (live-session, drag-gesture, mobile, suspend-resume, single-toggle, scene-parity, …) | ~16 | ~16 | No |
| Device-honesty observe-only (perf-frame-budget, visual-lock, lighthouse, drawer-spring, bench-taxonomy, epf1, …) | ~8 | ~8 | **No — principled posture axis** |
| Publish/consume/agent surface (published-surface, peer-satisfied, agent-validate, repin-witness, workaround-deletion, …) | ~10 | ~10 | No |

**Distinct invariants: ~118–121. Collapsible: ~13–14 gates (9–10%).**

This is slightly more conservative than audit-C's "~24–28 collapsible" because
the R4 amortization (the hero trio, the bezier trio, the easing-sidebar pair
sharing cold-boots) is counted separately from actual clause-duplicate removal.
The firmly-evidenced R1/R2 clause duplicates are 3, not ~13:

1. `bezier-grown` clause 3 (R1 — re-measures `bezier-no-scroll` fit).
2. `easing-sidebar-minimal` B4 (R2 — nested in `normalized`'s 1-Card clause).
3. `card-rounded-primitive` clause 2 (R1 — identical selector+measurement as
   `stage-glass-card` clause 2).

The further ~10–11 "collapsible" entries from audit-C are R4 amortization
opportunities (gates that could share a cold-boot) rather than clause-duplicate
removals. These are REAL savings but require a shared-browser architecture (the
lane-13/lane-14 apparatus-SOTA work), not standalone prunes. They should not be
counted as superfluity prunes in isolation.

**Target after the M prune:** ~143 leaf gates protecting ~118–121 distinct
invariants. Not ~Y=118 (the minimal-covering-set number), because the R4 wins
require the shared-browser migration to realize; the clause-duplicate wins are
M-wave-local.

---

## 4. The cost of the redundancy — O(N²) multiplier

Lane A established: browser gates span 1.98s–80.85s; 51% of gates are browser;
92–96% of `proof:all` wall-clock is browser. The iterate-to-green loop is
O(N²): serial `&&` aborts on the first red, re-runs every prior green per pass.

Tying the §2 redundancy to cost:

| Redundant unit | Class | Per-pass cost | Multiplier |
|---|---|---:|---|
| `card-rounded-primitive` clause 2 browser sweep (4 scenes, ~11s class) | browser, 4-scene | **~11s** | × O(N²) re-run count |
| `easing-sidebar-minimal` self-chromium cold-boot (R4 extra boot) | browser, 1-scene | **~2–3s** | × O(N²) |
| `bezier-grown` clause 3 (panel re-visit, ~1–2s) | browser clause | **~1–2s** | × O(N²) |

**Conservative per-pass cost of firmly-named redundancy: ~14–16s.** Over 5–6
reds in an iterate-to-green session (the lane-A O(N²) model), the redundancy
alone costs **~70–96s per session**. The real cost is in the multiplier: the
three redundant gates appear at consecutive positions [53]–[60] in the hygiene
chain, so a red anywhere in positions ≥60 re-pays ALL of them on every re-run.

This is real but not dominant. The dominant cost is the O(N²) runner
architecture and the cold-boot-per-gate structure (lane-14 subject). The §2
prune is the SAFEST lever (provable zero coverage loss); the runner migration
(lane-13/14) is the decisive win.

---

## 5. The M prune — design

### 5.1 What collapses and what it is subsumed by

| Pruned gate / clause | Redundancy type | Subsumed by | Coverage loss? |
|---|---|---|---|
| `card-rounded-primitive` clause 2 (browser, 4-scene `.stage-cell > [data-surface="glass"]` non-zero-radius sweep) | R1 exact duplicate | `proof:stage-glass-card` clause 2 (identical selector, identical measurement, same 4 scenes) | **None** — `stage-glass-card` already asserts `maxRadius > 0` at `proof-stage-glass-card.mjs:244` |
| `easing-sidebar-minimal` B4 (exactly 1 Card-root in the sidebar) | R2 nested | `proof:easing-sidebar-normalized` (b) (`proof-easing-sidebar-normalized.mjs:334–344` — exactly 1 Card) | **None** — `normalized` already asserts 1 Card and does so on the same sidebar surface |
| `bezier-grown` clause 3 (`scrollHeight ≤ clientHeight + TOL` on the grown panel) | R1 exact clause | `proof:bezier-no-scroll` clause 1 (identical scroll-fit assertion, `proof-bezier-no-scroll.mjs:242–265`) | **None** — `bezier-no-scroll` already asserts the fit; the grow's "still fits" is a re-measurement, not a new oracle |
| `easing-sidebar-minimal` extra chromium cold-boot (R4) | R4 double cold-boot | Consolidation into a merged sidebar gate (one self-launch or one `withPage`) | **None** — distinct B clauses (strip/grow/full-width) survive verbatim; only the extra boot dies |

**What is NOT pruned (the earned defense):**

- `card-rounded-primitive` clause 1 (static source grep, 5 Target.vue files) —
  CHEAP, not a browser oracle, distinct from `stage-glass-card`'s rendered check.
  Keep or fold into a source-shape test; either way it has no browser cost.
- `card-rounded-primitive` clause 3 (consume-leg witness, greps `cards.css`) —
  the only gate that signals when glass-ui ships `cartoon-surface { border-radius }`;
  sub-second, no browser. Keep.
- `hero-rung` / `hero-balance` / `hero-cls` — three orthogonal oracles on one
  `<h1>`, each biting for distinct reasons. KEEP.
- `bezier-no-scroll`, `bezier-single-card`, `bezier-grown` (clauses 1+2) — three
  distinct invariants for three successive bugs. KEEP.
- `scene-card-rounded` — scopes to the SIDEBAR subtree (`.controls-layout`
  `.cartoon-surface`), NOT the stage cell. `stage-glass-card` does not cover
  this. KEEP.
- `appearance-suffusion`, `scene-parity`, `cohesion` — partitioned, not
  overlapping. KEEP.

### 5.2 Quantified: ~146 → ~143 gates (the firm number)

Firm prunes (R1/R2 clause removals):
1. Remove the browser half of `card-rounded-primitive` (the `computedHalf`
   function) — demote to a source-shape-only gate. **−1 browser gate**.
2. Remove `easing-sidebar-minimal` B4 clause. **−1 browser clause** (gate stays).
3. Remove `bezier-grown` clause 3. **−1 browser clause** (gate stays).

**Net gate delta: −1 gate (card-rounded-primitive loses its browser half,
becoming a source-shape stub)**. The gate still exists and still passes for its
clause 1+3 oracle; it simply no longer spawns a browser. The gate count goes
from ~146 to ~145 (browser-tier gates from ~69 to ~68). Two gates lose one
browser clause each.

The audit-C "~24–28 collapsible" figure was counting R4 amortization targets
(shared-boot opportunities) alongside R1/R2 duplicates. R4 wins require the
shared-browser runner migration (lane 13/14 work); they are not standalone
prune-safe. The honest firm number for standalone M-prune is **3 clause
removals, 1 gate browser-retired**.

### 5.3 The NO-coverage-loss invariant — named per pruned clause

Every pruned clause has its exact subsumption proved:

| Pruned clause | The gate that catches the same regression | Can it red independently? |
|---|---|---|
| `card-rounded-primitive:203–213` (`maxRadius > 0`, 4-scene browser) | `stage-glass-card:194–213` (same selector, same 4 scenes, same `maxRadius > 0` check) | No — both query `.stage-cell [data-surface="glass"]` and measure `Math.max(...radii)` |
| `easing-sidebar-minimal:436–443` (B4: cardCount === 1) | `easing-sidebar-normalized:334–344` ((b): cardCount === 1) | No — both assert exactly 1 `.rounded-card` in the easing sidebar |
| `bezier-grown:258–277` (scrollHeight ≤ clientHeight + TOL, overflow-y) | `bezier-no-scroll:242–265` (identical assertion on identical `.panel-row--detail.panel-row--active > .panel-content` selector) | No — same selector, same tolerance, same overflow-y check |

---

## 6. M-wave proposals

### M.WA — the firm prune (standalone, zero coverage loss)

**Three surgical clause removals + one gate browser-retirement.** Safe to do
in a single commit with a `proof:all` re-run to confirm no regression:

1. **`card-rounded-primitive`:** delete the `computedHalf` function and its
   `await computedHalf()` call. The gate keeps clauses 1 (static source grep)
   and 3 (consume-leg `cards.css` witness). Add a comment naming `stage-glass-
   card` as the browser owner of the radius assertion. The gate's `package.json`
   entry stays; it runs as a source-shape + consume-leg gate in ~0.1s instead
   of a ~11s browser sweep.
2. **`easing-sidebar-minimal`:** delete the B4 clause block (lines 435–443).
   Update the final pass-message to omit B4. `normalized`'s (b) clause is the
   surviving owner.
3. **`bezier-grown`:** delete clause 3 from `browserHalf` (lines 257–278 in the
   `proof` call). Update the pass-message. `bezier-no-scroll` is the surviving
   owner.

**Expected saving (per `proof:all` pass):** ~13–14s of browser wall-clock,
recurring on every O(N²) re-run. Conservative: ~65–84s per 5-session iterate.

**Gate count after:** 146 → 145 leaf gates in the apparatus; 69 → 68 browser
gates.

### M.WB — the surface-consolidation (composes with lane-13/14 shared-browser migration)

Not standalone-safe (requires the shared-browser runner). Once the @vitest/browser
migration lands (lane-13 Phase 3), organize the H-band gates by surface:

- **Bezier panel:** one `bezier.browser.test.ts` file with all three invariants
  (fit + single-card + grown) as `expect` clauses, ONE shared browser visit.
  Saves 2 independent cold-boots while preserving all three oracles.
- **Easing sidebar:** one `easing-sidebar.browser.test.ts` with normalized +
  minimal clauses, ONE shared browser visit. Saves the extra self-chromium boot
  and the B4 nested clause (already removed in M.WA).
- **Hero:** one `hero.browser.test.ts` with rung + balance + CLS as clauses,
  ONE shared browser visit. Saves 2 cold-boots.
- **Stage card:** `stage-glass-card` already sweeps all 4 scenes in one visit.
  Preserve verbatim. `card-rounded-primitive`'s source clauses fold as
  `beforeAll` greps or dedicated source tests.

This is the R4 amortization the lane-A/lane-C audit recommends. It is NOT a
coverage cut — every distinct oracle survives as an `expect` clause. The cold-
boot tax disappears.

---

## 7. Precept findings

### 7.1 The `gate-is-runtime` precept — RESPECTED by the M prune

The precept (`proof-gate-is-runtime.mjs:6–20`): a correctness oracle must
actuate the running product through the real surface with a zero error budget.
**The M prune does NOT violate this.** It removes only measurements that a
sibling gate already makes on the same element with the same selector. The
appearance estate is not reduced; it is de-duplicated.

### 7.2 The device-honesty posture — RESPECTED

The 9 `declarePosture("observe-only")` declarations and the `gate-taxonomy.md`
manifest are untouched by the M prune. No observe-only gate is in the pruned set.

### 7.3 The no-silent-drop oracle discipline — RESPECTED

The meta-gates (`gate-is-runtime`, `chronic-closure`, `ci-coverage`,
`settle-is-predicate`, `manifest-sourced`) are not touched. The only change is
that `card-rounded-primitive` loses its browser half — it still runs and still
enforces its source-shape + consume-leg oracles.

### 7.4 Precept violations in L-as-built — NONE FOUND in the superfluity band

The H-born appearance band is **not a precept violation**. Born-in-one-tranche is
not the same as born-wrong. The per-surface clause overlap (§2) is
implementation-level redundancy, not a workaround or a legacy bypass. The prune
is a GESTALT cleanup, not a quick-fix: removing a duplicate browser measurement
is idiomatic, not expedient.

The only mild tension with KISS (Keep It Simple, Stupid) is that three separate
gates assert the easing sidebar's Card count (normalized, minimal-B4, and
implicitly the source-strip clause). After M.WA, the count drops to one. That
is KISS applied correctly.

---

## 8. Deferred folds for M

The following items surface for FOLD into M (they are cross-lane; the superfluity
lane owns the redundancy-removal rationale but the broader apparatus migration is
lane-13/14's wave):

| Item | Owner lane | Tripwire / condition |
|---|---|---|
| R4 surface consolidation (bezier/sidebar/hero into shared-browser test files) | lane 13 / lane 14 | @vitest/browser Phase 3 migration (the shared-browser runner must exist first) |
| "all kf surfaces rounded" sweep (a single gate that sweeps all scenes for non-zero border-radius, retiring the theme spread) | lane 16 (this lane) → folds into lane 13 Phase 3 | composes with the R4 consolidation; natural target for a `rounded-surfaces.browser.test.ts` |
| `easing-sidebar-minimal` → `easing-sidebar-normalized` merge (structural) | lane 16 | M.WA (the B4 removal) is a prerequisite; the full merge is M.WB territory |

---

## 9. Cross-repo asks

**None** from the superfluity prune itself. All three removed clauses are kf-
internal gate-script changes. The consume-leg witness in `card-rounded-primitive`
clause 3 tracks the glass-ui `cards.css` publish — when glass-ui BB ships
`@utility cartoon-surface { border-radius }` the witness flips RED, but that is
the INTENDED behavior of the existing (preserved) clause, not a new ask.

No value.js, parse-that, or glass-ui changes are needed to execute the M prune.

---

## 10. Evidence index (reproducible, read-only)

| Claim | Source |
|---|---|
| Gate count (150 total, 4 aggregators, 146 leaf) | `package.json` Python probe above |
| Hygiene chain 124 `&&`, 0 `;`, 0 `||` | `scripts['proof:hygiene'].count('&&')` |
| Consecutive cluster: `scene-card-rounded → stage-glass-card → card-rounded-primitive → … → bezier-no-scroll → bezier-single-card → bezier-grown` | `proof:hygiene` value, positions [53]–[60] |
| `bezier-grown` clause 3 re-measures `bezier-no-scroll` fit | `proof-bezier-grown.mjs:34,36–37,39,52` |
| `card-rounded-primitive` clause 2 identical selector | `proof-card-rounded-primitive.mjs:203–213` vs `proof-stage-glass-card.mjs:194–213` |
| `easing-sidebar-minimal` B4 nested in `normalized` (b) | `proof-easing-sidebar-minimal.mjs:436–443` vs `proof-easing-sidebar-normalized.mjs:334–344` |
| Both easing-sidebar gates self-launch chromium | `grep "chromium.launch"` → `proof-easing-sidebar-normalized.mjs:278`, `proof-easing-sidebar-minimal.mjs:381` |
| Neither easing-sidebar gate imports demo-driver | `grep -c "demo-driver"` → 0 in both files |
| `styling-idioms` does NOT assert border-radius at runtime | `grep -c "getComputedStyle\|chromium\|playwright" proof-styling-idioms.mjs` → **0**; the word "border-radius" appears only in a source comment at line 256 |
| Runtime border-radius asserters are 4, not 5 | `proof-appearance-suffusion.mjs:413–439`, `proof-card-rounded-primitive.mjs:207–213`, `proof-scene-card-rounded.mjs:117–137`, `proof-stage-glass-card.mjs:194–245` |
| `scene-card-rounded` checks SIDEBAR (`.controls-layout`), NOT stage | `proof-scene-card-rounded.mjs:24,101,117` |
| `stage-glass-card` sweeps 4 scenes for non-zero radius AND backdrop AND no-cartoon | `proof-stage-glass-card.mjs:132–138,194–261` |
| `card-rounded-primitive` clause 1 scans 5 Target.vue files (source grep) | `proof-card-rounded-primitive.mjs:106–112` |
| `card-rounded-primitive` clause 3 greps `cards.css` (no browser) | `proof-card-rounded-primitive.mjs:241–280` |
| Timing class (browser 1.98–80.85s, 92–96% of wall-clock, O(N²) loop) | lane A `gate-apparatus-A-taxonomy.md §2–§3` |
