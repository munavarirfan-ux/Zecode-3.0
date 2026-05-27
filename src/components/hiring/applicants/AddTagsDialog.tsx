"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LineArtEmptyState } from "@/components/empty-states/LineArtEmptyState";
import { cn } from "@/lib/utils";
import {
  getCandidateEditProfile,
  saveCandidateTags,
  SUGGESTED_TAGS,
} from "@/lib/hiring/candidateProfile";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";

export function AddTagsDialog({
  open,
  onOpenChange,
  candidate,
  job,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate;
  job: HiringJob;
  onSaved?: (candidate: HiringCandidate) => void;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!open) return;
    const profile = getCandidateEditProfile(candidate, job);
    setTags(profile.application.tags);
    setInput("");
  }, [open, candidate, job]);

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (!t || tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setInput("");
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const handleSave = () => {
    const updated = saveCandidateTags(candidate.id, tags, candidate, job);
    if (updated) {
      toast.success("Tags updated");
      onSaved?.(updated);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent overlayClassName="z-[220]" className="z-[220] max-w-md gap-0 p-0">
        <DialogHeader className="border-b border-[rgba(15,23,42,0.06)] px-5 pb-4 pt-5">
          <DialogTitle className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Add tags</DialogTitle>
          <DialogDescription className="text-[13px]">
            Organize {candidate.name} with searchable tags for this job.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-5 py-4">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-[rgba(15,23,42,0.08)] bg-[#F4F4F5] py-0.5 pl-2.5 pr-1 text-[12px] font-medium text-[#3F3F46] dark:bg-white/[0.06]"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="rounded-full p-0.5 text-muted hover:bg-white hover:text-text"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3 w-3" strokeWidth={1.5} />
                </button>
              </span>
            ))}
            {tags.length === 0 ? (
              <LineArtEmptyState illustration="tags" message="No tags selected yet." size="sm" className="py-3" />
            ) : null}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(input);
                }
              }}
              placeholder="Type a tag and press Enter"
              className="h-9 text-[13px]"
            />
            <Button type="button" variant="outline" size="sm" className="h-9 shrink-0" onClick={() => addTag(input)}>
              Add
            </Button>
          </div>

          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted">Suggested</p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="rounded-full border border-dashed border-[rgba(15,23,42,0.12)] px-2.5 py-0.5 text-[11px] font-medium text-text-secondary hover:border-accent/30 hover:bg-accent/5 hover:text-text"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-[rgba(15,23,42,0.06)] px-5 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="default" onClick={handleSave}>
            Save tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
