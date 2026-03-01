<template>
    <ContextMenu>
        <ContextMenuTrigger as-child>
            <div
                :class="[
                    'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors select-none',
                    isSelected
                        ? 'bg-accent/50 border-l-2 border-primary'
                        : 'hover:bg-muted/50 border-l-2 border-transparent',
                ]"
                @click.exact="emit('select', asset.id, false)"
                @click.shift="emit('select', asset.id, true)"
            >
                <!-- Drag handle -->
                <GripVertical
                    class="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 cursor-grab"
                    @pointerdown.stop="emit('dragStart', $event, asset.id)"
                />

                <!-- Kind icon -->
                <component
                    :is="kindIcon"
                    class="w-3.5 h-3.5 text-muted-foreground shrink-0"
                />

                <!-- Name -->
                <span
                    v-if="!isRenaming"
                    class="fira-code text-xs flex-1 truncate"
                    @dblclick="startRename"
                >{{ asset.name }}</span>
                <input
                    v-else
                    ref="renameInputEl"
                    v-model="renameValue"
                    class="fira-code text-xs flex-1 bg-transparent border-b border-primary outline-none min-w-0"
                    @blur="commitRename"
                    @keydown.enter="commitRename"
                    @keydown.escape="isRenaming = false"
                    @click.stop
                />

                <!-- Visibility toggle -->
                <button
                    class="shrink-0 cursor-pointer rounded p-0.5 hover:bg-muted/80 transition-colors"
                    @click.stop="emit('update', asset.id, { visible: !asset.visible })"
                >
                    <Eye
                        v-if="asset.visible"
                        class="w-3.5 h-3.5 text-muted-foreground"
                    />
                    <EyeOff
                        v-else
                        class="w-3.5 h-3.5 text-muted-foreground/40"
                    />
                </button>

                <!-- Lock toggle -->
                <button
                    class="shrink-0 cursor-pointer rounded p-0.5 hover:bg-muted/80 transition-colors"
                    @click.stop="emit('update', asset.id, { locked: !asset.locked })"
                >
                    <Lock
                        v-if="asset.locked"
                        class="w-3.5 h-3.5 text-muted-foreground"
                    />
                    <Unlock
                        v-else
                        class="w-3.5 h-3.5 text-muted-foreground/40"
                    />
                </button>
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent class="fira-code text-xs">
            <ContextMenuItem @click="startRename">Rename</ContextMenuItem>
            <ContextMenuItem @click="emit('duplicate', asset.id)">Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem class="text-destructive" @click="emit('remove', asset.id)">Delete</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import type { Asset, AssetKind } from "./assetTypes";
import {
    GripVertical,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Square,
    Circle,
    Type,
    Image,
    Code2,
} from "lucide-vue-next";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@components/ui/context-menu";

const props = defineProps<{
    asset: Asset;
    isSelected: boolean;
}>();

const emit = defineEmits<{
    (e: "select", id: string, additive: boolean): void;
    (e: "update", id: string, updates: Partial<Asset>): void;
    (e: "remove", id: string): void;
    (e: "duplicate", id: string): void;
    (e: "dragStart", event: PointerEvent, id: string): void;
}>();

const ICON_MAP: Record<AssetKind, any> = {
    rectangle: Square,
    circle: Circle,
    text: Type,
    image: Image,
    svg: Code2,
};

const kindIcon = computed(() => ICON_MAP[props.asset.kind]);

const isRenaming = ref(false);
const renameValue = ref("");
const renameInputEl = useTemplateRef<HTMLInputElement>("renameInputEl");

const startRename = () => {
    renameValue.value = props.asset.name;
    isRenaming.value = true;
    nextTick(() => renameInputEl.value?.select());
};

const commitRename = () => {
    if (isRenaming.value && renameValue.value.trim()) {
        emit("update", props.asset.id, { name: renameValue.value.trim() });
    }
    isRenaming.value = false;
};
</script>
