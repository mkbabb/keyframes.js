<template>
    <!-- J.W7a S1 (D6 / H3 + TYP-1) — the MOBILE hero parks in the TOP BAND: the
         fixed `mt-28` (112px — a magic offset that landed the text in the
         cube's reading plane at 375w, `home-mobile.png`) is replaced below lg
         by `pt-[var(--dock-top-band-reserve)]` — the SAME token the
         scene-switcher band + the mobile stage inset resolve, so the hero
         starts exactly under the dock pill and the cube recedes below it
         (CubeTarget's hero-backdrop band). Desktop keeps `lg:mt-24` —
         byte-identical layout at ≥lg. -->
    <div
        class="absolute left-0 top-0 z-controls pt-[var(--dock-top-band-reserve)] grid h-0 w-screen items-center gap-0 px-6 lg:pt-0 lg:mt-24 pointer-events-none"
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
             hero overflows).
             J.W7a S1 (D6 / TYP-1) — BELOW lg the hero steps DOWN one φ tier to
             the `--type-display-4` token (the scoped media rule below): the
             mega rung's mobile FLOOR (86px) is "too large for the 375px stage
             that also hosts the subject" (cross-typography TYP-1) — the two
             focal elements fought for the same pixels. The poster mega rung
             holds from lg up where the stage has room for both. The class
             stays the ONE mega rung (the H.W4 no-legacy contract); the mobile
             step consumes the published φ token, not a raw size. -->
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
        <!-- J.W7a S2 (D9 / H2) — the subtitle steps ONE φ-rung down
             (text-title 32.9px → text-heading 25.9px, still italic): at the
             former rung it sat only ~3× below the mega hero and "visually
             fights" it at desktop widths; the step restores a ≥5:1
             hero:subtitle ratio and lands the subtitle between the hero and
             the text-subheading hint — the φ ladder read top-down. -->
        <h2 class="start-screen-prose text-heading w-full italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="start-screen-prose text-subheading w-full italic text-muted-foreground"
        >
            {{ hint }}
        </h2>

        <!-- J.W7a S4 (D18 / H1, cross-hierarchy §e, glassui-adopt A4) — the
             published FourierField (glass-ui 3.9.0) suffuses the math motif
             into the home doorway's EMPTY left-half vacancy: an inverse-DFT
             epicycle trace — "drawing with circles", the most on-brand
             generative surface glass-ui ships an easing engine — at LOW
             presence in the calm field, parked lower-left BELOW the hero
             ladder and far from the cube (never over the moving subject — the
             §S4 anti-goal). Desktop/laptop only (the scoped rule): at phone
             widths the band belongs to the hero/subject split (D6). The hue
             resolves through the scene-accent seam (--ball-tone, falling back
             to the brand's curve violet) via the REQUIRED injected resolver,
             so dark mode retints for free; reduced-motion freeze is inherited
             from the primitive's useCanvas2D substrate. -->
        <div class="fourier-vacancy" aria-hidden="true">
            <FourierField
                variant="hero"
                seed="keyframes.js"
                color="var(--ball-tone, var(--ppmycota-primary, var(--primary)))"
                :color-resolver="defaultBlobColorResolver"
                :freeze="prefersReducedMotion"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import { List } from "@lucide/vue";
// J.W7a S4 (D18) — the published generative math motif + its REQUIRED colour
// seam (glass-ui 3.9.0 — a W7a consume, not a W7b edge).
import { FourierField } from "@mkbabb/glass-ui/fourier-field";
import { defaultBlobColorResolver } from "@mkbabb/glass-ui/color";
import AnimatedText from "@components/custom/AnimatedText.vue";
import TypingDots from "@components/custom/TypingDots.vue";

// J.W7c U-register verify r2 — FREEZE the generative field under reduced-motion.
// Two ends meet here: (1) it is the correct reduced-motion posture — a decorative
// animated math field must rest when the user prefers reduced motion (the same
// contract TypingDots/AnimatedText already honour); (2) it cleanly DODGES the
// pre-existing glass-ui RO→render init-order TDZ (handoff RF-16, `Cannot access
// 'C' before initialization`): FourierField's render reads `freeze || x.reducedMotion`,
// and a truthy `freeze` SHORT-CIRCUITS before the forward-`const` glass-ui reads,
// so the crash never arms on the reduced-motion branch. This is a CONSUMER-SIDE
// use of FourierField's OWN published `freeze` prop — NOT a glass-ui patch (inv-16
// holds). The durable upstream cure (RF-16) still lands on the next glass-ui bump;
// this consumer guard is the right posture regardless of that bump.
// (Merge note: the W4 fix-round-1 PRM mount-gate (v-if) was superseded by this
// freeze posture — the calm field stays PRESENT as a static resting frame for
// reduced-motion users instead of vanishing; one mechanism, the primitive's own.)
const reducedMotionPref = usePreferredReducedMotion();
const prefersReducedMotion = computed(
    () => reducedMotionPref.value === "reduce",
);

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

/* J.W7a S1 (D6 / TYP-1) — the hero's MOBILE rung. Below lg the mega rung's
   86px floor physically overlapped the cube at phone widths (`home-mobile.png`,
   the H3 collision); the hero steps one φ tier down by consuming glass-ui's
   published `--type-display-4` token (the same ladder, one rung lower — never
   a raw px/rem leaf). The `text-display-mega` class remains the single rung
   the markup carries; this is a viewport-scoped token consumption mirroring
   the scoped `line-height` above. */
@media (max-width: 1023px) {
    .hero-display {
        font-size: var(--type-display-4);
    }
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

/* J.W7a S4 (D18 / H1) — the FourierField's vacancy frame. The hero host is a
   zero-height absolute band (the children overflow it by design), so the
   field's box is sized in viewport units off the SAME left gutter the hero
   ladder rides (px-6 = 1.5rem): parked in the lower-left vacancy, well below
   the subtitle/hint ladder and left of the cube's center-right orbit. The
   published .fourier-field host is `position:absolute; inset:0` — it fills
   this positioned frame. Low presence: the calm-field opacity keeps the motif
   a whisper under the glass (the proportion rule — the trail accents, never
   competes). */
.fourier-vacancy {
    /* Desktop/laptop only — declared HERE (not via `hidden lg:block`: the
       built cascade carries a second `.hidden` rule after the lg variant, so
       the utility pair loses the order fight; the scoped rule is the honest
       single home for this one responsive decision). */
    display: none;
    position: absolute;
    left: 1.5rem;
    top: 62dvh;
    width: min(30vw, 26rem);
    height: min(28dvh, 18rem);
    opacity: 0.6;
    pointer-events: none;
}
@media (min-width: 1024px) {
    .fourier-vacancy {
        display: block;
    }
}
</style>
