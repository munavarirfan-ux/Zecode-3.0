"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { markTeamInviteAcknowledged } from "@/lib/onboarding/newUserSetupProgress";
import { enableDemoWorkspace } from "@/lib/onboarding/workspaceMode";
import { cn } from "@/lib/utils";
import {
  LineArtIllustration,
  type LineArtIllustrationId,
} from "@/components/empty-states/line-art-illustrations";
import { nuxAccentGlow, nuxGlassCard, nuxGlassCardHover } from "./newUserOnboardingTokens";

type QuickStartAction = {
  label: string;
  description: string;
  illustration: LineArtIllustrationId;
} & ({ href: string } | { demo: true });

const ACTIONS: QuickStartAction[] = [
  {
    href: `${ROUTES.hiringJobs}?addJob=1`,
    label: "Create Job",
    description: "Open your first hiring workflow",
    illustration: "jobs",
  },
  {
    href: ROUTES.assessments,
    label: "Create Assessment",
    description: "Evaluate technical skills at scale",
    illustration: "assessments",
  },
  {
    href: ROUTES.usersRoles,
    label: "Invite Team",
    description: "Bring recruiters and interviewers in",
    illustration: "candidates",
  },
  {
    demo: true,
    label: "Explore Demo",
    description: "Browse with sample data",
    illustration: "welcome",
  },
];

function QuickStartCardBody({
  action,
  compact,
}: {
  action: QuickStartAction;
  compact?: boolean;
}) {
  return (
    <>
      <span className={nuxAccentGlow} aria-hidden />
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-[12px] bg-[radial-gradient(ellipse_at_50%_80%,rgba(var(--accent-rgb),0.08),transparent_70%)]",
          compact ? "h-[84px] sm:h-[92px]" : "h-[100px] rounded-[14px]",
        )}
      >
        <LineArtIllustration
          id={action.illustration}
          className={cn(
            "text-[rgb(var(--accent-rgb)/0.42)] dark:text-muted/65",
            compact ? "h-14 w-[5.5rem]" : "h-[72px] w-[120px]",
          )}
        />
      </div>
      <div className={cn("relative flex items-start justify-between gap-2.5", compact ? "mt-2.5" : "mt-3")}>
        <div className="min-w-0">
          <p
            className={cn(
              "font-semibold tracking-[-0.02em] text-text",
              compact ? "text-[14px] sm:text-[15px]" : "text-[14px]",
            )}
          >
            {action.label}
          </p>
          <p
            className={cn(
              "leading-snug text-muted",
              compact ? "mt-1 text-[12px] line-clamp-2 sm:line-clamp-none" : "mt-1 text-[12px]",
            )}
          >
            {action.description}
          </p>
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border border-[rgba(15,23,42,0.06)] bg-white/80 text-muted transition-all group-hover:border-accent/25 group-hover:bg-accent/10 group-hover:text-accent dark:border-white/[0.08] dark:bg-white/[0.06]",
            compact ? "mt-0 h-8 w-8 sm:h-9 sm:w-9" : "mt-0.5 h-8 w-8",
          )}
        >
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </>
  );
}

const cardClass = cn("group text-left", nuxGlassCard, nuxGlassCardHover);

export function NewUserQuickStartCards({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-label="Quick start" className="min-h-0">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:text-[12px]">
        Quick start
      </h2>
      <div
        className={cn(
          "nux-stagger grid sm:grid-cols-2 lg:grid-cols-4",
          compact ? "mt-2 gap-2.5 sm:mt-2.5 sm:gap-3" : "mt-3 gap-3",
        )}
      >
        {ACTIONS.map((a) =>
          "demo" in a && a.demo ? (
            <button
              key={a.label}
              type="button"
              className={cn(cardClass, compact ? "p-3.5 sm:p-4" : "p-4")}
              onClick={() => {
                enableDemoWorkspace();
                window.location.assign(ROUTES.hiringJobs);
              }}
            >
              <QuickStartCardBody action={a} compact={compact} />
            </button>
          ) : (
            <Link
              key={a.label}
              href={a.href}
              className={cn(cardClass, "block", compact ? "p-3.5 sm:p-4" : "p-4")}
              onClick={() => {
                if (a.label === "Invite Team") markTeamInviteAcknowledged();
              }}
            >
              <QuickStartCardBody action={a} compact={compact} />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
