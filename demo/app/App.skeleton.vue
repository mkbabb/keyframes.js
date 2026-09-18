<script setup lang="ts">
/**
 * SceneSkeleton — T.F8 (the skeletons tier; lane 13 rec 8).
 *
 * THE shared loading placeholder for the app-shell `<Suspense>` fallback: a
 * glass-plate shimmer matching the stage geometry, shown while a lazy scene's
 * async chunk (or its Monaco pane) resolves. It REPLACES the bare
 * `<span>Loading scene…</span>` text-flash (VERDICT #19 perceived-perf sibling)
 * — a COMPONENT, not a raw text node.
 *
 * The STRUCTURAL contract is what T.F8 pins (fallback ≠ bare text, no
 * stage-gating icon-spinner); the VISUAL treatment (shimmer feel, shape
 * fidelity) is an appearance disposition deferred to T.M2 / T.D's glass
 * language. The shimmer is content-independent chrome — it honors
 * `prefers-reduced-motion` (a static dimmed plate for reduced-motion users) and
 * is marked `aria-busy` so assistive tech announces the loading state.
 */
withDefaults(
    defineProps<{
        /** Accessible label announced while the skeleton is shown. */
        label?: string;
    }>(),
    { label: "Loading scene" },
);
</script>

<template>
    <div
        class="scene-skeleton"
        role="status"
        aria-busy="true"
        :aria-label="label"
    >
        <div class="scene-skeleton__plate" aria-hidden="true">
            <span class="scene-skeleton__sheen" />
        </div>
    </div>
</template>

<style scoped>
.scene-skeleton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: clamp(1rem, 4vw, 3rem);
}

/* The stage plate: a glass surface silhouette echoing a scene's stage panel.
   Every token below is read in its RAW form (--muted / --border / --foreground /
   --radius-lg), the spelling the other 16 demo files use — never the
   `--color-*` Tailwind bridge, which `@theme inline` emits only when a utility
   references it (the KF-SKEL-2 trap; KF-SKEL-17). The elevation is glass-ui's
   own quiet-tier shadow, a token the producer EMITS at :root; the former
   "shadow-glass" token existed nowhere (0 declarations in the dist, the demo
   and the shipped sheet) and its Tailwind-bridge spelling (the shadow-prefixed
   form) does not emit either, so the plate had always painted a 4%-black
   literal, invisible on the
   dark arm (KF-APP-25). No fallback literal rides any read: this sheet is
   mounted inside the app whose stylesheet imports glass-ui first, so a literal
   beside a resolving token could never fire and would only restate — the
   masking pattern the phantom-token audit exists to remove. The S-6 delegation
   to the stage-card register is W6-I's and lands on top of this. */
.scene-skeleton__plate {
    position: relative;
    width: min(100%, 42rem);
    height: min(100%, 24rem);
    overflow: hidden;
    border-radius: var(--radius-lg);
    background: color-mix(in oklab, var(--muted) 70%, transparent);
    border: 1px solid color-mix(in oklab, var(--border) 80%, transparent);
    box-shadow: var(--glass-shadow-quiet);
}

/* The shimmer sweep — a translucent highlight travelling across the plate. */
.scene-skeleton__sheen {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        105deg,
        transparent 0%,
        transparent 35%,
        color-mix(in oklab, var(--foreground) 8%, transparent)
            50%,
        transparent 65%,
        transparent 100%
    );
    background-size: 220% 100%;
    animation: scene-skeleton-sweep 1.6s ease-in-out infinite;
    will-change: background-position;
}

@keyframes scene-skeleton-sweep {
    from {
        background-position: 140% 0;
    }
    to {
        background-position: -40% 0;
    }
}

/* Reduced-motion: no travelling sheen — a calm, static dimmed plate. */
@media (prefers-reduced-motion: reduce) {
    .scene-skeleton__sheen {
        animation: none;
        background: none;
    }
}
</style>
