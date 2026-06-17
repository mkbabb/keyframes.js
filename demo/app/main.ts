/**
 * The demo's real module-graph root.
 *
 * The bootstrap formerly lived as an inline `<script type="module">` in
 * `index.html` — a graph LEAF rolldown was free to (and did) tree-shake,
 * which shipped a blank production build: a 698-byte preload shim, no app
 * entry, no CSS. A named entry referenced by `<script src>` is a graph
 * ROOT by construction — not DCE-eligible (B.W4 §1).
 */
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
// The CSS cascade enters the graph through the entry so the bundle emits a
// deterministic, named `index-*.css` asset — the asset criticalCSSPlugin
// (instant first paint) and deferLazyCSSPlugin match by name.
// EditorShell.vue also imports these; Vite dedupes the shared modules, so
// dev and prod resolve identically.
import "@styles/style.css";
// L.W8 S1 ED-3 DOGFOOD INVERSION — the demo consumes the PUBLISHED kf barrel; the
// HEAVY surface (CSSKeyframesAnimation / AnimationGroup / presets / …) rides the
// barrel's `loadAnimationEngine()` dynamic boundary. The scene-machine reconcile
// constructs an empty placeholder `AnimationGroup` SYNCHRONOUSLY on every scene
// switch and feeds it into non-null prop contracts (EditorShell → controls), so
// the engine is warmed ONCE here before mount and read synchronously thereafter
// (demo/@/utils/kfEngine.ts). This is the honest dogfood: the demo boots on the
// same dynamic engine chunk a `npm i` consumer reaches — value.js still never
// lands on the LIGHT static barrel (proof:boundary stays green). The first-paint
// skeleton + critical CSS are JS-independent (criticalCSSPlugin inlines them), so
// this boot await does not block the visual first paint.
import { warmKfEngine } from "@utils/kfEngine";

const app = createApp(App);
app.use(router);

void warmKfEngine().finally(() => {
    app.mount("#app");
});

// Dev-only Long Animation Frames observer — the attribution source for the
// perf measurement + the demo bench (B.W4 §4). The `import.meta.env.DEV`
// guard is a code condition bundlers DCE, so the observer ships ZERO bytes
// to the production build; the dynamic import keeps it off the dev
// critical path too.
if (import.meta.env.DEV) {
    void import("./loaf-observer").then(({ observeLongAnimationFrames }) => {
        observeLongAnimationFrames();
    });
}
