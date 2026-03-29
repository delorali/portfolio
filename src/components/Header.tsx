"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, Sun, Moon } from "lucide-react";

export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-[20px]">
      <p className="flex-1 text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
        delzli
      </p>
      <div className="flex items-center gap-2">
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-[10px] border border-border bg-background px-4 py-2 text-[15px] font-medium leading-normal text-foreground transition-colors hover:bg-muted"
        >
          Resume
          <ArrowUpRight className="size-4" />
        </a>
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex size-[38px] items-center justify-center rounded-[10px] border border-border bg-background text-foreground transition-colors hover:bg-muted"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>
    </header>
  );
}
