# impl-w2-verify — H.W2 RESTORE THE DESIGN LANGUAGE (the VERIFY lane)

The build/test/gate verification of the H.W2 IMPL + GATES lanes. Branch
`tranche-h-impl`. Edits left in tree (NO git commit). Every command run verbatim
below; every result GREEN or born-RED-as-designed. No RED-that-should-be-GREEN.

---

## §Result table (verbatim)

| # | Check | Command | Result |
|---|---|---|---|
| 1 | tsc | `npx tsc --noEmit` | **PASS — 0 errors** (`TSC_EXIT=0`) |
| 2 | unit/integration tests | `npm test -- --run` | **PASS — 66 files, 666 passed \| 2 expected-fail (668)**; 0 size-ceiling failures |
| 3 | demo build | `npm run gh-pages` | **PASS — built in 1.19s** (only pre-existing rolldown PURE-annotation / chunk-size warnings, no errors) |
| 4a | gate `proof:cartoon-is-panel-depth` | `KF_REQUIRE_BROWSER=1 npm run proof:cartoon-is-panel-depth` | **GREEN** — source-shape (5/5 named Cards cartoon, no glass-card/transition-shadow) + computed: 7/7 cartoon Cards resolve `--shadow-cartoon-md` at rest (≥5 floor), 5 grow to `--shadow-cartoon-lg` on hover |
| 4b | gate `proof:no-orphan-specular` | `KF_REQUIRE_BROWSER=1 npm run proof:no-orphan-specular` | **GREEN** — 14 kf-owned Cards resolve cartoon(13)/composite(1); 0 manual glass-card; 0 orphan track on any Card; 8 hovered panels paint NO centred bloom. 15 `<Button>`/dock tracks RECORDED as S5 HANDOFF residue (inv-16) |
| 4c | gate `proof:cartoon-specular-coexist` | `KF_REQUIRE_BROWSER=1 npm run proof:cartoon-specular-coexist` | **GREEN** — bezier Card composes `--shadow-cartoon-md` AND a tracked `::before` (`--specular-x: 30% ≠ 50%`, `circle at 30% 70%`) after a synthesized pointermove; centred-floor non-vacuity probe holds |
| 4d | gate `proof:specular-calm` | `KF_REQUIRE_BROWSER=1 npm run proof:specular-calm` | **GREEN** — composite `::before` rest 0.22 (≤0.25), hover 0.4 (≤0.4); born-RED witness: bare track default 0.35/0.6 overshoots (gate bites the real defect) |
| 4e | gate `proof:no-dup-utility` | `npm run proof:no-dup-utility` | **GREEN** — 0 demo `.scale-on-hover` rule; 0 `<Card>` glass-card; glass-card resolves to the empty enumerated-static set |
| 4f | gate `proof:specular-handoff` | `npm run proof:specular-handoff` | **BORN-RED witness HELD (exit 0, EXPECTED)** — glass-ui Card-default still 0.35/0.6/55% unwired; the witness correctly reports the HANDOFF PENDING and FLIPS RED (exit 1) the instant glass-ui ships the calm default. Confirmed reds correctly as the HANDOFF witness. |
| 5 | gate `proof:ci-coverage` | `npm run proof:ci-coverage` | **GREEN** — all 53 proof:* gates invoked in CI (the 6 new W2 gates wired); version-literal / registry / concurrency hygiene green |
| 6a | NO-regression `proof:demo-console-clean` | `KF_REQUIRE_BROWSER=1 npm run proof:demo-console-clean` | **GREEN** — H-A1 serializeEasing crash dead on /#/amiga + /#/easing |
| 6b | NO-regression `proof:scene-machine-irrefragable` | `KF_REQUIRE_BROWSER=1 npm run proof:scene-machine-irrefragable` | **GREEN** — 6/6 ordered A→B→A cells identity-preserving; deep-link wins; deterministic restore |
| 6c | NO-regression `proof:demo-shell-grid` | `KF_REQUIRE_BROWSER=1 npm run proof:demo-shell-grid` | **GREEN** — one rail·stage·rail grid, one `--rail-width`, no two-track/subgrid/col-span legacy |
| 6d | NO-regression `proof:single-column-pack` | `KF_REQUIRE_BROWSER=1 npm run proof:single-column-pack` | **GREEN** — 8 leaf rows share one edge (x=77) + one width (304px, Δ=0px) |

---

## §BITE proof (the gate genuinely fails on a stashed flip)

Mutated `RibbonBar.vue:3` `surface="cartoon"` → `surface="glass"` (the pre-W2
state), ran `proof:cartoon-is-panel-depth`:

```
✗ source-shape — RibbonBar.vue: the panel <Card> does NOT carry surface="cartoon"
  (the S1 flip is the gestalt move — got `<Card surface="glass" class="overflow-visible">`)
proof:cartoon-is-panel-depth — FAIL (1): … the H.W2 S1 cartoon-depth restoration is incomplete.
```

The gate REDS (exit 1) on the stashed flip — it bites. RESTORED from backup;
`git diff` shows only the legitimate W2 flip, no `.bak` left in tree.

---

## §Neutralizer + inv-16 audit (grep the diff)

- **NO `!important` / `display:none` / `visibility:hidden`** in any added diff line.
  The radial dies at SOURCE (the surface map stops emitting `glass-specular-track`
  on the cartoon flip), NOT via a CSS neutralizer. (The only `display:none`/
  `!important` string occurrences are in `proof-no-orphan-specular.mjs` COMMENT/LOG
  text explicitly asserting that NO such neutralizer was used — not neutralizer code.)
- **NO glass-ui source edit** (inv-16) — `git diff --name-only` + `git status`
  carry ZERO `glass-ui` path; the glass-ui items are HANDOFFs, consumed not authored.

---

## §Footprint integrity (the full surface map, verified)

- `grep '<Card' demo --include='*.vue' | grep -v 'surface='` → empty: every opening
  `<Card>` carries an explicit `surface=` (no default-glass survivor).
- `grep 'glass-card' demo --include='*.vue' | grep '<Card'` → empty: 0 manual
  double-plate on any Card (CS-3 / S1).
- `grep 'class="…glass-card…"' demo --include='*.vue'` → empty: 0 `glass-card`
  class survives demo-wide (S6 bare-div stages all migrated to
  `glass-resting cartoon-surface` — one depth idiom demo-wide).
- composite host `TimingFunctionPanel.vue:30`: `<Card ref="bezierCardRef"
  surface="cartoon" class="cartoon-specular glass-specular-track …">` +
  `useSpecularPointer(() => bezierCardRef.value?.$el ?? null)` — the D14 composite
  wired (S2-COMPOSITE).
- `design-idioms.css`: `.scale-on-hover` rule DELETED (S4); `.cartoon-specular`
  recipe + `::before` rest/hover `--specular-intensity` projection present
  (S2-COMPOSITE); `.cartoon-surface:has(:focus-visible)` focus-elevation delta
  present (WV-W2-LOW-1); the `.progress-dot`/`.progress-rail`/`.progress-ball`/
  `.status-badge`/`.code-token` consolidations UNTOUCHED in the diff (CS-4/A10
  red-herrings fenced off).

---

## §RED-that-should-be-GREEN

NONE. Every gate is GREEN or born-RED-as-designed (`proof:specular-handoff` is the
intended HANDOFF witness, correctly PENDING). No paper-over.

---

## §Size-ceiling test note

No size-ceiling test failed. The H.W2 edits are per-Card prop swaps + one new
composable + CSS recipe/deletions — none crossed a tracked LOC/byte ceiling; the
full vitest suite (666 passed) carried no size-ceiling RED, so no ceiling update
was needed.

---

## §Verdict

H.W2 VERIFY — **PASS.** tsc 0; tests green; gh-pages built; the 6 W2 gates GREEN
(`proof:specular-handoff` born-RED-held-as-designed); `proof:ci-coverage` GREEN;
the 4 no-regression gates STILL green; the BITE confirms the depth gate bites; no
neutralizer, no glass-ui src edit.
