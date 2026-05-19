"use client";

import { useState } from "react";
import {
  BookOpen,
  Code2,
  FileText,
  Linkedin,
  MessageSquare,
  Mic,
  MicOff,
  MonitorUp,
  MoreHorizontal,
  PhoneOff,
  StickyNote,
  Users,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  BUBBLE_SIZE,
  DOCK_TRANSITION,
  glassBubbleSurface,
  glassDockAnchor,
  glassDockPill,
  glassDockRow,
  glassGroupDivider,
  glassHeroAccentClass,
  glassIconClass,
  glassTooltipKbd,
  glassTooltipSurface,
  type GlassBubbleVariant,
} from "@/components/zemeet/room/zeMeetGlassDock";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

const ICON = "h-5 w-5 shrink-0";
const STROKE = 1.75;

export function ZeMeetControlBar({
  onLeave,
  codeChallengeMode,
}: {
  onLeave: () => void;
  codeChallengeMode?: boolean;
}) {
  const {
    session,
    devices,
    setDevices,
    sidebarTab,
    setSidebarTab,
    openSendCodeChallengeConfirm,
    codeChallenge,
    interviewerIntelPanel,
    toggleInterviewerIntel,
  } = useZeMeet();
  const t = useZeMeetTokens();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const isInterviewer =
    session.viewerRole === "interviewer" || session.viewerRole === "observer";
  const isCandidate = session.viewerRole === "candidate";
  const showIntelControls = isInterviewer;

  const codeChallengePressed =
    codeChallenge.status === "active" || codeChallenge.status === "invite_pending";
  const codeChallengeLabel =
    codeChallenge.status === "active"
      ? "End code challenge"
      : codeChallenge.status === "invite_pending"
        ? "Request pending"
        : "Code challenge";

  function toggleSidebar(tab: "participants" | "chat" | "notes" | "instructions") {
    setSidebarTab(sidebarTab === tab ? null : tab);
    setMobileSheetOpen(false);
  }

  const mediaCluster = (
    <BubbleCluster tokens={t} label="Media">
      <GlassBubble
        label={devices.audioEnabled ? "Mute" : "Unmute"}
        shortcut="M"
        variant={devices.audioEnabled ? "default" : "muted"}
        tokens={t}
        onClick={() => setDevices((d) => ({ ...d, audioEnabled: !d.audioEnabled }))}
      >
        {devices.audioEnabled ? (
          <Mic className={ICON} strokeWidth={STROKE} />
        ) : (
          <MicOff className={ICON} strokeWidth={STROKE} />
        )}
      </GlassBubble>
      <GlassBubble
        label={devices.videoEnabled ? "Stop video" : "Start video"}
        shortcut="V"
        variant={devices.videoEnabled ? "default" : "muted"}
        tokens={t}
        onClick={() => setDevices((d) => ({ ...d, videoEnabled: !d.videoEnabled }))}
      >
        {devices.videoEnabled ? (
          <Video className={ICON} strokeWidth={STROKE} />
        ) : (
          <VideoOff className={ICON} strokeWidth={STROKE} />
        )}
      </GlassBubble>
      <GlassBubble label="Share screen" shortcut="S" tokens={t}>
        <MonitorUp className={ICON} strokeWidth={STROKE} />
      </GlassBubble>
    </BubbleCluster>
  );

  const chatBubble = (
    <GlassBubble
      label="Chat"
      shortcut="C"
      variant={sidebarTab === "chat" ? "active" : "default"}
      tokens={t}
      onClick={() => toggleSidebar("chat")}
    >
      <MessageSquare className={ICON} strokeWidth={STROKE} />
    </GlassBubble>
  );

  const collabCluster = (
    <BubbleCluster tokens={t} label="Collaboration">
      <GlassBubble
        label="Participants"
        shortcut="P"
        variant={sidebarTab === "participants" ? "active" : "default"}
        tokens={t}
        onClick={() => toggleSidebar("participants")}
      >
        <Users className={ICON} strokeWidth={STROKE} />
      </GlassBubble>
      {chatBubble}
      {isInterviewer ? (
        <GlassBubble
          label="Private notes"
          shortcut="N"
          variant={sidebarTab === "notes" ? "active" : "default"}
          tokens={t}
          onClick={() => toggleSidebar("notes")}
        >
          <StickyNote className={ICON} strokeWidth={STROKE} />
        </GlassBubble>
      ) : null}
      {showIntelControls ? (
        <>
          <GlassBubble
            label="View resume (private)"
            variant={interviewerIntelPanel === "resume" ? "active" : "default"}
            tokens={t}
            onClick={() => toggleInterviewerIntel("resume")}
          >
            <FileText className={ICON} strokeWidth={STROKE} />
          </GlassBubble>
          <GlassBubble
            label="LinkedIn profile (private)"
            variant={interviewerIntelPanel === "linkedin" ? "active" : "default"}
            tokens={t}
            onClick={() => toggleInterviewerIntel("linkedin")}
          >
            <Linkedin className={ICON} strokeWidth={STROKE} />
          </GlassBubble>
        </>
      ) : null}
    </BubbleCluster>
  );

  const codeHeroCluster =
    isInterviewer && session.codeChallengeEnabled ? (
      <BubbleCluster tokens={t} label="Code challenge">
        <GlassBubble
          label={codeChallengeLabel}
          shortcut="K"
          variant={codeChallengePressed ? "active" : "hero"}
          tokens={t}
          onClick={openSendCodeChallengeConfirm}
        >
          <Code2 className={ICON} strokeWidth={STROKE} />
        </GlassBubble>
      </BubbleCluster>
    ) : null;

  const endBubble = <EndGlassBubble label="End interview" tokens={t} onClick={onLeave} />;

  const candidateDock = (
    <>
      {mediaCluster}
      <GroupDivider isLight={t.isLight} />
      {chatBubble}
      <GroupDivider isLight={t.isLight} />
      {endBubble}
    </>
  );

  return (
    <>
      <footer className={glassDockAnchor(Boolean(codeChallengeMode))} aria-label="Meeting controls">
        <div className={glassDockPill(t.isLight)} role="toolbar">
          {isCandidate ? (
            <div className={glassDockRow()}>{candidateDock}</div>
          ) : (
            <>
        <div className={cn(glassDockRow(), "hidden lg:flex")}>
          {mediaCluster}
          <GroupDivider isLight={t.isLight} />
          {collabCluster}
          {codeHeroCluster ? (
            <>
              <GroupDivider isLight={t.isLight} />
              {codeHeroCluster}
            </>
          ) : null}
          <GroupDivider isLight={t.isLight} />
          {endBubble}
        </div>

        <div className={cn(glassDockRow(), "hidden md:flex lg:hidden")}>
          {mediaCluster}
          <GroupDivider isLight={t.isLight} />
          <BubbleCluster tokens={t} label="Collaboration">
            <GlassBubble
              label="Participants"
              variant={sidebarTab === "participants" ? "active" : "default"}
              tokens={t}
              onClick={() => toggleSidebar("participants")}
            >
              <Users className={ICON} strokeWidth={STROKE} />
            </GlassBubble>
            {chatBubble}
            {showIntelControls ? (
              <>
                <GlassBubble
                  label="View resume"
                  variant={interviewerIntelPanel === "resume" ? "active" : "default"}
                  tokens={t}
                  onClick={() => toggleInterviewerIntel("resume")}
                >
                  <FileText className={ICON} strokeWidth={STROKE} />
                </GlassBubble>
                <GlassBubble
                  label="LinkedIn"
                  variant={interviewerIntelPanel === "linkedin" ? "active" : "default"}
                  tokens={t}
                  onClick={() => toggleInterviewerIntel("linkedin")}
                >
                  <Linkedin className={ICON} strokeWidth={STROKE} />
                </GlassBubble>
              </>
            ) : null}
            {isInterviewer && session.codeChallengeEnabled ? (
              <GlassBubble
                label={codeChallengeLabel}
                variant={codeChallengePressed ? "active" : "hero"}
                tokens={t}
                onClick={openSendCodeChallengeConfirm}
              >
                <Code2 className={ICON} strokeWidth={STROKE} />
              </GlassBubble>
            ) : null}
            <MoreMenu
              tokens={t}
              isInterviewer={isInterviewer}
              isCandidate={isCandidate}
              showIntelControls={showIntelControls}
              interviewerIntelPanel={interviewerIntelPanel}
              onNotes={() => toggleSidebar("notes")}
              onInstructions={() => toggleSidebar("instructions")}
              onToggleIntel={toggleInterviewerIntel}
            />
          </BubbleCluster>
          <GroupDivider isLight={t.isLight} />
          {endBubble}
        </div>

        <div className={cn(glassDockRow(), "flex md:hidden")}>
          {mediaCluster}
          <GroupDivider isLight={t.isLight} />
          <BubbleCluster tokens={t} label="More">
            <GlassBubble
              label="More controls"
              variant={mobileSheetOpen ? "active" : "default"}
              tokens={t}
              onClick={() => setMobileSheetOpen((o) => !o)}
            >
              <MoreHorizontal className={ICON} strokeWidth={STROKE} />
            </GlassBubble>
          </BubbleCluster>
          <GroupDivider isLight={t.isLight} />
          <EndGlassBubble label="End interview" tokens={t} onClick={onLeave} compact />
        </div>
          </>
        )}
        </div>
      </footer>

      {mobileSheetOpen && !isCandidate ? (
        <MobileControlSheet
          tokens={t}
          isInterviewer={isInterviewer}
          isCandidate={isCandidate}
          showIntelControls={showIntelControls}
          sidebarTab={sidebarTab}
          interviewerIntelPanel={interviewerIntelPanel}
          codeChallengeEnabled={session.codeChallengeEnabled}
          codeChallengeLabel={codeChallengeLabel}
          codeChallengePressed={codeChallengePressed}
          onClose={() => setMobileSheetOpen(false)}
          onToggleSidebar={toggleSidebar}
          onToggleIntel={toggleInterviewerIntel}
          onCodeChallenge={openSendCodeChallengeConfirm}
          onLeave={onLeave}
        />
      ) : null}
    </>
  );
}

function GroupDivider({ isLight }: { isLight: boolean }) {
  return <div className={glassGroupDivider(isLight)} aria-hidden role="separator" />;
}

function BubbleCluster({
  children,
  label,
}: {
  children: React.ReactNode;
  tokens: ReturnType<typeof useZeMeetTokens>;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-2">
      {children}
    </div>
  );
}

function GlassBubble({
  children,
  label,
  shortcut,
  variant = "default",
  onClick,
  tokens: t,
  className,
}: {
  children: React.ReactNode;
  label: string;
  shortcut?: string;
  variant?: GlassBubbleVariant;
  onClick?: () => void;
  tokens: ReturnType<typeof useZeMeetTokens>;
  className?: string;
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          aria-pressed={variant === "active" || variant === "muted"}
          onClick={onClick}
          className={cn(
            glassBubbleSurface(t.isLight, variant),
            glassIconClass(t.isLight, variant),
            className,
          )}
        >
          {children}
          {variant === "hero" ? (
            <span className={glassHeroAccentClass()} aria-hidden />
          ) : null}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={10} className={glassTooltipSurface(t.isLight)}>
        <span className="text-[11px] font-medium">{label}</span>
        {shortcut ? <kbd className={glassTooltipKbd(t.isLight)}>{shortcut}</kbd> : null}
      </TooltipContent>
    </Tooltip>
  );
}

function EndGlassBubble({
  label,
  tokens: t,
  onClick,
  compact,
}: {
  label: string;
  tokens: ReturnType<typeof useZeMeetTokens>;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className={cn(
            glassBubbleSurface(t.isLight, "danger"),
            "inline-flex items-center justify-center gap-2",
            compact ? cn(BUBBLE_SIZE, "border-transparent px-0") : "h-11 min-h-[44px] px-4",
          )}
        >
          <PhoneOff className="h-[18px] w-[18px] shrink-0" strokeWidth={STROKE} />
          {!compact ? <span className="text-[13px] font-semibold">{label}</span> : null}
        </button>
      </TooltipTrigger>
      {!compact ? null : (
        <TooltipContent side="top" sideOffset={10}>
          <span className="text-[11px] font-medium">{label}</span>
        </TooltipContent>
      )}
    </Tooltip>
  );
}

function MoreMenu({
  tokens: t,
  isInterviewer,
  isCandidate,
  showIntelControls,
  interviewerIntelPanel,
  onNotes,
  onInstructions,
  onToggleIntel,
}: {
  tokens: ReturnType<typeof useZeMeetTokens>;
  isInterviewer: boolean;
  isCandidate: boolean;
  showIntelControls: boolean;
  interviewerIntelPanel: string;
  onNotes: () => void;
  onInstructions: () => void;
  onToggleIntel: (panel: "resume" | "linkedin") => void;
}) {
  return (
    <DropdownMenu>
      <Tooltip delayDuration={350}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More controls"
              className={cn(glassBubbleSurface(t.isLight, "default"), glassIconClass(t.isLight))}
            >
              <MoreHorizontal className={ICON} strokeWidth={STROKE} />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={14}>
          <span className="text-[11px] font-medium">More</span>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent
        align="center"
        side="top"
        sideOffset={16}
        className={cn(
          "min-w-[200px] rounded-[12px] border p-1 backdrop-blur-[24px]",
          t.isLight
            ? "border-[rgba(15,23,42,0.1)] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
            : "border-[rgba(255,255,255,0.08)] bg-[rgba(18,18,22,0.95)] shadow-[0_12px_32px_rgba(0,0,0,0.45)]",
        )}
      >
        {isInterviewer ? (
          <DropdownMenuItem onClick={onNotes} className="rounded-[10px] text-[13px]">
            <StickyNote className="mr-2 h-4 w-4 opacity-70" strokeWidth={STROKE} />
            Private notes
          </DropdownMenuItem>
        ) : null}
        {isCandidate ? (
          <DropdownMenuItem onClick={onInstructions} className="rounded-[10px] text-[13px]">
            <BookOpen className="mr-2 h-4 w-4 opacity-70" strokeWidth={STROKE} />
            Instructions
          </DropdownMenuItem>
        ) : null}
        {showIntelControls ? (
          <>
            <DropdownMenuSeparator className={t.isLight ? "bg-[rgba(15,23,42,0.08)]" : "bg-white/10"} />
            <DropdownMenuItem
              onClick={() => onToggleIntel("resume")}
              className="rounded-[10px] text-[13px]"
            >
              <FileText className="mr-2 h-4 w-4 opacity-70" strokeWidth={STROKE} />
              Resume {interviewerIntelPanel === "resume" ? "· On" : ""}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onToggleIntel("linkedin")}
              className="rounded-[10px] text-[13px]"
            >
              <Linkedin className="mr-2 h-4 w-4 opacity-70" strokeWidth={STROKE} />
              LinkedIn {interviewerIntelPanel === "linkedin" ? "· On" : ""}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileControlSheet({
  tokens: t,
  isInterviewer,
  isCandidate,
  showIntelControls,
  sidebarTab,
  interviewerIntelPanel,
  codeChallengeEnabled,
  codeChallengeLabel,
  codeChallengePressed,
  onClose,
  onToggleSidebar,
  onToggleIntel,
  onCodeChallenge,
  onLeave,
}: {
  tokens: ReturnType<typeof useZeMeetTokens>;
  isInterviewer: boolean;
  isCandidate: boolean;
  showIntelControls: boolean;
  sidebarTab: string | null;
  interviewerIntelPanel: string;
  codeChallengeEnabled: boolean;
  codeChallengeLabel: string;
  codeChallengePressed: boolean;
  onClose: () => void;
  onToggleSidebar: (tab: "participants" | "chat" | "notes" | "instructions") => void;
  onToggleIntel: (panel: "resume" | "linkedin") => void;
  onCodeChallenge: () => void;
  onLeave: () => void;
}) {
  const sheetItem = (active: boolean) =>
    cn(
      "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 text-left text-[14px] font-medium",
      DOCK_TRANSITION,
      active
        ? t.isLight
          ? "bg-[rgba(15,23,42,0.08)] text-[#18181B]"
          : "bg-[rgba(255,255,255,0.14)] text-white"
        : t.isLight
          ? "text-[#3F3F46] hover:bg-[rgba(15,23,42,0.04)]"
          : "text-[rgba(255,255,255,0.88)] hover:bg-[rgba(255,255,255,0.08)]",
    );

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        aria-label="Close controls"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-[20px] border-t px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 animate-radix-in backdrop-blur-[24px]",
          t.isLight
            ? "border-[rgba(15,23,42,0.08)] bg-[rgba(248,249,252,0.98)]"
            : "border-[rgba(255,255,255,0.10)] bg-[rgba(10,13,18,0.95)]",
        )}
        role="dialog"
        aria-label="Meeting controls"
      >
        <div
          className={cn(
            "mx-auto mb-3 h-1 w-10 rounded-full",
            t.isLight ? "bg-[rgba(15,23,42,0.12)]" : "bg-white/20",
          )}
          aria-hidden
        />
        <div className="mb-3 flex items-center justify-between">
          <p className={cn("text-[13px] font-semibold", t.isLight ? "text-[#18181B]" : "text-white/95")}>
            Controls
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={cn(glassBubbleSurface(t.isLight, "default"), "h-9 w-9 min-h-0 min-w-0")}
          >
            <X className="h-4 w-4" strokeWidth={STROKE} />
          </button>
        </div>
        <div className="grid gap-1 pb-3">
          <button
            type="button"
            className={sheetItem(sidebarTab === "participants")}
            onClick={() => onToggleSidebar("participants")}
          >
            <Users className="h-[18px] w-[18px]" strokeWidth={STROKE} />
            Participants
          </button>
          <button
            type="button"
            className={sheetItem(sidebarTab === "chat")}
            onClick={() => onToggleSidebar("chat")}
          >
            <MessageSquare className="h-[18px] w-[18px]" strokeWidth={STROKE} />
            Chat
          </button>
          {isCandidate ? (
            <button
              type="button"
              className={sheetItem(sidebarTab === "instructions")}
              onClick={() => onToggleSidebar("instructions")}
            >
              <BookOpen className="h-[18px] w-[18px]" strokeWidth={STROKE} />
              Instructions
            </button>
          ) : null}
          {isInterviewer ? (
            <button
              type="button"
              className={sheetItem(sidebarTab === "notes")}
              onClick={() => onToggleSidebar("notes")}
            >
              <StickyNote className="h-[18px] w-[18px]" strokeWidth={STROKE} />
              Private notes
            </button>
          ) : null}
          {isInterviewer && codeChallengeEnabled ? (
            <button
              type="button"
              className={sheetItem(codeChallengePressed)}
              onClick={() => {
                onCodeChallenge();
                onClose();
              }}
            >
              <Code2 className="h-[18px] w-[18px]" strokeWidth={STROKE} />
              {codeChallengeLabel}
            </button>
          ) : null}
          {showIntelControls ? (
            <>
              <button
                type="button"
                className={sheetItem(interviewerIntelPanel === "resume")}
                onClick={() => onToggleIntel("resume")}
              >
                <FileText className="h-[18px] w-[18px]" strokeWidth={STROKE} />
                Resume
              </button>
              <button
                type="button"
                className={sheetItem(interviewerIntelPanel === "linkedin")}
                onClick={() => onToggleIntel("linkedin")}
              >
                <Linkedin className="h-[18px] w-[18px]" strokeWidth={STROKE} />
                LinkedIn
              </button>
            </>
          ) : null}
        </div>
        <button
          type="button"
          className={cn(
            glassBubbleSurface(t.isLight, "danger"),
            "mb-1 flex h-12 w-full items-center justify-center gap-2",
          )}
          onClick={onLeave}
        >
          <PhoneOff className="h-4 w-4" strokeWidth={STROKE} />
          <span className="text-[13px] font-semibold">End interview</span>
        </button>
      </div>
    </div>
  );
}
