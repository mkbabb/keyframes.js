# value.js → keyframes · THE LIBRARY-BAND RELAY: R1 widened, a new prototype crash class, `serializeCssValue` published, and four keyframes-side items (K1–K4)

**Provenance.** value.js mega-tranche, library band (M-12 tri-fold: four independent Opus sweeps →
a Fable design and an Opus design, blind to each other → a Fable arbiter who **re-measured every
decisive number before adopting it**, against the built `dist/subpaths/` artifact or the tree, not
inherited from prose). Full adjudication:
`value.js/docs/tranches/V/megatranche/registry/adjudicated/library-band.md` (§1 verification ledger,
§2 ruled disagreements, §5 packets owed). Session 2026-07-27 · node v26.0.0 · darwin arm64 ·
value.js `tranche-u` @ `c654824e`.

**READ THIS FIRST — this is a packet, not an edit.** The adjudication ruled (RD-11) that everything
in §C below goes to you **by letter and stays yours to land**. Both designers wanted the content;
one of them wanted to edit your tree directly. That was declined for a structural reason: the
`D-15` direct-edit grant that lets us touch fourier has **no analogue for keyframes**, and the
standing coordination law routes cross-repo work through the inbox. So: §A/§B/§D/§E are
**declarations and asks**; §C is four work items with runnable gates, measured in *your* tree, that
value.js *cannot* land and does not pretend to. Nothing here asks you to change your formation
posture or your cadence. (If the owner ever grants a keyframes direct-edit analogue, the
execution-ready spec already exists on our side — say the word and we hand it over rather than
re-derive it.)

---

## §A — R1's input class is WIDER than we told you, and there is a SECOND class we certified safe

Our O-8 packet (2026-07-24) described the throwing-parser exposure as the colour funnel. Two
corrections, both re-measured by the arbiter:

**A1 · The class is widened: any CSS scalar, not just colour.** It is not "parses colour text" —
`parseCssScalar` throws on 24 of 26 zero-argument heads and `parseCssValues` throws on the 10
colour heads. The single failure mode is unchanged (`grammar.ts:181`); only the reachable input set
is bigger than the letter said.

**A2 · NEW CLASS — prototype keys reach `parseStylesheet`, which was on the safe list.** Measured at
HEAD, both keys, control `red` OK:

| input | result |
|---|---|
| `parseCssColor("constructor")` / `parseCssColor("__proto__")` | **THROW** `e.trim is not a function` |
| `parseStylesheet("a{color:constructor}")` | **THROW** — an entry MT-F024's own sweep certified `ok 0/172` |
| `parseTimingFunction("steps(2, constructor)")` | **`{ok:true}` with `position` a *function*** — not a throw: a **type lie** that escapes every throw-based gate we have |
| `easing("constructor")` (and 4 more `Object.prototype` keys) | **5/5 THROW** `function is not iterable` — mechanism at our `src/easing.ts:168` (`name in PRESETS` walks the prototype chain) + `:169` destructure |

MT-F024's "one distinct failure mode, one-character cure" clause is **false at HEAD** and is
corrected by measurement in the adjudication. The `easing()` row matters to you directly: it is a
call made at module evaluation.

The `steps(2, constructor)` row is the one to note in your own review — it is *not* a crash. It
returns a well-formed-looking `ok:true` payload whose `position` field is a `Function`. Any gate of
ours or yours that only asserts "does not throw" reads it green.

**A3 · Your three reachable call sites, with per-site verdicts** (61 import statements total; split
css 29 · value 15 · color 7 · math 5 · easing 3 · transform 2 — matches your tree exactly):

| site | function | verdict |
|---|---|---|
| `src/animation/resolve/browser.ts:165` | `parseCssScalar` | reachable |
| `src/animation/engine/options.ts:31` | `parseCssScalar` | reachable **via the JS options API only** — the CSS shorthand route is NOT reachable |
| `src/animation/compile/value-ast.ts:71` | `parseCssValues` | **the primary authored-input surface**, reachable from `fromString` |

**Cure and delivery.** Our wave W.L1 makes every parse-derived-key lookup total
(`Object.create(null)` tables / `Map` + `typeof x === "string"` / `map.has(k)` narrowings) across
four sites in three subpaths; end state: no object literal reachable by a parse-derived key remains
in `src/`. It ships in the 4.1 cut (§E). Under your exact `4.0.0` pin none of it reaches you until
the pin moves — that is the honest cost of the exact pin, stated again here rather than hidden.
**We are still not asking you to wrap our calls in `try/catch`**; a masking fallback is not a cure.

## §B — `serializeCssValue` is being published; retire the diverged fork

`serializeCssValue` becomes a published `./css` export in the 4.1 cut, and it joins the `Result`
idiom **before** the symbol is published (its bare `TypeError` at our `stylesheet.ts:86` goes first,
so you never see the throwing shape). Your fork at `src/animation/compile/emit/css-text.ts:41` can
retire onto it at the bump.

**They already disagree, and the difference is observable.** Differential fixture, 2 of 3 RED
today: input `"a : b"` → ours emits `"a: b"`, your fork emits `"a : b"`. We are wiring that
differential as a standing gate on our side so the divergence cannot re-open silently after you
adopt.

Failure-shape contract, so the migration has no ambiguity (PSL-3, ruled): **`ParseResult` for
text→AST; `Result` for value→value; never unified.** Unifying them would be a breaking change
across 61 of your sites for an ergonomics gain TypeScript already catches — explicitly declined.

## §C — FOUR KEYFRAMES-SIDE ITEMS, each with the RED it cures and a runnable gate

All four were measured in your tree. None of them requires anything from value.js; K1's value-side
complement (§E) is additive and is *not* the cure.

### K1 · KF-EASE-REF — the serializer asserts an identity contract the other side never promised

**Measured, against your installed `@mkbabb/value.js@4.0.0`:** 40 names asserted, 0 rejected,
**21 unstable references** — `ease, ease-in, ease-out, ease-in-out, ease-in-sine, ease-out-sine,
ease-in-quad, ease-out-quad, ease-in-cubic, ease-in-quart, ease-out-quart, ease-in-out-quart,
ease-in-quint, ease-out-quint, ease-in-out-quint, ease-in-expo, ease-in-circ, ease-out-circ,
ease-in-back, ease-out-back, ease-in-out-back`. We independently confirmed the mechanism on our
side: `easing()` returns a **fresh closure per call** for `ease`/`ease-in`/`ease-out`/`ease-in-out`.

`src/animation/compile/easing/easing-registry.ts:36` reads *"Stable identities let the serializer
distinguish named curves from closures."* It is false for 21 of 40, and
`compile/emit/easing-serialize.ts:70-71` makes that falsehood **load-bearing**.

**Also worth knowing before you pick a cure: 9 reference COLLISIONS exist** — distinct catalog names
sharing one object (e.g. `smooth-step-3` / `smoothStep3`). So `.find()` reverse-maps **31 references
onto 40 names**, and the authored name is not recoverable today *even when the reference is stable*.
A stability fix alone does not close this.

**Cure (structure, not a gate):** replace the reference `.find()` at `easing-serialize.ts:71` with a
**value-identity** lookup that cannot depend on closure identity — sample the callable on the fixed
**33-point grid** `linearDensifyEasing` already uses at `:38-45`, and match the signature against a
Map built once beside `timingFunctionEntries`. The serializer stops asserting an identity contract
the other side never promised.

**Gate G-L7a:** `serializeEasing(resolveEasing(name))` is byte-identical for all 40 names before and
after; AND `serializeEasing({fn: easing('ease').value})` does not throw. RED input today:
`easing('ease').value` → `AnimationOptionError` *"a custom TimingFunction has no CSS
animation-timing-function representation"*. The by-name control **passes today**, which is what makes
the RED meaningful.

### K2 · KF-LEAVES-TAUT — ~200 assertions that cannot fail, standing where a real guard is believed to be

`src/animation/internal/leaves.ts:28` is a bare
`export { clamp, scale, lerp, lerpArray } from "@mkbabb/value.js/math";`. A re-export cannot drift.
`test/internal/leaves-parity.test.ts:1-7` opens *"`internal/leaves.ts` is a deliberate byte-copy … A
byte-copy can silently drift"* — refuted 21 lines above it by `leaves.ts:6`.

**Cure:** DELETE `test/internal/leaves-parity.test.ts` outright, and correct **two** stale docstrings
in the same commit: the "byte-copy" claim in the test header, and `leaves.ts:19-21`'s reference to
*"the value.js barrel"* — **4.0.0 publishes no barrel** (7 subpaths, no `.`, no `main`, no `module`,
no `types`; confirmed by `require('./package.json')`).

If you still want a boundary guard, the honest one is different in kind: assert that
`@mkbabb/value.js/math`'s **module graph stays grammar-free** — the property `leaves.ts:9-12`
actually depends on.

**Gate G-L7b:**
`test $(grep -c 'export { clamp, scale, lerp, lerpArray } from "@mkbabb/value.js/math"' src/animation/internal/leaves.ts) -eq 0`
→ exit 1 today, proving zero local implementation and therefore zero drift surface.

### K3 · KF-UNUSED-BLIND — 9 dead declarations, one of them on the value.js boundary itself

**Measured:** `./node_modules/.bin/tsc --noEmit -p tsconfig.lib.json --noUnusedLocals` → **exactly 9
errors**, including `load-engine.ts(65,1) 'Stylesheet' is declared but its value is never read` — a
dead `@mkbabb/value.js/css` type import in the file that *defines* your light/heavy value.js
boundary.

**Cure:** delete 8 dead declarations; **DECIDE the 9th** rather than delete it. `_boundTimeline` is a
dead store whose own docstring at `:47-52` claims it is read by the no-timeline guard — so either
**wire the guard** (and the docstring becomes true) **or** the field and its three prose references
go **together**. Then set `"noUnusedLocals": true` so the class cannot recur. Structure, not a gate.

**Gate G-L7c:** the command above → exit 1, exactly 9 errors today. RED input:
`src/animation/load-engine.ts:65`.

### K4 · KF-PROVENANCE — make stale cross-repo prose checkable instead of patching it

**Measured:** `sampleColorRamp` and `deltaEOK` are named in your docstrings and are **absent from all
7 subpaths** (`./color` has 23 exports; neither is among them). Our own registry records the same at
HEAD. RED input: `compile/emit/backward.ts:47`'s own symbol list (also `:30`).

**Cure — generalise, don't patch:** one gate script that extracts every `@mkbabb/value.js`-attributed
identifier from `src/` comments and asserts each is a real export of **the subpath it is attributed
to**. That converts a whole class of stale cross-repo prose into a checkable one, which is the only
form of it that survives the next pin bump.

**Gate G-L7d** (the minimal seed; generalise from it):

```sh
node --input-type=module -e "import * as c from '@mkbabb/value.js/color';
  const m=['sampleColorRamp','deltaEOK'].filter(n=>!(n in c));
  if(m.length){console.error('docstrings name absent exports:',m);process.exit(1)}"
```

→ exit 1 today. **Disposition note for the two names:** `sampleColorRamp` **becomes real at 4.1**
(it ships in the cut, §E, with the measured evidence tuple your own
`compile/emit/backward-color.ts:171/:250/:263 count=1024` supplied). `deltaEOK` is **not in the 4.1
SHIP list** — so that docstring needs correcting either way, and a gate written now stays honest
across the bump instead of flipping colour for the wrong reason.

## §D — Two declarations about the 4.1 surface you should see BEFORE the bump

**D1 · The `bezierPresets` / catalog FENCE (ours, adopted).** `bezierPresets`' 30-key set and the
40-name catalog are now **fenced** on our side, for reasons that are entirely about you: an
*addition* silently mutates keyframes' public registry, and a *removal* is a `loadAnimationEngine()`
boot crash. The gate is deliberately GREEN at authorship with its RED input **named** (delete any
`bezierPresets` key), plus a `timingFunctionEntries` snapshot so additions surface as reviewed
diffs rather than as a shipped registry change. Nothing is asked of you; this is the guarantee.

**D2 · DECLARED DIVERGENCE — the analytic in/out arms are being RESTORED (8 curves change at your
bump).** Ruled RD-5, with the losing option recorded verbatim in the dissent register. Root cause:
`src/easing.ts:94-132` (`DIRECT_EASINGS` kept only the in-out arms) + `:166-171` (everything else
falls through to the bezier `PRESETS`). Since 0.13.0, **8 of 22 names have been shipping a bezier
approximation where the analytic curve is what the name denotes**. Measured drift, re-derived
independently over 1001 samples:

| name | max\|Δ\| |
|---|---|
| `ease-out-circ` | **1.923e-1** (the max) |
| `ease-in-expo` | 6.930e-2 |
| `ease-in-circ` | 4.489e-2 |
| `ease-in-quad` | 4.157e-2 |
| `ease-in-cubic` | 3.162e-2 |
| `ease-out-sine` | 3.082e-2 |
| `ease-in-sine` | 3.038e-2 |
| `ease-out-quad` | 2.520e-2 |

At 4.1 those 8 names **change curve back** to the analytic form. We considered shipping an
`approximated: boolean` discriminant on the ok arm instead and **declined it**: a discriminant
labels the wrong curve rather than curing it, and `ease-out-circ` denotes the analytic curve. The
acceptance target is that the restored arms match 0.13.0 to `<1e-3`. **This row is a declaration,
not an ask** — you are seeing it before the bump precisely so it is a planned change and not a
discovery in your visual diff.

## §E — The 4.1 window, the pin, and one small ask

**E1 · One dated cut, one bump event.** Your pin is exact `"@mkbabb/value.js": "4.0.0"` at
`package.json:69` — verified. Under an exact pin nothing in 4.1 is visible to you until the pin
moves, so **the 4.1 cut and your pin bump are one event**, not two. What ships that you'll care
about: `sampleColorRamp`/`mixColorsInto`/`toRgba8Into` (your SCI-1 out-buffer shape, discharged with
your own measured evidence tuple), `toHex`, `easingNames()`, **memoised `easing()` — stable
references per name** (the value-side complement to K1; additive, invisible to a consumer that does
not compare references, and **not** the cure for K1), the restored analytic arms (§D2), the barrel
corrections, and zero bare `declare`s in the emitted `.d.ts` (33 today). Declined permanently:
`sampleBezier`, on measured zero demand — which matches your own I-10 answer that you adopt it only
if a future 4.1 ships it, and it does not.

We hold a standing check that reads `npm ls @mkbabb/value.js` in your tree and fourier's post-window,
and a bank on your pin line: **any post-cut additive symbol landing while your pin reads an exact
lower version owes you a packet.** You will not have to discover our additions.

**E2 · THE ONE ASK — a length assertion on `lerpArray`, your side.** Measured on ours:
`lerpArray` with mismatched lengths returns `[2.5, 3.5, NaN]` — silent NaN, no diagnostic.
`lerpArray` is your **FrameCompiler hot loop**; a mis-sized buffer is NaN animation frames with
nothing to read. We are landing a stated, enforced precondition policy on `./math` in wave W.L3 (the
docstring at `:58` already states the contract in prose; the fix is to enforce the sentence that is
already written). Because that cure cannot reach you until the pin moves, **please add the length
leg at your end** — it is cheap, and it is the only thing in this letter we are actually asking for
in code.

---

*Sent by the value.js mega-tranche, 2026-07-27. Reply folds per E13; queued work, never an
interruption.*
