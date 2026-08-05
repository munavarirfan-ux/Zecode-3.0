"use client";

import { useRef, useState } from "react";
import { Camera, Maximize2, MicOff, Minus, Move } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  dialogCloseButtonSm,
  DialogDescription,
  DialogOverlay,
  DialogPanel,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";

interface CameraPreviewProps {
  candidateName: string;
  /** "docked" renders a static tile (e.g. inside the sidebar); default floats. */
  docked?: boolean;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Dummy camera "feed" — a soft gradient with the candidate's avatar. */
function DummyFeed({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#243244] via-[#1a2233] to-[#0E0E11]">
      <div className="pointer-events-none absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/[0.06] blur-2xl" />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[16px] font-semibold text-white/90 ring-1 ring-white/15">
        {initials(name)}
      </div>
    </div>
  );
}

export function CameraPreview({ candidateName, docked = false }: CameraPreviewProps) {
  const [minimized, setMinimized] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  /* ── Drag to reposition (floating only) ── */
  function startDrag(e: React.PointerEvent) {
    e.preventDefault();
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;
    const onMove = (ev: PointerEvent) => {
      const left = Math.max(8, Math.min(window.innerWidth - rect.width - 8, ev.clientX - offX));
      const top = Math.max(8, Math.min(window.innerHeight - rect.height - 8, ev.clientY - offY));
      setPos({ left, top });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const positionStyle = pos
    ? { left: pos.left, top: pos.top, right: "auto", bottom: "auto" }
    : undefined;

  /* ── Minimized pill (floating only) ── */
  if (minimized && !docked) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        style={positionStyle}
        className={cn(
          "fixed bottom-[80px] right-[22px] z-[120] flex items-center gap-2 rounded-full border border-[rgba(15,23,42,0.08)] bg-white/90 px-3 py-1.5 text-[11px] font-medium text-text shadow-[0_8px_22px_-12px_rgba(15,23,42,0.3)] backdrop-blur-md transition-colors hover:bg-white dark:border-white/[0.08] dark:bg-[#16161a]/90",
        )}
        aria-label="Restore camera preview"
        title="Restore camera preview"
      >
        <Camera className="h-3.5 w-3.5 text-text-secondary" />
        <span>Camera active</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </button>
    );
  }

  return (
    <>
      <div
        ref={rootRef}
        style={docked ? undefined : positionStyle}
        className={cn(
          "group overflow-hidden border border-[rgba(15,23,42,0.1)] bg-[#0E0E11] dark:border-white/[0.1]",
          docked
            ? "relative w-full rounded-[12px] shadow-sm"
            : "fixed bottom-[80px] right-[22px] z-[120] w-[150px] rounded-[15px] shadow-[0_12px_30px_-12px_rgba(15,23,42,0.4)] sm:w-[200px] lg:w-[240px]",
        )}
      >
        <div className="relative aspect-video w-full">
          <DummyFeed name={candidateName} />

          {/* Top status row */}
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-2 py-1.5">
            <span className="flex items-center gap-1 rounded-full bg-black/35 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-white/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              Proctoring active
            </span>
          </div>

          {/* Hover controls */}
          <div className="absolute right-1.5 top-6 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {!docked && (
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-black/45 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/65"
                aria-label="Minimize camera"
                title="Minimize"
              >
                <Minus className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="flex h-6 w-6 items-center justify-center rounded-md bg-black/45 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/65"
              aria-label="Expand camera"
              title="Check framing"
            >
              <Maximize2 className="h-3 w-3" />
            </button>
            {!docked && (
              <button
                type="button"
                onPointerDown={startDrag}
                className="flex h-6 w-6 cursor-move items-center justify-center rounded-md bg-black/45 text-white/90 backdrop-blur-sm transition-colors hover:bg-black/65"
                aria-label="Move camera"
                title="Drag to reposition"
              >
                <Move className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Bottom overlay — name + status */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-black/25 to-transparent px-2 pb-1.5 pt-5">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold leading-tight text-white">
                {candidateName}
              </p>
              <p className="flex items-center gap-1 text-[8px] font-medium uppercase tracking-wide text-white/75">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Camera on
              </p>
            </div>
            <MicOff className="h-3 w-3 shrink-0 text-white/60" />
          </div>
        </div>
      </div>

      {/* Expanded framing check */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogPortal>
          <DialogOverlay className="z-[250] bg-[rgba(15,23,42,0.55)] backdrop-blur-[4px]" />
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <DialogPanel className="relative w-full max-w-lg overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-2xl dark:border-white/[0.08] dark:bg-surface">
              <div className="flex items-center justify-between border-b border-[rgba(15,23,42,0.06)] px-4 py-3 dark:border-white/[0.06]">
                <div>
                  <DialogTitle className="text-[14px] font-semibold text-text">
                    Camera preview
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-muted">
                    Check your framing and lighting.
                  </DialogDescription>
                </div>
                <DialogClose className={dialogCloseButtonSm} aria-label="Close" />
              </div>
              <div className="p-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-[12px] bg-[#0E0E11]">
                  <DummyFeed name={candidateName} />
                  <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-[12px] font-medium text-white">{candidateName}</span>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </DialogPortal>
      </Dialog>
    </>
  );
}
