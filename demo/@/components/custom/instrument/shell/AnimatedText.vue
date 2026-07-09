<template>
    <!-- T P-HERO (OD-4 / lane 01 F2) — the PER-CHAR uplift rebirth, two-tier.
         The word-granular F.W16 split was REJECTED by the owner ("should uplift
         each individual char"): 3 word lumps heaving in the first 0.6s of a 5.8s
         cycle left the poster dead for ~5.2s. The rebirth restores the original
         per-char wave WITHOUT re-breaking the two recorded lessons:
         (a) a11y mirror (F.W16a) — ONE sr-only span carries the whole phrase to
             AT; the visual layer is aria-hidden. AT never hears the
             "S…e…l…e…c…t" glyph stream.
         (b) X-5 gap — Vue's `whitespace: 'condense'` strips whitespace-only text
             nodes between sibling spans. The inter-word gap is a per-word
             `margin-inline-end: 0.25em` (never a rendered space character), so
             the naive-split "Selectananimation" cannot recur.
         Two tiers: WORDS own wrapping + the gap (inline-block wrappers, so
         `text-wrap: balance` still breaks at real word boundaries); CHARS own
         the motion. Delay = GLOBAL char index (counted across words — the wave
         sweeps the whole line, never restarting per word) × ~55ms over one
         shared ~3.6s cycle: the sweep crosses ~17 glyphs in ~0.9s, rests, and
         repeats. Em-relative lift (−0.09em — the old −10px was rung-blind at
         177px). Transform-only, compositor-friendly; PRM rests everything. -->
    <span class="sr-only">{{ text }}</span>
    <span
        aria-hidden="true"
        :style="{ '--wave-cycle': `${cycleMs}ms` }"
    >
        <template v-for="(word, wi) in words" :key="`${wi}-${word.text}`">
            <span
                class="wave-word"
                :style="{
                    marginInlineEnd:
                        wi < words.length - 1 ? '0.25em' : undefined,
                }"
                ><span
                    v-for="(ch, ci) in word.chars"
                    :key="`${ci}-${ch}`"
                    class="wave-char"
                    v-bind="$attrs"
                    :style="{
                        animationDelay: `${(word.startIndex + ci) * offsetMs}ms`,
                    }"
                    >{{ ch }}</span
                ></span
            >
        </template>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

// $attrs bind to the per-char visual spans (the animated layer), not the host —
// decorative classes passed by a consumer still land on the moving glyphs.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        text: string;
        /** Per-char stagger step, ms of delay per global char index. */
        offsetMs?: number;
        /** The one shared wave cycle, ms. All chars ride the same clock. */
        cycleMs?: number;
    }>(),
    {
        offsetMs: 55,
        cycleMs: 3600,
    },
);

const { offsetMs, cycleMs } = props;

// WORDS carry a running GLOBAL char index (spaces excluded — 17 for the default
// "Select an animation") so the per-char delays are strictly monotone across
// the whole line: one wave, left to right, crossing word boundaries.
const words = computed(() => {
    let index = 0;
    return props.text
        .split(/\s+/)
        .filter((w) => w.length > 0)
        .map((w) => {
            const startIndex = index;
            index += w.length;
            return { text: w, chars: w.split(""), startIndex };
        });
});
</script>

<style scoped>
/* Words own wrapping: inline-block keeps each word unbreakable so the line
   breaks only at real word boundaries (the balance substrate). */
.wave-word {
    display: inline-block;
}

/* Chars own the motion: one shared cycle, per-char phase via animation-delay.
   The lift is em-relative so it scales with the rung (mega 177px → phone 54px).
   Peak at 6%, ease-out settle by 14%, rest to 100% — the sweep reads as one
   ripple crossing the line, then the poster holds still ~2.7s. */
.wave-char {
    display: inline-block;
    animation: charLift var(--wave-cycle, 3.6s) infinite both;
}

@keyframes charLift {
    0% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0.35, 0, 0.55, 1);
    }
    6% {
        transform: translateY(-0.09em);
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    14%,
    100% {
        transform: translateY(0);
    }
}

/* PRM guard: the hero is the LCP node; under prefers-reduced-motion every char
   rests at its 0%/100% frame (no wave) — the CSS mirror of the engine's
   withReducedMotion authority for this template-only hero. */
@media (prefers-reduced-motion: reduce) {
    .wave-char {
        animation: none;
    }
}
</style>
