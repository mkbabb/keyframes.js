# H.W1 impl — STATIC-GATES lane note (`impl-w1-static-gates.md`)

The two pure-grep gates of the keystone's §Hard gate. Both authored against the
existing harness idioms, wired into `package.json` + `.github/workflows/ci.yml`,
born-GREEN on the landed CORE+HEART tree, and BITE-VERIFIED (each reds on the
exact regression the spec names). Left in tree, NOT committed.

---

## 1. Files landed (left in tree)

| File | Role |
|---|---|
| `scripts/proof-no-deprecated-guard.mjs` | NEW — H.W1 S5: `next(` absent (as a CALL) from `router.ts` |
| `scripts/proof-single-writer.mjs` | NEW — H.W1 S9.c / WV-W1-MED-4: no file outside the FSM core assigns `machine.activeScene` / `machine.status` |
| `package.json` | WIRED — two `proof:*` scripts + both appended to the `proof:all` chain (beside `proof:decomposition`) |
| `.github/workflows/ci.yml` | WIRED — both run in the `demo` job beside `proof:decomposition` (static greps; no browser, no `KF_REQUIRE_BROWSER`) |

`proof:ci-coverage` (clause 0) now reports **all 40 `proof:*` gates invoked in CI**
— it greps `npm run <gate>` in `ci.yml`, so the two new gates would have RED that
gate had I not wired them; they pass it.

---

## 2. `proof:no-deprecated-guard` (H.W1 S5)

**Asserts:** `router.ts` calls `next(` **0** times.

**The comment-aware subtlety (the load-bearing design).** vue-router 5 deprecated
the `next(value)` callback signature; the pre-W1 guard used it (14× `next() is
deprecated` live, CP-LOW-3). S5 drops the callback to a returned value. BUT the
landed `router.ts` legitimately NAMES the retired `next(value)` / `next() is
deprecated` pattern in its docstring (so a future reader knows WHY the guard
returns its value). A naive `/next\(/` grep would red on that PROSE — a false
positive. The gate therefore comment-BLANKS the file (block + line comments →
spaces, newlines preserved) BEFORE matching the `next(` CALL token, and the
matcher `(^|[^.\w$])next\s*\(` rejects a member call `x.next(`. Only a real bare
`next(` CALL reds. (Same discipline as `proof:demo-console-clean`'s
silentLinear-vs-comment guard and `proof:decomposition`'s comment-blanker.)

**BITE-VERIFIED:**
- Inject `next();` into the `beforeEach` body → RED, reports `line 58`, exit 1.
- Restore → GREEN, exit 0 (the `next(value)` / `next() is deprecated` PROSE in the
  docstring does NOT red — comment-blanking holds).
- Pre-W1 tree: the old `beforeEach((to, from, next) => { … next({name}) … })` calls
  the callback → reds. (Reds-today / greens-on-S5 confirmed by construction.)

---

## 3. `proof:single-writer` (H.W1 S9.c / WV-W1-MED-4)

**Asserts:** no file in `demo/**` OUTSIDE the FSM core assigns `.activeScene` /
`.status` (the two axes the machine OWNS) — direct (`m.activeScene = …`), through
the ref (`m.activeScene.value = …`), or via a destructured-ref escape
(`const { activeScene } = machine; activeScene.value = …`).

**The mutation boundary it belts.** `createGlobalState` gives NO mutation boundary
by itself. The keystone closes it by EXPORTING ONLY `dispatch()` + READONLY refs
(`status`/`activeScene`/`perScene`), so a consumer-side write is a TYPE error. This
gate is the SOURCE-SHAPE belt under that type guarantee: the only mutation surface
is the reducer-driven `dispatch()`.

**The naming reconcile (RESOLVED — read this).** The prompt + core-api §3 name the
allowed writer `sceneMachine.ts`; H.W1.md §Hard gate line 69 names it
`useSceneMachine.ts`. Both are correct after the keystone SPLIT the pure core from
the store along the `proof:decomposition` ceiling (core-api §1):
- `sceneMachine.ts` = the PURE `transition` reducer (returns NEW state, never
  mutates in place);
- `useSceneMachine.ts` = the `createGlobalState` store that runs the reducer and
  writes the single `machine.value` ref.

So the gate's `ALLOWED_WRITERS` set is **BOTH** files — they ARE the machine. Note
the store writes `machine.value = next` / `persisted.value = {…}` (the FUNCTIONAL
whole-state SWAP); it never assigns `.activeScene`/`.status` IN PLACE either, so it
would pass the gate even un-allowlisted. The allowlist is the explicit boundary
statement, not a carve-out for an in-place mutation. (Live state: the demo tree has
ZERO `.activeScene =`/`.status =` assignments anywhere — every consumer reference is
a READ: `machine.status.value === "playing"`, `computed(() => machine.activeScene.
value)`. The gate sweeps 159 demo source files clean.)

**False-positive discrimination (unit-verified):** the `=(?![=>])` matcher rejects
`===`, `==`, `=>`, and (via the captured preceding char) `<=`/`>=`/`!==`. Confirmed
against 8 cases: 4 reads/comparisons PASS, 4 assignment forms (incl.
`machine.context.activeScene = 1` through a member chain) RED.

**BITE-VERIFIED (three escape forms, each reds with a precise file:line):**
- `machine.activeScene.value = "cube"` in App.vue → RED `App.vue:192`, exit 1.
- `const { activeScene } = machine; activeScene.value = "cube"` → RED (destructured
  escape) `App.vue:192`, exit 1.
- `machine.status = "playing"` → RED `App.vue:191`, exit 1.
- Restore → GREEN, exit 0.

---

## 4. Wiring details (for the lead's review)

- **package.json:** `proof:no-deprecated-guard` + `proof:single-writer` declared as
  `node scripts/proof-*.mjs`; both appended to the `proof:all` chain immediately
  after `proof:decomposition` (the static-grep cluster).
- **ci.yml:** both added to the `demo` job right after the `proof:decomposition`
  step (the no-browser static-grep band; D.W1/W2/W3 neighbors). No
  `KF_REQUIRE_BROWSER` env (pure greps — no dist, no Playwright).
- **YAML/JSON validity** re-checked after edit; `ci.yml` step names + `run:` lines
  paired; `package.json` parses.

**NOTE for the lead:** `ci.yml` was being edited concurrently by another lane
during this work (the edit re-based cleanly on a 4-line shift). The two gate steps
sit in the static-grep band; if the lead reorders the demo job, keep them
no-browser (they need neither the gh-pages build nor Playwright).

---

## 5. §spine bar — both clauses BITE

| Gate | RED today (pre-W1) | GREEN on the keystone | BITE re-verified |
|---|---|---|---|
| `proof:no-deprecated-guard` | the `next(value)` callback guard (14× live) | guard returns its value (S5) | inject `next(` → RED line 58 |
| `proof:single-writer` | the five-authority lattice writes the active-scene fact | only `dispatch()`; refs readonly (S9.c) | inject `.value =` / destructure / `.status =` → RED |

Neither passes vacuously: `no-deprecated-guard` matches the CALL token (not prose);
`single-writer` enumerates the direct + through-ref + destructured-escape forms and
discriminates assignment from comparison/arrow.
