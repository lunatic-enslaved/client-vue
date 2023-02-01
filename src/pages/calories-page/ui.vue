<template>
  <PageContextProvider
    v-slot="{
      addProduct,
      editProduct,
      removeProduct,
      nutrients,
      selectedDate,
      setSelectedDate,
      loadingDataForDate,
      groupedProducts
    }"
  >
    <DefaultLayout @date-selected="setSelectedDate">
      <div
        v-if="!loadingDataForDate && selectedDate"
        class="p-4 relative h-full flex flex-col"
      >
        <AddProductToMealDialog
          v-if="isProductDialogOpen"
          v-model:open="isProductDialogOpen"
          :added-product="productForEditing"
          :meal-date="selectedDate"
          @add="
            (...args) => {
              addProduct(...args);
              isProductDialogOpen = false;
            }
          "
          @edit="
            (...args) => {
              productForEditing && editProduct(productForEditing.id, ...args);
              isProductDialogOpen = false;
            }
          "
        />

        <!-- <EditMealTimeDialog
          v-if="mealForEditing"
          v-model:open="isEditingMeal"
          :time="mealForEditing.time"
          @submit="
            (...args) => {
              productForEditing && editProduct(productForEditing.id, ...args);
              isEditingProduct = false;
            }
          "
        /> -->

        <!-- Nutrients stat -->
        <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="nutrient in nutrients"
            :key="nutrient.name"
            class="relative bg-white py-4 px-4 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div class="absolute bg-sky-500 rounded-md p-3">
                <component
                  :is="nutrient.icon"
                  class="h-4 w-4 text-white"
                  aria-hidden="true"
                />
              </div>
              <p class="ml-14 text-sm font-medium text-gray-500 truncate">
                {{ nutrient.name }}
              </p>
            </dt>
            <dd class="ml-14 flex items-baseline">
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(nutrient.got, 0) }} /
                {{ formatNumber(nutrient.recommended, 0) }}
              </p>
            </dd>
          </div>
        </dl>

        <!-- Products lst -->
        <div class="mt-4 bg-white shadow rounded-lg flex-1 flex flex-col">
          <div class="flex-1">
            <div v-for="group in groupedProducts" :key="group.order">
              <div
                class="px-6 pt-4 text-xs text-gray-400 flex flex-wrap justify-between"
              >
                <h6 class="text-sm text-gray-600">
                  {{ group.order }} приём пищи
                </h6>
                <div>
                  <time :datetime="group.time" class="mr-2 text-gray-500">
                    {{ dayjs(group.time).format('LT') }}
                  </time>

                  <span class="font-medium">
                    {{ formatNumber(group.calories, 0) }} ккал
                  </span>
                  <span class="ml-2">
                    Б: {{ formatNumber(group.proteins, 0) }} г
                  </span>
                  <span class="ml-2">
                    Ж: {{ formatNumber(group.fats, 0) }} г
                  </span>
                  <span class="ml-2">
                    У: {{ formatNumber(group.carbs, 0) }} г
                  </span>
                </div>
              </div>

              <ul role="list" class="divide-y divide-gray-200">
                <li
                  v-for="ap in group.products"
                  :key="ap.id"
                  tabindex="0"
                  class="flex flex-nowrap items-center hover:bg-gray-50 px-6 cursor-pointer"
                  @click="productForEditing = ap"
                  @keydown.enter="productForEditing = ap"
                >
                  <div class="py-4 text-sm flex-0 pr-6">
                    <p class="font-medium text-base text-sky-600 truncate">
                      {{ ap.product.name }}
                    </p>

                    <div class="flex flex-nowrap justify-between w-full">
                      <span class="mr-4">
                        Б:
                        {{
                          formatNumber(
                            calculateTotalWeightOfNutrient(
                              ap.product.proteins,
                              ap.grams
                            )
                          )
                        }}
                        г
                      </span>
                      <span class="mr-4">
                        У:
                        {{
                          formatNumber(
                            calculateTotalWeightOfNutrient(
                              ap.product.carbs,
                              ap.grams
                            )
                          )
                        }}
                        г
                      </span>
                      <span class="mr-4">
                        Ж:
                        {{
                          formatNumber(
                            calculateTotalWeightOfNutrient(
                              ap.product.fats,
                              ap.grams
                            )
                          )
                        }}
                        г
                      </span>
                    </div>
                  </div>

                  <div class="flex-1 flex flex-col items-end pr-6">
                    <div class="flex flex-nowrap items-center">
                      <time :datetime="ap.time" class="mr-2 text-gray-500">
                        {{ dayjs(ap.time).format('LT') }}
                      </time>
                      <strong>
                        {{
                          formatNumber(
                            (ap.product.calories / 100) * ap.grams,
                            0
                          )
                        }}
                        ккал
                      </strong>
                    </div>
                    <p>{{ formatNumber(ap.grams, 0) }} г</p>
                  </div>

                  <el-button circle @click.stop="removeProduct(ap.id)">
                    <TrashIcon class="h-4 w-4" />
                  </el-button>
                </li>
              </ul>
            </div>
          </div>

          <div class="flex justify-end py-4 px-6">
            <el-button
              type="primary"
              class="bg-sky-500"
              @click="isAddingNewProduct = true"
            >
              <PlusIcon class="h-6 w-6" aria-hidden="true" />
              Добавить новый продукт
            </el-button>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center w-full h-full">
        loading
      </div>
    </DefaultLayout>
  </PageContextProvider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline';

import DefaultLayout from '@/pages/-layouts/default-layout.vue';
import { AddProductToMealDialog } from '@/features/meal/add-product-to-meal';

import { calculateTotalWeightOfNutrient } from './lib';
import PageContextProvider from './context.vue';
import type { AddedProduct } from './types';
// import EditMealTimeDialog from "./edit-meal-time-dialog.vue";

const isAddingNewProduct = ref(false);
const productForEditing = ref<AddedProduct>();
const isProductDialogOpen = computed({
  get() {
    return !!productForEditing.value || isAddingNewProduct.value;
  },
  set(newValue) {
    if (!newValue) {
      productForEditing.value = undefined;
      isAddingNewProduct.value = false;
    }
  }
});
// const mealForEditing = ref<Meal | null>(null);
// const isEditingMeal = computed({
//   get() {
//     return !!mealForEditing.value;
//   },
//   set(newValue) {
//     if (!newValue) {
//       mealForEditing.value = null;
//     }
//   },
// });

function formatNumber(number: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits }).format(
    number
  );
}
</script>
