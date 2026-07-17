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
| IN-VALUE-1 | value.js | Bilateral formation exchange (V′ verdict; producer facts; direct answers to IN-ATLAS-2/3; WL-lane commitments incl. the D-GAP-6 family; byte-authority correction 184,430 B). Marks: VM-1..VM-5 in the marks file. | VM-1 closes IN-ATLAS-2 item (a) both directions (W10 Scope 11 lands as ratified); VM-2 mirrors the IN-ATLAS-3 fence; VM-3 = BANKED trigger UNFIRED, W12 records verdict letters at arrival; VM-4 → W13 doc-drift check item; VM-5 confirms delivery address (no re-send). Row terminalizes at W12 when the WL verdict letters land or their boundary passes with MISSING recorded. |
