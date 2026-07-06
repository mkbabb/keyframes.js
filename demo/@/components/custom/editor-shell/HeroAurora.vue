<template>
    <!-- T.D13 (OD-2: AURORA-ON-HERO, AMENDED MORE SUBTLE) — the cursor light,
         DONE RIGHT: glass-ui's PUBLIC Aurora primitive as the home hero's
         ambient background, not a hand-rolled --mouse-x wash (the forbidden
         second occurrence — H.W9's lesson; proof:no-hand-rolled-cursor-tracker
         stands guard). Aurora owns the rAF-coalescing, the PRM-safe
         CSS-gradient substrate (renderMode "auto"), the decorative DPR budget,
         and the lazy WebGL arm past first paint. This layer sits UNDER the
         graph-paper grid lines (DOM-ordered before .grid-background via the
         EditorShell #backdrop slot) so the wash reads as a watercolor tint IN
         the paper — the ink (grid lines, hero glyphs, the die) stays crisp
         above it.

         THE SUBTLETY AMENDMENT (OD-2, owner verbatim: "I like the aurora, but
         more subtle"): the P-HERO prototype's opacityCeiling 0.15 is the
         CEILING, not the target. The blessed bound is encoded here as
         HERO_AURORA_OPACITY_CEILING = 0.1 (strictly below 0.15) and asserted
         by proof:cursor-light-subtle (OWNER) — raising it past the amendment
         REDs the oracle. -->
    <div
        class="hero-aurora pointer-events-none fixed inset-0"
        aria-hidden="true"
    >
        <Aurora
            ref="auroraRef"
            :config="config"
            :opacity-ceiling="HERO_AURORA_OPACITY_CEILING"
            :runtime-options="{ initStrategy: 'eager' }"
            render-mode="auto"
        />
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import {
    Aurora,
    PAPER_WASH_GROUND,
    resolveAtoms,
} from "@mkbabb/glass-ui/aurora";

/** The OD-2-amended presence bound — STRICTLY below the P-HERO prototype's
 *  0.15 ceiling ("more subtle", owner verbatim). proof:cursor-light-subtle
 *  asserts this literal + the template binding. */
const HERO_AURORA_OPACITY_CEILING = 0.1;

const auroraRef = useTemplateRef<InstanceType<typeof Aurora>>("auroraRef");

// The field is authored through the ≤7-knob atoms door (glass-ui's consumer
// surface over the full config schema), then spread over PAPER_WASH_GROUND —
// the library's OWN recessive-ground crayon calibration ("paper-on-tooth"),
// which is exactly this page's register: pigment IN the graph paper, not a
// painted field over it. The seed sits on the OD-6 violet accent axis (the
// --accent-kf oklch ~295° family the T.D7 ramp landed — the wash previews the
// blessed hue, both themes). Color energy stays LOW so the ink (grid lines,
// hero glyphs, the die) remains the read. The cursor-as-light interactivity
// axis is ON (Aurora's own wired axis — the light follows the cursor inside
// the field, everywhere on the page, no partiality). Field atoms are the
// P-HERO blessed values verbatim; ONLY the opacity ceiling moved (the
// amendment's named lever).
const config = {
    ...resolveAtoms({
        seed: "#7c5ce6",
        harmony: "analogous",
        colorEnergy: 0.18,
        zones: { count: 3, arrangement: "composed" },
        noise: 0.45,
        motion: "drifting",
        interactivity: { light: true },
    }),
    ...PAPER_WASH_GROUND,
};

// ── Cursor wiring — the exposed setCursor API, ZERO layout reads ────────────
// The lane-12 recurrence guard (T-CL-3) forbids the read-after-write
// pointermove pattern (getBoundingClientRect + setProperty per event forced a
// full-document layout ~1,100-2,000× the isolated cost). This handler does no
// DOM geometry read at all: the aurora layer is fixed full-viewport, so the
// normalized cursor is clientX/innerWidth (viewport metrics — no style/layout
// flush). setCursor only stashes uniforms; Aurora's frame loop uploads once
// per rAF, so a 120-1000 Hz pointer collapses to one write per frame.
// injectCursorVelocity (the flick swirl-burst) early-outs under PRM inside the
// runtime — no demo-side PRM branch needed. Mouse-only: on touch, pointermove
// fires only mid-drag and would fight the scene gestures.
let last: { x: number; y: number } | null = null;

const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const aurora = auroraRef.value;
    if (!aurora) return;
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const x = e.clientX / w;
    const y = e.clientY / h;
    aurora.setCursor(x, y, 1);
    if (last) {
        aurora.injectCursorVelocity(x - last.x, y - last.y);
    }
    last = { x, y };
};

const onPointerLeave = () => {
    auroraRef.value?.clearCursor();
    last = null;
};

// The listener surface rides @vueuse/core (the E.W2 §S1–S3 brittleness
// discipline: tryOnScopeDispose cleanup — the layer's home-only mount/unmount
// tears both listeners down with the component scope, no manual pairs).
useEventListener(window, "pointermove", onPointerMove, { passive: true });
useEventListener(
    () => document.documentElement,
    "pointerleave",
    onPointerLeave,
    { passive: true },
);
</script>

<style scoped>
.hero-aurora {
    /* DOM-ordered before .grid-background inside the editor shell — no
       z-index games: the wash paints over the bg-background field and under
       the grid's ink lines by document order alone. */
    height: 100dvh;
    width: 100dvw;
}

@supports not (height: 100dvh) {
    .hero-aurora {
        height: 100vh;
        width: 100vw;
    }
}
</style>
