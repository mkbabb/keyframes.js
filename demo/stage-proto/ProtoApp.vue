<script setup lang="ts">
/**
 * ProtoApp — the round-1 harness for the SceneStage. A minimal background
 * scene-host (the VT subject) + the dock-pill invoker + the runSceneSwitch
 * View-Transition wrapper (the ONE commit edge). This stands in for App.vue so
 * the stage engine can be driven end-to-end without the full demo integration.
 */
import { computed, defineAsyncComponent, nextTick, onMounted, ref } from "vue";
import SceneStage from "@components/custom/scene-stage/SceneStage.vue";
import {
    sceneStageEntries,
    sceneStageIds,
    sceneStageMap,
} from "@components/custom/scene-stage/sceneStageRegistry";

const currentSceneId = ref(
    (location.hash.replace("#", "") || "cube") as string,
);
const currentEntry = computed(
    () => sceneStageMap.get(currentSceneId.value) ?? sceneStageEntries[0],
);

const stageRef = ref<InstanceType<typeof SceneStage> | null>(null);
const stagePhase = ref("closed");
const zoomP = ref(0);

// scene-host zoom-out binding (design §5/§6.7): scale(lerp(1,0.86,p)); opacity 1-p
const hostStyle = computed(() => {
    const active =
        stagePhase.value !== "closed" && stagePhase.value !== "zooming-in";
    // during zooming-in the host un-dims back toward the committed scene
    const p = zoomP.value;
    // D10 P2: front-load the host's opacity ramp — fully gone by p≈0.6 of the
    // zoom-out spring, so the dimmed origin scene never double-exposes inside the
    // beam (the "Cube ghost" the critique flagged).
    const hostOpacity = Math.max(0, 1 - p / 0.6);
    return {
        transform: `scale(${1 - p * 0.14})`,
        opacity: String(hostOpacity),
        pointerEvents: active ? "none" : "auto",
    } as Record<string, string>;
});

const dockInert = computed(
    () =>
        stagePhase.value !== "closed" && stagePhase.value !== "zooming-in",
);

// ─────────────────────────────────────────────────────────────────────────────
// Tech-2 harness — warmScene REAL against a slow lazy chunk (D2.2 for real).
// The round-2 warmScene was a microtask stub, so the VT+Suspense ordering could
// not actually be exercised. Here `__slow-harness` mounts SlowScene.vue behind a
// DELIBERATELY SLOW (~300ms) `import()` wrapped in <Suspense>. Two guarantees:
//   • warmScene(id) AWAITS that chunk (the warm gate) before the VT starts.
//   • the VT update callback AWAITS the Suspense onResolve before it returns
//     (D2.2) — so the entered frame is captured only once the scene is READY,
//     never the fallback/spinner. The memoized loader means a warmed commit
//     resolves instantly on mount (no fallback ever enters the DOM).
// ─────────────────────────────────────────────────────────────────────────────
const HARNESS_ID = "__slow-harness";
let slowChunkPromise: Promise<unknown> | null = null;
/** The slow lazy chunk — memoized so warmScene + the async component SHARE it. */
function loadSlowChunk(): Promise<unknown> {
    if (!slowChunkPromise) {
        slowChunkPromise = new Promise((resolve) =>
            setTimeout(() => resolve(import("./SlowScene.vue")), 300),
        );
    }
    return slowChunkPromise;
}
/** Test-only: drop the memo so a COLD (un-warmed) commit re-incurs the 300ms. */
function resetSlowChunk(): void {
    slowChunkPromise = null;
}
const SlowSceneAsync = defineAsyncComponent({
    loader: () => loadSlowChunk() as Promise<any>,
    delay: 0,
});

// The Suspense onResolve gate — doUpdate awaits THIS (per commit) before it
// returns, so the VT never snapshots the fallback (D2.2).
let sceneReadyResolve: (() => void) | null = null;
function armSceneReadyGate(): Promise<void> {
    return new Promise<void>((r) => (sceneReadyResolve = r));
}
function onSuspenseResolve(): void {
    sceneReadyResolve?.();
    sceneReadyResolve = null;
}

// D2.2 warm gate — the real App awaits the dynamic-import resolve; the harness id
// awaits its slow chunk, every other id is a microtask (already-loaded scenes).
async function warmScene(id: string): Promise<void> {
    if (id === HARNESS_ID) {
        await loadSlowChunk();
        return;
    }
    await Promise.resolve();
}

declare global {
    interface Window {
        __stageVTCount?: number;
        __stageSwitchCount?: number;
        __stageVT?: { overlayInDomAtUpdate: boolean };
        /** Tech-2 witness — the DOM state at the VT update-callback RETURN. */
        __slowHarness?: {
            warmed: boolean;
            usedVT: boolean;
            fallbackAtReturn: boolean;
            slowReadyAtReturn: boolean;
            resolvedBeforeReturn: boolean;
            /** ms the update callback BLOCKED (cold ≈ the slow-chunk latency). */
            updateMs: number;
        };
        __slowHarnessCommit?: (opts?: {
            warm?: boolean;
            vt?: boolean;
        }) => Promise<void>;
    }
}

// THE one commit edge — the View-Transition wrapper (design §10/§11 · D2).
// The overlay leaves INSIDE the captured frame: the update callback runs ONE
// synchronous mutation batch (scene swap + stage.phase→closed via onUpdate),
// then awaits the DOM flush so NEW is captured with no overlay (D2.1).
function runSceneSwitch(
    id: string,
    opts?: { stage?: boolean; onUpdate?: () => void; noVT?: boolean },
): void {
    const prevIndex = sceneStageIds.indexOf(currentSceneId.value);
    const nextIndex = sceneStageIds.indexOf(id);
    // VT-2: MERGE stage into the directional type set, never replace it.
    const direction = nextIndex >= prevIndex ? "forward" : "backward";
    const isHarness = id === HARNESS_ID;

    const doUpdate = async (): Promise<void> => {
        const t0 = performance.now();
        // Tech-2: arm the Suspense onResolve gate BEFORE the scene swap so the
        // render flush's @resolve has a resolver to call.
        const readyGate = isHarness ? armSceneReadyGate() : null;
        let resolved = false;
        if (readyGate) void readyGate.then(() => (resolved = true));

        // ── the ONE synchronous mutation batch (D2.1) ──
        currentSceneId.value = id;
        history.replaceState(null, "", "#" + id);
        window.__stageSwitchCount = (window.__stageSwitchCount ?? 0) + 1;
        opts?.onUpdate?.(); // ← drops the stage to `closed` in this same flush

        if (readyGate) {
            // D2.2 (REAL): the update callback BLOCKS on the slow scene's Suspense
            // onResolve — the VT captures NEW only once the scene is ready, so the
            // entered frame never shows the fallback/spinner. Bounded at 2s.
            await Promise.race([
                readyGate,
                new Promise<void>((r) => setTimeout(r, 2000)),
            ]);
        } else {
            // D2.2: await scene readiness (proto: nextTick flushes the v-if removal
            // + the scene swap), bounded at 350ms so a stuck resolve degrades.
            await Promise.race([
                nextTick(),
                new Promise<void>((r) => setTimeout(r, 350)),
            ]);
        }

        // D11 during-commit clause: is the overlay gone by the end of update?
        window.__stageVT = {
            overlayInDomAtUpdate: !!document.querySelector(".scene-stage"),
        };
        if (isHarness) {
            // Tech-2 witness — the DOM state at the update-callback RETURN.
            window.__slowHarness = {
                warmed: !!window.__slowHarness?.warmed,
                usedVT: !opts?.noVT,
                fallbackAtReturn: !!document.querySelector("[data-slow-fallback]"),
                slowReadyAtReturn: !!document.querySelector("[data-slow-ready]"),
                resolvedBeforeReturn: resolved,
                updateMs: performance.now() - t0,
            };
        }
    };

    const anyDoc = document as any;
    if (!opts?.noVT && typeof anyDoc.startViewTransition === "function") {
        window.__stageVTCount = (window.__stageVTCount ?? 0) + 1;
        try {
            const types = opts?.stage ? ["stage", direction] : [direction];
            anyDoc.startViewTransition({ update: doUpdate, types });
        } catch {
            anyDoc.startViewTransition(doUpdate);
        }
    } else {
        void doUpdate();
    }
}

// D10: the dock pill toggles — open, or cancel-close if already open.
function toggleStage(): void {
    const open =
        stagePhase.value !== "closed" && stagePhase.value !== "zooming-in";
    if (open) stageRef.value?.stage.close();
    else stageRef.value?.open(currentSceneId.value);
}

onMounted(() => {
    if (!location.hash) history.replaceState(null, "", "#" + currentSceneId.value);

    // Tech-2 test hook — drive a harness commit exactly as fire() does (warm THEN
    // runSceneSwitch), with `warm`/`vt` toggles so the gate can prove the warm
    // gate is load-bearing (a cold, no-VT commit surfaces the fallback; a warmed
    // VT commit never does).
    window.__slowHarnessCommit = async ({ warm = true, vt = true } = {}) => {
        if (!warm) resetSlowChunk();
        // seed the witness so doUpdate records the warm flag for this run
        window.__slowHarness = {
            warmed: warm,
            usedVT: vt,
            fallbackAtReturn: false,
            slowReadyAtReturn: false,
            resolvedBeforeReturn: false,
            updateMs: 0,
        };
        if (warm) await warmScene(HARNESS_ID);
        runSceneSwitch(HARNESS_ID, { stage: true, noVT: !vt });
    };
});
</script>

<template>
    <div class="proto-root grid-background">
        <!-- the background scene-host = the VT subject -->
        <main
            class="scene-host"
            :style="hostStyle"
            :data-scene="currentSceneId"
        >
            <!-- Tech-2 harness: the slow lazy scene behind <Suspense>. The
                 #fallback is the spinner the warm gate + onResolve await must
                 keep OUT of the entered frame. -->
            <Suspense
                v-if="currentSceneId === HARNESS_ID"
                @resolve="onSuspenseResolve"
            >
                <SlowSceneAsync />
                <template #fallback>
                    <div class="slow-fallback" data-slow-fallback="true">
                        <span class="slow-spinner"></span>
                        loading…
                    </div>
                </template>
            </Suspense>
            <div v-else class="host-card" :style="{ '--tone': currentEntry?.tone }">
                <span class="host-glyph">{{ currentEntry?.glyph }}</span>
                <h1 class="host-title">{{ currentEntry?.label }}</h1>
                <p class="host-sub">scene · {{ currentSceneId }}</p>
            </div>
        </main>

        <!-- the dock — fades + inert while the stage is open (design §5) -->
        <div class="proto-dock" :class="{ 'is-inert': dockInert }" :inert="dockInert || undefined">
            <button class="dock-pill" data-testid="scene-pill" @click="toggleStage">
                <span class="pill-glyph">{{ currentEntry?.glyph }}</span>
                <span class="pill-label">{{ currentEntry?.label }}</span>
            </button>
        </div>

        <SceneStage
            ref="stageRef"
            :run-scene-switch="runSceneSwitch"
            :warm-scene="warmScene"
            @phase="stagePhase = $event"
            @zoom="zoomP = $event"
        />
    </div>
</template>

<style>
/* the stage VT type — the new scene GROWS out of the stage (design §11) */
@keyframes kf-scene-stage-enter {
    from {
        transform: scale(0.9);
        opacity: 0;
    }
}
/* D2.3: the old genuinely cross-fades BENEATH (was animation:none → hard pop). */
@keyframes kf-scene-stage-old {
    to {
        opacity: 0;
    }
}
::view-transition-group(scene-subject) {
    animation-duration: 420ms;
}
html:active-view-transition-type(stage)::view-transition-new(scene-subject) {
    animation-name: kf-scene-stage-enter;
    animation-duration: 420ms;
    animation-timing-function: var(--ease-out-quart, cubic-bezier(0.25, 1, 0.5, 1));
}
html:active-view-transition-type(stage)::view-transition-old(scene-subject) {
    animation-name: kf-scene-stage-old;
    animation-duration: 300ms;
    animation-timing-function: ease-out;
    animation-fill-mode: forwards;
}
</style>

<style scoped>
.proto-root {
    position: fixed;
    inset: 0;
    overflow: hidden;
}
.scene-host {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    view-transition-name: scene-subject;
    will-change: transform, opacity;
}
.host-card {
    display: grid;
    place-items: center;
    gap: 0.5rem;
    padding: clamp(2rem, 8vw, 5rem);
    border-radius: 24px;
    background: color-mix(in srgb, var(--tone) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--tone) 40%, transparent);
    box-shadow: 0 20px 80px color-mix(in srgb, var(--tone) 20%, transparent);
}
.host-glyph {
    font-size: clamp(4rem, 16vw, 9rem);
    color: var(--tone);
    line-height: 1;
}
/* Tech-2: the Suspense fallback — a loud spinner the entered frame must NOT show. */
.slow-fallback {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem 3rem;
    border-radius: 20px;
    background: rgb(255 60 60 / 0.16);
    border: 1px solid rgb(255 80 80 / 0.5);
    font-family: var(--font-mono, "Fira Code", monospace);
    font-size: 1.4rem;
    letter-spacing: 0.1em;
    color: hsl(0 90% 78%);
}
.slow-spinner {
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 999px;
    border: 3px solid rgb(255 120 120 / 0.4);
    border-top-color: hsl(0 90% 72%);
    animation: slow-spin 0.7s linear infinite;
}
@keyframes slow-spin {
    to {
        transform: rotate(360deg);
    }
}
.host-title {
    font-family: var(--font-display, "Instrument Serif", serif);
    font-size: clamp(2.5rem, 9vw, 5rem);
    color: var(--foreground, #f0ece0);
    line-height: 1;
}
.host-sub {
    font-family: var(--font-mono, "Fira Code", monospace);
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    color: var(--muted-foreground, #8a8a8a);
}
.proto-dock {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    z-index: var(--z-dock, 40);
    transition: opacity 240ms ease;
}
.proto-dock.is-inert {
    opacity: 0;
}
.dock-pill {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-height: 44px;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--foreground, #fff) 20%, transparent);
    background: color-mix(in srgb, var(--card, #1a1a22) 70%, transparent);
    backdrop-filter: blur(10px) saturate(1.1);
    color: var(--foreground, #f0f0f0);
    cursor: pointer;
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.3);
}
.dock-pill:hover {
    border-color: color-mix(in srgb, var(--stage-key, #f5f0e6) 50%, transparent);
}
.pill-glyph {
    font-size: 1.3rem;
    color: var(--tone);
}
.pill-label {
    font-family: var(--font-display, "Instrument Serif", serif);
    font-size: 1.2rem;
}
</style>
