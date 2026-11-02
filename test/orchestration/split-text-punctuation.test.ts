/**
 * test/orchestration/split-text-punctuation.test.ts — keyframes 6.1.0 minor,
 * letter KF-1 (value.js COHESION §0he.4).
 *
 * THE DEFECT: `segment.ts` documented "Punctuation rides as its own `unit`
 * under word granularity" — `Intl.Segmenter` emits `,` / `.` / `!` as separate
 * non-word-like segments, so `splitText(el, { by: "word" })` produced a
 * fragment per punctuation mark: "Hello, world." animated as five pieces
 * (`Hello` `,` `world` `.`) and the comma could stagger in after its word, or
 * wrap onto the next line on its own. A word fragment carries the punctuation
 * that abuts it; whitespace stays the only fragment boundary-of-record.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { splitText } from "../../src/animation/orchestration/split-text";

function mount(text: string): HTMLElement {
    const el = document.createElement("div");
    el.textContent = text;
    document.body.appendChild(el);
    return el;
}

const texts = (s: { fragments: HTMLElement[] }) =>
    s.fragments.map((f) => f.textContent);

beforeEach(() => {
    document.body.innerHTML = "";
});

describe("splitText by:word — trailing punctuation stays with its word (KF-1)", () => {
    it("a comma and a full stop ride the word they follow", () => {
        const s = splitText(mount("Hello, world."), { by: "word" });
        expect(texts(s)).toEqual(["Hello,", "world."]);
        expect(s.container.textContent).toBe("Hello, world.");
    });

    it("runs of trailing punctuation and closing quotes stay attached", () => {
        const s = splitText(mount('Wait... "really?!" yes;'), { by: "word" });
        expect(texts(s)).toEqual(["Wait...", '"really?!"', "yes;"]);
    });

    it("a hyphen closes the half before it, an apostrophe stays inside, and spaces stay live text", () => {
        const el = mount("don't re-split it!");
        const s = splitText(el, { by: "word" });
        expect(texts(s)).toEqual(["don't", "re-", "split", "it!"]);
        const textNodes = [...el.childNodes].filter((n) => n.nodeType === 3);
        expect(textNodes.map((n) => n.textContent)).toEqual([" ", " "]);
    });

    it("the cohort, stagger and revert agree on the merged count", () => {
        const el = mount("One, two, three.");
        const s = splitText(el, { by: "word" });
        expect(s.fragments).toHaveLength(3);
        expect(s.delays).toHaveLength(3);
        s.revert();
        expect(el.textContent).toBe("One, two, three.");
    });
    it("touching words in an unspaced script stay separate units; punctuation joins its word", () => {
        const s = splitText(mount("你好，世界。"), { by: "word" });
        expect(texts(s)).toEqual(["你好，", "世界。"]);
    });

    it("an opening quote joins the word it opens; a lone dash stands alone", () => {
        const s = splitText(mount('He said — "go"'), { by: "word" });
        expect(texts(s)).toEqual(["He", "said", "—", '"go"']);
    });
});
