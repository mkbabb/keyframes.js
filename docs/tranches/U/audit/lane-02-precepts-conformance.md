# Lane 02 — Precepts Conformance (Tranche U audit)

**Charter.** Sweep `src/ demo/ scripts/ test/ bench/` for standing-precept
violations: NO quick solutions, NO workarounds, NO legacy code, NO deferrals,
idiomatic gestalt, performance above all. Every marker
(`TODO`/`FIXME`/`HACK`/`XXX`, "workaround", "for now", "temporary",
"back-compat", "legacy", "deprecated", compat shims, re-export barrels kept for
compatibility, commented-out code, dead branches) triaged: genuine violation vs
labeled KEEP. Evidence is `file:line` read from the live tree at `master`
(5.2.0), never board-trusted.

**Method.** Marker greps across all five roots, then per-hit source reads to
separate live violations from historical-narrative comments. Cross-checked the
owner's edict (`docs/tranches/U/ORIGINAL-PROMPT.md`): CI trim, NO MORE
DEFERRALS (every deferred + chronically-deferred item folds INTO U), NO legacy,
performance-above-all, DEVELOPMENT ONLY. value.js's tranche is external — kf may
charter only its consume edge.

---

## Global hygiene baseline (clean — stated for the record)

- **`TODO`/`FIXME`/`HACK`/`XXX`**: ZERO in `src/`, `demo/`, `bench/`, `test/`.
  The only hits are in `scripts/proof-*.mjs` and they are *literal grep patterns
  the gates search for* (e.g. `proof-no-dead-dependency.mjs`), not markers on kf
  code. No genuine marker debt.
- **`@ts-ignore`/`@ts-nocheck`/`eslint-disable`**: ZERO across `src/` + `demo/`.
- **Commented-out code blocks**: NONE. Every `// const…`/`// import…` grep hit
  is prose that happens to contain a keyword ("…the runtime constructor (the
  `instanceof` guard)…"), not disabled code.
- **`parse-that`**: correctly severed. `package.json` declares only
  `@mkbabb/value.js ^3.1.0` (dep) + `@mkbabb/glass-ui ~4.0.0` (optional). Source
  reaches the CSS-subvalue combinator through value.js's own `parseCSSSubValue`
  (`compile/parse-flatten.ts:125-128`); the acyclic spine holds by construction
  (`proof-deps-current.mjs` clause 3, `!kfRange` branch). **VERIFIED per the
  standing fact** — parse-that is driven, no direct dep, one realm.

The tree is genuinely marker-clean. The violations below are all *structural*
(dual paths, external-blocked band-aids, stale scaffolds), not marker litter —
which is the harder class the owner's "NO legacy / NO deferrals" edict targets.

---

## Findings (severity-ordered)

### F1 — [MAJOR] The glass-ui band-aid ledger is a live external-blocked deferral cluster

**Evidence.** `demo/glass-ui-gaps.ts:1-210` is a formal registry of load-bearing
hand-rolls "that exist ONLY because a glass-ui ask has not published" (ll. 3-5).
Five entries carry LIVE `workaroundSites`:

- `segmentedTabsAriaOrientation` (BG-1/BG-3) → `KfPillTabs.vue`,
  `useKfPillTabs.ts` (`:65-68`)
- `dockStrandKeepalive` (GU-4) → `TransportDock.vue`, `usePlayActuation.ts`
  (`:78-81`)
- `dockDropdownPointerdown` (BG-4) → `MbabbMenu.vue` (`:91`)
- `dockDismissHold` (GU-3) → `ChromeDock.vue` (`:101`)
- `drawerDetentInset` (BG-11) → `ControlsPaneWrapper.vue` (`:139-141`)

Each band-aid site self-describes as a band-aid held until the publish (e.g.
`TransportDock.vue:244`, `MbabbMenu.vue:118`, `ChromeDock.vue:29`,
`glass-ui-gaps.ts:23` "the kf side is the band-aid held until the publish"). The
BG-11 Drawer entry is an ADOPT-posture band-aid: the demo consumes glass-ui
4.0.1's `<Drawer mode="live-behind">` but the sheet rides OVER the bottom
menubar because "no bottom-inset lever exists to wire" (`:104-143`) — a
structural gap FORWARDED to the glass-ui tranche.

**Why it's a precept issue.** The owner's edict is "NO MORE DEFERRALS — every
deferred and chronically-deferred item folds INTO U." This ledger is precisely a
chronic-deferral apparatus: three of its own entries "each independently
re-declared 'P-invariant-28 forbids the Nth carry' and survived anyway"
(`:5-8`). The tripwire mechanism (`proof:glass-ui-gap-tripwire`,
`proof:workaround-deletion`, `scripts/lib/glass-caps.mjs`) is a whole
meta-apparatus built to *tolerate* the carry rather than close it. It is the one
legitimate external-blocked class (like value.js's tranche) — but under U it
must become a chartered coordination item with a publish+re-pin fold, not a
standing carry with its own gate roster.

**PROPOSAL (gestalt).** Charter the glass-ui BG/BH coordination letter
(`docs/tranches/T/KF-TO-GLASSUI-BG.md`) as an IN-TRANCHE U item with a single
resolution motion: (1) drive glass-ui to publish the five caps (aria guard,
material↔role decouple, dock-layer keepalive, DockDropdownTrigger pointerdown
parity, `--drawer-inset-block-end` reserve token); (2) re-pin the consumed dist;
(3) delete all five band-aid sites AND retire the tripwire meta-apparatus
(`glass-ui-gaps.ts`, `proof:glass-ui-gap-tripwire`, `proof:workaround-deletion`,
`glass-caps.mjs`) in ONE motion — the ledger's own reason to exist dies with the
carries. This is an architectural transposition: the "hold + tripwire" pattern
is replaced by "publish + re-pin + excise," which is what NO-DEFERRALS demands.
For BG-11 specifically, adjudicate whether the bespoke sheet's deletion was
premature (the ADOPTED Drawer is now a *worse* band-aid — it occludes the
menubar where the hand-roll did not).

---

### F2 — [MAJOR] SceneExposedApi carries a legacy dual-path the facility migration never collapsed

**Evidence.** `demo/app/scene/sceneExposedApi.ts:18-44` declares the new
`facility?: SceneFacility` (T.B1) AND, beside it, "The legacy
`animationGroup?`/`scenePlayback?` fields below remain" (`:24-31`). The shell
binding still consumes the legacy fields as a fallback chain, not the facility:

- `useSceneMachineShellBinding.ts:163-164` — `sceneRef.value?.animationGroup ??
  sceneRef.value?.scenePlayback ?? …`
- `:220` — `() => sceneRef.value?.animationGroup ?? sceneRef.value?.scenePlayback`
- `:266` — `const ownsPlayback = !!sceneRef.value?.scenePlayback`

ALL SIX scenes expose BOTH surfaces: `grep -l facility` and `grep -l
animationGroup|scenePlayback` over `demo/scenes/*/[A-Z]*Scene.vue` each return
the full set {amiga, cube, easing, sequence, spring, square}. So the migration
to `facility.playback`/`facility.channels` shipped the new surface WITHOUT
retiring the old one — every scene pays for both, and the shell reconcile reads
the legacy pair.

**Why it's a precept issue.** This is textbook "legacy beside the replacement"
— the exact anti-pattern the demo's own comments elsewhere boast of avoiding
("no legacy beside the replacement" appears ~10× across the scenes). The T.B1
facility fold left the old duck-typed handles in place as a fallback rather than
subsuming them.

**PROPOSAL (gestalt).** Fold the group/playback handle INTO `SceneFacility`
(the descriptor already carries `playback` + `channels`): expose the raw
`AnimationGroup` panel handle as `facility.group` (or on the facility's channel
descriptor) so the "group-scene panel handle + ready-guard identity" the comment
cites is served from ONE surface. Delete `animationGroup?`/`scenePlayback?` from
`SceneExposedApi`, rewrite the three `useSceneMachineShellBinding` reads to
`facility.*`, and drop the dual expose from all six scenes. One surface, no
fallback chain.

---

### F3 — [MAJOR] `proof-deps-current.mjs` FLOORS are stale legacy pins referencing dead versions

**Evidence.** `scripts/proof-deps-current.mjs:72-73`:

```
"@mkbabb/value.js": "0.13.0",
"@mkbabb/parse-that": "0.9.0",
```

`package.json` declares `@mkbabb/value.js ^3.1.0` and NO `parse-that` at all.
The value.js floor is pinned to a **pre-1.0** version (0.13.0) three majors
behind the shipped `^3.1.0`; the parse-that floor guards a dependency kf removed
at S9/Q (the file's own clause-3 `!kfRange` branch, `:249-258`, documents that
kf declares no parse-that). The entire FLOORS comment block (`:61-96`) is a
stratigraphy of dead tranche references — "BP-5: 0.11.2", "K.W1: ADVANCED to
0.12.0", "J.W7b: ADVANCED to 3.11.2", "K.W1: ADVANCED to 3.13.0" — none of which
reflect the 3.x value.js / 4.x glass-ui reality. The glass-ui floor (`:97`,
`4.0.0`) is the only current line.

**Why it's a precept issue.** The floor check passes VACUOUSLY (`^3.1.0` min
3.1.0 ≥ 0.13.0), so the gate is green while asserting nothing — a tautological
gate, which is exactly the CI-trim target the owner flagged ("most of it's
likely tautological"). The parse-that FLOORS entry is dead config for a severed
dep. This is legacy code (config) that NO-legacy forbids.

**PROPOSAL (gestalt).** Re-base FLOORS to the live constellation: value.js floor
→ the current `3.x` protection floor with a comment stating the ONE regression it
guards (not the K/J archaeology), glass-ui floor → the `4.x` line. DELETE the
`@mkbabb/parse-that` FLOORS entry entirely (clause 3 already handles absence
structurally — the floor is redundant). Collapse the `:61-96` comment
stratigraphy to the single live rationale. This lane's finding pairs with the
CI-trim band: a floor gate that only passes vacuously should either bite or be
retired.

---

### F4 — [MAJOR] A stale VJ-L2 pending-deferral scaffold contradicts its own already-retired source

**Evidence.** `test/compile/roundtrip-easing.test.ts:46-210` carries a
`vjL2LinearLanded` runtime probe (`:46-55`), an `it.skipIf(!vjL2LinearLanded)`
arm (`:170`), and a permanently-running witness "DOCUMENTS the PENDING reason
when VJ-L2 has not landed" (`:194-`) that asserts "the engine STILL needs the kf
normalize regex; the deletion (S7) is held until VJ-L2 ships." The describe block
is titled `"PENDING until value.js VJ-L2"` (`:163`).

But the SOURCE already retired the workaround: `easing-registry.ts:106-108` —
"The former flat-comma normalize fold (a value.js 0.12.0 serialize/parse
asymmetry workaround) is RETIRED with the consume of the root fix
(proof:workaround-deletion S7)" — because value.js is now `≥1.0.0` (`:104-105`),
in fact `^3.1.0`. There is NO kf normalize regex left in source. The test's
"STILL needs the regex / deletion held" framing describes a state that no longer
exists.

**Why it's a precept issue.** This is a chronic-deferral scaffold whose deferral
already resolved — the definition of NO-MORE-DEFERRALS residue. The test suite
still documents an external hold (value.js VJ-L2) that the source treats as
consumed. One of the two is stale legacy; either way the pending machinery
(`vjL2LinearLanded` probe + skipIf + PENDING witness) is dead weight that lies
about the current dependency state.

**PROPOSAL (gestalt).** Reconcile the two: since `easing-registry.ts` declares
VJ-L2 CONSUMED at value.js ≥1.0.0 and kf ships `^3.1.0`, delete the
`vjL2LinearLanded` probe and the `skipIf` guard, make the round-trip arm
UNCONDITIONAL (it now runs against the real 3.x parser), and remove the "PENDING
reason" witness. If the flat-comma probe genuinely still throws under 3.x (a
value.js *serializer* fix rather than parser leniency), then re-express the test
as an unconditional assertion of the canonical space-joined form the serializer
now emits — never a `skipIf` on a resolved dependency. No pending scaffold
survives a landed consume edge.

---

### F5 — [MINOR] The constants "back-compat barrel" label frames a load-bearing runtime barrel as legacy

**Evidence.** `src/animation/constants/index.ts:1-3` — "The back-compat barrel
over the type/runtime split. It preserves the EXACT import surface of the former
monolithic `constants.ts`." Echoed at `constants/types.ts:8` and
`constants/defaults.ts:9`. Charter explicitly flags this (S.B1). Importer census
on the live tree: **52** modules import the `../constants` barrel, **14** target
`constants/types`, **0** target `constants/defaults` directly.

**Why it's a precept issue.** The barrel is NOT back-compat — it is the primary
HEAVY runtime import surface (52 of 66 importers), the natural directory barrel
(`constants/` → `index.ts`). The "back-compat" framing is a self-inflicted
legacy label on live, load-bearing infrastructure; it invites a future reviewer
to "delete the compat shim" and break 52 importers. The S.B1 split (LIGHT →
types, HEAVY → barrel) is sound; only the *naming* is legacy-coded.

**PROPOSAL (gestalt).** Re-label to what it is: "the HEAVY constants barrel (the
value.js-bearing runtime surface; LIGHT importers target `./types`)." No code
change — a documentation transposition that stops calling a live barrel a compat
artifact. Confirms the split is architecture, not legacy.

---

## Labeled KEEPs verified as genuine (NOT violations)

- **`internal/leaves.ts:21-65` rAF shim** — "the rAF shim STAYS local … it is an
  environment shim, not pure math." Legitimate: the math leaves were correctly
  DELETED (Q.WE2 no-legacy DRY win, re-exported from `@mkbabb/value.js/math`);
  only the environment shim (`requestAnimationFrame` + `setTimeout` fallback)
  remains, which is a platform capability seam, not a compat kludge.
- **`svg/morph-svg.ts:24,221` "engine-compatibility floor"** — a documented
  design floor (uniform sampling between 0%/100% frames), a quality description,
  not a workaround.
- **`scenes/cube/orbital-drag/composables/inertiaDecay.ts`** — the "legacy
  per-frame friction knob" is HISTORY; the live `inertiaFactorToFriction`
  mapping is a measure-first, frame-rate-invariant analytic parity lock over the
  engine's `decay()`. Genuinely idiomatic (the discrete form was replaced, the
  mapping is the parity certificate).
- **`test/**` `describe.skipIf(!chromium)` guards** — legitimate browser-oracle
  environment gating (view-transition, entry, trigger, split-a11y oracles), not
  deferral skips.
- **`demo/@/state/storeUtils.ts:47-73` `gcAndMigrateStoreBuckets`** — a
  persisted-state (localStorage) migration for returning users' PascalCase
  buckets → registry SceneIds. A *data* migration for user-owned persisted
  state, not source legacy; deleting it corrupts returning-user state. KEEP, but
  U should set a sunset (the migration can retire once the 7-day TTL guarantees
  no pre-T.B9 bucket survives — see charter ask).

---

## What U must charter

1. **CHARTER the glass-ui BG/BH coordination as an IN-TRANCHE fold** (not a
   carry): drive the five caps to publish, re-pin, and DELETE all five band-aid
   sites + retire the entire tripwire meta-apparatus (`glass-ui-gaps.ts`,
   `proof:glass-ui-gap-tripwire`, `proof:workaround-deletion`,
   `scripts/lib/glass-caps.mjs`) in one motion. [F1]
2. **CHARTER the SceneFacility subsumption**: fold the group/playback handle
   into `SceneFacility`, delete `animationGroup?`/`scenePlayback?` from
   `SceneExposedApi`, rewrite the three shell-binding reads, drop the dual expose
   from all six scenes. [F2]
3. **CHARTER re-basing `proof-deps-current.mjs` FLOORS** to the live 3.x
   value.js / 4.x glass-ui reality, DELETE the dead `@mkbabb/parse-that` floor
   entry, and collapse the dead-tranche comment stratigraphy — pair with the
   CI-trim band (a vacuously-passing floor gate). [F3]
4. **CHARTER reconciling the VJ-L2 pending scaffold**: delete the
   `vjL2LinearLanded` probe + `skipIf` + PENDING witness in
   `roundtrip-easing.test.ts`, make the arm unconditional against the shipped 3.x
   parser (the source already declares VJ-L2 consumed). [F4]
5. **CHARTER re-labeling the constants barrel** from "back-compat barrel" to "the
   HEAVY constants runtime barrel" — documentation-only; stops flagging a
   load-bearing 52-importer barrel as legacy. [F5]
6. **CHARTER a sunset for `gcAndMigrateStoreBuckets`**: the pre-T.B9 bucket
   migration can retire once the 7-day store TTL guarantees no legacy-cased
   bucket survives — set the retirement condition so the migration is not carried
   indefinitely. [KEEP]
