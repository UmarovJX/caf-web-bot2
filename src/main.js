import { createApp } from "vue";
import { createPinia } from "pinia";
import { TELEGRAM, WEB_APP } from "@/constants";

import App from "./App.vue";
import router from "./router";
import { i18n } from "@/locales";

import "./assets/scss/main.scss";
window.onunhandledrejection = function (e) {
  window.Telegram.WebApp.showAlert(e.reason);
};
const app = createApp(App);

alert(window[TELEGRAM][WEB_APP].initDataUnsafe?.user?.id);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
