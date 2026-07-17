# Lane R3-01 — Fresh-Eyes Sweep

**Prefix:** FE- · **Date:** 2026-07-17 · **Model:** Opus 4.8
**Method:** Deliberately un-briefed on prior findings. Read repo shape
(`package.json`, `src/`, `demo/`, `test/`, `scripts/`, workflows). Ran the demo
live from the audit copy (`vite dev :5195`, playwright-core `chrome` channel,
headless) across all 6 scenes at desktop (1440×900) and mobile (390×844), with
per-scene `pageerror`/`unhandledrejection`/`console.error` classifiers. Ran the
library vitest project once in the copy. Rebuilt + served the demo gh-pages
build (`:5196`) to separate working-tree regressions from shipped defects. Node
probes against the built `dist` and the installed `@mkbabb/value.js@4.0.0`. All
temp files under scratchpad; **no writes to the real tree except this report.**

## Verdict

**The prepared transaction (an in-flight `@mkbabb/value.js@4.0.0` migration) has
introduced demo↔library regressions that the current source exhibits but the
*stale* deployed build does not.** Running the patched audit copy (past the
FAM-02 TooltipProvider crash), **5 of 6 scenes emit uncaught errors on load.**
Two of these reproduce the prior round's FAM-14 family. **One shipped
product-quality defect is NOVEL and unclaimed: the Spring scene renders
`[object Object]` in 10 visible keyframe-card labels, in both dev AND the
production build.** The library's own resolve/serialize contract is sound
(verified in isolation) — the defects are demo-owned or migration-consumer drift.

Severity ladder: 1×P2-novel-shipped (FE-3), 2×P2-known-family (FE-1, FE-2),
1×P3-novel (FE-4).

---

## Findings

### FE-3 (P2) — Spring keyframe cards render `[object Object]` — NOVEL, SHIPPED
**Family:** none in registry (checked: zero `object Object` / `frameStart` /
`start.toString` hits across all `audit/*.md`).

The Spring scene's editable `@keyframes` card list renders **10 labels reading
`s [object Object]`** — a stringified object leaking to the UI.

Evidence (live, both builds):
```
DEV  spring: [object Object] labels=10, pageerrors=12
PROD spring: [object Object] labels=10, pageerrors=0   ← shipped, not dev-only
```
Sampled labels: `["s [object Object]","s [object Object]","s [object Object]"]`.

Mechanism — `demo/components/instrument/keyframes/components/KeyframeCardList.vue:11`:
```
:frame-start="frames[i].start.toString()"
```
rendered by `KeyframeCard.vue:37` as `s {{ frameStart }}`. For every other scene
`frame.start` is a number, so `.toString()` is fine; for the **Spring** scene
`frame.start` is a non-primitive object, so `.toString()` yields
`"[object Object]"`. The same object is bound to the card's start `Input`
(`KeyframeCard.vue:5` `:model-value="frameStart"`), so the editable start field
is also corrupted. This reproduces in the **production gh-pages build** →
genuinely shipped, and no prior R1/R2/R3 lane names it.

**Disposition:** demo-owned. Coerce the start to its numeric/percent scalar
before binding (e.g. render `frame.start.value` / a formatted percent), or fix
the Spring scene's frame construction so `start` is a primitive. Add a demo
smoke assertion that no visible label matches `/\[object Object\]/`.

---

### FE-1 (P2) — `CopyButton.vue:42` `timingFunction: "bounceInEase"` is rejected by Value-4 → copy-feedback animation dead — KNOWN
**Family:** FAM-14 EASING-EDGE (== R3-02 **EE-01**).

`demo/components/CopyButton.vue:42` hard-codes the Value-3-era easing name
`"bounceInEase"`. The current registry
(`src/animation/compile/easing/easing-registry.ts:18-34`, part of the
**uncommitted** value.js-4 migration — `git status` shows it `M`) only knows
`easeInBounce` / `ease-in-bounce`. Direct proof against the built dist:
```
bounceInEase -> FAIL easing_name_unknown        (value.js easing())
bounceInEase CONSTRUCT THROW: Invalid value for animation option
             "timingFunction": "bounceInEase" — unknown timing function
easeInBounce CONSTRUCT OK
```
So `new CSSKeyframesAnimation({timingFunction:"bounceInEase"})` throws in
`CopyButton`'s `onMounted` **before** `group.value` is assigned → every
CopyButton's copy-feedback `AnimationGroup` never builds. Live, on `/#/spring`
**24 CopyButtons mount → 12 unhandled rejections**; on `/#/easing`, 1. (Copy of
text still works — `copyText` runs first — only the icon-swap animation is dead.)

Note: the **stale** deployed build predates the value.js-4 upgrade (its 24 spring
CopyButtons throw 0 — the old registry had `bounceInEase`), so this is a
regression the migration introduces and has **not yet been caught by the build**.

**Disposition:** KNOWN — one-line demo fix (`bounceInEase` → `easeInBounce`).
Matches R3-02 EE-01 (which rates it P1).

---

### FE-2 (P2) — Uncaught serialize throw on cube/square/amiga (`serializeEasing` for a css-less closure) — KNOWN
**Family:** FAM-14 EASING-EDGE (== R3-02 **EE-02**).

On `/#/cube`, `/#/amiga`, `/#/square` the demo throws uncaught
`AnimationOptionError: … a custom TimingFunction has no CSS
animation-timing-function representation` on load. Stack (dev):
```
serializeEasing (src/animation/compile/emit/easing-serialize.ts:75)
  ← CSSKeyframesToString (compile/emit/format.ts:223)
  ← updateCSSAnimationKeyframesStringFromAnimation (demo …/useKeyframesParsing.ts:18)
  ← KeyframesStringControls.vue:69
```
The Keyframes-string readout serializes a live animation whose `timingFunction`
is a css-less `{ fn }` closure to CSS; `serializeEasing` fail-explicit throws
(deliberate, gated by `test/compile/roundtrip-easing.test.ts`). **The library is
correct** — I confirmed the dist serializes `ease-out-back` fine in a single
module instance (emits a `linear()` densify twin); the throw only appears when
the resolve-path instance ≠ the serialize-path instance, which is why it fires
in the Vite dev graph but not in a single import graph. The demo compounds it by
**not guarding the projection** (`useKeyframesParsing.ts:82,100` call
`updateAllStrings()` with no `.catch`), turning a library throw into an uncaught
rejection.

Adjacent fragility worth recording: `serializeEasing` reverse-looks-up the curve
by **function-reference identity** against `timingFunctionEntries`, but Value-4's
`easing('ease-out-back')` is **not a stable singleton** — two calls return
distinct anonymous closures:
```
easing('ease-out-back') a.value===b.value  ->  false   (name "")
easing('easeInOutCubic') a===b             ->  true            ← default happens to be stable
```
so any second resolution of a preset name across a module boundary defeats the
lookup. This is the structural reason a css-less preset can serialize in one
place and throw in another.

**Disposition:** KNOWN — demo-owned per R3-02 EE-02 (guard the projection /
don't assign css-less closures to the live animation). The identity-reverse-lookup
note is a defensive-hardening candidate for the library, not a required fix.

---

### FE-4 (P3) — Dev-server favicon 404 — NOVEL, dev-only
**Family:** none (zero `favicon` hits across `audit/*.md`).

Every dev page load 404s `GET /assets/icons/favicon.svg`.
`demo/app/index.html:31` references `href="../../assets/icons/favicon.svg"`;
resolved against the served document at `/` this becomes `/assets/icons/...`,
which is outside the Vite dev root (`root: "./demo/app/"`), so it 404s. The file
exists at repo-root `assets/icons/favicon.svg` and the **production build hashes
it correctly** (`dist/gh-pages/assets/favicon-*.svg`), so this is a dev-only
console 404, not shipped-broken.

**Disposition:** minor. Either move the favicon under a served public dir or
accept the dev-only 404. P3 polish.

---

## Negatives (deliverables)

- **Library resolve/serialize contract is sound.** The built `dist` serializes a
  css-less preset (`ease-out-back`) without throwing in a single module instance
  (emits the `linear()` twin). The FE-2 throw is a dev module-boundary artifact +
  unguarded demo projection, not a library bug. Corroborates R3-02's "do NOT
  touch the library."
- **Test suite is green where it can run:** `vitest --project library` →
  **1042 passed, 1 expected-fail, 14 skipped**. The only 5 failing files
  (`split-a11y-oracle`, `trigger-oracle`, 3 siblings) fail *solely* because
  Playwright's headless-shell binary isn't downloaded
  (`Executable doesn't exist … chromium_headless_shell-1179`) — environmental
  (install is forbidden here), not a real assertion failure.
- **`home` and `sequence` scenes: 0 errors** at both desktop and mobile.
- **Mobile (390×844) parity:** every scene's error profile matched desktop
  exactly — no mobile-only crash surfaced in this pass.
- **No orphan duplicate registry in the shipped library:** `dist/` has two
  `easing-registry-*.js` files but the small one is a pure re-export facade of
  the large one (same instance) — benign, not a duplication defect.

## Coverage gaps

- **Production reproduction of FE-1/FE-2 is unconfirmed.** The `dist/gh-pages`
  build in the copy is *stale* (built against a pre-4.0.0 value.js — its spring
  CopyButtons throw 0). I attempted a fresh `vite build --mode gh-pages` against
  the current source but the gh-pages config pins its own `outDir`, so my
  `--outDir` override did not land a cleanly-separable artifact I could verify.
  A clean current-source demo build is needed to confirm whether FE-1/FE-2 ship
  once the value.js-4 migration is committed. (FE-3 IS confirmed shipped.)
- **Did not exercise interactions** beyond scene load + the animation-list menu:
  no drag of M.cubert, no scrub, no CSS-paste dialog, no share/URL-state
  round-trip. Time-boxed to error-surface + the strongest visible defect.
- **chrome-devtools-mcp was occupied** (a browser already held its profile), so
  all live work went through playwright-core scripts — no a11y-tree/lighthouse
  pass this lane (covered by FAM-10/R1-13).
- **Process-theater observation (not a finding):** `scenes.ts`, `vite.config.ts`,
  and much of `src/` carry an extreme narrative comment-to-code ratio (paragraph
  docblocks citing wave IDs like `R.W5 C.5`, `H.W10.S1`). Not a defect per se;
  flagged for the doc-drift lanes (FAM-08) as a maintenance-cost signal.

## Overlap check (self-diff vs AUDIT-REGISTRY, done AFTER the sweep)

| My ID | Status | Registry family / lane |
|---|---|---|
| **FE-3** `[object Object]` spring cards | **NOVEL** | none — zero `object Object`/`frameStart` hits anywhere in `audit/*.md`; not in FAM-15 design-proportion, not in R2-01, not in R3-03 |
| FE-1 `bounceInEase` copy anim dead | **KNOWN** | FAM-14 EASING-EDGE == R3-02 **EE-01** (they rate P1; I rate P2 — text copy still works, only the icon animation dies) |
| FE-2 serialize throw cube/square/amiga | **KNOWN** | FAM-14 EASING-EDGE == R3-02 **EE-02** (my module-instance/identity-singleton root-cause detail is additive color on the same family) |
| **FE-4** dev favicon 404 | **NOVEL** | none — zero `favicon` hits in `audit/*.md`; dev-only, P3 |

Independently re-derived the FAM-02 masking dynamic (the copy's TooltipProvider
patch is what let me see the easing errors underneath) and the FAM-14 family
without having read them — convergent confirmation. **Net-new for the registry:
FE-3 (shipped P2) and FE-4 (P3).**
