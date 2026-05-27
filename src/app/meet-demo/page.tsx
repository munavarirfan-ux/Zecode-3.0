"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare,
  MessageSquare, Users, Hand, Subtitles, MoreHorizontal,
  Code2, FileText, StickyNote, Linkedin, Sparkles,
  Play, Square, Check, X, ChevronRight, RefreshCw,
  Circle, Activity, Award, Wand2, ExternalLink,
  MapPin, GraduationCap, Building2, Send, ChevronDown,
  Star, Lock, Clock, Hash, Grid3x3, Wifi, Settings,
  Globe, Briefcase, Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CANDIDATE = {
  name: "Sarah Jenkins",
  role: "Staff Product Designer",
  experience: "8.2 years",
  location: "London, UK",
  initials: "SJ",
  skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Accessibility", "Motion Design"],
  education: "MA Design · Royal College of Art, London",
  connections: "847",
  about: "Staff designer with 8+ years shaping product experiences at high-growth fintechs and design tooling companies. Specialised in scalable design systems and inclusive UX.",
};

const INTERVIEWER = { name: "Revanth Kumar", role: "Engineering Manager", initials: "RK" };
const MEETING = { title: "Staff Product Designer · Design Review", shortCode: "abc-defg-hij" };

const SAMPLE_CODE = `// Responsive Dashboard Architecture
// TypeScript  |  ze[meet] Code Challenge

interface Widget {
  id: string;
  minCols: number;
  maxCols: number;
  minRows: number;
}

interface Breakpoint {
  name: 'sm' | 'md' | 'lg' | 'xl';
  minWidth: number;
  cols: number;
}

const BREAKPOINTS: Breakpoint[] = [
  { name: 'sm', minWidth: 0,    cols: 1  },
  { name: 'md', minWidth: 768,  cols: 6  },
  { name: 'lg', minWidth: 1024, cols: 12 },
];

function getBreakpoint(width: number): Breakpoint {
  return [...BREAKPOINTS]
    .reverse()
    .find(bp => width >= bp.minWidth) ?? BREAKPOINTS[0];
}

export function buildDashboard(widgets: Widget[], width: number) {
  const bp = getBreakpoint(width);
  return widgets.map((w, i) => ({
    id: w.id,
    col: (i * w.minCols) % bp.cols,
    row: Math.floor((i * w.minCols) / bp.cols),
    cols: Math.min(w.minCols, bp.cols),
    rows: w.minRows,
  }));
}`;

const INIT_TESTS = [
  { id: "t1", label: "Breakpoint: lg (1024px)", passed: true,      input: "width=1024, 3 widgets" },
  { id: "t2", label: "Mobile stacked",          passed: true,      input: "width=375, 3 widgets"  },
  { id: "t3", label: "Widget overflow wrap",    passed: false,     input: "width=768, 10 widgets" },
  { id: "t4", label: "Constraint validation",   passed: undefined, input: "minCols=3, maxCols=6"  },
] as const;

type TestCase = { id: string; label: string; passed: boolean | undefined; input: string };

const SCORECARD_SKILLS = ["Technical Skills", "Problem Solving", "Communication", "System Design"];

const AI_INSIGHTS = [
  { text: "Asks sharp clarifying questions before writing any code", positive: true },
  { text: "Clean code structure and consistent variable naming", positive: true },
  { text: "Flagged overflow edge case at line 31 unprompted", positive: true },
  { text: "Recursion depth could be stronger — worth a follow-up", positive: false },
];

const NOTE_COLORS = ["bg-amber-50", "bg-yellow-50", "bg-lime-50", "bg-sky-50", "bg-pink-50"];
const NOTE_ROTATIONS = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-0", "rotate-2"];

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = "lobby" | "meeting";
type ActiveTool = null | "code" | "resume" | "linkedin" | "notes";

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function GoogleMeetPrototype() {
  const [phase, setPhase]           = useState<Phase>("lobby");
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [micOn, setMicOn]           = useState(true);
  const [camOn, setCamOn]           = useState(true);
  const [noteText, setNoteText]     = useState("");
  const [notes, setNotes]           = useState<string[]>(["Strong first impression — communicates very clearly"]);
  const [code, setCode]             = useState(SAMPLE_CODE);
  const [callElapsed, setCallElapsed] = useState(0);
  const [codeElapsed, setCodeElapsed] = useState(0);
  const [tests, setTests]           = useState<TestCase[]>(INIT_TESTS.map(t => ({ ...t })));
  const [runningTests, setRunning]  = useState(false);
  const [ratings, setRatings]       = useState<Record<string, number>>({});
  const [hoverRating, setHoverRating] = useState<{ skill: string; star: number } | null>(null);
  const [aiSummary, setAiSummary]   = useState("");
  const [generatingAi, setGenerating] = useState(false);

  useEffect(() => {
    if (phase === "meeting") {
      const id = setInterval(() => setCallElapsed(n => n + 1), 1000);
      return () => clearInterval(id);
    }
  }, [phase]);

  useEffect(() => {
    if (activeTool === "code") {
      const id = setInterval(() => setCodeElapsed(n => n + 1), 1000);
      return () => clearInterval(id);
    } else {
      setCodeElapsed(0);
    }
  }, [activeTool]);

  function toggleTool(tool: NonNullable<ActiveTool>) {
    setActiveTool(prev => prev === tool ? null : tool);
  }

  function saveNote() {
    if (!noteText.trim()) return;
    setNotes(p => [...p, noteText.trim()]);
    setNoteText("");
  }

  function runTests() {
    setRunning(true);
    setTimeout(() => {
      setTests(p => p.map(t => t.id === "t3" ? { ...t, passed: true } : t));
      setRunning(false);
    }, 1600);
  }

  function generateAi() {
    setGenerating(true);
    setTimeout(() => {
      setAiSummary("Sarah shows strong architectural instincts and communicates trade-offs clearly. She identified the overflow case before being prompted. Recommend advancing — probe CSS Grid edge cases in follow-up.");
      setGenerating(false);
    }, 2000);
  }

  if (phase === "lobby") {
    return (
      <LobbyScreen
        micOn={micOn} camOn={camOn}
        setMicOn={setMicOn} setCamOn={setCamOn}
        onJoin={() => setPhase("meeting")}
      />
    );
  }

  return (
    <MeetShell
      activeTool={activeTool}
      micOn={micOn} camOn={camOn}
      setMicOn={setMicOn} setCamOn={setCamOn}
      callTime={fmt(callElapsed)} codeTime={fmt(codeElapsed)}
      code={code} setCode={setCode}
      tests={tests} runningTests={runningTests} onRunTests={runTests}
      noteText={noteText} setNoteText={setNoteText}
      notes={notes} onSaveNote={saveNote}
      ratings={ratings} setRatings={setRatings}
      hoverRating={hoverRating} setHoverRating={setHoverRating}
      aiSummary={aiSummary} generatingAi={generatingAi} onGenerateAi={generateAi}
      onToggleTool={toggleTool}
      onEndCall={() => { setPhase("lobby"); setActiveTool(null); }}
    />
  );
}

// ─── Lobby ────────────────────────────────────────────────────────────────────

function LobbyScreen({
  micOn, camOn, setMicOn, setCamOn, onJoin,
}: {
  micOn: boolean; camOn: boolean;
  setMicOn: (v: boolean) => void; setCamOn: (v: boolean) => void;
  onJoin: () => void;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#202124]">
      <div className="flex w-full max-w-[900px] items-center gap-10 px-8">

        {/* Camera preview */}
        <div className="flex flex-1 flex-col gap-4">
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ aspectRatio: "16/9" }}
          >
            {camOn ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2d1b5e] via-[#1a1040] to-[#0d0820]">
                <span className="select-none text-[4.5rem] font-bold text-white/15">SJ</span>
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
                onClick={() => setMicOn(!micOn)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                  micOn ? "bg-[#3c4043] hover:bg-[#4a4f52]" : "bg-red-600/90 hover:bg-red-600",
                )}
              >
                {micOn
                  ? <Mic className="h-5 w-5" strokeWidth={1.75} />
                  : <MicOff className="h-5 w-5" strokeWidth={1.75} />}
              </button>
              <button
                onClick={() => setCamOn(!camOn)}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition-all",
                  camOn ? "bg-[#3c4043] hover:bg-[#4a4f52]" : "bg-red-600/90 hover:bg-red-600",
                )}
              >
                {camOn
                  ? <Video className="h-5 w-5" strokeWidth={1.75} />
                  : <VideoOff className="h-5 w-5" strokeWidth={1.75} />}
              </button>
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3c4043] hover:bg-[#4a4f52] transition-colors">
                <Settings className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Name label */}
            <div className="absolute bottom-16 left-3">
              <span className="rounded-md bg-black/55 px-2 py-0.5 text-[12px] font-medium backdrop-blur-sm">
                {CANDIDATE.name} (You)
              </span>
            </div>
          </div>

          <p className="text-center text-[13px] text-[#9aa0a6]">
            {micOn && camOn ? "Mic and camera are on" : "Check your devices above"}
          </p>
        </div>

        {/* Join card */}
        <div className="flex w-[300px] shrink-0 flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1a73e8]/10">
              <Video className="h-4 w-4 text-[#1a73e8]" strokeWidth={2} />
            </div>
            <p className="text-[13px] font-semibold text-[#9aa0a6]">Google Meet</p>
          </div>

          <div>
            <h1 className="text-[22px] font-semibold text-[#e8eaed]">Ready to join?</h1>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[#9aa0a6]">
              Frontend Engineer<br />Technical Interview
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 space-y-2.5">
            <Row icon={Hash} text={MEETING.shortCode} />
            <Row icon={Users} text="2 participants waiting" />
            <Row icon={Clock} text="45 min · Technical interview" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a3048] to-[#070f1a] text-[12px] font-bold">
              RK
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[#e8eaed]">{INTERVIEWER.name}</p>
              <p className="text-[11px] text-[#9aa0a6]">Waiting in call</p>
            </div>
            <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20 shrink-0" />
          </div>

          <button
            onClick={onJoin}
            className="h-12 w-full rounded-full bg-[#1a73e8] text-[15px] font-semibold text-white shadow-lg shadow-[#1a73e8]/20 transition-all hover:bg-[#1557b0] active:scale-[0.98]"
          >
            Join Interview
          </button>

          <p className="text-center text-[11px] text-[#5f6368]">
            By joining you agree to{" "}
            <span className="text-[#8ab4f8] cursor-pointer hover:underline">Google's terms</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <Icon className="h-4 w-4 shrink-0 text-[#5f6368]" strokeWidth={1.5} />
      <span className="text-[#c5c6c7]">{text}</span>
    </div>
  );
}

// ─── Meet Shell ───────────────────────────────────────────────────────────────

type MeetShellProps = {
  activeTool: ActiveTool;
  micOn: boolean; camOn: boolean;
  setMicOn: (v: boolean) => void; setCamOn: (v: boolean) => void;
  callTime: string; codeTime: string;
  code: string; setCode: (v: string) => void;
  tests: TestCase[]; runningTests: boolean; onRunTests: () => void;
  noteText: string; setNoteText: (v: string) => void;
  notes: string[]; onSaveNote: () => void;
  ratings: Record<string, number>; setRatings: (v: Record<string, number>) => void;
  hoverRating: { skill: string; star: number } | null;
  setHoverRating: (v: { skill: string; star: number } | null) => void;
  aiSummary: string; generatingAi: boolean; onGenerateAi: () => void;
  onToggleTool: (t: NonNullable<ActiveTool>) => void;
  onEndCall: () => void;
};

function MeetShell(props: MeetShellProps) {
  const { activeTool, micOn, camOn, setMicOn, setCamOn, callTime, onToggleTool, onEndCall } = props;
  const codeActive = activeTool === "code";

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#202124] font-sans text-[#e8eaed] select-none">
      {/* Google Meet top bar */}
      <MeetTopBar title={MEETING.title} callTime={callTime} codeActive={codeActive} />

      {/* Main area */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {codeActive ? (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <CodeMeetLayout {...props} />
            </motion.div>
          ) : (
            <motion.div
              key="meeting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex min-h-0 flex-1"
            >
              <MeetVideoGrid micOn={micOn} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ze[meet] floating toolbar — always visible, z-50 */}
        <ZeMeetFloatingToolbar activeTool={activeTool} onToggle={onToggleTool} />
      </div>

      {/* Google Meet bottom controls — always at bottom */}
      <MeetBottomControls
        micOn={micOn} camOn={camOn}
        setMicOn={setMicOn} setCamOn={setCamOn}
        onEndCall={onEndCall}
      />

      {/* Drawer overlays */}
      <AnimatePresence>
        {activeTool === "notes"    && (
          <StickyNotesPanel key="notes"    {...props} onClose={() => onToggleTool("notes")} />
        )}
        {activeTool === "resume"   && (
          <ResumeDrawer    key="resume"   onClose={() => onToggleTool("resume")} />
        )}
        {activeTool === "linkedin" && (
          <LinkedInDrawer  key="linkedin" onClose={() => onToggleTool("linkedin")} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Meet Top Bar ─────────────────────────────────────────────────────────────

function MeetTopBar({ title, callTime, codeActive }: { title: string; callTime: string; codeActive: boolean }) {
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
        <span className="max-w-[260px] truncate text-[13px] text-[#9aa0a6]">{title}</span>
        {codeActive && (
          <span className="flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-violet-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            Code Challenge Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[13px] tabular-nums text-[#9aa0a6]">{callTime}</span>
        <div className="flex items-center gap-1.5 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[11px] font-semibold text-red-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
          REC
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/[0.08] transition-colors">
          <Wifi className="h-4 w-4 text-[#5f6368]" strokeWidth={1.5} />
        </button>
        <button className="flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] text-[#9aa0a6] hover:bg-white/[0.08] transition-colors">
          <Users className="h-4 w-4" strokeWidth={1.5} />
          2
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[11px] font-bold text-white/80">
          SJ
        </div>
      </div>
    </div>
  );
}

// ─── Meet Video Grid (normal mode) ────────────────────────────────────────────

function MeetVideoGrid({ micOn }: { micOn: boolean }) {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 p-6 pb-3">
      <VideoTile
        name={CANDIDATE.name}
        sub="Candidate"
        initials={CANDIDATE.initials}
        gradient="from-[#2a1a58] via-[#160e38] to-[#0a0618]"
        isMuted={!micOn}
        isSpeaking
        className="aspect-video flex-[6] max-h-[calc(100vh-230px)]"
      />
      <VideoTile
        name={INTERVIEWER.name}
        sub="Interviewer"
        initials={INTERVIEWER.initials}
        gradient="from-[#162840] via-[#0d1a2a] to-[#060e18]"
        isMuted={false}
        isSpeaking={false}
        className="aspect-video flex-[4] max-h-[calc(100vh-230px)]"
      />
    </div>
  );
}

// ─── Video Tile ───────────────────────────────────────────────────────────────

function VideoTile({
  name, sub, initials, gradient, isMuted, isSpeaking, compact, className,
}: {
  name: string; sub?: string; initials: string; gradient: string;
  isMuted?: boolean; isSpeaking?: boolean; compact?: boolean; className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        isSpeaking && "ring-2 ring-emerald-400/50 ring-offset-2 ring-offset-[#202124]",
        compact && "rounded-xl",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
      {/* Soft inner vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45))]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      {/* Initials */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("select-none font-bold text-white/20", compact ? "text-2xl" : "text-[5rem]")}>
          {initials}
        </span>
      </div>
      {/* Name overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3">
        <div>
          <p className={cn("font-semibold text-white drop-shadow-sm", compact ? "text-[11px]" : "text-[14px]")}>
            {name}
          </p>
          {!compact && sub && (
            <p className="text-[11px] text-white/55">{sub}</p>
          )}
        </div>
        {isMuted && (
          <span className={cn(
            "flex items-center justify-center rounded-full bg-[#ea4335]/90",
            compact ? "h-5 w-5" : "h-7 w-7",
          )}>
            <MicOff className={compact ? "h-2.5 w-2.5" : "h-3.5 w-3.5"} strokeWidth={2} />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Google Meet Bottom Controls ──────────────────────────────────────────────

function MeetBottomControls({
  micOn, camOn, setMicOn, setCamOn, onEndCall,
}: {
  micOn: boolean; camOn: boolean;
  setMicOn: (v: boolean) => void; setCamOn: (v: boolean) => void;
  onEndCall: () => void;
}) {
  return (
    <div className="flex h-20 shrink-0 items-center justify-between bg-[#202124] px-6">
      {/* Left: meeting code */}
      <div className="w-32 text-[13px] font-mono text-[#5f6368]">{MEETING.shortCode}</div>

      {/* Center: controls */}
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
        <MCtrl icon={Subtitles}   label="Captions"   />
        <MCtrl icon={Hand}        label="Raise hand"  />
        <MCtrl icon={ScreenShare} label="Present"     />
        <div className="mx-1 h-7 w-px bg-white/10" />
        <MCtrl icon={Users}       label="People"      />
        <MCtrl icon={MessageSquare} label="Chat"      />
        <MCtrl icon={Grid3x3}     label="Activities"  />
        <div className="mx-1 h-7 w-px bg-white/10" />
        {/* End call */}
        <button
          onClick={onEndCall}
          title="Leave call"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ea4335] shadow-lg shadow-[#ea4335]/20 transition-all hover:bg-[#d33828] active:scale-95"
        >
          <PhoneOff className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      {/* Right: more */}
      <div className="flex w-32 justify-end">
        <button className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/[0.08] transition-colors">
          <MoreHorizontal className="h-5 w-5 text-[#9aa0a6]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

/** Single Google Meet circular control button */
function MCtrl({
  icon: Icon, label, off, onClick,
}: {
  icon: React.ElementType; label: string; off?: boolean; onClick?: () => void;
}) {
  return (
    <button
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

// ─── Ze[meet] Floating Toolbar ────────────────────────────────────────────────

function ZeMeetFloatingToolbar({
  activeTool, onToggle,
}: {
  activeTool: ActiveTool;
  onToggle: (t: NonNullable<ActiveTool>) => void;
}) {
  const items = [
    { id: "code",     icon: Code2,      label: "Code Challenge", accent: "text-violet-300 shadow-violet-500/40" },
    { id: "resume",   icon: FileText,   label: "Resume",         accent: "text-violet-300 shadow-violet-500/40" },
    { id: "linkedin", icon: Linkedin,   label: "LinkedIn",       accent: "text-sky-300 shadow-sky-500/40" },
    { id: "notes",    icon: StickyNote, label: "Private Notes",  accent: "text-amber-300 shadow-amber-500/40" },
  ] as const;

  return (
    <div className="absolute right-4 top-1/2 z-50 -translate-y-1/2 pointer-events-none">
      <motion.div
        initial={{ x: 24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.15 }}
        className="pointer-events-auto flex flex-col items-center gap-1 rounded-[20px] border border-white/10 bg-black/55 p-2 shadow-2xl backdrop-blur-xl"
      >
        {/* Ze[meet] wordmark */}
        <p
          className="mb-0.5 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-violet-400/60"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          ze[meet]
        </p>
        <div className="h-px w-5 bg-white/10" />

        {items.map(({ id, icon: Icon, label, accent }) => {
          const isActive = activeTool === id;
          return (
            <button
              key={id}
              title={label}
              onClick={() => onToggle(id)}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200",
                isActive ? `bg-white/15 shadow-lg ${accent.split(" ")[1]}` : "hover:bg-white/10",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? accent.split(" ")[0] : "text-[#9aa0a6] group-hover:text-[#e8eaed]",
                )}
                strokeWidth={1.75}
              />
              {/* Tooltip */}
              <span className="pointer-events-none absolute right-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-[#3c4043] px-2.5 py-1.5 text-[11px] font-medium text-[#e8eaed] opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {label}
              </span>
              {isActive && (
                <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-violet-400 ring-2 ring-black/40" />
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}

// ─── Sticky Notes Panel ───────────────────────────────────────────────────────

function StickyNotesPanel({
  noteText, setNoteText, notes, onSaveNote, onClose,
}: {
  noteText: string; setNoteText: (v: string) => void;
  notes: string[]; onSaveNote: () => void; onClose: () => void;
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
      {/* Header */}
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
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-3.5 w-3.5 text-[#9aa0a6]" strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Input sticky */}
        <div
          className="relative rounded-xl bg-amber-50 p-3.5 shadow-md"
          style={{ transform: "rotate(-0.5deg)" }}
        >
          {/* Tape strip */}
          <div className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rounded-sm bg-amber-200/80 opacity-70" />
          <textarea
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Write a private note…"
            rows={3}
            className="w-full resize-none bg-transparent font-medium text-[13px] leading-relaxed text-amber-900 placeholder-amber-400/80 outline-none"
            onKeyDown={e => e.key === "Enter" && e.metaKey && onSaveNote()}
          />
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[10px] font-medium text-amber-600/70">
              Private · only visible to you
            </p>
            <button
              onClick={onSaveNote}
              disabled={!noteText.trim()}
              className="flex h-7 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-[11px] font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-40 transition-colors"
            >
              <Send className="h-2.5 w-2.5" strokeWidth={2} />
              Pin note
            </button>
          </div>
        </div>

        {/* Saved notes as sticky cards */}
        <div className="grid grid-cols-2 gap-3">
          {notes.map((note, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "relative rounded-xl p-3 shadow-md",
                NOTE_COLORS[i % NOTE_COLORS.length],
                NOTE_ROTATIONS[i % NOTE_ROTATIONS.length],
              )}
            >
              {/* Top tape strip */}
              <div className="absolute -top-2 left-1/2 h-3.5 w-8 -translate-x-1/2 rounded-sm bg-white/60 opacity-80" />
              <p className="text-[12px] font-medium leading-snug text-slate-800">{note}</p>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                {new Date(Date.now() - i * 240000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Resume Drawer ────────────────────────────────────────────────────────────

function ResumeDrawer({ onClose }: { onClose: () => void }) {
  return (
    <DrawerShell icon={FileText} title="Resume" iconColor="text-violet-400" onClose={onClose}>
      <div className="space-y-5 p-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[15px] font-bold text-white/70">
            SJ
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-[#e8eaed]">{CANDIDATE.name}</p>
            <p className="text-[12px] text-[#9aa0a6]">{CANDIDATE.role}</p>
          </div>
          <button className="ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[11px] text-[#9aa0a6] hover:text-white hover:border-white/20 transition-colors">
            <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
            PDF
          </button>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-[#9aa0a6]">
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />{CANDIDATE.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" strokeWidth={1.5} />{CANDIDATE.experience} exp.</span>
        </div>

        <Section label="Experience">
          <div className="space-y-3.5">
            {[
              { co: "Stripe",             role: "Staff Product Designer",    period: "2021–Now",  desc: "Led redesign of payments dashboard, serving 2M+ merchants globally" },
              { co: "Monzo",              role: "Senior Product Designer",   period: "2018–2021", desc: "Owned design of Monzo Business, shipped to 150K SMBs" },
              { co: "Figma (contractor)", role: "Product Design Consultant", period: "2017–2018", desc: "Contributed to early Components and Auto Layout specs" },
              { co: "IDEO",               role: "UX Designer",               period: "2015–2017", desc: "Human-centred design across fintech and healthcare" },
            ].map(exp => (
              <div key={exp.co} className="relative border-l-2 border-violet-500/30 pl-3.5">
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-violet-500/50" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[#e8eaed]">{exp.co}</p>
                  <p className="shrink-0 text-[10px] text-[#5f6368]">{exp.period}</p>
                </div>
                <p className="text-[12px] text-[#9aa0a6]">{exp.role}</p>
                <p className="mt-0.5 text-[11px] text-[#5f6368]">{exp.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Skills">
          <div className="flex flex-wrap gap-1.5">
            {CANDIDATE.skills.map(s => (
              <span key={s} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-[#c5c6c7]">
                {s}
              </span>
            ))}
          </div>
        </Section>

        <Section label="Education">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-4 w-4 shrink-0 text-[#9aa0a6]" strokeWidth={1.5} />
            <p className="text-[13px] text-[#c5c6c7]">{CANDIDATE.education}</p>
          </div>
        </Section>
      </div>
    </DrawerShell>
  );
}

// ─── LinkedIn Drawer ──────────────────────────────────────────────────────────

function LinkedInDrawer({ onClose }: { onClose: () => void }) {
  return (
    <DrawerShell icon={Linkedin} title="LinkedIn" iconColor="text-sky-400" onClose={onClose}>
      <div className="space-y-4 p-5">
        {/* Profile card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
          <div className="h-16 bg-gradient-to-r from-[#1a73e8]/25 via-violet-600/15 to-transparent" />
          <div className="px-4 pb-4">
            <div className="-mt-6 flex items-end justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1c1c1e] bg-gradient-to-br from-[#2d1b5e] to-[#0d0820] text-[14px] font-bold text-white/70">
                SJ
              </div>
              <button className="flex items-center gap-1.5 rounded-full border border-sky-500/40 px-3 py-1 text-[11px] font-semibold text-sky-400 hover:bg-sky-500/10 transition-colors">
                <ExternalLink className="h-3 w-3" strokeWidth={1.5} />
                Open profile
              </button>
            </div>
            <p className="mt-2.5 text-[14px] font-semibold text-[#e8eaed]">{CANDIDATE.name}</p>
            <p className="text-[12px] text-[#9aa0a6]">{CANDIDATE.role} · {CANDIDATE.location}</p>
            <div className="mt-2 flex gap-3 text-[11px]">
              <span className="text-sky-400">{CANDIDATE.connections} connections</span>
              <span className="text-[#5f6368]">·</span>
              <span className="text-[#5f6368]">500+ followers</span>
            </div>
          </div>
        </div>

        <Section label="About">
          <p className="text-[12px] leading-relaxed text-[#c5c6c7]">{CANDIDATE.about}</p>
        </Section>

        <Section label="Current Role">
          <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a73e8]/10 text-[12px] font-bold text-sky-400">S</div>
            <div>
              <p className="text-[13px] font-semibold text-[#e8eaed]">Staff Product Designer</p>
              <p className="text-[12px] text-[#9aa0a6]">Stripe · Full-time</p>
              <p className="text-[11px] text-[#5f6368]">Jan 2021 – Present · London</p>
            </div>
          </div>
        </Section>

        <Section label="Top Skills">
          {[
            { skill: "Figma", n: 87 },
            { skill: "Design Systems", n: 64 },
            { skill: "User Research", n: 52 },
          ].map(({ skill, n }) => (
            <div key={skill} className="flex items-center justify-between py-1.5 text-[13px]">
              <span className="text-[#c5c6c7]">{skill}</span>
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] text-[#9aa0a6]">{n} endorsements</span>
            </div>
          ))}
        </Section>
      </div>
    </DrawerShell>
  );
}

// ─── Drawer shell ─────────────────────────────────────────────────────────────

function DrawerShell({
  icon: Icon, title, iconColor, onClose, children,
}: {
  icon: React.ElementType; title: string; iconColor: string;
  onClose: () => void; children: React.ReactNode;
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
        <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <X className="h-3.5 w-3.5 text-[#9aa0a6]" strokeWidth={2} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">{label}</p>
      {children}
    </section>
  );
}

// ─── Code Meet Layout (add-on stage mode) ─────────────────────────────────────

function CodeMeetLayout(props: MeetShellProps) {
  const {
    code, setCode, codeTime,
    tests, runningTests, onRunTests,
    ratings, setRatings, hoverRating, setHoverRating,
    aiSummary, generatingAi, onGenerateAi,
    onToggleTool,
  } = props;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Compact video strip — Google Meet keeps running */}
      <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#141414] px-4 py-3">
        <VideoTile
          name={CANDIDATE.name} initials={CANDIDATE.initials}
          gradient="from-[#2a1a58] via-[#160e38] to-[#0a0618]"
          isSpeaking isMuted={false} compact
          className="h-[84px] w-[150px] shrink-0"
        />
        <VideoTile
          name={INTERVIEWER.name} initials={INTERVIEWER.initials}
          gradient="from-[#162840] via-[#0d1a2a] to-[#060e18]"
          isSpeaking={false} isMuted={false} compact
          className="h-[84px] w-[150px] shrink-0"
        />
        <div className="ml-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Call in progress
          </div>
          <p className="px-1 text-[10px] text-[#5f6368]">Participants can see your screen</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-violet-400">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Code Challenge Active
        </div>
      </div>

      {/* Code challenge panel — activity stage */}
      <div className="flex min-h-0 flex-1 overflow-hidden p-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1e1f21] shadow-2xl">

          {/* Panel header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#252628] px-5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15">
                <Code2 className="h-4 w-4 text-violet-400" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#e8eaed]">
                  Responsive Dashboard Architecture
                </p>
                <p className="text-[10px] text-[#5f6368]">Live code challenge</p>
              </div>
              <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                Medium
              </span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 font-mono text-[12px] font-semibold tabular-nums text-[#e8eaed]">
                <Clock className="h-3.5 w-3.5 text-[#9aa0a6]" strokeWidth={1.5} />
                {codeTime}
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-[#9aa0a6]">
                <Hash className="h-3 w-3" strokeWidth={1.5} />
                TypeScript
                <ChevronDown className="h-3 w-3" strokeWidth={1.5} />
              </div>
              <button
                onClick={onRunTests}
                disabled={runningTests}
                className="flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600/90 px-3 text-[12px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-70 transition-colors"
              >
                {runningTests
                  ? <RefreshCw className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
                  : <Play className="h-3.5 w-3.5" strokeWidth={2} />}
                {runningTests ? "Running…" : "Run Tests"}
              </button>
              <button className="flex h-8 items-center gap-1.5 rounded-lg bg-violet-600/80 px-3 text-[12px] font-semibold text-white hover:bg-violet-600 transition-colors">
                Submit
              </button>
              <button
                onClick={() => onToggleTool("code")}
                className="flex h-8 items-center gap-1.5 rounded-lg border border-red-500/35 bg-red-500/10 px-3 text-[12px] font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
              >
                <Square className="h-3.5 w-3.5" strokeWidth={2} />
                End
              </button>
            </div>
          </div>

          {/* Three-column workspace */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Problem panel */}
            <aside className="flex w-[240px] shrink-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#252628]">
              <div className="border-b border-white/[0.07] px-4 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">Problem</p>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 px-4 py-3.5 text-[12px]">
                <p className="leading-relaxed text-[#b0b0b0]">
                  Design a responsive dashboard layout system that adapts to multiple screen sizes with flexible widget placement and smooth breakpoint transitions.
                </p>
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">Requirements</p>
                  <ul className="space-y-1 text-[#9aa0a6]">
                    {["Grid: 1–12 columns", "Widget size constraints", "Transitions < 300ms", "Mobile-first breakpoints"].map(r => (
                      <li key={r} className="flex items-start gap-1.5">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-violet-400" strokeWidth={2} />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">Example</p>
                  <div className="rounded-lg border border-white/[0.07] bg-[#1e1f21] p-2.5">
                    <p className="text-[10px] text-[#5f6368]">Input</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#dcdcaa]">buildDashboard(widgets, 1024)</p>
                    <p className="mt-2 text-[10px] text-[#5f6368]">Output</p>
                    <p className="mt-0.5 font-mono text-[10px] text-[#4ec9b0]">12-col layout</p>
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">Constraints</p>
                  <ul className="space-y-1 text-[10px] text-[#5f6368]">
                    {["No grid libraries", "Chrome · Firefox · Safari", "< 100ms recalculation"].map(c => (
                      <li key={c} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#5f6368]" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Code editor */}
            <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-r border-white/[0.07] bg-[#1e1e1e]">
              {/* Tabs */}
              <div className="flex shrink-0 items-center border-b border-white/[0.07] bg-[#252628] px-2">
                <button className="rounded-t px-3 py-2 text-[12px] font-medium bg-[#1e1e1e] text-white">
                  solution.ts
                </button>
                <button className="px-3 py-2 text-[12px] font-medium text-[#5f6368] hover:text-[#9aa0a6]">
                  types.ts
                </button>
                <div className="ml-auto mr-3 flex items-center gap-1.5 text-[11px] text-[#9aa0a6]">
                  <Activity className="h-3 w-3 text-emerald-400" strokeWidth={1.5} />
                  Live session
                </div>
              </div>

              {/* Editor */}
              <div className="relative flex min-h-0 flex-1 overflow-hidden">
                {/* Line numbers */}
                <div className="flex w-10 shrink-0 select-none flex-col border-r border-white/[0.05] bg-[#1e1e1e] pt-4 text-right pr-2 font-mono text-[11.5px] leading-[1.65] text-[#3c3c3c]">
                  {code.split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  className="min-h-0 flex-1 resize-none bg-[#1e1e1e] px-4 pt-4 font-mono text-[12px] leading-[1.65] text-[#d4d4d4] outline-none"
                />
              </div>

              {/* Status bar */}
              <div className="flex shrink-0 items-center justify-between border-t border-white/[0.05] bg-[#007acc] px-4 py-0.5 text-[10px] text-white/80">
                <span>TypeScript · UTF-8 · Spaces: 2</span>
                <span className="text-white/60">ze[meet] Code Challenge</span>
              </div>
            </section>

            {/* Results + contextual cards */}
            <aside className="flex w-[260px] shrink-0 flex-col overflow-hidden">
              <div className="border-b border-white/[0.07] bg-[#252628] px-4 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">Results</p>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 p-4">

                {/* Test cases */}
                <div className="space-y-1.5">
                  {tests.map(t => (
                    <motion.div key={t.id} layout className="rounded-xl border border-white/[0.07] bg-[#252628] p-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          t.passed === true  && "bg-emerald-500/20 text-emerald-400",
                          t.passed === false && "bg-red-500/20 text-red-400",
                          t.passed === undefined && "bg-white/[0.06] text-[#5f6368]",
                        )}>
                          {t.passed === true  && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                          {t.passed === false && <X     className="h-2.5 w-2.5" strokeWidth={3} />}
                        </span>
                        <span className="text-[11px] font-medium text-[#c5c6c7]">{t.label}</span>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-[#5f6368]">{t.input}</p>
                    </motion.div>
                  ))}
                  <button
                    onClick={onRunTests}
                    disabled={runningTests}
                    className="mt-1 text-[11px] font-medium text-violet-400 hover:underline disabled:opacity-50"
                  >
                    {runningTests ? "Running…" : "Run all tests"}
                  </button>
                </div>

                {/* Candidate activity */}
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#5f6368]">
                    Candidate Activity
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { e: "Edited line 31",           t: fmt(Math.max(0, parseInt(codeTime.split(":")[0]) * 60 + parseInt(codeTime.split(":")[1]) - 14)) },
                      { e: "Ran tests",                t: "0:09" },
                      { e: "Added getBreakpoint()",    t: "0:05" },
                      { e: "Started challenge",        t: "0:00" },
                    ].map(({ e, t: elapsed }) => (
                      <div key={e} className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5 text-[#9aa0a6]">
                          <Circle className="h-1.5 w-1.5 fill-[#5f6368] text-[#5f6368]" />
                          {e}
                        </span>
                        <span className="font-mono text-[10px] text-[#5f6368]">{elapsed}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Contextual: Scorecard — only in code mode ── */}
                <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.05] p-3.5">
                  <div className="mb-3 flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-amber-400" strokeWidth={1.5} />
                    <p className="text-[11px] font-semibold text-[#e8eaed]">Scorecard</p>
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-violet-400/60">ze[meet]</span>
                  </div>
                  <div className="space-y-2.5">
                    {SCORECARD_SKILLS.map(skill => (
                      <div key={skill}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[11px] text-[#9aa0a6]">{skill}</span>
                          {ratings[skill] && (
                            <span className="text-[10px] text-[#5f6368]">{ratings[skill]}/5</span>
                          )}
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(star => {
                            const isHov = hoverRating?.skill === skill && (hoverRating.star ?? 0) >= star;
                            const isFill = (ratings[skill] ?? 0) >= star;
                            return (
                              <button
                                key={star}
                                onMouseEnter={() => setHoverRating({ skill, star })}
                                onMouseLeave={() => setHoverRating(null)}
                                onClick={() => setRatings({ ...ratings, [skill]: star })}
                                className="focus-visible:outline-none"
                              >
                                <Star
                                  className={cn("h-3.5 w-3.5 transition-colors",
                                    isHov || isFill ? "fill-amber-400 text-amber-400" : "fill-transparent text-[#3c3c3c]",
                                  )}
                                  strokeWidth={1.5}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Contextual: AI Insights — only in code mode ── */}
                <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.05] p-3.5">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" strokeWidth={1.5} />
                    <p className="text-[11px] font-semibold text-[#e8eaed]">AI Insights</p>
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider text-violet-400/60">ze[meet]</span>
                  </div>
                  <div className="space-y-1.5">
                    {AI_INSIGHTS.map((ins, i) => (
                      <div key={i} className={cn(
                        "flex items-start gap-2 rounded-lg border px-2.5 py-2 text-[11px] leading-snug",
                        ins.positive
                          ? "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-200/80"
                          : "border-amber-500/20 bg-amber-500/[0.07] text-amber-200/80",
                      )}>
                        <span className={cn("mt-0.5 shrink-0 text-[12px]", ins.positive ? "text-emerald-400" : "text-amber-400")}>
                          {ins.positive ? "✓" : "△"}
                        </span>
                        {ins.text}
                      </div>
                    ))}
                  </div>
                  {aiSummary ? (
                    <div className="mt-2 rounded-lg border border-violet-500/20 bg-violet-500/[0.08] p-2.5 text-[11px] leading-relaxed text-violet-200/80">
                      {aiSummary}
                    </div>
                  ) : (
                    <button
                      onClick={onGenerateAi}
                      disabled={generatingAi}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-violet-500/25 bg-violet-500/10 py-2 text-[11px] font-semibold text-violet-300 hover:bg-violet-500/18 disabled:opacity-60 transition-colors"
                    >
                      {generatingAi
                        ? <RefreshCw className="h-3 w-3 animate-spin" strokeWidth={2} />
                        : <Wand2 className="h-3 w-3" strokeWidth={1.75} />}
                      {generatingAi ? "Generating…" : "Generate AI Summary"}
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
