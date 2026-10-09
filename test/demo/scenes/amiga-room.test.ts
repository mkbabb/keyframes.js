// SERVED MODEL: claude-opus-5-5
/**
 * X.KF.W13X.amiga — the Amiga ROOM (useAmigaThree), built for real in jsdom.
 *
 * Only what jsdom cannot give is doubled: the WebGL renderer (a no-op stub), the
 * 2D canvas context (a recorder, so the shadow and ball textures can be read)
 * and glass's canvas-colour resolver (a token table per theme). The room graph,
 * the camera framing and the materials are the real module's.
 *
 *  · KFA-64   — the back wall stands on the floor (its bottom edge at CONTACT_FLOOR).
 *  · KFA-194  — the ball turns at walls that exist (side walls at ±BOX_SIZE/2).
 *  · KFA-67 / UIA-KF-195 — the grid and the contact shadow are theme tokens, not
 *               literals; X-DS pass 2 (KF-C2-02): the shadow subtracts in both
 *               themes (the ink on paper, black on the dark ground).
 *  · KFA-195  — the checker texture is sRGB, and the light rig (physical units)
 *               lights a white tile white and lets the key reach the ball.
 *  · UIA-KF-196 — the camera frames the bounce envelope, not the whole room.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, ref } from "vue";
import { mount } from "@vue/test-utils";

const stops = vi.hoisted(() => ({ list: [] as string[] }));

vi.mock("three", async (importOriginal) => {
    const real = await importOriginal<typeof import("three")>();
    class FakeRenderer {
        domElement: HTMLCanvasElement;
        constructor(opts: { canvas: HTMLCanvasElement }) {
            this.domElement = opts.canvas;
        }
        setPixelRatio() {}
        setClearColor() {}
        setSize() {}
        render() {}
        dispose() {}
        forceContextLoss() {}
    }
    return { ...real, WebGLRenderer: FakeRenderer };
});

vi.mock("@mkbabb/glass-ui", () => ({
    // The token table the demo's stylesheet resolves to, per theme.
    resolveCanvasColor: (color: string) => {
        const dark = document.documentElement.classList.contains("dark");
        if (color.includes("--foreground")) return dark ? "rgb(236, 232, 226)" : "rgb(28, 25, 23)";
        if (color.includes("--amiga-red")) return "rgb(220, 40, 40)";
        return color;
    },
}));

import * as THREE from "three";
import { useAmigaThree, WALL_HEIGHT, WALL_TOP } from "../../../demo/scenes/amiga/useAmigaThree";
import { APEX_Y, BOX_SIZE, CONTACT_FLOOR, SPHERE_RADIUS, WALL_X } from "../../../demo/scenes/amiga/useAmigaDemo";

function fake2d(): CanvasRenderingContext2D {
    const grad = { addColorStop: (_o: number, c: string) => stops.list.push(c) };
    return {
        createRadialGradient: () => grad,
        fillRect: () => {},
        clearRect: () => {},
        set fillStyle(_v: unknown) {},
    } as unknown as CanvasRenderingContext2D;
}

function build(theme: "light" | "dark") {
    stops.list = [];
    document.documentElement.classList.toggle("dark", theme === "dark");
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
        () => fake2d() as never,
    );
    const canvas = document.createElement("canvas");
    Object.defineProperty(canvas, "clientWidth", { value: 878 });
    Object.defineProperty(canvas, "clientHeight", { value: 646 });
    let handle!: ReturnType<typeof useAmigaThree>;
    const wrapper = mount(
        defineComponent({
            setup() {
                handle = useAmigaThree(ref(canvas), () => false);
                handle.setup();
                return () => h("div");
            },
        }),
    );
    const scene = handle.getContactShadow()!.parent as THREE.Scene;
    // The room's ruled planes (floor, walls): every line set in the graph.
    const grids: THREE.LineSegments[] = [];
    scene.traverse((o) => {
        if (o instanceof THREE.LineSegments) grids.push(o);
    });
    const box = (o: THREE.Object3D) => new THREE.Box3().setFromObject(o);
    return { handle, scene, grids, box, wrapper };
}

describe("X.KF.W13X.amiga — the room", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        document.documentElement.classList.remove("dark");
    });

    it("KFA-64 — the back wall stands on the floor", () => {
        const { grids, box, wrapper } = build("light");
        const back = grids.find((g) => {
            const b = box(g);
            return b.max.z - b.min.z < 0.01 && b.max.z < 0;
        })!;
        expect(back).toBeTruthy();
        expect(box(back).min.y).toBeCloseTo(CONTACT_FLOOR, 3);
        wrapper.unmount();
    });

    it("KF-C25-03 — the walls' tops close inside the closest framing, above the apex", () => {
        const { grids, box, wrapper } = build("light");
        const walls = grids.map((g) => box(g)).filter((b) => b.max.y - b.min.y > 1 && b.min.y > CONTACT_FLOOR - 0.01);
        expect(walls.length).toBe(3);
        for (const b of walls) {
            expect(b.min.y).toBeCloseTo(CONTACT_FLOOR, 3);
            expect(b.max.y).toBeCloseTo(WALL_TOP, 3);
        }
        // Above the bounce (apex + radius), and whole ruled rows.
        expect(WALL_TOP).toBeGreaterThan(APEX_Y + SPHERE_RADIUS);
        expect(Number.isInteger(WALL_HEIGHT)).toBe(true);
        wrapper.unmount();
    });

    it("KFA-194 — the ball reverses at walls that exist (±BOX_SIZE/2)", () => {
        const { grids, box, wrapper } = build("light");
        const sides = grids
            .map((g) => box(g))
            .filter((b) => b.max.x - b.min.x < 0.01)
            .map((b) => Math.round(b.min.x * 1000) / 1000)
            .sort((a, b) => a - b);
        expect(sides).toEqual([-BOX_SIZE / 2, BOX_SIZE / 2]);
        expect(BOX_SIZE / 2).toBe(WALL_X + SPHERE_RADIUS);
        wrapper.unmount();
    });

    it("KFA-67 / UIA-KF-195 — grid and shadow come from the theme's ink, in both themes", () => {
        for (const theme of ["light", "dark"] as const) {
            const { grids, wrapper } = build(theme);
            const ink = new THREE.Color(theme === "dark" ? "rgb(236, 232, 226)" : "rgb(28, 25, 23)");
            for (const g of grids) {
                const m = g.material as THREE.LineBasicMaterial;
                expect(m.color.getHexString()).toBe(ink.getHexString());
            }
            // X-DS pass 2 · KF-C2-02 — the contact shadow SUBTRACTS in both
            // themes: on paper it is the (dark) ink, on the dark ground it is
            // black — never the light ink, which painted a glow on the black
            // floor. The light peak is soft (≤ 0.25).
            expect(stops.list.length).toBeGreaterThan(0);
            const peak = Math.max(...stops.list.map((c) => Number(c.match(/,\s*([\d.]+)\)$/)![1])));
            if (theme === "dark") {
                for (const c of stops.list) expect(c).toMatch(/^rgba\(0,\s*0,\s*0,/);
            } else {
                for (const c of stops.list) expect(c).toMatch(/^rgba\(28,\s*25,\s*23,/);
                expect(peak).toBeLessThanOrEqual(0.25);
            }
            wrapper.unmount();
        }
    });

    it("KFA-195 — the checker texture is sRGB", () => {
        const { handle, wrapper } = build("light");
        const mat = handle.getSphere()!.material as THREE.MeshLambertMaterial;
        expect(mat.map?.colorSpace).toBe(THREE.SRGBColorSpace);
        wrapper.unmount();
    });

    it("X-DS pass 2 · KF-C2-01 — the ball is diffuse: no gloss (no specular material)", () => {
        const { handle, wrapper } = build("light");
        const mat = handle.getSphere()!.material;
        expect(mat).toBeInstanceOf(THREE.MeshLambertMaterial);
        expect(mat).not.toBeInstanceOf(THREE.MeshPhongMaterial);
        expect(mat).not.toBeInstanceOf(THREE.MeshStandardMaterial);
        wrapper.unmount();
    });

    it("X-DS pass 2 · KF-C2-02 — the shadow plate lies behind the ball's plane (the frame's cut is in front of it)", () => {
        const { handle, box, wrapper } = build("light");
        const plate = box(handle.getContactShadow()!);
        expect(plate.max.z).toBeLessThanOrEqual(1e-6);
        expect(plate.min.z).toBeLessThan(0);
        wrapper.unmount();
    });

    it("KFA-195 — the rig lights a sky-facing white tile to white (physical light units)", () => {
        const { scene, handle, wrapper } = build("light");
        let fill = 0;
        let key = 0;
        const ball = handle.getSphere()!.position;
        scene.traverse((o) => {
            // Lambert divides by π; a hemisphere's sky term reaches an up-facing
            // tile whole; a spot arrives as intensity / d^decay.
            if (o instanceof THREE.HemisphereLight) fill += o.intensity / Math.PI;
            if (o instanceof THREE.SpotLight) {
                const d = o.position.distanceTo(ball);
                key += o.intensity / d ** o.decay / Math.PI;
            }
        });
        expect(fill + key).toBeGreaterThan(0.9);
        // the key reaches the ball and models its form; on a Lambert ball it
        // makes no highlight (KF-C2-01), and it stays below the fill (soft).
        expect(key).toBeGreaterThan(0.2);
        expect(key).toBeLessThan(fill);
        wrapper.unmount();
    });

    it("UIA-KF-196 — the camera frames the bounce envelope (the sweep fills the view)", () => {
        const { handle, wrapper } = build("light");
        const cam = handle.getCamera()!;
        const halfW = cam.position.length() * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.aspect;
        // the sweep (±WALL_X plus the radius) spans at least 85 % of the view width at the ball's depth
        expect((WALL_X + SPHERE_RADIUS) / halfW).toBeGreaterThan(0.85);
        wrapper.unmount();
    });
});
