import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { i18n } from "@/locales";

import "./assets/scss/main.scss";
window.onunhandledrejection = function (e) {
  alert(Object.keys(e).join(","));
  alert(e.reason.config.data);
};
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
