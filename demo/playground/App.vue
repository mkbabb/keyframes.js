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
                />
            </div>
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
import type { SegmentedTabOption } from "@mkbabb/glass-ui/tabs";
import { EditorShell } from "@components/custom/editor-shell";
import { AssetLayerPanel, AssetViewport, useAssetManager } from "@components/custom/asset-manager";
import { getStoredAnimationGroupControlOptions } from "@components/custom/animation-controls/stores";
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
</script>
