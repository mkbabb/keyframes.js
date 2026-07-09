// The keyframe-timeline instrument barrel (T.F5). The timeline reaches the
// Monaco CSSCodeEditor, so its SFC is re-exported LAZILY via
// `defineAsyncComponent` — the facility umbrella stays free of the heavy chunk.
import { defineAsyncComponent } from "vue";

export const KeyframeTimeline = defineAsyncComponent(() => import("./KeyframeTimeline.vue"));

export type { TimelineKeyframe } from "./timelineTypes";
