import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@renderer/views/HomeView.vue')
  }
] satisfies RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
