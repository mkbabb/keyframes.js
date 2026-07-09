# Re-Critique (Pass-2) — S.C Legacy purge with teeth (sc-legacy)

**Agent:** re-critique / convergence check · **Band:** S.C · **Predecessor score:** 38%
**Inputs:** Pass-1 critique (sc-legacy.md, 6 mandatory edits); SPEC-v3 §1, §2.2 (C-3/C-18/C-19/C-6/C-7),
§3 S.C1–C4, §4 rows 23–28/57/61–64, §6 residue, §7 T7/T12, the DAG, §9 sc-legacy table + Pass-2 addendum
+ probe-index. Both Pass-2 probes (P2-1 D2 carve, P2-2 F3 emitter) confirmed to touch NO S.C surface —
no S.C probe adjustment exists to fold.

**Verdict: CONVERGED. All six Pass-1 mandatory edits are absorbed AND real in the v3 band text
(each quoted below). No mis-absorption, no v3-introduced contradiction, no dropped evidence.
The predecessor's structural cure — split C3 into S.C3a (deps/narration, gated/discretionary
stated) + S.C3b (menubar, its own priced sub-item) — is executed. Convergence 100%.**

---

## 1. Blocking-edit absorption ledger (each verified against band text, not merely the table)

### SC-1 — no-dead-dependency: specifier-only + config/scripts scan, OR explicit 8-package allowlist
**ABSORBED (real).** S.C3a lines 730–735:
> "proof:no-dead-dependency, falsifiability-hardened (sc-§2.2): the gate operates as an **explicit
> allowlist/denylist keyed off the 8 named shadcn packages** (the honest, bounded form) — OR, if
> generalized, it must **(a) match only real import/require specifiers** (never comment/prose
> substrings — `zod`/`@unovis` appear in the tree today only inside comments, e.g.
> `scripts/proof-visual-lock.mjs:172`) and **(b) scan config + `scripts/` + plugin-reference sites in
> addition to src/demo** (else vite/tailwind/prettier/etc. false-RED)."
Both false-directions the critique named (false-RED tooling deps; false-GREEN comment-string deps) are
closed; the bounded allowlist form is the primary. Delivers the −15 fix fully.

### SC-2 — no-orphan-module: resolve dynamic import() specifiers as edges; pin entry-root set
**ABSORBED (real).** S.C1 lines 708–712:
> "born-RED **proof:no-orphan-module** — a reachability walker whose graph edges **include dynamic
> `import()` string specifiers** in `load-engine.ts` (and the `engine/public` composition), with the
> entry-root set pinned explicitly ({`index.ts`, `load-engine.ts`, `engine/index.ts`,
> `engine/public.ts`}) — else the entire HEAVY lazy surface false-REDs while animate.ts stays
> indistinguishable."
The exact false-positive-avalanche mechanism and the explicit root pin are both present. The §5 T7
root-set-perturbation note is also folded (lines 715–717): "the walker's root set is perturbed by
S.B4 … and S.B6 … — C1's gate re-runs green on the post-B tree, or is authored root-set-agnostic."

### SC-3 — scope animate( grep to front-door symbol + Element.animate/CHANGELOG allowlist; scope as-any to fixed site + KEEP:
**ABSORBED (real), both halves.**
animate( half — S.C1 lines 712–715: "The `animate(` reference clause is **scoped to the excised
front-door symbol** (an `import … animate` or a call not preceded by `.`/`Element`) with an explicit
**allowlist for `Element.animate()` WAAPI prose and historical CHANGELOG rows**."
as-any half — S.C2 lines 722–726: "the wave **censuses all 6 demo-composable `as any` sites**
(≥4 composables), fixes the §2K row-4 survivor (useTimingFunctionEditor.ts:196 — widen the return type,
don't cast), and every surviving legitimate cast carries a `KEEP:` label; the gate **REDs on any
UNLABELLED `as any`** in demo composables (not on the labelled survivors)." This is exactly the
census+KEEP hybrid the critique offered as the resolving option; the scope-mismatch RED is eliminated.

### SC-4 — specify the generalized changelog gate's snapshot/diff mechanism
**ABSORBED (real).** S.C1 lines 706–707 point to C-18; C-18 (lines 376–380) delivers the mechanism:
> "the gate checks out the previous published tag's copy (`git show v<prev>:docs/published-surface.md`),
> diffs against HEAD, and REDs on any removed row lacking a matching `docs/MIGRATION-<new>.md` entry.
> The previous tag is resolved from npm `dist-tags.latest` (falling back to the highest `v*` tag).
> No archived snapshots needed."
The Pass-1 §4 "promise without an oracle" is now a concrete oracle. This was the −10 open-design item;
it is resolved by a real mechanism (not deferred to a 6.3 owner ruling), so no residual deduction.

### SC-5 — name the menubar target (present, no external gate) OR relocate-in-place; forbid gating on a missing surface
**ABSORBED (real), and pruned to its own priced sub-item.** New wave S.C3b, lines 748–754:
> "Migrate KeyframesEditor's menubar per C-19: glass-ui **dropdown-menu** (present in 4.0.x — no
> external gate; the menubar→dropdown UX remap acknowledged), with the a24-F6 relocate-in-place
> fallback; delete ui/menubar/ (16 files) + utils.ts(`cn`)… **Gating menubar removal on a missing
> external surface is FORBIDDEN (no second external gate — T12)**."
C-19 (lines 382–388) records the live glass-ui 4.0.1 surface fact (dropdown/context-menu, no menubar)
that overturned SPEC-v1's HANDOFF conditional. The §6 prune demand ("give menubar its own line and
gate") is honored — S.C3b is a distinct wave with its own gate (shadcn census REDs while ui/menubar
exists; interaction-axis test). T12 second-external-gate risk is neutralized.

### SC-6 — stale-comment gate bans specific dead identifiers (not "scene-switcher"); corpus += proof-script sites
**ABSORBED (real).** S.C3a lines 736–740:
> "the gate clause bans **specific dead component identifiers** (`SceneSwitcherCarousel`,
> `SegmentedTabs`, `Animated.vue`, `ResponsiveSelect`, `AnimationMenuBar`) — **NOT the phrase
> "scene-switcher", which S.E legitimately revives** (sc-§3.2); the corpus adds the proof-script
> narration sites (proof-visual-lock.mjs:172's "unovis graph (live)")."
Fold row 63 (line 1374) is rewritten to match ("dead-identifier grep — NOT the phrase 'scene-switcher';
discretionary items stated"). The cross-band incoherence the critique flagged is not merely avoided —
it is structurally prevented.

---

## 2. Absorption of the §5 / §6 non-numbered critique notes (context, all folded)

- **C3 mis-weighted bundle (§5):** split into S.C3a + S.C3b, and S.C3a explicitly partitions
  "**Gated items:**" (no-dead-dependency + dead-identifier grep + shadcn census) vs "**Discretionary
  best-effort (stated, ungated):**" (doc path remaps, design-idioms tombstone, headers, baselines,
  taxonomy prose, `<SegmentedTabs>` narration, orphaned assets) — lines 740–746. The Pass-1 ask ("say
  which items are gated vs discretionary") is met verbatim.
- **T7 root-set re-verify (§5):** folded into S.C1 (lines 715–717), consistent with §7 T7.
- **Credits carried (§6):** semver ratification not re-opened (row 24 → C-18 backfill); a09 F2's
  claudemd-surface gate correctly homed at S.A5, not S.C — unchanged in v3.

---

## 3. New-contradiction / cross-band collision scan (the only admissible new-blocking class)

- **"scene-switcher" hoist collision — CLEARED.** S.E revives the scene switcher (C-7, DM-24 REVIVED,
  line 317) and the phrase is used freely (lines 27, 158, 185). The S.C3a gate now bans identifiers not
  the phrase — the resolution eliminates the collision rather than creating one.
- **SegmentedTabs banned-yet-revived? — CLEARED.** S.E's interim spin controls are ordinary
  `DockIconButton`s inside the single ChromeDock (C-7 line 321; S.E4 lines 910–911), NOT SegmentedTabs.
  No band revives any of the five banned identifiers; banning them introduces no cross-band conflict.
- **DAG consistency — CLEARED.** S.C1/C2/C3a/C3b/C4 all declare Deps: A0; the DAG root fan-out (line
  1275) lists exactly these. S.C3b is "independent of D3" (line 754) — no fabricated edge. The
  EN-a/EN-b hoist into S.B3 (C-25) touches compile/, not any S.C surface — no perturbation of S.C gates.
- **P2-1/P2-2 probe adjustments — N/A to S.C.** The probe-index (lines 1788–1827) confirms both Pass-2
  probes land on S.D2 and S.F3/S.B3; zero S.C adjustments to fold, so none can be dropped.

No admissible new blocking item exists (no mis-absorption, no v3-introduced contradiction, no dropped
evidence).

---

## 4. Polish (non-blocking)

- S.C3a's discretionary tier is long (7 item classes) and ungated by design; at impl a one-line
  checklist per discretionary item would help avoid silent drop, but the spec already states the
  gated/discretionary boundary honestly — this is execution hygiene, not a spec gap.
- S.C3b names dropdown-menu as primary with relocate-in-place as fallback "if the remap proves
  unacceptable at impl." The UX-acceptability decision is a genuine impl-time call, but both paths are
  internally closable (no external gate either way), so this is correctly a bounded impl choice, not an
  open design question — noted only for the implementer's awareness.

---

## 5. Score

All 6 Pass-1 mandatory edits verified absorbed with quoted v3 evidence; the −10 open-design item (§4
changelog mechanism) is resolved by a concrete oracle (C-18), not parked; the two born-RED
falsifiability holes (−15, −10) are closed with the exact mechanisms demanded; the two scope defects
(−10) and the two stale-premise rulings (−10, −7) are all delivered. Empty admissible blocking set.

**Convergence: 100%.**
