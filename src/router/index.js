import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import MyList from "../views/MyList.vue";
import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";
import Fly from "../views/Fly.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/my-list",
    name: "My List",
    component: MyList,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
  {
    path: "/fly",
    name: "Fly",
    component: Fly,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
