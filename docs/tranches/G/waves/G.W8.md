# G.W8 — Frontend-state store-idiom close (the lone non-singleton store + the dead export)

**Phase:** IMPL — spec authored in DEV, awaits authorization (the D/E/F dev/impl
boundary) · **Class:** SHIP-in-G (the demo state tier — a store-idiom consistency
fix + a dead-export deletion; no library/public-API surface; behaviour-isomorphic on
the happy path, named delta "two refs → one ref") · **Scope:** `demo/**` only —
`demo/@/components/custom/asset-manager/useAssetManager.ts` (wrap in
`createGlobalState`),
`demo/@/components/custom/animation-controls/stores/index.ts` (symmetrize
`resetAllStores`),
`demo/@/components/custom/editor-shell/useShareState.ts` (delete the dead
`stateVersion`), `demo/CLAUDE.md` (strike the `stateVersion` mention) + the gate
script (`scripts/proof-decomposition.mjs` — fold the `proof:no-dead-export` clause
into the presence-grep family; the `proof:asset-store-singleton` ref-identity test) —
ZERO library (`src/**`) or CI edit · **DAG: independent of Bands 0/1** (the re-pin
`G.W2` touches no demo store; the `createGlobalState` wrap consumes vueuse, already a
dep — `a-frontend-state §6`); runs in parallel — Band-4 sibling of `G.W7`
(encapsulation) + `G.W9` (brittleness), file-disjoint from both · **Gated on:**
keyframes' own green CI (inv-27).

**Title.** *The two animation stores wrap `useStorage` in `createGlobalState` (a
process singleton — one ref per key). `useAssetManager` does not, and is
double-instantiated (parent + child) → two reactive refs over one localStorage key,
correctness load-bearing on an undocumented vueuse same-document-sync internal.
Wrap it in `createGlobalState`, symmetrize `resetAllStores`. And delete the dead
exported `stateVersion` counter — a maintenance lie with zero consumers.*

This is the §Mandate's **"the one store outside the singleton idiom"** + a vestigial
workaround-beside-the-real-mechanism deletion (`a-frontend-state §1/§2`). It is the
single real SHIP on the frontend-state axis — the tier is ~95% ALREADY-SOTA and the
Mandate's hardest frontend rules are HONORED, not violated (`a-frontend-state §5`:
never-destructure-`defineProps` satisfied via the getter-fn idiom, typed
`InjectionKey<T>`+`Symbol` provide/inject, the disciplined `markRaw`+`shallowRef`
engine boundary, `useRefHistory` undo, the concern-split store cohort, precise
`flush:'post'` watches). The fix finishes the store cohort's own established idiom on
its one outlier. NOT a restructure.

**The Mandate spine (binding — `_SYNTHESIS-gap-scorecard §THESIS` + the G charter).**
NO quick solution / NO workaround: the fix is the SINGLETON wrap (the store cohort's
own idiom — `createGlobalState`), NOT a band-aid that documents the same-doc-sync
accident as if it were the contract. The current correctness rests on an undocumented
vueuse same-document-sync internal — exactly the "graceful-handling we did not author"
the Mandate names (`a-frontend-state §1`); the wrap makes the singleton the EXPLICIT
contract. NO legacy: the dead `stateVersion` counter is a hand-rolled reactivity-bump
beside genuine reactivity (the restore path works through the store refs directly) —
the legacy-shape the Mandate excises; it is DELETED, not tolerated. KISS · DRY: ONE
store idiom (`createGlobalState` over `useStorage`), applied to the cohort's last
outlier — not a second bespoke singleton mechanism. Measure-first does NOT bind (a
correctness/consistency fix, not a perf claim) — the gate is a falsifiable ref-identity
test + a dead-export grep, not a bench. Isomorphic: behaviour-isomorphic on the happy
path (the two refs already sync via the same-doc-sync accident); the named delta is
"two refs + two serializers → one ref + one subscription" — fewer subscriptions, no
functional pixel change (`a-frontend-state §1` isomorphism note). inv ε: every claim
below cites `file:line`, source-verified on `tranche-g-dev`, not asserted. The §3 eager
prop-read-at-setup is RECORD (correct by per-instance prop stability — do NOT getter-wrap);
the §4 `useSceneRouter` raw `localStorage` is RECORD (appropriate). Do NOT manufacture
either.

**Provenance.** `a-frontend-state §1` (`useAssetManager` is the lone stateful store
outside `createGlobalState`, double-instantiated → 2 refs over 1 key; MED SHIP),
`§2` (the dead `stateVersion` counter; LOW SHIP). Synthesised at `_SYNTHESIS-frontend
§2 TIER 3` (F-S1/F-S2) + `_SYNTHESIS-gap-scorecard §1` (frontend-state row:
"~95% ALREADY-SOTA … the lone store double-instantiated") + `§2 Band 4 G.W8`.

---

## § State, verified (not asserted)

The live facts, `grep`- and read-confirmed on `tranche-g-dev`:

1. **The two animation stores ARE `createGlobalState` singletons.** Verified live:
   - `animation-controls/stores/animationOptionsStore.ts:58` —
     `export const useAnimationGroupsOptionsStore = createGlobalState(() => { … useStorage(…) … })`.
   - `animation-controls/stores/controlOptionsStore.ts:35` —
     `export const useAnimationGroupsControlOptionsStore = createGlobalState(() => { … useStorage(…) … })`.
   Both `import { createGlobalState, useStorage } from "@vueuse/core"` (`:4`/`:2`). The
   reactive ref is a process singleton — every caller shares ONE ref.

2. **`useAssetManager` is a RAW `useStorage` — no `createGlobalState` wrap.** Verified
   live: `asset-manager/useAssetManager.ts:38` —
   `export function useAssetManager() {` then `:39-40`
   `const state = useStorage<AssetManagerState>("asset-manager-state", {…})` — a bare
   `useStorage` (only `import { useStorage } from "@vueuse/core"`, `:3`; no
   `createGlobalState`). The lone stateful store outside the cohort's singleton idiom.

3. **It is called TWICE — parent + descendant.** Verified live (grep `useAssetManager()`
   over `demo/**`, the definition excluded):
   - `playground/App.vue:70` — `} = useAssetManager();`
   - `@/components/custom/asset-manager/AssetLayerPanel.vue:133` — `} = useAssetManager();`
   `AssetLayerPanel` is a child of the `playground/App.vue` tree (App renders it). Each
   call constructs a SEPARATE deep-reactive ref + its own storage-write subscription over
   the SAME `"asset-manager-state"` key. vueuse 14.3.0's `useStorage` auto-synchronizes
   same-document instances (an internal per-key event bus), so it is functionally correct
   TODAY — but the correctness is load-bearing on an undocumented internal, and two
   deep-reactive proxies + two serializers fire on every asset mutation
   (`a-frontend-state §1`).

4. **`resetAllStores` resets only the two animation stores — the asset store is
   asymmetric.** Verified live `animation-controls/stores/index.ts:46-53`:
   `resetAllStores` calls `_resetAnimationGroupsOptionsStore()` (`:47`) +
   `_resetAnimationGroupsControlOptionsStore()` (`:48`), then loops `STORE_KEYS`
   `localStorage.removeItem(key)` (`:50-51`). The `"asset-manager-state"` key is
   removed from storage (it is in `STORE_KEYS`, `storeUtils.ts:8`) but the LIVE
   `useAssetManager` ref is NOT reset (it has no `_reset` like the other two —
   `a-frontend-state §1` inv-ε note). The singleton wrap makes a
   `_resetAssetManagerStore` symmetric and wireable.

5. **`useShareState.stateVersion` is a dead exported reactive counter.** Verified live
   (grep `stateVersion` over `demo/**` returns EXACTLY three lines, all in the producer):
   - `editor-shell/useShareState.ts:17` — `const stateVersion = ref(0);`
   - `editor-shell/useShareState.ts:78` — `stateVersion.value++;` (on a successful
     load-from-input).
   - `editor-shell/useShareState.ts:96` — returned in the public shape.
   NOTHING consumes it (no watcher, no template binding, no computed). The restore path
   it once signalled now works through the store refs directly (`restoreStateFromParam`
   `Object.assign`s into the reactive store values, `hashSharing.ts:59-67`, triggering
   reactivity without a manual bump) + the `onSceneRestore` callback
   (`useShareState.ts:81-83`) (`a-frontend-state §2`).

6. **`demo/CLAUDE.md` still documents `stateVersion` — a maintenance lie.** Verified live
   `demo/CLAUDE.md:112`: *"useShareState.ts — … no-reload state restore via `stateVersion`
   counter."* The doc claims a live mechanism that drives nothing (`a-frontend-state §2`).

7. **The dead-export gate rides an existing family; the singleton test is the bite.**
   `proof:decomposition` (`scripts/proof-decomposition.mjs`) is the demo's re-runnable
   presence-grep instrument family (`package.json:44`, in `proof:all` `:64`); the
   `proof:no-dead-export` clause folds in (a grep, or a knip pass). The
   `proof:asset-store-singleton` ref-identity check is a behavioural test (`useAssetManager()
   === useAssetManager()`) — a vitest assertion, the shape `a-frontend-state §1`
   prescribes.

The wave's job: wrap `useAssetManager` in `createGlobalState` (one-for-one with the
sibling stores), symmetrize `resetAllStores` with a `_resetAssetManagerStore`, delete
the dead `stateVersion` triple + its `CLAUDE.md` mention, and lock both with a
ref-identity test + a dead-export grep that BITE today.

---

## § Goal

**What lands:**

- **`useAssetManager` wrapped in `createGlobalState`** (or `createSharedComposable`),
  matching `animationOptionsStore`/`controlOptionsStore` one-for-one. The `useStorage`
  body, the `STORE_KEYS`/TTL discipline (`"asset-manager-state"` already in
  `storeUtils.ts:8`), and the public return-shape are UNCHANGED; only the singleton wrap
  is added. The parent (`playground/App.vue:70`) + child (`AssetLayerPanel.vue:133`)
  provably share ONE ref — the redundant subscription dies, the dependence on the
  same-doc-sync internal dies.
- **`resetAllStores` symmetrized** — add a `_resetAssetManagerStore` (the symmetric
  `_reset` the singleton wrap makes possible, mirroring
  `_resetAnimationGroupsOptionsStore`/`_resetAnimationGroupsControlOptionsStore`) and wire
  it into `resetAllStores` (`stores/index.ts:46-53`), so the live asset ref resets in
  step with the storage removal (closing the §State 4 asymmetry).
- **The dead `stateVersion` deleted** — the `ref` (`useShareState.ts:17`), the `++`
  (`:78`), and the return entry (`:96`). Strike the `demo/CLAUDE.md:112` mention.
- **`proof:asset-store-singleton`** (new test) — asserts
  `useAssetManager() === useAssetManager()` `state` ref identity (BITES today — two
  `useStorage` calls yield two distinct refs) + a behavioural assert that a mutation
  through one handle is observed by the other WITHOUT a storage round-trip (the singleton
  guarantee, NOT the same-doc-sync accident).
- **`proof:no-dead-export`** (new clause, folded into the `proof:decomposition`
  presence-grep family) — asserts `useShareState`'s public return has no unconsumed
  member (or a knip/tsprune pass over `demo/@`); BITES today on `stateVersion`.

**Why:** the asset store is the cohort's lone outlier — every other stateful store is a
`createGlobalState` singleton, and the asset store's double-instantiation leaves
correctness resting on an undocumented vueuse same-document-sync detail (the
"graceful-handling we did not author" the Mandate forbids). Wrapping it makes the
singleton the explicit contract, kills the redundant subscription, and symmetrizes the
reset. The `stateVersion` counter is a hand-rolled reactivity bump beside genuine
reactivity (a workaround beside the real mechanism) with zero consumers and a stale doc
claiming it lives — the legacy-shape, deleted.

**What does NOT land (recorded so no future lane re-raises):**
- **The eager prop-read-at-setup** (`AnimationControlsGroup.vue:154`,
  `AnimationControls.vue:155`) — RECORD (`a-frontend-state §3`): correct by per-instance
  prop stability (ACG is `:key="superKey"`-mounted; AnimationControls is `v-for`-1:1).
  A getter rewrite would be a WEAKER alternative re-resolving a store handle every tick.
  Do NOT getter-wrap.
- **`useSceneRouter` raw `localStorage`** (`useSceneRouter.ts:23,48`) — RECORD
  (`a-frontend-state §4`): a one-shot boot-redirect read + a router-coupled persist;
  `useStorage` would add a dead reactive ref no one binds. Appropriate as-is.

---

## § Scope

### S1 — wrap `useAssetManager` in `createGlobalState` + symmetrize `resetAllStores` (`a-frontend-state §1`) — SHIP-in-G (MED, the spine of this wave)

**WHAT:** two coupled moves, one gestalt.

- **Wrap.** In `asset-manager/useAssetManager.ts`, wrap the `useStorage` body in
  `createGlobalState(() => { const state = useStorage<AssetManagerState>("asset-manager-state",
  {…}); …; return {…public shape…}; })` — exactly the
  `animationOptionsStore.ts:58`/`controlOptionsStore.ts:35` form. Import
  `createGlobalState` from `@vueuse/core` (the sibling import). The public return-shape +
  the `useStorage` body are byte-stable; only the singleton wrap is added. Both callsites
  (`playground/App.vue:70`, `AssetLayerPanel.vue:133`) now resolve the SAME ref.
- **Symmetrize.** Add `_resetAssetManagerStore` (the singleton's `_reset`, mirroring the
  two animation stores) and wire it into `resetAllStores` (`stores/index.ts:46-53`) so the
  live asset ref resets alongside the storage `removeItem`.

**WHY:** §State 2/3/4 — the asset store is the lone non-singleton, double-instantiated,
correctness load-bearing on an undocumented same-doc-sync internal, and asymmetric in
`resetAllStores`. The wrap makes the singleton explicit (the cohort's own idiom),
collapses two refs/two serializers to one, and the symmetrize closes the reset gap.
Behaviour-isomorphic on the happy path (the refs already sync); named delta "two refs →
one ref."

### S2 — delete the dead `stateVersion` counter + the CLAUDE.md mention (`a-frontend-state §2`) — SHIP-in-G (LOW)

**WHAT:** delete `useShareState.ts:17` (`const stateVersion = ref(0);`), `:78`
(`stateVersion.value++;`), and the `:96` return entry. Strike the `demo/CLAUDE.md:112`
mention. Verify no cross-package consumer first (the §State 5 grep confirms none in
`demo/`).

**WHY:** §State 5/6 — a hand-rolled version counter beside genuine reactivity, with zero
consumers, while the doc claims it drives the restore path (a maintenance lie; the
restore actually works through the store refs + `onSceneRestore`). Pixel- and
behaviour-identical (it drives nothing); the deletion is its own proof — the build stays
green because nothing references it.

> **RECORDED in this band — so no future lane re-litigates:**
> - **`a-frontend-state §3`** the eager prop-read-at-setup (`ACG:154`,
>   `AnimationControls:155`) — RECORD. Correct by per-instance prop stability (keyed-mount
>   / v-for-1:1); the idiomatic hardening IF ever wanted is a `:key` assertion (ACG
>   already has one), NOT a getter wrapper (which re-resolves a store handle every reactive
>   tick for no benefit). `App.vue:218` CORRECTLY uses a `computed` because at App level
>   the super-key changes IN PLACE — the difference is principled. Do NOT getter-wrap.
> - **`a-frontend-state §4`** `useSceneRouter` raw `localStorage` — RECORD
>   (already-appropriate): a one-shot boot read (`:19-32`, inside `router.isReady().then()`)
>   + a router-coupled persist (`:46-52`); `useStorage` would add a dead reactive ref. The
>   key is NOT in `STORE_KEYS` (intentional — a navigation preference, not animation state).
>   Do NOT vueuse-ify.

---

## § Hard gate (falsifiable · re-runnable · MUST bite)

The wave closes when every clause VERIFIES (each BITES — a real re-runnable instrument,
not an assertion):

1. **`proof:asset-store-singleton` PASSES — ONE ref per key.** A test asserts
   `useAssetManager() === useAssetManager()` returns the SAME `state` ref identity, plus
   a behavioural assert that a mutation through one handle is observed by the other
   WITHOUT a storage round-trip (the singleton guarantee, not the same-doc-sync accident).
   **BITE:** reds TODAY (two `useStorage` calls yield two distinct refs); green after S1.
   Reverting the `createGlobalState` wrap → two refs → the identity assert reds.

2. **`proof:no-dead-export` PASSES — `useShareState` has no unconsumed return member.**
   The clause greps (or knip/tsprune) `useShareState`'s public return for a member with
   zero consumers across `demo/**`. **BITE:** reds TODAY on `stateVersion` (returned at
   `:96`, consumed nowhere); green after S2. Re-introducing a dead exported member reds.

3. **`resetAllStores` is symmetric — the asset ref resets with the others.** A test
   mutates the asset store, calls `resetAllStores`, and asserts the LIVE asset ref returns
   to defaults (not just the storage key removed). **BITE:** reds TODAY (the live ref is
   not reset, only the storage key — §State 4); green after S1's `_resetAssetManagerStore`
   wiring. Dropping the asset reset from `resetAllStores` reds.

4. **No regression — the close is inert on behaviour + pixels.** `npm test`,
   `proof:brittleness`, `proof:decomposition`, and the rest of `proof:all` stay green;
   the asset panel + viewport render byte-stable (the refs already synced); the demo
   builds. **BITE:** any test regression, any pixel diff attributable to the wrap/delete,
   or any `src/**` edit attributed to this wave reds (the wave is `demo/**`-only).

---

## § Folds

Retires (by finding id):
- **`a-frontend-state §1`** (`useAssetManager` the lone non-singleton store,
  double-instantiated → 2 refs over 1 key, not in `resetAllStores` symmetry) — S1 + gate
  clauses 1/3.
- **`a-frontend-state §2`** (the dead `stateVersion` counter; CLAUDE.md still documents it)
  — S2 + gate clause 2.

**RECORDED in this band (see S2 callout):**
- **`a-frontend-state §3`** (eager prop-read-at-setup) — RECORD (do not getter-wrap; the
  per-instance-stability design is correct).
- **`a-frontend-state §4`** (`useSceneRouter` raw `localStorage`) — RECORD (appropriate;
  one-shot boot read + router-coupled persist).
- **`a-frontend-state §5`** (getter-fn rule / typed provide-inject / markRaw-bridge /
  useRefHistory / store split / watch-flush / composable shapes) — ALREADY-SOTA,
  untouched. The Mandate's hardest frontend rules are HONORED, not violated.

**DOC-TRUTH RECORD (out of source write-scope, named for the owner):** `demo/CLAUDE.md`
documents removed components, a non-existent `@/composables/` dir, an `animationStores/`
dir (live: `stores/`), and the dead `stateVersion` (struck by S2). The broader
doc-housekeeping pass is shared with `G.W7`'s doc-truth note (`a-frontend-state §2` /
`a-frontend-encapsulation` doc-truth) — NOT this wave's source surface beyond the one
`stateVersion` line S2 strikes.

---

## § Design decisions (the trade-offs RESOLVED)

1. **`createGlobalState` over documenting the same-doc-sync accident — the explicit
   contract beats the lucky default.** RESOLVED: the asset store is functionally correct
   TODAY because vueuse's `useStorage` happens to auto-sync same-document instances over a
   key (an undocumented internal per-key event bus). The §Mandate forbids resting
   correctness on "graceful handling we did not author" — so the fix is NOT to document
   the accident, but to make the singleton the explicit, asserted contract via
   `createGlobalState` (the cohort's own idiom). If vueuse ever changed the same-doc-sync
   path, the documented-accident approach would silently break; the singleton wrap does
   not depend on it (`a-frontend-state §1`). The gate (clause 1) binds ref-identity, not
   sync-timing.

2. **Symmetrize `resetAllStores` — the singleton wrap makes a `_reset` possible.**
   RESOLVED: the raw `useStorage` has no `_reset` because there is no singleton handle to
   reset — `resetAllStores` could only `removeItem` the storage key (`:50-51`), leaving the
   LIVE ref stale until reload. The `createGlobalState` wrap creates the singleton handle
   the other two stores expose a `_reset` over (`_resetAnimationGroupsOptionsStore`); S1
   adds the matching `_resetAssetManagerStore` and wires it. The symmetry is a consequence
   of the wrap, not a separate concern — one gestalt (gate clause 3).

3. **Delete `stateVersion`, do NOT re-wire it.** RESOLVED: `stateVersion` once drove a
   re-render signal; the restore path now works through the store refs directly
   (`Object.assign` into reactive values, `hashSharing.ts:59-67`) + `onSceneRestore`. The
   counter is dead weight, and the doc claiming it lives is a maintenance lie. The move is
   DELETION (the legacy-shape excised), not preservation behind a flag — there is no
   consumer to preserve for (§State 5 grep: three producer lines, zero consumers). The
   deletion is its own proof (build stays green).

4. **This wave is `demo/**`-only — ZERO library surface, ZERO new dep.** RESOLVED: every
   site is a demo state-tier concern; `createGlobalState` is a vueuse primitive already in
   use by the two sibling stores (no new dependency — `a-frontend-state §6`). No `src/**`,
   no public-API, no value.js/parse-that touchpoint; the one adjacent glass-ui item (the
   keyboard registry) is ALREADY correctly glass-ui-resident (a confirmation, not a
   hand-off — `a-frontend-state §5`). The gate edits `scripts/proof-decomposition.mjs`
   (the `proof:no-dead-export` clause) + adds the `proof:asset-store-singleton` test — the
   lock, not source behaviour.
