/**
 * copy-button-feedback — X.KF.W13X.home · KFA-63 · KFA-124 · KFA-178 ·
 * KFA-179 · UIA-KF-298.
 *
 * The copy control's confirmation is a crossfade to the check, a HOLD, and a
 * return — with the accessible name reverting in step:
 *
 *   (1) KFA-63 / UIA-KF-298 — the check is held (opacity 1) well after the
 *       enter, while the name reads "Copied to clipboard"; the old form played
 *       0 → 1 → 0 in one 200 ms run and never reset `isCopied`, so the glyph
 *       blinked for ~100 ms while the name said "Copied" for the session.
 *   (2) KFA-179 — the clipboard glyph fades OUT under the check (the old
 *       "fade-out" layer had no opacity lines at all).
 *   (3) KFA-178 — no opacity outside [0, 1] is ever written (the bounce ease
 *       overshot opacity to 1.18 / -0.18; it rides the transform only).
 *   (4) the return: after the hold the name and the glyphs are back at rest.
 *   (5) KFA-124 — a second click inside the enter restarts the feedback: the
 *       check visibly re-enters instead of the click being swallowed.
 *
 * The spec mounts the REAL component over the REAL engine and reads the
 * engine's own writes (inline `opacity`) frame by frame.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount, type VueWrapper } from "@vue/test-utils";
import { TooltipProvider } from "@mkbabb/glass-ui/tooltip";

vi.mock("@utils/clipboard", () => ({ copyText: vi.fn(async () => {}) }));

const { default: CopyButton } = await import("@components/CopyButton/CopyButton.vue");

const LABEL = "Copy the literal";
const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));
let wrapper: VueWrapper | null = null;
afterEach(() => {
    wrapper?.unmount();
    wrapper = null;
});

async function mountButton() {
    wrapper = mount(
        defineComponent(() => () => h(TooltipProvider, () => h(CopyButton, { text: "ease", label: LABEL }))),
        { attachTo: document.body },
    );
    await nextTick();
    const button = document.querySelector<HTMLButtonElement>("button:has(.clipboard-stack)")!;
    const [clip, check] = [...button.querySelectorAll<SVGElement>(".clipboard-stack > svg")] as SVGElement[];
    // the groups are constructed through loadAnimationEngine() at mount; await
    // the same (cached) engine import so the component's continuation has run
    // before the first click — as on the page, where the engine resolves long
    // before a user can press
    await (await import("@mkbabb/keyframes.js")).loadAnimationEngine();
    for (let k = 0; k < 3; k++) await frame();
    return { button, clip: clip!, check: check! };
}

type Sample = { t: number; chk: string; clip: string; label: string | null };
async function sample(button: HTMLElement, clip: SVGElement, check: SVGElement, ms: number, at?: { ms: number; act: () => void }) {
    const out: Sample[] = [];
    const t0 = performance.now();
    let fired = false;
    while (performance.now() - t0 < ms) {
        const t = performance.now() - t0;
        if (at && !fired && t >= at.ms) {
            at.act();
            fired = true;
        }
        out.push({ t, chk: check.style.opacity, clip: clip.style.opacity, label: button.getAttribute("aria-label") });
        await frame();
    }
    return out;
}
const num = (v: string) => (v === "" ? NaN : Number(v));
const near = (s: Sample[], ms: number) => s.reduce((a, x) => (Math.abs(x.t - ms) < Math.abs(a.t - ms) ? x : a), s[0]!);

describe("CopyButton — enter, hold, return (KFA-63 · 124 · 178 · 179 · UIA-KF-298)", { timeout: 30_000 }, () => {
    it("(1)-(4) the check is held with the copied name, the clipboard fades under it, opacity stays in [0, 1], and both return", async () => {
        const { button, clip, check } = await mountButton();
        button.click();
        const s = await sample(button, clip, check, 2600);

        const held = near(s, 700);
        expect([held.label, num(held.chk) >= 0.99]).toEqual(["Copied to clipboard", true]);
        expect(num(held.clip)).toBeLessThanOrEqual(0.01);

        const written = s.flatMap((x) => [num(x.chk), num(x.clip)]).filter((v) => !Number.isNaN(v));
        expect(written.length).toBeGreaterThan(0);
        expect(written.filter((v) => v < 0 || v > 1)).toEqual([]);

        const rest = s[s.length - 1]!;
        expect([rest.label, num(rest.chk) <= 0.01, num(rest.clip) >= 0.99]).toEqual([LABEL, true, true]);
    });

    it("(5) a second click inside the enter restarts the feedback (a visible re-entry)", async () => {
        const { button, clip, check } = await mountButton();
        button.click();
        const s = await sample(button, clip, check, 900, { ms: 80, act: () => button.click() });
        const after = s.filter((x) => x.t > 80);
        const dip = after.findIndex((x) => num(x.chk) < 0.5);
        expect(dip).toBeGreaterThanOrEqual(0);
        expect(after.slice(dip).some((x) => num(x.chk) >= 0.9)).toBe(true);
    });
});
