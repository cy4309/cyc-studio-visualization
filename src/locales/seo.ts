import type { Language } from "./i18n";

/** 供 generateMetadata 使用（與 UI 字典分開，避免 async 匯入循環） */
export const seoByLang: Record<
  Language,
  { title: string; description: string; ogLocale: string }
> = {
  zh: {
    title: "CYC Studio | 創意網頁工作室 — 互動視覺與數位體驗",
    description:
      "CYC Studio 專注互動網頁與視覺體驗，涵蓋前端設計、動態互動、資料串接與系統建置，打造兼具美感與功能的數位作品。",
    ogLocale: "zh_TW",
  },
  en: {
    title:
      "CYC Studio | Creative Web Studio - Interactive Visual Experiences",
    description:
      "CYC Studio is a creative web studio focused on interactive visual experiences, spanning frontend design, motion interaction, data integration, and system implementation.",
    ogLocale: "en_US",
  },
};

export function isValidLang(s: string): s is Language {
  return s === "zh" || s === "en";
}
