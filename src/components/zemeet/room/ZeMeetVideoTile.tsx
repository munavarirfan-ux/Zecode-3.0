"use client";

import { MicOff } from "lucide-react";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

export type VideoTileParticipant = {
  name: string;
  initials: string;
  title?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isSpeaking?: boolean;
  isObserver?: boolean;
  avatarSrc?: string;
};

export function ZeMeetVideoTile({
  participant,
  large,
  compact,
  speaking,
}: {
  participant: VideoTileParticipant;
  large?: boolean;
  compact?: boolean;
  speaking?: boolean;
}) {
  const t = useZeMeetTokens();

  return (
    <div
      className={cn(
        t.videoTile,
        large && "min-h-[220px] lg:min-h-0 lg:h-full",
        compact && "min-h-0 h-[88px]",
        !large && !compact && "min-h-[120px]",
        speaking && "ring-2 ring-[rgb(var(--accent-rgb)/0.45)]",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          t.isLight ? "from-[#D8DEE8] to-[#ECEFF3]" : "from-[#1e2636] to-[#12171f]",
        )}
      />
      {participant.isVideoOn ? (
        participant.avatarSrc ? (
          <img
            src={participant.avatarSrc}
            alt={participant.name}
            className="absolute inset-0 h-full w-full object-cover object-top"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "font-semibold",
                t.isLight ? "text-[#18181B]/20" : "text-white/25",
                large && "text-[5rem]",
                compact && "text-[1.75rem]",
                !large && !compact && "text-[2.5rem]",
              )}
            >
              {participant.initials}
            </span>
          </div>
        )
      ) : (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            t.isLight ? "bg-[#E4E9F0]" : "bg-[#0d1118]",
          )}
        >
          <span
            className={cn(
              compact ? "text-[10px]" : "text-[13px]",
              t.isLight ? "text-[#71717A]" : "text-white/40",
            )}
          >
            Camera off
          </span>
        </div>
      )}
      <div
        className={cn(
          "absolute flex items-end justify-between gap-2",
          compact ? "bottom-1.5 left-1.5 right-1.5" : "bottom-3 left-3 right-3",
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-semibold",
              t.isLight ? "text-[#18181B]" : "text-white",
              compact ? "text-[10px]" : "text-[13px]",
            )}
          >
            {participant.name}
          </p>
          {!compact && participant.title ? (
            <p className={cn("text-[11px]", t.isLight ? "text-[#71717A]" : "text-white/50")}>
              {participant.title}
            </p>
          ) : null}
        </div>
        {participant.isMuted ? (
          <span
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full bg-black/50 text-white/80",
              compact ? "h-5 w-5" : "h-7 w-7",
            )}
          >
            <MicOff className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} strokeWidth={1.5} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
