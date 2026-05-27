import { buildZeMeetRoomId, zeMeetJoinUrl } from "@/lib/zemeet/rooms";
import type { CandidateInterview } from "./types";

export const INTERVIEW_TYPE_OPTIONS = [
  "Technical",
  "HR",
  "Design",
  "Culture Fit",
  "Final",
] as const;

export type InterviewTypeOption = (typeof INTERVIEW_TYPE_OPTIONS)[number];

export const DURATION_PRESETS = [30, 45, 60, 90] as const;

export type DurationPreset = (typeof DURATION_PRESETS)[number];

export const PLATFORM_OPTIONS = [
  "Google Meet",
  "Microsoft Teams",
  "Zoom",
  "In-person",
  "Phone",
] as const;

export type PlatformOption = (typeof PLATFORM_OPTIONS)[number];

export type InterviewerAvailability = "available" | "busy" | "tentative";

export type InterviewerOption = {
  id: string;
  name: string;
  role: string;
  initials: string;
  availability: InterviewerAvailability;
  availabilityNote: string;
};

export type ScheduleInterviewForm = {
  interviewType: InterviewTypeOption;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  durationPreset: DurationPreset | "custom";
  platform: PlatformOption;
  interviewerIds: string[];
  sendCalendarInvite: boolean;
  sendReminderEmail: boolean;
  includeMeetingLink: boolean;
  notifyHiringManager: boolean;
};

export const MOCK_INTERVIEWERS: InterviewerOption[] = [
  {
    id: "elena",
    name: "Elena Hoffmann",
    role: "Hiring Manager",
    initials: "EH",
    availability: "available",
    availabilityNote: "Free this slot",
  },
  {
    id: "marcus",
    name: "Marcus Chen",
    role: "Recruiter",
    initials: "MC",
    availability: "available",
    availabilityNote: "Free this slot",
  },
  {
    id: "noah",
    name: "Noah Singh",
    role: "Engineering",
    initials: "NS",
    availability: "busy",
    availabilityNote: "In panel until 16:00",
  },
  {
    id: "raj",
    name: "Raj Mehta",
    role: "Engineering",
    initials: "RM",
    availability: "tentative",
    availabilityNote: "Conflicts possible",
  },
  {
    id: "jordan",
    name: "Jordan Lee",
    role: "Design",
    initials: "JL",
    availability: "available",
    availabilityNote: "Free this slot",
  },
  {
    id: "priya",
    name: "Priya Nair",
    role: "Coordinator",
    initials: "PN",
    availability: "available",
    availabilityNote: "Free this slot",
  },
];

export function createScheduleFormFromInterview(
  roundTitle: string,
  interview: CandidateInterview,
): ScheduleInterviewForm {
  const type = (INTERVIEW_TYPE_OPTIONS.find(
    (t) => t.toLowerCase() === (interview.interviewType ?? "").toLowerCase(),
  ) ?? inferTypeFromRound(roundTitle)) as InterviewTypeOption;

  const preset = DURATION_PRESETS.find((m) => m === interview.durationMinutes) ?? "custom";

  return {
    interviewType: type,
    title: interview.round || roundTitle,
    date: "",
    time: "14:00",
    durationMinutes: interview.durationMinutes ?? 45,
    durationPreset: preset,
    platform: "Google Meet",
    interviewerIds: interview.interviewers
      .map((name) => MOCK_INTERVIEWERS.find((i) => i.name === name)?.id)
      .filter((id): id is string => Boolean(id)),
    sendCalendarInvite: true,
    sendReminderEmail: true,
    includeMeetingLink: true,
    notifyHiringManager: false,
  };
}

export function createDefaultScheduleForm(roundTitle: string): ScheduleInterviewForm {
  return {
    interviewType: inferTypeFromRound(roundTitle),
    title: roundTitle,
    date: "",
    time: "14:00",
    durationMinutes: 45,
    durationPreset: 45,
    platform: "Google Meet",
    interviewerIds: [],
    sendCalendarInvite: true,
    sendReminderEmail: true,
    includeMeetingLink: true,
    notifyHiringManager: true,
  };
}

function inferTypeFromRound(roundTitle: string): InterviewTypeOption {
  const lower = roundTitle.toLowerCase();
  if (lower.includes("hr")) return "HR";
  if (lower.includes("design")) return "Design";
  if (lower.includes("culture")) return "Culture Fit";
  if (lower.includes("final")) return "Final";
  return "Technical";
}

export function formatSchedulePreviewDate(date: string, time: string): string {
  if (!date) return "Select date";
  try {
    const d = new Date(`${date}T${time || "12:00"}`);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function formatSchedulePreviewTime(time: string, durationMinutes: number): string {
  if (!time) return "Select time";
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h)) return time;
  const start = new Date();
  start.setHours(h, m ?? 0, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  const fmt = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });
  return `${fmt(start)} – ${fmt(end)} CET`;
}

export function buildScheduledAtLabel(date: string, time: string): string {
  if (!date) return "TBD";
  const d = new Date(`${date}T12:00:00`);
  const month = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${month} · ${time} CET`;
}

export function formToCandidateInterview(
  form: ScheduleInterviewForm,
  roundTitle: string,
  candidateId?: string,
): Omit<CandidateInterview, "id"> {
  const interviewers = form.interviewerIds
    .map((id) => MOCK_INTERVIEWERS.find((i) => i.id === id)?.name)
    .filter((n): n is string => Boolean(n));

  const roomId =
    form.includeMeetingLink && candidateId
      ? buildZeMeetRoomId(candidateId, roundTitle)
      : undefined;

  return {
    round: roundTitle,
    interviewers,
    scheduledAt: buildScheduledAtLabel(form.date, form.time),
    status: "Scheduled",
    feedbackStatus: "Pending",
    interviewType: form.interviewType,
    durationMinutes: form.durationMinutes,
    platform: "Google Meet",
    roomId,
    meetUrl: roomId ? zeMeetJoinUrl(roomId) : undefined,
    feedbackPendingCount: interviewers.length,
    hasNotes: false,
    hasRecording: false,
    hasCodeChallenge: form.interviewType === "Technical",
  };
}

export type ScheduleInterviewPayload = ScheduleInterviewForm & {
  roundTitle: string;
};
