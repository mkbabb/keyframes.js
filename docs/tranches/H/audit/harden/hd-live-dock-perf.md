# Tranche H DEEP harden — lane `hd-live-dock-perf`

**Charge.** LIVE re-verify D5: measure the dock open/close morph (FPS, the bouncy
`--spring-dock` value, settle), confirm the lag is REAL + characterize it (the pre-AW.W2
spring), confirm the dock-HANDOFF anchor + that `proof:dock-morph-settled` would BITE.
DEEPER pass: is the FIX correct/feasible, does the gate genuinely bite, does the wave
depend on an API/feature that exists.

**Method.** Live Playwright against the running demo (`http://localhost:5173/`, kf 4.1.0 +
Tranche G, glass-ui **3.4.0** installed); `node_modules` token reads; **the glass-ui SOURCE
repo on disk** (`/Users/mkbabb/Programming/glass-ui`) + the **npm registry** (authoritative
publish check via `npm pack`). dpr=1 headless host (Apple Silicon — absorbs raster cost; the
audit's own MEASURE-FIRST caveat about dpr is honest and re-confirmed).

---

## VERDICT

The D5-lag DIAGNOSIS is CORRECT and LIVE-CONFIRMED — the installed dock runs the pre-retune
`--spring-dock` (live peak **1.16292 @ 14.286%**, the (0.5,0.5) ~+16–18% register). The
chassis-over-blur structural claims (no `contain`/`will-change`, `blur(11px)`, `padding` on
the bouncy spring) are all live-confirmed. The collapse-veil (D9/F2) is live-confirmed.

**But the lane's central DISPOSITION is STALE and I found ONE BLOCKER + two HIGH defects the
consistency pass could not see:**

- **BLOCKER (H-LD-1):** the dock-lag HANDOFF (GH-1 / DK-1 / H-dock-2 / S4) is written as a
  glass-ui-BLOCKED handoff awaiting an *unpublished* `53c1b07` ("release `53c1b07` ≥3.4.1
  THEN kf bumps"). **That is no longer true.** glass-ui has ALREADY released AND PUBLISHED the
  retune: **3.5.0 and 3.5.1 are on the npm registry, both contain `53c1b07`**, and the
  published 3.5.1 token is the retuned +4.5% register. The blocking dependency is DISCHARGED.
  This is not a glass-ui-blocked HANDOFF — it is a **kf consume-leg (a one-line
  `package.json` bump `^3.4.0 → ^3.5.1`) that can ship in H NOW.** Multiple H docs encode the
  stale framing as load-bearing.
- **HIGH (H-LD-2):** `proof:dock-morph-settled` as specified (sample width overshoot/settle)
  is **not reliably measurable on this dock** — I could not drive or capture the morph across
  three live attempts (181 samples, width never moved). The gate risks false-GREEN or flake.
- **HIGH (H-LD-3):** the chronic-closure meta-gate's whole RAISON — "a HANDOFF that ships no
  born-RED kf gate is the M3 silent forever-punt" — is UNDERCUT by H-LD-1: once the fix is
  published, keeping the dock as a *watched HANDOFF* instead of a *shipped bump* is itself a
  soft re-paper. H must reclassify the row to SHIP-the-bump.

The remaining lane content (DK-3 collapse-delay, F1/F3 perf, the @mbabb T1/T2 fix) is SOUND
and I corroborate it. Findings below.

---

## LIVE EVIDENCE (this pass, 2026-06-07, `:5173`)

**E1 — the live token (the BITE anchor, CONFIRMED).** `/#/cube`, `getComputedStyle(:root)`:
```
--spring-dock peak = 1.16292 @ 14.286%        ← the pre-retune (+16.3% measured) register
--dock-resize-spring === --spring-dock         ← token cascade intact (true)
--duration-normal = 0.3s
```
Matches `node_modules/@mkbabb/glass-ui/dist/styles/tokens.css:163` exactly. The audit/charter
call it "+18.5%"; the **peak of the linear() ramp is +16.3%** — the (0.5,0.5) authoring note
at `tokens.css:1297` says "+18.5%", a small discrepancy between the spring's analytic
overshoot and the sampled-ramp peak. NIT, recorded (H-LD-5).

**E2 — the chassis (F3/M6, CONFIRMED).** Live computed on `.glass-dock`:
`containerType:"normal"`, `contain:"none"`, `willChange:"auto"`, `backdropFilter:"blur(11px)"`,
and the live `transition` string carries `padding 0.3s linear(0,…1.16292 14.286%…)` — i.e.
the **layout axis (`padding`) IS animated on the bouncy spring over a blurred surface with no
promotion/containment.** Every M6/F3 structural claim is live-true. The 3.3.0 sliver is
healed (rect 116×55 collapsed / 312 expanded, content-sized — H-dock-3 correctly "already
fixed").

**E3 — the collapse veil (D9/F2/M7, CONFIRMED).** Collapsed dock (`glass-dock … collapsed
fit-content`): the `.dock-layer--full` is `visibility:hidden; opacity:0; pointer-events:none`,
the `.dock-layer--summary.layer-active` is visible/auto. The @mbabb actions ARE behind the
veil. (Also observed: TWO `--full` + TWO `--summary` layers live = top ChromeDock + bottom
menubar dock, the F4 two-band note — true.)

**E4 — the morph is NOT live-measurable (the H-LD-2 evidence).** Three attempts to drive +
sample the morph:
1. synthetic `pointerenter`/`mouseenter` on `.glass-dock` → width stayed 312, no morph.
2. real-navigate `/#/cube` (dock mounts EXPANDED 312) + synthetic
   `pointerleave`/`pointerout`/click-away → **181 rAF samples over 1.5s, width = single value
   312, `collapsed` never flipped.** No morph captured.
3. The state machine ignores synthetic pointer events (it uses VueUse hover/timers); a real
   collapse is gated behind `collapse-delay=2500` (2.5s) anyway.
This EMPIRICALLY confirms the audit's own §H-dock-4 caveat ("live `getBoundingClientRect`
under-reads … VT snapshots are invisible to live-element geometry") AND extends it: even the
FLIP-fallback width is not reliably samplable, and the morph is not synthetically triggerable.

**E5 — the D12 interaction (CONFIRMED, cross-link).** The page URL drifted `#/cube → #/`
and `#/cube → #/cube?anim=Rotations` between my calls with no navigation issued — the D12
route-storm is live and interacts with the dock state (re-mounts, re-expands). This is why a
morph gate that depends on a stable dock state is fragile.

---

## REPO/REGISTRY EVIDENCE (the BLOCKER)

**E6 — glass-ui has PUBLISHED the retune.** `/Users/mkbabb/Programming/glass-ui`:
- source repo HEAD = **3.6.0** (`49072ef chore(release): glass-ui 3.6.0 — dock COMPLETE`).
- tags present: `v3.4.0 v3.5.0 v3.5.1 v3.6.0`.
- `git merge-base --is-ancestor 53c1b07 v3.5.0` → **YES** (the retune is in 3.5.0, 3.5.1, 3.6.0).
- `git show v3.5.0:src/styles/tokens.css` → `--spring-dock: linear(0, 0.10282 …, 1.02452
  14.286%, **1.04501** 18.367% …)` = the **(0.32, 0.70) ~+4.5% retuned register**.
- `useLayerTransition.ts:20` → `DOCK_SPRING = { response: 0.32, dampingFraction: 0.7 }`
  (the JS twin, matching the token).

**E7 — it is ON npm (authoritative).** `npm view @mkbabb/glass-ui versions` →
`… "3.4.0","3.5.0","3.5.1"` (registry tops at **3.5.1**; 3.6.0 tagged-but-unpublished).
`npm pack @mkbabb/glass-ui@3.5.1` → the published tarball's
`dist/styles/tokens.css` carries `--spring-dock: linear(0, 0.10282 …, 1.02452 14.286%,
**1.04501** 16.327% …)` — **the retune IS in the published package.**

**E8 — peer-compat is satisfied.** published 3.5.1 `peerDependencies`:
`@mkbabb/keyframes.js: "^2.2.0 || ^3.0.0 || ^4.0.0"` (kf is 4.1.0 ✓),
`@mkbabb/value.js: "^0.10.0 || ^0.11.0"` (value.js is 0.11.1 ✓), `vue ^3.5`, node `>=22`.
**The bump `^3.4.0 → ^3.5.1` has no peer conflict.** (And glass-ui sits in kf's
`optionalDependencies` + the demo self-aliases `@mkbabb/glass-ui → src` per
`vite.config.ts:142-146`, so the bump is low-blast-radius for the library build.)

---

## FINDINGS

### H-LD-1 · BLOCKER · the dock-lag HANDOFF is STALE — the retune is PUBLISHED; reclassify as kf SHIP-the-bump
- **Location.** `valuejs-parsethat-glassui-handoff.md:109-165` (GH-1), `:569` (the DAG);
  `_SYNTHESIS-dock-perf-modes.md:94` (DK-1) + `:369`; `_SYNTHESIS-gap-scorecard.md:174`;
  `a-historical-dock.md:240-242,279`; `H.md:417 (S4)`, `:490`, `:461`; `PROGRESS.md:241,272`;
  `H.W8.md:46,70` (`proof:dock-live` "green ONLY when the consumed glass-ui … fixes it").
- **Defect.** Every one of these encodes the disposition as *"the work is ALREADY DONE,
  **unpublished** … release `53c1b07` (≥3.4.1/3.5.0), THEN kf bumps … born-RED today, GREEN
  ONLY when the consumed glass-ui ships `53c1b07`."* The premise "unpublished / awaits a
  glass-ui release" is **false as of this pass.** E6/E7: glass-ui released **3.5.0 AND 3.5.1**,
  both PUBLISHED on npm, both containing `53c1b07`; the published 3.5.1 token is the retuned
  +4.5% register. The blocking sibling-leg is DISCHARGED. The handoff's "Sequencing: glass-ui
  releases `53c1b07` (its AW cadence) → kf bumps" has had its first arrow already satisfied.
- **Why BLOCKER (the wave cannot be implemented as written).** GH-1's disposition forbids the
  fix from landing in H ("glass-ui-HANDOFF … Independent of every other H wave … GREEN only
  when the consumed glass-ui ships"). But the consumed glass-ui HAS shipped — so an
  implementer following GH-1 literally would PUNT a fix that is a one-line `package.json` bump
  available today, and `proof:dock-morph-settled` would stay born-RED for no reason. That is
  the exact M3 "column-migration to silent forever-punt" the charter exists to prevent —
  re-created by the doc being a snapshot of a now-past world.
- **Concrete doc edit.** Reclassify the row from *glass-ui-HANDOFF (await release)* to
  **kf SHIP-in-H (consume-leg): bump `@mkbabb/glass-ui ^3.4.0 → ^3.5.1`** (`package.json:103`),
  re-verify the live token flips to the +4.5% register, then assert the gate. Keep the
  "NO kf fork of the spring" rule (still correct — the fix is consuming glass-ui's published
  token, not patching it; the memory rule is honored). Specifically:
  - `valuejs-parsethat-glassui-handoff.md` GH-1: replace "the work is ALREADY DONE,
    unpublished" / "release `53c1b07` (≥3.4.1/3.5.0), THEN kf bumps" with "the work is DONE
    AND PUBLISHED (glass-ui 3.5.0/3.5.1 on npm, both contain `53c1b07`; published 3.5.1
    `--spring-dock` peak 1.04501 / +4.5%); **kf consume-leg = bump `^3.4.0 → ^3.5.1`,
    SHIP-in-H.** Verify peer-compat (3.5.1 admits kf `^4`, value `^0.11`)."
  - Update the DAG `:569` and `_SYNTHESIS-dock-perf-modes.md:94`, `_SYNTHESIS-gap-scorecard.md:174`,
    `H.md:490`, `a-historical-dock.md:240-242` identically (the "unpublished `53c1b07`" string
    recurs verbatim — fix every instance).
  - `H.W8.md:46,70`: `proof:dock-live`/`proof:dock-morph-settled` is no longer "green ONLY
    when the consumed glass-ui … fixes it" — it greens **when kf lands the bump**. Reword so
    the gate is a SHIP-verification, not a HANDOFF-watch.
- **NB — born-RED still holds TODAY (the gate is honest pre-bump):** the INSTALLED 3.4.0 token
  is live-confirmed +16.3% (E1), so the gate reds on the current tree. The fix is the bump,
  not a wait. (Caveat: the demo's `@mkbabb/glass-ui → src` self-alias at `vite.config.ts:142-146`
  means the DEMO may already resolve a local glass-ui checkout's tokens — H must confirm
  whether the live `:5173` demo reads the published package or the aliased source; if aliased
  to a stale local checkout, the bump's effect on the demo is via the alias target, not
  `package.json`. The library build reads `package.json`. Flagging so the bump's
  blast-surface is correctly scoped — see H-LD-4.)

### H-LD-2 · HIGH · `proof:dock-morph-settled` is not reliably measurable as specified — false-GREEN / flake risk
- **Location.** `valuejs-parsethat-glassui-handoff.md:142-149` (GH-1 the TERMINAL),
  `_SYNTHESIS-dock-perf-modes.md:108-112`, `a-historical-dock.md:253-255`,
  `H.W8.md:46` (`proof:dock-live`: "dock expand/collapse settles ≤1 frame of its spring").
- **Defect.** The gate asserts "peak overshoot ≤6%, settle ≤200ms" sampled via "the VT
  pseudo-elements OR the `SpringProgress` clock — NOT live `getBoundingClientRect`." LIVE
  (E4) I could not drive the morph synthetically NOR capture it via width sampling across 181
  samples / 1.5s — the dock state machine ignores synthetic pointer events and `collapse-delay`
  is 2.5s. The audit already flags the `getBoundingClientRect` under-read (§H-dock-4), but the
  PROPOSED instruments are also unproven against THIS dock:
  - "VT pseudo-elements": the VT path runs `::view-transition-*` snapshots that exist ONLY
    during the transition and are NOT queryable via standard `getComputedStyle` mid-flight in
    a reliable, cross-engine way — no doc shows a working probe.
  - "the `SpringProgress` clock": that clock lives INSIDE glass-ui's `useLayerTransition`
    (`DOCK_SPRING`, glass-ui-internal) — kf has **no public handle** to subscribe to it. A
    kf-side gate cannot read a glass-ui-private spring instance without glass-ui exposing it.
  So both proposed instruments depend on a probe surface that **does not demonstrably exist on
  the kf side**, and the disallowed-but-only-tried one (width) didn't move. A gate that cannot
  be measured cannot bite; worst case it asserts on a never-changing width and false-GREENs.
- **Concrete doc edit.** EITHER (a) pin the instrument to a CONCRETE, demonstrated probe:
  e.g. record a screen capture of the morph and OCR the timeline, OR sample `getComputedStyle`
  of the chassis `width`/`padding` UNDER a forced FLIP-fallback (disable VT via
  `prefers-reduced-motion` / a test flag so the morph is live-readable), and DOCUMENT the
  trigger that actually drives the morph (a real Playwright `page.hover()` + the
  `collapse-delay` lowered for the test, not synthetic dispatch). OR (b) **demote the
  morph-settle assertion to a TOKEN-LEVEL gate** that is trivially biteable and matches the
  actual fix: assert the resolved `--spring-dock` peak ≤ +6% (parse the live `linear()` ramp,
  exactly as this lane did at E1) — born-RED on the installed +16.3% token, GREEN the instant
  the bump lands. This is the honest, falsifiable, zero-flake form and it directly verifies
  H-LD-1's consume-leg. Recommend (b) as the primary, with `proof:dock-dropdown-opens`
  (popover, separately measurable) as the interaction half.

### H-LD-3 · HIGH · the chronic-closure meta-gate logic mis-classifies the dock once the bump is available
- **Location.** `H.W8.md:33` (S3, the meta-gate), `:46,70`; `PROGRESS.md:272` (the dock
  chronic row).
- **Defect.** The meta-gate's rule: a chronic exits via "(a) a SYSTEM-property gate, OR (b) a
  HANDOFF tag PAIRED with a born-RED kf gate." The dock row is filed under (b). But per
  H-LD-1 the dock fix is now a **kf-side SHIP (the bump)**, not a HANDOFF — so its correct
  terminal is (a)-shaped: a SYSTEM-property gate that GREENS when kf lands the bump, not a
  perpetually-born-RED HANDOFF watch. Leaving it as a HANDOFF-paired-born-RED row means the
  meta-gate would treat the dock as "correctly handed off and watched" while a shippable fix
  sits unland­ed — the meta-gate would PASS on a row that should be a SHIP-owed item. The
  meta-gate polices "is there a born-RED gate," not "was the available fix shipped" — and for
  the dock those now diverge.
- **Concrete doc edit.** In `PROGRESS.md` chronic→gate table and `H.W8.md` S3, move the dock
  (CH-4) row's H-closure from "HANDOFF + born-RED gate" to **"SHIP-the-bump + SYSTEM gate
  (`proof:dock-morph-settled` token form, H-LD-2b), greens on the bump"**, and keep
  `proof:dock-dropdown-opens` as the separate kf-side D9 fix gate. State explicitly that the
  glass-ui-HANDOFF leg for the dock SPRING is **discharged** (consumed via the published bump);
  what remains kf-side is the bump + the @mbabb wiring, both SHIP-in-H.

### H-LD-4 · MED · the demo self-alias means the bump's effect on the LIVE demo must be scoped
- **Location.** `valuejs-parsethat-glassui-handoff.md:23` + `vite.config.ts:142-146`
  (the `@mkbabb/glass-ui → src` dedup self-alias, AW-endorsed, "STAYS").
- **Defect.** The handoff notes the demo aliases `@mkbabb/glass-ui` to a local `src`. If that
  alias points at a local glass-ui CHECKOUT (which on this machine is now 3.6.0 — already
  retuned), the LIVE demo at `:5173` could ALREADY be reading retuned tokens via the alias —
  yet E1 measured the OLD +16.3% token live. So the demo is reading the OLD register (alias
  target is stale OR points into `node_modules`). H must establish, before claiming the bump
  fixes the demo: does the demo resolve glass-ui from `node_modules` (`package.json` bump
  fixes it) or from an aliased local checkout (a `git pull`/rebuild of the alias target fixes
  it)? The two consume-legs are different motions.
- **Concrete doc edit.** Add to GH-1 / DK-1 a one-line note: "consume-leg scope: confirm
  whether the demo's `vite.config.ts:142-146` glass-ui alias resolves the published package or
  a local checkout; the bump fixes the LIBRARY build via `package.json`, the demo via the
  alias target — name both." (My E1 evidence: live demo reads +16.3% despite a 3.6.0 local
  checkout, so the alias is NOT silently pulling the retune — the bump/package path is the
  effective one.)

### H-LD-5 · NIT · "+18.5%" vs the measured +16.3% ramp peak
- **Location.** `tokens.css:1297` (glass-ui authoring note, "~+18.5%"), echoed across all H
  dock docs as "+18.5% register."
- **Defect.** The sampled `linear()` ramp peaks at **1.16292 (+16.3%)** (E1, live + node_modules),
  not +18.5%. The +18.5% is the spring's analytic overshoot for (0.5,0.5); the ramp's
  finite-sample peak is +16.3%. Harmless for the DIAGNOSIS, but if a gate asserts a numeric
  threshold "≤6%" derived from a "+18.5% today" baseline, use the MEASURED ramp peak (+16.3%)
  as the born-RED reference so the gate's bite margin is computed from the real value.
- **Concrete doc edit.** Where docs cite the today-value as the gate's born-RED anchor, write
  "the live `--spring-dock` ramp peaks at +16.3% (analytic spring overshoot ~+18.5%)" so the
  number the gate parses matches reality.

---

## CORROBORATED (no new defect — the lane authoring is SOUND here)

- **DK-3 / collapse-delay.** `ChromeDock.vue:116` `:collapse-delay="2500" :start-collapsed="true"`
  — confirmed verbatim. The 2.5s hold is real and is a genuine demo-side SHIP lever
  (→~1000ms, MEASURE-FIRST). SOUND.
- **F1 backdrop-over-moving-scene + F3 chassis-no-promotion + F4 two bands.** Live E2/E3
  confirm `contain:none`/`willChange:auto`/`blur(11px)` and two live dock bands. The structural
  claims are true. The dpr=1 host cannot show the dropped frames (correctly stated) — so the
  perf BUDGET items staying MEASURE-FIRST is the right disposition. SOUND.
- **D9 @mbabb T1 (double-trigger) + T2 (missing keepOpen/portal).** The collapse-veil (E3) and
  the cross-file App.vue↔ChromeDock split are real; the "fold into the `openPopup` mutex"
  fix is feasible (the mutex exists at `ChromeDock.vue:80-101` per the audit). `proof:dock-dropdown-opens`
  / `proof:dock-live` (popover-opens half) is separately, genuinely measurable (unlike the
  morph half) and born-RED today. SOUND.
- **inv-16 / "no kf fork of the spring."** Still correct after H-LD-1: the fix is *consuming*
  the published glass-ui token via a version bump, not patching glass-ui inside kf. The
  memory rule is honored, not relaxed.

---

## ONE-LINE SUMMARY

The D5-lag diagnosis is live-correct (installed `--spring-dock` peak +16.3% confirmed at
`:5173` + node_modules), but the HANDOFF disposition is a STALE SNAPSHOT: glass-ui already
PUBLISHED the retune (npm 3.5.0/3.5.1 contain `53c1b07`; published token = +4.5%), so the
dock-spring fix is no longer a glass-ui-blocked HANDOFF — it is a kf SHIP-in-H one-line bump
`^3.4.0 → ^3.5.1` (peer-compatible); the `proof:dock-morph-settled` gate as specified is not
reliably measurable (3 live attempts, no morph captured) and should be demoted to a
token-peak parse that bites on the installed +16.3% ramp and greens on the bump; and the
chronic meta-gate must reclassify the dock row from HANDOFF-watch to SHIP-the-bump.
