# Lane R1-10 — Chronic + Deferred Ledger Archaeology

**Prefix:** CH- · **Date:** 2026-07-16 · **Tree:** `/Users/mkbabb/Programming/keyframes.js` @ working-tree `a59d3a22` (uncommitted K6/Glass-7 transaction live)

## Verdict

U's close prose (`FINAL-U.md`, 2026-07-15) declares 5.3.4 the *immutable terminal*
release, a two-command apparatus, expected-red/backlog machinery deleted, and
"**V inherits no U backlog, tripwire, or silently carried Keyframes row.**" The
mechanical dissolution claims largely hold in the live tree (proof:* collapsed to
two, six observations present and CI-scheduled, no surviving expected-red
machinery). **But the forward-looking constellation ledger did not survive its own
close by a single day.** npm now carries `5.3.5` and `6.0.0` (latest = `6.0.0`),
the working tree holds an entire uncommitted Keyframes-6 producer transaction plus
a Glass-7 demo-consumer slice, and the later `AGENTIC-HANDOFF-2026-07-16.md`
carries a 13-step Keyframes restart plan + a named documentation-correction list
forward — a de-facto V backlog. FINAL-U's named boundary (Glass 6 → kf successor
whose optional Glass edge is *exactly 6.0.0* → **Atlas 2.0**) is fully superseded
by the Glass-7 / K6 / Atlas-4 rail, yet the shipping transaction touched that very
sentence only to *reword* it, not re-decide it. Two P1 supersession/re-wording
findings, three P2/P3 residue-drift findings, four clean negatives.

---

## CH-01 — FINAL-U's "terminal 5.3.4 / no V backlog" close superseded within a day
**Severity:** P1 · **Family:** green-over-superseded / silent-backlog-inheritance

FINAL-U.md:161-165 records 5.3.4 as the immutable terminal U release with 5.3.3 as
"the preceding immutable published baseline," and FINAL-U.md:124-125 states "**V
inherits no U backlog, tripwire, or silently carried Keyframes row.**"

Evidence contradicting the terminal/no-backlog claim:
- `npm view @mkbabb/keyframes.js versions` → `[... "5.3.3","5.3.4","5.3.5","6.0.0"]`;
  `dist-tags` → `{ latest: '6.0.0' }`. So **5.3.5 and 6.0.0 both shipped after U's
  close**; FINAL-U mentions neither (5.3.5 is absent entirely from the U corpus).
- `package.json:3` = `"version": "6.0.0"`; `:69` = `"@mkbabb/value.js": "4.0.0"` —
  the working tree is a full uncommitted K6 producer transaction over the
  committed `a59d3a22` (v5.3.5) base.
- `AGENTIC-HANDOFF-2026-07-16.md` (untracked, `?? docs/tranches/U/AGENTIC-HANDOFF-2026-07-16.md`)
  §5 lists a 13-step "Exact Keyframes restart after immutable Glass 7" plan and §3
  names a 65-path consumer slice + documentation corrections V must execute. That
  is precisely the "carried Keyframes row" FINAL-U says does not exist.

The close was honest for the *apparatus dissolution* but its release/constellation
coordinates were stale within 24 h. The handoff is the real V-inheritance; FINAL-U
should not be read as the operative forward record.

**Disposition (fold):** V opens with the handoff — not FINAL-U — as the inherited
ledger. Mint an explicit V row: "reconstruct 65-path K6 consumer slice on immutable
`5a9183a7`, consume immutable Glass 7 as demo-only devDep, deploy." Retire the
FINAL-U "no V backlog" sentence as falsified.

---

## CH-02 — FINAL-U constellation boundary re-worded, not re-decided, in the shipping transaction
**Severity:** P1 · **Family:** re-worded-chronic / stale-forward-coordinate

FINAL-U.md:114-122 (working tree) still reads: "after **Glass 6.0.0** is immutable,
Keyframes publishes the smallest compatible successor whose **optional Glass edge
is exactly 6.0.0** … before **Atlas 2.0** consumes the tuple."

Every coordinate in that sentence is dead:
- **Glass edge exactly 6.0.0** — the K6 that actually shipped has *no* Glass
  runtime/peer/optional edge at all (handoff §2 line 129-131; `package.json` has no
  glass-ui dependency). The demo edge target is Glass **7.0.0** as a devDependency
  (handoff §5 step 6), not an optional 6.0.0 edge.
- **Atlas 2.0** — handoff §6 line 444: "Atlas **4.0.0** is immutable at tag object
  `9d959675…`." Atlas is two majors past FINAL-U's "2.0" plan.

The transaction *touched this exact clause* — `git diff HEAD -- docs/tranches/U/FINAL-U.md`
shows the ONLY boundary edit is a cosmetic reword of the MbabbMenu literal
(`text-[var(...)]` → `arbitrary-value-shaped`, FINAL-U.md:119). The stale Glass-6 /
6.0.0 / Atlas-2.0 coordinates were left verbatim while the author's hands were on
the file. This is the exact "re-word instead of re-decide" pattern the owner edict
forbids — a chronic row edited in place to look maintained without re-adjudicating
its (now false) content.

**Disposition (retire/rewrite):** V rewrites the FINAL-U constellation boundary to
the real Glass-7 / K6 / Atlas-4 rail, or annotates it "SUPERSEDED — see
AGENTIC-HANDOFF-2026-07-16 §0 DAG." Do not carry "optional Glass edge exactly
6.0.0" or "Atlas 2.0" into any V ledger.

---

## CH-03 — Removed-feature documentation residue uncorrected AND mischaracterized
**Severity:** P2 · **Family:** doc-drift / masked-residue

Handoff §3 (lines 253-259) flags as "correct current prose/API residue directly …
before close": `README.md:322,428,433,764` and `docs/published-surface.md:151`
"still describe removed weighted blending"; `demo/DESIGN.md:67` "still shows the
removed `Card surface="cartoon"` shape."

All still present in the tree:
- `README.md:322,428,433,764` — `grep -ni weight README.md` confirms all four
  (e.g. :322 "weighted blending", :428 `| weighted-blend |`, :764 "weighted
  blending and a transport").
- `docs/published-surface.md:151` — "CC-3 refusals (`weighted` blend …".
- `demo/DESIGN.md:67` — "`Card surface="cartoon" tier="quiet"`".

Two defects in one row:
1. **Uncorrected** — the handoff names these as pre-close corrections; none is done.
   (Legitimately pending the consumer-slice commit, but it is a carried V residue,
   not resolved.)
2. **Mischaracterized** — "removed weighted blending" is imprecise. The weighted-
   blending *machinery survives in src* (`src/animation/group/weight.ts`,
   `weightSpring`/`weight`/`isWeightBlend`, `compositor.ts:257`, `springs.ts`). What
   the K6 diff actually removed is the public `BlendMode` *type keyword*
   (`git diff HEAD -- src/` shows `-export type BlendMode = CompositeOperator | "weighted";`
   and `-blendMode: BlendMode`). README's `weight`/`weightSpring` config references
   (README.md:286-294) therefore describe a *live* surface and are NOT stale. A
   blind "delete weighted-blending prose" correction per the handoff would delete
   accurate copy.

**Disposition (build):** V mints a precise correction row — remove only the
`BlendMode`/`weighted`-*keyword* references (the exact removed public symbol),
correct `Card surface="cartoon"`, and preserve the `weight`/`weightSpring` feature
copy. Verify against the packed public d.ts, not the handoff's coarse phrasing.

---

## CH-04 — MbabbMenu Tailwind-literal reword: a phantom row, cosmetically reworded and dropped from the handoff
**Severity:** P2 · **Family:** re-booked-phantom / dropped-disposition

FINAL-U.md:118-122 says the kf successor "also **rewords the Tailwind-scanned
arbitrary-value-shaped prose literal in `MbabbMenu.vue`**." Archaeology:
- The transaction's only edit to this clause reworded `text-[var(...)]` →
  `arbitrary-value-shaped` (CH-02 evidence) — making the description *vaguer*, not
  fixing a literal.
- The actual current bracket literal is `demo/app/dock/MbabbMenu.vue:6`
  `min-w-[var(--dock-panel-width)]` inside `<DropdownMenuContent class="…">` — a
  **legitimate Tailwind arbitrary-value class on a real element**, not a "prose
  literal." `grep -nE '\[' MbabbMenu.vue` returns only this line. There is no prose
  string shaped like a utility for Tailwind's scanner to wrongly harvest.
- The MbabbMenu Glass-7 migration (`git diff HEAD -- MbabbMenu.vue`) deleted the
  ~24-line D9 comment block wholesale; whatever prose literal FINAL-U referred to
  was removed *incidentally* by migration, never as a tracked disposition.
- The handoff §3 correction list (README/published-surface/DESIGN.md) **omits the
  MbabbMenu reword entirely** — the FINAL-U row was neither carried nor formally
  retired; it was silently dropped while the file it names was rewritten for other
  reasons.

Net: a row that names a likely non-existent defect, was cosmetically reworded in
place at U close, and then dropped from the successor ledger without a decision.

**Disposition (retire):** V formally retires the MbabbMenu-reword row as
"resolved-by-migration / no defect present" with the line:6 evidence, so it cannot
be re-booked a third time.

---

## CH-05 — "Nightly roster" cadence mislabel
**Severity:** P3 · **Family:** doc-drift

FINAL-U.md:53-55 and `.github/workflows/ci.yml:50,54,81,92` repeatedly call the
six-observation roster "nightly." The actual cron is `.github/workflows/ci.yml:16`
`cron: "17 3 * * 1"` = **weekly, Monday 03:17 UTC** (dow field = 1), not nightly.
`deploy-pages.yml:4` depends on "latest successful scheduled demo (`last-demo-green`)
to be an ancestor" — so the *deploy-ancestry freshness window is a week*, not a
day, which the "nightly" label misrepresents.

**Disposition (fold):** trivial — either change the cron to daily or relabel the
comments/FINAL-U prose "weekly roster." Fold into any V doc-hygiene wave.

---

## CH-06 — Stale K-era republish prose inside a doc marked LANDED/COMPLETE
**Severity:** P3 · **Family:** historical-residue

`docs/dogfood-inversion.md` header = "Status: LANDED (L.W8 S1) — the flip is
COMPLETE," yet `docs/dogfood-inversion.md:48` still reads "npm does NOT yet carry
those exports. **K.WZ does the K-tranche republish**." That is tranche-K-era
present-tense prose now false (6.0.0 is published; K.WZ is long past). A "COMPLETE"
doc carrying a live-tense un-done republish clause is exactly the kind of buried
plan the sweep hunts.

**Disposition (fold):** convert :48 to past tense or strike it; audit
`scroll-morph.md`/`color-fidelity.md` for the same tense residue (they were clean
on `TODO|pending|future|awaits` grep, but not swept line-by-line — see gaps).

---

## Negatives (checked and found sound)

- **Six-observation roster on disk & wired.** `scripts/observe/demo/` holds exactly
  the six FINAL-U-named files (`smoke`, `occlusion`, `usability`, `subject-animates`,
  `live-session`, `live-session-mobile`.mjs); `package.json:52` `demo:correctness →
  scripts/run-demo-roster.mjs` (present); `ci.yml:55,77` runs them on
  schedule/dispatch and publishes `last-demo-green`. No declared-capture-missing.
- **Expected-red / backlog machinery deleted from the live tree.** `grep -rn
  expected-red scripts/ src/ test/ package.json` finds only a *disclaiming* comment
  in `scripts/demo-roster.mjs:3` ("there are no hidden expected-red or tier
  classifications"). No classifier survives; U's deletion claim holds.
- **proof:* collapsed to two.** `package.json:50-51` = `proof:publish`,
  `proof:owner-golden` only; no third proof genre. Matches FINAL-U.
- **value.js pin is exact & registry-shaped.** `package.json:69`
  `"@mkbabb/value.js": "4.0.0"` (exact), matching handoff §2 immutable Value 4.

## Coverage gaps

- **GCF-03 (sci-report, unsent).** Handoff §6 line 456 says "GCF-03 remains unsent
  pending integrated native reproduction." Its home is `/Users/mkbabb/Programming/
  sci-report`; `grep GCF-03` over `sci-report/docs/` returned nothing (different
  path/naming, or the row lives only in the kf handoff). Cross-repo, active-agent,
  read-only — **status unverified in this lane**. V should confirm GCF-03 is a
  decided SCI row, not a kf-side orphan.
- **Full A-U per-row ledger not built.** `chronic` appears in 427 tranche-doc files,
  `defer` in 644, `tripwire` in 229. This lane sampled the FINAL-U/handoff named
  candidates rather than enumerating every historical row (scale). A complete
  A→U DECIDED/DISEASE table is a larger wave than one lane.
- **npm artifact identity not deep-verified.** Confirmed version list + dist-tags
  via `npm view` (read-only); did not fetch tarballs to verify the FINAL-U/handoff
  integrity/shasum/provenance hashes independently.
- **Glass 7 immutability unverifiable here.** Handoff's Glass-7-pending premise
  depends on the glass-ui repo (active agent, out of lane, read-only).
- **scroll-morph.md / color-fidelity.md** passed a keyword grep but were not swept
  line-by-line for encoded un-built plans (CH-06 shows the grep can miss present-
  tense stale clauses like dogfood-inversion:48, which only surfaced on read).

## Disease-row verdict (rode ≥2 closes un-decided?)

| Row | Minted | Rode | Disease? |
|---|---|---|---|
| Glass→kf-successor→Atlas boundary (CH-02) | U close (FINAL-U) | U close → reworded in K6 transaction | **No** (1 close), but exhibits re-word-not-decide behavior; will be a disease row if V re-words again |
| MbabbMenu Tailwind-literal reword (CH-04) | pre-U | U close (reworded) → dropped from handoff | **Borderline** — reworded once, then silently dropped; retire now to prevent a 2nd ride |
| README/DESIGN removed-feature residue (CH-03) | K6 transaction (handoff) | freshly minted, pending | **No** |
| dogfood-inversion:48 republish prose (CH-06) | tranche K | K→…→U (never updated) | **Yes-ish** — a false present-tense clause has ridden every close since K inside a "COMPLETE" doc |
