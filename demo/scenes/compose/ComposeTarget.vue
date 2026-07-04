<template>
    <!-- S.D3 (C-4) — THE CASTING FLOOR (the compose scene's Target). A
         playground-OWNED `[data-foundry]` wrapper layers the warm pointer-tracked
         key-light + the bind-ignition comet-tail stage OVER the shared graph
         paper. The key-light layer is `pointer-events:none`; PRM disables its
         smoothing. The ignition SVG carries the comet-tail the engine's DrawSVG
         draws (the preset's easing curve, drawn back onto the page). The scene
         owns the ignition LOGIC; this Target owns the ignition STAGE. -->
    <div
        ref="foundryEl"
        class="relative w-full h-full foundry"
        data-foundry
        @pointermove="onFoundryPointerMove"
    >
        <!-- the warm key-light wash that follows the pointer (key-light) -->
        <div class="foundry-keylight" aria-hidden="true"></div>
        <!-- the bind-ignition comet-tail stage: a transient SVG path the engine's
             fromDrawSVG draws to trace the bound preset's curve -->
        <svg
            class="comet-tail"
            :class="{ 'is-igniting': igniting }"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            aria-hidden="true"
        >
            <path ref="cometPathEl" class="comet-tail-path" fill="none" :d="cometD" />
        </svg>
        <AssetViewport
            ref="viewportRef"
            :sorted-assets="sortedAssets"
            :selected-asset-ids="selectedAssetIds"
            :grid-snap="gridSnap"
            :grid-size="gridSize"
            @select="(id, additive) => emit('select', id, additive)"
            @deselect-all="() => emit('deselectAll')"
            @update-transform="(id, t) => emit('updateTransform', id, t)"
            @add="(kind) => emit('add', kind)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";

import { AssetViewport } from "./asset-manager";
import type { Asset, AssetKind, AssetTransform } from "./asset-manager/assetTypes";

defineProps<{
    sortedAssets: Asset[];
    selectedAssetIds: string[];
    gridSnap: boolean;
    gridSize: number;
    /** True while a bind-ignition draw is in flight (the scene owns this state). */
    igniting: boolean;
    /** The comet-tail path `d` sampled from the bound preset's easing curve. */
    cometD: string;
}>();

const emit = defineEmits<{
    (e: "select", id: string, additive: boolean): void;
    (e: "deselectAll"): void;
    (e: "updateTransform", id: string, transform: Partial<AssetTransform>): void;
    (e: "add", kind: AssetKind): void;
}>();

const foundryEl = useTemplateRef<HTMLElement>("foundryEl");
const cometPathEl = useTemplateRef<SVGPathElement>("cometPathEl");
const viewportRef = useTemplateRef<InstanceType<typeof AssetViewport>>("viewportRef");

// The pointer-tracked key-light: write --mouse-x/--mouse-y (percent) so the warm
// radial wash FOLLOWS the pointer over the empty stage. The registered @property +
// transition (scoped CSS) smooths it; PRM disables the smoothing. The layer is
// pointer-events:none so it never gates a drop or an underlying control.
const onFoundryPointerMove = (e: PointerEvent) => {
    const host = foundryEl.value;
    if (!host) return;
    const r = host.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    host.style.setProperty("--mouse-x", `${x}%`);
    host.style.setProperty("--mouse-y", `${y}%`);
};

// The scene reaches these to run the ignition: the foundry host (to settle the
// key-light toward a bound asset), the comet-tail path (to sweep via fromDrawSVG),
// and the per-asset element map (to bind targets + look up an asset's centre).
defineExpose({
    foundryEl,
    cometPathEl,
    assetElMap: computed(() => viewportRef.value?.assetElMap),
});
</script>

<style scoped>
/* ── S.D3 / L.W11 S9 — THE CASTING-FLOOR KEY-LIGHT (compose-scene-only) ────────
   A warm, pointer-tracked radial wash over the shared graph paper. Built from
   --color-gold mixed VERY low over the background so it reads as warm LIGHTING,
   not a colour wash. The @property registration lets the pointer position
   interpolate smoothly even on infrequent pointer events; the layer is
   pointer-events:none so it never gates a drop. Document-global @property (Vue
   scopes selectors, not at-rules). */
@property --mouse-x {
    syntax: "<percentage>";
    inherits: true;
    initial-value: 50%;
}
@property --mouse-y {
    syntax: "<percentage>";
    inherits: true;
    initial-value: 38%;
}

.foundry {
    /* default key-light pool: the upper-third where the empty-state CTA lives. */
    --mouse-x: 50%;
    --mouse-y: 38%;
}

.foundry-keylight {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: var(--z-behind);
    background: radial-gradient(
        circle at var(--mouse-x, 50%) var(--mouse-y, 38%),
        color-mix(in oklab, var(--color-gold, hsl(43 74% 49%)) 9%, transparent),
        color-mix(in oklab, var(--color-gold, hsl(43 74% 49%)) 3%, transparent) 28%,
        transparent 55%
    );
    /* smooth the wash as the pointer moves — transition the REGISTERED
       --mouse-x/--mouse-y (the @property registration enables interpolation
       inside the gradient), so the key-light glides even on infrequent pointer
       events. PRM disables this below. */
    transition:
        --mouse-x 220ms ease-out,
        --mouse-y 220ms ease-out;
    /* a soft vignette frames the floor so things "land" rather than float on an
       infinite plane. */
    box-shadow: inset 0 0 120px
        color-mix(in oklab, var(--background) 70%, transparent);
}

/* The comet-tail stage — a transient SVG the engine's DrawSVG sweeps to trace the
   bound preset's easing curve. Hidden until an ignition; sits ABOVE the floor,
   BELOW the assets (z between the key-light and the viewport). */
.comet-tail {
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 12%;
    width: 84%;
    height: 30%;
    pointer-events: none;
    opacity: 0;
    z-index: var(--z-content);
}
.comet-tail.is-igniting {
    opacity: 1;
    transition: opacity 120ms ease-out;
}
.comet-tail-path {
    stroke: color-mix(in oklab, var(--color-gold-light, hsl(51 100% 50%)) 85%, transparent);
    stroke-width: 2;
    stroke-linecap: round;
    filter: drop-shadow(
        0 0 6px color-mix(in oklab, var(--color-gold, hsl(43 74% 49%)) 60%, transparent)
    );
    vector-effect: non-scaling-stroke;
}

/* MANDATORY PRM degrade — the key-light smoothing + the comet-tail fade are
   decorative; under reduced motion the wash snaps (no transition) and the
   ignition collapses to a state flip (the scene's onBindIgnition guard skips the
   draw, and this holds the comet-tail hidden). */
@media (prefers-reduced-motion: reduce) {
    .foundry-keylight {
        transition: none;
    }
    .comet-tail.is-igniting {
        transition: none;
    }
}
</style>
