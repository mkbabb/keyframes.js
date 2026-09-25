/**
 * X.KF.W13X.mobile · E2E-OCC-1 — the occlusion gate's easing SUBJECT is the
 * element the easing stage actually paints.
 *
 * The occlusion gate (`scripts/observe/demo/occlusion.mjs`) fits each scene's
 * subject in-bounds through the shared manifest (`scripts/lib/demo-driver.mjs`
 * SCENE_GATE_META). The easing stage is the specimen gallery
 * (`EasingCatalogue`), whose subject is each tile's ball. KF.W13W.b
 * (82360347) moved that ball onto the curve and renamed it from the rail idiom
 * `.progress-ball.tile-ball` to `.curve-ball.tile-ball`; the manifest still
 * named `.progress-ball, .hero-ball` (the hero ball was deleted at T.E6), so
 * on the closed-controls pass the only `.progress-ball` left on #/easing was
 * the ribbon's AnimationVisualizer, below the fold inside the sheet, and the
 * gate read `easing/mobile/closed subject ABSENT`.
 *
 * The clause: the gallery tile ball, built from the SFC's own class list,
 * matches the manifest's easing subjectSelector.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const CATALOGUE = path.join(ROOT, "demo/components/EasingCatalogue/EasingCatalogue.vue");
const DRIVER = path.join(ROOT, "scripts/lib/demo-driver.mjs");

/** The class list of the catalogue element that carries `tile-ball`. */
function tileBallClasses(): string[] {
    const src = fs.readFileSync(CATALOGUE, "utf8");
    const template = src.slice(src.indexOf("<template>"), src.lastIndexOf("</template>"));
    const cls = template.match(/class="([^"]*\btile-ball\b[^"]*)"/)?.[1];
    if (!cls) throw new Error("EasingCatalogue template carries no tile-ball element");
    return cls.split(/\s+/).filter(Boolean);
}

describe("occlusion manifest — the easing subject is the gallery tile ball (E2E-OCC-1)", () => {
    it("the tile ball matches SCENE_GATE_META.easing.subjectSelector", async () => {
        const driverUrl = DRIVER;
        const mod = await import(/* @vite-ignore */ driverUrl);
        const easing = (mod.SCENES as Array<{ key: string; subjectSelector: string }>).find(
            (s) => s.key === "easing",
        );
        expect(easing, "the manifest carries an easing scene").toBeTruthy();

        const ball = document.createElement("span");
        ball.className = tileBallClasses().join(" ");
        expect(
            ball.matches(easing!.subjectSelector),
            `tile ball .${tileBallClasses().join(".")} vs subjectSelector "${easing!.subjectSelector}"`,
        ).toBe(true);
    });
});
