/**
 * presets/ — the preset catalog barrel (R.W1; lib-animations F1). The former
 * 886L `animations.ts` god-list split by kind: `classic.ts` (34 cubic-bezier/
 * stepped presets), `spring.ts` (the spring-eased factories), `taxonomy.ts` (the
 * enter/exit/attention/loop discovery index). HEAVY — each factory returns a
 * `CSSKeyframesAnimation`, so the catalog rides `loadAnimationEngine()` as the
 * `presets` namespace. This is a 1:1 re-export of the full former surface.
 */
export * from "./classic";
export * from "./spring";
export * from "./taxonomy";
