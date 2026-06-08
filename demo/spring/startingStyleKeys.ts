import type { InjectionKey } from "vue";
import type { useStartingStyleDemo } from "./useStartingStyleDemo";

export type StartingStyleDemoContext = ReturnType<typeof useStartingStyleDemo>;

export const STARTING_STYLE_DEMO_KEY: InjectionKey<StartingStyleDemoContext> =
    Symbol("starting-style-demo");
