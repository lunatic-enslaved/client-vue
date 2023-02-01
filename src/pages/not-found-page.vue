<template>
  <DefaultLayout>
    <div
      class="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8"
    >
      <div class="max-w-max mx-auto">
        <div class="sm:flex">
          <p class="text-4xl font-extrabold text-sky-600 sm:text-5xl">404</p>
          <div class="sm:ml-6">
            <div class="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1
                class="text-4xl font-extrabold mb-2 text-gray-900 tracking-tight sm:text-5xl"
              >
                Страница не найдена :(
              </h1>
              <p class="mt-1 text-base text-gray-500">
                Пожалуйста, проверьте URL в адресной строке.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/pages/-layouts/default-layout.vue';
</script>
