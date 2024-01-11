import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

axios.defaults.baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://griffith3.fly.dev/";

createApp(App).use(router).mount("#app");
