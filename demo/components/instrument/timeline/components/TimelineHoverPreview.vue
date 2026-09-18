<template>
    <!-- D-15 (THP layout pair) demo half — reka publishes the height it has
         actually computed for this side of the trigger; the panel is bounded by
         THAT rather than by a guess, so a tall capture can never push the
         tooltip past the viewport slot it was given. The producer half (glass
         `TooltipContent` consuming the same variable) rides the BH relay. -->
    <div
        class="flex flex-col items-center gap-1.5 overflow-y-auto"
        :style="{ maxHeight: 'var(--reka-tooltip-content-available-height)' }"
    >
        <!-- The caption names the keyframe the way its AUTHOR does (KF.W7 G6 /
             C-5 (THP) + N-2): the typed label leads when there is one, then the
             AUTHORED selector — a named scroll phase renders as the phase the
             author wrote, never as a percent nobody typed — with the resolved
             position kept as the secondary reading. -->
        <div class="flex items-baseline justify-center gap-1 max-w-full">
            <span
                v-if="keyframe.label"
                class="text-mono-caption font-semibold truncate"
                >{{ keyframe.label }} ·</span
            >
            <span class="text-mono-caption font-semibold tabular-nums">{{ authoredSelector }}</span>
            <span
                v-if="resolvedPosition"
                class="text-mono-caption text-muted-foreground tabular-nums"
                >({{ resolvedPosition }})</span
            >
        </div>

        <!-- THE MEDIA BOX — ONE RESERVED SLOT (M9 + D-12 (THP)).
             The panel used to size itself to whatever the media happened to be:
             an unsized 64px ghost swapped, mid-hover, for a `w-36 h-auto`
             capture of unknown aspect, so the tooltip jumped under the pointer
             at the exact moment the async work landed — on an instrument whose
             subject is motion quality. The box is reserved at both arms' outer
             size, so the ghost→image swap changes pixels and not layout; it is
             also the one alignment rule the stack was missing (the media was
             centred while the code block beneath it ran full width).

             FIVE STATES, EXHAUSTIVE (MISSED-4 · L-D4/C-4(b)) — `ready` paints
             the capture; `capturing`, `failed`, a ghostable keyframe with no
             capture, and a keyframe with nothing ghostable at all ALL paint the
             plate, and the status line below says which of the four it is. The
             `v-else` is terminal: before it, a keyframe with no ghost-mappable
             property and no capture rendered NOTHING AT ALL — an empty media
             slot with no explanation, eight lines from a file that renders an
             explicit empty state for the declaration list. -->
        <div class="w-36 h-24 grid place-items-center">
            <img
                v-if="entry?.kind === 'ready'"
                :src="entry.src"
                :alt="altText"
                class="max-w-full max-h-full object-contain rounded border border-border/30"
                @error="emit('previewFailed', 'The captured preview failed to decode')"
            />
            <!-- GHOST-PLATE + MISSED-4 — THE PLATE IS FIXED, THE PAYLOAD MOVES.
                 `scale(0.3) ${transform}` was composed onto THIS element, so the
                 frame shrank with its own content: a 0.3px border at 30% alpha
                 and a 1.2px radius, which is exactly when a near-transparent
                 keyframe needs the frame most. Worse, the composition put the
                 authored translate INSIDE the scaled frame, so a 300px slide
                 displaced the swatch 90px and the tooltip's own
                 `overflow-hidden` clipped it away — a preview that was wrong
                 and invisibly so. The plate is never transformed now; the
                 wrapper inside it carries the decomposed rotate/scale/skew and
                 the swatch carries the paint. -->
            <div
                v-else
                class="ghost-plate w-16 h-16 rounded-md border border-border/40 bg-muted/30 overflow-hidden grid place-items-center"
            >
                <div
                    v-if="ghost.present"
                    class="ghost-xform"
                    :style="ghost.transform ? { transform: ghost.transform } : {}"
                >
                    <div class="ghost-swatch w-8 h-8 rounded-sm bg-foreground/15" :style="ghost.swatch"></div>
                </div>
            </div>
        </div>

        <!-- THE STATUS LINE — the fourth state that used to be silent.
             A capture that failed retried on EVERY hover, forever, and said
             nothing; a keyframe with nothing to draw said nothing either. The
             line is `aria-live="polite"` so the capturing→settled transition is
             announced once rather than read as a frozen run-on.

             THP L-D7 — a status line is UI prose, not data: "Capturing..." wore
             a demo-authored mono chip register (uppercase, fixed 10px), a T.D4
             breach no allowlist selector could reach (it is a SIBLING of the
             code-register div). It takes the caption register in the TEXT face
             (W6-G role (d)) — the tooltip's own body rung, muted. The
             REGISTER-LAUNDER datum (the census gate cannot see a transform) is
             KF.W4's and is carried, not re-booked. -->
        <div
            v-if="statusLine"
            class="text-caption text-muted-foreground text-center"
            role="status"
            aria-live="polite"
        >
            {{ statusLine }}
        </div>
        <!-- THP D-5 (+ D-17's load-bearing `/70`) — THE PROP/VALUE TWO-TONE,
             given two REAL registers. The authored distinction was one register
             and one alpha: the value tier read `--muted-foreground` from the
             container and the prop tier read `--foreground` at 70%. On a
             floating surface `.glass-floating` PROMOTES `--muted-foreground`
             (to the on-glass strong rung), so the two tiers converged — null in
             light, INVERTED in dark — and the whole distinction ended up carried
             by the literal `:` between them. The promotion is not fought here
             and is not fought per-site: the prop tier simply takes `--foreground`
             at full strength, which no surface promotes past, so the pair holds
             its order in BOTH arms and on BOTH the `@container` and
             `contrast-color` routes. No WCAG breach is claimed and none is
             imported — glass is credited for the promotion that prevents one;
             painted ratios and which-arm-is-live stay KF.W9/SS-13's. -->
        <!-- THP D-4 UNDER THE MISSED-3 CURE-COLLISION LAW (G-W6-8) — the
             register swap and the box resize are ONE edit, by construction.
             D-4: this list overrode the tooltip's own declared body size
             DOWNWARD to a fixed 10px at line-height 1, uppercased and
             caps-tracked, for a ~10-row scrolling dump of CSS declarations. It
             takes `text-mono-small` (W6-G roles (b)/(e): mono, case-preserving,
             `--type-small` at leading 1.4); the redundant mono family utility
             is the fourth and last of the D-18 pass.
             MISSED-3, re-derived at the bytes: the old box was 24 × 0.25rem =
             96px of 10px rows → 9.6 rows visible; the new rows are 1.4em of a
             14–20px glyph = 19.6–28px, so the SAME box would show 4.9→3.4 rows
             and worsen D-3 (the hidden rows are keyboard-unreachable). The
             bound is therefore re-denominated in the register's OWN em on the
             element that carries it: 12.6em = 9 rows × 1.4 at every fluid size,
             so the scroller (the affordance — the bound is replaced, never
             dropped) shows the same nine rows it always did. A-9 — the
             producer's TooltipContent block ceiling — is NOT in the installed
             7.0.0 (I-35 §2: it exists at HEAD only), so this bound is the
             component's own and does not lean on one.
             MISSED-6 — `overflow-y-auto` ALONE makes this a scroll container on
             BOTH axes (CSS Overflow 3), which is the mechanism behind D-3's
             focusable-scroller horn; the x axis is CLIPPED explicitly, the
             cluster's own mixed-pair discipline. -->
        <div
            class="text-mono-small text-muted-foreground max-h-[12.6em] overflow-x-clip overflow-y-auto w-full"
            data-register="code"
        >
            <!-- D-2/L-D9 — a row is `truncate`d at ~29 characters against a
                 capture set holding 80-character matrices, and the panel offers
                 no wrap, no copy and no title: the value the tooltip exists to
                 show was the one thing it would not show. The full declaration
                 is the row's own `title`, which costs nothing and is the one
                 affordance a portalled tooltip can carry. (Monaco remains the
                 full-fidelity reading — the reason this is MINOR.) -->
            <div
                v-for="[prop, val] in Object.entries(keyframe.vars)"
                :key="prop"
                class="truncate"
                :title="`${prop}: ${val}`"
            >
                <span class="text-foreground">{{ prop }}</span>: {{ val }}
            </div>
            <!-- THP MISSED-2 — the empty state's only differentiator was an italic
                 that cannot paint (no italic face, no synthesis: the demo's one
                 italic decision, style.css). A REAL differentiator: the TEXT face
                 at the caption rung against the mono declaration rows it stands
                 in for — a change of voice, not of slant. -->
            <div v-if="Object.keys(keyframe.vars).length === 0" class="text-caption">No properties</div>
        </div>
    </div>
</template>

<script lang="ts">
/**
 * THE PANEL'S DERIVATIONS — pure, exported, and the ONE definition of what this
 * tooltip says (KF.W7 G9).
 *
 * MISSED-1: the accessible description reka builds for a `TooltipContent` with
 * no `ariaLabel` is `currentElement.textContent` — an UNTRACKED DOM read taken
 * ONCE (`TooltipContentImpl.js:87`, `props.ariaLabel || currentElement.value
 * ?.textContent`). It excluded the `<img alt>` entirely, ran every block
 * boundary together without a separator, and froze at first mount, so the
 * ghost→image swap never reached an AT user at all. The cure is to PASS the
 * description; the mount that must pass it is `TimelineTrack`'s.
 *
 * It lives HERE rather than at that mount because every input it needs is
 * already derived here and nowhere else: the authored caption (C-5 (THP) — a
 * named scroll phase is captioned with the phase the author wrote, never a
 * percent nobody typed), and the ghost predicate (G10's mappable set). The G9
 * design's own rule is that the description is DERIVED from the data that
 * renders it and never a second hand-typed string that can drift — a
 * `describeKeyframe` written at the track would have had to re-derive both by
 * hand, which the design forbids in the same breath ("not duplicated by hand in
 * TT"). A plain `<script>` block beside the setup block is how an SFC exports a
 * pure function; `vue-tsc` resolves it, and nothing else in the file moves.
 */
import { selectorText } from "@utils/keyframeSelector";
import type { PreviewEntry } from "../composables/useTimelineBuild";
import type { TimelineKeyframe } from "../timelineTypes";

/**
 * The properties the ghost can actually paint. Exported so the description and
 * the drawing agree on what "there is a ghost" means by construction.
 */
export const GHOST_PROPERTIES = [
    "background-color",
    "background",
    "color",
    "opacity",
    "border-radius",
    "transform",
] as const;

export const hasGhost = (vars: Record<string, string>): boolean =>
    GHOST_PROPERTIES.some((property) => vars[property] !== undefined);

/** L-D14 — the rounded position, derived ONCE (it was written twice). */
const percentOf = (keyframe: TimelineKeyframe): number =>
    Math.round(keyframe.percent);

/**
 * C-5 (THP) — a PERCENT selector's authored form IS its position (presentation
 * rounding, no discriminant lost); a NAMED phase's authored form comes from
 * `selectorText`, the same serialization the engine's merge key uses.
 */
export const authoredSelectorOf = (keyframe: TimelineKeyframe): string =>
    keyframe.selector.kind === "percent"
        ? `${percentOf(keyframe)}%`
        : selectorText(keyframe.selector);

/** The resolved position, shown only when it is NOT what the author wrote. */
export const resolvedPositionOf = (keyframe: TimelineKeyframe): string | null =>
    keyframe.selector.kind === "percent" ? null : `${percentOf(keyframe)}%`;

/**
 * The `<img>`'s own name — what a reader who lands ON the capture hears, rather
 * than the whole panel a second time.
 */
export const previewAlt = (keyframe: TimelineKeyframe): string =>
    `Rendered preview of ${keyframe.label ? `${keyframe.label}, ` : ""}the keyframe at ${percentOf(keyframe)}%.`;

/**
 * THE ACCESSIBLE DESCRIPTION — one sentence per thing the panel shows.
 *
 * PUNCTUATED AT EVERY BOUNDARY, which is the whole of MISSED-1's second horn:
 * `. ` ends each sentence and `; ` separates declaration rows, so a screen
 * reader pauses where the eye does instead of reading a stylesheet as one
 * breath. RE-DERIVED, because it is a pure function of the keyframe and its
 * preview entry: the ghost→image swap changes `entry.kind`, which changes this
 * string, which changes the prop reka reads first — the once-captured
 * `textContent` path is never taken while the prop is a non-empty string.
 * NEVER FORCE-UPPERCASED (M7), because it is a string and not a text node: no
 * `text-transform` reaches it, and the property values reach AT in the case the
 * author typed them.
 */
export const describeKeyframe = (
    keyframe: TimelineKeyframe,
    entry: PreviewEntry | undefined,
): string => {
    const resolved = resolvedPositionOf(keyframe);
    const head =
        `${keyframe.label ? `${keyframe.label}. ` : ""}` +
        `Keyframe at ${authoredSelectorOf(keyframe)}${resolved ? ` (${resolved})` : ""}. `;

    const media =
        entry?.kind === "ready"
            ? "Rendered preview available. "
            : entry?.kind === "capturing"
              ? "Capturing preview. "
              : entry?.kind === "failed"
                ? `Preview unavailable: ${entry.error}. `
                : hasGhost(keyframe.vars)
                  ? "Ghost preview. "
                  : "No preview. ";

    const rows = Object.entries(keyframe.vars);
    const body = rows.length
        ? `${rows.map(([property, value]) => `${property} ${value}`).join("; ")}.`
        : "No properties.";

    return head + media + body;
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { clamp } from "@mkbabb/value.js/math";
import { decomposeMatrix2D, decomposeMatrix3D } from "@mkbabb/value.js/transform";
import type { Mat4 } from "@mkbabb/value.js/transform";

const props = defineProps<{
    keyframe: TimelineKeyframe;
    /**
     * L-D8/C-4(a) — `ghostStyle` was a REQUIRED prop that was a pure function of
     * this component's first prop, computed by the mount owner in a geometry
     * component that had no other use for it. It is gone: the preview derives
     * its own preview. `entry` is the one thing the leaf genuinely cannot know,
     * and it is optional because "never hovered" is a real state.
     */
    entry?: PreviewEntry | undefined;
}>();

const emit = defineEmits<{
    (e: "previewFailed", message: string): void;
}>();

// C-5 (THP) — the `KeyframeSelector` discriminant was dropped here: every
// caption was `Math.round(percent)%`, so `entry 100%` and `cover 0%` both read
// "25%" — a percent the author never wrote, on the panel whose whole job is to
// say which keyframe this is. The caption reads the SAME derivations the
// accessible description does (above), so the two can never disagree.
const authoredSelector = computed(() => authoredSelectorOf(props.keyframe));

/** The resolved position, shown only when it is NOT what the author wrote. */
const resolvedPosition = computed(() => resolvedPositionOf(props.keyframe));

/**
 * MISSED-1's media sentence, re-derived (KF.W7 G9's hand-off).
 *
 * A `computed`, so the ghost→image swap produces a NEW string rather than
 * leaving the first mount's reading frozen in place — which is exactly the
 * defect reka's `props.ariaLabel || currentElement.textContent` reproduces when
 * nothing is passed to it.
 */
const altText = computed(() => previewAlt(props.keyframe));

/**
 * THE GHOST — decomposed, with the translation dropped (D-7 · m-7/m-8's design
 * half · MISSED-4).
 *
 * `transform` is read ONLY in the UA-normalised `matrix()` / `matrix3d()` form —
 * the form `getComputedStyle` yields and the form the scrub engine writes back.
 * Anything else (an authored function list, `none`, a half-typed value) yields
 * NO wrapper transform: validating author input belongs at the parse boundary
 * L-6/C-4's delegation created, not here, and this component hand-rolls no
 * parser of its own. `translate` is dropped on purpose — inside a 64px plate it
 * is meaningless, and composed onto the plate it was actively misleading; the
 * authored value is still readable, verbatim, in the declaration rows below.
 */
const numericList =(inner: string, arity: number): number[] | null => {
    const parts = inner.split(",").map((part) => Number(part.trim()));
    return parts.length === arity && parts.every(Number.isFinite) ? parts : null;
};

const ghostTransform = (raw: string | undefined): string | null => {
    if (!raw) return null;
    const value = raw.trim();

    const flat = /^matrix\(([^()]*)\)$/.exec(value);
    if (flat) {
        const n = numericList(flat[1]!, 6);
        if (!n) return null;
        const d = decomposeMatrix2D(n[0]!, n[1]!, n[2]!, n[3]!, n[4]!, n[5]!);
        // CSSOM §15.1 recomposes as rotate · skewX · scale (the order
        // `recomposeMatrix2D` inverts); `skew` is the TANGENT of the skew angle.
        return `rotate(${d.angle}rad) skewX(${Math.atan(d.skew)}rad) scale(${d.scaleX}, ${d.scaleY})`;
    }

    const volumetric = /^matrix3d\(([^()]*)\)$/.exec(value);
    if (volumetric) {
        const n = numericList(volumetric[1]!, 16);
        if (!n) return null;
        const d = decomposeMatrix3D(n as unknown as Mat4);
        if (!d) return null;
        const [x, y, z, w] = d.quaternion;
        const sin = Math.sqrt(Math.max(0, 1 - w * w));
        // Perspective is NOT represented: a plate is not a stage (stated, not
        // hidden — G10-GHOST-CACHE-DESIGN §5).
        const rotation =
            sin < 1e-6
                ? ""
                : `rotate3d(${x / sin}, ${y / sin}, ${z / sin}, ${2 * Math.acos(clamp(w, -1, 1))}rad) `;
        return `${rotation}scale3d(${d.scale[0]}, ${d.scale[1]}, ${d.scale[2]})`;
    }

    return null;
};

const ghost = computed(() => {
    const vars = props.keyframe.vars;
    const swatch: Record<string, string> = {};

    const paint = vars["background-color"] ?? vars["background"] ?? vars["color"];
    if (paint) swatch.backgroundColor = paint;
    // `opacity: "0"` is the world's most common authored keyframe and it
    // survives every truthiness filter as the string "0". It belongs on the
    // SWATCH, where an invisible payload still leaves a visible plate — it used
    // to paint the whole 64px box to nothing while still occupying layout.
    if (vars["opacity"] !== undefined) swatch.opacity = vars["opacity"];
    if (vars["border-radius"]) swatch.borderRadius = vars["border-radius"];

    const transform = ghostTransform(vars["transform"]);

    return {
        present: hasGhost(vars),
        swatch,
        transform,
    };
});

/**
 * What the panel SAYS about the state the media box is painting — the half of
 * the five arms that is prose rather than pixels, so the plate itself is
 * written once.
 */
const statusLine = computed<string | null>(() => {
    if (props.entry?.kind === "ready") return null;
    if (props.entry?.kind === "capturing") return "Capturing preview";
    if (props.entry?.kind === "failed")
        return `Preview unavailable — ${props.entry.error}`;
    return ghost.value.present ? null : "No previewable properties";
});
</script>
