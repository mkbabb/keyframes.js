# U.D — THE PERFORMANCE FRONTIER

> **Status: DEVELOPMENT. Implementation NOT authorized.** Docs-only wave specs.
>
> **Charter sentence.** The SoA campaign optimized interpolation (~5% of a tick)
> while the apply/render seam (~95%, measured ~45–49× the interp cost) still
> allocates per frame, re-serializes strings, and issues one `setProperty` per
> property; U.D re-aims performance at the seam that actually costs frames —
> library (render-seam transposition, the allocation+throughput harness that
> SURVIVES the U.A trim, WAAPI sync-fast-path restore, drag2D onto one vector
> spring) and demo (Monaco kept FULLY-FEATURED but ON-DEMAND — zero editor bytes on
> first paint, 8MB dead workers → 0, OD-U5; the eager shell value.js-free, LCP
> decoupled from engine warm, highlight.js retired, and the reachability +
> weight-budget assertion as ONE post-build clause inside `proof:publish` — no
> standalone gate, OD-U11 — with the 906KB spring-leak cure moving to U.B's OD-U12
> facet seam, U.D owning the measurement).
>
> **Provenance lanes.** `audit/lane-21-perf-library-hotpaths.md` (library
> hot-path profile, F1–F7), `audit/lane-22-perf-demo-runtime.md` (demo chunk
> economy, F1–F7), `audit/lane-26-design-colocation-idiom-vue.md` Finding 1 +
> R2 (the chunk-graph gate class; the SpringScene→vendor-highlight born-RED
> witness — the facet cure itself is U.B's colocation move).
>
> **Precepts (binding).** Performance is the grand edict. NO patches — every
> cure is a gestalt transposition of the seam, not a filter over it. NO new
> deferral devices. NO legacy (dead workers, booked-and-declined Typed-OM,
> namespace-drag imports are all excised, not tolerated). Net gate count only
> goes DOWN: the harness is vitest (folds INTO `npm test`, survives U.A);
> **ZERO new standalone `proof-*.mjs` (OD-U11):** the dist-artifact reachability +
> weight-budget assertion the draft once proposed as `proof:chunk-graph` is DROPPED
> to ONE post-build CLAUSE inside `proof:publish` (KISS — one build-output check
> total; the structurally-blind gate class the source-shape roster cannot see, FOLDED
> not spawned). Every claim below carries a `file:line` cite spot-checked against the
> live tree (5.2.0, `tranche-u-dev`).

---

## §1 — Wave table

| Wave | Title | Substance | Size | Gate / oracle | Edges |
|---|---|---|---|---|---|
| **U.D1** | The render-seam transposition | `transformTargetsStyle` (`compile/parse-flatten.ts:306-320`): kill the per-frame `Object.entries`/`forEach` alloc (indexed loop over a compile-stable key array — the sample-side discipline); coalesce the transform-family (`translate*`/`scale*`/`rotate*`/`skew*`) into ONE `style.transform` write; land the CSS Typed-OM numeric-apply path (`attributeStyleMap.set`) booked-and-declined in Tranche P. | L | The U.D2 harness (heap-delta==0 over APPLY frames + throughput floor) + owner-golden visual parity + `typed-om-decision.json` re-cut DECLINE→LAND. | after **U.C** settles the `parse-flatten`/`interpolate` hot-path homes; first client of **U.D2** |
| **U.D2** | The allocation + throughput regression harness | Headless, **vitest-runnable** (survives U.A's trim — co-charter with U.A). (a) heap-delta==0 over ~1000 **apply** frames (not just sample); (b) an absolute-throughput floor per hot path, device-classed with tolerance, auto-re-baselined on every value.js re-pin. Re-cut the stale decision-JSON ratios (`processframe-soa-decision.json` 60.28× → measured 20.7×) against 5.2.0/value.js 3.1.0. Fold F6 (per-frame closure alloc, `play-lifecycle.ts:211-215`) as a covered assertion. Fold F4: vitest `exclude: ['**/.claude/**','**/node_modules/**','**/dist/**']` + pinned `root` so bench/test never traverse stale worktrees. | M | IS the gate — vitest under `npm test`; collapses `proof:zero-alloc`/`proof:standalone-zero-alloc`/`proof:processframe-soa` node-halves into vitest (U.A doubling genre). | co-charter **U.A** (mechanism survivor); **U.D1/3/4** are its clients |
| **U.D3** | Restore the WAAPI sync fast-path | `waapi/delegation.ts:38` — the `async` shadow callback ALWAYS returns a Promise, so `RAFPlayback`'s zero-microtask sync fast-path (`physics/playback.ts:139-147` — added in Tranche J to skip a Promise hop each frame; J.W6) never applies to WAAPI. Transpose to a plain function that inspects `advanceTo`'s return type and defers ONLY on the genuine first-tick thenable (mirroring the rAF path's own shape, `play-lifecycle.ts:222-225`). ONE scheduling idiom across both loops. | S | `proof:event-ordering` (existing, must stay green) + a U.D2 microtask-hop assertion (steady WAAPI frame does zero `.then`). | after **U.C** engine carves settle |
| **U.D4** | drag2D onto one 2-lane vector spring | `orchestration/drag/drag-2d.ts`: two independent scalar `Draggable`s (each its own `SpringProgress`) → ONE 2-lane `SpringVectorLanes` (`physics/spring/vector.ts`) — one closed-form step/tick, `exp`/`cos`/`sin` hoisted ONCE across both axes. Preserve the `Drag2DHandle` surface + per-axis `bounds`/`snap`/`rubberBand` pass-through; LIGHT preserved (zero value.js edge). | M | `proof:drag2d-light-certified` (existing, must stay green) + `spring-vector` bench arm re-baselined (`spring-vector-decision.json`) + U.D2 behavior parity. | with **lane 13** / **U.C** spring modal-kernel unification (vector.ts is that kernel) |
| **U.D5** | Demo: Monaco ON-DEMAND (full-featured) · eager shell value.js-free · LCP decouple · highlight retire · THREE named | Monaco (`CSSCodeEditor.vue:52`) STAYS fully-featured but ON-DEMAND (OD-U5): ZERO editor bytes on first paint; on facet-open, load monaco CORE + the needed language worker PER-LANGUAGE on demand + themes lazily + prettier as an on-demand chunk (the format action loads it on first USE) — the 8MB defect is DELIVERY (eagerly emitted, never fetched), NOT feature-set; an alternatives bake-off (CodeMirror 6 etc.) is RECORDED-only (replacement requires proof of strict superiority AND slimness). Eager shell value.js-free: `animationOptionsStore.ts:1` `jumpTerms` off the eager `@state` graph → routed through the warmed HEAVY engine surface (or a value.js LIGHT subpath ask → U.F). LCP decouple (`main.ts:50`): mount IMMEDIATELY, warm the engine at idle, transpose the sync non-null `AnimationGroup` contract to async-tolerant. highlight.js (`useHighlightCSS.ts:3`): `highlight.js/lib/core` (~40KB) or consolidate onto Monaco's colorizer and retire hljs entirely. THREE (`amiga/*`): `import * as THREE` → named/used-only. | L | The U.D6 `proof:publish` post-build clause + owner-golden LCP/paint parity. | LCP contract touches the scene-machine → **U.B8**; value.js-free routing → **U.F** if a LIGHT subpath is needed; feeds **U.D6** sub-checks b/c |
| **U.D6** | The `proof:publish` reachability + weight-budget clause (ONE post-build check, born-RED — OD-U11) | ONE post-build CLAUSE inside `proof:publish` over `dist/gh-pages/assets/` `from"./…"` edges + byte census (OD-U11: the standalone `proof:chunk-graph` gate is DROPPED — net NEW standalone gates = ZERO; the structurally-blind check the source-shape roster cannot see, FOLDED into `proof:publish`). **Sub-check a** (born-RED): no scene chunk statically reaches `vendor-monaco`/`vendor-highlight`/`html2canvas`; `vendor-three` only from `AmigaScene` — RED today on `SpringScene-*.js → vendor-highlight` (906KB, lane 26 F1); the CURE is U.B's OD-U12 facet seam (U.D owns the measurement). **Sub-check b**: zero non-css language worker emitted to dist (OD-U5). **Sub-check c**: per-chunk + eager-total byte ceilings (entry, eager CSS ≤~250KB, largest lazy vendor). | M | IS the clause; goes GREEN as **U.D5** + **U.B**'s facet seam land. | co-scheduled with **U.B** module cuts (the facet `defineAsyncComponent` cure is U.B's OD-U12 move; this clause is its born-RED witness); sub-check b after **U.D5** |

---

## §2 — Per-wave detail

### U.D1 — The render-seam transposition (lane 21 F1, the band headline)

**Evidence (verified `compile/parse-flatten.ts:306-320`).** The default DOM
renderer on the rAF apply hot path:
```ts
const styleStringVars = unflattenObjectToString(vars, _styleOut);   // re-serialize EVERY prop → CSS string, every frame
targets.forEach((target) => {
    Object.entries(styleStringVars).forEach(([key, value]) => {     // per-frame array + closure ALLOC, per target
        target.style.setProperty(key, value);                       // N separate writes → N style invalidations
    });
});
```
Per apply frame this (a) re-serializes every animated `ValueUnit` to a CSS string,
(b) allocates an `Object.entries` array + a `.forEach` closure **per target per
frame** (the zero-alloc gate never sees it — it fires only on the SAMPLE path,
`transformFrames=false`), (c) writes each property separately (a K-component
transform = K mutations/recalcs). Bench: REPLACE apply **5,755 hz** vs sample
**281,988 hz** = **49×**; `composite:add` apply is identical (5,793), proving the
cost is the write, not the blend. In a real browser (recalc, not jsdom) the gap is
larger.

**Transposition (three moves, one seam).** (1) Kill the alloc — walk a
compile-stable key array with an indexed loop, the same discipline
`interpolate.ts` `_stableKeys`/`clearBuffer` already uses on the sample side.
(2) Coalesce the transform family into ONE `transform` string committed as a
single `style.transform` write — one mutation, one recalc. (3) Land the CSS
Typed-OM numeric-apply path (`element.attributeStyleMap.set(prop, CSSUnitValue)`)
for numeric leaves that bypasses string serialization entirely — the Typed-OM work
`typed-om-decision.json` recorded as DECLINE never reached the default render path;
this wave lands it, re-cutting that decision to LAND. **Targets:** apply-frame
heap-delta == 0; transform-family K components → 1 style mutation; apply hz
materially above 5,755 (measured, re-baselined). **Edges:** rides the carved tree —
depends on U.C settling the `parse-flatten`/`interpolate` homes so the render seam
transposes once, on stable file homes (charter §3: "render seam rides the carved
tree").

### U.D2 — The allocation + throughput regression harness (lane 21 F2/F4/F6)

**Evidence.** The bench suite runs only RELATIVE A/B (SoA vs boxed,
`bench/interp-buffer.bench.ts`) — it cannot catch a regression that slows BOTH arms
nor a per-frame alloc creeping back (the exact F.W4 dictionary-mode 3.8–6.2×
regression already paid once). `processframe-soa-decision.json` records
`soaOverBoxed: 60.28`; the LIVE bench measures **20.7×** — the frozen ratios have
drifted under value.js (1.2.0 → 3.1.0, its tranche active). No CI-wired allocation
assertion, no absolute floor, and the alloc debt has migrated downstream into APPLY
where NO zero-alloc gate looks (F1). F6: `play-lifecycle.ts:211-215` allocates two
arrow closures `() => true`/`() => false` every frame for `withReducedMotion` even
on the dominant path that short-circuits without invoking them
(`reduced-motion.ts:158`). F4: this session's `npm run bench` produced 232 lines
from 4 stale `.claude/worktrees/` copies (~4× the work); `vitest.config.ts:45,49`
declares `test.include`/`benchmark.include` with **no `exclude`** for `.claude/**`.

**Transposition.** A two-part standing harness, authored as **vitest** (not a
standalone `proof-*.mjs`) so it folds into `npm test` and SURVIVES the U.A
apparatus dissolution — this is the perf gate that replaces the tautological
source-shape checks. (a) An **allocation-count assertion**: heap-delta == 0 over
~1000 APPLY frames (F1's cure + F6's closures are both covered — neither can
silently return). (b) An **absolute-throughput floor** per hot path, pinned to a
device-class with tolerance, **auto-re-baselined on every value.js re-pin** (the
consume-edge is the drift source). Re-cut every stale decision-JSON ratio against
5.2.0/value.js 3.1.0. Fold F4: explicit `exclude: ['**/.claude/**',
'**/node_modules/**','**/dist/**']` on BOTH the `test` and `benchmark` blocks +
pinned `root`, and a fleet-worktree GC covenant (orchestration hygiene, not just a
config line). This harness SUBSUMES the two U.H4-rehomed `*.measure` probes
(`sync-step` / `d3-changed-keys`) — their re-baselined ratios live HERE, not in the
correctness pool. **Net-gate:** collapses the node-halves of `proof:zero-alloc`,
`proof:standalone-zero-alloc`, `proof:processframe-soa` into vitest (U.A's
node-&&-vitest doubling genre) — count DOWN. **Edges:** co-charter with U.A (it is
one of the surviving mechanisms); U.D1/D3/D4 are its first clients.

### U.D3 — Restore the WAAPI sync fast-path (lane 21 F3)

**Evidence (verified `waapi/delegation.ts:38`).** `animation.playback.loop(async
(now) => { ... await animation.advanceTo(now); ... })`. Because the callback is
`async`, it ALWAYS returns a Promise, so `RAFPlayback._run`'s sync fast-path
(`physics/playback.ts:139-147` — the J.W6 zero-microtask optimization) NEVER
applies to WAAPI playback: every shadow frame does a `.then(reschedule)` microtask
hop and awaits a value that is synchronous on the steady path (`advanceTo` returns
a plain number post-first-tick, `play-lifecycle.ts:158-172`).

**Transposition.** Mirror the rAF path's own shape (`play-lifecycle.ts:222-225`):
make the shadow callback a plain function that inspects `advanceTo`'s return type
and defers only on the genuine thenable (the first-tick delay sleep); the
pause/resume compositor nudge is synchronous. The two loops then share ONE
scheduling idiom, not two. **Target:** steady WAAPI frame does zero microtask
hops. **Gate:** `proof:event-ordering` stays green (the fast-path restore must not
reorder lifecycle events) + a U.D2 assertion. **Edges:** after U.C engine carves.

### U.D4 — drag2D onto one 2-lane vector spring (lane 21 hot-path idiom; lane 13/U.C kernel)

**Evidence (verified).** `orchestration/drag/drag-2d.ts` composes two independent
one-axis `Draggable`s, each carrying its own scalar `SpringProgress` — so a 2-D
drag runs TWO closed-form spring steps per tick with the transcendentals computed
twice. `physics/spring/vector.ts` already ships `SpringVectorLanes` (the L.W7 SoA
lane subsystem, 2.97–3.78× over K scalars) with `exp`/`cos`/`sin` hoisted ONCE per
tick and reused across lanes — the exact amortization a 2-lane drag wants.

**Transposition.** Re-seat drag2D onto ONE 2-lane `SpringVectorLanes` (x,y) — one
step/tick, transcendentals shared. Preserve the `Drag2DHandle` surface exactly
(`value: {x,y}`, `velocity: {x,y}`, `subscribe((x,y,vx,vy)=>…)`, `dispose()`) and
per-axis `bounds`/`snap`/`rubberBand` pass-through; LIGHT preserved (vector.ts is
value.js-free plain typed-array math). **Gate:** `proof:drag2d-light-certified`
stays green (boundary intact) + the `spring-vector` bench arm re-baselined +
U.D2 behavior parity. **Edges:** co-owned with lane 13 / U.C's spring closed-form
"ONE modal kernel" unification — vector.ts is that kernel, so this wave lands after
U.C's kernel carve settles.

### U.D5 — Demo perf transpositions (lane 22 F1/F2/F3/F4/F6)

**F1 — Monaco (verified `CSSCodeEditor.vue:52` = full `import("monaco-editor")`).**
The full barrel registers the TS/HTML/JSON language contributions, each declaring a
`new Worker(new URL('…/{ts,html,json}.worker'))` Vite statically emits — so dist
ships `ts.worker` (6.9MB) + `html.worker` (719KB) + `json.worker` (409KB) = 8.02MB
the `getWorker` (editor+css only) can NEVER spawn. **Transposition (OD-U5 — Monaco
STAYS fully-featured; the 8MB is a DELIVERY defect, eagerly emitted and never
fetched, NOT a feature-set defect):** ON-DEMAND DELIVERY — nothing on first paint,
everything available when the editor facet OPENS. On facet-open, load monaco CORE +
the needed language worker PER-LANGUAGE on demand (css now; any other language only
if a facet needs it, fetched when its language is), themes LAZILY, and prettier as an
on-demand chunk (the format action loads it on FIRST USE). Target: 0 editor bytes on
first paint; 0 eagerly-emitted unused workers (8.02MB dead → 0). An alternatives
bake-off (CodeMirror 6 etc.) may be RECORDED but replaces Monaco ONLY on proof of
strict superiority AND slimness — no compromise on the fully-featured editor
(prettier / language support / theming). **F2 — value.js on the eager entry (verified
`animationOptionsStore.ts:1` `import { jumpTerms }`).** One value.js helper on the
eager `@state` store drags 124KB of value.js onto the LCP critical path, violating
the same boundary the library obeys. **Transposition:** route `jumpTerms` (and any
eager-reached value.js helper) through the already-warmed HEAVY engine surface — the
store consumes it dynamically, never statically; if value.js must expose a genuinely
LIGHT subpath, that is the U.F consume-edge ask. Target: value.js = 0 bytes on the
entry's static graph. **F3 — LCP gated on the engine warm (verified `main.ts:50`
mounts inside `.finally` after `warmKfEngine()`).** The hero `<h1>`
(`EditorStartScreen.vue:61-63`) has ZERO engine dependency, yet mount waits on the
full heavy graph. **Transposition (architectural, not a warm-earlier tweak):** mount
IMMEDIATELY, warm at idle, transpose the scene-machine's sync non-null
`AnimationGroup` prop contract into an async-tolerant one (nullable/Suspense-gated
group that hydrates on engine resolve) — this contract is co-owned with **U.B8**. **F4 —
highlight.js (verified `useHighlightCSS.ts:3` = full package, 928KB for one
language).** Transposition: `highlight.js/lib/core` (~40KB) + the css grammar, OR
consolidate all CSS highlighting onto Monaco's colorizer and RETIRE hljs entirely
(the deeper no-legacy cure). **F6 — THREE (verified `amiga/*` `import * as THREE`).**
Named/used-only imports so rolldown drops unused three modules. **Gate:** the U.D6
`proof:publish` post-build clause + owner-golden LCP/paint parity. **Edges:** LCP
contract → **U.B8**; value.js LIGHT subpath (if needed) → U.F.

### U.D6 — The `proof:publish` reachability + weight-budget clause (ONE post-build check, born-RED — OD-U11; lane 26 F1, lane 22 F5)

**Evidence (verified).** `SpringPhysicsFacet.vue:133` eagerly deep-imports
`KeyframesEditor.vue` → `useHighlightCSS` → static `highlight.js`; built-graph
trace: `SpringScene-*.js → parseAnimationCSS-*.js → vendor-highlight` (906KB). The
ONLY two chunks statically importing `vendor-highlight` are `KeyframesStringControls`
(correctly behind the pane-reveal `defineAsyncComponent`, `AnimationControls.vue:252`)
and **SpringScene** — the leak. NO post-build check looks at the chunk graph, so it
shipped green. There is no chunk-graph check today (`ls scripts/ | grep chunk`
empty); 227 `proof:*` keys.

**The check (OD-U11 — a `proof:publish` CLAUSE, NOT a standalone gate).** A post-build
static assertion over `dist/gh-pages/assets/` `from"./…"` edges + a byte census —
the check CLASS the source-shape roster is structurally blind to (the recorded
gate-blind-spot lesson made mechanical). Per OD-U11 ("Both new proof: items sound
like junk") the standalone `proof:chunk-graph` gate is DROPPED; this lands as ONE
post-build clause INSIDE `proof:publish` (KISS — one build-output check total; net
NEW standalone gates = ZERO). Three sub-checks in the ONE clause:
- **Sub-check a (born-RED today):** no scene chunk statically reaches `vendor-monaco`/
  `vendor-highlight`/`html2canvas`; `vendor-three` reachable only from `AmigaScene`.
  RED on the SpringScene→vendor-highlight leak — goes GREEN when U.B re-seats the
  facet's editor card behind a `defineAsyncComponent` reveal seam (U.B's OD-U12 facet
  move; this clause is its born-RED witness, U.D owning the measurement, co-scheduled
  per charter §3).
- **Sub-check b:** zero non-css language worker emitted to dist (fails if any
  `{ts,html,json}.worker` reaches `dist/gh-pages`) — the OD-U5 born-RED companion;
  goes GREEN with U.D5's Monaco ON-DEMAND delivery.
- **Sub-check c:** per-chunk + eager-total byte ceilings — entry, eager CSS ≤~250KB
  (lane 22 F5: `index-*.css` is 582KB today), largest lazy vendor — so the perf
  edict is a STANDING check, not a one-time cleanup.

**Edges:** co-scheduled with U.B (sub-check-a cure — the OD-U12 facet seam); sub-check-b
after U.D5.

---

## §3 — Risks + the re-arm map

The stale-era re-arm class is EXPECTED: every U.D transposition invalidates some
gate's frozen expectation. Disposition below (re-arm-or-delete, citing the ruling).

| Wave | Gate / artifact invalidated | Disposition |
|---|---|---|
| U.D1 | `proof:zero-alloc` / `proof:standalone-zero-alloc` (fire only on the SAMPLE path — blind to the apply-frame alloc F1 introduces cost at) | **RE-ARM into U.D2**: the alloc assertion extends to APPLY frames; the node-halves of these gates collapse into vitest (U.A doubling genre). |
| U.D1 | `typed-om-decision.json` (records DECLINE — the Typed-OM apply path was booked-and-shelved in P) | **RE-CUT to LAND**: the decision is reversed by measurement; the booking is retired (no-legacy — a declined booking that the frontier now needs is not carried). |
| U.D2 | `processframe-soa-decision.json` (60.28×), `spring-vector-decision.json`, `color-soa-decision.json`, all frozen A/B ratios | **RE-BASELINE** against 5.2.0/value.js 3.1.0; the harness auto-re-baselines on every re-pin so they cannot drift silently again. |
| U.D2 | `proof:processframe-soa` / `proof:zero-alloc` / `proof:standalone-zero-alloc` node-driver halves; `vitest.config.ts` include-globs | **COLLAPSE to vitest** (U.A genre); add `exclude` + pinned `root` (F4). Net gate count DOWN. |
| U.D3 | `proof:event-ordering` (locks the lifecycle-event order across the sync/async seam) | **MUST STAY GREEN** — the fast-path restore is behavior-preserving; the gate is the oracle that proves it. Re-run independently on the merged tree (orchestration §5). |
| U.D4 | `proof:drag2d-light-certified`, `proof:published-surface` (LIGHT set) | **MUST STAY GREEN** — vector-spring re-seat preserves the LIGHT boundary + the `Drag2DHandle` surface; the gates are the oracle. |
| U.D5 | any test/fixture importing the full `monaco-editor` barrel; `vendor-monaco`/`vendor-highlight`/`vendor-three` chunk-size expectations; the sync non-null `AnimationGroup` prop contract (scene-machine) | **RE-ANCHOR with the move** (charter §3 — structural gates re-anchor WITH the moves, never lag); the `AnimationGroup`-contract change is co-scheduled with U.B. |
| U.D6 | the `proof:publish` reachability/weight CLAUSE — born-RED (sub-checks a+b) at authoring | **BORN-RED by design**: green as U.D5 + U.B's OD-U12 facet seam land within U (no row carries to V — no-deferral). **NOT a standalone gate (OD-U11 — `proof:chunk-graph` DROPPED); ONE post-build clause inside `proof:publish`, net NEW standalone gates = ZERO.** It ABSORBS the ad-hoc weight concerns (lane 22 F5/F6) as sub-check-c rather than spawning new gates. |

**Cross-band edges out of U.D (not U.D waves — recorded so nothing strands).**
Lane 21 F5 (per-frame color-batch fold in `lerpColorValue`) and F7 (epoch-scoped
incremental computed-cache invalidation instead of the wholesale `resize` clear) are
**value.js consume-edge charters → U.F** (`KF-TO-VALUEJS-U.md`), NOT kf parallel arms
(ring-fence 1, no-duplicate/no-legacy). The SpringPhysicsFacet `defineAsyncComponent`
cure (U.D6 sub-check-a's green condition) is **U.B's** OD-U12 facet-seam move. The
async-tolerant `AnimationGroup` scene-machine contract (U.D5 F3) is co-owned with
**U.B8**. drag2D's vector kernel is **U.C**'s spring modal-kernel unification (lane 13).
