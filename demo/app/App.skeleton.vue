<script setup lang="ts">
/**
 * SceneSkeleton — the app shell's `<Suspense>` fallback.
 *
 * KF-SKEL-14, the docblock rewritten to the tree's truth: the two claims this
 * file kept asserting against its own repository are struck. It is NOT "THE
 * shared" placeholder — it has exactly ONE consumer, `App.vue`'s scene-host
 * `<Suspense>` (`git grep SceneSkeleton -- demo/` → the import + that one
 * mount), and calling it "shared" made a one-site component read as a tier
 * contract; and it belongs to no "skeletons tier", which `969990f6` deleted
 * outright, so the tier citation named a structure no reader could resolve.
 * What survives from T.F8 is the STRUCTURAL contract alone, and it is stated
 * without the dead ids: the fallback is a COMPONENT — the scene's stage plate
 * with a sheen inside it, shown while a lazy scene's async chunk (or its Monaco
 * pane) resolves — never the bare `<span>Loading scene…</span>` text-flash it
 * replaced, and never a stage-gating icon-spinner.
 *
 * The STRUCTURAL contract is what T.F8 pins (fallback ≠ bare text, no
 * stage-gating icon-spinner). The VISUAL treatment is now DELEGATED (S-6,
 * W6-I — the CURE INVERSION, KF-SKEL-6): the plate is the demo's own
 * STAGE-CARD register — `<Card :shadow="false">`, the SAME plate the square,
 * amiga, spring and easing scenes stand on (SquareScene.vue:3-13), so the
 * swap-time silhouette (radius `rounded-card`, border, material) is the scene's
 * by construction and not a second hand-painted echo of it — and the sheen is
 * the producer's `Skeleton`, primitive-as-sheen only, never the bare primitive
 * as the plate (the bare `Skeleton` paints `--radius-input`, no border, no
 * elevation: every "bare Skeleton" cure INCREASED the discontinuity). The
 * former reimplementation (KF-SKEL-3) is gone with its five missing arms,
 * which now arrive with the delegation, each verified at the installed 7.0.0
 * bytes (`dist/glass-ui.css`, `.skeleton[data-v-cd03d0b0]`): a COMPOSITABLE
 * `transform` sweep under `prefers-reduced-motion: no-preference` (opt-in
 * polarity; KF-SKEL-10's paint-only `background-position` sweep and its
 * PRM-surviving `will-change` are deleted, not re-armed) on the house
 * `--duration-shimmer` clock (KF-SKEL-11's hard-coded 1.6s is gone) ·
 * `prefers-reduced-transparency: reduce` · `forced-colors: active`
 * (KF-SKEL-12 — both arms the demo had nowhere).
 *
 * GEOMETRY (KF-SKEL-8 + KF-SKEL-18): the plate FILLS the stage box it stands
 * in — the same `h-full w-full` the scene plates carry — inside a gutter that
 * reads the CONTAINER (`cqi`, the macro grid's `container-type: inline-size`
 * idiom, AnimationControlsGroup.css), never the viewport. The `42rem × 24rem`
 * literals that under-filled both layout forks are deleted; nothing here reads
 * `vw`.
 *
 * RADIUS (KF-SKEL-4, the CONSTRAINT): no radius is computed or declared in this
 * file. The Card's `rounded-card` resolves to whatever `--radius-card` is at
 * the producer, detuned or not — the spec pins intended-vs-shipped and the
 * producer half is G-W6-14's; this file must not cure against the detuned
 * values and does not.
 *
 * `Skeleton` is root-barrel-only at 7.0.0 (73 subpaths, no `./skeleton`) —
 * the root import is the ONLY door; `Card` takes its subpath.
 *
 * A11Y (KF-SKEL-1): this subtree is now WHOLLY DECORATIVE and says so with one
 * `aria-hidden` at its root. The former `role="status" aria-busy="true"
 * :aria-label` on that same root was inert three ways at once and each way is
 * cured by moving the announcement OUT rather than by writing more attributes
 * into a node that cannot hold them: the region was BORN INSIDE the suspension
 * and died with it, so no announcement window ever existed (which is why the
 * corpus's "smallest cure" of putting text in the region was ruled
 * insufficient); `aria-busy="true"` was a static literal that could never clear,
 * because resolve DESTROYS the node rather than updating it; and the region's
 * only content was an `aria-hidden` plate, i.e. nothing to speak. The live
 * region now lives in `EditorShell` — mounted once for the app's life, ABOVE
 * `.scene-host` — and this component writes two lines into it across its own
 * lifetime: "Loading scene" when it appears, "Scene ready" when `<Suspense>`
 * resolves and takes it away. `inject` is optional by the key's own contract, so
 * a host that mounts this without the shell degrades to silence, never a throw.
 *
 * KF-SKEL-13, both limbs, spent in the same motion because the row's disposition
 * ties them to this cure: the `label` prop is GONE — it was dead API (no call
 * site ever passed it; the sole mount is a bare `<SceneSkeleton />`) and, with
 * the region it fed proven unspeakable, it could not have been heard if passed;
 * and with the last prop gone the defaults-wrapper macro that stood around
 * `defineProps` — the legacy form `DESIGN.md §9.2` rules out of house grammar
 * (fine as Vue, wrong here) — leaves with it rather than being migrated to a
 * reactive-destructure default it no longer needs. (The macro is named by its
 * house rule, not spelled, so a sweep for the retired form measures live
 * declarations and not this record of one that is gone.)
 */
import { onMounted, onUnmounted, inject } from "vue";
import { Skeleton } from "@mkbabb/glass-ui";
import { Card } from "@mkbabb/glass-ui/card";
import { SCENE_ANNOUNCER_KEY } from "@components/instrument/shell/EditorShell.vue";

// The component's name is the one this file's docblock and its sole mount
// (`App.vue`) call it; the `App.skeleton` filename is a sibling-of-App
// convention, not a name, and would otherwise be inferred as one.
defineOptions({ name: "SceneSkeleton" });

const announce = inject(SCENE_ANNOUNCER_KEY, null);

onMounted(() => announce?.("Loading scene"));
onUnmounted(() => announce?.("Scene ready"));
</script>

<template>
    <div class="scene-skeleton" aria-hidden="true">
        <Card :shadow="false" class="scene-skeleton__plate h-full w-full">
            <Skeleton class="scene-skeleton__sheen" />
        </Card>
    </div>
</template>

<style scoped>
.scene-skeleton {
    display: grid;
    width: 100%;
    height: 100%;
    padding: clamp(1rem, 4cqi, 3rem);
}

.scene-skeleton__plate {
    position: relative;
    overflow: hidden;
}

/* The sheen fills the plate and takes the plate's corner — the primitive's own
   `--radius-input` corner is for a text-line skeleton, not a stage. The
   descendant form outranks the primitive's single-class scoped rule. */
.scene-skeleton__plate > .scene-skeleton__sheen {
    position: absolute;
    inset: 0;
    border-radius: inherit;
}
</style>
