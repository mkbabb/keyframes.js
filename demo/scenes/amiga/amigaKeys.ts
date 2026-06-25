/** The scene's transport superKey — the SINGLE source (R.W5 C.4): the registry
 *  descriptor AND the Scene SFC both import it, so no string literal is declared
 *  in a file that doesn't own it. (Amiga wires its sub-components directly in the
 *  Scene SFC, not via an inject key, so this module carries the superKey alone.) */
export const AMIGA_SUPER_KEY = "Amiga";
