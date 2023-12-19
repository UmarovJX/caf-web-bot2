import { createI18n } from "vue-i18n";
import { ref, reactive } from "vue";
const locale = ref("ru");
import uz from "./uz";
import ru from "./ru";
const messages = reactive({ uz, ru });
function t(path) {
  const p = path.split(".");
  let res = messages[locale.value];
  for (let key of p) {
    if (!res) break;
    res = res[key];
  }
  return res || path;
}
export const i18n = function install(app) {
  app.config.globalProperties.$t = t;
  app.config.globalProperties.$i18n = {
    locale,
  };
};
window.t = t;

export const useI18n = function () {
  return {
    t,
    locale,
  };
};

export function setupI18n(options = { locale: "ru" }) {
  const i18n = createI18n(options);
  setI18nLanguage(i18n, options.locale);
  return i18n;
}

export function setI18nLanguage(i18n, locale) {
  if (i18n.mode === "legacy") {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  document.querySelector("html").setAttribute("lang", locale);
}
