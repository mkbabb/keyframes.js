import type { InjectionKey } from "vue";
import type { useAmigaDemo } from "./useAmigaDemo";

export type AmigaDemoContext = ReturnType<typeof useAmigaDemo>;

/** The scene's registry id — the ONE keyspace (T.B9): the machine + both option
 *  stores key by this single id (the divergent PascalCase super-key constant is
 *  retired). The registry descriptor AND the Scene SFC + `useAmigaDemo` (the
 *  `animation.superKey` field) all import it. Value === the registry id. */
export const AMIGA_SCENE_ID = "amiga";

/** The scene's demo (the group + its pose sink), provided by AmigaScene to the
 *  stage it renders (AmigaTarget) — the Scene → Target seam every scene keeps. */
export const AMIGA_DEMO_KEY: InjectionKey<AmigaDemoContext> = Symbol("amiga-demo");
