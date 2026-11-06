/**
 * The site's response headers (`demo/app/public/_headers`, Cloudflare Pages).
 *
 * Pages applies EVERY rule whose path matches a request and joins a header set
 * by two matching rules with a comma, so two matching rules that both set
 * Cache-Control ship a contradictory value. This reads the file the way Pages
 * does (a `*` splat matches any run of characters, anchored at both ends) and
 * asserts, per representative path, the headers that path receives.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const FILE = path.resolve(import.meta.dirname, "../../../demo/app/public/_headers");

function parse(text: string): Array<{ re: RegExp; headers: Array<[string, string]> }> {
    const rules: Array<{ re: RegExp; headers: Array<[string, string]> }> = [];
    for (const line of text.split("\n")) {
        if (!line.trim() || line.trimStart().startsWith("#")) continue;
        if (!/^\s/.test(line)) {
            const glob = line.trim().replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
            rules.push({ re: new RegExp(`^${glob}$`), headers: [] });
        } else {
            const i = line.indexOf(":");
            rules.at(-1)!.headers.push([line.slice(0, i).trim().toLowerCase(), line.slice(i + 1).trim()]);
        }
    }
    return rules;
}

const rules = parse(readFileSync(FILE, "utf8"));
function headersFor(p: string): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const r of rules) if (r.re.test(p)) for (const [k, v] of r.headers) (out[k] ??= []).push(v);
    return out;
}

describe("site headers", () => {
    it("a hashed demo asset is cached for a year, immutable", () => {
        expect(headersFor("/assets/index-rZwbIwtW.js")["cache-control"]).toEqual(["public, max-age=31536000, immutable"]);
    });
    it("the embed document keeps its CSP and revalidates", () => {
        const h = headersFor("/embed/");
        expect(h["content-security-policy"]?.[0]).toMatch(/frame-ancestors https:\/\/daraksha\.babb\.dev/);
        expect(h["cache-control"]).toEqual(["public, max-age=0, must-revalidate, no-transform"]);
    });
    it("an embed asset keeps the CSP family and is immutable, untransformed", () => {
        const h = headersFor("/embed/assets/index-Rd9qyRKf.js");
        expect(h["content-security-policy"]).toHaveLength(1);
        expect(h["x-content-type-options"]).toEqual(["nosniff"]);
        expect(h["cache-control"]).toEqual(["public, max-age=31536000, immutable, no-transform"]);
    });
    it("no path receives the same header from two rules", () => {
        for (const p of ["/", "/index.html", "/assets/a.js", "/embed/", "/embed/assets/a.css", "/favicon.svg"]) {
            for (const [k, vs] of Object.entries(headersFor(p))) expect(vs, `${p} ${k}`).toHaveLength(1);
        }
    });
});
