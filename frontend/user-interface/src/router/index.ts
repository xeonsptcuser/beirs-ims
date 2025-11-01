import AppLayout from '@/components/layout/AppLayout.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { publicRoutes } from './public-routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: { name: 'LandingPage' },
    children: [...publicRoutes],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { left: 0, top: 0 }
    }
  },
})

router.beforeEach(async (to, _from, next) => {
  const title = to.meta.title
  if (typeof title === 'string' && title) {
    document.title = `BEIRS-IMS - ${title}`
  }
  next()
})

export default router
