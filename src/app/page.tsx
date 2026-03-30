"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CardStack from "@/components/CardStack";

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function Home() {
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const isMobile = useIsMobile();
  const closeRef = useRef<(() => void) | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center bg-secondary">
      <Header isProjectOpen={isProjectExpanded} onBack={() => closeRef.current?.()} />
      <main className="flex w-full flex-col items-center">
        <motion.div
          animate={{
            opacity: isProjectExpanded ? 0 : 1,
            height: isProjectExpanded ? 0 : "auto",
            marginTop: isProjectExpanded ? 0 : isMobile ? 120 : 200,
            marginBottom: isProjectExpanded ? 0 : isMobile ? 80 : 160,
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
            paddingBottom: isProjectExpanded ? 16 : isMobile ? 80 : 160,
          }}
          transition={springTransition}
        >
          <CardStack onExpandChange={setIsProjectExpanded} closeRef={closeRef} />
        </motion.div>
      </main>
    </div>
  );
}
