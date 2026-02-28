<template>
    <div class="grid gap-2">
        <span class="fira-code text-xs font-semibold text-muted-foreground">properties</span>

        <!-- Name -->
        <div class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1.5">
                <label class="fira-code text-[10px] text-muted-foreground">name</label>
                <Input
                    :model-value="asset.name"
                    class="fira-code text-xs h-6"
                    @change="(e: Event) => emit('update', asset.id, { name: (e.target as HTMLInputElement).value })"
                />

                <!-- Position -->
                <label class="fira-code text-[10px] text-muted-foreground">x</label>
                <Input
                    type="number"
                    :model-value="asset.transform.x"
                    class="fira-code text-xs h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { x: parseFloat((e.target as HTMLInputElement).value) || 0 })"
                />

                <label class="fira-code text-[10px] text-muted-foreground">y</label>
                <Input
                    type="number"
                    :model-value="asset.transform.y"
                    class="fira-code text-xs h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { y: parseFloat((e.target as HTMLInputElement).value) || 0 })"
                />

                <!-- Size -->
                <label class="fira-code text-[10px] text-muted-foreground">width</label>
                <Input
                    type="number"
                    :model-value="asset.transform.width"
                    class="fira-code text-xs h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { width: Math.max(1, parseFloat((e.target as HTMLInputElement).value) || 0) })"
                />

                <label class="fira-code text-[10px] text-muted-foreground">height</label>
                <Input
                    type="number"
                    :model-value="asset.transform.height"
                    class="fira-code text-xs h-6"
                    @change="(e: Event) => emit('updateTransform', asset.id, { height: Math.max(1, parseFloat((e.target as HTMLInputElement).value) || 0) })"
                />

                <!-- Rotation -->
                <label class="fira-code text-[10px] text-muted-foreground">rotation</label>
                <div class="flex items-center gap-2">
                    <Slider
                        class="flex-1"
                        :min="0"
                        :max="360"
                        :step="1"
                        :model-value="[asset.transform.rotation]"
                        @update:model-value="(v: any) => emit('updateTransform', asset.id, { rotation: v[0] })"
                    />
                    <span class="fira-code text-[10px] text-muted-foreground w-8 text-right">{{ Math.round(asset.transform.rotation) }}°</span>
                </div>

                <!-- Kind-specific properties -->
                <template v-if="asset.kind !== 'text' && asset.kind !== 'svg'">
                    <label class="fira-code text-[10px] text-muted-foreground">bg color</label>
                    <Input
                        :model-value="asset.backgroundColor ?? ''"
                        class="fira-code text-xs h-6"
                        @change="(e: Event) => emit('update', asset.id, { backgroundColor: (e.target as HTMLInputElement).value })"
                    />
                </template>

                <template v-if="asset.kind === 'rectangle' || asset.kind === 'circle'">
                    <label class="fira-code text-[10px] text-muted-foreground">radius</label>
                    <Input
                        type="number"
                        :model-value="asset.borderRadius ?? 0"
                        class="fira-code text-xs h-6"
                        @change="(e: Event) => emit('update', asset.id, { borderRadius: parseFloat((e.target as HTMLInputElement).value) || 0 })"
                    />
                </template>

                <template v-if="asset.kind === 'text'">
                    <label class="fira-code text-[10px] text-muted-foreground">text</label>
                    <Input
                        :model-value="asset.text ?? ''"
                        class="fira-code text-xs h-6"
                        @change="(e: Event) => emit('update', asset.id, { text: (e.target as HTMLInputElement).value })"
                    />

                    <label class="fira-code text-[10px] text-muted-foreground">font size</label>
                    <Input
                        type="number"
                        :model-value="asset.fontSize ?? 32"
                        class="fira-code text-xs h-6"
                        @change="(e: Event) => emit('update', asset.id, { fontSize: parseFloat((e.target as HTMLInputElement).value) || 32 })"
                    />

                    <label class="fira-code text-[10px] text-muted-foreground">font</label>
                    <Input
                        :model-value="asset.fontFamily ?? 'Fraunces'"
                        class="fira-code text-xs h-6"
                        @change="(e: Event) => emit('update', asset.id, { fontFamily: (e.target as HTMLInputElement).value })"
                    />

                    <label class="fira-code text-[10px] text-muted-foreground">color</label>
                    <Input
                        :model-value="asset.color ?? '#1e293b'"
                        class="fira-code text-xs h-6"
                        @change="(e: Event) => emit('update', asset.id, { color: (e.target as HTMLInputElement).value })"
                    />
                </template>

                <!-- Animation binding -->
                <template v-if="animationNames && animationNames.length > 0">
                    <label class="fira-code text-[10px] text-muted-foreground">animation</label>
                    <Select
                        :model-value="asset.animationName ?? '__none__'"
                        @update:model-value="(v: any) => emit('update', asset.id, { animationName: v === '__none__' ? undefined : v })"
                    >
                        <SelectTrigger class="fira-code text-xs h-6">
                            <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup class="fira-code text-xs">
                                <SelectItem value="__none__">None</SelectItem>
                                <SelectItem v-for="name in animationNames" :key="name" :value="name">
                                    {{ name }}
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Asset, AssetTransform } from "./assetTypes";
import { Input } from "@components/ui/input";
import { Slider } from "@components/ui/slider";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

defineProps<{
    asset: Asset;
    animationNames?: string[];
}>();

const emit = defineEmits<{
    (e: "update", id: string, updates: Partial<Asset>): void;
    (e: "updateTransform", id: string, transform: Partial<AssetTransform>): void;
}>();
</script>
