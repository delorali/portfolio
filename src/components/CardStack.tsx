"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import ProjectCard, { type Project } from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import { Badge } from "./ui/badge";

export type { Project };

const CARD_HEIGHT = 349;
const STACK_OFFSET = 72;
const HOVER_GAP = 8;

const shadowSm =
  "0px 0.5px 1px rgba(0,0,0,0.04), 0px 1px 3px rgba(0,0,0,0.06)";
const shadowLg =
  "0px 2px 4px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.06), 0px 12px 32px rgba(0,0,0,0.12)";

const springTransition = {
  type: "spring" as const,
  stiffness: 200,
  damping: 28,
};

const expandTransition = {
  type: "spring" as const,
  stiffness: 150,
  damping: 22,
};

const projects: Project[] = [
  {
    id: "gotham",
    title: "Palantir Gotham",
    year: "2026",
    isDark: true,
    tags: ["Defense", "Geospatial & 3D", "Full-time"],
    hoverDescription:
      "Pioneered 3D geospatial applications for defense—designing across space operations, AI-powered military planning, and autonomous vehicle operations.",
    backgroundImage: "/projects/gotham-bg.png",
    logo: (
      <div className="flex items-center gap-3">
        <div className="relative h-[22px] w-[17px]">
          <Image
            src="/projects/palantir-icon.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <p className="text-[20px] font-medium leading-[25px] text-[#fafafa]">
          Palantir Gotham
        </p>
      </div>
    ),
    detail: {
      duration: "Sept 2023 to March 2026",
      role: "As one of three 0→1 designers at Palantir, I helped pioneer the company's 3D geospatial application space, designing across the some of most cutting-edge problem spaces in defense: space operations, AI-powered military planning, autonomous vehicle operations, and live air-defense systems.",
      contextHeadline:
        "Palantir Gotham is a data integration and analytics platform designed for high-stakes operations in defense, intelligence, and the public sector.",
      context: [
        "At its core, Gotham allows organizations to unite diverse datasets—from field intelligence and sensor data to logistics and communications—into geo-spatial, interactive environments; empowering decision-makers to plan and execute missions efficiently by turning complex data into strategic advantages.",
      ],
      sections: [
        {
          sidebarItems: [
            { label: "AI Agent Landing", isActive: true },
            { label: "Viewing AI-generated edits" },
            { label: "Edit Comparison View" },
          ],
          title: "Geospatial AI-powered mission planning platform",
          overview:
            "The platform's mission planning tools combine real-time and historical data to create unified operational views for current and future scenarios, enabling teams to understand situations quickly, spot threats and opportunities, and coordinate responses effectively.",
          impact:
            "I led and collaborated on design on various 0→1 modes and use cases within mission planning suite, treating each project with an experimental approach, based in hypotheses to test through design.",
          images: [
            { type: "image", src: "/projects/gotham-strike-plan-4.png", aspectRatio: "3360/2100" },
            { type: "image", src: "/projects/gotham-strike-plan-2.png", aspectRatio: "3360/2100" },
            { type: "image", src: "/projects/gotham-strike-plan-3.png", aspectRatio: "3360/2100" },
          ],
        },
        {
          sidebarItems: [
            { label: "Autonomous Mission Board", isActive: true },
            { label: "Editing a mission" },
          ],
          title: "Autonomous mission planning for unmanned vehicles",
          overview:
            "A multi-year endeavor within the mission planning app suite, our declarative autonomy mode allows users to create guided, targeting-based missions for unmanned systems.",
          impact:
            "Unmanned system missions fundamentally differ from traditional mission planning. In this innovative field, I collaborated with two forward-deployed engineers to develop a hypothesis on how to introduce this functionality to the market. We focused on current use cases and designed a product that accommodates layered complexity in mission planning capabilities, from simple A→B missions, to multi-wave, dependency-based executions.",
          images: [
            { type: "image", src: "/projects/gotham-autonomous-2.png", aspectRatio: "3360/2100" },
            { type: "image", src: "/projects/gotham-autonomous-drawing.png", aspectRatio: "3360/2100" },
          ],
        },
        {
          sidebarItems: [
            { label: "Data layers", isActive: true },
            { label: "Tools and Actions" },
            { label: "New Overflight Analysis" },
            { label: "Completed Overflight Analysis" },
          ],
          title: "Operation picture and analysis tooling for space operations",
          overview:
            "Nebula is a space operation application that provides situational awareness for satellite coverage and location, as well as facilitating satellite operations and calculations.",
          impact:
            "As the lead designer for this project, I developed the app from a systems perspective, making design choices rooted in customer needs and translating technical concepts into user-friendly, data-readable interfaces that allowed the product to find rapid market fit within government and defense use cases.",
          images: [
            { type: "image", src: "/projects/gotham-nebula-1.png", aspectRatio: "3384/2124" },
            { type: "image", src: "/projects/gotham-nebula-2.png", aspectRatio: "3384/2124" },
            { type: "image", src: "/projects/gotham-overflight-3.png", aspectRatio: "3384/2124" },
            { type: "image", src: "/projects/gotham-overflight-2.png", aspectRatio: "3384/2124" },
          ],
        },
      ],
    },
  },
  {
    id: "foundry",
    title: "Palantir Foundry",
    year: "2025",
    isDark: false,
    tags: ["B2B", "Data Analytics", "Full-time"],
    hoverDescription:
      "Drove end-to-end design on foundational data entry and ontology initiatives—each adopted immediately by tens of thousands of daily users across critical workflows.",
    centerImage: "/projects/foundry-logo.svg",
    centerImageSize: { width: 124, height: 141 },
    logo: (
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/projects/palantir-foundry-icon.svg" alt="" className="h-[25px] w-auto" />
        <p className="text-[20px] font-medium leading-[25px] text-[#09090b]">
          Palantir Foundry
        </p>
      </div>
    ),
    detail: {
      duration: "April 2024 to November 2025",
      role: "The sole product designer for the Ontology Actions team within Foundry. During my time on Foundry Actions, I led key design and product initiatives that powered the way Palantir's entire forward-deployed suite builds, edits, and operates on client data. I drove end-to-end execution on foundational features—each of which was adopted immediately by tens of thousands of daily users across critical workflows. This work required deep product fluency, crisp strategic alignment, and tight collaboration with design, product, and engineering partners to ensure we delivered tools that were both powerful and intuitive at scale.",
      contextHeadline:
        "Palantir Foundry is a platform for data integration and analytics, enabling organizations to manage and operationalize complex data at scale.",
      context: [
        "A core feature to Foundry is its Ontology, a semantic layer that maps raw data to real-world business concepts like Customer, Product, or Facility. Through structured relationships and inheritance, data from differing sources is mapped into a clear, reusable, and governed framework that abstracts technical complexity.",
        "Actions are similar to functions or methods in coding, each representing a command that can create, modify, or delete objects within Palantir's Ontology.",
      ],
      sections: [
        {
          sidebarItems: [
            { label: "Rules", isActive: true },
            { label: "Parameters" },
            { label: "Specific Parameter" },
            { label: "User Interface: In-line Form" },
            { label: "User Interface: Table" },
          ],
          title: "Redesigning Actions in the Ontology Manager Application",
          overview:
            "The Action page in Ontology Manager is the primary interface for configuring Actions—the core commands that create, modify, or delete objects within Palantir's Ontology. Users rely on this page to define rules, set parameters, and build user-facing forms.",
          impact:
            "Executed on a full redesign, conducting extensive research and gathering widespread feedback to drive a design-led effort. The resulting overhaul improved information architecture, navigation, and hierarchy, delivering a more intuitive and user-friendly experience.",
          images: [
            { type: "image", src: "/projects/foundry-rules.png", aspectRatio: "908/534" },
            { type: "image", src: "/projects/foundry-params.png", aspectRatio: "3296/1896" },
            { type: "image", src: "/projects/foundry-params-2.png", aspectRatio: "3296/1896" },
            { type: "image", src: "/projects/foundry-ui.png", aspectRatio: "3296/1896" },
            { type: "image", src: "/projects/foundry-ui-2.png", aspectRatio: "3296/1896" },
          ],
        },
        {
          sidebarItems: [
            { label: "Dynamic Scheduler Object View Interaction", isActive: true },
            { label: "Drag Interaction" },
          ],
          title: "Dynamic scheduling widgets",
          overview:
            "Dynamic scheduling interfaces enable users to view and interact with ontological entities and actions along a time axis, providing temporal context to operational workflows.",
          impact:
            "Designed a series of scheduling interfaces from the ground up, defining interaction patterns for both click-based and drag-based time-axis interactions.",
          images: [
            { type: "image", src: "/projects/foundry-scheduler-click.png", aspectRatio: "2976/1896" },
            { type: "image", src: "/projects/foundry-scheduler-drag.png", aspectRatio: "2976/1896" },
          ],
        },
        {
          sidebarItems: [
            { label: "Standard Action Table", isActive: true },
            { label: "Table Error States" },
            { label: "File upload dialog" },
            { label: "File upload dialog: Mapping" },
            { label: "File upload fullscreen" },
          ],
          title: "Bulk data entry and transformation through the Action table",
          overview:
            "The Action Table is a tabular tool within Foundry's Workshop for bulk edits and creation of objects, providing an at-scale experience for data entry and transformation across the Ontology.",
          impact:
            "Since launch, the Action Table enables 2 million action submissions per month, with unique users growing from 500 in November 2024 to over 20k in November 2025, significantly streamlining and scaling ontology updates across the company.",
          images: [
            { type: "image", src: "/projects/foundry-inbox.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-workshop.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-global.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-global-2.png", aspectRatio: "2880/1800" },
            { type: "image", src: "/projects/foundry-fullscreen.png", aspectRatio: "2880/1800" },
          ],
        },
      ],
    },
  },
  {
    id: "baba",
    title: "Baba",
    year: "2026",
    isDark: false,
    tags: ["Consumer", "Healthcare", "Contractor"],
    hoverDescription:
      "Redesigned the patient experience for an eldercare start-up—from the application to the onboarding process over a 2-week contract.",
    backgroundGradient:
      "linear-gradient(180deg, rgba(186, 221, 255, 0.78) 0%, rgba(220, 232, 243, 0.538) 50%, rgba(254, 255, 232, 0.296) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
    backgroundImage: "/projects/baba-card-clouds.png",
    logo: (
      <div className="relative h-[24px] w-[72px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/projects/baba-logo-card.png" alt="baba" className="h-full w-full object-contain" />
      </div>
    ),
    detail: {
      duration: "February 2026 · 2 weeks",
      role: "I was a product designer on a 2 week contract duration for Baba, an eldercare start-up providing care advocates to seniors. Over the course of the two weeks, I redesigned the patient experience, from the application to the onboarding process.",
      sections: [
        {
          sidebarTitle: "Patient Onboarding: The first 8 minutes",
          sidebarDescription:
            "Patients didn't know what Baba was, and what they were signing up for. This onboarding flow's goal was to directly tie the care advocate program to the patient's specific need clearly, so they could understand the exact service they can expect.",
          sidebarItems: [],
          images: [
            { type: "video", src: "/projects/Baba-first-onboarding.mov", aspectRatio: "1000/708" },
          ],
        },
        {
          sidebarTitle: "Patient Landing: The first week",
          sidebarDescription:
            "The process to connect with a care advocate involves several steps over 3-5 days. Patients must first have a consultation with a doctor and receive a care plan before being matched with an advocate and completing an introductory call, but the existing UX didn't clearly communicate and guide patients through this process. The proposed solution clearly outlines the next steps, the onboarding process, and the identity of their assigned advocate.",
          sidebarItems: [],
          images: [
            { type: "video", src: "/projects/baba-onboarding.mov", aspectRatio: "2912/1820" },
          ],
        },
        {
          sidebarTitle: "Screen keyframes.",
          sidebarItems: [
            { label: "Initial consultation", isActive: true },
            { label: "Advocate matching" },
            { label: "Advocate intro call needed" },
            { label: "Advocate intro call booked" },
            { label: "Completion: Steady state" },
          ],
          images: [
            { type: "image", src: "/projects/baba-screens-1.png", aspectRatio: "3840/2400" },
            { type: "image", src: "/projects/baba-screens-2.png", aspectRatio: "3844/2404" },
            { type: "image", src: "/projects/baba-screens-3.png", aspectRatio: "3844/2404" },
            { type: "image", src: "/projects/baba-screens-4.png", aspectRatio: "3844/2404" },
            { type: "image", src: "/projects/baba-screens-5.png", aspectRatio: "3844/2404" },
          ],
        },
        {
          sidebarTitle: "The process.",
          sidebarItems: [
            { label: "Decomposition: Stages of Patient onboarding", isActive: true },
            { label: "Ideation: Needed features and actions" },
            { label: "Low fidelity Thumbnails" },
          ],
          images: [
            { type: "image", src: "/projects/baba-process-1.png", aspectRatio: "4096/2645" },
            { type: "image", src: "/projects/baba-process-2.png", aspectRatio: "4096/3068" },
            { type: "image", src: "/projects/baba-process-3.png", aspectRatio: "4096/2699" },
          ],
        },
        {
          sidebarTitle: "Mobile Patient Onboarding",
          sidebarItems: [
            { label: "Part 1: Mobile onboarding", isActive: true },
            { label: "Part 2: Mobile onboarding" },
          ],
          images: [
            { type: "image", src: "/projects/baba-mobile-1.png", aspectRatio: "2584/2106" },
            { type: "image", src: "/projects/baba-mobile-2.png", aspectRatio: "2584/2462" },
          ],
        },
      ],
    },
  },
  {
    id: "kumu",
    title: "kumu",
    year: "2026",
    isDark: false,
    tags: ["Consumer", "Social", "Side Project"],
    hoverDescription:
      "A social flashcard app designed to make studying more collaborative and engaging.",
    centerImage: "/projects/kumu-screenshot.png",
    centerImageSize: { width: 220, height: 420 },
    logo: (
      <div className="flex items-center gap-3">
        <div className="relative h-[24px] w-[22px]">
          <Image
            src="/projects/kumu-icon.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <p
          className="text-[20px] leading-[25px] text-[#09090b]"
          style={{ fontFamily: "'Iowan Old Style', 'Georgia', serif", fontStyle: "italic" }}
        >
          kumu
        </p>
      </div>
    ),
  },
  {
    id: "kickback",
    title: "Kickback",
    year: "2024",
    isDark: true,
    tags: ["Consumer", "Social", "Side Project"],
    hoverDescription:
      "A social platform for organizing group activities and events with friends.",
    centerImage: "/projects/kickback-screenshot.png",
    centerImageSize: { width: 230, height: 470 },
  },
];

interface CardStackProps {
  onExpandChange?: (expanded: boolean) => void;
}

export default function CardStack({ onExpandChange }: CardStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getCardY = useCallback(
    (index: number) => {
      if (selectedIndex !== null) {
        if (index === selectedIndex) return 0;
        if (index < selectedIndex) return -(CARD_HEIGHT + 40);
        return CARD_HEIGHT + 200;
      }

      if (hoveredIndex === null) {
        return index * STACK_OFFSET;
      }

      // Top card: lift it slightly
      if (hoveredIndex === 0) {
        if (index === 0) return -8;
        return index * STACK_OFFSET;
      }

      // Cards above hovered: stay in their stacked position
      if (index < hoveredIndex) {
        return index * STACK_OFFSET;
      }
      // Hovered card + cards below: shift down so hovered card is fully revealed
      // The hovered card needs to clear the card above it
      const revealOffset = CARD_HEIGHT - STACK_OFFSET + HOVER_GAP;
      return index * STACK_OFFSET + revealOffset;
    },
    [hoveredIndex, selectedIndex]
  );

  const getCardOpacity = useCallback(
    (index: number) => {
      if (selectedIndex === null) return 1;
      return index === selectedIndex ? 1 : 0;
    },
    [selectedIndex]
  );

  const getCardScale = useCallback(
    (index: number) => {
      if (selectedIndex !== null && index !== selectedIndex) return 0.95;
      return 1;
    },
    [selectedIndex]
  );

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
    onExpandChange?.(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [onExpandChange]);

  const isExpanded = selectedIndex !== null;

  // Calculate the total height of the card stack based on hover/expand state
  const stackHeight = useMemo(() => {
    if (isExpanded) return CARD_HEIGHT;
    if (hoveredIndex === null || hoveredIndex === 0) {
      return (projects.length - 1) * STACK_OFFSET + CARD_HEIGHT;
    }
    // When hovering, the stack expands by the reveal offset
    const revealOffset = CARD_HEIGHT - STACK_OFFSET + HOVER_GAP;
    return (projects.length - 1) * STACK_OFFSET + CARD_HEIGHT + revealOffset;
  }, [hoveredIndex, isExpanded]);

  // Scroll to center the hovered card when hover changes
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (hoveredIndex === null || isExpanded) return;

    let cardY: number;
    if (hoveredIndex === 0) {
      cardY = -8;
    } else {
      const revealOffset = CARD_HEIGHT - STACK_OFFSET + HOVER_GAP;
      cardY = hoveredIndex * STACK_OFFSET + revealOffset;
    }
    const cardCenter = cardY + CARD_HEIGHT / 2;

    const container = containerRef.current;
    if (!container) return;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const targetScroll = containerTop + cardCenter - window.innerHeight / 2;

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [hoveredIndex, isExpanded]);

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        ref={containerRef}
        className="relative w-[556px]"
        animate={{ height: stackHeight }}
        transition={springTransition}
        onMouseLeave={() => {
          if (!isExpanded) setHoveredIndex(null);
        }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="absolute left-0 right-0"
            style={{ zIndex: isExpanded && index === selectedIndex ? 50 : projects.length - index }}
            animate={{
              y: getCardY(index),
              opacity: getCardOpacity(index),
              scale: getCardScale(index),
            }}
            transition={isExpanded ? expandTransition : springTransition}
            onMouseEnter={() => {
              if (!isExpanded) setHoveredIndex(index);
            }}
          >
            <div className="relative">
              {/* Tags — left side, behind card */}
              {project.tags && !isExpanded && (
                <div className="absolute left-[-40px] top-1/2 -translate-x-full -translate-y-1/2 flex flex-col gap-1 items-end pointer-events-none z-0">
                  {project.tags.map((tag, i) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, x: 40 }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                        x: hoveredIndex === index ? 0 : 40,
                      }}
                      transition={{
                        ...springTransition,
                        delay: hoveredIndex === index ? i * 0.03 : 0,
                      }}
                    >
                      <Badge variant="outline" className="bg-background">
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
              {/* Description — right side, behind card */}
              {project.hoverDescription && !isExpanded && (
                <motion.div
                  className="absolute right-[-40px] top-1/2 translate-x-full -translate-y-1/2 pointer-events-none w-[204px] z-0"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{
                    opacity: hoveredIndex === index ? 1 : 0,
                    x: hoveredIndex === index ? 0 : -40,
                  }}
                  transition={{
                    ...springTransition,
                    delay: hoveredIndex === index ? 0.05 : 0,
                  }}
                >
                  <p className="text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
                    {project.hoverDescription}
                  </p>
                </motion.div>
              )}
              {/* Card — on top */}
              <motion.div
                animate={{
                  boxShadow:
                    hoveredIndex === index && !isExpanded ? shadowLg : shadowSm,
                }}
                transition={springTransition}
                className="relative z-10 rounded-[16px]"
              >
                <ProjectCard
                  project={project}
                  onClick={() => {
                    if (isExpanded) {
                      handleClose();
                    } else {
                      setHoveredIndex(null);
                      onExpandChange?.(true);
                      window.scrollTo({ top: 0, behavior: "instant" });
                      requestAnimationFrame(() => {
                        setSelectedIndex(index);
                      });
                    }
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded project detail */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ...expandTransition, delay: 0.35 }}
            className="w-full"
          >
            <ProjectDetail
              project={projects[selectedIndex]}
              onClose={handleClose}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
