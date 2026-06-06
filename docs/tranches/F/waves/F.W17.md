# F.W17 — The close (the F FINAL · the changeset · the wf-*.mjs provenance · the publish leg)

**Phase:** IMPL · **Class:** LAST · **Scope:** `docs/tranches/F/FINAL.md` (authored AT close) +
`docs/tranches/F/audit/` (recap confirmed, ledger re-confirmed) + `.changeset/` (the F changeset
+ named version owner) + the UNTRACKED `wf-*.mjs` workflow scripts (committed for provenance) ·
**DAG: F.W17 closes** (`F.md §The DAG` — Band Z, gated on every prior F wave green: F.W1–F.W16) ·
**Gated on:** keyframes' own green CI (inv-27); the publish leg stays USER-DOMAIN, confirm-first.

**Title.** *F's last wave closes the tranche the way D and E closed: the prompt-recap confirmed,
the deferred ledger re-confirmed CLEAN (zero KFE — F folded no chronic debt because none remained),
the FINAL authored in D/E's gate-table-backed voice, the changeset cut atop the stacked B+C+D+E
with a named version owner, and — F's own provenance leg — the `wf-*.mjs` scripts committed so
"how was this tranche produced" is answerable from history.*

This wave writes **docs + a changeset + the provenance scripts only.** No engine, demo, or library
source changes here — F.W1–F.W16 did the work; F.W17 records it, proves no regression, and cuts the
release. The mandate (`F.md §Mandate`) is the spine of the close: every recorded-MET gate resolves
to a checked-in, re-runnable instrument shown to PASS — not a narration (inv ε); every value.js item
remained a HAND-OFF the value.js owner sequences (inv-16); the close manufactures no work.

**Provenance.** `a-tranche-retro-F §4` (commit the `wf-*.mjs` workflow provenance — SHIP-in-F, BOOK,
low priority) + `F.md §F.W17` (the F FINAL + the changeset stacked atop B+C+D+E + the named version
owner + the user-domain publish leg) + `_SYNTHESIS-deferred-ledger §0` (the ledger is CLEAN — zero
KFE) + `a-tranche-retro-F §1` (F folds no chronic debt).

---

## § State, verified (not asserted)

The live facts, read- and git-confirmed on `tranche-e-impl`:

1. **The deferred ledger F inherits is CLEAN — zero KFE.** `_SYNTHESIS-deferred-ledger §0`
   (re-grounded): D was the terminal home for every keyframes-owned deferral (P-invariant-28); the
   consolidated ledger holds ZERO KFE rows. F folds NO chronic debt into any wave (`a-tranche-retro-F
   §1/§7`). Of the 6 chronic items, **C-2 (the `AnimationOptions→CSSAnimationOptions` rename) EXITS
   the band at F** (discharged by the 0.10.0 pin — kf imports neither name), **C-1 (the value.js
   charter) is chronic-by-design** (Band V), and the rest are value.js-gated / half-landed / the
   gated library line-ceiling decision (Band 0's BOOK).

2. **The version is `3.0.0`; the B+C+D+E changesets are cut, stacked, UNPUBLISHED.** Verified:
   `package.json:3` `"version": "3.0.0"`; `.changeset/` holds `tranche-b-3-1-0.md` (`3.1.0`),
   `tranche-c.md` (major), `tranche-d.md` (major), `tranche-e.md` (minor) — all cut, never published
   (`F.md §F.W17`). So the F changeset stacks atop them; one provenance-signed publish ships the whole
   B+C+D+E+F provenance.

3. **The `wf-*.mjs` workflow scripts are UNTRACKED.** Verified: `git status --porcelain` shows
   `docs/tranches/D/wf-*.mjs` (3), the 4 untracked `docs/tranches/E/wf-*.mjs` (E's three
   `wf-band*` scripts are ALREADY tracked), and F's own `wf-audit.mjs`/`wf-author.mjs`/
   `wf-harden.mjs`/`wf-parsing.mjs` are untracked (the F-dir scripts present, `git ls-files
   docs/tranches/F/ | grep wf` → none tracked). These scripts embed the binding MANDATE; committing
   them makes "how was this tranche produced" answerable from history (`a-tranche-retro-F §4`).

4. **`package.json`'s `author` field is empty; the version owner is Mike Babb.** Verified:
   `package.json:63` `"author": ""`. The version owner for the combined publish is **Mike Babb**
   (`mike@babb.dev`, the git user + `currentDate` context), who finalizes the SemVer tier and drives
   `changeset version` → tag → `release.yml` (`F.md §F.W17`; the E changeset's named-owner pattern,
   `.changeset/tranche-e.md:40-42`).

5. **The publish leg gating: library legs gate-free; only demo/dock legs gate on glass-ui 3.3.0.**
   `F.md §F.W17` (re-confirmed): the library legs are gate-free; only the demo/dock legs gate on
   glass-ui 3.3.0 (D.W5, D's heartbeat — NOT F's scope). The publish leg stays user-domain,
   confirm-first.

The wave's job: author the FINAL (gate-table-backed, every gate a re-runnable PASS), re-confirm the
CLEAN ledger, cut the stacked changeset with the named owner, commit the wf-*.mjs provenance, and
record the user-domain publish leg — closed by the close's own gate.

---

## § Goal

**What lands** (the close — docs + changeset + provenance commit; the library/demo source UNTOUCHED):

- **`docs/tranches/F/FINAL.md`** — authored AT close in D/E's FINAL voice (terse, gate-table-backed;
  every recorded-MET gate resolving to a checked-in, re-runnable instrument shown to PASS — NOT a
  narration, inv ε). It carries: (a) the deferred ledger re-confirmed CLEAN (zero KFE,
  P-invariant-28 vacuous); (b) the F-SCOPE findings table — each net-new finding with its landing
  wave (F.W1–F.W16) + its proving gate; (c) the band roll-up (the engine-perf re-measures with the
  live numbers, the parsing round-trip fixes, the orchestration finish + dogfood, the platform/SVG
  sliver, the demo finishing pass); (d) the value.js charter v2 + glass-ui hand-off ledger
  re-confirmed as HAND-OFFs (inv-16); (e) the §ALREADY-SOTA record re-affirmed (F proved itself
  net-new by what it left untouched).
- **The F changeset** (`.changeset/tranche-f.md`) — cut atop the stacked B `3.1.0` + C major + D
  major + E minor (all unpublished, State 2). Tier: the perf folds are isomorphic; the parsing
  round-trip fixes a WRONG value to right; the demo SHIPs are additive; F.W12 (MotionPath) + F.W9
  (`Sequence` transport completion) ship observable additive new public API → **likely MINOR** (the
  version owner decides). The changeset folds so one provenance-signed publish ships the whole
  B+C+D+E+F provenance.
- **The wf-*.mjs provenance committed** — the UNTRACKED `wf-*.mjs` scripts (D's 3, E's 4, F's
  `wf-audit`/`wf-author`/`wf-parsing`, State 3) committed, so the tranche-production process (the
  embedded MANDATE) is answerable from history (`a-tranche-retro-F §4`). **SHIP-in-F (BOOK, low
  priority)** — done at close, not blocking.
- **The named version owner** — Mike Babb (`mike@babb.dev`), who finalizes the SemVer tier + drives
  `changeset version` → tag → `release.yml`. The publish leg stays USER-DOMAIN, confirm-first; the
  library legs gate-free; only the demo/dock legs gate on glass-ui 3.3.0 (D.W5, NOT F's scope).

**Why:** F's close mirrors D's + E's discipline — the FINAL is gate-backed not narrated, the ledger
is re-confirmed CLEAN (F manufactured no chronic-debt fold), the changeset stacks the unpublished
provenance, and F's own retro item (the untracked workflow scripts) is discharged by committing them.
The publish leg is named-owner + user-domain because publishing is the user's call, confirm-first.

---

## § Scope

The close lands four items (S1 FINAL, S2 changeset, S3 provenance commit, S4 the publish leg /
owner); all are docs/changeset/provenance, ZERO library/demo source. Each is `file:line`-grounded.

### S1 — Author `docs/tranches/F/FINAL.md` (the gate-table-backed recap) — at close

**WHAT:** author the F FINAL in D.FINAL/E.FINAL's voice — the prompt-recap confirmed, the deferred
ledger re-confirmed CLEAN (the table below), the F-SCOPE findings table (each finding → landing wave
→ proving gate that BITES), the band roll-up, the value.js + glass-ui hand-off ledger re-confirmed as
HAND-OFFs, the §ALREADY-SOTA record re-affirmed. Every recorded-MET gate resolves to a checked-in,
re-runnable instrument shown to PASS (`proof:bench-runs`, `proof:ci-coverage`, `proof:orchestration`,
`proof:interp-fastprops`, `proof:sync-step`, `proof:computed-frame`, `proof:roundtrip-easing`/
`proof:spring-roundtrip`/`proof:adapter-capture` (the F7/F8 round-trip + capture gates),
`proof:motion-path`, `proof:idioms`, `proof:demo-elevate`, `proof:boundary`) — NOT a narration (inv
ε). The FINAL is authored AT close, NOT now (this spec describes its shape; F.W17's implementation
writes it).

**WHY:** the FINAL is the tranche's terminal record; D's + E's discipline (`E/FINAL.md`,
`E.W6 §FINAL.md`) is that it is gate-table-backed, every gate a PASS instrument, the ledger
re-confirmed — so the close proves no regression + records F's net-new content honestly, not as prose.

### S2 — Cut the F changeset atop the stacked B+C+D+E (`F.md §F.W17`) — at close

**WHAT:** cut `.changeset/tranche-f.md` stacked atop the unpublished B `3.1.0` + C major + D major +
E minor (State 2), declaring F's tier — **likely MINOR** (the perf folds isomorphic; the parsing
round-trips fix a WRONG value to right; the demo SHIPs additive; F.W12 MotionPath + F.W9 Sequence
transport ship observable additive new public API), the version owner deciding. Model the E
changeset's shape (`.changeset/tranche-e.md`): the published-library surface (the MotionPath
primitive, the Sequence transport completion, the per-keyframe-easing round-trip + adapter-metadata
capture, the preset-barrel reachability + clamp convergence), the demo + CI gates (the perf folds,
the verification band, the demo finishing pass) that do not change the published API, and the named
version owner for the combined publish.

**WHY:** the prior tranche changesets are cut + stacked + unpublished (State 2); F stacks atop them so
one provenance-signed publish ships the whole B+C+D+E+F provenance — the combined-SemVer-tier pattern
E set (`.changeset/tranche-e.md:8-12`). The tier is the version owner's call; the changeset names the
likely tier + its reasoning.

### S3 — Commit the `wf-*.mjs` workflow provenance (`a-tranche-retro-F §4`) — at close, SHIP-in-F (BOOK)

**WHAT:** commit the UNTRACKED `wf-*.mjs` scripts (State 3 — D's `wf-demo`/`wf-engine-review`/
`wf-review`, E's 4 untracked `wf-dev`/`wf-finalize`/`wf-sota`/`wf-sota-complete` (the `wf-band*`
three are already tracked), F's `wf-audit`/`wf-author`/`wf-harden`/`wf-parsing`), so the
tranche-production process — the scripts embedding the binding MANDATE — is
answerable from git history. Low priority; done at close, not blocking any prior wave.

**WHY:** the scripts embed the binding MANDATE that governs each tranche; committing them makes "how
was this tranche produced" answerable from history (`a-tranche-retro-F §4`). It is a provenance leg,
not a code change — pure additive history.

### S4 — Name the version owner + record the user-domain publish leg (`F.md §F.W17`) — at close

**WHAT:** name the version owner — **Mike Babb** (`mike@babb.dev`) — who finalizes the SemVer tier +
drives `changeset version` → tag → `release.yml`. Record the publish leg as USER-DOMAIN, confirm-first:
the library legs gate-free; only the demo/dock legs gate on glass-ui 3.3.0 (D.W5, D's heartbeat — NOT
F's scope). Optionally fill the empty `package.json:63` `"author"` field. F.W17 does NOT publish.

**WHY:** publishing is the user's call (confirm-first); F names the owner + records the gating so the
publish is unambiguous, but does not run it. The demo/dock legs' glass-ui 3.3.0 gate is D's heartbeat,
explicitly NOT F's scope (`F.md §F.W17`).

---

## § The deferred ledger — re-confirmed CLEAN (zero KFE, P-invariant-28 vacuous) [FINAL carries this]

F folded no chronic debt because none remained. The FINAL re-confirms (the gate-table-backed shape
D/E used):

| Item | Tag | Terminal status (F.W17 re-confirms) | Proof |
|---|---|---|---|
| Every keyframes-owned chronic deferral | KFD-TERMINATED (D) | D was the terminal home | the consolidated ledger — **ZERO KFE** (`_SYNTHESIS-deferred-ledger §0`) |
| **C-2** `AnimationOptions→CSSAnimationOptions` rename | EXITS-at-F | discharged by the 0.10.0 pin (kf imports neither name) | `valuejs-sota-handoff-v2.md §2 rename` — STRUCK from the open ledger |
| **C-1** the value.js charter | chronic-by-design | Band V augments, does NOT close (inv-16) | `valuejs-sota-handoff-v2.md` — the inv-16 HAND-OFF, sequenced by the vj owner |
| `proof:boundary` (value.js seam) | CLOSED standing | green throughout F (no new static edge) | `npm run proof:boundary` PASS (F.W11/F.W12 ride the heavy surface; no light value.js edge) |
| inv ζ (rAF dogfood) | CLOSED standing | + F.W10 the orchestration dogfood analogue | `proof:dogfood` PASS (F.W10's decay swap + new scene) |
| inv δ (no occlusion) | CLOSED standing | no F demo wave reintroduced a clip | `proof:demo-elevate` occlusion clause PASS (F.W14/F.W15/F.W16) |
| `proof:zero-alloc` | CLOSED standing | F.W4's stable-key clear keeps fast-properties + zero-alloc | `proof:interp-fastprops` PASS (the standalone `node --allow-natives-syntax` `%HasFastProperties` probe, with the threaded-buffer bench-delta as the named fallback — F.W4 §S4) |
| value.js Waves A–F / VJ-F1–F4 / I2/I3 | HAND-OFF | sequenced by the vj owner (inv-16) | `valuejs-sota-handoff-v2.md` — kf consumes through the unchanged `lerpValue` seam, ZERO kf edits |
| H-1 `startViewTransition({types})` · fluid `.text-display-*` | glass-ui-HANDOFF | owner = glass-ui | `valuejs-sota-handoff-v2.md` glass-ui ledger (F.W13's S2) |
| D.W5 (dock + occlusion) · D.W6 (D FINAL) | D-PENDING-ON-E1 | D's close, gated on glass-ui 3.3.0 | D's heartbeat — **NOT F's scope** |
| ScrollTimeline-native-REPLACE · Worker · WASM | ARCH/DECLINED | permanent KILL, re-confirmed | recorded; do not re-litigate |

**P-invariant-28 satisfied — vacuously for the fold class:** F terminated no chronic debt because D
had already terminated all of it; **C-2 EXITS** the band (discharged by the pin); every HAND-OFF has a
named owner; every ARCH/DECLINED is recorded; D-PENDING is explicitly D's close. No item is a perpetual
punt, and no item folded INTO F.

---

## § Hard gate (the close's own gate — falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES:

1. **The FINAL is gate-table-backed, every recorded-MET gate a PASS instrument (S1).** `docs/tranches/
   F/FINAL.md` exists and every gate it records resolves to a named, checked-in, re-runnable instrument
   shown to PASS — not narrated. **BITE:** a recorded gate with no re-runnable instrument behind it (a
   narration) → the inv-ε FINAL-shape check reds (the D/E FINAL discipline).

2. **The deferred ledger is re-confirmed CLEAN — zero KFE (S1).** The FINAL's ledger table carries
   zero KFE rows; C-2 is recorded EXITS-at-F. **BITE:** a KFE row appears (a chronic-debt fold into an
   F wave) → the zero-KFE assertion reds (`_SYNTHESIS-deferred-ledger §0` — the ledger is CLEAN).

3. **The F changeset is cut atop the stacked B+C+D+E with a named owner (S2/S4).** `.changeset/
   tranche-f.md` exists, declares F's tier, stacks atop the unpublished prior changesets, and names the
   version owner (Mike Babb). **BITE:** the changeset absent, or with no named owner → the
   release-readiness check reds.

4. **The wf-*.mjs provenance is committed (S3).** `git ls-files docs/tranches/*/wf-*.mjs` returns the
   D/E/F workflow scripts (no longer untracked). **BITE:** the scripts remain untracked → the provenance
   clause reds (reds today — verified State 3, all untracked).

5. **The publish leg is recorded user-domain, NOT run (S4).** The FINAL records the publish as
   user-domain + confirm-first (library legs gate-free; demo/dock legs gate on glass-ui 3.3.0, D's
   heartbeat). F.W17 does NOT publish. **BITE:** F.W17 runs `npm publish` / `changeset version` itself →
   the user-domain-publish invariant is violated.

6. **No source regression — the close changes only docs/changeset/provenance.** `npm test` +
   `proof:all` stay green; F.W17 touches no library/demo source. **BITE:** a library/demo source diff in
   F.W17 → the docs-only-close invariant reds (the work was F.W1–F.W16's; F.W17 records it).

---

## § Folds

Retires (by finding id):
- **`a-tranche-retro-F §4`** (commit the wf-*.mjs workflow provenance) — S3 + gate clause 4.
- **`F.md §F.W17`** (the F FINAL + the stacked changeset + the named owner + the user-domain publish
  leg) — S1/S2/S4 + gate clauses 1/2/3/5.

**Re-confirmed (not re-authored) — the audit synthesis owns these:**
- `_SYNTHESIS-deferred-ledger` / `_SYNTHESIS-gap-scorecard` / `_SYNTHESIS-prompt-recap` /
  `valuejs-sota-handoff-v2.md` are ALREADY authored (the audit synthesis); F.W17 RE-CONFIRMS them in
  the FINAL, does NOT re-author them.

**Carried band BOOKs (re-confirmed in the FINAL, owned by their bands):**
- **Band 4:** MorphSVG/DrawSVG/numeric-MotionPath (VJ-F1) · SplitText (BOOK) · intrinsic-size
  (`IntrinsicSizeValue`, gated on value.js `calc-size()` E7) · the VT-types glass-ui-HANDOFF (H-1) +
  the typed/directional scene-VT BOOK + the `Mod+K` palette BOOK + `view()` reveal BOOK.
- **Band 5:** the VT shared-element morph (gated on H-1) · the transform-handle keyboard/role · the
  start-screen first-gesture copy/cue · the icon-button touch-target generalization · the fluid
  `.text-display-*` glass-ui ASK.

---

## § Design decisions

1. **The FINAL is gate-table-backed, NOT narrated — D/E's discipline.** RESOLVED (inv ε): the FINAL
   records every met gate as a checked-in, re-runnable instrument shown to PASS (the `E/FINAL.md`
   shape), so the close proves no regression + records F's net-new content falsifiably, not as prose.
   Trade-off: none — this is the standing tranche-close discipline; a narrated FINAL would not bite.

2. **The changeset stacks atop the unpublished B+C+D+E — one provenance-signed publish.** RESOLVED
   (State 2): the prior changesets are cut + unpublished, so F stacks atop them and one publish ships
   the whole B+C+D+E+F provenance (the E changeset's pattern). The tier is the version owner's call —
   the changeset names the LIKELY tier (minor — additive new public API in MotionPath + Sequence
   transport, the rest isomorphic/additive) + its reasoning, deferring the final tier to the owner.
   Trade-off: the combined publish's effective SemVer is driven by the highest tier in the stack (C/D
   major) — but F's OWN contribution is recorded honestly as minor.

3. **Commit the wf-*.mjs provenance — process is answerable from history.** RESOLVED
   (`a-tranche-retro-F §4`): the workflow scripts embed the binding MANDATE; committing them makes "how
   was this tranche produced" answerable from git history. It is a provenance leg (pure additive
   history), done at close, low priority — not blocking any prior wave. Trade-off: none — it is
   additive history; the scripts were untracked, now they are recorded.

4. **The publish leg stays USER-DOMAIN — F names the owner, the user publishes.** RESOLVED
   (`F.md §F.W17`): publishing is the user's call (confirm-first). F names the version owner (Mike Babb)
   + records the gating (library legs gate-free; demo/dock legs gate on glass-ui 3.3.0, D's heartbeat —
   NOT F's scope) so the publish is unambiguous, but F.W17 does NOT run it (gate clause 5). Trade-off:
   the close stops short of publishing — correctly, because the publish is user-domain + dependency-
   ordered, and the demo/dock legs gate on glass-ui 3.3.0 outside F's scope.

5. **The close manufactures no work — it records D/E's discipline extended to F.** RESOLVED (KISS): F.W17
   re-confirms the audit-synthesis artifacts (the ledger, the gap-scorecard, the prompt-recap, the
   valuejs-handoff-v2 — ALREADY authored), authors only the FINAL + the changeset, commits the
   provenance, and names the owner. It does NOT re-author the synthesis, does NOT publish, does NOT touch
   library/demo source. Trade-off: none — the close's job is to record + release, and F proved itself
   net-new by what it left untouched (the §ALREADY-SOTA record) as much as by what it shipped.
