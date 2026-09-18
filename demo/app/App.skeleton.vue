<script setup lang="ts">
/**
 * SceneSkeleton — T.F8 (the skeletons tier; lane 13 rec 8).
 *
 * THE shared loading placeholder for the app-shell `<Suspense>` fallback: the
 * scene's STAGE PLATE with a skeleton sheen inside it, shown while a lazy
 * scene's async chunk (or its Monaco pane) resolves. It REPLACES the bare
 * `<span>Loading scene…</span>` text-flash (VERDICT #19 perceived-perf sibling)
 * — a COMPONENT, not a raw text node.
 *
 * The STRUCTURAL contract is what T.F8 pins (fallback ≠ bare text, no
 * stage-gating icon-spinner). The VISUAL treatment is now DELEGATED (S-6,
 * W6-I — the CURE INVERSION, KF-SKEL-6): the plate is the demo's own
 * STAGE-CARD register — `<Card :shadow="false">`, the SAME plate the square,
 * amiga, spring and easing scenes stand on (SquareScene.vue:3-13), so the
 * swap-time silhouette (radius `rounded-card`, border, material) is the scene's
 * by construction and not a second hand-painted echo of it — and the sheen is
 * the producer's `Skeleton`, primitive-as-sheen only, never the bare primitive
 * as the plate (the bare `Skeleton` paints `--radius-input`, no border, no
 * elevation: every "bare Skeleton" cure INCREASED the discontinuity). The
 * former reimplementation (KF-SKEL-3) is gone with its five missing arms,
 * which now arrive with the delegation, each verified at the installed 7.0.0
 * bytes (`dist/glass-ui.css`, `.skeleton[data-v-cd03d0b0]`): a COMPOSITABLE
 * `transform` sweep under `prefers-reduced-motion: no-preference` (opt-in
 * polarity; KF-SKEL-10's paint-only `background-position` sweep and its
 * PRM-surviving `will-change` are deleted, not re-armed) on the house
 * `--duration-shimmer` clock (KF-SKEL-11's hard-coded 1.6s is gone) ·
 * `prefers-reduced-transparency: reduce` · `forced-colors: active`
 * (KF-SKEL-12 — both arms the demo had nowhere).
 *
 * GEOMETRY (KF-SKEL-8 + KF-SKEL-18): the plate FILLS the stage box it stands
 * in — the same `h-full w-full` the scene plates carry — inside a gutter that
 * reads the CONTAINER (`cqi`, the macro grid's `container-type: inline-size`
 * idiom, AnimationControlsGroup.css), never the viewport. The `42rem × 24rem`
 * literals that under-filled both layout forks are deleted; nothing here reads
 * `vw`.
 *
 * RADIUS (KF-SKEL-4, the CONSTRAINT): no radius is computed or declared in this
 * file. The Card's `rounded-card` resolves to whatever `--radius-card` is at
 * the producer, detuned or not — the spec pins intended-vs-shipped and the
 * producer half is G-W6-14's; this file must not cure against the detuned
 * values and does not.
 *
 * `Skeleton` is root-barrel-only at 7.0.0 (73 subpaths, no `./skeleton`) —
 * the root import is the ONLY door; `Card` takes its subpath.
 *
 * The host stays `role="status"` + `aria-busy` with its label so assistive
 * tech announces the loading state; the Card and the sheen are `aria-hidden`
 * chrome (the primitive strips `role`/`aria-*` from its own attrs and stamps
 * `aria-hidden="true"` itself).
 */
import { Skeleton } from "@mkbabb/glass-ui";
import { Card } from "@mkbabb/glass-ui/card";

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
        <Card
            :shadow="false"
            class="scene-skeleton__plate h-full w-full"
            aria-hidden="true"
        >
            <Skeleton class="scene-skeleton__sheen" />
        </Card>
    </div>
</template>

<style scoped>
.scene-skeleton {
    display: grid;
    width: 100%;
    height: 100%;
    padding: clamp(1rem, 4cqi, 3rem);
}

.scene-skeleton__plate {
    position: relative;
    overflow: hidden;
}

/* The sheen fills the plate and takes the plate's corner — the primitive's own
   `--radius-input` corner is for a text-line skeleton, not a stage. The
   descendant form outranks the primitive's single-class scoped rule. */
.scene-skeleton__plate > .scene-skeleton__sheen {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}
</style>
