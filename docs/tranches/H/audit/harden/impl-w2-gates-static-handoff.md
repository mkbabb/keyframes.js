# impl-w2-gates-static-handoff — H.W2 the static + HANDOFF gate lane

The two gates this lane owns, both authored, wired (package.json + ci.yml), and
verified to BITE per H.W2.md §Hard gate. NO git commit — edits left in tree.
tsc-clean (`npx tsc --noEmit` → 0). `proof:ci-coverage` → PASS (all 49 proof:*
gates, incl. these two, invoked in CI).

---

## proof:no-dup-utility (S4 + S1 + S6 — the no-legacy static lock)

`scripts/proof-no-dup-utility.mjs` · `npm run proof:no-dup-utility` · GREEN today
(the implement lane landed the net-deletion).

Three clauses, each verified to bite (temp-fixture probes, reverted):

1. **NO DEMO `.scale-on-hover` RULE** (S4 / A3). Sweeps demo `.css` (comment-
   blanked, `dist/`+`node_modules/` skipped) for a STRICT rule-open anchor
   `/\.scale-on-hover\b[^{}]*\{/`. This is the §11 vacuous-pass FIX: `proof:idioms`
   uses a LOOSE `/\.scale-on-hover\b/` that the DELETION-COMMENT text satisfies (a
   green-but-no-op pass that would red if the comment were reworded — the two gates
   are in direct contradiction and THIS strict `{`-anchor is the correct one).
   VERIFIED: design-idioms.css has 6 comment mentions of `scale-on-hover` and the
   clause still PASSES (it ignores them); appending `.scale-on-hover { … }` →
   EXIT 1.

2. **NO `<Card>` CARRIES `glass-card`** (S1 / CS-3). `grep glass-card demo | grep
   "<Card"` = 0. Walks each root `<Card` opening tag (NOT `<CardContent>`/
   `<CardHeader>`/`<CardTitle>`/`<CardFooter>`/`<CardDescription>`) through its `>`
   and reds if `glass-card` is in the attribute span. VERIFIED: adding
   `glass-card` to RibbonBar's `<Card>` → EXIT 1.

3. **`glass-card` RESOLVES ONLY TO THE ENUMERATED INTENTIONAL-STATIC SET** (S6 /
   HD-4). Every `glass-card` class TOKEN in demo SOURCE (`.vue`+`.css`,
   comment-blanked) must be in `INTENTIONAL_STATIC` — today the EMPTY set (S6
   adopted `glass-resting cartoon-surface` for all 7 bare-div stages, so the
   survivor set is cleaner than a NAMED-exception list: zero survivors). Catches
   the bare-div stages clause 2 misses. VERIFIED: a re-introduced bare
   `<div class="glass-card">` stage → EXIT 1. (A future option-(b) NAMED static
   stage is enumerated as `path:line` in `INTENTIONAL_STATIC` — never a silent
   survivor.)

SCOPE: the per-sub-demo build dirs (`demo/<app>/dist/…`) inline glass-ui's
compiled `.scale-on-hover`+`.glass-card` — those are NOT demo source; the sweep's
`SKIP_DIR = {dist, node_modules, .git}` excludes them (mirrors proof:idioms), so a
built artifact never false-reds a source-shape clause.

---

## proof:specular-handoff (S5 — the glass-ui-owned specular HANDOFFs, BORN-RED)

`scripts/proof-specular-handoff.mjs` · `npm run proof:specular-handoff` ·
GREEN-REPORTING born-RED witness today (inv-16: NO glass-ui patch in kf — it
WITNESSES the absent asks).

The two glass-ui-owned asks it polices (RECORDED, paired with the born-RED gate
per the chronic-closure discipline — H.W8):

- **(i) the Card specular SEAM** — `<Card surface="glass">` bolts
  `glass-specular-track` (`CardFooter-C390imy7.js:37`, the literal
  `surface === "glass" && "glass-specular-track"` pairing the gate parses) with NO
  pointer wire. Ask: wire-or-omit (omit the track on the bare-glass default, OR
  self-write `--mouse-*` in the CSS) AND a calmer default — rest ≤ 0.25, hover ≤
  0.4, radius ≤ 40%.
- **(ii) the dock-icon specular** — `dock-icon-button` hard-codes the track
  (`dock.js`); the dock DOES wire `--mouse-*` (`dock.js:576-577`), so it is a
  tuning ask. It RIDES `proof:dock-morph-settled` (H.W8 — BLK-3 CANONICAL name,
  NOT the dangling `proof:dock-live`); the gate records the cross-link so a column
  migration cannot silently close it.

THE BORN-RED PATTERN (mirrors `proof:group-snapshot-identity`'s `it.fails`
witness): the gate reads the INSTALLED `@mkbabb/glass-ui` (the source of truth for
what glass-ui ships) — today `glass-specular-track.css` rests at
`--specular-intensity: 0.35`, hovers 0.6, radial reach 55%, and the Card emits the
track UNWIRED. The consume-leg readiness condition (`seamWiredOrOmitted &&
defaultCalmed`) is FALSE → the EXPECTED born-RED state → the gate GREEN-REPORTS
(exit 0; the suite stays green; inv-27: NOT perpetually-red). The instant glass-ui
publishes the calm default + the wire-or-omit seam, the condition flips TRUE and
the gate HARD-FAILS (exit 1) — the consume-leg signal to bump glass-ui, delete the
now-redundant `.cartoon-specular::before` intensity override, and retire the
witness.

VERIFIED both legs: (a) born-RED held green-reporting against installed 3.4.0
(EXIT 0, full witness printed: rest=0.35/hover=0.6/radius=55%, seam unwired);
(b) simulating glass-ui shipping the calm default (rest 0.22, hover 0.4, radius
38%, self-wired `--mouse-x:`) → EXIT 1 "consume-leg DUE" → restored → EXIT 0.

The HANDOFF cannot be closed by a doc/column migration — only by glass-ui
publishing. The gate environment-faults (exit 2) if glass-ui's specular CSS is
absent (`npm ci` not run) so it is never silently vacuous.

---

## Wiring

- `package.json`: `proof:no-dup-utility` + `proof:specular-handoff` added (beside
  the H.W static gates) AND chained into `proof:all` (after `proof:single-writer`,
  before `proof:dock-popover-opens`).
- `ci.yml`: both invoked in the `demo-smoke` job (after `npm ci` installs the
  registry glass-ui that `proof:specular-handoff` reads), beside `proof:single-
  writer` / `proof:idioms`. `proof:ci-coverage` → PASS (49 gates covered).

## Cross-lane couplings (RECORDED, not owned here)

- **§11 vacuous-pass for the GATES lane / H.W8**: `proof:idioms`'s
  `.scale-on-hover` clause (`proof-idioms.mjs:153`, loose `/\.scale-on-hover\b/`)
  now passes ONLY because it matches the DELETION-COMMENT text in design-idioms.css
  — a vacuous pass that reds if the comment is reworded. `proof:no-dup-utility`'s
  strict `{`-anchor (clause 1) is the correct invariant and is in DIRECT
  contradiction with the loose clause. ASK (H.W8): retire/invert the `proof:idioms`
  `.scale-on-hover` clause; keep its `--scale-hover` token clause (still
  demo-owned). I did NOT edit `proof:idioms` (out of lane) — recorded for H.W8.
- **proof:specular-calm** (S3, a DIFFERENT lane's gate) owns the LIVE assertion
  that the retained/composite `::before` resolves rest ≤ 0.25 / hover ≤ 0.4;
  `proof:specular-handoff` only records (as a sanity note) that the kf consume-side
  recipe is staged (the `.cartoon-specular::before` projection of 0.22/0.4), so the
  HANDOFF witness is not read in isolation.
- **proof:cartoon-specular-coexist** + **proof:cartoon-is-panel-depth** +
  **proof:no-orphan-specular** are the OTHER (browser/computed-style) lane's gates
  — present in tree (`scripts/proof-cartoon-specular-coexist.mjs`) but NOT this
  lane's charge.
