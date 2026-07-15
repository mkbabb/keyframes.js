# Tranche U — Lane 01 · prompt-recap-total

> THE TOTAL ASK LEDGER: every distinct owner prompt/request across tranches J..T,
> dispositioned against the CURRENT master tree (v5.2.0, `b95973a` — U opened),
> not against any board. Every claim below is read from the tree; boards are cited
> only to name the ask, never to certify it.

Sources harvested: `docs/tranches/U/ORIGINAL-PROMPT.md`; `T/{PROMPT-RECAP,OWNER-ASKS,OWNER-DECISIONS,FINAL}.md`;
the per-tranche recaps `{K,L,M,O,P,Q,R,S}/audit/prompt-recap-*.md`, `S/OWNER-ASKS.md`;
tree witnesses `package.json`, `scripts/gate-bands.mjs`, `.github/workflows/*`, `src/`, `demo/`, `dist/`.

---

## 0 — The shape of the total ask corpus (what the harvest shows)

The S recap already consolidated **287 owner messages / ~114 distinct authored prompts** (`S/audit/prompt-recap.md:12`).
Across J→T the corpus resolves into **two strata**:

- **The immutable standing mandate** — a 7-clause block first captured at `J/J.md:111-119`,
  re-issued VERBATIM through K, L, M, O, P, Q, R, S, and T (`T/PROMPT-RECAP.md:54-72`), and now
  **re-issued a ~10th time in U's own prompt** (`U/ORIGINAL-PROMPT.md:14-16`). Every recap marks
  it "ADDRESSED (chartered)"; the **re-issuance itself is the falsification** (T lane 28 F5): a
  precept spirit-met to the owner's bar would not need restating. Per the T.M10 doctrine a
  verbatim re-issue **auto-REDs** its ADDRESSED claim.
- **The per-tranche feature/correction asks** — mostly ADDRESSED-and-terminal at their tranche
  (icon re-instantiation H, demo name H, deploy revival S.A3/T.S6, parse-that dep removal Q.DM-5,
  the 28-row T live-review catalogue). The residue that OUTLIVES its tranche is what U owes.

The single most load-bearing fact: **U's prompt is not a new tranche of new asks — it is the owner
re-issuing the same mandate for the ~10th time PLUS two escalations (CI-trim, grand-restructure).
The recurrence is the finding.** U must stop chartering the mandate and start clearing it against an
owner-observable bar.

---

## 1 — The standing 7-clause mandate: letter vs current tree (the recurrence ledger)

| Clause | Owner re-issue count J→U | Tree witness (current) | Verdict |
|---|---|---|---|
| NO quick solutions / NO workarounds — idiomatic gestalt | 10× (`U/ORIGINAL-PROMPT.md:14`) | hand-roll census not re-run post-T; T named survivors (`useToolbarKeyboard`, `KfPillTabs`→glass-ui pending) | **PARTIALLY** — re-issued → auto-RED |
| architectural transposition for elegance/simplicity/**performance** | 10× (`:14`) | perf is now the "grand edict"; VERDICT #19 "performance god awful"; T.G kf-half landed, BG-5 glass-ui compositor cost still a tripwire (`T/FINAL.md:44`) | **PARTIALLY** |
| NO legacy code | 10× (`:16`) | 50 "legacy" markers in src+demo are **narration of removals** ("no legacy beside the replacement", "@deprecated alias DROPPED in 5.0.0" — `src/animation/index.ts:62,280`); no live legacy tier found | **ADDRESSED (letter) / re-issued** |
| delineate + fold chronic/deferred items | re-issued ×2 in U (`:18-20`) | 8 live `T_BORNRED_BACKLOG` rows persist (`scripts/gate-bands.mjs:609`); external tripwires still deferred-by-design | **PARTIALLY** |
| Recap ALL prompts — ensure addressed | 10× (`:22`) | T built `PROMPT-RECAP.md` + `proof:prompt-recap-t` (first time it ran); **this lane is U's re-execution** | **PARTIALLY** (mechanism must persist) |
| This is NOT an implementation phase | every dev-tranche (`:24`) | U is dev-only; the recursion (dev tranches keep shipping rejected impls) is itself the finding | **ADDRESSED (posture)** |
| batches of 3 · Fable+frontend-design for ALL design · Opus/Sonnet fanout | 10× (`:26,59`) | orchestration spec restated; shipped surfaces historically skipped per-page Fable+owner pass | **PARTIALLY** |

Evidence anchors: re-issuance census `T/PROMPT-RECAP.md:51-72`; the U verbatim re-issue
`U/ORIGINAL-PROMPT.md:8-38`; the legacy-marker audit (50 hits, all narration) read live from
`src/` + `demo/`.

**Gestalt cure (not another charter-fold).** The mandate has been "chartered" 9 consecutive times
and rejected 9 times. The transposition U owes is to make each clause **owner-observable and
gate-anchored at the exact bar the owner uses**, then STOP re-chartering: (a) NO-workarounds →
a standing `proof:no-hand-roll` census gate that enumerates every hand-rolled primitive with a
named idiomatic replacement, RED until zero; (b) performance → a single owner-anchored perceived-perf
floor gate (not per-scene source-shape gates the owner already rejected); (c) recap → this ledger
as a *maintained* artifact under a live gate, not a once-per-tranche re-derivation.

---

## 2 — U's two escalations (the genuinely-new asks) — UNADDRESSED against the tree

### 2a — CI TRIM (`U/ORIGINAL-PROMPT.md:8`) — **UNADDRESSED**

> "that runner is entirely superfluous--our CI needs to be trimmed substantially (most of it's likely tautological)."

Tree witness: **227 `proof:*` keys** in `package.json` against the declared `ROSTER_CEILING = 120`
(`scripts/gate-bands.mjs:595`). `proof:roster-ceiling` is a *standing* born-RED backlog row that
"stays RED until the bands drive the count back" (`scripts/gate-bands.mjs:587-592,665-678`) —
i.e. the diet was **declared, never executed**. `.github/workflows/ci.yml` is **60 KB / 152 `run:`
steps** — a monolith. The owner calls most of it tautological; the ceiling row proves the boards agree.

**Gestalt cure.** Do not shave keys to hit 120 — that is the workaround the owner forbids. Transpose
the gate apparatus: (1) classify all 227 gates into **CORRECTNESS** (must run in CI), **HYGIENE**
(runnable locally / pre-commit), and **DESIGN-OWNER** (born-OWNER, not CI-gateable — the T.M2 class);
(2) collapse the tautological families (the ~40 retired/RETIREMENT_LEDGER keys still enumerated,
the per-shot appearance locks superseded by `owner-golden`) into their single surviving oracle;
(3) delete the "declared ceiling that never converges" pattern — a ceiling gate that is permanently
RED is itself a tautology. Target: one lean CI job set (build · typecheck · library correctness ·
boundary/published-surface) + a separate opt-in hygiene roster.

### 2b — THE GRAND RESTRUCTURING / recursive colocation (`U/ORIGINAL-PROMPT.md:28-36`) — **PARTIALLY**

Re-issue of the mid-T edict (`T/OWNER-ASKS.md:8`), which T.F claims LANDED with `proof:colocation`.
Tree witness: the demo IS substantially colocated — `demo/scenes/cube/{matrix-editor,orbital-drag}/`
with `composables/` inside (`demo/scenes/cube/orbital-drag/composables/useOrbitalInertia.ts`);
the library is zone-partitioned with per-zone barrels (`src/animation/*/index.ts`). The gates exist:
`proof:{colocation,zone-cohesion,no-dead-export,any-ceiling,style-file-ceiling}` all present in
`package.json`. BUT the owner **re-issued it in U** ("a grand restructuring of our entire library and
demo … all subcomponents") → auto-RED per the re-issuance doctrine, and the U prompt widens it to
"**all backend files too**" (scripts/, the library treated befittingly).

**Gestalt cure.** Re-audit colocation as a *standing enforcement*, not a one-time move: (a) verify
`proof:colocation` actually walks the demo AND library AND `scripts/` (the backend half the U prompt
newly names — currently `scripts/lib/` shared helpers vs per-gate colocation is unaudited); (b)
prove no long-file god-modules survived (T claimed `engine.ts`/`group.ts` split; verify against the
`decomposition` cap-overrides that R found were cosmetic — `R/audit/retro-prompt-recap.md:69`);
(c) fold the `composables/`-vs-colocated rule into the gate so drift REDs, not a manual pass.

---

## 3 — The chronic / external residue the owner ordered folded (NO MORE DEFERRALS)

`U/ORIGINAL-PROMPT.md:18-20` terminates the honest-defer device: "Delineate any chronically deferred
items and fold them into this tranche. Delineate any deferred items and fold them into this tranche."
Against the tree, the following are STILL deferred-by-tripwire and now UNADDRESSED-by-edict:

| Deferred item | Tree witness | Class | Verdict |
|---|---|---|---|
| KF-7 `PropertyDescriptor_2` d.ts collision | present in **both** `dist/keyframes.d.ts` + `dist/engine/index.d.ts` at value.js **3.1.0** (`grep` live); `proof:no-collision-rename` born-RED (`T/FINAL.md:96`) | EXTERNAL (value.js) | **UNADDRESSED** — owner said no deferrals |
| glass-ui backdrop-compositor cost (BG-5) | `proof:blur-not-resampled` external-blocked tripwire (`T/FINAL.md:44,91`); glass-ui pinned `~4.0.0` (`package.json`) | EXTERNAL (glass-ui) | **UNADDRESSED-by-edict** |
| dock de-blur / morph continuity (GU-1/GU-2) | `proof:{subject-legible,dock-rest-crisp,dock-morph-continuity}` external tripwires (`T/FINAL.md:90,97,98`) | EXTERNAL (glass-ui) | **UNADDRESSED-by-edict** |
| `T_BORNRED_BACKLOG` (8 live rows incl. `roster-ceiling`, `stage-inventory`, `blur-not-resampled`) | `scripts/gate-bands.mjs:609` | mixed | **PARTIALLY** |

**Gestalt cure.** "No more deferrals" cannot delete the external reality that value.js/glass-ui ship
on their own cadence — but it CAN delete the *tripwire-as-terminal-state* pattern. U owes a
**consume-edge coordination band**: one letter per sibling naming each blocked gate, a hard kf-side
posture for each (either the gate discharges when the sibling ships, or kf absorbs the concern —
e.g. re-point the `PropertyDescriptor` type alias at the kf boundary rather than wait on the rename).
value.js's tranche is ACTIVE elsewhere (`U/ORIGINAL-PROMPT.md:38,60-62`) → U charters the letter, not
the fix, but the letter must carry a dated expectation, not an open tripwire.

---

## 4 — parse-that: "has parse-that been driven?" (`U/ORIGINAL-PROMPT.md:38`) — **ADDRESSED (verify-and-state)**

Tree witness: **zero** `@mkbabb/parse-that` specifier in `package.json` or `src/` (only
removal-narration comments survive — `src/animation/compile/parse-flatten.ts:125-128`,
`internal/leaves.ts:9-10`). The direct dependency was removed at Q.DM-5 (`Q/audit/prompt-recap-Q.md:100`);
kf now reaches the CSS grammar through value.js's own `parseCSSSubValue`. parse-that stands at 1.0.0
per MEMORY. **The dep-drive is genuinely done.** U owes only a one-line certification in the corpus
that the consume edge is clean — no parse-that band.

---

## 5 — The per-tranche feature asks that are terminal (recorded, so U does not re-open them)

Confirmed ADDRESSED-and-terminal against the tree / boards (U must NOT re-open these):
icon re-instantiation (H); demo title "keyframes.js" (H, `S/audit/prompt-recap.md:121`); auto-deploy
revival (`deploy-pages.yml` `workflow_run`, T.S6); the SoA compositor perf transposition (P.W2/Q.WF2,
benches present); the constellation publish spine (parse-that 0.11→1.0, value.js O→3.x, kf 4.4→5.2);
the 25/28 T live-review verdict items LANDED (`T/FINAL.md:24-57`); `MotionPath`/`MorphSVG`/`DrawSVG`
LIBRARY factories survive the OD-1 demo-scene prune (`T/FINAL.md:120-121`); the scene-stage/N-Stage
scene-switcher SHELVED by owner taste verdict (terminal — do not resurrect). These are the ADDRESSED
mass; the ledger records them so U's scope stays the residue, not the whole history.

---

## What U must charter

1. **Charter a CI/gate TRANSPOSITION band** — classify all 227 `proof:*` keys into CORRECTNESS /
   HYGIENE / DESIGN-OWNER, collapse tautological + retired families into their surviving oracle,
   delete the permanently-RED `roster-ceiling` pattern, and land ONE lean CI job set. Not a shave to
   120 — a re-architecture of the gate apparatus. (`scripts/gate-bands.mjs:595`, `ci.yml` 60KB/152 steps.)
2. **Charter the standing-mandate CLEARANCE, not another fold** — replace the 10×-re-issued
   "chartered" claim with owner-observable gates: `proof:no-hand-roll` census (workarounds),
   one owner-anchored perceived-perf floor (performance), this ledger under a live gate (recap).
   Stop re-chartering the mandate; clear it.
3. **Charter a grand-restructure RE-AUDIT covering the backend half** — verify `proof:colocation`
   walks demo + library + `scripts/`, prove no long-file god-modules survived the T claims (check the
   `decomposition` cap-overrides R flagged cosmetic), and make the colocation rule a drift-RED gate.
4. **Charter a consume-edge coordination band that ENDS the tripwire-as-terminal pattern** — one
   dated letter per sibling (value.js KF-7 `PropertyDescriptor`, glass-ui BG-5/GU-1/GU-2), each with a
   hard kf-side posture (absorb or expire), honoring "no more deferrals" without pretending kf owns
   sibling code. value.js's tranche is active — charter the letter only.
5. **Charter the "no more deferrals" backlog discharge** — every one of the 8 `T_BORNRED_BACKLOG`
   rows gets an in-U discharge plan or an explicit owner-accepted retirement; no row may exit U as an
   open tripwire.
6. **Record parse-that as certified-clean** (zero specifier in tree) — no band, one line.
7. **Persist this total ledger as a maintained U artifact under `proof:prompt-recap-u`** — born at
   entry, updated per wave (the T.M10 discipline), so the "recap ALL prompts" clause never again
   self-certifies at close.
