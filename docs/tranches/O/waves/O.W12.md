# O.W12 — glass-ui BC consume: S1 + S2 workaround deletions + BC re-pin (the atomic unlock)

> **AUGMENT (FULL-LOOP-LEDGER `O.W12-WZ-consume` O.W12, 2026-06-22).** The loop AUGMENTED this wave with four corrections: **(1) DM-1 chronicity is 5 (I,J,K,L,M→O), NOT 4** as the body originally stated (per PROGRESS.md §2) — the P-inv-28 belt is HARDER than written; the dock-interim delete is a stricter mandatory exit. **(2) The O.W2 content-probe retarget is BLOCKING PRIOR to any O.W12 impl** — `proof:workaround-deletion` S1 fires a FALSE RED today (glass-ui 4.1.0 published after O authoring; the `version: '4.1.0'` sentinel signals safe-to-delete when the SFC fix is ABSENT), which could trigger an unsafe S1 deletion. **(3) S2 (dock) may be deletable on 4.1.0 if `proof:live-session` S5 passes** — `useDockClickIntegrity` shipped at 4.0.1, so the "BC cut" for S2 may already have shipped. **(4) The S2/S3/S4 atomic commit protocol remains sound but conditional**: S1-aria deletion ONLY after the SFC guard lands; S2-dock deletion may fire FIRST if S5 confirms the crossfade-strand cure. Evidence base: `docs/tranches/P/FULL-LOOP-LEDGER.md`.

**Band:** F — glass-ui BC consume
**Phase:** GATED (glass-ui BC cut published — version placeholder `~<BC>.x`; the BC cut version is USER-DOMAIN and NOT frozen at authoring time; per O.md §7 use `~<BC>.x` as the pin placeholder until the cut is announced)
**Sequence:** O.W11 (BC aria-orientation SFC dispatch CONFIRMED received by glass-ui) → **O.W12** → O.W13 (design-paint baseline lock) → O.W14 (lighthouse posture flip)
**Owning chronic/DM:** DM-1 (RF-17 dock interim, **chronicity 5 at O — I,J,K,L,M→O** per PROGRESS.md §2 [FULL-LOOP-LEDGER correction — was mis-stated as 4]; P-inv-28 TERMINAL, the belt fires HARDER at a 5-tranche carry; MUST exit at O), DM-S1 (aria-orientation suppress, chronicity tracked in workaround-deletion gate, BC-gated exit)

M-substrate: **M.W8** (the glass-ui BB consume wave, the full atomic-unlock design). Delta from M.W8 to O.W12:
- M.W8 was authored against glass-ui BB (4.1.0 target, which was NEVER published — BB closed at 4.0.1). O.W12 retargets to the glass-ui **BC cut** (the actual unblock event).
- M.W8 §S1 (peer re-pin) is superseded: `proof:peer-satisfied` was greened by the manual M consume (value.js 1.0.2, glass-ui 4.0.1) — the F-2 peer-cycle is cleared. O.W12 does NOT repeat S1; the re-pin is ONLY the BC cut version bump (`~4.0.1` → `~<BC>.x`).
- M.W8 §S2 (S1 aria-orientation delete) and §S3 (S2 dock interim delete) are carried into O.W12 unchanged in substance, but the gate premise is corrected: both S1 and S2 were PENDING in M because BB never published; they remain PENDING at O.W12 authoring time, now gated on the BC cut.
- S1 aria-orientation: two suppress sites confirmed in O audit (AUDIT-DIGEST A4, F27) — `demo/spring/SpringSidebar.vue:43` AND `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`. M.W8 was aware of both; M.W8 §S2 correctly names both. O.W12 inherits this scope without change.
- S2 RF-17 dock interim: `TransportDock.vue` `pointerHandled`/`onPlayPointerDown` pattern. **Chronicity 5 at O (I, J, K, L, M → O** — M did NOT execute the delete because BB did not publish; FULL-LOOP-LEDGER correction — the prior "4" undercounted the M carry). The P-inv-28 belt is ACTIVE and HARDER at a 5-tranche carry; O.W12 is the mandated exit wave.
- Gate correction (AUDIT-DIGEST A2): `proof:workaround-deletion` S2 arm currently hardcodes `glass-ui@4.1.0` — a phantom version (BB never published 4.1.0). O.W12 impl corrects the gate to check the INSTALLED BC cut version (content-presence check on `useDockClickIntegrity` in the installed dist, not a semver sentinel against a phantom).
- Aria-orientation correction (AUDIT-DIGEST A2, A4, O.W11 dispatch): the M.W8 premise that BC will emit `aria-orientation` conditionally on the `isUnderline` flag may be modified by the O.W11 dispatch outcome. O.W12 deletes the S1 suppress lines ONLY after O.W11's corrected ask is confirmed received AND the BC cut ships the guard. If BC ships without the SFC guard, the O.W11 dispatch must be re-escalated before O.W12 fires. See Dependencies.

---

## Context

The M.W8 deploy chain (the full link-by-link causal analysis) is the authoritative reference for why this wave matters. The state at O authoring (2026-06-19):

- `proof:peer-satisfied` is GREEN (the F-2 peer-cycle was manually resolved at M-consume by re-pinning to glass-ui 4.0.1 + value.js 1.0.2). The deploy blocker is gone.
- `proof:workaround-deletion` S1 arm: **PENDING** — `demo/spring/SpringSidebar.vue:43` and `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` both carry `:aria-orientation="undefined"`. Gate asserts glass-ui BC has NOT published the SFC guard yet. Two PRESENT suppress sites.
- `proof:workaround-deletion` S2 arm: **PENDING** — `TransportDock.vue` carries `pointerHandled`/`onPlayPointerDown` pattern (9 hits confirmed by O audit, AUDIT-DIGEST A3). Gate hardcodes the stale `@4.1.0` semver — a content-presence check on the installed dist is the correct form (AUDIT-DIGEST A2 recommendation).
- `useDockClickIntegrity` is confirmed present in the installed `glass-ui@4.0.1` dist (`dock.js:534` — AUDIT-DIGEST A2 evidence). The S2 workaround is deletable once the BC dock's compositor-isolated expand/collapse morph eliminates the crossfade-strand case. **Key audit finding (AUDIT-DIGEST A3):** `useDockClickIntegrity` guards the identity-changed-click case but does NOT cure the crossfade-strand case kf's `TransportDock.vue` comment (line 313) proves is still live. O.W12 must re-verify via `proof:live-session` S5 (motion-path PLAY actuation) BEFORE deleting S2, to confirm the BC dock morph actually eliminates the strand root.

### Audit evidence

| Ref | Source location | Fact (verified 2026-06-19 unless noted) |
|-----|-----------------|------------------------------------------|
| AUDIT-DIGEST A2 | `KF-BC.md` ASK#2 | "CONFIRMED" is factually misleading — `SegmentedTabs.vue:406` still emits `:aria-orientation` unconditionally including on `role=group` |
| AUDIT-DIGEST A2 | `scripts/proof-workaround-deletion.mjs:228` | hardcodes `@mkbabb/glass-ui@4.1.0` for S2 — a phantom version (BB closed at 4.0.1); content-presence check is the correct form |
| AUDIT-DIGEST A3 | `TransportDock.vue:313-338` | K.W1 RE-OBSERVED comment: `useDockClickIntegrity` did NOT subsume the crossfade-strand twin; S2 correctly retained |
| AUDIT-DIGEST A4 | `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`, `demo/spring/SpringSidebar.vue:43` | both `:aria-orientation="undefined"` present; the gate S1 arm PENDING on both |
| AUDIT-DIGEST F27 | n-stage-impl branch | S1/S2 workaround deletion is a pre-condition for the N Stage unshelf integration (O.W15) |
| O.W11 dispatch | `docs/tranches/O/waves/O.W11.md` | the corrected aria ask to BC: emit `aria-orientation` only on `role=tablist`, omit for `role=group`; O.W12 gates on this ask being received + the BC SFC guard shipping |

---

## Scope

### S1 — Correct `proof:workaround-deletion` S2 gate arm (pre-BC, gate hygiene)

**Breach.** `scripts/proof-workaround-deletion.mjs:228` hardcodes `{ pkg: '@mkbabb/glass-ui', version: '4.1.0' }` as the S2 sibling tripwire. `glass-ui@4.1.0` is a phantom version that was never published (BB closed at 4.0.1); the arm therefore can never transition from PENDING to GREEN under any real publication event.

**Cure.** Replace the semver sentinel with a content-presence check: probe the installed `node_modules/@mkbabb/glass-ui/dist/dock.js` for the presence of `useDockClickIntegrity`. If present, the dock crossfade cure is in the installed dist. The version-number tripwire becomes: BC cut version ≥ the threshold (checked via the installed `package.json` version field, compared against the USER-DOMAIN-announced BC cut version at impl time). This is a pre-BC gate hygiene fix — it does not delete S2, only corrects the gate's version oracle so it can accurately report PENDING vs. GREEN.

**Gate bite.** `proof:workaround-deletion` S2 arm continues to show PENDING (correctly) on today's tree. After the gate arm correction, the PENDING report is grounded in an accurate observable (content-presence + BC version) rather than a phantom semver.

---

### S2 — Delete BOTH `:aria-orientation="undefined"` suppressions (S1 arm consume)

**Gating condition:** glass-ui BC cut published WITH the `SegmentedTabs.vue` SFC guard (`:aria-orientation` conditional on `isUnderline` / role=tablist, absent for role=group) — the O.W11 corrected dispatch must have been received and implemented by BC.

**Breach.** `SegmentedTabs.vue:406` in the installed `glass-ui@4.0.1` dist emits `aria-orientation` unconditionally, including when `variant="pill"` renders `role="group"`. ARIA 1.2 forbids `aria-orientation` on `role=group`. kf suppresses it at two pill render sites (M.W8 §S2 audit confirms both; O audit confirms both still present).

**Cure (GATED on BC cut + O.W11 SFC guard confirmed).** Delete BOTH lines in ONE atomic commit with S3:
- `demo/spring/SpringSidebar.vue:43` — `:aria-orientation="undefined"`
- `demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72` — `:aria-orientation="undefined"`

After deletion, the live pill strip emits no `aria-orientation` because the BC-cut `SegmentedTabs` omits it at the root for `role=group`. No kf-local guard is added (that would be a new workaround, not a workaround deletion).

**Constraint (both, not one).** Both sites must be deleted together. Deleting only one is a partial-application leak. The blast radius is exactly these two strips (2 pill render sites + 3 non-render comment/composable hits per the M.W8 verified count).

**Gate bite.** `proof:workaround-deletion` S1 arm asserts zero `/aria-orientation\s*=\s*["']?\s*undefined/` in `demo/**`. After deletion: GREEN.

---

### S3 — Delete the `pointerHandled`/`onPlayPointerDown` RF-17 dock interim (S2 arm consume)

**Gating condition:** glass-ui BC cut published, BC dock morph (BC.W-DOCK-ENGINE + compositor-isolated expand/collapse) confirmed to eliminate the crossfade-strand case via `proof:live-session` S5 PLAY actuation. See constraint below.

**Breach.** `TransportDock.vue` carries 9 hits of `pointerHandled`/`onPlayPointerDown` (lines 15, 151, 196, 342, 348, 358, 361, 366, 373 per M.W8 audit; O audit confirms pattern still present). DM-1 (RF-17) chronicity is **5 at O (I, J, K, L, M → O** — M did not execute; FULL-LOOP-LEDGER correction from the prior "4"). The P-inv-28 belt mandates exit at O; no 6th carry is permitted.

**Cure (GATED on BC cut + crossfade-strand verification).** Delete the entire interim in ONE atomic commit with S2:
- `pointerHandled` flag declaration and all assignment sites
- `onPlayPointerDown` declaration + all template bindings
- `if (pointerHandled) return` guard in `onPlayClick`
- Documentation comment block

The play-button toggle reverts to a plain `@click="onPlayClick"` actuating `emit("togglePlay")` directly.

**Constraint (verify before delete — AUDIT-DIGEST A3).** `useDockClickIntegrity` composable guards identity-changed clicks but does NOT prevent the crossfade-strand case (TransportDock.vue:313 comment, K.W1 RE-OBSERVED). Before deleting S2, run `proof:live-session` S5 (motion-path PLAY button actuation through a dock collapse/expand cycle) on the BC-consumed demo. ONLY if this test passes (the dock does not double-toggle) does the crossfade-strand root cause exist in BC's buttery engine. If S5 still reveals a strand, S3 is held and a new BC dispatch is filed — P-inv-28 mandates exit, but NOT a silent delete that reintroduces the regression.

**Gate bite.** `proof:workaround-deletion` S2 arm asserts zero `/pointerHandled|onPlayPointerDown/` in `TransportDock.vue`. After deletion: GREEN.

---

### S4 — Re-pin glass-ui to the BC cut version (the one atomic commit)

**Cure.** In the same atomic commit as S2 + S3: bump `optionalDependencies["@mkbabb/glass-ui"]` from `~4.0.1` (or current) to `~<BC>.x` (the USER-DOMAIN-announced BC cut version). Re-install so the lockfile resolves the BC cut.

**Constraint (atomic).** S2 + S3 + S4 land as ONE commit. The exception (M.W8 §S1 timing-split precedent): if BC ships a patch (BC cut - patch) that contains only the dock/aria fixes without other BC Band changes, and the full BC cut version ships later, the commit may split: pin-bump + S3 (dock) first, then S2 (aria, gated on the SFC guard landing in the same or later patch). The default is atomic.

**Gate bite.** `proof:peer-satisfied` → GREEN (the BC cut version is admitted by kf's peer range). `proof:workaround-deletion` S1 + S2 arms → GREEN. `npm run proof:all` → GREEN.

---

## Born-RED gate

**Gates used (all EXISTING — no new gate script is authored in this wave):**
- `proof:workaround-deletion` S1 arm — PENDING today (2 PRESENT suppress sites; BC SFC guard not published)
- `proof:workaround-deletion` S2 arm — PENDING today (9 PRESENT interim hits; stale semver sentinel; corrected by S1 pre-BC gate hygiene fix)
- `proof:peer-satisfied` — GREEN today (cleared at M-consume); must stay GREEN after the BC re-pin

**The REAL observable (inv-M-observable-truth — not a proxy):**

| Gate / clause | Witness today (glass-ui 4.0.1) | Failure mode today | Expected after BC cut + O.W12 |
|---|---|---|---|
| S2 `proof:workaround-deletion` S1 arm | 2 PRESENT `:aria-orientation="undefined"` sites in `demo/` | invalid ARIA attr on `role=group` pill strips — an a11y defect on every mounted pill SegmentedTabs | S1 arm GREEN — zero suppression sites; BC SFC guard omits `aria-orientation` at the root for role=group |
| S3 `proof:workaround-deletion` S2 arm | 9 PRESENT `pointerHandled`/`onPlayPointerDown` hits in `TransportDock.vue` | DM-1 P-inv-28 chronicity-5 carry (I,J,K,L,M→O) — the belt is violated HARDER than at 4; wrong-layer pointer re-route accretes maintenance burden | S2 arm GREEN — zero hits; BC dock morph eliminates the crossfade-strand root |
| S4 re-pin | `package.json` at `~4.0.1` | correct today; must update to `~<BC>.x` on BC publish | `proof:peer-satisfied` exit 0 on BC cut version |
| proof:live-session S5 | not run (BC not published) | dock double-toggle on crossfade — the crossfade-strand case | S5 PASS after the BC dock morph — no double-toggle, single `@click` path is correct |

**Born-RED today (by construction — the two PENDING workaround arms).**
`proof:workaround-deletion` S1=PENDING S2=PENDING — observed on every `npm run proof:workaround-deletion` invocation. The PENDING state is the correct born-RED form for BC-gated deletes: PRESENT + sibling UNPUBLISHED.

**Green condition.**
1. Gate hygiene (S1, pre-BC): `proof:workaround-deletion` S2 arm corrected to content-presence check.
2. BC cut publishes with (a) BC dock morph (useDockClickIntegrity + compositor-isolated expand/collapse) and (b) SegmentedTabs SFC guard (`:aria-orientation` conditional on role).
3. `proof:live-session` S5 passes on the BC-consumed demo (crossfade-strand confirmed cured).
4. ONE atomic commit: re-pin `~<BC>.x`, delete both aria suppression lines, delete the dock interim.
5. `proof:workaround-deletion` S1 + S2 arms → GREEN. `proof:peer-satisfied` → GREEN. `npm run proof:all` → GREEN.

---

## Dependencies

- **O.W2 (the content-probe retarget) — BLOCKING PRIOR (FULL-LOOP-LEDGER AUGMENT).** The S1 arm's `version: '4.1.0'` sentinel fires a FALSE RED on the now-published glass-ui 4.1.0. O.W2 MUST retarget S1 to the content-aware mount-probe BEFORE any O.W12 deletion, or the gate could green-light an unsafe S1 deletion while the SFC guard is absent. This is a hard pre-condition, not a soft seed.
- **O.W11 (glass-ui BC aria-orientation SFC dispatch)** — S2 (the aria delete) is gated on the O.W11 corrected ask being received by glass-ui AND the BC SFC guard shipping in the cut. O.W11 is a DISPATCH wave; its receipt confirmation is the trigger. If BC cuts without the SFC guard, S2 is held and O.W11 is re-escalated.
- **glass-ui BC cut (USER-DOMAIN, version placeholder `~<BC>.x`)** — the primary GATED event for S2-aria. **NOTE (FULL-LOOP-LEDGER AUGMENT):** the S3-dock delete may NOT need to wait for the named BC cut — `useDockClickIntegrity` shipped at 4.0.1, so if `proof:live-session` S5 passes on 4.1.0 the dock "BC cut" has effectively already shipped and S3 may fire first. The BC cut version is NOT frozen at authoring time (AUDIT-DIGEST A1 recommendation: do not hard-pin until the cut is announced).
- **`proof:live-session` S5 (motion-path PLAY)** — must run before S3 delete to verify crossfade-strand elimination. This is a verification step at impl time, not a CI gate.
- **O.W13, O.W14, O.W15** — all fire AFTER this wave (the BC-consumed tree is the baseline for design-paint S4, lighthouse posture flip, and N Stage unshelf). No reverse dependency from those waves into O.W12.

---

## dev→impl boundary

This wave opens ONLY when the glass-ui BC cut is published at the USER-DOMAIN-announced version. **The O.W2 content-probe retarget is BLOCKING PRIOR to any O.W12 implementation** (FULL-LOOP-LEDGER AUGMENT): the S1 arm fires a FALSE RED on the now-published glass-ui 4.1.0 (the `version: '4.1.0'` sentinel signals safe-to-delete while the SFC fix is absent), so the gate must first be retargeted to the content-aware mount-probe — otherwise the gate could green-light an unsafe S1 deletion. The pre-BC gate hygiene fixes (the S1 content-probe retarget + the S2 phantom-`@4.1.0` sentinel correction in `proof-workaround-deletion.mjs`) are kf-internal and MUST be executed first, at O Band A authoring, BEFORE the deletion commits.

The deletion commits are conditional, NOT a single unconditional atomic block: **S2-aria** (S1-arm consume) lands ONLY after the BC SFC guard ships; **S3-dock** (S2-arm consume) may fire FIRST if `proof:live-session` S5 confirms the crossfade-strand cure on the already-published 4.1.0 dock morph (the "BC cut" for the dock may already have shipped at 4.0.1's `useDockClickIntegrity`). S4's re-pin rides with whichever deletion lands. The default is one atomic commit; the split is admitted when the dock fix and the aria SFC guard ship at different versions.
