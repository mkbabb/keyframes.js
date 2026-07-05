# KF → value.js letter (Tranche T) — KF-7 re-file (CSSPropertyDescriptor rename) + the self-dependency phantom + the color2Into verification trail

**From**: keyframes.js Tranche T (T.S3 / lane 27 F5+F6+fold-row-46) · **To**: @mkbabb/value.js (current head; the S7-lifecycle owner).
**Dispatch trigger**: authored at the T impl drive. The two headline asks (§1, §2) are **upstream-owned, neither-kf-fixable** defects that no kf gate would ever notice from its own side; §3 is a verification-trail tightening for a landed cross-repo dispatch.
**Successor to**: `docs/tranches/S/KF-VALUEJS-2.0.0.md` (the KF-1 grammar-rename letter; KF-7 was filed there at `:73` and rode the big spine's adopt-event watch with no watch of its own — the fire-and-forget failure this letter corrects).
**This letter is self-contained** — everything value.js needs is below.

> **Adopt-event-watch discipline (the process fix, applied to ALL riders).** KF-7 stranded four tranches because it was dispatched fire-and-forget. Every ask below carries its own **kf-side tripwire gate** that REDs until the upstream fix lands AND kf re-points — so a dispatch cannot silently rot. kf watches `npm view @mkbabb/value.js dist-tags` and acts ONLY on confirmation (the H4 spine discipline), never before.

---

## §1 — KF-7 is STILL unfulfilled at 3.0.0 (re-filed): rename `PropertyDescriptor` → `CSSPropertyDescriptor`

**The defect (unchanged since KF-VALUEJS-2.0.0.md:73).** value.js exports a type named `PropertyDescriptor`, which **collides with the ambient DOM/TS lib global** of the same name. When kf's API-Extractor rolls up the published `dist/keyframes.d.ts`, it disambiguates the collision by mangling the name into **`PropertyDescriptor_2`** — a machine-generated name leaking into kf's PUBLISHED public type surface.

**Verified live against BOTH the installed `^2.0.1` AND the published `3.0.0`** (T.S3 sweep, 2026-07-05):

- Installed `@mkbabb/value.js@2.0.1` — `node_modules/@mkbabb/value.js/dist/index.d.ts:41` exports `PropertyDescriptor` **un-renamed**.
- **Published `3.0.0`** (`npm pack @mkbabb/value.js@3.0.0`, tarball inspected): `package/dist/index.d.ts:43` **still** exports `PropertyDescriptor` un-renamed (re-exported from `./parsing/stylesheet`; the source type is `package/dist/parsing/stylesheet-types.d.ts:20`). **3.0.0 did NOT fix KF-7.**
- The defect is live in kf's built `dist/keyframes.d.ts` at **3 sites**: `:11` `import { PropertyDescriptor as PropertyDescriptor_2 } from '@mkbabb/value.js'`; `:814` `propertyRegistry: Map<string, PropertyDescriptor_2>`; `:2732` `properties: Map<string, PropertyDescriptor_2>` (a public `ResolvedKeyframes` field + a `platform-adopt`-tested `propertyRegistry` — both consumer-observable, so NOT `@internal`-trimmable).

**Why a kf-local alias does NOT fix it.** API-Extractor renames by value.js's **SOURCE** symbol, not the importer's alias — so kf cannot repair this on its own side. It MUST originate upstream.

**THE ASK — the same NO-legacy total rename shape as KF-1's `CustomFunctionParameter`:**

```ts
// @mkbabb/value.js — rename the exported type (root barrel + the /parsing subpath)
export type CSSPropertyDescriptor = { /* … unchanged shape … */ };
//     ^^^^^^^^^^^^^^^^^^^^^^^ was `PropertyDescriptor` (collides with the DOM global)
```

Same defect class kf already fixed locally for `globalThis.Animation`→`KeyframesAnimation` and `OscillatorOptions`→`OscillatorConfig`; this one originates upstream. **No legacy alias** — a total rename (the collision is the whole point; a `@deprecated` alias would re-introduce the ambient collision).

**kf's side (lockstep at the re-pin):** kf re-points its `import PropertyDescriptor` + the two `Map<string, …>` types in the SAME motion the rename lands (the adopt-event watch gates the re-point so the rename isn't consumed before it publishes — the KF-2 cadence lesson).

**kf tripwire (landed this batch, born-RED):** `proof:no-collision-rename` asserts **zero** `PropertyDescriptor_N` / `X as X_N` collision-renames on a `@mkbabb/value.js` import in the built `dist/keyframes.d.ts`. Planted-true today (reds on `PropertyDescriptor_2` at `:11/:814/:2732`); greens the instant value.js renames + kf re-points. Registered in `scripts/gate-bands.mjs` `T_BORNRED_BACKLOG` (dischargedBy: value.js rename + kf re-point).

---

## §2 — The self-dependency phantom (NEW this sweep) — FIXED in 3.0.0

**The defect.** `@mkbabb/value.js@2.0.1`'s own `package.json` lists **`"@mkbabb/value.js": "^1.0.2"` among its OWN `dependencies`** — a package depending on itself:

```
@mkbabb/value.js@2.0.1 dependencies = { "@mkbabb/parse-that": "^1.0.0", "@mkbabb/value.js": "^1.0.2" }
```

npm cannot dedupe a package against itself, so every `npm ci` **NESTS** a stale value.js (+ its stale parse-that) inside kf's own tree. Verified live in kf's `package-lock.json`:

```
node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js                              @ 1.2.0   (SELF-dependency)
node_modules/@mkbabb/value.js/node_modules/@mkbabb/value.js/node_modules/@mkbabb/parse-that @ 0.13.0
```

That is >1 MB of dead weight + a realm-duplication hazard (two value.js copies in one graph).

**STATUS: already fixed in 3.0.0.** `npm view @mkbabb/value.js@3.0.0 dependencies` → `{ "@mkbabb/parse-that": "^1.0.0" }` — the self-dep is **GONE**. No further value.js action is required; this section is recorded so the fix is attributable and so kf's re-pin (§4) is understood to depend on it.

**kf tripwire (landed this batch, born-RED):** `proof:no-nested-self-dependency` censuses `package-lock.json` for any `@mkbabb/*` package nested under another `@mkbabb/*` package's `node_modules`. Planted-true today (reds on the nested `1.2.0` / `0.13.0` pair); greens once kf re-points to a value.js whose lockfile no longer nests a self/duplicate `@mkbabb` install. Registered in `T_BORNRED_BACKLOG`.

---

## §3 — color2Into verification trail (fold row 46) — the itemized oracle, not "asserted verified"

**The gap (lane 27 fold row 46).** The `color2Into` currency WATCH was asserted verified at S.C4/S2 (`74ee9d2`) per `docs/tranches/S/PROGRESS.md` prose, but **no itemized oracle output** was captured in the session log — a bare "asserted verified". The value.js courtesy letter (`docs/tranches/S/VALUEJS-KF-COURTESY-2026-07-05.md §3`) independently records "`color2Into` currency held green through [the 2.0.1 re-pin]; the kf fold row 46 gate closed without firing its named exit."

**The itemized re-run (T.S3, 2026-07-05):**

```
$ node scripts/proof-consume-bundle.mjs
  PASS  C1-eager-graph          consumer eager bundle is value.js/parse-that-free
  PASS  C2-engine-dynamic-only  the heavy engine stays behind the dynamic import() boundary (0 dynamic chunk(s))
  proof:consume-bundle GREEN — a downstream consumer of the LIGHT surface drags zero value.js/engine.
  exit 0
```

Recorded as an **itemized exit**, not a prose assertion — the fold-row-46 verification trail is now honest.

---

## §4 — The value.js 3.x PIN decision (kf-side; EXECUTED at T.S3, 2026-07-05)

`3.1.0` is now the registry `latest` (`npm view @mkbabb/value.js dist-tags` → `{ latest: '3.1.0' }` — the line moved past the `3.0.0` this letter first analyzed). The re-pin was **EXECUTED at T.S3** via a **dedicated isolated motion** (NOT the impl-drive worktree, whose `node_modules` is a symlink to the shared checkout — an in-worktree `npm install` would corrupt sibling lanes). In a **fresh `git clone` + `npm ci`**, `npm install @mkbabb/value.js@^3.0.0` resolved `3.1.0` (declared `^3.1.0`, the `^<installed>` convention). The FULL verification greened:

- `npm run check` CLEAN · `npm run build` OK · `npm run gh-pages` OK · `npx vitest run` PASS
- `proof:library-correctness` **exit 0** · `proof:boundary` **0** · `proof:zero-alloc` **0** · `proof:replay-equality` **0** · `proof:color-fidelity` **0** · `proof:emerging-css-resolve` **0** (the KF-1 param-grammar vector holds)
- `proof:no-nested-self-dependency` **flips GREEN** — 3.1.0 drops the self-dep (§2); discharged, removed from `T_BORNRED_BACKLOG`
- `proof:no-collision-rename` **STAYS RED** — 3.1.0 STILL exports `PropertyDescriptor` un-renamed (§1); KF-7 unfulfilled, the tripwire remains a born-RED backlog gate

The 3.x MAJOR breaking changes (logerp arg order / color-soa removal) **do NOT touch kf's surface** (grep-zero in `src/`). The PIN-LEDGER value.js row is FOLDED into `shipped` (`^3.1.0` / `3.1.0`); the target row is `FIRED`.

**Merge note (the isolation-hazard tail):** the pin's `package.json` + `package-lock.json` are committed, but the impl-drive worktree's shared `node_modules` was **intentionally NOT mutated** (to protect the two sibling lanes). The pin-dependent gates (`proof:pin-ledger-current`, `proof:no-nested-self-dependency`) green only once the tree is `npm ci`'d to 3.1.0 — the orchestrator MUST `npm ci` after merging this branch (flagged in the drive's risksForMerge).

---

## §5 — resolveEasing convergence book (ACKNOWLEDGED — no action now)

The courtesy letter (`§1`) records that value.js `3.0.0` now hosts the canonical `resolveEasing(string → TimingFunction)` on its `/easing` subpath — the one-true string→easing resolver the constellation may converge on. **kf records the book, takes no action now:**

- kf's **LIGHT** `resolveEasing` (`src/animation/easing.ts`) stays **value.js-free by the `proof:boundary` contract** — the barrel's light surface must drag zero value.js; consuming value.js's `resolveEasing` statically there would breach the boundary. So the LIGHT resolver does NOT converge onto value.js.
- kf's **HEAVY** `compile/easing-registry.ts` (`getTimingFunction`, already value.js-bearing) MAY converge onto value.js's `resolveEasing` — but the **trigger is the T easing batch** (kf's next easing-surface touch), per the value.js convergence book. **No action in T.S3.**

---

## Summary of asks

| # | Ask | Owner | Status | kf tripwire |
|---|---|---|---|---|
| KF-7 (re-filed) | rename exported `PropertyDescriptor` → `CSSPropertyDescriptor` (no legacy alias) | **value.js** | OPEN — still un-renamed at 3.1.0 (re-verified T.S3) | `proof:no-collision-rename` (born-RED, STAYS red post-pin) |
| self-dep phantom | drop `@mkbabb/value.js` from value.js's own deps | value.js | **DONE (3.0.0+); GREENED at the kf re-pin** | `proof:no-nested-self-dependency` — flipped GREEN, DISCHARGED (removed from backlog) |
| color2Into trail | — (kf-side verification tightening) | kf | **DONE** (§3 itemized exit) | `proof:consume-bundle` exit 0 |
| 3.x pin | re-pin `^3.0.0` (→ 3.1.0) in a dedicated motion | kf | **EXECUTED (T.S3, 2026-07-05)** — full gate set GREEN in an isolated clone; PIN-LEDGER row FOLDED to shipped | full library gate set (all green) |
| resolveEasing | converge HEAVY registry onto value.js | kf | BOOKED — trigger = T easing batch | — |
