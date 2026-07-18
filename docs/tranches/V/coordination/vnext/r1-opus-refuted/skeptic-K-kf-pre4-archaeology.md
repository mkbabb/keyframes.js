# SKEPTIC K (Fable seat) — KF PRE-4.0 ARCHAEOLOGY (the missing middle: v0.9.97 → 4.0.0)

Lane fills the gap between H1's endpoints (baseline `1acf25c6` v0.9.97 / today `c2c8915f` v6.0.0). Repo read-only at `/Users/mkbabb/Programming/keyframes-v-exec` (full history). All shas real, verified against tags + `package.json` version bumps + CHANGELOG + `docs/tranches/`.

## Headline: pre-4.0 was a CONTRACTION, not the bloat

kf src (non-test .ts) did NOT explode pre-4.0. It **shrank** at modernization then rebuilt as an animation-only tree roughly baseline-sized; the doubling H1 flags is POST-4.0.

| ver | sha | date | files | src LOC | note |
|---|---|---|---|---|---|
| v0.9.97 | `1acf25c6` | 2024-07-19 | 22 | **6,953** | baseline: parsimmon + in-tree color/units/parser |
| — (modernization) | `54424ee0` | 2026-02-25 | — | — | parsimmon→parse-that+value.js, in ONE commit |
| v1.0.0 | `79a81bc2` | 2026-02-25 | 23 | **2,812** | −60%: parse+color+units gutted → value.js |
| v1.1.0 | `b74ce1bc` | 2026-02-26 | 24 | 3,111 | waapi.ts born |
| v1.2.0 | `899f528d` | 2026-03-10 | 28 | 4,148 | numeric/smooth/timeline/ElementMorph born |
| v2.0.0 | `c9403673` | 2026-04-17 | 16 | 3,900 | parsing/units SHIM files deleted (`58e75763`) |
| v2.1.0 | `7561af3b` | 2026-05-13 | 16 | 4,074 | scrubbing + zero-alloc `interpFrames(out)` |
| v2.2.0 | `f0920638` | 2026-06-02 | 21 | 5,012 | LIGHT/HEAVY split born (engine.ts) + spring zone |
| v3.0.0 | `2105e7e2` | 2026-06-03 | 25 | 5,373 | **Tranche A** — first tranche, first CHANGELOG |
| v4.0.0 | `d2640533` | 2026-06-06 | 32 | **8,864** | Tranche B+C+D+E+F folded; orchestration burst |

At v4.0.0, kf is 8,864 LOC of PURE animation (parse/color externalized). H1's "today" is 22,778 — so **~14k of the 16k gap over baseline is POST-4.0** (scroll/ingest/waapi-heavy/compile-emit/group-SoA). The pre-4.0 tree stayed disciplined; the *seeds* of overfit (waapi, the LIGHT/HEAVY boundary, the orchestration tier) were planted here but the mass landed later.

## Evolution story — parser exit, value.js arrival, zone births (born-at sha/ver)

- **parsimmon → parse-that + value.js:** `54424ee0` 2026-02-25 (v1.0.0). ONE commit, "zero parsimmon refs" (baseline had 3 parsimmon files: `parsing/{keyframes,units,utils}.ts`). This is the pivot; **NOT** governed by any tranche or changelog — both were born later.
- **value.js dep arrival:** `54424ee0` as `@mkbabb/value.js@^0.3.1` (with `@mkbabb/parse-that@^0.6.0`). Floor walked ^0.4 (v1.1) → ^0.5 (v1.2) → ^0.10 registry pin (v2.1.1, `e10063f0` 2026-05-28) → ^0.11.1 (v4.0.0). Repeatedly `file:../value.js` local-link during dev (v1.1.1, v2.0.0–v2.1.x seam).
- **waapi/** — `0487521e` 2026-02-26 (v1.1.0). Justification: *"performance audit, WAAPI delegation, layering system & benchmarks."* Speculative/perf-audit provenance; no demo driver, pre-tranche.
- **physics numeric+smooth** — `899f528d` 2026-03-10 (v1.2.0).
- **orchestration/timeline** (Timeline/ScrollTimeline/ManualTimeline) — `899f528d` 2026-03-10 (v1.2.0). *(This is the JS `ScrollTimeline` sampler class — distinct from the post-4.0 scroll/ CSS-parse zone.)*
- **ElementMorph** (`morph.ts`, bounding-rect FLIP morph — `MorphRect{x,y,w,h}`) — `899f528d` 2026-03-10 (v1.2.0). NOTE: this is **not** svg/morph-svg; the SVG-path `fromMorphSVG` is post-4.0.
- **physics/spring** (spring.ts / springTimingFunction / springLinearStops) — `d89274dd` 2026-05-26 → v2.2.0 barrel.
- **LIGHT/HEAVY split + engine.ts + `loadAnimationEngine()`** — `f0920638` 2026-06-02 (v2.2.0). The KF-B1 boundary.
- **internal/** — born v2.0.0 (`binarySearch`), +`leaves` (v2.2.0), +`css-easing/easing-resolvable/reduced-motion/scheduler` (v3.0.0). Grab-bag from birth.
- **compile/frame-compiler** — `a0303fe5` 2026-06-05 (v4.0.0, Tranche D: the ~1019-line `Animation` god-object split at the FrameCompiler seam).
- **orchestration tier** (stagger/flip/drag/sequence/decay + `animate()`) — `4ee8e345` 2026-06-05 (v4.0.0). **motion-path** `4cf7adb8` 2026-06-06. Both Tranche **E.W10** "the orchestration tier (new public API)."
- **NOT pre-4.0 (post-4.0):** scroll/ zone (parseScrollCSS/ScrollScene), ingest/ (fromStyleSheets/fromLiveAnimations), svg/morph-svg + draw-svg, compile/emit+backward — all confirmed ABSENT from src at v4.0.0. Per CHANGELOG these are Tranche K / 4.3.0.

## The pre-4.0 drops ledger (classified: RIGHTLY / UNJUSTLY / UNCLEAR)

**D1 — the in-tree parser + color/gamut subsystem** (`54424ee0`, v1.0.0, 2026-02-25).
Deleted from kf and delegated to value.js@0.3.1: parsimmon-based `parsing/` + `units/color/` (colorFilter 311 LOC, color/utils **903 LOC with 48 gamut/oklab/clip matches**, color/constants 363, units/constants 729). At v4.0.0 kf src has **ZERO** gamut refs.
- **gamut mapping → UNJUSTLY-DROPPED** (owner-seeded: *"The gamut mapping was a major loss"*). Left kf here; whether value.js preserved it is the value.js lane's call, but the owner's naming implies the successor did not hold it. RESTORE-class seed.
- **colorFilter / CSS-filter interpolation → UNCLEAR** (delegated, no successor-parity check recorded).
- **the parser itself → UNJUSTLY** per owner (*"ill-defined and slow parser"* = the residue of this swap). The replacement is the very thing addendum-2 condemns.
- Process verdict: **SILENT at the time** — the whole subsystem vanished under one commit sub-bullet; no changelog (born v3.0.0), no tranche (born v3.0.0).

**D2 — value.js re-exports off the barrel** (`58e75763`, v2.0.0, 2026-04-17). `ValueUnit`, `Color`, `parseCSSKeyframes`, `parseCSSValueUnit`, `parseCSSPercent/Time`, color/unit helpers no longer re-exported from keyframes.js — "consumers must now import primitives from `@mkbabb/value.js` directly." **RIGHTLY-DROPPED** (separation of concerns; clean successor) **but UNCLEAR-at-time**: documented only retroactively in the v3.0.0 CHANGELOG (which mis-dates it "2025-09-09"); at the actual cut the record was commit-message-only.

**D3 — heavy classes off the static runtime barrel** (`f0920638`, v2.2.0, 2026-06-02). `Animation`, `CSSKeyframesAnimation`, `AnimationGroup`, `getTimingFunction`, `resolveKeyframes`, `DIRECTIONS/FILL_MODES/defaultOptions/defaultLayerConfig` removed as static *values* → behind `await loadAnimationEngine()`; types retained. This is the **birth of H1's OVERFIT LIGHT/HEAVY apparatus**. **UNCLEAR/OVERFIT** — a rationale exists (keep value.js out of light consumers' static graph) but H1 finds the boundary ceremonial (the demo always calls `loadAnimationEngine()` anyway, paying the full cost).

**D4 — the v4.0.0 rename cuts** (`d2640533`, 2026-06-06, Tranche C+D). `Animation.tick(t)`/`AnimationGroup.tick(t)` → `advanceTo(t)`; `pause(draw)` toggle-behavior + `draw` param retired → `pause()`/`resume()`/`toggle()`; `SmoothProgress.tick()` (no-arg) removed → `tickDt(ms)`; `SpringProgress.tick(seconds)` privatized. No compat aliases ("no-legacy"). **RIGHTLY-DROPPED** — semantic clarity, changelog-tombstoned. The **one well-governed cut in the range.**

**Survived (record so never re-litigated):**
- 36 preset animations (`animations.ts`) — intact, grew 36→45 exports by v4.0.0. H1's "clean lineage" is confirmed unbroken through the whole range.
- CSS-string authoring `fromString`/`fromVars`/`fromKeyframes` — all three intact in `engine.ts` at v4.0.0. The "authoring ergonomics" H1 worried about were **not** lost.

## SILENT DROPS — flagged loudly

The two largest structural drops in kf history were governed by **nothing but commit bullets**, because the CHANGELOG (born v3.0.0, `2105e7e2` 2026-06-03) and the tranche system (born Tranche A, same release) **did not exist for the entire v1.0.0 → v2.1.x window (2026-02-25 → 2026-05-28)**:
1. **The gamut/color subsystem deletion** (D1) — a 903-LOC gamut-bearing `color/utils.ts` erased under the single sub-bullet *"Parser migration: Parsimmon→parse-that."* **This is the sharpest silent drop in the repo's history** and the mechanical origin of the owner's named "major loss."
2. **The value.js re-export drop** (D2) — breaking for every consumer importing primitives from keyframes.js; recorded only retroactively, with a wrong date.

Everything else pre-v3.0.0 (waapi birth, the physics/orchestration zone births, the file-count contraction 28→16 at v2.0.0) is likewise changelog-invisible.

## OVERFIT PROVENANCE (for the adjudicator's keep/prune rulings on H1's candidates)

| H1 candidate | born | sha / ver | what prompted it | provenance grade |
|---|---|---|---|---|
| **waapi/** | 2026-02-26 | `0487521e` v1.1.0 | "performance audit, WAAPI delegation" — no demo, pre-tranche; re-justified 2026-06-05 (Tranche E: dense sampling, native scroll attach) | **SPECULATIVE** (perf-audit seed) |
| **orchestration extras** (flip/drag/stagger/sequence) | 2026-06-05 | `4ee8e345` v4.0.0 | Tranche E.W10 "the orchestration tier (new public API)" — a feature-tier expansion; no demo/user driver named in the commit | **SPECULATIVE** (tier-for-tier's-sake) |
| **svg/motion-path** | 2026-06-06 | `4cf7adb8` v4.0.0 | Tranche E platform-adoption; ships beside native `offset-path` it duplicates | **SPECULATIVE** |
| **orchestration/timeline** (JS ScrollTimeline sampler) | 2026-03-10 | `899f528d` v1.2.0 | added with numeric/smooth; E.W9 later ADDED native `createNativeTimeline` **without** removing the JS sampler ("the ARCH-kill of REPLACING it HOLDS; no polyfill") — the platform-redundancy H1 flags, dated | **OVERFIT-vs-platform, admitted** |
| **LIGHT/HEAVY boundary** | 2026-06-02 | `f0920638` v2.2.0 | KF-B1 static/dynamic value.js seam | tranche-recorded, H1-disputed |
| scroll/ · ingest/ · morph-svg · compile-emit | — | POST-4.0 | not in range (Tranche K / 4.3.0) | out-of-lane |

Note the **admitted** overfit at E.W9 (`4ee8e345`): the team explicitly chose to add native `createNativeTimeline`/`attachNativeScrollTimeline` as *additive* while KEEPING the JS reimplementation — the exact "re-implements the platform in rAF JS" pattern H1 condemns, here on the record as a deliberate decision, not an oversight.

---

## 10-line summary

1. Pre-4.0 was a **contraction, not the bloat**: modernization (`54424ee0`, 2026-02-25) cut kf src 6,953→2,812 LOC by exporting parse/color/units to value.js; v4.0.0 is only 8,864 LOC of pure animation — **~14k of the 16k over-baseline gap is POST-4.0**.
2. The **biggest pre-4.0 loss is the gamut/color subsystem** (D1): a 903-LOC gamut-bearing `color/utils.ts` (48 gamut/oklab refs) deleted at modernization, delegated to value.js; kf has ZERO gamut at v4.0.0 — the owner's named "major loss," UNJUSTLY-DROPPED, RESTORE-seed.
3. The **parser swap** (parsimmon→parse-that+value.js, `54424ee0`) is the mechanical origin of the owner's "ill-defined, slow parser" residue — same cut, same date.
4. **Sharpest silent drop:** that gamut subsystem vanished under one commit sub-bullet — no changelog, no tranche existed until v3.0.0 (2026-06-03), so the two largest structural drops (gamut/parser + the v2.0.0 value.js-reexport break) were governed by commit messages alone.
5. **D2** (v2.0.0, `58e75763`): value.js primitives dropped from the barrel — RIGHTLY-dropped but documented only retroactively (and mis-dated "2025-09-09").
6. **D3** (v2.2.0, `f0920638`): the LIGHT/HEAVY `loadAnimationEngine()` boundary — H1's OVERFIT apparatus — is born here; the drop of direct static `import { Animation }` is real, the rationale disputed.
7. **D4** (v4.0.0): tick→advanceTo, pause-split, tickDt canonicalization — no-alias renames, RIGHTLY-dropped and properly tombstoned; the one well-governed cut in the range.
8. **Speculative provenance:** waapi/ born 2026-02-26 from a bare "performance audit"; the whole orchestration extras tier (flip/drag/stagger/sequence/animate/motion-path) born in a single 2026-06-05 commit (`4ee8e345`) as Tranche E.W10 "new public API" — feature-tier growth with no demo/user driver named.
9. **Admitted platform-overfit:** E.W9 (`4ee8e345`) ADDED native `createNativeTimeline`/scroll-attach while deliberately KEEPING the JS reimplementation — H1's "reimplements the platform in rAF JS" is on the record as intentional.
10. **Survived, record it:** the 36 presets (36→45) and `fromString/fromVars/fromKeyframes` CSS-string authoring came through the whole range intact — those are NOT losses.
