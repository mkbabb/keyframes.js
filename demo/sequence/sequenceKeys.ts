import type { InjectionKey } from "vue";
import type { SequenceDemo } from "./useSequenceDemo";

export const SEQUENCE_DEMO_KEY: InjectionKey<SequenceDemo> =
    Symbol("sequence-demo");
