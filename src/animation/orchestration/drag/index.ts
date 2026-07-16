/**
 * orchestration/drag/ — the pointer drag/fling input layer (R.W1; lib-light F-10).
 *
 * The unified public surface: the 1-D `Draggable` engine + the `drag()` factory
 * (`draggable.ts`) and the 2-D sugar `drag2D` (`drag-2d.ts`). The barrel owns the
 * merged surface, replacing the retired flat-sibling re-export relay — `draggable.ts`
 * imports nothing from `drag-2d.ts`; `drag-2d.ts` imports only `Draggable`.
 * LIGHT (parser-free, Value `/math` leaf only) — rides `SpringProgress`/`decay`.
 */
export { drag, Draggable } from "./draggable";
export type { DragOptions, DragAxis, DragSubscriber } from "./draggable";
export { drag2D } from "./drag-2d";
export type { Drag2DHandle } from "./drag-2d";
