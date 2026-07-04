<template>
    <EditorShell
        :animation-group="animationGroup"
        :super-key="superKey"
        :show-start-screen="false"
        :extra-tabs="extraTabs"
    >
        <!-- glass-ui 4.0.0 (BA.W-TABS) — the playground's "Assets" tab now rides
             the options-driven `<SegmentedTabs>` strip AS DATA via the standalone-
             host `extra-tabs` seam (the same DATA shape a machine-driven host gets
             from `extraControlTabs`), and its panel is a PLAIN gated `[role=tabpanel]`
             div in the `tabs-content` slot — mirroring CubeScene's matrix-controls
             body. The former reka `<TabsTrigger>`/`<TabsContent>` (re-sourced from
             `reka-ui` after glass-ui removed the reka Tabs wrapper) are DELETED: a
             reka `<TabsContent>` would throw "Symbol(TabsRootContext) not found" now
             that AnimationControls renders a `<SegmentedTabs>` strip, not a reka
             `<Tabs>` root. The panel is rendered ONLY while the active surface is
             "assets" (gated on the SAME single-authority `selectedControl` value the
             strip drives), exactly as the built-in panels are. -->
        <template #tabs-content>
            <div
                v-if="playgroundControls.selectedControl === 'assets'"
                role="tabpanel"
                data-state="active"
                tabindex="0"
            >
                <AssetLayerPanel
                    ref="layerPanelRef"
                    :animation-names="animationNames"
                    @bind-ignition="onBindIgnition"
                />
            </div>
        </template>

        <template #target="{ selectedAnimation, isPlaying }">
            <!-- L.W11 S9 — THE FOUNDRY (the casting floor). A playground-OWNED,
                 gated [data-foundry] wrapper layers the warm pointer-tracked
                 key-light + the bind-ignition stage OVER the untouched shared
                 graph paper (the PAPER pillar, deepest layer). The key-light layer
                 is `pointer-events: none` so it never gates the first drop; PRM
                 disables its smoothing. The ignition SVG carries the comet-tail the
                 engine's DrawSVG draws (the preset's easing curve, drawn back onto
                 the page). All scoped to THIS host — never the shared suite. -->
            <div
                ref="foundryEl"
                class="relative w-full h-full foundry"
                data-foundry
                @pointermove="onFoundryPointerMove"
            >
                <!-- the warm key-light wash that follows the pointer (key-light) -->
                <div class="foundry-keylight" aria-hidden="true"></div>
                <!-- the bind-ignition comet-tail stage: a transient SVG path the
                     engine's fromDrawSVG draws to trace the bound preset's curve -->
                <svg
                    ref="cometEl"
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
                    :selected-asset-ids="assetState.selectedAssetIds"
                    :grid-snap="assetState.gridSnap"
                    :grid-size="assetState.gridSize"
                    @select="selectAsset"
                    @deselect-all="deselectAll"
                    @update-transform="updateTransform"
                    @add="addAsset"
                />
            </div>
        </template>
    </EditorShell>
</template>

<script setup lang="ts">
import { nextTick, ref, toRaw, useTemplateRef, watch } from "vue";
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { EditorShell } from "@components/custom/editor-shell";
import { AssetLayerPanel, AssetViewport, useAssetManager } from "@components/custom/asset-manager";
import { getStoredAnimationGroupControlOptions } from "@state";
import { kfEngine } from "@utils/kfEngine";
import { usePlaygroundAnimations } from "./usePlaygroundAnimations";

import "@styles/style.css";

const { animationGroup, animationNames, superKey } = usePlaygroundAnimations();

// glass-ui 4.0.0 (BA.W-TABS) — the playground's scene-specific control tab,
// supplied to the options-driven `<SegmentedTabs>` strip AS DATA through the
// standalone-host `extra-tabs` seam (this host is NOT scene-machine-driven, so
// there is no `extraControlTabs` machine projection to ride). Its panel is the
// gated `tabs-content` div above. One tab, static — no reka `<TabsTrigger>`.
const extraTabs: SegmentedTabOption[] = [{ value: "assets", label: "Assets" }];

// The controls pane (which hosts the "Assets" tab content) only renders when
// a non-empty `selectedAnimation` is set. The playground has no animation
// picker — it binds animations per-asset — so seed the control store here:
// select the first preset and route the pane to the Assets tab, making the
// asset manager reachable on a cold boot.
const playgroundControls = getStoredAnimationGroupControlOptions(superKey);
if (!playgroundControls.selectedAnimation || !animationGroup.animations[playgroundControls.selectedAnimation]) {
    playgroundControls.selectedAnimation = animationNames[0] ?? "";
}
playgroundControls.selectedControl = "assets";
playgroundControls.isControlsPanelOpen = true;

const {
    state: assetState,
    sortedAssets,
    selectedAssets,
    addAsset,
    selectAsset,
    deselectAll,
    updateTransform,
} = useAssetManager();

const viewportRef = useTemplateRef<InstanceType<typeof AssetViewport>>("viewportRef");
const layerPanelRef = useTemplateRef<InstanceType<typeof AssetLayerPanel>>("layerPanelRef");

// Wire asset animation bindings: when an asset has an animationName,
// set the asset's DOM element as the animation target
watch(
    [sortedAssets, () => viewportRef.value?.assetElMap],
    () => {
        if (!viewportRef.value) return;
        const elMap = viewportRef.value.assetElMap;

        for (const asset of sortedAssets.value) {
            if (asset.animationName && elMap[asset.id]) {
                const entry = animationGroup.animations[asset.animationName];
                if (entry) {
                    // toRaw unwraps any Vue reactive proxy so the animation
                    // engine receives a real HTMLElement with dispatchEvent etc.
                    entry.animation.setTargets(toRaw(elMap[asset.id]!));
                }
            }
        }
    },
    { deep: true },
);

// ── L.W11 S9 — THE BIND IGNITION (the casting-floor signature) ───────────────
// The page's whole point — bringing a shape to life — was a silent dropdown. Now
// binding a preset IGNITES the asset: a warm key-light bloom + a first-cycle
// comet-tail that traces the preset's ACTUAL easing curve (the bezier/spring math
// the engine produces, drawn back onto the page via the library's own DrawSVG —
// the math made visible). PRM collapses it to an instant state flip (no bloom /
// no draw). The animation engine stays the single paint authority: ignition READS
// the bound preset's timing function, it does not add a second writer (inv ζ).
const foundryEl = useTemplateRef<HTMLElement>("foundryEl");
const cometEl = useTemplateRef<SVGSVGElement>("cometEl");
const cometPathEl = useTemplateRef<SVGPathElement>("cometPathEl");

const igniting = ref(false);
const cometD = ref("M 0 60 L 100 0");

const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// The pointer-tracked key-light: write --mouse-x/--mouse-y (percent) so the warm
// radial wash FOLLOWS the pointer over the empty stage — the lights-following-you
// invitation. The registered @property + transition (scoped CSS) smooths it even
// on infrequent pointer events; PRM disables the smoothing. The layer is
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

// Sample the bound preset's timing function into an SVG polyline `d` (the curve
// the engine actually runs). The comet-tail then SELF-DRAWS that curve via
// fromDrawSVG — the easing math drawn back onto the page within one cycle.
const buildCometPath = (animationName: string): string => {
    const entry = animationGroup.animations[animationName];
    const fn = entry?.animation?.options?.timingFunction?.fn;
    const N = 24;
    const pts: string[] = [];
    for (let i = 0; i <= N; i++) {
        const t = i / N;
        // y eased; map [0,1]→[60,0] (SVG y-down, curve climbs). Guard a missing fn.
        const eased = typeof fn === "function" ? fn(t) : t;
        const x = t * 100;
        const y = 60 - Math.max(0, Math.min(1, eased)) * 60;
        pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return pts.join(" ");
};

// Light the asset that was just bound: settle the key-light toward it (spotlight
// your creation) + draw the comet-tail of its preset curve.
const onBindIgnition = async (id: string, animationName: string) => {
    // Settle the key-light toward the bound asset's centre (spotlight the creation).
    const host = foundryEl.value;
    const el = viewportRef.value?.assetElMap?.[id];
    if (host && el) {
        const hr = host.getBoundingClientRect();
        const er = (el as HTMLElement).getBoundingClientRect();
        const cx = ((er.left + er.width / 2 - hr.left) / hr.width) * 100;
        const cy = ((er.top + er.height / 2 - hr.top) / hr.height) * 100;
        host.style.setProperty("--mouse-x", `${cx}%`);
        host.style.setProperty("--mouse-y", `${cy}%`);
    }
    if (prefersReduced()) return; // snap: no bloom, no draw (state flip only)

    // Build + draw the preset's easing curve as the comet-tail.
    cometD.value = buildCometPath(animationName);
    igniting.value = true;
    await nextTick();
    const pathEl = cometPathEl.value;
    if (pathEl) {
        // DOGFOOD: the library's own fromDrawSVG sweeps stroke-dashoffset
        // totalLen→0 — the comet-tail traces the curve, NO hand-rolled rAF (inv ζ).
        const { fromDrawSVG } = kfEngine();
        const draw = fromDrawSVG(pathEl, { duration: 900, autoPlay: true });
        void draw.finished.finally(() => {
            // The ignition fades within one cycle — clear the inline dash props so
            // a re-bind starts clean.
            pathEl.style.removeProperty("stroke-dasharray");
            pathEl.style.removeProperty("stroke-dashoffset");
            igniting.value = false;
        });
    } else {
        igniting.value = false;
    }
};
</script>

<style scoped>
/* ── L.W11 S9 — THE CASTING-FLOOR KEY-LIGHT (playground-only atmosphere) ───────
   A warm, pointer-tracked radial wash over the UNTOUCHED shared graph paper (the
   PAPER pillar, deepest layer). Built from --color-gold mixed VERY low over the
   background so it reads as warm LIGHTING, not a colour wash. The @property
   registration lets the pointer position interpolate smoothly even on infrequent
   pointer events (modern-web `interactive-content-reveal`); the layer is
   pointer-events:none so it never gates a drop. Document-global @property
   (Vue scopes selectors, not at-rules). */
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
   ignition collapses to a state flip (the `onBindIgnition` guard skips the draw,
   and this holds the comet-tail hidden). */
@media (prefers-reduced-motion: reduce) {
    .foundry-keylight {
        transition: none;
    }
    .comet-tail.is-igniting {
        transition: none;
    }
}
</style>
