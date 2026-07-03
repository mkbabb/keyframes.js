# S.H — parse-that dispatch (own repo · ONE 1.0.0 publish then re-pinned · NO file: links)

**Band:** S.H — parse-that dispatch. **Track:** dispatch (SPEC §3, §3 DAG — the sole `dispatch`
track; the only band whose payload lands in a sibling repo).
**Phase:** DEVELOPMENT ONLY. This document + the SPEC-v3 evidence + PROGRESS.md's board ARE the S.H
deliverable. **No parse-that / keyframes.js source is written here.** The three live waves
(S.H1, S.H2, S.H4) open only on explicit owner authorization of the impl drive; **S.H3 is DE-SCOPED
to §8 Recorded-future** and authors nothing in S. A wave is CLOSED only when its born-RED gate is
GREEN *re-run on the merged tree*, exit code recorded in PROGRESS.md (T4; SPEC §7) — **except the
two publish-coupled S.H4 gates, which ship born-SPECIFIED** (they fire at the impl drive's publish
step — T4; SPEC §3 preamble line 454). inv-16 holds (kf writes only; the parse-that edits are a
DISPATCH to the sibling repo, owner-controlled).

**Charter.** S.H is the parse-that dispatch — the **first leg of Tranche S's single external SPINE**
(the only owner-controlled external motion; SPEC §1, §7 T12; owner rulings 3+5+6, 2026-07-03). It
carries three grounded, IN-REALM combinator-tier motions and one ledger-closure/cut wave, all landing
in **one 1.0.0 publish**; that 1.0.0 reaches kf ONLY via value.js's `^1.0.0`-carrying 2.0.x follow-on
(kf is parse-that-free), and kf **re-pins exactly once** at S.C4/S2 — TRUE BY RULING 6 (one re-pin
carrying both the parse-that-1.0.0 payload and the KF-1/2.0.0 payload; the letter's undercount
critique thereby resolved). The dispatch is combinator-tier ONLY — **no
bbnf-lang** (grammar-DSL work is a separate session's job; owner directive, r6 — SPEC §1). The
publish is a normal registry publish then a re-pin; **NO `file:` sibling links** in the manifest or
CI (SPEC §3 S.H title; the registry-consumption discipline). Two systemic facts anchor the band:

1. **The packrat default-path allocates on every parse (fold row 49; p11-confirmed).** `packratEnter`
   / `packratExit` construct three Maps on EVERY default-path parse even when nothing memoizes. p11
   measured **14–18% throughput on short CSS values and ~34% less retained heap** from arming the
   machinery behind a module latch — both above the 5% KILL floor, with soundness proven in the
   armed state (left recursion 2/2, p11 F6). S.H1 lands the arming.
2. **The 1.0.0 breaking cut retires dead surface + fixes a live falsy-seed bug (fold rows 48, 50).**
   span.ts + all 15 `*Span` exports are dead API (DQ-2), and `chain()` short-circuits on error
   BEFORE `chainError` is read — a falsy-seed (`0`/`''`/`false`) bug with `chainError` dead-on-error
   and zero callers (C-16). S.H2 deletes the dead surface and applies C-16's Option-A additive fix +
   retires the now-moot `chainError` param in the same breaking cut.

S.H4 closes the R-dropped ledger rows (DQ-1/DQ-2 — r8 F2), verifies fold row 46 (color2Into) at the
re-pin, records the deliberate non-goals + the two r6 decisions v1 dropped, cuts 1.0.0 (H1+H2
payload), and re-pins kf.
**INBOUND-LETTER NOTE (2026-07-03, `../VALUEJS-R-COORDINATION-2026-07-03.md`, b7fea38 — booked for the
record; the sequencing is now RULED):** value.js R has ADOPTED the S.H2→S.H4 trigger correction (their
parse-that re-pin book fires on S.H4's 1.0.0 cut, not S.H2); their `^1.0.0` follow-on publish
(2.0.x) runs with the widened verify (span-absence, the 4 live `.chain()` sites, a mirror of C-16's
chainError 0-caller scan, full suite) and is the ONLY carrier by which parse-that 1.0.0 reaches kf
(kf is parse-that-free); `color2Into` + their suite are committed green through the re-pin, so this
wave's fold-row-46 gate closes without firing its named exit. **The kf-side re-pin sequencing is RULED
(owner ruling 6, 2026-07-03): ONE kf re-pin, sequenced AFTER value.js's `^1.0.0`-carrying 2.0.x
follow-on — one adopt+verify carrying BOTH payloads (KF-1/2.0.0 + parse-that 1.0.0), not two re-pin
events.** The kf-side adopt+consume of that re-pin — the deletion map + `^2.0.x` — is **S.C4/S2** (the
ruled value.js-2.0.0 consume-edge, owner ruling 5; cross-ref `waves/S.C.md` S.C4/S2). **S.H3 (the Pratt binding-power combinator) is de-scoped to §8** — its
"design doc + external value.js sign-off" gate violated T1's runtime-tier absolutism and would have
created a THIRD external edge (SPEC §3 S.H3, §8-2).

**Mode declarations (C-14 — every wave states REWRITE or REFINE).** SPEC-v3's S.H section did not
pre-assign the modes; these apply C-14's default rule ("behavior-preserving zones verified honest by
the audit default to REFINE with explicit do-not-touch lists; structure waves default to REWRITE"):
- **S.H1 — REFINE** (arming is behavior-preserving: `packratEnter`/`packratExit` are true no-ops
  until a `memoize()` is constructed, and the memoize path is byte-identical when armed — soundness
  proven armed, p11 F6; **do-not-touch: the armed memoize path**).
- **S.H2 — REWRITE** (the 1.0.0 breaking cut: delete span.ts + 15 `*Span` exports, retire the
  `chainError` param — a source-breaking surface removal).
- **S.H3 — DE-SCOPED to §8 Recorded-future** (sh prune; no wave, no gate in S — not counted as a
  closable born-RED, x2).
- **S.H4 — REFINE** (ledger closure + publish/re-pin coordination; born-SPECIFIED gates).

**Band DAG (from SPEC §3 "The DAG", corrected sh-#6):**

```
S.H1, S.H2 parallel ;  S.H1 + S.H2 ──► S.H4 ──► (1.0.0 publish → kf re-pin) ──► before S.Z
```

- **S.H1 ∥ S.H2** — parallel; they touch disjoint parse-that surface (`packrat.ts` vs
  `span.ts`/`chain`), no intra-band collision.
- **S.H1 + S.H2 ──► S.H4** — H4 is the cut: **H1's perf patch AND H2's breaking cut land in ONE
  1.0.0 publish** (no interim release; kf re-pins exactly once, at S.C4/S2 after value.js's 2.0.x
  follow-on — owner ruling 6; SPEC §3 S.H preamble line 1159).
- **S.H4 ──► (1.0.0 publish → kf re-pin) ──► before S.Z** — the re-pin must land before the close
  band so S.Z1's cross-repo rows disposition through the kf-side CONSUME gate over the re-pinned
  build (SPEC §3 S.Z1, DAG line 1284).
- **External-edge status (T12 — the SPINE, owner rulings 3+5+6):** the whole plan has **ONE external
  SPINE**, not a set of edges: **S.H4's parse-that 1.0.0 cut → value.js's 2.0.x `^1.0.0`-carrying
  follow-on → the single kf re-pin+consume at S.C4/S2**. Two registry events on ONE owner-controlled
  causal chain; **no other external edge exists** (the former third-party glass-ui edge left the plan
  at the 2026-07-03 S.E shelf — glass-ui stays a book, never a gate; the 5.0.0 consume is an
  owner-domain HANDOFF). S.H4's gates are **born-SPECIFIED** and fire at the impl drive's publish
  step. **No other S wave may acquire an external dependency without an owner ruling** (SPEC §7 T12;
  §1 line 82).

**Fold rows this band terminalizes (SPEC §4):**
- Row **46** — `color2Into` cross-repo WATCH (born P, 2 tranches) → **DISPATCH (value.js), verified
  at S.H4 re-pin** (carried in H4's wave text, not just the table — sh-#7); **if unverifiable there,
  the named exit fires — never silently re-WATCHed** (SPEC §4 row 46).
- Row **47** — DQ-1 packrat re-entrancy landed? (born Q, 1 tranche) → **WAVE S.H4** (verify in
  0.13.0 — the current pin).
- Row **48** — DQ-2 parse-that dead API / `*Span` (born Q, 1 tranche) → **WAVES S.H2/H4** (H2 deletes
  the surface; H4 confirms it landed).
- Row **49** — parse-that packrat 3-Map default-path alloc (found r6, new) → **WAVE S.H1**
  (p11-confirmed perf wave).
- Row **50** — parse-that `chain()` falsy-skip bug (found r6, new) → **WAVE S.H2** (C-16 Option A:
  truly-additive fix + `chainError` retirement in the 1.0.0 cut).

**Rulings this band executes (SPEC §2.2):** **C-16** (chain() semantics — Option A, truly additive:
fix only the falsy-seed bug and retire the now-moot `chainError` param in the 1.0.0 breaking cut;
r6's `!state.isError || chainError` proposal REJECTED as it silently resurrects a live
continue-on-error path nothing uses); **C-14** (per-wave mode declaration).

**Tenets referenced (SPEC §7):** **T1** (no gate-shaped closures — the reason S.H3's design-doc gate
was de-scoped; every closable oracle is runtime-tier), **T4** (DEVELOPED ≠ SHIPPED — H1/H2 gates
ship born-RED; the two H4 publish-coupled gates ship born-SPECIFIED and fire at the impl drive's
publish step), **T12** (external gates are named, not assumed — S.H4 is the first leg of the plan's
single external SPINE; born-SPECIFIED, owner-controlled).

**Probes:** **p11 → S.H1/H2** (heap gate KEPT; the type ripple; gate isolation; honest changelog % —
SPEC §7 probe-adjustment index line 1797).

**Disposition rows this band answers (SPEC §9 sh-parse-that, 7 edits — all ABSORBED):** SH-1 (chain
semantics → C-16 / S.H2), SH-2 (probe-mandated type ripple → S.H1), SH-3 (memoize-free gate isolation
→ S.H1), SH-4 (the two r6-mandated recorded decisions → S.H4), SH-5 (correct the "E6 is the ONLY
external wave" claim; born-SPECIFIED framing → §1/T12/S.H preamble/S.H4), SH-6 (intra-band DAG
correction → S.H preamble/DAG), SH-7 (fold row 46 into H4's text; single-1.0.0-publish explicit →
S.H4 + preamble).

---

## S.H1 — Packrat-epoch arming (perf; p11-confirmed)

**Mode: REFINE.** Arming is behavior-preserving — no-ops until a `memoize()` is constructed; the
armed memoize path is untouched (SPEC §3 S.H1, §2.2 p11 index).

### Charter

The packrat machinery allocates on the default path even when nothing memoizes: `packratEnter` /
`packratExit` construct **three Maps on EVERY default-path parse** (fold row 49, found r6). p11
confirmed the fix is worth it — **14–18% throughput on short CSS values and ~34% less retained heap**
from arming the machinery behind a module latch, both **above the 5% KILL floor**, with soundness
**proven in the armed state** (left recursion 2/2, p11 F6). This wave introduces a `PACKRAT_ARMED`
module flag so the enter/exit calls become true no-ops until the first `memoize()` construction arms
the latch. (SPEC §3 S.H1, §2.1 p11 index.)

### Scope items

- **S1 — The `PACKRAT_ARMED` module flag.** `packratEnter` / `packratExit` are **true no-ops until a
  `memoize()` is constructed** — today the three Maps allocate on every default-path parse; arming
  gates them behind the flag. The latch is set on the first `memoize()` construction. (SPEC §3 S.H1.)
- **S2 — The probe-mandated type ripple (p11 ref.3, sh-#2).** `packratEnter()` returns
  **`PackratEpoch | null`** (or a shared sentinel); `packratExit(saved)` **null-guards** the saved
  value; `resetPackrat()` (`packrat.ts:230`) **early-returns when unarmed** — **decided: yes, for
  symmetry** (the resetPackrat decision the probe left open is resolved here). (SPEC §3 S.H1, §9
  SH-2.)
- **S3 — Soundness proven armed (p11 F6).** The arming preserves correctness in the memoized state:
  left recursion **2/2** in the armed path. This is the do-not-touch surface (C-14 REFINE): the armed
  memoize path is byte-identical to today.
- **S4 — Changelog honesty (SPEC §3 S.H1, §2.1).** The changelog states the honest, workload-scoped
  numbers: **"~30 ns / 3-Map alloc per top-level parse; mid-teens % on short CSS values, negligible
  on long strings; ~34% less retained heap"** — **never a flat 18%** (the throughput gain is
  workload-dependent; a single headline % would misrepresent it).
- **S5 — NO throughput-% gate (probe-confirmed flake trap; SPEC §8-13).** A throughput-percentage
  gate is **workload-dependent and a flake trap** — it is deliberately NOT authored. This is
  **recorded in §8-13** so a future pass does not "strengthen" the heap gate into a workload-
  dependent flake trap. The retained-heap clause (below) is the only born-RED perf oracle.

### The enumerated co-edit set

- `packrat.ts` — the `PACKRAT_ARMED` latch + `packratEnter`/`packratExit` no-op gating (S1); the
  type ripple `packratEnter(): PackratEpoch | null` + `packratExit` null-guard (S2); `resetPackrat()`
  at **`packrat.ts:230`** early-return-when-unarmed (S2).
- The parse-that changelog — the honest, workload-scoped perf note (S4).
- The retained-heap born-RED gate harness (NEW) — authored to run in a **memoize-free process** (see
  gate isolation, below).
- **§8-13** (recorded-future) — the "NO throughput-% gate on S.H1" note (S5); recorded, not a
  co-edited script.

### The HARD GATE — the retained-heap born-RED clause (memoize-free process)

**Gate name:** the retained-heap born-RED perf clause (NEW; parse-that-side). **NO throughput-% gate
is authored** (SPEC §8-13 — deliberately, to avoid a workload-dependent flake trap).

**What it asserts (one clause).** **N non-memoized parses allocate flat** — i.e. after arming, N
default-path parses that construct no `memoize()` allocate **zero** packrat Maps (the retained heap
stays flat across N iterations). (SPEC §3 S.H1.)

**Gate isolation requirement (sh-#3 — the binding constraint).** The retained-heap clause **MUST run
in a memoize-free process**: arming is a **process-global latch that never disarms**, so a **stray
`memoize()` construction anywhere in the gate's process false-REDs** the flat-heap probe. The
isolation is documented as a gate precondition; **p11's harness got it right by construction** (the
probe ran the flat-heap measurement in an isolated process). Any test file sharing the process that
constructs a memoizer would arm the latch and make the flat-heap assertion vacuously fail. (SPEC §3
S.H1, §9 SH-3.)

**Born-RED witness plan.** The gate is **born-RED on today's tree**: the default path constructs
three Maps on every parse, so N non-memoized parses do NOT allocate flat — the retained heap grows
per parse (fold row 49). After S1's arming lands, the same N parses allocate flat (no `memoize()`
constructed → latch unarmed → enter/exit no-op) → GREEN. **Non-vacuity:** run the clause in a process
that constructs a single `memoize()` before the flat-heap loop → the latch arms → the flat-heap
assertion reds (proving the isolation requirement bites); remove the arming gate from `packratEnter`
(revert S1) → the three-Map allocation returns → the flat-heap clause reds (proving the clause
measures the real allocation, not a source string).

**Falsifiability.** The clause measures **retained heap across N real parses** (runtime-tier — T1),
not a source grep — a stub that renames the flag cannot satisfy it because the assertion is over
actual allocation behavior in a memoize-free process. The **absence of a throughput-% gate is
deliberate** (SPEC §8-13) — the heap clause is device-independent (flat-vs-growing, not an absolute
ns/op threshold), so it reds honestly on any runner.

### Cost

**LOW–MEDIUM** — a module-flag gating of two hot functions + a three-symbol type ripple
(`packratEnter` return type, `packratExit` null-guard, `resetPackrat` early-return) + one born-RED
heap harness authored for process isolation. p11 executed the measurement (14–18% throughput / ~34%
heap) and proved soundness armed (2/2 left recursion), so the perf claim is probe-grounded, not
estimated. (SPEC §3 S.H1, §2.1 p11 index.)

### DAG

**Deps: none intra-band; parallel with S.H2** (disjoint surface — `packrat.ts` vs `span.ts`/`chain`).
**S.H1 + S.H2 ──► S.H4** (both are the 1.0.0 payload; H4 cuts them in one publish). (SPEC §3 DAG line
1284.)

### Verification

Impl sequence: (1) author the retained-heap born-RED clause FIRST, in a **memoize-free process** —
born-RED on the current tree (three Maps allocate per default-path parse; heap grows, not flat); (2)
land the `PACKRAT_ARMED` latch + no-op gating in `packrat.ts` (S1); (3) apply the type ripple —
`packratEnter(): PackratEpoch | null`, `packratExit` null-guard, `resetPackrat()` (`:230`)
early-return-when-unarmed (S2); (4) re-run the heap clause — must be GREEN (N non-memoized parses
allocate flat); (5) run the parse-that suite — soundness armed holds (left recursion 2/2, p11 F6),
all existing tests green; (6) write the honest changelog note (S4). **Note (recorded, not gated):**
the NO-throughput-% decision is recorded in §8-13 so a future pass does not strengthen the heap gate
into a flake trap (S5).

---

## S.H2 — The 1.0.0 legacy cut + the chain() fix (C-16)

**Mode: REWRITE.** A source-breaking surface removal (delete span.ts + 15 `*Span` exports; retire
the `chainError` param) landed in the 1.0.0 breaking cut (SPEC §3 S.H2, §2.2 C-16).

### Charter

The 1.0.0 cut deletes dead surface and fixes a live falsy-seed bug in `chain()`:
- **DQ-2 dead API (fold row 48):** `span.ts` + all **15 `*Span` exports** are dead API — no consumer,
  a Q-era leftover the SpanParser KILL (constellation) already superseded.
- **The `chain()` falsy-skip bug (fold row 50, C-16):** the live code short-circuits on error BEFORE
  `chainError` is read, so `chainError` is **dead-on-error today** and **no caller passes
  `chainError=true`** (verified: **0 hits in value.js and parse-that's own src**). r6's proposed
  `!state.isError || chainError` would **silently resurrect a live continue-on-error path** that
  nothing uses and the named regression test never exercises. **C-16 RULING: Option A — fix ONLY the
  falsy-seed bug and retire the now-moot `chainError` param in the same 1.0.0 breaking cut.**

(SPEC §3 S.H2, §2.2 C-16.)

### Scope items

- **S1 — Delete `span.ts` + all 15 `*Span` exports (DQ-2; fold row 48).** The whole dead surface is
  excised — body, exports, and the keep-gate assertion that names them (T6: an excision deletes the
  body, its tests, its gates, and its doc mentions — SPEC §7 T6). (SPEC §3 S.H2.)
- **S2 — Flip `dist-surface.test.ts` to zero-`*Span` (proof:no-span-surface).** The current keep-gate
  **asserts the presence** of the `*Span` exports — so **proof:no-span-surface is born-RED today**
  (the keep-gate must be inverted to assert their ABSENCE). (SPEC §3 S.H2.)
- **S3 — Apply C-16's Option-A `chain()` fix (fold row 50).** The exact fix:
  ```
  if (state.isError) return state;
  return fn(state.value).parser(state);
  ```
  This fixes the falsy-seed bug (a `0`/`''`/`false` seed value must thread to the continuation
  instead of being skipped). (SPEC §3 S.H2, §2.2 C-16.)
- **S4 — Retire the now-moot `chainError` param in the same breaking cut.** `chainError` is
  dead-on-error and 0-caller; its removal is a **documented removal** in the 1.0.0 breaking cut (not
  a silent drop). (SPEC §3 S.H2, §2.2 C-16.)
- **S5 — Refresh `parse-that/CLAUDE.md` (stale on four counts — r6).** The sibling repo's CLAUDE.md
  is stale on four counts; it is refreshed as part of the cut. (SPEC §3 S.H2.)

### The enumerated co-edit set

- `span.ts` — DELETE the file (S1).
- The 15 `*Span` export sites (the parse-that barrel / index) — remove every `*Span` export (S1).
- `dist-surface.test.ts` — flip from asserting `*Span` PRESENCE to asserting ABSENCE
  (**proof:no-span-surface**; born-RED today because the current keep-gate asserts presence) (S2).
- The `chain()` implementation — the Option-A two-line fix (S3) + `chainError` param removal (S4).
- The chain regression suite (NEW) — the `0`/`''`/`false`-seed thread test (red-then-green), a
  genuine-error short-circuit test, and the recorded **0-hit `chainError=true` caller scan** over
  **value.js + parse-that src** (S3/S4; C-16 gate).
- `parse-that/CLAUDE.md` — refresh the four stale counts (S5).

### The HARD GATE — `proof:no-span-surface` (born-RED) + the chain regression suite (red-then-green)

**Gate name:** `proof:no-span-surface` (the flipped `dist-surface.test.ts`) + the `chain()`
regression suite. Both born-RED today (SPEC §3 S.H2, §2.2 C-16).

**What they assert.**
- **proof:no-span-surface** — the published/dist surface carries **ZERO `*Span` exports** and no
  `span.ts`. **Born-RED today by construction:** the current keep-gate asserts the `*Span` exports
  are PRESENT, so the inverted (zero-`*Span`) gate reds on today's tree until S1 deletes the surface.
- **The chain regression suite** — three clauses (C-16 gate):
  1. **Falsy-seed thread (red-then-green):** a `0` / `''` / `false` seed value **threads to the
     continuation** (today the falsy-skip bug drops it → RED; after the Option-A fix → GREEN).
  2. **Genuine-error short-circuit:** an errored state **short-circuits** (the fix must not change
     the error path — `if (state.isError) return state;`).
  3. **The 0-hit `chainError=true` caller scan:** the recorded scan over **value.js + parse-that
     src** returns **0 hits** (proving the param is safe to retire — C-16's evidence for Option A).

**Born-RED witness plan.** `proof:no-span-surface` reds on today's tree (the keep-gate asserts the
`*Span` presence — the exact inverse of the target state); after S1/S2 it greens. The falsy-seed
regression test reds on today's `chain()` (the falsy seed is skipped — the fold-row-50 bug); after
S3 it greens. **Non-vacuity:** re-export a single `*Span` symbol after the cut →
`proof:no-span-surface` reds; revert the Option-A fix (restore the falsy-skip) → the falsy-seed test
reds; introduce a caller passing `chainError=true` → the 0-hit caller scan reds (proving the scan
measures real call sites, not a string).

**Falsifiability.** `proof:no-span-surface` reads the built dist surface (runtime-tier — T1), not a
source grep — a source stub that leaves a `*Span` alias in the barrel is caught by the dist-surface
scan. The chain regression suite exercises the real parser combinator (red-then-green), so it cannot
be satisfied by a source shape alone.

### Cost

**MEDIUM** — a surface deletion (span.ts + 15 exports) with a whole-tree symbol grep discharge (T6),
a two-line `chain()` fix + a param removal, a three-clause regression suite, and the CLAUDE.md
refresh. The breaking-cut nature (surface removal + param retirement) makes this a 1.0.0 payload, not
a minor. (SPEC §3 S.H2.)

### DAG

**Deps: none intra-band; parallel with S.H1** (disjoint surface — `span.ts`/`chain` vs `packrat.ts`).
**S.H1 + S.H2 ──► S.H4** (both are the 1.0.0 payload). (SPEC §3 DAG line 1284.)

### Verification

Impl sequence: (1) flip `dist-surface.test.ts` to zero-`*Span` FIRST — **proof:no-span-surface**
born-RED on today's tree (the keep-gate asserts presence); (2) author the chain regression suite
(falsy-seed thread red-then-green + genuine-error short-circuit + the 0-hit caller scan) — the
falsy-seed clause born-RED on today's `chain()`; (3) delete `span.ts` + all 15 `*Span` exports (S1);
run the whole-tree `*Span` symbol grep (T6 discharge-checklist step); (4) apply the Option-A
`chain()` fix (S3) + retire `chainError` (S4); (5) re-run **proof:no-span-surface** (GREEN — zero
`*Span` on the dist surface) + the chain regression suite (GREEN — falsy seed threads,
error short-circuits, 0-hit caller scan holds); (6) refresh `parse-that/CLAUDE.md` (S5).

---

## S.H3 — Pratt binding-power combinator — DE-SCOPED to §8 Recorded-future

**Mode: DE-SCOPED (sh prune).** No wave, no gate in S. **NOT counted as a closable born-RED** (x2).

The Pratt binding-power combinator design **survives as a design appendix/seed** over the Parser core
(with the value.js `math.ts` consume-edge sketch — SPEC §8-2). r6 rates it **LOW**; its proposed
gate ("design doc + external value.js sign-off") **violates T1's runtime-tier absolutism** and would
have been an ADDITIONAL external edge (T12 permits only the single external SPINE — S.H4's cut →
value.js's 2.0.x follow-on → the kf re-pin+consume at S.C4/S2; the former glass-ui edge left at the
2026-07-03 S.E shelf). It is **not implemented
without value.js ratification** and is **explicitly not a grammar-DSL move** (no bbnf-lang — SPEC §1,
§8-2). It authors nothing in S; it is recorded in §8-2 so the design is not silently lost.

(SPEC §3 S.H3, §8-2, §7 T1/T12.)

---

## S.H4 — Ledger closure + the cut (born-SPECIFIED)

**Mode: REFINE.** Ledger closure + publish/re-pin coordination; the two publish-coupled gates are
**born-SPECIFIED**, not born-RED (SPEC §3 S.H4, §1 line 83, §7 T4/T12).

### Charter

S.H4 is the cut and the ledger closure. It verifies the R-dropped ledger rows actually landed,
verifies fold row 46 at the re-pin, records the deliberate non-goals and the two r6-mandated
decisions v1 dropped, then **cuts 1.0.0 (the H1+H2 payload)**; kf re-pins exactly once — at S.C4/S2,
after value.js's `^1.0.0`-carrying 2.0.x follow-on (owner ruling 6), since kf is parse-that-free. It
is the **first leg of T12's single, owner-controlled external SPINE** (→ value.js's 2.0.x follow-on →
the kf re-pin+consume at S.C4/S2); its gates fire at the impl drive's publish step (born-SPECIFIED —
T4), because a publish-coupled gate cannot be run in the development phase. (SPEC §3 S.H4, §1, §7 T12.)

### Scope items

- **S1 — Verify DQ-1 (packrat re-entrancy) landed in 0.13.0 (fold row 47; r8 F2).** DQ-1 was
  **dropped from the R ledger** (r8 F2); H4 verifies packrat re-entrancy actually landed in the
  current **0.13.0** pin (SPEC §3 S.H4, §4 row 47).
- **S2 — Verify DQ-2 (dead API / `*Span`) landed (fold row 48).** Confirm the S.H2 surface deletion
  is reflected — DQ-2 was also dropped from the R ledger (r8 F2). (SPEC §3 S.H4, §4 row 48.)
- **S3 — Verify fold-row 46 (color2Into value.js WATCH) AT THE RE-PIN — carried in this wave's text,
  not just the table (sh-#7).** The `color2Into` cross-repo WATCH (born P, 2 tranches) is a value.js
  DISPATCH verified at the S.H4 re-pin. **If unverifiable there, the named exit fires — never
  silently re-WATCHed** (SPEC §4 row 46, §3 S.H4, §9 SH-7).
- **S4 — Record the deliberate non-goals.** **token streams · incremental · Squirrel LR · SpanParser
  resurrection** are recorded as deliberate non-goals of the 1.0.0 cut (SPEC §3 S.H4).
- **S5 — Record the two r6-mandated decisions v1 dropped (sh-#4).**
  - **r6 #6 — do NOT zone-partition parse-that:** the **subpath map IS the zone map**; splitting the
    **707-LOC `parser.ts`** is net-negative.
  - **r6 #8 — zero-copy is deliberately delegated to value.js's scanner layer:** the `*Span`
    retirement (S.H2) is the correct direction for the real consumer.
  (SPEC §3 S.H4, §9 SH-4.)
- **S6 — The WDM/LR keep is recorded as PROVISIONAL (pending the bbnf-lang LR-consumer question).**
  bbnf-lang is the one grammar-DSL that would exercise the Warth-Douglass-Millstein / left-recursion
  tier; arming (S.H1) **makes the tier free for the LL(1) constellation**. This is recorded as
  **PROVISIONAL** — **NOT** the process-latching "made free" claim: arming **never disarms**, so
  "free" holds **only for memoize-free processes** (the honest framing, distinct from a blanket
  "made free"). (SPEC §3 S.H4, §1 "No bbnf-lang".)
- **S7 — Cut 1.0.0 (H1+H2 payload); value.js carries it to kf.** **ONE 1.0.0 publish** (SPEC §3 S.H
  preamble, S.H4). **NO `file:` sibling links** anywhere. kf is **parse-that-free**, so parse-that
  1.0.0 reaches kf ONLY via value.js's `^1.0.0`-carrying 2.0.x follow-on (owner ruling 6) — **kf
  re-pins exactly once, at S.C4/S2**, adopting value.js `^2.0.x` (which transitively carries parse-that
  1.0.0; caret per the letter §1; never a `file:` link). value.js re-pins parse-that `^1.0.0` in its
  own manifest at the 2.0.x follow-on.

### The HARD GATES — born-SPECIFIED (fire at the impl drive's publish step)

**Gate names (three clauses; born-SPECIFIED — T4).** These are **not born-RED** because they are
publish-coupled: they fire at the impl drive's publish/re-pin step, not in development. (SPEC §3
preamble line 454, S.H4, §7 T4.)

- **(a) `proof:pin-ledger-current` reflects the new pin** — after the re-pin, the PIN-LEDGER records
  parse-that **1.0.0** (superseding 0.13.0); the gate reds if the ledger is stale against the
  published version.
- **(b) The kf-side CONSUME gate green** — kf's consume-edge gate is green against the re-pinned
  1.0.0 build (this is the oracle S.Z1's cross-repo rows disposition through — a sibling's internal
  gate is never cited as the oracle; SPEC §3 S.Z1).
- **(c) The value.js suite green against the re-pinned build** — value.js (the other real consumer)
  passes against the published parse-that 1.0.0, closing the color2Into verification path (S3).

### Born-SPECIFIED witness plan (why not born-RED)

A publish-coupled gate **cannot be exercised in the development phase** — there is no 1.0.0 artifact
to pin against until the impl drive publishes. The gate is therefore **SPECIFIED now and fires at the
publish step** (T4): at that point `proof:pin-ledger-current` must reflect 1.0.0, the kf-side consume
gate must be green, and the value.js suite must be green against the re-pinned build. **The re-pin
happens exactly once** (the H1 perf patch + the H2 breaking cut land in a single 1.0.0 — no interim
release). **Non-vacuity at the publish step:** a stale PIN-LEDGER (still naming 0.13.0) reds clause
(a); a kf consume failure against 1.0.0 reds clause (b); a value.js suite failure against the
re-pinned build reds clause (c) and, per fold row 46, the color2Into named exit fires (never silently
re-WATCHed). (SPEC §3 S.H4, §7 T4/T12, §4 row 46.)

### Falsifiability

Every clause is over the **re-pinned build actuating** (runtime-tier — T1): the PIN-LEDGER assertion
is checked against the actual published version, and the kf/value.js suites run against the pinned
1.0.0 — not a source string. The color2Into verification is bound to the value.js suite's green exit
at the re-pin (S3); if it cannot be verified there, the named exit fires (an owner-visible terminal),
so the row can never silently regress to WATCH.

### Cost

**LOW (development) / coupled (publish).** In development this wave authors the ledger-closure text,
the recorded non-goals + the two r6 decisions, the PROVISIONAL WDM/LR framing, and the born-SPECIFIED
gate definitions. The publish/re-pin motion itself is the impl drive's single publish step (one
1.0.0, one re-pin). The three born-SPECIFIED gates fire there, not now. (SPEC §3 S.H4.)

### DAG

**Deps: S.H1 + S.H2** (both are the 1.0.0 payload — H4 cuts them in one publish). **S.H4 ──► (1.0.0
cut → value.js 2.0.x `^1.0.0` follow-on) ──► S.C4/S2 (the single kf re-pin+consume — owner rulings
5+6) ──► before S.Z** (the re-pin must precede the close band so S.Z1's cross-repo rows disposition
through the kf-side CONSUME gate over the re-pinned build). **S.H4 is the first leg of T12's single
external SPINE** (born-SPECIFIED, owner-controlled). (SPEC §3 DAG line 1284, §7 T12.)

### Verification

Impl sequence (at the authorized impl drive): (1) verify DQ-1 packrat re-entrancy landed in 0.13.0
(S1) and DQ-2 dead-API deletion is reflected (S2); (2) author the recorded non-goals (token streams,
incremental, Squirrel LR, SpanParser resurrection — S4) + the two r6 decisions (no zone-partition;
zero-copy delegated to value.js's scanner — S5) + the PROVISIONAL WDM/LR framing with the
honest "free only in memoize-free processes" caveat (S6); (3) cut **1.0.0** (the H1+H2 payload) —
**ONE publish** (S7); (4) value.js publishes its `^1.0.0`-carrying **2.0.x** follow-on (their §3
commitment); kf then **re-pins exactly once, at S.C4/S2** — value.js `^2.0.x` in the manifest (which
transitively carries parse-that 1.0.0; **NO `file:` link**; caret per the letter §1), owner ruling 6;
(5) at the publish/re-pin step the three **born-SPECIFIED** gates fire — `proof:pin-ledger-current`
reflects the new pin (a), the kf-side consume gate green (b — the S.C4/S2 deletion map + the
resolve-tier KF-1 vector), the value.js suite green against the re-pinned build (c); (6) **verify fold
row 46 (color2Into) AT THE RE-PIN** via the value.js suite green (S3) — if unverifiable, fire the
named exit (never silently re-WATCH). The re-pin lands **before S.Z** so S.Z1's cross-repo rows
disposition through the kf-side CONSUME gate.
