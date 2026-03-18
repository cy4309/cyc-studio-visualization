"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { teamMembers } from "@/data";
import { useI18n } from "@/locales/i18n";

export default function AboutSection() {
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
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 30%",
              scrub: 2,
            },
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
        <div className="flex items-center gap-3 opacity-30 mb-3">
          <span className="font-mono text-xs uppercase tracking-widest">
            {t("team.label")}
          </span>
          <span className="w-12 h-[0.5px] bg-white/40" />
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
              {/* Image or iframe (first member) */}
              <div className="md:col-span-6 [direction:ltr]">
                <div
                  className={`relative w-full overflow-hidden group aspect-[3/4]`}
                >
                  {index === 0 ? (
                    <>
                      <iframe
                        src="https://chu-yu-cheng.vercel.app/"
                        title={t(member.nameKey)}
                        allow="accelerometer; gyroscope"
                        className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                        suppressHydrationWarning
                      />
                      {/* 透明遮罩：阻擋 iframe 接收觸控，touch-action: pan-y 讓滑動傳給父層 */}
                      <div
                        className="absolute inset-0 z-20 touch-pan-y"
                        aria-hidden
                      />
                    </>
                  ) : (
                    <Image
                      src={member.img}
                      alt={t(member.nameKey)}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-center scale-125 group-hover:scale-150 transition-transform duration-[1500ms] ease-out"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-10 mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </div>

              {/* Text content */}
              <div className="md:col-span-6 flex flex-col justify-center gap-6 [direction:ltr]">
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
