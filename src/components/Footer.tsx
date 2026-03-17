"use client";

import { useI18n } from "@/locales/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative w-full bg-background border-t border-white/10 z-20 py-16 px-6 md:px-12">
      <div className="w-full max-w-[90vw] md:max-w-[70vw] mx-auto flex justify-between items-end text-xs font-mono opacity-20">
        <span>{t("footer.copyright")}</span>
        <span>- All rights reserved.</span>
      </div>
    </footer>
  );
}
