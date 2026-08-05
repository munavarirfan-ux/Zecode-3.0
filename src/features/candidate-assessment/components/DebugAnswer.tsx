"use client";

import { useMemo } from "react";
import type { AssessmentQuestion } from "@/features/candidate-assessment/types";
import { CodingAnswer } from "./CodingAnswer";

interface DebugAnswerProps {
  question: AssessmentQuestion;
}

/**
 * Debug Snippet questions reuse the coding ("backend") workspace layout.
 * The buggy code seeds the editor and the bug description is folded into the
 * problem statement so the three-column question / editor / run-test layout
 * renders identically to a coding question.
 */
export function DebugAnswer({ question }: DebugAnswerProps) {
  const mapped = useMemo<AssessmentQuestion>(() => {
    const body = question.bugDescription
      ? `${question.body}\n\nBug details: ${question.bugDescription}`
      : question.body;
    return {
      ...question,
      body,
      codeStarter: question.codeStarter ?? question.buggyCode ?? "",
    };
  }, [question]);

  return <CodingAnswer question={mapped} />;
}
