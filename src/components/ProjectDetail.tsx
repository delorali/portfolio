"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Project, CaseStudySection, CaseStudyMedia } from "./ProjectCard";
import { Badge } from "./ui/badge";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

function SectionSidebar({
  title,
  description,
  items,
  activeIndex,
}: {
  title?: string;
  description?: string;
  items: CaseStudySection["sidebarItems"];
  activeIndex: number;
}) {
  return (
    <div className="sticky top-[72px] flex w-[220px] shrink-0 flex-col items-start self-start py-[72px]">
      {title && description ? (
        <div className="flex w-full flex-col gap-4 text-foreground">
          <p className="text-[17px] font-semibold leading-[22px] tracking-[-0.068px]">
            {title}
          </p>
          <p className="text-[15px] leading-[20px] tracking-[-0.06px]">
            {description}
          </p>
        </div>
      ) : (
        <>
          {title && (
            <div className="flex w-full items-center py-3">
              <p className="text-[17px] font-semibold leading-[22px] tracking-[-0.068px] text-foreground">
                {title}
              </p>
            </div>
          )}
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex w-full items-center px-4 py-2 border-l transition-colors duration-200 ${
                i === activeIndex
                  ? "border-ring text-card-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <p className="text-[14px] leading-[19px] tracking-[-0.042px]">
                {item.label}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function MediaElement({
  media,
  innerRef,
}: {
  media: CaseStudyMedia;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  if (media.type === "video") {
    return (
      <div
        ref={innerRef}
        className="relative w-full rounded-[6px] border border-border overflow-hidden"
        style={{ aspectRatio: media.aspectRatio }}
      >
        <video
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>
    );
  }
  return (
    <div
      ref={innerRef}
      className="relative w-full"
      style={{ aspectRatio: media.aspectRatio }}
    >
      <Image
        src={media.src}
        alt=""
        fill
        className="object-cover pointer-events-none"
      />
    </div>
  );
}

function CaseStudySectionBlock({
  section,
  animationDelay,
}: {
  section: CaseStudySection;
  animationDelay: number;
}) {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const setImageRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      imageRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    imageRefs.current.forEach((ref, index) => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        {
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const hasSidebarTitle = !!section.sidebarTitle;

  return (
    <motion.div
      className="flex gap-12 px-[240px] w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: animationDelay,
      }}
    >
      <SectionSidebar
        title={section.sidebarTitle}
        description={section.sidebarDescription}
        items={section.sidebarItems}
        activeIndex={activeIndex}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 items-start justify-center py-[72px]">
        {(section.title || section.description) && (
          <div className="flex flex-col gap-4 w-full text-foreground">
            {section.title && (
              <p className={hasSidebarTitle ? "text-[28px] font-semibold leading-[34px] tracking-[-0.112px]" : "text-[20px] font-medium leading-[25px]"}>
                {section.title}
              </p>
            )}
            {section.description && (
              <p className="text-[15px] leading-[20px] tracking-[-0.06px]">
                {section.description}
              </p>
            )}
          </div>
        )}
        {section.overview && (
          <div className="flex flex-col gap-3 w-full text-foreground">
            <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
              Product Overview
            </p>
            <p className="text-[15px] leading-[20px] tracking-[-0.06px]">
              {section.overview}
            </p>
          </div>
        )}
        {section.impact && (
          <div className="flex flex-col gap-3 w-full text-foreground">
            <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
              My Impact
            </p>
            <p className="text-[15px] leading-[20px] tracking-[-0.06px]">
              {section.impact}
            </p>
          </div>
        )}
        {section.images.map((img, i) => (
          <MediaElement
            key={i}
            media={img}
            innerRef={setImageRef(i)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function ProjectDetail({
  project,
  onClose,
}: ProjectDetailProps) {
  const detail = project.detail;

  if (!detail) {
    return (
      <motion.div
        className="px-[240px] py-[50px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.15 }}
      >
        <p className="text-[20px] font-medium leading-[25px] text-foreground">
          Case study coming soon.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Back button — starts in-flow then sticks at header level */}
      <div className="absolute left-[240px] top-[-349px] bottom-0 z-[60] pointer-events-none">
        <div className="sticky top-[16px] pointer-events-auto">
          <motion.button
            onClick={onClose}
            className="flex size-[48px] items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
          >
            <ArrowLeft className="size-5" />
          </motion.button>
        </div>
      </div>

      {/* Project info header */}
      <motion.div
        className="relative flex flex-col gap-12 overflow-hidden px-[240px] py-[50px]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          delay: 0.15,
        }}
      >
        {/* Title + Tags + Duration row */}
        <div className="flex items-start gap-16 w-full">
          <div className="flex flex-1 flex-col gap-4">
            <h2 className="text-[54px] font-semibold leading-[56px] tracking-[-0.594px] text-foreground">
              {project.title}
            </h2>
            {project.tags && (
              <div className="flex gap-1.5">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {detail.duration && (
            <div className="flex shrink-0 flex-col gap-3">
              <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
                Duration
              </p>
              <p className="text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
                {detail.duration}
              </p>
            </div>
          )}
        </div>

        {/* My Role */}
        {detail.role && (
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
              My Role
            </p>
            <p className="text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
              {detail.role}
            </p>
          </div>
        )}

        {/* Context */}
        {detail.context && (
          <div className="flex flex-col gap-3 w-full">
            <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
              Context
            </p>
            {detail.contextHeadline && (
              <p className="text-[17px] font-semibold leading-[22px] tracking-[-0.068px] text-foreground">
                {detail.contextHeadline}
              </p>
            )}
            <div className="flex flex-col text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
              {detail.context.map((paragraph, i) => (
                <p key={i} className={i > 0 ? "mt-[20px]" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Case study sections */}
      {detail.sections.map((section, i) => (
        <CaseStudySectionBlock
          key={i}
          section={section}
          animationDelay={0.25 + i * 0.1}
        />
      ))}
    </div>
  );
}
