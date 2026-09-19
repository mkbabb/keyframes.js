# Tranche V — inbound communiqué ledger

> Every sibling→keyframes packet received during V formation, with a
> disposition hook. No row may close silently; each is either folded into a
> named wave/decision, answered in the consolidated outbound packet, or
> retired with rationale. Replies ship as ONE packet per sibling at formation
> close (the no-piecemeal law both sides observe).

## Sources

| Packet | Received | Channel |
|---|---|---|
| `docs/tranches/V/coordination/ATLAS-INBOUND-2026-07-16-consumer-crossing-report.md` | 2026-07-16 23:17 | Atlas/SCI consumer seat (P·TOTALITY lead); owner also relayed verbally — one source, one packet |
| `docs/tranches/V/coordination/GLASS-INBOUND-2026-07-16-headerribbon-consumer-updates.md` | 2026-07-16 17:35 | Glass BI/P/Q execution; re-homed from `docs/tranches/U/` per Glass's producer-reply §6 ask (XR-2, done 2026-07-17) |
| `docs/tranches/V/coordination/VALUEJS-INBOUND-2026-07-17-formation-exchange.md` | 2026-07-17 02:32 | value.js V′ formation (their one formation-exchange packet, sent at owner signal); marks: `VALUEJS-INBOUND-2026-07-17-formation-exchange-marks.md` |
| `docs/tranches/V/coordination/ATLAS-INBOUND-2026-07-17-crossing-reply-ack-and-census-correction.md` | 2026-07-17 (V execution, Round A window) | Atlas/SCI P·TOTALITY lead; ACKs both 2026-07-17 keyframes outbounds + one census correction (marked in row IN-ATLAS-5 below) |

**Two-atlas disambiguation (XR-3):** the standalone `/Users/mkbabb/Programming/atlas`
checkout is stale master (4.0.0-era pins, no `docs/`). The ACTIVE atlas consumer is the
`atlas/` subtree INSIDE sci-report (`feat/tranche-k-arc`); its inbox is
`sci-report/atlas/docs/tranches/P/coordination/` (exists, 5 files). All keyframes→atlas
outbound packets target that path.

## Rows

| Row | From | Content | Disposition hook |
|---|---|---|---|
| IN-ATLAS-1 | atlas | **Positive crossing signal**: 5.3.5→6.0.0 was the cleanest major taken in the constellation — zero atlas engine-consumer edits; `getTimingFunction` removal had zero call sites; CHANGELOG sufficed as the whole ledger. | RECORDED. Validates the measured-break/clean-cut methodology; cite in FINAL-V methodology notes. No action owed. |
| IN-ATLAS-2 | atlas | **Exact `value.js@4.0.0` pin rationale** — question, not demand: deliberate structural coupling, or widen to caret/tilde once value 4.x patch cadence begins? It propagates hard (atlas takes value patches only via a keyframes republish). If deliberate, one ledger line saying so stops every consumer re-asking. | DECISION ROW for V formation (coordination wave). Working recommendation, owner may veto: the exact pin is DELIBERATE at immutable cut boundaries — every consume-edge in this constellation is a measured edge (one-physical-core proof, integrity-pinned registry-only lock, producer validation performed against exactly V4.0.0); caret would reintroduce unmeasured resolution drift between cuts. Patch cadence is answered by the standing smallest-honest-successor republish discipline, not range drift. Formation must (a) confirm against value.js V's planned patch cadence before finalizing, (b) write the one ledger line into the outbound packet + `docs/published-surface.md`. |
| IN-ATLAS-3 | atlas | **Callable-easing type census**: atlas takes `TimingFunction` from keyframes at two engine-consumer sites (useCountUp, useScrollLettering) and `EasingFunction` from value `/easing` at one curve-register site. Dual-origin reads correctly by capability owner. If the developing spec re-homes or renames the callable type, those three sites chase. | FENCE ROW on the V restructure waves: the library restructure is INTERNAL-ONLY — `TimingFunction`'s published home, name, and signature are frozen surface. Any wave proposing a re-home/rename must carry an explicit atlas-notification obligation (migration ledger + the chasing sites named — per the IN-ATLAS-5 correction, the kf-side set is THREE sites: `useCountUp.ts:47`, `useScrollLettering.ts:57`, `useScrollTimeline.ts:44`). Encode in every colocation wave's Do-NOT-touch bounds. |
| IN-ATLAS-4 | atlas | **Consume posture**: atlas consumes coherent tuples only; next is atlas 7.0.0 (glass 7 + keyframes 6 + value 4). Any new keyframes cut → send migration ledger + evidence tuple (version, gitHead, integrity) to the atlas inbox (`sci-report/atlas/docs/tranches/P/coordination/` — see the two-atlas disambiguation above). Nothing is requested of 6.0.0. | ENCODE in V's coordination boundaries: any V-era version cut ships the evidence tuple to the atlas inbox as a close obligation of the cutting wave. |
| IN-GLASS-1 | glass-ui | HeaderRibbon consumer updates (persistent-only semantics; consumer-side API notes for the migrated demo). | Feeds the R1-15 cross-repo lane + the Glass-7 consume wave's acceptance constraints; verify the migrated 18-consumer set already conforms (the transaction predates this packet — check for drift). |
| IN-ATLAS-5 | atlas | **Crossing-reply ACK + census correction**: both 2026-07-17 kf outbounds PROCESSED (exact-pin ruling BANKED final on their side; the `published-surface.md` ledger line is their durable citation when it lands — W10 Scope 11). CORRECTION: the TimingFunction chase set is **THREE kf sites** — `useCountUp.ts:47`, `useScrollLettering.ts:57`, `useScrollTimeline.ts:44` (their CHALLENGE-2 pass found the third) — plus one value `/easing` site. FYI: glass ruled their kf6/value4 pre-stage in-law (declared overrides, `--legacy-peer-deps` retired, override dies at 7.0.0 adopt); no kf impact. | The IN-ATLAS-3 fence row's notification obligation now reads THREE named kf sites (correction folded here; the fence itself — home/name/signature frozen through V — already protected all of them, so bookkeeping only, no scope change). No reply owed (their §4); W12 terminalizes. |
| IN-GLASS-2 | glass-ui | **Q060: glass-ui 7.0.0 is LIVE** (their constellation packet, read in-place at `glass-ui/docs/tranches/BI/coordination/glass-outbound-2026-07-17-q060-glass7-live.md`): gitHead `4ab12128`, tag `v7.0.0`, npm provenance; 82→74 exports (11 removed/3 added); peers kf`^6.0.0`+value`^4.0.0` — the P127 wedge EXIT. Keyframes rows: `/header-ribbon` KEPT (persistent-only props — our XR-4); `/dark-mode-toggle`+`fading-scroll` pre-migrated; §6 asks a DECLARED glass pin at adopt. §7 states two known shipping defects: V-A95 aurora reverse-drag black slab; Chip/Badge orphaned dist CSS (both born-RED BJ waves glass-side). | **ADOPTED at V.W2** (`ebb08948`): exact `7.0.0` demo-only devDependency (their `^7.0.0` ask satisfied with the constellation's EXACT pin — measured-edge law, bilaterally endorsed; deviation recorded); XR-4 applied; CC-05 watchlist green (20 subpaths, zero removed-set hits). The §7 defect pair + the dock-contract note (§4) are FOLD-FORWARD rows for the successor tranche's demo audit (OD-V2). |
| IN-VALUE-2 | value.js | **WL covenant DECIDE verdicts** (`VALUEJS-INBOUND-2026-07-17-wl-verdicts.md`): §B parseTimingFunction DECLINE-move/CONFIRM-shipped on `/css` (consume from `/css`, callable at `/easing`); §C unflatten DECLINE (concept deleted, terminal retire); §D diagnostics+layout-tracking CONFIRM-SHIPPED (`ParseResult`/8-code `ParseIssue` on `/css`; `isLayoutTrackingUnit` on `/value`); §E CSSPropertyDescriptor CONFIRM-SHIPPED in 4.0.0; **D-GAP-6 DECLINE-WITH-RATIONALE** (compose from `/math` `cubicBezier`; re-open path = ship-4.1 `sampleBezier` data primitive if a hard shared need surfaces — format emit stays consumer-side); D-GAP-1 ACK delivered (quart/quint); D-GAP-5 ACK retired; FAM-14 negative recorded; RF-18 census-split recommendation (ff-only advance + census split, not cleanup). | **THE BANKED-ADJACENT EXTERNAL GATE IS ANSWERED**: D-GAP-6's ship-or-decline is DECLINED with the blessed pattern — the row terminalizes as DECLINED-WITH-PATTERN, no kf code owed (local curve-data authoring stands; adopt `sampleBezier` only if their 4.1 ships it). RF-18's recommendation was ALREADY ENACTED by V's own W0/W2 design (the clone ff'd to K6; the slice separated release-identical bytes from the consumer payload) — record as convergent, no action. All WL rows terminal; W12's value boundary is CLEAR. |
| IN-VALUE-1 | value.js | Bilateral formation exchange (V′ verdict; producer facts; direct answers to IN-ATLAS-2/3; WL-lane commitments incl. the D-GAP-6 family; byte-authority correction 184,430 B). Marks: VM-1..VM-5 in the marks file. | VM-1 closes IN-ATLAS-2 item (a) both directions (W10 Scope 11 lands as ratified); VM-2 mirrors the IN-ATLAS-3 fence; VM-3 = BANKED trigger UNFIRED, W12 records verdict letters at arrival; VM-4 → W13 doc-drift check item; VM-5 confirms delivery address (no re-send). Row terminalizes at W12 when the WL verdict letters land or their boundary passes with MISSING recorded. |

---

# ADDENDUM 2026-09-19 — X.KF.W10 `.f`: THE INBOUND LEDGER IS TERMINAL (G-6)

SERVED MODEL: claude-opus-5[1m]

**Authority**: `value.js docs/tranches/X/keyframes/waves/KF-W10.md` **§3.6** (`:332-334`) · §5 **G-6**
(`:471-487`) · §10 commit 6 (`:660-673`). Sub-tranche **X·KF**, wave **KF.W10**, owned by **SS-2**
(`COHESION.md` **§0t**). Sitting of record **2026-09-17** (the owner's begin-word, COHESION §0j); this
seat's clock **2026-09-19 00:3x EDT**. This is the act **FOLD-FORWARD §A W12** folded forward
**unexecuted** — *"ledger terminalization at V-close (= successor opening)"*.

**E-3 POSTURE — THIS IS AN APPENDED DATED ADDENDUM, NEVER A PATCH.** The **Sources** block and all **9**
rows above are **byte-unchanged**. Pre-addendum bytes, measured twice before this write: **8,865 B**;
⟨cmd⟩ `grep -cE '^\| IN-' INBOUND-LEDGER.md` → **9** (run 1 ≡ run 2). Substrate: keyframes.js `master` =
`origin/master` = **`0a329c57`** ⟨cmd⟩ `git rev-list --left-right --count HEAD...origin/master` → **`0 0`**.

**THE VERB LAW, STATED BEFORE THE TABLE.** Each verb names **where the row now lives**, and never a cure
this seat did not measure. `DISCHARGED-AT-V` = the V wave that owned it **CLOSED** (FOLD-FORWARD §A).
`STANDING — VERIFIED HELD` = a fence re-measured at these bytes by this seat. `FOLDED-FORWARD` = the V
wave never executed and the obligation's home is named. **No row is verbed from its own prose.**

| Row | Terminal verb (2026-09-19) | Basis, measured or cited |
|---|---|---|
| **IN-ATLAS-1** | **RECORDED — TERMINAL** | The row's own disposition (*"No action owed"*). Nothing was ever owed; the methodology citation is a record, not an obligation. |
| **IN-ATLAS-2** | **RULED DELIBERATE + LEDGER LINE LANDED — TERMINAL** | The exact-pin question is answered on **both** sides and the owed durable line **exists at the bytes**: ⟨cmd⟩ `grep -n 'exact' docs/published-surface.md` → **`:16-21`** — *"**The value.js consume-edge is exact-pinned by design.** The exact `@mkbabb/value.js@4.0.0` pin … is deliberate: every constellation consume-edge is a measured, integrity-pinned edge, not a semver range. Value patches reach consumers through the smallest honest keyframes successor … never by range drift under a caret."* Pin re-measured: ⟨cmd⟩ `grep -n '"@mkbabb/value.js"' package.json` → **`:71  "@mkbabb/value.js": "4.0.0"`**. Value.js ruled the same way independently (their `I-6`; O-2/O-4) — **converged, not negotiated**. |
| **IN-ATLAS-3** | **STANDING — VERIFIED HELD 2026-09-19** | The `TimingFunction` fence, re-measured at these bytes: ⟨cmd⟩ `grep -n 'TimingFunction' src/animation/constants/types.ts` → **`:57  export type TimingFunction = (t: number) => number;`**; ⟨cmd⟩ `grep -n 'type TimingFunction\b' dist/keyframes.d.ts` → **`:4200  export declare type TimingFunction = (t: number) => number;`**. **Published home, name and signature all intact** through every V restructure. **No action** is the disposition, and it stays the disposition. ⟨Dated observation, recorded and **not re-keyed**: `value.js lane-docs.md:378` keys this fence **IN-ATLAS-3** and `FOLD-FORWARD.md` §B-6 keys it **IN-ATLAS-5** — two spellings, one obligation; re-keying is not this wave's act (KF.W10 `.a` residual 4).⟩ |
| **IN-ATLAS-4** | **STANDING-CARRIED — UNFIRED** | The evidence-tuple obligation fires only on a V-era cut, and **no cut shipped**: ⟨cmd⟩ `grep -n '"version"' package.json` → **`:3  "version": "6.0.0"`**; ⟨cmd⟩ `grep -n '^## ' CHANGELOG.md | head -1` → **`:6 ## 6.0.0`**, **no `Unreleased` section**. The watch carries **un-fired** into the successor (FOLD-FORWARD §B-11 / VM-4), which is its honest state — a trigger that never fired is not a discharge. |
| **IN-GLASS-1** | **FOLDED-AT-V.W2 — TERMINAL** | V.W2 CLOSED (`add20b7e`/`ebb08948`, FOLD-FORWARD §A W2): the 65-path consume slice, **XR-4 applied**, CC-05 watchlist green. The consumer-update content landed with the consume. |
| **IN-ATLAS-5** | **TERMINAL — the correction is folded; the W12 terminalization it awaited IS THIS ACT** | Its own cell routes the close to W12 (*"No reply owed (their §4); W12 terminalizes"*). W12 never executed as a wave; the terminalization is performed here, and the correction it carried (the **three** kf chase sites) is already inside the IN-ATLAS-3 fence above, which this seat measured held. |
| **IN-GLASS-2** | **ADOPTED-AT-V.W2 — TERMINAL** | Exact glass `7.0.0` devDependency, registry-only lock (FOLD-FORWARD §A W2). Their §7 defect pair (V-A95 aurora slab · Chip/Badge orphaned dist CSS) is **not** re-opened here: both are **§B rows 1 and 2**, verbed at **X.KF.W10 `.a`** (keyframes.js **`025e894c`**) — row 1 `STANDING-CARRIED` on the successor SS-6 batch, row 2 `FOLDED-TO COHESION-SC-1`. Glass-owned, glass-routed, never a demo-side hack. |
| **IN-VALUE-2** | **TERMINAL — and D-GAP-6 gets its one closing line: `sampleBezier` is NOT ADOPTED, permanently** | This row terminalized D-GAP-6 as `DECLINED-WITH-PATTERN` on a **conditional** — *"adopt `sampleBezier` only if their 4.1 ships it"*. **The conditional has resolved, to NOT ADOPTED.** value.js `O-21 §D` states it in those words (*"`sampleBezier` is DECLINED permanently on measured zero demand … no 4.1 of ours will ship it"*), and their 4.1 cut notice (`O-34`, 2026-09-18) measures it: *"**Declined permanently**: `sampleBezier` (measured zero demand, matching your own I-10 answer)"*. **This is a decline recorded as a decline — it is not an adoption, and nothing is owed here**: the local curve-data authoring stands and the composed-from-`cubicBezier` pattern blessed at their O-4 is unchanged. The asymmetry (this row was marked terminal on a conditional their adjudication later foreclosed) is **recorded, not re-litigated** — both ledgers were right when written, and they are now terminal **for the same reason**. |
| **IN-VALUE-1** | **TERMINAL — the W12 boundary passed and the letters LANDED** | The row's own condition was *"terminalizes at W12 when the WL verdict letters land or their boundary passes with MISSING recorded."* **They landed**: the WL verdicts as value `O-4` (2026-07-17, `VALUEJS-INBOUND-2026-07-17-wl-verdicts.md`, the file this ledger's IN-VALUE-2 row is built from) and the amendment-addendum as value `O-21` (2026-09-17, `VALUEJS-INBOUND-2026-09-17-o8-o11-amendment-addendum.md`, tracked at this repo's `origin/master`). **Nothing is recorded MISSING.** VM-1 (exact-pin, IN-ATLAS-2 above) · VM-2 (the fence, IN-ATLAS-3 above) · VM-3 (BANKED trigger, unfired) · VM-4 (doc-drift watch, unfired — FOLD-FORWARD §B-11) · VM-5 (delivery address) all carry their own verbs above or at §B. |

**THE TWO VALUE→KF LETTERS THIS LEDGER NEVER ROWED — `O-8` AND `O-11` — AND THEIR AMENDMENT `O-21`.**
Recorded here, **beside** the rows, and **no `IN-VALUE-3`/`IN-VALUE-4` is minted**: O-21 §F asks for those
two rows in **this ledger's own grammar and numbering**, and that is **keyframes' call, not the sender's**.
The state, measured: both letters' bytes sit **untracked** in this checkout
(`VALUEJS-INBOUND-2026-07-{24,27}-*.md` — the §B-12 reset's six untracked survivors, byte- and
mtime-intact, COHESION §0m.0), and the amendment that cures their delivery is **tracked** at
`origin/master` ⟨cmd⟩ `git cat-file -e origin/master:docs/tranches/V/coordination/VALUEJS-INBOUND-2026-09-17-o8-o11-amendment-addendum.md`
→ **present**. **O-8's delivery-vehicle question is TERMINAL BY PRE-EMPTION, never by an answer**: value.js
ruled the matter internally as carry-cut row **CC-084** — *"no emergency `4.0.1` — ruled"* — and `O-21 §C`
**WITHDRAWS** the question in those words, re-asks it nowhere, and **promises no cut date**. Keyframes
never received the question; **their silence is neither its cause nor consent to it** (O-21 §C, verbatim).
**Nothing is owed by this side on either letter.**

**WHAT THIS ADDENDUM DOES NOT DO.** It mints no row, re-keys no id, re-opens no terminal row, and moves no
figure: the ledger is **9 rows** before and after. It asserts **no cure it did not measure** — the four
`FOLDED`/`ADOPTED` verbs rest on FOLD-FORWARD §A's own wave states, and the two `STANDING` verbs rest on
commands pasted above. **G-6's reading after this write**: every inbound row carries a terminal verb and a
dated row; the two converged rows carry one honest closing line each; **neither is dressed as an adoption**.
