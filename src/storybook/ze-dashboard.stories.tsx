import type { Meta, StoryObj } from "@storybook/nextjs";
import { GreetingHero } from "@/components/dashboard/GreetingHero";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { OperationalMetricsStrip } from "@/components/dashboard/OperationalMetricsStrip";
import { RecentOperationalActivity } from "@/components/dashboard/RecentOperationalActivity";
import {
  AssessmentsInsightPanel,
  InterviewsInsightPanel,
  SchedulesInsightPanel,
} from "@/components/dashboard/DashboardPanels";
import { dashboardCanvasDecorator } from "./decorators";
import { mockDashboardKpis } from "./mocks";

const meta = {
  title: "Ze[code]/Dashboard",
  decorators: [dashboardCanvasDecorator],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const GreetingHeroStory: Story = {
  name: "Greeting hero",
  parameters: { layout: "fullscreen" },
  decorators: [],
  render: () => (
    <GreetingHero role="admin" name="Elena Hoffmann" organizationName="Ze[code]" />
  ),
};

export const KpiStripStory: Story = {
  name: "KPI strip",
  render: () => <KpiStrip items={mockDashboardKpis} />,
};

export const OperationalMetrics: Story = {
  render: () => <OperationalMetricsStrip items={mockDashboardKpis} />,
};

export const RecentActivity: Story = {
  render: () => <RecentOperationalActivity />,
};

export const InterviewsPanel: Story = {
  render: () => <InterviewsInsightPanel mode="enterprise" />,
};

export const AssessmentsPanel: Story = {
  render: () => <AssessmentsInsightPanel mode="enterprise" />,
};

export const SchedulesPanel: Story = {
  render: () => <SchedulesInsightPanel mode="enterprise" />,
};
