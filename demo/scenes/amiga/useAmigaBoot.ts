import { ref } from "vue";
import { usePreferredReducedMotion } from "@vueuse/core";
import * as THREE from "three";

import type { useAmigaDemo } from "./useAmigaDemo";
import { SPHERE_HOME } from "./useAmigaDemo";

/**
 * L.W11.S3 — "the power-on BOOT" (the amiga scene's instrument egg), extracted
 * from AmigaScene.vue as a colocated sub-unit (the demo ≤500L-per-file
 * decomposition; proof:demo-no-oversize). When the scene scrolls back into view
 * (the EXISTING IntersectionObserver re-entry, the perfect hook), the page boots
 * like a 1984 Amiga: a single white phosphor flash (CSS `.amiga-canvas--power-on`
 * + the AmigaCrtOverlay flash) snaps the CRT on, then the SAME Boing
 * `animationGroup` the dblclick egg dogfoods plays one wall-slam arc behind the
 * scanlines. No new rAF, no new tween — the boot RIDES the engine group (inv ζ).
 * PRM-snapped: under reduced-motion the boot is suppressed (the scanlines/vignette
 * texture stays — texture, not motion).
 */
export function useAmigaBoot(
    animationGroup: ReturnType<typeof useAmigaDemo>["animationGroup"],
    getSphere: () => THREE.Mesh<
        THREE.SphereGeometry,
        THREE.MeshLambertMaterial
    > | undefined,
    isBoinging: () => boolean,
    setBoinging: (v: boolean) => void,
) {
    /** True during the once-on-enter power-on boot (fires the CRT flash). */
    const booting = ref(false);
    /** 0…1 spin-glide energy — flares the CRT scanlines/bloom on a hard flick. */
    const spinBloom = ref(0);
    const prm = usePreferredReducedMotion();
    let bootTimer: ReturnType<typeof setTimeout> | undefined;

    const runBoot = () => {
        // PRM: no flash, no roll, no boot bounce — the ball rests; the static CRT
        // texture (scanlines + vignette) is the only retro tell.
        if (prm.value === "reduce") return;
        const sphere = getSphere();
        if (booting.value || isBoinging() || !sphere) return;
        booting.value = true;
        // POWER → the CRT flash fades via CSS; DROP → drive the kept Boing group
        // for the wall-slam bounces, then settle the mesh home.
        setBoinging(true);
        void animationGroup.play();
        bootTimer = setTimeout(() => {
            animationGroup.stop();
            const m = getSphere();
            if (m) {
                m.position.set(SPHERE_HOME, SPHERE_HOME, SPHERE_HOME);
                m.rotation.set(0, 0, 0);
                m.material.color = new THREE.Color("white");
            }
            setBoinging(false);
            booting.value = false;
        }, 3000);
    };

    const disposeBoot = () => {
        if (bootTimer != null) clearTimeout(bootTimer);
    };

    return { booting, spinBloom, runBoot, disposeBoot };
}
