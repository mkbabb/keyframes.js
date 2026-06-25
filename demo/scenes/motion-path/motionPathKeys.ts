import type { InjectionKey } from "vue";
import type { MotionPathDemo } from "./useMotionPathDemo";

/** The scene's transport superKey — the SINGLE source (R.W5 C.4). */
export const MOTION_PATH_SUPER_KEY = "MotionPath";

export const MOTION_PATH_DEMO_KEY: InjectionKey<MotionPathDemo> =
    Symbol("motion-path-demo");
