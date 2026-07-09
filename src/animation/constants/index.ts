// S.B1 — the constants seam, structural (SPEC-v3 §3 S.B1; fold row 34).
//
// The back-compat barrel over the type/runtime split. It preserves the EXACT
// import surface of the former monolithic `constants.ts`: `../constants`
// resolves here (directory → `index.ts`), so every HEAVY importer (the 38 that
// take a runtime value — `defaultOptions`, `NOOP_TRANSFORM`, `DIRECTIONS`, …)
// keeps its unchanged specifier (SPEC §3 S.B1 S3). LIGHT importers do NOT come
// through here — they target `constants/types` directly (S2), so a light-only
// consumer never reaches `defaults`' value.js edge.
//
// This barrel IS value.js-bearing (it re-exports `defaults`, which imports
// value.js) — correctly so: only the heavy surface reaches it. The `types`
// re-export carries no runtime edge.
export * from "./types";
export * from "./defaults";
