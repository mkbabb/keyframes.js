// FORTY-SIXTH E2 — a channel's options in the address: `o.<Channel>` spells
// only the fields that differ from what the channel's author wrote.
import { describe, expect, it } from "vitest";
import { decodeChannelOptions, encodeChannelOptions } from "../../../demo/app/scene/channelOptionsKey";

const AUTHORED = {
    duration: "5s",
    delay: "0ms",
    iterationCount: "infinite",
    direction: "normal",
    fillMode: "forwards",
    timingFunction: "linear",
};

describe("o.<Channel>", () => {
    it("a channel at its authored options has no value", () => {
        expect(encodeChannelOptions({ ...AUTHORED }, AUTHORED)).toBe("");
    });

    it("spells each changed field once, in the link's order", () => {
        const stored = { ...AUTHORED, timingFunction: "ease-in", duration: "2s", iterationCount: 3, direction: "alternate" };
        expect(encodeChannelOptions(stored, AUTHORED)).toBe("d:2s;n:3;dir:alternate;e:ease-in");
    });

    it("writes an easing literal without the spaces after its commas and reads it back in the engine's spelling", () => {
        const stored = { ...AUTHORED, timingFunction: "cubic-bezier(0.2, 0.65, 0.6, 1)" };
        const link = encodeChannelOptions(stored, AUTHORED);
        expect(link).toBe("e:cubic-bezier(0.2,0.65,0.6,1)");
        expect(decodeChannelOptions(link)).toEqual({ timingFunction: "cubic-bezier(0.2, 0.65, 0.6, 1)" });
        expect(decodeChannelOptions("e:steps(4,jump-end)")).toEqual({ timingFunction: "steps(4, jump-end)" });
    });

    it("round-trips every field", () => {
        const stored = { duration: "2s", delay: "100ms", iterationCount: "3", direction: "reverse", fillMode: "both", timingFunction: "ease-out" };
        const link = encodeChannelOptions(stored, AUTHORED);
        expect(link).toBe("d:2s;dl:100ms;n:3;dir:reverse;f:both;e:ease-out");
        expect(decodeChannelOptions(link)).toEqual(stored);
    });

    it("refuses a value that is not one: an unknown field, a field twice, an empty value", () => {
        expect(decodeChannelOptions("x:1")).toBeUndefined();
        expect(decodeChannelOptions("d:2s;d:3s")).toBeUndefined();
        expect(decodeChannelOptions("d:")).toBeUndefined();
        expect(decodeChannelOptions("2s")).toBeUndefined();
        expect(decodeChannelOptions("")).toEqual({});
    });
});
