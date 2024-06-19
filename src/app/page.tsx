"use client"

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import ClientSection from "@/components/magicui/client-section";
import CallToActionSection from "@/components/magicui/cta-section";
import DotPattern from "@/components/magicui/dot-pattern";
import HeroSection from "@/components/magicui/hero-section";
import Particles from "@/components/magicui/particles";
import PricingSection from "@/components/magicui/pricing-section";
import { SphereMask } from "@/components/magicui/sphere-mask";
import { cn } from "@/lib/utils";

export default function Home() {
  

  return (
    <div className="h-full">
      <DotPattern
        className={cn(
          "w-full h-full opacity-30",
        )}
      />
      <HeroSection />
      {/* <ClientSection /> */}
      {/* <SphereMask /> */}
      {/* <PricingSection /> */}
      {/* <BentoGrid>
        <BentoCard />
      </BentoGrid> */}
      <CallToActionSection />
      {/* <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#000000"}
      /> */}
    </div>
  );
}
