import type { InjectionKey } from "vue";
import type { MotionPathDemo } from "./useMotionPathDemo";

export const MOTION_PATH_DEMO_KEY: InjectionKey<MotionPathDemo> =
    Symbol("motion-path-demo");
