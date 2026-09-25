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
         the hero is ink, not chrome. OWNER ruling (successor of the retired
         hero-rung/-balance/-cls FROZEN locks); no gate enforces it.
         KF-EST-20 — the band no longer restates `z-controls` or
         `pointer-events-none`: the shell's start-screen wrapper declares both,
         `pointer-events` INHERITS, and this box is the wrapper's only child
         inside the stacking context that wrapper's own z-rung establishes, so
         a second declaration of either could not change a paint. -->
    <div class="hero-band absolute left-0 w-screen">
        <!-- The poster line: Instrument Serif, the mega φ rung, TRUE single-
             weight ink (weight 400, --foreground, no depth-text costume — the
             T.D10 RULED ink correction: the face ships 400 ONLY; the T.D2
             root `font-synthesis: none` + the :root `--font-display-weight`
             re-point in style.css (KF-AT-22 — the producer ships the token;
             the rung reads it) make any other declaration a lie). Motion is the hero's
             only ornament: the per-CHAR wave (AnimatedText, T.D10) + the
             engine-dogfooded TypingDots pulse, one span away.
             KF-EST-20 — the inert `p-0` is gone (preflight already zeroes an
             `<h1>`'s padding; the utility overrode nothing).

             KF-EST-5 · KF-EST-17 · KF-EST-18 — the three COMPONENT arms this
             wave books against this record all have their bytes one span away,
             in `TypingDots.vue`, which is outside this unit's writable set.
             They are dispositioned here, at the mount that owns them, rather
             than left to look unworked; each disposition was MEASURED at
             TypingDots' current bytes, not inferred:
             · KF-EST-18 (the half-reactive `count` engine contract, ≡ KF-AT-1's
               law) is DISCHARGED — the file now states "ONE CONTRACT MOTION,
               and the arm taken is VALIDATE + MOUNT-ONCE", refusing a
               non-positive-integer `count` through the engine's own
               `AnimationOptionError` instead of letting `new Array(n)` throw a
               bare RangeError inside this `<h1>`. Nothing is owed. This mount
               passes no `count` at all, so the default is the only value in
               play from here.
             · KF-EST-17's component arm is LIVE and DECLARED, not cured: the
               `onMounted(async …)` callback returns a promise Vue neither
               awaits nor catches, so a rejected `loadAnimationEngine()` — the
               library arm's permanently-poisoned memo — still surfaces as an
               unhandled rejection on the LCP node, and `anim.play()` floats a
               promise from a documented error-propagating call. Both sites are
               in TypingDots; the cure belongs with the library ruling
               (retry-or-poison) and is escalated, never patched from here.
             · KF-EST-5's component arm is EVALUATED and NOT ADOPTED, which is
               the cure the row asks for (evaluate-not-mechanical-swap, the
               severance held). Three per-dot infinite `CSSKeyframesAnimation`s
               where the library's group owns one driver is the real cost, but
               the group rewrite is gated on P-8's viability test — whether a
               multi-target `AnimationGroup` honours three infinitely-iterating,
               differently-delayed children at all — which is KF.W5's and is
               evidenced nowhere in the tree either way. Swapping first and
               testing later is how a severed cure gets un-severed by accident. -->
        <!-- KFA-134 — the wave's in-content pause (WCAG 2.2.2, KF-AT-17) is
             REACHABLE: the toggle below writes the producer's `--motion-weight: 0`
             on the heading (the authority AnimatedText multiplies its lift by),
             which stills the ripple in place. Before, the only path was the OS
             reduced-motion media query — no UI set the weight. -->
        <h1
            class="hero-display text-display-mega"
            :style="wavePaused ? { '--motion-weight': '0' } : undefined"
        >
            <AnimatedText :text="hero.title" />
            <span class="hero-dots"><TypingDots /></span>
        </h1>
        <!-- T.D11 (OD-4) — the deck joins the poster's own voice: Instrument
             Serif TRUE italic 400. KF-EST-2 — the ital@1 face is a SEPARATE
             woff2 (the css2 endpoint emits one @font-face per style) fetched by
             index.html's deliberately non-render-blocking ital sheet; the one
             preload is the UPRIGHT latin file, and "Instrument Serif Fallback"
             (style.css) is an upright-only face under the root
             `font-synthesis: none`, so the deck and hint paint UPRIGHT for the
             whole swap window and italic arrives with the face. The demo's one
             italic decision (style.css, @layer demo-typography) keeps italic
             ONLY here, on the voice that ships a real italic; the preload limb
             lives in index.html, outside this wave's bounds, and is declared,
             not cured. The bold-italic system sans register ("AI-slop subtitle"
             under a 177px serif poster) dies. One family, two styles, the φ
             ladder read top-down: mega roman → title italic → title italic
             muted (the hint rides the SAME title rung — the landed T.D2 serif
             floor (≥28px desktop) makes the P-HERO heading rung serif-illegal;
             ink strength carries the deck→hint step instead of size. A named
             deviation in the T.D11 packet).
             KF-EST-21 — THE LADDER IS TWO MECHANISMS, NOT ONE, and the comment
             now says so instead of claiming a single "ink strength" step: the
             deck steps down by ALPHA (`opacity: 0.85` on `--foreground`) and
             the hint by TOKEN (`--muted-foreground`). That is why the measured
             step between them is 2.06:1 light and 1.49:1 dark — two different
             mechanisms cannot hold one ratio across two themes. Unifying them
             onto one mechanism is a rendered-ink decision and is KF.W9's; what
             this wave owes is the true description.
             KF-EST-3 — THE COPY CONTRACT IS DECIDED: INLINE. The deck was a
             public icon-sandwich assembled from three separately-defaulted
             props (`title`, `subtitle`, `subtitleSuffix`) with no way to
             suppress or reorder the glyph between them, and `subtitleSuffix`
             had zero consumers anywhere in the tree — a configurability nobody
             used, on a sentence with exactly one site. The three literals move
             into the template (the rendered bytes are unchanged: these were
             their own defaults), `hint` stays the ONE prop because the live
             call actually passes it, and the sandwich stops pretending to be
             composable. The sentence's own referents are a separate, still-open
             question (KF-EST-7, NO-WAVE-OWNER, landing WITH kf-App KF-APP-7's
             guard) and NOT ONE WORD of the copy is touched here.
             KF-EST-22 — with `title` inlined, the wave-composition hazard on
             this surface DISSOLVES rather than being documented: the per-char
             delay is `--wave-step` (80ms, the producer's `--motion-stagger-default`)
             against `--wave-cycle` 3600ms, so a title of 45 glyphs or more put
             the last char's ripple past one full cycle and produced concurrent
             ripples where the docblock promises a single sweep — uncompensatable
             from outside because the cycle is frozen. A literal of 19 glyphs
             cannot reach that bound, and no consumer can hand one that does.
             The sibling half (TypingDots pairing `delays[i]` with `els[i]` on
             an undocumented `v-for` ref-array order) is that file's and is
             DECLARED, not reached across. -->
        <!-- X.KF.W13V.s (OA-39) — the deck and hint are ONE block so the
             phone column can stack it BELOW the cube (the headline sits
             above); on desktop the block flows exactly as the two lines did. -->
        <div class="hero-sub">
            <!-- X.KF.W13X.mobile (A2-KE-L3-10 + A2-KE-L2-5) — the title-wave
                 pause sits INLINE at the end of the deck line (it was alone on
                 a row ~250px under the headline it controls), and it takes
                 pointer input: the band is ink (`pointer-events: none`,
                 inherited from the shell's start-screen wrapper), so the one
                 control in it re-enables its own hit-testing, the TD-36 dock
                 idiom — a tap flips aria-pressed on a phone. -->
            <div class="hero-deck-line">
                <h2 class="start-screen-prose hero-deck">
                    from the list
                    <!-- KF-EST-10 — the glyph is voiced as a WORD in a deck whose law is
                         "no weight above 400": Lucide's default stroke scales with the
                         box (2 units of a 24-unit viewBox → ≈2.19px at this 0.8em box)
                         and out-weighed the serif's ≈1.8px stems. `absolute-stroke-width`
                         is the icon's own one-attribute contract for a stroke that does
                         not scale with size. -->
                    <List class="hero-deck-icon inline" aria-hidden="true" absolute-stroke-width />
                    below, then press Play.
                </h2>
                <Button
                    size="sm"
                    emphasis="quiet"
                    icon-only
                    class="hero-motion-toggle pointer-events-auto"
                    aria-label="Pause the title animation"
                    :aria-pressed="wavePaused"
                    @click="wavePaused = !wavePaused"
                >
                    <Waves v-if="wavePaused" class="icon-md" aria-hidden="true" />
                    <Pause v-else class="icon-md" aria-hidden="true" />
                </Button>
            </div>
            <h2 v-if="hint" class="start-screen-prose hero-hint">
                {{ hint }}
            </h2>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Button } from "@mkbabb/glass-ui/button";
import { List, Pause, Waves } from "@lucide/vue";
import { ref } from "vue";
import AnimatedText from "./AnimatedText.vue";
import TypingDots from "./TypingDots.vue";

// KF-EST-3 / KF-EST-20 — ONE prop, and no defaults-wrapper macro. The three
// copy props are literals in the template now (decided INLINE above), which
// leaves `hint` as the only value a consumer passes — and `hint` needs no
// default, so the wrapper whose `hint: undefined` entry "documents nothing"
// goes with the props it was wrapping. `DESIGN.md §9.2` rules that macro form
// out of house grammar regardless; there is nothing left here for it to do.
// (Named by its rule, not spelled: a sweep for the retired form must measure
// live declarations, never a record of one that is gone.)
defineProps<{
    hint?: string;
}>();

// X.KF.W13U.x — the hero title is DECLARED here, once: the template renders it
// and the usability observation's (2c) reads this same declaration as its
// oracle (the per-char split must equal ITS glyph count, never the rendered
// mirror's). Still copy, not configuration — no prop, no consumer can hand one.
const hero = { title: "Select an animation" } as const;

// KFA-134 — the one pause state for the hero wave (see the template note).
const wavePaused = ref(false);
</script>

<style scoped>
/* ── The φ-band seat (T.D9 / lane 01 F1 / the P-HERO blessed reference) ────────
   Derived ENTIRELY from the work-area chain: top-offset (the φ 0.382 slack
   split the docks + work-area card already ride) + a φ share of the work-area
   height. No raw vh/px magic number (the K.W3 M4/C5 ban holds — the 100dvh in
   the var() fallback is the chain's own saturation value, not a seat offset).

   KF-EST-9 — THE GUTTER IS NOW DERIVED TOO, and the boast above becomes true.
   It was `clamp(2rem, 5vw, 4.5rem)`: a repo-hapax raw-vw clamp, the seat's ONE
   un-derived axis, sitting under a comment that claimed the seat was derived
   ENTIRELY. It tracked nothing — it missed the work-area card's own inline edge
   by 14–26px across common widths and SIGN-FLIPPED past ≈2400px (hero outside
   the card below, inside it above), so the hero's left reading edge drifted
   against the surface it is printed on. The card is centred at
   `min(100dvw, --work-area-max-width)`, so its inline edge is half the
   horizontal slack — that expression IS the gutter, and the only literal left
   is a declared FLOOR: below `lg` the chain sets `--work-area-max-width: 100dvw`
   (full bleed, zero slack) and a zero gutter would print the poster against the
   glass, so `2rem` — the former clamp's own lower bound, kept deliberately —
   holds the reading edge on a phone. At 1280px the derived edge is ≈38px where
   the old clamp gave 64px; at ≈2400px both give the same 72px and the sign flip
   is gone, because both ends now read one chain.

   KF-EST-13 — THE CONTAINER THE `cqi` UNITS ALWAYS CLAIMED. The phone clamps
   below are written in `cqi`, but this subtree had no query container anywhere
   above it (the demo's sole `container-type` opt-in utility is applied nowhere
   in this chain and glass-ui's dist ships none), so `cqi` silently resolved
   against the SMALL VIEWPORT — a viewport unit wearing a container unit's name,
   inside the very file whose law bans raw viewport magic. The band declares the
   container instead of the units being renamed to the thing they had degraded
   into: `container-type: inline-size` is the demo's own macro-grid idiom
   (AnimationControlsGroup.css and five other sites), and it makes the clamps
   read the hero's actual reading column — width minus the derived gutters —
   which is what "cqi" said all along.

   KF-EST-4 — THE BAND IS BOUNDED. It declared `top` and `padding-inline` and
   NOTHING vertical — no bottom, no height, no maximum — inside `html,body
   { overflow: hidden }` and an `overflow-hidden` shell. On 720–768px-tall
   desktop viewports the derived seat plus the mega rung's wrapped height exceed
   the remaining viewport and the hint is CLIPPED (it cannot scroll; nothing in
   the chain can): at 1280×720 that is ≈420px of content into ≈397px of room.
   The maximum is derived from the same chain as the seat — exactly the room the
   seat leaves — so the geometry is DECLARED rather than accidental and an
   overflow is observable on the element instead of silently absorbed by an
   ancestor two levels up. The clip MAGNITUDE (1280×720, 1024×640, and the
   320×568 two-line-hint case) and the design response — a shallower seat, or a
   hint threshold — are KF.W9 / SS-13's, per this row's own routing.

   KF-EST-15 — THE `var()` FALLBACK POSTURE IS INVERTED, which is the whole of
   the row. Fallbacks sat on the two tokens that CANNOT be missing — the demo's
   own `--work-area-top-offset` / `--work-area-height`, declared at `:root` in
   `layout.css` and re-declared in its own mobile block — while eight bare
   glass-ui reads carried none. Measured against the producer's published
   override manifest at the INSTALLED bytes: `--foreground` and `--type-title`
   are IN it (contract-guaranteed, no fallback owed), `--font-display` is
   declared by the demo's own `@theme`, and `--muted-foreground` and
   `--type-display-4` are ABSENT from it — those two, and only those two, take
   fallbacks. The unreachable ones are deleted. */
.hero-band {
    /* X.KF.W13X.mobile (A2-KE-L2-15) — the gutter also clears a landscape
       notch (the larger inline inset, on both sides, so the column stays
       centred on the cube): at 844x390 under a 47px inset the pause toggle
       painted at x 758-812, inside the right band. */
    --hero-gutter: max(
        2rem,
        calc((100dvw - min(100dvw, var(--work-area-max-width))) / 2),
        env(safe-area-inset-left, 0px),
        env(safe-area-inset-right, 0px)
    );

    container-type: inline-size;
    top: calc(
        var(--work-area-top-offset) + var(--work-area-height) * 0.45
    );
    max-block-size: calc(
        100dvh - (var(--work-area-top-offset) + var(--work-area-height) * 0.45)
    );
    padding-inline: var(--hero-gutter);
}

/* ── Honest ink (T.D10 RULED / lane 01 F3) ────────────────────────────────────
   Instrument Serif ships weight 400 ONLY. The weight is decided ONCE, at the
   token the rung reads: style.css's :root re-points `--font-display-weight` to
   400 (KF-AT-22 — glass-ui 7.0.0 ships the token; the BG-6 ask that this
   scoped 400 and the :root `font-synthesis: none` used to belt-and-brace is
   answered by the producer's own token, so the two in-file redundancies are
   gone). Color is --foreground — the depth-text lilac recolor + 4-step shadow
   stamp are GONE from the title AND the dots (zero `depth-text` in
   shell/, the T.D10 grep clause).
   KF-EST-8 — THE LEADING DECISION: the rung's own published token. The former
   scoped `line-height: 0.92` (H.W4.S3) was the THIRD un-tokenized display-rung
   override beside weight and tracking, and at the mega rung it set consecutive
   h1 lines to −0.04..+0.01em of ink clearance — a descender-bearing non-final
   line touched or overlapped the line below, and the shipped default escaped by
   letter-luck alone. The rung reads `--type-leading-display` (1.05,
   scheme-motion.css, installed) and this file no longer overrides it; the three
   display-rung decisions now all live at tokens. The metric-matched fallback
   shares the leading, so the LCP box is unchanged between fallback and web font
   (no CLS term is added). This DEPARTS from the OD-4-blessed poster's tightness
   by +0.13em per line — recorded here for the owner's re-bless; the descender
   render is KF.W9 / SS-13's witness. */
h1.hero-display {
    color: var(--foreground);
}

/* ── The serif-italic deck ramp (T.D11 / lane 01 F4) ──────────────────────────
   Deck: display-face italic 400 @ --type-title, foreground at ~0.85.
   Hint: display-face italic 400 @ --type-title, muted (the SAME rung — the
   T.D2 serif floor rules the heading rung out for the display face; the muted
   ink is the step, and it is a DIFFERENT mechanism from the deck's alpha —
   KF-EST-21, stated at the markup). No weight above 400 anywhere on the start
   screen.
   KF-EST-20 — the inert `w-full` utilities are gone from both `<h2>`s: a block
   element already fills its container's inline axis, and neither was overriding
   anything. */
.hero-deck-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-block-start: 0.75rem;
}

.hero-deck {
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
    color: var(--muted-foreground, var(--foreground));
}

/* KFA-134 — the wave's pause sits under the hint, quiet, on its own line. */
.hero-motion-toggle {
    flex-shrink: 0;
}

/* The engine-dogfooded ellipsis host: the THREE DOTS are one unbreakable
   inline unit — `nowrap` is INTERIOR to this box and keeps the dots together.
   It does NOT bind the dots to the title's final word (KF-AT-14): the last
   `.wave-word` and this host are two ADJACENT ATOMIC INLINES, and CSS Text 3
   §5.1 leaves a soft wrap opportunity between them that no declaration here
   suppresses. The earlier prose ("the dots never wrap apart from the title's
   final glyph") credited this rule with a seam it never owned; the seam is
   tolerated — a wrapper nowrap spanning both would inherit K8's overflow
   rejection, and a word-joiner would enter the mirror's text. Trigger widths
   for the orphaned-dots line are the SS-13 P-8 probe's. Owned HERE (the
   co-located scoped home) so the class is a resolved recipe, never a
   silent-flatten. */
.hero-dots {
    display: inline-block;
    white-space: nowrap;
}

/* KF-EST-12 — THE MECHANISM, STATED TRUTHFULLY. This declaration does not
   "omit a fix"; it OVERRIDES one. Tailwind's preflight sets `vertical-align:
   middle` on every replaced element inside `@layer base`, and an unlayered
   scoped rule outranks any layer, so writing `baseline` here silently reverts
   the glyph to the text baseline and rides it ≈0.145em HIGH against the serif's
   own optical centre — the opposite of what an unexplained `baseline` reads as.
   It is kept deliberately (a glyph voiced as a WORD sits on the word baseline),
   and the earlier comment described neither the override nor the offset. The
   icon is Lucide `List` — a bulleted list — and not the `☰` the prose used to
   name (KF-EST-21's first site; `index.html`'s own stale `text-display-4`
   citation is outside this wave's bounds and is DECLARED). ~0.8em cap height. */
.hero-deck-icon {
    width: 0.8em;
    height: 0.8em;
    vertical-align: baseline;
}

/* F.W13.S1 (kept) — orphan-avoiding rag on the running prose. */
.start-screen-prose {
    text-wrap: pretty;
}

/* ── The phone block (K.W3 U-K9, bounds re-derived for the serif deck) ────────
   KF-EST-20 + KF-EST-14, taken as ONE motion because the row forbids taking
   them separately. The file carried TWO `@media (max-width: 1023px)` blocks
   with identical conditions; consolidating them is the hygiene half, and the
   SEQUENCING CONSTRAINT is that any such consolidation MUST re-key the mobile
   deck override in the same motion — which is done here. The override used to
   be keyed `.start-screen-subtitle`, a DIFFERENT class from the base rule's
   `.hero-deck`, at equal scoped specificity: it won by source order alone, so
   a naive merge that reordered the sheet would have silently deleted the
   1.5rem serif floor with no diagnostic. Re-keyed to `.hero-deck`, base and
   override are the same selector and the later one wins by the cascade's
   ordinary rule; `.start-screen-subtitle` had no other consumer and leaves the
   markup with its rule.
   The hero's MOBILE rung (J.W7a TYP-1, kept): below lg the mega rung's 86px
   floor fights the die at phone widths — step one φ tier down via the published
   `--type-display-4` token (never a raw px; the fallback is KF-EST-15's, the
   guaranteed `--type-title` rung, so a producer that ever drops display-4
   steps the phone hero DOWN rather than stranding it at the desktop rung). The
   φ band also drops to 0.52 so the die keeps the upper ~45% (two focal planes,
   hero printing OVER the die's lower quadrant — overlap WELCOME per OD-4).
   The lower bound of both clamps is 1.5rem (24px): the T.D2 serif floor at the
   mobile viewport — the display face may never render below the smallest
   display rung. The hint takes the same phone clamp (same face, same floor). */
@media (max-width: 1023px) {
    /* X.KF.W13V.s (OA-39) — ONE centred column. The band spans the stage (the
       same insets the cube centres in, layout.css) as three rows: the headline
       centred in the space above the cube, the cube's own footprint kept
       clear (--home-cube-extent — the cube paints there, in the scene host),
       and the deck + hint centred in the space below it. Never over the cube,
       never left-ragged beside it. */
    .hero-band {
        top: var(--stage-top-inset);
        bottom: var(--stage-bottom-inset);
        max-block-size: none;
        display: grid;
        grid-template-rows: minmax(0, 1fr) var(--home-cube-extent) minmax(0, 1fr);
        justify-items: center;
        align-items: center;
        text-align: center;
    }
    .hero-display {
        grid-row: 1;
    }
    .hero-sub {
        grid-row: 3;
    }

    .hero-display {
        font-size: var(--type-display-4, var(--type-title));
    }

    .hero-deck {
        text-wrap: balance;
        font-size: clamp(1.5rem, 6.2cqi, var(--type-title));
    }

    .hero-hint {
        font-size: clamp(1.5rem, 5.4cqi, var(--type-title));
    }

    .hero-deck-line {
        justify-content: center;
    }
}

/* X.KF.W13X.mobile (A2-KE-L2-4) — THE SHORT PHONE (landscape, block size
   <= 500px). The one centred column needs three rows (headline, the cube's
   footprint, deck) inside the stage band, and at 844x390 that band is 155px:
   the rows resolved 0 / 203 / 0, the headline ran under the top dock and the
   deck under the transport. On a short viewport the band is TWO columns
   beside the cube instead — the headline in the left column, the deck + hint
   in the right, the cube's footprint (bounded by the band's block size,
   layout.css) kept clear between them — and the display rung is bounded by
   the block size (dvh), because an inline-fluid rung cannot know the band is
   short. */
@media (max-width: 1023px) and (max-height: 500px) {
    .hero-band {
        grid-template-rows: minmax(0, 1fr);
        grid-template-columns: minmax(0, 1fr) var(--home-cube-extent) minmax(0, 1fr);
        column-gap: 0.5rem;
    }
    .hero-display {
        grid-row: 1;
        grid-column: 1;
        font-size: clamp(1.5rem, 11dvh, var(--type-display-4, var(--type-title)));
    }
    .hero-sub {
        grid-row: 1;
        grid-column: 3;
    }
    .hero-deck,
    .hero-hint {
        font-size: clamp(1rem, 5.5dvh, var(--type-title));
    }
}
</style>
