# a27 — proof:* gate roster integrity (Tranche R deep audit, lane 27)

Auditor lane: the `proof:*` gate roster as an instrument — its tier map, its
CI wiring, its excised-feature / born-green / duplicate / false-runtime residue,
and the S-era roster diet it demands.

Range audited: master `a15cd48..18e8617` (R impl-drive). Repo read on
`tranche-s-dev`. All findings cite `file:line` or a package.json script key. No
source, config, or doc was modified other than this report.

---

## Executive summary

The roster is **numerically clean and internally self-consistent**: 190 `proof:*`
keys → 184 real gates + 6 aggregators; every real gate lands in exactly one tier
(24 `proof:correctness` ∪ 159 `proof:hygiene-chain` ∪ 1 born-RED stray
`proof:peer-satisfied`); `proof:ci-coverage` is fully GREEN across all 15 clauses
(coverage forward + converse, no raw-node steps, version-literal single-sourcing,
posture manifest ⇄ taxonomy, static-gate placement). `proof:gate-is-runtime`
PASSES: all 24 correctness gates are shape-valid browser actuators. As a
*coverage* instrument the roster does its job — nothing is authored-but-unrun,
nothing is CI-only-orphaned.

But as a *design* instrument the roster is heavily silted, and the silt sits
directly in Tranche S's blast radius:

1. **The "correctness" tier is a misnomer — it means "browser-actuating demo
   gate", not "correctness".** All 24 members are demo-interaction gates; ZERO
   library-correctness gates are in it. Genuine correctness (`replay-equality`,
   `engine-correctness`, `compile-deterministic`, `grammar-fuzz`, `zero-alloc`)
   is labelled *hygiene*. The taxonomy conflates *severity* with *harness*.
2. **~54 gates (~30% of the roster) ossify the CURRENT demo/app appearance**
   (bezier-*, hero-*, phi-leaf, card/glass/cartoon/dock/drawer, sidebar-*,
   scene-card, layout-cluster …). S's charter is "demo/app is a mess — rewrite
   it + resurrect the scene-switcher". These gates will red *en masse* on that
   rewrite, and one of them (`proof:scene-colocated`) **hard-asserts the
   scene-switcher is DELETED** — a direct gate-vs-charter collision.
3. **Cross-repo PENDING placeholders** (workaround-deletion, glassui-aria-ask,
   peer-satisfied, pin-ledger npm-view leg) are born-green/born-red stubs waiting
   on glass-ui BC + value.js publishes that have not happened — carried CI weight
   that asserts nothing today.
4. **Small genuine duplication**: three morph gates each re-boot the *same*
   `test/morph-svg.test.ts`; the emerging-css cluster is three near-parallel
   node+vitest gates for one resolver feature.
5. **`proof:gate-is-runtime` verifies TEXT-PRESENCE of actuation primitives, not
   that the actuation drives the asserted oracle**, and its non-vacuity floor is
   frozen at I.W0–I.W7 while the tier has grown to 24 — 14 of 24 members are
   invisible to the floor and show stale `correctness-tier` provenance.

The S diet is not "delete broken gates" (there are none broken). It is
**re-tier + de-ossify + terminalize**: rename the tiers to their true axes, fold
the 54 demo-appearance gates into a small number of system-property gates that
survive a demo rewrite, kill the scene-switcher-DELETED assertion, and close the
four cross-repo PENDING stubs.

---

## Roster shape (the measured baseline)

| Metric | Value | Source |
|---|---|---|
| Total `proof:*` package keys | 190 | `package.json` scripts |
| Aggregators (all/correctness/hygiene/hygiene-chain/all:demo/browser) | 6 | — |
| Real gates | 184 | — |
| `proof:correctness` members | 24 | `proof:correctness` chain |
| `proof:hygiene-chain` members | 159 | `proof:hygiene-chain` chain |
| Not in any tier (intentional born-RED stray) | 1 (`proof:peer-satisfied`) | — |
| Tier overlap (correctness ∩ hygiene) | 0 | clean partition |
| CI-invoked distinct gates | 184 | `.github/workflows/ci.yml` |
| Real gates NOT invoked in CI | 0 | — |
| `proof:ci-coverage` verdict | PASS (15/15 clauses) | ran read-only |
| `proof:gate-is-runtime` verdict | PASS (24 shape-valid) | ran read-only |
| Observe-only (never-red-in-CI) gates | 8 | taxonomy manifest |
| Demo-appearance/cosmetic gates (heuristic) | ~54 | key-name census |

The forward/converse coverage numbers reconcile: 190 keys − 8 EXCLUDED = 182
forward-demanded; 184 CI-invoked includes the 2 excluded-but-still-invoked
(`peer-satisfied` in demo-smoke continue-on-error, plus the ci-coverage self).
**No coverage lie exists.** The problem is not holes; it is what the gates *lock*.

---

## Findings (severity-ordered)

### F1 — [HIGH] The "correctness" tier is defined by harness, not by severity; genuine library-correctness is exiled to "hygiene"

Every one of the 24 `proof:correctness` members is a demo browser-interaction
gate (`proof:engine-no-throw-on-play … proof:morph-scene` — full list in
`package.json` `proof:correctness`). This is *by construction*:
`proof:gate-is-runtime` (`scripts/proof-gate-is-runtime.mjs:18-24`) DEFINES a
correctness gate as one that "opens a browser … AND actuates the running
product". Anything that cannot open a browser is, by that definition, hygiene.

The consequence is a category error. These are all in `proof:hygiene-chain`:

- `proof:replay-equality` — the round-trip replay FLOOR (L.W1)
- `proof:engine-correctness` — "five engine correctness locks" (its own name)
- `proof:compile-deterministic` — byte-deterministic compile ids
- `proof:compile-replay` — "the round-trip's BACKWARD half replays equal or REFUSES"
- `proof:roundtrip-fidelity`, `proof:nan-frame`, `proof:grammar-fuzz`,
  `proof:zero-alloc`, `proof:interpolate-anything`, `proof:composition-honored` …

By any honest reading these ARE correctness gates — they assert the *published
library* computes the right answer. They are labelled hygiene solely because
they run in jsdom/node, not chromium. The I.W7 precept
(`proof-gate-is-runtime.mjs:6-12`) — "a gate whose oracle is a jsdom unit … is a
HYGIENE gate, not a CORRECTNESS gate" — is a defensible statement about *demo*
correctness (a demo is only correct if a human can drive it), but it was
globalized into the tier taxonomy, mislabeling the library's own correctness
proofs.

**Why it matters for S**: the tier names are load-bearing (`proof:all` =
`correctness && hygiene`; run-all schedules by tier). A reader trusting the names
believes "hygiene = lint-ish, low stakes" and "correctness = the real proofs" —
exactly inverted for the library surface. A future dev deprioritizing a
"hygiene" red could be dropping `replay-equality`.

**Proposal (S)**: split into THREE honest axes, retiring the harness-as-severity
conflation:
- `proof:library-correctness` — the value-computing proofs (replay, engine,
  compile, grammar-fuzz, zero-alloc, interpolate-anything…). node/jsdom, fast.
- `proof:demo-correctness` — the current `proof:correctness` set (browser
  actuators). Keep `gate-is-runtime` policing THIS tier's shape.
- `proof:hygiene` — structure/boundary/lint/absence-guards only.

`gate-is-runtime`'s "opens a browser" contract then applies to
`proof:demo-correctness` (where it is true and useful), and stops mislabeling
library proofs.

---

### F2 — [HIGH] ~54 gates ossify the current demo appearance; S's demo rewrite will red them wholesale

A key-name census counts ~54 gates keyed to specific *visual/layout details* of
the present demo/app: `proof:bezier-no-scroll`, `proof:bezier-single-card`,
`proof:bezier-grown`, `proof:hero-rung`, `proof:hero-balance`, `proof:hero-cls`,
`proof:phi-leaf-zero`, `proof:card-rounded-primitive`, `proof:scene-card-rounded`,
`proof:stage-glass-card`, `proof:stage-within-docks`, `proof:cartoon-is-panel-depth`,
`proof:glass-and-cartoon`, `proof:dock-zorder`, `proof:drawer-spring`,
`proof:darkmode-row-toggle`, `proof:idle-fade`, `proof:single-column-pack`,
`proof:label-subgrid`, `proof:timeline-rail-width`, `proof:demo-shell-grid`,
`proof:layout-cluster`, `proof:easing-sidebar-minimal`,
`proof:easing-sidebar-normalized`, `proof:easing-stage-is-ball`,
`proof:scene-uses-standard-ribbon`, `proof:typing-dots`, `proof:crayon-preserved`,
`proof:pp-logo-svg`, `proof:mobile-single-page`, … (full ~54 by grep).

These are the accreted output of the H/I/K/L/Q demo-polish tranches — each locks
one pixel-level decision. That was appropriate while stabilizing a *fixed*
design. S's charter (from the lane brief) is the opposite: "demo/app is a mess;
demo/playground identity unclear; resurrect the shelved scene-switcher properly".
A structural demo rewrite invalidates the premise of most of these gates at once
— they will red not because the demo regressed but because the layout they
hard-coded no longer exists.

**Why it matters**: this is the classic gate-ossification trap. The gates were
authored to *prevent* regressions in a design that S intends to *replace*. Left
as-is they convert "improve the demo" into "fight 40 red gates", biasing S toward
NOT rewriting — the exact chilling effect the owner flagged (MEMORY: "green
source-shape gates miss appearance/interaction/state").

**Proposal (S)**: Do NOT carry these forward gate-for-gate. Instead:
1. Declare a **demo-appearance gate FREEZE** at S open: the ~54 are frozen as a
   named set; the demo rewrite is *authorized to red them*.
2. Replace the set with a *small* number of **system-property** gates that
   survive any layout (e.g. one `proof:demo-occlusion-free` covering
   occlusion/clip/z-order across viewports; one `proof:demo-a11y` covering
   contrast/focus/tap-target; one `proof:demo-dogfoods-engine` covering the
   inv-ζ dogfood). System properties, not pixel coordinates.
3. Anything genuinely worth keeping (e.g. `proof:phi-leaf-zero` as a design-token
   discipline) is re-authored against the *new* demo, not grandfathered.

This is the single largest lever in the S diet: ~54 → single-digit.

---

### F3 — [HIGH] `proof:scene-colocated` hard-asserts the scene-switcher is DELETED — colliding with S's "resurrect it" charter, and with `proof:scene-switcher-mobile`

`scripts/proof-scene-colocated.mjs:28-30, 191, 210-212` — ASSERTION 3 "DEAD CODE
DELETED" fails the gate unless `SceneSwitcherCarousel`, `useScrollSnapScene`,
`Animated.vue`, and `ResponsiveSelect.vue` are ABSENT from `demo/`. R.W5 excised
them and this gate locks the excision.

Two collisions:
- **vs the S charter** ("resurrect the shelved scene-switcher properly"):
  bringing back a scene-switcher component reds this gate by design.
- **vs `proof:scene-switcher-mobile`** (a live `proof:correctness` gate,
  `ci.yml:684-687`): it asserts a 390px scroll-snap *carousel renders*. So the
  roster simultaneously asserts "the switcher carousel is deleted" (colocated)
  and "a switcher carousel renders" (switcher-mobile). These describe two
  different carousels born of the same feature indecision — precisely the
  "identity unclear" residue S is meant to resolve.

**Proposal (S)**: When S resurrects the switcher, **delete ASSERTION 3** of
`proof-scene-colocated.mjs` (keep its ASSERTION 1/2 colocation/`../../`-climb
clauses — those are still good architecture). Reconcile the two switcher gates
into one owner of the switcher's behavior, and let scene-colocated police
*location* only, not the switcher's existence.

---

### F4 — [MEDIUM] `proof:gate-is-runtime` proves SHAPE, not that actuation drives the oracle; its non-vacuity floor is frozen at I.W0–I.W7

`scripts/proof-gate-is-runtime.mjs:192-236` detects a gate as "actuating" by
regex-matching actuation primitives (`page.click`, `dispatchEvent`,
`page.mouse`, `navToScene`, …) in the script *text*. It does not — and
structurally cannot — verify that the actuation is causally upstream of the
asserted product property. A gate that `page.click()`s and then asserts a
source-shape fact, or actuates in a dead branch, PASSES the meta-gate. The
"runtime claim" a green `gate-is-runtime` makes is therefore *"the script
contains actuation tokens"*, not *"the gate's verdict depends on the product
responding"*. This is the residual RED-1 gap the gate claims to close
(`:28-33`): it closed *authorial* priority, not *causal* fidelity.

Second defect: the non-vacuity floor (`:247-263`) hardcodes
`EXPECTED_WAVES = ["I.W0" … "I.W7"]` and requires each I-wave still be
represented. The correctness tier has since grown from 10 → 24, but the floor
still only guarantees the 8 original I gates exist; the 14 post-I additions
(subject-animates, cold-entry, morph-scene, demo-control-point, …) are
shape-audited but not floor-required. Relatedly `WAVE_ANNOTATION` (`:94-105`) is
frozen at I-era, so 14/24 members render as generic `correctness-tier`
provenance in the gate's own output (observed in the live run).

**Proposal (S)**: (a) strengthen the actuation check by requiring the gate to
also read a *product-DOM property after* the actuation (e.g. assert the script
references both an actuation primitive AND a post-actuation `page.evaluate` /
`getAttribute` / `boundingBox` read) — a cheap heuristic that catches
"click-then-grep". (b) Replace the frozen I-wave floor with a
membership-count floor tied to the tier's own size (non-empty + every member
shape-valid), dropping the I-era coupling. (c) Drop or regenerate
`WAVE_ANNOTATION` — it is stale provenance, not a contract.

---

### F5 — [MEDIUM] Four cross-repo PENDING placeholders carry CI weight while asserting nothing today

- `proof:workaround-deletion` (`ci.yml:345`) — all five arms are PENDING
  (sibling fixes UNPUBLISHED) → exit 0 unconditionally until glass-ui 4.1.0 /
  value.js 0.14.0 publish.
- `proof:glassui-aria-ask` (`ci.yml:470`) — "observe-only PENDING-until-BC-publish".
- `proof:peer-satisfied` (`ci.yml:531-534`) — born-RED-by-design, continue-on-error,
  DELIBERATELY absent from every blocking tier; never blocks, only records.
- `proof:pin-ledger-current` (`ci.yml:441`) — npm-view leg observe-only.

Each is a legitimate cross-repo coupling *receipt*, but collectively they are
four gates whose CI verdict is a foregone conclusion gated on publishes outside
this repo's control. They are constellation debt parked in the roster.

**Proposal (S)**: fold into ONE `proof:constellation-consume-edge` gate with a
declared PENDING/RED/GREEN state machine per sibling arm (the workaround-deletion
model generalizes cleanly), so the roster carries one cross-repo receipt, not
four. If S's constellation work publishes the sibling fixes, terminalize the
arms (delete the workaround + flip GREEN) rather than leaving perpetual PENDING.

---

### F6 — [MEDIUM] Three morph gates each re-boot the same `test/morph-svg.test.ts`

`proof:morphsvg-consume`, `proof:morph-renders-d`, `proof:morph-orients` each end
in `&& vitest run test/morph-svg.test.ts` (package.json). The three *node*
oracles are genuinely distinct (consume-edge / on-DOM `d` render / orient-along-
path — verified from each script's header), but the vitest tail is identical, so
CI boots the full morph test file **three times** as three separate steps
(`ci.yml:421-426`). Plus `proof:morph-scene` (browser, correctness) makes four
morph gates.

**Proposal (S)**: append the vitest run to exactly ONE of the three
(`morphsvg-consume`), or better, merge the three node oracles into one
`proof:morph` node script with three clauses + a single vitest run. Net: 3 CI
steps + 3 vitest boots → 1.

---

### F7 — [LOW-MEDIUM] The emerging-css cluster is three near-parallel node+vitest gates for one resolver feature

`proof:emerging-css-resolve-now` / `-p2` / `-fn` are three separate
node-script + dedicated-test-file gates over one feature area (the emerging-CSS
`if()`/`@function`/`env` resolver). Unlike F6 they each own a *distinct* test
file so there is no double-boot, but the fan-out mirrors a code area S intends to
sub-zone (`compile/resolve/`, per the S charter's "deeper sub-zoning"). The
recent re-tier (commit `18e8617`: `-now` moved correctness→hygiene-chain to
satisfy F1's harness rule) is correct and already applied.

**Proposal (S)**: when `resolve/` is sub-zoned, consolidate into one
`proof:emerging-css-resolve` with a multi-clause node oracle + a single
`vitest run test/emerging-css-*.test.ts` glob. Low priority — no correctness or
coverage defect, purely roster-surface reduction.

---

### F8 — [LOW] Eight observe-only gates never red in CI; several are perf gates with an unshipped "architectural cure"

The 8 observe-only gates (`proof:bench-taxonomy`, `proof:drawer-spring`,
`proof:epf1-measure`, `proof:lighthouse-mobile`, `proof:perf-frame-budget`,
`proof:scene-transition-perf`, `proof:visual-lock`, + the `live-session-mobile`
M2 clause row) RECORD but never block (taxonomy manifest, verified via
ci-coverage clause-4 output). This is honest device-dependence discipline, not a
defect. But four are perf/render gates (`perf-frame-budget`,
`scene-transition-perf`, `visual-lock`, `drawer-spring`) whose taxonomy row names
an "architectural cure" that would promote them to `hard` — a cure booked across
multiple tranches and still unshipped. An observe-only gate that never converges
to `hard` is a permanent CI-time cost with no gating value.

**Proposal (S)**: S's "SOTA uplift for animation" already implies a
device-independent perf story (the `proof:portable-perf` same-report-ratio model
exists — `ci.yml:411`). Migrate the wall-clock perf observe-onlys onto the
portable-perf ratio model (device-independent → promotable to `hard`), and retire
any whose cure S declines to ship. Target: observe-only set 8 → ≤3.

---

### F9 — [LOW] ~9 absence/regression-only guards are one-time-migration tripwires unlikely to re-bite

`proof:no-deprecated-guard`, `proof:alias-dropped`, `proof:no-silent-fallback`,
`proof:no-cross-realm-cast`, `proof:no-foreign-symbol-stamp`,
`proof:no-flat-siblings`, `proof:no-dup-utility`, `proof:no-brittle-selector`,
`proof:no-single-option-select` each assert *something deleted stays deleted*.
They are legitimate regression tripwires, but most guard a one-time migration
(the 5.0.0 alias drop, the R.W1 flat-sibling dissolution) that no one is
plausibly going to undo. They are born-green-forever in practice.

**Proposal (S)**: keep them (cheap, and a regression *would* be bad), but group
them under an explicit `# regression-guard` band in the hygiene chain so their
low-information-density is visible and a future auditor doesn't mistake 9 green
absence-checks for 9 live properties. No deletion warranted.

---

### F10 — [INFO] Roster size itself: 190 keys / 159-member serial hygiene chain in package.json

`proof:hygiene-chain` is a single ~159-member `&&` string; `proof:correctness` a
24-member `&&`. run-all.mjs parallelizes execution, but the *source of truth* is
two enormous package.json lines. This is not a correctness issue (ci-coverage
parses them fine) but it is a maintainability and reviewability tax, and it is the
raw material F1/F2/F5/F6/F7 all chip at.

**Proposal (S)**: after F1 (three-axis re-tier) and F2 (demo-appearance fold),
the chains shrink materially. Consider sourcing tier membership from a small JSON
manifest (`gate-tiers.json`) that the tier scripts and the meta-gates read,
rather than three hand-maintained `&&` megastrings — the M.W1 "membership stays
parseable" contract already anticipates this (ci-coverage `resolveTier`).

---

## What is genuinely healthy (do not "fix")

- **Coverage is airtight**: 0 unwired gates, 0 CI-only orphans, 0 raw-node steps,
  0 version-literal drift, clean tier partition. `proof:ci-coverage` is a
  well-built, self-policing instrument — keep it.
- **No gate over a truly-excised feature**: `animate()` was excised from the
  *static* surface but `src/animation/animate.ts` still exists (dynamic-only), so
  `proof:animate-orchestration` is valid. The only KILLED thing
  (`keyframes-vue`) is referenced solely by `proof:chronic-closure` *to assert
  its name is absent* — correct.
- **The recent re-tier (`18e8617`)** moving `emerging-css-resolve-now`
  correctness→hygiene-chain is the *right* kind of maintenance under the current
  taxonomy (a node gate cannot satisfy `gate-is-runtime`'s browser rule).
- **The two meta-gates run green today** on `tranche-s-dev` (verified live).

---

## Tranche-S implications (wave-shaped)

**S.Wx — Tier taxonomy honesty (F1, F4, F10).** Rename/split the two-tier model
into `library-correctness` (node/jsdom value-proofs) · `demo-correctness`
(browser actuators, keep `gate-is-runtime` here) · `hygiene` (structure/absence).
Re-scope `gate-is-runtime` to `demo-correctness`, add a post-actuation-DOM-read
heuristic, drop the frozen I.W0–I.W7 floor + stale `WAVE_ANNOTATION`. Consider a
`gate-tiers.json` manifest to retire the megastring chains.

**S.Wy — Demo-appearance gate de-ossification (F2, F3).** Declare the ~54
demo-appearance gates a FROZEN set; authorize the demo/app rewrite to red them.
Replace with a handful of layout-invariant system-property gates
(occlusion-free / a11y / dogfood). **Delete ASSERTION 3 of
`proof-scene-colocated.mjs`** and reconcile the two scene-switcher gates as part
of resurrecting the switcher — the gate must not forbid the charter.

**S.Wz — Constellation consume-edge consolidation (F5, F8).** Fold
`workaround-deletion` + `glassui-aria-ask` + `peer-satisfied` +
`pin-ledger` npm-view leg into ONE stateful `constellation-consume-edge` gate;
terminalize PENDING arms whose sibling fixes S's constellation work publishes.
Migrate the wall-clock perf observe-onlys onto the `portable-perf` ratio model so
they can promote to `hard`; retire cures S declines.

**S.Ww — Duplication trim (F6, F7).** Collapse the 3 morph gates' triplicated
`test/morph-svg.test.ts` boot to one; consolidate the emerging-css cluster into
one gate when `compile/resolve/` is sub-zoned. Band the ~9 absence-guards under a
`# regression-guard` header (F9). Net roster target: **190 → ~120 keys** without
losing a single live property.
