"use client";

import { CheckCircle2, Clock, Headphones, Monitor, Wifi } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

const PREP_STEPS = [
  {
    icon: Wifi,
    title: "Stable connection",
    detail: "Use wired internet or strong Wi‑Fi. Close heavy downloads and streaming tabs.",
  },
  {
    icon: Headphones,
    title: "Audio setup",
    detail: "Test your microphone in the preview. Use headphones to reduce echo for panel members.",
  },
  {
    icon: Monitor,
    title: "Screen & camera",
    detail: "Position your camera at eye level. Keep your face well lit and minimize background clutter.",
  },
  {
    icon: Clock,
    title: "Be ready early",
    detail: "Join a few minutes before the scheduled time so you can resolve device issues calmly.",
  },
] as const;

export function ZeMeetCandidateInstructions({ className }: { className?: string }) {
  const { session } = useZeMeet();
  const { context } = session;
  const t = useZeMeetTokens();
  const hasCodeChallenge = session.codeChallengeEnabled;

  return (
    <div className={cn("flex flex-col", className)}>
      <p className={t.label}>Your interview</p>
      <h2 className={cn(t.title, "mt-2")}>{context.jobTitle}</h2>
      <p className={cn(t.meta, "mt-1")}>{context.roundTitle}</p>

      <dl className="mt-6 space-y-4">
        <SummaryRow label="When" value={context.scheduledAt} tokens={t} />
        <SummaryRow label="Timezone" value={context.timezone} tokens={t} />
        <SummaryRow label="Type" value={context.interviewType} tokens={t} />
        <SummaryRow label="Duration" value={`${context.durationMinutes} min`} tokens={t} />
      </dl>

      <div className="mt-6">
        <p className={t.label}>Before you join</p>
        <ul className="mt-3 space-y-3">
          {PREP_STEPS.map(({ icon: Icon, title, detail }) => (
            <li key={title} className={cn(t.subtlePanel, "flex gap-3")}>
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  t.isLight ? "bg-[rgba(15,23,42,0.06)] text-[#52525B]" : "bg-white/10 text-white/70",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className={cn("text-[13px] font-semibold", t.isLight ? "text-[#18181B]" : "text-white/90")}>
                  {title}
                </p>
                <p className={cn(t.subtleText, "mt-0.5")}>{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {hasCodeChallenge ? (
        <div className={cn(t.subtlePanel, "mt-5")}>
          <p className={cn("text-[13px] font-semibold", t.isLight ? "text-[#18181B]" : "text-white/90")}>
            Live coding
          </p>
          <p className={cn(t.subtleText, "mt-1")}>
            Your interviewer may invite you to a shared code challenge during the session. You can accept
            or decline from your view — your editor is visible to the panel while active.
          </p>
        </div>
      ) : null}

      <div className={cn(t.subtlePanel, "mt-5 flex gap-2")}>
        <CheckCircle2
          className={cn("h-4 w-4 shrink-0", t.isLight ? "text-emerald-600" : "text-emerald-400")}
          strokeWidth={1.5}
          aria-hidden
        />
        <p className={t.subtleText}>
          This session may be recorded and synced to your candidate profile. Interviewer evaluation
          notes are private and never shown to you.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  tokens: t,
}: {
  label: string;
  value: string;
  tokens: ReturnType<typeof useZeMeetTokens>;
}) {
  return (
    <div>
      <dt className={t.label}>{label}</dt>
      <dd className={cn(t.bodyStrong, "mt-1")}>{value}</dd>
    </div>
  );
}
