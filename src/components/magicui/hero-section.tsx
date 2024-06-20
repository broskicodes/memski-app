"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import TextShimmer from "@/components/magicui/text-shimmer";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CAL_LINK } from "@/utils/constants";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { Chat } from "../../components/Chat";

export default function HeroSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const fadeUpVariants = {
    initial: {
      opacity: 0,
      y: 24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section
      id="hero"
      className="relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8"
    >
      <div className="backdrop-filter-[12px] inline-flex h-7 items-center justify-between rounded-full border border-white/5 bg-gray-100/30 px-3 text-xs text-white dark:text-black transition-all ease-in hover:cursor-pointero hover:bg-white/20o group gap-1 translate-y-[-1rem] animate-fade-in opacity-0">
        <TextShimmer className="inline-flex items-center justify-center">
          <span>✨ Introduciing Memski</span>{" "}
          {/* <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" /> */}
        </TextShimmer>
      </div>
      <h1 className="bg-gradient-to-br dark:from-white from-black from-40% dark:to-white/40 to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent text-balance sm:text-6xl md:text-7xl lg:text-8xl translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        An AI that remembers
        {/* <br className="hidden md:block" /> to build landing pages. */}
      </h1>
      <p className="mb-12 text-lg tracking-tight text-gray-400 md:text-xl text-balance translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
        Memski learns your preferences and taste in real time as you chat,
        <br className="hidden md:block" /> so that your responses are perfectly tailored to you.
      </p>
      <Link href={CAL_LINK} target="_blank" className={cn(`translate-y-[-1rem] animate-fade-in gap-1 rounded-lg text-white dark:text-black opacity-0 ease-in-out [--animation-delay:600ms]`, buttonVariants())}>
        <span>Get Started </span>
        <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
      </Link>
      <div
        className="relative mx-auto mt-24 h-full w-full max-w-[768px] rounded-xl border shadow-2xl"
      >
        <div
          className={cn(
            "absolute inset-0 bottom-1/2 h-full w-full transform-gpu [filter:blur(120px)]",

            // light styles
            "[background-image:linear-gradient(to_bottom,#ffaa40,transparent_10%)]",

            // dark styles
            "dark:[background-image:linear-gradient(to_bottom,#ffffff,transparent_30%)]",
          )}
        />
        <div className="p-1 rounded-xl">
          <div className="relative h-96 w-full bg-white rounded-xl z-10">
            <Chat />
          </div>
          {/* <video
            autoPlay
            loop
            muted
            src="memski-v0-demo.mp4"
            className="relative block h-full w-full rounded-xl"
          /> */}
          {/* <img
            src="/hero-light.png"
            className="relative block h-full w-full rounded-xl dark:hidden"
          />
          <img
            src="/hero-dark.png"
            className="relative hidden h-full w-full rounded-xl dark:block"
          /> */}
          <BorderBeam borderWidth={3} size={200} duration={8}/>
        </div>
      </div>
      {/* <div
        ref={ref}
        className="relative mt-[8rem] animate-fade-up opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
      >
        <div
          className={`rounded-xl border border-white/10 bg-white bg-opacity-[0.01] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:h-full before:w-full before:opacity-0 before:[filter:blur(180px)] before:[background-image:linear-gradient(to_bottom,var(--color-one),var(--color-one),transparent_40%)] ${
            inView ? "before:animate-image-glow" : ""
          }`}
        >
          <BorderBeam
            size={200}
            duration={12}
            delay={11}
            colorFrom="var(--color-one)"
            colorTo="var(--color-two)"
          />

          <img
            src="/hero-dark.png"
            alt="Hero Image"
            className="hidden relative w-full h-full rounded-[inherit] border object-contain dark:block"
          />
          <img
            src="/hero-light.png"
            alt="Hero Image"
            className="block relative w-full h-full  rounded-[inherit] border object-contain dark:hidden"
          />
        </div>
      </div> */}
    </section>
  );
}
