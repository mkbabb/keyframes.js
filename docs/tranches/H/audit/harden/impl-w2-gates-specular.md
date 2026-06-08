# impl-w2-gates-specular — H.W2 the D14-composite gate lane

LANE = `proof:cartoon-specular-coexist` (WV-W2-HIGH-3, the D14 composite) +
`proof:specular-calm` (WV-W2-MED-1, the "refined" half of D14). Both BROWSER-
gated, both wired (package.json + ci.yml), both NOTED here. NO git commit; edits
left in tree; tsc-clean.

The two gates that lock the user's LITERAL D14 ask ("the specular radial item
needs to be refined for hovers, totally") so it cannot be re-papered: the
kept-glass bezier panel must have cartoon DEPTH **and** a refined, **tracked**
catch-light **together**, and that catch-light must rest CALM. Without these, a
green `proof:cartoon-is-panel-depth` (sibling lane) would stand over an unmet ask
(the chronic-closure failure the spine forbids — `_SYNTHESIS §2.2`, H.W2.md §Hard
gate `proof:cartoon-specular-coexist`/`proof:specular-calm`).

---

## §1 — the two NEW gates

| gate | file | bite | mode |
|---|---|---|---|
| `proof:cartoon-specular-coexist` | `scripts/proof-cartoon-specular-coexist.mjs` | a kept-glass panel composes cartoon depth + a tracked specular | static anchor + browser bite |
| `proof:specular-calm` | `scripts/proof-specular-calm.mjs` | retained/composite `::before` rest ≤ 0.25 / hover ≤ 0.4 | browser bite + born-RED witness |

Both mirror the canonical browser-gate plumbing of `scripts/proof-stage-not-
clipped.mjs` (serveDist over `dist/gh-pages/` + Playwright resolved from
`playwright-core`/`@playwright/test` + the `KF_REQUIRE_BROWSER` skip-or-fail: a
playwright-absent skip becomes a HARD fail under `KF_REQUIRE_BROWSER=1`, so a SHIP
is never green-reported un-exercised; locally it skips gracefully).

---

## §2 — `proof:cartoon-specular-coexist` (S2-COMPOSITE, WV-W2-HIGH-3)

The contract bite: "≥1 kept-glass panel resolves BOTH `--shadow-cartoon-md` AND a
`::before` `circle at <x≠50%>` after a synthesized pointermove."

**Two clauses** — a static source anchor for NON-VACUITY + the storm-robust
computed `::before` browser bite:

- **CLAUSE A (static, non-vacuity)** — a REAL kept-glass panel consumes the
  recipe, not just a synthetic div. Asserts `TimingFunctionPanel.vue`'s cubic-
  bézier Card carries `surface="cartoon"` AND `cartoon-specular` AND
  `glass-specular-track` AND wires `useSpecularPointer` from
  `@composables/useSpecularPointer`; and `design-idioms.css` DEFINES the
  `.cartoon-specular` recipe (`@apply cartoon-surface` self-standing depth + the
  `::before` rest **and** `:hover::before` `--specular-intensity` projection
  rules). A browser clause over a synthetic probe that no real panel consumes
  would be vacuous — this clause forbids it. (This is the source-anchor the
  `proof:specular-calm` browser clause composes WITH — coexist proves a real panel
  adopts the recipe; calm proves the recipe's intensity is refined.)

- **CLAUSE B (browser, the bite)** — mount a `.cartoon-specular
  glass-specular-track` probe; synthesize the pointermove by writing `--mouse-x:
  30%` / `--mouse-y: 70%` (the EXACT `useSpecularPointer` seam — the composable
  writes those percentages on `pointermove`, glass-specular-track.css:19); after
  the typed-`@property` `--specular-x`/`-y` transition (150ms) SETTLES, assert the
  `::before` resolves:
  1. **cartoon DEPTH** — box-shadow from `--shadow-cartoon-md`, discriminated by
     its `-4px 3px 1px` offset signature, distinct from `--shadow-cartoon-lg`'s
     `-6px 4px` AND the glass tier's `shadow-card` (a blurred `0 4px 16px`, no
     negative-x offset). If the recipe's `@apply cartoon-surface` drops, the box
     falls to `shadow-card` → reds.
  2. **tracked catch-light** — `--specular-x: 30%` (≠50%) on the pseudo (the
     transition-immune PRIMARY read) AND `background: radial-gradient(circle at
     30% 70% …)` (the contract's stated `circle at <x≠50%>` form, read after
     settle). DUAL read for storm-robustness: the numeric `--specular-x` is
     immune to the mid-transition serialization fold (see §4); the `circle at`
     regex confirms the contract's literal form.
  - **NON-VACUITY guard** — a CENTERED probe (no mouse write) resolves
    `--specular-x: 50%` + a BARE `circle` (no `at`); proving the tracked/centered
    discrimination is a real signal, so a "tracked" pass cannot be a
    serialization artifact.

**Bite proven (live, on `dist/gh-pages/`):** neutering the built `.cartoon-
specular{box-shadow:var(--shadow-cartoon-md)}` → `var(--shadow-card)` reds CLAUSE
B(1) (observed box-shadow fell to `… 0px 4px 16px` — the blurred glass plate),
while B(2) tracked stays GREEN (the pointer seam is independent of the depth) —
the EXACT discrimination intended. GREEN on the implemented tree.

---

## §3 — `proof:specular-calm` (S3, WV-W2-MED-1, the "refined" half, kf-side)

The contract bite: "every retained/composite `::before` resolves rest
`--specular-intensity` ≤ 0.25, hover ≤ 0.4 — RED at live 0.35/0.6."

**One browser clause + a born-RED witness:**

- **CLAUSE (the bite)** — mount the `.cartoon-specular glass-specular-track` probe;
  assert the `::before` rest `opacity ≤ 0.25` (the recipe projects
  `--specular-rest: 0.22`) and `:hover opacity ≤ 0.4` (projects `--specular-hover:
  0.4`). Hover is driven by a REAL `:hover` (Playwright `page.hover()` over the
  probe + a 450ms settle for the 240ms opacity transition), so the
  `:hover::before` cascade actually fires — NOT a synthetic class.
- **WITNESS (born-RED today, the bite proof)** — a BARE `.glass-specular-track`
  probe (no recipe) resolves glass-ui's HOT default (rest **0.35** > 0.25, hover
  **0.6** > 0.4 — measured live). This proves NON-VACUITY: the unrefined live
  surface OVERSHOOTS the calm ceiling, and the demo greens ONLY because the
  `.cartoon-specular::before` projection overrides the pseudo by source order
  (the demo CSS is unlayered; glass-ui's is `@layer components` — unlayered wins).
  The witness is EVIDENCE, not a gated subject: it does NOT fail the gate
  (glass-ui's default is glass-ui's to ship — the S5 HANDOFF), but if a future
  glass-ui ships a calm bare default (≤ 0.25), the gate prints a loud `⚠` so a
  reader knows the born-RED evidence went quiet (the kf composite clause still
  gates the demo's own tune).

**Bite proven (live):** bumping the built `.cartoon-specular:before{--specular-
intensity:var(--specular-rest,.22)}` fallback to `.35` and the hover to `.6` reds
both clauses (rest 0.35 > 0.25, hover 0.6 > 0.4 — the unrefined live values). GREEN
on the implemented tree (rest 0.22, hover 0.4).

---

## §4 — the storm-robust read (WV-W2-LOW-3, the serialization gotcha I hit)

The COMPUTED `::before` check is PRIMARY (no screenshot). The synthetic probe is
deterministic — it does NOT depend on the live FSM surfacing the bezier panel into
the DOM. **WHY a probe and not the live bezier Card:** the real composite Card only
mounts when `timingFunction === "cubic-bezier"` AND the detail panel is not
dismissed — which needs the controls panel OPEN + the easing edit-icon CLICKED
(multi-step UI choreography flaky under the route/dock state storm). I verified the
real Card is absent until that choreography (live: `.cartoon-specular` count 0 on
load), so anchoring the BITE on it would be flaky. Instead CLAUSE A (static source
anchor) binds the probe to the REAL consuming panel, and the browser probe gives
the deterministic measurement. This is exactly the implement-note §8 method (the
"synthetic composite probe").

**The serialization fold (LOCKED as the dual read).** When `--mouse-x`/`-y` are
written, the `::before` `background` re-serializes through the registered
`@property` `--specular-x`/`-y`. Read MID-transition (the 150ms `--specular-x`
transition) Chromium serializes the gradient as a BARE `circle` (no `at`) even
though the position is non-default; read AFTER settle (~450ms) it serializes as
`circle at 30% 70%`. So the gate (a) waits 450ms before the `circle at` regex read,
and (b) reads the numeric `--specular-x` off the pseudo as the transition-immune
PRIMARY (50% centered → 30% tracked, exact, no regex). The contract's `circle at
<x≠50%>` is honored as the secondary form. This is the storm-hardening WV-W2-LOW-3
asks for, learned the hard way.

---

## §5 — wiring (proof:ci-coverage GREEN)

- `package.json`: added `"proof:cartoon-specular-coexist"` + `"proof:specular-
  calm"` (script entries) AND chained both into `proof:all` (after
  `proof:specular-handoff`, the H.W2 cluster).
- `.github/workflows/ci.yml`: both wired into the `demo-smoke` job (after `npm run
  gh-pages` — they need the built demo CSS), each with `KF_REQUIRE_BROWSER: "1"`,
  placed right after `proof:specular-handoff` (the H.W2 specular cluster).
- `proof:ci-coverage` PASS: "all 51 proof:* gates are invoked in CI" — both new
  gates recognized; no coverage hole.

---

## §6 — verification summary

- `proof:cartoon-specular-coexist` — GREEN (CLAUSE A 3/3 + CLAUSE B depth/tracked/
  non-vacuity 3/3). BITE proven: neuter the cartoon depth → B(1) reds.
- `proof:specular-calm` — GREEN (rest 0.22 ≤ 0.25, hover 0.4 ≤ 0.4; witness bare
  default 0.35/0.6 overshoots). BITE proven: bump the tune → both clauses red.
- skip-or-fail plumbing verified BOTH directions (no-require → graceful skip of the
  browser half; require + playwright-absent → hard fail).
- `proof:ci-coverage` GREEN. `npx tsc --noEmit` clean (exit 0).
- NO git commit. The temporary `dist/gh-pages` CSS mutation used for the bite proof
  was RESTORED from backup (gates reconfirmed GREEN after restore).

---

## §7 — interfaces / dependencies on sibling lanes

- These gates assume the IMPLEMENT lane's tree (the `.cartoon-specular` recipe in
  `design-idioms.css`, the composite on `TimingFunctionPanel.vue`'s bezier Card,
  `useSpecularPointer.ts`). All present + GREEN.
- `proof:cartoon-is-panel-depth` (the sibling depth gate) is authored
  (`scripts/proof-cartoon-is-panel-depth.mjs` present) but NOT yet wired into
  package.json/ci.yml at the time of this lane — its wiring is another lane's
  charge (do not clobber). My two gates are the D14-COMPOSITE pair; the depth gate
  is the per-panel cartoon assertion. They compose: depth proves the panels carry
  cartoon; coexist proves the ONE kept-glass panel ALSO carries the tracked
  catch-light; calm proves it rests refined.
- `proof:specular-handoff` (S5 born-RED HANDOFF) is the glass-ui-owned Card-default
  + dock specular ask — sibling-authored + wired. My `proof:specular-calm` is the
  kf-SIDE pairing (the demo can refine TODAY), distinct from the handoff (the
  upstream default).
