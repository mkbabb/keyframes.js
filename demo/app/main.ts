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
import { router } from "./scene/router";
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
// (demo/kf-engine.ts). This is the honest dogfood: the demo boots on the
// same dynamic engine chunk a `npm i` consumer reaches — value.js still never
// lands on the LIGHT static barrel (proof:boundary stays green). The first-paint
// skeleton + critical CSS are JS-independent (criticalCSSPlugin inlines them), so
// this boot await does not block the visual first paint.
import { warmKfEngine } from "@kf-engine";

const app = createApp(App);
app.use(router);

// T.D3 — decode the body face BEFORE mount. Plus Jakarta Sans is a base64
// @font-face (zero network — the glass-ui fonts import), but @font-face decode
// is lazy-on-first-use: GlassDock measures its expanded layer width at MOUNT,
// and a measure taken against the narrower system fallback under-sizes the
// pill ~10%, clipping the right-edge transport controls once the real face
// lands (the 390w play-tap hit-test regression). Awaiting the decode (a few
// ms, local) makes mount-time measures font-true. Race-guarded: never blocks
// mount beyond 1.5s, and the visual first paint is JS-independent anyway
// (criticalCSSPlugin). The durable seam is glass-ui's own re-measure on
// document.fonts.ready (the GU-2 width-morph ledger row's adjacent ask).
const fontsDecoded = Promise.race([
    document.fonts?.load?.('1rem "Plus Jakarta Sans"') ?? Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 1500)),
]).catch(() => undefined);

void Promise.all([warmKfEngine().catch(() => undefined), fontsDecoded]).finally(
    () => {
        app.mount("#app");
    },
);

// Dev-only Long Animation Frames observer — the attribution source for the
// perf measurement + the demo bench (B.W4 §4). The `import.meta.env.DEV`
// guard is a code condition bundlers DCE, so the observer ships ZERO bytes
// to the production build; the dynamic import keeps it off the dev
// critical path too.
if (import.meta.env.DEV) {
    void import("./lifecycle/loaf-observer").then(({ observeLongAnimationFrames }) => {
        observeLongAnimationFrames();
    });
}
