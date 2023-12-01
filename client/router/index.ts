import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AccountTypeView from "../views/AccountTypeView.vue";
import { CreateDiaryView, DiaryView, EditDiaryView } from "../views/Diary/_diaryViews";
import HomeView from "../views/HomeView.vue";
import { CreateLetterView, EditLetterView, LetterView } from "../views/Letter/_letterView";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import RegisterView from "../views/RegisterView.vue";
import SettingView from "../views/SettingView.vue";
import PreferenceViewF from "../views/family/PreferenceViewF.vue";
import PreferenceViewP from "../views/patient/PreferenceViewP.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/preferenceF",
      name: "PreferenceF",
      component: PreferenceViewF,
      meta: { requiresAuth: true },
    },
    {
      path: "/preferenceP",
      name: "PreferenceP",
      component: PreferenceViewP,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary",
      name: "Diary",
      component: DiaryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary/create",
      name: "CreateDiary",
      component: CreateDiaryView,
      meta: { requiresAuth: true },
    },
    {
      path: "/diary/edit/:_id",
      name: "EditDiary",
      component: EditDiaryView,
      props: (route) => ({ _id: route.params._id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/letter",
      name: "Letter",
      component: LetterView,
      meta: { requiresAuth: true },
    },
    {
      path: "/letter/create",
      name: "CreateLetter",
      component: CreateLetterView,
      meta: { requiresAuth: true },
    },
    {
      path: "/letter/edit/:_id",
      name: "EditLetter",
      component: EditLetterView,
      props: (route) => ({ _id: route.params._id }),
      meta: { requiresAuth: true },
    },
    {
      path: "/forum",
      name: "Forum",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/delay",
      name: "Delay",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/wish",
      name: "Wish",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      // beforeEnter: (to, from) => {
      //   const { isLoggedIn } = storeToRefs(useUserStore());
      //   if (isLoggedIn.value) {
      //     return { name: "Settings" };
      //   }
      // },
    },
    {
      path: "/register",
      name: "Register",
      component: RegisterView,
      meta: { requiresAuth: false },
    },
    {
      path: "/accountType",
      name: "AccountType",
      component: AccountTypeView,
      meta: { requiresAuth: false },
      props: true,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
