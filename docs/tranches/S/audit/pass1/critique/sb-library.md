# CRITIQUE — sb-library (Band S.B: Library sub-zoning + boundary hardening)

**Agent:** adversarial critique · **Scope:** S.B1–B8 (constants seam · engine/css/ · PlaybackState ·
compile/backward/ · barrels + ownership inversion · near-ceiling pre-carve · type trim · ./engine
drift gate · CLAUDE.md regen).
**Probe evidence:** p01 (engine/css), p02 (PlaybackState), p03 (constants), p07 (loader-unify).
**Live-tree spot-checks performed** (probes are throwaway-worktree; I re-verified the two load-bearing
counts against `tranche-s-dev`).

**VERDICT: developing — sound shape, two gate-honesty defects + one hard B2/B5 ceiling contradiction
block impl. convergence 64%.**

The band is the best-grounded in the spec: three of four probes returned *confirms-spec*, one
*adjusts-spec*, and every ruling (C-1, C-2, C-5, C-9, C-11) survives challenge. The defects are
concentrated in **B2** (the most complex wave, which mutates two already-at-ceiling files) and in
**B6's mirror gate** (which the spec's own sequencing renders vacuous). All are mechanically fixable in
SPEC-v2 via the blocking list — none re-litigates a ruling.

---

## Live-tree verification (before critiquing, I confirmed the probe substrate)

```
$ grep -rln 'css-animation\|css-metadata' scripts/ | wc -l   → 9   (p01 F-d confirmed exactly)
$ wc -l engine/animation.ts engine/playback.ts               → 499 / 498  (both at ceiling)
$ wc -l group/group.ts frame-compiler.ts spring/progress.ts
       sequence/sequence.ts presets/classic.ts               → 496 / 499 / 499 / 499 / 728
```

Both of p01's and p02's load-bearing measurements reproduce on the real branch. The near-ceiling six
and classic.ts(728, the last override) are exactly as S.B5 claims.

---

## 1. What the probes ADJUSTED that SPEC-v1 has not absorbed (predates them)

### 1.1 — B2 gate is DISHONEST as written (p02 F3) — the single most serious finding

SPEC-v1 B2 gate: *"FSM transition fields reached only via PlaybackState (plant a class-body mutation →
RED)."* p02 proves this oracle is **un-gateable on the non-breaking path**: the 8 FSM fields are a
*public, externally-written* surface (`anim.paused = true`, `contractAnim.t = p*duration`) read/written
by `group/`×4, `sequence/`×2, `ingest/adopt.ts`, `waapi/delegation.ts`, 107 test sites, and the demo
contract-animation pattern (p02 F1, F2). The only non-breaking fold routes those writes through
getter/setter delegates — so `anim.paused =` stays legal *everywhere*, and "reached only via
PlaybackState" can never be asserted. This is exactly the r2 **T1/gate-shaped-but-not-runtime** failure
mode the charter swears off. Honest reframe (p02 F3): the gate must assert *"no FSM field is DECLARED
on the class body (accessors only),"* and the goal is **single-STORAGE, not single-writer**.

### 1.2 — B2's "animation.ts shrinks" is FALSE (p02 F3/F4) + a hard ceiling contradiction (verified)

SPEC-v1 B2: *"animation.ts shrinks to config+compiler+sample delegates."* p02 MEASURED the opposite —
the delegate fold **grows** the class body 442→455L (+13) because 8 field declarations become 8
getter/setter pairs. On the live tree `engine/animation.ts` is **499L** and `engine/playback.ts` is
**498L** — both one-to-two lines under the 500 ceiling. The FSM fold pushes animation.ts to ~512L and
(adding 8 fields to `PlaybackState`) playback.ts past 500 as well. **Yet B2's own gate demands
"proof:decomposition green with headroom."** The carves that would restore headroom
(`engine/animation 499`, `engine/playback 498`) live in **S.B5, which DEPENDS ON B2** (DAG:
`B2→B4→B5`). So B2, as sequenced, transiently reds proof:decomposition and cannot satisfy its own gate.
The spec's mental model ("much of this falls out of B2/B3/B4") is wrong here: moving the css pair out of
`engine/` does not touch animation.ts's line count, and the fold *consumes* headroom rather than
creating it. **Resolution: pull the animation.ts + playback.ts ceiling carves forward from B5 into B2.**

### 1.3 — B2 is a 10-site / 9-script gate co-edit, not 1 (p01 F-d, verified live)

SPEC-v1 B2 names only *"make proof-engine.mjs's scan RECURSIVE."* p01 found — and I confirmed on the
live tree (9 scripts) — that `proof-{nan-frame,processframe-soa,soa-composite}` (dynamic-import
probes), `proof-{replay-equality,diagnostics-channel,composition-honored}` (CSS_ANIMATION const),
`proof-platform-adopt` (both css files), and `proof-no-silent-fallback` (css-metadata excise-set) all
hardcode the engine CSS paths. The `css-metadata.ts → metadata.ts` rename the design mandates edits all
of them. The trap p01 §5 names precisely: a wave that runs only the Q1 SUCCESS subset (`check:lib +
build + proof:engine + proof:decomposition`) **goes green while 8 other gates are red** — only
`proof:all` catches it. B2 must be gated on `proof:all`, and the 9-script co-edit must be enumerated in
the wave text.

### 1.4 — B6 mirror gate is VACUOUS after the very collapse it precedes (p07 final finding)

SPEC-v1 B6: *"the engine-subpath mirror gate (Object.keys(dist/engine/index.js) ≡ loadAnimationEngine()
runtime keys …), **then** collapse the triple hand-definition by rewriting loadAnimationEngine to
import("./engine/public")."* The sequencing is self-defeating. **Before** the collapse the two key
lists are independently hand-written, so equality is meaningful. **After** the collapse
`loadAnimationEngine()` sources from `engine/public`, which is the *same module* `dist/engine/index.js`
is built from (p07 §3: Rolldown dedupes them into one 97 kB chunk). Object.keys(both) then read from the
identical import — the equality is trivially, permanently 39/39, and B6's own born-RED probe ("delete a
public.ts re-export → RED") **stays GREEN** because the deletion drops the key from *both* sides at once.
This is an r2 **T1 self-certifying gate**. Fix (p07 finding): the gate must diff **runtime keys ⊆ the
`AnimationEngine` d.ts TYPE key list** — the type interface is the one surface that stays independently
hand-maintained (a `typeof import()` can't back API-Extractor's roll-up per the file's own header), so
it is the only non-vacuous drift oracle post-collapse.

### 1.5 — B1's acceptance is under-specified (p03 F2)

SPEC-v1 B1: *"~55 consumers repointed; Gate: proof:boundary + a new clause: no light zone imports the
heavy half."* p03 shows the structural win is realized only by **repointing the 10 LIGHT importers to
`constants/types`** (the 38 heavy importers keep the barrel); a split that leaves light code on the
bare `../constants` barrel buys nothing (the barrel re-exports `./defaults`, still a value.js edge).
And "no light zone imports the heavy half" is essentially today's whole-surface `proof:boundary` scan —
the *stronger* gate p03 proves is a **file-level assertion**: `grep '^import ' constants/types.ts` must
reject any non-`import type` line (p03 F1/F2/§4). The "~55 consumers" figure overcounts the mandatory
work (10 light repoints; heavy is optional barrel-kill).

---

## 2. Challenge on the loader-collapse (my assignment's explicit question)

*"Challenge whether that chunk-graph change [20 lazy chunks → 1× 97 kB] is acceptable, or the drift GATE
alone suffices."*

**Finding: the drift GATE is the load-bearing hardening; the loader collapse is a nice-but-optional
simplification the spec wrongly bundles as mandatory.** p07 shows the collapse is behaviorally neutral
*today* — `loadAnimationEngine()` already `Promise.all`-awaits all 11 imports up front, so there was
never per-symbol lazy splitting; a caller reaching for `MotionPath` alone already paid for
ingest/scroll/compile/validate/presets both before and after (p07 §3). Net effect: −100 LOC, −6% bytes,
23→5 total `.js` files, drift-proof-*by-construction* for the runtime. The one real cost is
**foreclosed optionality**: a hypothetical future consumer wanting partial-engine splitting
(MotionPath without ingest/scroll) loses the granularity, and no such consumer exists today (p07 §5).

So: the collapse is *acceptable* and even an improvement — **but it must not be the gate.** The a08
finding ("39-key mirror not drift-proof") is closed by the **redefined type-diff gate (1.4)**, which
holds whether or not the loader is collapsed. SPEC-v2 should (a) keep the type-diff drift gate as the
mandatory B6 item, and (b) demote the `import("./engine/public")` collapse to an owner-recordable option
with the chunk-count/size/foreclosed-split cost recorded per Q7's own escape clause ("a single fatter
chunk may be acceptable; record the number for the owner"). p07 supplies the number: one 97.32 kB chunk,
dynamic-engine-chunks 2→1.

---

## 3. Idiomatic-gestalt audit (no band-aids?) — mostly clean

- **C-1 (engine/css/) — REAL cohesion, not ceremony.** p01 F-a/F-b: `metadata.ts` has exactly one
  importer, nothing outside `engine/` reaches in, the barrel is the one idiomatic zone barrel, source
  churn = 1 site. The carve is forced anyway by the 499/498 ceiling. Confirmed.
- **C-2 (REJECT compile/easing/, create compile/backward/) — sound.** The forward↔backward zero-edge
  seam is the real cohesion argument; killing the easing-option re-export bridge is a transposition, not
  a patch. B3's gate ("no re-export-only bridge module anywhere in src/animation") is falsifiable and
  catches the a18+a19 class in one clause. Not probed — flagged unverified but structurally sound.
- **B4 ownership inversion (service-locator → AnimationGroup.of()).** The transposition the charter
  demands (excise `.group()`, delete the singleton + register side-effect, migrate the one demo caller).
  Gate "plant a re-added `.group()` → RED" is falsifiable. Large, unprobed; no red flags but note the
  breadth. The **B4 stretch** (collapse 26 type-only rings + delete viaOnly exemption) should be
  **record-future**, not gated on B4 — it is optional cleanup that could balloon the wave.
- **B5 keystone (empty the override map).** Verified: classic.ts is the sole 728L override entry;
  splitting it → classic-data.ts empties the Map, completing R.W0. Gate "EMPTY override map + max file
  ≤~460L" is honest T2-compliant (caps only shrink). Clean — *provided* B2's carves are pulled forward
  (1.2), else B5's animation.ts/playback.ts carves are doing double duty B2 already reds on.
- **B8 (regen-last, gate-first).** The R.W0 keystone pattern applied to docs — proof:claude-paths-live
  born-RED at A5, green at B8. Idiomatic; no objection.

---

## 4. Missing from the band that the evidence demands

1. **The hard-fold escape hatch is under-booked (p02 §3.3).** If the owner ever wants *literal*
   single-writer (fields off the class entirely), it is a **breaking-surface** wave: 107 test sites + the
   demo contract-anim writes (`contractAnim.t =`) + a public `seek(ms)` verb + a MIGRATION doc — which
   collides with S.Z3's "additive-minor by default." The spec should explicitly record: S ships the
   **delegate/single-storage** fold; the hard fold is a future breaking tranche gated behind adding
   `seek()` first. Right now B2 reads as if single-writer is the target, which is false.
2. **B2 must RULE element-resolve.ts's home** (a17 F5 header votes `resolve/`) rather than leaving
   "decide element-resolve.ts's home" as an in-wave open question. An implementable wave doesn't carry a
   live design decision.
3. **The B2/B5 sequencing constraint is un-stated in the DAG.** §3.7's cross-lane note lists a19's
   engine↔group constraint but not the ceiling-carve-into-B2 constraint (1.2). SPEC-v2's DAG must reflect
   that the animation.ts + playback.ts carves are B2-internal.

---

## 5. Prune / record-future

- **B4 stretch** (26 type-only rings + viaOnly exemption) → record-future; do not gate B4 on it.
- **B6 loader→import("./engine/public") collapse** → demote to owner-recordable option; the type-diff
  drift gate is the mandatory item (§2).
- **B1 "~55 consumers repointed"** → correct to "10 LIGHT importers → constants/types; heavy keeps the
  barrel" (ceremony overcount).

---

## 6. Scoring — convergence 64%

Deductions from 100 (each defect is present in SPEC-v1; all are mechanically fixable via §7 blocking):

- **−15** dishonest gate: B2 "FSM fields reached only via PlaybackState" is un-gateable non-breakingly
  (1.1 / p02 F3).
- **−15** dishonest/vacuous gate: B6 mirror gate is runtime-vs-runtime, trivially 39/39 after the
  loader collapse it precedes (1.4 / p07).
- **−10** missing item: B2's 9-script/10-site gate co-edit unnamed; wave greens on the Q1 subset while
  8 gates red (1.3 / p01 F-d, verified).
- **−10** feasibility contradiction: B2 grows two already-at-ceiling files (499/498) but demands
  proof:decomposition-green-with-headroom; the carves are in dependent B5 (1.2, verified live).
- **−10** open design question: B2 leaves element-resolve.ts's home undecided (§4.2).

Total −60 from a base I set at 124 for a band whose four probes returned three *confirms* and whose
rulings all survive (i.e. the band's shape is worth a premium over a bare 100). Net **64%**. The band is
NOT implementable as-written — B2 has a live ceiling contradiction and B2/B6 each ship an r2-catalogue
dishonest gate — but every defect is closed by the §7 blocking edits with no ruling reopened.

---

## 7. BLOCKING — mandatory SPEC-v2 edits before an S.B impl drive

1. Reword the B2 FSM gate from "fields reached only via PlaybackState" to **"no FSM field is DECLARED
   on the class body — accessors only"**, and reframe the goal as **single-STORAGE, not single-writer**
   (p02 F3).
2. Strike B2's "animation.ts shrinks to config+compiler+sample delegates" — the non-breaking delegate
   fold GROWS the class body 442→455L (p02 F3/F4, verified 499L file).
3. Pull the `engine/animation.ts`(499) and `engine/playback.ts`(498) ceiling carves FORWARD from B5
   into B2, and state it in the DAG — the FSM fold pushes both past 500, and B2's own gate demands
   proof:decomposition-green-with-headroom (1.2, verified live).
4. Enumerate B2's **9-script / 10-site** gate co-edit (proof-engine recursive + 8 hardcoded css-path
   gates) and gate B2 on **proof:all**, not the Q1 subset (p01 F-d, verified 9 scripts).
5. RULE element-resolve.ts's home in B2 (a17 F5 header → `resolve/`) instead of "decide."
6. Redefine `proof:engine-subpath-mirror` to diff **runtime keys ⊆ AnimationEngine d.ts TYPE keys** —
   the runtime-vs-runtime form is vacuous once the loader sources from the same import (p07 final).
7. Decouple B6's mandatory drift GATE from the optional `loadAnimationEngine→import("./engine/public")`
   collapse; record the 23→5-chunk / single-97 kB / foreclosed-partial-split cost for the owner per Q7's
   escape clause (p07 §3/§5).
8. Sharpen B1's gate to a FILE-level assertion (reject any non-`import type` line in `constants/types.ts`)
   and state acceptance as "every LIGHT importer targets `constants/types`; heavy keeps the barrel";
   correct "~55 consumers" to the 10 mandatory light repoints (p03 F1/F2).
9. Book the literal single-writer hard fold as a FUTURE BREAKING wave (107 test sites + demo
   contract-anim writes + a public `seek(ms)` verb + MIGRATION), explicitly out of S scope — it collides
   with S.Z3 additive-minor (p02 §3.3).
