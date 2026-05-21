/** ZeMeet room id + URL helpers — tied to candidate + interview round */

export function buildZeMeetRoomId(candidateId: string, roundTitle: string): string {
  const slug = roundTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `zm-${candidateId}-${slug || "interview"}`;
}

/**
 * Parse zm-{candidateId}-{roundSlug} where both ids may contain hyphens.
 * When validateCandidateId is provided, picks the longest valid candidate prefix.
 */
export function parseZeMeetRoomId(
  roomId: string,
  validateCandidateId?: (id: string) => boolean,
): { candidateId: string; roundSlug: string } | null {
  if (!roomId.startsWith("zm-")) return null;
  const parts = roomId.slice(3).split("-");
  if (parts.length < 2) return null;

  let best: { candidateId: string; roundSlug: string } | null = null;

  for (let i = 1; i < parts.length; i++) {
    const candidateId = parts.slice(0, i).join("-");
    const roundSlug = parts.slice(i).join("-");
    if (!candidateId || !roundSlug) continue;

    if (!validateCandidateId) {
      return { candidateId, roundSlug };
    }
    if (validateCandidateId(candidateId)) {
      best = { candidateId, roundSlug };
    }
  }

  return best;
}

export function zeMeetPath(roomId: string): string {
  return `/meet/${roomId}`;
}

export function zeMeetJoinUrl(roomId: string, origin?: string): string {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}${zeMeetPath(roomId)}`;
}

/** Join URL for the candidate — opens lobby with candidate role */
export function zeMeetCandidateJoinUrl(roomId: string, origin?: string): string {
  const base = zeMeetJoinUrl(roomId, origin);
  const url = new URL(base);
  url.searchParams.set("role", "candidate");
  return url.toString();
}
