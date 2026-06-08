# H.W1 impl — GATES lane: the @mbabb popover (`impl-w1-gates-popover.md`)

My lane = the two S8/BLK-8 popover gates: `proof:dock-popover-opens` +
`proof:single-toggle`. Both BROWSER-gated, both wired into `package.json` AND
`ci.yml`, both verified born-RED→GREEN against the live built demo. DO NOT
re-litigate the resolved S8 fix — these gates LOCK it.

---

## 1. Files landed (left in tree, NOT committed)

| File | Role |
|---|---|
| `scripts/proof-dock-popover-opens.mjs` | NEW — the D9-OPENS gate: static source-shape clause (the un-wrap) + browser `finalOpen:true` on a trusted click |
| `scripts/proof-single-toggle.mjs` | NEW — the single-toggle gate: static trigger-count clause + browser clean-toggle-latch round-trip |
| `package.json` | wired both scripts (`proof:dock-popover-opens`, `proof:single-toggle`) + added both to the `proof:all` chain |
| `.github/workflows/ci.yml` | wired both in the `demo-smoke` job (after `proof:demo-console-clean`), `KF_REQUIRE_BROWSER: "1"` |

I did NOT author the S8 fix itself — the CORE/HEART lane landed it in `App.vue`
(the `<DockDropdownTrigger>` mounts directly inside `<DropdownMenu>`, the outer
`<DropdownMenuTrigger as-child>` wrapper + its import are gone, keep-open is the
imperative `useOptionalDockContext()?.keepOpen()/release()` on `@update:open`).
My gates LOCK that fix.

---

## 2. The harness idiom (mirrors proof:demo-console-clean)

Both gates copy the `serveDist + Playwright` plumbing from
`scripts/proof-demo-console-clean.mjs` exactly: a static half that ALWAYS runs +
a browser half gated on playwright resolution and a built `dist/gh-pages/`. The
browser half serves the BUILT dist over an ephemeral http server (no Vite),
launches chromium, and drives the real DOM. `KF_REQUIRE_BROWSER=1` turns a
playwright/dist-absent SKIP into a hard FAIL (so CI cannot green-report a gate it
never exercised — same belt as occlusion-gate / computed-real-dom).

**S-Harness note applied:** the @mbabb trigger is dock CHROME (present on EVERY
route), so these gates do NOT need an in-app combobox scene-switch and do NOT
goto-clear storage mid-test — they `goto #/cube` ONCE, then drive the dock with a
real hover+click. The only live-driving subtlety is the dock's
`:start-collapsed="true"` (ChromeDock): the @mbabb trigger lives in the EXPANDED
slot, so each gate first HOVERS the dock (the dock expands on
`mouseenter`/`pointermove` — verified in the compiled `dock.js`) and polls until
the trigger is visible, THEN clicks. The click is a Playwright TRUSTED pointer
event — the exact gesture the double-wrap swallowed.

---

## 3. `proof:dock-popover-opens` — the bite

- **Static (always):** `App.vue`'s @mbabb `<DropdownMenu>` block mounts a
  `<DockDropdownTrigger>` directly, NO outer `<DropdownMenuTrigger>` wrapper, AND
  the `DropdownMenuTrigger` import is absent. (HTML comments are stripped first —
  the S8 fix is DOCUMENTED in a comment naming the dropped wrapper, so the tag
  regex must not match the prose. This was a real false-positive I hit and fixed.)
- **Browser (`finalOpen:true`):** expand the dock, assert the trigger rests CLOSED
  (`aria-expanded:false`), TRUSTED-click it, assert `aria-expanded:true` AND a
  `role="menu"` content node renders with height > 0.
- **BITE (verified born-RED):** reintroduce the outer `<DropdownMenuTrigger
  as-child>` + import, rebuild → ALL three relevant clauses RED, incl. the live
  `finalOpen:false` (`aria-expanded:false, menuVisible:false`) — the exact live
  state BLK-8 names. GREEN on the un-wrap. 3× stable green on the fixed build.

---

## 4. `proof:single-toggle` — the bite (with a MEASURED correction)

**The wave names `handlerCount:2`. I MEASURED what that is observable as, and the
naive reading does NOT bite — so the gate asserts the FUNCTIONAL consequence.**

What I measured on the double-wrap build (vs the fixed build):
- DOM nodes with `aria-label="@mbabb menu"`: **1 on BOTH builds.** reka's
  `as-child` SLOT-MERGES the outer trigger onto the inner button — there is only
  ever one DOM node.
- CDP `DOMDebugger.getEventListeners` on that node: **`{click:1, keydown:1}` on
  BOTH builds.** The stacked triggers do not produce two DOM listeners.
- So a DOM-node count OR a listener count CANNOT discriminate the defect — both
  read 1. (An earlier draft of this gate counted aria-labeled trigger nodes and
  passed VACUOUSLY green on the double-wrap. Caught + corrected.)

What the two stacked toggles ACTUALLY do is DESYNC the latch — the doubled
binding swallows the open so the trigger never latches. MEASURED click round-trip:
- fixed (one toggle): `closed → open → closed → open` (symmetric latch).
- broken (double-wrap): `closed → closed → closed → closed` (never opens).

So the gate's two clauses are:
- **Static (always, the deterministic structural bite):** exactly ONE trigger
  element in the @mbabb block — a single `<DockDropdownTrigger>`, ZERO
  `<DropdownMenuTrigger>`. This IS the canonical `handlerCount:2` source-shape
  signature (the double-wrap → count 2 → RED). Comments stripped first.
- **Browser (clean-toggle-latch):** click 3× and assert `[false,true,false,true]`
  — a symmetric open/close latch that a doubled toggle cannot produce.
- **BITE (verified born-RED):** double-wrap → static RED (count 2) + browser RED
  (`closed→closed→closed→closed`, "latch never sets"), 3× repeatable. GREEN +
  3× stable on the fixed build.

The gate's docblock RECORDS this measurement so a future lane does not "simplify"
the latch back to a vacuous node/listener count.

---

## 5. Distinctness from proof:dock-popover-opens

`dock-popover-opens` asserts the OPEN event fires on one trusted click.
`single-toggle` asserts the toggle is a clean, single, SYMMETRIC latch across
SUCCESSIVE clicks (open→close→open) — the consequence of exactly one handler in
sole control. They overlap on "the first click opens it" but `single-toggle`
additionally proves the latch round-trips (a doubled toggle that somehow opened
once would still desync the close). Plus `single-toggle`'s static clause is a
deterministic, browser-free structural lock the other gate does not carry.

---

## 6. Wiring

- `package.json`: `"proof:dock-popover-opens"` + `"proof:single-toggle"` script
  entries; both added to the `proof:all` chain (after `proof:single-writer`).
- `ci.yml` `demo-smoke` job: both run after `proof:demo-console-clean` with
  `KF_REQUIRE_BROWSER: "1"` (the job already installs `@playwright/test` +
  chromium + builds the gh-pages demo — same context the sibling browser gates
  use).
- `proof:ci-coverage` GREEN: "all 42 proof:* gates are invoked in CI" — both my
  gates are recognized as wired (CLAUSE 0 coverage).

---

## 7. Verification summary

| Build | dock-popover-opens | single-toggle |
|---|---|---|
| FIXED (S8, un-wrapped) | GREEN ×3 stable | GREEN ×3 stable |
| BROKEN (double-wrap reintroduced + rebuilt) | RED (static + `finalOpen:false`) | RED (static count 2 + latch `closed→closed→closed→closed`) ×3 |

The double-wrap reintroduction was a TEMPORARY bite-check — `App.vue` was restored
EXACTLY to the core lane's S8 state afterward (verified: the only `+DropdownMenuTrigger`
line in `git diff demo/app/App.vue` is the S8 explanatory comment; no real wrap tag,
no extra import). No bite-check residue left in tree.

NOTE for the lead: the browser halves require `npm run gh-pages` to have built the
dist first (CI builds it in the demo-smoke job before these steps). Running
`proof:all` locally WITHOUT a built dist → the browser halves SKIP gracefully (the
static halves still run + bite). This matches `proof:demo-console-clean` /
`proof:demo-usability` exactly.
