import PdfPreviewCertificateRequest from '@/views/Private/Certifications/components/PdfPreviewCertificateRequest.vue'
import SuccessTransactionPage from '@/views/Private/Certifications/components/SuccessTransactionPage/SuccessTransactionPage.vue'
import SuccessResidentCreationPage from '@/views/Private/Residents/components/SuccessResidentCreationPage/SuccessResidentCreationPage.vue'
import type { RouteRecordRaw } from 'vue-router'

export const successErrorRoutes: RouteRecordRaw[] = [
  {
    path: '/:role',
    meta: { requiresAuth: true, roles: ['admin', 'staff', 'resident'] },
    children: [
      // Certificates Related
      {
        path: 'certifications/success',
        name: 'SuccessCertTransaction',
        component: SuccessTransactionPage,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Successful Interaction',
          requiresAuth: true,
        },
      },
      // User Creation Related
      {
        path: 'residents/success',
        name: 'SuccessResidentCreation',
        component: SuccessResidentCreationPage,
        props: (route) => ({ role: route.params.role as string }),
        meta: {
          title: 'Successful User Registration',
          requiresAuth: true,
        },
      },
    ],
  },
]
