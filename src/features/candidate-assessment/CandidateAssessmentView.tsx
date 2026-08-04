"use client";

import { useState, useEffect, useCallback } from "react";
import { MOCK_ASSESSMENT } from "./mockData";
import type { AssessmentScreen } from "./types";
import { InvitationScreen } from "./components/InvitationScreen";
import { GuidelinesScreen } from "./components/GuidelinesScreen";
import { WorkspaceShell } from "./components/WorkspaceShell";
import { SectionNavigator } from "./components/SectionNavigator";
import { QuestionShell } from "./components/QuestionShell";
import { SectionOverview } from "./components/SectionOverview";
import { MCQAnswer } from "./components/MCQAnswer";
import { CodingAnswer } from "./components/CodingAnswer";
import { FrontendCodingAnswer } from "./components/FrontendCodingAnswer";
import { OpenEndedAnswer } from "./components/OpenEndedAnswer";
import { ComprehensionAnswer } from "./components/ComprehensionAnswer";
import { DatabaseAnswer } from "./components/DatabaseAnswer";
import { FillBlankAnswer } from "./components/FillBlankAnswer";
import { DebugAnswer } from "./components/DebugAnswer";
import { SubmitDialog } from "./components/SubmitDialog";
import { ConfirmationScreen } from "./components/ConfirmationScreen";

export function CandidateAssessmentView({ initialScreen }: { initialScreen?: string }) {
  const [screen, setScreen] = useState<AssessmentScreen>("invitation");
  const [currentSectionId, setCurrentSectionId] = useState(MOCK_ASSESSMENT.sections[0].id);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(MOCK_ASSESSMENT.duration * 60);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (initialScreen) {
      switch (initialScreen) {
        case "invitation": setScreen("invitation"); break;
        case "guidelines": setScreen("guidelines"); break;
        case "workspace":
        case "mcq":
        case "coding":
        case "open-ended":
        case "comprehension":
        case "database":
        case "fill-blank":
        case "debug":
          setScreen("workspace");
          if (initialScreen === "workspace") {
            const firstSection = MOCK_ASSESSMENT.sections[0];
            if (firstSection && !["coding", "database", "debug"].includes(firstSection.type)) {
              setCurrentQuestionId(firstSection.questions[0]?.id ?? null);
            }
          } else {
            const section = MOCK_ASSESSMENT.sections.find((s) => s.type === initialScreen);
            if (section) {
              setCurrentSectionId(section.id);
              if (["coding", "database", "debug"].includes(section.type)) {
                setCurrentQuestionId(null);
              } else {
                setCurrentQuestionId(section.questions[0]?.id ?? null);
              }
            }
          }
          break;
        case "submission":
          setSubmitted(true);
          break;
      }
    }
  }, [initialScreen]);

  useEffect(() => {
    if (screen !== "workspace" || submitted) return;
    const interval = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, submitted]);

  const currentSection = MOCK_ASSESSMENT.sections.find((s) => s.id === currentSectionId)!;
  const currentQuestion = currentQuestionId
    ? currentSection.questions.find((q) => q.id === currentQuestionId) ?? null
    : null;

  const handleSelectSection = useCallback((sectionId: string) => {
    const section = MOCK_ASSESSMENT.sections.find((s) => s.id === sectionId);
    setCurrentSectionId(sectionId);
    if (section && !["coding", "database", "debug"].includes(section.type)) {
      setCurrentQuestionId(section.questions[0]?.id ?? null);
    } else {
      setCurrentQuestionId(null);
    }
  }, []);

  const handleSelectQuestion = useCallback((questionId: string) => {
    const section = MOCK_ASSESSMENT.sections.find((s) =>
      s.questions.some((q) => q.id === questionId),
    );
    if (section) {
      setCurrentSectionId(section.id);
      setCurrentQuestionId(questionId);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (!currentQuestion) return;
    const idx = currentSection.questions.findIndex((q) => q.id === currentQuestion.id);
    if (idx > 0) {
      setCurrentQuestionId(currentSection.questions[idx - 1].id);
    }
  }, [currentSection, currentQuestion]);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;
    const idx = currentSection.questions.findIndex((q) => q.id === currentQuestion.id);
    if (idx < currentSection.questions.length - 1) {
      setCurrentQuestionId(currentSection.questions[idx + 1].id);
    } else {
      const sectionIdx = MOCK_ASSESSMENT.sections.findIndex((s) => s.id === currentSection.id);
      if (sectionIdx < MOCK_ASSESSMENT.sections.length - 1) {
        const nextSection = MOCK_ASSESSMENT.sections[sectionIdx + 1];
        setCurrentSectionId(nextSection.id);
        if (!["coding", "database", "debug"].includes(nextSection.type)) {
          setCurrentQuestionId(nextSection.questions[0]?.id ?? null);
        } else {
          setCurrentQuestionId(null);
        }
      } else {
        setShowSubmitDialog(true);
      }
    }
  }, [currentSection, currentQuestion]);

  const toggleReview = useCallback(() => {
    if (!currentQuestionId) return;
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestionId)) next.delete(currentQuestionId);
      else next.add(currentQuestionId);
      return next;
    });
  }, [currentQuestionId]);

  if (submitted) {
    return (
      <ConfirmationScreen
        assessmentTitle={MOCK_ASSESSMENT.title}
        onBackToPreview={() => {
          setSubmitted(false);
          setScreen("invitation");
          setTimeRemaining(MOCK_ASSESSMENT.duration * 60);
          setCurrentQuestionId(null);
          setCurrentSectionId(MOCK_ASSESSMENT.sections[0].id);
        }}
      />
    );
  }

  if (screen === "invitation") {
    return <InvitationScreen assessment={MOCK_ASSESSMENT} onProceed={() => setScreen("guidelines")} />;
  }

  if (screen === "guidelines") {
    return <GuidelinesScreen assessment={MOCK_ASSESSMENT} onStart={() => setScreen("workspace")} />;
  }

  const questionIndex = currentQuestion
    ? currentSection.questions.findIndex((q) => q.id === currentQuestion.id) + 1
    : 0;

  function renderQuestionContent() {
    if (!currentQuestion) return null;
    switch (currentQuestion.type) {
      case "mcq": return <MCQAnswer question={currentQuestion} />;
      case "coding":
        return currentQuestion.frontend
          ? <FrontendCodingAnswer question={currentQuestion} />
          : <CodingAnswer question={currentQuestion} />;
      case "open-ended": return <OpenEndedAnswer question={currentQuestion} />;
      case "comprehension": return <ComprehensionAnswer question={currentQuestion} />;
      case "database": return <DatabaseAnswer question={currentQuestion} />;
      case "fill-blank": return <FillBlankAnswer question={currentQuestion} />;
      case "debug": return <DebugAnswer question={currentQuestion} />;
      default: return null;
    }
  }

  return (
    <div className="h-full overflow-hidden">
      <WorkspaceShell
        assessment={MOCK_ASSESSMENT}
        currentSectionId={currentSectionId}
        currentQuestionId={currentQuestionId}
        timeRemaining={timeRemaining}
        markedForReview={markedForReview}
        onSelectSection={handleSelectSection}
        onSelectQuestion={handleSelectQuestion}
        onSubmitAssessment={() => setShowSubmitDialog(true)}
      >
        {currentQuestion ? (
          <QuestionShell
            question={currentQuestion}
            sectionLabel={currentSection.label}
            questionIndex={questionIndex}
            totalInSection={currentSection.questionCount}
            isMarkedForReview={markedForReview.has(currentQuestion.id)}
            onToggleReview={toggleReview}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={questionIndex > 1}
            hasNext={questionIndex < currentSection.questionCount}
          >
            {renderQuestionContent()}
          </QuestionShell>
        ) : (
          <SectionOverview
            section={currentSection}
            onSelectQuestion={handleSelectQuestion}
            sections={MOCK_ASSESSMENT.sections}
            currentSectionIndex={MOCK_ASSESSMENT.sections.findIndex((s) => s.id === currentSectionId)}
            onNavigateSection={handleSelectSection}
          />
        )}
      </WorkspaceShell>

      <SubmitDialog
        open={showSubmitDialog}
        sections={MOCK_ASSESSMENT.sections}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={() => {
          setShowSubmitDialog(false);
          setSubmitted(true);
        }}
      />
    </div>
  );
}
