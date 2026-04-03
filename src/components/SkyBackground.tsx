"use client";

import Image from "next/image";

interface SkyBackgroundProps {
  src: string;
  isDark: boolean;
}

/**
 * Progressive-blur sky background that sits behind project detail pages.
 * Sharp at top, blurs to ~10px at bottom, fades into the page background color.
 * Positioned to overlap above the top edge of the page.
 */
export default function SkyBackground({ src, isDark }: SkyBackgroundProps) {
  const bgColor = isDark ? "#18181b" : "#f4f4f5";

  // 4 layers with increasing blur. Each layer is masked so it only shows
  // in its vertical band, creating a smooth progressive blur from 0→10px.
  // Progressive blur: sharp at top, blurring toward bottom.
  // Base layer is sharp everywhere. Each blur layer fades IN from top to bottom,
  // progressively replacing the sharp image with blurrier versions.
  const blurLayers = [
    { blur: 3, fadeStart: "30%", fadeEnd: "50%" },
    { blur: 6, fadeStart: "45%", fadeEnd: "70%" },
    { blur: 10, fadeStart: "60%", fadeEnd: "85%" },
  ];

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none overflow-hidden"
      style={{ height: "800px", top: "-700px" }}
    >
      {/* Base sharp layer — fully visible */}
      <div className="absolute inset-0">
        <Image src={src} alt="" fill className="object-cover" />
      </div>
      {/* Blur layers — each fades in further down, replacing sharp with blurry */}
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
      {/* Fade to page background at the bottom */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to top, ${bgColor} 0%, ${bgColor}CC 15%, transparent 60%)`,
        }}
      />
    </div>
  );
}
