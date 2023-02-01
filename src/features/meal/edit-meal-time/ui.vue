<template>
  <el-dialog
    v-model="localOpen"
    title="Редактировать время приема пищи"
    width="30%"
  >
    <el-form
      ref="$form"
      :model="ruleForm"
      :rules="rules"
      @submit.prevent="submit"
    >
      <el-form-item label="Время приема пищи" prop="time">
        <el-time-picker
          ref="$timeField"
          v-model="ruleForm.time"
          arrow-control
          placeholder="Время"
          format="HH:mm"
          @keydown.enter.prevent="submit"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="localOpen = false">Отмена</el-button>
      <el-button type="primary" class="bg-sky-500" @click="submit">
        Сохранить
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, nextTick } from 'vue';
import type { PropType } from 'vue';
import { useVModel } from '@vueuse/core';
import type { FormInstance, FormRules, InputInstance } from 'element-plus';

import dayjs from '@/shared/lib/dayjs';

const emit = defineEmits<{
  (e: 'update:open', payload: Boolean): void;
  (e: 'submit', time: Date): void;
}>();
const props = defineProps({
  open: { type: Boolean, required: true },
  time: { type: Object as PropType<Date>, default: null }
});
const localOpen = useVModel(props, 'open', emit);

const $form = ref<FormInstance>();
const ruleForm = reactive({
  time: new Date()
});
const rules: FormRules = {
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
  () => props.time,
  (newValue) => (ruleForm.time = newValue || new Date()),
  { immediate: true }
);

async function submit() {
  const formEl = $form.value;

  if (!formEl) return;

  await formEl.validate((valid) => {
    const timeWithoutSeconds = dayjs(ruleForm.time)
      .set('second', 0)
      .set('millisecond', 0)
      .toDate();
    valid && emit('submit', timeWithoutSeconds);
  });
}

const $timeField = ref<InputInstance | null>(null);
watch($timeField, (newValue) => nextTick(() => newValue?.focus()), {
  immediate: true
});
</script>
