# K — Audit: Packaging post-4.2.0

**Lane:** packaging-k
**Date:** 2026-06-11
**Auditor:** Tranche-K audit fleet (subagent, claude-sonnet-4-6)
**Scope:** Published tarball integrity, d.ts roll-up, `"files"` negations,
LIGHT/HEAVY boundary, README-taught examples vs 4.2.0 reality, 4.3/5.0 pressure.

Evidence convention: every claim cites `file:line`, a command + observed
output, or a run id. No claim rides memory alone.

---

## §1 Tarball integrity (current tree)

### 1.1 Pack manifest

```
$ npm pack --dry-run 2>&1 | grep "Tarball Contents" -A30
```

Observed (inv ε — run against the 4.2.0 tree @ `4f1fc4c`):

```
dist/animate-WjeAtXAe.js          960 B
dist/animations-WlZvjmDT.js      12.7 kB
dist/draw-svg-Dm9f0vTl.js         1.5 kB
dist/engine-Gk4Q7ltr.js          37.3 kB
dist/keyframes.d.ts             130.8 kB
dist/keyframes.js                16.0 kB
dist/motion-path-DQ73oD2j.js      1.0 kB
dist/springTimingFunction-DMb11kBe.js  6.1 kB
dist/timeline-CPT7qUV1.js         8.9 kB
LICENSE                           1.1 kB
README.md                        42.4 kB
package.json                     16.9 kB
```

Total: 12 files, 78.7 kB packed / 275.5 kB unpacked.

**Clean.** `dist/gh-pages/` is absent (the `!dist/gh-pages` negation in
`package.json:30` holds). `dist/_*` negation is in force — no
`_proof-typing-dots` or similar artifact leaks in. `dist/keyframes.d.ts` is
non-stub (130.8 kB). `proof:published-surface` clause (a) PASSES (CI and
manual run).

### 1.2 Files negation completeness

`package.json:28-31`:
```json
"files": [
    "dist",
    "!dist/gh-pages",
    "!dist/_*"
]
```

Current `dist/` contains: `animate-*`, `animations-*`, `draw-svg-*`,
`engine-*`, `keyframes.d.ts`, `keyframes.js`, `motion-path-*`,
`springTimingFunction-*`, `timeline-CPT7qUV1.js`, and `gh-pages/` directory.
All the `dist/_*` and `dist/gh-pages` exclusions are exercised by current tree
content. The `!dist/demo-app/` case does not arise from a `production`-mode
build (vite.config.ts `DEMO_DEFAULT_OUTDIR` routes demo builds to a separate
path), but it is not negated — a future mode that accidentally routes output to
`dist/demo-app/` would leak. This is a low-impact gap; the `!dist/gh-pages`
precedent covers the highest-risk case.

**Finding PKG-1 (P2):** `"files"` negation has no guard for `!dist/demo-app`.
The library-production Vite mode sets `publicDir: false` (vite.config.ts, the
BP-1 fix), so the current tree is safe. But the pattern `!dist/_*` does NOT
catch `dist/demo-app/` if it were ever created alongside a lib build. A third
negation `"!dist/demo-app"` would make this structural, matching the `gh-pages`
precedent. Seam: `package.json:31`. Wave-class: K.W-REPIN (trivial, bundle with
the glass-ui re-pin).

---

## §2 d.ts roll-up integrity

### 2.1 Production of the rollup

Build path: `vite build --mode production` → `vite-plugin-dts` (v5.0.2, via
`unplugin-dts` v1.0.2) → `@microsoft/api-extractor` 7.58.7.

**Finding PKG-2 (P2 — version mismatch in the d.ts toolchain):**

```
$ npm pack --dry-run 2>&1 | grep "bundled TypeScript\|newer than"
*** The target project appears to use TypeScript 6.0.3 which is newer than
    the bundled compiler engine; consider upgrading API Extractor.
```

API Extractor 7.58.7 bundles TypeScript 5.9.3 (`@microsoft/api-extractor/
package.json: dependencies.typescript = "5.9.3"`). The project uses TypeScript
6.0.3 (`devDependencies: "typescript": "^6.0.3"`, installed 6.0.3). The
mismatch is a WARNING, not a build failure — the current d.ts output is correct
for the exported surface (all 40 public exports are present, `proof:published-
surface` clause d passes). However, any TypeScript 6.x-specific type constructs
introduced in future waves may produce incorrect or incomplete d.ts output until
API Extractor is updated. The risk is low today (no TS 6 `using` declarations or
new import attributes in `src/animation/`); it is a P2 forward risk, not a
current P0. Seam: `package.json:devDependencies["@microsoft/api-extractor"]`
(currently `^7.58.7`). Wave-class: K.W-TOOLCHAIN.

### 2.2 API Extractor name-collision aliases

Three public exports are renamed by API Extractor to resolve DOM-lib collisions:

| Source name | d.ts internal name | Export alias | Collision with |
|---|---|---|---|
| `Animation` | `Animation_2` | `export { Animation_2 as Animation }` | `globalThis.Animation` (WAAPI) |
| `ScrollTimeline` | `ScrollTimeline_2` | `export { ScrollTimeline_2 as ScrollTimeline }` | `globalThis.ScrollTimeline` (CSS Houdini) |
| `flip` (preset, in `AnimationPresets` namespace) | `flip_2` | `export { flip_2 as flip }` | the light `flip` function |

These aliases are in `dist/keyframes.d.ts:401`, `dist/keyframes.d.ts:1926`,
`dist/keyframes.d.ts:790` respectively.

**Finding PKG-3 (P2 — cosmetic d.ts artifact):** The `Animation_2` and
`ScrollTimeline_2` aliases appear in IDE hover text for intermediate types (e.g.
`addFrame(…): Animation_2<K>` rather than `Animation<K>`). This is a cosmetic
regression in DX from the pre-API-Extractor per-module `.d.ts` files. The
consumer-facing export names are correct (the `as Animation` alias is honored by
TypeScript tooling). No functional defect; it is confusing to a reader of the
d.ts. Resolving requires either naming the source class `KeyframesAnimation` to
avoid the collision or adding a `@public` + `@alias` API Extractor comment.
Seam: `src/animation/engine.ts` (`class Animation`) and `src/animation/
timeline.ts` (`class ScrollTimeline`). Wave-class: K.W-TOOLCHAIN or 5.0 rename.

### 2.3 value.js type leakage in the d.ts

The d.ts roll-up opens with nine direct `from '@mkbabb/value.js'` imports:

```
import { ColorSpace } from '@mkbabb/value.js';
import { extractAnimationOptions } from '@mkbabb/value.js';
import { HueInterpolationMethod } from '@mkbabb/value.js';
import { InterpolatedVar } from '@mkbabb/value.js';
import { PropertyDescriptor as PropertyDescriptor_2 } from '@mkbabb/value.js';
import { Stylesheet } from '@mkbabb/value.js';
import { timingFunctions } from '@mkbabb/value.js';
import { ValueArray } from '@mkbabb/value.js';
import { ValueUnit } from '@mkbabb/value.js';
```

These arise because heavy-surface types reference value.js types in their
signatures — for example `addFrame(start: … | ValueUnit<number>, …)` and
`resolveKeyframes(input: string | Stylesheet)`. API Extractor cannot inline
value.js's types (they are not shipped with the kf tarball's dist; they live in
the consumer's `node_modules/@mkbabb/value.js`).

Two of these escape to the consumer-facing surface:

- `export { InterpolatedVar }` — `dist/keyframes.d.ts:1458`. `InterpolatedVar`
  is a value.js type re-exported from `src/animation/constants.ts:14` and the
  barrel `src/animation/index.ts:98`. It appears in `AnimationFrame.interpVars`
  and `allInterpVars` (`constants.ts:113-122`). A consumer typing an
  `AnimationFrame` will encounter `InterpolatedVar` in their IDE.
- `TimingFunctionNames = keyof typeof timingFunctions` —
  `dist/keyframes.d.ts:2774`. `timingFunctions` is value.js's easing registry
  map; the type is defined in `constants.ts:47`. A consumer using
  `TimingFunctionNames` transitively depends on value.js's type surface.

Both are intentional: these types appear in the HEAVY tier's public type surface
and value.js is a real runtime dependency for that tier. A TypeScript consumer
importing `@mkbabb/keyframes.js` must have `@mkbabb/value.js` installed (it is
listed as a `dependencies` entry, not a `peerDependencies` entry). The d.ts
correctly imports from the sibling package's location.

**No finding.** The value.js import leakage is structural and correct given the
HEAVY tier's typing.

### 2.4 FrameCompiler in the d.ts

`FrameCompiler` is declared in `dist/keyframes.d.ts:1304` but NOT exported
(`declare class FrameCompiler` vs `export declare class FrameCompiler`). It
appears because `Animation.compiler` returns it (a `get`-only accessor,
`engine.ts:107`). The type is present so IDE tooling can type the accessor's
result; it is not reachable as a standalone import. This is correct API Extractor
behavior for an internal class exposed only via a read-only accessor.

**No finding.**

---

## §3 LIGHT/HEAVY boundary integrity

### 3.1 Gate status

```
$ node scripts/proof-boundary.mjs 2>&1 | tail -5
proof:boundary — PASS: every barrel light entry is value.js-free, the
heavy engine rides only the dynamic boundary, and no dormant static
specifier sits in light source. inv α holds across the full light surface.
```

All 23 light entries: zero value.js edges, zero engine.ts edges,
zero dynamic chunk edges. `loadAnimationEngine` emits exactly one dynamic chunk.
18 light source modules: zero dormant static specifiers. PASS (inv ε).

### 3.2 Static export count

```
$ node --input-type=module << 'EOF'
const mod = await import('/Users/mkbabb/Programming/keyframes.js/dist/keyframes.js');
console.log(Object.keys(mod).sort().join(', '));
EOF
```

Output: `AnimationOptionError, Draggable, ElementMorph, ManualTimeline,
NumericAnimation, RAFPlayback, ScrollTimeline, Sequence, SmoothProgress,
SpringProgress, Timeline, UnknownEasingError, createNativeTimeline, decay,
decayRest, drag, flip, flipShared, loadAnimationEngine, resolveEasing,
springLinearStops, springTimingFunction, stagger, toEasing` (24 values).

Matches the LIGHT barrel count in `src/animation/index.ts`. `CSSKeyframesAnimation`,
`Animation`, and `AnimationGroup` are NOT among the static exports — correctly
gated behind `loadAnimationEngine()`.

---

## §4 README-taught examples vs 4.2.0 reality

### 4.1 Quick Start block: broken as written (P1)

`README.md:11-35` — the first code block a user encounters:

```ts
const anim = new CSSKeyframesAnimation({
    duration: 2000,
    iterationCount: Infinity,
    direction: "alternate",
    fillMode: "forwards",
});
anim.fromString(`…`);
anim.setTargets(document.getElementById("myElement"));
anim.play();
```

This block is NOT tagged `run` — it is plain ` ```ts ` — so `proof:readme-runs`
does not exercise it (`README.md:11`; `scripts/proof-readme-runs.mjs` only
processes ` ```ts run ` fences). However, the block has NO import statement and
no call to `loadAnimationEngine()`. A user copying this verbatim would encounter
one of two failures:

1. If they naively import: `import { CSSKeyframesAnimation } from "@mkbabb/keyframes.js"` — the import resolves to `undefined` (confirmed: `typeof CSSKeyframesAnimation` === `'undefined'` from `dist/keyframes.js`).
2. If they copy the block without an import: `ReferenceError: CSSKeyframesAnimation is not defined`.

The CORRECT pattern is:

```ts
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
const { CSSKeyframesAnimation } = await loadAnimationEngine();
const anim = new CSSKeyframesAnimation({ … });
```

The README does teach this pattern at `README.md:229-239` (the `loadAnimationEngine`
section, tagged `run` and verified by CI). But the Quick Start — the first block of
code after installation — silently breaks the user's first attempt.

**Finding PKG-4 (P1 — Quick Start block is broken for new users):** The
`README.md:11-35` Quick Start block uses `new CSSKeyframesAnimation()` with no
import and no `loadAnimationEngine()` call. It is NOT tested by `proof:readme-runs`.
A first-time user copying this code fails with a `ReferenceError` or `undefined`
constructor. This is the highest-visibility defect in the package's documentation.

Fix options:
- Wrap the Quick Start in an async IIFE with `loadAnimationEngine()` and add the import.
- Replace the Quick Start with a light-surface example (`SpringProgress`, `SmoothProgress`)
  that has no HEAVY dependency.
- Tag the block ` ```ts run ` and add the required preamble so CI catches future drift.

Seam: `README.md:11-35`. Wave-class: K.W-DOCS (low-risk doc fix, no source touch).

### 4.2 AnimationGroup section: same pattern (P2)

`README.md:357-373` uses `anim1.group(anim2, anim3)` — also a HEAVY API — without
showing how `anim1` / `anim2` / `anim3` are constructed. The block is plain ` ```ts `
and not tested. Lower visibility than the Quick Start (it appears after the TOC).

**Finding PKG-5 (P2):** `README.md:357-362` AnimationGroup example uses HEAVY API
without import or `loadAnimationEngine()`. Same root cause as PKG-4. Seam:
`README.md:357-362`. Wave-class: K.W-DOCS.

### 4.3 Dead internal links (P2)

Five links in the README point to paths that no longer exist (the pre-refactor
`src/parsing/` + `src/units/` subtree was deleted):

```
src/parsing/keyframes.ts   — README.md:319  DEAD (file is now src/animation/adapter.ts + frame-compiler.ts)
src/units/                 — README.md:339  DEAD (units live in @mkbabb/value.js, not in kf src/)
src/parsing/units.ts       — README.md:339  DEAD
src/easing.ts              — README.md:168  DEAD (is now src/animation/easing.ts)
src/math.ts                — README.md:183  DEAD (math is in @mkbabb/value.js)
```

Verification:
```
$ for p in "src/parsing/keyframes.ts" "src/units/" "src/parsing/units.ts" "src/easing.ts" "src/math.ts"; do
    [ -e "$p" ] && echo "OK: $p" || echo "DEAD: $p"
  done
DEAD: src/parsing/keyframes.ts
DEAD: src/units/
DEAD: src/parsing/units.ts
DEAD: src/easing.ts
DEAD: src/math.ts
```

These are pre-refactor paths from the multi-directory source era (before the
consolidation into `src/animation/`). The `proof:published-surface` clause (e)
hygiene corroborator does NOT check README internal links — only `CLAUDE.md`
structural claims are checked.

**Finding PKG-6 (P2 — five dead README links):** `README.md:168,183,319,339`
contain five dead links to `src/parsing/keyframes.ts`, `src/units/`,
`src/parsing/units.ts`, `src/easing.ts`, `src/math.ts`. These paths were removed
in the pre-H source restructure. Seam: `README.md:168,183,319,339`. Wave-class:
K.W-DOCS.

### 4.4 `proof:readme-runs` runnable coverage

All 17 ` ```ts run ` snippets pass against `dist/keyframes.js`. Verified:

```
$ node scripts/proof-readme-runs.mjs 2>&1 | tail -3
proof:readme-runs — PASS: 17 snippet(s) executed against the built dist,
20 stated result(s) verified, the runnable set covers the taught roster (17).
```

The Quick Start block (PKG-4), the `CSSKeyframesAnimation` usage section
(`README.md:304-316`), and the AnimationGroup section (`README.md:357-373`)
are NOT tagged `run` and are NOT tested. These are the three unexercised HEAVY
examples identified in PKG-4 and PKG-5.

---

## §5 Package metadata integrity

### 5.1 Description typo

`package.json:4`:
```json
"description": "Create keyframe animations for anything in JavaScript; specify
                your keyframes in standards-complaint CSS."
```

"standards-**complaint**" should be "standards-**compliant**". The README
(`README.md:3`) uses the correct spelling. The typo is in the npm registry
description shown on npmjs.com.

**Finding PKG-7 (P2 — description typo):** `package.json:4` reads
"standards-complaint" (a word that means filing a complaint). The correct word
is "standards-compliant". Seam: `package.json:4`. Wave-class: K.W-DOCS.

### 5.2 package-lock.json version mismatch

`package-lock.json:3` records `"version": "4.1.0"`. The `package.json:3` records
`"version": "4.2.0"`. The lockfile was NOT regenerated when `changeset version`
cut the 4.2.0 bump. This does not affect `npm ci` behavior (lockfile version is
informational metadata, not a resolution constraint) but is a misleading artifact.

**Finding PKG-8 (P2 — lockfile version mismatch):** `package-lock.json:3` still
shows `4.1.0` while `package.json` is at `4.2.0`. Fix: `npm install --package-lock-only`
to regenerate the lockfile without touching node_modules. Seam: `package-lock.json:3`.
Wave-class: K.W-REPIN (trivial alongside next glass-ui re-pin).

### 5.3 Exports map conditions

`package.json:21-27`:
```json
"exports": {
    ".": {
        "types": "./dist/keyframes.d.ts",
        "import": "./dist/keyframes.js",
        "default": "./dist/keyframes.js"
    }
}
```

The map has `types`, `import`, `default`. Missing:
- `"require"`: intentional — the package is `"type": "module"` (ESM-only); a
  CommonJS `require()` will fail with a clear ERR_REQUIRE_ESM, which is the
  correct signal. No hidden breakage.
- `"browser"`: omitted intentionally — the single ESM artifact works in all
  targets; `import` + `default` cover bundler resolution. No browser-specific
  code path requires a separate entry.
- `"node"`: omitted — no Node-specific entry needed.

The exports map is correct for an ESM-only library. The `"default"` condition is
a safe fallback for tools that predate the `"import"` condition.

**No finding.**

---

## §6 Dependency ranges and release-gate coverage

### 6.1 Runtime dependencies

| Package | Declared range | Installed | Latest | Status |
|---|---|---|---|---|
| `@mkbabb/value.js` | `^0.11.2` | 0.11.2 | 0.11.2 | AT FLOOR — no headroom |
| `@mkbabb/parse-that` | `^0.9.0` | 0.9.0 | 0.9.0 | AT FLOOR |

Both runtime deps are pinned at exactly the published floor. `proof:deps-current`
PASSES (inv ε). The `^` range allows minor/patch upgrades when a new version
publishes; the floor test would then require advancing the floor.

The `value.js` floor `0.11.2` corresponds to the C1 memo optimization
(`proof:repin-witness` PASSES — 1 cache write over 600 steady frames). A
downgrade below the floor would reintroduce O(frames) resolves per computed-unit
variable.

### 6.2 parse-that realm split (G-HANDOFF-1, recorded non-biting)

`proof:deps-current` reports a non-gating warning:

```
⚠ (3) REALM: parse-that realm SPLIT — kf declares "^0.9.0" (0.9.x) but
installed value.js@0.11.2 declares "^0.8.2" (0.8.x). The npm tree carries
TWO parse-that realms; the cross-realm cast is utils.ts:248 (parseAny as any).
```

Observed tree:
- `node_modules/@mkbabb/parse-that`: v0.9.0 (kf root dep)
- `node_modules/@mkbabb/value.js/node_modules/@mkbabb/parse-that`: v0.8.2
  (value.js nested dep)

The cross-realm seam is `src/animation/utils.ts:248` — a deliberate `as any`
cast with comment noting the nominal-type cross-realm gap. The split is a
HANDOFF to value.js (value.js must re-pin its own parse-that to `^0.9.0` to
converge). Documented as G-HANDOFF-1. KF_REALM_STRICT is not set; the gate is
non-biting. Production round-trip is verified; the `as any` cast is the runtime
bridge.

**Finding PKG-9 (P2 — parse-that realm split, carry from G-HANDOFF-1):** Two
parse-that realms ride the npm tree. Not a release blocker (gate non-gating, cast
correct). Resolution requires value.js to re-pin its own parse-that. Seam:
`src/animation/utils.ts:248`, `package.json:178`. Wave-class: HANDOFF (value.js
must fix; tracked G-HANDOFF-1).

### 6.3 glass-ui optional dependency (P1 for K)

`package.json:182`:
```json
"@mkbabb/glass-ui": "~3.11.2"
```

Installed: 3.11.2. Latest: 3.13.0. The tilde pin blocks all of 3.12.x and 3.13.x.

3.13.0 contains breaking changes relevant to kf's demo:
- Dock taxonomy rewrite: `variant="rail"` and `variant="instrument-strip"` removed;
  kf does not use these variants so no breaking change to kf's usage.
- `InstrumentRail` component removed; `instrument-rail.css` dropped from
  `index.css` — kf's typography lane references this (U-K6/K8/K10 family).
- Fluid typography tokens (`AY.W-SCALE1`) — available only from 3.13.0+.
- `useDockClickIntegrity` — durable upstream fix for the press-scale BLK-8 issue;
  kf's `App.vue` POINTERDOWN synthesize workaround becomes redundant.

Full analysis at `docs/tranches/K/audit/live-glassui-currency.md §2-§5`.

`proof:deps-current` FLOOR `3.11.2` will RED after re-pin; floor must advance
atomically in `scripts/proof-deps-current.mjs:80`.

**Finding PKG-10 (P1 — glass-ui pin 1.8 minor versions behind, blocks K demo
fixes):** `optionalDependencies["@mkbabb/glass-ui"] = "~3.11.2"` blocks
3.12/3.13 features needed by K's typography, layout, and spring UI waves. The
re-pin to `~3.13.0` requires: `package.json` pin update + `proof-deps-current`
floor update + `npm install` + `proof:all` green on the migrated tree. The full
migration analysis is in `live-glassui-currency.md §6`. Seam: `package.json:182`,
`scripts/proof-deps-current.mjs:80`. Wave-class: K.W-REPIN.

### 6.4 Release gate coverage gap (P1)

`release.yml` gates (verified by reading `.github/workflows/release.yml`):

```
check:lib → build:lib → test → proof:boundary → npm publish
```

`ci.yml` gates include `proof:published-surface` and `proof:readme-runs` (both
J.W5 boundary oracles). `release.yml` does NOT include either.

**Finding PKG-11 (P1 — release.yml omits the J.W5 publish-boundary oracles):**
The tag-triggered publish pipeline (`release.yml`) runs only `check:lib`,
`build:lib`, `test`, and `proof:boundary`. It does NOT run:

- `proof:published-surface` — the tarball == exports == README agreement gate.
- `proof:readme-runs` — the README runnable snippets execute against the dist.

A tag on a tree where these gates fail (e.g., a new export added to
`loadAnimationEngine()` but not in `AnimationEngine` interface, or a README
snippet that no longer matches the dist output) would publish a broken package.
These gates were authored specifically as the PUBLISH oracle in J.W5 (`J.W5-impl.md
§S1`) but they were wired only into `proof:hygiene` / `ci.yml`, not into
`release.yml`.

Fix: add two steps to `release.yml` after `build:lib`, before `publish`:
```yaml
- name: proof:published-surface
  run: npm run proof:published-surface
- name: proof:readme-runs
  run: npm run proof:readme-runs
```

Seam: `.github/workflows/release.yml`. Wave-class: K.W-REPIN (trivial workflow
addition, zero source touch).

---

## §7 4.3 / 5.0 pressure assessment

### 7.1 Additive signals (→ 4.3 minor)

The glass-ui re-pin (K.W-REPIN) is additive — no public API changes, just a
demo dependency update. The K wave plan (U-K1 through U-K20) targets demo UI
improvements, not library API additions.

However, K's demo waves may expose HEAVY-surface gaps:
- U-K11/K16: "spring UI still inadequate — no proper keyframes editor" suggests
  consumers need the ability to drive `CSSKeyframesAnimation` directly from a
  serialized keyframe map and read it back; the `format.ts` serializer is HEAVY
  but untested in the README. If K adds a canonical keyframe-editor composable
  that is genuinely useful to library consumers (not just demo internals), it
  would be a new public export candidate for a 4.3 minor.
- U-K19: "a demo where dragging resizes the container instead of dragging"
  suggests a new container-resize interaction primitive — potentially a new LIGHT
  export combining `drag` + `bumpLayoutEpoch` + `ResizeObserver`.

### 7.2 Breaking change signals (→ 5.0 major)

The `Animation_2` / `ScrollTimeline_2` alias issue (PKG-3) is only cosmetic
today but is a candidate for a 5.0 rename if the d.ts toolchain is upgraded
and the class naming is revisited. A rename to `KeyframesAnimation` /
`KFScrollTimeline` would be a breaking API change (the exported symbol name
`Animation` and `ScrollTimeline` must change).

The `"require"` condition gap is NOT a breaking change candidate — the package
has been ESM-only since the `"type": "module"` declaration; adding a CJS
build would be additive but would require a separate build path.

**No imminent 5.0 pressure.** The current public API surface (24 LIGHT + 16
HEAVY = 40 exports, all gated and taught) is stable. The glass-ui re-pin and
demo UI K waves do not touch the library surface.

### 7.3 The API Extractor upgrade path (forward risk)

If TS 6.x introduces new declaration syntax (e.g. new keyword forms, new
declaration modifiers) in future K waves, API Extractor 7.58.7 may silently
drop or mangle those declarations from the d.ts roll-up without erroring. The
current build emits a warning (`*** TypeScript 6.0.3 which is newer than the
bundled compiler engine`); the warning should gate. A proof step asserting that
the d.ts byte count is within a reasonable range (or that the exported symbol
count matches) would catch silent API Extractor failures. The existing
`proof:published-surface` clause (a) checks that `dist/keyframes.d.ts` is
non-stub (≥ 128,690 bytes); this provides a coarse guard but would not catch
a 1-export regression if the rest of the file is intact.

---

## §FOLD

| Finding | Severity | Seam | Suggested wave-class |
|---|---|---|---|
| PKG-4: README Quick Start uses `new CSSKeyframesAnimation()` with no import or `loadAnimationEngine()` — first code block a user sees is broken | P1 | `README.md:11-35` | K.W-DOCS |
| PKG-11: `release.yml` omits `proof:published-surface` + `proof:readme-runs` — publish gate weaker than CI gate | P1 | `.github/workflows/release.yml` | K.W-REPIN |
| PKG-10: glass-ui pin `~3.11.2` blocks 3.13.0 features needed by K demo typography/layout/spring waves; `proof:deps-current` floor must advance atomically | P1 | `package.json:182`, `scripts/proof-deps-current.mjs:80` | K.W-REPIN |
| PKG-2: API Extractor 7.58.7 bundles TS 5.9.3 but project uses TS 6.0.3 — build warns; d.ts correct today but forward risk for TS-6-specific constructs | P2 | `package.json:devDependencies["@microsoft/api-extractor"]` | K.W-TOOLCHAIN |
| PKG-3: `Animation_2` / `ScrollTimeline_2` / `flip_2` collision aliases in d.ts appear in IDE hover text — DX confusion | P2 | `dist/keyframes.d.ts:401,1926,790`; `src/animation/engine.ts`, `src/animation/timeline.ts` | K.W-TOOLCHAIN or 5.0 rename |
| PKG-5: README AnimationGroup section uses HEAVY API without import or `loadAnimationEngine()` | P2 | `README.md:357-362` | K.W-DOCS |
| PKG-6: Five dead README links to pre-refactor `src/parsing/` + `src/units/` + `src/easing.ts` + `src/math.ts` paths | P2 | `README.md:168,183,319,339` | K.W-DOCS |
| PKG-7: `package.json` description typo "standards-complaint" vs "standards-compliant" | P2 | `package.json:4` | K.W-DOCS |
| PKG-8: `package-lock.json` shows `4.1.0` while `package.json` is at `4.2.0` | P2 | `package-lock.json:3` | K.W-REPIN |
| PKG-9: parse-that realm split — kf 0.9.0 vs value.js nested 0.8.2; cross-realm cast at `utils.ts:248` | P2 | `src/animation/utils.ts:248`, `package.json:178` | HANDOFF (value.js side) |
| PKG-1: `"files"` negation missing `"!dist/demo-app"` guard | P2 | `package.json:31` | K.W-REPIN |
