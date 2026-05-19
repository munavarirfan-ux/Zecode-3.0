"use client";

import {
  Check,
  Mic,
  MicOff,
  Shield,
  Video,
  VideoOff,
} from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { ZeMeetThemeToggle } from "@/components/zemeet/ZeMeetThemeToggle";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
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
  const t = useZeMeetTokens();
  const isCandidate = session.viewerRole === "candidate";

  const checklist = [
    { key: "camera" as const, label: "Camera access", ok: permissions.camera },
    { key: "microphone" as const, label: "Microphone access", ok: permissions.microphone },
    { key: "notifications" as const, label: "Session notifications", ok: permissions.notifications },
  ];

  return (
    <div className="mx-auto grid w-full max-w-[1120px] gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className={t.label}>ZeMeet · Pre-join</p>
            <h1 className={cn(t.heading, "mt-2")}>Ready to join?</h1>
            <p className={cn(t.meta, "mt-2 max-w-md")}>
              Check your devices before entering the collaborative interview room.
            </p>
          </div>
          <ZeMeetThemeToggle />
        </div>

        <div className={cn(t.videoTile, "aspect-video max-h-[340px]")}>
          <div className={cn("absolute inset-0", t.previewGradient)} />
          {devices.blurBackground ? (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" aria-hidden />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center">
            {devices.videoEnabled ? (
              <div
                className={cn(
                  "flex h-24 w-24 items-center justify-center rounded-full text-[2rem] font-semibold",
                  t.isLight ? "bg-[rgba(15,23,42,0.08)] text-[#52525B]" : "bg-white/10 text-white/90",
                )}
              >
                {session.participants.find((p) => p.id === session.viewerId)?.initials ?? "You"}
              </div>
            ) : (
              <VideoOff
                className={cn("h-10 w-10", t.isLight ? "text-[#A1A1AA]" : "text-white/40")}
                strokeWidth={1.5}
              />
            )}
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={t.mutedBadge}>Preview</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <DeviceSelect
            label="Camera"
            value={devices.cameraId}
            options={DEVICE_OPTIONS.cameras}
            onChange={(v) => setDevices((d) => ({ ...d, cameraId: v }))}
            selectClass={t.select}
            labelClass={t.label}
          />
          <DeviceSelect
            label="Microphone"
            value={devices.microphoneId}
            options={DEVICE_OPTIONS.mics}
            onChange={(v) => setDevices((d) => ({ ...d, microphoneId: v }))}
            selectClass={t.select}
            labelClass={t.label}
          />
          <DeviceSelect
            label="Speaker"
            value={devices.speakerId}
            options={DEVICE_OPTIONS.speakers}
            onChange={(v) => setDevices((d) => ({ ...d, speakerId: v }))}
            selectClass={t.select}
            labelClass={t.label}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <ToggleChip
            active={devices.blurBackground}
            onClick={() => setDevices((d) => ({ ...d, blurBackground: !d.blurBackground }))}
            tokens={t}
          >
            Blur background
          </ToggleChip>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-[13px] font-medium",
              devices.videoEnabled
                ? t.isLight
                  ? "bg-[rgba(15,23,42,0.06)] text-[#18181B]"
                  : "bg-white/10 text-white"
                : "bg-red-500/20 text-red-600 dark:text-red-300",
            )}
            onClick={() => setDevices((d) => ({ ...d, videoEnabled: !d.videoEnabled }))}
          >
            {devices.videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            Camera
          </button>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] text-[13px] font-medium",
              devices.audioEnabled
                ? t.isLight
                  ? "bg-[rgba(15,23,42,0.06)] text-[#18181B]"
                  : "bg-white/10 text-white"
                : "bg-red-500/20 text-red-600 dark:text-red-300",
            )}
            onClick={() => setDevices((d) => ({ ...d, audioEnabled: !d.audioEnabled }))}
          >
            {devices.audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            Mic
          </button>
        </div>

        <div className={cn(t.glass, "p-4")}>
          <p className={t.label}>Permissions</p>
          <ul className="mt-3 space-y-2">
            {checklist.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-3">
                <span className={t.meta}>{item.label}</span>
                <button
                  type="button"
                  onClick={() => setPermissions((p) => ({ ...p, [item.key]: !p[item.key] }))}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border",
                    item.ok
                      ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
                      : t.isLight
                        ? "border-[rgba(15,23,42,0.12)] bg-[rgba(15,23,42,0.04)] text-[#A1A1AA]"
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

      <aside className={cn(t.glassElevated, "flex flex-col p-6")}>
        {isCandidate ? (
          <ZeMeetCandidateInstructions />
        ) : (
          <InterviewerLobbySummary />
        )}

        <div className="mt-auto space-y-3 pt-8">
          {!isCandidate ? (
            <div className={cn(t.subtlePanel, "flex items-start gap-2")}>
              <Shield
                className={cn("h-4 w-4 shrink-0", t.isLight ? "text-[#71717A]" : "text-white/50")}
                strokeWidth={1.5}
              />
              <p className={t.subtleText}>
                Interviewer notes are private. Candidates never see evaluation notes or live code
                annotations.
              </p>
            </div>
          ) : null}
          <button type="button" className={cn(t.primaryBtn, "w-full")} onClick={startSession}>
            Join Interview
          </button>
          <p className={cn("text-center text-[10px]", t.isLight ? "text-[#A1A1AA]" : "text-white/40")}>
            By joining you agree to recording & data sync to the candidate report.
          </p>
        </div>
      </aside>
    </div>
  );
}

function InterviewerLobbySummary() {
  const { session } = useZeMeet();
  const { context } = session;
  const t = useZeMeetTokens();

  return (
    <>
      <p className={t.label}>Interview</p>
      <h2 className={cn(t.title, "mt-2")}>{context.jobTitle}</h2>
      <p className={cn(t.meta, "mt-1")}>{context.roundTitle}</p>

      <dl className="mt-6 space-y-4">
        <SummaryRow label="Candidate" value={context.candidateName} />
        <SummaryRow
          label="Interviewers"
          value={session.participants.filter((p) => p.role === "interviewer").map((p) => p.name).join(", ")}
        />
        <SummaryRow label="When" value={context.scheduledAt} />
        <SummaryRow label="Timezone" value={context.timezone} />
        <SummaryRow label="Type" value={context.interviewType} />
        <SummaryRow label="Duration" value={`${context.durationMinutes} min`} />
      </dl>
    </>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  const t = useZeMeetTokens();
  return (
    <div>
      <dt className={t.label}>{label}</dt>
      <dd className={cn(t.bodyStrong, "mt-1")}>{value}</dd>
    </div>
  );
}

function DeviceSelect({
  label,
  value,
  options,
  onChange,
  selectClass,
  labelClass,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  selectClass: string;
  labelClass: string;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
  tokens: t,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tokens: ReturnType<typeof useZeMeetTokens>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors",
        active
          ? "border-[rgb(var(--accent-rgb)/0.5)] bg-[rgb(var(--accent-rgb)/0.15)] text-[rgb(var(--accent-rgb))]"
          : t.isLight
            ? "border-[rgba(15,23,42,0.1)] bg-white text-[#71717A] hover:bg-[rgba(15,23,42,0.04)]"
            : "border-white/10 bg-white/[0.04] text-white/55 hover:bg-white/[0.08]",
      )}
    >
      {children}
    </button>
  );
}
