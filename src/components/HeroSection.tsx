"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/locales/i18n";
import Nav from "@/components/Nav";
// import { OffsetShadowButton } from "@/components/ui/OffsetShadowButton";

export default function HeroSection() {
  const { lang, t } = useI18n();
  const router = useRouter();

  const toggleLanguage = () => {
    const next = lang === "zh" ? "en" : "zh";
    const hash =
      typeof window !== "undefined" ? window.location.hash ?? "" : "";
    router.push(`/${next}${hash}`, { scroll: false });
  };
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const langToggleRef = useRef<HTMLButtonElement>(null);
  // const catalogRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Entry Animation
      // The background flash animation takes 2.5s starting at 0.1s.
      // The original timeline used "-=2", which means this animation starts at 0.6s.
      const entryTl = gsap.timeline({ delay: 0.6 });

      if (headerRef.current) {
        entryTl.fromTo(
          headerRef.current,
          { opacity: 0, filter: "blur(10px)", y: 30 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.5,
            ease: "power3.out",
          },
        );
      }
      const textAndLang = [
        heroHeaderRef.current,
        heroTextRef.current,
        langToggleRef.current,
      ].filter(Boolean);
      if (textAndLang.length > 0) {
        entryTl.fromTo(
          textAndLang,
          { opacity: 0, filter: "blur(10px)", y: 30 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.5,
            stagger: 0,
            ease: "power3.out",
          },
          "-=0.9",
        );
      }

      // Sticky Header Animation
      if (headerRef.current) {
        ScrollTrigger.create({
          start: "top -100",
          end: 99999,
          onEnter: () => {
            if (!headerRef.current) return;
            headerRef.current.classList.add("fixed");
            headerRef.current.classList.remove("absolute");
            gsap.fromTo(
              headerRef.current,
              { yPercent: -100 },
              { yPercent: 0, duration: 0.5, ease: "power3.out" },
            );
          },
          onLeaveBack: () => {
            if (!headerRef.current) return;
            headerRef.current.classList.remove("fixed");
            headerRef.current.classList.add("absolute");
            gsap.set(headerRef.current, { yPercent: 0 });
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="top" className="relative w-full h-[100dvh]">
      <Nav ref={headerRef} />

      <div
        id="ourmission"
        className="relative z-10 w-full h-full p-6 md:p-12 flex flex-col justify-center"
      >
        <div className="mt-20 self-center md:self-start max-w-4xl mix-blend-difference z-20">
          <div ref={heroHeaderRef} className="mb-20 opacity-0">
            <div className="flex items-center gap-3 opacity-30 mb-3">
              <span className="font-mono text-xs uppercase tracking-widest">
                {t("hero.label")}
              </span>
              <span className="w-12 h-[0.5px] bg-white/40" />
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-[0.9] tracking-tight">
              <em className="italic text-accent">{t("hero.titleAccent2")}</em>
            </h2>
          </div>

          <h1
            ref={heroTextRef}
            className="text-lg md:text-xl lg:text-2xl font-serif font-light tracking-tight opacity-0"
          >
            {t("hero.titleLine1")}{" "}
            <em className="italic text-accent">{t("hero.titleAccent1")}</em>
            <br />
            {t("hero.titleLine2")}
            <br />
            {t("hero.titleLine3")}
            <br />
          </h1>
        </div>
      </div>

      {/* toggle language button — 整塊可點擊 */}
      <button
        ref={langToggleRef}
        type="button"
        onClick={toggleLanguage}
        aria-label={lang === "zh" ? "Switch to English" : "切換至中文"}
        className="z-50 p-3 absolute right-0 top-1/3 -translate-y-1/2 rotate-90 origin-right mr-5 text-xs tracking-widest opacity-0 border border-white/40 bg-primary/40 hover:bg-primary/20 transition-colors cursor-pointer"
      >
        {lang === "zh" ? "EN" : "中文"}
      </button>

      {/* Catalog preview — p5 particle background */}
      {/* <div
        ref={catalogRef}
        className="absolute bottom-12 left-6 md:left-12 w-64 md:w-80 aspect-[4/3] z-20 overflow-hidden shadow-2xl group opacity-0"
      >
        <P5ParticleBackground className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-10 pointer-events-none" />
        <div className="absolute inset-0 flex items-end p-6 z-20 pointer-events-none mix-blend-difference">
          <span className="font-serif text-5xl italic text-white/90">
            {t("hero.catalogLabel")}
          </span>
        </div>
        <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-20 mix-blend-overlay pointer-events-none z-10" />
      </div> */}

      {/* Catalog preview video */}
      {/* <div
        ref={catalogRef}
        className="absolute bottom-12 left-6 md:left-12 w-64 md:w-80 aspect-[4/3] z-20 overflow-hidden shadow-2xl group opacity-0"
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm z-10 pointer-events-none" />
        <div className="absolute inset-0 flex items-end p-6 z-20 pointer-events-none mix-blend-difference">
          <span className="font-serif text-5xl italic text-white/90">
            {t("hero.catalogLabel")}
          </span>
        </div>
        <div className="absolute inset-0 scale-110 group-hover:scale-125 transition-transform duration-[3s] ease-out pointer-events-auto z-0">
          <video
            src="/m-vasilyev_A_white_o.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>
      </div> */}
    </section>
  );
}
