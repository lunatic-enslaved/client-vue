<template>
  <RouterLink
    :to="props.to"
    :class="
      typeof props.className === 'function'
        ? props.className(isActive)
        : props.className
    "
  >
    <slot :isActive="isActive"></slot>
  </RouterLink>
</template>

<script lang="ts">
export default { name: 'StyledRouterLink' };
</script>

<script setup lang="ts">
import { computed, type PropType, type AllowedComponentProps } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import type { RouterLinkProps } from 'vue-router';

const props = defineProps({
  to: {
    type: [Object, String] as PropType<RouterLinkProps['to']>,
    required: true
  },
  className: {
    type: [Function] as PropType<
      (isActive: boolean) => AllowedComponentProps['class']
    >,
    default: null
  }
});

const route = useRoute();

const isActive = computed(() => route.fullPath === props.to);
</script>
