<template>
  <el-dialog
    v-model="localOpen"
    :title="
      props.product
        ? 'Редактировать продукт: ' + props.product.name
        : 'Новый продукт'
    "
    class="w-96"
  >
    <el-form
      ref="$form"
      :model="form"
      :rules="rules"
      label-width="150px"
      @submit.prevent="submit"
    >
      <el-form-item
        label="Название продукта"
        prop="name"
        :error="fieldsErrors['name']"
      >
        <el-input v-model="form.name" @keydown.enter="submit" />
      </el-form-item>
      <el-form-item label="Калорийность, ккал" prop="calories">
        <el-input
          type="number"
          v-model.number="form.calories"
          @keydown.enter="submit"
        />
      </el-form-item>
      <el-form-item label="Белки, г" prop="proteins">
        <el-input
          type="number"
          v-model.number="form.proteins"
          @keydown.enter="submit"
        />
      </el-form-item>
      <el-form-item label="Жиры, г" prop="fats">
        <el-input
          type="number"
          v-model.number="form.fats"
          @keydown.enter="submit"
        />
      </el-form-item>
      <el-form-item label="Углеводы, г" prop="carbs">
        <el-input
          type="number"
          v-model.number="form.carbs"
          @keydown.enter="submit"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button
        :disabled="isSubmitting"
        :loading="isSubmitting"
        @click="submit"
      >
        Сохранить
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed, type PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus';

import { useCreateProduct, useUpdateProduct } from './api';
import type { Product } from '@/entities/product/list';

// FIXME: как сделать submit от формы, чтобы не ловить на каждом поле ввода

const emit = defineEmits<{
  (e: 'submit', product: Product): void;
  (e: 'update:open', payload: boolean): void;
}>();
const props = defineProps({
  open: { type: Boolean, required: true },
  product: { type: Object as PropType<Product>, default: null }
});

const localOpen = useVModel(props, 'open', emit);
const form = reactive({
  name: '' as string,
  calories: null as number | null,
  proteins: null as number | null,
  fats: null as number | null,
  carbs: null as number | null
});
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Укажите название продукта', trigger: 'blur' },
    { min: 3, message: 'Название должно иметь больше 4 букв', trigger: 'blur' }
  ],
  calories: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: 'Число должно быть не меньше 0',
      trigger: 'blur'
    }
  ],
  proteins: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: 'Число должно быть не меньше 0',
      trigger: 'blur'
    }
  ],
  fats: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: 'Число должно быть не меньше 0',
      trigger: 'blur'
    }
  ],
  carbs: [
    {
      required: true,
      type: 'number',
      min: 0,
      message: 'Число должно быть не меньше 0',
      trigger: 'blur'
    }
  ]
});

// set fields from edited product
watch(
  () => props.product,
  (newValue) => {
    form.name = newValue?.name || '';
    form.calories = newValue?.calories || null;
    form.proteins = newValue?.proteins || null;
    form.fats = newValue?.fats || null;
    form.carbs = newValue?.carbs || null;
  },
  { immediate: true }
);

const { mutate: createProduct, error: createProductError } = useCreateProduct(
  () => ({
    name: form.name,
    calories: form.calories as number,
    carbs: form.carbs as number,
    proteins: form.proteins as number,
    fats: form.fats as number
  }),
  (p) => p && emit('submit', p),
  () =>
    ElNotification({
      title: 'Ошибка',
      message: 'Что-то пошло не так при создании продукта'
    })
);
const { mutate: updateProduct, error: updateProductError } = useUpdateProduct(
  () => ({
    id: props.product.id,
    name: form.name,
    calories: form.calories as number,
    carbs: form.carbs as number,
    proteins: form.proteins as number,
    fats: form.fats as number
  }),
  (p) => p && emit('submit', p),
  () =>
    ElNotification({
      title: 'Ошибка',
      message: 'Что-то пошло не так при обновлении продукта'
    })
);

const fieldsErrors = computed(() => {
  const errors: { [key: string]: string } = {};
  const error = props.product
    ? updateProductError.value
    : createProductError.value;

  if (error) {
    for (const { message } of error.graphQLErrors) {
      if (message.includes('Unique constraint failed on the fields')) {
        if (message.match(/(`name`)/)) {
          errors.name = 'Такой продукт уже существует';
        }
      }
    }
  }
  return errors;
});

const isSubmitting = ref(false);
const $form = ref<FormInstance>();
async function submit() {
  const formEl = $form.value;

  if (!formEl) return;

  await formEl.validate(async (valid) => {
    if (!valid) return;

    isSubmitting.value = true;

    if (props.product) {
      try {
        await updateProduct();
      } catch {
        //
      }
    } else {
      try {
        await createProduct();
      } catch {
        //
      }
    }

    isSubmitting.value = false;
  });
}
</script>
