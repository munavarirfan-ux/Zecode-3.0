"use client";

import { cn } from "@/lib/utils";

function AmbientFloatCard({
  className,
  delay,
  children,
}: {
  className?: string;
  delay: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute rounded-[14px] border border-white/40 bg-white/30 shadow-[0_20px_50px_-30px_rgba(var(--accent-rgb),0.35)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]",
        className,
      )}
      style={{ animation: `nux-float ${6 + parseFloat(delay)}s ease-in-out infinite`, animationDelay: delay }}
      aria-hidden
    >
      {children}
    </div>
  );
}

export function OnboardingAmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -left-[18%] top-[-28%] h-[min(72vh,640px)] w-[min(72vw,720px)] rounded-full bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.22),rgba(192,132,252,0.08)_42%,transparent_72%)]"
        style={{ animation: "nux-mesh 16s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-[12%] top-[8%] h-[min(55vh,480px)] w-[min(50vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.14),rgba(var(--accent-rgb),0.06)_40%,transparent_70%)]"
        style={{ animation: "nux-mesh 20s ease-in-out infinite reverse" }}
      />
      <div
        className="absolute bottom-[-12%] left-[20%] h-[min(45vh,400px)] w-[min(55vw,560px)] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.1),transparent_68%)]"
        style={{ animation: "nux-mesh 22s ease-in-out infinite", animationDelay: "-4s" }}
      />

      <AmbientFloatCard className="left-[4%] top-[18%] h-16 w-28 opacity-50" delay="0s">
        <div className="h-full w-full p-2.5">
          <div className="h-2 w-12 rounded-full bg-accent/25" />
          <div className="mt-2 h-1.5 w-20 rounded-full bg-black/[0.06]" />
        </div>
      </AmbientFloatCard>
      <AmbientFloatCard className="right-[6%] top-[32%] h-14 w-24 opacity-40" delay="1.2s">
        <div className="h-full w-full p-2">
          <div className="flex gap-1">
            <span className="h-5 w-5 rounded-full bg-violet-400/25" />
            <span className="h-1.5 flex-1 rounded-full bg-black/[0.05] self-center" />
          </div>
        </div>
      </AmbientFloatCard>
      <AmbientFloatCard className="bottom-[22%] left-[8%] h-12 w-36 opacity-35" delay="2s" />
      <AmbientFloatCard className="bottom-[30%] right-[10%] h-14 w-32 opacity-45" delay="0.6s" />

      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-[3px] w-[3px] rounded-full bg-[rgb(var(--accent-rgb)/0.35)]"
          style={{
            left: `${6 + i * 9}%`,
            top: `${10 + (i % 4) * 18}%`,
            animation: `nux-float ${5 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
