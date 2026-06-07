# G — the COMPLETE consolidated prompt recap (A → B → C → D → constellation → E → F → THIS G ask)

**Lane id:** `a-prompt-recap` (Tranche G post-F deep audit; branch `tranche-g-dev`).
**Job:** recap EVERY user prompt + request across the whole engagement (A→G), build the
full ask→disposition table (ADDRESSED / PENDING / G-SCOPE), confirm the recurring PRECEPTS
held A→F with no drops, and surface the LATEST G asks. **inv ε:** every claim is
file:line- or commit- or lane-grounded against the live `tranche-g-dev` tree (HEAD
`8fea80c`, version `4.0.0`), never asserted. **This is TRANCHE DEVELOPMENT — docs only;
ZERO source/test/CI/demo edits.** This lane wrote ONLY this file.

This chains and **supersedes** the prior per-tranche recaps (verified at G-open, nothing
regressed):

- B: `B/FINAL.md` §Prompt recap (P1+P2)
- C: `C/audit/lanes/prompt-recap.md` (P1+P2+P3)
- D: `D/audit/prompt-recap.md` (P1→P5)
- E: `E/audit/prompt-recap.md` (A→constellation→E)
- F: `F/audit/_SYNTHESIS-prompt-recap.md` (the full A→F, P1→P8) — **the immediate predecessor**

The whole A→F half is preserved **verbatim-in-substance** from the F synthesis recap and
**re-confirmed at G-open** (cross-checked against the live tree + the `tranche-f-impl`
landing record in `F/FINAL.md`). The **net-NEW content of this G recap** is:
**§P9 (THIS G ask) · §G-SCOPE (the carried-forward F BOOKs + the net-new G surfaces) ·
§Precepts G-column (verified HONORED A→F, one net-new watch) · the §pin-lag finding
(the one genuinely net-new closeable item G inherits at open).**

Status legend (terminal as of G-open):

- **ADDRESSED** — landed + verified in a prior tranche (cite commit/file:line); no later obligation
- **PENDING** — authored + gated; a D-OWNED close (D.W5/W6 on glass-ui 3.3.0) — NOT E/F/G's scope
- **G-SCOPE** — folds into a named G lane (a net-NEW or carried-BOOK finding); cite the F ledger row or live evidence
- **HONORED** — a recurring precept threaded through (verified §Precepts)
- **value.js-HANDOFF / parse-that-HANDOFF / glass-ui-HANDOFF** — a sibling repo owns it (inv-16, relaxed for G impl per the G mandate, but each repo AUDITED as its own surface + tagged HAND-OFF)

---

## §0 — The honest G-open headline

**F was the narrow finishing layer; it LANDED (16 waves, all gated) and RELEASED**
(`F/FINAL.md`: kf `4.0.0`, value.js `0.11.0`, parse-that `0.9.0` published; the demo on
keyframes.babb.dev via Cloudflare Pages, `8fea80c`). **D+E+F left the engine kernel,
the boundary, the parse grammar, the FrameCompiler, and the CWV surface EXEMPLARY** — the
F assay manufactured little and that posture HOLDS into G. The G ask is the **16-agent
post-F deep audit**: it must find what is STILL not-SOTA after F, NOT re-litigate the
closed band.

**The ONE genuinely net-new closeable item G inherits at open is the dep PIN-LAG**
(§pin-lag below): F's cross-repo hand-off wins shipped in value.js `0.11.0` /
parse-that `0.9.0`, but kf's `package.json` STILL pins `@mkbabb/value.js ^0.10.0` and
`@mkbabb/parse-that ^0.8.2` (verified live). kf is not yet consuming the published F
hand-off it drove. **This is a G-SCOPE inv-27 consume-the-published fold** — and it
unblocks the F.W6 computed-endpoint memo (−94%), the parse `dispatch` fast tier, and the
parse-that span-dist completion that all landed in the published siblings.

Everything else G inherits is either ADDRESSED-and-closed (the bulk), correctly PENDING
(D.W5/W6, glass-ui-gated), or a **carried-forward F BOOK** the F ledger explicitly named
as net-new scope (the §G-SCOPE table). **There is NO perpetual keyframes-owned punt** —
P-invariant-28 held through F and holds at G-open.

---

## §pin-lag — the net-new G-open finding (inv-27, consume-the-published)

| What | Live evidence (G-open) | Disposition |
|---|---|---|
| **kf pins value.js `^0.10.0`** (the pre-F pin) while **value.js `0.11.0` is PUBLISHED** carrying F's C1/C2/C4/C7 computed-endpoint memo (−94%, `F/FINAL.md:39-44`), the `any()`→`dispatch()` fast tier (2.41×), the color-channel plan (3.96×), the 24 no-op length units fix, the maximal-munch correctness fix | `package.json` → `"@mkbabb/value.js": "^0.10.0"`; `npm view @mkbabb/value.js version` → `0.11.0`; node_modules not installed at audit time | **G-SCOPE** — re-pin to `^0.11.0`, re-build, re-run `proof:all`. kf consumes the F.W6 win unchanged through the `lerpValue → iv._lerp` seam (`engine.ts:629`) on re-pin — ZERO kf edit needed (the structural reason from `a-vj-consumption-F §1`). **Instrument:** a green `proof:all` + the `bench/interp-buffer.bench.ts` showing the endpoint-cache win materialized. |
| **kf pins parse-that `^0.8.2`** while **parse-that `0.9.0` is PUBLISHED** carrying the completed span dist (the PT-WAVE-3 source↔dist drift fix), the non-reentrant error-state thread onto `ParserState`, the isolated packrat | `package.json` → `"@mkbabb/parse-that": "^0.8.2"`; `npm view @mkbabb/parse-that version` → `0.9.0`; `F/FINAL.md:95-98` records the 0.9.0 landing | **G-SCOPE** — re-pin to `^0.9.0` (transitively, kf consumes parse-that only through value.js, so this rides the value.js re-pin; verify the `proof:boundary` light-barrel stays value.js-free). |

**Why this is the headline G fold and not an F drop:** F's `F/FINAL.md` correctly recorded
the hand-offs as landed on each sibling's `tranche-f-handoff` branch and "NOT published"
at F-close; the G ask states they ARE now published. The re-pin is the consume-leg that
inv-27 (consume-published-not-branches; `D-C3`) makes mandatory — it was *correctly*
deferred to publish-time and publish-time is now. It is a G-SCOPE fold, not a regression.

---

## P1 (tranche A) — all ADDRESSED, chain-verified, no later obligation

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| A1 | Execute tranche A in full | A | ADDRESSED | A W0–W5 landed (`d84faf5`); `A/PROGRESS.md` |
| A2 | Publish 3.0.0 first | A | ADDRESSED | `v3.0.0` tag + SLSA provenance; superseded by the `4.0.0` stack publish (`d264053`) |
| A3 | Export `RAFPlayback` PRM gate | A | ADDRESSED | `index.ts` exports `RAFPlayback`; B.W2 → shared `Tickable`/`playback.ts` |
| A4 | Changesets + `--provenance` | A | ADDRESSED | `release.yml` `npm publish --provenance`; `4.0.0` shipped provenance-signed (`F/FINAL.md:117-118`) |
| A5 | Gate on green CI | A | ADDRESSED | `ci.yml` library gate chain; B/C/D/E/F extended (smoke/occlusion/lighthouse/the 21-gate cohort) |
| A6 | `proof:boundary` (the value.js seam gated) | A | ADDRESSED | `scripts/proof-boundary.mjs`; re-confirmed SOTA (`a-boundary-arch-F §ALREADY-SOTA`) |
| A7 | `EasingResolvable` lazy-easing path | A | ADDRESSED-then-SUPERSEDED | A's resolver landed; B/C superseded w/ fail-explicit `resolveEasing`/`toEasing`; the A-era class is GONE (no alias; `easing.ts:10-13` documents the deletion) |

---

## P2 (tranche B) — every discrete request, ADDRESSED

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| B1 | Update all deps to latest | B | ADDRESSED (**G re-asserts at the sibling layer — see §pin-lag**) | B.W1 (`6487c7f`); `B/audit/dep-upgrade-matrix.txt`. The G-open value.js/parse-that pin-lag is the SAME precept re-applied post-F-publish |
| B2 | 6-agent deep audit of plan + changes | B | ADDRESSED | `B/audit/plan-findings.txt` (46 findings) |
| B3 | Path forward · gestalt · no-workaround · no-legacy · transpositions | B | HONORED (precept; threads A→F) | `B.md` + `B/audit/architecture-gestalt.md`; G re-threads it — §Precepts |
| B4 | Fold chronically-deferred + deferred | B | ADDRESSED | D was the terminal home; **F re-confirmed ZERO KFE; G inherits a CLEAN ledger** |
| B5 | Recap ALL prompts | B | ADDRESSED (chains forward) | `B.md` §Prompt recap; C→D→E→F→**this G recap** extend it |
| B6 | NOT an implementation phase (dev-only authoring) | B | ADDRESSED | B.W0 dev-only; later authorized |
| B7 | Full lighthouse + best-practices, every page + facet | B | ADDRESSED (E re-ran; F re-confirmed) | E.W4 `proof:lighthouse-mobile` (`KF_REQUIRE_LH=1`); `r-cwv-inp-2026` exemplary. **G ask re-opens the Playwright/CWV facet — §G-SCOPE GS-9** |
| B8 | Pull precepts + sync + before/after edict | B | ADDRESSED | precepts `8ccf9f4` on origin/main |
| B9 | Remove loading screen + improve loading | B | ADDRESSED | B.W4 splash removed; E.W4 Monaco deferred + font preload |
| B10 | 6 frontend-design agents audit design + glass-ui | B | ADDRESSED (E + F re-audited) | `B/audit/design-findings.txt`; F `a-demo-post-e` + `r-demo-design-2026`. **G ask re-opens frontend encapsulation + glass-ui leverage — §G-SCOPE GS-6/GS-8** |
| B11 | Create next tranche with perfected CI | B | ADDRESSED (cadence) | the tranche cadence; F.W2 wired the 21-gate cohort into CI. **G ask: "CI/constellation perfection" — §G-SCOPE GS-7** |
| B12 | Audit every page desktop+mobile, NO occlusion, dock perfected, Playwright | B | ADDRESSED (HARDENED in C) | B.W3 `occlusion-gate.mjs` advisory→HARD in C.W1. **G ask re-opens the Playwright demo audit — §G-SCOPE GS-9** |

---

## P3 (tranche C) — all ADDRESSED

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| C1 | Re-audit with 6 agents | C | ADDRESSED | `C/audit/plan-findings.txt` + `design-findings.txt` |
| C2 | Devise the path forward | C | ADDRESSED | `C.md` (W0–W5); PR #3, CI-green |
| C3 | Recap all prompts | C | ADDRESSED (chains forward) | `C/audit/lanes/prompt-recap.md`; D→E→F→**this G recap** extend it |
| C4 | NOT an implementation phase (then authorized) | C | ADDRESSED | C.W0 dev-only; later authorized |
| C5 | Fold deferred (owner + trigger) | C | ADDRESSED | D terminated the keyframes-owned set; F + G re-confirm ZERO KFE |
| C6 | 6-agent demo design inventory | C | ADDRESSED | `C/audit/design-findings.txt` (6 lenses) |
| C7 | Make B's close honest (inv ε) | C | ADDRESSED | C.W1 + C FINAL §B-overclaim reconciliation; the two drifts tracked §drift |
| C8 | Make the design language whole (φ-ladder) | C | ADDRESSED (display tier; leaf-tail → D.W2 closed) | C.W2; D.W2 |
| C9 | Make the shop-window run on its own engine (inv ζ) | C | ADDRESSED | C.W3 `proof:dogfood`; E.W2 listener analogue; F.W10 orbital-inertia dogfood (`e12487b`) |
| C10 | Before/after capture (re-runnable from repo) | C | ADDRESSED | `scripts/capture.mjs`; `C/audit/DELTA.md`; E `audit/DELTA.md` |
| C11 | π at full | C | ADDRESSED | `C/audit/pi.md` |

---

## P4 (the constellation drive) — keyframes-relevant requests

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| D-C1 | The dock+animation convergence (keyframes' arm) | constellation | ADDRESSED | the VT-parity spring shipped in glass-ui (PR #1) |
| D-C2 | The dock convergence + naming plan (keyframes' obligations) | constellation | **PENDING — D.W5 (D-PENDING-ON-E1)** | the local renames + `dock/index.ts` deletion gated on glass-ui 3.3.0. **D's close, NOT E/F/G's scope.** Verified still pre-rename at F-open (`F/_SYNTHESIS-deferred-ledger §6 DP-1`); **G re-verify = §G-SCOPE GS-8 (glass-ui-HANDOFF status check)** |
| D-C3 | Consume published-not-branches; gate on own green CI (inv-27) | constellation | ADDRESSED-as-posture → **G-SCOPE at the sibling layer** | D pins published value.js/glass-ui; **THE PIN-LAG (§pin-lag) is precisely this precept owed at the post-F-publish moment** |
| D-C4 | Keep `springLinearStops()` stable (the slides/glass-ui enabler) | constellation | ADDRESSED (stable through F) | the export stays light + value.js-free (`proof:boundary`); `springLinearStops.ts` present, untouched by F |

---

## P5 (tranche D) — the four constraints + the dev-only authoring boundary

| # | Request | Origin | Status | Evidence |
|---|---|---|---|---|
| D1 | The demo refined (decompose the oversized units, KISS) | D | ADDRESSED (D.W1 + E.W1 + F finishing) | nothing >350L post-E (`a-demo-post-e §7`); F.W14-16 finished undo/redo + a11y. **G frontend-encapsulation ask = §G-SCOPE GS-6 (re-audit, not rebuild)** |
| D2 | The design language localized + un-caged (styling gestalt) | D | ADDRESSED (D.W2 + E.W3 + F.W16 rail/ball correction) | F.W16 promoted the rail/ball idiom to `design-idioms.css` (`cd6dae6`), correcting the W11 record |
| D3 | Brittleness hardened (selectors · reactivity · fragile rules) | D | ADDRESSED (D.W3 + E.W2) | the vueuse listener gestalt; `proof:brittleness` clause 4 |
| D4 | The engine transposed to its gestalt (elegance · perf) | D | ADDRESSED (D.W4 + F.W4/W5 perf folds) | F.W4 the dict-mode buffer fold (~3.0× measured, `3802a50`); F.W5 sync-step drive half (`e072d3b`). **The Animation/group sync HALF was HELD (no-ship-on-assertion) → §G-SCOPE GS-3** |
| D5 | The dock leveraged + the mobile composition closed | D | **PENDING — D.W5 (D-PENDING-ON-E1)** | gated on glass-ui PUBLISHING 3.3.0. **NOT E/F/G's scope** (§G-SCOPE GS-8 = re-verify only) |
| D6 | Every keyframes-owned deferral terminated (P-invariant-28) | D | ADDRESSED | F re-confirmed ZERO KFE (`F/_SYNTHESIS-deferred-ledger §0,§7`); **G inherits clean** |
| D7 | Recap ALL prompts | D | ADDRESSED (chains forward) | `D/audit/prompt-recap.md`; **this G recap extends it** |
| D8 | NOT an implementation phase (D.W0 dev-only) | D | ADDRESSED | D.W0 dev-only; then authorized |
| D9 | elegance / simplicity / performance · transpositions · NO legacy · KISS · isomorphic | D | HONORED (precept; threads to G — §Precepts) | D-1..D-6 + F waves carry the rationale |
| D10 | The version owner named for the stacked changesets | D | ADDRESSED | **Mike Babb** (`mike@babb.dev`) named for B+C+D+E+F; the `4.0.0` stack PUBLISHED provenance-signed (`F/FINAL.md:112-118`, `d264053`). **G's changeset, if any wave lands, stacks atop — version owner re-named at G-close** |

---

## P6 (the E ask) — all ADDRESSED, F-confirmed

Every E-ask item resolved E-SCOPE (a net-NEW finding with a named E wave) or HONORED; F
re-confirmed each landed; **G re-confirms at F-publish**:

| # | Request | Origin | Status | G re-confirmation |
|---|---|---|---|---|
| E1 | Lighthouse every page; perf optimization strategy | E ask | ADDRESSED | `proof:lighthouse-mobile` CI-gated; `r-cwv-inp-2026` exemplary. **G re-opens the Playwright/CWV facet — GS-9** |
| E2 | Compare primitives vs modern-web-guidance | E ask | ADDRESSED | `r-modern-web-2026` ALREADY-SOTA; F.W12/W13 added MotionPath + `text-wrap: pretty`. **G "animation-SOTA + modern-web" re-opens it — GS-1/GS-5** |
| E3 | Frontend encapsulation / composables / state audit | E ask | ADDRESSED | `a-demo-post-e §7`: nothing >350L, no legacy orphans. **G "frontend encapsulation" re-opens it — GS-6** |
| E4 | Non-idiomatic Tailwind / global-monolith / deprecated-CSS audit | E ask | ADDRESSED | tokens reconciled; F.W16 rail/ball convergence. **G glass-ui leverage re-opens it — GS-8** |
| E5 | Deeply-nested / brittle selectors audit | E ask | ADDRESSED | the vueuse listener gestalt; `proof:brittleness` |
| E6 | Engine housekeeping (post-D BOOK items) | E ask | ADDRESSED + re-measured + folded | E.W5/W7/W8; F.W4/W5 landed the graduating perf folds; the rest re-measured WITHHELD |
| E7 | Recap ALL prompts | E ask | ADDRESSED | `E/audit/prompt-recap.md`; **this G recap chains it forward** |
| E8 | The clean deferred-ledger (zero KFE) | E ask | ADDRESSED | F re-confirmed; **G inherits ZERO KFE** |
| E9 | NOT an implementation phase (E.W0 dev-only) | E ask | HONORED | then authorized; W1–W11 landed |
| E10 | inv-16 (E writes only keyframes.js) | E ask | HONORED-then-RELAXED-for-F/G-impl | E honored it; **F relaxed it (drove the siblings directly); G relaxes it for IMPL (the user drives value.js/parse-that/glass-ui too) but AUDITS each as its own surface + tags HAND-OFFs** |

---

## P7 + P8 (the F asks) — the 32-agent assay + the 6-agent parsing dive — all DISCHARGED

The two F-era asks resolved no-drop in `F/_SYNTHESIS-prompt-recap.md` (P7 the 32-agent
deep-SOTA assay, P8 the 6-agent parsing-SOTA dive). **G re-confirms the F WAVES LANDED**
(verified against the `tranche-f-impl` commits + `F/FINAL.md`):

| F deliverable | F-ask origin | Landed (commit / gate) | G status |
|---|---|---|---|
| The dict-mode buffer fold (MF-1/2, ~3.0× measured) | P7 F4 | F.W4 `3802a50`; `proof:interp-fastprops` | ADDRESSED |
| The sync-step `drive` half | P7 F4 | F.W5 `e072d3b`; `proof:sync-step` | ADDRESSED (the **Animation/group half HELD** → GS-3) |
| The computed-endpoint memo (−94%) | P7 F4 (C1) | landed in **value.js 0.11.0** (F.W6 disposition); `F/FINAL.md:39-44` | **G-SCOPE pin-lag** (consume on re-pin) |
| `proof:orchestration` + the 21-gate CI wiring | P7 F11 | F.W2/W3 `cd816c6`; `proof:ci-coverage` | ADDRESSED |
| The benches fixed + authored | P7 F5 (NEW-4/5/40) | F.W1; `bench/{interp-buffer,sync-step,compile,spring-tick}.bench.ts` present; `proof:bench-runs` | ADDRESSED |
| The serializer per-keyframe-easing round-trip | P7 F6 (NEW-12) | F.W7 `95a7e75`; `proof:roundtrip-easing` | ADDRESSED |
| The dropped adapter metadata captured | P7 F6 (NEW-13/14/16) | F.W8 `417cbb7`; `proof:adapter-capture` | ADDRESSED |
| `Sequence` transport completed | P8/F26-2 (NEW-34) | F.W9 `4d34f82` | ADDRESSED |
| MotionPath CSS-native | F26-1 (NEW-33-1a) | F.W12 `4cf7adb`; `proof:motion-path` | ADDRESSED |
| Boundary cohesion (presets-on-barrel, clamp ×4, group lerp) | NEW-20/21/22 | F.W11 `5e4f4c8`; `proof:cohesion` | ADDRESSED |
| Demo finishing (undo/redo, a11y, rail/ball, hero) | P7 F7 (NEW-25/26/27/28/31) | F.W14-16 `765fad6`/`7ae79f1`/`cd6dae6` | ADDRESSED |
| value.js charter v2 (Waves A–F + VJ-F1..F4) | P7 F10 / P8 F17 | landed on value.js `tranche-f-handoff` → **0.11.0 published** | **value.js-HANDOFF (consumed on re-pin)** |
| parse-that charter (PT-WAVE-1/2/3 + expose) | P8 F16 | landed on parse-that `tranche-f-handoff` → **0.9.0 published** | **parse-that-HANDOFF (consumed transitively on re-pin)** |
| The rewrite-vs-transpose verdict | P8 F19 | TRANSPOSE; WASM + chevrotain KILLED (`F/_SYNTHESIS-deferred-ledger §5 K-4/K-9`) | ADDRESSED (do NOT re-litigate) |

---

## P9 (THIS G ask) — the 16-agent post-F deep audit (the LATEST asks)

The G ask: **a 16-agent post-F deep audit of keyframes.js** (D+E+F implemented + released;
kf 4.0.0 / value.js 0.11.0 / parse-that 0.9.0 published; keyframes.babb.dev on Cloudflare
Pages). It is **TRANCHE DEVELOPMENT — research + audit ONLY** (propose, never write). The
explicitly-named latest surfaces, each routed to a G lane (this recap NAMES them; the
sibling G lanes carry the file:line findings):

| # | The G-ask surface | Origin | Status | G routing + evidence |
|---|---|---|---|---|
| **G1** | **The 16-agent deep audit itself** — find what is STILL not-SOTA after F; manufacture no work where exemplary | G ask | **G-SCOPE (the assay; this recap is one lane)** | the G `audit/` lane set; each lane carries an ALREADY-SOTA section per the §Mandate. **This recap is the prompt-recap lane** |
| **G2** | **Frontend encapsulation** (composables / state / component cohesion, post-F.W14-16) | G ask | **G-SCOPE → GS-6** | re-audit, NOT rebuild (`a-demo-post-e §7` left it ~90% SOTA; the F demo finishing landed) |
| **G3** | **Backend legacy excision** (no compat alias / deprecated path / fallback) | G ask | **G-SCOPE → GS-2** | live grep finds only DOC affirmations of no-legacy + two `back-compat` default-false flags (`numeric.ts:40`, `smooth.ts:24`) — the one genuine excision candidate; the rest are comments documenting deletions |
| **G4** | **CI / constellation perfection** | G ask | **G-SCOPE → GS-7** | `ci.yml` + `deploy-pages.yml` + `release.yml` present; the 21-gate `proof:all` cohort wired (F.W2). G audits the CF-Pages spine + the gate completeness post-F |
| **G5** | **glass-ui / value.js / parse-that leverage** (the three sibling repos) | G ask | **G-SCOPE → §pin-lag + GS-8 (each repo AUDITED + HAND-OFF-tagged)** | the §pin-lag re-pin (consume the published F hand-off); glass-ui dock D.W5 still PENDING; the inv-16 charters carried into the published siblings |
| **G6** | **Playwright demo audit** | G ask | **G-SCOPE → GS-9** | `bench/playwright.bench.ts` is the LoAF 2nd-consumer (the C.W1 drift fix); the demo-smoke Chromium job + occlusion gate stand. G re-runs every page desktop+mobile on the live CF-Pages build |
| **G7** | **animation-SOTA + modern-web** (the 2026 frontier) | G ask | **G-SCOPE → GS-1 (the carried F BOOKs)** | the F frontier BOOKs F deferred (NEW-36 splitText, NEW-37 intrinsic-size, NEW-38 VT-types, NEW-39 composite:add, NEW-10 `.finished`) — each verified still ABSENT in the live tree |
| **G8** | NOT an implementation phase (G dev-only authoring) | G ask | **HONORED** | every G artefact lands under `keyframes.js/docs/tranches/G/audit/`; ZERO source/test/CI/demo edits this turn — propose, never write |
| **G9** | Recap ALL prompts (this lane) | G ask | **ADDRESSED (this file)** | chains A→B→C→D→constellation→E→F→G; no drops |

---

## §G-SCOPE — the carried-forward F BOOKs + the net-new G surfaces (verified live)

These are the items with a named G home: the F-ledger BOOKs F explicitly deferred as
net-new scope (verified STILL un-landed in the live `tranche-g-dev` tree), plus the
net-new G-open findings. Each cites its F-ledger row (`F/_SYNTHESIS-deferred-ledger.md`)
or live `file:line`. **None is folded chronic debt** — the ledger was CLEAN at F-close
(P-invariant-28 held).

| # | Item | F-ledger / live evidence | Disposition |
|---|---|---|---|
| **GS-0** | **The dep PIN-LAG** (consume the published value.js 0.11.0 / parse-that 0.9.0) | `package.json ^0.10.0`/`^0.8.2` vs published `0.11.0`/`0.9.0` (§pin-lag) | **G-SCOPE (the headline G fold; inv-27).** Re-pin, re-build, re-run `proof:all`; the F.W6 endpoint memo materializes through `iv._lerp` with zero kf edit |
| **GS-1** | **The 2026 frontier BOOKs** — NEW-10 `.finished` getter · NEW-36 splitText (`Intl.Segmenter`) · NEW-37 intrinsic-size (`interpolate-size`/`calc-size()`) · NEW-38 VT types showcase · NEW-39 `composite:"add"` | `F/_SYNTHESIS-deferred-ledger §4.2/§4.6`; live: `get finished` ABSENT in `engine.ts`, no `split-text.ts`, no `calc-size`/`interpolate-size` in `src/animation/` | **G-SCOPE (BOOK → DECIDE per the "animation-SOTA" ask; MEASURE-FIRST / Baseline-gated each).** NEW-37 stays don't-adopt-until-Baseline for native delegation |
| **GS-2** | **Backend legacy excision** — the two `back-compat` default-false flags (`includeInactive`/snap opt-in) | `numeric.ts:40`, `smooth.ts:24` (live grep) | **G-SCOPE (audit; likely RECORD)** — these are *opt-in defaults*, not a deprecated path beside its replacement; the no-legacy mandate may already be satisfied. DECIDE: excise the flag (make the new behaviour the only behaviour) OR record it as a legitimate API default |
| **GS-3** | **The HELD sync-step Animation/group half** (F.W5 shipped only the `drive` half behind the event-ordering lock) | `F/FINAL.md:36-37`; `F/_SYNTHESIS-deferred-ledger MF-3` | **G-SCOPE (MEASURE-FIRST)** — re-measure with the `animationstart`/`iteration`/`end` event-ordering lock; land only on byte-unchanged event order. The §Mandate's no-ship-on-assertion |
| **GS-4** | **The library line-ceiling GATED DECISION** (NEW-3 / C-6) — `engine.ts` 1313L, `Animation` un-ceilinged; `proof:decomposition` sweeps ONLY the demo | `scripts/proof-decomposition.mjs` (demo-only sweep, verified); `wc -l src/animation/engine.ts` → 1313 | **G-SCOPE (MEASURE-FIRST → DECIDE, do NOT reflexively split)** — `a-engine-post-e F-ENG-5` found the class at its cohesive gestalt; the gap is the ABSENCE of a gated decision. Extend the ceiling to `src/animation/**` with a gated exception + rationale, OR record the cohesive-gestalt ruling as the gate. The §Mandate's NO-god-modules MEASURE-FIRST clause |
| **GS-5** | **The carried demo-motion-polish BOOK** (NEW-32) — directional/typed scene-VT, fluid display type, the `text-wrap: pretty` slivers beyond F.W13 | `F/_SYNTHESIS-deferred-ledger §4.5 NEW-32`; the directional VT now Baseline 2026-01-13 | **G-SCOPE (BOOK + glass-ui-HANDOFF H-1 for the `types` helper)** |
| **GS-6** | **Frontend encapsulation re-audit** (the G ask) | `a-demo-post-e §7` (post-E ~90% SOTA + F.W14-16 finishing landed) | **G-SCOPE (re-audit lane; likely thin)** — confirm no new oversized unit post-F.W14-16; the undo/redo `useRefHistory` + a11y SHIPs should not have re-grown a god-component |
| **GS-7** | **CI / constellation perfection re-audit** (the G ask) | `ci.yml`/`deploy-pages.yml`/`release.yml`; `proof:ci-coverage` (21 gates, 3 recorded exclusions, F.W2) | **G-SCOPE (re-audit lane)** — confirm the CF-Pages spine green-gated (inv-28), the gate cohort complete, no gate added post-F-publish left off-CI. NOTE the `proof:all` exclusions (3) for completeness |
| **GS-8** | **glass-ui leverage + D.W5 re-verify** (dock rename / `dock/index.ts` deletion / mask removal / square-mobile occlusion) | `F/_SYNTHESIS-deferred-ledger §6 DP-1` (verified pre-rename at F-open) | **PENDING (D-OWNED) → G re-verify only** — gated on glass-ui PUBLISHING 3.3.0. G AUDITS glass-ui as its own surface + tags glass-ui-HANDOFF; G does not close D.W5 |
| **GS-9** | **Playwright demo audit re-run** (the G ask) | `bench/playwright.bench.ts` (LoAF 2nd consumer); demo-smoke + occlusion gates | **G-SCOPE (re-run lane)** — every page desktop+mobile on the LIVE keyframes.babb.dev CF-Pages build (MotionPath + Sequence scenes); no occlusion regression; the LoAF gate holds with F.W4/W5 headroom (the drift-2 watch) |
| **GS-10** | **The value.js charter v2 RESIDUAL** (the Waves NOT folded into 0.11.0 — D2 SoA carrier, F2 `light-dark()`/system-color, F3 LRU eviction, VJ-F1 path-geometry sampler) | `F/_SYNTHESIS-deferred-ledger §3` + `F/valuejs-sota-handoff-v2.md` | **value.js-HANDOFF (carried; G re-grounds against the published 0.11.0 — strike what 0.11.0 closed, carry the rest)** |
| **GS-11** | **The parse-that charter RESIDUAL** (the risky `(id,offset)` packrat re-key honestly WITHHELD/booked at F; the span-first core unification BOOK) | `F/FINAL.md:96-98`; `F/_SYNTHESIS-deferred-ledger §4.7 PT-2/PT-4-b` | **parse-that-HANDOFF (carried; G audits parse-that 0.9.0 as its own surface)** |

---

## §Precepts — the recurring constraints, verified HONORED A→F (with the one net-new G watch)

Each is a STANDING precept the user has reasserted; verified threaded A→F (not asserted —
checked against the F assay + the live `tranche-g-dev` tree).

| Precept | Origin | Status A→F | G-open verification + watch |
|---|---|---|---|
| **NO legacy / deprecated codepaths** | B3, D9, F ask, **G ask (backend legacy excision)** | HONORED — D.W4 deleted the deprecated path-compat re-exports; the A-era `EasingResolvable` gone; F's `wrapBareKeyframes` decides on the AST (no regex crutch) | **WATCH (GS-2):** the two `back-compat` default-false flags (`numeric.ts:40`, `smooth.ts:24`) are the only live "back-compat" markers — G must DECIDE excise-vs-legitimate-default. The `4.0.0` major already absorbed the breaking deletions |
| **NO quick solutions / workarounds** | B3, D9, F ask, G ask | HONORED — the dock mask is a glass-ui-root fix; F's delete-loop fold is the V8-correct stable-key null-fill (NOT revert-to-fresh-`{}`) | G's pin-lag close is the genuine consume-leg (re-pin), not a vendored patch; the HELD sync-step half (GS-3) is the §Mandate refusing the assertion-ship |
| **idiomatic + gestalt** | B3, D9, F ask, G ask | HONORED — inv ζ, the engine transposition, the φ-ladder, F's `useRefHistory` undo, the promoted rail/ball pair | G re-audits frontend encapsulation (GS-6) for the idiomatic composable shape; no new god-component post-F.W14-16 |
| **architectural transpositions (elegance/simplicity/performance)** | D9, F ask, G ask | HONORED — D.W4 the engine gestalt; F.W4 the stable-key buffer (perf), F.W11 the boundary cohesion | NECESSARY/DESIRABLE remains the G posture; the pin-lag unlocks the F.W6 transposition (the value.js endpoint memo) kf already designed |
| **isomorphic (pixels unchanged unless HIGHLY befitting + named)** | D9, F ask, G ask | HONORED — D.W2/E.W3/F.W16 isomorphic; every F perf SHIP pixel-identical | the pin-lag re-pin is pixel-identical (faster, same output); every G demo fold must be iso or NAMED |
| **measure-first** | D3, E ask, F ask, G ask | HONORED — D-3's committed measurement; F's whole perf band gated on biting benches; the W8 SoA/incremental re-measured WITHHELD | G's GS-3 (sync-step half) + GS-4 (line-ceiling) + GS-1 (frontier perf) are all MEASURE-FIRST; the F benches (`bench/*.bench.ts`) are the substrate |
| **KISS** | D9, F ask, G ask | HONORED — net-deletion across waves; F deliberately few + deep, large ALREADY-SOTA refusal | G's band is narrow by design — the pin-lag + a re-audit set, NOT a rescue. Most of post-F is ALREADY-SOTA |
| **fail-explicit (backend legacy/fallback → EXCISE or fail EXPLICITLY)** | G ask (sharpened) | HONORED — `engine.ts:312,883`, `frame-compiler.ts:44`, `easing.ts:68` all document "no silent fallback" | the live grep confirms the fail-explicit posture is pervasive in DOC + code; GS-2 is the one place to DECIDE |
| **DRY (no duplicated effort)** | G ask (sharpened) | HONORED — F.W11 converged `clamp` ×4 → `leaves.clamp`; group's `lerp` retargeted to value.js | the pin-lag prevents a second eviction policy (the F3 LRU belongs ONCE in value.js) |
| **no-god-modules (>500L, MEASURE-FIRST not reflexive)** | G ask (sharpened) | HONORED — `a-engine-post-e F-ENG-5` ruled `Animation` at its cohesive gestalt; a split-for-line-count is the legacy-shape forbidden | **WATCH (GS-4):** `engine.ts` 1313L is un-ceilinged by `proof:decomposition` (demo-only); G must make the GATED DECISION, not the reflexive carve |
| **no-nested-imports** | G ask (sharpened) | HONORED — F.W11 fixed the inverted-tier `group.ts` borrow of `leaves.lerp` (NEW-22) | re-confirm no new nested/inverted-tier import in any G fold |
| **no-test-in-src** | G ask (sharpened) | HONORED — `src/animation/` holds zero `*.test.ts`; all tests in `test/`, benches in `bench/` | verified live: `src/animation/` is engine modules only (`ls src/animation/`) — no test files |
| **inv-16 (kf writes only keyframes.js)** | D, E ask, F ask | HONORED-A→E → RELAXED-for-F/G-impl | F drove the siblings directly (user-relaxed); **G relaxes inv-16 for IMPL but AUDITS each repo (value.js, parse-that, glass-ui) as its own surface + tags cross-repo items HAND-OFF** — exactly the G mandate |

**No precept is dropped.** Each recurring constraint is verified HONORED across A→F,
file:line- or lane-grounded. The G ask SHARPENED five into named precepts
(fail-explicit, DRY, no-god-modules, no-nested-imports, no-test-in-src) — each verified
satisfied at G-open, with two named WATCHES (GS-2 backend-legacy flags, GS-4
line-ceiling gated decision).

---

## §The two historical drifts — corrected in C, preserved A→F→G (NOT dropped)

### Drift 1 — B's falsely-closed LoAF
- **The drift:** B's FINAL marked the LoAF >50ms-trace subsystem closed with a stub 2nd consumer.
- **The correction (C.W1):** `bench/playwright.bench.ts` became the REAL 2nd consumer (200-cell AnimationGroup, fails on >50ms).
- **G's posture:** the gate stands (verified `bench/playwright.bench.ts` present). F.W4/W5 perf folds gave it headroom; **GS-9's Playwright re-run must keep the gate green, never regress it.** The drift stays tracked.

### Drift 2 — B's advisory inv δ
- **The drift:** B demanded "zero dock-over-content overlap" but shipped a console NOTE.
- **The correction (C.W1):** promoted to a HARD failing assertion; the one real occlusion (square/mobile) → a named self-cleaning allowance → terminated in D.W5.
- **G's posture:** the HARD gate stays HARD; **GS-9's Playwright re-run + any G demo fold must not reintroduce an occlusion.** The advisory→hard promotion remains the template for G's "falsifiable hard gate per wave" discipline.

---

## Verdict

No A→F request is DROPPED. Every prior-tranche request resolves **ADDRESSED** (cite
commit/file:line) or correctly **PENDING** (D.W5/W6 — D's close, gated on glass-ui 3.3.0,
**NOT E/F/G's scope**). Both F-era asks (the 32-agent assay + the 6-agent parsing dive)
resolved no-drop and **their waves LANDED + RELEASED** (kf 4.0.0 / value.js 0.11.0 /
parse-that 0.9.0; CF-Pages deploy). The recurring precepts — no-legacy, no-workaround,
idiomatic+gestalt, isomorphic, measure-first, KISS, fail-explicit, DRY, no-god-modules,
no-nested-imports, no-test-in-src, inv-16 — are each verified **HONORED A→F**, with two
named WATCHES carried into G (GS-2 the back-compat flags; GS-4 the line-ceiling gated
decision). The two historical drifts are corrected-and-preserved.

**The honest G-open shape:** the deferred ledger is CLEAN (zero KFE — P-invariant-28 held
through F). The ONE genuinely net-new closeable item is the **dep PIN-LAG** (§pin-lag /
GS-0): kf still pins value.js `^0.10.0` / parse-that `^0.8.2` while the published `0.11.0`
/ `0.9.0` carry the F hand-off wins kf drove — re-pinning materializes the F.W6 −94%
endpoint memo + the parse fast tier with ZERO kf edit. The rest of G's actionable band is:

- **GS-0** the pin-lag consume-leg (the headline; inv-27),
- **GS-1** the 2026 frontier BOOKs to DECIDE (splitText, intrinsic-size, `.finished`, VT-types, composite:add — MEASURE-FIRST / Baseline-gated),
- **GS-3** the HELD sync-step Animation/group half (MEASURE-FIRST, event-ordering-locked),
- **GS-4** the library line-ceiling GATED DECISION (decide, do not reflexively split),
- **GS-6/GS-7/GS-9** the re-audit lanes (frontend encapsulation, CI/constellation, Playwright — likely thin; D+E+F left them ~SOTA),
- **GS-2** the backend-legacy back-compat-flag DECISION (excise vs legitimate default),
- **GS-10/GS-11** the value.js + parse-that charter RESIDUALS (HAND-OFFs; re-ground against the published siblings),
- **GS-8** the glass-ui D.W5 re-verify (PENDING, D-owned),
- and **a large, explicit ALREADY-SOTA surface G refuses to touch.**

The only un-orphaned-by-design loose end remains the stacked publish leg (USER-DOMAIN;
version owner **Mike Babb** named for B+C+D+E+F, re-named for G at close if any wave lands;
the `4.0.0` stack already PUBLISHED, so G's tier — if it ships — stacks atop a clean base).

---

## inv ε / dev-only compliance

This lane wrote ONLY `docs/tranches/G/audit/a-prompt-recap.md`. ZERO source/test/CI/demo
edits. Every ADDRESSED row cites a commit or file:line or prior recap; every G-SCOPE row
cites its F-ledger row (`F/_SYNTHESIS-deferred-ledger.md`) or a live `file:line` /
`npm view` against the `tranche-g-dev` tree (HEAD `8fea80c`, `package.json` version
`4.0.0`, pins `@mkbabb/value.js ^0.10.0` / `@mkbabb/parse-that ^0.8.2`). The PENDING /
HAND-OFF statuses were re-verified live at G-open. This is the honest, complete,
deduplicated G prompt recap — no drop A→G.
