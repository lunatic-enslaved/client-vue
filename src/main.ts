import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import ruLocale from 'element-plus/dist/locale/ru.mjs';
import {
  DefaultApolloClient,
  provideApolloClient
} from '@vue/apollo-composable';

import App from '@/app/App.vue';
import { router } from '@/app/router';
import { apolloClient } from '@/app/apollo';

// styles
import '@/shared/styles/index.css';

const app = createApp(App);

// store
app.use(createPinia());

// router
app.use(router);

// element ui
app.use(ElementPlus, { locale: ruLocale });

// apollo
provideApolloClient(apolloClient);
app.provide('apollo', { DefaultApolloClient, apolloClient });

// mount
app.mount('#app');
