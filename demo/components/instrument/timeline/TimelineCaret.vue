<template>
    <div
        class="timeline-caret absolute flex flex-col items-center"
        :style="{ left: `${position}%`, top: 'calc(50% + var(--caret-offset))', transform: 'translateX(-50%)' }"
    >
        <!-- The readout is a real BUTTON, not a click-only div (D-3 / SC 4.1.2):
             it is the one control that opens the numeric editor, so it carries
             a name and a keyboard route. `aria-controls` names the sibling
             `role="slider"` diamond — the linkage `keyframeId` was declared for
             and never wired (m-5/L-6/C-5), and the focus target Enter/Escape
             hand back to (MISS-α2). The dotted underline is an affordance the
             caret does NOT share with the rail, which carries `cursor-pointer`
             over its whole 48–128px band (m-4 + MISS-α1). -->
        <button
            v-if="!isEditing"
            ref="readoutEl"
            type="button"
            class="timeline-caret-readout font-mono text-admin-label cursor-pointer select-none transition-colors whitespace-nowrap tabular-nums decoration-dotted underline-offset-2 hover:underline"
            :class="
                isSelected
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
            "
            :aria-controls="markerId"
            :aria-label="`Keyframe at ${display}% — edit the position`"
            @click="startEdit"
            @pointerdown.stop
        >
            {{ display }}%
        </button>
        <input
            v-else
            ref="inputEl"
            type="number"
            :value="display"
            class="font-mono text-admin-label w-10 h-5 text-center bg-background border border-border rounded px-0.5 outline-none focus:ring-1 focus:ring-primary"
            min="0"
            max="100"
            step="any"
            :aria-controls="markerId"
            :aria-label="`Keyframe position, percent`"
            @blur="commitEdit"
            @keydown.enter="commitEdit"
            @keydown.escape="cancelEdit"
            @pointerdown.stop
        />
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from "vue";
import { clamp } from "@mkbabb/value.js/math";

const props = defineProps<{
    keyframeId: string;
    percent: number;
    position: number;
    isSelected: boolean;
}>();

const emit = defineEmits<{
    /**
     * A COMMITTED position — deliberately NOT `update:percent` (C-10, ruled at
     * G1): `v-model:percent` would bind a consumer straight to this emit and
     * bypass the ops layer, whose `moveKeyframe` re-derives the keyframe's
     * selector and schedules the rebuild. The protocol name is the invitation;
     * the name is therefore off the protocol.
     */
    (e: "commitPercent", value: number): void;
    (e: "select"): void;
}>();

const isEditing = ref(false);
const inputEl = useTemplateRef<HTMLInputElement>("inputEl");
const readoutEl = useTemplateRef<HTMLButtonElement>("readoutEl");

/**
 * The DOM id of the sibling `role="slider"` marker for this keyframe. The
 * convention is written here and at `TimelineTrack.vue`'s marker `:id` — the
 * two are one contract, and `timeline-mount-keyboard.test.ts` asserts that
 * `aria-controls` resolves to the rendered marker.
 */
const markerId = computed(() => `timeline-marker-${props.keyframeId}`);

/**
 * The MODEL's value, not an integer lie (L-2/C-3/D·M-4). `Math.round` on the
 * display, on the editor's seed and on the commit made a pure READ gesture —
 * open, blur — quantize 42.4 to 42 and write it back. Two decimals is a
 * presentation convention over float noise, never a re-quantization of the
 * model: the value that leaves here is the value the model holds unless the
 * user typed a different one.
 */
const display = computed(() => String(Number(props.percent.toFixed(2))));

/** The text the editor OPENED with — G7's compare-before-commit reads it. */
let openedWith = "";

const startEdit = () => {
    emit("select");
    openedWith = display.value;
    isEditing.value = true;
    nextTick(() => {
        // `.focus()` is REQUESTED, never inferred from `select()`'s side effect
        // (m-1/L-10): `select()` and the `setSelectionRange` family are separate
        // spec hooks, and the whole exit contract (blur / Enter / Escape) hangs
        // on this element actually holding focus.
        inputEl.value?.focus();
        inputEl.value?.select();
    });
};

/**
 * Leave the editor and hand focus back to the sibling slider (MISS-α2): the
 * `v-else` unmounts the focused input, and with nothing calling `.focus()` on a
 * successor the user lands on `<body>`, at the top of the tab order. The
 * readout is the caret's own control; the marker is the one the caret names.
 */
const closeEdit = () => {
    // Restore ONLY when the exit came from the editor itself (Enter, Escape, or
    // a commit while focused). A blur that moved focus somewhere else already
    // has a destination, and stealing it back would be a worse defect than the
    // one being cured.
    const hadFocus = !!inputEl.value && document.activeElement === inputEl.value;
    isEditing.value = false;
    if (!hadFocus) return;
    nextTick(() => {
        const marker = document.getElementById(markerId.value);
        if (marker) marker.focus();
        else readoutEl.value?.focus();
    });
};

const commitEdit = () => {
    // DO NOT DELETE (KF-CE-41, MISS-α4): the re-entrancy guard. Enter and
    // Escape both unmount the input, and the unmount fires `blur` — which is
    // this same handler. Without the guard a committed edit commits twice and
    // a cancelled one commits after being cancelled.
    if (!isEditing.value) return;

    const raw = inputEl.value?.value ?? "";
    const val = parseFloat(raw);

    // L-15, RULED at G14 P4(a): an uncommittable keystroke is a CANCEL, not a
    // failure — `<input type="number">` already refuses non-numeric entry, so
    // the only NaN path is the empty field, which is Escape's meaning. No
    // toast, no error node; the editor closes and the display returns at model
    // precision.
    if (Number.isNaN(val)) {
        cancelEdit();
        return;
    }

    // COMPARE BEFORE COMMIT (G7): a read gesture — open the editor, blur
    // without typing — must leave zero undo entries and zero exported bytes.
    // Both halves are compared: the text the editor opened with (so a display
    // rounded for presentation cannot round-trip into the model) and the
    // clamped value against the live one. The clamp itself is where untrusted
    // DOM text becomes a model number and survives any dedupe (S-3).
    const next = clamp(val, 0, 100);
    closeEdit();
    if (raw === openedWith || next === props.percent) return;

    emit("commitPercent", next);
};

const cancelEdit = () => {
    closeEdit();
};
</script>
