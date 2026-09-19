<template>
    <div class="grid">
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
        <Input
            class="sticky z-modal top-0 text-subheading w-16 text-ellipsis aspect-square font-semibold leading-none tracking-tight m-0"
            :model-value="displayStart"
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
                <div class="flex">
                    <!-- T.D7 (OD-6) — the delete-X is a DESTRUCTIVE affordance:
                         it rides the demo's destructive register (--accent-red,
                         red's ONE sanctioned home post-red-kill) instead of the
                         raw Tailwind red-500 literal, and is destructive-MARKED
                         so proof:accent-census's red-census recognizes the role. -->
                    <X
                        @click="(e) => emit('remove', e)"
                        data-destructive
                        class="p-0 m-0 scale-on-hover cursor-pointer stroke-2 w-6 h-6 text-accent-red hover:opacity-80 bg-transparent hover:bg-transparent"
                    >
                    </X>
                    <!-- S-7 (W6-I): the copy control is a glass Button that
                         owns its box; the caller's `h-6 w-6` is gone. -->
                    <CopyButton :text="frameString" />
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
                :aria-label="`CSS for keyframe ${index}`"
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
import CopyButton from "@components/CopyButton/CopyButton.vue";
import { X } from "@lucide/vue";

const props = defineProps<{
    frameString: string;
    formattedCSS: string;
    frameStart: string;
    index: number;
}>();

// FE-3 — coerce the start to its scalar before binding the editable start
// field. The parent (KeyframeCardList) already passes a scalar, but a Spring
// `KeyframeSelector` object (`{ kind: "percent", value }`) reaching this Input
// would render `"[object Object]"`; extracting `.value` keeps the field honest
// regardless of what upstream hands down.
const displayStart = computed(() => {
    const s = props.frameStart as unknown;
    if (s != null && typeof s === "object" && "value" in s) {
        return String((s as { value: unknown }).value);
    }
    return String(s ?? "");
});

const emit = defineEmits<{
    (e: "updateStart", val: string): void;
    (e: "updateCSS", val: string): void;
    (e: "remove", event: Event): void;
    (e: "keydown", event: KeyboardEvent): void;
}>();

// The card's own contenteditable <pre> — surfaced for the parent's scoped
// highlight collection (a declared child-ref contract, no querySelector).
const preEl = useTemplateRef<HTMLElement>("preEl");

// KC-34 — the model reaches the host through the driver's ONE seam, after the
// render (`flush: "post"`, so the ref is resolved and the write lands on the
// element this pass produced). The seam is idempotent in the text, so a render
// that changes nothing leaves a caret in the host undisturbed.
watchEffect(
    () => {
        syncHostSource(preEl.value, props.formattedCSS);
    },
    { flush: "post" },
);

defineExpose({ preEl });
</script>
