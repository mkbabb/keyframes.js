# R.W3 — The legacy/workaround/fallback excision sweep

**Band:** C — lib hygiene.
**Phase:** IMPL — opens on authorization. Parallelizable with R.W4 after R.W1 + R.W2 land
(disjoint file sets). The leaves.ts reconciliation (§2E) must land atomically with the
`.dependency-cruiser.cjs` edit so `proof:lint-clean` goes GREEN in a single commit.
**DAG:** R.W1 → R.W2 → **R.W3 ∥ R.W4** (R.W1/W2 settle the directory partition; R.W3 and R.W4
operate on content not structure and can proceed in parallel once the partition is done).

---

## 1. Scope

Apply the §3 rubric from `R.md` across every `catch {}`, `?? 0`, deprecated API, `as unknown`,
dead component, and test-scaffold hook identified by the two legacy-sweep audit lanes
(`audit/lib-legacy-sweep.md`, `audit/demo-legacy-sweep.md`) and the precept-conformance
challenge (`audit/challenge-demo.md` Part D + E.2). Each item is classified EXCISE,
FAIL-EXPLICIT, or KEEP per the rubric. The wave also terminates the lint RED that has
been live since Q.WE2: `leaves.ts` imports `@mkbabb/value.js/math` but the
`leaf-no-engine-no-valuejs` rule's `VALUEJS_PATH` regex matches any `@mkbabb/value.js`
specifier — including the verified-grammar-free `/math` subpath — causing
`depcruise src --ignore-known` to exit 1 and `proof:lint-clean` to fail.

---

## 2. The concrete work

### 2A. `engine-css-metadata.ts:140` — over-broad `catch {}` swallow → FAIL-EXPLICIT

**Evidence:** `lib-legacy-sweep.md §A.1`

```ts
// CURRENT (engine-css-metadata.ts:138-145) — swallows ALL throws including UA rejections
try {
    CSS.registerProperty(definition);
} catch {
    // InvalidModificationError on a duplicate name … Any other throw … must not abort playback
}
```

The comment admits it absorbs genuine UA rejections (malformed `@property` syntax / invalid initial
value). When the UA refuses a typed custom property, the WAAPI path animates it discretely with
no diagnostic — a silent regression vs the rAF path.

**IMPL:** narrow the catch; bind the error; swallow only the benign duplicate-name case; push a
`PROPERTY_REGISTER_REJECTED` diagnostic for all other throws (same `diagnostics.push` channel the
`COMPOSITION_FALLBACK` honesty row already uses on the adapter):

```ts
} catch (err) {
    if (err instanceof DOMException && err.name === "InvalidModificationError") {
        continue; // benign: already registered with these semantics
    }
    diagnostics.push({
        code: "PROPERTY_REGISTER_REJECTED",
        property: name,
        message: `CSS.registerProperty refused @property ${name}: ${String(err)}`,
    });
}
```

The `diagnostics` channel exists on the adapter; thread it into `registerPropertyDescriptors`.

---

### 2B. `engine.ts:1152` — `getComputedStyle` try/catch absence-mask → FAIL-EXPLICIT

**Evidence:** `lib-legacy-sweep.md §A.2`

```ts
// CURRENT (engine.ts:1145-1155)
customProps: (name: string) => {
    let v = "";
    if (typeof getComputedStyle === "function") {
        try {
            v = getComputedStyle(target).getPropertyValue(name).trim();
        } catch {
            v = "";   // ← masks detached-node / cross-origin throw as "prop unset"
        }
    }
    if (v === "") v = target.style.getPropertyValue(name).trim();
    return v === "" ? undefined : v;
},
```

`getComputedStyle` only throws when passed `null` or a non-Element. Guard the argument
explicitly instead of doing feature-detection-by-exception. Remove the `try/catch`; keep
the inline-style fallback (the documented jsdom seam):

```ts
customProps: (name: string) => {
    let v = "";
    if (target instanceof Element && typeof getComputedStyle === "function") {
        v = getComputedStyle(target).getPropertyValue(name).trim();
    }
    if (v === "") v = target.style.getPropertyValue(name).trim();
    return v === "" ? undefined : v;
},
```

A genuine `getComputedStyle` throw (which cannot happen with an `instanceof Element` guard)
is now never masked.

---

### 2C. `resolve-values.ts` — value.js-bug workarounds → GUARD + DIAGNOSTIC

**Evidence:** `lib-legacy-sweep.md §B.1, §B.2`

**B.1 — `normalizeParam` (resolve-values.ts:362-413):** string-surgery that un-glues
`<syntax>` from `name` in the `CustomFunctionParameter` shape because value.js 1.2.0
`extractFunctions` mislays the type/default. The `??` chain at line 411 hard-codes the
malformed output shape; when value.js fixes `extractFunctions`, this silently mis-recovers.

**IMPL:** add an explicit version assertion at module load to gate the workaround to the
known-malformed shape, and add a comment naming the exact value.js issue:

```ts
// WORKAROUND: value.js ≤1.2.0 extractFunctions mislays <syntax> onto `name`
// and the default onto `type`. Remove normalizeParam when value.js fixes this
// (the S7 lifecycle — B.3 in lib-legacy-sweep.md is the exemplar).
// Assert we're on a version where this shape is known malformed; bump here on fix:
const VJS_PARAM_BUG_MAX = "1.2.0";
```

Add a one-line assertion (startup, not per-call) that `valueJsVersion <= VJS_PARAM_BUG_MAX`
— if value.js bumps past this, the build fails loud rather than silently mis-recovering.
File the upstream fix as a value.js dispatch.

**B.2 — `resolve-values.ts:439` + `:538` — silent DROP on default parse failure:**

```ts
// CURRENT
try {
    return parseCSSValue(param.defaultValue);
} catch {
    return DROP;   // ← no diagnostic; the call silently disappears
}
```

**IMPL:** push a `CUSTOM_FN_ARG_DROP` diagnostic on the DROP path (same honesty-row
pattern as `COMPOSITION_FALLBACK`):

```ts
} catch (err) {
    diagnostics.push({
        code: "CUSTOM_FN_ARG_DROP",
        param: param.name,
        message: `--fn() default failed to parse (value.js bug): ${String(err)}`,
    });
    return DROP;
}
```

---

### 2D. `morph-svg.ts:213-214` — geometry coordinate `?? 0` masking → FAIL-EXPLICIT

**Evidence:** `lib-legacy-sweep.md §C.1`

```ts
// CURRENT (morph-svg.ts:213-214)
pt.x = v[xKey(i)]?.[0]?.value ?? 0;
pt.y = v[yKey(i)]?.[0]?.value ?? 0;
```

The factory at lines 261+ already refuses degenerate inputs with a typed
`AnimationOptionError`. A missing per-frame coordinate key is an engine invariant
violation (the morph render constructs `xKey(i)`/`yKey(i)` for every `i` in `[0, samples]`
and seeds every frame). Masking it to `(0,0)` corrupts the path silently.

**IMPL — FAIL-EXPLICIT:**

```ts
const lx = v[xKey(i)]?.[0]?.value;
const ly = v[yKey(i)]?.[0]?.value;
if (lx === undefined || ly === undefined) {
    throw new Error(
        `morph render: point ${i} lost its coordinate leaf (engine invariant violated)`
    );
}
pt.x = lx; pt.y = ly;
```

Lower-priority: `morph-svg.ts:343-344` `angle ?? 0` and `:426` `{ x: x ?? 0, y: y ?? 0 }` are
at construction-time over `PathGeometry` samples where `0` is a valid default for a flat
segment. Add a comment asserting why `0` is correct there (not a silent mask) — no throw.

---

### 2E. `leaves.ts → @mkbabb/value.js/math` lint reconciliation — NARROW THE RULE

**Evidence:** `PROGRESS.md` (surfaced-reds backlog — `npm run lint` RED); `lib-legacy-sweep.md §F`
(the `/math` subpath is verified grammar-free by `proof:boundary`'s W97 `math-subpath-clean`
clause); `leaves.ts:28` (Q.WE2 replaced the byte-copies with
`export { clamp, scale, lerp, lerpArray } from "@mkbabb/value.js/math"`).

**The conflict:** `.dependency-cruiser.cjs:81` defines `VALUEJS_PATH = "@mkbabb/value\\.js"`.
This regex matches `@mkbabb/value.js/math` — so rule 2 (`leaf-no-engine-no-valuejs`) fires on
the deliberate Q.WE2 re-export, which was proven grammar-free by `proof:boundary`.

Three reconciliation options:

| Option | Consequence |
|---|---|
| A — Narrow `VALUEJS_PATH` to exclude the `/math` subpath | Rule 2 still bites any `@mkbabb/value.js` or `@mkbabb/value.js/<non-math>` edge; the verified-clean `/math` edge is exempted. |
| B — Record the edge in the known-violations baseline | `proof:lint-clean` ASSERTS the baseline has zero boundary-rule entries; baselining a boundary violation would fail that assertion and is explicitly forbidden by the gate. |
| C — Revert Q.WE2 (restore byte-copies in `leaves.ts`) | Reintroduces the byte-drift the externalize was meant to fix; a Q precept violation in reverse. |

**IMPL — Option A (the only conformant option):**

Narrow rule 2's `to.path` to exclude `@mkbabb/value.js/math` while still blocking the bare
package and every other subpath:

```js
// .dependency-cruiser.cjs (rule 2 — leaf-no-engine-no-valuejs)
// BEFORE:
const VALUEJS_PATH = "@mkbabb/value\\.js";

// AFTER: narrow to exclude the verified-grammar-free /math subpath
const VALUEJS_PATH = "@mkbabb/value\\.js(?!/math$|/math/)";
```

Alternatively, change rule 2's `to.path` list to use the narrowed pattern inline:

```js
to: {
    path: [
        ENGINE_PATH,
        "@mkbabb/value\\.js(?!/math(?:/|$))",   // any value.js except /math
    ],
    dependencyTypesNot: ["type-only", "type-import", "dynamic-import"],
},
```

Update the rule comment to record the `/math` exemption and cite `proof:boundary`'s
`math-subpath-clean` clause as the justification. The `proof:lint-clean` clause (b) plant-2
still plants `../engine` onto `leaves.ts` (not `/math`) — the plant is unaffected and still
bites the rule.

After the edit, `depcruise src --ignore-known` exits 0 → `proof:lint-clean` goes GREEN.

---

### 2F. Demo — `navigator.platform` deprecated API → EXCISE

**Evidence:** `demo-legacy-sweep.md §5a`; `challenge-demo.md D.6`

```ts
// CURRENT (demo/@/utils/iosTextEntry.ts:14)
platform: navigator.platform,  // deprecated since Chrome 93 / spec-removed
```

The `"MacIntel" + maxTouchPoints > 1` heuristic is the pre-iPadOS-13 legacy workaround.

**IMPL:** remove `platform` from `NavigatorLike`; replace the entire detection with the
modern idiom:

```ts
export const isIOSLikePlatform = (): boolean => {
    if (typeof navigator === "undefined") return false;
    return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.maxTouchPoints > 1 &&
            CSS.supports("(-webkit-touch-callout: none)"))
    );
};
```

---

### 2G. Demo — dead components → EXCISE

**Evidence:** `demo-legacy-sweep.md §1a, §1b`; `challenge-demo.md D.4`

- **`demo/@/components/custom/Animated.vue`** — zero importers (grep confirmed). EXCISE.
- **`demo/@/components/custom/ResponsiveSelect.vue`** — zero importers; sole reference is a
  stale comment at `demo/@/components/custom/animation-controls/composables/usePaneRegister.ts:27`.
  EXCISE the file; update the stale comment.

---

### 2H. Demo — `onScroll` no-op body + dead `nearestCenterId` return → EXCISE

**Evidence:** `demo-legacy-sweep.md §2a`; `challenge-demo.md A.1`

```ts
// CURRENT (demo/@/composables/useScrollSnapScene.ts:56-61)
const onScroll = (): void => {
    void nearestCenterId;  // evaluates the ref but does not call it — literal no-op
};
```

`onScroll` is bound at `SceneSwitcherCarousel.vue:15` (`@scroll="onScroll"`) — a zero-work
scroll listener on every scroll event. `nearestCenterId` is returned from the composable
but destructured by no consumer.

**IMPL:** delete `onScroll` from both the composable and the `@scroll` binding.
Delete `nearestCenterId` from the return object (retain as a private function if used by
`scrollToScene`; otherwise delete). This is a prerequisite of R.W5's `SceneSwitcherCarousel`
removal; R.W3 can land it independently.

---

### 2I. Demo — `router.push(...).catch(() => {})` silent nav-error swallow → FAIL-EXPLICIT

**Evidence:** `demo-legacy-sweep.md §3c`

```ts
// CURRENT (demo/app/useSceneMachineRouter.ts:83-85)
router.push({ name: scene, query }).catch(() => {
    writerEcho = false;
});
```

Swallows ALL navigation failures. A broken route guard is silently discarded.

**IMPL — FAIL-EXPLICIT** (rethrow everything except the expected navigation-dup / redirect / abort):

```ts
import { isNavigationFailure, NavigationFailureType } from "vue-router";
router.push({ name: scene, query }).catch((e) => {
    writerEcho = false;
    if (
        !isNavigationFailure(
            e,
            NavigationFailureType.duplicated |
            NavigationFailureType.redirected |
            NavigationFailureType.aborted,
        )
    ) {
        throw e;
    }
});
```

---

### 2J. Demo — `window.__lastVtTypes` production test hook → DEV-gate

**Evidence:** `demo-legacy-sweep.md §7a`

```ts
// CURRENT (demo/app/useSceneTransition.ts:69-76)
if (typeof window !== "undefined") {
    (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes = types;
}
```

Shipped unguarded in production. The `data-last-vt-type` attribute (the gate's actual
Playwright selector) can stay — it is a standard `data-` attribute mechanism. Only the
`window.__lastVtTypes` global write needs the `import.meta.env.DEV` guard:

```ts
if (import.meta.env.DEV && typeof window !== "undefined") {
    (window as unknown as { __lastVtTypes?: string[] }).__lastVtTypes = types;
}
```

---

### 2K. Demo — `as any` laundering → typed fixes

**Evidence:** `demo-legacy-sweep.md §8a–8d`

| Site | Fix |
|---|---|
| `SquareScene.vue:158` — `new AnimationGroup(anim as any)` | Type `anim` properly with the correct `AnimationGroup<typeof anim>` parametrization. |
| `useCubeAnimations.ts:87-89` — three `as any` in `AnimationGroup` ctor | Same root cause; fix the `AnimationGroup` construction to accept the typed union. |
| `TimingFunctionPanel.vue:72,85` — `'steps' as any` | Widen the `emit` type to include `'steps'` as a valid literal. |
| `useTimingFunctionEditor.ts:196` — dead expression `timingFunctionLiteralFor(key) as any` | Delete the dead expression. |

---

### 2L. Demo — `-webkit-overflow-scrolling: touch` obsolete CSS → EXCISE

**Evidence:** `demo-legacy-sweep.md §6a`

```css
/* CURRENT (demo/@/components/custom/SceneSwitcherCarousel.vue:85) */
.scene-carousel { -webkit-overflow-scrolling: touch; }
```

Removed from WebKit/Safari since iOS 13 (2019). No-op on every browser in the support
matrix. EXCISE the line.

---

### 2M. Stale comments → UPDATE (co-land with their item's excision)

**Evidence:** `demo-legacy-sweep.md §10a, §10b`

- `usePaneRegister.ts:27` — stale reference to `ResponsiveSelect` (2G). Update when excising.
- `demo/app/router.ts:12` — references dead `KeepAlive + dynamic <component :is>` pattern.
  Update to describe the current `<Suspense>` architecture.

---

### Items confirmed KEEP (the rubric applied — do NOT over-excise)

Per `R.md §3` + `challenge-demo.md E.2`:

| Item | Reason KEEP |
|---|---|
| `useSceneSwap.ts` — SpringProgress fallback for non-VT engines | Feature-gated graceful-degrade for a real, recent coverage gap (View Transitions Baseline only 2025-10-14 — Firefox 144). Dogfoods `SpringProgress`. (`challenge-demo.md D.3`) |
| `SequenceTarget.vue:325-327` — subgrid same-cascade pair | Zero-cost cascade-layer progressive enhancement; IS the documented modern-web-guidance `css-layout` idiom. (`challenge-demo.md D.2`) |
| `useMonacoCancellationGuard.ts` | Narrow, named, documented third-party suppression. (`demo-legacy-sweep.md §3b`) |
| `warmScene` `catch(() => {})` (`scenes.ts:80`) | Cosmetic prefetch; `<Suspense>` surfaces the real error. (`demo-legacy-sweep.md §3d`) |
| `html2canvas` `catch { return null }` | Cosmetic preview; null = no preview, correct for a decorative hover. (`demo-legacy-sweep.md §4b`) |
| `useHeroSourceEgg.ts` silent catch | Flourish pass; `serializedOut.value` stays unchanged. (`demo-legacy-sweep.md §4c`) |
| AmigaScene sessionStorage catches | Private/incognito mode throws; false-return is correct. (`demo-legacy-sweep.md §4d`) |
| `engine-options.ts:30` `tryParseTime` | Legitimate result-type seam; consumer throws typed `AnimationOptionError` on `undefined`. (`lib-legacy-sweep.md §A.3`) |
| `resolve-values.ts:354` `reparseLeaf` catch | Re-parse miss → original leaf; documented. (`lib-legacy-sweep.md §A`) |
| `engine-composition.ts:133,202` `?? 0` | Additive-identity for absent base; commented. (`lib-legacy-sweep.md §C.2`) |
| Native↔JS scroll-driver fallback / WAAPI↔rAF fallback | Documented architectural dispatch, not silent error handling. (`lib-legacy-sweep.md §F`) |
| `compile.ts:528` Prettier catch | Cosmetic pass; raw CSS is valid output. (`lib-legacy-sweep.md §A`) |

---

## 3. The born-RED gate — `proof:no-silent-fallback`

**Name:** `proof:no-silent-fallback`

**What it asserts (non-vacuous):**

Clause 1 — **Zero excise-set patterns in the de-allowlisted source files.** Static source grep
over `src/` + `demo/` (`.ts`, `.vue`) for each excised pattern:
- Bare `catch {` or `catch(_)` or `catch(e) {}` (empty body) in the de-allowlisted file set
  (the specific files edited in §2: `engine-css-metadata.ts`, `engine.ts`,
  `useSceneMachineRouter.ts`, `useSceneTransition.ts`).
- `navigator\.platform` anywhere in `demo/`.
- `as unknown as` in the excise-set (specifically the `this as unknown as PlaybackHost`
  pattern — owned by R.W2 and verified present before R.W2; confirmed absent here).

Clause 2 — **Lint GREEN.** Runs `depcruise src --ignore-known` (same invocation as
`proof:lint-clean`'s clause (a)) and asserts exit 0. This is the leaves.ts reconciliation
gate: RED before the `VALUEJS_PATH` narrowing, GREEN after.

Clause 3 — **`proof:lint-clean` plant-2 still bites.** After the `VALUEJS_PATH` narrowing,
plant the `../engine` import onto `leaves.ts` (NOT `@mkbabb/value.js/math`) and assert that
`leaf-no-engine-no-valuejs` still fires — proving the rule was narrowed, not disabled.

**Born-RED proof:**

- Before IMPL: `depcruise src --ignore-known` exits 1 on the live `leaves.ts →
  @mkbabb/value.js/math` edge (confirmed by running the command at current HEAD — exits 1,
  prints `error leaf-no-engine-no-valuejs: src/animation/internal/leaves.ts →
  @mkbabb/value.js/math`). Clause 2 fires immediately → gate is born-RED on the
  un-reconciled tree.
- For clause 1: the bare `catch {` at `engine-css-metadata.ts:140` currently matches;
  the empty catch at `engine.ts:1152` matches. Both sites will go green only when the
  FAIL-EXPLICIT rewrites land.

**Verification sequence:**
1. Run `node scripts/proof-no-silent-fallback.mjs` before IMPL → exits 1 (clause 2 RED).
2. Apply §2A–2E (including the `VALUEJS_PATH` narrowing).
3. Run again → clause 2 GREEN; clauses 1 + 3 verify the excisions and the rule precision.
4. Full exit 0 = wave done.

The gate is registered in `proof:ci-coverage`'s gate roster (R.W3 step).

---

## 4. Challenge-tempered cautions (R.md §2 OVERRIDES — honoured explicitly)

- **`useSceneSwap` STAYS.** View Transitions is Baseline only since 2025-10-14 (Firefox 144).
  `app-scenes F4`'s "excise entirely" is OVERREACH; this wave does NOT touch `useSceneSwap`
  beyond the trivial conditional-bind optimisation noted in `demo-legacy-sweep.md §3a`
  (if desired, low-priority). The feature-gate is real and the SpringProgress dogfood is
  the demo's own rationale.

- **Subgrid same-cascade pair STAYS.** `SequenceTarget.vue:325-327` uses the
  documented modern-web `css-layout` idiom. `DT-6`'s "excise" is OVERREACH. This wave
  does NOT touch that rule.

- **z-index comma-defaults: EXCISE, not "normalise."** `var(--z-content, 10)` / `var(--z-behind,
  -1)` tokens are reliably present from the glass-ui dep; the comma-default guards a
  never-occurring condition. Per `challenge-demo.md D.1` + `R.md §2`, the fix is
  `var(--z-content)` / `var(--z-behind)` with NO fallback (fail-visible). Styling F2/F3's
  "normalise to `10`/`-10`" is itself a precept violation. This wave excises the comma-
  defaults (or moves to the `z-content` Tailwind utility). These sites are in `demo/` CSS
  and SFC `<style>` blocks; grep for `var(--z-` with a fallback argument.

- **The three gate co-edits (R.W1) have already handled the `proof-boundary.mjs` and
  `proof-engine.mjs` retargets.** R.W3 does NOT touch those gate scripts. The only gate
  edit in R.W3 is the `.dependency-cruiser.cjs` `VALUEJS_PATH` narrowing (§2E) and the new
  `proof:no-silent-fallback` script.

- **`prove:workaround-deletion` S8 verify (DM-5 S8 — FN_NAME).** Per the chronic ledger
  (PROGRESS.md): confirm `proof:workaround-deletion` S8 is GREEN on the value.js 1.2.0
  dist (the `FN_NAME_MAP` WeakMap has been retired; `ValueUnit.fnName` is the public field).
  If S8 is still PRESENT+PENDING, record its state; if PRESENT+PUBLISHED (api landed), it
  is overdue and this wave discharges the deletion.

- **`VJ-Q9 color-serialization consume-edge` (chronic ledger).** Per PROGRESS.md, R.W3/R.W4
  must lock the `color(display-p3 …)` consume shape or record terminally. R.W3 covers the
  grep/verify step; R.W4 owns the implementation if a code change is needed in the
  resolve/serialize path.

---

## 5. Verification + DEV/IMPL boundary

**This spec is the DEV deliverable.** The IMPL (code edits + the new gate script) opens only
on explicit authorization.

IMPL verification sequence:

1. `node scripts/proof-no-silent-fallback.mjs` → born-RED (clause 2 fires on the
   un-reconciled lint, clause 1 fires on the remaining `catch {}` sites).
2. Apply §2E (`.dependency-cruiser.cjs` `VALUEJS_PATH` narrowing) alone; re-run →
   clause 2 goes GREEN; clauses 1 + 3 still verify the planted/non-planted sites.
3. Apply §2A–2D, §2F–2M in any order (they are file-disjoint). Re-run after each group.
4. Full `node scripts/proof-no-silent-fallback.mjs` → exit 0.
5. `npm run lint` → exit 0 (dep-cruiser clean).
6. `node scripts/proof-lint-clean.mjs` → exit 0 (clause (a) + (b) + post-plant restore).
7. `node scripts/proof-workaround-deletion.mjs` → S8 state confirmed (GREEN if the
   FN_NAME_MAP deletion landed; PENDING if value.js 1.2.0 API absent — record as-found).
8. Full CI gate suite (including `proof:boundary` — no new static value.js edges).

The `proof:no-silent-fallback` gate is added to the `proof:ci-coverage` roster in the same
commit that authors the script — the no-dead-gate rule.
