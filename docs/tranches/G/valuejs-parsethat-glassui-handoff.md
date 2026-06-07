# Tranche G — the consolidated cross-repo HAND-OFF charter (value.js · parse-that · glass-ui)

**What this is.** The single inv-16-RELAXED artifact for Tranche G: the charter that
collects EVERY cross-repo item G touches into three sibling-owned surfaces. **inv-16 is
relaxed for G impl** — the user drives value.js / parse-that / glass-ui too — **but each
sibling is its own surface**, so every item below carries the sibling-repo `file:line`,
its disposition, a falsifiable gate, and the sequencing (who lands first, what gates the
kf consume-leg). G MAY drive these; it does NOT write them inside kf's tree. The kf-side
consume-legs (the re-pin, the kf diagnostics seam, the kf-demo dock half, the kf VT-stub
realign) are the SHIP-in-G waves authored in `G/waves/` — they are NOT this charter; this
charter is what those waves consume.

**Phase:** IMPL (spec authored in DEV — awaits auth). This is TRANCHE DEVELOPMENT — docs
ONLY, ZERO source/test/CI/demo edits. Implementation awaits explicit authorization (the
D/E/F dev/impl boundary).

**Branch.** `tranche-g-dev` (kf `4.0.0`; value.js `0.11.0`, parse-that `0.9.0`, glass-ui
`3.3.0` all PUBLISHED; keyframes.babb.dev on Cloudflare Pages).

**The id.** `handoffs`. **The deliverable.** This file only.

**Provenance (the lanes consolidated).** `a-valuejs-leverage` (F-VJ-1..9), `a-parsethat-leverage`
(G-PT-1..5), `a-glass-ui` (GG-1..6), `a-constellation-gaps` (G-CONST-1..6 / G-HANDOFF-1..4),
and the spine synthesis `_SYNTHESIS-backend-constellation` (§§1,2,3,5,6,8,9) + the
load-bearing `_SYNTHESIS-gap-scorecard` (the THESIS + §1 gap map + §2 Band V map + §3
roll-up). Every claim cites a phase-1 lane or a live `file:line` re-verified against the
sibling trees (inv ε). The companion F charters this charter SUCCEEDS:
`F/valuejs-sota-handoff-v2.md`, `F/parse-that-sota-handoff.md`.

---

## §THE BINDING MANDATE (travels WITH this charter — verbatim-in-substance)

NO quick solutions / NO workarounds — idiomatic, gestalt; no escape-hatch beside the real
fix. Architectural transpositions for elegance/simplicity/performance are NECESSARY +
DESIRABLE. NO legacy (backend legacy/fallback/fall-through → EXCISE or fail-EXPLICIT; no
silent/graceful handling unless befitting). NO god modules (decompose >500L ONLY where
genuinely cohesive + befitting — the Animation class is at its gestalt per F.md NEW-3; the
line-ceiling is a gated DECISION, NOT a split). KISS · DRY · no nested imports · no
test-in-src. Styling ISOMORPHIC unless highly befitting (named deltas). MEASURE-FIRST
(every perf claim behind a biting bench or recorded-withheld WITH the number). inv-16
RELAXED for G impl (the user drives value.js/parse-that/glass-ui) but each sibling is its
own surface → HAND-OFF-tagged. inv ε: every claim cites a phase-1 lane or live `file:line`.

**The §ALREADY-SOTA record is BINDING.** Manufacture NO work where D+E+F lead. value.js's
color *science* + parse *breadth* + interp *dispatch*, parse-that's leaf tier + the four
landed F waves, and glass-ui's spring-token cascade + motion-core SCC boundary + VT a11y
contract are at or ahead of SOTA. The §ALREADY-SOTA tail of each section is the refusal —
it is binding, not optional.

---

## §0 — THE SPINE (read first): the re-pin is the headline of all three siblings

**kf `4.0.0` shipped consuming STALE siblings.** This is the single largest cross-repo gap
in Tranche G and the convergence point of EIGHT lanes (`_SYNTHESIS-gap-scorecard §1` "the
spine"). Re-verified live, three deps, three ways:

- `package.json:85-86` — `"@mkbabb/parse-that": "^0.8.2"`, `"@mkbabb/value.js": "^0.10.0"`;
  `package.json:88` — `"@mkbabb/glass-ui": "file:../glass-ui"` (a dirty `at-dock-convergence`
  branch LINK, no integrity hash — `a-glass-ui §0`).
- `node_modules/@mkbabb/value.js` = `0.10.0`; `…/parse-that` = `0.8.2`;
  `…/glass-ui` → symlink to a DIRTY working tree (`a-glass-ui §0`, verified `readlink`).
- `npm view` = `0.11.0` / `0.9.0` / `3.3.0` PUBLISHED.

The caret `^0.10.0` does NOT admit `0.11.0` (a 0.x minor is a semver breaking boundary), so
`npm ci` NEVER pulls it without a `package.json` + lockfile edit (`a-constellation-gaps §0`).
**The whole F.W6 architecture was load-bearing on "kf consumes it on re-pin"; the re-pin
never happened** (`_SYNTHESIS-gap-scorecard §THESIS`). The shipped 4.0.0 runs the OLD
per-frame computed re-resolve, the OLD closure color path, and silently paints raw px for
the 24 relative length units the C5 fix corrects — a *shipped-product-correctness* defect,
not merely perf (`_SYNTHESIS-backend-constellation §0`).

**The structural unlock.** kf reaches the entire interp path through ONE dispatch site —
`lerpValue(eased, iv)` at `engine.ts:731`, `iv._lerp`-internal (`a-valuejs-leverage §0`,
re-verified; moved from `:629` with the F.W4 `processFrame` lift). All 29 value.js names kf
statically imports survive `0.11.0` (29/29, zero MISSING — `a-valuejs-leverage §0`); the
one direct parse-that import (`any`, `utils.ts:1`) survives `0.9.0`. So C1/B3/B5/A1/C5 land
with ZERO kf source edit. **The re-pin (the kf-side consume-leg) is a kf SHIP wave (G.W2),
not a sibling hand-off** — but it is the sequencing root every item below is ordered
against, so it is named here as §0.

**This charter's three sections are ordered by the spine.** value.js is the heaviest
surface and the consume-leg's principal; parse-that rides it transitively + carries its own
diagnostics surface; glass-ui is the third re-pin leg + the demo's motion/dock substrate.

---

## §1 — value.js (`/Users/mkbabb/Programming/value.js`, HEAD `e8cc1fb`, version `0.11.0`)

The principal sibling. `0.11.0` ALREADY shipped the entire Tranche-F wave (C1/B3/B5/A1/C5/
A2/B1b/D2/F7 + the computed-endpoint cache); the kf consume-leg is the re-pin (§0). The
items below are the value.js surfaces G drives THIS tranche, ordered by the consume-leg.

### VJ-1 (= F-VJ-1 / G-CONST-1) — be CONSUMED by the re-pin (the spine; ALREADY published)

- **value.js side:** NOTHING to write — `0.11.0` is published and carries the wins. This row
  exists to bind the sequencing: the re-pin (kf G.W2) is the consume-leg.
- **What it lands, zero-kf-edit, through `iv._lerp`:** C1 computed-endpoint cache (−94% /
  O(frames)→O(1) per frame, `value.js interpolate.ts:26-72`, `normalize.ts:157-189`); B3/B5
  frozen color-channel plan (3.96×, `interpolate.ts:89-135`); A1 O(1) first-char `dispatch`
  at the 14-way color fork (`color.ts:557-593`); C5 the 24 no-op relative length units
  (`dvh`/`svh`/`lvh`/`vi`/`vb`/`cap`/`ic`/`lh`/`rlh`) — a **correctness** fix, WRONG px → right.
- **Disposition:** **ALREADY-SOTA (published) — consumed by the kf re-pin (G.W2).**
- **Gate (BITE):** the kf `proof:deps-current` (a) reads `node_modules/@mkbabb/value.js/
  package.json` ≥ the F-published floor `0.11.0` (bites today: `0.10.0 < 0.11.0`); (b) a C5
  `50dvh` non-identity correctness test (resolves to `0.5 × dynamic-viewport-height`, not
  `50` — reds on 0.10.0, greens on 0.11.0, `a-valuejs-leverage F-VJ-1` clause 3); (c) the C1
  computed-frame resolve-count witness (`interp-buffer.bench` **computed-unit** variant — the
  current FLAT_KEYS are numeric, a computed-unit variant is needed to BITE on C1,
  `_SYNTHESIS-backend-constellation §1`).
- **Sequencing:** the re-pin LANDS FIRST in G (`_SYNTHESIS-gap-scorecard §2 Band 1`) — it
  gates the honest re-measure of every value.js row below. The two honest caveats the
  consume-leg carries (NOT a mechanical bump): (1) `0.11.0` folds real behaviour deltas A2 +
  C5, routed through kf's gates — correct, what `ci.yml:32-35`'s chore(deps) discipline is
  for; (2) the dual-realm parse-that caveat (see PT-0 below).

### VJ-F1 — the path-geometry sampler (unblocks MorphSVG / numeric-MotionPath) — value.js-HANDOFF

- **value.js side:** value.js exposes a path-`d` → length-parametrized bézier sampler. **NOT
  shipped in `0.11.0`** (grep `value.js/src` = no `d`-parse → sampler — `a-valuejs-leverage
  §3.2`/F-VJ-7). The idiomatic home is beside `value.js transform/decompose.ts`
  (`_SYNTHESIS-backend-constellation §8 G26-1`).
- **What it unblocks in kf:** the kf SVG wave's MorphSVG + numeric MotionPath (G26-1, BOOK).
  **DrawSVG does NOT need it** (one `getTotalLength()` DOM read, no geometry — it is the
  CSS-native sliver kf SHIPs THIS tranche without any value.js dep, `r-animation-sota G26-2`).
- **Disposition:** **value.js-HANDOFF + BOOK (the kf SVG wave consumes on publish).**
- **Gate (BITE):** value.js side — the sampler resolves N points along a known path within ε
  of a reference (a closed-form circle/line). kf side — `proof:morphsvg` is the BOOK gate,
  carried, not built until the sampler publishes.
- **Sequencing:** value.js publishes the sampler → the kf MorphSVG/numeric-MotionPath wave
  un-BOOKs. NOT a 4.0.x dependency; the kf DrawSVG SHIP (G.W13) is independent of it.

### VJ-F4 (= G-PERF-2 / G-HO-3) — the buffer-reusing `unflattenObjectToString` serializer — value.js-HANDOFF

- **value.js side:** a caller-owned out-buffer overload `unflattenObjectToString(flat, out?)`
  that null-fills a compile-stable string buffer instead of minting `{}` + per-key
  `.split(".")` + concat garbage EVERY frame (`value.js units/utils.ts:115-148`). **`0.11.0`
  did NOT address it** — byte-identical to `0.10.0` (`_SYNTHESIS-backend-constellation §3
  G-PERF-2`, no VJ-F4 commit in the changelog).
- **The bite, sized:** the per-frame DOM-write path (`engine.ts:735` → `transformTargetsStyle`
  → `utils.ts:370`). A K=10 transform frame = ~10 split-arrays + a result object + concat
  garbage, per frame, forever. The shape mirrors what value.js did for the interp buffer (C1)
  and kf for the lerp buffer (F.W4).
- **kf consume-leg:** thread a per-animation string buffer through `transformTargetsStyle` on
  the SAME re-pin once the overload publishes.
- **Disposition:** **value.js-HANDOFF (kf consumes on the re-pin once published).**
- **Gate (BITE):** value.js side — a `%HasFastProperties` + alloc-count bench on the threaded
  buffer (the C1/F.W4 template). kf side — fold the DOM-write into the existing `proof:zero-alloc`
  contract. **NB the write path is currently OUTSIDE the zero-alloc lock** (`proof:standalone-zero-alloc`
  gates the interp-buffer identity, NOT the write path — a named gate gap worth closing,
  `_SYNTHESIS-backend-constellation §3`).
- **Sequencing:** value.js publishes the overload → kf threads the buffer in the DOM-write
  fold (kf G.W2/BOOK). Independent of VJ-F1.

### VJ-F2 (= G-PT-3 producer / G-HO-4) — the structured-diagnostics SINK + `tryParse` `furthest` swap — value.js-HANDOFF (HIGH)

- **value.js side, TWO legs:** (a) `tryParse` (`value.js src/parsing/utils.ts:68-79`) reads
  `state.offset` (the backtrack-RESTORED point), NOT `state.furthest` (the real derail point
  parse-that `0.9.0` now exposes) — so value.js error messages point at the WRONG offset for
  any backtracking grammar; the one-field swap is strictly-more-correct, isomorphic for
  non-backtracking parses (`a-parsethat-leverage §3` gap 1). (b) value.js exposes a structured
  `parseResultWithDiagnostics` returning the `0.9.0` `Diagnostic[]` under `enableDiagnostics()`
  — the `onParseError` sink VJ-F2 specified, now buildable on shipped parse-that primitives.
- **The grounding:** `grep "Diagnostic|furthest|enableDiagnostics" value.js/src` = ZERO —
  value.js consumes NONE of parse-that `0.9.0`'s diagnostics surface (`a-parsethat-leverage §3`).
- **kf consume-leg (SHIP-in-G, GATED on this sink):** the kf adapter carries `diagnostics?:
  Diagnostic[]` on `ResolvedKeyframes`, populated on a malformed parse — the editor demo's
  parse-error channel replacing the silent collapse / bare throw. **Do NOT half-wire** (F.W8
  discipline) — populated end-to-end or not declared (`a-parsethat-leverage §3`).
- **Disposition:** **value.js-HANDOFF (HIGH) + kf SHIP-in-G (gated).** Subsumes F-BL-4's
  opaque-throw residual (the typed scroll-range guard surfaces through the same channel,
  `_SYNTHESIS-backend-constellation §5`).
- **Gate (BITE):** a kf `fromString` test over a malformed `@keyframes` (`@keyframes x { 50%
  { transform: } }`) asserts a non-empty `diagnostics` array with the `furthest`-correct
  offset / `expected` set — reds today (no field), greens when wired; bite-control: well-formed
  keyframes → empty/absent (`a-parsethat-leverage §3` instrument).
- **Sequencing:** value.js publishes the `furthest`-swap + sink → kf wires the
  `ResolvedKeyframes.diagnostics` seam (kf G.W4, AFTER the value.js sink publishes). The
  producer half (parse-that `0.9.0`) is ALREADY real (see PT-1).

### VJ-F6 (= F3 / G-HO-9) — the LRU bound on `getComputedValue.cache` — value.js-HANDOFF (lives ONCE in value.js)

- **value.js side:** an LRU eviction bound on `getComputedValue.cache`. `0.11.0` ships the C1
  cache + `bumpLayoutEpoch().clear()` (the wholesale-clear) but NO LRU bound
  (`a-valuejs-leverage §3.2`/F-VJ-6).
- **Why ONCE in value.js:** the re-pin makes a kf-side SECOND eviction policy a DRY violation
  — the bound belongs in value.js where the cache lives. kf must NOT add a parallel policy
  (`a-valuejs-leverage F-VJ-6`, `G-HO-9`).
- **Disposition:** **value.js-HANDOFF.** kf-side: NOTHING (consumes the bound transparently
  on re-pin).
- **Gate (BITE):** value.js side — a cache-size bench under an unbounded-key workload showing
  the bound holds and evicts LRU. No kf gate (kf has no second policy by design).
- **Sequencing:** independent of the kf consume-leg; value.js sequences against its own LRU
  discipline. RECORD kf-side that no kf eviction policy is owed.

### VJ-E1/E2 (= G-HO via F-VJ-8) — the `linear()` / `steps()` parsers (kf's `parseLinearStops` shim RETIRES) — value.js-HANDOFF (re-scoped DRY)

- **value.js side:** value.js grows the `linear()` / `steps()` easing parsers. **OPEN
  value.js-side; kf's LOCAL reader already LANDED** (`utils.ts:106-130`,
  `a-valuejs-leverage §3.2`/F-VJ-8).
- **The no-legacy collapse:** when value.js E1 lands, kf's `parseLinearStops` shim RETIRES
  ONTO it in the same motion — no compat alias kept beside it (`F.md:55` no-legacy; the kf
  shim is NOT a kf blocker today, it works).
- **Disposition:** **value.js-HANDOFF (re-scoped DRY).** kf consume-leg: DELETE the shim,
  import value.js's parser, on the publish.
- **Gate (BITE):** value.js side — the parser round-trips `linear(0, 0.25 75%, 1)` /
  `steps(4, jump-end)` byte-identically. kf side — after the publish, `grep parseLinearStops
  src/` = 0 (the shim is gone, not aliased).
- **Sequencing:** value.js publishes E1/E2 → kf retires the shim. Not blocking; the shim
  rides until then.

### VJ-A-tier (= G-PT-4 / G-HO-7) — the `dispatch`-LUT inner forks (62 `any(` vs 2 `dispatch(`) — value.js-HANDOFF (in flight)

- **value.js side:** convert the remaining `any(` forks to the O(1) first-char `dispatch` LUT.
  A1 LANDED at the top-level color value parser (`color.ts:593`), but **62 `any(` sites remain
  vs 2 `dispatch(`** (verified `grep` over `value.js/src`, `a-parsethat-leverage §4` /
  `_SYNTHESIS-backend-constellation §9 G-HO-7`). The inner color-family buckets
  (`letterBuckets`, `color.ts:570`) + the unit/length alternations are still `any()`-based.
- **kf consume-leg:** rides transitively on the re-pin — ZERO kf edit (kf reaches color
  parsing only through value.js).
- **Disposition:** **value.js-HANDOFF (carried from F Wave A; A1 discharged; A2 + inner forks
  pending). kf-transitive.**
- **Gate (BITE):** value.js side — the `any()`-site count drops as forks convert; the per-fork
  dispatch bench bites (the measured 21× tail / 3.65× end-to-end, `px-parser-perf PXP-1`). kf
  side observable — `bench/parser.bench.ts` shows no regression on re-pin and the color-heavy
  compile path tracks the value.js dispatch win.
- **Sequencing:** value.js's own Wave A cadence; kf consumes whatever has landed on each re-pin.

### VJ-D2-follow-through (= G-PERF-1 enabler) — the SoA `lerpArray` primitive (PUBLISHED; kf consumes via a `leaves` parity-copy) — value.js-HANDOFF (published) + kf MEASURE-FIRST

- **value.js side:** the SoA `lerpArray(Float64Array, Float64Array, t, out)` carrier primitive
  is **PUBLISHED in `0.11.0`** (`value.js math.ts:48-60`), measured 1.56× (K=2) → 4.25× (K=64),
  byte-identical to K independent `lerp()` calls, SLOWER at K=1 (`a-valuejs-leverage F-VJ-3`).
  Nothing more to write value.js-side for the primitive.
- **The kf follow-through (MEASURE-FIRST, kf-local — named here for the boundary):** kf's
  `NumericAnimation` (`numeric.ts:139-141,175-181`) and the engine's numeric-segment carrier
  are the in-tree SoA references shaped to consume `lerpArray` for K≥2. The boundary detail:
  `NumericAnimation` is light-tier (zero static value.js edge — reads `internal/leaves`), so
  the consume requires a **`leaves.lerpArray` parity-copy** (mirrors the existing `leaves.lerp`/
  `clamp` pattern) — settle at impl, not a blocker (`a-valuejs-leverage §2` note,
  `_SYNTHESIS-backend-constellation §3 G-PERF-1`). The live K is bimodal: `opacity` = K=1
  (stays on the F.W4 alias), every transform animation = K=6–10 where `lerpArray` BITES
  2.5–4× (re-measured graduate from F's "absent at K=1").
- **Disposition:** **value.js-HANDOFF (published — the primitive) + kf MEASURE-FIRST → SHIP
  (K≥2, gated on the real-K bench).** D1 monomorphization is KILLED upstream (a measured
  non-win, value.js did NOT ship it); CSS Typed OM as carrier KILLED — do NOT re-litigate.
- **Gate (BITE):** kf `proof:interp-soa` — a bench over the demo's REAL-K corpus (the cube/
  sphere/playground transform animations, NOT a synthetic K) asserting the SoA-segment path
  beats the AoS dispatch for K≥2 AND byte-identical output (a pixel-lock comparing the scatter
  result to the per-iv path); plus a `lerpArray` call-counter asserting K=1 frames take the
  alias. Lands on ≥1.3× at the demo K; records-withheld WITH the number otherwise.
- **Sequencing:** the primitive is published (rides the re-pin); the kf SoA-segment fold is a
  kf MEASURE-FIRST wave (G.W after the re-pin), gated on the byte-lock + real-K bench. The
  riskiest structural carrier change (`p-runtime-perf-F P-4`) — lands behind the lock, not asserted.

### value.js §ALREADY-SOTA (BINDING — manufacture NO work)

- **The single-dispatch interp seam** (`engine.ts:731` → `iv._lerp`) — the structural reason
  the re-pin is zero-kf-edit. No refactor (`a-valuejs-leverage §3.1`/§4).
- **The boundary** — light modules carry zero static value.js edge; the heavy surface imports
  value.js directly, no barrel indirection. **The color science** (oklab/oklch perceptual lerp,
  gamut mapping, CSS-Color-4 hue short-way) + **parse breadth** + **interp dispatch** at or
  ahead of SOTA — "the gaps are churn + memo-key cost + a handful of spec parsers, not science"
  (`a-valuejs-leverage §3.3`, `valuejs-sota-handoff-v2.md:76-77`). `0.11.0` closed the churn
  (B3/B5) + the memo-key cost (C1/C2). **All 29 kf-consumed value.js names survive `0.11.0`** —
  the re-pin is non-breaking.
- **S4/S6/F2** (native WAAPI color, `currentColor`/`light-dark()` sentinels) are OPEN value.js-side
  but are the *next* value.js wave (F-VJ-4/F-VJ-5 / G-HO-10) — paired kf eligibility-lift /
  policy lands the same motion; NOT manufactured here.

---

## §2 — parse-that (`/Users/mkbabb/Programming/parse-that`, HEAD `6fb9de2`, version `0.9.0`)

The transitive sibling. `0.9.0` landed the four F waves clean (PT-WAVE-1 state-threading,
PT-WAVE-2 packrat isolation, PT-WAVE-3a span-dist reconcile, §1.5 `parseSingleValue`/
`parseFunctionArgs` expose) — `a-parsethat-leverage §6` confirms ALL HELD. kf consumes
parse-that through exactly ONE direct import (`any`, `utils.ts:1`); the rest is value.js-transitive.

### PT-0 (= G-PT-1 / G-CONST-2 / G-HANDOFF-1) — the re-pin safety + the dual-realm sequencing (proof:packrat-position is NOT this) — verified non-breaking

- **The break, located:** `0.9.0`'s ONLY API break — the `.memoize()` / `.mergeMemos()`
  Parser *methods* removed, re-homed as free functions in `packrat.ts` (`index.ts:8`). Verified
  it touches NEITHER consumer: `grep "\.memoize(" kf/src value.js/src/parsing` = ZERO
  (`a-parsethat-leverage §1`). kf's one direct import (`any`, `utils.ts:1`) is still
  root-exported (`leaf.ts:28`). So the re-pin is a transitive consume, NOT a migration.
- **The dual-realm caveat (the sequencing decision).** value.js `0.11.0` ITSELF still pins
  parse-that `^0.8.2` (`npm view @mkbabb/value.js@0.11.0 dependencies` — `a-constellation-gaps
  §1`). Two clean orderings:
  - **(A, preferred — KISS):** re-pin value.js `^0.11.0` and let parse-that ride **transitively**
    (kf's one direct parse-that import is `any`, still exported by `0.9.0`). Do NOT independently
    bump kf's direct parse-that pin past what value.js resolves; keep the realms convergent.
  - **(B):** value.js re-pins its OWN parse-that `^0.8.2`→`^0.9.0` FIRST (G-HANDOFF-1), publish
    a patch, then kf re-pins both to converged `0.9.0`.
- **Disposition:** **kf SHIP-in-G (the re-pin safety verification, ordering A) + value.js-HANDOFF
  (ordering B's predecessor, G-HANDOFF-1 — the realm-convergence patch).**
- **Gate (BITE):** kf side — `proof:boundary` stays green + `grep -c "\.memoize(" src/` = 0
  (the bite-control: a hypothetical `.memoize()` call fails to compile against `0.9.0`); PLUS
  the `proof:deps-current` dual-realm convergence clause (the parse-that realm kf resolves and
  the realm value.js resolves are the SAME minor — converts the silent `as any` hazard at
  `utils.ts:258` into a gated invariant, `a-constellation-gaps G-CONST-2`).
- **Sequencing:** ordering A makes G-HANDOFF-1 UNNECESSARY (the realms converge transitively);
  ordering B needs the value.js parse-that re-pin FIRST. **NOTE:** the WITHHELD `(id,offset)`
  packrat re-key (`proof:packrat-position` THEN re-key) is a SEPARATE parse-that-internal
  item, NOT a re-pin predecessor — see PT-2 below.

### PT-1 (= G-PT-3 producer half) — the diagnostics CONSUMPTION (the producer landed; both consumers are dark) — value.js-HANDOFF (consumer) + parse-that ALREADY-SOTA (producer)

- **parse-that side:** the producer half is ALREADY SHIPPED + root-exported in `0.9.0` —
  `ParserState.furthest`/`.expected`/`.suggestions`/`.secondarySpans` instance fields
  (`state.ts:43-53`); `enableDiagnostics()`/`getCollectedDiagnostics()`/the `Diagnostic` type
  (`utils.ts:84-93`) root-exported (`index.ts:5`); the `console.error`s gated behind
  `isDiagnosticsEnabled()` (`parser.ts:50` — the F7 leak root closed at the seam). **Nothing to
  write parse-that-side.**
- **The consumer gaps:** value.js's `tryParse` reads `state.offset` not `state.furthest`; kf
  has NO parse-error channel at all (`ResolvedKeyframes` carries no `diagnostics` field). **Both
  gaps are owned by VJ-F2 above** (the value.js `furthest` swap + sink, then the kf
  `ResolvedKeyframes.diagnostics` seam). This row records that the parse-that PRODUCER is done;
  the CONSUMER work is the value.js-HANDOFF + kf SHIP of VJ-F2.
- **Disposition:** **parse-that ALREADY-SOTA (producer published) — consumer = VJ-F2.** The F
  BOOK NEW-18/PX-5/VJ-F2 producer half is now real.
- **Gate (BITE):** see VJ-F2 (the kf `fromString` malformed-keyframes diagnostics test).
- **Sequencing:** producer is done → value.js consumes (VJ-F2 leg a/b) → kf consumes (VJ-F2 kf
  seam). The full chain is parse-that (done) → value.js → kf.

### PT-2 — the `(id,offset)` packrat re-key (proof:packrat-position FIRST) — parse-that-HANDOFF (internal)

- **parse-that side:** the packrat `MEMO` is still `id`-only-keyed, NOT `(id,offset)`
  (`packrat.ts:61,82` — `MEMO.get(p.id)`). PT-WAVE-2 documented this as a KNOWN LIMITATION
  (`packrat.ts:16-26`) and BOOKED the sound Warth-Douglass-Millstein `(id,offset)` re-key as a
  dedicated packrat-soundness tranche (`a-parsethat-leverage §6`, `_SYNTHESIS-gap-scorecard §2
  Band V` "the one parse-that item F left undone", `a-deferred-ledger PT-4`).
- **The sequencing constraint (HARD):** **build `proof:packrat-position` FIRST, THEN re-key.**
  The re-key is a soundness change to a hot primitive — it MUST land behind a falsifiable
  position-correctness gate, not asserted (the F discipline: advisory→hard, no-ship-on-assertion).
- **Why it is NOT a consumer-facing defect:** packrat is OFF the default path; NEITHER kf NOR
  value.js opts into it (zero production consumers — `a-parsethat-leverage §6` RECORD). So it is
  parse-that-internal and does NOT block the re-pin or any kf wave.
- **Disposition:** **parse-that-HANDOFF (internal soundness; NOT kf/G scope, NOT a re-pin
  predecessor).** Recorded so no G lane mistakes it for a consumer-facing defect.
- **Gate (BITE):** parse-that side — `proof:packrat-position` (a backtracking grammar memoizes
  the SAME `id` at two distinct offsets and the re-keyed `MEMO` returns the offset-correct cached
  result; the `id`-only key returns the WRONG one → the gate reds pre-re-key, greens post).
- **Sequencing:** `proof:packrat-position` lands FIRST, THEN the `(id,offset)` re-key. Owned by
  the parse-that owner against its own discipline; independent of all G waves.

### PT-3 (= G-PT-5 / G-HO-8) — value.js adopts parse-that's exposed `parseSingleValue`/`parseFunctionArgs` (the realm-dedup root) — value.js-HANDOFF (BOOK, strategic)

- **parse-that side:** the §1.5 expose is DONE — `parseSingleValue`/`parseFunctionArgs`
  root-exported (`parsers/index.ts:3`, `a-parsethat-leverage §6`). The PRODUCER half of
  value.js's deepest adoption (VJ-WAVE-B) is real.
- **value.js side (BOOK):** value.js could adopt parse-that's hand-written first-char-dispatch
  single-pass reader (`parsers/css/value.ts:11,89`) + a thin `CssValue → ValueUnit` adapter,
  instead of re-implementing the single-value reader. **This is the structural resolution of the
  kf dual-realm cast:** if value.js owns the value-vs-function discrimination, kf's direct
  `any(...)` import + the `as any` cross-realm cast (`utils.ts:251-260`) VANISHES — kf reaches
  the whole parse surface through value.js alone (`a-parsethat-leverage §2`/§5). The realm-dedup
  ROOT is value.js peer-declaring parse-that (G-HO-2 / F-BL-5) — a dep-graph property, NOT a kf edit.
- **Disposition:** **value.js-HANDOFF (BOOK, strategic — VJ-WAVE-B). kf benefits transitively +
  sheds its direct parse-that edge; ZERO kf edit.** Do NOT manufacture a kf rewrite of the seam
  in isolation — it would re-import MORE of parse-that, not less (`a-parsethat-leverage §2`).
- **Gate (BITE):** value.js side — the `CssValue → ValueUnit` adapter passes the full value.js
  parse corpus byte-identically. kf side — `grep -c "from \"@mkbabb/parse-that\"" src/` = 0 and
  the `as any` casts at `utils.ts:251,258` are gone, both replaced by a single value.js call; the
  bite: `translate(10px, 20%)` parses byte-identically before/after.
- **Sequencing:** value.js sequences AFTER its cheap isomorphic Wave-A wins (the §1.5 expose is
  the gate that makes it reachable). value.js's grammar is dirty + active — its call.

### parse-that §ALREADY-SOTA (BINDING — manufacture NO work)

The leaf tier — `string()` charCode fast path (`leaf.ts:145-176`), `regex()` sticky-`y`
zero-alloc `test()` (`leaf.ts:189-226`), `trimStateWhitespace` charCode loop (`leaf.ts:235-254`)
— at/beyond the JS-combinator frontier. The `Int8Array(128)` first-char `dispatch`
(`leaf.ts:60-104`). PT-WAVE-1/2/3a all LANDED CLEAN. The §1.5 expose LANDED. **Manufacture no
parse-that work here** (`a-parsethat-leverage §6`).

---

## §3 — glass-ui (`/Users/mkbabb/Programming/glass-ui`, branch `at-dock-convergence`, version `3.3.0`)

The demo's motion + dock + dialog substrate. `3.3.0` is PUBLISHED but the demo consumes a
`file:` LINK to a dirty branch (the WORST of the three pin states — `a-glass-ui §0`). Under
the user's MEMORY feedback, **all glass-ui/dock changes go in the glass-ui repo, never patched
in the demo** — so the directional-VT helper + the dock occlusion are glass-ui-rooted; only the
kf-demo consume-legs (the rename/barrel-delete/mask-removal + the VT-stub realign) ship in kf.

### GG-1 (= the glass-ui leg of the spine) — be CONSUMED off the `file:` LINK (re-pin to `^3.3.0`) — published; kf SHIP consume-leg

- **glass-ui side:** NOTHING — `3.3.0` is published (`npm view @mkbabb/glass-ui version` →
  `3.3.0`; local HEAD also `3.3.0`). This row binds the sequencing.
- **kf consume-leg (SHIP-in-G):** replace `"@mkbabb/glass-ui": "file:../glass-ui"` with
  `"@mkbabb/glass-ui": "^3.3.0"`, reinstall, verify the demo build + `demo-smoke` green. The
  genuine consume-the-published-leg, NOT a vendored patch. Unblocks reproducible CI (the link
  cannot resolve on a clean GitHub runner — `a-glass-ui §0`, `a-backend-legacy:86`).
- **Disposition:** **ALREADY-SOTA (published) — kf SHIP-in-G (the glass-ui leg of the §pin-lag
  re-pin).**
- **Gate (BITE):** the kf `proof:pin` clause — NO `file:`/`link:`/`git:` protocol in any
  `@mkbabb/*` dependency + installed === pinned. Bites on a re-introduced link (`a-glass-ui GG-1`).
- **Sequencing:** pair with the value.js/parse-that re-pin (ONE re-pin motion, three deps,
  kf G.W2). glass-ui `3.3.0` is published; no glass-ui predecessor needed for the bare re-pin.

### GG-3 (= H-1 / FB-4 enabler) — `startViewTransition({types})` object-form + `:active-view-transition-type()` CSS — glass-ui-HANDOFF (G CAN drive)

- **glass-ui side:** grow `startViewTransition` from the bare-callback form
  (`useViewTransition.ts:80`, `dist/.../useViewTransition.d.ts:31` — `startViewTransition(mutate:
  () => void): ViewTransitionResult`) to ALSO accept the object form `{ update, types? }`, and
  ship the paired `:active-view-transition-type(forward|backward)` CSS recipe in
  `view-transition.css` (which today does crossfade/slide via `view-transition-class:
  gl-list-item` + `--vt-*` tokens but has **ZERO `:active-view-transition-type()` selectors** —
  verified grep, `a-glass-ui §2`).
- **The platform half is READY (Baseline-confirmed):** View Transitions Baseline 2025-10-14;
  Active view transition (the `types` param + `:active-view-transition-type()` selector) Baseline
  **2026-01-13 — PAST today** (`a-glass-ui §2`, grounded via modern-web-guidance
  `directional-navigation-transitions`).
- **The idiomatic shape (NO back-compat alias — replaced surface replaced in one motion):** the
  helper takes `mutate` OR `{ update, types? }`, feature-detects `document.startViewTransition`,
  and on the native path calls `doc.startViewTransition({ update: mutate, types })` (Baseline
  engines accept the object form). The instant fallback is unchanged. The CSS half adds a
  `gl-vt-directional` family keyed on `:active-view-transition-type(...)` with `transform`-only
  keyframes (animate `translate`/`transform`, never `inset`), `prefers-reduced-motion` zeroing
  the slide (glass-ui's existing PRM `animation:none` pattern).
- **Disposition:** **glass-ui-HANDOFF (G CAN drive it directly under relaxed inv-16 — the helper
  + CSS substrate both live in glass-ui per the user's MEMORY feedback).** Then the demo consumer
  (GG-4) lands as a kf-demo BOOK that PASSES `{types}` derived from scene-order.
- **Gate (BITE):** glass-ui side — a unit test asserting the object-form overload. kf side — a
  browser-driven VT-types assertion in the EXISTING `demo-smoke` Chromium job (NOT a new gate,
  `a-glass-ui GG-3`). Un-actionable in the demo until the glass-ui helper lands.
- **Sequencing:** glass-ui lands the helper + CSS → the demo scene-VT (GG-4, kf BOOK) derives
  `dir` from the scene index delta and passes `{types}`. The current crossfade is functional +
  Baseline-degrade-clean — low urgency, lands as the consumer of GG-3, not before.

### GG-5-occlusion (= DP-1 / the dock `--z-dock`/occlusion ROOT fix) — glass-ui-HANDOFF (the mobile/square occlusion)

- **glass-ui side:** the rebuilt dock (AV.W9, `glass-ui/CHANGELOG.md:3-7`) must own the
  no-occlusion contract natively. The demo today MASKS the occlusion with
  `:always-expanded="isMobile"` (`TopDock.vue:118,65`) — the occlusion-dodge mask DP-1 named for
  removal — to avoid the square/mobile dock-over-content overlap (inv δ, the HARD occlusion gate).
  The `--z-dock` token is not applied to glass-ui's internal dock LAYERS, so the scene viewport
  wins the hit-test + the 15px collapsed sliver remains (`a-demo-playwright X-1`,
  `_SYNTHESIS-gap-scorecard §2 G.W12`). **That overlap is glass-ui's to solve in the rebuilt
  dock root, never the demo's to re-mask.**
- **kf consume-leg (SHIP-in-G, the kf-demo half — GG-5):** rename `TopDock→ChromeDock`; DELETE
  the `dock/index.ts` 3-line pass-through re-export barrel (import glass-ui dock primitives
  directly — the Mandate forbids re-route-only barrels, `a-glass-ui §3`); REMOVE the
  `:always-expanded` mask (let glass-ui own the contract); collapse the dead single-layer
  `DockLayerGroup`/constant-`activeLayer` costume (`TopDock.vue:107-109,119-120`).
- **Disposition:** **kf SHIP-in-G (the kf-demo half) + glass-ui-HANDOFF (the square/mobile
  occlusion ROOT in the rebuilt dock).** The D.W5 gate is OPEN (`3.3.0` published) — this is a
  genuine SHIP, not a re-defer; the external blocker is GONE.
- **Gate (BITE):** the EXISTING `occlusion-gate.mjs` HARD assertion (advisory→hard in C.W1)
  re-run with the mask REMOVED — it must stay green WITHOUT the `:always-expanded` crutch; PLUS a
  `proof:decomposition` barrel-absent clause (no `dock/index.ts` pass-through). Bites if the mask
  returns or the barrel re-appears (`a-glass-ui GG-5`).
- **Sequencing:** confirm glass-ui's rebuilt dock handles the mobile no-occlusion natively
  (browser-test on `square`/mobile viewport). If it does → the kf-demo half SHIPs mask-free. If
  NOT → the residual occlusion is the glass-ui-HANDOFF (fix in the dock root). The kf rename +
  barrel-delete + dead-group-collapse are independent of the occlusion root and SHIP regardless.

### GG-6 (= the reka `SelectIcon` re-export) — glass-ui-HANDOFF (low urgency) OR demo-local KILL

- **glass-ui side:** glass-ui consumes `SelectIcon` internally (`ui/select/SelectTrigger.vue:3,46`)
  but does NOT re-export it from its `./select` subpath (`dist/select.d.ts` re-exports the wrapped
  components, not the raw reka primitives — `a-glass-ui §4`). So the demo reaches PAST glass-ui to
  reka-ui for a single chevron-slot primitive: the ONE direct `from "reka-ui"` import in the demo
  (`AnimationMenuBar.vue:174`). glass-ui could re-export the reka primitives its `Select` family is
  composed from (so consumers extend the trigger without reaching past the surface).
- **The demo-local alternative (leaner):** replace the raw `SelectIcon` with glass-ui's
  `DockSelectTrigger`/`SelectTrigger` (which already own the icon slot — the idiom `TopDock.vue:147`
  uses). Verify the visual is identical (the Mandate's isomorphic-styling rule, pixels stable).
- **Disposition:** **glass-ui-HANDOFF (re-export, low urgency) OR demo-local KILL (use
  `DockSelectTrigger`).** Lean demo-local; if a genuine raw-primitive need remains, hand glass-ui
  the re-export ask. One borderline import, not a systemic gap.
- **Gate (BITE):** a `grep` clause in `proof:boundary`/`proof:decomposition` asserting zero direct
  `from "reka-ui"` in `demo/` (the demo consumes glass-ui's surface, not the basis). Bites on a new
  raw-reka reach (`a-glass-ui GG-6`).
- **Sequencing:** if demo-local KILL — independent, ships in the kf-demo idiom wave. If
  re-export — glass-ui lands the re-export, then the demo imports from `@mkbabb/glass-ui`.

### GG-2 (the motion-core `.d.ts` types gap — the kf vitest stub RETIRES when the types/helper land) — kf SHIP-in-G (test-infra) tracking the glass-ui surface

- **glass-ui side:** the demo `tsc` error is GONE — `3.3.0` ships `dist/motion-core.d.ts` and the
  symbols resolve with types (`a-glass-ui §1`, `tsc --noEmit` exits 0). The *type-resolution* gap
  is CLOSED by glass-ui shipping the subpath types.
- **The kf vitest stub has DRIFTED AHEAD of reality:** `test/stubs/glass-ui-motion-core.ts:18-37`
  (aliased in `vitest.config.ts:17-20` so the glass-ui-FREE library gate runs the demo-encapsulation
  tests) declares (a) a phantom `_options?: { types?: string[] }` param that does NOT exist on the
  real helper (it anticipates the GG-3 `{types}` helper that was NEVER shipped), and (b) the NATIVE
  `ViewTransition` return shape (`ready`/`updateCallbackDone`/`skipTransition`), NOT glass-ui's
  `ViewTransitionResult` (`{finished, transitioned}`, `useViewTransition.d.ts:1-11,31`). An UNGATED
  fiction modeling a contract glass-ui does not honor — the silent-handling the Mandate excises.
- **kf consume-leg (SHIP-in-G, test-infra correctness — GG-2):** the stub keeps a runtime no-op
  body (jsdom has no `document.startViewTransition`; `supportsViewTransitions()===false` is the
  faithful posture) but its SIGNATURE must `satisfies typeof import("@mkbabb/glass-ui/motion-core")`
  so a drift reds the type check. Strip the phantom `_options?: {types}` and the native-shape return;
  mirror `{finished, transitioned}`. **The stub FOLLOWS the helper, not leads it** — when GG-3 lands
  the `{types}` overload, the stub (now `satisfies`-locked to the real types) tracks it; until then
  the stub matches `3.3.0`'s actual bare-callback `ViewTransitionResult` shape.
- **Disposition:** **kf SHIP-in-G (test-infra correctness, realigns to glass-ui `3.3.0`'s ACTUAL
  contract). The phantom `{types}` half RETIRES naturally when GG-3's helper + types land** (the
  `satisfies` lock auto-tracks).
- **Gate (BITE):** a `tsc`-checked `satisfies typeof import(...)` assertion in the stub (compile-time
  bite); the existing demo-encapsulation tests exercise the runtime path. Bites on any future
  stub↔real drift (`a-glass-ui GG-2`).
- **Sequencing:** the stub realign SHIPs NOW against `3.3.0`'s actual contract (kf G.W12,
  independent — does NOT wait on GG-3). When GG-3's `{types}` overload publishes, the `satisfies`
  lock makes the stub track the new types with zero further drift.

### glass-ui §ALREADY-SOTA (BINDING — manufacture NO work)

- **The spring-token cascade** — `3.3.0` ships `--spring-smooth`/`--spring-snappy`
  (`tokens.css:159-160`), both generated by the SAME `springLinearStops()` the kf engine
  demonstrates; the demo's local `linear()` shadow was correctly REMOVED in E.W11; the one
  remaining `--spring-snappy: var(--spring-smooth)` is a NAMED befitting delta (`a-glass-ui §5`).
- **`springLinearStops()`** stays value.js-FREE + stable (`src/animation/springLinearStops.ts`,
  zero value.js import). **The motion-core SCC boundary** consumed correctly for its intent
  (engine-free leaf import via `/motion-core`, NOT `/motion`). **The VT a11y contract** honored
  (focus routes to the scene host on `finished`; `tabindex="-1"` + suppressed focus-ring; PRM
  degrade rides glass-ui's CSS, no demo duplicate). **Dialog/Popover/Select** consumed through the
  glass-ui surface (only the one `SelectIcon` reach is non-idiomatic, GG-6). **The keyboard-shortcut
  registry** is correctly glass-ui-resident. **No kf action** (`a-glass-ui §5`).

---

## §4 — The cross-repo sequencing DAG (who lands first; what gates the kf consume-leg)

```
SPINE (kf G.W2 — the re-pin, lands FIRST):
  value.js 0.11.0 (published) ─┐
  parse-that 0.9.0 (published) ─┼─→ kf re-pin (ordering A: parse-that transitive)
  glass-ui 3.3.0 (published) ──┘     gate: proof:deps-current + proof:pin + C5 50dvh + proof:all
                                     │
   ┌─────────────────────────────────┼──────────────────────────────────┐
   │                                  │                                   │
 value.js                          parse-that                          glass-ui
 ────────                          ──────────                          ────────
 VJ-F1 sampler ──→ kf MorphSVG (BOOK)        PT-0 realm-converge      GG-1 (= spine leg, published)
 VJ-F4 serializer ──→ kf DOM-write fold        (ordering A: no-op;    GG-3 helper+CSS ──→ GG-4 demo {types} (BOOK)
 VJ-F2 furthest+sink ──→ kf diagnostics seam    ordering B: G-HO-1)   GG-5-occlusion root ──→ kf dock half (mask-free)
   (PT-1 producer ALREADY done)              PT-1 producer DONE       GG-6 re-export OR demo KILL
 VJ-F6 LRU (once in value.js)                PT-2 packrat re-key      GG-2 stub realign (kf, NOW; tracks GG-3)
 VJ-E1/E2 ──→ kf shim RETIRES                  (proof:packrat-pos
 VJ-A-tier dispatch (kf-transitive)             FIRST; internal)
 VJ-D2 lerpArray (published) ──→ kf SoA (MEASURE-FIRST)
                                              PT-3 §1.5-adopt (BOOK,
                                                dissolves kf realm cast)
```

**The binding orderings.**
1. **The re-pin lands FIRST** (kf G.W2) — it gates the honest re-measure of every value.js row
   and is the consume-leg for GG-1 + VJ-1. Ordering A (parse-that transitive) avoids needing
   G-HANDOFF-1 entirely.
2. **VJ-F2 chains parse-that (done) → value.js (swap + sink) → kf (`ResolvedKeyframes.diagnostics`
   seam, kf G.W4).** The producer (PT-1) is already real; the seam is GATED on the value.js sink.
3. **VJ-F1 + VJ-F4 publish → the kf MorphSVG BOOK + the kf DOM-write fold consume.** DrawSVG
   (`r-animation-sota G26-2`) is INDEPENDENT — it ships in kf G.W13 with zero value.js dep.
4. **GG-3 (glass-ui helper + CSS) → GG-4 (kf demo passes `{types}`, BOOK).** GG-2 (the kf stub
   realign) ships NOW against `3.3.0`'s actual contract and `satisfies`-tracks GG-3 thereafter.
5. **GG-5-occlusion root (glass-ui) is the contract the kf-demo half relies on** — the kf rename +
   barrel-delete + dead-group-collapse SHIP regardless; the mask-removal is gated on the glass-ui
   dock owning the no-occlusion contract (browser-verified, else the residual is glass-ui-HANDOFF).
6. **PT-2 (`(id,offset)` packrat re-key) is parse-that-INTERNAL, NOT a re-pin predecessor** —
   `proof:packrat-position` FIRST, then the re-key; zero production consumers, blocks nothing.

---

## §5 — The deploy-adjacent constellation HAND-OFFs (named for completeness; deploy/fourier-owned)

These are constellation items the value.js/parse-that/glass-ui axis touches but that are owned by
the deploy spine (fourier) — recorded so the sequencing is explicit, NOT written here.

- **G-HANDOFF-2 (= G-CONST-3):** kf's green-CI-gated `deploy-pages.yml` → distil into the deploy
  spine's MISSING `templates/deploy-pages.yml` CF-Pages template (kf AUTHORS the content +
  rationale; deploy WRITES). Discharges ADOPTION-ASKS row 113. Owner: deploy (fourier).
- **G-HANDOFF-3 (P0):** deploy fix `dns-cf-sync.sh:105` `keyframes.pages.dev`→`keyframes-8uq.pages.dev`
  (DNS drift; kf's authoritative subdomain per `deploy-pages.yml:4-5` + `pages-deploy.sh:47`). A
  live-correctness fix, P0 by the grand-audit M2.1 rating. Owner: deploy (fourier).
- **G-HANDOFF-4 (RECORD):** the CONSTELLATION roster lags published reality (kf 3.0.0→4.0.0,
  value.js L→0.11.0); the kf row should read "4.0.0 PUBLISHED (D+E+F); CF-Pages deploy-of-record
  live." Owner: fourier hub refresh.
- **G-HO-2 (= F-BL-5 / the realm-dedup root):** value.js peer-declares parse-that → the
  `utils.ts:258` `as any` becomes a typed import (the structural root PT-3 builds on). A dep-graph
  property, NOT a kf edit. Owner: value.js.

---

## §6 — inv-16 / inv ε compliance

This charter wrote ONLY `docs/tranches/G/valuejs-parsethat-glassui-handoff.md`. ZERO source/test/
CI/demo edits to keyframes, value.js, parse-that, OR glass-ui. Every item is a *proposal* / a
HAND-OFF the respective sibling owner sequences; the kf-side consume-legs (the re-pin, the
diagnostics seam, the kf-demo dock half, the VT-stub realign, the DrawSVG/SoA folds) are kf SHIP
waves authored in `G/waves/`, NOT written here. **inv-16 is RELAXED for G impl** — the user MAY
drive value.js/parse-that/glass-ui — but each sibling is AUDITED as its own surface and every
cross-repo item is HAND-OFF-tagged with the sibling-repo `file:line`, the disposition, the
falsifiable gate, and the sequencing.

Every claim cites a phase-1 lane or a live `file:line` re-verified against the sibling trees
(2026-06-06): the pins (`package.json:85-86,88`; `node_modules` installed `0.10.0`/`0.8.2`/dirty
link; `npm view` published `0.11.0`/`0.9.0`/`3.3.0`); the single-dispatch seam (`engine.ts:731` →
`iv._lerp`); the value.js `0.11.0` wins (`interpolate.ts:26-135`, `normalize.ts:157-189`,
`color.ts:557-593`, `math.ts:48-60`); the value.js OPEN items (`unflattenObjectToString`
`units/utils.ts:115-148`; `tryParse` `parsing/utils.ts:68-79`; the path-sampler absent); the
parse-that `0.9.0` diagnostics surface (`state.ts:43-53`, `utils.ts:84-93`, `index.ts:5`,
`parser.ts:50`) + the packrat `id`-only key (`packrat.ts:61,82` + the documented limitation
`:16-26`); the glass-ui `3.3.0` motion-core types + the drifted stub (`a-glass-ui §1`,
`test/stubs/glass-ui-motion-core.ts:18-37`), the bare-callback VT helper (`useViewTransition.d.ts:31`),
the `:always-expanded` mask (`TopDock.vue:118,65`), the `dock/index.ts` pass-through barrel, the
reka `SelectIcon` reach (`AnimationMenuBar.vue:174`).

**The §ALREADY-SOTA record is binding: this charter manufactures NO work where D+E+F lead** — the
value.js single-dispatch seam + color science + parse breadth, the parse-that leaf tier + the four
landed F waves, and the glass-ui spring cascade + motion-core boundary + VT a11y contract are at or
ahead of SOTA and are left alone. **The whole charter is the spine (one re-pin, three deps) + a
small, tight, sibling-owned set of additive landings — no re-architecture, no manufactured deficit.**
