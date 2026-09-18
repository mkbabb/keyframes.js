<template>
    <div
        class="timeline-caret absolute z-controls flex flex-col items-center"
        :style="{
            left: `${position}%`,
            top: 'calc(50% + var(--timeline-caret-offset, var(--caret-offset)))',
            transform: edgeTransform,
        }"
    >
        <!-- The readout is a real BUTTON, not a click-only div (D-3 / SC 4.1.2):
             it is the one control that opens the numeric editor, so it carries
             a name and a keyboard route. `aria-controls` names the sibling
             `role="slider"` diamond — the linkage `keyframeId` was declared for
             and never wired (m-5/L-6/C-5), and the focus target Enter/Escape
             hand back to (MISS-α2). The dotted underline is an affordance the
             caret does NOT share with the rail, which carries `cursor-pointer`
             over its whole 48–128px band (m-4 + MISS-α1). -->
        <!-- C-7 + D·M-5 + D·M-3, ONE MOTION (the bank declares them joint).
             FOCUS (C-7/D·M-5): the hand-authored `outline-none` plus a
             one-pixel primary ring is gone in favour of the demo's ONE ring.
             Both halves of the old pair failed together — `outline-none`
             genuinely removes (Tailwind v4 emits `outline-style: none`), a ring
             utility is an erased box-shadow under forced-colors, and this input
             joins none of the classes the producer's forced-colors restoration
             enumerates, so
             there was ZERO indicator there. `.kf-focus-ring` carries the demo's
             own forced-colors arm. K-9's INVERSION is honoured at the bytes:
             this lands FIRST and discharges D·M-5 now, waiting on nothing — the
             `/number-field` evaluation (C-4/D·M-9, MISS-α6) is W6-I's and comes
             second.
             SELECTION (D·M-3): in the LIGHT arm `--primary` and `--foreground`
             are byte-identical, so a hovered unselected caret and the selected
             one computed to the same ink and the whole distinction rode a single
             weight notch at the smallest type in the system. The channel added
             here is NON-COLOUR and is the element's own vocabulary: the selected
             readout wears a SOLID 2px underline, the unselected one keeps the
             dotted hover underline. The two decoration styles live in OPPOSITE
             branches of the same binding, never together on one element, so the
             distinction cannot be decided by utility order in the generated
             sheet. `aria-selected` is NOT the vehicle — it is invalid off its
             seven admitted roles, and shipping invalid ARIA to harvest a
             stylesheet is a killed shape.
             m-2 / C-6(a) — ONE datum, ONE register: this percent is the same
             number KeyframeTimeline's header renders at `text-mono-caption
             font-semibold tabular-nums`, and it wore the admin-chip register
             here instead (uppercase, fixed 10px, caps tracking — three
             properties a number cannot use). It takes the demo's numeric idiom
             (W6-G role (c)); the redundant mono family utility goes with the
             swap. `leading-none` carries the old register's line-height so the
             caret's hang below the rail grows only by the glyph's own 2–6px,
             inside the rail's 1rem bottom margin — the box law, honoured. -->
        <button
            v-if="!isEditing"
            ref="readoutEl"
            type="button"
            class="kf-focus-ring timeline-caret-readout text-mono-caption leading-none cursor-pointer select-none transition-colors whitespace-nowrap tabular-nums underline-offset-2"
            :class="
                isSelected
                    ? 'text-primary font-semibold underline decoration-solid decoration-2'
                    : 'text-muted-foreground hover:text-foreground decoration-dotted hover:underline'
            "
            :aria-controls="markerId"
            :aria-label="`Keyframe at ${display}% — edit the position`"
            @click="startEdit"
            @pointerdown.stop
        >
            {{ display }}%
        </button>
        <!-- D·M-7 + MISS-α3 — the editor had NO perceivable boundary against the
             surface it replaces: `bg-background` is `--neutral-0`, the PAGE
             ground, painted over TimelineTrack's own rail surface on a quiet
             cartoon Card. glass ships the on-glass EDITABLE surface for exactly
             this — `.field-control` binds `--control-surface-bg:
             var(--input-on-glass)` — so the correction is one declaration and,
             like the ring above, it does not wait on the NumberField
             evaluation. Second site of the doctrine banked at CSSPasteDialog
             R-24 (the editable well is `--input-on-glass`, never a `--muted`
             read-only mix); cross-referenced, not re-derived.
             L-5 (D-9's second site) + m-3/L-13/C-6(b) — the number the user
             TYPES wore the uppercasing fixed-10px chip register with a redundant
             mono family utility beside it, and zoomed on iOS focus. It takes the
             ONE entry register (W6-G role (a), style.css): `text-mono-small` for
             a raw host plus `kf-text-entry`, the ruled iOS floor in CSS. The box
             is resized IN THIS SAME EDIT (the typography same-commit law): its
             former hard 40×20px was cut to a 10px glyph and would clip a 14–20px
             one, so both axes are now denominated in the register's own em —
             four characters wide, 1.6 lines tall — and follow the fluid size. -->
        <input
            v-else
            ref="inputEl"
            type="number"
            :value="display"
            class="kf-focus-ring kf-text-entry text-mono-small w-[4em] h-[1.6em] text-center bg-[var(--input-on-glass)] border border-border rounded px-0.5"
            min="0"
            max="100"
            step="any"
            :aria-controls="markerId"
            :aria-label="`Keyframe position, percent`"
            @blur="commitEdit"
            @keydown.enter="commitEdit"
            @keydown.escape="cancelEdit"
            @wheel="onEditorWheel"
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
    /**
     * Which end of the rail this caret sits against, decided by the rail (which
     * owns the geometry) and honoured here: the rail CLIPS in x, so a caret at
     * 0% or 100% lost half its label under a flat `translateX(-50%)` (M1). The
     * tick labels have had this handling all along; the caret gets the same one,
     * from the same 5% band, rather than a second threshold of its own.
     */
    edge?: "start" | "end" | "mid";
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

const edgeTransform = computed(() =>
    props.edge === "start"
        ? "translateX(0)"
        : props.edge === "end"
          ? "translateX(-100%)"
          : "translateX(-50%)",
);

/**
 * C-9's contract, stated at the node that carries it (there were zero comments
 * at any of the three): this caret hangs BELOW the rail's centre line by
 * `--timeline-caret-offset` — a clearance the rail computes per expansion state
 * (D-19/D-17) — and its EDIT INPUT (`h-5`) hangs ≈11px into the rail's own
 * `margin-bottom`, which is why the ancestor chain is provisioned
 * `overflow-y-visible`. The 10px label's ~1px overhang is NOT a Card-clip
 * truncation (that mechanism was killed, #13). `z-controls` is the other half
 * of D-17: the marker carries the same layer, so without it the diamond won
 * paint AND the hit test over the caret it occludes, whatever the DOM order.
 */

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

/**
 * The open editor's wheel shield is EXPLICIT (L-11 (TimelineCaret)), never
 * inherited: the only protection was the ancestor's `@wheel.prevent`, declared
 * for zoom — so a ctrl/⌘-wheel over an open editor zoomed the rail underneath
 * it, and the protection vanished the moment that declaration was corrected to
 * "prevent only on consumed events". Inside that one policy the editor consumes
 * its own wheel while it is open, and nothing else.
 */
const onEditorWheel = (event: WheelEvent) => {
    if (!isEditing.value) return;
    event.stopPropagation();
};
</script>
