import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import type { HireRecommendation } from "@/lib/hiring/interviewFeedback";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/hiring/StatusBadge";
import { HiringPageHeader } from "@/components/hiring/HiringPageHeader";
import { HiringHeroTexture } from "@/components/hiring/HiringHeroTexture";
import { JobCard } from "@/components/hiring/JobCard";
import { CandidateReportCard } from "@/components/hiring/CandidateReportCard";
import { JobsOperationalHero } from "@/components/hiring/JobsOperationalHero";
import { InterviewStatusChip } from "@/components/hiring/interview-kanban/InterviewStatusChip";
import { FeedbackStatusBadge } from "@/components/hiring/applicants/feedback/FeedbackStatusBadge";
import {
  CompletionProgress,
  RecommendationPills,
  SidebarCard,
  StarRating,
} from "@/components/hiring/applicants/feedback/FeedbackUi";
import { CandidateReportOverview } from "@/components/hiring/applicants/CandidateReportOverview";
import { EmailFeed } from "@/components/hiring/applicants/EmailFeed";
import { KanbanMoveConfirmDialog } from "@/components/hiring/KanbanMoveConfirmDialog";
import { dashboardCanvasDecorator } from "./decorators";
import {
  mockCandidate,
  mockCandidateProfile,
  mockFeedbackBundle,
  mockHiringOverview,
  mockJob,
} from "./mocks";

const meta = {
  title: "Ze[code]/Hiring",
  decorators: [dashboardCanvasDecorator],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="Published" />
      <StatusBadge status="Draft" />
      <StatusBadge status="On Hold" />
      <StatusBadge status="Closed" />
    </div>
  ),
};

export const InterviewStatusChips: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <InterviewStatusChip status="Scheduled" />
      <InterviewStatusChip status="Ongoing" />
      <InterviewStatusChip status="Feedback Pending" />
      <InterviewStatusChip status="Completed" />
    </div>
  ),
};

export const FeedbackStatusBadgeStory: Story = {
  name: "Feedback status badge",
  render: () => <FeedbackStatusBadge bundle={mockFeedbackBundle()} />,
};

export const FeedbackUiKit: Story = {
  name: "Feedback UI kit",
  render: function FeedbackUiStory() {
    const [rec, setRec] = useState<HireRecommendation | null>("lean_hire");
    const [rating, setRating] = useState(4);
    return (
      <div className="grid max-w-lg gap-4">
        <SidebarCard title="Recommendation" subtitle="Panel signal">
          <RecommendationPills value={rec} onChange={setRec} compact />
        </SidebarCard>
        <SidebarCard title="Ratings">
          <StarRating label="Overall" value={rating} onChange={setRating} />
          <div className="mt-4">
            <CompletionProgress value={62} />
          </div>
        </SidebarCard>
      </div>
    );
  },
};

export const PageHeader: Story = {
  render: () => (
    <HiringPageHeader
      title="Staff Product Designer"
      subtitle="Berlin · Hybrid · Marcus Chen"
      backHref="/hiring/jobs"
      action={<Button size="sm">Add candidate</Button>}
    />
  ),
};

export const HeroTexture: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [],
  render: () => (
    <div className="relative h-48 overflow-hidden rounded-2xl">
      <HiringHeroTexture />
    </div>
  ),
};

export const JobsHero: Story = {
  name: "Jobs operational hero",
  parameters: { layout: "fullscreen" },
  decorators: [],
  render: () => (
    <JobsOperationalHero stats={mockHiringOverview} onAddJob={() => undefined} />
  ),
};

export const JobCardStory: Story = {
  name: "Job card",
  render: () => (
    <div className="max-w-md">
      <JobCard job={mockJob} />
    </div>
  ),
};

export const CandidateReportCardStory: Story = {
  name: "Candidate report card",
  render: () => (
    <div className="max-w-lg">
      <CandidateReportCard candidate={mockCandidate} />
    </div>
  ),
};

export const CandidateReportOverviewStory: Story = {
  name: "Candidate report overview",
  parameters: { layout: "fullscreen" },
  decorators: [],
  render: () => (
    <div className="bg-[rgb(var(--app-bg-rgb))] p-6">
      <CandidateReportOverview
        candidate={mockCandidate}
        job={mockJob}
        profile={mockCandidateProfile}
        onCandidateUpdated={() => undefined}
      />
    </div>
  ),
};

export const EmailFeedStory: Story = {
  name: "Email feed",
  render: () => (
    <div className="max-w-xl">
      <EmailFeed emails={mockCandidate.emails} />
    </div>
  ),
};

export const KanbanMoveDialog: Story = {
  render: function KanbanDialog() {
    const [open, setOpen] = useState(true);
    return (
      <KanbanMoveConfirmDialog
        open={open}
        onOpenChange={setOpen}
        candidate={mockCandidate}
        targetColumnTitle="Design review"
        onConfirm={() => setOpen(false)}
      />
    );
  },
};
