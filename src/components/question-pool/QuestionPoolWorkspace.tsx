"use client";

import { useMemo } from "react";
import { NewUserModuleEmptyState } from "@/components/onboarding/NewUserModuleEmptyState";
import { useRole } from "@/context/RoleContext";
import { PoolDashboard } from "@/features/question-pool/PoolDashboard";
import { shouldShowDemoWorkspaceData } from "@/lib/onboarding/workspaceMode";
import { useWorkspaceRefresh } from "@/lib/onboarding/useWorkspaceRefresh";

export function QuestionPoolWorkspace() {
  const { selectedRole } = useRole();
  const workspaceRefresh = useWorkspaceRefresh();
  const showDemo = useMemo(
    () => shouldShowDemoWorkspaceData(selectedRole),
    [selectedRole, workspaceRefresh],
  );

  if (!showDemo) {
    return (
      <div className="w-full min-w-0">
        <NewUserModuleEmptyState module="questionPool" />
      </div>
    );
  }

  return <PoolDashboard />;
}
