# Q.WB3 — SoA completion: extend the Float64 fold to single-animation `processFrame` + dispatch a value.js `ColorChannelPlan` for the permanently-boxed color/computed tail (the first-frame-boxed + mixed-leaf gaps) + home the in-realm S8 `.fnName` parallel-array FALLBACK terminal

**Band:** B — Engine-perf + emerging-CSS Phase-2 · the SoA frontier (beyond the compositor).
**Phase:** **NOW** for the single-animation `processFrame` numeric fold (the `interp-buffer.bench.ts` SoA-vs-boxed arm already exists — a measure-first decision over a shipped bench). **GATED** for the color/computed arm (the value.js `ColorChannelPlan` consume — fires on the value.js 1.2.0 publish of the plan surface). **CONTINGENT-NOW** for the S8 `.fnName` parallel-array FALLBACK (S6 — authored NOW as a spec; the in-realm cure FIRES ONLY if the PRIMARY value.js VJ-Q4 consume is declined, the two being mutually exclusive).
**Sequence (DAG edges):** `Q.WA3 master-merge-reconcile ─► Q.WB3-numeric (NOW)`; `Q.WG2 value.js 1.2.0 (ColorChannelPlan) ─► Q.WG4 kf consume ─► Q.WB3-color (GATED)`. Sequenced AFTER Q.WF1 (the engine.ts split) is DESIRABLE but not required — the numeric fold lands cleanest on the post-split `engine-playback.ts`/`processFrame` seam (the friction pre-emption below). Independent of Q.WB1/WB2 (compile-time lowering, a different concern) and Q.WB4 (WAAPI emit).
**Owning-DM-or-idea:** `B1-kf-soa` (P.W2 SoA compositor fold is COMPLETE-for-what-it-scoped; the residual is the SINGLE-animation `processFrame` numeric path + the permanently-boxed color tail) + `B5-kf-engine-arch` Q.W-ENG2 (the standalone HEAVY interp boxed-AoS path — `processFrame`'s per-channel boxed `lerpValue`, the DOMINANT real-world path EVERY preset/`fromString`/single animation rides). The `Q.W-SOA-PROCESSFRAME` + `Q.W-COLOR-SOA-DISPATCH` proposed waves, plus the `Q.W-SOA-VERDICT-LADDER` K-monotonicity witness. **ALSO the in-realm S8-terminal FALLBACK home** (`DM-5 S8 FN_NAME`): this wave hosts the owner-favored in-realm parallel-array `.fnName` design as the EXPLICIT FALLBACK to the PRIMARY value.js VJ-Q4 `flatLeaf .fnName` consume (`Q.WG-GATED-CONSUMES` S4) — the two are MUTUALLY EXCLUSIVE; the parallel-array fires ONLY if value.js declines VJ-Q4. (The board names "Q.WB3 / the S8-terminal" as the in-realm home — S6 below makes that home explicit so no S8 spec is discovered mid-tranche.)

---

## Context

### The breach — P.W2 transposed the GROUP compositor; the DOMINANT single-animation path is still boxed-AoS

P.W2's SoA fold is genuinely complete and exemplary FOR WHAT IT SCOPED (`B1-kf-soa`): `group.ts:soaBlendLayer` folds the `add`/`weighted` GROUP compositor over a precomputed `Float64Array` plan, bit-identical (`maxErr=0`), zero-alloc, ADOPT in `soa-composite-decision.json` (the `soaOverBoxed` ratio is run-variable — currently ~2.27×/2.42× at K=8, comfortably above the 1.2× floor; no exact ratio is load-bearing). But the fold lives ONLY in the MULTI-animation compositor. The SINGLE-animation per-frame interp — `processFrame` (`engine.ts:745`, the boxed loop at `engine.ts:754`) — is still megamorphic boxed-AoS:

```js
for (const iv of frame.allInterpVars) lerpValue(eased, iv);   // engine.ts:754
```

This is a boxed, per-`InterpolatedVar` megamorphic dispatch on the path EVERY preset, every `fromString`, every single-property animation rides (`B5-kf-engine-arch` LOAD-BEARING GAP — "the standalone HEAVY interp path was NEVER transposed … the DOMINANT real-world path"). P.W2 explicitly EXCLUDED it (`P.W2.md:200`: "Extending SoA to `CSSKeyframesAnimation.processFrame` … a SEPARATE single-animation transposition"). Q is where it lands.

### The substrate already exists — the bench, the partition discipline, and value.js `lerpArray`

The hard parts are already built:

1. **The bench arm exists** — `bench/interp-buffer.bench.ts` already carries the SoA-vs-boxed K-ladder: "K=8 (translate3d+scale3d+rotateZ+opacity) · per-channel `_lerp` (current) · 600-frame window" (the BASELINE) vs "K=8 … SoA Float64Array+lerpArray · 600-frame window" (the candidate), with the W122 1.2×-at-K=8 floor recorded in `taxonomy.json:165-174`. The measure-first half is DONE — this wave graduates the bench to a born-RED decision gate.
2. **The partition discipline exists** — `group.ts:buildSoAPlans` (method at `group.ts:577`, partition logic `:598-643`) already classifies a key NUMERIC (every component an `isNumericUnit` `ValueUnit<number>`) or BOXED (any non-numeric/mixed element → the boxed residual, never split). The SAME K3 partition the `processFrame` fold needs — a pure-numeric frame segment folds into a `Float64Array`; a color/computed/mixed leaf stays boxed.
3. **The value.js fold primitive exists** — `lerpArray` (the `SpringProgress.setTargets` Float64 path the W122/J.W6 S2 ADOPT measured) is value.js's published contiguous-lerp. `processFrame`'s numeric subset packs into a `Float64Array` and folds through it, exactly as `soaBlendLayer` does for the compositor.

### The two gaps `B1-kf-soa` enumerates as the SoA frontier

1. **The first-frame-after-structural-change one-frame boxed gap** (DELIBERATE, bounded in the compositor — `B1-kf-soa` FINDING) — `transformFramesGrouped` runs the boxed path on the first frame after `_groupedKeysDirty` drops the plan. The single-animation analog: `processFrame` has no plan to seed; the first frame builds the partition, subsequent frames fold. This wave makes that seed-then-fold explicit (the partition built once at `parse`, reused per frame — the F.W4 zero-alloc discipline).
2. **The mixed-leaf + color/computed tail falls ENTIRELY to boxed** (permanent — `B1-kf-soa` Color-channel SoA finding) — a `Color` cannot live in a `Float64Array`, so `oklab`-channel leaves keep the per-element boxed `lerpColorValue`. The cure is a value.js `ColorChannelPlan` (a Float64 oklab-channel layout the compositor + `processFrame` fold through) — a value.js-side surface kf CONSUMES (the GATED arm). P.W2 named exactly this (`P.W2.md:203`: "A color-channel SoA is the K3 `lerpColorValue` Float64 plan idea (a value.js-side `ColorChannelPlan` consume), not this wave").

### The K-monotonicity witness is under-recorded (the durable-verdict gap)

`B1-kf-soa` FINDING: `soa-composite-decision.json` records ONLY K=8; the K=3/K=12 monotonicity (the proof the fold SCALES with channel count) is benched but never durably recorded. The ratio is run-variable (1.97–2.54× on the same machine — V8 JIT/GC noise), always safely above the 1.2× floor but NEVER a hard absolute-hz floor (the device-dependence-greening lesson). This wave records all three K-rungs + asserts SoA-over-boxed monotonicity in K, closing the witness.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-23) |
|-----|-----------------|------------------------------|
| processFrame-boxed | `src/animation/engine.ts:754` | `for (const iv of frame.allInterpVars) lerpValue(eased, iv)` — the boxed, megamorphic per-`InterpolatedVar` dispatch on the DOMINANT single-animation path |
| processFrame-method | `src/animation/engine.ts:745` | `processFrame(frame, t, transformFrames)` — lifted off the hot loop (a method, not a closure) so it allocates no per-frame closure (the F.W4 substrate) |
| allInterpVars-layout | `constants.ts` (`AnimationFrame.allInterpVars`) | the per-frame `InterpolatedVar[]` the SoA fold packs into a `Float64Array` |
| partition-discipline | `src/animation/group.ts:577-651` | `buildSoAPlans` (method at `:577`; partition logic `:598-643`) — the K3 numeric/boxed partition (`isNumericUnit` per component at `:615-624`, mixed → `boxedKeys` at `:631`/`:640`); the SAME discipline `processFrame` reuses |
| bench-arm-exists | `bench/interp-buffer.bench.ts` + `taxonomy.json:163-174` | the SoA-vs-boxed K=8 arm (per-channel `_lerp` baseline vs SoA Float64Array+lerpArray) — the W122 1.2× floor; the measure-first half is DONE |
| K-ladder-recorded | `bench/taxonomy.json:177-184` | K=8/K=10 SoA arms present; K=3/K=12 under-recorded in the durable decision JSON |
| compositor-decision | `scripts/soa-composite-decision.json` (VERIFIED 2026-06-23) | records ONLY K=8 (verdict ADOPT; the `soaOverBoxed` ratios are RUN-VARIABLE — the file currently reads add ~2.27× / weighted ~2.42×, re-recorded 2026-06-23; the earlier-cited 2.92×/3.01× drifted on a re-run, illustrating the run-variable-ratio finding — so NO exact ratio is pinned, only the ADOPT verdict + the ≥1.2× floor); the K-monotonicity witness (K=3/K=12 unrecorded) is the `Q.W-SOA-VERDICT-LADDER` gap |
| color-tail-permanent | `src/animation/group.ts:630-642` + `B1-kf-soa` | a `Color`/computed leaf cannot live in a `Float64Array` → permanently boxed; the `ColorChannelPlan` consume is the cure |
| lerpArray-primitive | value.js (`spring-vector-decision.json`, the `SpringProgress.setTargets` Float64 path) | `lerpArray` — the published contiguous-lerp primitive `processFrame`'s numeric subset folds through |
| P.W2-excludes-this | `docs/tranches/P/waves/P.W2.md:200,203` | P.W2 EXCLUDED `processFrame` SoA + the color-channel SoA (`ColorChannelPlan`) — both explicitly named as separate frontiers (this wave) |
| run-variable-ratio | `B1-kf-soa` FINDING | the SoA ratio swings 1.97–2.54× on the same machine (V8 noise) — NEVER a hard absolute-hz floor; the ratio is SAME-REPORT only |

---

## Scope

Each S-clause is concrete + falsifiable. The fold is the SAME `Float64Array`+`lerpArray` substrate P.W2 proved, applied to the single-animation `processFrame` numeric subset + (GATED) the color tail.

- **S1 — the measure-first decision (NOW, over the SHIPPED bench).** Graduate `bench/interp-buffer.bench.ts`'s SoA-vs-boxed K-ladder to a born-RED `proof:processframe-soa` over a NEW `scripts/processframe-soa-decision.json` (the P-inv-28 durable home). ADOPT (≥1.2× at K=8, the W122 floor) charters S2; KILL forbids it and ships the boxed `processFrame` as-is. The ratio is SAME-REPORT (the device-honesty spine).
- **S2 — the numeric `processFrame` fold (NOW, gated on S1 ADOPT).** Build the `(allInterpVars → Float64Array offset)` partition ONCE at `parse` (reused per frame, zero per-frame alloc — the F.W4 discipline); rewrite `processFrame`'s pure-numeric segment as a `lerpArray` fold over the packed buffer; the color/computed/mixed tail keeps the boxed `lerpValue` (the K3 partition). Bit-identical to the boxed path (`maxErr=0`).
- **S3 — the K-ladder monotonicity witness (NOW — closes the `B1-kf-soa` under-recorded gap).** Extend the decision JSON to record ALL THREE K-rungs (3/8/12) for BOTH `processFrame` (this wave) AND the existing compositor (`soa-composite-decision.json`), and assert SoA-over-boxed monotonicity in K (the proof the fold scales). Same-report ratios only — NO absolute-hz floor.
- **S4 — the value.js `ColorChannelPlan` consume (GATED on the value.js 1.2.0 VJ-Q8 publish).** Dispatch (`KF-TO-VALUEJS-Q.md` **VJ-Q8**, line 51) a `ColorChannelPlan` — a Float64 oklab-channel layout the compositor + `processFrame` fold through for the permanently-boxed color tail; the kf consume (re-pin ^1.2.0, fold the color leaves) is GATED on the publish.
- **S5 — the `SpringProgress.setTargets(Float64Array)` vector-sugar confirm (NOW companion).** `B5-kf-engine-arch` flags the `setTargets(Float64Array)` vector sugar as ADOPT-verdicted (`spring-vector-decision.json`) but ship-status-unconfirmed; this wave confirms-or-ships it inside the interp-SoA wave (the same `Float64Array` substrate).
- **S6 — the in-realm S8 `.fnName` parallel-array FALLBACK terminal (the explicit fallback home, fires ONLY if value.js declines VJ-Q4).** `DM-5 S8` (the `FN_NAME_MAP` WeakMap + the clone-restamp ceremony at `utils.ts:52,55,59,287,341`) exits via ONE of two MUTUALLY-EXCLUSIVE terminals. **The PRIMARY is the value.js VJ-Q4 `flatLeaf .fnName` consume** (`KF-TO-VALUEJS-Q.md` VJ-Q4 → `Q.WG-GATED-CONSUMES` S4, GATED on value.js 1.2.0; `fnNameOf(u)` reads `u.fnName`, the WeakMap + ceremony deleted). **This wave is the EXPLICIT FALLBACK home:** if value.js DECLINES VJ-Q4 (the terminal-or-KILL the dispatch carries), Q.WB3 ships the owner-favored in-realm parallel-array design — a kf-side `(leaf → fnName)` parallel array indexed by the stable iv layout (the SAME compile-stable layout the S2 numeric partition builds), so the provenance survives `clone()` without a WeakMap and without a foreign-Symbol stamp. The two terminals are mutually exclusive (NO double-implement): the parallel array is authored ONLY on a recorded VJ-Q4 decline. `proof:workaround-deletion` S8 flips PENDING→GREEN on whichever terminal fires (the `/FN_NAME|Symbol\(\s*["']kf\./` witness goes ABSENT either way). This S6 makes the in-realm fallback a SPEC NOW (not a mid-tranche discovery) so the "Q.WB3 / the S8-terminal" board reference resolves to a concrete clause.

---

### S1 — the measure-first decision (NOW, over the shipped bench)

**Breach.** The `processFrame` SoA win is benched (`interp-buffer.bench.ts`) but has NO durable decision home + NO born-RED gate. The compositor got `soa-composite-decision.json` + `proof:soa-composite`; the single-animation path got neither. A transposition with no decision-JSON gate is an open-ended deferral.

**Cure.** Author `scripts/proof-processframe-soa.mjs`, the born-RED gate over `interp-buffer.bench.ts`'s SoA-vs-boxed K-ladder, writing `scripts/processframe-soa-decision.json` (the P-inv-28 durable shape, `soa-composite-decision.json` lineage) with a `$comment` scoping the ratio to `processFrame` (the single-animation per-frame interp — NEVER the compositor or the transplanted `SpringProgress.setTargets` number). The `add`/`weighted` K-rungs' `floorFraction = 1.2` (the W122/J.W6 S2 ADOPT threshold) is the CHARTER GATE for S2: ADOPT (≥1.2×) authorizes the fold; KILL records the falsification and ships the boxed path. Routed through the portable `ratioGate` (`scripts/lib/portable-perf.mjs`) — SAME-REPORT, device-independent.

**Gate bite.** `proof:processframe-soa` `measured-first` clause: `processframe-soa-decision.json` exists, records the per-K ratio scoped to `processFrame`, and the `$comment` forbids citing the compositor/transplanted number. BITE: a decision-JSON whose `target` is `AnimationGroup.transformFramesGrouped` (the compositor path) or that copies the compositor's `soaOverBoxed` ratio (a DIFFERENT path) instead of a `processFrame`-measured ratio → the `$comment`/`target`-scope assertion reds. (The clause asserts the SCOPE, never a fixed ratio value — the ratio is run-variable.)

---

### S2 — the numeric `processFrame` fold (NOW, gated on S1 ADOPT)

**Breach.** `processFrame` (`engine.ts:754`) walks `frame.allInterpVars` with a boxed per-iv `lerpValue` — the megamorphic dispatch on the dominant path. Every preset, every `fromString`, every single-property animation pays the per-channel boxed tax on every frame.

**Cure (IF chartered).** Two parts at the stable seam:
- **The partition + buffer (built once at `parse`).** When the frame's `allInterpVars` are computed (`frame-compiler.ts` parse), classify each iv NUMERIC (a numeric `ValueUnit` start+stop) or BOXED (color/computed/mixed — the K3 discipline, the SAME classify `buildSoAPlans` runs); record each numeric iv's `Float64Array` offset (multi-component leaves span contiguous slots — a `translate3d` spans 3); allocate the per-frame numeric `Float64Array` ONCE at parse (the F.W4 zero-alloc discipline — NO per-frame alloc). The classification is compile-stable (the iv set is fixed at parse).
- **The fold over the numeric subset.** In `processFrame`: pack the numeric ivs' (start, stop) into the buffer ONCE at parse; per frame, `lerpArray(startBuf, stopBuf, eased, outBuf)` (the value.js contiguous-lerp — VERIFIED signature `lerpArray(start, stop, t, out)` at value.js `math.ts:60`, the `t` is the THIRD arg), then a strided write-back of `outBuf` into the numeric leaves' `.value` slots (each numeric iv's interp-carrier `ValueUnit.value` — the same slot `lerpValue` writes today via `iv._lerp`). The boxed tail (color/computed/mixed) walks the existing per-element `lerpValue` UNCHANGED. The `transformFrames` apply + the composition honoring (`engine.ts:758-777`) are untouched (they read the now-folded `.value` slots off `frame.flatVars`/`frame.vars`, identical to the boxed result — `finalizeFrameVars` at `frame-compiler.ts:510-521` derives `flatVars` from the iv `.value` slots, so the folded values flow through unchanged).

**Constraint (observable-truth — bit-identical; KISS).** The transposition changes the ARITHMETIC SUBSTRATE (boxed per-channel → contiguous typed fold) for the NUMERIC subset ONLY, never the interp's OBSERVABLE result. The existing interp/replay oracle (the `test/interpolation` corpus + `proof:replay-equality`) is the regression authority: the SoA `processFrame` output must be byte-equal to the boxed `processFrame` over the preset/`fromString` corpus (`maxErr=0`, exactly as the compositor proved). KISS: a contiguous `Float64Array` + an offset map, indexed by the stable iv layout — the SAME shape `soaBlendLayer` uses.

**Gate bite.** `proof:processframe-soa` `interp-equal` clause (active only if chartered): the SoA `processFrame` output `deepEquals` the boxed `processFrame` over the preset corpus (`maxErr=0`). BITE: a multi-component leaf mis-strided (a `translate3d` packed at the wrong offset) → the interp drifts → `interp-equal` reds. INERT on a KILL verdict (no SoA path to compare).

---

### S3 — the K-ladder monotonicity witness (NOW — closes the under-recorded gap)

**Breach.** `B1-kf-soa` FINDING: `soa-composite-decision.json` records ONLY K=8; the K=3/K=12 monotonicity (the proof the fold scales with channel count) is benched but never durably recorded. A single-K decision cannot witness "the SoA win GROWS with K" (the load-bearing claim — boxed degrades steeper than SoA as K rises).

**Cure.** Extend BOTH decision JSONs (`processframe-soa-decision.json` this wave + the existing `soa-composite-decision.json`) to record ALL THREE K-rungs (3/8/12) and add a `k-ladder-monotone` clause asserting SoA-over-boxed is monotone-non-decreasing in K (the bench measures K=3/8/12; the gate reads + records all three). Same-report ratios only — the absolute hz survives ONLY as an observe-only note (the run-variable-ratio finding: 1.97–2.54× on the same machine is V8 noise, so a hard absolute floor would flake on the slow Linux runner — the device-dependence spine).

**Gate bite.** `proof:processframe-soa` `k-ladder-monotone` clause: the decision JSON records 3/8/12 and `soaOverBoxed(K=12) ≥ soaOverBoxed(K=3)` (within a noise tolerance). BITE: a decision-JSON recording only K=8 (the current compositor shape) → the three-rung-present assertion reds; a non-monotone ladder (the fold doesn't scale) → the monotone assertion reds.

---

### S4 — the value.js `ColorChannelPlan` consume (GATED on the value.js 1.2.0 publish)

**Breach.** The color/computed leaf tail is PERMANENTLY boxed — a `Color` cannot live in a `Float64Array`, so `oklab`-channel leaves keep the per-element boxed `lerpColorValue` in BOTH the compositor AND `processFrame`. The numeric fold cannot cover them in-realm (the channel layout is a value.js concern — value.js owns `Color`/`oklab`).

**Cure (GATED — the dispatch + the consume).** Dispatch (`KF-TO-VALUEJS-Q.md` **VJ-Q8**) a `ColorChannelPlan`: a value.js-side Float64 oklab-channel layout (a `(Color → channel offsets)` plan + a `lerpColorChannels(t, startBuf, stopBuf, outBuf)` fold) the compositor + `processFrame` fold the color tail through, instead of per-element `Color` boxing. The kf consume (re-pin `^1.2.0`, fold the color leaves through the published plan) is GATED on the value.js publish — no kf wave consumes the unpublished surface (the inv-16 / DAG discipline). Terminal-or-KILL: if value.js declines the plan, the color tail ships boxed (recorded), never a perpetual block.

**Gate bite.** `proof:color-soa` (NEW, GATED) `color-channel-folded` clause: a multi-color-leaf animation's color interp folds through the `ColorChannelPlan` (the `soaBlendLayer`/`processFrame` call-count over color leaves is the plan path, not the boxed `lerpColorValue`), bit-identical to the boxed color interp (`maxErr=0` perceptual). BITE today: no `ColorChannelPlan` consume exists → the gate reds; greens when the plan publishes + the kf consume folds the color tail.

---

### S5 — the `SpringProgress.setTargets(Float64Array)` vector-sugar confirm (NOW companion — ALREADY SHIPPED, a pure confirm)

**Breach (CORRECTED 2026-06-23).** `B5-kf-engine-arch` flagged the `SpringProgress.setTargets(Float64Array)` vector sugar as ADOPT-verdicted (`spring-vector-decision.json`, ratio 3.856×) with the ship-status "unconfirmed." VERIFIED on the tree: the overload IS ALREADY SHIPPED (`spring.ts:504` `setTargets(targets: Float64Array): void`, the lazy-armed vector lanes at `spring.ts:185-189`, the per-tick fold in `tickVector(dt)` at `spring.ts:554`), AND its gate ALREADY EXISTS (`proof:spring-vector` / `scripts/proof-spring-vector.mjs`). So S5 is a PURE CONFIRM — the overload + its gate both exist. The ONLY open thread is the dirty `spring-vector-decision.json` (the one dirty file in git status, re-timestamped 2026-06-22) — a re-recorded verdict, not unshipped code.

**Cure.** CONFIRM the shipped overload + its existing `proof:spring-vector` gate, and re-record the dirty `spring-vector-decision.json` cleanly. NOTE the substrate distinction (the spec previously conflated them): the spring overload folds through `tickVector` — a CLOSED-FORM spring step over `(omega, zeta, omegaD)` lanes, NOT value.js's `lerpArray`. `lerpArray` is the KEYFRAME-interp fold (the `processFrame`/`packSoA` numeric subset, S2); the spring vector path is a different fold (physics, not lerp). They share the `Float64Array` LANE LAYOUT idiom (the dispatch/alloc amortization the W122 probe measured at 3.85×), NOT the same fold primitive. S5's value here is the cohesion confirm: the same `Float64Array` lane discipline runs across the LIGHT spring sugar AND the HEAVY `processFrame` fold.

**Gate bite.** `proof:processframe-soa` `spring-vector-shipped` clause: `SpringProgress.setTargets` accepts a `Float64Array` (VERIFIED at `spring.ts:504`) and the existing `proof:spring-vector` gate is GREEN with a freshly-recorded `spring-vector-decision.json`. BITE: a regression that drops the `Float64Array` overload (or leaves `spring-vector-decision.json` stale/dirty) → the assertion reds. This is a CONFIRM clause (greens immediately on the shipped overload), not a build.

---

## Born-RED gate

**Gate:** `proof:processframe-soa` (NEW — `scripts/proof-processframe-soa.mjs` over `interp-buffer.bench.ts` + `processframe-soa-decision.json`, via the portable `ratioGate`) + the existing interp/replay oracle (the byte-exact authority IF chartered) + `proof:color-soa` (NEW, GATED on the value.js `ColorChannelPlan` publish) + `proof:workaround-deletion` S8 (the EXISTING S8 gate — fires the in-realm parallel-array FALLBACK observable ONLY on a recorded VJ-Q4 decline; otherwise the PRIMARY VJ-Q4 consume at `Q.WG-GATED-CONSUMES` S4 greens it). Born-RED on today's tree: no `processframe-soa-decision.json`, no `processFrame` SoA fold, no `ColorChannelPlan` consume; `proof:workaround-deletion` S8 PENDING.

| Clause | The REAL observable | Born-RED witness on today's tree |
|--------|----------------------|------------------------------------|
| `measured-first` (S1) | the `processFrame` SoA-vs-boxed ratio scoped to the single-animation path | `processframe-soa-decision.json` ENOENT → no `processFrame`-scoped verdict → RED |
| `interp-equal` (S2 oracle, if chartered) | the SoA `processFrame` output is byte-equal to the boxed path (`maxErr=0`) | the SoA path does not exist; if chartered, a mis-strided leaf reds it. INERT on KILL |
| `k-ladder-monotone` (S3 — closes the witness) | the SoA win is monotone in K (3/8/12), recorded durably | the decision JSON records only K=8 (compositor) / absent (processFrame) → RED |
| `color-channel-folded` (S4, GATED) | the color tail folds through the `ColorChannelPlan`, not boxed `lerpColorValue` | no `ColorChannelPlan` consume → RED; greens on the value.js publish + consume |
| `spring-vector-shipped` (S5, a CONFIRM) | `SpringProgress.setTargets(Float64Array)` exists (`spring.ts:504`, folds via `tickVector` — NOT `lerpArray`) + `proof:spring-vector` GREEN with a freshly-recorded decision JSON | the overload IS shipped; the clause greens immediately. The only RED is the dirty/stale `spring-vector-decision.json` (re-record cleanly) |
| `s8-fallback-terminal` (S6 — gated by `proof:workaround-deletion` S8; FALLBACK only) | the `.fnName` provenance survives `clone()` with NO WeakMap + NO foreign-Symbol stamp — via the PRIMARY VJ-Q4 `u.fnName` OR (if VJ-Q4 declined) the in-realm parallel array | `proof:workaround-deletion` S8 PENDING (the `FN_NAME_MAP` WeakMap + ceremony live). GREEN on whichever terminal fires; INERT-here when the PRIMARY VJ-Q4 consume greens it at `Q.WG-GATED-CONSUMES` S4 (the two are mutually exclusive) |

**The portability spine (the owner mandate).** Every ratio is SAME-REPORT (numerator + denominator measured in the same pass — device-independent BY CONSTRUCTION, via the `ratioGate`). The `interp-equal`/`color-channel-folded` oracles are byte-equality (HARD everywhere). NO absolute `floorHz` is a HARD predicate (the run-variable-ratio finding + the device-dependence-greening lesson — a gate that passes on macOS cannot flake RED on the slow Linux runner for a device reason). The K-ladder asserts a RATIO monotonicity, not an absolute throughput.

**Green condition.** The bench measures `processFrame`'s SoA-vs-boxed K-ladder + writes `processframe-soa-decision.json` scoped to `processFrame` (S1, measure-first); ADOPT (≥1.2× at K=8) charters the numeric fold (S2) which lands bit-identical + zero-alloc; the K-ladder records 3/8/12 + asserts monotonicity (S3); the color tail folds through the GATED `ColorChannelPlan` consume (S4) on the value.js publish; the `SpringProgress.setTargets(Float64Array)` vector sugar is confirmed-or-shipped (S5); and the S8 `.fnName` terminal exits via the PRIMARY VJ-Q4 consume (`Q.WG-GATED-CONSUMES` S4) OR — only on a recorded VJ-Q4 decline — the in-realm parallel-array FALLBACK (S6), `proof:workaround-deletion` S8 GREEN on whichever fires. The outcome is a MEASURED decision: the boxed `processFrame` cost is cured by the fold (if it pays ≥1.2×) or shipped as-is (if falsified) — never an unmeasured edit on a transplanted number.

---

## Dependencies

- **`interp-buffer.bench.ts` SoA-vs-boxed K-ladder — already shipped** (`bench/interp-buffer.bench.ts`, `taxonomy.json:163-184`). The measure-first half is DONE; this wave graduates it to a born-RED decision gate. NO new bench scaffold.
- **`buildSoAPlans` partition discipline — already shipped** (`group.ts:577`, partition `:598-643`). The K3 numeric/boxed classify the `processFrame` fold reuses; NO new partition logic invented.
- **value.js `lerpArray` — already published** (the `SpringProgress.setTargets` Float64 path). The contiguous-lerp primitive `processFrame`'s numeric subset folds through; NO new value.js ask for the NUMERIC arm.
- **value.js `ColorChannelPlan` — GATED PUBLISH (VJ-Q8 dispatch, `KF-TO-VALUEJS-Q.md` line 51 → Q.WG4 consume).** The ONLY sibling gate for the SoA arms, and ONLY for the COLOR arm (S4). The numeric arm (S1/S2/S3) is fully in-realm. inv-16 holds (kf authors only the consume; the plan is the sibling's). Terminal-or-KILL: the color tail ships boxed if value.js declines.
- **value.js VJ-Q4 `flatLeaf .fnName` — the PRIMARY S8 terminal (`KF-TO-VALUEJS-Q.md` VJ-Q4 → `Q.WG-GATED-CONSUMES` S4, GATED on value.js 1.2.0).** The S6 in-realm parallel-array is the EXPLICIT FALLBACK, fired ONLY on a recorded VJ-Q4 decline (the two are mutually exclusive — no double-implement). Q.WB3 S6, Q.WG-GATED-CONSUMES S4, and Q.WZ §S1 state the SAME primary (VJ-Q4) + fallback (this S6). inv-16 holds (the PRIMARY is the sibling's field; the FALLBACK is kf-internal).
- **Q.WF1 engine.ts split — DESIRABLE-before, not required** (the friction pre-emption). The numeric fold lands cleanest on the post-split `processFrame` seam; folding into the 1397L god-file is the churn the split exists to avoid.
- **Independent of Q.WB1/WB2/WB4.** File surfaces: `bench/interp-buffer.bench.ts` (the K-ladder), `scripts/proof-processframe-soa.mjs` (NEW), `scripts/processframe-soa-decision.json` (NEW), `scripts/soa-composite-decision.json` (the K-ladder extension), `src/animation/engine.ts` + `frame-compiler.ts` (the numeric fold, IF chartered), `scripts/proof-color-soa.mjs` (NEW, GATED), `src/animation/utils.ts` (the S6 in-realm `.fnName` parallel-array FALLBACK, ONLY on a VJ-Q4 decline — otherwise untouched, the PRIMARY consume edits it at Q.WG-GATED-CONSUMES S4), `package.json` (the `^1.2.0` re-pin, shared with Q.WG4).

---

## dev→impl boundary

This file is the Tranche Q DEVELOPMENT spec for Q.WB3 — **DOCS ONLY.** It writes zero source (inv-16: the numeric fold is kf-internal; the `ColorChannelPlan` is the value.js dispatch Q.WG2, the color consume opens only after the gated publish). On owner authorization the numeric arm (S1/S2/S3/S5) opens — STAGED: S1 (the bench-to-gate graduation + decision-JSON scaffold) lands FIRST; the S2 numeric fold is a DEMOTE-TO-SPIKE chartered ONLY by S1's `processFrame`-measured ≥1.2× verdict. The color arm (S4) opens only on the value.js 1.2.0 `ColorChannelPlan` publish + the Q.WG4 re-pin. The S8 `.fnName` FALLBACK arm (S6) opens ONLY on a recorded value.js VJ-Q4 decline — until then the PRIMARY is the GATED VJ-Q4 consume at `Q.WG-GATED-CONSUMES` S4, and S6 stays a spec (no double-implement); the two are mutually exclusive. Gate-first (`proof:processframe-soa` born-RED + the bench baseline recorded BEFORE any fold — MEASURE-FIRST, ADOPT-or-KILL), observable-truth (the per-K ratio + the byte-exact interp oracle over the REAL preset corpus, not a grep), no-legacy (IF chartered, the boxed dispatch DELETED from the numeric `processFrame` path — the boxed color/computed tail kept as the ACTIVE path, not dead parallel), KISS (the SoA buffer is a contiguous `Float64Array` + an offset map, indexed by the stable iv layout), P-inv-28 (the verdict gets a durable `processframe-soa-decision.json` terminal home scoping the ratio to `processFrame` — ADOPT charters, KILL records the falsification).

---

## Mid-tranche-friction pre-emption

- **FRICTION: folding the SoA path into the 1397L `engine.ts` god-file** is the exact churn Q.WF1 (the engine split) exists to avoid; a mid-tranche "we should split first" realization recreates the deferral. **PRE-EMPT:** the numeric fold is sequenced AFTER Q.WF1 (DESIRABLE) so it lands on the clean post-split `processFrame`/`engine-playback.ts` seam; if Q.WF1 slips, S2 scopes the fold to `processFrame` + `frame-compiler.ts` (the compile-side partition) — a bounded surface either way. Stated here, not discovered mid-impl.
- **FRICTION: the `processFrame` SoA fold shares the `interp-buffer.bench.ts` arm + the `AnimationFrame.allInterpVars` layout with any other Q wave touching the per-frame interp hot path** (`B1-kf-soa` FRICTION). **PRE-EMPT:** the partition is built ONCE at `parse` over the STABLE iv set (the F.W4 zero-alloc discipline); the layout is read-only at fold time, so no concurrent-wave edit-collision on the per-frame path.
- **FRICTION: the color arm GATED on an unpublished `ColorChannelPlan`** could spawn a "value.js not ready" mid-tranche block (the DAG-ordered invariant). **PRE-EMPT:** S4 is GATED, NOT NOW — the numeric arm lands in-realm; the color consume names the EXACT publish (the Q.WG2 dispatch) that fires it, with a terminal-or-KILL fallback (color tail ships boxed). No kf wave consumes the unpublished surface.
- **FRICTION: a hard absolute-hz floor would flake on the slow Linux runner** (the run-variable 1.97–2.54× ratio + the device-dependence-greening lesson). **PRE-EMPT:** S1/S3 use ONLY the SAME-REPORT `ratioGate`; the absolute hz is an observe-only note; the K-ladder asserts a ratio monotonicity, never an absolute throughput — the device-honesty spine is built in.
