# Tranche H DEEP harden — lane `hd-live-state`

**Charge:** LIVE re-verify the D12 corruption (route storm + impossible routed state +
controls/options going invalid), capture the EXACT repro + corrupt DOM/console state, and
confirm `proof:scene-machine-irrefragable` + `proof:no-route-storm` would BITE.

**Method:** Playwright MCP against the running demo at `http://localhost:5173/` (kf 4.1.0 +
Tranche G, pre-H). All evidence below is from THIS session (port 5173); one cross-session
artifact at 5174 is flagged explicitly and not relied upon.

**VERDICT: D12 is REAL and REPRODUCED LIVE.** The autonomous route storm fires on a
clean idle from `#/easing` (3 `replaceState` entries in 3 s, resting hash moved to a
DIFFERENT scene), the `?anim=` cross-scene leak is observable (cube's `Rotations` anim
appended onto `#/amiga` and `#/`), and the deprecated-`next()` flood + the
`Parse error "......"` engine leak are both live. **Both named gates would BITE** — with
ONE substantive caveat on `proof:no-route-storm`'s damping precondition and one
correction to the audit's deep-link framing (below). The audit's source anchors all
verify against the live tree.

---

## A. LIVE EVIDENCE — what the running demo actually did

### A1. Autonomous route storm on a clean idle from `#/easing` (the keystone repro)

Loaded `#/easing`, armed an in-page `pushState/replaceState`+`popstate`+`hashchange` trap
inside a SINGLE `evaluate` Promise (no MCP re-navigation during the window), idled 3 s:

```
startHash:  #/easing
endHash:    #/cube?anim=Rotations          ← moved to a DIFFERENT scene, ZERO interaction
navEntryCount: 3   (all replaceState)
  replace #/                                (hash #/   )
  replace #/cube                            (hash #/cube)
  replace #/cube?anim=Rotations             (hash #/cube)
popstateCount: 2 · hashchangeCount: 2
distinctHashWalk: #/easing → #/cube → #/cube?anim=Rotations
```

This is the exact `popstate`/`replace` PAIR pattern the audit roots
(`a-scene-state-machine.md:54-79`): a `popstate` (browser reacting to the interleaved
history stack) + a debounced `?anim=` `replace`. It is NOT a timer — a separate 3 s idle
that happened to rest at the home key `#/` stayed put (`walkLen:1`, no nav), and a 5 s
idle resting at the self-consistent `#/cube?anim=Rotations` also stayed put. **The storm
is a reactive feedback loop re-ignited by navigation/re-render; it self-damps only at a
`(scene, ?anim=)` fixed point where the param matches the scene.** A deep-link load of a
non-home scene (e.g. `#/easing`) reliably storms because the lagging `currentSuperKey`
seeds a mismatched `?anim=`.

Corroborated repeatedly through the session: bare reads/snapshots advanced the route
`easing → cube → square → amiga → home → …` with no user action; e.g. a `browser_snapshot`
issued right after a `goto('#/easing')` already showed the Scene combobox reading "Cube"
at `#/cube?anim=Rotations`.

### A2. The `?anim=` cross-scene leak (the "impossible routed state")

Captured live at `hash = #/amiga?anim=Rotations` — `Rotations` is the **cube's** animation,
not amiga's. The wrong scene's `selectedAnimation` crossed the scene boundary into the new
route's `?anim=`, exactly `a-scene-state-machine.md:72-75`. Also observed transiently at
`#/?anim=Rotations` (home key carrying the cube's anim — `a-scene-state-machine.md:85`).

### A3. The malformed path/hash mixing

The Playwright Page footer repeatedly reported impossible URLs combining a REAL path
segment with the hash route: `http://localhost:5173/cube#/cube?anim=Rotations` and
`http://localhost:5173/cube#/easing`. This is the `cube#/easing` path/hash corruption the
dock-audit lane recorded (`a-glass-ui-consumption.md:288-299`). It is live.

### A4. The `?anim=`/superKey desync renders mismatched controls

With the controls panel expanded at `#/amiga?anim=Rotations`, the rendered control set
included the layer controls `blend · replace · z-index · enabled` (group-scene controls).
The Scene combobox said "Amiga" while the `?anim=` said `Rotations` (cube). The route, the
`?anim=` param, and the mounted scene disagreed simultaneously — the impossible routed
state the matrix is meant to forbid. (I did not catch the literal "cube's 3× controls under
the *easing* route" label-dump in this session because MCP `page.goto` resets the page
context and wipes any in-page sampler, so I cannot sample the sub-second transient ACROSS
an MCP navigation — see B3. The state-DESYNC at the seam is nonetheless directly confirmed.)

### A5. Console state — live error/warning families

- **Deprecated nav-guard flood (LIVE):** `[Vue Router warn]: The next() callback in
  navigation guards is deprecated…` fires 1–4× on EVERY navigation; the footer warning
  count climbed monotonically across the session (3 → 6 → 9 → 11 → 24 → 25 …). Source:
  `router.ts:49,53` (verified `next({...})` and bare `next()` both present).
- **Engine value-leak (LIVE):** `Error: Parse error at offset 0: "......"` fired in this
  5173 session (`console-2026-06-07T19-31-50-128Z.log:255ms`). The six-dot ellipsis from
  the start-screen `dot-fade` reaches a CSS-value lerp (`a-scene-state-machine.md:124-131`,
  §3b). CONFIRMED live.
- **`AnimationOptionError: timingFunction [function anonymous]`** (§3a) — its full text +
  stack (`serializeEasing` @ `format.ts:24`) was captured, but ONLY in the cross-session
  `all=true` dump whose stack traces are port **5174**, not this run. In THIS 5173 session
  it did NOT fire during pure route navigation. **Refinement:** §3a is gated on the dock
  **Keyframes tab** being mounted (it serializes the placeholder contract group); it is not
  a route-navigation symptom. The audit text is correct but should be explicit that §3a
  requires the Keyframes-tab surface, else a reviewer re-running "just navigate" won't see
  it. (This is a precision note for `proof:contract-serialize`, owned elsewhere — recorded
  here for fidelity, not a blocker.)

Screenshot of a corrupt resting state saved at
`/Users/mkbabb/Programming/keyframes.js/hd-live-state-storm.png`.

---

## B. DO THE TWO NAMED GATES BITE? — findings

### B1. `proof:no-route-storm` — BITES, but the "idle 2 s" precondition is under-specified → can pass VACUOUSLY at the home fixed-point

- **[HIGH · gate-precondition gap]** **Location:** H.W1 §Hard-gate `proof:no-route-storm`
  (`H.W1.md:55`); H.md:327; PROGRESS.md:110; `a-scene-state-machine.md:244-246`.
  **Defect (LIVE-evidenced):** the storm self-damps at a fixed point and does NOT fire from
  every starting state. My measurements: idle from `#/easing` → **3 nav entries, RED**
  (the gate bites). BUT idle from the home key `#/` → **0 nav entries** (quiescent), and
  idle resting at a self-consistent `#/cube?anim=Rotations` → **0 nav entries** (quiescent,
  5 s). The gate text fixes the start scene as `#/easing` — which is correct and DOES red
  today — but it does not state *why* `#/easing` specifically (a non-home scene whose mount
  seeds a `selectedAnimation` whose `?anim=` write lags the superKey). If an implementer
  "simplifies" the gate to load `#/` (home) or pre-seeds localStorage so the load rests at a
  consistent `(scene,?anim=)`, the trap sees ≤1 entry and the gate **greens vacuously while
  the storm is intact on every other scene**. The bite is real but BRITTLE to the chosen
  start state.
  **Concrete doc edit:** in `proof:no-route-storm`, after "load `#/easing`", add:
  *"(start scene MUST be a NON-home scene that owns a group + a default `selectedAnimation`
  — `#/easing`, `#/cube`, or `#/spring`; the home key `#/` self-damps and would green
  vacuously. The gate asserts the trap is armed in the SAME document context as the load —
  no re-navigation between arm and idle, since the storm fires on mount-seeded `?anim=`
  writes, not a timer.) Assert: navEntries === 0 (no autonomous `replaceState`) AND
  resting hash === the loaded scene AND popstate count === 0. RED today: 3 `replaceState`
  + 2 popstate, resting hash drifts to a different scene."*

- **[MED · trap-survival assumption]** **Location:** same gate.
  **Defect:** the gate installs a `pushState/replaceState` trap and counts entries. I
  verified this is ROBUST against the storm itself (the storm stays in-hash; my single-
  evaluate trap survived the full 3 s and captured all 3 entries). HOWEVER the storm also
  produces path-level URLs (`/cube#/cube`, A3) — if a path-form navigation ever escalates
  to a full document load, an in-page trap is wiped and the test reads a fresh (≤1-entry)
  log → false GREEN. In my session the in-page trap was only ever wiped by my OWN MCP
  `page.goto` (which resets the browsing context + clears storage), never by the storm. So
  the risk is THEORETICAL for the in-hash storm but REAL if the path-mix (A3) reloads.
  **Concrete doc edit:** add to the gate: *"the trap MUST also assert
  `performance.getEntriesByType('navigation').length === 1` (no full reload during the
  idle) so a path-level reload that wipes the in-page trap cannot green it vacuously; and
  assert `location.pathname === '/'` throughout (the `/scene#/scene` path-mix of
  `a-glass-ui-consumption.md:288-299` must never appear)."*

### B2. `proof:scene-machine-irrefragable` — BITES on the route/superKey/component/group
consistency clause; the playback-identity clause is the weak half (already flagged by
`hd-w1`/`hd-state-redteam`, CONFIRMED live)

- **[CONFIRM · consistency clause bites]** **Location:** `H.W1.md:54`. The "(a) route,
  super-key, mounted component, and group are mutually consistent (no impossible routed
  state)" clause reds TODAY — directly evidenced by A2+A4: at `#/amiga?anim=Rotations` the
  route, the `?anim=`, and the Scene combobox disagree; the storm guarantees an A→B→A
  round-trip lands in a mismatched `(route, superKey, group)` tuple. This clause has a
  genuine, live, non-vacuous bite. No edit needed.

- **[MED · playback-identity clause has no engine quantity for raw-rAF scenes — LIVE-
  confirmed the seam is absent]** **Location:** `H.W1.md:54` clause (b) "byte-identical
  playback"; `a-scene-state-machine.md:222-227`; engine `src/animation/group.ts`.
  **Defect (verified):** I grepped the installed engine — `AnimationGroup` has **NO**
  `serialize()`/`hydrate()` method (only inline comments about per-key transform
  serialization at `group.ts:250,254,364`); `dist/keyframes.d.ts` exposes none. So the
  "byte-identical playback" assertion has no engine-provided quantity to compare for the
  raw-rAF scenes (cube/amiga/square) until the born-RED `proof:group-snapshot-identity`
  HANDOFF lands. This is exactly `hd-state-redteam.md §D` / `hd-w1.md` finding-4: as
  written the clause can only meaningfully assert against the demo's snapshot store, and on
  the literal D12 repro scene (easing) only a dummy `contractAnim` is restored. The H.W1
  authoring already names the seam as born-RED, so this is NOT a blocker — but the matrix
  doc must state the WITNESS quantity it diffs (a `ScenePlayback.snapshot()` of
  `{t, reversed, iteration, paused}` per anim) or the clause passes vacuously on the
  scenes that lack the engine API.
  **Concrete doc edit:** I do NOT re-author the fix here (it duplicates `hd-state-redteam
  §C/§D` and `hd-w1` finding-4, which already specify "assert via `ScenePlayback.snapshot()`
  + require named `easing↔cube` cross-pair rows"). **This lane CONFIRMS those findings
  with live engine-API evidence** (`group.ts` has no serialize/hydrate) and endorses their
  edit verbatim. H.W1 should adopt the `hd-state-redteam §D` field-set + cross-pair edit.

---

## C. CORRECTION to the audit's framing (fidelity, MED)

- **[MED · audit over-states the deep-link override]** **Location:**
  `a-scene-state-machine.md:169-172` ("`#/easing` deep link is silently overridden to the
  localStorage scene on load") and §5; H.W1.md:57 `proof:deep-link-wins` rationale.
  **Defect:** the live source guards the localStorage redirect to the BARE `#/` case only —
  `useSceneRouter.ts:20` comment "On fresh load with bare /#/, redirect to
  localStorage-saved scene", `:23-25` reads localStorage and `router.replace` only then.
  Live: my deep-link `goto('#/easing')` resolved to `#/easing` (honored), and only the
  STORM moved it afterward — it was NOT overridden at load. So the deep-link is honored on
  load; what corrupts it is the storm, not a localStorage-wins redirect. The
  `proof:deep-link-wins` gate (`#/spring` with localStorage `cube` → resting `spring`)
  therefore may already be GREEN-on-load today and would only red because the storm then
  walks it away — i.e. it overlaps `proof:no-route-storm` rather than testing a distinct
  load-time redirect bug. **(This belongs to the deep-link lane; recorded here because my
  live navigations are the evidence.)**
  **Concrete doc edit:** soften `a-scene-state-machine.md:169-172` and the
  `proof:deep-link-wins` rationale to: *"the bare-`#/` localStorage redirect
  (`useSceneRouter.ts:20-28`) is the FALLBACK; a non-bare deep link IS honored on load.
  The deep-link defect is that the storm then walks the honored route away. Gate must
  assert the resting scene AFTER a 2 s idle (so it also catches the storm), not merely the
  load-time route — else it greens on load while the storm corrupts it."* (Also a TESTABILITY
  note for that gate: MCP `page.goto` clears localStorage in this harness, so the test must
  seed localStorage via the SAME context AFTER load, or seed it server-side — see B3.)

---

## B3. Harness testability note (for whoever writes the Playwright gates) — MED

- **[MED · MCP/Playwright `goto` resets context]** Empirically, MCP `browser_navigate`
  (`page.goto`) in this harness CLEARS both `localStorage` AND `sessionStorage` and wipes
  any in-page `setInterval`/trap (verified: markers set pre-navigate read back `null`
  post-navigate; an armed `setInterval` sampler was dead after the next `goto`). Two
  consequences the gate authors must encode: (1) the route-storm/identity gates must drive
  scene round-trips via the **in-app dock combobox click** (preserves context) OR install
  the trap AFTER the final `goto` and never re-navigate; they cannot sample across a
  `goto`. (2) `proof:deep-link-wins` must seed localStorage in the page that survives to
  the app's read — i.e. seed then `reload()` (not `goto` to a fresh context), or seed via
  the test server. **Concrete doc edit:** add a one-line "Harness note" under the H.W1
  gate block: *"these Playwright gates drive scene switches via the in-app Scene combobox
  (context-preserving); the history trap is armed after the final navigation; storage-
  dependent gates seed via reload, not cross-context goto."*

---

## D. NON-FINDINGS (authoring is sound — do NOT manufacture)

- The five-authority diagnosis (`a-scene-state-machine.md §0`) is FAITHFUL to the live tree:
  `useSceneRouter.ts:11,20-28,48,58` (localStorage authority + `router.push`),
  `useSceneUrl.ts:35-54` (debounced `?anim=` `replace`), `router.ts:49,53` (deprecated
  guard) all verified at the cited line ranges.
- The "not a timer / reactive feedback loop" characterization is CONFIRMED (idle at a
  fixed point does not advance; navigation/re-render does).
- `proof:scene-isolation`, `proof:suspend-no-orphan-raf`, `proof:no-deprecated-guard`,
  `proof:contract-serialize` are outside this lane's two-gate charge and are sound as far
  as I touched them (the deprecation flood and the `"......"` parse error are both live, so
  their bites are real).
- The `serialize()/hydrate()` seam being absent from the engine is CORRECTLY framed as a
  born-RED value.js/engine HANDOFF in H.W1 — not a blocker; it is the intended discipline.

---

## E. Summary for the spine

D12 is live and reproduced: a clean 3 s idle from `#/easing` autonomously fires 3
`replaceState` nav entries + 2 popstate and rests on a DIFFERENT scene, with the cube's
`Rotations` anim leaking onto `#/amiga` and `#/`, malformed `/scene#/scene` path/hash
mixing, a per-nav deprecated-`next()` flood, and a live `Parse error "......"` engine leak.
**`proof:no-route-storm` BITES** but its start-scene precondition is under-specified and can
green vacuously at the home/fixed-point (HIGH B1) and should assert no-full-reload +
pathname==='/' (MED B1). **`proof:scene-machine-irrefragable` BITES on the consistency
clause** (live mismatched route/superKey/group) but its byte-identical-playback clause has
no engine quantity for raw-rAF scenes until the born-RED seam lands — confirming
`hd-state-redteam §D`/`hd-w1` finding-4 with direct engine-API evidence (MED B2). One audit
correction: the deep-link is honored on LOAD (the storm, not a localStorage redirect,
corrupts it — MED C). Plus a harness note: MCP `goto` clears storage + kills in-page traps,
so the gates must drive via the in-app combobox and arm traps post-navigation (MED B3).
