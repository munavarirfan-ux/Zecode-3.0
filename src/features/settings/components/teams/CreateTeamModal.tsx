"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { radixOverlay } from "@/lib/radix-motion";
import { MOCK_TEAM_MEMBERS } from "../../mock/teamsData";
import {
  settingsField,
  settingsFieldLabel,
  settingsModalShadow,
  settingsPrimaryBtn,
  settingsSecondaryBtn,
} from "../../settingsTokens";

const TEAM_COLORS = ["#7C3AED", "#2563EB", "#059669", "#DB2777", "#EA580C"];

export function CreateTeamModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: {
    name: string;
    description: string;
    lead: string;
    color: string;
    memberIds: string[];
  }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lead, setLead] = useState("");
  const [color, setColor] = useState(TEAM_COLORS[0]);
  const [memberIds, setMemberIds] = useState<string[]>([]);

  const reset = () => {
    setName("");
    setDescription("");
    setLead("");
    setColor(TEAM_COLORS[0]);
    setMemberIds([]);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const submit = () => {
    if (!name.trim()) {
      toast.error("Team name is required");
      return;
    }
    onCreate({
      name: name.trim(),
      description: description.trim(),
      lead: lead.trim() || "Unassigned",
      color,
      memberIds,
    });
    toast.success("Team created");
    handleOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-[130]", radixOverlay)} />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              "max-h-[min(90vh,600px)] w-full max-w-[440px] overflow-y-auto rounded-[20px] border border-white/60 bg-white/95 p-6 backdrop-blur-xl",
              "focus:outline-none dark:border-white/10 dark:bg-[#141416]/98",
              settingsModalShadow,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Dialog.Title className="text-[1rem] font-semibold text-text">Create team</Dialog.Title>
              <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-muted hover:bg-[rgba(15,23,42,0.04)]" aria-label="Close">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="space-y-1.5">
                <span className={settingsFieldLabel}>Team name</span>
                <input className={settingsField} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className={settingsFieldLabel}>Description</span>
                <textarea className={cn(settingsField, "min-h-[64px] py-2")} value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
              <label className="space-y-1.5">
                <span className={settingsFieldLabel}>Team lead</span>
                <select className={settingsField} value={lead} onChange={(e) => setLead(e.target.value)}>
                  <option value="">Select lead</option>
                  {MOCK_TEAM_MEMBERS.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="space-y-1.5">
                <span className={settingsFieldLabel}>Team color</span>
                <div className="flex flex-wrap gap-2">
                  {TEAM_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "h-8 w-8 rounded-full border-2 transition-transform duration-[150ms]",
                        color === c ? "scale-110 border-text" : "border-transparent",
                      )}
                      style={{ backgroundColor: c }}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <span className={settingsFieldLabel}>Assign members (optional)</span>
                <div className="max-h-32 space-y-1 overflow-y-auto rounded-[10px] border border-[rgba(15,23,42,0.08)] p-2">
                  {MOCK_TEAM_MEMBERS.filter((m) => m.status === "active").map((m) => (
                    <label key={m.id} className="flex cursor-pointer items-center gap-2 text-[12px]">
                      <input
                        type="checkbox"
                        checked={memberIds.includes(m.id)}
                        onChange={(e) => {
                          setMemberIds((ids) =>
                            e.target.checked ? [...ids, m.id] : ids.filter((id) => id !== m.id),
                          );
                        }}
                        className="accent-accent"
                      />
                      {m.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close type="button" className={settingsSecondaryBtn}>
                Cancel
              </Dialog.Close>
              <button type="button" className={settingsPrimaryBtn} onClick={submit}>
                Create team
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
