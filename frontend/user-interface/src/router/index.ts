import AppLayout from "@/components/layout/AppLayout.vue";
import LoginPage from "@/views/LandingPage/components/LoginPage.vue";
import LandingPage from "@/views/LandingPage/LandingPage.vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        name: "LandingPage",
        component: LandingPage,
        meta: {
          title: "Home",
        },
      },
      {
        path: "/signin",
        name: "LoginPage",
        component: LoginPage,
        meta: {
          title: "Login",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // if navigating back/forward in browser history
    if (savedPosition) {
      return savedPosition;
    } else {
      // always scroll to top
      return { left: 0, top: 0 };
    }
  },
});

router.beforeEach(async (to, _from, next) => {
  // タイトルの設定
  const title = to.meta.title;
  if (typeof title === "string" && title) {
    document.title = `${title} - BEIRS-IMS`;
  }

  next();
});

export default router;
