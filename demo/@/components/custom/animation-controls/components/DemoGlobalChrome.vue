<template>
    <!-- The demo's DOCUMENT-LEVEL singletons — extracted from the
         AnimationControlsGroup layout root as a colocated sub-component (the
         J.W7a fix-round proof:demo-no-oversize seam; markup travels together,
         ZERO appearance delta). Neither is a layout concern: both resolve
         against the DOCUMENT (the SVG paint-server registry / the <html>
         teleport), not the controls grid. -->

    <!-- Hidden SVG gradient definition for rainbow icon strokes. The defs are
         demo-global because the Apply-CSS paintbrush in the ribbon strokes
         `url(#rainbow-gradient)` — the gradient must live where the SVG
         reference can resolve it (the document's paint-server registry). Stops
         reference the demo-owned --rainbow-* family (design-idioms.css). -->
    <svg width="0" height="0" class="absolute">
        <defs>
            <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" :style="{ stopColor: 'var(--rainbow-red)' }" />
                <stop offset="20%" :style="{ stopColor: 'var(--rainbow-orange)' }" />
                <stop offset="40%" :style="{ stopColor: 'var(--rainbow-yellow)' }" />
                <stop offset="60%" :style="{ stopColor: 'var(--rainbow-green)' }" />
                <stop offset="80%" :style="{ stopColor: 'var(--rainbow-blue)' }" />
                <stop offset="100%" :style="{ stopColor: 'var(--rainbow-violet)' }" />
            </linearGradient>
        </defs>
    </svg>

    <Teleport to="html">
        <Toaster
            :toastOptions="{
                unstyled: true,
                classes: {
                    toast: 'bg-foreground text-background rounded-xl text-body px-4 py-3 grid grid-cols-1 gap-1 shadow-lg lg:w-80 w-64 max-w-[90vw]',
                    title: 'font-bold text-body',
                    description: 'font-normal text-small',
                    actionButton: '',
                    cancelButton: '',
                    closeButton: '',
                },
            }"
            theme="system"
        />
    </Teleport>
</template>

<script setup lang="ts">
import { Teleport } from "vue";

import { Toaster } from "vue-sonner";
</script>
