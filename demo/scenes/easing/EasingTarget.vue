<template>
    <!-- T.E6 (OD-7 APPROVED 2026-07-06 — P-GALLERY is the blessed reference) —
         THE SPECIMEN DRAWER IS THE SCENE. The owner ruled the direction (#14
         "just have the easing balls previewed here"): the buried "All"
         balls-preview mode is PROMOTED to be the scene; the singular hero
         (EasingHeroStage + ghost/smear) is DELETED. Every named curve is a
         specimen tile — a sparkline portrait with a 14px OD-6-violet ball
         riding it at (phase, fn(phase)) (X.KF.W13W.b, OA-56: the ball is ON
         the curve; the hairline rail is gone) — under ONE shared sweep clock:
         all balls depart together, arrive per their curve. The comparative
         read IS the pedagogy. -->
    <!-- X-DS r6 pass 4 (KF-R6C4-01) — the plate ends with its drawer: its
         block size is its content's, capped at the stage's (`max-h-full`), and
         it hangs from the stage's top (`self-start`). The drawer still takes
         what the cap leaves (`flex-1 min-h-0`); when its fold lands on a row
         (EasingCatalogue's `landDrawer`), the freed height leaves the plate
         instead of standing under the fold as bare card.
         X-DS r6 pass 7 (KF-C7-03) — REVERSED: the plate stands at the stage
         cap (`h-full`), as Square, Spring and Sequence do, so the stage frame
         keeps one height across scenes. The drawer takes the whole free block
         and lands its rows by scrolling (EasingCatalogue's `landTop`), never
         by shrinking the plate: at 1440 the plate ended 82 px short of its
         siblings while the drawer still scrolled. -->
    <Card
        :shadow="false"
        class="easing-target easing-gallery flex h-full w-full flex-col gap-4
            overflow-hidden px-(--stage-plate-pad-inline) py-(--stage-plate-pad-block)"
    >
        <!-- Header: the selected specimen PROMOTED. Left — the curve name at
             the Instrument-Serif display rung + its COMPLETE re-parseable
             literal (Fira Code + CopyButton, never truncated). The family filter
             lives in the catalogue below (X.KF.W13W.p). -->
        <!-- X.KF.W13X.sections (A2-KE-L1-8) — the ONE SceneStageHeader; the
             title slot keeps the specimen-name swap (a keyed Transition). -->
        <SceneStageHeader
            class="gallery-header shrink-0"
            id-class="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 min-w-0"
        >
            <template #title>
                <Transition name="specimen-name" mode="out-in">
                    <h2
                        :key="demo.currentEasingName.value"
                        class="specimen-name text-display text-foreground"
                    >
                        {{ demo.currentEasingName.value }}
                    </h2>
                </Transition>
            </template>
            <template #readouts>
                <span class="specimen-literal" data-register="code">
                    <!-- UIA-KF-091 — one print per fact: an engine-named
                         curve's literal IS its name (value.js round-trips it
                         by registry lookup), so the line shows only when it
                         says something the name does not (a quad, a steps()
                         call). The copy control copies the literal either way. -->
                    <code
                        v-if="literal !== demo.currentEasingName.value"
                        class="literal-text text-mono-small"
                        data-readout="primary"
                        >{{ literal }}</code
                    >
                    <!-- S-7 (W6-I): the copy control is a glass Button that
                         owns its box and its ink. The bespoke copy-control
                         rule pair W6-I orphaned here (a 1rem box + muted ink
                         authored for the old zero-size host) is DELETED from
                         `EasingTarget.css` in this same commit — the routing
                         W6-I §4.1 handed this unit, discharged, so no recipe
                         survives that could be re-applied to the primitive and
                         un-do the reshell. -->
                    <CopyButton :text="literal" label="Copy easing literal" />
                </span>
            </template>
        </SceneStageHeader>

        <!-- X.KF.W13W.p (OA-58) — the drawer IS the one easing picker
             (`EasingCatalogue`): the family filter (one glass segmented control),
             the divider, the per-family sections and the tile idiom (curve + its
             ball ON the curve, the name beneath, never truncated; selection by
             ink + ring) all live there, shared with the Controls pane's easing
             dropdown. This stage hands it the scene's ONE sweep clock, so every
             ball departs together and arrives per its curve. The tiles are
             `data-surface="opaque"` inside this one glass plate (KF-ET-21: the
             host floats, its contents do not). -->
        <EasingCatalogue
            class="min-h-0 w-full flex-1"
            :model-value="demo.currentEasingName.value"
            :groups="SPECIMEN_GROUPS"
            :curve-for="fnForCurve"
            :clock="clock"
            label="Easing curve specimens"
            @update:model-value="onPick"
        />
    </Card>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { Card } from "@mkbabb/glass-ui";
import { cubicBezierToString } from "@mkbabb/value.js/math";

import CopyButton from "@components/CopyButton/CopyButton.vue";
import EasingCatalogue, {
    type CatalogueClock,
} from "@components/EasingCatalogue/EasingCatalogue.vue";
import SceneStageHeader from "../SceneStageHeader.vue";
import { EASING_DEMO_KEY } from "./easingKeys";
import { SPECIMEN_GROUPS, specimenCurve as fnForCurve } from "./specimens";

const demo = inject(EASING_DEMO_KEY)!;

// The specimen set and each tile's function (one stable object per name, its
// plot built when this chunk evaluates) live in `./specimens`.

// The scene's ONE sweep clock: the catalogue's painter registers on the demo's
// registerDotPainter seam (I.W4 D4) and repaints through it.
const clock: CatalogueClock = {
    register: (paint) => demo.registerDotPainter(paint),
    repaint: () => demo.repaintDots(),
};

// The tile press IS the curve selection (a name the catalogue emits is
// narrowed back to the scene's contract through the specimen set).
const SPECIMENS = SPECIMEN_GROUPS.flatMap((g) => g.items);
const onPick = (name: string) => {
    const tile = SPECIMENS.find((i) => i.name === name);
    if (tile) demo.selectEasing(tile.name);
};

// ── The header literal — COMPLETE and re-parseable, never truncated ──
const literal = computed<string>(() => {
    const name = demo.currentEasingName.value;
    if (name === "steps") {
        return `steps(${demo.stepOptions.value.steps}, ${demo.stepOptions.value.jumpTerm})`;
    }
    if (demo.isBezierEditable.value) {
        return cubicBezierToString(...demo.bezierControlPoints.value);
    }
    // An engine-named curve (ease-in-out-sine, ease-in-bounce, step-start …):
    // the name IS the literal — value.js round-trips it by registry lookup.
    return name;
});
</script>

<style scoped src="./EasingTarget.css"></style>
