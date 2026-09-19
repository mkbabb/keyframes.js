<template>
    <!-- KC-27 + KF-KC-26 — THE CARD IS THE NAMED GROUP, and every name on it is
         OFFSET-BEARING rather than positional. The surface used to publish
         `CSS for keyframe ${index}` and nothing else: a 0-based ordinal that
         silently re-points at a different keyframe on every non-tail removal,
         beside an `<Input>` and a destructive control with no names at all. N
         stops therefore produced N indistinguishable control sets.
         The identifying datum is the OFFSET — which is exactly the value KC-1
         made readable — so it names the group once, and the controls inside
         carry short role names that the group qualifies. Nothing here repeats
         the offset per control: an AT user hears "Keyframe at 50%, group" then
         "Offset, edit text". -->
    <div
        ref="rootEl"
        class="grid"
        role="group"
        :aria-label="`Keyframe at ${frameStart}`"
    >
        <!-- KF-KC-4 ≡ KF-KC-13 ≡ KC-5 — the start/offset field STOPS ERASING THE
             CONTROL. This one `class` carried seven utilities that cancelled
             glass's `field-control` outright: `bg-transparent` killed the plate
             (`--glass-defined-plate` is set inside the very rule whose
             `background` shorthand resets `background-image`, so the plate was
             doubly dead), a transparent-border utility beside a borderless
             and a shadowless one took the edge, `p-0` took the padding, and the
             two `focus:`-variant twins of the last two took BOTH halves of
             `field-control:focus-visible` — whose own `outline: none` then
             forecloses the native fallback, so
             keyboard focus changed literally nothing outside forced-colors. The
             utilities layer is last, so every one of them won; the file's own
             `<pre>` forty lines down rings correctly, which is why this was an
             omission and never house style.
             The row's other admissible arm is the BARE VARIANT REQUEST to the
             producer (root-styling law: never per-instance erasure); that ask is
             already sent as O-26 R-16 and, when it lands, this field consumes
             the variant instead of re-erasing. Only geometry and type stay here. -->
        <!-- KF-KC-3 / KC-4 — the field NAMES ITSELF. glass's `Input` synthesizes
             no accessible name, the two identity spans below label nothing, and
             this is the card's only editable control; `aria-label` is the
             minimum honest cure and the group above supplies which keyframe it
             belongs to. -->
        <!-- KC-25 ≡ KF-KC-28 ≡ KF-KE-41 ≡ KF-KE-22's `sticky` half (X.KF.W12.c) —
             the field is NOT positioned and claims NO z rung. It wore
             `sticky top-0 z-modal`: a `sticky` whose travel was provably ZERO (a
             grid item's containing block is its grid area, and this
             single-column auto row equals the Input's own height), which
             existed only to make the element positioned so that `z-modal` — the
             demo's documented TOP rung, 140, reserved for modals — could apply
             to a per-card text field. The pair was one edit, and it is spent:
             a dead `sticky` and a contract-breaching rung both gone, so the
             field paints in flow like the control it is and the z-contract
             (`style.css` §"stacking order") has no per-card exception. -->
        <!-- KF-KE-3 + KF-KE-26 + KF-KE-37 (X.KF.W12.c) — THE FIELD COMMITS
             THROUGH THE KEYFRAME GRAMMAR, ON COMMIT, AND MARKS ITSELF.
             · THE GRAMMAR: the value is validated by `requireKeyframeSelector`,
               the ONE door the add path already uses (`useKeyframeOps`), so
               `from`/`to`/`entry 50%` are accepted and `500%`/`-20%` are refused
               here — the previous `parseCssScalar` admitted any percentage
               scalar and rejected the two keywords, two grammars in one
               component.
             · THE COMMIT GATE: the producer's `Input` emits `update:modelValue`
               per keystroke; the model was written on every one, so typing
               `50%` failed twice before it succeeded and the successful
               keystroke reprojected the list under the caret. The keystrokes
               now edit a local DRAFT and the model is written once, on
               `change` (blur or Enter) — the native commit event, which the
               producer forwards to its `<input>` through `$attrs`.
             · THE MARK: a refused draft is marked AT THE FIELD — the producer's
               `invalid` prop (rendered as `aria-invalid`) plus a described-by
               status line in the house `text-destructive` register — instead
               of being exiled to a global toast that this demo cannot render.
               Nothing is emitted for a refused draft, so the model is never
               touched by it; a projection from the model (a new `frameStart`)
               resets the draft and the mark. -->
        <Input
            class="text-subheading w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight m-0"
            aria-label="Offset"
            :model-value="draft"
            :invalid="offsetError !== null"
            :aria-describedby="offsetError === null ? undefined : errorId"
            @update:model-value="(val) => (draft = String(val))"
            @change="commitOffset"
        >
        </Input>
        <p
            v-if="offsetError !== null"
            :id="errorId"
            class="text-admin-label text-destructive"
            role="status"
            aria-live="polite"
        >
            {{ offsetError }}
        </p>

        <div class="relative">
            <!-- KF-KE-5 (BLOCKER) + KF-KC-22 (X.KF.W12.c) — THE ACTION CLUSTER IS
                 PAINTED ABOVE THE CODE PLATE, AND ONLY ITS CONTROLS TAKE THE
                 POINTER.
                 WHAT WAS THERE: this cluster was an `absolute` box with NO z rung
                 and the `<pre>` below it was a LATER sibling whose class list
                 ended `relative` — two z-auto positioned boxes in one stacking
                 context, which CSS 2.2 App. E step 8 paints in TREE ORDER. The
                 plate came later, so it painted OVER the delete control and the
                 per-card copy control, and hit-testing follows paint: the
                 `<pre>` (never `pointer-events: none`) ate every click. Both
                 affordances were invisible and pointer-unreachable once the
                 theme injected — a functional kill, audited four times without
                 anyone noticing, and the file's own comment described the
                 mechanism while calling it uncured.
                 WHAT IS THERE: the cluster carries `z-content`, the demo's
                 content-plane rung (`--z-content: 10`, the producer's scale as
                 `style.css` documents it), so it paints above the z-auto plate
                 by declaration rather than by tree order; and the `<pre>` is no
                 longer positioned at all — the `relative` it wore positioned
                 nothing (it has no absolutely-placed descendants) and served
                 only to enter the paint step that occluded the cluster.
                 The OVERLAY BOX itself is `pointer-events-none` (KF-KC-22): it is
                 far larger than the two controls, and as a positioned box over
                 the in-flow plate its whole area swallowed caret placement into
                 a handler-less `<div>`. Only the control row below re-enables
                 pointer events, so a click lands on a control or falls through
                 to the editing host — never on the overlay's margin. The
                 identity readout further down stays `pointer-events-none`
                 (KC-12's behavioural half, DECLINED by `.a` with reason: a
                 selectable watermark would give this overlay back the pointer
                 surface this row takes from it).
                 D-4's shell (KC-3's producer `Button`) and the annotation's
                 contrast against `--card` are LIVE questions again now that the
                 cluster can be seen and hit; the 44px touch-floor question
                 (KF-KE-45 / KF-CB-25) is a RENDERED one — SS-13's. -->
            <div
                class="pointer-events-none absolute z-content top-2 right-4 grid gap-1 items-center justify-center justify-items-center"
            >
                <div class="pointer-events-auto flex gap-1">
                    <!-- KC-3 ≡ KF-KC-2 ≡ KF-CB-11 — THE DESTRUCTIVE CONTROL IS A
                         CONTROL. It was a bare Lucide `<svg>` carrying a click
                         listener: no tab stop, no role, no accessible name, no
                         keyboard path, and (KF-KC-34) hover-only feedback,
                         because an `<svg>` has nothing to attach focus or active
                         state to. Lucide forwards attributes onto the `<svg>`
                         and synthesizes nothing, so the sole way to delete a
                         keyframe was a mouse click — WCAG 2.1.1 and 4.1.2, on
                         the one irreversible action the surface offers. The
                         house idiom was already three lines away on CopyButton
                         and five times over in `KeyframeTimeline.vue`.
                         The producer's `tone="destructive"` replaces the
                         hand-rolled pair it carried: `text-accent-red` plus a
                         `data-destructive` attribute that had exactly one
                         occurrence repo-wide and justified itself by citing
                         `proof:accent-census`, a gate the owner retired
                         (KF-KC-35 — the law there is delete, not re-implement).
                         KC-7 / KF-KC-11(c): at one remaining keyframe the
                         command is genuinely unavailable, and it now SAYS so
                         instead of styling itself live and bare-returning in a
                         handler two files away whose "Cannot remove last
                         keyframe" toast is shadowed and unreachable.
                         KC-23's demo half rides the promotion: `size="sm"` is a
                         real box and the pair is no longer flush. -->
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                ref="removeEl"
                                size="sm"
                                emphasis="quiet"
                                tone="destructive"
                                icon-only
                                :aria-label="`Remove the keyframe at ${frameStart}`"
                                :disabled="!canRemove"
                                @click="(e: MouseEvent) => emit('remove', e)"
                            >
                                <X class="icon-sm" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{{
                            canRemove
                                ? `Remove the keyframe at ${frameStart}`
                                : "An animation keeps at least one keyframe"
                        }}</TooltipContent>
                    </Tooltip>
                    <!-- S-7 (W6-I): the copy control is a glass Button that
                         owns its box; the caller's `h-6 w-6` is gone. -->
                    <!-- A row whose projection has not landed has nothing to
                         copy; the empty string is the honest payload for that
                         window, not a stand-in for the frame's text. -->
                    <CopyButton :text="frameString ?? ''" />
                </div>
                <!-- KC-12 — the row's only visible identity (`f N` / `s N`) is
                     AT-EXPOSED, so it is denominated in a REAL TOKEN, not in an
                     alpha: a quarter-opacity utility capped it at a ~1.84:1
                     theoretical ceiling no theme arm could lift, because opacity
                     multiplies whatever the token resolved to. `--muted-foreground` is the
                     demo's real muted rung and it is the one this wave gives
                     every 1.4.11 mark (W6-H). The `pointer-events-none` half —
                     the identity being unselectable — is CARD-UNIT's behavioural
                     row and is deliberately NOT spent here. -->
                <!-- KC-26 (W6-M, the Label-conformance half) — THE GLASS
                     CONFORMANCE INVERSION, RUNNING BACKWARDS. These two nodes
                     were glass `<Label>`s: reka renders each as a REAL
                     `<label>` element, with the multi-click `preventDefault`
                     behaviour a form label owns — wrapping nothing, labelling
                     nothing, inside a `pointer-events-none` box, while the
                     `<Input>` twelve lines up has no name at all. A form
                     primitive was conscripted for a job it does not do, on the
                     one card whose real control needed exactly that primitive.
                     They are what they read as: a per-card identity READOUT
                     (`f N` / `s N`), so they render as text and the primitive is
                     returned to the control that will use it. The NAMING of the
                     `<Input>` (KC-3) and the set-level `role="group"` + per-index
                     control names (the rest of KC-26) are the ONE field-contract
                     spec and stay NO-WAVE-OWNER — this row is the conformance
                     half and does not annex the behavioural one. -->
                <div
                    class="italic text-muted-foreground pointer-events-none grid gap-1"
                >
                    <span
                        class="text-mono-small font-light leading-none tabular-nums"
                        >f {{ index }}</span
                    >
                    <span
                        class="text-mono-small font-light leading-none tabular-nums"
                        >s {{ frameStart }}</span
                    >
                </div>
            </div>
            <!-- CPD R-25's THIRD widget (S-9, W6-I): this `<pre>` is NOT
                 swapped onto `Textarea` — its hljs token layer IS the surface
                 (a highlighted per-stop read/edit well), and a native textarea
                 has no innerHTML to paint; the S-9 carve here is the raw-host
                 REGISTER (`.h` §5.2, routed to this unit): `text-mono-small`
                 + `kf-text-entry`, the ONE entry register for a raw editing
                 host (style.css role (a)) — the proportional `text-small` it
                 wore left the hljs glyphs in the UI face and under the iOS
                 zoom floor. G-W6-8 (same-commit box law): the box is
                 `min-h-32`, a MINIMUM over content-sized rows, so the register
                 swap invalidates no fixed dimension and no resize is owed. -->
            <!-- KC-34 (D-17) — THE HOST IS CHILDLESS IN THIS TEMPLATE, and that
                 is the write-authority clause of the child-ref contract, not a
                 formatting choice. The `<code>{{ formattedCSS }}</code>` that
                 stood here made Vue the second owner of a subtree the highlight
                 driver replaces wholesale (`el.innerHTML = …`): every paint
                 detached the element Vue's vnode still pointed at. The
                 divergence was masked only by the projection blank that
                 unmounted the whole list each cycle (KF-KE-25 — `.e`'s row);
                 with the cards kept mounted it would surface as Vue patching
                 text into a node no longer in the document. So the model's text
                 reaches the host through the driver's own seam below, and the
                 driver owns every node inside it. -->
            <!-- The plate's containing block is the wrapper `<div>` above, which
                 the cluster is positioned against; the plate itself is in flow
                 and unpositioned (KF-KE-5, above). -->
            <pre
                ref="preEl"
                @input="(e) => emit('updateCSS', (e.target as HTMLElement).innerText)"
                @keydown="(e) => emit('keydown', e)"
                class="kf-focus-ring kf-text-entry text-mono-small hljs css p-2 min-h-32 cursor-text rounded-lg bg-transparent outline-none border-none"
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                aria-label="CSS declarations"
            ></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, watchEffect } from "vue";
import { syncHostSource } from "../composables/useHighlightCSS";
import { requireKeyframeSelector, selectorText } from "@utils/keyframeSelector";
// KF-KC-37 (W6-I): subpaths, never the 24 KB root barrel. The `./label` subpath
// leaves with its two orphan consumers (KC-26 above) — the card imports only
// what it mounts.
import { Input } from "@mkbabb/glass-ui/forms";
import { Button } from "@mkbabb/glass-ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui/tooltip";
import CopyButton from "@components/CopyButton/CopyButton.vue";
import { X } from "@lucide/vue";

// KC-8 / KC-9 — the two string projections are OPTIONAL, because a row whose
// projection pass has not landed yet genuinely has none. Declaring them
// `string` forced the parent to launder that absence into `""`, and an empty
// string is a document — writing it into the editing host is how a commit cycle
// blanked the text under a live caret.
const props = defineProps<{
    frameString?: string | undefined;
    formattedCSS?: string | undefined;
    frameStart: string;
    index: number;
    /** KC-7 — whether removing THIS stop is a real command. An animation keeps
     *  at least one keyframe, and at that floor the list is the only party that
     *  knows. */
    canRemove: boolean;
}>();

// KC-1 — FE-3's defensive `displayStart` computed is GONE with the half-cure it
// defended. It re-derived `.value` off a prop the type says is a `string`, so it
// was dead on every honest input and, on the dishonest one, produced the same
// bare fraction the parent produced. The parent now renders the canonical
// `selectorText(frame.start)`, which is total over the selector union — a named
// stop reads `entry 50%`, not `[object Object]` — so `frameStart` is bound as
// the string it is declared to be, and a future regression at the seam shows up
// as a wrong offset rather than being laundered here.
const emit = defineEmits<{
    (e: "updateStart", val: string): void;
    (e: "updateCSS", val: string): void;
    (e: "remove", event: Event): void;
    (e: "keydown", event: KeyboardEvent): void;
}>();

/**
 * KF-KE-26 — the offset DRAFT. Keystrokes edit this; the model is written on
 * commit alone (see `commitOffset`). A projection from the model (the parent
 * re-rendering `frameStart` after a commit, a retime or a removal) is the
 * authority and resets both the draft and any mark on it.
 */
const draft = ref(props.frameStart);
const offsetError = ref<string | null>(null);
const errorId = computed(() => `keyframe-offset-error-${props.index}`);

watch(
    () => props.frameStart,
    (start) => {
        draft.value = start;
        offsetError.value = null;
    },
);

/**
 * KF-KE-3 — commit the draft through the keyframe-selector grammar. The text
 * emitted upward is the selector's CANONICAL text (`selectorText`), so the
 * parent replaces the frozen selector whole from a string the grammar already
 * accepted; a draft equal to what is shown is not a commit.
 */
const commitOffset = () => {
    const text = draft.value.trim();
    if (text === props.frameStart) {
        offsetError.value = null;
        return;
    }
    try {
        const selector = requireKeyframeSelector(text);
        offsetError.value = null;
        emit("updateStart", selectorText(selector));
    } catch (e) {
        offsetError.value = e instanceof Error ? e.message : String(e);
    }
};

/**
 * KC-28 — THE CARD'S ROOT IS DECLARED, not inherited.
 *
 * The list's contract comment promised `$el` "via defineExpose" and the card
 * exposed `{ preEl }` alone: `$el` arrived from Vue's instance surface whatever
 * the card did, and that accidental half was the one feeding the remove
 * animation. Nothing anywhere guaranteed a single root — a fragment root turns
 * `$el` into a comment-node anchor, which the null-tolerant engine then
 * animates by doing nothing at all, silently. The root is a real ref now, so
 * the guarantee is in this file rather than in a sentence about it.
 */
const rootEl = useTemplateRef<HTMLElement>("rootEl");

// The card's own contenteditable <pre> — surfaced for the parent's scoped
// highlight collection (a declared child-ref contract, no querySelector).
const preEl = useTemplateRef<HTMLElement>("preEl");

// KC-34 — the model reaches the host through the driver's ONE seam, after the
// render (`flush: "post"`, so the ref is resolved and the write lands on the
// element this pass produced). The seam is idempotent in the text, so a render
// that changes nothing leaves a caret in the host undisturbed — and an ABSENT
// projection (KC-8/KC-9: mid-pass, or a stop added before its strings exist) is
// not a document to write, so the host keeps what it has until one arrives.
watchEffect(
    () => {
        const css = props.formattedCSS;
        if (css === undefined) return;
        syncHostSource(preEl.value, css);
    },
    { flush: "post" },
);

/**
 * KC-10's other half of the ref contract: the removal control, so the list can
 * hand focus to a surviving neighbour's command after a row leaves. The producer
 * renders a real `<button>`, so `$el` is the focusable element; a component
 * instance is unwrapped here rather than at the consumer, which is what keeps
 * the exposed contract a set of DOM handles.
 */
const removeButton = useTemplateRef<{ $el?: HTMLElement } | HTMLElement>(
    "removeEl",
);
const removeEl = computed<HTMLElement | null>(() => {
    const el = removeButton.value;
    if (el === null) return null;
    return el instanceof HTMLElement ? el : (el.$el ?? null);
});

defineExpose({ rootEl, preEl, removeEl });
</script>
