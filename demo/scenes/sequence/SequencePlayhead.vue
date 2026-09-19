<template>
    <!-- THE PHOSPHOR MASTER PLAYHEAD (colocated sub-unit of SequenceTarget).
         The master clock's position, drawn as three compositor-cheap layers: the
         LINE (the master tone, `--ball-tone`), a machined DIAMOND HEAD (::before)
         and a COMET TRAIL (::after) that brightens with --seq-glow while scrubbing
         and trails the scrub direction. Reads `--playhead-p` (the prop, written
         inline each render — the one per-frame write, a style binding the
         engine's mirror drives) + --ball-tone/--seq-glow/--scrub-dir (inherited
         from the stage cascade) + --specular, the demo's material highlight
         (design-idioms.css). Its track is PLACED ON THE STAGE'S GRID, in the
         shared track column — nothing transcribed from paddings. -->
    <div class="seq-playhead-track" aria-hidden="true">
        <div class="seq-playhead" :style="{ '--playhead-p': progress }"></div>
    </div>
</template>

<script setup lang="ts">
/** `progress` — the normalized master-clock position, `time / duration`,
 *  already clamped at its one source (`useSequenceDemo`'s mirror); re-clamping
 *  here passed the one breaking input (NaN) and guarded nothing (L-9/C-6). */
defineProps<{ progress: number }>();
</script>

<style scoped>
/* `--playhead-p` is REGISTERED (kf-SequencePlayhead D-11, the K-12 form): a
   typed `<number>` with an initial value, so the transform below never sees an
   invalid-at-computed-value token and needs no `var(--x, 0)` fallback — the
   fallback was unreachable (the prop is written inline on every render) and the
   registration is what makes the guard real. Registration makes the property
   ANIMATABLE; nothing transitions it here — the engine's mirror writes it. */
@property --playhead-p {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}
/* PLACED ON THE STAGE'S GRID, not transcribed from its padding: an absolutely
   positioned grid child takes its containing block from its grid area
   (css-grid-1 §9), so `grid-column: 2` puts this track's left edge on the SAME
   grid line the ruler and the row tracks resolve from, and `grid-row: 2 / -1`
   spans exactly the rows block — its top is the rows' top, at every viewport,
   with nothing hand-copied from the stage's padding or the ruler's height
   (kf-SequencePlayhead D-1 · D-2/L-4/C-5 · D-10/L-2 · D-13/L-12; the stage's
   `gap` grants the gutter that makes the line one line). The diamond head rises
   3px above this box into the row-gap — never into the ruler's strip. */
.seq-playhead-track {
    position: absolute;
    grid-column: 2;
    grid-row: 2 / -1;
    inset: 0;
    pointer-events: none;
    /* No z-index (kf-SequencePlayhead D-3/L-3): the documented handle-over-
       playhead relation is TREE ORDER — this track precedes `.seq-rows` in the
       DOM, and the handles' rung lives inside `.seq-track`'s own containment
       context, so a positioned rung here painted OVER them, inverting the
       contract it cited. */
    /* T.G4 — the playhead line rides `translateX(<cqw>)`; `cqw` resolves against
       this track's inline size (the SAME axis the row handles ride), so the
       progress sweep is compositor-only (no per-frame `left` layout). */
    container-type: inline-size;
}
.seq-playhead {
    /* ONE tone alias (N-9 / D-14): `--ball-tone` is declared unconditionally on
       `.seq-target`, so every read below is bare — a fallback on it was dead six
       times over. The one externally-owned bare read in this file, glass-ui's
       `--radius-pill`, is the one that carries a fallback. */
    --tone: var(--ball-tone);
    position: absolute;
    top: 0;
    bottom: 0;
    /* T.G4 — anchored at the track's left edge; `translateX(<cqw>)` carries the
       progress position and the `- 50%` (of the 2px line width) keeps the line
       centred on its position — one compositor-only transform, no layout. */
    left: 0;
    width: 2px;
    transform: translateX(calc(var(--playhead-p) * 100cqw - 50%));
    background: var(--tone);
    border-radius: var(--radius-pill, 9999px);
    box-shadow: 0 0 calc(2px + var(--seq-glow, 0) * 8px)
        color-mix(in srgb, var(--tone) calc(35% + var(--seq-glow, 0) * 45%), transparent);
    /* The scrub-heat step (0 → 1 on `--seq-glow`) eases instead of snapping
       (D-12's transition pair, with the comet's opacity below). */
    transition: box-shadow 160ms ease;
    will-change: transform;
}
/* The machined diamond head — a 45°-rotated cap with a lighter bevel (AE cap).
   The bevel mixes the tone into --specular, the material register's highlight
   (DESIGN.md §2) — never a raw `white`: the light arm is byte-identical to the
   former literal, the dark arm is the page's own ink (SequencePlayhead C-3; the
   D-7 residue's dark-arm silhouette is KF.W9's looking question). */
.seq-playhead::before {
    content: "";
    position: absolute;
    top: -3px;
    left: 50%;
    width: 8px;
    height: 8px;
    transform: translateX(-50%) rotate(45deg);
    background: var(--tone);
    border-top: 1px solid color-mix(in srgb, var(--tone) 30%, var(--specular));
    border-left: 1px solid color-mix(in srgb, var(--tone) 30%, var(--specular));
    border-radius: 1px;
}
/* The comet trail — anchored at the line, 32px behind the travel direction;
   `--scrub-dir` flips it on a drag-back so the streak trails the thumb (the
   direction is latched per admitted sample by the scrub gesture — N-3); it
   brightens with --seq-glow. It GROWS IN over the first ~5% of travel and
   shrinks out over the last, so it can never overhang the track into the label
   column at p = 0 or past the frame at p = 1 (D-6/C-8) — no clip, no second
   box, one factor on the scale it already carries. */
.seq-playhead::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 50%;
    width: 32px;
    transform-origin: right center;
    transform: scaleX(
        calc(
            var(--scrub-dir, 1) *
                min(1, var(--playhead-p) * 18, (1 - var(--playhead-p)) * 18)
        )
    );
    background: linear-gradient(
        to left,
        color-mix(in srgb, var(--tone) calc(28% + var(--seq-glow, 0) * 32%), transparent),
        transparent
    );
    opacity: calc(0.5 + var(--seq-glow, 0) * 0.5);
    transition: opacity 160ms ease;
    /* No `pointer-events` here: it is INHERITED from the track's own `none`
       (N-6 — the former re-declaration was dead). */
}
</style>
