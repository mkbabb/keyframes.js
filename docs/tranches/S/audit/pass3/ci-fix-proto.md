# ci-fix-proto — the p12 cause-fixes PROVEN as wave-ready diff shapes

**Probe:** ci-fix-proto (Pass-3) · **Worktree:** `.claude/worktrees/wf_10251b10-89c-2` (isolated; branch `master` HEAD `18e8617`, the p12 tree) · **Date:** 2026-07-03
**Charter:** implement the p12-identified CI cause-fixes as prototypes; per red — reproduce the pre-fix RED signature, land the cause-fix, prove the post-fix exit. **Nothing lands** (no git add/commit; node_modules is a symlink, git-ignored). Gates run with the ci.yml demo-gate envs: `KF_REQUIRE_BROWSER=1 KF_PLAYWRIGHT_DIR=/Users/mkbabb/Programming/glass-ui` (playwright-core resolves from glass-ui — the repo carries none).

**Build precondition (both artefacts present simultaneously — p12 §2):** `npm run build:lib` (EXIT 0) → `npm run gh-pages` (EXIT 0). Order matters: build:lib empties `dist/gh-pages/`; gh-pages leaves `dist/keyframes.js`. Running lib THEN gh-pages leaves both (DM-11b/13 need both).

---

## Scoreboard

| # | Red (gate) | p12 class | Cause fixed? | Pre exit | Post exit | Files |
|---|---|---|---|---|---|---|
| a | `engine-no-throw-on-play` (DM-13) | shared importmap | **YES — proven GREEN** | 1 | **0** | `scripts/proof-engine-no-throw-on-play.mjs` |
| a | `subject-animates` (DM-11b) | shared importmap | **root discharged** (3 synthetic arms GREEN; residual is a distinct cold-path red) | 1 | 1* | `scripts/proof-subject-animates.mjs` |
| c | `styling-idioms` | genuine source | **YES — proven GREEN** | 1 | **0** | `demo/scenes/morph/MorphTarget.vue` |
| d | `pin-ledger-current` | genuine source (stale witness) | **YES — proven GREEN** | 1 | **0** | `docs/tranches/Q/PIN-LEDGER.json` |
| e | `demo-usability` (X-6 route clause) | gate-staleness | **YES — proven GREEN** | 1 | **0** | `scripts/proof-demo-usability.mjs` |
| b | `fsm-suspend-resume-live` (DM-14) | genuine demo defect | **cause PRECISELY LOCATED — out of prototype scope** (needs iterative rebuild+browser verify; touches shared cube/amiga path) | 1 | 1 (unchanged) | — (wave cure below) |
| — | `subject-animates [real-cube]` cold-path | genuine demo (cold-entry family) | **cause located — out of scope** | — | — | — (wave cure) |

`*` DM-11b's gate still exits 1, but the **importmap root** (the DM-13-shared cause, p12's entire disposition for this row) is discharged: all three synthetic arms flip RED→GREEN. The surviving red is the `[real-cube]` cold-path — a **separate** born-RED, not the importmap.

**Five modified files, all intended; nothing staged; node_modules symlink git-ignored (verified `git check-ignore node_modules`).**

---

## a — the shared value.js-subpath importmap harness bug (DM-13 + DM-11b root)

### Cause (confirmed at the byte level)
The built lib externalizes `@mkbabb/value.js`; since value.js O did the **subpath split**, the lazy engine chunk imports **both** `@mkbabb/value.js` AND `@mkbabb/value.js/math`:
```
$ grep -rohE '"@mkbabb/value\.js[^"]*"' dist/*.js | sort -u
"@mkbabb/value.js"
"@mkbabb/value.js/math"          # dist/sequence-*.js — @mkbabb/value.js/math → dist/subpaths/math.js
```
Both lib-probe gates ship an importmap mapping **only the bare** `@mkbabb/value.js` → a single served file `dist/value.js`. Two independent breakages result:
1. `@mkbabb/value.js/math` has **no importmap entry** → hard in-browser `TypeError: Failed to resolve module specifier "@mkbabb/value.js/math"`.
2. Even the bare file 404s on its **own relative chunk imports** — value.js 1.2.0's `dist/value.js` now imports `./units-CK5Yapzl.js`, `./math-UeasWV-i.js`, … and parse-that 0.13.0's `dist/parse.js` imports `./core.js`, `./packrat-entry-*.js` — none of which the single-file map serves.

DM-13's `[J.W1 b]` reds outright with the specifier error. **DM-11b SWALLOWS it as a 30 s timeout** (the r8-F1 trap): the throw kills the probe module before `window.__kfReady = true` runs, so `waitForFunction(() => window.__kfReady === true)` times out — the "render-race on the slow runner" that is actually a deterministic module-load throw on fast macOS.

### The diff (identical shape in both scripts — p12's "ONE change ×2")
Replace the single-file `VENDOR` map + serve-one-file handler with a **whole-dist-subtree** server behind a prefix, and teach the importmap the subpath prefix (with an extensionless-`.js` fallback, since importmap prefix substitution yields `.../subpaths/math` with no extension):

```js
// scripts/proof-engine-no-throw-on-play.mjs  (and identically proof-subject-animates.mjs)
const VENDOR_ROOTS = {
    "/__kf-vendor__/value.js/": path.join(REPO, "node_modules/@mkbabb/value.js/dist"),
    "/__kf-vendor__/parse-that/": path.join(REPO, "node_modules/@mkbabb/parse-that/dist"),
};
function serveVendor(urlPath, res) {
    for (const [prefix, root] of Object.entries(VENDOR_ROOTS)) {
        if (!urlPath.startsWith(prefix)) continue;
        let fp = path.join(root, urlPath.slice(prefix.length));
        if (!fp.startsWith(root)) { res.writeHead(403).end(); return true; }
        // `@mkbabb/value.js/math` → importmap → `.../subpaths/math` (no ext) → serve `subpaths/math.js`
        if (!fs.existsSync(fp) && fs.existsSync(fp + ".js")) fp += ".js";
        if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) { res.writeHead(404).end(); return true; }
        res.writeHead(200, { "content-type": "text/javascript" });
        fs.createReadStream(fp).pipe(res);
        return true;
    }
    return false;
}
// importmap (both probe HTMLs):
// {"imports":{
//   "@mkbabb/value.js":"/__kf-vendor__/value.js/value.js",
//   "@mkbabb/value.js/":"/__kf-vendor__/value.js/subpaths/",
//   "@mkbabb/parse-that":"/__kf-vendor__/parse-that/parse.js",
//   "@mkbabb/parse-that/":"/__kf-vendor__/parse-that/"}}
```
The old `if (VENDOR[urlPath]) {…}` block becomes `if (serveVendor(urlPath, res)) { return; }`. Resolution walked end-to-end: bare → `dist/value.js`; `./units-*.js` (relative to it) → `dist/units-*.js`; `@mkbabb/value.js/math` → `dist/subpaths/math.js`; that file's `../math-*.js` → `dist/math-*.js`. All present.

### Pre/post exit
```
DM-13 engine-no-throw-on-play   BEFORE exit 1  (✗ [J.W1 b] TypeError: Failed to resolve module specifier "@mkbabb/value.js/math")
DM-13 engine-no-throw-on-play   AFTER  exit 0  (✓ [J.W1 b] "abc"/"5px"/"150%" → typed AnimationOptionError; ✓ conforming control compiles; PASS)
DM-11b subject-animates         BEFORE exit 1  (waitForFunction __kfReady Timeout 30000ms — swallowed module-load throw)
DM-11b subject-animates         AFTER  exit 1  (✓ [raf] 36 distinct · ✓ [waapi] 37 · ✓ [group] 38 — importmap root GONE;
                                               ✗ [real-cube] cold-path residual — see below)
```
DM-13 is the clean full GREEN. DM-11b's importmap disposition is discharged (the three synthetic arms that timed out now all pass); its gate stays red only on the orthogonal `[real-cube]` cold-path defect.

### S.A wave upgrade note
- **S.A0(4) confirmed and refined.** The prescription "`@mkbabb/value.js/`: `.../dist/subpaths/` + serve the whole dist subtree" is correct **but incomplete as written**: parse-that 0.13.0 is *also* multi-chunk, so the fix must serve **both** deps' full dist subtrees (not value.js alone), and needs the **extensionless-subpath `.js` fallback** (importmap prefix substitution drops the extension). Fold this into the S.A0(4) wave text.
- **S.A1 / row 12 & row 10:** DM-13 and DM-11b **do** collapse to this one harness fix — but only for DM-11b's importmap *half*. DM-11b is **not** fully greened by it: re-disposition row 10 as "importmap harness fix (shared with row 12) **+ a residual cold-path born-RED** owned by the cold-entry/S.G wave." The SPEC-v1 "fix or calibrate the subject-write path" was closer to right than p12 implied — there *is* a real subject-write red under the importmap, just gated behind it.

---

## c — the morph-ghost styling-idioms red (genuine source, R.W5 fallout)

### Cause
`demo/scenes/morph/MorphTarget.vue:71` applies `class="morph-ghost morph-ghost--from"`; the scoped `<style>` defines `.morph-ghost` (:246) and `.morph-ghost--to` (:256) but **no** `.morph-ghost--from` — an orphaned idiom-shaped class the OWNED-IDIOMS membership gate reds on.

### The diff
```css
/* demo/scenes/morph/MorphTarget.vue — add beside .morph-ghost--to */
.morph-ghost--from {
    /* The origin ghost — the shape the morph departs FROM. A longer dash reads
       as the "before" extreme against the denser `--to` target. */
    stroke-dasharray: 6 4;
    opacity: 0.55;
}
```
(Owns the modifier in-place with a meaningful distinction — the `from` endpoint reads as a longer dash vs the `--to` endpoint's denser `2 6`. Not a no-op stub.)

### Pre/post exit
```
proof:styling-idioms  BEFORE exit 1  (✗ morph-ghost--from (×1, first: demo/scenes/morph/MorphTarget.vue))
proof:styling-idioms  AFTER  exit 0  (PASS: every referenced idiom-shaped class resolves to an owned definition)
```

### S.A wave upgrade note
S.A0(1) confirmed verbatim — one CSS rule, static gate (no browser), device-independent. Ready to land as-is in the keystone's first motion.

---

## d — the stale pin-ledger witness (genuine source; frozen at 4.4.0/1.1.0/0.12.0)

### Cause
`docs/tranches/Q/PIN-LEDGER.json` `shipped` set was frozen at the Q 4.4.0 constellation (value.js 1.1.0, parse-that 0.12.0). The R/S tree installs 5.1.0 / value.js **1.2.0** (declared `^1.2.0`) / parse-that **0.13.0** — the `proof:pin-ledger-current` HARD clause reds on every drifted row (self-version, value.js installed+lockfile+declared, parse-that installed+lockfile).

### The diff (JSON re-authored to the shipped reality)
- `shipped.self.version`: `4.4.0` → **5.1.0**
- `@mkbabb/value.js`: declared `^1.1.0`→`^1.2.0`, installed `1.1.0`→`1.2.0` (edge `direct`, unchanged)
- `@mkbabb/parse-that`: installed `0.12.0`→`0.13.0` (edge `transitive` — value.js 1.2.0 declares `@mkbabb/parse-that ^0.13.0`; kf declares no direct spec, S9 dep-removal holds)
- `@mkbabb/glass-ui`: `~4.0.0` / installed `4.0.1` — **unchanged** (already green)
- `tranche`/`owningWave`/`recordedAt` → S / S.A0 / 2026-07-03
- `target[]` collapsed to the **one un-fired** consume-edge (glass-ui 5.0.0 / S.E6); the value.js `^1.2.0` + parse-that `^0.13.0` targets **FIRED** (Q.WG4) and are folded into `shipped`. `(c.3)/target-frontier` still asserts only non-empty → GREEN.

### Pre/post exit
```
proof:pin-ledger-current  BEFORE exit 1  (5× DRIFT: value.js installed/lockfile/declared 1.1.0≠1.2.0; parse-that installed/lockfile 0.12.0≠0.13.0)
proof:pin-ledger-current  AFTER  exit 0  (all pins == shipped set; 1 target row; GREEN)
```

### S.A wave upgrade note
S.A0(2) confirmed — the SPEC names `docs/tranches/Q/PIN-LEDGER.json` as the artefact (correct), and this ledger is the `owningWave`-stamped witness a31 flagged CRITICAL. Pure-filesystem, device-independent. Land as-is. (The ledger keeps its `docs/tranches/Q/` path; only its contents advance — the gate reads the fixed path.)

---

## e — demo-usability route-reachability (gate-staleness false-positive)

### Cause
`router.ts:23-31` GENERATES routes: `allScenes.map((s) => ({ path, name: s.id, component: Stub }))` (R.W5 C.5). The gate (`scripts/proof-demo-usability.mjs:75`) scanned router.ts with `/\bname:\s*"([^"]+)"/g` — **string literals only**. `name: s.id` is a computed expression, so `routeNames` came back **empty** → all 9 scene ids declared UNROUTED. A green demo red on the gate's own obsolescence.

### The diff
```js
// scripts/proof-demo-usability.mjs — after the literal-name scan
const routesAreGenerated =
    /\ballScenes\s*\.\s*map\b/.test(routerSrc) &&
    /\bname:\s*[A-Za-z_$][\w$]*\.id\b/.test(routerSrc);
if (routesAreGenerated) for (const id of sceneIds) routeNames.add(id);
```
Sound because `allScenes = [homeScene, ...scenes]` (scenes.ts:233) is the exact descriptor set `sceneIds` is parsed from — the generated `name: s.id` routes **every** scene id by construction. Hand-declared `name:"<literal>"` routes are still honoured (the literal scan runs first); the catch-all still carries `redirect:` with no `name:`.

### Pre/post exit
```
proof:demo-usability (static X-6 clause)  BEFORE  ✗ every scenes.ts id UNROUTED: cube, amiga, square, easing, spring, sequence, motion-path, morph, home
proof:demo-usability (no-browser)         AFTER   exit 0  (✓ route-reachability: all 9 scene id(s) resolve a declared non-redirecting route)
```
(Verified the **static** X-6 clause flips GREEN. The gate's browser half — X-5 hero-gap / X-3 duplicate-aria — is a separate axis, not touched by this fix and not the p12-cited red.)

### S.A wave upgrade note
S.A0(5) / S.A2's **fourth "stale-gate" bucket** confirmed and executed. This is the ~5-15 LOC re-point p12 predicted. The pattern — a static gate whose parser drifted from a refactor it should tolerate — is the class S.A2 must add a disposition bucket for; this is a worked exemplar.

---

## b — DM-14 fsm-suspend-resume-live (GENUINE defect; cause located, out of prototype scope)

### The red, reproduced deterministically on macOS
```
✗ clause (c) RED (resume-iff-was-playing): springPlaying(entry)=true,
  springPausedAfterClick=false, springResumedPaused=false, springLiveAfterReturn=false.
```
Byte-identical to p12/CI. The load-bearing sub-signal is `springPausedAfterClick=false`: after the harness clicks the visible "Pause animation" button on the spring scene, the machine's persisted `perScene[spring].playing` stays **true**.

### Cause — PRECISELY located via a live probe (not a guess)
A bounded live playwright probe on the built `dist/gh-pages/` spring scene:
```
BEFORE   {activeScene:"spring", playing:true}
VISIBLE  aria buttons include exactly one "Pause animation" (+ "Pause animation (collapsed dock)")
CLICKED  "Pause animation"   (a real, visible, hit button — NOT an aria/selector miss)
AFTER    playing = true      ← the click did NOT flip the machine intent
```
So it is **not** a selector/aria drift (p12's DM-14 "the scene does not pause" is confirmed as a genuine dispatch defect). The chain, traced through source:

1. Spring is a **raw-rAF scene** (no real AnimationGroup). Its bottom-bar transport binds to a **contract group** (`useContractAnimGroup.ts`): one opacity-only placeholder anim, **synthetically pre-started** (`animationGroup.started = true; animationGroup.paused = !isPlaying` via a one-way watch) — it "drives no motion and is NOT a playback authority."
2. The dock's "Pause animation" click → `useAnimationGroupPlayback.toggleAnimationGroup` → the group is non-empty (1 anim) and `started===true`, so it takes the else-branch: **`animationGroup.toggle(); syncPlayState();`**.
3. `syncPlayState()` (no arg) reads `animationGroup.playing()` and emits `playStateChange` with **that** value. But `toggle()`/`playing()` on a group that was `started=true` **without ever running its rAF loop** does not return the paused state a real toggle would — it emits `playing=true`, so `App.onPlayStateChange(true)` dispatches **PLAY**, not PAUSE (`useSceneMachineApp.ts:207`). The scene machine never leaves `playing`.

**One-line root:** the contract-group transport derives the emitted `playing` from `animationGroup.toggle()/playing()` on a **synthetically-started, never-run** group, decoupling the dock toggle from the scene machine's intent for every raw-rAF scene (spring/easing/sequence/motion-path).

### Why it is out of prototype scope (honest)
`useAnimationGroupPlayback.toggleAnimationGroup` is **shared with the real-group scenes (cube/amiga)**, whose `toggle()`/`playing()` semantics are correct. Any fix must green DM-14 **without** regressing the cube/amiga transport — which requires an iterative rebuild-gh-pages + full-browser-gate verify loop per candidate (the SPEC's own ½-1 day sizing), and a decision on the library-level question of what `AnimationGroup.toggle()/playing()` should return on a synthetically-started group. Shipping an unverified source patch here would be exactly the "no threshold games / fix the cause" violation the charter forbids. I decline to guess.

### Wave-shaped cure (S.A0(6) / DM-14 — hand it to the impl drive with this seam pinned)
For a scene that owns a `scenePlayback` adapter (the raw-rAF family), the dock transport must derive intent from the **scene machine status**, not the contract group. Concretely, one of:
- **(preferred, surgical)** In `useAnimationGroupPlayback.toggleAnimationGroup`, when the bound group is a non-authoritative contract host (flag it at construction, or detect `scenePlayback` ownership), emit `syncPlayState(!isPlaying.value)` instead of `animationGroup.toggle(); syncPlayState()` — so the dock toggle emits the true inverse and `onPlayStateChange` dispatches PAUSE. Guard the real cube/amiga path unchanged.
- **(alternative)** Fix `AnimationGroup.toggle()/playing()` at the library level to be correct on a `started=true`, loop-never-run group — broader blast radius; only if the contract-group `started=true` synthetic is deemed a library contract, not a demo hack.
Gate: re-run `proof:fsm-suspend-resume-live` clause (c) GREEN **and** `proof:subject-animates [group]` + the cube/amiga transport gates unchanged (regression guard). Owner: the S.A0(6)/cold-entry behavioral wave, NOT the keystone's first motion.

---

## The subject-animates `[real-cube]` cold-path residual (cold-entry family — located, out of scope)

After the importmap fix, DM-11b's `realSceneHalf` reds: `[real-cube] the demo cube's REAL subject did NOT receive the engine write — playhead stayed 0 → 0 (engineWrote=false)`. The gate clears localStorage, navToScene("cube","Controls"), clicks "Play animation" from **cold**, and the slider `aria-valuenow` never advances past 0. This is the **cold-entry** family (p12 cited `scenePlaybackAdapters.ts:76-79` — whose "P0 cure" `if (!group.started) group.play()` is *already present* on this tree, so the residual is a **deeper** cold-start no-op on the cube's real group, distinct from that adapter line). Same class as DM-14: the dock/machine transport ↔ engine cold-start decoupling. **Belongs to the S.A0(6)/cold-entry wave** with a live repro-and-verify; not a static-diff prototype. Not a threshold game — it is a real subject-write red, correctly surfaced only *after* the importmap unblocked the synthetic arms.

---

## Summary for S.A (sizing correction, evidence-backed)

**Proven-GREEN cause-fixes ready to land verbatim (4 gates, device-independent, 5 files):**
`styling-idioms` (1 CSS rule) · `pin-ledger-current` (JSON refresh) · `demo-usability` X-6 (static parser re-point) · **DM-13 `engine-no-throw-on-play`** (the shared importmap ×2). The importmap fix **also** discharges DM-11b's importmap root (3 synthetic arms RED→GREEN).

**Genuine behavioral born-REDs, cause precisely located, correctly OUT of prototype scope (owned by S.A0(6)/cold-entry + S.G):**
DM-14 spring pause/resume (contract-group transport ↔ machine decouple — seam pinned to `useAnimationGroupPlayback.toggleAnimationGroup` × `useContractAnimGroup` synthetic `started=true`) · DM-11b `[real-cube]` cold-start no-op.

The p12 model holds: the CI-red plane is **fix-by-cause, deterministic, zero device-dependence**. The cheap majority (harness + false-positive + one-liners) greens now; the residue is genuine behavioral source needing live verify — exactly p12's split, now with the harness half **executed and proven**.
