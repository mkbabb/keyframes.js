# Lane FA-1 — Born-RED Truth + Evidence Resolution

**Prefix:** FA1- · **Date:** 2026-07-17 · **Method:** every born-RED / red-witness
claim spot-verified LIVE on the current tree (command+output or file:line per claim);
15-sample evidence-path resolution across V.md + the 8 wave files.

## Verdict

The rail's five W1 render defects, W2/W3's external block, W9's four MR red-witnesses,
W4's stutter/shim/dead-code witnesses, W8's kind-dir witnesses, and the BV-2 golden
witness are all **LIVE and reproduce as stated**; the three outbound packets are
delivered; 15/15 sampled file:line anchors resolve to matching content. **One P1
born-RED soundness gap** in proof:structure (two of five rules have zero witness in the
tree W4 governs), plus four smaller citation/count/path drifts.

---

## Findings

### FA1-01 (P1) — proof:structure ceiling + kind-dir rules have no library-tree witness

W4 Scope 2 + Hard Gate 1 require a "red-witness run against the pre-move tree recorded
**per rule**." Two of the five rules cannot produce one on the library tree W4 governs:

- **500-raw ceiling (allowlist empty):** the largest `src` file is
  `src/animation/physics/spring/progress.ts` at **484** lines. Nothing in `src` exceeds
  500, so the rule is born GREEN on src, not RED. Its only live violator is a DEMO file,
  `demo/components/instrument/transport/channel-controls/ChannelOptions.vue` at **609**.
- **kind-dir ban:** `src` has **zero** `components/composables/utils` dirs
  (`find src -type d \( -name components -o -name composables -o -name utils \)` = ∅).
  All live witnesses are in demo (`demo/components/instrument/utils`,
  `.../transport/composables`, `.../keyframes/components`, +7 more).

W4's File Bounds say **"Do NOT touch: demo/\*\*"**, and the demo tree isn't settled
until W7/W8. So neither rule can be witnessed RED at W4. The alternative reading —
proof:structure scans whole-repo (V.md criterion 3 "green on both settled trees") —
makes W4's hard gate "GREEN after the opener moves" **unreachable**, because demo
kind-dirs and the 609-line file persist through W8.
**Fix:** pin proof:structure's birth scope to `src` at W4 and reclassify ceiling +
kind-dir as preventive rules exempt from the W4 per-rule-red requirement; stage those
two rules to activate on the demo tree at W8 close, where the ChannelOptions carve
(609→≤ceiling) and the kind-dir dissolution supply their own red witnesses.

### FA1-02 (P2) — GP-NN row IDs cited by wave specs don't resolve in R2-07

`R2-07-gate-test-prune.md:3` declares "Prefix: GP-" but numbers **no** row GP-NN; its
findings carry GS-/TC-/PF- ids. The wave specs cite non-existent GP-NN anchors:
`V.B.md:56` "GP-02" (mirror.test.ts) → actually **TC-4** (`R2-07:133,236`); `V.D.md`
Scope 5 "GP-03" (owner-golden relabel) → **GS-03** (`R2-07:74`); "GP-09"
(probe-webkit-linear-accel, `R2-07:110`) and "GP-05" (orphan bench artifacts,
PF-5 `R2-07:145`) are unnumbered. Content is traceable but the cited IDs land nowhere.
**Fix:** renumber R2-07's 69-row table with GP-NN ids, or repoint each wave citation to
the real ID.

### FA1-03 (P2) — V.Z close-ledger row count wrong for PROMPT-RECAP-V

`V.Z.md:23` tells the close ceremony to walk "`PROMPT-RECAP-V.md` (66 rows)". The file
holds **42** rows (V-01..V-42; `grep -cE '^\| V-[0-9]+ '` = 42). (DISPOSITIONS "52 rows"
is **correct** — verified 52.) The close is told to reconcile 24 rows that don't exist.
**Fix:** correct `V.Z.md:23` to 42, or determine whether PROMPT-RECAP-V dropped asks
(the prompt-recap-zero-dropped discipline) and restore them.

### FA1-04 (P2) — W11 BEFORE-baseline path drift

`V.F.md:56` + `V.Z.md:26` point the DELTA harness at
`docs/tranches/V/audit/screenshots/{before,after}/` — that directory **does not exist**.
The banked BEFORE baseline (40 PNGs) actually lives in
`docs/tranches/V/audit/design-captures/`. W11's born-RED ("BEFORE exists; no AFTER") is
TRUE — 40 captures on disk — but under a different path than the pairing citation.
**Fix:** cite `design-captures/` as the before set (or copy it into `screenshots/before/`
at W11 open) and align V.F/V.Z.

### FA1-05 (P3) — W4 stutter-rename paths use inconsistent shorthand

`V.B.md:50-51` lists `easing/easing-option.ts`, `easing-registry.ts`,
`emit/easing-serialize.ts`; none resolve at those paths — actual are
`compile/easing/easing-option.ts`, `compile/easing/easing-registry.ts`,
`compile/emit/easing-serialize.ts` (the `compile/` segment dropped), while the sibling
`engine/css/css-animation.ts` in the same list IS a correct src/animation-relative path.
Files all exist; LT blueprint R2-05 is the mechanism of record so movers won't be lost.
**Fix:** prefix the three easing paths with `compile/`.

---

## Negatives (born-RED verified LIVE, sound as stated)

- **W1 blank render:** `TooltipProvider` absent from `demo/app/App.vue`
  (`grep TooltipProvider` = 0). Witness = AV-1 STATE-B (`R2-04:43-47`), which is also
  MR1's blank-transaction red-witness of record. LIVE.
- **EE-01:** `demo/components/CopyButton.vue:42` `timingFunction: "bounceInEase"` LIVE
  (witness AV-1 `R2-04:66-69`, R3-02).
- **EE-02:** css-less `{fn}`-only twin assignments LIVE at
  `useTimingFunctionEditor.ts:101` and `TimingFunctionPanel.vue:144` (witness AV-1
  anonymous-fn class, `R2-04:70-73`).
- **EE-03:** Invalid-watch-source LIVE — `useKeyframesParsing.ts:97` watches the markRaw
  array `animation.templateFrames` directly (witness `R3-02:182-217`).
- **FE-3:** `[object Object]` LIVE — `KeyframeCardList.vue:11` `frames[i].start.toString()`
  + `KeyframeCard.vue` `frameStart`; 10 labels **shipped in prod** (witness
  `R3-01:33-62`, "PROD spring: [object Object] labels=10").
- **W2/W3 blocked-external:** `npm view @mkbabb/glass-ui` → latest **6.0.0**, no 7.0.0.
  Glass 7 unpublished. CONFIRMED.
- **MR3 dispatch bypass:** LIVE in `deploy-pages.yml` — both preflight asserts guarded
  `if: github.event_name != 'workflow_dispatch'` (:38, :41); witness AV-4.
- **MR4 test:demo absent:** no `test:demo` in `ci.yml`; no `test:demo` script in
  `package.json` (only `"test": "vitest"`); witness AV-3.
- **W4 witnesses LIVE:** dir-prefix stutter (`compile/easing/easing-option.ts`,
  `waapi/waapi-options.ts`, `resolve/resolve-function.ts`, `resolve/resolve-if.ts`, +);
  presets hollow shims (`classic.ts`/`spring.ts`/`taxonomy.ts` = pure `./catalog`
  re-exports); DD-1 `isObject` (`internal/helpers.ts:9`), DD-2 `cloneInterpSlot`
  (`compile/interp-slot.ts:340`).
- **W8 kind-dir witnesses LIVE:** 10+ `components/composables/utils` dirs under
  `demo/components/instrument/`.
- **BV-2 golden red-witness LIVE:** `R2-02:161-175` probe7 D2weight — static-weight
  composite climbs to t3000=825 while both waves are symmetric about t2000.
- **Outbound packets delivered:** glass `BI/coordination/keyframes-inbox-2026-07-17-v-formation-batch.md`,
  value `V/coordination/keyframes-inbox-2026-07-17-v-formation.md`, atlas
  `P/coordination/keyframes-outbound-2026-07-17-crossing-reply.md` — all present.
- **Frozen surface anchor exact:** `constants/types.ts:45` =
  `export type TimingFunction = (t: number) => number;`.
- **Evidence-path spot check 15/15 resolve:** `public.ts:171/172`, `EditorShell.vue:16/197`,
  `demo/app/index.html:31`, `DESIGN.md:238/253`, `waapi/eligibility.ts:169`,
  `physics/index.ts:9`, `interpolate.ts:257-259`, `ControlsPaneWrapper.vue:172`
  (up-and-over `../ControlsPaneWrapper/` import), `ChannelOptions.vue:219`,
  `no-shadow-playback-authority.test.ts:21`; all R1/R2/R3 audit + coordination + U
  handoff paths exist.

## Coverage gaps

- Sampled ~15 anchors, not every DM-01..19 / LT-01..16 / DT-01..11 row.
- proof:structure rule 3 (single-consumer fragment) witness not individually
  confirmed — DD-3 members plausible but not spot-verified.
- `easeInBounce` not confirmed as a valid Value-4 registry key (W1 fix-target validity);
  only `bounceInEase`-is-the-live-defect verified.
- DT-04 "ChannelControls.vue:230 is a re-export-shim consumer" — line 230 is a real
  `import type { KfPillTabOption }`; the shim semantics not fully traced.
