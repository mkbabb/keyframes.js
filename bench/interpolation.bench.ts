import { bench, describe } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";
import { AnimationGroup } from "../src/animation/group";

describe("interpFrames", () => {
    const twoFrameAnim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; }
        to { opacity: 1; }
    `);

    const multiPropertyAnim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
        from { opacity: 0; transform: translateX(0px); }
        to { opacity: 1; transform: translateX(200px); }
    `);

    const complexStops = Array.from({ length: 11 }, (_, i) => {
        const pct = Math.round((i / 10) * 100);
        return `${pct}% { opacity: ${i / 10}; transform: translateX(${i * 20}px); }`;
    }).join("\n");
    const complexAnim = new CSSKeyframesAnimation({ duration: 1000 }).fromString(complexStops);

    bench("2-frame opacity (60 frames)", () => {
        for (let i = 0; i < 60; i++) {
            twoFrameAnim.interpFrames((i / 60) * 1000, false);
        }
    });

    bench("2-frame multi-property (60 frames)", () => {
        for (let i = 0; i < 60; i++) {
            multiPropertyAnim.interpFrames((i / 60) * 1000, false);
        }
    });

    bench("11-stop complex (60 frames)", () => {
        for (let i = 0; i < 60; i++) {
            complexAnim.interpFrames((i / 60) * 1000, false);
        }
    });
});

describe("transformFramesGrouped", () => {
    const el = document.createElement("div");

    const makeGroup = () => {
        const a = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { opacity: 0; }
            to { opacity: 1; }
        `);
        a.name = "bench-a";
        a.targets = [el];
        a.started = true;

        const b = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { transform: translateX(0px); }
            to { transform: translateX(100px); }
        `);
        b.name = "bench-b";
        b.targets = [el];
        b.started = true;

        const c = new CSSKeyframesAnimation({ duration: 1000 }).fromString(`
            from { transform: translateY(0px); }
            to { transform: translateY(50px); }
        `);
        c.name = "bench-c";
        c.targets = [el];
        c.started = true;

        return new AnimationGroup(a as any, b as any, c as any);
    };

    bench("3-animation group (60 frames)", () => {
        const group = makeGroup();
        for (let i = 0; i < 60; i++) {
            const t = (i / 60) * 1000;
            for (const obj of Object.values(group.animations)) {
                obj.animation.t = t;
            }
            group.transformFramesGrouped(t);
        }
    });
});
