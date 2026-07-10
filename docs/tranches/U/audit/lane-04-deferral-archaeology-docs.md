# Tranche U — Audit Lane 04: Deferral Archaeology (docs)

**Charter.** Sweep ALL prior tranche docs (`docs/tranches/{J..T}`) for deferral
language and build the complete deferred-item inventory — item, first-deferred-at,
chronic count, VERIFIED current tree state, and the U fold-in disposition. This is
the ground truth behind the owner's **"NO MORE DEFERRALS"** edict (ORIGINAL-PROMPT
reading 2: "the 'honest defer' device is terminated for U's scope").

**Method.** Every row below carries `file:line` evidence read from the live tree at
`master` (post-T, 5.2.0). Board claims were re-verified against source, not trusted.
Read-only discipline observed; only this report was written.

---

## 0 — The headline

At T close the deferral apparatus is **8 live born-RED backlog rows**
(`scripts/gate-bands.mjs:609` `T_BORNRED_BACKLOG`, 8 keys, verified by executing the
module) **plus a ~116-row "Open deferrals" ledger** in `docs/tranches/S/PROGRESS.md:103`
(68 FOLD · 24 KILL · 14 RECORD · 2 VERIFY-ONLY · 2 RE-AFFIRM · 8 sibling/historical),
of which the T PROMPT-RECAP admits **~33 FOLD rows remain un-witnessed**
(`docs/tranches/T/PROMPT-RECAP.md:150`). The deferrals cluster into four chronics and
one in-tranche punt. Two of the four chronics are **genuinely external** (glass-ui,
value.js) and cannot be kf-cured; the other two are **kf-owned institutional debt**
(the gate-roster ceiling and the ledger itself) that the born-RED-tripwire device has
been re-carrying tranche-over-tranche instead of discharging.

The single most important structural finding: **the "born-RED tripwire / honest defer"
mechanism is itself the deferral engine.** Q declared the 7-tranche P-inv-28 chronic
ledger "TERMINATED" (`docs/tranches/Q/FINAL.md:4`) by RECLASSIFYING each chronic as
"GREEN gate + documented born-RED provenance IS the exit form"
(`docs/tranches/M/PROGRESS.md:309,315-318`) — a bookkeeping exit, not a cure. The same
dock defect it "exited" re-surfaced at T as the owner's live-review verdict #4 ("docks
blurry, broken, janky") and #19 ("performance god awful"), re-booked as GU-1/GU-2/
BG-5/BG-11 (`docs/tranches/T/FINAL.md:19,26` cross-ref; `T_BORNRED_BACKLOG`). U cannot
"fold in" deferrals while the device that manufactures them is still in place.

---

## 1 — The complete deferred-item inventory (verified)

### CHRONIC A — glass-ui dock / blur / drawer defect (the biggest chronic)

| Facet | Evidence |
|---|---|
| **Item** | Dock renders/morphs/blurs wrong; live backdrop-filter re-samples the moving stage; mobile Drawer occludes the menubar. |
| **First-deferred-at** | Dock defects booked as DM-1 (GlassDock click-strand, carried **I,J,K,L→M** = 4 tranches, `docs/tranches/M/PROGRESS.md:287`) and DM-12 (dock D5 lag + D9 popover, carried **D,H,I,K,L→M** = 5 tranches, `M/PROGRESS.md:318`). |
| **Chronic count** | 4–5 tranche carries at M; then owner-re-verdicted at T (verdict #4/#19, `docs/tranches/T/FINAL.md:19,26`), re-booked as GU-1/GU-2/BG-5/BG-11. |
| **Current tree state (VERIFIED)** | glass-ui pinned `~4.0.0` (`package.json:297`), installed **4.0.1** — NONE of the asks shipped upstream. Four live born-RED rows: `proof:subject-legible`, `proof:blur-not-resampled`, `proof:dock-rest-crisp`, `proof:dock-morph-continuity`, `proof:dock-zorder` (`gate-bands.mjs:626,637,717,729,742`). Gap census live at `demo/@/glass-ui-gaps.ts:104,149,159,169` (dockRestBlur GU-1, dockMorphMeasure GU-2, staticBackdrop BG-5, drawerDetentInset BG-11). |
| **U disposition** | **STILL DEFERRED — genuinely external.** kf cannot self-cure (MEMORY: glass-ui-root only, never patched in demo). value.js's tranche is active elsewhere; glass-ui's is NOT stated active. The honest U move is a **hard coordination letter with a real deadline**, not a fifth born-RED re-carry. |

### CHRONIC B — KF-7 `PropertyDescriptor` type collision (value.js consume-edge)

| Facet | Evidence |
|---|---|
| **Item** | value.js exports a type named `PropertyDescriptor` colliding with the ambient DOM global; API-Extractor mangles it into kf's PUBLISHED `dist/keyframes.d.ts` as `PropertyDescriptor_2`. |
| **First-deferred-at** | **K** — `docs/tranches/K/audit/packaging-k.md:138` (`import { PropertyDescriptor as PropertyDescriptor_2 }`). Type itself surfaced J (`J/audit/frontier/valuejs-census.md:96`). |
| **Chronic count** | Re-filed S (`docs/tranches/S/KF-VALUEJS-2.0.0.md`, KF-7 at `:73`), re-filed T (`docs/tranches/T/KF-TO-VALUEJS-T.md:12`). The T letter self-documents it "**stranded four tranches** because it was dispatched fire-and-forget" (`KF-TO-VALUEJS-T.md:8`). |
| **Current tree state (VERIFIED)** | value.js **3.1.0** installed still exports it un-renamed (`node_modules/@mkbabb/value.js/dist/index.d.ts:43`). **`PropertyDescriptor_2` is live in the published `dist/keyframes.d.ts` (3 occurrences)**. Born-RED `proof:no-collision-rename` (`gate-bands.mjs:684`). |
| **U disposition** | **STILL DEFERRED — external, but the process fix already landed** (each rider now carries its own adopt-event-watch tripwire, `KF-TO-VALUEJS-T.md:8`). U charters the kf consume-edge letter renewal only (value.js owns the rename); the tripwire is CORRECT to keep — but U should assert the deadline in the active value.js coordination. |

### CHRONIC C — gate-roster ceiling (THE CI-TRIM EDICT's ground truth)

| Facet | Evidence |
|---|---|
| **Item** | The proof:* roster vastly exceeds the declared ceiling; the owner calls the runner "entirely superfluous" and CI "tautological" (ORIGINAL-PROMPT). |
| **First-deferred-at** | **M** owner question: "proof:hygiene running 3 hours — **preposterous** — why so many proof: scripts?" (`docs/tranches/S/audit/prompt-recap.md:133`). Ceiling formalized at **S.A4** (190 → ~138 → ~120, `docs/tranches/S/S.md:687`; `ROSTER_CEILING = 120` at `gate-bands.mjs:595`). |
| **Chronic count** | M (raised) → S.A4 (declared, half-shipped: speed landed M.W1, legibility deferred) → T (declared born-RED, "converges slowly", `gate-bands.mjs:665`) → U (owner re-raises as CI-trim). ~3 tranche carries. |
| **Current tree state (VERIFIED)** | **226 proof:* scripts** (`package.json`, `grep -oE '"proof:[a-z0-9-]+"' \| sort -u \| wc -l`) vs ceiling **120** — RED. `proof:hygiene-chain` is a **134-gate `&&`-chain in ONE package.json line** (`package.json:272`); `proof:demo-correctness` chains 27 more. Born-RED `proof:roster-ceiling` (`gate-bands.mjs:665`). |
| **U disposition** | **FOLD — kf-owned, in-scope, THE owner's #1 explicit ask.** This is not external. U owns a CI/gate-apparatus reduction band (ORIGINAL-PROMPT reading 1). The 134-gate hygiene-chain is the tautology surface: collapse duplicative/subsumed oracles, retire feature-coupled locks for deleted subjects, and drive the count to ≤120 by DELETION, not by declaring another born-RED backlog year. |

### CHRONIC D — the "Open deferrals" chronic-closure ledger (the device)

| Facet | Evidence |
|---|---|
| **Item** | A flat carry-forward ledger of every deferred item; the meta-gate `proof:chronic-closure` polices it. |
| **First-deferred-at** | Ledger lineage H→I→J→K→L→Q→S (`scripts/proof-chronic-closure.mjs:56-58`; parse target moves tranche-to-tranche). Current authoritative file: `docs/tranches/S/PROGRESS.md:103` (`CHRONIC_LEDGER` at `proof-chronic-closure.mjs:145`). |
| **Chronic count** | ~116 numbered rows; **68 still FOLD** (executed tally over `S/PROGRESS.md`). T folded some but admits **~33 un-witnessed FOLD rows remain** (`docs/tranches/T/PROMPT-RECAP.md:150`) — the batch-② "52→3" claim was inaccurate (honest count 33). |
| **Current tree state (VERIFIED)** | `proof:chronic-closure` runs and lists live FOLD rows (e.g. #66 mobile-sheet occlusion, #67 hidden-affordance, #69 square lying controls, #70 gate roster 190→120, #71 KfPillTabs keyboard-broken). Still a T_BORNRED_BACKLOG-adjacent born-RED gate. |
| **U disposition** | **RETIRE THE LEDGER, don't re-inherit it.** The ledger is the institutional memory of the honest-defer device the owner just terminated. U should adjudicate each of the ~33 live FOLD rows to a terminal disposition (fix / delete-subject / genuinely-external-with-deadline) and then **delete `proof:chronic-closure`** — with no honest-defer device there is no ledger to police. |

### IN-TRANCHE PUNT E — `proof:stage-inventory` browser reconciliation

| Facet | Evidence |
|---|---|
| **Item** | The `KF_REQUIRE_BROWSER=1` assertion "does the running demo paint exactly the sanctioned set?" |
| **State (VERIFIED)** | Manifest layer green, but the browser rendered-set reconciliation is **"not yet implemented — a later wave opens the browser"** (`gate-bands.mjs:616-624`). Born-RED, deferred WITHIN T, never built. |
| **U disposition** | **FOLD or KILL.** Either build the browser reconciliation once (U's restructuring touches every scene) or fold this gate into the demo-correctness roster and delete the standalone born-RED row. |

### RESOLVED (proof the fold mechanism works when kf-side)

Two live compile bugs deferred since S are now **FIXED in-tree** — evidence that in-scope folds converge:
- **EN-a** (browser-dead registry easing names, fold row 73): `serializeEasing`
  now densifies every non-native registry name to a browser-valid `linear()`
  (`src/animation/compile/backward/easing-serialize.ts:68-140`).
- **EN-b** (mixed-track densify prop-drop, fold row 74): `densifyColorBlock` now
  returns raw per-percentage color and `compileChild` merges non-color decls
  (`src/animation/compile/backward/backward.ts:276-328`).

---

## 2 — Findings (severity-ranked)

See the structured summary. The load-bearing conclusion: the deferral corpus is
NOT dominated by open bugs (the concrete ones — EN-a/EN-b — landed). It is dominated
by **two kf-owned institutional devices** (the 226>120 gate ceiling and the ~116-row
ledger) and **two genuinely-external chronics** (glass-ui dock, value.js KF-7). The
owner's "no more deferrals" edict is really an edict to **dismantle the honest-defer
apparatus** — because that apparatus is what has let the same defects ride for 4–7
tranches under a green-looking CI.

---

## What U must charter

1. **KILL the honest-defer apparatus.** Terminate `T_BORNRED_BACKLOG` as a standing
   device: every one of its 8 rows resolves to a terminal state in U (fix, delete-
   subject, or external-with-hard-deadline). No born-RED row survives U as "converges
   later." Evidence: `scripts/gate-bands.mjs:609`.
2. **TRIM CI to the ceiling by DELETION.** Drive the 226-gate roster (`package.json`)
   under the 120 ceiling (`gate-bands.mjs:595`) by collapsing the 134-gate
   `proof:hygiene-chain` (`package.json:272`) — retire subsumed/duplicative oracles
   and every feature-coupled lock whose subject was pruned. This is the owner's #1
   ask; do it as deletion, not a re-declared backlog.
3. **RETIRE the chronic-closure ledger.** Adjudicate the ~33 live FOLD rows
   (`docs/tranches/S/PROGRESS.md:103`; `T/PROMPT-RECAP.md:150`) to terminal
   dispositions, then delete `proof:chronic-closure` (`scripts/proof-chronic-closure.mjs`)
   — with no defer device there is no ledger.
4. **Escalate the glass-ui dock/blur/drawer chronic to a deadlined coordination
   letter.** GU-1/GU-2/BG-5/BG-11 have ridden born-RED since D→T with no upstream
   ship (glass-ui `~4.0.0`/4.0.1, `package.json:297`). U charters a coordination
   letter with a firm re-pin trigger, not a fifth silent re-carry.
5. **Close KF-7 in the active value.js consume-edge.** value.js 3.1.0 still exports
   the colliding `PropertyDescriptor`; `PropertyDescriptor_2` is live in the published
   `dist/keyframes.d.ts`. U charters the renewed rename ask against the active value.js
   tranche and keeps the adopt-event tripwire (`KF-TO-VALUEJS-T.md:12`).
6. **Resolve the `proof:stage-inventory` browser reconciliation** once, inside the
   grand restructuring, or fold it into demo-correctness and delete the born-RED row
   (`gate-bands.mjs:616`).
7. **Verify the grand-restructuring does not spawn a new born-RED backlog.** The
   colocation edict must land as complete moves with green gates — a "converges later"
   colocation gate would re-instantiate the exact device U is chartered to kill.
