# Tranche L — FINAL (the close) · keyframes.js' twelfth tranche

**Lane:** L.WZ · **Date:** 2026-06-17 · **Tree:** `tranche-l-dev` (tip `4686aa4`) ·
**Version in tree:** `4.3.0` (the K-close cut; L's own cut is USER-DOMAIN — §S6) ·
**Siblings consumed:** value.js `^0.13.0`, parse-that `^0.9.0` (glass-ui `~4.0.0` per the K
pin). **Held to inv ε:** EVERY boundary claim below CITES its OBSERVED oracle — the gate name +
its re-run green/RED-by-design witness, the commit sha, the measured fact. No claim is a
re-assertion of intent; the un-consumed Band-B edges are NAMED with their tripwire, NOT asserted
closed; the deploy round-trip is HANDOFF, NOT claimed observed; the version string is RECOMMENDED,
NOT asserted cut.

K (the eleventh) answered *"can the authoring object BE CSS, round-tripped?"* — yes, for a DEFINED
SUBSET, closed honestly on inv ε (`docs/tranches/K/FINAL.md`). L was chartered by that honesty: the
36-lane audit found the SUBSET status was a family of **replay-equality breaches in the SHIPPED
surface**, a **gate-corpus blind-spot**, a **publish/dogfood gap**, and a **constellation
workaround band** — none of which K's gates caught. L's two bands answer in one discipline: **Band
A** makes the round-trip TOTAL (or honestly refuses) on a device-honest gate corpus over a
dogfooded published barrel; **Band B** dispatches every cross-repo fix and circles back with a
NAMED tripwire where the sibling has not yet published. This document is L's terminal reading.

---

## §0 — THE HONEST HEADLINE (read this first)

Two truths must sit beside each other without overclaim:

1. **Every Band-A wave landed on a GREEN born-RED oracle**, each re-run at this close and cited
   below by gate name + exit code. The round-trip is TOTAL (or honestly refuses); the gate suite is
   device-honest; the demo is on the published barrel; the orchestration/agent/perf/design work
   shipped. This is the substance of L.

2. **`proof:all`'s three roster reds — CURED in the close-impl reconciliation (`d7c7f3d`).** The
   close re-ran the roster (`package.json:175`) at `4686aa4` with CLEAN exit capture (the per-wave
   incremental checks had masked these via piped exit codes) and found three blocking members that
   grew un-reconciled during the Band-A waves: `proof:gate-is-runtime` (the W5 node gate
   `proof:transport-events` mis-tiered into `proof:correctness`), `proof:agent-surface` (the W9
   `Oscillator` missing from the un-regenerated llms index), and `proof:decomposition` (`drag`/`index`/
   `sequence`/`spring` grown past their ceilings). All three were cured HONESTLY (§S6 enumerates each
   with its observed before/after exit code): the tier move, `gen-agent-surface.mjs`, and four
   cohesive extractions (`drag-2d`/`spring-reseat`/`spring-duration`/`sequence-events`/`load-engine`,
   the `engine-composition.ts` precedent). Each re-verified `exit 0` individually; the full
   `CI=true proof:all` re-run is the deploy signal. **The deploy round-trip remains HANDOFF** — now
   gated solely on glass-ui BB (the `proof:peer-satisfied` tripwire → green CI → auto-deploy), not on
   any kf-internal red. The FINAL claims only what re-runs green; it names the rest.

The inv ε precept (the ⚠9 lesson K carried) is exactly this: a FINAL that asserted "round-trip TOTAL
+ proof:all green + deployed" without the roster re-run would be the overclaim shape this discipline
exists to prevent. Below, each boundary cites what it observed.

---

## §S1 — BAND A — replay-equality TOTAL (the round-trip made the parser run backward)

**Boundary:** the five replay-equality breaches K shipped silently, closed or honestly refused; the
multi-color compile path made faithful-or-refused.

**Observed oracle — `proof:replay-equality` GREEN** (`node scripts/proof-replay-equality.mjs`,
re-run at this close → **exit 0**; commit `8e386a7`). The gate exercises the breach inputs as
RUNTIME behaviour over the built dist, with the VALUE proof riding
`vitest run test/replay-equality.test.ts`:

- `@property --x <number>` blocks now serialize backward (`engine.ts:1225` →
  `serializeStylesheetItem` wired; ⚠15).
- per-stop `animation-composition` survives the round-trip (`format.ts` per-stop emit; ⚠16).
- named keyframe selectors (`entry/exit/cover/contain`) ingest without throwing
  (`frame-compiler.ts` cure; ⚠17).
- the composite/iteration-composite/play-state OPERATOR floor lands on `AnimationOptions`.

**Observed oracle — `proof:compile-replay` GREEN** (`node scripts/proof-compile-replay.mjs` →
**exit 0**; commits `8e386a7`+`4863446`). Multi-color per-key densify ships-or-refuses on the ΔE-ε
proof; the scroll-driven compile fixture emits `animation-timeline`/`animation-range` (the
scroll-BLIND headline cured); static-weight pre-multiply lands; time-serialize unifies on
`reverseCSSTime` (the bespoke `reverseMs` deleted, ⚠30). The compiled CSS replays
numerically-equal to the JS playback it emitted from. VALUE proof rides
`vitest run test/compile-roundtrip.test.ts`.

**Observed oracle — `proof:ingest-replay` GREEN** (`node scripts/proof-ingest-replay.mjs` →
**exit 0**; commit `4863446`). The W3 ingest deepening: the delay-reset arm (`seedAtTime` seeds the
takeover at the captured `currentTime`, the continuity seed — the `delay>0` freeze cured), the
nested group-rule walk, the `ADOPT_REFUSE` diagnostics arm, the adoptedStyleSheets/Shadow-DOM walk,
and the scroll-time arm. Every cross-origin skip is a typed `CORS_SKIP` diagnostic, never a silent
drop. VALUE proof rides `vitest run test/ingest.test.ts`.

**inv ε honesty — the S1 `!important` correction (NOT an overclaim).** The W1 fixture originally
asserted a keyframe-level `!important` should round-trip with its flag. That was CORRECTED to the
spec-faithful verdict (commit `8e386a7`): per **CSS Animations §3** a property with `!important`
**inside a keyframe is invalid and ignored** — value.js drops it, kf mirrors the drop, and the test
LOCKS `not.toContain("!important")`. The no-silent-drop *diagnostic* (so a consumer learns the flag
was dropped, rather than seeing it vanish) is a value.js-O dispatch
(`KF-TO-VALUEJS-O-ASKS.md #12`), consumed Band-B at L.W9. The verify-lane workaround that briefly
papered this was REVERTED. **This is recorded as inv ε honesty, not a closed claim** — the breach is
spec-correctly handled (drop), the missing-diagnostic affordance is a NAMED Band-B handoff.

---

## §S2 — BAND A — gate-suite device-honesty (the macOS-pass/Linux-fail root, cured at its seam)

**Boundary:** the 259 fixed-ms `waitForTimeout()` sleeps (the render-race root of the K CI-greenify
epic) replaced by a state-predicate settle primitive; report-all posture; the supply-chain
peer-cycle made VISIBLE by a tripwire gate.

**Observed oracle — `proof:settle-is-predicate` GREEN** (`node scripts/proof-settle-is-predicate.mjs`
→ **exit 0**; commit `f94fa7a`). The gate proves `openControlsPanel` contains ZERO
`waitForTimeout(...)` calls — it settles on state predicates via `waitForRender(page, predicate,
{ timeout })`, the settle primitive exported from `demo-driver.mjs`. Load-independent by
construction (the navToScene contract). The W4 transposition also lands report-all CI posture
(demo-smoke continue-on-error so first-RED no longer aborts the corpus), the Makefile `ci-linux`
local-repro, the CATEGORY taxonomy (wall-clock / pixel-render / physics-settle), and
`proof:no-single-option-select` GREEN (`node scripts/proof-no-single-option-select.mjs` → **exit
0** — every scene `<Select>` renders only when option-count > 1).

**Observed oracle — `proof:peer-satisfied` RED-by-design** (`node scripts/proof-peer-satisfied.mjs`
→ **exit 1**, by design; commit `f94fa7a`). This is the F-2 tripwire, stated honestly: glass-ui
4.0.0 declares peer `@mkbabb/value.js@"^0.10.0 || ^0.11.0"` but the installed sibling is `0.13.0`
(ELSPROBLEMS) — the peer range REJECTS the installed value.js. **The gate is BORN-RED-BY-DESIGN; it
STAYS RED until glass-ui BB widens the peer range and kf re-pins** (Band B, L.W9 — §S5). It rides the
report-all CI lane (`ci.yml` `continue-on-error: true`), NEVER the blocking `proof:hygiene` chain.
The RED is the kf-side proof that the F-2 cross-repo defect is LIVE — not a punt, the
P-invariant-28 exit shape.

---

## §S3 — BAND A — barrel-dogfood + publish (the demo eats the published surface)

**Boundary:** the demo flipped off the deep `@src/animation/*` source paths onto the PUBLISHED
`@mkbabb/keyframes.js` barrel; the `Animation`→`KeyframesAnimation` rename clearing the
API-Extractor collision; keyframes-vue PREPPED for publish.

**Observed oracle — `proof:demo-on-published-surface` GREEN** (`KFVUE_INVERSION_LANDED=1 node
scripts/proof-demo-on-published-surface.mjs` → **exit 0**; commit `339d78b`). The census reads
**0 demo files importing `@src/animation/*`** (0 deep imports) and **62 demo files writing
`@mkbabb/keyframes.js`** — the inversion is COMPLETE; the boundary-ORACLE at the PACKAGE boundary
bites. The vite + tsconfig self-alias resolves the barrel to source in dev; 5 engine internals the
demo reached are exposed via `loadAnimationEngine()`.

**Observed oracle — the `Animation`→`KeyframesAnimation` rename** (commit `339d78b`;
`engine.ts:101` `export class KeyframesAnimation`, `engine.ts:1205`
`export { KeyframesAnimation as Animation }`). The backward-compat is a PURE RE-EXPORT alias — a
non-colliding canonical declaration emits ZERO `_2` collision (`grep '_2 as' dist/keyframes.d.ts =
0`; `proof:pkg3-clean` GREEN at the W8 commit). `animate()` gained a 5th orchestration-dispatch
branch routing `AnimationGroup | Sequence` to `.play()`. **THREE breaking type changes recorded for
the 5.0.0 cut** (the `Animation`/`ScrollTimeline` renames + `ScrollTimelineOptions` re-colliding
with an ambient `lib.dom` type even as a type alias) — §S6.

**keyframes-vue — PREPPED, publish USER-DOMAIN (clause b RED-by-design).** Observed oracle —
`proof:keyframes-vue-published` (`node scripts/proof-keyframes-vue-published.mjs` → **exit 1**, by
design; commit `339d78b`): clauses (a)+(c) GREEN (the package builds `dist/keyframes-vue.{js,d.ts}`,
peer floor `>=4.3.0`); **clause (b) RED** — `npm show @mkbabb/keyframes-vue@0.1.0` returns E404, the
package is ABSENT from the registry. **The publish is USER-DOMAIN (Mike Babb); this clause STAYS RED
until the user runs `npm publish --access public` in `packages/keyframes-vue/`.** It rides the
report-all CI lane, never the blocking chain. keyframes-react is a BOOK (the disposition doc;
gate-first `proof:keyframes-react-published` before any scaffold; no react source written).

---

## §S4 — BAND A — orchestration DX · agent surface · SOTA perf · design

**Boundary (orchestration DX) — `proof:transport-events` + `proof:drag-gesture` GREEN.**
`node scripts/proof-transport-events.mjs` → **exit 0** (commit `29bf376`): a seek past a segment's
at-offset fires `segment:enter` with `(animation, masterClock)`; a seek past a registered label
fires `label` with `(name, masterClock)`; each returns an unsubscribe handle (the `ScrollScene.on`
idiom). `node scripts/proof-drag-gesture.mjs` → **exit 0** (commit `29bf376`): a real drag selects
no text and suppresses `userSelect` for the whole gesture across every drag surface (D1); the
dragged square persists where released (D2, `releasePolicy:"persist"`); Home still recenters to
`matrix(1,0,0,1,0,0)` (B6); `Draggable` clamps to bounds (S1), snaps to nearest target on release
(S2), `drag2D` follows both axes (S4) — the GSAP-Draggable/InertiaPlugin parity hole closed. LIGHT,
value.js-free. **(Note: `proof:transport-events`'s correctness-tier wiring is the subject of an
S6 roster red — see §S6 honesty.)**

**Boundary (agent surface) — `proof:agent-validate` GREEN.**
`node scripts/proof-agent-validate.mjs` → **exit 0** (commit `5bef882`). `validate(css)`/`explain(css)`
are a read-only projection over `resolveKeyframes`/`compileToCSS`/`isWAAPIEligible` — the three
channels already CI-gated; the verb returns `{parseable, eligible, refusals, diagnostics, waapi}`.
The llms.txt validate→fix→compile LOOP is documented; `generate()` from-intent is KILLed (KISS /
moat-gestalt — the LLM generates, kf validates+compiles). Clause (c) is spec-faithful (the
`@property`/`!important` drop verdict; the multi-color perceptual-oklab refusal). VALUE proof rides
`vitest run test/agent-validate.test.ts`. *(The published agent INDEX is stale — see §S6.)*

**Boundary (SOTA perf) — zero-alloc Float64Array + spring-vector ADOPT + warmEngine measure-first.**
`npx vitest run test/zero-alloc.test.ts` → **7/7 passed** (commit `d858044`): `lerpArray` was
inlined to `leaves.ts` on the LIGHT tier (value.js has no math subpath to consume), and the
NumericAnimation/SpringProgress interp paths are zero-alloc. `node scripts/proof-spring-vector.mjs`
→ **exit 0**: the SpringProgress vector-sugar (`setTargets`) ADOPTED (the 3.8×@K=8 win measured).
Granular `loadAnimationEngine()` per-capability load accessors landed; `warmEngine()` is
measure-first (the `scheduler.postTask` idle-warmer DEFERRED — the probe only SKIPs in jsdom, so it
is not asserted as a win). A budgeted bench taxonomy frames the value.js color-math frontier (the
allocations themselves are a value.js-O dispatch — §S5).

**Boundary (design) — `proof:crayon-preserved` + `proof:design-refinement` GREEN; TASTE
USER-DOMAIN-PENDING.** `node scripts/proof-crayon-preserved.mjs` → **exit 0** (commit `4686aa4`):
every crayon keeper resolves to its 4.3.0 hue — the `--rainbow-*` six stops + cyan,
`--accent-red`/`--color-progress`, the six cube facets, the bite-verified `--amiga-red` (the raw
`red` literal retired to the token). `node scripts/proof-design-refinement.mjs` → **exit 0**: nine
NEW per-scene instrument eggs are wired (home source-card · cube re-lit die · amiga power-on · square
palette-sweep · easing trace-smear · spring four-lane derby · sequence lane-detonate · motion-path
author-curve · playground bind-ignition), each a hidden trigger → an observable off-the-normal-path
effect dogfooding a public engine primitive, **none hand-rolling a rAF** (inv ζ). The before/after
TASTE packet is on disk (`docs/frontend-design/taste-packets/l-w11/` — home/cube desktop+mobile
before/after pairs). **THE TASTE VERDICT IS USER-DOMAIN-PENDING** — it closes ONLY on Mike Babb's
"meets the bar" on the packet (the K precedent; an agent designer-eye PASS is corroboration, never
the verdict). It is NOT self-certified here.

---

## §S5 — BAND B — the dispatches filed; every consume-edge UN-CONSUMED at close (NAMED tripwires)

**The honest state: EVERY Band-B consume-edge is un-consumed at this close.** Registry-probed at
authoring: glass-ui `4.0.0` (the F-2 peer-cycle LIVE), value.js `0.13.0` (O / 0.14.0 unpublished),
parse-that `0.9.0`, keyframes-vue UNPUBLISHED. So each edge is a HANDOFF with a NAMED tripwire — the
named sibling publish — per P-invariant-28 (a named tripwire + a born-RED kf gate IS exit-shaped,
not a punt). This is the inv ε state; nothing below is asserted closed.

**The three dispatches FILED** (commit `791b3bd`): `docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md`,
`docs/tranches/L/KF-TO-VALUEJS-O-ASKS.md` (14 asks incl. the 2 W10-confirmed value.js crashes),
`docs/tranches/L/KF-TO-PARSE-THAT-ASKS.md`. The Oscillator LIGHT primitive shipped at L.W9.

**Observed oracle — `proof:workaround-deletion` 5-PENDING** (`node
scripts/proof-workaround-deletion.mjs` → **exit 0**, the three-state STAGED report). All five
arms PENDING — PRESENT with the paired sibling-fix UNPUBLISHED. Each names its tripwire:

| Arm | Workaround (kf-side) | Tripwire (the publish that lights the consume-edge) |
|---|---|---|
| S1/S2 | `:aria-orientation` suppression (`SpringSidebar.vue` + `AnimationControls.vue`) | glass-ui BB SegmentedTabs pill-variant fix + kf re-pin |
| S7 | `linear()` flat-comma normalize regex (`utils.ts` `LINEAR_PAREN_PREFIX`) | value.js VJ-L2 `FunctionValue.toString()` fix |
| S8 | `FN_NAME` Symbol sidechannel stamped on value.js `ValueUnit` (`utils.ts`) | value.js VJ-L1 first-class `flatLeaf` |
| S9 | direct `@mkbabb/parse-that` import (`utils.ts`) reaching through value.js's parser | value.js VJ-L3 `parseCSSSubValue` |

The gate is PENDING (exit 0), not FAIL — each arm GREENs when the sibling publishes AND kf consumes;
the workaround line deletes in the same commit. It rides the report-all CI lane.

**Observed oracle — `proof:control-point-live` RED-by-design** (`node
scripts/proof-control-point-live.mjs` → **exit 1**, by design; commit `791b3bd`). `GlassControlPoint`
is ABSENT from the published `@mkbabb/glass-ui@4.0.0` dist tree (`grep -rn 'GlassControlPoint'
node_modules/@mkbabb/glass-ui/dist/` → ZERO). **The gate is a REPORT-ALL TRIPWIRE (DL-K7, a
6-tranche chronic E→L) — it STAYS RED until glass-ui BB publishes the primitive and kf re-pins; a
green here before that publish would HIDE the very gap the gate exists to surface.** It rides the
report-all CI lane, never the blocking chain.

**The named un-consumed Band-B edges, each with its tripwire** (from `PROGRESS.md §"Open
deferrals"` + `§Band-B gated consume-edges`):

| Edge | Chronicity | Tripwire | Born-RED kf gate |
|---|---|---|---|
| RF-17 / DL-K9 (GlassDock click-strand interim) | 3 (I,J,K→L) | glass-ui 4.1.0 `W-DOCK-MORPH-FAMILY` + RF-17 fix | `proof:rf17-net-deletion` (the interim deletes on re-pin) |
| GlassControlPoint / DL-K7 (curve-editor enabler) | 6 (E,F,G,H,I,J,K→L) | glass-ui BB ships `GlassControlPoint` | `proof:control-point-live` RED (re-run exit 1, above) |
| MorphSVG / FB-3 (`fromMorphSVG`/`getPointAtLength`) | 6 (C,F,G,H,I,J,K→L) | value.js O (0.14.0) VJ.W4 arc-length sampler remainder | `proof:morphsvg-consume` born-RED |
| parse-that packrat / PT-2 ((id,offset) soundness) | 5 (E,F,G,H,I,K→L) | parse-that PT-WAVE-6 (id,offset) re-key | `proof:packrat-sound` born-RED |

**The W10 research-spike decision — Option B (the architectural verdict written and accepted;
`docs/tranches/L/audit/W10-css-parity-spike.md §3.2`):** delete parse-that's `parsers/css/`
STRUCTURAL grammar, keep the value readers, **consolidate the one CSS grammar in value.js** — the
acyclic-spine impact favours B decisively (it is the only path that does not make parse-that's CSS
module a first-class consumed structural grammar in kf's spine), and replay-equality serializer
ownership settles in value.js. **`proof:css-parity` is RED-today — the HONEST state** — the gate
script is ABSENT from the tree (`scripts/proof-css-parity.mjs` does not exist; not in
`package.json`): **W10-IMPL is gated on the coordinated value.js-O + parse-that publish; the
RED-today is not a regression, it is the un-consumed frontier honestly declared.**

---

## §S6 — THE VERSION CADENCE (RECOMMEND 5.0.0; USER-DOMAIN) + the deploy round-trip (HANDOFF)

### The version cadence — RECOMMEND `5.0.0` (the cut is USER-DOMAIN — Mike Babb)

The tree carries `4.3.0` (the K cut; `package.json` re-verified `version: 4.3.0`). **The
recommendation is `5.0.0`, NOT an asserted cut.** Three orthogonal evidence points drive the MAJOR:

1. **Replay-equality TOTAL is a BREAKING behavioural change on the output surface** (L.W1+L.W2). The
   compile/format surface now emits `@property` blocks, per-stop `animation-composition`, and
   `animation-timeline`/`animation-range` it previously omitted, and **REFUSES multi-color tracks it
   previously shipped silently-lossy with `eligible:true`** (`compile-color.ts`). A consumer that
   depended on the old silent behaviour gets a DIFFERENT output string or a `CompileRefusal` where
   there was none — a semantic contract break on the compile surface.
2. **The `Animation`/`ScrollTimeline` type renames** (L.W8, commit `339d78b`) — THREE breaking type
   changes recorded (incl. `ScrollTimelineOptions` re-colliding with an ambient `lib.dom` type). The
   re-export alias preserves the value import, but a consumer pattern-matching the d.ts surface sees
   renamed canonical declarations.
3. **The package graph changes shape** — `@mkbabb/keyframes-vue` is a NET-NEW published package (on
   the user's publish), and the demo now depends on the PUBLISHED barrel (the dogfood inversion).

The case for MINOR `4.4.0` is defensible only if the user judges no consumer in the wild relied on
the undocumented silent-lossy multi-color behaviour. **The cut is USER-DOMAIN; the FINAL will cite
the chosen string + the OBSERVED `package.json` version AFTER `changeset version` runs — it does NOT
assert `5.0.0` shipped.**

### The deploy round-trip — HANDOFF (NOT observed at this close)

The J.W0/K.WZ green-CI→auto-deploy→live-bytes round-trip is **NOT re-observed at this close, and the
FINAL does not claim it.** It is gated, in order:

1. **`proof:all`'s three roster reds — CURED** in the close-impl reconciliation (`d7c7f3d`). The
   re-run at `4686aa4` had REDed on three members that grew un-reconciled during the Band-A waves;
   each is now cured HONESTLY (observed before→after exit code), no gate weakened:

   - **`proof:gate-is-runtime` — exit 1 → 0.** `proof:transport-events` (added to the
     `proof:correctness` tier at W5, `29bf376`) is a node/vitest gate over the LIGHT barrel
     (`L.W5.md:327`: "no browser, no demo build needed"), but the I.W7/J.W3 meta-gate requires every
     correctness-tier member to open a real browser over the built dist. CURE: moved
     `proof:transport-events` to the `proof:hygiene` tier beside its node-gate sibling
     `proof:orchestration` (`proof:ci-coverage` stays green — it rides the gates job either way).
   - **`proof:agent-surface` — exit 1 → 0.** `/llms-full.txt` was STALE — it OMITTED the W9-shipped
     `Oscillator`/`waveformValue` (`791b3bd` added them; the generator was not re-run). CURE:
     `node scripts/gen-agent-surface.mjs` (the index now carries them).
   - **`proof:decomposition` — exit 1 → 0.** `drag.ts` (555L>550, W5 bounds/snap), `index.ts`
     (731L>550, W7/W8 accessors), `sequence.ts` (817L>700), `spring.ts` (806L>700, W7 spring-vector)
     grew past their library ceilings. CURE: four COHESIVE extractions (never a ceiling override) —
     `drag.ts`→`drag-2d.ts` (462L), `spring.ts`→`spring-reseat.ts`+`spring-duration.ts` (685L),
     `sequence.ts`→`sequence-events.ts` (698L), `index.ts`→`load-engine.ts` (246L) — the
     `engine-composition.ts` precedent; barrel exports re-exported through the original files
     (`proof:published-surface` unchanged); `proof:boundary` green throughout. (`proof:spring-blend-weight`'s
     reseat arm retargeted to `spring-reseat.ts` — the anchor follows the bodies, as
     `proof:composition-honored` did for `engine-composition.ts`.)

   Each re-verified `exit 0` individually post-cure; the full `CI=true proof:all` re-run is the
   single remaining kf-internal deploy signal. The RED-by-design tripwires (`proof:peer-satisfied`,
   `proof:control-point-live`, `proof:keyframes-vue-published`) are CORRECTLY non-blocking — they ride
   `continue-on-error` report-all lanes (`ci.yml`) and are not part of `proof:all`.

2. **`proof:peer-satisfied` must go GREEN** — gated on glass-ui BB shipping the widened peer range
   and kf re-pinning (§S5).

3. **The USER-DOMAIN version cut + npm publish** (Mike Babb).

Only then does the close merge to master carry a green CI → `deploy-pages.yml` auto-fire → live
`keyframes.babb.dev` serving the new `index-*.js`. **The round-trip is HANDOFF; the FINAL cites it
as gated-and-pending, never observed** (the inv ε / INVE-1 discipline — the close claims only what
it witnessed).

---

## §S7 — Lighthouse re-verification (DL-L12) — VERIFY-ONLY, gated on a built L dist

The DL-L12 obligation is to re-run `proof:lighthouse-mobile` with `KF_REQUIRE_LH=1` on the L dist
and RECORD the scores against the K floors (home 68 / cube 66 / amiga 52 / square 65 / easing 63 /
spring 55), any regression RED. The mechanism is non-gate (runner-calibrated, wall-clock CATEGORY
per inv-L-device-honesty — RECORDED, never CI-hard-gated, the K.WZ precedent).

**Honest state: this re-verification is gated on a built, deploy-ready L dist, which in turn is
gated on `proof:all` going green (§S6).** It is therefore RECORDED-PENDING — the floor is the gate,
the scores are the artifact, and the artifact is produced on the L close dist once the roster is
green. The FINAL does NOT assert L-dist scores it did not measure; the K floors stand as the
non-regression contract the close-impl motion verifies before the deploy.

---

## §S8 — THE DEFERRED LEDGER + CHRONIC-CLOSURE SUBSTRATE (the orchestrator's final motion)

The L consolidated open-deferrals ledger (`PROGRESS.md §"Open deferrals"`, DL-L1–DL-L13 cluster
rows + the 45 DLL refinement rows in `audit/deferred-ledger-L.md`) carries every chronic to a
terminal disposition: DL-L1 FOLD (replay-equality, §S1), DL-L2 FOLD (gate-corpus, §S2), DL-L3
FOLD+HANDOFF (peer-cycle, §S2/§S5), DL-L4/L5 FOLD (dogfood/keyframes-vue, §S3), DL-L6–L9 HANDOFF
(the four Band-B chronics, each named tripwire + born-RED kf gate, §S5), DL-L10 FOLD-on-consume
(workarounds, §S5), DL-L11 FOLD+HANDOFF (CSS-parity, §S5), DL-L12 VERIFY-ONLY (§S7), DL-L13 FOLD
(T1 resolved at L.W0 by the WIRED derivation rule — `proof:gate-is-runtime` AUTHORED + WIRED into
`proof:hygiene` (verified `package.json:106`/`:190`), the K-decision option (b) "formally own the
corpus"; the gate set is DERIVED from `proof:correctness` membership, not a hand-edited list. **inv ε
correction:** the "collapse the lattice" language is NOT deleted — `grep` of `precepts-k.md` returns 2
hits (§3 T1 lines 246/253); a prior draft asserted "deleted/ABSENT", which does NOT reproduce, so the
T1 terminal rests on the wired derivation gate, not a language-deletion that did not happen). The
≥4-tranche HANDOFF rows (DL-L7 6-tranche, DL-L8 6-tranche, DL-L9 5-tranche) are EXIT-shaped by their
named sibling tripwire + born-RED kf gate (P-invariant-28).

**The chronic-closure substrate transition K→L is the orchestrator's final close-impl motion, NOT
this workflow's.** `scripts/proof-chronic-closure.mjs:110` `CHRONIC_LEDGER` still points at
`docs/tranches/K/PROGRESS.md` (re-verified; `node scripts/proof-chronic-closure.mjs` → exit 0 on the
K substrate). The re-point to the L ledger — proven non-vacuous by the three planted-malformed-row
RED probes (a FOLD citing a source-shape gate; a HANDOFF targeting an unpublished future version; a
≥4-tranche bare BOOK) before the clean L ledger greens — is a single atomic source motion the
DOCS-ONLY close does not perform. It is the prompt-named final motion, sequenced with the
roster-green and the USER-DOMAIN cut.

---

## §S9 — THE PROMPT-RECAP (zero drops, carried forward)

`docs/tranches/L/audit/prompt-recap-L.md` carries the A→K ledger (chain-trusted to
`prompt-recap-k.md`'s zero-drops close) + the THIS-SESSION edicts (ship K in totality, the live F1–F6,
green the CI, the 36-lane audit) + the L-intake (Q1 round-trip breaches → L.W1/W2/W3; Q2 SOTA-perf →
L.W7; Q3 constellation → L.W8/W9; Q4 true-CSS-parity → L.W10; the gate-suite blind-spots → L.W4; the
completion-lane net-new → L.W5/W6/W8) — each at a terminal verdict (ADDRESSED / RECORD / OUT-HANDOFF /
L-SCOPE / KILL). The 34 ⚠ precept rows are all dispositioned (5 ADDRESSED · 12 L-SCOPE · 17
OUT-HANDOFF — zero bare). The 12-KILL anti-charter + GEN-1 re-confirmed non-re-litigable. **Zero
drops.** The dev-phase recap's L-SCOPE verdicts are realized by the impl-phase GREEN oracles cited in
§S1–§S4; the OUT-HANDOFF verdicts are the §S5 named tripwires.

---

## Terminal reading

K proved the round-trip EXISTS for a subset and closed honestly; L makes it TOTAL — or honestly
refuses — over a device-honest gate corpus, on a demo that eats its own published barrel, with the
orchestration/agent/perf/design surfaces shipped, **each claim signed by a born-RED oracle re-run
GREEN at this close** (§S1–§S4). What L does NOT yet have, it NAMES: every Band-B consume-edge is
un-consumed, each a HANDOFF with a named sibling tripwire and a born-RED kf gate (§S5); the
true-CSS-parity frontier is RED-today by honest declaration (W10 Option B chosen, IMPL gated on the
coordinated publish); `proof:all` is NOT green on this tip — three roster members grew un-reconciled
during the Band-A waves and are named for the close-impl motion (§S6); and so the deploy round-trip
is HANDOFF, the version `5.0.0` is RECOMMENDED-not-cut, the TASTE verdict and the npm publishes are
USER-DOMAIN, the Lighthouse re-verification and the chronic-closure substrate re-point are the
orchestrator's final sequenced motions. **Nothing here is asserted that a re-run cannot reproduce;
nothing un-consumed is claimed closed.** That is the inv ε close.
