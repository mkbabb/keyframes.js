/**
 * ─────────────────────────────────────────────────────────────────────────────
 * The scene-stage registry (Tranche S prototype) — id → { label, LOD tier,
 * crayon footlight tone, glyph }. Order + membership ENUMERATE from the scene
 * roster (design §4: never a frozen list) — here mirrored from
 * `demo/app/scenes.ts` `scenes[]` (home excluded — home is a machine state).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROTOTYPE NOTE: the round-1 substrate drives LIVE previews via the shared LOD
 * clock + kf LIGHT primitives (the "light = life" engine). The `square` row
 * mounts the REAL `SquareInstrument` target; the others render engine-driven
 * miniatures (real kf motion, real DOM mutation) pending the full
 * provide-adapter mount context (pinia/glass-ui/tailwind) in round-2 integration.
 *
 * inv-16 / proof:boundary: this module imports NOTHING from the engine — pure
 * component/metadata. LIGHT barrel only where a preview runs kf motion.
 */

/** The preview render-cost tier — drives the LOD throttling policy (design §8). */
export type SceneLodTier = "css" | "svg" | "webgl";

export interface SceneStageEntry {
    readonly id: string;
    readonly label: string;
    readonly lodTier: SceneLodTier;
    /** The crayon footlight seam — the front card's contact pool tint (design §7 L4). */
    readonly tone: string;
    /** The dark-diorama silhouette glyph (an emoji stand-in for the scene icon). */
    readonly glyph: string;
    /** The miniature kind the ScenePreviewHost renders when LIT. */
    readonly kind:
        | "cube"
        | "amiga"
        | "square"
        | "easing"
        | "spring"
        | "sequence"
        | "motion-path"
        | "morph";
}

// Order mirrors demo/app/scenes.ts (home excluded): cube · amiga · square ·
// easing · spring · sequence · motion-path · morph.
export const sceneStageEntries: readonly SceneStageEntry[] = [
    { id: "cube", label: "Cube", lodTier: "css", tone: "hsl(320 90% 60%)", glyph: "◱", kind: "cube" },
    { id: "amiga", label: "Amiga", lodTier: "webgl", tone: "hsl(200 90% 55%)", glyph: "◐", kind: "amiga" },
    { id: "square", label: "Square", lodTier: "css", tone: "hsl(150 70% 45%)", glyph: "◼", kind: "square" },
    { id: "easing", label: "Easing", lodTier: "svg", tone: "hsl(248 88% 71%)", glyph: "∿", kind: "easing" },
    { id: "spring", label: "Spring", lodTier: "css", tone: "hsl(15 90% 60%)", glyph: "◉", kind: "spring" },
    { id: "sequence", label: "Sequence", lodTier: "css", tone: "hsl(140 65% 50%)", glyph: "▤", kind: "sequence" },
    { id: "motion-path", label: "Path", lodTier: "svg", tone: "hsl(45 95% 55%)", glyph: "➰", kind: "motion-path" },
    { id: "morph", label: "Morph", lodTier: "svg", tone: "hsl(280 80% 62%)", glyph: "❥", kind: "morph" },
] as const;

export const sceneStageMap: ReadonlyMap<string, SceneStageEntry> = new Map(
    sceneStageEntries.map((e) => [e.id, e]),
);

export const sceneStageIds: readonly string[] = sceneStageEntries.map(
    (e) => e.id,
);
