<template>
    <div class="square-stage flex h-full w-full items-center justify-center select-none">
        <div
            ref="box"
            class="demo-box font-mono"
            :class="{ 'demo-box--dragging': dragging }"
            role="slider"
            aria-label="Drag the box — two springs chase per axis"
            :aria-valuetext="`x ${springReadout.x}, y ${springReadout.y}`"
            tabindex="0"
            @pointerdown="onPointerDown"
            @keydown="onKeydown"
        >
            drag me
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, markRaw, onBeforeUnmount, onMounted, reactive, ref, useTemplateRef } from "vue";
import { useEventListener } from "@vueuse/core";
import { AnimationGroup } from "@src/animation/group";
import { useSquareAnimations } from "../../square/useSquareAnimations";

const superKey = "Square";

const box = useTemplateRef<HTMLElement>("box");
const { anim, springX, springY, reseat, travel, paintRest, dispose } =
    useSquareAnimations(box);
anim.name = "Transform";
anim.superKey = superKey;

const animationGroup = markRaw(new AnimationGroup(anim as any));
// Force per-animation transform path — the grouped path passes flat ValueUnit
// values which don't match the nested object structure our transform expects.
animationGroup.singleTarget = false;

// A live spring read-out for the slider's aria-valuetext (no per-frame Vue work
// on the hot path — read on demand from the markRaw springs).
const springReadout = reactive({ x: "0.00", y: "0.00" });

onMounted(() => {
    anim.setTargets(box.value!);
    // Paint the rest pose so the box sits home before any drag (the spring loop
    // is idle at rest; the drag arms it).
    paintRest();
});

onBeforeUnmount(() => {
    animationGroup.stop();
    dispose();
});

// ── Drag the box → re-seat the per-axis spring targets (S5) ─────────────
// The pointer offset (px) from the box's home center, divided by the spring's
// px travel, becomes each axis target ∈ [-1, 1] (clamped in reseat) — so the box
// follows the pointer ~1:1 up to the clamp; the spring chases (the live re-seat
// idiom Spring ships). The transformFunc reads the live spring values.

const dragging = ref(false);
let homeX = 0;
let homeY = 0;

// Capture the box's home center once per gesture so the offset is stable across
// the drag (re-grabbing mid-flight subtracts the live deflection to recover it).
const captureFrame = () => {
    const el = box.value;
    if (!el) return;
    const br = el.getBoundingClientRect();
    // The box's CURRENT center minus the live spring deflection = its home
    // center (so re-grabbing mid-flight doesn't snap the home point).
    homeX = br.left + br.width / 2 - springX.value * travel;
    homeY = br.top + br.height / 2 - springY.value * travel;
};

const reseatFromEvent = (e: PointerEvent) => {
    const nx = (e.clientX - homeX) / travel;
    const ny = (e.clientY - homeY) / travel;
    reseat(nx, ny);
    springReadout.x = springX.target.toFixed(2);
    springReadout.y = springY.target.toFixed(2);
};

const onPointerDown = (e: PointerEvent) => {
    dragging.value = true;
    captureFrame();
    try {
        box.value?.setPointerCapture(e.pointerId);
    } catch { /* iOS / synthetic pointers may throw — drag still works */ }
    reseatFromEvent(e);
};

useEventListener(window, "pointermove", (e: PointerEvent) => {
    if (!dragging.value) return;
    reseatFromEvent(e);
});

useEventListener(window, "pointerup", () => {
    if (!dragging.value) return;
    dragging.value = false;
    // Release → let the springs settle back toward home (the "re-seat to rest"
    // gesture; the spring chases 0 from wherever it is).
    reseat(0, 0);
    springReadout.x = "0.00";
    springReadout.y = "0.00";
});

// Keyboard nudge (slider posture parity with Spring/MotionPath).
const onKeydown = (e: KeyboardEvent) => {
    const step = 0.25;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowRight") dx = step;
    else if (e.key === "ArrowLeft") dx = -step;
    else if (e.key === "ArrowDown") dy = step;
    else if (e.key === "ArrowUp") dy = -step;
    else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        reseat(0, 0);
        springReadout.x = "0.00";
        springReadout.y = "0.00";
        return;
    } else return;
    e.preventDefault();
    const nx = Math.max(-1, Math.min(1, springX.target + dx));
    const ny = Math.max(-1, Math.min(1, springY.target + dy));
    reseat(nx, ny);
    springReadout.x = nx.toFixed(2);
    springReadout.y = ny.toFixed(2);
};

defineExpose({
    animationGroup: computed(() => animationGroup),
    superKey,
});
</script>

<!-- The .demo-box layout (uncaged from utils.css, D.W2.S2). It lands on THIS
     component's own <div> and has exactly one consumer now (the standalone
     `simple` scene was removed), so its smallest shared scope is this SFC's
     own scoped block — the most encapsulated home. The `.demo-container` grid
     it once paired with is dead (zero consumers) and was deleted outright. -->
<style scoped>
.square-stage {
    /* The stage is the drag arena; the box translates within it. */
    overflow: hidden;
}

.demo-box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    --size: 12rem;
    width: var(--size);
    height: var(--size);
    border-radius: var(--radius-lg);
    font-weight: bold;
    font-size: var(--type-body);
    background-color: aquamarine;
    box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--background) 50%, transparent);
    /* Direct-manipulation affordance (S5). The transformFunc owns `transform`,
       so the cursor + touch-action carry the drag posture. */
    cursor: grab;
    touch-action: none;
    will-change: transform;
}

.demo-box--dragging {
    cursor: grabbing;
}
</style>
