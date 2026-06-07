# G.W2 — THE RE-PIN (the headline SHIP; eight lanes converge on one motion)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** SHIP-in-G (the spine of
the whole tranche — the consume-leg `F/FINAL.md:11-12` named and never executed) ·
**Scope:** `package.json` (the three pins + the dirty LINK), the lockfile, and the
re-published gate scripts — `proof:deps-current`/`proof:vj-pin-current` (new), the
`bench/interp-buffer.bench.ts` computed-unit variant (the C1 witness), and the CF-1
compile-% witness (the `compile.bench` `parse()` ≥ 85% of `fromString` clause — supplemental
fold). **The kf-realm C5 `50dvh` non-identity test is NOT in this wave** — it is
structurally un-runnable under jsdom and MOVES to `G.W16` (the real-DOM corpus); this wave's
C5 obligation is that the value.js-realm delta is consumed (the suite green on the bumped
pins). **ZERO `src/` edit** — any required source edit is a finding against the
consume-unchanged charter. · **DAG-deps:** **depends on G.W1** (the safety lock must
be GREEN before the bump) AND the published siblings (`value.js@0.11.0`,
`parse-that@0.9.0`, `glass-ui@3.3.0` — all on the registry). **G.W2 LANDS FIRST in G after
verification** — it gates the honest re-measure of every value.js row, so the value.js /
engine-perf / glass-ui waves descend from it.

The §Mandate (`G.md §Mandate` / the gap-scorecard §THESIS) is the spine; this wave most
tests **NO legacy + measure-first + inv-16** — the re-pin is the *bigger half* of C1/§3/
§4-parse-that in ONE motion, consumed through the unchanged `lerpValue → iv._lerp` seam
(`engine.ts:731`), and the §Mandate forbids the bump landing on the `F/FINAL.md:11-12`
assertion alone. It SHIPS behind G.W1's lock + this wave's own three biting gates.

This is the headline. **kf 4.0.0 shipped on STALE siblings** (`value.js ^0.10.0`,
`parse-that ^0.8.2`, `glass-ui` a dirty `file:../glass-ui` LINK) while the published
`0.11.0` / `0.9.0` / `3.3.0` carry the F hand-off wins kf DROVE — the −94% computed-endpoint
memo, the 3.96× color-channel plan, the 2.41× parse dispatch, the C5 *correctness* fix (24
no-op length units), and the parse-that soundness hardening. **The whole F.W6 architecture
was load-bearing on "kf consumes it on re-pin"; the re-pin never happened.** Verified, not
asserted (inv ε), against the live `tranche-g-dev` tree + the published siblings.

**Provenance (the eight converging lanes).** `a-deferred-ledger §0 RP-1/RP-2/RP-3` (the
re-pin headline + the −94% / C5 consume-legs), `a-backend-legacy F-BL-1` (the stale-pin
hygiene), `a-constellation-gaps G-CONST-1/G-CONST-2` (the CI/dep-currency drift),
`a-glass-ui GG-1` (off the `file:` LINK → `^3.3.0`), `a-valuejs-leverage F-VJ-1` (the
per-win consumption mechanics through `iv._lerp`), `a-engine-perf G-1` (the re-pin lights
F.W6 + D2), `a-parsethat-leverage G-PT-1` (the parse-that-side, transitive on the value.js
bump). Eight lanes, one single SHIP.

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-g-dev`:

1. **The three pins are stale; the LINK is dirty.** `package.json` declares
   `"@mkbabb/parse-that": "^0.8.2"` (`package.json:84`), `"@mkbabb/value.js": "^0.10.0"`
   (`package.json:85`), `"@mkbabb/glass-ui": "file:../glass-ui"` (`package.json:88`), at
   kf `"version": "4.0.0"` (`package.json:3`). The installed
   `node_modules/@mkbabb/value.js` is `0.10.0`; `…/parse-that` is `0.8.2`. The registry
   has `value.js@0.11.0`, `parse-that@0.9.0`, `glass-ui@3.3.0` PUBLISHED (`npm view`,
   re-verified live; `a-deferred-ledger §0 RP-1`, `a-glass-ui GG-1`).

2. **The installed 0.10.0 carries NONE of the F surface.** A grep over the installed
   `node_modules/@mkbabb/value.js/dist/value.js` for `_computedCache` / `_colorPlan` /
   `layoutEpoch` / `bumpLayoutEpoch` / `lerpArray` returns **0 hits each**; the dist
   export-table has no `bumpLayoutEpoch`/`getLayoutEpoch`/`lerpArray`
   (`a-valuejs-leverage §0`). **So the cache, the color plan, the dispatch, and the SoA
   primitive land ONLY on re-pin — they are not "transparently already there."**

3. **value.js 0.11.0 LANDED the entire Tranche-F wave (verified live in `value.js/src/`).**
   The release commit enumerates `A2/C5/B1b/A1/B3+B5/D2/F7 + the computed-endpoint cache`
   (`a-valuejs-leverage §0`): C1/C2/C4/C7 endpoint cache (`interpolate.ts:26-72`;
   `bumpLayoutEpoch`/`getLayoutEpoch` exported `normalize.ts:157,166`); B3/B5 frozen
   color-channel plan (`interpolate.ts:89-135`); A1 O(1) first-char `dispatch` at the
   14-way color fork (`color.ts:557-593`); D2 SoA `lerpArray` carrier (`math.ts:48-60`);
   C5 (24 no-op relative length units), A2, B1b, F7.

4. **The consumption is zero-kf-edit through ONE seam.** kf reaches the entire interp path
   through `lerpValue(eased, iv)` at `engine.ts:731` (verified live; `iv._lerp`-internal).
   C1/B3/B5/A1 are consumed with ZERO kf edit; kf already calls `prepareInterpVar(
   normalizeValueUnits(...))` (`utils.ts:339`) which builds/consumes the `_colorPlan` on
   re-pin (`a-valuejs-leverage §1`). All 29 kf-consumed value.js names survive `0.11.0`
   (G.W1 S2 — 29/29 OK); the one direct parse-that import (`any`, `utils.ts:1`) survives
   `0.9.0` (G.W1 S1; `a-parsethat-leverage §1`). parse-that rides the bump transitively.

5. **There is no dep-currency gate.** `proof:all` (`package.json:64`) chains 24 `proof:*`
   gates + `vitest run`; NONE asserts the `@mkbabb/*` pins are current or protocol-clean
   (no `proof:deps-current`/`proof:vj-pin-current` exists, `grep "proof:deps"
   package.json` = 0; `a-constellation-gaps G-CONST-1`). The stale pin can re-drift
   silently after this wave lands — the new gate is the standing lock.

6. **§S NOTE (supplemental fold) — the re-pin is ALSO a V8-perf-correctness fix, and the
   compile latency it leverages is now MAPPED.** Two supplemental lanes deepen the
   rationale for this wave WITHOUT opening any new SHIP (`_SYNTHESIS-perf-testing-engine.md
   §1`, the Band-P FOLD `:135-142`):
   - **HP-1 — the published TypedArray substrate is DARK only because kf pins `^0.10.0`.**
     The supplemental V8 hot-path read (`r-perf-hotpath-v8` HP-1) shows the value.js
     `0.11.0` dense-numeric carrier — the **C1 endpoint memo** (`interpolate.ts:26-72`),
     the **B3 `Float64Array` color-channel plan** (`interpolate.ts:89-135`), and the **D2
     `lerpArray` SoA primitive** (`math.ts:48-60`) — is a TypedArray fast-properties /
     PACKED-elements substrate that V8 keeps monomorphic. It is shipped-but-unreachable on
     kf because `node_modules/@mkbabb/value.js` resolves `0.10.0` (grep for `lerpArray` /
     `_colorPlan` / `_computedCache` = 0 hits, §State 2). **So the re-pin is not merely a
     hygiene chore: it is the act that LIGHTS a V8-resident perf-correctness substrate that
     is currently dead on kf's path** — the same single-seam consume (`engine.ts:731 →
     iv._lerp`). This reinforces the spine; it adds no kf source work.
   - **CF-1 — the compile latency this wave leverages is value.js-bound (87–91%).** The
     supplemental compile-flatten lane (`a-perf-compile-flatten-bitpack` CF-1) maps the
     `FrameCompiler` cost: `parse()` is **87–91% of `fromString`**, dominated by value.js's
     `tryParseCache`-backed parse — i.e. the compile-step latency lives in the sibling, so
     the re-pin's parse-side wins (A1 dispatch 2.41×, A2 maximal-munch) land on the hottest
     compile fraction. The COMPILED frame layout itself is O(N) and SOTA (CF-2: the F.W3
     `buildVarIndex` killed the O(N²) reconcile); SoA is a RUNTIME lever, NOT a compile
     lever (CF-4) — recorded so this wave does not re-shape the compiled frame for compile
     speed. The bit-packing of the frame id / time index / dispatch is KILLED three ways
     (HP-4 / X-3 / CF-3 — no headroom at compile OR runtime); recorded so nobody packs them.

The wave's job: bump the three pins (`value.js ^0.11.0`, `parse-that ^0.9.0`, `glass-ui
^3.3.0` off the LINK), re-lock, prove the full suite + `proof:all` GREEN with ZERO kf
source edit, and close it with a standing dep-currency gate + the C5 correctness test +
the C1 resolve-count witness — so the −94% / 3.96× / 2.41× / C5 wins are SHIPPED behavior,
not a charter promise.

---

## § Goal

**What lands (the IMPL the spec gates):**
- **The re-pin (SHIP — the spine).** `package.json` deps → `"@mkbabb/value.js": "^0.11.0"`,
  `"@mkbabb/parse-that": "^0.9.0"`, `"@mkbabb/glass-ui": "^3.3.0"` (off the
  `file:../glass-ui` LINK — `a-glass-ui GG-1`); re-lock; rebuild; re-run the full 261-test
  suite + `proof:all`. **ZERO kf source edit** (`a-deferred-ledger §0 RP-1`: any required
  edit is a finding against the consume-unchanged charter). Pixel-identical where
  isomorphic, faster, plus the C5 named correctness delta. (SHIP-in-G.)
- **The wins, lit zero-kf-edit through `iv._lerp`:** **C1** computed-endpoint cache
  (−94% / O(frames)→O(1) per `F/FINAL.md:39-44`) — every `calc()`/`var()`/`vh`/`cqw`
  animation collapses to a bare `lerp(startN, stopN, t)` after frame 1, no
  `getComputedValue`, no reflow (`a-valuejs-leverage §1`); **B3/B5** color plan (3.96× per
  `F/FINAL.md:91-92`) — built/consumed in `prepareInterpVar`, no kf edit; **A1** dispatch
  (2.41×) — internal to value.js's color parser, consumed on every keyframe parse; **C5**
  the `50dvh→50px` *correctness* fix (24 previously-no-op relative units; `dvh`/`svh`/`lvh`
  family, `vi vb cap ic lh rlh`) — changes WRONG pixels to right, the only befitting
  named-delta break in the re-pin (`a-valuejs-leverage §1`); **A2/B1b/F7** consumed
  transparently. (All zero-kf-edit.)
- **The standing dep-currency gate + the witnesses.** A new `proof:deps-current` /
  `proof:vj-pin-current` (installed ≥ published floor; no `file:`/`link:`/`git:` protocol
  in any `@mkbabb/*`), chained into `proof:all`; the C1 computed-frame resolve-count witness
  (the `bench/interp-buffer.bench.ts` computed-unit variant); the CF-1 compile-% witness (a
  `compile.bench` clause: value.js `parse()` ≥ 85% of `fromString` at N≥50 — the
  supplemental fold). (SHIP — the gate ships WITH the bump.) **The kf-realm C5 `50dvh`
  non-identity assertion is NOT in this wave's gate** — it is structurally untestable under
  jsdom (`a-testing-robustness` TR-3 Probe-1) and is PROVEN in `G.W16` (the injection-seam
  unit test + the Playwright real-DOM corpus), which DEPENDS on this wave. This wave's C5
  obligation is the value.js-realm delta is consumed (the suite green on the bumped pins).

**Why:** this is not a chore — it is a *shipped-product-correctness* fix and the unlock for
most of the value.js charter (gap-scorecard §THESIS). The whole F.W6 architecture was
load-bearing on "kf consumes it on re-pin" (`F/FINAL.md:39-44`); the re-pin never happened,
so kf 4.0.0 paints WRONG pixels on `50dvh` (C5) and re-resolves every computed endpoint
every frame (no C1). The re-pin is the highest-leverage, lowest-source-cost item in the
whole ledger (`a-deferred-ledger §0`) — it discharges the bigger half of C1/§3/§4-parse-that
in ONE motion through the single seam, and it gates the honest re-measure of every
downstream value.js row. **Land it FIRST.**

---

## § Scope

### S1 — Bump the three pins off stale + off the LINK — `a-deferred-ledger §0 RP-1` / `a-glass-ui GG-1`

**WHAT:** `package.json` deps → `"@mkbabb/value.js": "^0.11.0"`,
`"@mkbabb/parse-that": "^0.9.0"`, `"@mkbabb/glass-ui": "^3.3.0"` (replacing
`file:../glass-ui` with the published registry range, `a-glass-ui GG-1`); re-lock; rebuild
(`npm run build` → `dist/keyframes.js` + `.cjs` + `.d.ts`). NO `src/` edit — the bump is a
manifest + lockfile change.

**WHY:** the consume-leg `F/FINAL.md:11-12` named and never executed. kf drove the F wins
into the siblings and shipped 4.0.0 on the OLD ones; the bump is the act that turns "kf
consumes it on re-pin" from a charter promise into shipped behavior (`a-deferred-ledger
§0`). The glass-ui `file:` LINK is a dirty dev artifact that cannot publish — off it is a
release-correctness fix (`a-glass-ui GG-1`), not just hygiene. The §Mandate's no-legacy:
the bump replaces the stale pins in one motion, no compat range beside them.

### S2 — Prove the full suite + `proof:all` GREEN with ZERO kf edit — `a-valuejs-leverage F-VJ-1` / `a-deferred-ledger §0 RP-1`

**WHAT:** after the bump, run the full 261-test suite + `proof:all` (`package.json:64`,
the 24 gates + `vitest run`) and assert GREEN with NO `src/` modification. The suite is the
pixel-identity lock for every isomorphic win (C1/B3/B5/A1/A2/B1b/F7); the C5 delta is the
ONE named non-identity (S4). Any test that requires a kf source edit to pass is a FINDING
against the consume-unchanged charter (`a-deferred-ledger §0 RP-1`) — surfaced, not
patched around.

**WHY:** the §Mandate's measure-first + inv-16 — the re-pin SHIPs on a green suite that is
the falsifiable form of "consume-unchanged." `proof:all` green with zero kf edit PROVES
the `F/FINAL.md:11-12` claim that the prior run only asserted; a forced edit DISPROVES it
and is a finding to record, not a workaround to apply (the no-symptom-patch clause). This
is the bigger-half discharge of C1/§3/§4-parse-that in ONE motion (`a-deferred-ledger §0`).

### S3 — The standing dep-currency gate `proof:deps-current` / `proof:vj-pin-current` — `a-constellation-gaps G-CONST-1`

**WHAT:** a new gate chained into `proof:all`: assert every `@mkbabb/*` dependency is (a)
installed at ≥ the published floor (`value.js≥0.11.0`, `parse-that≥0.9.0`,
`glass-ui≥3.3.0`) AND (b) declared with a registry range — NO `file:`/`link:`/`git:`
protocol in any `@mkbabb/*` pin. The gate reads `package.json` + the lockfile + `npm view`
floors. Chained into `proof:all` so the dep-currency invariant rides every CI run.

**WHY:** the stale pin re-drifts silently without a standing gate (there is none today,
`a-constellation-gaps G-CONST-1`) — the exact failure that produced the F→G pin-lag. The
gate is the lock that the re-pin STAYS pinned: the `file:` LINK can never re-creep into a
publishable manifest, and a future sibling release cannot be silently un-consumed past its
floor. inv ε — the gate BITES: revert any pin to `^0.10.0`/`file:` → reds.

### S4 — The C1 resolve-count witness + the CF-1 compile-% witness (the C5 kf-realm assertion MOVES to G.W16) — `a-valuejs-leverage F-VJ-1` / `a-engine-perf G-1` / `a-perf-compile-flatten-bitpack CF-1`

**WHAT:** (a) the **C1 witness** — a computed-unit variant of `bench/interp-buffer.bench.ts`
(the current bench's `FLAT_KEYS` are numeric; the variant animates `calc(100cqw - 100%)` /
`vh`) that materializes the endpoint-cache resolve-count drop O(frames)→O(1) as a
wall-time/call-count witness on the steady frames (`a-valuejs-leverage F-VJ-1` instrument 2,
`a-engine-perf G-1`); (b) the **CF-1 compile-% witness (supplemental fold)** — a
`compile.bench` clause asserting value.js `parse()` is ≥ 85% of `fromString` at N≥50,
locking the supplemental compile-latency map (parse is 87–91% of compile, value.js-bound —
`a-perf-compile-flatten-bitpack CF-1`) so a kf-side compile hot-spot (or a parse fraction
that drops out of value.js) is surfaced. The re-pin SHIPs on `proof:all` + these two perf
witnesses.

> **SUPERSEDED (supplemental fold): the un-runnable jsdom rAF-path `50dvh` clause is
> RETIRED from this wave and MOVED to `G.W16`.** The original S4(a) — "a `proof:`-grade
> test asserting a kf `@keyframes` over `50dvh` resolves to `0.5 ×
> dynamic-viewport-height` on the **rAF path**" — **cannot run as specified under jsdom**
> (`a-testing-robustness` TR-3 Probe-1: jsdom has no layout — `50vh`→`"50vh"`, no
> `matrix()` form; the computed-resolution path is structurally untestable there). The
> §Mandate forbids a gate that passes vacuously, so the kf-realm C5 non-identity assertion
> is RE-HOMED to `G.W16` (which DEPENDS on this wave): (i) `G.W16` S1, an injection-seam
> UNIT test against value.js's overridable viewport/container resolver (the
> `ScrollTimeline` `getScrollY`/`getViewportHeight` idiom) asserting kf forwards the
> resolved px `50dvh@768→384`; (ii) `G.W16` S2, a Playwright REAL-DOM corpus reading the
> actual computed px (`proof:computed-real-dom` — the ONLY place C5 is provable on the
> genuine path). This wave's residual C5 obligation is that the value.js-realm correctness
> delta is CONSUMED (S2 / gate clause 2 green on the bumped pins).

**WHY:** inv ε — every named win must have a BITING close, never a vacuous one. The C1
resolve-count witness is the measure-first form of "−94%": if the resolve count does NOT
drop O(frames)→O(1) post-bump, the value.js memo isn't on kf's path → a finding
(`a-deferred-ledger §0 RP-2`). The CF-1 compile-% witness records WHERE compile latency
lives (value.js's parse) so no one optimizes the kf side of an O(N)-SOTA compiler. C5
remains the highest correctness leverage in the set (it fixes WRONG pixels, not speed), but
its kf-realm proof needs real layout — so it lands in `G.W16` on the two seams that CAN
bite, not on this wave's jsdom path where it would pass vacuously (`a-deferred-ledger §0
RP-3`, `_SYNTHESIS-perf-testing-engine.md §2 G.W16:191-217`).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real check, not narration):

1. **The pins are current + protocol-clean.** `proof:deps-current` / `proof:vj-pin-current`:
   `value.js≥0.11.0`, `parse-that≥0.9.0`, `glass-ui≥3.3.0` installed; no
   `file:`/`link:`/`git:` protocol in any `@mkbabb/*` declaration. BITES: a stale pin or a
   re-crept `file:` LINK → reds. (`a-constellation-gaps G-CONST-1`.)
2. **The full suite + `proof:all` GREEN with ZERO kf edit.** All 261 tests + the 24
   `proof:*` gates pass on the bumped pins; `git status` over `src/` shows zero
   modification. BITES: any test requiring a kf source edit to pass → a finding against the
   consume-unchanged charter; a red gate → the re-pin is not non-breaking. (`a-valuejs-
   leverage F-VJ-1`, `a-deferred-ledger §0 RP-1`.)
3. **C5 — `50dvh` resolves non-identity (the PROVABLE seam, NOT the jsdom rAF path).**
   **SUPERSEDED + SHARPENED (supplemental fold).** The original S4(a) clause — "a
   `@keyframes` over `50dvh` resolves to `0.5 × dynamic-viewport-height` on the rAF path" —
   **cannot run as specified under jsdom and is therefore RETIRED from this wave's gate as a
   vacuous pass** (`a-testing-robustness` TR-3 Probe-1: jsdom returns `"50vh"`→`"50vh"`, no
   `matrix()` form, no layout — the computed-resolution path is structurally untestable
   there; the §Mandate forbids a gate that passes vacuously). **The C5 fix is proven in
   `G.W16`, not here:** (i) `G.W16` S1 — an injection-seam UNIT test against value.js's
   overridable viewport/container resolver (the same idiom `ScrollTimeline` uses for
   `getScrollY`/`getViewportHeight`), asserting kf forwards the resolved px
   `50dvh@768→384`; (ii) `G.W16` S2 — a Playwright REAL-DOM corpus animating `50dvh`/
   `calc(50% + 10px)`/`100cqw` under a `container-type` ancestor, reading the actual
   computed px (`proof:computed-real-dom` — the ONLY place the C5 fix is provable on the
   genuine path). **This wave's residual C5 obligation is the value.js-realm correctness
   delta is CONSUMED (clause 2 green on the bumped pins) + the resolve-count witness
   (clause 4); the kf-realm non-identity assertion MOVES to `G.W16` (which DEPENDS on this
   wave — the C5 fix is the change under test).** BITES (in `G.W16`): revert the resolver to
   drop the unit / stub value.js to skip `convertToPixels` for `dvh` → the live page freezes
   and the `G.W16` spec reds. (`a-valuejs-leverage F-VJ-1`, `a-deferred-ledger §0 RP-3`,
   `_SYNTHESIS-perf-testing-engine.md §2 G.W16:191-217`, `a-testing-robustness` TR-3.)
4. **C1 — the steady-state resolve count drops O(frames)→O(1).** The `bench/interp-
   buffer.bench.ts` computed-unit variant: a 600-frame steady window on a `calc(100cqw -
   100%)` leaf shows O(1) endpoint resolves (paid once), not O(frames). BITES: the value.js
   memo not on kf's path (resolve count stays O(frames)) → a finding. (`a-engine-perf G-1`,
   `a-deferred-ledger §0 RP-2`.)
5. **The win is structurally zero-kf-edit (boundary intact).** `proof:boundary` stays
   green; the consumption flows through the single `lerpValue → iv._lerp` seam
   (`engine.ts:731`) with no new value.js edge added. BITES: a new static value.js edge in
   a light module → reds (inv-16 / the single-dispatch charter). (`a-valuejs-leverage
   §3.1`.)
6. **The compile latency is value.js-bound (the CF-1 map, gated).** **NEW (supplemental
   fold).** A `compile.bench` clause (the existing `bench/parser.bench.ts` family, or a
   `compile`-named twin) asserts that at N≥50 keyframes, value.js `parse()` is **≥ 85% of
   `fromString`** — locking the supplemental CF-1 finding (parse is 87–91% of compile,
   value.js-bound) as a standing invariant. BITES: if a future change moves the compile cost
   OUT of value.js's parse (a kf-side compile hot-spot appears, or the parse fraction drops
   below 85%) → the clause reds, surfacing that the compile-step latency is no longer where
   the re-pin's parse-side wins (A1 dispatch / A2 maximal-munch) land. This is a
   measure-first lock, NOT a perf SHIP: it records WHERE compile time lives so no one
   optimizes the kf side of an O(N)-SOTA compiler (CF-2/CF-4) or re-shapes the compiled
   frame for compile speed. (`a-perf-compile-flatten-bitpack` CF-1/CF-2/CF-4,
   `_SYNTHESIS-perf-testing-engine.md §2 Band-P:135-142`.)

---

## § Folds

Retires (by finding id):
- **`a-deferred-ledger §0 RP-1`** — kf pins stale `value.js ^0.10.0` / `parse-that ^0.8.2`
  while `0.11.0`/`0.9.0` are PUBLISHED; the re-pin is the headline SHIP — S1 + S2 + gate
  clauses 1, 2.
- **`a-deferred-ledger §0 RP-2`** — the C1/C2/C4/C7 −94% memo landed in value.js, consumed
  ONLY on re-pin — S4(a) (the C1 resolve-count witness) + gate clause 4.
- **`a-deferred-ledger §0 RP-3`** — the C5 24-no-op-unit *correctness* fix (`50dvh`→wrong
  pixels) landed in `0.11.0`; kf resolves wrong until re-pin. **CO-RETIRED with `G.W16`
  (supplemental fold):** this wave consumes the value.js-realm delta (gate clause 2 green on
  the bumped pins); the kf-realm `50dvh` non-identity PROOF moves to `G.W16` (the
  injection-seam unit test + the Playwright real-DOM corpus — the un-runnable jsdom rAF
  clause is superseded, gate clause 3). `G.W16` DEPENDS on this wave.
- **`a-backend-legacy F-BL-1`** — the stale-pin hygiene (kf 4.0.0 ships on pre-F siblings)
  — S1.
- **`a-constellation-gaps G-CONST-1/G-CONST-2`** — the dep-currency drift + the absent
  currency gate — S1 + S3 + gate clause 1.
- **`a-glass-ui GG-1`** — off the dirty `file:../glass-ui` LINK → published `^3.3.0`
  (D.W5 publish gate now OPEN) — S1.
- **`a-valuejs-leverage F-VJ-1`** — re-pin `^0.10.0→^0.11.0` (+parse-that transitively);
  consume C1/B3/B5/A1/C5 through `iv._lerp` — S1 + S2 + S4 + all gate clauses.
- **`a-engine-perf G-1`** — the re-pin lights F.W6 (C1) + D2 — S4(b) + gate clause 4.
- **`a-parsethat-leverage G-PT-1`** — parse-that `^0.8.2→^0.9.0`, transitive on the
  value.js bump, non-breaking (verified G.W1) — S1 + S2.

**value.js-HANDOFF (the next value.js wave — kf proposes, never writes;
`a-valuejs-leverage §3.2`):** S4 native WAAPI color (`cssColorInterpKeyword`); S6/F2
`currentColor`/`light-dark()`/system-color sentinels; F3 LRU bound on
`getComputedValue.cache` (ONCE in value.js — a kf-side second policy is a DRY violation);
VJ-F1 path-geometry sampler; E1/E2 `linear()`/`steps()` parsers (kf's `parseLinearStops`
shim RETIRES onto them on land — the no-legacy collapse). Each consumed transitively on a
future re-pin; none is kf scope here.

**RECORD (carried so no future lane re-raises):**
- **The C1 container-resize staleness fold is NOT covered by the bare re-pin** — the re-pin
  INTRODUCES C1 staleness for `cqw` animations under a non-window resize (the value.js
  auto-`window.resize` epoch bump misses a container-only resize). That is the ONE genuine
  kf-side fold, owned by **G.W3** (`a-valuejs-leverage F-VJ-2`). RECORDED here so the spine
  is not mistaken for complete. (DAG: G.W3 depends on G.W2.)
- **The D2 SoA `lerpArray` adoption in `NumericAnimation` is MEASURE-FIRST, not this wave**
  — gated on representative-K≥2 (`a-valuejs-leverage F-VJ-3`, `a-engine-perf G-2`). The
  re-pin makes `lerpArray` AVAILABLE; the kf-local adoption is a separate gated wave.
  RECORDED.

**RECORD (already-SOTA — `a-valuejs-leverage §4`):** the single-dispatch interp seam
(`engine.ts:731 → iv._lerp`) — the structural reason the re-pin is zero-kf-edit; the
exemplary boundary; the color science (oklab/oklch perceptual lerp, gamut mapping, the
CSS-Color-4 hue short-way) consumed exemplary + untouched. The re-pin IS the leverage —
manufacture no kf-side interp-path work. LEAVE.

---

## § Design decisions

1. **ZERO kf source edit is the charter, not an aspiration — RESOLVED.** The re-pin is
   consumed entirely through the single `lerpValue → iv._lerp` seam (`engine.ts:731`); all
   29 kf-consumed value.js names survive `0.11.0` (G.W1 S2); `any` survives `0.9.0` (G.W1
   S1). So the bump is a manifest + lockfile change, NO `src/` touch. The §Mandate makes
   the consequence binding (`a-deferred-ledger §0 RP-1`): ANY required source edit is a
   FINDING against the consume-unchanged charter, surfaced — not a workaround applied.
   Trade-off: the re-pin's value lives in a sibling, so the kf diff is "just a manifest" —
   but that minimal diff IS the win the F.W6 architecture was designed for; a larger kf diff
   would mean the boundary leaked.

2. **C5 is a NAMED isomorphism-break, the only befitting one — RESOLVED + HONEST.** Every
   other re-pin win is pixel-identical (C1/B3/B5/A1 are faster-same-output; A2/B1b/F7 are
   latent-correctness/serialize-tidiness). C5 is the exception: it changes WRONG pixels to
   right (24 previously-no-op relative units that silently painted raw px). The §Mandate's
   isomorphic-unless-named: the named delta is "`50dvh` resolves to the dynamic viewport
   height, not `50`." Trade-off: a consumer relying on the (buggy) raw-px behavior would see
   movement — but that behavior was a correctness defect, and fixing wrong pixels in a major
   re-publish is exactly the befitting break the Mandate allows.

3. **The dep-currency gate is the standing lock that the re-pin STAYS pinned — RESOLVED.**
   The F→G pin-lag happened BECAUSE no gate asserted dep currency (`a-constellation-gaps
   G-CONST-1`); `proof:deps-current` makes the floor + the no-`file:`-protocol invariant
   ride every CI run. Trade-off: a new gate is more CI surface — but it is the precise
   lock against the exact failure that produced this entire spine; without it, the re-pin
   discharges the debt once and lets it re-accrue. The gate ships WITH the bump so the
   invariant is live the moment the pins move (the F.W6 "the gate ships WITH the fix"
   discipline).

4. **Land FIRST — the re-pin gates the honest re-measure of every value.js row —
   RESOLVED.** Until the bump lands, every value.js-row claim (C1 −94%, B 3.96×, A 2.41×,
   C5 correctness) is PUBLISHED-BUT-UNCONSUMED (`a-deferred-ledger §0`); a downstream
   value.js/engine-perf/glass-ui wave that measured against the stale `0.10.0` would measure
   the wrong tree. So G.W2 is the spine that Band 1 leads with (after G.W1's lock). Trade-off:
   it front-loads the one cross-repo-consume wave — but that ordering is forced by the
   dependency: the leverage cannot be re-measured honestly until it is consumed.
