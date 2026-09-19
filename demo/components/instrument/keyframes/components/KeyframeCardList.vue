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
    <!-- KC-8 / KC-9 — THE ROWS COME FROM THE MODEL, and that is what keeps the
         cards MOUNTED. The list used to take its row set from
         `templateFrameStrings`, an asynchronously rebuilt PROJECTION of the
         frames, which every commit cycle writes twice: blank, then refill
         (`useKeyframesParsing.ts:50` — KF-KE-25, `.c`'s row to delete). The
         blank's flush is guaranteed to render before the refill's continuation
         can queue, so the v-for rendered ZERO rows and every card — including
         the `<pre>` the user was typing in — was unmounted and rebuilt about
         once a second, taking caret, selection, undo and focus with it.
         Iterating the frames instead makes a projection pass a PROP UPDATE
         rather than a row-set change: the keys are the frame ids, the cards are
         patched in place, and an absent projection is passed down as ABSENT
         (never laundered into `""`), so the card leaves its host alone until the
         refill lands. When the refilled text is identical — the common case —
         nothing is written to the DOM at all.
         What this does NOT claim: `frames` is a `markRaw` array, so the render
         is still driven by `frameStrings`' churn rather than by the frames
         themselves. That is sound because every mutation site calls
         `updateAllStrings()`, and it is exactly KC-29's remaining architectural
         row — one `ref` of row records, owned where the projection is built. -->
    <div class="grid gap-2">
        <template
            v-for="(frame, i) in frames"
            :key="frame.id"
        >
            <KeyframeCard
                :ref="(el: any) => setCardRef(i, el)"
                :frame-string="frameStrings[i]"
                :formatted-c-s-s="formattedStrings[i]"
                :frame-start="selectorText(frame.start)"
                :index="i"
                :can-remove="frames.length > 1"
                @update-start="(val) => emit('updateStart', { val, index: i })"
                @update-c-s-s="(value) => emit('updateCSS', { value, index: i })"
                @remove="(e) => onRemove(e, i)"
                @keydown="(e) => emit('keydown', e)"
            />

            <!-- KC-19 + KC-22 — the rules between the cards are DECORATIVE, and
                 they say so. `decorative` unset made reka emit
                 `role="separator"`, so N stops published N−1 unnamed separator
                 nodes over rows that carried no grouping semantics at all; the
                 naming half of that pair landed with the card's own
                 `role="group"`, and this is the other half. The `w-full` went
                 with it: the producer's own rule already sets
                 `inline-size: 100%`, the grid stretches it regardless, and it
                 re-stated a logical property physically. -->
            <Separator
                decorative
                v-if="i < frames.length - 1"
            />
        </template>

        <!-- KC-10 — the removal ANNOUNCES. A destructive command whose whole
             feedback was "the row is gone" told a screen-reader user nothing at
             all, and the demo's only live regions were CopyButton's and the
             app skeleton's. Same idiom as CopyButton's, one level up, because
             the set — not the card — is what changed. -->
        <span
            class="sr-only"
            role="status"
            aria-live="polite"
            >{{ removalMessage }}</span
        >
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUpdate, ref, shallowRef, watch } from "vue";
import { Separator } from "@mkbabb/glass-ui";
import type { TemplateAnimationFrame } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";
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

// KC-17 — the frames carry the library's OWN published type. `any[]` was not a
// shortcut in a leaf: it is the one file whose job is projecting the selector
// union, and `any` disabled `noUncheckedIndexedAccess` over exactly the array
// whose stale-index reads this unit spent two rows on. `TemplateAnimationFrame`
// is type-only and lives on the light barrel, so nothing is added to the graph.
const props = defineProps<{
    frameStrings: string[];
    frames: TemplateAnimationFrame<any>[];
}>();

// KC-16 — `formatCSSKeyframeString` is read from the WARMED engine, the way the
// parent editor reads its own heavy symbols one file up. The async loader this
// replaces defended a transient that cannot occur: the parent calls the
// throwing-synchronous `kfEngine()` at `<script setup>` top level, so no card
// can render before the warm resolves, and the whole guard — a ref, a promise, a
// null branch, a `?? s` fallback and six lines of comment claiming an "honest
// pre-format frame, never a blank" for a window that does not exist (KC-33) —
// bought nothing. Each formatted string stays derived from `frameStrings`.
const { formatCSSKeyframeString } = kfEngine();

const formattedStrings = computed(() =>
    props.frameStrings.map((s) => formatCSSKeyframeString(s)),
);

const emit = defineEmits<{
    (e: "updateStart", val: { val: string; index: number }): void;
    (e: "updateCSS", val: { value: string; index: number }): void;
    (e: "remove", val: { event: Event; index: number }): void;
    (e: "keydown", event: KeyboardEvent): void;
}>();

/**
 * KC-10 — REMOVAL RESTORES FOCUS AND ANNOUNCES.
 *
 * The whole removal path contained no focus call: the clicked control left the
 * document with the row, focus fell to `<body>`, and a keyboard user was
 * returned to the top of the page with no statement that anything had happened.
 * The list is the party that knows both facts — which stop went and which
 * neighbour inherits its place — so it owns both, and neither reaches across
 * into the editor's own removal handler.
 *
 * The move is armed at the emit and spent when the row set actually shrinks,
 * because between those two moments the editor awaits a ~700 ms exit animation;
 * watching the length rather than the click is what makes this independent of
 * that gate (KF-KE-7 — `.c`'s row).
 */
const removalMessage = ref("");
let pendingFocusIndex: number | null = null;
let removedLabel = "";

const onRemove = (event: Event, index: number) => {
    const frame = props.frames[index];
    if (frame !== undefined && props.frames.length > 1) {
        // The next stop inherits the place; removing the tail falls back one.
        pendingFocusIndex = index < props.frames.length - 1 ? index : index - 1;
        removedLabel = selectorText(frame.start);
    }
    emit("remove", { event, index });
};

watch(
    () => props.frames.length,
    (now, before) => {
        if (now >= before) return;

        removalMessage.value = `Keyframe at ${removedLabel} removed; ${now} remaining.`;

        const target = pendingFocusIndex;
        pendingFocusIndex = null;
        if (target === null) return;

        void nextTick(() => {
            cardInstances.value[target]?.removeEl?.focus();
        });
    },
);

/**
 * KC-28 — THE CHILD-REF CONTRACT, AS THE CHILD ACTUALLY DECLARES IT.
 *
 * This comment used to promise `$el` "via defineExpose" and the card exposed
 * `{ preEl }` alone; `$el` came from Vue's instance surface regardless, so the
 * remove animation ran on an accident with no single-root guarantee behind it.
 * The card declares all three handles now — `rootEl` (the remove animation),
 * `preEl` (the scoped highlight collection) and `removeEl` (KC-10's focus
 * hand-off) — and this list reads exactly those, never `$el`, never a
 * `querySelector`.
 */
interface CardExposed {
    rootEl?: HTMLElement | null;
    preEl?: HTMLElement | null;
    removeEl?: HTMLElement | null;
}

// KC-18 — `shallowRef`, not `ref`: these are component public instances, and
// deep reactivity over them is safe only by accident of the child carrying a
// `defineExpose` (its markRaw'd expose proxy). Nothing here reads a card's
// internals, so nothing needs them tracked.
const cardInstances = shallowRef<(CardExposed | null)[]>([]);

// KC-15 / KC-36 — REBUILT each patch, never patched in place. Index assignment
// alone never truncates, so after any removal the array kept its historical
// maximum length: deleting the last row then took the `frameIx + 1` arm against
// a stale tail and handed `setTargets(null)` a corpse, half-playing the exit
// choreography for the rest of the session. Truncating inside `setCardRef` is
// unsound (Vue's patch order is not monotonic — a sync-from-end seats high
// indices first), which is why the rebuild is armed BEFORE the patch and the
// per-card closures merely refill it.
onBeforeUpdate(() => {
    cardInstances.value = [];
});

const setCardRef = (i: number, el: CardExposed | null) => {
    // A card that is LEAVING fires its ref with `null`, and it fires it after
    // the survivors have already re-seated — so writing that null would blank
    // the slot a surviving card has just taken, which is how KC-10's focus
    // hand-off lands on `<body>` instead of the neighbour. With the rebuild
    // above there is nothing for a null to clear: the array starts every patch
    // empty and only live cards refill it.
    if (el === null) return;
    cardInstances.value[i] = el;
};

/** Each card's root element — the remove animation's targets. */
const cardRefs = computed(() =>
    cardInstances.value.map((c) => c?.rootEl ?? null),
);

/** The list's own <pre> code blocks — collected from the cards' exposed `preEl`
 *  child refs (no querySelectorAll). */
const getPreElements = (): HTMLElement[] =>
    cardInstances.value
        .map((c) => c?.preEl)
        .filter((el): el is HTMLElement => el != null);

defineExpose({ cardRefs, getPreElements });
</script>
