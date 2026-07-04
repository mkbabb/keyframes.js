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
        <h1
            ref="heroEl"
            class="hero-display text-display-mega p-0"
        >
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
             subject; no fabricated replacement, no second math background.

             L.W11.S1 — the EASTER EGG fills that vacancy with the RIGHT one
             thing: a quadrant-sized GLASS card that TYPES its own @keyframes
             block in Fira Code (a blinking --accent-red caret), then the engine
             parses it (CSSKeyframesAnimation), lifts the hero word to each
             translateY, and format.ts serializes it BACK to a CSS string on a
             ~6s round-trip loop — the moat (parse → animate → get the CSS back)
             made visible BESIDE the hero, never displacing it. Hover restarts
             the compile; PRM rests the completed block statically. -->
        <div
            class="kf-source-egg source-typing-card pointer-events-auto"
            :class="{ 'kf-source-egg--prm': prefersReduced }"
            @pointerenter="recompile"
            aria-hidden="true"
        >
            <div class="kf-source-egg__chrome">
                <span class="kf-source-egg__dot"></span>
                <span class="kf-source-egg__label">@keyframes · live</span>
            </div>
            <pre
                class="kf-source-egg__code"
            ><code>{{ typedSource }}<span class="kf-source-egg__caret" :class="{ 'kf-source-egg__caret--blink': caretBlink }"></span></code></pre>
            <div
                class="kf-source-egg__out"
                :class="{ 'kf-source-egg__out--show': serializedOut }"
            >
                <span class="kf-source-egg__out-arrow">// serialized →</span>
                {{ serializedOut }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import { loadAnimationEngine } from "@mkbabb/keyframes.js";
import { List } from "@lucide/vue";
import AnimatedText from "./AnimatedText.vue";
import TypingDots from "./TypingDots.vue";
import { useHeroSourceEgg } from "./useHeroSourceEgg";

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

// ── L.W11.S1 EASTER EGG — the live @keyframes source card (colocated sub-unit) ─
// The lower-left vacancy gets the RIGHT one thing: a glass card that TYPES its own
// @keyframes block, the REAL engine parses it (CSSKeyframesAnimation), lifts the
// hero to each translateY, and format.ts serializes it BACK to a CSS string — the
// moat as a quiet ~6s loop beside the hero. The orchestration lives in
// useHeroSourceEgg; `loadAnimationEngine` is injected here so this SFC keeps the
// dogfood edge (the engine the library ships, not a hand-rolled rAF). PRM-snapped.
const heroEl = useTemplateRef<HTMLElement>("heroEl");
const { typedSource, serializedOut, caretBlink, prefersReduced, recompile } =
    useHeroSourceEgg(() => heroEl.value, loadAnimationEngine);
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

/* ── L.W11.S1 — the live @keyframes source card (the egg) ─────────────────────
   A quadrant-sized glass card pinned to the lower-left vacancy. It overlaps the
   graph major-grid (layered transparency, not a tidy cell) and sits beside the
   hero. The Fira-Code block types itself; the caret is the crayon --accent-red.
   The host <h1>/overlay is pointer-events:none — the card re-enables pointer
   events for the hover-recompile. Hidden below lg (the mobile column has no room
   beside the receded cube — the TYP-1 collision the J-tranche solved; the
   round-trip story is desktop-only, a reward for the larger canvas). */
.kf-source-egg {
    position: fixed;
    left: clamp(1rem, 4vw, 3.5rem);
    bottom: clamp(5rem, 12vh, 8rem);
    z-index: var(--z-content);
    width: min(24rem, 34vw);
    max-width: 92vw;
    padding: 0.65rem 0.8rem 0.7rem;
    border-radius: var(--radius-card, 0.75rem);
    /* the cartoon+quiet glass register: a translucent tinted plate + the cartoon
       depth shadow the demo's control surfaces wear */
    background: color-mix(in srgb, var(--card, white) 82%, transparent);
    backdrop-filter: blur(8px) saturate(1.1);
    -webkit-backdrop-filter: blur(8px) saturate(1.1);
    box-shadow:
        inset 0 0 0 1px color-mix(in srgb, var(--border) 70%, transparent),
        0 2px 0 0 color-mix(in srgb, var(--border) 50%, transparent),
        0 10px 28px -12px color-mix(in srgb, black 40%, transparent);
    color: var(--foreground);
    /* a quiet entrance: the card fades up under the hero (the orchestrated load) */
    animation: kf-source-rise 700ms var(--ease-standard, ease) 240ms both;
}
@media (max-width: 1023px) {
    .kf-source-egg {
        display: none;
    }
}
@media (prefers-reduced-motion: reduce) {
    .kf-source-egg {
        animation: none;
    }
}
@keyframes kf-source-rise {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.kf-source-egg__chrome {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.45rem;
    font-family: var(--font-mono);
    font-size: var(--type-micro);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted-foreground);
    opacity: 0.8;
}
.kf-source-egg__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--accent-red, var(--color-progress));
    box-shadow: 0 0 6px -1px var(--accent-red, var(--color-progress));
}
.kf-source-egg__label {
    line-height: 1;
}

.kf-source-egg__code {
    margin: 0;
    font-family: var(--font-mono);
    font-size: clamp(0.66rem, 0.9vw, 0.8rem);
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--foreground);
    min-height: 6.5em; /* reserve the block height so the type-in does not jump */
}
.kf-source-egg__code code {
    font-family: inherit;
}

/* the typed caret — the crayon --accent-red, the page's motion-authority red */
.kf-source-egg__caret {
    display: inline-block;
    width: 0.5ch;
    height: 1.05em;
    margin-left: 0.04em;
    transform: translateY(0.16em);
    background: var(--accent-red, var(--color-progress));
    border-radius: 1px;
}
@media (prefers-reduced-motion: no-preference) {
    .kf-source-egg__caret--blink {
        animation: kf-caret-blink 1s steps(1, end) infinite;
    }
}
@keyframes kf-caret-blink {
    0%,
    50% {
        opacity: 1;
    }
    50.01%,
    100% {
        opacity: 0;
    }
}

/* the round-trip's "CSS back" line — slides in under the block when format.ts
   has serialized the animation back to a string */
.kf-source-egg__out {
    margin-top: 0.5rem;
    padding-top: 0.45rem;
    border-top: 1px dashed color-mix(in srgb, var(--border) 70%, transparent);
    font-family: var(--font-mono);
    font-size: var(--type-micro);
    line-height: 1.4;
    color: var(--muted-foreground);
    opacity: 0;
    transform: translateY(4px);
    transition:
        opacity 240ms var(--ease-standard, ease),
        transform 240ms var(--ease-standard, ease);
    word-break: break-all;
}
.kf-source-egg__out--show {
    opacity: 0.92;
    transform: translateY(0);
}
.kf-source-egg__out-arrow {
    color: var(--accent-red, var(--color-progress));
    opacity: 0.85;
}

/* PRM: the card rests on the completed block, the out-line hidden, no caret. */
.kf-source-egg--prm .kf-source-egg__caret {
    display: none;
}
</style>
