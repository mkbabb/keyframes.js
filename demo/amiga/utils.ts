import * as THREE from "three";

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
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, boardSize, boardSize);

    // Iterate the 16×16 TILE grid — one fillRect per dark square (≤128 on-canvas
    // calls). The former loop iterated the 1024×1024 PIXEL grid issuing ~524k
    // fillRect of which all but the first 16×16 landed wholly OFF the canvas
    // (`fillRect(x*64, …)` with x up to 1023) — a genuine perf bug, not just
    // waste. This tile-loop is checkerboard-isomorphic: the visible board is
    // pixel-identical (A3, proof:amiga-tessellate-tilecount ≤256).
    ctx.fillStyle = color2;
    for (let ty = 0; ty < tiles; ty++) {
        for (let tx = 0; tx < tiles; tx++) {
            if ((tx + ty) % 2 === 0) {
                ctx.fillRect(tx * tileSize, ty * tileSize, tileSize, tileSize);
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);

    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshLambertMaterial({
        map: texture,
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
