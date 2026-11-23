// FORTY-SIXTH E1 (J9) — the Amiga's silhouette, shown while its room builds,
// is the ball's drawn size. It was `min(32vmin, 18rem)`: about 288 px on a
// 1440 x 900 desk, against a ball of about 135 px.
import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { framedBallDiameter } from "../../../demo/scenes/amiga/useAmigaThree";
import { APEX_Y, CONTACT_FLOOR, SPHERE_HOME, SPHERE_RADIUS, WALL_X } from "../../../demo/scenes/amiga/useAmigaDemo";

const FOV = 50;
/** The camera's home direction (lift 1.75 over a 12-unit room at 1.15). */
const HOME = new THREE.Vector3(0, 1.75, 12 * 1.15).normalize();

/** Every point the framing must show, at the ball's plane: the sweep wall to
 *  wall, the floor slam and the apex, each with the ball's radius. */
const MUST_SHOW = [
    new THREE.Vector3(WALL_X + SPHERE_RADIUS, 0, 0),
    new THREE.Vector3(-(WALL_X + SPHERE_RADIUS), 0, 0),
    new THREE.Vector3(0, CONTACT_FLOOR, 0),
    new THREE.Vector3(0, APEX_Y + SPHERE_RADIUS, 0),
];

/** The ball's drawn diameter in px, found by three.js alone: the nearest
 *  camera (along its home direction, 4 % back) that shows every point, then the
 *  ball's silhouette edge projected through it. */
function drawnDiameter(width: number, height: number): number {
    const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.1, 1000);
    const fits = (d: number) => {
        camera.position.copy(HOME).multiplyScalar(d);
        camera.lookAt(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
        camera.updateMatrixWorld();
        return MUST_SHOW.every((p) => {
            const n = p.clone().project(camera);
            return Math.abs(n.x) <= 1 && Math.abs(n.y) <= 1;
        });
    };
    let lo = 1;
    let hi = 200;
    for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (fits(mid)) hi = mid;
        else lo = mid;
    }
    const d = hi * 1.04;
    camera.position.copy(HOME).multiplyScalar(d);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    // The silhouette's edge: the ray grazing the ball, angle asin(r / d) off
    // the view axis, in camera space.
    const a = Math.asin(SPHERE_RADIUS / d);
    const edge = new THREE.Vector3(0, Math.tan(a), -1).applyMatrix4(camera.matrixWorld).project(camera);
    return edge.y * height;
}

describe("the Amiga's silhouette", () => {
    for (const [w, h] of [
        [1440, 900],
        [1060, 780],
        [390, 844],
        [844, 390],
    ]) {
        it(`at ${w} x ${h} it is the ball's drawn size, not 32vmin`, () => {
            const size = framedBallDiameter(w!, h!);
            const drawn = drawnDiameter(w!, h!);
            expect(drawn).toBeGreaterThan(20);
            expect(Math.abs(size - drawn)).toBeLessThan(1.5);
            // The old rule's disc was not the ball.
            const old = Math.min(0.32 * Math.min(w!, h!), 288);
            expect(Math.abs(old - drawn) / drawn).toBeGreaterThan(0.2);
        });
    }
});
