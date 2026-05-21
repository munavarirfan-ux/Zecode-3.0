"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  challengeFromPoolItem,
  createDefaultCodeChallenge,
  QUESTION_POOL,
} from "@/lib/zemeet/codeChallenge";
import {
  challengeSyncStorageKey,
  clearCodeChallengeNotify,
  CODE_CHALLENGE_SYNC_EVENT,
  publishCodeChallengeSync,
  readCodeChallengeSync,
  type CodeChallengeSyncPayload,
} from "@/lib/zemeet/challengeSync";
import { codeChallengeArtifactFromState, storeCodeChallengeArtifact } from "@/lib/zemeet/sync";
import type { ZeMeetTheme } from "@/lib/zemeet/theme";
import { useTheme as useHubTheme } from "@/components/ThemeProvider";
import {
  DEFAULT_DEVICE_SETTINGS,
  DEFAULT_PERMISSIONS,
  type ZeMeetChatMessage,
  type ZeMeetCodeChallenge,
  type ZeMeetDeviceSettings,
  type ZeMeetFeedbackDraft,
  type ZeMeetNoteEntry,
  type ZeMeetPermissionState,
  type ZeMeetInterviewerIntelPanel,
  type ZeMeetPhase,
  type ZeMeetSession,
} from "@/lib/zemeet/types";

export type CodeChallengeWorkspacePanel = "workspace" | "questions";

type ZeMeetContextValue = {
  session: ZeMeetSession;
  phase: ZeMeetPhase;
  setPhase: (p: ZeMeetPhase) => void;
  devices: ZeMeetDeviceSettings;
  setDevices: React.Dispatch<React.SetStateAction<ZeMeetDeviceSettings>>;
  permissions: ZeMeetPermissionState;
  setPermissions: React.Dispatch<React.SetStateAction<ZeMeetPermissionState>>;
  elapsedSeconds: number;
  isRecording: boolean;
  setRecording: (v: boolean) => void;
  sidebarTab: "participants" | "chat" | "notes" | "instructions" | null;
  setSidebarTab: (t: "participants" | "chat" | "notes" | "instructions" | null) => void;
  theme: ZeMeetTheme;
  setTheme: (theme: ZeMeetTheme) => void;
  notes: ZeMeetNoteEntry[];
  addNote: (body: string, label?: string) => void;
  chat: ZeMeetChatMessage[];
  sendChat: (body: string) => void;
  codeChallenge: ZeMeetCodeChallenge;
  sendCodeChallengeOpen: boolean;
  setSendCodeChallengeOpen: (open: boolean) => void;
  endCodeChallengeOpen: boolean;
  setEndCodeChallengeOpen: (open: boolean) => void;
  workspacePanel: CodeChallengeWorkspacePanel;
  setWorkspacePanel: (panel: CodeChallengeWorkspacePanel) => void;
  openSendCodeChallengeConfirm: () => void;
  sendCodeChallengeRequest: () => void;
  acceptCodeChallenge: () => void;
  declineCodeChallenge: () => void;
  confirmEndCodeChallenge: () => void;
  updateCandidateCode: (code: string) => void;
  updateCodeChallenge: (patch: Partial<ZeMeetCodeChallenge>) => void;
  selectPoolQuestion: (questionId: string) => void;
  setActiveFile: (fileId: string) => void;
  updateActiveFileContent: (content: string) => void;
  runCodeTests: () => void;
  submitCodeChallenge: () => void;
  toggleCandidateEditing: () => void;
  questionPool: typeof QUESTION_POOL;
  interviewerIntelPanel: ZeMeetInterviewerIntelPanel;
  toggleInterviewerIntel: (panel: "resume" | "linkedin") => void;
  feedback: ZeMeetFeedbackDraft;
  setFeedback: React.Dispatch<React.SetStateAction<ZeMeetFeedbackDraft>>;
  sessionStartedAt: number | null;
  startSession: () => void;
};

const ZeMeetContext = createContext<ZeMeetContextValue | null>(null);

export function useZeMeet() {
  const ctx = useContext(ZeMeetContext);
  if (!ctx) throw new Error("useZeMeet must be used within ZeMeetProvider");
  return ctx;
}

const emptyFeedback = (): ZeMeetFeedbackDraft => ({
  recommendation: null,
  skillRatings: {},
  summary: "",
  technicalEvaluation: "",
  cultureFit: "",
  reInterview: false,
});

export function ZeMeetProvider({
  session,
  children,
}: {
  session: ZeMeetSession;
  children: ReactNode;
}) {
  const [phase, setPhase] = useState<ZeMeetPhase>("lobby");
  const { theme, setTheme: setHubTheme } = useHubTheme();
  const [devices, setDevices] = useState(DEFAULT_DEVICE_SETTINGS);
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRecording, setRecording] = useState(false);
  const [sidebarTab, setSidebarTabState] = useState<
    "participants" | "chat" | "notes" | "instructions" | null
  >(null);

  const setSidebarTab = useCallback(
    (tab: "participants" | "chat" | "notes" | "instructions" | null) => {
      if (tab === "notes" && session.viewerRole === "candidate") return;
      setSidebarTabState(tab);
    },
    [session.viewerRole],
  );

  const setTheme = useCallback(
    (next: ZeMeetTheme) => {
      setHubTheme(next);
    },
    [setHubTheme],
  );
  const [notes, setNotes] = useState<ZeMeetNoteEntry[]>([]);
  const [chat, setChat] = useState<ZeMeetChatMessage[]>([]);
  const [codeChallenge, setCodeChallenge] = useState<ZeMeetCodeChallenge>(() =>
    createDefaultCodeChallenge(),
  );
  const [sendCodeChallengeOpen, setSendCodeChallengeOpen] = useState(false);
  const [endCodeChallengeOpen, setEndCodeChallengeOpen] = useState(false);
  const [workspacePanel, setWorkspacePanel] = useState<CodeChallengeWorkspacePanel>("workspace");
  const [interviewerIntelPanel, setInterviewerIntelPanel] =
    useState<ZeMeetInterviewerIntelPanel>("none");
  const [feedback, setFeedback] = useState<ZeMeetFeedbackDraft>(emptyFeedback);
  const sessionStartedAt = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const challengeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autosaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastChallengeSyncAt = useRef(0);
  const roomId = session.context.roomId;

  const syncChallenge = useCallback(
    (next: ZeMeetCodeChallenge, notifyInterviewer?: string) => {
      publishCodeChallengeSync(roomId, {
        challenge: next,
        updatedAt: Date.now(),
        notifyInterviewer,
      });
    },
    [roomId],
  );

  const applyChallenge = useCallback(
    (updater: (c: ZeMeetCodeChallenge) => ZeMeetCodeChallenge, notify?: string) => {
      setCodeChallenge((c) => {
        const next = updater(c);
        syncChallenge(next, notify);
        return next;
      });
    },
    [syncChallenge],
  );

  const startSession = useCallback(() => {
    sessionStartedAt.current = Date.now();
    setPhase("live");
    setRecording(session.recordingEnabled);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (sessionStartedAt.current) {
        setElapsedSeconds(Math.floor((Date.now() - sessionStartedAt.current) / 1000));
      }
    }, 1000);
  }, [session.recordingEnabled]);

  const addNote = useCallback((body: string, label?: string) => {
    if (!body.trim()) return;
    const offset = sessionStartedAt.current
      ? Date.now() - sessionStartedAt.current
      : undefined;
    const trimmedLabel = label?.trim();
    setNotes((prev) => [
      {
        id: `n-${Date.now()}`,
        body: body.trim(),
        createdAt: new Date().toISOString(),
        timestampMs: offset,
        label: trimmedLabel || undefined,
      },
      ...prev,
    ]);
  }, []);

  const sendChat = useCallback(
    (body: string) => {
      if (!body.trim()) return;
      const me = session.participants.find((p) => p.id === session.viewerId);
      setChat((prev) => [
        ...prev,
        {
          id: `c-${Date.now()}`,
          authorId: session.viewerId,
          authorName: me?.name ?? "You",
          body: body.trim(),
          at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    },
    [session],
  );

  const applySyncPayload = useCallback(
    (payload: CodeChallengeSyncPayload) => {
      if (payload.updatedAt > lastChallengeSyncAt.current) {
        lastChallengeSyncAt.current = payload.updatedAt;
      }
      setCodeChallenge(payload.challenge);
      if (
        payload.notifyInterviewer &&
        (session.viewerRole === "interviewer" || session.viewerRole === "observer")
      ) {
        toast.error(payload.notifyInterviewer);
        clearCodeChallengeNotify(roomId);
      }
    },
    [roomId, session.viewerRole],
  );

  useEffect(() => {
    const initial = readCodeChallengeSync(roomId);
    if (initial?.challenge) applySyncPayload(initial);

    function onStorage(e: StorageEvent) {
      if (e.key !== challengeSyncStorageKey(roomId) || !e.newValue) return;
      try {
        applySyncPayload(JSON.parse(e.newValue) as CodeChallengeSyncPayload);
      } catch {
        /* ignore */
      }
    }

    function onCustom(e: Event) {
      const detail = (e as CustomEvent<CodeChallengeSyncPayload & { roomId: string }>).detail;
      if (!detail || detail.roomId !== roomId) return;
      applySyncPayload(detail);
    }

    const poll = setInterval(() => {
      const sync = readCodeChallengeSync(roomId);
      if (!sync?.challenge) return;
      if (sync.updatedAt <= lastChallengeSyncAt.current) {
        if (sync.notifyInterviewer) applySyncPayload(sync);
        return;
      }
      applySyncPayload(sync);
    }, 800);

    window.addEventListener("storage", onStorage);
    window.addEventListener(CODE_CHALLENGE_SYNC_EVENT, onCustom);
    return () => {
      clearInterval(poll);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CODE_CHALLENGE_SYNC_EVENT, onCustom);
    };
  }, [roomId, applySyncPayload]);

  useEffect(() => {
    if (codeChallenge.status !== "active") {
      if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
      return;
    }
    challengeTimerRef.current = setInterval(() => {
      setCodeChallenge((c) => ({ ...c, challengeElapsedSeconds: c.challengeElapsedSeconds + 1 }));
    }, 1000);
    return () => {
      if (challengeTimerRef.current) clearInterval(challengeTimerRef.current);
    };
  }, [codeChallenge.status]);

  const openSendCodeChallengeConfirm = useCallback(() => {
    if (session.viewerRole !== "interviewer" && session.viewerRole !== "observer") return;
    if (codeChallenge.status === "active") {
      setEndCodeChallengeOpen(true);
      return;
    }
    setSendCodeChallengeOpen(true);
  }, [session.viewerRole, codeChallenge.status]);

  const sendCodeChallengeRequest = useCallback(() => {
    setSendCodeChallengeOpen(false);
    applyChallenge((c) => ({
      ...c,
      status: "invite_pending",
      finalStatus: "pending",
    }));
    sendChat("Your interviewer sent a live coding challenge request.");
    toast.success("Code challenge request sent");
  }, [applyChallenge, sendChat]);

  const acceptCodeChallenge = useCallback(() => {
    if (phase === "lobby") {
      startSession();
    }
    const startedAt = new Date().toISOString();
    applyChallenge((c) => ({
      ...c,
      status: "active",
      finalStatus: "active",
      startedAt: c.startedAt ?? startedAt,
      challengeElapsedSeconds: c.challengeElapsedSeconds || 0,
    }));
    toast.success("Code challenge started");
  }, [applyChallenge, phase, startSession]);

  const declineCodeChallenge = useCallback(() => {
    applyChallenge(
      (c) => ({
        ...c,
        status: "declined",
        finalStatus: "rejected",
        endedAt: new Date().toISOString(),
      }),
      "Candidate rejected the code challenge request.",
    );
    toast.message("Challenge declined");
  }, [applyChallenge]);

  const confirmEndCodeChallenge = useCallback(() => {
    setEndCodeChallengeOpen(false);
    setInterviewerIntelPanel("none");
    setWorkspacePanel("workspace");
    const endedAt = new Date().toISOString();
    applyChallenge((c) => {
      const next = {
        ...c,
        status: "completed" as const,
        finalStatus: "completed" as const,
        endedAt,
        durationSeconds: c.challengeElapsedSeconds || c.durationSeconds || 0,
      };
      storeCodeChallengeArtifact(
        session.context.interviewId,
        codeChallengeArtifactFromState(next),
      );
      return next;
    });
    toast.success("Code challenge ended", {
      description: "Returned to interview room · challenge saved to candidate report",
    });
  }, [applyChallenge, session.context.interviewId]);

  const toggleInterviewerIntel = useCallback((panel: "resume" | "linkedin") => {
    setInterviewerIntelPanel((current) => (current === panel ? "none" : panel));
  }, []);

  const updateCandidateCode = useCallback(
    (code: string) => {
      applyChallenge((c) => {
        const files = c.files.map((f) =>
          f.id === c.activeFileId ? { ...f, content: code } : f,
        );
        return { ...c, candidateCode: code, files, autosaveStatus: "saving" };
      });
      if (autosaveRef.current) clearTimeout(autosaveRef.current);
      autosaveRef.current = setTimeout(() => {
        applyChallenge((c) => ({ ...c, autosaveStatus: "saved" }));
      }, 600);
    },
    [applyChallenge],
  );

  const updateCodeChallenge = useCallback(
    (patch: Partial<ZeMeetCodeChallenge>) => {
      applyChallenge((c) => ({ ...c, ...patch }));
    },
    [applyChallenge],
  );

  const selectPoolQuestion = useCallback(
    (questionId: string) => {
      const item = QUESTION_POOL.find((q) => q.id === questionId);
      if (!item) return;
      applyChallenge((c) => ({ ...c, ...challengeFromPoolItem(item) }));
    },
    [applyChallenge],
  );

  const setActiveFile = useCallback(
    (fileId: string) => {
      applyChallenge((c) => {
        const file = c.files.find((f) => f.id === fileId);
        return file
          ? { ...c, activeFileId: fileId, candidateCode: file.content, language: file.language }
          : c;
      });
    },
    [applyChallenge],
  );

  const updateActiveFileContent = useCallback(
    (content: string) => {
      updateCandidateCode(content);
    },
    [updateCandidateCode],
  );

  const runCodeTests = useCallback(() => {
    applyChallenge((c) => ({
      ...c,
      consoleOutput: `> Running ${c.testCases.length} tests…\n✓ ${c.testCases[0]?.label ?? "test 1"}\n✓ refills over time\n✓ rejects when empty\n\n3/3 passed · ${new Date().toLocaleTimeString()}`,
      testCases: c.testCases.map((t) => ({ ...t, passed: true })),
    }));
    toast.success("All tests passed");
  }, [applyChallenge]);

  const submitCodeChallenge = useCallback(() => {
    if (session.viewerRole !== "candidate") return;
    runCodeTests();
    toast.success("Solution submitted to interviewer");
  }, [session.viewerRole, runCodeTests]);

  const toggleCandidateEditing = useCallback(() => {
    applyChallenge((c) => ({
      ...c,
      candidateEditingEnabled: !c.candidateEditingEnabled,
    }));
  }, [applyChallenge]);

  const value = useMemo(
    () => ({
      session,
      phase,
      setPhase,
      devices,
      setDevices,
      permissions,
      setPermissions,
      elapsedSeconds,
      isRecording,
      setRecording,
      sidebarTab,
      setSidebarTab,
      theme,
      setTheme,
      notes,
      addNote,
      chat,
      sendChat,
      codeChallenge,
      sendCodeChallengeOpen,
      setSendCodeChallengeOpen,
      endCodeChallengeOpen,
      setEndCodeChallengeOpen,
      workspacePanel,
      setWorkspacePanel,
      openSendCodeChallengeConfirm,
      sendCodeChallengeRequest,
      acceptCodeChallenge,
      declineCodeChallenge,
      confirmEndCodeChallenge,
      updateCandidateCode,
      updateCodeChallenge,
      selectPoolQuestion,
      setActiveFile,
      updateActiveFileContent,
      runCodeTests,
      submitCodeChallenge,
      toggleCandidateEditing,
      questionPool: QUESTION_POOL,
      interviewerIntelPanel,
      toggleInterviewerIntel,
      feedback,
      setFeedback,
      sessionStartedAt: sessionStartedAt.current,
      startSession,
    }),
    [
      session,
      phase,
      devices,
      permissions,
      elapsedSeconds,
      isRecording,
      sidebarTab,
      theme,
      notes,
      addNote,
      chat,
      sendChat,
      codeChallenge,
      sendCodeChallengeOpen,
      endCodeChallengeOpen,
      workspacePanel,
      openSendCodeChallengeConfirm,
      sendCodeChallengeRequest,
      acceptCodeChallenge,
      declineCodeChallenge,
      confirmEndCodeChallenge,
      updateCandidateCode,
      updateCodeChallenge,
      selectPoolQuestion,
      setActiveFile,
      updateActiveFileContent,
      runCodeTests,
      submitCodeChallenge,
      toggleCandidateEditing,
      interviewerIntelPanel,
      toggleInterviewerIntel,
      feedback,
      startSession,
    ],
  );

  return <ZeMeetContext.Provider value={value}>{children}</ZeMeetContext.Provider>;
}
