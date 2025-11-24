import type { RouteRecordRaw } from 'vue-router'

export const privateRoutes: RouteRecordRaw[] = [
  {
    path: '/:role',
    meta: { requiresAuth: true, roles: ['admin', 'staff', 'resident'] },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Private/Dashboard/UserDashboard.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
        },
      },
      {
        path: 'residents',
        name: 'Residents',
        component: () => import('@/views/Private/Residents/Residents.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'View Residents',
          requiresAuth: true,
        },
      },
      {
        path: 'residents/profile/:id',
        name: 'UserProfile',
        component: () => import('@/views/Private/Residents/UserProfile.vue'),
        props: (route) => ({ id: route.params.id as string }),
        meta: {
          title: 'User Profile',
          requiresAuth: true,
        },
      },
      {
        path: 'residents/create',
        name: 'CreateUserProfile',
        component: () => import('@/views/Private/Residents/CreateUserProfile.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Create User Profile',
          requiresAuth: true,
        },
      },
      {
        path: 'certifications',
        name: 'Certifications',
        component: () => import('@/views/Private/Certifications/ViewAllCertifications.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Certification Requests',
          requiresAuth: true,
        },
      },
      {
        path: 'certifications/create/:id',
        name: 'CreateCertification',
        component: () => import('@/views/Private/Certifications/CreateCertification.vue'),
        props: (route) => ({ role: route.params.role as string, id: route.params.id as string }),
        meta: {
          title: 'Request Certifications',
          requiresAuth: true,
        },
      },
      {
        path: 'certifications/:id',
        name: 'ViewCertificateRequest',
        component: () => import('@/views/Private/Certifications/ViewCertificateRequest.vue'),
        props: (route) => ({ role: route.params.role as string, id: route.params.id as string }),
        meta: {
          title: 'View Certification Request',
          requiresAuth: true,
        },
      },
      {
        path: 'certifications/:id/preview',
        name: 'CertificatePreview',
        component: () =>
          import('@/views/Private/Certifications/components/PdfPreviewCertificateRequest.vue'),
        props: (route) => ({
          certificateId: route.params.id as string,
          certificateType: route.query.certificateType as string,
        }),
        meta: {
          title: 'Certificate Preview',
          requiresAuth: true,
        },
      },
      {
        path: 'blotter-reports',
        name: 'BlotterReports',
        component: () => import('@/views/Private/BlotterReports/ViewBlotterReports.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Blotter Reports',
          requiresAuth: true,
        },
      },
      {
        path: 'blotter-reports/file-report/:id',
        name: 'CreateBlotterReport',
        component: () => import('@/views/Private/BlotterReports/CreateBlotterReport.vue'),
        props: (route) => ({ role: route.params.role as string, id: route.params.id as string }),
        meta: {
          title: 'File Blotter Report',
          requiresAuth: true,
        },
      },
      {
        path: 'blotter-reports/report/:id',
        name: 'ViewBlotterReport',
        component: () => import('@/views/Private/BlotterReports/ViewBlotterReportInfo.vue'),
        props: (route) => ({ role: route.params.role as string, id: route.params.id as string }),
        meta: {
          title: 'File Blotter Report',
          requiresAuth: true,
        },
      },
      {
        path: 'blotter-reports/report/:id/preview',
        name: 'BlotterPreview',
        component: () =>
          import('@/views/Private/BlotterReports/components/PdfPreviewBlotterReport.vue'),
        props: (route) => ({ blotterId: route.params.id as string }),
        meta: {
          title: 'Blotter Report Preview',
          requiresAuth: true,
        },
      },
      {
        path: 'heat-maps',
        name: 'HeatMaps',
        component: () => import('@/views/Private/HeatMaps/HeatMaps.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'View Heat Map',
          requiresAuth: true,
        },
      },
      {
        path: 'settings/addresses',
        name: 'ManageAddresses',
        component: () => import('@/views/Private/Settings/ManageAddresses.vue'),
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Manage Barangay Addresses',
          requiresAuth: true,
          roles: ['admin'],
        },
      },
    ],
  },
]
