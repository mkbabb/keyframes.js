# Tranche I — recap-precepts.md · THE PRECEPT AUDIT (was each H precept HONORED or VIOLATED?)

**Agent:** RECAP AGENT [recap-precepts]. **Charge:** for EACH recurring precept —
no-legacy, no-workaround, idiomatic+gestalt, isomorphic, KISS, measure-first, inv-16, and the
chronic-closure / born-RED-falsifiable-gate discipline — was it HONORED or VIOLATED across
Tranche H? **The headline:** H's gate regime gave FALSE CONFIDENCE — source-shape +
load-time gates masquerading as correctness gates — and the "born-RED → green falsifiable
gate" discipline FAILED to catch runtime breakage. This file analyzes WHY, at the precept
level, and names the precept-level fix.

**Method (inv ε — verify, do not assert).** Every verdict below cites a `file:line` in H's
own docs/gates or the live source on `tranche-i-dev` (forked off the broken master `b934a08`,
H's tip). I read the actual tranche docs — `H/H.md`, `H/FINAL.md`, `H/audit/prompt-recap.md`,
`H/audit/a-gate-blindspots.md`, `H/audit/a-precept-sweep.md`, `H/waves/H.W0.md` — and the
actual gate scripts (`scripts/proof-*.mjs`) and source seams the user's live report (B1–B9,
2026-06-08) implicates. I do NOT invent. Where H CLAIMED a precept held and the live demo
falsifies it, both the claim's anchor and the falsifying anchor are cited.

**The standing context (the catastrophe).** Tranche H shipped with ALL gates GREEN —
`tsc` 0, `proof:all` green, `proof:browser` 35/35, `proof:chronic-closure` green
(`FINAL.md:118-124`) — and FINAL.md declares H "the LAST tranche these four chronics can be
re-papered" (`FINAL.md:11,78-79`). Yet the live demo is DEEPLY BROKEN (B1–B9). The
gate-blindspot the entire tranche was BUILT to close (`H.md:106` "the gate-blindspot lesson",
`a-gate-blindspots`) RE-OPENED on H's own watch — and H's gates certified the broken product
green. This is the precept failure this tranche exists to diagnose.

---

## §0 — THE SCOREBOARD (the at-a-glance ledger)

| Precept | A→G posture (per H) | H verdict | The decisive anchor |
|---|---|---|---|
| **no-legacy** | HONORED (`a-precept-sweep` P-01) | **HONORED** (mechanically) | replaced surfaces deleted-in-one-motion: `.glass-card` plate (W2), `isStableFire` codec + `Map` store (W1), PNG raster registry (W5) — `prompt-recap.md:233`; `scenePlaybackAdapters.ts:94` "usePlaybackSnapshot.ts is DELETED in the same motion" |
| **no-workaround** | DRIFTED-1 then "repaired" by W1 FSM | **VIOLATED** | the W0 `serializeEasing`/`"......"` fixes were SYMPTOM neutralizers at the WRONG seam — readout `try/catch` floor + a narrowed-regex gate, NOT a total fix; B1 "......" is BACK via the un-guarded `CSSKeyframesToString→processFrame` interaction path (`proof-demo-console-clean.mjs:6-9,117`) |
| **idiomatic + gestalt** | DRIFTED-2 then "repaired" | **VIOLATED** | the FSM `suspend()` adapter throws `this._gen is undefined` LIVE (B2) — the "one formal FSM" keystone (`H.md:120`) has an un-initialized generator on the suspend codepath (`scenePlaybackAdapters.ts:67`); a gestalt FSM cannot throw on its own primary transition |
| **isomorphic styling** | HONORED (`a-precept-sweep` P-02) | **PARTIAL / moot** | the 7 named deltas held as authored, but B3 (/amiga floats), B6 (/square drag selects text), B7 (specular sheen still reads as a defect) show the rendered RESULT was never isomorphic to intent — appearance was never measured (ROOT-A, below) |
| **KISS** | HONORED (1 watch) | **VIOLATED** | 88 `proof:*` scripts (`ls scripts/proof-*.mjs`), 13 waves, 5 feedback rounds, a 1074-line FSM gate (`proof-scene-machine-irrefragable.mjs`) — and the product is more broken than at 4.1.0. Complexity grew; correctness fell. The simplest possible gate (a human opening the demo) would have caught B1–B9 |
| **measure-first** | HONORED (`a-precept-sweep` P-03) | **VIOLATED at the meta-level** | every PERF claim was benched, but the CORRECTNESS claims ("crashes dead", "suspend/restore an identity", "the LAST re-paper") were asserted against gates that never measured the live interaction — the gates measured the wrong thing with rigor |
| **inv-16** (consume published siblings) | HONORED | **HONORED** (but masking) | kf consumed glass-ui `~3.5.1` not forked (`FINAL.md:72,168`) — but inv-16 was USED to defer B7/B8 (specular, dock perf) to HANDOFFs with born-RED gates that never bit the live defect (`FINAL.md:93`); the discipline held formally while the user still sees the defect |
| **chronic-closure / born-RED falsifiable gate** | THE H HEADLINE — the meta-gate that ends re-papers | **CATASTROPHICALLY VIOLATED** | `proof:chronic-closure` is "the SAME static resolve-or-red mechanism as `proof:idioms` clause-1" (`proof-chronic-closure.mjs:41-44`) — it parses a MARKDOWN TABLE and asserts gate NAMES resolve to `package.json` keys. It proves the PAPERWORK is well-formed, never that the PRODUCT works. The headline durability mechanism is itself a source-shape gate. |

**Net.** Of the precepts, no-legacy and inv-16 held MECHANICALLY (replacements were clean,
siblings were consumed not forked). EVERY precept that bears on RUNTIME CORRECTNESS —
no-workaround, idiomatic+gestalt, KISS, measure-first, and above all the
chronic-closure/born-RED-gate discipline — was VIOLATED, because the entire gate regime
locks SOURCE-SHAPE and LOAD-TIME and calls it correctness. H repaired the gate-blindspot in
NAME (it added a `proof:visual-lock` baseline and 35 "interaction-axis" browser gates) while
re-committing it in SUBSTANCE (those gates rest passively on load; none clicks the rainbow
group-play, none drives the suspend codepath, none drags /square).

---

## §1 — THE ROOT FAILURE: the born-RED falsifiable-gate discipline was applied to the WRONG ORACLE

The "born-RED → green falsifiable gate" discipline is sound IN PRINCIPLE: a gate must FAIL on
the pre-fix tree and PASS on the post-fix tree, so green proves the fix landed. H applied it
with apparent rigor — every wave's gate is documented born-RED-then-green
(`prompt-recap.md:240` "every gate is a falsifiable instrument"). **The discipline did not
fail because gates were missing. It failed because the gates measured a PROXY ORACLE
(source shape, load-time console, a localStorage snapshot, a markdown table) instead of the
PRODUCT ORACLE (does the thing work when a human uses it).** A gate that is born-RED and
goes green against the wrong oracle gives MORE false confidence than no gate at all — it
launders a proxy assertion into a correctness claim.

Three concrete proofs that the oracle was wrong, each tied to a live breakage:

### 1.1 — B1 ("......" crash on rainbow group-play) — the LOAD-REST oracle vs the INTERACTION oracle

H.W0's whole charge was "the demo must not throw" (`H.W0.md:1`). The crash is BACK (B1). WHY
the gate stayed green:

- `proof:demo-console-clean` (the H-A1 gate) does its browser half by `page.goto` to
  `/#/amiga` and `/#/easing`, then `waitForTimeout(2500)` and asserts zero console errors —
  **but only those matching `HA1_SIGNATURE = /no CSS animation-timing-function representation/`**
  (`proof-demo-console-clean.mjs:117,170-194`). It NEVER clicks the rainbow group-play button.
  B1's `"......"` fires through `KeyframesStringControls.vue:47/149 → CSSKeyframesToString →
  processFrame → value.js parseState(empty)` on the GROUP-PLAY interaction path
  (user stack, 2026-06-08) — a path no load-rest probe visits.
- The gate's own docstring CONFESSES the gap: "The gate is precise: it bites on the EXACT H-A1
  signature, NOT a blanket '0 console errors' (the H-A2 route-storm noise is H.W1's domain —
  `proof:no-route-storm` greens the broad home→scene console once the FSM lands)"
  (`proof-demo-console-clean.mjs:5-8`).
- **`proof:no-route-storm` DOES NOT EXIST.** It is referenced as the owner-of-the-broad-console
  in SIX gate docstrings (`grep -rln no-route-storm scripts/` → `proof-demo-console-clean`,
  `proof-scene-machine-irrefragable`, `proof-timeline-rail-width`, `proof-demo-shell-grid`,
  `proof-single-column-pack`, `proof-stage-not-clipped`) yet it is **not in `package.json`**
  (`grep no-route-storm package.json` → nothing) and **has no script file**
  (`scripts/proof-no-route-storm.mjs` MISSING). The broad-console oracle was deferred to a gate
  that was never authored. FINAL.md lists `proof:no-route-storm` as a W1 biting gate
  (`FINAL.md:34`) — a gate that does not exist counted toward the green tally.

**The precept failure named:** no-workaround. The W0 fix neutralized the SYMPTOM at the
readout (`try/catch` floor) and narrowed the gate's regex so the broad failure mode was
out of scope — the textbook "neutralize a symptom at the wrong seam / offer a weaker escape
hatch beside the real fix" the spine forbids (`H.md:59-61`). The REAL fix — the engine
classifying a bare non-numeric text leaf as a discrete hold-snap, which W0 itself named as
the gestalt answer (`H.W0.md:30,49`) — was punted to a value.js-HANDOFF and a kf belt that
the live path bypasses.

### 1.2 — B2 (DFA suspend/resume throws `this._gen is undefined`) — the STORAGE-SNAPSHOT oracle vs the LIVE-ADAPTER oracle

H.W1's keystone claim: the FSM makes "suspend→restore a byte-identical identity"
(`FINAL.md:34`), gated by `proof:scene-machine-irrefragable` (1074 lines). The live demo
throws `TypeError: undefined is not an object (evaluating 'this._gen')` at
`scenePlaybackAdapters.ts:36 → captureActive (useSceneMachine.ts:104) → switchScene` (B2,
user stack). WHY the gate stayed green:

- The gate's identity ORACLE is **localStorage**: it reads `keyframes-js-scene-machine` (the
  serialized playback snapshot) and `animation-groups-control-options-store` and asserts the
  snapshot round-trips byte-identically (`proof-scene-machine-irrefragable.mjs:86-90`). It
  drives switches via `location.hash` assignment (`:76-84`).
- This validates the PURE REDUCER's serialization — a JSON round-trip in storage — NOT the
  live `adapter.suspend()` codepath that throws. `captureActive` calls `adapter.suspend()`
  (`useSceneMachine.ts:146`), and the rAF adapter's suspend touches a `_gen` generator
  (`useRafLoop.ts:9` "its `_gen` restart-safety") that is `undefined` when the scene is mid-
  switch. The gate never exercises a real adapter holding a real (or un-initialized) `_gen`.
- The user's spec — "first scene SUSPEND+SAVE, next RESUMES iff it was playing" — is exactly
  what the gate's C1/C6 clauses CLAIM to assert (`proof-scene-machine-irrefragable.mjs:13-24,
  53-59`). They assert it against the storage snapshot, which round-trips fine. The live
  adapter, which the gate stubs out, is where the `_gen` lives.

**The precept failure named:** idiomatic+gestalt. The "one formal FSM" was supposed to be the
gestalt kill of the `isStableFire` heuristic (`a-precept-sweep` F-01). But the FSM's effects
layer (the adapter contract) carries an un-initialized `_gen` on the suspend transition — the
machine throws on its own primary edge. A gestalt state machine whose effect handler is not
total is not gestalt; it relocated the brittleness from a `watch` heuristic to a generator
lifecycle, and the gate's storage-oracle could not see the relocation.

### 1.3 — B4/B5 (easing lost its bezier editor; "no CSS twin" placeholder) — the gate CODIFIED the over-removal as correct

B4: the J1–J6 easing-minimalism (`prompt-recap.md:176-189`) over-removed the easing-curve /
timing editor; the user wants it BACK. B5: the CSS keyframes editor shows
`/* timing-function: custom — no CSS twin (see console) */`. WHY no gate bit:

- `proof:scene-control-dfa` IS a real runtime gate — it drives `location.hash` switches and
  asserts WHICH control labels render per scene (`proof-scene-control-dfa.mjs:213,236-244`).
  But it asserts "easing shows ONLY the easing set" (`proof-scene-machine-irrefragable.mjs:43`
  C4 SCENE-ISOLATION: "after NAVIGATE(easing) the rendered control labels are exactly the
  easing set ({duration})"). The DFA was TUNED to hide everything but duration — so when J1–J6
  stripped the bezier editor, the gate GREEN-LIT the strip as the intended DFA outcome. **The
  gate codified the over-removal as the contract.** A gate that asserts "exactly {duration}"
  cannot tell you the user wanted the bezier curve editor too.
- B5's placeholder is the W0 `try/catch` floor RENDERING (`proof-demo-console-clean.mjs:91`
  asserts the catch assigns a "custom" placeholder). The gate asserts the placeholder EXISTS;
  the user reads the placeholder as a BROKEN editor. The gate's success criterion ("renders a
  custom placeholder, never a silent linear") is satisfied by the exact string the user reports
  as the defect.

**The precept failure named:** measure-first + isomorphic. The minimalism was a design CHANGE
that the visual baseline (`proof:visual-lock`) should have caught as an appearance delta — but
the baseline was captured AFTER the strip (`FINAL.md:28-29` "each landed BEFORE H.W8's golden
baseline... fixed them"), so the baseline LOCKED the over-removed state as golden. The oracle
was a screenshot of the already-wrong product.

---

## §2 — THE PRECEPT-BY-PRECEPT LEDGER (honored or violated, with the WHY)

### no-legacy — HONORED (mechanically), but masked the real cost

The replacements were clean and one-motion: the `.glass-card` plate died with `surface=
"cartoon"` (W2), the `isStableFire` codec + bare `Map` store died with the FSM (W1,
`a-precept-sweep` F-01/F-02), `usePlaybackSnapshot.ts` deleted in the same motion as its
adapter (`scenePlaybackAdapters.ts:94`). Grep for `legacy|deprecat|compat` over `src/` returns
only JSDoc naming the mandate (`a-precept-sweep:50`). **HONORED.** The caveat: no-legacy is a
SOURCE-HYGIENE precept and the gates that police it (grep-based) are exactly the kind that
gave false confidence elsewhere — no-legacy held precisely because it is the one precept whose
oracle (source text) IS the right oracle for it.

### no-workaround — VIOLATED

The spine forbids "neutralize a symptom at the wrong seam, mask an occlusion, or offer a weaker
escape hatch beside the real fix" (`H.md:59-61`). The W0 crash fixes did all three:
- B1: a readout `try/catch` floor (`proof-demo-console-clean.mjs:88-101`) is a weaker escape
  hatch BESIDE the real fix (the discrete-leaf engine classification, named in `H.W0.md:30,49`
  as the gestalt answer but punted to a HANDOFF). The escape hatch renders the very placeholder
  the user reports as B5.
- B7/B8 (specular sheen, dock perf): masked as glass-ui HANDOFFs with born-RED gates
  (`FINAL.md:93`, `proof:specular-handoff`) that resolve at an UNPUBLISHED glass-ui 3.8.0 —
  the user still sees the defect (B7 "the SPECULAR issue is STILL present"). A HANDOFF whose
  paired gate cannot go green until a sibling ships an unpublished version is a forever-punt
  dressed as a disciplined deferral.

### idiomatic + gestalt — VIOLATED

The FSM keystone (`H.md:120` "CRITICAL and central") throws on its own suspend transition (B2,
§1.2). B3 (/amiga "floats around"), B6 (/square drag "does not feel right and does not
persist"), B8 (dock animations "supremely broken") all indicate that the architectural
transpositions were authored to a SOURCE shape, never reconciled against the running gestalt.
The precept-sweep itself flagged the FSM seam as the one drift and W1 as its repair
(`a-precept-sweep` F-01) — the repair re-introduced a different un-idiomatic shape (the `_gen`
lifecycle) that the storage-oracle gate could not see.

### isomorphic styling — PARTIAL / moot

The 7 named deltas were honored AS AUTHORED (`a-precept-sweep` P-02, `design-idioms.css`
annotations). But isomorphism is a claim about RENDERED PIXELS matching INTENT, and the demo
was never measured against intent — only against a baseline captured from itself
(`proof:visual-lock`, §1.3). B6's text-selection-on-drag (no `user-select:none`) is a styling
defect with zero gate coverage. B9's `ENOENT easing-icon-sm.svg` (dev-vs-build icon-resolution
discrepancy) is an isomorphism break between the two build paths that no gate compares.

### KISS — VIOLATED

88 `proof:*` scripts, 13 waves, 5 feedback rounds, a 1074-line FSM gate — and the product
regressed below its 4.1.0 starting point. The complexity was spent on the PROXY (an elaborate
lattice of source-shape and storage-snapshot assertions) while the PRODUCT correctness fell.
KISS is violated not by any single module but by the gate REGIME: the simplest possible
correctness oracle (a human, or a playwright probe, opening the demo and clicking the buttons)
would have caught B1–B9, and the tranche built 88 gates that did not.

### measure-first — VIOLATED at the meta-level

Every PERF claim was benched (`a-precept-sweep` P-03, the rail/ball unification; the
`bench:scene-transition` budget, `H.md:205`). But measure-first means measuring the CLAIM you
are making — and H's load-bearing claims were CORRECTNESS claims ("crashes dead", "suspend is
an identity", "the LAST re-paper"). Those were asserted against gates that measured a proxy.
Measuring perf with rigor while asserting correctness against the wrong oracle is measure-first
inverted: rigor pointed at the wrong quantity.

### inv-16 — HONORED, but used as a deferral laundromat

kf consumed glass-ui `~3.5.1` published, never forked (`FINAL.md:72,168`). Formally clean. But
inv-16 was the vehicle for deferring B7 (specular) and B8 (dock) to HANDOFFs that resolve at
unpublished sibling versions — the discipline held while the user still sees the defects. The
user's B7 question ("are we using the latest glass-ui?") is precisely a challenge to whether
the inv-16 consume-leg was actually the right pin, or whether the HANDOFF papered over a
defect the user does not accept.

### chronic-closure / born-RED falsifiable gate — CATASTROPHICALLY VIOLATED (the headline)

This is the keystone failure. H's central thesis was that the four chronics "exited" the A→G
ledger by RE-CLASSIFICATION (M1/M2/M3 — issue-close, scope-narrow, column-migrate;
`H.md:105`, `FINAL.md:51-57`), and that the FIX was a meta-gate making a bare tag non-terminal
— so H would be "the LAST re-paper" (`FINAL.md:78-79`).

**The meta-gate is itself a re-classification.** `proof:chronic-closure` "parses the COMMITTED
chronic table at `docs/tranches/H/PROGRESS.md §'Open deferrals'`" and for each row asserts
"every LOAD-BEARING `proof:*` gate name RESOLVES to an authored script key in package.json...
AND is a member of `proof:all`" (`proof-chronic-closure.mjs:23-31`). Its own docstring: "This
is the SAME static resolve-or-red mechanism as `proof:idioms` clause-1 + the
`proof:brittleness` LISTENER_ALLOWLIST stale-guard — a static parse of a committed table, not
a new runtime probe" (`proof-chronic-closure.mjs:41-44`).

The meta-gate proves: the markdown ledger is internally consistent — every gate NAME it cites
exists in package.json. It does NOT prove any of those gates measures a real product property.
It is **a source-shape gate auditing the well-formedness of other gates' paperwork.** The
"born-RED → green falsifiable" discipline was applied to a markdown table: born-RED if a row
cites a dangling gate name, green when the name resolves. The oracle is the ledger's own
prose. A green `proof:chronic-closure` certifies that the bureaucracy is tidy — and that is
exactly what it certified, while B1–B9 ran live.

This is the deepest expression of the gate-blindspot: H built a meta-gate to police the
chronics and made the meta-gate a SOURCE-SHAPE gate — re-committing the original sin
(`a-gate-blindspots` ROOT-A "every gate is either a STATIC GREP or a NARROW RUNTIME
ASSERTION") at the meta-level, while declaring the sin closed.

---

## §3 — WHY THE born-RED DISCIPLINE FAILED TO CATCH RUNTIME BREAKAGE (the mechanism)

The born-RED falsifiable-gate discipline has a HIDDEN PREMISE: that the gate's oracle is the
product property the human cares about. When that premise holds, born-RED→green is sound. H
broke the premise in four distinct ways, each of which produces a green gate over a broken
product:

1. **LOAD-REST instead of INTERACTION.** `proof:demo-console-clean` rests on a route and waits
   (`proof-demo-console-clean.mjs:183-185`). B1 fires on a button click. Born-RED→green against
   "console clean on load" says nothing about "console clean when the user plays."

2. **PROXY STORE instead of LIVE OBJECT.** `proof:scene-machine-irrefragable` round-trips a
   localStorage JSON snapshot (`:86-90`). B2 throws in the live adapter's `_gen` lifecycle.
   Born-RED→green against "the snapshot serializes" says nothing about "the adapter suspends."

3. **SELF-REFERENTIAL BASELINE.** `proof:visual-lock` diffs against a baseline captured from
   the same (already-wrong) build (`FINAL.md:28-29`). Born-RED→green against "matches the
   golden" locks the defect as golden when the golden was captured post-defect.

4. **PAPERWORK instead of PRODUCT.** `proof:chronic-closure` parses a markdown table
   (`proof-chronic-closure.mjs:41-44`). Born-RED→green against "every cited gate name resolves"
   certifies the ledger is consistent, not that the product works.

The common thread: **a born-RED gate is only as honest as its oracle.** H's oracles were
proxies one or more steps removed from the running product, and the discipline laundered each
proxy assertion into a correctness claim. The MORE rigorous the born-RED ceremony around a
proxy oracle, the MORE false confidence it generates — which is why H, the tranche with the
most gates and the most explicit gate discipline, shipped the most broken product.

This is the user's standing warning made mechanical: "green source-shape gates miss
appearance/interaction/state; audit the RUNNING demo" (MEMORY feedback,
`feedback_gate_blindspot_appearance_axis.md`). H read the warning, named it the headline
(`H.md:106`), and built gates that re-committed it.

---

## §4 — THE PRECEPT-LEVEL FIX (what Tranche I must bind)

The fix is NOT "more gates." It is a single precept correction, with three structural
consequences:

**THE PRECEPT (new, I-born — propose binding into the I charter):**
*A gate's ORACLE must be the PRODUCT PROPERTY a human would check, exercised through the SAME
surface the human uses. A gate whose oracle is source text, a serialized snapshot, a
self-captured baseline, or a paperwork ledger is a HYGIENE gate, not a CORRECTNESS gate, and
MUST be labeled as such — it may never count toward a correctness or chronic-closure tally.*

Consequences for I's wave gates (the precept made falsifiable):

1. **Every runtime gate must DRIVE THE INTERACTION, not rest on load.** A console-clean gate
   must CLICK the rainbow group-play, the play/pause, switch scenes, and drag — then assert
   zero errors. The bite: B1 reds the gate at HEAD; greens only when the
   `CSSKeyframesToString→processFrame` path is total (the discrete-leaf engine fix, finally
   landed not deferred). Model on `scripts/proof-no-orphan-specular.mjs`'s serveDist +
   playwright pattern (the investigation harness), extended to ACTUATE.

2. **Every state gate must exercise the LIVE OBJECT, not the snapshot.** The FSM suspend gate
   must mount a real scene, PLAY it, switch away, and assert no throw AND the leaving scene
   suspended AND the incoming resumes-iff-was-playing — against the live adapter and its
   `_gen`, not localStorage. The bite: B2 reds at HEAD.

3. **The visual baseline must be captured from a KNOWN-GOOD reference, not from self.** A
   self-captured baseline locks defects as golden. The baseline must be a human-approved
   reference render (or a prior-good tranche's render), and appearance gates diff against THAT.

4. **The chronic-closure meta-gate must verify the cited gates are RUNTIME gates that BIT.**
   `proof:chronic-closure` must not merely resolve gate NAMES — it must assert each cited gate
   is a runtime/interaction gate AND that it was witnessed born-RED on a defect tree. A chronic
   row whose closure cites only source-shape/load-rest gates REDS. This makes the meta-gate
   police the PRODUCT, finally, not the column's paperwork.

The headline for I (per the user mandate): **the gate-regime OVERHAUL is the deliverable** —
close the blindspot for good by binding the oracle precept, so that "green" means "a human
using the product would see it work," and the born-RED ceremony attaches to product behavior,
not proxies.

---

## §5 — CHRONIC + DEFERRED PRECEPT DEBT TO FOLD INTO I

Items where a precept was VIOLATED and the violation is now a chronic the user re-observed:

| Item | Precept violated | H's false-close | Live evidence | I disposition |
|---|---|---|---|---|
| B1 "......" crash | no-workaround | W0 readout floor + narrowed-regex gate; `proof:no-route-storm` never authored | crash live on group-play | RE-OPEN — land the discrete-leaf engine fix; interaction-driven console gate |
| B2 suspend/resume throw | idiomatic+gestalt | `proof:scene-machine-irrefragable` round-trips storage, stubs the adapter | `_gen is undefined` live | RE-OPEN — live-adapter suspend gate |
| B4 lost easing editor | measure-first + isomorphic | DFA gate codified the J1–J6 over-removal as the contract | bezier editor gone | RE-OPEN — restore; baseline from known-good |
| B5 "no CSS twin" placeholder | no-workaround | the `try/catch` floor renders the defect string; gate asserts it EXISTS | placeholder shown as broken editor | RE-OPEN — the floor is not the fix |
| B7 specular sheen | inv-16 (as deferral) | HANDOFF to unpublished glass-ui 3.8.0 | sheen still reads as defect | RE-EXAMINE the pin; measure perf; confirm user acceptance |
| B8 dock animations broken | KISS / inv-16 | `proof:dock-morph-settled` reads a token ramp, not the live animation | "supremely broken, slow, errored" | RE-OPEN — drive the dock, measure INP live |
| B9 ENOENT icon + sourcemaps | isomorphic (dev vs build) | no gate compares the two build paths | dev ENOENT `easing-icon-sm.svg` | FOLD — dev/build parity gate |
| chronic-closure meta-gate | the born-RED discipline itself | a markdown-table source-shape gate declared the durability keystone | B1–B9 live, green | OVERHAUL — the §4 oracle precept |

**The terminal reading.** H did not fail for lack of discipline — it failed by pointing a
rigorous discipline at the wrong oracle, and the chronic-closure meta-gate enshrined that
mis-aim as the durability mechanism. Tranche I's precept correction is singular: bind the
gate ORACLE to the running product, exercised through the human's surface, so the born-RED
ceremony finally attaches to correctness. Every other I wave gate inherits this precept; the
gate-regime overhaul is the headline, and it is the ONLY way the gate-blindspot closes for
good.
