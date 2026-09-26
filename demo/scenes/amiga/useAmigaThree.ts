import { markRaw, onBeforeUnmount, ref, type Ref } from "vue";
import {
    useEventListener,
    usePreferredReducedMotion,
    useResizeObserver,
} from "@vueuse/core";
import { RAFPlayback } from "@mkbabb/keyframes.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { useGlobalDark } from "@mkbabb/glass-ui/dark";

import { resolveColor, tesselateSphere } from "./utils";
import {
    BOX_SIZE,
    CONTACT_FLOOR,
    SHADOW_PLANE_Y,
    APEX_Y,
    SPHERE_HOME,
    SPHERE_RADIUS,
    WALL_X,
} from "./useAmigaDemo";

/**
 * R.W6-decomp — the amiga scene's Three.js room (renderer · scene · camera ·
 * OrbitControls · the boing-ball mesh · the managed present loop), extracted from
 * AmigaScene.vue as a colocated sub-unit.
 *
 * T.A9 — the camera frames the ROOM, not the rest pose: the entire J.W7a
 * frustum-fit apparatus (refreshBounceFraming / BounceScale / getBounceScale /
 * BOUNCE_FIT_MARGIN) is DELETED. The authored arc is rendered at authored scale.
 *
 * T.A10 — the gray Lambert box DIES; the floor + back-wall are drawn as a
 * paper-grid over the theme backdrop (renderer stays `alpha:true`), and a soft
 * radial contact-shadow blob tracks the ball's x, scaling/fading with height.
 * (The grid-room COMPOSITION rides T.M owner sign-off — a taste-packet,
 * PENDING-OWNER; the removals + the alpha composite are RULED.)
 *
 * T.A12 — render-on-demand: the present loop renders only when OrbitControls
 * changed, the group is playing, the user is scrubbing or dragging, or a seam is
 * still settling (the scene reports its liveness via the `onFrame` return). At
 * true rest the WebGL context is idle (renderer.info.render.frame stable) — M-5:
 * that is a statement about the GPU and not about the CPU, and the loop body
 * says so where it runs.
 */
// ── D-6 + D-11 — THE FRAMING TERMS, re-derived at this wave's own ref ─────────
// (OP-3/D-19: a geometry cure written off a banked figure is a cure to the wrong
// number. Both banked figures reproduce exactly at these bytes.)
//
// D-6, the fit: the camera is VERTICAL-fov, the arc is HORIZONTAL. View-axis
// distance to the room origin = hypot(lift, z); the vertical half-extent there is
// d·tan(fov/2) = 13.8813 · tan 25° = 6.4728, so the half-WIDTH is that times the
// aspect, and the authored sweep needs WALL_X + SPHERE_RADIUS = 6. The arc
// therefore fits only when aspect ≥ 6 / 6.4728 = 0.927 — a portrait phone is
// 0.46, and the resize handler adjusted `camera.aspect` alone, with no letterbox
// or fit term anywhere since the J.W7a frustum-fit apparatus was deleted. The
// cure SCALES THE CAMERA, never the arc (the authored excursion IS the scene):
// below the fit the camera dollies out along its own view axis, just far enough.
//
// D-11, the vertical bias: at the authored 1.5 lift the frustum met the ball
// plane at +6.199 / −6.861, so headroom above the apex+r (+3) was 3.199 and
// footroom below the floor−r (−5) was 1.861 — 1.719:1, bottom-heavy AGAINST the
// house's declared φ law (layout.css `--dock-margin`'s "bottom anchor + /φ"). A
// 1.75 lift reads +6.173 / −6.954 → 3.173 : 1.954 = 1.624:1, φ to within 0.4 %,
// and it shows MORE of the floor + contact shadow — the very reason the lift
// exists. One free parameter, one arithmetic answer, no taste spent.
const CAMERA_FOV = 50;
const CAMERA_LIFT = 1.75;
const CAMERA_Z = BOX_SIZE * 1.15;
const HALF_FOV_RAD = (CAMERA_FOV / 2) * (Math.PI / 180);
/** The half-width the authored wall-to-wall sweep needs at the ball plane. */
const SWEEP_HALF_WIDTH = WALL_X + SPHERE_RADIUS;
// X.KF.W13X · UIA-KF-196 — the camera frames the BOUNCE ENVELOPE, not the whole
// 12-unit room: the D-6 horizontal fit (the sweep) and a vertical fit that keeps
// the floor slam (floor − r) in view, at the D-11 lift (whose φ bias is a ratio
// of the two reaches below, so a closer camera keeps it). The camera used to sit
// at the room distance whenever that was farther than the fit — the ball read
// ~1/6.5 of the stage height, outweighed by the chrome.
/** The camera's elevation over the ball plane (rad). */
const ELEVATION = Math.atan2(CAMERA_LIFT, CAMERA_Z);
/** How far below / above the target the frustum meets the ball plane, per unit distance. */
const FLOOR_REACH = Math.cos(ELEVATION) * Math.tan(ELEVATION + HALF_FOV_RAD) - Math.sin(ELEVATION);
const CEILING_REACH = Math.sin(ELEVATION) - Math.cos(ELEVATION) * Math.tan(ELEVATION - HALF_FOV_RAD);
/** The envelope's reach below and above home: the floor slam and the apex, plus the radius. */
const ENVELOPE_BELOW = SPHERE_HOME - CONTACT_FLOOR;
const ENVELOPE_ABOVE = APEX_Y + SPHERE_RADIUS - SPHERE_HOME;
/** A breath of margin so the ball never kisses the frame edge. */
const FRAME_MARGIN = 1.04;
/** UIA-KF-197 — the authored viewing direction (the lift over the room). */
const HOME_DIRECTION = new THREE.Vector3(0, CAMERA_LIFT, CAMERA_Z).normalize();
/** UIA-KF-197 — how long the camera takes to arc back to the home view. */
const VIEW_HOME_MS = 360;

/** The shortest signed turn from `a` to `b` (rad). */
const shortestTurn = (a: number, b: number): number =>
    ((((b - a + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;

interface AmigaThreeHandle {
    /** Build the Three.js room. Call once at mount, after the canvas ref is live. */
    setup(): void;
    /**
     * The boing-ball mesh (the interactive subject). L-M5/C-4 — genuinely
     * `undefined` before `setup()` runs (and after a context loss), and the type
     * says so: the field, the JSDoc and the consumer's guard used to disagree
     * about one value, with only the TYPE lying.
     */
    getSphere(): ReturnType<typeof tesselateSphere> | undefined;
    /** The contact-shadow blob mesh (positioned per-frame by the scene). */
    getContactShadow(): THREE.Mesh | undefined;
    /** The live camera (the sphere-spin gesture raycasts against it). */
    getCamera(): THREE.PerspectiveCamera | undefined;
    /** Enable/disable OrbitControls (the sphere-grab stands orbit down). */
    setOrbitEnabled(enabled: boolean): void;
    /** T.A12 — force a render next frame (mount, resize, external state change). */
    markRenderDirty(): void;
    /**
     * UIA-KF-197 — carry the orbit camera back to the framed home view (a
     * ~⅓ s arc about the target; a snap under reduced motion). A drag that
     * misses the ball orbits the room, and nothing used to bring it back.
     */
    homeView(): void;
    /**
     * D-8 — true when the room could not be built (no WebGL, a refused context,
     * a driver that threw) or the GL context is currently lost. The scene reads
     * it so the manipulable-subject affordances do not outlive the object; a ref,
     * because a context can be lost long after mount.
     */
    readonly failed: Readonly<Ref<boolean>>;
    /** True while the managed present loop is running. */
    readonly running: boolean;
    /** Start the WebGL present loop (idempotent). */
    start(): void;
    /** Stop the WebGL present loop (the genuine suspend seam). */
    stop(): void;
    /** Tear down the GL context + geometries/materials (call on unmount). */
    dispose(): void;
}

/**
 * X.KF.W13X · KFA-67 / UIA-KF-195 — the room's ink, resolved from the theme. The
 * grid used to be one literal ('#b9b9c6') in both themes, so its contrast
 * flipped polarity (faint on paper, loud on black), and the contact shadow was
 * fixed black, invisible on the dark ground. Both are now the theme's own ink
 * (`--foreground`), and the ink's lightness says which ground it is written on
 * (a light ink is a dark theme) — no second theme flag to disagree with it.
 */
interface RoomPalette {
    ink: THREE.Color;
    dark: boolean;
}
const resolveRoomPalette = (): RoomPalette => {
    const ink = new THREE.Color(resolveColor("var(--foreground)"));
    return { ink, dark: ink.getHSL({ h: 0, s: 0, l: 0 }).l > 0.5 };
};
/** Per-theme strengths: the floor carries the depth cue, the walls recede, and
 *  on the dark ground a light ink needs less to read (and must not dominate). */
const GRID_OPACITY = {
    light: { floor: 0.3, wall: 0.16 },
    dark: { floor: 0.16, wall: 0.08 },
} as const;
/** The contact shadow's peak: a dark pool on paper, a lifted pool on black. */
const SHADOW_PEAK = { light: 0.5, dark: 0.32 } as const;

/** A soft radial ink→transparent blob for the fake contact shadow (T.A10). */
function makeShadowTexture(palette: RoomPalette): THREE.CanvasTexture {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
    );
    const { r, g: gr, b } = palette.ink.getRGB(
        { r: 0, g: 0, b: 0 },
        THREE.SRGBColorSpace,
    );
    const rgb = `${Math.round(r * 255)}, ${Math.round(gr * 255)}, ${Math.round(b * 255)}`;
    const peak = SHADOW_PEAK[palette.dark ? "dark" : "light"];
    g.addColorStop(0, `rgba(${rgb}, ${peak})`);
    g.addColorStop(0.5, `rgba(${rgb}, ${peak / 2})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

/** A ruled panel — unit squares in its local XY plane, centred on the origin. */
function ruledPanel(width: number, height: number): THREE.LineSegments {
    const points: number[] = [];
    for (let x = -width / 2; x <= width / 2 + 1e-9; x += 1) {
        points.push(x, -height / 2, 0, x, height / 2, 0);
    }
    for (let y = -height / 2; y <= height / 2 + 1e-9; y += 1) {
        points.push(-width / 2, y, 0, width / 2, y, 0);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return new THREE.LineSegments(
        geometry,
        new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }),
    );
}

/** The contact-shadow plate's side (world units). */
const SHADOW_PLATE = 2.6;

/**
 * X.KF.W13X · KFA-125 — the contact shadow's scale for a ball at `px` lifted
 * `lift` (0 floor → 1 apex): it grows with height (the soft penumbra) but never
 * past the room's floor edge — a wall-side apex used to spill 1.47 u onto the void.
 */
export const contactShadowScale = (px: number, lift: number): number =>
    Math.min(1 + 0.9 * lift, (BOX_SIZE / 2 - Math.abs(px)) / (SHADOW_PLATE / 2));

/**
 * @param canvasEl  the `<canvas>` template ref.
 * @param onFrame   per-frame injection (compose pose+gesture onto the mesh ·
 *                  advance the glide/re-seat). Called AFTER controls.update(),
 *                  BEFORE the (gated) render. MUST return whether the scene is
 *                  LIVE this frame (group playing / glide / re-seat) so the
 *                  present loop can skip the render at rest (T.A12).
 */
export function useAmigaThree(
    canvasEl: Ref<HTMLCanvasElement | null>,
    onFrame: (now: number) => boolean,
): AmigaThreeHandle {
    let sphereMesh: ReturnType<typeof tesselateSphere> | undefined;
    let contactShadow: THREE.Mesh | undefined;
    let renderer: THREE.WebGLRenderer | undefined;
    let controls: OrbitControls | undefined;
    let scene: THREE.Scene | undefined;
    let camera: THREE.PerspectiveCamera | undefined;
    // The WebGL present loop rides the engine's MANAGED RAFPlayback driver — the
    // scene owns NO hand-rolled rAF.
    const present = markRaw(new RAFPlayback());

    // T.A12 — the render-on-demand dirty flag. Set on mount/resize/interaction;
    // cleared after each render. The present loop also renders while
    // OrbitControls is still settling (controls.update() returns true) or the
    // scene reports itself live.
    let renderDirty = true;
    let disposed = false;
    const failed = ref(false);
    const prm = usePreferredReducedMotion();

    // UIA-KF-197 — the framed home view (re-seated by every frameRoom) and the
    // arc that carries the camera back to it, stepped on the frame clock.
    const homeOffset = new THREE.Spherical();
    const homeTarget = new THREE.Vector3(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
    let viewArc:
        | { from: THREE.Spherical; fromTarget: THREE.Vector3; start: number | undefined }
        | undefined;
    const arcScratch = new THREE.Spherical();

    // KFA-67 / UIA-KF-195 — the room's grids, re-inked on every theme flip.
    const roomGrids: Array<{ grid: THREE.LineSegments; role: "floor" | "wall" }> = [];
    const applyPalette = (palette: RoomPalette): void => {
        const strength = GRID_OPACITY[palette.dark ? "dark" : "light"];
        for (const { grid, role } of roomGrids) {
            const material = grid.material as THREE.LineBasicMaterial;
            material.color.copy(palette.ink);
            material.opacity = strength[role];
        }
    };
    /** Re-resolve the ink after a theme flip has settled, and re-paint. */
    const retheme = (): void => {
        if (!scene) return;
        const palette = resolveRoomPalette();
        applyPalette(palette);
        const material = contactShadow?.material;
        if (material && !Array.isArray(material)) {
            const shadow = material as THREE.MeshBasicMaterial;
            shadow.map?.dispose();
            shadow.map = makeShadowTexture(palette);
            shadow.needsUpdate = true;
        }
        renderDirty = true;
    };
    const stopRetheme = useGlobalDark().onFlipSettled(retheme);
    const arcOffset = new THREE.Vector3();

    /**
     * D-6 — seat the projection for a viewport, dollying out along the camera's
     * own view axis when the aspect is too narrow for the authored sweep. The
     * ORBIT is preserved: the position is scaled, never re-seated, so a user who
     * has orbited keeps their angle across a resize. M-4 — the zero-size window
     * (a pre-layout mount, a display:none ancestor) is guarded HERE, once, for
     * the mount path and the resize path alike; the mount path used to divide by
     * a zero the sibling resize handler had always guarded against.
     */
    const frameRoom = (width: number, height: number): void => {
        if (!camera || !renderer || width === 0 || height === 0) return;
        const aspect = width / height;
        camera.aspect = aspect;
        const framed =
            FRAME_MARGIN *
            Math.max(
                SWEEP_HALF_WIDTH / (aspect * Math.tan(HALF_FOV_RAD)),
                ENVELOPE_BELOW / FLOOR_REACH,
                ENVELOPE_ABOVE / CEILING_REACH,
            );
        // The camera keeps the direction the user orbited it to and takes the
        // framed distance (a resize re-frames; it never leaves the ball small).
        const target = controls?.target ?? homeTarget;
        arcOffset.copy(camera.position).sub(target);
        if (arcOffset.lengthSq() === 0) arcOffset.copy(HOME_DIRECTION);
        camera.position.copy(target).add(arcOffset.setLength(framed));
        // UIA-KF-197 — the home view is the authored direction at the framed
        // distance; Home/Reset carry the camera back to it.
        homeOffset.setFromVector3(arcOffset.copy(HOME_DIRECTION).multiplyScalar(framed));
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        controls?.update();
        renderDirty = true;
    };

    const buildRoom = () => {
        const canvas = canvasEl.value!;
        disposed = false;

        scene = new THREE.Scene();

        // T.A9 — the camera frames the ROOM (the whole BOX_SIZE cube), not the
        // rest pose, so the authored wall-to-wall / floor↔apex arc renders at
        // authored scale. Subject = pivot = framing (the look-at is the centred
        // home). The lift keeps the floor + shadow readable and carries D-11's
        // φ bias (the derivation is at the constants).
        camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 1000);
        camera.position.set(0, CAMERA_LIFT, CAMERA_Z);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas,
        });
        // A2 — cap DPR at 2 (MSAA carries edge quality; extra super-sampling is
        // pure fill-rate waste on retina).
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // T.A10 — clear to TRANSPARENT so the canvas composites over the themed
        // CSS paper-grid backdrop instead of a foreign gray slab.
        renderer.setClearColor(0xffffff, 0);

        // Lighting: a soft sky/ground fill + a top-front key for the specular lobe.
        const hemi = new THREE.HemisphereLight("white", "#c8c8c8", 1.6);
        scene.add(hemi);
        const key = new THREE.SpotLight("white", 0.7, 0, Math.PI / 2, 0.9);
        key.position.set(0, BOX_SIZE, BOX_SIZE / 2);
        scene.add(key);

        // T.A10 — the grid-room: a paper-grid FLOOR and WALLS over the theme
        // backdrop (the gray Lambert box is gone); the CSS grid-bg shows through
        // the transparent composite behind them. Unit squares, inked per theme.
        const palette = resolveRoomPalette();
        const panel = (role: "floor" | "wall", width: number, height: number) => {
            const lines = ruledPanel(width, height);
            roomGrids.push({ grid: lines, role });
            scene!.add(lines);
            return lines;
        };
        const floor = panel("floor", BOX_SIZE, BOX_SIZE);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = CONTACT_FLOOR;
        // KFA-64 — the back wall STANDS on the floor: its bottom edge is the
        // floor line (it used to be centred on home and hang a unit below it,
        // showing through the translucent floor).
        const WALL_CENTRE_Y = CONTACT_FLOOR + BOX_SIZE / 2;
        panel("wall", BOX_SIZE, BOX_SIZE).position.set(0, WALL_CENTRE_Y, -BOX_SIZE / 2);
        // KFA-194 — the ball reverses at ±WALL_X, one radius from walls that now
        // exist: two side walls standing on the floor, from the back wall to the
        // ball's plane (the half of the room the ball lives in; a full-depth wall
        // would rule the whole foreground).
        for (const side of [-1, 1]) {
            const wall = panel("wall", BOX_SIZE / 2, BOX_SIZE);
            wall.rotation.y = Math.PI / 2;
            wall.position.set((side * BOX_SIZE) / 2, WALL_CENTRE_Y, -BOX_SIZE / 4);
        }

        // T.A10 — the fake contact-shadow blob on the floor plane, tracked to the
        // ball's x + scaled/faded by height each frame (by the scene's compose).
        contactShadow = new THREE.Mesh(
            new THREE.PlaneGeometry(SHADOW_PLATE, SHADOW_PLATE),
            new THREE.MeshBasicMaterial({
                map: makeShadowTexture(palette),
                transparent: true,
                depthWrite: false,
            }),
        );
        contactShadow.rotation.x = -Math.PI / 2;
        contactShadow.position.set(0, SHADOW_PLANE_Y, 0);
        scene.add(contactShadow);
        applyPalette(palette);

        // The Boing-Ball: the crayon-red checker sphere, re-sourced to
        // var(--amiga-red) (→ var(--rainbow-red), single-sourced in
        // design-idioms.css). Seated at the centred home so a centre-drag HITS it.
        sphereMesh = tesselateSphere("#ffffff", "var(--amiga-red)", SPHERE_RADIUS);
        sphereMesh.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
        scene.add(sphereMesh);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        // I.W3 S1 — the orbit pivot IS the subject: target the centred home so an
        // empty-space drag orbits ABOUT the subject.
        controls.target.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
        controls.update();
        // T.A12 — any user orbit dirties the render.
        controls.addEventListener("change", () => {
            renderDirty = true;
        });

        frameRoom(canvas.clientWidth, canvas.clientHeight);
        renderDirty = true;
        start();
    };

    /**
     * D-8 — the room is built behind an ERROR POSTURE. `new THREE.WebGLRenderer`
     * throws on a machine with no WebGL, a blocked context, or a driver that
     * refuses — and it sat bare inside `onMounted` with no try/catch, no
     * fallback and no `onErrorCaptured` anywhere in demo/ or src/, so the whole
     * scene mount died and the subject's `cursor: grab` went on advertising an
     * object that was never built. A failure is now a STATE the scene can read
     * and paint honestly, not an exception that takes the route down.
     */
    const setup = () => {
        try {
            buildRoom();
            failed.value = false;
        } catch (error) {
            failed.value = true;
            stop();
            console.warn("[amiga] the WebGL room could not be built", error);
        }
    };

    /** Step the home arc on the frame clock; true while it moves the camera. */
    const stepViewArc = (now: number): boolean => {
        if (!viewArc || !camera || !controls) return false;
        viewArc.start ??= now;
        const k = Math.min(Math.max((now - viewArc.start) / VIEW_HOME_MS, 0), 1);
        const eased = 1 - (1 - k) ** 3;
        const { from } = viewArc;
        arcScratch.set(
            from.radius + (homeOffset.radius - from.radius) * eased,
            from.phi + (homeOffset.phi - from.phi) * eased,
            from.theta + shortestTurn(from.theta, homeOffset.theta) * eased,
        );
        controls.target.lerpVectors(viewArc.fromTarget, homeTarget, eased);
        camera.position.setFromSpherical(arcScratch).add(controls.target);
        camera.lookAt(controls.target);
        if (k >= 1) {
            viewArc = undefined;
            controls.update();
        }
        return true;
    };

    const homeView = (): void => {
        if (!camera || !controls) return;
        // An orbit released moments ago is still coasting (OrbitControls'
        // damping tail), and it would carry the camera off home again once the
        // arc lands. One undamped update completes that coast now — the
        // controls' own way of spending the tail — and the arc starts from where
        // it would have come to rest.
        controls.enableDamping = false;
        controls.update();
        controls.enableDamping = true;
        viewArc = {
            from: new THREE.Spherical().setFromVector3(
                arcOffset.copy(camera.position).sub(controls.target),
            ),
            fromTarget: controls.target.clone(),
            // Reduced motion: the arc completes on its first frame (a snap).
            start: prm.value === "reduce" ? Number.NEGATIVE_INFINITY : undefined,
        };
        renderDirty = true;
    };

    function start() {
        if (present.running || failed.value) return;
        present.loop((now: number) => {
            // OrbitControls.update() applies damping and returns true while the
            // camera is still settling — a render trigger on its own (T.A12).
            // While the home arc runs it owns the camera, and the controls wait.
            const controlsChanged = viewArc
                ? stepViewArc(now)
                : controls
                  ? controls.update()
                  : false;
            // The scene composes pose+gesture onto the mesh and reports liveness,
            // on this frame's timestamp (KFA-128).
            const sceneLive = onFrame(now);
            if (
                renderer &&
                scene &&
                camera &&
                (renderDirty || controlsChanged || sceneLive)
            ) {
                renderer.render(scene, camera);
                renderDirty = false;
            }
            // M-5, recorded rather than glossed: render-on-demand gates the DRAW,
            // not the FRAME. This callback keeps returning true, so `controls
            // .update()` + the scene's compose run at 60 Hz for as long as the
            // scene is mounted and visible — the GL context idles at rest, the
            // CPU does not. The cost is accepted, not overlooked: standing the
            // FRAME down would require every input edge (a pointerdown on the
            // subject, a keyboard nudge, a transport scrub, an OrbitControls
            // damping tail) to re-arm the loop before its own first frame, and
            // this scene's own liveness contract runs the other way — the scene
            // TELLS the loop what is live, from inside the loop. The suspend
            // seams that matter (tab hidden, scene scrolled away) stop the loop
            // outright, and they are wired.
            return true;
        });
    }

    function stop() {
        present.stop();
    }

    /**
     * L-M2/C-14 — dispose EVERY owned GPU resource, not the Mesh subset.
     *
     * The walk used to test `obj instanceof THREE.Mesh`, and both GridHelpers are
     * `LineSegments` — so the floor and back-wall geometries and materials were
     * never released. `Material.dispose()` does not walk its own maps either, so
     * both `CanvasTexture`s (the 1024² checkerboard ≈ 4 MB and the shadow blob)
     * stayed resident. Every `Object3D` carrying geometry or material is walked
     * here by shape, and each material's textures go with it.
     */
    const disposeMaterial = (material: THREE.Material): void => {
        // The texture slots are declared by three's material SUBCLASSES, so the
        // base type is widened structurally (each slot optional) rather than
        // walked by string key — a material without a slot simply has none.
        const mapped = material as THREE.Material &
            Partial<
                Record<
                    "map" | "alphaMap" | "specularMap" | "envMap",
                    THREE.Texture | null
                >
            >;
        mapped.map?.dispose();
        mapped.alphaMap?.dispose();
        mapped.specularMap?.dispose();
        mapped.envMap?.dispose();
        material.dispose();
    };

    const disposeGraph = () => {
        controls?.dispose();
        controls = undefined;
        scene?.traverse((obj) => {
            const drawable = obj as Partial<THREE.Mesh>;
            drawable.geometry?.dispose();
            const material = drawable.material;
            if (Array.isArray(material)) material.forEach(disposeMaterial);
            else if (material) disposeMaterial(material);
        });
        scene = undefined;
        roomGrids.length = 0;
        sphereMesh = undefined;
        contactShadow = undefined;
        camera = undefined;
        // The GL context is otherwise held until GC collects the unrooted
        // closure — deterministic release is one call, and it is the difference
        // between "released now" and "released whenever".
        renderer?.forceContextLoss();
        renderer?.dispose();
        renderer = undefined;
    };

    // L-i8 — `dispose` is BOTH auto-registered on scope dispose and exposed on
    // the handle, so a consumer that calls it politely at unmount disposes the
    // same GPU objects twice. Idempotent: the second call is a no-op, not a
    // double-free of a released context.
    function dispose() {
        if (disposed) return;
        disposed = true;
        stop();
        disposeGraph();
    }

    // Canvas resize → the framing term (D-6's fit + M-4's zero-size guard, both
    // inside `frameRoom`, which the mount path calls too).
    useResizeObserver(canvasEl, () => {
        const canvas = canvasEl.value;
        if (!canvas) return;
        frameRoom(canvas.clientWidth, canvas.clientHeight);
    });

    // D-8 — the GL context can be taken from a live page (a GPU reset, a driver
    // update, too many contexts). `preventDefault()` on the loss is what makes
    // the browser promise a restore; without it the canvas stays blank forever
    // and — composed with C-9 limb 1 — the loop spins on a dead context. Neither
    // event was handled anywhere in demo/ or src/.
    useEventListener(canvasEl, "webglcontextlost", (event: Event) => {
        event.preventDefault();
        failed.value = true;
        stop();
    });
    useEventListener(canvasEl, "webglcontextrestored", () => {
        disposeGraph();
        failed.value = false;
        setup();
    });

    onBeforeUnmount(() => {
        stopRetheme();
        dispose();
    });

    return {
        setup,
        getSphere: () => sphereMesh,
        getContactShadow: () => contactShadow,
        getCamera: () => camera,
        setOrbitEnabled: (enabled: boolean) => {
            if (controls) controls.enabled = enabled;
        },
        markRenderDirty: () => {
            renderDirty = true;
        },
        homeView,
        failed,
        get running() {
            return present.running;
        },
        start,
        stop,
        dispose,
    };
}
