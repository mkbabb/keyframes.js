/**
 * group/composite/ — the single-target composite module (V.W5 LT-08).
 *
 * The tight composite triad carved off the flat `group/` zone under the ONE
 * library grammar (kind-named siblings + pure barrel — the dir name "composite"
 * names no single primary member, so no eponymous file): `compositor.ts` (the
 * `compositeFrame` / `residualBlendArm` composite engine), `state.ts` (the
 * `CompositeState` authored-value store), and `storage.ts` (the long-lived
 * zero-allocation `GroupCompositeStorage`). This PURE barrel is the module's
 * single cross-boundary surface — `group.ts` reaches `compositeFrame` +
 * `createGroupCompositeStorage` here, and the composition tests + bench reach
 * `CompositeState` + `residualBlendArm`. `GroupCompositeStorage` is a
 * module-internal type (consumed only by `compositor.ts`) and stays out of the
 * barrel.
 */
export { CompositeState } from "./state";
export { createGroupCompositeStorage } from "./storage";
export { compositeFrame, residualBlendArm } from "./compositor";
