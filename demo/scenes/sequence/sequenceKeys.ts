import type { InjectionKey } from "vue";
import type { SequenceDemo } from "./useSequenceDemo";

/** The scene's registry id — the ONE keyspace (T.B9). Value === the registry id. */
export const SEQUENCE_SCENE_ID = "sequence";

export const SEQUENCE_DEMO_KEY: InjectionKey<SequenceDemo> =
    Symbol("sequence-demo");
