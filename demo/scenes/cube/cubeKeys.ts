/** The scene's transport superKey — the SINGLE source (R.W5 C.4): the registry
 *  descriptor AND the Scene SFC both import it, so no string literal is declared
 *  in a file that doesn't own it. S.D2 S5 (a10) lands this for 8/8 scene-key
 *  parity — cube was the lone scene carrying its superKey inline in
 *  `useCubeAnimations.ts` rather than a `cubeKeys.ts` peer. (Cube wires its
 *  sub-components in the Scene SFC + provides `matrix-controls` via a scene
 *  inject, so this module carries the superKey alone, mirroring the other seven.) */
export const CUBE_SUPER_KEY = "Cube";
