# KF letter — value.js 2.0.0: the KF-1 grammar fix + rename lands; `normalizeParam` becomes deletable

**From**: value.js tranche R (R.W1, the 2.0.0 cut) · **To**: keyframes.js (current tranche head; the S7-lifecycle owner)
**Dispatch trigger**: the R.W1 **2.0.0 publish** — this letter travels with the cut (do not act on it before `@mkbabb/value.js@2.0.0` is on the registry).
**Spec of record (value.js-side)**: `docs/tranches/R/audit/pass2/kf1-grammar.md` (the prototyped fix + the kf recovery-case map, §5) · `SYNTHESIS-v2.md §9` (the full slate) · `PASS3-VERDICT.md §1` (the 5-file head-truth amendment).
**This letter is self-contained** — everything kf needs is below; the citations are provenance, not required reading.

> AMENDED-2026-07-03 — §4 KF-2 row retargeted S.H2→**S.H4** with widened verify, and a **§6
> coordination addendum** added, per `docs/tranches/R/audit/coordination/COORDINATION-ANALYSIS.md`
> §3.2 items 1 + 4 (kf-owner-facing flags; the letter body §1–§5 is unchanged ratified substance).

---

## §1 — What 2.0.0 changes on the surface kf consumes

The `extractFunctions` param descriptor (`CustomFunctionParameter`) is **fixed and renamed** in one major:

**(A) The grammar BUG is fixed.** Through 1.2.0, `parseFunctionParameters` split each param at the first `indexOf(":")` — assuming a `--name : <syntax> [ : <default> ]?` grammar **that does not exist**. Per CSS Functions & Mixins L1 §3.1, `<css-type>` follows the name by **whitespace** and a **single top-level colon** introduces the default. Fed the spec form `--x <length>: 0px`, 1.2.0 emitted garbage (`{name:"--x <length>", type:"0px"}`) — the mis-split your `normalizeParam` shim exists to repair (your own ground-truth comment at `src/animation/resolve/resolve-function.ts:46-51` reproduces it exactly). At 2.0.0 the parser whitespace-splits name from `<css-type>` and finds the default at the first **depth-0, string-safe** top-level colon (so colons nested in `type(…)`, `url(a:b)`, or quoted strings never introduce a phantom default). The serializer is mirror-fixed to emit `name <syntax>: <default>` (it previously emitted the same two-colon garbage, which is why round-trips looked green — a self-consistent garbage loop).

**(B) The descriptor fields are renamed** — the true BC break carrying the major:

```ts
// @mkbabb/value.js@2.0.0 (root barrel + the /parsing subpath)
export type CustomFunctionParameter = {
    name: string;      // the <dashed-ident>, e.g. "--x"
    syntax?: string;   // the <css-type> declaration, VERBATIM, e.g. "<length>" or "type(<length>)"
    default?: string;  // the optional default value, VERBATIM
};
```

(`type→syntax`, `defaultValue→default` — aligned with `@property`'s `syntax` vocabulary.)

**The binding gate vector** (green in value.js's suite, with 7 further adversarial vectors incl. comma-nested `var(--y, 1px)` defaults and `type(<length>)` notation):

```
--x <length>: 0px  →  {name:"--x", syntax:"<length>", default:"0px"}
```

## §2 — KF-1: your deletion map (every recovery arm → a direct field read)

With value.js emitting clean split fields, every recovery case in `normalizeParam` (`src/animation/resolve/resolve-function.ts:69-92`) dies (the case map, kf1-grammar §5):

| kf recovery mechanism (the 1.2.0 shim) | line | disposition under 2.0.0 |
|---|---|---|
| name-glue split (`rawName.search(/\s/)` → `ident` + `nameTail`) | `:70-75` | **DEAD** — `param.name` is already the clean `<dashed-ident>` |
| `nameTail`→`syntax` with the `<…>` guard | `:76-80` | **DEAD** — `param.syntax` is a dedicated field |
| default = `defaultValue ?? fromType`, with the "`type` is-a-`<syntax>`" guard | `:81-90` | **DEAD** — `param.default` is a dedicated field; `.type` no longer exists |
| `coerceArg`'s FAIL-EXPLICIT bug arm → `CUSTOM_FN_ARG_DROP` ("default mis-assigned to `type`, failed to parse") | `resolve-function.ts:122-135` | **the bug arm goes dead** — `param.default` now parses because it is the actual default string, not a mis-landed `<syntax>` token. The **generic** DROP-on-mismatch path stays (a real type-mismatch with no default still DROPs) |
| `VJS_PARAM_BUG_MAX = "1.2.0"` version assertion | `:35` | **DELETE** — the mis-recovery guard has no bug to guard |

**The ask (the S7 lifecycle completes — upstream fix → kf consume → delete):**

1. **Delete `normalizeParam` + `NormalizedParam` entirely** and thread `CustomFunctionParameter` directly — read `.name`/`.syntax`/`.default` at `coerceArg`/`resolveFunctionCall` (`:111-136`, `:189-`, and the `.map(normalizeParam)` at `:205`). (The 1:1 rename-adapter middle state is legal but pointless — the clean thread is the same diff.)
2. **Simplify `coerceArg`** — retire the 1.2.0-bug arm; keep the generic type-mismatch DROP.
3. **Delete `VJS_PARAM_BUG_MAX`.**
4. **Re-pin `@mkbabb/value.js` → `^2.0.0`.**

This gate ("kf deletes `normalizeParam` and re-pins") was **unreachable** under a rename-only cut — the shim compensates for the mis-split, not the field names. It is reachable now; that is why the grammar fix and the rename ship together as one honest major (the keyframes-2.2.0 semver lesson, applied by its victim).

## §3 — KF-1b: the `extractFunctions` `.d.ts` note (no kf action)

The pass-2 "`extractFunctions` is dist-only, a fresh build drops it" finding was **FALSE** — a stale-worktree artifact (the measuring lane sat at 1.0.2). The symbol is in committed source since 1.1.0: `src/parsing/extract.ts:124`, re-exported at `src/index.ts:315` + `src/subpaths/parsing.ts:47`; a fresh build keeps it. value.js landed a fresh-build `.d.ts` regression assertion at R.W1 as a lock against future barrel drift. **Your consumed symbol is safe; the `^2.0.0` re-pin resolves everything in this letter.**

## §4 — The standing slate (KF-2..KF-6, verbatim from SYNTHESIS-v2 §9 — books + records; a book is a recorded follow-up bound to a named trigger, never a gate; no immediate kf action)

| # | Item | R action |
|---|---|---|
| KF-2 | parse-that `^0.13.0` pin | Current — no action. Book the `^1.0.0` re-pin on kf **S.H4**'s cut (H1+H2 land in one 1.0.0 publish). Verify at re-pin = span-absence (0 `*Span` consumers) **+ the 4 `.chain()` sites** (`stylesheet.ts:831`, `parsing/utils.ts:182`, `color.ts:600,651` — the stylesheet + color line refs shifted at 2.0.0's KF-1 grammar rewrite); 1.0.0 also retires `chainError` (value.js passes 0) and FIXES `chain()` falsy-seed semantics (value.js seeds non-falsy — verify, don't assume). Wait, don't pre-pin. |
| KF-3 | glass-ui `/easing` × 5 value.js exports | Export-stability guard test at R.W1 (value.js-side: `CSSCubicBezier`, `steppedEase`, `bezierPresets`, `jumpTerms`, `parseSteps`); recorded as a standing contract in the glass-ui relay letter (§8.6). |
| KF-4 | `/math` subpath importmap sensitivity (kf DM-13) | RELEASE.md doc line at R.W0 (W0-8/W0-12): the `/math` leaf is a load-bearing externalization target — keyframes' dist imports `clamp`/`lerpArray`/`scale` from it; it must never break; non-npm hosts must map it. The R.W2 boot cure exists precisely because this consumer is live. (Your devDep standing in value.js's demo graph is KEPT + recorded — the "phantom devDep" claim is refuted.) |
| KF-5 | parse-that S.H1 packrat-arming | No action — transparent GC win inherited at the next re-pin. |
| KF-6 | parse-that S.H3 Pratt combinator | Booked design review (value.js §3.3); value.js's `math.ts` calc() is the ratifying consume-edge. |

Your own R8-19 BOOKs (MCI-5 pad, P3-keyframe, light-dark per-target) carry unchanged, kf-owned — named here only so this letter is the complete cross-repo picture.

## §5 — Verification kf can run at consume time

- The §1 gate vector, against the installed 2.0.0: `extractFunctions("@function --f(--x <length>: 0px) {…}")` → params `[{name:"--x", syntax:"<length>", default:"0px"}]`.
- `.type`/`.defaultValue` reads fail at the type boundary (tsc) — the rename is total; there is no compat alias (NO-legacy: the record-as-canonical fallback was struck on the record — it would have canonized a spec-violating parse and frozen your shim forever).
- Round-trip: `parse(serialize(parse(x))) == parse(x)` now holds on the **correct** grammar.

## §6 — Coordination addendum (kf-owner-facing; flags, not acts)

Two coordination facts the value.js R audit surfaced that only the kf owner can rule on. This
section **flags**, it does not act — value.js writes no kf-tree file; the ruling is yours at S
impl authorization. (Source: `docs/tranches/R/audit/coordination/COORDINATION-ANALYSIS.md`
§3.2 item 4 + §1.2 E2/E16 + §5.)

**(a) kf S as authored has no budgeted slot to consume this letter.** S.A0's pin ledger targets
value.js **1.2.0** (S.md:70,221); S.C4/S2 is a conditional `VJS_PARAM_BUG_MAX` check whose "else
KEEP" branch fires as written (S.C.md:397-398, fold row 61 at S.C.md:447); and a `^2.0.0` re-pin
is a **third** external edge under S §1's declared **two**-edge budget (S.md:112-119). If left
as-is, `normalizeParam` + `NormalizedParam` + `VJS_PARAM_BUG_MAX` persist another kf tranche and
this letter's §2 deletion map goes unread. **Owner ruling requested**: re-scope S.C4/S2 into a
named value.js-2.0.0 consume-edge (the §2 deletion map + `^2.0.0`), **or** BOOK the full payload
to the kf successor tranche explicitly — **not** the silent else-KEEP.

**(b) "kf re-pins exactly once" (S.md:868) undercounts.** kf is parse-that-**FREE** (its deps =
value.js `^1.2.0` only; parse-that arrives only transitively via value.js), so parse-that 1.0.0
reaches kf **only via value.js's `^1.0.0` follow-on publish** (the post-R 2.0.x re-pin, §4 KF-2).
KF-1 (`^2.0.0`) and the parse-that-1.0.0 delivery are therefore **two distinct value.js versions**
unless kf deliberately sequences its single re-pin after the follow-on. **Owner ruling
requested**: either sequence your single value.js re-pin **AFTER** that follow-on (one re-pin,
both payloads), **or** accept **two** re-pin events (`^2.0.0` for KF-1 now, the 1.0.0-carrying
2.0.x later). Pick one on the record.
