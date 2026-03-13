"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "@/locales/i18n";

export default function MissionSection() {
  const { t } = useI18n();
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Animate mission section
      if (missionRef.current) {
        gsap.fromTo(
          missionRef.current.querySelectorAll(".mission-anim"),
          { opacity: 0, y: 50, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: missionRef.current, start: "top 75%" },
          },
        );
      }
    }, missionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ourmission"
      ref={missionRef}
      className="relative w-full py-32 px-6 md:px-12 bg-background z-20 overflow-hidden"
    >
      {/* Subtle top border */}
      <div className="absolute top-0 inset-x-0 h-[0.5px] bg-white/10" />

      <div className="w-full max-w-[90vw] md:max-w-[70vw] mx-auto">
        {/* Large italic heading */}
        <div className="mb-20 mission-anim">
          <p className="font-mono text-xs tracking-widest uppercase opacity-50 mb-6">
            {t("mission.label")}
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-[0.9] tracking-tight">
            <em className="italic text-accent">{t("mission.heading1")}</em>{" "}
            {t("mission.heading2")}
            <br />
            {t("mission.heading3")}{" "}
            <em className="italic">{t("mission.heading4")}</em>
          </h2>
        </div>

        {/* Mission body text — two columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mission-anim">
          <p className="font-inter text-sm leading-relaxed tracking-wide opacity-75">
            {t("mission.body1")}
          </p>
          <p className="font-inter text-sm leading-relaxed tracking-wide opacity-75">
            {t("mission.body2")}
          </p>
        </div>

        {/* The famous line */}
        <div className="mt-20 mission-anim">
          <div className="h-[0.5px] w-full bg-white/10 mb-10" />
          <p className="text-xl md:text-2xl font-inter font-light tracking-wide opacity-60 max-w-xl">
            {t("mission.line")}
          </p>
          <p className="mt-8 font-inter text-sm leading-relaxed tracking-wide opacity-60 max-w-lg">
            {t("mission.body3")}
          </p>
        </div>
      </div>
    </section>
  );
}
