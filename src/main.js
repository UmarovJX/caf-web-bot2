import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { i18n } from "@/locales";

import "./assets/scss/main.scss";
window.onunhandledrejection = function (e) {
  // Handle this case... For example I can send info
  // about this error to developer's email.
  window.Telegram.WebApp.showAlert(e.type);
  window.Telegram.WebApp.showAlert(e.reason.message);
};
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
