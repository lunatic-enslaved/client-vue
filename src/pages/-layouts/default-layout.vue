<template>
  <div class="flex flex-nowrap h-full w-full">
    <TheSidebar></TheSidebar>

    <div class="grow shrink flex flex-col">
      <TheNavbar @date-selected="emit('date-selected', $event)"></TheNavbar>

      <main class="grow shrink bg-gray-100">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TheSidebar } from '@/widgets/the-sidebar';
import { TheNavbar } from '@/widgets/the-navbar';

const emit = defineEmits<{
  (e: 'date-selected', newValue: Date): void;
}>();
</script>
