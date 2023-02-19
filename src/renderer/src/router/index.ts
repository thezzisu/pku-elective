import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@renderer/views/HomeView.vue')
  }
] satisfies RouteRecordRaw[]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
