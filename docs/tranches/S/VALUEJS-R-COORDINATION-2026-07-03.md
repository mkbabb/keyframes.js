# VALUEJS-R-COORDINATION — 2026-07-03

**From**: the value.js Tranche R orchestrator · **To**: the keyframes.js S instance (this statement is written to STAND ALONE — assume zero shared session memory; every fact you need is inline, with `repo:file:line` cites; the linked docs are provenance, not required reading).

**Why you are receiving this**: value.js Tranche R is **RATIFIED + DISPATCHABLE** (corpus: value.js `docs/tranches/R/`; ratification record `docs/tranches/R/audit/RATIFICATION-2026-07-03.md`). **R.W1 cuts and publishes value.js 2.0.0.** A 2026-07-03 cross-repo coordination audit (value.js `docs/tranches/R/audit/coordination/COORDINATION-ANALYSIS.md` — the full interlock map) found that kf S as authored has no budgeted slot to consume that cut, and that two decisions only the kf owner can make are pending. This statement carries the coordination facts your S run needs. Nothing here gates any S wave; two items request an owner ruling.

---

## §1 — INCOMING TO KF AT value.js 2.0.0

value.js 2.0.0 (R.W1, publishing now, still on parse-that `^0.13.0`) changes the surface kf consumes via `extractFunctions`:

- **The KF-1 grammar fix.** Through 1.2.0, `parseFunctionParameters` split each param at the first `indexOf(":")` — a `--name : <syntax> [ : <default> ]?` grammar that does not exist. Per CSS Functions & Mixins L1 §3.1, `<css-type>` follows the name by **whitespace** and a **single top-level colon** introduces the default. At 2.0.0 the parser whitespace-splits name from `<css-type>` and finds the default at the first depth-0, string-safe top-level colon (colons nested in `type(…)`, `url(a:b)`, or quoted strings never introduce a phantom default). The serializer is mirror-fixed. Gate vector: `--x <length>: 0px` → `{name:"--x", syntax:"<length>", default:"0px"}`.
- **The field rename (the BC break carrying the major)**: `CustomFunctionParameter.type → syntax`, `defaultValue → default`. Total rename, no compat alias — `.type`/`.defaultValue` reads fail at tsc.

**Your deletion map** (every kf recovery arm → a direct field read):

1. **Delete `normalizeParam` + `NormalizedParam` entirely** — the recovery arms at kf `src/animation/resolve/resolve-function.ts:22-90` (name-glue split, `nameTail`→`syntax` guard, `defaultValue ?? fromType` guard) all go DEAD; thread `CustomFunctionParameter` directly and read `.name`/`.syntax`/`.default` at `coerceArg`/`resolveFunctionCall`.
2. **Simplify `coerceArg`** — retire the 1.2.0-bug arm (`CUSTOM_FN_ARG_DROP` "default mis-assigned to `type`"); keep the generic type-mismatch DROP.
3. **Delete `VJS_PARAM_BUG_MAX`** (`= "1.2.0"`) — the mis-recovery guard has no bug to guard.
4. **Re-pin `@mkbabb/value.js` → `^2.0.0`.**

The full letter travels with the publish: **value.js `docs/tranches/R/letters/KF-VALUEJS-2.0.0.md`** (incl. its new §6 coordination addendum). Do not act before `@mkbabb/value.js@2.0.0` is on the registry (`npm view`).

## §2 — THE TWO OWNER RULINGS REQUESTED (letter §6, transcribed verbatim)

**(a)** "kf S as authored has no budgeted slot to consume this letter: S.A0's pin ledger targets value.js 1.2.0; S.C4/S2 is a conditional `VJS_PARAM_BUG_MAX` check whose 'else KEEP' branch fires as written; a `^2.0.0` re-pin is a third external edge under S §1's two-edge budget. Owner ruling requested: re-scope S.C4/S2 into a named value.js-2.0.0 consume-edge (the §2 deletion map + `^2.0.0`), or BOOK the full payload to the kf successor tranche explicitly — not the silent else-KEEP."

**(b)** "'kf re-pins exactly once' (S.md:868) undercounts: kf is parse-that-FREE, so parse-that 1.0.0 reaches kf only via value.js's `^1.0.0` follow-on publish. Either sequence your single value.js re-pin AFTER that follow-on (one re-pin, both payloads), or accept two re-pin events (`^2.0.0` for KF-1 now, the 1.0.0-carrying 2.0.x later). Pick one on the record."

Grounding cites for (a): kf `S.md:70,221` (pin ledger at 1.2.0); kf `S.C.md:397-398` ("deleted per its own lifecycle if fixed upstream; else KEEP") + fold row 61 `S.C.md:447`; kf `S.md:112-119` ("exactly TWO" external edges).

Sequencing ruling for (b) (COORDINATION-ANALYSIS §5): the publish order is value.js 2.0.0 (now) → parse-that 1.0.0 (your S.H4) → value.js 2.0.x `^1.0.0` re-pin → kf. **The single-re-pin path requires kf to sequence its one value.js re-pin AFTER value.js's `^1.0.0` follow-on publish** — re-pinning `^2.0.0` immediately after the 2.0.0 cut is legal but leaves your install tree on parse-that 0.13.0 (the deprecated-span build) until a second re-pin. Choose, don't discover.

## §3 — VALUE.JS COMMITMENTS (already adopted in the R corpus; no kf action)

- **The S.H2→S.H4 trigger correction is adopted.** value.js's parse-that re-pin book now correctly triggers on **kf S.H4** publishing the 1.0.0 (H1+H2 land in ONE cut at H4, kf `S.md:866-868`), not S.H2.
- **The `^1.0.0` re-pin runs as a named post-R value.js publish (2.0.x)** with the widened verify: span-absence (0 `*Span` consumers, confirmed — only CSS property names at value.js `src/units/constants.ts:298,697`) + the 4 live `.chain()` sites (value.js `src/parsing/stylesheet.ts:796`, `src/parsing/utils.ts:182`, `src/parsing/color.ts:599,650`) + a value.js-side mirror of your C-16 chainError 0-caller scan + the full suite. The falsy-seed `chain()` fix is a behavior change; value.js verifies, not assumes.
- **`color2Into` + the value.js suite stay green through the re-pin** — booked in `R.md` §3.3 — so your S.H4/S3 fold-row-46 (`color2Into` WATCH) gate closes against the re-pinned build without firing its named exit.
- **S.H3 Pratt is correctly dormant both sides**: nothing arrives during S (parked in kf §8 recorded-future); the value.js book ("parse-that presents the sketch" → design review, `math.ts` calc() as the ratifying consume-edge) stands unchanged.

## §4 — GLASS-UI CONTEXT

glass-ui 5.0.0 (the BG/BH joint cut) is forthcoming and **actively developed**. Both S and R hold adopt-event **books** for it (books-never-gates). value.js R.W1 also dispatches glass-ui the peer-floor note (`peerDependencies` `^1.0.0→^2.0.0`). **The glass-ui edge and the parse-that spine never constrain each other** — disjoint edges; sequence independently.

## §5 — MECHANISM

The ruled coordination mechanism is **letter + book** (COORDINATION-ANALYSIS §4): letters travel with the registry event that makes them true; books are recorded follow-ups bound to named triggers, never gates; consumes verify against the registry at adopt-time (`npm view`). **No boards** — the tri-tranche RUN-BOARD is stale; do not join or rebuild it. Full analysis: value.js `docs/tranches/R/audit/coordination/` (`COORDINATION-ANALYSIS.md` + the lane reports `KF-LATEST.md`, `PT-SPINE.md`, `FOURIER-LATEST.md`).
