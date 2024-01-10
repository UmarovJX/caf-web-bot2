import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { i18n } from "@/locales";

import "./assets/scss/main.scss";
window.onunhandledrejection = function (e) {
  window.Telegram.WebApp.showAlert(e.reason);
};
const app = createApp(App);
fetch(
  import.meta.env.VITE_BASE_APP_URL +
    import.meta.env.VITE_BASE_SHOP_ID +
    "/info"
)
  .then(() => alert("success"))
  .catch(() => alert("test fail"));
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
