import type { InjectionKey } from "vue";
import type { useEasingDemo } from "./useEasingDemo";

export type EasingDemoContext = ReturnType<typeof useEasingDemo>;

/** The scene's registry id — the ONE keyspace (T.B9). Value === the registry id. */
export const EASING_SCENE_ID = "easing";

export const EASING_DEMO_KEY: InjectionKey<EasingDemoContext> = Symbol("easing-demo");
