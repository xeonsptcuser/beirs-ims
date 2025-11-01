import AboutPage from '@/views/LandingPage/AboutPage/AboutPage.vue'
import LandingPage from '@/views/LandingPage/LandingPage.vue'
import LoginPage from '@/views/LandingPage/LoginPage/LoginPage.vue'
import RegistrationPage from '@/views/LandingPage/RegisterPage/RegistrationPage.vue'
import ServicesPage from '@/views/LandingPage/ServicesPage/ServicesPage.vue'
import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'LandingPage',
    component: LandingPage,
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/registration',
    name: 'RegisterPage',
    component: RegistrationPage,
    meta: {
      title: 'Registration',
    },
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage,
    meta: {
      title: 'About Us',
    },
  },
  {
    path: '/services',
    name: 'ServicesPage',
    component: ServicesPage,
    meta: {
      title: 'Services',
    },
  },
]
