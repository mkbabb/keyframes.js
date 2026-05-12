<template>
    <div>
        <p class="text-sm text-muted-foreground">
            Press
            <kbd
                class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-2xs font-medium text-muted-foreground opacity-100"
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
                    :value="anim.name ?? ''"
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
import { useMagicKeys } from "@vueuse/core";

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@mkbabb/glass-ui";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";

import { Animation } from "@src/animation";

const { isDark } = useGlobalDark();

const { animations, superKey } = defineProps<{
    animations: Animation<any>[];
    superKey: string;
}>();

const open = ref(false);

const keys = useMagicKeys();
const cmdK = keys["Cmd+K"];

function toggleOpen() {
    open.value = !open.value;
}

watch(cmdK, (pressed) => {
    if (pressed) toggleOpen();
});

function handleSelectControl(control: string) {
    toggleOpen();
}

function handleToggleDarkMode() {
    toggleOpen();
}

function handleSelectAnimation(animation: Animation<any>) {
    toggleOpen();
}
</script>
