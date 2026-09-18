<template>
    <Dialog v-model:open="open">
        <!-- KSM R-2 / R-3 / R-4 / R-22 (W6-I) — THE ONE FadingScroll DECISION
             (§Sequencing 8), authored on the demo's OWN two-axis adoption at
             `EasingTarget.vue` (`axis="x"` for the family filter, `axis="y"`
             for the specimen drawer, the real `./fading-scroll` subpath): this
             register decides how to EXTEND that shipped adoption, and it
             extends it here, to the third mount. Composition, in two halves
             that each own exactly one thing:
             · `scroll` on `DialogContent` — the CONTENT is the viewport-bound
               owner (the primitive emits `max-h-[calc(100dvh-2rem)]
               overflow-y-auto` on the floating form), so a short viewport
               never clips the title or the close;
             · `FadingScroll axis="y"` around the list — the LIST is the
               scroll port with the producer's fade masks at both ends, bounded
               by the demo's own `--panel-max-h` (layout.css) so the dialog's
               height is the list's, not the viewport's, on a tall screen.
             The port is KEYBOARD-REACHABLE by the primitive's own contract:
             the installed `FadingScroll` root carries `tabindex="0"` itself
             and takes `role="region"` with the given `aria-label` (measured at
             `dist/fading-scroll.js`) — so the accessible-name + focusable
             scroller pair is the primitive's, not a departure authored here
             (`.b` §2.5's "departure" is corrected by this measurement). The
             hand-rolled `overflow-y-auto pr-1` port is gone with it.
             KSM C-9 — glass `/command` (a command palette: a filtered input
             over actionable items) was EVALUATED against this surface and is
             NOT adopted: this is a READ-ONLY reference list grouped by
             register, with no action per row and no filter, and a palette's
             input would be a control with nothing to command. Recorded, not
             replaced. -->
        <DialogContent scroll class="max-w-md">
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
            <FadingScroll
                axis="y"
                aria-label="Keyboard shortcuts"
                class="max-h-[var(--panel-max-h)] min-h-0"
            >
                <div class="grid gap-4">
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
            </FadingScroll>
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
} from "@mkbabb/glass-ui/dialog";
import { FadingScroll } from "@mkbabb/glass-ui/fading-scroll";
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
