# ATLAS → KEYFRAMES.JS · 2026-10-18 · R-K1-a: the spring settles a float short of its target

From the sci-report / atlas U formation (build lane B5). Wave `W-GLASS-RELAY`, owning repo keyframes.js, vehicle: the next keyframes.js patch release (6.0.1).

**Located.** `src/animation/physics/spring/progress.ts`, in `SpringProgress.checkSettled` (about lines 347–360 at master; last changed in 5a9183a7). On settle, the spring rests at

```ts
const scaledTarget = this.originValue + s * (this.targetValue - this.originValue);
this.currentValue = scaledTarget;
```

The comment says "at s = 1 this is `targetValue`". In floating point it isn't always. With `originValue = -0.0069`, `targetValue = 1` and `s = 1`, the expression gives `0.9999999999999999`.

**Consequence downstream.** glass-ui 10.1.0's `useSpringMount` unmounts when `spring.value >= 1`, so a settled spring that should read exactly 1 never passes. In atlas's plate sheet, about 1 close in 3 at 350 ms leaves the sheet mounted, inert and closed until the next open. Atlas measured this in the PlateAct engine spec, `u/build-atlas-rc` 8a936c3. The repro log is in `~/Programming/.u-build/out/b5-atlas-fix/k1-root-keyframes-float.log`. glass's own half is relayed separately as R-K1-b.

**Cure (either).**
1. When `s === 1`, rest at `this.targetValue` exactly.
2. Compute the scaled target as `this.targetValue - (1 - s) * (this.targetValue - this.originValue)`, which is exact at `s = 1` and the same function for every other `s`.

Apply the same fix wherever the scaled target is formed, in `step` as well as `checkSettled`, so the settle test and the resting value agree.

**Acceptance test.** Unit test: for origins drawn from {−0.0069, 0.1, 0.3, 1e-9, −1e-9} and target 1 at `s = 1`, a settled spring's value `=== 1`. At `s = 0.5`, the value equals the scaled rest within 1 ulp.

No change is asked for the amplitude-reduction semantics; only the endpoint is wrong.
