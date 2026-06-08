# impl-w11-gates-stage — H.W11 GATE lane: proof:stage-glass-card (I5) + proof:card-rounded-primitive (I4)

**Wave:** H.W11 · **Lane:** gates-stage (the I5 + I4 gate authoring) · **Branch:** `tranche-h-impl`
**Contract:** `docs/tranches/H/waves/H.W11.md` §Hard gate (rows `proof:stage-glass-card`,
`proof:card-rounded-primitive`) · §S1 (I5) · §S2 (I4) · `i-_PLAN.md §2 I5/I4 · §4`
**Status:** LANDED — both gates authored, GREEN on the W11 fix, BORN-RED-proven on the W10 baseline,
wired into `package.json` (scripts + `proof:all`) + `.github/workflows/ci.yml`. tsc-clean. NOT committed.

This lane is the GATE half of the stage-card register: the demo-side I5/I4 implementation LANDED in
the sibling lane (`impl-w11-stage.md`, the five `*Target.vue` swaps + design-idioms.css); THIS lane
authors the two `proof:*` that BITE on it — born-RED on W10's full-bleed / bare-cartoon-square stage,
GREEN on the W11 glass-card convergence.

---

## §1 — proof:stage-glass-card (I5 — the four-scene convergence; REVERSES W10 G8)

`scripts/proof-stage-glass-card.mjs` — BROWSER-only (the converged register is a RENDERED fact: the
computed radius + backdrop are live values; the static "no bare cartoon stage root" fact is owned by
`proof:card-rounded-primitive`, no duplication).

**The load-bearing selector (MEASURE-FIRST grounded).** The stage protagonist plate is uniquely
`[data-surface="glass"]` inside `.stage-cell`. Verified live (1440×900, FSM rested per scene) — every
scene's stage Card resolves `data-surface="glass" data-tier="resting"`, radius **16px**, backdrop
`blur(12px) saturate(1.05)`, `isCartoon=false`. This selector EXCLUDES spring's `spring-view-switch`
cartoon `rounded-full` PILL (which carries `cartoon-surface` + a 33M-px pill radius but NO
`data-surface` — it is chrome, not the subject). The probe that grounded this is in §4.

**The clause, BITING per scene** {easing, spring, sequence, motion-path}, the stage SUBJECT resolves:
1. `data-surface === "glass"` AND `data-tier === "resting"` (the standard glass register, NOT cartoon);
2. NON-zero computed `border-radius` (the `rounded-card` token — I4 for free; NOT the full-bleed div's
   0, NOT the cartoon-surface div's 0);
3. `backdrop-filter !== 'none'` (the glass plate — NOT the full-bleed div's none);
4. NOT `cartoon-surface`, AND no SQUARE bare-cartoon div survives beside it (a rounded cartoon chrome
   pill — spring's view-switch — is legitimate, caught GREEN by its own radius, NOT flagged).
- **NON-VACUITY:** EXACTLY-ONE protagonist glass Card per `.stage-cell` (zero → still full-bleed/bare
  → reds; >1 → cards nested → reds). PLUS the four-scene convergence clause: all four MUST resolve the
  SAME register (the I5/I8/I12 isomorphism — any scene left full-bleed or bare-cartoon breaks it).

**A pill subtlety the first author MUST not miss (recorded so the next gate author does not re-trip
it).** My initial clause-4 flagged ANY `cartoon-surface` beside the Card → it false-RED on spring's
legitimate `rounded-full` view-switch pill. The contract's BITE is the I4 SQUARE defect, not "any
cartoon in the stage." FIX: clause-4 flags a bare cartoon div ONLY when its computed radius is 0 (a
SQUARE bare cartoon div re-introduces the defect; a rounded chrome pill does not). The W10
`proof:scene-card-rounded` contract already owns "every cartoon surface is rounded" — the pill is its
GREEN, not my RED.

**SUPERSESSION ledger.** This is the I5 supersession of W10 `proof:scene-card-rounded`'s full-bleed
branch: that gate's "OR the stage is full-bleed" disjunct no longer holds (the full-bleed subject no
longer exists — it IS a card now). H.W8 folds the W10 gate's full-bleed disjunct OUT (per
`H.W11.md §KEPT UNCHANGED/SUPERSEDED`). `proof:scene-card-rounded` stays GREEN today (its computed
half finds the sidebar cartoon Cards rounded; the new stage Card is `surface="glass"` so it is not in
the cartoon-surface probe set — verified by the sibling stage lane).

---

## §2 — proof:card-rounded-primitive (I4 — the demo guarantee NOW + the glass-ui born-RED HANDOFF)

`scripts/proof-card-rounded-primitive.mjs` — THREE clauses at TWO altitudes (inv-16):

1. **DEMO STATIC (HARD — GREEN now).** The five stage `*Target.vue` ROOTS
   (easing/spring/starting-style/sequence/motion-path) carry NO bare-class `cartoon-surface` in LIVE
   markup. Comments are stripped first (`/* … */` + `<!-- … -->`) so a doc-comment that QUOTES the
   dropped class as backtick-fenced inline code is NOT counted as a usage — the exact convention the
   sibling stage lane + the W10 `proof:scene-card-rounded` static half both use. BITE: re-add
   `class="… cartoon-surface"` to a stage root → reds (proven, §3).
2. **DEMO COMPUTED (HARD — GREEN now, browser, settle-gated).** For each of the four stage scenes the
   `[data-surface="glass"]` Card resolves a NON-zero computed `border-radius` (16px — motion-path's
   named defect closed). Non-vacuity: the card must be found per scene.
3. **GLASS-UI HANDOFF (born-RED WITNESS — EXPECTED-RED while PENDING, FLIPS RED on ship).** Parses the
   PUBLISHED `node_modules/@mkbabb/glass-ui/dist/styles/cards.css`: does `@utility cartoon-surface`
   declare a `border-radius` (OR a rounded `cartoon-card` recipe ship)? Today: NO (confirmed — the
   utility carries only a 2px border + offset-stamp shadow + hover-lift, ZERO radius, the I4 root
   cause). So the witness HOLDS — the gate green-reports (clauses 1+2 carry the demo guarantee). The
   instant glass-ui ships the primitive radius default the witness FLIPS RED → hard-fail, the
   consume-leg DUE (bump `@mkbabb/glass-ui` + retire the witness). This mirrors
   `proof:specular-handoff`'s born-RED-witness pattern EXACTLY (green-report while PENDING, fail on the
   upstream ship — inv-16: the demo CONSUMES glass-ui recipes, it does not re-author `cards.css`).

The demo halves (1+2) are the LOAD-BEARING assertions — a demo regression reds the gate first; the
witness is the durable-fix LEDGER (paired with the inv-16 HANDOFF the sibling stage lane records at
`impl-w11-stage.md §inv-16 HANDOFF`).

---

## §3 — BORN-RED PROOF (the gates BITE; the §Mandate no-vacuity bar)

Reverted `MotionPathTarget.vue` to its EXACT W10 baseline (the bare `<div class="glass-resting
cartoon-surface w-full flex-1 …">`, `</div>` close), rebuilt `dist/gh-pages`, ran both gates, then
restored byte-identically (md5 `6ef5328e90a02f7ef9c136e13d584531`, re-verified):

| Gate | W10 baseline (born-RED) | W11 fix (GREEN) |
|------|--------------------------|------------------|
| `proof:stage-glass-card` | **FAIL exit 1** — motion-path: "the stage glass Card never mounted (glassCard:false) … FULL-BLEED or BARE-CARTOON" | **PASS exit 0** — all four resolve glass/resting · 16px · glass backdrop · NOT cartoon + the four-scene convergence clause |
| `proof:card-rounded-primitive` | **FAIL exit 1** — static: "MotionPathTarget.vue carries a bare-class `cartoon-surface`" + computed: "motion-path — the stage glass Card never mounted" | **PASS exit 0** — static (zero bare cartoon roots) + computed (4×16px) + HANDOFF PENDING (witness held) |

The born-RED bite SURVIVES the resilience hardening (§5) — the re-settle does NOT mask a real defect
(motion-path's missing Card never appears across BOTH probe attempts → still reds). No gate passes
vacuously: each asserts an EXACT live measurement (the converged glass register's data-surface +
computed radius + backdrop) or static fact (the bare-cartoon stage root) the lane captured.

---

## §4 — MEASURE-FIRST: the live grounding probe (1440×900, FSM rested per scene)

Before authoring, probed the live built dist for the stage card DOM in each scene (the basis for the
`[data-surface="glass"]` selector choice):

| Scene | data-surface | data-tier | radius | backdrop-filter | isCartoon |
|-------|-------------|-----------|--------|------------------|-----------|
| easing | glass | resting | 16px | blur(12px) saturate(1.05) | false |
| spring | glass | resting | 16px | blur(12px) saturate(1.05) | false |
| sequence | glass | resting | 16px | blur(12px) saturate(1.05) | false |
| motion-path | glass | resting | 16px | blur(12px) saturate(1.05) | false |

Spring ALSO carries a second `glass-resting cartoon-surface` element — the `spring-view-switch`
`rounded-full` PILL (radius 33554400px, NO `data-surface`). This is what forced the precise
`[data-surface="glass"]` selector + the SQUARE-only clause-4 (a pill is rounded chrome, not the I4
defect). The probe matched the sibling stage lane's measured table (`impl-w11-stage.md`) exactly.

---

## §5 — FLAKE HARDENING (a settle race, not a defect — eliminated)

The four-scene loop occasionally false-RED on **spring** (the heaviest scene — the view-switch + the
spring rail) when the FSM-rest poll timed out silently and the 8s `waitStageCard` window caught the
page mid-transition under concurrent-browser CPU contention. Confirmed a flake: spring passed 3/3 in
isolation, false-RED ~1/several under the two-gate concurrent load.

FIX (isomorphic across BOTH gates — DRY): `waitStageCard(page, scene, VW, VH)` now probes ONCE, and
on absence RE-SETTLES (re-asserts the hash + re-polls the FSM rest) and probes AGAIN before reporting
absent. A true full-bleed/bare-cartoon stage still reds (the Card never appears across BOTH attempts —
proven in §3); a slow mount no longer false-REDs. Post-fix: **10/10 GREEN** sequential (5 runs × 2
gates) + **3/3 GREEN** under concurrent-browser contention (the exact original flake trigger). No
weakening of the bite (§3 confirms the born-RED still fires WITH the re-settle in place).

---

## §6 — WIRING + RECONCILE

**package.json** — both scripts defined beside the related stage gates; both added to `proof:all`
(after `proof:scene-card-rounded`, before `proof:stage-within-docks` — grouped with the stage/rounding
cohort):
```
"proof:stage-glass-card": "node scripts/proof-stage-glass-card.mjs",
"proof:card-rounded-primitive": "node scripts/proof-card-rounded-primitive.mjs",
```

**.github/workflows/ci.yml** — both steps wired after `proof:scene-card-rounded` (each with the
full BITE-narrating comment + `KF_REQUIRE_BROWSER: "1"`, the harness idiom — a playwright-absent skip
becomes a hard CI fail so the rendered facts never green-report un-exercised). Validated: `ci.yml` is
valid YAML; `package.json` is valid JSON.

**Reconcile (what stayed GREEN / untouched):**
- **W1 FSM** — UNTOUCHED. Both gates settle-gate ON it (the `MACHINE_KEY` `activeScene` rest poll,
  mirroring `proof:scene-card-rounded` / `proof:easing-stage-is-ball`); they do not edit the reducer.
- **W9 / W10** — `proof:scene-card-rounded` stays GREEN (the I5 supersession folds its full-bleed
  disjunct OUT only in H.W8; today its cartoon-sidebar computed half still passes). `proof:scene-parity`
  / `proof:easing-stage-is-ball` stay GREEN (the stage Card lives INSIDE `.stage-cell`, so the ball is
  still a `.stage-cell` descendant — the sibling stage lane verified this).
- **Engine (`src/animation`)** — FENCED (inv ζ). 100% gate/demo-side.
- **Sibling lanes** — file-disjoint: the DFA lane (`proof:scene-control-dfa` / `proof:scene-transition-perf`)
  and the I1/bezier lane (`proof:label-subgrid` / `proof:bezier-single-card` / `proof:bezier-grown`)
  authored their own scripts + ci.yml steps concurrently; my two `proof:all` + ci.yml insertions are
  positioned in the stage cohort and do not overlap theirs (verified the merged ci.yml is valid YAML
  with both my steps at lines 576-598 after the concurrent edits).

---

## §7 — FILE FOOTPRINT (lane gates-stage — file-disjoint)

NEW:
- `scripts/proof-stage-glass-card.mjs` — the I5 four-scene glass-card convergence gate (browser).
- `scripts/proof-card-rounded-primitive.mjs` — the I4 demo-guarantee + glass-ui born-RED HANDOFF
  witness (static + browser).

MODIFIED:
- `package.json` — the two new proof scripts + their `proof:all` insertion.
- `.github/workflows/ci.yml` — the two new browser-gated steps.

tsc-clean (`npm run check` / `tsc --noEmit` exit 0) after the lane. NOT touched: the engine
(`src/animation` — FENCED, inv ζ); the W1 reducer; the demo `*Target.vue` / design-idioms.css (the
sibling stage lane owns them — restored byte-identical after the born-RED proof); the DFA / I1 / bezier
lane files; glass-ui (inv-16 — the radius primitive is the born-RED-paired HANDOFF, witnessed not
patched).
