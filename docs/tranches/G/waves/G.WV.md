# G.WV — The cross-repo HAND-OFFs (value.js · parse-that · glass-ui · deploy)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** HAND-OFF (every leg below is a SIBLING surface — value.js /
parse-that / glass-ui / deploy — audited as its own; **inv-16 RELAXED for G impl: the
user drives each sibling, but each is HAND-OFF-tagged so the sequencing is explicit**;
ZERO of these is a keyframes.js source edit) · **Scope:** the sibling trees
(`/Users/mkbabb/Programming/value.js`, `.../parse-that`, `.../glass-ui`,
`.../deploy` + the fourier constellation hub) — NOT `keyframes.js/src/**` /
`test/**` / `.github/**` / `demo/**` · **DAG: sequenced BEHIND the producers and
the kf re-pin spine** (`G.W2` consumes whatever these legs publish; the value.js
legs land in value.js FIRST, then kf rides them on a re-pin; the parse-that re-key
and the glass-ui `{types}` helper are producer-side). This wave OWNS no kf-side
SHIP — it is the consolidated HAND-OFF ledger Band V of the band→wave map, the
sequencing contract for the cross-repo work the user drives.

**Title.** *G's spine is a kf-side re-pin (`G.W2`) that consumes the F sibling wins
already published. Around it sit the NET-NEW sibling-side items the producers must
land for the next slice — the value.js path-geometry sampler + the buffer-reusing
serializer + the structured-diagnostics sink + the LRU bound + the `linear()`/`steps()`
parsers + the dispatch-LUT inner forks + the parse-that peer-declare; the parse-that
WITHHELD packrat re-key; the glass-ui `startViewTransition({types})` helper + the
mobile dock occlusion + the reka `SelectIcon` re-export; and the deploy CF-Pages
template + the P0 DNS fix + the stale CONSTELLATION roster. Each is its own surface,
HAND-OFF-tagged, sequenced behind its producer. The user drives them under relaxed
inv-16; this wave is the ordering contract, NOT a kf ship.*

This wave is the §Mandate's **inv-16-relaxed cross-repo discipline**: the user may
drive value.js / parse-that / glass-ui / deploy, but **each sibling is its own
surface** (`_SYNTHESIS-gap-scorecard §THESIS` last clause: "each sibling is its own
surface → HAND-OFF-tagged"). The whole-history deferred ledger's C-1
(`_SYNTHESIS-deferred-ledger §1`) is **CHRONIC-by-design and correct** — the value.js
charter is a working process that ships a slice every tranche; G consumes the landed
0.11.0 slice via the re-pin (`G.W2`) and HANDS OFF the next-slice producers here. **No
perpetual keyframes-owned punt survives** — every row exits with a terminal disposition
+ a named owner + an explicit trigger (`_SYNTHESIS-deferred-ledger §9` P-invariant).

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: each sibling leg is the GENUINE structural fix in
its own repo — the value.js out-buffer overload (not a kf-side wrapper), the parse-that
`getCijKey` re-key (not a kf-side packrat policy), the glass-ui `{types}` overload (not
a demo-side VT shim), the deploy template (not a per-app re-derivation). NO legacy /
fail-EXPLICIT: every leg RETIRES a legacy shape on land — kf's `parseLinearStops` shim
EXCISES when value.js E1/E2 ships (no compat alias beside the value.js parser); the
`as any` cross-realm cast (`utils.ts:258`) COLLAPSES when value.js peer-declares
parse-that; the demo's `:always-expanded` mask was already removed in `G.W12` and the
mobile residual is glass-ui's root contract (never re-masked in the demo per MEMORY
`feedback_glass_ui_root_changes`). NO god modules · KISS · DRY: the F3 LRU bound lives
ONCE in value.js (a second kf eviction policy is the DRY violation the ledger forbids,
`_SYNTHESIS-deferred-ledger §3 C-3`). MEASURE-FIRST: each value.js perf leg lands behind
its own biting bench in value.js (the C1/F.W4 out-buffer template), and the parse-that
re-key lands ONLY behind a `proof:packrat-position` lock built FIRST. inv-16 RELAXED:
the user drives the siblings — but the ordering is the producer's, not kf's. inv ε:
every claim cites a phase-1 lane or a live `file:line`/`npm view`, source-verified on
`tranche-g-dev`, not asserted.

**Provenance.** `_SYNTHESIS-gap-scorecard §2 Band V` (the canonical cross-repo
HAND-OFF roster) + `§3 disposition roll-up` (value.js / parse-that / glass-ui / deploy
HAND-OFF) · `_SYNTHESIS-deferred-ledger §1/§2/§5/§6/§9` (the whole-history terminal
ledger — the value.js charter row-by-row, the parse-that WITHHELD re-key, the glass-ui
H-1 chain, the constellation/deploy band) · `_SYNTHESIS-backend-constellation §9`
(G-HO-1..14, the owner-named cross-repo table) · `a-constellation-gaps §2`
(G-HANDOFF-1..4, the deploy + realm-converge legs) · `a-glass-ui §2/§3/§4` (GG-3 the
`{types}` helper, GG-5-half the mobile occlusion, GG-6 the reka re-export) ·
`a-valuejs-leverage F-VJ-4..8` (the value.js charter producers) · `a-parsethat-leverage
G-PT-2/G-PT-4/PT-4` (the dispatch-LUT forks, the peer-declare, the packrat re-key) ·
`a-engine-perf G-3` (the per-frame serialization garbage = VJ-F4) ·
`r-animation-sota G26-1` (MorphSVG/numeric-MotionPath gated on VJ-F1).

---

## § State, verified (not asserted)

The live facts, `grep`/read/`npm view`-confirmed on `tranche-g-dev`:

1. **The re-pin spine (`G.W2`) consumes the PUBLISHED F slice — these legs are the
   NEXT slice.** Verified live (`_SYNTHESIS-deferred-ledger headline`,
   `a-constellation-gaps §0`): `npm view` → value.js `0.11.0`, parse-that `0.9.0`,
   glass-ui `3.3.0` all published; kf `package.json:84-85,88` still `^0.8.2` /
   `^0.10.0` / `file:../glass-ui`. `G.W2` re-pins and rides the 0.11.0 landed slice
   (A1/A2 · B3+B5 · C1 · C5 · D2 · F7). The items in THIS wave are the still-OPEN
   sibling producers (`_SYNTHESIS-deferred-ledger §1` "the charter stays open for
   value.js's next wave").

2. **value.js VJ-F1 (path-geometry sampler) is OPEN — NOT in 0.11.0.** Verified
   (`_SYNTHESIS-deferred-ledger §1 VJ-F1`, `r-animation-sota G26-1`,
   `a-valuejs-leverage F-VJ-7`): no `getPointAtLength`/`getTotalLength` arc-length
   sampler in value.js's `src/`. It is the predecessor of the kf MorphSVG / numeric-
   MotionPath consumer wave (BOOK G26-1) — DrawSVG (`G.W13`) does NOT need it (one
   `getTotalLength()` DOM read, no geometry sampler).

3. **value.js VJ-F4 (buffer-reusing `unflattenObjectToString`) is OPEN — byte-identical
   allocating form.** Verified (`a-engine-perf G-3`, `_SYNTHESIS-deferred-ledger §1
   VJ-F4`, `_SYNTHESIS-backend-constellation §3 G-PERF-2`): value.js
   `units/utils.ts:115-148` allocates a fresh `{}` + per-key `.split(".")` + concat
   EVERY frame on the kf DOM-write path (`engine.ts:735` → `transformTargetsStyle` →
   `utils.ts:370`) — ~10 split-arrays/frame for a K=10 transform. 0.11.0 did NOT
   address it. The fix is a caller-owned out-buffer overload
   `unflattenObjectToString(flat, out?)` (the C1/F.W4 template); kf consumes it on the
   SAME re-pin by threading a per-animation string buffer.

4. **The structured-diagnostics chain is half-built — parse-that producer landed,
   value.js + kf consumers dark.** Verified (`a-parsethat-leverage G-PT-3`,
   `_SYNTHESIS-backend-constellation §6`): parse-that 0.9.0 ships
   `ParserState.furthest`/`.expected`/`.suggestions` (`state.ts:43-53`),
   `enableDiagnostics()`/`getCollectedDiagnostics()`/the `Diagnostic` type
   root-exported. BUT value.js's `tryParse` reads `state.offset` (the backtrack-restored
   point), NOT `state.furthest` (the real derail point) — so error offsets are wrong
   for any backtracking grammar; and kf has NO parse-error channel
   (`ResolvedKeyframes` carries no `diagnostics` field). The producer half of the F
   BOOK NEW-18/VJ-F2 is now real.

5. **value.js F3 (bounded LRU on `getComputedValue.cache`) is OPEN.** Verified
   (`_SYNTHESIS-deferred-ledger §1 F3 / §3 C-3`): the C1 cache + `bumpLayoutEpoch().clear()`
   is a wholesale-clear with no LRU bound (FIFO default `Infinity`). The bound belongs
   ONCE in value.js's `memoize` — a kf-side second eviction policy is a DRY violation.
   Re-open trigger UNCHANGED: a measured editor footprint (none exists).

6. **value.js E1/E2 (`linear()`/`steps()` PARSER → `LinearStop[]`) is OPEN; kf's
   READER shim landed.** Verified (`_SYNTHESIS-deferred-ledger §1 E1/E2 / §3 C-4`,
   `a-valuejs-leverage F-VJ-... C-4`): kf's local `parseLinearStops` reader landed F.W7
   (`utils.ts:106-130`); value.js's E1/E2 PARSER is OPEN. On value.js land (riding the
   re-pin), kf **EXCISES** its `parseLinearStops` shim in the SAME motion — no compat
   alias beside the value.js parser (the no-legacy collapse). `linear()` Baseline-WA
   2026-06-11 (PAST).

7. **value.js dispatch-LUT inner forks are partial — A1 landed, the rest in flight.**
   Verified (`a-parsethat-leverage G-PT-4`, `_SYNTHESIS-backend-constellation §9
   G-HO-7`): A1 the `any()`→`dispatch()` LUT landed in 0.11.0 (`color.ts:593`); the
   remaining `any(` forks (62 `any(` vs 2 `dispatch(`) are the value.js A-tier in
   flight — kf rides them transitively on the re-pin, zero kf edit.

8. **The cross-realm `as any` cast is a packaging artifact — value.js peer-declare
   collapses it.** Verified (`a-glass-ui`/`a-backend-legacy F-BL-5`,
   `a-parsethat-leverage G-PT-2`, `a-constellation-gaps §1`): kf's `utils.ts:246-258`
   documents the dual-realm hazard (value.js + kf each ship their own parse-that realm;
   `Parser<T>` classes nominally distinct → `as any` at `:258`); the root cause is
   value.js 0.11.0 pinning parse-that `^0.8.2` while kf would re-pin `^0.9.0`. The
   clean structural fix is value.js peer-declaring parse-that so the realm collapses —
   NOT a kf-side shim.

9. **parse-that's WITHHELD `(id,offset)` packrat re-key is the ONE item F deliberately
   left undone.** Verified (`_SYNTHESIS-deferred-ledger §2 PT-4`, the F.FINAL "risky
   `(id,offset)` re-key honestly withheld"): the id-only `MEMO.get(p.id)` is latently
   wrong (a same-parser-two-offsets collision); F ISOLATED the packrat off the hot path
   (+~36ns/parse relief, opt-in, zero production consumers) but did NOT re-key for lack
   of a position-test lock. The blast radius is contained to the BBNF left-recursion
   path. Named, gated, completable — NOT a perpetual punt.

10. **glass-ui H-1 (`startViewTransition({types})` + `:active-view-transition-type()`)
    is OPEN.** Verified (`a-glass-ui §2`, `_SYNTHESIS-deferred-ledger §5 GG-3`):
    glass-ui's helper is bare-callback only (`useViewTransition.ts:80` /
    `.d.ts:31` `startViewTransition(mutate: () => void)`); no `{types}` object form;
    `view-transition.css` has ZERO `:active-view-transition-type()` selectors. The
    platform half is Baseline (active view transition 2026-01-13, PAST). H-1 unblocks
    the demo scene-VT (FB-4/GG-4); the kf demo stub realign (`G.W12` S3) FOLLOWS this
    helper, never leads it.

11. **The mobile dock occlusion residual is glass-ui's root contract.** Verified
    (`a-glass-ui §3 GG-5-half`, `a-demo-playwright X-1`, `_SYNTHESIS-gap-scorecard §2
    G.W12`): `G.W12` removed the demo's `:always-expanded="isMobile"` mask and the kf
    half closed; if glass-ui's rebuilt dock does NOT handle the mobile/full-bleed
    no-occlusion natively (browser-test on `square`/mobile), AND the `--z-dock` token
    is NOT applied to glass-ui's internal dock layers (so the full-bleed scene viewport
    wins the hit-test), those residuals are fixed in the glass-ui dock ROOT — never
    re-masked in the demo (MEMORY).

12. **The reka `SelectIcon` re-export (GG-6) is the glass-ui half of a demo-local
    KILL.** Verified (`a-glass-ui §4`): the one direct `reka-ui` import in the demo
    (`AnimationMenuBar.vue:174`); `G.W12` S4 KILLs it demo-local (swap to
    `DockSelectTrigger`). The glass-ui-side ALTERNATIVE — glass-ui re-exporting the
    reka primitives its `Select` family composes — is the low-urgency HAND-OFF here, if
    a genuine raw-primitive need ever remains.

13. **The deploy CF-Pages template is MISSING; kf authored the source-of-record.**
    Verified (`a-constellation-gaps §1 G-CONST-3`): the deploy spine
    (`deploy/templates/`) carries `ci.yml` + `cf/pages-deploy.sh` but NO CF-Pages
    *deploy* WORKFLOW template. kf's `.github/workflows/deploy-pages.yml` is the
    green-CI-gated `workflow_run` deploy hardened with the `head_branch == 'master'`
    anti-drift guard (`:39`) — the exact fix a sibling (slides) lacks
    (`grand-audit:182`). The constellation move: distil kf's `deploy-pages.yml` into
    `deploy/templates/deploy-pages.yml` (parameterized). kf AUTHORS the content +
    rationale (read-only kf-side analysis); deploy WRITES.

14. **The deploy DNS sync target is WRONG (P0).** Verified (`a-constellation-gaps §2
    G-HANDOFF-3`, `grand-audit M2.1`): `deploy/cf/dns-cf-sync.sh:105` carries
    `keyframes.babb.dev|keyframes.pages.dev|...  # UNVERIFIED — owner-confirm`; kf's
    real CF project is `keyframes` → **`keyframes-8uq.pages.dev`** (authoritative: kf
    `deploy-pages.yml:4-5` + `pages-deploy.sh:47`). A blind sync run REGRESSES the live
    CNAME. The owner-confirm the grand-audit booked is SATISFIED from kf's tree: patch
    `dns-cf-sync.sh:105` to `keyframes-8uq.pages.dev`, drop the `UNVERIFIED` comment.

15. **The CONSTELLATION roster is STALE by a full tranche.** Verified
    (`a-constellation-gaps §2 G-HANDOFF-4`): `CONSTELLATION.md §1` shows kf 3.0.0 /
    value.js "L CLOSED"; reality is kf 4.0.0 (D+E+F) / value.js 0.11.0 published;
    `ADOPTION-ASKS.md` rows 118-120 cite superseded pins. The kf-relevant correction:
    kf's roster row should read "4.0.0 PUBLISHED (D+E+F); CF-Pages deploy-of-record
    live." Not a kf write — fourier-hub refresh.

The wave's job: CONSOLIDATE these sibling producers into ONE sequenced HAND-OFF
ledger so the user (driving under relaxed inv-16) lands them in producer order, kf
rides them on a re-pin, and no leg is double-owned by a kf-side wave.

---

## § Goal

**What this wave OWNS (the HAND-OFF ledger — sequencing, not a kf ship):** the
binding ordering contract for the cross-repo work the user drives. Each leg names its
owner, its trigger, its consumer (the kf-side wave that rides it), and its terminal.

**value.js-HANDOFF (the user drives; kf consumes on a subsequent re-pin):**
- **VJ-F1** — the path-geometry sampler (`getPointAtLength`/`getTotalLength` arc-length
  parametrization). Unblocks the kf MorphSVG / numeric-MotionPath consumer (BOOK
  G26-1). Trigger: a value.js wave + tag-publish; THEN the kf consumer wave.
- **VJ-F4** — the buffer-reusing `unflattenObjectToString(flat, out?)` out-buffer
  overload (the REAL per-frame DOM-write garbage). kf consumes it on the SAME re-pin by
  threading a per-animation string buffer through `transformTargetsStyle`.
- **The structured-diagnostics sink + the `tryParse` `furthest` swap** — value.js's
  `tryParse` reads `state.furthest` (not `state.offset`, a one-field strictly-more-correct
  swap) + exposes a structured `Diagnostic[]` sink under `enableDiagnostics()`. Unblocks
  the kf `ResolvedKeyframes.diagnostics` seam (the BOOK kf consumer, gated on this sink).
- **F3 / CF-6** — the bounded LRU on `getComputedValue.cache`, ONCE in value.js's
  `memoize`. No second kf eviction policy (DRY). Re-open trigger: a measured editor
  footprint. **RE-GROUNDED (supplemental fold, `_SYNTHESIS-perf-testing-engine §2/§4`):**
  the compile-side `tryParseCache` is ALSO unbounded (`a-perf-compile-flatten-bitpack`
  CF-6) — the SAME MF-9/F3 item, re-grounded as touching the COMPILE step too (not only
  runtime). The bound still lives ONCE in value.js's `memoize` (no 2nd kf policy, DRY).
- **E1/E2** — the `linear()`/`steps()` PARSER → `LinearStop[]`. On land (riding the
  re-pin), kf EXCISES its `parseLinearStops` shim in the same motion (no compat alias).
- **The dispatch-LUT inner forks** — convert the remaining `any(` forks → `dispatch()`
  LUT (62 `any(` vs 2 `dispatch(`; A1 landed `color.ts:593`). kf rides transitively on
  the re-pin, zero kf edit. A-tier in flight.
- **The peer-declare realm-cast collapse** — value.js peer-declares parse-that so the
  dual-realm collapses and kf's `utils.ts:258` `as any` becomes a typed import. A
  dep-graph property, not a kf edit. Also the predecessor of a clean parse-that re-pin
  (so both realms converge on one minor — `a-constellation-gaps §2 G-HANDOFF-1`).

**parse-that-HANDOFF (the user drives directly under relaxed inv-16):**
- **The WITHHELD `(id,offset)` packrat re-key** — build `proof:packrat-position` (a
  same-parser-two-offsets test the id-only key FAILS and the `getCijKey` re-key PASSES)
  FIRST, THEN re-key. The one parse-that item F deliberately left undone (the no-legacy
  unsoundness cut). Blast radius contained to the isolated, opt-in BBNF left-recursion
  path (zero production consumers).

**glass-ui-HANDOFF (the user drives glass-ui directly; never re-mask in the demo):**
- **GG-3 / H-1** — grow `startViewTransition` to `mutate | {update, types?}` (NO
  back-compat alias — replaced surface replaced in one motion), feature-detect, call
  native `startViewTransition({update, types})`; ship the paired
  `:active-view-transition-type(forward|backward)` `transform`-only CSS recipe with
  PRM-zeroing. Unblocks the demo scene-VT (GG-4/FB-4 BOOK consumer). The kf demo stub
  (`G.W12` S3) FOLLOWS this, never leads.
- **The mobile dock occlusion in the rebuilt dock (GG-5-half / X-1 root)** — the
  mobile/full-bleed no-occlusion contract + the `--z-dock`-on-internal-layers hit-test
  fix + the 15px-sliver/hover-gated affordance. Sequenced behind glass-ui's rebuilt
  dock; the `G.W12` occlusion-gate re-run mask-free is the BITE that signals a residual
  is glass-ui's.
- **The reka `SelectIcon` re-export (GG-6 alt)** — glass-ui re-exports the reka
  primitives its `Select` family composes, IF a genuine raw-primitive need remains
  after the `G.W12` demo-local KILL. Low urgency.

**deploy-HANDOFF (kf AUTHORS; deploy/fourier WRITES):**
- **The CF-Pages template** — distil kf's `deploy-pages.yml` into
  `deploy/templates/deploy-pages.yml` (parameterized `<PAGES_PROJECT>`/`<BUILD_CMD>`),
  carrying the `head_branch == 'master'` anti-drift guard. Discharges ADOPTION-ASKS row
  113. kf authors the content + rationale; deploy writes.
- **The DNS P0 fix** — patch `dns-cf-sync.sh:105` `keyframes.pages.dev` →
  `keyframes-8uq.pages.dev`, drop the `UNVERIFIED` comment. Satisfies grand-audit M2.1
  owner-confirm from kf's tree. P0 (a blind sync regresses the live CNAME).
- **The stale CONSTELLATION roster refresh** — kf's roster row → "4.0.0 PUBLISHED
  (D+E+F); CF-Pages deploy-of-record live"; value.js → 0.11.0; the superseded
  ADOPTION-ASKS pins reconciled. fourier-hub refresh, not a kf write.

**Why:** these are the NET-NEW sibling producers the next slice needs, and consolidating
them into ONE sequenced ledger is the inv-16-relaxed discipline: the user drives them
in producer order, kf rides each on a re-pin, and the ordering is explicit so no leg is
double-owned by a kf-side wave or silently dropped (the P-invariant).

**What does NOT land here (recorded so no future lane re-raises):**
- **The kf re-pin itself (`G.W2`/RP-1..5)** — that is the kf-side SHIP that CONSUMES
  the PUBLISHED 0.11.0/0.9.0/3.3.0; it is NOT a HAND-OFF. The items here are the NEXT
  sibling slice, after the re-pin.
- **The kf-side consumers** — MorphSVG/numeric-MotionPath (BOOK G26-1), the
  `ResolvedKeyframes.diagnostics` seam (BOOK, gated on the value.js sink), the VJ-F4
  out-buffer consumption (rides the re-pin), the `parseLinearStops` excision (rides E1)
  — each is its own kf wave or rides `G.W2`; this wave only owns the PRODUCER ordering.
- **The DrawSVG / `.finished` SHIPs (`G.W13`)** — DrawSVG needs NO value.js geometry
  (one `getTotalLength()` DOM read); it is a kf-side SHIP, not a HAND-OFF.
- **The constellation MEASURE-FIRST/KILL re-affirms** (`a-constellation-gaps §3`):
  G-CONST-4 the CI `submodules:` omission (KILL, phantom gap — precepts is docs-only,
  no gate reads it); G-CONST-5 the node/action version skew (RECORD, kf is AHEAD);
  G-CONST-6 the precepts submodule (ALREADY-SOTA, synced). UNTOUCHED.

---

## § Scope

Each leg: WHAT (the sibling-side change) + WHY (the kf consumer it unblocks) + the
owner + the trigger/ordering. **ZERO of these edits keyframes.js source.**

### S1 — value.js: the path-geometry sampler VJ-F1 (`r-animation-sota G26-1`, `a-valuejs-leverage F-VJ-7`) — value.js-HANDOFF

**WHAT:** value.js ships a `d`-string → arc-length-parametrized point sampler
(`getPointAtLength`/`getTotalLength` over a parsed path), homed beside value.js's
`transform/decompose.ts`. **WHY:** unblocks the kf MorphSVG + numeric-MotionPath
consumer (BOOK G26-1) — the one real persisting competitor-feature gap (Motion/GSAP
MorphSVG). DrawSVG (`G.W13`) does NOT need it. **Owner:** value.js. **Trigger:** a
value.js wave + tag-publish; THEN the kf consumer wave (sequenced AFTER, a re-pin).
**Instrument (value.js side):** an arc-length parametrization test (sample a known
cubic at t=0/0.5/1, assert arc-length-uniform spacing).

### S2 — value.js: the buffer-reusing `unflattenObjectToString(flat, out?)` VJ-F4 (`a-engine-perf G-3`, `_SYNTHESIS-backend-constellation §3 G-PERF-2`) — value.js-HANDOFF

**WHAT:** a caller-owned out-buffer overload `unflattenObjectToString(flat, out?)` that
null-fills a compile-stable string buffer instead of minting `{}`+splits per frame
(`units/utils.ts:115-148`, the C1/F.W4 template). **WHY:** the REAL per-frame DOM-write
garbage on kf's hot path (`engine.ts:735` → `transformTargetsStyle` → `utils.ts:370`)
— ~10 split-arrays/frame for a K=10 transform. kf consumes the overload on the SAME
re-pin by threading a per-animation string buffer through `transformTargetsStyle`.
**Owner:** value.js. **Trigger:** publish; kf rides on the re-pin. **Instrument:**
value.js `%HasFastProperties` + alloc-count bench on the threaded buffer; kf folds the
DOM-write into `proof:zero-alloc` (NB the write path is currently OUTSIDE the zero-alloc
lock — a named gate gap worth closing on consumption).

### S3 — value.js: the structured-diagnostics sink + the `tryParse` `furthest` swap (`a-parsethat-leverage G-PT-3`, `_SYNTHESIS-deferred-ledger §1 VJ-F2`, `_SYNTHESIS-backend-constellation §6 G-HO-4`) — value.js-HANDOFF (HIGH)

**WHAT:** value.js's `tryParse` reads `state.furthest` (the real derail point), NOT
`state.offset` (the backtrack-restored point) — a one-field, strictly-more-correct,
isomorphic-for-non-backtracking swap; AND value.js exposes a structured
`parseResultWithDiagnostics` returning parse-that 0.9.0's `Diagnostic[]` under
`enableDiagnostics()` (the `onParseError` sink VJ-F2 specified, now buildable on the
shipped 0.9.0 producer). **WHY:** unblocks the kf `ResolvedKeyframes.diagnostics` seam
(the editor parse-error channel replacing the silent collapse — a kf BOOK consumer,
gated on this sink; do NOT half-wire). The producer half (parse-that `state.furthest`)
already landed in 0.9.0. **Owner:** value.js (after parse-that 0.9.0, which kf re-pins
in `G.W2`). **Trigger:** publish; THEN the kf diagnostics-seam wave. **Instrument
(kf consumer, gated):** a `fromString` test over a malformed `@keyframes` asserting a
non-empty `diagnostics` array with the `furthest`-correct offset/`expected` set.

### S4 — value.js: the F3 bounded LRU on `getComputedValue.cache` (`_SYNTHESIS-deferred-ledger §3 C-3`) — value.js-HANDOFF

**WHAT:** a bounded LRU (a `maxCacheSize` cap) on value.js's `getComputedValue.cache`,
ONCE in value.js's `memoize`. **WHY:** the C1 cache + `bumpLayoutEpoch().clear()` is a
wholesale-clear with no bound (FIFO default `Infinity`). The bound belongs in value.js;
a SECOND kf-side eviction policy is the DRY violation the ledger forbids. **Owner:**
value.js. **Trigger:** a future 0.x — kf inherits it free on the next re-pin. Re-open
trigger UNCHANGED: a measured editor memory footprint (none exists today). **No kf
edit.**

### S5 — value.js: the E1/E2 `linear()`/`steps()` parser + the kf shim EXCISION (`_SYNTHESIS-deferred-ledger §1 E1/E2 / §3 C-4`) — value.js-HANDOFF + a kf no-legacy collapse

**WHAT:** value.js ships the `linear()`/`steps()` PARSER → `LinearStop[]`. **WHY:** kf's
local `parseLinearStops` READER shim (`utils.ts:106-130`) RETIRES on land — kf EXCISES
it in the SAME motion (no compat alias beside the value.js parser, the no-legacy cut).
**Owner:** value.js. **Trigger:** publish; kf rides on the re-pin + EXCISES the shim.
`linear()` Baseline-WA 2026-06-11 (PAST). **Instrument (kf side):** the existing
`proof:roundtrip-easing` stays green over the value.js parser (the shim's job moves to
value.js, byte-stable for the registry-named + spring `linear()` cases).

### S5b — value.js: the native-WAAPI color path + the `currentColor`/`light-dark()` color sentinels (`a-valuejs-leverage F-VJ-4/F-VJ-5`, `_SYNTHESIS-backend-constellation §9 G-HO-10`, `_SYNTHESIS-deferred-ledger §1 F2/F2b`, `a-modern-css-interp MCI-2`) — value.js-HANDOFF

**WHAT:** two paired color hand-offs value.js owns at its color leaf. **(a) F-VJ-4 — the
S4 native-WAAPI color path:** value.js's `cssColorInterpKeyword` + the L4 serializer, with
the paired kf eligibility-lift on publish (a color animation over a value.js-emitted
WAAPI-color twin passes `isWAAPIEligible`). **(b) F-VJ-5 / F2/F2b — the color sentinels:**
value.js grows policy for `currentColor` / `light-dark()` / system-color / `contrast-color()`
inputs (today the parser REJECTS them, so kf has zero policy because they don't parse), with
the paired kf policy on publish. **WHY:** the color leaf lives ONCE in value.js (DRY); kf
consumes both through the unchanged `lerpValue → iv._lerp` seam. **Owner:** value.js.
**Trigger:** publish; THEN the paired kf eligibility-lift / policy lands the SAME motion.
**Sentinel constraints (binding):** `light-dark()` Baseline 2024-05-13 (HIGH);
`currentColor` HIGH; `contrast-color()` Baseline Apr-2026 (BOOK) — and it must NOT alias to
value.js's black/white-only `safeAccentColor`. MCI-2 (the color-interpolation sentinels) is
the same value.js-owned leaf, re-grounded by the supplemental modern-CSS-interp lane.
**Instrument:** value.js-side, a known-coordinate WAAPI-color round-trip + a sentinel-input
parse-accept test; kf-side, the paired eligibility / policy rides the next re-pin (ZERO kf
edit until value.js publishes).

### S6 — value.js: the dispatch-LUT inner forks + the peer-declare realm collapse (`a-parsethat-leverage G-PT-4/G-PT-2`, `a-backend-legacy F-BL-5`, `a-constellation-gaps §2 G-HANDOFF-1`) — value.js-HANDOFF

**WHAT (two related legs):** (a) convert the remaining `any(` forks → `dispatch()` LUT
(62 `any(` vs 2 `dispatch(`; A1 landed `color.ts:593`) — kf rides transitively on the
re-pin, zero kf edit; (b) value.js peer-declares parse-that (and re-pins its OWN
parse-that `^0.8.2`→`^0.9.0`) so the dual-realm collapses and kf's `utils.ts:258`
`as any` becomes a typed import over a SINGLE parse-that minor. **WHY:** (a) the A1
dispatch win extends to the rest of the classifier; (b) the realm collapse is the
clean structural elimination of the cross-realm cast — NOT a kf-side shim — and the
predecessor of a clean kf parse-that re-pin (so both realms converge). **Owner:**
value.js. **Trigger:** (a) in flight, kf rides on re-pin; (b) value.js re-pins
parse-that FIRST (ordering B of `a-constellation-gaps §1`), then kf's parse-that pin
lands over a converged minor. **Instrument:** the kf `G.W1`/`G.W2` `proof:deps-current`
realm-convergence clause (kf's parse-that minor === value.js's parse-that minor) bites
on a divergence.

### S7 — parse-that: the WITHHELD `(id,offset)` packrat re-key (`_SYNTHESIS-deferred-ledger §2 PT-4`) — parse-that-HANDOFF

**WHAT:** build `proof:packrat-position` (a same-parser-two-offsets test the id-only
`MEMO.get(p.id)` FAILS and the `getCijKey` re-key PASSES) FIRST, THEN re-key the
packrat to `(id,offset)`. **WHY:** the id-only key is latently wrong (a same-parser-two-
offsets collision); F ISOLATED the packrat off the hot path (+~36ns/parse relief,
opt-in, zero production consumers) but WITHHELD the re-key for lack of the position-test
lock — the one parse-that item F deliberately left undone (the no-legacy unsoundness
cut). The blast radius is contained to the isolated BBNF left-recursion path. **Owner:**
parse-that (the user drives directly under relaxed inv-16). **Trigger:** the
position-test lock built FIRST, THEN the re-key behind it. **Named, gated, completable
— NOT a perpetual punt.**

### S8 — glass-ui: the H-1 `{types}` helper + directional CSS (`a-glass-ui §2 GG-3`, `_SYNTHESIS-deferred-ledger §5 GG-3`) — glass-ui-HANDOFF

**WHAT:** grow glass-ui's `startViewTransition` to `mutate | { update, types? }` (NO
back-compat alias — replaced surface replaced in one motion), feature-detect
`document.startViewTransition`, call native `startViewTransition({ update, types })` on
the Baseline path; ship the paired `:active-view-transition-type(forward|backward)`
`transform`-only CSS recipe in `view-transition.css` (animate `translate`/`transform`,
never `inset`) with `prefers-reduced-motion` zeroing the slide. **WHY:** the platform
half is Baseline (active view transition 2026-01-13, PAST); glass-ui's bare-callback
signature can't express directionality. Unblocks the demo scene-VT (GG-4/FB-4 BOOK
consumer: `useSceneTransition.ts:32` → `startViewTransition({update, types:[dir]})`,
dir from the scene-index delta). The kf demo stub realign (`G.W12` S3) FOLLOWS this
helper, never leads it. **Owner:** glass-ui (the user drives directly; the helper + CSS
both live in glass-ui per MEMORY). **Trigger:** the glass-ui helper lands; THEN the
demo consumer (GG-4 BOOK). **Instrument:** a glass-ui object-form unit test + a kf
browser-driven VT-types assertion in the EXISTING `demo-smoke` Chromium job (NOT a new
gate).

### S9 — glass-ui: the mobile dock occlusion + the reka re-export (`a-glass-ui §3 GG-5-half / §4 GG-6`, `a-demo-playwright X-1`) — glass-ui-HANDOFF

**WHAT:** (a) the rebuilt dock handles the mobile/full-bleed no-occlusion NATIVELY +
applies `--z-dock` to its internal dock layers (so the dock wins the hit-test over a
full-bleed scene viewport) + addresses the 15px-sliver-at-rest / hover-gated
`pointer-events:none` affordance; (b) glass-ui re-exports the reka primitives its
`Select` family composes (GG-6 alt), IF a genuine raw-primitive need remains after the
`G.W12` demo-local KILL. **WHY:** (a) `G.W12` removed the demo's `:always-expanded`
mask; the mobile residual is glass-ui's root contract (never re-masked in the demo per
MEMORY `feedback_glass_ui_root_changes` / `project_dock_doubleclick`); (b) the one
borderline reka reach is best closed demo-local, with the re-export as the fallback.
**Owner:** glass-ui (the user drives directly). **Trigger:** sequenced behind glass-ui's
rebuilt dock contract; the `G.W12` occlusion-gate re-run mask-free is the BITE that
signals a residual is glass-ui's. **Instrument:** the `G.W12` `occlusion-gate.mjs` HARD
re-run mask-free on `square`/mobile.

### S10 — deploy: the CF-Pages template + the P0 DNS fix + the stale roster (`a-constellation-gaps §1 G-CONST-3 / §2 G-HANDOFF-2/3/4`) — deploy-HANDOFF (kf authors; deploy writes)

**WHAT:** (a) distil kf's `deploy-pages.yml` into `deploy/templates/deploy-pages.yml`
(parameterized `<PAGES_PROJECT>`/`<BUILD_CMD>`, carrying the `head_branch == 'master'`
anti-drift guard); (b) patch `dns-cf-sync.sh:105` `keyframes.pages.dev` →
`keyframes-8uq.pages.dev`, drop the `UNVERIFIED` comment (P0); (c) refresh the stale
CONSTELLATION roster (kf → "4.0.0 PUBLISHED (D+E+F); CF-Pages deploy-of-record live";
value.js → 0.11.0; the superseded ADOPTION-ASKS pins). **WHY:** (a) the spine is
MISSING a CF-Pages deploy template and kf authored the source-of-record hardened
against the exact branch-drift no-op a sibling lacks — discharges ADOPTION-ASKS row
113; (b) a blind DNS sync REGRESSES the live CNAME (the real subdomain is suffixed);
(c) the constellation docs lag published reality by a full tranche. **Owner:** deploy /
fourier (kf AUTHORS the template content + the DNS authoritative value + the roster
correction — read-only kf-side analysis; deploy WRITES). **Trigger:** the deploy/fourier
owner adopts. **Instrument (deploy side, named here):** `actionlint`/`shellcheck` of the
vended template + a one-line assertion it carries the `head_branch == 'master'` guard;
the DNS fix verified against kf's `deploy-pages.yml:4-5` + `pages-deploy.sh:47`.

> **RECORDED in this band — so no future lane re-litigates:**
> - **G-CONST-4** (CI `submodules:` omission) — **KILL** (phantom gap; precepts is
>   docs-only, no gate reads it; optional one-line intent comment).
> - **G-CONST-5** (node/action version skew) — **RECORD** (kf is AHEAD; the spine bumps
>   to match, kf needs no change).
> - **G-CONST-6** (precepts submodule) — **ALREADY-SOTA** (synced at `8ccf9f4`).
> - **The OUT-1..5 glass-ui enablers** (the `--spring-*` codegen LANDED, the
>   `springLinearStops()` value.js-free enabler, the reka-Tabs/`<Role>Dock` rail) —
>   **OUT** (glass-ui-owned; re-verify the enablers stay stable across the re-pin, no
>   kf patch).

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

This wave OWNS no kf-side source ship — its gate is the SEQUENCING contract + the
kf-side consume-locks that BITE when a producer's land is consumed. Each clause is a
real re-runnable instrument, not an assertion.

1. **EACH LEG HAS AN OWNER + A TRIGGER + A CONSUMER + A TERMINAL — the P-invariant
   ledger.** `proof:handoff-ledger` (a doc-grep over `G.WV`): every S1..S10 leg names
   (a) its sibling owner, (b) its explicit trigger/ordering, (c) the kf-side wave or
   re-pin that consumes it (or "no kf edit"), and (d) a terminal disposition
   (HANDOFF/BOOK/KILL/RECORD) — ZERO un-dispositioned punts. **BITE:** a leg with no
   named owner OR no consumer OR no terminal reds (the perpetual-punt detector,
   `_SYNTHESIS-deferred-ledger §9` P-invariant).

2. **THE REALM-CONVERGENCE LOCK BITES ON A DIVERGENCE (S6b).** The kf `G.W1`/`G.W2`
   `proof:deps-current` clause asserts kf's resolved parse-that minor === value.js's
   resolved parse-that minor. **BITE:** if kf re-pins parse-that `^0.9.0` while value.js
   still pins `^0.8.2` (the dual-realm divergence S6b targets), the clause reds — the
   SIGNAL that S6b (value.js re-pins parse-that first, ordering B) must land before the
   kf parse-that pin, NOT a kf-side shim. Green proves the realms converged.

3. **EACH value.js LEG LANDS BEHIND ITS OWN BITING BENCH IN value.js (S2/S1).** The
   MEASURE-FIRST discipline: VJ-F4 (S2) lands behind a value.js alloc-count bench (0
   bytes/frame on the out-buffer path, bite-proven by an alloc-inject); VJ-F1 (S1) lands
   behind the arc-length parametrization test. **BITE:** a value.js leg merged WITHOUT
   its bench/test green is a finding against the producer's own gate (the perf claim is
   behind the bench, not asserted). The kf-side consume re-runs `interp-buffer.bench`
   (computed-unit variant) + `proof:zero-alloc` (DOM-write fold) on the re-pin.

4. **THE PARSE-THAT RE-KEY HAS ITS POSITION-LOCK BUILT FIRST (S7).** `proof:packrat-
   position` (in parse-that) is a same-parser-two-offsets test the id-only key FAILS and
   the `getCijKey` re-key PASSES. **BITE:** the re-key MUST NOT merge until this lock is
   green and demonstrably bites on the id-only key (it reds before the re-key, greens
   after) — the no-ship-on-assertion discipline applied to the WITHHELD item.

5. **THE glass-ui + deploy LEGS ARE INSTRUMENTED ON THEIR OWN SURFACE, NOT kf's
   (S8/S9/S10).** GG-3 (S8) lands behind a glass-ui object-form unit test + the kf
   `demo-smoke` VT-types browser assertion (the EXISTING gate, not a new one); the
   mobile occlusion (S9) is signaled by the `G.W12` `occlusion-gate.mjs` HARD re-run
   mask-free; the deploy template (S10a) lands behind the deploy `actionlint`/`shellcheck`
   + the `head_branch == 'master'` assertion; the DNS fix (S10b) is verified against
   kf's authoritative `deploy-pages.yml:4-5`. **BITE:** a sibling leg with no
   surface-local instrument reds clause 1's "no terminal" sub-check.

6. **ZERO keyframes.js SOURCE/TEST/CI/DEMO EDIT ATTRIBUTED TO THIS WAVE.** A `git`
   scope check: this wave's diff touches ONLY sibling trees + this doc — NO
   `keyframes.js/src/**`, `test/**` (save the consume-locks the kf-side waves own),
   `.github/**`, `demo/**`. **BITE:** any kf source edit attributed to `G.WV` reds (the
   kf consumers are their OWN waves or ride `G.W2`; this wave is the HAND-OFF ordering,
   not a kf ship — inv-16 RELAXED but each surface is its own).

---

## § Folds

Retires (by finding id) — into the sequenced HAND-OFF ledger (the terminal home for
each cross-repo carry; the user drives, the producer lands, kf rides):

**value.js-HANDOFF:**
- **`a-valuejs-leverage F-VJ-7` / `r-animation-sota G26-1`** (VJ-F1 path-geometry
  sampler) — S1.
- **`a-engine-perf G-3`** (VJ-F4 buffer-reusing `unflattenObjectToString`) — S2.
- **`a-parsethat-leverage G-PT-3` / `_SYNTHESIS-deferred-ledger §1 VJ-F2`** (the structured-
  diagnostics sink + the `tryParse` `furthest` swap) — S3.
- **`_SYNTHESIS-deferred-ledger §3 C-3` (F3)** (the LRU bound, ONCE in value.js) — S4.
- **`_SYNTHESIS-deferred-ledger §3 C-4` (E1/E2)** (the `linear()`/`steps()` parser; kf
  EXCISES the `parseLinearStops` shim on land) — S5.
- **`a-valuejs-leverage F-VJ-4` (native-WAAPI color) + `F-VJ-5` / `_SYNTHESIS-deferred-ledger
  §1 F2/F2b` (the `currentColor`/`light-dark()` color sentinels) + `_SYNTHESIS-backend-
  constellation §9 G-HO-10` + `a-modern-css-interp MCI-2`** (the value.js color leaf —
  native-WAAPI color path + the sentinels; paired kf eligibility-lift / policy on publish) — S5b.
- **`a-parsethat-leverage G-PT-4` (dispatch-LUT forks) + `G-PT-2`/`a-backend-legacy
  F-BL-5`/`a-constellation-gaps G-HANDOFF-1` (the peer-declare realm-cast collapse +
  the value.js parse-that re-pin)** — S6.

**parse-that-HANDOFF:**
- **`_SYNTHESIS-deferred-ledger §2 PT-4`** (the WITHHELD `(id,offset)` packrat re-key;
  build `proof:packrat-position` FIRST) — S7.

**glass-ui-HANDOFF:**
- **`a-glass-ui GG-3` / `_SYNTHESIS-deferred-ledger §5 GG-3` (= H-1)** (the `{types}`
  helper + `:active-view-transition-type()` CSS, unblocking the scene-VT FB-4/GG-4) — S8.
- **`a-glass-ui GG-5`-half / `a-demo-playwright X-1` (root)** (the mobile dock occlusion
  + `--z-dock` internal-layers in the rebuilt dock) + **`a-glass-ui GG-6`** (the reka
  `SelectIcon` re-export, alt to the `G.W12` demo-local KILL) — S9.

**deploy-HANDOFF (kf authors; deploy/fourier writes):**
- **`a-constellation-gaps G-CONST-3` / `G-HANDOFF-2`** (kf's `deploy-pages.yml` → the
  spine CF-Pages template) — S10a.
- **`a-constellation-gaps G-HANDOFF-3`** (the P0 `dns-cf-sync.sh` fix) — S10b.
- **`a-constellation-gaps G-HANDOFF-4`** (the stale CONSTELLATION roster refresh) —
  S10c.

**RECORDED / KILLED in this band (do NOT re-litigate):**
- **`a-constellation-gaps G-CONST-4`** (CI `submodules:`) — KILL (phantom gap).
- **`a-constellation-gaps G-CONST-5`** (node/action skew) — RECORD (kf AHEAD).
- **`a-constellation-gaps G-CONST-6`** (precepts submodule) — ALREADY-SOTA (synced).
- **`a-glass-ui §5 OUT-1..5`** (the LANDED glass-ui enablers) — OUT (re-verify stable
  across the re-pin; no kf patch).

---

## § Design decisions (the trade-offs RESOLVED)

1. **CONSOLIDATE the cross-repo work into ONE HAND-OFF wave, not scatter it across
   producer waves.** RESOLVED: the inv-16 relaxation lets the user drive the siblings,
   but each is its own surface (`_SYNTHESIS-gap-scorecard §THESIS`). Consolidating the
   value.js / parse-that / glass-ui / deploy producers into ONE sequenced ledger makes
   the ordering EXPLICIT (producer first, kf rides on a re-pin) and the P-invariant
   checkable (every leg has an owner + trigger + consumer + terminal). Scattering them
   into the kf-side waves would blur which surface owns what — the exact double-ownership
   the band→wave map's Band V exists to prevent.

2. **The re-pin (`G.W2`) is the kf SHIP; THESE are the NEXT slice — keep them
   distinct.** RESOLVED: `G.W2` consumes the PUBLISHED 0.11.0/0.9.0/3.3.0 (the F slice)
   with ZERO kf source edit through `iv._lerp`. The items here are the still-OPEN
   sibling producers for the slice AFTER that (`_SYNTHESIS-deferred-ledger §1` "the
   charter stays open for value.js's next wave"). Conflating them would re-litigate the
   CHRONIC-by-design charter as if it were a kf punt — it is not; the process works and
   ships a slice every tranche.

3. **The LRU bound, the realm collapse, and the shim excision live in the PRODUCER, not
   kf.** RESOLVED: the §Mandate's DRY + no-legacy + no-boundary-breach. F3 belongs ONCE
   in value.js (a second kf eviction policy is a DRY violation); the cross-realm cast
   collapses when value.js peer-declares parse-that (not via a kf shim); the
   `parseLinearStops` shim EXCISES when value.js E1/E2 lands (no compat alias beside the
   parser). Each is the structural fix in the right repo — kf rides the result on a
   re-pin, zero kf-side workaround.

4. **The parse-that re-key lands ONLY behind a position-lock built FIRST.** RESOLVED:
   the no-ship-on-assertion discipline. F WITHHELD the re-key for lack of a position
   test; G's relaxed inv-16 lets the user complete it, but the §Mandate binds the order
   — build `proof:packrat-position` (which bites on the id-only key) FIRST, THEN re-key
   behind it. The blast radius is contained (the packrat is isolated, opt-in, zero
   production consumers), so the risk is bounded; the lock is the proof, not the claim.

5. **The dock mobile occlusion is glass-ui's ROOT contract, never re-masked in the
   demo.** RESOLVED: the binding MEMORY (`feedback_glass_ui_root_changes`,
   `project_dock_doubleclick`) — all dock changes live in the glass-ui repo. `G.W12`
   removed the demo's `:always-expanded` mask; if the mask-free occlusion gate reds, the
   residual is glass-ui's (the `--z-dock`-on-internal-layers + the mobile no-occlusion
   contract), fixed in the dock root. Re-adding the mask is the escape-hatch the
   §Mandate forbids.

6. **kf AUTHORS the deploy template + the DNS authoritative value; deploy WRITES.**
   RESOLVED: the constellation ownership boundary (deploy/fourier owns the spine). kf
   independently built the green-CI-gated `deploy-pages.yml` hardened against the exact
   branch-drift no-op a sibling lacks — so kf is the SOURCE OF RECORD for the missing
   CF-Pages template + the correct `.pages.dev` subdomain, but the WRITE into
   `deploy/templates/` + `dns-cf-sync.sh` is deploy's (read-only kf-side analysis →
   deploy adoption). The DNS fix is P0 (a blind sync regresses the live CNAME).

7. **This wave is sibling-tree-only — ZERO keyframes.js surface.** RESOLVED: every leg
   is a value.js / parse-that / glass-ui / deploy change, or kf-authored-deploy-written.
   The kf-side CONSUMERS (the VJ-F4 out-buffer thread, the `ResolvedKeyframes.diagnostics`
   seam, the MorphSVG consumer, the `parseLinearStops` excision) are their OWN kf waves
   or ride `G.W2` — NOT this wave. inv-16 RELAXED for G impl: the user drives the
   siblings, but each is HAND-OFF-tagged, its own surface, sequenced behind its producer.
