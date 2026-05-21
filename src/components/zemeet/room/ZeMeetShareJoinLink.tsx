"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, Link2, Mail, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { zeMeetCandidateJoinUrl } from "@/lib/zemeet/rooms";

export async function copyZeMeetCandidateJoinLink(roomId: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(zeMeetCandidateJoinUrl(roomId));
    return true;
  } catch {
    return false;
  }
}
import { cn } from "@/lib/utils";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";

export function ZeMeetShareJoinLink({
  roomId,
  candidateName,
  className,
}: {
  roomId: string;
  candidateName: string;
  className?: string;
}) {
  const t = useZeMeetTokens();
  const [copied, setCopied] = useState(false);

  const joinUrl = useMemo(() => zeMeetCandidateJoinUrl(roomId), [roomId]);

  const copyLink = useCallback(async () => {
    const ok = await copyZeMeetCandidateJoinLink(roomId);
    if (ok) {
      setCopied(true);
      toast.success("Candidate join link copied");
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy link");
    }
  }, [roomId]);

  const btn = cn(
    "inline-flex h-8 items-center gap-1.5 rounded-[9px] border px-2.5 text-[12px] font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
    t.isLight
      ? "border-[rgba(15,23,42,0.1)] bg-white text-[#3F3F46] hover:bg-[#FAFAFB] focus-visible:ring-forest/25"
      : "border-white/12 bg-white/[0.06] text-white/85 hover:bg-white/10 focus-visible:ring-white/25",
    className,
  );

  const menuClass = cn(
    "z-[120] w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-[12px] border p-1 backdrop-blur-[20px]",
    t.isLight
      ? "border-[rgba(15,23,42,0.1)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
      : "border-white/10 bg-[rgba(18,18,22,0.96)] shadow-[0_12px_32px_rgba(0,0,0,0.45)]",
  );

  const itemClass = cn(
    "flex cursor-pointer items-center gap-2 rounded-[10px] px-2 py-2 text-[13px] font-medium outline-none",
    t.isLight
      ? "text-[#3F3F46] focus:bg-[rgba(15,23,42,0.04)] data-[highlighted]:bg-[rgba(15,23,42,0.04)]"
      : "text-white/90 focus:bg-white/10 data-[highlighted]:bg-white/10",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={btn} aria-label="Share candidate join link">
          <Share2 className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span className="hidden sm:inline">Share link</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className={menuClass}>
        <div
          className={cn(
            "px-2 py-2 text-[11px] leading-snug",
            t.isLight ? "text-[#71717A]" : "text-white/55",
          )}
        >
          Send this link to <span className="font-semibold text-inherit">{candidateName}</span> so they
          can join as the candidate.
        </div>
        <div
          className={cn(
            "mx-1 mb-1 flex items-center gap-2 rounded-[10px] border px-2.5 py-2",
            t.isLight
              ? "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)]"
              : "border-white/10 bg-white/[0.04]",
          )}
        >
          <Link2
            className={cn("h-3.5 w-3.5 shrink-0", t.isLight ? "text-[#71717A]" : "text-white/50")}
            strokeWidth={1.5}
            aria-hidden
          />
          <span
            className={cn(
              "min-w-0 flex-1 truncate font-mono text-[11px]",
              t.isLight ? "text-[#52525B]" : "text-white/75",
            )}
            title={joinUrl}
          >
            {joinUrl}
          </span>
        </div>
        <DropdownMenuSeparator className={t.isLight ? "bg-[rgba(15,23,42,0.08)]" : "bg-white/10"} />
        <DropdownMenuItem className={itemClass} onSelect={() => void copyLink()}>
          {copied ? (
            <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} aria-hidden />
          ) : (
            <Copy className="h-4 w-4 opacity-70" strokeWidth={1.75} aria-hidden />
          )}
          Copy candidate join link
        </DropdownMenuItem>
        <DropdownMenuItem
          className={itemClass}
          onSelect={() => {
            const subject = encodeURIComponent("Your ZeMeet interview link");
            const body = encodeURIComponent(
              `Hi ${candidateName},\n\nJoin your interview here:\n${joinUrl}\n\nSee you in the session.`,
            );
            window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
            toast.message("Opening email client…");
          }}
        >
          <Mail className="h-4 w-4 opacity-70" strokeWidth={1.75} aria-hidden />
          Send via email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
