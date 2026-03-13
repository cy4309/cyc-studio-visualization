"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gridItems } from "@/data";
import { useI18n } from "@/locales/i18n";

export default function CatalogGridSection() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Animate the image grid
      if (imageRefs.current.length > 0) {
        gsap.fromTo(
          imageRefs.current,
          { opacity: 0, filter: "blur(4px)", y: 50 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: { trigger: imageRefs.current[0], start: "top 80%" },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full pb-40 pt-20 px-6 md:px-12 bg-background z-20"
    >
      <div className="flex flex-col gap-8 w-full max-w-[90vw] md:max-w-[70vw] mx-auto">
        {/* Top row of 3 images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-x-12 items-end">
          {gridItems.slice(0, 3).map((item, i) => (
            <div
              key={item.src}
              ref={(el) => {
                imageRefs.current[i] = el;
              }}
              className="flex flex-col gap-3 group"
            >
              <div
                className={`relative w-full overflow-hidden ${
                  i === 1 ? "aspect-square" : "aspect-[3/4]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={t(item.labelKey)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-15 mix-blend-overlay pointer-events-none" />
              </div>
              <div className="font-mono text-xs tracking-widest uppercase">
                {t(item.labelKey)}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row — offset single image */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-x-12 mt-12 md:mt-24">
          <div
            ref={(el) => {
              imageRefs.current[3] = el;
            }}
            className="md:col-span-1 flex flex-col gap-3 group"
          >
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={gridItems[3].src}
                alt={t(gridItems[3].labelKey)}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-15 mix-blend-overlay pointer-events-none" />
            </div>
            <div className="font-mono text-xs tracking-widest uppercase">
              {t(gridItems[3].labelKey)}
            </div>
          </div>
          <div className="hidden md:block md:col-span-2 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
