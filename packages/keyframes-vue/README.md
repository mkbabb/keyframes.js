# @mkbabb/keyframes-vue

A thin Vue 3 adapter over [`@mkbabb/keyframes.js`](https://github.com/mkbabb/keyframes.js).

Two on-brand primitives — nothing more. The adapter consumes the **published**
`@mkbabb/keyframes.js` barrel (the light tier statically, `loadAnimationEngine()`
for the heavy `CSSKeyframesAnimation`); the Vue peer lives here, the core library
never carries it.

## Why this adapter exists (and what it deliberately is NOT)

The headline is the declarative `<Keyframes :css>` component — the one a
Motion/`vueuse-motion` adapter **cannot** write, because no other engine parses
author CSS `@keyframes` as its source format. This is kf's unique axis: the
component takes the *author's* CSS and exposes the scalar progress through a
slot.

It is **not** a lift of the demo's `useRafScene`/`useAnimationSync`/
`useAnimationGroupPlayback` composables — those are wired to the demo app's own
`ScenePlayback`/`sceneMachine` contract (demo-app concepts, not general
animation-library concepts). The honest extraction is the ~40-line
`useKfAnimation` kernel + this component.

## Install

```sh
npm i @mkbabb/keyframes-vue @mkbabb/keyframes.js vue
```

`@mkbabb/keyframes.js` and `vue` are **peers** — you bring them; this package
ships only its ~80 lines over them.

## `<Keyframes :css>` — the declarative component

```vue
<script setup lang="ts">
import { Keyframes } from "@mkbabb/keyframes-vue";

const css = `
    @keyframes slide {
        from { transform: translateX(-100%); background-color: #C462D8; }
        100% { transform: translateX(50%);   background-color: #E85252; }
    }
`;
</script>

<template>
    <Keyframes :css="css" :options="{ duration: 2000, direction: 'alternate' }" v-slot="{ t }">
        <!-- t is the live progress ∈ [0,1]; the host element animates per the CSS -->
        <span>{{ Math.round(t * 100) }}%</span>
    </Keyframes>
</template>
```

Props: `css` (required — a CSS `@keyframes` string), `options` (every
`AnimationOptions` key), `autoplay` (default `true`), `as` (the wrapper tag,
default `"div"`). The slot receives `{ t, started, reversed }`.

## `useKfAnimation(getAnimation, isPlaying?)` — the kernel

The deadlock-safe settle-and-pause idiom: it polls a markRaw kf `Animation`'s
`effectiveT`/`started`/`reversed` onto reactive refs, idling when the animation
is at rest and resuming on the `isPlaying` **input** (never gating on an output
the loop computes — the deadlock the demo's `useAnimationSync` documents).

```ts
import { useKfAnimation } from "@mkbabb/keyframes-vue";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";

const { CSSKeyframesAnimation } = await loadAnimationEngine();
const anim = new CSSKeyframesAnimation({ duration: 1000 }, el).fromString(css);

const { t, started, reversed, wake } = useKfAnimation(() => anim);
// `t` is a Ref<number> tracking anim.effectiveT; call wake() after a scrub at rest.
anim.play();
```

## Publish discipline

This package rides the **same** `proof:published-surface` discipline as the core
library: its tarball is exactly its `files` declaration (`dist`), and the README
snippets above are the surface a `npm i` consumer reaches. A second published
package doubles the release surface — it must not escape that discipline, or it
re-opens the publish-boundary lie the core's J.W5 closes.

The publish itself is gated on K.WZ (confirm-first, the core's K-tranche republish
+ this sibling's first cut). See `NOTES.md`.

## License

MIT
