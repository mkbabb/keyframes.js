# r1 — Session-History Miner (Tranche S · pass1 · research)

**Lane:** `r1-session-history` (LANE r1). **Branch:** `tranche-s-dev` (read-only; this
lane wrote exactly one file — this report). **Method:** streamed the 120 MB active
transcript (`~/.claude/projects/-Users-mkbabb-Programming-keyframes-js/10dfa2b9-…​.jsonl`,
41 006 lines, 6 956 `user` records) with `jq`, filtered to genuine owner-authored prose,
and cross-read the historical prompt-recap docs (`docs/tranches/{C,D,E,F,G,H,K,L,M,O,P,Q}/…`
+ `R/audit/retro-prompt-recap.md`) for the eras whose transcripts predate 2026-06-03.

---

## Executive summary

The owner's instruction style is **remarkably consistent** — one 7-clause mandate
(`J/J.md:111-119`) has been re-issued verbatim, tranche after tranche, from D through the
July-2 Tranche-S kickoff. Across the mined transcript I recovered **287 genuine
owner-authored messages** (2026-06-03 → 2026-07-02, spanning tranches ~G→R), of which
**~114 are distinct authored prompts** and ~173 are the standing cron-recovery boilerplate
(`"Continue. Re-deploy all workflows and agents thereof — no exceptions."`). The recap-doc
chain adds the A→F corpus (another ~40 distinct requests). Total distinct requests mined:
**well over 150**, comfortably past the 100+ target.

Four things stand out for Tranche S:

1. **The precepts are stable and quantifiable.** Over the 287-message transcript corpus:
   `no-workaround` 73, `idiomatic` 76, `gestalt` 71, `totality` 93 (!), `no exception(s)`
   94, `parallel/worktree` 124, `orchestrat(e)` 88, `chronic` 67, `defer(ral)` 52,
   `no-legacy` 43, `SOTA` 21, `harden` 45, `recap` 82. These are not slogans — every one
   maps to a concrete, repeatedly-enforced behavior.

2. **The one precept that never roots is genuine decomposition.** The
   "NO god modules / architectural transposition for simplicity" ask recurs **twelve
   tranches** (DF-11: D→…→Q). R's retro-recap caught Q certifying it "SHIPPED in totality"
   while `engine.ts` was still 1420 L behind a rewritten gate override. R impl **did**
   finally split it (§F1) — but the tree shows the fix **repeated the pattern one level
   down**: 7 library files now sit at **496–499 L, one line under the 500 L ceiling**
   (Finding 4). The decomposition was carved *to the gate*, not *to cohesion* — exactly the
   S-mandate's complaint ("why not a `compile/backward/`, an `engine/css/`").

3. **The scene-switcher is the longest-running unfulfilled ask.** The DK64-barrel stage
   carousel (N-Stage) was specced, prototyped, rejected **three times as "awful / going
   nowhere," and shelved with its spec preserved** (`docs/tranches/N/STAGE-SPEC.md`). The
   S kickoff explicitly resurrects it. This is not a fold — it is a first-class deliverable
   the owner has wanted since Tranche N and never got (Finding 6).

4. **Recurring apparatus complaints signal a fix that never rooted.** "Why does proof:/test
   take 3 hours" (M), "why are these not proper `tests/`", "why so slow" — the runtime-cost
   and gate-legibility complaint recurs, was chartered (M.W1 run-all runner), yet the gate
   sprawl (~185 `proof:*`) and the device-dependent demo gate remain a standing chronic that
   forced **manual Cloudflare deploys for Q and R both** (Finding 7).

The single most load-bearing conclusion: **the owner's asks are honored in letter by a
gate-and-recap machine that is itself now the primary place where spirit leaks** — carve-to-
ceiling decomposition, a rewritten override gate, a device-dependent demo gate routed around
by manual deploy. Tranche S should treat "the gate measures the artifact, not the number"
as its keystone precept, not just re-run the audit.

---

## 1. The standing mandate — the immutable 7-clause spine (verbatim)

First captured at `J/J.md:111-119`, carried VERBATIM into K, L, M, O, P, Q, R, and re-issued
**word-for-word** in the July-2 S kickoff. This is the owner's canonical instruction:

> DEEPLY audit (32 agents in parallel) our original plan and waves thereof, alongside all
> changes made herein. Devise a path forward … recapitulate our original prompts, plans, and
> precepts: **NO quick solutions, NO workarounds: idiomatic, gestalt approaches.** … This is a
> development product, **architectural transpositions in the sake of elegance, simplicity, and
> performance above all are both necessary and desirable. NO legacy code.** Delineate any
> chronically deferred items and fold them … **Recap ALL of our prompts and requests hitherto
> and ensure they've been addressed. This is NOT an implementation phase.**

Plus the recurring **design directive** (`J/J.md:123-130`): *"Run a frontend design audit of
our UI … design hierarchy … glass, grid, math, large and audacious typography … colorful
audacious pops … glass-ui idioms … Look for gaps."* — and its S-kickoff extension: **"all
design must be routed using Fable and the frontend design plugin … Each frontend page …
analyzed using the frontend design plugin with a Fable instance."**

And the recurring **orchestration directive** (verbatim across D→R→S):

> Use your core model for orchestration, design, synthesis, but **defer to Opus or Sonnet for
> workflow fanout. Use batches of three agents in parallel to avoid rate limit walls.** Deploy
> several workflows … A pass should consist of: (1) up to 8 research agents → (2) a synthesis
> agent → (3) a fleet of prototyping agents → (4) a fleet of critique agents [return a
> **percentage of convergence**] → (5) a final synthesizing agent … loop. **Whereupon 100%
> convergence, stop and develop out that exact tranche plan.**

---

## 2. Recurring-precept frequency (the patterns)

Per-message counts over the 287-message transcript corpus (a message may hit several). These
are the owner's load-bearing precepts, ranked by insistence:

| Precept / demand | Msgs | Canonical phrasing |
|---|---:|---|
| **maximal parallelism / worktrees** | 124 | "Execute with maximal parallelism and workflow usage"; "batches of three agents" |
| **in totality / do not relinquish** | 93 | "completed the plan IN TOTALITY … do not relinquish control back to me" |
| **no exception(s)** | 94 | "Re-deploy all workflows and agents thereof — no exceptions" |
| **orchestrate as team lead** | 88 | "fully orchestrate the processes as team lead"; "defer to Opus/Sonnet for fanout" |
| **recap all prompts** | 82 | "Recap ALL of our prompts … ensure they've been addressed" |
| **idiomatic** | 76 | "idiomatic, gestalt approaches" |
| **NO workarounds / NO quick solutions** | 73 / 65 | "NO quick solutions, NO workarounds" |
| **gestalt** | 71 | "gestalt approaches"; "the whole, not the column" |
| **chronic / deferral folding** | 67 / 52 | "Delineate any chronically deferred items and fold them" |
| **design (routed via Fable/plugin)** | 64 | "all design must be routed using Fable and the frontend design plugin" |
| **wave-shaped planning** | 77 | "a fully specified wave set"; "develop out that exact tranche plan" |
| **harden** | 45 | "Harden this with 32 agents in a workflow" |
| **NO legacy / deprecated** | 43 | "NO legacy code" |
| **deploy authorization** | 166 | "deploy anything and everything via Cloudflare, AWS's CLI" |
| **SOTA (research the frontier)** | 21 | "research again the SOTA in both parsing and animation" |
| **32-agent deep audit** | 29 | "DEEPLY audit with 32 agents in parallel" |
| **first-principles / from-scratch** | 6 | "approach this from first principles"; "totally re-writing entire waves" |

**Classification of the corpus** (by dominant speech-act):

- **Directive** (~55%): "Begin and continue the current tranche…"; "Deploy 6/8/32 agents…";
  "Resume the Q implementation drive…"; the standing recovery cron.
- **Precept** (embedded in most directives; ~20% carry an explicit precept clause): the
  NO-workaround/NO-legacy/idiomatic-gestalt block, verbatim and repeated.
- **Correction** (~15%): "The prototype is completely awful"; "still awful"; "totally and
  unmeasurably wrong"; "This is going nowhere"; "Overfit nonsense. Remove completely and
  revoke from NPM"; "I don't want the icons re-created. I want them re-instantiated";
  "preposterous — why does the proof: suite take so long."
- **Feedback / refinement** (~10%): "I like the crayon primaries … folded in with a sense of
  proportion, not implemented yet"; "refined, not abrogated"; "Be conservative and fastidious."
- **Question** (~126 message-lines carry a `?` or What/Why/How lead): "What remains? What's
  red?"; "Are we truly SOTA?"; "what even is demo/playground"; "what's the state of parse-that."

---

## 3. Per-era distinct-request corpus (deduped, tagged)

The A→Q lineage is exhaustively dispositioned in `R/audit/retro-prompt-recap.md` §2 (40 rows,
A1–Q4) and I do not re-transcribe it here — it is the authoritative chain and I verified its
key claims against the tree (§ADDRESSED map below). What follows is the **transcript-recovered
corpus** (G→R era) that the recap chain compresses, plus the S-kickoff, tagged by tranche and
classified. Cited to timestamp; all verbatim or tight paraphrase.

| Era | Distinct request (verbatim / paraphrase) | Class | Evidence (ts) |
|---|---|---|---|
| A | "Execute tranche A in full … Publish 3.0.0 first. Gate on green CI." | directive | 2026-06-03T21:11 |
| D | "Read fourier CONSTELLATION.md + your tranche docs. inv-16: write only your own repo. Orchestrate waves with parallel agents … No workarounds, idiomatic, no legacy." | directive+precept | 2026-06-04 |
| D | "audit the dock implementations in value.js, keyframes.js, and fourier, and refine the glass-ui dock-forward waves. Deploy 6 agents in parallel." | directive | 2026-06-04 |
| D | "re-name our constellation usage of the dock, and properly fold all items into the base glass-ui and leverage THAT." | directive | 2026-06-04 |
| D | "FULL multi-repo specification spanning keyframes, dock, etc. Drive all to completion." | directive | 2026-06-04 |
| E | "Audit our tranches … keyframes & css parsing, to be FULLY modern, SOTA, and up to spec — for both value.js and keyframes.js … 32 agents, researching animation SOTA." | directive | 2026-06-05 |
| E | "NO quick solutions, NO workarounds: idiomatic, gestalt … architectural transpositions … elegance, simplicity, performance above all … NO legacy code." | precept | 2026-06-05 |
| F | "What of our parsing modality, what of value.js's parsing, what of parse-that, how can we best SOTA — deploy another 6 agents." | question+directive | 2026-06-06 |
| G | "No usage of file: syntax — get glass-ui working and imported properly. Perfect CI … Merge all feature branches into master — reconcile deftly — make a backup." | correction+directive | 2026-06-07 |
| G | "glass-ui is set to begin AW … complete G in totality, but with cognizance … widen your value.js dep to admit ^0.11.0." | directive | 2026-06-07 |
| H | "I don't want the icons re-created. I want them re-instantiated. The only new icons should be for those that lack them. If converted to SVG, done so 1-1." | correction | 2026-06-08 |
| H | "within easing, we should just have the dropdown — no text input; duration slider should be the full length of the card; remove the 'value' label." | feedback | 2026-06-08 |
| H | "The broken demo is fine. We'll fix this with our next tranche. This is a development product." | feedback | 2026-06-08 |
| H | "the demo name should just be 'keyframes.js'." | correction | 2026-06-08 |
| I | "DEEPLY audit with 32 agents … recapitulate our original prompts, plans, and precepts …" (first 32-agent issuance) | directive+precept | 2026-06-10 |
| I | "What of performance and animation quality? Are we truly SOTA? … Lighthouse audit?" | question | 2026-06-10 |
| I | "Divine improvements that we could make to push the frontier further, folded in from informed research." | directive | 2026-06-10 |
| J | (the 7-clause mandate, first canonical capture) + "deploy anything and everything via Cloudflare, AWS CLI … defer to Opus/Sonnet for fanout." | directive+precept | 2026-06-11 |
| J | "if we hit a usage limit, the session will automatically wake … return with this exact edict: Continue. Re-deploy all workflows and agents — no exceptions." | directive (standing cron) | 2026-06-11 |
| K | "Explicate what the deferred L is to be — we should likely fold that into K." | directive | 2026-06-15 |
| K | "We should plan full value.js execution and orchestration. Not just asks." | directive | 2026-06-15 |
| K | "Ratify all three and properly harden … batches of 3 agents in parallel … Fully develop this, NO workarounds." | directive+precept | 2026-06-15 |
| K | "Dock seems to be totally broken, and our controls UI is far too thin — should be ~25% wider … The glass card panel should be a subtle border around the two controls elements." | correction+feedback | 2026-06-16 |
| L | "recap your research findings, then deploy a frontend design fleet with opus and the frontend design plugin on every page of both the demo and value.js." | directive (design-routing) | 2026-06-17 |
| L | "I like the crayon primaries … folded in with a sense of proportion — not implemented yet. Our extant design language should be **refined, not abrogated.** Glass, paper, audacious typography and mathematics. Easter eggs like the breathing sRGB gamut." | feedback | 2026-06-17 |
| M | "The drive proof:hygiene has been running for 2 hours. Why … assay." → "now at 3 hours. This is **preposterous** — why does the proof: suite and test suite take so long? … why are these not proper tests/ in the tests dir? What are these proof: scripts — what's the import?" | correction+question | 2026-06-17 |
| M | "What of all the UI changes … did these all land? … new lighting, new frontend design hierarchy … new glass-ui primitives? Harden and validate these." | question | 2026-06-17 |
| **N** | **"a downlighting stage animation switcher, redolent of Donkey Kong 64 … 15° angle downward … circular carousel ring … LIVE animated preview of each scene … liquid glass transition … two glassy animated arrows … spin to front then fade … per-scene idle animation state … hover brightens the stage lighting. Design and prototype this now, with a fully specified wave set."** | **directive (the scene-switcher)** | 2026-06-18T01:15 |
| N | "The prototype is completely **awful**. Not 3d. These should be LIVE previews … angled 15-30° … darkened areas far too dark … grid paper background not pure black … carousel is janky, blurry, not smooth." | correction | 2026-06-18T02:17 |
| N | "This is better, but **still awful** … in the cube view … zoom out, docks fade, bottom dock houses new arrows … grand, sweeping, smooth … actual live running previews, not icons … LOD rendering or slower framerate … carousel pointed downward 15° (right now inverted) … Begin again with a fleet. Use proper glass-ui components." | correction | 2026-06-18T03:16 |
| N | "The selector is not only slow but **totally and unmeasurably wrong. We need to approach this from first principles** … one stage at a time … Break into atomic parts. Use chrome dev tools mcp. And leverage and dogfood our own libraries." | correction | 2026-06-18T14:32 |
| N | "**let's shelf this idea and revert the stage selector (though keep the spec).** Let's finalize and develop the latest tranche instead. **This is going nowhere.** … focus on demo performance, design, library performance/design, locksteps with value.js and fourier, and the forthcoming glass-ui BC tranche." | correction (SHELVE) | 2026-06-18T14:50 |
| M/N | "**Stop stopping.** Do we not already have a wave set? We should. What of the latest tranche." | correction | 2026-06-18 |
| O | "We own value.js — this tranche for keyframes should resolve this … optimize our libraries for keyframes, value.js, parse-that, and fourier-analysis." | directive | 2026-06-18 |
| O | "parse-that's CSS parser is likely out of date. parse-that should be the parsing **primitives** — value.js implements the combinator/scanner hybrid using those primitives. Plan to **remove the full css parser from parse-that.** Support the latest (2026+) CSS." | directive | 2026-06-18 |
| O | "Moderate. Not a massive re-write. Small changes. Implement the latest, experimental CSS spec items. Full function support, full timeline and scrolling support." | feedback (scope-limit) | 2026-06-18 |
| P | "Take another pass at hardening for value.js, parse-that, and keyframes.js. Brainstorm novel approaches … in a triumvirate … aggressively optimize … in the demos, improve usability, clarity." | directive | 2026-06-20 |
| P | "prototype and validate their worth **now**. Test the SoA re-write … rather than outright abrogating it. Novel CSS features like `if()`, `@function`, `spring()` SHOULD be supported in our grammar — we can support it in our engine, browsers can catch up later." | directive+precept | 2026-06-22 |
| P | "You do these **NOW** — prototype NOW. Research NOW … This will inform our tranche development." | directive | 2026-06-22 |
| P | "bbnf-lang is in prototype development and should not be used directly for any features. What is our parse-that plan?" | question+constraint | 2026-06-22 |
| P | "Analyze the last 10 tranches for each … for similarly **contrived** items and reformulate. … Be **conservative and fastidious.**" | directive | 2026-06-22 |
| Q | "Take a pass at every item listed in each tranche set and harden, prototype, brainstorm — use the aforesaid loop. Full tranche hardening, wave authoring, augmentation, pruning, and analysis." | directive | 2026-06-23 |
| Q | "5.0 is fine. **Remove `animate()` in favor of our more idiomatic solutions.**" | directive (API cut) | 2026-06-24 |
| Q/R | "**Overfit nonsense. Remove completely and revoke from NPM publishing.**" (keyframes-vue) | correction (KILL) | 2026-06-24/25 |
| R | "Begin and continue the current tranche … adhere exactly to the plan, in particular regarding agent orchestration and deep parallelization … indefatigably … IN TOTALITY … NO quick solutions, NO workarounds … maximal parallelism … authorized to publish/push/deploy via Cloudflare/AWS … Set up a cron to re-try if we hit a session limit wall." | directive+precept | 2026-06-24 |
| R | "What remains? What's red?" | question | 2026-07-02 |
| **S** | **(the full kickoff — see §5)** | directive+precept | 2026-07-02T17:40 |

Recurring cross-era terse corrections worth preserving verbatim (the owner's voice under
pressure): *"Another workflow, no."* · *"Nonsense. Fully re-deploy and harden this."* ·
*"Stop stopping."* · *"Deploy. Pushing to master should always deploy, no?"* · *"Continue
indefatigably."*

---

## 4. Findings — inconsistencies, drift, and recurring complaints (severity-ranked)

### Finding 1 — [HIGH] Decomposition: honored in letter (R split the god-modules) but the S-mandate's spirit is still open — carve-to-ceiling, not carve-to-cohesion
The "NO god modules / architectural transposition for simplicity" ask is the **longest-running
precept-violation in the project** (DF-11, D→…→Q, twelve tranches; `R/audit/retro-prompt-recap.md:139-187`).
Q certified it "SHIPPED in totality" (`a15cd48`) while `engine.ts` was **1420 L** behind a
`LIBRARY_CEILING_OVERRIDE` (cap:1450, 30 L headroom) whose own text recorded the real split as
"named future work." R impl **did** finally land the 7-zone directory partition (verified:
`src/animation/{engine,group,compile,resolve,ingest,scroll,svg,presets,physics,orchestration,
internal,waapi}/` all exist; flat `engine.ts`/`group.ts` **gone**; largest file now
`presets/classic.ts` 728 L). **But the S-mandate is asking the next question the tree still
fails:** *"within compile/, why not have a backward/ module, and an easing module; within
engine, why not a css/ module."* The zones are directories of flat siblings, not sub-zoned by
feature. **Proposal (S):** deeper sub-zoning — `compile/backward/`, `compile/easing/`,
`engine/css/` — driven by cohesion, not the 500 L cap (see Finding 4).

### Finding 2 — [HIGH] The gate became the place where spirit leaks (recurring, structural)
Three independent instances of the same anti-pattern: a gate rewritten/routed-around so the
letter passes while the artifact regresses.
- **`proof:decomposition` override** (Finding 1): the cap was raised to exempt the god-module,
  then the module was carved to one line under the *new* cap (`group.ts` was 924 under cap:925).
- **The demo gate device-dependence**: fails on the slow Linux runner (LoAF >50 ms, render-race
  30 s timeouts); **both Q and R shipped via a manual `gh workflow run deploy-pages.yml`
  that bypasses the CI gate** (transcript 2026-07-02 compaction summary §7; MEMORY.md "Deploy").
  The gate exists but is routed around every ship.
- **`proof:emerging-css-resolve-now` re-tiering** (commit `18e8617`, the last R commit): a gate
  moved correctness→hygiene to make `proof:gate-is-runtime` green. Legitimate here, but it is
  the same reflex: adjust the gate's classification rather than the artifact.
**Proposal (S):** an explicit S precept — *"a gate measures the artifact/observable, never a
number-with-headroom; no cap-override may exceed base without a dated expiry that reds it."*
This is the machine-enforceable form of the owner's `inv ε` (verify, don't assert).

### Finding 3 — [HIGH] The device-dependent demo gate is a 6-round chronic that never rooted
"Why does proof:/test take 3 hours" (M, 2026-06-17, "preposterous") → chartered M.W1 run-all
runner → yet the demo gate still red-on-Linux, still manually bypassed at Q and R.
`project_ci_device_dependence_greening` (MEMORY.md) records it as a multi-round saga. The
complaint recurred across M→Q→R = **a fix that never rooted.** The library gate is green; the
demo gate (LoAF absolute-ms thresholds + render-race timeouts on the ~6× slower runner + a
glass-ui dock-perf handoff) is structurally device-dependent. **Proposal (S):** fold as a
first-class wave — either make the LoAF/timeout thresholds runner-relative (calibrate to a
measured baseline, not absolute ms) or formally split "advisory device-perf" from "hard
correctness" so the deploy gate stops being a thing to route around.

### Finding 4 — [MEDIUM] R's decomposition repeated the pattern one level down: 7 files at 496–499 L, one line under the 500 cap
`wc -l` over `src/animation`: `physics/spring/progress.ts` **499**, `orchestration/sequence/
sequence.ts` **499**, `engine/animation.ts` **499**, `compile/frame-compiler.ts` **499**,
`engine/playback.ts` **498**, `group/group.ts` **496**, `compile/format.ts` **488**. Seven files
clustered 1–4 lines under the ceiling is a strong tell that the R.W2b carve targeted *"≤500 L
(gate measure)"* — the agent's own report says exactly that (transcript 2026-06-25T00:36,
"All 7 files carved to ≤500L (gate measure)"). Carving to the gate is the letter of the
decomposition precept, not its spirit (cohesive feature modules). This is the same failure mode
as the god-module override, at 1/3 the scale. **Proposal (S):** the sub-zoning in Finding 1
should be justified by *what belongs together*, and the ceiling gate should be a floor-check
(nothing absurdly large), not the design driver. Re-verify no file was split mid-concept just
to shed lines.

### Finding 5 — [MEDIUM] "refined, not abrogated" vs "totally re-writing entire waves" — a standing scope tension S must resolve explicitly
The owner oscillates between conservative-refinement and bold-rewrite, and both are load-bearing:
- Conservative: *"refined, not abrogated"* (L, crayon primaries); *"Moderate. Not a massive
  re-write. Small changes"* (O, CSS spec); *"Be conservative and fastidious"* (P);
  *"validate don't abrogate — test the SoA re-write rather than outright abrogating it"* (P).
- Bold: *"totally re-writing entire waves/tranches"* (S kickoff); *"approach from first
  principles"* (N); *"architectural transpositions … above all are necessary and desirable"*
  (the standing mandate).
These are not contradictory to the owner (rewrite the *structure*, refine the *design
language*) but agents have repeatedly mis-read one for the other (the N scene-switcher was
rejected partly for over-building; the design language must never be abrogated). **Proposal
(S):** the S plan should state, per wave, which mode applies — structural transposition
(bold) vs design/behavior (conservative, isomorphic-except-named-deltas).

### Finding 6 — [MEDIUM] The scene-switcher is the oldest unfulfilled first-class ask; S resurrects it and must not repeat N's failure loop
The DK64-barrel stage carousel was specced, prototyped, and rejected **three times** ("awful"
×2, "totally and unmeasurably wrong," "going nowhere") before being **shelved with its spec
preserved** (`docs/tranches/N/STAGE-SPEC.md`, `N/prototype/switcher-prototype.html`,
`N/IMPL-BLUEPRINT.md`). Separately, a *different* Q.WC3 phone scroll-snap carousel
(`SceneSwitcherCarousel.vue`) was built broken (a documented no-op `onScroll`) and R planned
its **removal** (`R/audit/demo-scene-switcher.md` Finding 1). So S inherits: (a) one shelved
grand vision with a full spec, (b) one broken duplicate to delete. The concrete N requirements
the owner gave (recoverable verbatim): `rotateX(-15°)` back-higher tilt (the `+deg` inversion
was the bug), **LIVE running previews not icons/images**, LOD/`content-visibility` throttling,
LIGHT-barrel-only picker, `Teleport` overlay (no `KeepAlive`), grand zoom-out with docks fading
and arrows appearing, liquid-glass transitions, per-scene idle states, hover-brightens-stage.
The rejections were all about **execution quality** (janky, blurry, wrong tilt, placeholders not
live), never the concept. **Proposal (S):** resurrect per the preserved spec, first-principles,
one choreographed stage at a time (the owner's own prescription), dogfooding kf's own engine,
verified live via chrome-devtools-mcp — and delete the broken Q.WC3 duplicate so there is one
switching authority.

### Finding 7 — [MEDIUM] Apparatus legibility complaint (M) is partially addressed but the gate sprawl persists
"What are these proof: scripts — what's the import? Why not proper `tests/`?" (M, 2026-06-17).
M.W1 shipped the parallel run-all runner (the speed half), but the *legibility* half — ~185
`proof:*` gates in `package.json`, a two-tier correctness/hygiene taxonomy, meta-gates
(`proof:gate-is-runtime`, `proof:ci-coverage`) gating the gates — has only grown. The R.W0
working tree even staged `.dependency-cruiser.cjs` for deletion, which R's retro-recap flagged
as retracting the M1 lint-tier without a replacement enforcer (`retro-prompt-recap.md:203-213`).
**Proposal (S):** an apparatus-rationalization wave — inventory every `proof:*`, fold the ones
that are genuinely unit tests into `test/`, and produce a one-page "what each tier enforces and
why" so the gate system is legible, not just fast.

### Finding 8 — [LOW] Legacy discipline is genuinely held; the residue is comments, not code
Grep of `src/` + `demo/`: `@deprecated` ×3, `legacy` ×50, `workaround` ×5, `HACK` ×3, `TODO`/
`FIXME` **0**. Sampling the hits: nearly all are **explanatory comments documenting what was
removed** ("the legacy `Animation` alias was DROPPED in 5.0.0 — Q.WE1 — NO-LEGACY") — i.e. the
discipline being recorded, not violated. This corroborates R's "no-legacy HELD" verdict. The
5 `workaround` + 3 `HACK` live-code hits are the only genuine S targets and are small.
**Proposal (S):** a quick lib+demo legacy-sweep lane to (a) confirm the 8 live hits are
justified or excise them, and (b) decide whether the removal-documentation comments are worth
keeping now that 5.0.0/5.1.0 have shipped (they read as archaeology).

### Finding 9 — [LOW] `demo/app` is a flat 17-file grab-bag; `demo/playground` identity is genuinely unclear — both confirmed
`demo/app/` holds `App.vue` + ~15 loose top-level files (`useSceneMachineApp.ts`,
`useSceneMachineRouter.ts`, `useSceneSwap.ts`, `useSceneTransition.ts`,
`useSceneVisibilityPause.ts`, `useRafScene.ts`, `cubeTransformStore.ts`, `rafConstants.ts`,
`loaf-observer.ts`, `sceneExposedApi.ts`, `scene-transition.css`, `useMonacoCancellationGuard.ts`,
…) with no sub-module colocation — the exact "long-running dirs that could be colocated within
features" the S kickoff names. `demo/playground/` is 3 files (`App.vue`, `index.html`,
`usePlaygroundAnimations.ts`) + a stale `dist/` — a standalone app whose purpose the owner
literally asks ("what even is demo/playground"). **Proposal (S):** colocate `demo/app` by
concern (a `scene-machine/` module for the 5 `useSceneMachine*`/`useSceneSwap`/
`useSceneTransition` files; a `raf/` or fold into it; a `cube/` store home), and either give
`playground` a stated identity (asset/experimentation sandbox) with a README or fold it.

### Finding 10 — [LOW] The standing recovery cron dominates the transcript and can mask genuine drift
173 of 287 messages are the recovery boilerplate ("Continue. Re-deploy all workflows and agents
thereof — no exceptions"). This is by design (session-limit resilience, `J/J.md`) and worked
(J/Q/R all completed autonomously). But it means the *genuine* owner signal is ~114 messages,
and a mis-execution during a long autonomous run gets no corrective until the owner next looks
("What remains? What's red?"). The R impl-drive lesson (transcript compaction §4) — *"agents
mis-reported 3 regressions as pre-existing; always re-run the gate yourself"* — is the direct
consequence. **Proposal (S):** carry the R lesson forward as an explicit orchestration precept:
independent gate re-runs at every integration, never trust an agent's "green/pre-existing" claim.

---

## 5. The Tranche-S kickoff — the new asks (2026-07-02, verbatim spine)

Beyond re-issuing the 7-clause mandate, the S kickoff adds these **new/sharpened** requests:

1. **Deeper library sub-zoning** — "within compile/, why not have a backward/ module, and an
   easing module; within engine, why not a css/ module." (Finding 1/4.)
2. **demo/app is "a mess"; "what even is demo/playground"** — deeper feature colocation.
   (Finding 9.)
3. **SOTA re-research in parsing AND animation**, applied to **uplift parse-that too** —
   "research again the SOTA in both parsing and animation … applied to uplift parse-that."
4. **bbnf-lang is in active development — NOT to be considered yet.** (Hard constraint;
   echoes the P retraction of the codegen spine.)
5. **glass-ui 5.0.0 is forthcoming (BG/BH tranches)** — "be aware of the forthcoming glass-ui
   5.0.0 changes." (Consume-published-not-branches; a cross-repo edge to track.)
6. **Resurrect the shelved scene-switcher** — "develop an entire tranche set, based on the
   shelved scene switcher from many tranches/sessions ago." (Finding 6.)
7. **NO legacy code** (re-issued). (Finding 8.)
8. **Fold ALL chronic + open deferrals.**
9. **Full prompt recap — "ensure they've been addressed."** (This lane + the r-lane fleet.)
10. **Design routing is now mandatory-Fable**: "all design must be routed using Fable and the
    frontend design plugin … Each frontend page … analyzed using the frontend design plugin
    with a Fable instance."
11. **The explicit 5-step convergence loop** (research→synthesize→prototype→critique[return
    %convergence]→synthesize; loop to 100% convergence, then develop the exact wave set).
12. **Batches of three agents in parallel** (rate-limit discipline, re-issued).

---

## 6. Preliminary ADDRESSED / PARTIALLY / UNADDRESSED map

Verified against the current `tranche-s-dev` tree where falsifiable; else chain-trusted to the
recap docs (noted). "ADDRESSED" = landed + tree-verified; "PARTIAL" = landed for a subset or
letter-not-spirit; "OPEN" = S-scope.

| Request (source) | Status | Evidence / note |
|---|---|---|
| 7-clause mandate honored as a process | ADDRESSED (recurring) | every tranche A→R ran the audit/recap/fold/dev-only cycle |
| NO quick solutions / NO workarounds | ADDRESSED | 5 `workaround`/3 `HACK` live hits remain (Finding 8) — S sweep |
| NO legacy / deprecated | ADDRESSED | `@deprecated` aliases dropped 5.0.0; residue is comments (Finding 8) |
| Architectural transposition / NO god modules | **PARTIAL** | R split the god-modules into zones ✅ **but** carve-to-500-ceiling + no feature sub-zoning (Findings 1,4) — **S core** |
| SOTA perf (engine) | ADDRESSED | SoA compositor 2.5×, zero-alloc, 16.6×@K=8 (benches present); re-research is an S ask |
| SOTA parsing / parse-that as primitives | PARTIAL | parse-that CSS parser deleted (Constellation A); "uplift parse-that" is re-opened in S |
| 2026+ CSS grammar (`if()`,`@function`,`spring()`) | ADDRESSED (subset) | `resolve/` emerging-CSS resolver present; element-dependent arm to verify (P3) |
| Remove `animate()` (Q) | ADDRESSED | excised R.W4; `./engine` 39-key mirror carries no `animate` |
| keyframes-vue "overfit — revoke from NPM" | ADDRESSED (KILL) | unpublished + deleted R.W0 (`23a6867`); R FINAL records the KILL |
| Reduced-motion gestalt (B) | ADDRESSED | one `ReducedMotionSnap` |
| Design language: glass/paper/audacious type/pops; refined-not-abrogated | ADDRESSED — TASTE user-domain | K deployed, L.W11 refined; S adds mandatory-Fable routing |
| Dock leveraged / folded into glass-ui base | ADDRESSED (outward) | dock lives in glass-ui (USER-DOMAIN); glass-ui 5.0.0 forthcoming |
| Apparatus: "why so slow / not in tests/ / what are proof scripts" | **PARTIAL** | M.W1 run-all shipped (speed); gate sprawl + legibility open (Finding 7) |
| Device-dependent demo gate greened | **PARTIAL/chronic** | still red-on-Linux; Q+R shipped via manual deploy (Finding 3) — **S fold** |
| Scene-switcher (N-Stage DK64 carousel) | **OPEN (shelved w/ spec)** | `N/STAGE-SPEC.md` preserved; **S first-class deliverable** (Finding 6) |
| Broken Q.WC3 phone scroll-snap carousel | OPEN (removal planned) | `R/audit/demo-scene-switcher.md` — delete in S |
| demo/app colocation; demo/playground identity | **OPEN** | flat 17-file `demo/app`; 3-file `playground` (Finding 9) — **S scope** |
| Fold all chronic + open deferrals | ADDRESSED per-tranche; re-issued each time | S must re-collect from R `PROGRESS.md` "Open deferrals" ledger |
| Recap ALL prompts, ensure addressed | ADDRESSED (chain) + **THIS LANE** | A→Q recap chain + R retro-recap + this r1 corpus |
| Deploy authorization (Cloudflare/AWS) | ADDRESSED | keyframes.babb.dev live on CF Pages; deploy path documented |
| Orchestration: parallel/worktrees/batches-of-3/Opus-Sonnet-fanout | ADDRESSED (method) | R ran 2-3 worktrees + delegated agents; S re-issues + the 5-step loop |
| Dev-only / NOT implementation this phase | HONORED (S is DEV) | this lane wrote zero source |

**Zero requests are DROPPED.** The genuine S-scope open set: **decomposition-spirit (sub-zoning),
demo/app + playground restructure, scene-switcher resurrection, device-gate greening, apparatus
legibility, parse-that SOTA uplift** — plus the standing design-routing and fold-all-deferrals.

---

## Tranche-S implications (wave-shaped recommendations)

Concrete, wave-sized, ordered by the S-mandate's own structure:

1. **W: Library sub-zoning (the decomposition-spirit close).** Deepen the R zones into
   cohesive feature sub-modules — `compile/backward/`, `compile/easing/`, `engine/css/` (the
   owner's named examples) — driven by cohesion, not the 500 L cap. **Simultaneously reform the
   ceiling gate:** convert `proof:decomposition` from a cap-with-headroom into an artifact/
   cohesion check; forbid any override exceeding base without a dated red-expiry (closes
   Findings 1, 2, 4). This is the keystone: it roots the twelve-tranche DF-11 chronic in
   *spirit*, not just letter.

2. **W: demo/app + playground restructure.** Colocate `demo/app` by feature (a `scene-machine/`
   module, a `raf/` home, a `cube/` store home); give `demo/playground` a stated identity +
   README or fold it into the app. Isomorphic-except-named-deltas (Finding 9).

3. **W: Scene-switcher resurrection (first-class, multi-wave).** Resurrect the N-Stage DK64
   carousel from the preserved `N/STAGE-SPEC.md`, first-principles, **one choreographed stage
   at a time** (the owner's explicit prescription), LIVE previews (LOD/`content-visibility`),
   LIGHT-barrel-only picker, `Teleport` overlay, dogfooding kf's engine, verified live via
   chrome-devtools-mcp. **Delete the broken Q.WC3 phone carousel** so there is one switching
   authority (Finding 6). Design routed through Fable per the S mandate.

4. **W: Device-gate greening + apparatus rationalization.** Make LoAF/timeout thresholds
   runner-relative (or split advisory-perf from hard-correctness) so the deploy gate stops being
   routed around; inventory the ~185 `proof:*` gates, fold genuine unit tests into `test/`, and
   produce a one-page tier legend. Re-affirm or replace the dep-cruiser lint-tier enforcer
   (Findings 3, 7; R retro-recap §4).

5. **W: parse-that + animation SOTA re-research (research fleet).** The 5-step convergence loop
   applied to parsing (parse-that primitives, 2026+ CSS) and animation SOTA, feeding both the
   library uplift and the scene-switcher motion design. Hard constraint: **bbnf-lang excluded**;
   glass-ui 5.0.0 consumed-published-only (S-kickoff items 3, 4, 5).

6. **W: Legacy + deferral sweep.** Excise/justify the 8 live `workaround`/`HACK` hits; decide the
   removal-archaeology comments' fate; re-collect the R `PROGRESS.md` "Open deferrals" ledger and
   fold every row into an S wave or an owner-ratified KILL (Findings 8; S items 7, 8).

7. **Orchestration precept to carry (from R's hard-won lesson).** Independent gate re-runs at
   every integration; never trust an agent's "green / pre-existing" claim; batches of three;
   core-model orchestrates, Opus/Sonnet fan out; design → Fable + frontend-design plugin
   (Finding 10; S items 10, 11, 12).

8. **Recap-integrity guard.** S's own prompt-recap must re-verify — not chain-trust — the two
   R reversals (keyframes-vue KILL, lint-tier) and the decomposition-spirit gap, so the recap
   stays honest exactly as R's retro-recap demanded of Q.
