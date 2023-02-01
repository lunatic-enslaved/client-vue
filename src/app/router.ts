import { createRouter, createWebHistory } from 'vue-router';

const HomePage = () => import('@/pages/home-page.vue');
const AccountsPage = () => import('@/pages/accounts-page.vue');
const CaloriesPage = async () =>
  (await import('@/pages/calories-page')).CaloriesPage;
const ProductsPage = async () =>
  (await import('@/pages/products-page')).ProductsPage;
const NotFoundPage = () => import('@/pages/not-found-page.vue');

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Главная' },
      component: HomePage
    },
    {
      path: '/accounts',
      name: 'accounts',
      meta: { title: 'Счета' },
      component: AccountsPage
    },
    {
      path: '/calories',
      name: 'calories',
      meta: { title: 'Счетчик калорий' },
      component: CaloriesPage
    },
    {
      path: '/products',
      name: 'products',
      meta: { title: 'Продукты' },
      component: ProductsPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage
    }
  ]
});
