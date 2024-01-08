import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import MyList from "../views/MyList.vue";
import Login from "../views/Login.vue";
import Admin from "../views/Admin.vue";
import Fly from "../views/Fly.vue";
import PathNotFound from "../components/PathNotFound.vue";

const routes = [
  {
    path: "/home",
    name: "Home",
    component: Home,
    props: { default: true },
  },
  {
    path: "/my-list",
    name: "My List",
    component: MyList,
    props: { default: true },
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
    props: { default: true },
  },
  {
    path: "/fly",
    name: "Fly",
    component: Fly,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: PathNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
