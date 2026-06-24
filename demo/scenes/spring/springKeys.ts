import type { InjectionKey } from "vue";
import type { useSpringDemo } from "./useSpringDemo";

export type SpringDemoContext = ReturnType<typeof useSpringDemo>;

/** The scene's transport superKey — the SINGLE source (R.W5 C.4). */
export const SPRING_SUPER_KEY = "Spring";

export const SPRING_DEMO_KEY: InjectionKey<SpringDemoContext> =
    Symbol("spring-demo");
