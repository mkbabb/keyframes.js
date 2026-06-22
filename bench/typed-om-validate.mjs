// Typed-OM write-path VALIDATION spike (Tranche P / P.W3). Owner: "prototype and
// validate now." The audit flagged the Typed-OM (StylePropertyMap.set) write path
// as a contrived DUAL-PATH for a Chromium-mostly win that may be ZERO on
// single-property writes — but the verdict needs a REAL BROWSER (the API does not
// exist in node). This launches Chromium and measures the write cost:
//   string `style.setProperty` (build string + browser parse)  vs
//   Typed-OM `attributeStyleMap.set` (build CSSStyleValue + no parse),
// for a multi-property transform (the wave's claimed-win shape) AND a single
// property (the audit's possibly-zero case). Honest ratio → ADOPT/KILL.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("/Users/mkbabb/Programming/value.js/node_modules/playwright-core");

const page_fn = () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const N = 200000, WARM = 5000;
    const supportsTOM = "attributeStyleMap" in el && typeof CSS !== "undefined" && !!CSS.px;
    let x = 0;
    const time = (fn) => {
        for (let i = 0; i < WARM; i++) fn(i);
        const t0 = performance.now();
        for (let i = 0; i < N; i++) fn(i);
        return N / ((performance.now() - t0) / 1000);
    };
    // ── multi-property transform (translate/scale/rotate + opacity) ──
    const strMulti = (i) => {
        x = i & 255;
        el.style.setProperty("transform", `translate(${x}px, ${x / 2}px) scale(${1 + x / 500}) rotate(${x}deg)`);
        el.style.setProperty("opacity", String(1 - x / 512));
    };
    const tomMulti = (i) => {
        x = i & 255;
        el.attributeStyleMap.set("transform", new CSSTransformValue([
            new CSSTranslate(CSS.px(x), CSS.px(x / 2)),
            new CSSScale(CSS.number(1 + x / 500), CSS.number(1 + x / 500)),
            new CSSRotate(CSS.deg(x)),
        ]));
        el.attributeStyleMap.set("opacity", CSS.number(1 - x / 512));
    };
    // ── single property (opacity) — the audit's possibly-zero case ──
    const strSingle = (i) => { el.style.setProperty("opacity", String(1 - (i & 255) / 512)); };
    const tomSingle = (i) => { el.attributeStyleMap.set("opacity", CSS.number(1 - (i & 255) / 512)); };

    const med3 = (mk) => { const r = [mk(), mk(), mk()].sort((a, b) => a - b); return r[1]; };
    const out = { supportsTOM };
    if (supportsTOM) {
        const sm = med3(() => time(strMulti)), tm = med3(() => time(tomMulti));
        const ss = med3(() => time(strSingle)), ts = med3(() => time(tomSingle));
        out.multiProperty = { hzString: Math.round(sm), hzTypedOM: Math.round(tm), tomOverString: +(tm / sm).toFixed(2) };
        out.singleProperty = { hzString: Math.round(ss), hzTypedOM: Math.round(ts), tomOverString: +(ts / ss).toFixed(2) };
    }
    return out;
};

const browser = await chromium.launch();
try {
    const page = await browser.newPage();
    await page.goto("about:blank");
    const r = await page.evaluate(page_fn);
    const verdict = !r.supportsTOM ? "NO TYPED-OM in this build" :
        (r.multiProperty.tomOverString >= 1.2 && r.singleProperty.tomOverString >= 1.0)
            ? "ADOPT-able (TOM wins multi ≥1.2x AND single ≥parity) — but weigh the permanent dual-path (no Firefox)"
            : "KILL the dual-path (TOM does NOT clear the bar — the string path is fine; ship the _styleOut out-buffer alloc-cure alone)";
    console.log(JSON.stringify({
        $comment: "Typed-OM (StylePropertyMap.set) vs string setProperty write cost, real Chromium. The permanent dual-path is only justified if TOM clearly wins on the multi-property shape AND does not regress single-property.",
        browser: "chromium (playwright-core 1.60.0)", ...r, verdict,
    }, null, 2));
} finally { await browser.close(); }
