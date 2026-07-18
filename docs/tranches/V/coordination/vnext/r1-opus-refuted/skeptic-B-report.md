# SKEPTIC B (Fable seat) — constellation boundaries / frozen surfaces / structure feasibility

Posture: draft guilty until evidenced. All paths absolute. Read-only throughout.

---

## G3 / R3 — the "majors re-open the wedge" claim → **AMENDED (heavily)**

Draft: *"glass-ui@7.0.0 peers `value.js@^4.0.0` AND `keyframes.js@^6.0.0`; kf pins value EXACTLY 4.0.0; atlas 7.0.0 consumes the glass7+kf6+value4 tuple. ANY value 5.0.0 or kf 7.0.0 breaks peers → a P127-class wedge."*

Evidence:
- glass-ui `7.0.0` peers, `/Users/mkbabb/Programming/glass-ui/package.json`: `@mkbabb/keyframes.js: "^6.0.0"`, `@mkbabb/value.js: "^4.0.0"` — **CONFIRMED as ranges**. Semver direction is right: `^4.0.0` = `>=4.0.0 <5.0.0`, so value 5.0.0 and kf 7.0.0 DO exit the ranges.
- **BUT both are OPTIONAL peers.** `peerDependenciesMeta` marks `@mkbabb/keyframes.js`, `@mkbabb/value.js`, `@mkbabb/pencil-boil`, `@vueuse/core`, embla, `tw-animate-css` all `{optional: true}`. A major bump against an OPTIONAL peer emits an npm peer WARNING, not an install failure. The draft's "P127-class wedge" severity is over-stated for the glass edge.
- kf pins value EXACTLY: `/Users/mkbabb/Programming/keyframes-v-exec/package.json` `dependencies: {"@mkbabb/value.js": "4.0.0"}` (no caret). **CONFIRMED.**
- **atlas is REFUTED.** `/Users/mkbabb/Programming/atlas/package.json` is `version 4.0.0` (NOT 7.0.0), peers `@mkbabb/glass-ui: "^6.0.0"`, `@mkbabb/keyframes.js: "^5.3.5"`, `@mkbabb/value.js: "^3.1.0"`. Installed deps in `/Users/mkbabb/Programming/atlas/node_modules/@mkbabb/*`: glass **6.0.0**, kf **5.3.5**, value **3.1.0**. Atlas does NOT consume the "glass7+kf6+value4 tuple." Worse: its caret peers (`^5.3.5`, `^3.1.0`, `^6.0.0`) don't even tolerate the CURRENT constellation (kf 6, value 4, glass 7) — atlas is ALREADY off-tuple and must be bumped regardless of any value/kf major.

Amendment (R3): *"Price the boundary honestly by consumer, not as one uniform wedge: (a) glass-ui's kf+value peers are OPTIONAL ranges — a major produces a peer-warning, not an install break; (b) atlas is the actual hard edge but is ALREADY stale (peers glass `^6.0.0`/kf `^5.3.5`/value `^3.1.0`; installed 6.0.0/5.3.5/3.1.0) and owes a bump irrespective of this tranche; (c) kf's EXACT value pin `4.0.0` is the one true hard break a value major forces. The co-land wave targets atlas-successor + the kf exact-pin, not glass's optional peers."*

---

## G4 — the kf frozen-fence pack → **CONFIRMED (core) / AMENDED (chase-site citations wrong)**

- `TimingFunction = (t: number) => number;` at `/Users/mkbabb/Programming/keyframes-v-exec/src/animation/constants/types.ts:45`. **CONFIRMED** verbatim (home/name/signature).
- Exports map exactly `.` + `./engine`, `keyframes-v-exec/package.json`. **CONFIRMED.**
- 44-key `./engine` mirror: public entry is `src/animation/public.ts` (emits to `dist/engine/index.js` via the `engine/index` named entry, `vite.config.ts:170`); the 44 is a BUILT runtime-key count verified by `Object.keys(require('./dist/engine/index.js')).sort()` per `docs/tranches/V/audit/R2-05-lib-target-tree.md:368`, corroborated `V.md:46`, `FOLD-FORWARD.md:44`, `waves/V.B.md:110,183`. **CONFIRMED** (documented, re-verified invariant — not fabricated).
- Depcruise value.js-free-leaf law keyed on `^src/animation/internal/` at `/Users/mkbabb/Programming/keyframes-v-exec/.dependency-cruiser.cjs:171` (rule `leaf-no-engine-no-valuejs`). **CONFIRMED**, and the draft's flag "the CONFIG KEY must move with the rename" is a real vacuous-green risk (a missed key silently disables the boundary proof).
- **AMENDED — the three named chase sites are mis-cited.** Draft: *"THREE chase sites: useCountUp.ts:47, useScrollLettering.ts:57, useScrollTimeline.ts:44."* Reality in `/Users/mkbabb/Programming/atlas/src`:
  - `platform/composables/useCountUp.ts:47` = `import { NumericAnimation } from "@mkbabb/keyframes.js"` — NOT TimingFunction; its TimingFunction is `:48` `from "@mkbabb/value.js"`.
  - `motion/useScrollLettering.ts:57` = the closing `} from "@mkbabb/keyframes.js"` of a multi-symbol block; its TimingFunction is `:52` `from "@mkbabb/value.js"`.
  - `motion/useScrollTimeline.ts:44` = `import { ManualTimeline, type TimingFunction } from "@mkbabb/keyframes.js"` — **the only site that truly chases kf's TimingFunction.**
  The draft listed kf-IMPORT sites and mislabeled all three as TimingFunction chases. kf's `TimingFunction` and value's `TimingFunction` are DISTINCT same-named types; atlas takes value's at 2 of 3. Also internal inconsistency in the source docs: `V.md:47` says "three **atlas** sites chase"; `FOLD-FORWARD.md:37` says "THREE **kf** chase sites"; PROMPT-RECAP `IN-ATLAS-3` says "TimingFunction taken at **2 atlas sites**." The fence itself is still legitimate (kf 6.0.0 immutable; `useScrollTimeline.ts:44` is a live kf consumer), but the transmit pack must carry the CORRECTED census, not the draft's line list.

---

## G5 / R4 — structure authority + flatten feasibility → **CONFIRMED (exists) / AMENDED (blast radius understated)**

- `proof:structure` exists: `/Users/mkbabb/Programming/keyframes-v-exec/scripts/gates/structure/index.mjs`, `RULE_IDS = ["R1"..."R6"]` (line 116), encodes the R2-05 grammar (line 5), `--selftest` proves each rule CAN pass and CAN fail (lines 48–49). **CONFIRMED.**
- LT blueprint: `/Users/mkbabb/Programming/keyframes-v-exec/docs/tranches/V/audit/R2-05-lib-target-tree.md` exists (36 KB). **CONFIRMED.**
- **FEASIBILITY of the owner's `src/animation` flatten = a MINEFIELD, not a one-wave move.** The draft R4 names only "depcruise key repoint + engine-mirror re-verify." That understates the blast radius. `src/animation` is hard-anchored across:
  - `tsconfig.json:30` — the self-alias `"@mkbabb/keyframes.js": ["./src/animation/index.ts"]` and `:17` `"@src/*": ["./src/*"]`.
  - `vite.config.ts` — the `@src` alias (`:38`) plus lib/dts entries at `:41, :156, :172, :205` (`entryRoot: "src/animation"` `:225, :229`, and the `engine/index` public entry `:170`).
  - `vitest.config.ts:7,18` — `@src` alias + `src/animation/index.ts`.
  - `.dependency-cruiser.cjs` — **9** `src/animation` anchors incl. `^src/animation/internal/` (`:171`), `LIGHT_FROM`, `ENGINE_PATH`/`VALUEJS_PATH`.
  - `scripts/gates/structure/index.mjs` — BIRTH SCOPE `src/`; R6 resolves `@src/*` specifiers (`:256`).
  - the dts rollup emit path (`dist/src/animation/…`, `vite.config.ts:205`) → feeds the 44-key mirror verify.
  - `FOLD-FORWARD.md:23` already flags "~8 resolving deep `@src/animation` imports" (CT-04 remainder) — a flatten multiplies these.

Amendment (R4): *"The `src/animation`→`src` flatten and the `internal/` rename are a COORDINATED config-and-graph move, not a rule tweak. Name the full checklist as gate rows: tsconfig self-alias (`:30`) + `@src` map; the ×5 vite entries + `entryRoot`; vitest alias; ALL 9 depcruise anchors (incl. the `^src/animation/internal/` boundary key); the structure-gate birth scope + R6 specifier resolver; the dts emit path; and a post-move 44-key mirror re-verify + full depcruise selftest. A single missed anchor silently vacuous-greens the value.js-free-leaf boundary. Feasible, but born-RED at every anchor until all move together."*

---

## G7 / R13 — subpaths/ shim-vs-export-home → **CONFIRMED (export homes) / AMENDED (framing under-reads owner's dissolve intent)**

Read all 7 `/Users/mkbabb/Programming/value.js/src/subpaths/*.ts`. Each is a PURE curated re-export barrel — named `export {…}` / `export type {…}` from the domain module (`color.ts`→`../color/index`; `css.ts`→`../css/index`; `easing.ts`→`../easing`; `math.ts`→`../foundation/math`; `quantize.ts`→`../quantize`; `transform.ts`→`../transform/decompose`+`../transform/path`; `value.ts`→`../value`). Zero logic, zero runtime indirection. The exports map (`package.json`) points each of the 7 keys at `dist/subpaths/*.js`. So the draft's "these are export homes, not shims; restructure the files freely, never the keys" is **HONEST and evidenced** — they are surface-narrowing barrels (named allowlists, not `export *`).

**BUT the framing is mild apologetics.** The owner's charge ("subpaths/ as a module… code smell supreme, NO SHIMS") targets the DIRECTORY as a parallel structure duplicating the domain dirs. R13's own principle ("restructure freely, never the keys") PERMITS dissolving `subpaths/` entirely — repointing the exports map at the domain barrels (`./color`→`dist/color/index.js`, etc.) and deleting the layer — provided the 7 keys and their exported symbol sets are preserved. The draft should say that dissolution is the likely owner intent and is ALLOWED, rather than defending the layer's existence.

kf analog: **kf has NO `subpaths/` directory** (`find src -iname 'subpath*'` empty). kf's public surface is `.` + a single `./engine` named subpath sourced from `src/animation/public.ts` — cleaner on this axis. The owner's kf indictment target is instead `src/animation/internal/` (9 leaf files: animation-id, binary-search, errors, helpers, leaves, reduced-motion, scheduler, scroll-phases, transport-core), which is the value.js-free-leaf home the depcruise `:171` rule guards.

---

## G8 / R10 — cross-repo ownership fence → **CONFIRMED**

- `/Users/mkbabb/Programming/keyframes-v-exec/docs/tranches/V/FOLD-FORWARD.md` exists and says what the draft claims: §A carries W7/W8 (demo settlement, "NOT IMPLEMENTED — folds whole" `:22,:23`), W9 landing (`:24`), W10 remainder (`:25`), W11 UI corpus (`:26`), W13 close = successor's opening act (`:9,:28`); §B is a 15-row marks register (`:32–:46`). **CONFIRMED.**
- Ownership reading: owner prompt line 13 "*this most recent value.js tranche will own and direct all keyframes.js library items herein… the next proper keyframes.js-owned tranche will adapt accordingly*" + line 9 "*frontend work should focus on value.js*." The draft R10 (value DIRECTS kf library items as specs+dispatch; the kf successor IMPLEMENTS) is a **FAITHFUL** reading, not an under-read: "own and direct" grants direction; "the next…keyframes.js-owned tranche will adapt accordingly" places IMPLEMENTATION in the kf successor; "frontend work focus on value.js" keeps kf's demo/UI corpus (OD-V2/W11, successor-owned per FOLD-FORWARD `:45,:26`) out of scope. R10's ask — make the grant explicit IF direct cross-repo edits are intended — is the correct disambiguation, since "direct" is genuinely ambiguous between "author specs" and "author edits." **CONFIRMED.**

---

## R1 — formation/implementation "contradiction" → **AMENDED (it's a misread; remedy still sound)**

The verbatim is TWO concatenated segments. Lines 3–65 are the value-owned-tranche VISION (line 23: "*majority… on direct code implementation… visual verification*" describes how the FORMED tranche executes). Lines 66–104 are the FORMATION governance ("*This is NOT an implementation phase. Tranche development only. No source edits land from this prompt*," `:68`). Read as composed, they are NOT contradictory: the vision describes the eventual tranche's character; the formation block governs THIS step's deliverable. So R1's premise ("contradiction") is a **misread of the composition** — but the REMEDY (state which phase each edict binds; PHASE A formation / PHASE B implementation) is still useful hygiene.

Amendment (R1): reframe from "resolve the contradiction" to "*disambiguate the two composed segments: the vision (lines 3–65) sets the FORMED tranche's implementation character; the formation block (lines 66–104) binds THIS deliverable to audit+formation only. No contradiction — but label each edict's phase so no executor treats the vision's 'direct code implementation' as a licence to edit during formation.*"

---

## R14 — tests-isomorphism as a gate rule → **AMENDED / partly REFUTED (born-RED on BOTH; no value gate exists)**

Draft: *"kf already conforms; value verifies."*
- **kf:** zero co-located `*.test.ts` in `src` (owner's no-colocation rule already met — CONFIRMED). Test tree LARGELY mirrors src, but NOT strictly: `test/` has 5 support dirs with no src counterpart (`_root, characterization, demo, fixtures, support`) and `src/animation/constants` (types-only) has no test dir. A NAIVE isomorphism gate is **born-RED on kf too** — it needs a support-dir allowlist + a types-only-src exemption. "kf already conforms" over-claims strict conformance.
- **value.js: REFUTED.** `/Users/mkbabb/Programming/value.js`: zero co-located tests (good), BUT `src/` dirs = {color, css, foundation, subpaths, transform} while `test/` dirs = {parsing, transform} only, with the bulk of tests FLAT at `test/` root (`easing.test.ts`, `gradient-parse.test.ts`, `ink.test.ts`, `v4-quantize.test.ts`, `value-domain-clamp.test.ts`, …). `test/parsing/` has no `src/parsing`. This is NOT isomorphic. **AND value.js has no structure gate at all** — no `scripts/gates`, no `proof:*` script. So on value the rule is not "verify," it is "build the gate from scratch + re-mirror the entire test tree" — a born-RED WAVE, not a checkmark.

Amendment (R14): *"Test-isomorphism is a NEW gate rule that is born-RED on BOTH repos: kf needs a support-dir allowlist + types-only exemption to pass; value needs the structure gate CREATED (none exists) and its flat test tree re-mirrored to src. Bill each as its own wave; do not assert either 'conforms.'"*

---

## MISSED — material facts / risks the draft omitted (in my lens)

1. **Atlas's true posture inverts the wedge narrative.** Atlas is `4.0.0`, not 7.0.0, and its peers/installed deps (glass `^6`/6.0.0, kf `^5.3.5`/5.3.5, value `^3.1.0`/3.1.0) are ALREADY behind the current constellation — atlas owes a bump today, before any value/kf major. The one-cut co-land protocol (R3) must include an atlas-catch-up, and the draft's "atlas consumes glass7+kf6+value4" is simply false on disk.
2. **glass peers are OPTIONAL** (`peerDependenciesMeta`) — the draft treats all peer edges as hard breaks; glass's are warnings. Only kf's EXACT `4.0.0` value pin is a true hard failure on a value major.
3. **value.js sits INSIDE the cycle via its own `dependencies`.** `/Users/mkbabb/Programming/value.js/package.json` `dependencies: {"@mkbabb/glass-ui":"^7.0.0","@mkbabb/keyframes.js":"^6.0.0"}` — value runtime-declares kf ^6 and glass ^7. So a value major forces value's OWN kf/glass dep bumps, and there's a manifest-level value→kf→value loop the wedge analysis never mentions. (Whether these are import-live or demo-vestigial, they are in `dependencies`, not `devDependencies`.)
4. **R4's "EXTEND proof:structure" is kf-only.** value.js has NO structure gate — the mechanism the draft assumes on both sides exists only in kf. Any value-side structure/isomorphism enforcement is greenfield gate-authoring.
5. **The fence's "chase" rationale rests on a name collision.** kf-`TimingFunction` ≠ value-`TimingFunction`; 2 of the 3 named atlas sites chase VALUE's type. Transmitting the draft's line list would seed the value tranche with a false census (the exact error IN-ATLAS-5 already corrected).
6. **Doc-internal inconsistency to reconcile before transmit:** `V.md:47` "three atlas sites" vs `FOLD-FORWARD.md:37` "THREE kf chase sites" vs `PROMPT-RECAP IN-ATLAS-3` "2 atlas sites." The handoff must carry ONE reconciled census, not three.

---

## 10-line summary of hardest findings

1. atlas is `4.0.0` on disk (installed glass 6.0.0 / kf 5.3.5 / value 3.1.0), NOT the "atlas 7.0.0 / glass7+kf6+value4 tuple" G3 claims — REFUTED, and atlas is already off-current-tuple.
2. glass-ui 7.0.0's kf+value peers are OPTIONAL (peerDependenciesMeta) → a major yields a peer WARNING, not an install break; the "P127-class wedge" severity is over-stated for glass.
3. The one true hard break a value major forces is kf's EXACT pin `"@mkbabb/value.js":"4.0.0"` — that, plus a stale-atlas catch-up, is the real co-land scope (amend R3).
4. G4 fence CORE verified verbatim: `TimingFunction` at `constants/types.ts:45`; exports `.`+`./engine`; 44-key mirror (built-key invariant, R2-05:368); depcruise `^src/animation/internal/` at `.dependency-cruiser.cjs:171`.
5. G4's three chase-site citations are mis-labeled: only `atlas/…/useScrollTimeline.ts:44` chases kf's TimingFunction; useCountUp:47/useScrollLettering:57 import it from value.js — a name-collision census error to correct before transmit.
6. The `src/animation` flatten is a minefield: hard-anchored in tsconfig self-alias `:30`, ×5 vite entries, vitest, 9 depcruise anchors, the structure-gate birth scope, and the dts emit path — R4 understates it as "depcruise key + mirror re-verify."
7. subpaths/*.ts ARE pure curated export-home barrels (not runtime shims) — R13 CONFIRMED — but the framing under-reads that R13 itself PERMITS dissolving the directory (repoint exports at domain barrels), which is the owner's likely intent.
8. R14 REFUTED for value.js: test tree is non-isomorphic (`test/{parsing,transform}` + flat root tests vs 5 src dirs) AND value has NO structure gate to extend; born-RED on kf too (5 support dirs + constants gap).
9. value.js `dependencies` declares glass `^7.0.0` + kf `^6.0.0` — value itself sits in a manifest-level cycle the wedge analysis omits.
10. R1 is a misread not a contradiction (vision segment vs formation-governance segment); R10 ownership reading is FAITHFUL; G5/G8 existence claims (proof:structure R1–R6, LT blueprint, FOLD-FORWARD 15-row §B) all CONFIRMED.
