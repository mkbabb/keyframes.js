<template>
    <!-- X.KF.W13X.controls · UIA-KF-079 · 080 · 269 · 273 · KFA-150 — the ONE
         sub-pane header both of the card's sub-panes wear: Back FIRST (the
         producer's quiet icon Button at its own `sm` size — no `h-auto p-1`
         shrinking its hit area and focus ring), the title one rung above the
         rows it titles (`text-subheading`, never the display-sized
         `text-title` that wrapped "cubic-/bézier" over two lines), and the
         caption on its own muted line UNDER the title (the provenance notice
         used to be squeezed between title and Back and broke mid-word).
         UIA-KF-036 — the host renders this as a SIBLING of the pane's scrolled
         body, so the navigation is never scrolled out of view.
         E2E-USAB-1 (KF.W13X Repair 1) — both sub-panes stay in the DOM (the
         closed one `inert`), so each Back NAMES THE PANE IT LEAVES: two
         controls called "Back to controls" were one accessible name on two
         buttons.
         X-DS pass 15 (KF-C19-01) — the caption joins the title's ROW when it
         fits ("cubic-bézier  from ease-in-out"), and wraps WHOLE under the
         title when it does not (a flex-wrap line, so it never breaks
         mid-word against the title again). The title holds the Back control's
         height, so the two stay level either way. The caption's own line had
         grown the sub-pane past the rail at 1440×900. -->
    <div
        ref="rootEl"
        data-subpane-header
        class="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-1.5 pb-1"
    >
        <Button
            ref="backEl"
            emphasis="quiet"
            icon-only
            size="sm"
            :aria-label="`Back from ${title} to controls`"
            @click="emit('back')"
        >
            <ArrowLeft class="icon-sm" />
        </Button>
        <div class="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <h3 data-subpane-title class="text-subheading flex min-h-(--control-h-sm) items-center">
                {{ title }}
            </h3>
            <p
                v-if="$slots.caption"
                data-subpane-caption
                class="text-caption text-muted-foreground"
            >
                <slot name="caption" />
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@mkbabb/glass-ui";
import { ArrowLeft } from "@lucide/vue";
import { useTemplateRef } from "vue";

defineProps<{ title: string }>();
const emit = defineEmits<{ (e: "back"): void }>();

const backEl = useTemplateRef<InstanceType<typeof Button>>("backEl");
const rootEl = useTemplateRef<HTMLElement>("rootEl");
defineExpose({
    /** The pane's landing: its Back control (focused on the way in). */
    backControl: (): HTMLElement | null =>
        (backEl.value?.$el as HTMLElement | undefined) ?? null,
    /** Bring the header into its scroller's view (nearest edge only). */
    reveal: (): void => rootEl.value?.scrollIntoView({ block: "nearest" }),
});
</script>
