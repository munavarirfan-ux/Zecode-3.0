import { cn } from "@/lib/utils";
import type { FeedbackNoteEntry } from "@/lib/hiring/interviewFeedback";
import type { ZeMeetNoteEntry } from "@/lib/zemeet/types";
import { dashboardCanvas } from "@/components/dashboard/dashboardTokens";
import { hiringHeroShell } from "@/components/hiring/hiringTokens";

/** Centered overlay — matches Add Candidate dialog */
export const workspaceOverlay = cn(
  "fixed inset-0 z-[300] flex items-center justify-center",
  "bg-[rgba(15,23,42,0.4)] backdrop-blur-[4px]",
  "px-4 pt-[max(20px,env(safe-area-inset-top))]",
  "pb-[max(20px,env(safe-area-inset-bottom))] sm:px-6",
);

/** Modal panel — same width shell as CandidateFormDialog */
export const feedbackModalPanel = cn(
  dashboardCanvas,
  "relative flex w-full max-w-[960px] flex-col overflow-hidden",
  "max-h-[min(900px,calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom)))]",
  "rounded-[20px] border border-[rgba(15,23,42,0.06)]",
  "shadow-[0_24px_64px_-32px_rgba(15,23,42,0.22)]",
  "text-[#18181B]",
);

/** Scroll region inside modal */
export const feedbackModalScroll =
  "min-h-0 flex-1 overflow-y-auto overscroll-contain";

/** Dialog footer buttons — matches Add Candidate / Schedule Interview */
export const feedbackFooterBtn =
  "inline-flex h-11 min-h-[44px] items-center justify-center gap-1.5 rounded-[11px] px-5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Single content column — hero + cards share full width (like Add Candidate step column).
 */
export const feedbackColumn = "mx-auto w-full min-w-0 space-y-6 px-4 py-6 sm:px-6 sm:py-8";

/** Page title — matches Add Candidate dialog */
export const feedbackPageHeading =
  "text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.03em] text-[#18181B] sm:text-[2rem]";

export const feedbackPageSubheading =
  "max-w-2xl text-[13px] leading-relaxed text-[#52525B]/90";

/** Shared card padding — matches candidate report / feedback hero */
export const feedbackCardPad = "px-7 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-9";

/** Overrides hiringHeroShell default padding */
export const feedbackCardPadImportant =
  "!px-7 !py-7 sm:!px-8 sm:!py-8 lg:!px-10 lg:!py-9";

export const feedbackCardRadius = "rounded-[16px]";

export const feedbackCardSurface = cn(
  feedbackCardRadius,
  "w-full bg-white/80 backdrop-blur-sm",
  "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.06)]",
  "ring-1 ring-[rgba(15,23,42,0.05)]",
);

export function feedbackCardShell(className?: string, expanded?: boolean) {
  return cn(
    feedbackCardSurface,
    feedbackCardPad,
    "transition-[box-shadow,background-color] duration-200",
    expanded && "bg-white shadow-[0_2px_8px_rgba(15,23,42,0.05),0_12px_32px_-16px_rgba(15,23,42,0.08)]",
    className,
  );
}

/** Hero card — full width of modal column; overflow visible for sticky notes */
export const feedbackHeroShell = cn(
  hiringHeroShell,
  feedbackCardRadius,
  "w-full shrink-0 overflow-visible border-b-0 shadow-none",
  feedbackCardPadImportant,
  "min-h-[11rem] sm:min-h-[11.5rem]",
);

/** Sticky note on hero — post-it on gradient card */
export function heroStickyNote(selected: boolean) {
  return cn(
    "pointer-events-auto rounded-sm border border-amber-200/90 bg-[#FEF9C3] px-3 py-2.5 text-left",
    selected && "ring-2 ring-amber-500/40 ring-offset-2 ring-offset-[#FEF9C3]",
  );
}

export const workspaceContent =
  "flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-6";

export const workspaceMain = "min-w-0 flex-1 lg:w-[68%]";
export const workspaceRail = "min-w-0 w-full shrink-0 lg:w-[32%]";

export function wsText(role: "primary" | "body" | "muted" | "label" | "faint") {
  const map = {
    primary: "text-[#18181B]",
    body: "text-[#3F3F46]",
    muted: "text-[#71717A]",
    label: "text-[#52525B]",
    faint: "text-[#A1A1AA]",
  };
  return map[role];
}

/** Skill evaluation card — same padding & radius as hero */
export function skillModule(expanded?: boolean) {
  return feedbackCardShell(undefined, expanded);
}

export const compactInput = cn(
  "w-full resize-none overflow-hidden bg-[rgba(15,23,42,0.03)]",
  "rounded-xl px-3 py-2 text-[13px] leading-[1.55] text-[#3F3F46]",
  "placeholder:text-[#A1A1AA]",
  "ring-1 ring-transparent transition-[box-shadow,background-color,ring-color]",
  "focus:bg-white focus:outline-none focus:ring-[rgba(15,23,42,0.08)]",
);

export const inlineInput = cn(
  "bg-transparent text-[15px] font-semibold tracking-[-0.03em] text-[#18181B]",
  "placeholder:text-[#C4C4C8] focus:outline-none",
);

export function signalChip(active: boolean) {
  return cn(
    "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent-rgb)/0.15)]",
    active
      ? "bg-[rgba(15,23,42,0.07)] text-[#3F3F46]"
      : "text-[#A1A1AA] hover:bg-[rgba(15,23,42,0.04)] hover:text-[#71717A]",
  );
}

export const expandLink = cn(
  "text-[12px] font-medium text-[#71717A] transition-colors",
  "hover:text-[rgb(var(--accent-rgb))]",
);

export const railLabel = "text-[10px] font-medium uppercase tracking-[0.12em] text-[#A1A1AA]";

export function statusDot(state: "idle" | "saving" | "saved") {
  return cn(
    "h-1.5 w-1.5 rounded-full",
    state === "saving" && "animate-pulse bg-amber-400",
    state === "saved" && "bg-emerald-500",
    state === "idle" && "bg-[#D4D4D8]",
  );
}

export function formatSessionNoteTime(note: ZeMeetNoteEntry): string {
  if (note.timestampMs !== undefined) {
    const totalSec = Math.floor(note.timestampMs / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  try {
    return new Date(note.createdAt).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return note.createdAt;
  }
}

export function resolveSessionNotesForDisplay(
  liveNotes: ZeMeetNoteEntry[],
  bundleNotes: FeedbackNoteEntry[],
): ZeMeetNoteEntry[] {
  if (liveNotes.length > 0) {
    return [...liveNotes].reverse();
  }
  return bundleNotes
    .filter((n) => n.phase === "during")
    .map((n) => ({
      id: n.id,
      body: n.body,
      createdAt: n.at,
    }))
    .reverse();
}

export function skillHasDetailedContent(skill: {
  strengths: string[];
  concerns: string[];
  detailedNotes: string;
}): boolean {
  return (
    skill.strengths.length > 0 ||
    skill.concerns.length > 0 ||
    skill.detailedNotes.trim().length > 0
  );
}
