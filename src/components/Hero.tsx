"use client";

import { motion } from "motion/react";
import Image from "next/image";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
};

export default function Hero() {
  return (
    <section className="flex flex-col md:flex-row md:h-[120px] md:items-end px-5 md:px-[80px] lg:px-[240px] w-full gap-6 md:gap-0">
      <div className="flex flex-1 flex-col gap-3 md:gap-4 items-start">
        <motion.div
          className="flex flex-col gap-4 items-start"
          {...fadeUp}
          transition={{ ...springTransition, delay: 0 }}
        >
          <Image
            src="/projects/star-icon.svg"
            alt=""
            width={41}
            height={41}
            className="pointer-events-none"
          />
          <h1
            className="text-[36px] md:text-[54px] font-normal leading-[1.1] md:leading-[56px] tracking-[-0.03em] text-foreground"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
            Hi, I&apos;m <em className="not-italic" style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}>Delora</em>.
          </h1>
        </motion.div>
        <motion.div
          className="flex flex-col gap-1"
          {...fadeUp}
          transition={{ ...springTransition, delay: 0.1 }}
        >
          <p className="text-[15px] md:text-[17px] md:font-medium leading-[20px] md:leading-[22px] tracking-[-0.06px] md:tracking-[-0.068px] text-foreground">
            Currently leading design @ Liquid AI.
          </p>
          <div className="flex gap-1 text-[13px] md:text-[15px] leading-[18px] md:leading-[20px] tracking-[-0.026px] md:tracking-[-0.06px]">
            <span className="text-foreground">Previously @</span>
            <span className="text-foreground">Palantir.</span>
            <span className="text-foreground">Meta.</span>
            <span className="text-foreground">Osmo.</span>
            <span className="text-muted-foreground">& more</span>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="shrink-0 self-end md:self-auto"
        {...fadeUp}
        transition={{ ...springTransition, delay: 0.2 }}
      >
        <p className="w-[280px] md:w-[392px] text-right md:text-left text-[12px] md:text-[13px] leading-[16px] md:leading-[18px] tracking-[-0.026px] text-foreground">
          A product designer specializing in complex, data-rich
          challenges—designing systems that push the frontier of what technology
          can enable.
        </p>
      </motion.div>
    </section>
  );
}
