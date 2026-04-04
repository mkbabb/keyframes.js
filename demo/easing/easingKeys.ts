import type { InjectionKey } from "vue";
import type { useEasingDemo } from "./useEasingDemo";

export type EasingDemoContext = ReturnType<typeof useEasingDemo>;

export const EASING_DEMO_KEY: InjectionKey<EasingDemoContext> = Symbol("easing-demo");
