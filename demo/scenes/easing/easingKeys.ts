import type { InjectionKey } from "vue";
import type { useEasingDemo } from "./useEasingDemo";

export type EasingDemoContext = ReturnType<typeof useEasingDemo>;

/** The scene's transport superKey — the SINGLE source (R.W5 C.4). */
export const EASING_SUPER_KEY = "Easing";

export const EASING_DEMO_KEY: InjectionKey<EasingDemoContext> = Symbol("easing-demo");
