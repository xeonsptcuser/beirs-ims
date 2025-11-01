import Dashboard from '@/views/Private/Dashboard/Dashboard.vue'
import type { RouteRecordRaw } from 'vue-router'

export const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/:role',
    meta: { requiresAuth: true, roles: ['admin', 'staff', 'resident'] },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
        },
      },
    ],
  },
]
