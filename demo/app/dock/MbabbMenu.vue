<template>
    <!-- DockTrigger owns pointerdown actuation. The controlled open model exists
         only to hold ChromeDock expanded while this menu is open. -->
    <DropdownMenu v-model:open="open">
        <DockTrigger for="dropdown" aria-label="@mbabb menu" class="text-mono-caption normal-case lg:text-mono-small" data-register="code">@mbabb</DockTrigger>
        <DropdownMenuContent align="end" :side-offset="8" class="z-modal min-w-[var(--dock-panel-width)] text-body p-1.5">
            <!-- Share -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                <SharePopover :on-scene-restore="onSceneRestore" />
                <div class="flex-1 min-w-0">
                    <span class="text-small text-foreground">Share</span>
                    <p class="text-admin-label text-muted-foreground leading-tight">Copy link or load shared state</p>
                </div>
            </DropdownMenuItem>

            <!-- DarkModeToggle is the sole theme command. The menu row carries
                 layout only; there is no second row-level actuation. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg">
                <DarkModeToggle
                    title="Toggle dark mode"
                    class="aspect-square w-5"
                />
                <span class="text-small text-foreground">Dark mode</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- ppmycota logo — toggles pp mode -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer" @click="togglePpMode">
                <div class="ppmycota-logo-sm w-7 h-7 shrink-0 scale-on-hover"></div>
                <div class="flex-1 min-w-0">
                    <!-- Brand colour consumes the --ppmycota-primary token
                         directly through an inline style, not an arbitrary-value
                         utility: the dropdown content is portalled, so an
                         inline style is the portal-safe home for the token
                         ref while it co-locates with the brand mark (S2). -->
                    <span class="text-small" :style="{ color: 'var(--ppmycota-primary)' }">ppmycota</span>
                    <a href="https://ppmycota.com" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors" @click.stop>ppmycota.com</a>
                </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <!-- T.C2 — Clear all & reload (relocated from the transport dock: a
                 destructive storage reset is a settings action). Confirm-guarded. -->
            <DropdownMenuItem @select.prevent class="flex items-center gap-2.5 px-1.5 py-1 rounded-lg cursor-pointer text-destructive" @click="clearAllAndReload">
                <Trash class="w-5 h-5 shrink-0" />
                <div class="flex-1 min-w-0">
                    <span class="text-small">Clear all &amp; reload</span>
                    <p class="text-admin-label text-muted-foreground leading-tight">Reset every saved animation to defaults</p>
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
                    <a href="https://github.com/mkbabb" target="_blank" rel="noopener noreferrer" class="text-mono-caption normal-case font-semibold text-foreground hover:underline" data-register="code">@mbabb</a>
                    <p class="text-admin-label text-muted-foreground leading-tight">CSS keyframe animation engine</p>
                    <a href="https://github.com/mkbabb/keyframes.js" target="_blank" rel="noopener noreferrer" class="text-admin-label text-muted-foreground hover:text-foreground hover:underline transition-colors">View the project on Github &#x1F389;</a>
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
