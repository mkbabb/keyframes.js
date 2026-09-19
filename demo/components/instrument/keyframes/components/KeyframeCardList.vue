<template>
    <!-- KC-21 (W6-M) — THE LIST OWNS ITS OWN RHYTHM. Two defects in one class:
         the interval between cards was DOUBLE-ENCODED (a void AND a hairline)
         and it measured 4.1× the demo's 8px frame — because `display: contents`
         dissolved this box, so the cards and the `<Separator>`s became direct
         items of the PARENT's `grid gap-4` and every card-to-card interval paid
         the parent gap TWICE (card → 16px → hairline → 16px → card = a 2rem void
         plus the rule, ≈33px against an 8px frame). The sharper half is the one
         the row names: by choosing `contents` the list owned no layout authority
         over dividers it renders itself, so the number lived in a file that does
         not know the dividers exist.
         The box comes back and takes the authority with it: ONE gap, declared
         here, at the frame — and since this component is its parent's only grid
         item either way (framed and bare both wrap it alone), no sibling
         spacing moves. The RENDERED pixels are KF.W9's per the row; what is
         settled here is which file owns the number. -->
    <div class="grid gap-2">
        <template
            v-for="(s, i) in frameStrings"
            :key="frames[i]?.id ?? i"
        >
            <KeyframeCard
                :ref="(el: any) => setCardRef(i, el)"
                :frame-string="s"
                :formatted-c-s-s="formattedStrings[i] ?? s"
                :frame-start="selectorText(frames[i].start)"
                :index="i"
                @update-start="(val) => emit('updateStart', { val, index: i })"
                @update-c-s-s="(value) => emit('updateCSS', { value, index: i })"
                @remove="(e) => emit('remove', { event: e, index: i })"
                @keydown="(e) => emit('keydown', e)"
            />

            <Separator
                class="w-full"
                v-if="i < frameStrings.length - 1"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";
import { Separator } from "@mkbabb/glass-ui";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
// KC-1 — `selectorText` is the CANONICAL serializer for a `KeyframeSelector`:
// the one the library writes its own CSS with (`format.ts`), the one the write
// path round-trips through (`useKeyframeOps.ts:111`), and the one
// `value4-editor-boundary.test.ts` pins. FE-3's `startScalar` extracted `.value`
// instead, which is a THIRD derivation and a half-cure: it rendered the raw
// fraction `0.5` where the commit path demands `50%`, it fell through to
// `"[object Object]"` for a named selector (`{kind:"named"}` carries `name`, not
// `value`), and it left the canonical renderer bypassed at the very seam whose
// job is projecting the union. One serializer, four call sites.
import { selectorText } from "@utils/keyframeSelector";
import KeyframeCard from "./KeyframeCard.vue";

const props = defineProps<{
    frameStrings: string[];
    frames: any[];
}>();

// L.W8 S1 ED-3 — `formatCSSKeyframeString` (a value.js-free pure-string trim) is
// HEAVY-surface (it lives in the engine chunk), so it rides loadAnimationEngine()
// rather than a deep @src import. It resolves within microtasks of mount (well
// before any card renders), and until then the raw frame string is shown — an
// honest pre-format frame, never a blank. Each formatted string is derived
// reactively from `frameStrings` once the formatter is in hand.
const formatFn =
    shallowRef<((keyframe: string) => string) | null>(null);
void loadAnimationEngine().then((engine) => {
    formatFn.value = engine.formatCSSKeyframeString;
});

const formattedStrings = computed(() =>
    props.frameStrings.map((s) => (formatFn.value ? formatFn.value(s) : s)),
);

const emit = defineEmits<{
    (e: "updateStart", val: { val: string; index: number }): void;
    (e: "updateCSS", val: { value: string; index: number }): void;
    (e: "remove", val: { event: Event; index: number }): void;
    (e: "keydown", event: KeyboardEvent): void;
}>();

// The KeyframeCard child instances — a declared child-ref contract. Each card
// exposes its root `$el` (for the remove animation) and its `preEl` (the <pre>
// code block, for scoped highlighting) via defineExpose.
const cardInstances = ref<any[]>([]);
const setCardRef = (i: number, el: any) => {
    cardInstances.value[i] = el;
};

// Each card's root `$el`, derived for the remove animation + highlight scope.
const cardRefs = computed(() =>
    cardInstances.value.map((c) => c?.$el ?? c),
);

/** The list's own <pre> code blocks — collected from the cards' exposed `preEl`
 *  child refs (no querySelectorAll). */
const getPreElements = (): HTMLElement[] =>
    cardInstances.value
        .map((c) => c?.preEl)
        .filter((el): el is HTMLElement => el != null);

defineExpose({ cardRefs, getPreElements });
</script>
