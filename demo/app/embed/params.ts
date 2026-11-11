/**
 * The slice route, read from the entry's hash: `#/cube?skin=daraksha&scheme=dark`.
 * Only the cube is a slice; its skin is one of the demo's own. `transport=host`:
 * the host carries Play / Pause and Reset in its own chrome (over the bridge's
 * `set-playing` / `reset`), so the slice draws no transport of its own.
 * `stage=fill`: the stage fills the frame the host gives it (the host sizes the
 * frame; the slice reports no size), so a zoomed die meets the frame's edge,
 * not a square inside it.
 */
import type { CubeSkin } from "@state";
import type { Scheme } from "./bridge";

export interface SliceRoute {
    slice: "cube" | null;
    skin: CubeSkin;
    scheme: Scheme | null;
    /** Who draws the transport: the slice ("own", the default) or the host. */
    transport: "own" | "host";
    /** The stage's box: a square on the frame's width ("square"), or the frame. */
    stage: "square" | "fill";
}

const SKINS: readonly CubeSkin[] = ["crayon", "ppmycota", "daraksha"];

export function parseSliceRoute(hash: string): SliceRoute {
    const body = hash.replace(/^#/, "");
    const queryAt = body.indexOf("?");
    const path = (queryAt < 0 ? body : body.slice(0, queryAt)).replace(/^\/+|\/+$/g, "");
    const query = new URLSearchParams(queryAt < 0 ? "" : body.slice(queryAt + 1));
    const skin = query.get("skin") as CubeSkin | null;
    const scheme = query.get("scheme");
    return {
        slice: path === "cube" ? "cube" : null,
        skin: skin && SKINS.includes(skin) ? skin : "crayon",
        scheme: scheme === "dark" || scheme === "light" ? scheme : null,
        transport: query.get("transport") === "host" ? "host" : "own",
        stage: query.get("stage") === "fill" ? "fill" : "square",
    };
}
