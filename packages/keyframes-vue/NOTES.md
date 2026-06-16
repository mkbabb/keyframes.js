# @mkbabb/keyframes-vue — scaffold notes (K.W12 ED-2)

## Status: SCAFFOLDED, publish gated on K.WZ (USER-DOMAIN)

This package is the K.W12 ED-2 thin Vue adapter (`ecosystem-distribution.md §2`,
the K-CANDIDATE Vue / BOOK React verdict). It is scaffolded complete — the
`<Keyframes>` component, the `useKfAnimation` kernel, the barrel, the build
config, the README — and consumes the **published** `@mkbabb/keyframes.js`
barrel as a peer.

## What is deliberately NOT done here (and why)

- **NOT installed into the monorepo dev tree.** The adapter consumes
  `@mkbabb/keyframes.js` from the registry as a PEER (the acyclic-spine
  invariant — no `file:` link, no vendored copy). Wiring it into the root
  workspace would either (a) `file:`-link the sibling (forbidden) or (b) double
  the root install/CI surface before the publish is authorized. The package's
  own `tsc`/`build` runs against an installed peer (a fresh `npm i` in
  `packages/keyframes-vue/`), not the monorepo root.

- **NOT published.** The publish (the first `0.1.0` cut) is USER-DOMAIN, gated on
  K.WZ — the same gate as the core library's K-tranche republish. A second
  published package doubles the release/version/CI surface; per the J.W5 caveat
  (`ecosystem-distribution.md §2.5`) it must ride the SAME
  `proof:published-surface` discipline (its tarball == its `files`; its README
  snippets execute). The README documents that discipline; the gate wiring lands
  with the publish at K.WZ.

## The boundary held

- The Vue peer is declared HERE, on the adapter — the core library never
  re-advertises it (the spurious-Vue-peer fold was discharged at J.W5).
- The heavy `CSSKeyframesAnimation` is reached through the PUBLIC
  `loadAnimationEngine()` boundary, never a raw chunk — the static/dynamic
  boundary is intact through the adapter.
- The component + kernel are the on-brand extraction, NOT the demo's
  `ScenePlayback`/`sceneMachine`-coupled composables (researched-FALSE to lift).

## To publish at K.WZ

```sh
cd packages/keyframes-vue
npm i                    # install the peers (kf + vue) from the registry
npm run check            # tsc against the installed peer
npm run build            # vite lib build → dist/keyframes-vue.js + .d.ts
npm publish --access public --provenance
```
