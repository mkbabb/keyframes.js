import { describe, expect, it } from "vitest";
import { parseAnimationCSS } from "../../../demo/components/instrument/keyframes/utils/parseAnimationCSS";

// UIA-KF-012 (X.KF.W13V.u): the editor's projection is strict where the engine
// is lenient. A non-empty buffer that yields zero @keyframes rules (the engine's
// EMPTY_PARSE row) is a rejection, not a frame-less success — before, it was
// adopted and toasted "Keyframes parsed".
describe("the editor projection rejects what it cannot adopt (UIA-KF-012)", () => {
    // "}}} @@ nope {}" is what the served editor holds after typing
    // "}}} @@ nope {" (Monaco auto-closes the brace).
    it.each(["}}} @@ nope {}", ".subject { color: red; }"])(
        "rejects %j (no @keyframes rule)",
        async (input) => {
            await expect(parseAnimationCSS(input)).rejects.toThrow(
                /^Invalid animation CSS: .*zero @keyframes/,
            );
        },
    );

    it("still adopts a bare stop list and a whole @keyframes rule", async () => {
        await expect(
            parseAnimationCSS("from { opacity: 0; } to { opacity: 1; }"),
        ).resolves.toBeDefined();
        await expect(
            parseAnimationCSS("@keyframes a { from { opacity: 0; } to { opacity: 1; } }"),
        ).resolves.toBeDefined();
    });
});
