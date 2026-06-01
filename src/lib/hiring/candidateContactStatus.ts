import type { HiringCandidate } from "./types";
import { getCandidateStage } from "./stages";

/** Two visible states only:
 *  - needs_contact: candidate in Applied/Screening with no meaningful outreach
 *  - engaged: contacted, shortlisted, or already in the pipeline
 */
export type ContactStatus = "needs_contact" | "engaged";

const STORAGE_KEY = "kerohire-contacted-candidates";
export const CONTACT_STATUS_UPDATED_EVENT = "kerohire:contact-status-updated";

export function loadContactedCandidateIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

/** Mark a candidate as engaged and persist to localStorage. */
export function markCandidateEngaged(candidateId: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = loadContactedCandidateIds();
    ids.add(candidateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
    window.dispatchEvent(new CustomEvent(CONTACT_STATUS_UPDATED_EVENT, { detail: { candidateId } }));
  } catch {
    /* ignore */
  }
}

/** Derive contact status for a candidate.
 *
 *  needs_contact — Applied or Screening stage, no outreach yet, not shortlisted
 *  engaged       — shortlisted, manually marked, has recruiter outreach, or
 *                  already in Interviews / Hired & Offers / Rejected
 */
export function getContactStatus(
  candidate: HiringCandidate,
  contactedOverrides: Set<string>,
): ContactStatus {
  const stage = getCandidateStage(candidate);

  // Interviews or later → always engaged
  if (stage !== "Applied" && stage !== "Screening") return "engaged";

  // Shortlisted candidates are active in the process → engaged
  const substage = (candidate.currentSubstage ?? "").toLowerCase();
  if (substage.includes("shortlist")) return "engaged";

  // Manually marked as engaged
  if (contactedOverrides.has(candidate.id)) return "engaged";

  // Has active recruiter outreach in engagement records
  const engagements = candidate.engagedBy ?? [];
  const hasOutreach = engagements.some(
    (e) => e.engagementType === "emailed" || e.engagementType === "scheduled",
  );
  if (hasOutreach) return "engaged";

  // Has a recruiter-initiated email
  const emails = candidate.emails ?? [];
  const hasRecruiterEmail = emails.some(
    (e) => e.type === "Recruiter" || e.type === "Follow-up",
  );
  if (hasRecruiterEmail) return "engaged";

  return "needs_contact";
}
