# SKEPTIC A (Fable seat) — report: archaeology / parsing / performance / color

Posture: draft guilty until evidenced. Read-only across value.js, parse-that,
bbnf-lang, keyframes.js (+ keyframes-v-exec). All cites verified on disk today
(value.js HEAD `2c772824`, tranche V; parse-that `@mkbabb/parse-that@1.0.0`).

Headline: the draft's parser archaeology is **attached to the wrong artifact**,
and its color rows **miss a live capability regression**. Specifics below.

---

## G1 — "custom parser was a MEASURED byte-scanner decision; tape is genuinely new"
**VERDICT: AMENDED (core archaeology true; three misattributions fatal to the framing).**

- SpanParser V8 falsification is REAL and CONFIRMED:
  `parse-that/docs/future-research.md:71,83-90` — tagged `callSpan` switch-dispatch
  measured **10–14% SLOWER** than closure-span across three workloads, adversarial
  re-run −14%; §7:92-99 KILLED (Tranche B.W0, zero constellation consumers). The
  "jump-table speedup premise does not transfer from Rust to V8/TS." Good grounding.

- BUT "perf via dispatch()+byte-scanners" describes the O.W6 parser at
  `src/parsing/index.ts`/`stylesheet.ts` (`docs/tranches/O/waves/O.W6.md:32-63`,
  scanIdentFast/scanNumberFast/`dispatch()`). **That tree was RETIRED at v4**:
  `git 164343c1 "feat(v4)!: … retire pre-v4 src trees"`. The EXTANT parser is
  `src/css/grammar.ts` (483 L) + `stylesheet.ts` (899 L), which is **regex +
  char-split, NOT byte-scanner**: `grep charCodeAt|dispatch(|scanIdent|scanNumber`
  over `src/css/*.ts` → **0 hits**; grammar.ts has **24 regex** sites; tokenizing is
  `splitTopLevel`/`splitValueTokens` (`grammar.ts:63-126`, `string[i]` loops with
  `/\s/.test(char)`). The byte-scanner perf pedigree does **not** attach to the
  parser the owner calls "unreadable." The extant parser is an UNMEASURED regex
  rewrite; O.W6's numbers bound a deleted tree.

- "tape adoption … genuinely new" lever: **REFUTED / INVERTED.**
  (a) parse-that TS has **no tape**: `grep tape typescript/parse` → 0 hits;
  future-research.md:183-189/202-203 lists a JSON "Tape/Event Output Mode" as an
  *unbuilt future* idea and states the cut is "combinator-tier only — **no
  bbnf-lang / grammar-DSL work**." (b) In bbnf-lang, "tape" is a **Rust runtime that
  was DELETED as slower**: `bbnf-lang/docs/GESTALT.md:48` ("simdjson's tape … was a
  proof of shape regularity, not the final surface … `crates/tape/` deleted");
  `HARDENING-PLAN-PROMPT.md:34` ("Tape and its columnar variants are fully dead …
  direct-to-struct without tape is the demonstrably faster path. sonic-rs at 5 GB/s …
  beats AU's tape-era 1.97 GB/s by 2.5×"). The genuine parse-that TS perf lever is
  **"Immutable → Mutable ParserState, zero-alloc combinators"**
  (`parse-that/docs/perf-optimization-ts.md:55,457` `c1d7ea5`), not tape.

- "S9 parse-that dep removed" was **kf-side**, not value.js: O.W6.md:362-364 states
  value.js "does not import the parse-that CSS parser surface; it only studies the
  technique." Current `value.js/package.json` has no parse-that dep (deps = glass-ui
  ^7, keyframes.js ^6). Minor conflation, not load-bearing.

**AMENDMENT:** replace the G1 sentence "perf via dispatch()+byte-scanners; the
extant parser is that measured implementation" with: *"The measured byte-scanner
parser (O.W6, `src/parsing/`) was RETIRED at the v4 cut (`164343c1`). The extant
parser (`src/css/grammar.ts`) is an unmeasured regex/char-split rewrite. 'tape' is a
Rust bbnf-lang runtime deleted as slower than direct-to-struct — not a parse-that TS
lever; the real TS lever is mutable-ParserState/zero-alloc combinators. Any
re-adjudication baselines the REGEX parser, not a byte-scanner that no longer exists,
and cannot invoke tape as new evidence."*

---

## R2 — "bench-gate the extant BYTE-SCANNER parser vs parse-that-on-tape"
**VERDICT: AMENDED (sound gate instinct; two false predicates + status-quo bias).**

- "extant byte-scanner parser" is factually wrong (see G1): it is regex-based.
  The gate must baseline `src/css/grammar.ts`/`stylesheet.ts`.
- "parse-that-on-tape meets an owner-ratified threshold" — there is **no
  parse-that-on-tape**; the contest cannot be framed against a nonexistent build.
- **Status-quo smuggle:** R2 presumes the incumbent is the fast measured
  byte-scanner and parse-that must clear it. In reality the incumbent is an
  unmeasured regex rewrite that may be **slower than BOTH** a byte-scanner and
  parse-that. There is also **no parser perf bench in the current tree** (`bench/`
  carries none; the O.W6 `css-parse-perf.mjs` died with `src/parsing/`), so the
  baseline is greenfield — well-motivated, but not an "extension."
- **Readability is a false dichotomy the row leaves fused.** The "unreadable" charge
  has real merit for `grammar.ts:175-255` `parseFunctionalColor` — an 8-branch
  `if (lower === "x" && components.length === 3)` copy-chain — but that is curable by
  a **table/data-driven dispatch WITHOUT parse-that**. Perf and readability are
  independently satisfiable; the row should not let "adopt parse-that" ride in on the
  readability complaint.

**AMENDMENT:** "born-RED baseline of the extant **regex** parser (grammar.ts +
stylesheet.ts): MB/s + allocs via V8 heap-sampling on the real corpus. Candidates are
THREE, not two: (i) a table-driven regex/char-scan cleanup, (ii) a fresh byte-scanner
(the retired O.W6 technique, re-measured), (iii) parse-that combinators. tape is
excluded (deleted-as-slower). Adoption of any candidate is owner-ratified on measured
MB/s+allocs; readability is a separate, table-solvable axis. Cite the D7 falsification
as ruling out **runtime-switch SpanParser**, not as a defense of the regex incumbent."

---

## G2 — "value /css already owns keyframe-selector / animation-option grammar"
**VERDICT: CONFIRMED-WITH-EVIDENCE (framing of the two kf sites is imprecise).**

- ParseIssue union: `src/css/types.ts:10-19` — includes `keyframe_selector_invalid`,
  `animation_option_invalid`, `timeline_option_invalid` (8-code closed union).
- `parseTimingFunction` on /css: `grammar.ts:436` → `css/index.ts:42` →
  `subpaths/css.ts:53`. `parseKeyframeSelector` `grammar.ts:405`;
  `collectAnimationOptions` `stylesheet.ts:827`; timeline grammar `css/timeline.ts`.
- kf consumes ALL of it: `keyframes.js/src/animation/validate.ts:47`
  (`collectKeyframes, parseStylesheet`), `compile/selector.ts:3` (imports value's
  `parseKeyframeSelector`), `scroll/grammar.ts:32-44`.
- **Imprecision:** the draft calls `scroll/grammar.ts` "kf's own product grammar."
  It owns **no grammar** — every function is a pass-through to value.js
  (`parseScrollTimeline`→`parseAnimationTimeline`, `parseScrollCSS`→
  `parseStylesheet`+`collectTimelineOptions`, `serializeScrollOptions`→
  `serializeTimelineOptions`; grammar.ts:76-135, self-described "kf re-derives no
  parallel name table"). It is a consume-adapter with a misleading filename, not a
  parser. (See R5.)

---

## R5 — "parsing boundary as a census; scroll/grammar.ts + parseAnimationCSS.ts as adjudication rows"
**VERDICT: AMENDED (both named rows are FALSE POSITIVES; the real residual is elsewhere).**

- `keyframes.js/src/animation/scroll/grammar.ts` — **zero productions**; pure value.js
  delegation (see G2). Census PASS today.
- `demo/.../utils/parseAnimationCSS.ts:26-57` — **not a parser**: calls
  `loadAnimationEngine().resolveKeyframes` (value.js `parseStylesheet` under the hood)
  + `collectAnimationOptions`/`collectStyleRules`; self-doc "performs no regex
  pre-detection or second parse." Census PASS today.
- `compile/selector.ts:23` `parseKeyframeSelector` — thin wrapper over value's
  `parseValueSelector` ("Value's sole grammar authority", :19). PASS.
- **The ONE genuine kf-side duplication the draft MISSED:** `src/animation/easing.ts:30,39`
  re-encodes the CSS-native easing NAME TABLE as classifier regex
  (`/^(linear|ease|ease-in|ease-out|ease-in-out)$/` and `cubic-bezier(|steps(|linear(|
  step-start$|step-end$`) — the exact set value.js already owns in
  `grammar.ts:438,444,453,466` (`parseTimingFunction`). kf decides "CSS-native →
  pass verbatim vs kf-registry easing" by a hardcoded copy of value's table instead of
  asking `parseTimingFunction`. A real (if minor) name-table duplication with a perf-vs-
  duplication tradeoff to state, not silently keep.

**AMENDMENT:** "the boundary is ALREADY a census-pass at every site the draft named;
the gate LOCKS the achieved state. The live rows are (a) `easing.ts` CSS-native
name-table duplication (consume `parseTimingFunction` as oracle, or state the hot-path
perf reason to keep the local classifier), and (b) filename honesty — `scroll/grammar.ts`
owns no grammar (rename to a consume-adapter name)."

---

## G6 / R7 — "mixColors/parseCSSValue ad-hoc history; SCI-1 pending; make it a deliverable"
**VERDICT: CONFIRMED the history is real; AMENDED (SCI-1 already decided; the real
defect family is a v4 capability REGRESSION the draft omits).**

- Ad-hoc fixes are real: `git 329932b8` U-F29 "parseCSSValue loud-fails on trailing
  tokens; rename to parseCSSValues (LIB-G1)"; `git 0c212e8d` U-F30 "CSS-canonical
  color-mix serialization"; V-tranche D3 reworked typed-diagnostics/lossy-success
  (`git d82c63cd`, `184a9ec9`). A defect-family register (R7) is well-founded.
- **SCI-1 is NOT "pending execution-gated."** It is **DECIDED SHIP-4.1.x**:
  `docs/tranches/V/DECISIONS.md:82` (D54) + `coordination/INBOX.md` O-5 — restore
  `mixColorsInto` **and** `toRgba8Into` zero-alloc into-variants; real consumer
  ~3,243 marks/frame (atlas); vehicle = W56 (`reformation/CARRY-LEDGER.md:30`). The
  V-next tranche INHERITS this decision; it is not orphaned in WL (draft R6 wording).
- **The material fact both G6 and R7 omit — a REGRESSION, not just recurrence:**
  the zero-alloc Into variants were **shipped, then LOST at v4**. `color2Into`,
  `mixColorsInto`, `sampleGamutBoundaryInto` lived at `src/units/color/`
  (`git 07760131` R.W1.5 "sampleGamutBoundary/Into + goldens + bench"; R docs
  passim). Current tree: `grep Into src/color src/subpaths` → **0 hits**;
  `operations.ts` allocates freely. The v4 rewrite (`164343c1`) dropped shipped
  capability with no capability-preservation gate. SCI-1's word "restore" is literal.

**AMENDMENT (R7):** "the register's PRIMARY family is *v4-rewrite capability loss*:
the R-era zero-alloc Into surface (color2Into/mixColorsInto/sampleGamutBoundaryInto)
and the S/N gamut apparatus (below) were dropped at the v4 cut. The missing invariant
that let it recur is the ABSENCE of a capability-preservation gate on major rewrites.
Fix families, and add that gate — not just the two named instances."

---

## R6 — "name color spec anchors; §13.2 gamut deltaEOK≤JND; WPT vectors; into-variants"
**VERDICT: AMENDED (right to anchor the spec; wrong that the impl already IS §13.2;
the heaviest allocator is uncovered).**

- Current gamut map is **NOT CSS Color 4 §13.2 MINDE.** `operations.ts:133-176`
  `mapColorToGamut` = hold L&H, 32-iter binary search for the largest in-gamut chroma
  (`:158-170`). It has **no deltaEOK**, **no clip-vs-reduced (MINDE) comparison**, **no
  L≥100→white / L≤0→black short-circuit** (only clamps L, `:156`). `grep
  deltaEOK|13.2|raytrace|MINDE|jnd src` → **0 hits**. R6's phrase "OKLCh chroma
  reduction, deltaEOK ≤ JND binary search" describes the SPEC; a strict WPT gamut-map
  vector suite would **FAIL** the current impl. And **no WPT/conformance vectors exist
  today** (`grep wpt|conformance|css-color-4 test src` → 0). R6 is greenfield.
- This is a §13.2 **SIMPLIFICATION** from prior art: `git 60bb64e9` S.W1-10 "raytrace
  gamut map — the exact-boundary reference", `R/audit/.../R1-ASBUILT.md:22` N.W11
  "§13.2 oracle". The raytrace/oracle apparatus was dropped at v4. (See R7 regression.)
- **Zero-alloc scope gap:** the worst allocators are `mapColorToGamut`
  (~5 array allocs × 32 iters/call) and `safeAccentColor` (`:207-303`: up to ~67
  `evaluate()` calls, each → `mapColorToGamut`'s 32-iter loop ⇒ ~10³–10⁴ allocs/call).
  SCI-1 restores only `mixColorsInto`/`toRgba8Into` — **neither touches the gamut/accent
  hot path.** R6 folding "zero-alloc via into-variants (fold SCI-1)" leaves the heaviest
  path uncovered.

**AMENDMENT:** "R6 must DECIDE the gamut policy explicitly: (i) adopt §13.2 MINDE
(add deltaEOK + clip-vs-reduced + L-endpoint short-circuit — a behavioral change,
re-anchoring the dropped S-era raytrace oracle), OR (ii) ratify the current
hue-preserving pure-chroma-reduction as a deliberate deviation and WPT-gate only the
conforming spaces/paths. Name the priority zero-alloc targets as
`mapColorToGamutInto`/`safeAccentColorInto` (the 10³–10⁴-alloc paths); SCI-1's two
into-variants are necessary but not sufficient. WPT color-4 vectors + §13.2 vectors are
NEW gate infrastructure, not an inheritance."

---

## MISSED — material facts/risks in my lens the draft omitted entirely

1. **v4 rewrite = a live capability REGRESSION (the biggest color finding).** Shipped
   zero-alloc Into variants (color2Into/mixColorsInto/sampleGamutBoundaryInto) and the
   S/N §13.2 raytrace gamut oracle were DROPPED at `164343c1`; current `src/color/` has
   none. The owner's "we SHOULD have near-perfected zero-alloc" is because they HAD more
   and lost it. No capability-preservation gate existed. The draft frames this as new
   work, not recovery.
2. **The extant parser is regex, not byte-scanner** (G1/R2): the whole "measured
   byte-scanner, don't relitigate" spine is misattributed to the retired `src/parsing/`
   tree. Neither owner ("unreadable custom") nor draft ("measured perf choice") describes
   `src/css/grammar.ts` accurately.
3. **tape is deleted-as-slower Rust bbnf-lang, not a parse-that TS lever** — the owner's
   premise and the draft's "genuinely new" both inverted (bbnf-lang GESTALT.md:48,
   HARDENING-PLAN-PROMPT.md:34). Do not let "tape might flip the V8 verdict" enter the
   tranche as an open question; it is closed against the owner's direction.
4. **easing.ts CSS-native name-table duplication** is the real residual R5 census hit;
   the draft's two named rows are already clean.
5. **grammar.ts:175-255 `parseFunctionalColor` repetition** — the readable defect is a
   copy-chained if-ladder, table-solvable WITHOUT parse-that. Keep readability and
   parser-choice as independent axes so parse-that can't ride in on the readability
   complaint.
6. **Both R2 and R6 gates are greenfield** (no parser perf bench, no WPT vectors on
   disk) — a bigger effort line than "extend the gate" implies.
7. **Out-of-lens flag (G3's row):** `value.js/package.json` lists `@mkbabb/keyframes.js@^6`
   and `@mkbabb/glass-ui@^7` under `dependencies` (runtime, not dev) on a leaf lib — a
   cycle-shaped smell worth G3/consumer-truth's attention; not adjudicated here.

---

### 10-line summary (hardest findings)
1. G1/R2 REFUTED at the core: the extant parser (`src/css/grammar.ts`, 0 charCodeAt / 24 regex) is a regex rewrite; the "measured byte-scanner" pedigree belongs to `src/parsing/`, RETIRED at v4 `164343c1`.
2. "tape" is INVERTED: a Rust bbnf-lang runtime deleted as slower than direct-to-struct (GESTALT.md:48), not a parse-that TS feature (TS grep=0). It cannot flip the V8 verdict.
3. The real parse-that TS lever is mutable-ParserState/zero-alloc combinators (perf-optimization-ts.md:55/457), not tape.
4. SpanParser-V8 falsification is REAL (parse-that future-research.md:83-90, −10..−14%) — the one archaeology claim that fully holds.
5. R2 smuggles status-quo bias: it defends a parser that isn't the measured one; the honest baseline is greenfield (no parser bench exists) and may lose to both byte-scanners AND parse-that.
6. R5's two named sites (scroll/grammar.ts, parseAnimationCSS.ts) are FALSE POSITIVES — pure value.js consumers; the actual duplication is easing.ts's CSS-native name table.
7. R6 REFUTED-in-part: `mapColorToGamut` is hue-preserving chroma reduction with NO deltaEOK/MINDE/L-endpoints — a §13.2 SIMPLIFICATION that WPT vectors would fail.
8. Color's biggest fact (draft omits): v4 dropped the SHIPPED zero-alloc Into variants and the S-era raytrace/§13.2 gamut oracle — a regression, not new work.
9. SCI-1 is already DECIDED SHIP-4.1.x (mixColorsInto+toRgba8Into; DECISIONS.md:82) — inherit it; but it doesn't cover the 10³–10⁴-alloc `mapColorToGamut`/`safeAccentColor` hot paths.
10. Net: G2 confirmed; G1/R2/R5/R6 all AMENDED/part-refuted; add a capability-preservation gate on major rewrites as the missing invariant behind every regression.
