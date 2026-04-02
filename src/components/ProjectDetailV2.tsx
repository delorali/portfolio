"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Project } from "./ProjectCard";
import { Badge } from "./ui/badge";
import PasswordGate, { isProjectUnlocked } from "./PasswordGate";

const PASSWORD_PROTECTED_PROJECTS = ["gotham", "baba"];

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
  layout?: "staggered" | "trio";
}

interface ProcessSection {
  title: string;
  headline?: string;
  italicSubtitle?: string;
  description?: string;
  bullets?: string[];
  image?: string;
  aspectRatio?: string;
  images?: { src: string; aspectRatio: string; rounded?: boolean }[];
  imagesLayout?: "side-by-side" | "stacked";
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
  const hasVideo = card.navItems.some(item => !!item.video);
  const isVideoCard = totalItems === 1 && !!card.navItems[0]?.video;
  const isMultiLayout = card.layout === "staggered" || card.layout === "trio";
  const progressFraction = (isVideoCard || (isMultiLayout && hasVideo)) ? videoProgress : (activeIndex + 1) / totalItems;
  const t = useTheme(isDark);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video progress tracking — use RAF for smooth updates
  // Query the wrapper for a visible, playing video instead of relying on a single ref,
  // since desktop/mobile layouts render duplicate video elements simultaneously.
  useEffect(() => {
    if (!isVideoCard && !(isMultiLayout && hasVideo)) return;
    let rafId: number;

    const tick = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const videos = wrapper.querySelectorAll("video");
        let activeVideo: HTMLVideoElement | null = null;
        for (const v of videos) {
          if (!v.paused && v.duration) {
            activeVideo = v;
            break;
          }
        }
        if (!activeVideo) {
          // Fallback to any video with duration
          for (const v of videos) {
            if (v.duration) {
              activeVideo = v;
              break;
            }
          }
        }
        if (activeVideo) {
          setVideoProgress(activeVideo.currentTime / activeVideo.duration);
          setVideoTime({ current: activeVideo.currentTime, duration: activeVideo.duration });
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isVideoCard, isMultiLayout, hasVideo]);

  // Scroll-driven: track scroll position within the tall wrapper to determine active slide
  useEffect(() => {
    if (isVideoCard || isMultiLayout) return; // No scroll-driven nav for video or multi-layout cards
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

  // Tall wrapper: 100vh for video/multi-layout cards, 100vh + scroll distance for multi-item cards
  const wrapperHeight = (isVideoCard || isMultiLayout) ? "100vh" : `calc(100vh + ${totalItems * 80}vh)`;

  return (
    <>
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ height: wrapperHeight }}
    >
      <div className="sticky top-4 md:top-[72px] px-3 md:px-[80px] lg:px-[120px]" style={{ height: "auto", minHeight: "0" }}>
      <div
        className="flex flex-col md:flex-row w-full md:h-[clamp(500px,55vw,788px)] rounded-[16px] overflow-hidden"
        style={{
          backgroundColor: t.cardBg,
          border: `1px solid ${t.cardBorder}`,
          boxShadow: t.cardShadow,
        }}
      >
        {/* Info section — stacks on top on mobile, sidebar on desktop */}
        <div className="flex flex-col gap-5 shrink-0 md:w-[300px] lg:w-[354px] p-3 md:p-5 md:h-full">
          <div className="flex flex-col gap-2 pb-4">
            <Image
              src="/projects/star-icon.svg"
              alt=""
              width={28}
              height={28}
              className={t.starInvert ? "brightness-0 invert" : ""}
            />
            <p
              className="text-[24px] md:text-[22px] lg:text-[26px] font-normal leading-[24px] md:leading-[30px] lg:leading-[34px] tracking-[-0.96px] md:tracking-[-1.04px]"
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
          {/* Nav items pushed to bottom — desktop only, hidden for single-item and multi-layout cards */}
          {totalItems > 1 && !isMultiLayout && (
            <div className="hidden md:flex flex-col mt-auto">
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

        {/* Image area */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-[8px] md:rounded-[12px] h-[354px] md:h-auto md:flex-1 mx-3 mb-3 md:my-3 md:mr-3 md:ml-0">
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
          {/* Main screenshot area */}
          {card.layout === "staggered" ? (
            <>
            {/* Staggered: desktop — center raised, sides offset; mobile — trio layout */}
            {/* Desktop staggered */}
            <div className="absolute inset-0 z-10 hidden md:flex items-center justify-center px-10 py-16">
              <div className="relative w-full h-full max-w-[726px]">
                {/* Center item — video or image */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-0 rounded-[16px] overflow-hidden border"
                  style={{
                    width: "234px",
                    height: "508px",
                    borderColor: t.cardBorder,
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  {card.navItems[0]?.video ? (
                    <video
                      ref={videoRef}
                      src={card.navItems[0].video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : card.navItems[0]?.image ? (
                    <Image src={card.navItems[0].image} alt="" fill className="object-cover" />
                  ) : null}
                </div>
                {/* Left item */}
                {card.navItems[1] && (
                  <div
                    className="absolute left-0 top-[83px] rounded-[16px] overflow-hidden border"
                    style={{
                      width: "234px",
                      height: "508px",
                      borderColor: t.cardBorder,
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    <Image src={card.navItems[1].image!} alt="" fill className="object-cover" />
                  </div>
                )}
                {/* Right item */}
                {card.navItems[2] && (
                  <div
                    className="absolute right-0 top-[83px] rounded-[16px] overflow-hidden border"
                    style={{
                      width: "234px",
                      height: "508px",
                      borderColor: t.cardBorder,
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    <Image src={card.navItems[2].image!} alt="" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
            {/* Mobile staggered → trio */}
            <div className="absolute inset-0 z-10 flex md:hidden items-center justify-center px-3 py-10">
              <div className="flex gap-2 h-full items-center justify-center">
                {card.navItems.map((item, i) => (
                  <div
                    key={i}
                    className="relative rounded-[12px] overflow-hidden border shrink-0"
                    style={{
                      aspectRatio: "1320/2868",
                      height: "100%",
                      borderColor: t.cardBorder,
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    {item.video ? (
                      <video
                        ref={videoRef}
                        src={item.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : item.image ? (
                      <Image src={item.image} alt="" fill className="object-cover" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            </>
          ) : card.layout === "trio" ? (
            /* Trio: three items side by side, equal height */
            <div className="absolute inset-0 z-10 flex items-center justify-center px-3 md:px-10 py-10 md:py-16">
              <div className="flex gap-2 md:gap-2.5 h-full items-center justify-center" style={{ maxHeight: "530px" }}>
                {card.navItems.map((item, i) => (
                  <div
                    key={i}
                    className="relative rounded-[12px] md:rounded-[16px] overflow-hidden border shrink-0"
                    style={{
                      aspectRatio: "1320/2868",
                      height: "100%",
                      borderColor: t.cardBorder,
                      boxShadow: "0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    {item.video ? (
                      <video
                        ref={videoRef}
                        src={item.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : item.image ? (
                      <Image src={item.image} alt="" fill className="object-cover" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Default: crossfade between images */
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
          )}
          {/* Counter tag — timestamp for video, N OF M for multi-image */}
          {(isVideoCard || (isMultiLayout && hasVideo) || (!isMultiLayout && totalItems > 1)) && (
            <div
              className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full backdrop-blur-sm px-3 py-1.5"
              style={{ backgroundColor: t.counterBg }}
            >
              <span className="text-[12px] font-medium leading-none tracking-[0.08em] text-white/90 font-mono">
                {(isVideoCard || (isMultiLayout && hasVideo))
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
              transition={(isVideoCard || (isMultiLayout && hasVideo)) ? { duration: 0.3, ease: "linear" } : { type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Mobile caption — shows active item label below image */}
        {totalItems > 1 && !isMultiLayout && (
          <div className="flex md:hidden px-3 pb-3">
            <p className="text-[13px] leading-[18px] tracking-[-0.013px]" style={{ color: t.body }}>
              {card.navItems[activeIndex]?.label}
            </p>
          </div>
        )}
      </div>
      </div>
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

  if (projectId === "kickback") return [
    {
      sectionHeader: "Some of my projects",
      title: "Real-time photo sharing.",
      subtitle: "Each Kickback is a shared moment:",
      overview: {
        label: "",
        text: "One friend starts the day with a photo and optional prompt. Everyone in the group responds within a set window. Photos unlock as friends post, creating a sense of presence and participation.",
      },
      navItems: [
        { label: "Photo feed", image: "/projects/kickback-photo-1.png" },
        { label: "Partake in Kickback", video: "/projects/Kickback videos/kickback-partake.mov" },
        { label: "Photo detail", image: "/projects/kickback-photo-2.png" },
      ],
      backgroundImage: "/projects/kickback-bg-1.png",
      imageAspectRatio: "860/1864",
      layout: "trio" as const,
    },
    {
      title: "A mosaic of memories.",
      subtitle: "Daily Kick Backs are saved into your Group Memories become a visual thread of friendship\u2014authentic, casual, and uniquely yours.",
      navItems: [
        { label: "Memories grid", image: "/projects/kickback-memories-1.png" },
        { label: "Memories scroll", video: "/projects/Kickback videos/kickback-memories.mov" },
        { label: "Memory detail", image: "/projects/kickback-memories-2.png" },
      ],
      backgroundImage: "/projects/kickback-bg-2.png",
      imageAspectRatio: "860/1864",
      layout: "trio" as const,
    },
    {
      title: "Creating a new Kick Back group.",
      subtitle: "Groups can be made from new Kick Back posts, sending notifications to each friend that they\u2019ve been invited to a Kick Back with their new group.",
      navItems: [
        { label: "Create group", video: "/projects/Kickback videos/kickback-create-group.mov" },
      ],
      backgroundImage: "/projects/kickback-bg-3.png",
      imageAspectRatio: "860/1864",
    },
  ];

  if (projectId === "kumu") return [
    {
      sectionHeader: "The solution",
      title: "Card deck generation from raw study notes.",
      subtitle: "By uploading raw study notes, users can create card decks, which they can study and quiz against.",
      navItems: [
        { label: "Generating a card deck", video: "/projects/kumu media/Generating a card deck.mp4" },
        { label: "Card", image: "/projects/kumu media/Card.png" },
        { label: "Card list", image: "/projects/kumu media/Card list.png" },
      ],
      backgroundImage: "/projects/foundry-cloud-1.png",
      imageAspectRatio: "1320/2868",
      layout: "staggered" as const,
    },
    {
      title: "Quiz on your flash cards, and receive personalized coaching feedback.",
      subtitle: "With Kumu\u2019s AI coach, receive tailored feedback on each of your answers, whether right or wrong.",
      navItems: [
        { label: "Correct answer", image: "/projects/kumu media/Correct.png" },
        { label: "Quiz taking", video: "/projects/kumu media/Quiz taking.mp4" },
        { label: "Quiz complete", image: "/projects/kumu media/Quix complete.png" },
      ],
      backgroundImage: "/projects/foundry-cloud-1.png",
      imageAspectRatio: "1320/2868",
      layout: "trio" as const,
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
  if (projectId === "kickback") return [
    {
      title: "Value proposition.",
      headline: "Gen Z relies on group chats to stay close with friends. Market trends show they\u2019re using these spaces to prompt real-time photo updates\u2014creating a more intimate, private version of BeReal.",
      description: "A social app that helps friend groups build intimacy and stay connected through simple, real-time photo and prompt sharing, capitalizing on Gen Z\u2019s desire to participate in connection efforts with their close, intimate friend groups online.",
    },
    {
      title: "The narrative",
      description: "Through competitive analysis, brainstorming, and ranking of the different ideas we had, we were able to craft a narrative that defined a list of features to achieve our goal, without overcomplicating the solution space.",
      image: "/projects/kickback-narrative.png",
      aspectRatio: "732/462",
    },
    {
      title: "Iteration",
      description: "Iteration was a process involving both Claude Code and Figma, generating simple proof of concepts for interactions in Code before porting them into Figma for polish and design.",
      images: [
        { src: "/projects/kickback-lofi-new.png", aspectRatio: "877/449" },
        { src: "/projects/kickback-midfi-new.png", aspectRatio: "1000/1752" },
      ],
      imagesLayout: "stacked" as const,
    },
    {
      title: "Visual design library",
      description: "In the process of developing a visual design library and language, we were able to create polished high-fidelity screens, incorporating all learnings from research and iteration phases.",
      images: [
        { src: "/projects/kickback-visual-1.png", aspectRatio: "2118/1368" },
        { src: "/projects/kickback-visual-2.png", aspectRatio: "3870/4096" },
      ],
      imagesLayout: "stacked" as const,
    },
  ];

  if (projectId === "kumu") return [
    {
      title: "Tech stack",
      description: "The breakdown of technologies for not only design, front-end, and back-end, but also the AI stack for training and deploying LFMs.",
      image: "/projects/kumu-tech-stack.png",
      aspectRatio: "2308/1028",
    },
    {
      title: "Fine tuning LFMs",
      description: "To train Liquid\u2019s Foundational Models to be able to complete the tasks I had in mind, I created training datasets for both Card Generation and Coaching, which were used to train and evaluate the models.",
      image: "/projects/kumu-fine-tuning.png",
      aspectRatio: "2366/596",
    },
    {
      title: "Iteration",
      description: "Iteration was a process involving both Claude Code and Figma, generating simple proof of concepts for interactions in Code before porting them into Figma for polish and design. This, while a simple task, was really interesting to conduct, as it flipped the standard enterprise design process on its head, having code be the base that design worked off of.",
      images: [
        { src: "/projects/kumu-iteration-code.png", aspectRatio: "292/627", rounded: true },
        { src: "/projects/kumu-iteration-midfi.png", aspectRatio: "1313/2862", rounded: true },
        { src: "/projects/kumu media/Home.png", aspectRatio: "1320/2868", rounded: true },
      ],
      imagesLayout: "side-by-side" as const,
    },
    {
      title: "Components and design",
      description: "The design portion of the project was relatively light, where I identified key components and key frames to be designed, and worked in both Figma and Claude Code to bring them to light.",
      images: [
        { src: "/projects/kumu-components-1.png", aspectRatio: "697/440" },
        { src: "/projects/kumu-components-2.png", aspectRatio: "2504/1998" },
        { src: "/projects/kumu-components-3.png", aspectRatio: "3336/1710" },
      ],
      imagesLayout: "stacked" as const,
    },
  ];

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

function getHeroScreens(projectId: string): string[] {
  if (projectId === "kumu") return [
    "/projects/kumu media/Home.png",
    "/projects/kumu media/All decks.png",
    "/projects/kumu media/Profile.png",
  ];
  return [];
}

export default function ProjectDetailV2({ project, onClose }: ProjectDetailV2Props) {
  const detail = project.detail;
  const isDark = project.isDark;
  const t = useTheme(isDark);
  const showcaseCards = getShowcaseCards(project.id);
  const heroScreens = getHeroScreens(project.id);
  const processSections = getProcessSections(project.id);
  const [isLocked, setIsLocked] = useState(
    PASSWORD_PROTECTED_PROJECTS.includes(project.id) &&
      !isProjectUnlocked(project.id)
  );

  // Title with italic second word
  const titleParts = project.title.split(" ");
  const firstPart = titleParts.slice(0, -1).join(" ");
  const lastPart = titleParts[titleParts.length - 1];

  return (
    <div className="relative w-full">
      {/* Back button — starts aligned with project card, sticks to top on scroll */}
      <div className="hidden md:flex sticky top-[16px] z-[60] px-[80px] lg:px-[120px] pb-0 pointer-events-none" style={{ marginTop: "-349px", marginBottom: `${349 - 48}px` }}>
        <motion.button
          onClick={onClose}
          className="flex size-[48px] items-center justify-center rounded-full shadow-sm transition-colors hover:bg-[#e4e4e7] pointer-events-auto"
          style={{ backgroundColor: t.backBtnBg }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
        >
          <ArrowLeft className="size-5" style={{ color: t.backBtnIcon }} />
        </motion.button>
      </div>

      {isLocked ? (
        <PasswordGate projectId={project.id} isDark={isDark} onUnlock={() => setIsLocked(false)} />
      ) : (
      <>
      {/* Project info content */}
      <motion.div
        className="relative flex flex-col gap-8 md:gap-12 px-3 md:px-[80px] lg:px-[120px] py-[20px] md:py-[50px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.15 }}
      >
        {/* Title + Tags + Duration */}
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 w-full">
          <div className="flex flex-1 flex-col gap-3">
            <h2
              className="text-[34px] md:text-[54px] font-normal leading-[1.1] md:leading-[56px] tracking-[-0.03em]"
              style={{
                fontFamily: project.id === "kumu"
                  ? "'Iowan Old Style', 'Georgia', serif"
                  : "'Times New Roman', Times, serif",
                fontStyle: project.id === "kumu" ? "italic" : undefined,
                fontWeight: project.id === "kumu" ? 700 : undefined,
                color: t.foreground,
              }}
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
              <p className="text-[13px] md:text-[15px] leading-[18px] md:leading-[20px] tracking-[-0.026px] md:tracking-[-0.06px]" style={{ color: t.foreground }}>
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
            <p className="text-[15px] md:text-[17px] font-semibold md:font-semibold leading-[20px] md:leading-[22px] tracking-[-0.06px] md:tracking-[-0.068px]" style={{ color: t.foreground }}>
              {detail.contextHeadline}
            </p>
            {detail.context?.map((text, i) => (
              <p key={i} className="text-[13px] md:text-[15px] leading-[18px] md:leading-[20px] tracking-[-0.013px] md:tracking-[-0.06px]" style={{ color: t.foreground }}>
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
            <p className="text-[13px] md:text-[15px] leading-[18px] md:leading-[20px] tracking-[-0.013px] md:tracking-[-0.06px]" style={{ color: t.foreground }}>
              {detail.role}
            </p>
          </div>
        )}
      </motion.div>

      {/* Hero screens — static phone mockups shown before showcase cards */}
      {heroScreens.length > 0 && (
        <motion.div
          className="flex justify-center gap-6 px-3 md:px-[120px] pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.25 }}
        >
          {heroScreens.map((src, i) => (
            <div
              key={i}
              className={`relative rounded-[24px] overflow-hidden border ${i > 0 ? "hidden md:block" : ""}`}
              style={{
                aspectRatio: "1320/2868",
                height: "637px",
                borderColor: t.cardBorder,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08), 0px 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </motion.div>
      )}

      {/* Showcase cards — full-width scroll zones with optional section headers */}
      <div className="flex flex-col gap-16">
        {showcaseCards.map((card, i) => (
          <div key={i} className="flex flex-col gap-5">
            {card.sectionHeader && (
              <div className="px-3 md:px-[80px] lg:px-[120px]">
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
        <div className="flex flex-col gap-5 px-3 md:px-[80px] lg:px-[120px] py-6 mt-16">
          <p className="text-[13px] leading-[18px] tracking-[-0.026px] uppercase font-mono" style={{ color: t.muted }}>
            The process
          </p>
          <div className="flex flex-col gap-10">
            {processSections.map((section, i) => (
              <div key={i} className="flex flex-col gap-10 pb-4">
                <div className={`flex flex-col gap-3 ${section.headline ? "max-w-[800px]" : "max-w-[600px]"}`}>
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
                  {section.headline && (
                    <p
                      className="text-[24px] md:text-[32px] font-bold leading-[1.2] tracking-[-0.02em] max-w-[800px]"
                      style={{ color: t.foreground }}
                    >
                      {section.headline}
                    </p>
                  )}
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
                {/* Single image */}
                {section.image && section.aspectRatio && (
                  <div className="relative rounded-[6px] overflow-hidden lg:w-[70vw]" style={{ aspectRatio: section.aspectRatio }}>
                    <Image src={section.image} alt={section.title} fill className="object-cover" />
                  </div>
                )}
                {/* Multiple images — side-by-side or stacked */}
                {section.images && section.imagesLayout === "side-by-side" && (
                  <div className="flex gap-3 justify-center lg:w-[70vw]">
                    {section.images.map((img, j) => (
                      <div
                        key={j}
                        className={`relative flex-1 overflow-hidden ${img.rounded ? "rounded-[24px] border shadow-md" : ""}`}
                        style={{
                          aspectRatio: img.aspectRatio,
                          borderColor: img.rounded ? t.cardBorder : undefined,
                        }}
                      >
                        <Image src={img.src} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                {section.images && section.imagesLayout === "stacked" && (
                  <div className="flex flex-col gap-10 lg:w-[70vw]">
                    {section.images.map((img, j) => (
                      <div
                        key={j}
                        className="relative w-full overflow-hidden"
                        style={{ aspectRatio: img.aspectRatio }}
                      >
                        <Image src={img.src} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom spacing */}
      <div className="h-16" />
      </>
      )}
    </div>
  );
}
