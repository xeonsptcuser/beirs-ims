import BlotterReports from '@/views/Private/BlotterReports/BlotterReports.vue'
import Certifications from '@/views/Private/Certifications/Certifications.vue'
import Dashboard from '@/views/Private/Dashboard/Dashboard.vue'
import HeatMaps from '@/views/Private/HeatMaps/HeatMaps.vue'
import CreateUserProfile from '@/views/Private/Residents/CreateUserProfile.vue'
import Residents from '@/views/Private/Residents/Residents.vue'
import UserProfile from '@/views/Private/Residents/UserProfile.vue'

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
        path: 'residents/profile/:id',
        name: 'UserProfile',
        component: UserProfile,
        props: (route) => ({ id: route.params.id as string }),
        meta: {
          title: 'User Profile',
          requiresAuth: true,
        },
      },
      {
        path: 'residents/create',
        name: 'CreateUserProfile',
        component: CreateUserProfile,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Create User Profile',
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
