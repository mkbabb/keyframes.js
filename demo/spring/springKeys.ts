import type { InjectionKey } from "vue";
import type { useSpringDemo } from "./useSpringDemo";

export type SpringDemoContext = ReturnType<typeof useSpringDemo>;

export const SPRING_DEMO_KEY: InjectionKey<SpringDemoContext> =
    Symbol("spring-demo");
