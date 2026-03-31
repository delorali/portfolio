"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Project } from "./ProjectCard";
import { Badge } from "./ui/badge";


interface ProjectDetailV2Props {
  project: Project;
  onClose: () => void;
}

interface ShowcaseCard {
  sectionHeader?: string;
  title: string;
  subtitle?: string;
  overview?: { label: string; text: string };
  impact?: { label: string; text: string };
  navItems: { label: string; image?: string; video?: string }[];
  backgroundImage?: string;
  skyOverlay?: { src: string; blur: number };
  imageAspectRatio?: string;
}

interface ProcessSection {
  title: string;
  italicSubtitle?: string;
  description?: string;
  bullets?: string[];
  image: string;
  aspectRatio: string;
}

// Theme colors based on dark/light mode
function useTheme(isDark: boolean) {
  return {
    cardBg: isDark ? "#27272a" : "white",
    cardBorder: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    cardShadow: isDark
      ? "0px 2px 4px rgba(0,0,0,0.04),0px 4px 12px rgba(0,0,0,0.06),0px 12px 32px rgba(0,0,0,0.12)"
      : "0px 0.5px 1px rgba(0,0,0,0.04),0px 1px 3px rgba(0,0,0,0.06)",
    title: isDark ? "#fafafa" : "#09090b",
    label: isDark ? "#fafafa" : "#09090b",
    body: isDark ? "#a1a1aa" : "#71717a",
    navActive: isDark ? "#fafafa" : "#09090b",
    navInactive: isDark ? "#a1a1aa" : "#71717a",
    navBorderActive: isDark ? "#71717a" : "#a1a1aa",
    navBorderInactive: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    progressBar: isDark ? "#fafafa" : "#18181b",
    counterBg: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.5)",
    starInvert: isDark,
    bgGradient: isDark
      ? "linear-gradient(to top, rgba(24,24,27,0.9) 0%, rgba(9,9,11,0) 100%)"
      : "linear-gradient(to top, rgba(244,244,245,0.9) 0%, rgba(9,9,11,0) 100%)",
    backBtnBg: isDark ? "#fafafa" : "#fafafa",
    backBtnIcon: "#09090b",
    badgeBorder: isDark ? "rgba(255,255,255,0.15)" : undefined,
    badgeText: isDark ? "#fafafa" : undefined,
    muted: isDark ? "#a1a1aa" : "#71717a",
    foreground: isDark ? "#fafafa" : "#09090b",
  };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ShowcaseCardSection({ card, isDark }: { card: ShowcaseCard; isDark: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoTime, setVideoTime] = useState({ current: 0, duration: 0 });
  const totalItems = card.navItems.length;
  const isVideoCard = totalItems === 1 && !!card.navItems[0]?.video;
  const progressFraction = isVideoCard ? videoProgress : (activeIndex + 1) / totalItems;
  const t = useTheme(isDark);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video progress tracking — use RAF for smooth updates
  useEffect(() => {
    if (!isVideoCard) return;
    let rafId: number;

    const tick = () => {
      const video = videoRef.current;
      if (video && video.duration) {
        setVideoProgress(video.currentTime / video.duration);
        setVideoTime({ current: video.currentTime, duration: video.duration });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isVideoCard]);

  // Scroll-driven: track scroll position within the tall wrapper to determine active slide
  useEffect(() => {
    if (isVideoCard) return; // No scroll-driven nav for single-video cards
    const handleScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const wrapperHeight = wrapper.offsetHeight;
      const viewportH = window.innerHeight;

      const scrolled = -rect.top;
      const scrollRange = wrapperHeight - viewportH;

      if (scrollRange <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));
      const newIndex = Math.min(
        totalItems - 1,
        Math.floor(progress * totalItems)
      );
      setActiveIndex(newIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalItems, isVideoCard]);

  // Tall wrapper: 100vh for video cards, 100vh + scroll distance for multi-item cards
  const wrapperHeight = isVideoCard ? "100vh" : `calc(100vh + ${totalItems * 80}vh)`;

  return (
    <>
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: wrapperHeight }}
    >
      <div className="sticky top-[calc(50vh-clamp(250px,27.5vw,394px))] px-5 md:px-[80px] lg:px-[120px]" style={{ height: "clamp(500px, 55vw, 788px)" }}>
      <div
        className="flex w-full h-full rounded-[16px] overflow-hidden"
        style={{
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          boxShadow: t.cardShadow,
        }}
      >
        {/* Left sidebar */}
        <div className="hidden md:flex flex-col gap-5 shrink-0 w-[300px] lg:w-[354px] p-5 h-full">
          <div className="flex flex-col gap-2 pb-4">
            <Image
              src="/projects/star-icon.svg"
              alt=""
              width={28}
              height={28}
              className={t.starInvert ? "brightness-0 invert" : ""}
            />
            <p
              className="text-[22px] lg:text-[26px] font-normal leading-[30px] lg:leading-[34px] tracking-[-1.04px]"
              style={{ color: t.title }}
            >
              {card.title}
            </p>
            {card.subtitle && (
              <p className="text-[13px] leading-[18px] tracking-[-0.013px]" style={{ color: t.body }}>
                {card.subtitle}
              </p>
            )}
          </div>
          {card.overview && (
            <div className="flex flex-col gap-3 text-[13px] leading-[18px]">
              <p style={{ color: t.label }} className="tracking-[-0.026px]">{card.overview.label}</p>
              <p style={{ color: t.body }} className="tracking-[-0.013px]">{card.overview.text}</p>
            </div>
          )}
          {card.impact && (
            <div className="flex flex-col gap-3 text-[13px] leading-[18px]">
              <p style={{ color: t.label }} className="tracking-[-0.026px]">{card.impact.label}</p>
              <p style={{ color: t.body }} className="tracking-[-0.013px]">{card.impact.text}</p>
            </div>
          )}
          {/* Nav items pushed to bottom — hidden for single-item cards */}
          {totalItems > 1 && (
            <div className="flex flex-col mt-auto">
              {card.navItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="flex items-center px-4 py-2 border-l text-left transition-colors duration-200"
                  style={{
                    borderColor: i === activeIndex ? t.navBorderActive : t.navBorderInactive,
                    color: i === activeIndex ? t.navActive : t.navInactive,
                  }}
                >
                  <p className="text-[14px] leading-[19px] tracking-[-0.042px]">{item.label}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right image area */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-[12px] my-3 mr-3">
          {/* Background layers — progressive blur: sharp at top (0px) → blurry at bottom (10px) */}
          {card.backgroundImage && (
            <>
              {/* Base sharp layer */}
              <Image
                src={card.backgroundImage}
                alt=""
                fill
                className="object-cover rounded-[8px]"
              />
              {/* Progressive blur layers — each fades IN further down */}
              {[
                { blur: 3, fadeStart: "30%", fadeEnd: "50%" },
                { blur: 6, fadeStart: "45%", fadeEnd: "70%" },
                { blur: 10, fadeStart: "60%", fadeEnd: "85%" },
              ].map((layer, i) => (
                <div
                  key={i}
                  className="absolute inset-0 rounded-[8px] overflow-hidden"
                  style={{
                    filter: `blur(${layer.blur}px)`,
                    maskImage: `linear-gradient(to bottom, transparent ${layer.fadeStart}, black ${layer.fadeEnd})`,
                    WebkitMaskImage: `linear-gradient(to bottom, transparent ${layer.fadeStart}, black ${layer.fadeEnd})`,
                  }}
                >
                  <Image
                    src={card.backgroundImage!}
                    alt=""
                    fill
                    className="object-cover scale-110"
                  />
                </div>
              ))}
              {/* Gradient overlay — darkens at bottom for dark mode, lightens for light */}
              <div
                className="absolute inset-0 rounded-[8px]"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(to top, rgba(9,9,11,0.85) 0%, rgba(9,9,11,0.4) 40%, transparent 70%)"
                    : "linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 40%, transparent 70%)",
                }}
              />
            </>
          )}
          {/* Main screenshot — crossfade between images */}
          <div className="absolute inset-0 z-10 flex items-center justify-center p-10">
            <div
              className="relative"
              style={{
                aspectRatio: card.imageAspectRatio || "3360/2100",
                width: "100%",
                height: "100%",
              }}
            >
              {card.navItems.map((item, i) => (
                <motion.div
                  key={i}
                  className={item.video ? "absolute inset-0 flex items-center justify-center" : "absolute inset-0"}
                  initial={false}
                  animate={{ opacity: i === activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {item.video ? (
                    <video
                      ref={videoRef}
                      src={item.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-full max-h-full"
                      style={{ borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
                    />
                  ) : item.image ? (
                    <Image src={item.image} alt={item.label} fill className="object-contain" />
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>
          {/* Counter tag — timestamp for video, N OF M for multi-image */}
          {(isVideoCard || totalItems > 1) && (
            <div
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full backdrop-blur-sm px-3 py-1.5"
              style={{ backgroundColor: t.counterBg }}
            >
              <span className="text-[12px] font-medium leading-none tracking-[0.08em] text-white/90 font-mono">
                {isVideoCard
                  ? `${formatTime(videoTime.current)} / ${formatTime(videoTime.duration)}`
                  : `${activeIndex + 1} OF ${totalItems}`}
              </span>
            </div>
          )}
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center overflow-hidden">
            <motion.div
              className="h-[6px] opacity-70 rounded-[12px]"
              style={{ backgroundColor: t.progressBar }}
              initial={false}
              animate={{ width: `${progressFraction * 100}%` }}
              transition={isVideoCard ? { duration: 0.3, ease: "linear" } : { type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      </div>
      </div>
    </div>

    {/* Mobile: info below card (outside scroll wrapper) */}
    <div className="flex md:hidden flex-col gap-5 mt-6 px-6">
      <div className="flex flex-col gap-2">
        <Image
          src="/projects/star-icon.svg"
          alt=""
          width={24}
          height={24}
          className={t.starInvert ? "brightness-0 invert" : ""}
        />
        <p
          className="text-[20px] font-normal leading-[26px] tracking-[-0.8px]"
          style={{ color: t.title }}
        >
          {card.title}
        </p>
      </div>
      {card.overview && (
        <div className="flex flex-col gap-3 text-[13px] leading-[18px]">
          <p style={{ color: t.label }} className="tracking-[-0.026px]">{card.overview.label}</p>
          <p style={{ color: t.body }} className="tracking-[-0.013px]">{card.overview.text}</p>
        </div>
      )}
      {card.impact && (
        <div className="flex flex-col gap-3 text-[13px] leading-[18px]">
          <p style={{ color: t.label }} className="tracking-[-0.026px]">{card.impact.label}</p>
          <p style={{ color: t.body }} className="tracking-[-0.013px]">{card.impact.text}</p>
        </div>
      )}
      {totalItems > 1 && (
        <div className="flex flex-col">
          {card.navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="flex items-center px-4 py-2 border-l text-left transition-colors"
              style={{
                borderColor: i === activeIndex ? t.navBorderActive : t.navBorderInactive,
                color: i === activeIndex ? t.navActive : t.navInactive,
              }}
            >
              <p className="text-[14px] leading-[19px] tracking-[-0.042px]">{item.label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

// Showcase card data per project
function getShowcaseCards(projectId: string): ShowcaseCard[] {
  if (projectId === "gotham") return [
    {
      title: "Geospatial AI-powered mission planning platform",
      overview: {
        label: "Product Overview",
        text: "The platform's mission planning tools combine real-time and historical data to create unified operational views for current and future scenarios, enabling teams to understand situations quickly, spot threats and opportunities, and coordinate responses effectively.",
      },
      impact: {
        label: "My Impact",
        text: "I led and collaborated on design on various 0→1 modes and use cases within mission planning suite, treating each project with an experimental approach, based in hypotheses to test through design.",
      },
      navItems: [
        { label: "AI Agent Landing", image: "/projects/gotham-strike-plan-4.png" },
        { label: "Viewing AI-generated edits", image: "/projects/gotham-strike-plan-2.png" },
        { label: "Edit Comparison View", image: "/projects/gotham-strike-plan-3.png" },
      ],
      backgroundImage: "/projects/gotham-frame-53.png",
      imageAspectRatio: "3360/2100",
    },
    {
      title: "Autonomous mission planning for unmanned vehicles",
      overview: {
        label: "Product Overview",
        text: "A multi-year endeavor within the mission planning app suite, our declarative autonomy mode allows users to create guided, targeting-based missions for unmanned systems.",
      },
      impact: {
        label: "My Impact",
        text: "Unmanned system missions fundamentally differ from traditional mission planning. In this innovative field, I collaborated with two forward-deployed engineers to develop a hypothesis on how to introduce this functionality to the market. We focused on current use cases and designed a product that accommodates layered complexity in mission planning capabilities, from simple A→B missions, to multi-wave, dependency-based executions.",
      },
      navItems: [
        { label: "Autonomous Mission Board", image: "/projects/gotham-autonomous.png" },
        { label: "Editing a mission", image: "/projects/gotham-autonomous-2.png" },
      ],
      backgroundImage: "/projects/gotham-frame-54.png",
      imageAspectRatio: "3360/2100",
    },
    {
      title: "Operation picture and analysis tooling for space operations",
      overview: {
        label: "Product Overview",
        text: "Nebula is a space operation application that provides situational awareness for satellite coverage and location, as well as facilitating satellite operations and calculations.",
      },
      impact: {
        label: "My Impact",
        text: "As the lead designer for this project, I developed the app from a systems perspective, making design choices rooted in customer needs and translating technical concepts into user-friendly, data-readable interfaces that allowed the product to find rapid market fit within government and defense use cases.",
      },
      navItems: [
        { label: "Data layers", image: "/projects/gotham-nebula.png" },
        { label: "Tools and Actions", image: "/projects/gotham-nebula-tools.png" },
        { label: "New Overflight Analysis", image: "/projects/gotham-overflight-3.png" },
        { label: "Completed Overflight Analysis", image: "/projects/gotham-overflight-2.png" },
      ],
      backgroundImage: "/projects/gotham-frame-55.png",
      imageAspectRatio: "3384/2124",
    },
  ];

  if (projectId === "foundry") return [
    {
      title: "Redesigning Actions in the Ontology Manager Application",
      overview: {
        label: "Product Overview",
        text: "The Action page in Ontology Manager is the primary interface for configuring Actions—the core commands that create, modify, or delete objects within Palantir's Ontology. Users rely on this page to define rules, set parameters, and build user-facing forms.",
      },
      impact: {
        label: "My Impact",
        text: "Executed on a full redesign, conducting extensive research and gathering widespread feedback to drive a design-led effort. The resulting overhaul improved information architecture, navigation, and hierarchy, delivering a more intuitive and user-friendly experience.",
      },
      navItems: [
        { label: "Rules", image: "/projects/foundry-rules-v2.png" },
        { label: "Parameters", image: "/projects/foundry-params.png" },
        { label: "Specific Parameter", image: "/projects/foundry-params-2.png" },
        { label: "User Interface: In-line Form", image: "/projects/foundry-ui.png" },
        { label: "User Interface: Table", image: "/projects/foundry-ui-2.png" },
      ],
      backgroundImage: "/projects/foundry-cloud-1.png",
      imageAspectRatio: "908/534",
    },
    {
      title: "Dynamic scheduling widgets",
      overview: {
        label: "Product Overview",
        text: "Dynamic scheduling interfaces enable users to view and interact with ontological entities and actions along a time axis, providing temporal context to operational workflows.",
      },
      impact: {
        label: "My Impact",
        text: "Designed a series of scheduling interfaces from the ground up, defining interaction patterns for both click-based and drag-based time-axis interactions.",
      },
      navItems: [
        { label: "Dynamic Scheduler Object View Interaction", image: "/projects/foundry-scheduler-click-v2.png" },
        { label: "Drag Interaction", image: "/projects/foundry-scheduler-drag.png" },
      ],
      backgroundImage: "/projects/foundry-cloud-1.png",
      imageAspectRatio: "2976/1896",
    },
    {
      title: "Bulk data entry and transformation through the Action table",
      overview: {
        label: "Product Overview",
        text: "The Action Table is a tabular tool within Foundry's Workshop for bulk edits and creation of objects, providing an at-scale experience for data entry and transformation across the Ontology.",
      },
      impact: {
        label: "My Impact",
        text: "As the lead designer for this project, I developed the product from a systems perspective, identifying key patterns before honing in on specific cellular and data entry interactions. Since launch, the Action Table enables 2 million action submissions per month, with unique users growing from 500 in November 2024 to over 20k in November 2025, significantly streamlining and scaling ontology updates across the company.",
      },
      navItems: [
        { label: "Standard Action Table", image: "/projects/foundry-inbox-v2.png" },
        { label: "Table Error States", image: "/projects/foundry-workshop.png" },
        { label: "File upload dialog", image: "/projects/foundry-global.png" },
        { label: "File upload dialog: Mapping", image: "/projects/foundry-global-2.png" },
        { label: "File upload fullscreen", image: "/projects/foundry-fullscreen.png" },
      ],
      backgroundImage: "/projects/foundry-cloud-1.png",
      imageAspectRatio: "2880/1800",
    },
  ];

  if (projectId === "baba") return [
    {
      sectionHeader: "The solution",
      title: "The first 8 minutes: Patient Onboarding",
      overview: {
        label: "Problem Overview",
        text: "Patients didn't know what Baba was, and what they were signing up for. Most patients would click on a Baba ad because they wanted a wheelchair, but didn't realize that in order to receive their wheelchair, they would need to actually match with a care advocate who can then navigate the process for them.",
      },
      impact: {
        label: "My Impact",
        text: "By breaking down the onboarding flow, I concluded that the current flow only showed action and form items, but didn't guide or educate the patient on the process. The new redesigned onboarding flow's goal was to directly tie the care advocate program to the patient's specific need clearly, so they could understand the exact service they can expect.",
      },
      navItems: [
        { label: "Patient Onboarding", video: "/projects/Baba-first-onboarding.mov" },
      ],
      backgroundImage: "/projects/baba-cloud-bg-1.png",
      imageAspectRatio: "1000/708",
    },
    {
      title: "The first week: Initial consultation and advocate matching",
      overview: {
        label: "Problem Overview",
        text: "Similar to above, patients didn't understand the entire process of matching with an advocate. The existing process to connect with a care advocate involves several steps over 3-5 days:\nPatients must first have a consultation with a doctor and receive a care plan before being matched with an advocate and completing an introductory call.\n\nThe existing UX didn't clearly communicate and guide patients through this process.",
      },
      impact: {
        label: "My Impact",
        text: "By identifying and designing around the different states in the patient's onboarding and matching process, I redesigned the flow from initial consultation to completed advocate intro call to the steady state of the platform. The new solution's goal is to clearly outlines the identified next steps, the onboarding process, and the identity of their assigned advocate, so the patient has a clear idea of where they are in the process and what they have left to complete.",
      },
      navItems: [
        { label: "Consultation and Matching", video: "/projects/baba-onboarding.mov" },
      ],
      backgroundImage: "/projects/baba-cloud-bg-1.png",
      imageAspectRatio: "2912/1820",
    },
    {
      title: "Final keyframes",
      subtitle: "Series of key screens in the patient onboarding experience.",
      navItems: [
        { label: "Initial consultation", image: "/projects/baba-screens-1.png" },
        { label: "Advocate matching", image: "/projects/baba-screens-2.png" },
        { label: "Advocate intro call needed", image: "/projects/baba-screens-3.png" },
        { label: "Advocate intro call booked", image: "/projects/baba-screens-4.png" },
        { label: "Completion: Steady state", image: "/projects/baba-screens-5.png" },
      ],
      backgroundImage: "/projects/baba-cloud-bg-2.png",
      imageAspectRatio: "3840/2400",
    },
    {
      title: "Mobile frames",
      subtitle: "Translated the patient experience for desktop into a mobile web app format.",
      navItems: [
        { label: "Part 1: Mobile onboarding", image: "/projects/baba-mobile-1.png" },
        { label: "Part 2: Mobile onboarding", image: "/projects/baba-mobile-2.png" },
      ],
      backgroundImage: "/projects/baba-cloud-bg-2.png",
      imageAspectRatio: "2584/2106",
    },
  ];

  return [];
}

function getProcessSections(projectId: string): ProcessSection[] {
  if (projectId === "baba") return [
    {
      title: "Decomposition: Stages of Patient onboarding",
      italicSubtitle: "Key questions to answer",
      description: "What are the different stages of onboarding, and per each stage, what are:",
      bullets: [
        "The questions the user needs to answer?",
        "The information the user needs to see to answer their questions and make informed decisions?",
        "The actual actions the user needs to complete?",
      ],
      image: "/projects/baba-decomposition.png",
      aspectRatio: "4096/2645",
    },
    {
      title: "Ideation: Needed features and actions",
      description: "Based on the above decomposition, how can we organize information and actions into relevant components, determining our required feature set?",
      image: "/projects/baba-ideation.png",
      aspectRatio: "4096/3068",
    },
    {
      title: "Low fidelity Thumbnails",
      description: "With the stages determining the actual workflow, and the feature set determining the content needed on each screen, simple thumbnails allowed for quick communication of the workflow for team validation and system design.",
      image: "/projects/baba-thumbnails.png",
      aspectRatio: "4096/2699",
    },
  ];

  return [];
}

export default function ProjectDetailV2({ project, onClose }: ProjectDetailV2Props) {
  const detail = project.detail;
  const isDark = project.isDark;
  const t = useTheme(isDark);
  const showcaseCards = getShowcaseCards(project.id);
  const processSections = getProcessSections(project.id);

  // Title with italic second word
  const titleParts = project.title.split(" ");
  const firstPart = titleParts.slice(0, -1).join(" ");
  const lastPart = titleParts[titleParts.length - 1];

  return (
    <div className="relative w-full">
      {/* Back button — sticks at top on scroll */}
      <div className="hidden md:block fixed left-[80px] lg:left-[120px] top-[16px] z-[60]">
        <motion.button
          onClick={onClose}
          className="flex size-[48px] items-center justify-center rounded-full shadow-sm transition-colors hover:bg-[#e4e4e7]"
          style={{ backgroundColor: t.backBtnBg }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        >
          <ArrowLeft className="size-5" style={{ color: t.backBtnIcon }} />
        </motion.button>
      </div>

      {/* Project info content */}
      <motion.div
        className="relative flex flex-col gap-12 px-5 md:px-[80px] lg:px-[120px] py-[50px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.15 }}
      >
        {/* Title + Tags + Duration */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 w-full">
          <div className="flex flex-1 flex-col gap-3">
            <h2
              className="text-[36px] md:text-[54px] font-normal leading-[1.1] md:leading-[56px] tracking-[-0.03em]"
              style={{ fontFamily: "'Times New Roman', Times, serif", color: t.foreground }}
            >
              {titleParts.length > 1 ? (
                <>
                  {firstPart}{" "}
                  <em style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}>
                    {lastPart}
                  </em>
                </>
              ) : (
                project.title
              )}
            </h2>
            {project.tags && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={isDark ? "border-white/15 text-[#fafafa]" : ""}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {detail?.duration && (
            <div className="flex shrink-0 flex-col gap-3">
              <p className="text-[13px] leading-[18px] tracking-[-0.026px] uppercase font-mono" style={{ color: t.muted }}>
                Duration
              </p>
              <p className="text-[15px] leading-[20px] tracking-[-0.06px]" style={{ color: t.foreground }}>
                {detail.duration}
              </p>
            </div>
          )}
        </div>

        {/* Context */}
        {detail?.contextHeadline && (
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[13px] leading-[18px] tracking-[-0.026px] uppercase font-mono" style={{ color: t.muted }}>
              Context
            </p>
            <p className="text-[17px] font-semibold leading-[22px] tracking-[-0.068px]" style={{ color: t.foreground }}>
              {detail.contextHeadline}
            </p>
            {detail.context?.map((text, i) => (
              <p key={i} className="text-[15px] leading-[20px] tracking-[-0.06px]" style={{ color: t.foreground }}>
                {text}
              </p>
            ))}
          </div>
        )}

        {/* My Role */}
        {detail?.role && (
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[13px] leading-[18px] tracking-[-0.026px] uppercase font-mono" style={{ color: t.muted }}>
              My Role
            </p>
            <p className="text-[15px] leading-[20px] tracking-[-0.06px]" style={{ color: t.foreground }}>
              {detail.role}
            </p>
          </div>
        )}
      </motion.div>

      {/* Showcase cards — full-width scroll zones with optional section headers */}
      <div className="flex flex-col gap-16">
        {showcaseCards.map((card, i) => (
          <div key={i} className="flex flex-col gap-5">
            {card.sectionHeader && (
              <div className="px-5 md:px-[80px] lg:px-[120px]">
                <p className="text-[13px] leading-[18px] tracking-[-0.026px] uppercase font-mono" style={{ color: t.muted }}>
                  {card.sectionHeader}
                </p>
              </div>
            )}
            <ShowcaseCardSection card={card} isDark={isDark} />
          </div>
        ))}
      </div>

      {/* Process sections */}
      {processSections.length > 0 && (
        <div className="flex flex-col gap-5 px-5 md:px-[80px] lg:px-[120px] py-6 mt-16">
          <p className="text-[13px] leading-[18px] tracking-[-0.026px] uppercase font-mono" style={{ color: t.muted }}>
            The process
          </p>
          <div className="flex flex-col gap-10">
            {processSections.map((section, i) => (
              <div key={i} className="flex flex-col gap-10 pb-4">
                <div className="flex flex-col gap-3 max-w-[600px]">
                  <Image
                    src="/projects/star-icon.svg"
                    alt=""
                    width={28}
                    height={28}
                    className={t.starInvert ? "brightness-0 invert" : ""}
                  />
                  <p
                    className="text-[20px] font-normal leading-[24px] tracking-[-0.08px]"
                    style={{ color: t.foreground }}
                  >
                    {section.title}
                  </p>
                  {section.italicSubtitle && (
                    <p className="text-[13px] italic leading-[18px] tracking-[-0.026px]" style={{ color: t.body }}>
                      {section.italicSubtitle}
                    </p>
                  )}
                  {section.description && (
                    <p className="text-[13px] leading-[18px] tracking-[-0.026px]" style={{ color: t.body }}>
                      {section.description}
                    </p>
                  )}
                  {section.bullets && (
                    <ul className="list-disc pl-5 flex flex-col gap-0.5">
                      {section.bullets.map((bullet, j) => (
                        <li key={j} className="text-[13px] leading-[18px] tracking-[-0.026px]" style={{ color: t.body }}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative w-full rounded-[6px] overflow-hidden" style={{ aspectRatio: section.aspectRatio }}>
                  <Image src={section.image} alt={section.title} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-16" />
    </div>
  );
}
