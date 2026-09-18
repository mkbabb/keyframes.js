<template>
    <Dialog v-model:open="open">
        <DialogContent class="max-w-md">
            <DialogHeader>
                <!-- KSM R-6 — the title was DEMOTED below the shipped default
                     (`text-body` over DialogTitle's own `text-subheading`), the
                     sole downward outlier of three sibling dialogs, while the
                     group headings under it were fixed at 10px: the hierarchy
                     ran upside down and widened with the viewport. The title
                     takes the primitive's register as shipped (root-styling
                     law: no per-instance override), and with the override gone
                     the leading/tracking utilities the `cn` merge could not
                     group no longer compete with it. -->
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <DialogDescription class="text-small text-muted-foreground">
                    Press <kbd class="kbd">?</kbd> to toggle this panel
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4 max-h-[var(--panel-max-h)] overflow-y-auto pr-1">
                <div v-for="[group, items] in groupedShortcuts" :key="group">
                    <!-- KSM R-7 — a group HEADING is a UI label, not data: the
                         demo's own Mono-as-data law (DESIGN.md) and its in-tree
                         kill-shot (`.status-badge`, design-idioms.css — "a status
                         WORD is a UI label, not data") rule the mono chip register
                         out of an `<h3>`. W6-G role (d): the TEXT face at the rows'
                         rung, semibold and muted — the heading leads its rows by
                         weight, sits under the title by rung, and the hierarchy
                         reads top-down again. -->
                    <h3 class="text-small font-semibold text-muted-foreground mb-2">
                        {{ group }}
                    </h3>
                    <div class="grid gap-1">
                        <div
                            v-for="shortcut in items"
                            :key="shortcut.raw"
                            class="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors"
                        >
                            <span class="text-small text-foreground">
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
} from "@mkbabb/glass-ui/keyboard";

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
