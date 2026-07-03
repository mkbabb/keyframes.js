# en-fix-proto — EN-a + EN-b compile-bug fixes PROVEN as wave-ready diff shapes

**Probe:** Pass-3 en-fix-proto · Tranche S DEVELOPMENT · 2026-07-03
**Verdict: BOTH FIXES PROVEN — born-RED discharged.** EN-a (`serializeEasing`
registry-name → CSS-twin) and EN-b (`compileChild` mixed-track densify
body-drop) implemented in an isolated worktree; a browser-parse oracle (adapted
from P2-2's `live.mjs`) REDS on the pre-fix tree with BOTH signatures and GREENS
post-fix; `check:lib` + all six compile proof gates + 71 targeted vitest tests
pass. Nothing landed — this is a prototype record.

Worktree: `/Users/mkbabb/Programming/keyframes.js/.claude/worktrees/wf_10251b10-89c-3`
(base commit `18e8617`). Three source files touched + one new oracle test:
`src/animation/compile/{format,backward,backward-color}.ts` +
`test/en-fix-oracle.test.ts`.

---

## 1. EN-a — `serializeEasing` registry-name → browser-valid CSS twin (P2-2 F6)

**The bug.** `format.ts:43-58` returned `camelCaseToHyphen(registryName)` for any
value.js registry easing carrying no `.css`. Only the accidental subset
`{linear, ease, easeIn, easeOut, easeInOut, stepStart, stepEnd}` hyphenates to a
valid CSS `<easing-function>`; every other Penner name became a browser-INVALID
token (`easeOutCubic → "ease-out-cubic"`) that the browser drops — the WHOLE
`animation` shorthand voids, computed `animation-name: none`, the compiled
`@keyframes` artifact is **browser-dead**. The kf parser re-reads
`ease-out-cubic` happily (its own registry name), which is why every round-trip
gate stayed green: the artifact round-trips through KF but NOT through the
browser.

**The fix.** A registry name emits verbatim ONLY when its hyphenation is a native
CSS keyword (`NATIVE_CSS_EASING` regex). Every other registry easing emits a
`linear()` DENSIFY of the callable — the universal twin (most Penner curves have
no single-`cubic-bezier()` form; elastic/bounce none at all). The `linear()`
re-parses through `getTimingFunction` (the `LINEAR_PAREN_PREFIX` branch) and
carries its own `.css` on the read side (`css-animation.ts:241` `cssTwinFor`
matches the `linear(` prefix), so **the round-trip is a `linear()` fixpoint** —
serialize → parse → serialize is stable. The twinless-closure THROW is preserved.

Chosen `n = 32` stops keeps even elastic/bounce visually exact; overshoot curves
emit stop values outside `[0,1]`, which `linear()` permits; percentages are
monotone so the stop list is always grammar-valid.

### Inline patch (`format.ts`)

```ts
const NATIVE_CSS_EASING =
    /^(linear|ease|ease-in|ease-out|ease-in-out|step-start|step-end)$/;

const round5 = (n: number): number => Math.round(n * 1e5) / 1e5;
function linearDensifyEasing(fn: TimingFunction, n = 32): string {
    const stops: string[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n;
        stops.push(`${round5(fn(t))} ${round5(t * 100)}%`);
    }
    return `linear(${stops.join(", ")})`;
}

export function serializeEasing(easing: Easing): string {
    if (easing.css !== undefined) return easing.css;
    const registryName = Object.entries(timingFunctions).find(
        ([_name, func]) => func === easing.fn,
    )?.[0];
    if (registryName === undefined) {
        throw new AnimationOptionError(/* …twinless closure… */);
    }
    const hyphenated = camelCaseToHyphen(registryName);
    // A registry name whose hyphenation IS a native CSS keyword rides verbatim
    // (byte-minimal, already faithful + browser-valid). Every other registry
    // easing hyphenates to a non-CSS token — emit its `linear()` twin (EN-a).
    if (NATIVE_CSS_EASING.test(hyphenated)) return hyphenated;
    return linearDensifyEasing(easing.fn);
}
```

### Pre-fix vs post-fix artifact (a compiled `easeOutCubic` fade)

**PRE** (`en-a.pre.css`) — browser-dead:
```css
.a0 { animation: 250ms ease-out-cubic 1 normal forwards a0; }
```
**POST** (`en-a.post.css`) — browser-valid `linear()` twin (abridged):
```css
.a0 {
  animation: 250ms
    linear(0 0%, 0.09085 3.125%, 0.17603 6.25%, … 0.875 50%, … 1 100%)
    1 normal forwards a0;
}
```
The 33-stop `linear()` traces easeOutCubic's fast-start / decelerating shape
(0.875 at the 50% mark).

---

## 2. EN-b — mixed color+non-color densify body-drop (P2-2 F5)

**The bug.** `compileChild` (`backward.ts:289-293`) swapped the WHOLE `@keyframes`
block for `densifyColorBlock`'s output, and `densifyColorBlock`
(`backward-color.ts`) builds that block from the CHANGING color declarations
ONLY (`byPct` accumulates `${cssProp}: ${css};` for color keys alone). A track
mixing `opacity + transform + background-color` therefore compiled
(`eligible: true`, zero refusals) to a `@keyframes` that animated ONLY the color
— every non-color property silently dropped. Replay-inequality on the SHIPPED
`@keyframes` surface.

**The fix (threading `bodyByStop`, per `format.ts:212-222`'s own design).**
`densifyColorBlock` no longer emits a finished color-only block — it returns the
raw per-percentage color declarations (`byPct`) + the changing color `keys`. A
new `format.ts` merge, `densifiedKeyframesBlock`, threads those TOGETHER with the
declared NON-color projection: the changing color keys ride the densified
`oklab()` stops, and EVERY other declared prop (`opacity`/`transform`/static
colors + per-stop easing/composition) rides its verbatim declared projection at
the declared template percentages — merged by percentage into one block.

**Design note (a refinement of the spec wording).** SPEC-v3 S.B3 says "thread the
densify through `keyframesBlock`'s `bodyByStop`". `keyframesBlock`'s `bodyByStop`
is keyed by stop INDEX and iterates `templateFrames` — it structurally cannot
hold the densify's INTERMEDIATE percentage stops (16-24 `oklab()` stops between
each declared pair). So the merge is **percentage-keyed** (`densifiedKeyframesBlock`),
not index-keyed — the correct realization of the same intent (color stops merged
WITH the declared non-color decls). This is faithful by the `@keyframes` semantic:
a property interpolates only across the stops that DECLARE it, so the intermediate
color-only stops leave `opacity`/`transform` to interpolate linearly between their
declared endpoints exactly as before the keys were dropped. Static (unchanging)
colors are NOT in `keys` and ride the verbatim declared projection — never dropped.

### Inline patch (excerpts)

`backward-color.ts` — return the raw stops, not a finished block:
```ts
export type DensifyResult =
    | { byPct: Map<number, string[]>; keys: string[] }   // was: { block: string }
    | { refused: true; delta: number }
    | null;
// … at the tail of densifyColorBlock (the pctOrder sort + block emit is removed):
    void name;
    return { byPct, keys: colorKeys };
```

`backward.ts` `compileChild` — merge instead of whole-block swap:
```ts
const block =
    staticBlock ??
    (densify && "byPct" in densify
        ? densifiedKeyframesBlock(animation, name, densify)   // was: densify.block
        : keyframesBlock(animation, name));
```

`format.ts` — the merge + the non-color declared projection:
```ts
function declaredDeclsExcluding<V extends Vars>(
    animation, i, defaultEasing, exclude: ReadonlySet<string>,
): string[] {
    const declared = animation.parsedVars[i] ?? {};
    const kept = Object.fromEntries(
        Object.entries(declared).filter(([key]) => !exclude.has(key)),
    );
    const decls = Object.entries(unflattenObjectToString(kept)).map(
        ([p, v]) => `${camelCaseToHyphen(p)}: ${v};`,
    );
    // + per-stop easing / composition lines (as declaredKeyframeBody emits)
    return decls;
}

export function densifiedKeyframesBlock<V extends Vars>(
    animation, name, densify: { byPct: ReadonlyMap<number, readonly string[]>; keys: readonly string[] },
): string {
    const defaultEasing = serializeEasing(animation.options.timingFunction);
    const exclude = new Set(densify.keys);
    const byPct = new Map<number, string[]>(); const order: number[] = [];
    const ensure = (pct) => { let d = byPct.get(pct); if (!d) { d = []; byPct.set(pct, d); order.push(pct); } return d; };
    for (const [pct, decls] of densify.byPct) ensure(pct).push(...decls);       // 1. densified color stops
    animation.templateFrames.forEach((tf, i) => {                              // 2. non-color declared props
        const lines = declaredDeclsExcluding(animation, i, defaultEasing, exclude);
        if (lines.length > 0) ensure(percentOfStart(tf.start)).push(...lines);
    });
    order.sort((a, b) => a - b);
    let stops = "";
    for (const pct of order) stops += `${pct}% {\n  ${byPct.get(pct)!.join("\n  ")}\n}\n`;
    return `@keyframes ${name} {\n${stops}}`;
}
```

### Pre-fix vs post-fix artifact (a mixed opacity+transform+bg-color track)

**PRE** (`en-b.pre.css`) — color-only, `opacity`/`transform` ABSENT:
```css
@keyframes a1 {
  0% { background-color: oklab(0.628 0.2249 0.1258); }
  4.3478% { background-color: oklab(0.633 0.2194 0.1269); }
  … (24 color-only stops) …
  100% { background-color: oklab(0.7442 0.1001 0.151); }
}
```
**POST** (`en-b.post.css`) — endpoints carry ALL declared props:
```css
@keyframes a1 {
  0% {
    background-color: oklab(0.628 0.2249 0.1258);
    opacity: 0;
    transform: translateY(20px);
  }
  4.3478% { background-color: oklab(0.633 0.2194 0.1269); }   /* intermediate: color only */
  … 
  100% {
    background-color: oklab(0.7442 0.1001 0.151);
    opacity: 1;
    transform: translateY(0px);
  }
}
```

---

## 3. The born-RED oracle (`test/en-fix-oracle.test.ts`)

Adapted from P2-2's `live.mjs` skeleton: emits `compileToCSS` output into a real
Chromium page (playwright-core via glass-ui's install, the charter's
`createRequire` recipe — Chrome 148 headless) and asserts VIA THE BROWSER (which
the kf parser structurally cannot substitute for). Structural / scrub-based only
— zero frame-race assertions (the CI device-independence posture). Reached the
HEAVY surface the same way the compile tests do: `compileToCSS` from
`../src/animation/compile`, `CSSKeyframesAnimation` from `../src/animation/engine`.

Two clauses:

- **EN-a — browser-parse.** A compiled `easeOutCubic` animation (Easing `{ fn }`
  with no `.css`, so `serializeEasing` hits the registry-name path) is mounted;
  assert computed `animation-name !== "none"` (and `=== the emitted @keyframes
  name`). A browser-invalid easing drops the whole shorthand → `animation-name:
  none`. **Plus a string clause:** the `.class` rule must not match
  `/animation:[^;{]*\bease-out-cubic\b/`.

- **EN-b — prop survival.** A mixed `opacity+transform+background-color` track
  (browser-VALID `linear` easing, so the clause isolates the prop-drop, not EN-a)
  is compiled with `densifyStops: 24` (so the modest red→orange arc SHIPS under
  ΔE-ε, isolating the drop from a densify refusal). **String clause:** the
  `@keyframes` block matches `/opacity/` AND `/transform/` AND
  `/background-color/`. **Browser clause:** mount, `getAnimations()[0].pause()`,
  scrub `currentTime`; at start computed `opacity === "0"` and `transform !==
  "none"`; at end `opacity === "1"`; the color still densifies
  (`atStart.backgroundColor !== atEnd.backgroundColor`).

### Pre/post exit codes (`vitest run test/en-fix-oracle.test.ts`)

| Tree | EN-a | EN-b | Files | Exit |
|------|------|------|-------|------|
| **PRE-fix** (3 files reverted to HEAD via `git show`, oracle unchanged) | RED — `.a0 { animation: 250ms ease-out-cubic … }` matched the forbidden regex; browser would compute `animation-name: none` | RED — `@keyframes a1` matched `/background-color/` but NOT `/opacity/` (`expected '@keyframes a1 {…background…' to match /opacity/`) | **1 failed** | non-zero |
| **POST-fix** | GREEN | GREEN | **1 passed (2 tests)** | 0 |

Pre-fix RED signatures (verbatim):
```
EN-a: AssertionError: expected '@keyframes a0 {…}' not to match /animation:[^;{]*\bease-out-cubic\b/
      →  animation: 250ms ease-out-cubic 1 normal forwards a0;
EN-b: AssertionError: opacity dropped by the densify swap:
      expected '@keyframes a1 {\n  0% {\n    background…' to match /opacity/
```

---

## 4. Regression gates (POST-fix, worktree)

| Gate | Result |
|------|--------|
| `npm run check:lib` (tsc `tsconfig.lib.json`) | **pass** (0 errors) |
| `proof:compile-replay` (`node` grep half + `test/compile-roundtrip.test.ts`) | **pass** — 17 |
| `proof:compile-deterministic` (`test/compile-deterministic.test.ts`) | **pass** — 1 |
| `proof:replay-equality` (`node` half + `test/replay-equality.test.ts`) | **pass** — 5 |
| `proof:roundtrip-easing` (`test/roundtrip-easing.test.ts`) | **pass** — 7 (1 skip) |
| `proof:roundtrip-fidelity` (`node` half + `test/roundtrip-fidelity.test.ts`) | **pass** — 29 |
| `proof:grammar-fuzz` (`node` half + `test/grammar-fuzz.test.ts`) | **pass** — 5 |
| `test/format.test.ts` | **pass** |
| Full `vitest run` (library surface) | **90 files pass · 914 pass / 2 expected-fail / 1 skip** |

**T7 confirmed BENIGN for the existing fixtures.** EN-a broadens the emit (the
default `easeInOutCubic` and every Penner name now serialize to `linear()` in the
`.class` block instead of a broken `ease-*-cubic` token), yet every compile /
roundtrip / replay gate stayed green WITHOUT fixture co-edits — the existing
fixtures parse the artifact (they don't byte-compare the broken easing token),
and the `linear()` fixpoint keeps the round-trip stable. The SPEC-v3 T7 note
("`proof:compile-replay`/`proof:compile-deterministic` fixtures are co-edited in
the same commit") is a **precaution that did not bite here**; the real wave should
still eyeball any fixture that asserts a specific `.class` easing string.

**8 pre-existing / environmental failures (NOT caused by this change).** The full
`vitest run` reports 8 failed demo-scene files — all `Failed to resolve import
"@mkbabb/keyframes.js"` from `demo/**` (the demo self-imports the package by name
→ `dist/keyframes.js`, which the worktree never built; `main` has `dist/`).
Verified identical on the unmodified HEAD tree (reverted all 3 files, re-ran
`test/sharing.test.ts` → same resolve error). Out of scope for the compile zone.

---

## 5. S.B3 wave upgrade notes

The prototype confirms the SPEC-v3 §3 S.B3 EN-a/EN-b decomposition with three
refinements to fold into the wave:

1. **EN-a is the universal `linear()` densify, not a closed-form bezier table.**
   SPEC-v3 offered "the Penner set has closed-form beziers; the universal
   fallback is a `linear()` densify". The probe RULES for the `linear()` densify
   as the SOLE mechanism (no bezier table): most Penner curves (cubic/quart/quint/
   expo/circ) are NOT a single `cubic-bezier()`, and elastic/bounce are
   multi-oscillation with no bezier at all — a partial bezier table would be a
   faithfulness trap. `linear(n=32)` is faithful for ALL of them and re-parses to
   a `.css`-carrying fixpoint. Keep the `NATIVE_CSS_EASING` keyword fast-path
   (byte-minimal for the common `linear`/`ease*`/`step*` case). **~2 files**
   (`format.ts` + the gate; NO separate test file needed beyond the oracle).

2. **EN-b's merge is PERCENTAGE-keyed, not `keyframesBlock.bodyByStop`
   (index-keyed).** The densify's intermediate stops have no template index, so
   the spec's "thread through `keyframesBlock`'s `bodyByStop`" is realized as a
   new sibling merge `densifiedKeyframesBlock(animation, name, { byPct, keys })`
   in `format.ts`, plus a `declaredDeclsExcluding` helper (the non-color declared
   projection). `densifyColorBlock` changes its return contract
   (`{ block }` → `{ byPct, keys }`) — a single-caller change (`compileChild` is
   the only consumer; verified by grep). Follow-on tidy for the wave (optional):
   drop the now-unused `name` param from `densifyColorBlock` (the merge owns block
   assembly; the prototype keeps it + a `void name;` to minimize the diff).
   **~3 files** (`backward-color.ts`, `format.ts`, `backward.ts`) — the `keys`
   return also lets EN-b preserve STATIC (unchanging) colors, which the whole-block
   swap did not distinguish.

3. **Gate roster tier — the EN-a browser-parse clause is a BROWSER-HARNESS gate,
   NOT a `hygiene-chain`/jsdom gate.** This is load-bearing and matches SPEC-v3's
   own tier note (`SPEC-v3.md:945-949`): the browser-actuating library-value gates
   (`proof:vt-roundtrip`, `proof:entry-roundtrip`, **the EN-a browser-parse
   clause**) enroll in the **browser-harness (demo-correctness) chain**
   (`npm run proof:correctness` — the playwright-actuating roster), with their
   library-value severity recorded in their taxonomy rows. Placing the clause in a
   jsdom `proof:library-correctness`/`proof:hygiene-chain` slot would **correctly
   RED under S.A4's symmetric mis-tier clause** — and it would also be a FALSE
   green: jsdom's `getComputedStyle` does NOT drop an invalid `animation` shorthand,
   so the bug is INVISIBLE in jsdom (this is precisely why P2-2 F6 evaded every
   existing jsdom round-trip gate). Concretely: wire a new
   `proof:compile-browser-parse` (this oracle's EN-a clause, playwright) into the
   `proof:correctness` chain beside `proof:entry-roundtrip`. The EN-b clause has
   BOTH a jsdom-viable string half (artifact contains `opacity`/`transform` —
   folds into `proof:compile-replay`/`test/compile-roundtrip.test.ts`) AND a
   browser half (props animate — rides the same browser-harness gate). Keep the
   string half in `hygiene-chain` for fast local bite; the browser half in
   `proof:correctness`.

**DAG unchanged:** `S.B3 (carrying EN-a + EN-b) ──► S.F3/EN-c ──► EN-d`. The
prototype confirms EN-c is unshippable on today's `serializeEasing` (the entry
emitter's easing channel would emit browser-dead `ease-*-cubic` tokens); EN-a is
the hard prerequisite, EN-b the substrate EN-c's endpoint projection reads.

---

## 6. Artifacts (throwaway, in scratchpad)

`…/scratchpad/en-a.pre.css`, `en-a.post.css`, `en-b.pre.css`, `en-b.post.css`
(the four compiled artifacts); `…/scratchpad/backup/{format,backward,backward-color}.ts`
(the fixed files, used to restore after the HEAD-revert pre-fix run). The oracle
itself is `test/en-fix-oracle.test.ts` in the worktree (NOT scratchpad — it is
the wave's gate skeleton). No repo edits outside the worktree; `git status` shows
only the 3 modified source files + the untracked oracle (no `node_modules`).
