"use client";

import { motion } from "motion/react";

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
    <section className="flex h-[120px] items-end px-[240px] w-full">
      <div className="flex flex-1 flex-col gap-4 items-start">
        <motion.h1
          className="text-[54px] font-semibold leading-[56px] tracking-[-0.594px] text-foreground"
          {...fadeUp}
          transition={{ ...springTransition, delay: 0 }}
        >
          Delora Li
        </motion.h1>
        <motion.div
          className="flex flex-col gap-1"
          {...fadeUp}
          transition={{ ...springTransition, delay: 0.1 }}
        >
          <p className="text-[17px] font-semibold leading-[22px] tracking-[-0.068px] text-foreground">
            Leading design @ Liquid AI.
          </p>
          <div className="flex gap-1 text-[15px] leading-[20px] tracking-[-0.06px]">
            <span className="text-foreground">Previously @</span>
            <span className="text-foreground">Palantir.</span>
            <span className="text-foreground">Meta.</span>
            <span className="text-foreground">Osmo.</span>
            <span className="text-muted-foreground">& more</span>
          </div>
        </motion.div>
      </div>
      <motion.div
        className="shrink-0"
        {...fadeUp}
        transition={{ ...springTransition, delay: 0.2 }}
      >
        <p className="w-[392px] text-[13px] leading-[18px] tracking-[-0.026px] text-foreground">
          A product designer specializing in complex, data-rich
          challenges—designing systems that push the frontier of what technology
          can enable.
        </p>
      </motion.div>
    </section>
  );
}
