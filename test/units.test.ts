import {
    parseCSSTime,
    units,
    parseCSSValueUnit,
    parseCSSKeyframes,
    reverseCSSTime,
    FunctionValue,
    ValueArray,
    ValueUnit,
} from "../src/units";
import { expect, describe, it, assert } from "vitest";

const insertRandomWhitespace = (str: string) => {
    const whitespaceChars = [" ", "\t", "\r", "\v", "\f"];

    return str
        .split(" ")
        .map((word) => {
            if (Math.random() > 0.5) {
                return word;
            } else {
                const ws =
                    whitespaceChars[Math.floor(Math.random() * whitespaceChars.length)];
                return ws + word + ws;
            }
        })
        .join("");
};

const reverseTransformValue = (value: FunctionValue | Record<string, ValueArray>) => {
    if (value instanceof FunctionValue) {
        return (
            value.name + "(" + value.values.map(reverseTransformValue).join(", ") + ")"
        );
    } else if (value instanceof ValueUnit) {
        return value.toString();
    } else if (value instanceof ValueArray) {
        return value.values.map(reverseTransformValue).join(", ");
    } else if (typeof value === "object") {
        return Object.entries(value)
            .map(([key, value]) => {
                return [key, value.values.map(reverseTransformValue).join(" ")];
            })
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
    }
};

describe("CSSValueUnit", () => {
    it("should parse all CSS units", () => {
        units.forEach((unit) => {
            const cssValue = `1${unit}`;
            const value = parseCSSValueUnit(cssValue);
            assert.equal(value.toString(), `1${unit}`);
        });
    });

    it("should parse all CSS units with random whitespace", () => {
        units.forEach((unit) => {
            let cssValue = `1${unit}`;
            cssValue = insertRandomWhitespace(cssValue);
            const value = parseCSSValueUnit(cssValue);

            assert.equal(value.toString(), `1${unit}`);
        });
    });

    it("should parse CSS colors; rgb, hex, hsl, etc", () => {
        const colors = [
            "rgb(0, 0, 0)",
            "rgba(0, 255, 0, 0)",
            "#000",
            "#ffffff",
            "hsl(0, 0%, 0%)",
            "hsla(0, 0%, 0%, 0)",
            "aquamarine",
        ];

        colors.forEach((color) => {
            const value = parseCSSValueUnit(color);
            assert.equal(value.unit, "color");
        });
    });
});

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

describe("CSSKeyframes", () => {
    it("should parse simple keyframes; whitespace invariant", () => {
        let keyframes = /*css*/ `
            @keyframes example {
                from   {background-color:red; left:200px; top:0px;}
                25%  {background-color:yellow; left:200px; top:0px;}
                50%  {background-color:blue; left:200px; top:200px;}
                75%  {background-color:green; left:200px; top:200px;}
                to {background-color:red; left:200px; top:0px;}
            }`;

        keyframes = insertRandomWhitespace(keyframes);
        const frames = parseCSSKeyframes(keyframes);
        assert.equal(Object.values(frames).length, 5);

        for (const [percent, frame] of Object.entries(frames)) {
            const { backgroundColor, left, top } = frame;

            assert.equal(backgroundColor.values[0].unit, "color");
            assert.equal(left.values[0].unit, "px");
            assert.equal(left.values[0].value, 200);
            assert.equal(top.values[0].unit, "px");
        }
    });

    it("should parse keyframes with complex nested transform values", () => {
        let keyframes = /*css*/ `@keyframes matrixExample {
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

        keyframes = insertRandomWhitespace(keyframes);
        const frames = parseCSSKeyframes(keyframes);
        assert.equal(Object.values(frames).length, 2);

        let i = 0;
        for (let [percent, frame] of Object.entries(frames)) {
            assert.equal(frame["backgroundColor"].values[0].unit, "color");
            assert.equal(frame["top"].values[0].unit, "px");

            const transform = frame["transform"];

            assert.equal(transform.values.length, 15);

            const matrix3d = transform.values[0];
            const rotateX = transform.values[1];
            const scaleX = transform.values[5];
            const skewX = transform.values[9];
            const translateX = transform.values[12];

            if (i === 0) {
                assert.equal(frame["top"].values[0].value, 0);
                assert.equal(frame["backgroundColor"].values[0].unit, "color");

                assert.equal(matrix3d.values[0].value, 1);
                assert.equal(rotateX.values[0].value, 0);
                assert.equal(scaleX.values[0].value, 1);
                assert.equal(skewX.values[0].value, 0);
                assert.equal(translateX.values[0].value, 0);
            } else if (i === 1) {
                assert.equal(frame["top"].values[0].value, 200);
                assert.equal(frame["backgroundColor"].values[0].unit, "color");

                assert.equal(matrix3d.values[0].value, -0.6);
                assert.equal(rotateX.values[0].value, 360);
                assert.equal(scaleX.values[0].value, 2);
                assert.equal(skewX.values[0].value, 360);
                assert.equal(translateX.values[0].value, 100);
            }

            i += 1;
        }
    });

    it("should parse keyframes with calc", () => {
        let keyframes = /*css*/ `@keyframes calcExample {
            from {
                top: calc(0px, 2px);
            }
        }`;

        keyframes = insertRandomWhitespace(keyframes);
        const frames = parseCSSKeyframes(keyframes);
    });

    it("should parse keyframes with calcs and variables", () => {
        let keyframes = /*css*/ `@keyframes calcExample {
            from {
                top: calc(sin(45deg));
                top: calc(10px + sin(2 + 2));
            }
            100 {
                top: 
                calc(200px + 
                    sin(10px +
                        cos(2 * 5px)
                    )
                );
            }
        }`;

        // keyframes = insertRandomWhitespace(keyframes);
        const frames = parseCSSKeyframes(keyframes);
        console.log(frames);
    });

    it("should parse keyframes with nested expressions", () => {
        let keyframes = /*css*/ `@keyframes calcExample {
            from {
                transform: rotate(asin(sin(tan(0deg))));
            }
            100 {
                transform: rotate(asin(sin(tan(360deg))));
            }
        }`;
        keyframes = insertRandomWhitespace(keyframes);
        const frames = parseCSSKeyframes(keyframes);
        assert.equal(Object.values(frames).length, 2);

        let i = 0;
        for (const [percent, frame] of Object.entries(frames)) {
            const transform = frame["transform"];
            const rotate = transform.values[0];
            assert.equal(rotate.name, "rotate");
            const asin = rotate.values[0];
            assert.equal(asin.name, "asin");
            const sin = asin.values[0];
            assert.equal(sin.name, "sin");
            const tan = sin.values[0];
            assert.equal(tan.name, "tan");

            const value = tan.values[0];
            assert.equal(value.unit, "deg");

            i += 1;
        }
    });
});
