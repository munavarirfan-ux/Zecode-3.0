"use client";

import { feedbackPageHeading, feedbackPageSubheading } from "./feedbackWorkspaceTokens";

export function FeedbackWorkspaceHeading() {
  return (
    <div className="space-y-2 pr-8 sm:pr-10">
      <h1 className={feedbackPageHeading}>Submit feedback</h1>
      <p className={feedbackPageSubheading}>
        Review your interview observations, capture skill signals, and record a hiring recommendation
        for the panel.
      </p>
    </div>
  );
}
