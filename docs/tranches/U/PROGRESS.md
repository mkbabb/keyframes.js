# Tranche U — THE BOARD

> The board of record for THE DISSOLUTION TRANCHE. Amended AT THE EVENT (the T.M9
> freshness discipline) — never reconstructed at close. The charter is `U.md`; the
> band docs are `waves/U.<band>.md`.

## Band status

| Band | Title | State |
|---|---|---|
| U.A | THE APPARATUS DISSOLUTION | CHARTERED |
| U.B | THE DEMO TRANSPOSITION | CHARTERED |
| U.C | THE LIBRARY TRANSPOSITION | CHARTERED |
| U.D | THE PERFORMANCE FRONTIER | CHARTERED |
| U.E | NO-DEFERRAL DISCHARGE + LEGACY ZERO | CHARTERED |
| U.F | CONSTELLATION COVENANTS | CHARTERED |
| U.G | THE DESIGN CODEX | CHARTERED |
| U.H | THE TEST SUBSTRATE (FIRST) | CHARTERED |
| U.R | PROMPT-RECAP-U (STANDING) | CHARTERED |
| U.Z | THE CLOSE | CHARTERED |

**IMPL NOT AUTHORIZED** — development only, per the edict's own clause.

## Session log

- **2026-07-09** — U opened by the owner's dissolution edict (verbatim at
  `ORIGINAL-PROMPT.md`, committed to master at `b95973a` mid-T-close). Received
  while the T deploy-of-record was in flight; the two tracks ran in parallel.
- **2026-07-10** — **THE 32-LANE AUDIT FLEET COMPLETE** (`wf_3e2440f9-452`: 31/32
  structured + 1 report-only [lane 12, StructuredOutput cap; report real at 186L;
  lane 14's structured summary was junk but its report is real at 279L], 3.8M
  tokens, ~83min, 11 batches of 3; design lanes 24–26 on Fable + frontend-design).
  Reports at `audit/lane-*.md`. The four root causes converged hard: the apparatus
  IS the legacy (73.5k scripts LOC vs 22k src; ~40/227 gates real); the structure
  edict was executed tolerantly (T #26 overstated — F1/F2 skipped, the keystone
  gate shaped around them); the perf frontier is misallocated (the render seam is
  ~95% of tick cost, untouched; 8MB dead Monaco workers = 48% of shipped JS); the
  constellation edges drift vacuously (tilde-frozen glass-ui + installed-dist-only
  tripwires). parse-that certified CLEAN (transitive-only, zero specifiers).
- **2026-07-10** — the Fable synthesis: `U.md` (4 root causes → 10 bands → DAG →
  ring-fences), `OWNER-DECISIONS.md` (OD-U1..U9; three PRE-RATIFIED off the edict's
  plain text), `OWNER-ASKS.md`. The wave-doc fleet launched (`wf_8eeb3b4c-d2b`,
  10 band authors, batches of 3, U.G on Fable + frontend-design).
- **2026-07-10** — T-close interleave (master, not this branch): the first
  fully-green master CI in the tranche era (`72d1873`) after the close-out chain —
  styling-idioms dead-refs, demo-elevate re-arm, easing-gallery selector,
  KEEP labels, pin-ledger, dock-zorder→tripwire, library-gate timeout,
  no-cross-realm-cast catastrophic-backtracking regex (never once completed on CI),
  deploy-preflight gh-api --jq bug on its first live firing (fixed `2810268`);
  5.2.0 published to npm (latest); break-glass dispatch fired while the fixed
  auto-path re-proves.
- **2026-07-10** — the 3-critic harden pass (`wf_0703d8a4-940`: coverage / DAG-edges /
  edict-conformance, all SOUND-WITH-FIXES — 1 blocker [the U.C4 spring-oracle ownership,
  now U.H1's named deliverable], 7 major, 9 minor) APPLIED across 8 corpus docs; the two
  new-gate anti-sprawl sign-offs registered as OD-U10/OD-U11.
- **2026-07-10** — **THE 2026-07-10 RULING BATCHES EXECUTED (OWNER-ASKS rows 3-4).**
  The owner's two verbatim ruling batches propagated through the corpus: OD-U1..U13 now
  register terminal-or-confirm — OD-U1 (the RULED 10× wall-clock + zero-loss fold-map
  exit criteria), OD-U2 (component-CORE redesign to the glass-ui post-BH idiom + the
  `demo/@/` DISSOLUTION revised-reco, pending one-word confirm; `components/custom/`
  dissolution STANDS), OD-U4 (glass-ui **5.0.0** — the pin moves on its publish, the
  joint BG+BH cut), OD-U5 (Monaco kept FULLY-FEATURED but ON-DEMAND), OD-U7
  (tests-stay), OD-U8 (**5.3.0** — U binds to a compatible published surface, additive
  only), OD-U9 (RULED — instrument the 3D scenes, designed ONE direction, no both-ways
  fork), OD-U10/OD-U11 (both proposed standalone gates DROPPED to clauses), OD-U12 (the
  scene-facet loading model — verbatim design authority), OD-U13 (the amiga +
  suspend/resume in-U cure). The glass-ui post-BH idiom audit LANDED
  (`audit/glassui-idioms-post-bh.md` — the OD-U2 homogeneity evidence, feeding
  U.B/U.F/U.G). The amiga + scene suspend/resume first-principles investigation
  DISPATCHED (OD-U13; dossier → `audit/defect-amiga-suspend-resume.md`; the fix is the
  new wave **U.B13**). **ZERO new standalone gates survive the rulings** (OD-U10/U11 —
  both fold into clauses on existing gates; net NEW standalone gates in U = ZERO). The
  corpus propagation applied to `U.md` + six wave docs
  (`U.A`/`U.B`/`U.C`/`U.D`/`U.F`/`U.G`).
