import type { AssessmentFormDraft, AssessmentRecord } from "./types";
import { SEED_ASSESSMENTS } from "./mockAssessments";

const store = new Map<string, AssessmentRecord>(SEED_ASSESSMENTS.map((a) => [a.id, a]));

export const ASSESSMENTS_UPDATED_EVENT = "zecode-assessments-updated";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ASSESSMENTS_UPDATED_EVENT));
  }
}

export function getAllAssessments(): AssessmentRecord[] {
  return Array.from(store.values()).sort((a, b) => b.createdOn.localeCompare(a.createdOn));
}

export function getAssessmentById(id: string): AssessmentRecord | undefined {
  return store.get(id);
}

export function upsertAssessment(record: AssessmentRecord): AssessmentRecord {
  store.set(record.id, record);
  notify();
  return record;
}

export function deleteAssessment(id: string): boolean {
  const ok = store.delete(id);
  if (ok) notify();
  return ok;
}

export function duplicateAssessment(id: string): AssessmentRecord | null {
  const source = store.get(id);
  if (!source) return null;
  const copy: AssessmentRecord = {
    ...source,
    id: `asm-${Date.now()}`,
    name: `${source.name} (Copy)`,
    status: "Draft",
    enabled: false,
    invited: 0,
    notStarted: 0,
    evaluated: 0,
    qualified: 0,
    createdOn: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    shareLink: `https://hire.zecode.io/a/${Date.now()}`,
    config: {
      ...source.config,
      name: `${source.name} (Copy)`,
      selectedQuestions: source.config.selectedQuestions.map((q) => ({
        ...q,
        id: `sel-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    },
  };
  store.set(copy.id, copy);
  notify();
  return copy;
}

export function setAssessmentEnabled(id: string, enabled: boolean): AssessmentRecord | null {
  const a = store.get(id);
  if (!a) return null;
  const next = { ...a, enabled };
  store.set(id, next);
  notify();
  return next;
}

function formatCreatedOn(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildAssessmentRecord(
  draft: AssessmentFormDraft,
  status: AssessmentRecord["status"],
  enabled: boolean,
): AssessmentRecord {
  const id = `asm-${Date.now()}`;
  return {
    id,
    name: draft.name.trim() || "Untitled assessment",
    role: draft.role.trim() || "—",
    createdBy: "Marcus Chen",
    createdOn: formatCreatedOn(),
    invited: 0,
    notStarted: 0,
    evaluated: 0,
    qualified: 0,
    status,
    enabled,
    shareLink: `https://hire.zecode.io/a/${id}`,
    config: { ...draft, name: draft.name.trim() || "Untitled assessment" },
  };
}

export function saveAssessmentDraft(draft: AssessmentFormDraft): AssessmentRecord {
  const record = buildAssessmentRecord(draft, "Draft", false);
  store.set(record.id, record);
  notify();
  return record;
}

export function publishAssessment(draft: AssessmentFormDraft): AssessmentRecord {
  const record = buildAssessmentRecord(draft, "Ongoing", true);
  store.set(record.id, record);
  notify();
  return record;
}
