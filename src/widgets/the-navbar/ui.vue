<template>
  <header>
    <div class="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button
        type="button"
        class="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        @click="sidebarOpen = true"
      >
        <span class="sr-only">Открыть сайдбар</span>
        <Bars3Icon class="h-6 w-6" aria-hidden="true" />
      </button>

      <div class="flex-1 px-4 flex justify-between">
        <div class="flex-1 flex items-center">
          <h2 v-if="route.meta?.title" class="text-xl font-bold">
            {{ route.meta?.title }}
          </h2>
        </div>

        <div class="ml-4 flex items-center md:ml-6">
          <div class="flex flex-nowrap items-center">
            <button
              type="button"
              class="p-2 text-gray-500"
              @click="selectPrevDate"
            >
              <span class="sr-only">Выбрать предыдущую дату</span>
              <ChevronLeftIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <form @submit.prevent="">
              <el-date-picker
                v-model="selectedDate"
                :clearable="false"
                :shortcuts="shortcuts"
                format="DD MMMM YYYY"
                placeholder="Выберите дату"
                type="date"
              />
            </form>

            <button
              type="button"
              class="p-2 text-gray-500"
              @click="selectNextDate"
            >
              <span class="sr-only">Выбрать следующую дату</span>
              <ChevronRightIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
export default { name: 'TheNavbar' };
</script>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
import { useRoute } from 'vue-router';
import { Bars3Icon } from '@heroicons/vue/24/outline';

import dayjs from '@/shared/lib/dayjs';

const route = useRoute();
const sidebarOpen = ref(false);

const emit = defineEmits<{
  (e: 'date-selected', newValue: Date): void;
}>();

const selectedDate = ref(new Date());
watch(selectedDate, (newValue) => emit('date-selected', newValue), {
  immediate: true
});
const shortcuts = [
  {
    text: 'Сегодня',
    value: () => new Date()
  }
];

function selectNextDate() {
  selectedDate.value = dayjs(selectedDate.value).add(1, 'day').toDate();
}
function selectPrevDate() {
  selectedDate.value = dayjs(selectedDate.value).subtract(1, 'day').toDate();
}
</script>
