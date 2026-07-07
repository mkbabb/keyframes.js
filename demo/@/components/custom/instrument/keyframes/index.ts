// The keyframes-editor instrument barrel (T.F5). The Monaco-bearing editor is
// re-exported LAZILY via `defineAsyncComponent`, so this barrel is safe to
// import from the facility umbrella without pulling the monaco/highlight.js
// chunk into the entry graph (the idle-warm pane-reveal seam is preserved).
import { defineAsyncComponent } from "vue";

export const KeyframesEditor = defineAsyncComponent(() => import("./KeyframesEditor.vue"));
export const KeyframesStringControls = defineAsyncComponent(
    () => import("./KeyframesStringControls.vue"),
);
export const CSSCodeEditor = defineAsyncComponent(() => import("./CSSCodeEditor.vue"));
