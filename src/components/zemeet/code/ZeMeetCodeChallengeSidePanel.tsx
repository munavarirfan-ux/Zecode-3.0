"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Send,
  Star,
  StickyNote,
} from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { cn } from "@/lib/utils";

type Tab = "overview" | "notes" | "scorecard" | "ai";

const SCORECARD_SKILLS = [
  "Technical Skills",
  "Problem Solving",
  "Communication",
  "Collaboration",
  "System Design",
];

const AI_INSIGHTS = [
  { text: "Strong React fundamentals and component design", positive: true },
  { text: "Clear communicator — asks good clarifying questions", positive: true },
  { text: "Good at explaining trade-offs", positive: true },
  { text: "Needs improvement in DP / recursion depth", positive: false },
];

const RECOMMENDATION_OPTIONS = ["Strong Hire", "Hire", "Hold", "No Hire"] as const;
type Recommendation = (typeof RECOMMENDATION_OPTIONS)[number];

const recStyle: Record<Recommendation, string> = {
  "Strong Hire": "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  Hire: "border-green-500/35 bg-green-500/12 text-green-300",
  Hold: "border-amber-500/35 bg-amber-500/12 text-amber-300",
  "No Hire": "border-red-500/35 bg-red-500/12 text-red-300",
};

const label = "text-[10px] font-semibold uppercase tracking-[0.08em] text-[#858585]";
const sectionTitle = "text-[12px] font-semibold text-[#cccccc]";

export function ZeMeetCodeChallengeSidePanel() {
  const { session, notes, addNote } = useZeMeet();
  const [tab, setTab] = useState<Tab>("overview");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [noteText, setNoteText] = useState("");
  const [hoverSkill, setHoverSkill] = useState<{ skill: string; star: number } | null>(null);

  const intel = session.context.candidateIntel;
  const candidateName = session.context.candidateName;
  const [firstName] = candidateName.split(" ");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "notes", label: "Notes" },
    { id: "scorecard", label: "Scorecard" },
    { id: "ai", label: "AI Insights" },
  ];

  function setRating(skill: string, star: number) {
    setRatings((r) => ({ ...r, [skill]: star }));
  }

  function handleAddNote() {
    if (!noteText.trim()) return;
    addNote(noteText.trim());
    setNoteText("");
  }

  const avgRating =
    Object.values(ratings).length > 0
      ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
      : null;

  return (
    <aside
      className="flex h-full w-[300px] shrink-0 flex-col border-l border-[#2d2d30] bg-[#1a1a1a] overflow-hidden"
      aria-label="ze[meet] interview intelligence"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#2d2d30] px-4 py-3">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-400/75">ze[meet]</p>
          <p className="text-[13px] font-semibold text-[#e8e8e8]">Interview Workspace</p>
        </div>
        {avgRating ? (
          <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
            <Star className="h-3 w-3 fill-amber-300" strokeWidth={0} />
            {avgRating}
          </span>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 gap-0.5 border-b border-[#2d2d30] px-2 py-1.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-[7px] px-2.5 py-1 text-[11px] font-medium transition-colors",
              tab === t.id
                ? "bg-[#2d2d30] text-[#e8e8e8]"
                : "text-[#858585] hover:text-[#cccccc]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "overview" && (
          <div className="space-y-4 p-4">
            {/* Candidate snapshot */}
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-[#252526]">
                {session.participants.find((p) => p.role === "candidate")?.avatarSrc ? (
                  <img
                    src={session.participants.find((p) => p.role === "candidate")!.avatarSrc}
                    alt={candidateName}
                    className="h-full w-full object-cover object-top"
                    draggable={false}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[15px] font-semibold text-[#cccccc]">
                    {session.participants.find((p) => p.role === "candidate")?.initials ?? "?"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-semibold text-[#e8e8e8]">{candidateName}</p>
                <p className="truncate text-[11px] text-[#858585]">
                  {intel?.experience ?? "Frontend Engineer"}
                </p>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex gap-1.5">
              {intel?.resumeUrl ? (
                <QuickLinkBtn icon={FileText} label="Resume" />
              ) : null}
              {intel?.linkedin ? (
                <QuickLinkBtn icon={Linkedin} label="LinkedIn" />
              ) : null}
              {intel?.portfolioUrl ? (
                <QuickLinkBtn icon={Github} label="GitHub" />
              ) : null}
            </div>

            {/* Skills */}
            {intel?.skills && intel.skills.length > 0 ? (
              <div>
                <p className={label}>Skills</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {intel.skills.map((s) => (
                    <span key={s} className="rounded-[5px] border border-[#3c3c3c] bg-[#252526] px-2 py-0.5 text-[11px] text-[#cccccc]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Education */}
            {intel?.education ? (
              <div>
                <p className={label}>Education</p>
                <p className="mt-1.5 text-[12px] text-[#b0b0b0]">{intel.education}</p>
              </div>
            ) : null}

            {/* Round info */}
            <div>
              <p className={label}>Round</p>
              <p className="mt-1.5 text-[12px] text-[#b0b0b0]">
                {session.context.roundTitle} · {session.context.interviewType}
              </p>
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-3 p-4">
            <div>
              <p className={sectionTitle}>Private Notes</p>
              <p className="mt-0.5 text-[11px] text-[#6a6a6a]">Only visible to you and admins</p>
            </div>

            {/* Add note */}
            <div className="rounded-[10px] border border-[#3c3c3c] bg-[#252526] p-2.5">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Quick observation…"
                rows={3}
                className="w-full resize-none bg-transparent text-[12px] text-[#cccccc] placeholder-[#555] outline-none"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                  className="inline-flex h-7 items-center gap-1.5 rounded-[7px] bg-violet-600/80 px-2.5 text-[11px] font-semibold text-white hover:bg-violet-600 disabled:opacity-40"
                >
                  <Send className="h-3 w-3" strokeWidth={2} />
                  Add note
                </button>
              </div>
            </div>

            {/* Notes list */}
            {notes.length > 0 ? (
              <div className="space-y-2">
                {notes.map((n) => (
                  <div key={n.id} className="rounded-[10px] border border-[#3c3c3c] bg-[#252526] p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] leading-relaxed text-[#cccccc]">{n.body}</p>
                      <StickyNote className="h-3.5 w-3.5 shrink-0 text-amber-400/60" strokeWidth={1.5} />
                    </div>
                    <p className="mt-1.5 text-[10px] text-[#555]">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#555]">No notes yet. Jot something down during the session.</p>
            )}
          </div>
        )}

        {tab === "scorecard" && (
          <div className="space-y-4 p-4">
            <p className={sectionTitle}>Scorecard</p>

            <div className="space-y-3">
              {SCORECARD_SKILLS.map((skill) => (
                <div key={skill}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12px] text-[#b0b0b0]">{skill}</span>
                    {ratings[skill] ? (
                      <span className="text-[11px] text-[#858585]">{ratings[skill]}/5</span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isHovered = hoverSkill?.skill === skill && (hoverSkill?.star ?? 0) >= star;
                      const isFilled = (ratings[skill] ?? 0) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverSkill({ skill, star })}
                          onMouseLeave={() => setHoverSkill(null)}
                          onClick={() => setRating(skill, star)}
                          className="focus-visible:outline-none"
                          aria-label={`Rate ${skill} ${star} out of 5`}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4 transition-colors",
                              isHovered || isFilled
                                ? "fill-amber-400 text-amber-400"
                                : "fill-transparent text-[#3c3c3c]",
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

            {/* Recommendation */}
            <div className="border-t border-[#2d2d30] pt-3">
              <p className={label}>Hiring recommendation</p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {RECOMMENDATION_OPTIONS.map((rec) => (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setRecommendation(rec === recommendation ? null : rec)}
                    className={cn(
                      "rounded-[8px] border py-2 text-[11px] font-semibold transition-colors",
                      recommendation === rec
                        ? recStyle[rec]
                        : "border-[#3c3c3c] bg-transparent text-[#858585] hover:border-[#555] hover:text-[#cccccc]",
                    )}
                  >
                    {rec}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div className="space-y-4 p-4">
            <div>
              <p className={sectionTitle}>AI Insights</p>
              <p className="mt-0.5 text-[11px] text-[#6a6a6a]">
                Based on code, communication, and session analysis
              </p>
            </div>

            <div className="space-y-2">
              {AI_INSIGHTS.map((insight, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-2.5 rounded-[10px] border p-3 text-[12px] leading-relaxed",
                    insight.positive
                      ? "border-emerald-500/20 bg-emerald-500/8 text-emerald-200/80"
                      : "border-amber-500/20 bg-amber-500/8 text-amber-200/80",
                  )}
                >
                  <span className={cn("mt-0.5 text-[14px]", insight.positive ? "text-emerald-400" : "text-amber-400")}>
                    {insight.positive ? "✓" : "△"}
                  </span>
                  {insight.text}
                </div>
              ))}
            </div>

            <div className="rounded-[10px] border border-[#3c3c3c] bg-[#252526] p-3">
              <p className={label}>Code quality signal</p>
              <p className="mt-1.5 text-[12px] text-[#b0b0b0]">
                {firstName} is writing clean, readable code with good variable naming. Optimal time complexity achieved on first attempt.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submit feedback footer */}
      <div className="shrink-0 border-t border-[#2d2d30] p-3">
        <button
          type="button"
          className="flex h-9 w-full items-center justify-center gap-2 rounded-[9px] bg-violet-600/85 text-[12px] font-semibold text-white transition-colors hover:bg-violet-600"
        >
          <Send className="h-3.5 w-3.5" strokeWidth={2} />
          Submit Feedback
        </button>
      </div>
    </aside>
  );
}

function QuickLinkBtn({
  icon: Icon,
  label: text,
}: {
  icon: typeof FileText;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#3c3c3c] bg-[#252526] px-2.5 py-1.5 text-[11px] font-medium text-[#cccccc] transition-colors hover:border-[#555] hover:text-white"
    >
      <Icon className="h-3.5 w-3.5 opacity-70" strokeWidth={1.5} />
      {text}
      <ExternalLink className="h-2.5 w-2.5 opacity-40" strokeWidth={1.5} />
    </button>
  );
}
