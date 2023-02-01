<template>
  <el-dialog
    v-model="localOpen"
    :title="
      props.addedProduct ? 'Редактировать продукт' : 'Добавить новый продукт'
    "
    class="w-124"
  >
    <el-steps
      v-if="!props.addedProduct"
      :active="activeStep"
      class="mb-6 w-full"
    >
      <el-step title="Выберите продукт" />
      <el-step title="Укажите вес" />
    </el-steps>

    <ProductList v-if="activeStep === 0" @product-click="onProductClick" />

    <el-form
      v-else
      ref="$formElement"
      :model="formValues"
      :rules="formRules"
      @submit.prevent="submit"
    >
      <el-form-item label="Вес продукта" prop="grams">
        <el-input
          ref="$gramsField"
          v-model.number="formValues.grams"
          autocomplete="off"
          clearable
          @keydown.enter.prevent="submit"
        >
          <template #suffix>грамм</template>
        </el-input>
      </el-form-item>

      <el-form-item label="Время приема пищи" prop="time">
        <el-time-picker
          v-model="formValues.time"
          arrow-control
          placeholder="Время"
          format="HH:mm"
          @keydown.enter.prevent="submit"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <template v-if="activeStep === 1">
        <el-button v-if="!props.addedProduct" @click="activeStep = 0"
          >Назад</el-button
        >
        <el-button type="primary" class="bg-sky-500" @click="submit">
          Добавить
        </el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, type PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';

import dayjs from '@/shared/lib/dayjs';
import { ProductList } from '@/entities/product/list';

import type { AddEventPayload, Product, AddedProduct } from './types';

// FIXME: не срабатывает фокус на полях ввода

const emit = defineEmits<{
  (e: 'update:open', payload: Boolean): void;
  (e: 'add', payload: AddEventPayload): void;
  (e: 'error-while-add', payload: AddEventPayload): void;
  (e: 'edit', payload: { grams: number; time: Date }): void;
}>();
const props = defineProps({
  open: { type: Boolean, required: true },
  addedProduct: { type: Object as PropType<AddedProduct>, default: null }
});

// Set form values and rules
const formValues = reactive({
  grams: null as number | null,
  time: new Date()
});
const formRules: FormRules = {
  grams: [
    {
      type: 'number',
      required: true,
      message: 'Введите вес продукта',
      trigger: 'blur'
    },
    {
      type: 'number',
      min: 1,
      message: 'Вес не должен быть меньше 1',
      trigger: 'blur'
    }
  ],
  time: [
    {
      type: 'date',
      required: true,
      message: 'Выберите время приема пищи',
      trigger: 'change'
    }
  ]
};
watch(
  () => props.addedProduct,
  (newValue) => {
    formValues.time = dayjs(newValue?.time).toDate();
    formValues.grams = newValue?.grams;
  },
  { immediate: true }
);

// Set view
const activeStep = ref(0);
watch(
  () => props.addedProduct,
  (newValue) => {
    if (newValue) {
      activeStep.value = 1;
    } else {
      activeStep.value = 0;
    }
  },
  { immediate: true }
);

// Reset form on open
const localOpen = useVModel(props, 'open', emit);
watch(localOpen, (newValue) => {
  if (newValue) {
    activeStep.value = 0;
    selectedProduct.value = undefined;
  }
});

const selectedProduct = ref<Product>();
function onProductClick(product: Product) {
  activeStep.value = 1;
  selectedProduct.value = product;
}

const $formElement = ref<FormInstance>();
async function submit() {
  const formEl = $formElement.value;

  if (!formEl) return;

  await formEl.validate((valid) => {
    if (!valid) {
      return;
    }

    const time = dayjs(formValues.time)
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();
    const grams = formValues.grams as number;
    const product = selectedProduct.value as Product;

    if (props.addedProduct) {
      emit('edit', { grams, time });
    } else {
      emit('add', { product, grams, time });
    }
  });
}

// Focus fields
const $gramsField = ref<InputInstance | null>(null);
watch($gramsField, (newValue) => newValue?.focus(), { immediate: true });

const $searchField = ref<InputInstance | null>(null);
watch($searchField, (newValue) => newValue?.focus(), {
  immediate: true
});
</script>
