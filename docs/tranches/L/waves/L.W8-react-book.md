# L.W8 S5 — `@mkbabb/keyframes-react` BOOK (the tripwire disposition)

- **Wave:** L.W8 S5 (audit W129; `K.W12.md:86`) · **Class:** BOOK (disposition,
  NOT a deliverable) · **Dep:** L.W8 S2 (keyframes-vue publish-PREP) — the Vue
  adapter is the pattern-proof tripwire the React BOOK requires.
- **Status:** the tripwire is **FIRED** (S2 publish-PREP closed; see the state
  caveat in §1). This document is the BOOK — **no `packages/keyframes-react/`
  source is authored in L.W8** (the disposition records the criteria, not the
  scaffold).

---

## 1. The tripwire — FIRED (with the publish-state caveat)

The React BOOK was explicitly gated on the Vue adapter proving the surface shape:
`K.W12.md:86` records "BOOK (React) — no battle-tested code to extract and no
dogfood demo to dogfood-invert against," and `audit-32-skeleton.txt` W129's dep is
"keyframes-vue published + demo-dogfooded first." L.W8 S2 is the wave that fires it.

**What FIRED:** S2's publish-PREP is complete — the `@mkbabb/keyframes-vue` package
is built (`dist/keyframes-vue.js` + the rolled `dist/keyframes-vue.d.ts`),
type-checks green, declares the `>=4.3.0` peer floor, and the `release.yml`
`publish-keyframes-vue` job is authored (sequenced AFTER the core publish, under the
same OIDC provenance). The two-primitive surface the BOOK needs — `<Keyframes :css>`
+ `useKfAnimation` — is now a built, gate-witnessed artifact. The *shape* is proven.

**The caveat (honest state):** the actual `npm publish` of `@mkbabb/keyframes-vue`
is **USER-DOMAIN** — L.W8 implements everything UP TO publish but does NOT publish.
So `proof:keyframes-vue-published` clause (b) (`npm show … version → 0.1.0`) STAYS
RED-by-design until the user's tag-push fires the `release.yml` job. The npm
dist-tag is therefore **PENDING** (not yet `latest`). The tripwire FIRES on the
publish-PREP closure (the shape is proven + the publish path is authored) — it does
NOT wait on the registry round-trip, because the BOOK is about the *shape the Vue
adapter proved*, and that shape is now a built, type-checked, gated artifact. When
the user publishes, record the dist-tag confirmation here as a one-line addendum.

---

## 2. The surface shape the Vue adapter proved

The Vue adapter (`packages/keyframes-vue/`) is a **two-primitive kernel** — nothing
more. Both primitives are the on-brand extraction (NOT the demo's
`ScenePlayback`/`sceneMachine`-coupled composables, researched-FALSE to lift).

### 2.1 `<Keyframes :css>` — the declarative component (the HEADLINE)

```vue
<Keyframes :css="css" :options="{ duration: 2000 }" v-slot="{ t, started, reversed }">
    <span>{{ Math.round(t * 100) }}%</span>
</Keyframes>
```

Takes a CSS `@keyframes` STRING — kf's unique axis-1, the author's source format —
animates the host element, and exposes the scalar progress `t` (plus
`started`/`reversed`) through the default slot. **This is the one adapter a
Motion/`vueuse-motion` adapter CANNOT write**: no other engine parses author CSS
`@keyframes` as its source (ecosystem-distribution.md §2.2).

It reaches the heavy engine through the PUBLIC `loadAnimationEngine()` boundary (an
`await` at mount), never a raw chunk — the static/dynamic boundary held through the
adapter. The props are `css` (required), `options` (a local `KeyframesOptions =
Partial<InputAnimationOptions>` alias — see §4 on the d.ts-portability lesson),
`autoplay` (default `true`), `as` (the wrapper tag, default `"div"`).

### 2.2 `useKfAnimation(getAnimation, isPlaying?)` — the kernel

The ~40-line settle-and-pause kernel — the ONE genuinely hard-won correctness
property worth shipping as a library primitive. It POLLS a `markRaw` kf `Animation`'s
`effectiveT`/`started`/`reversed` onto reactive refs and exposes a `wake()` re-arm.

**The hard-won discipline — "gate on inputs, not outputs":** the loop must idle when
the animation is at rest (else every mounted consumer burns a frame forever), but
gating the loop on `started` (an OUTPUT the loop COMPUTES) deadlocks. The fix: idle
only when the polled state has been STABLE for a settle window (`SETTLE_FRAMES = 30`,
~0.5s @ 60fps), and RESUME on `isPlaying` (an INPUT the caller owns). A scrub that
mutates `effectiveT` without touching `isPlaying` is re-armed via `wake()`.

**This discipline is framework-agnostic** — it is the kernel the React BOOK extracts
verbatim (only the reactive substrate changes; see §3).

---

## 3. The React equivalents (the BOOK's extraction map)

The React adapter is the SAME two-primitive kernel; only the reactive substrate
changes (Vue's `ref`/`onMounted`/`onScopeDispose`/`watch` → React's
`useState`/`useRef`/`useEffect`). The semantics are identical.

| Concept | Vue (proven) | React (the BOOK) |
|---------|--------------|------------------|
| Declarative component | `<Keyframes :css="css" v-slot="{ t }">` | `<Keyframes css={css}>{({ t }) => …}</Keyframes>` (render-prop child) |
| Progress kernel | `useKfAnimation(getAnimation, isPlaying?)` | `useKfAnimation(getAnimation, isPlaying?)` — identical signature |
| Reactive cell | `ref<number>` | `useState<number>` (or a `useSyncExternalStore` subscription) |
| Host ref | `ref<HTMLElement \| null>` | `useRef<HTMLElement>(null)` |
| Mount build | `onMounted(build)` | `useEffect(() => { void build(); }, [])` |
| CSS-change rebuild | `watch(() => props.css, …)` | `useEffect(…, [css])` |
| Teardown | `onScopeDispose(pause)` | `useEffect`'s cleanup return |
| Heavy engine reach | `await loadAnimationEngine()` at mount | `await loadAnimationEngine()` in the effect |
| markRaw escape hatch | `markRaw(anim)` (un-proxied) | a plain `useRef` (React never proxies — no escape hatch needed) |

The `useKfAnimation` rAF poll loop ("gate on inputs, not outputs") transposes
**unchanged** — it is a closure over `requestAnimationFrame`/`cancelAnimationFrame`,
not a Vue construct. The React kernel exposes `{ t, started, reversed, wake }` exactly
as the Vue kernel does. `useSyncExternalStore` is the idiomatic React-18 substrate
for the external (rAF-driven, un-tracked) animation state — preferred over
`useState` + a manual re-render trigger.

The on-brand component is the `<Keyframes css={…}>` render-prop — the React-side
adapter a Framer-Motion adapter likewise cannot write, for the same reason (no
other engine parses author CSS `@keyframes` as its source).

---

## 4. The d.ts-portability lesson carried forward (S2 → the React scaffold)

S2 surfaced a publish-blocker the React scaffold WILL re-hit: the rolled `.d.ts`
emit (vite-plugin-dts) tripped **TS2883** — the inferred component type reached
`HueInterpolationMethod` from `@mkbabb/value.js` (nested under the kf peer) via
`InputAnimationOptions.hueMethod`, which the kf barrel does NOT re-export. The cure
(carry it into the React build verbatim):

1. **vite-plugin-dts 5 uses `bundleTypes: true`** (v4's `rollupTypes` is silently
   ignored — no validation error; you get per-module `dist/src/*.d.ts` and NO rolled
   entry). `@microsoft/api-extractor` is its OPTIONAL peer — a devDependency.
2. **Pin BOTH `entryRoot` and `compilerOptions.rootDir` to `src/`** so TSC's emit
   location and the plugin's rollup-stub path stay in lockstep (the core library's
   `vite.config.ts:314-347` records this same lesson).
3. **Add `@mkbabb/value.js` as a top-level devDependency** + `bundledPackages:
   ["@mkbabb/value.js"]` so the one non-portable transitive type (`HueInterpolationMethod`,
   `ColorSpace`) is INLINED into the rolled `.d.ts`, keeping it self-contained. The
   peer types (`@mkbabb/keyframes.js`, `react`) stay EXTERNAL.

---

## 5. The scaffold prerequisite (NOT authored in L.W8)

The BOOK records the criteria; the scaffold is a FUTURE wave. When authored,
`packages/keyframes-react/` is:

```
packages/keyframes-react/
├── src/
│   ├── Keyframes.tsx       # the <Keyframes css={…}> render-prop component
│   ├── useKfAnimation.ts   # the settle-and-pause kernel (transposed from Vue)
│   └── index.ts            # the two-export barrel
├── package.json
├── tsconfig.json           # strict + verbatimModuleSyntax + exactOptionalPropertyTypes + noUncheckedIndexedAccess
├── vite.config.ts          # lib build; react + @mkbabb/keyframes.js EXTERNAL; dts per §4
├── README.md
└── NOTES.md
```

**`package.json` peer declaration:**

```jsonc
"peerDependencies": {
    "react": ">=18",
    "@mkbabb/keyframes.js": ">=5.0.0"
}
```

- `react: ">=18"` — `useSyncExternalStore` (the idiomatic external-state substrate)
  is a React-18 primitive.
- `@mkbabb/keyframes.js: ">=5.0.0"` — the React adapter targets the **5.0.0** MAJOR
  cut (L.W8 S4's `Animation` → `KeyframesAnimation` HEAVY-type rename lands there;
  the BOOK pins forward to the clean surface, NOT the transitional `>=4.3.0` the Vue
  adapter rides). This is the deliberate forward-pin: the Vue adapter shipped first
  on the 4.x surface; the React adapter is born on 5.x.
- inv-16: the `@mkbabb/keyframes.js` dep is a registry RANGE, never a `file:` link
  (the acyclic-spine invariant — the adapter installs the PUBLISHED peer, never
  vendors or self-aliases the core).

---

## 6. The gate-first discipline (authored BEFORE the scaffold)

Per the L.W1 lesson (a workaround was caught + reverted) and the SOLE-AUTHORSHIP
discipline (DLL-24), the React publish gate is **born-RED, authored BEFORE any
source**:

- **`proof:keyframes-react-published`** (the mirror of
  `scripts/proof-keyframes-vue-published.mjs`) is authored FIRST — three clauses:
  (a) `packages/keyframes-react/dist/keyframes-react.js` exists; (b) `npm show
  @mkbabb/keyframes-react version` returns the scaffold's version; (c) the peer floor
  is `>=5.0.0`. It is born-RED on a tree with no scaffold (clause (a) reds: no dist)
  and STAYS RED-by-design until the USER publishes (clause (b)).
- It rides the **report-all CI demo-smoke job (continue-on-error)** as a TRIPWIRE —
  NEVER the blocking `proof:hygiene` chain (an absent-on-npm RED there would abort
  the `&&` chain). The SAME disposition as `proof:peer-satisfied` and
  `proof:keyframes-vue-published`.
- The gate is authored, confirmed RED, and the scaffold is then built to GREEN
  clauses (a) and (c) — clause (b) stays the USER-DOMAIN publish tripwire. **No
  scaffold is written before its gate exists and is witnessed RED.**

---

## 7. Disposition

- The React BOOK tripwire is **FIRED** (S2 publish-PREP closed; the npm dist-tag is
  PENDING the USER-DOMAIN publish — §1 caveat).
- The surface shape is **proven** (the Vue two-primitive kernel, §2) and **mapped**
  to React (§3).
- The scaffold is **NOT authored in L.W8** — this BOOK is documentation only. No
  `packages/keyframes-react/` directory exists on this tree (confirmed).
- The forward criteria are recorded: the **5.0.0 forward-pin** (§5), the
  **d.ts-portability cure** (§4), and the **gate-first `proof:keyframes-react-published`**
  authored-before-scaffold discipline (§6).
- **Next wave (not L.W8):** author `proof:keyframes-react-published` (RED) → build
  the `packages/keyframes-react/` scaffold to GREEN (a)/(c) → the publish stays
  USER-DOMAIN.
