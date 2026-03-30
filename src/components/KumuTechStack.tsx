"use client";

function Diamond({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="relative flex items-center justify-center w-[160px] h-[160px]">
      <div className="absolute inset-0 rotate-45 rounded-[8px] bg-white dark:bg-[#27272a] border border-border" />
      <div className="relative text-center z-10">
        <p className="text-[13px] font-bold leading-[18px] text-foreground">{title}</p>
        <p className="text-[11px] leading-[16px] text-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function AnnotationLeft({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-[16px] tracking-[-0.026px] text-foreground text-right w-[160px]">
      {children}
    </p>
  );
}

function AnnotationRight({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] leading-[16px] tracking-[-0.026px] text-foreground w-[160px]">
      {children}
    </p>
  );
}

export default function KumuTechStack() {
  return (
    <div className="w-full flex flex-col items-center gap-0 py-8">
      {/* Column headers */}
      <div className="flex gap-[80px] mb-6">
        <p className="text-[17px] font-medium leading-[22px] text-foreground text-center w-[160px]">
          Product stack
        </p>
        <p className="text-[17px] font-medium leading-[22px] text-foreground text-center w-[160px]">
          AI stack
        </p>
      </div>

      {/* Row 1 */}
      <div className="flex items-center gap-4">
        <AnnotationLeft>
          Cross-platform iOS &amp; Android app. Built via Claude Code, Cursor and Expo.
        </AnnotationLeft>
        <Diamond title="Mobile framework" subtitle="React Native" />
        <Diamond title="AI inference" subtitle="Leap Edge SDK + fine-tuned LFM" />
        <AnnotationRight>
          On-device card generation &amp; coaching.
        </AnnotationRight>
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-4 -mt-4">
        <AnnotationLeft>
          Offline-first local SQLite with automatic cloud sync and built-in auth, allowing users to create accounts (Google sign-in), save decks to the cloud, and use the app offline.
        </AnnotationLeft>
        <Diamond title="Backend" subtitle="Powersync + Supabase" />
        <Diamond title="Model customization" subtitle="Liquid AI LEAP Workbench" />
        <AnnotationRight>
          Prompt engineering, evaluation, fine-tuning
        </AnnotationRight>
      </div>

      {/* Row 3 */}
      <div className="flex items-center gap-4 -mt-4">
        <AnnotationLeft>
          UI design source of truth and code handoff.
        </AnnotationLeft>
        <Diamond title="Design" subtitle="Figma" />
        <Diamond title="Data set generation" subtitle="Claude Sonnet 4.6" />
        <AnnotationRight>
          Data set generation for fine tuning.
        </AnnotationRight>
      </div>
    </div>
  );
}
