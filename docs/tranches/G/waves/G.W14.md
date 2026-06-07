# G.W14 — The modern-web checklist completeness fix (byte-cheap; keep the gate's coverage claim honest)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the CI gate surface — a byte-cheap
completeness fix: add 3 post-F catalog rows, each N-A/OUT, to the
`proof:modern-web` §S6 `CHECKLIST` so the gate's "every checklist row
dispositioned" claim stays truthful. ZERO demo pixels move; no library, no demo,
no behaviour change) · **Scope:** `scripts/proof-modern-web.mjs` ONLY — the
`CHECKLIST` array (`:401-553`) gains 3 rows; no other file touched · **DAG:
fully INDEPENDENT** of every other G wave (it edits one CI gate's manifest; no
shared surface with the re-pin spine, the engine SHIPs, the frontend bands, or
the demo) — runs in parallel; Band-6 sibling of `G.W13` (the engine SHIPs),
file-disjoint · **Gated on:** keyframes' own green CI (inv-27).

**Title.** *The post-F demo is EXEMPLARY on the modern-web axis — all 18 existing
§S6 checklist rows re-score HOLD on the live tree, F.W4/W11/W13/W15/W16 landed
the high-value adoptions, and there is NOTHING to manufacture. The ONE honest gap
is a completeness drift in the gate itself: the corpus has GROWN since F authored
the checklist, and three new Baseline-or-near levers that touch an animation/CSS
demo have NO row — `sibling-index()` (N-A, not Baseline), the Custom Highlight
API (N-A, no clean fit), `<dialog closedby>` (OUT, reka-ui seam + Safari). The
gate asserts "no row left un-dispositioned" while three levers are unrecorded —
the silent-incompleteness the Mandate forbids. Add the three rows (each N-A/OUT);
the gate already prints the table to CI log; deleting any new row re-falsifies the
coverage claim. Zero demo pixels move.*

This is the **byte-cheapest honest SHIP in G** — and the only modern-web work the
tranche should do. The forward motion the F lanes named (View-Transition
directional **types**) is STILL upstream-blocked (glass-ui 3.3.0's
`startViewTransition` is verified bare-callback-only — `r-modern-web MW-VT-1`,
routed to glass-ui-HANDOFF in Band V); the three genuinely-NEW catalog levers are
each CORRECTLY not adopted (not Baseline, no clean fit, or a glass-ui/reka-ui
seam). G should NOT manufacture a modern-web wave; it should record the three new
levers in the gate and leave the exemplary surface alone. NOT a re-derivation.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G
charter).** NO quick solution / NO workaround: the fix is to make the gate's
EXISTING completeness contract TRUE — add the missing rows — NOT to suppress the
contract or skip the new levers silently. NO legacy: each new row carries its
live Baseline string + the honest disposition reason; none is a placeholder. NO
new gate: the fix extends the EXISTING `proof:modern-web` `CHECKLIST` array
(`:401`), it does NOT mint a parallel completeness gate. KISS · DRY: three rows in
the one manifest the gate already iterates and prints (`:555,604-613`), not a
second scoring path. Measure-first does NOT bind (a gate-completeness fix, not a
perf claim and not a demo change); the gate is a falsifiable manifest-coverage
assertion that already BITES on a deleted row. Isomorphic: ZERO demo pixels move —
the three rows are N-A/OUT (none is a SHIP); no demo, library, or CI behaviour
changes beyond the manifest. inv-16: the one cross-repo item (VT-types) is a
glass-ui-HANDOFF in Band V, NOT written here. inv ε: every claim below cites
`file:line` (verified live on `tranche-g-dev`) or the live `modern-web-guidance`
Baseline string this audit recorded.

**Provenance.** `r-modern-web MW-CHK-1` (the §S6 checklist is missing the post-F
NEW rows — add them so the gate's "fully dispositioned" claim stays honest;
MEASURE-FIRST-SHIP-candidate → SHIP, byte-cheap) + the three NEW-catalog
re-dispositions `MW-NEW-1` (`sibling-index()` — RECORD, not Baseline),
`MW-NEW-2` (Custom Highlight API — RECORD, no clean fit), `MW-NEW-3` (`<dialog
closedby>` — OUT, reka-ui seam + Safari). Synthesised at `_SYNTHESIS-gap-scorecard
§1` (modern-web row: "EXEMPLARY … NOTHING but 1 byte-cheap completeness fix: add 3
new catalog rows … All 18 existing rows HOLD") + `§2 Band 6 G.W14` + `§3
SHIP-in-G roll-up`. The §ALREADY-SOTA bulk binds: View Transitions,
`@starting-style`, `content-visibility`, individual-transform, `color-mix`,
text-wrap, the `@property` adopt, the CWV surface, the engine reference-impl, and
the hero a11y substrate are SOTA and untouched (`r-modern-web §4`); all 18
existing §S6 rows HOLD (`r-modern-web §1`).

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`, plus the live
`modern-web-guidance@latest retrieve` Baseline strings this audit recorded:

1. **The §S6 `CHECKLIST` array is the central artifact and it asserts
   completeness.** Verified live `scripts/proof-modern-web.mjs:401` `const
   CHECKLIST = [ ... ]`; the header comment (`:391-393`) states it is "a
   checked-in manifest of EVERY checklist row's disposition. The gate asserts no
   row is left un-dispositioned, and surfaces the score in the CI log." The gate
   loop (`:555-559`) fails on any row whose `disposition` is not in
   `DISPOSITIONS` ("un-dispositioned"), and the close message (`:590-592`) asserts
   "all ${CHECKLIST.length} checklist rows dispositioned (ALIGNED / OUT /
   N-A-with-reason)." The PASS line (`:631`) repeats the completeness claim. So
   the gate's contract is COMPLETENESS — and a manifest that omits new levers
   silently violates it (inv ε).

2. **The array carries exactly 18 rows today; all 18 HOLD.** Verified live: the
   `disposition:` entries at `:405,414,420,433,439,445,453,463,469,480,486,494,
   502,510,518,528,537,546` — 18 rows (C1–C6, H1/H2, H3, CSS1–CSS4, CSS6, CSS7,
   UX1, C5b, SEC1, SEC2). `r-modern-web §1` re-scored each on the live tree:
   every row's disposition HOLDS post-F — none flipped, none regressed. There is
   NOTHING to re-disposition among the existing rows.

3. **The corpus has GROWN since F authored the checklist — three new
   animation/CSS/demo-relevant levers have NO row.** Verified by the live corpus
   (137 guides, `r-modern-web §0/§3`) diffed against the 18-row manifest. The
   three missing levers (`r-modern-web MW-CHK-1`):
   - **`sibling-index()`/`sibling-count()`** (`dynamic-sibling-animations`) — the
     pure-CSS stagger lever, directly adjacent to kf's `stagger` primitive and the
     demo hero's per-word delay (`AnimatedText.vue:19` JS-computed
     `animationDelay`). **NO §S6 row.**
   - **Custom Highlight API** (`highlight-text-ranges`, `::highlight()`) — paint
     arbitrary text ranges without DOM mutation. **NO §S6 row.**
   - **`<dialog closedby>`** (`platform-controls-dismiss-dialog`) — declarative
     light-dismiss for native `<dialog>`. **NO §S6 row.**

4. **Each NEW lever re-scores N-A or OUT — none is a SHIP, so adding rows changes
   ZERO demo pixels.** Verified Baseline strings (live `modern-web-guidance@latest
   retrieve`, `r-modern-web §3`):
   - **`sibling-index()`** → N-A: "sibling-count() and sibling-index() has limited
     availability. **Unsupported in: Firefox.**" — NOT Baseline. The demo's
     per-word `animationDelay` is a Vue `v-for`-index template binding (idiomatic,
     works on all engines); swapping to `sibling-index()` would BREAK the stagger
     on Firefox (instant fallback = all-words-at-once) for a declarativeness gain
     only — a not-Baseline regression of a working surface the Mandate forbids.
     The engine's `stagger` is the strictly-more-general JS primitive over
     arbitrary targets (no engine threat) (`r-modern-web MW-NEW-1`).
   - **Custom Highlight API** → N-A: "Custom highlights: Newly available. …
     Baseline since 2026-03-24" — Baseline, but NO clean keyframes-demo fit: the
     one plausible surface (highlighting matched ranges in the CSS-paste / Monaco
     editor) is OWNED by Monaco's own decorations API; there is no honest demo
     seam where the API removes hand-rolled work (`r-modern-web MW-NEW-2`).
   - **`<dialog closedby>`** → OUT: "`<dialog closedby>` has limited availability.
     **Unsupported in: Safari.**" — NOT Baseline, AND the demo's only modal
     (`KeyboardShortcutsModal.vue:2`) is a reka-ui `<Dialog>` (a role-div + JS
     FocusScope, NOT a native `<dialog>`); `closedby` is a native-`<dialog>`
     attribute with no surface on a reka-ui role-div, and migrating reka-ui→native
     is a glass-ui/reka-ui seam (the existing H1/H2 OUT reason,
     `proof-modern-web.mjs:453-459`). Double-disqualified (`r-modern-web MW-NEW-3`).

5. **The gate already prints the re-scored table — adding rows is byte-cheap.**
   Verified live: the gate iterates `CHECKLIST` (`:555`) and always prints the
   table to CI log (`:604-613`, "Always print the re-scored table so the
   disposition is visible in CI log"), tail-truncated to 96 chars (`:609`). So
   three new rows with their `reason` text flow through the EXISTING print path —
   no new logic, no new gate, just three manifest entries (`r-modern-web
   MW-CHK-1` instrument).

6. **The forward motion (VT directional types) is STILL glass-ui-blocked — NOT
   this wave.** Verified live `r-modern-web MW-VT-1`: glass-ui advanced to 3.3.0
   but its `startViewTransition` is bare-callback-only
   (`node_modules/@mkbabb/glass-ui/dist/composables/motion/useViewTransition.d.ts:31`
   — `startViewTransition(mutate: () => void)`, no `{ types }`), and the demo
   still ships the bare callback (`useSceneTransition.ts:32`). H-1 did NOT land in
   3.3.0; B-1 stays BOOKed → a glass-ui-HANDOFF the user drives in Band V, NOT a
   kf-demo wave (hand-rolling `document.startViewTransition({...})` would bypass
   glass-ui's feature-detect + instant fallback — the duplication
   `r-scroll-vt-2026 §0.2` forbids).

The wave's job: add exactly three rows to the §S6 `CHECKLIST`
(`proof-modern-web.mjs:401-553`) — `sibling-index()` N-A, Custom Highlight API
N-A, `<dialog closedby>` OUT — each with its live Baseline string + disposition
reason; the existing gate prints + scores them; deletion re-falsifies coverage.
ZERO demo pixels move.

---

## § Goal

**What lands** (one manifest extension — the existing `proof:modern-web` green,
with three more rows):

- **Three new §S6 rows in `CHECKLIST`** (`proof-modern-web.mjs:401`), each in the
  established row shape (`{ code, axis, disposition, reason }`):
  - `sibling-index()` — `disposition: "N-A-with-reason"`, reason = the
    not-Baseline-no-Firefox fact + the demo `v-for`-delay-is-correct +
    engine-stagger-is-more-general note (the live Baseline string,
    `r-modern-web MW-NEW-1`).
  - Custom Highlight API — `disposition: "N-A-with-reason"`, reason = Baseline
    2026-03-24 BUT no clean demo fit (Monaco owns editor highlighting),
    `r-modern-web MW-NEW-2`.
  - `<dialog closedby>` — `disposition: "OUT"`, reason = not-Baseline-no-Safari +
    reka-ui role-div seam (the H1/H2 OUT logic), `r-modern-web MW-NEW-3`.
- **The gate scores + prints them through its EXISTING path** — the
  `DISPOSITIONS`-membership check (`:556`) passes (all three are valid
  dispositions), the `CHECKLIST.length` in the close message (`:590`) updates from
  18 to 21, and the always-print table (`:604-613`) shows all 21 rows. No gate
  logic changes; no new clause.
- **No demo, library, or CI-behaviour change** — `proof:modern-web` is the only
  file touched; the three rows are N-A/OUT (none triggers an `anchor` re-confirm,
  unlike ALIGNED rows at `:568`). `proof:all` (`package.json:64`) re-runs green.

**Why:** the gate's contract is COMPLETENESS — "no row left un-dispositioned"
(`:391-392,590`). The corpus grew since F; three animation/CSS-relevant levers
have no row (§State 3); a contract that claims completeness while three levers are
unrecorded is the silent-incompleteness the Mandate forbids (inv ε — the checklist
asserts a coverage it no longer has). Each new lever re-scores N-A/OUT (§State 4),
so adding them is byte-cheap and changes ZERO demo pixels — the honest move, not
gold-plating. The fix keeps the gate truthful so a future reviewer reading the CI
table sees the full, current disposition.

**What does NOT land (recorded so no future lane re-raises):**
- **Any demo/library adoption of the three new levers** — REJECTED: each is
  N-A/OUT (not Baseline / no fit / a seam, §State 4). Adopting `sibling-index()`
  would regress the Firefox stagger; the Custom Highlight API has no demo seam;
  `<dialog closedby>` has no surface on the reka-ui role-div and is Safari
  -unsupported. The Mandate forbids manufacturing a deficit.
- **The VT directional-types adoption** — NOT this wave: glass-ui-blocked
  (§State 6); the additive `{ types }` overload is a glass-ui-HANDOFF in Band V
  the user drives, and the demo consume (B-1) is BOOKed behind it (MEASURE-FIRST —
  a directional slide of a paused snapshot may read WORSE than the calm cross-fade;
  `r-modern-web MW-VT-1`).
- **Re-disposition of the 18 existing rows** — REJECTED: all 18 HOLD on the live
  tree (§State 2, `r-modern-web §1`); none flipped, none regressed. Manufacture NO
  work there.

---

## § Scope

One manifest extension lands (S1); everything else in the band is HANDOFF / RECORD.
Every claim is `file:line`-grounded.

### S1 — add the 3 post-F catalog rows to the §S6 `CHECKLIST` (`r-modern-web MW-CHK-1`) — SHIP-in-G

**WHAT:** add three entries to the `CHECKLIST` array
(`proof-modern-web.mjs:401-553`), each in the established
`{ code, axis, disposition, reason }` shape:
1. `sibling-index()` (`dynamic-sibling-animations`) — `disposition:
   "N-A-with-reason"`; `reason`: limited availability, Unsupported in Firefox →
   not Baseline; the demo's per-word `animationDelay` is a correct Vue
   `v-for`-index binding that works on all engines; the engine `stagger` is the
   strictly-more-general JS primitive (no engine threat). Trigger to revisit:
   Firefox ships it.
2. Custom Highlight API (`highlight-text-ranges`, `::highlight()`) — `disposition:
   "N-A-with-reason"`; `reason`: Baseline 2026-03-24, but no clean
   keyframes-demo fit — Monaco owns editor range-highlighting; no honest demo seam.
3. `<dialog closedby>` (`platform-controls-dismiss-dialog`) — `disposition:
   "OUT"`; `reason`: limited availability, Unsupported in Safari → not Baseline;
   AND the demo's only modal is a reka-ui role-div (not native `<dialog>`), so the
   attribute has no surface — the H1/H2 OUT seam logic (`:453-459`).
   Double-disqualified.

**WHY:** §State 1/3/4/5 — the gate asserts completeness ("no row left
un-dispositioned"), the corpus grew, three levers have no row, and each re-scores
N-A/OUT so the rows are byte-cheap and pixel-free. Adding them makes the
completeness contract TRUE again (inv ε). The existing gate scores + prints them
through its existing path (no new clause); the only delta is three more rows in
the manifest and `CHECKLIST.length` 18 → 21.

> **HANDOFF / RECORD in this band (named, NOT this wave) — `r-modern-web`:**
> - **MW-VT-1 — View-Transition directional `types`** — **glass-ui-HANDOFF (Band
>   V)** + demo BOOK (B-1), MEASURE-FIRST. glass-ui 3.3.0's `startViewTransition`
>   is STILL bare-callback-only (`useViewTransition.d.ts:31`, §State 6); the
>   additive `{ types }` overload is glass-ui-owned (the user drives it under
>   relaxed inv-16); the demo consume rides it, never hand-rolls
>   `document.startViewTransition({...})`. Verify the directional slide composes
>   with the `useSceneSwap` spring stand-down BEFORE shipping (a paused-snapshot
>   slide may read worse than the calm cross-fade).
> - **MW-INV-1 — Invoker `command`/`commandfor` teaching scene** — **BOOK
>   (HOLDS)**. The wholesale `@click`→Invoker rewrite stays KILLED (Vue-idiom
>   collision, no measured win); the one SHIP-candidate is a single self-contained
>   `<button command>` teaching scene (a demo-content wave with appetite for a new
>   scene), NOT a touch of the existing `@click` controls.
> - **MW-IS-1 — `interpolate-size`/`calc-size()` (`height:0→auto`)** — **RECORD
>   (HOLDS)** + value.js-HANDOFF (the `calc-size()` parser, GAP-NAMED). Chrome-only
>   (no FF/Safari); native delegation stays withheld until Baseline; the demo's
>   collapsible panels work via Vue `<Transition>`/engine springs. (Cross-ref
>   `r-animation-sota G26-4` / `G.W13 §Folds`.)
> - **MW-NEW-1/2/3** — the three levers ARE this wave's rows (RECORD/RECORD/OUT);
>   none is a demo/library adoption (see §State 4).

---

## § Hard gate (the existing `proof:modern-web` — falsifiable · re-runnable · MUST bite)

The wave closes when the EXISTING `proof:modern-web` gate VERIFIES with the three
new rows (the gate already bites; this wave extends its manifest, not its logic).
The instrument is `proof:modern-web` (`package.json:47`), in `proof:all`
(`package.json:64`):

1. **The gate PASSES with 21 rows — all three new rows are dispositioned.** The
   `DISPOSITIONS`-membership loop (`proof-modern-web.mjs:555-559`) passes (the
   three new dispositions are `N-A-with-reason`/`N-A-with-reason`/`OUT`, all
   valid), the close message asserts "all 21 checklist rows dispositioned"
   (`:590`, `CHECKLIST.length` now 21), and the always-print table (`:604-613`)
   lists all 21. **BITE:** give any new row an invalid `disposition` → the
   un-dispositioned check (`:556-560`) reds.

2. **Deletion re-falsifies the coverage claim (the mutation control).** Deleting
   any of the three new rows from `CHECKLIST` returns the manifest to a state
   where a known catalog lever is unrecorded — the recorded-coverage claim in the
   close/PASS message (`:590,631`) is again false (the completeness the gate
   asserts no longer matches the corpus). **BITE:** this is the
   `r-modern-web MW-CHK-1` mutation control — delete a new row → the gate's
   completeness claim is silently false again (the exact drift this wave closes).
   The re-runnable witness: the row count `CHECKLIST.length` must read 21, and the
   three codes (`sibling-index`, custom-highlight, `dialog-closedby` — or the
   chosen codes) must each be present in the printed table.

3. **Each new row's Baseline reason is the LIVE catalog string — not asserted.**
   The three `reason` fields carry the live `modern-web-guidance@latest retrieve`
   strings (`sibling-index()` no-Firefox; Custom Highlight Baseline 2026-03-24
   no-fit; `<dialog closedby>` no-Safari, §State 4). **BITE:** a reviewer re-runs
   `npx -y modern-web-guidance@latest retrieve <guide> | grep -i
   "limited\|unsupported\|baseline since"` and confirms the row's reason matches;
   a stale/invented Baseline string is a finding (inv ε — the row asserts a
   coverage fact it must be able to re-confirm).

4. **No demo/library/CI-behaviour regression — the fix is manifest-only.**
   `proof:modern-web`'s other clauses (corpus-on-disk, Monaco-deferred bundle
   probe, font-preload, demo-yield, loop-yield, hover-warmup) and the 18 existing
   §S6 rows stay green + byte-identical; `npm test` stays green; ZERO demo pixel
   moves (the three rows are N-A/OUT — none triggers an `anchor` re-confirm at
   `:568`). **BITE:** any other-clause regression, any existing-row flip, or any
   non-`proof-modern-web.mjs` file edit attributed to this wave reds (the wave is
   manifest-only).

**The completeness discipline (the wave's non-negotiable).** The three rows
EXTEND the EXISTING `CHECKLIST` manifest — they do NOT mint a parallel
completeness gate. If a fourth catalog lever surfaces later, it is one more row in
the SAME manifest, scored + printed by the SAME path. The gate that already bites
on an un-dispositioned row now bites on the deletion of a known lever's row.

---

## § Folds

Retires (by finding id):
- **`r-modern-web MW-CHK-1`** (the §S6 checklist missing 3 post-F catalog rows —
  the completeness drift) — S1 + gate clauses 1/2.
- **`r-modern-web MW-NEW-1`** (`sibling-index()` — RECORD, not Baseline) — folded
  as the N-A row + gate clause 3.
- **`r-modern-web MW-NEW-2`** (Custom Highlight API — RECORD, no clean fit) —
  folded as the N-A row + gate clause 3.
- **`r-modern-web MW-NEW-3`** (`<dialog closedby>` — OUT, reka-ui seam + Safari)
  — folded as the OUT row + gate clause 3.

**Routed to HANDOFF / BOOK / RECORD (named, NOT this wave):**
- **MW-VT-1 — VT directional `types`** — **glass-ui-HANDOFF (Band V)** + demo BOOK
  (B-1), MEASURE-FIRST. glass-ui 3.3.0 still bare-callback-only (§State 6).
- **MW-INV-1 — Invoker teaching scene** — **BOOK** (the wholesale rewrite stays
  KILLED; one showcase-scene SHIP-candidate).
- **MW-IS-1 — `interpolate-size`/`calc-size()`** — **RECORD** + value.js-HANDOFF
  (the parser); native delegation withheld until Baseline.

**ALREADY-SOTA — manufacture NO work (`r-modern-web §4`):** View Transitions,
`@starting-style`, `content-visibility`, individual-transform, `color-mix`,
text-wrap (`pretty`/`balance`), the `@property` adopt, the CWV/INP surface, the
engine reference-impl posture, the hero a11y substrate, and the `proof:modern-web`
gate's 7 clauses + 18 existing §S6 rows (all HOLD, `r-modern-web §1`).

---

## § Design decisions (the trade-offs RESOLVED)

1. **Make the completeness contract TRUE — do NOT suppress it.** RESOLVED: the
   gate asserts "no row left un-dispositioned" (`proof-modern-web.mjs:391-392,590`)
   while three catalog levers are unrecorded — a silent-incompleteness. There are
   two ways to resolve a coverage drift: weaken the contract (drop the completeness
   claim) or satisfy it (add the rows). The first is the escape-hatch the Mandate
   forbids; the second is the honest fix and is byte-cheap because each lever
   re-scores N-A/OUT (none is a SHIP). RESOLVED: add the rows. Trade-off: the
   manifest grows by three rows — but a truthful completeness gate is worth three
   N-A/OUT entries, and the gate already prints + scores them (§State 5).

2. **Each new lever is N-A/OUT, NOT a SHIP — record the refusal, don't adopt.**
   RESOLVED: `sibling-index()` is not Baseline (no Firefox) and adopting it would
   regress the working Vue `v-for` stagger on Firefox; the Custom Highlight API
   has no demo seam (Monaco owns editor highlighting); `<dialog closedby>` has no
   surface on the reka-ui role-div and is Safari-unsupported (§State 4). Recording
   each as N-A/OUT — with the live Baseline string + the reason — is the honest
   disposition; manufacturing a demo adoption would be gold-plating a not-Baseline
   nicety the Mandate forbids. Trade-off: the table carries three visible
   "not adopted" rows — but a visible, reasoned refusal beats a silent omission
   (and a future reviewer sees exactly WHY each is not adopted, with a re-runnable
   Baseline check, gate clause 3).

3. **Extend the EXISTING manifest — no parallel completeness gate.** RESOLVED:
   the three rows go into the ONE `CHECKLIST` array the gate already iterates
   (`:555`), scores (`:556`), and prints (`:604-613`) — NOT a second gate or a
   separate "new-levers" manifest. A parallel structure would split the
   completeness claim across two surfaces (anti-DRY) and let one drift while the
   other passes. Folding into the one manifest means the gate that bites on an
   un-dispositioned row also bites on a deleted known-lever row (clause 2), one
   instrument. Trade-off: none — this is the principled extension; the manifest is
   the single source of the disposition truth.

4. **This wave is `scripts/proof-modern-web.mjs`-only — ZERO demo/library
   surface.** RESOLVED: the fix is a gate-completeness correction, not a demo
   change; the three rows are N-A/OUT, so no demo pixel moves and no library code
   is touched. The only file edited is the gate manifest (the instrument, not
   behaviour). Trade-off: none — keeping the fix to the gate manifest is the
   minimal, honest scope (the §ALREADY-SOTA modern-web surface is exemplary and
   must be left alone, `r-modern-web §4`).

5. **The VT-types forward motion is a glass-ui-HANDOFF, NOT a kf-demo wave.**
   RESOLVED: the one real forward motion the F lanes named (VT directional types)
   is glass-ui-blocked — 3.3.0's `startViewTransition` is bare-callback-only
   (`useViewTransition.d.ts:31`, §State 6). The enabler is glass-ui-owned (the
   additive `{ types }` overload), so under relaxed inv-16 the user drives it in
   Band V; the demo consume (B-1) is BOOKed behind it (MEASURE-FIRST). The demo
   must NOT hand-roll `document.startViewTransition({...})` — that bypasses
   glass-ui's feature-detect + instant fallback (`r-scroll-vt-2026 §0.2`).
   Trade-off: the demo's scene-swap stays a calm cross-fade until glass-ui ships
   the overload — but that is correct (a directional slide of a paused snapshot may
   read worse, and hand-rolling the platform call duplicates glass-ui's contract).
   Recorded here so this wave does NOT manufacture a VT-types demo change.
