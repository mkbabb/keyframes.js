import type { InjectionKey } from "vue";
import type { LivePreviewLOD } from "./useLivePreviewLOD";

/**
 * The shared-LOD injection key. CarouselDisk builds ONE `useLivePreviewLOD` and
 * `provide()`s it here so every `ScenePreviewHost` registers against the SAME
 * engine-owned clock (the concurrency cap is global — design §8).
 */
export const SCENE_STAGE_LOD_KEY: InjectionKey<LivePreviewLOD> =
    Symbol("scene-stage-lod");
