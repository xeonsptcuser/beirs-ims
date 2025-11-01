import AboutPage from '@/views/Public/AboutPage/AboutPage.vue'
import HomePage from '@/views/Public/HomePage/HomePage.vue'
import LoginPage from '@/views/Public/LoginPage/LoginPage.vue'
import RegistrationPage from '@/views/Public/RegisterPage/RegistrationPage.vue'
import ServicesPage from '@/views/Public/ServicesPage/ServicesPage.vue'
import type { RouteRecordRaw } from 'vue-router'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
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
