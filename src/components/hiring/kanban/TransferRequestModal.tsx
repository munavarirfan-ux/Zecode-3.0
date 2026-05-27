"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { HiringCandidate } from "@/lib/hiring/types";
import { HIRING_STAGES, STAGE_SUBSTAGES, type HiringStageName } from "@/lib/hiring/stages";
import { getCandidateOwner } from "@/lib/hiring/ownership";

export function TransferRequestModal({
  open,
  onOpenChange,
  candidate,
  onSubmit,
  submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: HiringCandidate | null;
  onSubmit: (payload: {
    reason: string;
    targetStage: HiringStageName;
    targetSubstage: string;
    priority: boolean;
  }) => void;
  submitting?: boolean;
}) {
  const [reason, setReason] = useState("");
  const [targetStage, setTargetStage] = useState<HiringStageName>("Screening");
  const [targetSubstage, setTargetSubstage] = useState("Shortlisted");
  const [priority, setPriority] = useState(false);

  if (!candidate) return null;
  const { ownerName } = getCandidateOwner(candidate);
  const substages = STAGE_SUBSTAGES[targetStage] ?? [];

  const valid = reason.trim().length >= 20;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setReason("");
          setPriority(false);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-md sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request transfer</DialogTitle>
          <DialogDescription>
            Ask {ownerName} to transfer {candidate.name} to your pipeline. They will be
            notified and can approve, decline, or discuss.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="space-y-2">
            <Label htmlFor="transfer-reason">Reason (min. 20 characters)</Label>
            <Textarea
              id="transfer-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why should this candidate move to your pipeline?"
              rows={4}
              className="resize-none text-sm"
            />
            <p className="text-[11px] text-muted">{reason.trim().length}/20 minimum</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Target stage</Label>
              <Select
                value={targetStage}
                onValueChange={(v) => {
                  const stage = v as HiringStageName;
                  setTargetStage(stage);
                  const subs = STAGE_SUBSTAGES[stage];
                  setTargetSubstage(subs[0] ?? "");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HIRING_STAGES.filter((s) => s !== "Rejected").map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Substage</Label>
              <Select value={targetSubstage} onValueChange={setTargetSubstage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {substages.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox checked={priority} onCheckedChange={(c) => setPriority(c === true)} />
            Mark as high priority
          </label>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!valid || submitting}
            onClick={() =>
              onSubmit({
                reason: reason.trim(),
                targetStage,
                targetSubstage,
                priority,
              })
            }
          >
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
