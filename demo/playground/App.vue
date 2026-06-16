<template>
    <EditorShell
        :animation-group="animationGroup"
        :super-key="superKey"
        :show-start-screen="false"
    >
        <template #tabs-trigger="{ selectedAnimation }">
            <TabsTrigger value="assets" class="tab-trigger-base tab-trigger-pill">Assets</TabsTrigger>
        </template>

        <template #tabs-content>
            <TabsContent value="assets">
                <AssetLayerPanel
                    ref="layerPanelRef"
                    :animation-names="animationNames"
                />
            </TabsContent>
        </template>

        <template #target="{ selectedAnimation, isPlaying }">
            <div class="relative w-full h-full">
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
import { ref, toRaw, useTemplateRef, watch } from "vue";
import { TabsContent, TabsTrigger } from "reka-ui";
import { EditorShell } from "@components/custom/editor-shell";
import { AssetLayerPanel, AssetViewport, useAssetManager } from "@components/custom/asset-manager";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";
import { usePlaygroundAnimations } from "./usePlaygroundAnimations";

import "@styles/style.css";

const { animationGroup, animationNames, superKey } = usePlaygroundAnimations();

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
</script>
