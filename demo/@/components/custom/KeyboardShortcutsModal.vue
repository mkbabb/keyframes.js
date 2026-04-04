<template>
    <Dialog v-model:open="open">
        <DialogContent class="max-w-md backdrop-blur-sm">
            <DialogHeader>
                <DialogTitle class="font-mono text-base">Keyboard Shortcuts</DialogTitle>
                <DialogDescription class="font-mono text-xs text-muted-foreground">
                    Press <kbd class="kbd">?</kbd> to toggle this panel
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 max-h-[60vh] overflow-y-auto pr-1">
                <div v-for="[group, items] in groupedShortcuts" :key="group">
                    <h3 class="font-mono text-xs font-semibold text-muted-foreground mb-2">
                        {{ group }}
                    </h3>
                    <div class="grid gap-1">
                        <div
                            v-for="shortcut in items"
                            :key="shortcut.raw"
                            class="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                            <span class="font-mono text-xs text-foreground">
                                {{ shortcut.options.label }}
                            </span>
                            <div class="flex gap-0.5">
                                <kbd
                                    v-for="(part, i) in formatComboParts(shortcut.raw)"
                                    :key="i"
                                    class="kbd"
                                >{{ part }}</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@mkbabb/glass-ui";
import {
    useRegisteredShortcuts,
    formatComboParts,
} from "@mkbabb/glass-ui";

const open = defineModel<boolean>('open', { required: true });

const shortcuts = useRegisteredShortcuts();

const groupedShortcuts = computed(() => {
    const groups = new Map<string, typeof shortcuts.value>();

    for (const s of shortcuts.value) {
        const group = s.options.group ?? "General";
        if (!groups.has(group)) groups.set(group, []);
        groups.get(group)!.push(s);
    }

    return groups;
});

</script>
