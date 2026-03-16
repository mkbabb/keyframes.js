<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'reka-ui'
import { SelectRoot, useForwardPropsEmits } from 'reka-ui'
import { inject } from 'vue'

const props = defineProps<SelectRootProps>()
const emits = defineEmits<SelectRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

// When inside a GlassDock slot, auto-hold the dock open while the dropdown is visible.
// inject resolves from the component tree — Select rendered in a GlassDock slot
// is a descendant of GlassDock, so the provide is reachable.
const dockKeepOpen = inject<(() => void) | null>("dockKeepOpen", null)
const dockRelease = inject<(() => void) | null>("dockRelease", null)

function onOpenChange(open: boolean) {
    if (open) dockKeepOpen?.()
    else dockRelease?.()
}
</script>

<template>
  <SelectRoot v-bind="forwarded" @update:open="onOpenChange">
    <slot />
  </SelectRoot>
</template>
