/**
 * X.KF.W13W.m · OA-64 (KF-W13.md §0cq :491-496) — ONE page gutter on phones.
 *
 * The controls and panes below lg sit on one inline gutter, declared once at
 * the layout root and consumed at the one host every scene mounts in:
 *
 * (1) layout.css declares `--page-gutter` inside the phone query, derived from
 *     the Sheet's own inset (glass `--space-family`) + the pane body's 1rem
 *     shadow reserve;
 * (2) App.vue's `.scene-host` takes `padding-inline: var(--page-gutter)` below
 *     lg — the stage's panes sit on the gutter at the root;
 * (3) no scene frame (the non-Card root of a `*Scene.vue` / `*Target.vue`)
 *     carries its own phone inline offset (an unprefixed px-/pl-/pr- class):
 *     no per-scene offsets (before: spring and sequence `px-6`, the rest 0);
 * (4) the Sheet body adds no inline padding of its own, so its cards land on
 *     the same gutter (before: a doubled 0.75rem).
 * Born RED at the pre-cure bytes (kf 6e8fc989). The served census is the gate
 * (value.js evidence/W13W/m/census.mjs); this pins the root's shape.
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(__dirname, "../../..");
const read = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

/** The bodies of every `@media (max-width: 1023px) { … }` block. */
function phoneBlocks(css: string): string[] {
    const out: string[] = [];
    let i = 0;
    while ((i = css.indexOf("@media (max-width: 1023px)", i)) >= 0) {
        let j = css.indexOf("{", i) + 1;
        let depth = 1;
        const start = j;
        while (depth && j < css.length) {
            if (css[j] === "{") depth++;
            else if (css[j] === "}") depth--;
            j++;
        }
        out.push(css.slice(start, j - 1));
        i = j;
    }
    return out;
}
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");

describe("OA-64 — one page gutter for the phone controls and panes", () => {
    it("(1) layout.css declares --page-gutter in the phone query from the Sheet's inset", () => {
        const blocks = phoneBlocks(stripComments(read("demo/styles/layout.css")));
        const decl = blocks.join("\n").match(/--page-gutter:\s*([^;]+);/);
        expect(decl, "--page-gutter declared below lg").not.toBeNull();
        expect(decl![1]).toMatch(/var\(--space-family\)/);
    });

    it("(2) the scene host sits on the gutter below lg", () => {
        const style = stripComments(read("demo/app/App.vue").split("<style")[1] ?? "");
        const phone = phoneBlocks(style).join("\n");
        expect(phone).toMatch(/\.scene-host\s*\{[^}]*padding-inline:\s*var\(--page-gutter\)/);
    });

    it("(3) no scene frame carries its own phone inline offset", () => {
        const scenes = join(ROOT, "demo/scenes");
        const offenders: string[] = [];
        let frames = 0;
        for (const dir of readdirSync(scenes)) {
            let names: string[] = [];
            try {
                names = readdirSync(join(scenes, dir));
            } catch {
                continue;
            }
            for (const name of names.filter((n) => /(Scene|Target)\.vue$/.test(n))) {
                const src = read(`demo/scenes/${dir}/${name}`);
                const tpl = (src.split("<template>")[1] ?? "").replace(/<!--[\s\S]*?-->/g, "");
                const root = tpl.match(/<([A-Za-z][\w-]*)\b([^>]*)>/);
                if (!root || root[1] === "Card") continue;
                const cls = (root[2] ?? "").match(/\bclass="([^"]*)"/)?.[1] ?? "";
                if (!/\bh-full\b/.test(cls) || !/\bw-full\b/.test(cls)) continue;
                frames++;
                const bare = cls.split(/\s+/).filter((c) => /^-?p[xlr]-/.test(c));
                if (bare.length) offenders.push(`${dir}/${name}: ${bare.join(" ")}`);
            }
        }
        expect(frames).toBeGreaterThanOrEqual(3);
        expect(offenders).toEqual([]);
    });

    it("(4) the Sheet body adds no inline padding of its own", () => {
        const css = stripComments(read("demo/components/instrument/transport/controls-pane/ControlsPaneWrapper.css"));
        const phone = phoneBlocks(css).join("\n");
        const rule = phone.match(/\.controls-drawer-content \.controls-content\s*\{([^}]*)\}/);
        expect(rule, "the sheet body rule exists").not.toBeNull();
        // X.KF.W13X.mobile (A2-KE-L2-15): the body's inline padding is the
        // gutter's EXCESS over the region inset + shadow reserve, which is 0
        // unless a landscape notch grows the gutter; never an inset of its own.
        expect(rule![1]).toMatch(
            /padding-inline:\s*max\(\s*0px,\s*calc\(\s*var\(--page-gutter\)\s*-\s*var\(--space-family\)\s*-\s*1rem\s*\)\s*\)\s*;/,
        );
    });
});
