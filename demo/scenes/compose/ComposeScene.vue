<template>
    <!-- S.D3 (C-4) — THE FOUNDRY, folded from the standalone playground into the
         ninth SPA scene. The scene ROOT hosts the casting-floor Target (what the
         standalone App.vue projected into EditorShell's `#target`); the Assets
         panel is projected into the controls pane via the exposed `tabsContent`
         render-fn (the SAME cross-sibling seam easing/spring/cube use), gated by
         the DFA's `assets` surface. The scene owns the ignition LOGIC; ComposeTarget
         owns the ignition STAGE. -->
    <ComposeTarget
        ref="targetRef"
        :sorted-assets="sortedAssets"
        :selected-asset-ids="assetState.selectedAssetIds"
        :grid-snap="assetState.gridSnap"
        :grid-size="assetState.gridSize"
        :igniting="igniting"
        :comet-d="cometD"
        @select="selectAsset"
        @deselect-all="deselectAll"
        @update-transform="updateTransform"
        @add="addAsset"
    />
</template>

<script setup lang="ts">
import { computed, h, nextTick, ref, toRaw, useTemplateRef, watch } from "vue";

import { AssetLayerPanel, useAssetManager } from "./asset-manager";
import ComposeTarget from "./ComposeTarget.vue";
import { kfEngine } from "@utils/kfEngine";

import { useComposeDemo } from "./useComposeDemo";
import { COMPOSE_SUPER_KEY } from "./composeKeys";

const superKey = COMPOSE_SUPER_KEY;

const demo = useComposeDemo();
const { animationGroup, animationNames, isPlaying, isStarted } = demo;

const {
    state: assetState,
    sortedAssets,
    addAsset,
    selectAsset,
    deselectAll,
    updateTransform,
} = useAssetManager();

const targetRef = useTemplateRef<InstanceType<typeof ComposeTarget>>("targetRef");

// The Assets panel is projected into the controls pane through the render-fn slot
// (the DFA's single `assets` surface → the flat single-surface panel host in
// AnimationControls, the SAME path easing/spring ride). It renders the layer list
// + properties + the bind-ignition trigger, wired back to this scene's foundry via
// `@bind-ignition`.
const tabsContent = () =>
    h(AssetLayerPanel, {
        animationNames,
        onBindIgnition: onBindIgnition,
    });

// Wire asset animation bindings: when an asset has an animationName, set the
// asset's DOM element as the animation target.
watch(
    [sortedAssets, () => targetRef.value?.assetElMap],
    () => {
        const elMap = targetRef.value?.assetElMap;
        if (!elMap) return;

        for (const asset of sortedAssets.value) {
            if (asset.animationName && elMap[asset.id]) {
                const entry = animationGroup.value.animations[asset.animationName];
                if (entry) {
                    // toRaw unwraps any Vue reactive proxy so the animation engine
                    // receives a real HTMLElement with dispatchEvent etc.
                    entry.animation.setTargets(toRaw(elMap[asset.id]!));
                }
            }
        }
    },
    { deep: true },
);

// ── S.D3 / L.W11 S9 — THE BIND IGNITION (the casting-floor signature) ─────────
// Binding a preset IGNITES the asset: a warm key-light bloom + a first-cycle
// comet-tail that traces the preset's ACTUAL easing curve (the bezier/spring math
// the engine produces, drawn back onto the page via the library's own DrawSVG —
// the math made visible). PRM collapses it to an instant state flip. The animation
// engine stays the single paint authority: ignition READS the bound preset's
// timing function, it does not add a second writer (inv ζ).
const igniting = ref(false);
const cometD = ref("M 0 60 L 100 0");

const prefersReduced = () =>
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Sample the bound preset's timing function into an SVG polyline `d` (the curve
// the engine actually runs). The comet-tail then SELF-DRAWS that curve via
// fromDrawSVG — the easing math drawn back onto the page within one cycle.
const buildCometPath = (animationName: string): string => {
    const entry = animationGroup.value.animations[animationName];
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

// Light the asset that was just bound: settle the key-light toward it + draw the
// comet-tail of its preset curve.
const onBindIgnition = async (id: string, animationName: string) => {
    // Settle the key-light toward the bound asset's centre (spotlight the creation).
    const host = targetRef.value?.foundryEl;
    const el = targetRef.value?.assetElMap?.[id];
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
    const pathEl = targetRef.value?.cometPathEl;
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

defineExpose({
    animationGroup: computed(() => animationGroup.value),
    superKey,
    isPlaying,
    isStarted,
    // The group ScenePlayback adapter — the App registers it with the machine on
    // SCENE_READY so the composed presets' `t` snapshots round-trip through the
    // CONTRACT (proof:scene-contract-identity).
    scenePlayback: demo.scenePlayback,
    tabsContent,
});
</script>
