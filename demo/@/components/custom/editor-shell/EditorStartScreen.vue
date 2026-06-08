<template>
    <div
        class="absolute left-0 top-0 z-controls mt-28 grid h-0 w-screen items-center gap-0 px-6 lg:mt-24 pointer-events-none"
    >
        <!-- H.W4.S3 — the hero on the AUDACIOUS φ rung. `text-display-4` (86px,
             the middle rung) → `text-display-mega` (φ^(9/2), peak 177px — the
             poster-hero tier glass-ui built for exactly this consumer). The host
             is now a PLAIN BLOCK (the former `grid p-0 lg:flex` put the ellipsis
             on its OWN grid row — the orphaned-`...` fragment, CP-HIGH-6); the
             title AnimatedText + the inline TypingDots now read as ONE optical
             block. `text-wrap: balance` (inherited from the `.text-*` family)
             balances "Select an / animation" to two lines; the scoped
             `line-height: 0.92` (below) tightens the two-line block at poster
             scale. NOT `.text-hero` (it is `white-space: nowrap` — a 3-word
             hero overflows). -->
        <h1 class="hero-display text-display-mega p-0">
            <AnimatedText
                class="depth-text"
                :text="title"
            ></AnimatedText>
            <!-- H.W6.S2 — the ellipsis is the dogfooded TypingDots primitive
                 (the old <AnimatedText class="dot-fade …"> + @keyframes dotFade
                 are DELETED, no legacy beside the replacement). H.W4.S3 keeps it
                 a SEPARATE inline host (WV-W4-MED-3 — NOT merged into the title
                 `:text` run, which would fade the title or leave the dots no
                 mount point); `depth-text` carries the cartoon shadow so the dots
                 keep it. TypingDots renders an `inline-flex` span, so it sits
                 inline-adjacent to the title within the plain block. The literal
                 "..." is TypingDots' static glyphs (S3 — opacity-driven, never a
                 keyframe value). --><span class="depth-text"><TypingDots /></span>
        </h1>
        <h2 class="start-screen-prose text-title w-full italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="start-screen-prose text-subheading w-full italic text-muted-foreground"
        >
            {{ hint }}
        </h2>
    </div>
</template>

<script setup lang="ts">
import { List } from "@lucide/vue";
import AnimatedText from "@components/custom/AnimatedText.vue";
import TypingDots from "@components/custom/TypingDots.vue";

// NOTE (H.W6): the former `ellipsis` string prop is gone — the trailing "..." is
// now the dogfooded <TypingDots/> primitive (a fixed three-dot blink), not a
// configurable text run. The title remains the word-granular AnimatedText hero.
withDefaults(
    defineProps<{
        title?: string;
        subtitle?: string;
        subtitleSuffix?: string;
        hint?: string;
    }>(),
    {
        title: "Select an animation",
        subtitle: "from the list",
        subtitleSuffix: "below, then press Play.",
        hint: undefined,
    },
);
</script>

<style scoped>
/* H.W4.S3 — tighten the two-line poster block at the mega rung. A demo-local
   leading override scoped to THIS hero `<h1>` ONLY (mirrors `.start-screen-prose`
   below) — NOT a glass-ui override of the shared `.text-*` family. At
   `text-display-mega` the default 1.1 leading leaves the two balanced lines
   ("Select an / animation") too airy for a poster block; 0.92 closes the
   inter-line gap so the hero reads as one tight optical unit. The Capsize
   metric-matched fallback (ALREADY-SOTA) scales with the rung, so this does not
   disturb the ~0 CLS swap. */
.hero-display {
    line-height: 0.92;
}

/* F.W13.S1 — `text-wrap: pretty` on the start-screen running prose (the
   subtitle + hint <h2>s, NOT the LCP <h1> hero — that is F.W16's balance-class
   substrate). These two headings are multi-line running prose ("from the list
   below, then press Play." + the optional hint), for which the orphan-avoidance
   `pretty` algorithm is the better fit than the short-heading `balance` glass-ui
   applies to the `.text-*` family. Pure progressive enhancement: Chrome/Safari
   get the improved rag, Firefox (no `text-wrap: pretty` support) falls back to
   the inherited `balance`/standard wrap, byte-identical to today. Scoped to the
   demo's own prose — NOT a glass-ui override of the shared `.text-*` utilities. */
.start-screen-prose {
    text-wrap: pretty;
}
</style>
