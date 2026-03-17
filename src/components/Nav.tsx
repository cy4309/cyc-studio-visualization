"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { useI18n } from "@/locales/i18n";
import AnchorLink from "@/components/AnchorLink";

const Nav = forwardRef<HTMLElement>(function Nav(_, ref) {
  const { t } = useI18n();

  return (
    <header
      ref={ref}
      className="absolute top-0 inset-x-0 z-50 flex justify-between items-start pt-6 px-6 md:px-12 uppercase text-xs tracking-widest font-inter mix-blend-difference pb-6 transition-colors duration-300 opacity-0"
    >
      <AnchorLink href="#top" className="leading-tight block">
        <Image
          src="/cyc-logo.png"
          alt="CYC Studio"
          width={48}
          height={48}
          className="h-8 w-auto"
        />
      </AnchorLink>

      <nav className="flex flex-col text-right gap-1">
        <AnchorLink
          href="#ourmission"
          className="hover:opacity-70 transition-opacity"
        >
          {t("nav.mission")}
        </AnchorLink>
        <AnchorLink
          href="#feature"
          className="hover:opacity-70 transition-opacity"
        >
          {t("nav.feature")}
        </AnchorLink>
        <AnchorLink
          href="#catalog"
          className="hover:opacity-70 transition-opacity"
        >
          {t("nav.catalog")}
        </AnchorLink>
        <AnchorLink
          href="#team"
          className="hover:opacity-70 transition-opacity"
        >
          {t("nav.team")}
        </AnchorLink>
        <AnchorLink
          href="#contacts"
          className="hover:opacity-70 transition-opacity"
        >
          {t("nav.contacts")}
        </AnchorLink>
      </nav>
    </header>
  );
});

export default Nav;
