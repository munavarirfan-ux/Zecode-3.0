"use client";

import { useState } from "react";
import { Lock, Send } from "lucide-react";
import { useZeMeet } from "@/components/zemeet/ZeMeetProvider";
import { ZeMeetCandidateInstructions } from "@/components/zemeet/lobby/ZeMeetCandidateInstructions";
import { useZeMeetTokens } from "@/components/zemeet/zemeetTokens";
import { cn } from "@/lib/utils";

export function ZeMeetSidebar() {
  const { sidebarTab, session, chat, sendChat, notes, addNote } = useZeMeet();
  const [chatDraft, setChatDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const t = useZeMeetTokens();

  if (!sidebarTab) return null;

  const tabLabel =
    sidebarTab === "participants"
      ? "Participants"
      : sidebarTab === "chat"
        ? "Chat"
        : sidebarTab === "instructions"
          ? "Instructions"
          : "Private notes";

  return (
    <aside
      className={cn(
        t.panel,
        "flex w-full shrink-0 flex-col border-l sm:w-[320px]",
        t.isLight ? "border-[rgba(15,23,42,0.08)]" : "border-white/[0.06]",
      )}
    >
      <header
        className={cn(
          "border-b px-4 py-3",
          t.isLight ? "border-[rgba(15,23,42,0.08)]" : "border-white/[0.06]",
        )}
      >
        <p className={t.label}>{tabLabel}</p>
      </header>

      {sidebarTab === "participants" ? (
        <ul className="flex-1 space-y-2 overflow-y-auto p-3">
          {session.participants.map((p) => (
            <li
              key={p.id}
              className={cn(
                "flex items-center gap-3 rounded-[10px] border px-3 py-2",
                t.isLight
                  ? "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)]"
                  : "border-white/[0.05] bg-white/[0.03]",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold",
                  t.isLight ? "bg-[rgba(15,23,42,0.06)] text-[#52525B]" : "bg-white/10 text-white/90",
                )}
              >
                {p.initials}
              </span>
              <div className="min-w-0">
                <p className={cn("truncate text-[13px] font-medium", t.isLight ? "text-[#18181B]" : "text-white/90")}>
                  {p.name}
                </p>
                <p className={cn("text-[10px] capitalize", t.isLight ? "text-[#A1A1AA]" : "text-white/45")}>
                  {p.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {sidebarTab === "instructions" ? (
        <div className="flex-1 overflow-y-auto p-4">
          <ZeMeetCandidateInstructions />
        </div>
      ) : null}

      {sidebarTab === "chat" ? (
        <>
          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {chat.length === 0 ? (
              <p className={cn("text-center text-[12px]", t.isLight ? "text-[#A1A1AA]" : "text-white/40")}>
                No messages yet
              </p>
            ) : (
              chat.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    "rounded-[10px] px-3 py-2",
                    t.isLight ? "bg-[rgba(15,23,42,0.04)]" : "bg-white/[0.04]",
                  )}
                >
                  <p className={cn("text-[10px] font-medium", t.isLight ? "text-[#A1A1AA]" : "text-white/50")}>
                    {m.authorName} · {m.at}
                  </p>
                  <p className={cn("mt-0.5 text-[13px]", t.isLight ? "text-[#18181B]" : "text-white/85")}>
                    {m.body}
                  </p>
                </li>
              ))
            )}
          </ul>
          <form
            className={cn(
              "flex gap-2 border-t p-3",
              t.isLight ? "border-[rgba(15,23,42,0.08)]" : "border-white/[0.06]",
            )}
            onSubmit={(e) => {
              e.preventDefault();
              sendChat(chatDraft);
              setChatDraft("");
            }}
          >
            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              placeholder="Message everyone…"
              className={t.input}
            />
            <button
              type="submit"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-[10px]",
                t.isLight ? "bg-[rgba(15,23,42,0.08)] text-[#18181B]" : "bg-white/10 text-white",
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </>
      ) : null}

      {sidebarTab === "notes" ? (
        <>
          <div
            className={cn(
              "flex items-center gap-2 border-b px-3 py-2 text-[10px]",
              t.isLight
                ? "border-[rgba(15,23,42,0.08)] text-amber-800"
                : "border-white/[0.06] text-amber-300/90",
            )}
          >
            <Lock className="h-3 w-3" strokeWidth={1.5} />
            Candidate cannot see these notes
          </div>
          <ul className="flex-1 space-y-2 overflow-y-auto p-3">
            {notes.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "rounded-[10px] border p-2",
                  t.isLight
                    ? "border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)]"
                    : "border-white/[0.05] bg-white/[0.03]",
                )}
              >
                {n.timestampMs != null ? (
                  <p className={cn("text-[10px] tabular-nums", t.isLight ? "text-[#A1A1AA]" : "text-white/40")}>
                    +{Math.floor(n.timestampMs / 1000)}s
                  </p>
                ) : null}
                <p
                  className={cn(
                    "mt-0.5 whitespace-pre-wrap text-[12px]",
                    t.isLight ? "text-[#52525B]" : "text-white/80",
                  )}
                >
                  {n.body}
                </p>
              </li>
            ))}
          </ul>
          <form
            className={cn(
              "border-t p-3",
              t.isLight ? "border-[rgba(15,23,42,0.08)]" : "border-white/[0.06]",
            )}
            onSubmit={(e) => {
              e.preventDefault();
              addNote(noteDraft);
              setNoteDraft("");
            }}
          >
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Quick note… supports **markdown**"
              rows={3}
              className={cn(t.input, "w-full resize-none")}
            />
            <p className={cn("mt-1 text-[10px]", t.isLight ? "text-[#A1A1AA]" : "text-white/35")}>
              Auto-saves to Candidate Report → Notes
            </p>
          </form>
        </>
      ) : null}
    </aside>
  );
}
