import type { InjectionKey } from "vue";
import type { SequenceDemo } from "./useSequenceDemo";

/** The scene's transport superKey — the SINGLE source (R.W5 C.4). */
export const SEQUENCE_SUPER_KEY = "Sequence";

export const SEQUENCE_DEMO_KEY: InjectionKey<SequenceDemo> =
    Symbol("sequence-demo");
