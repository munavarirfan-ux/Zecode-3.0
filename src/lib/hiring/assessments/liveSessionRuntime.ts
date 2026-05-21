import type { LiveCandidateSession } from "./liveMonitoringTypes";

type Listener = () => void;

const listeners = new Set<Listener>();
let tickGeneration = 0;

/** Mutable live sessions — cloned from seed data on first access */
const runtimeStore = new Map<string, LiveCandidateSession[]>();

function cloneSession(s: LiveCandidateSession): LiveCandidateSession {
  return {
    ...s,
    warnings: [...s.warnings],
    eventLog: s.eventLog.map((e) => ({ ...e })),
    deviceInfo: { ...s.deviceInfo },
  };
}

export function initLiveSessionStore(seed: Record<string, LiveCandidateSession[]>) {
  if (runtimeStore.size > 0) return;
  for (const [assessmentId, sessions] of Object.entries(seed)) {
    runtimeStore.set(assessmentId, sessions.map(cloneSession));
  }
}

export function subscribeLiveSessions(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  tickGeneration += 1;
  listeners.forEach((l) => l());
}

export function getLiveSessionTickGeneration(): number {
  return tickGeneration;
}

export function getRuntimeLiveCandidates(assessmentId: string): LiveCandidateSession[] {
  return runtimeStore.get(assessmentId) ?? [];
}

export function getRuntimeLiveCandidate(
  assessmentId: string,
  candidateId: string,
): LiveCandidateSession | undefined {
  return getRuntimeLiveCandidates(assessmentId).find((c) => c.id === candidateId);
}

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function mapWarningToSignal(warning: string): "Tab switch detected" | "Camera anomaly" | "Copy attempt" | "Face missing" {
  const lower = warning.toLowerCase();
  if (lower.includes("copy")) return "Copy attempt";
  if (lower.includes("camera") || lower.includes("face")) return "Camera anomaly";
  if (lower.includes("tab")) return "Tab switch detected";
  return "Tab switch detected";
}

/** Simulate live session updates for demo monitoring */
export function tickLiveSessions(): void {
  runtimeStore.forEach((sessions) => {
    sessions.forEach((s) => {
      if (s.status === "idle") return;

      if (s.remainingMinutes > 0) {
        s.remainingMinutes -= 1;
      }

      if (s.status === "live" && tickGeneration % 2 === 0 && s.currentQuestion < s.totalQuestions) {
        s.currentQuestion += 1;
        s.progressPercent = Math.min(
          99,
          Math.round((s.currentQuestion / s.totalQuestions) * 100),
        );
        s.eventLog = [
          ...s.eventLog.slice(-4),
          { at: nowTimeLabel(), message: `Advanced to question ${s.currentQuestion}` },
        ];
      }

      if (s.status === "flagged" && tickGeneration % 3 === 1 && s.warnings.length < 4) {
        const extra = ["Tab switch detected", "Copy attempt", "Camera anomaly"][
          tickGeneration % 3
        ]!;
        if (!s.warnings.some((w: string) => w.toLowerCase().includes(extra.split(" ")[0]!.toLowerCase()))) {
          s.warnings = [...s.warnings, extra];
          s.eventLog = [
            ...s.eventLog.slice(-4),
            { at: nowTimeLabel(), message: `Integrity signal: ${extra}` },
          ];
        }
      }
    });
  });
  notify();
}

export { mapWarningToSignal };
