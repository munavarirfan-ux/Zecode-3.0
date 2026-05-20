export type ScheduleSlotType = "booked" | "open" | "blocked";

export type WeekdayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type ScheduleSlot = {
  id: string;
  type: ScheduleSlotType;
  /** ISO date YYYY-MM-DD */
  dayKey: string;
  startMinutes: number;
  endMinutes: number;
  candidateName?: string;
  roundName?: string;
  interviewId?: string;
  reason?: string;
};

/** Simple add-slot form — one open slot per save */
export type AddSlotDraft = {
  dayKey: string;
  startMinutes: number;
  endMinutes: number;
};
