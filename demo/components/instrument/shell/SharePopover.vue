<template>
    <Popover v-model:open="sharePopoverOpen">
        <!-- SP-11 — the trigger was a RAW 24x24 `<button>` with `p-0` zeroing any
             rescue and an `icon-lg` sole child: reachable by none of the demo's
             declared floors, and wearing a hand-rolled shell beside the very
             primitive that ships one. The swap to glass `Button emphasis="quiet"
             icon-only` collapses SP-11 with SP-26 and SP-27 in one edit — the
             plate, the hover/press motion and the focus ring all come from the
             producer, so `bg-transparent border-none p-0 scale-on-hover
             transition-all duration-fast` are not re-authored here.
             The open/closed opacity binding is carried VERBATIM onto the new
             host: it is EH-9 ≡ SP-10's subject (the bare deletion ships a
             snapping `hover:opacity-50`, and the recede-affordance books WITH
             it as ONE SharePopover motion batch), which is W6-J's row and is not
             spent here. -->
        <PopoverTrigger as-child>
            <Button
                size="sm"
                emphasis="quiet"
                icon-only
                aria-label="Share animation"
                :class="sharePopoverOpen ? 'opacity-100' : 'hover:opacity-50'"
            >
                <Share2 class="icon-lg" />
            </Button>
        </PopoverTrigger>
        <!-- SP-20 — the field is FOCUSED ON OPEN. Its placeholder is an
             imperative ("Paste share URL..."), and until now the popover opened
             with focus on the content container, so the instruction named an
             action the keyboard could not take without a Tab; `openAutoFocus` is
             the primitive's own hook for exactly this and nothing bound it. The
             default is prevented and the field takes focus directly, so the
             popover's focus scope still traps — nothing about dismissal or the
             return target changes. -->
        <PopoverContent
            class="z-popover w-72 p-2"
            align="start"
            :side-offset="8"
            @open-auto-focus="focusShareField"
        >
            <!-- SP-9 + SP-8 — the height overrides go, and `size` drives.
                 SP-9 is the row's largest deficit and the only one with no
                 rescue: `.field-control[data-kind="input"]` sets `block-size`,
                 which is THE SAME property `h-8` sets, so a coarse pointer's
                 60px rung collapsed to 32 on the one control a paste flow must
                 hit — a deficit no `max()` can recover, unlike the buttons'.
                 SP-8: `h-8 w-8 p-0` hand-rolled `iconOnly` and, in doing so,
                 forfeited the coarse floor twice over — `min-block-size` is a
                 different property from `height`, so the box it names is not the
                 box it renders, and `data-control-target`, the floor's SOLE
                 hook, is emitted only under the `icon-only` these never passed.
                 Passing the prop and dropping the overrides is the whole cure.
                 SP-4 + SP-7, ONE EDIT (W6-G role (a), style.css): the field is a
                 pasted URL — an artifact, so it keeps the MONO face — but the
                 caption utility it wore fixed `--type-caption` (~12.2px at
                 390px) OVER `field-control`'s own zoom-safe `--field-control-font`
                 (utilities layer beats components layer), then needed a case
                 cancel and, per MM-29, a tracking cancel to undo the caps
                 register it had just applied. The Input is now SIZE-DRIVEN:
                 `font-mono` alone, size from the producer's `--control-text`
                 (≥16px where iOS zooms), no transform to cancel and no caps
                 tracking to pair — the case-cancel/tracking pair this string
                 carried is retired together, so G-W6-8's census loses a site
                 rather than gaining an unpaired one. -->
            <div class="flex items-center gap-1.5">
                <Input
                    ref="shareFieldEl"
                    v-model="loadHashInput"
                    placeholder="Paste share URL..."
                    class="font-mono flex-1"
                    @keydown.enter="loadFromInput"
                />
                <Button
                    size="sm"
                    emphasis="quiet"
                    icon-only
                    class="shrink-0"
                    @click="loadFromInput"
                    title="Load shared state"
                >
                    <ArrowRight class="icon-md" />
                </Button>
                <Button
                    size="sm"
                    emphasis="quiet"
                    icon-only
                    class="shrink-0"
                    @click="shareState"
                    title="Copy share link"
                >
                    <Clipboard class="icon-md" />
                </Button>
            </div>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import type { ComponentPublicInstance } from "vue";
import { Share2, Clipboard, ArrowRight } from "@lucide/vue";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
} from "@mkbabb/glass-ui";
import { Input } from "@mkbabb/glass-ui/forms";
import { useShareState } from "./useShareState";

const props = defineProps<{
    onSceneRestore?: (sceneId: string) => void;
}>();

const { sharePopoverOpen, loadHashInput, shareState, loadFromInput } =
    useShareState(props.onSceneRestore);

// SP-20 — glass `Input` is a single-root component over the native `<input>`,
// so its instance `$el` IS the focusable element (the same `$el` contract the
// demo's other child-ref seams read; no querySelector).
const shareFieldEl = useTemplateRef<ComponentPublicInstance>("shareFieldEl");

const focusShareField = (event: Event) => {
    event.preventDefault();
    (shareFieldEl.value?.$el as HTMLElement | undefined)?.focus();
};
</script>
