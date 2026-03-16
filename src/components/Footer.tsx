"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/locales/i18n";
import AnchorLink from "@/components/AnchorLink";

export default function Footer() {
  const { t } = useI18n();
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    // Any footer specific animations could go here
  }, []);

  return (
    <footer
      id="contacts"
      ref={footerRef}
      className="relative w-full bg-background border-t border-white/10 z-20 py-16 px-6 md:px-12"
    >
      <div className="w-full max-w-[90vw] md:max-w-[70vw] mx-auto">
        {/* Top footer row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          {/* Logo */}
          {/* <AnchorLink href="#top" className="block">
            <Image
              src="/cyc-logo.png"
              alt="CYC Studio"
              width={64}
              height={64}
              className="h-10 w-auto"
            />
          </AnchorLink> */}

          {/* Social / Contact */}
          <div className="flex flex-col gap-4">
            {/* <div className="flex gap-4 text-xs font-mono uppercase tracking-widest opacity-60">
              <a href="#" className="hover:opacity-100 transition-opacity">
                (Ig)
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity">
                (Tg)
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity">
                (Vk)
              </a>
              <a href="#" className="hover:opacity-100 transition-opacity">
                (Wa)
              </a>
            </div> */}
            <a
              href="mailto:cy4309@gmail.com"
              className="mt-2 inline-flex items-center gap-3 font-inter text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity group"
            >
              <span className="uppercase">{t("footer.writeToUs")}</span>
              <span className="w-8 h-[0.5px] bg-white/40 group-hover:w-12 transition-all duration-500" />
              <span>cy4309@gmail.com</span>
            </a>
            <div className="flex gap-4 text-xs font-mono uppercase tracking-widest opacity-60">
              <span>Eason Chu / +886&nbsp;916&nbsp;530&nbsp;519</span>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="mt-10 flex justify-between items-end text-xs font-mono opacity-20">
          <span>{t("footer.copyright")}</span>
          <span>- All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
