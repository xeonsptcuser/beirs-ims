import BlotterReports from '@/views/Private/BlotterReports/BlotterReports.vue'
import Certifications from '@/views/Private/Certifications/Certifications.vue'
import Dashboard from '@/views/Private/Dashboard/Dashboard.vue'
import HeatMaps from '@/views/Private/HeatMaps/HeatMaps.vue'
import Residents from '@/views/Private/Residents/Residents.vue'

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
      {
        path: 'residents',
        name: 'Residents',
        component: Residents,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'View Residents',
          requiresAuth: true,
        },
      },
      {
        path: 'certifications',
        name: 'Certifications',
        component: Certifications,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Certification Requests',
          requiresAuth: true,
        },
      },
      {
        path: 'blotter-reports',
        name: 'BlotterReports',
        component: BlotterReports,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Blotter Reports',
          requiresAuth: true,
        },
      },
      {
        path: 'heat-maps',
        name: 'HeatMaps',
        component: HeatMaps,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'View Heat Map',
          requiresAuth: true,
        },
      },
    ],
  },
]
