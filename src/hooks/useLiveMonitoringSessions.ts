"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getLiveSessionTickGeneration,
  subscribeLiveSessions,
  tickLiveSessions,
} from "@/lib/hiring/assessments/liveSessionRuntime";
import { getLiveCandidatesForAssessment } from "@/lib/hiring/assessments/liveMonitoringData";

const TICK_MS = 5000;

export function useLiveMonitoringSessions(assessmentId: string) {
  const [tick, setTick] = useState(() => getLiveSessionTickGeneration());

  useEffect(() => {
    return subscribeLiveSessions(() => setTick(getLiveSessionTickGeneration()));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => tickLiveSessions(), TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const candidates = useMemo(
    () => getLiveCandidatesForAssessment(assessmentId),
    [assessmentId, tick],
  );

  return { candidates, tick };
}
