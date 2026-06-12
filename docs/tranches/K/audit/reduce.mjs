import fs from "node:fs";
const all = JSON.parse(
    fs.readFileSync(new URL("./font-census-raw.json", import.meta.url).pathname, "utf8"),
);
const dump = (filterLand) => {
    const seen = new Set();
    for (const [scene, leaves] of Object.entries(all)) {
        for (const l of leaves) {
            if (filterLand && l.land !== filterLand) continue;
            const k = l.land + "|" + l.cls + "|" + l.text;
            if (seen.has(k)) continue;
            seen.add(k);
            console.log(
                l.land.padEnd(14) +
                    l.voice.padEnd(26) +
                    l.size.padEnd(9) +
                    "w" +
                    l.weight +
                    "  <" +
                    l.tag +
                    ' class="' +
                    l.cls +
                    '"> "' +
                    l.text +
                    '"  [' +
                    scene +
                    "]",
            );
        }
    }
};
console.log("======== DOCK ========");
dump("DOCK");
console.log("\n======== HERO / start-screen ========");
dump("HERO");
console.log("\n======== BAR (menubar / ribbon) ========");
dump("BAR");
console.log("\n======== SPRING (panel voice) ========");
dump("SPRING");
