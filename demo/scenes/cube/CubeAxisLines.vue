<template>
    <!-- ── The axis-lock reveal (X.KF.W12.f · AXISLINE-UNIT) ──────────────────
         THE THESIS, STATED ONCE (KF-AX-28: this file restated it four times and
         duplication is how the restatements drifted apart). OrbitalDrag latches
         X/Y/Z through the demo's ONE `registerShortcut` registry; while a latch
         is held, the matching line goes solid and full-opacity so the constraint
         becomes spatially legible. Everything below is detail about HOW, never a
         re-statement of WHAT.

         KF-AX-2 — WHAT THE REVEAL ACTUALLY MEANS, decided at X.KF.W12.f and
         written here because the old prose ("single-axis rotation", twice) was
         false three ways:
          · the latch gates the FIRST branch of BOTH `drag` and `handleWheel`
            (useOrbitalPointer) — six operations share it, not one, and which
            transform the constrained gesture writes (rotate / translate / scale)
            is the gesture's business, not the latch's;
          · it is ARMED, not ACTIVE: the line lights on the keydown alone, with
            no gesture in flight;
          · so the honest reading is the one the DISSENT preserved — `lock` =
            WHICH AXIS the next constrained gesture is pinned to. The reveal is
            an ARMING tell. It promises nothing about rotation.
         The deuteranopia limb (X-red / Y-green, no text labels) is NOT cured
         here: it rides J-lane C6's ask, with DESIGN.md §8 OD-U9's ruled
         `.stage-whisper` readout (KF-AX-10) — two encodings to reconcile when
         U.B8 lands, not a second one to invent.

         KF-AX-23 — `aria-hidden`, matching `face-relit` in CubeTarget.vue:85-86:
         this is a visual tell for a pointer gesture. The non-visual channel is
         the registry's labelled bindings in the shortcuts modal (OD-6), which is
         where a screen-reader user meets this feature at all. -->
    <div
        v-for="axis in axes"
        :key="axis"
        class="axis-line"
        :class="[axis, { 'axis-line--locked': lock[axis] }]"
        aria-hidden="true"
    ></div>
</template>

<script setup lang="ts">
import { axes } from "./orbital-drag";
import type { PressedKeys } from "./orbital-drag";

// KF-AX-22 — the attrs contract, DECLARED rather than left latent: this renders
// a three-root fragment, so Vue cannot auto-inherit fallthrough attrs and would
// warn the day a caller passed one. A single wrapping root is not available as
// a cure — `perspective: 1200px` lives on `.graph` and CSS perspective reaches
// its OWN children only, so a wrapper would flatten every stroke's 3D transform.
defineOptions({ inheritAttrs: false });

const { lock } = defineProps<{
    // KF-AX-16 — the latch's shape is NOT re-declared structurally here: it is
    // sliced off the owner's `PressedKeys` type, so the day OrbitalDrag renames
    // or re-types an axis this file fails the build instead of drifting. The
    // three strokes are rendered from the same `axes` tuple the drag paths
    // iterate, for the same reason (the `--axis-*` token namespace has a FOURTH
    // live member, `--axis-w`, in MatrixEditor — a hand-unrolled list here is a
    // standing invitation to drift toward it).
    lock: Pick<PressedKeys, "x" | "y" | "z">;
}>();
</script>

<style scoped>
/* KF-AX-21 — the reveal's ONE driver. Registered, so `--axis-active` is a real
   <number> that INTERPOLATES (the whole reveal is derived from it) and its
   initial value is guaranteed: every `var(--axis-active, 0)` fallback this file
   used to carry was unreachable, and is gone.

   KF-AX-25 (recorded, routed) — a scoped `@property` still registers
   DOCUMENT-WIDE; the name lives in the demo's flat custom-property namespace.
   The namespace audit is KF.W6's row, not this unit's.

   KF.W6 W6-H — the registration is the second half of #30 and the fallback arms
   are the second half of #59; both dispositions are written once, at
   CubeTarget.css's `@property --lit` block, and are not restated here. */
@property --axis-active {
    syntax: "<number>";
    inherits: false;
    initial-value: 0;
}

.axis-line {
    /* KF-AX-20 — 1000vw stays. The codex charge against it is dead (register
       #10/#11); what made the width expensive was the RESIDENT filter below,
       which is now gated, and a stroke that must span the viewport at every
       graph attitude has no smaller honest number. */
    width: 1000vw;
    height: 0px;
    /* KF-AX-13 — `border: 1px dashed` on a zero-height box paints the top AND
       bottom edge (a 2px double stroke) plus two end caps from the left/right
       edges. One logical edge is what a line is. */
    border-block-start: 1px dashed var(--color);
    opacity: calc(0.45 + var(--axis-active) * 0.55);
    /* KF-AX-8 — DRIVER-ONLY, the house `--lit` idiom (CubeTarget.css). Listing
       `opacity` and `filter` beside `--axis-active` transitioned the derived
       channels as well as the thing they derive from, so each channel chased
       its own eased copy of an already-eased value and the settle ran ~2×
       `--duration-fast`. Interpolate the driver; the derivations recompute per
       frame for free.

       KF-AX-7 — THE PRM GUARD IS NOT LOCAL, and this file used to claim it was
       ("PRM-respecting via the wrapper below" — there is no wrapper). The real
       guard is the installed glass-ui's UNIVERSAL `*:not([data-allow-motion])`
       rule in `dist/styles/utilities/a11y-overrides.css`, which reaches this
       element like every other. Under PRM the reveal therefore becomes a STEP:
       the solid stroke and the opacity lift still land, only the interpolation
       goes — which is the correct reduced-motion shape, so the reliance is
       STATED rather than duplicated here. (That it is a vendor rule is exactly
       why it is worth writing down: the packaging row F-1 ≡ KF-CE-32 — declared
       6.0.0-optional, installed 7.0.0 — is KF.W0's, and this guard is one of
       the things it puts at risk.)

       KF-AX-15 ≡ CubeTarget #60 — the three raw `180ms` that used to sit here
       became `--duration-fast` at KF.W6; that row is LANDED-BY KF.W6 and is not
       this unit's claim. */
    transition: --axis-active var(--duration-fast) var(--ease-standard);
    /* KF-AX-6 — the truthful version of a citation that was ill-formed. The old
       comment cited `--z-behind < --z-content` as if the two were comparable:
       the die's only `--z-content` consumer is `.face-numeral`
       (CubeTarget.css:144-145), which sits inside `.cube-side` faces that each
       carry a `transform` and are therefore their own stacking contexts — a
       rung in `.graph`'s context and a rung two contexts deeper are not
       comparable quantities at all. What is true, and all that is needed: within
       `.graph`'s own stacking context the sole competitor (OrbitalDrag's
       container) declares no z-index, so `--z-behind` puts these strokes behind
       it. Whether 3D depth-sorting then paints a stroke over the die is a RENDER
       question this comment does not answer — SS-13 #2 is its witness. */
    z-index: var(--z-behind);
    position: absolute;
    pointer-events: none;

    &.axis-line--locked {
        /* KF-AX-14 — the locked state drives BOTH channels from the class, so
           the reveal is finally overridable by a media query. `--axis-active`
           used to be written as an inline `:style` from the same boolean that
           set this class: one latch, two bindings, and the inline one outranked
           every stylesheet in the document. */
        --axis-active: 1;
        border-block-start-style: solid;
        /* KF-AX-9 — GATED, and the gate is the whole cure: a non-`none` filter
           on a 1000vw box is a resident compositing pass and three shadow
           buffers on every device, paid at all times for a bloom that is only
           ever visible while a key is held. Ruling 8 bounds the benefit
           honestly — `opacity: 0.45` at rest is itself a grouping property, so
           the stacking context and the forced `flat` used value REMAIN; what
           goes is the filter pass. The cost of the gate, stated: on RELEASE the
           bloom drops in one frame (a filter declaration cannot interpolate out
           of existence) while the opacity still eases. The bloom fades IN
           correctly, because the radius derives from the interpolating driver. */
        filter: drop-shadow(
            0 0 calc(var(--axis-active) * 6px)
                color-mix(in srgb, var(--color) calc(var(--axis-active) * 80%), transparent)
        );
    }

    /* KF-AX-4 · #57 — THE FRAME STAMP, and it is load-bearing. Every geometric
       claim about these strokes is written against the attitude the stage is
       parked at: `.graph` is driven to `rotate3d(-1, 1, 0, 30deg)`
       (GRAPH_ATTITUDE, useCubeRelit.ts:62) on mount, under `perspective: 1200px`
       (CubeTarget.css:47). Derived in that frame (test/demo/scenes/
       cube-axis-reveal.test.ts, which re-derives it from GRAPH_ATTITUDE rather
       than restating it):

         .x → screen orientation 175.89deg, extent 0.93541 per unit
         .y → screen orientation  94.11deg, extent 0.93541 per unit
         .z → screen orientation  45.00deg, extent 0.50000 per unit
         pairwise separation: x^y 81.79deg · y^z 49.11deg · z^x 49.11deg

       So in the frame the app actually shows, ORIENTATION IS A REAL REDUNDANT
       ENCODING for all three — the reveal does not rest on hue alone. At the
       first frame of the 650 ms intro sweep the stage is still at identity, and
       there and ONLY there `.z` has screen extent 0.00000: the Z axis points
       along the view direction, so it projects to a point. That degeneracy is
       TRANSIENT (it ends with the sweep) and the PRM arm never shows it at all —
       it snaps straight to GRAPH_ATTITUDE (useCubeDemo.ts:144).

       KF-AX-5's design decision, taken here: `rotateY(90deg)` STAYS. Tilting the
       Z stroke to keep it legible during the sweep would make it LIE — it would
       stop being the Z axis. A stroke that is briefly invisible because the axis
       it names is briefly edge-on is telling the truth about a 3D scene. */
    &.x {
        --color: var(--axis-x);
        /* KF-AX-29 — the identity rotate is DELIBERATE, and the file was silent
           about which of its two readings applied. Any non-`none` transform
           makes an element a stacking context and a containing block: declaring
           it keeps all three strokes on identical terms, so `.x` can never paint
           by different rules than its siblings for a reason nothing states. */
        transform: rotateX(0deg);
    }
    &.y {
        --color: var(--axis-y);
        transform: rotateZ(90deg);
    }
    &.z {
        --color: var(--axis-z);
        transform: rotateY(90deg);
    }
}

/* KF-AX-17 — forced colors. The vendor ships two forced-colors blocks (a
   class-keyed one in `a11y-overrides.css`, an ARIA-keyed one in
   `accessibility.css`) and these three bare divs match NEITHER, so the mode used
   to take the hue coding away — `--axis-x/-y/-z` are replaced by a system colour
   — while leaving the drop-shadow as an un-keyed halo the OS cannot recolour.
   Under forced colors the surviving tells are the ones the mode preserves:
   stroke style (dashed → solid) and the system `Highlight` colour.

   KF-AX-3 (KF.W6's row, NOT cured here, re-measured 2026-09-19): the comment
   this replaced called `--axis-x/-y/-z` "three theme-INVARIANT :root literals".
   Two of the three no longer are — `--axis-y` and `--axis-z` took `light-dark()`
   arms at KF.W6 (`0bd0215b`, style.css:147-148); `--axis-x` (:146) is still a
   single literal. The row stays KF.W6's and the landed half is not claimed
   here; only the false sentence is retired. */
@media (forced-colors: active) {
    .axis-line {
        filter: none;
        border-block-start-color: CanvasText;

        &.axis-line--locked {
            filter: none;
            border-block-start-color: Highlight;
        }
    }
}
</style>
