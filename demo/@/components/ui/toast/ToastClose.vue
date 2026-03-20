<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { ToastClose, type ToastCloseProps } from 'reka-ui'
import { X } from 'lucide-vue-next'
import { cn } from '@utils/utils'

const props = defineProps<ToastCloseProps & {
  class?: HTMLAttributes['class']
}>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <ToastClose v-bind="delegatedProps" :class="cn('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus-visible:shadow-[0_0_0_2px_hsl(var(--ring)/0.4)] group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50', props.class)">
    <X class="h-4 w-4" />
  </ToastClose>
</template>
