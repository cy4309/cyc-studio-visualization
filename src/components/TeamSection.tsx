"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "@/data";
import { useI18n } from "@/locales/i18n";

export default function TeamSection() {
  const { t } = useI18n();
  const teamSectionRef = useRef<HTMLDivElement>(null);
  const teamMemberRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Animate team members
      teamMemberRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 70, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.3,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });
    }, teamSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="team"
      ref={teamSectionRef}
      className="relative w-full py-32 px-6 md:px-12 bg-background z-20"
    >
      <div className="absolute top-0 inset-x-0 h-[0.5px] bg-white/10" />

      <div className="w-full max-w-[90vw] md:max-w-[70vw] mx-auto">
        {/* Section intro */}
        <div className="mb-24">
          <p className="font-mono text-xs tracking-widest uppercase opacity-50 mb-6">
            {t("team.label")}
          </p>
          <h2 className="text-4xl md:text-6xl font-serif font-light leading-[0.9] tracking-tight max-w-2xl">
            {t("team.heading1")}
            <br />
            {t("team.heading2")}{" "}
            <em className="italic text-accent">{t("team.heading3")}</em>
            <br />
            {t("team.heading4")}
          </h2>
        </div>

        {/* Team member cards */}
        <div className="flex flex-col divide-y divide-white/10">
          {teamMembers.map((member, index) => (
            <div
              key={member.img}
              ref={(el) => {
                teamMemberRefs.current[index] = el;
              }}
              className={`py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start ${
                member.align === "right" ? "" : "md:[direction:rtl]"
              }`}
            >
              {/* Image */}
              <div className="md:col-span-5 [direction:ltr]">
                <div className="relative w-full aspect-[3/4] overflow-hidden group">
                  <Image
                    src={member.img}
                    alt={t(member.nameKey)}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-center scale-125 group-hover:scale-150 transition-transform duration-[1500ms] ease-out"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-10 mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>

              {/* Text content */}
              <div className="md:col-span-7 flex flex-col justify-center gap-6 [direction:ltr]">
                <div>
                  <p className="font-mono text-xs tracking-widest uppercase opacity-40 mb-2">
                    {t(member.roleKey)}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-serif font-light leading-tight tracking-tight">
                    {t(member.nameKey)}
                  </h3>
                </div>

                <p className="font-inter text-sm leading-relaxed tracking-wide opacity-70 max-w-md">
                  {t(member.descKey)}
                </p>

                <p className="font-serif text-lg italic text-accent/80 leading-snug max-w-xs">
                  {t(member.taglineKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
