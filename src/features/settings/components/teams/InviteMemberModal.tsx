"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { radixOverlay } from "@/lib/radix-motion";
import {
  getRolePermissionPreview,
  WORKSPACE_MEMBER_ROLES,
  type WorkspaceMemberRole,
} from "../../lib/settingsRolePermissions";
import { MOCK_TEAMS } from "../../mock/teamsData";
import {
  settingsField,
  settingsFieldLabel,
  settingsModalShadow,
  settingsPrimaryBtn,
  settingsSecondaryBtn,
} from "../../settingsTokens";

export function InviteMemberModal({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (payload: {
    name: string;
    email: string;
    role: WorkspaceMemberRole;
    team: string;
    message?: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WorkspaceMemberRole>("recruiter");
  const [team, setTeam] = useState(MOCK_TEAMS[0]?.name ?? "");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const preview = useMemo(() => getRolePermissionPreview(role), [role]);

  const reset = () => {
    setName("");
    setEmail("");
    setRole("recruiter");
    setTeam(MOCK_TEAMS[0]?.name ?? "");
    setMessage("");
    setSent(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const submit = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    onInvite({ name: name.trim(), email: email.trim(), role, team, message: message.trim() || undefined });
    setSent(true);
    toast.success("Invite sent");
  };

  const inviteLink = `https://zecode.live/join?email=${encodeURIComponent(email)}&role=${role}`;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={cn("fixed inset-0 z-[130]", radixOverlay)} />
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <Dialog.Content
            className={cn(
              "max-h-[min(90vh,640px)] w-full max-w-[480px] overflow-y-auto rounded-[20px] border border-white/60 bg-white/95 p-6 backdrop-blur-xl",
              "focus:outline-none dark:border-white/10 dark:bg-[#141416]/98",
              settingsModalShadow,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Dialog.Title className="text-[1rem] font-semibold text-text">Invite member</Dialog.Title>
              <Dialog.Close className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-muted hover:bg-[rgba(15,23,42,0.04)]" aria-label="Close">
                <X className="h-4 w-4" />
              </Dialog.Close>
            </div>

            {sent ? (
              <div className="mt-6 text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <Check className="h-5 w-5" />
                </span>
                <p className="mt-3 text-[13px] text-text-secondary/85">Invite pending for {email}</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent"
                  onClick={() => {
                    void navigator.clipboard.writeText(inviteLink);
                    toast.message("Invite link copied");
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy invite link
                </button>
                <Dialog.Close type="button" className={cn(settingsPrimaryBtn, "mt-6 w-full")}>
                  Done
                </Dialog.Close>
              </div>
            ) : (
              <>
                <div className="mt-5 grid gap-3">
                  <label className="space-y-1.5">
                    <span className={settingsFieldLabel}>Full name</span>
                    <input className={settingsField} value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                  <label className="space-y-1.5">
                    <span className={settingsFieldLabel}>Email</span>
                    <input type="email" className={settingsField} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
                  <label className="space-y-1.5">
                    <span className={settingsFieldLabel}>Role</span>
                    <select className={settingsField} value={role} onChange={(e) => setRole(e.target.value as WorkspaceMemberRole)}>
                      {WORKSPACE_MEMBER_ROLES.filter((r) => r.id !== "superAdmin").map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className={settingsFieldLabel}>Team</span>
                    <select className={settingsField} value={team} onChange={(e) => setTeam(e.target.value)}>
                      {MOCK_TEAMS.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1.5">
                    <span className={settingsFieldLabel}>Optional message</span>
                    <textarea
                      className={cn(settingsField, "min-h-[72px] resize-y py-2")}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Welcome to the hiring workspace…"
                    />
                  </label>
                </div>

                <div className="mt-4 rounded-[12px] border border-[rgba(15,23,42,0.06)] bg-[rgba(15,23,42,0.02)] p-3 dark:border-white/[0.06]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Can access</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {preview.map((p) => (
                      <span
                        key={p.area}
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                          p.allowed
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-[rgba(15,23,42,0.04)] text-muted line-through",
                        )}
                      >
                        {p.allowed ? "✓" : "✕"} {p.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Dialog.Close type="button" className={settingsSecondaryBtn}>
                    Cancel
                  </Dialog.Close>
                  <button type="button" className={settingsPrimaryBtn} onClick={submit}>
                    Send invite
                  </button>
                </div>
              </>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
