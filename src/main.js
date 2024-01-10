import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "@/services/axios";
import App from "./App.vue";
import router from "./router";
import { i18n } from "@/locales";

import "./assets/scss/main.scss";
window.onunhandledrejection = function (e) {
  window.Telegram.WebApp.showAlert(e.reason);
};
const app = createApp(App);
axios
  .get("/info")
  .then(() => alert("success test"))
  .catch(() => alert("error test"));
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
