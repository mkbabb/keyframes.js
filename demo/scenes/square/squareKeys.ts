/** The scene's registry id — the ONE keyspace (T.B9): the machine + both option
 *  stores key by this single id (the divergent PascalCase super-key constant is
 *  retired). The registry descriptor AND the Scene SFC both import it. Value ===
 *  the registry id. */
export const SQUARE_SCENE_ID = "square";

/** N-SQ-8 — the engine animation's name AND the instrument strip's title, which
 *  were two independent string literals across a file boundary (`anim.name =
 *  "Transform"` in the scene, `>Transform<` in the colocated instrument). One
 *  identity, one spelling, in the colocated keyspace that exists for exactly
 *  this: the strip is titled with the animation it reports on, provably. */
export const SQUARE_ANIM_NAME = "Transform";
