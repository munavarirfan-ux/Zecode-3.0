"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  FileText,
  GraduationCap,
  Grid3x3,
  Hand,
  Link2,
  Linkedin,
  Lock,
  MessageSquare,
  Mic,
  MicOff,
  MoreHorizontal,
  PhoneOff,
  ScreenShare,
  Send,
  Shield,
  StickyNote,
  Subtitles,
  Users,
  Video,
  VideoOff,
  Wifi,
  X,
} from "lucide-react";
import { type ElementType, useState } from "react";
import { ZeMeetCodeChallengeLayout } from "@/components/zemeet/code/ZeMeetCodeChallengeLayout";
import { ZeMeetCodeChallengeSidePanel } from "@/components/zemeet/code/ZeMeetCodeChallengeSidePanel";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type {
  ZeMeetCandidateIntel,
  ZeMeetNoteEntry,
  ZeMeetParticipant,
  ZeMeetSession,
} from "@/lib/zemeet/types";
import { cn } from "@/lib/utils";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

const NOTE_COLORS = ["bg-amber-50", "bg-yellow-50", "bg-lime-50", "bg-sky-50", "bg-pink-50"];
const NOTE_ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0", "rotate-2"];

type ActiveDrawer = "notes" | "resume" | "linkedin" | null;
type CandidateStatus = "waiting" | "joined" | "disconnected";

// ── Root ──────────────────────────────────────────────────────────────────────

export function ZeMeetRoom({ onLeave }: { onLeave: () => void }) {
  const {
    session,
    devices,
    setDevices,
    elapsedSeconds,
    isRecording,
    codeChallenge,
    openSendCodeChallengeConfirm,
    notes,
    addNote,
  } = useZeMeet();

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";
  const codeActive = codeChallenge.status === "active";

  const [activeDrawer, setActiveDrawer] = useState<ActiveDrawer>(null);
  const [noteText, setNoteText] = useState("");
  const [waitingRoomOpen, setWaitingRoomOpen] = useState(false);

  const callTime = fmt(elapsedSeconds);

  function toggleDrawer(tool: NonNullable<ActiveDrawer>) {
    setActiveDrawer((prev) => (prev === tool ? null : tool));
  }

  function saveNote() {
    if (!noteText.trim()) return;
    addNote(noteText.trim());
    setNoteText("");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <GMeetTopBar
        title={session.context.jobTitle}
        callTime={callTime}
        codeActive={codeActive}
        session={session}
        isRecording={isRecording}
      />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {codeActive ? (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex min-h-0 flex-1 overflow-hidden"
            >
              <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <ZeMeetCodeChallengeLayout />
              </div>
              {isInterviewer && <ZeMeetCodeChallengeSidePanel />}
            </motion.div>
          ) : (
            <motion.div
              key="meeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex min-h-0 flex-1"
            >
              <VideoGrid session={session} viewerAudioEnabled={devices.audioEnabled} />
            </motion.div>
          )}
        </AnimatePresence>

        {isInterviewer && (
          <ZeMeetToolbar
            activeDrawer={activeDrawer}
            codeChallengeStatus={codeChallenge.status}
            onToggleDrawer={toggleDrawer}
            onCodeChallenge={openSendCodeChallengeConfirm}
            candidateName={session.context.candidateName}
            roomId={session.context.roomId}
            onOpenWaitingRoom={() => setWaitingRoomOpen(true)}
          />
        )}
      </div>

      <GMeetBottomControls
        micOn={devices.audioEnabled}
        camOn={devices.videoEnabled}
        setMicOn={(on) => setDevices((d) => ({ ...d, audioEnabled: on }))}
        setCamOn={(on) => setDevices((d) => ({ ...d, videoEnabled: on }))}
        onEndCall={onLeave}
        shortCode={session.context.roomId}
      />

      {/* Drawer overlays */}
      <AnimatePresence>
        {isInterviewer && activeDrawer === "notes" && (
          <StickyNoteDrawer
            key="notes"
            notes={notes}
            noteText={noteText}
            setNoteText={setNoteText}
            onSave={saveNote}
            onClose={() => setActiveDrawer(null)}
          />
        )}
        {isInterviewer && activeDrawer === "resume" && (
          <ResumeDrawer
            key="resume"
            candidateName={session.context.candidateName}
            intel={session.context.candidateIntel}
            onClose={() => setActiveDrawer(null)}
          />
        )}
        {isInterviewer && activeDrawer === "linkedin" && (
          <LinkedInDrawer
            key="linkedin"
            candidateName={session.context.candidateName}
            intel={session.context.candidateIntel}
            onClose={() => setActiveDrawer(null)}
          />
        )}
      </AnimatePresence>

      {/* Candidate waiting room preview modal */}
      <AnimatePresence>
        {waitingRoomOpen && (
          <CandidateWaitingRoomModal
            candidateName={session.context.candidateName}
            jobTitle={session.context.jobTitle}
            roundTitle={session.context.roundTitle}
            onClose={() => setWaitingRoomOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Google Meet Top Bar ───────────────────────────────────────────────────────

function GMeetTopBar({
  title,
  callTime,
  codeActive,
  session,
  isRecording,
}: {
  title: string;
  callTime: string;
  codeActive: boolean;
  session: ZeMeetSession;
  isRecording: boolean;
}) {
  const viewer = session.participants.find((p) => p.id === session.viewerId);

  return (
    <div className="flex h-14 shrink-0 items-center justify-between bg-[#202124] px-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 40 28" className="h-5 w-7" aria-label="Google Meet">
            <path d="M24 14L32 7v14l-8-7z" fill="#00832d" />
            <path d="M0 20.4V25c0 1.1.9 2 2 2h4l1-4-1-4H2c-1.1 0-2 .9-2 2z" fill="#0066da" />
            <path d="M6 27h14l2-6.5L20 14H6v6h8v1H6v6z" fill="#e94235" />
            <path d="M20 7H6v7h14l2-3.5L20 7z" fill="#2684fc" />
            <path d="M6 14v6h14v-6H6z" fill="#00ac47" />
            <path d="M20 7l2 7-2 6h12V7H20z" fill="#ffba00" />
          </svg>
          <span className="text-[14px] font-medium text-[#e8eaed]">Google Meet</span>
        </div>
        <span className="text-[#5f6368]">·</span>
        <span className="max-w-[240px] truncate text-[13px] text-[#9aa0a6]">{title}</span>
        {codeActive && (
          <span className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-violet-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            Code Challenge Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] tabular-nums text-[#9aa0a6]">{callTime}</span>
        {isRecording && (
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
            REC
          </div>
        )}
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/[0.08]"
        >
          <Wifi className="h-4 w-4 text-[#5f6368]" strokeWidth={1.5} />
        </button>
        <button
          type="button"
          className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] text-[#9aa0a6] transition-colors hover:bg-white/[0.08]"
        >
          <Users className="h-4 w-4" strokeWidth={1.5} />
          {session.participants.filter((p) => !p.isObserver).length}
        </button>
        {viewer && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[11px] font-bold text-white/80">
            {viewer.initials}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Video Grid ────────────────────────────────────────────────────────────────

function VideoGrid({
  session,
  viewerAudioEnabled,
}: {
  session: ZeMeetSession;
  viewerAudioEnabled: boolean;
}) {
  const visible = session.participants.filter(
    (p) => !p.isObserver || session.viewerRole === "observer",
  );
  const candidate = visible.find((p) => p.role === "candidate");
  const interviewers = visible.filter((p) => p.role === "interviewer");

  return (
    <div className="flex flex-1 items-center justify-center gap-4 p-6 pb-3">
      {candidate && (
        <GMeetVideoTile
          participant={candidate}
          isMutedOverride={
            candidate.id === session.viewerId ? !viewerAudioEnabled : undefined
          }
          gradient="from-[#2a1a58] via-[#160e38] to-[#0a0618]"
          isSpeaking={candidate.isSpeaking}
          sub="Candidate"
          className="aspect-video flex-[6] max-h-[calc(100vh-230px)]"
        />
      )}
      {interviewers.map((p) => (
        <GMeetVideoTile
          key={p.id}
          participant={p}
          isMutedOverride={p.id === session.viewerId ? !viewerAudioEnabled : undefined}
          gradient="from-[#162840] via-[#0d1a2a] to-[#060e18]"
          isSpeaking={p.isSpeaking}
          sub="Interviewer"
          className="aspect-video flex-[4] max-h-[calc(100vh-230px)]"
        />
      ))}
    </div>
  );
}

// ── Google Meet Video Tile ────────────────────────────────────────────────────

function GMeetVideoTile({
  participant,
  isMutedOverride,
  gradient,
  isSpeaking,
  sub,
  compact,
  className,
}: {
  participant: ZeMeetParticipant;
  isMutedOverride?: boolean;
  gradient: string;
  isSpeaking?: boolean;
  sub?: string;
  compact?: boolean;
  className?: string;
}) {
  const isMuted = isMutedOverride ?? participant.isMuted;

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        compact ? "rounded-xl" : "rounded-2xl",
        isSpeaking && "ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-[#202124]",
        className,
      )}
    >
      {/* Background */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45))]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Avatar / photo */}
      {participant.avatarSrc ? (
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
              "select-none font-bold text-white/20",
              compact ? "text-2xl" : "text-[5rem]",
            )}
          >
            {participant.initials}
          </span>
        </div>
      )}

      {/* ── Compact glass pill footer (Google Meet style) ── */}
      <div
        className={cn(
          "absolute flex items-center gap-1.5",
          compact ? "bottom-1.5 left-1.5" : "bottom-2.5 left-2.5",
        )}
      >
        {/* Speaking pulse */}
        {isSpeaking && !compact && (
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 ring-2 ring-emerald-400/25 shrink-0" />
        )}

        {/* Identity pill */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-black/55 backdrop-blur-[6px]",
            compact ? "px-1.5 py-0.5" : "px-2.5 py-1",
          )}
        >
          <span
            className={cn(
              "font-medium text-white",
              compact ? "text-[10px]" : "text-[12px]",
            )}
          >
            {participant.name}
          </span>
          {!compact && sub && (
            <>
              <span className="text-white/25">·</span>
              <span className="text-[10px] text-white/55">{sub}</span>
            </>
          )}
          {isMuted && (
            <MicOff
              className={cn(
                "shrink-0 text-[#ea4335]",
                compact ? "h-2.5 w-2.5" : "h-3 w-3",
              )}
              strokeWidth={2.5}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Ze[meet] Floating Toolbar ─────────────────────────────────────────────────

function ZeMeetToolbar({
  activeDrawer,
  codeChallengeStatus,
  onToggleDrawer,
  onCodeChallenge,
  candidateName,
  roomId,
  onOpenWaitingRoom,
}: {
  activeDrawer: ActiveDrawer;
  codeChallengeStatus: string;
  onToggleDrawer: (t: NonNullable<ActiveDrawer>) => void;
  onCodeChallenge: () => void;
  candidateName: string;
  roomId: string;
  onOpenWaitingRoom: () => void;
}) {
  const isCodeActive = codeChallengeStatus === "active";
  const isCodePending = codeChallengeStatus === "invite_pending";

  const drawerItems = [
    { id: "resume" as const, icon: FileText, label: "Resume", activeColor: "text-violet-300" },
    { id: "linkedin" as const, icon: Linkedin, label: "LinkedIn", activeColor: "text-sky-300" },
    { id: "notes" as const, icon: StickyNote, label: "Private Notes", activeColor: "text-amber-300" },
  ] as const;

  return (
    <div className="pointer-events-none absolute right-4 top-1/2 z-50 -translate-y-1/2">
      <motion.div
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.15 }}
        className="pointer-events-auto flex flex-col items-center gap-1 rounded-[20px] border border-white/10 bg-black/55 p-2 shadow-2xl backdrop-blur-xl"
        role="toolbar"
        aria-label="ze[meet] interview tools"
      >
        {/* Wordmark */}
        <p
          className="mb-0.5 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400/60"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
          aria-hidden
        >
          ze[meet]
        </p>
        <div className="h-px w-5 bg-white/10" aria-hidden />

        {/* Code Challenge */}
        <ToolbarBtn
          icon={Code2}
          label={
            isCodeActive
              ? "End Challenge"
              : isCodePending
                ? "Request Pending…"
                : "Launch Code Challenge"
          }
          isActive={isCodeActive || isCodePending}
          activeColorClass="text-violet-300"
          onClick={onCodeChallenge}
        />

        {/* Resume · LinkedIn · Notes */}
        {drawerItems.map(({ id, icon, label, activeColor }) => (
          <ToolbarBtn
            key={id}
            icon={icon}
            label={label}
            isActive={activeDrawer === id}
            activeColorClass={activeColor}
            onClick={() => onToggleDrawer(id)}
          />
        ))}

        {/* Divider */}
        <div className="my-0.5 h-px w-5 bg-white/10" aria-hidden />

        {/* Share Link — Radix Popover */}
        <ShareLinkToolbarBtn
          candidateName={candidateName}
          roomId={roomId}
          onOpenWaitingRoom={onOpenWaitingRoom}
        />
      </motion.div>
    </div>
  );
}

// ── Share Link Toolbar Button (Popover) ───────────────────────────────────────

function ShareLinkToolbarBtn({
  candidateName,
  roomId,
  onOpenWaitingRoom,
}: {
  candidateName: string;
  roomId: string;
  onOpenWaitingRoom: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [candidateStatus] = useState<CandidateStatus>("waiting");

  const joinUrl = `https://zemeet.ai/join/${roomId}`;

  function copyLink() {
    navigator.clipboard.writeText(joinUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusConfig = {
    waiting:      { dot: "bg-amber-400",  text: "Waiting",      textColor: "text-amber-400"  },
    joined:       { dot: "bg-emerald-400", text: "Joined",       textColor: "text-emerald-400" },
    disconnected: { dot: "bg-red-400",     text: "Disconnected", textColor: "text-red-400"    },
  } satisfies Record<CandidateStatus, { dot: string; text: string; textColor: string }>;

  const st = statusConfig[candidateStatus];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="group relative">
          <button
            type="button"
            aria-label="Share candidate interview link"
            aria-pressed={open}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
              open ? "bg-white/15 shadow-lg" : "hover:bg-white/10",
            )}
          >
            <Link2
              className={cn(
                "h-5 w-5 transition-colors",
                open ? "text-violet-300" : "text-[#9aa0a6] group-hover:text-[#e8eaed]",
              )}
              strokeWidth={1.75}
            />
            {open && (
              <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-black/40" />
            )}
          </button>
          <span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#3c4043] px-2.5 py-1.5 text-[11px] font-medium text-[#e8eaed] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Share candidate interview link
          </span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="left"
        sideOffset={16}
        align="center"
        className="w-80 rounded-2xl border border-white/[0.10] bg-[#18191b] p-0 shadow-[0_24px_60px_rgba(0,0,0,0.55)] outline-none"
      >
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15">
                <Link2 className="h-3.5 w-3.5 text-violet-400" strokeWidth={1.75} />
              </div>
              <p className="text-[13px] font-semibold text-[#e8eaed]">Candidate Link</p>
            </div>
            {/* Status badge */}
            <span className={cn("flex items-center gap-1.5 text-[11px] font-semibold", st.textColor)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", st.dot, candidateStatus === "waiting" && "animate-pulse")} />
              {st.text}
            </span>
          </div>

          <div className="space-y-3 p-4">
            {/* Candidate name */}
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[9px] font-bold text-white/70">
                {candidateName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <span className="text-[12px] font-medium text-[#e8eaed]">{candidateName}</span>
            </div>

            {/* URL row */}
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5">
              <span className="flex-1 truncate font-mono text-[11px] text-[#9aa0a6]">{joinUrl}</span>
              <button
                type="button"
                onClick={copyLink}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-[#9aa0a6] transition-colors hover:bg-white/[0.08] hover:text-[#e8eaed]"
              >
                {copied ? (
                  <><Check className="h-3 w-3 text-emerald-400" strokeWidth={2.5} /><span className="text-emerald-400">Copied</span></>
                ) : (
                  <><Copy className="h-3 w-3" strokeWidth={1.75} /><span>Copy</span></>
                )}
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-violet-600/80 text-[12px] font-semibold text-white transition-colors hover:bg-violet-600"
              >
                <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                Copy Link
              </button>
              <button
                type="button"
                onClick={() => { setOpen(false); onOpenWaitingRoom(); }}
                className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.10] bg-white/[0.05] text-[12px] font-medium text-[#c5c6c7] transition-colors hover:bg-white/[0.08] hover:text-[#e8eaed]"
              >
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
                Waiting Room
              </button>
            </div>

            {/* Info footer */}
            <p className="text-center text-[10px] text-[#5f6368]">
              Candidate receives the link via email · ze[meet] notifies you when they join
            </p>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

function ToolbarBtn({
  icon: Icon,
  label,
  isActive,
  activeColorClass,
  onClick,
}: {
  icon: ElementType;
  label: string;
  isActive: boolean;
  activeColorClass: string;
  onClick?: () => void;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        title={label}
        aria-label={label}
        aria-pressed={isActive}
        onClick={onClick}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
          isActive ? "bg-white/15 shadow-lg" : "hover:bg-white/10",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-colors",
            isActive ? activeColorClass : "text-[#9aa0a6] group-hover:text-[#e8eaed]",
          )}
          strokeWidth={1.75}
        />
        {isActive && (
          <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-black/40" />
        )}
      </button>
      <span className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#3c4043] px-2.5 py-1.5 text-[11px] font-medium text-[#e8eaed] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

// ── Google Meet Bottom Controls ───────────────────────────────────────────────

function GMeetBottomControls({
  micOn,
  camOn,
  setMicOn,
  setCamOn,
  onEndCall,
  shortCode,
}: {
  micOn: boolean;
  camOn: boolean;
  setMicOn: (v: boolean) => void;
  setCamOn: (v: boolean) => void;
  onEndCall: () => void;
  shortCode: string;
}) {
  return (
    <div className="flex h-20 shrink-0 items-center justify-between bg-[#202124] px-6">
      <div className="w-32 truncate font-mono text-[13px] text-[#5f6368]">
        {shortCode.slice(0, 14)}
      </div>

      <div className="flex items-center gap-1.5">
        <MCtrl
          icon={micOn ? Mic : MicOff}
          label={micOn ? "Mute" : "Unmute"}
          off={!micOn}
          onClick={() => setMicOn(!micOn)}
        />
        <MCtrl
          icon={camOn ? Video : VideoOff}
          label={camOn ? "Camera off" : "Start camera"}
          off={!camOn}
          onClick={() => setCamOn(!camOn)}
        />
        <div className="mx-1 h-7 w-px bg-white/10" />
        <MCtrl icon={Subtitles} label="Captions" />
        <MCtrl icon={Hand} label="Raise hand" />
        <MCtrl icon={ScreenShare} label="Present" />
        <div className="mx-1 h-7 w-px bg-white/10" />
        <MCtrl icon={Users} label="People" />
        <MCtrl icon={MessageSquare} label="Chat" />
        <MCtrl icon={Grid3x3} label="Activities" />
        <div className="mx-1 h-7 w-px bg-white/10" />
        <button
          type="button"
          onClick={onEndCall}
          title="Leave call"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ea4335] shadow-lg shadow-[#ea4335]/20 transition-all hover:bg-[#d33828] active:scale-95"
        >
          <PhoneOff className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex w-32 justify-end">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/[0.08]"
        >
          <MoreHorizontal className="h-5 w-5 text-[#9aa0a6]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

function MCtrl({
  icon: Icon,
  label,
  off,
  onClick,
}: {
  icon: ElementType;
  label: string;
  off?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full transition-all active:scale-95",
        off
          ? "bg-white/10 text-[#ea4335] hover:bg-white/15"
          : "bg-[#3c4043] text-[#e8eaed] hover:bg-[#4a4f52]",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}

// ── Shared Drawer Shell ───────────────────────────────────────────────────────

function DrawerShell({
  icon: Icon,
  title,
  iconColor,
  onClose,
  children,
}: {
  icon: ElementType;
  title: string;
  iconColor: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 360, damping: 36 }}
      className="absolute right-0 z-40 flex flex-col border-l border-white/[0.07] bg-[#1c1c1e] shadow-2xl"
      style={{ top: 56, bottom: 80, width: 360 }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-[#e8eaed]">{title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5 text-[#9aa0a6]" strokeWidth={2} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}

function IntelSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">
        {label}
      </p>
      {children}
    </section>
  );
}

// ── Sticky Notes Drawer ───────────────────────────────────────────────────────

function StickyNoteDrawer({
  notes,
  noteText,
  setNoteText,
  onSave,
  onClose,
}: {
  notes: ZeMeetNoteEntry[];
  noteText: string;
  setNoteText: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 360, damping: 36 }}
      className="absolute right-0 z-40 flex flex-col border-l border-white/[0.07] bg-[#1c1c1e] shadow-2xl"
      style={{ top: 56, bottom: 80, width: 340 }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <StickyNote className="h-4 w-4 text-amber-400" strokeWidth={1.5} />
          <p className="text-[14px] font-semibold text-[#e8eaed]">Private Notes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            <Lock className="h-2.5 w-2.5" strokeWidth={2} />
            Only you
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5 text-[#9aa0a6]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div
          className="relative rounded-xl bg-amber-50 p-3.5 shadow-md"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          <div className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-amber-200/80 opacity-70" />
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a private note…"
            rows={3}
            className="w-full resize-none bg-transparent text-[13px] font-medium leading-relaxed text-amber-900 placeholder-amber-400/80 outline-none"
            onKeyDown={(e) => e.key === "Enter" && e.metaKey && onSave()}
          />
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[10px] font-medium text-amber-600/70">Private · only visible to you</p>
            <button
              type="button"
              onClick={onSave}
              disabled={!noteText.trim()}
              className="flex h-7 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-40"
            >
              <Send className="h-2.5 w-2.5" strokeWidth={2} />
              Pin note
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "relative rounded-xl p-3 shadow-md",
                NOTE_COLORS[i % NOTE_COLORS.length],
                NOTE_ROTATIONS[i % NOTE_ROTATIONS.length],
              )}
            >
              <div className="absolute -top-2 left-1/2 h-3.5 w-8 -translate-x-1/2 rounded-sm bg-white/60 opacity-80" />
              <p className="text-[12px] font-medium leading-snug text-slate-800">{note.body}</p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                {new Date(note.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Resume Drawer ─────────────────────────────────────────────────────────────

function ResumeDrawer({
  candidateName,
  intel,
  onClose,
}: {
  candidateName: string;
  intel?: ZeMeetCandidateIntel;
  onClose: () => void;
}) {
  const initials = candidateName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DrawerShell icon={FileText} title="Resume" iconColor="text-violet-400" onClose={onClose}>
      <div className="space-y-5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[15px] font-bold text-white/70">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#e8eaed]">{candidateName}</p>
            <p className="text-[12px] text-[#9aa0a6]">{intel?.experience ?? "Experience on record"}</p>
          </div>
          {intel?.resumeUrl && (
            <a
              href={intel.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[11px] text-[#9aa0a6] transition-colors hover:border-white/20 hover:text-white"
            >
              <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
              PDF
            </a>
          )}
        </div>

        {intel?.skills && intel.skills.length > 0 && (
          <IntelSection label="Skills">
            <div className="flex flex-wrap gap-1.5">
              {intel.skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-[#c5c6c7]"
                >
                  {s}
                </span>
              ))}
            </div>
          </IntelSection>
        )}

        {intel?.education && (
          <IntelSection label="Education">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="h-4 w-4 shrink-0 text-[#9aa0a6]" strokeWidth={1.5} />
              <p className="text-[13px] text-[#c5c6c7]">{intel.education}</p>
            </div>
          </IntelSection>
        )}

        {!intel && (
          <p className="text-[13px] text-[#5f6368]">No resume data available for this candidate.</p>
        )}
      </div>
    </DrawerShell>
  );
}

// ── LinkedIn Drawer ───────────────────────────────────────────────────────────

function LinkedInDrawer({
  candidateName,
  intel,
  onClose,
}: {
  candidateName: string;
  intel?: ZeMeetCandidateIntel;
  onClose: () => void;
}) {
  const initials = candidateName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <DrawerShell icon={Linkedin} title="LinkedIn" iconColor="text-sky-400" onClose={onClose}>
      <div className="space-y-4 p-5">
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <div className="h-16 bg-gradient-to-r from-[#1a73e8]/25 via-violet-600/15 to-transparent" />
          <div className="px-4 pb-4">
            <div className="-mt-6 flex items-end justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1c1c1e] bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[14px] font-bold text-white/70">
                {initials}
              </div>
              {intel?.linkedin && (
                <a
                  href={intel.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-sky-500/40 px-3 py-1 text-[11px] font-semibold text-sky-400 transition-colors hover:bg-sky-500/10"
                >
                  <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                  Open profile
                </a>
              )}
            </div>
            <p className="mt-2.5 text-[14px] font-semibold text-[#e8eaed]">{candidateName}</p>
            {intel?.experience && (
              <p className="text-[12px] text-[#9aa0a6]">{intel.experience}</p>
            )}
          </div>
        </div>

        {intel?.skills && intel.skills.length > 0 && (
          <IntelSection label="Top Skills">
            <div className="space-y-1">
              {intel.skills.slice(0, 5).map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between border-b border-white/[0.04] py-1.5 last:border-0"
                >
                  <span className="text-[13px] text-[#c5c6c7]">{skill}</span>
                </div>
              ))}
            </div>
          </IntelSection>
        )}

        {!intel && (
          <p className="text-[13px] text-[#5f6368]">
            No LinkedIn data available for this candidate.
          </p>
        )}
      </div>
    </DrawerShell>
  );
}

// ── Candidate Waiting Room Modal ──────────────────────────────────────────────

function CandidateWaitingRoomModal({
  candidateName,
  jobTitle,
  roundTitle,
  onClose,
}: {
  candidateName: string;
  jobTitle: string;
  roundTitle: string;
  onClose: () => void;
}) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const initials = candidateName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="relative w-full max-w-[860px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#18191b] shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
      >
        {/* Modal close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#9aa0a6] transition-colors hover:bg-white/10 hover:text-[#e8eaed]"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="flex items-center gap-0 overflow-hidden">
          {/* Left: camera preview */}
          <div className="flex flex-1 flex-col gap-5 p-8">
            {/* Preview header */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a73e8]/10">
                <Video className="h-3.5 w-3.5 text-[#1a73e8]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#9aa0a6]">Candidate Waiting Room Preview</p>
              </div>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                <span className="h-1 w-1 animate-pulse rounded-full bg-amber-400" />
                Interviewer view only
              </span>
            </div>

            {/* Camera preview box */}
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{ aspectRatio: "16/9" }}
            >
              {camOn ? (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2d1b5e] via-[#1a1040] to-[#0d0820]">
                  <span className="select-none text-[4rem] font-bold text-white/15">{initials}</span>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#111111]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3c4043]">
                    <VideoOff className="h-5 w-5 text-[#9aa0a6]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[13px] text-[#9aa0a6]">Camera is off</p>
                </div>
              )}

              {/* Controls overlay */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMicOn((v) => !v)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-white transition-all",
                    micOn ? "bg-[#3c4043] hover:bg-[#4a4f52]" : "bg-red-600/90",
                  )}
                >
                  {micOn ? <Mic className="h-4 w-4" strokeWidth={1.75} /> : <MicOff className="h-4 w-4" strokeWidth={1.75} />}
                </button>
                <button
                  type="button"
                  onClick={() => setCamOn((v) => !v)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-white transition-all",
                    camOn ? "bg-[#3c4043] hover:bg-[#4a4f52]" : "bg-red-600/90",
                  )}
                >
                  {camOn ? <Video className="h-4 w-4" strokeWidth={1.75} /> : <VideoOff className="h-4 w-4" strokeWidth={1.75} />}
                </button>
              </div>

              {/* Name label */}
              <div className="absolute bottom-14 left-2.5">
                <span className="rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  {candidateName}
                </span>
              </div>
            </div>

            <p className="text-center text-[12px] text-[#5f6368]">
              {micOn && camOn ? "Mic and camera are on" : "Devices toggled"}
            </p>
          </div>

          {/* Right: join card */}
          <div className="flex w-[280px] shrink-0 flex-col gap-5 border-l border-white/[0.07] bg-[#111214] p-8">
            {/* Meet branding */}
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 40 28" className="h-4 w-6" aria-label="Google Meet">
                <path d="M24 14L32 7v14l-8-7z" fill="#00832d" />
                <path d="M0 20.4V25c0 1.1.9 2 2 2h4l1-4-1-4H2c-1.1 0-2 .9-2 2z" fill="#0066da" />
                <path d="M6 27h14l2-6.5L20 14H6v6h8v1H6v6z" fill="#e94235" />
                <path d="M20 7H6v7h14l2-3.5L20 7z" fill="#2684fc" />
                <path d="M6 14v6h14v-6H6z" fill="#00ac47" />
                <path d="M20 7l2 7-2 6h12V7H20z" fill="#ffba00" />
              </svg>
              <span className="text-[12px] font-medium text-[#9aa0a6]">Google Meet</span>
            </div>

            <div>
              <h2 className="text-[18px] font-semibold text-[#e8eaed]">Ready to join?</h2>
              <p className="mt-1 text-[13px] leading-relaxed text-[#9aa0a6]">
                {jobTitle}
                <br />
                {roundTitle}
              </p>
            </div>

            {/* Interview instructions */}
            <div className="space-y-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">
                Before you join
              </p>
              {[
                "Check your mic and camera above",
                "Use Chrome or Edge for best experience",
                "Find a quiet, well-lit space",
                "Keep your IDE ready if needed",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-[12px] text-[#9aa0a6]">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" strokeWidth={2.5} />
                  {tip}
                </div>
              ))}
            </div>

            {/* Privacy note */}
            <div className="flex items-start gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
              <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5f6368]" strokeWidth={1.5} />
              <p className="text-[11px] text-[#5f6368]">
                This session may be recorded for candidate evaluation purposes.
              </p>
            </div>

            {/* Join button */}
            <button
              type="button"
              disabled
              className="h-11 w-full cursor-not-allowed rounded-full bg-[#1a73e8]/50 text-[14px] font-semibold text-white/50"
            >
              Join Interview
            </button>

            <p className="text-center text-[10px] text-[#5f6368]">
              Candidate will see this screen after opening the link.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
