<template>
    <!-- The transport's tooltips resolve their provider here, as in the app's root. -->
    <TooltipProvider :delay-duration="100" :skip-delay-duration="0">
        <main ref="sliceRoot" class="embed-slice" :data-slice="route.slice ?? 'none'">
            <!-- The framed document's own heading, named as the host titles the frame. -->
            <h1 v-if="route.slice === 'cube'" class="sr-only">Cube</h1>
            <EmbedCube
                v-if="route.slice === 'cube'"
                ref="cubeRef"
                :skin="route.skin"
                @transport="(playing) => bridge.post({ type: 'transport', playing })"
            />
        </main>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onScopeDispose, useTemplateRef } from "vue";
import { useGlobalDark } from "@mkbabb/glass-ui/dark";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";
import { createEmbedBridge, type Scheme } from "./bridge";
import { parseSliceRoute } from "./params";
import EmbedCube from "./EmbedCube.vue";

const route = parseSliceRoute(window.location.hash);
const bridge = createEmbedBridge(window);
onScopeDispose(() => bridge.dispose());

// The scheme is the host's: the pre-paint script stamped it from the hash, and
// the glass dark store (which every glass surface reads) is set to it before
// the first render.
const { isDark } = useGlobalDark();
const scheme = (): Scheme => (isDark.value ? "dark" : "light");
if (route.scheme) isDark.value = route.scheme === "dark";

// A host flip lands on the next frame, crossfaded where the platform can, and
// is acknowledged once the flip is in the DOM.
const reducedMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
bridge.onSetTheme((next) => {
    requestAnimationFrame(async () => {
        const apply = async () => {
            isDark.value = next === "dark";
            await nextTick();
        };
        type ViewTransitionDoc = Document & {
            startViewTransition?: (cb: () => Promise<void>) => ViewTransition;
        };
        const doc = document as ViewTransitionDoc;
        if (scheme() !== next && doc.startViewTransition && !reducedMotion) {
            // A flip the platform aborts (a second flip, the frame hidden or
            // navigated away) rejects all three promises; the flip itself has
            // still applied, so none of them is an error here.
            const t = doc.startViewTransition(apply);
            t.ready.catch(() => undefined);
            t.finished.catch(() => undefined);
            await t.updateCallbackDone.catch(() => undefined);
        } else {
            await apply();
        }
        bridge.post({ type: "theme", scheme: next });
    });
});

// `ready` once the slice has painted with its faces loaded: the host reveals
// the frame on it.
const sliceRoot = useTemplateRef<HTMLElement>("sliceRoot");

// A host that mirrors the transport in its own chrome drives it here.
const cubeRef = useTemplateRef<InstanceType<typeof EmbedCube>>("cubeRef");
bridge.onSetPlaying((playing) => cubeRef.value?.setPlaying(playing));
onMounted(async () => {
    await nextTick();
    await document.fonts?.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const el = sliceRoot.value;
    if (!el || !route.slice) return;
    const box = el.getBoundingClientRect();
    bridge.post({
        type: "ready",
        slice: route.slice,
        scheme: scheme(),
        width: Math.round(box.width),
        height: Math.ceil(box.height),
    });
    bridge.observeSize(el);
});
</script>
