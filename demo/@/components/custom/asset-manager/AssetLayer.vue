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
                    class="icon-sm text-muted-foreground/50 cursor-grab"
                    @pointerdown.stop="emit('dragStart', $event, asset.id)"
                />

                <!-- Kind icon -->
                <component
                    :is="kindIcon"
                    class="icon-sm text-muted-foreground"
                />

                <!-- Name -->
                <EditableLabel
                    ref="editableLabelRef"
                    :model-value="asset.name"
                    class="text-mono-caption normal-case flex-1 truncate"
                    @update:model-value="(v: string) => emit('update', asset.id, { name: v })"
                />

                <!-- Visibility toggle -->
                <Button
                    variant="ghost"
                    size="icon"
                    class="shrink-0 h-auto w-auto rounded p-0.5 hover:bg-muted/80 transition-colors"
                    :aria-label="asset.visible ? 'Hide layer' : 'Show layer'"
                    @click.stop="emit('update', asset.id, { visible: !asset.visible })"
                >
                    <Eye
                        v-if="asset.visible"
                        class="icon-sm text-muted-foreground"
                    />
                    <EyeOff
                        v-else
                        class="icon-sm text-muted-foreground/40"
                    />
                </Button>

                <!-- Lock toggle -->
                <Button
                    variant="ghost"
                    size="icon"
                    class="shrink-0 h-auto w-auto rounded p-0.5 hover:bg-muted/80 transition-colors"
                    :aria-label="asset.locked ? 'Unlock layer' : 'Lock layer'"
                    @click.stop="emit('update', asset.id, { locked: !asset.locked })"
                >
                    <Lock
                        v-if="asset.locked"
                        class="icon-sm text-muted-foreground"
                    />
                    <Unlock
                        v-else
                        class="icon-sm text-muted-foreground/40"
                    />
                </Button>
            </div>
        </ContextMenuTrigger>
        <ContextMenuContent class="text-mono-caption normal-case">
            <ContextMenuItem @click="startRename">Rename</ContextMenuItem>
            <ContextMenuItem @click="emit('duplicate', asset.id)">Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem class="text-destructive" @click="emit('remove', asset.id)">Delete</ContextMenuItem>
        </ContextMenuContent>
    </ContextMenu>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
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
} from "@lucide/vue";
import {
    Button,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@mkbabb/glass-ui";
import EditableLabel from "@components/custom/EditableLabel.vue";

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

const editableLabelRef = useTemplateRef<InstanceType<typeof EditableLabel>>("editableLabelRef");

const startRename = () => {
    editableLabelRef.value?.startRename();
};
</script>
