"use client";

import { Code2, FileText, Linkedin, StickyNote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import { DOCK_TRANSITION } from "@/components/zemeet/room/zeMeetGlassDock";
import { cn } from "@/lib/utils";

type AccentColor = "violet" | "blue" | "amber";

export function ZeMeetFloatingToolbar() {
  const {
    session,
    sidebarTab,
    setSidebarTab,
    codeChallenge,
    openSendCodeChallengeConfirm,
    interviewerIntelPanel,
    toggleInterviewerIntel,
  } = useZeMeet();
  const t = useZeMeetTokens();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";

  if (!isInterviewer) return null;

  const codeChallengeActive =
    codeChallenge.status === "active" || codeChallenge.status === "invite_pending";

  return (
    <div className="pointer-events-none absolute right-4 top-1/2 z-20 -translate-y-1/2">
      <div
        className={cn(
          "pointer-events-auto flex flex-col items-center gap-2 rounded-[20px] border px-1.5 py-3",
          "backdrop-blur-[28px] backdrop-saturate-[180%]",
          DOCK_TRANSITION,
          t.isLight
            ? [
                "border-[rgba(255,255,255,0.60)]",
                "bg-[rgba(255,255,255,0.78)]",
                "shadow-[0_18px_50px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.70)]",
              ]
            : [
                "border-[rgba(255,255,255,0.10)]",
                "bg-[rgba(10,13,18,0.84)]",
                "shadow-[0_18px_50px_rgba(0,0,0,0.44),inset_0_1px_0_rgba(255,255,255,0.08)]",
              ],
        )}
        role="toolbar"
        aria-label="ze[meet] interview tools"
      >
        {/* ze[meet] wordmark */}
        <span
          className={cn(
            "select-none px-1 text-[9px] font-bold uppercase tracking-[0.14em]",
            t.isLight ? "text-violet-600/75" : "text-violet-400/75",
          )}
          aria-hidden
        >
          ze[meet]
        </span>

        {/* Divider */}
        <div
          className={cn("w-6 h-px shrink-0", t.isLight ? "bg-[rgba(15,23,42,0.12)]" : "bg-white/12")}
          aria-hidden
        />

        {/* Code Challenge */}
        <ToolbarButton
          label={
            codeChallenge.status === "active"
              ? "End Code Challenge"
              : codeChallenge.status === "invite_pending"
                ? "Request Pending…"
                : "Launch Code Challenge"
          }
          active={codeChallengeActive}
          accent="violet"
          onClick={openSendCodeChallengeConfirm}
          isLight={t.isLight}
        >
          <Code2 className="h-4 w-4" strokeWidth={1.75} />
        </ToolbarButton>

        {/* Resume */}
        <ToolbarButton
          label="Resume"
          active={interviewerIntelPanel === "resume"}
          accent="violet"
          onClick={() => toggleInterviewerIntel("resume")}
          isLight={t.isLight}
        >
          <FileText className="h-4 w-4" strokeWidth={1.75} />
        </ToolbarButton>

        {/* LinkedIn */}
        <ToolbarButton
          label="LinkedIn"
          active={interviewerIntelPanel === "linkedin"}
          accent="blue"
          onClick={() => toggleInterviewerIntel("linkedin")}
          isLight={t.isLight}
        >
          <Linkedin className="h-4 w-4" strokeWidth={1.75} />
        </ToolbarButton>

        {/* Private Notes */}
        <ToolbarButton
          label="Private Notes"
          active={sidebarTab === "notes"}
          accent="amber"
          onClick={() => setSidebarTab(sidebarTab === "notes" ? null : "notes")}
          isLight={t.isLight}
        >
          <StickyNote className="h-4 w-4" strokeWidth={1.75} />
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  active,
  accent,
  onClick,
  isLight,
}: {
  children: React.ReactNode;
  label: string;
  active: boolean;
  accent: AccentColor;
  onClick?: () => void;
  isLight: boolean;
}) {
  const accentMap: Record<AccentColor, { active: string; idle: string }> = {
    violet: {
      active: isLight
        ? "border-violet-300 bg-violet-100 text-violet-700 shadow-[0_0_0_1px_rgba(124,58,237,0.15)]"
        : "border-violet-400/45 bg-violet-500/20 text-violet-300 shadow-[0_0_12px_-2px_rgba(167,139,250,0.35)]",
      idle: isLight
        ? "border-[rgba(15,23,42,0.10)] bg-white/90 text-[#3F3F46] hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
        : "border-white/10 bg-white/[0.07] text-white/65 hover:border-violet-400/35 hover:bg-violet-500/12 hover:text-violet-300",
    },
    blue: {
      active: isLight
        ? "border-blue-300 bg-blue-100 text-blue-700 shadow-[0_0_0_1px_rgba(37,99,235,0.15)]"
        : "border-blue-400/45 bg-blue-500/20 text-blue-300 shadow-[0_0_12px_-2px_rgba(96,165,250,0.35)]",
      idle: isLight
        ? "border-[rgba(15,23,42,0.10)] bg-white/90 text-[#3F3F46] hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        : "border-white/10 bg-white/[0.07] text-white/65 hover:border-blue-400/35 hover:bg-blue-500/12 hover:text-blue-300",
    },
    amber: {
      active: isLight
        ? "border-amber-300 bg-amber-100 text-amber-700 shadow-[0_0_0_1px_rgba(217,119,6,0.15)]"
        : "border-amber-400/45 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_-2px_rgba(252,211,77,0.30)]",
      idle: isLight
        ? "border-[rgba(15,23,42,0.10)] bg-white/90 text-[#3F3F46] hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
        : "border-white/10 bg-white/[0.07] text-white/65 hover:border-amber-400/35 hover:bg-amber-500/12 hover:text-amber-300",
    },
  };

  return (
    <Tooltip delayDuration={150}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={active}
          onClick={onClick}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
            DOCK_TRANSITION,
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/30 focus-visible:ring-offset-1",
            "active:scale-[0.94]",
            active ? accentMap[accent].active : accentMap[accent].idle,
          )}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        sideOffset={12}
        className={cn(
          "flex items-center border px-2.5 py-1.5 text-[12px] font-medium backdrop-blur-[24px] rounded-[8px]",
          isLight
            ? "border-[rgba(15,23,42,0.1)] bg-white text-[#18181B] shadow-[0_4px_16px_rgba(15,23,42,0.12)]"
            : "border-white/10 bg-[rgba(10,13,18,0.96)] text-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
        )}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
