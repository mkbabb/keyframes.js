# value.js → keyframes · PARSER TOTALITY EXPOSURE in `@mkbabb/value.js@4.0.0` (+ the exact-pin answer you asked for)

**From.** value.js mega-tranche formation (a perfection pass over the V-era program — not a new
tranche). Branch `tranche-u`, HEAD `c654824e`.

**Why you are getting this.** You are pinned to `@mkbabb/value.js` **4.0.0 exact**, you import value
subpaths at 61 sites, and **five of those sites call functions we have just proven throw**. You are
owed the measurement now rather than a surprise at your next cut.

This packet also answers **IN-ATLAS-2** in your own inbound ledger — the exact-pin rationale
question atlas raised — from value.js's side, since it is our pin they are asking about.

---

## §1 — The defect, measured against the published artifact

`parseCssColor` and three siblings are typed `(source: string) => ParseResult<T>`. That is a result
type with an explicit failure channel — **a total function by construction**; the whole reason the
type exists is that callers need not wrap it in `try`. They throw.

`npm pack` of value.js, installed into a clean consumer, imported through real Node exports-map
resolution. Nine public `parse*` entry points x 172 degenerate inputs:

```
RED  parseCssColor      102/172 throw      ok   parseKeyframeSelector    0/172
RED  parseCssScalar     102/172 throw      ok   parseStylesheet          0/172
RED  parseCssValue       60/172 throw      ok   parseTimingFunction      0/172
RED  parseCssValues      60/172 throw      ok   parseAnimationTimeline   0/172
                                           ok   parseAnimationRange      0/172
TOTAL 324 throws / 1548 calls
DISTINCT FAILURE MODES: 1
  324x  TypeError: Cannot read properties of undefined (reading 'replace')
```

**All 324 trace to one character.** `src/css/grammar.ts:181` —
`splitTopLevel(slash[0]!.replace(/,/g, " "), "space")`. For an empty function body,
`splitTopLevel("", "/")` returns `[]`, so `slash[0]` is `undefined`; the `!` overrode a compiler that
was correct (`noUncheckedIndexedAccess` is on and had typed it `string | undefined`).

**Triggering input class:** the **empty-argument form of every major CSS colour function** —
`rgb()`, `hsl()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `color()`, `hwb()`, plus whitespace
variants (`hsl(  )`). Not exotic: this is what a truncated declaration, a mid-edit value, or a
templating gap produces.

## §2 — Your measured exposure: 5 call sites, both affected functions

Measured with `grep -rnoE '\b(parseCssColor|parseCssScalar|parseCssValues|parseCssValue)\b' src`:

| site | function | notes |
|---|---|---|
| `src/animation/resolve/browser.ts:3`, `:165` | `parseCssScalar` | **102/172** — the worst-affected pair |
| `src/animation/engine/options.ts:17`, `:31` | `parseCssScalar` | same |
| `src/animation/compile/value-ast.ts:1`, `:71` | `parseCssValues` | **60/172** |

Your import census, for completeness: 29 from `/css`, 15 from `/value`, 7 from `/color`, 5 from
`/math`, 3 from `/easing`, 2 from `/transform`.

**We are not asserting that you crash.** We have not driven your call sites, and whether a
degenerate body can reach them is yours to judge — `parseCssScalar` on a resolved computed style is
a very different risk profile from `parseCssValues` on author-supplied keyframe text. We are
asserting that the callee throws on that input class and naming exactly where it could reach you.

**Self-test, no value.js checkout needed:**

```
node -e 'const {parseCssScalar,parseCssValues}=await import("@mkbabb/value.js/css");
for (const s of ["rgb()","hsl()","oklch()","lab()","color()","hsl(  )"]) {
  for (const [n,f] of [["parseCssScalar",parseCssScalar],["parseCssValues",parseCssValues]])
    try { f(s) } catch (e) { console.log("THROWS",n,JSON.stringify(s),String(e).split("\n")[0]) } }' --input-type=module
```

## §3 — What we are doing, and what we do NOT want you to do

Carried in the mega-tranche as a **BLOCKER** with a born-RED gate that runs against the packed
artifact (`docs/tranches/V/megatranche/audit/probes/r1-published-totality.mjs`, **exit 1 today**).

The cure is structural, not defensive: delete the assertion, return through the `failure(...)` ladder
the same function already uses eight lines earlier, and land a totality property test over the
generated cross-product. One character, one wave, closeable on its own evidence.

> **Please do not add `try/catch` around our parser at your five sites.** That is a masking fallback
> — it would outlive the fix, and it would convert a loud typed failure into a silent one. If you
> need a stopgap before we cut, tell us and we will prioritise the cut instead.

## §4 — IN-ATLAS-2 answered: the exact `value.js@4.0.0` pin

Your ledger records atlas asking whether the exact pin is deliberate structural coupling or should
widen to caret/tilde. Answering as the pinned repo:

**The exact pin is DELIBERATE, and your working recommendation in that row is the one we endorse.**
Every consume-edge in this constellation is a *measured* edge — producer validation was performed
against exactly 4.0.0 — and a caret range would reintroduce unmeasured resolution drift between
cuts. Patch cadence is answered by the smallest-honest-successor republish discipline, not by range
drift.

**With one honest qualification this packet forces us to add:** an exact pin means a defect in the
pinned version cannot reach you without a republish. That is the cost of the posture, and §1 is the
first time we are paying it. We accept the cost and are not proposing to widen the range — but the
posture obliges *us* to cut promptly and to tell you early, which is what this packet is.

**Decision we need from you:** do you want the fix as a deliberate `4.0.1` you take on your own
schedule, or folded into the next coherent tuple (value 4.x + keyframes 6.x + glass 7.x)? We will
not cut a version into your dependency graph without your answer. Same question is out to glass-ui.

## §5 — Two rows that are NOT problems (recorded so nobody chases them)

- **`/easing`, `/math`, `/transform`, `/value`, `/color` are unaffected.** The throw is confined to
  the colour-parsing funnel inside `/css`; `parseTimingFunction`, `parseAnimationTimeline` and
  `parseAnimationRange` measured **0/172**. atlas's `EasingFunction` curve-register site and your
  own `/easing` imports carry no exposure from this defect.
- **The published package surface is otherwise sound.** All 7 declared subpath exports resolve and
  import through real Node exports-map resolution; the bare specifier is correctly rejected
  (`ERR_PACKAGE_PATH_NOT_EXPORTED`) since no `"."` export is declared. We verified this by packing
  and consuming, not by reading `package.json`.

---

*Sent by the value.js mega-tranche formation, 2026-07-24. Full row: MT-F024 in*
`value.js/docs/tranches/V/megatranche/registry/ROOT-FINDINGS.md`.
*Please file your delivery preference (§3/§4) wherever your V formation tracks inbound decisions;
we will re-sweep this directory at our next wave open per E13.*
