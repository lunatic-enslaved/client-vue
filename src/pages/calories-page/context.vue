<template>
  <slot
    :grouped-products="groupedProducts"
    :selected-date="selectedDate"
    :set-selected-date="setSelectedDate"
    :nutrients="nutrients"
    :add-product="addProduct"
    :edit-product="editProduct"
    :remove-product="removeProduct"
    :loading-data-for-date="isLoadingDataForDate"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, type FunctionalComponent } from 'vue';
import { UsersIcon } from '@heroicons/vue/24/outline';
import { ElNotification } from 'element-plus';

import dayjs from '@/shared/lib/dayjs';
import {
  useAddProduct,
  useEditProduct,
  type AddEventPayload,
  type EditEventPayload
} from '@/features/meal/add-product-to-meal';

import type { Meal, AddedProduct } from './types';
import { calculateTotalWeightOfNutrient, createMeal } from './lib';

const addedProducts = ref<AddedProduct[]>([]);
const nutrients = computed(() => {
  const obj: {
    [key: string]: {
      name: string;
      got: number;
      recommended: number;
      icon: FunctionalComponent;
    };
  } = {
    proteins: { name: 'Белки', got: 0, recommended: 90, icon: UsersIcon },
    carbs: { name: 'Углеводы', got: 0, recommended: 150, icon: UsersIcon },
    fats: { name: 'Жиры', got: 0, recommended: 60, icon: UsersIcon },
    calories: { name: 'Калории', got: 0, recommended: 1500, icon: UsersIcon }
  };

  for (const addedProduct of addedProducts.value) {
    obj.proteins.got += calculateTotalWeightOfNutrient(
      addedProduct.product.proteins,
      addedProduct.grams
    );
    obj.carbs.got += calculateTotalWeightOfNutrient(
      addedProduct.product.carbs,
      addedProduct.grams
    );
    obj.fats.got += calculateTotalWeightOfNutrient(
      addedProduct.product.fats,
      addedProduct.grams
    );
    obj.calories.got += calculateTotalWeightOfNutrient(
      addedProduct.product.calories,
      addedProduct.grams
    );
  }

  return Object.values(obj);
});
const groupedProducts = computed(() => {
  const groups: Meal[] = [];

  const sortedProducts = [...addedProducts.value];
  sortedProducts.sort((p1, p2) =>
    dayjs(p1.time).isBefore(p2.time)
      ? 1
      : dayjs(p1.time).isAfter(p2.time)
      ? -1
      : 0
  );

  for (const addedProduct of addedProducts.value) {
    if (groups.length === 0) {
      groups.push(createMeal(1, [addedProduct]));
    } else {
      const lastGroup = groups[groups.length - 1];
      const lastProduct = lastGroup.products[lastGroup.products.length - 1];

      // create new group
      if (dayjs(lastProduct.time).add(1, 'hour').isBefore(addedProduct.time)) {
        groups.push(createMeal(groups.length + 1, [addedProduct]));
      }
      // add to previous group
      else {
        lastGroup.products.push(addedProduct);
      }
    }
  }

  return groups;
});

// FIXME: заблокируй редактирование продукта, если его id < 0

// Selected date
const selectedDate = ref<Date>();
function setSelectedDate(newDate: Date) {
  selectedDate.value = newDate;
}

// load data for the date
const isLoadingDataForDate = ref(false);
let loadingTimeout: number | null = null;
watch(selectedDate, async () => {
  loadingTimeout && clearTimeout(loadingTimeout);
  loadingTimeout = setTimeout(() => loadData(), 50);
});
async function loadData() {
  isLoadingDataForDate.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  addedProducts.value = [];
  isLoadingDataForDate.value = false;
}

async function addProduct({ product, grams, time }: AddEventPayload) {
  const date = selectedDate.value;

  if (!date) {
    return;
  }

  if (grams > 0 && !!time) {
    const id = Date.now() * -1;

    addedProducts.value.push({
      id,
      product: product,
      grams,
      time: time.toISOString()
    });

    await useAddProduct({
      getVariables: () => ({
        date,
        time,
        grams,
        productId: product.id
      }),
      onSuccess: (addedProduct) => {
        const index = addedProducts.value.findIndex((p) => p.id === id);
        if (index > -1 && addedProduct) {
          addedProduct.product = product;
          addedProducts.value[index] = addedProduct;
        }
      },
      onError: () => {
        ElNotification({
          title: 'Что-то пошло не так',
          message: 'Что-то пошло не так при добавлении продукта'
        });

        const index = addedProducts.value.findIndex((p) => p.id === id);
        if (index > -1) {
          addedProducts.value.splice(index, 1);
        }
      }
    }).mutate();
  }
}

async function editProduct(
  addedProductId: AddedProduct['id'],
  { grams, time }: EditEventPayload
) {
  const addedProduct = addedProducts.value.find((p) => p.id === addedProductId);

  if (addedProduct && grams > 0 && !!time) {
    const oldGrams = addedProduct.grams;
    const oldTime = addedProduct.time;

    addedProduct.grams = grams;
    addedProduct.time = time.toISOString();

    await useEditProduct({
      getVariables: () => ({
        time,
        grams,
        addedProductId: addedProduct.id
      }),
      onSuccess: () => {},
      onError: () => {
        ElNotification({
          title: 'Что-то пошло не так',
          message: 'Что-то пошло не так при редактировании продукта'
        });

        addedProduct.grams = oldGrams;
        addedProduct.time = oldTime;
      }
    }).mutate();
  }
}
function removeProduct(addedProductId: AddedProduct['id']) {
  addedProducts.value = addedProducts.value.filter(
    (a) => a.id !== addedProductId
  );
}
</script>
