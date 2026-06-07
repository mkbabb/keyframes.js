# G.W1 — The re-pin SAFETY verification (the measure-first lock the spine ships behind)

**Phase:** IMPL (spec authored in DEV — awaits auth) · **Class:** MEASURE-FIRST (the
band-0 verification lock: it does NOT ship source — it certifies the Band-1 re-pin is
non-breaking BEFORE it lands) · **Scope:** the verification surface only — `package.json`
(the declared pins, read), `node_modules/@mkbabb/value.js` + `…/parse-that` (the installed
dist, grep-read), `src/animation/**` (the import sites, grep-read), the published
`value.js@0.11.0` / `parse-that@0.9.0` symbol tables (`npm view` / the `*.d.ts` set). NO
`src/`/`test/`/`demo/` edit lands in this wave. · **DAG-deps:** none — **G.W1 LEADS the G
DAG**; it is the lock that makes G.W2 (THE RE-PIN) shippable. G.W2 + G.W3 depend on G.W1.

The §Mandate (`G.md §Mandate` / the gap-scorecard §THESIS) is the spine; this wave most
tests **measure-first** — the re-pin's "ZERO kf edit, consume-unchanged" charter
(`F/FINAL.md:11-12`) is a CLAIM, and the §Mandate forbids shipping on assertion. G.W1
PROVES the claim's two preconditions BEFORE the bump: (1) parse-that `0.9.0`'s only
breaking change touches no kf/value.js call-site; (2) all 29 kf-consumed value.js names
survive `0.11.0`. **This is the measure-first lock, not a wave that ships source.**

**Provenance.** `a-parsethat-leverage G-PT-1` (the parse-that-side verification — the
`.memoize()` removal has zero kf/value.js call-sites; the one direct kf import `any`
survives), `a-valuejs-leverage §0` (all 29 kf-consumed value.js names survive `0.11.0` —
29/29 OK, zero MISSING), `a-deferred-ledger §0 RP-1` (the re-pin headline — the
consume-unchanged claim is the lock; ANY required kf edit is a finding against the
charter). Verified, not asserted (inv ε), against the live `tranche-g-dev` tree + the
installed `0.10.0`/`0.8.2` dist + the published `0.11.0`/`0.9.0`.

---

## § The state, verified (not asserted)

The live facts, read- and grep-confirmed on `tranche-g-dev`:

1. **kf ships STALE siblings, un-re-pinned.** `package.json` declares
   `"@mkbabb/value.js": "^0.10.0"` (`package.json:85`), `"@mkbabb/parse-that": "^0.8.2"`
   (`package.json:84`), `"@mkbabb/glass-ui": "file:../glass-ui"` (`package.json:88`, a
   dirty LINK) — at kf version `4.0.0` (`package.json:3`). The installed
   `node_modules/@mkbabb/value.js` is `0.10.0`; `…/parse-that` is `0.8.2`. The registry
   has `value.js@0.11.0` + `parse-that@0.9.0` + `glass-ui@3.3.0` PUBLISHED (`npm view`,
   re-verified live; `a-valuejs-leverage §0`, `a-deferred-ledger §0 RP-1`). **kf 4.0.0
   ships on the OLD siblings and consumes NONE of the F hand-off wins it drove.**

2. **parse-that `0.9.0`'s ONLY breaking change has ZERO kf/value.js call-sites.** The
   `0.9.0` break (PT-WAVE-2, commit `c9338e4`) is the removal of the `.memoize()` /
   `.mergeMemos()` Parser *methods*, re-homed as free functions in `packrat.ts`
   (`a-parsethat-leverage §1`). Verified: `grep -n "memoize" parse-that/parser.ts` →
   **zero matches** (the methods are gone from the class); kf `grep -rn "\.memoize\b"
   src/` → **zero parser-level matches** (kf's only `memoize` is the value.js-level
   `memoizeDecorator`/`memoize` in `src/utils.ts` — a different symbol); value.js
   `grep -rn "\.memoize(" src/parsing/` → **zero matches** (`a-parsethat-leverage §1`).
   **Removing a dead method cannot break a consumer that never called it.**

3. **The one DIRECT kf→parse-that import survives `0.9.0`.** kf imports exactly one
   parse-that symbol: `import { any as parseAny } from "@mkbabb/parse-that"`
   (`src/animation/utils.ts:1`). `any` is still root-exported in `0.9.0` (`leaf.ts:28`,
   re-exported `index.ts:9`; `a-parsethat-leverage §1`). The `as any` cross-realm cast at
   `utils.ts:251,258` is correct + harmless at runtime; its removal is a separate
   MEASURE-FIRST→BOOK item (`a-parsethat-leverage G-PT-2`), NOT a re-pin blocker. **The
   re-pin breaks no kf parse-that import.**

4. **All 29 kf-consumed value.js names survive `0.11.0`.** kf statically imports 29
   value.js names across 11 heavy sites (`engine.ts:24`, `utils.ts:18,24`,
   `constants.ts:10,15`, `adapter.ts:9`, `format.ts:8`, `waapi.ts:1`, `group.ts:1`,
   `frame-compiler.ts:21`, `animations.ts:1`, `motion-path.ts`; `a-valuejs-leverage §0`).
   Each was checked against the `0.11.0` dist `*.d.ts` set — **29/29 OK, zero MISSING**
   (`a-valuejs-leverage §0`). The `0.11.0` surface ADDS `bumpLayoutEpoch`/`getLayoutEpoch`/
   `lerpArray`/`_computedCache`/`_colorPlan` (the F wins) — all of which are absent from
   the installed `0.10.0` dist (grep over the bundle = 0 hits each; `a-valuejs-leverage
   §0`). **The re-pin is additive at the symbol level; non-breaking.**

5. **The boundary is self-enforcing.** kf reaches the entire interp path through ONE
   dispatch site — `lerpValue(eased, iv)` at `engine.ts:731` (verified live;
   `iv._lerp`-internal). The light tier carries no static value.js/parse-that edge
   (`proof:boundary`, `package.json:41`). So the re-pin is a transitive consume, not a
   migration — the structural reason it is zero-kf-edit (`a-valuejs-leverage §0/§3.1`).

The wave's job: pre-stage the Band-1 re-pin with a falsifiable, re-runnable
symbol-survival + breaking-change check, so G.W2 lands behind a GREEN lock rather than an
assertion — and so a hypothetical missing symbol or a live `.memoize()` call would RED
*before* the bump touches the lockfile.

---

## § Goal

**What lands (the IMPL the spec gates — a verification stage, no source):**
- **The re-pin certified non-breaking BEFORE it ships.** A re-runnable pre-stage that
  asserts (a) parse-that `0.9.0`'s `.memoize()` removal has zero kf/value.js call-sites,
  (b) the one direct kf parse-that import (`any`) is still exported, (c) all 29
  kf-consumed value.js names survive `0.11.0`. The check passes against the CURRENT
  (`^0.10.0`/`^0.8.2`) tree by reading the PUBLISHED `0.11.0`/`0.9.0` symbol tables —
  it is a precondition gate, run before the bump. (MEASURE-FIRST lock.)
- **`proof:boundary` GREEN as the structural witness.** The light barrel carries no
  static value.js/parse-that edge (`a-parsethat-leverage §1` instrument); the re-pin
  cannot perturb a seam the boundary does not cross. The boundary gate is the lock that
  the single-dispatch consumption (`engine.ts:731`) is the only value.js surface.

**Why:** the §Mandate's no-ship-on-assertion clause binds the spine. `F/FINAL.md:11-12`
ASSERTS "kf consumes them unchanged … on re-pin — ZERO kf edit needed"; the
`a-deferred-ledger §0 RP-1` disposition makes the consequence explicit: **ANY required kf
edit is a finding against the consume-unchanged charter.** G.W1 turns the assertion into a
falsifiable precondition — symbol survival + breaking-change absence — so G.W2 ships behind
proof, not faith. Without G.W1, the re-pin could land and surface a missing symbol or a
`.memoize()` compile failure AFTER the lockfile moved; the lock catches it first.

---

## § Scope

### S1 — The breaking-change-absence check (parse-that 0.9.0) — `a-parsethat-leverage G-PT-1`

**WHAT:** a re-runnable assertion that parse-that `0.9.0`'s only breaking change — the
`.memoize()`/`.mergeMemos()` method removal — touches no kf/value.js production path: (a)
`grep -c "\.memoize(" src/` over kf = 0 (the bite-control — a hypothetical `.memoize()`
call would fail to compile against `0.9.0`); (b) the same over value.js `src/parsing/` = 0
(re-confirmed, `a-parsethat-leverage §1`); (c) the one direct kf parse-that import (`any`,
`utils.ts:1`) is present in the `0.9.0` export table (`index.ts:9`). NO source edit — a
grep + symbol-table read.

**WHY:** inv ε — the re-pin's non-breaking claim must be VERIFIED at the call-site level,
not asserted. The break is a dead-method removal; the check makes "kf never called it" a
falsifiable green (delete the grep guard → a future `.memoize()` slips in silently). This
is the parse-that-side half of the safety lock (`a-parsethat-leverage G-PT-1`: "the re-pin
is non-breaking — verified").

### S2 — The 29-name symbol-survival check (value.js 0.11.0) — `a-valuejs-leverage §0`

**WHAT:** a re-runnable assertion that every value.js name kf statically imports (29
across `engine.ts:24` / `utils.ts:18,24` / `constants.ts:10,15` / `adapter.ts:9` /
`format.ts:8` / `waapi.ts:1` / `group.ts:1` / `frame-compiler.ts:21` / `animations.ts:1` /
`motion-path.ts`) is exported by the PUBLISHED `0.11.0` dist (`index.d.ts` + the `*.d.ts`
set). Asserts 29/29 present, zero MISSING. The check enumerates kf's import list from
source and intersects it with the `0.11.0` export table — a docs/tooling read, no bump
yet. NO source edit.

**WHY:** the re-pin is zero-kf-edit ONLY if no consumed symbol disappeared. A missing
name is the one way a "non-breaking" minor bump bites a consumer; S2 makes it falsifiable
BEFORE the lockfile moves (a removed name → the intersection drops below 29 → reds). This
is the value.js-side half (`a-valuejs-leverage §0`: "all 29 kf-consumed value.js names
survive `0.11.0` — 29/29 OK").

### S3 — `proof:boundary` GREEN as the structural witness — `a-parsethat-leverage §1`

**WHAT:** re-run `proof:boundary` (`package.json:41`) on the current tree and assert it
stays GREEN. The light tier (`NumericAnimation`/`SmoothProgress`/`SpringProgress`/
`Timeline`/`ElementMorph`) carries no static value.js/parse-that edge; the heavy surface
reaches value.js at 11 direct sites with no barrel indirection, all flowing through the
single `lerpValue → iv._lerp` seam (`engine.ts:731`). NO source edit — a gate re-run.

**WHY:** the boundary gate is the structural proof that the re-pin cannot perturb a seam
it does not cross — it certifies the single-dispatch consumption is the ONLY value.js
surface, which is WHY C1/B3/B5/A1 are consumed with zero kf edit (`a-valuejs-leverage
§3.1`). If `proof:boundary` were red, the re-pin's blast radius would be unbounded; green
is the precondition that bounds it to the one seam.

### S4 — The pre-stage gate `proof:repin-safe` (the falsifiable close) — `a-deferred-ledger §0 RP-1`

**WHAT:** a new pre-stage gate `proof:repin-safe` (NOT chained into `proof:all` — it runs
BEFORE the bump, as the Band-1 precondition) that bundles S1+S2+S3: (a) zero `.memoize(`
call-sites in kf source; (b) 29/29 value.js names present in the published `0.11.0` export
table; (c) `any` present in the `0.9.0` export table; (d) `proof:boundary` green. The gate
reads the PUBLISHED sibling symbol tables (via `npm view`/the installed-on-pre-stage dist)
against kf's live import list. It is the lock G.W2 runs first.

**WHY:** inv ε — the lock must BITE. The §Mandate forbids shipping the re-pin on the
`F/FINAL.md:11-12` assertion; `proof:repin-safe` is the falsifiable form of "the re-pin is
non-breaking." BITES: a missing `0.11.0` symbol → S2 reds; a live kf `.memoize()` call →
S1 reds; a removed `any` export → S1c reds; a broken boundary → S3 reds — each RED *before*
the lockfile moves, so the bump never lands on an unverified surface.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real check, not narration):

1. **parse-that 0.9.0's break has zero kf call-sites.** `proof:repin-safe` clause a:
   `grep -c "\.memoize(" src/` over kf = 0. BITES: a kf `.memoize()` call (which would fail
   to compile against `0.9.0`) → reds. (`a-parsethat-leverage G-PT-1`.)
2. **The one direct kf parse-that import survives.** `proof:repin-safe` clause c: `any` is
   in the `0.9.0` export table (`index.ts:9`). BITES: `any` removed/renamed upstream →
   reds (the re-pin would break `utils.ts:1`).
3. **All 29 kf-consumed value.js names survive 0.11.0.** `proof:repin-safe` clause b: the
   intersection of kf's 29-name import list with the `0.11.0` export table = 29. BITES: a
   removed value.js name → the count drops below 29 → reds. (`a-valuejs-leverage §0`.)
4. **The boundary is intact.** `proof:repin-safe` clause d: `proof:boundary` green — the
   light tier carries no static sibling edge; the heavy surface is single-dispatch. BITES:
   a static value.js/parse-that edge in a light module → reds (the re-pin's blast radius
   would exceed the one seam).
5. **G.W1 ships NO source.** `git status` over `src/`/`test/`/`demo/` shows ZERO
   modifications attributable to G.W1 — it is the verification stage, the `proof:repin-safe`
   script is its only artifact. BITES: a staged source/test/demo edit in a G.W1 commit →
   reds (the dev/impl + measure-first boundary is a hard line). The bump itself is G.W2.

---

## § Folds

Retires (by finding id):
- **`a-parsethat-leverage G-PT-1`** — the re-pin is non-breaking (parse-that side):
  `.memoize()` removal has zero kf/value.js call-sites; the direct `any` import survives —
  S1 + gate clauses 1, 2.
- **`a-valuejs-leverage §0`** — all 29 kf-consumed value.js names survive `0.11.0`
  (29/29 OK, zero MISSING) — S2 + gate clause 3.
- **`a-deferred-ledger §0 RP-1` (the safety precondition half)** — the consume-unchanged
  claim is a CLAIM; G.W1 PROVES its preconditions so G.W2 ships behind a lock, not
  `F/FINAL.md:11-12`'s assertion — S4 + gate clauses 1-5. (The bump itself is folded by
  G.W2.)

**RECORD (carried so no future lane re-raises):**
- **The `as any` cross-realm cast at `utils.ts:251,258` is NOT a re-pin blocker.** It is
  correct + harmless at runtime; its removal depends on value.js exposing the
  value-vs-function discrimination (`a-parsethat-leverage G-PT-2/G-PT-5`,
  MEASURE-FIRST→BOOK / value.js-HANDOFF). Do NOT "fix" a realm-graph property with a kf
  rewrite here (the Mandate's no-symptom-patch). RECORDED.
- **glass-ui rides a SEPARATE leg.** The `file:../glass-ui` LINK → `^3.3.0` re-pin
  (`a-glass-ui GG-1`) is folded by G.W2; G.W1's symbol-survival check is value.js +
  parse-that scoped (glass-ui is a demo dep, not a library interp-path edge). RECORDED so
  the safety lock is not over-scoped.

**RECORD (already-SOTA — `a-valuejs-leverage §4`):** the single-dispatch interp seam
(`engine.ts:731 → iv._lerp`), the exemplary boundary (light modules carry zero static
value.js edge; heavy surface imports directly with no barrel), the closed `§2` rename
(`AnimationOptions→CSSAnimationOptions`, discharged in `0.10.0`; kf imports neither). The
re-pin IS the leverage — manufacture no kf-side interp-path work. LEAVE.

---

## § Design decisions

1. **The safety lock runs BEFORE the bump, not as a `proof:all` clause — RESOLVED.**
   `proof:repin-safe` is a Band-1 PRECONDITION: it reads the PUBLISHED `0.11.0`/`0.9.0`
   symbol tables against kf's live import list while the lockfile is still on
   `^0.10.0`/`^0.8.2`. The §Mandate forbids shipping the re-pin on `F/FINAL.md:11-12`'s
   assertion; the lock makes the non-breaking claim falsifiable at the moment it matters —
   before the lockfile moves. Trade-off: it is a one-shot pre-stage rather than a standing
   `proof:all` member (the standing gate is G.W2's `proof:deps-current`, which asserts the
   bump LANDED) — but a precondition that ran after the bump would verify the wrong
   timeline. The two gates compose: G.W1 proves it is SAFE to bump; G.W2 proves it DID.

2. **G.W1 ships zero source — it is a measure-first lock, not a SHIP — RESOLVED + HONEST
   (inv ε).** The re-pin SHIP is G.W2; G.W1's only artifact is `proof:repin-safe`. The
   §Mandate's measure-first clause demands the perf/correctness claim land behind a biting
   check; here the "claim" is the non-breaking precondition, and the biting check is the
   symbol-survival + breaking-change-absence assertion. Trade-off: a reader wanting "the
   re-pin" must wait for G.W2 — but conflating the lock with the bump is exactly the
   ship-on-assertion the §Mandate forbids; the lock must stand on its gate, not on the bump
   that follows it.

3. **Symbol survival is checked against the PUBLISHED dist, not the source tree —
   RESOLVED.** The 29-name + `any` survival is asserted against the published `0.11.0`/
   `0.9.0` export tables (`*.d.ts` / `npm view`), because that is exactly what kf will
   resolve on re-pin — the registry artifact, not the sibling's working tree. Trade-off: it
   couples the lock to the published release (a re-publish would require a re-run) — but
   that coupling is correct: kf consumes the registry, and the safety claim is precisely
   "the thing kf will install is non-breaking." Verifying the working tree would prove a
   different, weaker thing.
