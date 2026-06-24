import type { InjectionKey } from "vue";
import type { MorphDemo } from "./useMorphDemo";

export const MORPH_DEMO_KEY: InjectionKey<MorphDemo> = Symbol("morph-demo");
