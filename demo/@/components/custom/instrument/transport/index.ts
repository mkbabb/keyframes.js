// The transport instrument barrel (T.F5). Heavy SFCs are re-exported LAZILY via
// `defineAsyncComponent` so importing this barrel never eager-loads the control
// facility's downstream Monaco/highlight.js chunk — the fix for the empty-stub
// hazard this replaces (AnimationControls.vue's `import()` seam owns pane
// laziness; the barrel keeps that split intact).
import { defineAsyncComponent } from "vue";

export const AnimationControlsGroup = defineAsyncComponent(
    () => import("./AnimationControlsGroup.vue"),
);
export const TransportDock = defineAsyncComponent(() => import("./TransportDock.vue"));
export const KfPillTabs = defineAsyncComponent(() => import("./KfPillTabs.vue"));

export type { TransportChannel } from "./transportSource";
