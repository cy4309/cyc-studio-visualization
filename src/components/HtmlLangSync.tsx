"use client";

import { useEffect } from "react";
import { useI18n } from "@/locales/i18n";

/** 同步 <html lang> 與目前介面語言（利於無障礙與搜尋引擎理解） */
export default function HtmlLangSync() {
  const { lang } = useI18n();

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-Hant" : "en";
  }, [lang]);

  return null;
}
