# Tranche J · audit/precepts.md — THE consolidated precept register A→I + violations scan

**Lane:** precepts. **Method (inv ε):** every row carries a `file:line` or a re-runnable
command + observed output, verified against the **TREE at HEAD** (master, clean) and git — not
chained off prior FINALs. **Verdict headline:** the *source-hygiene* precepts (no-legacy,
boundary, dogfood, isomorphic-as-authored) hold in the tree. The *gate-regime* precepts I
installed (gate-ORACLE, two-tier taxonomy, "collapse the lattice") are **partially honored and
internally contradictory in the tree**: the 10-gate `proof:correctness` tier is real and
machine-enforced, but the "collapse the ~34 browser gates into ONE session" thesis was NOT
executed — the full H lattice (109 proof keys, incl. the localStorage-snapshot and self-baseline
proxy gates I FINAL indicted) survives, *relabeled* hygiene, and CI runs all of it gate-by-gate.
Two precepts are entirely **UNPOLICED** in the tree (props-destructuring; the
chrome-devtools-mcp debugging rule). Gate count **GREW** A→I (KISS tension, measured below).

---

## §1 — THE CANONICAL REGISTER (origin · statement · enforcement)

Numbered named invariants (Greek series) live in tranche FINALs; the user's standing English
mandates live in the prompt + MEMORY. "Enforcement" = the gate that polices it TODAY, verified
against `package.json`/`scripts/`/tree, or **UNPOLICED**.

| # | Precept | Origin (file:line) | Exact statement (quote / paraphrase) | Enforcement TODAY |
|---|---|---|---|---|
| P1 | **no-legacy** | user mandate (A→I); named `H/audit/a-precept-sweep.md:44` "clean replacement-in-one-motion" | "NO legacy code (no deprecated paths, compat shims, dead code, commented-out code, stale docs)" | `proof:no-deprecated-guard` (hygiene) + grep. **HOLDS**: `grep -rniE "deprecat\|legacy\|workaround\|hack\|FIXME\|TODO\(" src/ \| grep -v mandate` → **0**. |
| P2 | **no-workaround** | user mandate; `H/H.md:59-61` "neutralize a symptom at the wrong seam… weaker escape hatch" | "NO quick solutions, NO workarounds — idiomatic, gestalt approaches only" | **UNPOLICED as a precept** (no gate). Indirectly: `proof:engine-no-throw-on-play` killed the B1/B5 readout `try/catch` floor (I.W0). The floor *was* the workaround; it is gone (`grep "no CSS twin" src demo` → 0). |
| P3 | **idiomatic + gestalt** | user mandate; `I/PATH-FORWARD.md` un-fences engine | "Architectural transpositions for elegance, simplicity, performance are necessary AND desirable" | **UNPOLICED as a named gate**; realized per-wave (FSM bind-proof I.W1, `useRafScene` consolidation). |
| P4 | **isomorphic styling** | user mandate; `D/FINAL.md:103` inv η; `H/a-precept-sweep.md:56` P-02 | "Isomorphic styling changes (pixels unchanged unless deliberately befitting); KISS" | `proof:visual-lock` (RE-TIERED to **hygiene** at I.W7, `ci.yml:287` "correctness authority STRIPPED") + named `isomorphic` annotations in `design-idioms.css`. The pixel-truth oracle now lives in `proof:live-session` DOM asserts. |
| P5 | **KISS** | user mandate; `I/recap-precepts.md:204` "VIOLATED by the gate REGIME" | "the simplest possible oracle… would have caught B1–B9" | **UNPOLICED**; in tension with gate-count (§3-T1). |
| P6 | **inv α — boundary gated not asserted** | `A/FINAL.md:94` | "A claim about the static graph that no gate measures is not an invariant" | `proof:boundary` (hygiene). **HOLDS**: light modules `spring.ts`/`smooth.ts`/`numeric.ts` have 0 static value.js edge (grep → empty). |
| P7 | **inv β — library is glass-ui-free** | `A/FINAL.md:107` | "publishable artefact resolves zero `@mkbabb/glass-ui`" | dep layout: `package.json` deps = `{parse-that, value.js}` only; glass-ui pin `~3.9.0` lives in the demo block (`package.json:173`). HOLDS. |
| P8 | **inv γ — demo cannot ship blank** | `B/FINAL.md:47` | "the demo paints (the four blank scenes stay fixed)" | `scripts/demo-smoke.mjs` (CI). Superseded in authority by `proof:live-session`. |
| P9 | **inv δ — occlusion (no page occludes)** | `B/FINAL.md:52`; `C/FINAL.md:73` HARD | "zero dock-over-content overlap on any viewport; bite-proven" | `scripts/occlusion-gate.mjs` (CI, allowance EMPTIED at G.W12 per `D/FINAL.md:216`). |
| P10 | **inv ε — no overclaim** | `C/FINAL.md:4,93`; `I/FINAL.md:256` | "every MET gate has a re-runnable probe or file:line; the arbiter is the live demo, not paperwork" | The audit discipline itself; `J/audit/final-vs-tree-inv-epsilon.md` is the sibling lane re-checking I's FINAL. |
| P11 | **inv ζ — dogfood** | `C/FINAL.md:77`; `D/FINAL.md:215` | "the demo carries no hand-rolled rAF loop a shipped engine already is" | `proof:dogfood` (hygiene; allowlist). 3 raw `requestAnimationFrame` sites in demo, allowlist-gated. |
| P12 | **inv η — design-idiom owned** | `D/FINAL.md:103,220` | "every idiom resolves from the demo's OWN built CSS (rented idioms owned)" | `proof:idioms` (hygiene). |
| P13 | **inv-16 — consume published siblings, don't fork** | recurring A→I; `H/FINAL.md:89`; relaxed `F/FINAL.md:10`, `G/FINAL.md:184`; **un-fenced for engine** `I/PATH-FORWARD.md:124` | "kf consumes published siblings, never forks/patches a sibling" + I addendum: "`src/animation` is the kf PRODUCT — runtime correctness MAY require engine transposition" | glass-ui `~3.9.0` consumed published (lockfile resolves 3.9.0); value.js `^0.11.2` from registry. `proof:deps-current`/`proof:repin-witness`. HOLDS. (Tension §3-T2.) |
| P14 | **the gate-ORACLE precept** (I-born, charter invariant) | `I/recap-precepts.md:301-305`; `I/FINAL.md:15`; `PATH-FORWARD.md:97-101` | "A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME surface the human uses, error budget 0 across PLAY+SWITCH+DRAG; source/jsdom/snapshot/self-baseline/token/ledger = HYGIENE, may never count toward correctness" | `proof:gate-is-runtime` (machine-enforces it for the **correctness tier only**, `proof-gate-is-runtime.mjs:14-22`) + `proof:live-session` (the oracle). **STRUCTURALLY SOUND but scope-limited** — §2-F1. |
| P15 | **two-tier taxonomy (correctness / hygiene)** | `I/FINAL.md:77-89` | "exactly two aggregators; hygiene is CORROBORATING, may NEVER substitute for a red runtime clause nor count toward a correctness/chronic tally" | `proof:correctness` (10 gates) + `proof:hygiene` (~90 gates) in `package.json`. **PARTIALLY HONORED** — §2-F2 (proxy gates parked in hygiene; CI bypasses the two-tier split). |
| P16 | **P-invariant-28 — no perpetual punts** | `D/FINAL.md:177`; `H/FINAL.md:53`; `I/FINAL.md:183-208` | "every deferral gets a terminal home or a KILL" | `proof:chronic-closure` (REWIRED I.W7 to require a runtime gate that BIT, `proof-chronic-closure.mjs`). |
| P17 | **born-RED discipline** | `A/FINAL.md:129`; `H/FINAL.md:31`; reframed `I/recap-precepts.md:53` | "a gate must FAIL on the pre-fix tree and PASS on the post-fix tree" — I addendum: "born-RED is only as honest as its oracle; forbid born-RED against vaporware targets" | `proof:gate-is-runtime` + `proof:chronic-closure` (each cited gate witnessed born-RED on `b934a08`). |
| P18 | **dev/impl boundary** | `I/PATH-FORWARD.md:4-6`; `I/PROGRESS.md` frozen-dev header | "No source is fixed in the development phase. No commit is made." (the DEV-phase board is frozen) | Convention, **UNPOLICED by gate**. J is a DEV phase; this lane writes one doc, implements nothing. |
| P19 | **CI device-independence boundary** | MEMORY `feedback_chrome_devtools_mcp.md`; `I/PROGRESS.md` CI-on-Linux follow-up | "use chrome-devtools-mcp for live debugging; CI gates stay headless playwright-core" | `proof:live-session`/`proof:*-live` use serveDist + KF_PLAYWRIGHT_DIR chromium (headless). Convention, not gated. |
| P20 | **version-owner / user-domain publish** | `I/FINAL.md:235`; MEMORY deploy notes | "the changeset tier + npm publish are USER-DOMAIN — version owner Mike Babb, confirm-first" | Convention, **UNPOLICED**. `.changeset/tranche-h.md` PENDING/unconsumed; version still `4.1.0`. |
| P21 | **glass-ui-fixes-in-glass-ui** | MEMORY `feedback_glass_ui_root_changes.md`; `I/FINAL.md:223` | "all glass-ui/dock changes go in the glass-ui repo, never patched in the demo" | **UNPOLICED by gate** (was `proof:no-orphan-specular`, RETIRED I.W7). HOLDS in tree: the `::before{content:none}` suppression was REJECTED; only deletion-comments mention `glass-specular-track` (3 hits in `design-idioms.css`, all prose). |
| P22 | **props-destructuring rule** | MEMORY `feedback_props_destructuring.md` | "NEVER destructure defineProps() in script setup; use props.X or getter fns" | **UNPOLICED — and VIOLATED** in the tree (§2-F3). |
| P23 | **chrome-devtools-mcp for debugging** | MEMORY `feedback_chrome_devtools_mcp.md` | "use chrome-devtools-mcp for all live debugging/chrome tasks" | **UNPOLICED** (process rule, not gateable; record-only). |

---

## §2 — VIOLATIONS SCAN (one targeted check per precept)

### F1 · The gate-ORACLE precept is enforced for the correctness tier ONLY — hygiene proxies un-audited
**Check:** `head scripts/proof-gate-is-runtime.mjs` →
*"For EVERY wave's declared §Hard correctness `proof:*` gate (I.W0–I.W7), it asserts the gate's
SCRIPT (a) opens a browser… (c) is wired into proof:correctness"* (`proof-gate-is-runtime.mjs:14-22`).
The meta-gate verifies the 10 correctness gates ARE runtime. It does **NOT** verify that gates
parked in `proof:hygiene` are genuinely hygiene-class. So a proxy *runtime-shaped* gate can live
in hygiene unchallenged. **This is taxonomically permitted** (hygiene gates "may never count
toward a correctness tally" — and they don't, since `proof:chronic-closure` cites only correctness
gates). **But it leaves the door the I FINAL named: a hygiene-parked proxy looks authoritative.**
Severity **P2 / BOOK** — the design is sound; J should record that the meta-gate is one-directional
(it polices correctness-tier purity, not hygiene-tier honesty).

### F2 · "Collapse the ~34 browser gates into ONE session" was NOT executed — the lattice was RELABELED, gate count GREW
**Claim** (`I/PATH-FORWARD.md:103-104`): *"collapse the lattice of ~34 load-rest / wrong-projection
browser gates into ONE re-runnable interaction-driven session harness."*
**Tree:**
- `proof:live-session` was **ADDED** (965 lines, `git show --stat 1a708cf` → `proof-live-session.mjs | 965 ++`), not as a *replacement* of the 34 but **on top**.
- Net I.W7 script delta: **5 proxy scripts DELETED** (`proof-demo-console-clean` −211, `proof-dock-morph-settled` −159, `proof-dragscrub-single` −290, `proof-no-orphan-specular` −593, `proof-scene-icons` −875) + **2 ADDED** (`proof-live-session` +965, `proof-gate-is-runtime` +292). Confirmed deleted: all 5 absent from `scripts/` and `package.json` (grep → "key gone" ×5).
- **Gate count GREW, not shrank:** `proof:` keys in package.json: `107236d` (I.W0) = **103** → `1a708cf` (I.W7) = **109** → HEAD = **109** (`git show $c:package.json | count`).
- The proxy gates the FINAL indicted survive in **hygiene**: `proof:scene-machine-irrefragable` STILL round-trips localStorage (`grep -c localStorage scripts/proof-scene-machine-irrefragable.mjs` → **21**) and is in `proof:hygiene`; `proof:visual-lock` (self-baseline) is in `proof:hygiene`.

**Net:** the *correctness authority* was collapsed to 10 honest gates (real, good). The *lattice
itself* was not collapsed — it was relabeled and survives at full size. The KISS half of the I
thesis ("the simplest possible oracle") is unrealized at the script-inventory level: **93
`proof-*.mjs` scripts on disk** (`ls scripts/proof-*.mjs | wc -l`). Severity **P1 / FOLD** — J's
charter must decide: actually delete/merge the relabeled proxy lattice (honor the collapse), or
formally KILL the collapse claim and own the 109-gate hygiene corpus as deliberate. Do not inherit
the contradiction.

### F3 · props-destructuring rule VIOLATED — 6 live sites, UNPOLICED
**Check:** `grep -rnE "const \{[^}]*\} = defineProps" demo/ --include="*.vue"` → **6 hits**:
`AnimationMenuBar.vue:200`, `AnimationControlsGroup.vue:161`, `PlaybackRibbon.vue:86`,
`AnimationControls.vue:167`, `KeyframesEditor.vue:102`, `KeyframesStringControls.vue:49`.
These are Vue 3.5 **reactive props destructure** (vue `3.5.35`, `package.json:217`) — an official
Vue idiom *post*-3.5 — but the user's MEMORY rule (`feedback_props_destructuring.md`) explicitly
forbids it: *"NEVER destructure defineProps()… use props.X or getter fns for composables."* The
stated rationale is composable-reactivity-loss, which 3.5 reactive-destructure does NOT fully
resolve when a destructured prop is passed into a composable by value. **No gate polices this.**
Severity **P1 / FOLD** — J must either (a) gate + fix the 6 sites to `props.X`, or (b) consciously
RETIRE the rule given Vue 3.5 (a precept the charter resolves, not inherits). This is a textbook
"UNPOLICED precept → J gates it or retires it" finding.

### F4 · CI does NOT run the two-tier aggregators — it runs the full lattice gate-by-gate (taxonomy bypassed at the CI seam)
**Check:** `grep -cE "npm run proof:" .github/workflows/ci.yml` → **103** individual invocations.
`grep proof:all .github/workflows/ci.yml` → only a comment (`ci.yml:545`). `proof:correctness` /
`proof:hygiene` are **not** invoked as aggregators in CI; the gates are "DISTRIBUTED across the
library `gates` job and the `demo-smoke` job" (`proof-ci-coverage.mjs:24-27`). **Consequence:** the
two-tier *enforcement* (hygiene may never substitute for correctness) lives only in the LOCAL
`proof:all` chain; CI runs both tiers flat, and `proof:ci-coverage` requires every package.json
`proof:*` to be CI-invoked. So the "exactly two aggregators" story (`I/FINAL.md:77`) is the local
view; the deployed reality is the 109-gate flat run. Severity **P2 / BOOK** — not a correctness
hole (CI runs MORE, not less), but the taxonomy's *structural guarantee* (hygiene can't launder)
is not present at the CI seam where the deploy decision is made. J should either run
`proof:correctness && proof:hygiene` in CI (so the tier boundary is the CI contract) or record the
divergence as intentional.

### F5 · 4 H-era browser gates are in NEITHER local aggregator (CI-only) — `proof:all` ≠ CI gate set
**Check:** transitive walk of `proof:all` →
**orphans (not reachable from proof:all):** `proof:browser`, `proof:scene-control-dfa`,
`proof:scene-transition-perf`, `proof:dock-zorder`, `proof:lighthouse-mobile`, `proof:repin-safe`.
The first four are H-era gates still wired DIRECTLY in `ci.yml` (`ci.yml:321,337,826`). They are
**not** orphaned-and-dead — `proof:ci-coverage` CLAUSE 0 forces them to be CI-invoked, and
`proof:all`/`lighthouse-mobile`/`repin-safe` are RECORDED exclusions (`proof-ci-coverage.mjs:23-40`).
But it means a developer running `npm run proof:all` locally runs a DIFFERENT set than CI. Severity
**P2 / BOOK** — reconcile or document. (Note: `proof:scene-control-dfa` is the gate whose CI
timing-flake is the OPEN CI-on-Linux follow-up per MEMORY — a known live brittleness.)

### F6 · no-legacy / no-workaround / boundary / dogfood / glass-ui-locality — HOLD (counter-evidence)
- **no-legacy:** `grep -rniE "deprecat|legacy|workaround|hack|FIXME|XXX|TODO\(" src/ | grep -v mandate` → **0**. The 10 `//`-comment lines in src are all explanatory prose (e.g. `group.ts:137`, `engine.ts:714`), **not** dead code.
- **boundary:** light modules carry 0 static value.js edge (grep empty).
- **glass-ui-locality:** `::before{content:none}` suppression REJECTED; only deletion-comments reference `glass-specular-track`.
- **inv-16:** glass-ui `~3.9.0` + value.js `0.11.2` both PUBLISHED-consumed (lockfile from registry.npmjs.org). No `file:` siblings.
Record as the honored spine so J does not over-correct.

---

## §3 — CONTRADICTIONS / TENSIONS J's CHARTER MUST RESOLVE (not inherit)

**T1 · KISS (P5) vs the gate corpus.** I's recap-precepts named H's KISS violation as "88 proof
scripts… the simplest oracle would have caught B1–B9" (`I/recap-precepts.md:205`). I's *cure* was
"collapse the lattice into ONE session." **Tree reality:** 109 proof keys (UP from 103 at I-open),
93 scripts on disk. The collapse was authority-only; the inventory grew. **J must decide:** is the
honest end-state (a) `proof:live-session` + a thin hygiene set (actually delete the relabeled
proxies), or (b) own the 109-gate corpus and KILL the "collapse" language as aspirational? Inheriting
both ("we collapsed it" + 109 gates) re-opens exactly H's overclaim pattern (inv ε risk).

**T2 · inv-16 fencing (P13) vs I un-fencing the engine.** A→H: `src/animation` was FENCED (inv-16
"consume, don't fork" + the boundary gate treated the engine as near-sibling). I un-fenced it
(`PATH-FORWARD.md:124` "`src/animation` is the kf PRODUCT… correctness MAY require engine
transposition"), and touched `format.ts`/`group.ts`. **The contradiction:** is the engine a
consume-only SOTA kernel (the A→H posture, which made the gate-blindspot possible by treating engine
bugs as out-of-scope) or the editable product (the I posture)? J's charter must state ONE rule.
The un-fencing was correct for I; J must decide if it's permanent or I-scoped.

**T3 · the gate-ORACLE precept (P14) vs the surviving hygiene proxies (P15).** The precept says a
self-baseline / snapshot oracle "may never count toward correctness." Honored: `proof:visual-lock`
and `proof:scene-machine-irrefragable` are in hygiene, cited by no chronic. **But** they remain in
the suite, CI-run, green — and a future reader (or a future lazy close) can point at a green
`proof:scene-machine-irrefragable` as evidence the FSM "works," re-committing H's sin. The precept
forbids them *counting*; it does not forbid them *existing and looking authoritative*. J should
either delete them (T1) or annotate them in-script as NON-AUTHORITATIVE (some already are, e.g.
`ci.yml:287` for visual-lock — make it uniform).

**T4 · gate-is-runtime (P14) one-directionality.** The meta-gate enforces "correctness gates are
runtime." Nothing enforces "runtime-shaped gates are IN correctness." A genuinely behavioral gate
authored into hygiene by mistake would be silently demoted with no machine catch. Low severity, but
the precept's symmetry is incomplete.

**T5 · props-destructuring (P22) vs Vue 3.5 idiom.** The MEMORY rule predates Vue 3.5 reactive
props destructure. The tree uses the 3.5 idiom in 6 places. The rule and the platform now conflict.
J must resolve: re-affirm (fix 6 sites + gate) or retire (the platform absorbed the rationale). An
unresolved UNPOLICED rule with live violations is a P-invariant-28 risk (a perpetual ambiguity).

---

## §4 — DISPOSITIONS ROLL-UP

| Finding | Severity | Disposition |
|---|---|---|
| F2 lattice not collapsed; gate count grew | P1 | **FOLD** — J decides: delete proxies OR KILL the collapse claim |
| F3 props-destructure 6 sites, unpoliced | P1 | **FOLD** — gate+fix OR retire the rule |
| F1 gate-is-runtime one-directional | P2 | **BOOK** |
| F4 CI bypasses two-tier aggregators | P2 | **BOOK** — run `proof:correctness && proof:hygiene` in CI or document |
| F5 `proof:all` ≠ CI gate set (4 CI-only) | P2 | **BOOK** |
| F6 no-legacy/boundary/dogfood/inv-16 hold | — | **VERIFY-ONLY** |
| T1–T5 inter-precept tensions | varies | **FOLD into J charter** (resolve, don't inherit) |
| P19/P20/P23 process precepts unpoliced | BOOK | **RECORD** (not gateable) |

**Terminal reading.** I genuinely installed the gate-ORACLE precept and a machine to enforce it for
the correctness tier — the headline is real and the 10 actuating gates are honest. But the KISS half
("collapse the lattice") was not executed: the proxy corpus survives, relabeled, and the gate count
grew. The two precept tensions J's charter MUST resolve before any wave: (T1) finish the collapse or
kill the claim, and (T2/T5) state the permanent inv-16-engine boundary and the props-destructure
rule's fate. The source-hygiene spine (no-legacy, boundary, dogfood, inv-16) is honored in the tree
and should be recorded as the model, not re-litigated.
