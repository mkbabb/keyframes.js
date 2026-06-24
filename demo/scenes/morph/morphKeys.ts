import type { InjectionKey } from "vue";
import type { MorphDemo } from "./useMorphDemo";

/** The scene's transport superKey — the SINGLE source (the registry descriptor
 *  AND the Scene SFC both import it; no string literal in a file that doesn't
 *  own it). R.W5 C.4. */
export const MORPH_SUPER_KEY = "Morph";

export const MORPH_DEMO_KEY: InjectionKey<MorphDemo> = Symbol("morph-demo");
