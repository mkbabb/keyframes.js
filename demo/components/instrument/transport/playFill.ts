/**
 * The Play seat's identity fill (§0dm): glass's pastel rainbow at rest, its
 * vivid rainbow while playing, a white glyph. One source for the transport
 * dock that draws it and the embed slice that reports it to a host
 * (`ready.transport`, babb-embed v1).
 */
export const PLAY_FILL = {
    rest: "rainbow-pastel",
    playing: "rainbow-vivid",
    ink: "text-white",
} as const;
