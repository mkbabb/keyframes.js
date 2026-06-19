# The Constellation Lib-Perf + Grammar Campaign — M-driven, multi-repo

> **DEVELOPMENT PHASE ONLY.** This is the master plan synthesizing three deep fan-outs
> (the kf-M 32-lane re-audit · the cross-repo lib-perf + SOTA research · the CSS-grammar
> frontier research — 64 lanes, 66 agents, ~6.6M tokens, 2026-06-18). It is the blueprint
> the detailed wave specs expand. **No source is written by this doc.** The owner dissolved
> inv-16 for this campaign: ONE long-horizon session drives **keyframes.js, value.js, and
> parse-that totally** (all dev/frontend/tranche items); **fourier-analysis consumes later**.

## 0 — The convergent loop (where we are)

The owner chartered: *audit → research → plan → refine, iterated until each wave set is fully
formed and hardened.* Status: **audit + research COMPLETE** (this doc is the **plan**). The
**refine/harden** pass (adversarial review per tranche) follows the detailed authoring.

The campaign resolves one architectural gestalt across three repos:

- **parse-that** becomes the **pure parsing primitives** (a combinator/scanner hybrid). Its
  1,202-line CSS parser — stale "L1.75", **zero consumers** (verified) — is **removed**.
- **value.js** owns the **ONE canonical CSS grammar**, built on parse-that's primitives:
  2026+ spec coverage, *supersede-standard* (bounded), *fully bi-directional* (semantic
  idempotence), *SOTA-besting* perf, **subpath-split** (the 145 KB monolith dissolved),
  **color-math zero-alloc** — and the two **P0 Baseline-CSS crashes fixed first**.
- **keyframes.js M** is the **driver**: it consumes value.js's grammar + the subpaths,
  authors the missing born-RED gates, and adds the consume-side bundle gate.

## 1 — The locked decisions (the adjudicated cross-lane conflicts)

| # | Conflict | Decision | Rationale |
|---|---|---|---|
| D1 | session scope / inv-16 | **ONE session drives kf + value.js + parse-that totally** | owner fiat; fourier consumes later |
| D2 | CSS-grammar ownership | **parse-that = primitives only; value.js = the one grammar** | owner directive; parse-that's CSS parser has zero consumers + is stale |
| D3 | parse-that CSS parser | **DELETE** css/ (1,202 L) + its 5 tests (2,112 L) + the postcss/css-tree devDeps; **KEEP** json/csv as combinator examples | pure subtraction, no migration (value.js already has parallels in `src/parsing/utils.ts`); born-RED *absence* gate |
| D4 | packrat tier | **FIX, not KILL** — `MEMO` keyed on `getCijKey(p,state)` not `p.id` (the helper is already written); flip `memoize.test.ts` to the SOUND assertion | we own parse-that now; no-legacy = make it sound, don't leave dead-unsound code |
| D5 | "fully bi-directional" | **semantic idempotence** `parse(serialize(parse(s))) ≡ parse(s)`, value-normalized, applied to **every construct** (full meaning round-trip) | **owner-confirmed** ("small changes, not a massive re-write"): byte-lossless CST (comment/trivia preservation) is the rewrite — OUT |
| D6 | "supersede standard CSS" | **MODERATE** (owner): the bounded primitives (`spring()` easing, `colorSpace` round-trip, scroll `entry`/`exit`) **+ typed `@function`/custom value-functions + computed-value extensions** that lower to standard CSS | small surgical additions, NOT a new language; each round-trips + compiles down |
| D11 | CSS spec coverage depth | **comprehensive — latest + EXPERIMENTAL** (owner): full function support, full timeline + scroll-driven-animation grammar, nesting, `@layer/@container/@scope/@starting-style`, Color 4/5, `@property`, `if()`, `@function` | each a SMALL surgical addition; breadth in aggregate, KISS per item; verify-before-fold §6 still gates the browser-version claims |
| D7 | "best SOTA perf" | **SpanParser tagged-union** (V8 jump-table, escape megamorphic IC) + **monolithic byte-loop scanners** harvested from the deleted CSS parser before it goes | the removed parser already embodies the winning hybrid — keep the *technique*, drop the *grammar* |
| D8 | P0 `linear-gradient` fix site | **value.js-side** (explicit `any()` branches in `handleGradient`, localized) | the parse-that `leaf.ts:125` one-liner changes `all()` global semantics — record the `all()` drop-undefined footgun as a parse-that-A evaluation item, but don't ripple it for a P0 |
| D9 | M scope (split?) | **M stays ONE coherent tranche** — no split | the design/demo-perf additions are BC-gated new waves, not a separate tranche; the 5-band DAG stays acyclic |
| D10 | glass-ui consume target | **BB 4.1.0 → the BC cut** everywhere; the F-2 peer-widen **already fired** (4.0.1 published 2026-06-18) | 4.1.0 never published (E404); BB closed at 4.0.1; BC is the active tranche |

## 2 — parse-that · Tranche A (founding — primitives only)

parse-that has no tranche system; **A** is its founding tranche. Repo: `parse-that/typescript`.
(Rust core is already hardened; this is the TS port.)

| wave | scope | born-RED gate |
|---|---|---|
| **A.W0** | manifest hygiene (ships FIRST, 0.9.1): fix the stale `typesVersions` → missing `.d.ts` (a live TS7016 bug); add `sideEffects:false` | a consumer resolves types from the subpath; tree-shake honored |
| **A.W1** | **CSS-parser removal** (D3): delete css/ + its tests + postcss/css-tree devDeps; clean `parsers/index.ts`; **harvest** the monolithic byte-loop scanner *technique* into the core before deletion | `proof:no-css-surface` — the built `index.d.ts` has zero `cssParser`/`MediaQuery`/`parseSingleValue`… symbols |
| **A.W2** | **packrat (id,offset) FIX** (D4) | `memoize.test.ts` SOUND assertion flips green (born-RED today) |
| **A.W3** | **subpath split** (`./core ./diagnostics ./packrat ./utils`) + `SpanParser` tagged-union (V8 jump-table, future-research §7) | a TS CSS bench shows `SpanParser` dispatch ≥10% over the `regexSpan` baseline; subpath import resolves |

**Disposition of the orphaned API** `parseSingleValue`/`parseFunctionArgs`: removed from the
root barrel with the CSS parser (no consumer exists) — confirm against value.js-O's needs first.
→ **parse-that 0.10.0** (the CSS surface leaves the public API = a contracting change).

## 3 — value.js · Tranche O (the canonical grammar + lib-perf)

Greenfield (`docs/tranches/O/` absent). Library-only. **P0-crashes-first**, then the headline
subpath split, then grammar + perf. (Confirm value.js's N close / v1.0.0 sequencing at authoring.)

| wave | scope | born-RED gate |
|---|---|---|
| **O.W0** | **the two P0 crashes** (D8): `linear-gradient(red,blue)` (explicit `any()` branches, `parsing/index.ts:188-207`) + CSS Nesting (a recursive nested-rule arm in `stylesheet.ts`, per CSS Syntax L3 "invalid nested rule is ignored, not fatal") | `proof:css-parity` (NEW): `parseCSSValue('linear-gradient(red,blue)')` does not throw; `parseCSSStylesheet('.a{ .b{} }')` returns nested structure |
| **O.W1** | **subpath split** structural pre-work: sever the `units/index.ts:1` parse-that edge; lazify `parseCSSValue`; author the multi-entry `vite.library.ts` (glass-ui pattern) | typecheck holds per step |
| **O.W2** | **subpath build + exports map** (`./color ./parsing ./math ./easing ./transform ./units ./quantize`) + `sideEffects` | `proof:subpath-budget` — importing `./color` pulls **zero** parse-that / `@keyframes`-grammar modules into the graph |
| **O.W3** | **color-math zero-alloc**: gamutMap scalar-bisection rewrite (highest ROI), `transformMat3Into` out-param + module-scoped scratch `Vec3`, JND early-exit | `proof:gamut-alloc` (MEASURE-FIRST born-RED): `< N` `Color` allocs per `mixColors` call (baseline measured first) |
| **O.W4** | **2026+ grammar — comprehensive incl. EXPERIMENTAL** (D11; verify-before-fold §6): **full function support** (all value functions `calc/clamp/min/max/round/mod/rem/abs/sign/…`, color functions, `if()`, `@function` custom functions), recursive at-rule bodies (`@media/@layer/@container/@scope/@starting-style`), nesting, Color 4/5, `@property`, system colors, `sibling-index()/-count()`, `contrast-color()` — each a SMALL addition | per-feature born-RED: each construct parses to typed structure AND round-trips (`@layer base{ @keyframes fade{…} }` → `extractKeyframes` finds `fade`) |
| **O.W4b** | **full timeline + scroll-driven-animation grammar** (D11, owner): `animation-timeline`, `scroll()`, `view()`, `@scroll-timeline`/`view-timeline`, `animation-range`, `entry`/`exit`/`cover`/`contain` ranges — the grammar kf's `scroll-scene.ts` rides | each timeline/scroll construct parses + round-trips; kf consumes the typed forms |
| **O.W5** | **supersede (MODERATE) + bidirectional** (D5/D6): `spring()` easing syntax, `colorSpace` round-trip, typed `@function`/custom value-functions, computed-value extensions that lower to standard CSS; the semantic-idempotence invariant + a property-based round-trip harness over the WHOLE grammar; fix `FunctionValue.toString()` `linear()` stop spacing | `proof:round-trip-idempotent` — fuzzed values across every construct satisfy `parse(serialize(parse(s)))≡parse(s)` |
| **O.W6** | **SOTA perf** (D7): the combinator/scanner-hybrid hot paths (SpanParser tagged-union consume + monolithic scanners) + the kf color-interp co-bench | a CSS-parse bench hits the target MB/s (set after baseline); no regression |

**NOW IN-SCOPE (owner — "latest + experimental"):** `if()`, `@function`, full function support,
the full timeline/scroll grammar — each a small surgical addition (O.W4/O.W4b). Anchor-positioning
& view-transitions enter as **grammar-completeness** sweep items (parse + round-trip; small, even
though kf doesn't consume them yet). **OUT (the rewrites KISS rules out):** a full author-time
superset *language*; a byte-lossless CST (comment/trivia preservation). Recorded, not dropped.

## 4 — keyframes.js · Tranche M (the driver — reconciled)

M is **coherent, no split** (D9). The 32-lane re-audit found the waves largely sound; the
reconciliation is targeted edits + new design waves + the constellation re-target.

**Sound, keep:** M.W1 (✅ implemented — a **bridge**, retires at M.W3 per inv-M-one-runner;
add the `DM-W1-bridge` ledger row), M.W4, M.W5, M.W6, M.W7 (all Band-B breaches re-confirmed live).

**Targeted revises:**
- **M.W0** — author `proof:audit-artifacts-M`; fold the reorientation into M.md (re-target BB→BC; add the design band + measured-paint gate rows); narrow the dev→impl witness to exclude the n-stage demo commits.
- **M.W2** — route the rolldown-needing boundary assertions (entry-set, dynamic-chunk) to a vitest meta-unit, not depcruise.
- **M.W3** — vitest 4.x: `@vitest/browser-playwright` (not `@vitest/browser`).
- **M.W8** — **the deploy unblock fired early**: glass-ui 4.0.1 (peer-widened, published today) clears `proof:peer-satisfied` via a **lockfile update now**; the aria/RF-17 workaround-deletions move to the **BC cut**. (Note the *second* live blocker: `keyframes-vue-published` — USER-DOMAIN. "Sole blocker" was an overclaim.)
- **M.W9/W10** — consume value.js-O subpaths + the parse-that-A **sound** packrat (retire the KILL framing); fix the W96 scan scope to HEAVY modules.
- **M.W11** — band C→**A+C**: author `proof:css-parity` **now** (Phase-1 Band-A gate, born-RED on 0.13.0); the cure lands on value.js-O publish.
- **M.W12** — split out **demo-perf** (lighthouse per scene, critical CSS, content-visibility, BC.W-LIGHTHOUSE) as a new wave.
- **M.W13** — soften the VJ-L1 hard-gate (may open scoped to exclude the Symbol-stamped paths).
- **M.W14** — DM-2 GlassControlPoint → **BUILD-IN** `DemoControlPoint` (resolve the dual fork).
- **M.WZ** — re-target the deploy gate to BC; split it into the peer-widen-4.0.1-FIRED arm + the BC-gated arm; fold the design/demo-perf close criteria.

**New waves (the homeless reorientation band):** **M.W-DESIGN-PAINT** (born-RED pixel-readback
gate over the demo scenes — `inv-M-observable-truth` made visual, BC-gated) and **M.W15**
(demo-perf). **KF-OSCILLATOR publish-confirm** gets a Band-C row.

**Author the absent born-RED gates NOW** (kf-internal, gate-first law): `proof:css-parity`,
`proof:packrat-sound` (→ consumes A.W2), `proof:morphsvg-consume`, the `proof:boundary` W96
parse-that-scan, the **consume-side bundle gate** (a consumer eagerly importing the LIGHT
surface must not drag the HEAVY engine — the generalized "atlas" finding).

**Housekeeping:** extend `prompt-recap-M.md` + the deferred ledger with the post-charter events
(N excursion, the reorient pivot, "stop stopping", this re-audit, the M.W1-implemented fact);
add the **N Stage** HANDOFF row (shelved for BC dock sequencing); **gitignore `.wf-fix.js`**
(it is a workflow-orchestration artifact, not source); sync DM-21/22/23 into PROGRESS.md.

## 5 — The acyclic execution DAG + multi-repo discipline

```
parse-that A.W0 (0.9.1 manifest)  ─┐
parse-that A.W1 (CSS removal)      ├─►  value.js O.W0 (P0 crashes)  ─►  O.W1/W2 (subpath)
parse-that A.W2 (packrat FIX)      │                                       │
parse-that A.W3 (subpath+SpanU) ───┘                                       ▼
                                          value.js O.W3 (zero-alloc) · O.W4/W5/W6 (grammar/perf)
                                                            │
                                                            ▼
                              keyframes.js M.W9/W10/W11 (consume + gates) · M.W8 (deploy: 4.0.1 now)
                                                            │
                                                            ▼
                                          fourier-analysis (consumer — LATER)
```

**Discipline:** consume-published-not-branches; each repo drives to its **own green CI**; at a
cross-repo edge, publish then re-pin (atomic re-pin + workaround-deletion in ONE commit); the
npm-publish + version-cut legs stay **USER-DOMAIN**. parse-that A.W0 ships first (lowest risk);
value.js O.W0 (the P0 crashes) unblocks kf's `proof:css-parity`; the subpath split is the
through-line that shrinks every downstream consumer.

## 6 — The verify-before-fold ledger (informed-basis discipline)

The informed-basis critics caught one **hallucinated** citation (the COFb / "Continuous Oklab
Fallback" arXiv paper — **rejected, never folded**) and a batch of **unverified-but-plausible**
SOTA references. The following must be **verified against caniuse/MDN/the live spec before any
wave locks** — they are leads, not facts:

- browser-version claims: `contrast-color()` (Chrome 147?), `@function` (Chrome 141?), `sibling-index()/-count()` shipping status, the CSS Snapshot 2026 stability tiers.
- technique citations: the simdjson paper (Langdale-Lemire), the v8.dev scanner blog, rowan/red-green-tree lossless-CST refs, the CSSOM serialization spec, csstree v2, postcss `raws`. (Most are real but unverified in-session — confirm before relying.)
- the `@texel/color` "5–125× faster" perf claim — benchmark independently, don't quote.

## 7 — Next (the refine/harden pass)

1. **Author** (file-disjoint fan-out): expand §2–§4 into full wave specs per repo — parse-that A,
   value.js O, the kf-M reconciliation edits — each wave with its born-RED gate authored over the
   REAL observable.
2. **Harden** (adversarial fan-out): per-tranche review for completeness, falsifiable gates,
   no-legacy, KISS, the verify-before-fold discipline, DAG acyclicity — iterated until each wave
   set is fully formed.
3. Then, on explicit authorization, the **implementation** phase opens in DAG order.

## 8 — Implementation findings (the DAG, executing 2026-06-19)

The implementation phase is authorized and underway. Findings that revise the locked
decisions — each surfaced by executing against the REAL observable, the discipline §6 exists
to enforce:

### parse-that Tranche A — ✅ CLOSED + PUBLISHED `@mkbabb/parse-that@0.11.0`

- **D4 REVISED — the packrat "surgical key-swap" is algorithmically unsound.** Swapping
  `MEMO.get(p.id)` → `MEMO.get(getCijKey(...))` (D4's "the helper is already written") makes
  the soundness test pass but BREAKS left-recursion: the id-only MEMO seed is the load-bearing
  recursion-breaker, and `.trim()` shifts the re-entry offset so position-keying misses the
  seed → unbounded recursion. The original packrat author had flagged exactly this. The CORRECT
  fix — the full **Warth-Douglass-Millstein packrat-with-left-recursion** (position-keyed
  seed-grow + in-progress LR marker + a general multi-occurrence ε rule) — landed, was
  stress-tested (200 iters, n≤24) and adversarially re-verified. D4's *intent* (sound packrat,
  no dead-unsound code) holds; its *mechanism* ("surgical swap") was wrong.

- **D7 PARTIALLY FALSIFIED — the SpanParser tagged-union is SLOWER on V8/TS.** The tagged-union
  arm of D7 ("V8 jump-table, escape megamorphic IC") was implemented faithfully and MEASURED:
  **~10–14% slower** than the closure span combinators across three workloads (independent
  adversarial re-run: −14%). V8's monomorphic-per-call-site closure dispatch with inlining beats
  the recursive switch — the OPPOSITE of the Rust `enum`-vs-`Box<dyn>` regime that motivated §7.
  Retired from parse-that's public surface (kept module-internal as the BBNF-codegen data
  foundation). **The monolithic byte-loop scanner arm of D7 STANDS** (it's a different mechanism,
  already validated: the harvested `skipWhitespace`/`skipBlockComments` + the −32% bundle).
  `future-research.md §7` re-scoped from "perf" to "codegen foundation."

- **Gate correction (inv-M-observable-truth in action).** The A.W1 `proof:no-css-surface` gate
  as charted grepped `dist/index.d.ts` — but the barrel re-exports via `export *`, so CSS symbols
  live in `dist/parsers/css/*.d.ts`, never inlined in `index.d.ts`; the gate would have passed
  GREEN with the CSS parser still shipping. Corrected to observe the bundled runtime surface.

- Final: 0.9.1 (W0 manifest) → 0.10.0 (W1 CSS-removal, −32% bundle) → 0.11.0 (W2 WDM packrat +
  W3 subpath split). All gates GREEN, 108 tests, tsc 0. value.js re-pins `^0.11.0` at O.W2.

### value.js Tranche O — recon CONFIRMED (P0 sites live), implementation NEXT

- Both P0 crashes reproduced live on 0.13.0: `linear-gradient(red,blue)` → `TypeError` (the
  `all()` drop-undefined footgun at the `any(...).opt()` site, `parsing/index.ts:191`), CSS
  Nesting → `ParseError` (top-level-only `stylesheetItem`, `stylesheet.ts:501`). `linear()`
  stop-spacing wrong (`units/index.ts:184`). O.W0 spec drift noted: the `ValueArray` constructor
  in its pseudocode does not exist (use the existing array→`FunctionValue` pattern); `linear()`
  S3 is O.W0 (O.md §4's "O.W5" reference is stale). value.js src/ clean; ships O.W0 as patch 0.13.1.
