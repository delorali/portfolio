"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CardStack from "@/components/CardStack";

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 25,
};

const skyDissolve = {
  duration: 0.6,
  ease: "easeInOut" as const,
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

const DARK_PROJECTS = ["gotham"];

const blurLayers = [
  { blur: 3, fadeStart: "30%", fadeEnd: "50%" },
  { blur: 6, fadeStart: "45%", fadeEnd: "70%" },
  { blur: 10, fadeStart: "60%", fadeEnd: "85%" },
];

function ProjectSky({ src }: { src: string }) {
  return (
    <>
      {/* Base sharp layer */}
      <div className="absolute inset-0">
        <Image src={src} alt="" fill className="object-cover" />
      </div>
      {/* Progressive blur layers */}
      {blurLayers.map((layer, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            filter: `blur(${layer.blur}px)`,
            maskImage: `linear-gradient(to bottom, transparent ${layer.fadeStart}, black ${layer.fadeEnd})`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent ${layer.fadeStart}, black ${layer.fadeEnd})`,
          }}
        >
          <Image src={src} alt="" fill className="object-cover" />
        </div>
      ))}
    </>
  );
}

export default function Home() {
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedSkyUrl, setExpandedSkyUrl] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const closeRef = useRef<(() => void) | null>(null);

  const isDarkProject = expandedProjectId !== null && DARK_PROJECTS.includes(expandedProjectId);

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center"
      style={{ overflowX: "clip" }}
      animate={{
        backgroundColor: isDarkProject ? "#18181b" : "#f4f4f5",
      }}
      transition={skyDissolve}
    >
      {/* Sky background — both skies dissolve into each other, masked to fade into page bg */}
      <div
        className="absolute top-[-255px] left-0 right-0 h-[799px] pointer-events-none overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 100%)",
        }}
      >
        {/* Home sky */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: isProjectExpanded ? 0 : 1 }}
          transition={skyDissolve}
        >
          <div className="relative w-full h-full rotate-180 -scale-y-100 blur-[2.5px]">
            <Image
              src="/projects/sky-bg.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        {/* Project sky — dissolves in on top */}
        {expandedSkyUrl && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isProjectExpanded ? 1 : 0 }}
            transition={skyDissolve}
          >
            <ProjectSky src={expandedSkyUrl} />
          </motion.div>
        )}
      </div>

      <Header
        isProjectOpen={isProjectExpanded}
        isDarkProject={isDarkProject}
        onBack={() => closeRef.current?.()}
      />
      <main className="relative flex w-full flex-col items-center">
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
          <CardStack
            onExpandChange={(expanded, projectId, skyBackground) => {
              setIsProjectExpanded(expanded);
              setExpandedProjectId(expanded ? (projectId ?? null) : null);
              if (expanded && skyBackground) {
                setExpandedSkyUrl(skyBackground);
              }
            }}
            closeRef={closeRef}
          />
        </motion.div>
      </main>
    </motion.div>
  );
}
