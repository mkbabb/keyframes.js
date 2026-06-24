<template>
    <!-- G6 + G5 (H.W10.S4) — the easing sidebar NORMALIZED onto the standard
         controls component: ONE `Card surface="cartoon" tier="quiet"` (the H.W9
         quiet register; the Card primitive carries the `rounded-card` token by
         construction — dissolves G2's square-corner) wrapping `Labeled*`
         label-left rows in ONE `panel-content` flow.

         J (H.W12.S7) — the easing sidebar is MINIMAL, controls-like (round-4
         feedback, j-easing-minimalism.md). The `<EasingSelect>` dropdown IS the
         sole easing selector; the curve IS the subject. STRIPPED of redundant
         chrome: the former `<LabeledInput label="value">` CSS-value text input +
         its "value" label + the trailing inline CopyButton (J1+J2 — the dropdown
         replaced the text field; the curve editor + the dropdown name the curve)
         and the `<h2 class="text-title">` scene title (J5 — controls carry no big
         per-scene title). The reclaimed vertical space grows the hero canvas
         (J6) and the duration control runs FULL-WIDTH (J3). One flat CardContent
         (J4 — no nested wrapper). -->
    <Card surface="cartoon" tier="quiet" class="easing-editor w-full overflow-visible">
        <!-- J4 — ONE flat CardContent (no double container). The hero
             EasingEditor + the full-width duration are its only children; the
             optional steps rows join the uniform label-column subgrid. -->
        <CardContent class="panel-content labeled-field-grid px-4 py-3">
            <!-- I.W2.S4 — the ONE shared EasingEditor (the curve dropdown +
                 editable canvas + read-only readout/copy). The rail adapts
                 `demo.*` onto the normalized contract; the SAME editor mounts in
                 the in-panel TimingFunctionPanel, so the curve-change capability +
                 J's minimal chrome are identical everywhere. I.W2.S3 folds back
                 the readout J stripped from this rail (the parity gap) as the
                 complete, re-parseable literal (`readoutLiteral`).

                 EASTER EGG "the Gallery" (H.W12.S6): double-click the canvas to
                 tour the expressive easing catalogue (back/bounce/elastic). The
                 dblclick rides a thin wrapper (the EasingCurveCanvas root is a
                 GlassPanel that does not forward native listeners reliably), and
                 is distinct from the bezier handle drag (pointerdown) so it never
                 fights the editor. `display: contents` keeps the wrapper out of
                 the subgrid flow — the editor stays the full-width hero child. -->
            <div class="canvas-egg-host" @dblclick="demo.gallery">
                <EasingEditor
                    :easing-fn="demo.currentEasingFn.value"
                    :svg-path="demo.svgPath.value"
                    :progress="demo.progress.value"
                    :current-name="demo.currentEasingName.value"
                    :timing-functions-and="demo.timingFunctionsAnd"
                    :bezier-points="demo.isBezierEditable.value ? demo.bezierControlPoints.value : undefined"
                    :editable="demo.isBezierEditable.value"
                    :readout-value="readoutLiteral"
                    :ghost-path-d="demo.ghostPathD.value"
                    @update:bezier-points="demo.updateBezierPoints"
                    @update:name="demo.selectEasing"
                />
            </div>

            <!-- Step options (shown only for steps) — label-left rows -->
            <template v-if="demo.isSteps.value">
                <LabeledInput
                    :model-value="demo.stepOptions.value.steps"
                    type="number"
                    label="steps"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Number of discrete steps (1–60)"
                    @update:model-value="onStepsChangeValue"
                />
                <LabeledSelect
                    :model-value="demo.stepOptions.value.jumpTerm"
                    :is-open="jumpOpen"
                    :items="JUMP_TERMS"
                    label="jump"
                    label-class="text-mono-small text-muted-foreground"
                    tooltip="Step jump term"
                    @update:model-value="(v) => { demo.stepOptions.value.jumpTerm = v; }"
                    @update:open="(v) => { jumpOpen = v; }"
                />
            </template>

            <!-- Duration row — FULL-WIDTH (J3). The `.duration-field` modifier
                 opts the LabeledSlider OUT of the subgrid's 2-track row so the
                 slider spans the full CardContent inner width (label above the
                 track, the controls-like full-bleed posture). It is STILL a
                 glass-ui `.labeled-field` (the normalized-sidebar gate's ≥1-row
                 invariant holds; the rung stays standard). -->
            <LabeledSlider
                class="duration-field"
                :model-value="demo.duration.value"
                label="duration"
                label-class="text-mono-small text-muted-foreground"
                tooltip="Sweep duration (ms)"
                :min="300"
                :max="5000"
                :step="100"
                @update:model-value="(v) => { demo.duration.value = v; }"
            />

            <!-- Q.WC2 S3 — the WRITABLE numeric readout (precision authoring). The
                 read-only `(x1,y1,x2,y2)` readout is now an editable
                 `cubic-bezier(…)` / `steps(…)` field that round-trips through
                 `parseCSSValue` back into the bezier model: type
                 `cubic-bezier(.17,.67,.83,.67)` and the curve + handles move; drag
                 a handle and the field updates. The numeric surface and the drag
                 surface are two views of ONE model. Malformed input holds the
                 last-valid value (the `:user-invalid` idiom — never clobbers the
                 live curve). Shown only when there is a parametric literal. -->
            <div v-if="readoutLiteral" class="curve-author-field">
                <label class="text-mono-small text-muted-foreground" :for="authorInputId"
                    >value</label
                >
                <input
                    :id="authorInputId"
                    ref="authorInputEl"
                    class="curve-author-input text-mono-small tabular-nums"
                    type="text"
                    :class="{ 'curve-author-input--invalid': authorInvalid }"
                    :value="authorDraft"
                    spellcheck="false"
                    autocomplete="off"
                    aria-label="Edit the easing value (cubic-bezier or steps literal)"
                    @input="onAuthorInput"
                    @change="commitAuthor"
                    @keydown.enter.prevent="commitAuthor"
                    @blur="resetAuthorDraft"
                />
            </div>

            <!-- P.W7 — the curve PHYSICS readout. A bezier/named curve is opaque:
                 the numbers (x1,y1,x2,y2) say WHERE the handles are, not what the
                 curve DOES. This strip samples the live `currentEasingFn` and
                 reveals its character — peak velocity (the steepest slope = the
                 "snap"), overshoot (how far past 1 it springs — back/elastic),
                 and anticipation (how far below 0 it pulls back first). A flat
                 `ease-out` reads "no overshoot"; `ease-out-back` reveals its
                 spring. Read-only telemetry (no per-frame cost — recomputes only
                 when the curve changes), styled with the editor's own tokens. -->
            <!-- EASTER EGG — "name that curve" (P.W7, the REVEAL egg): double-click
                 the physics block and it identifies the nearest NAMED easing to the
                 live curve (an RMS match across the catalogue), revealing what a
                 hand-dragged bezier "is" (e.g. a pulled curve resolves to
                 "≈ ease-out-back, 96% match"). Distinct from the canvas "Gallery"
                 dblclick (a different surface) — it teaches the named catalogue the
                 custom curve lives among. The badge auto-clears after a beat. -->
            <dl
                class="curve-physics"
                aria-label="Curve physics — double-click to identify the nearest named easing"
                @dblclick="identifyCurve"
            >
                <div v-if="nearestName" class="curve-physics-egg readout-accent text-mono-caption normal-case tabular-nums">
                    ≈ {{ nearestName }}
                </div>
                <div class="curve-physics-row">
                    <dt class="text-mono-small text-muted-foreground">peak velocity</dt>
                    <dd class="readout-accent text-mono-small tabular-nums">{{ physics.peakVel }}×</dd>
                </div>
                <div class="curve-physics-row">
                    <dt class="text-mono-small text-muted-foreground">overshoot</dt>
                    <dd
                        class="text-mono-small tabular-nums"
                        :class="physics.overshoot !== '0%' ? 'readout-accent' : 'text-muted-foreground'"
                    >{{ physics.overshoot }}</dd>
                </div>
                <div class="curve-physics-row">
                    <dt class="text-mono-small text-muted-foreground">anticipation</dt>
                    <dd
                        class="text-mono-small tabular-nums"
                        :class="physics.anticipation !== '0%' ? 'readout-accent' : 'text-muted-foreground'"
                    >{{ physics.anticipation }}</dd>
                </div>
                <p class="curve-physics-character text-mono-caption normal-case italic text-muted-foreground">
                    {{ physics.character }}
                </p>
            </dl>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { cubicBezierToString } from "@mkbabb/value.js";
import { Card, CardContent } from "@mkbabb/glass-ui";
import {
    LabeledInput,
    LabeledSelect,
    LabeledSlider,
} from "@mkbabb/glass-ui/labeled-field";

import EasingEditor from "@components/custom/EasingEditor.vue";
import type { EasingDemoContext } from "./easingKeys";

const JUMP_TERMS = ["jump-start", "jump-end", "jump-none", "jump-both"] as const;

const props = defineProps<{ demo: EasingDemoContext }>();
const demo = props.demo;

// LabeledSelect open-state (the sidebar has a single select that owns its flag).
const jumpOpen = ref(false);

// I.W2.S3 — the read-only readout's COMPLETE, re-parseable literal. For an
// editable bezier (custom or a named curve with a bezier approximation) it is
// the `cubic-bezier(x1, y1, x2, y2)` literal built from the live control points;
// for steps it is `steps(n, term)`. A bare named curve (`ease-out`) has no
// parametric literal to copy → `undefined` (the dropdown already names it, and
// the editor omits the readout). NEVER the bare `cubic-bezier` keyword.
const readoutLiteral = computed<string | undefined>(() => {
    if (demo.isBezierEditable.value) {
        return cubicBezierToString(...demo.bezierControlPoints.value);
    }
    if (demo.isSteps.value) {
        return `steps(${demo.stepOptions.value.steps}, ${demo.stepOptions.value.jumpTerm})`;
    }
    return undefined;
});

const onStepsChangeValue = (value: string) => {
    const v = parseInt(value, 10);
    if (v > 0) demo.stepOptions.value.steps = v;
};

// ── Q.WC2 S3 — the WRITABLE numeric readout (precision authoring) ──
// A local draft mirrors `readoutLiteral`; the user edits it freely. On commit
// (Enter / blur / change) it round-trips through `demo.parseCSSValue`: a valid
// literal moves the curve + handles; a malformed one is REJECTED (the field
// flags invalid and snaps back to the last-valid literal — never clobbers the
// live curve). The draft re-syncs to the live literal whenever the model changes
// from elsewhere (a drag, a keyboard nudge, a preset pick).
const authorInputId = "easing-author-value";
const authorInputEl = ref<HTMLInputElement | null>(null);
const authorDraft = ref(readoutLiteral.value ?? "");
const authorInvalid = ref(false);

// Keep the draft in lock-step with the live literal UNLESS the field is being
// edited (focused) — a drag/nudge/preset updates the field, but a mid-type edit
// is not yanked out from under the user.
watch(readoutLiteral, (lit) => {
    if (document.activeElement !== authorInputEl.value) {
        authorDraft.value = lit ?? "";
        authorInvalid.value = false;
    }
});

const onAuthorInput = (e: Event) => {
    authorDraft.value = (e.target as HTMLInputElement).value;
    authorInvalid.value = false;
};

const resetAuthorDraft = () => {
    authorDraft.value = readoutLiteral.value ?? "";
    authorInvalid.value = false;
};

const commitAuthor = () => {
    const ok = demo.parseCSSValue(authorDraft.value);
    if (ok) {
        authorInvalid.value = false;
        // Re-sync to the canonical serialized form (no float drift in display).
        authorDraft.value = readoutLiteral.value ?? authorDraft.value;
    } else {
        // Malformed → hold the last-valid value (the :user-invalid idiom).
        authorInvalid.value = true;
    }
};

// P.W7 — the curve-PHYSICS readout. Samples the live `currentEasingFn` to reveal
// the curve's CHARACTER (what it DOES), not its parameters (where its handles
// are). Pure derived read off the reactive `currentEasingFn` — recomputes ONLY
// when the curve changes, never per animation frame (no hot-path cost).
//
//   • peak velocity — the steepest slope max|f'(t)| (a finite-difference scan).
//     A linear curve is 1.0×; a snappy ease-out peaks high early then coasts.
//   • overshoot     — max(0, max_t f(t) − 1): how far the value springs PAST its
//     target (the back/elastic spring), as a percentage of the travel.
//   • anticipation  — max(0, −min_t f(t)): how far it pulls BELOW 0 first (the
//     wind-up before the throw), as a percentage.
// The 65-sample scan is exact enough for a readout (the curve is C¹ on [0,1]);
// it is plenty cheap as a once-per-curve-change computed.
const SAMPLES = 64;
const physics = computed(() => {
    const fn = demo.currentEasingFn.value;
    let maxY = 1;
    let minY = 0;
    let peakVel = 0;
    let prevY = fn(0);
    const dt = 1 / SAMPLES;
    for (let i = 1; i <= SAMPLES; i++) {
        const t = i / SAMPLES;
        const y = fn(t);
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;
        const v = Math.abs((y - prevY) / dt);
        if (v > peakVel) peakVel = v;
        prevY = y;
    }
    const overshootPct = Math.max(0, maxY - 1);
    const anticipationPct = Math.max(0, -minY);
    const fmtPct = (v: number) => (v < 0.005 ? "0%" : `${Math.round(v * 100)}%`);

    // A one-line character read — the curve's "story" in plain language.
    let character: string;
    if (overshootPct >= 0.005 && anticipationPct >= 0.005) {
        character = "anticipates, then overshoots — a full spring";
    } else if (overshootPct >= 0.005) {
        character = "springs past the target, then settles back";
    } else if (anticipationPct >= 0.005) {
        character = "winds up below zero before the throw";
    } else if (peakVel >= 2.4) {
        character = "snaps hard, then eases to rest";
    } else if (peakVel <= 1.05 && peakVel >= 0.95) {
        character = "constant velocity — a straight line";
    } else {
        character = "stays within bounds — no overshoot";
    }

    return {
        peakVel: peakVel.toFixed(2),
        overshoot: fmtPct(overshootPct),
        anticipation: fmtPct(anticipationPct),
        character,
    };
});

// EASTER EGG — "name that curve" (P.W7). Identify the nearest NAMED easing to the
// live curve by sampling both across [0,1] and ranking by RMS error. Reveals what
// a hand-dragged custom bezier "is" in the catalogue's language. Pure read off
// the already-present `demo.timingFunctionsAnd` registry (no new data, no engine
// call); fired on demand (a dblclick), never on the hot path.
const nearestName = ref<string | null>(null);
let nearestTimer: ReturnType<typeof setTimeout> | null = null;
const identifyCurve = () => {
    const cur = demo.currentEasingFn.value;
    let best: { name: string; err: number } | null = null;
    for (const [name, fn] of Object.entries(demo.timingFunctionsAnd)) {
        if (typeof fn !== "function" || name === "cubic-bezier") continue;
        let sse = 0;
        for (let i = 0; i <= 32; i++) {
            const t = i / 32;
            const d = (fn as (t: number) => number)(t) - cur(t);
            sse += d * d;
        }
        const err = Math.sqrt(sse / 33);
        if (!best || err < best.err) best = { name, err };
    }
    if (best) {
        const match = Math.max(0, Math.round((1 - best.err) * 100));
        nearestName.value = `${best.name}, ${match}% match`;
        if (nearestTimer) clearTimeout(nearestTimer);
        nearestTimer = setTimeout(() => {
            nearestName.value = null;
            nearestTimer = null;
        }, 3200);
    }
};

onBeforeUnmount(() => {
    if (nearestTimer) clearTimeout(nearestTimer);
});
</script>

<style scoped>
/* H.W4.S1 — the editor root is a container so the EasingCurveCanvas can size
   its block off the CONTAINER inline size, not the viewport. Pairs with the
   TimingFunctionPanel's own `easing-editor` container so the canvas is bounded
   in BOTH render hosts (the full-rail sidebar AND the in-panel detail Card).
   Baseline-2023 — no fallback owed. */
.easing-editor {
    container-type: inline-size;
    container-name: easing-editor;
}

/* The egg-host wrapper carries the "Gallery" dblclick without changing layout:
   `display: contents` dissolves its own box so the canvas remains the direct
   full-width grid child (the J6 grow + the subgrid full-bleed rule still apply
   to the canvas), while the wrapper stays in the DOM tree to catch the bubbled
   double-click. */
.canvas-egg-host {
    display: contents;
}

/* J6 (H.W12.S7) — the in-SIDEBAR hero canvas GROWS into the space the value
   input + the scene title freed (the user: "make the bezier visualizer bigger
   as such"). Mirrors the TimingFunctionPanel's in-panel grow idiom, but the
   sidebar is a FULL-HEIGHT rail (~579px pane, not a height-capped detail row),
   so it grows further.

   MEASURE-FIRST against the live easing sidebar (1440×900): post-strip the
   non-canvas chrome (the EasingSelect ~36px + the full-width duration ~44px +
   the px-4/py-3 padding + the two row gaps ≈ the `.easing-curve-canvas-wrapper`
   p-2) measured ≈150px of `scrollHeight − canvasBlockSize`. The pane budget
   before its `overflow-y-auto` engages is ~579px, so the canvas BUDGET ≈ 579 −
   150 ≈ 420px. The `64cqi` term ties the block to the CONTAINER inline width
   (~328px rail → ~210px) and grows toward the cap on a wider rail; the floor
   raises the former 160px to 260px (a REAL grow over the bare 38cqi/160 default);
   the `max-block-size` TRACKS the viewport-height budget (`min(56vh, 420px)`) so
   a short viewport never overflows the pane into scroll. The square LAW holds
   (`aspect-ratio:1` from EasingCurveCanvas — the height clamp only bounds the
   block axis). `:deep()` reaches the child's scoped canvas; this bounded ceiling
   wins over the canvas's own 280 default cap. */
.panel-content :deep(.easing-curve-canvas) {
    block-size: clamp(260px, 64cqi, 360px);
    max-block-size: min(56vh, 420px);
}

/* J3 (H.W12.S7) — the duration control is FULL-WIDTH. The `.duration-field`
   LabeledSlider opts OUT of the subgrid's 2-track `[label] [value]` row (the
   `.labeled-field-grid > .labeled-field { subgrid }` rule) and STACKS instead:
   the label sits on its own line, the slider track spans the full CardContent
   inner width. It stays a real glass-ui `.labeled-field` (the rung + the
   normalized-sidebar ≥1-row invariant hold) — only the row geometry changes,
   a befitting NAMED delta (the sole control deserves the full measure now that
   the input + title are gone). */
.panel-content :deep(.labeled-field.duration-field) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
}
/* The reka Slider root fills the row; the track + range stretch full-bleed. */
.panel-content :deep(.duration-field [data-slot="slider"]),
.panel-content :deep(.duration-field .slider-track) {
    width: 100%;
}

/* Q.WC2 S3 — the writable numeric authoring field. A compact label-left row
   beneath the editor; the input round-trips the `cubic-bezier(…)`/`steps(…)`
   literal through parseCSSValue. The `--invalid` state flags a malformed entry
   (the :user-invalid idiom) WITHOUT clobbering the live curve. */
.curve-author-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.4rem;
}
.curve-author-field > label {
    flex: 0 0 auto;
}
.curve-author-input {
    flex: 1 1 auto;
    min-width: 0;
    padding: 0.2rem 0.45rem;
    border-radius: var(--radius-sm, 0.375rem);
    border: 1px solid color-mix(in srgb, var(--border) 80%, transparent);
    background: color-mix(in srgb, var(--foreground) 3%, transparent);
    color: var(--foreground);
    outline: none;
    transition:
        border-color var(--duration-fast) var(--ease-standard),
        background var(--duration-fast) var(--ease-standard);
}
.curve-author-input:focus-visible {
    border-color: var(--ball-tone, var(--color-progress));
}
.curve-author-input--invalid {
    border-color: var(--destructive, #e5484d);
    background: color-mix(in srgb, var(--destructive, #e5484d) 8%, transparent);
}

/* P.W7 — the curve-physics telemetry block. A compact three-row instrument
   readout (label-left, accent-numeral-right) beneath the controls, separated by
   a hairline divider in the shared --border language (the same divider the
   instrument plates use). The accent numerals consume the demo-wide
   `.readout-accent` (--ball-tone) so they read as "the engine's live numbers",
   exactly like the square's telemetry strip. The character line is a quiet
   italic caption — the curve's story in one sentence. */
.curve-physics {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin: 0;
    padding-top: 0.55rem;
    border-top: 1px solid color-mix(in srgb, var(--border) 70%, transparent);
}
.curve-physics-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
}
.curve-physics-character {
    margin: 0.15rem 0 0;
    opacity: 0.85;
    line-height: 1.3;
}
/* The double-click identity badge (the egg) — a quiet accent chip that names the
   nearest catalogue curve, sitting above the rows. */
.curve-physics-egg {
    align-self: flex-start;
    padding: 0.05rem 0.4rem;
    margin-bottom: 0.1rem;
    border-radius: var(--radius-sm, 0.375rem);
    background: color-mix(in srgb, var(--ball-tone, var(--color-progress)) 12%, transparent);
}
.curve-physics {
    /* The whole block is the dblclick target — hint it's interactive. */
    cursor: default;
    user-select: none;
}
</style>
