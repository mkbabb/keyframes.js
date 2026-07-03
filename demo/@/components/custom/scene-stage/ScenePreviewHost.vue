<script setup lang="ts">
/**
 * ScenePreviewHost — registers this card against the shared LOD clock and hands
 * the live `tick` to the miniature (design §4/§8 · round-2 D9.4 + D3.3).
 *
 * D9.4 — the content-visibility / IntersectionObserver pause path is DROPPED:
 * all cards sit centered in the viewport, so `content-visibility: auto` never
 * skipped them and the CV event never fired — inert scaffolding. `v-if` (the lit
 * band, D9.1) is the pause authority; tab-hidden parking is RAFPlayback's own
 * rAF-clock park. `visible` is simply `lit`.
 *
 * D3.3 — the amiga (tier "webgl") GL-context lifecycle, PROVEN even though the
 * proto renders a fake CSS sphere: a static POSTER at flank/rear, the live
 * renderer created ONLY when amiga is front AND the orbit has settled (never
 * mid-transit), swapped back to poster immediately on leaving front, with the
 * context DISPOSED on a 2s debounce (a one-step-overshoot re-front cancels it).
 * `webglcontextlost` → poster-permanent for the session. ≤1 GL context EVER.
 * Every lifecycle event is appended to `window.__stageGLLog` for the acceptance.
 */
import { inject, onMounted, onUnmounted, ref, watch } from "vue";
import type {
    LivePreviewLOD,
    LodRegistration,
} from "./composables/useLivePreviewLOD";
import { SCENE_STAGE_LOD_KEY } from "./composables/lodKey";
import MiniPreview from "./MiniPreview.vue";
import type { SceneStageEntry } from "./sceneStageRegistry";

const props = defineProps<{
    entry: SceneStageEntry;
    front: boolean;
    /** Visible = LIT (parent unmounts non-lit via v-if — the pause authority). */
    lit: boolean;
    /** D3.3: front AND orbit settled — the GL-context create gate. */
    settled: boolean;
    reducedMotion: boolean;
}>();

const lod = inject<LivePreviewLOD | null>(SCENE_STAGE_LOD_KEY, null);

let reg: LodRegistration | null = null;
const tick = ref(0);
const cadence = ref<string>("paused");

onMounted(() => {
    if (lod) {
        reg = lod.register();
        watch(reg.tick, (v) => (tick.value = v));
        watch(reg.cadence, (c) => (cadence.value = c));
        push();
    }
    evalGL();
});

function push(): void {
    // D9.4: visible === lit (v-if is the pause authority; no CV/IO mirror).
    reg?.update({
        front: props.front,
        visible: props.lit,
        tier: props.entry.lodTier,
    });
}
watch(() => [props.front, props.lit], push);

// ── D3.3: the WebGL context lifecycle (proven machinery, fake-GL body) ────────
declare global {
    interface Window {
        __stageGLLog?: {
            t: number;
            event: "create" | "dispose" | "contextlost";
            id: string;
            contexts: number;
        }[];
        __stageGLContexts?: number;
    }
}

const isGL = props.entry.lodTier === "webgl";
/** Whether the live GL renderer is currently painting (else the poster shows). */
const glLive = ref(false);
let contextAlive = false;
let posterPermanent = false;
let disposeTimer: ReturnType<typeof setTimeout> | null = null;

function logGL(event: "create" | "dispose" | "contextlost"): void {
    if (typeof window === "undefined") return;
    const contexts = window.__stageGLContexts ?? 0;
    (window.__stageGLLog ??= []).push({
        t: performance.now(),
        event,
        id: props.entry.id,
        contexts,
    });
}

function createGL(): void {
    if (contextAlive || posterPermanent) return;
    contextAlive = true;
    if (typeof window !== "undefined") {
        window.__stageGLContexts = (window.__stageGLContexts ?? 0) + 1;
    }
    logGL("create"); // ← the ONLY place a context is minted (front-settled)
    glLive.value = true;
    // simulate a lost-context risk once per session (never fires in the proto,
    // but the listener is wired exactly as the real Three renderer would need).
}

function disposeGL(): void {
    if (!contextAlive) return;
    contextAlive = false;
    if (typeof window !== "undefined") {
        window.__stageGLContexts = Math.max(0, (window.__stageGLContexts ?? 1) - 1);
    }
    logGL("dispose");
}

function onContextLost(): void {
    posterPermanent = true;
    glLive.value = false;
    logGL("contextlost");
    disposeGL();
}

function evalGL(): void {
    if (!isGL || posterPermanent) return;
    if (props.settled) {
        // front AND settled → create (once) + go live; cancel a pending dispose.
        if (disposeTimer) {
            clearTimeout(disposeTimer);
            disposeTimer = null;
        }
        if (!contextAlive) createGL();
        else glLive.value = true;
    } else {
        // not front-settled → poster immediately; debounce the dispose 2s so a
        // one-step-overshoot re-front reuses the context (no create/destroy churn).
        glLive.value = false;
        if (contextAlive && !disposeTimer) {
            disposeTimer = setTimeout(() => {
                disposeTimer = null;
                disposeGL();
            }, 2000);
        }
    }
}
watch(() => [props.front, props.settled], evalGL);

onUnmounted(() => {
    if (disposeTimer) clearTimeout(disposeTimer);
    // leaving the lit band tears the card down — dispose immediately (the 2s
    // debounce only guards front↔flank overshoot, not a full unmount).
    disposeGL();
    reg?.release();
});

// expose for the fake-GL context-lost drill (the gate can call it)
defineExpose({ onContextLost });
</script>

<template>
    <div
        class="preview-host"
        :data-cadence="cadence"
        :data-tick="tick"
        :data-gl-live="isGL ? String(glLive) : undefined"
        :style="{ pointerEvents: front ? 'auto' : 'none' }"
    >
        <MiniPreview
            :entry="entry"
            :tick="tick"
            :front="front"
            :gl-live="!isGL || glLive"
            :reduced-motion="reducedMotion"
        />
    </div>
</template>

<style scoped>
.preview-host {
    position: absolute;
    inset: 0;
    contain: layout paint;
}
</style>
