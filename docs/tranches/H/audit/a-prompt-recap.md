# H — the COMPLETE consolidated prompt recap (A → B → C → D → constellation → E → F → G → H)

**Lane id:** `a-prompt-recap` (Tranche H deep audit; branch `tranche-h-dev`).
**Job:** the whole-engagement ask→disposition table — EVERY user prompt A→H, each
**ADDRESSED** (where/commit) / **PENDING** / **H-SCOPE**; the recurring **PRECEPTS** verified
HONORED A→G (any drop flagged); the **LATEST H ask** with every item (D1–D14 + the
recap/precept/deferred mandate + the dock note) routed to its owning H lane. **TRANCHE
DEVELOPMENT — DOCS ONLY; ZERO source/test/CI/demo edits.** This lane wrote ONLY this file.

**Method (inv ε).** This recap CHAINS and SUPERSEDES the prior recaps; it does not re-derive
the A→G half (preserved verbatim-in-substance from `G/audit/_SYNTHESIS-prompt-recap.md`,
re-confirmed at H-open against the live tree: `git log` HEAD `d469e69`, `package.json` version
`4.1.0`, pins `@mkbabb/value.js ^0.11.1` / `@mkbabb/parse-that ^0.9.0` / `@mkbabb/glass-ui
^3.4.0` optional). The **net-NEW content** is: (1) the **A→G STATUS UPDATE** — every prior
G-SCOPE item is re-verified against `G/FINAL.md` (the G waves LANDED + RELEASED at `4.1.0`),
so the G column flips PENDING→ADDRESSED where G closed it; (2) the **§H ask table (§P10)** —
D1–D14 + the standing mandate, each routed to one of the **14 phase-1 H lanes** with its
disposition; (3) the **§Precepts H-column** re-verified HONORED with named H WATCHES; and
(4) the **§COVERAGE-GAP flag** — three observed defects (D5 dock-lag, D9 logo-popover, D12
scene-state machine) have NO dedicated owning lane and are distributed/orphaned across lanes
that explicitly disclaim ownership; the synthesizer must name an owner.

This supersedes:

- B: `B/FINAL.md` §Prompt recap (P1+P2)
- C: `C/audit/lanes/prompt-recap.md` (P1+P2+P3)
- D: `D/audit/prompt-recap.md` (P1→P5)
- E: `E/audit/prompt-recap.md` (A→constellation→E)
- F: `F/audit/_SYNTHESIS-prompt-recap.md` (the full A→F, P1→P8)
- G: `G/audit/_SYNTHESIS-prompt-recap.md` (the full A→G, P1→P9 + §GS)

Status legend:

- **ADDRESSED** — landed + verified in a prior tranche (commit/file:line); no later obligation
- **PENDING** — authored + gated; not yet closed
- **H-SCOPE** — folds into a named H lane (a D-defect or the standing mandate); cites the lane
- **HONORED** — a recurring precept threaded through (§Precepts)
- **value.js- / parse-that- / glass-ui- / deploy-HANDOFF** — a sibling repo owns it (inv-16,
  relaxed for impl since F — kf AUDITS each sibling but does not patch it inside kf)

---

## §0 — The honest H-open headline

**G LANDED and RELEASED.** kf `4.1.0` (the re-pin spine + `fromDrawSVG`/`get finished()`/
`adoptCompiled()`), `proof:all` GREEN (35 gates · 637 tests + 1 expected-fail), the demo
builds; value.js `0.11.1` published (the upstream `development`-export unblock the spine
consumed); glass-ui consumed PUBLISHED at `^3.4.0` from the registry (`e31d75a` retired the
`file:` sibling clone). **Every G-SCOPE item (GS-0…GS-16) closed or correctly handed off**
(`G/FINAL.md` commit ledger `d308699`→`bbc0212`). The G deferred ledger is CLEAN (zero KFE,
P-invariant-28 held A→G). **D.W5 — the ONE legitimately-blocked A→F carry — is CLOSED** in
G.W12 (`TopDock→ChromeDock`, the `dock/index.ts` barrel deleted, the `:always-expanded`
occlusion mask REMOVED mask-free-green).

**H is a different shape from F/G.** F/G were SOTA-refusal tranches ("~90% already-SOTA,
manufacture little"). **H is a USER-AUDITED-DEFECT tranche** — the user drove the LIVE demo
(`:5174`, kf 4.1.0 + all of Tranche G) and reported **14 concrete observed defects (D1–D14)**,
most of them DEMO-FRONTEND regressions or unfinished surfaces the prior tranches' line-count /
gate lenses could not catch. The honest H-open shape: the ENGINE/boundary/parse/color spine
is still ALREADY-SOTA (G left it untouched and exemplary); **the actionable band is the
DEMO** — the controls layout, the hover/depth treatment, the easing editor, the timeline, the
typing-dots, the hero typography, the scene icons + pertinence, mobile, interactivity, and
(CRITICAL) the scene+playback STATE MACHINE. The 14 H lanes are concentrated entirely on the
demo + glass-ui consumption + cross-repo dock hand-offs — no engine-kernel lane this turn.

**The ONE coverage caveat (flagged for the synthesizer):** of the 14 defects, **D5 (dock lag),
D9 (logo-popover restore), and D12 (scene-state machine — the user's CRITICAL ask)** have NO
dedicated owning lane. They are referenced across many lanes that each explicitly say "owned by
the D12/D5 lane — NOT this lane" — but that lane does not exist in the 14. **D12 in particular
is named a PREREQUISITE/blocker by at least five lanes** (interactivity, modes, pertinence,
timeline, easing). See §COVERAGE-GAP.

---

## §P1 (tranche A) — all ADDRESSED, chain-verified

| # | Request | Status | Evidence |
|---|---|---|---|
| A1 | Execute tranche A in full | ADDRESSED | A W0–W5 (`d84faf5`); `A/PROGRESS.md` |
| A2 | Publish 3.0.0 first | ADDRESSED | `v3.0.0` + SLSA; superseded by the `4.x` stack |
| A3 | Export `RAFPlayback` PRM gate | ADDRESSED | `index.ts`; B.W2 → shared `Tickable`/`playback.ts` |
| A4 | Changesets + `--provenance` | ADDRESSED | `release.yml`; `4.0.0`/`4.1.0` provenance-signed |
| A5 | Gate on green CI | ADDRESSED | `ci.yml`; B→G extended (the G 35-gate cohort) |
| A6 | `proof:boundary` (the value.js seam gated) | ADDRESSED | `scripts/proof-boundary.mjs`; SOTA, green A→G |
| A7 | `EasingResolvable` lazy-easing path | ADDRESSED-then-SUPERSEDED | the A-era class GONE, no alias (`easing.ts`) |

---

## §P2 (tranche B) — every discrete request, ADDRESSED

| # | Request | Status | Evidence / later re-open |
|---|---|---|---|
| B1 | Update all deps to latest | ADDRESSED | B.W1 (`6487c7f`); G.W2 re-pin consumed the published siblings (`d308699`) |
| B2 | 6-agent deep audit of plan + changes | ADDRESSED | `B/audit/plan-findings.txt` |
| B3 | Path forward · gestalt · no-workaround · no-legacy · transpositions | HONORED (precept) | §Precepts — the H ask re-asserts it as THE BINDING MANDATE |
| B4 | Fold chronically-deferred + deferred | ADDRESSED | D terminal home; F/G ZERO KFE; H inherits a CLEAN ledger |
| B5 | Recap ALL prompts | ADDRESSED (chains) | this file extends it |
| B6 | NOT an implementation phase | ADDRESSED | B.W0 dev-only |
| B7 | Full lighthouse + best-practices, every page | ADDRESSED | E.W4 `proof:lighthouse-mobile`; G `proof:demo-usability` (browser-gated). **H re-touches the live demo (D1–D14) — `a-glassmorphism-perf` re-measured CWV live** |
| B8 | Pull precepts + sync + before/after edict | ADDRESSED | precepts `8ccf9f4` on origin/main |
| B9 | Remove loading screen + improve loading | ADDRESSED | B.W4; E.W4 Monaco deferred + font preload |
| B10 | 6 frontend-design agents audit design + glass-ui | ADDRESSED (re-audited E/F/G) | **H is the deepest demo-design re-audit yet — 14 lanes, all D-defect/design driven** |
| B11 | Create next tranche with perfected CI | ADDRESSED (cadence) | G.W6 CI workflow-hygiene gate (`5954d1c`) |
| B12 | Audit every page desktop+mobile, NO occlusion, dock perfected, Playwright | ADDRESSED (HARDENED C; D.W5 CLOSED in G) | `occlusion-gate.mjs` HARD; G.W12 removed the mask. **H re-opens mobile (D10) + dock (D5) live** |

---

## §P3 (tranche C) — all ADDRESSED

| # | Request | Status | Evidence |
|---|---|---|---|
| C1 | Re-audit with 6 agents | ADDRESSED | `C/audit/plan-findings.txt` + `design-findings.txt` |
| C2 | Devise the path forward | ADDRESSED | `C.md`; PR #3, CI-green |
| C3 | Recap all prompts | ADDRESSED (chains) | this file extends it |
| C4 | NOT an implementation phase (then authorized) | ADDRESSED | C.W0 dev-only |
| C5 | Fold deferred (owner + trigger) | ADDRESSED | D terminated the kf-owned set; F/G ZERO KFE |
| C6 | 6-agent demo design inventory | ADDRESSED | `C/audit/design-findings.txt` |
| C7 | Make B's close honest (inv ε) | ADDRESSED | C.W1 + C FINAL; the two drifts tracked (§Drifts) |
| C8 | Make the design language whole (φ-ladder) | ADDRESSED — **H WATCH (D7)** | C.W2 (`179019f`); D.W2 leaf-tail. **H `a-hero-typography`/`a-design-language` find φ-ladder under-applied on the hero + bézier header — H-SCOPE, not a drop** |
| C9 | Make the shop-window run on its own engine (inv ζ) | ADDRESSED — **H WATCH (D6)** | C.W3 `proof:dogfood`; F.W10 orbital-inertia. **H `a-typing-dots` finds the dot-fade is hand-rolled CSS `@keyframes`, NOT dogfooded (inv ζ violation) — H-SCOPE** |
| C10 | Before/after capture (re-runnable) | ADDRESSED | `scripts/capture.mjs`; `C/audit/DELTA.md` |
| C11 | π at full | ADDRESSED | `C/audit/pi.md` |
| **C-cartoon** | **Migrate cartoon-shadow → `.cartoon-surface` (the C.W2 design-language close)** | **ADDRESSED-then-PARTIALLY-REGRESSED → H-SCOPE (D2)** | C.W2 (`179019f`) migrated `CSSCodeEditor`; but `a-cartoon-shadow §1` finds it survives on exactly ONE site and never became the demo-wide depth register it was meant to be. **D2 is the regression the user named — `a-cartoon-shadow`/`a-glow-artifact`/`a-design-language` own the restore** |

---

## §P4 (the constellation drive) — keyframes-relevant requests

| # | Request | Status | Evidence / H shift |
|---|---|---|---|
| D-C1 | The dock+animation convergence (kf's arm) | ADDRESSED | the VT-parity spring shipped in glass-ui (PR #1) |
| D-C2 | The dock convergence + naming plan (kf's obligations) | **ADDRESSED in G** | the D.W5 renames + `dock/index.ts` deletion LANDED G.W12 (`1b9b05f`); gate `occlusion-gate.mjs` green mask-free |
| D-C3 | Consume published-not-branches; gate on own green CI (inv-27) | **ADDRESSED in G** | G.W2 re-pin (`d308699`); `e31d75a` retired the last `file:` glass-ui clone — kf now consumes ALL THREE siblings PUBLISHED |
| D-C4 | Keep `springLinearStops()` stable | ADDRESSED (held A→G) | value.js-free, untouched. **H note: `a-modes-pertinence` finds Spring+Discrete TRIPLE-surface it — a DRY/scene MERGE candidate, not an export change (D8)** |

---

## §P5 (tranche D) — the four constraints + the dev-only boundary

| # | Request | Status | Evidence / H shift |
|---|---|---|---|
| D1 (tranche-D) | The demo refined (decompose, KISS) | ADDRESSED (D.W1+E.W1+F.W14-16+G.W5) | line ceilings gated. **H finds NEW unfinished demo surfaces (D1–D14) the line-lens missed — H-SCOPE** |
| D2 (tranche-D) | The design language localized + un-caged | ADDRESSED (D.W2+E.W3+F.W16+G.W10) | `design-idioms.css` owns the idioms. **H `a-design-language` re-confirms the token spine ALREADY-SOTA; the D-defect residual is application gaps (cartoon depth, φ on hero), not the system** |
| D3 (tranche-D) | Brittleness hardened | ADDRESSED (D.W3+E.W2+G.W9) | `proof:brittleness` 4 clauses + the G.W9 rAF-leak lifecycle fix. **H `a-mobile-architecture`/`a-mode-interactivity` find NO new brittleness; the D12 remount churn is a STATE-machine gap, not a selector bug** |
| D4 (tranche-D) | The engine transposed to its gestalt | ADDRESSED (D.W4+F.W4/5+G.W13/17/18/19) | the blend-leaf bug fixed (G.W17), orbital collapse (G.W18). **H has NO engine-kernel lane — the engine is left ALREADY-SOTA** |
| D5 (tranche-D) | The dock leveraged + mobile composition closed | **ADDRESSED in G (D.W5) — RE-OPENED by H (D5/D10/D13)** | D.W5 closed G.W12. **But the user reports the LIVE dock is laggy/broken (D5) + mobile is unfinished (D10/D13) — `a-glassmorphism-perf G4` root-causes the dock lag as a glass-ui JS width-FLIP; glass-ui-HANDOFF** |
| D6 (tranche-D) | Every kf-owned deferral terminated | ADDRESSED | F/G ZERO KFE; H inherits clean |
| D7 (tranche-D) | Recap ALL prompts | ADDRESSED (chains) | this file extends it |
| D8 (tranche-D) | NOT an implementation phase (D.W0) | ADDRESSED | D.W0 dev-only |
| D9 (tranche-D) | elegance/simplicity/perf · transpositions · NO legacy · KISS · isomorphic | HONORED (precept) | §Precepts — re-asserted as the H BINDING MANDATE |
| D10 (tranche-D) | The version owner named for the stacked changesets | ADDRESSED | **Mike Babb** for B+C+D+E+F (`4.0.0`) + G (`4.1.0`). **H's changeset, if waves land, stacks atop — owner re-named at H-close (USER-DOMAIN)** |

---

## §P6 (the E ask) — all ADDRESSED, F+G re-confirmed

| # | Request | Status | Later re-confirmation |
|---|---|---|---|
| E1 | Lighthouse every page; perf strategy | ADDRESSED | `proof:lighthouse-mobile`; G `proof:demo-usability`. **H `a-glassmorphism-perf` re-measured live CWV (121fps idle, blur free at dpr=1)** |
| E2 | Compare primitives vs modern-web-guidance | ADDRESSED | F.W12/13 + G.W14 (+3 catalog rows). **H modern-web facet folds into the D-defect lanes (specular, will-change, content-visibility)** |
| E3 | Frontend encapsulation / composables / state audit | ADDRESSED (E.W1+G.W7/8/9) | `useTemplateRef`, `createGlobalState` singleton. **H finds the STATE gap is RUNTIME (scene/playback lifecycle, D12), not encapsulation** |
| E4 | Non-idiomatic Tailwind / global-monolith / deprecated-CSS | ADDRESSED (E.W3+G.W10) | `a-design-language` re-confirms ~SOTA token spine + raw-rung sweep. **H residual: a few raw rungs (`AnimationMenuBar.vue:102 text-xl`) — H-SCOPE D7** |
| E5 | Deeply-nested / brittle selectors | ADDRESSED | inv-κ HOLDS; the vueuse listener gestalt |
| E6 | Engine housekeeping (post-D BOOK items) | ADDRESSED + re-measured | E + F.W4/5 + G.W13/17/18/19 |
| E7 | Recap ALL prompts | ADDRESSED | this file chains it |
| E8 | The clean deferred-ledger (zero KFE) | ADDRESSED | H inherits ZERO KFE |
| E9 | NOT an implementation phase (E.W0) | HONORED | then authorized |
| E10 | inv-16 (kf writes only keyframes.js) | HONORED-then-RELAXED-for-impl (F/G) | **H: relaxed for impl (the user drives glass-ui's AW tranche too); kf AUDITS the dock + tags glass-ui-HANDOFF, does NOT patch glass-ui inside kf** |

---

## §P7 + P8 (the F asks) + §P9 (the G ask) — all DISCHARGED, waves LANDED + RELEASED

**The F asks (P7 the 32-agent assay + P8 the 6-agent parsing dive) resolved no-drop and LANDED**
(`tranche-f-impl`, `4.0.0`). **The G ask (P9 the 16-agent post-F deep audit + the supplemental
8-lane assay) resolved no-drop and LANDED** (`tranche-g-impl`, `4.1.0`). The full G-SCOPE
roll-up (GS-0…GS-16) is re-verified ADDRESSED against `G/FINAL.md`:

| G-SCOPE item | G close (commit/gate) | H status |
|---|---|---|
| GS-0 the dep PIN-LAG (3 deps, one motion) | G.W1/W2 `d308699`; `proof:deps-current` + `proof:repin-witness` | ADDRESSED — kf now consumes value.js `0.11.1`/parse-that `0.9.0`/glass-ui `3.4.0` published |
| GS-1b DrawSVG · GS-1 `.finished` | G.W13 `3d352a3`; `proof:drawsvg`+`proof:finished` | ADDRESSED (additive public API → the `4.1.0` minor) |
| GS-2 `serializeEasing` fail-explicit throw | G.W4 `3d352a3`; `proof:roundtrip-easing` neg-control | ADDRESSED |
| GS-6 frontend encapsulation idiom convergence | G.W7/8/9 `1b9b05f` | ADDRESSED (`useTemplateRef`, store singleton, rAF-leak fix) |
| GS-7 CI workflow-hygiene gate | G.W6 `5954d1c`; `proof:ci-coverage` | ADDRESSED |
| GS-8 the D.W5 dock close (kf half) + D/FINAL.md | G.W12 `1b9b05f`; `occlusion-gate.mjs` mask-free | ADDRESSED (`D/FINAL.md` written, DP-2) |
| GS-9 Discrete route + hero spacing + dup a11y name | G.W10/11/12 `1b9b05f`; `proof:demo-usability` | ADDRESSED — **but H re-opens the same surfaces (D7 hero, D8 Discrete-as-scene) at the design layer** |
| GS-12 styling badge sweep | G.W10 `1b9b05f`; `proof:idioms` cl.8 | ADDRESSED — **H `a-mode-interactivity` finds the rail/drag dance is STILL hand-rolled ×3 (DRY) — a deeper grain than the badge sweep (D11)** |
| GS-13 the rAF-leak lifecycle fix | G.W9 `1b9b05f`; `proof:scene-raf-leak` | ADDRESSED |
| GS-3 sync-step half · GS-4 line-ceiling · GS-14 SoA | G.W5 (ceiling DECISION taken) · GS-3/14 MEASURE-FIRST | ADDRESSED (G.W5 decided, not re-deferred); GS-3/14 correctly held |
| GS-15 `animation-composition` honoring · GS-16 checklist | G.W14 (checklist +3) · GS-15 RECORD | GS-16 ADDRESSED; GS-15 RECORD (honest forward-seam) |
| GS-5/GS-10/GS-11 the HAND-OFFs | value.js `0.11.1` published; parse-that PT-4 carried; glass-ui H-1 carried | HAND-OFF (carried into the siblings' own tranches; value.js residual + parse-that re-key + glass-ui VT-types still owed) |

**The G adversarial-review convergence** (`bbc0212`: orbital reverse-path, demo-usability
bite, DrawSVG fail-explicit, gate hardening) is ADDRESSED. No G wave dropped a promised fold.

---

## §P10 (THIS H ask) — the 14 user-observed demo defects + the standing mandate

The H ask: a **DEEP AUDIT of keyframes.js (branch `tranche-h-dev`, the live demo at kf 4.1.0 +
all of Tranche G on `:5174`)** driven by **14 concrete user-observed defects (D1–D14)**. It is
**TRANCHE DEVELOPMENT — DOCS ONLY (audit + propose, never write source).** Each defect routes
to one of the **14 phase-1 H lanes** (this recap NAMES + dispositions; the lanes carry the
file:line findings + the falsifiable `proof:*` instrument):

| # | The observed defect (verbatim substance) | Owning H lane(s) | Disposition |
|---|---|---|---|
| **D1** | Controls sidebar is TWO columns — should be ONE (`AnimationControlsControls.vue:294` `subgrid`) | `a-controls-sidebar` (+ `a-design-language §4`) | **SHIP-in-H.** Root cause is a HALF-FINISHED migration: the `grid-cols-[auto_1fr]` two-track grid + `col-span-2` + subgrid chain is load-bearing machinery for a layout the glass-ui `<LabeledField>` (single self-contained `<div>`) no longer wants → DELETE the two-track grid, lay one self-contained field per row (single-column stack). Pure demo CSS/markup. Instrument `proof:controls-grid` (computed `grid-template-columns` = single track) |
| **D2** | CIRCULAR/RADIAL BLUR on hover EVERYWHERE — should be CARTOON SHADOWS; cartoon-shadow was CLOSED in C, likely regressed | `a-cartoon-shadow`, `a-glow-artifact`, `a-design-language §1`, `a-glassmorphism-perf G1` | **SHIP-in-H (demo) + glass-ui-HANDOFF.** Root-caused: the "radial blur" is glass-ui's `.glass-specular-track::before` pointer-anchored catch-light (`glass-specular-track.css:63-68`) bolted onto EVERY default `surface="glass"` Card; the demo never wires `--mouse-x/--mouse-y` → degrades to a centred radial blooming `0.35→0.6` on hover. Cartoon-shadow survives on ONE site (`CSSCodeEditor.vue:6`) — never became the demo-wide register. **One motion:** flip panel Cards to `surface="cartoon"` (drops the specular, applies `.cartoon-surface` offset-stamp + hover-lift) — pure glass-ui consumption, net-deletion. glass-ui-HANDOFF: calm the default specular (resting edge catch-light, opt-in radial). Instrument `proof:cartoon-depth` / `proof:specular-opt-in` |
| **D3** | Cubic-bézier / easing editor too MASSIVE; inner border touches the "cubic-bézier" header; header should be LARGER | `a-easing-editor` (+ `a-design-language §3`) | **SHIP-in-H (RC-1/RC-2/RC-3) + MEASURE-FIRST (RC-5 drag budget).** RC-1 canvas `aspect-ratio:1` off uncapped width → 680×680 square (`EasingCurveCanvas.vue:269-273`); RC-2 editor root uncapped/not a container (`EasingSidebar.vue:2`); RC-3 inner wash border touches header (nested bordered GlassPanel in bordered Card, `TimingFunctionPanel.vue:17-45`); header rung up to `text-title`. Instrument `proof:bezier-panel` (header ≥ `--type-title`, non-zero header↔canvas gap, capped canvas) |
| **D4** | Timeline scrubber / PlaybackRibbon is FULL-WIDTH — should match the controls sidebar width | `a-timeline-width` (+ `a-design-language`) | **SHIP-in-H (ribbon↔sidebar binding) + MEASURE-FIRST (grid-track tightening).** Bind the ribbon to the same width token as the controls sidebar (one-token, low-risk); the stage-grid tightening is MEASURE-FIRST behind `proof:stage-not-clipped` at 1280/1440. Instrument `proof:ribbon-width` (ribbon width == sidebar width) |
| **D5** | DOCK animations broken/slow/LAGGY; `@mbabb DockDropdownTrigger` popover no longer opens | **NO DEDICATED LANE** — root-caused in `a-glassmorphism-perf G4`; cross-ref'd by `a-design-language §8`, `a-cartoon-shadow CS-5`, `a-mobile-architecture`, `a-scene-icons` | **glass-ui-HANDOFF (lag) — see §COVERAGE-GAP.** `a-glassmorphism-perf G4` root-causes the lag as a glass-ui JS width-FLIP + `padding`/`background`/`box-shadow` transition over a blurred surface (NOT the blur — blur is free at dpr=1). The popover-not-opening (D9-adjacent) is the SAME dock breakage. glass-ui's AW tranche is working the dock NOW → AUDIT + SUGGEST + TAG glass-ui-HANDOFF; do NOT patch glass-ui inside kf. **GAP: no lane OWNS the synthesis of D5 — the synthesizer must assign the dock-handoff write-up** |
| **D6** | TYPING DOTS animation ("...", dot-fade) totally broken | `a-typing-dots` | **SHIP-in-H.** `dot-fade` animates but is perceptually broken: whole `...` is ONE word, ONE 2.6s pulse, 43% near-invisible; duration formula meant for the whole title mis-applied to the 3-char ellipsis; single-span (no per-dot split); `.lift-down` + `.dot-fade` cascade-collide on the `animation` shorthand (`AnimatedText.vue:93-107,62-68,72-76`). Hand-rolled CSS `@keyframes` — does NOT dogfood kf (inv ζ violation) though the engine ships `steppedEase`/`typingCursor`/`spinner`/`SpringProgress`. Instrument: visual + unit lock on per-dot sequential cadence |
| **D7** | HERO ("Select an animation") must be properly sized + LARGER, using GOLDEN (φ-ladder) typography; audit φ usage across the demo | `a-hero-typography`, `a-design-language §2` | **SHIP-in-H + MEASURE-FIRST + BOOK.** One-class swap (`text-display-4 → text-display-mega`) for the hero + a φ-spaced internal rhythm recompose; the φ-ladder MECHANISM is ALREADY-SOTA (`proof:phi`). MEASURE-FIRST the mega placement at 1440/390/768; BOOK the full hero-rhythm recompose to the D10 mobile lane. Raw-rung residual: `AnimationMenuBar.vue:102 text-xl` (SHIP-in-H — re-rung). Instrument `proof:phi` (each `--type-*` == φ-derived) + a DOM lint (CardTitle ≥ `text-heading`, no raw `text-[…]`) |
| **D8** | Scene-nav modes Spring/Sequence/Path/Discrete have NO icons (others do); audit their pertinence | `a-scene-icons`, `a-modes-pertinence`, `a-icon-pipeline` | **SHIP-in-H (icons) + KEEP-all-four (pertinence) + MERGE Spring+Discrete.** Pertinence: KEEP all four — each is the ONLY demo of a distinct PUBLIC engine primitive (`SpringProgress`/`Sequence`/`fromMotionPath`/`@starting-style`); but MERGE Spring+Discrete (they triple-surface `springLinearStops()` + the same 4 presets — DRY). Icons: replace the raster-screenshot-PNG idiom wholesale with ONE hand-authored vector line-art SVG family (`fill=none`, `currentColor`); the registry is mis-located in the dock (move to the descriptor); `<Home>` is an overloaded "no-icon" sentinel. Instrument `proof:scene-icons` (all `.svg`, `fill=none`, `currentColor`) |
| **D9** | @mbabb logo formerly CLICKABLE → popover (dark-mode + about); exists `App.vue:17-66` but no longer opens — RESTORE (likely tied to D5) | **NO DEDICATED LANE** — anchor confirmed live (`App.vue:17-66` `DockDropdownTrigger`+`DropdownMenu`+`DarkModeToggle` present); cross-ref'd by `a-mobile-architecture`, `a-scene-icons §dock`, `a-icon-pipeline` | **glass-ui-HANDOFF / kf-demo wiring — see §COVERAGE-GAP.** The `DockDropdownTrigger` markup is intact (verified live); the popover not opening is the SAME dock breakage as D5 (reka-ui `DropdownMenu` inside the glass-ui dock not toggling). AUDIT: is it the glass-ui dock event seam (HANDOFF) or a kf-demo wiring regression (SHIP-in-H)? **GAP: no lane resolves this binary — the synthesizer must assign D9** |
| **D10** | MOBILE must be perfected — SINGLE PAGE, affixed top+bottom docks, page contextually changing by mode, background = the current animation area | `a-mobile-architecture` | **SHIP-in-H (F1/F2) + MEASURE-FIRST→SHIP (F3) + BOOK (F4).** F1: OVERLAY controls on a full-bleed animation background (the transposition — the cube/stage becomes the mobile backdrop); F2: the drawer dogfoods `SpringProgress` (D13); F3: affixed top+bottom docks with a single page that contextually re-flows (MEASURE-FIRST the z-order vs F1); F4: the full-bleed stage makes mobile scenes interactive for free (BOOK → feeds D11). Mobile dock occlusion = glass-ui-HANDOFF |
| **D11** | Surviving new modes should become MORE INTERACTIVE (clickable/draggable, like the cube orbital drag) | `a-mode-interactivity` (+ `a-modes-pertinence`) | **SHIP-in-H (H-MI-2/3/4) + MEASURE-FIRST→BOOK (H-MI-6 DRY) + RECORD-blocking (H-MI-7).** easing: grab the bézier curve (H-MI-2); motion-path: grab + scrub the traveller ON the path (H-MI-3); sequence: make children grabbable, not just the master playhead (H-MI-4); square is a non-interactive dead-end → KILL-or-rebuild (H-MI-1). DRY: three scenes hand-roll the same rail/drag dance → MEASURE-FIRST then BOOK a shared composable (H-MI-6). **H-MI-7 BLOCKING NOTE: D11 is DOWNSTREAM of D12 — interactivity is moot until scenes hold their route; gate D11 visual locks behind the D12 state-machine fix** |
| **D12** | SCENE-STATE CORRUPTION + the state machine (**CRITICAL**) — switching easing→cube→back leaves controls/options INVALID; play/pause not restored/suspended across scene switches; want a ROBUST scene+playback state machine + store (vueuse/Pinia/createGlobalState — evaluate + recommend) | **NO DEDICATED LANE** — named a PREREQUISITE/blocker by `a-mode-interactivity H-MI-7`, `a-modes-pertinence`, `a-timeline-width`, `a-easing-editor §E`, `a-glassmorphism-perf` | **H-SCOPE (CRITICAL) — UNOWNED, see §COVERAGE-GAP.** Every layout/interactivity lane observes the same live symptom (route redirects, transient 0×0 remounts, viewport reverts to 390 on nav) and explicitly disclaims it as "owned by the D12 lane — NOT this lane." **That lane does NOT exist in the 14.** This is the user's CRITICAL ask AND a cross-lane prerequisite. **The synthesizer MUST commission a dedicated scene+playback state-machine lane** (evaluate vueuse vs Pinia vs `createGlobalState`; design per-scene state delineation + play/pause SUSPEND/RESTORE on switch; an irrefragable router↔store↔playback machine). Instrument: a `proof:scene-state` round-trip (easing→cube→easing restores exact controls + playback) |
| **D13** | MOBILE DRAWER collapse/expand NOT springy + too SLOW — should be springy (dogfood `SpringProgress`) + fast | `a-mobile-architecture F2`, `a-design-language §8` | **SHIP-in-H.** Dogfood `SpringProgress` for the drawer (inv ζ) instead of the CSS `linear()` token; the `--spring-snappy` alias was over-calmed to `--spring-smooth` (`style.css:147`) — for a fast springy drawer use the SNAPPIER curve. Instrument: a drawer-spring visual/timing lock |
| **D14** | The "SPECULAR RADIAL" hover needs TOTAL REFINEMENT (clarifies D2: the glass is GOOD; refine the specular-radial, reconcile with cartoon-shadow depth — a refined specular hover, not a broken radial blur) | `a-glow-artifact`, `a-cartoon-shadow`, `a-design-language §1`, `a-glassmorphism-perf` | **SHIP-in-H (demo opt-in) + glass-ui-HANDOFF (calmer default).** The reconcile: cartoon-shadow is the PANEL depth/hover register (D2); the specular-radial stays OPT-IN only on surfaces that genuinely want the iOS catch-light, AND must be WIRED with a pointer listener (`--mouse-x/--mouse-y`) at a lower core α (~0.25) + tighter radius (~35%). glass-ui-HANDOFF: the default resting specular should be a thin top-edge catch-light, not a centred radial smear |
| **H-mandate** | The BINDING MANDATE — no quick solutions / idiomatic gestalt / architectural transpositions / no legacy / no god-modules / KISS · DRY · no-nested-imports · no-test-in-src · isomorphic · MEASURE-FIRST · inv ε | §Precepts | **HONORED** — every H lane carries a `file:line`/live anchor, a gestalt fix, and a falsifiable instrument idea; ALREADY-SOTA called honestly (engine/boundary/parse untouched) |
| **H-recap** | Recap ALL prompts A→H (this lane) | this file | **ADDRESSED** — chains A→B→C→D→constellation→E→F→G→H; no drop |
| **H-devonly** | DOCS ONLY — write exactly one findings file, edit NO source/test/CI/demo | this file | **HONORED** — this lane wrote ONLY `docs/tranches/H/audit/a-prompt-recap.md` |
| **H-dock-note** | The dock is being actively worked on by glass-ui NOW (its AW tranche); AUDIT + SUGGEST + TAG glass-ui-HANDOFF; do NOT propose patching glass-ui inside kf | `a-glassmorphism-perf G4`, `a-design-language §8`, `a-cartoon-shadow CS-5` | **HONORED** — every dock finding is tagged glass-ui-HANDOFF (D5 lag, D9 popover, dock specular CS-5, mobile occlusion); none proposes a kf-side glass-ui patch |

**No D-defect is dropped.** D1–D4, D6, D7, D8, D10, D11, D13, D14 each have an owning lane with
a SHIP/MEASURE-FIRST/HANDOFF disposition + instrument. **D5, D9, D12 are the three UNOWNED
defects** (§COVERAGE-GAP) — distributed across lanes that disclaim them; the synthesizer must
assign each an owner, and D12 (the user's CRITICAL ask + a cross-lane prerequisite) needs a
dedicated lane.

---

## §COVERAGE-GAP — the three observed defects with NO dedicated owning lane (FLAGGED)

This is the single most important net-new finding of this recap lane. Of the 14 D-defects,
**three have no lane that OWNS their synthesis**, despite being referenced repeatedly:

1. **D12 — scene-state machine (CRITICAL, the user's emphasized ask).** Named a
   PREREQUISITE/blocker by ≥5 lanes (`a-mode-interactivity H-MI-7`: "D11 is DOWNSTREAM of D12";
   `a-modes-pertinence`: "the modes cannot be fairly finished until D12 lands";
   `a-timeline-width §131`, `a-easing-editor §E`, `a-glassmorphism-perf §202` all flag the live
   remount/redirect churn). EVERY lane disclaims it ("owned by the D12 lane — NOT this lane").
   **No `a-scene-state` / `a-state-machine` lane exists in the 14.** This is the highest-risk
   gap: a cross-cutting CRITICAL ask AND the gating dependency for D1/D4/D11. **REQUIRED:** a
   dedicated lane that evaluates vueuse/Pinia/`createGlobalState`, designs the per-scene state
   delineation + play/pause SUSPEND/RESTORE machine, and roots it in the live router↔store↔
   playback seam (`demo/app/router.ts`, `demo/app/scenes.ts`).

2. **D5 — dock lag.** Root-CAUSED (`a-glassmorphism-perf G4` — glass-ui JS width-FLIP, not the
   blur) but no lane OWNS the glass-ui-HANDOFF write-up that the AW tranche would consume.
   Distributed across `a-glassmorphism-perf`, `a-design-language §8`, `a-cartoon-shadow CS-5`.

3. **D9 — @mbabb logo popover restore.** Anchor confirmed live (`App.vue:17-66` markup intact)
   but no lane RESOLVES the binary "glass-ui dock event seam (HANDOFF) vs kf-demo wiring
   regression (SHIP-in-H)." Cross-ref'd by `a-mobile-architecture`, `a-icon-pipeline`,
   `a-scene-icons` only as a passing dock note.

**Disposition for all three: H-SCOPE (commission/assign at synthesis).** D5+D9 likely collapse
into ONE glass-ui-dock-handoff write-up (they are the same dock breakage); D12 needs its own
dedicated lane. None is a DROP — they are observed defects with an OWNERSHIP gap the synthesizer
must close, not findings that were resolved.

---

## §Precepts — the recurring constraints, verified HONORED A→G (with named H WATCHES)

The H ask re-asserts the full BINDING MANDATE (carried A→G, binding on every H finding). Each
precept verified threaded A→G against `G/FINAL.md` + the live tree; the H WATCH names where an
H D-defect tests it.

| Precept | Origin | Status A→G | H WATCH |
|---|---|---|---|
| **NO legacy / deprecated codepaths** | B3, D9, F/G/H ask | HONORED — `EasingResolvable` gone; gh-pages excised; `serializeEasing` silent-degrade closed (G.W4); the `file:` glass-ui clone retired (`e31d75a`) | **D1 (the controls grid)** is the textbook no-legacy fix: a half-finished migration's scaffolding (`auto_1fr`+subgrid) replaced in ONE motion, not patched. **D2 cartoon** = drop the specular, don't override it |
| **NO quick solutions / workarounds** | B3, D9, F/G/H ask | HONORED — G.W12 REMOVED the `:always-expanded` occlusion mask (not tuned) | **D2/D14:** flip `surface="cartoon"` (consume the recipe), NOT a CSS override of the specular `::before`. **D6:** dogfood the engine preset, not a CSS band-aid |
| **idiomatic + gestalt** | B3, D9, F/G/H ask | HONORED — `useTemplateRef`, `createGlobalState`, the φ-ladder, the rail/ball idiom | **D11 DRY:** three scenes hand-roll the same rail/drag — converge to one composable. **D8 icons:** one vector family, not two unreconciled idioms |
| **architectural transpositions (elegance/simplicity/perf)** | D9, F/G/H ask | HONORED — the engine gestalt, the buffer fold, the boundary cohesion, G.W18 orbital | **D10:** the mobile full-bleed-background transposition (the stage IS the backdrop). **D12:** a formal state machine is the transposition the user explicitly asks for |
| **isomorphic (pixels unchanged unless befitting + named)** | D9, F/G/H ask | HONORED — every perf SHIP pixel-identical; demo corrections fix WRONG pixels → right | **D1/D3/D4/D7** are all NAMED befitting deltas (the user reported these pixels as WRONG); D2/D6/D13 likewise — each is a corrected-defect, not a gratuitous restyle |
| **measure-first** | D3, E/F/G/H ask | HONORED — G.W5 ceiling DECISION measured; the SoA/sync-step held | **`a-glassmorphism-perf` is the model MEASURE-FIRST lane** (live rAF histograms; refuses to claim the blur is the lag). D3 drag-budget, D4 grid-tighten, D7 mega-placement, D11 DRY all MEASURE-FIRST |
| **KISS** | D9, F/G/H ask | HONORED — net-deletion across waves | **D1 (delete the grid), D2 (one prop flip), D6 (one preset), D7 (one-class swap)** are all net-deletion / single-decision fixes |
| **fail-explicit** | G ask (sharpened) | HONORED — G.W4 `serializeEasing` throws; the backend is a reference fail-explicit surface | the engine surface is untouched in H; no regression |
| **DRY** | G ask (sharpened) | HONORED — F.W11 `clamp` ×4→1; G.W6 composite action; G.W10 badge sweep | **D8 (Spring+Discrete triple-surface `springLinearStops`), D11 (rail/drag ×3)** are the two H DRY violations the finer grain surfaced |
| **no-god-modules (>500L, MEASURE-FIRST)** | G ask (sharpened) | HONORED — G.W5 the line-ceiling GATED DECISION (`proof:decomposition` over `src/animation/**`) | H demo edits must stay under the demo ceiling (`proof:decomposition` demo half); the easing-editor/state-machine work should DECOMPOSE cohesively (e.g. `a-orbital`'s `quaternionEuler.ts` precedent) |
| **no-nested-imports** | G ask (sharpened) | HONORED — `dock/index.ts` pass-through barrel DELETED (G.W12) | no H WATCH (the offending barrel is gone) |
| **no-test-in-src** | G ask (sharpened) | HONORED — `src/animation/` is engine-only | no H WATCH (H is demo-only) |
| **inv-16 (kf writes only keyframes.js)** | D/E/F ask | HONORED-A→E → RELAXED-for-impl (F/G/H) | **H: kf AUDITS glass-ui (the dock, D5/D9/D14, mobile occlusion) + tags glass-ui-HANDOFF; does NOT patch glass-ui inside kf** (the H-dock-note, HONORED). value.js/parse-that residual carried as HAND-OFF |
| **inv ζ (dogfood kf's own engine)** | C9, F/G | HONORED — `proof:dogfood`; orbital-inertia on `decay()` | **D6 (dot-fade hand-rolled CSS) + D13 (drawer on CSS `linear()` not `SpringProgress`)** are the two inv-ζ violations H surfaced — both SHIP-in-H to dogfood the engine |

**No precept is dropped.** Each verified HONORED A→G, file:line/lane/commit-grounded. The H
WATCHES are NAMED D-defects with falsifiable instruments — finishing folds on a disciplined
surface, not drops.

---

## §The two historical drifts — corrected in C, preserved A→G→H (NOT dropped)

### Drift 1 — B's falsely-closed LoAF
- **Correction (C.W1):** `bench/playwright.bench.ts` became the REAL 2nd consumer (200-cell
  AnimationGroup, fails on >50ms). **H posture:** the gate stands; G gave it headroom. H's
  demo SHIPs (D2 cartoon, D14 specular, D5 dock) must keep it green — `a-glassmorphism-perf`
  re-measured live (121fps idle, blur free at dpr=1) and is the H bite control.

### Drift 2 — B's advisory inv δ → C's HARD occlusion gate → D.W5 → CLOSED in G
- **Correction (C.W1 → D.W5 → G.W12):** the occlusion gate went advisory→HARD; the
  `:always-expanded` mask was the named allowance; G.W12 REMOVED the mask (green mask-free).
  **H posture:** the HARD gate stays HARD. **D10 (mobile re-architecture) + D5 (dock) must NOT
  reintroduce an occlusion**; the mobile dock occlusion residual is a glass-ui-HANDOFF (fixed
  in the dock root, never re-masked).

---

## Verdict

No A→H request is DROPPED. Every prior-tranche request resolves **ADDRESSED** (cite
commit/file:line) — including the two A→F PENDING carries (D.W5 dock close + the dep pin-lag),
both **CLOSED in G** (`4.1.0`, `G/FINAL.md`). The full G-SCOPE roll-up (GS-0…GS-16) is
re-verified ADDRESSED-or-correctly-handed-off. The recurring precepts — no-legacy,
no-workaround, idiomatic+gestalt, transpositions, isomorphic, measure-first, KISS,
fail-explicit, DRY, no-god-modules, no-nested-imports, no-test-in-src, inv-16, inv ζ — are each
verified **HONORED A→G**, with named H WATCHES carried as falsifiable D-defect folds. The two
historical drifts are corrected-and-preserved.

**The honest H-open shape:** the deferred ledger is CLEAN (zero KFE — P-invariant-28 held A→G).
The engine/boundary/parse/color spine is ALREADY-SOTA and has NO H lane (left untouched). **H
is a USER-AUDITED-DEFECT tranche** — 14 concrete live-demo defects (D1–D14), almost entirely
DEMO-FRONTEND + glass-ui-consumption + cross-repo-dock surfaces the line-count/gate lenses of
F/G could not catch. The 14 phase-1 H lanes cover D1–D4, D6, D7, D8, D10, D11, D13, D14 with
SHIP/MEASURE-FIRST/HANDOFF dispositions + instruments. **The one net-new finding of this recap:
three defects are UNOWNED — D5 (dock lag, root-caused but no HANDOFF owner), D9 (logo popover,
binary unresolved), and D12 (the CRITICAL scene-state machine, named a prerequisite by ≥5 lanes
but with NO dedicated lane).** The synthesizer must commission a dedicated D12 state-machine
lane and assign the D5+D9 dock-handoff write-up. The standing mandate is re-asserted and
HONORED; the dock-note (glass-ui AW tranche owns the dock — AUDIT + TAG, never patch in kf) is
HONORED across every dock finding.

The only un-orphaned-by-design loose end remains the stacked publish leg (USER-DOMAIN; version
owner **Mike Babb** named for B+C+D+E+F (`4.0.0`) + G (`4.1.0`), re-named for H at close — the
H demo SHIPs, if they land, stack atop the clean `4.1.0` base).

---

## inv ε / dev-only compliance

This lane wrote ONLY `docs/tranches/H/audit/a-prompt-recap.md`. ZERO source/test/CI/demo edits.
Every ADDRESSED row cites a commit / file:line / prior recap; every H-SCOPE row cites its
phase-1 H lane(s) (the 14: `a-cartoon-shadow`, `a-controls-sidebar`, `a-design-language`,
`a-easing-editor`, `a-glassmorphism-perf`, `a-glow-artifact`, `a-hero-typography`,
`a-icon-pipeline`, `a-mobile-architecture`, `a-mode-interactivity`, `a-modes-pertinence`,
`a-scene-icons`, `a-timeline-width`, `a-typing-dots`) and a live anchor against the
`tranche-h-dev` tree (HEAD `d469e69`, version `4.1.0`, pins `@mkbabb/value.js ^0.11.1` /
`@mkbabb/parse-that ^0.9.0` / `@mkbabb/glass-ui ^3.4.0`). The A→G half chains and supersedes
`G/audit/_SYNTHESIS-prompt-recap.md`, re-confirmed live at H-open. This is the honest, complete,
SYNTHESIZED A→H prompt recap — no drop, with the three UNOWNED defects (D5/D9/D12) explicitly
flagged for the synthesizer.
