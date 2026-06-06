# F.W2 — Wire `proof:all` into CI (charter F2)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-F — CI-config only
(the highest-leverage, lowest-cost verification fix; ZERO engine/library/demo
behaviour change) · **Scope:** `.github/workflows/ci.yml` (+ optionally
`package.json` if a CI-named `proof:all-ci` subset is the chosen form) · **DAG-deps:**
depends on F.W0 (the spine); independent of F.W1 (different surface — CI config vs
the bench harness). Can run in parallel with F1/F3.

The §Mandate (F.W0) is the spine; this wave most tests **inv ε** — verify, do not
assert: the E close asserts "`npm run proof:all` … exits non-zero on any failure …
Each gate is bite-proven" (`E/FINAL.md:86-94`), and that is TRUE — but the standing
regression authority in practice is CI, and CI runs `proof:all` *nowhere*. Three
inv-tagged `.mjs` source-grep gates — `proof:dogfood` (inv ζ), `proof:demo-elevate`
(inv ο, the SOLE View-Transitions lock), `proof:modern-web` — plus the `.mjs`
source-half of `proof:platform-adopt` (inv ξ) — execute ONLY when a human types
`npm run proof:all` locally. The bite-proof is a one-time author act; the standing
guarantee is only as strong as what CI executes.

This is net-new (a gate-coverage residual, NOT inherited debt — the ledger is clean).
Verified not asserted (inv ε) against `tranche-e-impl`.

**Provenance.** `a-test-quality §1` (the HIGH finding: 3 inv-tagged grep gates +
the platform-adopt source-half never run in CI; the VT lock is author-only).

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-e-impl`:

1. **`proof:all` chains 13 gates + `vitest run`, and CI invokes it NOWHERE.**
   `package.json:55` defines `proof:all` as the full chain (`proof:boundary &&
   proof:dogfood && proof:engine && proof:decomposition && proof:idioms &&
   proof:brittleness && proof:demo-elevate && proof:modern-web && proof:zero-alloc &&
   proof:engine-correctness && proof:standalone-zero-alloc && proof:compile-deterministic
   && proof:platform-adopt && vitest run`) — verified live. A grep for `proof:all` in
   `.github/workflows/ci.yml` returns **0 hits** (`a-test-quality §1`).

2. **CI runs only a SUBSET of the gates.** Verified against `ci.yml`: the `gates` job
   runs `npm test -- --run` (`:92`), `proof:boundary` (`:94`), `proof:engine` (`:96`),
   `proof:zero-alloc` (`:98`); the demo job runs `proof:decomposition` (`:164`),
   `proof:idioms` (`:166`), `proof:brittleness` (`:168`). The four vitest-named proof
   scripts (`engine-correctness`, `standalone-zero-alloc`, `compile-deterministic`, the
   `platform-adopt.test.ts` half) DO bite in CI because `vitest run` globs all
   `test/*.test.ts` (`a-test-quality §1`, confirmed `ci.yml:92`) — so the *behavioural*
   E locks are safe.

3. **Three `.mjs` source-grep gates run NOWHERE in CI.** `proof:dogfood` (the inv ζ
   rAF-dogfood lock), `proof:demo-elevate` (inv ο, the E.W11 demo close — its VT clause
   at `proof-demo-elevate.mjs:25-46` is the **only** lock on the entire E.W11 View-Transitions
   surface), and `proof:modern-web` are named NOWHERE in `ci.yml` (`a-test-quality §1`,
   the gate-by-gate table). Plus the `.mjs` source-half of `proof:platform-adopt`
   (`package.json:50` runs `node scripts/proof-platform-adopt.mjs && vitest run …`; CI's
   `npm test` runs only the vitest half via the glob — the `.mjs` source-grep clauses go
   unchecked).

4. **The consequence is a real ungated regression surface.** `a-test-quality §1`: nothing
   in CI reds if a future edit (a) adds a raw `requestAnimationFrame` to a non-allowlisted
   demo file (`proof:dogfood` would catch it — `proof-dogfood.mjs:53` — but CI never calls
   dogfood); (b) **deletes the View-Transitions route** in `demo/app/useSceneTransition.ts`
   (the sole structural VT lock is `proof:demo-elevate`, author-only; there is no behavioural
   VT test — `grep startViewTransition test/` = NONE, defensibly so since VT needs a real
   browser); (c) reverts the platform-adopt source forms (feature-detect present, no bare
   call, no polyfill dep).

5. **The fix is cheap — the three gates are grep-only, no browser.** `proof:dogfood`,
   `proof:demo-elevate`, `proof:modern-web` are `.mjs` source-greps (no Chromium, fast).
   `proof:lighthouse-mobile` legitimately stays browser-gated/CI-calibrated (`E/FINAL.md:54`);
   the other three have no such excuse (`a-test-quality §1`).

The wave's job: wire `proof:all` (or the three uncovered grep gates + the platform-adopt
source-half) into the CI `gates` job, and close it with a control that flips one grep gate
red and verifies the CI job fails.

---

## § Goal

**What lands (the IMPL the spec gates):**
- **`proof:all` invoked in CI** — add one CI step `npm run proof:all` to the `gates` job;
  OR, to keep the demo/library job split, add the three uncovered grep gates
  (`proof:dogfood`, `proof:demo-elevate`, `proof:modern-web`) + the `proof:platform-adopt`
  source-half to the `gates` job (they are grep-only, no browser, fast). (SHIP-in-F.)
- **`proof:ci-coverage` authored** — a gate asserting a CI step invokes `proof:all` (or the
  3 grep gates), with a bite control that flips one grep gate red and asserts the CI job
  fails.

**Why:** this is "the single highest-leverage, lowest-cost verification fix" (`a-test-quality
§1`). The regression AUTHORITY in practice is CI; three inv-tagged gates (ζ, ο, ξ-source-half)
— including the sole View-Transitions lock — currently have no standing enforcement. The
fix is CI-config only (zero engine/demo behaviour), and it converts a one-time author
bite-proof into a standing CI guarantee.

---

## § Scope

### S1 — Wire the uncovered gates into the CI `gates` job — `a-test-quality §1`

**WHAT:** add the missing gate coverage to CI. The preferred form is one step
`npm run proof:all` in the `gates` job (single source of truth — the `package.json:55`
chain). The alternative (if the demo/library job split must hold) is to add the three
grep gates + the platform-adopt source-half as named steps in the `gates` job:
`proof:dogfood`, `proof:demo-elevate`, `proof:modern-web`, and the
`node scripts/proof-platform-adopt.mjs` source-half. **CI-config only** — no script,
test, or source change; the gates already exist and bite (their bodies are unchanged).

**WHY:** the three grep gates are inv-tagged (ζ dogfood, ο demo-elevate/VT, modern-web)
and grep-only (no browser, fast — `a-test-quality §1`). The standing guarantee the E
close claims (`E/FINAL.md:86-94`) is only as strong as what CI runs; wiring `proof:all`
makes it real. The §Mandate forbids a workaround — this is not "delete the unused gates"
or "downgrade the VT lock to advisory"; it is wiring the genuine gates into the standing
authority.

### S2 — `proof:ci-coverage` (the falsifiable close) — `F.md §F.W2`

**WHAT:** a gate that asserts (a) a CI step invokes `proof:all` (or, in the split form,
that all three grep gates + the platform-adopt source-half are named in the `gates` job),
AND (b) a **bite control**: flip ONE grep gate to its negative (e.g. inject a raw
non-allowlisted `requestAnimationFrame` into a demo file so `proof:dogfood` reds, OR
delete the VT route so `proof:demo-elevate` reds) and assert the CI `gates` job FAILS.
Revert the injection; assert green.

**WHY:** inv ε — the close must BITE. `proof:ci-coverage` is the falsifiable form of "the
inv-tagged gates now run in CI." The bite control proves the wiring is real authority, not
a no-op step: with the gate wired, the negative reds CI; without it, the negative slips
through green. This is the exact regression F2 forbids (an inv-tagged gate with no standing
enforcement).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **`proof:all` (or the 3 grep gates) runs in CI.** `proof:ci-coverage`: a CI step in the
   `gates` job invokes `npm run proof:all` (or names `proof:dogfood`, `proof:demo-elevate`,
   `proof:modern-web`, and the platform-adopt source-half). BITES: remove the step →
   `proof:ci-coverage` reds (the 3 inv-tagged gates fall back off-CI).
2. **A bite control flips a grep gate red and the CI job fails.** Inject the negative
   (a non-allowlisted raw rAF, or a deleted VT route) → the relevant grep gate reds →
   the CI `gates` job exits non-zero. BITES: if the CI job stays green with the injection,
   the wiring is a no-op → reds. Revert → green.
3. **CI-config only — no behaviour change.** No `src/`, `test/`, `demo/`, or `scripts/`
   change in this wave; the gates' bodies are byte-unchanged. BITES: a script/source edit
   smuggled into the CI wiring → reds (F2 is config-only; the gates already bite).
4. **`proof:lighthouse-mobile` stays correctly browser-gated.** F2 does NOT wire
   `proof:lighthouse-mobile` into the always-on `gates` job (it has a legitimate
   CI-calibration excuse, `E/FINAL.md:54`). BITES: a claim that F2 covers the lighthouse
   gate in the grep tier → reds (it is browser-gated by correct design).

---

## § Folds

Retires (by finding id):
- **`V1`/`NEW-2`** — wire `proof:all` into CI (`F.md §F.W2`) — S1 + S2.
- **`a-test-quality §1`** (HIGH) — 3 `.mjs` gates (dogfood/demo-elevate/modern-web) +
  platform-adopt source-half never run in CI; the VT lock is author-only — S1 (wire) + S2 (gate).

**RECORD (carried so no future lane re-raises):**
- **`proof:demo-elevate`/`proof:idioms`/`proof:decomposition` are SHAPE locks, not
  behaviour** (`a-test-quality §2`, MED) — a presence-grep is a legitimate cheap tripwire,
  but the gate's docstring overclaims "reds on the exact regression it forbids" (true only
  for structural deletion). RECORD that they are shape locks (the docstring claim should
  read "structural form", not "behaviour"); the behavioural VT/focus assertion BOOKs into
  the existing demo-smoke browser job (which already runs Chromium + lighthouse a11y), NOT
  a new gate. F2 wires the shape-lock tripwires into CI; the behavioural fix is BOOKED.
- **The gate↔test-file mapping is implicit** (`a-test-quality §5`, LOW) — `vitest run` globs
  every `test/*.test.ts`, so a stray name silently joins (or, on rename, escapes) the CI
  surface. A real fragility, low blast radius. RECORD the convention; do not re-architect.

**Routed to the demo-smoke browser job (BOOK, not this wave):**
- **A browser-driven VT/focus-routing a11y assertion** (`a-test-quality §2`) — belongs in
  the existing Chromium demo-smoke job, not a new instrument. BOOK; F2's scope is the grep
  tier.

---

## § Design decisions

1. **Wire the genuine gates; do not downgrade the VT lock — RESOLVED.** The sole
   View-Transitions lock (`proof:demo-elevate`'s VT clause) is author-only; the §Mandate
   forbids "documenting" the gap as acceptable. The fix is to wire it into CI so the VT
   surface has standing enforcement. Trade-off: a static grep can't verify the VT actually
   runs (that needs a browser — BOOKED into demo-smoke); but a wired shape-lock is strictly
   more enforcement than an author-only one, and it bites structural deletion today. KISS:
   wire the existing tripwire now, BOOK the behavioural assertion.

2. **`proof:all` vs the 3-gate subset — RESOLVED toward `proof:all`, subset acceptable.**
   The cleanest form is one `npm run proof:all` step (single source of truth). The split
   form (naming the 3 grep gates + platform-adopt source-half in the `gates` job) is
   acceptable if the demo/library job separation must hold — both close the same hole. The
   version owner / lead chooses; the GATE (`proof:ci-coverage`) accepts either. Trade-off:
   `proof:all` re-runs the already-covered gates in CI (a few seconds of redundancy) vs the
   subset's precision; the redundancy is cheap and the single-source-of-truth is the more
   robust default.

3. **CI-config only — the gates already bite — RESOLVED + HONEST (inv ε).** The bite
   discipline is genuinely SOTA (`a-test-quality §0`: vitest behaviour-locks with named
   negative controls, the LoAF playwright gate, zero `.skip`/`.todo`). The problem is the
   *seam* — `proof:all` is never invoked in CI — NOT the bite quality of the gates. F2
   touches no gate body; it wires the existing, biting gates into the standing authority.
   Trade-off: F2 ships no new gate logic — but manufacturing a new gate where the existing
   ones are exemplary would violate the §ALREADY-SOTA record; the honest fix is the seam,
   not the gate.
