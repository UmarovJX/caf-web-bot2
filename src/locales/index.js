import { createI18n } from "vue-i18n";

import messages from "@intlify/unplugin-vue-i18n/messages";
console.log(messages);

export const i18n = createI18n({
  legacy: false,
  locale: "ru",
  fallbackLocale: "ru",
  messages,
});

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
  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */

  document.querySelector("html").setAttribute("lang", locale);
}

// export async function loadLocaleMessages(i18n, locale) {
//   // load locale messages with dynamic import
//   const messages = await import(
//     /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
//   );
//
//   // set locale and locale message
//   i18n.global.setLocaleMessage(locale, messages.default);
//
//   return nextTick();
// }
