import { createRouter, createWebHistory } from "vue-router";
import StudentView from "@/views/StudentView.vue/StudentView.vue";
import FormLogin from "@/views/FormLogin.vue/FormLogin.vue";

const routes = [
  { path: "/students", component: StudentView, meta: { requiresAuth: true }, name: "Student" },
  { path: "/", component: FormLogin, name: "Login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  if (to.name === "Login" && token) {
    next({ name: "Student" });
  } else if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next({ name: "Login" });
  } else {
    next(); 
  }
});

export default router;
