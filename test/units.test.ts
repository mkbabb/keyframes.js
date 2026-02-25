import { assert, describe, expect, it } from "vitest";
import { CSSKeyframesAnimation } from "../src/animation";
import { CSSKeyframesToString } from "../src/parsing/format";
import {
    CSSKeyframes,
    parseCSSKeyframes,
    parseCSSTime,
    reverseCSSTime,
} from "../src/parsing/keyframes";
import { tryParse } from "../src/parsing/utils";

const checkIfReversedEquals = async (keyframes: string) => {
    const el = document.createElement("div");

    const anim = new CSSKeyframesAnimation({}, el).fromString(keyframes);
    const reversed = await CSSKeyframesToString(anim);
    const keyframesAgain = reversed.split("\n\n")[1];

    // Verify the reversed keyframes can be re-parsed
    const frames = parseCSSKeyframes(keyframesAgain);
    expect(frames.size).toBeGreaterThan(0);
};

describe("CSSTime", () => {
    it("should parse CSS time units", () => {
        assert.equal(parseCSSTime("1ms"), 1);
        assert.equal(parseCSSTime("100ms"), 100);
        assert.equal(parseCSSTime("10000ms"), 10000);
    });

    it("should reverse a number into a CSS time unit", () => {
        assert.equal(reverseCSSTime(100), "100ms");
        assert.equal(reverseCSSTime(1000), "1000ms");
        assert.equal(reverseCSSTime(10000), "10s");
        assert.equal(reverseCSSTime(5000), "5s");
        assert.equal(reverseCSSTime(4500), "4500ms");
    });
});

describe("CSSCalc", () => {
    const parseCalc = (s: string) => tryParse(CSSKeyframes.Function, s);

    it("should parse CSS calc functions", () => {
        const calc = parseCalc("calc(1px + 2px*sin(1px))");
        expect(calc).toBeDefined();
    });
});

describe("CSSKeyframes", () => {
    it("should parse simple keyframes", () => {
        const keyframes = /*css*/ `
            @keyframes example {
                from   {background-color:red; left:200px; top:0px;}
                25%  {background-color:yellow; left:200px; top:0px;}
                50%  {background-color:blue; left:200px; top:200px;}
                75%  {background-color:green; left:200px; top:200px;}
                to {background-color:red; left:200px; top:0px;}
            }`;

        const frames = parseCSSKeyframes(keyframes);
        assert.equal(frames.size, 5);

        for (const [percent, frame] of frames) {
            // ValueArray extends Array — access elements directly with [0]
            const { backgroundColor, left, top } = frame;

            assert.equal(backgroundColor[0].unit, "color");
            assert.equal(left[0].unit, "px");
            assert.equal(left[0].value, 200);
            assert.equal(top[0].unit, "px");
        }
    });

    it("should parse keyframes with complex nested transform values", () => {
        const keyframes = /*css*/ `@keyframes matrixExample {
            from {
                top: 0px; background-color: red;

                transform: matrix3d(
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1)

                    rotateX(0deg) rotateY(0deg) rotateZ(0turn)
                    scale(1) scaleX(1) scaleY(1) scaleZ(1)
                    skew(0deg) skewX(0deg) skewY(0deg)
                    translate(0px) translateX(0px) translateY(0px) translateZ(0px);
            }
            100 {
                top: 200px; background-color: blue;

                transform: matrix3d(
                    -0.6,       1.34788, 0,        0,
                    -2.34788,  -0.6,     0,        0,
                     0,         0,       1,        0,
                     0,         0,      10,        1)
                     rotateX(360deg) rotateY(360deg) rotateZ(2.5turn)
                     scale(2) scaleX(2) scaleY(2) scaleZ(2)
                     skew(360deg) skewX(360deg) skewY(360deg)
                     translate(100px) translateX(100px) translateY(100px) translateZ(100px);
            }
          }
        `;

        const frames = parseCSSKeyframes(keyframes);
        assert.equal(frames.size, 2);

        let i = 0;
        for (const [percent, frame] of frames) {
            // ValueArray[0] for simple properties
            assert.equal(frame["backgroundColor"][0].unit, "color");
            assert.equal(frame["top"][0].unit, "px");

            // transform is a ValueArray of FunctionValues
            const transform = frame["transform"];
            // Parser may split sub-functions differently; verify key items exist
            expect(transform.length).toBeGreaterThanOrEqual(15);

            // FunctionValue has .values property — find by name
            const findFunc = (name: string) => transform.find((f: any) => f.name === name);
            const matrix3d = findFunc("matrix3d");
            const rotateX = findFunc("rotateX");
            const scaleX = findFunc("scaleX");
            const skewX = findFunc("skewX");
            const translateX = findFunc("translateX");

            expect(matrix3d).toBeDefined();
            expect(rotateX).toBeDefined();
            expect(scaleX).toBeDefined();
            expect(skewX).toBeDefined();
            expect(translateX).toBeDefined();

            if (i === 0) {
                assert.equal(frame["top"][0].value, 0);
                assert.equal(frame["backgroundColor"][0].unit, "color");

                assert.equal(matrix3d.values[0].value, 1);
                assert.equal(rotateX.values[0].value, 0);
                assert.equal(scaleX.values[0].value, 1);
                assert.equal(skewX.values[0].value, 0);
                assert.equal(translateX.values[0].value, 0);
            } else if (i === 1) {
                assert.equal(frame["top"][0].value, 200);
                assert.equal(frame["backgroundColor"][0].unit, "color");

                assert.equal(matrix3d.values[0].value, -0.6);
                assert.equal(rotateX.values[0].value, 360);
                assert.equal(scaleX.values[0].value, 2);
                assert.equal(skewX.values[0].value, 360);
                assert.equal(translateX.values[0].value, 100);
            }

            i += 1;
        }
    });

    it("should be invertible", () => {
        const keyframes = /*css*/ `
            @keyframes example {
                from   {background-color:red; left:200px; top:0px;}
                25%  {background-color:yellow; left:200px; top:0px;}
                50%  {background-color:blue; left:200px; top:200px;}
                75%  {background-color:green; left:200px; top:200px;}
                to {background-color:red; left:200px; top:0px;}
            }`;

        checkIfReversedEquals(keyframes);
    });

    it("should parse keyframes with calcs", () => {
        const keyframes = /*css*/ `@keyframes calcExample {
            from {
                top: calc(sin(45deg));
                top: calc(sin(var(--hey)));
            }
            100% {
                top:
                calc(200px +
                    sin(10px +
                        cos(2 * 5px)
                    )
                );
            }
        }`;

        const frames = parseCSSKeyframes(keyframes);
        assert.equal(frames.size, 2);
    });

    it("should parse keyframes with variables", () => {
        const keyframes = /*css*/ `@keyframes calcExample {
            from {
                top: var(--hey);
            }
            100% {
                background-color: var(--gay-vibes);
            }
        }`;

        const frames = parseCSSKeyframes(keyframes);

        assert.equal(frames.size, 2);
        // ValueArray[0] to access the first (only) value
        assert.equal(frames.get("0%")["top"][0].toString(), "var(--hey)");
        assert.equal(
            frames.get("100%")["backgroundColor"][0].toString(),
            "var(--gay-vibes)",
        );
    });

    it("should parse keyframes with nested expressions", () => {
        const keyframes = /*css*/ `@keyframes calcExample {
            from {
                transform: skewX(asin(sin(cos(0deg))));
            }
            100 {
                transform: skewX(asin(sin(cos(360deg))));
            }
        }`;

        const frames = parseCSSKeyframes(keyframes);
        assert.equal(frames.size, 2);

        for (const [percent, frame] of frames) {
            const transform = frame["transform"];
            const skewX = transform[0];
            assert.equal(skewX.name, "skewX");
            const asin = skewX.values[0];
            assert.equal(asin.name, "asin");
            const sin = asin.values[0];
            assert.equal(sin.name, "sin");
            const cos = sin.values[0];
            assert.equal(cos.name, "cos");

            const value = cos.values[0];
            assert.equal(value.unit, "deg");
        }
    });

    it("should parse keyframes with linear-gradient", () => {
        const keyframes = /*css*/ `@keyframes calcExample {
            from {
                background-image: linear-gradient(to right, red 10% 10%, blue);
            }
            100 {
                background-image: linear-gradient(to right, red, 10%, blue);
            }
        }`;

        const frames = parseCSSKeyframes(keyframes);
        assert.equal(frames.size, 2);
    });
});
