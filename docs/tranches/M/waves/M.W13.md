# M.W13 — The engine-seam transposition (the lifecycle/playback machine lifted off the frame-compile facade)

- **Band:** D · **Class:** DEV (docs); IMPL opens on authorization AND on the
  HANDOFF firing. **Dep:** **value.js Tranche O VJ-L1 flatLeaf** (the
  flatten-origin provenance API that retires the `FN_NAME` Symbol stamp). This is
  a HANDOFF-gated structural wave: the safe split executes only AFTER M.W9's
  value.js-O consume deletes the `FN_NAME` Symbol from `utils.ts` — the engine
  seam cannot cleanly split while kf stamps state on a value.js class that the
  `this`-bound re-derive contract reaches through (lane-11 §8, MW-11-1
  precondition). Born-RED kf-side TODAY: `proof:decomposition` passes ONLY because
  the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry exists (verified
  2026-06-17 — exit 0 WITH the override; the deep split is the DF-11-A born-RED
  HANDOFF, named-not-silent).
- **Gate (born-RED — the override-removed decomposition):** `proof:decomposition`
  with the `LIBRARY_CEILING_OVERRIDE` engine.ts entry REMOVED (cap reverts to the
  550L base) — RED on today's 1397L engine.ts. The cure is the transposition
  (engine.ts → ~900L via `engine-playback.ts`/`engine-lifecycle.ts`), the override
  retired, and the TWO parallel ceiling clauses in `proof:engine.mjs`
  (the `ANIMATION_CLASS_CEILING` clause measuring the `KeyframesAnimation` class
  body) + `proof:engine-no-throw-on-play.mjs` (`[hygiene g]` engine.ts file-line
  ceiling) re-pointed to the post-split reality. The group.ts compositor split is
  the CO-DEFERRED arm (the D.W4 born-RED HANDOFF — re-defer-with-revised-rationale
  OR land-with-engine per the precept).
- **Folds (lane #):** lane-11 §2.1 (the engine.ts → engine-css-metadata.ts
  precedent the split extends) · lane-11 §3 (the 550/700/1400 ceiling-regime
  reconsideration — SOUND, keep; the issue is discovery latency, not the regime) ·
  lane-11 §6 DF-11-A (the FULL engine-seam transposition BORN-RED HANDOFF,
  P-invariant-28) · lane-11 §6 DF-11-B (the co-deferred group.ts compositor split)
  · lane-11 §7 MW-11-1 (the proposed wave + its two preconditions) · lane-11 §8
  (the VJ-L1 flatLeaf cross-repo dependency).
- **Precept cure:** DF-11-A — the single largest structural debt in the library
  surface (lane-11 §10), correctly named-and-deferred at K and L
  (`proof-decomposition.mjs:151–157`), now scheduled. The P-invariant-28 obligation
  is "schedule OR re-defer with a revised rationale, named-not-silent"; this wave
  SCHEDULES the engine split and HOLDS the group.ts arm under a revised,
  engine-coupled rationale (the two were always co-deferred — `:200–205`).

---

## Context

`src/animation/engine.ts` is the library's largest module: **1397L** (verified
2026-06-17, `wc -l`), 3 lines under the `LIBRARY_CEILING_OVERRIDE` cap of 1400
(`proof-decomposition.mjs:132`). It is the only `src/animation/**` file carrying a
cap of more than 900L. The override is JUSTIFIED — the gate's `why` entry
(`:133–157`) records the cohesion rationale correctly — but it also records, in the
same entry, a **BORN-RED HANDOFF (P-invariant-28)**: *"the FULL engine-seam
transposition the D.W4 audit named ('the 1100-line god-object at the right seam' —
the lifecycle/playback machine lifted off the frame-compile facade) is a DEFERRED
future-tranche split, NOT a silent punt; it is too deep+risky to rush (it re-threads
the FrameCompiler's `this`-bound re-derive contract). Named here so the deferral is
citable, not invisible."* The D.W4 audit named this seam; every tranche since (D→E→
F→G→H→I→J→K→L) has deferred it. Lane-11 §10 names it the single largest structural
debt in the library surface. M is where it is scheduled — the deferral has reached
the point where "named-not-silent" demands an action: implement the transposition,
or re-defer with a revised rationale that says WHY the precondition still isn't met.

**The seam (what splits, and where).** `engine.ts` defines `KeyframesAnimation<V>`
(the L.W8 PKG-3 rename of `Animation`, `engine.ts:101`) + `CSSKeyframesAnimation<V>
extends KeyframesAnimation<V>` (`:1207`). The class body is a four-concern state
machine the override `why` already names (`:135–139`):

1. **the compile-delegation facade** — `parse()` (`:352`), the `_compiler:
   FrameCompiler<V>` field (`:124`), `get compiler` (`:126`), `get frames`
   (`:325`), `adoptCompiler` (`:399`), the per-frame `interpFrames` (`:633`);
2. **the live-options-reference setters** — `setDuration`/`setDelay`/`setDirection`
   /`setFillMode`/`setTimingFunction`/`setIterationCount`/`setColorSpace`/
   `setHueMethod`/`setUseWAAPI`/`setRespectReducedMotion`/`setComposite`/
   `setOptions`/`setTargets` (`:437–1205`), each mutating `this.options` in place
   (NEVER replacing it — the `this.options === this.compiler.options` identity the
   re-derive depends on, `:382–402`);
3. **the lifecycle/playback machine** — `play`/`pause` (`:1085`)/`resume`
   (`:1092`)/`stop` (`:1120`)/`playing` (`:1127`)/`get effectiveT` (`:1132`)/
   `settle` (`:1143`)/`reset` (`:1162`)/`paintRest` (`:596`)/`_frame` (`:896`)/
   `_renderFrame` (`:921`)/`_snapToReducedMotion`/`advanceTo`/the `readonly
   playback: RAFPlayback` handle;
4. **the fill/rest contract** — `restPosition` (`:588`), `fillForwards`/
   `fillBackwards`, the completion `paintRest()→settle()` terminal path.

The D.W4-named split lifts concern **3** (the lifecycle/playback machine) off the
frame-compile facade (concern **1**) — the "1100-line god-object at the right seam."
The lane-11 §6 expected outcome: `engine.ts` 1397L → ~900L; the extracted module is
`engine-playback.ts` (or `engine-lifecycle.ts`) — colocated INTERNAL, statically
imported by `engine.ts`, never re-exported beyond the engine, following the EXACT
`engine-composition.ts` (221L) / `engine-options.ts` (193L) / `engine-css-metadata.ts`
(148L) precedent the K.WZ + L.WZ extractions established and `proof:boundary`
already accepts (lane-11 §2.1: "colocated helpers the engine calls with thin call
sites, never re-exported beyond the engine"; the chunk topology is unchanged because
the extracted module rides the same `loadAnimationEngine()` dynamic chunk).

**The one load-bearing thread (why it is deferred, not trivial).** The override
`why` names it exactly: the split *"re-threads the FrameCompiler's `this`-bound
re-derive contract."* Concern 3 is NOT a pure helper set like the prior three
extractions. `_frame` (`:896`) calls `this.advanceTo(t)` → `this._renderFrame(t)`
→ `this.interpFrames(t, true, this._interpOut)` (`:929`) — the playback loop reads
the compiled `this.frames` (`:325`, which reads off `this._compiler`) and the live
`this.options` (`:288–294`) every tick. The setters (concern 2) mutate
`this.options` in place SPECIFICALLY so the playback loop sees the change without a
recompile (`:288–294`: *"the setters mutate that object in place, never replace
it"*); `setDuration` even re-reads `this.frames` to re-time each frame (`:453–462`).
So the lifecycle/playback machine cannot be a free function over a value-bag — it
shares the `this`-bound re-derive seam with the compile facade. The extraction must
either (a) keep the playback methods as thin `this`-delegates to an
`engine-playback.ts` module that takes the engine instance (the
`engine-composition.ts` precedent: `applyComposition(this, …)`), or (b) define a
playback mixin/protocol over a narrow `PlaybackHost` interface (`{ frames, options,
advanceTo, interpFrames, done, paused }`) the class satisfies — either way the
`this.options === this.compiler.options` identity and the per-tick `this.frames`
read MUST survive the move byte-for-byte (the gate-locked observable; see S3).

**Why VJ-L1 is the precondition (the FN_NAME coupling).** The split is BLOCKED on a
value.js-side fix because one of the `this`-context couplings that makes engine
splitting risky is NOT in `engine.ts` itself but in the `utils.ts` interpolation
seam the engine's compile half reaches through: kf stamps a private `FN_NAME =
Symbol("kf.fnName")` (`utils.ts:45`) onto published `ValueUnit` instances to carry
the flatten-origin function name through the interp pipeline, re-stamped on every
`.clone()` because `ValueUnit.clone()` drops it (`utils.ts:54,64,218,294,298,366` —
12 grep hits, verified 2026-06-17). Lane-11 §8 is explicit: *"The Symbol stamp is
one of the `this`-context couplings that make engine splitting risky… The M
engine-split wave should WAIT on VJ-L1 or explicitly scope the split to avoid the
Symbol-stamped paths."* The provenance belongs in value.js's flatten API
(`flatLeaf(valueUnit, { fnName })` — VJ-L1, `KF-TO-VALUEJS-O-ASKS.md §8`); M.W9 is
the consume wave that deletes the Symbol on the value.js 0.14.0 re-pin. Until M.W9
lands, the engine's compile→interp seam carries a hidden Symbol sidechannel on a
class kf does not own — splitting the playback machine off the facade while that
sidechannel is live risks the kind of invisible-state coupling the D.W4 audit
flagged. So **M.W13 is gated on M.W9** (the FN_NAME delete), which is itself gated
on value.js 0.14.0 (VJ-L1). This wave does NOT delete the Symbol (that is M.W9's
S3); it CONSUMES the cleared seam.

**The ceiling regime, reconsidered (lane-11 §3 — is the 550/700/1400 a
contrivance?).** The auditor's brief asks whether the override regime itself is a
contrivance M should reconsider. Lane-11 §3 answers NO, with evidence: the regime is
SOUND (it catches genuinely un-cohesive sprawl; the override mechanism with
rationale + stale-guard is the correct GESTALT shape — "record the cohesion
justification, force re-examination if the file drops back under the base cap"); the
four L decompositions it forced were all genuinely cohesive (none manufactured a
seam); the 550L base is "genuinely tight for language-feature-heavy TypeScript" and
the OVERRIDE mechanism exists precisely for that. The REAL issue is **discovery
latency** (lane-11 §3.3 / DF-11-C): L found four over-ceiling reds only at the full
`proof:all` roster re-run, because per-wave incremental checks used piped exit codes
that masked the ceiling red — a GATE-INFRASTRUCTURE issue, fixed by M.W2's LINT-tier
consolidation (sub-second per-save ceiling checks), NOT a ceiling-regime issue. M's
verdict (lane-11 §3.3): **do NOT raise or abolish the ceilings.** This wave does NOT
reconsider the regime as a contrivance — it AFFIRMS the regime and discharges the
one debt the regime correctly surfaced and parked (the engine.ts:1400 override is
the most-deferred named exception; this wave RETIRES it by curing its root, not by
raising it). The 1400 cap was never a contrivance — it was an honest cohesion floor
with a citable HANDOFF; M closes the HANDOFF.

**The three-place override enforcement (the gate ground truth M.W13 must address).**
The engine.ts ceiling is enforced in THREE gates, not one (verified 2026-06-17):
1. `proof:decomposition` clause-1 — `LIBRARY_CEILING_OVERRIDE` engine.ts cap 1400
   (`proof-decomposition.mjs:128–159`), with the stale-override guard
   (`:381–389`) that REDS if engine.ts drops back under the 550 base while the
   override entry survives;
2. `proof:engine` — the `ANIMATION_CLASS_CEILING` clause measuring the
   `KeyframesAnimation` class body specifically (`proof-engine.mjs:79–104`: locate
   `export class KeyframesAnimation<` → its closing brace, fail if the span exceeds
   the class ceiling — "the god-object is regrowing");
3. `proof:engine-no-throw-on-play` — the `[hygiene g]` engine.ts file-line ceiling
   (`proof-engine-no-throw-on-play.mjs:82–91`, `LIMIT` enforced against the engine.ts
   line count).
A split that moves the playback machine OUT of engine.ts shrinks the file AND the
`KeyframesAnimation` class body — all three clauses must be re-pointed to the
post-split reality in ONE pass, and the stale-override guard (#1) means the override
entry CANNOT simply be left in place once the file drops under 550 (it would red as
stale) — it MUST be removed. This is the engine.ts the wave makes ~900L: still over
the 550 base, so the override is NOT removed-to-zero — it is RE-WRITTEN with a lower
cap (~900) and a revised `why` (the deep split DONE, the group.ts arm the remaining
HANDOFF), OR removed if the post-split engine.ts lands under 550 (the gate's stale
guard then keeps it honest). The exact post-split cap is a measured outcome, not a
spec number — the gate-first witness (S4) is the override REMOVED, RED on 1397L,
forcing the split.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-17 unless noted) |
|-----|-----------------|------------------------------------------|
| lane-11 §1.1 / §10 | `wc -l src/animation/engine.ts` | **1397L** — 3L under the 1400 override cap; the only `src/animation/**` file capped over 900 |
| lane-11 §6 DF-11-A | `proof-decomposition.mjs:151–157` | the engine.ts override `why` carries the BORN-RED HANDOFF (P-invariant-28) text verbatim — "the FULL engine-seam transposition… the lifecycle/playback machine lifted off the frame-compile facade… DEFERRED… NOT a silent punt" |
| lane-11 §6 DF-11-B | `proof-decomposition.mjs:200–205` | the group.ts override `why` co-defers the compositor-seam split WITH the engine.ts transposition — "it separates only once the engine's composite contract is re-threaded" |
| lane-11 §7 / §8 | `docs/tranches/M/audit/lane-11-decompositions.md §7–8` | MW-11-1 names the wave + its two preconditions: value.js VJ-L1 flatLeaf + the LINT-tier consolidation |
| precondition (FN_NAME) | `grep -nc 'FN_NAME\|stampFnName\|fnNameOf\|NamedValueUnit' src/animation/utils.ts` → **12** | `utils.ts:45` (`const FN_NAME = Symbol("kf.fnName")`), `:47` (type), `:50–51`/`:54–55` (reader/writer), `:64,218,294,298` (re-stamps), `:366` (arity-pad read) — the Symbol sidechannel VJ-L1 retires (M.W9 S3) |
| the seam | `src/animation/engine.ts:101,1207` | `export class KeyframesAnimation<V>` + `class CSSKeyframesAnimation<V> extends KeyframesAnimation<V>` |
| concern 1 (compile facade) | `src/animation/engine.ts:124,126,325,352,399,633` | `_compiler`, `get compiler`, `get frames`, `parse()`, `adoptCompiler`, `interpFrames` |
| concern 3 (playback machine) | `src/animation/engine.ts:596,896,921,1085,1092,1120,1143,1162` | `paintRest`, `_frame`, `_renderFrame`, `pause`, `resume`, `stop`, `settle`, `reset` |
| the `this`-bound re-derive seam | `src/animation/engine.ts:288–294,382–402,453–462` | the setters mutate `this.options` in place (never replace); `this.options === this.compiler.options` identity; `setDuration` re-reads `this.frames` to re-time — the contract the split MUST preserve byte-for-byte |
| per-tick compile read | `src/animation/engine.ts:914–929` | `_frame` → `advanceTo` → `_renderFrame` → `interpFrames(t, true, this._interpOut)` reads `this.frames`/`this.options` every tick (the playback↔compile coupling) |
| precedent | `wc -l src/animation/engine-composition.ts engine-options.ts engine-css-metadata.ts` → **221 / 193 / 148** | three colocated INTERNAL helper modules engine.ts statically imports (`engine.ts:42–62`), never re-exported beyond the engine — the extraction pattern this wave extends (lane-11 §2.1) |
| ceiling gate #1 | `proof-decomposition.mjs:128–159,381–389` | the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry + the stale-override guard (an override whose file drops under the base cap REDs) |
| ceiling gate #2 | `proof-engine.mjs:79–104` | the `ANIMATION_CLASS_CEILING` clause measures the `KeyframesAnimation` class body span specifically ("the god-object is regrowing") |
| ceiling gate #3 | `proof-engine-no-throw-on-play.mjs:82–91` | the `[hygiene g]` engine.ts file-line ceiling (`LIMIT`) |
| gate exit today | `node scripts/proof-decomposition.mjs` → **exit 0** | passes ONLY because the override exists; the deep split is the named HANDOFF, not a current red |
| regime verdict | lane-11 §3.3 | the 550/700/1400 regime is SOUND — do NOT raise or abolish; the L-close discovery-latency is the issue, fixed by M.W2's LINT tier |
| dep | M.W9 §S3 (`docs/tranches/M/waves/M.W9.md`) | the `FN_NAME` Symbol delete arm (S8) on the value.js 0.14.0 / VJ-L1 consume — M.W13's precondition |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. Together they lift the
lifecycle/playback machine off the frame-compile facade, retire the engine.ts:1400
override, re-point the three parallel ceiling gates, and dispose the co-deferred
group.ts arm — every move a cohesion-seam extraction following the
`engine-composition.ts` precedent, NONE a split-for-line-count (lane-11 §5: zero
precept violations across the L decompositions; this wave holds the same bar).

---

### S1 — Lift the lifecycle/playback machine into `engine-playback.ts` (the D.W4 split)

**Breach.** `engine.ts` is 1397L because concern 3 (the lifecycle/playback machine:
`_frame`/`_renderFrame`/`paintRest`/`play`/`pause`/`resume`/`stop`/`settle`/`reset`/
`playing`/`effectiveT`/`advanceTo`/`_snapToReducedMotion` + the `readonly playback:
RAFPlayback` drive wiring) rides WITH the compile-delegation facade (concern 1) in
one class body. The D.W4 audit named this the "1100-line god-object at the right
seam"; it is the single largest structural debt in the library (lane-11 §10).

**Cure.** Extract concern 3 into a colocated INTERNAL module `engine-playback.ts`
(or `engine-lifecycle.ts`), statically imported by `engine.ts`, never re-exported
beyond the engine — the EXACT `engine-composition.ts` / `engine-options.ts` /
`engine-css-metadata.ts` precedent (lane-11 §2.1). The playback methods become thin
`this`-delegates whose bodies live in `engine-playback.ts`, taking the engine
instance (the `applyComposition(this, …)` precedent) OR keyed off a narrow
`PlaybackHost` protocol (`{ frames, options, done, paused, advanceTo, interpFrames,
playback, dispatchEvent? }`) the `KeyframesAnimation` class satisfies. The choice
between the two binding styles is an IMPL decision; BOTH preserve the
`this`-bound re-derive contract (S3). Expected outcome (lane-11 §6): `engine.ts`
1397L → ~900L; `engine-playback.ts` carries the lifted machine.

**Constraint (the `this`-bound re-derive contract survives byte-for-byte — the one
load-bearing thread).** The override `why` and lane-11 §6 both name the risk: the
split *"re-threads the FrameCompiler's `this`-bound re-derive contract."* The
extraction MUST preserve, with zero behaviour change: (1) the `this.options ===
this.compiler.options` identity (the setters mutate-in-place, never replace —
`engine.ts:288–294,382–402`); (2) the per-tick `this.frames`/`this.options` read in
the playback loop (`_frame`→`advanceTo`→`_renderFrame`→`interpFrames`,
`engine.ts:914–929`); (3) the hoisted `_interpOut` zero-alloc buffer reuse
(`engine.ts:929`, `proof:standalone-zero-alloc`); (4) the managed-child contract
(a child throws on direct `play()` when `managed`; the group owns the loop —
`src/animation/CLAUDE.md` managed-child section). The acceptance oracle is the FULL
engine test + gate suite GREEN with the methods moved (S3) — not a re-derivation.

**Constraint (INTERNAL, boundary-preserving — the chunk topology is unchanged).**
`engine-playback.ts` is statically imported by `engine.ts` (like its three
siblings), so it rides the same `loadAnimationEngine()` dynamic chunk —
`proof:boundary` is unchanged (it verifies the PROPERTY: zero static
`@mkbabb/value.js` edge on a LIGHT module; `engine-playback.ts` is a HEAVY module by
construction, reached only through the engine). `proof:published-surface` is
unchanged (the playback methods stay on the `KeyframesAnimation` class — only their
bodies move). The barrel sees no change (lane-11 §4.1: "the external API is
UNCHANGED").

**Gate bite (S4 coverage).** With the override removed (S4) and concern 3 still in
engine.ts, `proof:decomposition` REDs (1397L > 550 base). After the extraction:
engine.ts ~900L; the override re-written to a ~900 cap with a revised `why` (S2);
the gate GREENs. The full engine/playback test suite stays GREEN (S3, zero behaviour
change).

---

### S2 — Retire the engine.ts:1400 override; re-point the THREE parallel ceiling clauses

**Breach.** The engine.ts ceiling is enforced in THREE places (verified
2026-06-17): `proof:decomposition`'s `LIBRARY_CEILING_OVERRIDE` engine.ts:1400
entry (`:128–159`) with the stale-override guard (`:381–389`); `proof:engine`'s
`ANIMATION_CLASS_CEILING` clause measuring the `KeyframesAnimation` class body span
(`proof-engine.mjs:79–104`); and `proof:engine-no-throw-on-play`'s `[hygiene g]`
engine.ts file-line `LIMIT` (`:82–91`). A split that shrinks engine.ts + the class
body without re-pointing all three leaves the gates measuring a reality that no
longer exists (and the stale-override guard REDs if the override survives while the
file drops under the base cap).

**Cure.** In ONE pass, re-point all three:
1. **`proof:decomposition`** — REMOVE the engine.ts:1400 `LIBRARY_CEILING_OVERRIDE`
   entry if post-split engine.ts is ≤ 550 (the gate's stale guard then enforces the
   base cap directly); OR RE-WRITE it to a measured ~900 cap with a revised `why`
   that records the deep split DONE (the lifecycle/playback machine lifted to
   `engine-playback.ts`) and names the REMAINING HANDOFF (the group.ts compositor
   arm, S5) — the cap reflects the post-split cohesive floor, not the old 1400. The
   stale-override guard makes the wrong choice red (an over-large cap on an
   under-cap file).
2. **`proof:engine`** — re-point the `ANIMATION_CLASS_CEILING` clause's expected
   span to the post-split `KeyframesAnimation` class body (now ~half its prior size,
   the playback methods being thin delegates or absent). The clause's PURPOSE ("the
   god-object is regrowing") is preserved; only the measured ceiling moves down.
3. **`proof:engine-no-throw-on-play`** — re-point the `[hygiene g]` `LIMIT` to the
   post-split engine.ts file-line reality (~900 or the measured value).

**Constraint (the cap is a measured outcome, NOT a spec number — no contrivance).**
The post-split engine.ts line count is whatever the cohesive split produces; the
spec does NOT pre-commit a number. The override's revised cap (if kept) sits JUST
ABOVE the measured post-split size (the `waapi.ts:650`/`spring.ts:700` precedent:
"the cap sits just above the current Nl — further unjustified growth reds"), so the
stale guard keeps it honest. This is the regime working as designed (lane-11 §3.2),
not a new contrivance — the override regime is AFFIRMED (lane-11 §3.3: do not raise
or abolish), and this wave RETIRES the one most-deferred exception by curing its
root (the deep split), not by raising the cap.

**Gate bite (S4 coverage).** Before S1: the override is REMOVED (S4) → all three
ceilings red on 1397L. After S1+S2: engine.ts ~900L, the class body halved, the
three clauses re-pointed → all three GREEN. The stale-override guard reds if a kept
override has an over-large cap (forcing the measured value).

---

### S3 — Behaviour-byte-identical: the full engine/playback gate suite GREEN through the move

**Breach.** The split re-threads the `this`-bound re-derive contract (the override
`why`'s named risk); a careless move could break the `this.options ===
this.compiler.options` identity, the per-tick `this.frames` read, the zero-alloc
buffer reuse, the managed-child loop ownership, or the event ordering — none of
which a source-shape ceiling gate sees.

**Cure (the REAL observable — the behaviour, not the line count).** The extraction
is correct ONLY when the runtime behaviour is byte-identical. The acceptance oracle
is the FULL set of engine/playback runtime gates GREEN with the methods moved,
each asserting a behaviour the split could break:
- `proof:engine` + `proof:engine-no-throw-on-play` — the engine constructs, parses,
  and plays without throwing across the fixture sweep (`fromString`/`fromKeyframes`
  paths, `proof-engine-no-throw-on-play.mjs:515–541`);
- `proof:standalone-zero-alloc` — the hoisted `_interpOut` buffer reuse survives
  (no per-frame allocation regression in the steady playback path,
  `engine.ts:929`);
- `proof:event-ordering` — `animationstart`/`animationiteration`/`animationend`
  dispatch order + the sync-fast-path/async-first-tick distinction
  (`RAFPlayback.advanceTo` thenable contract, `src/animation/CLAUDE.md` RAFPlayback
  section) is preserved through the move;
- `proof:finished` + the managed-child contract — `play`/`pause`/`resume`/`stop`/
  `reset`/`settle` transport semantics + the managed-child "group owns the loop,
  child throws on direct play()" invariant (`src/animation/CLAUDE.md`) hold;
- the vitest engine/playback suite (`test/*.test.ts` covering the lifecycle) — the
  `restPosition`/`paintRest`/fill-mode terminal path + the reduced-motion snap.

**Constraint (inv-M-observable-truth — the gate bites the behaviour that breaks, not
a proxy).** The born-RED gate (S4) is the ceiling (override-removed); but the
ACCEPTANCE of the cure is the behavioural suite, because the split's RISK is a
behaviour regression, not a line count. A green ceiling alone is NOT the cure claim
— a split that shed lines but broke the `this.options` identity would pass the
ceiling and fail the round-trip. The wave is DONE only when the override is retired
(S4 green) AND every behavioural gate above stays GREEN through the move (no
regression). This is the L.W1-S4 lesson applied to a structural wave: the observable
is the playback BEHAVIOUR + the zero-alloc/event-ordering/managed-child invariants,
not the file-size number alone.

**Gate bite.** Plant the extraction with the contract preserved → all behavioural
gates GREEN + the ceilings GREEN (S2). Plant a BREAKING extraction (e.g. replace the
in-place `this.options` mutation with a fresh-object assignment) → `proof:engine` /
the round-trip suite RED even though the line count dropped — the discriminating
witness that the cure is the behaviour, not the size.

---

### S4 — The born-RED witness: `proof:decomposition` with the engine.ts override REMOVED

**Breach (the gate-first law — the override masks the debt).** Today
`proof:decomposition` exits 0 (verified 2026-06-17) ONLY because the
`LIBRARY_CEILING_OVERRIDE` engine.ts:1400 entry raises the cap above the 1397L file.
The override is JUSTIFIED, but it MASKS the deep-split debt — the gate is green over
a god-object the D.W4 audit named for splitting. A wave that just "splits engine.ts"
without first removing the override would have NO born-RED witness — it would be a
cure with no failing gate, the anti-pattern the gate-first law forbids.

**Cure (author the born-RED FIRST — before S1's extraction).** Remove the engine.ts
`LIBRARY_CEILING_OVERRIDE` entry (or temporarily lower its cap to the 550 base) and
run `node scripts/proof-decomposition.mjs`: it exits 1, naming
`src/animation/engine.ts: 1397L exceeds the 550L library ceiling` (the gate's
clause-1 message, `proof-decomposition.mjs:357–364`). This is the genuine
structural debt made RED — the 1397L god-object measured against the base cohesion
floor, with no exception. The same removal makes `proof:engine`'s
`ANIMATION_CLASS_CEILING` and `proof:engine-no-throw-on-play`'s `[hygiene g]`
red against their pre-split limits (S2 re-points them post-cure). Record the RED as
the named oracle.

**The REAL observable (inv-M-observable-truth — the structural debt, not a proxy).**
The born-RED witness is the GENUINE defect: a 1397-line module carrying a
1100-line god-object that should split at the lifecycle/playback seam. It is NOT a
proxy — the gate reads the real `wc -l` of the real `engine.ts` and measures it
against the real base ceiling. The RED is the actual debt DF-11-A names (lane-11
§10), live on today's tree the instant the override is lifted. A gate that merely
greps "does `engine-playback.ts` exist" would be the proxy mistake (it would green on
a manufactured empty file); this gate bites the SIZE of the un-split god-object,
which only a genuine cohesive extraction reduces.

**Two-witness sequencing (gate-first — the RED bites BEFORE the cure).**
1. **Born-RED witness (today):** remove the engine.ts override → `node
   scripts/proof-decomposition.mjs` exits 1 naming engine.ts at 1397L over the 550
   base. Record the RED.
2. **GREEN witness (after S1+S2+S3):** the lifecycle/playback machine is in
   `engine-playback.ts`; engine.ts is ~900L; the override is retired or re-written
   to the measured cap with a revised `why`; the three ceiling clauses are
   re-pointed; the full behavioural suite (S3) is GREEN. `node
   scripts/proof-decomposition.mjs` → exit 0 WITHOUT the 1400 override (the debt
   discharged, not re-parked).

**Gate bite.** `proof:decomposition` exit 1 on today's tree once the override is
removed (the 1397L god-object over the base cap); exit 0 after the transposition
shrinks engine.ts and the override is retired/re-written. The discriminating witness
is the file SIZE reduction by a genuine cohesive split — a manufactured seam (an
empty `engine-playback.ts` with no real lifted machine) leaves engine.ts over-cap
and the gate red.

---

### S5 — Dispose the co-deferred group.ts compositor split (the DF-11-B arm — P-invariant-28)

**Breach.** `group.ts` is 812L (verified 2026-06-17), under its 820 override cap.
The override `why` (`proof-decomposition.mjs:200–205`) co-defers the deep
compositor-seam split (buffer/blend/lifecycle/batch fully separated) WITH the
engine.ts transposition: *"it separates only once the engine's composite contract is
re-threaded; deferred to the same future tranche, named here so the deferral is
citable."* The two splits are COUPLED — the `AnimationGroup` compositor references
the engine's composite seam (lane-11 §6 DF-11-B: "Both splits are coupled… They are
co-deferred correctly"). Now that the engine seam is being re-threaded (S1), the
P-invariant-28 obligation falls due on the group.ts arm too: schedule it, or
re-defer with a revised rationale.

**Cure (the disposition — IMPL chooses ONE, the spec names both honestly).** This
wave's S1 re-threads the engine's composite contract — the precondition the group.ts
`why` named. The disposition is ONE of:
- **(a) Land WITH the engine split.** If S1's re-threaded composite contract makes
  the `AnimationGroup` buffer/blend/lifecycle/batch seam cleanly separable (the
  group's per-frame composite no longer reaches into engine internals through the
  old `this`-bound seam), extract it to `group-compositor.ts` (the
  `group-layer-springs.ts` precedent the K.W11 retirement already established —
  `proof-decomposition.mjs:189–199`), retire the group.ts:820 override or re-write
  it to the measured cap, and the co-deferral discharges in the same wave.
- **(b) Re-defer with a REVISED rationale (named-not-silent — P-invariant-28).** If
  S1's engine re-thread does NOT yet make the group seam cleanly separable (the
  composite contract is re-threaded but the `gate-anchored composite STATEMENTS` the
  `weighted` leaf + spring seam need stay inline — `proof-decomposition.mjs:191–199`
  lists them: the `?? layer.weight` read, `layer.weightSpring = spring`,
  `existing.target`, the per-frame `spring.tickDt(dt)`, the settle commit/clear,
  locked by `proof:spring-blend-weight` + `proof:blend`), re-write the group.ts
  override `why` to state WHY the arm still holds AFTER the engine split — a REVISED
  rationale, not the old text re-stamped. The deferral stays citable (the next
  tranche's named obligation), discharging the P-invariant-28 "named-not-silent"
  duty without a silent punt.

**Constraint (no manufactured split — the group.ts seam is real or it waits).**
Lane-11 §2.3 / §5 establish the bar: every L extraction was genuinely cohesive, NONE
manufactured. If (a) would require carving the gate-locked composite statements off
their seam (the `proof:spring-blend-weight`-anchored block), it is FORBIDDEN — (b)
is the honest disposition. The choice is evidence-driven (does the re-threaded
composite contract make the seam clean?), not a line-count chase.

**Gate bite.** Under (a): `proof:decomposition` green WITHOUT the group.ts:820
override (the split done) AND `proof:spring-blend-weight` + `proof:blend` +
`proof:zero-alloc` GREEN (the composite behaviour preserved, the K.W11 precedent's
acceptance set). Under (b): the group.ts override survives with a REVISED `why`
naming the post-engine-split deferral reason; `proof:decomposition` green WITH the
re-written override; the stale guard confirms the file is still over the base cap
(the override is live, not stale). Either disposition is a green gate over an HONEST
state — the co-deferral resolved, not silently carried.

---

## Born-RED gate

**Gate:** `proof:decomposition` with the `LIBRARY_CEILING_OVERRIDE` engine.ts:1400
entry REMOVED (the cap reverts to the 550L base) — EXISTING gate, the override
removal is the born-RED trigger this wave authors FIRST (S4), before S1's
extraction. The two parallel engine-ceiling clauses (`proof:engine`'s
`ANIMATION_CLASS_CEILING`, `proof:engine-no-throw-on-play`'s `[hygiene g]`) red in
the same removal and are re-pointed by S2. The acceptance of the cure is the FULL
behavioural engine/playback gate suite (S3) — the split's RISK is a behaviour
regression, not a line count.

**The REAL observable (inv-M-observable-truth).** The born-RED witness is the
GENUINE structural defect, measured live — NOT a proxy (the L.W1 S4 lesson):

| Clause | Witness on today's tree | Failure mode today (the REAL observable) | Expected after cure |
|--------|-------------------------|------------------------------------------|---------------------|
| S4 override-removed decomposition | remove the engine.ts override → `node scripts/proof-decomposition.mjs` | **exit 1** naming `src/animation/engine.ts: 1397L exceeds the 550L library ceiling` — the real `wc -l` of the un-split 1100-line god-object measured against the base cohesion floor, no exception (the genuine DF-11-A debt, lane-11 §10) | exit 0 WITHOUT the 1400 override — engine.ts ~900L, the lifecycle/playback machine in `engine-playback.ts`, the override retired/re-written to the measured cap |
| S3 behavioural acceptance | the full engine/playback gate suite (`proof:engine`, `proof:engine-no-throw-on-play`, `proof:standalone-zero-alloc`, `proof:event-ordering`, `proof:finished` + the vitest lifecycle suite) | GREEN today (the machine is intact in engine.ts) — the split MUST keep them GREEN; a break in the `this.options===compiler.options` identity / per-tick `this.frames` read / zero-alloc buffer / event ordering / managed-child loop is the real regression a size-only gate misses | GREEN through the move — the `this`-bound re-derive contract preserved byte-for-byte |
| S5 group.ts co-deferral | `wc -l src/animation/group.ts` → 812L; `proof-decomposition.mjs:200–205` | the group.ts:820 override co-defers the compositor split WITH the engine seam — P-invariant-28 falls due on the engine re-thread | disposition (a) split done, override retired + `proof:spring-blend-weight`/`proof:blend` GREEN; OR (b) override re-written with a REVISED `why` naming the post-engine-split deferral reason (named-not-silent) |

**Today's tree result.** `proof:decomposition` exits 0 ONLY because the engine.ts
override exists; with the override removed it exits 1 naming engine.ts at 1397L over
the 550 base — the genuine god-object debt, live, not a proxy. The behavioural suite
is green today (the machine is intact); the split must keep it green (inv-M-observable
-truth: the observable is the playback behaviour + the zero-alloc/event-ordering/
managed-child invariants, not the line count).

**Green condition.** The lifecycle/playback machine is lifted into
`engine-playback.ts` (S1) following the `engine-composition.ts` precedent, with the
`this`-bound re-derive contract preserved byte-for-byte; engine.ts is ~900L; the
engine.ts:1400 override is retired or re-written to the measured cap with a revised
`why` (S2); the three parallel ceiling clauses are re-pointed (S2);
`proof:decomposition` exits 0 WITHOUT the 1400 override; the full behavioural
engine/playback gate suite stays GREEN through the move (S3, zero behaviour change);
and the co-deferred group.ts compositor arm is disposed — split-with-engine or
re-deferred with a revised rationale (S5, P-invariant-28 discharged).

---

## Dependencies

- **value.js Tranche O VJ-L1 flatLeaf — THE blocking HANDOFF (via M.W9).** The safe
  split is gated on the `FN_NAME` Symbol delete (M.W9 S3), which is itself gated on
  value.js 0.14.0 (VJ-L1 — the `flatLeaf(valueUnit, { fnName })` provenance API that
  carries the flatten-origin function name through `.clone()`). Lane-11 §8: *"The
  Symbol stamp is one of the `this`-context couplings that make engine splitting
  risky… The M engine-split wave should WAIT on VJ-L1 or explicitly scope the split
  to avoid the Symbol-stamped paths."* M.W13 does NOT delete the Symbol (M.W9's S3
  does); it CONSUMES the cleared `utils.ts` interp seam. The HANDOFF chain:
  value.js 0.14.0 publish → M.W9 consume (FN_NAME deleted) → M.W13 split. Registry
  state (verified via M.W9): `@mkbabb/value.js@0.14.0` → E404 (unfired) as of
  2026-06-17 — M.W13 is a HANDOFF-gated wave, not startable until M.W9 lands.
- **M.W9 (the value.js-O consume) — the in-tranche precondition.** M.W9 S3 deletes
  the `FN_NAME` Symbol on the value.js 0.14.0 re-pin. M.W13 opens only AFTER M.W9's
  consume commit lands (the cleared `utils.ts` seam). The two are sequenced
  (M.W9 → M.W13), not parallel — M.W13 reads the post-FN_NAME-delete `utils.ts`.
- **M.W2 (the LINT-tier consolidation) — the soft precondition (lane-11 §7 / DF-11-C).**
  The lane names a second precondition: the LINT tier landed so ceiling reds are
  caught per-save rather than at the roster re-run (the discovery-latency fix). It
  is a SOFT precondition — M.W13 can land without it, but the iterate-to-green during
  the split is far faster with it (ceiling checks sub-second). M.W2 is in Band A
  (lands early); M.W13 is in Band D (lands late) — the ordering is natural, no
  explicit gate.
- **Independent of every Band-B/Band-C correctness wave.** M.W13 is a PURE
  STRUCTURAL transposition (zero behaviour change, S3) — it touches `engine.ts`,
  the new `engine-playback.ts`, the three ceiling-gate scripts, and possibly
  `group.ts` + `group-compositor.ts` (S5). It does NOT touch the compile/ingest
  correctness surfaces (M.W5–W7), the densify path (M.W6), or the value.js/glass-ui
  consume pins (M.W8/W9/W10) beyond reading the M.W9-cleared `utils.ts`. No file
  collision with M.W12 (the perf benches).
- **Couples to M.W12 (perf — Band D sibling).** Both are Band D. M.W12 measures the
  hot paths; M.W13 moves the playback hot path (`_frame`/`interpFrames`) into a new
  module. The zero-alloc steady-state path (`_interpOut` buffer reuse) is a SHARED
  invariant — M.W13 S3 keeps `proof:standalone-zero-alloc` green; M.W12's bench
  asserts the throughput is unregressed. The two compose (the split is zero-alloc-
  preserving; the bench confirms no perf regression).
- **Couples to M.WZ (the close).** M.WZ's `proof:chronic-closure` re-pointed L→M
  reads DF-11-A discharged (the engine-seam transposition done) and DF-11-B disposed
  (group.ts split-or-re-deferred). The P-invariant-28 terminal-belt accounting in
  M/PROGRESS.md §"Open deferrals" records the engine arm as EXITED (built) and the
  group arm per S5's disposition.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 engine-playback extraction | The lifecycle/playback machine re-merges into the compile facade — engine.ts regrows past ~900L toward the old 1397L god-object; the D.W4-named seam is lost again (the debt DF-11-A re-opens, the 1400 override re-introduced) |
| S2 override retire + three-clause re-point | The engine.ts:1400 override survives the split (the stale-override guard REDs — a 1400 cap on a ~900L file is dead slack); OR the `ANIMATION_CLASS_CEILING` / `[hygiene g]` clauses keep measuring the pre-split limit, going blind to a class-body regrowth ("the god-object is regrowing" detector mis-calibrated) |
| S3 behaviour-byte-identical | The split breaks the `this.options === this.compiler.options` identity, the per-tick `this.frames`/`this.options` read, the `_interpOut` zero-alloc buffer reuse, the event-dispatch ordering, or the managed-child loop ownership — a behaviour regression a size-only ceiling gate is blind to (the inv-M-observable-truth bite: the observable is the playback behaviour, not the line count) |
| S4 born-RED override-removed | A "split engine.ts" cure with NO failing gate (the override masks the debt) — the gate-first law violated; OR a manufactured seam (an empty `engine-playback.ts`) that greps green on existence but leaves engine.ts over-cap — the size-of-the-un-split-god-object witness catches it |
| S5 group.ts co-deferral disposition | The group.ts compositor split is silently carried into yet another tranche (P-invariant-28 violated — the deferral made invisible); OR a manufactured carve of the `proof:spring-blend-weight`-anchored composite statements off their seam (lane-11 §2.3: no manufactured split) |

---

## Excluded from this wave

- **Deleting the `FN_NAME` Symbol from `utils.ts`** — that is M.W9's S3 (the
  value.js 0.14.0 / VJ-L1 consume arm). M.W13 is GATED on it (the precondition) and
  CONSUMES the cleared seam; it does not write the deletion. The Symbol delete and
  the engine split are two waves (M.W9 → M.W13), sequenced.
- **Reconsidering the 550/700/1400 ceiling regime as a contrivance to raise or
  abolish** — lane-11 §3.3 answers NO (the regime is SOUND; the L-close issue was
  discovery latency, fixed by M.W2's LINT tier, not the regime). M.W13 AFFIRMS the
  regime and RETIRES the one most-deferred exception (engine.ts:1400) by curing its
  root, not by raising any cap. Raising/abolishing the regime is explicitly NOT this
  wave (and is a KILL per lane-11 §3.3).
- **The discovery-latency LINT-tier consolidation (DF-11-C)** — M.W2's surface (the
  ceiling gates → ESLint custom rules for sub-second per-save feedback). M.W13 uses
  the per-save feedback if M.W2 has landed (soft precondition) but does not author
  the LINT tier.
- **Re-architecting the `CSSKeyframesAnimation extends KeyframesAnimation` class
  hierarchy** — the split lifts concern 3 (playback) into an INTERNAL module; it
  does NOT change the public class shape, the inheritance, or the
  `proof:published-surface` (the playback methods stay on the class — only their
  bodies move). A type-hierarchy change is out of scope (it would touch
  `proof:published-surface` + the 5.0.0 changelog — M.WZ's surface).
- **The group.ts compositor split as a forced deliverable** — S5 disposes the
  co-deferred arm (split-with-engine OR re-defer-with-revised-rationale), evidence-
  driven; it is NOT a mandated extraction. If the re-threaded composite contract
  does not make the group seam cleanly separable, the honest disposition is the
  revised-rationale re-deferral (P-invariant-28 named-not-silent), not a manufactured
  carve.
