"use client";

import { cn } from "@/lib/utils";

export type LineArtIllustrationId =
  | "team"
  | "jobs"
  | "interviews"
  | "assessments"
  | "candidates"
  | "questionPool"
  | "calendar"
  | "feedback"
  | "search"
  | "filters"
  | "kanban"
  | "email"
  | "transfer"
  | "notes"
  | "tags"
  | "generic"
  | "network"
  | "permission"
  | "notFound"
  | "welcome"
  | "proctoring"
  | "chat";

const stroke = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function LineArtIllustration({
  id,
  className,
}: {
  id: LineArtIllustrationId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[72px] w-[120px]", className)}
      aria-hidden
    >
      {id === "team" && (
        <>
          <circle cx="28" cy="22" r="10" {...stroke} strokeOpacity="0.35" />
          <path d="M14 52c0-7.732 6.268-14 14-14s14 6.268 14 14" {...stroke} strokeOpacity="0.35" />
          <circle cx="92" cy="22" r="10" {...stroke} strokeOpacity="0.35" />
          <path d="M78 52c0-7.732 6.268-14 14-14s14 6.268 14 14" {...stroke} strokeOpacity="0.35" />
          <circle cx="60" cy="24" r="14" {...stroke} strokeDasharray="4 3" strokeOpacity="0.55" />
          <circle cx="60" cy="24" r="7" {...stroke} strokeOpacity="0.5" />
          <path d="M48 56c0-6.627 5.373-12 12-12s12 5.373 12 12" {...stroke} strokeOpacity="0.5" />
          <path d="M56 24h8M60 20v8" {...stroke} strokeOpacity="0.45" />
        </>
      )}

      {id === "jobs" && (
        <>
          <rect x="28" y="18" width="64" height="40" rx="6" {...stroke} strokeOpacity="0.45" />
          <path d="M40 18v-6a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v6" {...stroke} strokeOpacity="0.45" />
          <path d="M44 36h32M44 44h20" {...stroke} strokeOpacity="0.35" />
          <circle cx="84" cy="44" r="3" {...stroke} strokeOpacity="0.4" />
        </>
      )}

      {id === "candidates" && (
        <>
          <circle cx="38" cy="26" r="9" {...stroke} strokeOpacity="0.4" />
          <path d="M24 54c0-7.732 6.268-14 14-14" {...stroke} strokeOpacity="0.35" />
          <rect x="58" y="20" width="44" height="36" rx="6" {...stroke} strokeOpacity="0.45" />
          <path d="M66 32h28M66 40h18M66 48h22" {...stroke} strokeOpacity="0.3" />
        </>
      )}

      {id === "interviews" && (
        <>
          <rect x="22" y="16" width="76" height="44" rx="8" {...stroke} strokeOpacity="0.45" />
          <circle cx="44" cy="36" r="10" {...stroke} strokeOpacity="0.4" />
          <path d="M34 52c0-6.627 5.373-10 10-10" {...stroke} strokeOpacity="0.35" />
          <circle cx="78" cy="36" r="10" {...stroke} strokeOpacity="0.4" />
          <path d="M68 52c0-6.627 5.373-10 10-10" {...stroke} strokeOpacity="0.35" />
          <path d="M54 24h12" {...stroke} strokeOpacity="0.35" />
        </>
      )}

      {id === "assessments" && (
        <>
          <rect x="30" y="14" width="60" height="48" rx="6" {...stroke} strokeOpacity="0.45" />
          <path d="M42 28h36M42 36h24M42 44h30" {...stroke} strokeOpacity="0.35" />
          <path d="M78 48l6 8" {...stroke} strokeOpacity="0.4" />
          <circle cx="84" cy="54" r="4" {...stroke} strokeOpacity="0.4" />
        </>
      )}

      {id === "questionPool" && (
        <>
          <path d="M32 20h56M32 32h40M32 44h48M32 56h28" {...stroke} strokeOpacity="0.4" />
          <circle cx="88" cy="56" r="8" {...stroke} strokeOpacity="0.45" />
          <path d="M85 56h6M88 53v6" {...stroke} strokeOpacity="0.45" />
        </>
      )}

      {id === "calendar" && (
        <>
          <rect x="28" y="18" width="64" height="44" rx="6" {...stroke} strokeOpacity="0.45" />
          <path d="M28 30h64M44 18v-8M76 18v-8" {...stroke} strokeOpacity="0.4" />
          <path d="M40 42h8v8h-8zM56 42h8v8h-8zM72 42h8v8h-8z" {...stroke} strokeOpacity="0.35" />
        </>
      )}

      {id === "feedback" && (
        <>
          <path d="M32 24h48a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H52l-12 10v-10H32a8 8 0 0 1-8-8V32a8 8 0 0 1 8-8z" {...stroke} strokeOpacity="0.45" />
          <path d="M44 38h32M44 46h20" {...stroke} strokeOpacity="0.35" />
        </>
      )}

      {id === "search" && (
        <>
          <circle cx="52" cy="32" r="16" {...stroke} strokeOpacity="0.5" />
          <path d="M64 44l18 18" {...stroke} strokeOpacity="0.5" />
          <path d="M46 32h12" {...stroke} strokeDasharray="3 2" strokeOpacity="0.35" />
        </>
      )}

      {id === "filters" && (
        <>
          <path d="M36 20h48l-16 22v18l-16-8V42L36 20z" {...stroke} strokeOpacity="0.45" />
          <path d="M48 36h24" {...stroke} strokeOpacity="0.35" />
        </>
      )}

      {id === "kanban" && (
        <>
          <rect x="18" y="18" width="24" height="40" rx="4" {...stroke} strokeOpacity="0.4" />
          <rect x="48" y="26" width="24" height="32" rx="4" {...stroke} strokeOpacity="0.45" />
          <rect x="78" y="22" width="24" height="36" rx="4" {...stroke} strokeDasharray="4 3" strokeOpacity="0.5" />
          <path d="M26 30h8M26 38h12M56 36h8M86 32h8" {...stroke} strokeOpacity="0.3" />
        </>
      )}

      {id === "email" && (
        <>
          <rect x="24" y="22" width="72" height="36" rx="6" {...stroke} strokeOpacity="0.45" />
          <path d="M24 28l36 22 36-22" {...stroke} strokeOpacity="0.4" />
        </>
      )}

      {id === "transfer" && (
        <>
          <rect x="16" y="26" width="36" height="28" rx="4" {...stroke} strokeOpacity="0.4" />
          <rect x="68" y="26" width="36" height="28" rx="4" {...stroke} strokeOpacity="0.45" />
          <path d="M52 38h16M58 34l6 4-6 4" {...stroke} strokeOpacity="0.5" />
        </>
      )}

      {id === "notes" && (
        <>
          <path d="M36 16h40l12 12v32H36V16z" {...stroke} strokeOpacity="0.45" />
          <path d="M76 16v12h12" {...stroke} strokeOpacity="0.4" />
          <path d="M44 36h32M44 44h24M44 52h28" {...stroke} strokeOpacity="0.35" />
        </>
      )}

      {id === "tags" && (
        <>
          <path d="M32 32l16-12a6 6 0 0 1 8.5 0l24 24a6 6 0 0 1 0 8.5L72 56H40a8 8 0 0 1-8-8V32z" {...stroke} strokeOpacity="0.45" />
          <circle cx="48" cy="40" r="3" {...stroke} strokeOpacity="0.4" />
        </>
      )}

      {id === "chat" && (
        <>
          <path d="M28 20h52a10 10 0 0 1 10 10v16a10 10 0 0 1-10 10H48l-14 12v-12H28a10 10 0 0 1-10-10V30a10 10 0 0 1 10-10z" {...stroke} strokeOpacity="0.45" />
          <path d="M38 34h12M38 42h32" {...stroke} strokeOpacity="0.35" />
        </>
      )}

      {id === "proctoring" && (
        <>
          <rect x="22" y="18" width="76" height="40" rx="6" {...stroke} strokeOpacity="0.45" />
          <circle cx="60" cy="36" r="8" {...stroke} strokeOpacity="0.4" />
          <path d="M42 54h36" {...stroke} strokeOpacity="0.35" />
          <circle cx="88" cy="24" r="4" fill="currentColor" fillOpacity="0.15" {...stroke} strokeOpacity="0.5" />
        </>
      )}

      {(id === "generic" || id === "welcome") && (
        <>
          <path d="M36 20h48l-8 44H44L36 20z" {...stroke} strokeOpacity="0.4" />
          <path d="M52 32h24M52 40h16" {...stroke} strokeOpacity="0.35" />
          <circle cx="84" cy="48" r="10" {...stroke} strokeDasharray="4 3" strokeOpacity="0.5" />
        </>
      )}

      {id === "network" && (
        <>
          <path d="M24 40c0-12 10-22 22-22h8" {...stroke} strokeOpacity="0.45" />
          <path d="M96 40c0-12-10-22-22-22h-8" {...stroke} strokeOpacity="0.45" />
          <path d="M44 52h32" {...stroke} strokeOpacity="0.4" />
          <path d="M54 40h12" {...stroke} strokeDasharray="3 2" strokeOpacity="0.5" />
        </>
      )}

      {id === "permission" && (
        <>
          <rect x="40" y="32" width="40" height="32" rx="4" {...stroke} strokeOpacity="0.45" />
          <path d="M48 32v-6a12 12 0 0 1 24 0v6" {...stroke} strokeOpacity="0.45" />
          <circle cx="60" cy="46" r="4" {...stroke} strokeOpacity="0.4" />
          <path d="M60 50v6" {...stroke} strokeOpacity="0.4" />
        </>
      )}

      {id === "notFound" && (
        <>
          <circle cx="60" cy="32" r="18" {...stroke} strokeOpacity="0.4" />
          <path d="M52 44l16 16M76 20L44 52" {...stroke} strokeOpacity="0.45" />
          <path d="M54 30h4l-2 8h4" {...stroke} strokeOpacity="0.5" />
        </>
      )}

      <path d="M8 62h104" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

/** Maps legacy illustration ids to line-art equivalents */
export function toLineArtIllustrationId(
  id: string,
): LineArtIllustrationId {
  const map: Record<string, LineArtIllustrationId> = {
    jobs: "jobs",
    interviews: "interviews",
    assessments: "assessments",
    candidates: "candidates",
    questionPool: "questionPool",
    calendar: "calendar",
    proctoring: "proctoring",
    feedback: "feedback",
    network: "network",
    permission: "permission",
    notFound: "notFound",
    welcome: "welcome",
  };
  if (id in map) return map[id as keyof typeof map];
  if (
    [
      "team",
      "jobs",
      "interviews",
      "assessments",
      "candidates",
      "questionPool",
      "calendar",
      "feedback",
      "search",
      "filters",
      "kanban",
      "email",
      "transfer",
      "notes",
      "tags",
      "generic",
      "network",
      "permission",
      "notFound",
      "welcome",
      "proctoring",
      "chat",
    ].includes(id)
  ) {
    return id as LineArtIllustrationId;
  }
  return "generic";
}
