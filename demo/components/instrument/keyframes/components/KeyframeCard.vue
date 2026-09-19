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
        <Input
            class="sticky z-modal top-0 text-subheading w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight m-0"
            aria-label="Offset"
            :model-value="frameStart"
            @update:model-value="(val) => emit('updateStart', String(val))"
        >
        </Input>

        <div class="relative">
            <div
                class="absolute top-2 right-4 grid gap-1 items-center justify-center justify-items-center"
            >
                <!-- KF-KE-45 (W6-M) — RECORDED, DELIBERATELY UNSPENT, and the
                     condition is the row's own. Its dead-utility half (`.tap-floor`,
                     zero adopters) folded to banked KF-CB-25 and is already
                     rostered. What survives is this pair: a 24px `<X>` and the
                     copy control adjacent with NO gap, against the demo's own
                     written 44px floor. The row rules the touch-target question
                     goes live ONLY AFTER KF-KE-5's un-occlusion — and KF-KE-5 is
                     UNCURED at these bytes, measured, not assumed: this cluster
                     is `absolute top-2 right-4` with no z rung, the `<pre>`
                     below is a later z-auto sibling in the same stacking context
                     whose class list still ends `relative`, so CSS 2.2 App. E
                     step 8 paints the plate OVER the cluster and hit-testing
                     follows paint. Sizing a control that cannot be hit would be
                     a cure measured against a state no user can reach. The
                     un-occlusion is KFED-UNIT's (a z rung here, or dropping the
                     `<pre>`'s `relative`); this row lands with it, not before. -->
                <div class="flex gap-1">
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
                    class="italic text-muted-foreground z-0 pointer-events-none grid gap-1"
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
                 unmounted the whole list each cycle (KF-KE-25 — `.c`'s row);
                 with the cards kept mounted it would surface as Vue patching
                 text into a node no longer in the document. So the model's text
                 reaches the host through the driver's own seam below, and the
                 driver owns every node inside it. -->
            <pre
                ref="preEl"
                @input="(e) => emit('updateCSS', (e.target as HTMLElement).innerText)"
                @keydown="(e) => emit('keydown', e)"
                class="kf-focus-ring kf-text-entry text-mono-small hljs css p-2 min-h-32 cursor-text rounded-lg bg-transparent outline-none border-none relative"
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                aria-label="CSS declarations"
            ></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watchEffect } from "vue";
import { syncHostSource } from "../composables/useHighlightCSS";
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
