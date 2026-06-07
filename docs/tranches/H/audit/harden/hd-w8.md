# DEEP harden — lane `hd-w8` (H.W8, the GATE-REGIME upgrade)

**Charge.** Red-team H.W8 substantively: is `proof:visual-lock` implementable in
THIS CI; is re-sourcing the SCENES manifest concrete; is the chronic-closure
meta-gate enforceable; is the wave a genuine durability fix or hand-wavy? Verdict
+ findings with evidence (file:line / live / node_modules / package.json).

**Method.** Read `waves/H.W8.md`, `a-gate-blindspots`, `a-deferred-chronic`,
`_SYNTHESIS-deferred-ledger`. Re-verified the substrate on `tranche-h-dev`:
`scripts/lib/demo-driver.mjs`, `demo/app/scenes.ts`, `package.json` (deps + the
`proof:*` set + `proof:all`), `.github/workflows/ci.yml`, `scripts/capture.mjs`,
`scripts/demo-smoke.mjs`, `scripts/occlusion-gate.mjs`, `scripts/proof-demo-usability.mjs`,
`scripts/proof-dogfood.mjs`, `H/PROGRESS.md` §chronic table.

---

## VERDICT

**H.W8 is SOUND in its architecture and is the genuine durability keystone** — the
two ROOT diagnoses (no appearance/interaction axis; the stale 6-vs-9 manifest) are
re-verified TRUE, the three structural additions are the right levers, and most of
the substrate claims (the existing `serveDist`/`openControlsPanel`/`subjectRect`
driver, the `capture.mjs` ≥5-frame RM sampler, the `occlusion-gate` stale-guard, the
`proof:demo-usability` clause-2 hero probe) check out exactly as cited. This is NOT
a hand-wavy wave.

But it carries **2 BLOCKER + 3 HIGH** defects that stop it being implementable AS
WRITTEN. The blockers are both feasibility gaps the wave silently assumes away: the
pixel-diff toolchain does not exist in the repo, and the meta-gate's "resolve-or-red"
mechanism is specified against a substrate whose gate NAMES do not match (a dangling
reference the gate itself would red on — fatally, since the gate cannot bootstrap a
green state). The HIGHs are a measure-first claim the wave cannot honor as ordered, a
mis-described "missing peer" that hides real net-new harness scope, and the
born-RED `proof:dock-live` settle-budget that is unmeasurable pre-fix.

---

## BLOCKER findings

### B1 — `proof:visual-lock` depends on `pixelmatch` + `pngjs`, which do NOT exist in the repo, and the wave never names this as a dependency add
- **Location:** `H.W8.md §Scope S2` / `§Hard gate proof:visual-lock` / `§Design decisions` ("the broadest lever … diff via `pixelmatch`").
- **Evidence:** `package.json` runtime deps are EXACTLY two: `@mkbabb/parse-that`, `@mkbabb/value.js`. `pixelmatch: ABSENT`, `pngjs: ABSENT`, `sharp: ABSENT`, `playwright/-core/@playwright/test: ABSENT` (verified via `node -e` over `package.json`). The repo NEVER decodes a PNG today — `grep -rlE 'toMatchSnapshot|toHaveScreenshot|pixelmatch' scripts/ test/` returns nothing (the audit confirms this, `a-gate-blindspots.md:35`). `capture.mjs` only WRITES screenshots (`page.screenshot({path})`) — it never reads pixels back. So the entire decode-and-diff half is net-new tooling with a net-new dependency edge.
- **Why it BLOCKS:** the wave's scope line is `scripts/proof-visual-lock.mjs` + "diff via `pixelmatch`" with NO `package.json` delta named. A gate that imports a package not in the lockfile fails at `node` resolve time. The lib-posture is also load-bearing here: the repo deliberately keeps runtime deps at 2 and installs Playwright/lighthouse `--no-save` in CI (`ci.yml:176` `npm i --no-save @playwright/test lighthouse`). `pixelmatch`/`pngjs` must be added the SAME way (devDep or `--no-save` in the demo-gate job), and the wave must SAY so.
- **Concrete doc edit:** in `§Scope S2`, add to the scope list: "**+ `pixelmatch` + `pngjs` as devDeps** (or `npm i --no-save` in the `demo-smoke` CI job, mirroring the `@playwright/test` posture at `ci.yml:176` — the 2-runtime-dep library posture is preserved; the diff toolchain is CI-only)." Add a sentence to `§Design decisions` resolving the dep posture explicitly so it is not read as "free."

### B2 — the chronic meta-gate parses a substrate whose gate NAMES do not match across the docs; the "dangling-reference reds" mechanism would red on the dock row at authoring time, with no green state reachable
- **Location:** `H.W8.md §Scope S3` (clause (ii): "every row whose closure is a HANDOFF carries a born-RED `proof:*` gate name that likewise resolves … the dock row names `proof:dock-live`/`proof:dock-morph-settled`") and `§Hard gate` ("`proof:dock-live` (S3, I-3 the HANDOFF born-RED gate)").
- **Evidence:** the COMMITTED canonical table the gate parses is `H/PROGRESS.md:267-272`. Its DOCK row (`:272`) names the born-RED gate **`proof:dock-morph-settled`** — NOT `proof:dock-live`. H.W8 authors and wires **`proof:dock-live`**. The cross-repo perimeter (`PROGRESS.md:240-242`) names yet a THIRD: `proof:dock-morph-settled` again ("≤200ms born-RED"). So the table the gate reads says `dock-morph-settled`; the gate H.W8 authors is `dock-live`; H.W8 S3 itself hedges "`proof:dock-live`/`proof:dock-morph-settled`" as if they are interchangeable. They are not — a string-parse "resolve-or-red" gate (the explicit mechanism, mirroring `proof:idioms` clause-1 token resolution) will look up the NAME in the table, fail to find an authored gate matching it, and red on a dangling reference. Because this is the wave's own BORN-RED keystone, there is **no green state reachable** until the names are unified — the gate cannot bootstrap.
- **Same class, φ-hero row:** H.W8 S3 says the φ-hero SYSTEM gate is `proof:phi-leaf-zero` and the meta-gate "asserts … the φ-hero row names `proof:phi-leaf-zero`." `PROGRESS.md:270` DOES name `proof:phi-leaf-zero` (good) but ALSO says "`proof:hero-rung` alone is the rung half — insufficient." H.W4 (`H.md:366`) authors BOTH `proof:hero-rung` AND `proof:phi-leaf-zero`. This row is consistent — but only because I traced it; the dock row is NOT, and the meta-gate's whole value is that it reds on exactly this kind of name drift. A meta-gate that cannot survive its own authoring substrate is not enforceable.
- **Why it BLOCKS:** the meta-gate is THE keystone of the wave ("the LAST re-paper"). If its parseable substrate has a dangling gate name, the gate either (a) reds permanently with no fix path inside H, or (b) is quietly written to fuzzy-match (which DESTROYS the "dangling-reference catches M1 paper-close" bite — the exact failure mode B2 demonstrates). Either way the durability claim collapses.
- **Concrete doc edit:** (1) pick ONE name for the dock born-RED gate and use it in ALL THREE places — `H.W8.md §Scope S3`, `H.W8.md §Hard gate`, and `H/PROGRESS.md:272` (+ `:240-242`). Recommend `proof:dock-live` (it is what H.W8 actually authors and what `a-deferred-chronic §3`/`_SYNTHESIS-deferred-ledger §1 CH-4` name); fix `PROGRESS.md:272` to read `proof:dock-live`. (2) In `§Scope S3`, add a clause: "the gate asserts the table's named gate string is BYTE-IDENTICAL to an authored `proof:*` script key in `package.json` (the resolve set), so a rename in either place reds — this is the dangling-reference bite and it must hold against THIS wave's own gate names." (3) Add a born-RED note that `proof:dock-live` is the canonical name and `proof:dock-morph-settled` is RETIRED, so no alias survives (no-legacy).

---

## HIGH findings

### H1 — "MEASURE-FIRST the visual tolerance from 3 identical runs before binding HARD" is not orderable as written: the baseline is captured AFTER the fix waves land, so the tolerance run cannot precede the gate's existence
- **Location:** `H.W8.md §Scope S2` + `§Hard gate proof:visual-lock` ("MEASURE-FIRST: tolerance bound from 3 identical runs before binding HARD") + `§DAG-deps` ("the baseline is captured AFTER the fix waves (H.W2..H.W7) land").
- **Evidence:** the wave couples three orderings that conflict: (a) the baseline IS the fixed render → it cannot exist until H.W2–H.W7 land; (b) tolerance must be measured from 3 identical runs BEFORE binding HARD; (c) `proof:visual-lock` is the gate that locks D1/D3/D4/D6/D7 against regression. But anti-aliasing/sub-pixel/font-hinting flap is a property of the HARNESS + the viewport + the browser build, NOT of the fixed render — it can and SHOULD be measured against ANY stable scene TODAY (the pre-H render is perfectly stable for a flake measurement). The wave conflates "measure the noise floor" (do-able now, harness-only) with "capture the golden baseline" (must wait for the fixes). As written, a literal reader defers BOTH to post-H.W7, leaving zero slack to discover the harness flaps before the gate goes HARD — exactly the flake risk the wave warns about.
- **Concrete doc edit:** in `§Scope S2`, split the two measure-first acts: "(a) **the noise-floor measurement** — run the harness 3× against the CURRENT (pre-fix) render of one stable scene, derive the per-region tolerance from the max inter-run diff; this is HARNESS-only and lands in DEV/early-H, independent of the fix waves. (b) **the golden baseline capture** — taken AFTER H.W2–H.W7 land. The tolerance from (a) binds the diff in (b)." This makes the measure-first concrete and removes the ordering contradiction.

### H2 — `proof:visual-lock` is NOT "the missing peer of `capture.mjs`" — capture is full-page, 3-viewport, no readback; the named-region × controls-state matrix is substantially net-new harness, and calling it a "promotion" under-scopes it
- **Location:** `H.W8.md §Goal` / `§Scope S2` / `§Design decisions` ("it is the missing PEER of `capture.mjs` … H promotes the frames to a gated diff, not a new god-script").
- **Evidence:** `capture.mjs:70-72` shoots `{375, 1280, 1440}` (the wave wants `{375, 1440}`); `:267` does `page.screenshot({path})` = FULL PAGE (the wave wants CLIPPED named regions: controls pane, hero, ribbon, easing editor); capture has NO controls-closed×open dimension in its `screenshotMatrix` (`:228`), and NO pixel READBACK at all (it only writes). The wave's matrix is `scene × {375,1440} × {closed,open}` clipped to ≥4 named region selectors, then decode-and-diff. That is: region-selector geometry per scene, the open/closed drive (it CAN reuse `openControlsPanel`, verified exported `demo-driver.mjs:148` — that part is honest), PNG decode, and per-region `pixelmatch` with per-region tolerance. The reused surface is `serveDist` + `openControlsPanel` + `resolveChromium`; the diff engine and the region-clip matrix are NEW. "Promotes the frames" hides ~all of the real work.
- **Why HIGH not BLOCKER:** the work is feasible and the no-new-god-script intent is honorable (it SHOULD reuse the driver). But the under-scoping invites an implementer to clone `capture.mjs` and bolt a diff on, missing the region-clip discipline that is the whole anti-flake thesis.
- **Concrete doc edit:** in `§Design decisions`, replace "the missing PEER of `capture.mjs` … H promotes the frames" with: "it REUSES `capture.mjs`'s driver surface (`serveDist`/`openControlsPanel`/`resolveChromium`) but is net-new in three respects capture lacks: (1) **named-region clipping** (`screenshot({clip})` per region selector, not full-page), (2) the **controls closed×open** dimension, (3) **pixel readback + `pixelmatch` diff** (capture only writes). It is a new `proof:visual-lock.mjs` built ON the shared driver — DRY in its driver, net-new in its diff." This keeps the no-god-script claim while honestly sizing the work.

### H3 — `proof:dock-live`'s "settles ≤1 frame of its spring" budget is unmeasurable born-RED, and the spring is glass-ui-owned — the budget half cannot be MEASURE-FIRST when the subject is broken
- **Location:** `H.W8.md §Scope S3` + `§Hard gate proof:dock-live` ("dock expand/collapse settles ≤1 frame of its spring (MEASURE-FIRST the budget)") + `§Folds I-8` ("`proof:dock-perf` is the MEASURE-FIRST half … the budget gate is kf's").
- **Evidence:** the wave says the budget is MEASURE-FIRST (`a-deferred-chronic §6 CH-4` "≤1 frame" is explicitly "MEASURE-FIRST — the gate must measure, not assert"). But the dock D5 lag is a LIVE defect TODAY (`.glass-dock` animates non-compositable `width`, `_SYNTHESIS-deferred-ledger §1 CH-4 :171-172`) and the spring is glass-ui's (`--spring-dock`, consumed `^3.4.0`, `PROGRESS.md:147,240-242`). You cannot derive a "≤1 frame of its spring" settle budget from a broken/laggy baseline — there is no clean spring to measure against until the glass-ui AW fix lands. So the budget is circular: it is MEASURE-FIRST but the only available measurement is the broken state. The popover-OPENS half (`finalOpen:true`) is cleanly born-RED and falsifiable; the settle-≤1-frame half is not measurable until after the HANDOFF lands.
- **Concrete doc edit:** in `§Hard gate proof:dock-live`, split the gate's two clauses by measurability: "**(a) popover-opens** — born-RED today (`finalOpen:false`), cleanly falsifiable, binds NOW. **(b) settle budget** — the ≤1-frame/transform-not-width clause is RECORDED-WITHHELD-with-the-broken-number until the glass-ui AW fix is consumed; the budget is then MEASURE-FIRST against the FIXED spring (a clean baseline), at which point it binds HARD. A budget derived from the laggy pre-fix dock is not a budget." Cite `_SYNTHESIS-deferred-ledger §1 CH-4` for the width-animation root-cause as the WITHHELD evidence.

---

## MED findings

### M1 — `proof:scene-parity` after the pertinence verdict can shrink the manifest below 9, and the wave never reconciles `proof:manifest-sourced`'s "every scenes.ts id appears in SCENES" with H.W5 DELETING scenes
- **Location:** `H.W8.md §Scope S1` (stale-key guard: "a manifest key with no `scenes.ts` id reds") + `§Scope S4 I-7` ("for every SURVIVING scene") + `§Hard gate proof:scene-parity` ("binds AFTER `a-modes-pertinence` decides survivors").
- **Evidence:** `scenes.ts:115` ships `starting-style` with **`label: "Discrete"`**; H.W5 (`H.md:178,256-260`) MERGES Discrete into a Spring sub-view (4 nav → 3) and the survivors set is decided by `a-modes-pertinence`. So `scenes.ts` itself will LOSE the `starting-style` id (or it becomes a non-routed sub-view). The manifest-sourced gate's bidirectional bite ("every scenes.ts id ∈ SCENES; every SCENES key ∈ scenes.ts") is correct ONLY if `scenes.ts` is the post-H.W5 source. If H.W5 lands BEFORE the gate, fine; if the gate's "9 ids" born-RED claim (`§Hard gate`: "reds TODAY — scenes.ts has 9 ids") is asserted as a STANDING invariant, it will mis-fire once H.W5 removes one. The wave's DAG-deps name I-1 as the prerequisite but never names the H.W5 pertinence cut as a thing the manifest-sourced count must track.
- **Concrete doc edit:** in `§Scope S1`, add: "the born-RED `9 ids vs 6` claim is a SNAPSHOT of the pre-H tree; the STANDING invariant is `SCENES keys ≡ scenes.ts ids` (bidirectional), which auto-tracks H.W5's pertinence cut (Discrete→Spring sub-view) — the gate asserts EQUALITY of the two sets, never a hard-coded count." This removes the brittle count and makes the gate survive H.W5.

### M2 — the wave asserts `proof:visual-lock` is "wired into the browser CI job (`demo-smoke`), NOT skippable-silent" but the demo-gate job's gates are themselves `KF_REQUIRE_BROWSER`-gated and NONE of the browser gates are in `proof:all`
- **Location:** `H.W8.md §Goal` / `§Hard gate` header ("Wired into `npm test`/the `proof:*` set + the browser CI job (not env-dark)") + `§Design decisions` ("LIT in the dev loop, not env-dark").
- **Evidence:** `proof:all` (package.json `:79`) contains the 31 source gates + `vitest run` — and ZERO of `demo-smoke`/`occlusion-gate`/`lighthouse`/`proof:demo-usability`/`capture`. They are NOT in `package.json` scripts at all (except `proof:lighthouse-mobile`). They run ONLY in the `demo-smoke` CI job (`ci.yml:159-207`) under `KF_REQUIRE_BROWSER: "1"` with `npm i --no-save @playwright/test` + `npx playwright install`. So "the browser gates are DARK by default" (the wave's own ROOT diagnosis) is structurally true at the `proof:all` level, and the wave's fix "wire into demo-smoke, not env-dark" actually wires it into the SAME env-gated job — it is LIT in CI but still ABSENT from the local `proof:all`/`npm test` loop the loop-agents run. The wave's phrase "LIT in the dev loop" overclaims unless `proof:visual-lock` (and ideally the browser genus) is ALSO added to a runnable local target.
- **Concrete doc edit:** in `§Design decisions` ("LIT in the dev loop"), sharpen: "`proof:visual-lock` is added (a) to the `demo-smoke` CI job (`ci.yml`), AND (b) to a NEW local `proof:browser` aggregate target (or `proof:all`'s browser tail, gated on a built `dist/`) so the appearance axis is reachable from `npm run` WITHOUT hand-setting `KF_REQUIRE_BROWSER` — otherwise it remains as dark-to-the-loop-agent as the gates it replaces (`ci.yml:159-207`; `proof:all` at package.json:79 contains zero browser gates today)."

### M3 — `proof:precept-sweep` (S5) is named a "WIRING clause composing existing/sibling gates" but `proof:docs-tree` and the `proof:no-legacy` regrep are NET-NEW and have no authored substrate; the bundle also renames sibling gates without a lock against alias drift
- **Location:** `H.W8.md §Scope S5` + `§Hard gate proof:precept-sweep`.
- **Evidence:** `grep -rlnE 'precept-sweep|docs-tree|no-legacy' scripts/ package.json` → only `proof-engine.mjs` and `proof-idioms.mjs` mention `no-legacy` in passing; there is NO `proof:docs-tree`, NO `proof:no-legacy` gate, NO `proof:precept-sweep`. `a-precept-sweep.md:218-223` itself says the bundle "should" compose `proof:scene-fsm`/`proof:scene-identity` — but those are the LANE's names; H.W8 correctly notes the AUTHORED names are `proof:scene-machine-irrefragable` (H.W1) + `proof:scene-icons`/`proof:scene-parity` (H.W5). So S5 authors TWO net-new lints (`proof:docs-tree`, `proof:no-legacy` regrep) AND a bundle that maps 4 lane-aliases onto 4 authored names. The wave's parenthetical ("authoring only `proof:docs-tree` + `proof:no-legacy`-regrep net-new here") is HONEST about the net-new pair — good — but it does not lock the alias map, and a bundle that silently swallows a missing sub-gate (e.g. H.W5 ships `scene-icons` under a different name) would green vacuously, defeating the spine claim.
- **Concrete doc edit:** in `§Hard gate proof:precept-sweep`, add: "the bundle resolves each of its 4 members by BYTE-IDENTICAL `package.json` script key (same resolve-or-red mechanism as the S3 meta-gate, B2) — a missing/renamed sub-gate reds the bundle, never greens vacuously. The lane-aliases (`proof:scene-fsm`≡`proof:scene-machine-irrefragable`, `proof:scene-identity`≡`proof:scene-icons`+`proof:scene-parity`) are recorded ONCE here as the canonical map; no alias is authored as a real script."

---

## LOW / NIT

### L1 (LOW) — `proof:motion-liveness` rAF-sampler reuse claim is sound, but the template is `capture.mjs`'s RM probe, not `proof:dogfood`
- **Location:** `H.W8.md §Scope S4 I-6` ("the dual of `proof:dogfood`'s rAF discipline").
- **Evidence:** `proof:dogfood` is a STATIC grep for `requestAnimationFrame` in source (`proof-dogfood.mjs:67` `const RAF = /\brequestAnimationFrame\b/g`) — it has NO in-browser frame sampler. The reusable in-page ≥5-frame opacity/transform sampler ALREADY exists in `capture.mjs` (`:304` `RM_FRAME_COUNT=6`, `:305` `RM_DURATION_MS=2000`, reads `getComputedStyle` across frames). The wave even cites this elsewhere ("reusing the existing RM probe pattern in `capture.mjs`", `a-gate-blindspots.md:176`). So the architecture is fine; the "dual of `proof:dogfood`" phrase mis-attributes the template.
- **Concrete doc edit:** change "the dual of `proof:dogfood`'s rAF discipline" to "REUSES `capture.mjs`'s ≥5-frame RM sampler pattern (`capture.mjs:304-305`, computed-style across frames); it is the RUNTIME complement to `proof:dogfood`'s STATIC rAF grep." Keeps the inv-ζ framing, fixes the template attribution.

### L2 (NIT) — the `occlusion-gate` allowance to RETIRE is `square/mobile/{closed,open}` (two keys), not "`square/mobile`"
- **Location:** `H.W8.md §Scope S4 I-9` / `§Hard gate` ("RETIRE the `square/mobile` allowance (`occlusion-gate.mjs:91-94`)").
- **Evidence:** `occlusion-gate.mjs:91-94` is `PENDING_OCCLUSION = new Set(["square/mobile/closed", "square/mobile/open"])` — TWO entries (controls-closed AND controls-open). The retire must remove BOTH. Minor, but the stale-guard (`:347-353`, verified) reds per-entry, so an implementer removing one and leaving the other gets a confusing partial-red.
- **Concrete doc edit:** "RETIRE BOTH `square/mobile/closed` AND `square/mobile/open` from `PENDING_OCCLUSION` (`occlusion-gate.mjs:91-94`)."

---

## What checks out (no finding — credit where the authoring is sound)

- **ROOT-A / ROOT-B are TRUE.** `demo-driver.mjs:40-59` = 6 SCENES; `scenes.ts` = home + 8 (`sequence`/`motion-path`/`starting-style` unmanifested). No pixel-diff anywhere. Re-verified.
- **The driver reuse is real.** `serveDist` (`:106`), `openControlsPanel` (`:148`), `subjectRect` (`:232`), `resolveChromium` (`:74`) all exported — the visual-lock and motion-liveness harnesses genuinely have a shared driver to build on. The no-god-script intent is achievable.
- **The static-lock extensions are one-liners on real anchors.** `proof:demo-usability` clause 2 DOES read `getComputedStyle(h1)` and check `text-display-*` (`proof-demo-usability.mjs:179-237`, verified) — the φ-hero floor is a genuine one-line extension. The `occlusion-gate` stale-guard (`:347-353`) and `PENDING_OCCLUSION` (`:91-94`) are exactly as cited.
- **`proof:phi-leaf-zero` IS authored in H.W4** (`H.md:366`), so the meta-gate's CITED-not-authored boundary (S3) is honored for the φ-hero row — only the dock row (B2) is broken.
- **The meta-gate's "resolve-or-red" is the RIGHT mechanism** (a static parse of a committed table, mirroring `proof:idioms` clause-1 + the `LISTENER_ALLOWLIST` stale-guard) — once B2's name drift is fixed it is genuinely enforceable, and it DOES structurally catch M3 (bare HANDOFF with no born-RED gate) and the M1 paper-close (dangling SYSTEM gate name).
- **The "browser gates DARK by default" diagnosis is re-verified** (`proof:all` has zero browser gates; `ci.yml:159-207` is the only place they run, all `KF_REQUIRE_BROWSER`-gated) — the wave correctly identifies the mechanism by which D1–D14 lived unseen. (M2 only sharpens the FIX's overclaim, not the diagnosis.)

---

## inv ε ledger
Every claim above traces to a `file:line` on `tranche-h-dev` re-read this pass:
`package.json` (deps={parse-that,value.js}; `proof:all` :79 = 31 source gates, no browser;
pixelmatch/pngjs/playwright ABSENT), `demo-driver.mjs:40-59,74,106,148,232`,
`scenes.ts:115` (`starting-style` label "Discrete"), `ci.yml:159-207,176,178`,
`capture.mjs:70-72,228,267,304-305`, `proof-dogfood.mjs:67`,
`proof-demo-usability.mjs:179-237`, `occlusion-gate.mjs:91-94,347-353`,
`H/PROGRESS.md:267-272,240-242`, `H.md:178,256-260,366`.
