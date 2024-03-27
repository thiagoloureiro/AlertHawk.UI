import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import global_en from "./locales/en-US/global.json";
import global_pl from "./locales/pl-PL/global.json";
import global_tr from "./locales/tr-TR/global.json";
import global_de from "./locales/de-DE/global.json";
import global_pt from "./locales/pt-BR/global.json";
import global_it from "./locales/it-IT/global.json";
import global_es from "./locales/es-ES/global.json";
import global_kr from "./locales/ko-KR/global.json";
import global_jp from "./locales/jp-JP/global.json";
import global_cn from "./locales/zh-CN/global.json";
import global_ru from "./locales/ru-RU/global.json";
import global_ua from "./locales/uk-UA/global.json";
import global_em from "./locales/em-EM/global.json";
import global_in from "./locales/in-HI/global.json";

const supportedLngs: string[] = ["en-US", "de-DE", "tr-TR", "pl-PL", "pt-BR", "es-ES","it-IT","ko-KR","jp-JP","zh-CN", "ru-RU", "uk-UA", "em-EM", "in-HI"];

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
      "es-ES": {
        global: global_es,
      },
      "it-IT": {
        global: global_it,
      },
      "ko-KR": {
        global: global_kr,
      },
      "jp-JP": {
        global: global_jp,
      },
      "ru-RU": {
        global: global_ru,
      },
      "uk-UA": {
        global: global_ua,
      },
      "zh-CN": {
        global: global_cn,
      },
      "em-EM": {
        global: global_em,
      },
      "in-HI": {
        global: global_in,
      },
    },
  });

export default i18n;
