"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// This background is fixed behind all sections and has its own parallax effect against the page container
export default function GlobalBackground({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const entryTl = gsap.timeline({ delay: 0.1 });
    if (bgRef.current) {
      entryTl.fromTo(
        bgRef.current,
        { opacity: 0, filter: "brightness(2) contrast(1.2)", scale: 1.05 },
        {
          opacity: 1,
          filter: "brightness(1) contrast(1)",
          scale: 1,
          duration: 2.5,
          ease: "power3.out",
        },
      );

      // Parallax for background image
      if (containerRef.current) {
        gsap.to(bgRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }
  }, [containerRef]);

  return (
    <div className="fixed inset-0 z-0 bg-background pointer-events-none">
      <div
        ref={bgRef}
        className="absolute inset-x-0 top-0 w-full h-[120vh] opacity-0"
      >
        <Image
          src="/a1.jpg"
          // src="/a2.jpg"
          // src="/m-vasilyev_Fashionab.png"
          alt="Hero Background Default"
          fill
          sizes="100vw"
          className="object-cover object-top opacity-80"
          priority
        />
      </div>
      {/* Noise layer */}
      <div className="absolute inset-0 bg-[url('/noise.gif')] opacity-10 mix-blend-screen" />
      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </div>
  );
}
