export let Locale;
export let createUrlLocale;
import("./locale.xpui.ts").then((m) => {
  Locale = m.Locale;
  createUrlLocale = m.createUrlLocale;
});
