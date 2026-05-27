"use client";

import { MicOff } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { cn } from "@/lib/utils";

/**
 * Compact horizontal video strip — shown at the top of the code challenge layout.
 * Google Meet continues running; participants remain visible above the editor.
 */
export function ZeMeetVideoStrip() {
  const { session } = useZeMeet();

  const visible = session.participants.filter(
    (p) => !p.isObserver || session.viewerRole === "observer",
  );

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-[#2d2d30] bg-[#141414] px-3 py-2">
      {visible.map((p) => (
        <div
          key={p.id}
          className="relative h-[88px] w-[140px] shrink-0 overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#1a1f28]"
        >
          {p.isVideoOn && p.avatarSrc ? (
            <img
              src={p.avatarSrc}
              alt={p.name}
              className="h-full w-full object-cover object-top"
              draggable={false}
            />
          ) : p.isVideoOn ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1e2636] to-[#12171f]">
              <span className="text-[1.5rem] font-semibold text-white/20">{p.initials}</span>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0d1118]">
              <span className="text-[11px] text-white/30">Camera off</span>
            </div>
          )}

          {/* Name + mute chip overlay */}
          <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-end justify-between">
            <span className="rounded-[5px] bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
              {p.name.split(" ")[0]}
              {p.role === "candidate" ? " (Candidate)" : ""}
            </span>
            {p.isMuted ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm">
                <MicOff className="h-2.5 w-2.5 text-white/70" strokeWidth={1.5} />
              </span>
            ) : null}
          </div>

          {/* Speaking ring */}
          {p.role === "candidate" ? (
            <div className="pointer-events-none absolute inset-0 rounded-[10px] ring-2 ring-emerald-400/40" />
          ) : null}
        </div>
      ))}

      {/* Call continues badge */}
      <div className="ml-auto flex items-center gap-1.5 rounded-[8px] border border-[#2d2d30] bg-[#1e1e1e] px-2.5 py-1.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[11px] font-medium text-[#858585]">Call in progress</span>
      </div>
    </div>
  );
}
