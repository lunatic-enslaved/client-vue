<template>
  <div v-loading="isLoadingProducts">
    <ProductEditor
      v-if="isProductEditorOpen"
      v-model:open="isProductEditorOpen"
      :product="productForEditing"
      @submit="onProductAdd"
    />

    <el-form @submit.prevent="" class="relative">
      <div class="flex flex-nowrap">
        <el-input
          ref="$searchField"
          v-model="search"
          autocomplete="off"
          placeholder="Поиск продукта"
          class="mr-2"
          clearable
        >
          <template #prefix>
            <MagnifyingGlassIcon class="h-4 w-4" />
          </template>
        </el-input>

        <el-button @click="isProductEditorOpen = true">
          <PlusIcon class="w-4 h-4 mr-1" />
          Добавить продукт
        </el-button>
      </div>

      <el-progress
        v-if="loading"
        :percentage="100"
        :indeterminate="true"
        class="absolute bottom-0 w-full"
        text-inside
      />
    </el-form>

    <ul role="list" class="divide-y divide-gray-200 mt-4">
      <li
        v-for="product in products || []"
        :key="product.id"
        class="hover:bg-gray-50 cursor-pointer flex flex-nowrap items-center"
        :tabindex="0"
        @click="setProductSelected(product)"
        @keydown.enter="setProductSelected(product)"
      >
        <div class="py-4 text-sm flex-1">
          <p class="font-medium text-sky-600 truncate">
            {{ product.name }}
          </p>

          <div class="flex flex-nowrap justify-between w-full">
            <span class="mr-4">Б: {{ product.proteins }} г</span>
            <span class="mr-4">У: {{ product.carbs }} г</span>
            <span class="mr-4">Ж: {{ product.fats }} г</span>
            <span>К: {{ product.calories }} ккал</span>
          </div>
        </div>

        <el-button circle class="ml-4" @click.stop="startEditProduct(product)">
          <PencilIcon class="h-4 w-4" />
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent, watch } from 'vue';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/vue/24/solid';
import { PencilIcon } from '@heroicons/vue/24/outline';

import { useProducts, type Product } from './api';

const ProductEditor = defineAsyncComponent(
  async () => (await import('./create-product')).CreateProductDialog
);

const emit = defineEmits<{
  (e: 'product-click', product: Product): void;
}>();

const search = ref<string | null>('');
const isProductEditorOpen = ref(false);
const { result, refetch, loading } = useProducts(() => ({
  name: search.value
}));
const products = computed<Product[] | null>(
  () => result.value?.PRODUCTS || null
);
const isLoadingProducts = computed(() => !products.value);

function setProductSelected(product: Product) {
  emit('product-click', product);
}
function onProductAdd() {
  isProductEditorOpen.value = false;
  refetch();
}

const productForEditing = ref<Product>();
function startEditProduct(product: Product) {
  productForEditing.value = product;
  isProductEditorOpen.value = true;
}
watch(isProductEditorOpen, (newValue) => {
  if (!newValue) {
    productForEditing.value = undefined;
  }
});
</script>
