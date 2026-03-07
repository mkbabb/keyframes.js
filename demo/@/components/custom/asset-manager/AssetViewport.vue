<template>
    <div
        ref="viewportEl"
        class="absolute inset-0 z-40 pointer-events-none overflow-hidden"
        @pointerdown.self="deselectAll"
    >
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
                        fontFamily: asset.fontFamily ?? 'Fraunces',
                        color: asset.color ?? '#1e293b',
                    }"
                    class="block w-full h-full flex items-center justify-center whitespace-nowrap"
                >{{ asset.text ?? "Text" }}</span>
            </template>
            <template v-else-if="asset.kind === 'image' && asset.imageSrc">
                <img
                    :src="asset.imageSrc"
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
                        'absolute w-2.5 h-2.5 bg-background border-2 border-primary rounded-sm z-30',
                        handle.cursor,
                    ]"
                    :style="handle.style"
                    @pointerdown.stop="onHandlePointerDown($event, asset.id, handle.type)"
                ></div>

                <!-- Rotation handle -->
                <div
                    class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30"
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
import type { Asset, AssetTransform, HandleType } from "./assetTypes";

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
}>();

const viewportEl = useTemplateRef<HTMLElement>("viewportEl");
const assetElMap: Record<string, HTMLElement> = shallowReactive({});

const RESIZE_HANDLES: { type: HandleType; style: Record<string, string>; cursor: string }[] = [
    { type: "tl", style: { top: "-4px", left: "-4px" }, cursor: "cursor-nwse-resize" },
    { type: "tr", style: { top: "-4px", right: "-4px" }, cursor: "cursor-nesw-resize" },
    { type: "bl", style: { bottom: "-4px", left: "-4px" }, cursor: "cursor-nesw-resize" },
    { type: "br", style: { bottom: "-4px", right: "-4px" }, cursor: "cursor-nwse-resize" },
    { type: "t", style: { top: "-4px", left: "50%", transform: "translateX(-50%)" }, cursor: "cursor-ns-resize" },
    { type: "b", style: { bottom: "-4px", left: "50%", transform: "translateX(-50%)" }, cursor: "cursor-ns-resize" },
    { type: "l", style: { top: "50%", left: "-4px", transform: "translateY(-50%)" }, cursor: "cursor-ew-resize" },
    { type: "r", style: { top: "50%", right: "-4px", transform: "translateY(-50%)" }, cursor: "cursor-ew-resize" },
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
        outline: isSelected(asset.id) ? "2px solid hsl(var(--primary))" : undefined,
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
const onAssetPointerDown = (event: PointerEvent, asset: Asset) => {
    if (asset.locked) return;

    const additive = event.shiftKey;
    emit("select", asset.id, additive);

    const el = event.currentTarget as Element;
    el.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startTransform = { ...asset.transform };

    // For multi-select drag, capture all selected transforms
    const selectedIds = additive
        ? props.selectedAssetIds
        : [asset.id];

    const onMove = (e: PointerEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        for (const id of selectedIds) {
            const a = props.sortedAssets.find((a) => a.id === id);
            if (!a || a.locked) continue;

            if (id === asset.id) {
                emit("updateTransform", id, {
                    x: snapValue(startTransform.x + dx),
                    y: snapValue(startTransform.y + dy),
                });
            } else {
                emit("updateTransform", id, {
                    x: snapValue(a.transform.x + dx),
                    y: snapValue(a.transform.y + dy),
                });
            }
        }
    };

    const onUp = () => {
        el.removeEventListener("pointermove", onMove as any);
        el.removeEventListener("pointerup", onUp);
    };

    el.addEventListener("pointermove", onMove as any);
    el.addEventListener("pointerup", onUp);
};

// --- Handle dragging (resize / rotate) ---
const onHandlePointerDown = (event: PointerEvent, assetId: string, handleType: HandleType) => {
    const asset = props.sortedAssets.find((a) => a.id === assetId);
    if (!asset) return;

    const el = event.target as Element;
    el.setPointerCapture(event.pointerId);

    const startX = event.clientX;
    const startY = event.clientY;
    const startT = { ...asset.transform };

    const onMove = (e: PointerEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (handleType === "rotate") {
            // Compute angle from center of asset to pointer
            const centerX = startT.x + startT.width / 2;
            const centerY = startT.y + startT.height / 2;
            const vpRect = viewportEl.value?.getBoundingClientRect();
            const px = e.clientX - (vpRect?.left ?? 0);
            const py = e.clientY - (vpRect?.top ?? 0);
            const angle = Math.atan2(py - centerY, px - centerX) * (180 / Math.PI) + 90;
            emit("updateTransform", assetId, { rotation: Math.round(angle) });
            return;
        }

        const update: Partial<AssetTransform> = {};

        // Resize logic
        if (handleType.includes("r")) {
            update.width = Math.max(16, snapValue(startT.width + dx));
        }
        if (handleType.includes("l")) {
            const newW = Math.max(16, snapValue(startT.width - dx));
            update.width = newW;
            update.x = snapValue(startT.x + (startT.width - newW));
        }
        if (handleType.includes("b")) {
            update.height = Math.max(16, snapValue(startT.height + dy));
        }
        if (handleType.includes("t") && handleType !== "rotate") {
            const newH = Math.max(16, snapValue(startT.height - dy));
            update.height = newH;
            update.y = snapValue(startT.y + (startT.height - newH));
        }

        emit("updateTransform", assetId, update);
    };

    const onUp = () => {
        el.removeEventListener("pointermove", onMove as any);
        el.removeEventListener("pointerup", onUp);
    };

    el.addEventListener("pointermove", onMove as any);
    el.addEventListener("pointerup", onUp);
};

defineExpose({ assetElMap: readonly(assetElMap) });
</script>
