import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormField } from "@/components/ui/form-field";

const meta = {
  title: "Ze[code]/UI",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Buttons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button className="bg-forest hover:bg-forest/90">Forest</Button>
    </div>
  ),
};

export const FormControls: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-4">
      <FormField label="Email" htmlFor="sb-email">
        <Input id="sb-email" placeholder="name@company.com" />
      </FormField>
      <FormField label="Notes" htmlFor="sb-notes">
        <Textarea id="sb-notes" placeholder="Interview notes…" rows={3} />
      </FormField>
      <div className="flex items-center gap-2">
        <Checkbox id="sb-check" />
        <Label htmlFor="sb-check">Send confirmation email</Label>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="sb-switch">Recording enabled</Label>
        <Switch id="sb-switch" defaultChecked />
      </div>
    </div>
  ),
};

export const CardExample: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Staff Product Designer</CardTitle>
        <p className="text-sm text-text-secondary">Berlin · Hybrid · 12 candidates</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary">
          Pipeline health is strong. Two feedback forms pending after today&apos;s panels.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">
          View job
        </Button>
        <Button size="sm">Open workspace</Button>
      </CardFooter>
    </Card>
  ),
};

export const SelectAndTabs: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Select defaultValue="design">
        <SelectTrigger>
          <SelectValue placeholder="Round" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="design">Design review</SelectItem>
          <SelectItem value="tech">Technical</SelectItem>
          <SelectItem value="panel">Panel</SelectItem>
        </SelectContent>
      </Select>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-sm text-text-secondary">
          Candidate overview content
        </TabsContent>
        <TabsContent value="resume" className="text-sm text-text-secondary">
          Resume tab content
        </TabsContent>
        <TabsContent value="feedback" className="text-sm text-text-secondary">
          Feedback tab content
        </TabsContent>
      </Tabs>
      <Separator />
    </div>
  ),
};

export const DialogExample: Story = {
  render: function DialogStory() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule interview</DialogTitle>
            <DialogDescription>
              Confirm panel members and send the ZeMeet invite to the candidate.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
};
