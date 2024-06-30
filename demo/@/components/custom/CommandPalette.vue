<template>
    <div>
        <p class="text-sm text-muted-foreground">
            Press
            <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
            >
                <span class="text-xs">⌘</span>K
            </kbd>
        </p>

        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Controls">
                <CommandItem
                    v-for="control in ['keyframes', 'controls']"
                    :key="control"
                    :value="control"
                    @select="() => handleSelectControl(control)"
                >
                    Change to {{ control }}
                </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Animations">
                <CommandItem
                    v-for="anim in animations"
                    :key="anim.name"
                    :value="anim.name"
                    @select="() => handleSelectAnimation(anim)"
                >
                    Change to {{ anim.name }}
                </CommandItem>
            </CommandGroup>

            <CommandSeparator />

            <CommandSeparator />

            <CommandGroup heading="Theme">
                <CommandItem
                    key="toggle-dark-mode"
                    value="toggle-dark-mode"
                    @select="handleToggleDarkMode"
                >
                    Toggle {{ isDark ? "light" : "dark" }} mode
                </CommandItem>
            </CommandGroup>
        </CommandList>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useMagicKeys, useStorage } from "@vueuse/core";

import { Dialog } from "@components/ui/dialog/";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@components/ui/command";

// import { getStoredAnimationGroupControlOptions } from "./animationStores";

import { Animation } from "@src/animation";

// import { changeTheme } from "../dark-mode-toggle";

import { useDark } from "@vueuse/core";

const isDark = useDark({ disableTransition: false });

// Props and emits
const { animations, superKey } = defineProps<{
    animations: Animation<any>[];
    superKey: string;
}>();

// const storedControls = getStoredAnimationGroupControlOptions(superKey);

// Command palette state
const open = ref(false);

// Theme

// Keyboard shortcut
const keys = useMagicKeys();
const cmdK = keys["Cmd+K"];

// Open/close command palette
function toggleOpen() {
    open.value = !open.value;
}

// Watch for keyboard shortcut
watch(cmdK, (pressed) => {
    if (pressed) toggleOpen();
});

// Command handlers
function handleSelectControl(control: string) {
    // storedControls.selectedControl = control;
    toggleOpen();
}

function handleToggleDarkMode() {
    // changeTheme();
    toggleOpen();
}

function handleSelectAnimation(animation: Animation<any>) {
    // storedControls.selectedAnimation = animation.name;
    toggleOpen();
}
</script>
