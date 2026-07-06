<template>
    <!-- T.D9 (OD-4 APPROVED, the P-HERO blessed reference — lane 01 "INK ON
         GRAPH PAPER") — the hero leaves the top band. The former seat
         (`lg:mt-[var(--work-area-top-offset)]`, inherited from the editor-shell
         header era) parked the H1 at y≈21 in the SAME band the top dock + the
         @mbabb pill occupy; the owner: "should be lower on the page, more
         towards the centre — it's OK if it sits a bit on top of the cube." The
         re-seat is the φ BAND, derived from the work-area chain (the K.W3
         M4/C5 rule — never a raw vh/px offset): the block top anchors at
         top-offset + 0.45 × work-area height on desktop (the H1 baseline lands
         ≈φ of the work area), 0.52 below lg (die upper ~45%, hero band under
         it). Left at the page gutter; overlap with the die's lower quadrant is
         WELCOME (the ruling says so); overlap with any dock is impossible by
         construction once the hero leaves the top band. pointer-events: none —
         the hero is ink, not chrome. Gated by proof:hero-two-focal (OWNER,
         successor of the retired hero-rung/-balance/-cls FROZEN locks). -->
    <div
        class="hero-band z-controls pointer-events-none absolute left-0 w-screen"
    >
        <!-- The poster line: Instrument Serif, the mega φ rung, TRUE single-
             weight ink (weight 400, --foreground, no depth-text costume — the
             T.D10 RULED ink correction: the face ships 400 ONLY; the T.D2
             root `font-synthesis: none` + the BG-6 @layer display-weight
             override make any other declaration a lie). Motion is the hero's
             only ornament: the per-CHAR wave (AnimatedText, T.D10) + the
             engine-dogfooded TypingDots pulse, one span away. -->
        <h1 class="hero-display text-display-mega p-0">
            <AnimatedText :text="title" />
            <span class="hero-dots"><TypingDots /></span>
        </h1>
        <!-- T.D11 (OD-4) — the deck joins the poster's own voice: Instrument
             Serif TRUE italic 400 (the ital@1 face is already loaded; zero new
             payload). The bold-italic system sans register ("AI-slop subtitle"
             under a 177px serif poster) dies. One family, two styles, the φ
             ladder read top-down: mega roman → title italic → title italic
             muted (the hint rides the SAME title rung — the landed T.D2 serif
             floor (≥28px desktop) makes the P-HERO heading rung serif-illegal;
             ink strength carries the deck→hint step instead of size. A named
             deviation in the T.D11 packet). -->
        <h2 class="start-screen-prose start-screen-subtitle hero-deck w-full">
            {{ subtitle }}
            <List class="hero-deck-icon inline" aria-hidden="true" />
            {{ subtitleSuffix }}
        </h2>
        <h2 v-if="hint" class="start-screen-prose hero-hint w-full">
            {{ hint }}
        </h2>
    </div>
    <!-- T.D12 (RULED, VERDICT #2 "remove this crap") — the @KEYFRAMES · LIVE
         typing card (kf-source-egg) is EXCISED: markup + ~140L scoped CSS +
         useHeroSourceEgg.ts, all deleted. Its red dot + red caret leave with it
         (the latent-red vocabulary, #16), the perpetual JS type-in interval
         leaves (#19), and the lower-left focal competitor leaves — the vacancy
         needs no replacement because the hero itself moved DOWN into that band
         (T.D9). The round-trip moat story belongs in a scene.
         proof:design-refinement's S1 home arm was re-cut in the same motion
         (the lane-18 lockstep the amiga arm got). -->
</template>

<script setup lang="ts">
import { List } from "@lucide/vue";
import AnimatedText from "./AnimatedText.vue";
import TypingDots from "./TypingDots.vue";

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
/* ── The φ-band seat (T.D9 / lane 01 F1 / the P-HERO blessed reference) ────────
   Derived ENTIRELY from the work-area chain: top-offset (the φ 0.382 slack
   split the docks + work-area card already ride) + a φ share of the work-area
   height. No raw vh/px magic number (the K.W3 M4/C5 ban holds — the 100dvh in
   the var() fallback is the chain's own saturation value, not a seat offset).
   The gutter is the lane's clamp — the poster hangs at the left reading edge. */
.hero-band {
    top: calc(
        var(--work-area-top-offset, 0px) + var(--work-area-height, 100dvh) *
            0.45
    );
    padding-inline: clamp(2rem, 5vw, 4.5rem);
}

/* ── Honest ink (T.D10 RULED / lane 01 F3) ────────────────────────────────────
   Instrument Serif ships weight 400 ONLY. The T.D2 theme core already lands
   `font-synthesis: none` at :root + the BG-6 @layer override on the
   text-display-* rungs; this scoped 400 is the hero's own belt-and-braces
   (dies into the --font-display-weight token when glass-ui ships BG-6). Color
   is --foreground — the depth-text lilac recolor + 4-step shadow stamp are
   GONE from the title AND the dots (zero `depth-text` in editor-shell/, the
   T.D10 grep clause). line-height 0.92 keeps the balanced two-line poster one
   tight optical unit (H.W4.S3, kept). */
h1.hero-display {
    line-height: 0.92;
    font-weight: 400;
    font-synthesis: none;
    color: var(--foreground);
}

/* The hero's MOBILE rung (J.W7a TYP-1, kept): below lg the mega rung's 86px
   floor fights the die at phone widths — step one φ tier down via the
   published --type-display-4 token (never a raw px). The φ band also drops to
   0.52 so the die keeps the upper ~45% (two focal planes, hero printing OVER
   the die's lower quadrant — overlap WELCOME per OD-4). */
@media (max-width: 1023px) {
    .hero-band {
        top: calc(
            var(--work-area-top-offset, 0px) +
                var(--work-area-height, 100dvh) * 0.52
        );
    }
    .hero-display {
        font-size: var(--type-display-4);
    }
}

/* ── The serif-italic deck ramp (T.D11 / lane 01 F4) ──────────────────────────
   Deck: display-face italic 400 @ --type-title, foreground at ~0.85.
   Hint: display-face italic 400 @ --type-title, muted (the SAME rung — the
   T.D2 serif floor rules the heading rung out for the display face; the muted
   ink is the step). No weight above 400 anywhere on the start screen
   (proof:hero-deck-voice). */
.hero-deck {
    margin-block-start: 0.75rem;
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    font-size: var(--type-title);
    line-height: 1.15;
    color: var(--foreground);
    opacity: 0.85;
}

.hero-hint {
    margin-block-start: 0.35rem;
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    font-size: var(--type-title);
    line-height: 1.15;
    color: var(--muted-foreground);
}

/* The engine-dogfooded ellipsis host: one unbreakable inline unit beside the
   last word (the dots never wrap apart from the title's final glyph). Owned
   HERE (the co-located scoped home) so the class is a resolved recipe, never a
   silent-flatten (proof:styling-idioms membership). */
.hero-dots {
    display: inline-block;
    white-space: nowrap;
}

/* The ☰ glyph sits inline at ~0.8em cap height — an icon voiced as a word. */
.hero-deck-icon {
    width: 0.8em;
    height: 0.8em;
    vertical-align: baseline;
}

/* F.W13.S1 (kept) — orphan-avoiding rag on the running prose. */
.start-screen-prose {
    text-wrap: pretty;
}

/* K.W3 U-K9 (kept; bounds re-derived for the serif deck) — balance the 2-line
   phone subtitle, bound its size on narrow phones. The lower bound is 1.5rem
   (24px): the T.D2 serif floor at the mobile viewport — the display face may
   never render below the smallest display rung (proof:font-census clause b).
   The hint takes the same phone clamp (same face, same floor). */
@media (max-width: 1023px) {
    .start-screen-subtitle {
        text-wrap: balance;
        font-size: clamp(1.5rem, 6.2cqi, var(--type-title));
    }
    .hero-hint {
        font-size: clamp(1.5rem, 5.4cqi, var(--type-title));
    }
}
</style>
