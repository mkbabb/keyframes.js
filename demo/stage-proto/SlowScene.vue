<script setup lang="ts">
/**
 * SlowScene — the Tech-2 harness scene. This module is loaded behind a
 * DELIBERATELY SLOW lazy chunk (a ~300ms `import()` in ProtoApp) so the
 * warmScene → VT-update ordering can be exercised for real: without the warm
 * gate the entered frame would flash the Suspense fallback; with it (and the
 * doUpdate onResolve await) the entered frame shows THIS component, never the
 * spinner. The component body itself is fast — the latency lives in the chunk.
 */
</script>

<template>
    <div class="slow-scene" data-slow-ready="true">
        <span class="slow-glyph">✦</span>
        <h1 class="slow-title">Slow Scene</h1>
        <p class="slow-sub">lazy chunk resolved · warm gate held the frame</p>
    </div>
</template>

<style scoped>
.slow-scene {
    display: grid;
    place-items: center;
    gap: 0.5rem;
    padding: clamp(2rem, 8vw, 5rem);
    border-radius: 24px;
    background: color-mix(in srgb, hsl(160 70% 50%) 16%, transparent);
    border: 1px solid color-mix(in srgb, hsl(160 70% 50%) 42%, transparent);
    box-shadow: 0 20px 80px color-mix(in srgb, hsl(160 70% 50%) 22%, transparent);
}
.slow-glyph {
    font-size: clamp(4rem, 16vw, 9rem);
    color: hsl(160 70% 55%);
    line-height: 1;
}
.slow-title {
    font-family: var(--font-display, "Instrument Serif", serif);
    font-size: clamp(2.5rem, 9vw, 5rem);
    color: var(--foreground, #f0ece0);
    line-height: 1;
}
.slow-sub {
    font-family: var(--font-mono, "Fira Code", monospace);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
    color: var(--muted-foreground, #8a8a8a);
}
</style>
