import { CODE_CHALLENGE_SYNC_PREFIX } from "./codeChallenge";
import type { ZeMeetCodeChallenge } from "./types";

export type CodeChallengeSyncPayload = {
  challenge: ZeMeetCodeChallenge;
  updatedAt: number;
  notifyInterviewer?: string;
};

export const CODE_CHALLENGE_SYNC_EVENT = "zemeet-challenge-sync";

export function challengeSyncStorageKey(roomId: string): string {
  return `${CODE_CHALLENGE_SYNC_PREFIX}${roomId}`;
}

export function publishCodeChallengeSync(roomId: string, payload: CodeChallengeSyncPayload): void {
  if (typeof window === "undefined") return;
  try {
    const key = challengeSyncStorageKey(roomId);
    localStorage.setItem(key, JSON.stringify(payload));
    window.dispatchEvent(
      new CustomEvent(CODE_CHALLENGE_SYNC_EVENT, {
        detail: { roomId, ...payload },
      }),
    );
  } catch {
    /* ignore */
  }
}

export function readCodeChallengeSync(roomId: string): CodeChallengeSyncPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(challengeSyncStorageKey(roomId));
    if (!raw) return null;
    return JSON.parse(raw) as CodeChallengeSyncPayload;
  } catch {
    return null;
  }
}

export function clearCodeChallengeNotify(roomId: string): void {
  const current = readCodeChallengeSync(roomId);
  if (!current?.notifyInterviewer) return;
  publishCodeChallengeSync(roomId, { ...current, notifyInterviewer: undefined });
}
