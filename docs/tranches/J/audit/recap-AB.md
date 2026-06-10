# Tranche A + B — Lineage Recap Audit (J input)

Lane: `recap-AB`. Date: 2026-06-09. Auditor: orchestrated sub-agent.
Tree: `tranche-i-dev`, current version 4.1.0 (685 tests).

---

## 1. Tranche A — charter summary + user prompts

### 1.1 Charter (A.md)

A was keyframes.js' first tranche — the engine joining the bbnf tranche format
for the first time. Three things the v2.2.0 (KF-B1) boundary left open were its
targets:

1. **Boundary ergonomics** — string-easing silent-linear footgun before
   `.ready()`; three hand-rolled `.ready()` copies with no shared contract.
2. **CI break** — `file:../glass-ui` demo dependency unresolvable on a clean
   runner, making any release require a local publish.
3. **Engine modern-web baseline** — `prefers-reduced-motion` absent on the heavy
   path; `scheduler.yield()` absent in `AnimationGroup`; WAAPI spring `linear()`
   widening untried; README posture absent.

Plus: `src/animation/CLAUDE.md` stale to pre-KF-B1 geography; no
`docs/tranches/` existed (format reconciliation); phantom "#177" CI-break issue.

**Two new invariants introduced:**
- **inv α**: the KF-B1 boundary is gated, not asserted (`proof:boundary` in CI).
- **inv β**: the library build (`dist/`) resolves zero `@mkbabb/glass-ui`.

### 1.2 User prompts (A)

Captured from A.md §Prompt-recap (B.W0 compiled a definitive recap):

| Prompt | Where recorded |
|--------|----------------|
| Execute Tranche A in full | `B.md §Prompt-recap P1` |
| 3.0.0 re-release | `B.md §Prompt-recap P1` |
| Export RAFPlayback PRM gate | `B.md §Prompt-recap P1` |
| `npm publish --provenance` via changesets | `B.md §Prompt-recap P1` |
| Publish 3.0.0 first | `B.md §Prompt-recap P1` |
| Gate release on green CI | `B.md §Prompt-recap P1` |

---

## 2. Tranche B — charter summary + user prompts

### 2.1 Charter (B.md)

B turned the lens on what A's library-first scope left under-audited:

1. **Demo broken in production** — `vite build --mode gh-pages` emitted a 698-byte
   preload shim with no app entry; rolldown tree-shook the inline `<script type=module>`
   bootstrap. Four of six scenes blank at idle.
2. **Engine architectural debt** — 16 uncounted in-code TODOs (1 CRITICAL, 4 HIGH);
   fail-explicit invariant declared-but-not-honored (silent-identity easing on
   unresolvable name); three near-duplicate reduced-motion snap paths; group
   `reset()` `interpFrames(0,true)` fillBackwards was a self-described workaround;
   eager-resolve import had no `.catch`.
3. **Gate/proof narrowness** — `proof:boundary` proved only `SpringProgress` (5 of
   7 light entries unproven); committed lockfile was glass-ui-present, contradicting
   A.FINAL.md's "glass-ui-absent" claim.

**Two new invariants introduced:**
- **inv γ**: the demo cannot ship blank (CI smoke gate).
- **inv δ**: no page occludes on any viewport (scripted Playwright gate).

### 2.2 User prompts (B)

From B.md §Prompt-recap and the B.W0 audit:

| Prompt | Where recorded |
|--------|----------------|
| Update all deps to latest | `B.md §Prompt-recap P2` |
| 6-agent deep audit of plan + changes | `B.md §Prompt-recap P2` |
| Devise path forward / recap prompts+plans+precepts / gestalt / no-workaround | `B.md §Prompt-recap P2` |
| Delineate chronically-deferred + deferred, fold into B | `B.md §Prompt-recap P2` |
| Recap ALL prompts | `B.md §Prompt-recap P2` |
| NOT an implementation phase / dev only | `B.md §Prompt-recap P2` |
| Full e2e lighthouse + best-practices of every page | `B.md §Prompt-recap P2` |
| Pull latest precepts + sync constellation + before/after-screenshot edict | `B.md §Prompt-recap P2` |
| Remove the loading screen + dramatically improve loading times | `B.md §Prompt-recap P2` |
| 6 frontend-design agents audit design + glass-ui | `B.md §Prompt-recap P2` |
| Create next tranche with perfected CI | `B.md §Prompt-recap P2` |
| Audit every page desktop + mobile, NO occlusion/overlap, dock perfected, Playwright | `B.md §Prompt-recap P2` |

---

## 3. Per-prompt coverage status TODAY

Verified against the current tree (2026-06-09, commit `4072af9`).

### Tranche A prompts

| Prompt | Status | Evidence |
|--------|--------|----------|
| Execute Tranche A in full (W0–W5) | ADDRESSED | `A/PROGRESS.md`: all 6 waves landed; 3.0.0 released |
| 3.0.0 re-release | ADDRESSED | `package.json` was 3.0.0; current is 4.1.0 (since advanced through B→I) |
| Export RAFPlayback PRM gate | ADDRESSED | `src/animation/playback.ts` exports `RAFPlayback`; `A/PROGRESS.md` W4 |
| `npm publish --provenance` via changesets | ADDRESSED | `.github/workflows/release.yml` uses `npm publish --provenance --access public` |
| Publish 3.0.0 first | ADDRESSED | `A/PROGRESS.md` records v3.0.0 tag + SLSA provenance attestation |
| Gate release on green CI | ADDRESSED | `ci.yml` + `release.yml` gate chain (check:lib → build:lib → test → proof:boundary) |

### Tranche B prompts

| Prompt | Status | Evidence |
|--------|--------|----------|
| Update all deps to latest | ADDRESSED | `B/PROGRESS.md` W1; current `package.json` at 4.1.0 shows glass-ui `~3.9.0` + value.js `^0.11.2` |
| 6-agent deep audit (plan + changes) | ADDRESSED | `B/audit/plan-findings.txt` (46 findings) + `design-findings.txt` (43 findings) |
| Gestalt / no-workaround / architectural transpositions | ADDRESSED | B.W2: `withReducedMotion` gate, `RAFPlayback` driver, `settle`/`reset` contract, `parseOption` fail-explicit — each a net deletion |
| Delineate chronically-deferred, fold | ADDRESSED | `B.md §Deferred+chronically-deferred fold`; every A named-forward + 16 TODOs wave-assigned |
| Recap ALL prompts | ADDRESSED | `B.md §Prompt-recap` |
| NOT an implementation phase | ADDRESSED | B.W0 = dev-only; no engine source written in development |
| Full e2e lighthouse + every page | ADDRESSED | `B/audit/lighthouse/` + 18 BEFORE screenshots; real prod-perf measured in W4 |
| Pull latest precepts + before/after edict | ADDRESSED | Precepts now at `8ccf9f4` (`git ls-tree HEAD docs/precepts` → `8ccf9f4`); edict committed |
| Remove loading screen + improve loading | ADDRESSED | B.W4: inline bootstrap extracted → `main.ts`; splash removed; prod FCP ~1.0s |
| 6 frontend-design agents | ADDRESSED | `B/audit/design-findings.txt` (43 findings; 4 blockers) |
| Create next tranche with perfected CI | ADDRESSED | B.W6: demo-smoke + occlusion gates wired into `ci.yml` |
| Audit every page, NO occlusion, Playwright | ADDRESSED | B.W3 + `scripts/occlusion-gate.mjs` (inv δ); B.W6 wired into CI |

---

## 4. Deferral + chronic tracking (A/B born → terminal disposition)

### 4.1 Born in A

| Item | A disposition | Terminal home | Status |
|------|--------------|---------------|--------|
| `Worker`/`OffscreenCanvas`/`Atomics` engine path | `A.md §Folded-ledger` NAMED-FORWARD/note-only | `I/FINAL.md §6` PERMANENT-ARCHIVE | KILLED — no consumer A→I |
| Dev-only LoAF observer | `A/FINAL.md §5` named-forward (no wired consumer) | `B.W4` SHIPPED | CLOSED — B landed it (LoAF obs + bench consumer) |
| Playwright >50ms-trace gate | `A/FINAL.md §5` named-forward (not run) | `B.W3/W7` replaced by real occlusion+π harness | CLOSED — stub replaced |
| VAL-9 `--spring-*` token regen | `A/FINAL.md §5` BOOK → glass-ui adoption ask | `G` audit: OUT-2 LANDED in glass-ui 3.3.0 | CLOSED OUT — glass-ui owns; enabled by stable `springLinearStops()` |
| `ScrollTimeline` native replace | `A` grand-audit BOOK | `B/FINAL.md §Deferrals` KILL with rationale | PERMANENTLY KILLED — native API does not fit the JS sampler contract |
| `src/animation/CLAUDE.md` stale | `A.W0.3` | A.W0 — re-synced | CLOSED (A) |
| CI-break phantom "#177" | `A.W0.4` | A.W0 — issue #1 filed | CLOSED (A) |
| Silent-linear window / `EasingResolvable` | `A.W2` | A.W2 landed; B.W2 transposed to `easing.ts` + `resolveEasing` fail-explicit | CLOSED (A→B evolved) |
| `proof:boundary` only SpringProgress proven | `A.W3` landed SpringProgress only | `B.W2` widened to all light entries (self-enforcing barrel parse) | CLOSED (B) |
| Lockfile "glass-ui-absent" prose vs. reality | `A/FINAL.md` — incorrectly claimed "absent" | `B/FINAL.md §A-record-reconciliation §2` — honest disposition (b): tolerated dangling optional link | RECONCILED (B) |

### 4.2 Born in B

| Item | B disposition | Terminal home | Status |
|------|--------------|---------------|--------|
| φ-ladder leaf-tail migration (89 body sites) | `B/FINAL.md §Deferrals` DEFERRED to next demo-polish | `D.W2` consumption sweep (raw body rungs = 0) | CLOSED (D) — `D/FINAL.md:186` |
| Dual-serif formalization | `B/FINAL.md §Deferrals` DEFERRED | `D.W2` (φ-ladder sweep encompassed) | CLOSED (D) |
| `CSSCodeEditor` cartoon-shadow token | `B/FINAL.md §Deferrals` DEFERRED demo-polish | C named it; C.W2 closed one site; H.W9 collapsed the register | CLOSED (H) — `H/FINAL.md §W9 + proof:cartoon-shadow-unclipped` |
| Dock double-click / ASK-1 `useTouchGate` | `B/FINAL.md §Deferrals` glass-ui HANDOFF | `G.W12` removed the `:always-expanded` mask (glass-ui 3.3.0 owns the contract) | CLOSED OUT (G) — `G/FINAL.md:107-110` |
| VAL-9 / ASK-2 `--spring-*` codegen | `B/FINAL.md §Deferrals` glass-ui HANDOFF | `G` audit: OUT-2 LANDED in glass-ui 3.3.0 | CLOSED OUT (G) — `G/audit/_SYNTHESIS-deferred-ledger.md:200` |
| `proof:boundary` all-light-entries (was A coverage hole) | `B.W2` SHIPPED (self-enforcing barrel parse) | Current tree: `scripts/proof-boundary.mjs` + `ci.yml:101` wired | CLOSED (B) — still GREEN |
| `always-expanded` mobile mask residue | `B.W3/B.W6` honest mask pending ASK-1 | `G.W12` mask removed | CLOSED (G) |
| Lockfile inv β reconciliation | `B.W6` — disposition (b) honest | Current: `package.json:172-173` glass-ui in `optionalDependencies ~3.9.0` | STANDING — (b) is the permanent honest disposition |
| Before/after precept edict | `B.W0` authored + committed at `8ccf9f4` | Current: `git ls-tree HEAD docs/precepts` → `8ccf9f4` | CLOSED (B, confirmed live) |
| LoAF observer (A chronic) | `B.W4` SHIPPED (LoAF + bench consumer) | Current tree: in demo-smoke + bench | CLOSED (B) |
| Stale `A/waves/W4.md` group reduced-motion prose | `B/FINAL.md §A-record-reconciliation §1` | B FINAL supersedes; W2 shipped the real contract | RECONCILED (B) |
| Test count off-by-one (`261` vs `260`) | `B/FINAL.md §A-record-reconciliation §3` | Current: 683 passed + 2 expected-fail (685 total) | RECONCILED (B); counts advanced through G+H+I |
| CHRONIC: `ScrollTimeline` native | `B/FINAL.md §Deferrals` KILL | `B/FINAL.md §Deferrals` — permanent with rationale | PERMANENTLY KILLED |
| CHRONIC: `Worker`/`OffscreenCanvas` | `B/FINAL.md §Deferrals` PERMANENT-ARCHIVE | `I/FINAL.md §6` confirms — ARCH, do not re-litigate | PERMANENTLY KILLED |

---

## 5. Precepts and invariants first stated in A/B — carry-into-J checklist

### From A (first stated in A, carried through I, still active):

| Invariant | Origin | Current enforcement | J action |
|-----------|--------|---------------------|----------|
| **inv α** — boundary gated, not asserted | `A.md §A inv α` | `scripts/proof-boundary.mjs` + `ci.yml:101` | VERIFY-ONLY — must still bite |
| **inv β** — library build glass-ui-free | `A.md §A inv β` | `package.json:172` optionalDependencies; `ci.yml` library gates are glass-ui-free | VERIFY-ONLY — disposition (b) is honest |
| No perpetual punts (P-invariant-28) | `A.md §inherited` + `B.md` | Enforced by B→I deferred-ledger audits | CARRY — J must terminate every deferral |
| Substrate-without-consumer is binary | `A.md §inherited` | Enforced at each wave's overfitting audit | CARRY |
| No legacy / no backwards-compat shims | `A.md §inherited` | Enforced by ι sweep at each tranche close | CARRY |
| Baseline browser policy (Widely/Newly/Limited tiers) | `A.md §inherited` | README posture section; `proof:modern-web` | CARRY |
| Fail-explicit on library-internal contracts | `A.md §inherited` | `AnimationOptionError` + `UnknownEasingError` (B.W2) | CARRY |

### From B (first stated in B, carried through I, still active):

| Invariant | Origin | Current enforcement | J action |
|-----------|--------|---------------------|----------|
| **inv γ** — demo cannot ship blank | `B.md §B inv γ` | `scripts/demo-smoke.mjs` + `ci.yml` demo-smoke job | VERIFY-ONLY — must still bite |
| **inv δ** — no page occludes on any viewport | `B.md §B inv δ` | `scripts/occlusion-gate.mjs` + `ci.yml` | VERIFY-ONLY — must still bite (mask removed in G) |
| Before/after-every-page capture edict | `B.W0` + precepts `8ccf9f4` | `docs/precepts` submodule at `8ccf9f4` | CARRY — J must run at open + close |
| gate-ORACLE precept (correctness gates through the human surface) | Born I (but B planted the correctness gap precursor with B.W7 π visual-runtime) | `proof:live-session` + `proof:gate-is-runtime` | CARRY — I hardened B's precedent |

---

## 6. A/B fidelity defects propagated forward (known ledger drift)

Items where A's or B's own record was wrong at close — all reconciled by B or later:

| Defect | A/B record | Resolution |
|--------|-----------|------------|
| A/FINAL.md: "regenerated glass-ui-absent" lockfile | A.FINAL.md — incorrect | `B/FINAL.md §A-record-reconciliation §2` honest disposition (b) |
| A test count title "261" (body says 260) | A.md title | `B/FINAL.md §A-record-reconciliation §3` — 260 is correct base |
| A/waves/W4.md: group reduced-motion prose describes pre-publish behavior that was REVERSED | A.W4.md | `B/FINAL.md §A-record-reconciliation §1` — B.W2 contract supersedes |
| B.W5 marked "done" in PROGRESS but φ-ladder/serif/cartoon not fully met | `B/PROGRESS.md:22` | `C/audit/plan-findings.txt §4` named it; D.W2 + H.W9 closed it |
| B FINAL claimed LoAF observer had 2 consumers; one was a stub | `B/FINAL.md §overfitting LoAF row` | `C/FINAL.md §5` — C landed a real second consumer; no enduring gap |

---

## 7. Current tree verification (selected A/B claims, checked live)

| Claim | File:line | Live state |
|-------|-----------|------------|
| `EasingResolvable` retires 3 `.ready()` copies | A.FINAL.md §1 | Replaced by `easing.ts` `resolveEasing` (fail-explicit, no fallback): `src/animation/easing.ts:12` "This replaces the former EasingResolvable" |
| `internal/reduced-motion.ts` one detector | A.W4 | `src/animation/internal/reduced-motion.ts` exports `prefersReducedMotion` + `withReducedMotion`; `engine.ts:27`, `group.ts:2`, `smooth.ts:2`, `spring.ts:2` all import it |
| `scheduler.ts` `yieldToMain` | A.W4 | `src/animation/internal/scheduler.ts:40` exports `yieldToMain`; `group.ts:3` imports; `YIELD_BATCH=32` at `group.ts:76` |
| `internal/css-easing.ts` | A.W4 | **ABSENT** — replaced by `src/animation/springTimingFunction.ts` which embeds the tagging via `Easing.css` field; A's FINAL records this as `internal/css-easing.ts` but B.W2 transposed to typed `Easing` struct |
| `proof:boundary` widened to all light entries | B.W2 | `scripts/proof-boundary.mjs` — self-enforcing barrel parse; `ci.yml:101` wired |
| `demo-smoke.mjs` (inv γ) | B.W4/W6 | `scripts/demo-smoke.mjs` exists; `ci.yml` demo-smoke job |
| `occlusion-gate.mjs` (inv δ) | B.W3/W6 | `scripts/occlusion-gate.mjs` exists; `ci.yml` demo-smoke job |
| `grep TODO( src/animation` = 0 | B.W2 | Confirmed: `grep -rn "TODO(" src/animation/` → 0 results |
| glass-ui in `optionalDependencies` | A.W1/B.W6 | `package.json:172-173`: `"@mkbabb/glass-ui": "~3.9.0"` in `optionalDependencies` |
| Precepts at `8ccf9f4` | B.W0 | `git ls-tree HEAD docs/precepts` → `160000 commit 8ccf9f4da0198e02382e673f253fe96c2ed03034` |
| 683 tests pass | Current | `npm test`: 683 passed + 2 expected-fail (685 total) |

---

## 8. Summary verdict

A and B both CLOSED honestly. A's three boundary items all landed with hard gates and
survived into the current tree. B's debt transpositions are present (unified
`withReducedMotion`, `RAFPlayback` driver, `settle/reset` contract, fail-explicit
`parseOption`). The two new CI gates (inv γ, inv δ) are wired and currently enforced.

**Three items require J's attention (carry or re-verify):**
1. **inv β lockfile** — the "tolerated dangling optional link" disposition (b) is the
   permanent honest answer. J must NOT claim glass-ui-absent if the lockfile still
   records the optional dep. Verify `npm ci` on a glass-ui-absent runner still passes.
2. **ASK-1 dock double-click** — the `always-expanded` mask was removed in G.W12 per
   glass-ui 3.3.0; the occlusion gate must confirm the no-mask state holds on the
   current glass-ui pin (`~3.9.0`). A J hygiene item, not correctness.
3. **ASK-2 VAL-9** — LANDED in glass-ui 3.3.0, confirmed. No J action beyond noting
   the `springLinearStops()` enabler must remain stable.

No A/B item is an open perpetual punt entering J.
