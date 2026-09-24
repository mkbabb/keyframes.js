<template>
    <!-- The demo's DOCUMENT-LEVEL singleton — extracted from the
         AnimationControlsGroup layout root as a colocated sub-component (the
         J.W7a fix-round proof:demo-no-oversize seam; markup travels together,
         ZERO appearance delta). It is not a layout concern: it resolves
         against the DOCUMENT (the SVG paint-server registry), not the controls
         grid. -->

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
</template>

<script setup lang="ts">
// UIA-KF-001/002 — the Toaster is no longer this component's: it mounted here
// as vue-sonner's UNSTYLED host with no stylesheet (a static <ol> after <body>,
// every toast painted below the fold) and, inside the super-keyed controls
// group, it was torn down on every scene switch. The glass Toaster now mounts
// ONCE at the App root, above every scene key.
</script>
