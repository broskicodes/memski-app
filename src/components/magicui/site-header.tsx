"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CAL_LINK } from "@/utils/constants";
import { AnimatePresence, motion } from "framer-motion";
import { AlignJustify, ArrowRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { WlsModal } from "../WlsModal";

const menuItem = [
  {
    id: 1,
    label: "Features",
    href: "/features",
  },
  {
    id: 2,
    label: "Pricing",
    href: "#",
  },
  {
    id: 3,
    label: "Careers",
    href: "#",
  },
  {
    id: 4,
    label: "Contact Us",
    href: "#",
  },
];

export function SiteHeader() {
  const mobilenavbarVariant = {
    initial: {
      opacity: 0,
      scale: 1,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  const mobileLinkVar = {
    initial: {
      y: "-20px",
      opacity: 0,
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

  useEffect(() => {
    const html = document.querySelector("html");
    if (html) html.classList.toggle("overflow-hidden", hamburgerMenuIsOpen);
  }, [hamburgerMenuIsOpen]);

  useEffect(() => {
    const closeHamburgerNavigation = () => setHamburgerMenuIsOpen(false);
    window.addEventListener("orientationchange", closeHamburgerNavigation);
    window.addEventListener("resize", closeHamburgerNavigation);

    return () => {
      window.removeEventListener("orientationchange", closeHamburgerNavigation);
      window.removeEventListener("resize", closeHamburgerNavigation);
    };
  }, [setHamburgerMenuIsOpen]);

  return (
    <>
      <header className="fixed left-0 top-0 z-50 w-full translate-y-[-1rem] animate-fade-in border-b opacity-0 backdrop-blur-[12px] [--animation-delay:600ms]">
        <div className="container flex h-[3.5rem] items-center justify-between">
          <Link className="text-md flex items-center" href="/">
            Memski
          </Link>

          <div className="ml-auto flex h-full items-center">
            <WlsModal>
              <Button className={cn(`translate-y-[-1rem] animate-fade-in gap-1 rounded-lg text-white dark:text-black opacity-0 ease-in-out [--animation-delay:600ms]`, buttonVariants({ variant: "secondary" }))}>
                <span>Join the Waitlist</span>
                <ArrowRightIcon className="ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
              </Button>
            </WlsModal>
          </div>
          {/* <button
            className="ml-6 md:hidden"
            onClick={() => setHamburgerMenuIsOpen((open) => !open)}
          >
            <span className="sr-only">Toggle menu</span>
            {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
          </button> */}
        </div>
      </header>
      <AnimatePresence>
        <motion.nav
          initial="initial"
          exit="exit"
          variants={mobilenavbarVariant}
          animate={hamburgerMenuIsOpen ? "animate" : "exit"}
          className={cn(
            `fixed left-0 top-0 z-50 h-screen w-full overflow-auto bg-background/70 backdrop-blur-[12px] `,
            {
              "pointer-events-none": !hamburgerMenuIsOpen,
            }
          )}
        >
          <div className="container flex h-[3.5rem] items-center justify-between">
            <Link className="text-md flex items-center" href="/">
              Memski
            </Link>

            <button
              className="ml-6 md:hidden"
              onClick={() => setHamburgerMenuIsOpen((open) => !open)}
            >
              <span className="sr-only">Toggle menu</span>
              {hamburgerMenuIsOpen ? <XIcon /> : <AlignJustify />}
            </button>
          </div>
          <motion.ul
            className={`flex flex-col md:flex-row md:items-center uppercase md:normal-case ease-in`}
            variants={containerVariants}
            initial="initial"
            animate={hamburgerMenuIsOpen ? "open" : "exit"}
          >
            {menuItem.map((item) => (
              <motion.li
                variants={mobileLinkVar}
                key={item.id}
                className="border-grey-dark pl-6 py-0.5 border-b md:border-none"
              >
                <Link
                  className={`hover:text-grey flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 md:translate-y-0 md:text-sm md:transition-colors ${
                    hamburgerMenuIsOpen ? "[&_a]:translate-y-0" : ""
                  }`}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </motion.nav>
      </AnimatePresence>
    </>
  );
}
