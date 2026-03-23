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
    let alive = true;
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
              scrub: 2,
            },
          },
        );

        // Set initial state — all except first are invisible
        panelTexts.forEach((el, i) => {
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
        });

        // Progress 0~1 對應整體捲動，用於計算 track.x 與視覺
        // 注意：勿在 timeline onUpdate 裡對這些節點呼叫 gsap.set() — gsap.context 會在回呼時報 Invalid scope
        // （ScrollTrigger 更新時機與 context 範圍檢查不相容）。改用手動寫 style。
        const scrollProgress = { value: 0 };
        const updateVisuals = () => {
          if (!alive || !section.isConnected || !track.isConnected) return;
          const rawProgress = scrollProgress.value * (numCards - 1);
          const x = -scrollProgress.value * getScrollDistance();
          track.style.transform = `translate3d(${x}px,0,0)`;

          backgrounds.forEach((bg, i) => {
            const dist = Math.abs(rawProgress - i);
            bg.style.opacity = String(Math.max(0, 1 - dist));
          });
          panelTexts.forEach((el, i) => {
            const dist = Math.abs(rawProgress - i);
            const opacity = Math.max(0, 1 - dist * 2);
            el.style.opacity = String(opacity);
            el.style.transform = `translate3d(0,${(1 - opacity) * 20}px,0)`;
          });
        };

        // 每個項目之間加入停頓，讓使用者有時間閱讀
        const pauseDuration = 0.35; // 每個項目停頓時間（越大停越久）
        const scrollSegmentDuration = 0.8; // 項目間捲動時間（越小切換越快）

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 2.5,
            // 增加捲動距離以容納各項目停頓
            end: () =>
              `+=${getScrollDistance() + window.innerHeight * (1.5 + numCards * 0.6)}`,
            invalidateOnRefresh: true,
          },
        });

        tl.to(scrollProgress, { value: 0, duration: 0.15 }); // 進入 section 時停頓

        for (let i = 1; i <= numCards - 1; i++) {
          const targetProgress = i / (numCards - 1);
          tl.to(scrollProgress, {
            value: targetProgress,
            duration: scrollSegmentDuration,
            ease: "power2.inOut",
            onUpdate: updateVisuals,
          }).to(scrollProgress, {
            value: targetProgress,
            duration: pauseDuration,
            onUpdate: updateVisuals,
          });
        }

        tl.to(scrollProgress, {
          value: 1,
          duration: 0.2,
          onUpdate: updateVisuals,
        }); // 最後一項停頓

        updateVisuals();
      }
    }, catalogSectionRef);

    return () => {
      alive = false;
      ctx.revert();
    };
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
              alt={i === 0 ? t(cat.labelKey) : ""}
              fill
              sizes="100vw"
              className="object-cover scale-125"
            />
            <div className="absolute inset-0 bg-black/80" />
          </div>
        ))}
      </div>

      {/* Section label — stays fixed in top-left while panels scroll */}
      <div className="absolute bottom-8 left-6 md:left-12 z-30 flex items-center gap-3 opacity-30">
        <span className="font-mono text-xs uppercase tracking-widest opacity-40">
          {t("catalog.label")}
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
                {t(cat.labelKey)}
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
