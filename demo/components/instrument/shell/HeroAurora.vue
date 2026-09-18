<template>
    <!-- T.D13 (OD-2: AURORA-ON-HERO, AMENDED MORE SUBTLE) — glass-ui's PUBLIC
         Aurora primitive as the home hero's ambient background, not a
         hand-rolled --mouse-x wash (the forbidden second occurrence — H.W9's
         lesson). Aurora owns the rAF-coalescing, the decorative DPR budget, the
         palette-derived ground that is frame 0 on every substrate, and the
         WebGL arm past first paint. Reduced motion is honoured by the
         substrate's own live `matchMedia` freeze (one static frame, then park,
         re-arming on un-reduce) — NOT by the render-mode resolver, which
         carries no reduced-motion branch at all; the former claim of a
         "PRM-safe CSS-gradient substrate (renderMode auto)" is struck here as
         false at the installed bytes.

         This layer sits UNDER the graph-paper grid lines (DOM-ordered before
         .grid-background via the EditorShell #backdrop slot) so the wash reads
         as a watercolor tint IN the paper — the ink (grid lines, hero glyphs,
         the die) stays crisp above it.

         THE SUBTLETY AMENDMENT (OD-2, owner verbatim: "I like the aurora, but
         more subtle"): the P-HERO prototype's opacityCeiling 0.15 is the
         CEILING, not the target. The blessed bound is encoded here as
         HERO_AURORA_OPACITY_CEILING = 0.1 (strictly below 0.15) and asserted
         by `test/demo/instrument/aurora-opacity-ceiling.test.ts` — raising it
         past the amendment REDs that spec. -->
    <Aurora
        ref="auroraRef"
        class="hero-aurora pointer-events-none fixed inset-0"
        aria-hidden="true"
        :config="config"
        :opacity-ceiling="HERO_AURORA_OPACITY_CEILING"
        @renderer-status="onRendererStatus"
    />
</template>

<script lang="ts">
/** The OD-2-amended presence bound — STRICTLY below the P-HERO prototype's
 *  0.15 ceiling ("more subtle", owner verbatim).
 *  `test/demo/instrument/aurora-opacity-ceiling.test.ts` asserts this literal
 *  AND the template binding that carries it, which is why it lives in a plain
 *  module-scope `<script>` block: a `<script setup>` compile-local is
 *  unreachable to every instrument in the repo, so a gate over it could only
 *  be a source-text pin — the very shape G-L7 rule (e) forbids.
 *
 *  KF-HA-2 — THE CONSUMER DECISION, TAKEN: the blessed number is the DELIVERED
 *  0.1, and it stays here unhalved. `opacityCeiling` is the outer compositing
 *  envelope and the PUBLISHED 7.0.0 applies it ONCE, on the shared root
 *  (`:style="{ opacity: clampedOpacityCeiling }"`, read at the producer's own
 *  v7.0.0 source), so at the artifact `npm ci` installs the delivered presence
 *  IS this number. The banked ~0.19 (placeholder + armed canvas each reading
 *  `--aurora-opacity-ceiling` as their own element opacity, composing to
 *  1-(1-c)²) reproduces ONLY against the pre-release dist sitting in this
 *  tree's node_modules — measured here, and the same substrate schism the
 *  producer's own reply reports from its end. Halving to 0.05 would calibrate
 *  the hero against a local artifact no clean install reproduces and ship a
 *  half-presence wash everywhere else, so it is DECLINED with its reason. The
 *  node_modules/registry reconciliation is the substrate wave's row, not this
 *  component's. */
export const HERO_AURORA_OPACITY_CEILING = 0.1;
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useEventListener, useMediaQuery, useWindowSize } from "@vueuse/core";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import type { OklchStop } from "@mkbabb/glass-ui/aurora";
import {
    Aurora,
    PAPER_WASH_GROUND,
    resolveAtoms,
} from "@mkbabb/glass-ui/aurora";

const auroraRef = useTemplateRef<InstanceType<typeof Aurora>>("auroraRef");

/** The renderer-status payload, DERIVED from the primitive's own emit
 *  declaration rather than restated: `RendererStatus` reaches no published
 *  subpath at 7.0.0 (measured over all 73 exports), and a hand-copied shape
 *  would be one producer edit away from a silent divergence. */
type AuroraRendererStatus = Parameters<
    NonNullable<InstanceType<typeof Aurora>["$props"]["onRendererStatus"]>
>[0];

/** The OD-6 violet accent axis (the `--accent-kf` oklch ~295° family the T.D7
 *  ramp landed), resolved ONCE into the library's own anchor form.
 *  `hexToOklchStop("#7c5ce6")` at the installed dist returns exactly this
 *  triple, so the delivered palette is unchanged — what changes is that the
 *  seed no longer traverses the token bridge, where `cssToOklch` throws a
 *  `GlassColorError` on any contextual or non-opaque value. A seed STRING is
 *  one token-ising edit (`var(--accent-kf)`, a `color-mix()`) from a
 *  white-screened home route; the anchor form cannot be that edit (KF-HA-13).
 *  The producer declines a non-throwing bridge — catch-to-default would
 *  silently substitute the stock palette — and names this form as the posture
 *  it wants consumers in. */
const HERO_SEED: OklchStop = {
    L: 0.5802912047731661,
    C: 0.19957241676232773,
    h: 289.3528840535089,
};

const { isDark } = useGlobalDark();

// The field is authored through the ≤7-knob atoms door (glass-ui's consumer
// surface over the full config schema), then spread over PAPER_WASH_GROUND —
// the library's OWN recessive-ground crayon calibration ("paper-on-tooth"),
// which is exactly this page's register: pigment IN the graph paper, not a
// painted field over it. Color energy stays LOW so the ink (grid lines, hero
// glyphs, the die) remains the read.
//
// KF-APP-48 — THE SPREAD, NAMED: the ground is spread AFTER the door, and it
// re-pins EXACTLY 7 of its 12 keys over the resolved config — `medium`,
// `strokeOrient`, `granulation`, `canvasGrain`, `strokeAmount`,
// `strokeAnisotropy`, `saturation` (measured at the installed dist; the other
// five already agree). The trap this note exists to defuse: `saturation` is a
// `colorEnergy`-derived limb, so a future colorEnergy retune moves the limbs
// the door computes while the ground keeps re-pinning this one — retune the
// two together or move the key out of the ground spread.
//
// KF-HA-3 — THE DARK LEG, THREADED: `config` is a computed over the global
// dark state, and `lightnessScheme` is the door's own lever for it. The seed
// alone banded the derived ramp in the light-pastel L range on BOTH arms while
// the surrounding page ink retinted — the "both themes" claim the old prose
// made without a mechanism. The rendered judgement (violet tint vs pale film
// over a near-black ground) is the visual audit's.
//
// KF-HA-1 — THE CURSOR AXIS, HONESTLY NAMED: `swirl` is what this config
// actually runs. The former cursor-as-light atom (`interactivity.light`,
// spelled here as a path deliberately: a retired atom should grep to zero in
// this file, prose included) resolved to
// exactly this object (measured: `{ swirl: true, amplitude: 0.5 }` — the door
// drops `light`, and `swirl` defaults ON whenever interactivity is engaged),
// so the delivered field is byte-for-byte unchanged. `light` steers a
// direction consumed only by the impasto relight, every term of which is
// multiplied by `impasto` — 0 on this ground — which is why the cured-vs-
// shipped visual delta measured exactly zero. It was also a hard TS2345 at
// 7.0.0, whose atoms union declares `light?: never` on the smooth arm. The
// axis was NOT authored wrong: at 6.0.0 the interactivity atom was a flat type
// and the door carried `light` through unconditionally (read at the producer's
// own v6.0.0 source) — a silent cross-major regression, dropped for this
// medium at the 7.0.0 union. The owner's wording was "done right OR removed":
// removed, because "done right" means an impasto-bearing medium, and this
// page's blessed medium is the paper wash.
//
// KF-HA-10 — OPEN OWNER QUESTION, NOT DECIDED HERE: `motion: "drifting"`
// resolves to a nonzero drift, so the field never parks outside reduced
// motion — a whole-session GPU loop under the least-visible layer on the page.
// The amendment cut PRESENCE, not COST. Keeping the drift register is
// spendable only with the frame-cost figure in hand; this seat had none, so
// the register is left exactly as the owner blessed it and the question
// travels intact.
//
// KF-HA-20 — the three passed values that restated library defaults
// (`harmony: "analogous"`, `zones.arrangement: "composed"`, and the
// `render-mode="auto"` prop) are gone: measured at the installed door, the
// resolved config is identical with and without them, so they read as
// authored overrides while overriding nothing. A default that moves at a
// producer bump moves this field with it — deliberately, the same way every
// other unspecified knob does.
const config = computed(() => ({
    ...resolveAtoms({
        seed: HERO_SEED,
        colorEnergy: 0.18,
        zones: { count: 3 },
        noise: 0.45,
        motion: "drifting",
        lightnessScheme: isDark.value ? "dark" : "light",
        interactivity: { swirl: true },
    }),
    ...PAPER_WASH_GROUND,
}));

// KF-HA-15 — the one breadcrumb. A GPU init failure degrades to the palette
// ground (good UX, and the reason this stays a console line rather than a
// visible state), but it degraded SILENTLY: neither `onInitError` nor this
// status was bound anywhere, and the app installs no error handler.
const onRendererStatus = (status: AuroraRendererStatus) => {
    if (status.phase !== "error") return;
    console.warn(
        `[HeroAurora] aurora renderer failed on ${status.engine} (${status.adapter}) — the palette ground stays as the surface.`,
        status.error,
    );
};

// ── Cursor wiring — the exposed setCursor API, ZERO element-geometry reads ───
// The lane-12 recurrence guard (T-CL-3) forbids the read-after-write
// pointermove pattern (getBoundingClientRect + setProperty per event forced a
// full-document layout ~1,100-2,000× the isolated cost). setCursor mutates JS
// state only; Aurora's frame loop uploads once per rAF.
//
// KF-APP-49 — `useCursorInteraction` EVALUATED, DECLINED at the bytes: the
// published composable reads `getBoundingClientRect()` per pointer event (read
// at the installed dist) — the very pattern the guard above forbids — and it
// authors nuclei CRUD, which is not what a decorative backdrop wants. The
// primitive's own docblock sanctions the door taken here ("or call the exposed
// `setCursor` API … so the consumer controls pointer policy"), so this is a
// justified bespoke, not a hand-roll.
//
// KF-HA-9 — the viewport metrics come from `useWindowSize()` (already a
// dependency) instead of per-event `innerWidth`/`innerHeight` reads, which are
// on the forced-layout list and ran in every degenerate state (the css
// substrate, the pre-arm window) for nothing. The reduced-motion early-out is
// the consumer half of the same row: the producer's runtime pins shader time
// and early-outs the pointer write under reduced motion, so the write was
// buying a redraw of the frame already on screen. Nothing goes stale — the
// state the guard skips is state the runtime was discarding.
//
// KF-HA-11 — ONE pointer policy, coherent in all three places: touch is the
// class excluded (pen hover is a mouse-like engagement and is now kept), the
// leave handler takes its event and gates on the SAME class rather than
// clearing an engagement only a pointer it excludes could have created, and a
// hidden tab releases the cursor instead of leaving the field parked at a
// stale attractor.
const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
const { width, height } = useWindowSize();

const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (reducedMotion.value) return;
    // KF-HA-8 — ONE retune under the amendment, both knobs: the strength
    // argument is dropped, so the axis runs at the library's own default (0.8)
    // instead of the maximum 1 no comment or verdict ever blessed; the cursor
    // RADIUS is examined and left at the library default too — the knob is
    // exposed (`setCursorRadius`) and calling it would spend an invented
    // number on an axis whose loudness only a rendered viewport can judge.
    auroraRef.value?.setCursor(e.clientX / (width.value || 1), e.clientY / (height.value || 1));
};

const releaseCursor = () => {
    auroraRef.value?.clearCursor();
};

const onPointerLeave = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    releaseCursor();
};

// The listener surface rides @vueuse/core (the E.W2 §S1–S3 brittleness
// discipline: tryOnScopeDispose cleanup — the layer's home-only mount/unmount
// tears the listeners down with the component scope, no manual pairs).
useEventListener(window, "pointermove", onPointerMove, { passive: true });
useEventListener(() => document.documentElement, "pointerleave", onPointerLeave);
useEventListener(document, "visibilitychange", () => {
    if (document.hidden) releaseCursor();
});
</script>

<style scoped>
/* KF-HA-12 — the two-line consumer stopgap, on THIS wrapper's own class and
   copying no producer selector: the aurora is in neither the producer's
   `forced-colors` sweep nor its `prefers-reduced-transparency` sweep at 7.0.0
   (its a11y arms are CSS, and `forced-colors` forces CSS-painted colour while
   leaving canvas pixels alone). A decorative full-viewport wash is exactly
   what both preferences ask to lose, and the page is designed to read without
   it — the ink IS the content. The producer arms both queries inside its own
   component at HEAD, which retires this block at the bump.

   KF-HA-16 — the former wrapper <div> and its sizing block are GONE: Aurora
   renders a single root, so `fixed inset-0`, `pointer-events-none` and
   `aria-hidden` fall through to it, and `height: 100dvh/width: 100dvw` (plus
   its `@supports` fallback) only ever restated what `fixed inset-0` already
   guarantees in every engine that ever shipped. One DOM node fewer, and this
   class survives as the a11y hook. */
@media (forced-colors: active) {
    .hero-aurora {
        display: none;
    }
}

@media (prefers-reduced-transparency: reduce) {
    .hero-aurora {
        display: none;
    }
}
</style>
