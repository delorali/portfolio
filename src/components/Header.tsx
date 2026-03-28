import { ArrowUpRight } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-[20px]">
      <p className="flex-1 text-[15px] leading-[20px] tracking-[-0.06px] text-foreground">
        delzli
      </p>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-[10px] border border-border bg-background px-4 py-2 text-[15px] font-medium leading-normal text-foreground transition-colors hover:bg-muted"
      >
        Resume
        <ArrowUpRight className="size-4" />
      </a>
    </header>
  );
}
