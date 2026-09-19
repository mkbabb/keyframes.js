<template>
    <div class="contents">
        <!-- The per-stop card list. When `framed` (the default, standalone
             authoring surface) it carries its OWN cartoon `Card`. When
             the editor is mounted INSIDE another Card (e.g. SpringSidebar's quiet
             parent Card — K.W1′), `:framed="false"` DROPS the inner Card so the
             list flows into the parent surface directly (no card-in-card; the
             glass-ui 4.0.0 single-surface contract). The CardContent's padding +
             grid are preserved on the bare wrapper so the layout is identical. -->
        <Card v-if="framed" cartoon tier="quiet" class="p-0 m-0">
            <CardContent class="p-2 m-0 grid gap-4 relative">
                <KeyframeCardList
                    ref="cardList"
                    :frame-strings="templateFrameStrings"
                    :frames="animation.templateFrames"
                    @update-start="onUpdateStart"
                    @update-c-s-s="onUpdateCSS"
                    @remove="({ event, index }) => removeKeyframe(event, index)"
                    @keydown="onKeyDown"
                />
            </CardContent>
        </Card>
        <div v-else class="p-2 m-0 grid gap-4 relative">
            <KeyframeCardList
                ref="cardList"
                :frame-strings="templateFrameStrings"
                :frames="animation.templateFrames"
                @update-start="onUpdateStart"
                @update-c-s-s="onUpdateCSS"
                @remove="({ event, index }) => removeKeyframe(event, index)"
                @keydown="onKeyDown"
            />
        </div>

        <!-- KF-KE-32 — THE TOKEN DECISION (this wave's rider on the
             KAD-18 / KF-KE-24 / KF-KE-32 family). `bg-background` is the PAGE
             ground, and both this sticky footer and the toolbar below paint it
             INSIDE the `--card` surface the component just dropped a Card to
             honour — a near-black rectangle on warm brown in the dark arm, at a
             tonal step small enough to read as a rendering fault rather than a
             layer. The decision: a plate reads the surface it is ON, so these
             two read `--card`. The family's THIRD site is the runtime-injected
             hljs theme, whose hard `#ffffff`/`#0d1117` plate WAS unlayered and
             therefore outranked every demo surface utility on the highlighted
             well; that site's MECHANISM is landed at the pipeline (KF-KE-24,
             X.KF.W12.c — `useHighlightCSS` injects the theme inside
             `@layer components`, so the host's utilities outrank the plate by
             cascade order). Re-tokenising the theme onto the demo's scale is
             the TOKEN decision, KF.W6's rider, and is not pre-empted.

             KF-KE-40 — THE SPACING PASS, three findings, three dispositions:
             · the no-ops are GONE — `mt-0` after `m-0` (twice, on the card-list
               wrappers) and `pt-4` after `p-4` (here). Each was harmless on its
               own; together they meant a reader could not tell which spacing
               values were load-bearing.
             · the vertical rhythm is now ONE authority. This footer is a
               `grid gap-4`, so its children already sit 16px apart; the toolbar
               then stacked `mt-4` on top of that gap (32px above it) and the
               progress bar stacked `mt-2` (24px below it), an inequality that
               was an artefact of stacking margins on a gap in two sizes, not a
               stated proportion. Both margins are dropped: the grid's own gap
               is the interval, and changing the rhythm now means changing one
               number.
             · the 16px float above the scrollport floor is KEPT and stated:
               `sticky bottom-0` resolves against the MARGIN box, so `m-4` lifts
               the border box off the floor — and that is what this plate is.
               It carries `rounded-panel` and `bg-card`: a rounded, inset,
               opaque shelf floating over the scrolling list, not a flush bar
               welded to the container edge (a flush bar would want neither the
               radius nor the margin). Whether the band of list content visible
               beneath the shelf reads as depth or as leakage is a rendered
               judgement, and it belongs to the visual audit, not to a seat
               editing markup blind. -->
        <div class="grid gap-4 sticky bottom-0 bg-card rounded-panel p-4 m-4">
            <!-- KC-2 ≡ KF-KE-2 (+ KF-KC-19, + KF-KE-34's naming half) — THE
                 RETIMING CONTROL, three independent kills cured in ONE motion
                 because curing fewer is worse than curing none.
                 · THE FREEZE. The handler assigned the drag's raw number to the
                   `value` PROPERTY OF `frame.start` — in place, inside a
                   value.js parse result, and every parse result is deep-frozen:
                   the assignment threw `TypeError` at i=0 under the SFC's strict
                   mode, aborted the loop, and never reached the reprojection —
                   while Vue's `callWithAsyncErrorHandling` turned the throw into
                   a console line, so the primary timing control was inert and
                   silent. A selector is replaced whole now, exactly as the start
                   field's own commit path replaces it.
                 · THE UNIT — and it is fixed in the SAME commit as the freeze,
                   which is the load-bearing order: the model carries `0..1`
                   fractions, the rail declared `-10..110`, so unfreezing alone
                   would have written a drag's raw `50` into a field holding
                   `0.5` — a silent 100× retime, worse than the dead control it
                   replaced. `selectorPercent`/`percentSelector` are the total
                   pair (named stops included) the demo already ships and both
                   seams bypassed.
                 · THE DOMAIN. `-10..110` offered 20 points value.js rejects at
                   parse, and `:step="1"` could express no stop between two
                   percents. The rail is now the grammar's own `0..100` with a
                   fractional step and decorative marks at the quarters.
                 · THE NAME (KF-KE-34). The control had none. `LabeledField` is
                   the producer's own shape for a composite whose root is not a
                   labelable element — it names the GROUP and hands the slider
                   `aria-labelledby`/`aria-describedby`. Per-THUMB identity is
                   not expressible here: the installed producer forwards ONE
                   `aria-label`/`aria-labelledby` to every thumb it renders and
                   exposes no thumb slot (measured at
                   `dist/slider-DzqeQmMu.js`), so `aria-valuetext` per thumb is a
                   PRODUCER ask and rides the SS-6 relay — never a demo-side
                   reach into the producer's rendered thumbs. Each stop's own
                   named control is its card's `Offset` field. -->
            <LabeledField
                label="Keyframe offsets"
                description="Each thumb retimes one stop between 0% and 100%."
                :control-labelable="false"
                v-slot="{ labelledBy, describedBy }"
            >
                <Slider
                    :model-value="
                        animation.templateFrames.map((frame) =>
                            selectorPercent(frame.start),
                        )
                    "
                    @update:model-value="retimeFrames"
                    :min="0"
                    :max="100"
                    :step="0.1"
                    :marks="OFFSET_MARKS"
                    :aria-labelledby="labelledBy"
                    :aria-describedby="describedBy"
                >
                </Slider>
            </LabeledField>

            <!-- The keyframe-action toolbar (S.C3b · C-19). This was a shadcn reka
                 `Menubar`, but it never held a single `MenubarContent` — it is a
                 4-affordance authoring TOOLBAR (add · copy · apply, plus a
                 decorative wand), not a set of menus. The a24-F6 relocate-in-place
                 migration keeps every action visible and working (a `dropdown-menu`
                 remap would bury them behind a trigger and unmount the persistent
                 brush ref in a portal) while shedding the last shadcn island;
                 `useToolbarKeyboard` restores the roving-tabindex keyboard reka
                 gave it (Arrow/Home/End over the real button descendants). -->
            <!-- KF-KE-31 (W6-I, S-7 pattern): the toolbar's two bespoke
                 `<button>`s are the producer's `Button` (`size="sm"
                 emphasis="quiet" icon-only` — the exemplar register), each
                 under a `Tooltip` so an icon-only toolbar finally names its
                 actions for pointer users (`title=`/`Tooltip` grep was 0), and
                 the `justify-evenly w-full` anti-cluster gives way to a left
                 cluster with one gap. The wand keeps its decorative role but
                 takes an INK rung (`text-muted-foreground`) instead of the
                 alpha (`opacity-70`) that read as a disabled control (the
                 demo's own KC-12 law: a register, never an alpha).
                 `useToolbarKeyboard` still roves over the real `<button>`
                 descendants — every glass Button renders one.
                 KF-KE-36 (EVALUATED, the param type read): glass's
                 `useTabRovingFocus` takes `stripOptions` + `stripValue` +
                 `select` — a SELECTION machine for a tablist/segmented strip,
                 tab-coupled by its contract (`UseTabRovingFocusParams`), and
                 `useSelectionGroup` composes it over a selected value. This
                 bar has no selection: three heterogeneous actions and no
                 value to anchor the tabstop on. Per the bank's own clause the
                 row drops to INFO; the local composable stays, the decline is
                 written here.

                 KF-KE-39 — the bar scrolls on DEMAND now. `overflow-x-scroll`
                 reserves the scrollbar gutter unconditionally, so on every
                 platform that paints a classic bar (Windows, Linux, macOS with
                 "Show scroll bars: Always") a 40px strip holding 24px glyphs
                 paid a permanent chrome tax for content that rarely overflows.
                 `overflow-x-auto` reserves nothing until it must, and when it
                 must the bar is the producer's own `scrollbar-thin` (a real
                 shipped utility, measured — `scrollbar-width: thin` with a
                 webkit fallback on the glass scrollbar tokens) rather than the
                 platform default. The gutter's painted appearance is
                 OS-preference-dependent and stays a rendered question.

                 KF-KE-59 — ONE RADIUS VOCABULARY on this surface: the bar wore
                 `rounded-xl` while the footer plate one block up wears
                 `rounded-panel`. They resolve identically today for a reason
                 that is itself the argument — `--radius-panel: var(--radius-xl)`
                 at the installed dist, i.e. the panel token IS the alias — so
                 the two spellings were one rung under two names that would
                 desynchronise the moment the panel rung is retuned. Both
                 surfaces are panels; both name the panel.

                 KF-KE-42 — the RTL posture, recorded as the repo-level row it
                 is: the physical-offset site the bank names (`top-2 right-4` on
                 the card's action cluster) lives in `KeyframeCard.vue`, which
                 this seat does not hold — DECLARED, not silently skipped.
                 Measured demo-wide at these bytes: ZERO `ms-/me-/ps-/pe-`
                 logical-property utilities and exactly two `rtl:` variants
                 (both `rtl:origin-right`, on the two progress sweeps), so the
                 posture is physical-by-default with directional exceptions
                 authored exactly where a mirrored box would animate from the
                 wrong edge. That is a repo decision to take once, not a lapse
                 to patch per component. -->
            <div
                ref="toolbarEl"
                role="toolbar"
                aria-label="Keyframe actions"
                aria-orientation="horizontal"
                class="flex h-10 w-full items-center gap-2 overflow-x-auto scrollbar-thin rounded-panel border bg-card p-1"
                @keydown="onToolbarKeydown"
            >
                <!-- Decorative lead flourish — was a focusable no-op trigger; now
                     a pure indicator (aria-hidden), excluded from the roving set. -->
                <WandSparkles aria-hidden="true" class="shrink-0 text-muted-foreground" />

                <KeyframesAddDialog
                    v-model:open="kfControls.dialogOpen"
                    v-model:text="addKeyframesString"
                    :format="updateAddKeyframesString"
                    @submit="addKeyframesStringToAnimation"
                />

                <!-- S-7 (W6-I): the copy control sizes ITSELF now (a glass
                     Button, `size="sm" icon-only`); the caller-imposed
                     `w-6 h-6` box and the second `scale-on-hover` (the
                     primitive owns its hover/press motion) are gone. -->
                <CopyButton :text="cssKeyframesString" />

                <Tooltip>
                    <TooltipTrigger as-child>
                        <Button
                            size="sm"
                            emphasis="quiet"
                            icon-only
                            aria-label="Apply CSS keyframes to the target"
                            :aria-pressed="cssApplied"
                            @click="applyCSSStyles"
                        >
                            <Paintbrush ref="brush" class="icon-md pointer-events-none" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{{
                        cssApplied ? "Applied to the target" : "Apply to the target"
                    }}</TooltipContent>
                </Tooltip>
            </div>

            <!-- KF-KE-21 (S-10, EVALUATED — glass `Progress` DECLINED in
                 writing; the twin at KeyframesAddDialog carries the full
                 reasoning): the bar measures nothing, so its progress
                 semantics are deleted (`aria-hidden` decorative chrome) and
                 the brush-sweep animation is kept. KAD-15's form at this twin
                 too: rest at zero, `scaleX()` from the inline start. -->
            <div
                ref="progressBarKeyframesEl"
                class="progress-bar sticky bottom origin-left rtl:origin-right scale-x-0"
                aria-hidden="true"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { KeyframesAnimation } from "@mkbabb/keyframes.js";
import { kfEngine } from "@kf-engine";

// KF-KE-53 (W6-I, the import-granularity sweep): every glass symbol on its
// own subpath — no root-barrel + subpath mix in one closure.
import { Button } from "@mkbabb/glass-ui/button";
import { Card, CardContent } from "@mkbabb/glass-ui/card";
import { LabeledField } from "@mkbabb/glass-ui/labeled-field";
import { Slider } from "@mkbabb/glass-ui/slider";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@mkbabb/glass-ui/tooltip";

import { onMounted, useTemplateRef, watch } from "vue";
import { promiseTimeout } from "@vueuse/core";
import { useKeyframeBrushApply } from "./composables/useKeyframeBrushApply";
import { useCodeHighlight } from "./composables/useHighlightCSS";
import { useKeyframesEditor } from "./composables/useKeyframesEditor";

import CopyButton from "@components/CopyButton/CopyButton.vue";
import KeyframeCardList from "./components/KeyframeCardList.vue";
import KeyframesAddDialog from "./components/KeyframesAddDialog.vue";

import { Paintbrush, WandSparkles } from "@lucide/vue";
import { useToolbarKeyboard } from "./composables/useToolbarKeyboard";

import type { KeyframeSelector } from "@mkbabb/value.js/css";
import {
    percentSelector,
    requireKeyframeSelector,
    selectorPercent,
} from "@utils/keyframeSelector";
import { toast } from "vue-sonner";
import { insertTabAtCursor } from "./utils/contenteditable";

// HEAVY surface from the warmed engine (kfEngine(), L.W8 S1 dogfood inversion) —
// synchronous, since the warm resolves before the app mounts. `presets` is the
// barrel's preset namespace (the old `* as animations` deep import).
const { CSSKeyframesAnimation, AnimationGroup, presets } = kfEngine();

const { animation, framed = true } = defineProps<{
    animation: KeyframesAnimation<any>;
    /** Whether the per-stop card list carries its OWN framing `Card`. Default
     *  `true` (the standalone authoring surface). Pass `false` when the editor is
     *  mounted inside another Card (e.g. SpringSidebar's parent Card) so the inner
     *  Card is DROPPED — no card-in-card (glass-ui 4.0.0 single-surface). */
    framed?: boolean;
}>();

const emit = defineEmits<{
    (
        e: "sliderUpdate",
        val: { t: number; animationId: number },
    ): void;
    (
        e: "keyframesUpdate",
        val: { animation: KeyframesAnimation<any> },
    ): void;
}>();

const {
    cssKeyframesString,
    addKeyframesString,
    templateFrameStrings,
    keyframesStyleId,
    kfControls,
    updateAllStrings,
    updateAllStringsAndAnimation,
    updateAnimationFromKeyframeString,
    updateAddKeyframesString,
    addKeyframesStringToAnimation,
    removeKeyframeData,
} = useKeyframesEditor(() => animation, emit);

// Mirror the live add-keyframes draft into stored controls so an un-submitted
// draft persists (the original inline input handler set both).
watch(addKeyframesString, (v) => {
    kfControls.addKeyframes = v;
});

const cardList = useTemplateRef<InstanceType<typeof KeyframeCardList>>("cardList");

// Scoped highlight driver — owns the editor's OWN <pre> code blocks (the card
// list's), never the whole document (D.W3.S1).
const { highlightAll } = useCodeHighlight(
    () => cardList.value?.getPreElements() ?? [],
);

/**
 * KC-2 — the retiming rail's decorative checkpoints. `marks` is the producer's
 * own prop for this (`SliderProps.marks?: readonly number[]`, quoted from the
 * installed `dist/components/slider/types.d.ts`: *"Decorative checkpoints in the
 * numeric domain; they never snap the value"*), so the quarters read as ticks
 * without quantising a fractional step back to 25%.
 */
const OFFSET_MARKS = [0, 25, 50, 75, 100] as const;

/**
 * KC-2 — retime the stops from the rail's percent domain.
 *
 * A selector is REPLACED, never written into: value.js deep-freezes every parse
 * result, so the previous in-place assignment to the selector's own `value`
 * property threw before it could do anything. Only the stops whose percent
 * actually moved are replaced, which
 * is what keeps a NAMED selector (`entry 50%`) named while its neighbour is
 * dragged; a named stop the user drags themselves becomes the percent they
 * dragged it to, because the rail is a percent rail and no total inverse into a
 * phase exists.
 *
 * The reprojection per emit is the handler's own pre-existing intent — it never
 * ran before only because the line above it threw. The heavy half of it
 * (`updateAnimationFromKeyframesString`) is already debounced at 1000 ms; a
 * commit gate for the light half is KF-KE-26, `.c`'s row, and is not pre-empted
 * here.
 */
const retimeFrames = (percents: number[] | undefined) => {
    if (percents === undefined) return;

    animation.templateFrames.forEach((frame, i) => {
        const percent = percents[i];
        if (percent === undefined || percent === selectorPercent(frame.start)) {
            return;
        }
        frame.start = percentSelector(percent);
    });

    updateAllStringsAndAnimation();
};

const startDiagnosticId = (index: number) => `keyframe-start-${index}`;

/**
 * KF-KE-3 (+ KF-KE-46) — the start field's model seam asks the KEYFRAME grammar.
 *
 * The generic CSS-scalar parser this seam used to call accepted any scalar:
 * `500%` and `-20%` were admitted, rendered, and failed ~1 s later out of a
 * different op that named neither the field nor the stop, while `from`/`to` —
 * which the add path accepts through `requireKeyframeSelector` — were refused.
 * One component, two grammars. The
 * one door the add path uses is the door here: the selector the grammar
 * returns REPLACES the frozen one whole (the same whole-selector write the
 * retiming rail makes), so the hand-rolled `{ kind: "percent", value / 100 }`
 * beside the exported `percentSelector` is gone with it (KF-KE-46).
 *
 * The S-5/C-S5 posture stays at this seam — the typed issue surfaced
 * verbatim, a stable per-index toast id, an explicit dismiss on success — even
 * though the card now refuses a bad draft AT THE FIELD (KF-KE-37) and never
 * emits it: this handler is the model's boundary and the list relays strings.
 */
const onUpdateStart = ({ val, index }: { val: string; index: number }) => {
    const frame = animation.templateFrames[index];
    if (frame === undefined) return;

    let selector: KeyframeSelector;
    try {
        selector = requireKeyframeSelector(val);
    } catch (e) {
        toast.error("Invalid keyframe offset", {
            id: startDiagnosticId(index),
            description: e instanceof Error ? e.message : String(e),
        });
        return;
    }

    toast.dismiss(startDiagnosticId(index));
    frame.start = selector;
    void updateAllStringsAndAnimation();
};

const onUpdateCSS = ({ value, index }: { value: string; index: number }) => {
    updateAnimationFromKeyframeString(value, index);
    animateProgressBar(progressBarKeyframesEl.value!);
};

function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Ï") {
        e.preventDefault();
        return;
    }

    if (e.key === "Tab") {
        e.preventDefault();
        insertTabAtCursor(e.target as HTMLElement);
    }

    highlightAll();
}

/**
 * KF-KE-7 (+ KF-KE-61, KF-KE-47's second-delete question) — THE REMOVAL IS THE
 * COMMAND; THE EXIT MOTION IS DECORATION.
 *
 * The removal used to be gated on the choreography's promise: a 700 ms wait
 * (both presets are `duration: 700`) that nothing could skip, during which a
 * second click landed on indices about to shift, and whose rejection — which
 * headless realms produce every time, because the engine cannot resolve the
 * transform `warpLeft` animates from — dropped the delete on the floor with no
 * signal (KF-KC-27's third aggravation, measured by `.a`). Four things change:
 *   · the command commits WHETHER OR NOT the motion settles — the motion runs
 *     first so a real browser still sees the card leave, but it may hold the
 *     command for at most its OWN declared length (read from the motions'
 *     options, plus one frame for the loop's completion tick). Measured at the
 *     engine (`group/lifecycle.ts:92-95`): `play()` resolves only from the
 *     draw loop's completion, so a throw inside the loop — headless, every
 *     time — leaves the promise PENDING forever, never rejected; a command
 *     awaiting it open-endedly is a hostage in browsers too. A rejection is
 *     REPORTED through the house non-toast boundary (this demo's toast surface
 *     is structurally unreachable; the in-tree idiom is `useHighlightCSS`'s and
 *     `KeyframesAddDialog`'s), an unsettled motion is reported as such, and
 *     the removal lands either way. The engine's contract gap (a draw-loop
 *     throw must settle `play()`/`finished`) is KF.W5's, escalated by name;
 *     the idiomatic Vue home for animate-then-commit — a `<TransitionGroup>`
 *     leave hook at the list, where Vue keeps the leaving row mounted until
 *     `done()` — is the list's file and is named for its owner, not reached
 *     across for;
 *   · a stop that is already leaving is a no-op for a second activation
 *     (`departing`, keyed by the frame's own id, never by an index that shifts
 *     under the motion) — the busy window is real but a press inside it cannot
 *     double-delete or delete a neighbour;
 *   · the motion targets only elements that EXIST: the leaving card's root, and
 *     the neighbour's when there is one (a stale or absent slot no longer
 *     hands `setTargets` nothing — the guard is what makes `.a`'s typed ref
 *     store checkable here, and the two TS2345 shadows fall with it);
 *   · reduced motion is honoured by the group itself — `AnimationGroup`
 *     defaults `respectReducedMotion` to `true` (KF.W5; `group/group.ts`), so
 *     under the preference the motion snaps and the gate is ~0 ms. Nothing is
 *     re-set here; the default is the cure.
 * The duplicate "last keyframe" guard this handler carried is gone (KF-KE-61):
 * `removeKeyframeData` owns that floor and its toast, and the card's own
 * `canRemove` (`.a`'s KC-7) keeps the control disabled there.
 */
const departing = new Set<unknown>();

const exitMotion = async (frameIx: number) => {
    const cards = cardList.value?.cardRefs ?? [];
    const leaving = cards[frameIx];
    if (leaving == null) return;
    const neighbour =
        frameIx < cards.length - 1 ? cards[frameIx + 1] : cards[frameIx - 1];

    // S.B4 — `AnimationGroup.of(...)` replaces the excised
    // `KeyframesAnimation.group(...)` convenience (genuine ownership; a06 F1/F2).
    const leave = presets.warpLeft().setTargets(leaving);
    const group =
        neighbour == null
            ? AnimationGroup.of(leave)
            : AnimationGroup.of(leave, presets.jumpUp().setTargets(neighbour));
    const budgetMs = leave.options.duration + FRAME_MS;

    let settled = false;
    const motion = group.play().then(
        () => {
            settled = true;
        },
        (e: unknown) => {
            settled = true;
            console.error(
                "The keyframe's exit motion could not run; the removal lands regardless:",
                e,
            );
        },
    );
    await Promise.race([motion, promiseTimeout(budgetMs)]);
    if (!settled) {
        console.warn(
            `The keyframe's exit motion did not settle within its declared ${budgetMs} ms; the removal lands regardless.`,
        );
    }
};

/** One frame at 60 Hz — the slack the draw loop's completion tick needs past
 *  a motion's declared duration. */
const FRAME_MS = 1000 / 60;

const removeKeyframe = async (_e: Event, frameIx: number) => {
    const frame = animation.templateFrames[frameIx];
    if (frame === undefined || departing.has(frame.id)) return;

    departing.add(frame.id);
    try {
        await exitMotion(frameIx);
    } finally {
        departing.delete(frame.id);
    }

    // Resolve the stop by identity: another removal may have shifted the
    // indices while this motion ran.
    const ix = animation.templateFrames.indexOf(frame);
    if (ix !== -1) removeKeyframeData(ix);
};

const progressBarKeyframesEl = useTemplateRef<HTMLElement>("progressBarKeyframesEl");

// KAD-15 at this twin: `scaleX()` from rest (0) to full, `fillMode: "none"` so
// the bar returns to its rest class when the sweep ends (D-20), and the PRM
// flag lands with the rest state (KF-KE-8's sequencing nuance).
//
// KAD-11 — THE PRM PAIR, TOKENIZATION HALF (the twin is
// `KeyframesAddDialog.vue`'s `animateProgressBar`; both carry the same two
// decisions and they were decided ONCE, here and there in one motion):
//   · THE REGISTER — reduced motion is honoured through the engine's own
//     `respectReducedMotion` options bag, which routes to the shared
//     `withReducedMotion` authority. NEVER a bespoke per-site `@media
//     (prefers-reduced-motion: reduce)` block: a WAAPI sweep is not delegable
//     to CSS, and a per-site query is the hand-mirrored shape this register
//     replaced. A group-driven sweep arms through `g.respectReducedMotion`;
//     these two are standalone and arm through their own bags.
//   · THE CLOCK — `duration: 1000` is the millisecond mirror of glass-ui's
//     `--duration-xl: 1s` (measured at the installed dist's token set, which
//     rungs 0.1 / 0.12 / 0.2 / 0.3 / 0.45 / 0.55 / 1 / 1.5 s). The engine takes
//     milliseconds, and reading the custom property here would trade a
//     documented constant for a layout read — so the mirror is
//     RETAINED-BY-POLICY with its rung named, the same disposition the
//     CopyButton pulse carries.
// The row is one half of a split: the PRM MECHANISM unification is KF.W9's
// (`G-KFW9-6`), and its constraint rides verbatim — no unification lands that
// snaps a progress animation to a rest state its own banked defect makes
// idle-indistinguishable. Neither end records `KAD-11` or `G-KFW9-6` closed on
// its own.
const animateProgressBar = (el: HTMLElement) => {
    new CSSKeyframesAnimation(
        { duration: 1000, fillMode: "none", respectReducedMotion: true },
        el,
    )
        .fromVars([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }])
        .play();
};

const { applyCSSStyles, cssApplied } = useKeyframeBrushApply({
    animation,
    styleId: keyframesStyleId,
    getCSSString: () => cssKeyframesString.value,
    templateRef: "brush",
});

// The action toolbar's roving-tabindex keyboard (S.C3b · C-19 — the reka Menubar
// replacement). `refresh` re-seats the single tab stop once the item buttons
// (dialog trigger, copy, apply) have mounted.
const toolbarEl = useTemplateRef<HTMLElement>("toolbarEl");
const { onKeydown: onToolbarKeydown, refresh: refreshToolbar } =
    useToolbarKeyboard(() => toolbarEl.value);

// Re-highlight the card list whenever the serialized keyframes change.
watch(cssKeyframesString, () => {
    highlightAll();
});

onMounted(() => {
    updateAllStrings();
    // Seat the toolbar's single tab stop now that the item buttons have mounted.
    refreshToolbar();
});
</script>
