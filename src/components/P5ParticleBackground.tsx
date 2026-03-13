"use client";

import { useEffect, useRef } from "react";
import type P5 from "p5";

type Particle = {
  x: number;
  y: number;
  clr: ReturnType<P5["color"]>;
};

export default function P5ParticleBackground({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    let p5Instance: P5 | null = null;

    const initP5 = async () => {
      const p5 = (await import("p5")).default;
      const particles: Particle[] = [];

      const sketch = (p: P5) => {
        p.setup = () => {
          const w = el.offsetWidth || 256;
          const h = el.offsetHeight || 192;
          p.createCanvas(w, h);
          p.colorMode(p.HSB, 360, 100, 100);
          p.background(0);

          for (let o = 0; o < h; o += 10) {
            for (let i = 0; i < w; i += 10) {
              particles.push({
                x: i,
                y: o,
                clr: p.color(p.noise(i / 50, o / 50) * 360, 80, 100),
              });
            }
          }
        };

        p.draw = () => {
          p.noStroke();
          p.background(0, 0.001);

          for (let i = 0; i < particles.length; i++) {
            const pt = particles[i];
            p.fill(pt.clr);
            p.ellipse(pt.x, pt.y, 1);
            pt.x += (p.noise(pt.x / 200, pt.y / 200, 1000) - 0.5) * 2;
            pt.y += (p.noise(pt.x / 200, pt.y / 200, 10000) - 0.5) * 2;
          }
        };

        p.windowResized = () => {
          const w = el.offsetWidth || 256;
          const h = el.offsetHeight || 192;
          p.resizeCanvas(w, h);
        };
      };

      p5Instance = new p5(sketch, el);
    };

    initP5();

    return () => {
      if (p5Instance) {
        p5Instance.remove();
      }
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
