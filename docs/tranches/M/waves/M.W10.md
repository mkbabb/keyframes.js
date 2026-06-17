# M.W10 — The parse-that consume + the two-grammar consolidation

- **Band:** C · **Class:** DEV (docs); IMPL opens on authorization AND arm-by-arm
  as each parse-that cut publishes. **Dep:** **parse-that 0.9.1+** (the PT.M1–M5
  cut sequence, ordered) coordinated with **value.js Tranche O 0.14.0** (M.W9 — the
  value-reader consume + the direct-dep delete). This is a HANDOFF-gated consume
  wave with FIVE independent arms, each fired by its own sibling publish; NO arm is
  a kf-local cure (the cures live in parse-that's combinator core + value.js's
  grammar; inv-16). Born-RED kf-side TODAY on parse-that 0.9.0 — the
  typesVersions-absent arm reds live (`@mkbabb/parse-that@0.9.1` → E404, the stale
  `typesVersions` field PRESENT, verified 2026-06-17).
- **Gate (born-RED, two NEW gates authored gate-first + one extended):**
  - `proof:packrat-sound` (NEW — `scripts/proof-packrat-sound.mjs`, authored
    gate-first; does NOT exist today, verified `ls scripts/ | grep packrat` →
    empty). The gate INVOKES the installed parse-that's `memoize()` over the
    real same-parser-at-two-offsets case and asserts the SOUND result; born-RED
    on 0.9.0 because the MEMO is keyed on `parser.id` alone (`getCijKey` exists +
    is used for `LEFT_RECURSION_COUNTS` but NOT for the MEMO lookup —
    `dist/parse.js:1239,1251,1255,1267`, the id-only `MEMO.get(p.id)`). GREEN on
    PT.M3 publish + re-pin — OR the gate flips to a KILL-RECORDED assertion if the
    unsound tier is deleted (PT.M3 = KILL).
  - the `typesVersions-absent` arm of `proof:deps-current` (EXTENDED —
    `scripts/proof-deps-current.mjs`, authored at G.W2). A NEW clause asserts no
    constellation package ships a `typesVersions` field resolving to a
    non-existent path; born-RED TODAY because parse-that 0.9.0 declares
    `"typesVersions": {"*":{"*":["dist/src/parse/index.d.ts"]}}` and
    `dist/src/` does NOT exist (verified: `ls node_modules/@mkbabb/parse-that/dist/src/`
    → absent). GREEN on PT.M1 (0.9.1) publish + re-pin.
  - the `permutation`-shorthand arm of `proof:replay-equality` (EXTENDED — the
    non-canonical-order `animation:` shorthand fixture, ABSENT today; value.js's
    shorthand parse is order-sensitive). Born-RED on first author; GREEN only
    after PT.M5 ships AND value.js adopts `permutation` in its shorthand grammar
    (a value.js-O-coordinated green, not a kf-only one).
- **Folds (lane #):** lane-20 §1 (the 0.9.0 inventory ground truth) · lane-20 §3
  (the Option B verdict, three verification points) · lane-20 §4 P1/P2/P3/P4/P5/P7
  (the carry-set) · lane-20 §5 PT.M1/PT.M2/PT.M3/PT.M5/PT.M6 (the M-wave proposals)
  · lane-20 §6 DLL-22/DLL-50/DLL-27 (the deferred folds) · lane-20 §7 (the M-spine
  publish sequence) · lane-24 §2.1/§2.2/§2.3 (the two-grammar verdict, Option B
  confirmed, the KISS violation) · lane-24 §4 M.W(parse-that-structural) (the MAJOR
  that can lag).
- **Precept cure:** the **KISS / no-redundant-grammar** violation (lane-24 §2.3,
  lane-20 §4 P7) — TWO structural CSS grammars in the constellation spine, the
  weaker (value.js's hand-rolled `selectorListText`/`balancedText` over opaque
  bodies) being the consumed one, the stronger (parse-that's typed `cssParser`/
  `CssNode`/specificity) published-but-unconsumed. Option B retires parse-that's
  structural layer so value.js owns THE ONE typed CSS grammar. Plus the
  **no-latent-hazard** cure (the unsound packrat MEMO key, P3) and the
  **produce-and-consume-land-together** cure (P6 — the value readers shipped without
  a consumer until value.js O's `parseCSSSubValue` adopts them).

---

## Context

L.W9 dispatched three outbound ask documents (one per sibling) and authored the
born-RED consume gates. parse-that's slice of that dispatch
(`KF-TO-PARSE-THAT-ASKS.md`) named six asks; the 32-lane re-audit (lane-20)
live-probed parse-that 0.9.0 against ground truth, confirmed the asks, and corrected
two prior-audit overstatements (the packrat re-key cost; the value-reader cross-realm
concern). This wave is the kf-side consume of that dispatch — the coordinated parse-that
+ value.js-O grammar-consolidation, executed arm-by-arm on each sibling publish.

**The premise — ONE CSS grammar (Option B; lane-24 §2.2, lane-20 §3).** Two
structural CSS grammars live in the constellation today:

- **parse-that `parsers/css/`** — a published ROOT export (`cssParser`,
  `parseSingleValue`, `parseFunctionArgs`, `specificity`; confirmed live-exported in
  `dist/parse.js:1826,1891,2088` for the value readers). Typed `@media`/`@supports`,
  `CssAtKeyframes`, specificity, `CssDeclaration.important`, recursive
  `genericAtRule` bodies. STRONGER. But it carries no serializer and no `Span`/`loc`
  on any AST node (structural barriers to replay-equality), and — crucially — **no
  constellation member consumes `cssParser`**: kf calls value.js's
  `parseCSSStylesheet` (`adapter.ts`), value.js uses only parse-that's low-level
  combinators (`all`/`any`/`regex`/`string`), never `cssParser`.
- **value.js `src/parsing/`** — built on parse-that's combinators, NEVER on
  parse-that's CSS module. Owns the typed `@keyframes` (the animation-domain
  grammar), typed `@property`, the value grammar, AND the block serializer
  (`serializeStylesheetItem`/`serializeStylesheet`). WEAKER on structure (opaque
  at-rule bodies, no nesting) but it is the CONSUMED grammar and the home of the
  serializer.

The KISS violation is the redundancy: the structural work is done twice, the weaker
copy consumed. **Option B** (the L.W10 spike verdict, re-confirmed by lane-24 §2.2
against ground truth) resolves it: value.js extends its grammar to own THE ONE typed
CSS grammar (M.W9 / M.W11 / value.js O), parse-that ships a MAJOR that deletes its
structural `cssParser`/`CssNode` layer while RETAINING the value readers
(`parseSingleValue`/`parseFunctionArgs`) that value.js's `parseCSSSubValue` consumes.

**Why this wave is the parse-that-track, distinct from M.W9 (the value.js-track).**
The two tracks fire on SEPARATE sibling publishes and own DISJOINT cures (lane-20 §7,
lane-26 §6):

- **M.W9** consumes value.js 0.14.0: re-pins value.js, deletes the `linear()` regex
  (S7), the `FN_NAME` Symbol (S8), and **the direct parse-that dep + import**
  (S9 — `utils.ts:1` `import { any as parseAny } from "@mkbabb/parse-that"` +
  `package.json:211`), swaps the inline `lerpArray` for value.js's `./math` subpath,
  and AUTHORS the `proof:boundary` W96 parse-that-scan (the ⚠M8 gate named at
  `L.W9.md:381` but never implemented — the boundary gate today scans only for
  `@mkbabb/value.js` specifiers, NOT parse-that, verified). The S9 delete greens on
  **value.js O's `parseCSSSubValue` (VJ-L3)** — a value.js publish — NOT a parse-that
  one, because the value readers cross no realm boundary (lane-20 §2: they operate on
  `ParserState<unknown>` directly, so value.js adopts them WITHOUT the `as any` cast
  hack kf currently needs).
- **M.W10** (this wave) consumes the parse-that cuts themselves: the manifest hygiene
  (PT.M1 typesVersions + CJS), the value-reader API-stability confirm (PT.M2 — the
  produce-half whose consumer is value.js O, not kf), the packrat soundness OR KILL
  (PT.M3), the `permutation` combinator (PT.M5), and the Option B structural
  retirement (PT.M6 — the MAJOR that can lag all of the above).

The seam: M.W9 retires kf's DIRECT parse-that edge (so after M.W9, kf has ZERO direct
parse-that imports and all coordination flows through value.js — the acyclic spine
`parse-that → value.js → kf`). M.W10 consumes the parse-that CUTS that make value.js's
grammar correct + complete, and records the two-grammar consolidation. They are
ordered but independent: M.W9's S9 delete does NOT require any M.W10 arm to land first,
and M.W10's PT.M6 structural retirement REQUIRES M.W9's dep-delete to have completed
(lane-20 §5 PT.M6: "what MUST precede it: value.js O ships `parseCSSSubValue`; kf
re-pins and deletes its direct parse-that dep").

### The five arms (each its own sibling-publish tripwire)

| Arm | parse-that cut | What kf consumes | kf-side born-RED gate | Tripwire |
|-----|----------------|------------------|-----------------------|----------|
| **A1** | PT.M1 (`0.9.1` patch — ships FIRST, lowest-risk) | re-pin to admit 0.9.1; the stale `typesVersions` + CJS `require` gone | `proof:deps-current` typesVersions-absent arm | `@mkbabb/parse-that@0.9.1` published |
| **A2** | PT.M2 (no code — API-stability confirm) | nothing kf-direct; the value-reader signatures are stable for value.js O to adopt | (covered by M.W9's S9 + `proof:boundary` W96 — value.js-track) | value.js O `parseCSSSubValue` ships |
| **A3** | PT.M3 (packrat `(id,offset)` re-key OR KILL) | the sound packrat tier (or its recorded deletion) | `proof:packrat-sound` (NEW, gate-first) | PT.M3 published |
| **A4** | PT.M5 (`permutation` combinator) | value.js's shorthand grammar collapses the hand-rolled order-tolerance | `proof:replay-equality` permutation-shorthand arm | PT.M5 ships + value.js adopts |
| **A5** | PT.M6 (MAJOR — delete structural `cssParser`/`CssNode`; keep value readers) | the two-grammar consolidation; value.js owns THE ONE CSS grammar | `proof:boundary` stays GREEN (M.W9-authored) + the consolidation recorded | PREREQ: M.W9 dep-delete done, then parse-that MAJOR |

### Audit evidence

| Ref | Source location | Fact (verified this session unless noted) |
|-----|-----------------|-------------------------------------------|
| lane-20 §1.1 | `node_modules/@mkbabb/parse-that/package.json` | `typesVersions` = `{"*":{"*":["dist/src/parse/index.d.ts"]}}`; `dist/src/` ABSENT (`ls dist/src/` → "No such file or directory") — the stale path is a LIVE defect in published 0.9.0 |
| lane-20 §1.1 | same | `exports["."].types` = `"./dist/index.d.ts"` — the `exports` map already covers type resolution; the `typesVersions` is dead + conflicting |
| lane-20 §1.1 | same | `exports["."].require` = `"./dist/parse.cjs"` — the CJS artifact (146KB) ships in an ESM-only constellation; dead weight + dual-module hazard |
| — | `npm show @mkbabb/parse-that version` / `@0.9.1` | latest `0.9.0`; `0.9.1` → **E404** (the A1 tripwire — unfired); installed `0.9.0` |
| lane-20 §1.1 / §4 P3 | `dist/parse.js:1223` (`getCijKey`), `:1227` (LR-count uses it), `:1239,1251,1255` (`MEMO.get(p.id)`/`MEMO.set(p.id,…)` — id-only), `:1267` (`mergeMemos` same id-only) | the packrat MEMO is keyed on `parser.id` ALONE though `getCijKey(parser,state)` (the `(id,offset)` composite) exists and is used CORRECTLY for `LEFT_RECURSION_COUNTS` — a ONE-LINE-class fix at two lookup sites, NOT a from-scratch WDM rewrite (the prior-audit overstatement, lane-20 §9 corrected) |
| lane-20 §1.1 / §4 P4 | `grep -r "permutation" parse-that/src/` → zero (lane-20); confirmed absent in installed dist | no `permutation` combinator — CSS `||` any-order semantics absent; value.js hand-rolls shorthand order-tolerance |
| lane-20 §1.2 / §2 | `dist/parse.js:1826` (`parseSingleValue`), `:1891` (`parseFunctionArgs`) | the value readers are root exports operating on `ParserState<unknown>` directly (NOT `Parser<T>` instances) — they bypass the cross-realm nominal-type barrier, so value.js adopts them with NO `as any` cast (the §2 ground-truth that strengthens PT.M2) |
| lane-20 §2 | `src/animation/utils.ts:1` | `import { any as parseAny } from "@mkbabb/parse-that"` — the SOLE direct kf parse-that edge; the `(parseAny as any)(...)` cast at `:241` is the cross-realm wedge; `package.json:211` `"@mkbabb/parse-that": "^0.9.0"` exists SOLELY for this import |
| lane-20 §3 / lane-24 §2.2 | `src/animation/adapter.ts` imports `parseCSSStylesheet` (value.js); grep zero kf reach to `cssParser` | NO constellation member consumes parse-that's `cssParser` — the structural deletion (PT.M6) breaks nothing live; the MAJOR can lag indefinitely |
| ⚠M8 | `L.W9.md:381` | the `proof:boundary` W96 parse-that-scan named ("extend `holdsValueJsSpecifier` to also catch direct `@mkbabb/parse-that` imports") but NOT implemented — `proof-boundary.mjs` scans only `@mkbabb/value.js` today (verified). **AUTHORED IN M.W9** (not this wave) per the M.md M.W9 row |
| — | `node scripts/proof-workaround-deletion.mjs` (run 2026-06-17) | `0 GREEN / 5 PENDING / 0 RED`; `S9=PENDING` — the direct-dep delete is STAGED on **value.js@0.14.0** (E404), an M.W9 arm — NOT a parse-that-publish arm |
| — | `ls scripts/ \| grep packrat` → empty; `package.json` has no `proof:packrat-sound` | the `proof:packrat-sound` gate is ABSENT — the gate-first born-RED authoring obligation of this wave (A3) |
| lane-20 §5 / lane-24 §5 | — | the W100 incremental-parse KILL re-affirmed (no parse-that `Span`/`loc`; sub-ms full reparse in the 300ms debounce) — BOOK-with-tripwire, NOT a parse-that ask for M |

---

## Scope

Each S-clause is a concrete, falsifiable deliverable. The clauses span the FIVE
sibling-publish arms (A1–A5 above); each consumes a published parse-that cut +
records the consolidation — NONE a kf-local cure (the cures live in parse-that's
combinator core + value.js's grammar; inv-16). The arms fire INDEPENDENTLY on their
own tripwires; this wave does NOT require them to land atomically (unlike M.W8/M.W9's
single-commit form), because each parse-that cut publishes on parse-that's own cadence.

---

### S1 — Author `proof:deps-current` typesVersions-absent clause; consume PT.M1 (0.9.1) — A1

**Breach.** parse-that 0.9.0's published manifest declares
`"typesVersions": {"*":{"*":["dist/src/parse/index.d.ts"]}}` pointing at a path that
does NOT exist (`dist/src/` absent, verified). On a `moduleResolution: bundler` /
TS toolchain that prefers `typesVersions` over `exports`, this resolves types to a
dead path — a conflicting, broken resolution. The `exports["."].types`
(`./dist/index.d.ts`) already covers type resolution correctly; the `typesVersions`
field is pure dead weight + a resolution hazard. `proof:deps-current` today
(`scripts/proof-deps-current.mjs`, clauses FLOOR/PROTOCOL/REALM) has NO clause that
detects a stale-path `typesVersions` in any `@mkbabb/*` package.

**Cure (two parts).**
1. **Author the gate clause (gate-first, kf-internal — lands NOW, born-RED on
   0.9.0).** Add a `typesVersions-absent` clause to `proof-deps-current.mjs`: for
   every installed `@mkbabb/*` package, read its `node_modules/<pkg>/package.json`;
   if a `typesVersions` field is present, assert EVERY path it maps to EXISTS on
   disk relative to the package root — exit 1 on any non-existent target. The clause
   INVOKES the real installed manifest + a real `existsSync` on the mapped path
   (modeled on the existing FLOOR clause's installed-`version` read, not a source
   grep). Born-RED TODAY: parse-that 0.9.0's `dist/src/parse/index.d.ts` does not
   exist → exit 1.
2. **Consume PT.M1 (the GREEN condition).** On `@mkbabb/parse-that@0.9.1` publishing
   with the `typesVersions` field removed (and the CJS `require` audited per
   `KF-TO-PARSE-THAT-ASKS.md §4`), re-pin to admit 0.9.1 and re-lock. Note the
   transitive subtlety: after M.W9 deletes kf's DIRECT parse-that dep, kf no longer
   declares parse-that — the installed parse-that becomes value.js's NESTED copy.
   The gate must read whichever installed copy exists (kf-direct OR value.js-nested);
   the typesVersions-absent assertion holds against EITHER realm.

**Gate bite.** `node scripts/proof-deps-current.mjs` → the typesVersions-absent clause
exits 1 TODAY (parse-that 0.9.0 stale path), exits 0 after PT.M1 (0.9.1) is the
resolved cut. Wired into `proof:all` (the existing `proof:deps-current` is already in
the roster); the new clause rides every CI run.

---

### S2 — `proof:packrat-sound` gate-first (NEW); consume PT.M3 (re-key OR KILL) — A3

**Breach.** parse-that's packrat tier memoizes parse results keyed on `parser.id`
ALONE (`dist/parse.js:1239` `MEMO.get(p.id)`, `:1255` `MEMO.set(p.id, …)`, `:1267`
`mergeMemos` the same), though the `(id,offset)` composite key function `getCijKey`
EXISTS (`:1223`) and is used CORRECTLY for `LEFT_RECURSION_COUNTS` (`:1227`). The
id-only MEMO is latently unsound for the non-recursive same-parser-at-two-offsets
case (the source self-documents this). The tier is OFF the default parse path and has
ZERO production consumers — a measured, bounded, isolated defect.

**Cure (two parts).**
1. **Author the gate gate-first (kf-internal — lands NOW, born-RED on 0.9.0).**
   `scripts/proof-packrat-sound.mjs` (does NOT exist today) INVOKES the installed
   parse-that's `memoize()`/packrat surface over a constructed same-parser-at-two-
   offsets fixture and asserts the SOUND result (the second-offset parse is NOT
   served the first-offset's memoized result). The gate must INVOKE the real
   installed parser — NOT a source grep, NOT a mock (the inv-M-observable-truth law:
   the gate bites the REAL unsound behavior, the wrong parse result, NOT the
   presence of the `MEMO.get(p.id)` string). Born-RED TODAY: the id-only key serves
   a stale cross-offset result → the assertion fails → exit 1.
2. **Consume PT.M3 — OR record the KILL.** PT.M3 is a fork (lane-20 §5, the KILL
   anti-charter `M.md §The KILL`):
   - **If parse-that ships the re-key** (`MEMO.get(getCijKey(p, state))` at the two
     lookup sites + `mergeMemos`; a one-line-class fix since `getCijKey` already
     exists): re-pin + the gate's sound-result assertion GREENs against the new cut.
   - **If the unsound tier is KILLED** (the M.md M.W10 row's "OR KILL the unsound
     tier (zero consumers — KILL candidate)"; deletion is sound because zero
     production consumers reach the packrat tier — kf's `memoize` at `utils.ts:10`
     is value.js's `memoize`, NOT parse-that's packrat, verified): the gate FLIPS to
     a KILL-RECORDED assertion — it asserts the packrat/`memoize` export is ABSENT
     from the installed parse-that surface (the unsound tier is gone), and the KILL
     is recorded in `PROGRESS.md §"Open deferrals"` (DLL-22 → KILL, the
     P-invariant-28 belt — DL-L9 packrat is a terminal-belt KILL per M.W14).

**Decision basis (which fork).** The KILL is the idiomatic-gestalt choice IF
value.js's recursive grammar (the `@container`/`@layer` typed-body walk, value.js O /
M.W11) does NOT opt into `memoize()`. The re-key is required IF value.js's recursive
group-rule parse WILL use the packrat tier (then it must be sound from day one,
lane-20 §5 PT.M3 ordering). This wave records the fork as a coordinated decision with
value.js O (M.W9/M.W11), defaulting to KILL absent a value.js opt-in (zero consumers →
delete the latent hazard rather than carry a fixed-but-unused tier).

**Gate bite.** `node scripts/proof-packrat-sound.mjs` → exit 1 TODAY (the id-only key
serves a stale cross-offset parse), exit 0 after PT.M3 (re-key makes the result sound,
OR KILL makes the tier absent and the gate asserts the absence). Wired into `proof:all`
report-all roster (NOT a blocking hygiene clause — it stays RED until PT.M3 publishes
and must never block CI on a green tree, the same posture lane-24 §3.3 sets for
`proof:css-parity`).

---

### S3 — `proof:replay-equality` permutation-shorthand arm; consume PT.M5 — A4

**Breach.** value.js's `animation:` shorthand parse is order-sensitive: a
non-canonical-order shorthand (e.g. `animation: ease-in 1s 0.5s infinite bounce` with
the duration/delay/easing/name in a permuted order) drops sub-values that fall in
non-canonical positions, because parse-that has no `permutation(...parsers)` combinator
for CSS `||` any-order semantics — value.js hand-rolls order-tolerance workarounds it
cannot fully cover. The `proof:replay-equality` fixture set has NO non-canonical-order
shorthand arm today.

**Cure (two parts).**
1. **Author the born-RED arm (kf-internal — lands NOW).** Add a non-canonical-order
   `animation:` shorthand fixture to the `proof:replay-equality` set; assert the
   parsed → re-serialized shorthand is replay-equal to the input (every sub-value
   preserved regardless of order). The arm INVOKES the installed value.js parse +
   serialize (the real round-trip, not a proxy). Born-RED TODAY: value.js drops the
   mis-positioned sub-values → the round-trip is not replay-equal → exit 1.
2. **Consume PT.M5 + value.js adoption (the GREEN condition).** PT.M5 ships
   `permutation(...parsers): Parser<Partial<[…]>>` — try each un-matched parser at the
   current offset, recurse with the matched one removed, succeed when ≥1 matched;
   zero-alloc over `ParserState` in the `any()`/`all()` discipline. value.js O then
   adopts it in its shorthand grammar, collapsing the hand-rolled order-tolerance.
   GREEN is a TWO-sibling green (parse-that PT.M5 + value.js O) — recorded as such; it
   does NOT green on the parse-that publish alone (lane-20 §5: "GREEN only after
   parse-that PT.M5 ships + value.js adopts").

**Gate bite.** `node scripts/proof-replay-equality.mjs` (the permutation arm) → exit 1
TODAY (the dropped sub-values), exit 0 after PT.M5 + value.js adoption. Report-all
roster (stays RED until both siblings land).

**Constraint (the coordination, not a kf-only green).** This arm's tripwire is BOTH
parse-that PT.M5 AND value.js O adopting `permutation`. Recording it as a parse-that-only
green would be an inv-ε overclaim — value.js owns the shorthand grammar that consumes
the combinator (lane-24 §2.2 Option B: value.js owns THE ONE CSS grammar).

---

### S4 — Record the Option B two-grammar consolidation (PT.M6 — the MAJOR that can lag) — A5

**Breach.** Two structural CSS grammars in the spine (lane-24 §2.3, lane-20 §4 P7) —
the KISS / no-redundant-grammar violation. parse-that's typed `cssParser`/`CssNode`/
`CssSelector`/`parseSelectorList`/`parseMediaQueryList`/specificity surface is a
published root export that NO constellation member consumes (kf reaches parse-that only
via the `any` combinator at `utils.ts:1`, never `cssParser`; value.js uses only the
low-level combinators). value.js re-implements the structural shell (the weaker
`selectorListText`/`balancedText` over opaque bodies) and that copy is the consumed one.

**Cure (record the coordination — the structural retirement can lag indefinitely).**
PT.M6 is a parse-that MAJOR that DELETES the structural CSS grammar (`cssParser`,
`CssNode`, the selector/media-query parsers, the typed at-rule nodes) while RETAINING
the value readers (`parseSingleValue`/`parseFunctionArgs`) that value.js O's
`parseCSSSubValue` consumes. This wave records:
1. **The prerequisite chain (lane-20 §5 PT.M6, §7).** PT.M6 MUST follow: (a) value.js
   O ships `parseCSSSubValue` consuming the value readers — so they have an active
   consumer before the structural layer's deletion removes other CSS surface; (b) kf
   re-pins + deletes its direct parse-that dep (M.W9 / S9) — confirming the only kf
   parse-that edge is via value.js. After (a)+(b), the deletion breaks nothing live.
2. **The lag is correct (zero urgency).** No constellation member consumes `cssParser`
   today — the MAJOR can ship after value.js O + the kf re-pin complete, on parse-that's
   own cadence, by one or more tranches. The grammar redundancy is the design
   violation; the deletion is the cleanup (lane-20 §3, lane-24 §4).
3. **The consolidation spine.** After M.W9's dep-delete + PT.M6: the spine is
   `parse-that (combinators + value readers) → value.js (THE ONE typed CSS grammar) →
   kf (animation engine)` — acyclic, published-only, one-consumer-per-layer, ONE CSS
   grammar.

**Gate bite.** `proof:boundary` (the W96 parse-that-scan AUTHORED IN M.W9) stays GREEN
after PT.M6 (it already asserts zero `@mkbabb/parse-that` imports in `src/animation/`
after M.W9's consume — PT.M6's structural deletion does not re-introduce any). This
wave authors NO new gate for S4 — the structural retirement's kf-side proof is the
M.W9-authored boundary scan staying green; the consolidation itself is a parse-that
+ value.js coordination recorded in `PROGRESS.md §"Open deferrals"` (DLL-27 parse-that
portion). The non-existence of a kf gate is CORRECT: PT.M6 has no kf-visible behavior
change (nothing kf consumes `cssParser`), so there is no REAL kf observable to bite —
and inv-M-observable-truth FORBIDS authoring a proxy gate over a non-observable.

---

### S5 — PT.M2 value-reader API-stability confirm (no kf code; the produce-and-consume seam) — A2

**Breach.** parse-that's `parseSingleValue`/`parseFunctionArgs` shipped in 0.9.0 (the
produce-half) but have NO consumer — value.js O adopting them in `parseCSSSubValue` is
the consume-half (PENDING). This is the produce-and-consume-land-together precept
violation (lane-20 §4 P6): a published API with no consumer is unproven surface.

**Cure (a confirmation, NOT a code change — lane-20 §5 PT.M2).** Record that the 0.9.0
value-reader signatures (`parseSingleValue(state)`/`parseFunctionArgs(state)`, operating
on `ParserState<unknown>` directly) are STABLE for value.js O adoption — no planned
breaking change before value.js ships `parseCSSSubValue`. The ground-truth that
strengthens this (lane-20 §2): the value readers bypass the cross-realm `Parser<T>`
nominal-type barrier entirely (they mutate `ParserState` directly), so value.js adopts
them WITHOUT the `(parseAny as any)` cast hack kf currently carries at `utils.ts:241`.
The kf-side consequence is M.W9's territory: when value.js O ships `parseCSSSubValue`
over these readers, M.W9 deletes `utils.ts:1` + the dep and `proof:boundary` (W96)
greens. This S-clause is the COORDINATION record (the dispatch confirmation in
`KF-TO-PARSE-THAT-ASKS.md §2` / `KF-TO-VALUEJS-O-ASKS.md §8`), not a kf gate.

**Gate bite.** No NEW kf gate — the produce-and-consume seam closes via M.W9's S9 arm
(`proof:workaround-deletion S9` + `proof:boundary` W96), both value.js-track. This
clause exists so the parse-that-track wave records the PT.M2 confirmation explicitly
(zero-drop honesty); authoring a kf gate over PT.M2 alone would be a proxy (the real
observable — the dep delete — is M.W9's, gated on value.js, not parse-that).

---

## Born-RED gate

**Gates:** `proof:packrat-sound` (NEW — authored gate-first in S2, born-RED on 0.9.0)
AND the `typesVersions-absent` clause of `proof:deps-current` (EXTENDED in S1, born-RED
on 0.9.0) AND the `permutation`-shorthand arm of `proof:replay-equality` (EXTENDED in
S3, born-RED on first author). The S4 structural retirement and S5 produce-consume
confirm have NO new gate — their kf-side proof is the M.W9-authored `proof:boundary`
W96 scan staying green (S4) / M.W9's S9 arm (S5), because PT.M6/PT.M2 have no REAL
kf-visible observable to bite (inv-M-observable-truth FORBIDS a proxy gate over a
non-observable).

**The REAL observable (inv-M-observable-truth).** Each authored gate INVOKES the real
installed artifact and bites the GENUINE defect — never a source-shape proxy. The
keystone discipline (the L.W1 S4 lesson: the gate tested no-throw + string round-trip
while the REAL breach was NaN frame-times) is applied to each arm:

| Gate / clause | Witness on today's tree (parse-that 0.9.0) | Failure mode today (the REAL observable) | Expected after the parse-that consume |
|---------------|--------------------------------------------|------------------------------------------|----------------------------------------|
| S1 `proof:deps-current` typesVersions-absent | the installed manifest read + `existsSync` on the mapped path | the `typesVersions` maps to `dist/src/parse/index.d.ts` which does NOT exist on disk — a real type-resolution hazard on `moduleResolution: bundler`, NOT a string in a manifest | exit 0 — PT.M1 (0.9.1) removed the field; OR (post-M.W9) the value.js-nested parse-that resolves without the stale field |
| S2 `proof:packrat-sound` | the installed `memoize()` INVOKED over a same-parser-at-two-offsets fixture | the id-only MEMO serves the FIRST offset's parse result for the SECOND offset — a WRONG parse value, the latent unsoundness ACTUATED (not the `MEMO.get(p.id)` source string) | exit 0 — re-key (`getCijKey`) makes the cross-offset parse correct; OR KILL makes the tier absent and the gate asserts the absence |
| S3 `proof:replay-equality` permutation-shorthand | the installed value.js parse → serialize INVOKED over a non-canonical-order `animation:` shorthand | sub-values in mis-canonical positions are DROPPED — the re-serialized shorthand is NOT replay-equal (a real lossy round-trip, not the absence of a `permutation` export) | exit 0 — PT.M5 + value.js adoption preserve every sub-value regardless of order (a TWO-sibling green) |

**Born-RED kf-side TODAY (the keystone).** S1's clause reds against the installed
parse-that 0.9.0 stale `typesVersions` (verified: the field is present, `dist/src/` is
absent). S2's gate reds because the installed packrat MEMO is id-only (verified:
`dist/parse.js:1239,1251,1255,1267`). S3's arm reds because value.js's shorthand parse
is order-sensitive. Each RED is the GENUINE defect ACTUATED through the real installed
artifact, NOT a proxy: S1 does an `existsSync` on the real mapped path, S2 INVOKES the
real `memoize`, S3 INVOKES the real value.js round-trip.

**Green condition (arm-by-arm, NOT atomic).** Each arm greens on its own
sibling-publish tripwire: S1 on `@mkbabb/parse-that@0.9.1` (PT.M1); S2 on PT.M3 (re-key
OR KILL); S3 on PT.M5 + value.js O adoption; S4 on the PT.M6 MAJOR (post-M.W9
dep-delete, `proof:boundary` stays green); S5 via M.W9's S9 (value.js O
`parseCSSSubValue`). This wave does NOT collapse to one commit — parse-that ships its
cuts on its own cadence (PT.M1 FIRST, lowest-risk; PT.M3/PT.M5 independent; PT.M6 lags).

---

## Dependencies

- **parse-that 0.9.1+ — the per-arm blocking HANDOFFs (ordered).** kf cannot write
  parse-that source (inv-16), so each cure is a parse-that publish kf consumes. The
  cadence (lane-20 §7, `KF-TO-PARSE-THAT-ASKS.md §8`):
  - **PT.M1 (`0.9.1` patch) ships FIRST** — `package.json`-only (typesVersions removal
    + CJS audit), lowest-risk; the clean publish-posture precondition for the soundness
    fix. Registry state verified this session: `@mkbabb/parse-that@0.9.1` → **E404**
    (the A1 tripwire — unfired).
  - **PT.M3 (packrat re-key OR KILL)** — after PT.M1; the fork is decided coordinated
    with value.js O (re-key IF value.js's recursive grammar opts into `memoize()`;
    KILL otherwise, the default given zero consumers).
  - **PT.M5 (`permutation`)** — independent of PT.M3 (different source file); greens
    only with value.js O adoption.
  - **PT.M6 (MAJOR — structural retirement)** — lags ALL of the above; REQUIRES value.js
    O `parseCSSSubValue` published + M.W9's kf dep-delete done.
- **value.js Tranche O 0.14.0 — the coordination peer (M.W9).** Two seams couple to
  value.js, NOT parse-that: (a) the direct parse-that dep delete (S9, M.W9) greens on
  value.js O's `parseCSSSubValue` (VJ-L3), because the value readers cross no realm
  boundary; (b) the `permutation`-shorthand green (S3) requires value.js adopting the
  combinator. This wave is parse-that-track; M.W9 is value.js-track; they are ordered
  but fire on separate publishes (lane-20 §7, lane-26 §6).
- **NO `file:` / `link:` / `git:` pin, NO `overrides`, NO vendored combinator.** The
  constellation spine law (`CLAUDE.md §Dependencies`, inv-L-acyclic-purity) is
  absolute — every consume is a published-registry re-pin (`proof:deps-current`
  PROTOCOL clause enforces it).
- **Couples to M.W9 (the value.js consume), not collides.** M.W9 owns S7/S8/S9 (the
  value.js-track workaround deletes) + the `proof:boundary` W96 scan authoring; M.W10
  owns the parse-that cuts (PT.M1/M3/M5/M6) + the two NEW gates (`proof:packrat-sound`,
  the typesVersions-absent clause). No file collision on the GATE side
  (`proof-packrat-sound.mjs` new; `proof-deps-current.mjs` extended with a clause
  disjoint from M.W9's edits). On the CONSUME side, M.W9's dep-delete is the
  PREREQUISITE for M.W10's S4 (PT.M6), so M.W9 SEQUENCES BEFORE M.W10-S4.
- **Independent of every Band-A wave** (the runner/lint/browser/clock — M.W1–W4) and
  the Band-B kf-internal correctness waves (M.W5–W7). Composes with M.W1's report-all
  runner (the parse-that-track reds report alongside the value.js-track + the css-parity
  reds in one pass) but does not require it.

---

## Bite — what regression each clause catches

| Clause | Regression it prevents |
|--------|------------------------|
| S1 typesVersions-absent | A constellation package re-creeps a stale-path `typesVersions` (the parse-that 0.9.0 defect re-introduced, OR a NEW one in value.js/glass-ui) — a silent type-resolution hazard on `moduleResolution: bundler` that the FLOOR/PROTOCOL clauses don't see; the gate catches the broken manifest at install time, not at a downstream consumer's `tsc` failure |
| S2 `proof:packrat-sound` | The packrat MEMO regresses to an id-only key (the latent cross-offset unsoundness re-actuated), OR — if KILLed — the unsound tier is re-introduced with zero consumers; the gate INVOKES the real `memoize` so it catches the WRONG parse result, not merely a source string, and pins the KILL-or-fix decision to a real observable |
| S3 permutation-shorthand | value.js's `animation:` shorthand parse drops sub-values in non-canonical order (a lossy round-trip the canonical-order fixtures miss); the arm catches the real replay-equality breach on permuted shorthands and locks the value.js+parse-that coordination (it cannot green on a parse-that-only publish — guarding against an inv-ε overclaim) |
| S4 Option B consolidation | The two-grammar redundancy survives past the value.js-O grammar totality (the KISS violation carried forward), OR PT.M6 ships BEFORE the prerequisite chain (value.js `parseCSSSubValue` + kf dep-delete) and breaks a live consumer; the recorded prerequisite chain + the M.W9 boundary-scan staying green catch a premature or skipped retirement |
| S5 PT.M2 confirm | The value-reader signatures drift before value.js O adopts them (a produce-without-consume API breaking under its sole future consumer); the coordination record + M.W9's S9 arm catch a signature change that would strand value.js's `parseCSSSubValue` adoption |

---

## Excluded from this wave

- **The direct parse-that dep + import delete (S9), the `linear()` regex (S7), the
  `FN_NAME` Symbol (S8), the `lerpArray`→`./math` swap, and the `proof:boundary` W96
  parse-that-scan authoring** — all **value.js-track, gated on value.js 0.14.0**, are
  **M.W9** (lane-26 §6 Track B, the M.md M.W9 row). M.W10 is the parse-that-CUT-track.
  The S9 delete greens on value.js O's `parseCSSSubValue` — a value.js publish, NOT a
  parse-that one (lane-20 §2: the value readers cross no realm boundary, so value.js
  adopts them, and kf deletes the `any` import against that value.js cut). M.W10
  consumes the parse-that cuts that make value.js's grammar correct; M.W9 retires kf's
  direct parse-that edge.
- **The `proof:css-parity` capability matrix + the value.js-O grammar totality (nesting,
  url, `@container`/`@layer`, bare-gradient, env, system-color)** — that is **M.W11**
  (Band A gate-first now + the coordinated value.js+parse-that grammar close; lane-24
  §3/§4). M.W10's permutation arm (S3) is the SHORTHAND slice of the coordinated grammar;
  the full CSS-parity matrix is M.W11's.
- **The `dispatch()` non-ASCII Map fallback (PT.M4)** — deferred as DLL-50 (a BOOK; the
  `proof:replay-equality` non-ASCII-ident arm is not yet authored, lane-20 §6). It rides
  parse-that PT.M4 + value.js's ident grammar widening, both later than the M.W10 arms;
  recorded in `PROGRESS.md §"Open deferrals"`, not authored as an M.W10 S-clause (the
  M.md M.W10 row names PT.M1/M2/M3/M5, not M4).
- **The W100 incremental/streaming parse** — KILL re-affirmed (no parse-that `Span`/`loc`;
  sub-ms full reparse inside the 300ms editor debounce; lane-24 §5, `M.md §The KILL`).
  A BOOK-with-tripwire (the 500-keyframe re-parse bench exceeding 300ms on the CI Linux
  runner) in `PROGRESS.md §"Open deferrals"` — no parse-that ask, no code, until that
  bench reds.
- **DL-L9 packrat → KILL as a terminal-belt EXIT** — the P-invariant-28 terminal-belt
  disposition of the packrat handoff is **M.W14** (the unsound tier KILL recorded as a
  belt exit; lane-25, the M.md M.W14 row). M.W10's S2 fork (re-key OR KILL) DECIDES the
  technical disposition; M.W14 RECORDS it as the terminal-belt exit. They are the same
  decision viewed from the consume-wave (M.W10) and the chronic-ledger-terminal (M.W14).
- **The 5.0.0 version cut + npm publish + the deploy** — USER-DOMAIN / M.WZ. This wave's
  arms green on sibling publishes independently of the release cut.
