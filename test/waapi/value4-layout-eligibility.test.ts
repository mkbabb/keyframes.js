import { describe, expect, it } from "vitest";
import { isWAAPIEligible } from "../../src/animation/waapi/eligibility";

const defaultRenderer = () => undefined;

const slotFor = (unit: string) => {
    if (unit === "var" || unit === "calc") {
        const value = { kind: "call", name: unit, args: [] } as const;
        return { kind: "computed", from: value, to: value, current: value };
    }
    return { kind: "number", from: 0, to: 1, current: 0, unit } as const;
};

const eligibilityForSlot = (slot: unknown, property = "width") =>
    isWAAPIEligible({
        targets: [{ animate: () => ({}) }],
        frames: [
            {
                transform: defaultRenderer,
                interpVars: {
                    [property]: {
                        template: { kind: "slot", index: 0 },
                        slots: [slot],
                    },
                },
            },
        ],
        usesDefaultRenderer: (renderer: unknown) =>
            renderer === defaultRenderer,
    } as never);

const eligibilityFor = (unit: string, property = "width") =>
    eligibilityForSlot(slotFor(unit), property);

describe("Value 4 layout classification at WAAPI eligibility", () => {
    it.each([
        "%",
        "var",
        "calc",
        "vh",
        "vw",
        "vmin",
        "vmax",
        "vi",
        "vb",
        "svh",
        "svw",
        "svmin",
        "svmax",
        "svi",
        "svb",
        "lvh",
        "lvw",
        "lvmin",
        "lvmax",
        "lvi",
        "lvb",
        "dvh",
        "dvw",
        "dvmin",
        "dvmax",
        "dvi",
        "dvb",
        "cqw",
        "cqh",
        "cqi",
        "cqb",
        "cqmin",
        "cqmax",
        "em",
        "rem",
        "ex",
        "ch",
        "cap",
        "ic",
        "lh",
        "rlh",
    ])("keeps %s on the rAF path", (unit) => {
        const result = eligibilityFor(unit);

        expect(result.eligible).toBe(false);
        if (!result.eligible) {
            expect(result.reason).toContain(`layout-dependent unit (${unit})`);
        }
    });

    it.each([
        "",
        "number",
        "px",
        "cm",
        "mm",
        "q",
        "in",
        "pc",
        "pt",
        "deg",
        "grad",
        "rad",
        "turn",
        "s",
        "ms",
    ])("admits the non-layout control %j", (unit) => {
        expect(eligibilityFor(unit)).toEqual({ eligible: true });
    });

    it("preserves only the path-relative percent exemption", () => {
        expect(eligibilityFor("%", "offset-distance")).toEqual({
            eligible: true,
        });
        expect(eligibilityFor("%", "motion.offset-distance")).toEqual({
            eligible: true,
        });
        expect(eligibilityFor("calc", "offset-distance").eligible).toBe(false);
        expect(eligibilityFor("var", "offset-distance").eligible).toBe(false);
        expect(eligibilityFor("dvh", "offset-distance").eligible).toBe(false);
    });

    it("reads the authored relative unit from a late-resolved mixed pair", () => {
        const relative = {
            kind: "scalar",
            payload: { type: "number", value: 10, unit: "vw" },
        } as const;
        const absolute = {
            kind: "scalar",
            payload: { type: "number", value: 20, unit: "px" },
        } as const;
        const result = eligibilityForSlot({
            kind: "computed",
            from: relative,
            to: absolute,
            current: 0,
            unit: "",
            property: "width",
            cache: undefined,
        });

        expect(result.eligible).toBe(false);
        if (!result.eligible) {
            expect(result.reason).toContain("layout-dependent unit (vw)");
        }
    });
});
