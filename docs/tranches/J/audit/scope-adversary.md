# Tranche J — SCOPE ADVERSARY (an independent charter opinion)

**Lane:** scope-adversary · **Date:** 2026-06-09 · **Tree:** `master` @ `4072af9` (I-close tip;
`a4b1472` merge + WZ docs) · **Status:** READ-ONLY audit; this doc is the only write.

I am the check on the orchestrator's synthesis. I formed my own picture from the tree and git,
not from the I FINAL's recommendations. My verdict diverges from the obvious "industrialize the
gate regime" reading. **The highest-value J is RELEASE-led, not tooling-led** — and there is a
P0 deploy-integrity hazard that must be in J regardless of charter.

---

## §0 — The one headline

> **J = SHIP THE PRODUCT. The library's public API has out-run its published version by a full
> orchestration tier (16 exports, four tranches E→I) and npm is frozen at `4.1.0`. Cut the
> honest version, publish, document the real surface, and disarm the one flaky hard-gate that now
> stands between green CI and an armed auto-deploy.**

Everything else J could do (gate consolidation, engine-frontier docs, mobile/a11y polish) is
either a SUBSET of shipping, or a measure-first BOOK that does not earn a wave before the product
the user actually distributes is correct, versioned, and documented.

---

## §1 — The decisive evidence (what the tree actually says today)

| Fact | Evidence | Why it decides scope |
|---|---|---|
| **npm publishes `4.1.0`; that is also the tree version** | `npm view @mkbabb/keyframes.js version` → `4.1.0`; `node -e require('./package.json').version` → `4.1.0`; `git tag` tops at `v4.1.0` | The published library is FROZEN at a version that predates the entire orchestration tier. |
| **16 public exports accreted E→I, never published** | `src/animation/index.ts:30-110` exports `SpringProgress`, `springLinearStops`, `springTimingFunction`, `RAFPlayback`, `stagger`, `flip`/`flipShared`, `drag`/`Draggable`, `decay`/`decayRest`, `Sequence`, `animate`-types, `MotionPathOptions`, `DrawSVGOptions`; `git log --diff-filter=A` → orchestration tier landed `4ee8e34` (**Tranche E**), `motion-path` `4cf7adb` (F), `draw-svg` `3d352a3` (G), `frame-compiler` `a0303fe` (D) | A GSAP/Motion-One-class API exists in source and ships in `dist`, but the npm version says "nothing changed since 4.1.0." This is the single largest, most concrete, most precept-aligned gap. |
| **Demos PROVE the unpublished primitives live** | `demo/spring`, `demo/sequence`, `demo/motion-path` all exist (`ls -d demo/*/`); they are correctness-gated by `proof:live-session` | The product is real and exercised — it is just not RELEASED. The gap is purely the publish leg. |
| **Two changesets PENDING, both `patch`, both unconsumed** | `.changeset/tranche-h.md` + `.changeset/tranche-i.md` — both declare `"@mkbabb/keyframes.js": patch` | `4.1.0 → 4.1.1` does NOT honestly describe a tranche-spanning new public surface. The I changeset itself notes "a maintainer may elect to ship this as a `minor` … version owner's call" (`.changeset/tranche-i.md`). The SemVer tier is UNRESOLVED. |
| **Auto-deploy is ARMED again, gated on a KNOWN-FLAKY hard gate** | `deploy-pages.yml:22-46` fires on `workflow_run` of `ci` → `success` on `master` push; `ci.yml:321-322` runs `proof:scene-control-dfa` as a HARD gate (no `continue-on-error`); the I close (`I-WZ-verify.md:344-348`) records it as timing-FLAKY, fixed-`settleMs=1600` (`proof-scene-control-dfa.mjs:211,228`), **"STILL OPEN … FUTURE auto-deploys await it."** | The deploy chain the I close just re-armed rests on a gate the I close itself declared not robust. A flake either reds CI (blocks the fix-ship) or its intermittent green masks instability. **P0 regardless of charter.** |
| **Root `CLAUDE.md` project tree is STALE — missing 14 modules** | `CLAUDE.md` documents `src/animation/{index,group,numeric,smooth,morph,timeline,animations,constants,utils,waapi}.ts` (10); actual tree has 28 entries incl. `engine,playback,spring,sequence,drag,flip,stagger,decay,animate,motion-path,draw-svg,frame-compiler,adapter,springLinearStops,springTimingFunction` + `internal/` | The repo's own front-door doc describes a library two architectural eras out of date. (Note: `src/animation/CLAUDE.md` IS current — the stale one is the ROOT.) |
| **README `Beyond CSS` documents 4 of ~13 primitives** | `README.md` §Beyond CSS (`:331`) has subsections only for `NumericAnimation`, `SmoothProgress`, `ElementMorph`, `Timeline`; `grep` shows `decay`/`Sequence`/`motion-path`/`draw-svg` at 0 dedicated coverage | A user who `npm i`s the (future) published version gets an API the README cannot teach. |
| **CI-was-never-running was discovered POST-close** | `I-WZ-verify.md:316-325`: `ci.yml` YAML-invalid since H.W12; CI never ran, nothing auto-deployed for days; `proof:ci-coverage` missed it (regex-parse, not parse-validate) — now fixed + a `yaml-valid` clause added | The deploy/CI substrate is freshly un-bricked but UNPROVEN under real load — the auto-deploy path has not had a clean end-to-end green run observed in the close. |
| **The gate estate is ~120 scripts; the hygiene aggregator is one 90-command line** | `ls scripts/proof-*.mjs` → ~110 scripts; `package.json` `proof:hygiene` is a single `&&`-chain of ~90 `npm run` calls; ~102 `proof:*` keys total | Real consolidation debt — but it is INTERNAL tooling, not the product. Weigh it as P2/BOOK, not the headline. |

---

## §2 — The charters, weighed honestly, ranked

### #1 (WINNER) — J-as-RELEASE-with-deploy-integrity (the honest ship)

**Charter:** Resolve the SemVer tier for the accreted public API (E→I orchestration tier);
consolidate the two pending changesets into ONE honest release; publish to npm; bring the README
+ root `CLAUDE.md` current to the real public surface; AND disarm the `scene-control-dfa` flaky
hard gate so the re-armed auto-deploy is trustworthy.

**Why it wins:**
- It is the ONLY charter that closes the largest concrete gap in the tree — `npm = 4.1.0` while
  source ships a GSAP-class API (§1, rows 1-3). Every other charter leaves that gap open.
- It directly serves the user's values: a *development product* (CLAUDE.md line 1 framing — "this
  is a development product") whose flagship distribution channel (npm) is a full tier stale is the
  opposite of elegance/cohesion. Shipping the real surface is the gestalt move.
- It folds the P0 deploy hazard (scene-control-dfa flake) — which MUST be in J anyway — into a
  coherent "the release path is honest end-to-end" story.
- It is BOUNDED and verifiable: the oracle is the published npm tarball's API matching the
  documented surface, and one clean green-CI → auto-deploy round-trip observed. No open-ended
  "industrialize the regime" scope creep.
- It respects inv ε: every claim is a re-runnable probe (`npm view`, `npm pack --dry-run`, the
  changeset diff, a CI run URL).

**The user-burned-by-lying-gates angle:** the I regime's whole point is "green means a human sees
it work." The release leg is the OTHER half no gate covers: "the thing a human installs is the
thing the source describes." A `proof:published-surface` gate (the npm `dist` exports == the
`index.ts` public surface == the README's documented API) is the release-tier analogue of
`proof:live-session`. That is the precept extended to the distribution boundary — exactly the kind
of architectural transposition the user wants.

### #2 — J-as-deploy-integrity + gate-consolidation (the regime, industrialized)

**Charter:** Finish the CI-on-Linux tail (the scene-control-dfa per-expected-state settle wait);
collapse the ~120 gate scripts onto the shared `scripts/lib/` harness; retire redundant hygiene
gates; make auto-deploy provably live. This is the I FINAL's own implied next step ("the regime I
built, industrialized").

**Why #2 not #1:** It is internally valuable and the scene-control-dfa fix is mandatory — but it
is INWARD-facing. It makes the tooling nicer; it does not ship the product. The user was burned by
a regime that polished its own paperwork while the product was broken; a J that polishes the GATE
ESTATE while npm stays a tier stale risks the same inward-gaze failure mode in a new costume.
**Fold the mandatory slice (scene-control-dfa P0 + ci-coverage robustness) into #1; BOOK the
boilerplate consolidation as measure-first** (count the actual duplication before collapsing — the
`scripts/lib/` harness may already cover most of it; verify, don't assume).

### #3 — J-as-engine-frontier-documentation (consolidate + document the periphery)

**Charter:** The 9+ undocumented modules (spring/sequence/drag/flip/stagger/decay/motion-path/
draw-svg/animate) get a cohesion pass, the missing tests (`decay.ts` has NO test file — `ls test/`
confirms), and full README/CLAUDE coverage; consider whether the surface is API-stable enough for
a `5.0`.

**Why #3 not #1:** This is the DOCUMENTATION+TEST half of #1, minus the publish. It is the right
*content* but the wrong *frame* — documenting an API you don't publish is half a deliverable. Roll
the doc/test gaps INTO #1 (they are prerequisites of an honest release: you cannot publish a tier
you cannot teach or test). `decay.ts` lacking a test is a real P1 that the release gate would
catch.

---

## §3 — What the USER actually wants most (my read)

The user: values elegance/simplicity/performance, hates legacy/workarounds, was burned by a lying
gate regime, and runs this as a *development product*.

1. **The honest ship.** The single most "legacy/workaround"-shaped thing in the tree right now is
   a published `4.1.0` that lies about the surface — two unconsumed `patch` changesets papering
   over a tranche-spanning API. That is exactly the kind of accreted dishonesty the user rejects.
   Cutting the real version IS the de-legacy move.
2. **A deploy path they can trust.** Having just discovered CI was dead for days and a flaky gate
   gates the deploy, the user will want the auto-deploy chain PROVEN, not "fixed and hoped."
3. **Docs that match reality.** The root CLAUDE.md describing a 10-module library when there are
   28 is precisely the "stale docs = legacy" the precepts forbid (`NO legacy … stale docs`).

What the user does NOT want: another inward tranche that perfects the gate machinery while the
distributed artifact stays frozen. They have had enough of tooling that admires itself.

---

## §4 — The WRONG scope for J (seductive-but-wrong)

| Tempting charter | Why it is WRONG for J |
|---|---|
| **"Industrialize the gate regime"** (collapse ~120 scripts, retire hygiene gates) — the I FINAL's implied sequel | INWARD. Repeats the exact failure mode the user was burned by (polishing the meta-layer while the product/release lags). The boilerplate is real debt but it is P2/measure-first, not a headline. Do the MANDATORY slice only (scene-control-dfa P0). |
| **J-as-product-polish** (mobile/touch/a11y/reduced-motion — axes live-session doesn't exercise) | Real gaps, but SPECULATIVE without measurement. There is an `internal/reduced-motion.ts` already; a11y/touch debt is unmeasured. This is a born-RED HANDOFF or measure-first BOOK, not a charter — and it has no user-reported defect driving it (unlike B1–B9 which did). Building it now is scope invented, not scope demanded. |
| **A `5.0` major "because it feels big"** | SemVer must be EARNED by an actual breaking change, not by accumulated feature count. The E→I additions are ADDITIVE (new exports), which is `minor`. Unless something breaks an existing signature, `5.0` would be a vanity major — a workaround for "we haven't shipped in a while." The version tier is a forensic question (diff the public surface), not a vibe. |
| **Re-litigate the engine kernels** (SoA lerpArray, async sync-step, monomorphization) | The I close (`PROGRESS.md §4e`) terminally BOOKed these as MEASURE-FIRST or RECORD-KILL. Re-opening without the gate-first measurement is a precept violation (P-invariant: build the `proof:event-ordering` / byte-lock gate FIRST). Not J's headline. |
| **Reopen B7 specular / chronics** | Closed via published glass-ui `~3.9.0` + pixel gate; `proof:specular-absent-at-rest` GREEN in the live-session. Re-opening absent a NEW live receipt is exactly the chain-of-trust-over-FINALs the I precept forbids — VERIFY-ONLY at most. |

---

## §5 — Sizing J (#1 charter)

**Headline:** *Ship the real library — cut the honest version, publish, document the surface, and
prove the auto-deploy path.*

**Waves (4) + DAG:**

```
J.W0 (deploy-integrity, P0, LEADS — unblocks the ship path)
   └─ scene-control-dfa per-expected-state settle wait (kill the fixed settleMs flake)
   └─ ci-coverage gains a "every CI hard-gate is load-robust" clause
   └─ observe ONE clean green-CI → auto-deploy round-trip (the proof the chain works)
        │
        ▼
J.W1 (SemVer forensics + changeset consolidation)   ── can start parallel to W0 ──
   └─ diff the public surface 4.1.0 → HEAD (api-extractor / tsc .d.ts diff)
   └─ resolve patch-vs-minor by EVIDENCE (additive ⇒ minor; any break ⇒ major)
   └─ consolidate the two pending changesets into ONE honest release note
        │
        ▼
J.W2 (the publish-surface honesty pass)              ── depends on W1's surface map ──
   └─ README: author the missing primitive sections (spring/sequence/drag/flip/
      stagger/decay/motion-path/draw-svg) — the §"Beyond CSS" tier completed
   └─ root CLAUDE.md tree: bring current (the 14 missing modules)
   └─ decay.ts: author the missing test (the one untested public module)
   └─ NEW GATE: proof:published-surface (dist exports == index.ts public == README documented)
        │
        ▼
J.WZ (the close + the actual publish)                ── depends on W0+W1+W2 green ──
   └─ changeset version → tag → release.yml → npm publish --provenance (USER-DOMAIN, confirm-first)
   └─ verify the published tarball's API == the documented surface
```

- **W0 ∥ W1** (independent inputs); **W2** needs W1's surface map; **WZ** needs all three.
- **3 implementation waves + close.** Tighter than I's 8. The product is already correct (I
  closed it); J is the RELEASE + the DEPLOY-PROOF + the DOC-TRUTH, not a defect hunt.
- **The publish itself is USER-DOMAIN** (version owner Mike Babb, `mike@babb.dev`) — J authors the
  honest changeset + the surface gate + the docs; the user pulls the publish trigger.

**The ONE precept-extension J installs:** the gate-ORACLE precept, carried to the DISTRIBUTION
boundary — `proof:published-surface` asserts that the thing a human `npm i`s exposes exactly the
API the source declares and the README teaches. I proved "green means a human USING it sees it
work"; J proves "the thing a human INSTALLS is the thing we describe." Same precept, next boundary.

---

## §6 — Dissent registered (where I diverge from the likely synthesis)

The obvious orchestrator reading is **J-as-consolidation** (the I FINAL's own "regime,
industrialized" framing). **I dissent.** Consolidating ~120 gate scripts is INWARD work that
re-risks the self-admiring-tooling failure the user was burned by, and it leaves the headline gap
(npm a full tier stale) untouched. The mandatory slice of that charter — the `scene-control-dfa`
flake (P0) — folds cleanly into my #1 as J.W0. The boilerplate collapse is real but P2/measure-
first: **count the actual cross-script duplication against `scripts/lib/` FIRST** (the harness may
already absorb most of it), then decide — do not assume a collapse is warranted because 120 files
"feels like a lot." That assumption is the kind of un-measured move the precepts forbid.

My #1 is RELEASE-led because the product is already correct and the ONE thing that would make a
human's experience of keyframes.js better tomorrow is being able to `npm i` the library that
actually exists.
