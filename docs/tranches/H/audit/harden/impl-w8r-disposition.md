# H.W8R Lane C — the W8 DISPOSITION RECORD (chronic-closure substrate + W8 spec → grounded truth)

Docs-only lane, file-disjoint from A/B. Updates the chronic-closure substrate (`PROGRESS.md
§"Open deferrals"` + the cross-repo perimeter) + the H.W8 spec (`waves/H.W8.md`) to the
GROUNDED, live-verified truth of the glass-ui re-pin saga's resolution. NO source/gate edits.

## The binding truth (verified live this session — ACTED on, not re-derived)

- glass-ui is pinned **`~3.5.1`** (installed **3.5.1**) — `package.json:166`
  `"@mkbabb/glass-ui": "~3.5.1"`, `node_modules/@mkbabb/glass-ui` version 3.5.1. KEEP IT.
  Do NOT revert to 3.4.0 (the visible dead-centered white specular bloom on glass), do NOT
  float to 3.6/3.7 (re-regress — `proof:no-orphan-specular` FAIL 2→3 at 3.7.0).
- **D5 (dock LAG) CLOSES via a passing SYSTEM gate, NOT a born-RED HANDOFF.** The dock-spring
  retune (`53c1b07`) is CONSUMED at ~3.5.1; `proof:dock-morph-settled` (token-peak ≤+6%) is
  GREEN — installed `--spring-dock` peak **+4.5% ≤ +6%** (down from the 3.4.0 +16.3% born-RED
  witness). The gate reads `node_modules` (inv-16 — kf cannot fork-to-green; only the consumed
  bump greens it), so D5's closure is a passing SYSTEM gate.
- **The specular bloom is DEAD at ~3.5.1.** glass-ui 3.5.0 killed the visible hover-radial.
  The W11 I5 SANCTIONED glass STAGES carry glass-ui's INERT `.glass-specular-track` (no visible
  bloom). The 3.8.0 `specular="off"` opt-out is a COSMETIC consume-edge — forward nicety, NOT a
  blocker.
- The real defect was a kf-internal GATE CONTRADICTION (W9 `proof:no-orphan-specular` exception=∅
  vs W11 I5 `proof:stage-glass-card` requiring glass stages) — reconciled by Lane A, not a
  glass-ui problem. Lane C does NOT touch the gate (file-disjoint); it records the disposition.

## Grounding sources read

- `package.json:166` → `~3.5.1`; `node_modules/@mkbabb/glass-ui/package.json` → `3.5.1`.
- `audit/harden/impl-w8-repin.md` — the conservative re-pin lane: the published 3.x binary
  search (3.4.0 +16.3% / **3.5.1 +4.5% GREEN** / 3.7.0 +4.5% but specular-hover RED), the TILDE
  cap rationale, REPIN-HANDOFF-1 (the W9-vs-W11-I5 gate reconciliation surfaced, not fixed there).
- `audit/harden/impl-w8-bump.md` — the consume-leg bump: `proof:dock-morph-settled` born-RED on
  the 3.4.0 token (+16.3%) → GREEN on the bump (+4.5%); the `oklab()` α-parser widening (a gate
  robustness fix, not a tolerance loosening).

## Edits made (3 sites, all in Lane-C substrate)

### (1) `PROGRESS.md §"Open deferrals"` — the D5 closure cell (the chronic table)

The D5 cell previously read "**D5 — kf CONSUME-LEG + born-RED gate** … `proof:dock-morph-settled`
(token-peak ≤+6%) born-RED (H.W8/§4)" — which framed D5 as still PENDING a born-RED HANDOFF.
CORRECTED to the green SYSTEM-gate closure: **D5 — CLOSED via a passing SYSTEM gate (NOT a
born-RED HANDOFF)**, the retune CONSUMED at `~3.5.1`, `proof:dock-morph-settled` GREEN at +4.5%
≤ +6%, the gate reading `node_modules` (inv-16, kf can't fork-to-green) so the closure IS a
passing SYSTEM gate, not a column-migration-to-HANDOFF. D9 (popover) unchanged (kf SHIP).

### (2) `PROGRESS.md §Cross-repo perimeter` — items 1 (dock) + 2 (specular)

- **Item 1 (dock LAG D5-b):** rewritten from "born-RED against the installed +16.3% register …
  greens on the bump" (pending framing) to "**CONSUMED + GREEN (no longer pending)**" — bumped
  `^3.4.0 → ~3.5.1` (installed 3.5.1), the `~`-cap DELIBERATE (3.6/3.7 re-regress at 3.7.0),
  `proof:dock-morph-settled` GREEN +4.5% ≤ +6%, D5 closes via this passing SYSTEM gate.
- **Item 2 (Card specular SEAM D2/D14):** recorded the precise CONSUME-EDGE — the 3.4.0 visible
  bloom is DEAD at ~3.5.1 (3.5.0 killed it); the W11 I5 sanctioned glass STAGES carry the INERT
  `.glass-specular-track` (no visible bloom, glass-ui-owned, inv-16); the glass-ui **3.8.0**
  `specular="off"` opt-out is a COSMETIC consume-edge — a forward nicety, NOT a blocker, NOT a
  born-RED gate.

### (3) `waves/H.W8.md` — a §Supersede note (after §Design decisions)

Added a terse §Supersede note: HARDEN BLK-5's "bump `^3.4.0→^3.5.1`" RESOLVES to `~3.5.1`
(`^3.5.1` floats to 3.7.0 which re-regresses; `~3.5.1` is the minimum 3.x carrying the dock
retune without the 3.6/3.7 surface regression); `proof:dock-morph-settled` GREEN at 3.5.1 → D5
closes via a passing SYSTEM gate (the "born-RED kf-side" framing in §Design decisions is the
H-open 3.4.0 witness state, since greened on the consumed bump); the specular-on-glass-stages is
RECONCILED (Lane A — `proof:no-orphan-specular` excludes the `proof:stage-glass-card` subjects,
stays FALSIFIABLE, not weakened, no `!important`, inv-16); the glass-ui 3.8.0 opt-out is a
COSMETIC consume-edge, not a blocker.

## Precepts honored

- NO workaround — Lane C records the Lane-A reconciliation, does not weaken any gate.
- `proof:no-orphan-specular` stays FALSIFIABLE (bites a kf-re-introduced `surface="glass"` panel
  regression) — recorded as such, not narrated into vacuity.
- inv-16 — kf consumes published `~3.5.1`; no glass-ui patch/fork. The 3.8.0 opt-out is a forward
  consume-edge, not a kf change.
- Chronic-closure discipline — D5 exits via a passing SYSTEM gate (not a bare HANDOFF tag); the
  substrate the H.W8 meta-gate parses (`PROGRESS.md §"Open deferrals"`) now reflects that.
- The H-open verified-facts snapshot (`PROGRESS.md` "the dock runs the pre-AW.W2 bouncy spring …
  pinned `^3.4.0` … +16.3%") is LEFT INTACT — it is the documented born-RED WITNESS the gate's
  BITE rests on, not a current-state claim. Same for the `tranche-h-dev` dev-open snapshot
  (glass-ui 3.4.0 consumed on the G re-pin). Only the disposition/closure cells moved.
- MEASURE-FIRST / KISS — three precise edits to the disposition substrate; the engine is
  ALREADY-SOTA + FENCED (untouched). DID NOT git commit (the lead commits).

## Files touched

- `docs/tranches/H/PROGRESS.md` — D5 closure cell + cross-repo items 1 & 2.
- `docs/tranches/H/waves/H.W8.md` — §Supersede note appended.
- `docs/tranches/H/audit/harden/impl-w8r-disposition.md` — this record.
