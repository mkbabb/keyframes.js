<script setup lang="ts">
import { inject, watch, ref } from 'vue'
import { DropdownMenuRoot, type DropdownMenuRootEmits, type DropdownMenuRootProps, useForwardPropsEmits } from 'reka-ui'

const props = defineProps<DropdownMenuRootProps>()
const emits = defineEmits<DropdownMenuRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

/**
 * Dock integration: when this dropdown lives inside a GlassDock, hold the
 * dock open while the dropdown content is visible. The content renders in a
 * Portal (outside the dock DOM), so hover alone can't keep the dock alive.
 */
const dockKeepOpen = inject<(() => void) | null>("dockKeepOpen", null)
const dockRelease = inject<(() => void) | null>("dockRelease", null)

const isOpen = ref(props.open ?? props.defaultOpen ?? false)

function onOpenChange(open: boolean) {
  isOpen.value = open
}

watch(isOpen, (open) => {
  if (open) {
    dockKeepOpen?.()
  } else {
    dockRelease?.()
  }
})
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded" @update:open="onOpenChange">
    <slot />
  </DropdownMenuRoot>
</template>
