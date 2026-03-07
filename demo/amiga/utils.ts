import * as THREE from "three";

export const tesselateSphere = (
    color1: string,
    color2: string,
    radius: number,
) => {
    const tileSize = 64;
    const boardSize = tileSize * 16;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = boardSize;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, boardSize, boardSize);

    ctx.fillStyle = color2;
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            if ((x + y) % 2 === 0) {
                ctx.fillRect(x * 64, y * 64, 64, 64);
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
