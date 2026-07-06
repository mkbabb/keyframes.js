import type { InjectionKey } from "vue";
import type { useSpringDemo } from "./useSpringDemo";

export type SpringDemoContext = ReturnType<typeof useSpringDemo>;

/** The scene's registry id — the ONE keyspace (T.B9). Value === the registry id. */
export const SPRING_SCENE_ID = "spring";

export const SPRING_DEMO_KEY: InjectionKey<SpringDemoContext> =
    Symbol("spring-demo");
