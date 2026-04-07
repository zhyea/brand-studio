/** document lang/dir from Chrome UI language (RTL for Arabic, etc.). */
export function applyChromeDocLang(): void {
  try {
    const lang = chrome?.i18n?.getUILanguage?.() ?? 'en';
    document.documentElement.lang = lang;
    const rtl = /^(ar|he|fa|ur)(_|$)/i.test(lang);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  } catch {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }
}
