import type { PreviewRole } from "@/config/previewRole";
import { shouldShowDemoWorkspaceData } from "@/lib/onboarding/workspaceMode";
import { SEED_SCHEDULE_SLOT_IDS } from "./seed";
import type { ScheduleSlot } from "./types";

/** Demo / non–New User sees seed slots; fresh New User sees only slots they create. */
export function getSlotsForWorkspace(slots: ScheduleSlot[], role: PreviewRole): ScheduleSlot[] {
  if (shouldShowDemoWorkspaceData(role)) return slots;
  return slots.filter((s) => !SEED_SCHEDULE_SLOT_IDS.has(s.id));
}
