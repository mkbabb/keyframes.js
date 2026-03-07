<template>
    <Card class="w-full overflow-hidden">
        <CardContent class="p-0">
            <!-- Header: title + add dropdown -->
            <div class="flex items-center justify-between px-4 pt-3 pb-2">
                <span class="fira-code text-xs font-semibold text-muted-foreground">assets</span>
                <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                        <Button size="sm" variant="ghost" class="gap-1.5 cursor-pointer h-6 px-2 fira-code text-xs">
                            <Plus class="w-3 h-3" /> add
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="fira-code text-xs">
                        <DropdownMenuItem @click="addAsset('rectangle')">
                            <Square class="w-3.5 h-3.5 mr-2" /> Rectangle
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addAsset('circle')">
                            <Circle class="w-3.5 h-3.5 mr-2" /> Circle
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addAsset('text')">
                            <Type class="w-3.5 h-3.5 mr-2" /> Text
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addAsset('image')">
                            <Image class="w-3.5 h-3.5 mr-2" /> Image
                        </DropdownMenuItem>
                        <DropdownMenuItem @click="addAsset('svg')">
                            <Code2 class="w-3.5 h-3.5 mr-2" /> SVG
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Separator />

            <!-- Layer list (reversed for visual z-order — top = highest z) -->
            <div class="flex flex-col gap-px max-h-60 overflow-y-auto">
                <AssetLayer
                    v-for="asset in reversedAssets"
                    :key="asset.id"
                    :asset="asset"
                    :is-selected="state.selectedAssetIds.includes(asset.id)"
                    @select="selectAsset"
                    @update="updateAsset"
                    @remove="removeAsset"
                    @duplicate="duplicateAsset"
                    @drag-start="onDragStart"
                />

                <div
                    v-if="sortedAssets.length === 0"
                    class="text-center py-6 px-4 text-muted-foreground text-xs"
                >
                    <p class="fira-code">Add shapes, text, or images to compose your scene</p>
                </div>
            </div>

            <!-- Selected asset properties -->
            <template v-if="selectedAssets.length === 1">
                <Separator />
                <div class="px-4 py-3">
                    <AssetPropertiesPanel
                        :asset="selectedAssets[0]!"
                        :animation-names="animationNames"
                        @update="(id, updates) => updateAsset(id, updates)"
                        @update-transform="(id, transform) => updateTransform(id, transform)"
                    />
                </div>
            </template>

            <!-- Footer: grid snap -->
            <Separator />
            <div class="flex items-center gap-3 px-4 py-2.5">
                <label class="fira-code text-xs text-muted-foreground">grid snap</label>
                <Switch
                    :checked="state.gridSnap"
                    @update:checked="(v: boolean) => { state.gridSnap = v; }"
                />
                <Input
                    v-if="state.gridSnap"
                    type="number"
                    :model-value="state.gridSize"
                    @change="(e: Event) => { state.gridSize = Math.max(1, parseInt((e.target as HTMLInputElement).value) || 16); }"
                    class="fira-code text-xs h-6 w-14"
                />
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, readonly } from "vue";
import type { Asset, AssetKind, AssetTransform } from "./assetTypes";
import { useAssetManager } from "./useAssetManager";
import AssetLayer from "./AssetLayer.vue";
import AssetPropertiesPanel from "./AssetPropertiesPanel.vue";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import {
    Plus,
    Square,
    Circle,
    Type,
    Image,
    Code2,
} from "lucide-vue-next";

defineProps<{
    animationNames?: string[];
}>();

const {
    state,
    sortedAssets,
    selectedAssets,
    addAsset,
    removeAsset,
    updateAsset,
    updateTransform,
    selectAsset,
    duplicateAsset,
    reorderAssets,
} = useAssetManager();

const reversedAssets = computed(() => [...sortedAssets.value].reverse());

// Drag-to-reorder
let dragId: string | null = null;
let dragStartY = 0;

const onDragStart = (event: PointerEvent, id: string) => {
    dragId = id;
    dragStartY = event.clientY;
    const el = event.target as Element;
    el.setPointerCapture(event.pointerId);

    const onMove = (e: PointerEvent) => {
        if (!dragId) return;
        const deltaY = e.clientY - dragStartY;
        // Each row ~32px
        const rowDelta = Math.round(deltaY / 32);
        if (rowDelta !== 0) {
            const sorted = [...sortedAssets.value].reverse();
            const fromIdx = sorted.findIndex((a) => a.id === dragId);
            if (fromIdx === -1) return;
            const toIdx = Math.max(0, Math.min(sorted.length - 1, fromIdx + rowDelta));
            if (fromIdx !== toIdx) {
                // Convert from reversed indices to sorted indices
                const sortedLen = sorted.length;
                reorderAssets(sortedLen - 1 - fromIdx, sortedLen - 1 - toIdx);
                dragStartY = e.clientY;
            }
        }
    };

    const onUp = () => {
        dragId = null;
        el.removeEventListener("pointermove", onMove as any);
        el.removeEventListener("pointerup", onUp);
    };

    el.addEventListener("pointermove", onMove as any);
    el.addEventListener("pointerup", onUp);
};

defineExpose({
    state: readonly(state),
    sortedAssets: readonly(sortedAssets),
    selectedAssets: readonly(selectedAssets),
    addAsset,
    updateAsset,
    updateTransform,
    selectAsset,
});
</script>
