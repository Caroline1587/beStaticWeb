import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import HomePage from "@/views/HomePage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/treetest",
    name: "treetest",
    component: () => import("@/views/Treetest.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

// 防止连续点击多次路由报错
const router = createRouter({
  history: createWebHistory(),
//   history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;