<template>
    <!-- DockTrigger owns pointerdown actuation. The controlled open model exists
         only to hold ChromeDock expanded while this menu is open. -->
    <DropdownMenu v-model:open="open">
        <!-- MM-29 (site 1 of 2) — `normal-case` cancels `text-transform` and
             NOTHING else: `text-mono-caption` also binds
             `letter-spacing: var(--type-tracking-caps)` (0.1em), which rides on
             regardless, so a lowercase handle shipped with CAPS tracking. The
             pair is mandatory (G-W6-8 binds this wave and KF.W7 identically).
             The responsive rung pair stays exactly as authored — `lg:` swaps to
             `text-mono-small`, which carries no transform and no caps tracking
             at all — because collapsing it would decide a dock-band magnitude,
             and magnitudes are KF.W9's. -->
        <DockTrigger for="dropdown" aria-label="@mbabb menu" class="text-mono-caption normal-case tracking-normal lg:text-mono-small" data-register="code">@mbabb</DockTrigger>
        <!-- MM-15 — `z-popover`, not `z-modal`. The dock menu is a popover and
             the demo's own written z-contract reserves `--z-modal` (140) for
             modal dialogs. The wrong rung was INERT and therefore invisible:
             the producer's unlayered `z-index: var(--z-popover)` outranked the
             layered utility, so both portalled siblings (this menu and the
             Share popover) sat at 130 and DOM order decided. The moment glass
             layers its sheet (MM-4, relayed as O-26 R-1) the utility ARMS — and
             `z-modal` would then occlude the Share popover. Corrected BEFORE the
             producer fix lands, which is exactly why it rides this motion. -->
        <DropdownMenuContent align="end" :side-offset="8" class="z-popover min-w-[var(--dock-panel-width)] text-body p-1.5">
            <!-- Share.
                 MM-8 + MM-9, the one voice pass, applied at all FOUR of its
                 sites (here, the Clear-all sub-line, and the two @mbabb lines).
                 `text-admin-label` is a 10px ALL-CAPS MONO chip register —
                 `font-family: var(--font-mono)`, `text-transform: uppercase`,
                 `letter-spacing: var(--type-tracking-caps)`, `line-height: 1` —
                 and it was carrying four sentence-case English sentences. That
                 is MM-8 (wrong register for prose) and MM-9 (the T.D4 mono
                 contract: none of these leaves is a `monoAllowedSelectors`
                 entry) in one place. `text-micro` is the rung the bank names as
                 sitting unused one step up: 11px, the inherited TEXT face, no
                 transform, no caps tracking. The mono register survives at the
                 one leaf that earns it — the bare URL below. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                <SharePopover :on-scene-restore="onSceneRestore" />
                <div class="flex-1 min-w-0">
                    <span class="text-small text-foreground">Share</span>
                    <p class="text-micro text-muted-foreground leading-tight">Copy link or load shared state</p>
                </div>
            </DropdownMenuItem>

            <!-- DarkModeToggle is the sole theme command. The menu row carries
                 layout only; there is no second row-level actuation.
                 EH-4 (second spend site of ONE row) — no `title`: the producer
                 strips only `class`/`type` and spreads everything else onto the
                 same <button> as its own state-aware `aria-label`, so a visible
                 "Toggle dark mode" diverges from the accessible name (WCAG
                 2.5.3). The adjacent "Dark mode" span is the row's visible
                 label and names the command already. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                <DarkModeToggle
                    class="aspect-square w-5"
                />
                <span class="text-small text-foreground">Dark mode</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- ppmycota logo — toggles pp mode.
                 MM-4 INTERIM, AND IT IS LABELLED AS ONE. glass-ui emits
                 `.dropdown-menu__item` OUTSIDE its single `@layer components`
                 block (byte 29523 against the block's 2531–18827), and an
                 unlayered rule beats a layered one whatever the source order —
                 so `cursor-pointer` on a row that has an `@click` never paints
                 and the row reads as inert. The DURABLE fix is the producer's
                 (wrap `dropdown-menu/styles.css` + the `_shared/menu.css` tail
                 in `layer(components)`; sent as O-26 R-1 BEFORE this interim was
                 written, per §Sequencing 7). Until it lands, the paint is
                 declared inline — the file's OWN idiom for portalled content,
                 documented five lines below for the brand colour — because an
                 inline declaration outranks any stylesheet rule on either side
                 of the layer question and needs no `:deep` (banned) and no
                 global block. When the producer sheet is layered the class
                 takes over and the `:style` comes out; the class is kept
                 alongside precisely so that removal is the whole migration.
                 MM-44: this file is the demo's ONLY DropdownMenu consumer, so
                 the interim's blast radius is this component. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" :style="{ cursor: 'pointer' }" @click="togglePpMode">
                <div class="ppmycota-logo-sm w-7 h-7 shrink-0 scale-on-hover"></div>
                <div class="flex-1 min-w-0">
                    <!-- Brand colour consumes the --ppmycota-primary token
                         directly through an inline style, not an arbitrary-value
                         utility: the dropdown content is portalled, so an
                         inline style is the portal-safe home for the token
                         ref while it co-locates with the brand mark (S2).

                         MM-12, RECORDED HERE AND CURED NOWHERE IN THIS WAVE
                         (bounds, not oversight). This label follows the theme —
                         `--ppmycota-primary` is `--accent-kf`, a `light-dark()`
                         pair — while the MARK beside it is repainted by
                         `--filter-brand-color`, a single static filter chain
                         (`brand.css:30` reads it; `style.css:178` declares it)
                         with NO `.dark` arm: `.dark` re-declares only
                         `--accent-red`, `--accent-red-foreground` and
                         `--primary`. So mark and label diverge in dark mode BY
                         CONSTRUCTION. The two lawful cures both live outside
                         every writable set in this wave's plan — a `.dark`
                         `--filter-brand-color` arm in `style.css`, or a
                         mask/inline-SVG mark on `currentColor` in `brand.css` —
                         and inventing a filter chain at this call site would be
                         a third, worse dialect. Declared, never silently
                         dropped; perceptual magnitude is SS-13's. -->
                    <span class="text-small" :style="{ color: 'var(--ppmycota-primary)' }">ppmycota</span>
                    <!-- MM-8's ONE DEFENSIBLE `text-admin-label`: a bare URL is
                         an artifact string, not prose, so the mono register is
                         correct here and stays. -->
                    <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors" @click.stop>ppmycota.com</a>
                </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- T.C2 — Clear all & reload (relocated from the transport dock: a
                 destructive storage reset is a settings action). Confirm-guarded.

                 MM-30 — the row reached for the WRONG RED. `text-destructive` is
                 the VENDOR's `--destructive`, while this repo's own law
                 (style.css:114-119, which names Clear-all by name) assigns
                 `--accent-red` to destructive surfaces — and `--accent-red`
                 alone carries a bespoke `.dark` arm (style.css:187) and a
                 Tailwind bridge (`--color-accent-red`, style.css:58). Note the
                 order this matters in: curing MM-4's layer FIRST would have
                 armed the class and painted the vendor's red, so the token
                 correction has to land with it, not after it.

                 The `:style` half is the same MM-4 interim as the row above,
                 and for the same measured reason: `text-accent-red` cannot
                 paint while `.dropdown-menu__item`'s unlayered `color` outranks
                 it. Class and inline say the SAME thing, so when the producer
                 sheet is layered the inline pair comes out and nothing else
                 changes. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer text-accent-red" :style="{ cursor: 'pointer', color: 'var(--accent-red)' }" @click="clearAllAndReload">
                <Trash class="w-5 h-5 shrink-0" />
                <div class="flex-1 min-w-0">
                    <span class="text-small">Clear all &amp; reload</span>
                    <p class="text-micro text-muted-foreground leading-tight">Reset every saved animation to defaults</p>
                </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- @mbabb -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1">
                <Avatar decorative class="w-7 h-7">
                    <AvatarImage
                        src="https://avatars.githubusercontent.com/u/2848617?v=4"
                    ></AvatarImage>
                </Avatar>
                <div class="flex-1 min-w-0">
                    <!-- MM-31 (+ MM-29 site 2, cured STRUCTURALLY rather than
                         patched). This title was simultaneously the SMALLEST
                         string in the menu (`text-mono-caption`, the caption
                         rung) and its only bold one — the person the menu is
                         named after read below "Share" and "Clear all & reload",
                         a typographic inversion no axis had measured. It now
                         takes its siblings' rung: `text-mono-small` is
                         `--type-small`, the same size token the sibling row
                         titles' `text-small` reads, and mono is correct because
                         `@mbabb` is an identifier (`data-register="code"`,
                         case-significant). The bold goes with the inversion —
                         no row title now outweighs another, and `text-foreground`
                         against the muted lines below is what marks it. MM-29
                         needs no pairing HERE because `text-mono-small` applies
                         neither `text-transform: uppercase` nor
                         `--type-tracking-caps`: the `normal-case` that used to
                         sit here existed only to cancel the caption rung's
                         transform, and the right rung never had one. -->
                    <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="text-mono-small text-foreground hover:underline" data-register="code">@mbabb</a>
                    <p class="text-micro text-muted-foreground leading-tight">CSS keyframe animation engine</p>
                    <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="text-micro text-muted-foreground hover:text-foreground hover:underline transition-colors">View the project on Github &#x1F389;</a>
                </div>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
// ─────────────────────────────────────────────────────────────────────────────
// MbabbMenu — the @mbabb dock dropdown (S.D1 · a23 F2 extraction from App.vue).
//
// This is DOCK CHROME: App.vue mounts it in ChromeDock's #items slot and binds
// `v-model:open` back to ChromeDock's `:items-popup-open`, so the dock stays
// expanded while the menu is open.
// ─────────────────────────────────────────────────────────────────────────────
import { SharePopover } from "@components/instrument/shell";
import { Avatar, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@mkbabb/glass-ui";
import { DarkModeToggle } from "@mkbabb/glass-ui/dark-mode-toggle";
import { DockTrigger } from "@mkbabb/glass-ui/dock";
import { Trash } from "@lucide/vue";
import { getStoredAnimationGroupControlOptions, resetAllStores } from "@state";
const props = defineProps<{
    // The active superKey — the ppMode store is keyed by it (per-scene brand flag).
    superKey: string;
    // Scene restore from a shared URL (passed straight to SharePopover). The shell
    // owns the real switch (runSceneSwitch); the menu only forwards the id.
    onSceneRestore: (id: string) => void;
}>();

// The dock-hold model directly mirrors the controlled menu state.
const open = defineModel<boolean>("open", { default: false });

function togglePpMode() {
    const stored = getStoredAnimationGroupControlOptions(props.superKey);
    stored.value.ppMode = !(stored.value.ppMode ?? false);
}

// T.C2 — "Clear all & reload" RELOCATED from the transport dock into the @mbabb
// settings menu (a destructive storage reset is a settings action, not transport
// chrome; VERDICT #6 — the transport carried the destructive Clear beside Play).
// Confirm-guarded: resetAllStores() wipes every persisted store (control options,
// the scene-machine persist key) and the reload re-seeds from the cleared state.
function clearAllAndReload() {
    if (
        typeof window !== "undefined" &&
        !window.confirm(
            "Clear all saved animation state and reload? This cannot be undone.",
        )
    ) {
        return;
    }
    resetAllStores();
    window.location.reload();
}

</script>
