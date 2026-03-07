<template>
    <Dialog :open="open" @update:open="$emit('update:open', $event)">
        <DialogContent class="max-w-md backdrop-blur-sm">
            <DialogHeader>
                <DialogTitle class="fira-code text-base">Keyboard Shortcuts</DialogTitle>
                <DialogDescription class="fira-code text-xs text-muted-foreground">
                    Press <kbd class="kbd">?</kbd> to toggle this panel
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 max-h-[60vh] overflow-y-auto pr-1">
                <div v-for="[group, items] in groupedShortcuts" :key="group">
                    <h3 class="fira-code text-xs font-semibold text-muted-foreground mb-2">
                        {{ group }}
                    </h3>
                    <div class="grid gap-1">
                        <div
                            v-for="shortcut in items"
                            :key="shortcut.raw"
                            class="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                            <span class="fira-code text-xs text-foreground">
                                {{ shortcut.options.label }}
                            </span>
                            <div class="flex gap-0.5">
                                <kbd
                                    v-for="(part, i) in formatParts(shortcut.raw)"
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
} from "@components/ui/dialog";
import {
    useRegisteredShortcuts,
    formatCombo,
    isMac,
} from "@composables/useKeyboardShortcuts";

defineProps<{ open: boolean }>();
defineEmits<{ (e: "update:open", value: boolean): void }>();

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

function formatParts(raw: string): string[] {
    return raw.split("+").map((p) => {
        const lower = p.trim().toLowerCase();
        if (lower === "mod") return isMac ? "\u2318" : "Ctrl";
        if (lower === "shift") return isMac ? "\u21E7" : "Shift";
        if (lower === "alt" || lower === "option") return isMac ? "\u2325" : "Alt";
        if (lower === "ctrl" || lower === "control") return isMac ? "\u2303" : "Ctrl";
        if (lower === "meta" || lower === "cmd") return "\u2318";
        if (lower === "space") return "\u2423";
        if (lower === "arrowleft") return "\u2190";
        if (lower === "arrowright") return "\u2192";
        if (lower === "arrowup") return "\u2191";
        if (lower === "arrowdown") return "\u2193";
        if (lower === "delete") return isMac ? "\u232B" : "Del";
        if (lower === "escape") return "Esc";
        if (lower === "enter") return "\u23CE";
        if (lower === "home") return "Home";
        if (lower === "end") return "End";
        return p.trim();
    });
}
</script>

<style scoped>
.kbd {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    height: 1.5rem;
    padding: 0 0.35rem;
    font-family: "Fira Code", monospace;
    font-size: 0.65rem;
    font-weight: 500;
    line-height: 1;
    color: hsl(var(--foreground));
    background: hsl(var(--muted));
    border: 1px solid hsl(var(--border));
    border-radius: 0.25rem;
    box-shadow: 0 1px 0 1px hsl(var(--border) / 0.3);
}
</style>
