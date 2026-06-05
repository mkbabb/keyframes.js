# D.W6 — Close (recap · deferred terminal · release)

**Phase:** IMPL · **Class:** LAST · **Scope:** `docs/tranches/D/FINAL.md` +
`docs/tranches/D/audit/` (DELTA, recap) + `.changeset/` (the version owner) ·
**Gated on:** every prior D wave green (W1/W2/W3/W4/W5).

D's last wave closes the tranche the way C closed: the deferred ledger fully
terminated (zero un-dispositioned punts), the prompt-recap confirmed, the
AFTER capture + DELTA produced **via the checked-in harness** (not re-authored,
not `/tmp`), and the stacked changesets given a **named version owner**. The
publish leg stays user-domain — D names the owner; the user drives the publish
in dependency order.

This wave writes **docs + a changeset only**. No engine or demo source changes
here — W4/W5 did the work; W6 records it and proves no regression.

---

## FINAL.md — the deferred ledger fully terminated

`docs/tranches/D/FINAL.md` is authored at W6, in C.FINAL's voice: terse,
gate-table-backed, **every recorded-MET gate resolving to a checked-in,
re-runnable instrument shown to PASS — not a narration** (inv ε). It carries:

### The deferred ledger — every item terminated (zero perpetual punts)

The plan's ledger (KFD = folded into D · OUT = sibling-booked · ARCH = permanent
KILL · CLOSED = done in C, verify-only) is discharged item-by-item. FINAL.md
records the **terminal disposition + the proving instrument** for each:

| Item | Tag | Terminal disposition (W6 records) | Proof |
|---|---|---|---|
| Square-scene mobile-composition occlusion | KFD | fixed in D.W5 | `occlusion-gate` allowance EMPTIED (stale-check fires) |
| φ-ladder leaf-tail F6 (89 body sites) — CHRONIC A→B→C | KFD | migrated in D.W2 | the consumption sweep (grep raw body rungs = 0) |
| Consumer dock-rename + `dock/index.ts` deletion | KFD | done in D.W5 | grep `TopDock\|AnimationMenuBar` = 0; `dock/index.ts` gone |
| `always-expanded="isMobile"` double-tap mask | KFD | removed in D.W5 | grep `always-expanded="isMobile"` = 0 |
| Engine `_snapSettled` asymmetry | KFD | symmetrized in D.W3 | `smooth.ts` snap stops its playback (parity with `spring.ts:196`) |
| `leaves.ts \| any` + deprecated re-exports | KFD | tightened/deleted in D.W4 | the no-legacy grep = 0 |
| bucket-glassui (ASK-3 `LabeledField` a11y) | OUT | glass-ui owns | the named lighthouse allowance, no vendor band-aid |
| VAL-9 `--spring-*` codegen (ASK-2) | OUT | glass-ui owns | `springLinearStops()` export stays stable (the enabler) |
| Dock double-tap (ASK-1) | OUT — RESOLVED | fixed by glass-ui B′ (`f0b0ffb`) | D removed the mask (D.W5) |
| glass-ui foundational slices (reka-Tabs rail, strict-templates) | OUT | AT's own arm | D depends only on the landed base |
| ScrollTimeline-native · Worker/OffscreenCanvas · dev.sh/deploy.sh | ARCH | permanent KILL | recorded; do not re-litigate |
| LoAF/>50ms-trace · EasingTarget leak · dead scene CSS · cartoon-shadow | CLOSED | done in C | D verifies no regression (the gates) |

**P-invariant-28 satisfied:** no item is a perpetual punt. Every KFD has a wave
+ a proving gate; every OUT has a named owner + the keyframes-side enabler kept
stable; every ARCH is recorded with rationale; every CLOSED is regression-checked
by a gate that bites.

### The gate suite — each VERIFIED by a checked-in instrument

FINAL.md's gate table records every per-wave `proof:*` + the standing C gates,
each a PASS of a re-runnable instrument:

| Gate | Instrument | Wave |
|---|---|---|
| inv α — boundary | `proof:boundary` (the light/heavy edge intact post-`FrameCompiler` split) | standing + D.W4 |
| inv ζ — dogfood | `proof:dogfood` (no hand-rolled rAF the engine already is) | standing + D.W1/W3 |
| inv δ — occlusion | `occlusion-gate.mjs` (HARD, allowance EMPTIED) | standing + D.W5 |
| zero-alloc group composite | `proof:zero-alloc` (0 bytes/frame steady state, bite-proven) | D.W4 |
| no-legacy | the no-deprecated-reexport grep (`utils.ts`/`format.ts`/`leaves.ts`) | D.W4 |
| engine tests | `npm test` (the `advanceTo`/`FrameCompiler`/`pause-resume-toggle` suite) | D.W4 |
| dock-rename | grep `TopDock\|AnimationMenuBar` = 0 + `dock/index.ts` deleted | D.W5 |
| φ-ladder leaf-tail | the consumption sweep (raw body rungs = 0) | D.W2 |
| design-idiom owned | the demo-local-ownership gate (`--rainbow-*`/`--color-gold`/`.scale-on-hover`/`@keyframes enter` resolve from the demo's OWN built CSS, not only via the transitive glass-ui + tw-animate-css rent) | D.W2 |
| brittleness | the selector/z-index/`@supports` checks | D.W3 |

---

## The prompt-recap confirmed

`docs/tranches/D/audit/prompt-recap.md` (authored at D.W0) is **confirmed** at
W6: every request across A → B → C → the constellation drive → the D ask
resolves **ADDRESSED** or has a named **D-SCOPE** fold that this close
discharges. No drops. The two historical drifts (B's falsely-closed LoAF; B's
advisory inv δ) were *corrected* in C, not dropped — D verifies they stay
corrected (the gates bite). The recap's only by-design loose end — the stacked
publish leg — is closed below by naming the version owner.

---

## The AFTER capture + DELTA via the checked-in harness

The C discipline: the harness (`scripts/capture.mjs`, checked in at C.W0 and
re-run at C.W5) is **re-run from the repo** at D-close — not re-authored, not
`/tmp`. W6 produces:

- **The AFTER capture** — `node scripts/capture.mjs after` against the
  W1–W5 integration HEAD, writing `audit/screenshots/after/` (the screenshot
  matrix, zero console errors). The capture's re-runs-identically-from-the-repo
  clause is discharged because the harness is in the repo (C closed the `/tmp`
  fiction; D inherits it).
- **`audit/DELTA.md`** — D-open → D-close, in C.DELTA's shape: a per-page
  intended-change table paired with the gate evidence (the regression authority
  is the gate suite, not the eye). The headline DELTA rows: the demo
  decomposition (W1, behavior-identical), the design-idiom layer + leaf-tail
  (W2, isomorphic pixels), the brittleness hardening (W3), the engine
  transposition (W4, byte-stable barrel + zero-alloc composite), the dock-rename
  + mobile occlusion close (W5).

**DELTA shows no unintended regression.** Every gate that bites
(`demo-smoke`/inv γ, `occlusion-gate`/inv δ both axes + emptied allowance,
`lighthouse-gate`/a11y-SEO, `proof:dogfood`/inv ζ, `proof:boundary`/inv α,
`proof:zero-alloc`, `npm test`) PASSES — so "no unintended regression" is
**proven by the gates, not asserted**.

---

## The version owner NAMED — the stacked changesets

D's published surface is the engine transposition (W4: the `FrameCompiler`
split, the `advanceTo` rename, the `pause`/`resume`/`toggle` API, the re-export
retirements — all public-barrel-visible). It ships as a **changeset**
(`.changeset/tranche-d.md`, **major** — the renames + removed re-exports are
breaking) atop the stack:

- **B `3.1.0`** (cut, unpublished — folded forward through C)
- **C `major`** (cut, unpublished — the W4 engine residuals)
- **D `major`** (this tranche — the engine transposition + dock-rename surface)

W6 **names the version owner** for the stacked publish — the single person who
runs `changeset version` → tag → `release.yml` and finalizes the SemVer tier for
the combined B+C+D release. This is the only by-design loose end (the plan:
"D names the version owner — the only un-orphaned-by-design loose end"). **The
publish leg stays user-domain, confirm-first** — identical to A/B/C; W6 names the
owner and the order (B → C → D folded into one provenance-signed publish), the
owner drives it.

---

## Hard gate (falsifiable · re-runnable · MUST bite)

The close is done only when:

### 1. The full gate suite green — every per-wave `proof:*` passes

A single checked-in close-runner (`npm run proof:all`, or the CI demo+lib jobs)
runs the entire suite and exits non-zero on any failure:
`proof:boundary` · `proof:dogfood` · `proof:zero-alloc` · the no-legacy grep ·
`occlusion-gate.mjs` (zero allowances) · `lighthouse-gate.mjs` ·
`demo-smoke.mjs` · `npm test`. All green, or W6 is not done. Each is bite-proven
in its wave (the inject/stale-check tests); the close-runner is the aggregate.

### 2. Zero un-dispositioned deferrals

A checked assertion that the deferred ledger in FINAL.md has a terminal
disposition + a proving instrument for **every** item, and that no `KFD` item
lacks a green gate. Falsifiable: an item left as "BOOKED" / "follow-on" / "TODO"
without a wave + a gate fails the check (P-invariant-28 — no perpetual punts).

### 3. DELTA shows no unintended regression

`audit/DELTA.md` pairs every changed surface with a passing gate; the AFTER
capture re-runs from the repo with **zero console errors**. The regression
authority is the gate suite — if any non-intended surface moved, a biting gate
reds. "No unintended regression" is the gates' verdict, recorded, not asserted.

---

## Close ledger

| Duty | Discharged by | Proof |
|---|---|---|
| FINAL.md (ledger terminated) | this wave | zero un-dispositioned deferrals (gate 2) |
| prompt-recap confirmed | `audit/prompt-recap.md` | every ask ADDRESSED / D-SCOPE folded |
| AFTER capture + DELTA | the checked-in harness | `audit/screenshots/after/` + `audit/DELTA.md`, 0 console errors |
| version owner named | `.changeset/tranche-d.md` | the B+C+D stack + the named owner + the publish order |
| full gate suite | `proof:all` | every `proof:*` green (gate 1) |

D closes keyframes' fourth tranche: the demo refined, the engine transposed to
its gestalt, the dock leveraged on the landed base, every keyframes-owned
deferral given a terminal home. The publish leg is the user's — named, ordered,
confirm-first.
