# Lane R1-15 — Cross-repo asks, consumes + coordination boundaries

**Finding-ID prefix:** XR- · **Date:** 2026-07-16 · **Scope:** read-only across
keyframes.js + siblings (glass-ui, value.js, atlas, sci-report/atlas).

## Verdict

The keyframes V tranche has genuinely begun the cross-repo bookkeeping: a real
`docs/tranches/V/coordination/INBOUND-LEDGER.md` captures all four Atlas rows and
the Glass HeaderRibbon row with terminal disposition hooks, and the two
outbound U-era letters (`KF-TO-VALUEJS-U.md`, `KF-TO-GLASSUI-U.md`) are now
substantially MOOT-BECAUSE-CONSUMED — value.js 4.0.0 + keyframes 6.0.0 shipped
and absorbed every §B/§C/§D/§E value ask, and the keyframes-origin Glass asks
carry BI wave owners. That is the sound core. The defects are at the live
consume edge, not the paper trail: **the working tree consumes an undeclared,
unpublished, out-of-band Glass 7.0.0** (release-rail and versioned-artifact
violation, and a non-interruption breach of Glass mid-BI/P/Q), the **explicit
one-line re-home Glass requested was not performed**, the **Atlas outbound
inbox path in the ledger points at a directory that does not exist**, and the
**HeaderRibbon consumer edits are stale NOW** because the demo is already
building against Glass 7. Release rail as it must be encoded: value 4.0.0 (done)
→ keyframes 6.0.0 (done, npm `latest`) → Glass 7 (PENDING, unpublished) → atlas
7.0.0 (staged in `sci-report/atlas`). Keyframes owes exactly one remaining
consumer boundary — the post-Glass-7 demo/dev-lock refresh — and it must not be
started against an unpublished Glass.

---

## XR-1 — Demo consumes undeclared, unpublished, out-of-band Glass 7.0.0 (release-rail + non-interruption breach)

**Severity:** P1 · **Family:** premature-consume / phantom-dependency

**Evidence.**
- Working-tree `package.json` dropped the Glass edge entirely. Committed HEAD
  (`git show HEAD:package.json`, lines 70-72) carried
  `optionalDependencies: { "@mkbabb/glass-ui": "6.0.0" }`; the working tree has
  NO `optionalDependencies` block and `grep -n glass package.json` → *NO
  glass-ui in package.json* (verified: absent from dependencies, devDependencies,
  optionalDependencies). This matches the value.js handoff's Keyframes6 fact:
  "exports: exactly root and `./engine`; runtime dependency exactly Value
  `4.0.0`; no Glass runtime, peer or optional edge"
  (`value.js/docs/tranches/V/HANDOFF-2026-07-16.md` §3).
- `package-lock.json` has NO `node_modules/@mkbabb/glass-ui` entry
  (`grep -n 'node_modules/@mkbabb/glass-ui"' package-lock.json` → empty).
- Yet `node_modules/@mkbabb/glass-ui/package.json` → `"version": "7.0.0"`. It is
  a real directory (not a symlink; `readlink` → not a symlink), timestamped
  `Jul 16 05:17` — an out-of-band `npm install <path>`-style copy, not a
  manifest/lock-resolved install.
- Glass 7.0.0 is **unpublished and untagged**: value.js handoff §4 — "Glass7 has
  no consumable rehearsal or registry coordinate"; glass-ui
  `docs/tranches/BI/HANDOFF-ACTIVE-EXECUTION.md` — "local Glass `7.0.0` is
  **unpublished and untagged**."
- The demo hard-imports it: `demo/components/instrument/shell/EditorShell.vue:116`
  `import { HeaderRibbon } from "@mkbabb/glass-ui/header-ribbon";` (plus other
  glass subpaths across the demo).

**Why it is a defect.** keyframes' own consume discipline forbids exactly this:
`KF-TO-GLASSUI-U.md` — "Keyframes will wait for a versioned artifact and will
not consume a worktree link or unpublished API" and requires the immutable Glass
6→7 packet before any edge update. The value.js rail places Glass publication at
**W33a**, *after* keyframes 6 — so no keyframes surface may pin/consume Glass 7
until it publishes. The current state is the same "mixed old/new topology…not a
valid registry consumer graph" hazard value.js is fighting in its own tree
(HANDOFF §5). It also silently breaches the non-interruption constraint (Glass
is mid-BI/P/Q; coordination is bounded-inbox-only), because the demo is now
coupled to Glass's dirty worktree bytes.

**Disposition (BUILD, V coordination + demo-lock wave).** Encode the rail
explicitly: the demo/dev-lock stays on the last *published* Glass (6.0.0) — or is
held RED — until Glass 7 publishes its immutable packet (W33a). Re-declare
`@mkbabb/glass-ui` as a pinned **devDependency** (demo-only; the library edge
stays dropped) and regenerate the lockfile against the *published* Glass 7 in
the post-Glass-7 refresh wave. The out-of-band 7.0.0 island must be replaced by
a registry install, never carried as release evidence.

---

## XR-2 — Glass's explicit re-home ask (mark → V/coordination/) not performed

**Severity:** P2 · **Family:** dangling-inbound-ask

**Evidence.** Glass's producer reply issued a specific one-line instruction to
the keyframes session:
`glass-ui/docs/tranches/BI/coordination/glass-outbound-2026-07-16-producer-reply.md`
§6 (owner, 2026-07-17) — the HeaderRibbon consumer-update mark "was placed under
`docs/tranches/U/`; keyframes' CURRENT developing tranche is **V**… re-homing it
to `docs/tranches/V/coordination/` is the keyframes session's one-line act at
its boundary (a glass-side write into the sibling tree was declined)."

The act was not done:
- `ls docs/tranches/V/coordination/` → only `ATLAS-INBOUND-2026-07-16-consumer-crossing-report.md`
  and `INBOUND-LEDGER.md`; the HeaderRibbon mark is absent here.
- The file still lives only at
  `docs/tranches/U/GLASS-INBOUND-2026-07-16-headerribbon-consumer-updates.md`.
- `INBOUND-LEDGER.md` even cites it at the U path (Sources table: row
  `docs/tranches/U/GLASS-INBOUND-2026-07-16-headerribbon-consumer-updates.md`),
  so the ledger inherited the misfiling rather than curing it.

**Disposition (FOLD into V coordination wave).** Move (or copy with a provenance
note) the mark to `docs/tranches/V/coordination/`, and repoint the INBOUND-LEDGER
Sources row. One-line act, explicitly owed to Glass.

---

## XR-3 — Atlas outbound inbox path in INBOUND-LEDGER points at a non-existent directory

**Severity:** P2 · **Family:** coordination-path-drift

**Evidence.** `INBOUND-LEDGER.md` row IN-ATLAS-4 records the outbound target as
`atlas/docs/tranches/P/coordination/`. The authoritative path in the source
packet is different — `ATLAS-INBOUND-2026-07-16-consumer-crossing-report.md` §2:
"send the migration ledger + evidence tuple … to our inbox
(`sci-report/atlas/docs/tranches/P/coordination/`)."

- The standalone repo `/Users/mkbabb/Programming/atlas` has **no `docs/` dir at
  all** (`ls -la` → CHANGELOG/LICENSE/MIGRATION/PROVENANCE/README/build/dist/…;
  `atlas/docs/tranches/P/coordination/` → PATH ABSENT). It is clean master at
  atlas 4.0.0 consuming the *old* generation (`package.json`: glass `^6.0.0`,
  keyframes `^5.3.5`, value `^3.1.0`) — i.e. it has NOT crossed to the new pair.
- The real, active atlas consumer is the copy inside sci-report:
  `sci-report/atlas` on branch `feat/tranche-k-arc`, and
  `sci-report/atlas/docs/tranches/P/coordination/` EXISTS (5 files incl.
  `2026-07-16-codex-p-totality-handoff.md`). This is where the crossing report
  says atlas is "pre-staged for the 7.0.0 cut."

So the ledger's dropped `sci-report/` prefix would route a future keyframes
evidence tuple to a directory that does not exist, on the wrong (stale) atlas.

**Disposition (FOLD).** Correct IN-ATLAS-4's target to
`sci-report/atlas/docs/tranches/P/coordination/` and record the two-atlas
disambiguation (standalone master 4.0.0 = old gen; sci-report/atlas = active
p/totality successor) so no cutting wave mis-delivers.

---

## XR-4 — HeaderRibbon consumer edits are stale NOW, not "at the future refresh"

**Severity:** P2 · **Family:** stale-consumer-binding

**Evidence.** The Glass mark
(`GLASS-INBOUND-2026-07-16-headerribbon-consumer-updates.md`) says HeaderRibbon
is persistent-only in Glass 7: the `mode` prop, `anchorLabel`, anchor slot and
collapsible machinery are removed; keyframes must (1) drop `mode="persistent"`
at `EditorShell.vue:16`, and (2) delete the dead `defineExpose({ headerRibbonRef })`
at `:197`. Both are un-applied:
- `EditorShell.vue:16` — `<HeaderRibbon ref="headerRibbonRef" mode="persistent" placement="right">`
- `EditorShell.vue:197` — `defineExpose({ headerRibbonRef });`
  (and `:187` `useTemplateRef(...headerRibbonRef)` feeds it).

The mark frames these as a *future* "post-Glass-7 demo/dev-lock refresh" act.
But per XR-1 the demo is ALREADY installed against Glass 7.0.0, where `mode` is
no longer a prop — so `mode="persistent"` is a live stray no-op attribute on the
toolbar div *today* (the "stale-binding-silently-no-ops" class the mark itself
names). INBOUND-LEDGER IN-GLASS-1 flagged "verify the migrated 18-consumer set
already conforms (the transaction predates this packet — check for drift)" — the
drift is real and unresolved.

**Disposition (BUILD, bundled with XR-1's demo-lock wave).** Apply both
deletions in the same commit that pins the *published* Glass 7. Until Glass 7
publishes, either hold the demo on published Glass 6 (where `mode` still exists)
or mark the demo RED — do not leave it building green against unpublished 7.

---

## XR-5 — "Atlas 2.0" stale successor naming in outbound letter + memory

**Severity:** P3 · **Family:** doc-drift

**Evidence.** `KF-TO-GLASSUI-U.md` (SCI/Atlas paragraph): "…before Atlas 2.0
consumes the pair." MEMORY's constellation note likewise queues "Atlas 2." But
atlas is at **4.0.0** on master and its next coherent tuple is **atlas 7.0.0**
(glass 7 + keyframes 6 + value 4), per both the atlas crossing report §2 and
INBOUND-LEDGER IN-ATLAS-4. The "2.0" label is a stale prediction from an earlier
constellation epoch.

**Disposition (RETIRE the label).** In the V outbound packet / FINAL, refer to
the atlas successor as **atlas 7.0.0** (or "the next atlas coherent tuple"); do
not re-import "Atlas 2.0". Re-pin the MEMORY constellation note.

---

## XR-6 — Keyframes-origin Glass asks have no keyframes-provenance owner row; only atlas-co-attributed BI rows

**Severity:** P3 · **Family:** provenance-ambiguity (work owned, credit shared)

**Evidence.** The U outbound (`KF-TO-GLASSUI-U.md`) claims GU-1/GU-2/BG-7 as
keyframes asks shipped in Glass 5.0.0, and GU-3/GU-4/BG-1..12 as tracked. In the
Glass ledgers those IDs are owned — but attributed to **atlas**, not keyframes:
`glass-ui/docs/tranches/BI/coordination/INBOUND-MARKS.md` maps GU-1 → "atlas
GU-1/O-E2 §Inbound" (BI.W-SURFACE-EXTRACT), GU-3 asks → BI.W-SLIDER-THUMB-NAME +
roster rows, and BG-10/ToggleChip → BI.W-CHIP-FOLD. There is **no dedicated
keyframes-inbound coordination file** in Glass
(`ls docs/tranches/BI/coordination/ | grep -i keyframe` → none;
`grep -rln 'KF-TO-GLASSUI\|MbabbMenu' docs/tranches/BI/coordination/` → none).
So the GU-/BG- namespace is shared between the two glass consumers and the
work is owned, but no row records *keyframes* as the requester.

**Disposition (FOLD, informational).** When the batched KF→Glass letter is cut,
state that keyframes rides the shared GU-/BG- rows (owned via BI waves) and does
NOT need a separate glass-side provenance file; record this so the next audit
doesn't re-flag it as a dropped ask.

---

## Ledgers

### Inbound (sibling → keyframes) with current marks

| Row | From | Ask | Current mark (verified) |
|---|---|---|---|
| IN-ATLAS-1 | atlas | 5.3.5→6.0.0 was the cleanest constellation major; zero engine-consumer edits | RECORDED, sound — matches crossing report §0; no action owed |
| IN-ATLAS-2 | atlas | rationale for exact `value.js@4.0.0` pin (deliberate vs widen to caret) | OPEN decision row — one ledger line owed in V outbound + `published-surface.md` |
| IN-ATLAS-3 | atlas | `TimingFunction`/`EasingFunction` dual-origin census; 3 sites chase on re-home/rename | FENCE row — freeze `TimingFunction` published home/name/sig in every colocation wave |
| IN-ATLAS-4 | atlas | consume posture; send evidence tuple to atlas inbox on any new cut | ENCODED but with WRONG path (see XR-3) |
| IN-GLASS-1 | glass-ui | HeaderRibbon persistent-only consumer updates | CAPTURED but mark misfiled (XR-2) + edits unapplied (XR-4) |

### Outbound (keyframes → sibling) with owner rows

| Ask | Target | Status (verified) |
|---|---|---|
| §B `parseTimingFunction` | value.js `./easing` | CONSUMED — value 4.0.0 `/css` owns `parseTimingFunction` (V.md §mech-line 119); kf 6.0.0 CHANGELOG "One timing-function authority" |
| §C authored-plain unflatten | value.js | RESOLVED kf-side — kf 6.0.0 owns structural interp slots; "One authored interpolation model" removed the projection |
| §D diagnostics + unit taxonomy | value.js `./parsing`/`./units` | MOOT — value 4.0.0 removed `/parsing` and `/units` entirely; kf owns DOM resolution |
| §E KF-7 `PropertyDescriptor` rename | value.js root/`./parsing` | MOOT — no `/parsing` subpath in value 4.0.0; collision gone |
| §I D-GAP-1/5/6 (easing presets / shallow flatten / bezier sampler) | value.js | NOT VERIFIED against value 4.0.0 exports (coverage gap) |
| GU-1/GU-2/BG-7 | glass-ui | SHIPPED in Glass 5.0.0 (per U letter); owned in BI ledgers (atlas-attributed) |
| GU-3/GU-4/BG-1..12, BG-10/ToggleChip | glass-ui | OWNED — BI waves (BI.W-SURFACE-EXTRACT / -SLIDER-THUMB-NAME / -CHIP-FOLD) per INBOUND-MARKS |
| MbabbMenu Tailwind-prose reword | keyframes-owned | VERIFY — U letter cites `MbabbMenu.vue:59`; the arbitrary-value literal now reads at `:6` (`min-w-[var(--dock-panel-width)]`); line-shift, disposition unconfirmed |

### Glass-root defect batch candidates (seed the KF→Glass letter)

| Candidate | Source | Note |
|---|---|---|
| Dock double-click chronic | MEMORY `project_dock_doubleclick`; `docs/tranches/U/audit/lane-06-chronic-census.md:139` | External glass-ui-root defect, never patched in demo; re-verify against Glass 7 dock and re-raise if it persists |
| HeaderRibbon persistent-only conformance | XR-4 | Consumer edit, not a glass-root defect — do NOT put in the glass letter |
| glass-ui homogeneity/idiom reference | `docs/tranches/U/audit/glassui-idioms-post-bh.md` | Reference doctrine (feature-dir colocation), not an open defect |
| Historical gap apparatus (GU-1/2, BG-5/11, tripwire blindness) | `docs/tranches/U/audit/lane-28-constellation-parsethat-glassui.md` | SUPERSEDED — U dissolved the apparatus; library dropped the glass edge at 6.0.0; do not re-book |

### Coordination boundaries the V tranche must encode

1. **Release rail (order-of-record):** value 4.0.0 ✅ (immutable, gitHead
   `44ddaff7…`) → keyframes 6.0.0 ✅ (npm `latest`, gitHead `5a9183a7…`,
   verified via `npm view`) → Glass 7 ⏳ (unpublished; publishes at value.js
   W33a) → atlas 7.0.0 (staged in `sci-report/atlas`). Keyframes consumes Glass
   ONLY as a published, immutable artifact — never the current out-of-band 7.0.0.
2. **Non-interruption:** Glass is mid-BI/P/Q; all coordination is bounded-inbox
   files, no glass worktree writes, no consuming its dirty bytes (XR-1 currently
   violates this).
3. **Keyframes' sole remaining consumer boundary:** the post-Glass-7
   demo/dev-lock refresh — re-home the mark (XR-2), apply the HeaderRibbon
   deletions (XR-4), re-declare glass-ui as a pinned demo devDependency and
   regenerate the lock against published Glass 7 (XR-1).
4. **Outbound close obligations of any V-era cut:** ship the evidence tuple
   (version, gitHead, integrity) to `sci-report/atlas/docs/tranches/P/coordination/`
   (XR-3 corrected path); write the exact-pin rationale ledger line (IN-ATLAS-2);
   keep `TimingFunction` a frozen published surface or carry the atlas
   3-site migration ledger (IN-ATLAS-3).

---

## Negatives (checked and found sound)

- **keyframes 6.0.0 is genuinely shipped**, not a paper claim: `npm view
  @mkbabb/keyframes.js dist-tags` → `latest: 6.0.0`; `@6.0.0 gitHead` →
  `5a9183a7afe24702081a7b87c8adc7286ddce9a0` (matches value.js handoff §3). The
  working tree's `package.json` version `6.0.0` + `value.js 4.0.0` dep matches
  the immutable Keyframes6 producer facts.
- **KF-TO-VALUEJS-U is fully consumed** by the value4→kf6 cut; no dangling
  value.js ask of substance survives (see outbound table).
- **The V INBOUND-LEDGER is real and non-vacuous:** all four atlas rows + the
  glass row carry concrete disposition hooks (fence rows, decision rows, encode
  obligations), not TBD placeholders.
- **The library correctly dropped its optional glass edge at 6.0.0** — consistent
  with value.js handoff Keyframes6 ("no Glass runtime, peer or optional edge").
  The defect is only that the DEMO's glass consumption is now undeclared +
  premature (XR-1), not that the drop was wrong.
- **Atlas consumed keyframes 6.0.0 cleanly** (crossing report §0: zero
  engine-consumer edits; every symbol signature survived; `getTimingFunction`
  removal had zero atlas call sites).
- **value.js 4.0.0 is immutable/shipped** and its exports (`/color /value /css
  /easing /math /transform /quantize`; no root/`/parsing`/`/units`) match what
  keyframes 6.0.0 consumes.

## Coverage gaps

- Did NOT verify value.js 4.0.0 actually delivered D-GAP-1/5/6 (quart/quint
  easing presets, shallow/leaf flatten, bezier data sampler) — needs a read of
  the shipped `/easing`, `/value`, `/transform` export surfaces. R1-09 territory.
- Did NOT drive the demo live to confirm the Glass 7 `mode=` stray-attribute
  render or the dock double-click chronic against Glass 7 (read-only lane; no
  browser run). Live confirmation belongs to a demo/appearance lane.
- Did NOT resolve the MbabbMenu.vue reword disposition (U letter `:59` vs current
  `:6` arbitrary-value literal) — line-shift makes the "already done?" call
  ambiguous; hand to the colocation/demo lane.
- Did NOT audit whether the ~18 HeaderRibbon/glass demo consumers beyond
  EditorShell conform to Glass 7's removed surfaces (INBOUND-LEDGER IN-GLASS-1's
  "18-consumer set") — enumerated only EditorShell's two sites.
- glass-ui and sci-report are actively dirty; sibling reads are point-in-time and
  may drift.
