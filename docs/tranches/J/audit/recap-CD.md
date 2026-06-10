# Tranche J Audit — Lineage Recap: Tranches C + D

**Lane:** recap-CD
**Date:** 2026-06-09
**Branch audited:** `tranche-i-dev` (current HEAD = master post-I-close, pre-J)
**Sources read:** `docs/tranches/C/{C.md,FINAL.md,PROGRESS.md,waves/W0..W5.md,audit/lanes/*.md}` + `docs/tranches/D/{D.md,FINAL.md,PROGRESS.md,waves/D.W0..D.W6.md,audit/*.md}` + live tree inspection.

---

## Executive Summary

**Tranche C (the close made honest) is verified sound.** C.W1–C.W5 landed on `tranche-c-impl` (PR #3, CI-green). All seven B overclaims were genuinely reconciled: the real `<main>` landmark, the HARD occlusion gate with both axes + inject bite, π at full with the ≥5-frame probe, the capture harness checked in at `scripts/capture.mjs`, the LoAF observer's real 2nd consumer (`bench/playwright.bench.ts`), inv β dispositioned honestly, and A11y=100+SEO CI gate wired. The φ-ladder display tier unforked (C.W2). The seven hand-rolled rAF loops transposed onto `SmoothProgress`/`SpringProgress`/`NumericAnimation`/`RAFPlayback` (C.W3, inv ζ). Engine residuals (`_run` core, one `tickDt`, `setColorSpace`/`setHueMethod` fail-explicit, default css-twin VERIFIED-then-WITHHELD) transposed (C.W4). C introduced **inv ε** (close cannot overclaim) and **inv ζ** (shop-window runs on its own engine) — both are foundational charter invariants J inherits. Every C FINAL claim verified against the tree.

**Tranche D (the terminal home) is mostly correct but carries one documented inv-ε violation.** D.W4 (engine transposition: `advanceTo` canon, `FrameCompiler` split, zero-alloc group path, `pause/resume/toggle`, deprecated re-exports deleted) is fully verified in the tree. D.W1–W3 (demo decomposition, design language localization, brittleness hardening) are verified: `design-idioms.css` exists, `utils.css` deleted, `proof:idioms` and `proof:decomposition` in place. D.W6 (the FINAL doc) was written retrospectively from the G vantage per D FINAL's own admission — a legitimate close. The **P1 finding**: D.W5's hard gate #2 specified `grep TopDock|AnimationMenuBar = 0` as the dock-rename gate; `AnimationMenuBar.vue` was NEVER renamed to `TransportDock.vue` (only `TopDock→ChromeDock` landed in G; `AnimationMenuBar` has 8+ active references in the demo today), yet D FINAL's ledger records the proof as "`grep TopDock|AnimationMenuBar = 0 (ChromeDock); dock/index.ts gone`" — which is factually false for the AnimationMenuBar half. This is inv ε applied to D's own close: the ledger asserts a gate that did not pass.

D's P-invariant-28 "no perpetual punts" claim is **partially met**: the φ-ladder leaf-tail chronic terminated (D.W2, verified via `proof:phi-leaf-zero.mjs` existing), the engine residuals closed (D.W4), the square-scene mobile occlusion became a glass-ui HANDOFF (honest, not a punt). The `AnimationMenuBar→TransportDock` rename is the one item where D FINAL says "closed" against a gate that did not pass.

---

## Tranche C — What Was Chartered and What Actually Landed

### C Charter

C had three duties: (1) make B's close honest — seven asserted-not-met gates made TRUE; (2) make the design language whole — φ-ladder display tier unforked; (3) make the shop-window run on its own engine — seven hand-rolled rAF loops transposed. C also introduced inv ε (close cannot overclaim) and inv ζ (dogfood invariant) as charter-level invariants, and checked in the before/after capture harness (`scripts/capture.mjs`) that B left in `/tmp`.

### C What Landed (tree-verified)

| Claim | Wave | Tree Status |
|---|---|---|
| Real `<main>` landmark (not `display:contents`) | C.W1 | **VERIFIED** — `demo/@/components/custom/editor-shell/EditorShell.vue` has a real `<main>` with layout box |
| Occlusion gate HARD + both axes + inject bite | C.W1 | **VERIFIED** — `scripts/occlusion-gate.mjs` present with HARD assertion + `KF_OCCLUSION_INJECT` |
| π at FULL — ≥5-frame RM probe, contrast table | C.W1/W5 | **VERIFIED** — `docs/tranches/C/audit/pi.md` exists; `scripts/capture.mjs` has `--reduced-motion` clause |
| Capture harness checked in + re-runnable | C.W0 | **VERIFIED** — `scripts/capture.mjs` present; `scripts/lib/demo-driver.mjs` single-sourced |
| LoAF observer 2nd consumer (bench/playwright.bench.ts) | C.W1 | **VERIFIED** — `bench/playwright.bench.ts` is not a stub; reads `window.__kfLoaf`, asserts >50ms threshold |
| inv β dispositioned honestly — dangling symlink documented | C.W1 | **VERIFIED** — disposition (b) in FINAL §B-overclaim reconciliation |
| A11y=100 + SEO CI gate wired | C.W1/W2 | **VERIFIED** — `scripts/lighthouse-gate.mjs` present |
| φ-ladder display tier unforked — `instrument-serif` sweep = 0 | C.W2 | **VERIFIED** — `grep instrument-serif demo/` = 0 against current tree |
| `design-idioms.css` (D closes this — but C created `--font-display`) | C.W2 | **VERIFIED** — `demo/@/styles/design-idioms.css` exists (D.W2 extended it) |
| 7 hand-rolled rAF → light engines (proof:dogfood) | C.W3 | **VERIFIED** — `scripts/proof-dogfood.mjs` with 3-item ALLOWLIST; AmigaScene + matrix useTransformState + CopyButton (one-shot) justified |
| Dead `.scene-*` CSS removed from App.vue | C.W3 | **VERIFIED** — `grep scene-enter demo/app/App.vue` = 0 |
| `_run` core (drive+loop+play fold), one `tickDt`, `setColorSpace`/`setHueMethod` fail-explicit | C.W4 | **VERIFIED** — `src/animation/playback.ts` has `_gen`-guarded `_run`; `engine.ts:531-551` `setColorSpace`/`setHueMethod` throw on invalid input |
| Default css-twin VERIFIED-then-WITHHELD | C.W4 | **VERIFIED** — `test/default-easing-css-twin.test.ts` exists; `defaultOptions.timingFunction.css` is undefined |
| `rolldown` declared in package.json | C.W4 | **VERIFIED** — `package.json:204` `"rolldown": "^1.0.0"` |
| AFTER capture (18 shots, 0 console errors) + DELTA.md + pi.md | C.W5 | **VERIFIED** — `docs/tranches/C/audit/screenshots/after/` (19 files incl. JSON report); `audit/DELTA.md`; `audit/pi.md` |

### C Precepts Introduced

| Invariant | First stated | Definition |
|---|---|---|
| **inv ε** | `docs/tranches/C/C.md:181` | "The close cannot overclaim. Every gate FINAL.md asserts MET is re-verified to actually pass by a checked-in, re-runnable instrument before the wave is marked done; a gate that is deferred is marked deferred, not met." |
| **inv ζ** | `docs/tranches/C/C.md:185` | "The shop-window runs on its own engine. The demo carries no hand-rolled rAF loop that a shipped light engine already is; reduced-motion is honored in the demo." |
| **P-invariant-28** | First appears as a phrase in `docs/tranches/C/audit/plan-findings.txt:174` ("the textbook P-invariant-28 TEMPORARY item"); formalized in `docs/tranches/D/D.md:445` ("no perpetual punts — D is the terminal home or the KILL"). |
| **dev/impl boundary** | `docs/tranches/C/C.md:22-23` — "No engine or demo source is written in development." Established as a standing discipline; D.W0 maintained it. |

### C Open Deferrals at Close (per C FINAL §Deferrals)

| Item | C Disposition | Status TODAY |
|---|---|---|
| φ-ladder leaf-tail F6 (89 body-tier sites) | BOOKED to C's "mechanical follow-on" → D.W2 | **CLOSED** — D.W2 terminated it; `proof:phi-leaf-zero.mjs` in tree |
| bucket-glassui (ASK-3 `LabeledField` a11y) | OUTWARD, glass-ui-owned | **STILL OPEN** (glass-ui-HANDOFF, named lighthouse allowance; correct) |
| square-scene mobile occlusion | Named allowance in `occlusion-gate.mjs` | **CLOSED** — D.W5 + G.W12 glass-ui HANDOFF; `occlusion-gate.mjs` mask-free |

---

## Tranche D — What Was Chartered and What Actually Landed

### D Charter

D had four duties: (1) refine the demo (decompose 5 oversized units, KISS, design language localized + uncaged, brittleness hardened); (2) transpose the engine to its gestalt (AnimationGroup zero-alloc, `tick→advanceTo` canon, `Animation` god-object split at `FrameCompiler` seam, `pause/resume/toggle` honest API, deprecated re-exports deleted); (3) leverage the glass-ui 3.3.0 dock (dock-rename + mask removal + square-scene mobile occlusion); (4) terminate every keyframes-owned deferral (P-invariant-28). D.W5 was the one legitimately-blocked carry (gated on glass-ui 3.3.0 publish), recorded as the carry and closed via G.W12. D FINAL was written retrospectively from the G vantage (per D FINAL §note).

### D What Landed (tree-verified)

| Claim | Wave | Tree Status |
|---|---|---|
| `frame-compiler.ts` created (FrameCompiler split from Animation god-object) | D.W4 | **VERIFIED** — `src/animation/frame-compiler.ts` exists (332L at D.W4 commit, 430L today with post-D additions) |
| `advanceTo(t)` canon — no driver-layer `tick(t)` | D.W4 | **VERIFIED** — `engine.ts:840`, `group.ts:469`; `proof-engine.mjs` tick-canon check present |
| AnimationGroup zero-alloc group path (inv θ) | D.W4 | **VERIFIED** — `test/zero-alloc.test.ts` + `test/standalone-zero-alloc.test.ts` present; `proof:zero-alloc` standing gate |
| `pause()/resume()/toggle()` honest API | D.W4 | **VERIFIED** — `src/animation/group.ts:642+` has idempotent `pause`/`resume`/`toggle` |
| Deprecated `lerp*`/`formatCSS` path-compat re-exports deleted | D.W4 | **VERIFIED** — `grep lerp\|formatCSS src/animation/utils.ts` = 0 |
| `_snapSettled` symmetry (D-6a) | D.W3 | **VERIFIED** — `test/snap-symmetry.test.ts` present |
| `leaves.ts \| any` tightened (D-6b) | D.W4 | **VERIFIED** — `src/animation/internal/leaves.ts` has precise opaque-handle union |
| D-3 computed-unit round-trip — MEASURED + WITHHELD (inv ε) | D.W4 | **VERIFIED** — `test/d3-changed-keys.measure.test.ts` present; withheld correctly (benefit ~0 on hot path) |
| Demo decomposed: 5 oversized units split | D.W1 | **VERIFIED** — `AnimationControlsGroup.vue` split into `ControlsPaneWrapper`+`RibbonBar`+`useControlsLayout`; `KeyframesEditor` decomposed; etc. |
| Design idioms owned in `design-idioms.css` | D.W2 | **VERIFIED** — `demo/@/styles/design-idioms.css` exists; `utils.css` DELETED |
| φ-ladder leaf-tail F6 terminated (chronic A→B→C) | D.W2 | **VERIFIED** — `proof:phi-leaf-zero.mjs` in tree; `grep text-sm\|text-xs\|text-base demo/` body sites = 0 per sweep |
| `proof:idioms` gate | D.W2 | **VERIFIED** — `scripts/proof-idioms.mjs` present |
| `proof:brittleness` gate | D.W3 | **VERIFIED** — `scripts/proof-brittleness.mjs` present |
| `proof:decomposition` gate | D.W1 | **VERIFIED** — `scripts/proof-decomposition.mjs` present |
| `TopDock` → `ChromeDock` rename | D.W5 (via G.W12) | **VERIFIED** — `demo/@/components/custom/dock/ChromeDock.vue` exists; `TopDock.vue` gone (renamed in G commit `3d352a3`) |
| `dock/index.ts` re-export deleted | D.W5 (via G.W12) | **VERIFIED** — `ls demo/@/components/custom/dock/` = only `ChromeDock.vue` |
| `:always-expanded="isMobile"` mask REMOVED (touch-gate B′ fix) | D.W5 (via G.W12) | **VERIFIED** — `ChromeDock.vue:142` comment confirms mask removed; `grep always-expanded="isMobile"` = 0 |
| **`AnimationMenuBar` → `TransportDock` rename** | D.W5 (via G.W12) | **NOT DONE** — `AnimationMenuBar.vue` exists unchanged; 8+ active references in demo; never renamed. **See P1 finding below.** |

### D Invariants Introduced

| Invariant | Definition | Gate | Status |
|---|---|---|---|
| **inv η** | No demo idiom ships rented-ungated — every referenced CSS property/utility/`@keyframes` must resolve from a demo-owned definition | `proof:idioms` — `scripts/proof-idioms.mjs` | VERIFIED present + biting |
| **inv θ** | AnimationGroup steady-state group path allocates zero bytes/frame | `test/zero-alloc.test.ts` (planned as `bench/zero-alloc.bench.ts`; landed in `test/`) | VERIFIED present; location differs from spec (test/ not bench/) |
| **inv ι** | `utils.css` monolith holds only global rules; φ-ladder leaf-tail = 0 | `proof:phi-leaf-zero.mjs` + no-component-rule sweep | VERIFIED |

### D Deferred Ledger — P-invariant-28 Terminus

| Item | Tag | Terminal Disposition | Verified |
|---|---|---|---|
| φ-ladder leaf-tail F6 (chronic A→B→C) | KFD | **D.W2 — CLOSED** | `proof:phi-leaf-zero.mjs` present |
| Engine `_snapSettled` asymmetry | KFD | **D.W3 — CLOSED** | `test/snap-symmetry.test.ts` |
| `leaves.ts \| any` + deprecated re-exports | KFD | **D.W4 — CLOSED** | source grep = 0 |
| `TopDock→ChromeDock` rename | KFD | **closed via G.W12** | `ChromeDock.vue` confirmed |
| `dock/index.ts` deletion | KFD | **closed via G.W12** | `ls` confirmed gone |
| `:always-expanded="isMobile"` mask | KFD | **closed via G.W12** | `grep` = 0 |
| **`AnimationMenuBar→TransportDock` rename** | KFD | **D FINAL claims closed via G.W12 — FALSE** | `AnimationMenuBar.vue` still exists; `grep AnimationMenuBar demo/` = 8+ hits (demo/CLAUDE.md:53, AnimationControlsGroup.vue:88/149/251, App.vue:187, design-idioms.css:342, useEasingDemo.ts:370, useSequenceDemo.ts:148) |
| Square-scene mobile occlusion | KFD → glass-ui-HANDOFF | ROOT fixed in glass-ui dock; `occlusion-gate.mjs` mask-free | VERIFIED (honest HANDOFF) |
| ASK-3/ASK-2 | OUT | glass-ui owns; named allowance stable | VERIFIED |
| ScrollTimeline-native / Worker / dev.sh | ARCH | KILL, recorded | VERIFIED no re-litigation |

---

## Findings

### P1 — CD-1: D FINAL's dock-rename ledger overclaims (inv ε violation against D's own close)

**Evidence:** `docs/tranches/D/FINAL.md:189` — "Consumer dock-rename + `dock/index.ts` deletion — the ONE blocked carry | KFD | **closed via G.W12** | `grep TopDock|AnimationMenuBar` = 0 (ChromeDock); `dock/index.ts` gone". But `AnimationMenuBar.vue` exists in the current tree (`demo/@/components/custom/animation-controls/AnimationMenuBar.vue`); `demo/CLAUDE.md:53` still says "AnimationMenuBar.vue"; `AnimationControlsGroup.vue:88,149,251` imports and uses `AnimationMenuBar`; `git log --diff-filter=R` confirms `AnimationMenuBar.vue` was NEVER renamed (last rename was `TopDock.vue→ChromeDock.vue` in `3d352a3`). The D.W5 wave spec `docs/tranches/D/waves/D.W5.md:89-91` explicitly specifies `AnimationMenuBar → TransportDock` as part of the hard gate scope. The gate (`grep TopDock|AnimationMenuBar = 0`) was specified but never executed — the rename never landed, and D FINAL records it as closed.

**Severity:** P1. D was chartered as the terminal home for this rename; D FINAL records it closed while the tree refutes it. This is the exact class inv ε was invented to prevent.

**Disposition:** FOLD into J. The `AnimationMenuBar.vue → TransportDock.vue` rename is a one-file component rename + import-site sweep. The component role is correct (transport dock); only the name was not updated. J should execute this rename and verify the gate `grep AnimationMenuBar demo/` = 0 (excl. docs/tranches/).

---

### P2 — CD-2: D's `proof:zero-alloc` landed in `test/` not `bench/` (spec discrepancy)

**Evidence:** `docs/tranches/D/D.md` and `docs/tranches/D/waves/D.W4.md` both specify the gate as `bench/zero-alloc.bench.ts` (a vitest-bench file in `bench/`). What landed is `test/zero-alloc.test.ts` (a vitest test file in `test/`). `bench/` has no `zero-alloc.*` file. `test/standalone-zero-alloc.test.ts` is a companion. The instrument is functionally correct and the gate bites — the discrepancy is doc-vs-tree location only.

**Severity:** P2 (location mismatch, not a functional gap; the gate exists and works).

**Disposition:** FOLD — J CLAUDE.md / J path-forward should note the instrument lives at `test/zero-alloc.test.ts`, not `bench/`.

---

### BOOK — CD-3: D.W5 `AnimationMenuBar:always-expanded="true"` correctly KEPT (not a finding)

**Evidence:** `docs/tranches/D/waves/D.W5.md:142-149` explicitly dispositions `AnimationMenuBar.vue:17 :always-expanded="true"` as a "legitimate always-expanded transport affordance that STAYS" — NOT the conditional `isMobile` mask that B′ retires. The gate spec clarifies "the touch-mask form (`:always-expanded="isMobile"`) is gone (= 0). The `AnimationMenuBar.vue:17` `:always-expanded="true"` is the dispositioned-as-kept surviving always-expanded." This is correct and verified. The `always-expanded="true"` in `AnimationMenuBar.vue:17` is a feature, not debt.

**Disposition:** RECORD (historical note; confirms no action needed on this prop).

---

### P2 — CD-4: D FINAL written retrospectively (G vantage) — one omission from D's close ceremony

**Evidence:** `docs/tranches/D/FINAL.md:13-17` — "A retrospective close. This FINAL is written from the G vantage. D.W6 authored the close (waves/D.W6.md) and the impl ran the content, but the FINAL.md doc was the one residual the D close never committed." This is transparently disclosed and self-correcting. However, the retrospective write creates a window where D's close record was absent from the tranche docs between D.W6 and G.WZ — the only cross-tranche artefact gap in A→I. No J action needed; RECORD as an artifact of the retrospective.

**Disposition:** RECORD.

---

## Prompt Coverage (C)

| # | Prompt / Request | Status | Evidence |
|---|---|---|---|
| C-P1 | 6-agent re-audit of B's plan and changes | **ADDRESSED** | `C/audit/plan-findings.txt` (46 findings, 11 high); per-lane reports under `C/audit/lanes/` |
| C-P2 | Make B's close honest (7 asserted-not-met gates) | **ADDRESSED** | C.W1 + C FINAL §B-overclaim reconciliation; all 7 verified in tree |
| C-P3 | Design language made whole (φ-ladder) | **ADDRESSED** (display tier) | C.W2: 58 instrument-serif → semantic ladder; `--font-display` formalized; leaf-tail → D.W2 (correct forward) |
| C-P4 | Demo dogfoods the engine (inv ζ) | **ADDRESSED** | C.W3: 7 rAF → light engines; `proof:dogfood` ALLOWLIST=3 |
| C-P5 | Before/after capture harness checked in + re-runnable | **ADDRESSED** | `scripts/capture.mjs` in repo; AFTER captures under `C/audit/screenshots/after/` (19 files) |
| C-P6 | π at full | **ADDRESSED** | `C/audit/pi.md` recorded; `--reduced-motion` probe in capture.mjs |
| C-P7 | Engine residuals transposed | **ADDRESSED** | C.W4 verified; `playback.ts` has `_run`; `setColorSpace`/`setHueMethod` fail-explicit |
| C-P8 | NOT an implementation phase (then authorized) | **HONORED** | C.W0 dev-only; user authorized W1–W5 |
| C-P9 | Recap all prompts (P1+P2+P3) | **ADDRESSED** | `C/audit/lanes/prompt-recap.md` |

## Prompt Coverage (D)

| # | Prompt / Request | Status | Evidence |
|---|---|---|---|
| D-P1 | Demo refined (5 oversized units, KISS, vueuse) | **ADDRESSED** | D.W1; `proof:decomposition`; verified ceiling reductions |
| D-P2 | Design language localized + uncaged | **ADDRESSED** | D.W2; `design-idioms.css`; `utils.css` deleted; `proof:idioms` |
| D-P3 | Brittleness hardened | **ADDRESSED** | D.W3; `proof:brittleness` |
| D-P4 | Engine transposed to its gestalt | **ADDRESSED** | D.W4; `frame-compiler.ts`; `advanceTo`; `zero-alloc`; `pause/resume/toggle` |
| D-P5 | Dock leveraged + mobile composition | **PARTIAL** | `TopDock→ChromeDock` and `dock/index.ts` deletion DONE; `AnimationMenuBar→TransportDock` NOT DONE (P1 CD-1) |
| D-P6 | Every deferral terminated (P-invariant-28) | **PARTIAL** | All KFDs except `AnimationMenuBar` rename closed; that one overclaimed in FINAL |
| D-P7 | Recap all prompts | **ADDRESSED** | `D/audit/prompt-recap.md` chains A→B→C→constellation→D |
| D-P8 | NOT an implementation phase (D.W0 dev-only) | **HONORED** | D.W0 produces only docs; IMPL authorized separately |
| D-P9 | No perpetual punts | **MOSTLY MET** | All chronic items terminated; `AnimationMenuBar` rename is the one item D FINAL claims done that isn't |

---

## Fold Candidates for Tranche J

| Item | Origin | Status Today | Must Fold |
|---|---|---|---|
| `AnimationMenuBar.vue → TransportDock.vue` file rename + import sweep | D.W5, D FINAL claims closed | OPEN — file exists, 8+ references in demo | YES (P1 CD-1) |
| Note `proof:zero-alloc` location is `test/` not `bench/` in docs | D.W4 spec | Minor doc discrepancy only | NO (RECORD in J path-forward) |
