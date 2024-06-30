<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@utils/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <h3
    :class="
      cn('text-4xl font-semibold leading-none tracking-tight fraunces', props.class)
    "
  >
    <slot />
  </h3>
</template>
