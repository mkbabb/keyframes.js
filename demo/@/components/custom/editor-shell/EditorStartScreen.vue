<template>
    <!-- J.W7a S1 (D6 / H3 + TYP-1) — the MOBILE hero parks in the TOP BAND: the
         fixed `mt-28` (112px — a magic offset that landed the text in the
         cube's reading plane at 375w, `home-mobile.png`) is replaced below lg
         by `pt-[var(--dock-top-band-reserve)]` — the SAME token the
         scene-switcher band + the mobile stage inset resolve, so the hero
         starts exactly under the dock pill and the cube recedes below it
         (CubeTarget's hero-backdrop band). Desktop keeps `lg:mt-24` —
         byte-identical layout at ≥lg. -->
    <!-- K.W3 M4/C5 — the hero VERTICAL position folds into the work-area chain.
         The former `lg:mt-24` (a raw 6rem Tailwind margin — a magic offset
         coupling the hero to a fixed number instead of the layout's own optical
         band) is REPLACED at ≥lg by `lg:mt-[var(--work-area-top-offset)]`: the
         hero now parks at the SAME optical top offset the work-area card +the top
         dock anchor derive from (the φ 0.382 slack split), so the hero rides the
         layout chain, not a hardcoded number. Mobile keeps the
         `pt-[var(--dock-top-band-reserve)]` top-band park (D6 / unchanged).
         K.W4 S8 (U-K20) — the hero COMPOSITION is now the title ladder ALONE: the
         J-added FourierField (the lower-left epicycle field) is REMOVED. The
         lower-left vacancy is left as HONEST blank grid (the graph-paper substrate
         alone — the user's intent is clearance, not substitution; two math
         backgrounds is one too many). No fabricated replacement. -->
    <div
        class="absolute left-0 top-0 z-controls pt-[var(--dock-top-band-reserve)] grid h-0 w-screen items-center gap-0 px-6 lg:pt-0 lg:mt-[var(--work-area-top-offset)] pointer-events-none"
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
        <h2 class="start-screen-prose start-screen-subtitle text-heading w-full italic">
            {{ subtitle }}
            <List class="inline"></List> {{ subtitleSuffix }}
        </h2>
        <h2
            v-if="hint"
            class="start-screen-prose text-subheading w-full italic text-muted-foreground"
        >
            {{ hint }}
        </h2>

        <!-- K.W4 S8 (U-K20) — the FourierField that formerly suffused the
             lower-left vacancy is REMOVED. The vacancy is HONEST blank grid: the
             two-tier graph-paper substrate alone reads as the math texture (the
             grid-opacity dial is Lane B's). The hero is the title ladder + the
             subject; no fabricated replacement, no second math background. -->
    </div>
</template>

<script setup lang="ts">
import { List } from "@lucide/vue";
import AnimatedText from "@components/custom/AnimatedText.vue";
import TypingDots from "@components/custom/TypingDots.vue";

// K.W4 S8 (U-K20) — the FourierField + its REQUIRED `defaultBlobColorResolver`
// colour seam are REMOVED (the user rejected the J-added math field; the hero is
// the title ladder + the HONEST blank-grid vacancy). With the field gone, the
// `usePreferredReducedMotion` + `computed` imports and the RF-16 freeze-guard
// (the consumer-side `:freeze` short-circuit that dodged the glass-ui RO→render
// init-order TDZ) are MOOT and removed with it — there is no animated field left
// to freeze. The durable upstream RF-16 cure is recorded in the AX-handoff ledger;
// removing the only consumer of the freeze prop leaves no live use here.

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

/* K.W3 U-K9 — cure the home subtitle's ragged 2-line wrap at phone width
   (≈390px the subtitle "from the list [icon] below, then press Play." broke to
   two lines with an orphan word at the `text-heading` rung). The cure, scoped
   to phone width ONLY and to the SUBTITLE only (the hint keeps its `pretty`
   running-prose wrap):
     • `text-wrap: balance` — distributes the line break evenly so a 2-line
       subtitle reads as two balanced lines, never an orphan tail (balance is the
       short-heading algorithm; pretty is the running-prose one — the subtitle is
       a heading, so balance is the right fit here, overriding the inherited
       `.start-screen-prose` pretty at this width);
     • a modest size clamp `clamp(1.25rem, 6.2cqi, var(--type-heading))` so the
       subtitle steps down just enough on a narrow phone to fit, capped at the
       published --type-heading rung token at wider phone widths (NEVER above it,
       and NEVER changing the FONT FAMILY — the text-heading voice is untouched,
       only the responsive SIZE on this one heading is bounded). cqi resolves
       against the home container; on a non-container ancestor it falls back to
       svi, still bounding the phone case. */
@media (max-width: 1023px) {
    .start-screen-subtitle {
        text-wrap: balance;
        font-size: clamp(1.25rem, 6.2cqi, var(--type-heading));
    }
}

/* K.W4 S8 (U-K20) — the `.fourier-vacancy` frame is REMOVED with the field it
   positioned. The lower-left quadrant is now the unadorned graph-paper substrate
   (the honest blank-grid vacancy); no positioned host remains. */
</style>
