"use client";

import {
  Check,
  Clock,
  Hash,
  Headphones,
  Mic,
  MicOff,
  Settings,
  Shield,
  Users,
  Video,
  VideoOff,
  Wifi,
} from "lucide-react";
import { type ElementType } from "react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { cn } from "@/lib/utils";

const DEVICE_OPTIONS = {
  cameras: ["FaceTime HD Camera", "External Webcam"],
  mics: ["MacBook Pro Microphone", "USB Condenser Mic"],
  speakers: ["MacBook Pro Speakers", "AirPods Pro"],
};

export function ZeMeetLobby() {
  const { session, devices, setDevices, permissions, setPermissions, startSession, theme } = useZeMeet();
  const { context } = session;
  const viewer = session.participants.find((p) => p.id === session.viewerId);
  const others = session.participants.filter((p) => p.id !== session.viewerId && !p.isObserver);
  const isLight = theme === "light";

  return (
    <div className={cn(
      "flex h-dvh flex-col overflow-hidden",
      isLight ? "bg-[#F8F9FB] text-[#18181B]" : "bg-[#202124] text-[#e8eaed]",
    )}>
      {/* Header */}
      <header className={cn(
        "flex h-14 shrink-0 items-center justify-between border-b px-6",
        isLight ? "border-[rgba(15,23,42,0.06)] bg-white" : "border-white/[0.05] bg-[#1a1a1c]",
      )}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a73e8]/10">
            <Video className="h-3.5 w-3.5 text-[#1a73e8]" strokeWidth={2} />
          </div>
          <p className={cn("text-[13px] font-semibold", isLight ? "text-[#18181B]" : "text-[#e8eaed]")}>Google Meet</p>
        </div>
        <div className={cn("text-[12px]", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")}>
          {context.roomId.slice(0, 16)}
        </div>
      </header>

      {/* Main three-column grid */}
      <div className="mx-auto flex min-h-0 w-[min(1280px,calc(100vw-64px))] flex-1 items-center justify-center gap-5 py-6">

        {/* LEFT — Camera Preview */}
        <div className="flex w-[48%] shrink-0 flex-col gap-3">
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ aspectRatio: "16/9" }}
          >
            {devices.videoEnabled ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2d1b5e] via-[#1a1040] to-[#0d0820]">
                <span className="select-none text-[4.5rem] font-bold text-white/15">
                  {viewer?.initials ?? "You"}
                </span>
              </div>
            ) : (
              <div className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-3",
                isLight ? "bg-[#E8EDF4]" : "bg-[#1a1a1a]",
              )}>
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full",
                  isLight ? "bg-[#D1D5DB]" : "bg-[#3c4043]",
                )}>
                  <VideoOff className={cn("h-6 w-6", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")} strokeWidth={1.5} />
                </div>
                <p className={cn("text-[14px]", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")}>Camera is off</p>
              </div>
            )}

            {/* Controls overlay */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <button
                type="button"
                onClick={() => setDevices((d) => ({ ...d, audioEnabled: !d.audioEnabled }))}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full text-white transition-all",
                  devices.audioEnabled
                    ? "bg-[#3c4043] hover:bg-[#4a4f52]"
                    : "bg-red-600/90 hover:bg-red-600",
                )}
              >
                {devices.audioEnabled ? <Mic className="h-5 w-5" strokeWidth={1.75} /> : <MicOff className="h-5 w-5" strokeWidth={1.75} />}
              </button>
              <button
                type="button"
                onClick={() => setDevices((d) => ({ ...d, videoEnabled: !d.videoEnabled }))}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full text-white transition-all",
                  devices.videoEnabled
                    ? "bg-[#3c4043] hover:bg-[#4a4f52]"
                    : "bg-red-600/90 hover:bg-red-600",
                )}
              >
                {devices.videoEnabled ? <Video className="h-5 w-5" strokeWidth={1.75} /> : <VideoOff className="h-5 w-5" strokeWidth={1.75} />}
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3c4043] text-white transition-colors hover:bg-[#4a4f52]"
              >
                <Settings className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Name label */}
            <div className="absolute bottom-16 left-3">
              <span className="rounded-md bg-black/55 px-2 py-0.5 text-[12px] font-medium text-white backdrop-blur-sm">
                {viewer?.name ?? "You"}
              </span>
            </div>
          </div>

          <p className={cn("text-center text-[12px]", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")}>
            {devices.audioEnabled && devices.videoEnabled
              ? "Camera and microphone are on"
              : devices.audioEnabled
                ? "Camera is off · Microphone is on"
                : devices.videoEnabled
                  ? "Camera is on · Microphone is off"
                  : "Camera and microphone are off"}
          </p>
        </div>

        {/* MIDDLE — Device Setup + Participants */}
        <div className="flex w-[24%] shrink-0 flex-col gap-3">
          {/* Device Setup Card */}
          <div className={cn(
            "rounded-xl border p-4",
            isLight ? "border-[rgba(15,23,42,0.08)] bg-white" : "border-white/[0.07] bg-white/[0.03]",
          )}>
            <p className={cn(
              "mb-3 text-[10px] font-semibold uppercase tracking-widest",
              isLight ? "text-[#71717A]" : "text-[#5f6368]",
            )}>Device setup</p>
            <div className="space-y-2.5">
              <CompactSelect label="Camera" value={devices.cameraId} options={DEVICE_OPTIONS.cameras} onChange={(v) => setDevices((d) => ({ ...d, cameraId: v }))} isLight={isLight} />
              <CompactSelect label="Microphone" value={devices.microphoneId} options={DEVICE_OPTIONS.mics} onChange={(v) => setDevices((d) => ({ ...d, microphoneId: v }))} isLight={isLight} />
              <CompactSelect label="Speaker" value={devices.speakerId} options={DEVICE_OPTIONS.speakers} onChange={(v) => setDevices((d) => ({ ...d, speakerId: v }))} isLight={isLight} />
            </div>
          </div>

          {/* Permissions Card */}
          <div className={cn(
            "rounded-xl border p-4",
            isLight ? "border-[rgba(15,23,42,0.08)] bg-white" : "border-white/[0.07] bg-white/[0.03]",
          )}>
            <p className={cn(
              "mb-2.5 text-[10px] font-semibold uppercase tracking-widest",
              isLight ? "text-[#71717A]" : "text-[#5f6368]",
            )}>Permissions</p>
            <ul className="space-y-1.5">
              {([
                { key: "camera" as const, label: "Camera access", ok: permissions.camera },
                { key: "microphone" as const, label: "Microphone access", ok: permissions.microphone },
                { key: "notifications" as const, label: "Session notifications", ok: permissions.notifications },
              ]).map((item) => (
                <li key={item.key} className="flex items-center justify-between gap-3">
                  <span className={cn("text-[12px]", isLight ? "text-[#52525B]" : "text-[#9aa0a6]")}>{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setPermissions((p) => ({ ...p, [item.key]: !p[item.key] }))}
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border",
                      item.ok
                        ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                        : isLight
                          ? "border-[rgba(15,23,42,0.15)] bg-[rgba(15,23,42,0.04)] text-[#A1A1AA]"
                          : "border-white/15 bg-white/5 text-white/40",
                    )}
                  >
                    {item.ok ? <Check className="h-3 w-3" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Participants Card */}
          <div className={cn(
            "rounded-xl border p-4",
            isLight ? "border-[rgba(15,23,42,0.08)] bg-white" : "border-white/[0.07] bg-white/[0.03]",
          )}>
            <p className={cn(
              "mb-2.5 text-[10px] font-semibold uppercase tracking-widest",
              isLight ? "text-[#71717A]" : "text-[#5f6368]",
            )}>
              Participants · {session.participants.filter((p) => !p.isObserver).length}
            </p>
            <div className="space-y-1.5">
              {/* Current user */}
              <ParticipantRow
                initials={viewer?.initials ?? "?"}
                name={viewer?.name ?? "You"}
                status="You"
                isLight={isLight}
              />
              {/* Others */}
              {others.slice(0, 3).map((p) => (
                <ParticipantRow
                  key={p.id}
                  initials={p.initials}
                  name={p.name}
                  status="Waiting in call"
                  isLight={isLight}
                  showOnline
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Interview Details + Join */}
        <div className="flex w-[28%] shrink-0 flex-col gap-3">
          {/* Interview Details Card */}
          <div className={cn(
            "rounded-xl border p-4",
            isLight ? "border-[rgba(15,23,42,0.08)] bg-white" : "border-white/[0.07] bg-white/[0.03]",
          )}>
            <h2 className={cn("text-[18px] font-semibold", isLight ? "text-[#18181B]" : "text-[#e8eaed]")}>
              Ready to join?
            </h2>
            <p className={cn("mt-1 text-[13px]", isLight ? "text-[#52525B]" : "text-[#9aa0a6]")}>
              {context.jobTitle}
            </p>
            <p className={cn("text-[12px]", isLight ? "text-[#71717A]" : "text-[#6b7280]")}>
              {context.roundTitle}
            </p>

            <div className={cn(
              "mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-lg border p-3",
              isLight ? "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.015)]" : "border-white/[0.05] bg-white/[0.02]",
            )}>
              <DetailCell icon={Hash} label="Meeting ID" value={context.roomId.slice(0, 16)} isLight={isLight} />
              <DetailCell icon={Users} label="Participants" value={`${session.participants.filter((p) => !p.isObserver).length}`} isLight={isLight} />
              <DetailCell icon={Clock} label="Duration" value={`${context.durationMinutes} min`} isLight={isLight} />
              <DetailCell icon={Shield} label="Type" value={context.interviewType} isLight={isLight} />
            </div>
          </div>

          {/* Readiness Tips */}
          <div className={cn(
            "rounded-xl border p-4",
            isLight ? "border-[rgba(15,23,42,0.08)] bg-white" : "border-white/[0.07] bg-white/[0.03]",
          )}>
            <p className={cn(
              "mb-2.5 text-[10px] font-semibold uppercase tracking-widest",
              isLight ? "text-[#71717A]" : "text-[#5f6368]",
            )}>Readiness tips</p>
            <div className="space-y-2.5">
              <TipRow icon={Wifi} title="Stable connection" desc="Use wired internet or strong Wi-Fi." isLight={isLight} />
              <TipRow icon={Headphones} title="Audio setup" desc="Use headphones in the preview." isLight={isLight} />
            </div>
          </div>

          {/* Join Action */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={startSession}
              className="h-12 w-full rounded-full bg-[#1a73e8] text-[15px] font-semibold text-white shadow-lg shadow-[#1a73e8]/20 transition-all hover:bg-[#1557b0] active:scale-[0.98]"
            >
              Join Interview
            </button>
            <p className={cn("text-center text-[10px]", isLight ? "text-[#A1A1AA]" : "text-[#5f6368]")}>
              By joining you agree to recording &amp; data sync.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactSelect({
  label,
  value,
  options,
  onChange,
  isLight,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  isLight: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cn("w-20 shrink-0 text-[11px] font-medium", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "min-w-0 flex-1 rounded-lg border px-2.5 py-1.5 text-[12px] outline-none",
          isLight
            ? "border-[rgba(15,23,42,0.1)] bg-[#F8F9FB] text-[#18181B] focus:border-[rgba(15,23,42,0.2)]"
            : "border-white/[0.08] bg-white/[0.04] text-[#e8eaed] focus:border-white/20",
        )}
      >
        {options.map((o) => (
          <option key={o} value={o} className={isLight ? "bg-white" : "bg-[#202124]"}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ParticipantRow({
  initials,
  name,
  status,
  isLight,
  showOnline,
}: {
  initials: string;
  name: string;
  status: string;
  isLight: boolean;
  showOnline?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
        isLight ? "bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] text-[#4338CA]" : "bg-gradient-to-br from-[#1a3048] to-[#070f1a] text-white/70",
      )}>
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-[12px] font-medium leading-tight", isLight ? "text-[#18181B]" : "text-[#e8eaed]")}>{name}</p>
        <p className={cn("text-[10px] leading-tight", isLight ? "text-[#6B7280]" : "text-[#9aa0a6]")}>{status}</p>
      </div>
      {showOnline && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
      )}
    </div>
  );
}

function DetailCell({
  icon: Icon,
  label,
  value,
  isLight,
}: {
  icon: ElementType;
  label: string;
  value: string;
  isLight: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3 w-3", isLight ? "text-[#9CA3AF]" : "text-[#5f6368]")} strokeWidth={1.5} />
        <span className={cn("text-[10px]", isLight ? "text-[#9CA3AF]" : "text-[#5f6368]")}>{label}</span>
      </div>
      <p className={cn("mt-0.5 truncate text-[12px] font-medium", isLight ? "text-[#374151]" : "text-[#c5c6c7]")}>{value}</p>
    </div>
  );
}

function TipRow({
  icon: Icon,
  title,
  desc,
  isLight,
}: {
  icon: ElementType;
  title: string;
  desc: string;
  isLight: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", isLight ? "text-[#71717A]" : "text-[#5f6368]")} strokeWidth={1.5} />
      <div>
        <p className={cn("text-[12px] font-medium leading-tight", isLight ? "text-[#374151]" : "text-[#c5c6c7]")}>{title}</p>
        <p className={cn("text-[11px] leading-tight", isLight ? "text-[#9CA3AF]" : "text-[#6b7280]")}>{desc}</p>
      </div>
    </div>
  );
}
