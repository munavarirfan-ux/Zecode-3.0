"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRole } from "@/context/RoleContext";
import type { PreviewRole } from "@/config/previewRole";
import {
  getNotificationsSnapshot,
  markFeedbackNotificationRead,
  subscribeFeedbackNotifications,
  type FeedbackNotificationsSnapshot,
} from "@/lib/hiring/feedbackNotifications";
import {
  getTransferNotificationsSnapshot,
  markTransferNotificationRead,
  subscribeTransferNotifications,
  type TransferNotification,
  type TransferNotificationsSnapshot,
} from "@/lib/hiring/transferNotifications";
import {
  getMoveToInterviewSnapshot,
  markMoveToInterviewNotificationRead,
  subscribeMoveToInterviewStore,
  type MoveToInterviewSnapshot,
} from "@/lib/hiring/moveToInterviewApproval";
import { TransferRequestReviewDialog } from "@/components/hiring/applicants/TransferRequestReviewDialog";
import { OwnershipTransferReviewDialog } from "@/components/hiring/kanban/OwnershipTransferReviewDialog";
import { cn } from "@/lib/utils";

const EMPTY_FEEDBACK: FeedbackNotificationsSnapshot = {
  version: 0,
  notifications: [],
  unread: 0,
};

const EMPTY_TRANSFER: TransferNotificationsSnapshot = {
  version: 0,
  notifications: [],
  unread: 0,
};

const EMPTY_MTI: MoveToInterviewSnapshot = {
  version: 0,
  notifications: [],
  unread: 0,
};

function useFeedbackNotifications(role: PreviewRole) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeFeedbackNotifications(onStoreChange),
    [],
  );
  const getSnapshot = useCallback(() => getNotificationsSnapshot(role), [role]);
  const getServerSnapshot = useCallback(() => EMPTY_FEEDBACK, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function useTransferNotifications(role: PreviewRole) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeTransferNotifications(onStoreChange),
    [],
  );
  const getSnapshot = useCallback(() => getTransferNotificationsSnapshot(role), [role]);
  const getServerSnapshot = useCallback(() => EMPTY_TRANSFER, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function useMoveToInterviewNotifications(role: PreviewRole) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeMoveToInterviewStore(onStoreChange),
    [],
  );
  const getSnapshot = useCallback(() => getMoveToInterviewSnapshot(role), [role]);
  const getServerSnapshot = useCallback(() => EMPTY_MTI, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function TransferNotificationBody({ n }: { n: TransferNotification }) {
  if (n.kind === "transfer_request") {
    return (
      <p className="mt-1 text-[12px] leading-relaxed text-[#52525B]">
        <strong>{n.requestedBy}</strong> requested to move <strong>{n.candidateName}</strong>
        <br />
        <span className="text-[#71717A]">
          {n.fromJobTitle} → {n.toJobTitle}
        </span>
      </p>
    );
  }
  if (n.kind === "ownership_transfer_request") {
    return (
      <p className="mt-1 text-[12px] leading-relaxed text-[#52525B]">
        {n.body}
        <br />
        <span className="text-[#71717A]">
          {n.fromJobTitle} → {n.toJobTitle}
        </span>
      </p>
    );
  }
  return <p className="mt-1 text-[12px] leading-relaxed text-[#52525B]">{n.body}</p>;
}

export function FeedbackNotificationsMenu() {
  const { selectedRole } = useRole();
  const feedback = useFeedbackNotifications(selectedRole);
  const transfer = useTransferNotifications(selectedRole);
  const mti = useMoveToInterviewNotifications(selectedRole);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRequestId, setReviewRequestId] = useState<string | null>(null);
  const [ownershipReviewOpen, setOwnershipReviewOpen] = useState(false);
  const [ownershipReviewId, setOwnershipReviewId] = useState<string | null>(null);

  const unread = feedback.unread + transfer.unread + mti.unread;
  const hasAny = feedback.notifications.length > 0 || transfer.notifications.length > 0 || mti.notifications.length > 0;

  function openTransferReview(n: TransferNotification) {
    markTransferNotificationRead(n.id);
    if (n.kind === "ownership_transfer_request") {
      setOwnershipReviewId(n.transferRequestId);
      setOwnershipReviewOpen(true);
      return;
    }
    if (n.kind === "transfer_request") {
      setReviewRequestId(n.transferRequestId);
      setReviewOpen(true);
    }
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="relative h-8 w-8 rounded-[10px] border-[rgba(15,23,42,0.05)] bg-transparent px-0"
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
          >
            <Bell className="h-4 w-4 text-text" strokeWidth={1.5} />
            {unread > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex h-2 min-w-[8px] items-center justify-center rounded-full bg-accent ring-2 ring-surface" />
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[min(100vw-2rem,380px)] p-0">
          <div className="border-b border-[rgba(15,23,42,0.06)] px-3 py-2.5">
            <p className="text-[13px] font-semibold text-[#18181B]">Notifications</p>
            {selectedRole === "superAdmin" ? (
              <p className="mt-0.5 text-[11px] text-[#71717A]">
                Job and ownership transfer requests appear here.
              </p>
            ) : null}
          </div>
          {!hasAny ? (
            <p className="px-3 py-6 text-center text-[12px] text-[#71717A]">No notifications yet.</p>
          ) : (
            <ul className="max-h-[min(400px,55vh)] overflow-y-auto p-1.5" role="list">
              {transfer.notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-lg px-2.5 py-2.5 text-left transition-colors",
                      "hover:bg-[rgba(15,23,42,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
                      !n.read && "bg-forest/[0.04]",
                    )}
                    onClick={() => openTransferReview(n)}
                  >
                    <p className="text-[12px] font-semibold text-[#18181B]">{n.title}</p>
                    <TransferNotificationBody n={n} />
                    {n.kind === "transfer_request" || n.kind === "ownership_transfer_request" ? (
                      <span className="mt-2 inline-flex text-[11px] font-medium text-forest">
                        Review request →
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
              {feedback.notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-lg px-2.5 py-2.5 text-left transition-colors",
                      "hover:bg-[rgba(15,23,42,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
                      !n.read && "bg-accent/[0.04]",
                    )}
                    onClick={() => markFeedbackNotificationRead(n.id)}
                  >
                    <p className="text-[12px] font-semibold text-[#18181B]">{n.title}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#52525B]">
                      Please submit interview feedback for: <strong>{n.candidateName}</strong>
                    </p>
                    <dl className="mt-2 space-y-0.5 text-[11px] text-[#71717A]">
                      <div>
                        <span className="font-medium">Role: </span>
                        {n.roleTitle}
                      </div>
                      <div>
                        <span className="font-medium">Round: </span>
                        {n.round}
                      </div>
                    </dl>
                    <span className="mt-2 inline-flex text-[11px] font-medium text-accent">{n.ctaLabel} →</span>
                  </button>
                </li>
              ))}
              {mti.notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-lg px-2.5 py-2.5 text-left transition-colors",
                      "hover:bg-[rgba(15,23,42,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/25",
                      !n.read && "bg-amber-500/[0.04]",
                    )}
                    onClick={() => markMoveToInterviewNotificationRead(n.id)}
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#18181B]">{n.title}</p>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-[#52525B]">{n.body}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </PopoverContent>
      </Popover>

      <TransferRequestReviewDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        requestId={reviewRequestId}
        onResolved={() => {
          setReviewRequestId(null);
        }}
      />
      <OwnershipTransferReviewDialog
        open={ownershipReviewOpen}
        onOpenChange={setOwnershipReviewOpen}
        requestId={ownershipReviewId}
        onResolved={() => setOwnershipReviewId(null)}
      />
    </>
  );
}
