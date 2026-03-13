"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/locales/i18n";
// import P5ParticleBackground from "@/components/P5ParticleBackground";

export default function HeroSection() {
  const { lang, setLang, t } = useI18n();

  const toggleLanguage = () => {
    setLang((prev) => (prev === "zh" ? "en" : "zh"));
  };
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Entry Animation
      // The background flash animation takes 2.5s starting at 0.1s.
      // The original timeline used "-=2", which means this animation starts at 0.6s.
      const entryTl = gsap.timeline({ delay: 0.6 });
      const elementsToFade = [
        headerRef.current,
        heroTextRef.current,
        catalogRef.current,
      ].filter(Boolean);

      if (elementsToFade.length > 0) {
        entryTl.fromTo(
          elementsToFade,
          { opacity: 0, filter: "blur(10px)", y: 30 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.5,
            stagger: 0.15,
            ease: "power3.out",
          },
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
    <section ref={containerRef} className="relative w-full h-[100dvh]">
      {/* Navigation Header */}
      <header
        ref={headerRef}
        className="absolute top-0 inset-x-0 z-50 flex justify-between items-start pt-6 px-6 md:px-12 uppercase text-xs tracking-widest font-inter mix-blend-difference pb-6 transition-colors duration-300 opacity-0"
      >
        <div className="leading-tight">
          <Image
            src="/cyc-logo.png"
            alt="CYC Studio"
            width={48}
            height={48}
            className="h-8 w-auto"
          />
        </div>

        <nav className="flex flex-col text-right gap-1">
          <a href="#ourmission" className="hover:opacity-70 transition-opacity">
            {t("nav.mission")}
          </a>
          <a href="#catalog" className="hover:opacity-70 transition-opacity">
            {t("nav.catalog")}
          </a>
          <a href="#team" className="hover:opacity-70 transition-opacity">
            {t("nav.team")}
          </a>
          <a href="#contacts" className="hover:opacity-70 transition-opacity">
            {t("nav.contacts")}
          </a>
        </nav>
      </header>

      <div className="relative z-10 w-full h-full p-6 md:p-12 flex flex-col justify-center">
        <div className="mt-20 self-center md:self-start max-w-4xl mix-blend-difference z-20">
          <h1
            ref={heroTextRef}
            className="text-xl md:text-3xl lg:text-5xl font-serif font-light leading-[1.1] tracking-tight opacity-0"
          >
            {t("hero.titleLine1")}{" "}
            <em className="italic text-accent">{t("hero.titleAccent1")}</em>
            <br />
            {t("hero.titleLine2")}
            <br />
            {t("hero.titleLine3")}
            <br />
            <em className="italic text-accent">{t("hero.titleAccent2")}</em>
          </h1>
        </div>
      </div>

      {/* toggle language button */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 origin-right mr-4 text-xs tracking-widest uppercase opacity-70 bg-black p-3 z-50">
        <button
          type="button"
          onClick={toggleLanguage}
          className="hover:opacity-70 transition-opacity self-end"
        >
          {lang === "zh" ? "EN" : "中文"}
        </button>
      </div>

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
