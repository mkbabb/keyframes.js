# Tranche H DEEP harden — FINAL VERIFY lane (read-only)

**Role.** The last verify pass. Re-read H.md, PROGRESS.md, waves/H.W0..H.W8, the
handoff, the gap-scorecard, and the `_HARDEN-LEDGER.md` after the fixers applied the
ledger. Mandate: confirm (1) the 8 BLOCKERS are resolved (or explicitly flagged-for-impl,
not dropped); (2) charter↔waves↔PROGRESS↔handoff↔gap-scorecard are ONE truth; (3) no
fixer introduced a NEW contradiction. DO NOT edit — REPORT.

**Verdict: IMPLEMENTATION-READY with ONE residual MED defect** (a re-introduced BLK-2-class
parse-target drift in the wave that authors the meta-gate). Everything else verified
resolved + one-truth. The residual is a 3-token doc edit; it does not re-architect anything.

---

## (1) BLOCKER resolution — all 8 verified

| BLK | Status | Evidence (file:line in the now-fixed tree) |
|---|---|---|
| **BLK-1** (W0 mis-root-caused; Cube presets don't throw) | **RESOLVED** | `H.W0.md:9,16,24,26,37,45,53,62,76` — S1 re-targeted to easing `contractAnim` (`useEasingDemo.ts:268`) + amiga (`useAmigaAnimations.ts:31,74`) + `animations.ts` `CSSCubicBezier` presets; Cube-preset edit DELETED ("a no-op on the wrong seam"); S2 readout `try/catch` promoted to co-equal primary; gate (d) re-points `CSSKeyframesToString(contractAnim)` (a seam that throws), born-GREEN claim demoted; anchors re-homed to `src/animation/format.ts:36`. |
| **BLK-2** (meta-gate parses absent `FINAL.md`) | **RESOLVED for FINAL.md, but a NEW section-name drift introduced** — see Finding F1 | `H.W8.md:25,33,47` correctly drop FINAL.md as the primary substrate (PROGRESS.md is canonical; FINAL.md behind `fs.existsSync`). **BUT** they name the canonical section `§"Deferred ledger"` — a heading that does NOT exist in PROGRESS.md (the real heading is `## Open deferrals`, PROGRESS.md:283). |
| **BLK-3** (dangling dock-gate name) | **RESOLVED** | `proof:dock-live` survives ONLY in explicit "NOT `proof:dock-live`"/RETIRED context (handoff:50,54; PROGRESS:117 wave-status prose; a-* evidence frozen history). Canonical `proof:dock-morph-settled` (D5 spring) + `proof:dock-popover-opens` (D9, split out) consistent across H.md/PROGRESS/H.W1/H.W2/H.W7/H.W8/gap-scorecard/deferred-ledger/handoff. The PROGRESS:292-297 chronic TABLE (the actual parse substrate) cites only canonical names. |
| **BLK-4** (`pixelmatch`/`pngjs` unnamed dep) | **RESOLVED** | `H.W8.md:25,31,75` + `H.md:456` + `PROGRESS.md:117` — explicit "add `pixelmatch`+`pngjs` as devDeps (or `npm i --no-save` in CI, mirroring `@playwright/test` at `ci.yml:176`); preserves the 2-runtime-dep posture." |
| **BLK-5** (stale "unpublished `53c1b07`") | **RESOLVED** | `H.md:463,543`, `PROGRESS.md:217-218,261-262,297`, `handoff:116,119,122` — reclassified to a kf SHIP-in-H consume-leg BUMP `^3.4.0 → ^3.5.1` ("`53c1b07` IS PUBLISHED — 3.5.0/3.5.1/3.6.0, VERIFIED"); token-peak gate form (≤+6% on `--spring-dock` ramp, RED at installed +16.3%); blast-radius + self-alias notes added. The only surviving "unpublished/release-then-bump" strings are the CORRECTION text (handoff:119,122 = "is STALE / NOT release-blocked") + the a-historical-dock evidence file (frozen history — see Finding F3). |
| **BLK-6** (gesture collision, not "free win") | **RESOLVED** | `H.W7.md:7,25,31,66,78` — RESOLVED design-decision: dedicated grab handle owns the sheet swipe (its own `pointerdown`/`setPointerCapture`); stage region keeps `touch-action:none` as the orbit surface; the two gesture surfaces are spatially DISJOINT; F4 re-scoped (stage-drag mutates quaternion, handle-drag moves sheet — NOT "draggable for free"). |
| **BLK-7** (favicon vs `-sm` PNG KILL) | **RESOLVED** | `H.W5.md:33,54` — S2 names the resolution (re-point `index.html:14` to `favicon.svg` OR keep `cube-icon-sm.png` as the lone allow-listed raster, in the SAME motion as the KILL); `proof:scene-icons` G3 asserts the allow-list set is EXACTLY `{the favicon path named in index.html}` AND that `rel=icon` resolves to an existing file (gates the 404). |
| **BLK-8** (D9 popover dispositioned but no wave ships it) | **RESOLVED** | `H.W1.md:50,71,72` — S8 added: drop `App.vue:18-21` outer `<DropdownMenuTrigger as-child>`, use `<DockDropdownTrigger>` directly, remove unused import (`:152`), imperative `useOptionalDockContext()?.keepOpen()`/`release()` (NOT a `v-model` binding, per HD-2); born-RED `proof:dock-popover-opens` (`finalOpen:true` after trusted click) + `proof:single-toggle` (`handlerCount===1`). D9 homed in `H.md:183` defect table → "H.W1 S8". |

**Net:** 8/8 BLOCKERS resolved at the load-bearing layer. BLK-2's FINAL.md half is fixed,
but its section-name half re-introduces the very class of defect it was meant to kill (F1).

---

## (2) One-truth across charter↔waves↔PROGRESS↔handoff↔gap-scorecard

- **Wave count = 9** (H.W0..H.W8 on disk + the H.WZ close-report, correctly NOT a 10th
  wave). PROGRESS wave-status enumerates W0..W8 + WZ; all 9 wave files present.
- **Band labels coherent** — Band 0..5 across W0..W8 (PROGRESS:78-94 legend, :109-117
  per-wave), internally consistent; no orphan/duplicated band.
- **D1–D14 all homed** (H.md defect table :176-184): D12→W1, D2/D14→W2, D1/D4→W3,
  D3/D7→W4, D8/D11→W5, D6→W6, D10/D13→W7, D9→W1 S8, D5→W8. None dropped.
- **Gates consistent** — every chronic-table gate (PROGRESS:292-297) resolves to an
  authoring wave: `proof:cartoon-is-panel-depth`/`proof:no-orphan-specular`→W2,
  `proof:phi-leaf-zero`/`proof:hero-rung`→W4, `proof:mobile-single-page`/`proof:drawer-spring`→W7,
  `proof:dock-morph-settled`→W8 (token-peak), `proof:dock-popover-opens`/`proof:single-toggle`→W1.
  No dangling names in the parse substrate.
- **φ-leaf count = 2 (L1+L2) everywhere** (H.md:409, PROGRESS:295, H.W4.md:42,
  gap-scorecard:257/279, deferred-ledger:220) — all "37" mentions are corrective
  ("NOT 37 / 37 materializes only by counting vendored ui/"). HS-HIGH-3 propagated.
- **gap-scorecard retains authoritative status** + a "reconciled in the Tranche-H DEEP
  harden / Self-consistency" footer (:91, :246).
- **35 a-*.md** on disk = the corrected count.

---

## (3) New-contradiction scan + the residual findings

### F1 — MED — BLK-2 RE-INTRODUCED: H.W8 names the meta-gate's canonical parse target as a section that does NOT exist (`§"Deferred ledger"` vs the real `## Open deferrals`)
**Location:** `waves/H.W8.md:25` (`§Deferred ledger`), `:33` (`§"Deferred ledger"`),
`:47` (`§"Deferred ledger"`).
**Defect (evidence):** BLK-2's whole point was that a static parser pointed at a
non-existent location throws/half-polices. The fixers correctly dropped FINAL.md — but
then named the canonical PROGRESS.md substrate `§"Deferred ledger"`, and **PROGRESS.md has
NO such heading.** The chronic `Chronic | Prior false-close mode | H closure` table lives
under `## Open deferrals` (PROGRESS.md:283, table at :292-297). VERIFIED:
`grep -nE "^#" PROGRESS.md | grep -i "deferred ledger"` → 0 hits. The charter
(`H.md:463`) and PROGRESS.md:118 correctly say `§"Open deferrals"`. So the spine is SPLIT:
the very wave that AUTHORS the meta-gate points it at a phantom section; the charter +
PROGRESS point it at the real one. (The likely cause: name-collision with the separate
file `audit/_SYNTHESIS-deferred-ledger.md`, which the same clauses cite as "descriptive
history.") A faithful implementer keying the parser off the H.W8 wording reds/throws —
exactly BLK-2.
**Concrete fix:** in `H.W8.md` lines 25, 33, 47, replace `§"Deferred ledger"` /
`§Deferred ledger` → `§"Open deferrals"` (matching the actual PROGRESS.md heading and the
already-correct H.md:463 / PROGRESS.md:118 wording). (Optional belt: rename the
PROGRESS.md heading from `## Open deferrals` to `## Deferred ledger` instead — but that
forces edits in 2 already-correct spots + the H.WZ row, so editing the 3 H.W8 strings is
the smaller, DRY motion.)

### F2 — LOW — gap-scorecard / deferred-ledger DO use the bare `PROGRESS.md §Deferred ledger` label too (consistency carry of F1)
**Location:** `audit/_SYNTHESIS-gap-scorecard.md` + `audit/_SYNTHESIS-deferred-ledger.md`
reference "Deferred ledger" as a parse-substrate concept (the §1 history doc is literally
named that). VERIFIED the grep for `PROGRESS.md §"Deferred ledger"` is EMPTY in those two
files (they say `_SYNTHESIS-deferred-ledger.md §1`, not `PROGRESS.md §Deferred ledger`) —
so the synthesis layer is technically clean. Flagged LOW only because if the lead renames
the PROGRESS heading per F1's optional belt, re-check these for the inverse drift. **No
edit required if F1 is fixed by editing the 3 H.W8 strings.**

### F3 — LOW (flag-for-impl, already RECORDED by the fixers — do NOT silently drop) — a-historical-dock.md retains the stale "unpublished / release-then-bump" framing
**Location:** `audit/a-historical-dock.md:241,242,279` ("It is unpublished. glass-ui-HANDOFF:
cut a release … then kf bumps"; "H-dock-2 … `53c1b07` unpublished … release then bump").
**Defect:** the ledger's BLK-5 / CP-MED-3 named `a-historical-dock:240-242` as a
charter-side string to un-stale; the HANDOFF-SYNTHESIS fixer report explicitly RECORDED
a-* evidence files as OUT-of-partition (boundary discipline) and left them. So this is a
KNOWN, RECORDED residual in a frozen-history evidence file — NOT a dropped BLOCKER. The
load-bearing spine (H.md/PROGRESS/waves/handoff/gap-scorecard) is fully un-staled.
**Disposition:** acceptable as-is (a-* are descriptive history, not the implementation
contract). If the lead wants the evidence trail internally consistent, edit
a-historical-dock:241-242,279 to mirror BLK-5 ("`53c1b07` PUBLISHED in 3.5.0+; kf
consume-leg bump, not a release-wait"). Same applies to `a-deferred-chronic.md:115,166`
which still use `proof:dock-live` (BLK-3 a-* half, RECORDED out-of-partition). NOT a
blocker to implementation.

---

## What is SOUND (honest credit — no manufactured work)

- All 8 BLOCKERS resolved at the implementation-contract layer; the architecture (FSM,
  cartoon swap, mobile overlay, gesture-arbitration, gate regime, chronic meta-gate) is
  unchanged and sound — the fixers applied doc edits, not re-architecture.
- WV-W7-HIGH-1 (the SOTA-overreach risk) resolved: `proof:drawer-spring` grep scoped to
  `ControlsPaneWrapper.vue`, EXPLICITLY excludes the ALREADY-SOTA
  `AnimationControlsControls.vue:295 .panel-row` crossfade + `dist/` (H.W7.md:55).
- W7 spring preset coherent: constructs its OWN `SpringProgress({response:0.3,
  dampingFraction:0.8})` <350ms; ≤70dvh detents; does NOT bind `--spring-snappy` (all 10
  `spring-snappy` mentions are the corrective "does NOT bind / FAILS the budget" context;
  no affirmative bind anywhere).
- No `TODO`/`TBD`/`FIXME`/`UNRESOLVED`/`<placeholder>` markers in any load-bearing doc.
- φ-leaf, dock-gate-name, manifest-source, and gate-resolution invariants all one-truth.

---

## Residual state for the lead

**Tranche H is implementation-ready.** The 8 BLOCKERS are resolved; the spine is one
truth on wave count (9), band labels, D1–D14 homing, and gate names. The ONE thing the
lead should land before impl is **F1 (MED): 3 string edits in H.W8.md** changing
`§"Deferred ledger"` → `§"Open deferrals"` so the meta-gate's parse target names the
section that actually exists in PROGRESS.md (otherwise BLK-2 re-fires at the wave that
authors the gate). F2 is a no-op if F1 is fixed via the H.W8 edits. F3 (stale a-*
evidence) is a KNOWN, RECORDED out-of-partition residual in frozen history — optional
cosmetic, not a blocker. No fixer introduced any OTHER new contradiction.
