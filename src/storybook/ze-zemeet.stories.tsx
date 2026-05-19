import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { ZeMeetLobby } from "@/components/zemeet/lobby/ZeMeetLobby";
import { ZeMeetTopBar } from "@/components/zemeet/room/ZeMeetTopBar";
import { ZeMeetControlBar } from "@/components/zemeet/room/ZeMeetControlBar";
import { ZeMeetEndInterviewDialog } from "@/components/zemeet/feedback/ZeMeetEndInterviewDialog";
import { ZeMeetPostInterviewFeedback } from "@/components/zemeet/feedback/ZeMeetPostInterviewFeedback";
import { FeedbackWorkspaceHeading } from "@/components/zemeet/feedback/workspace/FeedbackWorkspaceHeading";
import { FeedbackReviewHeader } from "@/components/zemeet/feedback/workspace/FeedbackReviewHeader";
import { FeedbackActionDock } from "@/components/zemeet/feedback/workspace/FeedbackActionDock";
import { FeedbackEditorialSkills } from "@/components/zemeet/feedback/workspace/FeedbackEditorialSkills";
import { FeedbackReviewSidebar } from "@/components/zemeet/feedback/workspace/FeedbackReviewSidebar";
import { HeroInterviewStickyNotes } from "@/components/zemeet/feedback/workspace/HeroInterviewStickyNotes";
import { RecommendationSegmented } from "@/components/zemeet/feedback/workspace/RecommendationSegmented";
import { AutoGrowTextarea } from "@/components/zemeet/feedback/workspace/AutoGrowTextarea";
import {
  createSkillEntry,
  type HireRecommendation,
  type InterviewerFeedbackData,
} from "@/lib/hiring/interviewFeedback";
import { zeMeetDecorator } from "./decorators";
import {
  mockInterviewContext,
  mockInterviewerData,
  mockSessionNotes,
  mockSkillEntries,
} from "./mocks";

const meta = {
  title: "ZeMeet",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lobby: Story = {
  decorators: [zeMeetDecorator({ phase: "lobby" })],
  parameters: { layout: "fullscreen" },
  render: () => <ZeMeetLobby />,
};

export const LiveTopBar: Story = {
  name: "Live · Top bar",
  decorators: [zeMeetDecorator({ phase: "live", startLive: true })],
  parameters: { layout: "fullscreen" },
  render: () => <ZeMeetTopBar />,
};

export const LiveTopBarCodeShare: Story = {
  name: "Live · Top bar (code share)",
  decorators: [zeMeetDecorator({ phase: "live", startLive: true })],
  parameters: { layout: "fullscreen" },
  render: () => <ZeMeetTopBar codeChallengeActive />,
};

export const LiveControlBar: Story = {
  name: "Live · Control bar",
  decorators: [zeMeetDecorator({ phase: "live", startLive: true })],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-[200px] flex-col justify-end pb-8">
      <ZeMeetControlBar onLeave={() => undefined} />
    </div>
  ),
};

export const LiveControlBarCode: Story = {
  name: "Live · Control bar (code)",
  decorators: [zeMeetDecorator({ phase: "live", startLive: true })],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex min-h-[200px] flex-col justify-end pb-8">
      <ZeMeetControlBar onLeave={() => undefined} codeChallengeMode />
    </div>
  ),
};

export const EndInterviewDialog: Story = {
  render: function EndDialog() {
    const [open, setOpen] = useState(true);
    return (
      <ZeMeetEndInterviewDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={() => setOpen(false)}
      />
    );
  },
};

export const FeedbackHeading: Story = {
  name: "Feedback · Heading",
  decorators: [zeMeetDecorator({ phase: "feedback", theme: "light" })],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="p-8">
      <FeedbackWorkspaceHeading />
    </div>
  ),
};

export const FeedbackHero: Story = {
  name: "Feedback · Hero header",
  decorators: [zeMeetDecorator({ phase: "feedback", theme: "light" })],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="mx-auto max-w-5xl p-8">
      <FeedbackReviewHeader
        context={mockInterviewContext}
        interviewerName="Elena Hoffmann"
        durationMinutes={42}
        saveState="saved"
        completionPercent={58}
        sessionNotes={mockSessionNotes}
      />
    </div>
  ),
};

export const FeedbackStickyNotes: Story = {
  name: "Feedback · Sticky notes",
  render: () => (
    <div className="relative h-48 max-w-md rounded-2xl bg-forest/90 p-6">
      <HeroInterviewStickyNotes notes={mockSessionNotes} />
    </div>
  ),
};

export const FeedbackSkills: Story = {
  name: "Feedback · Skill modules",
  decorators: [zeMeetDecorator({ theme: "light" })],
  parameters: { layout: "fullscreen" },
  render: function SkillsStory() {
    const [skills, setSkills] = useState(mockSkillEntries);
    return (
      <div className="mx-auto max-w-3xl p-8">
        <FeedbackEditorialSkills
          skills={skills}
          onChange={setSkills}
          onAddField={() =>
            setSkills((s) => [...s, createSkillEntry("Custom skill", { custom: true, rating: 0 })])
          }
        />
      </div>
    );
  },
};

export const FeedbackSidebar: Story = {
  name: "Feedback · Sidebar",
  decorators: [zeMeetDecorator({ theme: "light" })],
  render: function SidebarStory() {
    const [data, setData] = useState<InterviewerFeedbackData>(mockInterviewerData());
    return (
      <div className="max-w-sm">
        <FeedbackReviewSidebar
          data={data}
          onChange={setData}
          interviewId={mockInterviewContext.interviewId}
          completionPercent={58}
        />
      </div>
    );
  },
};

export const FeedbackRecommendation: Story = {
  name: "Feedback · Recommendation",
  render: function RecStory() {
    const [value, setValue] = useState<HireRecommendation | null>("lean_hire");
    return (
      <div className="max-w-xs rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4">
        <RecommendationSegmented value={value} onChange={setValue} />
      </div>
    );
  },
};

export const FeedbackActionDockStory: Story = {
  name: "Feedback · Action dock",
  render: () => (
    <div className="max-w-3xl overflow-hidden rounded-2xl border bg-white">
      <FeedbackActionDock
        saving={false}
        submitting={false}
        onSaveDraft={() => undefined}
        onSubmit={() => undefined}
      />
    </div>
  ),
};

export const FeedbackTextarea: Story = {
  name: "Feedback · Auto-grow textarea",
  render: function TextareaStory() {
    const [value, setValue] = useState("Strong systems thinking on the design review prompt.");
    return (
      <AutoGrowTextarea
        value={value}
        onChange={setValue}
        placeholder="Closing thoughts…"
        className="min-h-[80px] w-full max-w-lg rounded-xl border px-3 py-2 text-sm"
      />
    );
  },
};

export const PostInterviewWorkspace: Story = {
  name: "Post-interview · Full workspace",
  decorators: [zeMeetDecorator({ phase: "feedback", theme: "light" })],
  parameters: { layout: "fullscreen" },
  render: () => <ZeMeetPostInterviewFeedback onComplete={() => undefined} />,
};
