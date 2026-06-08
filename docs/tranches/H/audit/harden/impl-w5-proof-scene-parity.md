# impl-w5-proof-scene-parity — the `proof:scene-parity` gate-authoring lane

**Lane:** H.W5 §Hard gate — `proof:scene-parity` (the pertinence MERGE + the
per-mode interactivity floor). RE-authored after the prior workflow's gate lanes
were cut by a session limit before the file persisted. Grounded against the
landed W5 source (NOT re-implemented — the impl already landed + tsc-clean).
NO git commit (the lead commits).

## What the gate asserts (7 clauses, each BITES — born-RED on a revert)

`scripts/proof-scene-parity.mjs` — a STATIC half (always runs) + a BROWSER half
(settle-gated on the H.W1 FSM resting, `KF_REQUIRE_BROWSER` hard-fails a
playwright-absent skip). Mirrors `proof-easing-canvas-bounded.mjs` /
`proof-scene-machine-irrefragable.mjs` (serveDist + Playwright + the FSM-settle
plumbing). Scene switches driven IN-PAGE via `location.hash` — the EXACT
reconcile fixed point the in-app Scene combobox funnels through (switchScene →
runSceneSwitch → NAVIGATE → echo-guarded writer), waiting for the machine's
`activeScene` to rest on the target.

### STATIC (the membership + fold property)
1. **no starting-style ROUTE** — `router.ts` declares no `/starting-style` path
   and no `name:"starting-style"` (comment-blanked).
2. **no starting-style DESCRIPTOR** — `scenes.ts` declares no
   `id:"starting-style"` (comment-blanked).
3. **surviving new-mode set = {spring, sequence, motion-path}** — structural
   MEMBERSHIP, NOT a magic integer (WV-W5-LOW-2): the three are present AND no
   merged-away mode (`starting-style`/`discrete`) resurfaces as a descriptor.
4. **springLinearStops() — EXACTLY ONE call-site** — the spring-local 2→1 fold.
   Counts the LITERAL `springLinearStops(` CALL; for `.vue` files it searches
   ONLY the `<script>` block (a `<span>springLinearStops() → CSS</span>` caption
   + an `eased by springLinearStops()` label are TEMPLATE TEXT prose, not calls)
   and `.ts` files whole; TS/JS + HTML + CSS comments blanked. Born-RED at 2
   (SpringSidebar.vue + StartingStyleTarget.vue); GREEN at 1
   (`useSpringLinearStops.ts`). Does NOT gate `springTimingFunction`
   (6×-surfaced, intentional — WV-W5-HIGH-1).

### BROWSER (≥1 pointer-interactive affordance per surviving mode)
5. **proof:motionpath-drag** — settle on motion-path; project the guide path's
   50%-length point to client coords, drag the traveller there → computed
   `offset-distance` AND the slider `aria-valuenow` land ≈50% (±12 band for the
   self-crossing loop's nearest-point search). Landed reads aria 50% /
   `offset-distance 50.3939%`.
6. **proof:square-drag** — settle on square; pointerdown+move on `.demo-box`
   mutates the per-axis spring `.target` (visible via `aria-valuetext`, away
   from rest `x 0.00, y 0.00`) AND the spring converges — the gate HOLDS the
   drag and polls the box's INLINE `style.transform` (the spring loop's
   per-frame write; getComputedStyle can catch the loop mid-frame) over a ~700ms
   window, requiring ≥2 distinct non-rest transforms (a chase, not a one-shot
   paint). Landed reads `x 0.00, y 0.00 → x 0.82, y 0.64` + a converging matrix.
7. **proof:easing-curve-onstage** (the three-name wiring, WV-W5-HIGH-2) — settle
   on easing (default curve `ease` ∈ NAMED_EASING_BEZIER + viewMode `singular`
   → the editable `EasingCurveCanvas` renders ON STAGE, `.easing-stage-curve`).
   Asserts `[editable]` (the `.control-point.handle` + `.bezier-path` render),
   then drags `handle[data-index="0"]` and asserts the handle `cx/cy` AND the
   rendered `.bezier-path d` CHANGED. Both re-derive from `bezierControlPoints`,
   so a change proves: emit `update:bezierPoints` (camelCase) → prop
   `bezierPoints` → demo ref `bezierControlPoints` — a mis-named handler silently
   no-ops and the ref never changes.

## Verification (every clause BITES)

- **GREEN on the landed impl** — all 7 clauses pass; `KF_REQUIRE_BROWSER=1
  node scripts/proof-scene-parity.mjs` → PASS (exit 0).
- **born-RED on reverts** (each restored after):
  - re-add a starting-style route + descriptor → clauses 1+2+3 RED.
  - inject a 2nd LITERAL `springLinearStops(` call in SpringSidebar `<script>`
    → clause 4 RED at 2 call-sites.
  - revert the traveller `pointer-events` (inert) → motionpath-drag RED
    (aria 0%, offset-distance 0px).
  - neuter the box `@pointerdown` → square-drag RED (target unmoved, 0 non-rest
    transforms).
  - force the on-stage canvas `v-if="false"` (curve imprisoned in sidebar) →
    easing-curve-onstage RED (`.easing-stage-curve` absent).

## Gate-integration fix to the landed source (ONE, CSS-only)

`demo/motion-path/MotionPathTarget.vue` — added `pointer-events: auto` to
`.mp-traveller`. The shared `.progress-ball` design-idiom is
`pointer-events: none` (a decorative scrubber ball riding a rail). The S4a
traveller is the DRAG affordance (`role="slider"`, `@pointerdown`,
`cursor: grab`, `touch-action: none`) but it inherited the idiom's
`pointer-events: none` and never re-enabled it — so the wired handler could
NEVER receive a pointer (`elementFromPoint` over the traveller returned
`.mp-stage`; the drag was dead in the live demo, not just under the gate). This
is the "obvious gate-integration break" the contract sanctions fixing. After the
fix the traveller drag works live and `proof:motionpath-drag` greens. No other
landed source touched.

## Wiring

- **package.json** — `"proof:scene-parity": "node scripts/proof-scene-parity.mjs"`
  added (beside `proof:scene-icons`) AND chained into `proof:all` (after
  `proof:scene-icons`).
- **.github/workflows/ci.yml** — a `proof:scene-parity` step in the
  `demo-smoke` job (after `proof:scene-icons`) with `KF_REQUIRE_BROWSER: "1"`.
- `proof:ci-coverage` GREEN — all 64 proof:* gates invoked in CI (the coverage
  clause confirms scene-parity is wired); `check:lib` tsc-clean; `npm run
  gh-pages` builds green; package.json valid JSON; ci.yml valid YAML.

## Notes for sibling/close lanes

- The gate serves the BUILT `dist/gh-pages/` — rebuild (`npm run gh-pages`)
  before running the browser half; the dist was rebuilt in the restored state
  after the bite verifications.
- The motion-path `pointer-events: auto` fix is load-bearing for BOTH this gate
  AND the live S4a feature — do not revert it.
