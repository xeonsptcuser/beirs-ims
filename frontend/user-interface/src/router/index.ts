import AppLayout from '@/components/layout/AppLayout.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { publicRoutes } from './public-routes'
import { useSessionStore } from '@/Utils/store/useSessionStore'
import { privateRoutes } from './private-routes'
import { useGlobalLoadingStore } from '@/Utils/store/useGlobalLoadingStore'
import ErrorPage from '@/views/Public/ErrorPage/ErrorPage.vue'
import { successErrorRoutes } from './success-error-routes'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: { name: 'HomePage' },
    children: [
      ...publicRoutes,
      ...privateRoutes,
      ...successErrorRoutes,
      {
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        component: ErrorPage,
        meta: { title: 'Page Not Found' },
      },
    ],
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
  const session = useSessionStore()
  const roleParam = to.params.role as string | undefined
  const navigation = useGlobalLoadingStore()

  navigation.startNavigation()

  if (to.meta.requiresAuth) {
    if (!session.token) return next({ name: 'LoginPage' })
    if (roleParam && roleParam !== session.role) {
      return next({ name: 'HomePage' })
    }
  }

  const title = to.meta.title
  if (typeof title === 'string' && title) {
    document.title = `BEIRS - ${title}`
  }
  next()
})

router.afterEach(() => {
  const navigation = useGlobalLoadingStore()
  navigation.endNavigation()
})

router.onError(() => {
  const navigation = useGlobalLoadingStore()
  navigation.endNavigation()
})

export default router
