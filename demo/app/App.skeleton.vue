<script setup lang="ts">
/**
 * SceneSkeleton — the app shell's `<Suspense>` fallback: a stage placeholder
 * shown while a lazy scene's async chunk resolves.
 *
 * Contract:
 *   - It stands in the scene-host (App.vue's one mount) at the stage's inset,
 *     never as bare "Loading…" text and never as a stage-gating spinner.
 *   - The plate is the stage-card register the Square, Easing, Spring and
 *     Sequence scenes stand on (`<Card :shadow="false">`); the loading motion is
 *     glass's `Skeleton` breathe inside it, so neither is re-authored here.
 *   - It is decorative (`aria-hidden`): the announcement rides EditorShell's
 *     persistent status region through `SCENE_ANNOUNCER_KEY` ("Loading scene"
 *     on mount, "Scene ready" on unmount).
 */
import { onMounted, onUnmounted, inject } from "vue";
import { Skeleton } from "@mkbabb/glass-ui";
import { Card } from "@mkbabb/glass-ui/card";
import { SCENE_ANNOUNCER_KEY } from "@components/instrument/shell/EditorShell.vue";

// The component's name is the one this file's docblock and its sole mount
// (`App.vue`) call it; the `App.skeleton` filename is a sibling-of-App
// convention, not a name, and would otherwise be inferred as one.
defineOptions({ name: "SceneSkeleton" });

const announce = inject(SCENE_ANNOUNCER_KEY, null);

onMounted(() => announce?.("Loading scene"));
onUnmounted(() => announce?.("Scene ready"));
</script>

<template>
    <div class="scene-skeleton" aria-hidden="true">
        <Card :shadow="false" class="scene-skeleton__plate h-full w-full">
            <Skeleton class="scene-skeleton__sheen" />
        </Card>
    </div>
</template>

<style scoped>
.scene-skeleton {
    display: grid;
    width: 100%;
    height: 100%;
    padding: clamp(1rem, 4cqi, 3rem);
}

.scene-skeleton__plate {
    position: relative;
    overflow: hidden;
}

/* The sheen fills the plate and takes the plate's corner — the primitive's own
   `--radius-media` corner is for a text-line skeleton, not a stage. The
   descendant form outranks the primitive's single-class scoped rule. */
.scene-skeleton__plate > .scene-skeleton__sheen {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}
</style>
