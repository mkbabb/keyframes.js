# Tranche G — Audit: backend legacy / fallback / silent-handling hunt (lane `a-backend-legacy`)

**Scope.** The published library surface — `src/animation/**` + `src/**` — on
`tranche-g-dev` (D+E+F IMPLEMENTED + RELEASED; kf `4.0.0`, value.js `0.11.0`,
parse-that `0.9.0` on the registry; `keyframes.babb.dev` on Cloudflare Pages).
Read-only; **ZERO source/test/CI edits** — propose, never write. This lane hunts
EVERY legacy / deprecated path-beside-replacement / temporary-workaround /
fallback / fall-through / silent-graceful-handling. For each: **EXCISE** entirely
**OR** migrate to **fail-EXPLICIT** (typed throw) — unless the graceful handling
is genuinely befitting (a feature-detect + JS fallback for a platform capability
is OK; a silent catch/coerce that hides a contract is NOT).

**Method (inv ε).** Whole-`src` greps for `try/catch`, `@ts-ignore`/`@ts-expect-
error`, `: any`/`as any`, `?.`/`??` masking, `deprecated`/`legacy`/`compat`/
`polyfill`/`fallback`/`silently`/`swallow`, `console.*`, `TODO/FIXME/HACK`. Every
claim is `file:line`-grounded against the live tree and, where behavioural,
**verified by running it** (value.js `0.10.0` installed, parse-that `0.8.2`
installed — see F-BL-1). Cross-repo items tagged HAND-OFF (inv-16 relaxed for G
impl, but each sibling audited as its own surface). This **extends, does not
repeat**, the F record: `F/F.md:52-57` (the no-legacy precept), `F/FINAL.md:46-57`
(the F.W6/F.W7/F.W8 landings), and the F BOOKs (`composition`-honoring,
scroll-named selectors `P4`/`NEW-15`).

---

## § The honest headline

**The backend is overwhelmingly fail-explicit BY DELIBERATE DESIGN, and the
design is exemplary.** D/E/F did not merely avoid silent handling — they
*excised* it and left the excision documented in the module headers. The
fail-explicit seam is a first-class, named architectural surface
(`internal/errors.ts`, `easing.ts`, `frame-compiler.resolveEasingOption`,
`group.setLayerConfig`). The §ALREADY-SOTA section below is the bulk of this lane.

**Two real findings survive the sweep — both narrow, both grounded by running
the code:**

1. **F-BL-1 (HIGH, SHIP-in-G — inv-27 pin-lag).** kf `4.0.0` SHIPPED consuming
   **stale** sibling pins (`^0.10.0` value.js / `^0.8.2` parse-that) — the
   published `0.11.0`/`0.9.0` that carry the F.W6 computed-endpoint win (−94%)
   are **never consumed**. F/FINAL claimed "kf consumes it unchanged on re-pin";
   the re-pin never happened. The shipped library is the WRONG perf surface.
2. **F-BL-2 (MED, SHIP-in-G — silent-degradation).** `serializeEasing`
   (`format.ts:22-29`) silently emits `"linear"` for a custom (non-registry,
   no-`.css`) `TimingFunction` closure — a WRONG value emitted silently, the
   real curve lost on round-trip. The exact "silent-graceful-handling that hides
   a contract" the Mandate forbids; the F.W7 round-trip lock does NOT cover it.

Two **RECORD/BOOK** carry-items (the captured-but-dead `composition` field; the
stale scroll-named-selector comment now describing a dead path) and one
cross-repo **HAND-OFF** (the cross-realm parse-that `any` cast). Everything else
is fail-explicit, befitting feature-detect, or a legitimate omission-default.

---

## § FINDINGS

### F-BL-1 — kf 4.0.0 ships STALE sibling pins; the F.W6 win is published but never consumed — **SHIP-in-G (HIGH)** · inv-27

**Verified, not asserted.**

- `package.json:84-85` (live `tranche-g-dev`): `"@mkbabb/parse-that": "^0.8.2"`,
  `"@mkbabb/value.js": "^0.10.0"`. Version `4.0.0` (`package.json` line, verified).
- **Installed** (ran `require(...).version`): value.js **`0.10.0`**, parse-that
  **`0.8.2`** (deduped — no nested realm under value.js).
- **Published** (ran `npm view`): `@mkbabb/value.js@0.11.0`,
  `@mkbabb/parse-that@0.9.0`, `@mkbabb/keyframes.js@4.0.0`.
- The release commit `d264053` ("chore(release): @mkbabb/keyframes.js 4.0.0 — the
  B+C+D+E+F stack") is the only `package.json` touch after the F waves
  (`git log -- package.json`); it did NOT bump the sibling pins.

**Why this is a Mandate item, not just a chore.** F/FINAL.md:42-44 records the
F.W6 disposition explicitly: *"the win landed in value.js (C1/C2/C4/C7 — −94%
measured, resolve-count O(frames)→O(1), `bumpLayoutEpoch()` exposed). kf consumes
it unchanged through `iv._lerp` on re-pin."* The whole F.W6 design — kf SHIPs NO
endpoint cache, the win lives in value.js, kf gets it for free **on re-pin** — is
load-bearing on the re-pin actually happening. It did not. So the shipped 4.0.0:
- runs the OLD per-frame computed-unit resolve (re-serializes the memo key every
  hit, re-resolves both endpoints every frame — the exact ~190 ns/leaf/frame path
  F.W6 was authored to kill);
- ships without the parse-that 0.9.0 hardening (the non-reentrant error state, the
  isolated unsound packrat — `F/FINAL.md:95-97`).

The published library is consuming the surface F explicitly designed AWAY from,
while the corrected surface sits unconsumed on the registry. This is a clean
inv-27 violation ("consume PUBLISHED value.js/glass-ui, gate on own green CI") —
the published siblings exist and are NOT consumed.

**The idiomatic fix (no workaround):** re-pin `@mkbabb/value.js` → `^0.11.0` and
`@mkbabb/parse-that` → `^0.9.0`, `npm install` to refresh the lockfile, run the
full suite + `proof:all` GREEN, and cut the patch/minor that actually delivers
the F.W6 win. NOT a caret-loosen-and-hope; the bump is explicit, gated, and the
F.W6 perf gate (`proof:computed-frame` / the value.js C1 bench) is the falsifiable
instrument that the win is now LIVE.

> **Disposition: SHIP-in-G (HIGH).**
> **Instrument:** a re-pin + a steady-state computed-frame resolve-count assertion
> (the F.W6 `proof:computed-frame` call-counter F/F.md:278 named) that BITES on the
> `0.10.0` surface (resolves re-derived per frame) and PASSES on `0.11.0` (served
> from the value.js endpoint memo); the full vitest suite green on the bumped pin.
> **Cross-check:** this overlaps `a-deferred-ledger`'s remit (the F→G pin shift);
> recorded here from the backend-state angle (a shipped library on stale
> siblings = a legacy surface beside its published replacement).

---

### F-BL-2 — `serializeEasing` silently emits `"linear"` for a custom `TimingFunction` — **SHIP-in-G (MED)**

**Verified by running it.**

```ts
// src/animation/format.ts:22-29
export function serializeEasing(easing: Easing): string {
    if (easing.css !== undefined) return easing.css;
    const registryName =
        Object.entries(timingFunctions)
            .filter(([_name, func]) => func === easing.fn)
            .map(([name]) => name)?.[0] ?? "linear";   // <- silent degrade
    return camelCaseToHyphen(registryName);
}
```

Ran `serializeEasing({ fn: (t) => t*t*t*0.5 })` (a real curve, NOT a registry
entry, no `.css`) → returns **`"linear"`**. A consumer who legitimately passes a
closure easing (`timingFunction: (t) => myEase(t)` — a fully supported input;
`resolveEasingOption` at `frame-compiler.ts:51` accepts `typeof input ===
"function"`) gets their curve **silently replaced by `linear`** on serialize.
Round-trip (emit → re-parse) loses the curve with no signal.

This is the same data-loss CLASS F.W7 closed for per-keyframe easing
(`format.ts:119-145`) — except F.W7 only locked the **registry-named** and
**spring `linear()`** paths. The custom-closure path is the uncovered seam:
`test/roundtrip-easing.test.ts:44` asserts `serializeEasing(...) === "linear"`
**for an easing that genuinely IS linear** (a registry `linear`), so the lock
does not distinguish "faithfully linear" from "silently degraded to linear."

**Why it is a Mandate violation (not befitting).** Contrast `waapi.ts:318`
(`uniformTiming.css ?? "linear"`) which is befitting: the eligibility gate
(`waapi.ts:308-315`) GUARANTEES that a non-CSS-twinned easing already baked its
curve into the keyframe stops, so `linear` between stops is FAITHFUL there. In
`serializeEasing` there is no such guarantee — the closure's curve is genuinely
unrepresentable in CSS and is being **discarded**, not faithfully re-expressed.

**The idiomatic fix (no workaround):** a JS closure has no faithful CSS twin —
that is a genuine structural limit, and the Mandate's rule is fail-EXPLICIT, not
silent-degrade. Throw a typed `AnimationOptionError` (or a dedicated
`UnserializableEasingError`) naming the easing: *"a custom TimingFunction has no
CSS `animation-timing-function` representation — attach a faithful `Easing.css`
twin, or use a registry name / `cubic-bezier()` / `linear()` literal."* This is
exactly the posture `errors.ts` already documents (`errors.ts:5-10` — "THROW on
malformed input rather than silently defaulting"). The `?.[0]` is also
dead-defensive (`Array.prototype.map` always returns an array; the `?.` never
short-circuits) — collapse it.

> **Disposition: SHIP-in-G (MED).**
> **Instrument:** `proof:roundtrip-easing` extended with a NEGATIVE control — a
> custom-closure easing must THROW on `serializeEasing` (today it returns the
> wrong `"linear"`); plus a positive control that a genuinely-`linear` registry
> easing still serializes `"linear"` (the F.W7 byte-stable uniform case holds).

---

## § RECORD / BOOK (named so no future lane re-raises)

### F-BL-3 — `ResolvedKeyframes.composition` captured-but-DEAD — **RECORD (BOOK already exists)**

`adapter.ts:29` declares `composition: Map<string, string>`; `adapter.ts:107-126`
populates it. **Zero reads exist anywhere** (`grep -rn composition src/**.ts` — the
only `composition` reads are the populate sites + unrelated FLIP/group/drag prose).
This is precisely the "documented field that is a maintenance lie" CLASS F.W8
fixed for `resolved.options` (`F/F.md:340-341` — "computed then never consumed").

The mitigating nuance: F.md:25-27 **deliberately** BOOKed honoring it ("Captured
(F.W8); honoring it → WAAPI `composite` / rAF accumulate is BOOKed, not
half-wired"). So this is a *known, rationale-carrying* deferral, not an oversight
— and the §Mandate permits a befitting BOOK with a stated home. **RECORD:** the
field is honest about being captured-for-future; it is NOT a silent drop (the
prior bug) NOR a consumed-lie. If G honors composition (the natural home is the
AnimationGroup `add`/accumulate blend the engine already has — `group.ts` blend
modes), the capture is ready. Until then it is a stable, documented forward-seam.
**Do NOT excise** (it correctly preserves data value.js parses); **do NOT
half-wire** (the F BOOK rationale holds).

### F-BL-4 — scroll-named-selector comment now describes a DEAD path — **RECORD + value.js-HANDOFF**

`adapter.ts:56-61` (`formatSelectorPercent`) carries the comment: *"Scroll-driven
named selectors aren't yet wired into the animation engine; surface them as their
literal name for the consumer to handle."* **Verified by running it:** that
described behavior NO LONGER HAPPENS. With value.js `0.10.0`/`0.11.0`,
`parseCSSValueUnit("enter")` / `"cover 100%"` etc. **THROW** a generic value.js
`Error` ("Parse error at offset 0"). Ran `new
CSSKeyframesAnimation({}).fromString("@keyframes x { entry 0% {…} cover 100%
{…} }")` → throws at the value.js parse layer; the named selector NEVER reaches
`addFrame`'s `clamp(…, 0, 100)`, so the F-era `P4`/`NEW-15` "silently collapse to
0%" is **already dead** (fail-loud now, which is the right direction).

Two residuals:
- **The comment is stale** — it promises "surface for the consumer to handle"; the
  consumer never receives the name (it dies in `parseCSSValueUnit`). A maintenance
  lie of the same family as the dead field, just in prose. **RECORD** (a doc-only
  fix when the seam is next touched).
- **The throw is OPAQUE** — a generic value.js `Error` ("Parse error at offset 0")
  that does not name the scroll-timeline contract. F.md:362-363 BOOKed an "interim
  fail-loud reject" for `P4` at the ScrollTimeline range-model home (E.W9). The
  fail-loud now exists incidentally; G could SHIP a thin guard in
  `formatSelectorPercent` (or at the `fromString` boundary) that detects
  `sel.kind !== "percent"` and throws a TYPED kf error naming scroll-timeline
  ranges as unsupported-in-@keyframes — the genuine fail-explicit version of the
  current accidental opaque throw. **value.js-HANDOFF**: the structured parse-error
  sink (VJ-F2, `F/F.md:552`) would let kf surface a `diagnostics` channel instead
  of an opaque string. Low urgency; the current behavior is correct (fail-loud),
  only the message quality + stale comment are the residue.

### F-BL-5 — the cross-realm parse-that `any` cast — **value.js / parse-that-HANDOFF (RECORD kf-side)**

`utils.ts:251,258` cast `CSSFunction.FunctionArgs as any` and `parseAny as any`
with a precise, honest justification (`utils.ts:246-250`): value.js and kf each
ship their own `@mkbabb/parse-that` copy under different `node_modules` realms, so
the `Parser<T>` classes are **nominally distinct** to TS though runtime-identical.
This is a genuine packaging artifact, NOT a lazy widening — but it is a
cross-repo seam, so it is a HAND-OFF, not a kf-local fix.

**Verified:** parse-that is currently **deduped** (`node_modules/@mkbabb/parse-
that@0.8.2` exists; no nested realm under value.js). So today the runtime is one
realm — the cast guards against the *possible* dual-realm install, not a current
one. The clean elimination is structural: if value.js declared `@mkbabb/parse-
that` as a **peer** dependency (so consumers dedupe to one realm) the nominal
distinctness vanishes and the `any` cast can be a typed import. **RECORD kf-side**
(no kf-local fix — the cast is correct given the current packaging);
**value.js-HANDOFF / parse-that-HANDOFF**: peer-declare parse-that so the realm
collapses. inv-16 relaxed for G impl, but this is a sibling-packaging decision the
value.js/parse-that owner sequences. The `motion-path.ts` / `animate.ts`
`<V … = any>` defaults + `as unknown as Record<…>` (`motion-path.ts:140`) are
legitimate generic-default ergonomics mirroring `FrameCompiler<V = any>` — NOT
findings.

### F-BL-6 — `respectReducedMotion: false` framed as "back-compat" in a major — **RECORD (KILL the framing only)**

`smooth.ts:24` and `numeric.ts:40` document the `respectReducedMotion: false`
default as "back-compat — consumers opt in." In a `4.0.0` MAJOR, "back-compat" is
the wrong frame — there is no prior contract to be compatible with for a NEW
option. The DEFAULT itself is defensible (conservative: animations proceed unless
the consumer opts into the a11y snap), but the *rationale prose* invokes a legacy
concept ("back-compat") that the Mandate's no-legacy precept would rather name as
what it is: the conservative, opt-in default. **RECORD** (doc-only, trivial): the
behavior is correct and SOTA; only the "back-compat" wording is a vestige to
re-phrase to "conservative default — opt in to the reduced-motion snap." Not worth
a wave; fold opportunistically. NO behavioural change.

---

## § ALREADY-SOTA — the bulk; manufacture NO work (binding per the §Mandate)

The backend src is a **reference implementation of fail-explicit discipline**.
Every item below was verified at `file:line` and is left ALONE:

- **The fail-explicit seam is a named, first-class surface.**
  `internal/errors.ts:1-13` documents the posture verbatim — THROW typed
  `AnimationOptionError`/`UnknownEasingError` on malformed (non-`undefined`)
  input; default ONLY for genuine omission. `parseOption` (`errors.ts:60-71`)
  converts a parse-`undefined` into a typed throw carrying the option + offending
  value. This is the Mandate's "fail EXPLICITLY" already built as architecture.

- **`easing.ts` is the Mandate written as a module header.** `easing.ts:12-17`
  documents the EXCISION of the former `EasingResolvable` — "an async resolver
  smuggled behind a sync API: identity-fallback-until-resolved, a dev-only warning
  coupled to the bundler's console-drop, and a silent-permanent-identity
  degradation … the fail-explicit violation." `resolveEasing` now throws
  `UnknownEasingError` on an unresolvable name and rethrows a NAMED chunk-load
  failure (`easing.ts:75-96`). No silent identity fallback survives.

- **The option setters are uniformly fail-explicit.** `setDuration`/`setDelay`/
  `setDirection`/`setFillMode`/`setIterationCount`/`setColorSpace`/`setHueMethod`
  (`engine.ts:315-514`) each: `== null` → genuine-omission default; present-but-
  malformed → typed throw via `parseOption`/`AnimationOptionError`. `engine.ts:312`
  states it: "no silent fallback, no silently-preserved previous value." The
  `tryParseTime` catch (`engine.ts:57-64`) is NOT a swallow — its `undefined`
  return is the parse-failure SIGNAL that `parseOption` converts to a typed throw.

- **`AnimationGroup.setLayerConfig` is the cited exemplar.** `group.ts:716-729` —
  "silent no-ops were hiding consumer bugs" → now throws naming the unknown key +
  the known-keys list. The fail-explicit posture reaches the orchestration tier.

- **`stagger` / `NumericAnimation` / `Timeline` reject string-name easing
  explicitly.** `stagger.ts:132-142`, `numeric.ts:23-31`, `frame-compiler.
  resolveEasingOption:47-77` — a string name THROWS with the `resolveEasing(name)`
  remedy named; no silent identity. `fromMotionPath` throws on a missing/empty
  `path` (`motion-path.ts:118-122`). `toWAAPIOptions` throws `TypeError` on an
  unrecognized fill/direction (`waapi.ts:302-306`).

- **The catch sites are ALL befitting platform-throw handling, not bug-swallows.**
  Verified each:
  - `waapi.ts:399-407` — the AbortError on a deliberate `stop()`/`reset()` cancel
    (`finished` rejects); handles already cleared by `_cancelWAAPI`; documented as
    a deliberate halt, swallowed so `play()` resolves cleanly. A genuine throw
    PROPAGATES (the `try` body is just `await Promise.all(finished)`).
  - `waapi.ts:387-397` — `commitStyles()`/`cancel()` on an already-detached WAAPI
    animation throws benignly; nothing to commit/cancel.
  - `engine.ts:902` (`_cancelWAAPI`) — a finished/detached WAAPI animation throws
    on `cancel`; befitting ignore.
  - `engine.ts:1280-1288` (`registerProperties`) — `CSS.registerProperty` throws
    `InvalidModificationError` on a duplicate name (process-wide idempotent
    registry) or a UA-rejected syntax; the JS path stays correct, so it must not
    abort playback. A correct platform-capability fallback, feature-detected at
    `engine.ts:1260-1265` (`typeof CSS === "undefined" || typeof
    CSS.registerProperty !== "function"`).
  None hides a logic bug; each is a documented platform contract.

- **The feature-detect + JS-fallback pattern is befitting and correct
  everywhere.** `waapi.ts` native-scroll bridge returns `{attached:false, reason}`
  and the caller keeps the JS sampler (`waapi.ts:414-429` — the ARCH-kill HOLDS;
  the JS `ScrollTimeline` is the general driver, not a degraded path). `internal/
  scheduler.ts:18` honors a late-installed `scheduler.yield`. `registerProperties`
  no-ops off-DOM. These are platform-capability fallbacks the Mandate explicitly
  permits ("feature-detect with the genuine JS fallback").

- **No legacy code present.** The two `legacy` mentions (`adapter.ts:68,83`) are
  PROSE describing what `resolveKeyframes` REPLACED (the prior `parseCSSKeyframes`/
  `parseCSSStyleBlock`/`parseCSSAnimationKeyframes` fork) — the replacement is in
  one motion; no old path survives beside it (`engine.ts:1168-1172` — "No regex
  pre-detection or fallback parser path"). `sequence.ts:11` names a forbidden
  legacy export it does NOT create. The single `polyfill` mention (`waapi.ts:424`)
  says "no polyfill." Zero `@ts-ignore`/`@ts-expect-error`/`@ts-nocheck`, zero
  `TODO`/`FIXME`/`HACK`/`XXX`, zero `console.*` (the one mention says "without a
  console.warn falling out of the engine" — `waapi.ts:96`).

- **The `??` defaults are legitimate omission-defaults, not contract-masks.** The
  ~40 `...(options ?? {})` in `animations.ts`, the `?? 0`/`?? "x"`/`?? false`
  option defaults in `decay`/`drag`/`morph`/`spring`/`timeline`/`numeric`/
  `sequence` are the genuine "omission → default" path the Mandate permits — none
  masks a present-but-malformed input (those route to the explicit setters).

- **The CSS-parse lenience is befitting + documented.** `engine.ts:1213-1218` — an
  unrecognized per-keyframe `animation-timing-function` inherits the easing rather
  than throwing, because CSS is a forgiving language by spec; the fail-explicit
  throw is reserved for the explicit setter/`addFrame` API. A correctly-reasoned,
  spec-aligned distinction, not a silent swallow.

---

## § inv-16 / inv ε compliance

This lane wrote ONLY this doc under `docs/tranches/G/audit/`. ZERO source/test/CI
edits. Every claim cites a `file:line` on `tranche-g-dev` or is verified by
running the code (F-BL-1 pin state via `npm view` + installed `require().version`;
F-BL-2 via `serializeEasing({fn: closure})`; F-BL-4 via `parseCSSValueUnit` +
`fromString` on scroll-named selectors). The two cross-repo items (F-BL-4 VJ-F2
sink, F-BL-5 parse-that peer-declare) are tagged HAND-OFF — proposals the value.js/
parse-that owner sequences. The §ALREADY-SOTA record is the bulk and is HONEST:
the backend is a reference fail-explicit surface; this lane manufactures no
deficit where D/E/F already lead.

## § Dispositions (summary table)

| id | finding | file:line | disposition | instrument |
|---|---|---|---|---|
| F-BL-1 | kf 4.0.0 ships stale `^0.10.0`/`^0.8.2` pins; F.W6 win published-not-consumed | `package.json:84-85`; commit `d264053` | **SHIP-in-G (HIGH)** | re-pin → `^0.11.0`/`^0.9.0` + `proof:computed-frame` resolve-count bite; full suite green |
| F-BL-2 | `serializeEasing` silently emits `"linear"` for a custom closure (curve lost) | `format.ts:22-29` | **SHIP-in-G (MED)** | `proof:roundtrip-easing` negative control: a closure easing THROWS (today returns wrong `linear`) |
| F-BL-3 | `ResolvedKeyframes.composition` captured but zero reads | `adapter.ts:29,107-126` | **RECORD** (F BOOK holds) | (honoring → group accumulate blend; ready when G honors it) |
| F-BL-4 | scroll-named-selector comment describes a now-dead path; opaque throw | `adapter.ts:56-61` | **RECORD + value.js-HANDOFF (VJ-F2)** | typed-throw guard on `sel.kind !== "percent"`; structured diagnostics sink |
| F-BL-5 | cross-realm parse-that `any` cast (packaging artifact) | `utils.ts:246-258` | **value.js/parse-that-HANDOFF (RECORD kf)** | peer-declare parse-that → realm collapse → typed import |
| F-BL-6 | `respectReducedMotion: false` framed "back-compat" in a major | `smooth.ts:24`, `numeric.ts:40` | **RECORD** (re-word; no behavioural change) | doc-only |
