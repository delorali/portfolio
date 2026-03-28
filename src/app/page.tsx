"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CardStack from "@/components/CardStack";

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
};

export default function Home() {
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary">
      <Header />
      <main className="flex w-full flex-col items-center">
        <motion.div
          animate={{
            opacity: isProjectExpanded ? 0 : 1,
            height: isProjectExpanded ? 0 : "auto",
            marginTop: isProjectExpanded ? 0 : 200,
            marginBottom: isProjectExpanded ? 0 : 160,
          }}
          transition={springTransition}
          className="w-full overflow-hidden"
        >
          <Hero />
        </motion.div>

        <motion.div
          className="w-full flex flex-col items-center"
          animate={{
            paddingTop: isProjectExpanded ? 64 : 0,
            paddingBottom: isProjectExpanded ? 16 : 160,
          }}
          transition={springTransition}
        >
          <CardStack onExpandChange={setIsProjectExpanded} />
        </motion.div>
      </main>
    </div>
  );
}
