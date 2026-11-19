/**
 * How much of the screen the stage has: the largest rectangle that no fixed
 * chrome paints over (the docks, the controls sheet, their plates), as a share
 * of the viewport's height and area. Grounds that fill the whole viewport and
 * the stage's own cell are not chrome.
 */
export const freeStage = (page) =>
    page.evaluate(() => {
        const iw = innerWidth;
        const ih = innerHeight;
        const vis = (e) => {
            const cs = getComputedStyle(e);
            const b = e.getBoundingClientRect();
            return cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.01 && b.width > 1 && b.height > 1;
        };
        const paints = (e) => {
            const cs = getComputedStyle(e);
            return (
                !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) ||
                (cs.backdropFilter && cs.backdropFilter !== "none") ||
                cs.backgroundImage !== "none"
            );
        };
        const fixed = (e) => {
            for (let p = e; p && p !== document.body; p = p.parentElement) {
                if (getComputedStyle(p).position === "fixed") return true;
            }
            return false;
        };
        const stage = document.querySelector(".stage-cell");
        const boxes = [];
        for (const e of document.querySelectorAll("body *")) {
            if (stage?.contains(e) || !vis(e) || !paints(e) || !fixed(e)) continue;
            const b = e.getBoundingClientRect();
            if (b.width >= iw - 1 && b.height >= ih - 1) continue;
            if (b.right <= 0 || b.bottom <= 0 || b.left >= iw || b.top >= ih) continue;
            boxes.push(b);
        }
        // Raster at 2 px, then the largest empty rectangle (histogram method).
        const G = 2;
        const gw = Math.ceil(iw / G);
        const gh = Math.ceil(ih / G);
        const grid = new Uint8Array(gw * gh);
        for (const b of boxes) {
            const x0 = Math.max(0, Math.floor(b.left / G));
            const x1 = Math.min(gw, Math.ceil(b.right / G));
            const y0 = Math.max(0, Math.floor(b.top / G));
            const y1 = Math.min(gh, Math.ceil(b.bottom / G));
            for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) grid[y * gw + x] = 1;
        }
        const hist = new Int32Array(gw);
        let best = { a: 0, x: 0, y: 0, w: 0, h: 0 };
        for (let y = 0; y < gh; y++) {
            for (let x = 0; x < gw; x++) hist[x] = grid[y * gw + x] ? 0 : hist[x] + 1;
            const st = [];
            for (let x = 0; x <= gw; x++) {
                const hh = x < gw ? hist[x] : 0;
                while (st.length && hist[st[st.length - 1]] >= hh) {
                    const top = st.pop();
                    const left = st.length ? st[st.length - 1] + 1 : 0;
                    const a = hist[top] * (x - left);
                    if (a > best.a) best = { a, x: left * G, y: (y - hist[top] + 1) * G, w: (x - left) * G, h: hist[top] * G };
                }
                st.push(x);
            }
        }
        return {
            x: best.x,
            y: best.y,
            w: best.w,
            h: best.h,
            heightShare: best.h / ih,
            areaShare: (best.w * best.h) / (iw * ih),
        };
    });
