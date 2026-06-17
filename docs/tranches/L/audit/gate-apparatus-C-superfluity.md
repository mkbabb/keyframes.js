# Gate-apparatus audit C — superfluity + the minimal covering set

**Status:** ANALYSIS ONLY. No gate changed, no code written, `proof:all` NOT
re-run (its ~15–31-min single-pass cost is precisely the subject). Every claim
below cites `file:line`, a gate count derived from `package.json`, or a timing
lifted from lane A (`gate-apparatus-A-taxonomy.md`) / the existing run logs
(`/tmp/proof-all-L-final*.log`, `/tmp/hygiene-run4.log`). Builds on lane A — A
measured the cost; C asks **how much of the gate SURFACE earns its keep.**

The headline, stated plainly up front:

> **The principle is sound; a band of the implementation is carry.** The
> `gate-is-runtime` precept and the device-honesty taxonomy are correct and
> should stay. But ~146 leaf gates contain a measurable redundancy SEAM: a
> cluster of **per-scene UI-defect locks born in ONE tranche (H — 54 of 128
> scripts, 42%)**, several of which RE-ASSERT a neighbour's exact clause on the
> exact selector. The **~13 genuinely-redundant browser clauses** I can name
> with `file:line` evidence cost **~2–3 minutes of every single `proof:all`
> pass** — and under lane A's O(N²) serial-`&&` iterate-to-green loop, that
> recurs on every red, so the superfluity is a **multiplier on the 3 hours, not
> a one-time tax.** The honest number: of ~146 leaf gates, **~118–122 distinct
> invariants** survive — i.e. **~24–28 gates (~17–19%) are collapsible**, almost
> all of them in the H-born appearance band. **The count is not the headline
> cost (lane A proved the browser SWEEP is) — but the redundant gates are
> redundant browser gates, so the two costs compound.**

---

## 0. Method — what "superfluous" means here (the fairness contract)

A gate is **NOT superfluous** if it catches a distinct regression, *even when
adjacent to others*. Two gates on the same `.vue` file are still both earned if
they bite on different failure modes (e.g. `hero-rung` = font-size floor vs
`hero-cls` = layout-shift budget — same `<h1>`, orthogonal oracles).

A gate IS a **superfluity candidate** when one of:

- **(R1) CLAUSE-DUPLICATE** — it re-asserts another gate's exact clause on the
  exact selector (the second assertion cannot red while the first is green).
- **(R2) STRICTLY-NESTED** — its property is a logical consequence of a broader
  gate's property (the narrow gate cannot red unless the broad one already does).
- **(R3) HISTORICAL ONE-OFF SUBSUMED** — born for a single past bug (a tranche
  letter + S-clause header) whose invariant is now structurally guaranteed
  elsewhere, so the dedicated gate is carry.
- **(R4) SELF-CHROMIUM DUPLICATE COLD-BOOT** — two gates on the same surface
  each cold-boot their own browser to assert facts that one boot could co-check.

Each candidate below is tagged R1–R4 with `file:line`.

---

## 1. REDUNDANCY MAP — the ~146 leaf gates grouped by distinct invariant

The four named candidate clusters, audited one at a time. Verdict per cluster:
**SUBSUME** (collapsible, with the redundant clauses named), **PARTITION**
(genuinely distinct — keep all), or **MIXED**.

### 1a. The bezier-* trio — `bezier-no-scroll` / `bezier-single-card` / `bezier-grown` → **MIXED (1 of 3 clauses is carry)**

All three drive the **same** surface (the cubic-bézier detail panel, opened by a
real click on `.easing-edit-btn`), all three are browser gates that cold-boot
chromium + nav to `#/easing` and settle (`6 settle/nav calls, 3 browser-launch
refs` each — measured). They track three SUCCESSIVE bugs across H.W9 → H.W11:

| Gate | Born | Distinct invariant | Verdict |
|---|---|---|---|
| `bezier-no-scroll` | H.W9 F2 (S4) | panel fits without vertical scroll; back-control baked header-RIGHT | **EARNED** |
| `bezier-single-card` | H.W11 I6 (S5) | exactly ONE Card depth between canvas and controls-pane (no card-in-card) | **EARNED** |
| `bezier-grown` | H.W11 I7 (S6) | canvas `block-size` > the W9 220px ceiling; NO "editing:" subtitle | **EARNED (clauses 1+2)** |

The first two clauses of `bezier-grown` are distinct (the canvas GREW; the
subtitle is GONE). But **`bezier-grown` clause 3 is a CLAUSE-DUPLICATE (R1)** of
`bezier-no-scroll`. Its own header admits it:

> `proof-bezier-grown.mjs:34` — "3. STILL FITS (the W9 invariant holds —
> **composes with proof:bezier-no-scroll**)."
> `proof-bezier-grown.mjs:39` — "**Reuses the W9 proof:bezier-no-scroll
> measurement plumbing.**"
> `proof-bezier-grown.mjs:52` — "**Mirrors scripts/proof-bezier-no-scroll.mjs.**"

It re-runs the `scrollHeight ≤ clientHeight + TOL` + `overflow-y !== 'scroll'`
assertion (`proof-bezier-grown.mjs:36–37`) that `bezier-no-scroll` already owns.
The intent is legitimate — "the grow must not re-introduce scroll" — but the
clause is a guard inside the WRONG gate: it is a property of `bezier-no-scroll`
that `bezier-grown` must not VIOLATE, not a separate fact to re-measure on a
second cold-boot. **Verdict: the trio's distinct invariants partition cleanly,
but `bezier-grown` clause 3 is a re-assertion — fold it (the canvas-size check
in `bezier-grown` and the fit check in `bezier-no-scroll` could share ONE panel
visit).** Net: 3 gates / 3 surfaces, **but ~1 duplicated browser clause.**

### 1b. The easing-sidebar-* pair — `normalized` / `minimal` → **MIXED (1 nested clause + an R4 double cold-boot)**

Both drive the **same** surface (the easing sidebar Card). Both **self-launch
chromium** (NOT demo-driver: `8 launch-related refs each, 0 demo-driver imports`
— measured) — so this pair pays **two** independent chromium cold-boots for one
sidebar.

| Gate | Born | Distinct invariant | Verdict |
|---|---|---|---|
| `easing-sidebar-normalized` | H.W10 S4 (G5+G6) | standard rung (no `text-admin-label`, ≥5px slider track); flatten to ONE Card | **EARNED** |
| `easing-sidebar-minimal` | H.W12 J (S7) | STRIP value-input/h2/CopyButton (static); FULL-WIDTH duration + TALLER canvas (browser); ONE container | **EARNED (the strip + grow clauses)** |

But there is a **STRICTLY-NESTED (R2)** overlap: `normalized` asserts "flatten
onto ONE Card" (`proof-easing-sidebar-normalized.mjs:343` — "inner sub-Card
chain… flatten onto ONE Card"), and `minimal` **B4** re-asserts "exactly 1
glass-ui Card-root (no nested double wrapper)" on the SAME sidebar
(`proof-easing-sidebar-minimal.mjs:437`, `:440`). The minimal B4 clause cannot
red while `normalized`'s flatten clause is green (1 Card ⊇ 1 Card). **B4 is a
nested re-assertion.** AND because the two gates self-launch separately, this is
also **R4**: two cold chromium boots for one sidebar where the `minimal` strip
(largely STATIC source-grep per its own header, `:28`) + grow + the flatten
could be ONE gate with ONE boot. **Verdict: SUBSUME `minimal` into `normalized`
as the sidebar's single gate (the static strip clauses cost nothing; the grow +
flatten clauses join the existing sidebar visit) — removes one self-chromium
cold-boot and one nested clause.** Net: 2 gates → **1**, −1 chromium boot.

### 1c. The card trio — `scene-card-rounded` / `stage-glass-card` / `card-rounded-primitive` → **SUBSUME (a genuine R1 duplicate)**

This is the **clearest redundancy in the apparatus.** Three browser gates, five
gates total assert "non-zero computed border-radius" (`grep -l border-radius`:
`appearance-suffusion`, `card-rounded-primitive`, `scene-card-rounded`,
`stage-glass-card`, `styling-idioms`). Within the trio:

| Gate | Selector / scope | Assertion | Verdict |
|---|---|---|---|
| `scene-card-rounded` (H.W10 G2) | `.controls-layout` subtree, easing+spring | every `cartoon-surface` el → non-zero border-radius | **EARNED (distinct scope: the SIDEBAR cartoon surfaces)** |
| `stage-glass-card` (H.W11 I5) | `.stage-cell > [data-surface="glass"]`, 4 scenes | data-surface=glass+resting, non-zero radius, backdrop-filter≠none | **EARNED (distinct scope: the STAGE glass plate)** |
| `card-rounded-primitive` (H.W11 I4) | **same `.stage-cell > [data-surface="glass"]`**, 4 scenes | clause-1 static (no bare cartoon root) + clause-2 **non-zero radius** + clause-3 born-RED glass-ui handoff witness | **clause 2 = R1 DUPLICATE of stage-glass-card** |

The duplication is exact. `card-rounded-primitive.mjs:204–206` queries
`document.querySelector(".stage-cell")` → `.querySelector('[data-surface="glass"]')`
→ `getComputedStyle(card)` and asserts non-zero border-radius. `stage-glass-card`
queries the **identical** `.stage-cell > [data-surface="glass"]` selector
(`proof-stage-glass-card.mjs:115–117`) and asserts the **identical** non-zero
border-radius (`:39`). The two gates cold-boot chromium SEPARATELY and sweep the
SAME 4 scenes to make the SAME measurement on the SAME element.

What `card-rounded-primitive` adds beyond the duplicate is real but small:
- **clause 1** (static, source-grep) — no bare-class `cartoon-surface` survives
  as a stage `*Target.vue` ROOT. This is a SOURCE-SHAPE fact (cheap, no browser)
  and could live in a hygiene grep, not a chromium sweep.
- **clause 3** — a born-RED glass-ui HANDOFF WITNESS (`:25–28`): green while the
  glass-ui primitive default is PENDING, flips RED when glass-ui ships
  `cartoon-surface { border-radius }`. This is a genuine, distinct consume-leg
  signal — **NOT superfluous**, but it does not need a browser at all (it greps
  `node_modules/@mkbabb/glass-ui/dist/styles/cards.css`).

**Verdict: SUBSUME `card-rounded-primitive`'s computed border-radius clause
(clause 2) into `stage-glass-card` — they are the same measurement. Demote its
clause 1 to source-shape and keep its clause 3 as a standalone cheap consume-leg
grep (no browser).** Net: the trio's THREE chromium sweeps collapse to **TWO**
(scene-card-rounded for sidebars, stage-glass-card for stages); the
primitive-witness becomes a sub-second source grep. **−1 browser cold-boot sweep
of 4 scenes** (the single largest concrete browser saving in this map).

### 1d. The hero-* trio — `hero-rung` / `hero-balance` / `hero-cls` → **PARTITION (keep all — earned)**

All three drive the **same** `<h1>` at `/`, but on **orthogonal oracles**:

| Gate | Born | Oracle | Distinct? |
|---|---|---|---|
| `hero-rung` | H.W4 S3 | computed `font-size ≥ 140px` @1440 + class `text-display-mega` + no raw rung | **YES — typography floor** |
| `hero-balance` | H.W4 S3 | NO `display:grid` 2-row stacking; title ≤2 lines; dots inline-adjacent | **YES — layout fold (the orphaned `...`)** |
| `hero-cls` | H.W4 S3 | hero-attributed steady-state CLS ≈ 0 (PerformanceObserver, two-window) | **YES — layout-shift budget** |

None can red for another's reason: a font that meets the 140px floor
(`hero-rung`) can still stack the ellipsis on its own grid row (`hero-balance`)
and still pass CLS (`hero-cls`). These are three FACES of one design intent but
three FALSIFIABLE failure modes. **Verdict: KEEP ALL THREE. Not superfluous —
this is the fair-case control: adjacency ≠ redundancy.** (They could share ONE
cold-boot of `/` instead of three — an R4-style amortization win — but no clause
is carry.)

### 1e. The umbrella vs per-scene appearance gates — `appearance-suffusion` / `scene-parity` / `cohesion` → **PARTITION, with a caution**

Lane C flags "the many per-scene appearance gates vs `appearance-suffusion` /
`scene-parity` / `cohesion`." Inspection shows these are **umbrella gates with a
deliberately NON-overlapping clause set** — the apparatus already practices
inheritance-by-reference rather than re-statement:

- `appearance-suffusion` (J.W7a) explicitly inherits `live-session` BY REFERENCE
  rather than re-running it: `proof-appearance-suffusion.mjs` clause (h) —
  "proof:live-session budget stays 0… is the SEPARATE regression gate
  proof:live-session itself runs (inherited BY REFERENCE, never re-stated here)."
  This is the RIGHT pattern.
- BUT `appearance-suffusion` clause (f) asserts `.amiga-canvas` computed
  `border-radius == --radius-card (16px), != 0` — which is the SAME *theme* as
  the card trio's non-zero-radius assertion, on a DIFFERENT scene/selector
  (amiga, not stage-cell). This is **PARTITION, not duplicate** (different
  element) — but it shows the "non-zero border-radius" invariant is now spread
  across FIVE gates with no single owner. A consolidation would name ONE
  "every kf-owned surface is rounded" gate that sweeps all scenes once.
- `scene-parity` (H.W5) asserts membership + the `springLinearStops` single-fold
  + per-mode interactivity — orthogonal to appearance. **EARNED.**
- `cohesion` is `vitest run test/boundary-cohesion.test.ts` (pure-vitest, sub-
  second) — a boundary/import-graph fact, not an appearance fact. **EARNED.**

**Verdict: PARTITION (keep), but the "non-zero border-radius" invariant is the
ONE theme that has metastasized across 5 gates (card trio + appearance-suffusion
(f) + styling-idioms) — a single "all kf surfaces rounded" sweep is the natural
consolidation, subsuming the trio's overlap AND clause (f).**

---

## 2. HISTORICAL ONE-OFFS — the H-born appearance band (R3)

**The single most important structural finding.** Tag every gate header by its
originating tranche (the `X.W##` / `Tranche X` in the doc-comment):

| Tranche | gate scripts born there | Share |
|---|---:|---:|
| **H** | **54** | **42%** |
| L | 15 | 12% |
| K | 14 | 11% |
| I | 12 | 9% |
| G | 11 | 9% |
| J | 7 | 5% |
| F | 5 | 4% |
| E | 4 | 3% |
| D | 4 | 3% |
| C / (none) | 2 | 2% |

(Derived: `for f in scripts/proof-*.mjs; head -8; grep -oE '\b[A-Z]\.W[0-9]'`.)

**42% of all gate scripts were born in a SINGLE tranche — H, the demo
design/layout overhaul.** This is the historical-one-off epicenter. The H-born
band is overwhelmingly **per-scene UI-defect locks**: `bezier-no-scroll`,
`bezier-single-card`, `bezier-grown`, `scene-card-rounded`, `stage-glass-card`,
`card-rounded-primitive`, `stage-not-clipped`, `stage-within-docks`,
`cartoon-shadow-unclipped`, `single-column-pack`, `label-subgrid`,
`timeline-rail-width`, `demo-shell-grid`, `dock-popover-opens`, `dock-zorder`,
`single-toggle`, `darkmode-row-toggle`, `idle-fade`, `easing-canvas-bounded`,
`easing-stage-is-ball`, `easing-sidebar-normalized`, `easing-sidebar-minimal`,
`mobile-single-page`, `hero-rung`, `hero-balance`, `hero-cls`, `pp-logo-svg`,
`typing-dots`, … — each a `<tranche>.W## S#` lock on a specific past pixel.

**10 gates carry the explicit single-past-bug signature** in their header
(`grep -lE "born-RED on (tranche-|pre-W|post-W|<hash>|HEAD)"` → 10): e.g.
`bezier-single-card` ("born-RED on tranche-h-impl HEAD"), `bezier-grown` ("born-
RED on tranche-h-impl HEAD"), `easing-sidebar-minimal` ("born-RED on the post-
W11 EasingSidebar.vue").

**Fairness — what makes an H-born gate STILL earned vs CARRY:**

- **STILL EARNED** when the regression it bites on is NOT structurally
  guaranteed elsewhere — a future edit could re-break it and ONLY this gate would
  catch it. Most H-born layout locks are in this class: nothing else asserts the
  bezier panel fits, or that the hero `<h1>` is `text-display-mega`. The
  `gate-is-runtime` precept's whole point is that these appearance facts have no
  source-shape proxy. **These are not superfluous just because they are
  numerous or old.**
- **CARRY (R3 candidate)** when the invariant migrated into a PRIMITIVE that now
  guarantees it by construction. The card trio is the live example:
  `card-rounded-primitive`'s own header (`:18–24`) says the demo half "lands NOW,
  born-GREEN — this lane / I5's swap closes it FOR FREE" because the surface
  swapped to the glass-ui `<Card>` which "carries `rounded-card` by
  construction." Once every stage roots on the Card primitive, the per-scene
  "is it rounded?" sweep is asserting a property the primitive can no longer
  violate without `stage-glass-card`'s `data-surface=glass` clause ALSO reding.
  **That is the definition of subsumed carry.**

**Verdict: the H band is mostly earned (it is the appearance estate the precept
exists to protect), but it harbors the apparatus's redundancy — because so many
H gates lock the SAME few surfaces (the bezier panel, the stage card, the easing
sidebar, the hero) across successive sub-bugs, the per-surface clause overlap
(§1) concentrates here. The consolidation target is NOT "delete H gates" — it is
"one gate per surface, all that surface's invariants as clauses, one cold-boot."**

---

## 3. THE MINIMAL COVERING SET

**Estimate of distinct invariants.** Of ~146 leaf gates, partition by what each
PROTECTS (not what it is named):

| Invariant family | Gates | Distinct invariants | Collapsible? |
|---|---:|---:|---|
| Engine correctness (zero-alloc, replay-equality, blend, motion-path, drawsvg, sync-step, compile-determinism, interp…) | ~34 | ~34 | **No — each a distinct engine property** |
| Boundary / hygiene / single-writer / decomposition / idioms / no-dup | ~24 | ~24 | No (mostly sub-second source-shape) |
| Meta-gates (gate-is-runtime, chronic-closure, ci-coverage, manifest-sourced, settle-is-predicate) | ~5 | ~5 | **No — these ENFORCE the precept; keep** |
| Per-surface appearance/layout locks (the H band) | ~54 | **~40** | **~14 collapsible** (the §1 overlaps + the rounded-radius spread) |
| Interaction/error-budget (live-session, drag-gesture, mobile, suspend-resume, single-toggle…) | ~16 | ~16 | No |
| Device-honesty observe-only (perf-frame-budget, visual-lock, lighthouse, drawer-spring, bench-taxonomy, epf1…) | ~8 | ~8 | **No — principled posture axis** |
| Publish/consume/agent surface (published-surface, peer-satisfied, agent-validate, repin-witness…) | ~10 | ~10 | No |

**Distinct invariants ≈ 118–122.** Collapsible ≈ **24–28 gates (~17–19%)**, of
which the *firmly-evidenced* collapse (named with `file:line` in §1) is:

- card trio: 3 → 2 chromium gates + 1 cheap grep (**−1 browser sweep**, clause 2
  R1-duplicate removed, clause 1 demoted to source, clause 3 → grep)
- easing-sidebar pair: 2 → 1 (**−1 self-chromium boot**, B4 R2-nested removed)
- bezier-grown clause 3: fold into bezier-no-scroll (**−1 duplicated browser
  clause**, no gate deleted)
- the rounded-radius theme: 5 gates assert it → 1 owner sweep (folds
  appearance-suffusion (f) + the trio's overlap; **partition-preserving merge**)

**The conservative, defensible number: ~13 genuinely-redundant browser clauses /
~5 collapsible browser gate-invocations**, with a further ~10–15 H-band gates
that are *amortizable* (R4 — share a cold-boot) without deleting any oracle. So:

> **Of ~146 leaf gates protecting ~118–122 distinct invariants, ~5 browser
> gate-invocations are firmly collapsible with NO loss of coverage, and ~24–28
> gates total could consolidate. The minimal covering set is ~118–122 gates —
> but the REAL win is not deletion, it is reorganizing the H band into
> one-gate-per-surface so the ~13 duplicate clauses and the ~20 redundant
> cold-boots disappear.**

This is a MODEST superfluity by count (~17%), and the doc must say so plainly:
**this apparatus is not 50% bloat.** The precept-enforced appearance estate is
real coverage. The superfluity is concentrated and nameable, not pervasive.

---

## 4. THE COST OF SUPERFLUITY — redundancy × the browser wall-clock

Lane A's load-bearing finding: **browser gates span 1.98s → 80.85s; 51% of
gates are browser; 92–96% of `proof:all` wall-clock is browser.** A redundant
browser gate is not clutter — it is a **full chromium cold-boot + per-scene
settle sweep.**

Tie the §1 redundancy count to that timing. The firmly-collapsible browser
invocations and their lane-A-class cost:

| Redundant unit | Class | Per-pass cost | Source |
|---|---|---:|---|
| `card-rounded-primitive` (clause-2 dup → removable browser sweep of 4 scenes) | browser, 5 settle/nav | ~**11s** (layout-cluster-class) | A §2 table (multi-scene ≈ 11.3s median) |
| `easing-sidebar-minimal` self-chromium (B4 nested; merge into `normalized`) | browser, self-launch | ~**2–3s** (single-scene) | A §2 (1-scene browser 1.98–2.76s) |
| `bezier-grown` clause-3 (re-measures no-scroll fit on a 2nd panel visit) | browser clause | ~**1–2s** of the gate's panel re-visit | A §2 (per-panel settle) |
| rounded-radius theme spread (3–4 gates sweep scenes to assert the same radius) | browser, multi-scene | overlapping ~**10–20s** | A §2 |

**Per single `proof:all` pass, the firmly-named redundancy ≈ 2–3 minutes of
browser wall-clock** (the conservative floor; the rounded-radius theme spread
pushes it higher). On a ~15–31-min pass (lane A), that is **~7–13% of the
browser budget spent re-asserting facts a neighbour already proved.**

**But the multiplier is the real cost.** Lane A §3 proved the iterate-to-green
loop is **O(N²)** — a serial `&&` chain with no green-skip caching re-runs every
prior green on every red. The 3-hour witness was **5–6 reds × a ~30-min full
prefix re-run.** The redundant 2–3 min/pass therefore recurs on **every prefix
re-run**: across 5–6 reds, the redundancy alone is **~10–18 minutes** of the
3 hours — and because the card/sidebar/bezier cluster runs CONSECUTIVELY in the
chain (verified in the `/tmp/proof-all-L-final*.log` command line:
`…scene-card-rounded && stage-glass-card && card-rounded-primitive &&
stage-within-docks && mobile-single-page && bezier-no-scroll && bezier-single-card
&& bezier-grown…`), a single late red in that band re-pays ALL of the cluster's
redundant boots every iteration.

> **The superfluity is not just clutter; it is ~2–3 min/pass × the O(N²) re-run
> count = ~10–18 min of the owner's 3 hours spent re-proving subsumed facts on
> redundant chromium boots.** Removing the §1 duplicates is a real (if not
> dominant) slice — and it is the SAFEST lever, because each named removal is a
> provable clause-duplicate, not a coverage cut.

---

## Verdict — principle vs implementation (candid)

**Sound in principle (keep, do not touch):**
- The **`gate-is-runtime` precept** (`proof-gate-is-runtime.mjs:6–20`) — a
  correctness gate must actuate the running product through the real surface
  with a zero error budget — is correct and is WHY the appearance estate cannot
  collapse to source greps. The 54 H-born appearance gates exist because
  source-shape gates provably miss appearance/interaction/state (the recorded
  gate-blindspot lesson). **This is earned coverage, not bloat.**
- The **device-honesty taxonomy** (`gate-taxonomy.md`, 8 observe-only gates with
  named Category + Architectural cure) is principled and should stay.
- The **inheritance-by-reference pattern** (`appearance-suffusion` clause (h)
  inheriting `live-session` rather than re-running it) is the RIGHT way to avoid
  re-statement — the apparatus already knows how to not duplicate; it just did
  not apply it inside the H per-surface band.

**Contrivance / superfluity (the implementation, nameable with evidence):**
1. **The card trio's `card-rounded-primitive` clause 2 is an exact R1 duplicate**
   of `stage-glass-card` (same `.stage-cell > [data-surface="glass"]` selector,
   same non-zero-radius measurement, separate cold-boot). The single clearest cut.
2. **The easing-sidebar pair double-cold-boots one sidebar** (both self-launch
   chromium, `minimal` B4 is R2-nested in `normalized`'s flatten).
3. **`bezier-grown` clause 3 re-measures `bezier-no-scroll`'s fit** (its own
   header admits the reuse three times).
4. **The "non-zero border-radius" invariant has metastasized across 5 gates**
   with no single owner — the natural consolidation is one "all kf surfaces
   rounded" sweep.
5. **42% of gates born in one tranche (H), heavily clustered on ~4 surfaces** —
   the structural reason the per-surface clause overlap concentrates. The cure is
   reorganization (one gate per surface, all invariants as clauses, one boot),
   NOT deletion.

**What is NOT superfluous (the fair defense):**
- The **hero trio** — three orthogonal oracles (font-size / layout-fold / CLS) on
  one `<h1>`. Adjacency is not redundancy.
- The **bezier trio's three distinct invariants** (fit / single-card / grown) —
  three real past bugs, three real failure modes; only the ONE re-measured fit
  clause is carry.
- The **meta-gates** (`gate-is-runtime`, `chronic-closure`, `ci-coverage`) —
  these ENFORCE the precept and police the chronics against paper-closure; they
  are the apparatus's immune system.
- The **engine-correctness estate** (~34 gates) — each a distinct engine property,
  mostly sub-second pure-vitest; not the cost, not the redundancy.

## Recommendation (next-doc handoff — NOT implemented here)

In priority order by (safety × payoff), composing with lane A's recommendations:

1. **Remove the 3 firmly-evidenced clause-duplicates** (card-rounded-primitive
   clause 2; easing-sidebar-minimal B4; bezier-grown clause 3). Each is a
   provable R1/R2 — zero coverage loss, ~2–3 min/pass back, recurring under the
   O(N²) loop. **Safest possible cut.**
2. **Demote the two now-cheap remainders to source/grep** —
   card-rounded-primitive clause 1 (static `*Target.vue` root grep) and clause 3
   (the glass-ui `cards.css` consume-leg witness) need no browser. Moves them off
   the chromium tier entirely.
3. **Name one "all kf-owned surfaces rounded" sweep** that owns the non-zero
   border-radius invariant across all scenes in ONE cold-boot, retiring the
   theme's spread across 5 gates (preserving every distinct selector as a clause).
4. **Reorganize the H per-surface band to one-gate-per-surface** (the bezier
   panel, the stage card, the easing sidebar, the hero each become ONE gate with
   all their invariants as clauses and ONE cold-boot) — the R4 amortization that
   removes ~20 redundant cold-boots without deleting an oracle. This is the
   structural cure; it composes with lane A's "shared warm browser" recommendation.
5. **Do NOT mass-delete H gates.** The count (~146) is not the dominant cost
   (lane A proved the browser SWEEP is); the redundancy is ~17%, concentrated and
   nameable. The honest message to the owner: *the apparatus is mostly earned;
   the cure is reorganization + the lane-A parallelism, not a purge.*

---

### Evidence index (every claim reproducible, read-only)

- Gate count: `node -e` over `package.json` → 150 keys, 146 leaf (lane A).
- Tranche-tag distribution: `for f in scripts/proof-*.mjs; head -8; grep -oE
  '\b[A-Z]\.W[0-9]'` → H 54 / L 15 / K 14 / I 12 / G 11 / J 7 / F 5 / E 4 / D 4
  (128 scripts).
- bezier-grown re-measures no-scroll: `proof-bezier-grown.mjs:34,36–37,39,52`.
- easing-sidebar overlap: `proof-easing-sidebar-normalized.mjs:343` (ONE Card) vs
  `proof-easing-sidebar-minimal.mjs:437,440` (B4 exactly 1 Card); both
  self-launch (`grep -c chromium|playwright|launch` → 8 each, 0 demo-driver).
- card-trio duplicate: `proof-card-rounded-primitive.mjs:204–206` vs
  `proof-stage-glass-card.mjs:115–117,39` (identical `.stage-cell >
  [data-surface="glass"]` non-zero-radius measurement).
- 5 gates assert border-radius: `grep -l border-radius scripts/proof-*.mjs` →
  appearance-suffusion, card-rounded-primitive, scene-card-rounded,
  stage-glass-card, styling-idioms.
- single-past-bug signature (10 gates): `grep -lE "born-RED on (tranche-|pre-W|
  post-W|HEAD)"`.
- live-session is error-budget, NOT layout (does not subsume the trio):
  `proof-live-session.mjs:12–16` (ERROR BUDGET = 0 over PLAY/SWITCH/DRAG).
- inheritance-by-reference (the right pattern already in use):
  `proof-appearance-suffusion.mjs` clause (h) — "inherited BY REFERENCE, never
  re-stated here."
- Timing class (browser 1.98–80.85s, 92–96% of wall-clock, O(N²) loop): lane A
  `gate-apparatus-A-taxonomy.md` §2–§3.
- Consecutive cluster ordering in the chain: `/tmp/proof-all-L-final2.log`
  command line (`…scene-card-rounded && stage-glass-card && card-rounded-primitive
  …bezier-no-scroll && bezier-single-card && bezier-grown…`).
</content>
</invoke>
