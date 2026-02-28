<template>
    <EditorShell
        :animation-group="animationGroup"
        :super-key="superKey"
        :show-start-screen="false"
    >
        <template #tabs-trigger="{ selectedAnimation }">
            <TabsTrigger value="assets">Assets</TabsTrigger>
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
                />
            </div>
        </template>
    </EditorShell>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { TabsContent, TabsTrigger } from "@components/ui/tabs";
import { EditorShell } from "@components/custom/editor-shell";
import { AssetLayerPanel, AssetViewport, useAssetManager } from "@components/custom/asset-manager";
import { usePlaygroundAnimations } from "./usePlaygroundAnimations";

import "@styles/utils.css";
import "@styles/style.css";

const { animationGroup, animationNames, superKey } = usePlaygroundAnimations();

const {
    state: assetState,
    sortedAssets,
    selectedAssets,
    selectAsset,
    deselectAll,
    updateTransform,
} = useAssetManager();

const viewportRef = ref<InstanceType<typeof AssetViewport> | null>(null);
const layerPanelRef = ref<InstanceType<typeof AssetLayerPanel> | null>(null);

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
                    entry.animation.setTargets(elMap[asset.id]!);
                }
            }
        }
    },
    { deep: true },
);
</script>
