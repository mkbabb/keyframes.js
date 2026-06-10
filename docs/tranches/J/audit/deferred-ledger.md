# Tranche J audit — LANE: the consolidated deferred / chronic ledger A→I

**Scope.** The single load-bearing fold-mandate lane: every deferred / chronic / BOOK /
HANDOFF / OPEN item the A→I tranches surfaced, re-dispositioned against the TREE TODAY
(`master` tip `4072af9`, clean working tree, 2026-06-09). Read-only. Every row carries a
`file:line` or a `command + observed output`. This is the input the orchestrator folds into J.

**Method.** Chained the canonical I ledgers (`I/PROGRESS.md §4 / §4a–4f`, `I/FINAL.md §6`,
`I/audit/recap-deferred.md`, `I/audit/recap-chronic.md`) + the prior terminal ledgers
(`D/audit/deferred-ledger.md` = "the terminal home", `E/audit/deferred-ledger.md` = the
clean-ledger claim), then VERIFIED each live state first-hand against the tree, the installed
`node_modules`, `package.json`, and git. **Do not trust the FINALs — verify the tree.**

**Disposition vocabulary (J):** FOLD · BOOK(-reaffirm) · KILL(-reaffirm) · OUT · VERIFY-ONLY
(claimed-done, J only re-verifies) · RECORD.

---

## §0 — HEADLINE VERDICT

The I close's §6 P-invariant claim ("every carry exits with a terminal I disposition; no
perpetual punt") is **substantially TRUE against the tree** — the two fictional H handoffs
(B1 empty-input, B7 vaporware specular) genuinely LANDED, value.js `0.11.2` is published +
consumed (`parseCSSValueUnit("") => {value:0}`, no throw), glass-ui `~3.9.0` is consumed, the
5 H proxy gates + the `specular-handoff` IOU are ABSENT from `package.json`, and the
twice-deferred DC-8 was RESTORED (not punted) via a LIVE `startViewTransition` consumer.

BUT three classes survived the close uncovered:

1. **The post-merge CI/deploy tail (8 commits `a4b1472..4072af9`)** opened a NEW chronic the I
   FINAL does not own: `scene-control-dfa` is "STILL OPEN" (`I-WZ-verify.md:344-348`), the
   underlying defect is a REAL product lag, and auto-deploy is blocked. *(Owned in depth by the
   sibling `wave-I.WZ-postclose.md` lane; I record it here as the single net-new CHRONIC born at
   the I close, and defer the P0 mechanics to that lane.)*
2. **The value.js / parse-that / engine BOOKs** are all correctly OPEN sibling-HANDOFFs or
   net-new feature-adds — verified unchanged in the tree (no `parseLinearStops`, no
   `getPointAtLength`, no `lerpArray`, async `advanceTo` still async, unbounded
   `tryParseCache`). These are CHRONIC-by-design (the re-pin process working) and should
   BOOK-reaffirm, NOT manufacture J waves — EXCEPT where J explicitly elects a feature.
3. **CLAUDE.md is rotted** — claims "test/ — 15 files, 261 tests"; the tree has **71 top-level
   test files** (`ls test/*.test.ts | wc -l`). A no-stale-docs precept violation that J must fold.

**The chronicity flag (deferred ≥2 tranches — J MUST fold or KILL-with-reason):** DC-8 (A→I,
NOW closed), C-6 engine ceiling (D→I, gated), value.js C-1 next-slice (chronic-by-design),
SoA `lerpArray` (E→I), MorphSVG (C→I), intrinsic-size (E/F→I). All survive with a TERMINAL
home below; none is a silent perpetual punt — but the engine BOOKs have now ridden ≥3
tranches as MEASURE-FIRST/BOOK and J should either author the named probe-first or KILL them.

---

## §1 — THE CONSOLIDATED LEDGER (item · born · chronicity · last disposition · TREE state · J)

Chronicity = number of tranches the item was (re-)deferred across. **★ = chronically deferred
(≥2 tranches) — J fold-or-KILL mandate applies.**

### A — The crash / live-defect chronics (CH-1..CH-10 / B1–B9 + K) — VERIFY-ONLY (claimed CLOSED)

| Item | Born | Chronicity | I disposition | TREE state TODAY | J |
|---|---|---|---|---|---|
| **CH-5 / B1+B5** `"......"` empty-value crash ★ | A(W0)→H | A,H,I (3) | FOLD I.W0 + value.js publish | `parseCSSValueUnit("") => {value:0}` no throw (node probe, value.js 0.11.2 installed); `format.ts` serialize-from-template (`group.ts:48` no-op transform field); gate `proof:engine-no-throw-on-play` present | **VERIFY-ONLY** — re-run the gate on built dist |
| **CH-6 / B2** `_gen` DFA suspend crash | H | H,I (2) | FOLD I.W1 | bind-proof RAFPlayback + `useRafScene`; `proof:fsm-suspend-resume-live` present | **VERIFY-ONLY** |
| **CH-7 / B4** lost easing editor | H | H,I (2) | FOLD I.W2 | unified `EasingEditor` (`demo/@/components/custom/EasingEditor.vue` present); `proof:easing-editor-live` present | **VERIFY-ONLY** — BUT see scene-control-dfa lag (§2) which partially undercuts the I.W2 single-authority claim |
| **CH-8 / B3** amiga floats | H | H,I (2) | FOLD I.W3+W4 | subject=pivot geometry; `content-visibility` shed; `proof:amiga-subject-is-pivot` present | **VERIFY-ONLY** |
| **CH-9 / B6** square drag selects/no-persist | H | H,I (2) | FOLD I.W4 | shared `useDragScrub`; `proof:drag-gesture` present | **VERIFY-ONLY** |
| **CH-10 / B9+K** dev ENOENT icon + title | H | H,I (2) | FOLD I.W5 | one build root, `<title>keyframes.js</title>`, `proof:icon-paint-live` present | **VERIFY-ONLY** |
| **CH-1 / B7** specular sheen ★ | D(D14)→H | D,H,I (3) | FOLD I.W6 (consume-edge) | glass-ui `3.9.0` installed (`node_modules` confirms); `proof:specular-absent-at-rest` present; `proof:specular-handoff` DELETED (0 in pkg) | **VERIFY-ONLY** |
| **CH-2** φ-hero typography | D(D7) | D,H,I | RE-AFFIRM (genuinely closed) | not re-flagged; corroborated by live-session body-typography leg | **RECORD** (do not re-litigate) |
| **CH-3** mobile architecture ★ | D(D10) | D,H,I (3) | FOLD via perf+drag gates | M1/M2/M3 fold into `proof:perf-frame-budget`+`proof:drag-gesture` | **VERIFY-ONLY** |
| **CH-4** dock (D5 lag + D9 popover) ★ | D(D5/D9) | D,H,I (3) | RE-AFFIRM D5/D9; felt-dock → B1+M3+perf | `proof:perf-frame-budget` present; `proof:dock-popover-opens` in hygiene | **VERIFY-ONLY** |

### B — The fictional-handoff prime folds (the headline I fix) — VERIFY-ONLY

| Item | Born | Last disposition | TREE state TODAY | J |
|---|---|---|---|---|
| **value.js empty-input contract** (B1 value-half) | I (net-new ask) | LANDED + PUBLISHED 0.11.2 (`e473447` re-pin) | `package.json: @mkbabb/value.js ^0.11.2`; installed 0.11.2; contract holds (node probe) | **VERIFY-ONLY** |
| **glass-ui specular consume-edge** (B7) ★ | H (born-RED vs vaporware 3.8.0) | LANDED — published 3.9.0, consumed, gated by pixels | pin `~3.9.0`; installed 3.9.0; `::before{content:none}` workaround REJECTED | **VERIFY-ONLY** |

### C — DC-8 — the twice-deferred dead-CSS — VERIFY-ONLY (terminally closed, RESTORE)

| Item | Born | Chronicity | Last disposition | TREE state TODAY | J |
|---|---|---|---|---|---|
| **DC-8** scene-swap VT dead-CSS ★ | A | A,C,(D),H,I (≥4) | I.W5 RESTORE (no fourth defer) | `startViewTransition` is LIVE: `demo/app/useSceneTransition.ts:2` imports from `@mkbabb/glass-ui/motion-core`, called `:32`; `App.vue` `view-transition-name: scene-subject`. NOT dead → RESTORED. P-invariant fourth-defer prohibition HONORED | **VERIFY-ONLY** — the one chronic A→I that finally terminated |

### D — Sibling HANDOFFs (value.js / parse-that / glass-ui) — BOOK-reaffirm / OUT

| Item | Born | Chronicity | Disposition | TREE state TODAY | J |
|---|---|---|---|---|---|
| **C-1 value.js next-slice** (VJ-1..VJ-9) ★ | C | C,D,E,F,G,H,I | CHRONIC-by-design (re-pin process) | `parseLinearStops`=undefined, `getPointAtLength`=undefined in 0.11.2 (node probe) → OPEN, correctly sibling-owned | **BOOK-reaffirm / OUT** — rides next re-pin, ZERO kf edit. NOT a J wave |
| **VJ-4 / MCI-5** identity-pad witness | C | — | value.js-HANDOFF; the `it.fails` IS the consume signal | `test/interpolate-anything.test.ts:256` `it.fails(` still present (GREEN = not consumed) | **BOOK-reaffirm** — flips RED on land, no J gate owed |
| **PT-1 parse-that `(id,offset)` packrat re-key** | G(LD-PT) | G,H,I | parse-that-HANDOFF; author `proof:packrat-position` FIRST | parse-that `^0.9.0` installed; WITHHELD, zero prod consumers | **OUT** (sibling), BOOK the kf gate-first note |
| **GH-4 / FB-4 `{types}` directional VT** | G | G,H,I | glass-ui-HANDOFF (BOOK); folds IF J elects scene interactivity | glass-ui-owned; demo VT consumer EXISTS (`useSceneTransition.ts`) but no `{types}` directional pass | **BOOK** — fold only if J elects D11/FB-4 |
| **G-3 LabeledField orientation** | G | G,H,I | glass-ui-HANDOFF (HIGH); kf demo-side `grid-cols-[auto_1fr]` exists | glass-ui-owned | **OUT** (sibling) |
| **glass-ui typography opt-in ASK** | I | I (new) | coordination ASK to AX (the durable opt-out) | kf reclaim LIVE at `demo/@/styles/style.css:113` `--font-stack-text` override; the opt-in is a glass-ui-side flag | **OUT** (glass-ui AX) — kf edge already holds |
| **dock double-click** (memory) | (pre-A, glass-ui root) | recurring | glass-ui root fix (2026-04-04 + AT touch-gate) | demo-side `AnimationMenuBar.vue:106` is now plain `@click="emit('togglePlay')"` (the transition-intercept workaround gone) | **OUT** (glass-ui root); **VERIFY-ONLY** the demo no longer carries a workaround |

### E — Engine / perf BOOKs (net-new scope) — BOOK-reaffirm (★ ones need J terminal pressure)

| Item | Born | Chronicity | Disposition | TREE state TODAY | J |
|---|---|---|---|---|---|
| **FB-1 animation-composition HONORING** | F | F,G,H,I | BOOK (engine, un-blocked) SHIP-if-elected | no WAAPI `composite` honoring in `waapi.ts`/`group.ts` (grep); CAPTURE-only | **BOOK-reaffirm** — fold only if elected |
| **FB-2 async sync-step half** ★ | F | F,G,H,I | MEASURE-FIRST — build `proof:event-ordering` first | `engine.ts:840 async advanceTo`, `group.ts:469 async advanceTo` (still async) | **BOOK-reaffirm** — author the probe in J or KILL (≥4 tranches deferred) |
| **SoA `lerpArray`** ★ | E(G-2) | E,F,G,H,I | MEASURE-FIRST | no `lerpArray` in `src/` (grep = 0) | **BOOK-reaffirm** — ≥5 tranches; J should KILL-reaffirm unless a bench bites |
| **FB-3 MorphSVG consumer** ★ | C(C-5) | C,F,G,H,I | BOOK + value.js-HANDOFF (needs VJ-F1) | `fromDrawSVG` landed (`draw-svg.ts:121`); no `getPointAtLength`/`fromMorphSVG` (gated on value.js) | **BOOK-reaffirm** — the one real competitor gap; gated on value.js sampler |
| **FB-5 intrinsic-size `0→auto`** | E/F | E,F,G,H,I | BOOK (guarded-enh) + value.js-HANDOFF — VERIFY Baseline first | no `interpolate-size`/`calc-size` path (grep = 0) | **BOOK-reaffirm** — VERIFY Baseline 2026-06 first |
| **FB-6 Mod+K palette** | F | F,G,H,I | BOOK (demo, LOW) — decide owner | only a CSS ref; no `CommandPalette`/`cmdk` component | **BOOK-reaffirm** — decide owner or KILL |
| **VJ-F2 / LD-DIAG diagnostics sink** | F | F,G,H,I | BOOK (kf seam) + value.js-HANDOFF; cross-ref B1 | `ResolvedKeyframes` exists (`adapter.ts:18`) but NO `diagnostics` field | **BOOK-reaffirm** — folds with VJ-5 sink |
| **C-6 engine line-ceiling watch** ★ | D | D,E,F,G,H,I | RECORD + GATE; I.W0 respects ceiling | `engine.ts` = **1375** lines (`wc -l`); ceiling 1400 (`proof-decomposition.mjs:132 cap: 1400`, `proof-engine.mjs:64`); group.ts 810 (raised 800→820 per `ebcc79f`) | **VERIFY-ONLY** — gated, 25 lines headroom |
| **tryParseCache eviction** (=F3/VJ-7) ★ | C(C-3)/F | C,F,G,H,I | value.js-gated bound (VJ-7) | `utils.ts:203` unbounded `Map`, `.set` `:267`, NO LRU/eviction | **BOOK-reaffirm** — bound lives in value.js (VJ-7); kf BOOK |
| **managed-pause doc** | D | D…I | BOOK (state the contract once) | NOW DOCUMENTED — `src/animation/CLAUDE.md` "Managed-child lifecycle (the one contract)" + `sequence.ts:153,480,526` cross-links | **RECORD** — resolved |
| **A7 cube idle-bob CSS dogfood** | A | A…I | BOOK (cohesion nit) | raw `@keyframes idle-bob` at `CubeTarget.vue:214` (not via `CSSKeyframesAnimation`) | **BOOK-reaffirm** — cohesion, not a defect |
| **A9 matrix `acos` Euler recovery** | A | A…I | BOOK / MEASURE-FIRST (latent) | LIVE `Math.acos` at `matrix-editor/useTransformState.ts:61-63` — latently wrong under non-unit scale; `proof:matrix-decompose-correct` witness fails | **BOOK-reaffirm** — DECOMPOSE via `mat4.getRotation`; latent (cube never scales) |

### F — Deploy / version / release — FOLD (USER-DOMAIN) / RECORD

| Item | Born | Disposition | TREE state TODAY | J |
|---|---|---|---|---|
| **The two patch changesets** ★ | H + I | USER-DOMAIN, confirm-first | `.changeset/tranche-h.md` + `tranche-i.md` BOTH present, BOTH `patch`; `package.json version 4.1.0`; latest tag `v4.1.0` (`git tag` — release.yml NEVER ran) | **FOLD** (USER-DOMAIN SemVer decision) — coalesce both in one `changeset version`; H's patch subsumed (never published) |
| **release.yml never run** | H | RECORD + decide | `release.yml:21 tags: v*.*.*`; INDEPENDENT of dead ci; never fired; doesn't gate on `proof:correctness` (only `proof:boundary`) | **RECORD** — decide if release should gate on correctness |
| **`I-IMMEDIATE-1` d469e69 revert** | I | SUPERSEDED-BY-FIX-SHIP (FINAL) vs DEFERRED-BY-USER (I.WZ spec) | `I.WZ.md:90` says DEFERRED-BY-USER; `FINAL.md:244` says SUPERSEDED. Tree confirms the fix SHIPPED (deploy EXECUTED, `4072af9`). FINAL authoritative | **RECORD** — note the spec/FINAL drift; do not re-propagate the stale revert recommendation |
| **DEP-1 CNAME / DEP-2 template / DEP-3 roster** | G | deploy-HANDOFF (kf authors, deploy writes) | sibling-owned | **OUT** (deploy/constellation) |
| **GH-secret creds vs sibling-.env bypass** | I | VERIFY-ONLY (J confirms GH secrets) | `deploy-pages.yml:66-67` consumes `CLOUDFLARE_API_TOKEN/ACCOUNT_ID`; manual bypass used `fourier-analysis/.env` | **VERIFY-ONLY** (J confirms GH secrets exist/match) — owned by WZ-postclose lane |

### G — ARCH kills — RECORD-permanent (no consumer pull A→I; do NOT re-litigate)

K-1 ScrollTimeline-native-REPLACE · K-2 Worker/OffscreenCanvas/Houdini · K-3 dev.sh/deploy.sh ·
K-4 WASM-parser · K-5 Typed-OM carrier (write-substrate MEASURE-FIRST) · K-6 per-property easing ·
K-7 `fromString` multi-animation · K-8 demo-frontier non-adopts (RE-VERIFY Interest-Invokers
Baseline only if now Baseline) · K-9 chevrotain-codegen · D1 `ValueUnit` monomorphization ·
SUP-7 bit-packing. **All KILL-reaffirm; RECORD.** (Source: `recap-deferred §9`, `FINAL.md §6`.)

### H — Doc-rot (no-stale-docs precept) — FOLD

| Item | Evidence | J |
|---|---|---|
| **CLAUDE.md test-count rot** | `CLAUDE.md:63` "test/ — 15 files, 261 tests"; tree has **71** top-level `*.test.ts` (`ls test/*.test.ts \| wc -l` = 71); the named list (15 files) is a fraction of the actual tree | **FOLD** (P2) — re-derive the project tree; the test roster is stale by ~4.7× |
| **PROGRESS.md §0 stale revert recommendation** | `PROGRESS.md:47-52` still says "REVERT master to d469e69"; FINAL §8 discloses it as obsolete | **RECORD** — FINAL discloses; do not re-propagate |
| **I.WZ.md DEFERRED-BY-USER vs FINAL SUPERSEDED** | `I.WZ.md:90` vs `FINAL.md:244` | **RECORD** — FINAL authoritative; tree disambiguates |

---

## §2 — THE NET-NEW CHRONIC BORN AT THE I CLOSE (the one item the FINAL does NOT own)

`scene-control-dfa` is the single deferral that the I FINAL's "no perpetual punt" claim does
NOT cover — it was opened AFTER `FINAL.md` was committed, in the post-merge CI tail.

- **Evidence:** `proof-scene-control-dfa.mjs:211 navByHash(page, sceneId, settleMs = 1600)` —
  the fixed `settleMs`, NO `IN_CI` awareness (the `66855c2` CI-aware fix was REVERTED at
  `feb39c3`). The revert message states the underlying defect explicitly: a `cube→spring`
  hash-nav "leaves [the control trigger] null/stale until the FSM settles" — a REAL runtime
  lag, not a test artifact. `I-WZ-verify.md:344-348` marks it **"STILL OPEN."**
- **Why it matters for THIS lane:** it is a CHRONIC the instant it survives J unowned (P0 per
  the sibling `wave-I.WZ-postclose.md §C`). It partially undercuts the CH-7 / I.W2
  "single-authority control surface" VERIFY-ONLY: the surface is single-sourced but LAGS the
  route under load.
- **J disposition: FOLD (P0)** — but the full mechanics (product fix + per-expected-trigger
  gate fix + taxonomy orphan + `IN_CI` helper) are OWNED by the `wave-I.WZ-postclose.md` lane.
  I cite it here only to keep the consolidated ledger COMPLETE: the I FINAL's P-invariant
  holds for the carries it ENUMERATED; this one it could not enumerate (it didn't exist yet).

---

## §3 — CHRONICALLY-DEFERRED (≥2 tranches) — the J fold-or-KILL roll-up

Per the user's J mandate every ★ MUST fold into J or get a reasoned terminal KILL. Status TODAY:

| ★ chronic | Tranches | TREE status | J verdict |
|---|---|---|---|
| DC-8 dead-CSS | A→I (≥4) | RESTORED (live VT consumer) | **TERMINATED** — VERIFY-ONLY |
| CH-1 specular | D→I (3) | consumed 3.9.0, gated | **TERMINATED** — VERIFY-ONLY |
| CH-5 `"......"` crash | A,H,I (3) | contract published+consumed | **TERMINATED** — VERIFY-ONLY |
| CH-3 mobile / CH-4 dock | D→I (3) | folded into perf+drag gates | **TERMINATED** — VERIFY-ONLY |
| C-6 engine ceiling | D→I (6) | gated, 1375/1400 | **CONTAINED** — VERIFY-ONLY (a standing gate, not a punt) |
| C-1 value.js next-slice | C→I (7) | OPEN in 0.11.2 | **CHRONIC-by-design** — BOOK-reaffirm (the re-pin process; not a punt) |
| FB-2 sync-step | F→I (4) | still async | **J MUST DECIDE** — author `proof:event-ordering` or KILL |
| SoA lerpArray | E→I (5) | absent | **J MUST DECIDE** — KILL-reaffirm unless a bench bites |
| FB-3 MorphSVG | C→I (5) | gated on value.js sampler | **BOOK-reaffirm** — gated, terminal home = value.js VJ-F1 |
| FB-5 intrinsic-size | E→I (5) | no path | **J MUST DECIDE** — VERIFY Baseline then BOOK or KILL |
| tryParseCache eviction | C/F→I (5) | unbounded Map | **BOOK-reaffirm** — bound lives in value.js (VJ-7) |
| A9 matrix acos | A→I | live, latent | **BOOK-reaffirm** — latent, DECOMPOSE on touch |

**The four "J MUST DECIDE" rows (FB-2, SoA lerpArray, FB-5, FB-6 palette) have ridden ≥4
tranches as MEASURE-FIRST/BOOK without a probe authored.** Per P-invariant-28 these can no
longer ride as bare BOOKs; J must EITHER author the named measure-first probe OR issue a
KILL-with-reason. Continuing them as "BOOK" a fifth time is the perpetual punt the invariant
forbids.

---

## §4 — inv ε COMPLIANCE

This lane wrote ONLY `docs/tranches/J/audit/deferred-ledger.md`. Every live-state claim is a
re-runnable probe or a `file:line` verified against `master` tip `4072af9`:
- pins: `package.json` (`@mkbabb/value.js ^0.11.2`, `@mkbabb/glass-ui ~3.9.0`, `parse-that ^0.9.0`, `version 4.1.0`)
- installed: `node -e require('.../package.json').version` → value.js 0.11.2, glass-ui 3.9.0, parse-that 0.9.0
- B1 contract: `node -e parseCSSValueUnit("")` → `{value:0}` no throw
- engine ceiling: `wc -l src/animation/engine.ts` → 1375; cap 1400 (`proof-decomposition.mjs:132`)
- retired gates: `grep -c proof:<g>` in package.json → 0 for all 5 + specular-handoff
- DC-8: `useSceneTransition.ts:2,32` live `startViewTransition`
- BOOKs: `lerpArray` grep=0; `async advanceTo` engine.ts:840; `tryParseCache` Map utils.ts:203
- doc-rot: `CLAUDE.md:63` vs `ls test/*.test.ts | wc -l` = 71
- release: `git tag -l 'v*'` tops at `v4.1.0`; two patch changesets present

No chain-of-trust over a prior FINAL: every "CLOSED" chronic was re-checked against the tree.
