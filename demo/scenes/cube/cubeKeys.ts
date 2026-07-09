/** The scene's registry id — the ONE keyspace (T.B9): the scene machine keys
 *  `perScene` by this id AND both option stores key by it, so a scene has exactly
 *  ONE identity (the divergent PascalCase super-key constant is retired). The registry
 *  descriptor (scenes.ts) AND the Scene SFC + `useCubeDemo` (the
 *  `animation.superKey` field) all import it, so no id literal is declared in a
 *  file that doesn't own it (R.W5 C.4). Value === the router/registry id. */
export const CUBE_SCENE_ID = "cube";
