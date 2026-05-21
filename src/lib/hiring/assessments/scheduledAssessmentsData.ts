import { getAssessmentById } from "./assessmentStore";
import type {
  ExpiryWindowHours,
  ScheduleAssessmentFormInput,
  ScheduledAssessmentCandidate,
  ScheduledAssessmentRecord,
  ScheduledAssessmentStatus,
  ScheduledCsvCandidate,
} from "./scheduledAssessmentTypes";

export const EXPIRY_WINDOW_OPTIONS: { value: ExpiryWindowHours; label: string }[] = [
  { value: 2, label: "2 hours" },
  { value: 6, label: "6 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
];

export const CSV_TEMPLATE_HEADERS = ["name", "email", "linkedin_url"] as const;

export const CSV_TEMPLATE_CONTENT = `${CSV_TEMPLATE_HEADERS.join(",")}
Sarah Jenkins,sarah.jenkins@email.com,linkedin.com/in/sarahjenkins
Marcus Webb,marcus.webb@hire.co,linkedin.com/in/marcuswebb
Aisha Khan,aisha.khan@mail.com,
`;

function formatScheduledDisplay(dateIso: string, time24: string): { date: string; time: string } {
  const [y, m, d] = dateIso.split("-").map(Number);
  const [hh, mm] = time24.split(":").map(Number);
  const dt = new Date(y, m - 1, d, hh, mm);
  const date = dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { date, time };
}

function buildReminderLabel(instructionSent: boolean, reminderSent: boolean): string {
  if (instructionSent && reminderSent) return "Instruction sent · Reminder sent";
  if (instructionSent) return "Instruction sent · Reminder pending";
  if (reminderSent) return "Reminder sent · Instruction pending";
  return "Instruction pending · Reminder pending";
}

function enrichCandidate(
  partial: Partial<ScheduledAssessmentCandidate> & Pick<ScheduledAssessmentCandidate, "id" | "name" | "email">,
): ScheduledAssessmentCandidate {
  const instructionSent = partial.instructionSent ?? false;
  const reminderSent = partial.reminderSent ?? false;
  const assessmentStarted = partial.assessmentStarted ?? false;
  const assessmentCompleted = partial.assessmentCompleted ?? false;
  return {
    id: partial.id,
    name: partial.name,
    email: partial.email,
    linkedinUrl: partial.linkedinUrl,
    inviteStatus: partial.inviteStatus ?? "Invited",
    instructionSent,
    instructionMailStatus: partial.instructionMailStatus ?? (instructionSent ? "Sent" : "Pending"),
    reminderSent,
    reminderStatus: partial.reminderStatus ?? (reminderSent ? "Sent" : "Pending"),
    assessmentStarted,
    assessmentCompleted,
    assessmentStatus:
      partial.assessmentStatus ??
      (assessmentCompleted ? "Completed" : assessmentStarted ? "In progress" : "Not started"),
    attemptedDate: partial.attemptedDate ?? (assessmentStarted ? "May 20, 2026" : null),
    score: partial.score ?? null,
    status: partial.status ?? (assessmentCompleted ? "Completed" : "Pending"),
  };
}

function candidatesFromCsv(rows: ScheduledCsvCandidate[]): ScheduledAssessmentCandidate[] {
  return rows.map((r, i) =>
    enrichCandidate({
      id: `cand-${Date.now()}-${i}`,
      name: r.name,
      email: r.email,
      linkedinUrl: r.linkedinUrl,
      instructionSent: true,
    }),
  );
}

function seedCandidates(
  partial: Partial<ScheduledAssessmentCandidate> & Pick<ScheduledAssessmentCandidate, "id" | "name" | "email">,
): ScheduledAssessmentCandidate {
  return enrichCandidate(partial);
}

function instructionLabel(sent: boolean) {
  return sent ? "Sent" : "Pending";
}

const SEED: ScheduledAssessmentRecord[] = [
  {
    id: "sch-frontend-may24",
    assessmentId: "asm-frontend-react",
    assessmentName: "Frontend Developer Assessment",
    role: "React Developer",
    createdBy: "Marcus Chen",
    shareLink: "https://hire.zecode.io/schedule/frontend-may24",
    scheduledDate: "May 24",
    scheduledTime: "10:30 AM",
    scheduledAtIso: "2026-05-24",
    candidatesInvited: 42,
    instructionSent: true,
    instructionEmailLabel: "Sent",
    reminderSent: false,
    reminderStatusLabel: "Instruction sent · Reminder pending",
    status: "Scheduled",
    expiryWindowHours: 24,
    sendInstructionEmail: true,
    sendReminderBefore: true,
    sendExpiryReminder: true,
    emailLog: [
      { at: "May 20 · 9:00 AM", type: "instruction", detail: "Instruction email sent to 42 candidates" },
    ],
    candidates: [
      seedCandidates({ id: "c1", name: "Sarah Jenkins", email: "sarah.jenkins@email.com", linkedinUrl: "linkedin.com/in/sarahjenkins", reminderSent: false }),
      seedCandidates({ id: "c2", name: "Marcus Webb", email: "marcus.webb@hire.co", instructionSent: true, reminderSent: false }),
      seedCandidates({ id: "c3", name: "Aisha Khan", email: "aisha.khan@mail.com" }),
      seedCandidates({ id: "c4", name: "Daniel Park", email: "daniel.park@startup.com", inviteStatus: "Opened", instructionSent: true }),
      seedCandidates({ id: "c5", name: "Priya Sharma", email: "priya.sharma@email.com" }),
    ],
  },
  {
    id: "sch-backend-may26",
    assessmentId: "asm-backend-core",
    assessmentName: "Backend Systems — Core",
    role: "Backend Engineer",
    createdBy: "Alex Rivera",
    shareLink: "https://hire.zecode.io/schedule/backend-may26",
    scheduledDate: "May 26",
    scheduledTime: "2:00 PM",
    scheduledAtIso: "2026-05-26",
    candidatesInvited: 18,
    instructionSent: true,
    instructionEmailLabel: "Sent",
    reminderSent: true,
    reminderStatusLabel: "Instruction sent · Reminder sent",
    status: "Scheduled",
    expiryWindowHours: 12,
    sendInstructionEmail: true,
    sendReminderBefore: true,
    sendExpiryReminder: false,
    emailLog: [
      { at: "May 21 · 11:00 AM", type: "instruction", detail: "Instruction email sent to 18 candidates" },
      { at: "May 25 · 8:00 AM", type: "reminder", detail: "Reminder scheduled for May 26" },
    ],
    candidates: [
      seedCandidates({ id: "b1", name: "James Okonkwo", email: "j.okonkwo@corp.io" }),
      seedCandidates({ id: "b2", name: "Elena Vasquez", email: "elena.v@studio.dev", reminderSent: true }),
    ],
  },
  {
    id: "sch-sql-may18",
    assessmentId: "asm-sql-analytics",
    assessmentName: "SQL + Analytics",
    role: "Data Analyst",
    createdBy: "Jordan Lee",
    shareLink: "https://hire.zecode.io/schedule/sql-may18",
    scheduledDate: "May 18",
    scheduledTime: "9:00 AM",
    scheduledAtIso: "2026-05-18",
    candidatesInvited: 30,
    instructionSent: true,
    instructionEmailLabel: "Sent",
    reminderSent: true,
    reminderStatusLabel: "Instruction sent · Reminder sent",
    status: "Completed",
    expiryWindowHours: 48,
    sendInstructionEmail: true,
    sendReminderBefore: true,
    sendExpiryReminder: true,
    emailLog: [
      { at: "May 15 · 10:00 AM", type: "instruction", detail: "Instruction email sent to 30 candidates" },
      { at: "May 17 · 9:00 AM", type: "reminder", detail: "Reminder sent to 24 candidates" },
      { at: "May 19 · 6:00 PM", type: "expiry", detail: "Expiry notice sent" },
    ],
    candidates: [
      seedCandidates({
        id: "s1",
        name: "Noah Fischer",
        email: "noah.fischer@tech.de",
        inviteStatus: "Completed",
        assessmentStarted: true,
        assessmentCompleted: true,
        score: 78,
        status: "Completed",
        reminderSent: true,
        attemptedDate: "May 18, 2026",
      }),
    ],
  },
];

function syncRecordCounts(record: ScheduledAssessmentRecord): ScheduledAssessmentRecord {
  return {
    ...record,
    candidatesInvited: record.candidates.length,
  };
}

const store = new Map<string, ScheduledAssessmentRecord>(SEED.map((r) => [r.id, r]));

export const SCHEDULED_ASSESSMENTS_UPDATED_EVENT = "zecode-scheduled-assessments-updated";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SCHEDULED_ASSESSMENTS_UPDATED_EVENT));
  }
}

export function getScheduledAssessments(): ScheduledAssessmentRecord[] {
  return Array.from(store.values()).sort((a, b) => b.scheduledAtIso.localeCompare(a.scheduledAtIso));
}

export function getScheduledAssessmentById(id: string): ScheduledAssessmentRecord | undefined {
  return store.get(id);
}

export function addScheduledAssessment(input: ScheduleAssessmentFormInput): ScheduledAssessmentRecord {
  const assessment = getAssessmentById(input.assessmentId);
  const { date, time } = formatScheduledDisplay(input.scheduledDate, input.scheduledTime);
  const id = `sch-${Date.now()}`;
  const candidates = candidatesFromCsv(input.candidates);
  const instructionSent = input.sendInstructionEmail;

  const record: ScheduledAssessmentRecord = {
    id,
    assessmentId: input.assessmentId,
    assessmentName: assessment?.name ?? "Assessment",
    role: assessment?.role ?? "—",
    createdBy: assessment?.createdBy ?? "You",
    shareLink: assessment?.shareLink ?? `https://hire.zecode.io/schedule/${id}`,
    scheduledDate: date,
    scheduledTime: time,
    scheduledAtIso: input.scheduledDate,
    candidatesInvited: candidates.length,
    instructionSent,
    instructionEmailLabel: instructionLabel(instructionSent),
    reminderSent: false,
    reminderStatusLabel: buildReminderLabel(instructionSent, false),
    status: "Scheduled",
    expiryWindowHours: input.expiryWindowHours,
    sendInstructionEmail: input.sendInstructionEmail,
    sendReminderBefore: input.sendReminderBefore,
    sendExpiryReminder: input.sendExpiryReminder,
    emailLog: instructionSent
      ? [
          {
            at: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
            type: "instruction",
            detail: `Instruction email sent to ${candidates.length} candidates`,
          },
        ]
      : [],
    candidates,
  };

  store.set(id, record);
  notify();
  return record;
}

export function parseCandidatesCsv(text: string): { candidates: ScheduledCsvCandidate[]; errors: string[] } {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return { candidates: [], errors: ["CSV must include a header row and at least one candidate."] };
  }

  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const nameIdx = header.indexOf("name");
  const emailIdx = header.indexOf("email");
  const linkedinIdx = header.indexOf("linkedin_url");

  if (nameIdx === -1 || emailIdx === -1) {
    return { candidates: [], errors: ["CSV must include name and email columns."] };
  }

  const candidates: ScheduledCsvCandidate[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const name = cols[nameIdx];
    const email = cols[emailIdx];
    if (!name || !email) {
      errors.push(`Row ${i + 1}: missing name or email`);
      continue;
    }
    const linkedinUrl = linkedinIdx >= 0 ? cols[linkedinIdx] || undefined : undefined;
    candidates.push({ name, email, linkedinUrl });
  }

  return { candidates, errors };
}

export function addScheduledCandidate(
  scheduleId: string,
  input: ScheduledCsvCandidate & { sendInstruction?: boolean },
): ScheduledAssessmentCandidate | null {
  const record = store.get(scheduleId);
  if (!record) return null;
  const send = input.sendInstruction ?? true;
  const candidate = enrichCandidate({
    id: `cand-${Date.now()}`,
    name: input.name,
    email: input.email,
    linkedinUrl: input.linkedinUrl,
    instructionSent: send,
  });
  const next = syncRecordCounts({ ...record, candidates: [...record.candidates, candidate] });
  store.set(scheduleId, next);
  notify();
  return candidate;
}

export function addScheduledCandidatesBulk(
  scheduleId: string,
  rows: ScheduledCsvCandidate[],
): number {
  const record = store.get(scheduleId);
  if (!record) return 0;
  const added = rows.map((r, i) =>
    enrichCandidate({
      id: `cand-bulk-${Date.now()}-${i}`,
      name: r.name,
      email: r.email,
      linkedinUrl: r.linkedinUrl,
      instructionSent: true,
    }),
  );
  const next = syncRecordCounts({ ...record, candidates: [...record.candidates, ...added] });
  store.set(scheduleId, next);
  notify();
  return added.length;
}

export function removeScheduledCandidate(scheduleId: string, candidateId: string): boolean {
  const record = store.get(scheduleId);
  if (!record) return false;
  const next = syncRecordCounts({
    ...record,
    candidates: record.candidates.filter((c) => c.id !== candidateId),
  });
  store.set(scheduleId, next);
  notify();
  return true;
}

export function statusPillClass(status: ScheduledAssessmentStatus): string {
  switch (status) {
    case "Live":
      return "border-emerald-500/15 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300";
    case "Completed":
      return "border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.03)] text-text-secondary/80";
    case "Expired":
      return "border-red-400/15 bg-red-500/[0.06] text-red-800 dark:text-red-300";
    default:
      return "border-[rgb(var(--accent-rgb)/0.2)] bg-[rgb(var(--accent-rgb)/0.08)] text-[rgb(var(--accent-rgb))]";
  }
}
