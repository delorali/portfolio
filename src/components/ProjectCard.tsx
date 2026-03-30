"use client";

import Image from "next/image";

export interface CaseStudyMedia {
  type: "image" | "video";
  src: string;
  darkSrc?: string;
  aspectRatio: string;
  noShadow?: boolean;
  fillWidth?: boolean;
}

export interface ImageGroup {
  title?: string;
  description?: string;
  overview?: string;
  impact?: string;
  layout?: "stacked" | "side-by-side" | "vertical";
  images: CaseStudyMedia[];
  customComponent?: string;
}

export interface CaseStudySection {
  sidebarTitle?: string;
  sidebarDescription?: string;
  sidebarItems: { label: string; isActive?: boolean }[];
  title?: string;
  description?: string;
  overview?: string;
  impact?: string;
  imageLayout?: "vertical" | "horizontal";
  images: CaseStudyMedia[];
  imageGroups?: ImageGroup[];
}

export interface ProjectDetail {
  duration?: string;
  role?: string;
  context?: string[];
  contextHeadline?: string;
  sections: CaseStudySection[];
}

export interface Project {
  id: string;
  title: string;
  year: string;
  isDark: boolean;
  logo?: React.ReactNode;
  centerImage?: string;
  centerImageSize?: { width: number; height: number };
  centerImageOffset?: { y: number };
  backgroundImage?: string;
  backgroundGradient?: string;
  tags?: string[];
  hoverDescription?: string;
  detail?: ProjectDetail;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const bgStyle = project.isDark
    ? {
        backgroundImage:
          project.id === "gotham"
            ? "linear-gradient(181deg, rgba(255,255,255,0.2) 52%, rgba(255,255,255,0) 81%), linear-gradient(90deg, #18181b 0%, #18181b 100%)"
            : "linear-gradient(181deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.06) 90%), linear-gradient(90deg, #18181b 0%, #18181b 100%)",
      }
    : project.backgroundGradient
      ? { backgroundImage: project.backgroundGradient }
      : undefined;

  return (
    <div
      onClick={onClick}
      className={`relative flex w-full md:w-[480px] lg:w-[556px] cursor-pointer flex-col items-start justify-end overflow-hidden rounded-[8px] md:rounded-[16px] border border-border px-4 py-3 md:px-6 md:py-5 ${
        project.isDark ? "" : "bg-white"
      }`}
      style={{ aspectRatio: "556/349", ...bgStyle }}
    >
      {/* Background image */}
      {project.backgroundImage && (
        <div className={project.id === "baba" ? "absolute bottom-0 right-0 w-full h-[66%]" : project.id === "kumu" ? "absolute left-[10.3%] top-[12.9%] w-[78.8%] h-[86.8%]" : "absolute inset-0"}>
          <Image
            src={project.backgroundImage}
            alt=""
            fill
            className="object-cover pointer-events-none"
          />
        </div>
      )}
      {project.centerImage && (
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={project.centerImageOffset ? { marginTop: project.centerImageOffset.y } : undefined}
        >
          <Image
            src={project.centerImage}
            alt=""
            width={project.centerImageSize?.width ?? 160}
            height={project.centerImageSize?.height ?? 140}
            className="pointer-events-none"
            unoptimized={project.centerImage.endsWith(".svg")}
          />
        </div>
      )}

      {/* Bottom bar */}
      <div className="relative z-10 flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          {project.logo}
          {!project.logo && (
            <p
              className={`text-[20px] font-medium leading-[25px] ${
                project.isDark ? "text-[#fafafa]" : "text-[#09090b]"
              }`}
            >
              {project.title}
            </p>
          )}
        </div>
        <p
          className={`text-[15px] leading-[20px] tracking-[-0.06px] ${
            project.isDark ? "text-[#a1a1aa]" : "text-[#09090b]"
          }`}
        >
          {project.year}
        </p>
      </div>
    </div>
  );
}
