import * as THREE from "three";
import { resolveCanvasColor } from "@mkbabb/glass-ui/canvas";

/**
 * KF.W6 G-W6-11 — THE ONE CANVAS-COLOUR DISCIPLINE, adopted here.
 *
 * L.W11.S3 passes the Boing-Ball red as a CSS custom property (`var(--amiga-red)`
 * → `var(--rainbow-red)`, the demo's canonical crayon red, single-sourced in
 * design-idioms.css) rather than a raw literal. Canvas2D's `fillStyle` does NOT
 * resolve `var(…)` — an unresolvable value is silently ignored, leaving the
 * previous paint — so the value must be resolved against the live cascade before
 * it reaches the offscreen 2D context.
 *
 * This file used to state that law and then answer it with its own hand-rolled
 * resolver: a `var()`-shaped regex over `getPropertyValue`, recursing through the
 * authored fallback and finally handing the RAW TOKEN NAME to `fillStyle` (an
 * invalid value Canvas2D drops without a word). That resolver was a same-name
 * shadow of a shipped producer surface, and it was weaker in every branch — it
 * could not resolve `light-dark()`, `color-mix()` or `oklch()`, and its miss path
 * was the silent failure it was written to prevent. It is RETIRED into
 * `resolveCanvasColor` from `@mkbabb/glass-ui/canvas`: the producer resolves the
 * value on a probe element ON the cascade (so the live theme arm wins) and returns
 * the browser's own `rgb()`/`rgba()` string, which Canvas2D always parses — and on
 * a miss returns a real inherited colour, never a value the context ignores.
 *
 * The cascade element is `document.documentElement` — the same root the retired
 * resolver read, so the resolution is identity-preserving for both call sites;
 * the offscreen bake canvas is not itself in the document. A non-var literal
 * (e.g. a hex, a named colour) passes through the resolver unchanged, so callers
 * may still pass either.
 *
 * NOT cured here, and declared rather than glossed: this texture is baked ONCE at
 * mount and never re-baked, so a theme flip does not re-tint the ball (the banked
 * L-i5 rider — inert only while no dark `--rainbow-red` arm is authored). The
 * re-bake hook belongs beside the mesh's construction seat, which is outside this
 * unit's §Bounds; it is routed upward, not patched from here.
 */
const resolveColor = (color: string): string =>
    resolveCanvasColor(color, document.documentElement);

export const tesselateSphere = (
    color1: string,
    color2: string,
    radius: number,
) => {
    const tileSize = 64;
    const tiles = 16;
    const boardSize = tileSize * tiles;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = boardSize;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = resolveColor(color1);
    ctx.fillRect(0, 0, boardSize, boardSize);

    // Iterate the 16×16 TILE grid — one fillRect per dark square (≤128 on-canvas
    // calls). The former loop iterated the 1024×1024 PIXEL grid issuing ~524k
    // fillRect of which all but the first 16×16 landed wholly OFF the canvas
    // (`fillRect(x*64, …)` with x up to 1023) — a genuine perf bug, not just
    // waste. This tile-loop is checkerboard-isomorphic: the visible board is
    // pixel-identical (A3, proof:amiga-tessellate-tilecount ≤256).
    ctx.fillStyle = resolveColor(color2);
    for (let ty = 0; ty < tiles; ty++) {
        for (let tx = 0; tx < tiles; tx++) {
            if ((tx + ty) % 2 === 0) {
                ctx.fillRect(tx * tileSize, ty * tileSize, tileSize, tileSize);
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    // Q.WC5 S2 — a SPECULAR material (MeshPhongMaterial: a specular highlight +
    // shininess) so the lit sphere reads as a deliberately-lit object, not the
    // flat diffuse-only MeshLambertMaterial placeholder. The scene's
    // HemisphereLight + SpotLight rig produces a visible highlight on the phong
    // specular lobe (the checker map stays the diffuse base). A near-white,
    // moderately-shiny specular evokes the glossy Amiga Boing-Ball surface
    // without a new shader/material pipeline.
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        specular: new THREE.Color(0x333333),
        shininess: 30,
    });
    // MISSED-C — the hand-rolled UV override that used to sit here is DELETED,
    // and with it three defects in fourteen lines:
    //
    //  · REDUNDANT. `SphereGeometry` already emits equirectangular UVs; the
    //    override recomputed the same mapping from the vertex positions.
    //  · NORTH-POLE DEGENERATE. At the pole row θ = 0 exactly, so `sinθ` is +0
    //    and the generator's `x = −r·cosφ·sinθ` / `z = r·sinφ·sinθ` are SIGNED
    //    ZEROS tracking −cosφ / +sinφ. `Math.atan2(±0, ±0)` returns ±π, ±0, so
    //    across the 33 coincident pole vertices `u` collapsed into three
    //    constant blocks (1.0 / 0.5 / 0.0) against a smoothly-decreasing
    //    neighbour ring — a visible texture wedge on the ball's top cap — while
    //    discarding the generator's deliberate half-texel pole fan. (The SOUTH
    //    pole is not degenerate: sin π ≈ 1.22e-16, so atan2 there receives
    //    tiny-but-real numbers and maps smoothly. The bug had one end.)
    //  · RADIUS-UNSOUND. `Math.asin(y)` was taken over the RAW coordinate, not
    //    y/r, so every vertex of a radius > 1 sphere yielded NaN and a radius < 1
    //    sphere compressed its bands. Inert only because SPHERE_RADIUS is 1 —
    //    and the framing repair in this same packet is a live reason to touch
    //    that constant.
    //
    // Deleting is the whole cure: three's own attribute is correct at every
    // radius and carries the pole fan the override was throwing away.
    return new THREE.Mesh(geometry, material);
};
