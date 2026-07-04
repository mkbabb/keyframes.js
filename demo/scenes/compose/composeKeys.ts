import type { InjectionKey } from "vue";
import type { ComposeDemo } from "./useComposeDemo";

/**
 * The compose scene's transport superKey — the SINGLE source (the registry
 * descriptor AND the Scene SFC both import it; no string literal in a file that
 * doesn't own it; R.W5 C.4).
 *
 * S.D3 (C-4) — the value is KEPT as `"playground"` (NOT renamed to `"compose"`):
 * this is the fold of the standalone playground app into the ninth SPA scene, and
 * the superKey keys the per-scene stored control/asset options. Keeping it
 * preserves a returning user's already-stored playground state (the migration
 * the C-4 ruling calls for) — a rename would silently orphan it.
 */
export const COMPOSE_SUPER_KEY = "playground";

export const COMPOSE_DEMO_KEY: InjectionKey<ComposeDemo> = Symbol("compose-demo");
