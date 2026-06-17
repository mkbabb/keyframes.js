# Tranche M — KF-CONSUME-SEQUENCING — the acyclic-spine consume-edge ordering

**Authored:** M.W0 (DEV phase — docs only; no engine/demo/library source is written;
inv-16 holds). **Tree:** `tranche-m-dev` (M.W0). **Companion:** the three L dispatch
docs stand UNCHANGED as the ground-truth ask surface —
`docs/tranches/L/KF-TO-GLASSUI-BB-ASKS.md`, `KF-TO-VALUEJS-O-ASKS.md`,
`KF-TO-PARSE-THAT-ASKS.md` (all three verified on disk). This addendum does NOT
re-state the asks; it fixes the **consume-edge ORDERING** (the acyclic spine) and
names, per edge, the **born-RED kf-side gate** that fires on the consume — the
single-document ground truth the Band-C waves (M.W8–M.W11) sequence against.

**Mandate (M.W0 S5).** Band C is the constellation consume. The asks are dispatched
(the three L docs); what M adds is the SEQUENCE in which kf consumes the sibling
publishes — an ordering that must be ACYCLIC (no kf edge feeds a sibling kf later
re-pins against) and CORRECT (a consume attempted out of order — e.g. glass-ui
before value.js 0.14.0 — breaks the peer chain). Every consume edge below names its
kf-side **born-RED** instrument (the gate that bites the REAL observable on today's
tree and greens ONLY on the sibling publish + the kf re-pin), so
inv-L-acyclic-purity is chartable per edge and `proof:workaround-deletion` /
`proof:peer-satisfied` / `proof:boundary` / `proof:css-parity` each have a named
cure-surface.

---

## §1 — THE ACYCLIC SPINE (the consume order — no cycle)

```
parse-that 0.9.1  →  value.js O 0.14.0  →  kf re-pin  →  glass-ui BB consume
   (PT.M1 first)       (the grammar +          (M.W9/        (M.W8 — the deploy
                        crash + reader          M.W10/         UNLOCK; the LAST
                        APIs kf+value.js         M.W11)         edge in the spine)
                        consume)
```

The dependency arrows run ONE way: parse-that publishes the combinator + reader
surface value.js's grammar consumes; value.js O publishes the grammar + the value
readers' adoption + the two P0 crash fixes kf consumes; kf re-pins value.js and
deletes its direct parse-that edge (so AFTER the re-pin, kf has ZERO direct
parse-that import — the spine is `parse-that → value.js → kf`, acyclic at the
published-API level); glass-ui BB consumes the widened value.js peer + ships its own
fixes, and kf consumes glass-ui LAST (the deploy-unlock edge). **No cycle:** kf never
writes a sibling's tree (inv-16); every consume is a published-registry re-pin (NO
`file:`/`link:`/`git:` pin, NO `overrides`, NO vendored grammar —
`CLAUDE.md §Dependencies`, inv-L-acyclic-purity, `proof:deps-current` PROTOCOL).

**Why this order (the prerequisite chain, not a preference).**

- **parse-that 0.9.1 ships FIRST** — the `package.json`-only typesVersions surgery +
  CJS audit is the lowest-risk cut and the clean publish-posture precondition for the
  later parse-that soundness/combinator cuts (PT.M3/PT.M5/PT.M6). It blocks nothing
  downstream; it greens the `proof:deps-current` typesVersions-absent arm (M.W10 A1).
- **value.js O 0.14.0 follows** — it adopts parse-that's value readers
  (`parseSingleValue`/`parseFunctionArgs`) in `parseCSSSubValue` (VJ-L3), so the
  reader API must be confirmed stable (PT.M2) before value.js cuts. value.js O also
  ships VJ-L1/VJ-L2 + the §9/§13 crash fixes + §14 `./math` — the surface kf's M.W9
  consume deletes its three workarounds against.
- **kf re-pins value.js (M.W9) + authors the css-parity close (M.W11) + consumes the
  parse-that cuts (M.W10)** — the re-pin deletes kf's DIRECT parse-that edge
  (`utils.ts:1`), so the only kf↔parse-that coupling thereafter is transitive through
  value.js. The structural `cssParser` retirement (PT.M6) REQUIRES this kf dep-delete
  to have completed first (it can lag indefinitely — nothing consumes `cssParser`).
- **glass-ui BB consume is LAST (M.W8)** — glass-ui's peer-widen must admit the
  installed value.js (0.13.0 today; the M.W8 edge greens on a glass-ui cut whose peer
  range admits the installed value.js, INDEPENDENT of the value.js 0.14.0 cut — the
  glass-ui track and the value.js track fire on SEPARATE publishes). It is the deploy
  UNLOCK: `proof:peer-satisfied` GREEN → green CI → `deploy-pages.yml` auto-fires.

---

## §2 — THE CONSUME EDGES (per edge: the sibling cut · the kf consume · the born-RED gate)

### Edge A — glass-ui BB 4.1.0 (the deploy unblock — HIGHEST URGENCY) · M.W8

**Sibling cut (glass-ui-owned; inv-16 — kf writes no glass-ui source):**
- **§3 the value.js peer-widen (F-2):** glass-ui 4.0.0 declares peer
  `@mkbabb/value.js@"^0.10.0 || ^0.11.0"` which REJECTS the installed 0.13.0
  (verified live: `proof:peer-satisfied` exit 1, ELSPROBLEMS). The widen admits
  0.13.0+.
- **§1 the SegmentedTabs pill-branch aria guard:** `aria-orientation` is emitted on
  `role=group` (ARIA 1.2 forbids it; `tabs.js:203-204` — `role` conditional,
  `aria-orientation` unconditional).
- **§2 RF-17 W-DOCK-MORPH-FAMILY:** the dock collapse-crossfade strands the `click`
  after `pointerdown` (double-toggle).

**kf consume (ONE atomic commit on the 4.1.0 publish):** re-pin
`optionalDependencies["@mkbabb/glass-ui"]` `~4.0.0` → `~4.1.x`; delete BOTH
`:aria-orientation="undefined"` suppressions (`demo/spring/SpringSidebar.vue:43` +
`demo/@/components/custom/animation-controls/controls/AnimationControls.vue:72`);
delete the `pointerHandled`/`onPlayPointerDown` dock interim
(`demo/@/components/custom/animation-controls/TransportDock.vue`, 9 hits).

**Born-RED kf-side gate(s):**
- `proof:peer-satisfied` — exit 1 TODAY (the F-2 ELSPROBLEMS, verified live); GREEN on
  the peer-widen + re-pin.
- `proof:workaround-deletion` S1 (aria) + S2 (dock) — PENDING TODAY (PRESENT +
  glass-ui 4.1.0 E404); GREEN arm-by-arm on the consume + delete.

**Timing-split note:** if glass-ui ships the peer-widen as a 4.0.x PATCH ahead of the
4.1.0 feature cut, `~4.0.0` already admits it → `proof:peer-satisfied` greens on a bare
re-install (the deploy unblocks) and S1/S2 wait for 4.1.0.

### Edge B — value.js Tranche O 0.14.0 · M.W9 (+ the M.W11 css-parity GREEN flip)

**Sibling cut (value.js-owned; inv-16):** VJ-L1 `flatLeaf` (retires the `FN_NAME`
Symbol), VJ-L2 `FunctionValue.toString()` space-join for `linear()` stops (retires
the regex), VJ-L3 `parseCSSSubValue` (retires the direct parse-that dep), §14 `./math`
value-free subpath (retires the inline `lerpArray`), the §9 CSS-Nesting `nestedRule`
production (cures the THROW), the §13 bare-`linear-gradient` `.opt()` fix (cures the
`TypeError`).

**kf consume (ONE atomic commit on the 0.14.0 publish):** re-pin
`"@mkbabb/value.js"` `^0.13.0` → `^0.14.0`; delete the `linear()` regex
(`utils.ts:119,185–203`); delete the `FN_NAME` Symbol (`utils.ts:45–57` + the clone
re-stamps); delete the direct parse-that import (`utils.ts:1`) + the
`package.json` dependency entry, swapping `(parseAny as any)(...)` for
`parseCSSSubValue`; swap the inline `lerpArray` (`leaves.ts:68–80`) for
`@mkbabb/value.js/math`.

**Born-RED kf-side gate(s):**
- `proof:workaround-deletion` S7 (`linear()` regex) + S8 (`FN_NAME` Symbol) + S9
  (direct parse-that dep) — PENDING TODAY (verified live: `0 GREEN / 5 PENDING / 0
  RED`); GREEN arm-by-arm on the consume + delete.
- `proof:boundary` **W96 parse-that-scan** — AUTHORED in M.W9, born-RED: with the new
  `holdsParseThatSpecifier` assertion added and `utils.ts:1` still present, the gate
  exits 1 naming `utils.ts`; exit 0 after S9 deletes the import. (The viol-M8 cure —
  the gate named at `L.W9.md:381` but never implemented.)
- `proof:css-parity` nesting + bare-linear-gradient rows (M.W11-owned) — RED on 0.13.0
  (the §9/§13 live crashes, verified: nesting THROWS `Parse error at offset 17`,
  bare-gradient THROWS `t is not iterable`); flip RED → GREEN against the installed
  0.14.0 parser.

**Timing-split note:** if 0.14.0 ships VJ-L1/L2/L3 but NOT the §14 `./math` subpath,
S7/S8/S9 delete but the `lerpArray` swap STAYS held (the inline copy survives,
`proof:boundary`-green) and re-arms on a later value.js cut that ships the subpath.

### Edge C — parse-that 0.9.1+ (the cut sequence PT.M1/M2/M3/M5/M6) · M.W10

**Sibling cut (parse-that-owned; inv-16):** PT.M1 (`0.9.1` patch — typesVersions
removal + CJS audit, ships FIRST), PT.M2 (the value-reader API-stability confirm — no
code, the produce-half value.js O adopts), PT.M3 (the packrat `(id,offset)` re-key OR
KILL the unsound LR-grow tier), PT.M5 (the `permutation` combinator for CSS `||`
any-order), PT.M6 (the MAJOR — delete the structural `cssParser`/`CssNode` layer,
RETAIN the value readers — can LAG indefinitely; zero runtime consumers).

**kf consume (arm-by-arm on each cut — NOT one atomic commit; parse-that's cadence):**
re-pin to admit 0.9.1 (A1); confirm the reader API stable (A2 — closes via M.W9's S9,
value.js-track); consume PT.M3 re-key OR record the KILL (A3); the `permutation`
shorthand green (A4 — a TWO-sibling green with value.js adoption); record the Option-B
two-grammar consolidation (A5 — PT.M6, post the M.W9 dep-delete).

**Born-RED kf-side gate(s):**
- `proof:deps-current` **typesVersions-absent** arm (EXTENDED, born-RED) — exit 1
  TODAY: parse-that 0.9.0's `typesVersions` maps to `dist/src/parse/index.d.ts` which
  does NOT exist on disk (verified live: the field PRESENT, `dist/src/` ABSENT); exit 0
  on PT.M1.
- `proof:packrat-sound` (NEW, AUTHORED gate-first, born-RED) — invokes the installed
  `memoize()` over a same-parser-at-two-offsets fixture; RED on the id-only MEMO key
  (`dist/parse.js:1239,1251,1255,1267`); GREEN on the PT.M3 re-key, OR flips to a
  KILL-RECORDED absence assertion if the unsound tier is deleted (the M.W14 DL-L9 KILL).
- `proof:replay-equality` **permutation-shorthand** arm (EXTENDED, born-RED) — a
  non-canonical-order `animation:` shorthand round-trip; RED on the dropped sub-values;
  GREEN only on PT.M5 + value.js adoption (a TWO-sibling green — never a parse-that-only
  green, the inv-ε guard).

### Edge D — the true-CSS-parity frontier (the coordinated value.js O + parse-that close) · M.W11

**kf-side authorship (NO sibling needed for the gate — Band-A obligation):** author
`proof:css-parity` NOW, born-RED on today's 0.13.0 tree over 8 runtime-invocation rows
(verified live: nesting THROW, bare-gradient THROW, `@container`/`@layer` opaque string
body, radial-gradient head mangle, url/env untyped, system-color string fallback +
`parseCSSColor` THROW). The gate is wired into the report-all lane (NEVER the blocking
hygiene chain — it is RED-by-design until the coordinated grammar publishes).

**GREEN flip (Phase 2 — Edge B's consume):** the coordinated value.js O 0.14.0 +
parse-that grammar (the `nestedRule` production, the `.opt()` crash fix + typed radial
head, typed recursive at-rule bodies, `UrlValue`/`EnvValue`/`SystemColor`) flips every
row GREEN against the installed 0.14.0 parser, alongside the M.W9 boundary scan + the
workaround-deletion arms.

---

## §3 — THE NO-CYCLE / INV-16 ASSERTIONS

| Assertion | Why it holds |
|---|---|
| kf writes no sibling tree | inv-16 — every cure lives at the sibling; kf's role is the consume-edge re-pin ONLY |
| no `file:`/`link:`/`git:` pin, no `overrides`, no vendored grammar | `CLAUDE.md §Dependencies`, inv-L-acyclic-purity; `proof:deps-current` PROTOCOL clause enforces published-registry re-pins |
| after M.W9, kf has ZERO direct parse-that import | the spine `parse-that → value.js → kf` is acyclic at the published-API level; `proof:boundary` W96 scan LOCKS it (any re-introduced direct import reds) |
| glass-ui consumes value.js, never the reverse | the glass-ui peer-widen ADMITS the installed value.js; glass-ui is downstream of value.js + kf in the spine |
| the deploy unlocks on glass-ui BB ALONE | `proof:peer-satisfied` (the SOLE deploy blocker, lane-23) is the glass-ui-track gate; the value.js track (Edge B) is orthogonal to the SITE deploy |

**The consume edges fire on SEPARATE sibling publishes** (glass-ui 4.1.0 vs value.js
0.14.0 vs the parse-that cut sequence) and can land in any order EXCEPT the prerequisite
chains named in §1 (parse-that 0.9.1 → value.js O reader adoption; the kf dep-delete →
PT.M6 structural retirement). The `proof:workaround-deletion` ledger reaches
`5 GREEN / 0 PENDING / 0 RED` only when BOTH the glass-ui track (S1/S2) and the value.js
track (S7/S8/S9) have consumed.

---

## §4 — FALSIFIABLE CHECKS (the M.W0 S5 gate clauses this doc satisfies)

- `ls docs/tranches/L/{KF-TO-GLASSUI-BB-ASKS.md,KF-TO-VALUEJS-O-ASKS.md,KF-TO-PARSE-THAT-ASKS.md}`
  all exit 0 (the standing ask surface intact — verified on disk).
- `ls docs/tranches/M/KF-CONSUME-SEQUENCING-M.md` exits 0 (this file).
- `grep -c "born-RED\|workaround-deletion\|proof:peer-satisfied" docs/tranches/M/KF-CONSUME-SEQUENCING-M.md`
  ≥ 1 — every consume edge (§2 A/B/C/D) names its born-RED kf-side gate
  (`proof:peer-satisfied`, `proof:workaround-deletion`, `proof:boundary` W96,
  `proof:deps-current` typesVersions-absent, `proof:packrat-sound`,
  `proof:replay-equality` permutation, `proof:css-parity`).

**Evidence anchors:** `M.md §cross-repo dispatch`; `M.W0.md §S5`; `M.W8`/`M.W9`/`M.W10`/
`M.W11`; `audit/lane-09` (acyclic-purity framing) · `lane-22` (constellation DAG) ·
`lane-26` (workaround-deletion sequencing) · `lane-23` (the F-2 deploy blocker). All
registry states re-verified live 2026-06-17: glass-ui `4.0.0` (4.1.0 E404), value.js
`0.13.0` (0.14.0 E404), parse-that `0.9.0` (0.9.1 E404).
