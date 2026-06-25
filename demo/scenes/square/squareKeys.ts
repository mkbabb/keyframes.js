/** The scene's transport superKey — the SINGLE source (R.W5 C.4): the registry
 *  descriptor AND the Scene SFC both import it, so no string literal is declared
 *  in a file that doesn't own it. (Square wires its instrument via props, not an
 *  inject key, so this module carries the superKey alone.) */
export const SQUARE_SUPER_KEY = "Square";
