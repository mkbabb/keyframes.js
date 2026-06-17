# Tranche L · audit/precepts-L.md — THE PRECEPT REGISTER K→L

**Lane:** precepts-L. **Method (inv ε):** every row cites a `file:line`, a violation id from
`audit-32-skeleton.txt` (`⚠N`), or a wave ref. Verified against the tree at `4f1fc4c`
(branch `tranche-j-dev` ≡ master at J-close; K landed on master at `9bbc227`). Read-only —
this lane writes ONE audit doc and touches no source, tests, gates, or CI.
**Purpose:** (1) record which J/K-inherited precepts HELD through all 12 K waves + the CI-greenify
session; (2) name every precept violation the 36-lane audit found and designate each as a NAMED
L CURE; (3) carry the full invariant set forward with their correct L form; (4) surface the three
new L invariants and the tensions L must resolve before any Band-A wave.

---

## §0 — THE STRUCTURAL SPINE (carried A→K, verified at `9bbc227`)

The five foundational precepts that have never been violated since Tranche A.

| # | Precept | Origin | Gate | K status |
|---|---|---|---|---|
| P1 | **no-legacy** | A/FINAL | `proof:no-deprecated-guard` | HELD through all 12 K waves. Zero `deprecat/legacy/workaround/hack/FIXME/TODO(` in `src/` at K close (`9bbc227`). The FN_NAME Symbol stamp and the linear() regex are WORKAROUNDS at the consume seam — `⚠18/⚠20` indict them; L cures them via the acyclic-spine path (value.js fix → re-pin → deletion). |
| P6 | **inv α — static/dynamic boundary** | A/FINAL:94 | `proof:boundary` + `proof:published-surface` | HELD. Light modules carry zero static `value.js` edge at K close. `proof:published-surface` GREEN. The direct `@mkbabb/parse-that` prod dep (`⚠24`) breaches the spirit of this precept — `src/animation/utils.ts` reaches through value.js's abstraction layer to compose its own parsers. L cures it via W94/VJ-L3 (a `parseCSSSubValue` primitive in value.js; kf drops its direct parse-that dep). `proof:boundary` extended in L.W9 to also gate this seam (audit W96). |
| P7 | **inv β — library is glass-ui-free** | A/FINAL:107 | `package.json` dep layout | HELD. Library deps = `{parse-that, value.js}` only at K close (`package.json`). glass-ui `~4.0.0` in optional/devDependencies only. |
| P11 | **inv ζ — dogfood** | C/FINAL:77 | `proof:dogfood` | HELD. 3 raw `requestAnimationFrame` allowlist-gated at K close. The ED-3 dogfood inversion (`⚠ audit HIGH` / W125) is a STAGED NOT LANDED gap: 63 demo files still import `@src/animation/*`; zero `@mkbabb/keyframes` barrel imports in demo. L.W8 lands it. |
| P13 | **inv-16 — consume published siblings, don't fork** | H/FINAL:89 | `proof:deps-current` / lockfile | HELD structurally: glass-ui `~4.0.0` and value.js `^0.13.0` both resolve from registry at K close (`9bbc227`). Zero `file:` protocol. The three workaround violations (`⚠18/⚠20/⚠24`) are CONSUME-SEAM patches, not forks — they violate the spirit, not the structure. The acyclic-spine cure (fix at sibling, re-pin) is the L obligation. |

---

## §1 — THE K-INHERITED INVARIANTS (carried with their correct L form)

### P14 — Gate-ORACLE precept (I-born, K re-verified)

**Statement:** *a gate's ORACLE must be the PRODUCT PROPERTY a human would check, through the
SAME surface the human uses; source/jsdom/snapshot/self-baseline = HYGIENE.*

**K status — HELD.** The proof:gate-is-runtime meta-gate (`scripts/proof-gate-is-runtime.mjs:84-93`)
polices the correctness tier. K.W0's cold-path P0 cure (`scenePlaybackAdapters.ts:76-79` — the born-RED
oracle; L.md:138) was the precept's own thesis: the un-exercised axis (hero cold-path → cube-animating)
exposed a green-but-broken gate. The cure is the J.W4/K.W0 lineage: plant the born-RED on the exact
cold-path scenario, not a structural proxy.

**L carry:** every Band-A wave's born-RED gate must assert the PRODUCT property the round-trip
invariant claims to certify — not a source-shape grep, not a test-anchor count. The five replay-equality
breaches (`⚠15/⚠16/⚠17/⚠28/⚠31`) ALL silently pass today because no fixture exercises the
breach inputs (Lane 33 audit). `proof:replay-equality` is the L born-RED gate for this tier
(audit W89, L.W1 first motion).

---

### P14b — AXES completeness corollary (J-born, K-extended to the gate-honesty axis)

**Statement:** *a breadth claim is only as true as its un-exercised axes; the un-exercised axis
is where the next lie lives.*

**K status — HELD for the axes K exercised. NEW AXIS NAMED: the gate-is-runtime blind-spot.** The
proof:compile-replay gate is SOURCE-SHAPE: it greps `.test.ts` anchors and proves that SOME compile
fixtures exist — it does NOT enumerate the input space. The round-trip gates on the K surface have
the same structural gap as J's cold-path gate had on the subject-animating axis: they are green over
a corpus that DOES NOT CONTAIN the breach inputs. Lane 33 confirms: `!important`, `@property`
backward-serialize, per-stop `animation-composition`, named selectors, and multi-color densify ALL
silently pass (`Lane 33 KEY FINDINGS item 1`).

**L form:** `proof:replay-equality` is born-RED on the EXACT five breach inputs (an `opacity:0 !important`
keyframe, a registered `--prop @property` block, a per-stop `add` operator, an `entry/exit` named selector,
a 2+-changing-color track). Gate RED on today's tree before L.W1's cure greens it — the born-RED
witness is the wave's first deliverable.

---

### P15 — Two-tier taxonomy (correctness / hygiene)

**K status — STRUCTURALLY SOUND, CI contract still flat.** K.W0 recorded this as a USER-DOMAIN call
(T1 disposition: "formally own the 109-gate corpus, kill the 'collapse the lattice' language" or act).
The K close did NOT kill the language (`precepts-k.md:253` — "collapse the lattice" persists uncancelled;
`⚠9` notes this as a K.WZ inv ε overclaim). **L form:** L.W4 (gate-suite transposition) must either
(a) formally kill the "collapse the lattice" language from all docs including `precepts-k.md:253`, or
(b) land net-deletion on the hygiene script estate. Neither both-at-once is acceptable (the K overclaim
shape). The proof:peer-satisfied gate (Lane 36) and the born-RED ingest arms (L.W3) are net-NEW gates
that earn their seat; every net-new gate must be accompanied by a rationale row in `gate-taxonomy.md`.

---

### P16 — P-invariant-28: no perpetual punts

**K status — HELD. `proof:chronic-closure` 44 rows, all ten ≥4-tranche riders EXITED** at K close
(`9bbc227`). The meta-chronic DL-K2 (≥9 tranches) was the causal root of the prior H→J
mis-terminations (`⚠4`); K.W0's oracle rebuilt it correctly.

**L carry:** the deferred-ledger-L.md inherits four HANDOFF edges (DL-K9 RF-17, DL-K7
GlassControlPoint, FB-3 MorphSVG, PT-2 packrat). Each has a named tripwire. None may be
re-BOOKED as L waves without consuming the tripwire artifact; none may sit more than 2 tranches
without a P-invariant-28 audit. L.WZ closes the ledger with explicit terminal verdicts on all four
(land / re-BOOK with extended tripwire / KILL with evidence). `proof:chronic-closure` runs on the L
ledger from L.W0; the substrate swap and ledger grooming are ONE motion (the P-SUBSTRATE law,
K-born).

---

### P17 — Born-RED discipline

**K status — HELD across all 12 K waves and the CI-greenify session.** Every K gate cites a
born-RED witness (the CI-greenify session itself confirmed the discipline: the 6-round whack-a-mole
revealed three roots — fail-fast, 259 fixed-ms sleeps, Monaco-flake — all resolvable without
born-RED compromise; Lane 10 audit).

**L form:** unchanged. Every Band-A wave's born-RED gate lands BEFORE the cure. The five
replay-equality breach fixtures are the archetype: each fixture must RED on today's `9bbc227` tree
before L.W1 greens it. A wave with no born-RED gate is not started (L.md:102).

---

### P17b — inv-L-device-honesty (NEW — the gate-suite law, from the CI-greenify lesson)

**Origin:** L.md:72-75; Lane 10 audit; `⚠` on 259 fixed-ms sleeps (Lane 33 HIGH).
**Statement:** *a CI gate asserts a device-INDEPENDENT predicate, or declares `observe-only` with
a CATEGORY (wall-clock / pixel-render / physics-settle) and a recorded architectural cure. No gate
passes on the fast dev box yet fails on the slow runner.*

**Evidence:** `grep waitForTimeout scripts/*.mjs` → 259 occurrences; the settle-on-state cure
(`scripts/lib/demo-driver.mjs:654-713 navToScene`) was applied to ONE function only; the 6-round
CI-greenify session (Lane 10) traced every flake to these 259 sleeps + the fail-fast posture.
**L.W4 is the structural cure:** a `waitForRender/settle` lib primitive replaces every fixed-ms
sleep; a report-all (non-fail-fast) posture lands for the demo-smoke job; an observe-only category
taxonomy is recorded in `gate-taxonomy.md`. Until L.W4 is complete, every new gate MUST use the
existing `navToScene` settle idiom — no new `waitForTimeout` constants.

---

### P18 — Dev/impl boundary

**K status — HELD.** This lane (precepts-L) writes one doc, no source, tests, gates, or CI.
**L form unchanged:** the dev phase ends when L.md is authorized; every audit lane is read-only.

---

### P20 — Version-owner / user-domain publish

**K status — `4.3.0` published.** `release.yml` run `27640592021` SUCCESS; master `9bbc227` green;
`npm view @mkbabb/keyframes.js version` → `4.3.0` (Lane 16). **L carry:** the release.yml
gate-on-correctness gap persists: `release.yml` omits `proof:published-surface` and `proof:deps-current`
(`⚠ Lane 36 gate-ORACLE completeness`). L.W4's publish-path hardening adds both gates to `release.yml`
before the next publish fires. The version-cadence decision (MAJOR `5.0.0` vs MINOR `4.4.0`) is
USER-DOMAIN; L.WZ proposes the criteria (the round-trip totality + barrel-dogfood + keyframes-vue-publish
set argues `5.0.0`).

---

### P21 — glass-ui-fixes-in-glass-ui

**K status — HELD structurally; THREE consume-seam band-aids found (`⚠1/⚠2/⚠3/⚠7`).** The
`⚠5` RF-17 kf pointerdown interim was retained at K.W1 as a documented workaround of a glass-ui
primitive defect — a 3rd-interim shape the no-workaround precept indicts. **L.W9 retires all four
via the Band B acyclic-spine path:**

- `demo/spring/SpringSidebar.vue:43` `:aria-orientation="undefined"` — DELETE on glass-ui BB
  aria-orientation fix publish (`⚠1/⚠7`, L-CURE-1).
- `demo/…/AnimationControls.vue:66` same invalid attribute left live on every scene — the
  INCOMPLETE apply (`⚠3`) must also be deleted (same publish gate; L-CURE-2).
- RF-17 pointerdown workaround in kf — DELETE on glass-ui 4.1.0 consume-edge (`⚠5`, L-CURE-3).

Until the glass-ui BB publish fires, the existing suppressions are held AS-IS (inv-L-acyclic-purity:
do not add more consume-side fixes; hold the honest red state). The born-RED gate for these deletions
is the L.W9 consume-edge gate — it bites when the kf tree carries the suppress but glass-ui 4.1.0
has landed the structural fix.

---

### P-TASTE — The gate-green / human-approval gap (K-born)

**Origin:** `precepts-k.md §2/S2`; K FINAL.
**Statement:** *gate-green certifies the named oracles pass. It does NOT certify the running product
looks or feels correct to a human. Every wave's close must include a USER-DRIVE moment before the
wave is declared closed.*

**K status — HELD as process (non-gateable).** The K.W0 cold-path fix, the K.W9/W10 round-trip
close, and the K Band I design waves all carried USER-DRIVE confirmations before their waves closed.
**L form unchanged.** Especially load-bearing for L: the round-trip totality waves (L.W1/L.W2) must
be USER-DRIVEN over the `validate()` verb once L.W6 ships — the "does this CSS round-trip?" question
is precisely the taste-boundary question an automated test cannot close alone.

---

### P-SUBSTRATE — Chronic-closure substrate single-source (K-born)

**Origin:** `precepts-k.md §3/T6`.
**Statement:** *before any new chronic is opened or closed, the `proof:chronic-closure` parse target
MUST be the current-tranche ledger AND green on a groomed substrate. The substrate swap and ledger
grooming happen in ONE motion.*

**K status — HELD at K.W0.** `docs/tranches/K/audit/deferred-ledger-k.md` was the parse target;
`proof:chronic-closure` GREEN on 44 rows.
**L form:** L.W0 points `proof:chronic-closure` at `docs/tranches/L/audit/deferred-ledger-L.md`
and grooms it to GREEN before any L chronic is opened. The four HANDOFF edges (DL-K9/DL-K7/FB-3/PT-2)
must appear in the L ledger with their inherited status and tripwires; no synthetic row gaps are
permitted.

---

## §2 — THE NEW L INVARIANTS

These three invariants are CHARTERED in `L.md:63-75` and are repeated here with their exact L form,
evidence anchors, and the audit violations each was born to close.

### inv-L-totality — Replay-equality TOTAL

**Statement:** *the round-trip is the parser run backward for the FULL parsed surface, or a named
`CompileRefusal` — never a silent drop or a wrong-color ship. The `format.ts` THROW idiom for
un-serializable easing is the law; L extends it to `!important`, `@property`, composition, and
multi-color.*

**Evidence (the five breach classes):**

| Breach | Source | Audit | L-CURE |
|---|---|---|---|
| `!important` silently dropped | `adapter.ts` `declsToVarMap` reads only `decl.name/decl.value`; `Declaration.important` exists in value.js `stylesheet.d.ts:5` | `⚠31` | L.W1 — honor + emit `!important`; `proof:replay-equality` fixture RED today |
| `@property` never re-emitted backward | `engine.ts:1225` registers but `compileToCSS`/`CSSKeyframesToString` never calls `serializeStylesheetItem` | `⚠15` | L.W1 — wire backward serialize; fixture RED today |
| per-stop `animation-composition` asymmetric | `format.ts:81-103` emits per-stop easing, NOT per-stop composition; `adapter.ts` captures it, `frame-compiler.ts` stores it | `⚠16` | L.W1 — close `declaredKeyframeBody`; fixture RED today |
| named keyframe selectors THROWN | `frame-compiler.ts:179-188` SELECTOR_KEYWORD_RE/SELECTOR_PERCENT_RE rejects `entry/exit/cover/contain` with `AnimationOptionError`; value.js ingests them | `⚠17` | L.W1 (SELECTOR-FLOOR) |
| multi-color silent sRGB densify | `compile-color.ts:188-190` ships verbatim sRGB with `eligible:true` at ΔE=0.82; single-color at same drift HARD-REFUSES | `⚠28/⚠29` | L.W2 — per-key independent densify or named `CompileRefusal`; fixture RED today |

The `proof:replay-equality` gate (W89) is the enforcement surface. It is born-RED on ALL five
breach inputs on the `9bbc227` tree; L.W1's cure greens it.

---

### inv-L-acyclic-purity — No consumer-side sibling-patch

**Statement:** *a defect in a published sibling is fixed AT THE SIBLING and consumed via re-pin —
NEVER corrected at the kf consume seam. Every existing such workaround is a born-RED L deletion
gated on the sibling publish.*

**Evidence (the six CI-greenify-era band-aids):**

| Band-aid | Location | Audit | L-CURE (Band B gate) |
|---|---|---|---|
| `:aria-orientation="undefined"` suppression (INCOMPLETE — only SpringSidebar) | `demo/spring/SpringSidebar.vue:43` | `⚠1/⚠2/⚠7` | L-CURE-1: DELETE on glass-ui BB aria-orientation fix publish (W24/W50) |
| `:aria-orientation` still live on AnimationControls (the second strip) | `demo/…/AnimationControls.vue:66` | `⚠3` | L-CURE-2: same glass-ui publish gate; the suppression is INCOMPLETE |
| RF-17 pointerdown kf interim workaround | `TransportDock.vue` / `useAnimationGroupPlayback.ts` | `⚠5` | L-CURE-3: DELETE on glass-ui 4.1.0 (W-DOCK-MORPH-FAMILY) consume-edge (W1/W43) |
| `linear()` regex normalize for value.js round-trip bug | `src/animation/utils.ts:193-196` | `⚠19/⚠20` | L-CURE-4: DELETE when VJ-L2 (`linearStopsToCSS`) lands and kf re-pins (W87/L.W9) |
| `FN_NAME` Symbol stamp on value.js `ValueUnit` instances | `src/animation/utils.ts:42-57, 292-299` | `⚠18` | L-CURE-5: DELETE when VJ-L1 (`FlatLeaf`/`flattenDeclaration`) lands and kf re-pins (W86/L.W9) |
| Direct `@mkbabb/parse-that` prod dep for `any` combinator | `src/animation/utils.ts` (parse-that imported) | `⚠24` | L-CURE-6: DELETE when VJ-L3 (`parseCSSSubValue`) lands; `proof:boundary` extended (W94/W96/L.W9) |

Each cure is gated on the sibling publish — NOT on a time estimate. Each is born-RED kf-side at
the moment the sibling publish lands with the fix (the deletion gate bites while the workaround
remains and the sibling is fixed). No cure is carried as a kf-local fix or a `file:` pin.

---

### inv-L-device-honesty — The gate-suite law (NEW — see P17b above)

Stated above in §1/P17b. The enforcement artifact is L.W4's `waitForRender/settle` primitive and
the `gate-taxonomy.md` category column. Evidence: 259 `waitForTimeout` occurrences in `scripts/*.mjs`
(Lane 33 HIGH); the macOS-pass/Linux-fail flake chain (Lane 10 audit roots 1+2).

---

## §3 — THE CI-GREENIFY-ERA BAND-AIDS: ENUMERATED L CURES

The 36-lane audit found the following specific violations. Each is designated as a NAMED L CURE —
not carried forward, not re-BOOKED. The cure is either Band A (kf-internal, L.W1/L.W2) or Band B
(fix at sibling, L.W9 consume-edge), never a kf patch of a sibling defect.

### Group A — aria-orientation suppression (INCOMPLETE + WRONG LAYER)

**Violations:** `⚠1`, `⚠2`, `⚠3`, `⚠7`.

**Root:** glass-ui 4.0.0's `SegmentedTabs` emits `aria-orientation` unconditionally even on
`role="group"` (pill variant), where ARIA forbids the attribute. kf's consume seam suppresses it
with `:aria-orientation="undefined"` on ONE of (at least) TWO affected pill strips — the second
strip (`AnimationControls.vue:66`) is left emitting the invalid attribute across every scene
(`audit-32-skeleton.txt CROSS-REPO-ASK findings:204-210`).

**Why wrong layer:** fixing the attribute at the consumer requires per-call-site suppression across
ALL pill SegmentedTabs in ALL scenes — a combinatorial surface. The one-line guard in glass-ui
(`role === 'group' ? undefined : 'horizontal'`) corrects ALL consumers simultaneously.

**L cure:** L-CURE-1 (SpringSidebar deletion) + L-CURE-2 (AnimationControls deletion), both gated
on glass-ui BB W50 (aria-orientation guard) publishing. L.W9 dispatches the ask; the deletion PRs
are born-RED (while the suppress exists AND the sibling is fixed, the gate bites). Interim: hold the
existing one-site suppression AS-IS; do NOT add more per-site suppressions (inv-L-acyclic-purity).

### Group B — linear()/FN_NAME/parse-that-dep workarounds (⚠18, ⚠19, ⚠20, ⚠24)

**Violations:** `⚠18` (FN_NAME Symbol stamp), `⚠19` (linear() round-trip asymmetry — the breach
is in value.js), `⚠20` (the kf regex fix for the value.js bug), `⚠24` (direct parse-that dep for
the `any` combinator).

**⚠18/FN_NAME:** `src/animation/utils.ts:42-57, 292-299` stamps a `FN_NAME` Symbol on value.js
`ValueUnit` instances. `ValueUnit.clone()` drops the Symbol; kf re-stamps on every clone. kf is
writing invisible state onto a class it does not own. The correct fix is a typed `FlatLeaf`
first-class type in value.js (VJ-L1 / W86) so the classification is the value.js object's own
identity. L-CURE-5: delete the Symbol stamp when VJ-L1 lands.

**⚠19/⚠20/linear():** `src/animation/utils.ts:193-196` normalizes `linear()` stop syntax
(`0.5, 25%` → `0.5 25%`) to paper over a known value.js serialize/parse asymmetry (comment:
"a value.js 0.12.0 serialize/parse asymmetry"). This is explicitly a no-workaround violation.
L-CURE-4: delete the regex when VJ-L2 (`linearStopsToCSS`) lands (W87/L.W9).

**⚠24/parse-that-dep:** `src/animation/utils.ts` imports `@mkbabb/parse-that` solely to compose
value.js parsers with the `any` combinator. kf must not reach through value.js's abstraction layer.
The fix is `parseCSSSubValue(property, str)` in value.js (VJ-L3 / W94). L-CURE-6: delete the
direct parse-that dep when VJ-L3 lands; `proof:boundary` extended (W96) to catch future recurrence.

### Group C — multi-color silent-densify (⚠28, ⚠29)

**Violations:** `⚠28` (multi-color track ships verbatim sRGB with `eligible:true` at ΔE=0.82),
`⚠29` (the BOOK fallback is a SILENTLY LOSSY emit, not a safe deferral).

**Root:** `compile-color.ts:188-190` marks multi-color densify as "BOOK" but the fallback action is
to emit the wrong color verbatim — not a `CompileRefusal`. The honest-refusal clause (the same law
that makes `format.ts:43-51` THROW on un-serializable easing) requires: either independently densify
each changing-color key via `sampleColorRamp`/`deltaEOK` (already published at 0.13.0), or REFUSE
with a named `CompileRefusal.MULTI_COLOR_DENSIFY_UNSUPPORTED`. The current behavior violates
inv-L-totality: a silent approximation was shipped in the SAME surface that promises honest refusal.

**L cure (L.W2, CC-3.5):** densify EACH changing-color key independently, or refuse — never ship
the verbatim sRGB block silently. The `proof:compile-replay` gate is extended with a multi-color
fixture (W114) that is born-RED on today's tree (the gate currently passes over the EXACT lossy case).

### Group D — !important + @property silent-drops (⚠15, ⚠31)

**Violations:** `⚠15` (`@property` registrations never re-emitted backward — `engine.ts:1225`
registers, but `compileToCSS`/`CSSKeyframesToString` never calls `serializeStylesheetItem`), `⚠31`
(`!important` dropped at `adapter.ts` `declsToVarMap` — `Declaration.important` exists in value.js but is
never read).

**Root:** both are the same structural gap as the `format.ts` THROW idiom was built to close for
easing, now unguarded for two more channels. `⚠31` is the higher-severity breach: `!important`
is valid in CSS `@keyframes` declarations (CSS Animations L2 allows it for specificity override);
dropping it silently makes the round-trip semantically wrong. `⚠15` is a completeness gap: a
compiled artifact that animates a `@property`-registered `--custom-prop` will silently lose its
`<syntax>` type annotation and `initial-value` on re-ship.

**L cure (L.W1 — Replay-equality FLOOR):** `adapter.ts` reads `Declaration.important` and surfaces
it on the resolved frame; `format.ts declaredKeyframeBody` emits `!important` when set. `compileToCSS`
calls `serializeStylesheetItem` (value.js already has it at 0.13.0) for every entry in `propertyRegistry`.
Both are born-RED in `proof:replay-equality` on the `9bbc227` tree.

---

## §4 — WHERE THE K PRECEPTS STRAINED (new L-specific observations)

### S1 — The replay-equality "TOTAL" overclaim (the K close's inv ε strain)

**What happened:** K.W9/K.W10 established replay-equality for a WELL-DEFINED SUBSET, and the K FINAL
was honest about the subset status. But `compile.ts`/`format.ts` module docs assert totality
("a var()/matrix3d()/cqw round-trips VERBATIM", "ONE serialization authority") while the breach
classes above are ACTIVE and UNGATED. The 36-lane audit (Lane 28 / COMPILER-ROUNDTRIP verdict) found
the structural claim holds for the scalar axis but five named breach classes escape the invariant
without a gate biting.

**The lesson:** a totality claim in a module doc that is NOT enforced by a gate that bites on the
breach inputs is an inv ε overclaim. The `format.ts` THROW idiom for easing is the model: the gate
IS the claim. `proof:replay-equality` (W89) must be the gate that makes the totality claim true — it
is not asserted in the docs, it is mechanically enforced.

**L precept addendum to P14 (gate-claim parity):** *every totality claim in source or module docs
that is not backed by a gate asserting the claim on the breach inputs is an inv ε overclaim. The
gate IS the claim; the doc is the annotation.*

---

### S2 — The compile-scroll blindspot (W9 ↔ W10 non-composition)

**What happened:** K.W9 shipped the scroll-grammar round-trip; K.W10 shipped the compiler. But
`compile.ts` has zero `animation-timeline`/`animation-range` emit (`L.md:39`: "the compiler is
scroll-BLIND"). The two K waves never composed their output channels — the FORWARD leg (CSS → engine
via scroll grammar) and the BACKWARD leg (engine → CSS via compiler) have a non-overlapping output
for the scroll axis.

**The lesson:** two waves that each certify their own half of a bi-directional pipe do not together
certify the pipe. The compose gate (a fixture that does BOTH directions and checks equality) is the
missing artifact. L.W2 installs it (`proof:compile-replay` extended with a scroll-driven fixture
born-RED on today's tree).

---

### S3 — The F-2 peer-cycle: a born-LIVE ELSPROBLEMS on the current published stack

**Root:** `glass-ui peerDependencies: @mkbabb/value.js: ^0.10.0 || ^0.11.0` does not admit value.js
`0.12.0` or `0.13.0`. Any kf consumer that installs both `@mkbabb/glass-ui` and `@mkbabb/value.js@^0.13.0`
today gets an npm peer-warning blast radius (`⚠8`; Lane 36 HIGH). This is NOT kf's failure to fix —
it is a glass-ui BB obligation. But it is kf's obligation to (a) dispatch the ask (L.W9) and (b)
gate the resolution: `proof:peer-satisfied` (L.W4) bites while the stale peer range is live,
staying RED until glass-ui BB ships a peer-range that admits 0.13.0.

---

## §5 — L TENSIONS TO RESOLVE (before Band-A waves proceed)

### T1 — "collapse the lattice" language still live (`precepts-k.md:253`)

`precepts-k.md:253` uses "collapse the lattice" language that K.WZ claimed was resolved (`⚠9`
documents the overclaim). The K.WZ resolution was "T1 RESOLVED" without naming which option.
**L must:** either delete the language from `precepts-k.md:253` and record the actual K decision
(net-deletion route or "formally own the 109-gate corpus"), OR re-open T1 as an L.W4 item with a
named disposition. The tension must close before L.W4 gates the corpus posture.

### T2 — The T1 / gate-corpus KISS tension (inherited, L.W4's charter decision)

The gate corpus grew 14 gates net in K. L.W4 adds `proof:replay-equality`, `proof:ingest-replay`
arms, `proof:peer-satisfied`, `proof:agent-validate`, `proof:demo-on-published-surface`, and
`proof:transport-events`. Each net-new gate must demonstrate that the product property it asserts
cannot be covered by an existing gate — and every new gate must carry a row in `gate-taxonomy.md`
(the Lane 33 audit precept). If the net count after L exceeds 125 gates, the "collapse the lattice"
project re-opens as a FORMAL K/L debt item, not a carry.

### T3 — The keyframes-vue publish: release discipline and peer floor

`packages/keyframes-vue/package.json` has version `0.1.0` but has NEVER been published (Lane 36
HIGH; `⚠ CROSS-REPO-ASK findings:236`). The K.W12 ED-2 discharge was STAGED, not closed. L.W8
must publish under the same `release.yml` discipline (gate-first, proof:published-surface before
npm publish). The peer floor must read `>=4.3.0` (or `>=5.0.0` if L cuts MAJOR), not `>=4.2.0`.

### T4 — The version-cadence decision (USER-DOMAIN; L.WZ proposes the criteria)

Three features argue MAJOR `5.0.0`: (1) the round-trip is now TOTAL (inv-L-totality enforced by
`proof:replay-equality`), a semantic expansion of the public contract; (2) the ED-3 barrel-dogfood
flip changes the published import surface (consumers on `@src/animation/*` deep imports break); (3)
keyframes-vue 0.1.0 is a first publish, logically coincident with a MAJOR cut. The counter-argument
is that Band B (W9/W10) is not fully resolved at L's close. L.WZ proposes the criteria and the user
decides; the decision must be recorded before L.WZ closes.

---

## §6 — DISPOSITIONS ROLL-UP

| Violation / Tension | Audit | Severity | L-CURE / L wave | Status |
|---|---|---|---|---|
| `!important` silently dropped | `⚠31` / `adapter.ts` `declsToVarMap` | P0 (replay-breach) | L.W1 FLOOR; `proof:replay-equality` born-RED | NOT CARRIED |
| `@property` never backward-serialized | `⚠15` / `engine.ts:1225` | P0 (replay-breach) | L.W1 FLOOR | NOT CARRIED |
| per-stop composition asymmetric | `⚠16` / `format.ts:81-103` | P0 (replay-breach) | L.W1 FLOOR | NOT CARRIED |
| named selector THROWS | `⚠17` / `frame-compiler.ts:179-188` | P1 | L.W1 SELECTOR-FLOOR | NOT CARRIED |
| multi-color silent sRGB densify | `⚠28/⚠29` / `compile-color.ts:188-190` | P0 (honest-refusal) | L.W2 CC-3.5; fixture born-RED | NOT CARRIED |
| `:aria-orientation` suppression INCOMPLETE | `⚠1/⚠2/⚠3/⚠7` / `SpringSidebar.vue:43`, `AnimationControls.vue:66` | P1 (wrong-layer) | L-CURE-1/2, L.W9 Band B | NOT CARRIED |
| RF-17 pointerdown kf interim | `⚠5` / `TransportDock.vue` | P1 (workaround) | L-CURE-3, L.W9 Band B (glass-ui 4.1.0) | NOT CARRIED |
| `linear()` regex normalize | `⚠19/⚠20` / `utils.ts:193-196` | P1 (workaround) | L-CURE-4, L.W9 Band B (VJ-L2) | NOT CARRIED |
| FN_NAME Symbol stamp on ValueUnit | `⚠18` / `utils.ts:42-57` | P1 (inv-16 spirit) | L-CURE-5, L.W9 Band B (VJ-L1) | NOT CARRIED |
| Direct parse-that prod dep | `⚠24` / `utils.ts` import | P1 (acyclic-spine) | L-CURE-6, L.W9 Band B (VJ-L3); `proof:boundary` extended | NOT CARRIED |
| Compiler scroll-BLIND | W12 / `compile.ts` zero timeline emit | P1 | L.W2 CC-6 | NOT CARRIED |
| `proof:replay-equality` does not exist | Lane 33 HIGH | P0 (gate blind-spot) | L.W1 first motion (born-RED gate) | NOT CARRIED |
| 259 fixed-ms sleeps (device-dependent) | Lane 33 HIGH | P1 | L.W4 `waitForRender/settle` primitive | NOT CARRIED |
| release.yml omits proof:published-surface | Lane 36 / `⚠ gate-ORACLE` | P1 | L.W4 publish-path hardening | NOT CARRIED |
| F-2 peer-cycle live ELSPROBLEMS | `⚠8` / Lane 36 HIGH | P1 | `proof:peer-satisfied` (L.W4); glass-ui BB ask (L.W9) | NOT CARRIED |
| keyframes-vue unpublished | Lane 36 / W56 | P1 | L.W8 publish ceremony | NOT CARRIED |
| ED-3 dogfood inversion STAGED | W125 / 63 files `@src` | P1 | L.W8 barrel flip | NOT CARRIED |
| "collapse the lattice" language persists | `⚠9` / `precepts-k.md:253` | P2 | L.W4 charter decision | NOT CARRIED |
| T4 version-cadence (MAJOR vs MINOR) | L.md:120 | USER-DOMAIN | L.WZ proposes criteria | OPEN |

---

## §7 — TERMINAL READING

**The A→K structural spine (P1/P6/P7/P11/P13/P16/P17/P18/P20/P21) held without exception through
all 12 K waves and the CI-greenify session.** The violations the 36-lane audit found are EXCLUSIVELY
in the CI-greenify-era consume seam — the aria-orientation suppression, the linear() regex, the
FN_NAME stamp, the direct parse-that dep — and in the engine's unguarded replay-equality channels
(`!important`, `@property`, per-stop composition, multi-color densify). None are structural spine
failures; all are bounded, named, and cured via the acyclic-spine path or the born-RED gate path.

**The three new L invariants** (inv-L-totality, inv-L-acyclic-purity, inv-L-device-honesty) are not
expansions of the precept set — they are the EXACT SHAPE of the violations the audit found, stated
as standing law. They close the CI-greenify-era debt class permanently: no new consume-seam patch
may land without triggering L-CURE-class deletion gating; no new gate may introduce a fixed-ms sleep;
no serializer may silently approximate what the parser ingested.

**The six named L cures** (L-CURE-1 through L-CURE-6) are the enforcement artifacts of inv-L-acyclic-purity.
Each has a named sibling publish as its tripwire, a born-RED gate as its enforcement, and a deletion
PR as its terminal action. None are re-BOOKed; none are re-framed as workarounds; none are acceptable
as interim states beyond the next 2 tranches.

Doc: `/Users/mkbabb/Programming/keyframes.js/docs/tranches/L/audit/precepts-L.md`
