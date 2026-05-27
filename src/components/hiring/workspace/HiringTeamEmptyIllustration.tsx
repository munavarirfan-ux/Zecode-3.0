"use client";

import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";

export function HiringTeamEmptyState({ message }: { message?: string }) {
  return (
    <LineArtEmptyState
      illustration="team"
      message={message ?? "No members assigned"}
      size="compact"
      className="flex-1 py-6"
    />
  );
}
