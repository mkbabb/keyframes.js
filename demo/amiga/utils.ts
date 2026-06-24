import * as THREE from "three";

/**
 * resolveColor — resolve a CSS color string for use as a Canvas2D fillStyle.
 *
 * L.W11.S3: the Boing-Ball red is now passed as a CSS custom property
 * (`var(--amiga-red)` → `var(--rainbow-red)`, the demo's canonical crayon red,
 * single-sourced in design-idioms.css) rather than a raw literal. Canvas2D's
 * `fillStyle` does NOT resolve `var(…)` — an unresolvable value is silently
 * ignored, leaving the previous paint — so the var must be computed against the
 * live DOM here before it reaches the offscreen 2D context. A non-var literal
 * (e.g. `#ffffff`, `red`) passes through unchanged, so callers may pass either.
 */
const resolveColor = (color: string): string => {
    const m = color.trim().match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]+))?\)$/);
    if (!m) return color;
    const token = m[1]!;
    const fallback = m[2];
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(token)
        .trim();
    if (value) return value;
    // The token resolved to nothing (not registered at the root) — honor the
    // var() fallback if one was authored, else surface the raw token name (an
    // invalid fillStyle, which Canvas2D ignores — the same as today's miss).
    return fallback ? resolveColor(fallback.trim()) : color;
};

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
    const mesh = new THREE.Mesh(geometry, material);

    const uvs: number[] = [];
    const positions = geometry.attributes.position!;
    const vertices = positions.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i]!;
        const y = vertices[i + 1]!;
        const z = vertices[i + 2]!;
        const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
        const v = 0.5 - Math.asin(y) / Math.PI;

        uvs.push(u, v);
    }

    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    return mesh;
};
