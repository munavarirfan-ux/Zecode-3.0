"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CandidateEditProfile, EducationEntry, EmployerEntry, SocialLink } from "@/lib/hiring/candidateProfile";
import {
  addedByLabel,
  computeTotalExperience,
  currentRoleLabel,
  hasEducationData,
  hasEmployerData,
  profileSummary,
} from "@/lib/hiring/candidateReportView";
import { getCandidateStage, normalizeSource } from "@/lib/hiring/stages";
import type { HiringCandidate, HiringJob } from "@/lib/hiring/types";
import { dashboardBentoCell, dashboardBentoGrid, dashboardBentoSpan } from "@/components/dashboard/dashboardTokens";

const overviewCanvas =
  "relative min-w-0 rounded-[14px] bg-[#FAFAFA] p-3 sm:p-4 dark:bg-[#0c0c0e]";

const overviewTexture =
  "pointer-events-none absolute inset-0 rounded-[14px] opacity-[0.35] [background-image:linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-[0.12]";

const sectionLabel =
  "text-[10px] font-semibold uppercase tracking-[0.08em] text-[#A1A1AA] dark:text-text-muted";

const sectionTitle =
  "text-[14px] font-semibold tracking-[-0.02em] text-[#18181B] dark:text-text";

const valueText = "text-[13px] font-medium leading-snug text-[#3F3F46] dark:text-text-secondary";

const primaryCard = cn(
  "flex h-full min-h-0 flex-col overflow-hidden rounded-[12px]",
  "border border-white/80 bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_6px_20px_-8px_rgba(15,23,42,0.08)]",
  "backdrop-blur-sm dark:border-white/[0.08] dark:bg-white/[0.04]",
);

const secondaryCard = cn(
  "flex h-full min-h-0 flex-col overflow-hidden rounded-[12px]",
  "border border-[rgba(15,23,42,0.05)] bg-white/75 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_4px_14px_-6px_rgba(15,23,42,0.06)]",
  "backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]",
);

const utilityCard = cn(
  "flex h-full min-h-0 flex-col overflow-hidden rounded-[12px]",
  "border border-[rgba(15,23,42,0.04)] bg-[#FCFCFD]/90 shadow-[0_1px_1px_rgba(15,23,42,0.02)]",
  "dark:border-white/[0.05] dark:bg-white/[0.02]",
);

function OverviewCard({
  title,
  children,
  variant = "secondary",
  bodyClassName,
}: {
  title: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "utility";
  bodyClassName?: string;
}) {
  const surface =
    variant === "primary" ? primaryCard : variant === "utility" ? utilityCard : secondaryCard;

  return (
    <section className={surface}>
      <header className="shrink-0 border-b border-[rgba(15,23,42,0.05)] px-3.5 py-2.5 dark:border-white/[0.05]">
        <h3 className={sectionTitle}>{title}</h3>
      </header>
      <div className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-3", bodyClassName)}>
        {children}
      </div>
    </section>
  );
}

function BentoCell({
  span,
  children,
  className,
}: {
  span?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(dashboardBentoCell, span, className)}>{children}</div>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={sectionLabel}>{label}</span>
      <span className={cn("text-right tabular-nums", valueText)}>{value || "—"}</span>
    </div>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[rgba(15,23,42,0.06)] bg-violet-50/80 px-2 py-0.5 text-[11px] font-medium text-violet-900/90 dark:border-violet-500/15 dark:bg-violet-500/10 dark:text-violet-200">
      {children}
    </span>
  );
}

function SkillChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-[rgba(15,23,42,0.05)] bg-[#F4F4F5]/90 px-2 py-0.5 text-[11px] font-medium text-[#52525B] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-text-muted">
      {children}
    </span>
  );
}

function EducationCard({ entry }: { entry: EducationEntry }) {
  return (
    <div className="rounded-[10px] border border-[rgba(15,23,42,0.05)] bg-[#FAFAFA]/80 px-3 py-2.5 dark:border-white/[0.05] dark:bg-white/[0.02]">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[13px] font-semibold text-[#18181B] dark:text-text">{entry.degree}</p>
        {entry.isHighest ? (
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
            Highest
          </span>
        ) : null}
      </div>
      {entry.details.trim() ? (
        <p className="mt-2 whitespace-pre-wrap text-[12px] leading-relaxed text-[#52525B] dark:text-text-muted">
          {entry.details}
        </p>
      ) : (
        <p className="mt-2 text-[12px] text-[#A1A1AA]">—</p>
      )}
    </div>
  );
}

function EmployerCard({ employer, isLast }: { employer: EmployerEntry; isLast?: boolean }) {
  return (
    <div
      className={cn(
        "py-2.5",
        !isLast && "border-b border-[rgba(15,23,42,0.05)] dark:border-white/[0.05]",
      )}
    >
      {employer.summary.trim() ? (
        <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#52525B] dark:text-text-muted">
          {employer.summary}
        </p>
      ) : (
        <p className="text-[12px] text-[#A1A1AA]">—</p>
      )}
    </div>
  );
}

function SocialLinkChip({ link }: { link: SocialLink }) {
  const href = link.url.trim();
  const label = link.label || "Link";
  const external = href ? (href.startsWith("http") ? href : `https://${href}`) : null;

  if (!external) {
    return (
      <span className="inline-flex h-8 items-center rounded-[9px] border border-dashed border-[rgba(15,23,42,0.1)] px-3 text-[12px] text-[#A1A1AA]">
        {label}
      </span>
    );
  }

  return (
    <a
      href={external}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 items-center gap-1.5 rounded-[9px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-[12px] font-medium text-[#52525B] shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-[rgba(15,23,42,0.12)] hover:bg-[#FAFAFA] dark:border-white/[0.08] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
    >
      {label}
      <ExternalLink className="h-3 w-3 opacity-50" strokeWidth={1.5} aria-hidden />
    </a>
  );
}

export function CandidateReportOverview({
  candidate,
  job,
  profile,
  variant = "default",
  onCandidateUpdated: _onCandidateUpdated,
}: {
  candidate: HiringCandidate;
  job: HiringJob;
  profile: CandidateEditProfile;
  variant?: "default" | "interviewer";
  onCandidateUpdated: (candidate: HiringCandidate) => void;
}) {
  const isInterviewer = variant === "interviewer";
  const education = profile.education.filter(hasEducationData);
  const employers = profile.employers.filter(hasEmployerData);
  const socialLinks = profile.socialLinks.filter((l) => l.label.trim() || l.url.trim());
  const tags = profile.application.tags;

  return (
    <div className={overviewCanvas} role="region" aria-label="Candidate overview">
      <span className={overviewTexture} aria-hidden />

      <div className={cn(dashboardBentoGrid, "relative min-w-0 gap-2.5 lg:gap-3")}>
        <BentoCell span={dashboardBentoSpan.hero}>
          <OverviewCard title="Candidate summary" variant="primary">
            <p className="text-[13px] leading-relaxed text-[#52525B] dark:text-text-muted">
              {profileSummary(profile, candidate, job.title)}
            </p>
            <dl className="mt-3 grid gap-2.5 border-t border-[rgba(15,23,42,0.05)] pt-3 sm:grid-cols-2 dark:border-white/[0.05]">
              <div>
                <dt className={sectionLabel}>Current role</dt>
                <dd className={cn("mt-1", valueText)}>{currentRoleLabel(profile.employers)}</dd>
              </div>
              <div>
                <dt className={sectionLabel}>Total experience</dt>
                <dd className={cn("mt-1", valueText)}>{computeTotalExperience(profile.employers)}</dd>
              </div>
            </dl>
            {profile.skills.length > 0 ? (
              <div className="mt-3 border-t border-[rgba(15,23,42,0.05)] pt-3 dark:border-white/[0.05]">
                <p className={sectionLabel}>Key skills</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {profile.skills.map((skill) => (
                    <SkillChip key={skill}>{skill}</SkillChip>
                  ))}
                </div>
              </div>
            ) : null}
          </OverviewCard>
        </BentoCell>

        {!isInterviewer ? (
          <BentoCell span={dashboardBentoSpan.side}>
            <OverviewCard title="Application details" variant="utility" bodyClassName="space-y-0">
              <DetailRow label="Stage" value={getCandidateStage(candidate)} />
              <DetailRow label="Sub-stage" value={profile.application.substage || candidate.currentSubstage} />
              <DetailRow label="Source" value={normalizeSource(profile.application.source)} />
              <DetailRow label="Source category" value={profile.application.sourceCategory} />
              <DetailRow label="Added by" value={addedByLabel(candidate.addedBy)} />
              <DetailRow label="Added date" value={candidate.appliedAt} />
              {tags.length > 0 ? (
                <div className="border-t border-[rgba(15,23,42,0.05)] pt-2.5 dark:border-white/[0.05]">
                  <p className={sectionLabel}>Tags</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tags.map((tag) => (
                      <TagChip key={tag}>{tag}</TagChip>
                    ))}
                  </div>
                </div>
              ) : (
                <DetailRow label="Tags" value="—" />
              )}
            </OverviewCard>
          </BentoCell>
        ) : null}

        <BentoCell span={cn(dashboardBentoSpan.half, "lg:row-span-2")}>
          <OverviewCard title="Experience" variant="secondary">
            {employers.length === 0 ? (
              <p className="text-[12px] text-[#A1A1AA]">No work experience provided.</p>
            ) : (
              <div>
                {employers.map((emp, i) => (
                  <EmployerCard key={emp.id} employer={emp} isLast={i === employers.length - 1} />
                ))}
              </div>
            )}
          </OverviewCard>
        </BentoCell>

        <BentoCell span={cn(dashboardBentoSpan.half, "lg:row-span-2")}>
          <OverviewCard title="Education" variant="secondary">
            {education.length === 0 ? (
              <p className="text-[12px] text-[#A1A1AA]">No education details provided.</p>
            ) : (
              <div className="space-y-2">
                {education.map((entry) => (
                  <EducationCard key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </OverviewCard>
        </BentoCell>

        <BentoCell span={dashboardBentoSpan.wide}>
          <OverviewCard title="Social network & web links" variant="secondary">
            {socialLinks.length === 0 ? (
              <p className="text-[12px] text-[#A1A1AA]">No links provided.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <SocialLinkChip key={link.id} link={link} />
                ))}
              </div>
            )}
          </OverviewCard>
        </BentoCell>
      </div>
    </div>
  );
}
