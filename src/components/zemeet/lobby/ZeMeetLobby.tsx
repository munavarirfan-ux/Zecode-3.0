"use client";

import {
  Check,
  Clock,
  Hash,
  Mic,
  MicOff,
  Settings,
  Shield,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { type ElementType } from "react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { ZeMeetCandidateInstructions } from "./ZeMeetCandidateInstructions";
import { cn } from "@/lib/utils";

const DEVICE_OPTIONS = {
  cameras: ["FaceTime HD Camera", "External Webcam"],
  mics: ["MacBook Pro Microphone", "USB Condenser Mic"],
  speakers: ["MacBook Pro Speakers", "AirPods Pro"],
};

export function ZeMeetLobby() {
  const { session, devices, setDevices, permissions, setPermissions, startSession } = useZeMeet();
  const { context } = session;
  const isCandidate = session.viewerRole === "candidate";
  const viewer = session.participants.find((p) => p.id === session.viewerId);
  const others = session.participants.filter((p) => p.id !== session.viewerId && !p.isObserver);

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-[#202124] px-4 py-10 text-[#e8eaed]">
      <div className="flex w-full max-w-[900px] items-start gap-10">

        {/* Left: camera preview + device controls */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Camera preview */}
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
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#1a1a1a]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3c4043]">
                  <VideoOff className="h-6 w-6 text-[#9aa0a6]" strokeWidth={1.5} />
                </div>
                <p className="text-[14px] text-[#9aa0a6]">Camera is off</p>
              </div>
            )}

            {/* Mic / cam / settings overlay */}
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
                {devices.audioEnabled ? (
                  <Mic className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <MicOff className="h-5 w-5" strokeWidth={1.75} />
                )}
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
                {devices.videoEnabled ? (
                  <Video className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <VideoOff className="h-5 w-5" strokeWidth={1.75} />
                )}
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

          <p className="text-center text-[13px] text-[#9aa0a6]">
            {devices.audioEnabled && devices.videoEnabled
              ? "Mic and camera are on"
              : "Check your devices above"}
          </p>

          {/* Device dropdowns */}
          <div className="grid gap-3 sm:grid-cols-3">
            <DeviceSelect
              label="Camera"
              value={devices.cameraId}
              options={DEVICE_OPTIONS.cameras}
              onChange={(v) => setDevices((d) => ({ ...d, cameraId: v }))}
            />
            <DeviceSelect
              label="Microphone"
              value={devices.microphoneId}
              options={DEVICE_OPTIONS.mics}
              onChange={(v) => setDevices((d) => ({ ...d, microphoneId: v }))}
            />
            <DeviceSelect
              label="Speaker"
              value={devices.speakerId}
              options={DEVICE_OPTIONS.speakers}
              onChange={(v) => setDevices((d) => ({ ...d, speakerId: v }))}
            />
          </div>

          {/* Permissions */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">
              Permissions
            </p>
            <ul className="space-y-2">
              {(
                [
                  { key: "camera" as const, label: "Camera access", ok: permissions.camera },
                  { key: "microphone" as const, label: "Microphone access", ok: permissions.microphone },
                  { key: "notifications" as const, label: "Session notifications", ok: permissions.notifications },
                ] as const
              ).map((item) => (
                <li key={item.key} className="flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[#9aa0a6]">{item.label}</span>
                  <button
                    type="button"
                    onClick={() => setPermissions((p) => ({ ...p, [item.key]: !p[item.key] }))}
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border",
                      item.ok
                        ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                        : "border-white/15 bg-white/5 text-white/40",
                    )}
                  >
                    {item.ok ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: join card */}
        <div className="flex w-[300px] shrink-0 flex-col gap-5">
          {/* Google Meet brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1a73e8]/10">
              <Video className="h-4 w-4 text-[#1a73e8]" strokeWidth={2} />
            </div>
            <p className="text-[13px] font-semibold text-[#9aa0a6]">Google Meet</p>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-[22px] font-semibold text-[#e8eaed]">Ready to join?</h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#9aa0a6]">
              {context.jobTitle}
              <br />
              {context.roundTitle}
            </p>
          </div>

          {/* Meeting info */}
          <div className="space-y-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
            <LobbyRow icon={Hash} text={context.roomId.slice(0, 16)} />
            <LobbyRow
              icon={Users}
              text={`${session.participants.filter((p) => !p.isObserver).length} participants`}
            />
            <LobbyRow
              icon={Clock}
              text={`${context.durationMinutes} min · ${context.interviewType}`}
            />
          </div>

          {/* Waiting participants */}
          {others.slice(0, 2).map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a3048] to-[#070f1a] text-[12px] font-bold text-white/70">
                {p.initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#e8eaed]">{p.name}</p>
                <p className="text-[11px] text-[#9aa0a6]">Waiting in call</p>
              </div>
              <span className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
            </div>
          ))}

          {/* Candidate instructions or interviewer note */}
          {isCandidate ? (
            <ZeMeetCandidateInstructions />
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
              <Shield
                className="mt-0.5 h-4 w-4 shrink-0 text-[#5f6368]"
                strokeWidth={1.5}
              />
              <p className="text-[12px] text-[#5f6368]">
                Interviewer notes are private — candidates never see evaluation data.
              </p>
            </div>
          )}

          {/* Join button */}
          <button
            type="button"
            onClick={startSession}
            className="h-12 w-full rounded-full bg-[#1a73e8] text-[15px] font-semibold text-white shadow-lg shadow-[#1a73e8]/20 transition-all hover:bg-[#1557b0] active:scale-[0.98]"
          >
            Join Interview
          </button>

          <p className="text-center text-[11px] text-[#5f6368]">
            By joining you agree to recording &amp; data sync to the candidate report.
          </p>
        </div>
      </div>
    </div>
  );
}

function LobbyRow({ icon: Icon, text }: { icon: ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <Icon className="h-4 w-4 shrink-0 text-[#5f6368]" strokeWidth={1.5} />
      <span className="text-[#c5c6c7]">{text}</span>
    </div>
  );
}

function DeviceSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-[#9aa0a6]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-[12px] text-[#e8eaed] outline-none focus:border-white/20"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#202124]">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
