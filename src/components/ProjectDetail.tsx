"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import type { Project, CaseStudySection, CaseStudyMedia, ImageGroup } from "./ProjectCard";
import { Badge } from "./ui/badge";
import KumuTechStack from "./KumuTechStack";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

function SectionSidebar({
  title,
  description,
  sectionTitle,
  items,
  activeIndex,
}: {
  title?: string;
  description?: string;
  sectionTitle?: string;
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
          {sectionTitle && !title && (
            <div className="pb-4 w-full">
              <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
                {sectionTitle}
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
  const mdShadow = media.type === "image" ? "none" : "0px 1px 2px rgba(0,0,0,0.03), 0px 2px 6px rgba(0,0,0,0.04), 0px 4px 12px rgba(0,0,0,0.08)";

  if (media.type === "video") {
    return (
      <div
        ref={innerRef}
        className="relative w-full rounded-[6px] border border-border overflow-hidden"
        style={{ aspectRatio: media.aspectRatio, boxShadow: mdShadow }}
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
  if (media.fillWidth) {
    const [w, h] = media.aspectRatio.split("/").map(Number);
    return (
      <div ref={innerRef} className="w-full" style={{ boxShadow: mdShadow }}>
        <Image
          src={media.src}
          alt=""
          width={w}
          height={h}
          className={`w-full h-auto pointer-events-none${media.darkSrc ? " dark:hidden" : ""}`}
        />
        {media.darkSrc && (
          <Image
            src={media.darkSrc}
            alt=""
            width={w}
            height={h}
            className="w-full h-auto pointer-events-none hidden dark:block"
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={innerRef}
      className="relative w-full"
      style={{ aspectRatio: media.aspectRatio, boxShadow: mdShadow }}
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

function ImageGroupBlock({
  group,
  innerRef,
}: {
  group: ImageGroup;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  if (group.layout === "side-by-side") {
    const phoneCount = group.images.length;
    const textBlock = (
      <>
        {group.title && (
          <p className="text-[22px] md:text-[28px] font-semibold leading-[28px] md:leading-[34px] tracking-[-0.04em]">
            {group.title}
          </p>
        )}
        {group.description && (
          <p className="text-[15px] leading-[20px] tracking-[-0.06px]">
            {group.description}
          </p>
        )}
      </>
    );
    const imageBlock = group.images.map((img, i) => (
      <div
        key={i}
        className="relative rounded-[20px] border border-border overflow-hidden"
        style={{ aspectRatio: img.aspectRatio }}
      >
        {img.type === "video" ? (
          <video
            src={img.src}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <Image
            src={img.src}
            alt=""
            fill
            className="object-cover pointer-events-none"
          />
        )}
      </div>
    ));
    return (
      <>
        {/* Mobile: stacked vertically */}
        <div ref={innerRef} className="flex md:hidden flex-col gap-4 w-full">
          <div className="flex flex-col gap-4 text-foreground">
            {textBlock}
          </div>
          <div className="flex gap-3 w-full">
            {imageBlock}
          </div>
        </div>
        {/* Desktop: side by side */}
        <div className="hidden md:flex gap-3 w-full items-end">
          <div className="flex flex-col gap-4 min-w-0 text-foreground" style={{ width: `calc(${((3 - phoneCount) / 3) * 100}% - ${(12 * phoneCount) / 3}px)` }}>
            {textBlock}
          </div>
          {imageBlock.map((el, i) => (
            <div key={i} style={{ width: `calc(${100 / 3}% - ${(12 * 2) / 3}px)` }}>
              {el}
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div ref={innerRef} className="flex flex-col gap-[24px] w-full">
      {group.title && (
        <p className="text-[22px] md:text-[28px] font-semibold leading-[28px] md:leading-[34px] tracking-[-0.04em] text-foreground">
          {group.title}
        </p>
      )}
      {group.overview && (
        <div className="flex flex-col gap-3 w-full text-foreground">
          <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
            Problem overview
          </p>
          <p className="text-[15px] leading-[20px] tracking-[-0.06px] whitespace-pre-line">
            {group.overview}
          </p>
        </div>
      )}
      {group.impact && (
        <div className="flex flex-col gap-3 w-full text-foreground">
          <p className="text-[13px] leading-[18px] tracking-[-0.026px] text-muted-foreground">
            My Impact
          </p>
          <p className="text-[15px] leading-[20px] tracking-[-0.06px] whitespace-pre-line">
            {group.impact}
          </p>
        </div>
      )}
      {group.description && (
        <p className="text-[15px] leading-[20px] tracking-[-0.06px] whitespace-pre-line text-foreground">
          {group.description}
        </p>
      )}
      {group.customComponent === "kumu-tech-stack" && <KumuTechStack />}
      {group.images.length > 0 && (
        <div className={group.layout === "vertical" ? "flex flex-col gap-3 w-full" : "flex gap-3 w-full items-start"}>
          {group.images.map((img, i) => {
            const isMobileScreen = img.aspectRatio && (() => {
              const [w, h] = img.aspectRatio.split("/").map(Number);
              return h > w;
            })();
            return (
              <div
                key={i}
                className={
                  group.layout === "vertical"
                    ? "w-full"
                    : isMobileScreen
                      ? "rounded-[20px] border border-border overflow-hidden"
                      : "flex-1 min-w-0"
                }
                style={
                  group.layout !== "vertical" && isMobileScreen
                    ? { width: `calc(${100 / 3}% - ${(12 * 2) / 3}px)` }
                    : undefined
                }
              >
                <MediaElement media={img} />
              </div>
            );
          })}
        </div>
      )}
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
      className="flex gap-12 px-5 md:px-[80px] lg:px-[240px] w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: animationDelay,
      }}
    >
      <div className="hidden md:block">
        <SectionSidebar
          title={section.sidebarTitle}
          description={section.sidebarDescription}
          sectionTitle={section.title}
          items={section.sidebarItems}
          activeIndex={activeIndex}
        />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[24px] items-start justify-center py-[40px] md:py-[72px]">
        {(section.title || section.description) && (
          <div className="flex flex-col gap-4 w-full text-foreground">
            {section.title && (
              <p className="text-[22px] md:text-[28px] font-semibold leading-[28px] md:leading-[34px] tracking-[-0.04em]">
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
              Problem overview
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
        {section.imageGroups && section.images.length > 0 && (
          section.images.map((img, i) => (
            <MediaElement
              key={`img-${i}`}
              media={img}
              innerRef={setImageRef(i)}
            />
          ))
        )}
        {section.imageGroups ? (
          <div className={`flex flex-col gap-[96px] w-full${section.images.length > 0 ? " pt-[40px]" : ""}`}>
            {section.imageGroups.map((group, gi) => (
              <ImageGroupBlock
                key={gi}
                group={group}
                innerRef={setImageRef(section.images.length + gi)}
              />
            ))}
          </div>
        ) : section.imageLayout === "horizontal" ? (
          <div className="flex gap-3 w-full items-start">
            {section.images.map((img, i) => (
              <div key={i} className="flex-1 min-w-0">
                <MediaElement
                  media={img}
                  innerRef={setImageRef(i)}
                />
              </div>
            ))}
          </div>
        ) : (
          section.images.map((img, i) => (
            <MediaElement
              key={i}
              media={img}
              innerRef={setImageRef(i)}
            />
          ))
        )}
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
        className="px-5 md:px-[80px] lg:px-[240px] py-[50px]"
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
      {/* Back button — starts in-flow then sticks at header level (desktop only, mobile uses Header) */}
      <div className="hidden md:block absolute left-[80px] lg:left-[240px] top-[-349px] bottom-0 z-[60] pointer-events-none">
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
        className="relative flex flex-col gap-8 md:gap-12 overflow-hidden px-5 md:px-[80px] lg:px-[240px] py-[30px] md:py-[50px]"
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
        <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 w-full">
          <div className="flex flex-1 flex-col gap-3 md:gap-4">
            <h2
              className="text-[36px] md:text-[54px] font-semibold leading-[1.1] md:leading-[56px] tracking-[-0.04em] text-foreground"
              style={project.id === "kumu" ? { fontFamily: "'Iowan Old Style', 'Georgia', serif", fontStyle: "italic", fontWeight: 400 } : undefined}
            >
              {project.title}
            </h2>
            {project.tags && (
              <div className="flex flex-wrap gap-1.5">
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
