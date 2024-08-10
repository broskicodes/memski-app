"use client"

import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import ClientSection from "@/components/magicui/client-section";
import CallToActionSection from "@/components/magicui/cta-section";
import DotPattern from "@/components/magicui/dot-pattern";
import HeroSection from "@/components/magicui/hero-section";
import Particles from "@/components/magicui/particles";
import PricingSection from "@/components/magicui/pricing-section";
import { SiteFooter } from "@/components/magicui/site-footer";
import { SiteHeader } from "@/components/magicui/site-header";
import { SphereMask } from "@/components/magicui/sphere-mask";
import { cn } from "@/lib/utils";
import { HardDriveDownloadIcon, FilesIcon } from "lucide-react";

const features = [
  {
    Icon: HardDriveDownloadIcon,
    name: "Long-term memory",
    description: "Save select data from user interactions for recall later.",
    href: "",
    cta: "Learn more",
    className: "col-span-1 sm:col-span-2",
    background: (
      <div className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    Icon: FilesIcon,
    name: "Context management",
    description: "Dynamically update the context provided to the LLM call based on the user's query.",
    href: "",
    cta: "Learn more",
    className: "col-span-1 sm:col-span-2",
    background: (
      <div className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  // {
  //   Icon: BellIcon,
  //   name: "",
  //   description: "Dynamically update the context provided to the LLM call based on the user's query.",
  //   href: "",
  //   cta: "Learn more",
  //   className: "col-span-3 lg:col-span-2",
  //   background: (
  //     <div className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
  //   ),
  // },
]

export default function Home() {

  return (
    <div className="h-full">
      <SiteHeader />
      <DotPattern
        className={cn(
          "w-full h-full opacity-30",
        )}
      />
      <HeroSection />
      {/* <ClientSection /> */}
      {/* <SphereMask /> */}
      {/* <PricingSection /> */}
      <div className="container flex w-full flex-col items-center justify-center p-4">
        <BentoGrid className="pt-24 mx-auto max-w-[1000px]">
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </div>
      <CallToActionSection />
      {/* <Particles
        className="absolute inset-0 -z-10"
        quantity={50}
        ease={70}
        size={0.05}
        staticity={40}
        color={"#000000"}
      /> */}
      <SiteFooter />
    </div>
  );
}
