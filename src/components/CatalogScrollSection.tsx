"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { catalogCategories } from "@/data";
import { useI18n } from "@/locales/i18n";

export default function CatalogScrollSection() {
  const { t } = useI18n();
  const catalogSectionRef = useRef<HTMLElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Horizontal scroll for catalog section
      if (catalogSectionRef.current && horizontalTrackRef.current) {
        const section = catalogSectionRef.current;
        const track = horizontalTrackRef.current;
        const numCards = catalogCategories.length;
        const getScrollDistance = () => track.scrollWidth - window.innerWidth;
        const panelTexts = Array.from(
          track.querySelectorAll<HTMLElement>(".h-panel-text"),
        );
        const backgrounds = Array.from(
          section.querySelectorAll<HTMLElement>(".catalog-bg"),
        );

        // Entrance color transition
        gsap.fromTo(
          section,
          { backgroundColor: "#0c0c0c" },
          {
            backgroundColor: "#000000",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 20%",
              scrub: true,
            },
          },
        );

        // Set initial state — all except first are invisible
        panelTexts.forEach((el, i) => {
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
        });

        // Create a timeline to allow pauses before and after the horizontal scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            // Increase the total scroll distance by 1.5 viewport heights to allow for pauses
            end: () => `+=${getScrollDistance() + window.innerHeight * 1.5}`,
            invalidateOnRefresh: true,
          },
        });

        tl.to({}, { duration: 0.15 }) // Pause when entering the section
          .to(track, {
            x: () => -getScrollDistance(),
            ease: "none",
            duration: 1,
            onUpdate: function () {
              // Use the progress of THIS specific tween, not the entire scrollTrigger timeline
              const rawProgress = this.progress() * (numCards - 1);

              backgrounds.forEach((bg, i) => {
                const dist = Math.abs(rawProgress - i);
                const opacity = Math.max(0, 1 - dist);
                gsap.set(bg, { opacity });
              });

              panelTexts.forEach((el, i) => {
                const dist = Math.abs(rawProgress - i);
                const opacity = Math.max(0, 1 - dist * 2);
                const y = (1 - opacity) * 20;
                gsap.set(el, { opacity, y });
              });
            },
          })
          .to({}, { duration: 0.15 }); // Pause when finishing the scroll before unpinning
      }
    }, catalogSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="catalog"
      ref={catalogSectionRef}
      className="relative w-full h-screen overflow-hidden bg-background z-20"
    >
      {/* Background cross-fade layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {catalogCategories.map((cat, i) => (
          <div
            key={`bg-${cat.id}`}
            className="catalog-bg absolute inset-0 transition-opacity duration-300 ease-out"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <Image
              src={cat.img}
              alt=""
              fill
              sizes="100vw"
              className="object-cover scale-125"
            />
            <div className="absolute inset-0 bg-black/80" />
          </div>
        ))}
      </div>

      {/* Section label — stays fixed in top-left while panels scroll */}
      {/* <div className="absolute top-8 left-6 md:left-12 z-30 flex items-center gap-4">
        <p className="font-mono text-xs tracking-widest uppercase opacity-40">
          {t("catalog.label")}
        </p>
        <span className="inline-block w-8 h-[0.5px] bg-white/20" />
        <p className="font-mono text-xs tracking-widest uppercase opacity-20">
          {catalogCategories.length} {t("catalog.categories")}
        </p>
      </div> */}

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-6 md:left-12 z-30 flex items-center gap-3 opacity-30">
        <span className="font-mono text-xs uppercase tracking-widest">
          {t("catalog.scroll")}
        </span>
        <span className="w-12 h-[0.5px] bg-white/40" />
      </div>

      {/* Horizontal track */}
      <div
        ref={horizontalTrackRef}
        className="flex h-full items-center will-change-transform z-10 relative pt-16 md:pt-0"
        style={{ width: `max-content` }}
      >
        {/* Starting padding to center the first card */}
        <div className="w-[10vw] md:w-[30vw] flex-shrink-0" />

        {catalogCategories.map((cat, i) => (
          <a
            key={cat.id}
            href={cat.href}
            className={`catalog-card relative flex-shrink-0 w-[80vw] md:w-[40vw] h-[60vh] md:h-[70vh] ${
              i !== catalogCategories.length - 1 ? "mr-[10vw] md:mr-[20vw]" : ""
            } overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
          >
            {/* Full-bleed background image */}
            <Image
              src={cat.img}
              alt={t(cat.labelKey)}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover scale-105 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
              priority={i === 0}
            />

            {/* Noise grain */}
            <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-10 mix-blend-overlay pointer-events-none z-10" />

            {/* Dark vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent z-10" />

            {/* Panel number */}
            <span className="absolute top-8 right-8 font-mono text-xs tracking-widest opacity-30 z-20">
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Text content */}
            <div className="h-panel-text absolute bottom-0 left-0 p-8 md:p-12 z-20 max-w-lg">
              <p className="font-mono text-xs tracking-widest uppercase opacity-50 mb-3 md:mb-4">
                {t(cat.labelKey)}
              </p>
              <h3 className="font-serif text-4xl md:text-6xl font-light leading-[0.9] tracking-tight text-white mb-4 md:mb-6">
                {i === 0 ? (
                  <>
                    <em className="italic text-accent">
                      {t("catalog.homeTitle")}
                    </em>
                    <br />
                    {t("catalog.homeSub")}
                  </>
                ) : i === 1 ? (
                  <>
                    <em className="italic text-accent">
                      {t("catalog.officeTitle")}
                    </em>
                    <br />
                    {t("catalog.officeSub")}
                  </>
                ) : i === 2 ? (
                  <>
                    <em className="italic text-accent">
                      {t("catalog.giftTitle")}
                    </em>
                    <br />
                    {t("catalog.giftSub")}
                  </>
                ) : (
                  <>
                    {t("catalog.eventTitle")}
                    <br />
                    <em className="italic text-accent">
                      {t("catalog.eventSub")}
                    </em>
                  </>
                )}
              </h3>
              <p className="font-inter text-sm md:text-base leading-relaxed opacity-70">
                {t(cat.sublabelKey)}
              </p>
              <div className="mt-6 flex items-center gap-4 text-xs font-mono uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <span>{t("catalog.explore")}</span>
                <span className="w-8 h-[0.5px] bg-white group-hover:w-16 transition-all duration-700" />
              </div>
            </div>
          </a>
        ))}

        {/* Ending padding */}
        <div className="w-[10vw] md:w-[30vw] flex-shrink-0" />
      </div>
    </section>
  );
}
