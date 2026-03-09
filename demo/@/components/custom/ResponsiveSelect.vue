<template>
    <template v-if="!isMobile">
        <!-- Desktop: normal Select -->
        <Select
            :model-value="modelValue"
            :open="open"
            @update:open="(v: boolean) => emit('update:open', v)"
            @update:model-value="(v: any) => emit('update:modelValue', v)"
        >
            <SelectTrigger :class="triggerClass">
                <slot name="trigger" :value="modelValue">
                    <SelectValue />
                </slot>
            </SelectTrigger>
            <SelectContent :class="contentClass">
                <SelectGroup :class="groupClass">
                    <SelectItem
                        v-for="item in items"
                        :key="item.value"
                        :value="item.value"
                    >
                        <slot
                            name="item"
                            :item="item"
                            :selected="item.value === modelValue"
                        >
                            {{ item.label ?? item.value }}
                        </slot>
                        <template #extra>
                            <slot
                                name="item-extra"
                                :item="item"
                                :selected="item.value === modelValue"
                            />
                        </template>
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </template>
    <template v-else>
        <!-- Mobile: Drawer -->
        <Drawer v-model:open="drawerOpen">
            <button
                @click="drawerOpen = true"
                :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none',
                    triggerClass,
                ]"
            >
                <slot name="trigger" :value="modelValue">
                    {{ modelValue }}
                </slot>
                <ChevronDown class="w-4 h-4 shrink-0 opacity-50" />
            </button>
            <DrawerContent>
                <DrawerHeader v-if="title">
                    <DrawerTitle class="instrument-serif text-xl">{{ title }}</DrawerTitle>
                </DrawerHeader>
                <div :class="['max-h-[60dvh] overflow-y-auto px-4 py-4', groupClass]">
                    <div
                        v-for="item in items"
                        :key="item.value"
                        @click="
                            () => {
                                emit('update:modelValue', item.value);
                                drawerOpen = false;
                            }
                        "
                        :class="[
                            'flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors',
                            item.value === modelValue
                                ? 'bg-accent text-accent-foreground font-semibold'
                                : 'hover:bg-muted',
                        ]"
                    >
                        <slot
                            name="item"
                            :item="item"
                            :selected="item.value === modelValue"
                        >
                            {{ item.label ?? item.value }}
                        </slot>
                        <slot
                            name="item-extra"
                            :item="item"
                            :selected="item.value === modelValue"
                        />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    </template>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { ChevronDown } from "lucide-vue-next";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select";

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@components/ui/drawer";

export interface ResponsiveSelectItem {
    value: string;
    label?: string;
}

const props = defineProps<{
    modelValue: string;
    items: ResponsiveSelectItem[];
    class?: string;
    triggerClass?: string;
    contentClass?: string;
    groupClass?: string;
    title?: string;
    open?: boolean;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "update:open", value: boolean): void;
}>();

const isMobile = useMediaQuery("(max-width: 1023px)");
const drawerOpen = ref(false);
</script>
