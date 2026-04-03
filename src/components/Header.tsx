"use client";

import Image from "next/image";
import { ArrowUpRight, ArrowLeft } from "lucide-react";

interface HeaderProps {
  isProjectOpen?: boolean;
  isDarkProject?: boolean;
  onBack?: () => void;
}

export default function Header({ isProjectOpen, isDarkProject, onBack }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-5">
      {isProjectOpen ? (
        <button
          onClick={onBack}
          className={`flex md:hidden size-[38px] items-center justify-center rounded-full border transition-colors ${
            isDarkProject
              ? "border-white/15 bg-[#27272a] text-[#fafafa] hover:bg-[#3f3f46]"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          <ArrowLeft className="size-4" />
        </button>
      ) : null}
      <div className={`flex-1 ${isProjectOpen ? "hidden md:block" : ""}`}>
        <Image
          src={isDarkProject ? "/Logo/Logo/Dark.svg" : "/Logo/Logo/Light.svg"}
          alt="Logo"
          width={40}
          height={40}
        />
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/DeloraLiResume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 rounded-[10px] border px-4 py-2 text-[15px] font-medium leading-normal transition-colors ${
            isDarkProject
              ? "border-white/15 bg-[#18181b] text-[#fafafa] hover:bg-[#27272a]"
              : "border-border bg-background text-foreground hover:bg-muted"
          }`}
        >
          Resume
          <ArrowUpRight className="hidden md:block size-4" />
        </a>
      </div>
    </header>
  );
}
