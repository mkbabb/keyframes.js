<template>
    <ContextMenu>
        <ContextMenuTrigger as-child>
            <div
                :class="[
                    'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors select-none',
                    isSelected
                        ? 'bg-accent/50 border-l-2 border-[var(--color-progress)]'
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

                <!-- L.W11 S9 — the BOUND-PRESET chip. When a layer is alive (an
                     animationName is bound), a 1-em crayon swatch codes the
                     authorship CHOICE (the preset family, from the owned
                     --rainbow-* ramp) beside a mono caption of the preset name.
                     The crayon is the SEASONING (authorship signal), in proportion
                     — never a chip wash. Inert layers stay quiet. This closes the
                     "which shapes are alive" gap in the very list meant to manage
                     them. -->
                <span
                    v-if="asset.animationName"
                    class="layer-preset-chip text-mono-caption normal-case text-muted-foreground shrink-0 flex items-center gap-1"
                    :title="`bound: ${asset.animationName}`"
                >
                    <span
                        class="layer-preset-swatch"
                        :style="{ '--swatch': presetHue(asset.animationName) }"
                        aria-hidden="true"
                    ></span>
                    <span class="truncate max-w-[5.5rem]">{{ asset.animationName }}</span>
                </span>

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
import EditableLabel from "./EditableLabel.vue";

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

// L.W11 S9 — code the bound preset's swatch from the owned --rainbow-* family
// (authorship CHOICE as a deft crayon accent). A small, stable per-preset map;
// any unmapped name falls back to the system red (--color-progress), so the
// swatch is always meaningful and never a chip wash.
const PRESET_HUE: Record<string, string> = {
    bounce: "var(--rainbow-orange)",
    "fade-in": "var(--rainbow-blue)",
    pulse: "var(--rainbow-violet)",
    "rotate-scale": "var(--rainbow-cyan)",
    shake: "var(--rainbow-yellow)",
};
const presetHue = (name: string): string =>
    PRESET_HUE[name] ?? "var(--color-progress)";

const editableLabelRef = useTemplateRef<InstanceType<typeof EditableLabel>>("editableLabelRef");

const startRename = () => {
    editableLabelRef.value?.startRename();
};
</script>

<style scoped>
/* L.W11 S9 — the 1-em bound-preset swatch (crayon as authorship signal). A small
   filled dot in the bound preset's --rainbow-* hue (the seasoning beside the red
   system colour), with a soft ring so it reads as a lit indicator, not a bullet. */
.layer-preset-swatch {
    width: 1em;
    height: 1em;
    border-radius: var(--radius-pill, 999px);
    background: var(--swatch, var(--color-progress));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--swatch, var(--color-progress)) 30%, transparent);
    flex: none;
}
</style>
