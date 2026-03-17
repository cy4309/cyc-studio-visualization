"use client";

import { useRef } from "react";
import GlobalBackground from "@/components/GlobalBackground";
import HeroSection from "@/components/HeroSection";
import FeatureListSection from "@/components/FeatureListSection";
// import CatalogGridSection from "@/components/CatalogGridSection";
// import MissionSection from "@/components/MissionSection";
import CatalogScrollSection from "@/components/CatalogScrollSection";
// import TeamSection from "@/components/TeamSection";
import AboutSection from "@/components/AboutSection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full text-foreground">
      {/* Background Image / Texture (Fixed for Parallax) */}
      <GlobalBackground containerRef={containerRef} />

      {/* ── HERO SECTION ── */}
      <HeroSection />

      {/* ── FEATURE LIST SECTION ── */}
      <FeatureListSection />

      {/* ── CATALOG GRID SECTION (existing 4-image grid) ── */}
      {/* <CatalogGridSection /> */}

      {/* ── OUR MISSION SECTION ── */}
      {/* <MissionSection /> */}

      {/* ── CATALOG CATEGORIES — HORIZONTAL SCROLL ── */}
      <CatalogScrollSection />

      {/* ── TEAM SECTION ── */}
      {/* <TeamSection /> */}

      {/* ── TEAM SECTION ── */}
      <AboutSection />

      {/* ── CONTACTS SECTION ── */}
      <ContactsSection />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
