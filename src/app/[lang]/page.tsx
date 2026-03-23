"use client";

import { useRef } from "react";
import GlobalBackground from "@/components/GlobalBackground";
import HeroSection from "@/components/HeroSection";
import FeatureListSection from "@/components/FeatureListSection";
import CatalogScrollSection from "@/components/CatalogScrollSection";
import AboutSection from "@/components/AboutSection";
import ContactsSection from "@/components/ContactsSection";
import Footer from "@/components/Footer";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative w-full text-foreground">
      <GlobalBackground containerRef={containerRef} />
      <HeroSection />
      <FeatureListSection />
      <CatalogScrollSection />
      <AboutSection />
      <ContactsSection />
      <Footer />
    </div>
  );
}
