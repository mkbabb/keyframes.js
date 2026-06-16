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

const app = createApp(App);
app.use(router);
app.mount("#app");

// Monaco's `CancellationError` (name/message "Canceled") is its OWN cancellation
// signal — thrown when the keyframes-pane editor is disposed mid-async (a fast
// scene switch cancels an in-flight model/worker request). It is BENIGN, but
// Monaco lets it reach the global unhandled-rejection handler, where it surfaces
// as console noise AND trips the zero-pageerror budgets of the *-live proof gates
// intermittently on a loaded CI runner (a render-timing flake). Swallow ONLY that
// exact, distinctive signature (the standard Monaco-in-SPA pattern) — every real
// error class (AnimationOptionError, the `_gen` crash, parse `"...."`) is left to
// surface untouched.
const isMonacoCanceled = (r: unknown): boolean =>
    !!r &&
    typeof r === "object" &&
    ((r as { name?: unknown }).name === "Canceled" ||
        (r as { message?: unknown }).message === "Canceled");
window.addEventListener("unhandledrejection", (e) => {
    if (isMonacoCanceled(e.reason)) e.preventDefault();
});
window.addEventListener("error", (e) => {
    if (isMonacoCanceled((e as ErrorEvent).error)) e.preventDefault();
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
