<template>
    <div
        ref="viewportEl"
        class="absolute inset-0 z-dock pointer-events-none overflow-hidden"
        @pointerdown.self="deselectAll"
    >
        <!-- Empty state — shown when the viewport has no assets -->
        <div
            v-if="sortedAssets.length === 0"
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <Card class="pointer-events-auto glass-card max-w-sm mx-6">
                <CardContent class="flex flex-col items-center gap-3 px-8 py-7 text-center">
                    <Shapes class="size-8 text-muted-foreground" />
                    <p class="text-heading text-foreground">
                        Compose a scene
                    </p>
                    <p class="text-mono-caption normal-case text-muted-foreground">
                        Add a shape, text, or image — then bind it to an animation
                        from the Assets panel.
                    </p>
                    <Button
                        size="sm"
                        variant="outline"
                        class="gap-1.5 text-mono-caption normal-case mt-1"
                        @click="emit('add', 'rectangle')"
                    >
                        <Plus class="icon-sm" /> Add a shape
                    </Button>
                </CardContent>
            </Card>
        </div>

        <!-- Rendered assets -->
        <div
            v-for="asset in sortedAssets"
            :key="asset.id"
            :ref="(el) => { if (el) assetElMap[asset.id] = el as HTMLElement; }"
            v-show="asset.visible"
            :class="[
                'absolute pointer-events-auto cursor-move select-none',
                asset.locked ? 'pointer-events-none opacity-70' : '',
            ]"
            :style="assetStyle(asset)"
            @pointerdown.stop="onAssetPointerDown($event, asset)"
        >
            <!-- Content by kind -->
            <template v-if="asset.kind === 'text'">
                <span
                    :style="{
                        fontSize: `${asset.fontSize ?? 32}px`,
                        fontFamily: asset.fontFamily ?? 'var(--font-display)',
                        color: asset.color ?? 'var(--foreground)',
                    }"
                    class="block w-full h-full flex items-center justify-center whitespace-nowrap"
                >{{ asset.text ?? "Text" }}</span>
            </template>
            <template v-else-if="asset.kind === 'image' && asset.imageSrc">
                <img
                    :src="asset.imageSrc"
                    :alt="asset.name"
                    class="w-full h-full object-cover"
                    draggable="false"
                />
            </template>
            <template v-else-if="asset.kind === 'svg' && asset.svgContent">
                <div class="w-full h-full" v-html="sanitizeSVG(asset.svgContent)"></div>
            </template>
            <!-- rectangle / circle: styled purely via the wrapper div -->

            <!-- Transform handles (selected only) -->
            <template v-if="isSelected(asset.id) && !asset.locked">
                <!-- Resize handles -->
                <div
                    v-for="handle in RESIZE_HANDLES"
                    :key="handle.type"
                    :class="[
                        'absolute w-2.5 h-2.5 bg-background border-2 border-primary rounded-sm z-bar',
                        handle.cursor,
                    ]"
                    :style="handle.style"
                    @pointerdown.stop="onHandlePointerDown($event, asset.id, handle.type)"
                ></div>

                <!-- Rotation handle -->
                <div
                    class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-bar"
                >
                    <div
                        class="w-3.5 h-3.5 rounded-full bg-background border-2 border-primary cursor-grab"
                        @pointerdown.stop="onHandlePointerDown($event, asset.id, 'rotate')"
                    ></div>
                    <div class="w-px h-4 bg-primary/50"></div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { readonly, shallowReactive, useTemplateRef } from "vue";
import { Button, Card, CardContent } from "@mkbabb/glass-ui";
import { Plus, Shapes } from "@lucide/vue";
import { useDragCapture } from "@components/custom/animation-controls/controls/composables/useDragCapture";
import type { Asset, AssetKind, AssetTransform, HandleType } from "./assetTypes";

const props = defineProps<{
    sortedAssets: Asset[];
    selectedAssetIds: string[];
    gridSnap: boolean;
    gridSize: number;
}>();

const emit = defineEmits<{
    (e: "select", id: string, additive: boolean): void;
    (e: "deselectAll"): void;
    (e: "updateTransform", id: string, transform: Partial<AssetTransform>): void;
    (e: "add", kind: AssetKind): void;
}>();

const viewportEl = useTemplateRef<HTMLElement>("viewportEl");
const assetElMap: Record<string, HTMLElement> = shallowReactive({});

const INSET = "var(--resize-handle-inset)";
const RESIZE_HANDLES: { type: HandleType; style: Record<string, string>; cursor: string }[] = [
    { type: "tl", style: { top: INSET, left: INSET }, cursor: "cursor-nwse-resize" },
    { type: "tr", style: { top: INSET, right: INSET }, cursor: "cursor-nesw-resize" },
    { type: "bl", style: { bottom: INSET, left: INSET }, cursor: "cursor-nesw-resize" },
    { type: "br", style: { bottom: INSET, right: INSET }, cursor: "cursor-nwse-resize" },
    { type: "t", style: { top: INSET, left: "50%", transform: "translateX(-50%)" }, cursor: "cursor-ns-resize" },
    { type: "b", style: { bottom: INSET, left: "50%", transform: "translateX(-50%)" }, cursor: "cursor-ns-resize" },
    { type: "l", style: { top: "50%", left: INSET, transform: "translateY(-50%)" }, cursor: "cursor-ew-resize" },
    { type: "r", style: { top: "50%", right: INSET, transform: "translateY(-50%)" }, cursor: "cursor-ew-resize" },
];

const isSelected = (id: string) => props.selectedAssetIds.includes(id);

const assetStyle = (asset: Asset) => {
    const t = asset.transform;
    return {
        left: `${t.x}px`,
        top: `${t.y}px`,
        width: `${t.width}px`,
        height: `${t.height}px`,
        transform: `rotate(${t.rotation}deg) scaleX(${t.scaleX}) scaleY(${t.scaleY})`,
        backgroundColor: asset.kind !== "text" && asset.kind !== "svg"
            ? (asset.backgroundColor ?? "transparent")
            : "transparent",
        borderRadius: asset.borderRadius != null ? `${asset.borderRadius}px` : undefined,
        outline: isSelected(asset.id) ? "2px solid var(--primary)" : undefined,
        outlineOffset: "2px",
    };
};

const sanitizeSVG = (svg: string): string => {
    // Strip script tags for basic XSS prevention
    return svg.replace(/<script[\s\S]*?<\/script>/gi, "");
};

const snapValue = (val: number): number => {
    if (!props.gridSnap) return val;
    return Math.round(val / props.gridSize) * props.gridSize;
};

const deselectAll = () => emit("deselectAll");

// --- Asset dragging ---
let moveStartX = 0;
let moveStartY = 0;
let moveAssetId = "";
let moveStartTransform: AssetTransform | null = null;
let moveSelectedIds: string[] = [];

const { onPointerDown: onAssetDrag } = useDragCapture({
    onMove: (e) => {
        if (!moveStartTransform) return;
        const dx = e.clientX - moveStartX;
        const dy = e.clientY - moveStartY;

        for (const id of moveSelectedIds) {
            const a = props.sortedAssets.find((a) => a.id === id);
            if (!a || a.locked) continue;

            if (id === moveAssetId) {
                emit("updateTransform", id, {
                    x: snapValue(moveStartTransform.x + dx),
                    y: snapValue(moveStartTransform.y + dy),
                });
            } else {
                emit("updateTransform", id, {
                    x: snapValue(a.transform.x + dx),
                    y: snapValue(a.transform.y + dy),
                });
            }
        }
    },
});

const onAssetPointerDown = (event: PointerEvent, asset: Asset) => {
    if (asset.locked) return;

    const additive = event.shiftKey;
    emit("select", asset.id, additive);

    moveStartX = event.clientX;
    moveStartY = event.clientY;
    moveAssetId = asset.id;
    moveStartTransform = { ...asset.transform };
    // For multi-select drag, capture all selected transforms
    moveSelectedIds = additive ? props.selectedAssetIds : [asset.id];

    onAssetDrag(event);
};

// --- Handle dragging (resize / rotate) ---
let handleStartX = 0;
let handleStartY = 0;
let handleAssetId = "";
let handleType: HandleType | null = null;
let handleStartT: AssetTransform | null = null;

const { onPointerDown: onHandleDrag } = useDragCapture({
    onMove: (e) => {
        if (!handleStartT || !handleType) return;
        const dx = e.clientX - handleStartX;
        const dy = e.clientY - handleStartY;

        if (handleType === "rotate") {
            // Compute angle from center of asset to pointer
            const centerX = handleStartT.x + handleStartT.width / 2;
            const centerY = handleStartT.y + handleStartT.height / 2;
            const vpRect = viewportEl.value?.getBoundingClientRect();
            const px = e.clientX - (vpRect?.left ?? 0);
            const py = e.clientY - (vpRect?.top ?? 0);
            const angle = Math.atan2(py - centerY, px - centerX) * (180 / Math.PI) + 90;
            emit("updateTransform", handleAssetId, { rotation: Math.round(angle) });
            return;
        }

        const update: Partial<AssetTransform> = {};

        // Resize logic
        if (handleType.includes("r")) {
            update.width = Math.max(16, snapValue(handleStartT.width + dx));
        }
        if (handleType.includes("l")) {
            const newW = Math.max(16, snapValue(handleStartT.width - dx));
            update.width = newW;
            update.x = snapValue(handleStartT.x + (handleStartT.width - newW));
        }
        if (handleType.includes("b")) {
            update.height = Math.max(16, snapValue(handleStartT.height + dy));
        }
        if (handleType.includes("t") && handleType !== "rotate") {
            const newH = Math.max(16, snapValue(handleStartT.height - dy));
            update.height = newH;
            update.y = snapValue(handleStartT.y + (handleStartT.height - newH));
        }

        emit("updateTransform", handleAssetId, update);
    },
});

const onHandlePointerDown = (event: PointerEvent, assetId: string, type: HandleType) => {
    const asset = props.sortedAssets.find((a) => a.id === assetId);
    if (!asset) return;

    handleStartX = event.clientX;
    handleStartY = event.clientY;
    handleAssetId = assetId;
    handleType = type;
    handleStartT = { ...asset.transform };

    onHandleDrag(event);
};

defineExpose({ assetElMap: readonly(assetElMap) });
</script>
