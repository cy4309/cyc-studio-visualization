"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { features } from "@/data";
import { useI18n } from "@/locales/i18n";

function renderFeatureTitle(
  textKey: string,
  accentKeys: string[],
  t: (path: string) => string,
) {
  let remaining = t(textKey);
  const parts: React.ReactNode[] = [];
  accentKeys.forEach((accentKey, i) => {
    const accent = t(accentKey);
    const idx = remaining.indexOf(accent);
    if (idx >= 0) {
      parts.push(remaining.slice(0, idx));
      parts.push(
        <em key={accentKey} className="italic text-accent">
          {accent}
        </em>,
      );
      remaining = remaining.slice(idx + accent.length);
    }
  });
  parts.push(remaining);
  return <>{parts}</>;
}

export default function FeatureListSection() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLHRElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Animate the top description paragraph
      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { opacity: 0, filter: "blur(8px)", y: 40 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: descRef.current, start: "top 85%" },
          },
        );
      }

      // Animate each feature list item
      featureRefs.current.forEach((el, index) => {
        if (!el) return;
        const line = lineRefs.current[index];
        const textWrapper = el.querySelector(".feature-text");

        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 85%" },
        });

        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1,
              ease: "expo.out",
              transformOrigin: "left center",
            },
            0,
          );
        }

        if (textWrapper) {
          tl.fromTo(
            textWrapper,
            { opacity: 0, filter: "blur(10px)", y: 30 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 1.5,
              ease: "power3.out",
            },
            0.2,
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full pb-32 pt-20 px-6 md:px-12 bg-transparent z-20"
    >
      <div className="w-full flex justify-end mb-32">
        <p
          ref={descRef}
          className="max-w-md font-inter text-sm md:text-base leading-relaxed tracking-wide opacity-80 text-justify"
        >
          {t("feature.desc")}
        </p>
      </div>

      <div className="flex flex-col w-full max-w-[90vw] md:max-w-[70vw] mx-auto">
        {features.map((feature, index) => (
          <div
            key={feature.num}
            ref={(el) => {
              featureRefs.current[index] = el;
            }}
            className="relative py-16 md:py-24"
          >
            <hr
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className="absolute top-0 left-0 w-full border-t-[0.5px] border-white/20"
            />
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-3 font-serif text-4xl leading-none opacity-80">
                {feature.num}
              </div>
              <div className="md:col-span-9 feature-text">
                <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-light leading-tight tracking-tight">
                  {renderFeatureTitle(
                    feature.textKey,
                    [
                      feature.accentKey,
                      ...(feature.accent2Key ? [feature.accent2Key] : []),
                    ].filter(Boolean),
                    t,
                  )}
                </h2>
              </div>
            </div>
          </div>
        ))}
        <hr className="w-full border-t-[0.5px] border-white/20 mt-8" />
      </div>
    </section>
  );
}
