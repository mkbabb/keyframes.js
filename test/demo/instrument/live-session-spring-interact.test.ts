/**
 * X.KF.W13X.spring · E2E-S5-1 — live-session S5's spring INTERACT probe reads
 * the protagonist's own write channel.
 *
 * S5 scrubs the spring rail and counts the distinct inline transforms the
 * spring painter writes over 2.2 s (`scripts/observe/demo/live-session.mjs`,
 * the `spring-rail` kind). KF.W13W.b (OA-56, 82360347) moved the live ball and
 * the sweep sampler OFF the rail onto the plotted trace: the painter now writes
 * `plot.place(t)` to their `.curve-carriage` (the carriage carries the
 * transform, the ball inside it none), and the carriages sit in `SpringTrace`,
 * outside `.spring-rail`. The probe still read `.spring-rail [class*='ball']`,
 * so it saw 0 positions however far the ball rode the trace.
 *
 * The clause: the element the painter writes the live ball's transform to,
 * seated in the SpringTarget template's own tree, is matched by the probe's
 * selector.
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../../..");
const TARGET = path.join(ROOT, "demo/scenes/spring/SpringTarget.vue");
const PROBE = path.join(ROOT, "scripts/observe/demo/live-session.mjs");

/** The selector S5's churn loop reads (the literal in its querySelectorAll). */
function probeSelector(): string {
    const src = fs.readFileSync(PROBE, "utf8");
    const block = src.slice(src.indexOf('meta.kind === "spring-rail"'));
    const sel = block.match(/querySelectorAll\("([^"]+)"\)\)\s*\{\s*if \(el\.style\.transform\)/)?.[1];
    if (!sel) throw new Error("live-session.mjs carries no spring churn selector");
    return sel;
}

/** The ref the spring painter writes the LIVE ball's transform through. */
function livePaintRef(src: string): string {
    const refs = [...src.matchAll(/(\w+El)\.value\.style\.transform\s*=/g)].map((m) => m[1]!);
    const live = refs.find((r) => /^live(Ball|Carriage)El$/.test(r));
    if (!live) throw new Error(`no live-ball paint ref among ${refs.join(", ")}`);
    return live;
}

describe("live-session S5 — the spring INTERACT probe sees the live ball (E2E-S5-1)", () => {
    it("the painter's live-ball write target matches the probe selector in the template tree", () => {
        const src = fs.readFileSync(TARGET, "utf8");
        const template = src.slice(src.indexOf("<template>") + "<template>".length, src.lastIndexOf("</template>"));
        const host = document.createElement("div");
        host.innerHTML = template;

        const ref = livePaintRef(src);
        const el = host.querySelector<HTMLElement>(`[ref="${ref}"]`);
        expect(el, `the template carries ref="${ref}"`).not.toBeNull();
        el!.style.transform = "translate(40%, 60%)";

        const sel = probeSelector();
        const seen = [...host.querySelectorAll(sel)];
        expect(seen.includes(el!), `ref="${ref}" (.${el!.className.split(/\s+/).join(".")}) vs "${sel}"`).toBe(true);
    });
});
