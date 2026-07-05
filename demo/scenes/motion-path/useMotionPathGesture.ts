import { onMounted, ref, watch, type Ref } from "vue";
import { useResizeObserver } from "@vueuse/core";

import { kfEngine } from "@utils/kfEngine";
import { ManualTimeline } from "@mkbabb/keyframes.js";
import type { CSSKeyframesAnimation } from "@mkbabb/keyframes.js";

import { useDragScrub } from "@composables/useDragScrub";
import { clientToUserUnits, scalePathD, VIEW } from "./motionPathGeometry";
import type { MotionPathDemo } from "./useMotionPathDemo";

/**
 * useMotionPathGesture — the MotionPath scene's GESTURE ENGINE, lifted out of
 * the Target (H.W12.S2 / I9; the W-MP-5 anomaly: the projection + scrub-seam +
 * ManualTimeline logic lived in `MotionPathTarget.vue:79-220`, unlike
 * sequence/spring whose composables own their engine). The Target now holds ONLY
 * refs + markup; THIS composable owns:
 *   • building the `fromMotionPath` animation on mount (the engine sets the
 *     author `offset-path` + `offset-rotate: auto` on the live traveller),
 *   • projecting a pointer onto the SVG `<path>` (nearest-point-on-length),
 *   • the `ManualTimeline` re-seat of the engine playhead through the group
 *     scrub seam (`setChildTime → render`) — the SAME pipeline the bottom bar
 *     rides, so the drag owns NO bespoke clamp math (inv ζ),
 *   • the TRAVELLER drag — the shared `useDragScrub` seam (H.W12.S1) with a path
 *     `project` + the pause-for-gesture / resume-on-release hooks,
 *   • the CONTROL-POINT drags (H.W12.S6 / I3 — the editable path): one
 *     `useDragScrub` consumer per handle with an `{x,y}` projection that mutates
 *     the single-source control net (`demo.movePoint`), re-emitting `pathD`,
 *   • the live offset-path re-write — a `watch(pathD)` rewrites the traveller's
 *     `offset-path` so the guide `<path>` d AND the traversal re-read the SAME
 *     `d` in lockstep (the single-source invariant — proof:motion-path-editable),
 *   • the tangent-angle readout (`offset-rotate: auto`'s value, made legible),
 *   • the EE-MP-2 "the emoji winks" easter egg (a full-lap traveller drag).
 *
 * The geometry is single-sourced (`motionPathGeometry.ts`): the guide `<path>`
 * the projector measures IS the path the browser positions the traveller along,
 * so the length the projector reads cannot drift from the traversal.
 */
export interface UseMotionPathGestureRefs {
    stageEl: Ref<HTMLElement | null>;
    guidePathEl: Ref<SVGPathElement | null>;
    travellerEl: Ref<HTMLElement | null>;
}

export function useMotionPathGesture(
    demo: MotionPathDemo,
    refs: UseMotionPathGestureRefs,
) {
    const { stageEl, guidePathEl, travellerEl } = refs;

    // The traveller's current offset-distance as a [0,1] ratio. The engine sweeps
    // it during autoplay; the drag writes it directly. The header reads it.
    const distance = ref(0);

    // The live tangent angle (deg) at the traveller's current position — the
    // other half of the offset-path story (`offset-rotate: auto`), made legible
    // (W-MP-7 / R-MP-E). Derived from two nearby path points around `distance`.
    const tangentDeg = ref(0);

    // The path-motion animation built on mount — kept here so the drag can
    // re-seat its playhead through the group scrub seam.
    let anim: CSSKeyframesAnimation<any> | undefined;

    // ManualTimeline is the engine's caller-driven progress primitive — the SAME
    // pipeline class the bottom-bar scrub rides. The drag samples the
    // pointer→length ratio into it (clamp + boundary-snap), then reads back
    // `.progress`, so the drag owns NO bespoke clamp math (inv ζ — dogfood a
    // public primitive, not new gesture code).
    const timeline = new ManualTimeline();

    let wasPlayingBeforeDrag = false;
    let totalLen = 0;

    // Coarse sampling resolution (in SVG path-length units) for the nearest-point
    // search. The figure-loop path is ~1100 units long, so the ~220 samples this
    // step yields read smooth without per-move cost. Named (not a bare literal)
    // per I11 / proof:no-brittle-selector.
    const SAMPLE_STEP = 5;

    // Re-measure the guide path's total length. Called on mount AND whenever the
    // editable path changes (a control-point drag re-shapes the figure, so the
    // nearest-point search must walk the NEW length).
    const remeasure = (): void => {
        const pathEl = guidePathEl.value;
        if (pathEl) totalLen = pathEl.getTotalLength();
    };

    // ── S.G2 S1 — the traveller-scale fix (fold row 68) ──────────────────────
    // The SVG guide auto-scales its `0 0 VIEW VIEW` viewBox to fill the stage; the
    // traveller's CSS `offset-path` resolves in STAGE PIXELS, so an unscaled author
    // `d` (0..VIEW user units) detaches the creature on any stage narrower than
    // VIEW px (~400) — it escapes the plate at the mobile 375px width. The cure:
    // scale ONLY the traveller's live offset-path to the rendered stage (the copy
    // artifact + the guide stay author-unit — the single source is preserved),
    // re-run on a ResizeObserver so it tracks the guide across every resize.
    const stageScale = (): number => {
        const stage = stageEl.value;
        if (!stage) return 1;
        const r = stage.getBoundingClientRect();
        // The stage is square (aspect-ratio:1) — the shorter side / VIEW governs
        // both axes (the same invariant clientToUserUnits rides). Fall back to
        // author units (scale 1) while the stage is un-laid-out.
        const side = Math.min(r.width, r.height);
        return side > 0 ? side / VIEW : 1;
    };
    // The traveller BALL is a marker riding the path, so it must scale WITH the
    // stage (like the auto-scaling SVG guide) — a fixed-px ball spills off a small
    // stage even when the path is scaled, because the figure only insets ~15% from
    // the plate edge and a large ball's radius exceeds that inset on a narrow
    // mobile stage (~112px). BASE_BALL_PX (2.75rem @ 16px root, the design intent)
    // × scale keeps the ball ~11% of the stage span at every size — its rect stays
    // inside the path inset (S.G2 S1 containment). A 14px legibility floor holds it
    // grabbable; the glyph font-size tracks --ball-size in CSS.
    const BASE_BALL_PX = 44;
    const BALL_FLOOR_PX = 14;
    const writeTravellerPath = (): void => {
        const el = travellerEl.value;
        if (!el) return;
        const scale = stageScale();
        el.style.offsetPath = `path('${scalePathD(demo.pathD.value, scale)}')`;
        el.style.setProperty(
            "--ball-size",
            `${Math.max(BALL_FLOOR_PX, BASE_BALL_PX * scale)}px`,
        );
    };

    // Track the stage size so the traveller re-scales on every resize (rotate,
    // sheet open, breakpoint) — on @vueuse's useResizeObserver (the inv-ζ
    // listener discipline: scope-disposed cleanup, no manual disconnect).
    useResizeObserver(stageEl, () => writeTravellerPath());

    // ── The tangent at a [0,1] distance — two nearby getPointAtLength samples ─
    const computeTangent = (ratio: number): number => {
        const pathEl = guidePathEl.value;
        if (!pathEl || totalLen <= 0) return tangentDeg.value;
        const len = ratio * totalLen;
        const eps = Math.min(SAMPLE_STEP, totalLen);
        const a = pathEl.getPointAtLength(Math.max(0, len - eps));
        const b = pathEl.getPointAtLength(Math.min(totalLen, len + eps));
        return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    };

    onMounted(() => {
        const el = travellerEl.value;
        if (!el) return;
        // Construct the path-motion animation on the traveller via the engine's
        // fromMotionPath factory (HEAVY — from the warmed kfEngine(), L.W8 S1
        // dogfood inversion): it sets the author offset-path + offset-rotate
        // (tangent-following) on the element and builds the offset-distance
        // sweep. autoPlay:false — the editor's bottom bar drives it.
        const { fromMotionPath } = kfEngine();
        anim = fromMotionPath(el, {
            path: `path('${demo.pathD.value}')`,
            rotate: "auto",
            duration: 4000,
            autoPlay: false,
        });
        anim.name = "Path traversal";
        demo.registerAnimation(anim);
        // S.G2 S1 — fromMotionPath set the AUTHOR-unit offset-path; override it
        // with the stage-scaled path so the traveller rides the auto-scaled SVG
        // guide (not a 0..VIEW px path that escapes a sub-VIEW stage), then observe
        // the stage so it re-scales on every resize.
        writeTravellerPath();
        remeasure();
        tangentDeg.value = computeTangent(distance.value);

        // ── L.W11 S8 — the guide SELF-BUILDS on mount (DrawSVG dogfood) ───────
        // The page builds itself out of the engine's own primitives: the guide
        // path draws itself in via the library's `fromDrawSVG` (stroke-dashoffset
        // totalLen→0), then hands back to the resting marching-ants. DrawSVG sets
        // an inline `stroke-dasharray: L` (one solid dash) which would clobber the
        // resting `6 7` dash flow — so on `.finished` we clear the inline dash
        // props and let the stylesheet's marching-ants resume. PRM-snapped: under
        // reduced motion we skip the self-draw (the path is already drawn). NO
        // hand-rolled rAF — DrawSVG owns its managed loop (inv ζ).
        runSelfBuild(guidePathEl.value);
    });

    // The self-build flag the Target binds to `.is-self-building` — the egg's NEW
    // instrument-layer marker (guide-draw). True for the ~600ms self-draw run.
    const selfBuilding = ref(false);
    const runSelfBuild = (pathEl: SVGPathElement | null) => {
        if (!pathEl) return;
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return; // snap: the path rests already drawn
        const { fromDrawSVG } = kfEngine();
        selfBuilding.value = true;
        const draw = fromDrawSVG(pathEl, {
            duration: 600,
            from: "0%",
            to: "100%",
            autoPlay: true,
        });
        void draw.finished.finally(() => {
            // Hand back to the resting marching-ants: clear DrawSVG's inline dash
            // props so the stylesheet's `stroke-dasharray: 6 7` flow resumes.
            pathEl.style.removeProperty("stroke-dasharray");
            pathEl.style.removeProperty("stroke-dashoffset");
            selfBuilding.value = false;
        });
    };

    // ── Projection: client point → nearest path-length ratio ─────────────────
    // Walk sampled points along the guide <path>, find the nearest, return its
    // length / total as a [0,1] ratio. The client→user-unit scale is the SINGLE
    // `clientToUserUnits` helper (motionPathGeometry.ts) — the square-viewBox
    // invariant lives THERE, asserted once (I11 / proof:no-brittle-selector), so
    // this projector and the control-handle projector share ONE scale.
    const projectPointer = (e: PointerEvent): number => {
        const pathEl = guidePathEl.value;
        const stage = stageEl.value;
        if (!pathEl || !stage || totalLen <= 0) return distance.value;

        const u = clientToUserUnits(
            stage.getBoundingClientRect(),
            e.clientX,
            e.clientY,
        );
        if (!u) return distance.value;

        let bestLen = 0;
        let bestDist = Infinity;
        for (let len = 0; len <= totalLen; len += SAMPLE_STEP) {
            const p = pathEl.getPointAtLength(len);
            const d = (p.x - u.x) ** 2 + (p.y - u.y) ** 2;
            if (d < bestDist) {
                bestDist = d;
                bestLen = len;
            }
        }
        return bestLen / totalLen;
    };

    // Write a [0,1] distance ratio to the traveller: pass it through the
    // ManualTimeline (clamp + boundary-snap), then re-seat the engine playhead
    // via the group scrub seam so interpFrames repaints offset-distance — ONE
    // progress source for the drag and the bottom-bar scrub.
    const applyDistance = (ratio: number) => {
        timeline.set(ratio);
        // tickDt advances the (smoothing-off) pipeline and returns the clamped,
        // boundary-snapped progress.
        const p = timeline.tickDt(16.667);
        distance.value = p;
        tangentDeg.value = computeTangent(p);
        const group = demo.animationGroup.value;
        // The anim is registered under getAnimationId (its `name`); guard on the
        // resolved key so a not-yet-registered group is a no-op (never throws).
        if (anim?.name && group.animations[anim.name]) {
            group.setChildTime(anim, p * anim.options.duration).render();
        }
    };

    // ── The single-source re-emit (H.W12.S6 / I3 / proof:motion-path-editable) ─
    // When the editable control net changes, the guide `<path>` `d` re-binds
    // reactively (the Target binds `pathD`); HERE we re-write the live
    // traveller's `offset-path` to the SAME `d`, then re-measure + re-paint so
    // the traveller re-resolves its position on the new geometry. BOTH consumers
    // read the ONE source — they cannot drift.
    watch(
        () => demo.pathD.value,
        () => {
            // S.G2 S1 — re-write the traveller's live offset-path (stage-scaled)
            // from the SAME single-source `d` the guide re-reads, so the two stay
            // in lockstep on the rendered stage (never author-unit px).
            writeTravellerPath();
            remeasure();
            // Re-seat the playhead on the new geometry so the traveller snaps to
            // the re-shaped path at the same distance (no jump in offset-distance).
            applyDistance(distance.value);
        },
    );

    // ── EE-MP-2 "the emoji winks" (H.W12.S6 / I3 egg) ────────────────────────
    // The author path is a closed `Z` loop, so 0% == 100% (the geometry is
    // proven closed). Drag the traveller a FULL LAP — accumulate signed distance
    // travelled across a single gesture; once it crosses one whole loop's worth,
    // fire the wink (swap the glyph + a spin). Cheap, ties to the closed-loop
    // geometry; off the normal scrub path (a partial scrub never triggers it).
    const winking = ref(false);
    let lapAccum = 0;
    let lastDragRatio = 0;
    let winkTimer: ReturnType<typeof setTimeout> | undefined;

    const accumulateLap = (ratio: number): void => {
        // Shortest signed step around the [0,1) ring (handle the 0/1 seam).
        let delta = ratio - lastDragRatio;
        if (delta > 0.5) delta -= 1;
        else if (delta < -0.5) delta += 1;
        lapAccum += Math.abs(delta);
        lastDragRatio = ratio;
        if (lapAccum >= 1 && !winking.value) {
            winking.value = true;
            if (winkTimer) clearTimeout(winkTimer);
            // 1.4s — long enough to read the wink glyph + spin, then revert.
            winkTimer = setTimeout(() => (winking.value = false), 1400);
            lapAccum = 0;
        }
    };

    // ── The shared drag-scrub seam (H.W12.S1) — the TRAVELLER ─────────────────
    // The capture element is the traveller; `project` is the nearest-point-on-
    // path; `onStart`/`onEnd` mirror the bottom bar's onScrubStart/onScrubEnd
    // (pause the group sweep for the gesture, resume from the re-seated playhead
    // on release).
    const { dragging, onPointerDown } = useDragScrub({
        el: travellerEl,
        project: projectPointer,
        onScrub: (ratio) => {
            applyDistance(ratio);
            accumulateLap(distance.value);
        },
        onStart: () => {
            remeasure();
            lapAccum = 0;
            lastDragRatio = distance.value;
            // S5c — pause-for-gesture routes through the MACHINE (the single
            // playback authority), not a direct `group.pause()` + shadow write.
            // Read the live engine state for the was-playing latch, then dispatch.
            wasPlayingBeforeDrag = demo.animationGroup.value.playing();
            if (wasPlayingBeforeDrag) demo.pause();
        },
        onEnd: () => {
            // Release → resume autoplay from the re-seated playhead (setChildTime
            // updated pausedTime, so the resume is continuous, not a jump). The
            // machine's PLAY → group-adapter resume restarts the engine group.
            if (wasPlayingBeforeDrag) demo.play();
            wasPlayingBeforeDrag = false;
        },
    });

    // Keyboard scrub (slider posture parity with Spring/Sequence).
    const onKeydown = (e: KeyboardEvent) => {
        let next: number | null = null;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") next = distance.value + 0.05;
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = distance.value - 0.05;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 1;
        if (next === null) return;
        e.preventDefault();
        // S5c — a keyboard scrub pauses the sweep through the machine (not a
        // direct group.pause() + shadow write).
        if (demo.animationGroup.value.playing()) demo.pause();
        applyDistance(next);
    };

    // ── The control-point drag (H.W12.S6 / I3 — the editable path) ────────────
    // ONE `useDragScrub` consumer drives ALL handles (the seam's single-home
    // philosophy — not N copies). The pressed handle's id is latched in
    // `activeHandle`; the `{x,y}` projection (the seam's generic `T`) maps client
    // px → SVG user units via the SAME `clientToUserUnits` scale the traveller
    // projector uses; `onScrub` mutates the single-source control net
    // (`demo.movePoint`), which re-emits `pathD` → the guide + the traveller
    // re-read it (the watch above). The drag pauses the group sweep so the
    // re-shaped path doesn't fight the playing traveller, resuming on release.
    const activeHandle = ref<string | null>(null);
    let handleWasPlaying = false;

    const handleScrub = useDragScrub<{ x: number; y: number }>({
        el: stageEl, // capture on the stage; the gesture starts from the handle
        project: (e) => {
            const stage = stageEl.value;
            const fallback = { x: 0, y: 0 };
            if (!stage) return fallback;
            return (
                clientToUserUnits(
                    stage.getBoundingClientRect(),
                    e.clientX,
                    e.clientY,
                ) ?? fallback
            );
        },
        onScrub: (u) => {
            if (activeHandle.value) demo.movePoint(activeHandle.value, u.x, u.y);
        },
        onStart: () => {
            // S5c — the control-handle drag pauses the sweep through the machine
            // (so the re-shaped path doesn't fight the playing traveller).
            handleWasPlaying = demo.animationGroup.value.playing();
            if (handleWasPlaying) demo.pause();
        },
        onEnd: () => {
            activeHandle.value = null;
            if (handleWasPlaying) demo.play();
            handleWasPlaying = false;
        },
    });

    /** Bind to each handle's `@pointerdown` — latch the id, then start the drag. */
    const onHandlePointerDown = (id: string, e: PointerEvent): void => {
        activeHandle.value = id;
        handleScrub.onPointerDown(e);
    };

    return {
        distance,
        tangentDeg,
        dragging,
        activeHandle,
        winking,
        // L.W11 S8 — the guide self-build (DrawSVG) state for `.is-self-building`.
        selfBuilding,
        onPointerDown,
        onKeydown,
        onHandlePointerDown,
    };
}
