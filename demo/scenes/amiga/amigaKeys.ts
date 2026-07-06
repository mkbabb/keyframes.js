/** The scene's registry id — the ONE keyspace (T.B9): the machine + both option
 *  stores key by this single id (the divergent PascalCase super-key constant is
 *  retired). The registry descriptor AND the Scene SFC + `useAmigaDemo` (the
 *  `animation.superKey` field) all import it. Value === the registry id. */
export const AMIGA_SCENE_ID = "amiga";
