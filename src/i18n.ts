import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import global_en from "./locales/en-US/global.json";
import global_pl from "./locales/pl-PL/global.json";
import global_tr from "./locales/tr-TR/global.json";
import global_de from "./locales/de-DE/global.json";
import global_pt from "./locales/pt-BR/global.json";

const supportedLngs: string[] = ["en-US", "de-DE", "tr-TR", "pl-PL", "pt-BR"];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: false,
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "lang",
    },
    interpolation: {
      escapeValue: false,
    },
    supportedLngs,
    fallbackLng: "en",
    load: "currentOnly",
    resources: {
      "en-US": {
        global: global_en,
      },
      "pl-PL": {
        global: global_pl,
      },
      "tr-TR": {
        global: global_tr,
      },
      "de-DE": {
        global: global_de,
      },
      "pt-BR": {
        global: global_pt,
      },
    },
  });

export default i18n;
