# Tranche V — EXECUTION HANDOFF (read this FIRST on resume)

> **2026-07-17. The formation is RATIFIED (OD-V1) and execution is
> DISPATCHED as of the next session boundary.** This is the entry anchor for
> the post-compaction executor. Read order: this file → `V.md` →
> `waves/V.{A..G,Z}.md` → `PROGRESS.md` → `DISPOSITIONS.md` +
> `PROMPT-RECAP-V.md` → `audit/AUDIT-REGISTRY.md` →
> `../U/AGENTIC-HANDOFF-2026-07-16.md` (§5 is W2's recipe of record) →
> `coordination/`.

## 1. Tree truth (do not learn this the hard way)

- The OWNER CHECKOUT `/Users/mkbabb/Programming/keyframes.js` sits on stale
  local master `a59d3a22` (5.3.5 base) and deliberately carries the
  UNCOMMITTED K6-producer + Glass-7-consumer transaction (~254 dirty paths)
  PLUS the untracked V plan folder. It is SACRED: no mutating git, no npm
  operations there, ever — W2 reads its FILES (the 65-path slice export) and
  nothing else. This invariant survives until W2 completes.
- REMOTE master is at K6 `5a9183a7afe24702081a7b87c8adc7286ddce9a0`
  (published 6.0.0's gitHead). ALL execution happens in a FRESH SIBLING
  CLONE of remote master (e.g. `/Users/mkbabb/Programming/keyframes-v-exec`),
  never in the owner checkout.
- **First execution act (W0-DOCS)**: copy `docs/tranches/V/**` (this corpus)
  plus the U-folder additions (`AGENTIC-HANDOFF-2026-07-16.md`, any inbound
  files absent from K6) from the owner checkout into the execution clone and
  commit docs-only: `docs(V): the ratified formation corpus`. Push. The plan
  of record must live on the remote before any wave commits.

## 2. Dispatch order (the ratified DAG)

| Phase | Waves | Gate |
|---|---|---|
| NOW (no external gate) | W0-DOCS → W4 (structure gate + openers, on the clone) ∥ W1 REHEARSAL (audit copy only) ∥ W9 red-witness AUTHORING (no yml/package landings) ∥ W10 rows that touch neither demo nor ci.yml | battery green per wave spec |
| Then | W5 → W6 (library carves + encapsulation) | FENCE B/E per batch |
| ON THE GLASS 7 TAG (the immutable packet: tag object, peeled commit, tarball, integrity, provenance, exports/declarations, peers, strict packed-consumer, native close) | W2 (consume; §5 recipe + audit amendments + W1 landing as the documented slice extension) → W3 (native 1280/390 close + deploy of record + tuples out) → W9 LANDS (MR1–MR4 yml/package edits) → W7 → W8 → W10 remainder (ci relabel, DM-18 inside W7/W8) → W11 (full fidelity) | each wave's Hard Gate |
| Close | W12 (ledger terminal + relays) → W13 (ι sweep + 3 close-audit lanes + FINAL-V) | close-honesty checklist |

Owner rulings collected in-wave, never proxied: DP2-06 transport home (W11
options packet), the W8 ceiling election (500→one extraction / 400→two).

## 3. Working assets

- **The audit copy** (W1 rehearsal + any live probes):
  `/private/tmp/claude-504/-Users-mkbabb-Programming-keyframes-js/58f34108-b347-4938-adcd-9e676fc3e1fa/scratchpad/kf-audit-copy`
  — carries fresh `glass@e7da7b5c` + the AUDIT-PROBE TooltipProvider patch +
  playwright-core; NO npm operations in it (prunes the linkage). If the
  scratchpad is gone, reconstruct per `audit/GLASS-AUDIT-LINKAGE.md`.
  Evidence only; never lands.
- **Blueprints of record**: `audit/R2-05` (library moves), `audit/R2-06`
  (demo moves), `audit/R2-07` (gate keep/prune), `audit/R2-08` (doc
  manifest), `audit/R3-02` (the exact W1 easing fixes), `audit/R3-04` (the
  DAG amendments) — wave specs bind them; execute from the tables.
- **W2 inputs**: U handoff §5 (verbatim recipe) + the Q060 delta table in
  glass's install-truth packet (the authoritative export-map check) + the
  CC-05 watchlist (`audit/R2-09`) + `coordination/GLASS-INBOUND-2026-07-17-install-truth-marks.md`.

## 4. Standing law (unchanged)

Batches of 3 concurrent agents (rate wall); models declared explicitly —
Fable only for the deepest adjudication, Opus implementation/fanout, Sonnet
mechanical; implementation ceiling 6 agents per wave, read-only audits 7;
sweeps are measurements; refutation amends the charter; verify, never
inherit; the owner checkout is sacred; siblings are read-only (bounded inbox
files only); `--legacy-peer-deps` forbidden; no legacy code; `docs/precepts/`
read-only; prototypes never land.

## 5. Constellation state at dispatch

All four channels notified of execution open (2026-07-17): glass
(`keyframes-inbox-2026-07-17-v-execution-open.md` — also holds our
unanswered G-1..G-4 batch rows), value.js (no action owed; D-GAP-6 ruling
pending), atlas/sci (tuple promise + fences restated), speedtest (FYI; their
ACK already returned). Slides has no coordination channel and no direct
keyframes edge — glass owns their bump-window relay. Inbound ledger:
`coordination/INBOUND-LEDGER.md` + the install-truth marks file; W12
terminalizes.

## 6. What done looks like

`V.md` §Completion criterion, verbatim — the deploy of record serving the
rendered demo (pageerror==0 native matrix), both trees settled under
`proof:structure`, the four MAKE-REALs demonstrably fallible, 68+52 ledger
rows terminal, ι clean, π/DELTA archive complete, FINAL-V surviving the same
adversarial reading V gave FINAL-U.
