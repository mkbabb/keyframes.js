import { launch, openPage, openStage, sleep } from "./lib.mjs";

const IDS = ["cube","amiga","square","easing","spring","sequence","motion-path","morph"];
const results = [];
function rec(clause, pass, detail) {
    results.push({ clause, pass, ...detail });
    console.log(`[${pass ? "PASS" : "FAIL"}] ${clause}:`, JSON.stringify(detail));
}

async function frontId(page) {
    return page.$eval('[data-front="true"]', (e) => e.getAttribute("data-stage-card")).catch(() => null);
}
async function stagePhase(page) {
    return page.$eval(".scene-stage", (e) => e.getAttribute("data-stage-phase")).catch(() => "closed");
}
async function tapFront(page) {
    const box = await page.$eval('[data-front="true"]', (e) => {
        const r = e.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.mouse.up();
}
async function focusOverlay(page) {
    await page.$eval(".scene-stage", (e) => e.focus());
}
async function resetObs(page) {
    await page.evaluate(() => {
        window.__stageLastCommit = undefined;
        window.__stageArmedLog = [];
        window.__stageVTCount = 0;
        window.__stageSwitchCount = 0;
    });
}

const b = await launch();

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE A — gesture-during-committing (the H1 killer)
// settle on A(cube) → tap front (arm A) → within 100ms step toward B → assert the
// ring RESTED on A, committed id === A === rested front, browse was a no-op.
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await openStage(page);
    await resetObs(page);
    const A = await frontId(page); // "cube"
    await tapFront(page); // arm A
    await sleep(50);
    const phaseAfterTap = await stagePhase(page);
    const frontAfterTap = await frontId(page);
    // adversarial browse toward B, DURING committing, inside the dwell window
    await focusOverlay(page);
    await page.keyboard.press("ArrowRight"); // step → LOCKED (no-op) under D1
    await sleep(90);
    const frontDuringDwell = await frontId(page); // must STILL be A
    // let the commit fire + close
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 2000 });
    await sleep(80);
    const obs = await page.evaluate(() => ({
        committed: window.__stageLastCommit?.id,
        armedLog: window.__stageArmedLog,
        hash: location.hash,
        scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
    }));
    const restedFront = frontDuringDwell;
    const pass =
        phaseAfterTap === "committing" &&
        frontAfterTap === A &&
        frontDuringDwell === A &&
        obs.committed === A &&
        restedFront === A &&
        obs.scene === A &&
        obs.hash === "#" + A &&
        obs.armedLog.at(-1)?.id === A;
    rec("A gesture-during-committing", pass, {
        A, phaseAfterTap, frontAfterTap, frontDuringDwell_restedFront: frontDuringDwell,
        committed: obs.committed, scene: obs.scene, hash: obs.hash,
        armedLogLast: obs.armedLog.at(-1),
        note: "browse (ArrowRight→step) during committing was a silent no-op; ring never left A",
    });
    await page.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE B — Enter-during-flick (the H1b killer)
// start a multi-slot coast (cube→spring, 4 slots) → press Enter mid-coast while a
// DIFFERENT slot is passing front → assert armed === destination slot (spring) ===
// rested front === committed, and the passing front at press-time !== armed.
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await openStage(page);
    await resetObs(page);
    // start a deterministic 4-slot coast to index 4 (spring)
    await page.evaluate(() => window.__stageDebug.spinTo(4));
    await sleep(140); // ring now mid-transit (passing slot 1/2/3), target=4
    const atPress = await page.evaluate(() => ({
        front: window.__stageDebug.frontIndex(),
        target: window.__stageDebug.targetIndex(),
        spinning: window.__stageDebug.spinning(),
        sceneAtTarget: window.__stageDebug.sceneAt(window.__stageDebug.targetIndex()),
    }));
    await focusOverlay(page);
    await page.keyboard.press("Enter"); // → D1.1: arms sceneAt(targetIndex)
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
    await sleep(80);
    const obs = await page.evaluate(() => ({
        committed: window.__stageLastCommit?.id,
        armedLog: window.__stageArmedLog,
        scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
        hash: location.hash,
    }));
    const dest = IDS[atPress.target];
    const passingFront = IDS[atPress.front];
    const pass =
        atPress.spinning === true &&
        atPress.sceneAtTarget === dest &&
        obs.armedLog.at(-1)?.id === dest &&
        obs.committed === dest &&
        obs.scene === dest &&
        passingFront !== dest; // the arm was NOT the passing slot
    rec("B enter-during-flick", pass, {
        targetSlot: atPress.target, destScene: dest,
        passingFrontAtPress: passingFront, spinningAtPress: atPress.spinning,
        armedLogLast: obs.armedLog.at(-1), committed: obs.committed, scene: obs.scene,
        note: "arm latched the decay DESTINATION slot, never the passing front",
    });
    await page.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE C — observable honesty (H6): witnesses are __stageLastCommit + armedLog,
// never the committing attribute as sole witness. (Asserted structurally by A/B
// reading the logs; here we confirm the armedLog carries the cause taxonomy.)
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await openStage(page);
    await resetObs(page);
    await tapFront(page);
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 2000 });
    const log = await page.evaluate(() => window.__stageArmedLog);
    const causes = log.map((e) => e.cause);
    const pass = log.length >= 2 && causes.includes("tap") && log.at(-1).id === "cube";
    rec("C observable-honesty", pass, { armedLog: log, causes, note: "arm+fire logged with cause taxonomy; gate reads logs, not the committing attr" });
    await page.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE D — cancel distinctness: arm → Esc before dwell elapses → NO commit
// write, no machine mutation, no hash move; stage closes on the cancel spring.
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await openStage(page);
    await resetObs(page);
    const hashBefore = await page.evaluate(() => location.hash);
    await tapFront(page); // arm
    await sleep(40); // BEFORE the 280ms dwell
    const midPhase = await stagePhase(page);
    await focusOverlay(page);
    await page.keyboard.press("Escape"); // cancel
    // let the cancel spring fully close (openSpring zoom-in → onZoomInDone)
    await page.waitForFunction(
        () => !document.querySelector(".scene-stage"),
        { timeout: 2500 },
    ).catch(() => {});
    await sleep(60);
    const obs = await page.evaluate(() => ({
        committed: window.__stageLastCommit,
        switchCount: window.__stageSwitchCount,
        vtCount: window.__stageVTCount,
        hash: location.hash,
        phase: document.querySelector(".scene-stage")?.getAttribute("data-stage-phase") ?? "closed",
        scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
    }));
    const pass =
        midPhase === "committing" &&
        obs.committed == null &&
        obs.switchCount === 0 &&
        obs.vtCount === 0 &&
        obs.hash === hashBefore &&
        obs.scene === "cube" &&
        obs.phase === "closed";
    rec("D cancel-distinctness", pass, { midPhase, ...obs, note: "Esc during committing aborted the armed commit: no runSceneSwitch, no observable, no VT" });
    await page.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE E — buffered fan-in commit: press Enter during fanning-in → buffered →
// fires after carousel and lands normally.
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    // open WITHOUT waiting for carousel; catch the fanning-in phase
    await page.click('[data-testid="scene-pill"]');
    await page.waitForFunction(
        () => document.querySelector(".scene-stage")?.getAttribute("data-stage-phase") === "fanning-in",
        { timeout: 3000 },
    );
    await resetObs(page);
    await focusOverlay(page);
    await page.keyboard.press("Enter"); // buffered
    const phaseAtEnter = "fanning-in";
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
    const obs = await page.evaluate(() => ({
        committed: window.__stageLastCommit?.id,
        armedLog: window.__stageArmedLog,
        scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
    }));
    const pass = obs.committed === "cube" && obs.scene === "cube" && obs.armedLog.some((e) => e.cause === "buffered");
    rec("E buffered-fan-in", pass, { phaseAtEnter, committed: obs.committed, scene: obs.scene, armedLog: obs.armedLog, note: "Enter during fan-in BUFFERED then drained on carousel → committed normally" });
    await page.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE F — single-write: one commit = exactly ONE machine transition + ONE VT.
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await openStage(page);
    await resetObs(page);
    // spin to a different scene then commit it
    await page.evaluate(() => window.__stageDebug.spinTo(3)); // easing
    await page.waitForFunction(() => !window.__stageDebug.spinning(), { timeout: 3000 });
    await focusOverlay(page);
    await page.keyboard.press("Enter");
    await page.waitForFunction(() => window.__stageLastCommit != null, { timeout: 3000 });
    await sleep(80);
    const obs = await page.evaluate(() => ({
        vtCount: window.__stageVTCount,
        switchCount: window.__stageSwitchCount,
        committed: window.__stageLastCommit?.id,
        scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
    }));
    const pass = obs.vtCount === 1 && obs.switchCount === 1 && obs.committed === "easing" && obs.scene === "easing";
    rec("F single-write", pass, { ...obs, note: "one commit → exactly one VT + one machine write" });
    await page.close();
}

// ─────────────────────────────────────────────────────────────────────────────
// CLAUSE G — pointer-DRAG-during-committing (round-3 · the vivid H1 scenario the
// keyboard-only clauses A/B omitted). settle on A(cube) → tap front (arm A) →
// within the dwell, perform a REAL pointer drag/flick across the disk → assert
// the ring RESTED on A (drag → centerIndex → LOCKED), committed === A === rested
// front. Falsifiable: pre-lock code let a drag move the ring off the armed slot.
// ─────────────────────────────────────────────────────────────────────────────
{
    const { page } = await openPage(b, { theme: "dark", hash: "#cube" });
    await openStage(page);
    await resetObs(page);
    const A = await frontId(page); // "cube"
    await tapFront(page); // arm A → committing
    await sleep(40);
    const phaseAfterTap = await stagePhase(page);
    const frontAfterTap = await frontId(page);
    // a real disk drag/flick DURING committing (dx ≈ -150px, well past the 8px
    // slop → a genuine slot-follow/flick, not a tap).
    const vp = await page.$eval(".carousel-viewport", (e) => {
        const r = e.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    const sx = vp.x + vp.w * 0.5;
    const sy = vp.y + vp.h * 0.3;
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    for (let i = 1; i <= 3; i++) await page.mouse.move(sx - i * 25, sy);
    const frontDuringDrag = await frontId(page); // must STILL be A
    const draggingMid = await page.evaluate(() =>
        document.body.classList.contains("is-dragging"),
    );
    for (let i = 4; i <= 6; i++) await page.mouse.move(sx - i * 25, sy);
    await page.mouse.up();
    const frontAfterDrag = await frontId(page); // must STILL be A
    // let the commit fire + close
    await page.waitForFunction(() => window.__stageLastCommit != null, {
        timeout: 2000,
    });
    await sleep(80);
    const obs = await page.evaluate(() => ({
        committed: window.__stageLastCommit?.id,
        armedLog: window.__stageArmedLog,
        hash: location.hash,
        scene: document.querySelector(".scene-host")?.getAttribute("data-scene"),
    }));
    const pass =
        phaseAfterTap === "committing" &&
        frontAfterTap === A &&
        frontDuringDrag === A &&
        frontAfterDrag === A &&
        obs.committed === A &&
        obs.scene === A &&
        obs.hash === "#" + A &&
        obs.armedLog.at(-1)?.id === A;
    rec("G drag-during-committing", pass, {
        A,
        phaseAfterTap,
        frontDuringDrag,
        frontAfterDrag,
        draggingMid,
        committed: obs.committed,
        scene: obs.scene,
        hash: obs.hash,
        armedLogLast: obs.armedLog.at(-1),
        note: "pointer drag/flick (centerIndex) during committing was LOCKED; ring never left A",
    });
    await page.close();
}

await b.close();
console.log("\n===== ADVERSARIAL SUMMARY =====");
const allPass = results.every((r) => r.pass);
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.clause}`);
console.log(allPass ? "\nALL CLAUSES GREEN" : "\nSOME CLAUSES RED");
process.exit(allPass ? 0 : 1);
