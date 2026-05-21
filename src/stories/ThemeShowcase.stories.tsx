import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

function ThemePanel({ label }: { label: string }) {
  return (
    <div className="flex min-w-[280px] flex-1 flex-col gap-3 rounded-[16px] border border-subtle bg-surface-1 p-4" data-theme={label === "Dark" ? "dark" : "light"}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-secondary">{label}</p>
      <Card className="border-subtle shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Surface card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-fg-primary">Primary body text</p>
          <p className="text-sm text-fg-secondary">Secondary supporting text</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="outline">
              Secondary
            </Button>
            <Button size="sm" variant="ghost">
              Ghost
            </Button>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="rounded-full bg-semantic-success-bg px-2 py-0.5 text-semantic-success">Success</span>
            <span className="rounded-full bg-semantic-warning-bg px-2 py-0.5 text-semantic-warning">Warning</span>
            <span className="rounded-full bg-semantic-error-bg px-2 py-0.5 text-semantic-error">Error</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const meta: Meta = {
  title: "Design System/Theme",
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj;

export const SideBySide: Story = {
  render: () => (
    <div className="space-y-6 bg-app-bg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-text">Theme QA — side by side</h2>
        <ThemeToggle />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row">
        <ThemePanel label="Light" />
        <ThemePanel label="Dark" />
      </div>
    </div>
  ),
};
