<template>
    <!-- T P-HERO (OD-4 / lane 01 F2) — the PER-CHAR uplift rebirth, two-tier.
         The word-granular F.W16 split was REJECTED by the owner ("should uplift
         each individual char"): 3 word lumps heaving in the first 0.6s of a 5.8s
         cycle left the poster dead for ~5.2s. The rebirth restores the original
         per-char wave WITHOUT re-breaking the two recorded lessons:
         (a) a11y mirror (F.W16a) — ONE sr-only span carries the whole phrase to
             AT; the visual layer is aria-hidden. AT never hears the
             "S…e…l…e…c…t" glyph stream. The mirror is ALSO the only text a
             find-in-page query with spaces can match (KF-AT-19): the visual
             layer's textContent is the words run together (see (b)), and the
             mirror is a clipped 1×1 box — the highlight lands on an invisible
             box by design; the rendering of that highlight is the SS-13 P-11
             probe's, not this file's.
         (b) X-5 gap — Vue's `whitespace: 'condense'` strips whitespace-only text
             nodes between sibling spans, so the RENDERED inter-word gap is a
             per-word `margin-inline-end` (a stylesheet rule below), never a
             rendered space character. The invariant is about RENDERED ink, and
             ONLY that (KF-AT-5): the visual layer's textContent IS
             "Selectananimation", the h1's full textContent is the mirror + that
             run + the dots' "..." — clipboard and find-in-page arms are SS-13
             P-2 / P-11.
         Two tiers: WORDS own wrapping + the gap; CHARS own the motion. Delay =
         GLOBAL char index (counted across words — the wave sweeps the whole
         line, never restarting per word) × the producer's stagger register over
         one shared cycle. Em-relative lift (the old −10px was rung-blind at
         177px). Transform-only, compositor-friendly.

         S-5 RULING (KF-AT-6, W6-I — WRITTEN, TEMPLATE-ONLY): this hero does NOT
         adopt the library's `splitText`. The five-constraint set is carried and
         measured: (1) KF-AT-8 (`applyA11y` stamping `role="img"` over the
         implicit heading role) IS cured in `split-text.ts` at this tree
         (`hasOwnNamingRole`, X.KF.W5 B-1/G-ROLE) — the named BLOCKER no longer
         blocks; (2) KF-AT-11 stands — `splitText` creates fragments without this
         SFC's `data-v-*` scope id, so the scoped `.wave-char` motion below could
         never reach them; (3) KF-AT-10 stands — the live `heroReady` gate
         (`scripts/observe/demo/usability.mjs`) polls `h1 .wave-char` and reads
         a two-tier WORD/CHAR DOM that `splitText` (`kf-split`, no word tier)
         does not emit, and KF.W4 has handed NO atomic gate-with-component
         migration order; (4) KF-AT-9 (mutate-before-refuse) is a library
         obligation, KF.W5's; (5) the zero-teardown price — the template already
         owns mount/unmount for free. With (2), (3) and (5) unmet, adoption is
         UNEXECUTABLE as written; the hero stays template-only and the decision
         is recorded here, once. The grapheme decision (KF-AT-3, `w.split("")`)
         is NOT spent here: it is ATOMIC with KF.W4's oracle repair (KF-AT-4 —
         `usability.mjs` counts the same UTF-16 units), and landing one half
         would green the gate on two wrong counters.

         CONTRACT MOTION (the S-5 roster: delete, validate, or react — ONE):
         DELETE. The two public knobs (`offsetMs`, `cycleMs`) were JSDoc'd,
         frozen at setup by a non-reactive destructure (KF-AT-1), reached the
         cascade unvalidated (KF-AT-15: a negative or NaN `cycleMs` was a
         silently dead poster) and were consumed by NO caller
         (EditorStartScreen.vue binds only `:text`). They are gone; the stagger
         and the cycle are the component's own CSS registers below, and the
         stagger reads the producer's `--motion-stagger-default` (KF-AT-16). -->
    <span class="wave-text">
        <span class="sr-only">{{ text }}</span>
        <span aria-hidden="true">
            <template v-for="(word, wi) in words" :key="`${wi}-${word.text}`">
                <span class="wave-word"
                    ><span
                        v-for="(ch, ci) in word.chars"
                        :key="`${ci}-${ch}`"
                        class="wave-char"
                        :style="{ '--wave-i': word.startIndex + ci }"
                        >{{ ch }}</span
                    ></span
                >
            </template>
        </span>
    </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Fallthrough attributes land ONCE, on the single root (KF-AT-2): the old
// `v-bind="$attrs"` inside the char `v-for` replicated every attribute onto N
// aria-hidden glyphs (`id` → N duplicates, listeners → N dead, `aria-*`
// unreachable) while the accessible-name mirror received nothing, and pinned a
// FULL_PROPS patch flag on every glyph vnode. With one root and Vue's default
// fallthrough, an `id` or `aria-*` reaches an element that CONTAINS the mirror,
// and a decorative class reaches the whole poster.
const props = defineProps<{
    /**
     * The phrase. EMPTY-STATE DECISION (KF-AT-18): an empty or whitespace-only
     * `text` renders an empty mirror and no glyphs — an `<h1>` with no
     * accessible name, exactly as an empty heading would be. This component
     * neither invents a name nor hides the heading: the name is the CONSUMER's
     * contract (EditorStartScreen's `title` is a required string). The
     * prescribed `splitText` cure was worse (`role="img"` with no name, axe
     * `role-img-alt`) and is not taken.
     */
    text: string;
}>();

// WORDS carry a running GLOBAL char index (spaces excluded — 17 for the default
// "Select an animation") so the per-char delays are strictly monotone across
// the whole line: one wave, left to right, crossing word boundaries. The index
// is emitted as ONE number per glyph (`--wave-i`); the delay arithmetic lives
// in the stylesheet, against the registers, not in the render function.
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
/* The hero's motion registers, in ONE place (KF-AT-16 — five raw constants
   bypassed the producer's shipped registers in the one hero whose GEOMETRY is
   fanatically tokenized):
   · step   — the producer's stagger register (80ms), per global char index;
   · cycle  — the one shared wave clock (KF-AT-26(b): the `var()` fallback that
              used to sit on `animation` was dead code — the property was set
              unconditionally from a prop; it is now a register with no
              fallback, defined here, inherited by every glyph);
   · lift   — em-relative so it scales with the rung (mega 177px → phone 54px),
              and MULTIPLIED by the producer's `--motion-weight` (0.618 at rest,
              the app-drivable, NON-binary authority — the same idiom
              `.cartoon-cast` and `.glass-chip--interactive` use). Setting
              `--motion-weight: 0` on any ancestor stills the wave in place:
              that is the in-content pause WCAG 2.2.2 asks for (KF-AT-17),
              reachable from the app without a media query. The authored
              amplitude is normalised against the register's rest value so the
              poster reads exactly as tuned at the default weight. */
.wave-text {
    --wave-step: var(--motion-stagger-default, 80ms);
    --wave-cycle: 3600ms;
    --wave-lift: calc(-0.09em * var(--motion-weight, 0.618) / 0.618);
}

/* Words own wrapping. `inline-block` makes each word an ATOMIC INLINE, so the
   line prefers to break BETWEEN words (a soft wrap opportunity on either side of
   the box); it does NOT make a word unbreakable (KF-AT-13, CSS Text 3 §5.1) — a
   word wider than the line still breaks mid-word at the box's min-content,
   which is one glyph. That weaker form is the contract, on purpose:
   `white-space: nowrap` was REJECTED (K8) because with `overflow-wrap` unset it
   turns a graceful mid-word wrap into horizontal overflow on the LCP node. The
   gap between words is a stylesheet rule (KF-AT-20), never N inline styles. */
.wave-word {
    display: inline-block;
}

.wave-word:not(:last-child) {
    margin-inline-end: 0.25em;
}

/* Chars own the motion: one shared cycle, per-char phase = index × step.
   Peak at 6%, ease-out settle by 14%, rest to 100% — the sweep reads as one
   ripple crossing the line, then the poster holds still. At the registers
   above and the default 17-glyph title that is: sweep = 16 × 80ms ≈ 1.28s,
   settle = 14% × 3.6s ≈ 0.5s, rest ≈ 3.6 − 1.28 − 0.5 ≈ 1.8s (KF-AT-25: the
   figure is DERIVED from the registers, never quoted — change a register and
   re-derive). */
.wave-char {
    display: inline-block;
    animation: charLift var(--wave-cycle) infinite both;
    animation-delay: calc(var(--wave-i, 0) * var(--wave-step));
}

@keyframes charLift {
    0% {
        transform: translateY(0);
        animation-timing-function: cubic-bezier(0.35, 0, 0.55, 1);
    }
    6% {
        transform: translateY(var(--wave-lift));
        animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    14%,
    100% {
        transform: translateY(0);
    }
}

/* PRM: the hero is the LCP node. Under prefers-reduced-motion the weight goes
   to ZERO on this host (the producer's own per-component idiom, so the lift
   computes to 0 and the poster stands at rest by the SAME authority the app
   would use), and the animation is dropped so the compositor does no work for
   an invisible wave. Not a second, binary mirror of a non-binary authority
   (KF-AT-16): the weight IS the authority; `animation: none` is only the
   idle-cost arm. */
@media (prefers-reduced-motion: reduce) {
    .wave-text {
        --motion-weight: 0;
    }
    .wave-char {
        animation: none;
    }
}
</style>
